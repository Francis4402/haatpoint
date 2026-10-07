// CreateStoreForm.tsx
import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import {
  FaStore,
  FaTag,
  FaImage,
  FaFileAlt,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaArrowLeft,
  FaInfoCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaCertificate,
  FaCheck,
  FaPlus,
  FaKey,
  FaIdCard,
  FaUser,
  FaMobile,
  FaMobileAlt
} from 'react-icons/fa';
import {
  HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { FaAddressBook } from "react-icons/fa6";
import { toast } from 'sonner';
import Eyebrow from '@/Pages/Components/Eyebrow';


const STORE_TYPES = [
  'Retail Store',
  'E-commerce',
  'Wholesale',
  'Service Provider',
  'Food & Beverage',
  'Fashion & Apparel',
  'Electronics',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Fitness',
  'Books & Media',
  'Arts & Crafts',
  'Automotive',
  'Jewelry',
  'Other'
];

export default function CreateStoreForm({auth}: PageProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    logo: null as File | null,
    storetype: '',
    address: '',
    license: '',
    national_id: '',
    mobile: ''
  });

  // useForm types `errors` from the field list above, so the controller's
  // generic `error` key is not on the inferred type. Read it through a widened
  // view rather than casting at each use site.
  const formErrors = errors as Record<string, string | undefined>;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo must be less than 5MB');
      e.target.value = '';
      return;
    }

    setData('logo', file);
        const preview = URL.createObjectURL(file);
        setLogoPreview(preview);
        toast.success('Logo uploaded successfully!');
    };

    const removeLogo = () => {
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        setData('logo', null);
        toast.info('Logo removed.');
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('stores.store'), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Store created successfully!');
        router.visit(route('dashboard.store'));
        reset();
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        setShowStoreTypeDropdown(false);
        setData({
          name: '',
          logo: null,
          storetype: '',
          address: '',
          license: '',
          national_id: '',
          mobile: ''
        });
      },
      onError: () => {
        toast.error('Failed to create store. Please check the form for errors.');
      }
    });
  };

  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, []);

  return (
    <DashboardLayout user={auth.user}>
      <Head title='Create Store'>
        <meta name="description" content="Create your online store to start selling products" />
        <meta name="keywords" content="store, ecommerce, create store, online business" />
      </Head>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Eyebrow>Start your online business</Eyebrow>
            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Create Your Store</h1>
            <p className="text-text-soft mt-1">Set up your online store to start selling products</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300"
          >
            <FaArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* The controller's business-rule guards (unverified address, invalid
              National ID on the account, store limit) answer with a generic
              `error` key rather than a field name, so they used to land in the
              error bag where no input renders them: the submit looked ignored. */}
          {formErrors.error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <HiOutlineExclamationCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <span>{formErrors.error}</span>
            </div>
          )}

          {/* Store Information Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
              <FaBuilding className="h-5 w-5 text-marigold" />
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Store Information</h2>
            </div>

            <div className="space-y-6">
              {/* Store Name */}
              <div>
                <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                  <FaTag className="h-4 w-4 text-marigold" />
                  Store Name <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g., My Awesome Store"
                    className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    disabled={processing}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Choose a unique name that represents your brand
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                  <FaAddressBook className="h-4 w-4 text-marigold" />
                  Address <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Address of your store"
                    className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    disabled={processing}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.address}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Enter the full address of your store
                </p>
              </div>

              {/* Mobile */}
              <div>
                <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                  <FaMobile className="h-4 w-4 text-marigold" />
                  Mobile <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                  <input
                    type="tel"
                    value={data.mobile}
                    onChange={(e) => setData('mobile', e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    disabled={processing}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.mobile}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Enter your mobile number
                </p>
              </div>

              {/* Store Type */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Store Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStoreTypeDropdown(!showStoreTypeDropdown)}
                    className="w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white"
                    disabled={processing}
                  >
                    <span className={data.storetype ? 'text-ink' : 'text-text-soft'}>
                      {data.storetype || 'Select store type'}
                    </span>
                    <FaCheck className="h-5 w-5 text-text-soft" />
                  </button>

                  {showStoreTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto">
                      {STORE_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setData('storetype', type);
                            setShowStoreTypeDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${
                            data.storetype === type ? 'bg-marigold/10 text-marigold' : 'text-ink'
                          }`}
                        >
                          {type}
                          {data.storetype === type && <FaCheckCircle className="h-5 w-5 text-marigold" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.storetype && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.storetype}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1">
                  Select the category that best describes your business
                </p>
              </div>
            </div>
          </div>

          {/* Store Logo Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
              <FaImage className="h-5 w-5 text-marigold" />
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Store Logo</h2>
              <span className="ml-2 text-xs text-text-soft">(Optional)</span>
            </div>

            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={processing}
              />

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Logo Preview */}
                <div className="flex-1">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      !logoPreview
                        ? 'border-line hover:border-marigold hover:bg-marigold/5'
                        : 'border-line'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {!logoPreview ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-marigold/10 flex items-center justify-center">
                          <FaUpload className="h-10 w-10 text-marigold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">Upload Store Logo</p>
                          <p className="text-xs text-text-soft mt-1">Any image format accepted</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative group inline-block">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-40 h-40 object-contain mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLogo();
                            }}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            disabled={processing}
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-text-soft">Click to change logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Requirements */}
                <div className="flex-1">
                  <div className="bg-paper-dim rounded-xl p-4 border border-line">
                    <h3 className="text-sm font-medium text-ink mb-2 flex items-center gap-2">
                      <FaInfoCircle className="h-4 w-4 text-marigold" />
                      Logo Tips
                    </h3>
                    <ul className="text-xs text-text-soft space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                        Square or circle format works best
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                        Transparent background recommended
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                        High contrast for better visibility
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                        All image formats accepted
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {errors.logo && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <HiOutlineExclamationCircle className="h-4 w-4" />
                  {errors.logo}
                </p>
              )}
            </div>
          </div>

          {/* Business License Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
              <FaCertificate className="h-5 w-5 text-marigold" />
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Business License</h2>
              <span className="ml-2 text-xs text-text-soft">(Optional)</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                  <FaKey className="h-4 w-4 text-marigold" />
                  License Number
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                  <input
                    type="text"
                    value={data.license}
                    onChange={(e) => setData('license', e.target.value)}
                    placeholder="e.g., LIC-12345-ABCDE"
                    className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    disabled={processing}
                  />
                </div>
                {errors.license && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.license}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Enter your official business license number
                </p>
              </div>

              {/* License Information */}
              <div className="bg-paper-dim rounded-xl p-4 border border-line">
                <h3 className="text-sm font-medium text-ink mb-2 flex items-center gap-2">
                  <FaInfoCircle className="h-4 w-4 text-marigold" />
                  Why Provide License Number?
                </h3>
                <ul className="text-xs text-text-soft space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Builds trust with customers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Required for certain product categories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Enables special business features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Helps with payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Your information is securely stored
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* National ID Verification Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
              <FaIdCard className="h-5 w-5 text-marigold" />
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">National ID Verification</h2>
              <span className="ml-2 text-xs text-red-500">(Required)</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink mb-2 flex items-center gap-1">
                  <FaUser className="h-4 w-4 text-marigold" />
                  National ID Number <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                  <input
                    type="text"
                    value={data.national_id}
                    onChange={(e) => setData('national_id', e.target.value)}
                    placeholder="e.g., 1234567890123"
                    className="w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    disabled={processing}
                  />
                </div>
                {errors.national_id && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.national_id}
                  </p>
                )}
                <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                  <FaInfoCircle className="h-3 w-3" />
                  Enter your government-issued National ID number
                </p>
              </div>

              {/* National ID Information */}
              <div className="bg-paper-dim rounded-xl p-4 border border-line">
                <h3 className="text-sm font-medium text-ink mb-2 flex items-center gap-2">
                  <FaInfoCircle className="h-4 w-4 text-marigold" />
                  Why We Need Your National ID?
                </h3>
                <ul className="text-xs text-text-soft space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Identity verification for store ownership
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Required by government regulations for businesses
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Prevents fraudulent store creation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Secure payment processing compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-marigold" />
                    Your data is encrypted and protected
                  </li>
                </ul>
                <div className="mt-3 pt-3 border-t border-line">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700">
                      This information is required for store verification and will be used solely for identity verification purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Preview Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
              <FaCheckCircle className="h-5 w-5 text-marigold" />
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Store Preview</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-line rounded-xl bg-paper-dim">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Store logo"
                    className="w-16 h-16 rounded-xl object-cover border border-line"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-marigold/10 flex items-center justify-center">
                    <FaStore className="h-8 w-8 text-marigold" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-ink">
                    {data.name || 'Your Store Name'}
                  </h3>
                  {data.storetype && (
                    <p className="text-sm text-text-soft">{data.storetype}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-line rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStore className="h-4 w-4 text-marigold" />
                    <h4 className="text-sm font-medium text-ink">Store Status</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">Ready to Activate</span>
                  </div>
                </div>

                <div className="p-4 border border-line rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCertificate className="h-4 w-4 text-marigold" />
                    <h4 className="text-sm font-medium text-ink">Verification</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${data.license ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className={`text-sm font-medium ${data.license ? 'text-green-600' : 'text-yellow-600'}`}>
                      {data.license ? 'Licensed' : 'Unlicensed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gray-900 hover:bg-marigold text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Creating Your Store...
                </>
              ) : (
                <>
                  <FaPlus className="h-4 w-4" />
                  Create Store
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-line">
              <div className="text-xs text-text-soft space-y-2">
                <p className="flex items-center gap-2">
                  <FaInfoCircle className="h-3 w-3 text-marigold" />
                  <span>Store name must be unique across the platform</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaExclamationTriangle className="h-3 w-3 text-orange-500" />
                  <span>You can only have one active store per account</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle className="h-3 w-3 text-green-500" />
                  <span>After creation, you can add products immediately</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCertificate className="h-3 w-3 text-marigold" />
                  <span>License verification may take 1-2 business days</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
