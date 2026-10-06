import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { FaFaceFrownOpen, FaHouse, FaShop, FaHeadset, FaCompass } from "react-icons/fa6";
import { BiSolidError } from "react-icons/bi";
import "./Navbar-I09bUsbF.js";
import "react";
import "react-icons/fi";
import "@headlessui/react";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
const ERROR_MESSAGES = {
  403: {
    label: "403",
    title: "Access denied",
    sub: "You don't have permission to access this page. If you believe this is a mistake, please get in touch with us."
  },
  404: {
    label: "404",
    title: "Page not found",
    sub: "The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track."
  },
  419: {
    label: "419",
    title: "Session expired",
    sub: "Your session has timed out. Please go back and try again."
  },
  429: {
    label: "429",
    title: "Too many requests",
    sub: "You are sending requests too quickly. Give it a moment and try again."
  },
  500: {
    label: "500",
    title: "Something went wrong",
    sub: "An unexpected error occurred on our end. Our team has been notified — please try again shortly."
  },
  503: {
    label: "503",
    title: "Service unavailable",
    sub: "We are performing maintenance right now. Please check back in a few minutes."
  }
};
function NotFound({ status = 404 }) {
  const { props } = usePage();
  const auth = props.auth;
  const msg = ERROR_MESSAGES[status] ?? ERROR_MESSAGES[404];
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth?.user, wishlist: void 0, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: `${msg.label} | ${msg.title} - HaatPoint`,
        description: "The page you were looking for could not be found. Explore thousands of products from trusted vendors across Bangladesh at HaatPoint.",
        robots: "noindex, nofollow",
        canonical: "https://www.haatpoint.com/",
        ogUrl: "https://www.haatpoint.com/"
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-b from-marigold/10 via-transparent to-transparent overflow-hidden py-24 sm:py-32", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 h-96 w-96 rounded-full bg-marigold/10 blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-marigold/10 blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-2xl bg-marigold/15 border border-marigold/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(BiSolidError, { className: "h-10 w-10 text-marigold", "aria-hidden": "true" }) }) }),
        /* @__PURE__ */ jsxs("p", { className: "font-mono text-sm font-semibold uppercase tracking-widest text-marigold mb-4", children: [
          "Error ",
          msg.label
        ] }),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "font-display font-extrabold uppercase tracking-[-0.02em] text-7xl sm:text-8xl md:text-9xl leading-none bg-gradient-to-b from-marigold to-marigold-dark bg-clip-text text-transparent",
            "aria-label": msg.label,
            children: msg.label
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display font-bold uppercase tracking-[-0.01em] text-ink text-2xl sm:text-3xl", children: msg.title }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(FaFaceFrownOpen, { className: "h-12 w-12 text-ink/30 mt-6 -rotate-12", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto mt-6 text-text-soft text-base sm:text-lg leading-relaxed", children: msg.sub }),
        status === 403 && auth?.user && /* @__PURE__ */ jsxs("p", { className: "text-sm mt-4 text-text-soft", children: [
          "Logged in as ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink capitalize", children: auth.user.role }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/",
              className: "inline-flex items-center gap-2 px-8 py-3.5 bg-marigold text-white rounded-full font-semibold hover:bg-marigold-dark hover:shadow-lg hover:shadow-marigold/30 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(FaHouse, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Back to Home"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/products",
              className: "inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-white rounded-full font-semibold hover:bg-ink/90 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(FaShop, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Browse Products"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/contactus",
              className: "inline-flex items-center gap-2 px-8 py-3.5 bg-white text-ink border border-line rounded-full font-semibold hover:bg-paper-dim hover:border-marigold/40 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(FaHeadset, { className: "h-4 w-4", "aria-hidden": "true" }),
                "Contact Support"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/",
            className: "inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-text-soft hover:text-marigold transition-colors",
            children: [
              /* @__PURE__ */ jsx(FaCompass, { className: "h-4 w-4", "aria-hidden": "true" }),
              "Back to HaatPoint"
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  NotFound as default
};
