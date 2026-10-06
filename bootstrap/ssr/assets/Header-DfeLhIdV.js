import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { IoIosSearch } from "react-icons/io";
import { MdShoppingCartCheckout } from "react-icons/md";
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-[100] bg-paper/90 backdrop-blur-md border-b border-line", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto flex items-center justify-between gap-6 px-8 py-3.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [
      /* @__PURE__ */ jsx("img", { src: "/MyLogo.png", alt: "Haatpoint logo", className: "h-[34px] w-auto" }),
      /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-[22px] tracking-[-0.01em] uppercase", children: "Haatpoint" })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "hidden md:flex gap-7 text-sm font-semibold", children: [
      ["Categories", "#categories"],
      ["Featured", "#featured"],
      ["Trending", "#trending"],
      ["Today", "#discover"]
    ].map(([label, href]) => /* @__PURE__ */ jsx(
      "a",
      {
        href,
        className: "relative py-1 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-marigold after:transition-[width] after:duration-200 hover:after:w-full hover:text-marigold-dark",
        children: label
      },
      label
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 flex-1 max-w-sm rounded-sm px-3.5 py-2 bg-white border-[1.5px] border-ink", children: [
      /* @__PURE__ */ jsx(IoIosSearch, { size: 15, className: "text-ink shrink-0" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search vendors, products, deals…",
          className: "w-full outline-none text-sm bg-transparent font-body"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 shrink-0", children: [
      /* @__PURE__ */ jsx(MdShoppingCartCheckout, { size: 20, className: "text-ink cursor-pointer" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "#sell",
          className: "whitespace-nowrap rounded-sm px-[18px] py-2.5 text-sm font-bold bg-ink text-paper",
          children: "Sell on Haatpoint"
        }
      )
    ] })
  ] }) });
}
export {
  Header as default
};
