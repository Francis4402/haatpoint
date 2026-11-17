import { FaArrowRight, FaStore, FaTruck, FaWallet, FaRocket } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import useRevealChildren from "@/Components/useRevealChildren";

const PERKS = [
  {
    icon: FaStore,
    title: "100% Authentic Quality",
    desc: "Every product is carefully curated, tested, and verified for superior quality, durability, and authentic value.",
    badge: "Verified Quality",
  },
  {
    icon: FaTruck,
    title: "Fast Nationwide Delivery",
    desc: "Reliable doorstep delivery across all 64 districts with full live tracking and Cash on Delivery supported.",
    badge: "Nationwide",
  },
  {
    icon: FaWallet,
    title: "Cash on Delivery",
    desc: "Order with absolute peace of mind. Pay cash directly at your doorstep once your package arrives.",
    badge: "Safe & Easy",
  },
  {
    icon: FaRocket,
    title: "Best Value & Pricing",
    desc: "Honest, transparent pricing with direct manufacturer rates and exclusive offers on popular essentials.",
    badge: "Best Value",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Pick Your Favorites",
    desc: "Browse our curated collection of fashion, gadgets, and home goods at unbeatable prices.",
  },
  {
    num: "02",
    title: "One-Click Order",
    desc: "Checkout in seconds with your phone number and delivery address. No advance payment needed.",
  },
  {
    num: "03",
    title: "Doorstep Delivery",
    desc: "Receive your package safely at home, inspect your items, and pay cash on delivery.",
  },
];

export default function VendorCTA() {
  const ref = useRevealChildren({ y: 20, duration: 0.7, stagger: 0.1 });

  return (
    <div className="w-full pt-20">
      <section className="relative w-full overflow-hidden py-20 bg-ink text-paper border-y border-ink" id="about-products">
        <div ref={ref} className="relative z-10 container">
          {/* Header */}
          <div className="max-w-[700px] mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#333333] bg-[#222222] px-3 py-1.5 mb-4">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper">
                Authentic Products & Trusted Service
              </span>
            </span>

            <h2 className="text-[34px] sm:text-[46px] lg:text-[56px] font-display font-extrabold text-paper leading-[1.02] tracking-tight">
              Quality products crafted for
              <br />
              <span className="text-marigold">your everyday life</span> in Bangladesh.
            </h2>

            <p className="mt-4 text-[#B9B7B0] text-sm sm:text-base leading-relaxed max-w-[560px]">
              Explore our hand-picked catalog of trending fashion, gadgets, home goods, and daily essentials. 
              Enjoy guaranteed authenticity, fast nationwide delivery, and hassle-free Cash on Delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-sm px-6 py-3.5 font-bold text-sm bg-marigold hover:bg-marigold-dark text-white shadow-hard-marigold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <span>Explore All Products</span>
                <FaArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/hotdeals"
                className="inline-flex items-center gap-2 rounded-sm border border-[#3A3A3A] bg-[#242424] hover:bg-[#2C2C2C] px-5 py-3.5 text-sm font-bold text-paper transition-all duration-150"
              >
                <span>View Hot Deals & Offers</span>
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
                  className="rounded-2xl border border-[#2E2E2E] bg-[#222222] p-5 hover:border-marigold/70 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C3827] text-marigold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-[#2E2E2E] border border-[#3A3A3A] text-[#E3E1DB] px-2 py-0.5 rounded-full">
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
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#222222] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#2E2E2E]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-marigold">
                  Simple 3-Step Experience
                </span>
                <h3 className="font-display font-extrabold text-xl text-paper mt-0.5">
                  How easy shopping with us is
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold text-marigold hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <span>Browse full catalog</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {STEPS.map((step) => (
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
