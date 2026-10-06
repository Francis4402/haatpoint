import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { FaArrowRight, FaTruck, FaShieldAlt } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "@inertiajs/react";
const collage = [
  { label: "Fresh", c1: "#6E7F5C", c2: "#57654A" },
  { label: "Tech", c1: "#4F6B63", c2: "#3E5350" },
  { label: "Home", c1: "#C9B37E", c2: "#A0844A" },
  { label: "Wear", c1: "#1B1B1B", c2: "#1B1B1B" }
];
function Hero(user) {
  const scope = useRef(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-copy > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12
      }).from(
        ".hero-visual .slash-mask",
        { opacity: 0, x: 40, scale: 0.97, duration: 0.8 },
        "-=0.5"
      ).from(
        ".hero-visual .float-card",
        { opacity: 0, y: 12, scale: 0.9, duration: 0.5, stagger: 0.15 },
        "-=0.35"
      );
    },
    { scope }
  );
  return /* @__PURE__ */ jsx("section", { className: "relative pt-10 md:pt-16 overflow-hidden", ref: scope, children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "hero-copy order-2 md:order-1", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-block font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-marigold mb-4", children: "Your neighborhood, online" }),
      /* @__PURE__ */ jsxs("h1", { className: "text-[36px] sm:text-[52px] lg:text-[76px] leading-[0.95]", children: [
        "Shop local",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-marigold", children: "products" }),
        " from",
        /* @__PURE__ */ jsx("br", {}),
        "your ",
        /* @__PURE__ */ jsx("span", { className: "underline decoration-marigold decoration-4", children: "haat" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-text-soft text-[15px] sm:text-[17px] max-w-[440px] my-5 sm:my-6 leading-relaxed", children: "Everything from fresh produce to electronics, sold directly by verified local vendors, with no middlemen. Better prices, faster delivery, and every order goes straight to the seller." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-center mb-7 sm:mb-8", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("products.index"),
            className: "inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm bg-marigold  text-white border border-ink shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
            children: [
              "Start shopping ",
              /* @__PURE__ */ jsx(FaArrowRight, { size: 14 })
            ]
          }
        ),
        user ? /* @__PURE__ */ jsx(
          Link,
          {
            href: "/agent/register",
            className: "inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm shadow-hard border border-ink transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
            children: "Become a vendor"
          }
        ) : /* @__PURE__ */ jsx(
          Link,
          {
            href: "/dashboard",
            className: "inline-flex items-center gap-2 rounded-sm px-[22px] sm:px-[26px] py-[13px] sm:py-[15px] font-bold text-sm shadow-hard border border-ink transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
            children: "Become a vendor"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 sm:gap-6", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide", children: [
          /* @__PURE__ */ jsx(FaTruck, { className: "text-marigold text-sm" }),
          "Fast delivery"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-text-soft font-mono text-[10px] sm:text-[11.5px] uppercase tracking-wide", children: [
          /* @__PURE__ */ jsx(FaShieldAlt, { className: "text-marigold text-sm" }),
          "Secure payments"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hero-visual relative h-[300px] sm:h-[360px] md:h-[480px] mt-4 md:mt-0 order-1 md:order-2", children: [
      /* @__PURE__ */ jsx("div", { className: "slash-mask clip-hero absolute inset-0 rounded-md overflow-hidden bg-ink", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 grid-rows-2 gap-0.5 absolute inset-0 bg-ink", children: collage.map((c, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex items-center justify-center px-2 text-center font-mono text-[11px] sm:text-[13px] font-semibold uppercase tracking-wider text-white/90",
          style: { background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` },
          children: c.label
        },
        i
      )) }) }),
      /* @__PURE__ */ jsxs("div", { className: "float-card absolute bottom-6 sm:bottom-8 -left-2 sm:-left-4 bg-white border-[1.5px] border-ink rounded px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-hard-sm", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-xs sm:text-sm block", children: "All categories" }),
          /* @__PURE__ */ jsx("small", { className: "font-mono text-[9px] sm:text-[10px] text-text-soft", children: "Every seller, one marketplace" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "float-card absolute top-1 left-2 bg-white/90 backdrop-blur-sm border border-line rounded-full px-3 py-1.5 shadow-hard-sm", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase", children: "Secure delivery" }) })
      ] })
    ] })
  ] }) });
}
export {
  Hero as default
};
