<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    /** @use HasFactory<\Database\Factories\ProductsFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'is_blocked' => 'boolean',
        'inStock' => 'boolean',
    ];

    protected $appends = ['is_pro_seller'];

    public function getIsProSellerAttribute(): bool
    {
        if ($this->relationLoaded('store') && $this->store) {
            $agent = $this->store->relationLoaded('agent') ? $this->store->agent : null;
            if ($agent && method_exists($agent, 'isPro')) {
                return $agent->isPro();
            }
        }
        return false;
    }

    /**
     * Boost products owned by active Pro agents so they appear first and more often.
     */
    public function scopeWithProBoost($query)
    {
        $now = now()->toDateTimeString();
        return $query->orderByDesc(
            \Illuminate\Support\Facades\DB::raw("(SELECT CASE WHEN agents.plan = 'pro' AND agents.subscription_ends_at > '{$now}' THEN 1 ELSE 0 END 
                       FROM stores 
                       INNER JOIN agents ON agents.id = stores.agent_id 
                       WHERE stores.id = products.store_id 
                       LIMIT 1)")
        );
    }

    public function scopeVisible($query)
    {
        return $query->where('is_active', true)
            ->where('is_blocked', false)
            ->whereHas('store', fn ($q) => $q->where('is_active', true));
    }

    public function reviews()
    {
        return $this->hasMany(Reviews::class, 'product_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'product_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'user_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'product_id', 'id');
    }

    public function wishlistedBy()
    {
        return $this->hasMany(Wishlist::class);
    }
}
