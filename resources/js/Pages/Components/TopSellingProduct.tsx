import { useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
import { FaEye } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import AddtoCartButton from "../buttons/AddtoCartButton";
import FormatPrice from "../utils/FormatePrice";
import { Product } from "@/types";
import WishlistButton from "../buttons/WishListButton";


gsap.registerPlugin(ScrollTrigger);

interface TopSellingProductProps {
  products: TopSellingItem[];
  user: any;
  minSold?: number;
}

/** A product plus its real sold total, aggregated from order_items. */
type TopSellingItem = Product & { sold_count: number | string };

function getImageSrc(images: string): string {
  if (!images) return "/placeholder.jpg";

  let raw: string | null = null;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed[0]) raw = parsed[0];
  } catch {
    const trimmed = images.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) raw = trimmed;
  }

  if (!raw) return "/placeholder.jpg";
  return raw.startsWith("http") || raw.startsWith("/") ? raw : `/storage/${raw}`;
}

const formatRank = (index: number) => String(index + 1).padStart(2, "0");

const LEADERBOARD_GRID =
  "grid grid-cols-[38px_46px_minmax(0,1fr)] sm:grid-cols-[48px_60px_minmax(0,1fr)] md:grid-cols-[64px_76px_minmax(0,1fr)_170px_260px]";

