import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { FaChevronRight, FaFilter, FaSearch, FaChevronDown, FaStore, FaTimes, FaCheckCircle, FaStar, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { Link, router } from "@inertiajs/react";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
gsap.registerPlugin(ScrollTrigger);
const StoreListPage = ({ auth, stores, wishlist }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const headerRef = useRef(null);
  const storesRef = useRef(null);
  const storeTypes = Array.from(
    new Set(stores.map((s) => s.storetype).filter(Boolean))
  );
  const cities = Array.from(
    new Set(
      stores.map((s) => {
        if (s.address) {
          const parts = s.address.split(",");
          return parts[parts.length - 1]?.trim();
        }
        return null;
      }).filter(Boolean)
    )
  );
  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || store.address && store.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || store.storetype === selectedType;
    const matchesCity = selectedCity === "all" || store.address && store.address.includes(selectedCity);
    return matchesSearch && matchesType && matchesCity;
  });
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "products":
        return a.name.localeCompare(b.name);
      case "sales":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      case "featured":
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      }
      const storeCards = storesRef.current?.querySelectorAll(".store-card");
      if (storeCards) {
        storeCards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out"
          });
        });
      }
    });
    return () => ctx.revert();
  }, [sortedStores]);
  const FilterSidebar = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-4", children: "Store Type" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `p-3 rounded-lg cursor-pointer transition-colors ${selectedType === "all" ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"}`,
            onClick: () => setSelectedType("all"),
            children: "All Stores"
          },
          "all-stores"
        ),
        storeTypes.map((type) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `p-3 rounded-lg cursor-pointer transition-colors ${selectedType === type ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"}`,
            onClick: () => setSelectedType(type),
            children: type
          },
          type
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-4", children: "Location" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `p-3 rounded-lg cursor-pointer transition-colors ${selectedCity === "all" ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"}`,
            onClick: () => setSelectedCity("all"),
            children: "All Cities"
          },
          "all-cities"
        ),
        cities.map((city) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `p-3 rounded-lg cursor-pointer transition-colors ${selectedCity === city ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"}`,
            onClick: () => setSelectedCity(city),
            children: city
          },
          city
        ))
      ] })
    ] })
  ] });
  const StoreCard = ({ store }) => {
    const cardRef = useRef(null);
    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -8,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    const handleCardClick = () => {
      router.visit(`/stores/${store.id}`);
    };
    const safeRating = typeof store.rating === "string" ? parseFloat(store.rating) || 0 : Number(store.rating) || 0;
    const ratingDisplay = Number.isFinite(safeRating) ? safeRating.toFixed(1) : "0.0";
    const reviewCount = typeof store.review_count === "string" ? parseInt(store.review_count, 10) || 0 : Number(store.review_count) || 0;
    const storeTypeDisplay = store.storetype || "General Store";
    const addressDisplay = store.address || "Address not specified";
    const storeName = store.name || "Unnamed Store";
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: cardRef,
        className: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group store-card cursor-pointer border border-gray-200",
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleCardClick,
        children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500", children: store.logo ? /* @__PURE__ */ jsx(
              "img",
              {
                src: `/storage/${store.logo}`,
                alt: storeName,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white text-xl font-bold", children: storeName.charAt(0) }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-1", children: storeName }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-md", children: [
                  /* @__PURE__ */ jsx(FaStore, { className: "h-3 w-3 mr-1" }),
                  storeTypeDisplay
                ] }) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(
                  FaStar,
                  {
                    className: `h-3.5 w-3.5 ${i < Math.floor(safeRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`
                  },
                  i
                )) }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: ratingDisplay }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
                  "(",
                  reviewCount,
                  ")"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-4", children: [
            /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: addressDisplay })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 mb-1", children: [
                /* @__PURE__ */ jsx(FaStar, { className: "h-3.5 w-3.5 text-amber-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-gray-900", children: ratingDisplay })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600", children: "Rating" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 mb-1", children: [
                /* @__PURE__ */ jsx(FaStar, { className: "h-3.5 w-3.5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-gray-900", children: reviewCount })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600", children: "Reviews" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg text-center opacity-90", children: [
            /* @__PURE__ */ jsx(FaEye, { className: "h-4 w-4 inline mr-2" }),
            "Visit Store"
          ] })
        ] })
      }
    );
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "Stores",
        description: "Explore hundreds of trusted stores on HaatPoint. Discover unique shops and quality products from vendors across Bangladesh.",
        keywords: "online stores Bangladesh, multivendor marketplace, shop local, HaatPoint stores",
        canonical: "https://www.haatpoint.com/stores",
        ogTitle: "Stores | Shop at HaatPoint",
        ogDescription: "Explore hundreds of trusted stores on HaatPoint. Discover unique shops and quality products from vendors across Bangladesh.",
        ogUrl: "https://www.haatpoint.com/stores"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs("div", { ref: headerRef, className: "mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-4", children: [
          /* @__PURE__ */ jsx(Link, { href: "/", className: "hover:text-amber-600 transition-colors", children: "Home" }),
          /* @__PURE__ */ jsx(FaChevronRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-medium", children: "Stores" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-2", children: "Explore Stores" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Discover amazing stores and their unique products" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
        /* @__PURE__ */ jsx("aside", { className: "hidden lg:block w-64 flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx(FaFilter, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Filters" })
          ] }),
          /* @__PURE__ */ jsx(FilterSidebar, {})
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "search",
                    placeholder: "Search stores...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowMobileFilters(true),
                  className: "lg:hidden flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(FaFilter, { className: "h-4 w-4 mr-2" }),
                    "Filters"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setShowSortDropdown(!showSortDropdown),
                    className: "flex items-center justify-between w-full md:w-[180px] px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
                        sortBy === "featured" && "Featured",
                        sortBy === "rating" && "Highest Rated",
                        sortBy === "products" && "Most Products",
                        sortBy === "sales" && "Most Sales",
                        sortBy === "newest" && "Newest"
                      ] }),
                      /* @__PURE__ */ jsx(
                        FaChevronDown,
                        {
                          className: `h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ),
                showSortDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full md:w-[180px] bg-white rounded-lg shadow-lg border border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSortBy("featured");
                        setShowSortDropdown(false);
                      },
                      className: `w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "featured" ? "bg-gray-50 text-amber-600" : ""}`,
                      children: "Featured"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSortBy("rating");
                        setShowSortDropdown(false);
                      },
                      className: `w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "rating" ? "bg-gray-50 text-amber-600" : ""}`,
                      children: "Highest Rated"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSortBy("products");
                        setShowSortDropdown(false);
                      },
                      className: `w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "products" ? "bg-gray-50 text-amber-600" : ""}`,
                      children: "Most Products"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSortBy("sales");
                        setShowSortDropdown(false);
                      },
                      className: `w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "sales" ? "bg-gray-50 text-amber-600" : ""}`,
                      children: "Most Sales"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSortBy("newest");
                        setShowSortDropdown(false);
                      },
                      className: `w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "newest" ? "bg-gray-50 text-amber-600" : ""}`,
                      children: "Newest"
                    }
                  )
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: filteredStores.length }),
                " ",
                "Stores Found"
              ] }),
              (selectedType !== "all" || selectedCity !== "all" || searchQuery) && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setSelectedType("all");
                    setSelectedCity("all");
                    setSearchQuery("");
                  },
                  className: "text-amber-600 hover:text-amber-700 font-medium",
                  children: "Clear Filters"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: storesRef,
              className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
              children: sortedStores.map((store) => /* @__PURE__ */ jsx(StoreCard, { store }, store.id))
            }
          ),
          sortedStores.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "h-16 w-16 mx-auto mb-4 text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "No stores found" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Try adjusting your filters or search query" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedType("all");
                  setSelectedCity("all");
                  setSearchQuery("");
                },
                className: "px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors",
                children: "Clear All Filters"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Transition, { appear: true, show: showMobileFilters, as: Fragment, children: /* @__PURE__ */ jsxs(
      Dialog,
      {
        as: "div",
        className: "relative z-50",
        onClose: setShowMobileFilters,
        children: [
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
              children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-25" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
            Transition.Child,
            {
              as: Fragment,
              enter: "ease-out duration-300",
              enterFrom: "opacity-0 scale-95",
              enterTo: "opacity-100 scale-100",
              leave: "ease-in duration-200",
              leaveFrom: "opacity-100 scale-100",
              leaveTo: "opacity-0 scale-95",
              children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                  /* @__PURE__ */ jsxs(
                    Dialog.Title,
                    {
                      as: "h3",
                      className: "text-lg font-medium leading-6 text-gray-900",
                      children: [
                        /* @__PURE__ */ jsx(FaFilter, { className: "h-5 w-5 inline mr-2" }),
                        "Filters"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowMobileFilters(false),
                      className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                      children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "max-h-[60vh] overflow-y-auto pr-2", children: /* @__PURE__ */ jsx(FilterSidebar, {}) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        setSelectedType("all");
                        setSelectedCity("all");
                        setSearchQuery("");
                      },
                      className: "flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center",
                      children: "Reset Filters"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => setShowMobileFilters(false),
                      className: "flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center",
                      children: [
                        /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-4 w-4 mr-2" }),
                        "Apply Filters"
                      ]
                    }
                  )
                ] })
              ] })
            }
          ) }) })
        ]
      }
    ) })
  ] });
};
export {
  StoreListPage as default
};
