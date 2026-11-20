import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    FaFileContract,
    FaUserCheck,
    FaShoppingBag,
    FaStore,
    FaCreditCard,
    FaGavel,
    FaShieldAlt,
    FaEnvelope,
    FaCheckCircle,
    FaExclamationTriangle,
    FaExchangeAlt,
    FaBan,
    FaTruck,
    FaBoxes,
    FaUndoAlt,
    FaRobot,
    FaSearch,
    FaQuestionCircle,
    FaInfoCircle,
    FaCheck,
    FaTimes,
    FaPhoneAlt
} from 'react-icons/fa';
import SeoHead from '@/Components/SeoHead';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface TermsOfServiceProps {
    auth: {
        user: any;
    };
    wishlist: any;
}

interface TermItem {
    id: string;
    category: 'general' | 'exchange' | 'buyer' | 'seller' | 'safety' | 'payment';
    icon: React.ReactNode;
    title: string;
    badge?: string;
    highlight?: boolean;
    content: string | { subtitle: string; text: string; note?: string }[];
}

const TermsOfService = ({ auth, wishlist }: TermsOfServiceProps) => {
    const lastUpdated = "October 2026";
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const categories = [
        { id: 'all', label: 'All Terms' },
        { id: 'exchange', label: '🔄 Exchange Policy (No Return)' },
        { id: 'buyer', label: '🛍️ Buyer Responsibilities' },
        { id: 'seller', label: '🏪 Seller & Agent Rules' },
        { id: 'safety', label: '🛡️ Content & Safety Bot' },
        { id: 'payment', label: '💳 Payments & Delivery' },
    ];

    const terms: TermItem[] = [
        {
            id: 'exchange-policy',
            category: 'exchange',
            icon: <FaExchangeAlt className="w-5 h-5" />,
            title: 'No Cash Return & Damage-on-Delivery Replacement Policy',
            badge: 'Strict Policy',
            highlight: true,
            content: [
                {
                    subtitle: '1. Strictly No Cash Returns / No Cash Refunds',
                    text: 'All sales on HaatPoint are strictly non-refundable and non-returnable for cash, bKash, Nagad, mobile banking, or bank transfers once an order is delivered and received. We do not issue cash refunds under any circumstance.',
                    note: 'Please verify all product images, sizes, colors, and descriptions carefully before placing an order.'
                },
                {
                    subtitle: '2. Product Change Only for the Exact Same Product',
                    text: 'We exclusively provide a product change / replacement for the exact same product if and only if the item was damaged when delivered. We do not accept exchanges for different products, different categories, or different models.'
                },
                {
                    subtitle: '3. Condition: Product Must Be Damaged When Delivered',
                    text: 'To be eligible for a replacement, the product must have arrived damaged during delivery/transit. You must inspect the package at the time of delivery in front of the courier rider and report any physical damage, breakage, or tear within 24 hours of delivery.'
                },
                {
                    subtitle: '4. Mandatory Photo & Unboxing Video Evidence',
                    text: 'To verify that the product was damaged upon delivery, the customer must provide clear photographs and an unboxing video showing the damaged product alongside the courier delivery parcel label with the tracking barcode.'
                },
                {
                    subtitle: '5. 100% Free Replacement Delivery for Damaged Items',
                    text: 'When damage upon delivery is verified, HaatPoint and the seller will dispatch a brand-new unit of the exact same product to your delivery address with 100% free delivery. The customer will not bear any extra courier or replacement charges.'
                },
                {
                    subtitle: '6. Ineligible Requests (No Change of Mind)',
                    text: 'No product returns, refunds, or exchanges will be accepted for: (a) change of mind or personal dislike, (b) sizing or color change after receiving an undamaged parcel, (c) items damaged after delivery due to customer use, washing, or wear, (d) claims submitted without courier delivery damage proof.'
                }
            ]
        },
        {
            id: 'acceptance',
            category: 'general',
            icon: <FaCheckCircle className="w-5 h-5" />,
            title: 'Acceptance of Terms & Platform Role',
            content: 'By accessing, browsing, registering, or shopping on HaatPoint, you expressly agree to be bound by these Terms and Conditions and all applicable laws of the People\'s Republic of Bangladesh. HaatPoint operates as a multivendor marketplace connecting verified independent merchants, stores, and agents with online shoppers. HaatPoint provides the digital infrastructure, order handling, and payment mediation to facilitate secure commerce.'
        },
        {
            id: 'buyer-responsibilities',
            category: 'buyer',
            icon: <FaShoppingBag className="w-5 h-5" />,
            title: 'Buyer Responsibilities & Order Guidelines',
            content: [
                {
                    subtitle: 'Accurate Delivery Information',
                    text: 'Buyers must provide an accurate recipient name, delivery address, active Bangladeshi mobile contact number, and district to prevent failed courier deliveries.'
                },
                {
                    subtitle: 'Delivery Inspection upon Arrival',
                    text: 'Customers are strongly advised to inspect parcel packaging in the presence of the delivery courier rider. If the outer parcel appears heavily damaged, crushed, or tampered with, take a clear photo/unboxing video and report it immediately.'
                },
                {
                    subtitle: 'Order Confirmation & Cancellation',
                    text: 'Orders may be cancelled free of charge only before the seller dispatches the package to the courier service. Once a consignment tracking number is generated and handed to the courier, the order cannot be cancelled.'
                },
                {
                    subtitle: 'Fair Use & Non-Abuse of Exchange',
                    text: 'Attempting to exchange worn, stained, washed, or altered goods, or repeatedly declining delivery without valid reason, may lead to account restrictions or permanent blacklisting from Cash-on-Delivery (COD) services.'
                }
            ]
        },
        {
            id: 'seller-obligations',
            category: 'seller',
            icon: <FaStore className="w-5 h-5" />,
            title: 'Seller & Agent Standards & Obligations',
            content: [
                {
                    subtitle: 'Accurate Product Listings',
                    text: 'Merchants and agents must provide genuine, non-misleading descriptions, precise specifications, actual product photos, and accurate stock availability.'
                },
                {
                    subtitle: 'Timely Order Fulfillment',
                    text: 'Sellers must dispatch confirmed customer orders within 24 to 48 hours. Delayed fulfillment negatively impacts seller ratings and may result in listing de-prioritization.'
                },
                {
                    subtitle: 'Mandatory Exchange Fulfillment',
                    text: 'Sellers are obligated to honor valid exchange requests within 48 hours of receiving the returned item. Refusal to honor legitimate exchange requests violates our Merchant Agreement and triggers store suspension.'
                },
                {
                    subtitle: 'Platform Commission & Subscription Tiers',
                    text: 'Sellers agree to platform sales commission schedules (7% for active Pro Sellers, 10% for Free Sellers). Free sellers may list up to 150 products; Pro sellers enjoy unlimited product listings (up to 500 active catalogue limit).'
                }
            ]
        },
        {
            id: 'safety-and-moderation',
            category: 'safety',
            icon: <FaRobot className="w-5 h-5" />,
            title: 'Automated Content Moderation Bot & Prohibited Products',
            badge: 'AI Safety Bot',
            content: [
                {
                    subtitle: 'Automated Bot Scanning & Zero Tolerance',
                    text: 'HaatPoint employs an automated content safety bot that continuously screens all product titles, descriptions, categories, and uploaded imagery. Products exhibiting adult content, nudity, sex toys, vulgar/offensive language, or hentai are automatically blocked from public display.'
                },
                {
                    subtitle: 'Prohibited Marketplace Items',
                    text: 'The following are strictly forbidden on HaatPoint: counterfeit/replica goods, illicit weapons, explosives, narcotics, unprescribed pharmaceuticals, adult/erotic products, hate speech, stolen property, and items infringing on registered trademarks or copyrights.'
                },
                {
                    subtitle: 'Seller Consequences for Violations',
                    text: 'Submitting prohibited listings will result in immediate automated product blocking, logging of diagnostic evidence in Admin review dashboards, and possible permanent store termination.'
                }
            ]
        },
        {
            id: 'payments-and-delivery',
            category: 'payment',
            icon: <FaCreditCard className="w-5 h-5" />,
            title: 'Pricing, Payments & Delivery Terms',
            content: [
                {
                    subtitle: 'Pricing & Transparent Markup',
                    text: 'All displayed product prices on HaatPoint include standard platform operational fees and markup. The total amount displayed at checkout is the final payable price for the product plus applicable courier delivery fees.'
                },
                {
                    subtitle: 'Accepted Payment Methods',
                    text: 'We accept Cash on Delivery (COD) across Bangladesh, alongside authorized digital mobile banking (bKash, Nagad, Rocket) and debit/credit cards through secure encrypted gateways.'
                },
                {
                    subtitle: 'Delivery Timelines Across Bangladesh',
                    text: 'Standard delivery takes 24 to 48 hours within Dhaka Metropolitan areas and 3 to 5 business days for locations outside Dhaka. Courier timelines may be subject to minor delays during major holidays (Eid, Puja) or severe weather.'
                },
                {
                    subtitle: 'Courier Delivery Fees',
                    text: 'Standard delivery fees are ৳70 within Dhaka and ৳130 outside Dhaka. Delivery fees are non-refundable once courier transit has been executed.'
                }
            ]
        },
        {
            id: 'intellectual-property',
            category: 'general',
            icon: <FaGavel className="w-5 h-5" />,
            title: 'Intellectual Property & Platform Rights',
            content: 'All trademarks, logos, service marks, graphics, designs, system source code, and content published on HaatPoint are the proprietary property of HaatPoint or its respective brand licensors. Any unauthorized copying, scraping, reproduction, or redistribution is strictly prohibited and subject to legal action under the Copyright Act of Bangladesh.'
        },
        {
            id: 'liability',
            category: 'general',
            icon: <FaShieldAlt className="w-5 h-5" />,
            title: 'Limitation of Liability & Dispute Resolution',
            content: 'HaatPoint acts as a mediator in good faith between buyers and independent vendors. To the maximum extent permitted by law, HaatPoint shall not be liable for indirect, punitive, or consequential damages resulting from store interactions. Any formal legal disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.'
        }
    ];

    const exchangeFaqs = [
        {
            q: "Can I return an item and get a cash or bKash refund?",
            a: "No. HaatPoint strictly operates on a No Cash Return policy. We do not provide cash, bKash, Nagad, or bank refunds under any circumstance."
        },
        {
            q: "Can I change an item for a different product or color?",
            a: "No. Product changes are only allowed for the exact same product, and only if the item arrived damaged when delivered."
        },
        {
            q: "What should I do if my product was damaged when delivered?",
            a: "Inspect your package upon delivery in the presence of the courier rider. If damaged, take clear photos and an unboxing video showing the damaged product and shipping label, and contact HaatPoint support within 24 hours. We will send you a brand-new replacement of the exact same product."
        },
        {
            q: "Who pays for courier delivery for a damaged product replacement?",
            a: "HaatPoint / the seller covers 100% of the courier costs for replacing products that were damaged on delivery. You do not pay any extra shipping charges."
        },
        {
            q: "Can I return or exchange an item if I change my mind?",
            a: "No. We do not accept returns or exchanges for change of mind, personal disinterest, or sizing preference after receiving an undamaged delivery."
        }
    ];

    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
            if (!searchTerm.trim()) return matchesCategory;

            const q = searchTerm.toLowerCase();
            const matchesTitle = term.title.toLowerCase().includes(q);
            let matchesContent = false;

            if (typeof term.content === 'string') {
                matchesContent = term.content.toLowerCase().includes(q);
            } else {
                matchesContent = term.content.some(
                    item => item.subtitle.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
                );
            }

            return matchesCategory && (matchesTitle || matchesContent);
        });
    }, [selectedCategory, searchTerm]);

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead
                title="Terms and Conditions & Exchange Policy - Haatpoint"
                description="Haatpoint terms of service and exchange policy. Learn about our strict no-return policy, 7-day product exchange guidelines, vendor standards, and customer protections in Bangladesh."
            />

            <div className="min-h-screen bg-paper-dim py-12 md:py-16">
                <div className="container max-w-[1140px] mx-auto px-4">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <div className="inline-flex justify-center mb-3">
                            <Eyebrow>Transparency & Marketplace Standards</Eyebrow>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-ink tracking-tight mb-4">
                            Terms of Service & <span className="text-marigold">Return Policy</span>
                        </h1>
                        <p className="text-text-soft text-sm sm:text-base leading-relaxed">
                            Welcome to HaatPoint. Please review our marketplace terms and our strict <strong>No Cash Return & Damage-on-Delivery Replacement Policy</strong> before shopping or selling on our platform.
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white border border-line rounded-full text-xs font-mono text-text-soft shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Official Terms · Updated for {lastUpdated}
                        </div>
                    </div>

                    {/* Important Highlight Banner: No Return - Exchange Only */}
                    <div className="mb-10 bg-gradient-to-r from-amber-500/10 via-marigold/15 to-orange-500/10 border-2 border-marigold/40 rounded-3xl p-6 sm:p-8 shadow-hard-sm relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-marigold/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-marigold flex items-center justify-center text-white shrink-0 shadow-md">
                                    <FaExchangeAlt className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                            <FaBan className="w-3 h-3" /> No Cash Returns
                                        </span>
                                        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                            <FaCheck className="w-3 h-3" /> Same Product Change Only
                                        </span>
                                        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                            <FaShieldAlt className="w-3 h-3" /> If Damaged On Delivery
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink">
                                        Strictly No Cash Returns · Same Product Change If Damaged On Delivery
                                    </h2>
                                    <p className="text-sm text-ink/80 mt-1.5 leading-relaxed max-w-2xl">
                                        HaatPoint strictly operates on a <strong>No Cash Return</strong> policy. We do not provide cash, bKash, or bank refunds. If an item arrives <strong>damaged when delivered</strong>, you are entitled to a <strong>100% free product replacement for the exact same product</strong>.
                                    </p>
                                </div>
                            </div>

                            <a
                                href="#exchange-policy"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 hover:scale-105"
                            >
                                <FaExchangeAlt className="w-3.5 h-3.5" />
                                View Replacement Policy
                            </a>
                        </div>
                    </div>

                    {/* 4-Step Exchange Process Infographic */}
                    <div className="mb-12 bg-white border border-line rounded-3xl p-6 sm:p-8 shadow-hard-sm">
                        <div className="text-center max-w-xl mx-auto mb-8">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-marigold-dark">
                                Clear 4-Step Process
                            </span>
                            <h3 className="text-xl sm:text-2xl font-display font-bold text-ink mt-1">
                                Damaged Product Replacement Process
                            </h3>
                            <p className="text-xs sm:text-sm text-text-soft mt-1">
                                Follow these 4 steps if your product arrived damaged upon delivery.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 rounded-2xl bg-paper-dim border border-line/60 flex flex-col justify-between">
                                <div>
                                    <div className="w-9 h-9 rounded-xl bg-marigold/15 text-marigold-dark font-mono font-bold text-sm flex items-center justify-center mb-3">
                                        01
                                    </div>
                                    <h4 className="font-bold text-sm text-ink mb-1">Inspect Upon Delivery</h4>
                                    <p className="text-xs text-text-soft leading-relaxed">
                                        Check parcel in front of the courier rider. If the item is damaged or broken, record photos and an unboxing video.
                                    </p>
                                </div>
                                <span className="text-[11px] font-mono text-marigold mt-3 font-semibold">Step 1 of 4</span>
                            </div>

                            <div className="p-5 rounded-2xl bg-paper-dim border border-line/60 flex flex-col justify-between">
                                <div>
                                    <div className="w-9 h-9 rounded-xl bg-marigold/15 text-marigold-dark font-mono font-bold text-sm flex items-center justify-center mb-3">
                                        02
                                    </div>
                                    <h4 className="font-bold text-sm text-ink mb-1">Report Within 24h</h4>
                                    <p className="text-xs text-text-soft leading-relaxed">
                                        Notify HaatPoint support with your Order ID, clear damage photos, and the parcel shipping label with tracking code.
                                    </p>
                                </div>
                                <span className="text-[11px] font-mono text-marigold mt-3 font-semibold">Step 2 of 4</span>
                            </div>

                            <div className="p-5 rounded-2xl bg-paper-dim border border-line/60 flex flex-col justify-between">
                                <div>
                                    <div className="w-9 h-9 rounded-xl bg-marigold/15 text-marigold-dark font-mono font-bold text-sm flex items-center justify-center mb-3">
                                        03
                                    </div>
                                    <h4 className="font-bold text-sm text-ink mb-1">Damage Verification</h4>
                                    <p className="text-xs text-text-soft leading-relaxed">
                                        Our support team verifies the delivery transit damage with the courier service and approves the same-product replacement.
                                    </p>
                                </div>
                                <span className="text-[11px] font-mono text-marigold mt-3 font-semibold">Step 3 of 4</span>
                            </div>

                            <div className="p-5 rounded-2xl bg-paper-dim border border-line/60 flex flex-col justify-between">
                                <div>
                                    <div className="w-9 h-9 rounded-xl bg-marigold/15 text-marigold-dark font-mono font-bold text-sm flex items-center justify-center mb-3">
                                        04
                                    </div>
                                    <h4 className="font-bold text-sm text-ink mb-1">Receive Same Product</h4>
                                    <p className="text-xs text-text-soft leading-relaxed">
                                        A brand-new replacement of the exact same product is promptly shipped and delivered to you with 100% free delivery.
                                    </p>
                                </div>
                                <span className="text-[11px] font-mono text-emerald-600 mt-3 font-semibold">Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Category Filter Toolbar */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full md:w-80">
                                <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search terms (e.g. exchange, return, delivery)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-paper-dim/40 text-ink placeholder:text-text-soft"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-soft hover:text-ink text-xs"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>

                            {/* Category Pills */}
                            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                            selectedCategory === cat.id
                                                ? 'bg-marigold text-white font-bold shadow-sm'
                                                : 'bg-paper-dim text-text-soft hover:text-ink hover:bg-neutral-200/60 border border-line/60'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terms Content Sections */}
                    <div className="space-y-6">
                        {filteredTerms.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-hard-sm">
                                <FaInfoCircle className="w-12 h-12 text-text-soft mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-ink">No Matching Terms Found</h3>
                                <p className="text-sm text-text-soft mt-1">
                                    No policy articles match "{searchTerm}". Try clearing your search.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                    className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-marigold transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            filteredTerms.map((term) => (
                                <div
                                    key={term.id}
                                    id={term.id}
                                    className={`bg-white rounded-2xl shadow-hard-sm border transition-all scroll-mt-24 ${
                                        term.highlight ? 'border-2 border-marigold/60 shadow-lg' : 'border-line'
                                    }`}
                                >
                                    {/* Section Header */}
                                    <div className={`p-5 sm:p-6 border-b border-line flex items-center justify-between gap-3 ${
                                        term.highlight ? 'bg-amber-500/10' : 'bg-paper-dim'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${
                                                term.highlight ? 'bg-marigold text-white shadow-sm' : 'bg-marigold/10 text-marigold'
                                            }`}>
                                                {term.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-display font-bold text-ink">
                                                    {term.title}
                                                </h2>
                                            </div>
                                        </div>

                                        {term.badge && (
                                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-marigold text-white shrink-0">
                                                {term.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Section Body */}
                                    <div className="p-6">
                                        {Array.isArray(term.content) ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {term.content.map((item, idx) => (
                                                    <div key={idx} className="space-y-1.5 p-4 rounded-xl bg-paper-dim/40 border border-line/40">
                                                        <h3 className="font-bold text-sm text-ink flex items-center gap-1.5">
                                                            <FaCheckCircle className="w-3.5 h-3.5 text-marigold shrink-0" />
                                                            {item.subtitle}
                                                        </h3>
                                                        <p className="text-text-soft text-xs sm:text-sm leading-relaxed">
                                                            {item.text}
                                                        </p>
                                                        {item.note && (
                                                            <p className="text-[11px] font-mono text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                                                                💡 {item.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-text-soft text-sm sm:text-base leading-relaxed">
                                                {term.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Frequently Asked Questions: Exchange & Returns */}
                    <div className="mt-12 bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-hard-sm">
                        <div className="text-center max-w-xl mx-auto mb-8">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-marigold-dark">
                                Clear Answers
                            </span>
                            <h3 className="text-xl sm:text-2xl font-display font-bold text-ink mt-1">
                                Exchange & Return FAQ
                            </h3>
                            <p className="text-xs sm:text-sm text-text-soft mt-1">
                                Quick answers to the most common questions about our exchange policy.
                            </p>
                        </div>

                        <div className="space-y-3 max-w-3xl mx-auto">
                            {exchangeFaqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className="border border-line rounded-2xl overflow-hidden transition-all"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-paper-dim/40 hover:bg-paper-dim transition-colors"
                                        >
                                            <span className="font-bold text-sm text-ink flex items-center gap-2.5">
                                                <FaQuestionCircle className="w-4 h-4 text-marigold shrink-0" />
                                                {faq.q}
                                            </span>
                                            <span className="text-lg font-bold text-text-soft shrink-0">
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="p-4 sm:p-5 pt-0 bg-paper-dim/40 border-t border-line/40 text-xs sm:text-sm text-text-soft leading-relaxed">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Agreement & Support Box */}
                    <div className="mt-12 bg-white rounded-3xl shadow-hard-sm border border-line p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="text-center lg:text-left">
                                <h3 className="text-xl font-display font-bold text-ink mb-1.5">
                                    Need Help With An Order or Exchange?
                                </h3>
                                <p className="text-text-soft text-sm max-w-xl">
                                    Our Bangladesh-based support team is here to assist you with order tracking, vendor mediation, and product exchange processing.
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap justify-center">
                                <Link
                                    href="/contactus"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105"
                                >
                                    <FaEnvelope className="w-3.5 h-3.5" />
                                    Contact Support
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-marigold hover:border-marigold font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Legal Notice */}
                    <div className="mt-8 text-center text-xs text-text-soft">
                        <p>
                            These terms are governed by the laws of the People's Republic of Bangladesh. All transactions, merchant settlements, and exchanges are mediated under applicable consumer rights standards.
                        </p>
                        <div className="flex justify-center gap-6 mt-3 text-xs">
                            <Link href="/privacy" className="text-text-soft hover:text-marigold transition-colors">
                                Privacy Policy
                            </Link>
                            <span>·</span>
                            <Link href="/sell" className="text-text-soft hover:text-marigold transition-colors">
                                Start Selling
                            </Link>
                            <span>·</span>
                            <Link href="/contactus" className="text-text-soft hover:text-marigold transition-colors">
                                Customer Helpdesk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TermsOfService;