// ProductCard.tsx
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaEye, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import axios from "axios";
import { Product, User } from "@/types";
import AddtoCartButton from "@/Pages/buttons/AddtoCartButton";
import FormatPrice from "@/Pages/utils/FormatePrice";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import WishlistButton from "@/Pages/buttons/WishListButton";


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
  Food: "Grocery",
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
  Food: ["#F6F4F0", "#E8E4DC"],
  Books: ["#F1F1ED", "#E2DFD8"],
  Sports: ["#F4F3EF", "#E5E2DA"],
  Toys: ["#F5F3EF", "#E7E3DB"],
  Gaming: ["#F2F1ED", "#E3E0D9"],
  Automotive: ["#F3F4F6", "#E2E4E8"],
};
const DEFAULT_GRADIENT: [string, string] = ["#FBFBF9", "#F2F2EE"];

function getImageSrc(images: string): string {
  if (!images) return "";

  try {
    const cleanString = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(cleanString);
    const imagePath = Array.isArray(parsed) ? parsed[0] : null;
    if (!imagePath) return "";
    return imagePath.startsWith("http") || imagePath.startsWith("/") ? imagePath : `/storage/${imagePath}`;
  } catch {
    const trimmed = images.trim();
    return trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : "";
  }
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
  <LazyLoadImage
    src={src}
    alt={alt}
    effect="blur"
    wrapperClassName="w-full h-full"
    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${className || ''}`}
    placeholderSrc="/otherplaceholder.jpg"
    threshold={100}
    visibleByDefault={false}
    onError={onError}
    loading="lazy"
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
  const [imageFailed, setImageFailed] = useState(false);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [loading, setLoading] = useState(true);

  const imageSrc = getImageSrc(product.images);
  const categoryLabel = "emoji" in product && (product as any).emoji
    ? (product as any).emoji
    : CATEGORY_LABEL[product.category ?? ""] ?? (product.category || "Product");
  const [gradientFrom, gradientTo] = CATEGORY_GRADIENT[product.category ?? ""] ?? DEFAULT_GRADIENT;
  const store = product.store;
  const storeLogo = getStoreLogoSrc(store?.logo);
  const vendor = store?.name ?? (("vendor" in product ? (product as any).vendor : null) ?? product.category ?? "General");

  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const hasDiscount = discount > 0;
  const hasSalePrice = product.sale_price !== undefined && product.sale_price !== null && product.sale_price > 0;
  const displayPrice = hasSalePrice ? product.sale_price : product.regular_price;
  const showImage = imageSrc && !imageFailed;

  // Fetch real review data using the route: /products/{product}/comments
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axios
      .get(`/products/${product.id}/comments`)
      .then((res) => {
        if (!cancelled) {
          const stats = res.data.stats || {};
          setAverageRating(stats.average || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch review data:", err);
        setLoading(false);
        setAverageRating(initialAverageRating);
      });
    return () => {
      cancelled = true;
    };
  }, [product.id, initialAverageRating]);

  // Determine if we should show the rating section
  const hasRating = averageRating > 0;

  // Handle image error
  const handleImageError = () => {
    setImageFailed(true);
  };

  return (
    <div
      className="group bg-white border border-[#E3E1DB] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-hard-sm"
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {showImage ? (
          <LazyProductImage
            src={imageSrc}
            alt={`${product.name} - Product image`}
            onError={handleImageError}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center px-3 text-center transition-transform duration-500 group-hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          >
            <span className="font-mono text-sm font-semibold uppercase tracking-wider text-[#1B1B1B]/70">
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Badge - Custom badge from props */}
        {badge && (
          <span
            className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#1B1B1B] text-white font-mono text-[10px] uppercase shadow-lg z-10"
            aria-label={`${badge} badge`}
          >
            {badge}
          </span>
        )}

        {/* Brand Badge - Show brand on image if no custom badge */}
        {!badge && product.brand && (
          <span
            className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#6E7F5C] text-white font-mono text-[10px] font-bold uppercase shadow-lg z-10"
            aria-label={`Brand: ${product.brand}`}
          >
            {product.brand}
          </span>
        )}

        {/* Trending Badge */}
        {variant === "trending" && !badge && !product.brand && (
          <span
            className="absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#E7F4EF] text-[#4F6B63] font-mono text-[10px] font-bold uppercase shadow-lg z-10 flex items-center gap-1"
            aria-label="Trending product"
          >
            <FiZap className="w-3 h-3" aria-hidden="true" />
            Trending
          </span>
        )}

        {/* Action Buttons */}
        <div
          className="absolute top-2.5 right-2.5 flex flex-col items-start gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20"
          role="toolbar"
          aria-label="Product actions"
        >
          {user && <WishlistButton productId={product.id} />}
          {showQuickView && (
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
              aria-label={`Quick view ${product.name}`}
            >
              <FaEye className="w-4 h-4 text-gray-600 hover:text-[#6E7F5C]" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Quick Add to Cart - Bottom */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
          <AddtoCartButton product={product} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor/Category & Brand */}
        <div className="font-mono text-[10.5px] text-[#767470] uppercase tracking-wide mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {store ? (
              <Link
                href={`/stores/${store.id}`}
                className="shrink-0"
                title={`Visit ${vendor}`}
                aria-label={`Visit ${vendor}`}
              >
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt={`${vendor} store logo`}
                    loading="lazy"
                    className="w-7 h-7 rounded-full object-cover border border-[#E3E1DB] bg-white shadow-sm"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-[#E7F4EF] text-[#4F6B63] flex items-center justify-center text-[11px] font-bold">
                    {vendor.charAt(0)}
                  </span>
                )}
              </Link>
            ) : (
              <span className="min-w-0 truncate">{vendor}</span>
            )}
          </div>
          {variant === "trending" && !badge && !product.brand && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-[#E7F4EF] text-[#4F6B63] font-mono text-[9px] font-bold">
              <FiZap className="w-3 h-3" aria-hidden="true" />
              Trending
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-[14.5px] leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-[#6E7F5C] transition-colors">
          {product.name}
        </h3>

        {/* Rating - Only show if there's a rating */}
        {hasRating && !loading ? (
          <div className="flex items-center gap-2 mb-2">
            {renderStars(averageRating)}
            <span className="text-xs font-mono text-[#767470]">
              {averageRating.toFixed(1)}
            </span>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 mb-2" aria-hidden="true">
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#767470]">No reviews yet</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl" aria-label={`Price: ${displayPrice}`}>
              <FormatPrice price={displayPrice} />
            </span>
            {hasSalePrice && (
              <span className="text-sm text-[#767470] line-through" aria-label={`Original price: ${product.regular_price}`}>
                <FormatPrice price={product.regular_price} />
              </span>
            )}
          </div>
          {!showQuickView && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <AddtoCartButton product={product} />
            </div>
          )}
        </div>

        {/* Save Amount */}
        {hasDiscount && (
          <div className="mt-1.5">
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
              Save <FormatPrice price={product.regular_price - product.sale_price} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
