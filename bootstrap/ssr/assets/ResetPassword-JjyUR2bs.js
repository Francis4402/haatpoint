import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import { W as WhatsAppChatButton } from "./WhatsAppChatButton-CDSWQr0H.js";
import { FaLock, FaEnvelope, FaKey, FaArrowLeft } from "react-icons/fa";
import { T as TextInput, I as InputError, P as PrimaryButton } from "./TextInput-DsRRXTUf.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"));
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Head, { title: "Reset Password" }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8 bg-white rounded-2xl shadow-hard-sm p-8 md:p-10 border border-line", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto w-16 h-16 bg-marigold/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(FaLock, { className: "w-8 h-8 text-marigold" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-display font-bold text-ink", children: "Reset Password" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-text-soft", children: "Enter your new password below" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "email",
                value: "Email Address",
                className: "text-sm font-medium text-ink"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FaEnvelope, { className: "h-5 w-5 text-text-soft" }) }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "email",
                  type: "email",
                  name: "email",
                  value: data.email,
                  className: "pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors",
                  autoComplete: "username",
                  onChange: (e) => setData("email", e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "password",
                value: "New Password",
                className: "text-sm font-medium text-ink"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FaKey, { className: "h-5 w-5 text-text-soft" }) }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "password",
                  type: "password",
                  name: "password",
                  value: data.password,
                  className: "pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors",
                  autoComplete: "new-password",
                  isFocused: true,
                  onChange: (e) => setData("password", e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "password_confirmation",
                value: "Confirm Password",
                className: "text-sm font-medium text-ink"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FaLock, { className: "h-5 w-5 text-text-soft" }) }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "password_confirmation",
                  type: "password",
                  name: "password_confirmation",
                  value: data.password_confirmation,
                  className: "pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors",
                  autoComplete: "new-password",
                  onChange: (e) => setData("password_confirmation", e.target.value),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-line", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-2", children: "Password Requirements:" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-xs text-text-soft space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-marigold rounded-full" }),
                "At least 8 characters long"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-marigold rounded-full" }),
                "Contains uppercase and lowercase letters"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-marigold rounded-full" }),
                "Contains at least one number"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-2", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: route("login"),
                className: "inline-flex items-center gap-2 text-sm text-text-soft hover:text-marigold transition-colors font-medium",
                children: [
                  /* @__PURE__ */ jsx(FaArrowLeft, { className: "w-4 h-4" }),
                  "Back to Login"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              PrimaryButton,
              {
                className: "w-full sm:w-auto bg-gray-900 hover:bg-marigold text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 border-0",
                disabled: processing,
                children: processing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                    /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                  ] }),
                  "Resetting..."
                ] }) : "Reset Password"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
          "Remember your password?",
          " ",
          /* @__PURE__ */ jsx("a", { href: route("login"), className: "text-marigold hover:underline font-medium", children: "Sign in" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(WhatsAppChatButton, {})
    ] })
  ] });
}
export {
  ResetPassword as default
};
