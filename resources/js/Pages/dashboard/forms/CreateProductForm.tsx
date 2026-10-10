// CreateProductForm.tsx
import DashboardLayout from '@/Layouts/DashboardLayout';
import { categoryType, storeType } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
  FaFileAlt,
  FaImage,
  FaBox,
  FaTag,
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
  FaCheck,
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
} from 'react-icons/fa';
import {
  HiCheck,
  HiOutlineExclamationCircle,
  HiXMark,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface productFormType {
    auth: {
        user: any;
    };
    store: storeType;
    stores?: storeType[];
    categories: categoryType[];
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
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

export default function CreateProductForm({auth, store, stores = [], categories}: productFormType) {
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showSalePrice, setShowSalePrice] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [colorInputs, setColorInputs] = useState<string[]>(['']);
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [newBrandValue, setNewBrandValue] = useState('');

  const [sizeInput, setSizeInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ Track manual slug edits (state so hint re-renders live)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const productTypes = [
    { value: 'regular', label: 'Regular', icon: FaTag, color: 'text-gray-500' },
    { value: 'featured', label: 'Featured', icon: FaStar, color: 'text-yellow-500' },
    { value: 'trending', label: 'Trending', icon: FaFire, color: 'text-orange-500' },
    { value: 'top-selling', label: 'Top Selling', icon: FaRocket, color: 'text-green-500' },
    { value: 'new-arrival', label: 'New Arrival', icon: FaBox, color: 'text-blue-500' },
  ];

  const { data, setData, processing, errors, reset } = useForm({
    name: '',
    images: [] as File[],
    slug: '',
    category: '',
    subcategory: '',
    brand: '',
    quantity: '1',
    regular_price: '',
    sale_price: '',
    description: '',
    color: [] as string[],
    size: [] as string[],
    inStock: true,
    item_weight: '',
    store_id: store.id || '',
    product_type: 'regular',
  });

  const selectedStore = stores.find((s) => s.id === data.store_id) ?? store;

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

  const parseSizes = (sizeString: string | null | undefined): string[] => {
    if (!sizeString) return [];
    try {
      const parsed = JSON.parse(sizeString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const canAddBrand = ['agent', 'admin', 'superadmin'].includes(auth?.user?.role);

  const toggleSize = (size: string) => {
    setData('size', data.size.includes(size)
      ? data.size.filter((s) => s !== size)
      : [...data.size, size]);
  };

  const addCustomSize = () => {
    const parts = sizeInput
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');
    if (parts.length === 0) return;
    const current = data.size || [];
    const toAdd = parts.filter((part) => !current.includes(part));
    if (toAdd.length === 0) {
      toast.info('Size already added');
      setSizeInput('');
      return;
    }
    setData('size', [...current, ...toAdd]);
    setSizeInput('');
  };

  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowSubcategoryDropdown(false);
    setShowBrandDropdown(false);
    setShowProductTypeDropdown(false);
  };

  // Close any open dropdown when clicking outside the form (mobile friendly:
  // prevents panels from staying open and overlapping one another).
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const validColors = colorInputs.filter(color => color.trim() !== '');
    setData('color', validColors);
  }, [colorInputs]);

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

        const sizes = parseSizes(selectedCat.sizes ?? null);
        setAvailableSizes(sizes);
        setData('size', (data.size || []).filter((s) => sizes.includes(s)));
      }
    } else {
      setAvailableSubcategories([]);
      setAvailableBrands([]);
      setAvailableSizes([]);
      setData('subcategory', '');
      setData('brand', '');
      setData('size', []);
    }
  }, [data.category, categories]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
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
      setImagePreviews(previews);
      toast.success(`${files.length} image(s) uploaded successfully!`, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);

    setData('images', newImages);
    setImagePreviews(newPreviews);
    toast.info('Image removed!');
  };

  // ✅ FIXED submit: use router.post + forceFormData + graceful empty subcategory/brand
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
    formData.append('size', JSON.stringify(data.size));
    formData.append('inStock', data.inStock ? '1' : '0');
    formData.append('store_id', data.store_id);
    formData.append('item_weight', data.item_weight);
    formData.append('product_type', data.product_type);

    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    router.post(route('products.store'), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Product created successfully!');
        router.visit(route('dashboard.products'));
        reset();
        setShowSalePrice(false);
        imagePreviews.forEach(p => {
          if (p.startsWith('blob:')) URL.revokeObjectURL(p);
        });
        setImagePreviews([]);
        setShowCategoryDropdown(false);
        setShowSubcategoryDropdown(false);
        setShowBrandDropdown(false);
        setShowProductTypeDropdown(false);
        setAvailableSubcategories([]);
        setAvailableBrands([]);
        setAvailableSizes([]);
        setColorInputs(['']);
        setShowNewBrandInput(false);
        setNewBrandValue('');
        setSlugManuallyEdited(false);
      },
      onError: (errs) => {
        console.error('Create failed:', errs);
        const firstError = Object.values(errs)[0];
        toast.error(`Failed: ${firstError || 'Please check the form for errors.'}`);
      }
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
      <Head title='Create Product'>
        <meta name="description" content="Create a new product for your store" />
        <meta name="keywords" content="shop, products, create product, ecommerce" />
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Eyebrow>Add new product</Eyebrow>
            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Create Product</h1>
            <p className="text-text-soft mt-1 flex items-center gap-2">
              <FaStore className="h-4 w-4 text-marigold" />
              Add a new product to <span className="font-medium text-ink">{selectedStore.name}</span>
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
                <h3 className="font-display font-extrabold uppercase text-lg">Store Ready!</h3>
                <p className="opacity-90">
                  Products will be added to: <span className="font-semibold">{selectedStore.name}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              <FaCheckCircle className="h-3 w-3 mr-1" />
              Active Store
            </span>
          </div>
          {stores.length > 1 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <label
                htmlFor="create_product_store"
                className="block text-xs font-semibold uppercase tracking-wide opacity-90 mb-2"
              >
                Choose a store
              </label>
              <select
                id="create_product_store"
                name="store_id"
                value={data.store_id}
                onChange={(e) => setData('store_id', e.target.value)}
                className="w-full md:w-1/2 rounded-xl border border-line bg-paper-dim px-4 py-2.5 text-ink focus:ring-2 focus:ring-marigold focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.store_id && (
                <p className="text-xs mt-2 flex items-center gap-1">
                  <HiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.store_id}
                </p>
              )}
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
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
                            const newSlug = generateSlug(data.name);
                            setData('slug', newSlug);
                            setSlugManuallyEdited(false);
                            toast.success('Slug generated!');
                          }}
                          disabled={!data.name}
                          className="px-4 py-3 border border-line rounded-xl hover:bg-paper-dim transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-text-soft hover:text-ink"
                        >
                          <FaArrowRight className="h-4 w-4" />
                          Generate
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
                          onClick={() => {
                            closeAllDropdowns();
                            setShowCategoryDropdown(!showCategoryDropdown);
                          }}
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
                          onClick={() => data.category && availableSubcategories.length > 0 && (() => {
                            closeAllDropdowns();
                            setShowSubcategoryDropdown(!showSubcategoryDropdown);
                          })()}
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
                          onClick={() => data.category && (availableBrands.length > 0 || canAddBrand) && (() => {
                            closeAllDropdowns();
                            setShowBrandDropdown(!showBrandDropdown);
                          })()}
                          disabled={!data.category || (availableBrands.length === 0 && !canAddBrand)}
                          className={`w-full rounded-xl border px-4 py-3 text-left flex justify-between items-center transition-colors ${
                            !data.category || (availableBrands.length === 0 && !canAddBrand)
                              ? 'border-line bg-paper-dim text-text-soft cursor-not-allowed'
                              : 'border-line hover:border-marigold bg-white'
                          }`}
                        >
                          <span className={data.brand ? 'text-ink' : 'text-text-soft'}>
                            {data.brand || (data.category ? (availableBrands.length > 0 || canAddBrand ? 'Select brand' : 'No brands available') : 'Select main category first')}
                          </span>
                          {data.category && (availableBrands.length > 0 || canAddBrand) && (
                            <FaChevronDown
                              className={`h-5 w-5 text-text-soft transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>

                        {data.category && showBrandDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                            {availableBrands.map((brand, index) => (
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
                            ))}

                            {availableBrands.length === 0 && !canAddBrand && (
                              <div className="px-4 py-3 text-sm text-text-soft text-center">
                                No brands available for this category
                              </div>
                            )}

                            {canAddBrand && (
                              <div className="border-t border-line p-3">
                                {showNewBrandInput ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={newBrandValue}
                                      onChange={(e) => setNewBrandValue(e.target.value)}
                                      placeholder="New brand name"
                                      className="flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const value = newBrandValue.trim();
                                        if (!value) return;
                                        setData('brand', value);
                                        setNewBrandValue('');
                                        setShowNewBrandInput(false);
                                        setShowBrandDropdown(false);
                                      }}
                                      className="px-3 py-2 bg-marigold text-white text-sm font-medium rounded-lg hover:bg-marigold-dark transition-colors"
                                    >
                                      Add
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setShowNewBrandInput(true)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-marigold hover:bg-marigold/10 rounded-lg transition-colors"
                                  >
                                    <FaPlus className="h-3 w-3" />
                                    Add new brand
                                  </button>
                                )}
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
                        onClick={() => {
                          closeAllDropdowns();
                          setShowProductTypeDropdown(!showProductTypeDropdown);
                        }}
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

                      {/* Display added colors */}
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

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Sizes <span className="text-xs font-normal text-text-soft">(Select available sizes or add your own)</span>
                    </label>
                    {availableSizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                              data.size.includes(size)
                                ? 'bg-marigold text-white border-marigold'
                                : 'bg-white text-ink border-line hover:border-marigold'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomSize();
                          }
                        }}
                        placeholder={availableSizes.length > 0 ? 'Add sizes, comma separated e.g. S, M, XL' : 'Type sizes e.g. M, XL (comma separated)'}
                        className="flex-1 rounded-xl border border-line bg-white px-4 py-2 text-sm text-ink placeholder:text-text-soft focus:border-marigold focus:outline-none focus:ring-1 focus:ring-marigold"
                      />
                      <button
                        type="button"
                        onClick={addCustomSize}
                        className="px-4 py-2 rounded-xl bg-marigold text-white text-sm font-semibold hover:bg-marigold-dark transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {data.size.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {data.size.map((size) => (
                          <span
                            key={size}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold/10 text-marigold text-sm font-medium"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => toggleSize(size)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <HiXMark className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {errors.size && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                        {errors.size}
                      </p>
                    )}
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
                  <span className="inline-flex items-center rounded-md border border-line bg-paper-dim px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-marigold">
                    BDT
                  </span>
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
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-soft">
                          BDT
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1000000"
                          value={data.regular_price}
                          onChange={(e) => handleNumberInput(e, 'regular_price')}
                          placeholder="99.99"
                          className="w-full rounded-xl border border-line py-3 pl-14 pr-4 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
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
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-soft">
                              BDT
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1000000"
                              value={data.sale_price}
                              onChange={(e) => handleNumberInput(e, 'sale_price')}
                              placeholder="79.99"
                              className="w-full rounded-xl border border-line py-3 pl-14 pr-4 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                            />
                          </div>
                          {data.regular_price && data.sale_price && discountPercentage > 0 && (
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FaPercent className="h-3 w-3 mr-1" />
                                Save {discountPercentage}%
                              </span>
                              <span className="text-sm text-text-soft">
                                Save BDT {(parseFloat(data.regular_price) - parseFloat(data.sale_price)).toFixed(2)}
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
                          <p className="text-sm font-medium text-ink">Click to upload images</p>
                          <p className="text-xs text-text-soft mt-1">PNG, JPG up to 5MB each</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-32 object-cover rounded-xl group-hover:opacity-75 transition-opacity"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(i);
                                }}
                                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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

                  {data.images.length > 0 && (
                    <p className="text-xs text-text-soft mt-3 flex items-center gap-1">
                      <FaImage className="h-3 w-3 text-marigold" />
                      {data.images.length} image(s) selected
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
                        {/* Categories */}
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

                        {/* Colors */}
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

                        {/* Sizes */}
                        {data.size.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {data.size.slice(0, 4).map((size, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-marigold/10 text-marigold border border-marigold/20"
                              >
                                {size}
                              </span>
                            ))}
                            {data.size.length > 4 && (
                              <span className="text-xs text-text-soft">
                                +{data.size.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Weight */}
                        {data.item_weight && (
                          <div className="flex items-center gap-1 text-xs text-text-soft">
                            <FaWeightHanging className="h-3 w-3" />
                            Weight: {data.item_weight} kg
                          </div>
                        )}
                      </div>

                      {/* Price Display */}
                      <div className="mt-2">
                        {data.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-marigold">
                              BDT {parseFloat(data.sale_price).toFixed(2)}
                            </span>
                            <span className="text-sm text-text-soft line-through">
                              BDT {parseFloat(data.regular_price).toFixed(2)}
                            </span>
                          </div>
                        ) : data.regular_price ? (
                          <span className="text-xl font-bold text-ink">
                            BDT {parseFloat(data.regular_price).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-text-soft">
                            BDT 0.00
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
                        <span className="font-medium text-ink">{selectedStore.name}</span>
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
                  className="w-full bg-marigold hover:bg-marigold-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Uploading Product...
                    </>
                  ) : (
                    <>
                      <FaCheck className="h-4 w-4" />
                      Upload Product
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-line">
                  <div className="text-xs text-text-soft space-y-2">
                    <p className="flex items-center gap-2">
                      <FaInfoCircle className="h-3 w-3 text-marigold" />
                      <span>Product will be added to: <span className="font-medium text-ink">{selectedStore.name}</span></span>
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
