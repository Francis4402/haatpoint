import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaLeaf,
  FaLaptop,
  FaCouch,
  FaTshirt,
  FaCheck,
} from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { categoryType } from "@/types";

interface HeroProps {
  user: any;
  categories?: categoryType[] | null;
}

const FALLBACK_TICKER = [
  "Fresh Produce",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Toys & Games",
  "Grocery",
  "Sports",
];

const CATEGORY_TILES = [
  {
    label: "Fresh Produce",
    caption: "Farm to door",
    icon: FaLeaf,
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Electronics",
    caption: "Latest gadgets",
    icon: FaLaptop,
    img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Home & Living",
    caption: "Everyday living",
    icon: FaCouch,
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Fashion",
    caption: "Local labels",
    icon: FaTshirt,
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop",
  },
];

const AVATARS = [
  { initial: "A", color: "#6E7F5C" },
  { initial: "R", color: "#4F6B63" },
  { initial: "S", color: "#C9B37E" },
  { initial: "M", color: "#1B1B1B" },
];

export default function Hero({ user, categories }: HeroProps) {
  const scope = useRef(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-copy > *", { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 })
        .from(".slash-mask", { opacity: 0, x: 40, scale: 0.97, duration: 0.8 }, "-=0.5")
        .from(".hero-tile", { opacity: 0, y: 14, scale: 0.96, duration: 0.5, stagger: 0.08 }, "-=0.5")
        .from(".float-card", { opacity: 0, y: 12, scale: 0.9, duration: 0.5, stagger: 0.15 }, "-=0.3");
    },
    { scope }
  );

  const tickerLabels = (
    categories && categories.length
      ? Array.from(new Set(categories.map(c => c.categories).filter(Boolean)))
      : FALLBACK_TICKER
  ).slice(0, 8);

  const ticker = [...tickerLabels, ...tickerLabels];

  return (
    <section className="relative pt-8 md:pt-14 pb-6 md:pb-10 overflow-hidden" ref={scope}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-paper">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#1B1B1B 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="grid md:grid-cols-[1.02fr_0.98fr] gap-10 md:gap-12 items-center">
        <div className="hero-copy order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 shadow-hard-sm backdrop-blur-sm mb-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Your neighborhood, online
            </span>
          </span>

          <h1 className="text-[38px] sm:text-[54px] lg:text-[76px] leading-[0.95]">
            Shop local
            <br />
            <span className="text-marigold">products</span> from
            <br />
            your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">haat</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 -skew-x-6 bg-sun/70 sm:h-4" />
            </span>
          </h1>

          <p className="text-text-soft text-[15px] sm:text-[17px] max-w-[460px] my-5 sm:my-6 leading-relaxed">
            Everything from fresh produce to electronics, sold directly by verified
            local vendors, with no middlemen. Better prices, faster delivery, and
            every order goes straight to the seller.
          </p>

          <div className="flex flex-wrap gap-3 items-center mb-7 sm:mb-8">
            <Link
              href={route("products.index")}
              className="group inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-marigold text-white border border-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Start shopping
              <FaArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
            <Link
              href={user ? "/agent/register" : "/dashboard"}
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-white border border-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Become a vendor
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {AVATARS.map(a => (
                  <span
                    key={a.initial}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper text-[10px] font-bold text-white"
                    style={{ background: a.color }}
                  >
                    {a.initial}
                  </span>
                ))}
              </div>
              <div className="text-xs text-text-soft">
                <strong className="text-ink">2,300+</strong> local vendors
              </div>
            </div>

            <span className="hidden h-6 w-px bg-line sm:block" />

            <span className="inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide">
              <FaTruck className="text-marigold text-sm" />
              Fast delivery
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide">
              <FaShieldAlt className="text-marigold text-sm" />
              Secure payments
            </span>
          </div>
        </div>

        <div className="hero-visual relative order-1 md:order-2 mt-4 md:mt-0">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-2 border-dashed border-marigold/50 animate-spin-slow" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-sun/40" />

          <div className="slash-mask relative h-[340px] sm:h-[420px] md:h-[520px] overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-white shadow-hard-lg">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-1 p-1">
              {CATEGORY_TILES.map((tile, i) => {
                const Icon = tile.icon;

                return broken[i] ? (
                  <div
                    key={tile.label}
                    className="hero-tile group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] border border-ink/10 bg-paper p-4 text-center"
                  >
                    <Icon className="relative h-7 w-7 text-ink/40 transition-transform duration-300 group-hover:scale-110" />
                    <div className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/60">
                      {tile.label}
                    </div>
                    <div className="relative text-[10px] text-text-soft">{tile.caption}</div>
                  </div>
                ) : (
                  <div key={tile.label} className="hero-tile group relative overflow-hidden rounded-[20px] border border-ink/10 bg-paper-dim">
                    <img
                      src={tile.img}
                      alt={tile.label}
                      loading="lazy"
                      onError={() => setBroken(prev => ({ ...prev, [i]: true }))}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                      <div className="flex items-center gap-1.5 text-white">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">
                          {tile.label}
                        </span>
                      </div>
                      <span className="hidden rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white backdrop-blur-sm sm:inline-block">
                        {tile.caption}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="float-card absolute -left-3 top-5 flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-3 py-1.5 shadow-hard-sm sm:-left-5">
            <FaShieldAlt className="h-3.5 w-3.5 text-marigold" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
              Verified vendors
            </span>
          </div>

          <div className="float-card absolute -right-2 bottom-24 w-[190px] rounded-2xl border-[1.5px] border-ink bg-white p-3 shadow-hard sm:bottom-28 sm:-right-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-marigold/15">
                <FaStar className="h-4 w-4 text-marigold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-ink">4.9</span>
                  <span className="flex text-[10px] text-sun">
                    {[0, 1, 2, 3, 4].map(i => (
                      <FaStar key={i} />
                    ))}
                  </span>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wide text-text-soft">
                  12k+ happy orders
                </div>
              </div>
            </div>
          </div>

          <div className="float-card absolute -left-2 bottom-6 flex items-center gap-2.5 rounded-2xl border-[1.5px] border-ink bg-paper px-3.5 py-2.5 shadow-hard-sm sm:-left-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-marigold text-white">
              <FaCheck className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-ink">Order delivered</div>
              <div className="font-mono text-[9px] uppercase tracking-wide text-text-soft">
                Straight from the seller
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="group relative mt-10 md:mt-14 overflow-hidden border-y border-line bg-paper">
        <div className="animate-marquee flex w-max items-center gap-8 py-3 group-hover:[animation-play-state:paused]">
          {ticker.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="inline-flex items-center gap-3 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-text-soft sm:text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}