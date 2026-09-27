<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Wishlist extends Model
{
    /** @use HasFactory<\Database\Factories\WishlistFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'agent_id',
        'product_id',
    ];

    /**
     * Customers live in `users` and vendors in `agents`, so a wishlist row is
     * keyed by whichever table the current session actually came from. Reading
     * Auth::id() alone returns the agent's id, which the users foreign key
     * rejects, so every lookup has to go through here instead.
     *
     * @return array{user_id: string|null, agent_id: string|null}
     */
    public static function currentOwner(): array
    {
        if ($user = Auth::guard('web')->user()) {
            return ['user_id' => $user->id, 'agent_id' => null];
        }

        if ($agent = Auth::guard('agent')->user()) {
            return ['user_id' => null, 'agent_id' => $agent->id];
        }

        return ['user_id' => null, 'agent_id' => null];
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

        // Signed out: match nothing rather than leaking every row.
        return $query->whereRaw('1 = 0');
    }

    public static function isSignedIn(): bool
    {
        $owner = self::currentOwner();

        return $owner['user_id'] !== null || $owner['agent_id'] !== null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
