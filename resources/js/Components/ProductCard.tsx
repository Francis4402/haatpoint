// ProductCard.tsx
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaEye, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import axios from "axios";
import { Product, User } from "@/types";
import AddtoCartButton from "@/Pages/buttons/AddtoCartButton";
import FormatPrice from "@/Pages/utils/FormatePrice";
import { withMarkup } from "@/Pages/utils/price";
import WishlistButton from "@/Pages/buttons/WishListButton";
import { parseVariantList } from "@/Pages/utils/parseVariants";
import SelectOptionsDialog from "@/Components/SelectOptionsDialog";
import { resolveProductImage, toHighResShopBase, handleProductImageError } from "@/Pages/utils/resolveProductImage";


interface ProductCardProps {
  product: Product;
  badge?: string;
  user: User | null;
  variant?: "default" | "trending" | "featured";
  showQuickView?: boolean;
  initialAverageRating?: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  Electronics: "Devices",
  Fashion: "Apparel",
  "Home & Living": "Home",
  Beauty: "Beauty",
  Books: "Books",
  Sports: "Sports",
  Toys: "Toys",
  Gaming: "Gaming",
  Automotive: "Auto",
};

const CATEGORY_GRADIENT: Record<string, [string, string]> = {
  Electronics: ["#F2F2EE", "#E3E1DB"],
  Fashion: ["#F7F5F1", "#E9E6DF"],
  "Home & Living": ["#F5F3EF", "#E6E2DA"],
  Beauty: ["#F3F2EE", "#E4E1D9"],
  Books: ["#F1F1ED", "#E2DFD8"],
  Sports: ["#F4F3EF", "#E5E2DA"],
  Toys: ["#F5F3EF", "#E7E3DB"],
  Gaming: ["#F2F1ED", "#E3E0D9"],
  Automotive: ["#F3F4F6", "#E2E4E8"],
};
const DEFAULT_GRADIENT: [string, string] = ["#FBFBF9", "#F2F2EE"];

function getImageSrc(images: string): string {
  return resolveProductImage(images, '/placeholder.jpg');
}

function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

// Render stars based on average rating
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-3 h-3 text-amber-400 fill-current" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="w-3 h-3 text-amber-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      ))}
    </div>
  );
};


const LazyProductImage = ({
  src,
  alt,
  className,
  onError
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}) => (
  <img
    src={toHighResShopBase(src)}
    alt={alt}
    loading="lazy"
    decoding="async"
    onError={(e) => {
      handleProductImageError(e);
    }}
    className={`w-full h-full object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-105 ${className || ''}`}
    style={{
      imageRendering: '-webkit-optimize-contrast',
    }}
  />
);

