import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, Link, router } from "@inertiajs/react";
import { FaPlus, FaBox, FaDollarSign, FaChartLine, FaTag, FaSearch, FaFilter, FaSortAmountDown, FaImage, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
const Products = ({ auth, products, store }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.sale_price || product.regular_price) * product.quantity, 0),
    inStock: products.filter((p) => p.inStock && p.quantity > 0).length,
    outOfStock: products.filter((p) => !p.inStock || p.quantity === 0).length,
    lowStock: products.filter((p) => p.quantity > 0 && p.quantity < 20).length,
    categories: Array.from(new Set(products.map((p) => p.category))),
    averageRating: products.reduce((sum, product) => sum + (product.rating || 0), 0) / (products.length || 1)
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock = stockFilter === "all" ? true : stockFilter === "in-stock" ? product.inStock && product.quantity > 0 : stockFilter === "out-of-stock" ? !product.inStock || product.quantity === 0 : stockFilter === "low-stock" ? product.quantity > 0 && product.quantity < 20 : true;
    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-high":
        return (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price);
      case "price-low":
        return (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price);
      case "quantity-high":
        return b.quantity - a.quantity;
      case "quantity-low":
        return a.quantity - b.quantity;
      case "rating-high":
        return (b.rating || 0) - (a.rating || 0);
      case "rating-low":
        return (a.rating || 0) - (b.rating || 0);
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };
  const confirmDelete = () => {
    if (productToDelete) {
      setIsDeleting(true);
      router.delete(route("dashboard.deleteproduct", productToDelete), {
        onSuccess: () => {
          toast.success("Product deleted successfully!");
          setShowDeleteModal(false);
          setProductToDelete(null);
          setIsDeleting(false);
        },
        onError: () => {
          toast.error("Failed to delete product.");
          setShowDeleteModal(false);
          setProductToDelete(null);
          setIsDeleting(false);
        },
        preserveScroll: true
      });
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setIsDeleting(false);
  };
  const handleToast = () => {
    toast.error("Please Create Store First!");
  };
  const calculateDiscount = (regularPrice, salePrice) => {
    if (!salePrice) return 0;
    const regular = regularPrice;
    const sale = salePrice;
    return Math.round((regular - sale) / regular * 100);
  };
  const getStockStatus = (quantity, inStock) => {
    if (quantity === 0 || !inStock) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity < 10) return { label: "Low Stock", color: "bg-orange-100 text-orange-800" };
    if (quantity < 20) return { label: "Medium Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };
  const getProductName = () => {
    if (!productToDelete) return "";
    const product = products.find((p) => p.id === productToDelete);
    return product ? product.name : "";
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Products Management" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Manage your inventory" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Products" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Manage your inventory and products" })
        ] }),
        /* @__PURE__ */ jsx("div", { children: store ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("dashboard.createproduct"),
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
              "Add New Product"
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleToast,
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
              "Add New Product"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Products" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.totalProducts })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaBox, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Inventory Value" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: /* @__PURE__ */ jsx(FormatPrice, { price: stats.totalValue }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaDollarSign, { className: "h-6 w-6 text-green-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "In Stock" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.inStock })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaChartLine, { className: "h-6 w-6 text-purple-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Avg. Rating" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.averageRating.toFixed(1) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaTag, { className: "h-6 w-6 text-orange-600" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search products...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaFilter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: categoryFilter,
                onChange: (e) => setCategoryFilter(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Categories" }),
                  stats.categories.map((category) => /* @__PURE__ */ jsx("option", { value: category, children: category }, category))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaBox, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: stockFilter,
                onChange: (e) => setStockFilter(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Stock Status" }),
                  /* @__PURE__ */ jsx("option", { value: "in-stock", children: "In Stock" }),
                  /* @__PURE__ */ jsx("option", { value: "out-of-stock", children: "Out of Stock" }),
                  /* @__PURE__ */ jsx("option", { value: "low-stock", children: "Low Stock" })
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
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
                  /* @__PURE__ */ jsx("option", { value: "name-asc", children: "Name A-Z" }),
                  /* @__PURE__ */ jsx("option", { value: "name-desc", children: "Name Z-A" }),
                  /* @__PURE__ */ jsx("option", { value: "price-high", children: "Price: High to Low" }),
                  /* @__PURE__ */ jsx("option", { value: "price-low", children: "Price: Low to High" }),
                  /* @__PURE__ */ jsx("option", { value: "quantity-high", children: "Quantity: High to Low" }),
                  /* @__PURE__ */ jsx("option", { value: "quantity-low", children: "Quantity: Low to High" }),
                  /* @__PURE__ */ jsx("option", { value: "rating-high", children: "Rating: High to Low" }),
                  /* @__PURE__ */ jsx("option", { value: "rating-low", children: "Rating: Low to High" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft", children: [
            "Showing ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filteredProducts.length }),
            " of ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: stats.totalProducts }),
            " products"
          ] }),
          (searchTerm || categoryFilter !== "all" || stockFilter !== "all") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStockFilter("all");
              },
              className: "text-sm text-marigold hover:text-marigold-dark font-medium transition-colors",
              children: "Clear Filters"
            }
          )
        ] })
      ] }),
      filteredProducts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-12 text-center", children: [
        /* @__PURE__ */ jsx(FaBox, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Products Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: searchTerm ? `No results for "${searchTerm}"` : "No products match your filters" }),
        store ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("dashboard.createproduct"),
            className: "inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4 mr-2" }),
              "Add Your First Product"
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleToast,
            className: "inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4 mr-2" }),
              "Add Your First Product"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredProducts.map((product) => {
        const discount = calculateDiscount(product.regular_price, product.sale_price);
        const stockStatus = getStockStatus(product.quantity, product.inStock);
        let images = [];
        try {
          images = product.images ? JSON.parse(product.images) : [];
        } catch (e) {
          images = product.images ? [product.images] : [];
        }
        const mainImage = images.length > 0 ? images[0] : null;
        return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden bg-paper-dim", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: mainImage ? `/storage/${mainImage}` : "/otherplaceholder.jpg",
                alt: product.name,
                className: "w-full h-full object-cover hover:scale-105 transition-transform duration-300",
                onError: (e) => {
                  e.target.src = "/otherplaceholder.jpg";
                }
              }
            ),
            discount > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-hard-sm", children: [
              "-",
              discount,
              "%"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`, children: stockStatus.label }) }),
            images.length > 1 && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 right-3 bg-ink/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm", children: [
              "+",
              images.length - 1
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-text-soft bg-paper-dim px-2 py-1 rounded", children: product.category }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(FaImage, { className: "h-3 w-3 text-text-soft mr-1" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                  product.quantity,
                  " in stock"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-ink mb-2 line-clamp-1", children: product.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mb-4 line-clamp-2", children: stripHtml(product.description) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { children: product.sale_price ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.sale_price }) }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft line-through ml-2", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-yellow-500", children: "★" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink ml-1", children: product.rating || 0 })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/products/${product.slug}`,
                  className: "inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 text-sm font-medium border border-line",
                  children: [
                    /* @__PURE__ */ jsx(FaEye, { className: "h-3 w-3 mr-1" }),
                    "View"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("dashboard.productedit", product.slug),
                  className: "inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 text-sm font-medium border border-line",
                  children: [
                    /* @__PURE__ */ jsx(FaEdit, { className: "h-3 w-3 mr-1" }),
                    "Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleDeleteClick(product.id),
                  className: "inline-flex items-center justify-center px-3 py-2 bg-paper-dim text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-300 text-sm font-medium border border-red-200",
                  children: [
                    /* @__PURE__ */ jsx(FaTrash, { className: "h-3 w-3 mr-1" }),
                    "Delete"
                  ]
                }
              )
            ] })
          ] })
        ] }, product.id);
      }) }),
      /* @__PURE__ */ jsx(
        DeleteConfirmationDialog,
        {
          isOpen: showDeleteModal,
          onClose: cancelDelete,
          onConfirm: confirmDelete,
          isDeleting,
          title: "Delete Product",
          message: `Are you sure you want to delete "${getProductName()}"? This action cannot be undone and all product data will be permanently removed.`,
          variant: "danger"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Low Stock Items" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold mt-1", children: stats.lowStock })
          ] }),
          /* @__PURE__ */ jsx(FaBox, { className: "h-8 w-8 opacity-80" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-hard-sm p-6 text-white border border-red-300/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Out of Stock" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold mt-1", children: stats.outOfStock })
          ] }),
          /* @__PURE__ */ jsx(FaTag, { className: "h-8 w-8 opacity-80" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-hard-sm p-6 text-white border border-green-300/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "Categories" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold mt-1", children: stats.categories.length })
          ] }),
          /* @__PURE__ */ jsx(FaChartLine, { className: "h-8 w-8 opacity-80" })
        ] }) })
      ] })
    ] }) })
  ] });
};
export {
  Products as default
};
