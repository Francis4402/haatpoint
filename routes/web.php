<?php


use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReplayMessagesController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\VendorProfileController;
use App\Http\Controllers\WishlistController;
use App\Models\Categories;
use App\Models\Comments;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $categories = Categories::all();
    $products = Products::with('store')
            ->visible()
            ->orderBy('created_at', 'desc')
            ->paginate(2);
    $reviews = Reviews::all();
    $wishlist = Wishlist::forOwner()->paginate(12);

    $productIds = $products->pluck('id')->toArray();

    $ratings = Comments::whereIn('product_id', $productIds)
        ->whereNotNull('rating')
        ->select('product_id', 'rating')
        ->get();

    $productRatings = [];

    foreach ($products as $product) {
        $productRatingData = $ratings->where('product_id', $product->id);
        $averageRating = $productRatingData->avg('rating') ?? 0;
        $ratingCount = $productRatingData->count();

        $productRatings[$product->id] = [
            'average' => round($averageRating, 1),
            'count' => $ratingCount
        ];
    }

    $showcase = function (?string $productType, int $limit = 6) {
        $random = fn ($query) => $query
            ->inRandomOrder()
            ->orderBy('id')
            ->limit($limit)
            ->get();

        $base = fn () => Products::with('store')->visible();

        if ($productType === null) {
            return $random($base());
        }

        $rail = $random($base()->where('product_type', $productType));

        if ($rail->count() >= $limit) {
            return $rail;
        }

        $topUp = Products::with('store')->visible()
            ->where('product_type', '!=', $productType)
            ->whereNotIn('id', $rail->pluck('id'))
            ->inRandomOrder()
            ->orderBy('id')
            ->limit($limit - $rail->count())
            ->get();

        return $rail->concat($topUp)->values();
    };

    $offeredProducts = $showcase('featured');
    $trendingProducts = $showcase('trending');
    $dailyDiscoverProducts = $showcase('regular');

    $topSellingMinSold = 3;

    $soldTotals = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->where('orders.created_at', '>=', now()->startOfMonth())
            ->groupBy('order_items.product_id')
            ->havingRaw('SUM(order_items.quantity) > ?', [$topSellingMinSold])
            ->orderByDesc(DB::raw('SUM(order_items.quantity)'))
            ->limit(6)
            ->get(['order_items.product_id', DB::raw('SUM(order_items.quantity) as sold_count')]);

    $topSelling = Products::with('store')
            ->visible()
            ->whereIn('id', $soldTotals->pluck('product_id'))
            ->get()
            ->map(function ($product) use ($soldTotals) {
                $product->sold_count = (int) ($soldTotals->firstWhere('product_id', $product->id)->sold_count ?? 0);

                return $product;
            })
            ->sortByDesc('sold_count')
            ->values();


    $stores = Store::where('is_active', true)
            ->whereExists(function ($query) {
                $query->selectRaw('1')
                    ->from('products')
                    ->whereColumn('products.store_id', 'stores.id');
            })
            ->addSelect(['products_count' => Products::selectRaw('count(*)')
                ->whereColumn('products.store_id', 'stores.id')])
            ->orderByDesc('products_count')
            ->orderBy('name')
            ->limit(12)
            ->get();

    $showcaseIds = collect([
        ...$offeredProducts->pluck('id'),
        ...$trendingProducts->pluck('id'),
        ...$dailyDiscoverProducts->pluck('id'),
        ...$topSelling->pluck('id'),
        ...$products->pluck('id'),
    ])->unique()->values();

    $showcaseRatings = Comments::whereIn('product_id', $showcaseIds)
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get()
            ->groupBy('product_id')
            ->map(fn ($rows) => [
                'average' => round((float) $rows->avg('rating'), 1),
                'count' => $rows->count(),
            ]);

    $withRatings = fn ($item) => [
        ...$item->toArray(),
        'rating' => $showcaseRatings[$item->id]['average'] ?? 0,
        'review' => $showcaseRatings[$item->id]['count'] ?? 0,
    ];

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categories' => $categories,
        'products' => $products,
        'topSelling' => $topSelling->map($withRatings)->values(),
        'topSellingMinSold' => $topSellingMinSold,
        'offeredProducts' => $offeredProducts->map($withRatings)->values(),
        'trendingProducts' => $trendingProducts->map($withRatings)->values(),
        'dailyDiscoverProducts' => $dailyDiscoverProducts->map($withRatings)->values(),
        'stores' => $stores,
        'wishlist' => $wishlist,
        'productRatings' => $productRatings,
        'reviews' => $reviews,
    ]);
});

