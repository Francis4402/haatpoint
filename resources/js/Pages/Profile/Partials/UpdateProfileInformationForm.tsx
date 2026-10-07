import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';
import { FaUserEdit, FaCheckCircle, FaExclamationTriangle, FaCamera, FaUser } from 'react-icons/fa';
import { User } from '@/types';

interface Props {
  status?: string;
  user: User
}

export default function UpdateProfileInformation({ status, user }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.images ? `/storage/${user.images}` : null
  );

    const [useStorage, setUseStorage] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Agents carry KYC columns the other roles do not have. One form serves all
  // of them, so the extra block is rendered conditionally rather than split
  // into a second profile page.
  const isAgent = user.role === 'agent';

  const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
    _method: 'PATCH',
    name: user.name,
    email: user.email,
    mobile: user.mobile ?? '',
    national_id: user.national_id ?? '',
    address: user.address ?? '',
    image: null as File | null,
  });

    const getProfileImageUrl = () => {
        // Priority 1: Image preview during upload
        if (imagePreview) return imagePreview;

        // Priority 2: Try storage path first
        if (useStorage && user.images) {
            return `/storage/${user.images}`;
        }

        // Priority 3: If storage failed but user.images exists (maybe it's a URL)
        if (!useStorage && user.images) {
            return user.images;
        }

        // No image available
        return 'https://github.com/shadcn.png';
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setData('image', file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('profile.update'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setShowSuccessModal(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setShowSuccessModal(false), 2000);
      }
    });
    reset();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-blue-100">
          <FaUserEdit className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
          <p className="text-gray-600 mt-1">Update your personal details and email address</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Profile Picture</h4>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                {user.images && useStorage ? (
                    <img
                        src={getProfileImageUrl()}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={() => setUseStorage(false)}
                    />
                ) : (
                    <FaUser className="w-full h-full text-gray-400 items-center justify-center p-4" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processing}
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg"
              >
                <FaCamera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Upload new picture</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WEBP up to 2MB</p>
              {data.image && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FaCheckCircle className="w-3 h-3" />
                  {data.image.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Seller details — agents only, written to the `agents` table */}
        {isAgent && (
          <div className="bg-gray-50 rounded-xl p-6 space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Seller details</h4>
              <p className="text-xs text-gray-500 mt-1">
                Required before a store can be opened. Saved here exactly as the verification check reads them.
              </p>
            </div>

            <div className="group">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile number
              </label>
              <input
                id="mobile"
                type="tel"
                value={data.mobile}
                onChange={(e) => setData('mobile', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
                placeholder="01XXXXXXXXX"
              />
              {errors.mobile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-4 w-4" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="group">
              <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 mb-2">
                National ID
              </label>
              <input
                id="national_id"
                type="text"
                inputMode="numeric"
                value={data.national_id}
                onChange={(e) => setData('national_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400"
                placeholder="10 or 17 digit number"
              />
              {errors.national_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-4 w-4" />
                  {errors.national_id}
                </p>
              )}
            </div>

            <div className="group">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400 resize-y"
                placeholder="House, road, city"
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-4 w-4" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaCheckCircle className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>

          {recentlySuccessful && (
            <span className="text-green-600 font-medium flex items-center gap-2">
              <FaCheckCircle className="h-5 w-5" />
              Profile updated successfully
            </span>
          )}
        </div>
      </form>

      {/* Success Modal */}
      <Transition show={showSuccessModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <Dialog.Title className="mt-4 text-lg font-medium text-gray-900">
                    Profile Updated
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-gray-500">
                    Your profile information has been successfully updated.
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
