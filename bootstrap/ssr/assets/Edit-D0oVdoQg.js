import { jsx, jsxs } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import UpdatePasswordForm from "./UpdatePasswordForm-Zk-ct1GA.js";
import { Tab } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import { FaUserCircle, FaKey, FaTrash, FaCheckCircle, FaCog, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import UpdateProfileInformation from "./UpdateProfileInformationForm-jjVm3HK0.js";
import DeleteUserForm from "./DeleteUserForm-BHYmwypD.js";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
function Edit({ auth, status }) {
  const [memberSince, setMemberSince] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [useStorage, setUseStorage] = useState(true);
  useEffect(() => {
    if (auth.user.created_at) {
      const date = new Date(auth.user.created_at);
      setMemberSince(date.toLocaleDateString("en-US", { month: "short", year: "numeric" }));
    }
  }, [auth.user.created_at]);
  const getProfileImageUrl = () => {
    if (useStorage && auth.user.images) return `/storage/${auth.user.images}`;
    return `https://github.com/shadcn.png`;
  };
  const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "superadmin";
  const tabs = [
    {
      name: "Profile",
      icon: /* @__PURE__ */ jsx(FaUserCircle, { className: "h-5 w-5" }),
      content: /* @__PURE__ */ jsx(
        UpdateProfileInformation,
        {
          status,
          user: auth.user
        }
      )
    },
    {
      name: "Password",
      icon: /* @__PURE__ */ jsx(FaKey, { className: "h-5 w-5" }),
      content: /* @__PURE__ */ jsx(UpdatePasswordForm, {})
    },
    // Only admins / superadmins can delete their account
    ...isAdmin ? [{
      name: "Delete Account",
      icon: /* @__PURE__ */ jsx(FaTrash, { className: "h-5 w-5" }),
      content: /* @__PURE__ */ jsx(DeleteUserForm, {})
    }] : []
  ];
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Profile Settings" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Account Settings" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600", children: "Manage your profile, security, and account preferences" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-xl overflow-hidden", children: /* @__PURE__ */ jsx(Tab.Group, { onChange: setActiveTab, children: /* @__PURE__ */ jsxs("div", { className: "lg:grid lg:grid-cols-12", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 border-r border-gray-200 bg-gray-50/50", children: /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: getProfileImageUrl(),
                  alt: auth.user.name,
                  className: "w-16 h-16 rounded-full ring-4 ring-blue-100 object-cover",
                  onError: () => setUseStorage(false)
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inset-0 bg-green-400 rounded-full opacity-75" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 truncate", children: auth.user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 truncate", children: auth.user.email }),
              /* @__PURE__ */ jsx("span", { className: "inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full", children: auth.user.role || "User" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Tab.List, { className: "space-y-1", children: tabs.map((tab, index) => /* @__PURE__ */ jsx(Tab, { as: Fragment, children: ({ selected }) => /* @__PURE__ */ jsxs(
            "button",
            {
              className: `${selected ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent"} w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-all duration-200 group`,
              children: [
                /* @__PURE__ */ jsx("span", { className: `${selected ? "text-white" : "text-gray-400 group-hover:text-blue-500"}`, children: tab.icon }),
                /* @__PURE__ */ jsx("span", { className: "font-medium flex-1", children: tab.name }),
                selected && /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-4 w-4 text-white animate-pulse" })
              ]
            }
          ) }, index)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsx(FaCog, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Last updated: ",
              (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsx(Tab.Panels, { className: "h-full", children: tabs.map((tab, index) => /* @__PURE__ */ jsx(Tab.Panel, { className: "h-full p-6 lg:p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-fadeIn", children: tab.content }) }, index)) }) })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-90 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FaCalendarAlt, { className: "inline" }),
              " Member Since"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold mt-1", children: memberSince || "Jan 2024" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm", children: /* @__PURE__ */ jsx(FaUserCircle, { className: "h-6 w-6" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-90 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FaShieldAlt, { className: "inline" }),
              " Account Status"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold mt-1", children: "Active" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm", children: /* @__PURE__ */ jsx(FaShieldAlt, { className: "h-6 w-6" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(FaCog, { className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-blue-800", children: "Account Security Tips" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-2 text-sm text-blue-700 list-disc list-inside space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Use a strong password with mix of letters, numbers, and symbols" }),
            /* @__PURE__ */ jsx("li", { children: "Enable two-factor authentication for extra security" }),
            /* @__PURE__ */ jsx("li", { children: "Keep your profile information up to date" }),
            /* @__PURE__ */ jsx("li", { children: "Regularly review your account activity" })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      ` })
  ] });
}
export {
  Edit as default
};
