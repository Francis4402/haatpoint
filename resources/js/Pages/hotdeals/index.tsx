// HotDeals.tsx
import { useState, useMemo, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/types';
import {
  BsFilter,
  BsSearch,
  BsChevronRight,
  BsGrid3X3Gap,
  BsX,
  BsPercent
} from 'react-icons/bs';
import {
  FiShoppingBag,
  FiTruck,
  FiClock
} from 'react-icons/fi';
import {
  RiFireFill,
  RiFlashlightFill,
  RiDiscountPercentFill
} from 'react-icons/ri';
import AppLayout from '@/Layouts/AppLayout';
import FormatPrice from '../utils/FormatePrice';
import { withMarkup } from '../utils/price';
import AddtoCartButton from '../buttons/AddtoCartButton';
import SeoHead from '@/Components/SeoHead';
import ProductCard from '@/Components/ProductCard';

interface HotDealsPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    auth?: {
        user?: any;
    };
    wishlist: any;
}

// Standalone memoized countdown timer component so HotDeals does NOT re-render every second
function FlashSaleCountdown() {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 12,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            setTimeLeft({ hours, minutes, seconds });
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-2 mt-2 justify-center">
            <div className="bg-white/30 rounded-lg px-3 py-1.5">
                <span className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs ml-1">h</span>
            </div>
            <div className="bg-white/30 rounded-lg px-3 py-1.5">
                <span className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs ml-1">m</span>
            </div>
            <div className="bg-white/30 rounded-lg px-3 py-1.5">
                <span className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs ml-1">s</span>
            </div>
        </div>
    );
}

