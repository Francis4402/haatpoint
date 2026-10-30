import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Product, User } from '@/types';
import { FaStore, FaCrown, FaArrowRight, FaStar, FaStarHalfAlt, FaRegStar, FaLayerGroup } from 'react-icons/fa';
import FormatPrice from '@/Pages/utils/FormatePrice';
import { withMarkup } from '@/Pages/utils/price';
import { parseVariantList } from '@/Pages/utils/parseVariants';
import WishlistButton from '@/Pages/buttons/WishListButton';
import AddtoCartButton from '@/Pages/buttons/AddtoCartButton';
import SelectOptionsDialog from '@/Components/SelectOptionsDialog';

interface ProductListCardProps {
  product: Product;
  user?: User | null;
  initialAverageRating?: number;
  reviewCount?: number;
}

function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

function getPrimaryImage(images: string): string {
  if (!images) return '';
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const first = parsed[0];
      if (typeof first === 'string' && first.trim() !== '') {
        return first.trim();
      }
    }
    if (typeof parsed === 'string' && parsed.trim() !== '') {
      return parsed.trim();
    }
  } catch {
    const trimmed = images.trim();
    return trimmed.startsWith('http') || trimmed.startsWith('/') ? trimmed : '';
  }
  return '';
}

function resolveImageSrc(imageSrc: string): string {
  if (!imageSrc) return '/otherplaceholder.jpg';
  if (imageSrc.startsWith('http') || imageSrc.startsWith('/')) return imageSrc;
  return `/storage/${imageSrc}`;
}

function stripHtml(html?: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="w-2.5 h-2.5 text-amber-400 fill-current" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="w-2.5 h-2.5 text-amber-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="w-2.5 h-2.5 text-gray-300" />
      ))}
    </div>
  );
}

