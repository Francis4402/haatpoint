import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { FaUsers, FaRocket, FaHeart, FaStore, FaCheckCircle, FaLock, FaGlobe, FaMobileAlt, FaEye, FaClock, FaHeadset, FaHandshake, FaTruck, FaShieldAlt, FaLeaf } from "react-icons/fa";
import { FiZap, FiTrendingUp, FiSmile } from "react-icons/fi";
import { RiTeamFill, RiCustomerService2Fill } from "react-icons/ri";
import "./Navbar-I09bUsbF.js";
import "@headlessui/react";
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
const AboutUs = ({ auth, wishlist, stats = {
  totalProducts: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalVendors: 0
} }) => {
  const [activeTab, setActiveTab] = useState("mission");
  const features = [
    {
      icon: /* @__PURE__ */ jsx(FaTruck, { className: "text-3xl" }),
      title: "Fast Delivery",
      description: "Get your orders delivered within 24-48 hours across the country",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: /* @__PURE__ */ jsx(FaShieldAlt, { className: "text-3xl" }),
      title: "Secure Shopping",
      description: "100% secure payment processing with SSL encryption",
      color: "from-green-500 to-green-600"
    },
    {
      icon: /* @__PURE__ */ jsx(FaHeadset, { className: "text-3xl" }),
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to help you",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: /* @__PURE__ */ jsx(FaLeaf, { className: "text-3xl" }),
      title: "Eco-Friendly",
      description: "Committed to sustainable packaging and carbon-neutral shipping",
      color: "from-emerald-500 to-emerald-600"
    }
  ];
  const values = [
    {
      icon: /* @__PURE__ */ jsx(FaHeart, { className: "text-2xl" }),
      title: "Customer First",
      description: "Every decision we make is driven by our commitment to customer satisfaction"
    },
    {
      icon: /* @__PURE__ */ jsx(FiTrendingUp, { className: "text-2xl" }),
      title: "Innovation",
      description: "We continuously evolve and adopt new technologies to serve you better"
    },
    {
      icon: /* @__PURE__ */ jsx(FaHandshake, { className: "text-2xl" }),
      title: "Trust & Transparency",
      description: "We believe in honest communication and transparent business practices"
    },
    {
      icon: /* @__PURE__ */ jsx(FaUsers, { className: "text-2xl" }),
      title: "Community First",
      description: "We support local businesses and foster a thriving community of vendors"
    },
    {
      icon: /* @__PURE__ */ jsx(FiZap, { className: "text-2xl" }),
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service"
    },
    {
      icon: /* @__PURE__ */ jsx(FiSmile, { className: "text-2xl" }),
      title: "Joy of Shopping",
      description: "Making every shopping experience delightful and memorable"
    }
  ];
  const teamMembers = [
    {
      name: "Md. Karim Rahman",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years in e-commerce technology",
      image: "/team/ceo.jpg"
    },
    {
      name: "Fatema Akhter",
      role: "Head of Operations",
      bio: "Expert in supply chain management and logistics optimization",
      image: "/team/operations.jpg"
    },
    {
      name: "Rafiq Ahmed",
      role: "Lead Developer",
      bio: "Full-stack architect specializing in scalable e-commerce solutions",
      image: "/team/developer.jpg"
    },
    {
      name: "Rokeya Begum",
      role: "Customer Experience",
      bio: "Passionate about creating exceptional customer journeys",
      image: "/team/cx.jpg"
    }
  ];
  [
    {
      label: "Happy Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: /* @__PURE__ */ jsx(FaUsers, { className: "text-2xl" }),
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      label: "Orders Delivered",
      value: stats.totalOrders.toLocaleString(),
      icon: /* @__PURE__ */ jsx(FaRocket, { className: "text-2xl" }),
      color: "from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      label: "Vendors",
      value: stats.totalVendors.toLocaleString(),
      icon: /* @__PURE__ */ jsx(RiTeamFill, { className: "text-2xl" }),
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600"
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth?.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "About Us | HaatPoint",
        description: "Learn about HaatPoint, Bangladesh's premier online marketplace. Discover our mission, values, and how we connect customers with trusted vendors nationwide.",
        keywords: "about HaatPoint, online marketplace Bangladesh, about us, trusted online shopping",
        canonical: "https://www.haatpoint.com/aboutus",
        ogTitle: "About Us | HaatPoint",
        ogDescription: "Learn about HaatPoint, Bangladesh's premier online marketplace. Discover our mission, values, and how we connect customers with trusted vendors nationwide.",
        ogUrl: "https://www.haatpoint.com/aboutus",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About HaatPoint",
          url: "https://www.haatpoint.com/aboutus",
          description: "HaatPoint is Bangladesh's premier online marketplace connecting customers with quality products from trusted vendors across the country.",
          mainEntity: {
            "@type": "Organization",
            name: "HaatPoint",
            url: "https://www.haatpoint.com",
            logo: "https://www.haatpoint.com/og-image.png",
            foundingDate: "2024",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+8801319052507",
              contactType: "customer service",
              areaServed: "BD"
            }
          }
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-r from-marigold to-marigold-dark text-white overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", children: /* @__PURE__ */ jsxs("svg", { className: "w-full h-full", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
        /* @__PURE__ */ jsx("pattern", { id: "grid", width: "10", height: "10", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("path", { d: "M 10 0 L 0 0 0 10", fill: "none", stroke: "white", strokeWidth: "0.5" }) }),
        /* @__PURE__ */ jsx("rect", { width: "100", height: "100", fill: "url(#grid)" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6", children: [
          /* @__PURE__ */ jsx(FaHeart, { className: "text-red-500 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Welcome to Shop" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight", children: "Your Trusted Shopping Destination" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl opacity-90 mb-8 leading-relaxed max-w-2xl", children: "We're on a mission to revolutionize online shopping in Bangladesh by connecting customers with quality products at the best prices." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/products",
              className: "inline-flex items-center gap-2 px-8 py-3 bg-white text-ink font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105",
              children: [
                /* @__PURE__ */ jsx(FaStore, {}),
                "Start Shopping"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "#mission",
              className: "inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300",
              children: [
                "Learn More",
                /* @__PURE__ */ jsx(FiZap, {})
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-16", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "w-8 h-0.5 bg-marigold" }),
            "Our Story"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-ink mb-6", children: "Built with Passion, Driven by Purpose" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-text-soft leading-relaxed", children: [
            /* @__PURE__ */ jsx("p", { children: "Founded in 2024, Shop emerged from a simple idea: to create a seamless, trustworthy, and enjoyable online shopping experience for everyone in Bangladesh." }),
            /* @__PURE__ */ jsx("p", { children: "What started as a small initiative has grown into a vibrant marketplace connecting thousands of customers with quality products from trusted vendors across the country." }),
            /* @__PURE__ */ jsx("p", { children: "We believe that shopping should be more than just a transaction — it should be an experience. That's why we've built a platform that combines cutting-edge technology with human-centered design to make every purchase effortless and enjoyable." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "text-green-500 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: "Verified Products" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "100% authentic" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(FaLock, { className: "text-green-500 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: "Secure Payments" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "SSL encrypted" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(FaGlobe, { className: "text-green-500 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: "Nationwide" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "Delivery across BD" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(FaMobileAlt, { className: "text-green-500 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: "Mobile Friendly" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-text-soft", children: "Shop anywhere" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-marigold/10 to-marigold/5 rounded-2xl p-8 border border-marigold/20", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center text-8xl mb-6", children: /* @__PURE__ */ jsx(FaStore, { className: "text-marigold" }) }),
            /* @__PURE__ */ jsxs("blockquote", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-lg text-ink font-medium italic", children: `"We're not just building a marketplace — we're building trust, one happy customer at a time."` }),
              /* @__PURE__ */ jsx("footer", { className: "mt-4 text-text-soft", children: "— Md. Karim Rahman, CEO" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 w-24 h-24 bg-marigold/10 rounded-full blur-2xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-8 h-0.5 bg-marigold" }),
            "Core Principles"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-ink", children: "What Drives Us" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mb-8 bg-paper-dim rounded-xl p-1 border border-line max-w-md mx-auto", children: [
          { id: "mission", label: "Mission" },
          { id: "values", label: "Values" },
          { id: "team", label: "Team" }
        ].map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab.id),
            className: `flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? "bg-gray-900 text-white shadow-md" : "text-text-soft hover:text-ink hover:bg-paper-dim/80"}`,
            children: tab.label
          },
          tab.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-line shadow-hard-sm p-6 sm:p-8", children: [
          activeTab === "mission" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-paper-dim rounded-xl", children: [
                /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-marigold/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FaRocket, { className: "text-2xl text-marigold" }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-2", children: "Our Mission" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "To democratize online shopping by making quality products accessible and affordable for every Bangladeshi." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-paper-dim rounded-xl", children: [
                /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FaEye, { className: "text-2xl text-green-600" }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-2", children: "Our Vision" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "To become Bangladesh's most trusted and beloved e-commerce platform, known for quality, reliability, and exceptional service." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-paper-dim rounded-xl", children: [
                /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(RiCustomerService2Fill, { className: "text-2xl text-purple-600" }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-2", children: "Our Promise" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "To treat every customer like family, ensuring satisfaction at every step of their shopping journey." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-paper-dim rounded-xl p-6 border border-line", children: [
              /* @__PURE__ */ jsxs("h4", { className: "font-bold text-ink mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FaClock, { className: "text-marigold" }),
                "What We're Working On"
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-text-soft", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(FaCheckCircle, { className: "text-green-500 mt-1 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "Expanding our product categories with more local and international brands" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(FaCheckCircle, { className: "text-green-500 mt-1 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "Building a community of 10,000+ trusted vendors across Bangladesh" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(FaCheckCircle, { className: "text-green-500 mt-1 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { children: "Reducing delivery times to under 12 hours in major cities" })
                ] })
              ] })
            ] })
          ] }),
          activeTab === "values" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: values.map((value, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-start gap-4 p-4 rounded-xl hover:bg-paper-dim transition-colors group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center group-hover:bg-marigold/20 transition-colors flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "text-marigold", children: value.icon }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-1", children: value.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: value.description })
                ] })
              ]
            },
            index
          )) }),
          activeTab === "team" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-text-soft text-center mb-8 max-w-2xl mx-auto", children: "Meet the passionate team behind Shop — dedicated professionals working together to create the best shopping experience." }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: teamMembers.map((member, index) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "text-center p-6 rounded-xl hover:bg-paper-dim transition-all duration-300 group",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto bg-gradient-to-br from-marigold/20 to-marigold/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx("div", { className: "text-4xl text-marigold", children: member.name.charAt(0) }) }),
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-ink mb-1", children: member.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-marigold", children: member.role }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mt-2", children: member.bio })
                ]
              },
              index
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-8 h-0.5 bg-marigold" }),
            "Why Choose Us"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-ink", children: "Our Commitment to You" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: features.map((feature, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group p-6 bg-white rounded-2xl border border-line hover:shadow-xl transition-all duration-300 hover:-translate-y-2",
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`, children: feature.icon }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-ink mb-2", children: feature.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft leading-relaxed", children: feature.description })
            ]
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white text-center border border-white/10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold mb-4", children: "Ready to Experience the Difference?" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg opacity-90 mb-6 max-w-2xl mx-auto", children: "Join thousands of happy customers and start your shopping journey with us today." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/products",
              className: "inline-flex items-center gap-2 px-8 py-3 bg-marigold hover:bg-marigold-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105",
              children: [
                /* @__PURE__ */ jsx(FaStore, {}),
                "Explore Products"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/contact",
              className: "inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsx(FaHeadset, {}),
                "Contact Us"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  AboutUs as default
};
