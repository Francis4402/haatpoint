import { useState, useEffect } from 'react';
import { FaTimes, FaUpload, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'sonner';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FormData) => void;
    isEditing: boolean;
    initialData?: {
        id: string;
        categories: string;
        brand: string | string[];
        subcategory: string | null;
        sizes?: string | null;
        image: string | null;
    };
    isProcessing: boolean;
    errors: {
        categories?: string;
        brand?: string;
        subcategory?: string;
        image?: string;
    };
}

interface CategoryFormData {
    categories: string;
    brand: string[];
    subcategory: string[];
    sizes: string[];
    image: File | null;
}

const CategoryModal = ({
    isOpen,
    onClose,
    onSave,
    isEditing,
    initialData,
    isProcessing,
    errors,
}: CategoryModalProps) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        categories: '',
        brand: [''],
        subcategory: [''],
        sizes: [''],
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

    useEffect(() => {
        if (initialData && isEditing) {

            let parsedSubcategories: string[] = [];
            if (initialData.subcategory) {
                try {
                    const parsed = JSON.parse(initialData.subcategory);
                    if (Array.isArray(parsed)) {
                        parsedSubcategories = parsed;
                    }
                } catch (e) {
                    parsedSubcategories = [];
                }
            }

            let parsedSizes: string[] = [];
            if (initialData.sizes) {
                try {
                    const parsed = JSON.parse(initialData.sizes);
                    if (Array.isArray(parsed)) {
                        parsedSizes = parsed;
                    }
                } catch (e) {
                    parsedSizes = [];
                }
            }

            // Handle brand - could be string or array
            let brands: string[] = [];
            if (typeof initialData.brand === 'string') {
                try {
                    // Try to parse as JSON if it's a string
                    const parsed = JSON.parse(initialData.brand);
                    if (Array.isArray(parsed)) {
                        brands = parsed;
                    } else {
                        brands = [initialData.brand];
                    }
                } catch {
                    brands = [initialData.brand];
                }
            } else if (Array.isArray(initialData.brand)) {
                brands = initialData.brand;
            } else {
                brands = [''];
            }

            setFormData({
                categories: initialData.categories,
                brand: brands.length > 0 ? brands : [''],
                subcategory: parsedSubcategories.length > 0 ? parsedSubcategories : [''],
                sizes: parsedSizes.length > 0 ? parsedSizes : [''],
                image: null,
            });

            if (initialData.image) {
                setCurrentImagePath(`/storage/${initialData.image}`);
            } else {
                setCurrentImagePath(null);
            }
        } else {
            setFormData({
                categories: '',
                brand: [''],
                subcategory: [''],
                sizes: [''],
                image: null,
            });
            setCurrentImagePath(null);
        }
        setImagePreview(null);
    }, [initialData, isEditing, isOpen]);

    if (!isOpen) return null;

    const updateField = (field: keyof CategoryFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Brand functions
    const addBrandField = () => {
        updateField('brand', [...formData.brand, '']);
    };

    const removeBrandField = (index: number) => {
        const newBrands = [...formData.brand];
        newBrands.splice(index, 1);
        updateField('brand', newBrands.length > 0 ? newBrands : ['']);
    };

    const updateBrand = (index: number, value: string) => {
        const newBrands = [...formData.brand];
        newBrands[index] = value;
        updateField('brand', newBrands);
    };

    // Subcategory functions
    const addSubcategoryField = () => {
        updateField('subcategory', [...formData.subcategory, '']);
    };

    const removeSubcategoryField = (index: number) => {
        const newSubcategories = [...formData.subcategory];
        newSubcategories.splice(index, 1);
        updateField('subcategory', newSubcategories.length > 0 ? newSubcategories : ['']);
    };

    const updateSubcategory = (index: number, value: string) => {
        const newSubcategories = [...formData.subcategory];
        newSubcategories[index] = value;
        updateField('subcategory', newSubcategories);
    };

    // Size functions
    const addSizeField = () => {
        updateField('sizes', [...formData.sizes, '']);
    };

    const removeSizeField = (index: number) => {
        const newSizes = [...formData.sizes];
        newSizes.splice(index, 1);
        updateField('sizes', newSizes.length > 0 ? newSizes : ['']);
    };

    const updateSize = (index: number, value: string) => {
        const newSizes = [...formData.sizes];
        newSizes[index] = value;
        updateField('sizes', newSizes);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateField('image', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        updateField('image', null);
        setImagePreview(null);
        setCurrentImagePath(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one brand is filled
        const filteredBrands = formData.brand.filter(brand => brand.trim() !== '');
        if (filteredBrands.length === 0) {
            toast.error('At least one brand is required');
            return;
        }

        if (!formData.categories.trim()) {
            toast.error('Category name is required');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('categories', formData.categories.trim());

        // Send brands as JSON array
        formDataToSend.append('brand', JSON.stringify(filteredBrands));

        // Send subcategories as JSON array (can be empty)
        const filteredSubcategory = formData.subcategory.filter(subcat => subcat.trim() !== '');
        formDataToSend.append('subcategory', JSON.stringify(filteredSubcategory));

        // Send sizes as JSON array (optional)
        const filteredSizes = formData.sizes.filter(size => size.trim() !== '');
        formDataToSend.append('sizes', JSON.stringify(filteredSizes));

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        onSave(formDataToSend);
    };

    return (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line w-full max-w-lg overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">
                                {isEditing ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Category Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-ink mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={formData.categories}
                                onChange={(e) => updateField('categories', e.target.value)}
                                placeholder="Enter category name"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${
                                    errors.categories ? 'border-red-500' : 'border-line'
                                }`}
                                autoFocus
                                required
                            />
                            {errors.categories && (
                                <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
                            )}
                        </div>

                        {/* Brands */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-ink">
                                    Brands *
                                </label>
                                <button
                                    type="button"
                                    onClick={addBrandField}
                                    className="inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium"
                                >
                                    <FaPlus className="h-3 w-3 mr-1" />
                                    Add Brand
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.brand.map((brand, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={brand}
                                                onChange={(e) => updateBrand(index, e.target.value)}
                                                placeholder={`Brand ${index + 1}`}
                                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${
                                                    errors.brand ? 'border-red-500' : 'border-line'
                                                }`}
                                            />
                                        </div>
                                        {formData.brand.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBrandField(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove brand"
                                            >
                                                <FaMinus className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {errors.brand && (
                                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                            )}
                            <p className="mt-2 text-sm text-text-soft">
                                Add one or more brands for this category
                            </p>
                        </div>

                        {/* Subcategories - Optional */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-ink">
                                    Subcategories (Optional)
                                </label>
                                <button
                                    type="button"
                                    onClick={addSubcategoryField}
                                    className="inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium"
                                >
                                    <FaPlus className="h-3 w-3 mr-1" />
                                    Add Subcategory
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.subcategory.map((subcategory, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={subcategory}
                                                onChange={(e) => updateSubcategory(index, e.target.value)}
                                                placeholder={`Subcategory ${index + 1}`}
                                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${
                                                    errors.subcategory ? 'border-red-500' : 'border-line'
                                                }`}
                                            />
                                        </div>
                                        {formData.subcategory.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubcategoryField(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove subcategory"
                                            >
                                                <FaMinus className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {errors.subcategory && (
                                <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
                            )}
                            <p className="mt-2 text-sm text-text-soft">
                                Add subcategories for better product organization (optional)
                            </p>
                        </div>

                        {/* Sizes - Optional */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-ink">
                                    Sizes (Optional)
                                </label>
                                <button
                                    type="button"
                                    onClick={addSizeField}
                                    className="inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium"
                                >
                                    <FaPlus className="h-3 w-3 mr-1" />
                                    Add Size
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.sizes.map((size, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={size}
                                                onChange={(e) => updateSize(index, e.target.value)}
                                                placeholder={`Size ${index + 1} (e.g. XL, L, M)`}
                                                className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                            />
                                        </div>
                                        {formData.sizes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSizeField(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove size"
                                            >
                                                <FaMinus className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-text-soft">
                                Sizes offered for products in this category (e.g. clothing: S, M, L, XL, 2XL)
                            </p>
                        </div>

                        {/* Image Upload - Required */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-ink mb-2">
                                Category Image *
                            </label>

                            {imagePreview ? (
                                <div className="mb-4 relative">
                                    <div className="w-full h-48 rounded-xl overflow-hidden border border-line">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <FaTimes className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : currentImagePath ? (
                                <div className="mb-4 relative">
                                    <div className="w-full h-48 rounded-xl overflow-hidden border border-line">
                                        <img
                                            src={currentImagePath}
                                            alt="Current"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200';
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
                                        <label className="cursor-pointer">
                                            <span className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 text-sm">
                                                Change Image
                                            </span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-line rounded-xl p-6 text-center hover:border-marigold transition-colors">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-3">
                                            <FaUpload className="h-6 w-6 text-text-soft" />
                                        </div>
                                        <p className="text-text-soft mb-2">Click to upload image</p>
                                        <p className="text-sm text-text-soft">PNG, JPG, WEBP up to 2MB</p>
                                        <label className="cursor-pointer mt-5">
                                            <span className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300">
                                                Choose File
                                            </span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required={!isEditing} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                            )}
                            {!isEditing && !imagePreview && !currentImagePath && (
                                <p className="mt-1 text-sm text-text-soft">Image is required for new categories</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-line">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`px-6 py-2 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Category' : 'Add Category')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
