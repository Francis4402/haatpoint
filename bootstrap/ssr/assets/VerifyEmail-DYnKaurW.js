import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { W as WhatsAppChatButton } from "./WhatsAppChatButton-CDSWQr0H.js";
import { A as ApplicationLogo } from "./ApplicationLogo-xMpxFOcX.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import { FaTriangleExclamation, FaCircleCheck, FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import "react-icons/fa";
function VerifyEmail({ status, flash, auth }) {
  const { post, processing } = useForm({});
  const [showHelp, setShowHelp] = useState(false);
  const email = auth?.user?.email;
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"), {
      preserveScroll: true,
      onSuccess: () => setShowHelp(false)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10 sm:py-16", children: [
    /* @__PURE__ */ jsx(Head, { title: "Verify your email" }),
    /* @__PURE__ */ jsx(Link, { href: "/", className: "mb-8", children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-14 w-14 fill-current text-ink" }) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-line shadow-hard overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-8 sm:px-10 sm:py-10", children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Almost there" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[28px] sm:text-[34px] font-display font-extrabold uppercase tracking-[-0.01em] text-ink leading-tight", children: "Verify your email" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-text-soft", children: "Confirm your address to start shopping, adding products to your cart and, if you are a vendor, opening your store." }),
          flash?.error && /* @__PURE__ */ jsxs(
            "div",
            {
              role: "alert",
              className: "mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
              children: [
                /* @__PURE__ */ jsx(FaTriangleExclamation, { className: "h-5 w-5 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsx("p", { children: flash.error })
              ]
            }
          ),
          status === "verification-link-sent" && /* @__PURE__ */ jsxs(
            "div",
            {
              role: "status",
              className: "mt-6 flex items-start gap-3 rounded-xl border border-marigold/30 bg-marigold/10 px-4 py-3 text-sm text-marigold-dark",
              children: [
                /* @__PURE__ */ jsx(FaCircleCheck, { className: "h-5 w-5 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "A fresh verification link is on its way to",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold", children: email }),
                  "."
                ] })
              ]
            }
          ),
          email && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl border border-line bg-paper-dim px-4 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-[0.14em] text-text-soft", children: "We sent the link to" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-2 font-medium text-ink break-all", children: [
              /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 flex-shrink-0 text-marigold" }),
              email
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-7", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: submit,
              disabled: processing,
              className: "inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-ink text-white font-medium transition-all duration-300 hover:bg-marigold hover:text-ink disabled:opacity-50 sm:w-auto",
              children: [
                /* @__PURE__ */ jsx(FaPaperPlane, { className: "h-4 w-4" }),
                processing ? "Sending..." : "Resend verification email"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowHelp((v) => !v),
              "aria-expanded": showHelp,
              className: "mt-4 inline-flex items-center gap-2 text-sm text-text-soft hover:text-ink transition-colors",
              children: [
                /* @__PURE__ */ jsx(HiOutlineQuestionMarkCircle, { className: "h-4 w-4" }),
                showHelp ? "Hide troubleshooting" : "I have not received the email"
              ]
            }
          ),
          showHelp && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-line bg-paper-dim px-4 py-4 text-sm text-text-soft space-y-2", children: [
            /* @__PURE__ */ jsx("p", { children: "Check these before asking us to resend:" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
              /* @__PURE__ */ jsx("li", { children: "Your spam or junk folder." }),
              /* @__PURE__ */ jsxs("li", { children: [
                "Any filter forwarding mail away from",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: email }),
                "."
              ] }),
              /* @__PURE__ */ jsx("li", { children: "That you signed up with this exact address." })
            ] }),
            /* @__PURE__ */ jsx("p", { children: "Still nothing? Our mail server may be temporarily unavailable, in which case resending will say so." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper-dim px-6 py-4 sm:px-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Signed up with Google? Your address is already verified." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("dashboard"),
              className: "text-sm font-medium text-ink underline underline-offset-4 hover:text-marigold-dark",
              children: "Back to dashboard"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(WhatsAppChatButton, {})
    ] })
  ] });
}
export {
  VerifyEmail as default
};
