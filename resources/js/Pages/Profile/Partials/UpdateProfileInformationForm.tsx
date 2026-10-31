import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef, useEffect } from 'react';
import { FaUserEdit, FaCheckCircle, FaExclamationTriangle, FaCamera, FaUser, FaTruck, FaMapMarkerAlt, FaCity, FaBuilding } from 'react-icons/fa';
import axios from 'axios';
import { User, citytypes, zonetypes, areatypes } from '@/types';

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

  // Agents carry KYC columns. Customers carry Pathao delivery shipping columns.
  const isAgent = user.role === 'agent';

  const [cities, setCities] = useState<citytypes[]>([]);
  const [zones, setZones] = useState<zonetypes[]>([]);
  const [areas, setAreas] = useState<areatypes[]>([]);

  const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
    _method: 'PATCH',
    name: user.name,
    email: user.email,
    mobile: user.mobile ?? user.phone ?? '',
    national_id: user.national_id ?? '',
    address: user.address ?? '',
    city_id: user.city_id ?? '',
    city_name: user.city_name ?? '',
    zone_id: user.zone_id ?? '',
    zone_name: user.zone_name ?? '',
    area_id: user.area_id ?? '',
    area_name: user.area_name ?? '',
    image: null as File | null,
  });

  // Sync form state if the user prop updates (e.g. after save or page refresh)
  useEffect(() => {
    setData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      mobile: user.mobile ?? user.phone ?? '',
      national_id: user.national_id ?? '',
      address: user.address ?? '',
      city_id: user.city_id ?? '',
      city_name: user.city_name ?? '',
      zone_id: user.zone_id ?? '',
      zone_name: user.zone_name ?? '',
      area_id: user.area_id ?? '',
      area_name: user.area_name ?? '',
    }));
    if (user.images) {
      setImagePreview(user.images.startsWith('http') ? user.images : `/storage/${user.images}`);
    } else {
      setImagePreview(null);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    axios.get('/api/pathao/cities')
      .then((res) => {
        if (!active) return;
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setCities(list.map((c: any) => ({
          city_id: c.city_id,
          city_name: c.city_name,
        })));
      })
      .catch(() => {});

    if (user.city_id) {
      axios.get(`/api/pathao/zones/${user.city_id}`)
        .then((res) => {
          if (!active) return;
          const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
          setZones(list.map((z: any) => ({
            zone_id: z.zone_id,
            zone_name: z.zone_name,
          })));
        })
        .catch(() => {});
    }

    if (user.zone_id) {
      axios.get(`/api/pathao/areas/${user.zone_id}`)
        .then((res) => {
          if (!active) return;
          const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
          setAreas(list.map((a: any) => ({
            area_id: a.area_id,
            area_name: a.area_name,
          })));
        })
        .catch(() => {});
    }

    return () => { active = false; };
  }, [user.city_id, user.zone_id]);

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const selected = cities.find(c => String(c.city_id) === String(cityId));
    setData(prev => ({
      ...prev,
      city_id: cityId ? Number(cityId) : '',
      city_name: selected?.city_name || '',
      zone_id: '',
      zone_name: '',
      area_id: '',
      area_name: '',
    }));
    setZones([]);
    setAreas([]);

    if (cityId) {
      try {
        const res = await axios.get(`/api/pathao/zones/${cityId}`);
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setZones(list.map((z: any) => ({
          zone_id: z.zone_id,
          zone_name: z.zone_name,
        })));
      } catch {}
    }
  };

  const handleZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = e.target.value;
    const selected = zones.find(z => String(z.zone_id) === String(zoneId));
    setData(prev => ({
      ...prev,
      zone_id: zoneId ? Number(zoneId) : '',
      zone_name: selected?.zone_name || '',
      area_id: '',
      area_name: '',
    }));
    setAreas([]);

    if (zoneId) {
      try {
        const res = await axios.get(`/api/pathao/areas/${zoneId}`);
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setAreas(list.map((a: any) => ({
          area_id: a.area_id,
          area_name: a.area_name,
        })));
      } catch {}
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    const selected = areas.find(a => String(a.area_id) === String(areaId));
    setData(prev => ({
      ...prev,
      area_id: areaId ? Number(areaId) : '',
      area_name: selected?.area_name || '',
    }));
  };

    const getProfileImageUrl = () => {
        // Priority 1: Image preview during upload
        if (imagePreview) return imagePreview;

        // Priority 2: Try storage path first
        if (useStorage && user.images) {
            return user.images.startsWith('http')
              ? user.images
              : `/storage/${user.images}`;
        }

        // Priority 3: If storage failed but user.images exists (maybe it's a URL)
        if (!useStorage && user.images) {
            return user.images;
        }

        // No image available
        return '/placeholder.png';
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
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-marigold/10">
          <FaUserEdit className="h-6 w-6 text-marigold-dark" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-ink">Profile Information</h3>
          <p className="text-text-soft text-sm mt-1">Update your personal details and email address</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="bg-paper-dim border border-line rounded-2xl p-6">
          <h4 className="text-sm font-semibold text-ink mb-4">Profile Picture</h4>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white ring-4 ring-marigold/20 border-2 border-line shadow-hard-sm">
                <img
                  src={getProfileImageUrl()}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith('/placeholder.png')) {
                      target.src = '/placeholder.png';
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processing}
                className="absolute bottom-0 right-0 w-7 h-7 bg-ink rounded-full flex items-center justify-center text-white hover:bg-ink/90 transition-colors disabled:opacity-50 shadow-md"
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
              <p className="text-sm font-medium text-ink">Upload new picture (Optional)</p>
              <p className="text-xs text-text-soft mt-1">JPG, PNG, GIF, WEBP up to 2MB</p>
              {data.image && (
                <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <FaCheckCircle className="w-3 h-3 text-emerald-600" />
                  {data.image.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 group-hover:border-ink/30 text-sm font-body"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-3.5 w-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 group-hover:border-ink/30 text-sm font-body"
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <div className="absolute right-3 top-3">
                <FaExclamationTriangle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-3.5 w-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Seller details — agents only, written to the `agents` table */}
        {isAgent && (
          <div className="bg-paper-dim border border-line rounded-2xl p-6 space-y-5">
            <div>
              <h4 className="text-sm font-display font-bold text-ink">Seller KYC Details</h4>
              <p className="text-xs text-text-soft mt-0.5">
                Required for store operations and merchant payout verification.
              </p>
            </div>

            <div className="group">
              <label htmlFor="mobile" className="block text-sm font-semibold text-ink mb-1.5">
                Mobile Number (bKash / Nagad)
              </label>
              <input
                id="mobile"
                type="tel"
                value={data.mobile}
                onChange={(e) => setData('mobile', e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 group-hover:border-ink/30 text-sm font-body"
                placeholder="01XXXXXXXXX"
              />
              {errors.mobile && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="group">
              <label htmlFor="national_id" className="block text-sm font-semibold text-ink mb-1.5">
                National ID (NID)
              </label>
              <input
                id="national_id"
                type="text"
                inputMode="numeric"
                value={data.national_id}
                onChange={(e) => setData('national_id', e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 group-hover:border-ink/30 text-sm font-body"
                placeholder="10, 13, or 17 digit NID number"
              />
              {errors.national_id && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  {errors.national_id}
                </p>
              )}
            </div>

            <div className="group">
              <label htmlFor="address" className="block text-sm font-semibold text-ink mb-1.5">
                Shop / Pickup Address
              </label>
              <textarea
                id="address"
                rows={3}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 group-hover:border-ink/30 resize-y text-sm font-body"
                placeholder="Shop number, market, road, area, city"
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Customer delivery address & shipping location — customers only */}
        {!isAgent && (
          <div className="bg-paper-dim border border-line rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <div className="p-2 rounded-lg bg-marigold/10 text-marigold-dark">
                <FaTruck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-ink">Delivery Address & Pathao Shipping</h4>
                <p className="text-xs text-text-soft mt-0.5">
                  Used by Pathao to calculate delivery charges from the merchant's store directly to your home.
                </p>
              </div>
            </div>

            <div className="group">
              <label htmlFor="user_mobile" className="block text-sm font-semibold text-ink mb-1.5">
                Mobile Number
              </label>
              <input
                id="user_mobile"
                type="tel"
                value={data.mobile}
                onChange={(e) => setData('mobile', e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 text-sm font-body"
                placeholder="01XXXXXXXXX"
              />
              {errors.mobile && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_city_id" className="block text-sm font-semibold text-ink mb-1.5">
                  Delivery City
                </label>
                <select
                  id="user_city_id"
                  value={data.city_id}
                  onChange={handleCityChange}
                  className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 text-sm font-body"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                  ))}
                </select>
                {errors.city_id && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.city_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="user_zone_id" className="block text-sm font-semibold text-ink mb-1.5">
                  Delivery Zone / Thana
                </label>
                <select
                  id="user_zone_id"
                  value={data.zone_id}
                  onChange={handleZoneChange}
                  disabled={!data.city_id}
                  className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 text-sm font-body disabled:opacity-50"
                >
                  <option value="">Select Zone</option>
                  {zones.map((z) => (
                    <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>
                  ))}
                </select>
                {errors.zone_id && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.zone_id}</p>
                )}
              </div>
            </div>

            {areas.length > 0 && (
              <div>
                <label htmlFor="user_area_id" className="block text-sm font-semibold text-ink mb-1.5">
                  Specific Area (Optional)
                </label>
                <select
                  id="user_area_id"
                  value={data.area_id}
                  onChange={handleAreaChange}
                  className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 text-sm font-body"
                >
                  <option value="">Select Area (Optional)</option>
                  {areas.map((a) => (
                    <option key={a.area_id} value={a.area_id}>{a.area_name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="group">
              <label htmlFor="user_street_address" className="block text-sm font-semibold text-ink mb-1.5">
                Detailed Delivery Address
              </label>
              <textarea
                id="user_street_address"
                rows={3}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 resize-y text-sm font-body"
                placeholder="House #, Road #, Sector/Area, Landmark"
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-line">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-ink hover:bg-ink/90 text-white font-body font-bold uppercase tracking-wider rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaCheckCircle className="h-4 w-4 text-marigold" />
                Save Changes
              </>
            )}
          </button>

          {recentlySuccessful && (
            <span className="text-emerald-700 font-semibold flex items-center gap-2 text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
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
            <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-hard-lg border border-line transition-all">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-marigold/10 text-marigold-dark">
                    <FaCheckCircle className="h-6 w-6 text-marigold" />
                  </div>
                  <Dialog.Title className="mt-4 text-lg font-display font-bold text-ink">
                    Profile Updated
                  </Dialog.Title>
                  <p className="mt-2 text-xs text-text-soft">
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
