import { useState, useEffect, Fragment } from 'react';
import { OrderItem, Orders } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Menu, Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import {
    IoChevronDown,
    IoClose,
    IoCartOutline,
    IoPersonOutline,
    IoLocationOutline,
    IoPricetagOutline,
    IoTimeOutline,
    IoRefreshOutline,
    IoLockClosed,
    IoReceiptOutline
} from 'react-icons/io5';
import { MdPayment, MdOutlineTrackChanges } from 'react-icons/md';
import {
    FaBox,
    FaWeightHanging,
    FaTruck,
    FaCreditCard,
    FaSearch,
    FaCheck,
    FaTimes
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BiPhone } from 'react-icons/bi';
import DashboardLayout from '@/Layouts/DashboardLayout';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface AdminOrderProps {
    auth: {
        user: any;
    };
    orders: (Orders & {
        order_items?: OrderItem[];
    })[];
    pagination: {
        page: number;
        lastPage: number;
        perPage: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search: string;
        status: string;
        payment: string;
    };
    statusCounts: Record<string, number>;
    /** Server-computed revenue (paid, non-cancelled, role-scoped). */
    revenue: number;
    /** Per-order edit rules resolved by the server, keyed by order id. */
    orderRules: Record<
        string,
        {
            canEdit: boolean;
            reason: string | null;
            orderStatus: string[];
            paymentStatus: string[];
            orderStatusLocked: boolean;
            paymentStatusLocked: boolean;
            paymentStatusLockedReason: string | null;
        }
    >;
    flash?: { success?: string | null; error?: string | null };
}

interface UpdatingState {
    id: string;
    field: 'payment_status' | 'order_status';
}

type StatusField = 'payment_status' | 'order_status';
type StatusOption = { value: string; label: string; color: string };

const PAYMENT_STATUS_OPTIONS: StatusOption[] = [
    { value: 'pending',  label: 'Pending',  color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid',     label: 'Paid',     color: 'bg-green-100 text-green-800'  },
    { value: 'failed',   label: 'Failed',   color: 'bg-red-100 text-red-800'      },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800'    },
];

const ORDER_STATUS_OPTIONS: StatusOption[] = [
    { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed',  label: 'Confirmed',  color: 'bg-indigo-100 text-indigo-800'},
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800'    },
    { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800'},
    { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800'  },
    { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800'      },
    { value: 'returned',   label: 'Returned',   color: 'bg-gray-100 text-gray-800'    },
];

const badgeFor = (status: string, type: 'payment' | 'order') => {
    const options = type === 'payment' ? PAYMENT_STATUS_OPTIONS : ORDER_STATUS_OPTIONS;
    return options.find(opt => opt.value === status)?.color ?? 'bg-gray-100 text-gray-800';
};

const labelFor = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const humanize = (value: string) => (value || '').replace(/_/g, ' ');

/**
 * order_items.product_image stores paths like `product_images/x.jpg` relative
 * to the public disk, which would otherwise resolve against the page URL.
 */
const resolveItemImage = (raw?: string | null): string => {
    if (!raw) return '';
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    if (raw.startsWith('storage/')) return `/${raw}`;
    return `/storage/${raw}`;
};

const itemImageFallback = '/otherplaceholder.jpg';

/** Status chip on an order card: display only, edits happen in the panel. */
function StatusChip({
    value,
    type,
    locked,
    lockReason,
}: {
    value: string;
    type: 'payment' | 'order';
    locked?: boolean;
    lockReason?: string | null;
}) {
    return (
        <span
            title={lockReason ?? undefined}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ring-black/5 ${badgeFor(value, type)}`}
        >
            {type === 'payment' ? <MdPayment className="h-3 w-3" /> : <FaTruck className="h-3 w-3" />}
            {labelFor(value)}
            {locked && <IoLockClosed className="h-3 w-3" aria-label="locked" />}
        </span>
    );
}

/** Editable dropdown, used inside the detail slide-over. */
function StatusDropdown({
    orderId,
    field,
    currentValue,
    options,
    icon: Icon,
    updatingNow,
    onUpdate,
}: {
    orderId: string;
    field: StatusField;
    currentValue: string;
    options: StatusOption[];
    icon: any;
    updatingNow: boolean;
    onUpdate: (orderId: string, field: StatusField, value: string) => void;
}) {
    const menuList = (
        <div className="py-1">
            {options.map(option => {
                const isActive = option.value === currentValue;
                return (
                    <Menu.Item key={option.value}>
                        {({ focus }) => (
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    onUpdate(orderId, field, option.value);
                                }}
                                className={`
                                    flex items-center justify-between w-full px-3 py-2 text-left text-sm
                                    ${focus ? 'bg-paper-dim' : ''}
                                    ${isActive ? 'text-marigold font-medium' : 'text-ink'}
                                `}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${option.color.split(' ')[0]}`} />
                                    {option.label}
                                </span>
                                {isActive && <FaCheck className="h-3 w-3 text-marigold" />}
                            </button>
                        )}
                    </Menu.Item>
                );
            })}
        </div>
    );

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button
                        onClick={e => e.stopPropagation()}
                        disabled={updatingNow}
                        className={`
                            inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium
                            ${badgeFor(currentValue, field === 'payment_status' ? 'payment' : 'order')}
                            hover:opacity-80 transition-all cursor-pointer
                            disabled:opacity-60 disabled:cursor-not-allowed
                            ring-1 ring-inset ring-black/5
                            ${open ? 'ring-2 ring-marigold/40' : ''}
                        `}
                    >
                        {updatingNow ? (
                            <>
                                <IoRefreshOutline className="h-3 w-3 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Icon className="h-3 w-3" />
                                {labelFor(currentValue)}
                            </>
                        )}
                        <IoChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            anchor={{ to: 'bottom start', gap: 8 }}
                            className="z-[60] w-44 origin-top-left rounded-xl bg-white shadow-xl border border-line focus:outline-none overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {menuList}
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
}

