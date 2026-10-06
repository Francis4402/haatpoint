import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useState, Fragment, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Menu, Transition, Portal } from "@headlessui/react";
import { IoCartOutline, IoTimeOutline, IoChevronDown, IoLockClosed, IoChevronUp, IoPersonOutline, IoLocationOutline, IoPricetagOutline, IoRefreshOutline } from "react-icons/io5";
import { MdPayment, MdOutlineTrackChanges } from "react-icons/md";
import { FaTimes, FaCheck, FaTruck, FaSearch, FaBox, FaCreditCard, FaWeightHanging } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BiPhone } from "react-icons/bi";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const AdminOrders = ({ orders, auth, revenue, orderRules, flash }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const paymentStatusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
    { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" }
  ];
  const orderStatusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-indigo-100 text-indigo-800" },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
    { value: "returned", label: "Returned", color: "bg-gray-100 text-gray-800" }
  ];
  const rulesFor = (orderId) => orderRules?.[orderId];
  const optionsFor = (orderId, type) => {
    const all = type === "payment" ? paymentStatusOptions : orderStatusOptions;
    const allowed = type === "payment" ? rulesFor(orderId)?.paymentStatus : rulesFor(orderId)?.orderStatus;
    if (!allowed) return all;
    return all.filter((o) => allowed.includes(o.value));
  };
  const isSuperAdminRole = auth?.user?.role === "superadmin";
  const canEditStatus = isSuperAdminRole || auth?.user?.role === "admin" || auth?.user?.role === "agent";
  const canEditOrder = (orderId) => canEditStatus && !!rulesFor(orderId)?.canEdit;
  const handleUpdateStatus = (orderId, field, value) => {
    setUpdating({ id: orderId, field });
    router.patch(
      route("admin.orders.update", orderId),
      { [field]: value },
      {
        onFinish: () => setUpdating(null),
        preserveScroll: true
      }
    );
  };
  const isUpdating = (orderId, field) => updating?.id === orderId && updating?.field === field;
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  const getStatusColor = (status, type) => {
    const options = type === "payment" ? paymentStatusOptions : orderStatusOptions;
    return options.find((opt) => opt.value === status)?.color ?? "bg-gray-100 text-gray-800";
  };
  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchTerm === "" || order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) || order.store_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    processing: orders.filter((o) => o.order_status === "processing").length,
    delivered: orders.filter((o) => o.order_status === "delivered").length,
    // Server-computed: Orders casts money columns to decimal *strings*, so a
    // client-side reduce() concatenated them instead of adding.
    revenue: Number(revenue ?? 0)
  };
  const StatusDropdown = ({
    orderId,
    field,
    currentValue,
    options,
    icon: Icon
  }) => {
    const updatingNow = isUpdating(orderId, field);
    const currentOption = options.find((o) => o.value === currentValue);
    const buttonRef = useRef(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const handleOpen = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        // 8px gap; fixed positioning ignores scroll
        left: rect.left
      });
    };
    useEffect(() => {
      if (!buttonRef.current) return;
      const updatePos = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 8, left: rect.left });
      };
      window.addEventListener("resize", updatePos);
      window.addEventListener("scroll", updatePos, true);
      return () => {
        window.removeEventListener("resize", updatePos);
        window.removeEventListener("scroll", updatePos, true);
      };
    }, []);
    return /* @__PURE__ */ jsx(Menu, { as: "div", className: "relative inline-block text-left", children: ({ open }) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        Menu.Button,
        {
          ref: buttonRef,
          onClick: handleOpen,
          disabled: updatingNow,
          className: `
                                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium
                                ${getStatusColor(currentValue, field === "payment_status" ? "payment" : "order")}
                                hover:opacity-80 transition-all cursor-pointer
                                disabled:opacity-60 disabled:cursor-not-allowed
                                ring-1 ring-inset ring-black/5
                                ${open ? "ring-2 ring-marigold/40" : ""}
                            `,
          children: [
            updatingNow ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
              /* @__PURE__ */ jsx(IoRefreshOutline, { className: "h-3 w-3 animate-spin" }),
              "Updating..."
            ] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
              currentOption?.label ?? currentValue
            ] }),
            /* @__PURE__ */ jsx(
              IoChevronDown,
              {
                className: `h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Transition,
        {
          as: Fragment,
          enter: "transition ease-out duration-100",
          enterFrom: "transform opacity-0 scale-95",
          enterTo: "transform opacity-100 scale-100",
          leave: "transition ease-in duration-75",
          leaveFrom: "transform opacity-100 scale-100",
          leaveTo: "transform opacity-0 scale-95",
          children: /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(
            Menu.Items,
            {
              className: "\n                                        fixed z-[9999] w-44 origin-top-left\n                                        rounded-xl bg-white shadow-xl border border-line\n                                        focus:outline-none overflow-hidden\n                                    ",
              style: {
                top: menuPos.top,
                left: menuPos.left
              },
              children: /* @__PURE__ */ jsx("div", { className: "py-1", children: options.map((option) => {
                const isActive = option.value === currentValue;
                return /* @__PURE__ */ jsx(Menu.Item, { children: ({ active }) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleUpdateStatus(orderId, field, option.value),
                    className: `
                                                                flex items-center justify-between w-full px-3 py-2 text-left text-sm
                                                                ${active ? "bg-paper-dim" : ""}
                                                                ${isActive ? "text-marigold font-medium" : "text-ink"}
                                                            `,
                    children: [
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${option.color.split(" ")[0]}` }),
                        option.label
                      ] }),
                      isActive && /* @__PURE__ */ jsx(FaCheck, { className: "h-3 w-3 text-marigold" })
                    ]
                  }
                ) }, option.value);
              }) })
            }
          ) })
        }
      )
    ] }) });
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Orders Management" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      (flash?.success || flash?.error) && /* @__PURE__ */ jsxs(
        "div",
        {
          role: "status",
          className: `mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-hard-sm ${flash?.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`,
          children: [
            flash?.error ? /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(FaCheck, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: flash?.error || flash?.success })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Manage customer orders" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Orders" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Manage and track all customer orders" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-3 bg-marigold/10 rounded-xl", children: /* @__PURE__ */ jsx(IoCartOutline, { className: "h-6 w-6 text-marigold" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Orders" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: stats.total })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-3 bg-yellow-100 rounded-xl", children: /* @__PURE__ */ jsx(IoTimeOutline, { className: "h-6 w-6 text-yellow-600" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Pending" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: stats.pending })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-3 bg-purple-100 rounded-xl", children: /* @__PURE__ */ jsx(FaTruck, { className: "h-6 w-6 text-purple-600" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Processing" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: stats.processing })
          ] })
        ] }) }),
        canEditStatus && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-3 bg-green-100 rounded-xl", children: /* @__PURE__ */ jsx(MdPayment, { className: "h-6 w-6 text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Revenue" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: stats.revenue }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: statusFilter,
                  onChange: (e) => setStatusFilter(e.target.value),
                  className: "\n                                            appearance-none cursor-pointer\n                                            rounded-xl border border-line bg-white\n                                            pl-4 pr-10 py-2.5 min-w-[180px]\n                                            text-sm text-ink font-medium\n                                            focus:ring-2 focus:ring-marigold focus:border-transparent\n                                            hover:border-marigold/50 transition-colors\n                                        ",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "all", children: "All Order Status" }),
                    orderStatusOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(IoChevronDown, { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: paymentFilter,
                  onChange: (e) => setPaymentFilter(e.target.value),
                  className: "\n                                            appearance-none cursor-pointer\n                                            rounded-xl border border-line bg-white\n                                            pl-4 pr-10 py-2.5 min-w-[190px]\n                                            text-sm text-ink font-medium\n                                            focus:ring-2 focus:ring-marigold focus:border-transparent\n                                            hover:border-marigold/50 transition-colors\n                                        ",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "all", children: "All Payment Status" }),
                    paymentStatusOptions.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
                  ]
                }
              ),
              /* @__PURE__ */ jsx(IoChevronDown, { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" })
            ] }),
            (statusFilter !== "all" || paymentFilter !== "all" || searchTerm !== "") && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setSearchTerm("");
                },
                className: "\n                                            inline-flex items-center gap-1.5\n                                            rounded-xl px-3 py-2.5 text-sm font-medium\n                                            text-red-600 hover:text-red-700 hover:bg-red-50\n                                            border border-transparent hover:border-red-200\n                                            transition-colors\n                                        ",
                children: [
                  /* @__PURE__ */ jsx(FaTimes, { className: "h-3.5 w-3.5" }),
                  "Clear"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full lg:w-auto", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft h-4 w-4 pointer-events-none" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by order #, customer, or store...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "\n                                        w-full lg:w-80\n                                        rounded-xl border border-line\n                                        pl-10 pr-4 py-2.5\n                                        text-sm text-ink placeholder:text-text-soft\n                                        focus:ring-2 focus:ring-marigold focus:border-transparent\n                                        bg-white\n                                        hover:border-marigold/50 transition-colors\n                                    "
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-line flex items-center justify-between text-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
          "Showing ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filteredOrders.length }),
          " of",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: orders.length }),
          " orders",
          (statusFilter !== "all" || paymentFilter !== "all" || searchTerm !== "") && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-marigold font-medium", children: "(filtered)" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-line", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-paper-dim", children: /* @__PURE__ */ jsx("tr", { children: ["Order #", "Customer", "Store", "Total", "Payment Status", "Order Status", "Date", "Actions"].map((col) => /* @__PURE__ */ jsx(
            "th",
            {
              scope: "col",
              className: `px-6 py-3 text-xs font-mono text-text-soft uppercase tracking-wide whitespace-nowrap ${col === "Actions" ? "text-right" : "text-left"}`,
              children: col
            },
            col
          )) }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-line", children: filteredOrders.map((order) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/50 transition-colors duration-150", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MdOutlineTrackChanges, { className: "h-5 w-5 text-text-soft" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: order.order_number })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-r from-marigold to-marigold-dark flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-medium text-sm", children: order.recipient_name.charAt(0).toUpperCase() }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: order.recipient_name }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: order.recipient_phone })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-ink", children: order.store_name }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: canEditOrder(order.id) && !rulesFor(order.id)?.paymentStatusLocked ? /* @__PURE__ */ jsx(
                StatusDropdown,
                {
                  orderId: order.id,
                  field: "payment_status",
                  currentValue: order.payment_status,
                  options: optionsFor(order.id, "payment"),
                  icon: MdPayment
                }
              ) : /* @__PURE__ */ jsxs(
                "span",
                {
                  title: rulesFor(order.id)?.paymentStatusLockedReason ?? rulesFor(order.id)?.reason ?? void 0,
                  className: `inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor(order.payment_status, "payment")} ${canEditOrder(order.id) ? "" : "opacity-70"}`,
                  children: [
                    order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1),
                    rulesFor(order.id)?.paymentStatusLocked && /* @__PURE__ */ jsx(IoLockClosed, { className: "h-3 w-3", "aria-label": "locked" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: canEditOrder(order.id) && !rulesFor(order.id)?.orderStatusLocked ? /* @__PURE__ */ jsx(
                StatusDropdown,
                {
                  orderId: order.id,
                  field: "order_status",
                  currentValue: order.order_status,
                  options: optionsFor(order.id, "order"),
                  icon: FaTruck
                }
              ) : /* @__PURE__ */ jsxs(
                "span",
                {
                  title: rulesFor(order.id)?.reason ?? void 0,
                  className: `inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor(order.order_status, "order")} ${canEditOrder(order.id) ? "opacity-80" : "opacity-60"}`,
                  children: [
                    order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1),
                    rulesFor(order.id)?.orderStatusLocked && /* @__PURE__ */ jsx(IoLockClosed, { className: "h-3 w-3", "aria-label": "locked" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-text-soft", children: formatDate(order.created_at) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleOrderDetails(order.id),
                  className: "inline-flex items-center gap-1 text-marigold hover:text-marigold-dark transition-colors",
                  children: expandedOrder === order.id ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
                    /* @__PURE__ */ jsx(IoChevronUp, { className: "h-4 w-4" }),
                    "Hide"
                  ] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
                    /* @__PURE__ */ jsx(IoChevronDown, { className: "h-4 w-4" }),
                    "Details"
                  ] })
                }
              ) })
            ] }),
            expandedOrder === order.id && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-6 py-6 bg-paper-dim/50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-hard-sm border border-line", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-ink flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsx(FaBox, { className: "h-4 w-4 text-marigold" }),
                    "Order Information"
                  ] }),
                  /* @__PURE__ */ jsxs("dl", { className: "space-y-2 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Tracking #:" }),
                      /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink", children: order.tracking_number || "N/A" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Shipping Method:" }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: order.shipping_method })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Payment Method:" }),
                      /* @__PURE__ */ jsxs("dd", { className: "flex items-center gap-1 text-ink", children: [
                        /* @__PURE__ */ jsx(FaCreditCard, { className: "h-3 w-3" }),
                        order.payment_method
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Item Quantity:" }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: order.item_quantity })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Total Weight:" }),
                      /* @__PURE__ */ jsxs("dd", { className: "flex items-center gap-1 text-ink", children: [
                        /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-3 w-3" }),
                        order.item_weight,
                        " kg"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-hard-sm border border-line", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-ink flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsx(IoPersonOutline, { className: "h-4 w-4 text-marigold" }),
                    "Recipient Details"
                  ] }),
                  /* @__PURE__ */ jsxs("dl", { className: "space-y-2 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Name" }),
                      /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink", children: order.recipient_name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("dt", { className: "text-text-soft flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx(HiOutlineMail, { className: "h-3 w-3" }),
                        " Email"
                      ] }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: order.recipient_email })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("dt", { className: "text-text-soft flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx(BiPhone, { className: "h-3 w-3" }),
                        " Phone"
                      ] }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: order.recipient_phone })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("dt", { className: "text-text-soft flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx(IoLocationOutline, { className: "h-3 w-3" }),
                        " Address"
                      ] }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: order.recipient_address })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-hard-sm border border-line", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-ink flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsx(IoPricetagOutline, { className: "h-4 w-4 text-marigold" }),
                    "Order Summary"
                  ] }),
                  /* @__PURE__ */ jsxs("dl", { className: "space-y-2 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Subtotal:" }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.subtotal }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-text-soft", children: "Delivery Charge:" }),
                      /* @__PURE__ */ jsx("dd", { className: "text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
                    ] }),
                    order.discount_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-red-600", children: [
                      /* @__PURE__ */ jsx("dt", { children: "Discount:" }),
                      /* @__PURE__ */ jsxs("dd", { children: [
                        "-",
                        /* @__PURE__ */ jsx(FormatPrice, { price: order.discount_amount })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-t border-line pt-2 font-semibold", children: [
                      /* @__PURE__ */ jsx("dt", { className: "text-ink", children: "Total:" }),
                      /* @__PURE__ */ jsx("dd", { className: "text-lg font-bold text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) })
                    ] })
                  ] })
                ] })
              ] }),
              order.order_items && order.order_items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-ink px-4 py-3 border-b border-line", children: "Order Items" }),
                /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-line", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-paper-dim", children: /* @__PURE__ */ jsx("tr", { children: ["Product", "Quantity", "Price", "Total"].map((col) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide", children: col }, col)) }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-line", children: order.order_items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/30", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      item.product_image && /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.product_image,
                          alt: item.product_name,
                          className: "h-10 w-10 object-cover rounded border border-line"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-ink", children: item.product_name })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-ink", children: item.quantity }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.price }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) })
                  ] }, item.id)) })
                ] }) })
              ] }),
              order.notes && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-hard-sm border border-line", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-ink mb-2", children: "Notes" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: order.notes })
              ] })
            ] }) }) })
          ] }, order.id)) })
        ] }),
        filteredOrders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(IoCartOutline, { className: "mx-auto h-12 w-12 text-text-soft" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-ink", children: "No orders found" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Try adjusting your search or filters." })
        ] })
      ] }) })
    ] }) })
  ] });
};
export {
  AdminOrders as default
};
