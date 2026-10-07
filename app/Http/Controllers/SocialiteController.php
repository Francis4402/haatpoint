<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use App\Traits\ClearsOtherGuards;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    use ClearsOtherGuards;

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
     * "resolves" lists the destinations to probe, in priority order, before
     * falling back to creating a new account for this one. It exists because a
     * single page (/login) is shared by customers and agents, so the callback
     * cannot assume which role the visitor holds.
     *
     * Agent is probed first so an agent is never shadowed by a customer row for
     * the same address. Without this, "Continue with Google" on the shared login
     * looked only in the users table, found no row (agent registration deletes
     * it on purpose) and created a brand new customer account -- signing the
     * agent in as a user and leaving the two rows behind.
     *
     * @var array<string, array{model: class-string, guard: string, create: bool, exclusive: bool, resolves?: array<int, string>}>
     */
    public const DESTINATIONS = [
        'user' => [
            'model' => User::class,
            'guard' => 'web',
            'create' => true,
            'exclusive' => false,
            'resolves' => ['agent', 'user'],
        ],
        'superadmin' => ['model' => Admin::class, 'guard' => 'admin', 'create' => true, 'exclusive' => true],
        'admin' => ['model' => Admin::class, 'guard' => 'admin', 'create' => false, 'exclusive' => false],
        'agent' => ['model' => Agent::class, 'guard' => 'agent', 'create' => true, 'exclusive' => false],
    ];

    /**
     * Whether an account already exists for this provider identity.
     *
     * Mirrors the lookup the callback performs, so a resolved destination and a
     * directly requested one agree on what "already exists" means.
     */
    private function identityExists(string $model, string $email, string $provider, string $providerId): bool
    {
        return $model::query()
            ->where('email', $email)
            ->orWhere(fn ($q) => $q->where('provider', $provider)->where('provider_id', $providerId))
            ->exists();
    }

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

            // A surface shared by more than one role cannot assume which table
            // holds the visitor, so the role is resolved from the email before
            // anything is looked up or created. See DESTINATIONS['user'].
            $resolved = $destination;

            foreach ($config['resolves'] ?? [] as $candidate) {
                if ($this->identityExists(self::DESTINATIONS[$candidate]['model'], $email, $provider, $providerId)) {
                    $resolved = $candidate;
                    break;
                }
            }

            $config = self::DESTINATIONS[$resolved];
            $model = $config['model'];

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
                // An exclusive destination may bootstrap only once. The register
                // page is the first gate, but a caller can reach this callback
                // directly with a hand-set session, so the same rule has to be
                // enforced here as well.
                //
                // A signed-in superadmin is exempt: they are already the holder of
                // the role, so letting them add another is not an escalation, and
                // it is the only way an existing superadmin can bring in a second
                // one through Google. Everyone else is refused, which keeps the
                // public register URL from being an open invitation.
                if ($config['exclusive'] && $model::where('role', 'superadmin')->exists()) {
                    $actor = $request->user() ?? auth('admin')->user();

                    if (! $actor instanceof Admin || $actor->role !== 'superadmin' || $actor->blocked) {
                        throw new \RuntimeException('A superadmin already exists. Registration is closed.');
                    }
                }

                // Each table's `role` column is NOT NULL, so only set it when the
                // destination actually needs a specific value and let the column
                // default supply 'user' / 'agent' / 'admin' otherwise. Writing an
                // explicit null here fails with a 1048 integrity error.
                $role = match ($resolved) {
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
                if ($resolved === 'agent') {
                    User::where('email', $email)->delete();
                }
            } else {
                throw new \RuntimeException(
                    "No {$destination} account exists for {$email}. Ask a superadmin to promote you."
                );
            }

            // Any session the visitor already held -- most often the customer
            // one -- has to go first, or ResolveAuthGuard keeps answering web.
            $this->loginOnGuard($config['guard'], $identity);
            $request->session()->regenerate();

            // Logged on success too. Only failures were ever recorded, so a
            // working flow and a visitor who never got as far as clicking were
            // indistinguishable in the log.
            // Records the role that was actually used, not the one the page asked
            // for, so a sign-in that resolved from user to agent is traceable.
            Log::info("Social login succeeded ({$provider} -> {$resolved})", [
                'account_id' => $identity->getKey(),
                'role' => $identity->role ?? null,
                'guard' => $config['guard'],
                'requested' => $destination,
            ]);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Throwable $e) {
            Log::warning("Social login failed ({$provider} -> {$destination}): " . $e->getMessage());

            return redirect()->route($loginRoute)
                ->with('error', 'Social login failed. ' . $e->getMessage());
        }
    }
}
