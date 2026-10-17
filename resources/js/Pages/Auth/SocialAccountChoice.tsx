import { Head, Link, useForm } from '@inertiajs/react';
import { FaGoogle, FaShoppingBag, FaStore, FaArrowRight, FaUser, FaShieldAlt } from 'react-icons/fa';

interface SocialAccountChoiceProps {
  socialUser: {
    provider: string;
    email: string;
    name: string;
    images?: string | null;
  };
}

export default function SocialAccountChoice({ socialUser }: SocialAccountChoiceProps) {
  const { post, processing } = useForm();

  const handleSelect = (role: 'user' | 'agent') => {
    post(route('auth.social.complete', { role }));
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 py-12">
      <Head title="Choose Account Type - HaatPoint" />

      <div className="w-full max-w-lg">
        {/* Brand */}
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
          <p className="text-ink/60 mt-2 font-body text-sm">One step to complete your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-ink/10 p-6 sm:p-8">
          {/* User Preview */}
          <div className="flex items-center gap-3.5 p-3.5 bg-paper rounded-2xl border border-ink/10 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-ink/10 shrink-0 flex items-center justify-center">
              {socialUser.images ? (
                <img
                  src={socialUser.images}
                  alt={socialUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="h-5 w-5 text-ink/40" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-ink truncate text-sm">
                  {socialUser.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <FaGoogle className="h-2.5 w-2.5 text-red-500" /> Google Verified
                </span>
              </div>
              <p className="text-xs text-text-soft font-body truncate mt-0.5">
                {socialUser.email}
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-extrabold text-ink uppercase tracking-tight">
              Choose Account Type
            </h2>
            <p className="mt-1 text-sm text-ink/60 font-body">
              How would you like to join HaatPoint with this Google account?
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer Option */}
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSelect('user')}
              className="w-full group text-left p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-marigold/5 hover:border-marigold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-marigold/15 border border-marigold/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FaShoppingBag className="h-6 w-6 text-marigold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-lg text-ink group-hover:text-marigold transition-colors">
                      Customer / User
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-marigold/10 text-marigold">
                      Shop &amp; Buy
                    </span>
                  </div>
                  <p className="text-xs text-ink/70 leading-relaxed font-body">
                    Shop thousands of products, place orders with Cash on Delivery or bKash, and track delivery straight to your doorstep.
                  </p>
                  <div className="mt-3 flex items-center text-xs font-bold text-marigold group-hover:translate-x-1 transition-transform">
                    <span>Create Customer Account</span>
                    <FaArrowRight className="ml-1.5 h-3 w-3" />
                  </div>
                </div>
              </div>
            </button>

            {/* Agent Option */}
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSelect('agent')}
              className="w-full group text-left p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-blue-50/50 hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 border border-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FaStore className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-lg text-ink group-hover:text-blue-600 transition-colors">
                      HaatPoint Agent
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Sell &amp; Earn
                    </span>
                  </div>
                  <p className="text-xs text-ink/70 leading-relaxed font-body">
                    Open your online store, list products, ship from your location with Pathao courier, and keep 100% of your business profits.
                  </p>
                  <div className="mt-3 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Create Agent Account</span>
                    <FaArrowRight className="ml-1.5 h-3 w-3" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-ink/10 text-center">
            <Link
              href={route('login')}
              className="text-xs font-body font-medium text-ink/60 hover:text-ink transition-colors"
            >
              Cancel and return to login
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <p className="mt-6 text-center text-xs font-body text-ink/30 tracking-wide flex items-center justify-center gap-1.5">
          <FaShieldAlt className="h-3 w-3" />
          Secure registration • Protected by SSL encryption
        </p>
      </div>
    </div>
  );
}
