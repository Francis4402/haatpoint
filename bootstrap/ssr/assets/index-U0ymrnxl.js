import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaChevronRight, FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTruck, FaUndo, FaShieldAlt, FaHeadset, FaFilter, FaSearch, FaShoppingBag, FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import StoreReviewForm from "./StoreReviewForm-blFt8n5H.js";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "@headlessui/react";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "axios";
import "./AddtoCartButton-CZxthnYv.js";
import "./WishListButton-DoaUgqlu.js";
function StoreShow({
  auth,
  store,
  products,
  wishlist,
  storeRating = { average: 0, count: 0 },
  productRatings = {},
  userStoreRating = null,
  canReview = false
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const ratingAverage = Number(storeRating?.average) || Number(store.rating) || 0;
  const ratingCount = Number(storeRating?.count) || Number(store.review_count) || 0;
  const categories = Array.from(
    new Set(products.data.map((p) => p.category).filter(Boolean))
  );
  const productsWithRatings = products.data.map((product) => {
    const ratingData = productRatings[product.id];
    return {
      ...product,
      calculatedRating: ratingData?.average || product.rating || 0,
      reviewCount: ratingData?.count || 0
    };
  });
  const filteredProducts = productsWithRatings.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
      case "price-high":
        return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
      case "rating":
        return (b.calculatedRating || 0) - (a.calculatedRating || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return /* @__PURE__ */ jsx(FaStar, { className: "w-4 h-4 text-yellow-400 fill-current" }, i);
      } else if (i === fullStars && hasHalfStar) {
        return /* @__PURE__ */ jsx(FaStarHalf, { className: "w-4 h-4 text-yellow-400 fill-current" }, i);
      } else {
        return /* @__PURE__ */ jsx(FaRegStar, { className: "w-4 h-4 text-gray-300" }, i);
      }
    }) });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: store.name,
        description: `${store.name} is a trusted ${store.storetype} store on HaatPoint. Shop quality products from ${store.name} in Bangladesh.`,
        canonical: `https://www.haatpoint.com/stores/${store.id}`,
        ogTitle: `${store.name} - Shop on HaatPoint`,
        ogDescription: `${store.name} is a trusted ${store.storetype} store on HaatPoint. Shop quality products from ${store.name} in Bangladesh.`,
        ogUrl: `https://www.haatpoint.com/stores/${store.id}`,
        ogImage: store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : "https://www.haatpoint.com/og-image.png",
        twitterImage: store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : "https://www.haatpoint.com/og-image.png",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Store",
          name: store.name,
          image: store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : "https://www.haatpoint.com/og-image.png",
          url: `https://www.haatpoint.com/stores/${store.id}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: store.address,
            addressCountry: "BD"
          },
          telephone: store.mobile,
          email: store.email,
          ...Number(storeRating.average || store.rating) > 0 ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: String(Number(storeRating.average || store.rating)),
              reviewCount: String(Number(storeRating.count || store.review_count) || 0),
              bestRating: "5",
              worstRating: "1"
            }
          } : {}
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim min-h-screen py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-2 text-sm mb-8", children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "text-text-soft hover:text-marigold transition-colors", children: "Home" }),
        /* @__PURE__ */ jsx(FaChevronRight, { className: "h-3 w-3 text-text-soft" }),
        /* @__PURE__ */ jsx(Link, { href: "/stores", className: "text-text-soft hover:text-marigold transition-colors", children: "Stores" }),
        /* @__PURE__ */ jsx(FaChevronRight, { className: "h-3 w-3 text-text-soft" }),
        /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: store.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "h-48 bg-gradient-to-r from-marigold to-marigold-dark relative", children: store.logo && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 left-8", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl border-4 border-white shadow-hard-sm overflow-hidden bg-white", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: `/storage/${store.logo}`,
            alt: store.name,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.style.display = "none";
            }
          }
        ) }) }) }),
        /* @__PURE__ */ jsxs("div", { className: `p-6 ${store.logo ? "pt-16" : "pt-6"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-2", children: store.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 bg-marigold/10 text-marigold rounded-full text-sm font-medium border border-marigold/20", children: [
                  /* @__PURE__ */ jsx(FaStore, { className: "mr-1 h-3 w-3" }),
                  store.storetype
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  renderStars(ratingAverage),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft ml-1", children: [
                    "(",
                    ratingCount,
                    " ",
                    ratingCount === 1 ? "review" : "reviews",
                    ")"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: store.products_count ?? products.total }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "Products" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: ratingCount }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "Reviews" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", children: [
            store.address && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-text-soft", children: [
              /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: store.address })
            ] }),
            store.mobile && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-text-soft", children: [
              /* @__PURE__ */ jsx(FaPhone, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: store.mobile })
            ] }),
            store.email && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-text-soft", children: [
              /* @__PURE__ */ jsx(FaEnvelope, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: store.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-text-soft", children: [
            "Member since ",
            new Date(store.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300", children: [
          /* @__PURE__ */ jsx(FaTruck, { className: "h-6 w-6 text-marigold mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: "Free Delivery" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "On orders over ৳1000" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300", children: [
          /* @__PURE__ */ jsx(FaUndo, { className: "h-6 w-6 text-green-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: "Easy Returns" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "7 days return" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300", children: [
          /* @__PURE__ */ jsx(FaShieldAlt, { className: "h-6 w-6 text-purple-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: "Warranty" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "1 year warranty" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300", children: [
          /* @__PURE__ */ jsx(FaHeadset, { className: "h-6 w-6 text-orange-600 mx-auto mb-2" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: "24/7 Support" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Live chat" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx(
        StoreReviewForm,
        {
          storeId: store.id,
          storeName: store.name,
          isAuthenticated: canReview,
          existingReview: userStoreRating
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Browse products" }),
        /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px] mb-6", children: "Store Products" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:w-1/4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-24", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaFilter, { className: "h-5 w-5 text-marigold" }),
              "Filters"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Categories" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelectedCategory("all"),
                    className: `block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === "all" ? "bg-marigold/10 text-marigold font-medium" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
                    children: "All Categories"
                  }
                ),
                categories.map((category) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelectedCategory(category),
                    className: `block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category ? "bg-marigold/10 text-marigold font-medium" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
                    children: category
                  },
                  category
                ))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Sort By" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: "w-full p-2.5 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "featured", children: "Featured" }),
                    /* @__PURE__ */ jsx("option", { value: "price-low", children: "Price: Low to High" }),
                    /* @__PURE__ */ jsx("option", { value: "price-high", children: "Price: High to Low" }),
                    /* @__PURE__ */ jsx("option", { value: "rating", children: "Top Rated" }),
                    /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest" })
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "lg:w-3/4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-4 mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search products in this store...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "w-full pl-10 pr-4 py-2.5 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-text-soft", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filteredProducts.length }),
                " products found"
              ] })
            ] }),
            filteredProducts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6", children: filteredProducts.map((product) => /* @__PURE__ */ jsx(
              ProductCard,
              {
                product,
                user: auth.user,
                initialAverageRating: product.calculatedRating
              },
              product.id
            )) }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-12 text-center", children: [
              /* @__PURE__ */ jsx(FaShoppingBag, { className: "h-16 w-16 mx-auto mb-4 text-text-soft" }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No products found" }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "Try adjusting your search or filter to find what you're looking for." })
            ] }),
            products.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx("nav", { className: "flex flex-wrap items-center gap-1", children: products.links.map((link, index) => link.url === null ? /* @__PURE__ */ jsx(
              "span",
              {
                className: "px-3 py-2 text-sm text-text-soft opacity-50",
                dangerouslySetInnerHTML: { __html: link.label }
              },
              index
            ) : /* @__PURE__ */ jsx(
              Link,
              {
                href: link.url,
                preserveScroll: true,
                className: `px-3.5 py-2 text-sm rounded-xl border transition-all duration-200 ${link.active ? "bg-marigold text-white border-marigold" : "bg-white text-ink border-line hover:border-marigold"}`,
                dangerouslySetInnerHTML: { __html: link.label }
              },
              index
            )) }) })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  StoreShow as default
};
