import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaHome, FaTag, FaLeaf, FaCheck, FaStore, FaMinus, FaPlus, FaShoppingCart, FaShoppingBag, FaShare, FaLink, FaTruck, FaUndo, FaShieldAlt, FaHeadset, FaStar, FaRegStar, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { Link, router } from "@inertiajs/react";
import { toast } from "sonner";
import { u as useStore } from "./cartStore-BOd_ZlZA.js";
import CommentsList from "./CommentsList-COwtgO0j.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import axios from "axios";
import WishlistButton from "./WishListButton-DoaUgqlu.js";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "@headlessui/react";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "./WhatsAppChatButton-CDSWQr0H.js";
import "./CommentForm-BbICZ3rG.js";
const getNumericRating = (rating) => {
  if (rating === null || rating === void 0) return 0;
  if (typeof rating === "number") return isNaN(rating) ? 0 : rating;
  if (typeof rating === "string") {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
const ProductDetailsPage = ({
  product,
  store,
  auth,
  wishlist,
  comments: initialComments = [],
  averageRating: initialAverageRating = 0,
  reviewCount: initialReviewCount = 0,
  userReview = null
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [averageRating, setAverageRating] = useState(getNumericRating(initialAverageRating));
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { addToCart, getItemById } = useStore();
  const cartItem = getItemById(product.id.toString());
  const currentCartQuantity = cartItem?.cartQty || 0;
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/products/${product.id}/comments`);
      if (response.data.success) {
        setComments(response.data.data || []);
        setAverageRating(getNumericRating(response.data.stats?.average ?? 0));
        setReviewCount(response.data.stats?.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments(initialComments);
      setAverageRating(getNumericRating(initialAverageRating));
      setReviewCount(initialReviewCount);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [product.id, refreshKey]);
  const refreshComments = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const productImages = (() => {
    if (!product.images) return ["/otherplaceholder.jpg"];
    if (Array.isArray(product.images)) {
      return product.images.length > 0 ? product.images : ["/otherplaceholder.jpg"];
    }
    if (typeof product.images === "string") {
      try {
        if (product.images.startsWith("[") || product.images.startsWith('"')) {
          const parsed = JSON.parse(product.images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
          if (typeof parsed === "string" && parsed) {
            return [parsed];
          }
        }
        if (product.images.trim()) {
          return [product.images.trim()];
        }
      } catch {
        if (product.images.trim()) {
          return [product.images.trim()];
        }
      }
    }
    return ["/otherplaceholder.jpg"];
  })();
  const discount = (() => {
    if (!product.sale_price || !product.regular_price) return 0;
    const regular = Number(product.regular_price);
    const sale = Number(product.sale_price);
    if (isNaN(regular) || isNaN(sale) || regular <= 0 || sale >= regular) return 0;
    return Math.round((regular - sale) / regular * 100);
  })();
  const renderStars = (rating) => {
    const numericRating = getNumericRating(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: [...Array(5)].map((_, index) => {
      if (index < fullStars) {
        return /* @__PURE__ */ jsx(FaStar, { className: "w-5 h-5 text-amber-400 fill-current" }, index);
      } else if (index === fullStars && hasHalfStar) {
        return /* @__PURE__ */ jsx(FaStar, { className: "w-5 h-5 text-amber-400 opacity-50" }, index);
      } else {
        return /* @__PURE__ */ jsx(FaRegStar, { className: "w-5 h-5 text-gray-300" }, index);
      }
    }) });
  };
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/otherplaceholder.jpg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/storage/") || imagePath.startsWith("/")) {
      return imagePath;
    }
    return `/storage/${imagePath}`;
  };
  const currentImage = productImages[selectedImageIndex] || "/otherplaceholder.jpg";
  const currentImageUrl = getImageUrl(currentImage);
  const handleAddToCart = () => {
    if (!product.inStock || product.quantity === 0) {
      toast.error("Product is out of stock");
      return false;
    }
    if (currentCartQuantity + quantity > (product.quantity || 0)) {
      toast.error(`Only ${product.quantity} items available in stock`);
      return false;
    }
    addToCart(product, store, quantity);
    return true;
  };
  const incrementQuantity = () => {
    const maxAvailable2 = (product.quantity || 0) - currentCartQuantity;
    if (quantity < maxAvailable2) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${maxAvailable2} more items available`);
    }
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };
  const maxAvailable = (product.quantity || 0) - currentCartQuantity;
  const totalReviews = reviewCount;
  const totalComments = comments.length;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.name} on our store!`;
  const shareLinks = [
    {
      name: "Facebook",
      icon: /* @__PURE__ */ jsx(FaFacebook, { className: "w-4 h-4" }),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Twitter",
      icon: /* @__PURE__ */ jsx(FaTwitter, { className: "w-4 h-4" }),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "WhatsApp",
      icon: /* @__PURE__ */ jsx(FaWhatsapp, { className: "w-4 h-4" }),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
    }
  ];
  const storeRating = (() => {
    if (!comments || comments.length === 0) return 0;
    const ratings = comments.filter((c) => c.rating !== null && c.rating !== void 0);
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, c) => sum + getNumericRating(c.rating || 0), 0);
    return Math.round(total / ratings.length * 10) / 10;
  })();
  const storeReviewCount = (() => {
    if (!comments) return 0;
    return comments.filter((c) => c.rating !== null && c.rating !== void 0).length;
  })();
  const displayStoreRating = getNumericRating(storeRating || store.rating || 0);
  const displayStoreReviewCount = storeReviewCount || store.review_count || 0;
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: product.name,
        description: stripHtml(product.description).slice(0, 160),
        keywords: `${product.name}, ${product.category}, ${product.brand || ""}, buy online Bangladesh, HaatPoint`,
        canonical: `https://www.haatpoint.com/products/${product.id}`,
        ogType: "product",
        ogTitle: product.name,
        ogDescription: stripHtml(product.description).slice(0, 200),
        ogUrl: `https://www.haatpoint.com/products/${product.id}`,
        ogImage: currentImageUrl.startsWith("http") ? currentImageUrl : `https://www.haatpoint.com${currentImageUrl}`,
        twitterTitle: product.name,
        twitterDescription: stripHtml(product.description).slice(0, 200),
        twitterImage: currentImageUrl.startsWith("http") ? currentImageUrl : `https://www.haatpoint.com${currentImageUrl}`,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: currentImageUrl.startsWith("http") ? currentImageUrl : `https://www.haatpoint.com${currentImageUrl}`,
            description: stripHtml(product.description).slice(0, 200),
            brand: product.brand ? { "@type": "Brand", name: product.brand } : void 0,
            sku: product.id,
            category: product.category,
            offers: {
              "@type": "Offer",
              url: `https://www.haatpoint.com/products/${product.id}`,
              priceCurrency: "BDT",
              price: String(Number(product.sale_price) || Number(product.regular_price) || 0),
              priceValidUntil: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)).toISOString().split("T")[0],
              availability: product.inStock && Number(product.quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: store.name
              }
            },
            ...getNumericRating(averageRating) > 0 ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: String(getNumericRating(averageRating)),
                reviewCount: String(reviewCount || 0),
                bestRating: "5",
                worstRating: "1"
              }
            } : {}
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.haatpoint.com/" },
              { "@type": "ListItem", position: 2, name: "Products", item: "https://www.haatpoint.com/products" },
              { "@type": "ListItem", position: 3, name: product.category, item: `https://www.haatpoint.com/products?category=${encodeURIComponent(product.category)}` },
              { "@type": "ListItem", position: 4, name: product.name, item: `https://www.haatpoint.com/products/${product.id}` }
            ]
          }
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("nav", { className: "flex mb-8 text-sm", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center space-x-2 flex-wrap", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center text-text-soft hover:text-marigold transition-colors", children: [
          /* @__PURE__ */ jsx(FaHome, { className: "w-4 h-4 mr-2" }),
          "Home"
        ] }) }),
        /* @__PURE__ */ jsx("li", { className: "text-text-soft", children: "/" }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "/products", className: "text-text-soft hover:text-marigold transition-colors", children: "Products" }) }),
        /* @__PURE__ */ jsx("li", { className: "text-text-soft", children: "/" }),
        /* @__PURE__ */ jsx("li", { className: "text-text-soft truncate max-w-xs", children: product.category }),
        /* @__PURE__ */ jsx("li", { className: "text-text-soft", children: "/" }),
        /* @__PURE__ */ jsx("li", { className: "text-ink font-medium truncate max-w-xs", children: product.name })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl bg-paper-dim aspect-square border border-line", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentImageUrl,
                  alt: product.name,
                  className: "w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105",
                  onError: (e) => {
                    const target = e.target;
                    target.src = "/otherplaceholder.jpg";
                  }
                }
              ),
              discount > 0 && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-red-500 text-white shadow-hard-sm", children: [
                "-",
                discount,
                "% OFF"
              ] }) }),
              product.brand && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-[#6E7F5C] text-white shadow-hard-sm", children: product.brand }) }),
              currentCartQuantity > 0 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-marigold/10 text-marigold text-sm font-medium", children: [
                currentCartQuantity,
                " in cart"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: auth.user && /* @__PURE__ */ jsx(WishlistButton, { productId: product.id }) })
            ] }),
            productImages.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex space-x-3 overflow-x-auto pb-2 scrollbar-hide", children: productImages.map((image, index) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedImageIndex(index),
                className: `flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? "border-marigold ring-2 ring-marigold/20" : "border-line hover:border-marigold/50"}`,
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: getImageUrl(image),
                    alt: `${product.name} ${index + 1}`,
                    className: "w-full h-full object-cover",
                    onError: (e) => {
                      const target = e.target;
                      target.src = "/placeholder-image.jpg";
                    }
                  }
                )
              },
              index
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-2", children: [
              product.brand && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-mono uppercase tracking-wide border border-orange-200", children: [
                /* @__PURE__ */ jsx(FaTag, { className: "w-3 h-3 mr-1.5" }),
                product.brand
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-marigold/10 text-marigold text-xs font-mono uppercase tracking-wide", children: [
                /* @__PURE__ */ jsx(FaTag, { className: "w-3 h-3 mr-1.5" }),
                product.product_type
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-mono uppercase tracking-wide", children: [
                /* @__PURE__ */ jsx(FaLeaf, { className: "w-3 h-3 mr-1.5" }),
                product.category
              ] }),
              product.inStock && product.quantity > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-mono uppercase tracking-wide", children: [
                /* @__PURE__ */ jsx(FaCheck, { className: "w-3 h-3 mr-1.5" }),
                "In Stock"
              ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-mono uppercase tracking-wide", children: "Out of Stock" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              product.brand && /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-sm font-semibold border border-orange-200", children: product.brand }) }),
              /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight", children: product.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-4 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "w-5 h-5 text-marigold" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: `/stores/${store.id}`,
                        className: "text-base font-semibold text-ink hover:text-marigold transition-colors",
                        children: store.name
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-soft", children: [
                      store.storetype,
                      " Store"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs bg-paper-dim px-3 py-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-amber-500 mr-1", children: "Rated" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: displayStoreRating.toFixed(1) }),
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft mx-1", children: "/" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-text-soft", children: [
                    displayStoreReviewCount,
                    " reviews"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-4 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  renderStars(averageRating),
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-ink", children: getNumericRating(averageRating).toFixed(1) })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-text-soft text-sm", children: [
                  "(",
                  totalReviews,
                  " rating",
                  totalReviews !== 1 ? "s" : "",
                  " / ",
                  totalComments,
                  " comment",
                  totalComments !== 1 ? "s" : "",
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim p-6 rounded-xl border border-line", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline space-x-4 mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-3xl sm:text-4xl font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.sale_price || product.regular_price }) }),
                product.sale_price && /* @__PURE__ */ jsx("span", { className: "text-xl text-text-soft line-through", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
              ] }),
              discount > 0 && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium", children: [
                /* @__PURE__ */ jsx(FaTag, { className: "w-4 h-4 mr-1.5" }),
                "Save ",
                /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price - product.sale_price }),
                " (",
                discount,
                "% OFF)"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-paper-dim rounded-xl border border-line", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-text-soft font-medium", children: "Availability:" }),
                  product.inStock && product.quantity > 0 ? /* @__PURE__ */ jsxs("span", { className: "flex items-center text-green-600 font-semibold", children: [
                    /* @__PURE__ */ jsx(FaCheck, { className: "w-4 h-4 mr-1.5" }),
                    "In Stock"
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-red-600 font-semibold", children: "Out of Stock" })
                ] }),
                product.inStock && product.quantity > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft", children: [
                  product.quantity,
                  " units available"
                ] })
              ] }),
              product.inStock && product.quantity > 0 && maxAvailable > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-text-soft font-medium", children: "Quantity:" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-line rounded-lg overflow-hidden bg-white", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: decrementQuantity,
                      disabled: quantity <= 1,
                      className: "px-4 py-2.5 text-text-soft hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-line",
                      children: /* @__PURE__ */ jsx(FaMinus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "px-6 py-2.5 text-lg font-medium w-16 text-center bg-white text-ink", children: quantity }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: incrementQuantity,
                      disabled: quantity >= maxAvailable,
                      className: "px-4 py-2.5 text-text-soft hover:bg-paper-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-line",
                      children: /* @__PURE__ */ jsx(FaPlus, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                maxAvailable > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft", children: [
                  maxAvailable,
                  " available"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleAddToCart,
                  disabled: !product.inStock || product.quantity === 0 || maxAvailable === 0,
                  className: "w-full py-4 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center",
                  children: [
                    /* @__PURE__ */ jsx(FaShoppingCart, { className: "w-5 h-5 mr-2" }),
                    currentCartQuantity > 0 ? "Add More" : "Add to Cart"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    if (handleAddToCart()) {
                      router.visit(route("cart.index"));
                    }
                  },
                  disabled: !product.inStock || product.quantity === 0,
                  className: "w-full py-4 bg-marigold hover:bg-marigold-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center",
                  children: [
                    /* @__PURE__ */ jsx(FaShoppingBag, { className: "w-5 h-5 mr-2" }),
                    "Buy Now"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowShareMenu(!showShareMenu),
                  className: "inline-flex items-center gap-2 text-text-soft hover:text-marigold transition-colors text-sm",
                  children: [
                    /* @__PURE__ */ jsx(FaShare, { className: "w-4 h-4" }),
                    "Share this product"
                  ]
                }
              ),
              showShareMenu && /* @__PURE__ */ jsxs("div", { className: "absolute top-8 left-0 bg-white rounded-xl shadow-hard-sm border border-line p-3 z-10 flex gap-2", children: [
                shareLinks.map((link) => /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: link.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "p-2 hover:bg-paper-dim rounded-lg transition-colors text-text-soft hover:text-marigold",
                    title: link.name,
                    children: link.icon
                  },
                  link.name
                )),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied to clipboard!");
                      setShowShareMenu(false);
                    },
                    className: "p-2 hover:bg-paper-dim rounded-lg transition-colors text-text-soft hover:text-marigold",
                    title: "Copy link",
                    children: /* @__PURE__ */ jsx(FaLink, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-line", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center p-3 bg-marigold/5 rounded-xl hover:bg-marigold/10 transition-colors border border-line", children: [
                /* @__PURE__ */ jsx(FaTruck, { className: "w-6 h-6 text-marigold mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: "Free Delivery" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-text-soft", children: "On orders over Tk 1000" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200", children: [
                /* @__PURE__ */ jsx(FaUndo, { className: "w-6 h-6 text-green-600 mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: "Easy Returns" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-text-soft", children: "7 days return" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200", children: [
                /* @__PURE__ */ jsx(FaShieldAlt, { className: "w-6 h-6 text-purple-600 mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: "Warranty" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-text-soft", children: "1 year warranty" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200", children: [
                /* @__PURE__ */ jsx(FaHeadset, { className: "w-6 h-6 text-orange-600 mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-ink", children: "24/7 Support" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-text-soft", children: "Live chat" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-line", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex border-b border-line bg-paper-dim overflow-x-auto", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("description"),
                className: `px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === "description" ? "text-marigold" : "text-text-soft hover:text-ink"}`,
                children: [
                  "Description",
                  activeTab === "description" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-marigold" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("specifications"),
                className: `px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === "specifications" ? "text-marigold" : "text-text-soft hover:text-ink"}`,
                children: [
                  "Specifications",
                  activeTab === "specifications" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-marigold" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setActiveTab("reviews"),
                className: `px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === "reviews" ? "text-marigold" : "text-text-soft hover:text-ink"}`,
                children: [
                  "Reviews (",
                  comments.length,
                  ")",
                  activeTab === "reviews" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-marigold" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8", children: [
            activeTab === "description" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-ink mb-4", children: "Product Description" }),
              /* @__PURE__ */ jsx("div", { className: "text-text-soft whitespace-pre-line leading-relaxed", children: stripHtml(product.description || "No description available.") })
            ] }),
            activeTab === "specifications" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-ink", children: "Product Specifications" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim p-6 rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-4 text-lg", children: "Product Details" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Product Name" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: product.name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Brand" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-orange-600", children: product.brand || "N/A" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Category" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: product.category })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Type" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: product.product_type })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Stock Status" }),
                      /* @__PURE__ */ jsx("span", { className: `font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`, children: product.inStock ? `${product.quantity} available` : "Out of stock" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Regular Price" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.regular_price }) })
                    ] }),
                    product.sale_price && /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Sale Price" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-green-600", children: /* @__PURE__ */ jsx(FormatPrice, { price: product.sale_price }) })
                    ] }),
                    product.item_weight && /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Weight" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-medium text-ink", children: [
                        product.item_weight,
                        " kg"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 pt-2 border-t border-line mt-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Product Rating" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: renderStars(averageRating) }),
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: getNumericRating(averageRating).toFixed(1) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                          "(",
                          reviewCount,
                          " reviews)"
                        ] })
                      ] })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim p-6 rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-4 text-lg", children: "Store Information" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Store Name" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: store.name })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Store Type" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: store.storetype })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Store Rating" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: renderStars(displayStoreRating) }),
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: displayStoreRating.toFixed(1) }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                          "(",
                          displayStoreReviewCount,
                          " reviews)"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2 border-b border-line", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Contact" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: store.mobile })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pb-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: "Address" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-ink text-right", children: store.address })
                    ] })
                  ] })
                ] }) })
              ] })
            ] }),
            activeTab === "reviews" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-ink mb-6", children: "Customer Reviews" }),
                /* @__PURE__ */ jsxs("div", { className: "text-center py-8 bg-paper-dim rounded-xl border border-line", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-4 mb-4", children: [
                    renderStars(averageRating),
                    /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-ink", children: getNumericRating(averageRating).toFixed(1) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-text-soft mb-6", children: [
                    "Based on ",
                    totalReviews,
                    " rating",
                    totalReviews !== 1 ? "s" : "",
                    " and ",
                    totalComments,
                    " comment",
                    totalComments !== 1 ? "s" : ""
                  ] }),
                  totalReviews > 0 && /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto mb-6 text-left", children: [5, 4, 3, 2, 1].map((star) => {
                    const count = comments.filter((c) => c.rating === star).length;
                    const percentage = totalReviews > 0 ? count / totalReviews * 100 : 0;
                    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium w-8", children: [
                        star,
                        " star"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "h-full bg-amber-400 rounded-full",
                          style: { width: `${percentage}%` }
                        }
                      ) }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-text-soft w-12", children: count })
                    ] }, star);
                  }) }),
                  auth.user ? /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft mb-3", children: userReview ? "You have already reviewed this product" : "Share your experience with this product" }) }) : /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: "/login",
                      className: "inline-block px-8 py-3 bg-paper-dim hover:bg-gray-200 text-ink font-medium rounded-xl transition-colors border border-line",
                      children: "Login to Write a Review"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-line pt-8", children: /* @__PURE__ */ jsx(
                CommentsList,
                {
                  comments,
                  productId: product.id.toString(),
                  authUser: auth.user,
                  isAuthenticated: !!auth.user,
                  userReview,
                  onCommentAdded: refreshComments
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-ink mb-6", children: "About the Store" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "w-8 h-8 text-marigold" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink", children: store.name }),
                /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
                  store.storetype,
                  " Store"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Seller address:" }),
                  /* @__PURE__ */ jsx("br", {}),
                  store.address
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Seller phone:" }),
                  /* @__PURE__ */ jsx("br", {}),
                  store.mobile
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Store rating:" }),
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: renderStars(displayStoreRating) }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: displayStoreRating.toFixed(1) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft", children: [
                      "(",
                      displayStoreReviewCount,
                      " reviews)"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-text-soft", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: "Seller email:" }),
                  /* @__PURE__ */ jsx("br", {}),
                  store.email || "N/A"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center md:justify-end", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: `/stores/${store.id}`,
              className: "px-8 py-3 bg-gray-900 hover:bg-marigold text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
              children: "Visit Store"
            }
          ) })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  ProductDetailsPage as default
};
