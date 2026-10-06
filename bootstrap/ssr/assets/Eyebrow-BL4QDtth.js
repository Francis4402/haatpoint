import { jsxs, jsx } from "react/jsx-runtime";
function Eyebrow({ children, dark = false }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-center gap-2.5 mb-3.5 font-mono text-xs tracking-[0.14em] uppercase ${dark ? "text-sun" : "text-marigold-dark"}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "w-[22px] h-[2px] bg-marigold inline-block" }),
        children
      ]
    }
  );
}
export {
  Eyebrow as default
};
