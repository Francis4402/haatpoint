import { useEffect, FormEventHandler, useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import WhatsAppChatButton from '@/Components/WhatsAppChatButton';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
  FaUser,
  FaAddressBook,
  FaMobileAlt,
  FaIdCard,
  FaCamera,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'sonner';
import SocialButtons from '@/Components/SocialButtons';
import FlashBanner from '@/Components/FlashBanner';

type StaffType = 'superadmin' | 'admin' | 'agent';

const LABELS: Record<StaffType, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  agent: 'Agent',
};

export default function StaffRegister({
  type,
  socialDestination,
}: {
  type: StaffType;
  /** Which Socialite destination "Continue with Google" should use. */
  socialDestination?: StaffType;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    address: '',
    mobile: '',
    national_id: '',
    image: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
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
    post(route(`${type}.register`), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Registration Successful! Welcome aboard!');
      },
      onError: () => {
        toast.error('Registration Failed. Please try again.');
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
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <Head title={`${LABELS[type]} Register`} />

      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2.5 group">
            <img
              src="/MyLogo.png"
              alt="Haatpoint"
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <h1 className="text-[44px] font-display font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink">
              HaatPoint
            </h1>
          </Link>
          <p className="text-ink/60 mt-2 font-body">
            Create your {LABELS[type]} account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ink/10 p-8">
          <FlashBanner />

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full bg-paper border-4 border-ink/10 shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
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
                    <FaUser className="h-12 w-12 text-ink/30" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center shadow-md hover:bg-ink/90 transition-colors"
              >
                <FaCamera className="h-4 w-4" />
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
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
              className="mt-2 text-sm font-body font-semibold text-marigold hover:text-marigold-dark transition-colors"
            >
              {imagePreview ? 'Change Photo' : 'Upload Profile Picture'}
            </button>
            <p className="text-xs font-body text-ink/40 mt-1">JPEG, PNG or GIF • Max 2MB</p>

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
                Full Name
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                  placeholder="John Doe"
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Email Address
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                  placeholder="you@example.com"
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

            {/* Agent KYC fields */}
            {type === 'agent' && (
              <>
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-body font-semibold text-ink mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaAddressBook className="h-4 w-4 text-ink/40" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      value={data.address}
                      autoComplete="street-address"
                      onChange={(e) => setData('address', e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                      placeholder="Shop / office address"
                      required
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Mobile / mobile banking number */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-body font-semibold text-ink mb-1.5">
                    Mobile Number (bKash / Nagad)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMobileAlt className="h-4 w-4 text-ink/40" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={data.mobile}
                      autoComplete="tel"
                      onChange={(e) => setData('mobile', e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label htmlFor="national_id" className="block text-sm font-body font-semibold text-ink mb-1.5">
                    National ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="h-4 w-4 text-ink/40" />
                    </div>
                    <input
                      id="national_id"
                      name="national_id"
                      value={data.national_id}
                      onChange={(e) => setData('national_id', e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                      placeholder="10 or 17 digit National ID"
                      required
                    />
                  </div>
                  {errors.national_id && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                      {errors.national_id}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-amber-600 flex items-center">
                    <FaExclamationCircle className="h-3 w-3 mr-1" />
                    The National ID must be valid or your store will be closed.
                  </p>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Password
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
                  className="block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
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
                  <span className="text-xs font-body font-medium text-ink/60">
                    Strength: <span className={`font-bold ${
                      passwordStrength <= 1 ? 'text-red-500' :
                      passwordStrength <= 3 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </span>
                  <div className="w-full bg-ink/10 rounded-full h-1 mt-1">
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
                Confirm Password
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
                  className="block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
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
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-marigold focus:ring-marigold border-ink/20 rounded bg-paper mt-0.5"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm font-body text-ink/60">
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

          <SocialButtons destination={socialDestination ?? type} />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm font-body text-ink/60">
            Already have an account?{' '}
            <Link
              href={route(`${type}.login`)}
              className="font-body font-bold text-marigold hover:text-marigold-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-body text-ink/30 tracking-wide">
          {LABELS[type]} portal • Protected by SSL encryption
        </p>
      </div>
      <WhatsAppChatButton />
    </div>
  );
}