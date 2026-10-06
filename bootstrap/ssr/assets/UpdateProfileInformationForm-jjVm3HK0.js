import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useForm } from "@inertiajs/react";
import { Transition, Dialog } from "@headlessui/react";
import { useState, useRef, Fragment as Fragment$1 } from "react";
import { FaUserEdit, FaUser, FaCamera, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
function UpdateProfileInformation({ status, user }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    user.images ? `/storage/${user.images}` : null
  );
  const [useStorage, setUseStorage] = useState(true);
  const fileInputRef = useRef(null);
  const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
    _method: "PATCH",
    name: user.name,
    email: user.email,
    image: null
  });
  const getProfileImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (useStorage && user.images) {
      return `/storage/${user.images}`;
    }
    if (!useStorage && user.images) {
      return user.images;
    }
    return "https://github.com/shadcn.png";
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    setData("image", file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("profile.update"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setShowSuccessModal(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setShowSuccessModal(false), 2e3);
      }
    });
    reset();
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-blue-100", children: /* @__PURE__ */ jsx(FaUserEdit, { className: "h-6 w-6 text-blue-600" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Profile Information" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "Update your personal details and email address" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-700 mb-4", children: "Profile Picture" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg", children: user.images && useStorage ? /* @__PURE__ */ jsx(
              "img",
              {
                src: getProfileImageUrl(),
                alt: user.name,
                className: "w-full h-full object-cover",
                onError: () => setUseStorage(false)
              }
            ) : /* @__PURE__ */ jsx(FaUser, { className: "w-full h-full text-gray-400 items-center justify-center p-4" }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                disabled: processing,
                className: "absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg",
                children: /* @__PURE__ */ jsx(FaCamera, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                onChange: handleImageChange,
                accept: "image/jpeg,image/png,image/jpg,image/gif,image/webp",
                className: "hidden"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700", children: "Upload new picture" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "JPG, PNG, GIF, WEBP up to 2MB" }),
            data.image && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-3 h-3" }),
              data.image.name
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400",
              placeholder: "Enter your full name",
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3", children: /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-5 w-5 text-red-500" }) })
        ] }),
        errors.name && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-4 w-4" }),
          errors.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: data.email,
              onChange: (e) => setData("email", e.target.value),
              className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 group-hover:border-gray-400",
              placeholder: "Enter your email address",
              required: true
            }
          ),
          errors.email && /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3", children: /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-5 w-5 text-red-500" }) })
        ] }),
        errors.email && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "h-4 w-4" }),
          errors.email
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5" }),
              "Save Changes"
            ] })
          }
        ),
        recentlySuccessful && /* @__PURE__ */ jsxs("span", { className: "text-green-600 font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-5 w-5" }),
          "Profile updated successfully"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Transition, { show: showSuccessModal, as: Fragment$1, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => setShowSuccessModal(false), children: [
      /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment$1,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-25" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment$1,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0 scale-95",
          enterTo: "opacity-100 scale-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100 scale-100",
          leaveTo: "opacity-0 scale-95",
          children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 text-green-600" }) }),
            /* @__PURE__ */ jsx(Dialog.Title, { className: "mt-4 text-lg font-medium text-gray-900", children: "Profile Updated" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Your profile information has been successfully updated." })
          ] })
        }
      ) }) })
    ] }) })
  ] });
}
export {
  UpdateProfileInformation as default
};
