import DashboardLayout from '@/Layouts/DashboardLayout';
import { categoryType, storeType, Product } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
  FaFileAlt,
  FaImage,
  FaBox,
  FaTag,
  FaDollarSign,
  FaHashtag,
  FaBookOpen,
  FaUpload,
  FaTimes,
  FaLink,
  FaStore,
  FaPercent,
  FaArrowLeft,
  FaEye,
  FaPlus,
  FaInfoCircle,
  FaCheckCircle,
  FaShoppingCart,
  FaArrowRight,
  FaChevronDown,
  FaWeightHanging,
  FaPalette,
  FaStar,
  FaFire,
  FaRocket,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import {
  HiCheck,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface EditProductFormProps {
  auth: {
    user: any;
  };
  store: storeType;
  categories: categoryType[];
  product: Product;
}

type ProductType = 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'script', 'indent',
  'align',
  'link', 'image', 'video'
];

export default function EditProductForm({ auth, store, categories, product }: EditProductFormProps) {
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [showSalePrice, setShowSalePrice] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [colorInputs, setColorInputs] = useState<string[]>(['']);

  // ✅ NEW: Track manual slug edits (state so the hint re-renders live)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const productTypes: { value: ProductType; label: string; icon: typeof FaTag; color: string }[] = [
    { value: 'regular', label: 'Regular', icon: FaTag, color: 'text-gray-500' },
    { value: 'featured', label: 'Featured', icon: FaStar, color: 'text-yellow-500' },
    { value: 'trending', label: 'Trending', icon: FaFire, color: 'text-orange-500' },
    { value: 'top-selling', label: 'Top Selling', icon: FaRocket, color: 'text-green-500' },
    { value: 'new-arrival', label: 'New Arrival', icon: FaBox, color: 'text-blue-500' },
  ];

  const { data, setData, processing, errors, reset } = useForm({
    name: product.name || '',
    images: [] as File[],
    slug: product.slug || '',
    category: product.category || '',
    subcategory: product.subcategory || '',
    brand: product.brand || '',
    quantity: product.quantity?.toString() || '1',
    regular_price: product.regular_price?.toString() || '',
    sale_price: product.sale_price?.toString() || '',
    description: product.description || '',
    color: [] as string[],
    inStock: product.inStock ?? true,
    item_weight: product.item_weight?.toString() || '',
    store_id: store.id || '',
    product_type: (product.product_type as ProductType) || 'regular',
  });

  const discountPercentage = data.regular_price && data.sale_price
    ? Math.round((1 - parseFloat(data.sale_price) / parseFloat(data.regular_price)) * 100) : 0;

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // ✅ Auto-generate slug from name unless manually edited
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setData('name', newName);
    if (!slugManuallyEdited) {
      setData('slug', generateSlug(newName));
    }
  };

  useEffect(() => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setExistingImages(parsedImages);
          setImagePreviews(parsedImages.map((img: string) => `/storage/${img}`));
        } else {
          setExistingImages([]);
          setImagePreviews([]);
        }
      } catch (e) {
        console.error('Error parsing product images:', e);
        setExistingImages([]);
        setImagePreviews([]);
      }
    }

    if (product.sale_price && Number(product.sale_price) > 0) {
      setShowSalePrice(true);
    }

    if (product.color) {
      try {
        const parsedColors = JSON.parse(product.color);
        if (Array.isArray(parsedColors) && parsedColors.length > 0) {
          setColorInputs(parsedColors.filter((color: string) => color.trim() !== ''));
          setData('color', parsedColors.filter((color: string) => color.trim() !== ''));
        } else {
          setColorInputs(['']);
        }
      } catch (e) {
        console.error('Error parsing product colors:', e);
        setColorInputs(['']);
      }
    }

    if (product.product_type) {
      setData('product_type', product.product_type);
    }

    if (product.brand) {
      setData('brand', product.brand);
    }
  }, [product]);

  // Update subcategories and brands when category changes
  useEffect(() => {
    if (data.category) {
      const selectedCat = categories.find(cat => cat.categories === data.category);
      if (selectedCat) {
        if (selectedCat.subcategory) {
          const subcategories = parseSubcategory(selectedCat.subcategory);
          setAvailableSubcategories(subcategories);
          if (data.subcategory && !subcategories.includes(data.subcategory)) {
            setData('subcategory', '');
          }
        } else {
          setAvailableSubcategories([]);
          setData('subcategory', '');
        }

        if (selectedCat.brand) {
          const brands = parseBrands(selectedCat.brand);
          setAvailableBrands(brands);
          if (data.brand && !brands.includes(data.brand)) {
            setData('brand', '');
          }
        } else {
          setAvailableBrands([]);
          setData('brand', '');
        }
      }
    } else {
      setAvailableSubcategories([]);
      setAvailableBrands([]);
      setData('subcategory', '');
      setData('brand', '');
    }
  }, [data.category, categories]);

  useEffect(() => {
    const validColors = colorInputs.filter(color => color.trim() !== '');
    setData('color', validColors);
  }, [colorInputs]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const addColorInput = () => {
    setColorInputs([...colorInputs, '']);
  };

  const updateColorInput = (index: number, value: string) => {
    const newInputs = [...colorInputs];
    newInputs[index] = value;
    setColorInputs(newInputs);
  };

  const removeColorInput = (index: number) => {
    const newInputs = colorInputs.filter((_, i) => i !== index);
    setColorInputs(newInputs);
    if (newInputs.length === 0) {
      setColorInputs(['']);
    }
  };

  const getValidColors = () => {
    return colorInputs.filter(color => color.trim() !== '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast.error(
        `File${oversizedFiles.length > 1 ? 's' : ''} too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 5MB per image.`,
        { duration: 5000, position: 'top-center' }
      );
      return;
    }

    if (files.length) {
      setData('images', files as any);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
      toast.success(`${files.length} image(s) uploaded successfully!`, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const removeExistingImage = (index: number, imageName: string) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setExistingImages(newExistingImages);
    setImagePreviews(newPreviews);
    setImagesToRemove([...imagesToRemove, imageName]);

    toast.info('Image marked for removal');
  };

  const removeNewImage = (index: number) => {
    const imageIndex = index - existingImages.length;
    if (imageIndex >= 0 && imageIndex < data.images.length) {
      const newImages = data.images.filter((_, i) => i !== imageIndex);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);

      URL.revokeObjectURL(imagePreviews[index]);

      setData('images', newImages);
      setImagePreviews(newPreviews);
      toast.info('New image removed');
    }
  };

  // ✅ FIXED submit handler: use router.post + forceFormData
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory || '');
    formData.append('brand', data.brand || '');
    formData.append('quantity', data.quantity);
    formData.append('regular_price', data.regular_price);
    if (data.sale_price) {
      formData.append('sale_price', data.sale_price);
    }
    formData.append('description', data.description);
    formData.append('color', JSON.stringify(data.color));
    formData.append('inStock', data.inStock ? '1' : '0');
    formData.append('store_id', data.store_id);
    formData.append('item_weight', data.item_weight);
    formData.append('product_type', data.product_type);

    data.images.forEach((file: File, index: number) => {
      formData.append(`images[${index}]`, file);
    });

    formData.append('images_to_remove', JSON.stringify(imagesToRemove));
    formData.append('_method', 'PUT');

    router.post(route('dashboard.updateproduct', product.slug), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Product updated successfully!');
        setImagesToRemove([]);
        reset('images');
        router.visit('/dashboard/products');
      },
      onError: (errs) => {
        console.error('Update failed:', errs);
        const firstError = Object.values(errs)[0];
        toast.error(`Failed: ${firstError || 'Unknown error'}`);
      },
    });
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof data
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setData(field, value as any);
    }
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title='Edit Product'>
        <meta name="description" content="Edit product information" />
        <meta name="keywords" content="edit product, update product, product management" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Eyebrow>Update product information</Eyebrow>
            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Edit Product</h1>
            <p className="text-text-soft mt-1 flex items-center gap-2">
              <FaStore className="h-4 w-4 text-marigold" />
              Update product in <span className="font-medium text-ink">{store.name}</span>
            </p>
            <p className="text-xs text-text-soft mt-1">
              Product ID: <span className="font-mono">{product.id}</span>
            </p>
          </div>
          <Link
            href={route('dashboard.products')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        {/* Store Status */}
        <div className="mb-6 bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/20">
                <FaStore className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-extrabold uppercase text-lg">Editing Product</h3>
                <p className="opacity-90">
                  Updating product in: <span className="font-semibold">{store.name}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              <FaCheckCircle className="h-3 w-3 mr-1" />
              Edit Mode
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Information Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaBox className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Product Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Row 1: Name and Slug */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                        <FaTag className="h-4 w-4 text-marigold" />
                        Product Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                        <input
                          type="text"
                          value={data.name}
                          onChange={handleNameChange}
                          placeholder="Your Product Name"
                          className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Slug Field */}
                    <div>
                      <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                        <FaLink className="h-4 w-4 text-marigold" />
                        Product Slug
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                          <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => {
                              setSlugManuallyEdited(true);
                              setData('slug', e.target.value);
                            }}
                            placeholder="premium-wireless-headphones"
                            className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = generateSlug(data.name);
                            setData('slug', slug);
                            setSlugManuallyEdited(false);
                            toast.success('Slug regenerated!');
                          }}
                          disabled={!data.name}
                          className="px-4 py-3 border border-line rounded-xl hover:bg-paper-dim transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-text-soft hover:text-ink"
                        >
                          <FaArrowRight className="h-4 w-4" />
                          Regenerate
                        </button>
                      </div>
                      {/* ✅ Live hint reflecting manual edit state */}
                      {slugManuallyEdited ? (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-3 w-3" />
                          Manually edited — won't auto-sync with name
                        </p>
                      ) : (
                        <p className="text-xs text-text-soft mt-1">
                          Slug is automatically generated from the product name
                        </p>
                      )}
                      {errors.slug && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Categories, Subcategories, and Brands */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Main Category */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Main Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          className="w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white"
                        >
                          <span className={data.category ? 'text-ink' : 'text-text-soft'}>
                            {data.category || 'Select main category'}
                          </span>
                          <FaChevronDown
                            className={`h-5 w-5 text-text-soft transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {showCategoryDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                            {categories.map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setData('category', cat.categories);
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${
                                  data.category === cat.categories ? 'bg-marigold/10 text-marigold' : 'text-ink'
                                }`}
                              >
                                {cat.categories}
                                {data.category === cat.categories && <HiCheck className="h-5 w-5 text-marigold" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Sub Category
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => data.category && availableSubcategories.length > 0 && setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                          disabled={!data.category || availableSubcategories.length === 0}
                          className={`w-full rounded-xl border px-4 py-3 text-left flex justify-between items-center transition-colors ${
                            !data.category || availableSubcategories.length === 0
                              ? 'border-line bg-paper-dim text-text-soft cursor-not-allowed'
                              : 'border-line hover:border-marigold bg-white'
                          }`}
                        >
                          <span className={data.subcategory ? 'text-ink' : 'text-text-soft'}>
                            {data.subcategory || (data.category ? (availableSubcategories.length > 0 ? 'Select subcategory' : 'No subcategories available') : 'Select main category first')}
                          </span>
                          {data.category && availableSubcategories.length > 0 && (
                            <FaChevronDown
                              className={`h-5 w-5 text-text-soft transition-transform ${showSubcategoryDropdown ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>

                        {data.category && showSubcategoryDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                            {availableSubcategories.length > 0 ? (
                              availableSubcategories.map((subcat, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setData('subcategory', subcat);
                                    setShowSubcategoryDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${
                                    data.subcategory === subcat ? 'bg-marigold/10 text-marigold' : 'text-ink'
                                  }`}
                                >
                                  {subcat}
                                  {data.subcategory === subcat && <HiCheck className="h-5 w-5 text-marigold" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-text-soft text-center">
                                No subcategory available for this category
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.subcategory && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.subcategory}
                        </p>
                      )}
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Brand
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => data.category && availableBrands.length > 0 && setShowBrandDropdown(!showBrandDropdown)}
                          disabled={!data.category || availableBrands.length === 0}
                          className={`w-full rounded-xl border px-4 py-3 text-left flex justify-between items-center transition-colors ${
                            !data.category || availableBrands.length === 0
                              ? 'border-line bg-paper-dim text-text-soft cursor-not-allowed'
                              : 'border-line hover:border-marigold bg-white'
                          }`}
                        >
                          <span className={data.brand ? 'text-ink' : 'text-text-soft'}>
                            {data.brand || (data.category ? (availableBrands.length > 0 ? 'Select brand' : 'No brands available') : 'Select main category first')}
                          </span>
                          {data.category && availableBrands.length > 0 && (
                            <FaChevronDown
                              className={`h-5 w-5 text-text-soft transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>

                        {data.category && showBrandDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                            {availableBrands.length > 0 ? (
                              availableBrands.map((brand, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setData('brand', brand);
                                    setShowBrandDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${
                                    data.brand === brand ? 'bg-marigold/10 text-marigold' : 'text-ink'
                                  }`}
                                >
                                  {brand}
                                  {data.brand === brand && <HiCheck className="h-5 w-5 text-marigold" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-text-soft text-center">
                                No brands available for this category
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.brand && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Product Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowProductTypeDropdown(!showProductTypeDropdown)}
                        className="w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white"
                      >
                        <div className="flex items-center gap-2">
                          {data.product_type && (() => {
                            const selected = productTypes.find(p => p.value === data.product_type);
                            const Icon = selected?.icon || FaTag;
                            return <Icon className={`h-4 w-4 ${selected?.color || 'text-gray-500'}`} />;
                          })()}
                          <span className={data.product_type ? 'text-ink' : 'text-text-soft'}>
                            {data.product_type ? productTypes.find(p => p.value === data.product_type)?.label : 'Select product type'}
                          </span>
                        </div>
                        <FaChevronDown
                          className={`h-5 w-5 text-text-soft transition-transform ${showProductTypeDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {showProductTypeDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                          {productTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => {
                                  setData('product_type', type.value);
                                  setShowProductTypeDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${
                                  data.product_type === type.value ? 'bg-marigold/10 text-marigold' : 'text-ink'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className={`h-4 w-4 ${type.color}`} />
                                  <span>{type.label}</span>
                                </div>
                                {data.product_type === type.value && <HiCheck className="h-5 w-5 text-marigold" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-text-soft mt-1">
                      Select how this product should be displayed (Featured, Trending, Top Selling, New Arrival, or Regular)
                    </p>
                    {errors.product_type && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                        {errors.product_type}
                      </p>
                    )}
                  </div>

                  {/* Row 4: Quantity and Colors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div>
                      <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                        <FaHashtag className="h-4 w-4 text-marigold" />
                        Quantity <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                        <input
                          type="number"
                          min="0"
                          value={data.quantity}
                          onChange={(e) => handleNumberInput(e, 'quantity')}
                          className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink"
                        />
                      </div>
                      {errors.quantity && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    {/* Colors */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Colors <span className="text-xs font-normal text-text-soft">(Add multiple)</span>
                      </label>

                      <div className="space-y-2">
                        {colorInputs.map((color, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="relative flex-1">
                              <FaPalette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => updateColorInput(index, e.target.value)}
                                placeholder="Enter color name..."
                                className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                              />
                            </div>

                            {index === colorInputs.length - 1 ? (
                              <button
                                type="button"
                                onClick={addColorInput}
                                className="px-4 py-3 bg-marigold text-white font-medium rounded-xl hover:bg-marigold-dark transition-colors flex items-center gap-2 hover:shadow-lg"
                              >
                                <FaPlus className="h-4 w-4" />
                                Add
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeColorInput(index)}
                                className="px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <FaTimes className="h-4 w-4" />
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {getValidColors().length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-ink">
                              Added Colors ({getValidColors().length})
                            </span>
                            <button
                              type="button"
                              onClick={() => setColorInputs([''])}
                              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTimes className="h-3 w-3" />
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getValidColors().map((color, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-paper-dim border border-line rounded-xl"
                              >
                                <span className="text-sm font-medium text-ink">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.color && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.color}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Item Weight */}
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                      <FaWeightHanging className="h-4 w-4 text-marigold" />
                      Item Weight (kg) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FaWeightHanging className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={data.item_weight}
                        onChange={(e) => handleNumberInput(e, 'item_weight')}
                        placeholder="0.5"
                        className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                      />
                    </div>
                    {errors.item_weight && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                        {errors.item_weight}
                      </p>
                    )}
                    <p className="text-xs text-text-soft mt-1">
                      Used for shipping cost calculation (minimum 0.1 kg)
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaDollarSign className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Pricing</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Regular Price */}
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Regular Price <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.regular_price}
                          onChange={(e) => handleNumberInput(e, 'regular_price')}
                          placeholder="99.99"
                          className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                        />
                      </div>
                      {errors.regular_price && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.regular_price}
                        </p>
                      )}
                    </div>

                    {/* Sale Price */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-ink flex items-center gap-2">
                          <FaPercent className="h-4 w-4 text-marigold" />
                          Sale Price
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="enable_sale"
                            checked={showSalePrice}
                            onChange={(e) => {
                              setShowSalePrice(e.target.checked);
                              if (!e.target.checked) setData('sale_price', '');
                            }}
                            className="h-4 w-4 rounded border-line text-marigold focus:ring-marigold"
                          />
                          <label htmlFor="enable_sale" className="text-sm text-text-soft">
                            Enable
                          </label>
                        </div>
                      </div>

                      {showSalePrice && (
                        <div>
                          <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max={parseFloat(data.regular_price) || undefined}
                              value={data.sale_price}
                              onChange={(e) => handleNumberInput(e, 'sale_price')}
                              placeholder="79.99"
                              className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                            />
                          </div>
                          {data.regular_price && data.sale_price && discountPercentage > 0 && (
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FaPercent className="h-3 w-3 mr-1" />
                                Save {discountPercentage}%
                              </span>
                              <span className="text-sm text-text-soft">
                                Save ${(parseFloat(data.regular_price) - parseFloat(data.sale_price)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {errors.sale_price && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                              <HiOutlineExclamationCircle className="h-4 w-4" />
                              {errors.sale_price}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rich Description Card with Quill.js */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaBookOpen className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Product Description</h2>
                </div>

                <div>
                  <ReactQuill
                    theme="snow"
                    value={data.description}
                    onChange={(value) => setData('description', value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe your product features, specifications, and benefits..."
                    className="h-64 mb-12"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-text-soft">
                      <span className="font-medium text-ink">{data.description.replace(/<[^>]*>/g, '').length}</span> characters (plain text)
                    </p>
                    <p className="text-xs text-text-soft">
                      Use the toolbar to format your text with rich styling
                    </p>
                  </div>
                </div>

                {errors.description && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Images Upload Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaImage className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Product Images</h2>
                </div>

                <div>
                  <input
                    ref={imagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-ink mb-3">Existing Images</h3>
                    {existingImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {existingImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={`/storage/${img}`}
                              alt={`Product ${i + 1}`}
                              className="w-full h-32 object-cover rounded-xl group-hover:opacity-75 transition-opacity border border-line"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(i, img)}
                              className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              title="Remove image"
                            >
                              <FaTrash className="h-3 w-3" />
                            </button>
                            {imagesToRemove.includes(img) && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-xl flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">Removed</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-soft">No existing images</p>
                    )}
                  </div>

                  <div
                    onClick={() => imagesInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      data.images.length === 0
                        ? 'border-line hover:border-marigold hover:bg-marigold/5'
                        : 'border-line'
                    }`}
                  >
                    {data.images.length === 0 ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-marigold/10 flex items-center justify-center">
                          <FaUpload className="h-10 w-10 text-marigold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">Click to add more images</p>
                          <p className="text-xs text-text-soft mt-1">PNG, JPG up to 5MB each</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-ink">New Images to Add</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviews.slice(existingImages.length).map((preview, i) => (
                            <div key={i + existingImages.length} className="relative group">
                              <img
                                src={preview}
                                alt={`New image ${i + 1}`}
                                className="w-full h-32 object-cover rounded-xl group-hover:opacity-75 transition-opacity border border-line"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNewImage(i + existingImages.length);
                                }}
                                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                title="Remove new image"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-text-soft">Click to add more images</p>
                      </div>
                    )}
                  </div>

                  {imagesToRemove.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-sm text-yellow-800">
                        <FaInfoCircle className="inline h-4 w-4 mr-1" />
                        {imagesToRemove.length} image(s) will be removed on update
                      </p>
                    </div>
                  )}

                  {data.images.length > 0 && (
                    <p className="text-xs text-text-soft mt-3 flex items-center gap-1">
                      <FaImage className="h-3 w-3 text-marigold" />
                      {data.images.length} new image(s) to add
                    </p>
                  )}
                  {errors.images && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <HiOutlineExclamationCircle className="h-4 w-4" />
                      {errors.images}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Status Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaShoppingCart className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Stock Status</h2>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={data.inStock}
                    onChange={(e) => setData('inStock', e.target.checked)}
                    className="h-5 w-5 rounded border-line text-marigold focus:ring-marigold"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium text-ink flex items-center gap-2">
                    <FaBox className="h-4 w-4 text-marigold" />
                    In Stock
                  </label>
                </div>
                {errors.inStock && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.inStock}
                  </p>
                )}
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
                  <FaEye className="h-5 w-5 text-marigold" />
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Product Preview</h2>
                </div>

                <div className="space-y-4">
                  <div className="border border-line rounded-xl overflow-hidden group hover:shadow-hard-sm transition-shadow">
                    {imagePreviews[0] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[0]}
                          alt="Product preview"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discountPercentage > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            -{discountPercentage}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-paper-dim flex items-center justify-center group-hover:bg-paper-dim/80 transition-colors">
                        <FaBox className="h-16 w-16 text-text-soft" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-ink truncate">
                        {data.name || 'Product Name'}
                      </h3>

                      <div className="space-y-2 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {data.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-marigold/10 text-marigold">
                              {data.category}
                            </span>
                          )}
                          {data.subcategory && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {data.subcategory}
                            </span>
                          )}
                          {data.brand && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {data.brand}
                            </span>
                          )}
                        </div>

                        {getValidColors().length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {getValidColors().slice(0, 3).map((color, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-paper-dim text-ink border border-line"
                              >
                                {color}
                              </span>
                            ))}
                            {getValidColors().length > 3 && (
                              <span className="text-xs text-text-soft">
                                +{getValidColors().length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        {data.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-marigold">
                              ${parseFloat(data.sale_price).toFixed(2)}
                            </span>
                            <span className="text-sm text-text-soft line-through">
                              ${parseFloat(data.regular_price).toFixed(2)}
                            </span>
                          </div>
                        ) : data.regular_price ? (
                          <span className="text-xl font-bold text-ink">
                            ${parseFloat(data.regular_price).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-text-soft">
                            $0.00
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          data.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {data.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-xs text-text-soft">
                          Qty: {data.quantity || 0}
                        </span>
                      </div>

                      {data.slug && (
                        <div className="mt-2 text-xs text-text-soft truncate flex items-center gap-1">
                          <FaLink className="h-3 w-3" />
                          {data.slug}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-soft flex items-center gap-2">
                          <FaStore className="h-3 w-3 text-marigold" />
                          Store
                        </span>
                        <span className="font-medium text-ink">{store.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-soft flex items-center gap-2">
                          <FaBox className="h-3 w-3 text-marigold" />
                          Categories
                        </span>
                        <div className="text-right">
                          <div className="font-medium text-ink">{data.category || 'None'}</div>
                          {data.subcategory && (
                            <div className="text-xs text-text-soft">{data.subcategory}</div>
                          )}
                          {data.brand && (
                            <div className="text-xs text-text-soft">Brand: {data.brand}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <button
                  type="submit"
                  disabled={processing || !data.name || !data.category || !data.regular_price || !data.description || !data.item_weight}
                  className="w-full bg-gray-900 hover:bg-marigold text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <FaEdit className="h-4 w-4" />
                      Update Product
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-line">
                  <div className="text-xs text-text-soft space-y-2">
                    <p className="flex items-center gap-2">
                      <FaInfoCircle className="h-3 w-3 text-marigold" />
                      <span>Product will be updated in: <span className="font-medium text-ink">{store.name}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <HiOutlineExclamationCircle className="h-3 w-3" />
                      <span>All required fields marked with * must be filled</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaWeightHanging className="h-3 w-3 text-marigold" />
                      <span>Item weight is required for shipping calculation</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPercent className="h-3 w-3 text-marigold" />
                      <span>Sale price is optional but recommended for promotions</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaImage className="h-3 w-3 text-marigold" />
                      <span>High-quality images increase conversion by up to 30%</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaBookOpen className="h-3 w-3 text-marigold" />
                      <span>Rich text editor allows formatted product descriptions</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaLink className="h-3 w-3 text-marigold" />
                      <span>Slug auto-generates from name — edit it manually to lock</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
