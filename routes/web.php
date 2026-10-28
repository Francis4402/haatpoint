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
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VendorProfileController;
use App\Http\Controllers\WishlistController;
use App\Models\Categories;
use App\Models\Comments;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $categories = Cache::remember('all_categories', now()->addHours(6), fn () => Categories::all());
    $products = Products::with('store')
            ->visible()
            ->orderBy('created_at', 'desc')
            ->paginate(2);
    $reviews = [];
    $wishlist = Wishlist::forOwner()->paginate(12);

    $showcase = function (?string $productType, int $limit = 6) {
        $cacheKey = 'showcase_pool_' . ($productType ?? 'all');
        $poolIds = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($productType) {
            $q = Products::visible()->withProBoost();
            if ($productType !== null) {
                $q->where('product_type', $productType);
            }
            return $q->latest()->limit(50)->pluck('id')->all();
        });

        $chosenIds = [];
        if (!empty($poolIds)) {
            $poolCount = count($poolIds);
            $pickCount = min($limit, $poolCount);
            $keys = (array) array_rand($poolIds, $pickCount);
            foreach ($keys as $k) {
                $chosenIds[] = $poolIds[$k];
            }
        }

        $rail = !empty($chosenIds)
            ? Products::with('store.agent')->visible()->whereIn('id', $chosenIds)->get()
            : collect();

        if ($rail->count() >= $limit) {
            return $rail;
        }

        $needed = $limit - $rail->count();
        $topUpCacheKey = 'showcase_topup_' . ($productType ?? 'all');
        $topUpPoolIds = Cache::remember($topUpCacheKey, now()->addMinutes(5), function () use ($productType) {
            $q = Products::visible()->withProBoost();
            if ($productType !== null) {
                $q->where('product_type', '!=', $productType);
            }
            return $q->latest()->limit(50)->pluck('id')->all();
        });

        $existingIds = $rail->pluck('id')->all();
        $availableTopUpIds = array_values(array_diff($topUpPoolIds, $existingIds));
        $topUpChosen = [];
        if (!empty($availableTopUpIds)) {
            $topUpCount = count($availableTopUpIds);
            $pickCount = min($needed, $topUpCount);
            $keys = (array) array_rand($availableTopUpIds, $pickCount);
            foreach ($keys as $k) {
                $topUpChosen[] = $availableTopUpIds[$k];
            }
        }

        $topUp = !empty($topUpChosen)
            ? Products::with('store.agent')->visible()->whereIn('id', $topUpChosen)->get()
            : collect();

        return $rail->concat($topUp)->values();
    };

    $offeredProducts = $showcase('featured');
    $trendingProducts = $showcase('trending');
    $dailyDiscoverProducts = $showcase('regular');

    $topSellingMinSold = 3;

    $soldTotals = Cache::remember('home_sold_totals', now()->addMinutes(10), function () use ($topSellingMinSold) {
        return DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status', '!=', 'cancelled')
            ->where('orders.created_at', '>=', now()->startOfMonth())
            ->groupBy('order_items.product_id')
            ->havingRaw('SUM(order_items.quantity) > ?', [$topSellingMinSold])
            ->orderByDesc(DB::raw('SUM(order_items.quantity)'))
            ->limit(6)
            ->get(['order_items.product_id', DB::raw('SUM(order_items.quantity) as sold_count')]);
    });

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


    $stores = Cache::remember('home_active_stores', now()->addMinutes(15), function () {
        return Store::where('is_active', true)
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
    });

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

    $productRatings = [];
    foreach ($products as $product) {
        $productRatings[$product->id] = [
            'average' => $showcaseRatings[$product->id]['average'] ?? 0,
            'count' => $showcaseRatings[$product->id]['count'] ?? 0,
        ];
    }

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
})->name('home');

Route::middleware(['auth:admin,superadmin', 'role:admin,superadmin', 'blocked'])->group(function () {
    Route::get('/dashboard/categories', [CategoriesController::class, 'index'])->name('dashboard.categories');
    Route::post('/dashboard/categories', [CategoriesController::class, 'store'])->name('dashboard.storecategory');
    Route::delete('/dashboard/categories/{id}', [CategoriesController::class, 'destroy'])->name('dashboard.deletecategory');
    Route::get('/dashboard/customers', [CustomersController::class, 'index'])->name('dashboard.customers');
    Route::post('/dashboard/customers/{type}/{customer}/promote', [CustomersController::class, 'promote'])
        ->name('dashboard.customer.promote')
        ->middleware('role:superadmin')
        ->where('type', 'user|agent');
    Route::post('/dashboard/customers/{customer}/promote', [CustomersController::class, 'promoteLegacy'])
        ->name('dashboard.customer.promote.legacy')
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

    Route::put('/dashboard/customers/{type}/{customer}', [CustomersController::class, 'update'])
        ->name('dashboard.customer.update')
        ->where('type', 'user|agent|admin');

    Route::put('/dashboard/categories/update/{id}', [CategoriesController::class, 'update'])->name('dashboard.updatecategory');

    Route::patch('/dashboard/stores/{id}/toggle-active', [StoreController::class, 'toggleActive'])
    ->name('dashboard.store.toggle-active');

    Route::delete('/orders/{order}', [OrdersController::class, 'destroy'])
        ->name('orders.destroy');

    Route::get('/dashboard/admin/orders', [OrdersController::class, 'index'])->name('dashboard.adminorders');

    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])
    ->name('contacts.destroy');

    Route::post('/reply-message', [ReplayMessagesController::class, 'store'])
    ->name('reply.message');

    Route::delete('/dashboard/store/{store}', [StoreController::class, 'destroy'])->name('dashboard.deletestore');

    Route::get('/dashboard/store/{name}/edit', [StoreController::class, 'edit'])->name('dashboard.storeedit');

    Route::put('/dashboard/store/update/{store}', [StoreController::class, 'update'])->name('dashboard.storeupdate');
});

