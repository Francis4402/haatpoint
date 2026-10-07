import { useState, useMemo, useEffect, useRef, useCallback, Fragment } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Product } from '@/types';
import {
  BsStar,
  BsStarFill,
  BsStarHalf,
  BsFilter,
  BsSearch,
  BsGrid3X3Gap,
  BsX
} from 'react-icons/bs';
import {
  FiShoppingBag,
  FiTag,
  FiStar,
  FiTruck,
  FiCheck,
  FiGrid
} from 'react-icons/fi';
import {
  RiFireFill,
  RiNewspaperLine,
  RiStarSFill
} from 'react-icons/ri';
import AppLayout from '@/Layouts/AppLayout';
import AddtoCartButton from '../buttons/AddtoCartButton';
import FormatPrice from '../utils/FormatePrice';
import Eyebrow from '../Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';
import ProductCard from '@/Components/ProductCard';
import WishlistButton from '../buttons/WishListButton';


interface ProductsPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
        from: number;
        to: number;
    };
    auth?: {
        user?: any;
    };
    wishlist: any;
    productRatings?: Record<string, { average: number; count: number }>;
    filters?: {
        categories: string[];
        brands: string[];
        min_price: number;
        max_price: number;
        current: {
            category: string;
            product_type: string;
            brand: string;
            search: string;
            sort_by: string;
            in_stock: boolean;
            min_price_filter: number;
            max_price_filter: number;
        };
    };
}

type CurrentFilters = {
    category: string;
    product_type: string;
    brand: string;
    search: string;
    sort_by: string;
    in_stock: boolean;
    min_price_filter: number;
    max_price_filter: number;
};

const sortOptions = [
    { id: 'default', label: 'Default sorting' },
    { id: 'popularity', label: 'Sort by popularity' },
    { id: 'rating', label: 'Sort by average rating' },
    { id: 'date', label: 'Sort by latest' },
    { id: 'price-low', label: 'Sort by price: low to high' },
    { id: 'price-high', label: 'Sort by price: high to low' },
];

// Only search is debounced now, price slider applies immediately
const DEBOUNCED_KEYS = new Set(['max_price_filter']);
const DEBOUNCE_MS = 400;

interface FilterPanelProps {
    categories: string[];
    brands: string[];
    products: any;
    filters: {
        min_price: number;
        max_price: number;
        current: CurrentFilters;
    };
    onFilterChange: (key: keyof CurrentFilters, value: any) => void;
    onSearch: () => void;
    onClear: () => void;
    isLoading?: boolean;
}

