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

    /**
     * Brand protection accessor: rewrite supplier image URLs to HaatPoint edge-cached media proxy.
     */
    public function getImagesAttribute($value)
    {
        if (empty($value) || !is_string($value)) {
            return $value;
        }

        if (!str_contains($value, 'shopbasebd.com')) {
            return $value;
        }

        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            $replaced = array_map(function ($item) {
                if (is_string($item) && str_contains($item, 'shopbasebd.com')) {
                    $fn = basename(parse_url($item, PHP_URL_PATH));
                    if (preg_match('/_S_(\d+)\.jpg$/i', $fn)) {
                        $fn = preg_replace('/_S_(\d+)\.jpg$/i', '_L_$1.jpeg', $fn);
                    }
                    return 'https://www.haatpoint.com/product-media/' . $fn;
                }
                return $item;
            }, $decoded);
            return json_encode($replaced, JSON_UNESCAPED_SLASHES);
        }

        $fn = basename(parse_url($value, PHP_URL_PATH));
        if (preg_match('/_S_(\d+)\.jpg$/i', $fn)) {
            $fn = preg_replace('/_S_(\d+)\.jpg$/i', '_L_$1.jpeg', $fn);
        }
        return 'https://www.haatpoint.com/product-media/' . $fn;
    }

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
     * Boost products for catalog sorting.
     */
    public function scopeWithProBoost($query)
    {
        return $query->latest();
    }

    public function scopeVisible($query)
    {
        return $query->where('is_active', true)
            ->where('is_blocked', false);
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
