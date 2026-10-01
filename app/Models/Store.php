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
        return $this->agent?->name
            ?? $this->admin?->name
            ?? $this->user?->name
            ?? 'Unknown';
    }

    protected $appends = ['author_name'];
}
