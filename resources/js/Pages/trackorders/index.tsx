import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaClock,
  FaCheck,
  FaCreditCard,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCopy,
  FaShareAlt,
  FaPrint,
  FaArrowLeft,
  FaStore,
  FaCalendarAlt,
  FaUndo
} from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageProps } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";


gsap.registerPlugin(ScrollTrigger);

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  status: string;
  store: string;
}

interface TrackingEvent {
  id: number;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  date: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

interface OrderData {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  statusText: string;
  estimatedDelivery: string;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingMethod: string;
  trackingNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  store: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  trackingEvents: TrackingEvent[];
}

const TrackOrderPage = ({auth, wishlist}: PageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);

  // Mock orders data
  const orders: OrderData[] = [
    {
      id: "ORD-2024-001234",
      orderNumber: "ORD-2024-001234",
      date: "2024-03-15",
      status: "shipped",
      statusText: "Shipped",
      estimatedDelivery: "2024-03-22",
      totalAmount: 249.99,
      shippingFee: 9.99,
      tax: 20.00,
      discount: 15.00,
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
      totalAmount: 89.50,
      shippingFee: 4.99,
      tax: 8.95,
      discount: 5.00,
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
      shippingFee: 0.00,
      tax: 15.68,
      discount: 20.00,
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
      tax: 4.60,
      discount: 0.00,
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrderData = orders.find(order => order.id === selectedOrder) || orders[0];

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

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <FaCheck className="h-5 w-5" />;
      case "shipped":
        return <FaTruck className="h-5 w-5" />;
      case "processing":
        return <FaClock className="h-5 w-5" />;
      case "pending":
        return <FaClock className="h-5 w-5" />;
      default:
        return <FaBox className="h-5 w-5" />;
    }
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(selectedOrderData.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const OrderCard = ({ order }: { order: OrderData }) => {
    const cardRef = useRef<HTMLDivElement>(null);

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

    return (
      <div
        ref={cardRef}
        className={`bg-white rounded-xl border cursor-pointer transition-all duration-300 ${
          selectedOrder === order.id ? "border-amber-500 shadow-lg" : "border-gray-200 hover:border-amber-300"
        }`}
        onClick={() => setSelectedOrder(order.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
              <p className="text-sm text-gray-600">{order.store.name}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.statusText}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaClock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Est. Delivery:</span>
              <span className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="font-bold text-lg text-gray-900">${order.finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaBox className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TrackingStep = ({ event, isLast }: { event: TrackingEvent; isLast: boolean }) => {
    return (
      <div className="relative tracking-step">
        <div className="flex gap-4">
          {/* Icon & Line */}
          <div className="relative flex flex-col items-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center z-10 ${
              event.completed ? 'bg-green-500' : event.current ? 'bg-amber-500' : 'bg-gray-300'
            }`}>
              {event.completed ? (
                <FaCheck className="h-6 w-6 text-white" />
              ) : event.current ? (
                getStatusIcon(selectedOrderData.status)
              ) : (
                <div className="h-4 w-4 rounded-full bg-gray-400"></div>
              )}
            </div>
            {!isLast && (
              <div className={`absolute top-12 h-full w-0.5 ${
                event.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="mb-2">
              <h4 className="font-bold text-gray-900">{event.status}</h4>
              <p className="text-gray-600 text-sm">{event.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{event.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <SeoHead />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <FaArrowLeft className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Track Order</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                <p className="text-gray-600">Monitor your order status and shipping updates in real-time</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaUndo className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Status'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Order List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">My Orders</h2>
                    <button
                      onClick={() => setShowFilters(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaFilter className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative mb-6">
                    <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search by order number or tracking..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Order List */}
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>

                  {/* No Results */}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <FaBox className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content - Order Details & Tracking */}
            <div className="lg:col-span-2">
              {/* Order Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOrderData.orderNumber}</h2>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrderData.status)} flex items-center gap-2`}>
                        {getStatusIcon(selectedOrderData.status)}
                        {selectedOrderData.statusText}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaStore className="h-4 w-4" />
                        <span>{selectedOrderData.store.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyTracking}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FaCopy className="h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy Tracking'}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <FaShareAlt className="h-4 w-4" />
                      Share
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <FaPrint className="h-4 w-4" />
                      Print
                    </button>
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaTruck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-bold text-gray-900">{selectedOrderData.trackingNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-bold text-gray-900">
                          {new Date(selectedOrderData.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaCreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment</p>
                        <p className="font-bold text-gray-900">{selectedOrderData.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FaBox className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Shipping Method</p>
                        <p className="font-bold text-gray-900">{selectedOrderData.shippingMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrderData.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>Status: {item.status}</span>
                            <span>Store: {item.store}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                  <div className="max-w-md ml-auto">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${selectedOrderData.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">${selectedOrderData.shippingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${selectedOrderData.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-${selectedOrderData.discount.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-xl text-gray-900">${selectedOrderData.finalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div ref={trackingRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-6">Shipping Updates</h3>
                <div className="relative">
                  {selectedOrderData.trackingEvents.map((event, index) => (
                    <TrackingStep
                      key={event.id}
                      event={event}
                      isLast={index === selectedOrderData.trackingEvents.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg">Shipping Address</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{selectedOrderData.customer.name}</p>
                    <p className="text-gray-600">{selectedOrderData.customer.address}</p>
                    <p className="text-gray-600">{selectedOrderData.customer.city}, {selectedOrderData.customer.zipCode}</p>
                    <p className="text-gray-600">{selectedOrderData.customer.country}</p>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrderData.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrderData.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FaStore className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg">Store Information</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{selectedOrderData.store.name}</p>
                    <p className="text-gray-600">{selectedOrderData.store.address}</p>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrderData.store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrderData.store.email}</span>
                      </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-medium rounded-lg transition-colors w-full">
                      Contact Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      <Transition appear show={showFilters} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowFilters}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Filter Orders
                    </Dialog.Title>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Order Status</h4>
                      <div className="space-y-2">
                        {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
                          <div
                            key={status}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              orderStatusFilter === status ? "bg-amber-50 text-amber-600 font-medium" : "hover:bg-gray-50"
                            }`}
                            onClick={() => setOrderStatusFilter(status)}
                          >
                            {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-3">Date Range</h4>
                      <div className="space-y-3">
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="From Date"
                        />
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="To Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setOrderStatusFilter("all");
                        setShowFilters(false);
                      }}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
};

export default TrackOrderPage;
