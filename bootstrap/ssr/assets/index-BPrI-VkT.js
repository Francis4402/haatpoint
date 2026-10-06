import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from "react";
import { router } from "@inertiajs/react";
import { Transition, Dialog } from "@headlessui/react";
import { BsStarFill, BsStarHalf, BsStar, BsFilter, BsX, BsGrid3X3Gap, BsSearch } from "react-icons/bs";
import { FiTruck, FiCheck, FiShoppingBag, FiGrid, FiStar, FiTag } from "react-icons/fi";
import { RiStarSFill, RiFireFill, RiNewspaperLine } from "react-icons/ri";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import AddtoCartButton from "./AddtoCartButton-CZxthnYv.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import { P as ProductCard } from "./ProductCard-Cpjc5ymN.js";
import WishlistButton from "./WishListButton-DoaUgqlu.js";
import "./Navbar-I09bUsbF.js";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./languageStore-DF0bQFKG.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "axios";
const sortOptions = [
  { id: "default", label: "Default sorting" },
  { id: "popularity", label: "Sort by popularity" },
  { id: "rating", label: "Sort by average rating" },
  { id: "date", label: "Sort by latest" },
  { id: "price-low", label: "Sort by price: low to high" },
  { id: "price-high", label: "Sort by price: high to low" }
];
const DEBOUNCE_MS = 400;
function FilterPanel({
  categories,
  brands,
  products,
  filters,
  onFilterChange,
  onSearch,
  onClear,
  isLoading = false
}) {
  if (!filters || !filters.current) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-[#767470]", children: /* @__PURE__ */ jsx("p", { children: "No filters available" }) });
  }
  const { current, min_price, max_price } = filters;
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Search" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(BsSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-[#767470] text-sm" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search products, brands, categories...",
              value: current.search || "",
              onChange: (e) => onFilterChange("search", e.target.value),
              onKeyDown: handleSearchKeyDown,
              className: "pl-9 pr-4 py-2 text-sm border border-[#E3E1DB] rounded-lg focus:ring-2 focus:ring-[#6E7F5C] focus:border-transparent transition-colors w-full bg-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onSearch,
            disabled: isLoading,
            className: "px-4 py-2 bg-[#6E7F5C] text-white text-sm font-medium rounded-lg hover:bg-[#57654A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
            children: "Search"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Categories" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onFilterChange("category", "all"),
            disabled: isLoading,
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${current.category === "all" ? "bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium" : "text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: "All Categories" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#767470]", children: [
                "(",
                products?.total || 0,
                ")"
              ] })
            ] })
          }
        ),
        categories.map((category) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onFilterChange("category", category),
            disabled: isLoading,
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${current.category === category ? "bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium" : "text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: /* @__PURE__ */ jsx("span", { children: category })
          },
          category
        ))
      ] })
    ] }),
    brands && brands.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Brands" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onFilterChange("brand", "all"),
            disabled: isLoading,
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${current.brand === "all" ? "bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium" : "text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: "All Brands"
          }
        ),
        brands.map((brand) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onFilterChange("brand", brand),
            disabled: isLoading,
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${current.brand === brand ? "bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium" : "text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
            children: brand
          },
          brand
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Filter by Price" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-[#1B1B1B]", children: [
            "Tk ",
            current.min_price_filter || min_price || 0
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-[#1B1B1B]", children: [
            "Tk ",
            current.max_price_filter || max_price || 1e4
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: min_price || 0,
            max: max_price || 1e4,
            step: "100",
            value: current.max_price_filter ?? max_price ?? 1e4,
            onChange: (e) => onFilterChange("max_price_filter", parseInt(e.target.value, 10)),
            disabled: isLoading,
            className: "w-full h-1.5 bg-[#F2F2EE] rounded-lg appearance-none cursor-pointer accent-[#6E7F5C] disabled:opacity-50"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#767470]", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Min: Tk ",
            min_price || 0
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Max: Tk ",
            max_price || 1e4
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Sort by" }),
      /* @__PURE__ */ jsx(
        "select",
        {
          value: current.sort_by || "default",
          onChange: (e) => onFilterChange("sort_by", e.target.value),
          disabled: isLoading,
          className: "w-full p-2.5 text-sm border border-[#E3E1DB] rounded-lg focus:ring-2 focus:ring-[#6E7F5C] focus:border-transparent transition-colors bg-white disabled:opacity-50",
          children: sortOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.label }, option.id))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4", children: "Product Status" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: current.in_stock || false,
              onChange: (e) => onFilterChange("in_stock", e.target.checked),
              disabled: isLoading,
              className: "h-4 w-4 accent-[#6E7F5C] rounded border-[#E3E1DB] disabled:cursor-not-allowed"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#767470]", children: "In stock only" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: current.product_type === "on-sale",
              onChange: (e) => onFilterChange("product_type", e.target.checked ? "on-sale" : "all"),
              disabled: isLoading,
              className: "h-4 w-4 accent-[#6E7F5C] rounded border-[#E3E1DB] disabled:cursor-not-allowed"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#767470]", children: "On sale" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClear,
        disabled: isLoading,
        className: "w-full py-2.5 text-sm border border-[#E3E1DB] text-[#767470] rounded-lg hover:bg-[#F2F2EE] hover:text-[#1B1B1B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        children: "Clear all filters"
      }
    )
  ] });
}
const Products = ({ products, auth, wishlist, productRatings = {}, filters }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth?.user || null;
  const defaultFilters = {
    categories: [],
    brands: [],
    min_price: 0,
    max_price: 1e4,
    current: {
      category: "all",
      product_type: "all",
      brand: "all",
      search: "",
      sort_by: "default",
      in_stock: false,
      min_price_filter: 0,
      max_price_filter: 1e4
    }
  };
  const safeFilters = filters || defaultFilters;
  const [localCurrent, setLocalCurrent] = useState(safeFilters.current);
  useEffect(() => {
    setLocalCurrent(safeFilters.current);
  }, [safeFilters.current]);
  const debounceRef = useRef(null);
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  const productTypes = [
    { id: "all", label: "All Products", icon: /* @__PURE__ */ jsx(FiGrid, {}) },
    { id: "featured", label: "Featured", icon: /* @__PURE__ */ jsx(RiStarSFill, {}) },
    { id: "trending", label: "Trending", icon: /* @__PURE__ */ jsx(RiFireFill, {}) },
    { id: "top-selling", label: "Top Selling", icon: /* @__PURE__ */ jsx(FiStar, {}) },
    { id: "new-arrival", label: "New Arrivals", icon: /* @__PURE__ */ jsx(RiNewspaperLine, {}) },
    { id: "on-sale", label: "On Sale", icon: /* @__PURE__ */ jsx(FiTag, {}) }
  ];
  const navigate = useCallback((nextCurrent) => {
    router.get(
      route("products.index"),
      {
        category: nextCurrent.category,
        product_type: nextCurrent.product_type,
        brand: nextCurrent.brand,
        search: nextCurrent.search,
        sort_by: nextCurrent.sort_by,
        in_stock: nextCurrent.in_stock,
        min_price: nextCurrent.min_price_filter,
        max_price: nextCurrent.max_price_filter
      },
      {
        preserveState: true,
        preserveScroll: true,
        onStart: () => setIsLoading(true),
        onFinish: () => setIsLoading(false)
      }
    );
  }, []);
  const handleFilterChange = useCallback((key, value) => {
    setLocalCurrent((prev) => {
      const nextCurrent = { ...prev, [key]: value };
      if (key === "max_price_filter") {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => navigate(nextCurrent), DEBOUNCE_MS);
      } else if (key !== "search") {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        navigate(nextCurrent);
      }
      return nextCurrent;
    });
  }, [navigate]);
  const handleSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    navigate(localCurrent);
  }, [navigate, localCurrent]);
  const clearFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const cleared = {
      category: "all",
      product_type: "all",
      brand: "all",
      search: "",
      sort_by: "default",
      in_stock: false,
      min_price_filter: safeFilters.min_price || 0,
      max_price_filter: safeFilters.max_price || 1e4
    };
    setLocalCurrent(cleared);
    navigate(cleared);
  }, [navigate, safeFilters.min_price, safeFilters.max_price]);
  const handlePageChange = useCallback((url) => {
    if (!url) return;
    router.get(url, {}, {
      preserveState: true,
      preserveScroll: true,
      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false)
    });
  }, []);
  const calculateDiscount = useCallback((regularPrice, salePrice) => {
    if (!salePrice || salePrice >= regularPrice) return 0;
    return Math.round((regularPrice - salePrice) / regularPrice * 100);
  }, []);
  const getProductRating = useCallback((product) => {
    if (productRatings[product.id]) {
      return productRatings[product.id];
    }
    const rating = typeof product.rating === "string" ? parseFloat(product.rating) : product.rating || 0;
    return { average: rating, count: 0 };
  }, [productRatings]);
  const stripHtml = useCallback((html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  }, []);
  const renderStars = useCallback((averageRating) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return /* @__PURE__ */ jsx(BsStarFill, { className: "text-amber-400 text-xs" }, i);
      } else if (i === fullStars && hasHalfStar) {
        return /* @__PURE__ */ jsx(BsStarHalf, { className: "text-amber-400 text-xs" }, i);
      } else {
        return /* @__PURE__ */ jsx(BsStar, { className: "text-gray-300 text-xs" }, i);
      }
    }) });
  }, []);
  const getImageSrc = useCallback((images) => {
    if (!images) return "/placeholder-image.jpg";
    try {
      const parsedImages = JSON.parse(images);
      if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
        return parsedImages[0];
      }
    } catch (error) {
      if (images.trim().startsWith("http") || images.trim().startsWith("/")) {
        return images.trim();
      }
    }
    return "/placeholder-image.jpg";
  }, []);
  const totalProducts = useMemo(() => products?.total || 0, [products]);
  const filterPanelProps = {
    categories: safeFilters.categories || [],
    brands: safeFilters.brands || [],
    products,
    filters: {
      min_price: safeFilters.min_price,
      max_price: safeFilters.max_price,
      current: localCurrent
    },
    onFilterChange: handleFilterChange,
    onSearch: handleSearch,
    onClear: clearFilters,
    isLoading
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth?.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "Products | Shop",
        description: "Browse our full collection of products on HaatPoint - electronics, fashion, home goods and more from trusted vendors across Bangladesh.",
        canonical: "https://www.haatpoint.com/products",
        ogTitle: "Products | Shop at HaatPoint",
        ogDescription: "Browse our full collection of products on HaatPoint - electronics, fashion, home goods and more from trusted vendors across Bangladesh.",
        ogUrl: "https://www.haatpoint.com/products",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "All Products",
          numberOfItems: totalProducts,
          itemListElement: products.data?.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: `https://www.haatpoint.com/products/${p.id}`
          }))
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#F2F2EE] py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end flex-wrap gap-4 mb-9", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Browse our collection" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "All Products" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[#767470] text-sm mt-2", children: [
            "Browse our premium collection of ",
            totalProducts,
            " products"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowMobileFilters(true),
            className: "lg:hidden flex items-center gap-2 px-3 py-2 border border-[#E3E1DB] rounded-lg text-[#767470] hover:bg-[#F2F2EE] transition-colors",
            children: [
              /* @__PURE__ */ jsx(BsFilter, {}),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Filters" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] p-2 mb-8 overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: productTypes.map((type) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleFilterChange("product_type", type.id),
          disabled: isLoading,
          className: `flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${localCurrent.product_type === type.id ? "bg-gray-900 text-white shadow-md" : "text-[#767470] hover:bg-[#F2F2EE] hover:text-[#1B1B1B]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: type.icon }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: type.label }),
            type.id === "all" && /* @__PURE__ */ jsx("span", { className: `text-xs px-1.5 py-0.5 rounded ${localCurrent.product_type === type.id ? "bg-white/20 text-white" : "bg-[#F2F2EE] text-[#767470]"}`, children: totalProducts })
          ]
        },
        type.id
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden lg:block lg:w-1/4", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] p-6 sticky top-6", children: /* @__PURE__ */ jsx(FilterPanel, { ...filterPanelProps }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 p-5 bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsx(FiTruck, { className: "text-[#6E7F5C]" }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-[#1B1B1B]", children: "Free Shipping" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#767470] mb-4", children: "Free shipping on all orders over Tk 1000" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(FiCheck, { className: "text-green-600" }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-[#1B1B1B]", children: "Secure Payment" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#767470]", children: "100% secure payment with SSL encryption" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Transition.Root, { show: showMobileFilters, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-[100] lg:hidden", onClose: setShowMobileFilters, children: [
          /* @__PURE__ */ jsx(
            Transition.Child,
            {
              as: Fragment,
              enter: "ease-in-out duration-300",
              enterFrom: "opacity-0",
              enterTo: "opacity-100",
              leave: "ease-in-out duration-300",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-[#1B1B1B]/50 backdrop-blur-sm transition-opacity" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10", children: /* @__PURE__ */ jsx(
            Transition.Child,
            {
              as: Fragment,
              enter: "transform transition ease-in-out duration-300",
              enterFrom: "-translate-x-full",
              enterTo: "translate-x-0",
              leave: "transform transition ease-in-out duration-300",
              leaveFrom: "translate-x-0",
              leaveTo: "-translate-x-full",
              children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "pointer-events-auto w-screen max-w-sm", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex h-full flex-col bg-[#FBFBF9] shadow-2xl",
                  style: { backgroundColor: "#FBFBF9" },
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b border-[#E3E1DB]", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(BsFilter, { className: "text-[#6E7F5C]" }),
                        /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-lg uppercase", children: "Filters" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "p-2 rounded-sm hover:bg-[#F2F2EE] transition-colors",
                          onClick: () => setShowMobileFilters(false),
                          children: /* @__PURE__ */ jsx(BsX, { className: "h-6 w-6" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: /* @__PURE__ */ jsx(FilterPanel, { ...filterPanelProps }) }),
                    /* @__PURE__ */ jsx("div", { className: "border-t border-[#E3E1DB] px-6 py-4", children: /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setShowMobileFilters(false),
                        className: "w-full flex items-center justify-center py-3 rounded-sm text-sm font-bold text-white bg-[#6E7F5C] shadow-hard-sm transition-transform hover:-translate-y-0.5",
                        children: [
                          "Show ",
                          totalProducts,
                          " results"
                        ]
                      }
                    ) })
                  ]
                }
              ) })
            }
          ) }) }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:w-3/4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-[#767470]", children: [
              "Showing ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1B1B1B]", children: products?.from || 0 }),
              " to ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1B1B1B]", children: products?.to || 0 }),
              " of ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1B1B1B]", children: totalProducts }),
              " products"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-[#E3E1DB] rounded-lg overflow-hidden bg-white", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setViewMode("grid"),
                  disabled: isLoading,
                  className: `p-2 transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-[#767470] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
                  title: "Grid view",
                  children: /* @__PURE__ */ jsx(BsGrid3X3Gap, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setViewMode("list"),
                  disabled: isLoading,
                  className: `p-2 border-l border-[#E3E1DB] transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-[#767470] hover:bg-[#F2F2EE]"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
                  title: "List view",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
                }
              )
            ] }) })
          ] }),
          isLoading && /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-12", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E7F5C]" }) }),
          !isLoading && products?.data?.length > 0 ? /* @__PURE__ */ jsx("div", { className: `
                                    ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}
                                `, children: products.data.map((product) => {
            const imageSrc = getImageSrc(product.images);
            const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
            const discountPercentage = hasDiscount ? calculateDiscount(product.regular_price, product.sale_price) : 0;
            const displayPrice = product.sale_price || product.regular_price;
            const { average: avgRating, count: reviewCount } = getProductRating(product);
            if (viewMode === "grid") {
              return /* @__PURE__ */ jsx(
                ProductCard,
                {
                  product,
                  user,
                  variant: product.product_type === "trending" ? "trending" : "default",
                  showQuickView: true,
                  initialAverageRating: avgRating
                },
                product.id
              );
            } else {
              return /* @__PURE__ */ jsx("div", { className: "group bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] overflow-hidden hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row", children: [
                /* @__PURE__ */ jsxs("div", { className: "md:w-1/4 relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "aspect-square md:h-full overflow-hidden bg-[#F2F2EE]", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${imageSrc}`,
                      alt: product.name,
                      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                      onError: (e) => {
                        e.currentTarget.src = "/otherplaceholder.jpg";
                      }
                    }
                  ) }),
                  hasDiscount && /* @__PURE__ */ jsxs("span", { className: "absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg", children: [
                    "-",
                    discountPercentage,
                    "%"
                  ] }),
                  product.brand && /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 left-3 bg-[#6E7F5C] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg", children: product.brand }),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsx(
                    WishlistButton,
                    {
                      productId: product.id,
                      className: "bg-white/90 hover:bg-white shadow-lg"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "md:w-3/4 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-[#767470] uppercase tracking-wider", children: product.category || "Uncategorized" }),
                      product.brand && /* @__PURE__ */ jsxs(Fragment$1, { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[#E3E1DB]", children: "/" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-[#6E7F5C] uppercase tracking-wider font-semibold", children: product.brand })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#1B1B1B] mb-2 group-hover:text-[#6E7F5C] transition-colors", children: product.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[#767470] text-sm mb-4 line-clamp-2", children: stripHtml(product.description) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        renderStars(avgRating),
                        reviewCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#767470] ml-1", children: [
                          "(",
                          reviewCount,
                          " ",
                          reviewCount === 1 ? "review" : "reviews",
                          ")"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`, children: [
                        /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}` }),
                        product.inStock ? "In Stock" : "Out of Stock"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "md:w-48", children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-[#1B1B1B]", children: /* @__PURE__ */ jsx(FormatPrice, { price: displayPrice }) }),
                      hasDiscount && /* @__PURE__ */ jsx("div", { className: "text-sm text-[#767470] line-through", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(AddtoCartButton, { product }) })
                  ] })
                ] }) })
              ] }) }, product.id);
            }
          }) }) : !isLoading && // No Results
          /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB]", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-6 bg-[#F2F2EE] rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiShoppingBag, { className: "text-[#767470] text-3xl" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#1B1B1B] mb-2", children: "No products found" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#767470] mb-6 max-w-md mx-auto", children: "Try adjusting your search or filter to find what you're looking for." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: clearFilters,
                disabled: isLoading,
                className: "px-6 py-2.5 bg-gray-900 hover:bg-[#6E7F5C] text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                children: "Clear all filters"
              }
            )
          ] }),
          products?.data?.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-[#E3E1DB]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-[#767470]", children: [
              "Showing ",
              products?.from || 0,
              "-",
              products?.to || 0,
              " of ",
              totalProducts,
              " products"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 flex-wrap", children: products?.links?.map((link, index) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handlePageChange(link.url),
                disabled: !link.url || isLoading,
                className: `px-3 py-1.5 text-sm rounded-lg transition-colors ${link.active ? "bg-gray-900 text-white font-medium" : link.url ? "border border-[#E3E1DB] text-[#767470] hover:bg-[#F2F2EE] hover:text-[#1B1B1B]" : "border border-[#E3E1DB] text-[#E3E1DB] cursor-not-allowed"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
                dangerouslySetInnerHTML: { __html: link.label }
              },
              index
            )) })
          ] }) })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  Products as default
};
