import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import { BsChevronRight, BsSearch, BsFilter, BsGrid3X3Gap, BsX } from "react-icons/bs";
import { FiClock, FiTruck, FiShoppingBag } from "react-icons/fi";
import { RiFireFill, RiFlashlightFill, RiDiscountPercentFill } from "react-icons/ri";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import AddtoCartButton from "./AddtoCartButton-CZxthnYv.js";
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
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./languageStore-DF0bQFKG.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "axios";
import "./WishListButton-DoaUgqlu.js";
const HotDeals = ({ products, auth, wishlist }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1e4]);
  const [sortBy, setSortBy] = useState("discount-high");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const productsData = products.data || [];
  const hotDealsProducts = useMemo(() => {
    return productsData.filter(
      (product) => product.sale_price && product.sale_price > 0 && product.sale_price < product.regular_price
    );
  }, [productsData]);
  const categories = useMemo(() => {
    const uniqueCategories = new Set(hotDealsProducts.map((p) => p.category).filter(Boolean));
    return ["all", ...uniqueCategories];
  }, [hotDealsProducts]);
  const discountOptions = [
    { id: "all", label: "All Discounts" },
    { id: "10", label: "10% or more" },
    { id: "20", label: "20% or more" },
    { id: "30", label: "30% or more" },
    { id: "40", label: "40% or more" },
    { id: "50", label: "50% or more" },
    { id: "60", label: "60% or more" },
    { id: "70", label: "70% or more" }
  ];
  const calculateDiscount = (regularPrice, salePrice) => {
    if (!salePrice || salePrice >= regularPrice) return 0;
    return Math.round((regularPrice - salePrice) / regularPrice * 100);
  };
  const sortOptions = [
    { id: "discount-high", label: "Discount: High to Low" },
    { id: "discount-low", label: "Discount: Low to High" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Top Rated" }
  ];
  const filteredProducts = useMemo(() => {
    let filtered = [...hotDealsProducts];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description && product.description.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (selectedDiscount !== "all") {
      const minDiscount = parseInt(selectedDiscount);
      filtered = filtered.filter((product) => {
        const discount = calculateDiscount(product.regular_price, product.sale_price);
        return discount >= minDiscount;
      });
    }
    filtered = filtered.filter((product) => {
      const price = product.sale_price || product.regular_price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    switch (sortBy) {
      case "discount-high":
        filtered.sort((a, b) => {
          const discountA = calculateDiscount(a.regular_price, a.sale_price);
          const discountB = calculateDiscount(b.regular_price, b.sale_price);
          return discountB - discountA;
        });
        break;
      case "discount-low":
        filtered.sort((a, b) => {
          const discountA = calculateDiscount(a.regular_price, a.sale_price);
          const discountB = calculateDiscount(b.regular_price, b.sale_price);
          return discountA - discountB;
        });
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.sale_price || a.regular_price;
          const priceB = b.sale_price || b.regular_price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.sale_price || a.regular_price;
          const priceB = b.sale_price || b.regular_price;
          return priceB - priceA;
        });
        break;
      case "rating":
        filtered.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
        break;
    }
    return filtered;
  }, [hotDealsProducts, searchQuery, selectedCategory, selectedDiscount, priceRange, sortBy]);
  const totalDeals = hotDealsProducts.length;
  const FilterDrawer = () => /* @__PURE__ */ jsxs("div", { className: `fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "block" : "hidden"}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/50",
        onClick: () => setShowMobileFilters(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto p-6 animate-slide-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-ink", children: "Filters" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowMobileFilters(false),
            className: "p-2 hover:bg-paper-dim rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(BsX, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3", children: "Categories" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: categories.map((category) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSelectedCategory(category);
              setShowMobileFilters(false);
            },
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category ? "bg-marigold/10 text-marigold font-medium" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: category === "all" ? "All Categories" : category }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                "(",
                hotDealsProducts.filter((p) => category === "all" || p.category === category).length,
                ")"
              ] })
            ] })
          },
          category
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3", children: "Discount" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: discountOptions.map((option) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSelectedDiscount(option.id);
              setShowMobileFilters(false);
            },
            className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${selectedDiscount === option.id ? "bg-marigold/10 text-marigold font-medium" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
            children: option.label
          },
          option.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3", children: "Price Range" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "10000",
              step: "100",
              value: priceRange[1],
              onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]),
              className: "w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: priceRange[0] }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: priceRange[1] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3", children: "Sort by" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: sortBy,
            onChange: (e) => {
              setSortBy(e.target.value);
              setShowMobileFilters(false);
            },
            className: "w-full p-2.5 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors bg-white",
            children: sortOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.label }, option.id))
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSelectedCategory("all");
            setSelectedDiscount("all");
            setPriceRange([0, 1e4]);
            setSearchQuery("");
            setSortBy("discount-high");
            setShowMobileFilters(false);
          },
          className: "w-full py-2.5 text-sm border border-line text-text-soft rounded-lg hover:bg-paper-dim hover:text-ink transition-colors",
          children: "Clear all filters"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth?.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "Hot Deals | Shop",
        description: "Discover today's hottest deals and discounts on HaatPoint. Shop top-selling, trending, and featured products at unbeatable prices across Bangladesh.",
        canonical: "https://www.haatpoint.com/hotdeals",
        ogTitle: "Hot Deals | Shop at HaatPoint",
        ogDescription: "Discover today's hottest deals and discounts on HaatPoint. Shop top-selling, trending, and featured products at unbeatable prices across Bangladesh.",
        ogUrl: "https://www.haatpoint.com/hotdeals",
        twitterDescription: "Discover today's hottest deals and discounts on HaatPoint."
      }
    ),
    /* @__PURE__ */ jsx(FilterDrawer, {}),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left mb-6 md:mb-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(RiFireFill, { className: "text-4xl animate-pulse" }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold", children: "Hot Deals" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl opacity-90 mb-2", children: "Limited Time Offers! Up to 70% Off" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg opacity-80", children: [
          totalDeals,
          " products on sale"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30", children: [
        /* @__PURE__ */ jsx(RiFlashlightFill, { className: "text-4xl mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: "Flash Sale" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Ends in:" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-2 justify-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white/30 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: "12" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs ml-1", children: "h" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/30 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: "45" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs ml-1", children: "m" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/30 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: "30" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs ml-1", children: "s" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("nav", { className: "text-sm text-text-soft", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/", className: "hover:text-marigold transition-colors", children: "Home" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(BsChevronRight, { className: "text-text-soft text-xs" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-ink font-medium", children: "Hot Deals" })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(BsSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft text-sm" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search deals...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-4 py-2 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors w-full sm:w-48 md:w-56 lg:w-64 bg-white"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowMobileFilters(true),
              className: "lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-line rounded-lg text-text-soft hover:bg-paper-dim hover:text-ink transition-colors",
              children: [
                /* @__PURE__ */ jsx(BsFilter, {}),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Filters" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs bg-marigold/10 text-marigold px-1.5 py-0.5 rounded-full", children: selectedCategory !== "all" || selectedDiscount !== "all" || searchQuery ? "!" : "" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-2 mb-8 overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 min-w-max", children: discountOptions.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedDiscount(option.id),
          className: `px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-xs sm:text-sm font-medium ${selectedDiscount === option.id ? "bg-marigold text-white shadow-md" : "text-text-soft hover:bg-paper-dim hover:text-ink"}`,
          children: option.label
        },
        option.id
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-6 lg:gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden lg:block lg:w-1/4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-ink mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(RiDiscountPercentFill, { className: "text-marigold" }),
              "Filter Deals"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4", children: "Categories" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: categories.map((category) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedCategory(category),
                  className: `block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category ? "bg-marigold/10 text-marigold font-medium" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { children: category === "all" ? "All Categories" : category }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                      "(",
                      hotDealsProducts.filter((p) => category === "all" || p.category === category).length,
                      ")"
                    ] })
                  ] })
                },
                category
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4", children: "Price Range" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "range",
                    min: "0",
                    max: "10000",
                    step: "100",
                    value: priceRange[1],
                    onChange: (e) => setPriceRange([priceRange[0], parseInt(e.target.value)]),
                    className: "w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: priceRange[0] }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: priceRange[1] }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4", children: "Sort by" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: "w-full p-2.5 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors bg-white",
                  children: sortOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.label }, option.id))
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedCategory("all");
                  setSelectedDiscount("all");
                  setPriceRange([0, 1e4]);
                  setSearchQuery("");
                  setSortBy("discount-high");
                },
                className: "w-full py-2.5 text-sm border border-line text-text-soft rounded-lg hover:bg-paper-dim hover:text-ink transition-colors",
                children: "Clear all filters"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 p-5 bg-gradient-to-r from-marigold/10 to-marigold/5 border border-marigold/20 rounded-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsx(FiClock, { className: "text-marigold text-xl" }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-ink", children: "Limited Time Offers" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mb-3", children: "These deals won't last long! Grab them before they're gone." }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(FiTruck, { className: "text-green-600" }),
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-ink", children: "Free Shipping" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "On all orders over ৳1000" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:w-3/4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-text-soft", children: [
              "Showing ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: filteredProducts.length }),
              " hot deals"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-line rounded-lg overflow-hidden bg-white", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setViewMode("grid"),
                  className: `p-2 transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-text-soft hover:bg-paper-dim"}`,
                  title: "Grid view",
                  children: /* @__PURE__ */ jsx(BsGrid3X3Gap, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setViewMode("list"),
                  className: `p-2 border-l border-line transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-text-soft hover:bg-paper-dim"}`,
                  title: "List view",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
                }
              )
            ] }) })
          ] }),
          filteredProducts.length > 0 ? /* @__PURE__ */ jsx("div", { className: `
                                    ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" : "space-y-4"}
                                `, children: filteredProducts.map((product) => {
            if (viewMode === "grid") {
              return /* @__PURE__ */ jsx(
                ProductCard,
                {
                  product,
                  user: auth?.user || null,
                  badge: `${calculateDiscount(product.regular_price, product.sale_price)}% OFF`,
                  variant: "default",
                  showQuickView: true
                },
                product.id
              );
            } else {
              const discountPercentage = calculateDiscount(product.regular_price, product.sale_price);
              const displayPrice = product.sale_price || product.regular_price;
              const imageSrc = product.images ? (() => {
                try {
                  const parsed = JSON.parse(product.images);
                  return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/otherplaceholder.jpg";
                } catch {
                  return "/otherplaceholder.jpg";
                }
              })() : "/otherplaceholder.jpg";
              return /* @__PURE__ */ jsx("div", { className: "group bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row", children: [
                /* @__PURE__ */ jsxs("div", { className: "sm:w-1/3 lg:w-1/4 relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "aspect-square sm:h-full overflow-hidden bg-paper-dim", children: /* @__PURE__ */ jsx(
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
                  /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 bg-gradient-to-r from-marigold to-marigold-dark text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold shadow-lg", children: [
                    "-",
                    discountPercentage,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "sm:w-2/3 lg:w-3/4 p-4 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "mb-1 sm:mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-[9px] sm:text-[10px] font-mono text-text-soft uppercase tracking-wider", children: product.category || "Uncategorized" }) }),
                    /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-semibold text-ink mb-1 sm:mb-2 group-hover:text-marigold transition-colors", children: product.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-text-soft text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2", children: product.description }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 text-[10px] sm:text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`, children: [
                        /* @__PURE__ */ jsx("div", { className: `w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}` }),
                        product.inStock ? "In Stock" : "Out of Stock"
                      ] }),
                      product.quantity > 0 && product.quantity < 10 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] sm:text-xs text-orange-600 font-medium", children: [
                        "🔥 Only ",
                        product.quantity,
                        " left!"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3", children: /* @__PURE__ */ jsxs("p", { className: "text-green-700 text-[10px] sm:text-sm", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "You Save:" }),
                      " ",
                      /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price - displayPrice }),
                      " (",
                      discountPercentage,
                      "% off)"
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "sm:w-48", children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-3 sm:mb-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xl sm:text-2xl font-bold text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: displayPrice }) }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-text-soft line-through", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(AddtoCartButton, { product }) })
                  ] })
                ] }) })
              ] }) }, product.id);
            }
          }) }) : (
            // No Results
            /* @__PURE__ */ jsxs("div", { className: "text-center py-8 sm:py-12 bg-white rounded-xl shadow-hard-sm border border-line", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-paper-dim rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiShoppingBag, { className: "text-text-soft text-2xl sm:text-3xl" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold text-ink mb-2", children: "No deals found" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-text-soft mb-4 sm:mb-6 max-w-md mx-auto px-4", children: "Try adjusting your filters to find more great deals." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setSelectedCategory("all");
                    setSelectedDiscount("all");
                    setPriceRange([0, 1e4]);
                    setSearchQuery("");
                    setSortBy("discount-high");
                  },
                  className: "px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 hover:bg-marigold text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105",
                  children: "Clear all filters"
                }
              )
            ] })
          ),
          filteredProducts.length > 0 && products.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs sm:text-sm text-text-soft", children: [
              "Showing 1-",
              Math.min(filteredProducts.length, products.per_page),
              " of ",
              products.total,
              " products"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 flex-wrap", children: [...Array(Math.min(products.last_page, 5))].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = products.current_page === page;
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: `?page=${page}`,
                  className: `px-2.5 sm:px-3 py-1 sm:py-1.5 border border-line text-xs sm:text-sm rounded-lg transition-colors ${isCurrentPage ? "bg-gray-900 text-white border-gray-900" : "text-text-soft hover:bg-paper-dim hover:text-ink"}`,
                  children: page
                },
                page
              );
            }) })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            ` })
  ] });
};
export {
  HotDeals as default
};
