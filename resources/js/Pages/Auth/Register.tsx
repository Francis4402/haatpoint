import { useEffect, FormEventHandler, useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
  FaUser,
  FaCamera,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaCity,
  FaBuilding,
  FaInfoCircle,
} from 'react-icons/fa';
import { toast } from 'sonner';
import axios from 'axios';
import SocialButtons from '@/Components/SocialButtons';
import FlashBanner from '@/Components/FlashBanner';
import Recaptcha, { RecaptchaRef } from '@/Components/Recaptcha';
import { citytypes, zonetypes, areatypes } from '@/types';

export default function Register() {
  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city_id: '' as number | string,
    city_name: '',
    zone_id: '' as number | string,
    zone_name: '',
    area_id: '' as number | string,
    area_name: '',
    password: '',
    password_confirmation: '',
    role: '',
    image: null as File | null,
    recaptcha_token: '',
  });

  const recaptchaRef = useRef<RecaptchaRef>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pathao shipping locations
  const [cities, setCities] = useState<citytypes[]>([]);
  const [zones, setZones] = useState<zonetypes[]>([]);
  const [areas, setAreas] = useState<areatypes[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingCities(true);
    axios.get('/api/pathao/cities')
      .then((res) => {
        if (!active) return;
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setCities(list.map((c: any) => ({
          city_id: c.city_id,
          city_name: c.city_name,
        })));
      })
      .catch(() => {
        if (active) toast.error('Failed to load Pathao cities');
      })
      .finally(() => {
        if (active) setLoadingCities(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let strength = 0;
    if (data.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(data.password)) strength += 1;
    if (/[a-z]/.test(data.password)) strength += 1;
    if (/[0-9]/.test(data.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(data.password)) strength += 1;
    setPasswordStrength(strength);
  }, [data.password]);

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const selectedCity = cities.find(c => String(c.city_id) === String(cityId));
    setData(prev => ({
      ...prev,
      city_id: cityId ? Number(cityId) : '',
      city_name: selectedCity?.city_name || '',
      zone_id: '',
      zone_name: '',
      area_id: '',
      area_name: '',
    }));
    setZones([]);
    setAreas([]);

    if (cityId) {
      setLoadingZones(true);
      try {
        const res = await axios.get(`/api/pathao/zones/${cityId}`);
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setZones(list.map((z: any) => ({
          zone_id: z.zone_id,
          zone_name: z.zone_name,
        })));
      } catch {
        toast.error('Failed to load zones for selected city');
      } finally {
        setLoadingZones(false);
      }
    }
  };

  const handleZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = e.target.value;
    const selectedZone = zones.find(z => String(z.zone_id) === String(zoneId));
    setData(prev => ({
      ...prev,
      zone_id: zoneId ? Number(zoneId) : '',
      zone_name: selectedZone?.zone_name || '',
      area_id: '',
      area_name: '',
    }));
    setAreas([]);

    if (zoneId) {
      setLoadingAreas(true);
      try {
        const res = await axios.get(`/api/pathao/areas/${zoneId}`);
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        setAreas(list.map((a: any) => ({
          area_id: a.area_id,
          area_name: a.area_name,
        })));
      } catch {
        // Areas are optional in some zones
      } finally {
        setLoadingAreas(false);
      }
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    const selectedArea = areas.find(a => String(a.area_id) === String(areaId));
    setData(prev => ({
      ...prev,
      area_id: areaId ? Number(areaId) : '',
      area_name: selectedArea?.area_name || '',
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      setData('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData('image', null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.city_id) {
      toast.error('Please select your delivery city.');
      return;
    }
    if (!data.zone_id) {
      toast.error('Please select your delivery zone.');
      return;
    }
    if (!data.address.trim()) {
      toast.error('Please enter your full delivery address.');
      return;
    }
    if (!data.recaptcha_token) {
      setError('recaptcha_token', 'Please complete the reCAPTCHA verification');
      toast.error('Please complete the reCAPTCHA verification');
      document.querySelector('.recaptcha-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    post(route('register'), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Registration Successful! Welcome aboard!');
      },
      onError: (errs) => {
        if (errs && typeof errs === 'object') {
          const first = Object.values(errs)[0];
          toast.error(typeof first === 'string' ? first : 'Registration Failed. Please check the form.');
        } else {
          toast.error('Registration Failed. Please try again.');
        }
      }
    });
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 py-10">
      <Head title="Customer Register - HaatPoint" />

      <div className="w-full max-w-xl">
        {/* Logo & Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center gap-2.5 group">
            <img
              src="/MyLogo.png"
              alt="Haatpoint"
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <h1 className="text-[40px] font-display font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink">
              HaatPoint
            </h1>
          </Link>
          <p className="text-ink/60 mt-2 font-body text-sm">Create your Customer account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ink/10 p-6 sm:p-8">
          <FlashBanner />

          {/* Agent Switcher Banner */}
          <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <span className="font-medium">Want to open a store and sell products?</span>
            <Link
              href={route('agent.register')}
              className="font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Register as Agent</span>
              <FaArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-full bg-paper border-4 border-ink/10 shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/placeholder.png"
                      alt="Profile Placeholder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center shadow-md hover:bg-ink/90 transition-colors"
              >
                <FaCamera className="h-3.5 w-3.5" />
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={triggerFileInput}
              className="mt-2 text-xs font-body font-semibold text-marigold hover:text-marigold-dark transition-colors"
            >
              {imagePreview ? 'Change Photo' : 'Upload Profile Picture (Optional)'}
            </button>
            <p className="text-[11px] font-body text-ink/40">JPEG, PNG or GIF • Max 2MB</p>

            {errors.image && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                {errors.image}
              </p>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-ink/40" />
                </div>
                <input
                  id="name"
                  name="name"
                  value={data.name}
                  autoComplete="name"
                  autoFocus
                  onChange={(e) => setData('name', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body text-sm"
                  placeholder="e.g. Adnan Rahman"
                  required
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-body font-semibold text-ink mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-ink/40" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone / Mobile */}
              <div>
                <label htmlFor="phone" className="block text-sm font-body font-semibold text-ink mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-4 w-4 text-ink/40" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body text-sm"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Pathao Delivery Location & Address Section */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-start gap-2.5 pb-3 border-b border-emerald-200/70">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <FaTruck className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">Delivery Location & Address</h3>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">
                      Pathao Shipping
                    </span>
                  </div>
                  <p className="text-xs text-text-soft mt-0.5">
                    Pathao courier calculates shipping rates based on your living location from the agent's store.
                  </p>
                </div>
              </div>

              {/* City and Zone Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* City */}
                <div>
                  <label htmlFor="city_id" className="block text-xs font-semibold text-ink mb-1 flex items-center justify-between">
                    <span>Delivery City <span className="text-red-500">*</span></span>
                    {loadingCities && <span className="text-[10px] text-emerald-700">Loading cities...</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCity className="h-3.5 w-3.5 text-ink/40" />
                    </div>
                    <select
                      id="city_id"
                      value={data.city_id}
                      onChange={handleCityChange}
                      disabled={loadingCities}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-ink/20 rounded-lg bg-white text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.city_id} value={city.city_id}>
                          {city.city_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.city_id && (
                    <p className="mt-1 text-xs text-red-600">{errors.city_id}</p>
                  )}
                </div>

                {/* Zone */}
                <div>
                  <label htmlFor="zone_id" className="block text-xs font-semibold text-ink mb-1 flex items-center justify-between">
                    <span>Delivery Zone / Thana <span className="text-red-500">*</span></span>
                    {loadingZones && <span className="text-[10px] text-emerald-700">Loading zones...</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-3.5 w-3.5 text-ink/40" />
                    </div>
                    <select
                      id="zone_id"
                      value={data.zone_id}
                      onChange={handleZoneChange}
                      disabled={!data.city_id || loadingZones}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-ink/20 rounded-lg bg-white text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">
                        {!data.city_id ? 'Select city first' : 'Select Zone'}
                      </option>
                      {zones.map((zone) => (
                        <option key={zone.zone_id} value={zone.zone_id}>
                          {zone.zone_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.zone_id && (
                    <p className="mt-1 text-xs text-red-600">{errors.zone_id}</p>
                  )}
                </div>
              </div>

              {/* Area (Optional / if zone has areas) */}
              {areas.length > 0 && (
                <div>
                  <label htmlFor="area_id" className="block text-xs font-semibold text-ink mb-1 flex items-center justify-between">
                    <span>Delivery Area / Sub-area (Optional)</span>
                    {loadingAreas && <span className="text-[10px] text-emerald-700">Loading areas...</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-3.5 w-3.5 text-ink/40" />
                    </div>
                    <select
                      id="area_id"
                      value={data.area_id}
                      onChange={handleAreaChange}
                      disabled={loadingAreas}
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-ink/20 rounded-lg bg-white text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Specific Area (Optional)</option>
                      {areas.map((area) => (
                        <option key={area.area_id} value={area.area_id}>
                          {area.area_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Street Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-ink mb-1">
                  Street / Holding / Flat Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-3.5 w-3.5 text-ink/40" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-ink/20 rounded-lg bg-white text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="e.g. House #12, Road #4, Sector #10, Uttara"
                    required
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <FaExclamationCircle className="h-3 w-3 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-ink/40" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  autoComplete="new-password"
                  onChange={(e) => setData('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body text-sm"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {data.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-body font-medium text-ink/60">
                      Strength: <span className={`font-bold ${
                        passwordStrength <= 1 ? 'text-red-500' :
                        passwordStrength <= 3 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-ink/10 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-ink/40" />
                </div>
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={data.password_confirmation}
                  autoComplete="new-password"
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body text-sm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {data.password_confirmation && data.password !== data.password_confirmation && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  Passwords do not match
                </p>
              )}
              {errors.password_confirmation && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-marigold focus:ring-marigold border-ink/20 rounded bg-paper mt-0.5 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-xs font-body text-ink/70">
                I agree to the{' '}
                <Link href="/terms-and-conditions" className="text-marigold hover:text-marigold-dark font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-marigold hover:text-marigold-dark font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Google reCAPTCHA v2 Checkbox */}
            <Recaptcha
              ref={recaptchaRef}
              onChange={(token) => {
                setData('recaptcha_token', token || '');
                if (token) clearErrors('recaptcha_token');
              }}
              errorMessage={errors.recaptcha_token}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-body font-bold uppercase tracking-wide text-white bg-ink hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? (
                <FaSpinner className="animate-spin h-4 w-4" />
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <SocialButtons
            destination="user"
            allowAccountTypeChoice={true}
            recaptchaToken={data.recaptcha_token}
            onRequireRecaptcha={() => {
              setError('recaptcha_token', 'Please complete the reCAPTCHA verification before continuing with Google.');
              toast.error('Please complete the reCAPTCHA verification');
              document.querySelector('.recaptcha-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm font-body text-ink/60">
            Already have an account?{' '}
            <Link
              href={route('login')}
              className="font-body font-bold text-marigold hover:text-marigold-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-body text-ink/30 tracking-wide">
          Secure registration • Protected by SSL encryption
        </p>
      </div>
    </div>
  );
}
