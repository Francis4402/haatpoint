import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment as Fragment$1 } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, router } from "@inertiajs/react";
import { Menu, Transition, Portal } from "@headlessui/react";
import { FaSearch, FaShoppingCart, FaCreditCard, FaTruck, FaUser, FaPhone, FaStore, FaBox, FaImage, FaEye, FaTrash, FaBan, FaEnvelope, FaHashtag, FaBoxOpen, FaTimesCircle, FaCheckCircle, FaClock, FaChevronDown, FaCheck } from "react-icons/fa";
import { IoRefreshOutline } from "react-icons/io5";
import { toast } from "sonner";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const NON_CANCELLABLE_STATUSES = ["shipped", "delivered", "confirmed", "cancelled"];
const STATUS_CONFIG = {
  pending: { badge: "bg-yellow-100 text-yellow-800", border: "border-l-yellow-400", dot: "bg-yellow-400", icon: /* @__PURE__ */ jsx(FaClock, { className: "h-3 w-3" }) },
  processing: { badge: "bg-blue-100 text-blue-800", border: "border-l-blue-400", dot: "bg-blue-400", icon: /* @__PURE__ */ jsx(FaBoxOpen, { className: "h-3 w-3" }) },
  confirmed: { badge: "bg-indigo-100 text-indigo-800", border: "border-l-indigo-400", dot: "bg-indigo-400", icon: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3" }) },
  shipped: { badge: "bg-purple-100 text-purple-800", border: "border-l-purple-400", dot: "bg-purple-400", icon: /* @__PURE__ */ jsx(FaTruck, { className: "h-3 w-3" }) },
  delivered: { badge: "bg-green-100 text-green-800", border: "border-l-green-400", dot: "bg-green-400", icon: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3" }) },
  cancelled: { badge: "bg-red-100 text-red-800", border: "border-l-red-400", dot: "bg-red-400", icon: /* @__PURE__ */ jsx(FaTimesCircle, { className: "h-3 w-3" }) },
  returned: { badge: "bg-gray-100 text-gray-700", border: "border-l-gray-400", dot: "bg-gray-400", icon: /* @__PURE__ */ jsx(FaBoxOpen, { className: "h-3 w-3" }) }
};
const PAYMENT_CONFIG = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800"
};
const getStatus = (s) => STATUS_CONFIG[s] ?? STATUS_CONFIG["returned"];
const getPayColor = (s) => PAYMENT_CONFIG[s] ?? "bg-gray-100 text-gray-700";
const getStatusColor = (status, type) => type === "payment" ? PAYMENT_CONFIG[status] ?? "bg-gray-100 text-gray-700" : STATUS_CONFIG[status]?.badge ?? "bg-gray-100 text-gray-700";
const DashboardOrders = ({ auth, orders }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const isAdmin = auth.user.role === "superadmin" || auth.user.role === "admin";
  const isMine = (o) => (o.user_id ?? o.agent_id) === auth.user.id;
  const canCancel = (o) => !isAdmin && isMine(o) && !NON_CANCELLABLE_STATUSES.includes(o.order_status);
  const canUpdate = (o) => isAdmin || isMine(o);
  const paymentStatusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
    { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" }
  ];
  const orderStatusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "confirmed", label: "Confirmed", color: "bg-indigo-100 text-indigo-800" },
    { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
    { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
  ];
  const handleUpdateStatus = (orderId, field, value) => {
    setUpdating({ id: orderId, field });
    router.patch(
      route("admin.orders.update", orderId),
      { [field]: value },
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Order status updated"),
        onError: (e) => toast.error(typeof e === "string" ? e : e.message ?? "Failed to update status"),
        onFinish: () => setUpdating(null)
      }
    );
  };
  const isUpdatingStatus = (orderId, field) => updating?.id === orderId && updating?.field === field;
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    shipped: orders.filter((o) => o.order_status === "shipped").length,
    delivered: orders.filter((o) => o.order_status === "delivered").length,
    cancelled: orders.filter((o) => o.order_status === "cancelled").length
  };
  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.recipient_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.order_status === statusFilter;
    return matchSearch && matchStatus;
  });
  const getImageUrl = (p) => {
    if (!p) return "/otherplaceholder.jpg";
    const c = p.replace(/\/+/g, "/");
    if (c.startsWith("http://") || c.startsWith("https://")) return c;
    if (c.includes("/storage/")) return c;
    const b = window.location.origin;
    if (c.startsWith("product_images/")) return `${b}/storage/${c}`;
    if (c.includes("product_images")) return `${b}/storage/product_images/${c.split("/").pop()}`;
    if (!c.includes("/")) return `${b}/storage/product_images/${c}`;
    return `${b}/storage/${c}`;
  };
  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });
  };
  const formatTime = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });
  };
  const openDelete = (id, e) => {
    e.stopPropagation();
    setOrderToDelete(id);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setIsDeleteOpen(false);
    setOrderToDelete(null);
  };
  const handleDelete = () => {
    if (!orderToDelete) return;
    setDeletingId(orderToDelete);
    router.delete(`/orders/${orderToDelete}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Order deleted");
        if (expandedId === orderToDelete) setExpandedId(null);
      },
      onError: (e) => toast.error(typeof e === "string" ? e : e.message ?? "Failed to delete"),
      onFinish: () => {
        setDeletingId(null);
        closeDelete();
      }
    });
  };
  const openCancel = (id, e) => {
    e.stopPropagation();
    setOrderToCancel(id);
    setIsCancelOpen(true);
  };
  const closeCancel = () => {
    setIsCancelOpen(false);
    setOrderToCancel(null);
  };
  const handleCancel = () => {
    if (!orderToCancel) return;
    setCancellingId(orderToCancel);
    router.patch(`/orders/${orderToCancel}/cancel`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Order cancelled");
        if (expandedId === orderToCancel) setExpandedId(null);
      },
      onError: (e) => toast.error(typeof e === "string" ? e : e.message ?? "Failed to cancel"),
      onFinish: () => {
        setCancellingId(null);
        closeCancel();
      }
    });
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Orders" }),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Track your purchases" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "My Orders" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Track and manage your purchases" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 text-xs font-medium", children: [
          { label: "All", val: stats.total, color: "bg-gray-100 text-gray-700", key: "all" },
          { label: "Pending", val: stats.pending, color: "bg-yellow-100 text-yellow-800", key: "pending" },
          { label: "Shipped", val: stats.shipped, color: "bg-purple-100 text-purple-800", key: "shipped" },
          { label: "Delivered", val: stats.delivered, color: "bg-green-100 text-green-800", key: "delivered" },
          { label: "Cancelled", val: stats.cancelled, color: "bg-red-100 text-red-800", key: "cancelled" }
        ].map((s) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setStatusFilter(s.key),
            className: `px-3 py-1.5 rounded-full transition-all duration-200 ${statusFilter === s.key ? `${s.color} ring-2 ring-offset-2 ring-marigold` : `${s.color} opacity-60 hover:opacity-100`}`,
            children: [
              s.label,
              " · ",
              s.val
            ]
          },
          s.key
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search order # or name…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full pl-9 pr-4 py-2 text-sm bg-white border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent text-ink placeholder:text-text-soft"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: "text-sm bg-white border border-line rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold text-ink",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Statuses" }),
                Object.keys(STATUS_CONFIG).map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))
              ]
            }
          )
        ] }),
        filtered.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-text-soft", children: [
          "Showing ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filtered.length }),
          " of ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: orders.length }),
          " orders"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        filtered.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line py-20 text-center", children: [
          /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-12 w-12 text-text-soft mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-ink font-medium", children: "No orders found" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm mt-1", children: "Try adjusting your search or filter" })
        ] }),
        filtered.map((order) => {
          const sc = getStatus(order.order_status);
          const isOpen = expandedId === order.id;
          const isDeleting = deletingId === order.id;
          const isCancelling = cancellingId === order.id;
          const StatusDropdown = ({
            orderId,
            field,
            currentValue,
            options,
            icon: Icon
          }) => {
            const updatingNow = isUpdatingStatus(orderId, field);
            const currentOption = options.find((o) => o.value === currentValue);
            const buttonRef = useRef(null);
            const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
            const handleOpen = () => {
              if (!buttonRef.current) return;
              const rect = buttonRef.current.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + 8, left: rect.left });
            };
            useEffect(() => {
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
            return /* @__PURE__ */ jsx(Menu, { as: "div", className: "relative inline-block text-left", children: ({ open }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                Menu.Button,
                {
                  ref: buttonRef,
                  onClick: handleOpen,
                  disabled: updatingNow,
                  className: `
                                inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold
                                ${getStatusColor(currentValue, field === "payment_status" ? "payment" : "order")}
                                hover:opacity-80 transition-all cursor-pointer
                                disabled:opacity-60 disabled:cursor-not-allowed
                                ring-1 ring-inset ring-black/5
                                ${open ? "ring-2 ring-marigold/40" : ""}
                            `,
                  children: [
                    updatingNow ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(IoRefreshOutline, { className: "h-3 w-3 animate-spin" }),
                      "Updating..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
                      currentOption?.label ?? currentValue
                    ] }),
                    /* @__PURE__ */ jsx(
                      FaChevronDown,
                      {
                        className: `h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Transition,
                {
                  as: Fragment$1,
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
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `bg-white rounded-2xl border border-line border-l-4 ${sc.border} shadow-hard-sm hover:shadow-xl transition-all duration-300`,
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "px-5 py-4 cursor-pointer select-none",
                    onClick: () => setExpandedId(isOpen ? null : order.id),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                          /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${sc.badge}`, children: [
                            /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${sc.dot}` }),
                            order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getPayColor(order.payment_status)}`, children: [
                            /* @__PURE__ */ jsx(FaCreditCard, { className: "h-2.5 w-2.5" }),
                            order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
                          ] }),
                          order.shipping_method && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-paper-dim text-text-soft", children: [
                            /* @__PURE__ */ jsx(FaTruck, { className: "h-2.5 w-2.5" }),
                            order.shipping_method === "pathao" ? "Pathao" : "Standard"
                          ] })
                        ] }),
                        canUpdate(order) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                          /* @__PURE__ */ jsx(
                            StatusDropdown,
                            {
                              orderId: order.id,
                              field: "payment_status",
                              currentValue: order.payment_status,
                              options: paymentStatusOptions,
                              icon: FaCreditCard
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            StatusDropdown,
                            {
                              orderId: order.id,
                              field: "order_status",
                              currentValue: order.order_status,
                              options: orderStatusOptions,
                              icon: FaTruck
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-2", children: [
                          /* @__PURE__ */ jsx("span", { className: "font-bold text-ink text-sm tracking-wide", children: order.order_number }),
                          /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                            formatDate(order.created_at),
                            " · ",
                            formatTime(order.created_at)
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-text-soft", children: [
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(FaUser, { className: "h-2.5 w-2.5" }),
                            order.recipient_name
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(FaPhone, { className: "h-2.5 w-2.5" }),
                            order.recipient_phone
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(FaStore, { className: "h-2.5 w-2.5" }),
                            order.store_name
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(FaBox, { className: "h-2.5 w-2.5" }),
                            order.item_quantity,
                            " item",
                            order.item_quantity !== 1 ? "s" : ""
                          ] })
                        ] }),
                        order.order_items && order.order_items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
                          order.order_items.slice(0, 6).map((item) => /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
                            item.product_image ? /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: getImageUrl(item.product_image),
                                alt: item.product_name,
                                title: item.product_name,
                                className: "w-10 h-10 rounded-lg object-cover border border-line",
                                onError: (e) => {
                                  e.target.src = "/otherplaceholder.jpg";
                                }
                              }
                            ) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-paper-dim flex items-center justify-center border border-line", children: /* @__PURE__ */ jsx(FaImage, { className: "h-4 w-4 text-text-soft" }) }),
                            /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-marigold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center", children: item.quantity })
                          ] }, item.id)),
                          order.order_items.length > 6 && /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-paper-dim border border-line flex items-center justify-center", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft font-medium", children: [
                            "+",
                            order.order_items.length - 6
                          ] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-3 flex-shrink-0", children: [
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink leading-none", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) }),
                          order.payment_method === "cash_on_delivery" && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 mt-1 font-medium", children: [
                            "COD: ",
                            /* @__PURE__ */ jsx(FormatPrice, { price: order.amount_to_collect })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                router.visit(`/orders/${order.id}/confirmation`);
                              },
                              title: "View details",
                              className: "p-2 text-marigold hover:bg-marigold/10 rounded-xl transition-colors",
                              children: /* @__PURE__ */ jsx(FaEye, { className: "h-3.5 w-3.5" })
                            }
                          ),
                          isAdmin && /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => openDelete(order.id, e),
                              disabled: isDeleting,
                              title: "Delete order",
                              className: "p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40",
                              children: isDeleting ? /* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx(FaTrash, { className: "h-3.5 w-3.5" })
                            }
                          ),
                          canCancel(order) && /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => openCancel(order.id, e),
                              disabled: isCancelling,
                              title: "Cancel order",
                              className: "p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors disabled:opacity-40",
                              children: isCancelling ? /* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx(FaBan, { className: "h-3.5 w-3.5" })
                            }
                          ),
                          !isAdmin && isMine(order) && NON_CANCELLABLE_STATUSES.includes(order.order_status) && /* @__PURE__ */ jsx("span", { title: `Cannot cancel — order is ${order.order_status}`, className: "p-2 text-text-soft cursor-default", children: /* @__PURE__ */ jsx(FaBan, { className: "h-3.5 w-3.5" }) }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                setExpandedId(isOpen ? null : order.id);
                              },
                              className: "p-2 text-text-soft hover:text-ink hover:bg-paper-dim rounded-xl transition-colors",
                              children: /* @__PURE__ */ jsx("svg", { className: `h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" }) })
                            }
                          )
                        ] })
                      ] })
                    ] })
                  }
                ),
                isOpen && /* @__PURE__ */ jsxs("div", { className: "border-t border-line bg-paper-dim/50 px-5 py-5 rounded-b-2xl", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-line p-4 shadow-hard-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3", children: "Recipient" }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                          /* @__PURE__ */ jsx(FaUser, { className: "h-3 w-3 text-text-soft flex-shrink-0" }),
                          /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: order.recipient_name })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-text-soft", children: [
                          /* @__PURE__ */ jsx(FaEnvelope, { className: "h-3 w-3 text-text-soft flex-shrink-0" }),
                          /* @__PURE__ */ jsx("span", { className: "truncate", children: order.recipient_email || order.sender_email || "—" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-text-soft", children: [
                          /* @__PURE__ */ jsx(FaPhone, { className: "h-3 w-3 text-text-soft flex-shrink-0" }),
                          order.recipient_phone
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-xs text-text-soft leading-relaxed", children: [
                          /* @__PURE__ */ jsx(FaHashtag, { className: "h-3 w-3 text-text-soft flex-shrink-0 mt-0.5" }),
                          order.recipient_address
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-line p-4 shadow-hard-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3", children: "Shipping" }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: [
                        { label: "Method", val: order.shipping_method || "—" },
                        { label: "Tracking", val: order.tracking_number || "N/A" },
                        { label: "Payment", val: order.payment_method },
                        { label: "Weight", val: `${order.item_weight} kg` }
                      ].map((row) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: row.label }),
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-ink text-xs text-right max-w-[60%] truncate", children: row.val })
                      ] }, row.label)) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-line p-4 shadow-hard-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3", children: "Summary" }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 text-sm", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Subtotal" }),
                          /* @__PURE__ */ jsx("span", { className: "text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.subtotal }) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Delivery" }),
                          /* @__PURE__ */ jsx("span", { className: "text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
                        ] }),
                        order.discount_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-red-500", children: [
                          /* @__PURE__ */ jsx("span", { children: "Discount" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "−",
                            /* @__PURE__ */ jsx(FormatPrice, { price: order.discount_amount })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2.5 border-t border-line font-bold", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-ink", children: "Total" }),
                          /* @__PURE__ */ jsx("span", { className: "text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) })
                        ] })
                      ] })
                    ] })
                  ] }),
                  order.order_items && order.order_items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-white rounded-xl border border-line overflow-hidden shadow-hard-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "px-4 pt-4 pb-2 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-text-soft uppercase tracking-widest", children: "Order Items" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                        order.order_items.length,
                        " item",
                        order.order_items.length !== 1 ? "s" : ""
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
                      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t border-line bg-paper-dim", children: [
                        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider", children: "Product" }),
                        /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider", children: "Qty" }),
                        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider", children: "Price" }),
                        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider", children: "Total" })
                      ] }) }),
                      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-line", children: order.order_items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-paper-dim/30 transition-colors", children: [
                        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          item.product_image ? /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: getImageUrl(item.product_image),
                              alt: item.product_name,
                              className: "w-9 h-9 rounded-lg object-cover border border-line flex-shrink-0",
                              onError: (e) => {
                                e.target.src = "/otherplaceholder.jpg";
                              }
                            }
                          ) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-paper-dim flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FaImage, { className: "h-3.5 w-3.5 text-text-soft" }) }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium text-ink truncate", children: item.product_name })
                        ] }) }),
                        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-text-soft", children: item.quantity }),
                        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.price }) }),
                        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-semibold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) })
                      ] }, item.id)) })
                    ] })
                  ] })
                ] })
              ]
            },
            order.id
          );
        })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: isDeleteOpen,
        onClose: closeDelete,
        onConfirm: handleDelete,
        title: "Delete Order",
        message: "Are you sure you want to delete this order? This action cannot be undone. All order items will also be deleted.",
        isDeleting: deletingId === orderToDelete
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: isCancelOpen,
        onClose: closeCancel,
        onConfirm: handleCancel,
        title: "Cancel Order",
        message: "Are you sure you want to cancel this order? This action cannot be undone.",
        isDeleting: cancellingId === orderToCancel
      }
    )
  ] });
};
export {
  DashboardOrders as default
};
