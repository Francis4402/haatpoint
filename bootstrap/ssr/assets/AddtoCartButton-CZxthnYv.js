import { jsx, jsxs } from "react/jsx-runtime";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";
import { u as useStore } from "./cartStore-BOd_ZlZA.js";
import { u as useTranslation } from "./languageStore-DF0bQFKG.js";
import "@inertiajs/react";
import "zustand";
import "zustand/middleware";
const AddtoCartButton = ({
  product,
  className = "",
  variant = "full",
  size = "md"
}) => {
  const addtoCart = useStore((state) => state.addToCart);
  const { t } = useTranslation();
  const handleAddToCart = (e) => {
    e.stopPropagation();
    const resolvedStore = product.store;
    if (!resolvedStore || !resolvedStore.id) {
      toast.error(t("store_info_unavailable", "Store information unavailable"));
      return;
    }
    addtoCart(product, resolvedStore);
  };
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2",
    lg: "px-5 py-2.5 text-sm gap-2.5"
  };
  const variantClasses = {
    default: `w-full flex items-center justify-center rounded-lg font-medium transition-all duration-300 flex-shrink-0 ${product.inStock && product.quantity > 0 ? "bg-gray-900 hover:bg-marigold text-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-marigold" : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"}`,
    icon: `flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 ${product.inStock && product.quantity > 0 ? "bg-white/90 hover:bg-white text-gray-600 hover:text-marigold shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200" : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"}`,
    full: `w-full flex items-center justify-center rounded-lg font-medium transition-all duration-300 flex-shrink-0 ${product.inStock && product.quantity > 0 ? "bg-marigold hover:bg-marigold-dark text-white hover:shadow-lg hover:scale-105 border border-transparent" : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"}`
  };
  const iconSizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-9 h-9"
  };
  const buttonText = product.inStock && product.quantity > 0 ? t("add_to_cart", "Add to Cart") : t("out_of_stock", "Out of Stock");
  if (variant === "icon") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleAddToCart,
        className: `${variantClasses.icon} ${iconSizeClasses[size]} ${className}`,
        disabled: !product.inStock || product.quantity <= 0,
        "aria-label": t("add_to_cart", "Add to cart"),
        title: buttonText,
        children: /* @__PURE__ */ jsx(FaShoppingCart, { className: `${size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"}` })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: handleAddToCart,
      className: `${variantClasses[variant === "full" ? "full" : "default"]} ${sizeClasses[size]} ${className}`,
      disabled: !product.inStock || product.quantity <= 0,
      children: [
        /* @__PURE__ */ jsx(FaShoppingCart, { className: `${size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"}` }),
        buttonText
      ]
    }
  );
};
export {
  AddtoCartButton as default
};
