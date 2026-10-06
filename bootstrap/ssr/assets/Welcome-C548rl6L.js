import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import Hero from "./HeroSection-CP0DlA7T.js";
import Categories from "./Categories-C-v-MUqP.js";
import Footer from "./Footer-BKydvVMb.js";
import TrendingProducts from "./TrandingProducts-SqNuFaRx.js";
import DailyDiscover from "./DailyDiscover-B8_mf7cc.js";
import OfferedProducts from "./OfferedProducts-CaBMQUAz.js";
import TopSellingProduct from "./TopSellingProduct-Btl1iLlr.js";
import StoresSlider from "./StoresSlider-DSueDPkY.js";
import VendorCTA from "./VendorCTA-CSKeBv3d.js";
import AllProducts from "./AllProducts-DR2kWYag.js";
import "./Navbar-I09bUsbF.js";
import "react";
import "@inertiajs/react";
import "react-icons/fi";
import "@headlessui/react";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "gsap";
import "@gsap/react";
import "swiper/react";
import "swiper/modules";
import "./Eyebrow-BL4QDtth.js";
/* empty css                */
/* empty css                  */
import "./ProductCard-Cpjc5ymN.js";
import "axios";
import "./AddtoCartButton-CZxthnYv.js";
import "./WishListButton-DoaUgqlu.js";
import "./ProductShowcase-BYMwkQb2.js";
/* empty css                    */
import "gsap/ScrollTrigger";
import "react-icons/ci";
function Welcome({
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
  productRatings
}) {
  const productsData = products.data || [];
  const productsWithRatings = productsData.map((product) => {
    const ratingData = productRatings[product.id];
    return {
      ...product,
      rating: ratingData?.average || 0,
      review: ratingData?.count || 0
    };
  });
  const topSellingProduct = topSelling ?? [];
  const offered = offeredProducts ?? [];
  const trending = trendingProducts ?? [];
  const dailyDiscover = dailyDiscoverProducts ?? [];
  const featuredStores = stores ?? [];
  const pageTitle = "HaatPoint - Bangladesh&apos;s Premier Marketplace";
  const pageDescription = "Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.";
  const keyword = "online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint";
  const Url = "https://www.haatpoint.com/";
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const itemListJsonLd = productsWithRatings.slice(0, 20).map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: `https://www.haatpoint.com/products/${product.id}`
  }));
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsxs(
      SeoHead,
      {
        title: pageTitle,
        description: pageDescription,
        keywords: keyword,
        canonical: Url,
        ogTitle: pageTitle,
        ogDescription: pageDescription,
        ogUrl: Url,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HaatPoint",
            url: Url,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${Url}products?search={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
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
              availableLanguage: ["en", "bn"]
            }
          },
          itemListJsonLd.length > 0 ? {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Featured Products at HaatPoint",
            numberOfItems: itemListJsonLd.length,
            itemListElement: itemListJsonLd
          } : void 0
        ].filter(Boolean),
        children: [
          /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0" }),
          /* @__PURE__ */ jsx("meta", { httpEquiv: "Content-Language", content: "en" }),
          /* @__PURE__ */ jsx("meta", { name: "author", content: "HaatPoint Team" }),
          /* @__PURE__ */ jsx("meta", { name: "copyright", content: `HaatPoint ${currentYear}` }),
          /* @__PURE__ */ jsx("meta", { name: "revisit-after", content: "7 days" }),
          /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
          /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-8 space-y-20", children: [
      /* @__PURE__ */ jsx(Hero, { user: auth.user }),
      categories && categories.length > 0 && /* @__PURE__ */ jsx(Categories, { categories }),
      offered.length > 0 && /* @__PURE__ */ jsx(OfferedProducts, { product: offered, user: auth.user }),
      trending.length > 0 && /* @__PURE__ */ jsx(TrendingProducts, { trandingproduct: trending, user: auth.user }),
      topSellingProduct.length > 0 && /* @__PURE__ */ jsx(
        TopSellingProduct,
        {
          products: topSellingProduct,
          user: auth.user,
          minSold: topSellingMinSold
        }
      ),
      dailyDiscover.length > 0 && /* @__PURE__ */ jsx(DailyDiscover, { discoverProduct: dailyDiscover, user: auth.user }),
      featuredStores.length > 0 && /* @__PURE__ */ jsx(StoresSlider, { stores: featuredStores }),
      productsWithRatings.length > 0 && /* @__PURE__ */ jsx(
        AllProducts,
        {
          product: productsWithRatings,
          user: auth.user,
          links: products.links,
          from: products.from,
          to: products.to,
          total: products.total
        }
      )
    ] }),
    /* @__PURE__ */ jsx(VendorCTA, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Welcome as default
};
