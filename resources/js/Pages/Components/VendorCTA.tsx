import { FaArrowRight, FaCheck, FaStore, FaTruck, FaWallet, FaRocket } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import Eyebrow from "./Eyebrow";
import useRevealChildren from "@/Components/useRevealChildren";

const PERKS = [
  {
    icon: FaStore,
    title: "1 Year Free Selling",
    desc: "Zero booth rent and zero listing fees. Sell free for a full 12 months with no upfront cost.",
    badge: "100% Free",
  },
  {
    icon: FaTruck,
    title: "Pathao Delivery & COD",
    desc: "Riders pick up orders directly from your shop or home. Full cash-on-delivery handled automatically.",
    badge: "Automated",
  },
  {
    icon: FaWallet,
    title: "Keep 100% Your Profit",
    desc: "Set your own prices. Earnings settle straight to you with no middlemen eating your margins.",
    badge: "Direct Payout",
  },
  {
    icon: FaRocket,
    title: "HaatPoint Pro Boost",
    desc: "Pro member stores get prioritized placement on the homepage showcase and top search spots.",
    badge: "Maximum Sales",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Register Free in 2 Mins",
    desc: "Sign up with your phone or email. No paperwork maze to get started.",
  },
  {
    num: "02",
    title: "Add Store & Products",
    desc: "Upload photos from your phone, set your price and stock. Go live same day.",
  },
  {
    num: "03",
    title: "We Deliver, You Earn",
    desc: "Pathao picks up from your location and delivers nationwide. Cash goes to you.",
  },
];

export default function VendorCTA() {
  const ref = useRevealChildren({ y: 20, duration: 0.7, stagger: 0.1 });

  return (
    <div className="w-full pt-20">
      <section className="relative w-full overflow-hidden py-20 bg-ink text-paper border-y border-ink" id="sell">
        <div className="absolute right-[-120px] top-[-160px] w-[460px] h-[460px] bg-marigold opacity-90 clip-cta pointer-events-none" />
        <div className="absolute left-[-100px] bottom-[-140px] w-[340px] h-[340px] bg-marigold/10 rounded-full blur-3xl pointer-events-none" />

        <div ref={ref} className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="max-w-[700px] mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm mb-4">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper">
                For store owners & entrepreneurs
              </span>
            </span>

            <h2 className="text-[34px] sm:text-[46px] lg:text-[56px] font-display font-extrabold text-paper leading-[1.02] tracking-tight">
              Bring your stall to
              <br />
              <span className="text-marigold">every phone</span> in Bangladesh.
            </h2>

            <p className="mt-4 text-[#B9B7B0] text-sm sm:text-base leading-relaxed max-w-[560px]">
              Join over 2,300+ independent merchants selling on HaatPoint. Enjoy 1 full year
              of free selling, built-in Pathao delivery, and direct payouts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/sell"
                className="group inline-flex items-center gap-2.5 rounded-sm px-6 py-3.5 font-bold text-sm bg-marigold hover:bg-marigold-dark text-white shadow-hard-marigold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <span>Start Selling Free (1 Year)</span>
                <FaArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell#pricing"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-sm font-bold text-paper backdrop-blur-sm transition-all duration-150"
              >
                <span>See Seller Plans & Pricing</span>
              </Link>
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-marigold/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marigold/20 text-marigold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-white/10 text-[#E3E1DB] px-2 py-0.5 rounded-full">
                      {perk.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-paper mb-1.5">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-[#B9B7B0] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 3-Step Simple Guide */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-marigold">
                  Simple 3-Step Guide
                </span>
                <h3 className="font-display font-extrabold text-xl text-paper mt-0.5">
                  How selling on HaatPoint works
                </h3>
              </div>
              <Link
                href="/sell"
                className="text-xs font-bold text-marigold hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <span>Read detailed onboarding guide</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="relative flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-marigold text-white font-display font-extrabold text-base shadow-sm">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-paper">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#B9B7B0] mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
