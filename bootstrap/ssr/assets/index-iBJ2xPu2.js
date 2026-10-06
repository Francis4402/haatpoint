import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { FaShieldAlt, FaEnvelope, FaDatabase, FaShareAlt, FaLock, FaCookie, FaUserSecret } from "react-icons/fa";
import "./Navbar-I09bUsbF.js";
import "react";
import "react-icons/fi";
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
const PrivacyPolicy = ({ auth, wishlist }) => {
  const lastUpdated = "January 1, 2024";
  const sections = [
    {
      id: "information-collection",
      icon: /* @__PURE__ */ jsx(FaDatabase, { className: "w-5 h-5" }),
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you register, make a purchase, or interact with our platform, we collect information such as your name, email address, phone number, shipping address, and payment details."
        },
        {
          subtitle: "Account Information",
          text: "Your username, password, and account preferences are stored to provide you with a personalized experience."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about how you interact with our website, including pages visited, time spent, and products viewed."
        },
        {
          subtitle: "Device Information",
          text: "We collect information about your device, browser type, IP address, and operating system to optimize your experience."
        }
      ]
    },
    {
      id: "how-we-use",
      icon: /* @__PURE__ */ jsx(FaShareAlt, { className: "w-5 h-5" }),
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Order Processing",
          text: "To process your orders, manage payments, and deliver products to your doorstep."
        },
        {
          subtitle: "Personalization",
          text: "To recommend products, personalize your shopping experience, and show relevant content."
        },
        {
          subtitle: "Communication",
          text: "To send order updates, promotional offers, and important notifications about your account."
        },
        {
          subtitle: "Improvement",
          text: "To analyze usage patterns and improve our services, products, and user experience."
        }
      ]
    },
    {
      id: "information-sharing",
      icon: /* @__PURE__ */ jsx(FaShareAlt, { className: "w-5 h-5" }),
      title: "Information Sharing",
      content: [
        {
          subtitle: "Sellers",
          text: "When you make a purchase, we share necessary order details with the seller to fulfill your order."
        },
        {
          subtitle: "Service Providers",
          text: "We share information with trusted third-party service providers who assist us in operating our platform (payment processing, shipping, analytics)."
        },
        {
          subtitle: "Legal Compliance",
          text: "We may disclose information when required by law, court order, or to protect our rights and safety."
        }
      ]
    },
    {
      id: "data-security",
      icon: /* @__PURE__ */ jsx(FaLock, { className: "w-5 h-5" }),
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "We use SSL/TLS encryption to protect your data during transmission."
        },
        {
          subtitle: "Secure Storage",
          text: "Your personal information is stored on secure servers with access controls and monitoring."
        },
        {
          subtitle: "Payment Security",
          text: "All payment transactions are processed through PCI-DSS compliant payment gateways."
        }
      ]
    },
    {
      id: "cookies",
      icon: /* @__PURE__ */ jsx(FaCookie, { className: "w-5 h-5" }),
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "Required for basic functionality like shopping cart and login sessions."
        },
        {
          subtitle: "Analytics Cookies",
          text: "Help us understand how visitors interact with our website to improve user experience."
        },
        {
          subtitle: "Marketing Cookies",
          text: "Used to deliver relevant advertisements and track marketing campaign performance."
        },
        {
          subtitle: "Your Choice",
          text: "You can manage cookie preferences through your browser settings at any time."
        }
      ]
    },
    {
      id: "user-rights",
      icon: /* @__PURE__ */ jsx(FaUserSecret, { className: "w-5 h-5" }),
      title: "Your Rights",
      content: [
        {
          subtitle: "Access",
          text: "You can request access to the personal data we hold about you."
        },
        {
          subtitle: "Correction",
          text: "You can update or correct your personal information at any time."
        },
        {
          subtitle: "Deletion",
          text: "You can request the deletion of your account and associated data."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt-out of marketing communications at any time."
        }
      ]
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: "Privacy Policy", description: "Read HaatPoint's privacy policy to understand how we collect, use, and protect your personal information when you shop on our marketplace.", canonical: "https://www.haatpoint.com/privacy-policy" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-marigold/10 mb-4", children: /* @__PURE__ */ jsx(FaShieldAlt, { className: "w-10 h-10 text-marigold" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-ink mb-4", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft max-w-2xl mx-auto", children: "Your privacy matters to us. Learn how we collect, use, and protect your personal information." }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft mt-2", children: [
          "Last Updated: ",
          lastUpdated
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8 overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 justify-center", children: sections.map((section) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: `#${section.id}`,
          className: "inline-flex items-center gap-2 px-4 py-2 text-sm text-text-soft hover:text-marigold hover:bg-marigold/5 rounded-lg transition-colors border border-transparent hover:border-marigold/20",
          children: [
            section.icon,
            section.title
          ]
        },
        section.id
      )) }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sections.map((section, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          id: section.id,
          className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden scroll-mt-24",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-line bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-marigold", children: section.icon }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-ink", children: section.title })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: section.content.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-ink", children: item.subtitle }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm leading-relaxed", children: item.text })
            ] }, idx)) }) })
          ]
        },
        section.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 bg-white rounded-2xl shadow-hard-sm border border-line p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "Questions About Privacy?" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "If you have any questions about our privacy policy, please contact us." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/contactus",
            className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(FaEnvelope, { className: "w-4 h-4" }),
              "Contact Us"
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "This privacy policy applies to all users of our platform. By using our services, you agree to this policy." }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-6 mt-4 text-sm", children: [
          /* @__PURE__ */ jsx(Link, { href: "/terms", className: "text-text-soft hover:text-marigold transition-colors", children: "Terms of Service" }),
          /* @__PURE__ */ jsx(Link, { href: "/", className: "text-text-soft hover:text-marigold transition-colors", children: "Home" })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  PrivacyPolicy as default
};
