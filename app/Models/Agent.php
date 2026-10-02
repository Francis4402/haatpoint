<?php

namespace App\Models;

use App\Traits\SendsVerificationEmailSafely;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Agent extends Authenticatable implements MustVerifyEmail
{
    use HasUuids, Notifiable, SendsVerificationEmailSafely;

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
        ];
    }
}