// Payments.tsx
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaBox,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaUser,
  FaCreditCard,
  FaAddressCard
} from 'react-icons/fa';
import { PageProps } from '@/types';
import { Orders } from '@/types';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface PaymentsProps extends PageProps {
  orders: Orders[];
  userRole?: string;
}

const getPaymentBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: 'Paid', cls: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', cls: 'bg-gray-100 text-gray-800' },
  };
  return map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-800' };
};

const getOrderBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', cls: 'bg-blue-100 text-blue-800' },
    confirmed: { label: 'Confirmed', cls: 'bg-indigo-100 text-indigo-800' },
    shipped: { label: 'Shipped', cls: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Delivered', cls: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-800' },
  };
  return map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-800' };
};

const Payments: React.FC<PaymentsProps> = ({ orders = [], auth }) => {
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const totalPaid = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPending = orders.filter(o => o.payment_status !== 'paid').reduce((sum, o) => sum + o.total, 0);

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Payment Management" />

      <div className="bg-paper-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Manage payments</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Payments</h1>
              <p className="text-text-soft mt-1">Orders with paid payment status</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Paid Orders</p>
                  <p className="text-2xl font-bold text-ink mt-1">{paidOrders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Paid Amount</p>
                  <p className="text-2xl font-bold text-ink mt-1"><FormatPrice price={totalPaid} /></p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Unpaid Amount</p>
                  <p className="text-2xl font-bold text-ink mt-1"><FormatPrice price={totalPending} /></p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <FaClock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Paid Orders</h2>
                  <span className="text-sm text-text-soft font-mono">{orders.length} orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCreditCard className="h-16 w-16 text-text-soft mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink mb-2">No Payment Orders</h3>
                    <p className="text-text-soft">Orders will appear here once payment status is set to paid.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const paymentBadge = getPaymentBadge(order.payment_status);
                      const orderBadge = getOrderBadge(order.order_status);
                      const isPaid = order.payment_status === 'paid';
                      return (
                        <div
                          key={order.id}
                          className={`border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${
                            selectedOrder?.id === order.id ? 'ring-2 ring-marigold bg-marigold/5' : ''
                          } ${isPaid ? 'border-green-200' : ''}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-bold text-ink">Order #{order.order_number}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentBadge.cls}`}>
                                      {isPaid ? <FaCheckCircle className="h-3 w-3" /> : <FaExclamationTriangle className="h-3 w-3" />}
                                      <span>{paymentBadge.label}</span>
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${orderBadge.cls}`}>
                                      {orderBadge.label}
                                    </span>
                                  </div>
                                  <p className="text-sm text-text-soft mt-1">
                                    <FaCalendarAlt className="h-3 w-3 inline mr-1" />
                                    Placed: {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="font-bold text-ink">
                                    <FormatPrice price={order.total} />
                                  </p>
                                  <p className="text-xs text-text-soft">Total Amount</p>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center text-sm text-text-soft mb-1">
                                  <FaUser className="h-3 w-3 mr-2" />
                                  <span className="font-medium text-ink">{order.recipient_name}</span>
                                </div>
                                <div className="flex items-center text-sm text-text-soft">
                                  <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                                  <span>{order.recipient_address}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div className="p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center">
                                    <FaBox className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft">Items</span>
                                  </div>
                                  <p className="font-medium text-ink text-sm">{order.item_quantity}</p>
                                </div>
                                <div className="p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center">
                                    <FaCreditCard className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft">Payment</span>
                                  </div>
                                  <p className="font-medium text-ink text-sm capitalize">{order.payment_method?.replace(/_/g, ' ')}</p>
                                </div>
                                <div className="p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center">
                                    <FaAddressCard className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft">Store</span>
                                  </div>
                                  <p className="font-medium text-ink text-sm truncate">{order.store_name}</p>
                                </div>
                                <div className="p-2 bg-paper-dim rounded-xl">
                                  <div className="flex items-center">
                                    <FaDollarSign className="h-3 w-3 text-text-soft mr-1" />
                                    <span className="text-xs text-text-soft">Delivery</span>
                                  </div>
                                  <p className="font-medium text-ink text-sm">
                                    <FormatPrice price={order.delivery_charge} />
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Order Details Sidebar */}
            <div className="space-y-6">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Payment Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 text-text-soft hover:text-marigold rounded-lg hover:bg-paper-dim transition-colors"
                    >
                      <FaUser className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-ink">Order #{selectedOrder.order_number}</h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadge(selectedOrder.payment_status).cls}`}>
                            {getPaymentBadge(selectedOrder.payment_status).label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOrderBadge(selectedOrder.order_status).cls}`}>
                            {getOrderBadge(selectedOrder.order_status).label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ink">
                          <FormatPrice price={selectedOrder.total} />
                        </p>
                        <p className="text-sm text-text-soft">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Customer Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaUser className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.recipient_name}</p>
                          <p className="text-xs text-text-soft">Customer Name</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaEnvelope className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.recipient_email}</p>
                          <p className="text-xs text-text-soft">Email Address</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                        <FaPhone className="h-4 w-4 text-text-soft mr-3" />
                        <div>
                          <p className="font-medium text-ink">{selectedOrder.recipient_phone}</p>
                          <p className="text-xs text-text-soft">Phone Number</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Delivery Address</h5>
                    <div className="p-3 bg-marigold/5 rounded-xl border border-marigold/20">
                      <div className="flex items-center mb-2">
                        <FaMapMarkerAlt className="h-4 w-4 text-marigold mr-2" />
                        <span className="font-medium text-ink">Address</span>
                      </div>
                      <p className="text-sm text-text-soft">{selectedOrder.recipient_address}</p>
                      <p className="text-xs text-text-soft mt-2">City: {selectedOrder.recipient_city} • Zone: {selectedOrder.recipient_zone} • Area: {selectedOrder.recipient_area}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Payment Breakdown</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                        <span className="text-sm text-text-soft">Subtotal</span>
                        <span className="font-medium text-ink"><FormatPrice price={selectedOrder.subtotal} /></span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                        <span className="text-sm text-text-soft">Delivery Charge</span>
                        <span className="font-medium text-ink"><FormatPrice price={selectedOrder.delivery_charge} /></span>
                      </div>
                      {Number(selectedOrder.discount_amount) > 0 && (
                        <div className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                          <span className="text-sm text-text-soft">Discount</span>
                          <span className="font-medium text-ink">-<FormatPrice price={selectedOrder.discount_amount} /></span>
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                        <span className="text-sm font-medium text-green-800">Total</span>
                        <span className="font-bold text-green-800"><FormatPrice price={selectedOrder.total} /></span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Order Items ({selectedOrder.order_items.length})</h5>
                      <div className="space-y-2">
                        {selectedOrder.order_items.map(item => (
                          <div key={item.id} className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                            <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-line">
                              <img
                                src={item.product_image ? (item.product_image.startsWith('http') || item.product_image.startsWith('/') ? item.product_image : `/storage/${item.product_image}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-ink text-sm">{item.product_name}</p>
                              <p className="text-xs text-text-soft">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-ink">
                                <FormatPrice price={item.total} />
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                  <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4">Payment Details</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Select an order from the list to view detailed payment information, delivery details, and customer information.
                  </p>
                  <div className="text-center">
                    <FaCreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-gray-400">No order selected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payments;