Route::middleware(['auth:web,superadmin,admin,agent', 'blocked', 'subscription'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/agent-guide', [DashboardController::class, 'agentGuide'])->name('dashboard.agent-guide');
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

    Route::patch('/dashboard/products/{id}/unblock', [ProductsController::class, 'unblock'])->name('dashboard.products.unblock');

    Route::delete('/dashboard/products/{slug}', [ProductsController::class, 'destroy'])->name('dashboard.deleteproduct');

    Route::get('/checkout', [PageController::class, 'checkout'])->name('checkout');

    Route::post('/orders', [OrdersController::class, 'store'])->name('orders.store');

    Route::patch('/orders/{order}', [OrdersController::class, 'update'])
        ->name('admin.orders.update');

    Route::patch('/dashboard/orders/{order}/confirm', [OrdersController::class, 'confirmOrder'])
        ->name('admin.orders.confirm');

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

    // Superadmin and Admin: verify the bKash transactions agents submit for Pro.
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::post('/dashboard/subscription/{agent}/approve', [SubscriptionController::class, 'approve'])->name('dashboard.subscription.approve');
        Route::post('/dashboard/subscription/{agent}/reject', [SubscriptionController::class, 'reject'])->name('dashboard.subscription.reject');
    });
});

Route::middleware(['auth:web,superadmin,admin,agent', 'blocked'])->group(function () {
    Route::get('/dashboard/upgrade', [SubscriptionController::class, 'showUpgrade'])->name('dashboard.upgrade');

    // bKash payment for HaatPoint Pro. Deliberately outside the `subscription`
    // group: the agent being asked to pay is, by definition, not active yet.
    Route::get('/dashboard/subscription/payment', [SubscriptionController::class, 'showPayment'])->name('dashboard.subscription.payment');
    Route::post('/dashboard/subscription/payment', [SubscriptionController::class, 'submitPayment'])->name('dashboard.subscription.payment.submit');
});

Route::get('/sell', [SubscriptionController::class, 'sell'])->name('sell');
Route::get('/pricing', function () {
    return redirect()->to('/sell#pricing');
})->name('pricing');

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

Route::get('/auth/social/choose', [SocialiteController::class, 'showAccountChoice'])->name('auth.social.choose');
Route::post('/auth/social/complete', [SocialiteController::class, 'completeAccountChoice'])->name('auth.social.complete');

Route::controller(PageController::class)->group(function () {
    Route::get('/privacy-policy', 'privacypolicy')->name('privacy.policy');
    Route::get('/terms-and-conditions', 'termsandconditions')->name('terms.and.conditions');
});

Route::post('/reviews', [ReviewsController::class, 'store'])->name('reviews.store');
Route::get('/products/{slug}/reviews', [ReviewsController::class, 'status'])->name('reviews.status');


Route::middleware(['auth:web,superadmin,admin,agent', 'blocked', 'subscription'])->group(function () {
    Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard/vendor/profile', [VendorProfileController::class, 'edit'])
        ->name('vendor.profile.edit');

    Route::post('/dashboard/vendor/profile', [VendorProfileController::class, 'update'])
        ->name('vendor.profile.update');
});

Route::get('/stream/video/{filename}', function (string $filename) {
    $cleanFilename = basename($filename);
    $path = public_path('videos/' . $cleanFilename);

    if (!file_exists($path)) {
        abort(404);
    }

    $size = filesize($path);
    $start = 0;
    $end = $size - 1;

    $headers = [
        'Content-Type' => 'video/mp4',
        'Accept-Ranges' => 'bytes',
        'Cache-Control' => 'public, max-age=86400',
    ];

    $range = request()->header('Range');

    if ($range && preg_match('/bytes=(\d+)-(\d*)/i', $range, $matches)) {
        $start = (int) $matches[1];
        if (!empty($matches[2])) {
            $end = min((int) $matches[2], $size - 1);
        }

        if ($start > $end || $start >= $size) {
            return response('', 416, [
                'Content-Range' => "bytes */{$size}",
            ]);
        }

        $length = $end - $start + 1;
        $headers['Content-Range'] = "bytes {$start}-{$end}/{$size}";
        $headers['Content-Length'] = (string) $length;

        return response()->stream(function () use ($path, $start, $length) {
            $fp = fopen($path, 'rb');
            if ($fp === false) {
                return;
            }
            fseek($fp, $start);
            $remaining = $length;
            $buffer = 1024 * 64;

            while ($remaining > 0 && !feof($fp)) {
                $readBytes = min($buffer, $remaining);
                $chunk = fread($fp, $readBytes);
                if ($chunk === false) {
                    break;
                }
                echo $chunk;
                flush();
                $remaining -= strlen($chunk);
            }
            fclose($fp);
        }, 206, $headers);
    }

    $headers['Content-Length'] = (string) $size;
    return response()->file($path, $headers);
})->name('video.stream');

require __DIR__.'/auth.php';
