// Categories.tsx
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import {
  FaTrash,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaTag,
  FaFolder,
  FaChartBar,
  FaBoxes,
  FaTimes,
  FaEdit,
} from 'react-icons/fa';
import { categoryType, PageProps } from '@/types';
import { toast } from 'sonner';
import Eyebrow from '@/Pages/Components/Eyebrow';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';
import CategoryModal from '@/Pages/dialogpopups/CetegoryDialog';

interface FormErrors {
    categories?: string;
    brand?: string;
    subcategory?: string;
    image?: string;
    error?: string;
}

const Categories = ({ auth, categories: initialCategories }: PageProps<{ categories: categoryType[] }>) => {
    const categories = initialCategories || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [selectedCategory, setSelectedCategory] = useState<categoryType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<categoryType | null>(null);


    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const stats = {
        totalCategories: categories.length,
    };

    const parseSubcategory = (subcategoryString: string | null): string[] => {
        if (!subcategoryString) return [];
        try {
            return JSON.parse(subcategoryString);
        } catch (e) {
            return [];
        }
    };

    const parseBrands = (brandString: string | null): string[] => {
        if (!brandString) return [];
        try {
            const parsed = JSON.parse(brandString);
            return Array.isArray(parsed) ? parsed : [brandString];
        } catch (e) {
            return brandString ? [brandString] : [];
        }
    };

    const filteredCategories = categories
        .filter(category => {
            const brands = parseBrands(category.brand);
            const matchesCategory = category.categories.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = brands.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory || matchesBrand;
        })
        .sort((a, b) => {
            switch (sortBy) {
            case 'name-asc':
                return a.categories.localeCompare(b.categories);
            case 'name-desc':
                return b.categories.localeCompare(a.categories);
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            default:
                return a.categories.localeCompare(b.categories);
            }
        });

    const getCategoryColor = () => {
        return 'from-marigold to-marigold-dark';
    };

    const extractErrorMessage = (errs: FormErrors, fallback: string) => {
        return errs.categories || errs.brand || errs.image || errs.subcategory || errs.error || fallback;
    };

    const handleAddCategory = (formData: FormData) => {
        setProcessing(true);
        setErrors({});

        router.post(route('dashboard.storecategory'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                setErrors({});
                toast.success('Category added successfully!');
            },
            onError: (errs) => {
                console.error('Form errors:', errs);
                setErrors(errs as FormErrors);
                toast.error(extractErrorMessage(errs as FormErrors, 'Failed to add category. Please check the form.'));
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleEdit = (category: categoryType) => {
        setCategoryToEdit(category);
        setErrors({});
        setShowEditModal(true);
    };

    const handleUpdateCategory = (formData: FormData) => {
        if (!categoryToEdit) return;

        setProcessing(true);
        setErrors({});

        router.put(route('dashboard.updatecategory', categoryToEdit.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Category updated successfully!');
                setShowEditModal(false);
                setCategoryToEdit(null);
                setErrors({});
            },
            onError: (errs) => {
                console.error('Update errors:', errs);
                setErrors(errs as FormErrors);
                toast.error(extractErrorMessage(errs as FormErrors, 'Failed to update category.'));
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleDelete = (id: string) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('dashboard.deletecategory', categoryToDelete), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                    toast.success('Category deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete category.');
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                },
                preserveScroll: true,
            });
        }
    };

    const resetAddForm = () => {
        setErrors({});
        setShowAddModal(false);
    };

    const resetEditForm = () => {
        setCategoryToEdit(null);
        setErrors({});
        setShowEditModal(false);
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Categories Management" />

            <div>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Organize your products</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Categories</h1>
                            <p className="text-text-soft mt-1">Organize and manage your product categories</p>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <FaPlus className="h-4 w-4" />
                            Add New Category
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Categories</p>
                                    <p className="text-2xl font-bold text-ink mt-1">{stats.totalCategories}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                                    <FaFolder className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Subcategories</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.reduce((total, cat) => total + parseSubcategory(cat.subcategory).length, 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <FaTag className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Recent Activity</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.length > 0 ? new Date(categories[0].created_at).getDate() : '0'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FaChartBar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Organized</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.length > 0 ? categories.length : '0'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <FaBoxes className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search categories or brands..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                />
                            </div>

                            <div className="relative">
                                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full md:w-48 pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                                >
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-text-soft">
                                Showing <span className="font-semibold text-ink">{filteredCategories.length}</span> of <span className="font-semibold text-ink">{stats.totalCategories}</span> categories
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-marigold hover:text-marigold-dark font-medium flex items-center transition-colors"
                                >
                                    <FaTimes className="h-3 w-3 mr-1" />
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">All Categories</h2>
                                    <span className="text-sm text-text-soft font-mono">
                                        {filteredCategories.length} categories
                                    </span>
                                </div>

                                {filteredCategories.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaFolder className="h-16 w-16 text-text-soft mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-ink mb-2">No Categories Found</h3>
                                        <p className="text-text-soft mb-6">
                                            {searchTerm ? `No results for "${searchTerm}"` : 'No categories available'}
                                        </p>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                        >
                                            <FaPlus className="h-4 w-4 mr-2" />
                                            Add Your First Category
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredCategories.map(category => {
                                            const brands = parseBrands(category.brand);
                                            return (
                                                <div key={category.id} className="border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-start space-x-3">
                                                            {category.image && (
                                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-line">
                                                                    <LazyLoadImage
                                                                        src={`/storage/${category.image}`}
                                                                        alt={category.categories}
                                                                        effect="blur"
                                                                        placeholderSrc="/otherplaceholder.jpg"
                                                                        threshold={100}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h3
                                                                    className="text-lg font-semibold text-ink cursor-pointer hover:text-marigold transition-colors"
                                                                    onClick={() => setSelectedCategory(category)}
                                                                >
                                                                    {category.categories}
                                                                </h3>
                                                                {brands.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {brands.slice(0, 2).map((brand, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                                                                            >
                                                                                {brand}
                                                                            </span>
                                                                        ))}
                                                                        {brands.length > 2 && (
                                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                                                                +{brands.length - 2} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {parseSubcategory(category.subcategory).length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {parseSubcategory(category.subcategory).slice(0, 2).map((subcat, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full"
                                                                            >
                                                                                {subcat}
                                                                            </span>
                                                                        ))}
                                                                        {parseSubcategory(category.subcategory).length > 2 && (
                                                                            <span className="px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full">
                                                                                +{parseSubcategory(category.subcategory).length - 2} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <button
                                                                onClick={() => handleEdit(category)}
                                                                className="p-2 text-text-soft hover:text-marigold hover:bg-paper-dim rounded-lg transition-colors"
                                                                title="Edit category"
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(category.id)}
                                                                className="p-2 text-text-soft hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete category"
                                                            >
                                                                <FaTrash className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-line">
                                                        <div className="flex items-center justify-between text-xs text-text-soft font-mono">
                                                            <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                                                            <span>Updated: {new Date(category.updated_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {selectedCategory ? (
                                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Category Details</h3>
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="p-1 text-text-soft hover:text-ink transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        {selectedCategory.image && (
                                            <div className="rounded-xl overflow-hidden mb-4 border border-line">
                                                <LazyLoadImage
                                                    src={`/storage/${selectedCategory.image}`}
                                                    alt={selectedCategory.categories}
                                                    effect="blur"
                                                    placeholderSrc="/otherplaceholder.jpg"
                                                    threshold={100}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className={`text-center py-4 rounded-xl bg-gradient-to-r ${getCategoryColor()} text-white mb-4 shadow-hard-sm`}>
                                            <h4 className="font-bold text-lg">
                                                {selectedCategory.categories}
                                            </h4>
                                        </div>

                                        {/* Display Brands */}
                                        {parseBrands(selectedCategory.brand).length > 0 && (
                                            <div className="mb-6">
                                                <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Brands</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {parseBrands(selectedCategory.brand).map((brand, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full border border-blue-200"
                                                        >
                                                            {brand}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {parseSubcategory(selectedCategory.subcategory).length > 0 && (
                                            <div className="mb-6">
                                                <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Subcategories</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {parseSubcategory(selectedCategory.subcategory).map((subcat, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-paper-dim text-ink text-sm rounded-full border border-line"
                                                        >
                                                            {subcat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 bg-paper-dim rounded-xl p-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-soft">Created:</span>
                                                <span className="font-medium text-ink">{new Date(selectedCategory.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-soft">Last Updated:</span>
                                                <span className="font-medium text-ink">{new Date(selectedCategory.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                                    <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4">Category Details</h3>
                                    <p className="text-sm text-gray-300 mb-6">
                                        Select a category from the list to view detailed information.
                                    </p>
                                    <div className="text-center">
                                        <FaFolder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm text-gray-400">No category selected</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4">Recent Categories</h3>
                                <div className="space-y-4">
                                    {categories
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .slice(0, 3)
                                        .map((category, index) => (
                                            <div key={category.id} className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r ${getCategoryColor()} text-white font-bold text-sm`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-ink">{category.categories}</h4>
                                                        <p className="text-xs text-text-soft font-mono">
                                                            {new Date(category.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCategory(category)}
                                                    className="text-marigold hover:text-marigold-dark text-sm font-medium transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            <CategoryModal
                isOpen={showAddModal}
                onClose={resetAddForm}
                onSave={handleAddCategory}
                isEditing={false}
                isProcessing={processing}
                errors={errors}
            />

            {/* Edit Category Modal */}
            <CategoryModal
                isOpen={showEditModal}
                onClose={resetEditForm}
                onSave={handleUpdateCategory}
                isEditing={true}
                initialData={categoryToEdit ? {
                    id: categoryToEdit.id,
                    categories: categoryToEdit.categories,
                    brand: categoryToEdit.brand,
                    subcategory: categoryToEdit.subcategory,
                    image: categoryToEdit.image,
                } : undefined}
                isProcessing={processing}
                errors={errors}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                isDeleting={false}
            />
        </DashboardLayout>
    );
};

export default Categories;
