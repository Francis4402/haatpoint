import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
const footerCols = [
  {
    heading: "Shop",
    links: [
      { label: "Categories", href: "/products" },
      // no dedicated /categories route — points to products for now
      { label: "Featured", href: "#" },
      // TODO: no route yet
      { label: "Trending", href: "/hotdeals" },
      // products.hotdeals
      { label: "Daily discover", href: "#" }
      // TODO: no route yet
    ]
  },
  {
    heading: "Vendors",
    links: [
      { label: "Start selling", href: "/dashboard/stores/storeform" },
      // dashboard.createstore (auth-protected)
      { label: "Vendor dashboard", href: "/dashboard/stores" },
      // dashboard.store (auth-protected)
      { label: "Payout schedule", href: "#" }
      // TODO: no route yet
    ]
  },
  {
    heading: "Support",
    links: [
      { label: "Track an order", href: "/track-order" },
      // trackorder.index
      { label: "Returns", href: "#" },
      // TODO: no route yet
      { label: "Contact us", href: "/contactus" }
      // contact.index
    ]
  }
];
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "pt-20 pb-7 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-3.5", children: [
          /* @__PURE__ */ jsx("img", { src: "/MyLogo.png", alt: "Haatpoint", className: "h-[30px] w-auto" }),
          /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-xl uppercase", children: "Haatpoint" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm max-w-[260px] leading-relaxed", children: "The open-air haat, rebuilt for the internet. Thousands of independent vendors, one checkout." })
      ] }),
      footerCols.map((col) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "font-mono text-[11px] uppercase tracking-widest text-text-soft mb-3.5", children: col.heading }),
        col.links.map(
          (l) => l.href === "#" ? /* @__PURE__ */ jsx(
            "span",
            {
              className: "block mb-2.5 text-sm text-text-soft/50 cursor-default",
              title: "Coming soon",
              children: l.label
            },
            l.label
          ) : /* @__PURE__ */ jsx(
            Link,
            {
              href: l.href,
              className: "block mb-2.5 text-sm text-text-soft hover:text-marigold transition-colors",
              children: l.label
            },
            l.label
          )
        )
      ] }, col.heading))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between flex-wrap gap-2.5 pt-5 border-t border-line font-mono text-xs text-text-soft", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Haatpoint. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsx(Link, { href: "/privacy-policy", className: "hover:text-marigold transition-colors", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx(Link, { href: "/terms-and-conditions", className: "hover:text-marigold transition-colors", children: "Terms of Service" }),
        /* @__PURE__ */ jsx("span", { children: "Dhaka · Chattogram" })
      ] })
    ] })
  ] }) });
}
export {
  Footer as default
};
