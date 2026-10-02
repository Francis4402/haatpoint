<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Allowed OAuth providers.
     *
     * @var array<int, string>
     */
    public const PROVIDERS = ['google'];

    /**
     * Every login/registration surface maps to a destination model + guard.
     * "create" allows the flow to register a brand new account, "exclusive"
     * means only a single account may ever exist for that destination.
     *
     * @var array<string, array{model: class-string, guard: string, create: bool, exclusive: bool}>
     */
    public const DESTINATIONS = [
        'user' => ['model' => User::class, 'guard' => 'web', 'create' => true, 'exclusive' => false],
        'superadmin' => ['model' => Admin::class, 'guard' => 'admin', 'create' => true, 'exclusive' => true],
        'admin' => ['model' => Admin::class, 'guard' => 'admin', 'create' => false, 'exclusive' => false],
        'agent' => ['model' => Agent::class, 'guard' => 'agent', 'create' => true, 'exclusive' => false],
    ];

    /**
     * Redirect the user to the chosen OAuth provider, remembering where the
     * flow started so the callback can authenticate the right identity.
     */
    public function redirect(Request $request, string $provider, string $destination = 'user')
    {
        abort_unless(in_array($provider, self::PROVIDERS, true), 404);
        abort_unless(array_key_exists($destination, self::DESTINATIONS), 404);

        $request->session()->put('socialite_destination', $destination);

        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver($provider);

        // Google rejects a redirect_uri that is not byte-identical to one of the
        // ones registered in the console. The configured value must win,
        // because the request host is not trustworthy here: reaching the app as
        // http://localhost:8000 instead of http://127.0.0.1:8000, or via a LAN
        // IP, builds a different URL and Google answers Error 400
        // redirect_uri_mismatch with nothing logged on our side. Fall back to
        // route() only when nothing is configured.
        $configured = config("services.{$provider}.redirect");

        if ($configured) {
            $driver->redirectUrl($configured);
        } else {
            $driver->redirectUrl(route('auth.callback', ['provider' => $provider]));
        }

        return $driver->redirect();
    }

    /**
     * Handle the OAuth callback.
     */
    public function callback(Request $request, string $provider)
    {
        abort_unless(in_array($provider, self::PROVIDERS, true), 404);

        $destination = (string) $request->session()->pull('socialite_destination', 'user');
        abort_unless(array_key_exists($destination, self::DESTINATIONS), 404);

        $loginRoute = $destination === 'user' ? 'login' : $destination . '.login';

        try {
            $socialUser = Socialite::driver($provider)->user();
            $email = $socialUser->getEmail();

            if (! $email) {
                throw new \RuntimeException('This provider did not return an email address.');
            }

            $email = Str::lower($email);
            $config = self::DESTINATIONS[$destination];
            $model = $config['model'];
            $providerId = (string) $socialUser->getId();

            $identity = $model::query()
                ->where('email', $email)
                ->orWhere(fn ($q) => $q->where('provider', $provider)->where('provider_id', $providerId))
                ->first();

            if ($identity) {
                // A blocked account must stay blocked. The password login path
                // checks this, and the `blocked` middleware checks it again on
                // every request, but Google had no check of its own, so a blocked
                // admin could still be signed straight in through OAuth.
                if ($identity->blocked) {
                    throw new \RuntimeException('This account has been blocked. Please contact support for assistance.');
                }

                $identity->forceFill([
                    'email_verified_at' => $identity->email_verified_at ?? now(),
                ]);

                if ($identity->provider !== $provider || $identity->provider_id !== $providerId) {
                    $identity->forceFill([
                        'google_id' => $provider === 'google' ? $providerId : $identity->google_id,
                        'provider' => $provider,
                        'provider_id' => $providerId,
                    ])->save();
                } else {
                    $identity->save();
                }
            } elseif ($config['create']) {
                if ($config['exclusive'] && $model::where('role', 'superadmin')->exists()) {
                    throw new \RuntimeException('A superadmin already exists. Registration is closed.');
                }

                // Each table's `role` column is NOT NULL, so only set it when the
                // destination actually needs a specific value and let the column
                // default supply 'user' / 'agent' / 'admin' otherwise. Writing an
                // explicit null here fails with a 1048 integrity error.
                $role = match ($destination) {
                    'superadmin' => 'superadmin',
                    'admin' => 'admin',
                    default => null,
                };

                $attributes = [
                    'name' => $socialUser->getName() ?? $email,
                    'email' => $email,
                    'password' => Hash::make(Str::random(24)),
                    'images' => $socialUser->getAvatar(),
                    'google_id' => $provider === 'google' ? $providerId : null,
                    'provider' => $provider,
                    'provider_id' => $providerId,
                    'email_verified_at' => now(),
                ];

                if ($role !== null) {
                    $attributes['role'] = $role;
                }

                $identity = $model::create($attributes);

                // An agent is a single identity. The email registration flow
                // (AgentAuthController::afterRegistration) drops a customer
                // account that used the same email, so the Socialite flow must
                // do the same instead of leaving the address in both tables.
                if ($destination === 'agent') {
                    User::where('email', $email)->delete();
                }
            } else {
                throw new \RuntimeException(
                    "No {$destination} account exists for {$email}. Ask a superadmin to promote you."
                );
            }

            Auth::guard($config['guard'])->login($identity);
            $request->session()->regenerate();

            // Logged on success too. Only failures were ever recorded, so a
            // working flow and a visitor who never got as far as clicking were
            // indistinguishable in the log.
            Log::info("Social login succeeded ({$provider} -> {$destination})", [
                'account_id' => $identity->getKey(),
                'role' => $identity->role ?? null,
                'guard' => $config['guard'],
            ]);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Throwable $e) {
            Log::warning("Social login failed ({$provider} -> {$destination}): " . $e->getMessage());

            return redirect()->route($loginRoute)
                ->with('error', 'Social login failed. ' . $e->getMessage());
        }
    }
}
