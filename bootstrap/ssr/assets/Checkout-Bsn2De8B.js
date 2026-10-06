import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { FaShoppingCart, FaArrowLeft, FaExclamationCircle, FaStore, FaCheckCircle, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaClock, FaMoneyBill, FaMoneyBillWave, FaCreditCard, FaBox, FaLock, FaShieldAlt } from "react-icons/fa";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { u as useStore } from "./cartStore-BOd_ZlZA.js";
import { toast } from "sonner";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "@headlessui/react";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "./WhatsAppChatButton-CDSWQr0H.js";
const Checkout = ({ auth, wishlist }) => {
  const {
    cart: cartItems,
    processCheckout,
    getOrderSummary,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    cities,
    zones,
    areas
  } = useStore();
  const store = cartItems[0]?.store;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { data, setData, processing } = useForm({
    recipient_name: auth.user?.name || "",
    recipient_phone: "",
    recipient_email: auth.user?.email || "",
    recipient_address: "",
    notes: "",
    payment_method: "cash_on_delivery"
  });
  const summary = getOrderSummary();
  const getFirstImage = (images) => {
    try {
      const parsed = JSON.parse(images);
      const imageName = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
      if (imageName) {
        return `/storage/${imageName}`;
      }
    } catch {
      if (typeof images === "string" && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `/storage/${matches[1]}`;
        }
        if (images && !images.includes('"')) {
          return `/storage/${images}`;
        }
      }
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
  };
  const getSelectedCityName = () => {
    const city = cities.find((c) => c.city_id === parseInt(selectedCity));
    return city?.city_name || "";
  };
  const getSelectedZoneName = () => {
    const zone = zones.find((z) => z.zone_id === parseInt(selectedZone));
    return zone?.zone_name || "";
  };
  const getSelectedAreaName = () => {
    if (!selectedArea) return "";
    const area = areas.find((a) => a.area_id === parseInt(selectedArea));
    return area?.area_name || "";
  };
  const getEstimatedDelivery = () => {
    const cityName = getSelectedCityName().toLowerCase();
    if (cityName.includes("dhaka")) return "3-4 business days";
    if (cityName.includes("chittagong") || cityName.includes("chattogram")) return "2-3 business days";
    return "3-4 business days";
  };
  const validateForm = () => {
    const errors = {};
    if (!data.recipient_name.trim()) errors.recipient_name = "Recipient name is required";
    if (!data.recipient_phone.trim()) errors.recipient_phone = "Recipient phone number is required";
    else if (!/^01[3-9]\d{8}$/.test(data.recipient_phone)) errors.recipient_phone = "Phone number must be 11 digits and start with 01";
    if (!data.recipient_email.trim()) errors.recipient_email = "Recipient email is required";
    else if (!/\S+@\S+\.\S+/.test(data.recipient_email)) errors.recipient_email = "Email is invalid";
    if (!data.recipient_address.trim()) errors.recipient_address = "Delivery address is required";
    if (!selectedCity) errors.pathao_city = "Please select a city";
    if (!selectedZone) errors.pathao_zone = "Please select a zone";
    if (!pathaoCharges) errors.pathao_charges = "Please calculate shipping charges";
    if (!termsAccepted) errors.terms = "You must accept the terms and conditions";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsProcessing(true);
    setError("");
    setValidationErrors({});
    if (!selectedCity || !selectedZone || !pathaoCharges) {
      toast.error("Please select city and zone");
      setIsProcessing(false);
      return;
    }
    if (!auth.user) {
      toast.error("Please login to continue");
      setIsProcessing(false);
      return;
    }
    const userId = auth.user.uuid || auth.user.id || auth.user.user_id;
    if (!userId) {
      toast.error("User ID not found");
      setIsProcessing(false);
      return;
    }
    const orderData = {
      user_id: userId,
      sender_name: "",
      sender_email: "",
      sender_phone: "",
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      recipient_email: data.recipient_email,
      recipient_address: data.recipient_address,
      notes: data.notes,
      payment_method: data.payment_method,
      pathao_city: selectedCity,
      pathao_city_name: getSelectedCityName(),
      pathao_zone: selectedZone,
      pathao_zone_name: getSelectedZoneName(),
      ...selectedArea && {
        pathao_area: selectedArea,
        pathao_area_name: getSelectedAreaName()
      }
    };
    try {
      await processCheckout(orderData);
    } catch (err) {
      console.error("Checkout error:", err);
      if (err && typeof err === "object") {
        setValidationErrors(err);
        setError("Please fix the validation errors below");
      } else {
        setError("Failed to process checkout. Please try again.");
      }
      setIsProcessing(false);
    }
  };
  if (cartItems.length === 0) {
    return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
      /* @__PURE__ */ jsx(SeoHead, { title: "Checkout", description: "Complete your secure checkout at HaatPoint.", canonical: "https://www.haatpoint.com/checkout", robots: "noindex, nofollow", ogTitle: "Checkout | HaatPoint", ogUrl: "https://www.haatpoint.com/checkout" }),
      /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-12", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-6 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-12 w-12 text-marigold" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-display font-extrabold uppercase text-ink mb-4", children: "Your cart is empty" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-8", children: "Add items to your cart before checkout" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/products",
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
              "Continue Shopping"
            ]
          }
        )
      ] }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: "Checkout - Secure Checkout", description: "Complete your secure checkout at HaatPoint.", canonical: "https://www.haatpoint.com/checkout", robots: "noindex, nofollow", ogTitle: "Secure Checkout | HaatPoint", ogUrl: "https://www.haatpoint.com/checkout" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Complete your purchase" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Checkout" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Review and confirm your order details" })
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded-xl flex items-start shadow-hard-sm border-red-200", children: [
        /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-5 w-5 mr-2 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: error }),
          Object.keys(validationErrors).length > 0 && /* @__PURE__ */ jsx("ul", { className: "text-sm mt-1 list-disc list-inside", children: Object.entries(validationErrors).map(([field, message]) => /* @__PURE__ */ jsxs("li", { className: "text-red-600", children: [
            field.replace(/_/g, " "),
            ": ",
            message
          ] }, field)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          store && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark px-6 py-4", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-display font-extrabold uppercase text-white flex items-center", children: [
                /* @__PURE__ */ jsx(FaStore, { className: "h-5 w-5 mr-2" }),
                "Store Information"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-white/80 text-sm mt-1", children: "Items will be shipped from this store" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim p-4 rounded-xl border border-line", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${store.logo}`,
                      alt: store.name,
                      className: "w-16 h-16 rounded-full object-cover border-2 border-marigold/30",
                      onError: (e) => {
                        e.currentTarget.src = "/default-store-logo.png";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-ink text-lg", children: store.name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 text-marigold" }),
                      "Verified Store"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-soft mt-3 pt-3 border-t border-line", children: [
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FaPhone, { className: "h-3 w-3 text-marigold" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Phone:" }),
                    " ",
                    store.mobile || "Not available"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FaEnvelope, { className: "h-3 w-3 text-marigold" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Email:" }),
                    " ",
                    store.email || "Not available"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-2", children: "This store will fulfill and ship your order" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-display font-extrabold uppercase text-white flex items-center", children: [
                /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5 mr-2" }),
                "Recipient Information"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm mt-1", children: "Who will receive this order?" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                    /* @__PURE__ */ jsx(FaUser, { className: "h-4 w-4 inline mr-1 text-marigold" }),
                    "Recipient Name *"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      value: data.recipient_name,
                      onChange: (e) => setData("recipient_name", e.target.value),
                      className: `w-full px-4 py-3 border ${validationErrors.recipient_name ? "border-red-500 bg-red-50" : "border-line"} rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`,
                      placeholder: "Enter recipient's full name"
                    }
                  ),
                  validationErrors.recipient_name && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
                    /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                    validationErrors.recipient_name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                    /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 inline mr-1 text-marigold" }),
                    "Recipient Phone *"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "tel",
                      required: true,
                      value: data.recipient_phone,
                      onChange: (e) => setData("recipient_phone", e.target.value),
                      className: `w-full px-4 py-3 border ${validationErrors.recipient_phone ? "border-red-500 bg-red-50" : "border-line"} rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`,
                      placeholder: "01XXXXXXXXX"
                    }
                  ),
                  validationErrors.recipient_phone && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
                    /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                    validationErrors.recipient_phone
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                  /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 inline mr-1 text-marigold" }),
                  "Recipient Email *"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    required: true,
                    value: data.recipient_email,
                    onChange: (e) => setData("recipient_email", e.target.value),
                    className: `w-full px-4 py-3 border ${validationErrors.recipient_email ? "border-red-500 bg-red-50" : "border-line"} rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`,
                    placeholder: "recipient@email.com"
                  }
                ),
                validationErrors.recipient_email && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
                  /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                  validationErrors.recipient_email
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                  /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 inline mr-1 text-marigold" }),
                  "Delivery Address *"
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    required: true,
                    rows: 2,
                    value: data.recipient_address,
                    onChange: (e) => setData("recipient_address", e.target.value),
                    className: `w-full px-4 py-3 border ${validationErrors.recipient_address ? "border-red-500 bg-red-50" : "border-line"} rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`,
                    placeholder: "House #, Road #, Area"
                  }
                ),
                validationErrors.recipient_address && /* @__PURE__ */ jsxs("p", { className: "text-red-500 text-sm mt-1 flex items-center", children: [
                  /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                  validationErrors.recipient_address
                ] })
              ] }),
              selectedCity && selectedZone && pathaoCharges && /* @__PURE__ */ jsx("div", { className: "bg-green-50 p-4 rounded-xl border border-green-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5 text-green-600 mr-2 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-green-800", children: "Pathao Delivery Location" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-700 mt-1", children: [
                    getSelectedZoneName(),
                    ", ",
                    getSelectedCityName(),
                    selectedArea && `, ${getSelectedAreaName()}`
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600", children: [
                      "Delivery: ",
                      /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.delivery_charge })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 flex items-center", children: [
                      /* @__PURE__ */ jsx(FaClock, { className: "h-3 w-3 mr-1" }),
                      getEstimatedDelivery()
                    ] })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-2", children: "Order Notes (Optional)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: data.notes,
                    onChange: (e) => setData("notes", e.target.value),
                    className: "w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all",
                    placeholder: "Special instructions for delivery, gate code, etc."
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark px-6 py-4", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-display font-extrabold uppercase text-white flex items-center", children: [
              /* @__PURE__ */ jsx(FaMoneyBill, { className: "h-5 w-5 mr-2" }),
              "Payment Method"
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("label", { className: `flex items-center p-4 border rounded-xl cursor-pointer transition-all ${data.payment_method === "cash_on_delivery" ? "border-marigold bg-marigold/5" : "border-line hover:border-marigold/50"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "payment_method",
                      value: "cash_on_delivery",
                      checked: data.payment_method === "cash_on_delivery",
                      onChange: () => setData("payment_method", "cash_on_delivery"),
                      className: "h-5 w-5 text-marigold"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "ml-4 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                      /* @__PURE__ */ jsx(FaMoneyBillWave, { className: "h-6 w-6 text-marigold mr-2" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Cash on Delivery" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mt-1", children: "Pay with cash when you receive your order" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-center p-4 border rounded-xl cursor-pointer transition-all ${data.payment_method === "bikash" ? "border-pink-500 bg-pink-50" : "border-line hover:border-marigold/50"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "payment_method",
                      value: "bikash",
                      checked: data.payment_method === "bikash",
                      onChange: () => setData("payment_method", "bikash"),
                      className: "h-5 w-5 text-pink-600"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "ml-4 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                      /* @__PURE__ */ jsx(FaCreditCard, { className: "h-6 w-6 text-pink-600 mr-2" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "bKash" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mt-1", children: "Pay via bKash mobile banking" })
                  ] })
                ] })
              ] }),
              validationErrors.payment_method && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: validationErrors.payment_method })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-display font-extrabold uppercase text-white flex items-center", children: [
                /* @__PURE__ */ jsx(FaBox, { className: "h-5 w-5 mr-2" }),
                "Order Summary"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-sm mt-1", children: [
                cartItems.length,
                " items in your cart"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-6 max-h-64 overflow-y-auto", children: cartItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-paper-dim rounded-xl overflow-hidden flex-shrink-0 border border-line", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: getFirstImage(item.images),
                    alt: item.name,
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      e.currentTarget.src = "/placeholder-image.jpg";
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-ink line-clamp-1", children: item.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1", children: [
                    "Qty: ",
                    item.cartQty || 1
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: (item.sale_price || item.regular_price) * (item.cartQty || 1) }) })
                ] })
              ] }, item.id)) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-line", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Subtotal" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: summary.subtotal }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Shipping" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: summary.shipping }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Tax (10%)" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: summary.tax }) })
                ] }),
                summary.discount && summary.discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Discount" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-600", children: [
                    "-",
                    /* @__PURE__ */ jsx(FormatPrice, { price: summary.discount })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-bold pt-3 border-t border-line", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-ink", children: "Total" }),
                  /* @__PURE__ */ jsx("span", { className: "text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: summary.total }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start mb-4", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      id: "terms",
                      checked: termsAccepted,
                      onChange: (e) => setTermsAccepted(e.target.checked),
                      className: "h-4 w-4 text-marigold mt-1 rounded border-line focus:ring-marigold"
                    }
                  ),
                  /* @__PURE__ */ jsxs("label", { htmlFor: "terms", className: "ml-2 text-xs text-text-soft", children: [
                    "I agree to the",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: route("terms.and.conditions"),
                        className: "text-marigold hover:underline",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: "Terms & Conditions"
                      }
                    ),
                    " ",
                    "and confirm that the order information is correct"
                  ] })
                ] }),
                validationErrors.terms && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mb-2", children: validationErrors.terms }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "submit",
                    disabled: processing || isProcessing || cartItems.length === 0 || !selectedCity || !selectedZone || !pathaoCharges || !termsAccepted,
                    className: "w-full py-4 bg-gray-900 hover:bg-marigold text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center",
                    children: [
                      /* @__PURE__ */ jsx(FaLock, { className: "h-5 w-5 mr-2" }),
                      processing || isProcessing ? /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 mr-2", viewBox: "0 0 24 24", children: [
                          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
                          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                        ] }),
                        "Processing..."
                      ] }) : "Place Order"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => window.history.back(),
                    className: "w-full mt-3 py-3 bg-paper-dim text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim/80 transition-colors flex items-center justify-center border border-line",
                    children: [
                      /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4 mr-2" }),
                      "Return to Cart"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-marigold/5 rounded-xl p-4 border border-marigold/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(FaShieldAlt, { className: "h-8 w-8 text-marigold" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink", children: "Secure Checkout" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Your information is encrypted and secure" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink mb-2", children: "Need Help?" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mb-3", children: "Contact our customer support for assistance" }),
            /* @__PURE__ */ jsxs("div", { className: "text-marigold text-sm font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaPhone, { className: "h-3 w-3" }),
              "+8801319052507"
            ] })
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] });
};
export {
  Checkout as default
};
