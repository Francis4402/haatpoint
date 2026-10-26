import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaTag,
  FaImage,
  FaInfoCircle,
  FaTimes,
  FaStore,
  FaCrown,
  FaShieldAlt,
  FaPauseCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { PageProps, Product, storeType } from '@/types';
import { toast } from 'sonner';
import FormatPrice from '@/Pages/utils/FormatePrice';
import { withMarkup } from '@/Pages/utils/price';
import Eyebrow from '@/Pages/Components/Eyebrow';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';


interface dashboarProductProps {
    auth: {
        user: any
    },
    products: Product[]
    store: storeType
    filterStore?: storeType | null
    selectedStoreId?: string | null
}

const Products = ({auth, products, store, filterStore, selectedStoreId}: dashboarProductProps) => {
    const { props } = usePage<PageProps>();
    const sub = props.auth?.subscription;
    const isAgent = auth.user?.role === 'agent' || !!sub;
    const isAdminOrSuperAdmin = auth.user?.role === 'admin' || auth.user?.role === 'superadmin';
    const isPro = !!sub?.isPro;
    const agentProductsCount = sub?.productsCount ?? products.length;
    const isLimitReached = isAgent && !isPro && agentProductsCount >= 150;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [stockFilter, setStockFilter] = useState('all');
    const [moderationFilter, setModerationFilter] = useState<'all' | 'active' | 'paused' | 'blocked'>('all');
    const [isDeleting, setIsDeleting] = useState(false);
    const [unblockingId, setUnblockingId] = useState<string | null>(null);

    const pausedCount = sub?.pausedProductsCount ?? products.filter(p => p.is_active === false && !p.is_blocked).length;
    const blockedCount = products.filter(p => p.is_blocked).length;
    const activeCount = products.filter(p => p.is_active !== false && !p.is_blocked).length;

    const stats = {
        totalProducts: products.length,
        totalValue: products.reduce((sum, product) => sum + (product.sale_price || product.regular_price) * product.quantity, 0),
        inStock: products.filter(p => p.inStock && p.quantity > 0).length,
        outOfStock: products.filter(p => !p.inStock || p.quantity === 0).length,
        lowStock: products.filter(p => p.quantity > 0 && p.quantity < 20).length,
        categories: Array.from(new Set(products.map(p => p.category))),
        averageRating: products.reduce((sum, product) => sum + (product.rating || 0), 0) / (products.length || 1),
        pausedCount,
        blockedCount,
        activeCount,
    };

    const filteredProducts = products
        .filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            const matchesStock =
                stockFilter === 'all' ? true :
                stockFilter === 'in-stock' ? product.inStock && product.quantity > 0 :
                stockFilter === 'out-of-stock' ? (!product.inStock || product.quantity === 0) :
                stockFilter === 'low-stock' ? product.quantity > 0 && product.quantity < 20 : true;

            const matchesModeration =
                moderationFilter === 'all' ? true :
                moderationFilter === 'active' ? (product.is_active !== false && !product.is_blocked) :
                moderationFilter === 'paused' ? (product.is_active === false && !product.is_blocked) :
                moderationFilter === 'blocked' ? !!product.is_blocked : true;

            return matchesSearch && matchesCategory && matchesStock && matchesModeration;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-high':
                    return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
                case 'price-low':
                    return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
                case 'quantity-high':
                    return b.quantity - a.quantity;
                case 'quantity-low':
                    return a.quantity - b.quantity;
                case 'rating-high':
                    return (b.rating || 0) - (a.rating || 0);
                case 'rating-low':
                    return (a.rating || 0) - (b.rating || 0);
                case 'newest':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

    const confirmDelete = () => {
        if (productToDelete) {
            setIsDeleting(true);
            router.delete(route('dashboard.deleteproduct', productToDelete), {
                onSuccess: () => {
                    toast.success('Product deleted successfully!');
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                    setIsDeleting(false);
                },
                onError: () => {
                    toast.error('Failed to delete product.');
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                    setIsDeleting(false);
                },
                preserveScroll: true,
            });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        setIsDeleting(false);
    };

    const handleUnblock = (id: string) => {
        setUnblockingId(id);
        router.patch(route('dashboard.products.unblock', id), {}, {
            onSuccess: () => {
                toast.success('Product unblocked and approved successfully!');
                setUnblockingId(null);
            },
            onError: () => {
                toast.error('Failed to unblock product.');
                setUnblockingId(null);
            },
            preserveScroll: true,
        });
    };

    const handleToast = () => {
        toast.error('Please Create Store First!');
    };

    const calculateDiscount = (regularPrice: number, salePrice: number) => {
        if (!salePrice) return 0;
        const regular = regularPrice;
        const sale = salePrice;
        return Math.round(((regular - sale) / regular) * 100);
    };

    const getStockStatus = (quantity: number, inStock: boolean) => {
        if (quantity === 0 || !inStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (quantity < 10) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
        if (quantity < 20) return { label: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    // Get product name for deletion confirmation
    const getProductName = () => {
        if (!productToDelete) return '';
        const product = products.find(p => p.id === productToDelete);
        return product ? product.name : '';
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Products Management" />

            <div>
                <div className="max-w-[1240px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Manage your inventory</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Products</h1>
                            <p className="text-text-soft mt-1">Manage your inventory and products</p>
                        </div>

                        <div>
                            {isLimitReached ? (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl">
                                        150 / 150 Limit Reached
                                    </span>
                                    <Link
                                        href={route('dashboard.upgrade')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-marigold hover:bg-marigold-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <FaCrown className="h-4 w-4" />
                                        Upgrade for Unlimited
                                    </Link>
                                </div>
                            ) : store ? (
                                <Link
                                    href={route('dashboard.createproduct')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    Add New Product
                                </Link>
                            ) : (
                                <button
                                    onClick={handleToast}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    Add New Product
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Agent Product Upload Capacity Banner */}
                    {isAgent && (
                        isPro ? (
                            <div className="mb-6 flex items-center justify-between gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-hard-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                                        <FaCrown className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-950">HaatPoint Pro Seller Active</p>
                                        <p className="text-xs text-emerald-700">Unlimited products upload enabled across your stores · Low 7% sales commission.</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold bg-white text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                                    Unlimited Uploads
                                </span>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 sm:p-5 bg-white border border-line rounded-2xl shadow-hard-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="h-2.5 w-2.5 rounded-full bg-marigold animate-pulse" />
                                        <span className="font-display font-bold text-sm text-ink">
                                            Free Plan: {agentProductsCount} / 150 Products Uploaded (Free Forever)
                                        </span>
                                        <span className="text-xs font-mono text-text-soft">
                                            ({Math.max(0, 150 - agentProductsCount)} remaining · 10% sales commission)
                                        </span>
                                    </div>
                                    <Link
                                        href={route('dashboard.upgrade')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-marigold hover:underline shrink-0"
                                    >
                                        <FaCrown className="h-3.5 w-3.5 text-amber-500" />
                                        Upgrade to Pro for Unlimited Uploads (Monthly or 6 Months) &rarr;
                                    </Link>
                                </div>
                                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden border border-line/40">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            isLimitReached ? 'bg-red-500' : agentProductsCount >= 130 ? 'bg-amber-500' : 'bg-marigold'
                                        }`}
                                        style={{ width: `${Math.min(100, (agentProductsCount / 150) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        )
                    )}

                    {/* Agent Paused Products Alert Banner (Pro lapsed / downgrade) */}
                    {isAgent && pausedCount > 0 && (
                        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-2 border-amber-300 rounded-2xl shadow-hard-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                        <FaPauseCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-display font-extrabold text-amber-950 text-base">
                                                {pausedCount} Product{pausedCount === 1 ? '' : 's'} Temporarily Paused
                                            </h3>
                                            <span className="text-[11px] font-mono font-bold bg-amber-200/90 text-amber-900 px-2.5 py-0.5 rounded-full">
                                                Free Tier: Top 150 Rated Live
                                            </span>
                                        </div>
                                        <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                                            Your Pro subscription is currently inactive. Your top 150 highest-rated products remain live for buyers, while {pausedCount} product{pausedCount === 1 ? '' : 's'} have been paused.
                                            <span className="font-semibold block sm:inline sm:ml-1">
                                                Activate again to gain access and unpause all of your products.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('dashboard.upgrade')}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 hover:scale-105"
                                >
                                    <FaCrown className="h-3.5 w-3.5" />
                                    Activate Pro to Unpause All
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Content Moderation Bot Alert - Admin / Superadmin */}
                    {isAdminOrSuperAdmin && blockedCount > 0 && (
                        <div className="mb-6 p-4 sm:p-5 bg-red-50 border-2 border-red-200 rounded-2xl shadow-hard-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                        <FaShieldAlt className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-display font-extrabold text-red-950 text-base">
                                                Content Moderation Bot: {blockedCount} Flagged Product{blockedCount === 1 ? '' : 's'}
                                            </h3>
                                            <span className="text-[11px] font-mono font-bold bg-red-200/80 text-red-900 px-2.5 py-0.5 rounded-full">
                                                Adult / NSFW Safety
                                            </span>
                                        </div>
                                        <p className="text-xs text-red-800 mt-1 leading-relaxed">
                                            Automated bot flagged prohibited text, adult content, nudity, sex toys, or hentai keywords. Blocked products are hidden from public buyers. Review diagnostic reasons below and unblock legitimate listings.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModerationFilter('blocked')}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 hover:scale-105"
                                >
                                    <FaFilter className="h-3 w-3" />
                                    Review Flagged ({blockedCount})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Moderation Bot Alert - Agent view */}
                    {!isAdminOrSuperAdmin && blockedCount > 0 && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl shadow-hard-sm">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
                                    <FaShieldAlt className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-red-950">
                                        {blockedCount} Product{blockedCount === 1 ? '' : 's'} Blocked by Safety Bot
                                    </p>
                                    <p className="text-xs text-red-700">
                                        Our safety system flagged prohibited content (adult, nudity, or inappropriate text). These products are hidden from the store. Check the blocked reason below or contact admin support.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Store Filter Banner */}
                    {filterStore && (
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-gradient-to-r from-marigold/10 via-amber-50 to-orange-50 border-2 border-marigold/40 rounded-2xl shadow-hard-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-marigold/40 shrink-0 bg-white shadow-sm">
                                    <img
                                        src={filterStore.logo ? `/storage/${filterStore.logo}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                                        alt={filterStore.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Store';
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-marigold-dark bg-marigold/20 px-2.5 py-0.5 rounded-full">
                                            Store Filter Active
                                        </span>
                                        <span className="text-xs text-text-soft">
                                            {products.length} product{products.length === 1 ? '' : 's'} listed
                                        </span>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-display font-extrabold text-ink mt-0.5">
                                        {filterStore.name}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => router.visit(route('dashboard.products'))}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-line text-ink hover:bg-neutral-100 rounded-xl font-semibold text-sm transition-all shadow-sm shrink-0"
                            >
                                <FaTimes className="h-3.5 w-3.5 text-text-soft" />
                                Clear Filter / View All
                            </button>
                        </div>
                    )}

                    {/* Pricing notice */}
                    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-marigold/30 bg-marigold/5 p-4">
                        <FaInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-marigold" />
                        <p className="text-sm text-ink">
                            <span className="font-semibold">Note:</span> 10% price will be increased when you add the product.
                            The price you enter for your customers is shown with this increase already included.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Products</p>
                                    <p className="text-2xl font-bold text-ink mt-1">{stats.totalProducts}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                                    <FaBox className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Inventory Value</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        <FormatPrice price={stats.totalValue} />
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <FaDollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">In Stock</p>
                                    <p className="text-2xl font-bold text-ink mt-1">{stats.inStock}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FaChartLine className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Avg. Rating</p>
                                    <p className="text-2xl font-bold text-ink mt-1">{stats.averageRating.toFixed(1)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <FaTag className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft text-sm"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink text-sm"
                                >
                                    <option value="all">All Categories</option>
                                    {stats.categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Stock Filter */}
                            <div className="relative">
                                <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={stockFilter}
                                    onChange={(e) => setStockFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink text-sm"
                                >
                                    <option value="all">All Stock Status</option>
                                    <option value="in-stock">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                    <option value="low-stock">Low Stock</option>
                                </select>
                            </div>

                            {/* Moderation / Visibility Status Filter */}
                            <div className="relative">
                                <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={moderationFilter}
                                    onChange={(e) => setModerationFilter(e.target.value as any)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink text-sm"
                                >
                                    <option value="all">All Status ({stats.totalProducts})</option>
                                    <option value="active">Live Active ({stats.activeCount})</option>
                                    {stats.pausedCount > 0 && (
                                        <option value="paused">Paused / Free ({stats.pausedCount})</option>
                                    )}
                                    {stats.blockedCount > 0 && (
                                        <option value="blocked">Blocked by Bot ({stats.blockedCount})</option>
                                    )}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink text-sm"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="quantity-high">Quantity: High to Low</option>
                                    <option value="quantity-low">Quantity: Low to High</option>
                                    <option value="rating-high">Rating: High to Low</option>
                                    <option value="rating-low">Rating: Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Info */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-text-soft">
                                Showing <span className="font-semibold text-ink">{filteredProducts.length}</span> of <span className="font-semibold text-ink">{stats.totalProducts}</span> products
                            </p>
                            {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' || moderationFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategoryFilter('all');
                                        setStockFilter('all');
                                        setModerationFilter('all');
                                    }}
                                    className="text-sm text-marigold hover:text-marigold-dark font-medium transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-12 text-center">
                            <FaBox className="h-16 w-16 text-text-soft mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-ink mb-2">No Products Found</h3>
                            <p className="text-text-soft mb-6">
                                {searchTerm ? `No results for "${searchTerm}"` : 'No products match your filters'}
                            </p>
                            {store ? (
                                <Link
                                    href={route('dashboard.createproduct')}
                                    className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaPlus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Link>
                            ) : (
                                <button
                                    onClick={handleToast}
                                    className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaPlus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => {
                                const discount = calculateDiscount(product.regular_price, product.sale_price);
                                const stockStatus = getStockStatus(product.quantity, product.inStock);

                                let images = [];

                                try {
                                    images = product.images ? JSON.parse(product.images) : [];
                                } catch (e) {
                                    images = product.images ? [product.images] : [];
                                }

                                const mainImage = images.length > 0 ? images[0] : null;

                                return (
                                    <div key={product.id} className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        {/* Product Image */}
                                        <div className="relative h-48 overflow-hidden bg-paper-dim">
                                            <img
                                                src={mainImage ? `/storage/${mainImage}` : '/otherplaceholder.jpg'}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/otherplaceholder.jpg';
                                                }}
                                            />
                                            {product.is_blocked ? (
                                                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-hard-sm flex items-center gap-1 z-10">
                                                    <FaShieldAlt className="h-3 w-3" />
                                                    BLOCKED BY BOT
                                                </div>
                                            ) : product.is_active === false ? (
                                                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-hard-sm flex items-center gap-1 z-10">
                                                    <FaPauseCircle className="h-3 w-3" />
                                                    PAUSED (FREE LIMIT)
                                                </div>
                                            ) : null}

                                            {discount > 0 && (
                                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-hard-sm">
                                                    -{discount}%
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 left-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                                                    {stockStatus.label}
                                                </span>
                                            </div>

                                            {images.length > 1 && (
                                                <div className="absolute bottom-3 right-3 bg-ink/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                                    +{images.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            {isAdminOrSuperAdmin && product.store && (
                                                <div className="flex items-center gap-1.5 text-xs text-text-soft font-mono mb-2 truncate">
                                                    <FaStore className="h-3 w-3 text-marigold shrink-0" />
                                                    <span className="font-semibold text-ink truncate">{product.store.name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-mono text-text-soft bg-paper-dim px-2 py-1 rounded">
                                                    {product.category}
                                                </span>
                                                <div className="flex items-center">
                                                    <FaImage className="h-3 w-3 text-text-soft mr-1" />
                                                    <span className="text-xs text-text-soft">{product.quantity} in stock</span>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-ink mb-2 line-clamp-1">{product.name}</h3>
                                            <p className="text-sm text-text-soft mb-3 line-clamp-2">{stripHtml(product.description)}</p>

                                            {/* Blocked Diagnostic Reason */}
                                            {product.is_blocked && (
                                                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-950">
                                                    <div className="flex items-center gap-1 font-bold text-red-700 mb-0.5">
                                                        <FaShieldAlt className="h-3 w-3" /> Moderation Reason:
                                                    </div>
                                                    <p className="text-[11px] leading-snug line-clamp-3">
                                                        {product.blocked_reason || 'Inappropriate keywords or adult content detected.'}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Paused Free Limit Notice */}
                                            {product.is_active === false && !product.is_blocked && (
                                                <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-1.5">
                                                    <FaPauseCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                                                    <span>Paused due to Free 150-product limit. Upgrade to Pro to reactivate.</span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    {product.sale_price ? (
                                                        <div className="flex items-baseline gap-2">
                                                             <span className="text-lg font-bold text-ink"><FormatPrice price={product.sale_price} /></span>
                                                            <span className="text-sm text-text-soft line-through"><FormatPrice price={product.regular_price} /></span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-bold text-ink"><FormatPrice price={product.regular_price} /></span>
                                                    )}
                                                    <p className="text-xs text-text-soft mt-0.5">
                                                        Your price ·{" "}
                                                        <span className="text-marigold font-semibold">
                                                            Customer pays <FormatPrice price={withMarkup(product.sale_price || product.regular_price)} />
                                                        </span>{" "}
                                                        (+10%)
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-sm font-medium text-ink ml-1">{product.rating || 0}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className="inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 text-sm font-medium border border-line"
                                                >
                                                    <FaEye className="h-3 w-3 mr-1" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('dashboard.productedit', product.slug)}
                                                    className="inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 text-sm font-medium border border-line"
                                                >
                                                    <FaEdit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(product.id)}
                                                    className="inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-300 text-sm font-medium border border-red-200"
                                                >
                                                    <FaTrash className="h-3 w-3 mr-1" />
                                                    Delete
                                                </button>
                                            </div>

                                            {/* Admin Unblock Button */}
                                            {isAdminOrSuperAdmin && product.is_blocked && (
                                                <button
                                                    onClick={() => handleUnblock(product.id)}
                                                    disabled={unblockingId === product.id}
                                                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60"
                                                >
                                                    <FaCheckCircle className="h-3.5 w-3.5" />
                                                    {unblockingId === product.id ? 'Unblocking...' : 'Unblock & Approve Product'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <DeleteConfirmationDialog
                        isOpen={showDeleteModal}
                        onClose={cancelDelete}
                        onConfirm={confirmDelete}
                        isDeleting={isDeleting}
                        title="Delete Product"
                        message={`Are you sure you want to delete "${getProductName()}"? This action cannot be undone and all product data will be permanently removed.`}
                        variant="danger"
                    />

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Low Stock Items</p>
                                    <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
                                </div>
                                <FaBox className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-hard-sm p-6 text-white border border-red-300/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Out of Stock</p>
                                    <p className="text-2xl font-bold mt-1">{stats.outOfStock}</p>
                                </div>
                                <FaTag className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-hard-sm p-6 text-white border border-green-300/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Categories</p>
                                    <p className="text-2xl font-bold mt-1">{stats.categories.length}</p>
                                </div>
                                <FaChartLine className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
