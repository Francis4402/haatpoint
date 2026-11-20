import {
    categoryType,
    PageProps,
    Product,
    ReviewType,
    storeType,
} from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import HeroSection from "./Components/HeroSection";
import Categories from "./Components/Categories";
import Footer from "./Components/Footer";
import TrendingProducts from "./Components/TrandingProducts";
import DailyDiscover from "./Components/DailyDiscover";
import OfferedProducts from "./Components/OfferedProducts";
import TopSellingProduct from "./Components/TopSellingProduct";
import StoresSlider from "./Components/StoresSlider";
import VendorCTA from "./Components/VendorCTA";
import AllProducts from "./Components/AllProducts";
import SeoHead from "@/Components/SeoHead";
import WhatsAppChatButton from "@/Components/WhatsAppChatButton";
import MarketplaceLinksHub from "./Components/MarketplaceLinksHub";
import AdSenseDisplay from "@/Components/AdSenseDisplay";
import AdSenseMultiplex from "@/Components/AdSenseMultiplex";

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
    from: number;
    to: number;
}

interface ProductRating {
    average: number;
    count: number;
}

export default function Welcome({
    auth,
    categories,
    products,
    topSelling,
    topSellingMinSold,
    offeredProducts,
    trendingProducts,
    dailyDiscoverProducts,
    stores,
    wishlist,
    productRatings,
}: PageProps<{
    laravelVersion: string;
    phpVersion: string;
    categories: categoryType[];
    products: PaginatedProducts;
    topSelling?: (Product & { sold_count: number })[];
    topSellingMinSold?: number;
    offeredProducts: Product[];
    trendingProducts: Product[];
    dailyDiscoverProducts: Product[];
    stores: (storeType & { products_count?: number })[];
    wishlist: any;
    reviews: ReviewType[];
    productRatings: Record<string, ProductRating>;
}>) {
    const productsData = products.data || [];

    const productsWithRatings = productsData.map((product) => {
        const ratingData = productRatings[product.id];
        return {
            ...product,
            rating: ratingData?.average || 0,
            review: ratingData?.count || 0,
        };
    });

    const topSellingProduct = topSelling ?? [];
    const offered = offeredProducts ?? [];
    const trending = trendingProducts ?? [];
    const dailyDiscover = dailyDiscoverProducts ?? [];
    const featuredStores = stores ?? [];

    const keyword =
        "online shopping Bangladesh, best online shopping site in Bangladesh, multivendor marketplace BD, cash on delivery online shopping, buy online BD, online shopping bd cash on delivery, ecommerce Bangladesh, online shop bd, electronics online shopping bd, smart watch price in bangladesh, tws earbuds bd, mens fashion bd, saree collection online bd, home decor bd, best price in bangladesh, trusted online shop bd, HaatPoint, haatpoint.com, হাটপয়েন্ট, অনলাইন শপিং বাংলাদেশ, অনলাইনে কেনাকাটা, সেরা অনলাইন শপ, ক্যাশ অন ডেলিভারি";
    const Url = "https://www.haatpoint.com/";
    const currentYear = new Date().getFullYear();

    const itemListJsonLd = productsWithRatings
        .slice(0, 20)
        .map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `https://www.haatpoint.com/products/${product.slug || product.id}`,
        }));

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead
                keywords={keyword}
                jsonLd={
                    [
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "HaatPoint",
                            url: Url,
                            potentialAction: {
                                "@type": "SearchAction",
                                target: {
                                    "@type": "EntryPoint",
                                    urlTemplate: `${Url}products?search={search_term_string}`,
                                },
                                "query-input":
                                    "required name=search_term_string",
                            },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "HaatPoint",
                            url: Url,
                            logo: "https://www.haatpoint.com/og-image.png",
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: "+8801319052507",
                                contactType: "customer service",
                                areaServed: "BD",
                                availableLanguage: ["en", "bn"],
                            },
                        },
                        itemListJsonLd.length > 0
                            ? {
                                  "@context": "https://schema.org",
                                  "@type": "ItemList",
                                  name: "Featured Products at HaatPoint",
                                  numberOfItems: itemListJsonLd.length,
                                  itemListElement: itemListJsonLd,
                              }
                            : undefined,
                    ].filter(Boolean) as Record<string, unknown>[]
                }
            >
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
                />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="author" content="HaatPoint Team" />
                <meta name="copyright" content={`HaatPoint ${currentYear}`} />
                <meta name="revisit-after" content="7 days" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </SeoHead>
            <div className="container space-y-20">
                <HeroSection user={auth.user} categories={categories} />

                {categories && categories.length > 0 && (
                    <Categories categories={categories} />
                )}

                {offered.length > 0 && (
                    <OfferedProducts product={offered} user={auth.user} />
                )}

                {trending.length > 0 && (
                    <TrendingProducts
                        trendingProducts={trending}
                        trandingproduct={trending}
                        user={auth.user}
                    />
                )}

                {topSellingProduct.length > 0 && (
                    <TopSellingProduct
                        products={topSellingProduct}
                        user={auth.user}
                        minSold={topSellingMinSold}
                    />
                )}

                {/* Strategic Mid-Feed Display Ad */}
                <AdSenseDisplay className="max-w-4xl mx-auto my-8" />

                {dailyDiscover.length > 0 && (
                    <DailyDiscover
                        discoverProduct={dailyDiscover}
                        user={auth.user}
                    />
                )}

                {/* All Products Catalog - Rich & Full */}
                {productsWithRatings.length > 0 && (
                    <AllProducts
                        product={productsWithRatings}
                        user={auth.user}
                        links={products.links}
                        from={products.from}
                        to={products.to}
                        total={products.total}
                    />
                )}

                {featuredStores.length > 0 && (
                    <StoresSlider stores={featuredStores} />
                )}
            </div>

            {/* Quality & Trust Perks Section (Edge-to-Edge) */}
            <VendorCTA />

            <div className="container space-y-12 pt-12">
                {/* Multiplex Grid Recommendations below Products Catalog */}
                <AdSenseMultiplex
                    className="my-10"
                    title="Recommended Sponsored Products"
                />

                {/* Internal Links & Marketplace Directory */}
                <MarketplaceLinksHub categories={categories} />
            </div>
            <Footer />
            <WhatsAppChatButton />
        </AppLayout>
    );
}
