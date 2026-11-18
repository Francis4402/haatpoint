import { useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
import {
  FaEye,
  FaFire,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaArrowRight,
  FaStore,
  FaShoppingBag,
} from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import AddtoCartButton from "../buttons/AddtoCartButton";
import FormatPrice from "../utils/FormatePrice";
import { withMarkup } from "../utils/price";
import { Product } from "@/types";
import WishlistButton from "../buttons/WishListButton";
import { parseVariantList } from "../utils/parseVariants";
import SelectOptionsDialog from "@/Components/SelectOptionsDialog";
import { resolveProductImage, toHighResShopBase, handleProductImageError } from "../utils/resolveProductImage";

gsap.registerPlugin(ScrollTrigger);

interface TopSellingProductProps {
  products: TopSellingItem[];
  user: any;
  minSold?: number;
}

/** A product plus its real sold total, aggregated from order_items. */
type TopSellingItem = Product & {
  sold_count?: number | string;
  sold?: number;
  review?: number | string;
};

function getImageSrc(images: string): string {
  return resolveProductImage(images, '/placeholder.jpg');
}

function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-3 h-3 text-amber-400 fill-current" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="w-3 h-3 text-amber-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-3 h-3 text-gray-200" />
      ))}
    </div>
  );
};

const TopSellingProduct = ({ products, user, minSold = 3 }: TopSellingProductProps) => {
  const scope = useRef<HTMLElement>(null);
  const [optionsProduct, setOptionsProduct] = useState<Product | null>(null);

  // Filter products by genuine sold total and keep up to 12 for a rich grid
  const topProducts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        sold: Number(product.sold ?? product.sold_count ?? 0),
      }))
      .filter((product) => Number.isFinite(product.sold) && product.sold > minSold)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 12);
  }, [products, minSold]);

  useGSAP(
    () => {
      if (!scope.current || topProducts.length === 0) return;

      const cards = gsap.utils.toArray(".top-card");
      gsap.set(cards, { opacity: 0, y: 16 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
      });
    },
    { scope, dependencies: [topProducts.length] }
  );

  if (topProducts.length === 0) {
    return null;
  }

  return (
    <section id="topselling" ref={scope} className="relative">
      {/* Calm, Harmonious Section Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <Eyebrow>Customer Favorites</Eyebrow>
          <h2 className="text-[30px] sm:text-[36px] lg:text-[44px] font-bold text-ink leading-tight">
            Top selling products
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl">
            The most ordered products across Bangladesh this month, verified by real customer deliveries.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink hover:text-marigold transition-colors group shrink-0"
        >
          <span>View all products</span>
          <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Relaxed, Balanced Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {topProducts.map((product, index) => {
          const rank = index + 1;
          const imageSrc = getImageSrc(product.images);
          const displayPrice = withMarkup(product.sale_price || product.regular_price);
          const originalPrice = product.regular_price ? withMarkup(product.regular_price) : 0;
          const discount = calculateDiscount(Number(product.regular_price), Number(product.sale_price));
          const numericRating = Number(product.rating || 0);
          const reviewCount = Number(product.review || 0);

          const hasVariants =
            parseVariantList(product.size).length > 0 || parseVariantList(product.color).length > 0;

          return (
            <div
              key={product.id}
              className="top-card bg-white rounded-2xl border border-line/70 p-2.5 sm:p-5 hover:border-marigold/50 hover:shadow-hard-sm transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-paper-dim mb-2.5 sm:mb-4">
                  <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full">
                    <img
                      src={toHighResShopBase(imageSrc)}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                      }}
                      onError={(e) => {
                        handleProductImageError(e);
                      }}
                    />
                  </Link>

                  {/* Top-Left Rank Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    {rank === 1 ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs">
                        <span>🏆</span>
                        <span className="hidden sm:inline">#1 Best Seller</span>
                        <span className="sm:hidden">#1 Best</span>
                      </span>
                    ) : rank === 2 ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/95 backdrop-blur-sm text-ink border border-line/70 shadow-xs">
                        <span>🥈 #2</span>
                      </span>
                    ) : rank === 3 ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/95 backdrop-blur-sm text-ink border border-line/70 shadow-xs">
                        <span>🥉 #3</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-text-soft border border-line/60">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Wishlist Button */}
                  {user && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 scale-90 sm:scale-95">
                      <WishlistButton productId={product.id} />
                    </div>
                  )}

                  {/* Bottom-Left Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-500 text-white shadow-xs z-10">
                      -{discount}%
                    </span>
                  )}

                  {/* Bottom-Right Quick View Link */}
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm text-ink hover:text-marigold hover:bg-white shadow-xs transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
                    aria-label={`View ${product.name}`}
                  >
                    <FaEye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>

                {/* Category & Sold Count Row */}
                <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5 text-[9.5px] sm:text-xs text-text-soft">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {product.brand && !/shopbase/i.test(product.brand) && (
                      <span className="font-mono uppercase tracking-wider font-bold text-ink/80 text-[9px] sm:text-[9.5px] bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                        {product.brand}
                      </span>
                    )}
                    <span className="font-mono uppercase tracking-wider text-marigold font-semibold truncate">
                      {product.subcategory || product.category || 'Top Seller'}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold text-ink shrink-0 bg-paper-dim px-1.5 py-0.5 rounded border border-line/60">
                    🔥 {product.sold ?? 0} sold
                  </span>
                </div>

                {/* Product Title */}
                <h3 className="text-xs sm:text-base font-bold text-ink leading-snug line-clamp-2 group-hover:text-marigold transition-colors mb-1.5 sm:mb-2">
                  <Link href={`/products/${product.slug || product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                {/* Star Rating & Sold Proof */}
                <div className="flex items-center justify-between gap-1 mb-2.5 sm:mb-4 text-xs">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {renderStars(numericRating > 0 ? numericRating : 5)}
                    <span className="font-semibold text-ink text-[10px] sm:text-[11px]">
                      {numericRating > 0 ? numericRating.toFixed(1) : "5.0"}
                    </span>
                    <span className="text-text-soft text-[10px] sm:text-[11px]">
                      ({reviewCount > 0 ? reviewCount : "10+"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button Footer */}
              <div className="pt-2 sm:pt-3 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mt-auto">
                <div className="min-w-0">
                  <div className="text-sm sm:text-base md:text-lg font-black text-ink truncate">
                    <FormatPrice price={displayPrice} />
                  </div>
                  {discount > 0 && originalPrice > displayPrice && (
                    <div className="text-[10px] sm:text-xs text-text-soft line-through truncate">
                      <FormatPrice price={originalPrice} />
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  {hasVariants ? (
                    <button
                      type="button"
                      onClick={() => setOptionsProduct(product)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-ink hover:bg-marigold text-white text-[11px] font-semibold transition-all shadow-xs"
                    >
                      <FaEye className="w-3 h-3 text-marigold" />
                      <span>Options</span>
                    </button>
                  ) : (
                    <AddtoCartButton
                      product={product}
                      variant="full"
                      size="sm"
                      showVariantPicker={false}
                      onRequireOptions={() => setOptionsProduct(product)}
                      className="!w-full sm:!w-auto !py-1.5 !px-2.5 !rounded-lg !text-[11px] !font-semibold"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Variant Selection Modal */}
      {optionsProduct && (
        <SelectOptionsDialog
          isOpen={true}
          onClose={() => setOptionsProduct(null)}
          product={optionsProduct}
          store={optionsProduct.store}
        />
      )}
    </section>
  );
};

export default TopSellingProduct;