Route::middleware(['auth:admin,superadmin', 'role:admin,superadmin', 'blocked'])->group(function () {
    Route::get('/dashboard/categories', [CategoriesController::class, 'index'])->name('dashboard.categories');
    Route::post('/dashboard/categories', [CategoriesController::class, 'store'])->name('dashboard.storecategory');
    Route::delete('/dashboard/categories/{id}', [CategoriesController::class, 'destroy'])->name('dashboard.deletecategory');
    Route::get('/dashboard/customers', [CustomersController::class, 'index'])->name('dashboard.customers');
    Route::post('/dashboard/customers/{user}/promote', [CustomersController::class, 'promote'])
        ->name('dashboard.customer.promote')
        ->middleware('role:superadmin');
    Route::post('/dashboard/customers/{user}/make-agent', [CustomersController::class, 'makeAgent'])
        ->name('dashboard.customer.make-agent');
    Route::post('/dashboard/customers/{agent}/make-user', [CustomersController::class, 'makeUser'])
        ->name('dashboard.customer.make-user');

    Route::patch('/dashboard/customers/{type}/{customer}/block', [CustomersController::class, 'toggleBlock'])
        ->name('dashboard.customer.block')
        ->middleware('role:superadmin')
        ->where('type', 'user|agent|admin');

    Route::delete('/dashboard/customers/{type}/{customer}', [CustomersController::class, 'destroy'])
        ->name('dashboard.customer.delete')
        ->middleware('role:superadmin')
        ->where('type', 'user|agent|admin');
    Route::put('/dashboard/categories/update/{id}', [CategoriesController::class, 'update'])->name('dashboard.updatecategory');

    Route::patch('/dashboard/stores/{id}/toggle-active', [StoreController::class, 'toggleActive'])
    ->name('dashboard.store.toggle-active');

    Route::delete('/orders/{order}', [OrdersController::class, 'destroy'])
        ->name('orders.destroy');

    // OrdersController rather than PageController: the same component used to
    // be rendered without `orderRules`, so the status dropdowns never appeared
    // and the superadmin could not change payment or order status from here.
    Route::get('/dashboard/admin/orders', [OrdersController::class, 'index'])->name('dashboard.adminorders');

    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])
    ->name('contacts.destroy');

    Route::post('/reply-message', [ReplayMessagesController::class, 'store'])
    ->name('reply.message');

    Route::delete('/dashboard/store/{store}', [StoreController::class, 'destroy'])->name('dashboard.deletestore');

    Route::get('/dashboard/store/{name}/edit', [StoreController::class, 'edit'])->name('dashboard.storeedit');
    Route::put('/dashboard/store/update/{store}', [StoreController::class, 'update'])->name('dashboard.storeupdate');
});

