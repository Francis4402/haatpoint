import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaLock, FaEyeSlash, FaEye, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
function UpdatePasswordForm() {
  const passwordInput = useRef(null);
  const currentPasswordInput = useRef(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        if (errors2.password) {
          reset("password", "password_confirmation");
          passwordInput.current?.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          currentPasswordInput.current?.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-green-100", children: /* @__PURE__ */ jsx(FaLock, { className: "h-6 w-6 text-green-600" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Update Password" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "Secure your account with a new password" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Current Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword.current ? "text" : "password",
              ref: currentPasswordInput,
              value: data.current_password,
              onChange: (e) => setData("current_password", e.target.value),
              className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400",
              placeholder: "Enter current password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword({ ...showPassword, current: !showPassword.current }),
              className: "absolute right-3 top-3 text-gray-500 hover:text-gray-700",
              children: showPassword.current ? /* @__PURE__ */ jsx(FaEyeSlash, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(FaEye, { className: "h-5 w-5" })
            }
          )
        ] }),
        errors.current_password && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-4 w-4" }),
          errors.current_password
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "New Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword.new ? "text" : "password",
              ref: passwordInput,
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400",
              placeholder: "Enter new password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword({ ...showPassword, new: !showPassword.new }),
              className: "absolute right-3 top-3 text-gray-500 hover:text-gray-700",
              children: showPassword.new ? /* @__PURE__ */ jsx(FaEyeSlash, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(FaEye, { className: "h-5 w-5" })
            }
          )
        ] }),
        errors.password && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-4 w-4" }),
          errors.password
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm New Password" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword.confirm ? "text" : "password",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400",
              placeholder: "Confirm new password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword({ ...showPassword, confirm: !showPassword.confirm }),
              className: "absolute right-3 top-3 text-gray-500 hover:text-gray-700",
              children: showPassword.confirm ? /* @__PURE__ */ jsx(FaEyeSlash, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(FaEye, { className: "h-5 w-5" })
            }
          )
        ] }),
        errors.password_confirmation && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-4 w-4" }),
          errors.password_confirmation
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Password Requirements:" }),
        /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${data.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}` }),
            "At least 8 characters"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${/[A-Z]/.test(data.password) ? "bg-green-500" : "bg-gray-300"}` }),
            "At least one uppercase letter"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${/[0-9]/.test(data.password) ? "bg-green-500" : "bg-gray-300"}` }),
            "At least one number"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Updating..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5" }),
              "Update Password"
            ] })
          }
        ),
        recentlySuccessful && /* @__PURE__ */ jsxs("span", { className: "text-green-600 font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5" }),
          "Password updated successfully"
        ] })
      ] })
    ] })
  ] });
}
export {
  UpdatePasswordForm as default
};
