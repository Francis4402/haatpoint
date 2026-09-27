// Store.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  FaStore,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaStar,
  FaIdCard,
  FaArrowRight,
  FaTimes,
  FaExclamationCircle,
  FaBox,
  FaTags,
  FaCalendarAlt,
  FaEye,
  FaBuilding,
  FaEllipsisH,
  FaToggleOn,
  FaToggleOff,
  FaBan,
  FaCheckCircle,
} from 'react-icons/fa';
import { Orders, Product, storeType, User } from '@/types';
import FormatPrice from '@/Pages/utils/FormatePrice';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface storeDashboardProps {
    auth: {
        user: User;
    },
    stores: storeType[];
    products: Product[];
    orders: Orders[];
}

const Store = ({ auth, stores: initialStores, products, orders }: storeDashboardProps) => {

  const [stores, setStores] = useState<storeType[]>(initialStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // New: 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStore, setSelectedStore] = useState<storeType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [showMoreActions, setShowMoreActions] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const isAdmin = auth.user.role === 'admin' || auth.user.role === 'superadmin';

  // Helper function to check if store is active (handles boolean, string, and null)
  const isStoreActive = (store: storeType): boolean => {
    if (store.is_active === undefined || store.is_active === null) {
      return true; // Default to active if not set
    }
    // Convert to boolean if it's a string
    if (typeof store.is_active === 'string') {
      return store.is_active === 'true' || store.is_active === '1';
    }
    return Boolean(store.is_active);
  };

  useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);

    const { props: pageProps } = usePage() as any;
  useEffect(() => {
    if (pageProps?.errors?.error) {
      toast.error(pageProps.errors.error);
    }
  }, [pageProps?.errors]);

  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(store => isStoreActive(store)).length,
    inactiveStores: stores.filter(store => !isStoreActive(store)).length,
    totalProducts: stores.reduce((sum, store) => sum + ((store as any).stats?.totalProducts || 0), 0),
    totalOrders: stores.reduce((sum, store) => sum + ((store as any).stats?.totalOrders || 0), 0),
    totalRevenue: stores.reduce((sum, store) => sum + ((store as any).stats?.totalRevenue || 0), 0),
    averageRating: stores.length > 0
      ? stores.reduce((sum, store) => sum + ((store as any).stats?.averageRating || 0), 0) / stores.length
      : 0,
    storeTypes: Array.from(new Set(stores.map(store => store.storetype)))
  };

  const filteredStores = stores
    .filter(store => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.license?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        ((store as any).user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesType = storeTypeFilter === 'all' || store.storetype === storeTypeFilter;

      // New: Status filter
      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = isStoreActive(store);
      } else if (statusFilter === 'inactive') {
        matchesStatus = !isStoreActive(store);
      }

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const aStats = (a as any).stats || {};
      const bStats = (b as any).stats || {};
      const aCreatedAt = (a as any).created_at || new Date().toISOString();
      const bCreatedAt = (b as any).created_at || new Date().toISOString();

      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'products-high':
          return (bStats.totalProducts || 0) - (aStats.totalProducts || 0);
        case 'products-low':
          return (aStats.totalProducts || 0) - (bStats.totalProducts || 0);
        case 'revenue-high':
          return (bStats.totalRevenue || 0) - (aStats.totalRevenue || 0);
        case 'revenue-low':
          return (aStats.totalRevenue || 0) - (bStats.totalRevenue || 0);
        case 'rating-high':
          return (bStats.averageRating || 0) - (aStats.averageRating || 0);
        case 'rating-low':
          return (aStats.averageRating || 0) - (bStats.averageRating || 0);
        case 'newest':
        default:
          return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
      }
    });

  const getStoreTypeColor = (storetype: string) => {
    const colors: Record<string, string> = {
      'Electronics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Fashion': 'bg-purple-100 text-purple-800 border-purple-200',
      'Home & Living': 'bg-green-100 text-green-800 border-green-200',
      'Sports': 'bg-orange-100 text-orange-800 border-orange-200',
      'Beauty': 'bg-pink-100 text-pink-800 border-pink-200',
      'Books': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Food & Beverage': 'bg-amber-100 text-amber-800 border-amber-200',
      'Toys': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[storetype] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStoreTypeGradient = (storetype: string) => {
    const gradients: Record<string, string> = {
      'Electronics': 'from-blue-500 to-cyan-500',
      'Fashion': 'from-purple-500 to-pink-500',
      'Home & Living': 'from-green-500 to-emerald-500',
      'Sports': 'from-orange-500 to-red-500',
      'Beauty': 'from-pink-500 to-rose-500',
      'Books': 'from-indigo-500 to-violet-500',
      'Food & Beverage': 'from-amber-500 to-yellow-500',
      'Toys': 'from-teal-500 to-cyan-500'
    };
    return gradients[storetype] || 'from-gray-500 to-slate-500';
  };

  const handleDelete = (id: string) => {
    setStoreToDelete(id);
    setShowDeleteModal(true);
    setShowMoreActions(null);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      router.delete(route('dashboard.deletestore', storeToDelete), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
          setStores(prev => prev.filter(store => store.id !== storeToDelete));
          if (selectedStore?.id === storeToDelete) {
            setSelectedStore(null);
          }
        },
        onError: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
        },
        preserveScroll: true,
      });
    }
  };

  const handleEditStore = (name: string) => {
    router.visit(route('dashboard.storeedit', name));
    setShowMoreActions(null);
  };

  const handleViewProducts = (id: string) => {
    router.visit(route('dashboard.storeproducts', id));
  };

  const handleViewAnalytics = (id: string) => {
    router.visit(route('dashboard.storeanalytics', id));
  };

  const handleToggleActive = (storeId: string) => {
    setIsToggling(storeId);

    const currentStore = stores.find(s => s.id === storeId);
    if (!currentStore) return;

    const currentStatus = isStoreActive(currentStore);
    const newStatus = !currentStatus;

    setStores(prevStores =>
      prevStores.map(store => {
        if (store.id === storeId) {
          return { ...store, is_active: newStatus };
        }
        return store;
      })
    );

    if (selectedStore?.id === storeId) {
      setSelectedStore(prev => prev ? { ...prev, is_active: newStatus } : null);
    }

    router.patch(route('dashboard.store.toggle-active', storeId), {}, {
      onSuccess: () => {
        setIsToggling(null);
        router.reload({ only: ['stores'] });
      },
      onError: () => {
        setIsToggling(null);
        setStores(initialStores);
        if (selectedStore?.id === storeId) {
          const revertedStore = initialStores.find(s => s.id === storeId);
          if (revertedStore) {
            setSelectedStore(revertedStore);
          }
        }
      },
      preserveScroll: true,
    });
  };

  const formatCompactNumber = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}k`;
    } else {
      return `$${num}`;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStoreTypeFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || storeTypeFilter !== 'all' || statusFilter !== 'all';

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Store Management" />

      <div>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Manage your marketplace</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Stores</h1>
              <p className="text-text-soft mt-1">Manage all stores in your marketplace</p>
            </div>

            <Link
              href={route('dashboard.createstore')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <FaPlus className="h-4 w-4" />
              Create New Store
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Stores</p>
                  <p className="text-2xl font-bold text-ink mt-1">{stats.totalStores}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaStore className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Active Stores</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeStores}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Inactive Stores</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactiveStores}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <FaBan className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={stats.totalRevenue} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-purple-600" />
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
                  <FaStar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                />
              </div>

              {/* Store Type Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                <select
                  value={storeTypeFilter}
                  onChange={(e) => setStoreTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                >
                  <option value="all">All Store Types</option>
                  {stats.storeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter - NEW */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                >
                  <option value="all">All Status</option>
                  <option value="active">✅ Active</option>
                  <option value="inactive">🚫 Inactive</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="products-high">Most Products</option>
                  <option value="products-low">Fewest Products</option>
                  <option value="revenue-high">Highest Revenue</option>
                  <option value="revenue-low">Lowest Revenue</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearAllFilters}
                className={`inline-flex items-center justify-center px-4 py-2 border rounded-xl transition-colors ${
                  hasActiveFilters
                    ? 'bg-marigold text-white border-marigold hover:bg-marigold-dark'
                    : 'bg-paper-dim text-text-soft border-line hover:bg-paper-dim/80 cursor-not-allowed opacity-50'
                }`}
                disabled={!hasActiveFilters}
              >
                <FaTimes className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>

            {/* Results Info with Active Filters Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-text-soft">
                Showing <span className="font-semibold text-ink">{filteredStores.length}</span> of <span className="font-semibold text-ink">{stats.totalStores}</span> stores
              </p>

              {/* Active Filters Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <span className="mr-1">
                      {statusFilter === 'active' ? '✅' : '🚫'}
                    </span>
                    {statusFilter === 'active' ? 'Active' : 'Inactive'}
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 hover:text-blue-600"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {storeTypeFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {storeTypeFilter}
                    <button
                      onClick={() => setStoreTypeFilter('all')}
                      className="ml-1 hover:text-purple-600"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-gray-600"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stores List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">All Stores</h2>
                  <span className="text-sm text-text-soft font-mono">
                    {filteredStores.length} stores
                  </span>
                </div>

                {filteredStores.length === 0 ? (
                  <div className="text-center py-12">
                    <FaStore className="h-16 w-16 text-text-soft mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink mb-2">No Stores Found</h3>
                    <p className="text-text-soft mb-6">
                      {searchTerm ? `No results for "${searchTerm}"` : 'No stores available'}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-6 py-3 bg-marigold text-white font-semibold rounded-xl hover:bg-marigold-dark transition-all duration-300"
                      >
                        <FaTimes className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </button>
                    ) : (
                      <Link
                        href={route('dashboard.createstore')}
                        className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Create Your First Store
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStores.map(store => {
                      const storeStats = (store as any).stats || {};
                      const storeCreatedAt = (store as any).created_at || new Date().toISOString();
                      const storeUser = (store as any).user || {};
                      const isActive = isStoreActive(store);

                      return (
                        <div
                          key={store.id}
                          className={`border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${
                            selectedStore?.id === store.id ? 'ring-2 ring-marigold bg-marigold/5' : ''
                          } ${!isActive ? 'bg-gray-50 opacity-75' : ''}`}
                          onClick={() => setSelectedStore(store)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${!isActive ? 'border-gray-300' : 'border-line'} shadow-hard-sm`}>
                                <img
                                  src={store.logo ? `/storage/${store.logo}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                                  alt={store.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Store';
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className={`font-bold text-lg truncate ${!isActive ? 'text-gray-500 line-through' : 'text-ink'}`}>
                                      {store.name}
                                    </h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      isActive
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                      {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <div className="flex items-center flex-wrap gap-2 mt-1">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${getStoreTypeColor(store.storetype)}`}>
                                      <FaBuilding className="h-3 w-3 mr-1" />
                                      {store.storetype}
                                    </span>
                                    {store.license && (
                                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-paper-dim text-text-soft border border-line">
                                        <FaIdCard className="h-3 w-3 mr-1" />
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex space-x-1">
                                  {isAdmin && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleActive(store.id);
                                        }}
                                        disabled={isToggling === store.id}
                                        className={`p-2 rounded-xl transition-colors ${
                                          isActive
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-red-600 hover:bg-red-50'
                                        } ${isToggling === store.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title={isActive ? 'Deactivate store' : 'Activate store'}
                                      >
                                        {isToggling === store.id ? (
                                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                                        ) : isActive ? (
                                          <FaToggleOn className="h-5 w-5" />
                                        ) : (
                                          <FaToggleOff className="h-5 w-5" />
                                        )}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditStore(store.name);
                                        }}
                                        className="p-2 text-marigold hover:bg-marigold/10 rounded-xl transition-colors"
                                        title="Edit store"
                                      >
                                        <FaEdit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(store.id);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Delete store"
                                      >
                                        <FaTrash className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <div className="text-center p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaBox className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft font-medium">Products</span>
                                  </div>
                                  <p className="text-lg font-bold text-ink">{products.filter(p => p.store_id === store.id).length}</p>
                                </div>
                                <div className="text-center p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaTags className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft font-medium">Orders</span>
                                  </div>
                                  <p className="text-lg font-bold text-ink">{orders.filter(o => o.store_id === store.id).length}</p>
                                </div>
                                <div className="text-center p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaDollarSign className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft font-medium">Revenue</span>
                                  </div>
                                  <p className="text-lg font-bold text-ink">
                                    <FormatPrice price={storeStats.totalRevenue || 0} />
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center justify-center mb-1">
                                    <FaStar className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft font-medium">Rating</span>
                                  </div>
                                  <p className="text-lg font-bold text-ink">{storeStats.averageRating?.toFixed(1) || '0.0'}</p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-line gap-2">
                                {storeUser.name && (
                                  <div className="flex items-center">
                                    <FaUsers className="h-3 w-3 text-text-soft mr-2" />
                                    <span className="text-xs text-text-soft">
                                      Owner: <span className="font-medium text-ink">{storeUser.name}</span>
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center text-xs text-text-soft">
                                  <FaCalendarAlt className="h-3 w-3 mr-1" />
                                  <span>Created {new Date(storeCreatedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Store Details Sidebar */}
            <div className="space-y-6">
              {selectedStore ? (
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink flex items-center gap-2">
                      <FaStore className="h-5 w-5 text-marigold" />
                      Store Details
                    </h3>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-line shadow-hard-sm mx-auto mb-4">
                      <img
                        src={selectedStore.logo ? `/storage/${selectedStore.logo}` : 'https://placehold.co/400x400/e2e8f0/64748b?text=Store'}
                        alt={selectedStore.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Store';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-ink">{selectedStore.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isStoreActive(selectedStore)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {isStoreActive(selectedStore) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStoreTypeColor(selectedStore.storetype)}`}>
                        {selectedStore.storetype}
                      </span>
                      {selectedStore.license && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-paper-dim text-text-soft border border-line">
                          <FaIdCard className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2">
                        <FaIdCard className="h-4 w-4" />
                        License Information
                      </h5>
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="font-medium text-ink text-center">{selectedStore.license || 'No license provided'}</p>
                        <p className="text-xs text-text-soft text-center mt-1">Business License</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2">
                        <FaUsers className="h-4 w-4" />
                        Store Owner
                      </h5>
                      <div className="p-3 bg-paper-dim rounded-xl border border-line">
                        <p className="font-medium text-ink text-center">{selectedStore.email || 'No email'}</p>
                        <p className="text-xs text-text-soft text-center mt-1">Contact Email</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2">
                        <FaChartLine className="h-4 w-4" />
                        Store Performance
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium">Products</p>
                          <p className="text-xl font-bold text-ink">{(selectedStore as any).stats?.totalProducts || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                          <p className="text-xs text-green-600 font-medium">Orders</p>
                          <p className="text-xl font-bold text-ink">{(selectedStore as any).stats?.totalOrders || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                          <p className="text-xs text-purple-600 font-medium">Revenue</p>
                          <p className="text-xl font-bold text-ink">
                            <FormatPrice price={(selectedStore as any).stats?.totalRevenue || 0} />
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium">Rating</p>
                          <p className="text-xl font-bold text-ink">{((selectedStore as any).stats?.averageRating || 0).toFixed(1)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4" />
                        Timeline
                      </h5>
                      <div className="space-y-2 p-3 bg-paper-dim rounded-xl border border-line">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-soft">Created Date</span>
                          <span className="font-medium text-ink">{new Date((selectedStore as any).created_at || new Date()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-soft">Last Updated</span>
                          <span className="font-medium text-ink">{new Date((selectedStore as any).updated_at || new Date()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-line">
                      <div className="grid grid-cols-2 gap-3">
                        {isAdmin && (
                          <button
                            onClick={() => handleToggleActive(selectedStore.id)}
                            disabled={isToggling === selectedStore.id}
                            className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                              isStoreActive(selectedStore)
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                            } ${isToggling === selectedStore.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isToggling === selectedStore.id ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                Updating...
                              </>
                            ) : isStoreActive(selectedStore) ? (
                              <>
                                <FaBan className="h-4 w-4 mr-2" />
                                Deactivate Store
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="h-4 w-4 mr-2" />
                                Activate Store
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewProducts(selectedStore.id)}
                          className="flex items-center justify-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-colors font-medium text-sm border border-line"
                        >
                          <FaEye className="h-4 w-4 mr-2" />
                          View Products
                        </button>
                        <button
                          onClick={() => handleViewAnalytics(selectedStore.id)}
                          className="flex items-center justify-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-colors font-medium text-sm border border-line col-span-2"
                        >
                          <FaChartLine className="h-4 w-4 mr-2" />
                          View Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <FaStore className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em]">Store Details</h3>
                      <p className="text-sm text-gray-300">Select a store to view details</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-6">
                    Click on any store from the list to view detailed information, performance metrics, and manage store settings.
                  </p>
                  <div className="text-center py-4">
                    <FaStore className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm text-gray-400">No store selected</p>
                  </div>
                </div>
              )}

              {/* Store Types Distribution */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 flex items-center gap-2">
                  <FaChartLine className="h-5 w-5 text-marigold" />
                  Store Types Distribution
                </h3>
                <div className="space-y-3">
                  {stats.storeTypes.map(type => {
                    const count = stores.filter(store => store.storetype === type).length;
                    const percentage = stats.totalStores > 0 ? (count / stats.totalStores) * 100 : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`}></div>
                            <span className="font-medium text-ink truncate">{type}</span>
                          </div>
                          <span className="text-text-soft">{count} stores</span>
                        </div>
                        <div className="w-full bg-paper-dim rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-text-soft text-right">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performing Stores */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 flex items-center gap-2">
                  <FaStar className="h-5 w-5 text-amber-500" />
                  Top Performing Stores
                </h3>
                <div className="space-y-3">
                  {stores
                    .filter(store => isStoreActive(store))
                    .sort((a, b) => ((b as any).stats?.totalRevenue || 0) - ((a as any).stats?.totalRevenue || 0))
                    .slice(0, 3)
                    .map((store, index) => (
                      <div key={store.id} className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300">
                        <div className="flex items-center min-w-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-ink truncate">{store.name}</h4>
                            <p className="text-xs text-text-soft">
                              <FormatPrice price={(store as any).stats?.totalRevenue || 0} /> revenue
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="text-marigold hover:text-marigold-dark text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em]">Need to onboard more stores?</h3>
                <p className="opacity-90 text-sm">Streamline your store management with our enterprise features</p>
              </div>
              <button
                onClick={() => router.visit(route('dashboard.createstore'))}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-marigold font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                Explore Features
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Store"
        message="Are you sure you want to delete this store? All associated products and data will be permanently removed."
      />
    </DashboardLayout>
  );
};

export default Store;
