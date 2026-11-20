<?php

namespace App\Http\Middleware;

use App\Models\Products;
use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Builds the per-page <head> values on the server.
 *
 * The single Inertia shell used to hardcode one canonical URL and one title for
 * every page, so crawlers were told that the whole site duplicated the home
 * page and nothing else was worth indexing. The head tags rendered by SeoHead
 * only exist after JavaScript runs, which is why the tags had to be computed
 * here instead.
 */
class SeoMeta
{
    /** Public origin. Kept in sync with SITE_URL in resources/js/Components/SeoHead.tsx. */
    public const SITE_URL = 'https://www.haatpoint.com';

    public const SITE_NAME = 'HaatPoint';

    public const DEFAULT_TITLE = 'HaatPoint - Online Shopping in Bangladesh | Best Multivendor Marketplace | অনলাইন শপিং';

    public const DEFAULT_DESCRIPTION =
        'Shop 12,000+ authentic products at HaatPoint, Bangladesh\'s premier multivendor online marketplace. Find electronics, gadgets, men & women\'s fashion, lifestyle, beauty & home decor with cash on delivery & nationwide fast delivery.';

    public const DEFAULT_KEYWORDS =
        'online shopping Bangladesh, best online shopping site in Bangladesh, multivendor marketplace BD, cash on delivery online shopping, buy online BD, online shopping bd cash on delivery, ecommerce Bangladesh, online shop bd, electronics online shopping bd, smart watch price in bangladesh, tws earbuds bd, mens fashion bd, saree collection online bd, home decor bd, best price in bangladesh, trusted online shop bd, HaatPoint, haatpoint.com, হাটপয়েন্ট, অনলাইন শপিং বাংলাদেশ, অনলাইনে কেনাকাটা, সেরা অনলাইন শপ, ক্যাশ অন ডেলিভারি';

