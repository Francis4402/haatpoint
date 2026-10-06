import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, Link, router } from "@inertiajs/react";
import { FaPlus, FaUsers, FaUserCog, FaUserShield, FaCheckCircle, FaExclamationCircle, FaBan, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingCart, FaDollarSign, FaStar, FaEdit, FaEye } from "react-icons/fa";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const Customers = ({ customers: initialCustomers, auth }) => {
  const customers = initialCustomers || [];
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [actionCandidate, setActionCandidate] = useState(null);
  const actionMeta = {
    admin: {
      title: "Promote to Admin",
      message: "will be promoted to admin and given admin dashboard access using their current password.",
      endpoint: "promote",
      variant: "info",
      verb: "promote"
    },
    agent: {
      title: "Make Agent",
      message: "will be converted to an agent. Their stores will transfer to the agent account and they will keep their password.",
      endpoint: "make-agent",
      variant: "info",
      verb: "convert to an agent"
    },
    user: {
      title: "Make Customer",
      message: "will be reverted to a customer. Their agent store ownership will be detached.",
      endpoint: "make-user",
      variant: "info",
      verb: "revert to a customer"
    },
    block: {
      title: "Block Account",
      message: "will be blocked and will not be able to log in until an admin unblocks them.",
      endpoint: "block",
      variant: "warning",
      verb: "block"
    },
    unblock: {
      title: "Unblock Account",
      message: "will be unblocked and will be able to log in again.",
      endpoint: "block",
      variant: "info",
      verb: "unblock"
    },
    delete: {
      title: "Delete Account",
      message: "will be permanently deleted. Orders, stores and products linked to the account will remain but will be detached from them.",
      endpoint: "delete",
      variant: "danger",
      verb: "permanently delete"
    }
  };
  const resourceType = (role) => role === "superadmin" || role === "admin" ? "admin" : role === "agent" ? "agent" : "user";
  const requestUrl = (candidate) => {
    const { customer, action } = candidate;
    if (action === "delete" || action === "block" || action === "unblock") {
      const type = resourceType(customer.role);
      return action === "delete" ? `/dashboard/customers/${type}/${customer.id}` : `/dashboard/customers/${type}/${customer.id}/block`;
    }
    return `/dashboard/customers/${customer.id}/${actionMeta[action].endpoint}`;
  };
  useEffect(() => {
    if (selectedCustomer && !customers.some((c) => c.id === selectedCustomer.id)) {
      setSelectedCustomer(null);
    }
  }, [customers, selectedCustomer]);
  const currentUserRole = auth.user?.role || "user";
  const isAdminOrSuperAdmin = ["superadmin", "admin"].includes(currentUserRole);
  const filteredCustomers = isAdminOrSuperAdmin ? customers : customers.filter((customer) => !["superadmin", "admin"].includes(customer.role));
  const getRoleColor = (role) => {
    const colors = {
      "superadmin": "bg-purple-100 text-purple-800",
      "admin": "bg-blue-100 text-blue-800",
      "agent": "bg-green-100 text-green-800",
      "deliveryman": "bg-orange-100 text-orange-800",
      "user": "bg-gray-100 text-gray-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };
  const getRoleLabel = (role) => {
    const labels = {
      "superadmin": "Super Admin",
      "admin": "Admin",
      "agent": "Agent",
      "deliveryman": "Delivery",
      "user": "Customer"
    };
    return labels[role] || "User";
  };
  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 5e3) return { label: "Platinum", color: "bg-gradient-to-r from-gray-800 to-gray-600" };
    if (totalSpent >= 2e3) return { label: "Gold", color: "bg-gradient-to-r from-yellow-500 to-yellow-700" };
    if (totalSpent >= 500) return { label: "Silver", color: "bg-gradient-to-r from-gray-400 to-gray-600" };
    return { label: "Bronze", color: "bg-gradient-to-r from-amber-800 to-amber-900" };
  };
  const getUserImage = (customer) => {
    if (customer.images) {
      if (customer.images.startsWith("http")) {
        return customer.images;
      }
      return `/storage/${customer.images}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=128&bold=true`;
  };
  const canManageCustomer = (customer) => {
    if (currentUserRole === "superadmin") return true;
    if (currentUserRole === "admin" && customer.role !== "superadmin") return true;
    return false;
  };
  const shouldHideUserInfo = (customer) => {
    if (isAdminOrSuperAdmin) return false;
    return ["superadmin", "admin"].includes(customer.role);
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "superadmin":
        return /* @__PURE__ */ jsx(FaUserShield, { className: "h-4 w-4" });
      case "admin":
        return /* @__PURE__ */ jsx(FaUserCog, { className: "h-4 w-4" });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Customers Management" }),
    /* @__PURE__ */ jsx("div", { className: "p-4 md:p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Manage your users" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Customers" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: isAdminOrSuperAdmin ? "View all registered users" : "View customer list" })
        ] }),
        isAdminOrSuperAdmin && /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/dashboard/customers/create",
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
              "Add Customer"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Customers" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: filteredCustomers.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUsers, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        isAdminOrSuperAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Admins" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: customers.filter((c) => c.role === "admin").length })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUserCog, { className: "h-6 w-6 text-blue-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Super Admins" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: customers.filter((c) => c.role === "superadmin").length })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUserShield, { className: "h-6 w-6 text-purple-600" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Verified" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: customers.filter((c) => c.email_verified_at).length })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 text-green-600" }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: isAdminOrSuperAdmin ? "All Users" : "All Customers" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft font-mono", children: [
              filteredCustomers.length,
              " ",
              filteredCustomers.length === 1 ? "user" : "users"
            ] })
          ] }),
          filteredCustomers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaUsers, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Users Found" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: isAdminOrSuperAdmin ? "No users registered yet" : "No customers available" }),
            isAdminOrSuperAdmin && /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/dashboard/customers/create",
                className: "inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
                children: [
                  /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4 mr-2" }),
                  "Add Your First User"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredCustomers.map((customer) => {
            const tier = getCustomerTier(customer.stats?.totalSpent || 0);
            const hideInfo = shouldHideUserInfo(customer);
            canManageCustomer(customer);
            if (hideInfo) {
              return /* @__PURE__ */ jsx(
                "div",
                {
                  className: "border border-line rounded-xl p-4 bg-paper-dim opacity-75",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(FaUserShield, { className: "h-8 w-8" }) }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("h3", { className: "font-bold text-ink", children: "Protected Account" }),
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800", children: [
                          /* @__PURE__ */ jsx(FaUserShield, { className: "h-3 w-3 mr-1" }),
                          "Restricted"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mt-1", children: "This account is protected and not visible to regular users" })
                    ] })
                  ] })
                },
                customer.id
              );
            }
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: `border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${selectedCustomer?.id === customer.id ? "ring-2 ring-marigold bg-marigold/5" : ""}`,
                onClick: () => setSelectedCustomer(customer),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full overflow-hidden border-2 border-line shadow-hard-sm", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: getUserImage(customer),
                      alt: customer.name,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        const target = e.target;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=128&bold=true`;
                      }
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h3", { className: "font-bold text-ink", children: customer.name }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-1 space-x-2 flex-wrap gap-1", children: [
                          /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(customer.role)}`, children: [
                            getRoleIcon(customer.role),
                            /* @__PURE__ */ jsx("span", { children: getRoleLabel(customer.role) })
                          ] }),
                          customer.stats && customer.stats.totalOrders > 0 && /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${tier.color}`, children: tier.label }),
                          customer.email_verified_at ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800", children: [
                            /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 mr-1" }),
                            "Verified"
                          ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800", children: [
                            /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                            "Unverified"
                          ] }),
                          customer.blocked && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800", children: [
                            /* @__PURE__ */ jsx(FaBan, { className: "h-3 w-3 mr-1" }),
                            "Blocked"
                          ] })
                        ] })
                      ] }),
                      isAdminOrSuperAdmin && customer.role === "agent" && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            setActionCandidate({ customer, action: "user" });
                          },
                          className: "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700 hover:ring-2 hover:ring-gray-700/30 transition-all duration-300",
                          children: [
                            /* @__PURE__ */ jsx(FaUserCog, { className: "h-3 w-3" }),
                            "Make Customer"
                          ]
                        }
                      ),
                      isAdminOrSuperAdmin && customer.role === "user" && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            setActionCandidate({ customer, action: "agent" });
                          },
                          className: "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-600 hover:ring-2 hover:ring-emerald-700/30 transition-all duration-300",
                          children: [
                            /* @__PURE__ */ jsx(FaUserCog, { className: "h-3 w-3" }),
                            "Make Agent"
                          ]
                        }
                      ),
                      currentUserRole === "superadmin" && customer.role === "user" && /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            setActionCandidate({ customer, action: "admin" });
                          },
                          className: "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink/90 hover:ring-2 hover:ring-ink/30 transition-all duration-300",
                          children: [
                            /* @__PURE__ */ jsx(FaUserShield, { className: "h-3 w-3" }),
                            "Make Admin"
                          ]
                        }
                      ),
                      currentUserRole === "superadmin" && customer.id !== auth.user?.id && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              setActionCandidate({ customer, action: customer.blocked ? "unblock" : "block" });
                            },
                            className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:ring-2 transition-all duration-300 ${customer.blocked ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:ring-emerald-600/30" : "bg-amber-500 text-white hover:bg-amber-400 hover:ring-amber-500/30"}`,
                            children: [
                              /* @__PURE__ */ jsx(FaBan, { className: "h-3 w-3" }),
                              customer.blocked ? "Unblock" : "Block"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              setActionCandidate({ customer, action: "delete" });
                            },
                            className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 hover:ring-2 hover:ring-red-600/30 transition-all duration-300",
                            children: [
                              /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" }),
                              "Delete"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-3", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-text-soft mb-1", children: [
                          /* @__PURE__ */ jsx(FaEnvelope, { className: "h-3 w-3 mr-2" }),
                          /* @__PURE__ */ jsx("span", { children: customer.email })
                        ] }),
                        customer.profile?.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-text-soft", children: [
                          /* @__PURE__ */ jsx(FaPhone, { className: "h-3 w-3 mr-2" }),
                          /* @__PURE__ */ jsx("span", { children: customer.profile.phone })
                        ] })
                      ] }),
                      customer.profile?.city && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-text-soft", children: [
                        /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-3 w-3 mr-2" }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          customer.profile.city,
                          ", ",
                          customer.profile.country
                        ] })
                      ] }) })
                    ] }),
                    customer.stats && customer.stats.totalOrders > 0 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-lg", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                          /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Orders" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-ink", children: customer.stats.totalOrders })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-lg", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                          /* @__PURE__ */ jsx(FaDollarSign, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Spent" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: customer.stats.totalSpent }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-lg", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                          /* @__PURE__ */ jsx(FaStar, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft", children: "Avg Order" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: customer.stats.avgOrderValue }) })
                      ] })
                    ] })
                  ] })
                ] })
              },
              customer.id
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: selectedCustomer ? /* @__PURE__ */ jsx(Fragment, { children: shouldHideUserInfo(selectedCustomer) ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Access Restricted" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedCustomer(null),
                className: "p-1 text-text-soft hover:text-ink transition-colors",
                children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FaUserShield, { className: "h-12 w-12 text-white" }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-ink mb-2", children: "Protected Account" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "This account belongs to an admin or super admin and its details are protected." }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-purple-50 rounded-xl border border-purple-200", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-purple-700", children: [
              /* @__PURE__ */ jsx(FaUserShield, { className: "inline mr-1" }),
              "Only admins and super admins can view this information."
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Customer Details" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedCustomer(null),
                className: "p-1 text-text-soft hover:text-ink transition-colors",
                children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden border-4 border-line shadow-hard-sm mx-auto mb-4", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: getUserImage(selectedCustomer),
                alt: selectedCustomer.name,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  const target = e.target;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=random&size=128&bold=true`;
                }
              }
            ) }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-ink", children: selectedCustomer.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mt-2 space-x-2 flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedCustomer.role)}`, children: [
                getRoleIcon(selectedCustomer.role),
                /* @__PURE__ */ jsx("span", { children: getRoleLabel(selectedCustomer.role) })
              ] }),
              selectedCustomer.email_verified_at ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
                /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 mr-1" }),
                "Verified"
              ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800", children: [
                /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-3 w-3 mr-1" }),
                "Unverified"
              ] }),
              selectedCustomer.blocked && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800", children: [
                /* @__PURE__ */ jsx(FaBan, { className: "h-3 w-3 mr-1" }),
                "Blocked"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Contact Information" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl", children: [
                  /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-text-soft mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedCustomer.email }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Email Address" })
                  ] })
                ] }),
                selectedCustomer.profile?.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center p-3 bg-paper-dim rounded-xl", children: [
                  /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 text-text-soft mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedCustomer.profile.phone }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Phone Number" })
                  ] })
                ] }),
                selectedCustomer.profile?.address && /* @__PURE__ */ jsxs("div", { className: "flex items-start p-3 bg-paper-dim rounded-xl", children: [
                  /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 text-text-soft mr-3 mt-1" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-ink", children: selectedCustomer.profile.address }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
                      selectedCustomer.profile.city,
                      ", ",
                      selectedCustomer.profile.country
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Account Information" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 bg-paper-dim rounded-xl p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Member Since" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedCustomer.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Last Updated" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedCustomer.updated_at).toLocaleDateString() })
                ] })
              ] })
            ] })
          ] }),
          selectedCustomer.stats && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Statistics" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 rounded-xl border border-blue-200", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 font-medium", children: "Total Orders" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: selectedCustomer.stats.totalOrders })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3 bg-green-50 rounded-xl border border-green-200", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 font-medium", children: "Total Spent" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedCustomer.stats.totalSpent }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3 bg-purple-50 rounded-xl border border-purple-200", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-600 font-medium", children: "Avg Order Value" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedCustomer.stats.avgOrderValue }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3 bg-orange-50 rounded-xl border border-orange-200", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 font-medium", children: "Orders This Month" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: selectedCustomer.stats.ordersThisMonth })
              ] })
            ] })
          ] }),
          selectedCustomer.stats && selectedCustomer.stats.totalOrders > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Customer Tier" }),
            /* @__PURE__ */ jsxs("div", { className: `text-center py-3 rounded-xl text-white ${getCustomerTier(selectedCustomer.stats.totalSpent).color}`, children: [
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: getCustomerTier(selectedCustomer.stats.totalSpent).label }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-90", children: [
                /* @__PURE__ */ jsx(FormatPrice, { price: selectedCustomer.stats.totalSpent }),
                " Lifetime Value"
              ] })
            ] })
          ] }),
          canManageCustomer(selectedCustomer) && /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-line", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/dashboard/customers/${selectedCustomer.id}/edit`,
                  className: "text-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line",
                  children: [
                    /* @__PURE__ */ jsx(FaEdit, { className: "inline mr-1" }),
                    "Edit Profile"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/dashboard/orders?customer=${selectedCustomer.id}`,
                  className: "text-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line",
                  children: [
                    /* @__PURE__ */ jsx(FaEye, { className: "inline mr-1" }),
                    "View Orders"
                  ]
                }
              )
            ] }),
            isAdminOrSuperAdmin && selectedCustomer.role === "agent" && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActionCandidate({ customer: selectedCustomer, action: "user" }),
                className: "mt-3 w-full text-center px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 hover:ring-2 hover:ring-gray-700/30 transition-all duration-300 font-medium",
                children: [
                  /* @__PURE__ */ jsx(FaUserCog, { className: "inline mr-1" }),
                  "Make Customer"
                ]
              }
            ),
            isAdminOrSuperAdmin && selectedCustomer.role === "user" && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActionCandidate({ customer: selectedCustomer, action: "agent" }),
                className: "mt-3 w-full text-center px-4 py-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 hover:ring-2 hover:ring-emerald-700/30 transition-all duration-300 font-medium",
                children: [
                  /* @__PURE__ */ jsx(FaUserCog, { className: "inline mr-1" }),
                  "Make Agent"
                ]
              }
            ),
            currentUserRole === "superadmin" && selectedCustomer.role === "user" && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActionCandidate({ customer: selectedCustomer, action: "admin" }),
                className: "mt-3 w-full text-center px-4 py-2.5 bg-ink text-white rounded-xl hover:bg-ink/90 hover:ring-2 hover:ring-ink/30 transition-all duration-300 font-medium",
                children: [
                  /* @__PURE__ */ jsx(FaUserShield, { className: "inline mr-1" }),
                  "Promote to Admin"
                ]
              }
            ),
            currentUserRole === "superadmin" && selectedCustomer.id !== auth.user?.id && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActionCandidate({ customer: selectedCustomer, action: selectedCustomer.blocked ? "unblock" : "block" }),
                  className: `mt-3 w-full text-center px-4 py-2.5 text-white rounded-xl hover:ring-2 transition-all duration-300 font-medium ${selectedCustomer.blocked ? "bg-emerald-600 hover:bg-emerald-500 hover:ring-emerald-600/30" : "bg-amber-500 hover:bg-amber-400 hover:ring-amber-500/30"}`,
                  children: [
                    /* @__PURE__ */ jsx(FaBan, { className: "inline mr-1" }),
                    selectedCustomer.blocked ? "Unblock Account" : "Block Account"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActionCandidate({ customer: selectedCustomer, action: "delete" }),
                  className: "mt-3 w-full text-center px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 hover:ring-2 hover:ring-red-600/30 transition-all duration-300 font-medium",
                  children: [
                    /* @__PURE__ */ jsx(FaTimes, { className: "inline mr-1" }),
                    "Delete Account"
                  ]
                }
              )
            ] })
          ] })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] mb-4", children: "Customer Details" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300 mb-6", children: "Select a customer from the list to view detailed information and statistics." }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(FaUsers, { className: "h-16 w-16 mx-auto mb-4 opacity-50" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No customer selected" })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: actionCandidate !== null,
        onClose: () => setActionCandidate(null),
        onConfirm: () => {
          if (actionCandidate) {
            const { customer, action } = actionCandidate;
            const url = requestUrl(actionCandidate);
            if (action === "delete") {
              router.delete(url);
            } else if (action === "block" || action === "unblock") {
              router.patch(url);
            } else {
              router.post(url);
            }
          }
          setActionCandidate(null);
        },
        title: actionCandidate ? actionMeta[actionCandidate.action].title : "",
        message: (() => {
          if (!actionCandidate) return "";
          const { customer, action } = actionCandidate;
          const verb = actionMeta[action].verb;
          return `Are you sure you want to ${verb} ${customer.name}? ${actionMeta[action].message}`;
        })(),
        variant: actionCandidate ? actionMeta[actionCandidate.action].variant : "info"
      }
    )
  ] });
};
export {
  Customers as default
};
