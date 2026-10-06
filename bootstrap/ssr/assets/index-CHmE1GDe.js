import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { FaFileContract, FaEnvelope, FaCheckCircle, FaUserCheck, FaShoppingBag, FaStore, FaCreditCard, FaExclamationTriangle, FaGavel, FaShieldAlt } from "react-icons/fa";
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
const TermsOfService = ({ auth, wishlist }) => {
  const lastUpdated = "January 1, 2024";
  const terms = [
    {
      id: "acceptance",
      icon: /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-5 h-5" }),
      title: "Acceptance of Terms",
      content: "By using Haatpoint, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time."
    },
    {
      id: "user-accounts",
      icon: /* @__PURE__ */ jsx(FaUserCheck, { className: "w-5 h-5" }),
      title: "User Accounts",
      content: [
        {
          subtitle: "Registration",
          text: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials."
        },
        {
          subtitle: "Account Security",
          text: "You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized use."
        },
        {
          subtitle: "Age Requirement",
          text: "You must be at least 18 years old to create an account and make purchases on our platform."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate accounts that violate our terms or engage in fraudulent activities."
        }
      ]
    },
    {
      id: "buyer-responsibilities",
      icon: /* @__PURE__ */ jsx(FaShoppingBag, { className: "w-5 h-5" }),
      title: "Buyer Responsibilities",
      content: [
        {
          subtitle: "Accurate Information",
          text: "Provide accurate shipping addresses and contact information to ensure successful delivery."
        },
        {
          subtitle: "Order Confirmation",
          text: "Review and confirm your orders carefully before completing purchase. Orders cannot be changed after confirmation."
        },
        {
          subtitle: "Payment",
          text: "Ensure you have sufficient funds or credit to complete your purchases. All payments must be made in full."
        },
        {
          subtitle: "Returns & Refunds",
          text: "Review our return policy before making a purchase. Returns must be initiated within the specified timeframe."
        }
      ]
    },
    {
      id: "seller-obligations",
      icon: /* @__PURE__ */ jsx(FaStore, { className: "w-5 h-5" }),
      title: "Seller Obligations",
      content: [
        {
          subtitle: "Product Listings",
          text: "Sellers must provide accurate product descriptions, pricing, and images. Misleading listings may result in account suspension."
        },
        {
          subtitle: "Order Fulfillment",
          text: "Sellers must process and ship orders within the stated timeframe. Timely shipping is essential for customer satisfaction."
        },
        {
          subtitle: "Customer Service",
          text: "Sellers must respond to customer inquiries and resolve issues professionally and promptly."
        },
        {
          subtitle: "Quality Standards",
          text: "All products must meet quality standards and be as described in the listing."
        }
      ]
    },
    {
      id: "payments",
      icon: /* @__PURE__ */ jsx(FaCreditCard, { className: "w-5 h-5" }),
      title: "Payments & Fees",
      content: [
        {
          subtitle: "Transaction Fees",
          text: "We charge a transaction fee on each successful sale. Fees are deducted automatically from the payment."
        },
        {
          subtitle: "Payment Processing",
          text: "All payments are processed through secure payment gateways. We do not store your payment information."
        },
        {
          subtitle: "Refunds",
          text: "Refunds are processed through the original payment method within 5-10 business days."
        },
        {
          subtitle: "Dispute Resolution",
          text: "Any payment disputes must be reported within 30 days of the transaction date."
        }
      ]
    },
    {
      id: "prohibited-items",
      icon: /* @__PURE__ */ jsx(FaExclamationTriangle, { className: "w-5 h-5" }),
      title: "Prohibited Items",
      content: "The following items are strictly prohibited on our platform: illegal products, counterfeit goods, weapons, drugs, adult content, hate speech materials, stolen property, items that infringe on intellectual property rights, and any items that violate local or international laws."
    },
    {
      id: "intellectual-property",
      icon: /* @__PURE__ */ jsx(FaGavel, { className: "w-5 h-5" }),
      title: "Intellectual Property",
      content: "All content on our platform, including logos, images, text, and design, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission."
    },
    {
      id: "liability",
      icon: /* @__PURE__ */ jsx(FaShieldAlt, { className: "w-5 h-5" }),
      title: "Limitation of Liability",
      content: "We are not liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our liability is limited to the maximum extent permitted by law. We do not guarantee the accuracy of seller listings or the quality of products sold."
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(SeoHead, { title: "Terms of Service", description: "Read HaatPoint's terms and conditions governing your use of our marketplace, purchases, and interactions with vendors.", canonical: "https://www.haatpoint.com/terms-and-conditions" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-marigold/10 mb-4", children: /* @__PURE__ */ jsx(FaFileContract, { className: "w-10 h-10 text-marigold" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-ink mb-4", children: "Terms of Service" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft max-w-2xl mx-auto", children: "Please read these terms carefully before using our platform. By using our services, you agree to these terms." }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft mt-2", children: [
          "Last Updated: ",
          lastUpdated
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8 overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 justify-center", children: terms.map((term) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: `#${term.id}`,
          className: "inline-flex items-center gap-2 px-4 py-2 text-sm text-text-soft hover:text-marigold hover:bg-marigold/5 rounded-lg transition-colors border border-transparent hover:border-marigold/20",
          children: [
            term.icon,
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: term.title })
          ]
        },
        term.id
      )) }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: terms.map((term) => /* @__PURE__ */ jsxs(
        "div",
        {
          id: term.id,
          className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden scroll-mt-24",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-line bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-marigold", children: term.icon }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-ink", children: term.title })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "p-6", children: Array.isArray(term.content) ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: term.content.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-ink", children: item.subtitle }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm leading-relaxed", children: item.text })
            ] }, idx)) }) : /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm leading-relaxed", children: term.content }) })
          ]
        },
        term.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 bg-white rounded-2xl shadow-hard-sm border border-line p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-ink mb-2", children: "Agreement to Terms" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "By continuing to use our platform, you agree to all terms and conditions outlined above." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/contactus",
              className: "inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105",
              children: [
                /* @__PURE__ */ jsx(FaEnvelope, { className: "w-4 h-4" }),
                "Contact Us"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/",
              className: "inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-marigold hover:border-marigold rounded-lg transition-all duration-300",
              children: "Back to Home"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: "These terms are governed by the laws of Bangladesh. Any disputes will be resolved in the courts of Bangladesh." }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-6 mt-4 text-sm", children: [
          /* @__PURE__ */ jsx(Link, { href: "/privacy", className: "text-text-soft hover:text-marigold transition-colors", children: "Privacy Policy" }),
          /* @__PURE__ */ jsx(Link, { href: "/", className: "text-text-soft hover:text-marigold transition-colors", children: "Home" })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  TermsOfService as default
};
