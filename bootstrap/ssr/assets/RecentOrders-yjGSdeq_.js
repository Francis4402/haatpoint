import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const RecentOrders = ({ orders, user }) => {
  const filteredOrders = () => {
    if (user.role === "admin" || user.role === "superadmin" || user.role === "agent") {
      return orders;
    }
    return orders.filter((order) => order.user_id === user.id.toString());
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPaymentMethodColor = (method) => {
    switch (method?.toLowerCase()) {
      case "credit_card":
      case "credit card":
      case "card":
        return "bg-purple-100 text-purple-800";
      case "paypal":
        return "bg-blue-100 text-blue-800";
      case "cash":
      case "cash_on_delivery":
      case "cod":
        return "bg-green-100 text-green-800";
      case "bank_transfer":
        return "bg-indigo-100 text-indigo-800";
      case "mobile_banking":
      case "bkash":
      case "nagad":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const displayedOrders = filteredOrders();
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-line", children: [
    /* @__PURE__ */ jsx("thead", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Order ID" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Order #" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Customer" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Date" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Amount" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Payment Status" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Order Status" }),
      /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: "Payment Method" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-line", children: displayedOrders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-6 py-4 text-center text-text-soft", children: "No orders found" }) }) : displayedOrders.map((order) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/50 transition-colors duration-150", children: [
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-marigold", children: /* @__PURE__ */ jsxs(Link, { href: `/dashboard/orders/${order.id}`, className: "hover:text-marigold-dark transition-colors hover:underline", children: [
        order.id.slice(0, 8),
        "..."
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-text-soft", children: order.order_number || "N/A" }),
      /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: order.recipient_name }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: order.recipient_phone })
      ] }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-text-soft", children: new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) }),
      /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) }),
        order.amount_to_collect > 0 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft", children: [
          "Collect: ",
          /* @__PURE__ */ jsx(FormatPrice, { price: order.amount_to_collect })
        ] })
      ] }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.payment_status)}`, children: order.payment_status || "Pending" }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.order_status)}`, children: order.order_status || "Pending" }) }),
      /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(order.payment_method)}`, children: order.payment_method?.replace(/_/g, " ") || "N/A" }) })
    ] }, order.id)) })
  ] }) });
};
export {
  RecentOrders as default
};
