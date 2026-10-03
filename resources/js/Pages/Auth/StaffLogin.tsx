import { useEffect, FormEventHandler, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import WhatsAppChatButton from '@/Components/WhatsAppChatButton';
import { Head } from '@inertiajs/react';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
  FaArrowRight,
} from 'react-icons/fa';
import { toast } from 'sonner';
import SocialButtons from '@/Components/SocialButtons';

type StaffType = 'superadmin' | 'admin' | 'agent';

const LABELS: Record<StaffType, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin & Superadmin',
  agent: 'Agent',
};

export default function StaffLogin({ type, status, canRegister }: { type: StaffType, status?: string, canRegister?: boolean }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route(`${type}.login`), {
      onSuccess: () => {
        toast.success('Welcome back!');
      },
      onError: () => {
        toast.error('Invalid credentials');
      }
    });
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <Head title={`${LABELS[type]} Login`} />

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
            Sign in to your {LABELS[type]} account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ink/10 p-8">
          {/* Status Message */}
          {status && (
            <div className="mb-6 p-3 rounded-lg bg-ink/5 border border-ink/10">
              <p className="text-sm text-ink text-center">{status}</p>
            </div>
          )}

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
                  placeholder="you@example.com"
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

          <SocialButtons destination={type} />

          {/* Register Link */}
          {type === 'agent' || canRegister ? (
            <p className="mt-6 text-center text-sm font-body text-ink/60">
              Don't have an account?{' '}
              <Link
                href={route(type === 'agent' ? 'agent.register' : type === 'superadmin' ? 'superadmin.register' : 'admin.register')}
                className="font-body font-bold text-marigold hover:text-marigold-dark transition-colors"
              >
                Create one
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-center text-sm font-body text-ink/60">
              Admin accounts are created by a superadmin. Registration is closed.
            </p>
          )}
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