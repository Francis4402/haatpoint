// DashboardOrders.tsx
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { Menu, Transition, Portal } from '@headlessui/react';
import { Fragment } from 'react';
import {
    FaShoppingCart, FaEye, FaTrash, FaTruck, FaCheckCircle,
    FaTimesCircle, FaClock, FaUser, FaBox, FaEnvelope,
    FaCreditCard, FaBoxOpen, FaStore, FaImage, FaPhone,
    FaHashtag, FaBan, FaSearch, FaCheck, FaChevronDown,
} from 'react-icons/fa';
import { IoRefreshOutline } from 'react-icons/io5';
import { Orders, OrderItem } from '@/types';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';


interface DashboardOrderType {
    auth: { user: any };
    orders: (Orders & { order_items?: OrderItem[] })[];
}

const NON_CANCELLABLE_STATUSES = ['shipped', 'delivered', 'confirmed', 'cancelled'];

const STATUS_CONFIG: Record<string, { badge: string; border: string; dot: string; icon: JSX.Element }> = {
    pending:    { badge: 'bg-yellow-100 text-yellow-800', border: 'border-l-yellow-400',  dot: 'bg-yellow-400',  icon: <FaClock className="h-3 w-3" />       },
    processing: { badge: 'bg-blue-100 text-blue-800',    border: 'border-l-blue-400',    dot: 'bg-blue-400',    icon: <FaBoxOpen className="h-3 w-3" />     },
    confirmed:  { badge: 'bg-indigo-100 text-indigo-800',border: 'border-l-indigo-400',  dot: 'bg-indigo-400',  icon: <FaCheckCircle className="h-3 w-3" /> },
    shipped:    { badge: 'bg-purple-100 text-purple-800', border: 'border-l-purple-400', dot: 'bg-purple-400',  icon: <FaTruck className="h-3 w-3" />       },
    delivered:  { badge: 'bg-green-100 text-green-800',  border: 'border-l-green-400',   dot: 'bg-green-400',   icon: <FaCheckCircle className="h-3 w-3" /> },
    cancelled:  { badge: 'bg-red-100 text-red-800',      border: 'border-l-red-400',     dot: 'bg-red-400',     icon: <FaTimesCircle className="h-3 w-3" /> },
    returned:   { badge: 'bg-gray-100 text-gray-700',    border: 'border-l-gray-400',    dot: 'bg-gray-400',    icon: <FaBoxOpen className="h-3 w-3" />     },
};

const PAYMENT_CONFIG: Record<string, string> = {
    paid:     'bg-green-100 text-green-800',
    pending:  'bg-yellow-100 text-yellow-800',
    failed:   'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
};

const getStatus   = (s: string) => STATUS_CONFIG[s]  ?? STATUS_CONFIG['returned'];
const getPayColor = (s: string) => PAYMENT_CONFIG[s] ?? 'bg-gray-100 text-gray-700';

const getStatusColor = (status: string, type: 'payment' | 'order') =>
    type === 'payment'
        ? (PAYMENT_CONFIG[status] ?? 'bg-gray-100 text-gray-700')
        : (STATUS_CONFIG[status]?.badge ?? 'bg-gray-100 text-gray-700');

