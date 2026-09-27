import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
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
} from 'react-icons/fa';
import { Product, storeType } from '@/types';
import { toast } from 'sonner';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';


interface dashboarProductProps {
    auth: {
        user: any
    },
    products: Product[]
    store: storeType
}

const Products = ({auth, products, store}: dashboarProductProps) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [stockFilter, setStockFilter] = useState('all');
    const [isDeleting, setIsDeleting] = useState(false);

    const stats = {
        totalProducts: products.length,
        totalValue: products.reduce((sum, product) => sum + (product.sale_price || product.regular_price) * product.quantity, 0),
        inStock: products.filter(p => p.inStock && p.quantity > 0).length,
        outOfStock: products.filter(p => !p.inStock || p.quantity === 0).length,
        lowStock: products.filter(p => p.quantity > 0 && p.quantity < 20).length,
        categories: Array.from(new Set(products.map(p => p.category))),
        averageRating: products.reduce((sum, product) => sum + (product.rating || 0), 0) / (products.length || 1)
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

            return matchesSearch && matchesCategory && matchesStock;
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
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Manage your inventory</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Products</h1>
                            <p className="text-text-soft mt-1">Manage your inventory and products</p>
                        </div>

                        <div>
                            {store ? (
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
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
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                                >
                                    <option value="all">All Stock Status</option>
                                    <option value="in-stock">In Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                    <option value="low-stock">Low Stock</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
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
                            {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategoryFilter('all');
                                        setStockFilter('all');
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
                                            <p className="text-sm text-text-soft mb-4 line-clamp-2">{stripHtml(product.description)}</p>

                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    {product.sale_price ? (
                                                        <>
                                                            <span className="text-lg font-bold text-ink"><FormatPrice price={product.sale_price} /></span>
                                                            <span className="text-sm text-text-soft line-through ml-2"><FormatPrice price={product.regular_price} /></span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-ink"><FormatPrice price={product.regular_price} /></span>
                                                    )}
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
