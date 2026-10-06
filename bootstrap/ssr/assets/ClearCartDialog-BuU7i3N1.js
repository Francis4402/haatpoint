import { jsx, jsxs } from "react/jsx-runtime";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";
const ClearCartDialog = ({ isOpen, confirmClearCart, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  return /* @__PURE__ */ jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: handleClose, children: [
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
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-ink/50 backdrop-blur-sm" })
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
        children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-hard-sm border border-line transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4", children: /* @__PURE__ */ jsx(FaTrash, { className: "h-6 w-6 text-red-600" }) }),
              /* @__PURE__ */ jsx(
                Dialog.Title,
                {
                  as: "h3",
                  className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink",
                  children: "Clear Shopping Cart"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleClose,
                className: "text-text-soft hover:text-ink transition-colors p-1 rounded-lg hover:bg-paper-dim",
                children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft leading-relaxed", children: "You're about to remove all items from your cart. This action cannot be undone." }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex space-x-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-text-soft hover:bg-paper-dim hover:text-ink transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 flex-1",
                onClick: handleClose,
                children: "Keep Items"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "inline-flex justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-hard-sm flex-1 items-center",
                onClick: confirmClearCart,
                children: [
                  /* @__PURE__ */ jsx(FaTrash, { className: "h-4 w-4 mr-2" }),
                  "Clear Cart"
                ]
              }
            )
          ] })
        ] })
      }
    ) }) })
  ] }) });
};
export {
  ClearCartDialog as default
};
