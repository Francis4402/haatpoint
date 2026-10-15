import { Link, usePage } from '@inertiajs/react';
import { FaArrowRight, FaCrown } from 'react-icons/fa6';

interface Subscription {
  plan: 'free' | 'pro';
  isActive: boolean;
  isExpired: boolean;
  isPro: boolean;
  endsAt: string | null;
}

/**
 * Reminds an active seller that their subscription is about to lapse.
 *
 * Expired accounts never reach the dashboard (the subscription middleware sends
 * them to the upgrade screen), so this only covers the "ending soon" window.
 */
export default function SubscriptionBanner() {
  const { auth } = usePage().props as unknown as {
    auth?: { subscription?: Subscription | null };
  };

  const sub = auth?.subscription;
  if (!sub || !sub.isActive || !sub.endsAt) return null;

  const daysLeft = Math.ceil(
    (new Date(sub.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft > 30) return null;

  const planName = sub.plan === 'pro' ? 'HaatPoint Pro' : 'free';

  return (
    <div
      role="alert"
      className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-marigold/30 bg-marigold/10 px-4 py-3 text-sm text-ink shadow-hard-sm"
    >
      <FaCrown className="h-5 w-5 flex-shrink-0 text-marigold" />

      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          Your {planName} access ends in {Math.max(daysLeft, 0)} day
          {daysLeft === 1 ? '' : 's'}.
        </p>
        <p className="text-text-soft">
          Renew for ৳500 / 6 months to keep your store online.
        </p>
      </div>

      <Link
        href={route('dashboard.upgrade')}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-marigold px-3 py-1.5 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Renew now
        <FaArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