const ProductCard = ({
  product,
  badge,
  variant = "default",
  showQuickView = true,
  user,
  initialAverageRating = 0,
}: ProductCardProps) => {
  const productRating = product.rating !== undefined ? Number(product.rating) : initialAverageRating;
  const [imageFailed, setImageFailed] = useState(false);
  const [averageRating, setAverageRating] = useState(productRating ?? 0);
  const [loading, setLoading] = useState(productRating === undefined);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const productUrl = `/products/${product.slug || product.id}`;
  const imageSrc = getImageSrc(product.images);
  const categoryLabel = "emoji" in product && (product as any).emoji
    ? (product as any).emoji
    : CATEGORY_LABEL[product.category ?? ""] ?? (product.category || "Product");
  const [gradientFrom, gradientTo] = CATEGORY_GRADIENT[product.category ?? ""] ?? DEFAULT_GRADIENT;
  const store = product.store;

  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const hasDiscount = discount > 0;
  const hasSalePrice = product.sale_price !== undefined && product.sale_price !== null && product.sale_price > 0;
  const displayPrice = withMarkup(hasSalePrice ? product.sale_price : product.regular_price);
  const regularDisplayPrice = withMarkup(product.regular_price);
  const showImage = imageSrc && !imageFailed;

  const availableSizes = parseVariantList(product.size);
  const availableColors = parseVariantList(product.color);
  const hasVariants = availableSizes.length > 0 || availableColors.length > 0;

  // Real review data from props or preloaded ratings; fallback to 0 to prevent N+1 AJAX floods
  useEffect(() => {
    if (product.rating !== undefined) {
      setAverageRating(Number(product.rating) || 0);
      setLoading(false);
      return;
    }
    if (initialAverageRating !== undefined) {
      setAverageRating(initialAverageRating);
      setLoading(false);
      return;
    }

    setAverageRating(0);
    setLoading(false);
  }, [product.rating, initialAverageRating]);

  // Determine if we should show the rating section
  const hasRating = averageRating > 0;

  // Handle image error
  const handleImageError = () => {
    setImageFailed(true);
  };

  return (
    <div
      className="group bg-white border border-[#E3E1DB]/90 hover:border-marigold/60 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-hard-md flex flex-col justify-between"
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F7F6F2]">
        <Link
          href={productUrl}
          className="block w-full h-full cursor-pointer"
          aria-label={`View ${product.name}`}
          onClick={(e) => {
            // On mobile view (<768px), if the product has options, open dialog instead of navigating
            if (hasVariants && typeof window !== "undefined" && window.innerWidth < 768) {
              e.preventDefault();
              e.stopPropagation();
              setIsOptionsOpen(true);
            }
          }}
        >
          {imageSrc ? (
            <LazyProductImage
              src={imageSrc}
              alt={`${product.name} - Product image`}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center px-3 text-center transition-transform duration-500 group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#1B1B1B]/70">
                {categoryLabel}
              </span>
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {hasDiscount ? (
          <span
            className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-[10px] sm:text-xs shadow-xs tracking-tight"
            aria-label={`${discount}% off`}
          >
            -{discount}%
          </span>
        ) : badge && !/shopbase/i.test(badge) ? (
          <span
            className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 rounded-md px-2 py-0.5 bg-ink text-white font-mono text-[9px] sm:text-[10px] uppercase font-bold shadow-xs"
            aria-label={`${badge} badge`}
          >
            {badge}
          </span>
        ) : variant === "trending" ? (
          <span
            className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 rounded-md px-2 py-0.5 bg-amber-500 text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase shadow-xs flex items-center gap-1"
            aria-label="Trending product"
          >
            <FiZap className="w-2.5 h-2.5" aria-hidden="true" />
            Trending
          </span>
        ) : null}

        {/* Wishlist Button - Top Right */}
        {user && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
            <div className="p-1 rounded-full bg-white/85 hover:bg-white backdrop-blur-sm shadow-xs transition-all scale-90 sm:scale-100">
              <WishlistButton productId={product.id} />
            </div>
          </div>
        )}

        {/* Desktop Quick Action Hover Overlay */}
        <div className="hidden sm:block absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 z-20">
          {hasVariants ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOptionsOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-ink hover:bg-marigold text-white text-xs font-semibold shadow-md transition-all active:scale-98"
            >
              <FaEye className="w-3.5 h-3.5 text-marigold" />
              <span>Select Options</span>
            </button>
          ) : (
            <AddtoCartButton
              product={product}
              showVariantPicker={false}
              onRequireOptions={() => setIsOptionsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Subcategory & In Stock Row (No Store Logo or Name) */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#767470] mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              {product.brand && !/shopbase/i.test(product.brand) && (
                <span className="font-mono uppercase tracking-wider font-bold text-ink/80 text-[9.5px] sm:text-[10px] bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                  {product.brand}
                </span>
              )}
              <span className="font-mono uppercase tracking-wider font-semibold text-marigold truncate">
                {product.subcategory || product.category || 'Product'}
              </span>
            </div>
            {hasRating && averageRating > 0 ? (
              <div className="flex items-center gap-1 shrink-0">
                <FaStar className="w-2.5 h-2.5 text-amber-400 fill-current" />
                <span className="font-mono font-bold text-ink text-[10px] sm:text-[11px]">{averageRating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[9.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                In Stock
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-xs sm:text-[14px] leading-snug mb-1.5 sm:mb-2 line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-marigold transition-colors text-ink">
            <Link href={productUrl} className="hover:underline">
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Savings */}
        <div>
          <div className="flex items-baseline justify-between gap-1 flex-wrap mt-auto">
            <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5 min-w-0">
              <span className="font-display font-black text-sm sm:text-base md:text-lg text-ink truncate" aria-label={`Price: ${displayPrice}`}>
                <FormatPrice price={displayPrice} />
              </span>
              {hasSalePrice && (
                <span className="text-[10px] sm:text-xs text-[#8E8B85] line-through truncate" aria-label={`Original price: ${regularDisplayPrice}`}>
                  <FormatPrice price={regularDisplayPrice} />
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="hidden sm:inline-block text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
                Save <FormatPrice price={regularDisplayPrice - displayPrice} />
              </span>
            )}
          </div>

          {/* Mobile View Action Button (Clean 2-card mobile layout) */}
          <div className="sm:hidden mt-2 pt-1.5 border-t border-line/60">
            {hasVariants ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOptionsOpen(true);
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-ink hover:bg-marigold text-white text-[11px] font-semibold shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all truncate"
              >
                <FaEye className="w-3 h-3 text-marigold shrink-0" />
                <span className="truncate">Options</span>
              </button>
            ) : (
              <AddtoCartButton
                product={product}
                showVariantPicker={false}
                size="sm"
                onRequireOptions={() => setIsOptionsOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Select Options Dialog */}
      {hasVariants && (
        <SelectOptionsDialog
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          product={product}
          store={store}
        />
      )}
    </div>
  );
};

export default ProductCard;
