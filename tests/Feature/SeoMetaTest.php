<?php

namespace Tests\Feature;

use App\Http\Middleware\SeoMeta;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * The Inertia shell used to hardcode one canonical URL and one title for the
 * whole site, which told crawlers every page duplicated the home page. These
 * tests pin the server-rendered head tags that replaced it.
 */
class SeoMetaTest extends TestCase
{
    use RefreshDatabase;

    private function makeStore(bool $active = true): Store
    {
        $owner = User::create([
            'name' => 'Owner ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        return Store::create([
            'user_id' => $owner->id,
            'name' => 'Apna Store',
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka, Bangladesh',
            'mobile' => '017' . uniqid(),
            'storetype' => 'general',
            'national_id' => '1' . uniqid(),
            'is_active' => $active,
        ]);
    }

    private function makeProduct(Store $store, string $slug = 'a-product', string $name = 'A Product'): Products
    {
        return Products::create([
            'user_id' => $store->user_id,
            'store_id' => $store->id,
            'name' => $name,
            'images' => json_encode(['products/one.jpg']),
            'slug' => $slug,
            'category' => 'Electronics',
            'subcategory' => 'Phones',
            'brand' => 'Brand',
            'regular_price' => '500.00',
            'description' => 'A genuinely useful description of this product for search engines.',
            'item_weight' => '1.00',
            'product_type' => 'regular',
        ]);
    }

    public function test_the_canonical_url_matches_the_page_instead_of_the_home_page(): void
    {
        $response = $this->get('/aboutus');

        $response->assertOk()
            ->assertSee('<link rel="canonical" href="https://www.haatpoint.com/aboutus">', false);
    }

    public function test_no_page_points_its_canonical_at_the_home_page_by_accident(): void
    {
        foreach (['/aboutus', '/contactus', '/products', '/stores', '/track-order', '/new-arrivals', '/hotdeals'] as $path) {
            $response = $this->get($path);

            $response->assertOk();

            $expected = SeoMeta::SITE_URL . $path;

            $this->assertStringContainsString(
                '<link rel="canonical" href="' . $expected . '">',
                $response->getContent(),
                $path . ' does not canonicalise to itself'
            );
        }
    }

    public function test_every_public_page_has_its_own_title(): void
    {
        $titles = [];

        foreach (['/aboutus', '/contactus', '/products', '/stores', '/track-order'] as $path) {
            $content = $this->get($path)->assertOk()->getContent();

            preg_match('#<title>(.*?)</title>#s', $content, $matches);

            $title = trim($matches[1] ?? '');

            $this->assertNotSame('', $title, $path . ' has an empty title');
            $this->assertStringContainsString('HaatPoint', $title, $path . ' title lacks the brand');
            $this->assertNotSame('HaatPoint', $title, $path . ' still falls back to the bare app name');

            $titles[] = $title;
        }

        $this->assertCount(
            count($titles),
            array_unique($titles),
            'pages are sharing a duplicate title: ' . implode(' | ', $titles)
        );
    }

    public function test_a_product_page_is_titled_after_the_product(): void
    {
        $store = $this->makeStore();
        $product = $this->makeProduct($store, 'red-phones', 'Red Phones 128GB');

        $response = $this->get(route('products.details', $product->slug));

        $response->assertOk()
            ->assertSee('Red Phones 128GB | HaatPoint', false)
            ->assertSee('<link rel="canonical" href="https://www.haatpoint.com/products/red-phones">', false)
            ->assertSee('A genuinely useful description of this product for search engines.', false);
    }

    public function test_a_product_page_is_marked_as_a_product_for_sharing(): void
    {
        $store = $this->makeStore();
        $product = $this->makeProduct($store, 'blue-phones', 'Blue Phones');

        $this->get(route('products.details', $product->slug))
            ->assertOk()
            ->assertSee('<meta property="og:type" content="product">', false);
    }

    public function test_a_store_page_is_titled_after_the_store(): void
    {
        $store = $this->makeStore();

        $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->assertSee('Apna Store | HaatPoint', false)
            ->assertSee('<link rel="canonical" href="https://www.haatpoint.com/stores/' . $store->id . '">', false);
    }

    public function test_an_inactive_store_does_not_leak_a_store_title(): void
    {
        $store = $this->makeStore(active: false);

        // The controller hides inactive stores, so there is no page to optimise.
        $response = $this->get(route('stores.show', $store->id));

        $response->assertNotFound();
        $this->assertStringNotContainsString(
            'Apna Store | HaatPoint',
            $response->getContent() ?: ''
        );
    }

    public function test_a_product_page_ignores_a_product_from_an_inactive_store(): void
    {
        $store = $this->makeStore(active: false);
        $product = $this->makeProduct($store, 'hidden-product', 'Hidden Product');

        $response = $this->get(route('products.details', $product->slug));

        $response->assertNotFound();
        $this->assertStringNotContainsString(
            'Hidden Product | HaatPoint',
            $response->getContent() ?: ''
        );
    }

    public function test_the_home_page_canonical_has_no_trailing_slash_mismatch(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<link rel="canonical" href="' . SeoMeta::SITE_URL . '">', false);
    }

    public function test_a_query_string_does_not_leak_into_the_canonical(): void
    {
        $content = $this->get('/products?product_type=featured&page=2')->assertOk()->getContent();

        $this->assertStringContainsString(
            '<link rel="canonical" href="https://www.haatpoint.com/products">',
            $content
        );

        // The filter URLs are dropped from the sitemap for the same reason.
        $sitemap = $this->get('/sitemap.xml')->assertOk()->getContent();
        $this->assertStringNotContainsString('product_type=', $sitemap);
    }

