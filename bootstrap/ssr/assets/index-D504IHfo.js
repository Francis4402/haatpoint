import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head } from "@inertiajs/react";
import { FaTruck, FaShippingFast, FaDollarSign, FaBox, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeightHanging } from "react-icons/fa";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const getOrderBadge = (status) => {
  const map = {
    pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", cls: "bg-blue-100 text-blue-800" },
    confirmed: { label: "Confirmed", cls: "bg-indigo-100 text-indigo-800" },
    shipped: { label: "Shipped", cls: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-800" }
  };
  return map[status] ?? { label: status, cls: "bg-gray-100 text-gray-800" };
};
const resolveImage = (raw) => {
  if (!raw) return "";
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return `/storage/${raw}`;
};
const Shipping = ({ orders = [], auth }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const shippedOrders = orders.filter((o) => o.order_status === "shipped");
  const itemsInTransit = shippedOrders.reduce((sum, o) => sum + (o.order_items?.length ?? 0), 0);
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Shipping Management" }),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Manage shipping" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Shipping" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Orders with shipped order status" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Shipped Orders" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: shippedOrders.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaTruck, { className: "h-6 w-6 text-purple-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Products In Transit" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: itemsInTransit })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaShippingFast, { className: "h-6 w-6 text-orange-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total In Transit" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: shippedOrders.reduce((sum, o) => sum + (o.total || 0), 0) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-marigold" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Shipped Products" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft font-mono", children: [
            itemsInTransit,
            " products"
          ] })
        ] }),
        shippedOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(FaBox, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Shipped Products" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "Products will appear here once the order status is set to shipped." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: shippedOrders.flatMap(
          (order) => (order.order_items ?? []).map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 bg-white",
              onClick: () => setSelectedOrder(order),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl overflow-hidden border border-line flex-shrink-0 bg-paper-dim", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: resolveImage(item.product_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`,
                      alt: item.product_name,
                      className: "w-full h-full object-cover"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-semibold text-ink truncate", children: item.product_name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-0.5", children: [
                      /* @__PURE__ */ jsx(FaBox, { className: "h-3 w-3 inline mr-1" }),
                      "Qty: ",
                      item.quantity
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft truncate mr-2", children: [
                    "Order #",
                    order.order_number
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getOrderBadge(order.order_status).cls}`, children: [
                    /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3" }),
                    getOrderBadge(order.order_status).label
                  ] })
                ] })
              ]
            },
            item.id
          ))
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: selectedOrder && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Order Details" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedOrder(null),
              className: "p-1 text-text-soft hover:text-marigold rounded-lg hover:bg-paper-dim transition-colors",
              children: /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-lg font-bold text-ink", children: [
                  "Order #",
                  selectedOrder.order_number
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-1 space-x-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getOrderBadge(selectedOrder.order_status).cls}`, children: [
                    /* @__PURE__ */ jsx(FaTruck, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsx("span", { children: getOrderBadge(selectedOrder.order_status).label })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedOrder.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: selectedOrder.payment_status === "paid" ? "Paid" : selectedOrder.payment_status })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.total }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "Total Amount" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Customer Information" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx(FaUser, { className: "h-4 w-4 text-text-soft mr-3" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedOrder.recipient_name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Customer Name" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-text-soft mr-3" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedOrder.recipient_email }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Email Address" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 text-text-soft mr-3" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedOrder.recipient_phone }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Phone Number" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Shipping Information" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-3 bg-marigold/5 rounded-xl border border-marigold/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
                  /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 text-marigold mr-2" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Delivery Address" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: selectedOrder.recipient_address }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-2", children: [
                  "City: ",
                  selectedOrder.recipient_city,
                  " • Zone: ",
                  selectedOrder.recipient_zone,
                  " • Area: ",
                  selectedOrder.recipient_area
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Shipping Method" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink capitalize", children: selectedOrder.shipping_method?.replace(/_/g, " ") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Tracking Number" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink truncate", title: selectedOrder.tracking_number, children: selectedOrder.tracking_number || "—" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Item Weight" }),
                  /* @__PURE__ */ jsxs("p", { className: "font-medium text-ink", children: [
                    /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-3 w-3 inline mr-1 text-text-soft" }),
                    selectedOrder.item_weight,
                    " kg"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Item Quantity" }),
                  /* @__PURE__ */ jsxs("p", { className: "font-medium text-ink", children: [
                    /* @__PURE__ */ jsx(FaBox, { className: "h-3 w-3 inline mr-1 text-text-soft" }),
                    selectedOrder.item_quantity
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3 mt-6", children: [
              "Order Items (",
              selectedOrder.order_items?.length ?? 0,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (selectedOrder.order_items ?? []).map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl border border-line", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded overflow-hidden mr-3 border border-line", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: resolveImage(item.product_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`,
                  alt: item.product_name,
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: item.product_name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
                  "Qty: ",
                  item.quantity
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) }) })
            ] }, item.id)) })
          ] })
        ] })
      ] }) }),
      !selectedOrder && shippedOrders.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-2", children: "Select a product or order" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300", children: "Click on any shipped product above to view detailed shipping information, tracking details, and customer information." })
      ] })
    ] }) })
  ] });
};
export {
  Shipping as default
};
