import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { FaGoogle } from "react-icons/fa";
const PROVIDERS = [
  { id: "google", label: "Google", icon: FaGoogle, iconColor: "text-red-500" }
];
function SocialButtons({ destination = "user" }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-ink/10" }) }),
      /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-4 bg-white text-ink/40 font-body", children: "or continue with" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: PROVIDERS.map(({ id, label, icon: Icon, iconColor }) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          window.location.href = route("auth.redirect", { provider: id, destination });
        },
        className: "w-full flex items-center justify-center gap-2 py-3 px-4 border border-ink/20 rounded-lg shadow-sm text-sm font-body font-semibold text-ink bg-white hover:bg-paper transition-colors",
        children: [
          /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${iconColor}` }),
          "Continue with ",
          label
        ]
      },
      id
    )) })
  ] });
}
export {
  SocialButtons as S
};
