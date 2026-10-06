import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import { BsChevronRight, BsSearch, BsSortDown, BsGrid3X3Gap, BsX } from "react-icons/bs";
import { FiZap, FiShoppingBag, FiTruck, FiRefreshCw } from "react-icons/fi";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import "./Navbar-I09bUsbF.js";
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
import "axios";
import "./AddtoCartButton-CZxthnYv.js";
import "./WishListButton-DoaUgqlu.js";
const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
  { id: "name", label: "Name: A–Z" }
];
function formatAddedAt(value) {
  if (!value) return "just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function daysSince(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 864e5));
}
const NewArrivals = ({
  products,
  auth,
  wishlist,
  productRatings,
  showcasingFallback,
  showcasingCount,
  newestArrivalAt,
  filters
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState(filters.current.search);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productData = useMemo(() => products?.data ?? [], [products]);
  const applyFilter = (next) => {
    const params = {
      category: filters.current.category,
      sort_by: filters.current.sort_by,
      search: filters.current.search,
      ...next
    };
    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === "all") delete params[key];
    });
    router.get("/new-arrivals", params, { preserveState: false, preserveScroll: false });
  };
  const submitSearch = (event) => {
    event.preventDefault();
    applyFilter({ search: searchQuery.trim() });
  };
  const activeCategory = filters.current.category;
  const activeSort = filters.current.sort_by;
  const daysAgo = daysSince(newestArrivalAt);
  const categoryChips = filters.categories ?? [];
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth?.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "New Arrivals | Fresh Products at HaatPoint",
        description: "Shop the newest products just added by verified vendors on HaatPoint. Fresh electronics, fashion, home goods and more, updated daily.",
        keywords: "new arrivals, newest products, latest products, fresh arrivals, just landed",
        canonical: "https://www.haatpoint.com/new-arrivals",
        ogTitle: "New Arrivals | Fresh Products at HaatPoint",
        ogDescription: "The newest products from verified vendors on HaatPoint, updated daily.",
        ogUrl: "https://www.haatpoint.com/new-arrivals",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "New Arrivals",
          description: "The newest products listed on HaatPoint.",
          url: "https://www.haatpoint.com/new-arrivals"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ring-1 ring-white/30", children: [
          /* @__PURE__ */ jsx(FiZap, { className: "h-3 w-3", "aria-hidden": "true" }),
          "Just landed"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight", children: "New Arrivals" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 max-w-xl text-white/85", children: [
          "Fresh drops from verified vendors across every category. Last item added",
          newestArrivalAt ? ` ${formatAddedAt(newestArrivalAt)}` : " moments ago",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: [
        { icon: FiShoppingBag, label: "Products", value: products?.total ?? 0 },
        { icon: FiTruck, label: "Nationwide delivery", value: "All 64 districts" },
        { icon: FiRefreshCw, label: "Last updated", value: daysAgo === null ? "today" : `${daysAgo}d ago` }
      ].map((stat) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "min-w-[150px] rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur",
          children: [
            /* @__PURE__ */ jsx(stat.icon, { className: "h-5 w-5 opacity-90", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 font-display text-xl font-extrabold", children: stat.value }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/75", children: stat.label })
          ]
        },
        stat.label
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-6 md:py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsx("nav", { className: "text-sm text-text-soft", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/", className: "transition-colors hover:text-marigold", children: "Home" }) }),
          /* @__PURE__ */ jsx("li", { "aria-hidden": "true", children: /* @__PURE__ */ jsx(BsChevronRight, { className: "text-xs" }) }),
          /* @__PURE__ */ jsx("li", { className: "font-medium text-ink", children: "New Arrivals" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 lg:max-w-3xl lg:justify-end", children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: submitSearch, className: "relative min-w-0 flex-1 lg:max-w-sm", role: "search", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "new-arrivals-search", className: "sr-only", children: "Search new arrivals" }),
            /* @__PURE__ */ jsx(
              BsSearch,
              {
                className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "new-arrivals-search",
                type: "search",
                value: searchQuery,
                onChange: (event) => setSearchQuery(event.target.value),
                placeholder: "Search within new arrivals…",
                className: "w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-text-soft focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowMobileFilters((prev) => !prev),
              className: "flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper lg:hidden",
              "aria-expanded": showMobileFilters,
              children: [
                /* @__PURE__ */ jsx(BsSortDown, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Filter"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 overflow-x-auto rounded-xl border border-line bg-white p-2 shadow-hard-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-max gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => applyFilter({ category: "all" }),
            className: `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeCategory === "all" ? "bg-ink text-white" : "text-text-soft hover:bg-paper-dim hover:text-ink"}`,
            children: "All new arrivals"
          }
        ),
        categoryChips.map((category) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => applyFilter({ category }),
            className: `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeCategory === category ? "bg-marigold text-white" : "text-text-soft hover:bg-paper-dim hover:text-ink"}`,
            children: category
          },
          category
        ))
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft", children: [
          "Showing ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: productData.length }),
          " of",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: products?.total ?? 0 }),
          " new arrivals"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "new-arrivals-sort", className: "sr-only", children: "Sort new arrivals" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "select",
              {
                id: "new-arrivals-sort",
                value: activeSort,
                onChange: (event) => applyFilter({ sort_by: event.target.value }),
                className: "appearance-none rounded-lg border border-line bg-white py-2 pl-3 pr-9 text-sm font-medium text-ink focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30",
                children: SORT_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.label }, option.id))
              }
            ),
            /* @__PURE__ */ jsx(
              BsSortDown,
              {
                className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft",
                "aria-hidden": "true"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center overflow-hidden rounded-lg border border-line bg-white", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setViewMode("grid"),
                className: `p-2 transition-colors ${viewMode === "grid" ? "bg-ink text-white" : "text-text-soft hover:bg-paper-dim"}`,
                title: "Grid view",
                "aria-pressed": viewMode === "grid",
                children: [
                  /* @__PURE__ */ jsx(BsGrid3X3Gap, { className: "h-4 w-4", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Grid view" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setViewMode("list"),
                className: `border-l border-line p-2 transition-colors ${viewMode === "list" ? "bg-ink text-white" : "text-text-soft hover:bg-paper-dim"}`,
                title: "List view",
                "aria-pressed": viewMode === "list",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "List view" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      showMobileFilters && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-line bg-white p-4 lg:hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-ink", children: "Sort by" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setShowMobileFilters(false), className: "p-1 text-text-soft hover:text-ink", children: [
            /* @__PURE__ */ jsx(BsX, { className: "h-4 w-4", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close filters" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: SORT_OPTIONS.map((option) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              applyFilter({ sort_by: option.id });
              setShowMobileFilters(false);
            },
            className: `rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeSort === option.id ? "bg-marigold text-white" : "bg-paper text-ink hover:bg-paper-dim"}`,
            children: option.label
          },
          option.id
        )) })
      ] }),
      productData.length > 0 ? /* @__PURE__ */ jsx(
        "div",
        {
          className: viewMode === "grid" ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          children: productData.map((product) => /* @__PURE__ */ jsx(
            ProductCard,
            {
              product,
              user: auth?.user || null,
              badge: product.product_type === "new-arrival" ? "New" : void 0,
              initialAverageRating: productRatings?.[String(product.id)]?.average ?? 0
            },
            product.id
          ))
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-line bg-white px-6 py-16 text-center shadow-hard-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-paper-dim", children: /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-7 w-7 text-text-soft", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-ink", children: "No new arrivals yet" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-2 max-w-md text-sm text-text-soft", children: showcasingFallback ? "Vendors have not flagged any products as new arrivals in the last 90 days. Browse the full catalogue in the meantime." : "Nothing matches these filters. Try another category or clear the search." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [
          filters.current.search && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSearchQuery("");
                applyFilter({ search: "" });
              },
              className: "rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper",
              children: "Clear search"
            }
          ),
          activeCategory !== "all" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => applyFilter({ category: "all" }),
              className: "rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper",
              children: "All categories"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/products",
              className: "rounded-lg bg-marigold px-5 py-2 text-sm font-bold text-white shadow-hard-marigold transition-transform hover:-translate-y-0.5",
              children: "Browse all products"
            }
          )
        ] })
      ] }),
      productData.length > 0 && products.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
          "Page ",
          products.current_page,
          " of ",
          products.last_page
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `/new-arrivals?page=${Math.max(1, products.current_page - 1)}&category=${encodeURIComponent(
                activeCategory
              )}&sort_by=${activeSort}&search=${encodeURIComponent(filters.current.search)}`,
              preserveScroll: true,
              className: `rounded-lg border px-3 py-1.5 text-sm transition-colors ${products.current_page <= 1 ? "pointer-events-none border-line text-text-soft/40" : "border-line text-ink hover:bg-paper"}`,
              children: "Previous"
            }
          ),
          Array.from({ length: Math.min(products.last_page, 5) }, (_, index) => index + 1).map((page) => /* @__PURE__ */ jsx(
            Link,
            {
              href: `/new-arrivals?page=${page}&category=${encodeURIComponent(activeCategory)}&sort_by=${activeSort}&search=${encodeURIComponent(
                filters.current.search
              )}`,
              preserveScroll: true,
              className: `rounded-lg border px-3 py-1.5 text-sm transition-colors ${products.current_page === page ? "border-ink bg-ink text-white" : "border-line text-text-soft hover:bg-paper hover:text-ink"}`,
              children: page
            },
            page
          )),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `/new-arrivals?page=${Math.min(products.last_page, products.current_page + 1)}&category=${encodeURIComponent(
                activeCategory
              )}&sort_by=${activeSort}&search=${encodeURIComponent(filters.current.search)}`,
              preserveScroll: true,
              className: `rounded-lg border px-3 py-1.5 text-sm transition-colors ${products.current_page >= products.last_page ? "pointer-events-none border-line text-text-soft/40" : "border-line text-ink hover:bg-paper"}`,
              children: "Next"
            }
          )
        ] })
      ] }),
      showcasingFallback && showcasingCount === 0 && productData.length > 0 && /* @__PURE__ */ jsx("p", { className: "mt-6 rounded-lg border border-line bg-white px-4 py-3 text-xs text-text-soft", children: "No vendor has flagged products as “new arrival” yet, so this page is showing the most recently listed products from the last 90 days." })
    ] }) })
  ] });
};
export {
  NewArrivals as default
};
