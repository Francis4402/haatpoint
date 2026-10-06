import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import { CiImageOn } from "react-icons/ci";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import "react-icons/fa";
import "react-icons/fi";
import "axios";
import "./AddtoCartButton-CZxthnYv.js";
import "sonner";
import "./cartStore-BOd_ZlZA.js";
import "zustand";
import "zustand/middleware";
import "./languageStore-DF0bQFKG.js";
import "./FormatePrice-CMWyewFT.js";
import "react-lazy-load-image-component";
import "./WishListButton-DoaUgqlu.js";
const HEADER_VARIANTS = [
  {
    eyebrow: "Find Your Product",
    heading: "All Products",
    subtext: "Don't miss out on these exclusive deals!"
  },
  {
    eyebrow: "Shop the Collection",
    heading: "Everything In Store",
    subtext: "Fresh picks, updated all the time."
  },
  {
    eyebrow: "Browse & Discover",
    heading: "Explore Our Range",
    subtext: "Something for everyone, at every price."
  },
  {
    eyebrow: "Handpicked For You",
    heading: "Top Picks Today",
    subtext: "Curated favorites from across the store."
  },
  {
    eyebrow: "New & Notable",
    heading: "What We Have",
    subtext: "Take a look before it sells out."
  }
];
const AllProducts = ({ product, user, links, from, to, total }) => {
  const [headerCopy] = useState(
    () => HEADER_VARIANTS[Math.floor(Math.random() * HEADER_VARIANTS.length)]
  );
  const restoreY = useRef(null);
  const keepScrollPosition = (url) => {
    restoreY.current = window.scrollY;
    router.get(url, {}, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => {
        const y = restoreY.current;
        if (y === null) return;
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
          setTimeout(() => {
            if (restoreY.current !== null) {
              window.scrollTo(0, restoreY.current);
            }
          }, 180);
        });
      }
    });
  };
  const allproducts = useMemo(() => {
    if (!product || product.length === 0) return [];
    return product.map((item) => ({
      ...item,
      rating: typeof item.rating === "string" ? parseFloat(item.rating) : Number(item.rating) || 0
    }));
  }, [product]);
  if (!allproducts.length) {
    return /* @__PURE__ */ jsx("section", { id: "offers", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-end flex-wrap gap-4 mb-9", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: headerCopy.eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: headerCopy.heading }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: headerCopy.subtext })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(CiImageOn, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "No products available" })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx("section", { className: "", id: "offers", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end flex-wrap gap-4 mb-9", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: headerCopy.eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: headerCopy.heading }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: headerCopy.subtext })
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("products.index"),
          className: "font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:text-primary transition-colors",
          children: "View all →"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5", children: allproducts.map((offer) => /* @__PURE__ */ jsx(
      ProductCard,
      {
        product: offer,
        badge: offer.sale_price && offer.sale_price < offer.regular_price ? "Sale" : void 0,
        variant: "default",
        showQuickView: true,
        user
      },
      offer.id
    )) }),
    links && links.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-[#E3E1DB]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-[#767470]", children: [
        "Showing ",
        from || 0,
        "-",
        to || 0,
        " of ",
        total ?? allproducts.length,
        " products"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 flex-wrap", children: links.map((link, index) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            if (link.url) {
              keepScrollPosition(link.url);
            }
          },
          disabled: !link.url,
          className: `px-3 py-1.5 text-sm rounded-lg transition-colors ${link.active ? "bg-gray-900 text-white font-medium" : link.url ? "border border-[#E3E1DB] text-[#767470] hover:bg-[#F2F2EE] hover:text-[#1B1B1B]" : "border border-[#E3E1DB] text-[#E3E1DB] cursor-not-allowed"}`,
          dangerouslySetInnerHTML: { __html: link.label }
        },
        index
      )) })
    ] }) })
  ] }) });
};
export {
  AllProducts as default
};
