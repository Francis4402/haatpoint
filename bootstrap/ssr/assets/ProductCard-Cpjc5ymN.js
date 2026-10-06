import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { FaEye, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import axios from "axios";
import AddtoCartButton from "./AddtoCartButton-CZxthnYv.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import WishlistButton from "./WishListButton-DoaUgqlu.js";
const CATEGORY_LABEL = {
  Electronics: "Devices",
  Fashion: "Apparel",
  "Home & Living": "Home",
  Beauty: "Beauty",
  Food: "Grocery",
  Books: "Books",
  Sports: "Sports",
  Toys: "Toys",
  Gaming: "Gaming",
  Automotive: "Auto"
};
const CATEGORY_GRADIENT = {
  Electronics: ["#F2F2EE", "#E3E1DB"],
  Fashion: ["#F7F5F1", "#E9E6DF"],
  "Home & Living": ["#F5F3EF", "#E6E2DA"],
  Beauty: ["#F3F2EE", "#E4E1D9"],
  Food: ["#F6F4F0", "#E8E4DC"],
  Books: ["#F1F1ED", "#E2DFD8"],
  Sports: ["#F4F3EF", "#E5E2DA"],
  Toys: ["#F5F3EF", "#E7E3DB"],
  Gaming: ["#F2F1ED", "#E3E0D9"],
  Automotive: ["#F3F4F6", "#E2E4E8"]
};
const DEFAULT_GRADIENT = ["#FBFBF9", "#F2F2EE"];
function getImageSrc(images) {
  if (!images) return "";
  try {
    const cleanString = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(cleanString);
    const imagePath = Array.isArray(parsed) ? parsed[0] : null;
    if (!imagePath) return "";
    return imagePath.startsWith("http") || imagePath.startsWith("/") ? imagePath : `/storage/${imagePath}`;
  } catch {
    const trimmed = images.trim();
    return trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : "";
  }
}
function calculateDiscount(regularPrice, salePrice) {
  if (regularPrice <= 0 || salePrice >= regularPrice) return 0;
  return Math.round((regularPrice - salePrice) / regularPrice * 100);
}
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
    [...Array(fullStars)].map((_, i) => /* @__PURE__ */ jsx(FaStar, { className: "w-3 h-3 text-amber-400 fill-current" }, `full-${i}`)),
    hasHalfStar && /* @__PURE__ */ jsx(FaStarHalfAlt, { className: "w-3 h-3 text-amber-400 fill-current" }),
    [...Array(emptyStars)].map((_, i) => /* @__PURE__ */ jsx(FaRegStar, { className: "w-3 h-3 text-gray-300" }, `empty-${i}`))
  ] });
};
const LazyProductImage = ({
  src,
  alt,
  className,
  onError
}) => /* @__PURE__ */ jsx(
  LazyLoadImage,
  {
    src,
    alt,
    effect: "blur",
    wrapperClassName: "w-full h-full",
    className: `w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${className || ""}`,
    placeholderSrc: "/otherplaceholder.jpg",
    threshold: 100,
    visibleByDefault: false,
    onError,
    loading: "lazy"
  }
);
const ProductCard = ({
  product,
  badge,
  variant = "default",
  showQuickView = true,
  user,
  initialAverageRating = 0
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [loading, setLoading] = useState(true);
  const imageSrc = getImageSrc(product.images);
  const categoryLabel = "emoji" in product && product.emoji ? product.emoji : CATEGORY_LABEL[product.category ?? ""] ?? (product.category || "Product");
  const [gradientFrom, gradientTo] = CATEGORY_GRADIENT[product.category ?? ""] ?? DEFAULT_GRADIENT;
  const vendor = ("vendor" in product ? product.vendor : null) ?? product.category ?? "General";
  const discount = calculateDiscount(product.regular_price, product.sale_price);
  const hasDiscount = discount > 0;
  const hasSalePrice = product.sale_price !== void 0 && product.sale_price !== null && product.sale_price > 0;
  const displayPrice = hasSalePrice ? product.sale_price : product.regular_price;
  const showImage = imageSrc && !imageFailed;
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios.get(`/products/${product.id}/comments`).then((res) => {
      if (!cancelled) {
        const stats = res.data.stats || {};
        setAverageRating(stats.average || 0);
        setLoading(false);
      }
    }).catch((err) => {
      console.error("Failed to fetch review data:", err);
      setLoading(false);
      setAverageRating(initialAverageRating);
    });
    return () => {
      cancelled = true;
    };
  }, [product.id, initialAverageRating]);
  const hasRating = averageRating > 0;
  const handleImageError = () => {
    setImageFailed(true);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group bg-white border border-[#E3E1DB] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-hard-sm",
      role: "article",
      "aria-label": `Product: ${product.name}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/3] overflow-hidden bg-gray-100", children: [
          showImage ? /* @__PURE__ */ jsx(
            LazyProductImage,
            {
              src: imageSrc,
              alt: `${product.name} - Product image`,
              onError: handleImageError
            }
          ) : /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-full h-full flex items-center justify-center px-3 text-center transition-transform duration-500 group-hover:scale-105",
              style: { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` },
              children: /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold uppercase tracking-wider text-[#1B1B1B]/70", children: categoryLabel })
            }
          ),
          badge && /* @__PURE__ */ jsx(
            "span",
            {
              className: "absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#1B1B1B] text-white font-mono text-[10px] uppercase shadow-lg z-10",
              "aria-label": `${badge} badge`,
              children: badge
            }
          ),
          !badge && product.brand && /* @__PURE__ */ jsx(
            "span",
            {
              className: "absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#6E7F5C] text-white font-mono text-[10px] font-bold uppercase shadow-lg z-10",
              "aria-label": `Brand: ${product.brand}`,
              children: product.brand
            }
          ),
          variant === "trending" && !badge && !product.brand && /* @__PURE__ */ jsxs(
            "span",
            {
              className: "absolute top-2.5 left-2.5 rounded-sm px-2.5 py-1 bg-[#E7F4EF] text-[#4F6B63] font-mono text-[10px] font-bold uppercase shadow-lg z-10 flex items-center gap-1",
              "aria-label": "Trending product",
              children: [
                /* @__PURE__ */ jsx(FiZap, { className: "w-3 h-3", "aria-hidden": "true" }),
                "Trending"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute top-2.5 right-2.5 flex flex-col items-start gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20",
              role: "toolbar",
              "aria-label": "Product actions",
              children: [
                user && /* @__PURE__ */ jsx(WishlistButton, { productId: product.id }),
                showQuickView && /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `/products/${product.slug}`,
                    className: "p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors",
                    "aria-label": `Quick view ${product.name}`,
                    children: /* @__PURE__ */ jsx(FaEye, { className: "w-4 h-4 text-gray-600 hover:text-[#6E7F5C]", "aria-hidden": "true" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20", children: /* @__PURE__ */ jsx(AddtoCartButton, { product }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-mono text-[10.5px] text-[#767470] uppercase tracking-wide mb-1.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { children: vendor }),
              product.brand && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[#E3E1DB]", "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("span", { className: "text-[#6E7F5C] font-semibold", children: product.brand })
              ] })
            ] }),
            variant === "trending" && !badge && !product.brand && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-[#E7F4EF] text-[#4F6B63] font-mono text-[9px] font-bold", children: [
              /* @__PURE__ */ jsx(FiZap, { className: "w-3 h-3", "aria-hidden": "true" }),
              "Trending"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[14.5px] leading-snug mb-2 line-clamp-2 min-h-[44px] group-hover:text-[#6E7F5C] transition-colors", children: product.name }),
          hasRating && !loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            renderStars(averageRating),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-[#767470]", children: averageRating.toFixed(1) })
          ] }) : loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-3 bg-gray-200 rounded animate-pulse" }) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-[#767470]", children: "No reviews yet" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-display font-extrabold text-xl", "aria-label": `Price: ${displayPrice}`, children: /* @__PURE__ */ jsx(FormatPrice, { price: displayPrice }) }),
              hasSalePrice && /* @__PURE__ */ jsx("span", { className: "text-sm text-[#767470] line-through", "aria-label": `Original price: ${product.regular_price}`, children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
            ] }),
            !showQuickView && /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsx(AddtoCartButton, { product }) })
          ] }),
          hasDiscount && /* @__PURE__ */ jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600", children: [
            "Save ",
            /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price - product.sale_price })
          ] }) })
        ] })
      ]
    }
  );
};
export {
  ProductCard as P
};
