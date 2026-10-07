
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FaShieldAlt, FaLock, FaUserSecret, FaCookie, FaEnvelope, FaDatabase, FaShareAlt, FaGlobe } from 'react-icons/fa';
import SeoHead from '@/Components/SeoHead';

interface PrivacyPolicyProps {
    auth: {
        user: any;
    };
    wishlist: any;
}

const PrivacyPolicy = ({ auth, wishlist }: PrivacyPolicyProps) => {
    const lastUpdated = "January 1, 2024";

    const sections = [
        {
            id: 'information-collection',
            icon: <FaDatabase className="w-5 h-5" />,
            title: 'Information We Collect',
            content: [
                {
                    subtitle: 'Personal Information',
                    text: 'When you register, make a purchase, or interact with our platform, we collect information such as your name, email address, phone number, shipping address, and payment details.'
                },
                {
                    subtitle: 'Account Information',
                    text: 'Your username, password, and account preferences are stored to provide you with a personalized experience.'
                },
                {
                    subtitle: 'Usage Data',
                    text: 'We automatically collect information about how you interact with our website, including pages visited, time spent, and products viewed.'
                },
                {
                    subtitle: 'Device Information',
                    text: 'We collect information about your device, browser type, IP address, and operating system to optimize your experience.'
                }
            ]
        },
        {
            id: 'how-we-use',
            icon: <FaShareAlt className="w-5 h-5" />,
            title: 'How We Use Your Information',
            content: [
                {
                    subtitle: 'Order Processing',
                    text: 'To process your orders, manage payments, and deliver products to your doorstep.'
                },
                {
                    subtitle: 'Personalization',
                    text: 'To recommend products, personalize your shopping experience, and show relevant content.'
                },
                {
                    subtitle: 'Communication',
                    text: 'To send order updates, promotional offers, and important notifications about your account.'
                },
                {
                    subtitle: 'Improvement',
                    text: 'To analyze usage patterns and improve our services, products, and user experience.'
                }
            ]
        },
        {
            id: 'information-sharing',
            icon: <FaShareAlt className="w-5 h-5" />,
            title: 'Information Sharing',
            content: [
                {
                    subtitle: 'Sellers',
                    text: 'When you make a purchase, we share necessary order details with the seller to fulfill your order.'
                },
                {
                    subtitle: 'Service Providers',
                    text: 'We share information with trusted third-party service providers who assist us in operating our platform (payment processing, shipping, analytics).'
                },
                {
                    subtitle: 'Legal Compliance',
                    text: 'We may disclose information when required by law, court order, or to protect our rights and safety.'
                }
            ]
        },
        {
            id: 'data-security',
            icon: <FaLock className="w-5 h-5" />,
            title: 'Data Security',
            content: [
                {
                    subtitle: 'Encryption',
                    text: 'We use SSL/TLS encryption to protect your data during transmission.'
                },
                {
                    subtitle: 'Secure Storage',
                    text: 'Your personal information is stored on secure servers with access controls and monitoring.'
                },
                {
                    subtitle: 'Payment Security',
                    text: 'All payment transactions are processed through PCI-DSS compliant payment gateways.'
                }
            ]
        },
        {
            id: 'cookies',
            icon: <FaCookie className="w-5 h-5" />,
            title: 'Cookies and Tracking',
            content: [
                {
                    subtitle: 'Essential Cookies',
                    text: 'Required for basic functionality like shopping cart and login sessions.'
                },
                {
                    subtitle: 'Analytics Cookies',
                    text: 'Help us understand how visitors interact with our website to improve user experience.'
                },
                {
                    subtitle: 'Marketing Cookies',
                    text: 'Used to deliver relevant advertisements and track marketing campaign performance.'
                },
                {
                    subtitle: 'Your Choice',
                    text: 'You can manage cookie preferences through your browser settings at any time.'
                }
            ]
        },
        {
            id: 'user-rights',
            icon: <FaUserSecret className="w-5 h-5" />,
            title: 'Your Rights',
            content: [
                {
                    subtitle: 'Access',
                    text: 'You can request access to the personal data we hold about you.'
                },
                {
                    subtitle: 'Correction',
                    text: 'You can update or correct your personal information at any time.'
                },
                {
                    subtitle: 'Deletion',
                    text: 'You can request the deletion of your account and associated data.'
                },
                {
                    subtitle: 'Opt-Out',
                    text: 'You can opt-out of marketing communications at any time.'
                }
            ]
        }
    ];

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead />

            <div className="min-h-screen bg-paper-dim py-20">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-marigold/10 mb-4">
                            <FaShieldAlt className="w-10 h-10 text-marigold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Privacy Policy</h1>
                        <p className="text-text-soft max-w-2xl mx-auto">
                            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-text-soft mt-2">
                            Last Updated: {lastUpdated}
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8 overflow-x-auto">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-soft hover:text-marigold hover:bg-marigold/5 rounded-lg transition-colors border border-transparent hover:border-marigold/20"
                                >
                                    {section.icon}
                                    {section.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden scroll-mt-24"
                            >
                                <div className="p-6 border-b border-line bg-paper-dim">
                                    <div className="flex items-center gap-3">
                                        <div className="text-marigold">{section.icon}</div>
                                        <h2 className="text-xl font-bold text-ink">{section.title}</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.content.map((item, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <h3 className="font-semibold text-ink">{item.subtitle}</h3>
                                                <p className="text-text-soft text-sm leading-relaxed">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-hard-sm border border-line p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-ink mb-2">Questions About Privacy?</h3>
                                <p className="text-text-soft">
                                    If you have any questions about our privacy policy, please contact us.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href="/contactus"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                                >
                                    <FaEnvelope className="w-4 h-4" />
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-text-soft">
                            This privacy policy applies to all users of our platform. By using our services, you agree to this policy.
                        </p>
                        <div className="flex justify-center gap-6 mt-4 text-sm">
                            <Link href="/terms" className="text-text-soft hover:text-marigold transition-colors">
                                Terms of Service
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

export default PrivacyPolicy;