function Section({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-line bg-white p-4">
            <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-marigold" />
                {title}
            </h4>
            {children}
        </section>
    );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5">
            <dt className="text-sm text-text-soft shrink-0">{label}</dt>
            <dd className="text-sm text-ink text-right break-words">{children}</dd>
        </div>
    );
}

const AdminOrders = ({ orders, auth, revenue, orderRules, pagination, filters, statusCounts, flash }: AdminOrderProps) => {
    const { url } = usePage();
    const basePath = url.split('?')[0];

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [updating, setUpdating] = useState<UpdatingState | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [paymentFilter, setPaymentFilter] = useState(filters.payment);

    const rulesFor = (orderId: string) => orderRules?.[orderId];

    /** Only the statuses the server will accept for this order. */
    const optionsFor = (orderId: string, type: 'order' | 'payment') => {
        const all = type === 'payment' ? PAYMENT_STATUS_OPTIONS : ORDER_STATUS_OPTIONS;
        const allowed = type === 'payment'
            ? rulesFor(orderId)?.paymentStatus
            : rulesFor(orderId)?.orderStatus;

        if (!allowed) return all;

        return all.filter(o => allowed.includes(o.value));
    };

    /**
     * An order can be listed for an agent either because it belongs to one of
     * their stores, or because they placed it as a shopper elsewhere. The
     * server decides which, and says why when nothing can be changed.
     */
    const isSuperAdminRole = auth?.user?.role === 'superadmin';
    const canEditStatus =
        isSuperAdminRole || auth?.user?.role === 'admin' || auth?.user?.role === 'agent';
    const canEditOrder = (orderId: string) => canEditStatus && !!rulesFor(orderId)?.canEdit;

    const queryFor = (patch: { search?: string; status?: string; payment?: string; page?: number }) => {
        const search = (patch.search ?? searchTerm).trim();
        const status = patch.status ?? statusFilter;
        const payment = patch.payment ?? paymentFilter;
        const page = patch.page ?? 1;

        const params: Record<string, string> = {};
        if (search !== '') params.search = search;
        if (status !== 'all') params.status = status;
        if (payment !== 'all') params.payment = payment;
        if (page > 1) params.page = String(page);

        router.get(basePath, params, { preserveState: true, preserveScroll: true });
    };

    const applyFilters = (patch: { search?: string; status?: string; payment?: string }) => {
        queryFor({ ...patch, page: 1 });
    };

    useEffect(() => {
        if (searchTerm.trim() === filters.search) return;
        const timer = setTimeout(() => applyFilters({ search: searchTerm }), 400);
        return () => clearTimeout(timer);
    }, [searchTerm, filters.search]);

    const handleUpdateStatus = (orderId: string, field: StatusField, value: string) => {
        setUpdating({ id: orderId, field });
        router.patch(
            route('admin.orders.update', orderId),
            { [field]: value },
            {
                onFinish: () => setUpdating(null),
                preserveScroll: true,
            }
        );
    };

    const isUpdating = (orderId: string, field: StatusField) =>
        updating?.id === orderId && updating?.field === field;

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    const activeFilters = statusFilter !== 'all' || paymentFilter !== 'all' || searchTerm.trim() !== '';

    const selectedOrder = selectedId ? orders.find(o => o.id === selectedId) ?? null : null;

    const totalOrders = Object.values(statusCounts ?? {}).reduce((sum, count) => sum + count, 0);

    const statusStats = [
        { key: 'pending',   label: 'Pending',   count: statusCounts?.pending ?? 0,   icon: IoTimeOutline, iconClass: 'text-yellow-600', iconBg: 'bg-yellow-100' },
        { key: 'processing', label: 'Processing', count: statusCounts?.processing ?? 0, icon: FaTruck,      iconClass: 'text-blue-600',   iconBg: 'bg-blue-100' },
        { key: 'delivered', label: 'Delivered', count: statusCounts?.delivered ?? 0,  icon: FaCheck,       iconClass: 'text-green-600',  iconBg: 'bg-green-100' },
    ];

    const pageNumbers: number[] = [];
    if (pagination.lastPage > 1) {
        const start = Math.max(1, Math.min(pagination.page - 2, pagination.lastPage - 4));
        const end = Math.min(pagination.lastPage, start + 4);
        for (let i = start; i <= end; i++) pageNumbers.push(i);
    }

    const goToPage = (page: number) => queryFor({ page });

    const statusControls = (order: Orders & { order_items?: OrderItem[] }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <div className="text-xs font-mono text-text-soft uppercase tracking-wide mb-1.5">
                    Order Status
                </div>
                {canEditOrder(order.id) && !rulesFor(order.id)?.orderStatusLocked ? (
                    <StatusDropdown
                        orderId={order.id}
                        field="order_status"
                        currentValue={order.order_status}
                        options={optionsFor(order.id, 'order')}
                        icon={FaTruck}
                        updatingNow={isUpdating(order.id, 'order_status')}
                        onUpdate={handleUpdateStatus}
                    />
                ) : (
                    <span
                        title={rulesFor(order.id)?.reason ?? undefined}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ring-black/5 ${badgeFor(order.order_status, 'order')} ${canEditOrder(order.id) ? '' : 'opacity-70'}`}
                    >
                        {labelFor(order.order_status)}
                        {rulesFor(order.id)?.orderStatusLocked && <IoLockClosed className="h-3 w-3" aria-label="locked" />}
                    </span>
                )}
                {rulesFor(order.id)?.orderStatusLocked && rulesFor(order.id)?.reason && (
                    <p className="mt-1.5 text-xs text-text-soft">{rulesFor(order.id)?.reason}</p>
                )}
            </div>

            <div>
                <div className="text-xs font-mono text-text-soft uppercase tracking-wide mb-1.5">
                    Payment Status
                </div>
                {canEditOrder(order.id) && !rulesFor(order.id)?.paymentStatusLocked ? (
                    <StatusDropdown
                        orderId={order.id}
                        field="payment_status"
                        currentValue={order.payment_status}
                        options={optionsFor(order.id, 'payment')}
                        icon={MdPayment}
                        updatingNow={isUpdating(order.id, 'payment_status')}
                        onUpdate={handleUpdateStatus}
                    />
                ) : (
                    <span
                        title={rulesFor(order.id)?.paymentStatusLockedReason ?? rulesFor(order.id)?.reason ?? undefined}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ring-black/5 ${badgeFor(order.payment_status, 'payment')} ${canEditOrder(order.id) ? '' : 'opacity-70'}`}
                    >
                        {labelFor(order.payment_status)}
                        {rulesFor(order.id)?.paymentStatusLocked && <IoLockClosed className="h-3 w-3" aria-label="locked" />}
                    </span>
                )}
                {rulesFor(order.id)?.paymentStatusLocked && rulesFor(order.id)?.paymentStatusLockedReason && (
                    <p className="mt-1.5 text-xs text-text-soft">{rulesFor(order.id)?.paymentStatusLockedReason}</p>
                )}
            </div>
        </div>
    );

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Orders Management" />

            <div className="max-w-7xl mx-auto">
                {/* Status updates are silent otherwise, because the
                    success/error flash was never surfaced to the SPA. */}
                {(flash?.success || flash?.error) && (
                    <div
                        role="status"
                        className={`mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-hard-sm ${
                            flash?.error
                                ? 'border-red-200 bg-red-50 text-red-800'
                                : 'border-green-200 bg-green-50 text-green-800'
                        }`}
                    >
                        {flash?.error ? <FaTimes className="h-4 w-4" /> : <FaCheck className="h-4 w-4" />}
                        <span>{flash?.error || flash?.success}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <Eyebrow>Manage customer orders</Eyebrow>
                        <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Orders</h1>
                        <p className="text-text-soft mt-1">Manage and track all customer orders</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-5 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={e => {
                                        setStatusFilter(e.target.value);
                                        applyFilters({ status: e.target.value });
                                    }}
                                    className="appearance-none cursor-pointer w-full rounded-xl border border-line bg-white pl-4 pr-10 py-2.5 text-sm text-ink font-medium focus:ring-2 focus:ring-marigold focus:border-transparent hover:border-marigold/50 transition-colors"
                                >
                                    <option value="all">All Order Status</option>
                                    {ORDER_STATUS_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                <IoChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" />
                            </div>

                            <div className="relative">
                                <select
                                    value={paymentFilter}
                                    onChange={e => {
                                        setPaymentFilter(e.target.value);
                                        applyFilters({ payment: e.target.value });
                                    }}
                                    className="appearance-none cursor-pointer w-full rounded-xl border border-line bg-white pl-4 pr-10 py-2.5 text-sm text-ink font-medium focus:ring-2 focus:ring-marigold focus:border-transparent hover:border-marigold/50 transition-colors"
                                >
                                    <option value="all">All Payment Status</option>
                                    {PAYMENT_STATUS_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                <IoChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <form
                                className="relative flex-1"
                                onSubmit={e => {
                                    e.preventDefault();
                                    applyFilters({ search: searchTerm });
                                }}
                            >
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft h-4 w-4 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by order #, customer, or store..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-line pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-text-soft focus:ring-2 focus:ring-marigold focus:border-transparent bg-white hover:border-marigold/50 transition-colors"
                                />
                            </form>

                            {activeFilters && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                        setPaymentFilter('all');
                                        applyFilters({ search: '', status: 'all', payment: 'all' });
                                    }}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                                >
                                    <FaTimes className="h-3.5 w-3.5" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-line text-sm text-text-soft">
                        {pagination.total > 0 ? (
                            <>
                                Showing{' '}
                                <span className="font-semibold text-ink">
                                    {pagination.from ?? 0}–{pagination.to ?? 0}
                                </span>{' '}
                                of <span className="font-semibold text-ink">{pagination.total}</span> orders
                            </>
                        ) : (
                            'No orders match the current filters'
                        )}
                        {activeFilters && <span className="ml-2 text-xs text-marigold font-medium">(filtered)</span>}
                    </div>
                </div>

                {/* Order cards */}
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedId(order.id)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedId(order.id);
                                    }
                                }}
                                className="group text-left bg-white rounded-2xl border border-line shadow-hard-sm p-4 sm:p-5 flex flex-col gap-3 hover:border-marigold/50 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-marigold/40 cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MdOutlineTrackChanges className="h-5 w-5 text-text-soft shrink-0" />
                                        <span className="text-sm font-semibold text-ink truncate">
                                            {order.order_number}
                                        </span>
                                    </div>
                                    <span className="text-xs text-text-soft whitespace-nowrap shrink-0">
                                        {formatDate(order.created_at)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-marigold to-marigold-dark flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-medium text-sm">
                                            {order.recipient_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-ink truncate">
                                            {order.recipient_name}
                                        </div>
                                        <div className="text-xs text-text-soft truncate">
                                            {order.recipient_phone}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right min-w-0">
                                        <div className="text-[10px] font-mono text-text-soft uppercase tracking-wide">
                                            Store
                                        </div>
                                        <div className="text-xs text-ink truncate max-w-[110px]">
                                            {order.store_name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusChip
                                        value={order.payment_status}
                                        type="payment"
                                        locked={rulesFor(order.id)?.paymentStatusLocked}
                                        lockReason={rulesFor(order.id)?.paymentStatusLockedReason}
                                    />
                                    <StatusChip
                                        value={order.order_status}
                                        type="order"
                                        locked={rulesFor(order.id)?.orderStatusLocked}
                                        lockReason={rulesFor(order.id)?.reason}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-line/70">
                                    <span className="text-lg font-bold text-ink">
                                        <FormatPrice price={order.total} />
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('orders.confirmation', order.id)}
                                            onClick={e => e.stopPropagation()}
                                            title="Open the order confirmation page"
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:border-marigold hover:text-marigold focus:outline-none focus:ring-2 focus:ring-marigold/40 transition-colors"
                                        >
                                            <IoReceiptOutline className="h-3.5 w-3.5" />
                                            Confirmation
                                        </Link>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-text-soft group-hover:text-marigold transition-colors">
                                            View details
                                            <IoChevronDown className="-rotate-90 h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line text-center py-14 px-4">
                        <IoCartOutline className="mx-auto h-12 w-12 text-text-soft" />
                        <h3 className="mt-3 text-sm font-semibold text-ink">No orders found</h3>
                        <p className="mt-1 text-sm text-text-soft">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.lastPage > 1 && (
                    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Orders pagination">
                        <button
                            type="button"
                            disabled={pagination.page <= 1}
                            onClick={() => goToPage(pagination.page - 1)}
                            className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-marigold hover:text-marigold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                            &larr; Prev
                        </button>

                        {pageNumbers.map(page => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => goToPage(page)}
                                aria-current={page === pagination.page ? 'page' : undefined}
                                className={`min-w-[40px] rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                                    page === pagination.page
                                        ? 'border-marigold bg-marigold text-white'
                                        : 'border-line bg-white text-ink hover:border-marigold hover:text-marigold'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={pagination.page >= pagination.lastPage}
                            onClick={() => goToPage(pagination.page + 1)}
                            className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-marigold hover:text-marigold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                            Next &rarr;
                        </button>
                    </nav>
                )}

                {/* Summary cards, which double as status filters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-marigold/10 rounded-xl">
                                <IoCartOutline className="h-6 w-6 text-marigold" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</div>
                                <div className="text-2xl font-bold text-ink">{totalOrders}</div>
                            </div>
                        </div>
                    </div>

                    {statusStats.map(stat => {
                        const active = statusFilter === stat.key;
                        return (
                            <button
                                key={stat.key}
                                type="button"
                                onClick={() => {
                                    const next = active ? 'all' : stat.key;
                                    setStatusFilter(next);
                                    applyFilters({ status: next });
                                }}
                                className={`bg-white rounded-2xl shadow-hard-sm border p-4 sm:p-5 text-left transition-all hover:shadow-xl ${
                                    active ? 'border-marigold ring-2 ring-marigold/30' : 'border-line'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-mono text-text-soft uppercase tracking-wide">{stat.label}</div>
                                        <div className="text-2xl font-bold text-ink">{stat.count}</div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {canEditStatus && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl shadow-hard-sm border border-line px-5 py-4 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-100 rounded-xl">
                                <MdPayment className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="text-xs font-mono text-text-soft uppercase tracking-wide">
                                Revenue <span className="text-text-soft normal-case font-sans">(paid, not cancelled)</span>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-ink">
                            <FormatPrice price={Number(revenue ?? 0)} />
                        </div>
                    </div>
                )}
            </div>

            {/* Detail slide-over */}
            <Transition show={selectedOrder !== null} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedId(null)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-ink/40 backdrop-blur-[2px]" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                                <TransitionChild
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <DialogPanel className="pointer-events-auto flex h-full w-screen sm:max-w-xl flex-col bg-paper shadow-2xl border-l border-line">
                                        {selectedOrder && (
                                            <>
                                                {/* Panel header */}
                                                <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line bg-white">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 text-xs font-mono text-text-soft uppercase tracking-wide">
                                                            <IoReceiptOutline className="h-4 w-4 text-marigold" />
                                                            Order details
                                                        </div>
                                                        <h2 className="text-xl font-bold text-ink truncate mt-0.5">
                                                            {selectedOrder.order_number}
                                                        </h2>
                                                        <p className="text-sm text-text-soft">
                                                            {selectedOrder.store_name} · {formatDate(selectedOrder.created_at)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedId(null)}
                                                        aria-label="Close order details"
                                                        className="shrink-0 rounded-xl border border-line p-2 text-text-soft hover:text-ink hover:border-marigold transition-colors"
                                                    >
                                                        <IoClose className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                                                    {/* Status controls — the only place statuses are edited. */}
                                                    <div className="rounded-2xl border border-line bg-white p-4 space-y-4">
                                                        {statusControls(selectedOrder)}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <Section title="Order Information" icon={FaBox}>
                                                            <dl className="divide-y divide-line/60">
                                                                <DetailRow label="Tracking #">
                                                                    {selectedOrder.tracking_number || 'N/A'}
                                                                </DetailRow>
                                                                <DetailRow label="Shipping">
                                                                    {humanize(selectedOrder.shipping_method)}
                                                                </DetailRow>
                                                                <DetailRow label="Payment">
                                                                    <span className="inline-flex items-center gap-1.5">
                                                                        <FaCreditCard className="h-3 w-3" />
                                                                        {humanize(selectedOrder.payment_method)}
                                                                    </span>
                                                                </DetailRow>
                                                                <DetailRow label="Quantity">{selectedOrder.item_quantity}</DetailRow>
                                                                <DetailRow label="Weight">
                                                                    <span className="inline-flex items-center gap-1.5">
                                                                        <FaWeightHanging className="h-3 w-3" />
                                                                        {selectedOrder.item_weight} kg
                                                                    </span>
                                                                </DetailRow>
                                                            </dl>
                                                        </Section>

                                                        <Section title="Recipient" icon={IoPersonOutline}>
                                                            <dl className="divide-y divide-line/60">
                                                                <DetailRow label="Name">{selectedOrder.recipient_name}</DetailRow>
                                                                <DetailRow label="Email">
                                                                    <span className="inline-flex items-center gap-1.5 justify-end">
                                                                        <HiOutlineMail className="h-3 w-3" />
                                                                        {selectedOrder.recipient_email || '—'}
                                                                    </span>
                                                                </DetailRow>
                                                                <DetailRow label="Phone">
                                                                    <span className="inline-flex items-center gap-1.5 justify-end">
                                                                        <BiPhone className="h-3 w-3" />
                                                                        {selectedOrder.recipient_phone}
                                                                    </span>
                                                                </DetailRow>
                                                                <DetailRow label="Address">
                                                                    <span className="inline-flex items-start gap-1.5 justify-end">
                                                                        <IoLocationOutline className="h-3 w-3 mt-1" />
                                                                        {selectedOrder.recipient_address}
                                                                    </span>
                                                                </DetailRow>
                                                            </dl>
                                                        </Section>
                                                    </div>

                                                    <Section title="Payment Summary" icon={IoPricetagOutline}>
                                                        <dl className="divide-y divide-line/60">
                                                            <DetailRow label="Subtotal">
                                                                <FormatPrice price={selectedOrder.subtotal} />
                                                            </DetailRow>
                                                            <DetailRow label="Delivery charge">
                                                                <FormatPrice price={selectedOrder.delivery_charge} />
                                                            </DetailRow>
                                                            {Number(selectedOrder.discount_amount) > 0 && (
                                                                <div className="flex items-center justify-between gap-4 py-1.5">
                                                                    <dt className="text-sm text-red-600">Discount</dt>
                                                                    <dd className="text-sm text-red-600 text-right">
                                                                        -<FormatPrice price={selectedOrder.discount_amount} />
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between gap-4 pt-3">
                                                                <dt className="text-sm font-semibold text-ink">Total</dt>
                                                                <dd className="text-lg font-bold text-marigold">
                                                                    <FormatPrice price={selectedOrder.total} />
                                                                </dd>
                                                            </div>
                                                        </dl>
                                                    </Section>

                                                    {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                                                        <section className="rounded-2xl border border-line bg-white overflow-hidden">
                                                            <h4 className="text-sm font-semibold text-ink px-4 py-3 border-b border-line">
                                                                Order Items
                                                            </h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-line">
                                                                    <thead className="bg-paper-dim">
                                                                        <tr>
                                                                            {['Product', 'Qty', 'Price', 'Total'].map(col => (
                                                                                <th key={col} className="px-4 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                                                                                    {col}
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-line">
                                                                        {selectedOrder.order_items.map(item => (
                                                                            <tr key={item.id}>
                                                                                <td className="px-4 py-3">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <img
                                                                                            src={resolveItemImage(item.product_image) || itemImageFallback}
                                                                                            alt={item.product_name}
                                                                                            onError={e => {
                                                                                                if (!e.currentTarget.src.endsWith('otherplaceholder.jpg')) {
                                                                                                    e.currentTarget.src = itemImageFallback;
                                                                                                }
                                                                                            }}
                                                                                            className="h-10 w-10 flex-shrink-0 object-cover rounded border border-line bg-paper-dim"
                                                                                        />
                                                                                        <span className="font-medium text-sm text-ink">{item.product_name}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm text-ink">{item.quantity}</td>
                                                                                <td className="px-4 py-3 text-sm text-ink"><FormatPrice price={item.price} /></td>
                                                                                <td className="px-4 py-3 text-sm font-medium text-ink"><FormatPrice price={item.total} /></td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </section>
                                                    )}

                                                    {selectedOrder.notes && (
                                                        <section className="rounded-2xl border border-line bg-white p-4">
                                                            <h4 className="text-sm font-semibold text-ink mb-2">Notes</h4>
                                                            <p className="text-sm text-text-soft">{selectedOrder.notes}</p>
                                                        </section>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </DashboardLayout>
    );
};

export default AdminOrders;
