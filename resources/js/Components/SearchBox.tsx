// SearchBox.tsx
// Live search input with a dropdown of product cards, categories, stores and
// (optionally) dashboard shortcuts. Shared by the storefront Navbar and the
// DashboardLayout header.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { FiSearch, FiX, FiLoader, FiArrowRight, FiGrid, FiTag, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import FormatPrice from '@/Pages/utils/FormatePrice';

export interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  regular_price: number;
  sale_price: number | null;
  category: string;
  subcategory: string;
  brand: string;
  inStock: boolean;
  product_type: string;
  store_name: string | null;
  href: string;
}

export interface SearchCategory {
  name: string;
  image: string | null;
  count: number;
}

export interface SearchStore {
  id: string;
  name: string;
  storetype: string;
  logo: string | null;
  rating: number;
}

export interface SearchQuickLink {
  label: string;
  href: string;
}

export interface SearchTrending {
  label: string;
  href: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  products: SearchProduct[];
  categories: SearchCategory[];
  stores: SearchStore[];
  quick_links: SearchQuickLink[];
  trending: SearchTrending[];
}

type Variant = 'header' | 'dashboard' | 'panel';

interface SearchOption {
  key: string;
  href: string;
  group: 'product' | 'category' | 'store' | 'quick' | 'all';
}

interface SearchBoxProps {
  variant?: Variant;
  /**
   * Which suggestions endpoint scope to ask for. Defaults from the variant,
   * but the dashboard's mobile panel is visually a `panel` while still wanting
   * dashboard shortcuts, so the two have to be settable independently.
   */
  scope?: 'dashboard' | 'public';
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  initialValue?: string;
}

const EMPTY: SearchResponse = {
  query: '',
  total: 0,
  products: [],
  categories: [],
  stores: [],
  quick_links: [],
  trending: [],
};

const SUGGESTION_URL = '/search/suggestions';
const DEBOUNCE_MS = 220;

function discountOf(regular: number, sale: number | null): number {
  if (!sale || sale <= 0 || sale >= regular) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}

