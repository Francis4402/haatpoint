import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useState, useRef, useEffect, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { FaCheckCircle, FaArrowLeft, FaPaperPlane, FaExclamationCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaHeadset, FaComments, FaQuestionCircle } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { A as AppLayout, S as SeoHead } from "./SeoHead-COgQIxAt.js";
import { useForm, Link } from "@inertiajs/react";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
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
const ContactUsPage = ({ auth, wishlist, flash }) => {
  const [errors, setErrors] = useState({});
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const { data, setData, post, processing, reset, wasSuccessful } = useForm({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    subject: "",
    message: ""
  });
  const isLoggedIn = !!auth.user;
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (wasSuccessful) {
      setShowSuccessModal(true);
      reset("subject", "message");
      setErrors({});
    }
  }, [wasSuccessful]);
  useEffect(() => {
    if (flash?.success) {
      setShowSuccessModal(true);
    }
  }, [flash]);
  const contactInfo = {
    phone: "01319052507",
    address: "Chittagong, TeriBazar",
    workingHours: "Monday - Thursday: 12:00 AM - 8:00 PM\nSaturday: 10:00 AM - 4:00 PM\nFriday: Closed",
    socialMedia: {
      facebook: "https://facebook.com/multivendor"
    }
  };
  const faqs = [
    {
      id: 1,
      question: "How long does it take to get a response?",
      answer: "We typically respond within 24 hours during business days. For urgent matters, please call our support line for immediate assistance."
    },
    {
      id: 2,
      question: "What information should I include in my message?",
      answer: "Please include your order number (if applicable), a detailed description of your issue, and any relevant screenshots or documents that can help us understand your concern better."
    },
    {
      id: 3,
      question: "Can I track my support ticket?",
      answer: "Yes! Once you submit a ticket, you'll receive a confirmation email with a ticket number that you can use to track the status of your request through our support portal."
    },
    {
      id: 4,
      question: "What are your business hours?",
      answer: "Our customer support team is available Monday through Friday from 9:00 AM to 6:00 PM, and Saturdays from 10:00 AM to 4:00 PM. Emergency support is available 24/7 for critical issues."
    },
    {
      id: 5,
      question: "Do you offer phone support?",
      answer: "Yes, we offer phone support for urgent matters. You can reach us at +880 1234-567890 during business hours. For non-urgent inquiries, we recommend using the contact form for faster processing."
    },
    {
      id: 6,
      question: "How can I become a seller on your platform?",
      answer: "Visit our 'Become a Seller' page to apply. You'll need to provide business documentation, complete a verification process, and agree to our terms and conditions. Our onboarding team will guide you through the process."
    }
  ];
  const departments = [
    {
      id: 1,
      name: "Customer Support",
      email: "support@multivendor.com",
      phone: "+880 1234-567891",
      description: "For order issues, returns, and general inquiries",
      icon: /* @__PURE__ */ jsx(FaHeadset, { className: "h-6 w-6" })
    },
    {
      id: 2,
      name: "Technical Support",
      email: "tech@multivendor.com",
      phone: "+880 1234-567892",
      description: "For website issues and technical problems",
      icon: /* @__PURE__ */ jsx(FaComments, { className: "h-6 w-6" })
    },
    {
      id: 3,
      name: "Seller Support",
      email: "sellers@multivendor.com",
      phone: "+880 1234-567893",
      description: "For seller account and store management",
      icon: /* @__PURE__ */ jsx(FaUser, { className: "h-6 w-6" })
    },
    {
      id: 4,
      name: "Business Inquiries",
      email: "business@multivendor.com",
      phone: "+880 1234-567894",
      description: "For partnership and business opportunities",
      icon: /* @__PURE__ */ jsx(FaQuestionCircle, { className: "h-6 w-6" })
    }
  ];
  const validateForm = () => {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!data.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!data.message.trim()) {
      newErrors.message = "Message is required";
    } else if (data.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (data.message.length > 400) {
      newErrors.message = "Message must not exceed 400 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    post(route("contact.store"), {
      preserveScroll: true,
      onError: (errors2) => {
        console.error("Form submission errors:", errors2);
      }
    });
  };
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "all"
        });
      }
      if (formRef.current) {
        gsap.from(formRef.current, {
          scrollTrigger: {
            trigger: formRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
            id: "formAnimation"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all"
        });
      }
      if (faqRef.current) {
        const faqItems = faqRef.current.querySelectorAll(".faq-item");
        gsap.set(faqItems, { y: 30, opacity: 0 });
        gsap.to(faqItems, {
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none reverse",
            id: "faqAnimation"
          },
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all"
        });
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isMounted]);
  useEffect(() => {
    if (isMounted) {
      ScrollTrigger.refresh();
    }
  }, [isMounted]);
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, wishlist, children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        title: "Contact Us",
        description: "Get in touch with our team. We're here to help you with any questions or concerns.",
        canonical: "https://www.haatpoint.com/contactus",
        ogTitle: "Contact Us | HaatPoint",
        ogDescription: "Get in touch with our team. We're here to help you with any questions or concerns.",
        ogUrl: "https://www.haatpoint.com/contactus"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-paper-dim py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx(Transition, { appear: true, show: showSuccessModal, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => setShowSuccessModal(false), children: [
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
            children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-line", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "h-8 w-8 text-green-600" }) }),
              /* @__PURE__ */ jsx(Dialog.Title, { as: "h3", className: "text-2xl font-bold text-ink mb-2", children: "Message Sent Successfully!" }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft mb-6", children: "Thank you for contacting us. We've received your message and will get back to you within 24 hours." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowSuccessModal(false),
                  className: "w-full px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105",
                  children: "Continue Browsing"
                }
              )
            ] }) })
          }
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { ref: headerRef, className: "flex justify-between items-end flex-wrap gap-4 mb-9", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "We're here to help" }),
          /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Get in Touch" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm mt-2 max-w-2xl", children: "Have questions? We're here to help! Reach out to our team and we'll respond as soon as possible." })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/",
            className: "font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-3 w-3" }),
              "Back to Home"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx("div", { ref: formRef, className: "bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-marigold/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaPaperPlane, { className: "h-6 w-6 text-marigold" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-ink", children: "Send us a Message" }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "Fill out the form below and we'll get back to you soon" })
            ] })
          ] }),
          flash?.error && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-5 w-5 text-red-600 flex-shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: flash.error })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-ink mb-2", children: "Your Name *" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsx(FaUser, { className: "h-5 w-5 text-text-soft" }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      id: "name",
                      value: data.name,
                      onChange: (e) => setData("name", e.target.value),
                      disabled: isLoggedIn,
                      className: `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${errors.name ? "border-red-300" : "border-line"} ${isLoggedIn ? "bg-paper-dim cursor-not-allowed" : "bg-white"}`,
                      placeholder: "John Doe"
                    }
                  )
                ] }),
                errors.name && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-4 w-4" }),
                  errors.name
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-ink mb-2", children: "Email Address *" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsx(FaEnvelope, { className: "h-5 w-5 text-text-soft" }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      id: "email",
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value),
                      disabled: isLoggedIn,
                      className: `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${errors.email ? "border-red-300" : "border-line"} ${isLoggedIn ? "bg-paper-dim cursor-not-allowed" : "bg-white"}`,
                      placeholder: "john@example.com"
                    }
                  )
                ] }),
                errors.email && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-4 w-4" }),
                  errors.email
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "subject", className: "block text-sm font-medium text-ink mb-2", children: "Subject *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "subject",
                  value: data.subject,
                  onChange: (e) => setData("subject", e.target.value),
                  className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${errors.subject ? "border-red-300" : "border-line"} bg-white`,
                  placeholder: "What is this regarding?"
                }
              ),
              errors.subject && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-4 w-4" }),
                errors.subject
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-ink mb-2", children: "Your Message *" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  value: data.message,
                  onChange: (e) => setData("message", e.target.value),
                  rows: 6,
                  maxLength: 400,
                  className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors resize-none ${errors.message ? "border-red-300" : "border-line"} bg-white`,
                  placeholder: "Please provide detailed information about your inquiry..."
                }
              ),
              errors.message && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-600 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaExclamationCircle, { className: "h-4 w-4" }),
                errors.message
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-text-soft flex justify-end", children: [
                data.message.length,
                " / 400 characters"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "w-full py-4 bg-gray-900 hover:bg-marigold text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105",
                children: processing ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
                  /* @__PURE__ */ jsx("div", { className: "h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                  "Sending..."
                ] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
                  /* @__PURE__ */ jsx(FaPaperPlane, { className: "h-5 w-5" }),
                  "Send Message"
                ] })
              }
            ) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm p-8 text-white border border-line sticky top-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-8", children: "Contact Information" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FaPhone, { className: "h-6 w-6 text-marigold" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-1", children: "Phone" }),
                /* @__PURE__ */ jsx("a", { href: `tel:${contactInfo.phone}`, className: "hover:text-marigold transition-colors", children: contactInfo.phone })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "h-6 w-6 text-marigold" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-1", children: "Address" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: contactInfo.address })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FaClock, { className: "h-6 w-6 text-marigold" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-1", children: "Working Hours" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-300 whitespace-pre-line", children: contactInfo.workingHours })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-gray-700", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-4", children: "Follow Us" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: contactInfo.socialMedia.facebook,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "h-12 w-12 rounded-full bg-white/10 hover:bg-marigold/20 flex items-center justify-center transition-colors hover:scale-110 duration-300",
                children: /* @__PURE__ */ jsx(FaFacebook, { className: "h-6 w-6" })
              }
            ) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Direct Support" }),
          /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Get Direct Support" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-2 max-w-2xl mx-auto", children: "Contact specific departments for specialized assistance with your inquiries" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: departments.map((dept) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "group bg-white rounded-xl shadow-hard-sm p-6 hover:shadow-xl transition-all duration-300 border border-line cursor-pointer hover:-translate-y-1",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-marigold/10 group-hover:bg-marigold/20 flex items-center justify-center text-marigold transition-colors duration-300", children: dept.icon }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-ink mb-2", children: dept.name }),
                /* @__PURE__ */ jsx("p", { className: "text-text-soft text-sm mb-3", children: dept.description }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaEnvelope, { className: "h-4 w-4 text-text-soft" }),
                    /* @__PURE__ */ jsx("a", { href: `mailto:${dept.email}`, className: "text-marigold hover:text-marigold-dark transition-colors", children: dept.email })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(FaPhone, { className: "h-4 w-4 text-text-soft" }),
                    /* @__PURE__ */ jsx("a", { href: `tel:${dept.phone}`, className: "text-text-soft hover:text-marigold transition-colors", children: dept.phone })
                  ] })
                ] })
              ] })
            ] })
          },
          dept.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: faqRef, className: "mt-16 bg-white rounded-2xl shadow-hard-sm border border-line p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsx(Eyebrow, { children: "Quick Answers" }),
          /* @__PURE__ */ jsx("h2", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Frequently Asked Questions" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-2", children: "Find quick answers to common questions" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: faqs.map((faq) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "faq-item border border-line rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md",
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveFAQ(activeFAQ === faq.id ? null : faq.id),
                  className: "w-full px-6 py-4 text-left flex items-center justify-between bg-paper-dim hover:bg-marigold/5 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-ink", children: faq.question }),
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: `w-5 h-5 text-text-soft transform transition-transform ${activeFAQ === faq.id ? "rotate-180" : ""}`,
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                      }
                    )
                  ]
                }
              ),
              activeFAQ === faq.id && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-t border-line", children: /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: faq.answer }) })
            ]
          },
          faq.id
        )) }) })
      ] })
    ] }) })
  ] });
};
export {
  ContactUsPage as default
};
