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

    public const DEFAULT_DESCRIPTION =
        'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.';

    /**
     * Title and description overrides per route name. A page missing from this
     * map falls back to the site default, which is deliberate: an untitled page
     * is better than a wrongly titled one.
     */
    private const PAGES = [
        'products.index' => [
            'title' => 'All Products',
            'description' => 'Browse every product available on HaatPoint, from electronics and fashion to home goods and groceries, sold by verified local vendors.',
        ],
        'products.newarrivals' => [
            'title' => 'New Arrivals',
            'description' => 'The newest products added to HaatPoint, freshly listed by our verified local vendors across Bangladesh.',
        ],
        'products.hotdeals' => [
            'title' => 'Hot Deals',
            'description' => 'Shop the biggest discounts on HaatPoint. Hand-picked deals from verified vendors across Bangladesh.',
        ],
        'stores.index' => [
            'title' => 'Stores',
            'description' => 'Discover the shops on HaatPoint and browse everything each local vendor sells.',
        ],
        'aboutus.index' => [
            'title' => 'About Us',
            'description' => 'HaatPoint connects local vendors with shoppers across Bangladesh, with no middlemen on everyday goods.',
        ],
        'contact.index' => [
            'title' => 'Contact Us',
            'description' => 'Get in touch with the HaatPoint team. Send us a message and we will get back to you.',
        ],
        'trackorder.index' => [
            'title' => 'Track Your Order',
            'description' => 'Check the current status of your HaatPoint order using your order number.',
        ],
        'privacy.policy' => [
            'title' => 'Privacy Policy',
            'description' => 'How HaatPoint collects, uses and protects your personal information.',
        ],
        'terms.and.conditions' => [
            'title' => 'Terms and Conditions',
            'description' => 'The terms that apply when you buy from or sell on HaatPoint.',
        ],
        // Not indexable, but still deserve their own tab title.
        'login' => [
            'title' => 'Login',
            'description' => 'Log in to your HaatPoint account to track orders, manage your wishlist and check out faster.',
        ],
        'register' => [
            'title' => 'Create an Account',
            'description' => 'Create a free HaatPoint account to shop, sell, or track your orders.',
        ],
        'password.request' => [
            'title' => 'Forgot Password',
            'description' => 'Reset the password on your HaatPoint account.',
        ],
        'cart.index' => [
            'title' => 'Shopping Cart',
            'description' => 'Review the items in your HaatPoint cart before you check out.',
        ],
        'wishlist.index' => [
            'title' => 'My Wishlist',
            'description' => 'The products you saved on HaatPoint.',
        ],
    ];

    /**
     * Pages that must never appear in search results. Account screens and
     * transactional pages have nothing to offer a searcher, and indexing them
     * dilutes the pages that do.
     */
    private const NO_INDEX_PREFIXES = ['login', 'register', 'password.', 'dashboard.', 'cart.', 'wishlist.', 'orders.'];

    public function handle(Request $request, Closure $next): Response
    {
        View::share('seo', $this->forRequest($request));

        return $next($request);
    }

    /**
     * @return array<string, string>
     */
    public function forRequest(Request $request): array
    {
        $routeName = $request->route()?->getName();

        [$title, $description, $ogType, $ogImage] = $this->contentFor($request, $routeName);

        return [
            'title' => $title,
            'description' => $description,
            'canonical' => $this->canonicalFor($request),
            'robots' => $this->robotsFor($routeName),
            'ogType' => $ogType,
            'ogTitle' => $title,
            'ogDescription' => $description,
            'ogImage' => $ogImage,
            'ogUrl' => $this->canonicalFor($request),
        ];
    }

    /**
     * @return array{0: string, 1: string, 2: string, 3: string}
     */
    private function contentFor(Request $request, ?string $routeName): array
    {
        $defaults = [
            self::SITE_NAME . " - Bangladesh's Premier Marketplace",
            self::DEFAULT_DESCRIPTION,
            'website',
            self::SITE_URL . '/og-image.png',
        ];

        if ($routeName === 'products.details') {
            return $this->productContent($request, $defaults);
        }

        if ($routeName === 'stores.show') {
            return $this->storeContent($request, $defaults);
        }

        if (isset(self::PAGES[$routeName])) {
            return [
                self::PAGES[$routeName]['title'] . ' | ' . self::SITE_NAME,
                self::PAGES[$routeName]['description'],
                'website',
                $defaults[3],
            ];
        }

        return $defaults;
    }

    /**
     * A product page is titled after the product itself, which is what a
     * shopper types into the search box.
     *
     * @param  array{0: string, 1: string, 2: string, 3: string}  $defaults
     * @return array{0: string, 1: string, 2: string, 3: string}
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
            ->first(['name', 'description', 'regular_price', 'sale_price', 'images', 'category']);

        if (! $product) {
            return $defaults;
        }

        $description = $this->trimDescription($product->description)
            ?: 'Buy ' . $product->name . ' on HaatPoint from verified local vendors across Bangladesh.';

        return [
            $product->name . ' | ' . self::SITE_NAME,
            $description,
            'product',
            $this->productImage($product->images) ?? $defaults[3],
        ];
    }

    /**
     * @param  array{0: string, 1: string, 2: string, 3: string}  $defaults
     * @return array{0: string, 1: string, 2: string, 3: string}
     */
    private function storeContent(Request $request, array $defaults): array
    {
        $store = Store::query()
            ->where('is_active', true)
            ->find($request->route('store'));

        if (! $store) {
            return $defaults;
        }

        return [
            $store->name . ' | ' . self::SITE_NAME,
            'Shop ' . $store->name . ' on HaatPoint. Browse this local vendor’s products, offers and customer reviews.',
            'website',
            $store->logo
                ? self::SITE_URL . '/storage/' . ltrim($store->logo, '/')
                : $defaults[3],
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

        return self::SITE_URL . '/storage/' . ltrim($path, '/');
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

    private function robotsFor(?string $routeName): string
    {
        foreach (self::NO_INDEX_PREFIXES as $prefix) {
            if ($routeName !== null && str_starts_with($routeName, $prefix)) {
                return 'noindex, follow';
            }
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
