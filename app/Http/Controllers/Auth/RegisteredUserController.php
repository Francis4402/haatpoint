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
            'phone' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
            'address' => ['required', 'string', 'max:500'],
            'city_id' => ['required', 'integer'],
            'city_name' => ['nullable', 'string', 'max:100'],
            'zone_id' => ['required', 'integer'],
            'zone_name' => ['nullable', 'string', 'max:100'],
            'area_id' => ['nullable', 'integer'],
            'area_name' => ['nullable', 'string', 'max:100'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // The form has always offered a picture, but the field was never
            // read here, so the uploaded file was dropped on the floor and
            // users.images stayed NULL for every self-registered account.
            'image' => $this->profileImageRules(),
        ], [
            'phone.required' => 'Phone number is required for delivery.',
            'phone.regex' => 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678).',
            'city_id.required' => 'Please select your delivery city.',
            'zone_id.required' => 'Please select your delivery zone.',
            'address.required' => 'Delivery address is required so courier can deliver your orders.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city_id' => $request->city_id,
            'city_name' => $request->city_name,
            'zone_id' => $request->zone_id,
            'zone_name' => $request->zone_name,
            'area_id' => $request->area_id,
            'area_name' => $request->area_name,
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
