
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import {
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaLeaf,
  FaUsers,
  FaStore,
  FaHandshake,
  FaRocket,
  FaHeart,
  FaCheckCircle,
  FaClock,
  FaLock,
  FaGlobe,
  FaMobileAlt,
  FaEye
} from 'react-icons/fa';
import { FiZap, FiTrendingUp, FiSmile } from 'react-icons/fi';
import { RiTeamFill, RiCustomerService2Fill } from 'react-icons/ri';

interface AboutUsProps {
    auth?: {
        user?: any;
    };
    wishlist: any;
    stats?: {
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        totalVendors: number;
    };
}

const AboutUs = ({ auth, wishlist, stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalVendors: 0
} }: AboutUsProps) => {
    const [activeTab, setActiveTab] = useState<'mission' | 'values' | 'team'>('mission');

    // Features section
    const features = [
        {
            icon: <FaTruck className="text-3xl" />,
            title: 'Fast Delivery',
            description: 'Get your orders delivered within 24-48 hours across the country',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: 'Secure Shopping',
            description: '100% secure payment processing with SSL encryption',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: <FaHeadset className="text-3xl" />,
            title: '24/7 Support',
            description: 'Our dedicated support team is always ready to help you',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: <FaLeaf className="text-3xl" />,
            title: 'Eco-Friendly',
            description: 'Committed to sustainable packaging and carbon-neutral shipping',
            color: 'from-emerald-500 to-emerald-600',
        },
    ];

    // Values section
    const values = [
        {
            icon: <FaHeart className="text-2xl" />,
            title: 'Customer First',
            description: 'Every decision we make is driven by our commitment to customer satisfaction',
        },
        {
            icon: <FiTrendingUp className="text-2xl" />,
            title: 'Innovation',
            description: 'We continuously evolve and adopt new technologies to serve you better',
        },
        {
            icon: <FaHandshake className="text-2xl" />,
            title: 'Trust & Transparency',
            description: 'We believe in honest communication and transparent business practices',
        },
        {
            icon: <FaUsers className="text-2xl" />,
            title: 'Community First',
            description: 'We support local businesses and foster a thriving community of vendors',
        },
        {
            icon: <FiZap className="text-2xl" />,
            title: 'Excellence',
            description: 'We strive for excellence in every aspect of our service',
        },
        {
            icon: <FiSmile className="text-2xl" />,
            title: 'Joy of Shopping',
            description: 'Making every shopping experience delightful and memorable',
        },
    ];

    // Team members (would come from API in real app)
    const teamMembers = [
        {
            name: 'Md. Karim Rahman',
            role: 'CEO & Founder',
            bio: 'Visionary leader with 15+ years in e-commerce technology',
            image: '/team/ceo.jpg',
        },
        {
            name: 'Fatema Akhter',
            role: 'Head of Operations',
            bio: 'Expert in supply chain management and logistics optimization',
            image: '/team/operations.jpg',
        },
        {
            name: 'Rafiq Ahmed',
            role: 'Lead Developer',
            bio: 'Full-stack architect specializing in scalable e-commerce solutions',
            image: '/team/developer.jpg',
        },
        {
            name: 'Rokeya Begum',
            role: 'Customer Experience',
            bio: 'Passionate about creating exceptional customer journeys',
            image: '/team/cx.jpg',
        },
    ];

    // Statistics
    const displayStats = [
        {
            label: 'Happy Customers',
            value: stats.totalCustomers.toLocaleString(),
            icon: <FaUsers className="text-2xl" />,
            color: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            label: 'Orders Delivered',
            value: stats.totalOrders.toLocaleString(),
            icon: <FaRocket className="text-2xl" />,
            color: 'from-green-50 to-green-100',
            iconColor: 'text-green-600',
        },
        {
            label: 'Vendors',
            value: stats.totalVendors.toLocaleString(),
            icon: <RiTeamFill className="text-2xl" />,
            color: 'from-purple-50 to-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    return (
        <AppLayout user={auth?.user} wishlist={wishlist}>
            <SeoHead title="About Us | HaatPoint" description="Learn about HaatPoint, Bangladesh's premier online marketplace. Discover our mission, values, and how we connect customers with trusted vendors nationwide."
                keywords="about HaatPoint, online marketplace Bangladesh, about us, trusted online shopping"
                canonical="https://www.haatpoint.com/aboutus" ogTitle="About Us | HaatPoint"
                ogDescription="Learn about HaatPoint, Bangladesh's premier online marketplace. Discover our mission, values, and how we connect customers with trusted vendors nationwide."
                ogUrl="https://www.haatpoint.com/aboutus"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About HaatPoint',
                    url: 'https://www.haatpoint.com/aboutus',
                    description: "HaatPoint is Bangladesh's premier online marketplace connecting customers with quality products from trusted vendors across the country.",
                    mainEntity: {
                        '@type': 'Organization',
                        name: 'HaatPoint',
                        url: 'https://www.haatpoint.com',
                        logo: 'https://www.haatpoint.com/og-image.png',
                        foundingDate: '2024',
                        contactPoint: {
                            '@type': 'ContactPoint',
                            telephone: '+8801319052507',
                            contactType: 'customer service',
                            areaServed: 'BD',
                        },
                    },
                }}
            />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-marigold to-marigold-dark text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <FaHeart className="text-red-500 animate-pulse" />
                            <span className="text-sm font-medium">Welcome to Shop</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Your Trusted Shopping Destination
                        </h1>
                        <p className="text-xl opacity-90 mb-8 leading-relaxed max-w-2xl">
                            We're on a mission to revolutionize online shopping in Bangladesh by
                            connecting customers with quality products at the best prices.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-ink font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <FaStore />
                                Start Shopping
                            </Link>
                            <Link
                                href="#mission"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                Learn More
                                <FiZap />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>


            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Our Story */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-4">
                                <span className="w-8 h-0.5 bg-marigold"></span>
                                Our Story
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
                                Built with Passion, Driven by Purpose
                            </h2>
                            <div className="space-y-4 text-text-soft leading-relaxed">
                                <p>
                                    Founded in 2024, Shop emerged from a simple idea: to create
                                    a seamless, trustworthy, and enjoyable online shopping experience
                                    for everyone in Bangladesh.
                                </p>
                                <p>
                                    What started as a small initiative has grown into a vibrant
                                    marketplace connecting thousands of customers with quality
                                    products from trusted vendors across the country.
                                </p>
                                <p>
                                    We believe that shopping should be more than just a transaction —
                                    it should be an experience. That's why we've built a platform
                                    that combines cutting-edge technology with human-centered design
                                    to make every purchase effortless and enjoyable.
                                </p>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-500 mt-1" />
                                    <div>
                                        <div className="font-semibold text-ink">Verified Products</div>
                                        <div className="text-sm text-text-soft">100% authentic</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaLock className="text-green-500 mt-1" />
                                    <div>
                                        <div className="font-semibold text-ink">Secure Payments</div>
                                        <div className="text-sm text-text-soft">SSL encrypted</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaGlobe className="text-green-500 mt-1" />
                                    <div>
                                        <div className="font-semibold text-ink">Nationwide</div>
                                        <div className="text-sm text-text-soft">Delivery across BD</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaMobileAlt className="text-green-500 mt-1" />
                                    <div>
                                        <div className="font-semibold text-ink">Mobile Friendly</div>
                                        <div className="text-sm text-text-soft">Shop anywhere</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-marigold/10 to-marigold/5 rounded-2xl p-8 border border-marigold/20">
                                <div className="flex items-center justify-center text-8xl mb-6">
                                    <FaStore className="text-marigold" />
                                </div>
                                <blockquote className="text-center">
                                    <p className="text-lg text-ink font-medium italic">
                                        "We're not just building a marketplace — we're building trust,
                                        one happy customer at a time."
                                    </p>
                                    <footer className="mt-4 text-text-soft">
                                        — Md. Karim Rahman, CEO
                                    </footer>
                                </blockquote>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-marigold/10 rounded-full blur-2xl"></div>
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>

                {/* Mission & Values Tabs */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-2">
                            <span className="w-8 h-0.5 bg-marigold"></span>
                            Core Principles
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-ink">
                            What Drives Us
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-8 bg-paper-dim rounded-xl p-1 border border-line max-w-md mx-auto">
                        {[
                            { id: 'mission', label: 'Mission' },
                            { id: 'values', label: 'Values' },
                            { id: 'team', label: 'Team' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'text-text-soft hover:text-ink hover:bg-paper-dim/80'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl border border-line shadow-hard-sm p-6 sm:p-8">
                        {/* Mission Tab */}
                        {activeTab === 'mission' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-paper-dim rounded-xl">
                                        <div className="w-14 h-14 rounded-full bg-marigold/10 flex items-center justify-center mx-auto mb-4">
                                            <FaRocket className="text-2xl text-marigold" />
                                        </div>
                                        <h4 className="font-bold text-ink mb-2">Our Mission</h4>
                                        <p className="text-sm text-text-soft">
                                            To democratize online shopping by making quality products
                                            accessible and affordable for every Bangladeshi.
                                        </p>
                                    </div>
                                    <div className="text-center p-6 bg-paper-dim rounded-xl">
                                        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                            <FaEye className="text-2xl text-green-600" />
                                        </div>
                                        <h4 className="font-bold text-ink mb-2">Our Vision</h4>
                                        <p className="text-sm text-text-soft">
                                            To become Bangladesh's most trusted and beloved e-commerce
                                            platform, known for quality, reliability, and exceptional service.
                                        </p>
                                    </div>
                                    <div className="text-center p-6 bg-paper-dim rounded-xl">
                                        <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                            <RiCustomerService2Fill className="text-2xl text-purple-600" />
                                        </div>
                                        <h4 className="font-bold text-ink mb-2">Our Promise</h4>
                                        <p className="text-sm text-text-soft">
                                            To treat every customer like family, ensuring satisfaction
                                            at every step of their shopping journey.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-paper-dim rounded-xl p-6 border border-line">
                                    <h4 className="font-bold text-ink mb-3 flex items-center gap-2">
                                        <FaClock className="text-marigold" />
                                        What We're Working On
                                    </h4>
                                    <ul className="space-y-2 text-text-soft">
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span>Expanding our product categories with more local and international brands</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span>Building a community of 10,000+ trusted vendors across Bangladesh</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span>Reducing delivery times to under 12 hours in major cities</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Values Tab */}
                        {activeTab === 'values' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((value, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-paper-dim transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center group-hover:bg-marigold/20 transition-colors flex-shrink-0">
                                            <div className="text-marigold">{value.icon}</div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-ink mb-1">{value.title}</h4>
                                            <p className="text-sm text-text-soft">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Team Tab */}
                        {activeTab === 'team' && (
                            <div>
                                <p className="text-text-soft text-center mb-8 max-w-2xl mx-auto">
                                    Meet the passionate team behind Shop — dedicated professionals
                                    working together to create the best shopping experience.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {teamMembers.map((member, index) => (
                                        <div
                                            key={index}
                                            className="text-center p-6 rounded-xl hover:bg-paper-dim transition-all duration-300 group"
                                        >
                                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-marigold/20 to-marigold/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <div className="text-4xl text-marigold">
                                                    {member.name.charAt(0)}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-ink mb-1">{member.name}</h4>
                                            <p className="text-sm font-medium text-marigold">{member.role}</p>
                                            <p className="text-sm text-text-soft mt-2">{member.bio}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 text-marigold font-mono text-sm uppercase tracking-wider mb-2">
                            <span className="w-8 h-0.5 bg-marigold"></span>
                            Why Choose Us
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-ink">
                            Our Commitment to You
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-white rounded-2xl border border-line hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-ink mb-2">{feature.title}</h3>
                                <p className="text-sm text-text-soft leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white text-center border border-white/10">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to Experience the Difference?
                    </h2>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                        Join thousands of happy customers and start your shopping journey with us today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-marigold hover:bg-marigold-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <FaStore />
                            Explore Products
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                            <FaHeadset />
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AboutUs;
