// StoreShow.tsx
import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaShoppingBag,
  FaFilter,
  FaSearch,
  FaChevronRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaIdCard,
  FaFileAlt,
  FaEye,
  FaTh,
  FaList,
} from "react-icons/fa";
import AppLayout from "@/Layouts/AppLayout";
import { Product, storeType } from "@/types";
import AddtoCartButton from "../buttons/AddtoCartButton";
import FormatPrice from "../utils/FormatePrice";
import Eyebrow from "../Components/Eyebrow";
import SeoHead from "@/Components/SeoHead";
import WishlistButton from "../buttons/WishListButton";


interface StorePageProps {
  auth: {
    user: any;
  };
  store: storeType & { products_count?: number };
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: any[];
  };
  wishlist: any;
  storeRating?: {
    average: number;
    count: number;
  };
  productRatings?: Record<string, { average: number; count: number }>;
  userStoreRating?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

export default function StoreShow({
  auth,
  store,
  products,
  wishlist,
  storeRating = { average: 0, count: 0 },
  productRatings = {},
}: StorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = Array.from(
    new Set(products.data.map(p => p.category).filter(Boolean))
  );

  const productsWithRatings = products.data.map(product => {
    const ratingData = productRatings[product.id];
    return {
      ...product,
      calculatedRating: ratingData?.average || product.rating || 0,
      reviewCount: ratingData?.count || 0
    };
  });

  const filteredProducts = productsWithRatings
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
        case "price-high":
          return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
        case "rating":
          return (b.calculatedRating || 0) - (a.calculatedRating || 0);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStarHalf key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
          } else {
            return <FaRegStar key={i} className="w-4 h-4 text-gray-300" />;
          }
        })}
      </div>
    );
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const getImageSrc = (images: string): string => {
    if (!images) return '/placeholder-image.jpg';

    try {
      const parsedImages = JSON.parse(images);
      if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
        return parsedImages[0];
      }
    } catch (error) {
      if (images.trim().startsWith('http') || images.trim().startsWith('/')) {
        return images.trim();
      }
    }
    return '/placeholder-image.jpg';
  };

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <SeoHead title={store.name}
        description={`${store.name} is a trusted ${store.storetype} store on HaatPoint. Shop quality products from ${store.name} in Bangladesh.`}
        canonical={`https://www.haatpoint.com/stores/${store.id}`}
        ogTitle={`${store.name} - Shop on HaatPoint`}
        ogDescription={`${store.name} is a trusted ${store.storetype} store on HaatPoint. Shop quality products from ${store.name} in Bangladesh.`}
        ogUrl={`https://www.haatpoint.com/stores/${store.id}`}
        ogImage={store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : 'https://www.haatpoint.com/og-image.png'}
        twitterImage={store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : 'https://www.haatpoint.com/og-image.png'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: store.name,
          image: store.logo ? `https://www.haatpoint.com/storage/${store.logo}` : 'https://www.haatpoint.com/og-image.png',
          url: `https://www.haatpoint.com/stores/${store.id}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: store.address,
            addressCountry: 'BD',
          },
          telephone: store.mobile,
          email: store.email,
          ...(Number(storeRating.average || store.rating) > 0 ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: String(Number(storeRating.average || store.rating)),
              reviewCount: String(Number(storeRating.count || store.review_count) || 0),
              bestRating: '5',
              worstRating: '1',
            },
          } : {}),
        }} />

      <div className="bg-paper-dim min-h-screen py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" className="text-text-soft hover:text-marigold transition-colors">Home</Link>
            <FaChevronRight className="h-3 w-3 text-text-soft" />
            <Link href="/stores" className="text-text-soft hover:text-marigold transition-colors">Stores</Link>
            <FaChevronRight className="h-3 w-3 text-text-soft" />
            <span className="text-ink font-medium">{store.name}</span>
          </nav>

          {/* Store Header */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden mb-8">
            {/* Store Banner */}
            <div className="h-48 bg-gradient-to-r from-marigold to-marigold-dark relative">
              {store.logo && (
                <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-hard-sm overflow-hidden bg-white">
                    <img
                      src={`/storage/${store.logo}`}
                      alt={store.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className={`p-6 ${store.logo ? 'pt-16' : 'pt-6'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-2">
                    {store.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 bg-marigold/10 text-marigold rounded-full text-sm font-medium border border-marigold/20">
                      <FaStore className="mr-1 h-3 w-3" />
                      {store.storetype}
                    </span>

                    <div className="flex items-center gap-1">
                      {renderStars(parseFloat(store.rating as any) || 0)}
                      <span className="text-sm text-text-soft ml-1">
                        ({parseInt(store.review_count as any) || 0} {parseInt(store.review_count as any) === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Store Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ink">{store.products_count ?? products.total}</div>
                    <div className="text-sm text-text-soft">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ink">{parseInt(store.review_count as any) || 0}</div>
                    <div className="text-sm text-text-soft">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Store Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {store.address && (
                  <div className="flex items-center gap-3 text-text-soft">
                    <FaMapMarkerAlt className="h-5 w-5 text-marigold" />
                    <span>{store.address}</span>
                  </div>
                )}
                {store.mobile && (
                  <div className="flex items-center gap-3 text-text-soft">
                    <FaPhone className="h-5 w-5 text-marigold" />
                    <span>{store.mobile}</span>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center gap-3 text-text-soft">
                    <FaEnvelope className="h-5 w-5 text-marigold" />
                    <span>{store.email}</span>
                  </div>
                )}
                {store.license && (
                  <div className="flex items-center gap-3 text-text-soft">
                    <FaFileAlt className="h-5 w-5 text-marigold" />
                    <span>License: {store.license}</span>
                  </div>
                )}
                {store.national_id && (
                  <div className="flex items-center gap-3 text-text-soft">
                    <FaIdCard className="h-5 w-5 text-marigold" />
                    <span>National ID: {store.national_id}</span>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="mt-4 text-sm text-text-soft">
                Member since {new Date(store.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Store Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300">
              <FaTruck className="h-6 w-6 text-marigold mx-auto mb-2" />
              <p className="font-medium text-ink text-sm">Free Delivery</p>
              <p className="text-xs text-text-soft">On orders over ৳1000</p>
            </div>
            <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300">
              <FaUndo className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-ink text-sm">Easy Returns</p>
              <p className="text-xs text-text-soft">7 days return</p>
            </div>
            <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300">
              <FaShieldAlt className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-ink text-sm">Warranty</p>
              <p className="text-xs text-text-soft">1 year warranty</p>
            </div>
            <div className="bg-white rounded-xl shadow-hard-sm border border-line p-4 text-center hover:shadow-xl transition-all duration-300">
              <FaHeadset className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-ink text-sm">24/7 Support</p>
              <p className="text-xs text-text-soft">Live chat</p>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <Eyebrow>Browse products</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px] mb-6">Store Products</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-24">
                  <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2">
                    <FaFilter className="h-5 w-5 text-marigold" />
                    Filters
                  </h3>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Categories</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === "all"
                            ? "bg-marigold/10 text-marigold font-medium"
                            : "text-text-soft hover:text-ink hover:bg-paper-dim"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            selectedCategory === category
                              ? "bg-marigold/10 text-marigold font-medium"
                              : "text-text-soft hover:text-ink hover:bg-paper-dim"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Sort By</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2.5 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:w-3/4">
                {/* Search and View Toggle */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
                      <input
                        type="text"
                        placeholder="Search products in this store..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-marigold/10 border-marigold text-marigold'
                            : 'border-line text-text-soft hover:bg-paper-dim'
                        }`}
                      >
                        <FaTh className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-marigold/10 border-marigold text-marigold'
                            : 'border-line text-text-soft hover:bg-paper-dim'
                        }`}
                      >
                        <FaList className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-text-soft">
                    <span className="font-semibold text-ink">{filteredProducts.length}</span> products found
                  </div>
                </div>

                {/* Products Display */}
                {filteredProducts.length > 0 ? (
                  <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'
                    : 'space-y-4'
                  }>
                    {filteredProducts.map((product) => {
                      const imageSrc = getImageSrc(product.images);
                      const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
                      const discountPercentage = hasDiscount
                        ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                        : 0;

                      if (viewMode === 'grid') {
                        return (
                          <div key={product.id} className="group bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            {/* Product Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-paper-dim">
                              <Link href={`/products/${product.slug}`}>
                                <img
                                  src={`/storage/${imageSrc}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                  }}
                                />
                              </Link>

                              {hasDiscount && (
                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-hard-sm z-10">
                                  -{discountPercentage}%
                                </span>
                              )}

                              <div className="absolute top-3 right-3 z-10">
                                <WishlistButton productId={product.id.toString()} />
                              </div>

                              {/* Quick View Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="quick-view opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                  <Link href={`/products/${product.slug}`}>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-marigold hover:text-white text-ink rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105">
                                      <FaEye className="w-4 h-4" />
                                      Quick View
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                              <Link href={`/products/${product.slug}`} className="block">
                                <h3 className="font-medium text-ink mb-1 line-clamp-1 group-hover:text-marigold transition-colors">
                                  {product.name}
                                </h3>
                              </Link>

                              <div className="flex items-center gap-1 mb-2">
                                {renderStars(product.calculatedRating)}
                                {product.reviewCount > 0 ? (
                                  <span className="text-xs text-text-soft ml-1">
                                    ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                                  </span>
                                ) : (
                                  <span className="text-xs text-text-soft ml-1">(No reviews)</span>
                                )}
                              </div>

                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="font-bold text-ink">
                                    <FormatPrice price={product.sale_price || product.regular_price} />
                                  </span>
                                  {hasDiscount && (
                                    <span className="ml-2 text-sm text-text-soft line-through">
                                      <FormatPrice price={product.regular_price} />
                                    </span>
                                  )}
                                </div>
                              </div>

                              <AddtoCartButton product={product} />
                            </div>
                          </div>
                        );
                      } else {
                        // List View
                        return (
                          <div key={product.id} className="group bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                              {/* Image Container */}
                              <div className="md:w-1/4 relative overflow-hidden bg-paper-dim">
                                <Link href={`/products/${product.slug}`}>
                                  <div className="aspect-square md:h-full">
                                    <img
                                      src={`/storage/${imageSrc}`}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                      }}
                                    />
                                  </div>
                                </Link>

                                {hasDiscount && (
                                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-hard-sm z-10">
                                    -{discountPercentage}%
                                  </span>
                                )}

                                <div className="absolute top-3 right-3 z-10">
                                  <WishlistButton productId={product.id.toString()} />
                                </div>

                                {/* Quick View Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="quick-view opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <Link href={`/products/${product.slug}`}>
                                      <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-marigold hover:text-white text-ink rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105">
                                        <FaEye className="w-4 h-4" />
                                        Quick View
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="md:w-3/4 p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div>
                                    <Link href={`/products/${product.slug}`}>
                                      <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-marigold transition-colors">
                                        {product.name}
                                      </h3>
                                    </Link>
                                    <p className="text-text-soft text-sm mb-4 line-clamp-2">
                                      {stripHtml(product.description)}
                                    </p>
                                    <div className="flex items-center gap-4 mb-4">
                                      <div className="flex items-center">
                                        {renderStars(product.calculatedRating)}
                                        {product.reviewCount > 0 ? (
                                          <span className="text-xs text-text-soft ml-2">
                                            ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                                          </span>
                                        ) : (
                                          <span className="text-xs text-text-soft ml-2">(No reviews)</span>
                                        )}
                                      </div>
                                      <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="md:w-48">
                                    <div className="mb-4">
                                      <div className="text-2xl font-bold text-ink">
                                        <FormatPrice price={product.sale_price || product.regular_price} />
                                      </div>
                                      {hasDiscount && (
                                        <div className="text-sm text-text-soft line-through">
                                          <FormatPrice price={product.regular_price} />
                                        </div>
                                      )}
                                    </div>
                                    <AddtoCartButton product={product} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-12 text-center">
                    <FaShoppingBag className="h-16 w-16 mx-auto mb-4 text-text-soft" />
                    <h3 className="text-xl font-bold text-ink mb-2">No products found</h3>
                    <p className="text-text-soft">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex flex-wrap items-center gap-1">
                      {products.links.map((link: any, index: number) => (
                        link.url === null ? (
                          <span
                            key={index}
                            className="px-3 py-2 text-sm text-text-soft opacity-50"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ) : (
                          <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className={`px-3.5 py-2 text-sm rounded-xl border transition-all duration-200 ${
                              link.active
                                ? 'bg-marigold text-white border-marigold'
                                : 'bg-white text-ink border-line hover:border-marigold'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        )
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