const DashboardOrders = ({ auth, orders }: DashboardOrderType) => {
    const [expandedId,    setExpandedId]    = useState<string | null>(null);
    const [deletingId,    setDeletingId]    = useState<string | null>(null);
    const [cancellingId,  setCancellingId]  = useState<string | null>(null);
    const [isDeleteOpen,  setIsDeleteOpen]  = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [isCancelOpen,  setIsCancelOpen]  = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [search,        setSearch]        = useState('');
    const [statusFilter,  setStatusFilter]  = useState('all');
    const [updating,      setUpdating]      = useState<{ id: string; field: 'payment_status' | 'order_status' } | null>(null);

    const isAdmin   = auth.user.role === 'superadmin' || auth.user.role === 'admin';
    const isMine    = (o: Orders) => (o.user_id ?? o.agent_id) === auth.user.id;
    const canCancel = (o: Orders) =>
        !isAdmin && isMine(o) && !NON_CANCELLABLE_STATUSES.includes(o.order_status);
    const canUpdate = (o: Orders) => isAdmin || isMine(o);

    const paymentStatusOptions = [
        { value: 'pending',  label: 'Pending',  color: 'bg-yellow-100 text-yellow-800' },
        { value: 'paid',     label: 'Paid',     color: 'bg-green-100 text-green-800'   },
        { value: 'failed',   label: 'Failed',   color: 'bg-red-100 text-red-800'       },
        { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800'     },
    ];

    const orderStatusOptions = [
        { value: 'pending',    label: 'Pending',    color: 'bg-yellow-100 text-yellow-800' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800'     },
        { value: 'confirmed',  label: 'Confirmed',  color: 'bg-indigo-100 text-indigo-800' },
        { value: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-800' },
        { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-800'   },
        { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-800'       },
    ];

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
                preserveScroll: true,
                onSuccess: () => toast.success('Order status updated'),
                onError: (e) => toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to update status'),
                onFinish: () => setUpdating(null),
            }
        );
    };

    const isUpdatingStatus = (orderId: string, field: 'payment_status' | 'order_status') =>
        updating?.id === orderId && updating?.field === field;

    const stats = {
        total:      orders.length,
        pending:    orders.filter(o => o.order_status === 'pending').length,
        shipped:    orders.filter(o => o.order_status === 'shipped').length,
        delivered:  orders.filter(o => o.order_status === 'delivered').length,
        cancelled:  orders.filter(o => o.order_status === 'cancelled').length,
    };

    const filtered = orders.filter(o => {
        const matchSearch = !search ||
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.recipient_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getImageUrl = (p: string | null | undefined) => {
        if (!p) return '/otherplaceholder.jpg';
        const c = p.replace(/\/+/g, '/');
        if (c.startsWith('http://') || c.startsWith('https://')) return c;
        if (c.includes('/storage/')) return c;
        const b = window.location.origin;
        if (c.startsWith('product_images/')) return `${b}/storage/${c}`;
        if (c.includes('product_images')) return `${b}/storage/product_images/${c.split('/').pop()}`;
        if (!c.includes('/')) return `${b}/storage/product_images/${c}`;
        return `${b}/storage/${c}`;
    };

    const formatDate = (d: string | null) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const formatTime = (d: string | null) => {
        if (!d) return '';
        return new Date(d).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
    };

    const openDelete  = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setOrderToDelete(id); setIsDeleteOpen(true); };
    const closeDelete = () => { setIsDeleteOpen(false); setOrderToDelete(null); };
    const handleDelete = () => {
        if (!orderToDelete) return;
        setDeletingId(orderToDelete);
        router.delete(`/orders/${orderToDelete}`, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { toast.success('Order deleted'); if (expandedId === orderToDelete) setExpandedId(null); },
            onError:   (e) => toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to delete'),
            onFinish:  () => { setDeletingId(null); closeDelete(); },
        });
    };

    const openCancel  = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setOrderToCancel(id); setIsCancelOpen(true); };
    const closeCancel = () => { setIsCancelOpen(false); setOrderToCancel(null); };
    const handleCancel = () => {
        if (!orderToCancel) return;
        setCancellingId(orderToCancel);
        router.patch(`/orders/${orderToCancel}/cancel`, {}, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => { toast.success('Order cancelled'); if (expandedId === orderToCancel) setExpandedId(null); },
            onError:   (e) => toast.error(typeof e === 'string' ? e : (e as any).message ?? 'Failed to cancel'),
            onFinish:  () => { setCancellingId(null); closeCancel(); },
        });
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Orders" />

            <div className="bg-paper-dim">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Track your purchases</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">My Orders</h1>
                            <p className="text-text-soft mt-1">Track and manage your purchases</p>
                        </div>

                        {/* Stat pills */}
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                            {[
                                { label: 'All',       val: stats.total,     color: 'bg-gray-100 text-gray-700',     key: 'all'       },
                                { label: 'Pending',   val: stats.pending,   color: 'bg-yellow-100 text-yellow-800', key: 'pending'   },
                                { label: 'Shipped',   val: stats.shipped,   color: 'bg-purple-100 text-purple-800', key: 'shipped'   },
                                { label: 'Delivered', val: stats.delivered, color: 'bg-green-100 text-green-800',   key: 'delivered' },
                                { label: 'Cancelled', val: stats.cancelled, color: 'bg-red-100 text-red-800',       key: 'cancelled' },
                            ].map(s => (
                                <button
                                    key={s.key}
                                    onClick={() => setStatusFilter(s.key)}
                                    className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                                        statusFilter === s.key
                                            ? `${s.color} ring-2 ring-offset-2 ring-marigold`
                                            : `${s.color} opacity-60 hover:opacity-100`
                                    }`}
                                >
                                    {s.label} · {s.val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search + filter */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-soft" />
                                <input
                                    type="text"
                                    placeholder="Search order # or name…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-marigold focus:border-transparent text-ink placeholder:text-text-soft"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="text-sm bg-white border border-line rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold text-ink"
                            >
                                <option value="all">All Statuses</option>
                                {Object.keys(STATUS_CONFIG).map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        {filtered.length > 0 && (
                            <div className="mt-3 text-xs text-text-soft">
                                Showing <span className="font-semibold text-ink">{filtered.length}</span> of <span className="font-semibold text-ink">{orders.length}</span> orders
                            </div>
                        )}
                    </div>

                    {/* Order Cards */}
                    <div className="space-y-3">

                        {filtered.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line py-20 text-center">
                                <FaShoppingCart className="h-12 w-12 text-text-soft mx-auto mb-4" />
                                <p className="text-ink font-medium">No orders found</p>
                                <p className="text-text-soft text-sm mt-1">Try adjusting your search or filter</p>
                            </div>
                        )}

                        {filtered.map((order) => {
                            const sc          = getStatus(order.order_status);
                            const isOpen      = expandedId === order.id;
                            const isDeleting  = deletingId  === order.id;
                            const isCancelling = cancellingId === order.id;

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
        const updatingNow = isUpdatingStatus(orderId, field);
        const currentOption = options.find(o => o.value === currentValue);
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

        const handleOpen = () => {
            if (!buttonRef.current) return;
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + 8, left: rect.left });
        };

        useEffect(() => {
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
                                inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold
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
                            <FaChevronDown
                                className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
                                <div
                                    key={order.id}
                                    className={`bg-white rounded-2xl border border-line border-l-4 ${sc.border} shadow-hard-sm hover:shadow-xl transition-all duration-300`}
                                >
                                    {/* Card top row */}
                                    <div
                                        className="px-5 py-4 cursor-pointer select-none"
                                        onClick={() => setExpandedId(isOpen ? null : order.id)}
                                    >
                                        <div className="flex items-start justify-between gap-4">

                                            {/* Left content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Badges */}
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${sc.badge}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getPayColor(order.payment_status)}`}>
                                                        <FaCreditCard className="h-2.5 w-2.5" />
                                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                    </span>
                                                    {order.shipping_method && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-paper-dim text-text-soft">
                                                            <FaTruck className="h-2.5 w-2.5" />
                                                            {order.shipping_method === 'pathao' ? 'Pathao' : 'Standard'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Editable statuses */}
                                                {canUpdate(order) && (
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <StatusDropdown
                                                            orderId={order.id}
                                                            field="payment_status"
                                                            currentValue={order.payment_status}
                                                            options={paymentStatusOptions}
                                                            icon={FaCreditCard}
                                                        />
                                                        <StatusDropdown
                                                            orderId={order.id}
                                                            field="order_status"
                                                            currentValue={order.order_status}
                                                            options={orderStatusOptions}
                                                            icon={FaTruck}
                                                        />
                                                    </div>
                                                )}

                                                {/* Order # + date */}
                                                <div className="flex flex-wrap items-baseline gap-2">
                                                    <span className="font-bold text-ink text-sm tracking-wide">{order.order_number}</span>
                                                    <span className="text-xs text-text-soft">{formatDate(order.created_at)} · {formatTime(order.created_at)}</span>
                                                </div>

                                                {/* Meta row */}
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-text-soft">
                                                    <span className="flex items-center gap-1"><FaUser className="h-2.5 w-2.5" />{order.recipient_name}</span>
                                                    <span className="flex items-center gap-1"><FaPhone className="h-2.5 w-2.5" />{order.recipient_phone}</span>
                                                    <span className="flex items-center gap-1"><FaStore className="h-2.5 w-2.5" />{order.store_name}</span>
                                                    <span className="flex items-center gap-1"><FaBox className="h-2.5 w-2.5" />{order.item_quantity} item{order.item_quantity !== 1 ? 's' : ''}</span>
                                                </div>

                                                {/* Product images strip */}
                                                {order.order_items && order.order_items.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-3">
                                                        {order.order_items.slice(0, 6).map(item => (
                                                            <div key={item.id} className="relative flex-shrink-0">
                                                                {item.product_image ? (
                                                                    <img
                                                                        src={getImageUrl(item.product_image)}
                                                                        alt={item.product_name}
                                                                        title={item.product_name}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-line"
                                                                        onError={e => { (e.target as HTMLImageElement).src = '/otherplaceholder.jpg'; }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-lg bg-paper-dim flex items-center justify-center border border-line">
                                                                        <FaImage className="h-4 w-4 text-text-soft" />
                                                                    </div>
                                                                )}
                                                                <div className="absolute -top-1 -right-1 bg-marigold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                                    {item.quantity}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {order.order_items.length > 6 && (
                                                            <div className="w-10 h-10 rounded-lg bg-paper-dim border border-line flex items-center justify-center">
                                                                <span className="text-xs text-text-soft font-medium">+{order.order_items.length - 6}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: price + actions */}
                                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-ink leading-none">
                                                        <FormatPrice price={order.total} />
                                                    </p>
                                                    {order.payment_method === 'cash_on_delivery' && (
                                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                                            COD: <FormatPrice price={order.amount_to_collect} />
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {/* View */}
                                                    <button
                                                        onClick={e => { e.stopPropagation(); router.visit(`/orders/${order.id}/confirmation`); }}
                                                        title="View details"
                                                        className="p-2 text-marigold hover:bg-marigold/10 rounded-xl transition-colors"
                                                    >
                                                        <FaEye className="h-3.5 w-3.5" />
                                                    </button>

                                                    {/* Delete — admin only */}
                                                    {isAdmin && (
                                                        <button
                                                            onClick={e => openDelete(order.id, e)}
                                                            disabled={isDeleting}
                                                            title="Delete order"
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                                                        >
                                                            {isDeleting
                                                                ? <div className="h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                                : <FaTrash className="h-3.5 w-3.5" />}
                                                        </button>
                                                    )}

                                                    {/* Cancel — owner, cancellable */}
                                                    {canCancel(order) && (
                                                        <button
                                                            onClick={e => openCancel(order.id, e)}
                                                            disabled={isCancelling}
                                                            title="Cancel order"
                                                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors disabled:opacity-40"
                                                        >
                                                            {isCancelling
                                                                ? <div className="h-3.5 w-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                                                : <FaBan className="h-3.5 w-3.5" />}
                                                        </button>
                                                    )}

                                                    {/* Locked — non-cancellable */}
                                                    {!isAdmin && isMine(order) &&
                                                        NON_CANCELLABLE_STATUSES.includes(order.order_status) && (
                                                        <span title={`Cannot cancel — order is ${order.order_status}`} className="p-2 text-text-soft cursor-default">
                                                            <FaBan className="h-3.5 w-3.5" />
                                                        </span>
                                                    )}

                                                    {/* Expand chevron */}
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setExpandedId(isOpen ? null : order.id); }}
                                                        className="p-2 text-text-soft hover:text-ink hover:bg-paper-dim rounded-xl transition-colors"
                                                    >
                                                        <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail Panel */}
                                    {isOpen && (
                                        <div className="border-t border-line bg-paper-dim/50 px-5 py-5 rounded-b-2xl">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                                {/* Recipient */}
                                                <div className="bg-white rounded-xl border border-line p-4 shadow-hard-sm">
                                                    <p className="text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3">Recipient</p>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaUser className="h-3 w-3 text-text-soft flex-shrink-0" />
                                                            <span className="font-semibold text-ink">{order.recipient_name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-text-soft">
                                                            <FaEnvelope className="h-3 w-3 text-text-soft flex-shrink-0" />
                                                            <span className="truncate">{order.recipient_email || order.sender_email || '—'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-text-soft">
                                                            <FaPhone className="h-3 w-3 text-text-soft flex-shrink-0" />
                                                            {order.recipient_phone}
                                                        </div>
                                                        <div className="flex items-start gap-2 text-xs text-text-soft leading-relaxed">
                                                            <FaHashtag className="h-3 w-3 text-text-soft flex-shrink-0 mt-0.5" />
                                                            {order.recipient_address}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shipping */}
                                                <div className="bg-white rounded-xl border border-line p-4 shadow-hard-sm">
                                                    <p className="text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3">Shipping</p>
                                                    <div className="space-y-2.5">
                                                        {[
                                                            { label: 'Method',   val: order.shipping_method || '—'   },
                                                            { label: 'Tracking', val: order.tracking_number || 'N/A' },
                                                            { label: 'Payment',  val: order.payment_method           },
                                                            { label: 'Weight',   val: `${order.item_weight} kg`      },
                                                        ].map(row => (
                                                            <div key={row.label} className="flex justify-between text-sm">
                                                                <span className="text-text-soft">{row.label}</span>
                                                                <span className="font-medium text-ink text-xs text-right max-w-[60%] truncate">{row.val}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Summary */}
                                                <div className="bg-white rounded-xl border border-line p-4 shadow-hard-sm">
                                                    <p className="text-[10px] font-mono text-text-soft uppercase tracking-widest mb-3">Summary</p>
                                                    <div className="space-y-2.5 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-text-soft">Subtotal</span>
                                                            <span className="text-ink"><FormatPrice price={order.subtotal} /></span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-text-soft">Delivery</span>
                                                            <span className="text-ink"><FormatPrice price={order.delivery_charge} /></span>
                                                        </div>
                                                        {order.discount_amount > 0 && (
                                                            <div className="flex justify-between text-red-500">
                                                                <span>Discount</span>
                                                                <span>−<FormatPrice price={order.discount_amount} /></span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between pt-2.5 border-t border-line font-bold">
                                                            <span className="text-ink">Total</span>
                                                            <span className="text-marigold"><FormatPrice price={order.total} /></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items table */}
                                            {order.order_items && order.order_items.length > 0 && (
                                                <div className="mt-4 bg-white rounded-xl border border-line overflow-hidden shadow-hard-sm">
                                                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                                                        <p className="text-[10px] font-mono text-text-soft uppercase tracking-widest">
                                                            Order Items
                                                        </p>
                                                        <span className="text-xs text-text-soft">{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-t border-line bg-paper-dim">
                                                                <th className="text-left px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider">Product</th>
                                                                <th className="text-center px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider">Qty</th>
                                                                <th className="text-right px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider">Price</th>
                                                                <th className="text-right px-4 py-2.5 text-[10px] font-mono text-text-soft uppercase tracking-wider">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-line">
                                                            {order.order_items.map(item => (
                                                                <tr key={item.id} className="hover:bg-paper-dim/30 transition-colors">
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            {item.product_image ? (
                                                                                <img
                                                                                    src={getImageUrl(item.product_image)}
                                                                                    alt={item.product_name}
                                                                                    className="w-9 h-9 rounded-lg object-cover border border-line flex-shrink-0"
                                                                                    onError={e => { (e.target as HTMLImageElement).src = '/otherplaceholder.jpg'; }}
                                                                                />
                                                                            ) : (
                                                                                <div className="w-9 h-9 rounded-lg bg-paper-dim flex items-center justify-center flex-shrink-0">
                                                                                    <FaImage className="h-3.5 w-3.5 text-text-soft" />
                                                                                </div>
                                                                            )}
                                                                            <span className="font-medium text-ink truncate">{item.product_name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center text-text-soft">{item.quantity}</td>
                                                                    <td className="px-4 py-3 text-right text-text-soft"><FormatPrice price={item.price} /></td>
                                                                    <td className="px-4 py-3 text-right font-semibold text-ink"><FormatPrice price={item.total} /></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <DeleteConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={closeDelete}
                onConfirm={handleDelete}
                title="Delete Order"
                message="Are you sure you want to delete this order? This action cannot be undone. All order items will also be deleted."
                isDeleting={deletingId === orderToDelete}
            />

            <DeleteConfirmationDialog
                isOpen={isCancelOpen}
                onClose={closeCancel}
                onConfirm={handleCancel}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                isDeleting={cancellingId === orderToCancel}
            />
        </DashboardLayout>
    );
};

export default DashboardOrders;
