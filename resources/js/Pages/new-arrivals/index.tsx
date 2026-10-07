// NewArrivals.tsx
import { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { BsChevronRight, BsGrid3X3Gap, BsSortDown, BsSearch, BsX } from 'react-icons/bs';
import { FiZap, FiTruck, FiRefreshCw, FiShoppingBag } from 'react-icons/fi';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import ProductCard from '@/Components/ProductCard';
import { Product } from '@/types';

interface NewArrivalsPageProps {
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
  };
  auth?: { user?: any };
  wishlist: any;
  productRatings: Record<string, { average: number; count: number }>;
  showcasingFallback: boolean;
  showcasingCount: number;
  newestArrivalAt: string | null;
  filters: {
    categories: string[];
    current: {
      category: string;
      search: string;
      sort_by: string;
    };
  };
}

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'price-low', label: 'Price: low to high' },
  { id: 'price-high', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'name', label: 'Name: A–Z' },
];

function formatAddedAt(value: string | null): string {
  if (!value) return 'just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'just now';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function daysSince(value: string | null): number | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

const NewArrivals = ({
  products,
  auth,
  wishlist,
  productRatings,
  showcasingFallback,
  showcasingCount,
  newestArrivalAt,
  filters,
}: NewArrivalsPageProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(filters.current.search);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const productData = useMemo(() => products?.data ?? [], [products]);

  const applyFilter = (next: Record<string, string>) => {
    const params: Record<string, string> = {
      category: filters.current.category,
      sort_by: filters.current.sort_by,
      search: filters.current.search,
      ...next,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === 'all') delete params[key];
    });

    router.get('/new-arrivals', params, { preserveState: false, preserveScroll: false });
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    applyFilter({ search: searchQuery.trim() });
  };

  const activeCategory = filters.current.category;
  const activeSort = filters.current.sort_by;

  const daysAgo = daysSince(newestArrivalAt);

  const categoryChips = filters.categories ?? [];

  return (
    <AppLayout user={auth?.user} wishlist={wishlist}>
      <SeoHead
        keywords="new arrivals, newest products, latest products, fresh arrivals, just landed"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'New Arrivals',
          description: 'The newest products listed on HaatPoint.',
          url: 'https://www.haatpoint.com/new-arrivals',
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-marigold to-marigold-dark text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ring-1 ring-white/30">
                <FiZap className="h-3 w-3" aria-hidden="true" />
                Just landed
              </span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">New Arrivals</h1>
              <p className="mt-2 max-w-xl text-white/85">
                Fresh drops from verified vendors across every category. Last item added
                {newestArrivalAt ? ` ${formatAddedAt(newestArrivalAt)}` : ' moments ago'}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: FiShoppingBag, label: 'Products', value: products?.total ?? 0 },
                { icon: FiTruck, label: 'Nationwide delivery', value: 'All 64 districts' },
                { icon: FiRefreshCw, label: 'Last updated', value: daysAgo === null ? 'today' : `${daysAgo}d ago` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[150px] rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur"
                >
                  <stat.icon className="h-5 w-5 opacity-90" aria-hidden="true" />
                  <p className="mt-2 font-display text-xl font-extrabold">{stat.value}</p>
                  <p className="text-xs text-white/75">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-paper-dim py-6 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb + toolbar */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="text-sm text-text-soft" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-marigold">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <BsChevronRight className="text-xs" />
                </li>
                <li className="font-medium text-ink">New Arrivals</li>
              </ol>
            </nav>

            <div className="flex flex-1 items-center gap-2 lg:max-w-3xl lg:justify-end">
              <form onSubmit={submitSearch} className="relative min-w-0 flex-1 lg:max-w-sm" role="search">
                <label htmlFor="new-arrivals-search" className="sr-only">
                  Search new arrivals
                </label>
                <BsSearch
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft"
                  aria-hidden="true"
                />
                <input
                  id="new-arrivals-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search within new arrivals…"
                  className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-text-soft focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30"
                />
              </form>

              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper lg:hidden"
                aria-expanded={showMobileFilters}
              >
                <BsSortDown className="h-4 w-4" aria-hidden="true" />
                Filter
              </button>
            </div>
          </div>

          {/* Category chips */}
          <div className="mb-4 overflow-x-auto rounded-xl border border-line bg-white p-2 shadow-hard-sm">
            <div className="flex min-w-max gap-1">
              <button
                onClick={() => applyFilter({ category: 'all' })}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === 'all' ? 'bg-ink text-white' : 'text-text-soft hover:bg-paper-dim hover:text-ink'
                }`}
              >
                All new arrivals
              </button>
              {categoryChips.map((category) => (
                <button
                  key={category}
                  onClick={() => applyFilter({ category })}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    activeCategory === category ? 'bg-marigold text-white' : 'text-text-soft hover:bg-paper-dim hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-soft">
              Showing <span className="font-semibold text-ink">{productData.length}</span> of{' '}
              <span className="font-semibold text-ink">{products?.total ?? 0}</span> new arrivals
            </p>

            <div className="flex items-center gap-3">
              <label htmlFor="new-arrivals-sort" className="sr-only">
                Sort new arrivals
              </label>
              <div className="relative">
                <select
                  id="new-arrivals-sort"
                  value={activeSort}
                  onChange={(event) => applyFilter({ sort_by: event.target.value })}
                  className="appearance-none rounded-lg border border-line bg-white py-2 pl-3 pr-9 text-sm font-medium text-ink focus:border-marigold focus:outline-none focus:ring-2 focus:ring-marigold/30"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <BsSortDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft"
                  aria-hidden="true"
                />
              </div>

              <div className="flex items-center overflow-hidden rounded-lg border border-line bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-ink text-white' : 'text-text-soft hover:bg-paper-dim'}`}
                  title="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <BsGrid3X3Gap className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`border-l border-line p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-ink text-white' : 'text-text-soft hover:bg-paper-dim'
                  }`}
                  title="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="sr-only">List view</span>
                </button>
              </div>
            </div>
          </div>

          {showMobileFilters && (
            <div className="mb-6 rounded-xl border border-line bg-white p-4 lg:hidden">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-ink">Sort by</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-text-soft hover:text-ink">
                  <BsX className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Close filters</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      applyFilter({ sort_by: option.id });
                      setShowMobileFilters(false);
                    }}
                    className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      activeSort === option.id ? 'bg-marigold text-white' : 'bg-paper text-ink hover:bg-paper-dim'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          {productData.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {productData.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  user={auth?.user || null}
                  badge={product.product_type === 'new-arrival' ? 'New' : undefined}
                  initialAverageRating={productRatings?.[String(product.id)]?.average ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white px-6 py-16 text-center shadow-hard-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-paper-dim">
                <FiShoppingBag className="h-7 w-7 text-text-soft" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-ink">No new arrivals yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-soft">
                {showcasingFallback
                  ? 'Vendors have not flagged any products as new arrivals in the last 90 days. Browse the full catalogue in the meantime.'
                  : 'Nothing matches these filters. Try another category or clear the search.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {filters.current.search && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      applyFilter({ search: '' });
                    }}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper"
                  >
                    Clear search
                  </button>
                )}
                {activeCategory !== 'all' && (
                  <button
                    onClick={() => applyFilter({ category: 'all' })}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper"
                  >
                    All categories
                  </button>
                )}
                <Link
                  href="/products"
                  className="rounded-lg bg-marigold px-5 py-2 text-sm font-bold text-white shadow-hard-marigold transition-transform hover:-translate-y-0.5"
                >
                  Browse all products
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {productData.length > 0 && products.last_page > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
              <p className="text-xs text-text-soft">
                Page {products.current_page} of {products.last_page}
              </p>
              <div className="flex flex-wrap items-center gap-1">
                <Link
                  href={`/new-arrivals?page=${Math.max(1, products.current_page - 1)}&category=${encodeURIComponent(
                    activeCategory
                  )}&sort_by=${activeSort}&search=${encodeURIComponent(filters.current.search)}`}
                  preserveScroll
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    products.current_page <= 1
                      ? 'pointer-events-none border-line text-text-soft/40'
                      : 'border-line text-ink hover:bg-paper'
                  }`}
                >
                  Previous
                </Link>

                {Array.from({ length: Math.min(products.last_page, 5) }, (_, index) => index + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/new-arrivals?page=${page}&category=${encodeURIComponent(activeCategory)}&sort_by=${activeSort}&search=${encodeURIComponent(
                      filters.current.search
                    )}`}
                    preserveScroll
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      products.current_page === page
                        ? 'border-ink bg-ink text-white'
                        : 'border-line text-text-soft hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  href={`/new-arrivals?page=${Math.min(products.last_page, products.current_page + 1)}&category=${encodeURIComponent(
                    activeCategory
                  )}&sort_by=${activeSort}&search=${encodeURIComponent(filters.current.search)}`}
                  preserveScroll
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    products.current_page >= products.last_page
                      ? 'pointer-events-none border-line text-text-soft/40'
                      : 'border-line text-ink hover:bg-paper'
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}

          {showcasingFallback && showcasingCount === 0 && productData.length > 0 && (
            <p className="mt-6 rounded-lg border border-line bg-white px-4 py-3 text-xs text-text-soft">
              No vendor has flagged products as “new arrival” yet, so this page is showing the most recently
              listed products from the last 90 days.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NewArrivals;
