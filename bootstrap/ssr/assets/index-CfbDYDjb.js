import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { FaArrowLeft, FaUndo, FaFilter, FaSearch, FaBox, FaStore, FaCopy, FaShareAlt, FaPrint, FaTruck, FaCalendarAlt, FaCreditCard, FaUser, FaPhone, FaEnvelope, FaTimes, FaClock, FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { Link } from "@inertiajs/react";
import "./Navbar-I09bUsbF.js";
import "react-icons/fi";
import "./cartStore-BOd_ZlZA.js";
import "sonner";
import "zustand";
import "zustand/middleware";
import "./WishListCountButton-B1khDX5m.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "react-lazy-load-image-component";
import "./logoutUrl-IEIiw7Wd.js";
import "./WhatsAppChatButton-CDSWQr0H.js";
gsap.registerPlugin(ScrollTrigger);
const TrackOrderPage = ({ auth, wishlist }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const headerRef = useRef(null);
  const trackingRef = useRef(null);
  const orders = [
    {
      id: "ORD-2024-001234",
      orderNumber: "ORD-2024-001234",
      date: "2024-03-15",
      status: "shipped",
      statusText: "Shipped",
      estimatedDelivery: "2024-03-22",
      totalAmount: 249.99,
      shippingFee: 9.99,
      tax: 20,
      discount: 15,
      finalAmount: 264.98,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      shippingMethod: "Express Delivery",
      trackingNumber: "TRK789456123",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+880 1234-567890",
        address: "123 Main Street, Apt 4B",
        city: "Dhaka",
        zipCode: "1200",
        country: "Bangladesh"
      },
      store: {
        name: "TechHub Electronics",
        email: "contact@techhub.com",
        phone: "+880 1234-567891",
        address: "123 Technology Street, Block A, Dhaka"
      },
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          price: 89.99,
          quantity: 1,
          total: 89.99,
          status: "Shipped",
          store: "TechHub Electronics"
        },
        {
          id: 2,
          name: "Smart Watch Series 8",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop",
          price: 159.99,
          quantity: 1,
          total: 159.99,
          status: "Shipped",
          store: "TechHub Electronics"
        }
      ],
      trackingEvents: [
        {
          id: 1,
          status: "Order Placed",
          description: "Your order has been confirmed",
          location: "Dhaka Warehouse",
          timestamp: "10:30 AM",
          date: "Mar 15, 2024",
          icon: "check",
          completed: true,
          current: false
        },
        {
          id: 2,
          status: "Processing",
          description: "Order is being prepared for shipment",
          location: "Dhaka Warehouse",
          timestamp: "2:45 PM",
          date: "Mar 16, 2024",
          icon: "package",
          completed: true,
          current: false
        },
        {
          id: 3,
          status: "Shipped",
          description: "Order has left the warehouse",
          location: "Dhaka Distribution Center",
          timestamp: "9:15 AM",
          date: "Mar 18, 2024",
          icon: "truck",
          completed: true,
          current: true
        },
        {
          id: 4,
          status: "In Transit",
          description: "Package is on its way",
          location: "In Transit",
          timestamp: "Estimated",
          date: "Mar 19-20, 2024",
          icon: "transit",
          completed: false,
          current: false
        },
        {
          id: 5,
          status: "Out for Delivery",
          description: "Package will be delivered today",
          location: "Local Delivery Center",
          timestamp: "Morning",
          date: "Mar 22, 2024",
          icon: "delivery",
          completed: false,
          current: false
        },
        {
          id: 6,
          status: "Delivered",
          description: "Package delivered successfully",
          location: "Your Address",
          timestamp: "By 8:00 PM",
          date: "Mar 22, 2024",
          icon: "home",
          completed: false,
          current: false
        }
      ]
    },
    {
      id: "ORD-2024-001235",
      orderNumber: "ORD-2024-001235",
      date: "2024-03-14",
      status: "delivered",
      statusText: "Delivered",
      estimatedDelivery: "2024-03-18",
      totalAmount: 89.5,
      shippingFee: 4.99,
      tax: 8.95,
      discount: 5,
      finalAmount: 98.44,
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
      shippingMethod: "Standard Shipping",
      trackingNumber: "TRK123456789",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+880 1234-567890",
        address: "123 Main Street, Apt 4B",
        city: "Dhaka",
        zipCode: "1200",
        country: "Bangladesh"
      },
      store: {
        name: "Fashion Haven",
        email: "hello@fashionhaven.com",
        phone: "+880 1234-567892",
        address: "456 Fashion Avenue, Dhaka"
      },
      items: [
        {
          id: 1,
          name: "Casual Summer T-Shirt",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          price: 24.99,
          quantity: 2,
          total: 49.98,
          status: "Delivered",
          store: "Fashion Haven"
        },
        {
          id: 2,
          name: "Denim Jeans",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
          price: 39.52,
          quantity: 1,
          total: 39.52,
          status: "Delivered",
          store: "Fashion Haven"
        }
      ],
      trackingEvents: [
        {
          id: 1,
          status: "Order Placed",
          description: "Your order has been confirmed",
          location: "Dhaka Warehouse",
          timestamp: "3:15 PM",
          date: "Mar 14, 2024",
          icon: "check",
          completed: true,
          current: false
        },
        {
          id: 2,
          status: "Processing",
          description: "Order is being prepared for shipment",
          location: "Dhaka Warehouse",
          timestamp: "10:30 AM",
          date: "Mar 15, 2024",
          icon: "package",
          completed: true,
          current: false
        },
        {
          id: 3,
          status: "Shipped",
          description: "Order has left the warehouse",
          location: "Dhaka Distribution Center",
          timestamp: "2:00 PM",
          date: "Mar 16, 2024",
          icon: "truck",
          completed: true,
          current: false
        },
        {
          id: 4,
          status: "Delivered",
          description: "Package delivered successfully",
          location: "Your Address",
          timestamp: "11:45 AM",
          date: "Mar 18, 2024",
          icon: "home",
          completed: true,
          current: true
        }
      ]
    },
    {
      id: "ORD-2024-001236",
      orderNumber: "ORD-2024-001236",
      date: "2024-03-16",
      status: "processing",
      statusText: "Processing",
      estimatedDelivery: "2024-03-25",
      totalAmount: 156.75,
      shippingFee: 0,
      tax: 15.68,
      discount: 20,
      finalAmount: 152.43,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      shippingMethod: "Free Shipping",
      trackingNumber: "TRK456789123",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+880 1234-567890",
        address: "123 Main Street, Apt 4B",
        city: "Dhaka",
        zipCode: "1200",
        country: "Bangladesh"
      },
      store: {
        name: "Home & Living Store",
        email: "info@homeliving.com",
        phone: "+880 1234-567893",
        address: "789 Decor Lane, Chittagong"
      },
      items: [
        {
          id: 1,
          name: "Ceramic Dinner Set",
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
          price: 89.99,
          quantity: 1,
          total: 89.99,
          status: "Processing",
          store: "Home & Living Store"
        },
        {
          id: 2,
          name: "Decorative Wall Clock",
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
          price: 34.99,
          quantity: 1,
          total: 34.99,
          status: "Processing",
          store: "Home & Living Store"
        },
        {
          id: 3,
          name: "Kitchen Utensil Set",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
          price: 31.77,
          quantity: 1,
          total: 31.77,
          status: "Processing",
          store: "Home & Living Store"
        }
      ],
      trackingEvents: [
        {
          id: 1,
          status: "Order Placed",
          description: "Your order has been confirmed",
          location: "Chittagong Warehouse",
          timestamp: "9:45 AM",
          date: "Mar 16, 2024",
          icon: "check",
          completed: true,
          current: true
        },
        {
          id: 2,
          status: "Processing",
          description: "Order is being prepared for shipment",
          location: "Chittagong Warehouse",
          timestamp: "Pending",
          date: "Mar 17-18, 2024",
          icon: "package",
          completed: false,
          current: false
        },
        {
          id: 3,
          status: "Shipped",
          description: "Order will leave the warehouse",
          location: "Chittagong Distribution",
          timestamp: "Estimated",
          date: "Mar 19, 2024",
          icon: "truck",
          completed: false,
          current: false
        }
      ]
    },
    {
      id: "ORD-2024-001237",
      orderNumber: "ORD-2024-001237",
      date: "2024-03-12",
      status: "pending",
      statusText: "Pending",
      estimatedDelivery: "2024-03-20",
      totalAmount: 45.99,
      shippingFee: 3.99,
      tax: 4.6,
      discount: 0,
      finalAmount: 54.58,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      shippingMethod: "Standard Shipping",
      trackingNumber: "TRK321654987",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+880 1234-567890",
        address: "123 Main Street, Apt 4B",
        city: "Dhaka",
        zipCode: "1200",
        country: "Bangladesh"
      },
      store: {
        name: "Fresh Groceries",
        email: "support@freshgroceries.com",
        phone: "+880 1234-567894",
        address: "321 Market Road, Sylhet"
      },
      items: [
        {
          id: 1,
          name: "Organic Fruits Basket",
          image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=400&fit=crop",
          price: 29.99,
          quantity: 1,
          total: 29.99,
          status: "Pending",
          store: "Fresh Groceries"
        },
        {
          id: 2,
          name: "Fresh Vegetables Pack",
          image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop",
          price: 15.99,
          quantity: 1,
          total: 15.99,
          status: "Pending",
          store: "Fresh Groceries"
        }
      ],
      trackingEvents: [
        {
          id: 1,
          status: "Order Placed",
          description: "Your order has been confirmed",
          location: "Sylhet Warehouse",
          timestamp: "4:20 PM",
          date: "Mar 12, 2024",
          icon: "check",
          completed: true,
          current: true
        },
        {
          id: 2,
          status: "Processing",
          description: "Order will be processed soon",
          location: "Sylhet Warehouse",
          timestamp: "Pending",
          date: "Mar 13-14, 2024",
          icon: "package",
          completed: false,
          current: false
        }
      ]
    }
  ];
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const selectedOrderData = orders.find((order) => order.id === selectedOrder) || orders[0];
  useEffect(() => {
    if (!selectedOrder && orders.length > 0) {
      setSelectedOrder(orders[0].id);
    }
  }, [orders, selectedOrder]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      }
      if (trackingRef.current) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: trackingRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        });
        timeline.from(".tracking-step", {
          x: -50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out"
        });
      }
    });
    return () => ctx.revert();
  }, [selectedOrderData]);
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return /* @__PURE__ */ jsx(FaCheck, { className: "h-5 w-5" });
      case "shipped":
        return /* @__PURE__ */ jsx(FaTruck, { className: "h-5 w-5" });
      case "processing":
        return /* @__PURE__ */ jsx(FaClock, { className: "h-5 w-5" });
      case "pending":
        return /* @__PURE__ */ jsx(FaClock, { className: "h-5 w-5" });
      default:
        return /* @__PURE__ */ jsx(FaBox, { className: "h-5 w-5" });
    }
  };
  const handleCopyTracking = () => {
    navigator.clipboard.writeText(selectedOrderData.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1e3);
  };
  const OrderCard = ({ order }) => {
    const cardRef = useRef(null);
    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -4,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: cardRef,
        className: `bg-white rounded-xl border cursor-pointer transition-all duration-300 ${selectedOrder === order.id ? "border-amber-500 shadow-lg" : "border-gray-200 hover:border-amber-300"}`,
        onClick: () => setSelectedOrder(order.id),
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-gray-900", children: order.orderNumber }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: order.store.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`, children: order.statusText })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-4 w-4 text-gray-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Order Date:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Date(order.date).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(FaClock, { className: "h-4 w-4 text-gray-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Est. Delivery:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: new Date(order.estimatedDelivery).toLocaleDateString() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Total Amount:" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-gray-900", children: [
                "$",
                order.finalAmount.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx(FaBox, { className: "h-4 w-4 text-gray-400" }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
                order.items.length,
                " item",
                order.items.length > 1 ? "s" : ""
              ] })
            ] })
          ] })
        ] })
      }
    );
  };
  const TrackingStep = ({ event, isLast }) => {
    return /* @__PURE__ */ jsx("div", { className: "relative tracking-step", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: `h-12 w-12 rounded-full flex items-center justify-center z-10 ${event.completed ? "bg-green-500" : event.current ? "bg-amber-500" : "bg-gray-300"}`, children: event.completed ? /* @__PURE__ */ jsx(FaCheck, { className: "h-6 w-6 text-white" }) : event.current ? getStatusIcon(selectedOrderData.status) : /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded-full bg-gray-400" }) }),
        !isLast && /* @__PURE__ */ jsx("div", { className: `absolute top-12 h-full w-0.5 ${event.completed ? "bg-green-500" : "bg-gray-300"}` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 pb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-900", children: event.status }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: event.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-4 w-4 text-gray-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: event.location })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-4 w-4 text-gray-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: event.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(FaClock, { className: "h-4 w-4 text-gray-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: event.timestamp })
          ] })
        ] })
      ] })
    ] }) });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "Track Order",
        description: "Track your order status and shipping updates",
        canonical: "https://www.haatpoint.com/track-order",
        ogTitle: "Track Order | HaatPoint",
        ogDescription: "Track your order status and shipping updates",
        ogUrl: "https://www.haatpoint.com/track-order"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs("div", { ref: headerRef, className: "mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-4", children: [
          /* @__PURE__ */ jsx(Link, { href: "/", className: "hover:text-amber-600 transition-colors", children: "Home" }),
          /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-900 font-medium", children: "Track Order" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-2", children: "Track Your Order" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Monitor your order status and shipping updates in real-time" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleRefresh,
              disabled: isLoading,
              className: "px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(FaUndo, { className: `h-4 w-4 ${isLoading ? "animate-spin" : ""}` }),
                isLoading ? "Refreshing..." : "Refresh Status"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "My Orders" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowFilters(true),
                className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(FaFilter, { className: "h-5 w-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "search",
                placeholder: "Search by order number or tracking...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredOrders.map((order) => /* @__PURE__ */ jsx(OrderCard, { order }, order.id)) }),
          filteredOrders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsx(FaBox, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No orders found" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Try adjusting your search or filters" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: selectedOrderData.orderNumber }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrderData.status)} flex items-center gap-2`, children: [
                    getStatusIcon(selectedOrderData.status),
                    selectedOrderData.statusText
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsx(FaStore, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { children: selectedOrderData.store.name })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleCopyTracking,
                    className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(FaCopy, { className: "h-4 w-4" }),
                      copied ? "Copied!" : "Copy Tracking"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("button", { className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaShareAlt, { className: "h-4 w-4" }),
                  "Share"
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FaPrint, { className: "h-4 w-4" }),
                  "Print"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaTruck, { className: "h-5 w-5 text-blue-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Tracking Number" }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: selectedOrderData.trackingNumber })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCalendarAlt, { className: "h-5 w-5 text-green-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Estimated Delivery" }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: new Date(selectedOrderData.estimatedDelivery).toLocaleDateString() })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaCreditCard, { className: "h-5 w-5 text-purple-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Payment" }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: selectedOrderData.paymentMethod })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaBox, { className: "h-5 w-5 text-amber-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Shipping Method" }),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: selectedOrderData.shippingMethod })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-4", children: "Order Items" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedOrderData.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.image,
                    alt: item.name,
                    className: "h-16 w-16 object-cover rounded"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900", children: item.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Qty: ",
                      item.quantity
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Status: ",
                      item.status
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Store: ",
                      item.store
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-bold text-gray-900", children: [
                    "$",
                    item.total.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                    "$",
                    item.price.toFixed(2),
                    " each"
                  ] })
                ] })
              ] }, item.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-4", children: "Order Summary" }),
              /* @__PURE__ */ jsx("div", { className: "max-w-md ml-auto", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Subtotal" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    selectedOrderData.totalAmount.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Shipping" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    selectedOrderData.shippingFee.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Tax" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    selectedOrderData.tax.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Discount" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-600", children: [
                    "-$",
                    selectedOrderData.discount.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "border-t pt-2 mt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Total" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-xl text-gray-900", children: [
                    "$",
                    selectedOrderData.finalAmount.toFixed(2)
                  ] })
                ] }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: trackingRef, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-6", children: "Shipping Updates" }),
            /* @__PURE__ */ jsx("div", { className: "relative", children: selectedOrderData.trackingEvents.map((event, index) => /* @__PURE__ */ jsx(
              TrackingStep,
              {
                event,
                isLast: index === selectedOrderData.trackingEvents.length - 1
              },
              event.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5 text-blue-600" }) }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Shipping Address" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: selectedOrderData.customer.name }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: selectedOrderData.customer.address }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
                  selectedOrderData.customer.city,
                  ", ",
                  selectedOrderData.customer.zipCode
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: selectedOrderData.customer.country }),
                /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { children: selectedOrderData.customer.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { children: selectedOrderData.customer.email })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaStore, { className: "h-5 w-5 text-amber-600" }) }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Store Information" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: selectedOrderData.store.name }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: selectedOrderData.store.address }),
                /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { children: selectedOrderData.store.phone })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { children: selectedOrderData.store.email })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { className: "mt-4 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-medium rounded-lg transition-colors w-full", children: "Contact Store" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Transition, { appear: true, show: showFilters, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: setShowFilters, children: [
      /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-25" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0 scale-95",
          enterTo: "opacity-100 scale-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100 scale-100",
          leaveTo: "opacity-0 scale-95",
          children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-lg font-medium leading-6 text-gray-900", children: "Filter Orders" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowFilters(false),
                  className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                  children: /* @__PURE__ */ jsx(FaTimes, { className: "h-5 w-5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Order Status" }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ["all", "pending", "processing", "shipped", "delivered"].map((status) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `p-3 rounded-lg cursor-pointer transition-colors ${orderStatusFilter === status ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"}`,
                    onClick: () => setOrderStatusFilter(status),
                    children: status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)
                  },
                  status
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-3", children: "Date Range" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      className: "w-full p-3 border border-gray-300 rounded-lg",
                      placeholder: "From Date"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      className: "w-full p-3 border border-gray-300 rounded-lg",
                      placeholder: "To Date"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setOrderStatusFilter("all");
                    setShowFilters(false);
                  },
                  className: "flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                  children: "Reset Filters"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowFilters(false),
                  className: "flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors",
                  children: "Apply Filters"
                }
              )
            ] })
          ] })
        }
      ) }) })
    ] }) })
  ] });
};
export {
  TrackOrderPage as default
};
