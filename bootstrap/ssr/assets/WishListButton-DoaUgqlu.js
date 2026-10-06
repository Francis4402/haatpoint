import { jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
function WishlistButton({
  productId,
  className = "",
  iconSize = 4,
  initialWishlistState = false
}) {
  const [isInWishlist, setIsInWishlist] = useState(initialWishlistState);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (!initialWishlistState) {
      checkWishlistStatus();
    }
  }, [productId]);
  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/wishlist/check/${productId}`);
      const data = await response.json();
      setIsInWishlist(data.isInWishlist);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing) return;
    setIsProcessing(true);
    router.post(`/wishlist/toggle/${productId}`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsInWishlist((was) => !was);
        toast.success(
          isInWishlist ? "Removed from wishlist" : "Added to wishlist!",
          { position: "top-right" }
        );
        setIsProcessing(false);
      },
      onError: (errors) => {
        const first = Object.values(errors ?? {})[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(message || "Failed to update wishlist", {
          position: "top-center"
        });
        setIsProcessing(false);
      }
    });
  };
  const iconSizeClass = `w-${iconSize} h-${iconSize}`;
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleWishlist,
      disabled: isProcessing,
      className: `p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-110"} ${className}`,
      "aria-label": isInWishlist ? "Remove from wishlist" : "Add to wishlist",
      children: isProcessing ? /* @__PURE__ */ jsx("div", { className: `${iconSizeClass} border-2 border-gray-300 border-t-primary rounded-full animate-spin` }) : isInWishlist ? /* @__PURE__ */ jsx(FaHeart, { className: `${iconSizeClass} text-red-500` }) : /* @__PURE__ */ jsx(FaRegHeart, { className: `${iconSizeClass} text-gray-600 hover:text-red-500 transition-colors` })
    }
  );
}
export {
  WishlistButton as default
};