export default function ProductListCard({
  product,
  initialAverageRating = 0,
  reviewCount = 0,
}: ProductListCardProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const hasDiscount = Boolean(product.sale_price && product.sale_price < product.regular_price);
  const discountPercentage = hasDiscount
    ? calculateDiscount(product.regular_price, product.sale_price)
    : 0;

  const displayPrice = withMarkup(product.sale_price || product.regular_price);
  const regularDisplayPrice = withMarkup(product.regular_price);

  const imageSrc = getPrimaryImage(product.images);
  const resolvedImageSrc = resolveImageSrc(imageSrc);

  const productUrl = `/products/${product.slug || product.id}`;

  const availableSizes = useMemo(() => parseVariantList(product.size), [product.size]);
  const availableColors = useMemo(() => parseVariantList(product.color), [product.color]);
  const hasVariants = availableSizes.length > 0 || availableColors.length > 0;

  const cleanDescription = useMemo(() => stripHtml(product.description), [product.description]);

  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm border border-line overflow-hidden hover:shadow-md hover:border-marigold/50 transition-all duration-200">
        <div className="flex flex-row items-stretch">
          {/* Compact, Identical Square Image Box */}
          <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 aspect-square relative bg-paper-dim overflow-hidden self-center sm:self-auto">
            <Link href={productUrl} className="block w-full h-full cursor-pointer" aria-label={`View ${product.name}`}>
              <img
                src={resolvedImageSrc}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/otherplaceholder.jpg';
                }}
              />
            </Link>

            {/* Discount Badge */}
            {hasDiscount && (
              <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                -{discountPercentage}%
              </span>
            )}

            {/* Brand Badge */}
            {product.brand && (
              <span className="hidden sm:inline-block absolute bottom-1.5 left-1.5 bg-ink/80 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded">
                {product.brand}
              </span>
            )}

            {/* Wishlist Button */}
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
              <WishlistButton
                productId={product.id}
                iconSize={3}
                className="p-1 sm:p-1.5 bg-white/90 hover:bg-white text-ink shadow-sm rounded-full"
              />
            </div>
          </div>

          {/* Compact Product Details Content */}
          <div className="flex-1 p-2.5 sm:p-3.5 md:p-4 min-w-0 flex flex-col justify-between">
            <div>
              {/* Meta Line: Category, Store, Pro & Variants Pill */}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-text-soft truncate mb-1">
                <span className="font-mono uppercase tracking-wider font-semibold truncate max-w-[110px] sm:max-w-none">
                  {product.category || 'Catalog'}
                </span>
                {product.store && (
                  <>
                    <span className="text-line">•</span>
                    <Link
                      href={`/stores/${product.store.id}`}
                      className="inline-flex items-center gap-1 font-medium text-ink hover:text-marigold transition-colors truncate max-w-[130px] sm:max-w-none"
                    >
                      <FaStore className="w-2.5 h-2.5 text-marigold shrink-0" />
                      <span className="truncate">{product.store.name}</span>
                    </Link>
                  </>
                )}
                {(Boolean(product.is_pro_seller) || (product.store as any)?.agent?.plan === 'pro') && (
                  <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-marigold/10 text-marigold-dark border border-marigold/30 shrink-0">
                    <FaCrown className="w-2 h-2 text-marigold" /> PRO
                  </span>
                )}
                {hasVariants && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-medium bg-paper-dim border border-line text-text-soft shrink-0">
                    <FaLayerGroup className="w-2 h-2 text-marigold shrink-0" />
                    {[
                      availableSizes.length > 0 ? `${availableSizes.length} sizes` : null,
                      availableColors.length > 0 ? `${availableColors.length} colors` : null,
                    ].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <Link href={productUrl} className="block group/title mb-1">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-ink group-hover/title:text-marigold transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
                  {product.name}
                </h3>
              </Link>

              {/* Ratings and Stock Bar */}
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-soft mb-1 sm:mb-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(initialAverageRating)}
                  {initialAverageRating > 0 && (
                    <span className="font-semibold text-ink ml-0.5">{initialAverageRating.toFixed(1)}</span>
                  )}
                  {reviewCount > 0 && (
                    <span>({reviewCount})</span>
                  )}
                </div>

                <span className="text-line">•</span>

                <div className={`inline-flex items-center gap-1 font-medium ${
                  product.inStock ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    product.inStock ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Clean Description Snippet */}
              {cleanDescription && (
                <p className="text-[11px] sm:text-xs text-text-soft leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2 hidden xs:block">
                  {cleanDescription}
                </p>
              )}
            </div>

            {/* Bottom Pricing & Actions Bar */}
            <div className="pt-2 border-t border-line/80 flex items-center justify-between gap-2 mt-1 sm:mt-2">
              {/* Price */}
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-lg md:text-xl font-bold font-display text-ink">
                  <FormatPrice price={displayPrice} />
                </span>
                {hasDiscount && (
                  <span className="text-[10px] sm:text-xs text-text-soft line-through">
                    <FormatPrice price={regularDisplayPrice} />
                  </span>
                )}
              </div>

              {/* Compact Actions: View + Select Options / Add to Cart */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={productUrl}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-paper-dim hover:bg-line text-ink border border-line rounded-lg text-[10px] sm:text-xs font-semibold transition-all inline-flex items-center gap-1 shrink-0"
                >
                  <span>View</span>
                  <FaArrowRight className="w-2.5 h-2.5 text-text-soft hidden sm:inline" />
                </Link>

                {hasVariants ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOptionsOpen(true);
                    }}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-ink hover:bg-marigold text-white rounded-lg text-[10px] sm:text-xs font-semibold shadow-xs flex items-center justify-center gap-1 active:scale-98 transition-all shrink-0"
                  >
                    <FaLayerGroup className="w-2.5 h-2.5 text-marigold-light shrink-0" />
                    <span>Select Options</span>
                  </button>
                ) : (
                  <div className="shrink-0">
                    <AddtoCartButton
                      product={product}
                      showVariantPicker={false}
                      size="sm"
                      onRequireOptions={() => setIsOptionsOpen(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Select Options Modal Dialog for Sizes & Colors */}
      {hasVariants && (
        <SelectOptionsDialog
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          product={product}
          store={product.store}
        />
      )}
    </>
  );
}
