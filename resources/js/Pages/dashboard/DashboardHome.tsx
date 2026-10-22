
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { FiPackage, FiShoppingCart, FiTrendingUp, FiUsers, FiPercent } from 'react-icons/fi'
import { Orders } from '@/types'
import FormatPrice from '../utils/FormatePrice'
import { BsFillPeopleFill } from 'react-icons/bs'
import RecentOrders from './recentOrders/RecentOrders'
import {
    FaTrophy,
    FaBoxOpen,
    FaStore,
    FaCrown,
    FaCheck,
    FaTimes,
    FaCopy,
    FaIdCard,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
} from 'react-icons/fa'
import AgentOnboardingChecklist from '@/Components/AgentOnboardingChecklist'

interface SubscriptionPayment {
    id: string;
    name: string;
    email: string;
    mobile?: string | null;
    address?: string | null;
    nationalId?: string | null;
    images?: string | null;
    trxId?: string | null;
    amount: number;
    months?: number;
    status: 'pending' | 'approved' | 'rejected';
    plan?: string;
    submittedAt?: string | null;
    registeredAt?: string | null;
    subscriptionEndsAt?: string | null;
}

interface dashboardhometypes {
    auth: {
        user: any;
    },
    totalUsers: number,
    orders: Orders[],
    userRole?: string,
    onboarding?: {
        vendorProfileComplete: boolean,
        hasStore: boolean,
        productsCount: number,
        storeCount: number,
    } | null,
    subscriptionPayments?: SubscriptionPayment[] | null,
    stats?: {
        totalProfit?: number,
        originalRevenue?: number,
        totalRevenue?: number,
        totalSells?: number,
        totalProductsSold?: number,
        conversionRate?: number,
        totalOrders?: number,
        deliveredPaidOrders?: number,
        deliveredOrders?: number,
        paidOrders?: number,
        cancelledOrders?: number,
        pendingOrders?: number,
        topProducts?: {
            name: string,
            qty: number,
            revenue: number,
            original?: number,
            profit?: number,
            image: string | null,
        }[],
    }
}

