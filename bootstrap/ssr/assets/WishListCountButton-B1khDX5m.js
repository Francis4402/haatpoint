import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { FiHeart } from "react-icons/fi";
import { useState, useEffect } from "react";
const WishlistCountButton = ({ wishlist, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const wishlistCount = wishlist?.total || 0;
  useEffect(() => {
    if (wishlistCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1e3);
      return () => clearTimeout(timer);
    }
  }, [wishlistCount]);
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: "/wishlist",
      className: `relative p-2 rounded-md transition-all duration-200 group ${className}`,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(FiHeart, { className: `h-5 w-5 transition-all duration-300 ${isHovered ? "scale-110 text-red-500" : wishlistCount > 0 ? "text-red-500 fill-red-500" : ""}` }),
          wishlistCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: `absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg transform transition-all duration-300 ${isAnimating ? "animate-bounce scale-110" : ""}`, children: wishlistCount > 99 ? "99+" : wishlistCount }),
            /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20" })
          ] }),
          wishlistCount === 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300" })
        ] }),
        isHovered && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50", children: wishlistCount === 0 ? "Wishlist is empty" : `${wishlistCount} item${wishlistCount > 1 ? "s" : ""} in wishlist` })
      ]
    }
  );
};
export {
  WishlistCountButton as default
};
