import { jsxs, jsx } from "react/jsx-runtime";
import { useState, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { FiHome, FiUsers, FiPackage, FiShoppingCart, FiShoppingBag, FiTruck, FiCreditCard, FiMessageSquare, FiBarChart2, FiGrid, FiX, FiChevronRight, FiChevronLeft, FiMenu, FiGlobe, FiBell, FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { usePage, Link, router, useForm } from "@inertiajs/react";
import { l as logoutUrl } from "./logoutUrl-IEIiw7Wd.js";
import { S as SearchBox } from "./SearchBox-DRAFp6FV.js";
import { toast } from "sonner";
import { FaTriangleExclamation, FaPaperPlane, FaCircleExclamation, FaArrowRight } from "react-icons/fa6";
import { W as WhatsAppChatButton } from "./WhatsAppChatButton-CDSWQr0H.js";
import { u as useTranslation } from "./languageStore-DF0bQFKG.js";
function UnverifiedEmailBanner() {
  const { auth, flash } = usePage().props;
  const [sending, setSending] = useState(false);
  if (!auth?.requiresVerification) return null;
  const resend = () => {
    setSending(true);
    router.post(
      route("verification.send"),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setSending(false);
          if (flash?.error) {
            toast.error(flash.error);
          } else {
            toast.success("Verification email sent. Check your inbox.");
          }
        },
        onError: () => {
          setSending(false);
          toast.error("Could not send the verification email.");
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "alert",
      className: "mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-hard-sm",
      children: [
        /* @__PURE__ */ jsx(FaTriangleExclamation, { className: "h-5 w-5 flex-shrink-0 text-red-500" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Your email address is not verified." }),
          /* @__PURE__ */ jsx("p", { className: "text-red-700", children: "Confirming it is optional and nothing is blocked until you do. It does help us reach you about your orders and store." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: resend,
              disabled: sending,
              className: "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(FaPaperPlane, { className: "h-3.5 w-3.5" }),
                sending ? "Sending..." : "Resend"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("verification.notice"),
              className: "font-semibold text-red-700 underline underline-offset-2 hover:text-red-900",
              children: "Verify now"
            }
          )
        ] })
      ]
    }
  );
}
const FIELD_LABELS = {
  name: "Full name",
  mobile: "Mobile number",
  national_id: "National ID",
  address: "Address"
};
function IncompleteVendorProfileBanner() {
  const { auth } = usePage().props;
  if (!auth?.incompleteVendorProfile) return null;
  const missing = auth.missingVendorProfileFields ?? [];
  const labels = missing.map((field) => FIELD_LABELS[field] ?? field);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "alert",
      className: "mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-hard-sm",
      children: [
        /* @__PURE__ */ jsx(FaCircleExclamation, { className: "h-5 w-5 flex-shrink-0 text-amber-500" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Complete your vendor details to open a store." }),
          /* @__PURE__ */ jsx("p", { className: "text-amber-800", children: labels.length > 0 ? `Still needed: ${labels.join(", ")}.` : "Your vendor details are incomplete." })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("vendor.profile.edit"),
            className: "inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-amber-600",
            children: [
              "Complete details",
              /* @__PURE__ */ jsx(FaArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ]
    }
  );
}
const DashboardLayout = ({ children, title = "Dashboard", user }) => {
  const { language, setLanguage } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { url, props } = usePage();
  const unreadMessages = props.unreadMessages ?? 0;
  const { post } = useForm();
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FiHome,
      current: url === "/dashboard"
    },
    ...user.role === "admin" ? [
      {
        name: "Customers",
        href: "/dashboard/customers",
        icon: FiUsers,
        current: url.startsWith("/dashboard/customers")
      }
    ] : [],
    ...user.role === "agent" ? [
      {
        name: "Products",
        href: "/dashboard/products",
        icon: FiPackage,
        current: url.startsWith("/dashboard/products")
      },
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: FiShoppingCart,
        current: url.startsWith("/dashboard/orders")
      },
      {
        name: "Stores",
        href: "/dashboard/stores",
        icon: FiShoppingBag,
        current: url.startsWith("/dashboard/stores")
      },
      {
        name: "Shipping",
        href: "/dashboard/shipping",
        icon: FiTruck,
        current: url.startsWith("/dashboard/shipping")
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: FiCreditCard,
        current: url.startsWith("/dashboard/payments")
      },
      {
        name: "Messages",
        href: "/dashboard/messages",
        icon: FiMessageSquare,
        current: url.startsWith("/dashboard/messages")
      },
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: FiBarChart2,
        current: url.startsWith("/dashboard/analytics")
      }
    ] : [],
    ...user.role === "admin" || user.role === "superadmin" ? [
      {
        name: "Customers",
        href: "/dashboard/customers",
        icon: FiUsers,
        current: url.startsWith("/dashboard/customers")
      },
      {
        name: "Products",
        href: "/dashboard/products",
        icon: FiPackage,
        current: url.startsWith("/dashboard/products")
      },
      {
        name: "Categories",
        href: "/dashboard/categories",
        icon: FiGrid,
        current: url.startsWith("/dashboard/categories")
      },
      {
        name: "Orders",
        href: "/dashboard/admin/orders",
        icon: FiShoppingCart,
        current: url.startsWith("/dashboard/orders")
      },
      {
        name: "Stores",
        href: "/dashboard/stores",
        icon: FiShoppingBag,
        current: url.startsWith("/dashboard/stores")
      },
      {
        name: "Shipping",
        href: "/dashboard/shipping",
        icon: FiTruck,
        current: url.startsWith("/dashboard/shipping")
      },
      {
        name: "Messages",
        href: "/dashboard/messages",
        icon: FiMessageSquare,
        current: url.startsWith("/dashboard/messages")
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: FiCreditCard,
        current: url.startsWith("/dashboard/payments")
      },
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: FiBarChart2,
        current: url.startsWith("/dashboard/analytics")
      }
    ] : [],
    ...user.role === "deliveryman" ? [{
      name: "Shipping",
      href: "/dashboard/shipping",
      icon: FiTruck,
      current: url.startsWith("/dashboard/shipping")
    }, {
      name: "Payments",
      href: "/dashboard/payments",
      icon: FiCreditCard,
      current: url.startsWith("/dashboard/payments")
    }] : [],
    ...user.role === "user" ? [
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: FiCreditCard,
        current: url.startsWith("/dashboard/payments")
      },
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: FiShoppingCart,
        current: url.startsWith("/dashboard/orders")
      },
      {
        name: "Messages",
        href: "/dashboard/messages",
        icon: FiMessageSquare,
        current: url.startsWith("/dashboard/messages")
      }
    ] : []
  ];
  const handleLogout = (e) => {
    e.preventDefault();
    post(logoutUrl(user?.role));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen ", children: [
    /* @__PURE__ */ jsx(Transition.Root, { show: sidebarOpen, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50 lg:hidden", onClose: setSidebarOpen, children: [
      /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-ink/80 backdrop-blur-sm" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex", children: /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "transform transition ease-in-out duration-300",
          enterFrom: "-translate-x-full",
          enterTo: "translate-x-0",
          leave: "transform transition ease-in-out duration-300",
          leaveFrom: "translate-x-0",
          leaveTo: "-translate-x-full",
          children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "relative flex w-full max-w-xs flex-1 shadow-hard-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto bg-paper border-r border-line px-6 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex h-16 shrink-0 items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: "/MyLogo.png", alt: "Haatpoint", className: "h-8 w-auto" }) }),
              /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-display font-extrabold uppercase text-ink", children: "HaatPoint" }) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "ml-auto rounded-md p-2.5 text-text-soft hover:bg-paper-dim hover:text-ink transition-colors",
                  onClick: () => setSidebarOpen(false),
                  children: [
                    /* @__PURE__ */ jsx(FiX, { className: "h-6 w-6", "aria-hidden": "true" }),
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close sidebar" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("nav", { className: "flex flex-1 flex-col", children: /* @__PURE__ */ jsx("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: item.href,
                className: `
                                  group flex items-center gap-x-3 rounded-lg p-2.5 text-sm leading-6 font-semibold transition-all duration-200
                                  ${item.current ? "bg-marigold text-white shadow-hard-sm" : "text-ink hover:bg-paper-dim hover:text-marigold"}
                                `,
                onClick: () => setSidebarOpen(false),
                children: [
                  /* @__PURE__ */ jsx(
                    item.icon,
                    {
                      className: `h-5 w-5 shrink-0 transition-colors ${item.current ? "text-white" : "text-text-soft group-hover:text-marigold"}`,
                      "aria-hidden": "true"
                    }
                  ),
                  item.name,
                  item.current && /* @__PURE__ */ jsx("span", { className: "ml-auto w-1.5 h-1.5 bg-white rounded-full" })
                ]
              }
            ) }, item.name)) }) }) }) })
          ] }) })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: `hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex ${isCollapsed ? "lg:w-20" : "lg:w-64"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto border-r border-line bg-paper px-6 shadow-hard-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 shrink-0 items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: "/MyLogo.png", alt: "Haatpoint", className: "h-8 w-auto" }) }),
        !isCollapsed && /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-display font-extrabold uppercase text-ink", children: "HaatPoint" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "ml-auto rounded-md p-2 text-text-soft hover:bg-paper-dim hover:text-ink transition-colors",
            onClick: () => setIsCollapsed(!isCollapsed),
            children: isCollapsed ? /* @__PURE__ */ jsx(FiChevronRight, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(FiChevronLeft, { className: "h-5 w-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex flex-1 flex-col", children: /* @__PURE__ */ jsx("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: item.href,
          className: `
                          group flex items-center gap-x-3 rounded-lg p-2.5 text-sm leading-6 font-semibold transition-all duration-200
                          ${item.current ? "bg-marigold text-white shadow-hard-sm" : "text-ink hover:bg-paper-dim hover:text-marigold"}
                          ${isCollapsed ? "justify-center" : ""}
                        `,
          children: [
            /* @__PURE__ */ jsx(
              item.icon,
              {
                className: `h-5 w-5 shrink-0 transition-colors ${item.current ? "text-white" : "text-text-soft group-hover:text-marigold"}`,
                "aria-hidden": "true"
              }
            ),
            !isCollapsed && /* @__PURE__ */ jsx("span", { children: item.name }),
            item.current && !isCollapsed && /* @__PURE__ */ jsx("span", { className: "ml-auto w-1.5 h-1.5 bg-white rounded-full" })
          ]
        }
      ) }, item.name)) }) }) }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: isCollapsed ? "lg:pl-20" : "lg:pl-64", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-line bg-paper/90 backdrop-blur-md px-4 shadow-hard-sm sm:gap-x-6 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "-m-2.5 p-2.5 text-ink lg:hidden hover:bg-paper-dim rounded-lg transition-colors",
            onClick: () => setSidebarOpen(true),
            children: /* @__PURE__ */ jsx(FiMenu, { className: "h-6 w-6", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-line lg:hidden", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 gap-x-4 self-stretch lg:gap-x-6", children: [
          /* @__PURE__ */ jsx("div", { className: "relative flex min-w-0 flex-1 items-center", children: /* @__PURE__ */ jsx(
            SearchBox,
            {
              variant: "dashboard",
              placeholder: "Search products, vendors, dashboard…",
              className: "w-full"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-3 lg:gap-x-5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center notranslate", translate: "no", children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "inline-flex items-center bg-paper-dim p-0.5 rounded-sm border border-line",
                role: "group",
                "aria-label": "Language selection",
                children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLanguage("en"),
                      className: `px-2 py-1 text-xs font-bold rounded-sm transition-all flex items-center gap-1 ${language === "en" ? "bg-white text-ink shadow-sm" : "text-text-soft hover:text-ink"}`,
                      "aria-pressed": language === "en",
                      title: "Switch to English",
                      children: [
                        /* @__PURE__ */ jsx(FiGlobe, { className: "h-3 w-3 text-marigold" }),
                        /* @__PURE__ */ jsx("span", { children: "EN" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLanguage("bn"),
                      className: `px-2 py-1 text-xs font-bold rounded-sm transition-all flex items-center gap-1 ${language === "bn" ? "bg-marigold text-white shadow-sm" : "text-text-soft hover:text-ink"}`,
                      "aria-pressed": language === "bn",
                      title: "বাংলায় পরিবর্তন করুন",
                      children: /* @__PURE__ */ jsx("span", { children: "বাংলা" })
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/dashboard/messages",
                className: "-m-2.5 p-2.5 text-text-soft hover:text-ink relative transition-colors hover:bg-paper-dim rounded-lg",
                "aria-label": `${unreadMessages} unread messages`,
                children: [
                  /* @__PURE__ */ jsx(FiBell, { className: "h-6 w-6", "aria-hidden": "true" }),
                  unreadMessages > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 h-5 w-5 bg-marigold rounded-full text-xs text-white flex items-center justify-center font-bold ring-2 ring-paper", children: unreadMessages > 99 ? "99+" : unreadMessages })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:h-6 lg:w-px lg:bg-line", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "flex items-center focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 rounded-full transition-all duration-200 hover:ring-2 hover:ring-marigold/50",
                  onClick: () => setProfileOpen(!profileOpen),
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: user.images ? user.images.startsWith("http") ? user.images : `/storage/${user.images}` : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name),
                      alt: user.name,
                      className: "inline-block size-8 rounded-full ring-2 ring-line outline -outline-offset-1 outline-white transition-transform hover:scale-105",
                      onError: (e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name);
                      }
                    }
                  )
                }
              ),
              profileOpen && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "fixed inset-0 z-40",
                  onClick: () => setProfileOpen(false)
                }
              ),
              /* @__PURE__ */ jsx(
                Transition,
                {
                  show: profileOpen,
                  as: Fragment,
                  enter: "transition ease-out duration-100",
                  enterFrom: "transform opacity-0 scale-95",
                  enterTo: "transform opacity-100 scale-100",
                  leave: "transition ease-in duration-75",
                  leaveFrom: "transform opacity-100 scale-100",
                  leaveTo: "transform opacity-0 scale-95",
                  children: /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-hard-sm border border-line divide-y divide-line focus:outline-none z-50", children: [
                    /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: user.images ? user.images.startsWith("http") ? user.images : `/storage/${user.images}` : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name),
                          alt: user.name,
                          className: "size-10 rounded-full ring-2 ring-line",
                          onError: (e) => {
                            e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink", children: user.name }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft truncate", children: user.email })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
                      /* @__PURE__ */ jsxs(
                        Link,
                        {
                          href: "/dashboard/profile",
                          onClick: () => setProfileOpen(false),
                          className: `flex items-center w-full px-4 py-2.5 text-sm transition-colors text-text-soft hover:bg-paper-dim hover:text-ink`,
                          children: [
                            /* @__PURE__ */ jsx(FiUser, { className: "h-4 w-4 mr-3 text-text-soft" }),
                            "Your Profile"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        Link,
                        {
                          href: "/help",
                          onClick: () => setProfileOpen(false),
                          className: `flex items-center w-full px-4 py-2.5 text-sm transition-colors text-text-soft hover:bg-paper-dim hover:text-ink`,
                          children: [
                            /* @__PURE__ */ jsx(FiHelpCircle, { className: "h-4 w-4 mr-3 text-text-soft" }),
                            "Help & Support"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsx("form", { method: "POST", onClick: handleLogout, children: /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "submit",
                        className: `flex items-center w-full px-4 py-2.5 text-sm transition-colors text-left text-red-600 hover:bg-red-50 hover:text-red-700`,
                        children: [
                          /* @__PURE__ */ jsx(FiLogOut, { className: "h-4 w-4 mr-3" }),
                          "Sign out"
                        ]
                      }
                    ) }) })
                  ] })
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "py-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx(UnverifiedEmailBanner, {}),
        /* @__PURE__ */ jsx(IncompleteVendorProfileBanner, {}),
        children
      ] }) }),
      /* @__PURE__ */ jsx(WhatsAppChatButton, {})
    ] })
  ] });
};
export {
  DashboardLayout as D
};
