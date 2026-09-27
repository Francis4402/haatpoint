<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Products;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    /**
     * How many rows of each kind are returned to the search dropdown.
     */
    private const PRODUCT_LIMIT = 8;

    private const CATEGORY_LIMIT = 4;

    private const STORE_LIMIT = 3;

    /**
     * Live search suggestions for the navbar / dashboard search box.
     *
     * GET /search/suggestions?q=samsung&scope=public
     *
     * `scope` is purely presentational: "dashboard" adds a set of shortcut
     * links to the dashboard sections so the same component can be reused
     * inside the dashboard header.
     */
    public function suggest(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));
        $scope = (string) $request->input('scope', 'public');
        $productLimit = (int) $request->input('limit', self::PRODUCT_LIMIT);
        $productLimit = max(1, min($productLimit, 24));

        if ($query === '') {
            return response()->json([
                'query' => '',
                'total' => 0,
                'products' => [],
                'categories' => [],
                'stores' => [],
                'quick_links' => $scope === 'dashboard' ? $this->quickLinks() : [],
                'trending' => Cache::remember('search_trending', now()->addMinutes(30), fn () => $this->trendingSearches()),
            ]);
        }

        $products = Products::with('store')
            ->visible()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('brand', 'like', "%{$query}%")
                    ->orWhere('category', 'like', "%{$query}%")
                    ->orWhere('subcategory', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->orderByRaw('CASE WHEN name LIKE ? THEN 0 WHEN brand LIKE ? THEN 1 ELSE 2 END', ["%{$query}%", "%{$query}%"])
            ->latest()
            ->limit($productLimit)
            ->get();

        $categories = Categories::where('categories', 'like', "%{$query}%")
            ->orderBy('categories')
            ->limit(self::CATEGORY_LIMIT)
            ->get();

        $stores = Store::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('storetype', 'like', "%{$query}%");
            })
            ->orderBy('name')
            ->limit(self::STORE_LIMIT)
            ->get();

        return response()->json([
            'query' => $query,
            'total' => $products->count() + $categories->count() + $stores->count(),
            'products' => $products->map(fn (Products $product) => $this->mapProduct($product))->values(),
            'categories' => $categories->map(fn (Categories $category) => [
                'name' => $category->categories,
                'image' => $category->image,
                'count' => Products::visible()->where('category', $category->categories)->count(),
            ])->values(),
            'stores' => $stores->map(fn (Store $store) => [
                'id' => $store->id,
                'name' => $store->name,
                'storetype' => $store->storetype,
                'logo' => $store->logo,
                'rating' => (float) $store->rating,
            ])->values(),
            'quick_links' => $scope === 'dashboard' ? $this->quickLinks($query) : [],
            'trending' => [],
        ]);
    }

    /**
     * Dashboard sections the query matches, used as shortcuts in the dropdown.
     */
    private function quickLinks(string $query = ''): array
    {
        $sections = [
            ['label' => 'Dashboard', 'href' => '/dashboard', 'keywords' => 'home overview stats summary'],
            ['label' => 'Products', 'href' => '/dashboard/products', 'keywords' => 'products inventory items catalogue'],
            ['label' => 'Orders', 'href' => '/dashboard/orders', 'keywords' => 'orders sales transactions'],
            ['label' => 'Stores', 'href' => '/dashboard/stores', 'keywords' => 'stores vendors sellers shops'],
            ['label' => 'Customers', 'href' => '/dashboard/customers', 'keywords' => 'customers users buyers clients'],
            ['label' => 'Categories', 'href' => '/dashboard/categories', 'keywords' => 'categories taxonomy'],
            ['label' => 'Analytics', 'href' => '/dashboard/analytics', 'keywords' => 'analytics reports charts growth'],
            ['label' => 'Messages', 'href' => '/dashboard/messages', 'keywords' => 'messages inbox support chat'],
            ['label' => 'Payments', 'href' => '/dashboard/payments', 'keywords' => 'payments billing invoices money'],
            ['label' => 'Shipping', 'href' => '/dashboard/shipping', 'keywords' => 'shipping delivery courier track'],
        ];

        if ($query === '') {
            return array_slice($sections, 0, 5);
        }

        $needle = mb_strtolower($query);

        return array_values(array_filter(
            $sections,
            fn (array $section) => str_contains(mb_strtolower($section['label']), $needle)
                || str_contains(mb_strtolower($section['keywords']), $needle)
        ));
    }

    /**
     * Category names offered as suggestions before anything is typed.
     */
    private function trendingSearches(): array
    {
        return Categories::orderBy('categories')
            ->limit(8)
            ->pluck('categories')
            ->map(fn (string $name) => ['label' => $name, 'href' => route('products.index', ['category' => $name])])
            ->values()
            ->all();
    }

    /**
     * Reduce a product to the handful of fields the dropdown needs.
     */
    private function mapProduct(Products $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'image' => $this->firstImage($product->images),
            'regular_price' => (float) $product->regular_price,
            'sale_price' => $product->sale_price === null ? null : (float) $product->sale_price,
            'category' => $product->category,
            'subcategory' => $product->subcategory,
            'brand' => $product->brand,
            'inStock' => (bool) $product->inStock,
            'product_type' => $product->product_type,
            'store_name' => $product->store?->name,
            'href' => route('products.details', $product->slug),
        ];
    }

    /**
     * Products store their images as a JSON encoded string[] of storage paths.
     */
    private function firstImage(?string $images): ?string
    {
        if (! $images) {
            return null;
        }

        $decoded = json_decode($images, true);

        if (! is_array($decoded) || $decoded === []) {
            return null;
        }

        $path = (string) ($decoded[0] ?? '');

        if ($path === '') {
            return null;
        }

        return str_starts_with($path, 'http') || str_starts_with($path, '/')
            ? $path
            : '/storage/' . $path;
    }
}
