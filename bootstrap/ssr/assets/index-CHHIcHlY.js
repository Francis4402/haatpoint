import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import "./Navbar-I09bUsbF.js";
import "react";
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
function WishlistIndex({ wishlistProducts, auth }) {
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist: wishlistProducts, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: "My Wishlist", description: "View and manage your saved products on HaatPoint.", canonical: "https://www.haatpoint.com/wishlist", robots: "noindex, nofollow", ogTitle: "My Wishlist | HaatPoint", ogUrl: "https://www.haatpoint.com/wishlist" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-white rounded-xl shadow-hard-sm border border-line", children: /* @__PURE__ */ jsx(FaHeart, { className: "w-6 h-6 text-red-500" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-ink", children: "My Wishlist" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft ml-16", children: wishlistProducts.total > 0 ? `You have ${wishlistProducts.total} ${wishlistProducts.total === 1 ? "item" : "items"} saved for later` : "Start saving your favorite items" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-text-soft mb-6", children: [
        /* @__PURE__ */ jsx(Link, { href: "/", className: "hover:text-marigold transition-colors", children: "Home" }),
        /* @__PURE__ */ jsx("span", { children: "›" }),
        /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: "Wishlist" })
      ] }),
      !wishlistProducts.data || wishlistProducts.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-pink-50 to-red-50", children: /* @__PURE__ */ jsx(BiHeart, { className: "w-20 h-20 text-red-300" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-12 h-12 bg-marigold rounded-full flex items-center justify-center animate-bounce", children: /* @__PURE__ */ jsx(FaHeart, { className: "w-6 h-6 text-white" }) })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-ink mb-3", children: "Your wishlist is empty" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-8", children: "Looks like you haven't added any items to your wishlist yet. Browse our collection and save items you love!" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/products",
            className: "inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaHeart, { className: "w-5 h-5" }),
              "Start Shopping"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/",
            className: "inline-flex items-center gap-2 text-sm text-text-soft hover:text-marigold transition-colors",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "w-3 h-3" }),
              "Back to Home"
            ]
          }
        ) })
      ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5", children: wishlistProducts.data.map((product) => /* @__PURE__ */ jsx(
          ProductCard,
          {
            product,
            user: auth.user,
            variant: "default",
            showQuickView: true,
            initialAverageRating: wishlistProducts.productRatings?.[product.id]?.average || 0
          },
          product.id
        )) }),
        wishlistProducts.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `?page=${wishlistProducts.current_page - 1}`,
                className: `px-4 py-2 rounded-lg border border-line ${wishlistProducts.current_page === 1 ? "bg-paper-dim text-text-soft cursor-not-allowed" : "bg-white text-text-soft hover:bg-marigold hover:text-white hover:border-marigold transition-all duration-300"}`,
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: [...Array(Math.min(wishlistProducts.last_page, 5))].map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = wishlistProducts.current_page === pageNum;
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: `?page=${pageNum}`,
                  className: `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isCurrentPage ? "bg-gray-900 text-white font-medium" : "bg-white text-text-soft hover:bg-marigold/10 hover:text-marigold"}`,
                  children: pageNum
                },
                pageNum
              );
            }) }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `?page=${wishlistProducts.current_page + 1}`,
                className: `px-4 py-2 rounded-lg border border-line ${wishlistProducts.current_page === wishlistProducts.last_page ? "bg-paper-dim text-text-soft cursor-not-allowed" : "bg-white text-text-soft hover:bg-marigold hover:text-white hover:border-marigold transition-all duration-300"}`,
                children: "Next"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-text-soft", children: [
            "Showing ",
            wishlistProducts.data.length,
            " of ",
            wishlistProducts.total,
            " items"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  WishlistIndex as default
};