Route::middleware(['auth:web,superadmin,admin,agent', 'blocked'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/products', [ProductsController::class, 'index'])->name('dashboard.products');

    Route::get('/dashboard/stores', [StoreController::class, 'index'])->name('dashboard.store');

    Route::get('/dashboard/products/{slug}/edit', [ProductsController::class, 'edit'])->name('dashboard.productedit');
    Route::match(['put', 'post'], '/dashboard/products/update/{slug}', [ProductsController::class, 'update'])->name('dashboard.updateproduct');

    Route::get('/dashboard/stores/{id}/products', [StoreController::class, 'products'])
        ->name('dashboard.storeproducts');

    Route::get('/dashboard/stores/{id}/analytics', [StoreController::class, 'analytics'])
        ->name('dashboard.storeanalytics');
    Route::get('/dashboard/orders', [OrdersController::class, 'index'])->name('dashboard.orders');

    Route::get('/dashboard/shipping', [PageController::class, 'shipping'])->name('dashboard.shipping');
    Route::get('/dashboard/payments', [PageController::class, 'payment'])->name('dashboard.payment');

    Route::get('/dashboard/messages', [MessagesController::class, 'index'])->name('dashboard.messages');

    Route::get('/contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');

    Route::get('/contacts/{contact}/replies', [ReplayMessagesController::class, 'replies'])
        ->name('contact.replies');

    Route::post('/contacts/{contact}/read', [ContactController::class, 'markSingleAsRead'])
    ->name('contacts.mark-single-read');

    Route::post('/contacts/{contact}/star', [ContactController::class, 'toggleStar'])
    ->name('contacts.toggle-star');


    Route::get('/dashboard/analytics', [PageController::class, 'analystics'])->name('dashboard.analytics');

    Route::get('/dashboard/products/productform', [ProductsController::class, 'create'])->name('dashboard.createproduct');

    Route::get('/dashboard/stores/storeform', [StoreController::class, 'create'])->name('dashboard.createstore');

    Route::post('/dashboard/stores/store', [StoreController::class, 'store'])->name('stores.store');

    Route::post('/dashboard/products/store', [ProductsController::class, 'store'])->name('products.store');

    Route::delete('/dashboard/products/{slug}', [ProductsController::class, 'destroy'])->name('dashboard.deleteproduct');

    Route::get('/checkout', [PageController::class, 'checkout'])->name('checkout');

    Route::post('/orders', [OrdersController::class, 'store'])->name('orders.store');

    Route::patch('/orders/{order}', [OrdersController::class, 'update'])
        ->name('admin.orders.update');

    Route::get('/orders/{order}/confirmation', [OrdersController::class, 'confirmation'])->name('orders.confirmation');

    Route::get('/orders/{order}', [OrdersController::class, 'show'])->name('orders.show');

    Route::patch('/orders/{order}/cancel', [OrdersController::class, 'cancel'])
        ->name('orders.cancel');


    Route::delete('/dashboard/orders/{order}', [OrdersController::class, 'destroy'])->name('orders.delete');

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');

    Route::post('/wishlist/toggle/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    Route::post('/comments', [CommentsController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentsController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentsController::class, 'destroy'])->name('comments.destroy');

    Route::post('/stores/{store}/review', [CommentsController::class, 'storeReview'])->name('stores.review');
});

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');

Route::get('/stores', [StoreController::class, 'storeroute'])->name('stores.index');
Route::get('/stores/{store}', [StoreController::class, 'show'])->name('stores.show');

Route::get('/track-order', [PageController::class, 'trackorder'])->name('trackorder.index');
Route::get('/contactus', [ContactController::class, 'index'])->name('contact.index');
Route::post('/post/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/products', [ProductsController::class, 'products'])->name('products.index');

Route::get('/aboutus', [PageController::class, 'aboutus'])->name('aboutus.index');

Route::get('/products/{slug}', [ProductsController::class, 'show'])->name('products.details');

Route::get('/cart', [PageController::class, 'cartpage'])->name('cart.index');

Route::get('/products/{product}/comments', [CommentsController::class, 'getProductComments'])->name('comments.product');

Route::get('/hotdeals', [ProductsController::class, 'hotdeals'])->name('products.hotdeals');

Route::get('/new-arrivals', [ProductsController::class, 'newArrivals'])->name('products.newarrivals');


Route::get('/search/suggestions', [SearchController::class, 'suggest'])->name('search.suggest');


Route::get('/auth/{provider}/redirect/{destination?}', [SocialiteController::class, 'redirect'])
    ->where('provider', 'google|facebook|github')
    ->name('auth.redirect');

Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->where('provider', 'google|facebook|github')
    ->name('auth.callback');

Route::controller(PageController::class)->group(function () {
    Route::get('/privacy-policy', 'privacypolicy')->name('privacy.policy');
    Route::get('/terms-and-conditions', 'termsandconditions')->name('terms.and.conditions');
});

Route::post('/reviews', [ReviewsController::class, 'store'])->name('reviews.store');
Route::get('/products/{slug}/reviews', [ReviewsController::class, 'status'])->name('reviews.status');


Route::middleware(['auth:web,superadmin,admin,agent', 'blocked'])->group(function () {
    Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::get('/dashboard/vendor/profile', [VendorProfileController::class, 'edit'])
        ->name('vendor.profile.edit');
    Route::post('/dashboard/vendor/profile', [VendorProfileController::class, 'update'])
        ->name('vendor.profile.update');
});

require __DIR__.'/auth.php';
