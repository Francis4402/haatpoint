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

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'blocked' => 'boolean',
        ];
    }
}