const TopSellingProduct = ({ products, user, minSold = 3 }: TopSellingProductProps) => {
  const scope = useRef<HTMLElement>(null);

  // Only products with a genuine sold total above the threshold qualify. The
  // stock level (product.quantity) is deliberately not used here.
  const topProducts = useMemo(() => {
    return products
      .map((product) => ({ ...product, sold: Number(product.sold_count ?? 0) }))
      .filter((product) => Number.isFinite(product.sold) && product.sold > minSold)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
  }, [products, minSold]);

  const maxSold = Math.max(...topProducts.map((p) => p.sold), 1);

  useGSAP(
    () => {
      if (!scope.current || topProducts.length === 0) return;

      const rows = gsap.utils.toArray(".board-row");
      gsap.set(rows, { opacity: 0, y: 24 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".bar-fill").forEach((barElement) => {
        const target = barElement.getAttribute("data-pct");
        if (!target) return;
        gsap.fromTo(
          barElement,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope, dependencies: [topProducts.length] }
  );

  if (topProducts.length === 0) {
    return (
      <section id="topselling" ref={scope} className="py-16 md:py-20 bg-paper-dim">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-xl shadow-hard-sm border border-line">
            <div className="w-20 h-20 mx-auto mb-4 bg-paper-dim rounded-full flex items-center justify-center">
              <FaEye className="text-3xl text-text-soft" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">No best sellers yet</h3>
            <p className="text-text-soft max-w-md mx-auto">
              This leaderboard only lists products that have sold more than {minSold} times. Nothing has
              reached that yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="topselling" ref={scope} className="py-16 sm:py-20 md:py-24 bg-paper-dim">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-10 sm:mb-12 md:mb-14">
          <div>
            <Eyebrow>Ranked by confirmed sales this month</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-[30px] lg:text-[36px] xl:text-[44px] font-bold text-ink">
              Top Selling Products
            </h2>
            <p className="text-text-soft text-sm sm:text-base mt-3">
              {topProducts.length} {topProducts.length === 1 ? 'product has' : 'products have'} sold more than{' '}
              {minSold} times this month
            </p>
          </div>
          <Link
            href={route('products.index')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-1 hover:border-marigold transition-colors whitespace-nowrap"
          >
            Full leaderboard {"\u2192"}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-5 sm:p-6">
            <p className="text-[11px] sm:text-xs font-mono text-text-soft uppercase tracking-wide">Total Sales</p>
            <p className="text-2xl sm:text-3xl font-bold text-ink mt-2">
              {topProducts.reduce((sum, p) => sum + p.sold, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-5 sm:p-6">
            <p className="text-[11px] sm:text-xs font-mono text-text-soft uppercase tracking-wide">Top Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-ink mt-2">{topProducts.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-5 sm:p-6">
            <p className="text-[11px] sm:text-xs font-mono text-text-soft uppercase tracking-wide">Best Seller</p>
            <p className="text-sm sm:text-base font-semibold text-ink mt-2.5 leading-snug line-clamp-2">
              {topProducts[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-hard-sm border border-line p-5 sm:p-6">
            <p className="text-[11px] sm:text-xs font-mono text-text-soft uppercase tracking-wide">Top Sales</p>
            <p className="text-2xl sm:text-3xl font-bold text-marigold mt-2">
              {topProducts[0]?.sold || 0}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden">

          <div className="overflow-x-auto">
            <div className="min-w-full md:min-w-[880px]">
              {/* Column labels, desktop only */}
              <div
                className={`${LEADERBOARD_GRID} hidden md:grid items-center gap-6 px-6 lg:px-8 py-4 bg-paper-dim border-b border-line`}
              >
                <span className="text-[11px] font-mono uppercase tracking-wide text-text-soft">Rank</span>
                <span aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-wide text-text-soft">Product</span>
                <span className="text-[11px] font-mono uppercase tracking-wide text-text-soft">Share of top</span>
                <span className="text-[11px] font-mono uppercase tracking-wide text-text-soft text-right">
                  Sales &amp; actions
                </span>
              </div>
              {topProducts.map((product, index) => {
                const rank = formatRank(index);
                const isFirst = index === 0;
                const isTop3 = index < 3;
                const imageSrc = getImageSrc(product.images);
                const soldCount = product.sold;
                const percentage = Math.round((soldCount / maxSold) * 100);
                const displayPrice = product.sale_price || product.regular_price;
                const discount =
                  product.sale_price && product.sale_price < product.regular_price
                    ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                    : 0;

                const getRankEmoji = (idx: number) => {
                  if (idx === 0) return "\u{1F947}";
                  if (idx === 1) return "\u{1F948}";
                  if (idx === 2) return "\u{1F949}";
                  return null;
                };

                return (
                  <div
                    key={product.id}
                    className={`board-row group ${LEADERBOARD_GRID} items-center gap-4 sm:gap-5 md:gap-6 py-5 sm:py-6 md:py-7 px-4 sm:px-6 lg:px-8 border-b border-line last:border-b-0 transition-colors duration-200 hover:bg-marigold/[0.04] ${
                      isFirst ? 'bg-marigold/[0.03]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-display font-black text-xl sm:text-2xl md:text-[30px] lg:text-[34px] ${
                          isFirst ? "text-marigold" : "text-text-soft/40"
                        }`}
                        style={!isFirst ? { WebkitTextStroke: "1.2px #1B1B1B" } : undefined}
                      >
                        {rank}
                      </div>
                      {getRankEmoji(index) && (
                        <span className="text-xl sm:text-2xl hidden sm:inline">
                          {getRankEmoji(index)}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <div className={`rounded-lg w-11 h-11 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] flex items-center justify-center overflow-hidden ${
                        isFirst ? 'ring-2 ring-marigold' : ''
                      }`}>
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      {discount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                          -{discount}%
                        </span>
                      )}
                      {isFirst && (
                        <span className="absolute -bottom-1.5 -right-1.5 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-marigold text-white">
                          #1
                        </span>
                      )}
                    </div>

                    {/* Info (holds everything on mobile) */}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm sm:text-[15px] md:text-base mb-1.5 flex items-center gap-2">
                        <span className="truncate">{product.name}</span>
                        {isTop3 && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap flex-shrink-0 ${
                            isFirst ? 'bg-marigold' : 'bg-gray-500'
                          }`}>
                            {isFirst ? "\u{1F3C6} Best" : `#${index + 1}`}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] sm:text-[11px] md:text-xs text-text-soft uppercase flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="truncate">{product.category}</span>
                        <span aria-hidden="true" className="w-1 h-1 rounded-full bg-line shrink-0" />
                        <span className="whitespace-nowrap font-bold text-ink">
                          <FormatPrice price={displayPrice} />
                        </span>
                      </div>

                      {/* Sold + actions, mobile only */}
                      <div className="flex md:hidden items-center gap-3 mt-3">
                        <span className="text-[11px] font-mono text-text-soft whitespace-nowrap">
                          <strong className="text-ink">{soldCount}</strong> sold
                        </span>
                        {user && (
                          <div className="scale-90 origin-left">
                            <WishlistButton productId={product.id} />
                          </div>
                        )}
                        <Link
                          href={`/products/${product.slug}`}
                          className="p-1.5 -m-1.5 rounded-full hover:bg-paper-dim transition-colors"
                          aria-label={`View ${product.name}`}
                        >
                          <FaEye className="w-3.5 h-3.5 text-text-soft" />
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar, desktop only */}
                    <div className="hidden md:block">
                      <div className="flex items-center gap-3.5">
                        <div className="flex-1 rounded-full overflow-hidden h-2.5 bg-paper-dim">
                          <div
                            className={`bar-fill h-full transition-all duration-300 ${
                              isFirst ? 'bg-gradient-to-r from-marigold to-marigold-dark' : 'bg-marigold'
                            }`}
                            data-pct={percentage}
                            style={{ width: 0 }}
                          />
                        </div>
                        <span className="text-[13px] font-mono text-text-soft min-w-[46px] text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Sold count + actions, desktop only */}
                    <div className="hidden md:flex items-center justify-end gap-5">
                      <div className="text-right font-mono text-[13px] text-text-soft whitespace-nowrap min-w-[104px]">
                        <strong className={`font-display block text-2xl leading-tight ${
                          isFirst ? 'text-marigold' : 'text-ink'
                        }`}>
                          {soldCount}
                        </strong>
                        sold this month
                      </div>
                      <div className="flex items-center gap-2">
                        {user && <WishlistButton productId={product.id} />}
                        <Link href={`/products/${product.slug}`} className="p-2.5 rounded-full hover:bg-paper-dim transition-colors">
                          <FaEye className="w-4 h-4 text-text-soft hover:text-marigold" />
                        </Link>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <AddtoCartButton product={product} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 bg-gray-900 hover:bg-marigold text-white rounded-lg font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="text-sm text-text-soft mt-5">
            Showing {topProducts.length} {topProducts.length === 1 ? 'product' : 'products'} with more than{' '}
            {minSold} sales
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopSellingProduct;
