import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import {
  FaArrowRight,
  FaCheck,
  FaStore,
  FaTruck,
  FaWallet,
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaPlayCircle,
} from 'react-icons/fa';

const BENEFITS = [
  {
    icon: FaStore,
    title: 'Your own storefront',
    body: 'Create a branded shop in minutes and list your products for customers across Bangladesh to discover.',
  },
  {
    icon: FaWallet,
    title: 'Keep what you earn',
    body: 'Set your own prices and get paid directly. No booth rent, no listing fees, no middlemen.',
  },
  {
    icon: FaTruck,
    title: 'Delivery handled',
    body: 'Built-in Pathao delivery and cash-on-delivery so you never chase a courier again.',
  },
  {
    icon: FaChartLine,
    title: 'Real-time analytics',
    body: 'Track sales, profit and best-sellers with a dashboard built for sellers, not accountants.',
  },
  {
    icon: FaShieldAlt,
    title: 'Trusted buyers',
    body: 'Verified customer accounts and secure checkout mean fewer disputes and faster payouts.',
  },
  {
    icon: FaClock,
    title: 'Live in minutes',
    body: 'Upload your photo, add products and go live the same day — no paperwork maze.',
  },
];

const STEPS = [
  { n: '01', title: 'Create your account', body: 'Sign up free with your email and a quick KYC check.' },
  { n: '02', title: 'Open your store', body: 'Add your shop name, logo and pickup location.' },
  { n: '03', title: 'List your products', body: 'Upload photos, set your price and stock. That’s it.' },
  { n: '04', title: 'Start earning', body: 'Orders land in your dashboard and cash reaches your hand.' },
];

const FAQ = [
  {
    q: 'How much does it cost to start selling?',
    a: 'Getting started is completely free! Every agent account is free forever with up to 150 products upload limit, full store management, order handling, and zero upfront costs.',
  },
  {
    q: 'What is HaatPoint Pro and how much does it cost?',
    a: 'HaatPoint Pro is built for active and scaling sellers. You can pay monthly for ৳100/month or pay 6 months in advance for ৳540 (a 10% discount saving ৳60). Pro unlocks unlimited product uploads, continuous selling, and priority support.',
  },
  {
    q: 'What extra advantages do I get with HaatPoint Pro?',
    a: 'Pro members enjoy unlimited product uploads (no 150-product cap), continuous storefront visibility without pauses, a Verified Pro Seller badge, advanced sales analytics, and priority customer support.',
  },
  {
    q: 'How do I pay for HaatPoint Pro?',
    a: 'Send ৳100 for 1 month or ৳540 for 6 months via bKash (Send Money to 01319052507). Then submit your bKash Transaction ID (TrxID) in your dashboard for rapid verification and activation.',
  },
  {
    q: 'How do I get paid for my sales?',
    a: 'Customers pay cash on delivery (COD) or via bKash. Deliveries are fulfilled through integrated Pathao courier service, and your earnings are settled directly to you.',
  },
];