const HotDeals = ({ products, auth, wishlist }: HotDealsPageProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [sortBy, setSortBy] = useState('discount-high');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [minDiscount, setMinDiscount] = useState<number>(0);

    const productsData = products.data || [];

    const calculateDiscount = (regularPrice: number, salePrice?: number): number => {
        if (!salePrice || salePrice >= regularPrice) return 0;
        return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    };

    const hotDealsProducts = useMemo(() => {
        return productsData.filter(product =>
            product.sale_price &&
            product.sale_price > 0 &&
            product.sale_price < product.regular_price
        );
    }, [productsData]);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(hotDealsProducts.map(p => p.category).filter(Boolean));
        return ['all', ...uniqueCategories];
    }, [hotDealsProducts]);

    const sortOptions = [
        { id: 'discount-high', label: 'Discount: High to Low' },
        { id: 'discount-low', label: 'Discount: Low to High' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'rating', label: 'Top Rated' },
    ];

    const filteredProducts = useMemo(() => {
        let filtered = [...hotDealsProducts];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query))
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (minDiscount > 0) {
            filtered = filtered.filter(product => {
                const discount = calculateDiscount(product.regular_price, product.sale_price);
                return discount >= minDiscount;
            });
        }

        filtered = filtered.filter(product => {
            const price = product.sale_price || product.regular_price;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        switch (sortBy) {
            case 'discount-high':
                filtered.sort((a, b) => {
                    const discountA = calculateDiscount(a.regular_price, a.sale_price);
                    const discountB = calculateDiscount(b.regular_price, b.sale_price);
                    return discountB - discountA;
                });
                break;
            case 'discount-low':
                filtered.sort((a, b) => {
                    const discountA = calculateDiscount(a.regular_price, a.sale_price);
                    const discountB = calculateDiscount(b.regular_price, b.sale_price);
                    return discountA - discountB;
                });
                break;
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = a.sale_price || a.regular_price;
                    const priceB = b.sale_price || b.regular_price;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = a.sale_price || a.regular_price;
                    const priceB = b.sale_price || b.regular_price;
                    return priceB - priceA;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                });
                break;
            default:
                break;
        }

        return filtered;
    }, [hotDealsProducts, searchQuery, selectedCategory, minDiscount, priceRange, sortBy]);

    const totalDeals = hotDealsProducts.length;

    return (
        <AppLayout user={auth?.user} wishlist={wishlist}>
            <SeoHead />

            {/* Mobile Filter Drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
                    showMobileFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={!showMobileFilters}
            >
                <div
                    className="absolute inset-0 bg-black/50 transition-opacity"
                    onClick={() => setShowMobileFilters(false)}
                />
                <div
                    className={`absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto p-6 transition-transform duration-300 ease-out transform ${
                        showMobileFilters ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-ink">Filters</h3>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="p-2 hover:bg-paper-dim rounded-lg transition-colors"
                        >
                            <BsX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3">
                            Categories
                        </h4>
                        <div className="space-y-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowMobileFilters(false);
                                    }}
                                    className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-marigold/10 text-marigold font-medium'
                                            : 'text-text-soft hover:text-ink hover:bg-paper-dim'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{category === 'all' ? 'All Categories' : category}</span>
                                        <span className="text-xs text-text-soft">
                                            ({hotDealsProducts.filter(p => category === 'all' || p.category === category).length})
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Minimum Discount Slider */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider">
                                Min Discount
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-marigold/10 text-marigold">
                                {minDiscount === 0 ? 'All Deals' : `≥ ${minDiscount}% OFF`}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="70"
                                step="5"
                                value={minDiscount}
                                onChange={(e) => setMinDiscount(parseInt(e.target.value, 10))}
                                className="w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
                            />
                            <div className="flex items-center justify-between text-[11px] text-text-soft">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>70%+</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {[0, 15, 30, 50, 70].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setMinDiscount(val)}
                                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                            minDiscount === val
                                                ? 'bg-marigold text-white shadow-sm'
                                                : 'bg-paper-dim text-text-soft hover:bg-ink/5 hover:text-ink'
                                        }`}
                                    >
                                        {val === 0 ? 'All' : `${val}%+`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3">
                            Price Range
                        </h4>
                        <div className="space-y-3">
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-soft">
                                    <FormatPrice price={priceRange[0]} />
                                </span>
                                <span className="text-sm text-text-soft">
                                    <FormatPrice price={priceRange[1]} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="mb-6">
                        <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-3">
                            Sort by
                        </h4>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setShowMobileFilters(false);
                            }}
                            className="w-full p-2.5 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors bg-white"
                        >
                            {sortOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={() => {
                            setSelectedCategory('all');
                            setMinDiscount(0);
                            setPriceRange([0, 10000]);
                            setSearchQuery('');
                            setSortBy('discount-high');
                            setShowMobileFilters(false);
                        }}
                        className="w-full py-2.5 text-sm border border-line text-text-soft rounded-lg hover:bg-paper-dim hover:text-ink transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-marigold to-marigold-dark text-white">
                <div className="container py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <RiFireFill className="text-4xl animate-pulse" />
                                <h1 className="text-4xl md:text-5xl font-bold">Hot Deals</h1>
                            </div>
                            <p className="text-xl opacity-90 mb-2">
                                Limited Time Offers! Up to 70% Off
                            </p>
                            <p className="text-lg opacity-80">
                                {totalDeals} products on sale
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30">
                            <RiFlashlightFill className="text-4xl mx-auto mb-2" />
                            <p className="text-2xl font-bold">Flash Sale</p>
                            <p className="text-sm opacity-90">Ends in:</p>
                            <FlashSaleCountdown />
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-paper-dim py-8">
                <div className="container">
                    {/* Header with Search */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            {/* Breadcrumb */}
                            <nav className="text-sm text-text-soft">
                                <ol className="flex items-center space-x-2">
                                    <li>
                                        <Link href="/" className="hover:text-marigold transition-colors">Home</Link>
                                    </li>
                                    <li><BsChevronRight className="text-text-soft text-xs" /></li>
                                    <li className="text-ink font-medium">Hot Deals</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors w-full sm:w-48 md:w-56 lg:w-64 bg-white"
                                />
                            </div>

                            {/* Filter Toggle Button (Mobile/Tablet) */}
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-line rounded-lg text-text-soft hover:bg-paper-dim hover:text-ink transition-colors"
                            >
                                <BsFilter />
                                <span className="text-sm">Filters</span>
                                <span className="text-xs bg-marigold/10 text-marigold px-1.5 py-0.5 rounded-full">
                                    {selectedCategory !== 'all' || minDiscount > 0 || searchQuery ? '!' : ''}
                                </span>
                            </button>
                        </div>
                    </div>


                    {/* Active Filters Bar */}
                    {(minDiscount > 0 || selectedCategory !== 'all' || searchQuery || priceRange[1] < 10000) && (
                        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-line shadow-sm">
                            <span className="text-xs font-semibold text-text-soft">Active filters:</span>
                            {minDiscount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-marigold/10 text-marigold-dark border border-marigold/20">
                                    ≥ {minDiscount}% OFF
                                    <button onClick={() => setMinDiscount(0)} className="hover:text-red-500">
                                        <BsX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-paper-dim text-ink border border-line">
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">
                                        <BsX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-paper-dim text-ink border border-line">
                                    "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                                        <BsX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            {priceRange[1] < 10000 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-paper-dim text-ink border border-line">
                                    ≤ ৳{priceRange[1]}
                                    <button onClick={() => setPriceRange([0, 10000])} className="hover:text-red-500">
                                        <BsX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    setMinDiscount(0);
                                    setSelectedCategory('all');
                                    setSearchQuery('');
                                    setPriceRange([0, 10000]);
                                }}
                                className="text-xs text-text-soft hover:text-red-500 ml-auto font-medium transition-colors"
                            >
                                Reset all
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Sidebar Filters - Desktop */}
                        <div className="hidden lg:block lg:w-1/4">
                            <div className="bg-white rounded-xl shadow-hard-sm border border-line p-6 sticky top-6">
                                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                                    <RiDiscountPercentFill className="text-marigold" />
                                    Filter Deals
                                </h3>

                                {/* Minimum Discount Slider */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider">
                                            Min Discount
                                        </h4>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-marigold/10 text-marigold">
                                            {minDiscount === 0 ? 'All Deals' : `≥ ${minDiscount}% OFF`}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="70"
                                            step="5"
                                            value={minDiscount}
                                            onChange={(e) => setMinDiscount(parseInt(e.target.value, 10))}
                                            className="w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
                                        />
                                        <div className="flex items-center justify-between text-[11px] text-text-soft">
                                            <span>0%</span>
                                            <span>25%</span>
                                            <span>50%</span>
                                            <span>70%+</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {[0, 15, 30, 50, 70].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setMinDiscount(val)}
                                                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                                                        minDiscount === val
                                                            ? 'bg-marigold text-white shadow-sm'
                                                            : 'bg-paper-dim text-text-soft hover:bg-ink/5 hover:text-ink'
                                                    }`}
                                                >
                                                    {val === 0 ? 'All' : `${val}%+`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4">
                                        Categories
                                    </h4>
                                    <div className="space-y-1">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                                                    selectedCategory === category
                                                        ? 'bg-marigold/10 text-marigold font-medium'
                                                        : 'text-text-soft hover:text-ink hover:bg-paper-dim'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{category === 'all' ? 'All Categories' : category}</span>
                                                    <span className="text-xs text-text-soft">
                                                        ({hotDealsProducts.filter(p => category === 'all' || p.category === category).length})
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Filter by Price */}
                                <div className="mb-6">
                                    <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4">
                                        Price Range
                                    </h4>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-1.5 bg-paper-dim rounded-lg appearance-none cursor-pointer accent-marigold"
                                        />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-soft">
                                                <FormatPrice price={priceRange[0]} />
                                            </span>
                                            <span className="text-sm text-text-soft">
                                                <FormatPrice price={priceRange[1]} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sort by */}
                                <div className="mb-6">
                                    <h4 className="font-mono text-xs font-semibold text-text-soft uppercase tracking-wider mb-4">
                                        Sort by
                                    </h4>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full p-2.5 text-sm border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors bg-white"
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setMinDiscount(0);
                                        setPriceRange([0, 10000]);
                                        setSearchQuery('');
                                        setSortBy('discount-high');
                                    }}
                                    className="w-full py-2.5 text-sm border border-line text-text-soft rounded-lg hover:bg-paper-dim hover:text-ink transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>

                            {/* Deal Info */}
                            <div className="mt-6 p-5 bg-gradient-to-r from-marigold/10 to-marigold/5 border border-marigold/20 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <FiClock className="text-marigold text-xl" />
                                    <h4 className="font-medium text-ink">Limited Time Offers</h4>
                                </div>
                                <p className="text-sm text-text-soft mb-3">
                                    These deals won't last long! Grab them before they're gone.
                                </p>
                                <div className="flex items-center gap-3">
                                    <FiTruck className="text-green-600" />
                                    <h4 className="font-medium text-ink">Free Shipping</h4>
                                </div>
                                <p className="text-sm text-text-soft">
                                    On all orders over ৳1000
                                </p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="text-sm text-text-soft">
                                    Showing <span className="font-medium text-ink">{filteredProducts.length}</span> hot deals
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* View Toggle */}
                                    <div className="flex items-center border border-line rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-white text-text-soft hover:bg-paper-dim'
                                            }`}
                                            title="Grid view"
                                        >
                                            <BsGrid3X3Gap size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 border-l border-line transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-white text-text-soft hover:bg-paper-dim'
                                            }`}
                                            title="List view"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid/List */}
                            {filteredProducts.length > 0 ? (
                                <div className={`
                                    ${viewMode === 'grid'
                                        ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5'
                                        : 'space-y-4'
                                    }
                                `}>
                                    {filteredProducts.map((product: Product) => {
                                        if (viewMode === 'grid') {
                                            return (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    user={auth?.user || null}
                                                    badge={`${calculateDiscount(product.regular_price, product.sale_price)}% OFF`}
                                                    variant="default"
                                                    showQuickView={true}
                                                />
                                            );
                                        } else {
                                            // List View
                                            const discountPercentage = calculateDiscount(product.regular_price, product.sale_price);
                                            const displayPrice = withMarkup(product.sale_price || product.regular_price);
                                            const imageSrc = product.images ? (() => {
                                                try {
                                                    const parsed = JSON.parse(product.images);
                                                    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/otherplaceholder.jpg';
                                                } catch {
                                                    return '/otherplaceholder.jpg';
                                                }
                                            })() : '/otherplaceholder.jpg';

                                            return (
                                                <div key={product.id} className="group bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300">
                                                    <div className="flex flex-col sm:flex-row">
                                                        {/* Image */}
                                                        <div className="sm:w-1/3 lg:w-1/4 relative">
                                                            <div className="aspect-square sm:h-full overflow-hidden bg-paper-dim">
                                                                <img
                                                                    src={`/storage/${imageSrc}`}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/otherplaceholder.jpg';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-marigold to-marigold-dark text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold shadow-lg">
                                                                -{discountPercentage}%
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="sm:w-2/3 lg:w-3/4 p-4 sm:p-6">
                                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    {/* Category */}
                                                                    <div className="mb-1 sm:mb-2">
                                                                        <span className="text-[9px] sm:text-[10px] font-mono text-text-soft uppercase tracking-wider">
                                                                            {product.category || 'Uncategorized'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Product Name */}
                                                                    <h3 className="text-base sm:text-lg font-semibold text-ink mb-1 sm:mb-2 group-hover:text-marigold transition-colors">
                                                                        {product.name}
                                                                    </h3>

                                                                    {/* Description */}
                                                                    <p className="text-text-soft text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                                                        {product.description}
                                                                    </p>

                                                                    {/* Stock */}
                                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                                        <div className={`inline-flex items-center gap-1 text-[10px] sm:text-sm ${
                                                                            product.inStock ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                                                                                product.inStock ? 'bg-green-500' : 'bg-red-500'
                                                                            }`}></div>
                                                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                                        </div>
                                                                        {product.quantity > 0 && product.quantity < 10 && (
                                                                            <span className="text-[10px] sm:text-xs text-orange-600 font-medium">
                                                                                🔥 Only {product.quantity} left!
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Savings Info */}
                                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                                                                        <p className="text-green-700 text-[10px] sm:text-sm">
                                                                            <span className="font-bold">You Save:</span> <FormatPrice price={withMarkup(product.regular_price) - displayPrice} /> ({discountPercentage}% off)
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="sm:w-48">
                                                                    {/* Price */}
                                                                    <div className="mb-3 sm:mb-4">
                                                                        <div className="text-xl sm:text-2xl font-bold text-marigold">
                                                                            <FormatPrice price={displayPrice} />
                                                                        </div>
                                                                        <div className="text-xs sm:text-sm text-text-soft line-through">
                                                                            <FormatPrice price={withMarkup(product.regular_price)} />
                                                                        </div>
                                                                    </div>

                                                                    {/* Add to Cart */}
                                                                    <div className="mt-2">
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
                                // No Results
                                <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-hard-sm border border-line">
                                    <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-paper-dim rounded-full flex items-center justify-center">
                                        <FiShoppingBag className="text-text-soft text-2xl sm:text-3xl" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">
                                        No deals found
                                    </h3>
                                    <p className="text-sm sm:text-base text-text-soft mb-4 sm:mb-6 max-w-md mx-auto px-4">
                                        Try adjusting your filters to find more great deals.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setMinDiscount(0);
                                            setPriceRange([0, 10000]);
                                            setSearchQuery('');
                                            setSortBy('discount-high');
                                        }}
                                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 hover:bg-marigold text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredProducts.length > 0 && products.last_page > 1 && (
                                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-line">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-xs sm:text-sm text-text-soft">
                                            Showing 1-{Math.min(filteredProducts.length, products.per_page)} of {products.total} products
                                        </div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {[...Array(Math.min(products.last_page, 5))].map((_, i) => {
                                                const page = i + 1;
                                                const isCurrentPage = products.current_page === page;

                                                return (
                                                    <Link
                                                        key={page}
                                                        href={`?page=${page}`}
                                                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-line text-xs sm:text-sm rounded-lg transition-colors ${
                                                            isCurrentPage
                                                                ? 'bg-gray-900 text-white border-gray-900'
                                                                : 'text-text-soft hover:bg-paper-dim hover:text-ink'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add animation styles */}
            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </AppLayout>
    );
};

export default HotDeals;
