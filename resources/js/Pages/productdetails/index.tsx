import { useState, useEffect } from "react";
import {
  FaStar,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaStore,
  FaShoppingCart,
  FaCheck,
  FaTag,
  FaShoppingBag,
  FaUndo,
  FaHeadset,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaHome,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLink
} from "react-icons/fa";
import { Product, storeType, Comments } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { useStore, makeCartKey } from "../state/cartStore";
import CommentsList from "../dashboard/forms/CommentsList";
import FormatPrice from "../utils/FormatePrice";
import { parseVariantList } from "../utils/parseVariants";
import axios from "axios";
import SeoHead from "@/Components/SeoHead";
import WishlistButton from "../buttons/WishListButton";

interface ProductDetailsPageProps {
  product: Product;
  store: storeType;
  auth: {
    user: any
  };
  wishlist: any;
  comments?: Comments[];
  averageRating?: number | string;
  reviewCount?: number;
  userReview?: {
    id: string;
    comment: string | null;
    rating: number | null;
  } | null;
}

// Helper function to safely get numeric rating
const getNumericRating = (rating: any): number => {
  if (rating === null || rating === undefined) return 0;
  if (typeof rating === 'number') return isNaN(rating) ? 0 : rating;
  if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const ProductDetailsPage = ({
  product,
  store,
  auth,
  wishlist,
  comments: initialComments = [],
  averageRating: initialAverageRating = 0,
  reviewCount: initialReviewCount = 0,
  userReview = null
}: ProductDetailsPageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comments, setComments] = useState<Comments[]>(initialComments);
  const [averageRating, setAverageRating] = useState<number>(getNumericRating(initialAverageRating));
  const [reviewCount, setReviewCount] = useState<number>(initialReviewCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const availableSizes = parseVariantList(product.size);
  const availableColors = parseVariantList(product.color);

  const { addToCart, getItemByKey } = useStore();
  const cartItem = getItemByKey(makeCartKey(product.id.toString(), selectedSize, selectedColor));
  const currentCartQuantity = cartItem?.cartQty || 0;

  // Fetch comments and ratings from API
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/products/${product.id}/comments`);
      if (response.data.success) {
        setComments(response.data.data || []);
        setAverageRating(getNumericRating(response.data.stats?.average ?? 0));
        setReviewCount(response.data.stats?.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments(initialComments);
      setAverageRating(getNumericRating(initialAverageRating));
      setReviewCount(initialReviewCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [product.id, refreshKey]);

  // Function to refresh comments after a new post
  const refreshComments = () => {
    setRefreshKey(prev => prev + 1);
  };

  const productImages = (() => {
    if (!product.images) return ['/otherplaceholder.jpg'];

    if (Array.isArray(product.images)) {
      return product.images.length > 0 ? product.images : ['/otherplaceholder.jpg'];
    }

    if (typeof product.images === 'string') {
      try {
        if (product.images.startsWith('[') || product.images.startsWith('"')) {
          const parsed = JSON.parse(product.images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
          if (typeof parsed === 'string' && parsed) {
            return [parsed];
          }
        }
        if (product.images.trim()) {
          return [product.images.trim()];
        }
      } catch {
        if (product.images.trim()) {
          return [product.images.trim()];
        }
      }
    }

    return ['/otherplaceholder.jpg'];
  })();

  const discount = (() => {
    if (!product.sale_price || !product.regular_price) return 0;
    const regular = Number(product.regular_price);
    const sale = Number(product.sale_price);
    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  })();

  const renderStars = (rating: number) => {
    const numericRating = getNumericRating(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="w-5 h-5 text-amber-400 fill-current" />;
          } else if (index === fullStars && hasHalfStar) {
            return <FaStar key={index} className="w-5 h-5 text-amber-400 opacity-50" />;
          } else {
            return <FaRegStar key={index} className="w-5 h-5 text-gray-300" />;
          }
        })}
      </div>
    );
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/otherplaceholder.jpg';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    if (imagePath.startsWith('/storage/') || imagePath.startsWith('/')) {
      return imagePath;
    }

    return `/storage/${imagePath}`;
  };

  const currentImage = productImages[selectedImageIndex] || '/otherplaceholder.jpg';
  const currentImageUrl = getImageUrl(currentImage);

  const handleAddToCart = (): boolean => {
    if (!product.inStock || product.quantity === 0) {
      toast.error('Product is out of stock');
      return false;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return false;
    }

    if (currentCartQuantity + quantity > (product.quantity || 0)) {
      toast.error(`Only ${product.quantity} items available in stock`);
      return false;
    }

    addToCart(product, store, quantity, selectedSize, selectedColor);

    return true;
  };

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, selectedColor]);

  const incrementQuantity = (): void => {
    const maxAvailable = (product.quantity || 0) - currentCartQuantity;
    if (quantity < maxAvailable) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${maxAvailable} more items available`);
    }
  };

  const decrementQuantity = (): void => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const maxAvailable = (product.quantity || 0) - currentCartQuantity;
  const totalReviews = reviewCount;
  const totalComments = comments.length;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${product.name} on our store!`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    }
  ];

  // Calculate store rating from comments
  const storeRating = (() => {
    if (!comments || comments.length === 0) return 0;
    const ratings = comments.filter(c => c.rating !== null && c.rating !== undefined);
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, c) => sum + getNumericRating(c.rating || 0), 0);
    return Math.round((total / ratings.length) * 10) / 10;
  })();

  // Calculate store review count
  const storeReviewCount = (() => {
    if (!comments) return 0;
    return comments.filter(c => c.rating !== null && c.rating !== undefined).length;
  })();

  const displayStoreRating = getNumericRating(storeRating || store.rating || 0);
  const displayStoreReviewCount = storeReviewCount || store.review_count || 0;

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      {/* The canonical used to be built from product.id while the server route
          is a slug, so the two heads disagreed on every product URL. SeoMeta
          owns title, description, canonical, robots and og tags now. */}
      <SeoHead
        keywords={`${product.name}, ${product.category}, ${product.brand || ''}, buy online Bangladesh, HaatPoint`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: currentImageUrl.startsWith('http') ? currentImageUrl : `https://www.haatpoint.com${currentImageUrl}`,
            description: stripHtml(product.description).slice(0, 200),
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            sku: product.id,
            category: product.category,
            offers: {
              '@type': 'Offer',
              url: `https://www.haatpoint.com/products/${product.id}`,
              priceCurrency: 'BDT',
              price: String(Number(product.sale_price) || Number(product.regular_price) || 0),
              priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
              availability: product.inStock && Number(product.quantity) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: store.name,
              },
            },
            ...(getNumericRating(averageRating) > 0 ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(getNumericRating(averageRating)),
                reviewCount: String(reviewCount || 0),
                bestRating: '5',
                worstRating: '1',
              },
            } : {})
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.haatpoint.com/' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.haatpoint.com/products' },
              { '@type': 'ListItem', position: 3, name: product.category, item: `https://www.haatpoint.com/products?category=${encodeURIComponent(product.category)}` },
              { '@type': 'ListItem', position: 4, name: product.name, item: `https://www.haatpoint.com/products/${product.id}` },
            ],
          },
        ]} />

      <div className="min-h-screen bg-paper-dim py-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm">
            <ol className="flex items-center space-x-2 flex-wrap">
              <li>
                <Link href="/" className="flex items-center text-text-soft hover:text-marigold transition-colors">
                  <FaHome className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li className="text-text-soft">/</li>
              <li>
                <Link href="/products" className="text-text-soft hover:text-marigold transition-colors">
                  Products
                </Link>
              </li>
              <li className="text-text-soft">/</li>
              <li className="text-text-soft truncate max-w-xs">
                {product.category}
              </li>
              <li className="text-text-soft">/</li>
              <li className="text-ink font-medium truncate max-w-xs">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Main Product Section */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-xl bg-paper-dim aspect-square border border-line">
                  <img
                    src={currentImageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/otherplaceholder.jpg';
                    }}
                  />

                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-red-500 text-white shadow-hard-sm">
                        -{discount}% OFF
                      </span>
                    </div>
                  )}

                  {/* Brand Badge on Image */}
                  {product.brand && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-[#6E7F5C] text-white shadow-hard-sm">
                        {product.brand}
                      </span>
                    </div>
                  )}

                  {currentCartQuantity > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-marigold/10 text-marigold text-sm font-medium">
                        {currentCartQuantity} in cart
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    {auth.user && <WishlistButton productId={product.id} />}
                  </div>
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-marigold ring-2 ring-marigold/20'
                            : 'border-line hover:border-marigold/50'
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {/* Brand Tag */}
                  {product.brand && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-mono uppercase tracking-wide border border-orange-200">
                      <FaTag className="w-3 h-3 mr-1.5" />
                      {product.brand}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-marigold/10 text-marigold text-xs font-mono uppercase tracking-wide">
                    <FaTag className="w-3 h-3 mr-1.5" />
                    {product.product_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-mono uppercase tracking-wide">
                    <FaLeaf className="w-3 h-3 mr-1.5" />
                    {product.category}
                  </span>
                  {product.inStock && product.quantity > 0 ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-mono uppercase tracking-wide">
                      <FaCheck className="w-3 h-3 mr-1.5" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-mono uppercase tracking-wide">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Product Header */}
                <div>
                  {/* Brand - Displayed prominently above product name */}
                  {product.brand && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-sm font-semibold border border-orange-200">
                        {product.brand}
                      </span>
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight">
                    {product.name}
                  </h1>

                  {/* Store Info */}
                  <div className="flex items-center flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-marigold/10 flex items-center justify-center">
                        <FaStore className="w-5 h-5 text-marigold" />
                      </div>
                      <div>
                        <Link
                          href={`/stores/${store.id}`}
                          className="text-base font-semibold text-ink hover:text-marigold transition-colors"
                        >
                          {store.name}
                        </Link>
                        <div className="text-xs text-text-soft">{store.storetype} Store</div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs bg-paper-dim px-3 py-1.5 rounded-lg">
                      <span className="text-amber-500 mr-1">Rated</span>
                      <span className="font-medium text-ink">{displayStoreRating.toFixed(1)}</span>
                      <span className="text-text-soft mx-1">/</span>
                      <span className="text-text-soft">{displayStoreReviewCount} reviews</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      {renderStars(averageRating)}
                      <span className="text-2xl font-bold text-ink">
                        {getNumericRating(averageRating).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-text-soft text-sm">
                      ({totalReviews} rating{totalReviews !== 1 ? 's' : ''} / {totalComments} comment{totalComments !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-paper-dim p-6 rounded-xl border border-line">
                  <div className="flex items-baseline space-x-4 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-ink">
                      <FormatPrice price={product.sale_price || product.regular_price} />
                    </span>

                    {product.sale_price && (
                      <span className="text-xl text-text-soft line-through">
                        <FormatPrice price={product.regular_price} />
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                      <FaTag className="w-4 h-4 mr-1.5" />
                      Save <FormatPrice price={product.regular_price - product.sale_price} /> ({discount}% OFF)
                    </div>
                  )}
                </div>

                {/* Size & Color Selectors */}
                {(availableColors.length > 0 || availableSizes.length > 0) && (
                  <div className="space-y-5">
                    {availableColors.length > 0 && (
                      <div>
                        <p className="text-text-soft font-medium mb-2">
                          Color:
                          {selectedColor ? (
                            <span className="text-ink font-semibold capitalize"> {selectedColor}</span>
                          ) : (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                                selectedColor === color
                                  ? 'bg-marigold text-white border-marigold shadow-sm'
                                  : 'bg-white text-ink border-line hover:border-marigold'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {availableSizes.length > 0 && (
                      <div>
                        <p className="text-text-soft font-medium mb-2">
                          Size:
                          {selectedSize ? (
                            <span className="text-ink font-semibold"> {selectedSize}</span>
                          ) : (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((optionSize) => (
                            <button
                              key={optionSize}
                              type="button"
                              onClick={() => setSelectedSize(optionSize)}
                              className={`min-w-[48px] px-4 py-2 rounded-xl border text-sm font-semibold uppercase transition-colors ${
                                selectedSize === optionSize
                                  ? 'bg-marigold text-white border-marigold shadow-sm'
                                  : 'bg-white text-ink border-line hover:border-marigold'
                              }`}
                            >
                              {optionSize}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stock Status & Quantity */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-paper-dim rounded-xl border border-line">
                    <div className="flex items-center space-x-2">
                      <span className="text-text-soft font-medium">Availability:</span>
                      {product.inStock && product.quantity > 0 ? (
                        <span className="flex items-center text-green-600 font-semibold">
                          <FaCheck className="w-4 h-4 mr-1.5" />
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>
                    {product.inStock && product.quantity > 0 && (
                      <span className="text-sm text-text-soft">
                        {product.quantity} units available
                      </span>
                    )}
                  </div>

                  {product.inStock && product.quantity > 0 && maxAvailable > 0 && (
                    <div className="flex items-center flex-wrap gap-4">
                      <span className="text-text-soft font-medium">Quantity:</span>
                      <div className="flex items-center border border-line rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="px-4 py-2.5 text-text-soft hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-line"
                        >
                          <FaMinus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-2.5 text-lg font-medium w-16 text-center bg-white text-ink">
                          {quantity}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= maxAvailable}
                          className="px-4 py-2.5 text-text-soft hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-line"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                      {maxAvailable > 0 && (
                        <span className="text-sm text-text-soft">
                          {maxAvailable} available
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.quantity === 0 || maxAvailable === 0}
                    className="w-full py-4 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  >
                    <FaShoppingCart className="w-5 h-5 mr-2" />
                    {currentCartQuantity > 0 ? 'Add More' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={() => {
                      // Only navigate once the item is really in the cart,
                      // otherwise the toast explaining the refusal disappears
                      // with the navigation and the button looks broken.
                      if (handleAddToCart()) {
                        router.visit(route('cart.index'));
                      }
                    }}
                    disabled={!product.inStock || product.quantity === 0}
                    className="w-full py-4 bg-marigold hover:bg-marigold-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  >
                    <FaShoppingBag className="w-5 h-5 mr-2" />
                    Buy Now
                  </button>
                </div>

                {/* Share Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="inline-flex items-center gap-2 text-text-soft hover:text-marigold transition-colors text-sm"
                  >
                    <FaShare className="w-4 h-4" />
                    Share this product
                  </button>

                  {showShareMenu && (
                    <div className="absolute top-8 left-0 bg-white rounded-xl shadow-hard-sm border border-line p-3 z-10 flex gap-2">
                      {shareLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-paper-dim rounded-lg transition-colors text-text-soft hover:text-marigold"
                          title={link.name}
                        >
                          {link.icon}
                        </a>
                      ))}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          toast.success('Link copied to clipboard!');
                          setShowShareMenu(false);
                        }}
                        className="p-2 hover:bg-paper-dim rounded-lg transition-colors text-text-soft hover:text-marigold"
                        title="Copy link"
                      >
                        <FaLink className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-line">
                  <div className="flex flex-col items-center text-center p-3 bg-marigold/5 rounded-xl hover:bg-marigold/10 transition-colors border border-line">
                    <FaTruck className="w-6 h-6 text-marigold mb-2" />
                    <div className="text-sm font-medium text-ink">Free Delivery</div>
                      <div className="text-xs text-text-soft">On orders over Tk 1000</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200">
                    <FaUndo className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-sm font-medium text-ink">Easy Returns</div>
                    <div className="text-xs text-text-soft">7 days return</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200">
                    <FaShieldAlt className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="text-sm font-medium text-ink">Warranty</div>
                    <div className="text-xs text-text-soft">1 year warranty</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200">
                    <FaHeadset className="w-6 h-6 text-orange-600 mb-2" />
                    <div className="text-sm font-medium text-ink">24/7 Support</div>
                    <div className="text-xs text-text-soft">Live chat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-line">
              <div className="flex border-b border-line bg-paper-dim overflow-x-auto">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'text-marigold'
                      : 'text-text-soft hover:text-ink'
                  }`}
                >
                  Description
                  {activeTab === 'description' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-marigold"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'specifications'
                      ? 'text-marigold'
                      : 'text-text-soft hover:text-ink'
                  }`}
                >
                  Specifications
                  {activeTab === 'specifications' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-marigold"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'text-marigold'
                      : 'text-text-soft hover:text-ink'
                  }`}
                >
                  Reviews ({comments.length})
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-marigold"></span>
                  )}
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-2xl font-bold text-ink mb-4">Product Description</h3>
                    <div className="text-text-soft whitespace-pre-line leading-relaxed">
                      {stripHtml(product.description || 'No description available.')}
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-ink">Product Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-paper-dim p-6 rounded-xl border border-line">
                          <h4 className="font-bold text-ink mb-4 text-lg">Product Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Product Name</span>
                              <span className="font-medium text-ink">{product.name}</span>
                            </div>
                            {/* Brand in Specifications */}
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Brand</span>
                              <span className="font-medium text-orange-600">{product.brand || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Category</span>
                              <span className="font-medium text-ink">{product.category}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Type</span>
                              <span className="font-medium text-ink">{product.product_type}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Stock Status</span>
                              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? `${product.quantity} available` : 'Out of stock'}
                              </span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Regular Price</span>
                              <span className="font-medium text-ink"><FormatPrice price={product.regular_price} /></span>
                            </div>
                            {product.sale_price && (
                              <div className="flex justify-between pb-2 border-b border-line">
                                <span className="text-text-soft">Sale Price</span>
                                <span className="font-medium text-green-600"><FormatPrice price={product.sale_price} /></span>
                              </div>
                            )}
                            {product.item_weight && (
                              <div className="flex justify-between pb-2">
                                <span className="text-text-soft">Weight</span>
                                <span className="font-medium text-ink">{product.item_weight} kg</span>
                              </div>
                            )}
                            {/* Product Rating in Specifications */}
                            <div className="flex justify-between pb-2 pt-2 border-t border-line mt-2">
                              <span className="text-text-soft">Product Rating</span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {renderStars(averageRating)}
                                </div>
                                <span className="font-medium text-ink">
                                  {getNumericRating(averageRating).toFixed(1)}
                                </span>
                                <span className="text-xs text-text-soft">({reviewCount} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-paper-dim p-6 rounded-xl border border-line">
                          <h4 className="font-bold text-ink mb-4 text-lg">Store Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Store Name</span>
                              <span className="font-medium text-ink">{store.name}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Store Type</span>
                              <span className="font-medium text-ink">{store.storetype}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Store Rating</span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {renderStars(displayStoreRating)}
                                </div>
                                <span className="font-medium text-ink">
                                  {displayStoreRating.toFixed(1)}
                                </span>
                                <span className="text-xs text-text-soft">({displayStoreReviewCount} reviews)</span>
                              </div>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-line">
                              <span className="text-text-soft">Contact</span>
                              <span className="font-medium text-ink">{store.mobile}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                              <span className="text-text-soft">Address</span>
                              <span className="font-medium text-ink text-right">{store.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Rating Summary */}
                    <div>
                      <h3 className="text-2xl font-bold text-ink mb-6">Customer Reviews</h3>
                      <div className="text-center py-8 bg-paper-dim rounded-xl border border-line">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          {renderStars(averageRating)}
                          <span className="text-3xl font-bold text-ink">
                            {getNumericRating(averageRating).toFixed(1)}
                          </span>
                        </div>
                        <div className="text-text-soft mb-6">
                          Based on {totalReviews} rating{totalReviews !== 1 ? 's' : ''} and {totalComments} comment{totalComments !== 1 ? 's' : ''}
                        </div>

                        {/* Rating Distribution */}
                        {totalReviews > 0 && (
                          <div className="max-w-md mx-auto mb-6 text-left">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = comments.filter(c => c.rating === star).length;
                              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                              return (
                                <div key={star} className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium w-8">{star} star</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-400 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-text-soft w-12">{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {auth.user ? (
                          <div className="text-center">
                            <div className="text-sm text-text-soft mb-3">
                              {userReview ? 'You have already reviewed this product' : 'Share your experience with this product'}
                            </div>
                          </div>
                        ) : (
                          <Link                            href="/login"
                            className="inline-block px-8 py-3 bg-paper-dim hover:bg-gray-200 text-ink font-medium rounded-xl transition-colors border border-line"
                          >
                            Login to Write a Review
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Comments Section with Ratings - Pass refreshComments callback */}
                    <div className="border-t border-line pt-8">
                      <CommentsList
                        comments={comments}
                        productId={product.id.toString()}
                        authUser={auth.user}
                        isAuthenticated={!!auth.user}
                        userReview={userReview}
                        onCommentAdded={refreshComments}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Info Section */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-8">
            <h2 className="text-2xl font-bold text-ink mb-6">About the Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-marigold/10 flex items-center justify-center">
                    <FaStore className="w-8 h-8 text-marigold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">{store.name}</h3>
                    <div className="text-text-soft">{store.storetype} Store</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-text-soft">
                      <span className="font-medium text-ink">Seller address:</span><br />
                      {store.address}
                    </div>
                    <div className="text-text-soft">
                      <span className="font-medium text-ink">Seller phone:</span><br />
                      {store.mobile}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-text-soft">
                      <span className="font-medium text-ink">Store rating:</span><br />
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(displayStoreRating)}
                        </div>
                        <span className="font-medium text-ink">
                          {displayStoreRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-text-soft">({displayStoreReviewCount} reviews)</span>
                      </div>
                    </div>
                    <div className="text-text-soft">
                      <span className="font-medium text-ink">Seller email:</span><br />
                      {store.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Link
                  href={`/stores/${store.id}`}
                  className="px-8 py-3 bg-gray-900 hover:bg-marigold text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetailsPage;
