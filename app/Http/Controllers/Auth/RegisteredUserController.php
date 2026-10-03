<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\User;
use App\Rules\GmailAddress;
use App\Traits\StoresProfileImage;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    use StoresProfileImage;

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class, new GmailAddress, function ($attribute, $value, $fail) {
                if (Agent::where('email', $value)->exists()) {
                    $fail('This email is already registered as an agent and cannot be used to create a customer account.');
                }
            }],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // The form has always offered a picture, but the field was never
            // read here, so the uploaded file was dropped on the floor and
            // users.images stayed NULL for every self-registered account.
            'image' => $this->profileImageRules(),
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'images' => $this->storeProfileImage($request->file('image')),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // The account exists and is signed in either way. Only the email failed,
        // so say so plainly instead of implying the link is already on its way.
        if ($user->verificationMailFailed) {
            return redirect(route('dashboard', absolute: false))
                ->with('error', $user->verificationMailFailureMessage());
        }

        return redirect(route('dashboard', absolute: false));
    }
}
