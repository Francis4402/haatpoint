import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { FaCheckCircle, FaReceipt, FaPrint, FaShoppingBag, FaMoneyBill, FaCreditCard, FaUser, FaTruck, FaStore, FaClock, FaArrowRight } from "react-icons/fa";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { useEffect } from "react";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "@headlessui/react";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./languageStore-DF0bQFKG.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
const Confirmation = ({ auth, order, wishlist }) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("print") === "true") {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const getFullDeliveryAddress = () => order.recipient_address;
  const taxAmount = (order.subtotal || 0) * 0.1;
  const items = order.order_items || [];
  const getProductName = (item) => {
    const raw = item.product_name;
    if (!raw) return item.name || "N/A";
    if (typeof raw === "string") return raw;
    if (typeof raw === "object") return raw.name || raw.product_name || "N/A";
    return String(raw);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: `Order Confirmation - ${order.order_number}`, description: "Your order has been placed successfully. Track your order status on HaatPoint.", canonical: `https://www.haatpoint.com/orders/${order.id}/confirmation`, robots: "noindex, nofollow", ogTitle: `Order Confirmation - ${order.order_number}`, ogUrl: `https://www.haatpoint.com/orders/${order.id}/confirmation` }),
    /* @__PURE__ */ jsx("style", { type: "text/css", media: "print", children: `
        @page { size: A4 landscape; margin: 0.3in; }
        .screen-content { display: none !important; }
        .print-excel-content {
          display: block !important;
          background: white !important;
          color: black !important;
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10pt;
          line-height: 1.2;
          padding: 20px;
          position: absolute;
          left: 0; top: 0; width: 100%;
        }
        nav, header, footer, [role="navigation"] { display: none !important; }
        .excel-header { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .excel-title { font-size: 20pt; font-weight: bold; margin-bottom: 5px; }
        .excel-order-info { font-size: 11pt; display: flex; gap: 30px; }
        .excel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .excel-section { border: 1px solid #999; padding: 10px; margin-bottom: 10px; }
        .excel-section-title { font-weight: bold; background-color: #f0f0f0 !important; padding: 3px 8px; margin: -10px -10px 10px -10px; border-bottom: 1px solid #999; font-size: 11pt; }
        .excel-field { display: flex; margin-bottom: 4px; font-size: 9pt; }
        .excel-label { font-weight: 600; width: 80px; }
        .excel-value { flex: 1; }
        .excel-table { width: 100%; border-collapse: collapse; border: 1px solid #999; margin-bottom: 15px; }
        .excel-table th { background-color: #f0f0f0 !important; font-weight: 600; text-align: left; padding: 5px 8px; border: 1px solid #666; font-size: 9pt; }
        .excel-table td { padding: 4px 8px; border: 1px solid #ccc; font-size: 9pt; }
        .excel-table td.right { text-align: right; }
        .excel-table td.center { text-align: center; }
        .excel-summary { width: 40%; margin-left: auto; border-collapse: collapse; }
        .excel-summary td { padding: 4px 8px; border: 1px solid #ccc; }
        .excel-summary tr:last-child td { font-weight: bold; border-top: 2px solid #000; }
        .excel-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #999; font-size: 8pt; text-align: center; }
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "print-excel-content", style: { display: "none" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "excel-header", children: [
        /* @__PURE__ */ jsx("div", { className: "excel-title", children: "HaatPoint" }),
        /* @__PURE__ */ jsxs("div", { className: "excel-order-info", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Order #: ",
            order.order_number
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Date: ",
            formatDate(order.created_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "excel-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "excel-section", children: [
          /* @__PURE__ */ jsx("div", { className: "excel-section-title", children: "CUSTOMER INFORMATION" }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Name:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.recipient_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Phone:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.recipient_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Email:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.sender_email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", style: { marginTop: "5px" }, children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Address:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: getFullDeliveryAddress() })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "excel-section", children: [
          /* @__PURE__ */ jsx("div", { className: "excel-section-title", children: "ORDER DETAILS" }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Store:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.store_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Store Phone:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.sender_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Payment:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : "bKash" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Pay Status:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.payment_status })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "excel-section", children: [
          /* @__PURE__ */ jsx("div", { className: "excel-section-title", children: "DELIVERY INFORMATION" }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Method:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.shipping_method })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Charge:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
          ] }),
          order.tracking_number && /* @__PURE__ */ jsxs("div", { className: "excel-field", children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Tracking:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.tracking_number })
          ] }),
          order.special_instruction && /* @__PURE__ */ jsxs("div", { className: "excel-field", style: { marginTop: "5px" }, children: [
            /* @__PURE__ */ jsx("span", { className: "excel-label", children: "Note:" }),
            /* @__PURE__ */ jsx("span", { className: "excel-value", children: order.special_instruction })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "excel-section", children: [
        /* @__PURE__ */ jsx("div", { className: "excel-section-title", children: "ORDER ITEMS" }),
        /* @__PURE__ */ jsxs("table", { className: "excel-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { style: { width: "50%" }, children: "Product Name" }),
            /* @__PURE__ */ jsx("th", { style: { width: "10%" }, children: "Quantity" }),
            /* @__PURE__ */ jsx("th", { style: { width: "15%" }, children: "Unit Price" }),
            /* @__PURE__ */ jsx("th", { style: { width: "15%" }, children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: items.map((item, index) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: getProductName(item) }),
            /* @__PURE__ */ jsx("td", { className: "center", children: item.quantity }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.price }) }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsx("table", { className: "excel-summary", children: /* @__PURE__ */ jsxs("tbody", { children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Subtotal" }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.subtotal }) })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Delivery Charge" }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Tax (10%)" }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: taxAmount }) })
          ] }),
          order.discount_amount > 0 && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsxs("td", { children: [
              "Discount ",
              order.coupon_code && `(${order.coupon_code})`
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "right", children: [
              "-",
              /* @__PURE__ */ jsx(FormatPrice, { price: order.discount_amount })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "TOTAL" }),
            /* @__PURE__ */ jsx("td", { className: "right", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) })
          ] }),
          order.payment_method === "cash_on_delivery" && /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { children: "Amount to Collect (COD)" }),
            /* @__PURE__ */ jsx("td", { className: "right", style: { fontWeight: "bold" }, children: /* @__PURE__ */ jsx(FormatPrice, { price: order.amount_to_collect }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "excel-footer", children: [
        /* @__PURE__ */ jsx("div", { children: "Thank you for your business!" }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Generated on: ",
          (/* @__PURE__ */ new Date()).toLocaleString("en-BD")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "screen-content", children: /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative w-20 h-20 rounded-full bg-marigold flex items-center justify-center mx-auto mb-4 shadow-hard-sm", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-10 w-10 text-white" }) })
        ] }),
        /* @__PURE__ */ jsx(Eyebrow, { children: "Order confirmed" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Thank You!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-text-soft max-w-2xl mx-auto mt-2", children: [
          "Your order has been placed successfully.",
          " ",
          order.payment_method === "cash_on_delivery" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "Pay ",
            /* @__PURE__ */ jsx(FormatPrice, { price: order.amount_to_collect }),
            " on delivery."
          ] }) : "Payment being processed."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2 justify-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 bg-marigold/10 text-marigold rounded-full text-xs font-medium border border-marigold/20", children: [
          /* @__PURE__ */ jsx(FaReceipt, { className: "h-3 w-3 mr-1" }),
          order.order_number
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.print(),
            className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm",
            children: [
              /* @__PURE__ */ jsx(FaPrint, { className: "h-4 w-4" }),
              "Print Invoice"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-display font-extrabold uppercase text-white flex items-center", children: [
            /* @__PURE__ */ jsx(FaShoppingBag, { className: "h-5 w-5 mr-2" }),
            "Order Summary"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-line", children: [
                /* @__PURE__ */ jsx("th", { className: "text-left py-2 text-xs font-mono text-text-soft uppercase tracking-wide", children: "Item" }),
                /* @__PURE__ */ jsx("th", { className: "text-center py-2 text-xs font-mono text-text-soft uppercase tracking-wide", children: "Qty" }),
                /* @__PURE__ */ jsx("th", { className: "text-right py-2 text-xs font-mono text-text-soft uppercase tracking-wide", children: "Price" }),
                /* @__PURE__ */ jsx("th", { className: "text-right py-2 text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: items.map((item, index) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-line", children: [
                /* @__PURE__ */ jsx("td", { className: "py-3 text-sm", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: getProductName(item) }) }),
                /* @__PURE__ */ jsx("td", { className: "py-3 text-sm text-center text-text-soft", children: item.quantity }),
                /* @__PURE__ */ jsx("td", { className: "py-3 text-sm text-right text-text-soft", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.price }) }),
                /* @__PURE__ */ jsx("td", { className: "py-3 text-sm text-right font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: item.total }) })
              ] }, index)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-line", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm py-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Subtotal" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.subtotal }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm py-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Shipping" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.delivery_charge }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm py-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Tax (10%)" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: taxAmount }) })
              ] }),
              order.discount_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm py-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-text-soft", children: [
                  "Discount ",
                  order.coupon_code && `(${order.coupon_code})`
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-600", children: [
                  "-",
                  /* @__PURE__ */ jsx(FormatPrice, { price: order.discount_amount })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-bold pt-3 mt-2 border-t border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: "Total" }),
                /* @__PURE__ */ jsx("span", { className: "text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.total }) })
              ] }),
              order.payment_method === "cash_on_delivery" && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-marigold/5 rounded-xl border border-marigold/20", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft", children: "Amount to collect on delivery" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: order.amount_to_collect }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-line flex items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-paper-dim flex items-center justify-center mr-3 border border-line", children: order.payment_method === "cash_on_delivery" ? /* @__PURE__ */ jsx(FaMoneyBill, { className: "h-5 w-5 text-marigold" }) : /* @__PURE__ */ jsx(FaCreditCard, { className: "h-5 w-5 text-blue-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : "bKash" }),
                order.payment_method === "cash_on_delivery" && /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Pay when you receive your order" })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "text-white font-display font-extrabold uppercase text-sm flex items-center", children: [
              /* @__PURE__ */ jsx(FaUser, { className: "h-4 w-4 mr-2" }),
              "Customer"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Name:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: order.recipient_name })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Phone:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.recipient_phone })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Email:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.recipient_email })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "pt-2 border-t border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Order #:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: order.order_number })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Date:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: formatDate(order.created_at) })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "text-white font-display font-extrabold uppercase text-sm flex items-center", children: [
              /* @__PURE__ */ jsx(FaTruck, { className: "h-4 w-4 mr-2" }),
              "Delivery"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Address:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: getFullDeliveryAddress() })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Method:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.shipping_method === "pathao" ? "Pathao" : "Standard" })
              ] }),
              order.tracking_number && /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Tracking:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink font-mono", children: order.tracking_number })
              ] }),
              order.special_instruction && /* @__PURE__ */ jsxs("p", { className: "pt-2 border-t border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Note:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.special_instruction })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "text-white font-display font-extrabold uppercase text-sm flex items-center", children: [
              /* @__PURE__ */ jsx(FaStore, { className: "h-4 w-4 mr-2" }),
              "Store"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: order.store_name }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Email:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.sender_email })
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Phone:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: order.sender_phone })
              ] })
            ] }) })
          ] })
        ] })
      ] }),
      order.notes && /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-yellow-600 to-orange-600 px-5 py-3", children: /* @__PURE__ */ jsx("h3", { className: "text-white font-display font-extrabold uppercase text-sm", children: "Notes" }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: order.notes }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "text-white font-display font-extrabold uppercase text-sm flex items-center", children: [
          /* @__PURE__ */ jsx(FaClock, { className: "h-4 w-4 mr-2" }),
          "Timeline"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 mr-1" }),
            /* @__PURE__ */ jsxs("span", { className: "text-text-soft", children: [
              "Confirmed ",
              formatDate(order.created_at)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${order.order_status === "processing" ? "bg-blue-500" : "bg-gray-300"} mr-1` }),
            /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Processing" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${order.order_status === "shipped" ? "bg-indigo-500" : "bg-gray-300"} mr-1` }),
            /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Shipped" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full ${order.order_status === "delivered" ? "bg-green-500" : "bg-gray-300"} mr-1` }),
            /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Delivered" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("dashboard.orders"),
            className: "inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-text-soft hover:text-ink border border-line rounded-xl hover:bg-paper-dim transition-all duration-300 text-sm font-medium",
            children: [
              /* @__PURE__ */ jsx(FaShoppingBag, { className: "h-4 w-4" }),
              "My Orders"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/products",
            className: "inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm font-medium",
            children: [
              "Continue Shopping",
              /* @__PURE__ */ jsx(FaArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] })
    ] }) }) })
  ] });
};
export {
  Confirmation as default
};
