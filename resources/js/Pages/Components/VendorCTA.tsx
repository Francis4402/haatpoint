import { FaArrowRight } from "react-icons/fa";
import Eyebrow from "./Eyebrow";
import useRevealChildren from "@/Components/useRevealChildren";

export default function VendorCTA() {
  const ref = useRevealChildren({ y: 20, duration: 0.7, stagger: 0.1 });

  return (
    <div className="pt-20">
      <section className="relative overflow-hidden py-20 bg-ink text-paper" id="sell">
        <div className="absolute right-[-120px] top-[-160px] w-[420px] h-[420px] bg-marigold opacity-90 clip-cta" />
        <div
          ref={ref}
          className="relative z-10 max-w-[1240px] mx-auto px-8"
        >
          <div className="max-w-[560px]">
            <Eyebrow dark>For sellers</Eyebrow>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[50px] text-paper mb-4">
              Bring your stall to
              <br />
              every phone in the country.
            </h2>
            <p className="text-[#B9B7B0] text-base mb-7 leading-relaxed">
              No booth rent, no middlemen. Set your own prices, list in minutes, and get paid
              directly — Haatpoint just brings the buyers to you.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-sm px-[26px] py-[15px] font-bold text-sm bg-marigold text-white shadow-hard-marigold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Open your shop <FaArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
