
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
    FaExclamationTriangle
} from 'react-icons/fa';
import SeoHead from '@/Components/SeoHead';

interface TermsOfServiceProps {
    auth: {
        user: any;
    };
    wishlist: any;
}

const TermsOfService = ({ auth, wishlist }: TermsOfServiceProps) => {
    const lastUpdated = "January 1, 2024";

    const terms = [
        {
            id: 'acceptance',
            icon: <FaCheckCircle className="w-5 h-5" />,
            title: 'Acceptance of Terms',
            content: 'By using Haatpoint, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time.'
        },
        {
            id: 'user-accounts',
            icon: <FaUserCheck className="w-5 h-5" />,
            title: 'User Accounts',
            content: [
                {
                    subtitle: 'Registration',
                    text: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.'
                },
                {
                    subtitle: 'Account Security',
                    text: 'You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.'
                },
                {
                    subtitle: 'Age Requirement',
                    text: 'You must be at least 18 years old to create an account and make purchases on our platform.'
                },
                {
                    subtitle: 'Account Termination',
                    text: 'We reserve the right to suspend or terminate accounts that violate our terms or engage in fraudulent activities.'
                }
            ]
        },
        {
            id: 'buyer-responsibilities',
            icon: <FaShoppingBag className="w-5 h-5" />,
            title: 'Buyer Responsibilities',
            content: [
                {
                    subtitle: 'Accurate Information',
                    text: 'Provide accurate shipping addresses and contact information to ensure successful delivery.'
                },
                {
                    subtitle: 'Order Confirmation',
                    text: 'Review and confirm your orders carefully before completing purchase. Orders cannot be changed after confirmation.'
                },
                {
                    subtitle: 'Payment',
                    text: 'Ensure you have sufficient funds or credit to complete your purchases. All payments must be made in full.'
                },
                {
                    subtitle: 'Returns & Refunds',
                    text: 'Review our return policy before making a purchase. Returns must be initiated within the specified timeframe.'
                }
            ]
        },
        {
            id: 'seller-obligations',
            icon: <FaStore className="w-5 h-5" />,
            title: 'Seller Obligations',
            content: [
                {
                    subtitle: 'Product Listings',
                    text: 'Sellers must provide accurate product descriptions, pricing, and images. Misleading listings may result in account suspension.'
                },
                {
                    subtitle: 'Order Fulfillment',
                    text: 'Sellers must process and ship orders within the stated timeframe. Timely shipping is essential for customer satisfaction.'
                },
                {
                    subtitle: 'Customer Service',
                    text: 'Sellers must respond to customer inquiries and resolve issues professionally and promptly.'
                },
                {
                    subtitle: 'Quality Standards',
                    text: 'All products must meet quality standards and be as described in the listing.'
                }
            ]
        },
        {
            id: 'payments',
            icon: <FaCreditCard className="w-5 h-5" />,
            title: 'Payments & Fees',
            content: [
                {
                    subtitle: 'Transaction Fees',
                    text: 'We charge a transaction fee on each successful sale. Fees are deducted automatically from the payment.'
                },
                {
                    subtitle: 'Payment Processing',
                    text: 'All payments are processed through secure payment gateways. We do not store your payment information.'
                },
                {
                    subtitle: 'Refunds',
                    text: 'Refunds are processed through the original payment method within 5-10 business days.'
                },
                {
                    subtitle: 'Dispute Resolution',
                    text: 'Any payment disputes must be reported within 30 days of the transaction date.'
                }
            ]
        },
        {
            id: 'prohibited-items',
            icon: <FaExclamationTriangle className="w-5 h-5" />,
            title: 'Prohibited Items',
            content: 'The following items are strictly prohibited on our platform: illegal products, counterfeit goods, weapons, drugs, adult content, hate speech materials, stolen property, items that infringe on intellectual property rights, and any items that violate local or international laws.'
        },
        {
            id: 'intellectual-property',
            icon: <FaGavel className="w-5 h-5" />,
            title: 'Intellectual Property',
            content: 'All content on our platform, including logos, images, text, and design, is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.'
        },
        {
            id: 'liability',
            icon: <FaShieldAlt className="w-5 h-5" />,
            title: 'Limitation of Liability',
            content: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our liability is limited to the maximum extent permitted by law. We do not guarantee the accuracy of seller listings or the quality of products sold.'
        }
    ];

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead title="Terms of Service" description="Read HaatPoint's terms and conditions governing your use of our marketplace, purchases, and interactions with vendors." canonical="https://www.haatpoint.com/terms-and-conditions" />

            <div className="min-h-screen bg-paper-dim py-20">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-marigold/10 mb-4">
                            <FaFileContract className="w-10 h-10 text-marigold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Terms of Service</h1>
                        <p className="text-text-soft max-w-2xl mx-auto">
                            Please read these terms carefully before using our platform. By using our services, you agree to these terms.
                        </p>
                        <p className="text-sm text-text-soft mt-2">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8 overflow-x-auto">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {terms.map((term) => (
                                <a
                                    key={term.id}
                                    href={`#${term.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-soft hover:text-marigold hover:bg-marigold/5 rounded-lg transition-colors border border-transparent hover:border-marigold/20"
                                >
                                    {term.icon}
                                    <span className="hidden sm:inline">{term.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        {terms.map((term) => (
                            <div
                                key={term.id}
                                id={term.id}
                                className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden scroll-mt-24"
                            >
                                <div className="p-6 border-b border-line bg-paper-dim">
                                    <div className="flex items-center gap-3">
                                        <div className="text-marigold">{term.icon}</div>
                                        <h2 className="text-xl font-bold text-ink">{term.title}</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {Array.isArray(term.content) ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {term.content.map((item, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <h3 className="font-semibold text-ink">{item.subtitle}</h3>
                                                    <p className="text-text-soft text-sm leading-relaxed">{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-text-soft text-sm leading-relaxed">{term.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Agreement Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-hard-sm border border-line p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-ink mb-2">Agreement to Terms</h3>
                                <p className="text-text-soft">
                                    By continuing to use our platform, you agree to all terms and conditions outlined above.
                                </p>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <Link
                                    href="/contactus"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaEnvelope className="w-4 h-4" />
                                    Contact Us
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-line text-text-soft hover:text-marigold hover:border-marigold rounded-lg transition-all duration-300"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-text-soft">
                            These terms are governed by the laws of Bangladesh. Any disputes will be resolved in the courts of Bangladesh.
                        </p>
                        <div className="flex justify-center gap-6 mt-4 text-sm">
                            <Link href="/privacy" className="text-text-soft hover:text-marigold transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/" className="text-text-soft hover:text-marigold transition-colors">
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TermsOfService;
