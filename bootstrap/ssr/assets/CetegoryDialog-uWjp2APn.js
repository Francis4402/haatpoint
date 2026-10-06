import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaMinus, FaUpload } from "react-icons/fa";
import { toast } from "sonner";
const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  initialData,
  isProcessing,
  errors
}) => {
  const [formData, setFormData] = useState({
    categories: "",
    brand: [""],
    subcategory: [""],
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState(null);
  useEffect(() => {
    if (initialData && isEditing) {
      let parsedSubcategories = [];
      if (initialData.subcategory) {
        try {
          const parsed = JSON.parse(initialData.subcategory);
          if (Array.isArray(parsed)) {
            parsedSubcategories = parsed;
          }
        } catch (e) {
          parsedSubcategories = [];
        }
      }
      let brands = [];
      if (typeof initialData.brand === "string") {
        try {
          const parsed = JSON.parse(initialData.brand);
          if (Array.isArray(parsed)) {
            brands = parsed;
          } else {
            brands = [initialData.brand];
          }
        } catch {
          brands = [initialData.brand];
        }
      } else if (Array.isArray(initialData.brand)) {
        brands = initialData.brand;
      } else {
        brands = [""];
      }
      setFormData({
        categories: initialData.categories,
        brand: brands.length > 0 ? brands : [""],
        subcategory: parsedSubcategories.length > 0 ? parsedSubcategories : [""],
        image: null
      });
      if (initialData.image) {
        setCurrentImagePath(`/storage/${initialData.image}`);
      } else {
        setCurrentImagePath(null);
      }
    } else {
      setFormData({
        categories: "",
        brand: [""],
        subcategory: [""],
        image: null
      });
      setCurrentImagePath(null);
    }
    setImagePreview(null);
  }, [initialData, isEditing, isOpen]);
  if (!isOpen) return null;
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const addBrandField = () => {
    updateField("brand", [...formData.brand, ""]);
  };
  const removeBrandField = (index) => {
    const newBrands = [...formData.brand];
    newBrands.splice(index, 1);
    updateField("brand", newBrands.length > 0 ? newBrands : [""]);
  };
  const updateBrand = (index, value) => {
    const newBrands = [...formData.brand];
    newBrands[index] = value;
    updateField("brand", newBrands);
  };
  const addSubcategoryField = () => {
    updateField("subcategory", [...formData.subcategory, ""]);
  };
  const removeSubcategoryField = (index) => {
    const newSubcategories = [...formData.subcategory];
    newSubcategories.splice(index, 1);
    updateField("subcategory", newSubcategories.length > 0 ? newSubcategories : [""]);
  };
  const updateSubcategory = (index, value) => {
    const newSubcategories = [...formData.subcategory];
    newSubcategories[index] = value;
    updateField("subcategory", newSubcategories);
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateField("image", file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    updateField("image", null);
    setImagePreview(null);
    setCurrentImagePath(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredBrands = formData.brand.filter((brand) => brand.trim() !== "");
    if (filteredBrands.length === 0) {
      toast.error("At least one brand is required");
      return;
    }
    if (!formData.categories.trim()) {
      toast.error("Category name is required");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("categories", formData.categories.trim());
    formDataToSend.append("brand", JSON.stringify(filteredBrands));
    const filteredSubcategory = formData.subcategory.filter((subcat) => subcat.trim() !== "");
    formDataToSend.append("subcategory", JSON.stringify(filteredSubcategory));
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    onSave(formDataToSend);
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line w-full max-w-lg overflow-y-auto max-h-[90vh]", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: isEditing ? "Edit Category" : "Add New Category" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors",
          children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-2", children: "Category Name *" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: formData.categories,
          onChange: (e) => updateField("categories", e.target.value),
          placeholder: "Enter category name",
          className: `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${errors.categories ? "border-red-500" : "border-line"}`,
          autoFocus: true,
          required: true
        }
      ),
      errors.categories && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.categories })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink", children: "Brands *" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: addBrandField,
            className: "inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-3 w-3 mr-1" }),
              "Add Brand"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: formData.brand.map((brand, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: brand,
            onChange: (e) => updateBrand(index, e.target.value),
            placeholder: `Brand ${index + 1}`,
            className: `w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${errors.brand ? "border-red-500" : "border-line"}`
          }
        ) }),
        formData.brand.length > 1 && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => removeBrandField(index),
            className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
            title: "Remove brand",
            children: /* @__PURE__ */ jsx(FaMinus, { className: "h-4 w-4" })
          }
        )
      ] }, index)) }),
      errors.brand && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.brand }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-text-soft", children: "Add one or more brands for this category" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink", children: "Subcategories (Optional)" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: addSubcategoryField,
            className: "inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium",
            children: [
              /* @__PURE__ */ jsx(FaPlus, { className: "h-3 w-3 mr-1" }),
              "Add Subcategory"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: formData.subcategory.map((subcategory, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: subcategory,
            onChange: (e) => updateSubcategory(index, e.target.value),
            placeholder: `Subcategory ${index + 1}`,
            className: `w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${errors.subcategory ? "border-red-500" : "border-line"}`
          }
        ) }),
        formData.subcategory.length > 1 && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => removeSubcategoryField(index),
            className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
            title: "Remove subcategory",
            children: /* @__PURE__ */ jsx(FaMinus, { className: "h-4 w-4" })
          }
        )
      ] }, index)) }),
      errors.subcategory && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.subcategory }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-text-soft", children: "Add subcategories for better product organization (optional)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-2", children: "Category Image *" }),
      imagePreview ? /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-48 rounded-xl overflow-hidden border border-line", children: /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Preview", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: removeImage,
            className: "absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors",
            children: /* @__PURE__ */ jsx(FaTimes, { className: "h-4 w-4" })
          }
        )
      ] }) : currentImagePath ? /* @__PURE__ */ jsxs("div", { className: "mb-4 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-48 rounded-xl overflow-hidden border border-line", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: currentImagePath,
            alt: "Current",
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.src = "https://via.placeholder.com/400x200";
            }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center items-center gap-2 mt-3", children: [
          /* @__PURE__ */ jsxs("label", { className: "cursor-pointer", children: [
            /* @__PURE__ */ jsx("span", { className: "px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 text-sm", children: "Change Image" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "hidden" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: removeImage,
              className: "px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm",
              children: "Remove Image"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-line rounded-xl p-6 text-center hover:border-marigold transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(FaUpload, { className: "h-6 w-6 text-text-soft" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-2", children: "Click to upload image" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "PNG, JPG, WEBP up to 2MB" }),
        /* @__PURE__ */ jsxs("label", { className: "cursor-pointer mt-5", children: [
          /* @__PURE__ */ jsx("span", { className: "px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300", children: "Choose File" }),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "hidden", required: !isEditing })
        ] })
      ] }) }),
      errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.image }),
      !isEditing && !imagePreview && !currentImagePath && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-soft", children: "Image is required for new categories" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t border-line", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "px-6 py-2 text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim transition-colors",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isProcessing,
          className: `px-6 py-2 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`,
          children: isProcessing ? isEditing ? "Updating..." : "Saving..." : isEditing ? "Update Category" : "Add Category"
        }
      )
    ] })
  ] }) }) }) });
};
export {
  CategoryModal as default
};
