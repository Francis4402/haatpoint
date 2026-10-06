import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head } from "@inertiajs/react";
import { FaDollarSign, FaBoxes, FaShoppingCart, FaCheckCircle, FaClock, FaChartPie, FaBoxOpen, FaChartLine, FaPercent, FaStore } from "react-icons/fa";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "react";
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
const Analytics = ({ auth, metrics }) => {
  const isAdmin = metrics?.isAdmin;
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Analytics" }),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Performance insights" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Analytics" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: isAdmin ? "Platform revenue from delivered & paid orders" : "Your store sales, revenue and conversion" })
      ] }) }),
      isAdmin && metrics && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Revenue (Profit)" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: metrics.totalProfit ?? 0 }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center mt-2 text-green-600", children: /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                metrics.profitCommissionRate,
                "% of subtotal • ",
                metrics.profitOrdersCount,
                " delivered & paid"
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-marigold" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Sells (Delivered)" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: metrics.totalSells ?? 0 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-text-soft", children: [
                /* @__PURE__ */ jsx(FaBoxes, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                  metrics.totalProductsSold,
                  " products delivered"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-6 w-6 text-green-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Delivered & Paid Orders" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: metrics.profitOrdersCount }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-green-600", children: [
                /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                  metrics.paidOrders,
                  " paid"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 text-purple-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Order Status" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: metrics.totalOrders }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-text-soft", children: [
                /* @__PURE__ */ jsx(FaClock, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                  metrics.deliveredOrders,
                  " delivered • ",
                  metrics.cancelledOrders,
                  " cancelled"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaChartPie, { className: "h-6 w-6 text-orange-600" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FaBoxOpen, { className: "h-5 w-5 text-marigold" }),
            " Top Selling Products"
          ] }),
          metrics.sellByProduct && metrics.sellByProduct.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-line", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-paper-dim", children: /* @__PURE__ */ jsx("tr", { children: ["Product", "Quantity Sold", "Revenue"].map((col) => /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: col }, col)) }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-line", children: metrics.sellByProduct.map((product) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/50 transition-colors duration-150", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                product.image && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: product.image,
                    alt: product.name,
                    className: "h-10 w-10 object-cover rounded border border-line"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: product.name })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-ink", children: product.qty }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.revenue }) })
            ] }, product.name)) })
          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaBoxOpen, { className: "mx-auto h-12 w-12 text-text-soft" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-ink", children: "No delivered & paid products yet" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Revenue shows once orders are delivered and paid." })
          ] })
        ] })
      ] }),
      !isAdmin && metrics && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Revenue (Delivered & Paid)" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: metrics.totalRevenue ?? 0 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-green-600", children: [
                /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                  metrics.deliveredOrders,
                  " delivered & paid"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-marigold" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Conversion Rate" }),
              /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-ink mt-1", children: [
                metrics.conversionRate,
                "%"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-text-soft", children: [
                /* @__PURE__ */ jsx(FaChartLine, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "delivered & paid / total orders" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaPercent, { className: "h-6 w-6 text-green-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Orders" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: metrics.totalOrders }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-text-soft", children: [
                /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "orders placed on your store" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-6 w-6 text-purple-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Order Status" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: metrics.totalOrders }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2 text-text-soft", children: [
                /* @__PURE__ */ jsx(FaClock, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-sm", children: [
                  metrics.pendingOrders,
                  " pending • ",
                  metrics.cancelledOrders,
                  " cancelled"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaChartPie, { className: "h-6 w-6 text-orange-600" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "h-5 w-5 text-marigold" }),
            " Top Selling Products"
          ] }),
          metrics.sellByProduct && metrics.sellByProduct.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-line", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-paper-dim", children: /* @__PURE__ */ jsx("tr", { children: ["Product", "Quantity Sold", "Revenue"].map((col) => /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: col }, col)) }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-line", children: metrics.sellByProduct.map((product) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/50 transition-colors duration-150", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                product.image && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: product.image,
                    alt: product.name,
                    className: "h-10 w-10 object-cover rounded border border-line"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: product.name })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-ink", children: product.qty }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.revenue }) })
            ] }, product.name)) })
          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "mx-auto h-12 w-12 text-text-soft" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-ink", children: "No delivered & paid products yet" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Revenue shows once your orders are delivered and paid." })
          ] })
        ] })
      ] }),
      !metrics && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(FaChartLine, { className: "mx-auto h-12 w-12 text-text-soft" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-ink", children: "No analytics available" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Analytics are available for admins and agents." })
      ] }) })
    ] }) })
  ] });
};
export {
  Analytics as default
};