    public function test_public_pages_are_indexable(): void
    {
        foreach (['/', '/aboutus', '/products', '/stores'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('<meta name="robots" content="index, follow">', false);
        }
    }

    public function test_account_and_transactional_pages_are_noindex(): void
    {
        foreach (['/cart', '/login', '/register'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('<meta name="robots" content="noindex, follow">', false);
        }
    }

    /**
     * Checkout is a bare route name rather than an `orders.` child, and the
     * settings screens are `profile.*` / `vendor.*` — none of them matched the
     * old prefix list, so the shell told Google to index them even though the
     * page itself asked not to be.
     */
    public function test_routes_that_must_never_be_indexed_are_noindex(): void
    {
        $seo = new SeoMeta;

        $routes = [
            'checkout' => '/checkout',
            'profile.edit' => '/dashboard/profile',
            'vendor.profile.edit' => '/dashboard/vendor/profile',
            'cart.index' => '/cart',
            'wishlist.index' => '/wishlist',
            'dashboard.products' => '/dashboard/products',
            'login' => '/login',
            'register' => '/register',
        ];

        foreach ($routes as $name => $uri) {
            $route = Route::getRoutes()->getByName($name);
            $this->assertNotNull($route, 'missing route ' . $name);

            $request = Request::create($uri);
            $request->setRouteResolver(fn () => $route);

            $computed = $seo->forRequest($request);

            $this->assertSame('noindex, follow', $computed['robots'], $name . ' is indexable');
            $this->assertNotSame('', $computed['title'], $name . ' has no title');
            $this->assertNotSame('', $computed['description'], $name . ' has no description');
        }
    }

    public function test_a_missing_page_is_noindex_and_does_not_claim_to_be_the_home_page(): void
    {
        $response = $this->get('/this-page-does-not-exist');

        $response->assertNotFound();

        $content = $response->getContent();

        $this->assertStringContainsString(
            '<meta name="robots" content="noindex, follow">',
            $content
        );

        // A 404 that canonicalises to the home page tells Google every broken
        // URL is a copy of the front page.
        $this->assertStringNotContainsString('rel="canonical"', $content);
        $this->assertStringContainsString('Page Not Found (404) | HaatPoint', $content);
    }

    public function test_a_page_prints_exactly_one_canonical_tag(): void
    {
        foreach (['/', '/aboutus', '/products', '/products?product_type=featured', '/stores'] as $path) {
            $content = $this->get($path)->assertOk()->getContent();

            $this->assertSame(
                1,
                substr_count($content, 'rel="canonical"'),
                $path . ' should print exactly one canonical tag'
            );
        }
    }

    /**
     * SeoHead only runs after JavaScript, so it has to mirror these values
     * rather than compute its own — otherwise the head Google renders differs
     * from the head a crawler sees before JS.
     */
    public function test_the_computed_seo_is_handed_to_the_react_head_too(): void
    {
        $this->get('/aboutus')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('seo.canonical', 'https://www.haatpoint.com/aboutus')
                ->where('seo.robots', 'index, follow')
                ->has('seo.title'));
    }

    public function test_the_sitemap_does_not_churn_its_lastmod_between_requests(): void
    {
        $this->makeStore();
        $store = Store::first();
        $this->makeProduct($store, 'steady-product', 'Steady Product');

        $first = $this->get('/sitemap.xml')->assertOk()->getContent();
        $second = $this->get('/sitemap.xml')->assertOk()->getContent();

        // Static pages carry no lastmod at all, so nothing moves between crawls.
        $this->assertStringNotContainsString('<lastmod>now</lastmod>', $first);

        preg_match_all('#<lastmod>(.*?)</lastmod>#', $first, $a);
        preg_match_all('#<lastmod>(.*?)</lastmod>#', $second, $b);

        sort($a[1]);
        sort($b[1]);

        $this->assertSame(
            $a[1],
            $b[1],
            'sitemap lastmod values changed between two identical requests'
        );
    }

    public function test_the_sitemap_lists_products_and_stores(): void
    {
        $store = $this->makeStore();
        $this->makeProduct($store, 'listed-product', 'Listed Product');

        $sitemap = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('/products/listed-product', $sitemap);
        $this->assertStringContainsString('/stores/' . $store->id, $sitemap);
    }

    public function test_every_sitemap_url_uses_the_same_host_as_the_canonical_tags(): void
    {
        $store = $this->makeStore();
        $this->makeProduct($store, 'host-product', 'Host Product');

        $sitemap = $this->get('/sitemap.xml')->assertOk()->getContent();

        preg_match_all('#<loc>(.*?)</loc>#', $sitemap, $matches);
        $locations = $matches[1];

        $this->assertNotEmpty($locations);

        foreach ($locations as $loc) {
            $this->assertStringStartsWith(
                SeoMeta::SITE_URL,
                $loc,
                'sitemap URL is on a different host than the canonical: ' . $loc
            );
        }

        // APP_URL is http://127.0.0.1 locally, so a sitemap built from url()
        // would advertise localhost to Google.
        $this->assertStringNotContainsString('127.0.0.1', $sitemap);
    }

    public function test_robots_txt_points_at_the_same_host_as_the_sitemap(): void
    {
        $robots = file_get_contents(public_path('robots.txt'));

        $this->assertStringContainsString(
            'Sitemap: https://www.haatpoint.com/sitemap.xml',
            $robots
        );

        // The apex host 301-redirects to www, so declaring it cost a redirect hop.
        $this->assertStringNotContainsString(
            'Sitemap: https://haatpoint.com/sitemap.xml',
            $robots
        );
    }
}
