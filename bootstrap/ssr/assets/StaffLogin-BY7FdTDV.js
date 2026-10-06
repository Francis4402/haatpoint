import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { W as WhatsAppChatButton } from "./WhatsAppChatButton-CDSWQr0H.js";
import { FaEnvelope, FaExclamationCircle, FaLock, FaEyeSlash, FaEye, FaSpinner, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import { S as SocialButtons } from "./SocialButtons-E2ia8iL2.js";
const LABELS = {
  superadmin: "Superadmin",
  admin: "Admin & Superadmin",
  agent: "Agent"
};
function StaffLogin({ type, status, canRegister }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route(`${type}.login`), {
      onSuccess: () => {
        toast.success("Welcome back!");
      },
      onError: () => {
        toast.error("Invalid credentials");
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(Head, { title: `${LABELS[type]} Login` }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "inline-flex items-center justify-center gap-2.5 group", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/MyLogo.png",
              alt: "Haatpoint",
              className: "h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-[44px] font-display font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink", children: "HaatPoint" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-ink/60 mt-2 font-body", children: [
          "Sign in to your ",
          LABELS[type],
          " account"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-ink/10 p-8", children: [
        status && /* @__PURE__ */ jsx("div", { className: "mb-6 p-3 rounded-lg bg-ink/5 border border-ink/10", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-ink text-center", children: status }) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-body font-semibold text-ink mb-1.5", children: "Email address" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-ink/40" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "email",
                  type: "email",
                  name: "email",
                  value: data.email,
                  autoComplete: "username",
                  autoFocus: true,
                  onChange: (e) => setData("email", e.target.value),
                  className: "block w-full pl-10 pr-3 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body",
                  placeholder: "you@example.com"
                }
              )
            ] }),
            errors.email && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-sm text-red-600 flex items-center", children: [
              /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3.5 w-3.5 mr-1" }),
              errors.email
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-1.5", children: /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-body font-semibold text-ink", children: "Password" }) }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FaLock, { className: "h-4 w-4 text-ink/40" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  name: "password",
                  value: data.password,
                  autoComplete: "current-password",
                  onChange: (e) => setData("password", e.target.value),
                  className: "block w-full pl-10 pr-10 py-2.5 border border-ink/20 rounded-lg bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all font-body",
                  placeholder: "Enter your password"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink transition-colors",
                  children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(FaEye, { className: "h-4 w-4" })
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-sm text-red-600 flex items-center", children: [
              /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3.5 w-3.5 mr-1" }),
              errors.password
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "remember",
                name: "remember",
                type: "checkbox",
                checked: data.remember,
                onChange: (e) => setData("remember", e.target.checked),
                className: "h-4 w-4 text-marigold focus:ring-marigold border-ink/20 rounded bg-paper"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "remember", className: "ml-2 block text-sm font-body text-ink/80", children: "Remember me" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-body font-bold uppercase tracking-wide text-white bg-ink hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
              children: processing ? /* @__PURE__ */ jsx(FaSpinner, { className: "animate-spin h-4 w-4" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Sign in",
                /* @__PURE__ */ jsx(FaArrowRight, { className: "ml-2 h-3.5 w-3.5" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(SocialButtons, { destination: type }),
        type === "agent" || canRegister ? /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm font-body text-ink/60", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route(type === "agent" ? "agent.register" : type === "superadmin" ? "superadmin.register" : "admin.register"),
              className: "font-body font-bold text-marigold hover:text-marigold-dark transition-colors",
              children: "Create one"
            }
          )
        ] }) : /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-sm font-body text-ink/60", children: "Admin accounts are created by a superadmin. Registration is closed." })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-xs font-body text-ink/30 tracking-wide", children: [
        LABELS[type],
        " portal • Protected by SSL encryption"
      ] })
    ] }),
    /* @__PURE__ */ jsx(WhatsAppChatButton, {})
  ] });
}
export {
  StaffLogin as default
};
