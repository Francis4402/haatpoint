<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'name';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $field = $field ?? $this->getRouteKeyName();

        if ($field !== 'name') {
            return $this->where($field, $value)->first();
        }

        // 1. Direct name match
        $store = $this->where('name', $value)->first();
        if ($store) {
            return $store;
        }

        // 2. URL-decoded name match
        $decoded = urldecode((string) $value);
        if ($decoded !== $value) {
            $store = $this->where('name', $decoded)->first();
            if ($store) {
                return $store;
            }
        }

        // 3. Case-insensitive / hyphenated match
        $store = $this->whereRaw('LOWER(name) = ?', [strtolower((string) $value)])
            ->orWhereRaw('LOWER(name) = ?', [strtolower($decoded)])
            ->orWhereRaw('LOWER(name) = ?', [strtolower(str_replace('-', ' ', (string) $value))])
            ->orWhereRaw('LOWER(REPLACE(name, " ", "-")) = ?', [strtolower((string) $value)])
            ->first();
        if ($store) {
            return $store;
        }

        // 4. Fallback by UUID
        if (\Illuminate\Support\Str::isUuid((string) $value)) {
            return $this->where('id', $value)->first();
        }

        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Products::class, 'store_id', 'id');
    }

    /**
     * Reviews written about the store itself, as opposed to reviews of the
     * products it sells. A store review is the row with store_id set and
     * product_id left null, which is what the store page and the store review
     * form rely on.
     */
    public function reviews()
    {
        return $this->hasMany(Comments::class, 'store_id', 'id')
            ->whereNull('product_id');
    }

    /**
     * Recomputes the denormalised rating and review_count columns from the
     * store's own reviews.
     *
     * The stores table caches both values so the directory and every store card
     * can render a rating without a per-store aggregate query. They have to be
     * rewritten whenever a review is added, edited or removed, otherwise the
     * cached average drifts away from the comments table and the page shows a
     * rating that no longer matches the reviews behind it.
     */
    public function syncRatingSummary(): void
    {
        $summary = $this->reviews()
            ->whereNotNull('rating')
            ->selectRaw('COUNT(*) as review_total, AVG(rating) as rating_average')
            ->first();

        $count = (int) ($summary->review_total ?? 0);

        $this->forceFill([
            'rating' => $count > 0 ? round((float) $summary->rating_average, 2) : 0,
            'review_count' => $count,
        ])->save();
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'user_id');
    }

    public function getAuthorNameAttribute()
    {
        if ($this->relationLoaded('agent') && $this->agent) {
            return $this->agent->name;
        }
        if ($this->relationLoaded('admin') && $this->admin) {
            return $this->admin->name;
        }
        if ($this->relationLoaded('user') && $this->user) {
            return $this->user->name;
        }

        // Avoid triggering N+1 queries when relations are not eager-loaded
        return 'Unknown';
    }

    protected $appends = ['author_name'];
}