function SellerVideoPlayer() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink bg-[#111319] text-paper shadow-2xl">
      {/* Player Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#181B24] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="hidden h-4 w-[1px] bg-white/15 sm:inline-block" />
          <div className="flex items-center gap-2">
            <FaPlayCircle className="h-4 w-4 text-marigold" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper">
              Seller Walkthrough Player
            </span>
          </div>
        </div>

        <span className="rounded bg-marigold/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-marigold">
          1080p Full HD
        </span>
      </div>

      {/* Video Screen Container */}
      <div className="relative aspect-video w-full bg-black">
        <video
          src="/stream/video/agentaccountv.mp4"
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info Footer */}
      <div className="border-t border-white/10 bg-[#151720] p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-base font-extrabold text-paper sm:text-lg">
              How to Sell on HaatPoint: Account Registration & Store Setup
            </h2>
            <p className="mt-1 text-xs text-[#B9B7B0] sm:text-sm">
              Step-by-step video tutorial covering agent registration, profile setup, and uploading your first 150 products free forever.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-[#8f8d87]">
            <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-emerald-400">
              1080p Full HD
            </span>
            <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-paper">
              ~6 mins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sell({ auth, agentRegisterRoute }: PageProps<{ agentRegisterRoute: string }>) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'six_month'>('monthly');
  const isAgent = auth?.user?.role === 'agent';
  const selectedMonths = billingCycle === 'monthly' ? 1 : 6;
  const proRedirect = isAgent
    ? route('dashboard.subscription.payment', { months: selectedMonths })
    : `${agentRegisterRoute}?plan=pro&months=${selectedMonths}`;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <AppLayout user={auth?.user}>
      <Head title="Become a Seller · HaatPoint">
        <meta
          name="description"
          content="Sell on HaatPoint — Bangladesh's trusted marketplace. Start free with limited products, or upgrade to Pro for ৳100/month with a 10% discount on 6-month advance payments for unlimited products."
        />
      </Head>

      {/* Video Player Section */}
      <section className="border-b border-line bg-paper-dim py-10 sm:py-16">
        <div className="container max-w-5xl">
          <div className="mb-6 text-center max-w-2xl mx-auto sm:mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-marigold/30 bg-marigold/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-marigold">
              <FaPlayCircle className="h-3.5 w-3.5" /> Seller Video Guide
            </span>
            <h2 className="mt-3 font-display text-2xl font-black text-ink sm:text-3xl lg:text-4xl">
              How to Open an Agent Account & Sell on HaatPoint
            </h2>
            <p className="mt-2 text-xs text-text-soft sm:text-sm">
              Watch this complete step-by-step walkthrough tutorial on opening an agent account and launching your store.
            </p>
          </div>

          <SellerVideoPlayer />
        </div>
      </section>

      {/* Spacing Gap between Video Section and Hero Banner */}
      <div className="h-10 sm:h-16 bg-paper" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute right-[-140px] top-[-180px] h-[460px] w-[460px] bg-marigold opacity-90 clip-cta" />
        <div className="relative z-10 container py-20 sm:py-28 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
              For sellers
            </span>
          </span>

          <h1 className="mt-6 text-[36px] leading-[1.02] sm:text-[52px] lg:text-[64px]">
            Take your local stall
            <br />
            <span className="text-marigold">online</span> across Bangladesh.
          </h1>

          <p className="mt-5 max-w-[620px] mx-auto text-[15px] leading-relaxed text-[#B9B7B0] sm:text-[17px]">
            Join thousands of local vendors selling on HaatPoint. Set your own
            prices, reach customers everywhere, and get paid directly — the
            platform just brings the buyers to you.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={agentRegisterRoute}
              className="group inline-flex items-center gap-2 rounded-sm border border-ink bg-marigold px-[28px] py-[15px] text-sm font-bold text-white shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Start selling free
              <FaArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 px-[26px] py-[15px] text-sm font-bold text-paper backdrop-blur-sm transition-all duration-150 hover:bg-white/10"
            >
              See pricing
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10.5px] uppercase tracking-wide text-[#B9B7B0]">
            <span className="inline-flex items-center gap-1.5">
              <FaCheck className="text-marigold" /> Free to start (150 products)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheck className="text-marigold" /> ৳100/mo Pro available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheck className="text-marigold" /> Cash-on-delivery & Pathao
            </span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-20">
        <div className="max-w-[560px]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-marigold">
            Why HaatPoint
          </span>
          <h2 className="mt-3 text-[30px] sm:text-[40px]">
            Everything you need to sell online, in one place.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-line bg-white p-6 shadow-hard-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-marigold/10">
                <Icon className="h-5 w-5 text-marigold" />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-paper-dim py-20">
        <div className="container">
          <div className="mx-auto max-w-[660px] text-center">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-marigold">
              Transparent Pricing
            </span>
            <h2 className="mt-3 text-[30px] sm:text-[40px]">
              Simple plans built for your business.
            </h2>
            <p className="mt-3 text-text-soft">
              Start free with essential features, or upgrade to Pro for ৳100/month with a 10% discount when paying 6 months in advance.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="mt-8 inline-flex items-center rounded-full border border-line bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-text-soft hover:text-ink'
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('six_month')}
                className={`relative rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'six_month'
                    ? 'bg-marigold text-white shadow-sm'
                    : 'text-text-soft hover:text-ink'
                }`}
              >
                <span>6 Months</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase ${
                  billingCycle === 'six_month' ? 'bg-white text-marigold' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  10% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
            {/* Free */}
            <div className="flex flex-col rounded-3xl border border-line bg-white p-8 shadow-hard-sm">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-text-soft">
                Free Starter
              </span>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-[46px] font-extrabold leading-none text-ink">
                  ৳0
                </span>
                <span className="pb-1 text-sm text-text-soft">/ free forever</span>
              </div>
              <p className="mt-3 text-sm text-text-soft">
                Perfect for new sellers to set up their store and explore the marketplace with zero risk.
              </p>

              <ul className="mt-6 space-y-3.5 text-sm text-ink flex-1">
                {[
                  'Upload up to 150 products (Free forever)',
                  'Lifetime free agent account (no expiry)',
                  'Custom storefront branding & profile',
                  'Basic sales dashboard & order management',
                  'Integrated delivery & cash on delivery (COD)',
                  'Standard seller support',
                ].map((f, idx) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <FaCheck className={`h-3.5 w-3.5 shrink-0 ${idx === 0 ? 'text-amber-500' : 'text-marigold'}`} />
                    <span className={idx === 0 ? 'font-semibold text-ink' : ''}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={isAgent ? route('dashboard') : agentRegisterRoute}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-ink bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                {isAgent ? 'Go to Dashboard' : 'Start for free'}
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-3xl border-[1.5px] border-ink bg-[#1B1B1B] p-8 text-paper shadow-hard-lg">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-marigold">
                    HaatPoint Pro
                  </span>
                  <span className="rounded-full bg-marigold px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
                    {billingCycle === 'six_month' ? 'Save 10% (৳60 OFF)' : 'Recommended'}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-[46px] font-extrabold leading-none text-paper">
                    ৳{billingCycle === 'monthly' ? '100' : '540'}
                  </span>
                  <span className="pb-1 text-sm text-[#B9B7B0]">
                    {billingCycle === 'monthly' ? '/ month' : '/ 6 months'}
                  </span>
                </div>
                {billingCycle === 'six_month' ? (
                  <p className="mt-1 text-xs text-emerald-400 font-mono">
                    <span className="line-through text-[#8f8d87] mr-1">৳600</span> ৳90/month • 10% discount applied (save ৳60)
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-marigold font-mono">
                    ৳100/month • Or pay 6 months in advance to get 10% discount (৳540)
                  </p>
                )}
                <p className="mt-3 text-sm text-[#B9B7B0]">
                  List unlimited products, keep your store always active, and gain maximum customer visibility.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm flex-1">
                  {[
                    'Unlimited product listings with no restrictions',
                    'Continuous, always-on selling without storefront pauses',
                    'Verified Pro Seller badge on your shop and items',
                    'Advanced sales, performance, and revenue analytics',
                    'Priority 24/7 dedicated seller support',
                    billingCycle === 'six_month'
                      ? '6 months prepaid with 10% discount (save ৳60, pay ৳540)'
                      : 'Pay ৳100 per month with flexible renewal',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <FaCheck className="h-3.5 w-3.5 shrink-0 text-marigold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={proRedirect}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-ink bg-marigold px-6 py-3.5 text-sm font-bold text-white shadow-hard-marigold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  {isAgent ? 'Get Pro' : 'Go Pro'} — ৳{billingCycle === 'monthly' ? '100 / month' : '540 / 6 months'} <FaArrowRight size={13} />
                </Link>
                <p className="mt-3 text-center text-[11px] text-[#8f8d87]">
                  Pay ৳{billingCycle === 'monthly' ? '100' : '540'} via bKash to 01319052507 — your account will be activated after checking the transaction id.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container py-20">
        <div className="max-w-[560px]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-marigold">
            How it works
          </span>
          <h2 className="mt-3 text-[30px] sm:text-[40px]">From sign-up to first sale.</h2>
          <p className="mt-3 text-text-soft">
            Follow the four simple steps below to launch your store and begin selling.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-white p-6 shadow-hard-sm">
              <span className="font-display text-3xl font-extrabold text-marigold">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper-dim py-20">
        <div className="mx-auto max-w-[820px] px-6 sm:px-8">
          <h2 className="text-center text-[30px] sm:text-[40px]">Questions, answered.</h2>
          <div className="mt-10 space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-line bg-white p-6 shadow-hard-sm">
                <h3 className="font-display text-lg font-extrabold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-soft">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-ink bg-marigold px-8 py-14 text-center shadow-hard-lg sm:px-12">
          <h2 className="mx-auto max-w-[640px] text-[30px] text-white sm:text-[42px]">
            Ready to open your shop?
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-sm text-white/90 sm:text-base">
            It takes minutes and is completely free forever to start (up to 150 products). Join the local
            sellers growing with HaatPoint today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={agentRegisterRoute}
              className="inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-[26px] py-[15px] text-sm font-bold text-paper shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Become a seller <FaArrowRight size={14} />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-sm border border-ink bg-white px-[26px] py-[15px] text-sm font-bold text-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Compare plans
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
