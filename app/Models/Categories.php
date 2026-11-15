<?php

namespace App\Models;

use App\Support\CategoryCatalog;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    /**
     * Statically return all curated categories without requiring database seeds.
     */
    public static function all($columns = ['*'])
    {
        return CategoryCatalog::all();
    }

    public static function get($columns = ['*'])
    {
        return CategoryCatalog::all();
    }
}
