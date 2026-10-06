import { jsx, jsxs } from "react/jsx-runtime";
import { FaArrowRight } from "react-icons/fa";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
function useRevealChildren(options = {}) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      const children = gsap.utils.toArray(ref.current.children);
      if (!children.length) return;
      gsap.set(children, { opacity: 0, y: 26 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true
        },
        ...options
      });
    },
    { scope: ref }
  );
  return ref;
}
function VendorCTA() {
  const ref = useRevealChildren({ y: 20, duration: 0.7, stagger: 0.1 });
  return /* @__PURE__ */ jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden py-20 bg-ink text-paper", id: "sell", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-[-120px] top-[-160px] w-[420px] h-[420px] bg-marigold opacity-90 clip-cta" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: "relative z-10 max-w-[1240px] mx-auto px-8",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-[560px]", children: [
          /* @__PURE__ */ jsx(Eyebrow, { dark: true, children: "For sellers" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-[32px] sm:text-[40px] lg:text-[50px] text-paper mb-4", children: [
            "Bring your stall to",
            /* @__PURE__ */ jsx("br", {}),
            "every phone in the country."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[#B9B7B0] text-base mb-7 leading-relaxed", children: "No booth rent, no middlemen. Set your own prices, list in minutes, and get paid directly — Haatpoint just brings the buyers to you." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              className: "inline-flex items-center gap-2 rounded-sm px-[26px] py-[15px] font-bold text-sm bg-marigold text-white shadow-hard-marigold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5",
              children: [
                "Open your shop ",
                /* @__PURE__ */ jsx(FaArrowRight, { size: 14 })
              ]
            }
          )
        ] })
      }
    )
  ] }) });
}
export {
  VendorCTA as default
};
