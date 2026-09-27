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

    public function scopeVisible($query)
    {
        return $query->whereHas('store', fn ($q) => $q->where('is_active', true));
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