    /**
     * Title and description overrides per route name. A page missing from this
     * map falls back to the site default, which is deliberate: an untitled page
     * is better than a wrongly titled one.
     */
    private const PAGES = [
        'products.index' => [
            'title' => 'All Products - Buy Online in Bangladesh | Cash on Delivery | HaatPoint',
            'description' => 'Explore 12,000+ genuine products at HaatPoint Bangladesh. Browse electronics, gadgets, men\'s & women\'s fashion, home essentials, beauty & daily lifestyle products from verified local sellers.',
            'keywords' => 'buy products online bd, online shopping bangladesh, electronics online bd, smart watch price bd, mens fashion bd, womens clothing bd, home decor bangladesh, cash on delivery shop, haatpoint products, অনলাইন শপিং বাংলাদেশ',
        ],
        'products.newarrivals' => [
            'title' => 'New Arrivals - Latest Products & Gadgets in Bangladesh | HaatPoint',
            'description' => 'Discover the newest arrivals on HaatPoint, freshly listed by verified local vendors across Bangladesh. Grab the latest fashion trends, smart gadgets, electronics & home innovations.',
            'keywords' => 'new arrivals bd, latest gadgets bangladesh, new fashion collection bd, trending products bd, newly launched items, buy new arrivals online, নতুন কালেকশন',
        ],
        'products.hotdeals' => [
            'title' => 'Hot Deals & Mega Discounts - Big Savings Online Shopping BD | HaatPoint',
            'description' => 'Save big with hot deals, flash sales & exclusive discounts on HaatPoint Bangladesh. Shop electronics, fashion, lifestyle & home goods at unbeatable prices with cash on delivery.',
            'keywords' => 'hot deals bd, discount offers bangladesh, online shopping discounts, flash sale bd, cheap price shopping bd, promo deals online, mega discounts bangladesh, ডিসকাউন্ট অফার, হাটপয়েন্ট',
        ],
        'categories.index' => [
            'title' => 'Explore All Product Categories | HaatPoint Bangladesh',
            'description' => 'Browse all 24 product departments on HaatPoint: Electronics, Smart Gadgets, Men\'s Fashion, Women\'s Clothing, Home & Living, Beauty & Personal Care with cash on delivery.',
            'keywords' => 'product categories bd, online shopping departments, electronics categories, fashion collection, home living, beauty products bd, haatpoint categories, ক্যাটাগরি',
        ],
        'stores.index' => [
            'title' => 'Browse Verified Online Stores & Local Vendors in Bangladesh | HaatPoint',
            'description' => 'Discover verified shops, brand outlets & trusted local merchants on HaatPoint. Buy directly from reliable Bangladesh vendors with fast door-to-door delivery.',
            'keywords' => 'online stores bangladesh, verified vendors bd, trusted sellers bd, multivendor stores, merchant shops bd, local shop online, ভেরিফাইড শপ',
        ],
        'aboutus.index' => [
            'title' => 'About Us - Bangladesh\'s Trusted Multivendor Marketplace | HaatPoint',
            'description' => 'Learn how HaatPoint connects verified Bangladeshi merchants with millions of nationwide shoppers, offering fair prices, authentic products, and zero middlemen.',
            'keywords' => 'about haatpoint, bangladesh ecommerce company, trusted online marketplace, online shopping platform bd, আমাদের সম্পর্কে',
        ],
        'contact.index' => [
            'title' => 'Contact Us & Customer Support | HaatPoint Bangladesh',
            'description' => 'Get in touch with HaatPoint support. Call +8801319052507, message via WhatsApp, or submit a message through our support portal for order tracking and customer service.',
            'keywords' => 'haatpoint contact, customer care bd, haatpoint helpline, ecommerce support bangladesh, track order contact, যোগাযোগ',
        ],
        'trackorder.index' => [
            'title' => 'Track Your Order - Real-Time Parcel Tracking | HaatPoint',
            'description' => 'Track the current delivery status of your HaatPoint parcel across Bangladesh. Enter your order number for real-time Pathao courier tracking.',
            'keywords' => 'track order bd, parcel tracking bangladesh, check order status, delivery status haatpoint, pathao courier tracking, অর্ডার ট্র্যাকিং',
        ],
        'privacy.policy' => [
            'title' => 'Privacy Policy | HaatPoint Bangladesh',
            'description' => 'How HaatPoint collects, safeguards, and respects your personal information and privacy rights.',
            'keywords' => 'privacy policy haatpoint, data security, ecommerce privacy',
        ],
        'terms.and.conditions' => [
            'title' => 'Terms and Conditions | HaatPoint Bangladesh',
            'description' => 'Terms of service, shipping terms, and damage replacement guarantee for shopping on HaatPoint.',
            'keywords' => 'terms and conditions haatpoint, return policy, terms of service',
        ],
        // Not indexable, but still deserve their own tab title.
        'login' => [
            'title' => 'Login | HaatPoint',
            'description' => 'Log in to your HaatPoint account to track orders, manage your wishlist and check out faster.',
        ],
        'register' => [
            'title' => 'Create a Free Account | HaatPoint',
            'description' => 'Create a free HaatPoint account to shop, sell, or track your orders across Bangladesh.',
        ],
        'password.request' => [
            'title' => 'Forgot Password | HaatPoint',
            'description' => 'Reset the password on your HaatPoint account.',
        ],
        'cart.index' => [
            'title' => 'Shopping Cart | HaatPoint',
            'description' => 'Review the items in your HaatPoint cart before you check out.',
        ],
        'wishlist.index' => [
            'title' => 'My Wishlist | HaatPoint',
            'description' => 'The products you saved on HaatPoint.',
        ],
        'sell' => [
            'title' => 'Become a Seller - Open Your Free Store in Bangladesh | HaatPoint',
            'description' => 'Open your free store on HaatPoint or upgrade to Pro with 7% sales commission, boosted product visibility, and reach nationwide customers across Bangladesh.',
            'keywords' => 'sell online bangladesh, become a seller bd, open online store bd, ecommerce seller center bangladesh, online business bd, sell products on haatpoint, সেলার হোন',
        ],
    ];

    /**
     * Pages that must never appear in search results. Account screens and
     * transactional pages have nothing to offer a searcher, and indexing them
     * dilutes the pages that do.
     *
     * `checkout` is a bare route name rather than an `orders.` child, the vendor
     * profile is `vendor.profile.*`, and the personal settings and inbox routes
     * are `profile.*` / `contacts.*` — all of them used to miss this list and
     * ship `index, follow` from the shell.
     */
    private const NO_INDEX_PREFIXES = [
        'login',
        'register',
        'superadmin.',
        'admin.',
        'agent.',
        'password.',
        'dashboard.',
        'cart.',
        'wishlist.',
        'orders.',
        'checkout',
        'vendor.',
        'profile.',
        'contacts.',
    ];

