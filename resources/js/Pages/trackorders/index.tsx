import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
  FaSearch,
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaStore,
  FaCopy,
  FaCheck,
  FaExclamationTriangle,
  FaTimesCircle,
  FaReceipt,
  FaShoppingBag,
  FaPhone,
  FaShieldAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaArrowRight
} from "react-icons/fa";
import { PageProps, Orders, OrderItem } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import SeoHead from "@/Components/SeoHead";
import Eyebrow from "@/Pages/Components/Eyebrow";
import FormatPrice from "@/Pages/utils/FormatePrice";
import AdSenseDisplay from "@/Components/AdSenseDisplay";

interface TrackOrderProps extends PageProps {
  searchedOrder?: (Orders & {
    order_items?: OrderItem[];
    store?: any;
    pathao_tracking_url?: string | null;
  }) | null;
  matchedOrders?: (Orders & {
    order_items?: OrderItem[];
    store?: any;
    pathao_tracking_url?: string | null;
  })[];
  recentOrders?: (Orders & {
    order_items?: OrderItem[];
    store?: any;
    pathao_tracking_url?: string | null;
  })[];
  initialQuery?: string;
  wishlist: any;
}

export default function TrackOrderPage({
  auth,
  wishlist,
  searchedOrder,
  matchedOrders = [],
  recentOrders = [],
  initialQuery = "",
}: TrackOrderProps) {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sync initial query if prop changes
  useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchInput(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    setIsSearching(true);
    router.get(
      route("trackorder.index"),
      { query },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  const selectOrder = (orderNumber: string) => {
    setSearchInput(orderNumber);
    setIsSearching(true);
    router.get(
      route("trackorder.index"),
      { order_number: orderNumber },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-BD", {
      month: "short",
      day: "numeric",
    });
  };

  // Status styling helper
  const getStatusBadge = (status?: string) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "delivered":
        return {
          label: "Delivered",
          badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
          dotClass: "bg-emerald-500",
        };
      case "shipped":
        return {
          label: "In Transit / Shipped",
          badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
          dotClass: "bg-indigo-500",
        };
      case "processing":
      case "confirmed":
        return {
          label: s === "confirmed" ? "Confirmed" : "Processing",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
          dotClass: "bg-blue-500",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
          dotClass: "bg-rose-500",
        };
      case "returned":
        return {
          label: "Returned",
          badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
          dotClass: "bg-purple-500",
        };
      case "pending":
      default:
        return {
          label: "Pending Confirmation",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
          dotClass: "bg-amber-500",
        };
    }
  };

  // Lifecycle steps for order tracking stepper
  const order = searchedOrder;
  const currentStatus = (order?.order_status || "pending").toLowerCase().trim();
  const isCancelled = currentStatus === "cancelled";
  const isReturned = currentStatus === "returned";

  const resolveProductImage = (item: any): string => {
    if (!item) return '/placeholder.png';

    let raw: any =
      item.product_image ||
      item.image ||
      (item.product && item.product.images) ||
      item.images;

    if (!raw) return '/placeholder.png';

    if (Array.isArray(raw)) {
      raw = raw[0];
    }

    if (typeof raw === 'string') {
      let trimmed = raw.trim();
      while (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 2) {
        trimmed = trimmed.slice(1, -1).trim();
      }
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            raw = parsed[0];
          } else if (typeof parsed === 'string') {
            raw = parsed;
          }
        } catch {
          const match = trimmed.match(/https?:\/\/[^\s"']+|product_images\/[^\s"']+/);
          if (match) {
            raw = match[0];
          }
        }
      } else {
        raw = trimmed;
      }
    }

    if (typeof raw !== 'string' || !raw.trim()) {
      return '/placeholder.png';
    }

    raw = raw.trim();

    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }

    raw = raw.replace(/\/+/g, '/');

    if (raw.startsWith('/storage/')) return raw;
    if (raw.startsWith('storage/')) return `/${raw}`;
    if (raw.startsWith('/product_images/')) return `/storage${raw}`;
    if (raw.startsWith('product_images/')) return `/storage/${raw}`;
    if (raw.startsWith('/')) return raw;

    if (!raw.includes('/')) {
      return `/storage/product_images/${raw}`;
    }

    return `/storage/${raw}`;
  };

  const getOrderItems = (ord: any): any[] => {
    if (!ord) return [];
    if (ord.order_items && ord.order_items.length > 0) {
      return ord.order_items;
    }
    if (ord.items) {
      try {
        const parsed = typeof ord.items === 'string' ? JSON.parse(ord.items) : ord.items;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((it: any, i: number) => ({
            id: it.id || it.product_id || `item-${i}`,
            product_name: it.name || it.product_name || 'Product',
            product_image: it.image || it.product_image || (Array.isArray(it.images) ? it.images[0] : it.images),
            quantity: it.quantity || it.cartQty || 1,
            price: it.price || it.sale_price || it.regular_price || 0,
            total: (it.price || it.sale_price || it.regular_price || 0) * (it.quantity || it.cartQty || 1),
            size: it.size || it.selectedSize || null,
            color: it.color || it.selectedColor || null,
          }));
        }
      } catch {
        // ignore
      }
    }
    return [];
  };

  const displayItems = getOrderItems(order);

  // Step indices: 0: Placed, 1: Confirmed/Processing, 2: Shipped, 3: Delivered
  const getStepState = (stepIndex: number) => {
    if (isCancelled || isReturned) return "inactive";

    // When the order is delivered (or completed), every step including "Out for Delivery & Delivered" is completed & checked
    if (currentStatus === "delivered" || currentStatus === "completed") {
      return "completed";
    }

    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      processing: 1,
      shipped: 2,
    };

    const currentLevel = statusMap[currentStatus] ?? 0;
    if (currentLevel > stepIndex) return "completed";
    if (currentLevel === stepIndex) return "current";
    return "pending";
  };

  const steps = [
    {
      title: "Order Placed",
      desc: "Order received by Haatpoint",
      date: order?.created_at ? formatShortDate(order.created_at) : undefined,
    },
    {
      title: "Confirmed & Packing",
      desc: "Store verified & preparing package",
      date: undefined,
    },
    {
      title: "Handed to Courier",
      desc: order?.shipping_method === "pathao" ? "Dispatched via Pathao Courier" : "Dispatched for delivery",
      date: undefined,
    },
    {
      title: "Out for Delivery & Delivered",
      desc: "Package delivered to recipient",
      date: currentStatus === "delivered" && order?.updated_at ? formatShortDate(order.updated_at) : undefined,
    },
  ];

  return (
    <AppLayout user={auth?.user} wishlist={wishlist}>
      <SeoHead
        title={order ? `Tracking ${order.order_number} - Haatpoint` : "Track Your Parcel - Haatpoint"}
        description="Track the real-time shipping status, courier updates, and delivery timeline for your Haatpoint orders."
      />

      <div className="min-h-screen bg-paper-dim py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          {/* Hero & Search Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/20 mb-3">
              <FaTruck className="h-3.5 w-3.5 text-marigold" />
              <span className="font-mono text-xs uppercase tracking-wider text-marigold font-bold">
                Live Parcel Tracker
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-ink mb-3">
              Track Your Parcel
            </h1>
            <p className="text-text-soft text-sm sm:text-base max-w-xl mx-auto">
              Enter your Haatpoint <strong className="text-ink">Order Number</strong> (e.g. ORD-XXXX-XXXX) or <strong className="text-ink">Phone Number</strong> to get live delivery updates.
            </p>

            {/* Search Input Box */}
            <div className="mt-6 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-text-soft" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Order # (e.g. ORD-TBJ5-3450) or Phone #"
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-line rounded-xl text-ink placeholder-text-soft text-sm focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent transition-all shadow-sm font-mono"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-soft hover:text-ink"
                    >
                      <FaTimesCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchInput.trim()}
                  className="px-6 py-3.5 bg-marigold hover:bg-marigold-dark text-white rounded-xl font-bold uppercase tracking-wide text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <FaTruck className="h-4 w-4" />
                      Track Parcel
                    </>
                  )}
                </button>
              </form>

              {/* Sample order hint if nothing is searched yet */}
              {!order && !initialQuery && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-soft">
                  <span>Tip: Look for your Order ID in the confirmation SMS or email invoice.</span>
                </div>
              )}
            </div>

            {/* Recent Orders Pills for Logged-in Shopper */}
            {recentOrders.length > 0 && (
              <div className="mt-8 pt-6 border-t border-line/60">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaReceipt className="h-3.5 w-3.5 text-text-soft" />
                  <span className="font-mono text-xs uppercase tracking-wider text-text-soft font-semibold">
                    Your Recent Orders
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentOrders.map((ro) => {
                    const isSelected = order?.id === ro.id;
                    const badge = getStatusBadge(ro.order_status);
                    return (
                      <button
                        key={ro.id}
                        type="button"
                        onClick={() => selectOrder(ro.order_number)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          isSelected
                            ? "bg-marigold text-white border-marigold font-bold shadow-sm"
                            : "bg-white text-ink border-line hover:border-marigold hover:bg-marigold/5"
                        }`}
                      >
                        <span>{ro.order_number}</span>
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : badge.dotClass}`} />
                        <span className={isSelected ? "text-white/90" : "text-text-soft"}>
                          <FormatPrice price={ro.total} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Multiple Matches Selector (e.g. when searching by phone) */}
            {matchedOrders.length > 1 && (
              <div className="mt-6 max-w-2xl mx-auto bg-white p-4 rounded-xl border border-line shadow-sm text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-soft mb-2.5">
                  Found {matchedOrders.length} orders matching your search. Select one:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedOrders.map((mo) => {
                    const isSelected = order?.id === mo.id;
                    const badge = getStatusBadge(mo.order_status);
                    return (
                      <button
                        key={mo.id}
                        type="button"
                        onClick={() => selectOrder(mo.order_number)}
                        className={`p-2.5 text-left rounded-lg border text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-marigold bg-marigold/5 ring-1 ring-marigold"
                            : "border-line bg-paper-dim/40 hover:bg-paper-dim"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono font-bold text-ink">{mo.order_number}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-text-soft text-[11px]">
                          <span>{formatShortDate(mo.created_at)}</span>
                          <span className="font-medium text-ink"><FormatPrice price={mo.total} /></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Details View (When order is active) */}
          {order ? (
            <div className="space-y-6">

              {/* Status Header Banner */}
              <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                        {order.order_number}
                      </h2>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(order.order_number, "order")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-text-soft hover:text-ink bg-paper-dim border border-line rounded-md transition-colors"
                        title="Copy Order Number"
                      >
                        {copiedText === "order" ? (
                          <>
                            <FaCheck className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Status badge */}
                      {(() => {
                        const badge = getStatusBadge(order.order_status);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${badge.badgeClass}`}>
                            <span className={`w-2 h-2 rounded-full ${badge.dotClass} animate-pulse`} />
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="mt-1 text-xs text-text-soft">
                      Placed on <span className="text-ink font-medium">{formatDate(order.created_at)}</span>
                      {order.store_name && (
                        <span> · Sold by <strong className="text-ink">{order.store_name}</strong></span>
                      )}
                    </p>
                  </div>

                  {/* Tracking Number */}
                  {order.tracking_number && (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 bg-paper-dim px-3 py-1.5 rounded-lg border border-line text-xs font-mono">
                        <span className="text-text-soft">Tracking:</span>
                        <strong className="text-ink">{order.tracking_number}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.tracking_number!, "tracking")}
                          className="text-text-soft hover:text-ink"
                          title="Copy Tracking Number"
                        >
                          {copiedText === "tracking" ? <FaCheck className="h-3 w-3 text-emerald-600" /> : <FaCopy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancelled Alert Banner */}
                {isCancelled && (
                  <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                    <FaTimesCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">This order has been cancelled</h4>
                      <p className="text-xs text-rose-700 mt-0.5">
                        This order is no longer in transit. If you made an online payment, any applicable refund will be processed according to our policy. For questions, please contact Haatpoint Support.
                      </p>
                    </div>
                  </div>
                )}

                {/* Returned Alert Banner */}
                {isReturned && (
                  <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                    <FaExclamationTriangle className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-purple-900">Parcel returned to merchant</h4>
                      <p className="text-xs text-purple-700 mt-0.5">
                        This shipment could not be delivered and has been returned to the seller.
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Stepper (Only active if not cancelled) */}
                {!isCancelled && !isReturned && (
                  <div className="mt-8 pt-2">
                    <div className="relative">
                      {/* Connecting Progress Track (Desktop) */}
                      <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-line -translate-y-1/2 rounded-full z-0 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            currentStatus === "delivered" || currentStatus === "completed"
                              ? "bg-emerald-500 w-full"
                              : currentStatus === "shipped"
                              ? "bg-marigold w-2/3"
                              : currentStatus === "processing" || currentStatus === "confirmed"
                              ? "bg-marigold w-1/3"
                              : "bg-marigold w-0"
                          }`}
                        />
                      </div>

                      {/* Stepper Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                        {steps.map((st, idx) => {
                          const state = getStepState(idx);
                          const isDone = state === "completed";
                          const isCurr = state === "current";

                          return (
                            <div key={idx} className="relative flex flex-col items-center text-center">
                              {/* Step circle */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all mb-3 z-10 ${
                                  isDone
                                    ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100"
                                    : isCurr
                                    ? "bg-marigold text-white shadow-md ring-4 ring-marigold/20 animate-pulse"
                                    : "bg-paper-dim border border-line text-text-soft"
                                }`}
                              >
                                {isDone ? (
                                  <FaCheck className="h-4 w-4" />
                                ) : isCurr ? (
                                  <FaTruck className="h-4 w-4" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>

                              {/* Step text */}
                              <h4
                                className={`font-display font-extrabold uppercase text-xs tracking-tight ${
                                  isDone || isCurr ? "text-ink" : "text-text-soft"
                                }`}
                              >
                                {st.title}
                              </h4>
                              <p className="text-[11px] text-text-soft mt-0.5 max-w-[140px]">
                                {st.desc}
                              </p>
                              {st.date && (
                                <span className="font-mono text-[10px] text-text-soft mt-1">
                                  {st.date}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Grid: Items (Left 2 cols) & Details (Right 1 col) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Ordered Items & Bill Summary */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Order Items List */}
                  <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-paper-dim/60 border-b border-line flex items-center justify-between">
                      <h3 className="font-display font-extrabold uppercase text-sm tracking-wide text-ink flex items-center gap-2">
                        <FaBox className="h-4 w-4 text-marigold" />
                        <span>Ordered Items ({displayItems.length || order.item_quantity || 1})</span>
                      </h3>
                      {order.shipping_method && (
                        <span className="font-mono text-[11px] uppercase tracking-wider text-text-soft">
                          Delivery: <strong className="text-ink">{order.shipping_method === "pathao" ? "Pathao Courier" : "Standard Home Delivery"}</strong>
                        </span>
                      )}
                    </div>

                    <div className="divide-y divide-line">
                      {displayItems && displayItems.length > 0 ? (
                        displayItems.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-paper-dim/20 transition-colors">
                            {/* Product Thumbnail */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-line bg-paper-dim overflow-hidden shrink-0 relative flex items-center justify-center">
                              <img
                                src={resolveProductImage(item)}
                                alt={item.product_name || "Product image"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.src.endsWith('/placeholder.png')) {
                                    target.src = '/placeholder.png';
                                  }
                                }}
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-ink truncate mb-1">
                                {item.product_name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-text-soft">
                                <span>Qty: <strong className="text-ink">{item.quantity}</strong></span>
                                {item.size && (
                                  <span className="px-2 py-0.5 rounded bg-paper-dim border border-line text-[11px]">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="px-2 py-0.5 rounded bg-paper-dim border border-line text-[11px]">
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                              <div className="font-mono text-sm font-bold text-ink">
                                <FormatPrice price={item.total} />
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-[11px] text-text-soft">
                                  <FormatPrice price={item.price} /> each
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-text-soft text-sm">
                          <p>{order.item_description || "Standard shipment items"}</p>
                          <p className="text-xs mt-1">Quantity: {order.item_quantity || 1}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Breakdown Card */}
                  <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
                    <h3 className="font-display font-extrabold uppercase text-sm tracking-wide text-ink mb-4 flex items-center gap-2">
                      <FaCreditCard className="h-4 w-4 text-marigold" />
                      <span>Payment & Cost Breakdown</span>
                    </h3>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-text-soft">
                        <span>Items Subtotal</span>
                        <span className="text-ink font-mono"><FormatPrice price={order.subtotal} /></span>
                      </div>
                      <div className="flex justify-between text-text-soft">
                        <span>Delivery Charge</span>
                        <span className="text-ink font-mono"><FormatPrice price={order.delivery_charge} /></span>
                      </div>
                      {Number(order.discount_amount) > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                          <span className="font-mono font-medium">-<FormatPrice price={order.discount_amount} /></span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-line flex justify-between items-center text-base">
                        <span className="font-bold text-ink">Total Amount</span>
                        <span className="font-mono font-extrabold text-lg text-marigold-dark">
                          <FormatPrice price={order.total} />
                        </span>
                      </div>
                    </div>

                    {/* Payment details pill */}
                    <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-text-soft">Payment Method: </span>
                        <strong className="text-ink uppercase font-mono">
                          {order.payment_method === "bikash" ? "bKash" : order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : order.payment_method}
                        </strong>
                      </div>
                      <div>
                        <span className="text-text-soft">Payment Status: </span>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                            order.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {order.payment_status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Delivery & Store Info */}
                <div className="space-y-6">

                  {/* Recipient & Delivery Address */}
                  <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
                    <h3 className="font-display font-extrabold uppercase text-sm tracking-wide text-ink mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="h-4 w-4 text-emerald-600" />
                      <span>Delivery Details</span>
                    </h3>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-text-soft text-xs block">Recipient Name</span>
                        <span className="text-ink font-semibold">{order.recipient_name}</span>
                      </div>
                      <div>
                        <span className="text-text-soft text-xs block">Contact Phone</span>
                        <span className="text-ink font-mono">{order.recipient_phone}</span>
                      </div>
                      <div>
                        <span className="text-text-soft text-xs block">Delivery Address</span>
                        <span className="text-ink leading-relaxed">{order.recipient_address}</span>
                      </div>
                      {order.special_instruction && (
                        <div className="pt-2 border-t border-line">
                          <span className="text-text-soft text-xs block">Special Instructions</span>
                          <span className="text-ink italic bg-paper-dim p-2 rounded-lg block mt-1">
                            "{order.special_instruction}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store / Merchant Information */}
                  <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
                    <h3 className="font-display font-extrabold uppercase text-sm tracking-wide text-ink mb-4 flex items-center gap-2">
                      <FaStore className="h-4 w-4 text-marigold" />
                      <span>Seller Information</span>
                    </h3>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-text-soft text-xs block">Store Name</span>
                        <span className="text-ink font-semibold">{order.store_name || order.store?.name || "Haatpoint Merchant"}</span>
                      </div>
                      {order.sender_phone && (
                        <div>
                          <span className="text-text-soft text-xs block">Merchant Phone</span>
                          <span className="text-ink font-mono">{order.sender_phone}</span>
                        </div>
                      )}
                      {order.store?.address && (
                        <div>
                          <span className="text-text-soft text-xs block">Store Location</span>
                          <span className="text-ink">{order.store.address}</span>
                        </div>
                      )}

                      {order.store_id && (
                        <div className="pt-2">
                          <Link
                            href={route("stores.show", order.store_id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-marigold hover:text-marigold-dark transition-colors"
                          >
                            <span>Visit Store Profile</span>
                            <FaArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Need Help Box */}
                  <div className="bg-paper-dim rounded-2xl border border-line p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <FaQuestionCircle className="h-4 w-4 text-marigold" />
                      <h4 className="font-display font-extrabold uppercase text-xs tracking-wider text-ink">
                        Need Help With Your Order?
                      </h4>
                    </div>
                    <p className="text-xs text-text-soft leading-relaxed mb-3">
                      Have questions regarding shipping times, delivery rescheduling, or item returns? Our support team is here to help.
                    </p>
                    <Link
                      href={route("contact.index")}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-line text-ink border border-line rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <FaPhone className="h-3 w-3 text-text-soft" />
                      Contact Haatpoint Support
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          ) : initialQuery ? (
            /* Search yielded no results */
            <div className="bg-white rounded-2xl border border-line shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
                <FaExclamationTriangle className="h-8 w-8" />
              </div>
              <h3 className="font-display font-extrabold uppercase text-xl text-ink mb-2">
                No Order Found
              </h3>
              <p className="text-text-soft text-sm leading-relaxed mb-6">
                We couldn't find any orders matching <strong className="text-ink">"{initialQuery}"</strong>. Please verify the order number (e.g. <span className="font-mono font-medium">ORD-XXXX-XXXX</span>) or phone number you used during checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="px-5 py-2.5 bg-paper-dim hover:bg-line text-ink border border-line rounded-xl text-xs font-bold uppercase tracking-wide transition-colors"
                >
                  Clear Search
                </button>
                <Link
                  href={route("contact.index")}
                  className="px-5 py-2.5 bg-marigold hover:bg-marigold-dark text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          ) : (
            /* Default informational view when page first opens without query */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-4">
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-marigold/10 border border-marigold/20 flex items-center justify-center mx-auto mb-3 text-marigold">
                  <FaReceipt className="h-5 w-5" />
                </div>
                <h4 className="font-display font-extrabold uppercase text-sm text-ink mb-1">
                  1. Locate Order ID
                </h4>
                <p className="text-xs text-text-soft leading-relaxed">
                  Your Order Number starts with <strong className="text-ink">ORD-</strong> and is included in your confirmation SMS and email receipt.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <FaTruck className="h-5 w-5" />
                </div>
                <h4 className="font-display font-extrabold uppercase text-sm text-ink mb-1">
                  2. Fast Nationwide Delivery
                </h4>
                <p className="text-xs text-text-soft leading-relaxed">
                  Deliveries inside Dhaka take 24-48 hours. Shipments to all other districts across Bangladesh take 2-4 business days.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                  <FaShieldAlt className="h-5 w-5" />
                </div>
                <h4 className="font-display font-extrabold uppercase text-sm text-ink mb-1">
                  3. Verified Delivery
                </h4>
                <p className="text-xs text-text-soft leading-relaxed">
                  Every parcel is tracked end-to-end with Pathao Courier and our merchant dispatch network for safe arrival.
                </p>
              </div>
            </div>
          )}

          {/* Display Ad below Tracking Information */}
          <div className="max-w-4xl mx-auto mt-10">
            <AdSenseDisplay />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