function FilterPanel({
    categories,
    brands,
    products,
    filters,
    onFilterChange,
    onSearch,
    onClear,
    isLoading = false,
}: FilterPanelProps) {
    if (!filters || !filters.current) {
        return (
            <div className="text-center py-8 text-[#767470]">
                <p>No filters available</p>
            </div>
        );
    }

    const { current, min_price, max_price } = filters;

    // Handle Enter key press on search input
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    };

    return (
        <>
            {/* Search */}
            <div className="mb-6">
                <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                    Search
                </h3>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#767470] text-sm" />
                        <input
                            type="text"
                            placeholder="Search products, brands, categories..."
                            value={current.search || ''}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="pl-9 pr-4 py-2 text-sm border border-[#E3E1DB] rounded-lg focus:ring-2 focus:ring-[#6E7F5C] focus:border-transparent transition-colors w-full bg-white"
                        />
                    </div>
                    <button
                        onClick={onSearch}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#6E7F5C] text-white text-sm font-medium rounded-lg hover:bg-[#57654A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                    Categories
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    <button
                        onClick={() => onFilterChange('category', 'all')}
                        disabled={isLoading}
                        className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                            current.category === 'all'
                                ? 'bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium'
                                : 'text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <span>All Categories</span>
                            <span className="text-xs text-[#767470]">
                                ({products?.total || 0})
                            </span>
                        </div>
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onFilterChange('category', category)}
                            disabled={isLoading}
                            className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                                current.category === category
                                    ? 'bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium'
                                    : 'text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span>{category}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Brands */}
            {brands && brands.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                        Brands
                    </h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        <button
                            onClick={() => onFilterChange('brand', 'all')}
                            disabled={isLoading}
                            className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                                current.brand === 'all'
                                    ? 'bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium'
                                    : 'text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            All Brands
                        </button>
                        {brands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => onFilterChange('brand', brand)}
                                disabled={isLoading}
                                className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                                    current.brand === brand
                                        ? 'bg-[#6E7F5C]/10 text-[#6E7F5C] font-medium'
                                        : 'text-[#767470] hover:text-[#1B1B1B] hover:bg-[#F2F2EE]'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter by Price - Single Range Slider */}
            <div className="mb-6">
                <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                    Filter by Price
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1B1B1B]">Tk {current.min_price_filter || min_price || 0}</span>
                        <span className="text-sm font-medium text-[#1B1B1B]">Tk {current.max_price_filter || max_price || 10000}</span>
                    </div>
                    <input
                        type="range"
                        min={min_price || 0}
                        max={max_price || 10000}
                        step="100"
                        value={current.max_price_filter ?? max_price ?? 10000}
                        onChange={(e) => onFilterChange('max_price_filter', parseInt(e.target.value, 10))}
                        disabled={isLoading}
                        className="w-full h-1.5 bg-[#F2F2EE] rounded-lg appearance-none cursor-pointer accent-[#6E7F5C] disabled:opacity-50"
                    />
                    <div className="flex items-center justify-between text-xs text-[#767470]">
                        <span>Min: Tk {min_price || 0}</span>
                        <span>Max: Tk {max_price || 10000}</span>
                    </div>
                </div>
            </div>

            {/* Sort by */}
            <div className="mb-6">
                <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                    Sort by
                </h3>
                <select
                    value={current.sort_by || 'default'}
                    onChange={(e) => onFilterChange('sort_by', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2.5 text-sm border border-[#E3E1DB] rounded-lg focus:ring-2 focus:ring-[#6E7F5C] focus:border-transparent transition-colors bg-white disabled:opacity-50"
                >
                    {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product Status */}
            <div className="mb-6">
                <h3 className="font-mono text-xs font-semibold text-[#767470] uppercase tracking-wider mb-4">
                    Product Status
                </h3>
                <div className="space-y-2">
                    <label className={`flex items-center gap-3 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={current.in_stock || false}
                            onChange={(e) => onFilterChange('in_stock', e.target.checked)}
                            disabled={isLoading}
                            className="h-4 w-4 accent-[#6E7F5C] rounded border-[#E3E1DB] disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-[#767470]">In stock only</span>
                    </label>
                    <label className={`flex items-center gap-3 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={current.product_type === 'on-sale'}
                            onChange={(e) => onFilterChange('product_type', e.target.checked ? 'on-sale' : 'all')}
                            disabled={isLoading}
                            className="h-4 w-4 accent-[#6E7F5C] rounded border-[#E3E1DB] disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-[#767470]">On sale</span>
                    </label>
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={onClear}
                disabled={isLoading}
                className="w-full py-2.5 text-sm border border-[#E3E1DB] text-[#767470] rounded-lg hover:bg-[#F2F2EE] hover:text-[#1B1B1B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Clear all filters
            </button>
        </>
    );
}

const Products = ({ products, auth, wishlist, productRatings = {}, filters }: ProductsPageProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const user = auth?.user || null;

    const defaultFilters = {
        categories: [] as string[],
        brands: [] as string[],
        min_price: 0,
        max_price: 10000,
        current: {
            category: 'all',
            product_type: 'all',
            brand: 'all',
            search: '',
            sort_by: 'default',
            in_stock: false,
            min_price_filter: 0,
            max_price_filter: 10000,
        } as CurrentFilters,
    };

    const safeFilters = filters || defaultFilters;

    // Local, editable copy of the current filters
    const [localCurrent, setLocalCurrent] = useState<CurrentFilters>(safeFilters.current);

    useEffect(() => {
        setLocalCurrent(safeFilters.current);
    }, [safeFilters.current]);

    // Single debounce timer for price slider
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const productTypes = [
        { id: 'all', label: 'All Products', icon: <FiGrid /> },
        { id: 'featured', label: 'Featured', icon: <RiStarSFill /> },
        { id: 'trending', label: 'Trending', icon: <RiFireFill /> },
        { id: 'top-selling', label: 'Top Selling', icon: <FiStar /> },
        { id: 'new-arrival', label: 'New Arrivals', icon: <RiNewspaperLine /> },
        { id: 'on-sale', label: 'On Sale', icon: <FiTag /> },
    ];

    const navigate = useCallback((nextCurrent: CurrentFilters) => {
        router.get(
            route('products.index'),
            {
                category: nextCurrent.category,
                product_type: nextCurrent.product_type,
                brand: nextCurrent.brand,
                search: nextCurrent.search,
                sort_by: nextCurrent.sort_by,
                in_stock: nextCurrent.in_stock,
                min_price: nextCurrent.min_price_filter,
                max_price: nextCurrent.max_price_filter,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    }, []);

    const handleFilterChange = useCallback((key: keyof CurrentFilters, value: any) => {
        setLocalCurrent(prev => {
            const nextCurrent = { ...prev, [key]: value };

            // Only debounce price slider changes
            if (key === 'max_price_filter') {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => navigate(nextCurrent), DEBOUNCE_MS);
            } else if (key !== 'search') {
                // For category, brand, sort, in_stock, apply immediately
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = null;
                }
                navigate(nextCurrent);
            }
            // Search doesn't auto-navigate - user must click Search button

            return nextCurrent;
        });
    }, [navigate]);

    // Handle search button click
    const handleSearch = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        // Navigate with current search value
        navigate(localCurrent);
    }, [navigate, localCurrent]);

    const clearFilters = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        const cleared: CurrentFilters = {
            category: 'all',
            product_type: 'all',
            brand: 'all',
            search: '',
            sort_by: 'default',
            in_stock: false,
            min_price_filter: safeFilters.min_price || 0,
            max_price_filter: safeFilters.max_price || 10000,
        };
        setLocalCurrent(cleared);
        navigate(cleared);
    }, [navigate, safeFilters.min_price, safeFilters.max_price]);

    const handlePageChange = useCallback((url: string | null) => {
        if (!url) return;
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    }, []);

    const calculateDiscount = useCallback((regularPrice: number, salePrice?: number): number => {
        if (!salePrice || salePrice >= regularPrice) return 0;
        return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    }, []);

    const getProductRating = useCallback((product: Product): { average: number; count: number } => {
        if (productRatings[product.id]) {
            return productRatings[product.id];
        }
        const rating = typeof product.rating === 'string'
            ? parseFloat(product.rating)
            : (product.rating || 0);
        return { average: rating, count: 0 };
    }, [productRatings]);

    const stripHtml = useCallback((html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    }, []);

    const renderStars = useCallback((averageRating: number): JSX.Element => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <BsStarFill key={i} className="text-amber-400 text-xs" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <BsStarHalf key={i} className="text-amber-400 text-xs" />;
                    } else {
                        return <BsStar key={i} className="text-gray-300 text-xs" />;
                    }
                })}
            </div>
        );
    }, []);

    const getImageSrc = useCallback((images: string): string => {
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
    }, []);

    const totalProducts = useMemo(() => products?.total || 0, [products]);

    const filterPanelProps: FilterPanelProps = {
        categories: safeFilters.categories || [],
        brands: safeFilters.brands || [],
        products,
        filters: {
            min_price: safeFilters.min_price,
            max_price: safeFilters.max_price,
            current: localCurrent,
        },
        onFilterChange: handleFilterChange,
        onSearch: handleSearch,
        onClear: clearFilters,
        isLoading,
    };

    return (
        <AppLayout user={auth?.user} wishlist={wishlist}>
            <SeoHead
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'All Products',
                    numberOfItems: totalProducts,
                    itemListElement: products.data?.map((p, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        name: p.name,
                        url: `https://www.haatpoint.com/products/${p.id}`,
                    })),
                }} />

            <div className="min-h-screen bg-[#F2F2EE] py-20">
                <div className="max-w-[1240px] mx-auto px-8">
                    {/* Header */}
                    <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
                        <div>
                            <Eyebrow>Browse our collection</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">All Products</h1>
                            <p className="text-[#767470] text-sm mt-2">
                                Browse our premium collection of {totalProducts} products
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#E3E1DB] rounded-lg text-[#767470] hover:bg-[#F2F2EE] transition-colors"
                            >
                                <BsFilter />
                                <span className="text-sm">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Product Type Filter Bar */}
                    <div className="bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] p-2 mb-8 overflow-x-auto">
                        <div className="flex gap-1">
                            {productTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleFilterChange('product_type', type.id)}
                                    disabled={isLoading}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                                        localCurrent.product_type === type.id
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'text-[#767470] hover:bg-[#F2F2EE] hover:text-[#1B1B1B]'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-sm">{type.icon}</span>
                                    <span className="text-sm font-medium">{type.label}</span>
                                    {type.id === 'all' && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            localCurrent.product_type === type.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[#F2F2EE] text-[#767470]'
                                        }`}>
                                            {totalProducts}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block lg:w-1/4">
                            <div className="bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] p-6 sticky top-6">
                                <FilterPanel {...filterPanelProps} />
                            </div>

                            {/* Store Info */}
                            <div className="mt-6 p-5 bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB]">
                                <div className="flex items-center gap-3 mb-3">
                                    <FiTruck className="text-[#6E7F5C]" />
                                    <h4 className="font-medium text-[#1B1B1B]">Free Shipping</h4>
                                </div>
                                <p className="text-sm text-[#767470] mb-4">
                                    Free shipping on all orders over Tk 1000
                                </p>
                                <div className="flex items-center gap-3">
                                    <FiCheck className="text-green-600" />
                                    <h4 className="font-medium text-[#1B1B1B]">Secure Payment</h4>
                                </div>
                                <p className="text-sm text-[#767470]">
                                    100% secure payment with SSL encryption
                                </p>
                            </div>
                        </div>

                        {/* Mobile Filter Drawer */}
                        <Transition.Root show={showMobileFilters} as={Fragment}>
                            <Dialog as="div" className="relative z-[100] lg:hidden" onClose={setShowMobileFilters}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-[#1B1B1B]/50 backdrop-blur-sm transition-opacity" />
                                </Transition.Child>

                                <div className="fixed inset-0 overflow-hidden">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="transform transition ease-in-out duration-300"
                                                enterFrom="-translate-x-full"
                                                enterTo="translate-x-0"
                                                leave="transform transition ease-in-out duration-300"
                                                leaveFrom="translate-x-0"
                                                leaveTo="-translate-x-full"
                                            >
                                                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                                                    <div
                                                        className="flex h-full flex-col bg-[#FBFBF9] shadow-2xl"
                                                        style={{ backgroundColor: '#FBFBF9' }}
                                                    >
                                                        {/* Drawer Header */}
                                                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E3E1DB]">
                                                            <div className="flex items-center gap-2">
                                                                <BsFilter className="text-[#6E7F5C]" />
                                                                <span className="font-display font-extrabold text-lg uppercase">
                                                                    Filters
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="p-2 rounded-sm hover:bg-[#F2F2EE] transition-colors"
                                                                onClick={() => setShowMobileFilters(false)}
                                                            >
                                                                <BsX className="h-6 w-6" />
                                                            </button>
                                                        </div>

                                                        {/* Drawer Content */}
                                                        <div className="flex-1 overflow-y-auto px-6 py-6">
                                                            <FilterPanel {...filterPanelProps} />
                                                        </div>

                                                        {/* Sticky Apply Button */}
                                                        <div className="border-t border-[#E3E1DB] px-6 py-4">
                                                            <button
                                                                onClick={() => setShowMobileFilters(false)}
                                                                className="w-full flex items-center justify-center py-3 rounded-sm text-sm font-bold text-white bg-[#6E7F5C] shadow-hard-sm transition-transform hover:-translate-y-0.5"
                                                            >
                                                                Show {totalProducts} results
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition.Root>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="text-sm text-[#767470]">
                                    Showing <span className="font-medium text-[#1B1B1B]">
                                        {products?.from || 0}
                                    </span> to <span className="font-medium text-[#1B1B1B]">
                                        {products?.to || 0}
                                    </span> of <span className="font-medium text-[#1B1B1B]">
                                        {totalProducts}
                                    </span> products
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* View Toggle */}
                                    <div className="flex items-center border border-[#E3E1DB] rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            disabled={isLoading}
                                            className={`p-2 transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-white text-[#767470] hover:bg-[#F2F2EE]'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title="Grid view"
                                        >
                                            <BsGrid3X3Gap size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            disabled={isLoading}
                                            className={`p-2 border-l border-[#E3E1DB] transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-white text-[#767470] hover:bg-[#F2F2EE]'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title="List view"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Loading Spinner */}
                            {isLoading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E7F5C]"></div>
                                </div>
                            )}

                            {/* Products Grid/List */}
                            {!isLoading && products?.data?.length > 0 ? (
                                <div className={`
                                    ${viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                                        : 'space-y-4'
                                    }
                                `}>
                                    {products.data.map((product: Product) => {
                                        const imageSrc = getImageSrc(product.images);
                                        const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
                                        const discountPercentage = hasDiscount
                                            ? calculateDiscount(product.regular_price, product.sale_price)
                                            : 0;
                                        const displayPrice = product.sale_price || product.regular_price;
                                        const { average: avgRating, count: reviewCount } = getProductRating(product);

                                        if (viewMode === 'grid') {
                                            return (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    user={user}
                                                    variant={product.product_type === 'trending' ? 'trending' : 'default'}
                                                    showQuickView={true}
                                                    initialAverageRating={avgRating}
                                                />
                                            );
                                        } else {
                                            // List View
                                            return (
                                                <div key={product.id} className="group bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB] overflow-hidden hover:shadow-xl transition-all duration-300">
                                                    <div className="flex flex-col md:flex-row">
                                                        {/* Image */}
                                                        <div className="md:w-1/4 relative">
                                                            <div className="aspect-square md:h-full overflow-hidden bg-[#F2F2EE]">
                                                                <img
                                                                    src={`/storage/${imageSrc}`}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/otherplaceholder.jpg';
                                                                    }}
                                                                />
                                                            </div>
                                                            {hasDiscount && (
                                                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                                                                    -{discountPercentage}%
                                                                </span>
                                                            )}

                                                            {/* Brand Badge */}
                                                            {product.brand && (
                                                                <span className="absolute bottom-3 left-3 bg-[#6E7F5C] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                                                                    {product.brand}
                                                                </span>
                                                            )}

                                                            {/* Wishlist Button in list view */}
                                                            <div className="absolute top-3 right-3">
                                                                <WishlistButton
                                                                    productId={product.id}
                                                                    className="bg-white/90 hover:bg-white shadow-lg"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="md:w-3/4 p-6">
                                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    {/* Category & Brand */}
                                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                        <span className="text-[10px] font-mono text-[#767470] uppercase tracking-wider">
                                                                            {product.category || 'Uncategorized'}
                                                                        </span>
                                                                        {product.brand && (
                                                                            <>
                                                                                <span className="text-[#E3E1DB]">/</span>
                                                                                <span className="text-[10px] font-mono text-[#6E7F5C] uppercase tracking-wider font-semibold">
                                                                                    {product.brand}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Product Name */}
                                                                    <h3 className="text-lg font-semibold text-[#1B1B1B] mb-2 group-hover:text-[#6E7F5C] transition-colors">
                                                                        {product.name}
                                                                    </h3>

                                                                    {/* Description */}
                                                                    <p className="text-[#767470] text-sm mb-4 line-clamp-2">
                                                                        {stripHtml(product.description)}
                                                                    </p>

                                                                    {/* Rating & Stock */}
                                                                    <div className="flex items-center gap-4 mb-4">
                                                                        <div className="flex items-center">
                                                                            {renderStars(avgRating)}
                                                                            {reviewCount > 0 && (
                                                                                <span className="text-xs text-[#767470] ml-1">
                                                                                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className={`inline-flex items-center gap-1 text-sm ${
                                                                            product.inStock ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            <div className={`w-2 h-2 rounded-full ${
                                                                                product.inStock ? 'bg-green-500' : 'bg-red-500'
                                                                            }`}></div>
                                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="md:w-48">
                                                                    {/* Price */}
                                                                    <div className="mb-4">
                                                                        <div className="text-2xl font-bold text-[#1B1B1B]">
                                                                            <FormatPrice price={displayPrice} />
                                                                        </div>
                                                                        {hasDiscount && (
                                                                            <div className="text-sm text-[#767470] line-through">
                                                                                <FormatPrice price={product.regular_price} />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <div className="flex items-center gap-2">
                                                                        <AddtoCartButton product={product} />
                                                                    </div>
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
                                !isLoading && (
                                    // No Results
                                    <div className="text-center py-12 bg-white rounded-xl shadow-hard-sm border border-[#E3E1DB]">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-[#F2F2EE] rounded-full flex items-center justify-center">
                                            <FiShoppingBag className="text-[#767470] text-3xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1B1B1B] mb-2">
                                            No products found
                                        </h3>
                                        <p className="text-[#767470] mb-6 max-w-md mx-auto">
                                            Try adjusting your search or filter to find what you're looking for.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            disabled={isLoading}
                                            className="px-6 py-2.5 bg-gray-900 hover:bg-[#6E7F5C] text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )
                            )}

                            {/* Pagination */}
                            {products?.data?.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-[#E3E1DB]">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-sm text-[#767470]">
                                            Showing {products?.from || 0}-{products?.to || 0} of {totalProducts} products
                                        </div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {products?.links?.map((link: any, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(link.url)}
                                                    disabled={!link.url || isLoading}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                                        link.active
                                                            ? 'bg-gray-900 text-white font-medium'
                                                            : link.url
                                                                ? 'border border-[#E3E1DB] text-[#767470] hover:bg-[#F2F2EE] hover:text-[#1B1B1B]'
                                                                : 'border border-[#E3E1DB] text-[#E3E1DB] cursor-not-allowed'
                                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Products;