    /** Titles for responses that never reached a normal page. */
    private const ERROR_TITLES = [
        403 => 'Access Denied',
        404 => 'Page Not Found',
        419 => 'Session Expired',
        429 => 'Too Many Requests',
        500 => 'Something Went Wrong',
        503 => 'Service Unavailable',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $seo = $this->forRequest($request);

        View::share('seo', $seo);
        // Also on the request, because HandleInertiaRequests runs after this
        // middleware and has to hand the same array to the client. Sharing it
        // only to the view would leave SeoHead with nothing to mirror.
        $request->attributes->set('seo', $seo);

        return $next($request);
    }

    /**
     * @return array<string, string>
     */
    public function forRequest(Request $request): array
    {
        // Note: an unnamed route is not necessarily an error page — the home
        // route has no name. Error responses are handled by errorFor() in the
        // exception renderer, which is the only place that knows the status.
        $routeName = $request->route()?->getName();

        [$title, $description, $ogType, $ogImage, $extra] = $this->contentFor($request, $routeName);

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $extra['keywords'] ?? (isset(self::PAGES[$routeName]['keywords']) ? self::PAGES[$routeName]['keywords'] : self::DEFAULT_KEYWORDS),
            'canonical' => $this->canonicalFor($request),
            'robots' => $this->robotsFor($request, $routeName),
            'ogType' => $ogType,
            'ogTitle' => $title,
            'ogDescription' => $description,
            'ogImage' => $ogImage,
            'ogUrl' => $this->canonicalFor($request),
            'ogPrice' => $extra['price'] ?? null,
            'ogCurrency' => !empty($extra['price']) ? 'BDT' : null,
        ];
    }

    /**
     * Head values for a response that is not a real page.
     *
     * The web middleware group does not run for an unmatched URL, so nothing
     * would share any head values at all and the shell would fall back to
     * `index, follow` with a canonical pointing at the home page — telling
     * Google every broken URL is a copy of the front page. The canonical is
     * deliberately empty: a 404 has nothing to consolidate into.
     *
     * @return array<string, string>
     */
    public static function errorFor(int $status): array
    {
        $label = self::ERROR_TITLES[$status] ?? 'Error';
        $title = $label . ' (' . $status . ') | ' . self::SITE_NAME;

        return [
            'title' => $title,
            'description' => self::DEFAULT_DESCRIPTION,
            'canonical' => '',
            'robots' => 'noindex, follow',
            'ogType' => 'website',
            'ogTitle' => $title,
            'ogDescription' => self::DEFAULT_DESCRIPTION,
            'ogImage' => self::SITE_URL . '/og-image.png',
            'ogUrl' => '',
        ];
    }

    /**
     * @return array{0: string, 1: string, 2: string, 3: string, 4: array}
     */
    private function contentFor(Request $request, ?string $routeName): array
    {
        $defaults = [
            self::DEFAULT_TITLE,
            self::DEFAULT_DESCRIPTION,
            'website',
            self::SITE_URL . '/og-image.png',
            ['keywords' => self::DEFAULT_KEYWORDS],
        ];

        if ($routeName === 'products.details') {
            return $this->productContent($request, $defaults);
        }

        if ($routeName === 'stores.show') {
            return $this->storeContent($request, $defaults);
        }

        if (isset(self::PAGES[$routeName])) {
            return [
                self::PAGES[$routeName]['title'],
                self::PAGES[$routeName]['description'],
                'website',
                $defaults[3],
                ['keywords' => self::PAGES[$routeName]['keywords'] ?? self::DEFAULT_KEYWORDS],
            ];
        }

        return $defaults;
    }

    /**
     * A product page is titled after the product itself, which is what a
     * shopper types into the search box.
     *
     * @param  array{0: string, 1: string, 2: string, 3: string, 4: array}  $defaults
     * @return array{0: string, 1: string, 2: string, 3: string, 4: array}
     */
    private function productContent(Request $request, array $defaults): array
    {
        $slug = $request->route('slug');

        if (! is_string($slug) || $slug === '') {
            return $defaults;
        }

        $product = Products::query()
            ->visible()
            ->where('slug', $slug)
            ->first(['name', 'description', 'regular_price', 'sale_price', 'images', 'category', 'brand']);

        if (! $product) {
            return $defaults;
        }

        $description = $this->trimDescription($product->description)
            ?: 'Buy ' . $product->name . ' online at best price in Bangladesh on HaatPoint. Cash on delivery available.';

        $price = $product->sale_price ?: $product->regular_price;
        $brandText = $product->brand ? "{$product->brand}, " : '';
        $productKeywords = "{$product->name}, {$product->name} price in bangladesh, buy {$product->name} online, {$product->category}, {$brandText}online shopping bd, haatpoint";

        return [
            $product->name . ' - Price in Bangladesh | ' . self::SITE_NAME,
            $description,
            'product',
            $this->productImage($product->images) ?? $defaults[3],
            [
                'price' => $price ? (string) $price : null,
                'keywords' => $productKeywords,
            ],
        ];
    }

    /**
     * @param  array{0: string, 1: string, 2: string, 3: string, 4: array}  $defaults
     * @return array{0: string, 1: string, 2: string, 3: string, 4: array}
     */
    private function storeContent(Request $request, array $defaults): array
    {
        $param = $request->route('store');

        $store = null;
        if ($param instanceof Store) {
            $store = $param;
        } elseif (is_string($param)) {
            $store = Store::query()->where('is_active', true)
                ->where('name', $param)
                ->orWhere('id', $param)
                ->first();

            if (! $store) {
                $decoded = urldecode($param);
                $store = Store::query()->where('is_active', true)
                    ->where('name', $decoded)
                    ->orWhereRaw('LOWER(name) = ?', [strtolower($param)])
                    ->orWhereRaw('LOWER(name) = ?', [strtolower(str_replace('-', ' ', $param))])
                    ->orWhereRaw('LOWER(name) = ?', [strtolower(str_ireplace('-and-', ' & ', $param))])
                    ->orWhereRaw('LOWER(REPLACE(name, " ", "-")) = ?', [strtolower($param)])
                    ->orWhereRaw('LOWER(REPLACE(REPLACE(name, "&", "and"), " ", "-")) = ?', [strtolower($param)])
                    ->first();
            }
        }

        if (! $store) {
            return $defaults;
        }

        return [
            $store->name . ' - Verified Store & Products | ' . self::SITE_NAME,
            'Shop authentic products from ' . $store->name . ' on HaatPoint. Browse this verified vendor’s catalog, deals and customer ratings across Bangladesh.',
            'website',
            $store->logo
                ? self::SITE_URL . '/storage/' . ltrim($store->logo, '/')
                : $defaults[3],
            [
                'keywords' => "{$store->name}, {$store->name} online shop, {$store->name} store bangladesh, verified sellers bd, buy from {$store->name}, haatpoint",
            ],
        ];
    }

    private function productImage(?string $images): ?string
    {
        if (! $images) {
            return null;
        }

        $path = null;

        try {
            $clean = trim($images);
            if (str_starts_with($clean, '"') && str_ends_with($clean, '"')) {
                $clean = substr($clean, 1, -1);
            }
            $parsed = json_decode($clean, true);
            if (is_array($parsed) && ! empty($parsed[0])) {
                $path = $parsed[0];
            }
        } catch (Throwable) {
            $path = null;
        }

        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $cleanPath = ltrim($path, '/');
        if (str_starts_with($cleanPath, 'storage/')) {
            $cleanPath = substr($cleanPath, 8);
        }

        return self::SITE_URL . '/storage/' . $cleanPath;
    }

    /**
     * Canonical is always the bare path. Faceted listings such as
     * /products?product_type=featured are thin variants of /products, so they
     * point at /products rather than competing with it.
     */
    private function canonicalFor(Request $request): string
    {
        $path = '/'.ltrim($request->path(), '/');

        return $path === '/' ? self::SITE_URL : self::SITE_URL . $path;
    }

    private function robotsFor(Request $request, ?string $routeName): string
    {
        foreach (self::NO_INDEX_PREFIXES as $prefix) {
            if ($routeName !== null && str_starts_with($routeName, $prefix)) {
                return 'noindex, follow';
            }
        }

        // Prevent Soft 404s on thin / empty query filter variants (?category=..., ?product_type=...)
        // Clean /products catalog root stays index, follow.
        if ($routeName === 'products.index' && ($request->has('category') || $request->has('product_type') || $request->has('search') || $request->has('brand') || $request->has('subcategory'))) {
            return 'noindex, follow';
        }

        return 'index, follow';
    }

    private function trimDescription(?string $text): string
    {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) $text)) ?? '');

        if ($text === '') {
            return '';
        }

        return mb_strlen($text) > 300 ? mb_substr($text, 0, 297).'...' : $text;
    }
}
