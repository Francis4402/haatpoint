import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { FaStore, FaArrowLeft, FaCheckCircle, FaBox, FaTag, FaLink, FaFileAlt, FaArrowRight, FaChevronDown, FaStar, FaFire, FaRocket, FaHashtag, FaPalette, FaPlus, FaTimes, FaWeightHanging, FaPercent, FaBookOpen, FaImage, FaTrash, FaUpload, FaInfoCircle, FaShoppingCart, FaEye, FaEdit } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiCheck } from "react-icons/hi2";
import { toast } from "sonner";
import ReactQuill from "react-quill";
/* empty css                    */
import Eyebrow from "./Eyebrow-BL4QDtth.js";
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
const quillModules = {
  toolbar: [
    [{ "header": [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ "list": "ordered" }, { "list": "bullet" }],
    [{ "script": "sub" }, { "script": "super" }],
    [{ "indent": "-1" }, { "indent": "+1" }],
    [{ "align": [] }],
    ["link", "image", "video"],
    ["clean"]
  ]
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "script",
  "indent",
  "align",
  "link",
  "image",
  "video"
];
function EditProductForm({ auth, store, stores = [], categories, product }) {
  const imagesInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showSalePrice, setShowSalePrice] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [colorInputs, setColorInputs] = useState([""]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const productTypes = [
    { value: "regular", label: "Regular", icon: FaTag, color: "text-gray-500" },
    { value: "featured", label: "Featured", icon: FaStar, color: "text-yellow-500" },
    { value: "trending", label: "Trending", icon: FaFire, color: "text-orange-500" },
    { value: "top-selling", label: "Top Selling", icon: FaRocket, color: "text-green-500" },
    { value: "new-arrival", label: "New Arrival", icon: FaBox, color: "text-blue-500" }
  ];
  const { data, setData, processing, errors, reset } = useForm({
    name: product.name || "",
    images: [],
    slug: product.slug || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    brand: product.brand || "",
    quantity: product.quantity?.toString() || "1",
    regular_price: product.regular_price?.toString() || "",
    sale_price: product.sale_price?.toString() || "",
    description: product.description || "",
    color: [],
    inStock: product.inStock ?? true,
    item_weight: product.item_weight?.toString() || "",
    store_id: store.id || "",
    product_type: product.product_type || "regular"
  });
  const selectedStore = stores.find((s) => s.id === data.store_id) ?? store;
  const discountPercentage = data.regular_price && data.sale_price ? Math.round((1 - parseFloat(data.sale_price) / parseFloat(data.regular_price)) * 100) : 0;
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
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setData("name", newName);
    if (!slugManuallyEdited) {
      setData("slug", generateSlug(newName));
    }
  };
  useEffect(() => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setExistingImages(parsedImages);
          setImagePreviews(parsedImages.map((img) => `/storage/${img}`));
        } else {
          setExistingImages([]);
          setImagePreviews([]);
        }
      } catch (e) {
        console.error("Error parsing product images:", e);
        setExistingImages([]);
        setImagePreviews([]);
      }
    }
    if (product.sale_price && Number(product.sale_price) > 0) {
      setShowSalePrice(true);
    }
    if (product.color) {
      try {
        const parsedColors = JSON.parse(product.color);
        if (Array.isArray(parsedColors) && parsedColors.length > 0) {
          setColorInputs(parsedColors.filter((color) => color.trim() !== ""));
          setData("color", parsedColors.filter((color) => color.trim() !== ""));
        } else {
          setColorInputs([""]);
        }
      } catch (e) {
        console.error("Error parsing product colors:", e);
        setColorInputs([""]);
      }
    }
    if (product.product_type) {
      setData("product_type", product.product_type);
    }
    if (product.brand) {
      setData("brand", product.brand);
    }
  }, [product]);
  useEffect(() => {
    if (data.category) {
      const selectedCat = categories.find((cat) => cat.categories === data.category);
      if (selectedCat) {
        if (selectedCat.subcategory) {
          const subcategories = parseSubcategory(selectedCat.subcategory);
          setAvailableSubcategories(subcategories);
          if (data.subcategory && !subcategories.includes(data.subcategory)) {
            setData("subcategory", "");
          }
        } else {
          setAvailableSubcategories([]);
          setData("subcategory", "");
        }
        if (selectedCat.brand) {
          const brands = parseBrands(selectedCat.brand);
          setAvailableBrands(brands);
          if (data.brand && !brands.includes(data.brand)) {
            setData("brand", "");
          }
        } else {
          setAvailableBrands([]);
          setData("brand", "");
        }
      }
    } else {
      setAvailableSubcategories([]);
      setAvailableBrands([]);
      setData("subcategory", "");
      setData("brand", "");
    }
  }, [data.category, categories]);
  useEffect(() => {
    const validColors = colorInputs.filter((color) => color.trim() !== "");
    setData("color", validColors);
  }, [colorInputs]);
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);
  const addColorInput = () => {
    setColorInputs([...colorInputs, ""]);
  };
  const updateColorInput = (index, value) => {
    const newInputs = [...colorInputs];
    newInputs[index] = value;
    setColorInputs(newInputs);
  };
  const removeColorInput = (index) => {
    const newInputs = colorInputs.filter((_, i) => i !== index);
    setColorInputs(newInputs);
    if (newInputs.length === 0) {
      setColorInputs([""]);
    }
  };
  const getValidColors = () => {
    return colorInputs.filter((color) => color.trim() !== "");
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error(
        `File${oversizedFiles.length > 1 ? "s" : ""} too large: ${oversizedFiles.map((f) => f.name).join(", ")}. Maximum size is 5MB per image.`,
        { duration: 5e3, position: "top-center" }
      );
      return;
    }
    if (files.length) {
      setData("images", files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
      toast.success(`${files.length} image(s) uploaded successfully!`, {
        duration: 3e3,
        position: "top-center"
      });
    }
  };
  const removeExistingImage = (index, imageName) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
    setImagePreviews(newPreviews);
    setImagesToRemove([...imagesToRemove, imageName]);
    toast.info("Image marked for removal");
  };
  const removeNewImage = (index) => {
    const imageIndex = index - existingImages.length;
    if (imageIndex >= 0 && imageIndex < data.images.length) {
      const newImages = data.images.filter((_, i) => i !== imageIndex);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      URL.revokeObjectURL(imagePreviews[index]);
      setData("images", newImages);
      setImagePreviews(newPreviews);
      toast.info("New image removed");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory || "");
    formData.append("brand", data.brand || "");
    formData.append("quantity", data.quantity);
    formData.append("regular_price", data.regular_price);
    if (data.sale_price) {
      formData.append("sale_price", data.sale_price);
    }
    formData.append("description", data.description);
    formData.append("color", JSON.stringify(data.color));
    formData.append("inStock", data.inStock ? "1" : "0");
    formData.append("store_id", data.store_id);
    formData.append("item_weight", data.item_weight);
    formData.append("product_type", data.product_type);
    data.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    formData.append("images_to_remove", JSON.stringify(imagesToRemove));
    formData.append("_method", "PUT");
    router.post(route("dashboard.updateproduct", product.slug), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Product updated successfully!");
        setImagesToRemove([]);
        reset("images");
        router.visit("/dashboard/products");
      },
      onError: (errs) => {
        console.error("Update failed:", errs);
        const firstError = Object.values(errs)[0];
        toast.error(`Failed: ${firstError || "Unknown error"}`);
      }
    });
  };
  const handleNumberInput = (e, field) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setData(field, value);
    }
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsxs(Head, { title: "Edit Product", children: [
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Edit product information" }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "edit product, update product, product management" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-4 md:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Update product information" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Edit Product" }),
          /* @__PURE__ */ jsxs("p", { className: "text-text-soft mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FaStore, { className: "h-4 w-4 text-marigold" }),
            "Update product in ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: selectedStore.name })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-1", children: [
            "Product ID: ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: product.id })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("dashboard.products"),
            className: "inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-ink hover:bg-paper-dim font-medium rounded-xl transition-all duration-300",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
              "Back to Products"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-white/20", children: /* @__PURE__ */ jsx(FaStore, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display font-extrabold uppercase text-lg", children: "Editing Product" }),
              /* @__PURE__ */ jsxs("p", { className: "opacity-90", children: [
                "Updating product in: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedStore.name })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20", children: [
            /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-3 w-3 mr-1" }),
            "Edit Mode"
          ] })
        ] }),
        stores.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-white/20", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "update_product_store",
              className: "block text-xs font-semibold uppercase tracking-wide opacity-90 mb-2",
              children: "Move to store"
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              id: "update_product_store",
              name: "store_id",
              value: data.store_id,
              onChange: (e) => setData("store_id", e.target.value),
              className: "w-full md:w-1/2 rounded-xl border border-line bg-paper-dim px-4 py-2.5 text-ink focus:ring-2 focus:ring-marigold focus:outline-none",
              children: stores.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
            }
          ),
          errors.store_id && /* @__PURE__ */ jsxs("p", { className: "text-xs mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
            errors.store_id
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx(FaBox, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Product Information" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FaTag, { className: "h-4 w-4 text-marigold" }),
                    "Product Name ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(FaTag, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.name,
                        onChange: handleNameChange,
                        placeholder: "Your Product Name",
                        className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                      }
                    )
                  ] }),
                  errors.name && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FaLink, { className: "h-4 w-4 text-marigold" }),
                    "Product Slug"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(FaFileAlt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: data.slug,
                          onChange: (e) => {
                            setSlugManuallyEdited(true);
                            setData("slug", e.target.value);
                          },
                          placeholder: "premium-wireless-headphones",
                          className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const slug = generateSlug(data.name);
                          setData("slug", slug);
                          setSlugManuallyEdited(false);
                          toast.success("Slug regenerated!");
                        },
                        disabled: !data.name,
                        className: "px-4 py-3 border border-line rounded-xl hover:bg-paper-dim transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-text-soft hover:text-ink",
                        children: [
                          /* @__PURE__ */ jsx(FaArrowRight, { className: "h-4 w-4" }),
                          "Regenerate"
                        ]
                      }
                    )
                  ] }),
                  slugManuallyEdited ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-3 w-3" }),
                    "Manually edited — won't auto-sync with name"
                  ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Slug is automatically generated from the product name" }),
                  errors.slug && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.slug
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                    "Main Category ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowCategoryDropdown(!showCategoryDropdown),
                        className: "w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: data.category ? "text-ink" : "text-text-soft", children: data.category || "Select main category" }),
                          /* @__PURE__ */ jsx(
                            FaChevronDown,
                            {
                              className: `h-5 w-5 text-text-soft transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`
                            }
                          )
                        ]
                      }
                    ),
                    showCategoryDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto", children: categories.map((cat) => /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setData("category", cat.categories);
                          setShowCategoryDropdown(false);
                        },
                        className: `w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${data.category === cat.categories ? "bg-marigold/10 text-marigold" : "text-ink"}`,
                        children: [
                          cat.categories,
                          data.category === cat.categories && /* @__PURE__ */ jsx(HiCheck, { className: "h-5 w-5 text-marigold" })
                        ]
                      },
                      cat.id
                    )) })
                  ] }),
                  errors.category && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.category
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-2", children: "Sub Category" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => data.category && availableSubcategories.length > 0 && setShowSubcategoryDropdown(!showSubcategoryDropdown),
                        disabled: !data.category || availableSubcategories.length === 0,
                        className: `w-full rounded-xl border px-4 py-3 text-left flex justify-between items-center transition-colors ${!data.category || availableSubcategories.length === 0 ? "border-line bg-paper-dim text-text-soft cursor-not-allowed" : "border-line hover:border-marigold bg-white"}`,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: data.subcategory ? "text-ink" : "text-text-soft", children: data.subcategory || (data.category ? availableSubcategories.length > 0 ? "Select subcategory" : "No subcategories available" : "Select main category first") }),
                          data.category && availableSubcategories.length > 0 && /* @__PURE__ */ jsx(
                            FaChevronDown,
                            {
                              className: `h-5 w-5 text-text-soft transition-transform ${showSubcategoryDropdown ? "rotate-180" : ""}`
                            }
                          )
                        ]
                      }
                    ),
                    data.category && showSubcategoryDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto", children: availableSubcategories.length > 0 ? availableSubcategories.map((subcat, index) => /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setData("subcategory", subcat);
                          setShowSubcategoryDropdown(false);
                        },
                        className: `w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${data.subcategory === subcat ? "bg-marigold/10 text-marigold" : "text-ink"}`,
                        children: [
                          subcat,
                          data.subcategory === subcat && /* @__PURE__ */ jsx(HiCheck, { className: "h-5 w-5 text-marigold" })
                        ]
                      },
                      index
                    )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-text-soft text-center", children: "No subcategory available for this category" }) })
                  ] }),
                  errors.subcategory && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.subcategory
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-2", children: "Brand" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => data.category && availableBrands.length > 0 && setShowBrandDropdown(!showBrandDropdown),
                        disabled: !data.category || availableBrands.length === 0,
                        className: `w-full rounded-xl border px-4 py-3 text-left flex justify-between items-center transition-colors ${!data.category || availableBrands.length === 0 ? "border-line bg-paper-dim text-text-soft cursor-not-allowed" : "border-line hover:border-marigold bg-white"}`,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: data.brand ? "text-ink" : "text-text-soft", children: data.brand || (data.category ? availableBrands.length > 0 ? "Select brand" : "No brands available" : "Select main category first") }),
                          data.category && availableBrands.length > 0 && /* @__PURE__ */ jsx(
                            FaChevronDown,
                            {
                              className: `h-5 w-5 text-text-soft transition-transform ${showBrandDropdown ? "rotate-180" : ""}`
                            }
                          )
                        ]
                      }
                    ),
                    data.category && showBrandDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto", children: availableBrands.length > 0 ? availableBrands.map((brand, index) => /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setData("brand", brand);
                          setShowBrandDropdown(false);
                        },
                        className: `w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${data.brand === brand ? "bg-marigold/10 text-marigold" : "text-ink"}`,
                        children: [
                          brand,
                          data.brand === brand && /* @__PURE__ */ jsx(HiCheck, { className: "h-5 w-5 text-marigold" })
                        ]
                      },
                      index
                    )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-text-soft text-center", children: "No brands available for this category" }) })
                  ] }),
                  errors.brand && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.brand
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                  "Product Type ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowProductTypeDropdown(!showProductTypeDropdown),
                      className: "w-full rounded-xl border border-line px-4 py-3 text-left flex justify-between items-center hover:border-marigold transition-colors bg-white",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          data.product_type && (() => {
                            const selected = productTypes.find((p) => p.value === data.product_type);
                            const Icon = selected?.icon || FaTag;
                            return /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${selected?.color || "text-gray-500"}` });
                          })(),
                          /* @__PURE__ */ jsx("span", { className: data.product_type ? "text-ink" : "text-text-soft", children: data.product_type ? productTypes.find((p) => p.value === data.product_type)?.label : "Select product type" })
                        ] }),
                        /* @__PURE__ */ jsx(
                          FaChevronDown,
                          {
                            className: `h-5 w-5 text-text-soft transition-transform ${showProductTypeDropdown ? "rotate-180" : ""}`
                          }
                        )
                      ]
                    }
                  ),
                  showProductTypeDropdown && /* @__PURE__ */ jsx("div", { className: "absolute z-10 mt-1 w-full bg-white rounded-xl shadow-hard-sm border border-line max-h-60 overflow-auto", children: productTypes.map((type) => {
                    const Icon = type.icon;
                    return /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setData("product_type", type.value);
                          setShowProductTypeDropdown(false);
                        },
                        className: `w-full text-left px-4 py-3 hover:bg-paper-dim transition-colors flex items-center justify-between ${data.product_type === type.value ? "bg-marigold/10 text-marigold" : "text-ink"}`,
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${type.color}` }),
                            /* @__PURE__ */ jsx("span", { children: type.label })
                          ] }),
                          data.product_type === type.value && /* @__PURE__ */ jsx(HiCheck, { className: "h-5 w-5 text-marigold" })
                        ]
                      },
                      type.value
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Select how this product should be displayed (Featured, Trending, Top Selling, New Arrival, or Regular)" }),
                errors.product_type && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                  errors.product_type
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FaHashtag, { className: "h-4 w-4 text-marigold" }),
                    "Quantity ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(FaHashtag, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: data.quantity,
                        onChange: (e) => handleNumberInput(e, "quantity"),
                        className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink"
                      }
                    )
                  ] }),
                  errors.quantity && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.quantity
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                    "Colors ",
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-text-soft", children: "(Add multiple)" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: colorInputs.map((color, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(FaPalette, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: color,
                          onChange: (e) => updateColorInput(index, e.target.value),
                          placeholder: "Enter color name...",
                          className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                        }
                      )
                    ] }),
                    index === colorInputs.length - 1 ? /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: addColorInput,
                        className: "px-4 py-3 bg-marigold text-white font-medium rounded-xl hover:bg-marigold-dark transition-colors flex items-center gap-2 hover:shadow-lg",
                        children: [
                          /* @__PURE__ */ jsx(FaPlus, { className: "h-4 w-4" }),
                          "Add"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeColorInput(index),
                        className: "px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4" }),
                          "Remove"
                        ]
                      }
                    )
                  ] }, index)) }),
                  getValidColors().length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-ink", children: [
                        "Added Colors (",
                        getValidColors().length,
                        ")"
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setColorInputs([""]),
                          className: "text-sm text-red-600 hover:text-red-700 flex items-center gap-1",
                          children: [
                            /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" }),
                            "Clear All"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: getValidColors().map((color, index) => /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "inline-flex items-center px-3 py-1.5 bg-paper-dim border border-line rounded-xl",
                        children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: color })
                      },
                      index
                    )) })
                  ] }),
                  errors.color && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.color
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink mb-2 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-4 w-4 text-marigold" }),
                  "Item Weight (kg) ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(FaWeightHanging, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.1",
                      min: "0.1",
                      value: data.item_weight,
                      onChange: (e) => handleNumberInput(e, "item_weight"),
                      placeholder: "0.5",
                      className: "w-full rounded-xl border border-line px-10 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    }
                  )
                ] }),
                errors.item_weight && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                  errors.item_weight
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "Used for shipping cost calculation (minimum 0.1 kg)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-md border border-line bg-paper-dim px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-marigold", children: "BDT" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Pricing" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
                  "Regular Price ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-soft", children: "BDT" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.01",
                      min: "0",
                      max: "1000000",
                      value: data.regular_price,
                      onChange: (e) => handleNumberInput(e, "regular_price"),
                      placeholder: "99.99",
                      className: "w-full rounded-xl border border-line py-3 pl-14 pr-4 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                    }
                  )
                ] }),
                errors.regular_price && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                  errors.regular_price
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-ink flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FaPercent, { className: "h-4 w-4 text-marigold" }),
                    "Sale Price"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        id: "enable_sale",
                        checked: showSalePrice,
                        onChange: (e) => {
                          setShowSalePrice(e.target.checked);
                          if (!e.target.checked) setData("sale_price", "");
                        },
                        className: "h-4 w-4 rounded border-line text-marigold focus:ring-marigold"
                      }
                    ),
                    /* @__PURE__ */ jsx("label", { htmlFor: "enable_sale", className: "text-sm text-text-soft", children: "Enable" })
                  ] })
                ] }),
                showSalePrice && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-soft", children: "BDT" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.01",
                        min: "0",
                        max: "1000000",
                        value: data.sale_price,
                        onChange: (e) => handleNumberInput(e, "sale_price"),
                        placeholder: "79.99",
                        className: "w-full rounded-xl border border-line py-3 pl-14 pr-4 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                      }
                    )
                  ] }),
                  data.regular_price && data.sale_price && discountPercentage > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800", children: [
                      /* @__PURE__ */ jsx(FaPercent, { className: "h-3 w-3 mr-1" }),
                      "Save ",
                      discountPercentage,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft", children: [
                      "Save BDT ",
                      (parseFloat(data.regular_price) - parseFloat(data.sale_price)).toFixed(2)
                    ] })
                  ] }),
                  errors.sale_price && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                    errors.sale_price
                  ] })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx(FaBookOpen, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Product Description" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                ReactQuill,
                {
                  theme: "snow",
                  value: data.description,
                  onChange: (value) => setData("description", value),
                  modules: quillModules,
                  formats: quillFormats,
                  placeholder: "Describe your product features, specifications, and benefits...",
                  className: "h-64 mb-12"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: data.description.replace(/<[^>]*>/g, "").length }),
                  " characters (plain text)"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "Use the toolbar to format your text with rich styling" })
              ] })
            ] }),
            errors.description && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
              errors.description
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx(FaImage, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Product Images" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: imagesInputRef,
                  type: "file",
                  accept: "image/*",
                  multiple: true,
                  onChange: handleImageUpload,
                  className: "hidden"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-ink mb-3", children: "Existing Images" }),
                existingImages.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: existingImages.map((img, i) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${img}`,
                      alt: `Product ${i + 1}`,
                      className: "w-full h-32 object-cover rounded-xl group-hover:opacity-75 transition-opacity border border-line",
                      onError: (e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeExistingImage(i, img),
                      className: "absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                      title: "Remove image",
                      children: /* @__PURE__ */ jsx(FaTrash, { className: "h-3 w-3" })
                    }
                  ),
                  imagesToRemove.includes(img) && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-red-500 bg-opacity-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-semibold", children: "Removed" }) })
                ] }, i)) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "No existing images" })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => imagesInputRef.current?.click(),
                  className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${data.images.length === 0 ? "border-line hover:border-marigold hover:bg-marigold/5" : "border-line"}`,
                  children: data.images.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "mx-auto w-20 h-20 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUpload, { className: "h-10 w-10 text-marigold" }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: "Click to add more images" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft mt-1", children: "PNG, JPG up to 5MB each" })
                    ] })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-ink", children: "New Images to Add" }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: imagePreviews.slice(existingImages.length).map((preview, i) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: preview,
                          alt: `New image ${i + 1}`,
                          className: "w-full h-32 object-cover rounded-xl group-hover:opacity-75 transition-opacity border border-line"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            removeNewImage(i + existingImages.length);
                          },
                          className: "absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                          title: "Remove new image",
                          children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3" })
                        }
                      )
                    ] }, i + existingImages.length)) }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "Click to add more images" })
                  ] })
                }
              ),
              imagesToRemove.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-yellow-800", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "inline h-4 w-4 mr-1" }),
                imagesToRemove.length,
                " image(s) will be removed on update"
              ] }) }),
              data.images.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-soft mt-3 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaImage, { className: "h-3 w-3 text-marigold" }),
                data.images.length,
                " new image(s) to add"
              ] }),
              errors.images && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
                errors.images
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Stock Status" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "inStock",
                  checked: data.inStock,
                  onChange: (e) => setData("inStock", e.target.checked),
                  className: "h-5 w-5 rounded border-line text-marigold focus:ring-marigold"
                }
              ),
              /* @__PURE__ */ jsxs("label", { htmlFor: "inStock", className: "text-sm font-medium text-ink flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaBox, { className: "h-4 w-4 text-marigold" }),
                "In Stock"
              ] })
            ] }),
            errors.inStock && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 mt-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-4 w-4" }),
              errors.inStock
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 pb-4 border-b border-line", children: [
              /* @__PURE__ */ jsx(FaEye, { className: "h-5 w-5 text-marigold" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Product Preview" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "border border-line rounded-xl overflow-hidden group hover:shadow-hard-sm transition-shadow", children: [
                imagePreviews[0] ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imagePreviews[0],
                      alt: "Product preview",
                      className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    }
                  ),
                  discountPercentage > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg", children: [
                    "-",
                    discountPercentage,
                    "%"
                  ] })
                ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-48 bg-paper-dim flex items-center justify-center group-hover:bg-paper-dim/80 transition-colors", children: /* @__PURE__ */ jsx(FaBox, { className: "h-16 w-16 text-text-soft" }) }),
                /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-ink truncate", children: data.name || "Product Name" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                      data.category && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-marigold/10 text-marigold", children: data.category }),
                      data.subcategory && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800", children: data.subcategory }),
                      data.brand && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800", children: data.brand })
                    ] }),
                    getValidColors().length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                      getValidColors().slice(0, 3).map((color, index) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-paper-dim text-ink border border-line",
                          children: color
                        },
                        index
                      )),
                      getValidColors().length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                        "+",
                        getValidColors().length - 3,
                        " more"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-2", children: data.sale_price ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-marigold", children: [
                      "BDT ",
                      parseFloat(data.sale_price).toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft line-through", children: [
                      "BDT ",
                      parseFloat(data.regular_price).toFixed(2)
                    ] })
                  ] }) : data.regular_price ? /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-ink", children: [
                    "BDT ",
                    parseFloat(data.regular_price).toFixed(2)
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-text-soft", children: "BDT 0.00" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
                    /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: data.inStock ? "In Stock" : "Out of Stock" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                      "Qty: ",
                      data.quantity || 0
                    ] })
                  ] }),
                  data.slug && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-text-soft truncate flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FaLink, { className: "h-3 w-3" }),
                    data.slug
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-text-soft flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FaStore, { className: "h-3 w-3 text-marigold" }),
                    "Store"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: selectedStore.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-text-soft flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(FaBox, { className: "h-3 w-3 text-marigold" }),
                    "Categories"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-ink", children: data.category || "None" }),
                    data.subcategory && /* @__PURE__ */ jsx("div", { className: "text-xs text-text-soft", children: data.subcategory }),
                    data.brand && /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft", children: [
                      "Brand: ",
                      data.brand
                    ] })
                  ] })
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing || !data.name || !data.category || !data.regular_price || !data.description || !data.item_weight,
                className: "w-full bg-gray-900 hover:bg-marigold text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2",
                children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" }),
                  "Updating Product..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(FaEdit, { className: "h-4 w-4" }),
                  "Update Product"
                ] })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft space-y-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Product will be updated in: ",
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: selectedStore.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { children: "All required fields marked with * must be filled" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsx("span", { children: "Item weight is required for shipping calculation" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaPercent, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsx("span", { children: "Sale price is optional but recommended for promotions" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaImage, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsx("span", { children: "High-quality images increase conversion by up to 30%" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaBookOpen, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsx("span", { children: "Rich text editor allows formatted product descriptions" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaLink, { className: "h-3 w-3 text-marigold" }),
                /* @__PURE__ */ jsx("span", { children: "Slug auto-generates from name — edit it manually to lock" })
              ] })
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  EditProductForm as default
};
