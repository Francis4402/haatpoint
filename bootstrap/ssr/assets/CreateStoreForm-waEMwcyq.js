import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { useForm, Head, router } from "@inertiajs/react";
import React, { useRef, useState } from "react";
import { FaArrowLeft, FaBuilding, FaTag, FaStore, FaInfoCircle, FaMobile, FaMobileAlt, FaCheck, FaCheckCircle, FaImage, FaUpload, FaTimes, FaCertificate, FaKey, FaFileAlt, FaIdCard, FaUser, FaExclamationTriangle, FaPlus } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { FaAddressBook } from "react-icons/fa6";
import { toast } from "sonner";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "./WhatsAppChatButton-CDSWQr0H.js";
const STORE_TYPES = [
  "Retail Store",
  "E-commerce",
  "Wholesale",
  "Service Provider",
  "Food & Beverage",
  "Fashion & Apparel",
  "Electronics",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Fitness",
  "Books & Media",
  "Arts & Crafts",
  "Automotive",
  "Jewelry",
  "Other"
];
function CreateStoreForm({ auth }) {
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    logo: null,
    storetype: "",
    address: "",
    license: "",
    national_id: "",
    mobile: ""
  });
  const formErrors = errors;
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be less than 5MB");
      e.target.value = "";
      return;
    }
    setData("logo", file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    toast.success("Logo uploaded successfully!");
  };
  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setData("logo", null);
    toast.info("Logo removed.");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("stores.store"), {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Store created successfully!");
        router.visit(route("dashboard.store"));
        reset();
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        setShowStoreTypeDropdown(false);
        setData({
          name: "",
          logo: null,
          storetype: "",
          address: "",
          license: "",
          national_id: "",
          mobile: ""
        });
      },
      onError: () => {
        toast.error("Failed to create store. Please check the form for errors.");
      }
    });
  };
  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, []);
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsxs(Head, { title: "Create Store", children: [
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Create your online store to start selling products" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "store, ecommerce, create store, online business" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Start your online business" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Create Your Store" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Set up your online store to start selling products" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.history.back(),
            className: "inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
              "Go Back"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        formErrors.error && /* @__PURE__ */ jsxs(
          "div",
          {
            role: "alert",
            className: "flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800",
            children: [
              /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" }),
              /* @__PURE__ */ jsx("span", { children: formErrors.error })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaBuilding, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Store Information" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaTag, { className: "h-4 w-4 text-marigold" }),
                "Store Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(FaStore, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    placeholder: "e.g., My Awesome Store",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.name && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.name
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                "Choose a unique name that represents your brand"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaAddressBook, { className: "h-4 w-4 text-marigold" }),
                "Address ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(FaBuilding, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.address,
                    onChange: (e) => setData("address", e.target.value),
                    placeholder: "Address of your store",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.address && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.address
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                "Enter the full address of your store"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaMobile, { className: "h-4 w-4 text-marigold" }),
                "Mobile ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(FaMobileAlt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    value: data.mobile,
                    onChange: (e) => setData("mobile", e.target.value),
                    placeholder: "Enter your mobile number",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.mobile && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.mobile
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                "Enter your mobile number"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                "Store Type ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowStoreTypeDropdown(!showStoreTypeDropdown),
                    className: "w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white",
                    disabled: processing,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: data.storetype ? "text-ink" : "text-text-soft", children: data.storetype || "Select store type" }),
                      /* @__PURE__ */ jsx(FaCheck, { className: "h-5 w-5 text-text-soft" })
                    ]
                  }
                ),
                showStoreTypeDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto", children: STORE_TYPES.map((type) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setData("storetype", type);
                      setShowStoreTypeDropdown(false);
                    },
                    className: `w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${data.storetype === type ? "bg-marigold/10 text-marigold" : "text-ink"}`,
                    children: [
                      type,
                      data.storetype === type && /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5 text-marigold" })
                    ]
                  },
                  type
                )) })
              ] }),
              errors.storetype && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.storetype
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Select the category that best describes your business" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaImage, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Store Logo" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-text-soft", children: "(Optional)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: logoInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleLogoUpload,
                className: "hidden",
                disabled: processing
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => logoInputRef.current?.click(),
                  className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${!logoPreview ? "border-line hover:border-marigold hover:bg-marigold/5" : "border-line"} ${processing ? "opacity-50 cursor-not-allowed" : ""}`,
                  children: !logoPreview ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "mx-auto w-20 h-20 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUpload, { className: "h-10 w-10 text-marigold" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: "Upload Store Logo" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Any image format accepted" })
                    ] })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative group inline-block", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: logoPreview,
                          alt: "Logo preview",
                          className: "w-40 h-40 object-contain mx-auto rounded-lg"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            removeLogo();
                          },
                          className: "absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                          disabled: processing,
                          children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "Click to change logo" })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-4 w-4 text-marigold" }),
                  "Logo Tips"
                ] }),
                /* @__PURE__ */ jsxs("ul", { className: "text-xs text-text-soft space-y-1", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Square or circle format works best"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Transparent background recommended"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "High contrast for better visibility"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "All image formats accepted"
                  ] })
                ] })
              ] }) })
            ] }),
            errors.logo && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
              errors.logo
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaCertificate, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Business License" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-text-soft", children: "(Optional)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaKey, { className: "h-4 w-4 text-marigold" }),
                "License Number"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(FaFileAlt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.license,
                    onChange: (e) => setData("license", e.target.value),
                    placeholder: "e.g., LIC-12345-ABCDE",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.license && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.license
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                "Enter your official business license number"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-4 w-4 text-marigold" }),
                "Why Provide License Number?"
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "text-xs text-text-soft space-y-1", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Builds trust with customers"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Required for certain product categories"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Enables special business features"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Helps with payment processing"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Your information is securely stored"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaIdCard, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "National ID Verification" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-red-500", children: "(Required)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaUser, { className: "h-4 w-4 text-marigold" }),
                "National ID Number ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(FaIdCard, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.national_id,
                    onChange: (e) => setData("national_id", e.target.value),
                    placeholder: "e.g., 1234567890123",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.national_id && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.national_id
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                "Enter your government-issued National ID number"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-4 w-4 text-marigold" }),
                "Why We Need Your National ID?"
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "text-xs text-text-soft space-y-1", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Identity verification for store ownership"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Required by government regulations for businesses"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Prevents fraudulent store creation"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Secure payment processing compliance"
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                  "Your data is encrypted and protected"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-700", children: "This information is required for store verification and will be used solely for identity verification purposes." })
              ] }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Store Preview" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 border border-line rounded-xl bg-paper-dim", children: [
              logoPreview ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: logoPreview,
                  alt: "Store logo",
                  className: "w-16 h-16 rounded-xl object-cover border border-line"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "h-8 w-8 text-marigold" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-ink", children: data.name || "Your Store Name" }),
                data.storetype && /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: data.storetype })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-4 border border-line rounded-xl", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(FaStore, { className: "h-4 w-4 text-marigold" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-ink", children: "Store Status" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-green-500" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-green-600 font-medium", children: "Ready to Activate" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 border border-line rounded-xl", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(FaCertificate, { className: "h-4 w-4 text-marigold" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-ink", children: "Verification" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: `h-2 w-2 rounded-full ${data.license ? "bg-green-500" : "bg-yellow-500"}` }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${data.license ? "text-green-600" : "text-yellow-600"}`, children: data.license ? "Licensed" : "Unlicensed" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full bg-gray-900 hover:bg-marigold text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" }),
                "Creating Your Store..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
                "Create Store"
              ] })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft space-y-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: "Store name must be unique across the platform" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-3 w-3 text-orange-500" }),
              /* @__PURE__ */ jsx("span", { children: "You can only have one active store per account" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "After creation, you can add products immediately" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaCertificate, { className: "h-3 w-3 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: "License verification may take 1-2 business days" })
            ] })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  CreateStoreForm as default
};
