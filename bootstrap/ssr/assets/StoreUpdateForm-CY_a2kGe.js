import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, router, useForm } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { FaStore, FaArrowLeft, FaBuilding, FaTag, FaMobile, FaMobileAlt, FaCheck, FaImage, FaUpload, FaTimes, FaInfoCircle, FaCheckCircle, FaCertificate, FaKey, FaFileAlt, FaIdCard, FaUser, FaSave, FaExclamationTriangle } from "react-icons/fa";
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
function StoreUpdateForm({ auth, store }) {
  if (!store) {
    return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
      /* @__PURE__ */ jsx(Head, { title: "Store Not Found", children: /* @__PURE__ */ jsx("meta", { name: "description", content: "Store not found" }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx(FaStore, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-extrabold uppercase text-ink mb-2", children: "Store Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: "The store you're trying to edit does not exist or you don't have permission to access it." }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => router.visit(route("dashboard.store")),
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
              "Back to Stores"
            ]
          }
        )
      ] }) }) })
    ] });
  }
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showStoreTypeDropdown, setShowStoreTypeDropdown] = useState(false);
  const [hasNewLogo, setHasNewLogo] = useState(false);
  const { data, setData, processing, errors, reset } = useForm({
    name: store.name || "",
    logo: null,
    storetype: store.storetype || "",
    address: store.address || "",
    license: store.license || "",
    national_id: store.national_id || "",
    mobile: store.mobile || "",
    remove_logo: false
  });
  useEffect(() => {
    if (store.logo) {
      setLogoPreview(`/storage/${store.logo}`);
    }
  }, [store.logo]);
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
    setHasNewLogo(true);
    setData("remove_logo", false);
    toast.success("Logo uploaded successfully!");
  };
  const removeLogo = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    const originalPreview = store.logo ? `/storage/${store.logo}` : null;
    setLogoPreview(originalPreview);
    setData("logo", null);
    setHasNewLogo(false);
    setData("remove_logo", true);
    toast.info("Logo will be removed on update");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.name.trim()) {
      toast.error("Store name is required");
      return;
    }
    if (data.name.length < 3) {
      toast.error("Store name must be at least 3 characters");
      return;
    }
    if (data.name.length > 100) {
      toast.error("Store name must be less than 100 characters");
      return;
    }
    if (!data.storetype) {
      toast.error("Store type is required");
      return;
    }
    if (data.license && data.license.length > 24) {
      toast.error("License number must be less than 24 characters");
      return;
    }
    if (!data.national_id || data.national_id.length !== 10) {
      toast.error("National ID must be exactly 10 digits");
      return;
    }
    if (!/^\d+$/.test(data.national_id)) {
      toast.error("National ID must contain only numbers");
      return;
    }
    if (!data.mobile || data.mobile.length !== 11) {
      toast.error("Mobile number must be exactly 11 digits");
      return;
    }
    if (!/^\d+$/.test(data.mobile)) {
      toast.error("Mobile number must contain only numbers");
      return;
    }
    if (!data.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (data.address.length > 255) {
      toast.error("Address must be less than 255 characters");
      return;
    }
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name.trim());
    formData.append("storetype", data.storetype.trim());
    formData.append("license", (data.license || "").trim());
    formData.append("address", data.address.trim());
    formData.append("national_id", data.national_id.trim());
    formData.append("mobile", data.mobile.trim());
    formData.append("remove_logo", data.remove_logo.toString());
    if (data.logo) {
      formData.append("logo", data.logo);
    }
    router.put(route("dashboard.storeupdate", { store: store.id }), formData, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        toast.success("Store updated successfully!");
        router.visit(route("dashboard.store"));
      },
      onError: (errors2) => {
        if (errors2.name) {
          toast.error(errors2.name);
        } else if (errors2.national_id) {
          toast.error(errors2.national_id);
        } else if (errors2.mobile) {
          toast.error(errors2.mobile);
        } else if (errors2.address) {
          toast.error(errors2.address);
        } else if (errors2.logo) {
          toast.error(errors2.logo);
        } else if (errors2.storetype) {
          toast.error(errors2.storetype);
        } else if (errors2.license) {
          toast.error(errors2.license);
        } else {
          toast.error("Failed to update store. Please check the form for errors.");
        }
      }
    });
  };
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: `Edit ${store.name}`, children: /* @__PURE__ */ jsx("meta", { name: "description", content: "Edit your store information" }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Update your store information" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Edit Store" }),
          /* @__PURE__ */ jsxs("p", { className: "text-text-soft mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "h-4 w-4 text-marigold" }),
            "Updating: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: store.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => router.visit(route("dashboard.store")),
            className: "inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
              "Back to Stores"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
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
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold bg-white text-ink placeholder:text-text-soft",
                    disabled: processing
                  }
                )
              ] }),
              errors.address && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.address
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
                    onChange: (e) => setData("mobile", e.target.value.replace(/\D/g, "")),
                    placeholder: "Enter 11-digit mobile number",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold bg-white text-ink placeholder:text-text-soft",
                    disabled: processing,
                    maxLength: 11
                  }
                )
              ] }),
              errors.mobile && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.mobile
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Must be exactly 11 digits" })
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
                      /* @__PURE__ */ jsx("svg", { className: `h-5 w-5 text-text-soft transition-transform ${showStoreTypeDropdown ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
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
                      data.storetype === type && /* @__PURE__ */ jsx(FaCheck, { className: "h-4 w-4 text-marigold" })
                    ]
                  },
                  type
                )) })
              ] }),
              errors.storetype && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.storetype
              ] })
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
                  onClick: () => !processing && logoInputRef.current?.click(),
                  className: `border-2 border-dashed rounded-xl p-8 text-center transition-all ${!processing ? "cursor-pointer hover:border-marigold hover:bg-marigold/5" : "cursor-not-allowed"} ${!logoPreview ? "border-line" : "border-line"}`,
                  children: !logoPreview ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "mx-auto w-20 h-20 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUpload, { className: "h-10 w-10 text-marigold" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: "Upload New Logo" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Click to upload or drag and drop" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "PNG, JPG, WEBP up to 10MB" })
                    ] })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
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
                      ),
                      data.remove_logo && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-semibold", children: "Will be removed" }) })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft", children: [
                      hasNewLogo ? "New logo selected" : "Current logo",
                      hasNewLogo && /* @__PURE__ */ jsx("span", { className: "block text-xs text-text-soft", children: "Click to change" })
                    ] })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-4 w-4 text-marigold" }),
                  "Logo Guidelines"
                ] }),
                /* @__PURE__ */ jsxs("ul", { className: "text-xs text-text-soft space-y-1", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Recommended: Square format"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Auto-resized to 800px width"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Optimized to 85% quality"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Max file size: 10MB"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-marigold" }),
                    "Formats: PNG, JPG, JPEG, WEBP"
                  ] })
                ] }),
                data.remove_logo && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-red-200 bg-red-50 rounded p-2", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3" }),
                  "Logo will be removed on update"
                ] }) }),
                store.logo && !hasNewLogo && !data.remove_logo && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-green-200 bg-green-50 rounded p-2", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3" }),
                  "Current logo will be kept"
                ] }) })
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
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
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
                  value: data.license || "",
                  onChange: (e) => setData("license", e.target.value),
                  placeholder: "e.g., LIC-12345-ABCDE",
                  className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold bg-white text-ink placeholder:text-text-soft",
                  disabled: processing,
                  maxLength: 24
                }
              )
            ] }),
            errors.license && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
              errors.license
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Max 24 characters" })
          ] }) })
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
                    onChange: (e) => setData("national_id", e.target.value.replace(/\D/g, "")),
                    placeholder: "Enter 10-digit National ID",
                    className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold bg-white text-ink placeholder:text-text-soft",
                    disabled: processing,
                    maxLength: 10
                  }
                )
              ] }),
              errors.national_id && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.national_id
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Must be exactly 10 digits" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-4 border border-line", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-4 w-4 text-marigold" }),
                "Important Note"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Your National ID is used for identity verification and cannot be changed after initial registration. If you need to update this information, please contact support." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "flex-1 bg-gray-900 hover:bg-marigold text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2",
                children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }),
                  "Updating Store..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(FaSave, { className: "h-4 w-4" }),
                  "Update Store"
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => router.visit(route("dashboard.store")),
                disabled: processing,
                className: "px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300 disabled:opacity-50",
                children: "Cancel"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft space-y-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 text-marigold" }),
              /* @__PURE__ */ jsx("span", { children: "Fields marked with * are required" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-3 w-3 text-yellow-500" }),
              /* @__PURE__ */ jsx("span", { children: "Your store will remain active during update" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 text-green-500" }),
              /* @__PURE__ */ jsx("span", { children: "Changes may take a few moments to reflect" })
            ] })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  StoreUpdateForm as default
};
