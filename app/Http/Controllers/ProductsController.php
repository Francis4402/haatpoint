<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Admin;
use App\Models\Products;
use Illuminate\Http\Request;
use App\Models\Categories;
use App\Models\Comments;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user instanceof Agent) {
            $products = Products::whereIn('store_id', $this->roleStores($user)->pluck('id'))->get();
            $store = $this->roleStore($user);
        } elseif ($user instanceof Admin) {
            $products = Products::orderBy('created_at', 'desc')->get();
            $store = $this->roleStore($user);
        } else {
            $products = Products::where('user_id', Auth::id())->get();
            $store = Store::where('user_id', Auth::id())->first();
        }

        return Inertia::render('dashboard/products/index', [
            'products' => $products,
            'store' => $store,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $stores = $this->roleStores(Auth::user());

        // The form reads store.id, so handing it a null crashed the page. Send
        // the seller to the store list instead of rendering a broken form.
        if ($stores->isEmpty()) {
            return redirect()->route('dashboard.store')
                ->with('error', 'Create a store before adding products.');
        }

        return Inertia::render('dashboard/forms/CreateProductForm', [
            'stores' => $stores,
            'store' => $stores->first(),
            'categories' => Categories::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $stores = $this->roleStores($user);

        if ($stores->isEmpty()) {
            return redirect()->back()->withErrors([
                'store_id' => 'You need to create a store first before adding products.'
            ]);
        }

        // An agent may own up to three stores, so the form now offers a picker.
        // store_id stays optional: a request without one falls back to the
        // first store rather than failing.
        $requestedStore = $request->input('store_id');

        if ($requestedStore && ! $this->canUseStore($user, $requestedStore)) {
            return redirect()->back()->withInput()->withErrors([
                'store_id' => 'You can only add products to one of your own stores.',
            ]);
        }

        $store = ($requestedStore ? $stores->firstWhere('id', $requestedStore) : null) ?? $stores->first();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',   // ✅ validate slug
            'store_id' => ['nullable', Rule::exists('stores', 'id')],
            'category' => 'required|string|max:255',
            'subcategory' => 'nullable|string',                          // ✅ nullable
            'brand' => 'nullable|string',                                // ✅ nullable
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0|max:1000000',
            'sale_price' => 'nullable|numeric|min:0|max:1000000|lt:regular_price',
            'description' => 'required|string',
            'inStock' => 'nullable',
            'color' => 'nullable|max:1000',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images' => 'max:5',
            'item_weight' => 'required|numeric|min:0.1',
            'product_type' => 'required|in:regular,featured,trending,top-selling,new-arrival',
        ]);

        $product = new Products();
        $product->user_id = $user->id;
        $product->store_id = $store->id;
        $product->name = $validated['name'];
        $product->slug = Str::slug($validated['name']) . '-' . time();                             // ✅ USE AS-IS
        $product->category = $validated['category'];
        $product->subcategory = $validated['subcategory'] ?? '';         // ✅ empty fallback
        $product->brand = $validated['brand'] ?? '';                     // ✅ empty fallback
        $product->quantity = (int) $validated['quantity'];
        $product->regular_price = (float) $validated['regular_price'];
        $product->sale_price = isset($validated['sale_price']) && $validated['sale_price'] !== ''
            ? (float) $validated['sale_price']
            : null;                                                       // ✅ handle empty string
        $product->description = $validated['description'];
        $product->color = $validated['color'] ?? '[]';
        $product->inStock = $request->boolean('inStock', true);
        $product->item_weight = $validated['item_weight'];
        $product->product_type = $validated['product_type'] ?? 'regular';

        if ($request->hasFile('images')) {
            $images = [];
            $directory = 'product_images';

            foreach ($request->file('images') as $index => $file) {
                $filename = 'product_' . time() . '_' . $index . '_' . Str::random(10) . '.jpg';
                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($file->getRealPath());
                $img->scale(width: 800);
                $encodedImage = (string) $img->encode(
                    new \Intervention\Image\Encoders\JpegEncoder(quality: 85)
                );

                Storage::disk('public')->put($filePath, $encodedImage);
                $images[] = $filePath;
            }

            $product->images = json_encode($images);
        } else {
            $product->images = json_encode([]);
        }

        $product->save();

        Cache::forget("user_products_" . Auth::id());

        return redirect()->route('dashboard.products')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $product = Products::with('store')
            ->visible()
            ->where('slug', $slug)
            ->firstOrFail();

        $store = Store::where('id', $product->store_id)->first();

        $wishlist = Wishlist::where('user_id', Auth::id())
            ->paginate(12);


        $comments = Comments::with('user')
            ->where('product_id', $product->id)
            ->latest()
            ->get()
        ->map(function ($comment) {
            return [
                'id' => (string) $comment->id,
                'user_id' => (string) $comment->user_id,
                'product_id' => (string) $comment->product_id,
                'store_id' => (string) $comment->store_id,
                'comment' => $comment->comment,
                'rating' => $comment->rating,
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
                'user' => $comment->user ? [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'images' => $comment->user->images ?? '',
                    'email' => $comment->user->email,
                    'role' => $comment->user->role ?? 'user',
                    'email_verified_at' => $comment->user->email_verified_at ?? '',
                ] : null,
            ];
        });


        $ratings = $comments->filter(function($comment) {
            return $comment['rating'] !== null;
        });

        $averageRating = $ratings->count() > 0
            ? $ratings->avg('rating')
            : 0;

        $reviewCount = $ratings->count();

        $userReview = null;

        if (Auth::check()) {
            $userReview = Comments::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->first();
        }

        return Inertia::render('productdetails/index', [
            'product' => $product,
            'store' => $store,
            'wishlist' => $wishlist,
            'comments' => $comments,
            'averageRating' => $averageRating,
            'reviewCount' => $reviewCount,
            'userReview' => $userReview ? [
                'id' => $userReview->id,
                'comment' => $userReview->comment,
                'rating' => $userReview->rating,
            ] : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $product = Products::where('slug', $slug)->with('store')->firstOrFail();

        $this->abortUnlessOwnsProduct($product);

        $stores = $this->roleStores(Auth::user());

        return Inertia::render('dashboard/forms/ProductUpdateForm', [
            'product' => $product,
            'store' => $product->store,
            'stores' => $stores,
            'categories' => Categories::all(),
        ]);
    }

    /**
     * Return the store owned by the current role: agents own by agent_id,
     * everyone else (customers/admins) by user_id.
     */
    private function roleStore($user)
    {
        return $this->roleStores($user)->first();
    }

    private function roleStores($user)
    {
        $query = $user instanceof Agent
            ? Store::where('agent_id', $user->id)
            : Store::where('user_id', $user->id);

        // Ordered so the fallback store is a predictable one rather than
        // whichever row the database happens to return first.
        return $query->orderBy('created_at')->get();
    }

    /**
     * Whether the actor is allowed to write products into the given store.
     *
     * Agents own stores through stores.agent_id; every other identity uses
     * stores.user_id. Admins and superadmins run the platform, and their
     * product list already spans every store, so they keep that broad reach.
     */
    private function canUseStore($user, $storeId): bool
    {
        if ($user instanceof Admin) {
            return Store::whereKey($storeId)->exists();
        }

        return $this->roleStores($user)->contains('id', $storeId);
    }

    /**
     * Refuse the request unless the product sits in a store the actor owns.
     *
     * edit(), update() and destroy() used to look products up by slug/id with no
     * ownership check at all, so any signed-in account could open, rewrite or
     * delete another vendor's product, and update() could re-point it at any
     * store in the system.
     */
    private function abortUnlessOwnsProduct(Products $product): void
    {
        $user = Auth::user();

        if ($user instanceof Admin) {
            return;
        }

        $store = $product->store;

        $owns = $store && ($user instanceof Agent
            ? $store->agent_id === $user->id
            : $store->user_id === $user->id);

        abort_unless($owns, 403, 'You do not have permission to manage this product.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $slug)
    {
        $product = Products::where('slug', $slug)->with('store')->firstOrFail();

        $this->abortUnlessOwnsProduct($product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'category' => 'required|string|max:255',
            'subcategory' => 'nullable|string',
            'brand' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0|max:1000000',
            'sale_price' => 'nullable|numeric|min:0|max:1000000|lt:regular_price',
            'description' => 'required|string',
            'inStock' => 'nullable',
            'color' => 'nullable|string|max:1000',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'images' => 'nullable|array|max:5',
            'images_to_remove' => 'nullable|string',
            'item_weight' => 'required|numeric|min:0.1',
            'product_type' => 'required|in:regular,featured,trending,top-selling,new-arrival',
            'store_id' => ['required', Rule::exists('stores', 'id')],
        ]);

        // store_id is mass-assignable (Products::$guarded is empty), so an
        // unchecked value here would let anyone move a product into any store.
        if (! $this->canUseStore($request->user(), $validated['store_id'])) {
            abort(403, 'You can only move a product to one of your own stores.');
        }

        // Normalize inStock ("1"/"0" from FormData → bool)
        $validated['inStock'] = $request->boolean('inStock');

        // ✅ Fill everything EXCEPT slug + images + images_to_remove
        $product->fill(collect($validated)->except([
            'images',
            'images_to_remove',
            'slug',                    // ⬅️ exclude slug so we can set it manually below
        ])->toArray());

        // ✅ Now set slug with timestamp (same as store)
        $product->slug = Str::slug($validated['name']) . '-' . time();

        $product->save();

        // ---- Handle image removal ----
        $existingImages = json_decode($product->images, true) ?? [];
        $imagesToRemove = json_decode($request->input('images_to_remove', '[]'), true) ?? [];

        if (!empty($imagesToRemove) && is_array($imagesToRemove)) {
            foreach ($imagesToRemove as $imagePath) {
                $cleanPath = ltrim(str_replace(['/storage/', storage_path('app/public/')], '', $imagePath), '/');

                if (Storage::disk('public')->exists($cleanPath)) {
                    Storage::disk('public')->delete($cleanPath);
                }

                $existingImages = array_values(array_filter(
                    $existingImages,
                    fn($img) => $img !== $imagePath && $img !== $cleanPath
                ));
            }
        }

        // ---- Handle new uploads ----
        if ($request->hasFile('images')) {
            $directory = 'product_images';

            foreach ($request->file('images') as $index => $file) {
                if (!$file->isValid()) continue;

                $extension = $file->getClientOriginalExtension();
                $filename = 'product_' . time() . '_' . $index . '_' . Str::random(10) . '.' . $extension;
                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($file->getRealPath());
                $img->scale(width: 800);
                $encodedImage = (string) $img->encode(new JpegEncoder(quality: 85));

                Storage::disk('public')->put($filePath, $encodedImage);

                $existingImages[] = $filePath;
            }
        }

        $product->images = json_encode(array_values($existingImages));
        $product->save();

        Cache::forget("user_products_" . Auth::id());

        return redirect()->route('dashboard.products')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Products::with('store')->findOrFail($id);

        $this->abortUnlessOwnsProduct($product);

        if ($product->images) {
            $images = json_decode($product->images, true);

            if (is_array($images)) {
                foreach ($images as $imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $product->delete();

        return redirect()->route('dashboard.products')
            ->with('success', 'Product deleted successfully!');
    }

    /**
     * Public product catalogue (route: products.index).
     *
     * Mirrors the filter contract of resources/js/Pages/products/index.tsx:
     * category, product_type, brand, search, sort_by, in_stock, min_price, max_price.
     */
    public function products(Request $request)
    {
        $category = (string) $request->input('category', 'all');
        $productType = (string) $request->input('product_type', 'all');
        $brand = (string) $request->input('brand', 'all');
        $search = trim((string) $request->input('search', ''));
        $sortBy = (string) $request->input('sort_by', 'default');
        $inStock = $request->boolean('in_stock');
        $minPrice = (float) $request->input('min_price', 0);
        $maxPrice = (float) $request->input('max_price', 0);

        $query = Products::with('store')->visible();

        if ($category !== '' && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($brand !== '' && $brand !== 'all') {
            $query->where('brand', $brand);
        }

        if ($productType === 'on-sale') {
            $query->whereNotNull('sale_price')->whereColumn('sale_price', '<', 'regular_price');
        } elseif ($productType !== '' && $productType !== 'all') {
            $query->where('product_type', $productType);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($inStock) {
            $query->where('inStock', true);
        }

        // The cards display the sale price when there is one, hence the COALESCE.
        if ($minPrice > 0) {
            $query->whereRaw('COALESCE(sale_price, regular_price) >= ?', [$minPrice]);
        }

        if ($maxPrice > 0) {
            $query->whereRaw('COALESCE(sale_price, regular_price) <= ?', [$maxPrice]);
        }

        match ($sortBy) {
            'price-low' => $query->orderByRaw('COALESCE(sale_price, regular_price) asc'),
            'price-high' => $query->orderByRaw('COALESCE(sale_price, regular_price) desc'),
            'rating' => $query->withAvg('comments as average_rating', 'rating')->orderByDesc('average_rating'),
            'popularity' => $query->withCount(['comments as ratings_count' => fn ($q) => $q->whereNotNull('rating')])->orderByDesc('ratings_count'),
            default => $query->latest(),
        };

        $products = $query->paginate(20)->withQueryString();

        // Rating summary for the products on the current page.
        $ratings = Comments::whereIn('product_id', $products->pluck('id'))
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();

        $productRatings = $products->getCollection()
            ->mapWithKeys(function ($product) use ($ratings) {
                $productRating = $ratings->where('product_id', $product->id);

                return [(string) $product->id => [
                    'average' => round((float) ($productRating->avg('rating') ?? 0), 1),
                    'count' => $productRating->count(),
                ]];
            })
            ->all();

        $highestPrice = (float) (Products::visible()->max('regular_price') ?? 0);
        $priceCeiling = max($highestPrice, $maxPrice, 10000);

        return Inertia::render('products/index', [
            'products' => $products,
            'wishlist' => Wishlist::where('user_id', Auth::id())->paginate(12),
            'productRatings' => $productRatings,
            'filters' => [
                'categories' => Products::visible()
                    ->whereNotNull('category')->where('category', '!=', '')
                    ->distinct()->orderBy('category')->pluck('category')->values(),
                'brands' => Products::visible()
                    ->whereNotNull('brand')->where('brand', '!=', '')
                    ->distinct()->orderBy('brand')->pluck('brand')->values(),
                'min_price' => 0,
                'max_price' => $priceCeiling,
                'current' => [
                    'category' => $category !== '' ? $category : 'all',
                    'product_type' => $productType !== '' ? $productType : 'all',
                    'brand' => $brand !== '' ? $brand : 'all',
                    'search' => $search,
                    'sort_by' => $sortBy !== '' ? $sortBy : 'default',
                    'in_stock' => $inStock,
                    'min_price_filter' => $minPrice,
                    'max_price_filter' => $maxPrice > 0 ? $maxPrice : $priceCeiling,
                ],
            ],
        ]);
    }

    /**
     * Hot deals page - only products that are currently discounted (route: products.hotdeals).
     */
    public function hotdeals()
    {
        $products = Products::with('store')
            ->visible()
            ->whereNotNull('sale_price')
            ->whereColumn('sale_price', '<', 'regular_price')
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('hotdeals/index', [
            'products' => $products,
            'wishlist' => Wishlist::where('user_id', Auth::id())->paginate(12),
        ]);
    }

    /**
     * New arrivals page (route: products.newarrivals).
     *
     * Shows everything flagged as `new-arrival`; when nothing has been flagged
     * yet it falls back to the most recently listed products so the page is
     * never empty. Supports `category`, `search` and `sort_by`.
     */
    public function newArrivals(Request $request)
    {
        $category = trim((string) $request->input('category', 'all'));
        $search = trim((string) $request->input('search', ''));
        $sortBy = (string) $request->input('sort_by', 'newest');

        // Prefer explicitly flagged products, fall back to recent additions.
        $flaggedCount = Products::visible()->where('product_type', 'new-arrival')->count();

        $query = Products::with('store')->visible();

        if ($flaggedCount > 0) {
            $query->where('product_type', 'new-arrival');
        } else {
            $query->where('created_at', '>=', now()->subDays(90));
        }

        if ($category !== '' && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        match ($sortBy) {
            'price-low' => $query->orderByRaw('COALESCE(sale_price, regular_price) asc'),
            'price-high' => $query->orderByRaw('COALESCE(sale_price, regular_price) desc'),
            'rating' => $query->withAvg('comments as average_rating', 'rating')->orderByDesc('average_rating'),
            'name' => $query->orderBy('name'),
            default => $query->latest(),
        };

        $products = $query->paginate(24)->withQueryString();

        // Rating summary for the products on the current page.
        $ratings = Comments::whereIn('product_id', $products->pluck('id'))
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();

        $productRatings = $products->getCollection()
            ->mapWithKeys(function ($product) use ($ratings) {
                $productRating = $ratings->where('product_id', $product->id);

                return [(string) $product->id => [
                    'average' => round((float) ($productRating->avg('rating') ?? 0), 1),
                    'count' => $productRating->count(),
                ]];
            })
            ->all();

        $newest = Products::visible()
            ->whereNotNull('created_at')
            ->max('created_at');

        return Inertia::render('new-arrivals/index', [
            'products' => $products,
            'wishlist' => Wishlist::where('user_id', Auth::id())->paginate(12),
            'productRatings' => $productRatings,
            'showcasingFallback' => $flaggedCount === 0,
            'showcasingCount' => $flaggedCount,
            'newestArrivalAt' => $newest ? (string) $newest : null,
            'filters' => [
                'categories' => Products::visible()
                    ->whereNotNull('category')->where('category', '!=', '')
                    ->distinct()->orderBy('category')->pluck('category')->values(),
                'current' => [
                    'category' => $category !== '' ? $category : 'all',
                    'search' => $search,
                    'sort_by' => $sortBy !== '' ? $sortBy : 'newest',
                ],
            ],
        ]);
    }
}
