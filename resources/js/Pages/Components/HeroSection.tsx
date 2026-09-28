import { useRef } from "react";
import { FaArrowRight, FaTruck, FaShieldAlt } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";

const collage = [
  { label: "Fresh", c1: "#6E7F5C", c2: "#57654A" },
  { label: "Tech", c1: "#4F6B63", c2: "#3E5350" },
  { label: "Home", c1: "#C9B37E", c2: "#A0844A" },
  { label: "Wear", c1: "#1B1B1B", c2: "#1B1B1B" },
];

export default function Hero() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-copy > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
      })
        .from(
          ".hero-visual .slash-mask",
          { opacity: 0, x: 40, scale: 0.97, duration: 0.8 },
          "-=0.5"
        )
        .from(
          ".hero-visual .float-card",
          { opacity: 0, y: 12, scale: 0.9, duration: 0.5, stagger: 0.15 },
          "-=0.35"
        );
    },
    { scope }
  );

  return (
    <section className="relative pt-10 md:pt-16 overflow-hidden" ref={scope}>
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
        <div className="hero-copy order-2 md:order-1">
          <span className="inline-block font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-marigold mb-4">
            Your neighborhood, online
          </span>

          <h1 className="text-[36px] sm:text-[52px] lg:text-[76px] leading-[0.95]">
            Shop local
            <br />
            <span className="text-marigold">products</span> from
            <br />
            your <span className="underline decoration-marigold decoration-4">haat</span>
          </h1>

          <p className="text-text-soft text-[15px] sm:text-[17px] max-w-[440px] my-5 sm:my-6 leading-relaxed">
            Everything from fresh produce to electronics, sold directly by verified
            local vendors, with no middlemen. Better prices, faster delivery, and
            every order goes straight to the seller.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 items-center mb-7 sm:mb-8">
            <Link
              href={route('products.index')}
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-marigold  text-white border border-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Start shopping <FaArrowRight size={14} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm shadow-hard border border-ink transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Become a vendor
            </Link>
          </div>

          {/* Shopping Benefits */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
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

        {/* Visual */}
        <div className="hero-visual relative h-[300px] sm:h-[360px] md:h-[480px] mt-4 md:mt-0 order-1 md:order-2">
          <div className="slash-mask clip-hero absolute inset-0 rounded-md overflow-hidden bg-ink">
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 absolute inset-0 bg-ink">
              {collage.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center px-2 text-center font-mono text-[11px] sm:text-[13px] font-semibold uppercase tracking-wider text-white/90"
                  style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Category Card */}
          <div className="float-card absolute bottom-6 sm:bottom-8 -left-2 sm:-left-4 bg-white border-[1.5px] border-ink rounded px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-hard-sm">
            <div>
              <div>
                <strong className="text-xs sm:text-sm block">All categories</strong>
                <small className="font-mono text-[9px] sm:text-[10px] text-text-soft">
                  Every seller, one marketplace
                </small>
              </div>
            </div>

            {/* Free Delivery Badge */}
          <div className="float-card absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-line rounded-full px-3 py-1.5 shadow-hard-sm">
            <span className="text-[10px] font-bold uppercase">Secure delivery</span>
          </div>
          </div>
        </div>
      </div>

    </section>
  );
}
