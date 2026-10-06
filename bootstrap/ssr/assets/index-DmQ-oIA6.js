import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { FaPlus, FaStore, FaCheckCircle, FaBan, FaDollarSign, FaStar, FaSearch, FaFilter, FaSortAmountDown, FaTimes, FaBuilding, FaIdCard, FaToggleOn, FaToggleOff, FaEdit, FaTrash, FaBox, FaTags, FaUsers, FaCalendarAlt, FaChartLine, FaEye, FaArrowRight } from "react-icons/fa";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const Store = ({ auth, stores: initialStores, products, orders }) => {
  const [stores, setStores] = useState(initialStores);
  const [searchTerm, setSearchTerm] = useState("");
  const [storeTypeFilter, setStoreTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [showMoreActions, setShowMoreActions] = useState(null);
  const [isToggling, setIsToggling] = useState(null);
  const isAdmin = auth.user.role === "admin" || auth.user.role === "superadmin";
  const isStoreActive = (store) => {
    if (store.is_active === void 0 || store.is_active === null) {
      return true;
    }
    if (typeof store.is_active === "string") {
      return store.is_active === "true" || store.is_active === "1";
    }
    return Boolean(store.is_active);
  };
  useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);
  const { props: pageProps } = usePage();
  useEffect(() => {
    if (pageProps?.errors?.error) {
      toast.error(pageProps.errors.error);
    }
  }, [pageProps?.errors]);
  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter((store) => isStoreActive(store)).length,
    inactiveStores: stores.filter((store) => !isStoreActive(store)).length,
    totalProducts: stores.reduce((sum, store) => sum + (store.stats?.totalProducts || 0), 0),
    totalOrders: stores.reduce((sum, store) => sum + (store.stats?.totalOrders || 0), 0),
    totalRevenue: stores.reduce((sum, store) => sum + (store.stats?.totalRevenue || 0), 0),
    averageRating: stores.length > 0 ? stores.reduce((sum, store) => sum + (store.stats?.averageRating || 0), 0) / stores.length : 0,
    storeTypes: Array.from(new Set(stores.map((store) => store.storetype)))
  };
  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.storetype.toLowerCase().includes(searchTerm.toLowerCase()) || (store.license?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (store.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesType = storeTypeFilter === "all" || store.storetype === storeTypeFilter;
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = isStoreActive(store);
    } else if (statusFilter === "inactive") {
      matchesStatus = !isStoreActive(store);
    }
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    const aStats = a.stats || {};
    const bStats = b.stats || {};
    const aCreatedAt = a.created_at || (/* @__PURE__ */ new Date()).toISOString();
    const bCreatedAt = b.created_at || (/* @__PURE__ */ new Date()).toISOString();
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "products-high":
        return (bStats.totalProducts || 0) - (aStats.totalProducts || 0);
      case "products-low":
        return (aStats.totalProducts || 0) - (bStats.totalProducts || 0);
      case "revenue-high":
        return (bStats.totalRevenue || 0) - (aStats.totalRevenue || 0);
      case "revenue-low":
        return (aStats.totalRevenue || 0) - (bStats.totalRevenue || 0);
      case "rating-high":
        return (bStats.averageRating || 0) - (aStats.averageRating || 0);
      case "rating-low":
        return (aStats.averageRating || 0) - (bStats.averageRating || 0);
      case "newest":
      default:
        return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
    }
  });
  const getStoreTypeColor = (storetype) => {
    const colors = {
      "Electronics": "bg-blue-100 text-blue-800 border-blue-200",
      "Fashion": "bg-purple-100 text-purple-800 border-purple-200",
      "Home & Living": "bg-green-100 text-green-800 border-green-200",
      "Sports": "bg-orange-100 text-orange-800 border-orange-200",
      "Beauty": "bg-pink-100 text-pink-800 border-pink-200",
      "Books": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Food & Beverage": "bg-amber-100 text-amber-800 border-amber-200",
      "Toys": "bg-teal-100 text-teal-800 border-teal-200"
    };
    return colors[storetype] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  const getStoreTypeGradient = (storetype) => {
    const gradients = {
      "Electronics": "from-blue-500 to-cyan-500",
      "Fashion": "from-purple-500 to-pink-500",
      "Home & Living": "from-green-500 to-emerald-500",
      "Sports": "from-orange-500 to-red-500",
      "Beauty": "from-pink-500 to-rose-500",
      "Books": "from-indigo-500 to-violet-500",
      "Food & Beverage": "from-amber-500 to-yellow-500",
      "Toys": "from-teal-500 to-cyan-500"
    };
    return gradients[storetype] || "from-gray-500 to-slate-500";
  };
  const handleDelete = (id) => {
    setStoreToDelete(id);
    setShowDeleteModal(true);
    setShowMoreActions(null);
  };
  const confirmDelete = () => {
    if (storeToDelete) {
      router.delete(route("dashboard.deletestore", storeToDelete), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
          setStores((prev) => prev.filter((store) => store.id !== storeToDelete));
          if (selectedStore?.id === storeToDelete) {
            setSelectedStore(null);
          }
        },
        onError: () => {
          setShowDeleteModal(false);
          setStoreToDelete(null);
        },
        preserveScroll: true
      });
    }
  };
  const handleEditStore = (name) => {
    router.visit(route("dashboard.storeedit", name));
    setShowMoreActions(null);
  };
  const handleViewProducts = (id) => {
    router.visit(route("dashboard.storeproducts", id));
  };
  const handleViewAnalytics = (id) => {
    router.visit(route("dashboard.storeanalytics", id));
  };
  const handleToggleActive = (storeId) => {
    setIsToggling(storeId);
    const currentStore = stores.find((s) => s.id === storeId);
    if (!currentStore) return;
    const currentStatus = isStoreActive(currentStore);
    const newStatus = !currentStatus;
    setStores(
      (prevStores) => prevStores.map((store) => {
        if (store.id === storeId) {
          return { ...store, is_active: newStatus };
        }
        return store;
      })
    );
    if (selectedStore?.id === storeId) {
      setSelectedStore((prev) => prev ? { ...prev, is_active: newStatus } : null);
    }
    router.patch(route("dashboard.store.toggle-active", storeId), {}, {
      onSuccess: () => {
        setIsToggling(null);
        router.reload({ only: ["stores"] });
      },
      onError: () => {
        setIsToggling(null);
        setStores(initialStores);
        if (selectedStore?.id === storeId) {
          const revertedStore = initialStores.find((s) => s.id === storeId);
          if (revertedStore) {
            setSelectedStore(revertedStore);
          }
        }
      },
      preserveScroll: true
    });
  };
  const clearAllFilters = () => {
    setSearchTerm("");
    setStoreTypeFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
  };
  const hasActiveFilters = searchTerm || storeTypeFilter !== "all" || statusFilter !== "all";
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Store Management" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Manage your marketplace" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Stores" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Manage all stores in your marketplace" })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("dashboard.createstore"),
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
              "Create New Store"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Stores" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.totalStores })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Active Stores" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600 mt-1", children: stats.activeStores })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 text-green-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Inactive Stores" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-red-600 mt-1", children: stats.inactiveStores })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaBan, { className: "h-6 w-6 text-red-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Revenue" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: stats.totalRevenue }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-purple-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Avg. Rating" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.averageRating.toFixed(1) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStar, { className: "h-6 w-6 text-orange-600" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search stores...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaFilter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: storeTypeFilter,
                onChange: (e) => setStoreTypeFilter(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Store Types" }),
                  stats.storeTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type }, type))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaFilter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: statusFilter,
                onChange: (e) => setStatusFilter(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
                  /* @__PURE__ */ jsx("option", { value: "active", children: "✅ Active" }),
                  /* @__PURE__ */ jsx("option", { value: "inactive", children: "🚫 Inactive" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaSortAmountDown, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
                  /* @__PURE__ */ jsx("option", { value: "name-asc", children: "Name A-Z" }),
                  /* @__PURE__ */ jsx("option", { value: "name-desc", children: "Name Z-A" }),
                  /* @__PURE__ */ jsx("option", { value: "products-high", children: "Most Products" }),
                  /* @__PURE__ */ jsx("option", { value: "products-low", children: "Fewest Products" }),
                  /* @__PURE__ */ jsx("option", { value: "revenue-high", children: "Highest Revenue" }),
                  /* @__PURE__ */ jsx("option", { value: "revenue-low", children: "Lowest Revenue" }),
                  /* @__PURE__ */ jsx("option", { value: "rating-high", children: "Highest Rating" }),
                  /* @__PURE__ */ jsx("option", { value: "rating-low", children: "Lowest Rating" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: clearAllFilters,
              className: `inline-flex items-center justify-center px-4 py-2 border rounded-xl transition-colors ${hasActiveFilters ? "bg-marigold text-white border-marigold hover:bg-marigold-dark" : "bg-paper-dim text-text-soft border-line hover:bg-paper-dim/80 cursor-not-allowed opacity-50"}`,
              disabled: !hasActiveFilters,
              children: [
                /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4 mr-2" }),
                "Clear Filters"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft", children: [
            "Showing ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filteredStores.length }),
            " of ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: stats.totalStores }),
            " stores"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            statusFilter !== "all" && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-1", children: statusFilter === "active" ? "✅" : "🚫" }),
              statusFilter === "active" ? "Active" : "Inactive",
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setStatusFilter("all"),
                  className: "ml-1 hover:text-blue-600",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" })
                }
              )
            ] }),
            storeTypeFilter !== "all" && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200", children: [
              storeTypeFilter,
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setStoreTypeFilter("all"),
                  className: "ml-1 hover:text-purple-600",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" })
                }
              )
            ] }),
            searchTerm && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200", children: [
              '"',
              searchTerm,
              '"',
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSearchTerm(""),
                  className: "ml-1 hover:text-gray-600",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" })
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 pb-4 border-b border-line", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "All Stores" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft font-mono", children: [
              filteredStores.length,
              " stores"
            ] })
          ] }),
          filteredStores.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Stores Found" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: searchTerm ? `No results for "${searchTerm}"` : "No stores available" }),
            hasActiveFilters ? /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: clearAllFilters,
                className: "inline-flex items-center px-6 py-3 bg-marigold text-white font-semibold rounded-xl hover:bg-marigold-dark transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4 mr-2" }),
                  "Clear All Filters"
                ]
              }
            ) : /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("dashboard.createstore"),
                className: "inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
                children: [
                  /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4 mr-2" }),
                  "Create Your First Store"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredStores.map((store) => {
            const storeStats = store.stats || {};
            const storeCreatedAt = store.created_at || (/* @__PURE__ */ new Date()).toISOString();
            const storeUser = store.user || {};
            const isActive = isStoreActive(store);
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: `border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${selectedStore?.id === store.id ? "ring-2 ring-marigold bg-marigold/5" : ""} ${!isActive ? "bg-gray-50 opacity-75" : ""}`,
                onClick: () => setSelectedStore(store),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-xl overflow-hidden border-2 ${!isActive ? "border-gray-300" : "border-line"} shadow-hard-sm`, children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: store.logo ? `/storage/${store.logo}` : "https://placehold.co/400x400/e2e8f0/64748b?text=Store",
                      alt: store.name,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        e.target.src = "https://placehold.co/400x400/e2e8f0/64748b?text=Store";
                      }
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                          /* @__PURE__ */ jsx("h3", { className: `font-bold text-lg truncate ${!isActive ? "text-gray-500 line-through" : "text-ink"}`, children: store.name }),
                          /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`, children: isActive ? "Active" : "Inactive" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-2 mt-1", children: [
                          /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${getStoreTypeColor(store.storetype)}`, children: [
                            /* @__PURE__ */ jsx(FaBuilding, { className: "h-3 w-3 mr-1" }),
                            store.storetype
                          ] }),
                          store.license && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-paper-dim text-text-soft border border-line", children: [
                            /* @__PURE__ */ jsx(FaIdCard, { className: "h-3 w-3 mr-1" }),
                            "Verified"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex space-x-1", children: isAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleToggleActive(store.id);
                            },
                            disabled: isToggling === store.id,
                            className: `p-2 rounded-xl transition-colors ${isActive ? "text-green-600 hover:bg-green-50" : "text-red-600 hover:bg-red-50"} ${isToggling === store.id ? "opacity-50 cursor-not-allowed" : ""}`,
                            title: isActive ? "Deactivate store" : "Activate store",
                            children: isToggling === store.id ? /* @__PURE__ */ jsx("div", { className: "animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" }) : isActive ? /* @__PURE__ */ jsx(FaToggleOn, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(FaToggleOff, { className: "h-5 w-5" })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleEditStore(store.name);
                            },
                            className: "p-2 text-marigold hover:bg-marigold/10 rounded-xl transition-colors",
                            title: "Edit store",
                            children: /* @__PURE__ */ jsx(FaEdit, { className: "h-4 w-4" })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              handleDelete(store.id);
                            },
                            className: "p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors",
                            title: "Delete store",
                            children: /* @__PURE__ */ jsx(FaTrash, { className: "h-4 w-4" })
                          }
                        )
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-1", children: [
                          /* @__PURE__ */ jsx(FaBox, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft font-medium", children: "Products" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-ink", children: products.filter((p) => p.store_id === store.id).length })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-1", children: [
                          /* @__PURE__ */ jsx(FaTags, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft font-medium", children: "Orders" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-ink", children: orders.filter((o) => o.store_id === store.id).length })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-1", children: [
                          /* @__PURE__ */ jsx(FaDollarSign, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft font-medium", children: "Revenue" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: storeStats.totalRevenue || 0 }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-center p-2 bg-paper-dim rounded-xl", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-1", children: [
                          /* @__PURE__ */ jsx(FaStar, { className: "h-3 w-3 text-text-soft mr-1" }),
                          /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft font-medium", children: "Rating" })
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-ink", children: storeStats.averageRating?.toFixed(1) || "0.0" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t border-line gap-2", children: [
                      storeUser.name && /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(FaUsers, { className: "h-3 w-3 text-text-soft mr-2" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                          "Owner: ",
                          /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: storeUser.name })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-text-soft", children: [
                        /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-3 w-3 mr-1" }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          "Created ",
                          new Date(storeCreatedAt).toLocaleDateString()
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              },
              store.id
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          selectedStore ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaStore, { className: "h-5 w-5 text-marigold" }),
                "Store Details"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedStore(null),
                  className: "p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-xl overflow-hidden border-4 border-line shadow-hard-sm mx-auto mb-4", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: selectedStore.logo ? `/storage/${selectedStore.logo}` : "https://placehold.co/400x400/e2e8f0/64748b?text=Store",
                  alt: selectedStore.name,
                  className: "w-full h-full object-cover",
                  onError: (e) => {
                    e.target.src = "https://placehold.co/400x400/e2e8f0/64748b?text=Store";
                  }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-ink", children: selectedStore.name }),
                /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isStoreActive(selectedStore) ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`, children: isStoreActive(selectedStore) ? "Active" : "Inactive" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStoreTypeColor(selectedStore.storetype)}`, children: selectedStore.storetype }),
                selectedStore.license && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-paper-dim text-text-soft border border-line", children: [
                  /* @__PURE__ */ jsx(FaIdCard, { className: "h-3 w-3 mr-1" }),
                  "Verified"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaIdCard, { className: "h-4 w-4" }),
                  "License Information"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-center", children: selectedStore.license || "No license provided" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft text-center mt-1", children: "Business License" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaUsers, { className: "h-4 w-4" }),
                  "Store Owner"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-center", children: selectedStore.email || "No email" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft text-center mt-1", children: "Contact Email" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaChartLine, { className: "h-4 w-4" }),
                  "Store Performance"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 rounded-xl border border-blue-100", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 font-medium", children: "Products" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: selectedStore.stats?.totalProducts || 0 })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-green-50 rounded-xl border border-green-100", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 font-medium", children: "Orders" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: selectedStore.stats?.totalOrders || 0 })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-purple-50 rounded-xl border border-purple-100", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-600 font-medium", children: "Revenue" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: selectedStore.stats?.totalRevenue || 0 }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-orange-50 rounded-xl border border-orange-100", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 font-medium", children: "Rating" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-ink", children: (selectedStore.stats?.averageRating || 0).toFixed(1) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-4 w-4" }),
                  "Timeline"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-3 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Created Date" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedStore.created_at || /* @__PURE__ */ new Date()).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Last Updated" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedStore.updated_at || /* @__PURE__ */ new Date()).toLocaleDateString() })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                isAdmin && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleToggleActive(selectedStore.id),
                    disabled: isToggling === selectedStore.id,
                    className: `flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${isStoreActive(selectedStore) ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"} ${isToggling === selectedStore.id ? "opacity-50 cursor-not-allowed" : ""}`,
                    children: isToggling === selectedStore.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" }),
                      "Updating..."
                    ] }) : isStoreActive(selectedStore) ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FaBan, { className: "h-4 w-4 mr-2" }),
                      "Deactivate Store"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-4 w-4 mr-2" }),
                      "Activate Store"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleViewProducts(selectedStore.id),
                    className: "flex items-center justify-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-colors font-medium text-sm border border-line",
                    children: [
                      /* @__PURE__ */ jsx(FaEye, { className: "h-4 w-4 mr-2" }),
                      "View Products"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleViewAnalytics(selectedStore.id),
                    className: "flex items-center justify-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-colors font-medium text-sm border border-line col-span-2",
                    children: [
                      /* @__PURE__ */ jsx(FaChartLine, { className: "h-4 w-4 mr-2" }),
                      "View Analytics"
                    ]
                  }
                )
              ] }) })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em]", children: "Store Details" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300", children: "Select a store to view details" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300 mb-6", children: "Click on any store from the list to view detailed information, performance metrics, and manage store settings." }),
            /* @__PURE__ */ jsxs("div", { className: "text-center py-4", children: [
              /* @__PURE__ */ jsx(FaStore, { className: "h-16 w-16 mx-auto mb-4 opacity-30" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No store selected" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaChartLine, { className: "h-5 w-5 text-marigold" }),
              "Store Types Distribution"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: stats.storeTypes.map((type) => {
              const count = stores.filter((store) => store.storetype === type).length;
              const percentage = stats.totalStores > 0 ? count / stats.totalStores * 100 : 0;
              return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: `h-2 w-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}` }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink truncate", children: type })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-text-soft", children: [
                    count,
                    " stores"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-paper-dim rounded-full h-2", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `h-2 rounded-full bg-gradient-to-r ${getStoreTypeGradient(type)}`,
                    style: { width: `${percentage}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft text-right", children: [
                  percentage.toFixed(1),
                  "%"
                ] })
              ] }, type);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FaStar, { className: "h-5 w-5 text-amber-500" }),
              "Top Performing Stores"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: stores.filter((store) => isStoreActive(store)).sort((a, b) => (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0)).slice(0, 3).map((store, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line hover:shadow-hard-sm transition-all duration-300", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm", children: index + 1 }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-ink truncate", children: store.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
                    /* @__PURE__ */ jsx(FormatPrice, { price: store.stats?.totalRevenue || 0 }),
                    " revenue"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedStore(store),
                  className: "text-marigold hover:text-marigold-dark text-sm font-medium transition-colors",
                  children: "View"
                }
              )
            ] }, store.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em]", children: "Need to onboard more stores?" }),
          /* @__PURE__ */ jsx("p", { className: "opacity-90 text-sm", children: "Streamline your store management with our enterprise features" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => router.visit(route("dashboard.createstore")),
            className: "inline-flex items-center gap-2 px-6 py-3 bg-white text-marigold font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg",
            children: [
              "Explore Features",
              /* @__PURE__ */ jsx(FaArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: showDeleteModal,
        onClose: () => setShowDeleteModal(false),
        onConfirm: confirmDelete,
        title: "Delete Store",
        message: "Are you sure you want to delete this store? All associated products and data will be permanently removed."
      }
    )
  ] });
};
export {
  Store as default
};
