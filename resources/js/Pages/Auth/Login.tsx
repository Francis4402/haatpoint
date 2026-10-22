import { useEffect, FormEventHandler, useState, Fragment, useRef } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
  FaTimes,
  FaShoppingBag,
  FaStore,
} from 'react-icons/fa';
import { toast } from 'sonner';
import SocialButtons from '@/Components/SocialButtons';
import FlashBanner from '@/Components/FlashBanner';
import Recaptcha, { RecaptchaRef } from '@/Components/Recaptcha';

export default function Login({
  status,
  canResetPassword,
  recaptchaSiteKey,
}: {
  status?: string;
  canResetPassword: boolean;
  recaptchaSiteKey?: string;
}) {
  const recaptchaRef = useRef<RecaptchaRef>(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    email: '',
    password: '',
    remember: false,
    recaptcha_token: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'true' || window.location.hash === '#register') {
      setShowRegisterChoice(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!data.recaptcha_token) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }
    post(route('login'), {
      onSuccess: () => {
        toast.success('Welcome back!');
      },
      onError: (errs) => {
        if (errs.recaptcha_token) {
          toast.error(errs.recaptcha_token);
        } else {
          toast.error('Invalid credentials');
        }
        recaptchaRef.current?.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <Head title="Log in" />

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
          <p className="text-ink/60 mt-2 font-body">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ink/10 p-8">
          {/* Status Message */}
          {status && (
            <div className="mb-6 p-3 rounded-lg bg-ink/5 border border-ink/10">
              <p className="text-sm text-ink text-center">{status}</p>
            </div>
          )}

          <FlashBanner />

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-body font-semibold text-ink mb-1.5">
                Email address
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
                  autoFocus
                  onChange={(e) => setData('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-body font-semibold text-ink">
                  Password
                </label>
                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-sm font-body font-semibold text-marigold hover:text-marigold-dark transition-colors"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-ink/40" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  autoComplete="current-password"
                  onChange={(e) => setData('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body"
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="h-4 w-4 text-marigold focus:ring-marigold border-ink/20 rounded bg-paper"
              />
              <label htmlFor="remember" className="ml-2 block text-sm font-body text-ink/80">
                Remember me
              </label>
            </div>

            {/* Google reCAPTCHA v2 Checkbox */}
            <Recaptcha
              ref={recaptchaRef}
              siteKey={recaptchaSiteKey}
              onChange={(token) => setData('recaptcha_token', token || '')}
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
                  Sign in
                  <FaArrowRight className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <SocialButtons
            destination="user"
            allowAccountTypeChoice={false}
            recaptchaToken={data.recaptcha_token}
            onRequireRecaptcha={() => {
              setError('recaptcha_token', 'Please complete the reCAPTCHA verification before signing in with Google.');
              toast.error('Please complete the reCAPTCHA verification');
              document.querySelector('.recaptcha-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-ink/10 text-center">
            <p className="text-sm font-body text-ink/70">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setShowRegisterChoice(true)}
                className="font-body font-bold text-marigold hover:text-marigold-dark transition-colors underline underline-offset-2 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-body text-ink/30 tracking-wide">
          Secure login • Protected by SSL encryption
        </p>
      </div>

      {/* Account Type Selection Modal */}
      <Transition appear show={showRegisterChoice} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowRegisterChoice(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-left align-middle shadow-2xl border border-ink/10 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-marigold/10 text-marigold border border-marigold/20 mb-2">
                        <span>New to HaatPoint?</span>
                      </div>
                      <Dialog.Title as="h3" className="text-2xl font-display font-extrabold text-ink uppercase tracking-tight">
                        Choose Account Type
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-ink/60 font-body">
                        Select how you would like to join and get started:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRegisterChoice(false)}
                      className="rounded-xl border border-ink/10 p-2 text-ink/40 hover:text-ink hover:border-ink/30 transition-colors cursor-pointer"
                      aria-label="Close dialog"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    {/* Option 1: Customer / User */}
                    <Link
                      href={route('register')}
                      className="group relative flex items-start gap-4 p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-marigold/5 hover:border-marigold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-marigold/15 border border-marigold/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FaShoppingBag className="h-6 w-6 text-marigold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display font-bold text-lg text-ink group-hover:text-marigold transition-colors">
                            Customer / User
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-marigold/10 text-marigold">
                            Shop &amp; Buy
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 leading-relaxed font-body">
                          Browse thousands of authentic products, place orders with Cash on Delivery or bKash, and track deliveries.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-bold text-marigold group-hover:translate-x-1 transition-transform">
                          <span>Continue to Customer Registration</span>
                          <FaArrowRight className="ml-1.5 h-3 w-3" />
                        </div>
                      </div>
                    </Link>

                    {/* Option 2: Agent */}
                    <Link
                      href={route('agent.register')}
                      className="group relative flex items-start gap-4 p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-blue-50/50 hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-100/70 border border-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FaStore className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display font-bold text-lg text-ink group-hover:text-blue-600 transition-colors">
                            HaatPoint Agent
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Sell &amp; Earn
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 leading-relaxed font-body">
                          Open and manage your online store, upload products, process customer orders, and earn business profits.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span>Continue to Agent Registration</span>
                          <FaArrowRight className="ml-1.5 h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink/10 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegisterChoice(false)}
                      className="text-xs font-body font-medium text-ink/60 hover:text-ink transition-colors cursor-pointer"
                    >
                      Already have an account? <span className="font-bold underline text-marigold">Sign in here</span>
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