const SearchBox = ({
  variant = 'header',
  scope: scopeProp,
  placeholder = 'Search products, brands, vendors…',
  className = '',
  inputClassName = '',
  autoFocus = false,
  onNavigate,
  initialValue = '',
}: SearchBoxProps) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scope = scopeProp ?? (variant === 'dashboard' ? 'dashboard' : 'public');

  const isPanel = variant === 'panel';

  /* ------------------------------------------------------------------ fetch */

  const fetchSuggestions = useCallback(
    (term: string) => {
      abortRef.current?.abort();

      if (term.trim() === '') {
        abortRef.current = null;
        setResults(EMPTY);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      const params = new URLSearchParams({ q: term, scope, limit: '8' });

      fetch(`${SUGGESTION_URL}?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      })
        .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
        .then((data: SearchResponse) => {
          if (controller.signal.aborted) return;
          setResults({ ...EMPTY, ...data });
          setHasSearched(true);
          setLoading(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setResults(EMPTY);
          setHasSearched(true);
          setLoading(false);
        });
    },
    [scope]
  );

  /* ----------------------------------------------------------------- effects */

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = query.trim();

    if (term === '') {
      fetchSuggestions('');
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
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* -------------------------------------------------------------- navigation */

  const options = useMemo<SearchOption[]>(() => {
    const list: SearchOption[] = [];

    results.products.forEach((product) =>
      list.push({ key: `p-${product.id}`, href: product.href, group: 'product' })
    );
    results.categories.forEach((category) =>
      list.push({
        key: `c-${category.name}`,
        href: `/products?category=${encodeURIComponent(category.name)}`,
        group: 'category',
      })
    );
    results.stores.forEach((store) =>
      list.push({ key: `s-${store.id}`, href: `/stores/${store.id}`, group: 'store' })
    );
    results.quick_links.forEach((link) =>
      list.push({ key: `q-${link.href}`, href: link.href, group: 'quick' })
    );

    if (query.trim() !== '') {
      list.push({
        key: 'all',
        href: `/products?search=${encodeURIComponent(query.trim())}`,
        group: 'all',
      });
    }

    return list;
  }, [results, query]);

  const go = useCallback(
    (href: string) => {
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

    if (term === '') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    go(`/products?search=${encodeURIComponent(term)}`);
  }, [activeIndex, options, query, go]);

  const clear = useCallback(() => {
    setQuery('');
    setResults(EMPTY);
    setHasSearched(false);
    setLoading(false);
    setOpen(false);
    setActiveIndex(-1);
    abortRef.current?.abort();
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((prev) => (options.length === 0 ? -1 : (prev + 1) % options.length));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (options.length === 0 ? -1 : (prev <= 0 ? options.length - 1 : prev - 1)));
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  /* ------------------------------------------------------------------- views */

  const showIdle = open && query.trim() === '' && !loading;
  const showEmpty = open && query.trim() !== '' && hasSearched && !loading && results.total === 0;
  const showResults = open && query.trim() !== '' && (loading || results.total > 0);
  const showPanel = showIdle || showEmpty || showResults;

  const productOffset = 0;
  const categoryOffset = productOffset + results.products.length;
  const storeOffset = categoryOffset + results.categories.length;
  const quickOffset = storeOffset + results.stores.length;
  const allOffset = quickOffset + results.quick_links.length;

  const isActive = (index: number) => activeIndex === index;

  const rowTone = (index: number) =>
    isActive(index)
      ? 'bg-paper-dim'
      : 'bg-white hover:bg-paper-dim';

  const headerTone = (active: boolean) =>
    `font-mono text-[10px] uppercase tracking-[0.14em] px-4 pt-4 pb-2 flex items-center gap-1.5 ${
      active ? 'text-marigold' : 'text-text-soft'
    }`;

  const inputBase =
    'w-full bg-white text-sm text-ink placeholder:text-text-soft focus:outline-none focus:ring-0 py-3 pl-11 pr-24 font-body';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor={`search-box-${variant}`} className="sr-only">
          {placeholder}
        </label>

        <div
          className={`relative flex items-center overflow-hidden rounded-md border bg-white transition-all duration-200 ${
            open ? 'border-marigold ring-2 ring-marigold/25' : 'border-line hover:border-marigold/60'
          }`}
        >
          <FiSearch
            className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-text-soft"
            aria-hidden="true"
          />

          <input
            id={`search-box-${variant}`}
            ref={inputRef}
            type="search"
            value={query}
            autoComplete="off"
            autoFocus={autoFocus}
            spellCheck={false}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={`search-box-${variant}-listbox`}
            aria-autocomplete="list"
            className={`${inputBase} ${inputClassName}`}
          />

          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {loading && (
              <FiLoader
                className="h-4 w-4 animate-spin text-marigold"
                aria-label="Searching"
                role="status"
              />
            )}

            {query !== '' && !loading && (
              <button
                type="button"
                onClick={clear}
                className="rounded-sm p-1.5 text-text-soft transition-colors hover:bg-paper-dim hover:text-ink"
                aria-label="Clear search"
              >
                <FiX className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="submit"
              className="rounded-sm bg-marigold px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-marigold-dark"
              aria-label="Search"
            >
              <span className="hidden sm:inline">Search</span>
              <FiSearch className="h-4 w-4 sm:hidden" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      {/* ---------------------------------------------------------- dropdown */}
      {showPanel && (
        <div
          id={`search-box-${variant}-listbox`}
          role="listbox"
          className={`absolute left-0 right-0 top-[calc(100%+8px)] z-[120] overflow-hidden rounded-lg border border-line bg-white shadow-hard ${
            isPanel ? 'static mt-2' : ''
          }`}
        >
          {/* Loading skeleton */}
          {loading && (
            <div className="px-4 py-6" aria-hidden="true">
              <div className="space-y-3">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-paper-dim" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 w-2/3 animate-pulse rounded bg-paper-dim" />
                      <div className="h-2.5 w-1/3 animate-pulse rounded bg-paper-dim" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idle: browse categories */}
          {showIdle && (
            <div>
              <p className={headerTone(false)}>
                <FiGrid className="h-3 w-3" aria-hidden="true" />
                Browse categories
              </p>
              <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                {results.trending.length === 0 && (
                  <span className="text-sm text-text-soft">Type to search products, brands and vendors.</span>
                )}
                {results.trending.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-marigold hover:bg-marigold hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {results.quick_links.length > 0 && (
                <>
                  <p className={`${headerTone(false)} border-t border-line`}>
                    <FiTrendingUp className="h-3 w-3" aria-hidden="true" />
                    Quick links
                  </p>
                  <div className="pb-2">
                    {results.quick_links.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="option"
                        aria-selected={isActive(quickOffset + index)}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors ${rowTone(
                          quickOffset + index
                        )}`}
                      >
                        <FiGrid className="h-4 w-4 shrink-0 text-marigold" aria-hidden="true" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Products */}
          {!loading && results.products.length > 0 && (
            <div>
              <p className={headerTone(false)}>
                <FiShoppingBag className="h-3 w-3" aria-hidden="true" />
                Products
              </p>
              <ul className="max-h-[340px] overflow-y-auto pb-1">
                {results.products.map((product, index) => {
                  const off = Math.round((product.sale_price ?? product.regular_price) * 100) / 100;
                  const discount = discountOf(product.regular_price, product.sale_price);

                  return (
                    <li key={product.id} role="option" aria-selected={isActive(index)}>
                      <Link
                        href={product.href}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${rowTone(index)}`}
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-paper-dim">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.src = '/otherplaceholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper-dim to-line">
                              <FiShoppingBag className="h-5 w-5 text-text-soft" aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                          <p className="mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-wide text-text-soft">
                            {product.brand || product.category}
                            {product.subcategory ? ` · ${product.subcategory}` : ''}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-display text-sm font-extrabold text-marigold-dark">
                              <FormatPrice price={off} />
                            </span>
                            {discount > 0 && (
                              <>
                                <span className="text-[11px] text-text-soft line-through">
                                  <FormatPrice price={product.regular_price} />
                                </span>
                                <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[9.5px] font-bold text-green-600">
                                  -{discount}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {product.product_type === 'new-arrival' && (
                            <span className="rounded-full bg-[#E7F4EF] px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-teal">
                              New
                            </span>
                          )}
                          {product.store_name && (
                            <span className="max-w-[110px] truncate text-[10.5px] text-text-soft">
                              {product.store_name}
                            </span>
                          )}
                          {!product.inStock && (
                            <span className="text-[10px] font-semibold text-red-600">Out of stock</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Categories */}
          {!loading && results.categories.length > 0 && (
            <div className="border-t border-line">
              <p className={headerTone(false)}>
                <FiTag className="h-3 w-3" aria-hidden="true" />
                Categories
              </p>
              <ul className="pb-1">
                {results.categories.map((category, index) => (
                  <li key={category.name} role="option" aria-selected={isActive(categoryOffset + index)}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${rowTone(
                        categoryOffset + index
                      )}`}
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-line bg-paper-dim">
                        {category.image && (
                          <img
                            src={`/storage/${category.image}`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.visibility = 'hidden';
                            }}
                          />
                        )}
                      </div>
                      <span className="flex-1 font-medium text-ink">{category.name}</span>
                      <span className="font-mono text-[10.5px] text-text-soft">
                        {category.count} {category.count === 1 ? 'item' : 'items'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stores */}
          {!loading && results.stores.length > 0 && (
            <div className="border-t border-line">
              <p className={headerTone(false)}>
                <FiShoppingBag className="h-3 w-3" aria-hidden="true" />
                Vendors
              </p>
              <ul className="pb-1">
                {results.stores.map((store, index) => (
                  <li key={store.id} role="option" aria-selected={isActive(storeOffset + index)}>
                    <Link
                      href={`/stores/${store.id}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${rowTone(
                        storeOffset + index
                      )}`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper-dim">
                        {store.logo ? (
                          <img
                            src={`/storage/${store.logo}`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.visibility = 'hidden';
                            }}
                          />
                        ) : (
                          <FiShoppingBag className="h-4 w-4 text-text-soft" aria-hidden="true" />
                        )}
                      </div>
                      <span className="flex-1">
                        <span className="block font-medium text-ink">{store.name}</span>
                        <span className="block text-[10.5px] text-text-soft">{store.storetype}</span>
                      </span>
                      {store.rating > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[10.5px] text-text-soft">
                          <FaStar className="h-3 w-3 text-amber-400" aria-hidden="true" />
                          {store.rating.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dashboard shortcuts when a term is typed */}
          {!loading && results.quick_links.length > 0 && query.trim() !== '' && (
            <div className="border-t border-line">
              <p className={headerTone(false)}>
                <FiGrid className="h-3 w-3" aria-hidden="true" />
                Dashboard
              </p>
              <ul className="pb-1">
                {results.quick_links.map((link, index) => (
                  <li key={link.href} role="option" aria-selected={isActive(quickOffset + index)}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors ${rowTone(
                        quickOffset + index
                      )}`}
                    >
                      <FiGrid className="h-4 w-4 shrink-0 text-marigold" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {showEmpty && (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-dim">
                <FiSearch className="h-5 w-5 text-text-soft" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-ink">No results for “{results.query}”</p>
              <p className="mt-1 text-xs text-text-soft">
                Check the spelling or try a different keyword, brand or category.
              </p>
            </div>
          )}

          {/* See all */}
          {!loading && query.trim() !== '' && (results.total > 0 || showEmpty) && (
            <button
              type="button"
              role="option"
              aria-selected={isActive(allOffset)}
              onClick={() => go(`/products?search=${encodeURIComponent(query.trim())}`)}
              className={`flex w-full items-center justify-between gap-3 border-t border-line px-4 py-3 text-left text-sm font-semibold transition-colors ${rowTone(
                allOffset
              )}`}
            >
              <span className="text-ink">
                See all results for <span className="text-marigold-dark">“{query.trim()}”</span>
              </span>
              <FiArrowRight className="h-4 w-4 shrink-0 text-marigold" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
