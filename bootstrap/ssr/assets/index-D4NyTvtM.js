import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { FaShoppingCart, FaArrowRight, FaArrowLeft, FaTrash, FaBox, FaCreditCard, FaTag, FaCheckCircle, FaStar, FaMinus, FaPlus, FaHeart, FaShieldAlt, FaTruck, FaUndo, FaInfoCircle, FaTimes, FaMapMarkerAlt, FaTruckLoading, FaWeightHanging, FaPercent, FaLock } from "react-icons/fa";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import axios from "axios";
import { toast } from "sonner";
import { u as useStore } from "./cartStore-BOd_ZlZA.js";
import ClearCartDialog from "./ClearCartDialog-BuU7i3N1.js";
import FormatPrice from "./FormatePrice-CMWyewFT.js";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
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
const CartPage = ({ auth, wishlist }) => {
  const {
    cart: cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubTotal,
    getShipping,
    increaseQty,
    decreaseQty,
    getItemById,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    setPathaoCharges,
    setSelectedCity,
    setSelectedZone,
    setSelectedArea,
    setCities,
    setZonesCart,
    setAreasCart,
    getFormattedCartItems
  } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cities, setLocalCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingPathao, setLoadingPathao] = useState(false);
  const [pathaoBaseCharge, setPathaoBaseCharge] = useState(null);
  useEffect(() => {
    fetchCities();
  }, []);
  const fetchCities = async () => {
    setLoadingPathao(true);
    try {
      const res = await axios.get("/api/pathao/cities");
      const citiesData = res.data.data.data.map((city) => ({
        city_id: city.city_id,
        city_name: city.city_name
      }));
      setLocalCities(citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setLoadingPathao(false);
    }
  };
  const fetchZone = async (cityId) => {
    if (!cityId) return;
    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/zones/${cityId}`);
      const zonesData = res.data.data.data.map((zone) => ({
        zone_id: zone.zone_id,
        zone_name: zone.zone_name
      }));
      setZones(zonesData);
      setZonesCart(zonesData);
      setAreas([]);
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZones([]);
      toast.error("Failed to load zones");
    } finally {
      setLoadingPathao(false);
    }
  };
  const fetchArea = async (zoneId) => {
    if (!zoneId) return;
    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/areas/${zoneId}`);
      const areasData = res.data.data.data.map((area) => ({
        area_id: area.area_id,
        area_name: area.area_name,
        home_delivery_available: area.home_delivery_available || false,
        pickup_available: area.pickup_available || false
      }));
      setAreas(areasData);
      setAreasCart(areasData);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
      toast.error("Failed to load areas");
    } finally {
      setLoadingPathao(false);
    }
  };
  const getWeightSurchargePercentage = (weight) => {
    if (weight <= 0.5) return 0;
    if (weight > 0.5 && weight <= 1) return 10;
    if (weight > 1 && weight <= 2) return 35;
    if (weight > 2) {
      const extraKg = Math.ceil(weight - 2);
      return 35 + extraKg * 10;
    }
    return 0;
  };
  const getWeightSurchargeMessage = (weight) => {
    if (weight <= 0.5) return "No surcharge (≤ 0.5kg)";
    if (weight > 0.5 && weight <= 1) return "10% surcharge (0.5kg - 1kg)";
    if (weight > 1 && weight <= 2) return "35% surcharge (1kg - 2kg)";
    if (weight > 2) {
      const extraKg = Math.ceil(weight - 2);
      return `${35 + extraKg * 10}% surcharge (${extraKg}kg extra beyond 2kg)`;
    }
    return "";
  };
  const calculatePathaoPrice = async (cityId, zoneId, areaId) => {
    if (!cityId || !zoneId) {
      toast.error("Please select city and zone");
      return;
    }
    setLoadingPathao(true);
    try {
      const subtotal = getSubTotal();
      const itemCount = getTotalItems();
      const items = getFormattedCartItems();
      const totalWeight = items.reduce((sum, item) => {
        return sum + (item.item_weight || 0.5) * item.quantity;
      }, 0);
      const priceRequest = {
        store_id: 367082,
        sender_city: 2,
        recipient_city: parseInt(cityId),
        recipient_zone: parseInt(zoneId),
        item_type: 2,
        item_weight: Math.max(0.5, totalWeight),
        item_quantity: itemCount,
        amount_to_collect: subtotal,
        delivery_type: 48
      };
      if (areaId) {
        priceRequest.recipient_area = parseInt(areaId);
      }
      const response = await axios.post("/api/pathao/calculate-price", priceRequest);
      if (response.data?.data?.data) {
        const priceData = response.data.data.data;
        const pathaoDeliveryCharge = priceData.price || priceData.final_price || 0;
        setPathaoBaseCharge(pathaoDeliveryCharge);
        let weightSurchargePercentage = getWeightSurchargePercentage(totalWeight);
        let weightSurchargeAmount = pathaoDeliveryCharge * (weightSurchargePercentage / 100);
        const pathaoWithSurcharge = pathaoDeliveryCharge + weightSurchargeAmount;
        const totalDeliveryCharge = pathaoWithSurcharge + 20;
        setPathaoCharges({
          delivery_charge: totalDeliveryCharge,
          base_charge: pathaoDeliveryCharge,
          service_fee: 20,
          weight_surcharge: weightSurchargeAmount,
          weight_surcharge_percentage: weightSurchargePercentage
        });
        let weightMessage = "";
        if (totalWeight <= 0.5) {
          weightMessage = "No weight surcharge";
        } else if (totalWeight > 0.5 && totalWeight <= 1) {
          weightMessage = `+10% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        } else if (totalWeight > 1 && totalWeight <= 2) {
          weightMessage = `+35% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        } else if (totalWeight > 2) {
          weightMessage = `+${weightSurchargePercentage}% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        }
        toast.success(
          `Delivery charge: ৳${totalDeliveryCharge.toFixed(2)} (Pathao: ৳${pathaoDeliveryCharge.toFixed(2)} + ${weightMessage})`,
          { duration: 6e3 }
        );
      }
    } catch (error) {
      console.error("Pathao calculation error:", error);
      if (error.response?.data?.message?.includes("area")) {
        toast.error("Please select an area to calculate shipping");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to calculate shipping price. Please try again.");
      }
      setPathaoCharges(null);
      setPathaoBaseCharge(null);
    } finally {
      setLoadingPathao(false);
    }
  };
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedZone("");
    setSelectedArea("");
    setZones([]);
    setAreas([]);
    setPathaoCharges(null);
    setPathaoBaseCharge(null);
    if (cityId) {
      await fetchZone(cityId);
    }
  };
  const handleZoneChange = async (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setSelectedArea("");
    setAreas([]);
    setPathaoCharges(null);
    setPathaoBaseCharge(null);
    if (zoneId && selectedCity) {
      await fetchArea(zoneId);
      await calculatePathaoPrice(selectedCity, zoneId);
    }
  };
  const handleAreaChange = async (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    if (selectedCity && selectedZone) {
      await calculatePathaoPrice(selectedCity, selectedZone, areaId);
    }
  };
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const confirmClearCart = () => {
    clearCart();
    close();
  };
  const calculateTotals = () => {
    const subtotal = getSubTotal();
    const shipping = getShipping();
    const item_count = getTotalItems();
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.type === "percentage" ? subtotal * (appliedCoupon.discount / 100) : Math.min(appliedCoupon.discount, subtotal);
    }
    const total = Math.max(0, subtotal + shipping - discount);
    return { subtotal, shipping, discount, total, item_count };
  };
  const cartTotals = calculateTotals();
  const handleIncreaseQuantity = async (itemId) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty < item.quantity) {
      increaseQty(itemId);
      if (selectedCity && selectedZone) {
        await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
      }
    }
  };
  const handleDecreaseQuantity = async (itemId) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty > 1) {
      decreaseQty(itemId);
      if (selectedCity && selectedZone) {
        await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
      }
    } else {
      removeFromCart(itemId);
    }
  };
  const moveToWishlist = (itemId) => {
    const item = cartItems?.find((item2) => item2.id === itemId);
    if (item) {
      removeFromCart(itemId);
      toast.success(`${item.name} moved to wishlist`);
    }
  };
  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    const validCoupons = [
      { code: "SAVE10", discount: 10, type: "percentage" },
      { code: "SAVE20", discount: 20, type: "percentage" },
      { code: "SAVE5", discount: 5.99, type: "fixed" },
      { code: "SAVE15", discount: 15, type: "percentage" }
    ];
    const coupon = validCoupons.find((c) => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode("");
      toast.success(`Coupon ${coupon.code} applied!`);
    } else {
      toast.error("Invalid coupon code");
    }
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };
  const calculateDiscountPercentage = (regular, sale) => {
    if (!sale || sale >= regular) return 0;
    return Math.round((regular - sale) / regular * 100);
  };
  const getStockStatus = (inStock) => {
    if (inStock) return { label: "In Stock", color: "bg-green-100 text-green-800" };
    return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
  };
  const getFirstImage = (images) => {
    try {
      const parsed = JSON.parse(images);
      let imageName = "";
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageName = parsed[0];
      } else if (typeof parsed === "string" && parsed) {
        imageName = parsed;
      }
      if (imageName) {
        return `${window.location.origin}/storage/${imageName}`;
      }
    } catch (error) {
      if (typeof images === "string" && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `${window.location.origin}/storage/${matches[1]}`;
        }
      }
    }
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
  };
  const calculateSaleSavings = () => {
    return (cartItems || []).reduce((sum, item) => {
      const regular = item.regular_price;
      const sale = item.sale_price;
      const quantity = item.cartQty || 1;
      if (sale && sale < regular) {
        return sum + (regular - sale) * quantity;
      }
      return sum;
    }, 0);
  };
  const getSelectedCityName = () => {
    const city = cities.find((c) => c.city_id === parseFloat(selectedCity));
    return city?.city_name || "";
  };
  const getSelectedZoneName = () => {
    const zone = zones.find((z) => z.zone_id === parseFloat(selectedZone));
    return zone?.zone_name || "";
  };
  const getSelectedAreaName = () => {
    const area = areas.find((a) => a.area_id === parseFloat(selectedArea));
    return area?.area_name || "";
  };
  const getTotalWeight = () => {
    const items = getFormattedCartItems();
    return items.reduce((sum, item) => {
      return sum + (item.item_weight || 0.5) * item.quantity;
    }, 0);
  };
  const isCheckoutDisabled = () => {
    return !selectedCity || !selectedZone || !pathaoCharges || loadingPathao;
  };
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };
  if (!cartItems || cartItems.length === 0) {
    return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
      /* @__PURE__ */ jsx(SeoHead, { title: "Shopping Cart", description: "Review your cart items and proceed to secure checkout at HaatPoint.", canonical: "https://www.haatpoint.com/cart", robots: "noindex, nofollow", ogTitle: "Shopping Cart | HaatPoint", ogUrl: "https://www.haatpoint.com/cart" }),
      /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1240px] mx-auto px-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm p-12 text-center border border-line", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-6 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaShoppingCart, { className: "h-12 w-12 text-marigold" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold text-ink mb-3", children: "Your cart is empty" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-8 max-w-md mx-auto", children: "Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/products",
            className: "inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaArrowRight, { className: "h-4 w-4 mr-2" }),
              "Browse Products"
            ]
          }
        )
      ] }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: "Shopping Cart", description: "Review your cart items and select your delivery location for fast shipping.", canonical: "https://www.haatpoint.com/cart", robots: "noindex, nofollow", ogTitle: "Shopping Cart | HaatPoint", ogUrl: "https://www.haatpoint.com/cart" }),
    /* @__PURE__ */ jsx(ClearCartDialog, { isOpen, confirmClearCart }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-9", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Review your items" }),
          /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Shopping Cart" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-2", children: "Review your items and select delivery location for Pathao shipping" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/products",
              className: "font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors flex items-center gap-2 whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-3 w-3" }),
                "Continue Shopping"
              ]
            }
          ),
          cartItems.length > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: open,
              className: "font-mono text-xs uppercase tracking-wide border-b-2 border-red-500 pb-0.5 text-red-500 hover:text-red-600 hover:border-red-600 transition-colors flex items-center gap-2 whitespace-nowrap",
              children: [
                /* @__PURE__ */ jsx(FaTrash, { className: "h-3 w-3" }),
                "Clear Cart"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft", children: "Items" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-ink", children: cartTotals.item_count })
          ] }),
          /* @__PURE__ */ jsx(FaBox, { className: "h-6 w-6 sm:h-8 sm:w-8 text-marigold/70" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft", children: "Subtotal" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-ink truncate", children: /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.subtotal }) })
          ] }),
          /* @__PURE__ */ jsx(FaCreditCard, { className: "h-6 w-6 sm:h-8 sm:w-8 text-marigold/70" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft", children: "Savings" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-green-600 truncate", children: /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.discount + calculateSaleSavings() }) })
          ] }),
          /* @__PURE__ */ jsx(FaTag, { className: "h-6 w-6 sm:h-8 sm:w-8 text-green-500" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft", children: "Total" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-2xl font-bold text-marigold truncate", children: /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.total }) })
          ] }),
          /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-6 w-6 sm:h-8 sm:w-8 text-marigold" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm overflow-hidden border border-line", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 border-b border-line bg-paper-dim", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg sm:text-xl font-semibold text-ink", children: [
              "Your Items (",
              cartTotals.item_count,
              ")"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "divide-y divide-line", children: cartItems.map((item) => {
              const regularPrice = item.regular_price;
              const salePrice = item.sale_price ? item.sale_price : null;
              const discountPercent = calculateDiscountPercentage(regularPrice, salePrice);
              const stockStatus = getStockStatus(item.inStock);
              const currentPrice = salePrice || regularPrice;
              const quantity = item.cartQty || 1;
              const totalPrice = currentPrice * quantity;
              const imageUrl = getFirstImage(item.images);
              const rating = item.rating || 0;
              return /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 hover:bg-paper-dim/50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 sm:gap-6", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 border border-line", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imageUrl,
                      alt: item.name,
                      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                      onError: (e) => {
                        e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
                      }
                    }
                  ) }),
                  discountPercent > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full", children: [
                    "-",
                    discountPercent,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "flex-grow min-w-0", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx(Link, { href: `/products/${item.slug}`, children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-ink text-base sm:text-lg mb-1 hover:text-marigold transition-colors cursor-pointer truncate", children: item.name }) }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft mb-2 line-clamp-2", children: stripHtml(item.description) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-base sm:text-lg font-bold text-ink", children: /* @__PURE__ */ jsx(FormatPrice, { price: currentPrice }) }),
                      salePrice && /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-text-soft line-through", children: /* @__PURE__ */ jsx(FormatPrice, { price: regularPrice }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-mono text-text-soft bg-paper-dim px-2 py-1 rounded truncate max-w-[100px] sm:max-w-none", children: item.category }),
                    /* @__PURE__ */ jsx("span", { className: `text-[10px] sm:text-xs font-mono px-2 py-1 rounded-full ${stockStatus.color}`, children: stockStatus.label }),
                    rating > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center text-[10px] sm:text-xs text-text-soft", children: [
                      /* @__PURE__ */ jsx(FaStar, { className: "h-3 w-3 text-yellow-400 mr-1" }),
                      rating
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 sm:gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-line rounded-lg bg-white", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleDecreaseQuantity(item.id),
                            disabled: quantity <= 1,
                            className: "px-2 sm:px-3 py-1.5 sm:py-2 text-text-soft hover:bg-paper-dim disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors",
                            children: /* @__PURE__ */ jsx(FaMinus, { className: "h-3 w-3" })
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "w-8 sm:w-12 text-center py-1.5 sm:py-2 text-ink font-medium border-x border-line text-sm", children: quantity }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleIncreaseQuantity(item.id),
                            disabled: quantity >= item.quantity,
                            className: "px-2 sm:px-3 py-1.5 sm:py-2 text-text-soft hover:bg-paper-dim disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors",
                            children: /* @__PURE__ */ jsx(FaPlus, { className: "h-3 w-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-xs sm:text-sm font-semibold text-ink whitespace-nowrap", children: [
                        "Total: ",
                        /* @__PURE__ */ jsx(FormatPrice, { price: totalPrice })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => moveToWishlist(item.id),
                          className: "inline-flex items-center text-xs sm:text-sm text-text-soft hover:text-marigold hover:bg-paper-dim px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(FaHeart, { className: "h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" }),
                            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Save" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => removeFromCart(item.id),
                          className: "inline-flex items-center text-xs sm:text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(FaTrash, { className: "h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" }),
                            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Remove" })
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }) }) })
              ] }) }, item.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx(FaShieldAlt, { className: "h-5 w-5 sm:h-6 sm:w-6 text-green-600" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm sm:text-base", children: "Secure Checkout" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft truncate", children: "Your data is protected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx(FaTruck, { className: "h-5 w-5 sm:h-6 sm:w-6 text-blue-600" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm sm:text-base", children: "Pathao Delivery" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft truncate", children: "Fast & reliable" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0", children: /* @__PURE__ */ jsx(FaUndo, { className: "h-5 w-5 sm:h-6 sm:w-6 text-orange-600" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-ink text-sm sm:text-base", children: "Easy Returns" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft truncate", children: "30-day return policy" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-hard-sm overflow-hidden border border-line", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 border-b border-line bg-paper-dim", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg sm:text-xl font-semibold text-ink flex items-center", children: [
              /* @__PURE__ */ jsx(FaCreditCard, { className: "h-4 w-4 sm:h-5 sm:w-5 mr-2 text-text-soft" }),
              "Order Summary"
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base text-text-soft", children: "Subtotal" }),
                    /* @__PURE__ */ jsxs("div", { className: "group relative ml-2", children: [
                      /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 text-text-soft cursor-help" }),
                      /* @__PURE__ */ jsx("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none", children: "Tax (10%) is included" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink text-sm sm:text-base", children: /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.subtotal }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base text-text-soft", children: "Shipping (Pathao)" }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-ink text-sm sm:text-base", children: pathaoCharges ? /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.delivery_charge }) }) }) : /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: loadingPathao ? "Calculating..." : "Select area" }) })
                ] }),
                appliedCoupon && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center min-w-0", children: [
                    /* @__PURE__ */ jsx(FaTag, { className: "h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1 sm:mr-2 flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm text-text-soft truncate", children: [
                      "Discount (",
                      appliedCoupon.code,
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-shrink-0", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-600 mr-1 sm:mr-2 text-sm", children: [
                      "-",
                      /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.discount })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: removeCoupon,
                        className: "text-text-soft hover:text-ink transition-colors",
                        "aria-label": "Remove coupon",
                        children: /* @__PURE__ */ jsx(FaTimes, { className: "h-3 w-3 sm:h-4 sm:w-4" })
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-50 to-green-50 rounded-xl shadow-sm p-4 sm:p-6 border-2 border-green-200 mb-6", children: [
                /* @__PURE__ */ jsxs("h2", { className: "text-base sm:text-lg font-bold text-ink mb-4 flex items-center", children: [
                  /* @__PURE__ */ jsx(FaTruck, { className: "h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" }),
                  "Pathao Delivery"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "font-bold text-ink mb-3 flex items-center text-xs sm:text-sm", children: [
                    /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2" }),
                    "Select Delivery Location"
                  ] }),
                  loadingPathao && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 sm:p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-blue-700 font-medium flex items-center", children: [
                    /* @__PURE__ */ jsx(FaTruckLoading, { className: "h-3 w-3 mr-2 animate-spin" }),
                    "Loading locations..."
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide", children: "City *" }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: selectedCity,
                          onChange: handleCityChange,
                          className: "w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white",
                          disabled: loadingPathao,
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
                            cities.map((city) => /* @__PURE__ */ jsx("option", { value: city.city_id, children: city.city_name }, city.city_id))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide", children: "Zone *" }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: selectedZone,
                          onChange: handleZoneChange,
                          className: "w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white",
                          disabled: !selectedCity || loadingPathao,
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "Select Zone" }),
                            zones.map((zone) => /* @__PURE__ */ jsx("option", { value: zone.zone_id, children: zone.zone_name }, zone.zone_id))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide", children: "Area" }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: selectedArea,
                          onChange: handleAreaChange,
                          className: "w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white",
                          disabled: !selectedZone || loadingPathao,
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "Select Area (Optional)" }),
                            areas.map((area) => /* @__PURE__ */ jsx("option", { value: area.area_id, children: area.area_name }, area.area_id))
                          ]
                        }
                      )
                    ] })
                  ] }),
                  selectedCity && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm overflow-hidden", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2 sm:mb-3", children: [
                      /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" }),
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-green-800 text-xs sm:text-sm", children: "Delivery Charges" })
                    ] }),
                    loadingPathao && /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-blue-700 flex items-center", children: [
                      /* @__PURE__ */ jsx(FaTruckLoading, { className: "h-3 w-3 mr-2 animate-spin" }),
                      "Calculating delivery charges via Pathao..."
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { className: "mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-blue-700 flex items-center truncate", children: [
                      /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-3 w-3 mr-1 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                        "Delivering to: ",
                        getSelectedCityName(),
                        selectedZone && `, ${getSelectedZoneName()}`,
                        selectedArea && `, ${getSelectedAreaName()}`
                      ] })
                    ] }) }),
                    !loadingPathao && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs font-semibold text-yellow-800 flex items-center", children: [
                          /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-3 w-3 mr-1" }),
                          "Total Weight:"
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-bold text-yellow-900", children: [
                          getTotalWeight().toFixed(2),
                          " kg"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-2 p-2 bg-white rounded border border-yellow-200", children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-gray-700 flex items-center mb-1", children: [
                          /* @__PURE__ */ jsx(FaPercent, { className: "h-3 w-3 mr-1 text-orange-500" }),
                          "Weight Surcharge:"
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: `text-[10px] sm:text-xs font-medium ${getTotalWeight() <= 0.5 ? "text-green-600" : getTotalWeight() <= 1 ? "text-orange-500" : "text-red-500"}`, children: getWeightSurchargeMessage(getTotalWeight()) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center p-3 sm:p-4 bg-green-100 rounded-lg border-2 border-green-300 mb-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-green-700 font-semibold mb-1", children: loadingPathao ? "Calculating..." : pathaoCharges ? "Total Delivery Charge" : "Select area to calculate" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl font-bold text-green-700", children: loadingPathao ? /* @__PURE__ */ jsx(FaTruckLoading, { className: "h-5 w-5 sm:h-6 sm:w-6 mx-auto animate-spin" }) : pathaoCharges ? /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.delivery_charge }) : "---" })
                    ] }),
                    pathaoCharges && !loadingPathao && /* @__PURE__ */ jsxs("div", { className: "mt-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-200 overflow-hidden", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs font-semibold text-gray-700 mb-2 flex items-center", children: [
                        /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 mr-1" }),
                        "Price Breakdown:"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-[10px] sm:text-xs", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Pathao Base Charge:" }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium", children: /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.base_charge || 0 }) })
                        ] }),
                        pathaoCharges.weight_surcharge && pathaoCharges.weight_surcharge > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-orange-600", children: [
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center truncate", children: [
                            /* @__PURE__ */ jsx(FaWeightHanging, { className: "h-3 w-3 mr-1 flex-shrink-0" }),
                            /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                              "Surcharge (",
                              pathaoCharges.weight_surcharge_percentage,
                              "%):"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "flex-shrink-0", children: [
                            "+ ",
                            /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.weight_surcharge })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-blue-600", children: [
                          /* @__PURE__ */ jsx("span", { children: "Service Fee:" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "+ ",
                            /* @__PURE__ */ jsx(FormatPrice, { price: 20 })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2 border-t border-gray-200 font-semibold", children: [
                          /* @__PURE__ */ jsx("span", { children: "Total:" }),
                          /* @__PURE__ */ jsx("span", { className: "text-green-600", children: /* @__PURE__ */ jsx(FormatPrice, { price: pathaoCharges.delivery_charge }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-3 p-2 bg-gray-50 rounded text-[10px] sm:text-xs", children: [
                        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 font-medium mb-1 flex items-center", children: [
                          /* @__PURE__ */ jsx(FaInfoCircle, { className: "h-3 w-3 mr-1" }),
                          "Weight Surcharge Rules:"
                        ] }),
                        /* @__PURE__ */ jsxs("ul", { className: "text-gray-500 space-y-0.5 ml-4 list-disc", children: [
                          /* @__PURE__ */ jsxs("li", { children: [
                            "≤ 0.5 kg: ",
                            /* @__PURE__ */ jsx("span", { className: "text-green-600", children: "No surcharge" })
                          ] }),
                          /* @__PURE__ */ jsxs("li", { children: [
                            "0.5 kg - 1 kg: ",
                            /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "+10% surcharge" })
                          ] }),
                          /* @__PURE__ */ jsxs("li", { children: [
                            "1 kg - 2 kg: ",
                            /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "+35% surcharge" })
                          ] }),
                          /* @__PURE__ */ jsxs("li", { children: [
                            "> 2 kg: ",
                            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "+35% + 10% per additional kg" })
                          ] })
                        ] })
                      ] })
                    ] }),
                    selectedArea && pathaoCharges && /* @__PURE__ */ jsx("div", { className: "mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] sm:text-xs text-purple-700 flex items-center", children: [
                      /* @__PURE__ */ jsx(FaTruck, { className: "h-3 w-3 mr-1" }),
                      "Estimated delivery: ",
                      getSelectedCityName().toLowerCase().includes("dhaka") ? "2-3" : getSelectedCityName().toLowerCase().includes("chittagong") ? "2-3" : "3-5",
                      " business days"
                    ] }) })
                  ] })
                ] }) })
              ] }),
              !appliedCoupon && /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: couponCode,
                    onChange: (e) => setCouponCode(e.target.value),
                    placeholder: "Enter coupon code",
                    className: "flex-grow px-3 sm:px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-marigold transition-colors bg-white text-sm"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: applyCoupon,
                    className: "px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-md whitespace-nowrap text-sm",
                    children: "Apply"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-line pt-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-base sm:text-lg font-semibold text-ink", children: "Total" }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xl sm:text-2xl font-bold text-marigold", children: /* @__PURE__ */ jsx(FormatPrice, { price: cartTotals.total }) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xs sm:text-sm text-text-soft", children: [
                    cartTotals.item_count,
                    " item",
                    cartTotals.item_count !== 1 ? "s" : ""
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    if (!isCheckoutDisabled()) {
                      router.visit("/checkout");
                    }
                  },
                  disabled: isCheckoutDisabled(),
                  className: `w-full py-2.5 sm:py-3 px-4 font-semibold rounded-lg transition-all duration-300 text-center mb-4 flex items-center justify-center text-sm sm:text-base ${isCheckoutDisabled() ? "bg-gray-200 text-text-soft cursor-not-allowed" : "bg-gray-900 hover:bg-marigold text-white hover:shadow-lg hover:scale-105"}`,
                  children: [
                    /* @__PURE__ */ jsx(FaLock, { className: "h-4 w-4 sm:h-5 sm:w-5 mr-2" }),
                    isCheckoutDisabled() ? "Complete delivery details to continue" : "Proceed to Checkout"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center pt-4 border-t border-line", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-text-soft mb-3", children: "We accept" }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-marigold to-marigold-dark rounded-xl shadow-lg p-4 sm:p-6 text-white", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-semibold mb-2", children: "Need help?" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/80 text-xs sm:text-sm mb-4", children: "Our customer support team is available 24/7 to assist you with your order." }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/contactus",
                className: "inline-flex items-center justify-center w-full py-2 bg-white text-marigold font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm",
                children: [
                  "Contact Support",
                  /* @__PURE__ */ jsx(FaArrowRight, { className: "h-3 w-3 sm:h-4 sm:w-4 ml-2" })
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
};
export {
  CartPage as default
};
