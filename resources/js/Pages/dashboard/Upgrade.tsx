import { Head, Link, router, usePage } from '@inertiajs/react';
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

export default function Upgrade({ user }: { user?: User }) {
  const { props } = usePage<PageProps>();
  const subscription = props.auth?.subscription;
  const isActive = !!subscription?.isActive;

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

        <header className="relative z-10 container flex items-center justify-between py-6">
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

        <main className="relative z-10 container pb-24 pt-8">
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
                    Your free year has ended.
                    <br />
                    <span className="text-marigold">Upgrade to keep selling.</span>
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
                    your store is paused because your HaatPoint access has expired.
                    Upgrade to <strong className="text-paper">HaatPoint Pro</strong> to
                    re-open your shop and start selling again.
                  </>
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={route('dashboard.subscription.payment')}
                  className="group inline-flex items-center gap-2 rounded-sm border border-ink bg-marigold px-[26px] py-[15px] text-sm font-bold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  {isActive ? 'Renew' : 'Upgrade to'} Pro — ৳500 / 6 months
                  <FaArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <p className="mt-4 max-w-[460px] text-xs leading-relaxed text-[#8f8d87]">
                Pro is ৳500 for 6 months, paid by bKash. Pay from your bKash app, submit the
                transaction ID, and we activate Pro as soon as a superadmin verifies it.
              </p>
            </div>

            {/* Plan card */}
            <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-marigold">
                  <FaCrown className="h-3.5 w-3.5" /> HaatPoint Pro
                </span>
                <span className="rounded-full bg-marigold px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
                  Recommended
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-[54px] font-extrabold leading-none text-paper">
                  ৳500
                </span>
                <span className="pb-2 text-sm text-[#B9B7B0]">/ 6 months</span>
              </div>

              <ul className="mt-7 space-y-3.5 text-sm">
                {[
                  isActive ? 'Extend your store by 6 months' : 'Re-open your store after payment',
                  'Continuous, always-on selling',
                  'Unlimited products & analytics',
                  'Priority seller support',
                  'Renews every 6 months',
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
