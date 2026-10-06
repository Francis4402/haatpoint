import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useState, useRef, Fragment } from "react";
import { useForm } from "@inertiajs/react";
import { Transition, Dialog } from "@headlessui/react";
import { FaTrash, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
function DeleteUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const passwordInput = useRef(null);
  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors
  } = useForm({
    password: ""
  });
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-red-100", children: /* @__PURE__ */ jsx(FaTrash, { className: "h-6 w-6 text-red-600" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Delete Account" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "Permanently remove your account and all associated data" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-red-800 mb-2", children: "Warning: This action cannot be undone" }),
        /* @__PURE__ */ jsx("p", { className: "text-red-700", children: "Once you delete your account, all of your data including profile information, activity history, and personal settings will be permanently removed. This action cannot be reversed." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: openModal,
        className: "w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3",
        children: [
          /* @__PURE__ */ jsx(FaTrash, { className: "h-5 w-5" }),
          "Delete Account"
        ]
      }
    ),
    /* @__PURE__ */ jsx(Transition, { show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: closeModal, children: [
      /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0 scale-95",
          enterTo: "opacity-100 scale-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100 scale-100",
          leaveTo: "opacity-0 scale-95",
          children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-6 w-6 text-red-600" }) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Dialog.Title, { className: "text-xl font-bold text-gray-900", children: "Delete Your Account" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "This action is permanent and cannot be undone" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: deleteUser, className: "space-y-6 mt-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Enter your password to confirm" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    ref: passwordInput,
                    value: data.password,
                    onChange: (e) => setData("password", e.target.value),
                    className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200",
                    placeholder: "Your current password",
                    autoFocus: true
                  }
                ),
                errors.password && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "By deleting your account, you will lose access to:" }),
                /* @__PURE__ */ jsxs("ul", { className: "mt-2 text-sm text-gray-600 space-y-1", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
                    "All stored data and preferences"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
                    "Purchase history and orders"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-gray-400 rounded-full" }),
                    "Subscription and billing information"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: closeModal,
                    className: "px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                    children: processing ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
                      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                      "Deleting..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
                      /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5" }),
                      "Confirm Deletion"
                    ] })
                  }
                )
              ] })
            ] })
          ] })
        }
      ) }) })
    ] }) })
  ] });
}
export {
  DeleteUserForm as default
};
