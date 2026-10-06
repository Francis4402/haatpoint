import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { router, Link } from "@inertiajs/react";
import { FiSearch, FiLoader, FiX, FiGrid, FiTrendingUp, FiShoppingBag, FiTag, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
const EMPTY = {
  query: "",
  total: 0,
  products: [],
  categories: [],
  stores: [],
  quick_links: [],
  trending: []
};
const SUGGESTION_URL = "/search/suggestions";
const DEBOUNCE_MS = 220;
function discountOf(regular, sale) {
  if (!sale || sale <= 0 || sale >= regular) return 0;
  return Math.round((regular - sale) / regular * 100);
}
const SearchBox = ({
  variant = "header",
  placeholder = "Search products, brands, vendors…",
  className = "",
  inputClassName = "",
  autoFocus = false,
  onNavigate,
  initialValue = ""
}) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const scope = variant === "dashboard" ? "dashboard" : "public";
  const isPanel = variant === "panel";
  const fetchSuggestions = useCallback(
    (term) => {
      abortRef.current?.abort();
      if (term.trim() === "") {
        abortRef.current = null;
        setResults(EMPTY);
        setLoading(false);
        setHasSearched(false);
        return;
      }
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      const params = new URLSearchParams({ q: term, scope, limit: "8" });
      fetch(`${SUGGESTION_URL}?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        credentials: "same-origin"
      }).then((response) => response.ok ? response.json() : Promise.reject(response.status)).then((data) => {
        if (controller.signal.aborted) return;
        setResults({ ...EMPTY, ...data });
        setHasSearched(true);
        setLoading(false);
      }).catch(() => {
        if (controller.signal.aborted) return;
        setResults(EMPTY);
        setHasSearched(true);
        setLoading(false);
      });
    },
    [scope]
  );
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = query.trim();
    if (term === "") {
      fetchSuggestions("");
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(term), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      abortRef.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);
  const options = useMemo(() => {
    const list = [];
    results.products.forEach(
      (product) => list.push({ key: `p-${product.id}`, href: product.href, group: "product" })
    );
    results.categories.forEach(
      (category) => list.push({
        key: `c-${category.name}`,
        href: `/products?category=${encodeURIComponent(category.name)}`,
        group: "category"
      })
    );
    results.stores.forEach(
      (store) => list.push({ key: `s-${store.id}`, href: `/stores/${store.id}`, group: "store" })
    );
    results.quick_links.forEach(
      (link) => list.push({ key: `q-${link.href}`, href: link.href, group: "quick" })
    );
    if (query.trim() !== "") {
      list.push({
        key: "all",
        href: `/products?search=${encodeURIComponent(query.trim())}`,
        group: "all"
      });
    }
    return list;
  }, [results, query]);
  const go = useCallback(
    (href) => {
      setOpen(false);
      inputRef.current?.blur();
      onNavigate?.();
      router.get(href);
    },
    [onNavigate]
  );
  const submit = useCallback(() => {
    const term = query.trim();
    if (activeIndex >= 0 && options[activeIndex]) {
      go(options[activeIndex].href);
      return;
    }
    if (term === "") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    go(`/products?search=${encodeURIComponent(term)}`);
  }, [activeIndex, options, query, go]);
  const clear = useCallback(() => {
    setQuery("");
    setResults(EMPTY);
    setHasSearched(false);
    setLoading(false);
    setOpen(false);
    setActiveIndex(-1);
    abortRef.current?.abort();
    inputRef.current?.focus();
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((prev) => options.length === 0 ? -1 : (prev + 1) % options.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => options.length === 0 ? -1 : prev <= 0 ? options.length - 1 : prev - 1);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };
  const showIdle = open && query.trim() === "" && !loading;
  const showEmpty = open && query.trim() !== "" && hasSearched && !loading && results.total === 0;
  const showResults = open && query.trim() !== "" && (loading || results.total > 0);
  const showPanel = showIdle || showEmpty || showResults;
  const productOffset = 0;
  const categoryOffset = productOffset + results.products.length;
  const storeOffset = categoryOffset + results.categories.length;
  const quickOffset = storeOffset + results.stores.length;
  const allOffset = quickOffset + results.quick_links.length;
  const isActive = (index) => activeIndex === index;
  const rowTone = (index) => isActive(index) ? "bg-paper-dim" : "bg-white hover:bg-paper-dim";
  const headerTone = (active) => `font-mono text-[10px] uppercase tracking-[0.14em] px-4 pt-4 pb-2 flex items-center gap-1.5 ${"text-text-soft"}`;
  const inputBase = "w-full bg-white text-sm text-ink placeholder:text-text-soft focus:outline-none focus:ring-0 py-3 pl-11 pr-24 font-body";
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: `relative w-full ${className}`, children: [
    /* @__PURE__ */ jsxs(
      "form",
      {
        role: "search",
        onSubmit: (event) => {
          event.preventDefault();
          submit();
        },
        children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `search-box-${variant}`, className: "sr-only", children: placeholder }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative flex items-center overflow-hidden rounded-md border bg-white transition-all duration-200 ${open ? "border-marigold ring-2 ring-marigold/25" : "border-line hover:border-marigold/60"}`,
              children: [
                /* @__PURE__ */ jsx(
                  FiSearch,
                  {
                    className: "pointer-events-none absolute left-4 h-[18px] w-[18px] text-text-soft",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: `search-box-${variant}`,
                    ref: inputRef,
                    type: "search",
                    value: query,
                    autoComplete: "off",
                    autoFocus,
                    spellCheck: false,
                    placeholder,
                    onChange: (event) => {
                      setQuery(event.target.value);
                      setOpen(true);
                    },
                    onFocus: () => setOpen(true),
                    onKeyDown: handleKeyDown,
                    role: "combobox",
                    "aria-expanded": showPanel,
                    "aria-controls": `search-box-${variant}-listbox`,
                    "aria-autocomplete": "list",
                    className: `${inputBase} ${inputClassName}`
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1", children: [
                  loading && /* @__PURE__ */ jsx(
                    FiLoader,
                    {
                      className: "h-4 w-4 animate-spin text-marigold",
                      "aria-label": "Searching",
                      role: "status"
                    }
                  ),
                  query !== "" && !loading && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: clear,
                      className: "rounded-sm p-1.5 text-text-soft transition-colors hover:bg-paper-dim hover:text-ink",
                      "aria-label": "Clear search",
                      children: /* @__PURE__ */ jsx(FiX, { className: "h-4 w-4", "aria-hidden": "true" })
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      className: "rounded-sm bg-marigold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-marigold-dark",
                      "aria-label": "Search",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Search" }),
                        /* @__PURE__ */ jsx(FiSearch, { className: "h-4 w-4 sm:hidden", "aria-hidden": "true" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    showPanel && /* @__PURE__ */ jsxs(
      "div",
      {
        id: `search-box-${variant}-listbox`,
        role: "listbox",
        className: `absolute left-0 right-0 top-[calc(100%+8px)] z-[120] overflow-hidden rounded-lg border border-line bg-white shadow-hard ${isPanel ? "static mt-2" : ""}`,
        children: [
          loading && /* @__PURE__ */ jsx("div", { className: "px-4 py-6", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [0, 1, 2].map((row) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 shrink-0 animate-pulse rounded-md bg-paper-dim" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-2/3 animate-pulse rounded bg-paper-dim" }),
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-1/3 animate-pulse rounded bg-paper-dim" })
            ] })
          ] }, row)) }) }),
          showIdle && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: headerTone(), children: [
              /* @__PURE__ */ jsx(FiGrid, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Browse categories"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 px-4 pb-4", children: [
              results.trending.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: "Type to search products, brands and vendors." }),
              results.trending.map((item) => /* @__PURE__ */ jsx(
                Link,
                {
                  href: item.href,
                  onClick: () => {
                    setOpen(false);
                    onNavigate?.();
                  },
                  className: "rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-marigold hover:bg-marigold hover:text-white",
                  children: item.label
                },
                item.href
              ))
            ] }),
            results.quick_links.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("p", { className: `${headerTone()} border-t border-line`, children: [
                /* @__PURE__ */ jsx(FiTrendingUp, { className: "h-3 w-3", "aria-hidden": "true" }),
                "Quick links"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pb-2", children: results.quick_links.map((link, index) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: link.href,
                  role: "option",
                  "aria-selected": isActive(quickOffset + index),
                  onClick: () => {
                    setOpen(false);
                    onNavigate?.();
                  },
                  className: `flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors ${rowTone(
                    quickOffset + index
                  )}`,
                  children: [
                    /* @__PURE__ */ jsx(FiGrid, { className: "h-4 w-4 shrink-0 text-marigold", "aria-hidden": "true" }),
                    link.label
                  ]
                },
                link.href
              )) })
            ] })
          ] }),
          !loading && results.products.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: headerTone(), children: [
              /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Products"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "max-h-[340px] overflow-y-auto pb-1", children: results.products.map((product, index) => {
              const off = Math.round((product.sale_price ?? product.regular_price) * 100) / 100;
              const discount = discountOf(product.regular_price, product.sale_price);
              return /* @__PURE__ */ jsx("li", { role: "option", "aria-selected": isActive(index), children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: product.href,
                  onClick: () => {
                    setOpen(false);
                    onNavigate?.();
                  },
                  className: `flex items-center gap-3 px-4 py-2.5 transition-colors ${rowTone(index)}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-paper-dim", children: product.image ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image,
                        alt: product.name,
                        loading: "lazy",
                        className: "h-full w-full object-cover",
                        onError: (event) => {
                          event.currentTarget.src = "/otherplaceholder.jpg";
                        }
                      }
                    ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-paper-dim to-line", children: /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-5 w-5 text-text-soft", "aria-hidden": "true" }) }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-ink", children: product.name }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-wide text-text-soft", children: [
                        product.brand || product.category,
                        product.subcategory ? ` · ${product.subcategory}` : ""
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-display text-sm font-extrabold text-marigold-dark", children: /* @__PURE__ */ jsx(FormatPrice, { price: off }) }),
                        discount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-text-soft line-through", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) }),
                          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-green-50 px-1.5 py-0.5 text-[9.5px] font-bold text-green-600", children: [
                            "-",
                            discount,
                            "%"
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
                      product.product_type === "new-arrival" && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#E7F4EF] px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-teal", children: "New" }),
                      product.store_name && /* @__PURE__ */ jsx("span", { className: "max-w-[110px] truncate text-[10.5px] text-text-soft", children: product.store_name }),
                      !product.inStock && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-red-600", children: "Out of stock" })
                    ] })
                  ]
                }
              ) }, product.id);
            }) })
          ] }),
          !loading && results.categories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-line", children: [
            /* @__PURE__ */ jsxs("p", { className: headerTone(), children: [
              /* @__PURE__ */ jsx(FiTag, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Categories"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "pb-1", children: results.categories.map((category, index) => /* @__PURE__ */ jsx("li", { role: "option", "aria-selected": isActive(categoryOffset + index), children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/products?category=${encodeURIComponent(category.name)}`,
                onClick: () => {
                  setOpen(false);
                  onNavigate?.();
                },
                className: `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${rowTone(
                  categoryOffset + index
                )}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "h-8 w-8 shrink-0 overflow-hidden rounded-md border border-line bg-paper-dim", children: category.image && /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${category.image}`,
                      alt: "",
                      loading: "lazy",
                      className: "h-full w-full object-cover",
                      onError: (event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: "flex-1 font-medium text-ink", children: category.name }),
                  /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10.5px] text-text-soft", children: [
                    category.count,
                    " ",
                    category.count === 1 ? "item" : "items"
                  ] })
                ]
              }
            ) }, category.name)) })
          ] }),
          !loading && results.stores.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-line", children: [
            /* @__PURE__ */ jsxs("p", { className: headerTone(), children: [
              /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Vendors"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "pb-1", children: results.stores.map((store, index) => /* @__PURE__ */ jsx("li", { role: "option", "aria-selected": isActive(storeOffset + index), children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/stores/${store.id}`,
                onClick: () => {
                  setOpen(false);
                  onNavigate?.();
                },
                className: `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${rowTone(
                  storeOffset + index
                )}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper-dim", children: store.logo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${store.logo}`,
                      alt: "",
                      loading: "lazy",
                      className: "h-full w-full object-cover",
                      onError: (event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }
                    }
                  ) : /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-4 w-4 text-text-soft", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ jsxs("span", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "block font-medium text-ink", children: store.name }),
                    /* @__PURE__ */ jsx("span", { className: "block text-[10.5px] text-text-soft", children: store.storetype })
                  ] }),
                  store.rating > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-mono text-[10.5px] text-text-soft", children: [
                    /* @__PURE__ */ jsx(FaStar, { className: "h-3 w-3 text-amber-400", "aria-hidden": "true" }),
                    store.rating.toFixed(1)
                  ] })
                ]
              }
            ) }, store.id)) })
          ] }),
          !loading && results.quick_links.length > 0 && query.trim() !== "" && /* @__PURE__ */ jsxs("div", { className: "border-t border-line", children: [
            /* @__PURE__ */ jsxs("p", { className: headerTone(), children: [
              /* @__PURE__ */ jsx(FiGrid, { className: "h-3 w-3", "aria-hidden": "true" }),
              "Dashboard"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "pb-1", children: results.quick_links.map((link, index) => /* @__PURE__ */ jsx("li", { role: "option", "aria-selected": isActive(quickOffset + index), children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: link.href,
                onClick: () => {
                  setOpen(false);
                  onNavigate?.();
                },
                className: `flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors ${rowTone(
                  quickOffset + index
                )}`,
                children: [
                  /* @__PURE__ */ jsx(FiGrid, { className: "h-4 w-4 shrink-0 text-marigold", "aria-hidden": "true" }),
                  link.label
                ]
              }
            ) }, link.href)) })
          ] }),
          showEmpty && /* @__PURE__ */ jsxs("div", { className: "px-4 py-10 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-dim", children: /* @__PURE__ */ jsx(FiSearch, { className: "h-5 w-5 text-text-soft", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-ink", children: [
              "No results for “",
              results.query,
              "”"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-text-soft", children: "Check the spelling or try a different keyword, brand or category." })
          ] }),
          !loading && query.trim() !== "" && (results.total > 0 || showEmpty) && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": isActive(allOffset),
              onClick: () => go(`/products?search=${encodeURIComponent(query.trim())}`),
              className: `flex w-full items-center justify-between gap-3 border-t border-line px-4 py-3 text-left text-sm font-semibold transition-colors ${rowTone(
                allOffset
              )}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-ink", children: [
                  "See all results for ",
                  /* @__PURE__ */ jsxs("span", { className: "text-marigold-dark", children: [
                    "“",
                    query.trim(),
                    "”"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(FiArrowRight, { className: "h-4 w-4 shrink-0 text-marigold", "aria-hidden": "true" })
              ]
            }
          )
        ]
      }
    )
  ] });
};
export {
  SearchBox as S
};
