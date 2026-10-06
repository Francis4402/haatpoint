import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head } from "@inertiajs/react";
import { FaCheckCircle, FaDollarSign, FaClock, FaCreditCard, FaExclamationTriangle, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaBox, FaAddressCard, FaEnvelope, FaPhone } from "react-icons/fa";
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
const getPaymentBadge = (status) => {
  const map = {
    paid: { label: "Paid", cls: "bg-green-100 text-green-800" },
    pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-800" },
    failed: { label: "Failed", cls: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", cls: "bg-gray-100 text-gray-800" }
  };
  return map[status] ?? { label: status, cls: "bg-gray-100 text-gray-800" };
};
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
const Payments = ({ orders = [], auth }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalPaid = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPending = orders.filter((o) => o.payment_status !== "paid").reduce((sum, o) => sum + o.total, 0);
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Payment Management" }),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Manage payments" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Payments" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Orders with paid payment status" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Paid Orders" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: paidOrders.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 text-green-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Paid Amount" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: totalPaid }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Unpaid Amount" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: totalPending }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaClock, { className: "h-6 w-6 text-yellow-600" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Paid Orders" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft font-mono", children: [
              orders.length,
              " orders"
            ] })
          ] }),
          orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaCreditCard, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Payment Orders" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "Orders will appear here once payment status is set to paid." })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: orders.map((order) => {
            const paymentBadge = getPaymentBadge(order.payment_status);
            const orderBadge = getOrderBadge(order.order_status);
            const isPaid = order.payment_status === "paid";
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: `border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${selectedOrder?.id === order.id ? "ring-2 ring-marigold bg-marigold/5" : ""} ${isPaid ? "border-green-200" : ""}`,
                onClick: () => setSelectedOrder(order),
                children: /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-ink", children: [
                          "Order #",
                          order.order_number
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentBadge.cls}`, children: [
                          isPaid ? /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-3 w-3" }),
                          /* @__PURE__ */ jsx("span", { children: paymentBadge.label })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${orderBadge.cls}`, children: orderBadge.label })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft mt-1", children: [
                        /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-3 w-3 inline mr-1" }),
                        "Placed: ",
                        new Date(order.created_at).toLocaleDateString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Total Amount" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-text-soft mb-1", children: [
                      /* @__PURE__ */ jsx(FaUser, { className: "h-3 w-3 mr-2" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: order.recipient_name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-text-soft", children: [
                      /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-3 w-3 mr-2" }),
                      /* @__PURE__ */ jsx("span", { children: order.recipient_address })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-paper-dim rounded-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(FaBox, { className: "h-3 w-3 text-text-soft mr-1" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Items" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: order.item_quantity })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-paper-dim rounded-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(FaCreditCard, { className: "h-3 w-3 text-text-soft mr-1" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Payment" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm capitalize", children: order.payment_method?.replace(/_/g, " ") })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-paper-dim rounded-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(FaAddressCard, { className: "h-3 w-3 text-text-soft mr-1" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Store" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm truncate", children: order.store_name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-paper-dim rounded-xl", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(FaDollarSign, { className: "h-3 w-3 text-text-soft mr-1" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Delivery" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
                    ] })
                  ] })
                ] }) })
              },
              order.id
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: selectedOrder ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Payment Details" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedOrder(null),
                className: "p-1 text-text-soft hover:text-marigold rounded-lg hover:bg-paper-dim transition-colors",
                children: /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-lg font-bold text-ink", children: [
                "Order #",
                selectedOrder.order_number
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-1 space-x-2", children: [
                /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadge(selectedOrder.payment_status).cls}`, children: getPaymentBadge(selectedOrder.payment_status).label }),
                /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOrderBadge(selectedOrder.order_status).cls}`, children: getOrderBadge(selectedOrder.order_status).label })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.total }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "Total Amount" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
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
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Delivery Address" }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-marigold/5 rounded-xl border border-marigold/20", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
                /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 text-marigold mr-2" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Address" })
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
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Payment Breakdown" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: "Subtotal" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.subtotal }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: "Delivery Charge" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.delivery_charge }) })
              ] }),
              Number(selectedOrder.discount_amount) > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: "Discount" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-ink", children: [
                  "-",
                  /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.discount_amount })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-800", children: "Total" }),
                /* @__PURE__ */ jsx("span", { className: "font-bold text-green-800", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedOrder.total }) })
              ] })
            ] })
          ] }),
          selectedOrder.order_items && selectedOrder.order_items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: [
              "Order Items (",
              selectedOrder.order_items.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: selectedOrder.order_items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl border border-line", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded overflow-hidden mr-3 border border-line", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.product_image ? item.product_image.startsWith("http") || item.product_image.startsWith("/") ? item.product_image : `/storage/${item.product_image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`,
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
        ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4", children: "Payment Details" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300 mb-6", children: "Select an order from the list to view detailed payment information, delivery details, and customer information." }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(FaCreditCard, { className: "h-16 w-16 mx-auto mb-4 opacity-50" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No order selected" })
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
};
export {
  Payments as default
};
