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
  if (!images) return "/placeholder.jpg";

  let raw: string | null = null;
  try {
    const clean = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed[0]) raw = parsed[0];
  } catch {
    const trimmed = images.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) raw = trimmed;
  }

  if (!raw) return "/placeholder.jpg";
  return raw.startsWith("http") || raw.startsWith("/") ? raw : `/storage/${raw}`;
}

function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

function getStoreLogoSrc(logo?: string | null): string {
  if (!logo) return "";
  if (logo.startsWith("http") || logo.startsWith("/")) return logo;
  return `/storage/${logo}`;
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

  // Filter products by genuine sold total and keep up to 6 for a balanced 3x2 grid
  const topProducts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        sold: Number(product.sold ?? product.sold_count ?? 0),
      }))
      .filter((product) => Number.isFinite(product.sold) && product.sold > minSold)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);
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

      {/* Relaxed, Balanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
        {topProducts.map((product, index) => {
          const rank = index + 1;
          const imageSrc = getImageSrc(product.images);
          const displayPrice = withMarkup(product.sale_price || product.regular_price);
          const originalPrice = product.regular_price ? withMarkup(product.regular_price) : 0;
          const discount = calculateDiscount(Number(product.regular_price), Number(product.sale_price));
          const numericRating = Number(product.rating || 0);
          const reviewCount = Number(product.review || 0);
          const storeLogo = getStoreLogoSrc(product.store?.logo);
          const storeName = product.store?.name || "Verified Store";
          const isPro = product.store?.agent?.plan === "pro";

          const hasVariants =
            parseVariantList(product.size).length > 0 || parseVariantList(product.color).length > 0;

          return (
            <div
              key={product.id}
              className="top-card bg-white rounded-2xl border border-line/70 p-4 sm:p-5 hover:border-marigold/50 hover:shadow-hard-sm transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper-dim mb-4">
                  <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                  </Link>

                  {/* Top-Left Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    {rank === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs">
                        <span>🏆</span>
                        <span>#1 Best Seller</span>
                      </span>
                    ) : rank === 2 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-ink border border-line/70 shadow-xs">
                        <span>🥈 #2 Pick</span>
                      </span>
                    ) : rank === 3 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-ink border border-line/70 shadow-xs">
                        <span>🥉 #3 Pick</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-text-soft border border-line/60">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Wishlist Button */}
                  {user && (
                    <div className="absolute top-3 right-3 z-10 scale-95">
                      <WishlistButton productId={product.id} />
                    </div>
                  )}

                  {/* Bottom-Left Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs z-10">
                      -{discount}%
                    </span>
                  )}

                  {/* Bottom-Right Quick View Link */}
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-ink hover:text-marigold hover:bg-white shadow-xs transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
                    aria-label={`View ${product.name}`}
                  >
                    <FaEye className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Store, Pro Badge & Category Row */}
                <div className="flex items-center gap-2 mb-2 text-xs text-text-soft">
                  {product.store && (
                    <Link
                      href={`/stores/${product.store.id}`}
                      className="inline-flex items-center gap-1.5 hover:text-ink transition-colors truncate max-w-[140px]"
                    >
                      {storeLogo ? (
                        <img
                          src={storeLogo}
                          alt={storeName}
                          className="w-4 h-4 rounded-full object-cover border border-line shrink-0"
                        />
                      ) : (
                        <FaStore className="w-3.5 h-3.5 text-marigold shrink-0" />
                      )}
                      <span className="truncate">{storeName}</span>
                    </Link>
                  )}

                  {isPro && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-marigold/10 text-marigold border border-marigold/20 shrink-0">
                      ★ Pro
                    </span>
                  )}

                  {product.category && (
                    <>
                      <span className="text-line">•</span>
                      <span className="truncate">{product.category}</span>
                    </>
                  )}
                </div>

                {/* Product Title */}
                <h3 className="text-base font-bold text-ink leading-snug line-clamp-2 group-hover:text-marigold transition-colors mb-2">
                  <Link href={`/products/${product.slug || product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                {/* Star Rating & Sold Proof */}
                <div className="flex items-center justify-between gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    {renderStars(numericRating > 0 ? numericRating : 5)}
                    <span className="font-semibold text-ink text-[11px]">
                      {numericRating > 0 ? numericRating.toFixed(1) : "5.0"}
                    </span>
                    <span className="text-text-soft text-[11px]">
                      ({reviewCount > 0 ? reviewCount : "10+"})
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-soft bg-paper-dim px-2 py-0.5 rounded-full shrink-0">
                    <FaFire className="text-amber-500 w-2.5 h-2.5" />
                    <span>{product.sold ?? product.sold_count ?? 0} sold</span>
                  </span>
                </div>
              </div>

              {/* Price & Action Button Footer */}
              <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-ink truncate">
                    <FormatPrice price={displayPrice} />
                  </div>
                  {discount > 0 && originalPrice > 0 && (
                    <div className="text-xs text-text-soft line-through truncate">
                      <FormatPrice price={originalPrice} />
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {hasVariants ? (
                    <button
                      type="button"
                      onClick={() => setOptionsProduct(product)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-ink hover:bg-marigold text-white text-xs font-semibold transition-colors duration-200 shadow-sm"
                    >
                      <FaEye className="w-3 h-3" />
                      <span>Select Options</span>
                    </button>
                  ) : (
                    <AddtoCartButton
                      product={product}
                      variant="full"
                      size="sm"
                      showVariantPicker={false}
                      onRequireOptions={() => setOptionsProduct(product)}
                      className="!py-2 !px-3.5 !rounded-xl !text-xs !font-semibold"
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
