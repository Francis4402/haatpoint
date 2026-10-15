<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Agents do not verify their email address: no verification link is sent on
 * registration and the account is never held back for confirmation, so the
 * model deliberately does not implement MustVerifyEmail. Their only onboarding
 * gate is the vendor KYC profile (see missingVendorProfileFields()).
 */
class Agent extends Authenticatable
{
    use HasUuids, Notifiable;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getRoleAttribute(): string
    {
        return $this->attributes['role'] ?? 'agent';
    }

    /**
     * The KYC fields a vendor must supply before their store can be used.
     *
     * Ordered so the profile page and the dashboard banner list them in the
     * order the form asks for them, rather than in column order.
     */
    public static function vendorProfileFields(): array
    {
        return [
            'name' => 'Full name',
            'mobile' => 'Mobile number',
            'national_id' => 'National ID',
            'address' => 'Address',
        ];
    }

    /**
     * Which required KYC fields are still missing or malformed.
     *
     * Validation lives here rather than only in the form request because the
     * answer is needed in three places that never run the request: the store
     * guard, the shared Inertia props, and the dashboard banner. Duplicating
     * these rules is how the banner and the guard end up disagreeing.
     *
     * Mobile is checked against the 013-019 allocation rather than just a
     * length, so a 11-digit typo is reported now instead of failing at
     * checkout.
     */
    public function missingVendorProfileFields(): array
    {
        $missing = [];

        if (!$this->national_id || !preg_match('/^\d{10}$|^\d{17}$/', (string) $this->national_id)) {
            $missing[] = 'national_id';
        }

        if (!$this->mobile || !preg_match('/^01[3-9]\d{8}$/', (string) $this->mobile)) {
            $missing[] = 'mobile';
        }

        if (!$this->address || trim((string) $this->address) === '') {
            $missing[] = 'address';
        }

        if (!$this->name || trim((string) $this->name) === '') {
            $missing[] = 'name';
        }

        return $missing;
    }

    public function hasCompleteVendorProfile(): bool
    {
        return $this->missingVendorProfileFields() === [];
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'blocked' => 'boolean',
            'subscription_ends_at' => 'datetime',
            'subscription_payment_submitted_at' => 'datetime',
            'subscription_payment_amount' => 'decimal:2',
        ];
    }

    /**
     * The agent's subscription plan: 'free' or 'pro'.
     */
    public function getPlanAttribute(): string
    {
        return $this->attributes['plan'] ?? 'free';
    }

    /**
     * Whether the subscription is currently active (not expired).
     */
    public function isSubscriptionActive(): bool
    {
        if (! $this->subscription_ends_at) {
            return false;
        }

        return $this->subscription_ends_at->isFuture();
    }

    /**
     * Whether the subscription has expired.
     */
    public function isSubscriptionExpired(): bool
    {
        if (! $this->subscription_ends_at) {
            return true;
        }

        return $this->subscription_ends_at->isPast();
    }

    /**
     * True if the agent is on the Pro plan and subscription is active.
     */
    public function isPro(): bool
    {
        return $this->plan === 'pro' && $this->isSubscriptionActive();
    }

    /**
     * The agent's plan is the Pro one but a bKash payment is still waiting for
     * a superadmin to approve it. These agents are sent to the payment page
     * rather than the generic upgrade prompt.
     */
    public function hasPendingSubscriptionPayment(): bool
    {
        return $this->subscription_payment_status === 'pending';
    }

    /**
     * A bKash transaction id has been submitted at some point (pending or
     * already reviewed) and is worth showing to the superadmin.
     */
    public function hasSubscriptionPayment(): bool
    {
        return in_array($this->subscription_payment_status, ['pending', 'approved', 'rejected'], true);
    }
}