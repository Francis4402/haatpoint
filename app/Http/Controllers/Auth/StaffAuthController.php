<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Rules\GmailAddress;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

abstract class StaffAuthController extends Controller
{
    /**
     * The guard name used by this role.
     */
    abstract protected function guard(): string;

    /**
     * The model class used by this role.
     */
    abstract protected function model(): string;

    /**
     * The role key rendered into Inertia pages.
     */
    abstract protected function roleKey(): string;

    /**
     * Whether the role's table stores the role in a column.
     */
    protected function roleColumn(): bool
    {
        return false;
    }

    /**
     * The role stored when a role-column table is used. Defaults to the
     * role key; override to force a different role on registration.
     */
    protected function registrationRole(): ?string
    {
        return null;
    }

    /**
     * The Socialite destination this register page should send the visitor to.
     *
     * It cannot just be the role key. `SocialiteController::DESTINATIONS`
     * decides whether Google may CREATE a brand-new account for a destination,
     * and `admin` is create=false because staff are normally promoted by an
     * existing superadmin. So the register page was asking Google for
     * `destination=admin`, every callback found no row, and the visitor was
     * always told to "ask a superadmin to promote you" -- on the very page
     * whose password form bootstraps the first superadmin. Roles that register
     * a new identity through Google override this.
     */
    protected function socialDestination(): string
    {
        return $this->roleKey();
    }

    /**
     * Hook after a role account has been created. Default no-op; roles may
     * override to, e.g., remove a conflicting customer account.
     */
    protected function afterRegistration(Request $request): void
    {
    }

    /**
     * Extra validation rules specific to this role's registration.
     */
    protected function registrationRules(): array
    {
        return [];
    }

    /**
     * Extra attributes saved during registration specific to this role.
     */
    protected function registrationData(Request $request): array
    {
        return [];
    }

    /**
     * Whether self-registration is allowed for this role.
     */
    protected function canRegister(): bool
    {
        return true;
    }

    /**
     * The message shown when registration is closed for this role.
     */
    protected function registrationClosedMessage(): string
    {
        return 'Registration is closed for this role.';
    }

    /**
     * Display the registration view.
     */
    public function showRegister(): Response|RedirectResponse
    {
        if (! $this->canRegister()) {
            return redirect()->route($this->guard() . '.login')
                ->with('error', $this->registrationClosedMessage());
        }

        return Inertia::render('Auth/StaffRegister', [
            'type' => $this->roleKey(),
            'socialDestination' => $this->socialDestination(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function register(Request $request): RedirectResponse
    {
        if (! $this->canRegister()) {
            throw ValidationException::withMessages([
                'email' => $this->registrationClosedMessage(),
            ]);
        }

        $model = $this->model();

        $request->validate(array_merge([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . $model, new GmailAddress],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], $this->registrationRules()));

        $data = array_merge([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ], $this->registrationData($request));

        if ($this->roleColumn()) {
            $data['role'] = $this->registrationRole() ?? $this->roleKey();
        }

        $user = $model::create($data);

        $this->afterRegistration($request);

        event(new Registered($user));

        Auth::guard($this->guard())->login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Display the login view.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Auth/StaffLogin', [
            'type' => $this->roleKey(),
            'status' => session('status'),
            'canRegister' => $this->canRegister(),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * @throws ValidationException
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $key = Str::transliterate(Str::lower($request->string('email')) . '|' . $request->ip());

        $model = $this->model();
        $account = $model::where('email', $request->string('email'))->first();

        if ($account && $account->blocked) {
            throw ValidationException::withMessages([
                'email' => 'This account has been blocked. Please contact support for assistance.',
            ]);
        }

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        if (! Auth::guard($this->guard())->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($key);

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($key);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard($this->guard())->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}