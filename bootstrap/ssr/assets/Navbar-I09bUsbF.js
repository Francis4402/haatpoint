import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment as Fragment$1 } from "react";
import { Link } from "@inertiajs/react";
import { FiHome, FiTag, FiZap, FiInfo, FiMail, FiX, FiSearch, FiGlobe, FiShoppingBag, FiUser, FiChevronDown, FiGrid, FiPackage, FiHeart, FiLogOut, FiMenu, FiShoppingCart } from "react-icons/fi";
import { Transition, Dialog } from "@headlessui/react";
import { u as useStore } from "./cartStore-BOd_ZlZA.js";
import WishlistCountButton from "./WishListCountButton-B1khDX5m.js";
import { S as SearchBox } from "./SearchBox-DRAFp6FV.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { l as logoutUrl } from "./logoutUrl-IEIiw7Wd.js";
import { u as useTranslation } from "./languageStore-DF0bQFKG.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "react-icons/fa";
import "./FormatePrice-CMWyewFT.js";
const LazyLogo = ({ className }) => /* @__PURE__ */ jsx(
  LazyLoadImage,
  {
    src: "/MyLogo.png",
    alt: "Haatpoint logo",
    effect: "blur",
    wrapperClassName: className,
    className: "h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105",
    placeholderSrc: "/MyLogo-placeholder.png",
    threshold: 50,
    visibleByDefault: true,
    onError: (e) => {
      const target = e.currentTarget;
      target.src = "/fallback-logo.png";
    }
  }
);
const LazyAvatar = ({
  src,
  alt,
  className
}) => /* @__PURE__ */ jsx(
  LazyLoadImage,
  {
    src,
    alt,
    effect: "blur",
    wrapperClassName: className,
    className: "h-full w-full object-cover",
    placeholderSrc: "/placeholder.png",
    threshold: 50,
    visibleByDefault: false,
    onError: (e) => {
      const target = e.currentTarget;
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}`;
    }
  }
);
const Navbar = ({ user, wishlist }) => {
  const { language, setLanguage, toggleLanguage, t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { getTotalItems } = useStore();
  const cartItems = getTotalItems();
  const navigation = [
    { name: t("nav_home", "Home"), href: "/", icon: FiHome },
    { name: t("nav_deals", "Deals"), href: "/hotdeals", badge: t("badge_hot", "HOT"), icon: FiTag },
    { name: t("nav_new_arrivals", "New Arrivals"), href: "/new-arrivals", icon: FiZap },
    { name: t("nav_about_us", "About Us"), href: "/aboutus", icon: FiInfo },
    { name: t("nav_contact_us", "Contact Us"), href: "/contactus", icon: FiMail }
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        if (userMenuOpen) setUserMenuOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [userMenuOpen, isMobileMenuOpen]);
  const handleSearchButtonClick = () => setSearchOpen((prev) => !prev);
  const getUserAvatarUrl = (user2) => {
    if (!user2) return null;
    if (user2.images) {
      return user2.images.startsWith("http") ? user2.images : `/storage/${user2.images}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user2.name)}&background=D6430E&color=fff&size=128`;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "header",
      {
        className: "sticky top-0 z-[100] w-full border-b border-[#E3E1DB] bg-[#FBFBF9]/90 backdrop-blur-md",
        role: "banner",
        "aria-label": "Main navigation",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-16 md:h-[76px] items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-2.5 group", "aria-label": "Haatpoint home", children: [
                /* @__PURE__ */ jsx("div", { className: "h-[34px] w-auto", children: /* @__PURE__ */ jsx(LazyLogo, {}) }),
                /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-[22px] tracking-[-0.01em] uppercase", style: { color: "#1B1B1B" }, children: "Haatpoint" })
              ] }),
              /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex ml-6 gap-1", "aria-label": "Main navigation", children: navigation.map((item) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: item.href,
                  className: "flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-sm transition-colors duration-150",
                  style: { color: "#1B1B1B" },
                  onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                  onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                  children: [
                    /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4", "aria-hidden": "true" }),
                    item.name,
                    item.badge && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "ml-0.5 inline-flex items-center rounded-full bg-[#6E7F5C] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white",
                        "aria-label": `${item.badge} deals`,
                        children: item.badge
                      }
                    )
                  ]
                },
                item.name
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 md:gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleSearchButtonClick,
                  className: "md:hidden p-2.5 rounded-sm hover:bg-[#F2F2EE] transition-colors relative",
                  "aria-label": searchOpen ? t("close_menu", "Close search") : t("search_button", "Open search"),
                  "aria-expanded": searchOpen,
                  children: searchOpen ? /* @__PURE__ */ jsx(FiX, { className: "h-5 w-5", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(FiSearch, { className: "h-5 w-5", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "hidden sm:flex items-center notranslate", translate: "no", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "inline-flex items-center bg-[#F2F2EE] p-0.5 rounded-sm border border-[#E3E1DB]",
                  role: "group",
                  "aria-label": "Language selection",
                  children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setLanguage("en"),
                        className: `px-2 py-1 text-xs font-bold rounded-sm transition-all duration-150 flex items-center gap-1 ${language === "en" ? "bg-white text-[#1B1B1B] shadow-sm" : "text-[#767470] hover:text-[#1B1B1B]"}`,
                        "aria-pressed": language === "en",
                        title: "Switch to English",
                        children: [
                          /* @__PURE__ */ jsx(FiGlobe, { className: "h-3 w-3 text-[#6E7F5C]" }),
                          /* @__PURE__ */ jsx("span", { children: "EN" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setLanguage("bn"),
                        className: `px-2 py-1 text-xs font-bold rounded-sm transition-all duration-150 flex items-center gap-1 ${language === "bn" ? "bg-[#6E7F5C] text-white shadow-sm" : "text-[#767470] hover:text-[#1B1B1B]"}`,
                        "aria-pressed": language === "bn",
                        title: "বাংলায় পরিবর্তন করুন",
                        children: /* @__PURE__ */ jsx("span", { children: "বাংলা" })
                      }
                    )
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: toggleLanguage,
                  translate: "no",
                  className: "sm:hidden notranslate flex items-center gap-1 px-2 py-1.5 rounded-sm border border-[#E3E1DB] bg-white hover:bg-[#F2F2EE] text-xs font-bold text-[#1B1B1B] transition-colors",
                  "aria-label": `Toggle language. Current: ${language === "en" ? "English" : "Bangla"}`,
                  title: language === "en" ? "বাংলায় পরিবর্তন করুন" : "Switch to English",
                  children: [
                    /* @__PURE__ */ jsx(FiGlobe, { className: "h-3.5 w-3.5 text-[#6E7F5C]" }),
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-[11px] uppercase", children: language === "en" ? "বাং" : "EN" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "hidden sm:block", children: user && /* @__PURE__ */ jsx(WishlistCountButton, { wishlist }) }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("cart.index"),
                  className: "p-2.5 rounded-sm hover:bg-[#F2F2EE] transition-colors relative",
                  "aria-label": `${t("shopping_cart", "Shopping cart")}${cartItems > 0 ? `, ${cartItems} ${t("items_in_cart", "items in cart")}` : ""}`,
                  children: [
                    /* @__PURE__ */ jsx(FiShoppingBag, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" }),
                    cartItems > 0 && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#6E7F5C] text-[10px] font-mono font-semibold text-white ring-2 ring-[#FBFBF9]",
                        "aria-label": `${cartItems > 99 ? "99+" : cartItems} ${t("items_in_cart", "items in cart")}`,
                        children: cartItems > 99 ? "99+" : cartItems
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative md:block hidden", ref: userMenuRef, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setUserMenuOpen(!userMenuOpen),
                    className: "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-sm hover:bg-[#F2F2EE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6E7F5C]/40",
                    "aria-label": `${user ? user.name + "'s" : "User"} account menu`,
                    "aria-expanded": userMenuOpen,
                    "aria-haspopup": "true",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-sm", children: user ? /* @__PURE__ */ jsx(
                        LazyAvatar,
                        {
                          src: getUserAvatarUrl(user) || "",
                          alt: user.name,
                          className: "h-full w-full"
                        }
                      ) : /* @__PURE__ */ jsx(FiUser, { className: "h-4 w-4", "aria-hidden": "true" }) }),
                      user && /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-sm font-semibold", style: { color: "#1B1B1B" }, children: user.name.split(" ")[0] }),
                      /* @__PURE__ */ jsx(
                        FiChevronDown,
                        {
                          className: `hidden sm:block h-4 w-4 text-[#767470] transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`,
                          "aria-hidden": "true"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Transition,
                  {
                    show: userMenuOpen,
                    as: Fragment$1,
                    enter: "transition ease-out duration-200",
                    enterFrom: "transform opacity-0 scale-95 -translate-y-1",
                    enterTo: "transform opacity-100 scale-100 translate-y-0",
                    leave: "transition ease-in duration-150",
                    leaveFrom: "transform opacity-100 scale-100 translate-y-0",
                    leaveTo: "transform opacity-0 scale-95 -translate-y-1",
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute right-0 mt-2 w-72 origin-top-right rounded-sm bg-white border border-[#E3E1DB] shadow-hard-sm focus:outline-none z-50 overflow-hidden",
                        role: "menu",
                        "aria-label": "User menu",
                        children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx("div", { className: "px-4 py-4 bg-[#F2F2EE] border-b border-[#E3E1DB]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-lg flex-shrink-0", children: /* @__PURE__ */ jsx(
                              LazyAvatar,
                              {
                                src: getUserAvatarUrl(user) || "",
                                alt: user.name,
                                className: "h-full w-full"
                              }
                            ) }),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsx("p", { className: "font-semibold truncate", style: { color: "#1B1B1B" }, children: user.name }),
                              /* @__PURE__ */ jsx("p", { className: "text-sm truncate", style: { color: "#767470" }, children: user.email })
                            ] })
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "py-1.5", children: [
                            [
                              { href: "/dashboard", icon: FiGrid, label: t("dashboard", "Dashboard") },
                              { href: "/dashboard/profile", icon: FiUser, label: t("profile_settings", "Profile Settings") },
                              { href: "/dashboard/orders", icon: FiPackage, label: t("order_history", "Order History") }
                            ].map((it) => /* @__PURE__ */ jsxs(
                              Link,
                              {
                                href: it.href,
                                onClick: () => setUserMenuOpen(false),
                                className: "group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                style: { color: "#1B1B1B" },
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                                role: "menuitem",
                                children: [
                                  /* @__PURE__ */ jsx(it.icon, { className: "h-4 w-4 text-[#767470] group-hover:text-[#57654A]", "aria-hidden": "true" }),
                                  it.label
                                ]
                              },
                              it.href
                            )),
                            /* @__PURE__ */ jsxs(
                              Link,
                              {
                                href: "/wishlist",
                                onClick: () => setUserMenuOpen(false),
                                className: "group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                style: { color: "#1B1B1B" },
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                                role: "menuitem",
                                "aria-label": wishlist?.length > 0 ? `${t("wishlist", "Wishlist")}, ${wishlist.length} ${wishlist.length === 1 ? t("item", "item") : t("items", "items")}` : t("wishlist", "Wishlist"),
                                children: [
                                  /* @__PURE__ */ jsx(FiHeart, { "aria-hidden": "true", className: "h-4 w-4 text-[#767470] group-hover:text-[#57654A]" }),
                                  /* @__PURE__ */ jsx("span", { children: t("wishlist", "Wishlist") }),
                                  wishlist?.length > 0 && /* @__PURE__ */ jsx(
                                    "span",
                                    {
                                      className: "ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F2F2EE] font-mono text-[10px] font-medium text-[#57654A]",
                                      "aria-hidden": "true",
                                      children: wishlist.length
                                    }
                                  )
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "border-t border-[#E3E1DB] py-1.5", children: /* @__PURE__ */ jsxs(
                            Link,
                            {
                              href: logoutUrl(user?.role),
                              method: "post",
                              as: "button",
                              onClick: () => setUserMenuOpen(false),
                              className: "group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors",
                              role: "menuitem",
                              children: [
                                /* @__PURE__ */ jsx(FiLogOut, { className: "h-4 w-4 group-hover:text-red-600", "aria-hidden": "true" }),
                                t("log_out", "Log out")
                              ]
                            }
                          ) })
                        ] }) : /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
                          /* @__PURE__ */ jsxs(
                            Link,
                            {
                              href: "/login",
                              onClick: () => setUserMenuOpen(false),
                              className: "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              style: { color: "#1B1B1B" },
                              onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                              onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                              role: "menuitem",
                              children: [
                                /* @__PURE__ */ jsx(FiUser, { className: "h-4 w-4 text-[#767470]", "aria-hidden": "true" }),
                                t("sign_in", "Sign in")
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxs(
                            Link,
                            {
                              href: "/register",
                              onClick: () => setUserMenuOpen(false),
                              className: "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                              style: { color: "#1B1B1B" },
                              onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                              onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                              role: "menuitem",
                              children: [
                                /* @__PURE__ */ jsx(FiUser, { className: "h-4 w-4 text-[#767470]", "aria-hidden": "true" }),
                                t("create_account", "Create account")
                              ]
                            }
                          )
                        ] })
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setIsMobileMenuOpen(true),
                  className: "lg:hidden p-2.5 rounded-sm border hover:bg-[#F2F2EE] transition-colors",
                  style: { borderColor: "#1B1B1B" },
                  "aria-label": t("open_menu", "Open main menu"),
                  "aria-expanded": isMobileMenuOpen,
                  children: /* @__PURE__ */ jsx(FiMenu, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block pb-3 -mt-1", children: /* @__PURE__ */ jsx(
            SearchBox,
            {
              variant: "header",
              placeholder: t("search_placeholder", "Search products, brands, vendors and categories…")
            }
          ) }),
          searchOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden py-4 border-t border-[#E3E1DB]", children: [
            /* @__PURE__ */ jsx(
              SearchBox,
              {
                variant: "panel",
                autoFocus: true,
                placeholder: t("search_mobile_placeholder", "What are you looking for?"),
                onNavigate: () => setSearchOpen(false)
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearchOpen(false),
                className: "mt-3 w-full py-2.5 border-[1.5px] rounded-sm text-sm font-bold transition-colors",
                style: { borderColor: "#1B1B1B", color: "#1B1B1B" },
                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                children: t("close", "Close")
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Transition.Root, { show: isMobileMenuOpen, as: Fragment$1, children: /* @__PURE__ */ jsxs(
      Dialog,
      {
        as: "div",
        className: "relative z-[100] lg:hidden",
        onClose: setIsMobileMenuOpen,
        initialFocus: void 0,
        children: [
          /* @__PURE__ */ jsx(
            Transition.Child,
            {
              as: Fragment$1,
              enter: "ease-in-out duration-300",
              enterFrom: "opacity-0",
              enterTo: "opacity-100",
              leave: "ease-in-out duration-300",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "fixed inset-0 bg-[#1B1B1B]/50 backdrop-blur-sm transition-opacity",
                  "aria-hidden": "true"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10", children: /* @__PURE__ */ jsx(
            Transition.Child,
            {
              as: Fragment$1,
              enter: "transform transition ease-in-out duration-300",
              enterFrom: "translate-x-full",
              enterTo: "translate-x-0",
              leave: "transform transition ease-in-out duration-300",
              leaveFrom: "translate-x-0",
              leaveTo: "translate-x-full",
              children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "pointer-events-auto w-screen max-w-sm", children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex h-full flex-col shadow-2xl",
                  style: { backgroundColor: "#FBFBF9" },
                  children: [
                    /* @__PURE__ */ jsx(Dialog.Title, { className: "sr-only", children: t("main_menu", "Main navigation menu") }),
                    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border-b border-[#E3E1DB]", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "absolute -right-10 -top-14 w-40 h-40 bg-[#6E7F5C] opacity-90 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]",
                          "aria-hidden": "true"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between px-6 py-5", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                          /* @__PURE__ */ jsx("div", { className: "h-8 w-auto", children: /* @__PURE__ */ jsx(LazyLogo, {}) }),
                          /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-xl uppercase", style: { color: "#1B1B1B" }, children: "Haatpoint" })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "p-2 rounded-sm hover:bg-[#F2F2EE] transition-colors relative z-10",
                            onClick: () => setIsMobileMenuOpen(false),
                            "aria-label": t("close_menu", "Close menu"),
                            children: /* @__PURE__ */ jsx(FiX, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto py-6", children: [
                      /* @__PURE__ */ jsx("div", { className: "px-4 mb-4 notranslate", translate: "no", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-[#F2F2EE] rounded-sm border border-[#E3E1DB]", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(FiGlobe, { className: "h-4 w-4 text-[#6E7F5C]" }),
                          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-[#1B1B1B]", children: "Language / ভাষা" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center bg-white p-0.5 rounded-sm border border-[#E3E1DB]", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setLanguage("en"),
                              className: `px-2.5 py-1 text-xs font-bold rounded-sm transition-all ${language === "en" ? "bg-[#1B1B1B] text-white shadow-sm" : "text-[#767470] hover:text-[#1B1B1B]"}`,
                              children: "English"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => setLanguage("bn"),
                              className: `px-2.5 py-1 text-xs font-bold rounded-sm transition-all ${language === "bn" ? "bg-[#6E7F5C] text-white shadow-sm" : "text-[#767470] hover:text-[#1B1B1B]"}`,
                              children: "বাংলা"
                            }
                          )
                        ] })
                      ] }) }),
                      user && /* @__PURE__ */ jsx("div", { className: "px-6 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-[#F2F2EE] rounded-sm border border-[#E3E1DB]", children: [
                        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-lg flex-shrink-0", children: /* @__PURE__ */ jsx(
                          LazyAvatar,
                          {
                            src: getUserAvatarUrl(user) || "",
                            alt: user.name,
                            className: "h-full w-full"
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsx("p", { className: "font-semibold truncate", style: { color: "#1B1B1B" }, children: user.name }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm truncate", style: { color: "#767470" }, children: user.email })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsx("nav", { className: "space-y-1 px-4", "aria-label": "Mobile navigation", children: navigation.map((item) => /* @__PURE__ */ jsxs(
                        Link,
                        {
                          href: item.href,
                          onClick: () => setIsMobileMenuOpen(false),
                          className: "flex items-center justify-between rounded-sm px-4 py-3 text-base font-semibold transition-colors",
                          style: { color: "#1B1B1B" },
                          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                              /* @__PURE__ */ jsx(item.icon, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" }),
                              item.name
                            ] }),
                            item.badge && /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: "inline-flex items-center rounded-full bg-[#6E7F5C] px-2.5 py-0.5 font-mono text-[10px] uppercase text-white",
                                "aria-label": `${item.badge} deals`,
                                children: item.badge
                              }
                            )
                          ]
                        },
                        item.name
                      )) }),
                      user && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("div", { className: "border-t border-[#E3E1DB] my-6", "aria-hidden": "true" }),
                        /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
                          /* @__PURE__ */ jsx("h3", { className: "px-3 font-mono text-[11px] font-semibold uppercase tracking-widest mb-2", style: { color: "#767470" }, children: t("dashboard", "Dashboard") }),
                          /* @__PURE__ */ jsxs("nav", { className: "space-y-1", "aria-label": "Dashboard navigation", children: [
                            /* @__PURE__ */ jsxs(
                              Link,
                              {
                                href: "/dashboard",
                                onClick: () => setIsMobileMenuOpen(false),
                                className: "flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors",
                                style: { color: "#1B1B1B" },
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                                children: [
                                  /* @__PURE__ */ jsx(FiGrid, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" }),
                                  t("dashboard", "Dashboard")
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxs(
                              Link,
                              {
                                href: "/dashboard/orders",
                                onClick: () => setIsMobileMenuOpen(false),
                                className: "flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors",
                                style: { color: "#1B1B1B" },
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                                children: [
                                  /* @__PURE__ */ jsx(FiShoppingCart, { className: "h-5 w-5", style: { color: "#1B1B1B" }, "aria-hidden": "true" }),
                                  t("orders", "Orders")
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxs(
                              Link,
                              {
                                href: "/wishlist",
                                onClick: () => setIsMobileMenuOpen(false),
                                className: "flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors",
                                style: { color: "#1B1B1B" },
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                                "aria-label": wishlist?.length > 0 ? `${t("wishlist", "Wishlist")}, ${wishlist.length} ${wishlist.length === 1 ? t("item", "item") : t("items", "items")}` : t("wishlist", "Wishlist"),
                                children: [
                                  /* @__PURE__ */ jsx(FiHeart, { "aria-hidden": "true", className: "h-5 w-5", style: { color: "#1B1B1B" } }),
                                  /* @__PURE__ */ jsx("span", { children: t("wishlist", "Wishlist") }),
                                  wishlist?.length > 0 && /* @__PURE__ */ jsx(
                                    "span",
                                    {
                                      className: "ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F2F2EE] font-mono text-[10px] font-medium text-[#57654A]",
                                      "aria-hidden": "true",
                                      children: wishlist.length
                                    }
                                  )
                                ]
                              }
                            )
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "border-t border-[#E3E1DB] my-6", "aria-hidden": "true" }),
                      /* @__PURE__ */ jsx("div", { className: "px-4", children: user ? /* @__PURE__ */ jsxs(
                        Link,
                        {
                          href: logoutUrl(user?.role),
                          method: "post",
                          as: "button",
                          onClick: () => setIsMobileMenuOpen(false),
                          className: "flex w-full items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(FiLogOut, { className: "h-5 w-5", "aria-hidden": "true" }),
                            t("log_out", "Log out")
                          ]
                        }
                      ) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: "/login",
                            onClick: () => setIsMobileMenuOpen(false),
                            className: "flex w-full items-center justify-center gap-2 rounded-sm bg-[#6E7F5C] px-4 py-3 text-base font-bold text-white shadow-hard-sm hover:-translate-y-0.5 transition-transform",
                            children: t("sign_in", "Sign In")
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: "/register",
                            onClick: () => setIsMobileMenuOpen(false),
                            className: "flex w-full items-center justify-center rounded-sm border-[1.5px] px-4 py-3 text-base font-bold transition-colors",
                            style: { borderColor: "#1B1B1B", color: "#1B1B1B" },
                            onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#F2F2EE",
                            onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                            children: t("create_account", "Create Account")
                          }
                        )
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "border-t border-[#E3E1DB] px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between font-mono text-xs", style: { color: "#4B4B46" }, children: [
                      /* @__PURE__ */ jsxs("span", { children: [
                        "© ",
                        (/* @__PURE__ */ new Date()).getFullYear(),
                        " Haatpoint"
                      ] }),
                      /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: "/terms-and-conditions",
                          onClick: () => setIsMobileMenuOpen(false),
                          className: "hover:text-[#57654A] transition-colors",
                          children: t("terms", "Terms")
                        }
                      )
                    ] }) })
                  ]
                }
              ) })
            }
          ) }) }) })
        ]
      }
    ) })
  ] });
};
export {
  Navbar as default
};
