// ContactUsPage.tsx
import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeadset,
  FaComments,
  FaQuestionCircle,
  FaArrowLeft,
} from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageProps } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import Eyebrow from "../Components/Eyebrow";
import SeoHead from "@/Components/SeoHead";

gsap.registerPlugin(ScrollTrigger);

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface Props extends PageProps {
  flash?: {
    success?: string;
    error?: string;
  };
}

const ContactUsPage = ({ auth, wishlist, flash }: Props) => {
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

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
      reset('subject', 'message');
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
      facebook: "https://facebook.com/multivendor",
    }
  };

  const faqs: FAQItem[] = [
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
      icon: <FaHeadset className="h-6 w-6" />
    },
    {
      id: 2,
      name: "Technical Support",
      email: "tech@multivendor.com",
      phone: "+880 1234-567892",
      description: "For website issues and technical problems",
      icon: <FaComments className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Seller Support",
      email: "sellers@multivendor.com",
      phone: "+880 1234-567893",
      description: "For seller account and store management",
      icon: <FaUser className="h-6 w-6" />
    },
    {
      id: 4,
      name: "Business Inquiries",
      email: "business@multivendor.com",
      phone: "+880 1234-567894",
      description: "For partnership and business opportunities",
      icon: <FaQuestionCircle className="h-6 w-6" />
    }
  ];

  const validateForm = () => {
    const newErrors: Partial<ContactForm> = {};

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    post(route('contact.store'), {
      preserveScroll: true,
      onError: (errors) => {
        console.error('Form submission errors:', errors);
      }
    });
  };

  // Initialize GSAP animations after component mounts
  useEffect(() => {
    if (!isMounted) return;

    // Give DOM time to render
    const timer = setTimeout(() => {
      // Refresh ScrollTrigger to ensure it picks up all elements
      ScrollTrigger.refresh();

      // Header animation
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

      // Form animation
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

      // FAQ animation
      if (faqRef.current) {
        const faqItems = faqRef.current.querySelectorAll('.faq-item');

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
      // Kill all ScrollTrigger animations
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isMounted]);

  // Re-run animations when component updates
  useEffect(() => {
    if (isMounted) {
      ScrollTrigger.refresh();
    }
  }, [isMounted]);

  const ContactCard = ({ info }: { info: any; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -8,
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
        className="contact-card group bg-white rounded-xl shadow-hard-sm p-6 hover:shadow-xl transition-all duration-300 border border-line cursor-pointer hover:-translate-y-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-marigold/10 group-hover:bg-marigold/20 flex items-center justify-center text-marigold transition-colors duration-300">
            {info.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-ink mb-2">{info.name}</h3>
            <p className="text-text-soft text-sm mb-3">{info.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="h-4 w-4 text-text-soft" />
                <a href={`mailto:${info.email}`} className="text-marigold hover:text-marigold-dark transition-colors">
                  {info.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="h-4 w-4 text-text-soft" />
                <a href={`tel:${info.phone}`} className="text-text-soft hover:text-marigold transition-colors">
                  {info.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <SeoHead title="Contact Us" description="Get in touch with our team. We're here to help you with any questions or concerns."
        canonical="https://www.haatpoint.com/contactus" ogTitle="Contact Us | HaatPoint"
        ogDescription="Get in touch with our team. We're here to help you with any questions or concerns." ogUrl="https://www.haatpoint.com/contactus" />

      <div className="min-h-screen bg-paper-dim py-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Modal */}
          <Transition appear show={showSuccessModal} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-line">
                      <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                          <FaCheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <Dialog.Title as="h3" className="text-2xl font-bold text-ink mb-2">
                          Message Sent Successfully!
                        </Dialog.Title>
                        <p className="text-text-soft mb-6">
                          Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                        </p>
                        <button
                          onClick={() => setShowSuccessModal(false)}
                          className="w-full px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                          Continue Browsing
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Header */}
          <div ref={headerRef} className="flex justify-between items-end flex-wrap gap-4 mb-9">
            <div>
              <Eyebrow>We're here to help</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Get in Touch</h1>
              <p className="text-text-soft text-sm mt-2 max-w-2xl">
                Have questions? We're here to help! Reach out to our team and we'll respond as soon as possible.
              </p>
            </div>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors flex items-center gap-2"
            >
              <FaArrowLeft className="h-3 w-3" />
              Back to Home
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div ref={formRef} className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-full bg-marigold/10 flex items-center justify-center">
                      <FaPaperPlane className="h-6 w-6 text-marigold" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-ink">Send us a Message</h2>
                      <p className="text-text-soft">Fill out the form below and we'll get back to you soon</p>
                    </div>
                  </div>

                  {flash?.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <FaExclamationCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{flash.error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                          Your Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <FaUser className="h-5 w-5 text-text-soft" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={isLoggedIn}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${
                              errors.name ? 'border-red-300' : 'border-line'
                            } ${isLoggedIn ? 'bg-paper-dim cursor-not-allowed' : 'bg-white'}`}
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FaExclamationCircle className="h-4 w-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <FaEnvelope className="h-5 w-5 text-text-soft" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={isLoggedIn}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${
                              errors.email ? 'border-red-300' : 'border-line'
                            } ${isLoggedIn ? 'bg-paper-dim cursor-not-allowed' : 'bg-white'}`}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FaExclamationCircle className="h-4 w-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors ${
                          errors.subject ? 'border-red-300' : 'border-line'
                        } bg-white`}
                        placeholder="What is this regarding?"
                      />
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <FaExclamationCircle className="h-4 w-4" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        rows={6}
                        maxLength={400}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent transition-colors resize-none ${
                          errors.message ? 'border-red-300' : 'border-line'
                        } bg-white`}
                        placeholder="Please provide detailed information about your inquiry..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <FaExclamationCircle className="h-4 w-4" />
                          {errors.message}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-text-soft flex justify-end">
                        {data.message.length} / 400 characters
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-gray-900 hover:bg-marigold text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
                      >
                        {processing ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm p-8 text-white border border-line sticky top-6">
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                <div className="space-y-8 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="h-6 w-6 text-marigold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Phone</h3>
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-marigold transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="h-6 w-6 text-marigold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Address</h3>
                      <p className="text-gray-300">{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0">
                      <FaClock className="h-6 w-6 text-marigold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                      <p className="text-gray-300 whitespace-pre-line">{contactInfo.workingHours}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a
                      href={contactInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/10 hover:bg-marigold/20 flex items-center justify-center transition-colors hover:scale-110 duration-300"
                    >
                      <FaFacebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Departments Section - NO ANIMATIONS */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <Eyebrow>Direct Support</Eyebrow>
              <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Get Direct Support</h2>
              <p className="text-text-soft mt-2 max-w-2xl mx-auto">
                Contact specific departments for specialized assistance with your inquiries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="group bg-white rounded-xl shadow-hard-sm p-6 hover:shadow-xl transition-all duration-300 border border-line cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-marigold/10 group-hover:bg-marigold/20 flex items-center justify-center text-marigold transition-colors duration-300">
                      {dept.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-ink mb-2">{dept.name}</h3>
                      <p className="text-text-soft text-sm mb-3">{dept.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="h-4 w-4 text-text-soft" />
                          <a href={`mailto:${dept.email}`} className="text-marigold hover:text-marigold-dark transition-colors">
                            {dept.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaPhone className="h-4 w-4 text-text-soft" />
                          <a href={`tel:${dept.phone}`} className="text-text-soft hover:text-marigold transition-colors">
                            {dept.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={faqRef} className="mt-16 bg-white rounded-2xl shadow-hard-sm border border-line p-8">
            <div className="text-center mb-10">
              <Eyebrow>Quick Answers</Eyebrow>
              <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Frequently Asked Questions</h2>
              <p className="text-text-soft mt-2">Find quick answers to common questions</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="faq-item border border-line rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between bg-paper-dim hover:bg-marigold/5 transition-colors"
                    >
                      <span className="font-semibold text-ink">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-text-soft transform transition-transform ${
                          activeFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeFAQ === faq.id && (
                      <div className="px-6 py-4 border-t border-line">
                        <p className="text-text-soft">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactUsPage;
