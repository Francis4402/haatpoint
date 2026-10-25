import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps, User } from '@/types';
import {
  FaArrowRight,
  FaCheck,
  FaCrown,
  FaSignOutAlt,
  FaStore,
  FaLock,
  FaClock,
} from 'react-icons/fa';

export default function Upgrade({ user, pricing }: { user?: User; pricing?: { monthly: number; sixMonths: number; bkashNumber: string } }) {
  const { props } = usePage<PageProps>();
  const subscription = props.auth?.subscription;
  const isActive = !!subscription?.isActive;
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'six_month'>('monthly');

  const monthlyPrice = pricing?.monthly || 100;
  const sixMonthPrice = pricing?.sixMonths || 570;
  const bkashNumber = pricing?.bkashNumber || '01319052507';
  const currentAmount = selectedCycle === 'monthly' ? monthlyPrice : sixMonthPrice;
  const currentMonths = selectedCycle === 'monthly' ? 1 : 6;

  const endDate = subscription?.endsAt
    ? new Date(subscription.endsAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const logout = () => router.post(route('agent.logout'));

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Head title={isActive ? 'Renew HaatPoint Pro' : 'Upgrade to HaatPoint Pro'} />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-[-160px] top-[-200px] h-[520px] w-[520px] bg-marigold opacity-90 clip-cta" />

        <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="/MyLogo.png" alt="Haatpoint" className="h-9 w-auto object-contain" />
            <span className="font-display text-[22px] font-extrabold uppercase tracking-[-0.01em]">
              HaatPoint
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 px-4 py-2 text-xs font-bold text-paper backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <FaSignOutAlt size={12} /> Log out
          </button>
        </header>

        <main className="relative z-10 mx-auto max-w-[1240px] px-6 pb-24 pt-8 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                {isActive ? (
                  <FaClock className="h-3 w-3 text-marigold" />
                ) : (
                  <FaLock className="h-3 w-3 text-marigold" />
                )}
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  {isActive ? 'Renew early' : 'Account paused'}
                </span>
              </span>

              <h1 className="mt-6 text-[34px] leading-[1.02] sm:text-[50px]">
                {isActive ? (
                  <>
                    Keep your shop
                    <br />
                    <span className="text-marigold">always open.</span>
                  </>
                ) : (
                  <>
                    Unlock unlimited selling.
                    <br />
                    <span className="text-marigold">Upgrade to HaatPoint Pro.</span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-[#B9B7B0] sm:text-[16.5px]">
                Hi{user?.name ? ` ${user.name}` : ''} —{' '}
                {isActive ? (
                  <>
                    your HaatPoint access{endDate ? ` ends on ${endDate}` : ''}. Renew now to
                    stay online without interruption.
                  </>
                ) : (
                  <>
                    upgrade to <strong className="text-paper">HaatPoint Pro</strong> to unlock unlimited products,
                    keep your storefront active, and get direct customer orders.
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`${route('dashboard.subscription.payment')}?months=${currentMonths}`}
                  className="group inline-flex items-center gap-2 rounded-sm border border-ink bg-marigold px-[26px] py-[15px] text-sm font-bold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  {isActive ? 'Renew' : 'Upgrade to'} Pro — ৳{currentAmount} / {currentMonths} month{currentMonths > 1 ? 's' : ''}
                  <FaArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <p className="mt-4 max-w-[460px] text-xs leading-relaxed text-[#8f8d87]">
                Free 1-year accounts are limited to 150 product uploads. Upgrade to Pro for unlimited product uploads at ৳{monthlyPrice}/month, or ৳{sixMonthPrice} for 6 months (10% discount applied). Pay via bKash to {bkashNumber}, submit your TrxID, and admin will activate your Pro access upon verification.
              </p>
            </div>

            {/* Plan card */}
            <div className="relative overflow-hidden rounded-3xl border border-line bg-[#1B1B1B] p-8 shadow-hard-lg">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-marigold">
                  <FaCrown className="h-3.5 w-3.5" /> HaatPoint Pro
                </span>
                <span className="rounded-full bg-marigold px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
                  {selectedCycle === 'six_month' ? 'Save 10% (৳60 OFF)' : 'Flexible Monthly'}
                </span>
              </div>

              {/* Cycle Picker */}
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCycle('monthly')}
                  className={`rounded-lg py-2 font-bold transition-colors ${
                    selectedCycle === 'monthly'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-[#B9B7B0] hover:text-white'
                  }`}
                >
                  Monthly (৳{monthlyPrice}/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('six_month')}
                  className={`rounded-lg py-2 font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    selectedCycle === 'six_month'
                      ? 'bg-marigold text-white shadow-sm'
                      : 'text-[#B9B7B0] hover:text-white'
                  }`}
                >
                  <span>6 Months (৳{sixMonthPrice})</span>
                  <span className={`rounded px-1 text-[9px] font-mono ${
                    selectedCycle === 'six_month' ? 'bg-white text-marigold font-extrabold' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    10% OFF
                  </span>
                </button>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-[54px] font-extrabold leading-none text-paper">
                  ৳{currentAmount}
                </span>
                <span className="pb-2 text-sm text-[#B9B7B0]">
                  / {currentMonths} month{currentMonths > 1 ? 's' : ''}
                </span>
              </div>
              {selectedCycle === 'six_month' && (
                <p className="mt-1 text-xs text-emerald-400 font-mono">
                  <span className="line-through text-[#8f8d87] mr-1">৳600</span> ৳90/month • 10% discount applied
                </p>
              )}

              <ul className="mt-6 space-y-3.5 text-sm">
                {[
                  isActive ? `Extend your store by ${currentMonths} month${currentMonths > 1 ? 's' : ''}` : 'Re-open your store immediately upon verification',
                  'Unlimited products (no product limit)',
                  'Continuous, always-on storefront visibility',
                  'Verified Pro Seller badge',
                  'Advanced sales & performance analytics',
                  'Priority 24/7 seller support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-marigold/20">
                      <FaCheck className="h-2.5 w-2.5 text-marigold" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-[#B9B7B0]">
                <FaStore className="h-3.5 w-3.5 text-marigold" />
                Your products, orders and settings are safe — nothing is deleted.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
