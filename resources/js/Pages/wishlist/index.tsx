import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Product } from '@/types';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { BiHeart } from 'react-icons/bi';
import ProductCard from '@/Components/ProductCard';
import SeoHead from '@/Components/SeoHead';



interface WishlistPageProps {
    wishlistProducts: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        productRatings?: Record<string, { average: number; count: number }>;
    };
    auth: {
        user: any
    }
}

export default function WishlistIndex({ wishlistProducts, auth }: WishlistPageProps) {
    return (
        <AppLayout user={auth.user} wishlist={wishlistProducts}>
            <SeoHead />

            <div className="min-h-screen bg-paper-dim py-20">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-white rounded-xl shadow-hard-sm border border-line">
                                <FaHeart className="w-6 h-6 text-red-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-ink">
                                My Wishlist
                            </h1>
                        </div>
                        <p className="text-text-soft ml-16">
                            {wishlistProducts.total > 0
                                ? `You have ${wishlistProducts.total} ${wishlistProducts.total === 1 ? 'item' : 'items'} saved for later`
                                : 'Start saving your favorite items'
                            }
                        </p>
                    </div>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-text-soft mb-6">
                        <Link href="/" className="hover:text-marigold transition-colors">Home</Link>
                        <span>›</span>
                        <span className="text-ink font-medium">Wishlist</span>
                    </div>

                    {/* Wishlist Items */}
                    {!wishlistProducts.data || wishlistProducts.data.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-12">
                            <div className="max-w-md mx-auto text-center">
                                <div className="relative mb-8">
                                    <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-pink-50 to-red-50">
                                        <BiHeart className="w-20 h-20 text-red-300" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-marigold rounded-full flex items-center justify-center animate-bounce">
                                        <FaHeart className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-ink mb-3">
                                    Your wishlist is empty
                                </h2>

                                <p className="text-text-soft mb-8">
                                    Looks like you haven't added any items to your wishlist yet.
                                    Browse our collection and save items you love!
                                </p>

                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <FaHeart className="w-5 h-5" />
                                    Start Shopping
                                </Link>

                                <div className="mt-6">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 text-sm text-text-soft hover:text-marigold transition-colors"
                                    >
                                        <FaArrowLeft className="w-3 h-3" />
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid using ProductCard */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {wishlistProducts.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        user={auth.user}
                                        variant="default"
                                        showQuickView={true}
                                        initialAverageRating={wishlistProducts.productRatings?.[product.id]?.average || 0}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {wishlistProducts.last_page > 1 && (
                                <div className="mt-12 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`?page=${wishlistProducts.current_page - 1}`}
                                            className={`px-4 py-2 rounded-lg border border-line ${
                                                wishlistProducts.current_page === 1
                                                    ? 'bg-paper-dim text-text-soft cursor-not-allowed'
                                                    : 'bg-white text-text-soft hover:bg-marigold hover:text-white hover:border-marigold transition-all duration-300'
                                            }`}
                                        >
                                            Previous
                                        </Link>

                                        <div className="flex items-center gap-1">
                                            {[...Array(Math.min(wishlistProducts.last_page, 5))].map((_, i) => {
                                                const pageNum = i + 1;
                                                const isCurrentPage = wishlistProducts.current_page === pageNum;

                                                return (
                                                    <Link
                                                        key={pageNum}
                                                        href={`?page=${pageNum}`}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                            isCurrentPage
                                                                ? 'bg-gray-900 text-white font-medium'
                                                                : 'bg-white text-text-soft hover:bg-marigold/10 hover:text-marigold'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        <Link
                                            href={`?page=${wishlistProducts.current_page + 1}`}
                                            className={`px-4 py-2 rounded-lg border border-line ${
                                                wishlistProducts.current_page === wishlistProducts.last_page
                                                    ? 'bg-paper-dim text-text-soft cursor-not-allowed'
                                                    : 'bg-white text-text-soft hover:bg-marigold hover:text-white hover:border-marigold transition-all duration-300'
                                            }`}
                                        >
                                            Next
                                        </Link>
                                    </div>
                                    <div className="text-sm text-text-soft">
                                        Showing {wishlistProducts.data.length} of {wishlistProducts.total} items
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
