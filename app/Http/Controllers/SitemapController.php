<?php

namespace App\Http\Controllers;

use App\Http\Middleware\SeoMeta;
use App\Models\Products;
use App\Models\Store;
use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    /**
     * Builds an absolute URL on the canonical origin.
     *
     * url() and route() derive the host from APP_URL, so a deployment with the
     * apex host or a stale APP_URL would publish <loc> entries that disagree
     * with the canonical tags in the page head and with robots.txt. Google
     * discards a sitemap whose host does not match, so the origin is pinned to
     * the same constant the <head> canonical uses.
     */
    private function absolute(string $path): string
    {
        return SeoMeta::SITE_URL . '/' . ltrim($path, '/');
    }

    /**
     * Only sets lastmod when a real date exists. Stamping the current time on
     * every response tells crawlers the whole sitemap is fresh each crawl,
     * which is the same churn problem the static pages used to have.
     */
    private function withLastModified(Url $url, $date): Url
    {
        return $date ? $url->setLastModificationDate($date) : $url;
    }

    public function index()
    {
        $sitemap = Sitemap::create();

        // Static pages with proper priorities and change frequencies
        $staticPages = [
            '/' => ['priority' => 1.0, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/products' => ['priority' => 0.9, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/categories' => ['priority' => 0.9, 'frequency' => Url::CHANGE_FREQUENCY_WEEKLY],
            '/new-arrivals' => ['priority' => 0.9, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/hotdeals' => ['priority' => 0.8, 'frequency' => Url::CHANGE_FREQUENCY_DAILY],
            '/stores' => ['priority' => 0.8, 'frequency' => Url::CHANGE_FREQUENCY_WEEKLY],
            '/contactus' => ['priority' => 0.5, 'frequency' => Url::CHANGE_FREQUENCY_MONTHLY],
            '/aboutus' => ['priority' => 0.5, 'frequency' => Url::CHANGE_FREQUENCY_MONTHLY],
            '/track-order' => ['priority' => 0.3, 'frequency' => Url::CHANGE_FREQUENCY_YEARLY],
            '/privacy-policy' => ['priority' => 0.3, 'frequency' => Url::CHANGE_FREQUENCY_YEARLY],
            '/terms-and-conditions' => ['priority' => 0.3, 'frequency' => Url::CHANGE_FREQUENCY_YEARLY],
        ];

        foreach ($staticPages as $path => $config) {
            $sitemap->add(
                Url::create($this->absolute($path))
                    ->setPriority($config['priority'])
                    ->setChangeFrequency($config['frequency'])
            );
        }

        return $sitemap->toResponse(request());
    }

    public function sitemapIndex()
    {
        $newestProductEdit = Products::visible()->where('inStock', true)->max('updated_at');
        $newestStoreEdit = Store::where('is_active', true)->max('updated_at');
        
        $formatDate = function ($date) {
            if (!$date) return now()->toDateString();
            if ($date instanceof \Carbon\CarbonInterface) return $date->toDateString();
            return substr((string) $date, 0, 10);
        };

        $lastMod = $formatDate($newestProductEdit ?? $newestStoreEdit);

        $sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $sitemapIndex .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Main sitemap (Static pages, Categories, etc.)
        $sitemapIndex .= '  <sitemap>' . "\n";
        $sitemapIndex .= '    <loc>' . $this->absolute('/sitemap-main.xml') . '</loc>' . "\n";
        $sitemapIndex .= '    <lastmod>' . $lastMod . '</lastmod>' . "\n";
        $sitemapIndex .= '  </sitemap>' . "\n";

        // Product sitemaps (paginated in chunks of 1000)
        $totalProducts = Products::visible()->where('inStock', true)->count();
        $perPage = 1000;
        $totalPages = (int) max(1, ceil($totalProducts / $perPage));

        for ($i = 1; $i <= $totalPages; $i++) {
            $sitemapIndex .= '  <sitemap>' . "\n";
            $sitemapIndex .= '    <loc>' . $this->absolute("/sitemap-products-{$i}.xml") . '</loc>' . "\n";
            $sitemapIndex .= '    <lastmod>' . $lastMod . '</lastmod>' . "\n";
            $sitemapIndex .= '  </sitemap>' . "\n";
        }

        // Store sitemaps
        $totalStores = Store::where('is_active', true)->count();
        $totalStorePages = (int) max(1, ceil($totalStores / $perPage));

        for ($i = 1; $i <= $totalStorePages; $i++) {
            $sitemapIndex .= '  <sitemap>' . "\n";
            $sitemapIndex .= '    <loc>' . $this->absolute("/sitemap-stores-{$i}.xml") . '</loc>' . "\n";
            $sitemapIndex .= '    <lastmod>' . $formatDate($newestStoreEdit) . '</lastmod>' . "\n";
            $sitemapIndex .= '  </sitemap>' . "\n";
        }

        $sitemapIndex .= '</sitemapindex>';

        return response($sitemapIndex, 200)
            ->header('Content-Type', 'application/xml');
    }

    public function productSitemap($page = 1)
    {
        $perPage = 1000;
        $products = Products::where('inStock', true)
            ->visible()
            ->select('id', 'slug', 'updated_at', 'name')
            ->paginate($perPage, ['*'], 'page', $page);

        $sitemap = Sitemap::create();

        foreach ($products as $product) {
            $slug = !empty($product->slug) ? $product->slug : $product->id;
            $sitemap->add(
                $this->withLastModified(
                    Url::create($this->absolute('/products/' . $slug))
                        ->setPriority(0.8)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY),
                    $product->updated_at
                )
            );
        }

        return $sitemap->toResponse(request());
    }

    public function storeSitemap($page = 1)
    {
        $perPage = 1000;
        $stores = Store::where('is_active', true)->select('id', 'name', 'updated_at')
            ->paginate($perPage, ['*'], 'page', $page);

        $sitemap = Sitemap::create();

        foreach ($stores as $store) {
            $slug = Store::slugifyName($store->name);
            $sitemap->add(
                $this->withLastModified(
                    Url::create($this->absolute('/stores/' . $slug))
                        ->setPriority(0.7)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY),
                    $store->updated_at
                )
            );
        }

        return $sitemap->toResponse(request());
    }

    public function imageSitemap()
    {
        $xml = new \XMLWriter();
        $xml->openMemory();
        $xml->setIndent(true);
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('urlset');
        $xml->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $xml->writeAttribute('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1');

        Products::visible()
            ->where('inStock', true)
            // slug has to be selected here or every <loc> below collapses to
            // /products/ with no identifier.
            ->select('id', 'slug', 'name', 'images', 'updated_at')
            ->chunk(100, function ($products) use ($xml) {
                foreach ($products as $product) {
                    $images = json_decode($product->images, true) ?? [];

                    if (empty($images)) {
                        continue;
                    }

                    $xml->startElement('url');
                    $xml->writeElement(
                        'loc',
                        $this->absolute(route('products.details', $product->slug, false))
                    );

                    if ($product->updated_at) {
                        $xml->writeElement('lastmod', $product->updated_at->toDateString());
                    }

                    // Add each image
                    foreach ($images as $image) {
                        $xml->startElement('image:image');
                        $xml->writeElement('image:loc', $this->getFullImageUrl($image));
                        $xml->writeElement('image:title', $product->name);
                        $xml->writeElement('image:caption', "Buy {$product->name} at HaatPoint");
                        $xml->endElement();
                    }

                    $xml->endElement();
                }
            });

        $xml->endElement();
        $xml->endDocument();

        return response($xml->outputMemory(), 200)
            ->header('Content-Type', 'application/xml');
    }

    private function getFullImageUrl($image)
    {
        if (filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }

        return SeoMeta::SITE_URL . '/storage/' . ltrim($image, '/');
    }
}
