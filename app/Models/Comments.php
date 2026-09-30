<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comments extends Model
{
    /** @use HasFactory<\Database\Factories\CommentsFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'agent_id',
        'admin_id',
        'product_id',
        'store_id',
        'comment',
        'rating'
    ];

    /**
     * Customers live in `users`, vendors in `agents` and staff in `admins`, so a
     * comment is keyed by whichever table the current session actually came
     * from. Reading Auth::id() alone returns null for the `agent` and `admin`
     * guards, which the NOT NULL user_id column rejects, so every lookup has to
     * go through here instead.
     *
     * @return array{user_id: string|null, agent_id: string|null, admin_id: string|null}
     */
    public static function currentOwner(): array
    {
        if ($user = Auth::guard('web')->user()) {
            return ['user_id' => $user->id, 'agent_id' => null, 'admin_id' => null];
        }

        if ($agent = Auth::guard('agent')->user()) {
            return ['user_id' => null, 'agent_id' => $agent->id, 'admin_id' => null];
        }

        if ($admin = Auth::guard('admin')->user()) {
            return ['user_id' => null, 'agent_id' => null, 'admin_id' => $admin->id];
        }

        // The `superadmin` guard shares the admins provider, so it resolves to
        // the same table. Login normally uses `admin`, but the comment routes
        // also accept this guard.
        if ($superadmin = Auth::guard('superadmin')->user()) {
            return ['user_id' => null, 'agent_id' => null, 'admin_id' => $superadmin->id];
        }

        return ['user_id' => null, 'agent_id' => null, 'admin_id' => null];
    }

    public function scopeForOwner(Builder $query, ?array $owner = null): Builder
    {
        $owner ??= self::currentOwner();

        if ($owner['user_id']) {
            return $query->where('user_id', $owner['user_id']);
        }

        if ($owner['agent_id']) {
            return $query->where('agent_id', $owner['agent_id']);
        }

        if ($owner['admin_id']) {
            return $query->where('admin_id', $owner['admin_id']);
        }

        // Signed out: match nothing rather than leaking every row.
        return $query->whereRaw('1 = 0');
    }

    public static function isSignedIn(): bool
    {
        $owner = self::currentOwner();

        return $owner['user_id'] !== null
            || $owner['agent_id'] !== null
            || $owner['admin_id'] !== null;
    }

    /**
     * The account that wrote this comment, whichever table it came from.
     */
    public function author()
    {
        return $this->user
            ?? $this->agent
            ?? $this->admin;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