const DashboardHome = ({ auth, totalUsers, orders, stats, onboarding, subscriptionPayments }: dashboardhometypes) => {
    const userRole = auth?.user?.role;
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';
    const isAgent = userRole === 'agent';
    const isSuperadmin = userRole === 'superadmin';

    const conversionRate = stats?.conversionRate ?? 0;
    const topProducts = stats?.topProducts ?? [];

    const pendingPayments = (subscriptionPayments ?? []).filter((p) => p.status === 'pending');

    const approvePayment = (id: string) => {
        router.post(route('dashboard.subscription.approve', id), {}, { preserveScroll: true });
    };
    const rejectPayment = (id: string) => {
        router.post(route('dashboard.subscription.reject', id), {}, { preserveScroll: true });
    };

    const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
    const copyTrxId = async (trx: string) => {
        try {
            await navigator.clipboard.writeText(trx);
            setCopiedTrxId(trx);
            setTimeout(() => setCopiedTrxId(null), 2000);
        } catch {
            /* clipboard fallback */
        }
    };

    const paymentStatusBadge = (status: SubscriptionPayment['status']) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-700',
        } as const;
        return map[status] ?? 'bg-gray-100 text-gray-700';
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title='Dashboard'>
                <meta name="description" content="Multivendor Store Dashboard" />
                <meta name="keywords" content="dashboard, analytics, ecommerce" />
            </Head>

            <div className="space-y-6">
                {/* Agent onboarding checklist */}
                {isAgent && onboarding && (
                    <AgentOnboardingChecklist
                        vendorProfileComplete={onboarding.vendorProfileComplete}
                        hasStore={onboarding.hasStore}
                        productsCount={onboarding.productsCount}
                    />
                )}

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 text-white border border-line/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-extrabold uppercase tracking-[-0.01em] mb-2">
                                Welcome back, {auth.user.name}
                            </h1>
                            <p className="opacity-90 text-sm">Here's what's happening with your store today.</p>
                            <div className="mt-4 flex items-center">
                                <FiTrendingUp className="h-5 w-5 mr-2" />
                                <span className="text-sm">{stats?.totalOrders ?? 0} total orders • {stats?.deliveredOrders ?? 0} delivered</span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <FaTrophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                                <span className="text-xs font-mono uppercase tracking-wide">Good Job!</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Superadmin & Admin — bKash Pro payment verification & account activation */}
                {isAdmin && (
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink flex items-center gap-2">
                                    <FaCrown className="text-marigold" /> HaatPoint Pro Requests
                                </h3>
                                <p className="mt-1 text-sm text-text-soft">
                                    bKash transaction IDs and user info submitted by agents. Superadmin and Admin can verify the TrxID and confirm account permission to Pro.
                                </p>
                            </div>
                            <span className={`self-start sm:self-auto text-xs font-mono uppercase tracking-wide px-3 py-1 rounded-full font-bold ${pendingPayments.length > 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-green-100 text-green-800'}`}>
                                {pendingPayments.length} pending verification
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {subscriptionPayments && subscriptionPayments.length > 0 ? (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-paper-dim text-text-soft">
                                        <tr className="font-mono text-[10px] uppercase tracking-wide">
                                            <th className="px-6 py-3">Agent & Info</th>
                                            <th className="px-6 py-3">KYC Details</th>
                                            <th className="px-6 py-3">bKash TrxID</th>
                                            <th className="px-6 py-3">Amount</th>
                                            <th className="px-6 py-3">Submitted</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Admin Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line">
                                        {subscriptionPayments.map((p) => (
                                            <tr key={p.id} className="hover:bg-paper-dim/60 transition-colors">
                                                {/* Agent Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line bg-paper-dim">
                                                            {p.images ? (
                                                                <img
                                                                    src={`/storage/${p.images}`}
                                                                    alt={p.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center bg-marigold/10 text-xs font-bold text-ink">
                                                                    {p.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-ink">{p.name}</p>
                                                            <p className="text-xs text-text-soft">{p.email}</p>
                                                            {p.registeredAt && (
                                                                <p className="text-[11px] text-text-soft mt-0.5">
                                                                    Registered: {new Date(p.registeredAt).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* KYC / User Info */}
                                                <td className="px-6 py-4 text-xs text-ink/80 space-y-1">
                                                    <div className="flex items-center gap-1.5 text-text-soft">
                                                        <FaPhoneAlt className="h-3 w-3 shrink-0 text-marigold" />
                                                        <span className="font-mono text-ink font-semibold">{p.mobile || '—'}</span>
                                                    </div>
                                                    {p.nationalId && (
                                                        <div className="flex items-center gap-1.5 text-text-soft">
                                                            <FaIdCard className="h-3 w-3 shrink-0 text-blue-500" />
                                                            <span className="font-mono text-text-soft">NID: <strong className="text-ink">{p.nationalId}</strong></span>
                                                        </div>
                                                    )}
                                                    {p.address && (
                                                        <div className="flex items-center gap-1.5 text-text-soft max-w-[200px] truncate" title={p.address}>
                                                            <FaMapMarkerAlt className="h-3 w-3 shrink-0 text-red-500" />
                                                            <span className="truncate">{p.address}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* bKash Transaction ID */}
                                                <td className="px-6 py-4">
                                                    {p.trxId ? (
                                                        <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-mono font-bold text-amber-950 shadow-sm">
                                                            <span>{p.trxId}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyTrxId(p.trxId!)}
                                                                title="Copy TrxID"
                                                                className="text-amber-700 hover:text-amber-900 transition-colors"
                                                            >
                                                                {copiedTrxId === p.trxId ? (
                                                                    <FaCheck size={11} className="text-green-600" />
                                                                ) : (
                                                                    <FaCopy size={11} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="rounded bg-paper-dim px-2 py-1 text-xs italic text-text-soft">
                                                            Awaiting TrxID
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Amount */}
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-ink"><FormatPrice price={p.amount} /></p>
                                                    <span className="text-[10px] text-text-soft font-mono">
                                                        {p.months ? `${p.months} month${p.months > 1 ? 's' : ''}` : p.amount <= 100 ? '1 month' : '6 months'}
                                                    </span>
                                                </td>

                                                {/* Submitted date */}
                                                <td className="px-6 py-4 text-xs text-text-soft">
                                                    {p.submittedAt ? (
                                                        new Date(p.submittedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>

                                                {/* Status badge */}
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold ${paymentStatusBadge(p.status)}`}>
                                                        {p.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    {p.status === 'pending' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => approvePayment(p.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow"
                                                            >
                                                                <FaCheck className="h-3 w-3" /> Activate Pro
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => rejectPayment(p.id)}
                                                                className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : p.status === 'approved' ? (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                                                <FaCrown className="h-3 w-3 text-marigold" /> Pro Active
                                                            </span>
                                                            {p.subscriptionEndsAt && (
                                                                <span className="text-[11px] text-text-soft">
                                                                    Until {new Date(p.subscriptionEndsAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => approvePayment(p.id)}
                                                                className="mt-1 text-[11px] font-bold text-ink underline hover:text-marigold"
                                                            >
                                                                Extend (+6 Mo)
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-xs text-red-600 font-semibold">Rejected</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => approvePayment(p.id)}
                                                                className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-green-700"
                                                            >
                                                                Activate
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="px-6 py-10 text-center text-sm text-text-soft">
                                    No HaatPoint Pro payment requests yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                {(isAdmin || isAgent) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {/* Agent — what the agent earns (original price they set) */}
                        {isAgent && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Profit</h3>
                                        <p className="text-2xl font-bold text-ink mt-2"><FormatPrice price={stats?.originalRevenue ?? 0} /></p>
                                        <p className="text-xs text-text-soft mt-1">Your earnings (original price)</p>
                                    </div>
                                    <div className="bg-marigold/10 p-3 rounded-xl">
                                        <FiTrendingUp className="h-6 w-6 text-marigold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin — customer paid total */}
                        {isAdmin && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue</h3>
                                        <p className="text-2xl font-bold text-ink mt-2"><FormatPrice price={stats?.totalRevenue ?? 0} /></p>
                                        <p className="text-xs text-text-soft mt-1">Customer paid (delivered &amp; paid)</p>
                                    </div>
                                    <div className="bg-marigold/10 p-3 rounded-xl">
                                        <FiTrendingUp className="h-6 w-6 text-marigold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin — original (agent) price side */}
                        {isAdmin && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Original Price</h3>
                                        <p className="text-2xl font-bold text-ink mt-2"><FormatPrice price={stats?.originalRevenue ?? 0} /></p>
                                        <p className="text-xs text-text-soft mt-1">Agent prices (delivered &amp; paid)</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <FaBoxOpen className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin — the 10% platform profit */}
                        {isAdmin && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">10% Profit</h3>
                                        <p className="text-2xl font-bold text-ink mt-2"><FormatPrice price={stats?.totalProfit ?? 0} /></p>
                                        <p className="text-xs text-text-soft mt-1">Platform markup (delivered &amp; paid)</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-xl">
                                        <FiTrendingUp className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Sold — both roles */}
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Products Sold</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{stats?.totalProductsSold ?? 0}</p>
                                    <p className="text-xs text-text-soft mt-1">Units delivered</p>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-xl">
                                    <FaBoxOpen className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Conversion Rate</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{conversionRate}%</p>
                                    <p className="text-xs text-text-soft mt-1">{stats?.deliveredPaidOrders ?? 0} delivered & paid / {stats?.totalOrders ?? 0} orders</p>
                                </div>
                                <div className="bg-marigold/10 p-3 rounded-xl">
                                    <FiPercent className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{stats?.totalOrders ?? orders.length}</p>
                                    <p className="text-xs text-text-soft mt-1">Orders Placed</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <FiShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Users</h3>
                                    <p className="text-2xl font-bold text-ink mt-2">{totalUsers}</p>
                                    <p className="text-xs text-text-soft mt-1">Registered Users</p>
                                </div>
                                <div className="bg-marigold/10 p-3 rounded-xl">
                                    <BsFillPeopleFill className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts and Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Recent Orders</h3>
                                <p className="mt-1 text-sm text-text-soft">Latest orders from your store</p>
                            </div>
                            <Link
                                href={route('dashboard.orders')}
                                className="text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center"
                            >
                                View all →
                            </Link>
                        </div>

                        <RecentOrders orders={orders} user={auth.user} />
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Top Selling Products</h3>
                                <p className="mt-1 text-sm text-text-soft">Best performing products this month</p>
                            </div>
                            <Link
                                href={route('products.index')}
                                className="text-xs font-mono uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold hover:text-marigold transition-colors flex items-center"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="p-4">
                            <ul className="divide-y divide-line">
                                {topProducts.length > 0 ? (
                                    topProducts.map((product, index) => (
                                        <li key={product.name} className="py-4 hover:bg-paper-dim transition-colors rounded-lg px-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl font-bold text-sm ${
                                                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        index === 1 ? 'bg-gray-100 text-gray-800' :
                                                        index === 2 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-marigold/10 text-marigold'
                                                    }`}>
                                                        {index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : `#${index + 1}`}
                                                    </div>
                                                    <div className="ml-4">
                                                        <span className="text-sm font-medium text-ink">{product.name}</span>
                                                        <p className="text-xs text-text-soft">{product.qty.toLocaleString()} units sold</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {isAdmin ? (
                                                        <>
                                                            <p className="text-sm font-semibold text-ink"><FormatPrice price={product.original ?? product.revenue} /></p>
                                                            <p className="text-xs text-text-soft">
                                                                Original · <span className="text-marigold font-medium">+<FormatPrice price={product.profit ?? 0} /> (10%)</span>
                                                            </p>
                                                        </>
                                                    ) : isAgent ? (
                                                        <>
                                                            <p className="text-sm font-semibold text-ink"><FormatPrice price={product.original ?? product.revenue} /></p>
                                                            <p className="text-xs text-text-soft">Your revenue (original price)</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm font-semibold text-ink">{product.qty.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="py-8 text-center text-sm text-text-soft">
                                        No delivered products yet.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {(isAdmin || isAgent) && (
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        <div className="px-6 py-5 border-b border-line">
                            <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Quick Actions</h3>
                            <p className="mt-1 text-sm text-text-soft">Common tasks you might want to do</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={route('dashboard.products')}
                                    className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                                >
                                    <FiPackage className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-ink">Add Product</span>
                                    <span className="text-xs text-text-soft mt-1">Add new items</span>
                                </Link>
                                <Link
                                    href={route('dashboard.createstore')}
                                    className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                                >
                                    <FaStore className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-ink">Add Store</span>
                                    <span className="text-xs text-text-soft mt-1">Create a new store</span>
                                </Link>
                                {isAdmin ? (
                                    <Link
                                        href={route('dashboard.customers')}
                                        className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                                    >
                                        <FiUsers className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-ink">Add Customer</span>
                                        <span className="text-xs text-text-soft mt-1">Manage customers</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard.orders')}
                                        className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                                    >
                                        <FiShoppingCart className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium text-ink">Manage Orders</span>
                                        <span className="text-xs text-text-soft mt-1">View &amp; update orders</span>
                                    </Link>
                                )}
                                <Link
                                    href={route('dashboard.analytics')}
                                    className="flex flex-col items-center justify-center p-4 border border-line rounded-xl hover:border-marigold hover:bg-marigold/5 transition-all duration-300 hover:shadow-hard-sm group"
                                >
                                    <FiTrendingUp className="h-8 w-8 text-marigold mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-ink">View Reports</span>
                                    <span className="text-xs text-text-soft mt-1">Detailed analytics</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Summary */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                    <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4">Ordery Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
                                <span className="font-medium text-green-800">Delivered</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">{stats?.deliveredOrders ?? 0}</p>
                            <p className="text-xs text-text-soft">Orders delivered</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-800">Pending</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">{stats?.pendingOrders ?? 0}</p>
                            <p className="text-xs text-text-soft">Orders pending</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <FiUsers className="h-5 w-5 text-red-600 mr-2" />
                                <span className="font-medium text-red-800">Cancelled</span>
                            </div>
                            <p className="text-2xl font-bold text-ink mt-2">{stats?.cancelledOrders ?? 0}</p>
                            <p className="text-xs text-text-soft">Orders cancelled</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DashboardHome
