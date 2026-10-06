import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { FaBuilding, FaUser, FaMobile, FaIdCard, FaLocationDot } from "react-icons/fa6";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "sonner";
import "./WhatsAppChatButton-CDSWQr0H.js";
function VendorProfile({ vendor, missingFields, isComplete }) {
  const { auth } = usePage().props;
  const { data, setData, post, processing, errors } = useForm({
    name: vendor.name ?? "",
    mobile: vendor.mobile ?? "",
    national_id: vendor.national_id ?? "",
    address: vendor.address ?? "",
    images: null
  });
  const [preview, setPreview] = useState(
    vendor.images ? `/storage/${vendor.images}` : null
  );
  const missing = missingFields ?? [];
  const formErrors = errors;
  const missingLabel = {
    name: "Full name",
    mobile: "Mobile number",
    national_id: "National ID",
    address: "Address"
  };
  const isMissing = (field) => missing.includes(field);
  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      formErrors.images = "Logo must be less than 5MB";
      return;
    }
    setData("images", file);
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("vendor.profile.update"), { forceFormData: true });
  };
  const inputClass = "w-full rounded-xl border border-line px-4 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft disabled:opacity-60";
  const FieldError = ({ field }) => formErrors[field] ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
    formErrors[field]
  ] }) : null;
  const RequiredMark = () => /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" });
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsxs(Head, { title: "Vendor Details", children: [
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Complete your vendor details to open your store" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Vendor verification" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Vendor Details" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "These details let us verify every seller on HaatPoint. They are required before you can open a store." })
      ] }),
      isComplete ? /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800", children: [
        /* @__PURE__ */ jsx(FaBuilding, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" }),
        /* @__PURE__ */ jsx("span", { children: "Your vendor details are complete. You can create your store." })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: [
        /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Still needed:",
          " ",
          /* @__PURE__ */ jsx("strong", { children: missing.map((f) => missingLabel[f] ?? f).join(", ") }),
          ". Your store stays closed until these are provided."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaBuilding, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Verification Details" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaUser, { className: "h-4 w-4 text-marigold" }),
                "Full Name",
                /* @__PURE__ */ jsx(RequiredMark, {})
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  placeholder: "e.g., Muhammad Franc",
                  className: inputClass,
                  disabled: processing
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { field: "name" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaMobile, { className: "h-4 w-4 text-marigold" }),
                "Mobile Number",
                /* @__PURE__ */ jsx(RequiredMark, {}),
                isMissing("mobile") && /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800", children: "needed" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: data.mobile,
                  onChange: (e) => setData("mobile", e.target.value),
                  placeholder: "e.g., 01712345678",
                  className: inputClass,
                  disabled: processing
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "11 digits, starting 013 to 019." }),
              /* @__PURE__ */ jsx(FieldError, { field: "mobile" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaIdCard, { className: "h-4 w-4 text-marigold" }),
                "National ID",
                /* @__PURE__ */ jsx(RequiredMark, {}),
                isMissing("national_id") && /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800", children: "needed" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.national_id,
                  onChange: (e) => setData("national_id", e.target.value),
                  placeholder: "10 or 17 digits",
                  className: inputClass,
                  disabled: processing
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Your 10-digit NID or 17-digit national ID." }),
              /* @__PURE__ */ jsx(FieldError, { field: "national_id" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaLocationDot, { className: "h-4 w-4 text-marigold" }),
                "Address",
                /* @__PURE__ */ jsx(RequiredMark, {}),
                isMissing("address") && /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800", children: "needed" })
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: data.address,
                  onChange: (e) => setData("address", e.target.value),
                  rows: 3,
                  placeholder: "Your full business address",
                  className: `${inputClass} resize-y`,
                  disabled: processing
                }
              ),
              /* @__PURE__ */ jsx(FieldError, { field: "address" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5 text-marigold" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Photo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
            preview ? /* @__PURE__ */ jsx(
              "img",
              {
                src: preview,
                alt: "Vendor",
                className: "h-20 w-20 rounded-full object-cover border border-line"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "h-20 w-20 rounded-full bg-paper-dim border border-line flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUser, { className: "h-8 w-8 text-text-soft" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "vendor-image",
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: onLogoChange
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "vendor-image",
                  className: "inline-block cursor-pointer rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper-dim transition-colors",
                  children: preview ? "Change photo" : "Upload photo"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-2", children: "Optional. JPG, PNG or WEBP, up to 5MB." }),
              /* @__PURE__ */ jsx(FieldError, { field: "images" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end gap-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-marigold font-medium rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50",
            children: processing ? "Saving..." : "Save vendor details"
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  VendorProfile as default
};
