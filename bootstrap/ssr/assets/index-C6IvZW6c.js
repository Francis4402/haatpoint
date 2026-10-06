import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, router } from "@inertiajs/react";
import { FaPlus, FaFolder, FaTag, FaChartBar, FaBoxes, FaSearch, FaSortAmountDown, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import CategoryModal from "./CetegoryDialog-uWjp2APn.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
const Categories = ({ auth, categories: initialCategories }) => {
  const categories = initialCategories || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const stats = {
    totalCategories: categories.length
  };
  const parseSubcategory = (subcategoryString) => {
    if (!subcategoryString) return [];
    try {
      return JSON.parse(subcategoryString);
    } catch (e) {
      return [];
    }
  };
  const parseBrands = (brandString) => {
    if (!brandString) return [];
    try {
      const parsed = JSON.parse(brandString);
      return Array.isArray(parsed) ? parsed : [brandString];
    } catch (e) {
      return brandString ? [brandString] : [];
    }
  };
  const filteredCategories = categories.filter((category) => {
    const brands = parseBrands(category.brand);
    const matchesCategory = category.categories.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brands.some((brand) => brand.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory || matchesBrand;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.categories.localeCompare(b.categories);
      case "name-desc":
        return b.categories.localeCompare(a.categories);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return a.categories.localeCompare(b.categories);
    }
  });
  const getCategoryColor = () => {
    return "from-marigold to-marigold-dark";
  };
  const extractErrorMessage = (errs, fallback) => {
    return errs.categories || errs.brand || errs.image || errs.subcategory || errs.error || fallback;
  };
  const handleAddCategory = (formData) => {
    setProcessing(true);
    setErrors({});
    router.post(route("dashboard.storecategory"), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setShowAddModal(false);
        setErrors({});
        toast.success("Category added successfully!");
      },
      onError: (errs) => {
        console.error("Form errors:", errs);
        setErrors(errs);
        toast.error(extractErrorMessage(errs, "Failed to add category. Please check the form."));
      },
      onFinish: () => setProcessing(false)
    });
  };
  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setErrors({});
    setShowEditModal(true);
  };
  const handleUpdateCategory = (formData) => {
    if (!categoryToEdit) return;
    setProcessing(true);
    setErrors({});
    router.put(route("dashboard.updatecategory", categoryToEdit.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Category updated successfully!");
        setShowEditModal(false);
        setCategoryToEdit(null);
        setErrors({});
      },
      onError: (errs) => {
        console.error("Update errors:", errs);
        setErrors(errs);
        toast.error(extractErrorMessage(errs, "Failed to update category."));
      },
      onFinish: () => setProcessing(false)
    });
  };
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (categoryToDelete) {
      router.delete(route("dashboard.deletecategory", categoryToDelete), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
          toast.success("Category deleted successfully!");
        },
        onError: () => {
          toast.error("Failed to delete category.");
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        },
        preserveScroll: true
      });
    }
  };
  const resetAddForm = () => {
    setErrors({});
    setShowAddModal(false);
  };
  const resetEditForm = () => {
    setCategoryToEdit(null);
    setErrors({});
    setShowEditModal(false);
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Categories Management" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Organize your products" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Categories" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: "Organize and manage your product categories" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowAddModal(true),
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
              "Add New Category"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Total Categories" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: stats.totalCategories })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaFolder, { className: "h-6 w-6 text-marigold" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Subcategories" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: categories.reduce((total, cat) => total + parseSubcategory(cat.subcategory).length, 0) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaTag, { className: "h-6 w-6 text-green-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Recent Activity" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: categories.length > 0 ? new Date(categories[0].created_at).getDate() : "0" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaChartBar, { className: "h-6 w-6 text-purple-600" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-text-soft uppercase tracking-wide", children: "Organized" }),
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-ink mt-1", children: categories.length > 0 ? categories.length : "0" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaBoxes, { className: "h-6 w-6 text-orange-600" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search categories or brands...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
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
                className: "w-full md:w-48 pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "name-asc", children: "Name A-Z" }),
                  /* @__PURE__ */ jsx("option", { value: "name-desc", children: "Name Z-A" }),
                  /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
                  /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest First" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft", children: [
            "Showing ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: filteredCategories.length }),
            " of ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: stats.totalCategories }),
            " categories"
          ] }),
          searchTerm && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSearchTerm(""),
              className: "text-sm text-marigold hover:text-marigold-dark font-medium flex items-center transition-colors",
              children: [
                /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3 mr-1" }),
                "Clear Search"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "All Categories" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft font-mono", children: [
              filteredCategories.length,
              " categories"
            ] })
          ] }),
          filteredCategories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(FaFolder, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "No Categories Found" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: searchTerm ? `No results for "${searchTerm}"` : "No categories available" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowAddModal(true),
                className: "inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
                children: [
                  /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4 mr-2" }),
                  "Add Your First Category"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filteredCategories.map((category) => {
            const brands = parseBrands(category.brand);
            return /* @__PURE__ */ jsxs("div", { className: "border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
                  category.image && /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-line", children: /* @__PURE__ */ jsx(
                    LazyLoadImage,
                    {
                      src: `/storage/${category.image}`,
                      alt: category.categories,
                      effect: "blur",
                      placeholderSrc: "/otherplaceholder.jpg",
                      threshold: 100,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        e.currentTarget.style.display = "none";
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: "text-lg font-semibold text-ink cursor-pointer hover:text-marigold transition-colors",
                        onClick: () => setSelectedCategory(category),
                        children: category.categories
                      }
                    ),
                    brands.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
                      brands.slice(0, 2).map((brand, index) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full",
                          children: brand
                        },
                        index
                      )),
                      brands.length > 2 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full", children: [
                        "+",
                        brands.length - 2,
                        " more"
                      ] })
                    ] }),
                    parseSubcategory(category.subcategory).length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
                      parseSubcategory(category.subcategory).slice(0, 2).map((subcat, index) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full",
                          children: subcat
                        },
                        index
                      )),
                      parseSubcategory(category.subcategory).length > 2 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full", children: [
                        "+",
                        parseSubcategory(category.subcategory).length - 2,
                        " more"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex space-x-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleEdit(category),
                      className: "p-2 text-text-soft hover:text-marigold hover:bg-paper-dim rounded-lg transition-colors",
                      title: "Edit category",
                      children: /* @__PURE__ */ jsx(FaEdit, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleDelete(category.id),
                      className: "p-2 text-text-soft hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                      title: "Delete category",
                      children: /* @__PURE__ */ jsx(FaTrash, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 pt-3 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-text-soft font-mono", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Created: ",
                  new Date(category.created_at).toLocaleDateString()
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Updated: ",
                  new Date(category.updated_at).toLocaleDateString()
                ] })
              ] }) })
            ] }, category.id);
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          selectedCategory ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Category Details" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedCategory(null),
                  className: "p-1 text-text-soft hover:text-ink transition-colors",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              selectedCategory.image && /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden mb-4 border border-line", children: /* @__PURE__ */ jsx(
                LazyLoadImage,
                {
                  src: `/storage/${selectedCategory.image}`,
                  alt: selectedCategory.categories,
                  effect: "blur",
                  placeholderSrc: "/otherplaceholder.jpg",
                  threshold: 100,
                  className: "w-full h-48 object-cover",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                  }
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: `text-center py-4 rounded-xl bg-gradient-to-r ${getCategoryColor()} text-white mb-4 shadow-hard-sm`, children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg", children: selectedCategory.categories }) }),
              parseBrands(selectedCategory.brand).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Brands" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: parseBrands(selectedCategory.brand).map((brand, index) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full border border-blue-200",
                    children: brand
                  },
                  index
                )) })
              ] }),
              parseSubcategory(selectedCategory.subcategory).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("h5", { className: "text-xs font-mono text-text-soft uppercase tracking-wide mb-3", children: "Subcategories" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: parseSubcategory(selectedCategory.subcategory).map((subcat, index) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "px-3 py-1 bg-paper-dim text-ink text-sm rounded-full border border-line",
                    children: subcat
                  },
                  index
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 bg-paper-dim rounded-xl p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Created:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedCategory.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Last Updated:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: new Date(selectedCategory.updated_at).toLocaleDateString() })
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4", children: "Category Details" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300 mb-6", children: "Select a category from the list to view detailed information." }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx(FaFolder, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No category selected" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4", children: "Recent Categories" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: categories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3).map((category, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r ${getCategoryColor()} text-white font-bold text-sm`, children: index + 1 }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-ink", children: category.categories }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft font-mono", children: new Date(category.created_at).toLocaleDateString() })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedCategory(category),
                  className: "text-marigold hover:text-marigold-dark text-sm font-medium transition-colors",
                  children: "View"
                }
              )
            ] }, category.id)) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      CategoryModal,
      {
        isOpen: showAddModal,
        onClose: resetAddForm,
        onSave: handleAddCategory,
        isEditing: false,
        isProcessing: processing,
        errors
      }
    ),
    /* @__PURE__ */ jsx(
      CategoryModal,
      {
        isOpen: showEditModal,
        onClose: resetEditForm,
        onSave: handleUpdateCategory,
        isEditing: true,
        initialData: categoryToEdit ? {
          id: categoryToEdit.id,
          categories: categoryToEdit.categories,
          brand: categoryToEdit.brand,
          subcategory: categoryToEdit.subcategory,
          image: categoryToEdit.image
        } : void 0,
        isProcessing: processing,
        errors
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: showDeleteModal,
        onClose: () => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        },
        onConfirm: confirmDelete,
        title: "Delete Category",
        message: "Are you sure you want to delete this category? This action cannot be undone.",
        isDeleting: false
      }
    )
  ] });
};
export {
  Categories as default
};
