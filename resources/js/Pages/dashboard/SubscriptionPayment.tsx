import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps, User } from '@/types';
import {
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaCrown,
  FaSignOutAlt,
  FaMobileAlt,
  FaReceipt,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';

type PaymentStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface PaymentInfo {
  bkashNumber: string;
  monthlyPrice?: number;
  sixMonthPrice?: number;
  amount: number;
  months: number;
  status: PaymentStatus;
  trxId: string | null;
  submittedAt: string | null;
}

export default function SubscriptionPayment({
  user,
  payment,
}: {
  user?: User;
  payment: PaymentInfo;
}) {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialMonthsParam = Number(searchParams?.get('months'));
  const defaultMonths = initialMonthsParam === 1 || payment.months === 1 ? 1 : 6;

  const [selectedMonths, setSelectedMonths] = useState<number>(defaultMonths);
  const monthlyFee = payment.monthlyPrice || 100;
  const sixMonthFee = payment.sixMonthPrice || 570;
  const currentAmount = selectedMonths === 1 ? monthlyFee : sixMonthFee;

  const { data, setData, post, processing, errors } = useForm({
    trx_id: '',
    months: defaultMonths,
  });

  const { props } = usePage<PageProps>();
  const flash = props.flash;
  const [copied, setCopied] = useState(false);

  const handleSelectMonths = (m: number) => {
    setSelectedMonths(m);
    setData('months', m);
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(payment.bkashNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the number is on screen to type manually */
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('dashboard.subscription.payment.submit'));
  };

  const logout = () => router.post(route('agent.logout'));

  const submittedAt = payment.submittedAt
    ? new Date(payment.submittedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  const hasTrxId = Boolean(payment.trxId && payment.trxId.trim() !== '');
  const isPending = payment.status === 'pending' && hasTrxId;
  const isRejected = payment.status === 'rejected';

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Head title="Activate HaatPoint Pro" />

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
          {/* Plan Selector */}
          <div className="mb-8 rounded-2xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-marigold">
                  Select Pro Subscription Term
                </span>
                <h3 className="text-lg font-bold text-paper mt-0.5">Choose your billing cycle</h3>
              </div>
              <div className="flex items-center gap-2 p-1 bg-ink/60 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectMonths(1)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedMonths === 1
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-[#B9B7B0] hover:text-white'
                  }`}
                >
                  1 Month — ৳{monthlyFee}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMonths(6)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedMonths === 6
                      ? 'bg-marigold text-white shadow-sm'
                      : 'text-[#B9B7B0] hover:text-white'
                  }`}
                >
                  <span>6 Months — ৳{sixMonthFee}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-extrabold uppercase ${
                    selectedMonths === 6 ? 'bg-white text-marigold' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    5% OFF
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Important message for agent */}
          <div className="mb-8 rounded-2xl border border-marigold/40 bg-marigold/10 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marigold/20 text-marigold">
                <FaCrown className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-paper">
                  HaatPoint Pro Activation Instructions ({selectedMonths} Month{selectedMonths > 1 ? 's' : ''})
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#E6E4DD]">
                  Send <strong className="text-marigold text-base">৳{currentAmount}</strong> to bKash number{' '}
                  <strong className="text-paper font-mono underline">{payment.bkashNumber}</strong> (Send Money), then post your bKash Transaction ID below.
                  {selectedMonths === 6 && (
                    <span className="block mt-1 text-xs text-emerald-400 font-mono">
                      ✓ 5% discount applied: Save ৳30 (effective ৳95/month instead of ৳100/month).
                    </span>
                  )}
                </p>
                <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-marigold/20 px-3 py-1.5 text-xs font-bold text-marigold">
                  <FaCheck className="h-3 w-3" />
                  If your transaction ID is correct, then your account will be activated.
                </div>
              </div>
            </div>
          </div>

          {(flash?.success || flash?.error) && (
            <div
              className={`mb-8 flex items-center gap-3 rounded-2xl border p-4 text-sm ${
                flash?.success
                  ? 'border-marigold/40 bg-marigold/10 text-[#E6E4DD]'
                  : 'border-red-400/40 bg-red-500/10 text-[#E6E4DD]'
              }`}
            >
              <FaCheck className={`h-4 w-4 shrink-0 ${flash?.success ? 'text-marigold' : 'text-red-300'}`} />
              {flash?.success || flash?.error}
            </div>
          )}

          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                {isPending ? (
                  <FaClock className="h-3 w-3 text-marigold" />
                ) : (
                  <FaCrown className="h-3 w-3 text-marigold" />
                )}
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  {isPending ? 'Awaiting superadmin verification' : 'HaatPoint Pro Checkout'}
                </span>
              </span>

              <h1 className="mt-6 text-[34px] leading-[1.02] sm:text-[50px]">
                Pay ৳{currentAmount} by bKash.
                <br />
                <span className="text-marigold">Then post your TrxID.</span>
              </h1>

              <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-[#B9B7B0] sm:text-[16.5px]">
                Hi{user?.name ? ` ${user.name}` : ''} — send{' '}
                <strong className="text-paper">৳{currentAmount}</strong> to our bKash
                number <strong className="text-marigold font-mono">{payment.bkashNumber}</strong> for {selectedMonths} month{selectedMonths > 1 ? 's' : ''} of HaatPoint Pro, then post the transaction ID below so our superadmin can verify it and
                activate HaatPoint Pro for your account.
              </p>

              {isPending && (
                <div className="mt-8 flex max-w-[520px] items-start gap-3 rounded-2xl border border-marigold/40 bg-marigold/10 p-4">
                  <FaClock className="mt-0.5 h-4 w-4 shrink-0 text-marigold" />
                  <div className="text-sm leading-relaxed text-[#E6E4DD]">
                    <p className="font-semibold text-paper">Payment under review</p>
                    <p className="mt-1">
                      We received TrxID{' '}
                      <span className="font-mono font-bold text-marigold">{payment.trxId}</span>
                      {submittedAt ? ` on ${submittedAt}` : ''}.
                    </p>
                    <p className="mt-2 font-medium text-marigold">
                      If your transaction ID is correct, then your account will be activated shortly.
                    </p>
                  </div>
                </div>
              )}

              {isRejected && (
                <div className="mt-8 flex max-w-[520px] items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4">
                  <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                  <div className="text-sm leading-relaxed text-[#E6E4DD]">
                    <p className="font-semibold text-paper">Last payment could not be verified</p>
                    <p className="mt-1">
                      The TrxID was rejected by superadmin. Please check your bKash message and submit the correct transaction ID below. If your transaction ID is correct, then your account will be activated.
                    </p>
                  </div>
                </div>
              )}

              <ol className="mt-9 space-y-4 text-sm text-[#B9B7B0]">
                {[
                  <>Open your bKash app and choose <strong className="text-paper">Send Money</strong>.</>,
                  <>Send <strong className="text-paper">৳{currentAmount}</strong> to <strong className="text-paper font-mono">{payment.bkashNumber}</strong>.</>,
                  <>Copy the <strong className="text-paper">TrxID</strong> from your bKash SMS or receipt.</>,
                  <>Paste the transaction ID in the input below and click <strong className="text-paper">Post TrxID</strong>.</>,
                  <>Superadmin verifies the transaction ID and activates your Pro account for {selectedMonths} month{selectedMonths > 1 ? 's' : ''}.</>,
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-marigold/20 font-mono text-[11px] font-bold text-marigold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Payment card */}
            <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-display text-sm font-extrabold italic"
                  style={{ backgroundColor: '#E2136E', color: '#fff' }}
                >
                  bKash
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-marigold">
                  Send Money
                </span>
              </div>

              {/* Number */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-ink/40 p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#8f8d87]">
                  bKash number
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-display text-[30px] font-extrabold tracking-tight text-paper">
                    {payment.bkashNumber}
                  </span>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-bold text-paper transition-colors hover:bg-white/10"
                  >
                    {copied ? <FaCheck size={11} className="text-marigold" /> : <FaCopy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="mt-5 flex items-end gap-2 border-t border-white/10 pt-5">
                  <span className="font-display text-[44px] font-extrabold leading-none text-paper">
                    ৳{currentAmount}
                  </span>
                  <span className="pb-1.5 text-sm text-[#B9B7B0]">/ {selectedMonths} month{selectedMonths > 1 ? 's' : ''}</span>
                </div>
                {selectedMonths === 6 && (
                  <p className="mt-1 text-xs text-emerald-400 font-mono">
                    <span className="line-through text-[#8f8d87] mr-1">৳600</span> ৳95/month • 5% discount applied (save ৳30)
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={submit} className="mt-6">
                <label
                  htmlFor="trx_id"
                  className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#B9B7B0]"
                >
                  <FaReceipt className="h-3 w-3 text-marigold" /> bKash Transaction ID (TrxID)
                </label>
                <div className="mt-2 flex items-stretch gap-2">
                  <div className="relative flex-1">
                    <FaMobileAlt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8d87]" />
                    <input
                      id="trx_id"
                      type="text"
                      value={data.trx_id}
                      onChange={(e) => setData('trx_id', e.target.value)}
                      placeholder="e.g. 9F7A2C1B4D"
                      autoComplete="off"
                      className="w-full rounded-sm border border-white/20 bg-ink/40 py-3 pl-10 pr-3 font-mono text-sm uppercase tracking-wide text-paper placeholder:text-[#6f6d68] focus:border-marigold focus:outline-none focus:ring-1 focus:ring-marigold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="group inline-flex items-center gap-2 rounded-sm border border-ink bg-marigold px-5 py-3 text-sm font-bold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? 'Update TrxID' : 'Post TrxID'}
                    <FaArrowRight
                      size={13}
                      className="transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </button>
                </div>
                {errors.trx_id && (
                  <p className="mt-2 text-xs text-red-300">{errors.trx_id}</p>
                )}

                <p className="mt-3 text-[12px] font-medium leading-relaxed text-marigold">
                  ★ If your transaction ID is correct, then your account will be activated.
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#8f8d87]">
                  {isPending
                    ? 'Entered the wrong TrxID? Enter the correct one and click Update.'
                    : 'Paste the exact TrxID from your bKash SMS or receipt (e.g., 9F7A2C1B4D).'}
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
