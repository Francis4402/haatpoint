import { useState, useRef, useEffect } from 'react';
import { OrderItem, Orders } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Menu, Transition, Portal } from '@headlessui/react';
import { Fragment } from 'react';
import {
    IoChevronDown,
    IoChevronUp,
    IoCartOutline,
    IoPersonOutline,
    IoLocationOutline,
    IoPricetagOutline,
    IoTimeOutline,
    IoRefreshOutline,
    IoLockClosed
} from 'react-icons/io5';
import {
    MdPayment,
    MdOutlineTrackChanges
} from 'react-icons/md';
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

const AdminOrders = ({ orders, auth, revenue, orderRules, flash }: AdminOrderProps) => {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updating, setUpdating] = useState<UpdatingState | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    const paymentStatusOptions = [
        { value: 'pending',  label: 'Pending',  color: 'bg-yellow-100 text-yellow-800' },
        { value: 'paid',     label: 'Paid',     color: 'bg-green-100 text-green-800'  },
        { value: 'failed',   label: 'Failed',   color: 'bg-red-100 text-red-800'      },
        { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800'    },
    ];

    const orderStatusOptions = [
        { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
        { value: 'confirmed',  label: 'Confirmed',  color: 'bg-indigo-100 text-indigo-800'},
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800'    },
        { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800'},
        { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800'  },
        { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800'      },
        { value: 'returned',   label: 'Returned',   color: 'bg-gray-100 text-gray-800'    },
    ];

    const rulesFor = (orderId: string) => orderRules?.[orderId];

    /** Only the statuses the server will accept for this order. */
    const optionsFor = (orderId: string, type: 'order' | 'payment') => {
        const all = type === 'payment' ? paymentStatusOptions : orderStatusOptions;
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

    const handleUpdateStatus = (
        orderId: string,
        field: 'payment_status' | 'order_status',
        value: string
    ) => {
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

    const isUpdating = (orderId: string, field: 'payment_status' | 'order_status') =>
        updating?.id === orderId && updating?.field === field;

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status: string, type: 'payment' | 'order') => {
        const options = type === 'payment' ? paymentStatusOptions : orderStatusOptions;
        return options.find(opt => opt.value === status)?.color ?? 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString();

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            searchTerm === '' ||
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.store_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus  = statusFilter  === 'all' || order.order_status   === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.payment_status  === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const stats = {
        total:      orders.length,
        pending:    orders.filter(o => o.order_status === 'pending').length,
        processing: orders.filter(o => o.order_status === 'processing').length,
        delivered:  orders.filter(o => o.order_status === 'delivered').length,
        // Server-computed: Orders casts money columns to decimal *strings*, so a
        // client-side reduce() concatenated them instead of adding.
        revenue:    Number(revenue ?? 0),
    };

    const StatusDropdown = ({
        orderId,
        field,
        currentValue,
        options,
        icon: Icon,
    }: {
        orderId: string;
        field: 'payment_status' | 'order_status';
        currentValue: string;
        options: { value: string; label: string; color: string }[];
        icon: any;
    }) => {
        const updatingNow = isUpdating(orderId, field);
        const currentOption = options.find(o => o.value === currentValue);
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

        const handleOpen = () => {
            if (!buttonRef.current) return;
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + 8,   // 8px gap; fixed positioning ignores scroll
                left: rect.left,
            });
        };

        // Recalculate position on window resize/scroll while menu is open
        useEffect(() => {
            if (!buttonRef.current) return;

            const updatePos = () => {
                if (!buttonRef.current) return;
                const rect = buttonRef.current.getBoundingClientRect();
                setMenuPos({ top: rect.bottom + 8, left: rect.left });
            };

            window.addEventListener('resize', updatePos);
            window.addEventListener('scroll', updatePos, true);

            return () => {
                window.removeEventListener('resize', updatePos);
                window.removeEventListener('scroll', updatePos, true);
            };
        }, []);

        return (
            <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                    <>
                        <Menu.Button
                            ref={buttonRef}
                            onClick={handleOpen}
                            disabled={updatingNow}
                            className={`
                                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium
                                ${getStatusColor(currentValue, field === 'payment_status' ? 'payment' : 'order')}
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
                                    {currentOption?.label ?? currentValue}
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
                            {/* ✅ Portal — render OUTSIDE the table, into document.body */}
                            <Portal>
                                <Menu.Items
                                    className="
                                        fixed z-[9999] w-44 origin-top-left
                                        rounded-xl bg-white shadow-xl border border-line
                                        focus:outline-none overflow-hidden
                                    "
                                    style={{
                                        top: menuPos.top,
                                        left: menuPos.left,
                                    }}
                                >
                                    <div className="py-1">
                                        {options.map(option => {
                                            const isActive = option.value === currentValue;
                                            return (
                                                <Menu.Item key={option.value}>
                                                    {({ active }) => (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateStatus(orderId, field, option.value)
                                                            }
                                                            className={`
                                                                flex items-center justify-between w-full px-3 py-2 text-left text-sm
                                                                ${active ? 'bg-paper-dim' : ''}
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
                                </Menu.Items>
                            </Portal>
                        </Transition>
                    </>
                )}
            </Menu>
        );
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Orders Management" />

            <div>
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-marigold/10 rounded-xl">
                                    <IoCartOutline className="h-6 w-6 text-marigold" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</div>
                                    <div className="text-2xl font-bold text-ink">{stats.total}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-xl">
                                    <IoTimeOutline className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-xs font-mono text-text-soft uppercase tracking-wide">Pending</div>
                                    <div className="text-2xl font-bold text-ink">{stats.pending}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl">
                                    <FaTruck className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <div className="text-xs font-mono text-text-soft uppercase tracking-wide">Processing</div>
                                    <div className="text-2xl font-bold text-ink">{stats.processing}</div>
                                </div>
                            </div>
                        </div>

                        {canEditStatus && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl">
                                        <MdPayment className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-xs font-mono text-text-soft uppercase tracking-wide">Revenue</div>
                                        <div className="text-2xl font-bold text-ink">
                                            <FormatPrice price={stats.revenue} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Left: Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Order Status Select */}
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        className="
                                            appearance-none cursor-pointer
                                            rounded-xl border border-line bg-white
                                            pl-4 pr-10 py-2.5 min-w-[180px]
                                            text-sm text-ink font-medium
                                            focus:ring-2 focus:ring-marigold focus:border-transparent
                                            hover:border-marigold/50 transition-colors
                                        "
                                    >
                                        <option value="all">All Order Status</option>
                                        {orderStatusOptions.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                    <IoChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" />
                                </div>

                                {/* Payment Status Select */}
                                <div className="relative">
                                    <select
                                        value={paymentFilter}
                                        onChange={e => setPaymentFilter(e.target.value)}
                                        className="
                                            appearance-none cursor-pointer
                                            rounded-xl border border-line bg-white
                                            pl-4 pr-10 py-2.5 min-w-[190px]
                                            text-sm text-ink font-medium
                                            focus:ring-2 focus:ring-marigold focus:border-transparent
                                            hover:border-marigold/50 transition-colors
                                        "
                                    >
                                        <option value="all">All Payment Status</option>
                                        {paymentStatusOptions.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                    <IoChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" />
                                </div>

                                {/* Clear Filters Button (only shows when a filter is active) */}
                                {(statusFilter !== 'all' || paymentFilter !== 'all' || searchTerm !== '') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setPaymentFilter('all');
                                            setSearchTerm('');
                                        }}
                                        className="
                                            inline-flex items-center gap-1.5
                                            rounded-xl px-3 py-2.5 text-sm font-medium
                                            text-red-600 hover:text-red-700 hover:bg-red-50
                                            border border-transparent hover:border-red-200
                                            transition-colors
                                        "
                                    >
                                        <FaTimes className="h-3.5 w-3.5" />
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Right: Search */}
                            <div className="relative w-full lg:w-auto">
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft h-4 w-4 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by order #, customer, or store..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="
                                        w-full lg:w-80
                                        rounded-xl border border-line
                                        pl-10 pr-4 py-2.5
                                        text-sm text-ink placeholder:text-text-soft
                                        focus:ring-2 focus:ring-marigold focus:border-transparent
                                        bg-white
                                        hover:border-marigold/50 transition-colors
                                    "
                                />
                            </div>
                        </div>

                        {/* Results Count Row */}
                        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-sm">
                            <div className="text-text-soft">
                                Showing <span className="font-semibold text-ink">{filteredOrders.length}</span> of{' '}
                                <span className="font-semibold text-ink">{orders.length}</span> orders
                                {(statusFilter !== 'all' || paymentFilter !== 'all' || searchTerm !== '') && (
                                    <span className="ml-2 text-xs text-marigold font-medium">
                                        (filtered)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                        {/* ✅ overflow-x-auto is BACK — table scrolls on small screens */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-line">
                                <thead className="bg-paper-dim">
                                    <tr>
                                        {['Order #', 'Customer', 'Store', 'Total', 'Payment Status', 'Order Status', 'Date', 'Actions'].map(col => (
                                            <th
                                                key={col}
                                                scope="col"
                                                className={`px-6 py-3 text-xs font-mono text-text-soft uppercase tracking-wide whitespace-nowrap ${col === 'Actions' ? 'text-right' : 'text-left'}`}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-line">
                                    {filteredOrders.map(order => (
                                        <Fragment key={order.id}>
                                            <tr className="hover:bg-paper-dim/50 transition-colors duration-150">

                                                {/* Order # */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <MdOutlineTrackChanges className="h-5 w-5 text-text-soft" />
                                                        <span className="text-sm font-medium text-ink">{order.order_number}</span>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-marigold to-marigold-dark flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white font-medium text-sm">
                                                                {order.recipient_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-ink">{order.recipient_name}</div>
                                                            <div className="text-sm text-text-soft">{order.recipient_phone}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Store */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                                                    {order.store_name}
                                                </td>

                                                {/* Total */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                                                    <FormatPrice price={order.total} />
                                                </td>

                                                {/* Payment Status Dropdown. Once the money is
                                                    settled (paid/refunded) both fields lock, so an
                                                    agent can never quietly rewrite the payment. */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {canEditOrder(order.id)
                                                        && !rulesFor(order.id)?.paymentStatusLocked ? (
                                                        <StatusDropdown
                                                            orderId={order.id}
                                                            field="payment_status"
                                                            currentValue={order.payment_status}
                                                            options={optionsFor(order.id, 'payment')}
                                                            icon={MdPayment}
                                                        />
                                                    ) : (
                                                        <span
                                                            title={rulesFor(order.id)?.paymentStatusLockedReason
                                                                ?? rulesFor(order.id)?.reason
                                                                ?? undefined}
                                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor(order.payment_status, 'payment')} ${canEditOrder(order.id) ? '' : 'opacity-70'}`}
                                                        >
                                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                            {rulesFor(order.id)?.paymentStatusLocked && (
                                                                <IoLockClosed className="h-3 w-3" aria-label="locked" />
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Order Status Dropdown. A finished order, or one whose
                                                    money is settled, keeps its status. */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {canEditOrder(order.id) && !rulesFor(order.id)?.orderStatusLocked ? (
                                                        <StatusDropdown
                                                            orderId={order.id}
                                                            field="order_status"
                                                            currentValue={order.order_status}
                                                            options={optionsFor(order.id, 'order')}
                                                            icon={FaTruck}
                                                        />
                                                    ) : (
                                                        <span
                                                            title={rulesFor(order.id)?.reason ?? undefined}
                                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor(order.order_status, 'order')} ${canEditOrder(order.id) ? 'opacity-80' : 'opacity-60'}`}
                                                        >
                                                            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                            {rulesFor(order.id)?.orderStatusLocked && (
                                                                <IoLockClosed className="h-3 w-3" aria-label="locked" />
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-soft">
                                                    {formatDate(order.created_at)}
                                                </td>

                                                {/* Toggle details */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => toggleOrderDetails(order.id)}
                                                        className="inline-flex items-center gap-1 text-marigold hover:text-marigold-dark transition-colors"
                                                    >
                                                        {expandedOrder === order.id ? (
                                                            <><IoChevronUp className="h-4 w-4" />Hide</>
                                                        ) : (
                                                            <><IoChevronDown className="h-4 w-4" />Details</>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Details Row */}
                                            {expandedOrder === order.id && (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-6 bg-paper-dim/50">
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                                                {/* Order Information */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <FaBox className="h-4 w-4 text-marigold" />
                                                                        Order Information
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Tracking #:</dt>
                                                                            <dd className="font-medium text-ink">{order.tracking_number || 'N/A'}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Shipping Method:</dt>
                                                                            <dd className="text-ink">{order.shipping_method}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Payment Method:</dt>
                                                                            <dd className="flex items-center gap-1 text-ink">
                                                                                <FaCreditCard className="h-3 w-3" />
                                                                                {order.payment_method}
                                                                            </dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Item Quantity:</dt>
                                                                            <dd className="text-ink">{order.item_quantity}</dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Total Weight:</dt>
                                                                            <dd className="flex items-center gap-1 text-ink">
                                                                                <FaWeightHanging className="h-3 w-3" />
                                                                                {order.item_weight} kg
                                                                            </dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>

                                                                {/* Recipient Details */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <IoPersonOutline className="h-4 w-4 text-marigold" />
                                                                        Recipient Details
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div>
                                                                            <dt className="text-text-soft">Name</dt>
                                                                            <dd className="font-medium text-ink">{order.recipient_name}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <HiOutlineMail className="h-3 w-3" /> Email
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_email}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <BiPhone className="h-3 w-3" /> Phone
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_phone}</dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt className="text-text-soft flex items-center gap-1">
                                                                                <IoLocationOutline className="h-3 w-3" /> Address
                                                                            </dt>
                                                                            <dd className="text-ink">{order.recipient_address}</dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>

                                                                {/* Order Summary */}
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                                                                        <IoPricetagOutline className="h-4 w-4 text-marigold" />
                                                                        Order Summary
                                                                    </h4>
                                                                    <dl className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Subtotal:</dt>
                                                                            <dd className="text-ink"><FormatPrice price={order.subtotal} /></dd>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <dt className="text-text-soft">Delivery Charge:</dt>
                                                                            <dd className="text-ink"><FormatPrice price={order.delivery_charge} /></dd>
                                                                        </div>
                                                                        {order.discount_amount > 0 && (
                                                                            <div className="flex justify-between text-red-600">
                                                                                <dt>Discount:</dt>
                                                                                <dd>-<FormatPrice price={order.discount_amount} /></dd>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex justify-between border-t border-line pt-2 font-semibold">
                                                                            <dt className="text-ink">Total:</dt>
                                                                            <dd className="text-lg font-bold text-marigold">
                                                                                <FormatPrice price={order.total} />
                                                                            </dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>
                                                            </div>

                                                            {/* Order Items */}
                                                            {order.order_items && order.order_items.length > 0 && (
                                                                <div className="bg-white rounded-xl shadow-hard-sm border border-line overflow-hidden">
                                                                    <h4 className="text-sm font-semibold text-ink px-4 py-3 border-b border-line">
                                                                        Order Items
                                                                    </h4>
                                                                    <div className="overflow-x-auto">
                                                                        <table className="min-w-full divide-y divide-line">
                                                                            <thead className="bg-paper-dim">
                                                                                <tr>
                                                                                    {['Product', 'Quantity', 'Price', 'Total'].map(col => (
                                                                                        <th key={col} className="px-4 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                                                                                            {col}
                                                                                        </th>
                                                                                    ))}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-line">
                                                                                {order.order_items.map(item => (
                                                                                    <tr key={item.id} className="hover:bg-paper-dim/30">
                                                                                        <td className="px-4 py-3">
                                                                                            <div className="flex items-center gap-3">
                                                                                                {item.product_image && (
                                                                                                    <img
                                                                                                        src={item.product_image}
                                                                                                        alt={item.product_name}
                                                                                                        className="h-10 w-10 object-cover rounded border border-line"
                                                                                                    />
                                                                                                )}
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
                                                                </div>
                                                            )}

                                                            {/* Notes */}
                                                            {order.notes && (
                                                                <div className="bg-white rounded-xl p-4 shadow-hard-sm border border-line">
                                                                    <h4 className="text-sm font-semibold text-ink mb-2">Notes</h4>
                                                                    <p className="text-sm text-text-soft">{order.notes}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty State */}
                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <IoCartOutline className="mx-auto h-12 w-12 text-text-soft" />
                                    <h3 className="mt-2 text-sm font-medium text-ink">No orders found</h3>
                                    <p className="mt-1 text-sm text-text-soft">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminOrders;
