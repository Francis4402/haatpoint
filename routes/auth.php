<?php

use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\AgentAuthController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SuperadminAuthController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth:web,superadmin,admin,agent')->group(function () {
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

// Email verification.
//
// Scoped to `auth:web,agent` on purpose. Only User and Agent implement
// MustVerifyEmail; Admin and Superadmin have no verification step, so allowing
// them here would let a staff account open a page that asks it to verify an
// address it never had to confirm.
Route::middleware('auth:web,agent')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Superadmin bootstrap registration (its login shares the admin login below)
Route::prefix('superadmin')->name('superadmin.')->group(function () {
    // No guest:admin middleware here, unlike the admin group below. A signed-in
    // superadmin has to be able to reach this page to register another one, and
    // guest:admin would bounce them straight off it. Access is decided by
    // SuperadminAuthController::canRegister() instead, which keeps the page
    // closed to anonymous visitors once a superadmin exists.
    Route::get('register', [SuperadminAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [SuperadminAuthController::class, 'register']);
    Route::get('login', fn () => redirect()->route('admin.login'))->name('login');
});

Route::prefix('superadmin')->name('superadmin.')->group(function () {
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');
});

// Shared admin + superadmin login/registration (both live in the admins table).
// The register route is open only until a superadmin exists (bootstraps it).
Route::middleware('guest:admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('register', [AdminAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AdminAuthController::class, 'register']);
    Route::get('login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login']);
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');
});

// Agent registration (agent LOGIN uses the default /login page)
Route::middleware('guest:agent')->prefix('agent')->name('agent.')->group(function () {
    Route::get('register', [AgentAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AgentAuthController::class, 'register']);
    Route::get('login', fn () => redirect()->route('login'))->name('login');
});

Route::prefix('agent')->name('agent.')->group(function () {
    Route::post('logout', [AgentAuthController::class, 'logout'])->name('logout');
});
