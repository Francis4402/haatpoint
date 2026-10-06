import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, Link } from "@inertiajs/react";
import { FiTrendingUp, FiPercent, FiShoppingCart, FiPackage, FiUsers } from "react-icons/fi";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import { BsFillPeopleFill } from "react-icons/bs";
import RecentOrders from "./RecentOrders-yjGSdeq_.js";
import { FaTrophy, FaBoxOpen } from "react-icons/fa";
import "react";
import "@headlessui/react";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const DashboardHome = ({ auth, totalUsers, orders, stats }) => {
  const userRole = auth?.user?.role;
  const isAdmin = userRole === "admin" || userRole === "superadmin";
  const isAgent = userRole === "agent";
  const totalRevenue = isAdmin ? stats?.totalProfit ?? 0 : stats?.totalRevenue ?? stats?.totalSells ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;
  const topProducts = stats?.topProducts ?? [];
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsxs(Head, { title: "Dashboard", children: [
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Multivendor Store Dashboard" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "dashboard, analytics, ecommerce" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-display font-extrabold uppercase tracking-[-0.01em] mb-2", children: [
            "Welcome back, ",
            auth.user.name
          ] }),
          /* @__PURE__ */ jsx("p", { className: "opacity-90 text-sm", children: "Here's what's happening with your store today." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center", children: [
            /* @__PURE__ */ jsx(FiTrendingUp, { className: "h-5 w-5 mr-2" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
              stats?.totalOrders ?? 0,
              " total orders • ",
              stats?.deliveredOrders ?? 0,
              " delivered"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20", children: [
          /* @__PURE__ */ jsx(FaTrophy, { className: "h-8 w-8 mx-auto mb-2 text-yellow-300" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono uppercase tracking-wide", children: "Good Job!" })
        ] }) })
      ] }) }),
      (isAdmin || isAgent) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Revenue" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: /* @__PURE__ */ jsx(FormatPrice, { price: totalRevenue }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: isAdmin ? "10% profit (delivered & paid)" : "Delivered & paid orders" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-marigold/10 p-3 rounded-xl", children: /* @__PURE__ */ jsx(FiTrendingUp, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        isAdmin && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Sells" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: /* @__PURE__ */ jsx(FormatPrice, { price: stats?.totalSells ?? 0 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Delivered products" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-yellow-100 p-3 rounded-xl", children: /* @__PURE__ */ jsx(FaBoxOpen, { className: "h-6 w-6 text-yellow-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Conversion Rate" }),
            /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-ink mt-2", children: [
              conversionRate,
              "%"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1", children: [
              stats?.deliveredPaidOrders ?? 0,
              " delivered & paid / ",
              stats?.totalOrders ?? 0,
              " orders"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-marigold/10 p-3 rounded-xl", children: /* @__PURE__ */ jsx(FiPercent, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Orders" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: stats?.totalOrders ?? orders.length }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Orders Placed" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-green-100 p-3 rounded-xl", children: /* @__PURE__ */ jsx(FiShoppingCart, { className: "h-6 w-6 text-green-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Users" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: totalUsers }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Registered Users" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-marigold/10 p-3 rounded-xl", children: /* @__PURE__ */ jsx(BsFillPeopleFill, { className: "h-6 w-6 text-marigold" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-line flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Recent Orders" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Latest orders from your store" })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("dashboard.orders"),
                className: "text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center",
                children: "View all →"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(RecentOrders, { orders, user: auth.user })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-line flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Top Selling Products" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Best performing products this month" })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("products.index"),
                className: "text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center",
                children: "View all →"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("ul", { className: "divide-y divide-line", children: topProducts.length > 0 ? topProducts.map((product, index) => /* @__PURE__ */ jsx("li", { className: "py-4 hover:bg-paper-dim transition-colors rounded-lg px-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl font-bold text-sm ${index === 0 ? "bg-yellow-100 text-yellow-800" : index === 1 ? "bg-gray-100 text-gray-800" : index === 2 ? "bg-orange-100 text-orange-800" : "bg-marigold/10 text-marigold"}`, children: index === 0 ? "1" : index === 1 ? "2" : index === 2 ? "3" : `#${index + 1}` }),
              /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: product.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
                  product.qty.toLocaleString(),
                  " units sold"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-right", children: isAdmin || isAgent ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.revenue }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Revenue" })
            ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink", children: product.qty.toLocaleString() }) })
          ] }) }, product.name)) : /* @__PURE__ */ jsx("li", { className: "py-8 text-center text-sm text-text-soft", children: "No delivered products yet." }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-line", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Quick Actions" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Common tasks you might want to do" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/dashboard/products/create",
              className: "flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group",
              children: [
                /* @__PURE__ */ jsx(FiPackage, { className: "h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Add Product" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft mt-1", children: "Add new items" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/dashboard/orders/create",
              className: "flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group",
              children: [
                /* @__PURE__ */ jsx(FiShoppingCart, { className: "h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Create Order" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft mt-1", children: "Manual order entry" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/dashboard/customers/create",
              className: "flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group",
              children: [
                /* @__PURE__ */ jsx(FiUsers, { className: "h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "Add Customer" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft mt-1", children: "New customer profile" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/dashboard/analytics",
              className: "flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group",
              children: [
                /* @__PURE__ */ jsx(FiTrendingUp, { className: "h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: "View Reports" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft mt-1", children: "Detailed analytics" })
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4", children: "Ordery Summary" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(FiTrendingUp, { className: "h-5 w-5 text-green-600 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-green-800", children: "Delivered" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: stats?.deliveredOrders ?? 0 }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Orders delivered" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(FiShoppingCart, { className: "h-5 w-5 text-blue-600 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-blue-800", children: "Pending" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: stats?.pendingOrders ?? 0 }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Orders pending" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 rounded-xl border border-red-200 hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(FiUsers, { className: "h-5 w-5 text-red-600 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-red-800", children: "Cancelled" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-2", children: stats?.cancelledOrders ?? 0 }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Orders cancelled" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  DashboardHome as default
};
