
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaUser,
  FaWeightHanging,
  FaShippingFast
} from 'react-icons/fa';
import { PageProps } from '@/types';
import { Orders } from '@/types';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface ShippingProps extends PageProps {
  orders: Orders[];
  userRole?: string;
}

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

const resolveImage = (raw: string | null | undefined): string => {
  if (!raw) return '';
  if (raw.startsWith('http') || raw.startsWith('/')) return raw;
  return `/storage/${raw}`;
};

const Shipping: React.FC<ShippingProps> = ({ orders = [], auth }) => {
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

  const shippedOrders = orders.filter(o => o.order_status === 'shipped');
  const itemsInTransit = shippedOrders.reduce((sum, o) => sum + (o.order_items?.length ?? 0), 0);

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Shipping Management" />

      <div className="bg-paper-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Manage shipping</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Shipping</h1>
              <p className="text-text-soft mt-1">Orders with shipped order status</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Shipped Orders</p>
                  <p className="text-2xl font-bold text-ink mt-1">{shippedOrders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FaTruck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Products In Transit</p>
                  <p className="text-2xl font-bold text-ink mt-1">{itemsInTransit}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FaShippingFast className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total In Transit</p>
                  <p className="text-2xl font-bold text-ink mt-1">
                    <FormatPrice price={shippedOrders.reduce((sum, o) => sum + (o.total || 0), 0)} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>
          </div>

          {/* Products grid for shipped orders */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Shipped Products</h2>
              <span className="text-sm text-text-soft font-mono">{itemsInTransit} products</span>
            </div>

            {shippedOrders.length === 0 ? (
              <div className="text-center py-12">
                <FaBox className="h-16 w-16 text-text-soft mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">No Shipped Products</h3>
                <p className="text-text-soft">Products will appear here once the order status is set to shipped.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shippedOrders.flatMap(order =>
                  (order.order_items ?? []).map(item => (
                    <div
                      key={item.id}
                      className="border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 bg-white"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-line flex-shrink-0 bg-paper-dim">
                          <img
                            src={resolveImage(item.product_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink truncate">{item.product_name}</p>
                          <p className="text-xs text-text-soft mt-0.5">
                            <FaBox className="h-3 w-3 inline mr-1" />Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-ink mt-1"><FormatPrice price={item.total} /></p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-text-soft truncate mr-2">Order #{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getOrderBadge(order.order_status).cls}`}>
                          <FaCheckCircle className="h-3 w-3" />
                          {getOrderBadge(order.order_status).label}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Order Details Sidebar */}
          <div className="mb-6">
            {selectedOrder && (
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 text-text-soft hover:text-marigold rounded-lg hover:bg-paper-dim transition-colors"
                  >
                    <FaUser className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-ink">Order #{selectedOrder.order_number}</h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getOrderBadge(selectedOrder.order_status).cls}`}>
                              <FaTruck className="h-3 w-3" />
                              <span>{getOrderBadge(selectedOrder.order_status).label}</span>
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              selectedOrder.payment_status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedOrder.payment_status === 'paid' ? 'Paid' : selectedOrder.payment_status}
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

                  <div>
                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Shipping Information</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-marigold/5 rounded-xl border border-marigold/20">
                        <div className="flex items-center mb-2">
                          <FaMapMarkerAlt className="h-4 w-4 text-marigold mr-2" />
                          <span className="font-medium text-ink">Delivery Address</span>
                        </div>
                        <p className="text-sm text-text-soft">{selectedOrder.recipient_address}</p>
                        <p className="text-xs text-text-soft mt-2">City: {selectedOrder.recipient_city} • Zone: {selectedOrder.recipient_zone} • Area: {selectedOrder.recipient_area}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Shipping Method</p>
                          <p className="font-medium text-ink capitalize">{selectedOrder.shipping_method?.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Tracking Number</p>
                          <p className="font-medium text-ink truncate" title={selectedOrder.tracking_number}>
                            {selectedOrder.tracking_number || '—'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Item Weight</p>
                          <p className="font-medium text-ink">
                            <FaWeightHanging className="h-3 w-3 inline mr-1 text-text-soft" />
                            {selectedOrder.item_weight} kg
                          </p>
                        </div>
                        <div className="p-3 bg-paper-dim rounded-xl border border-line">
                          <p className="text-xs text-text-soft">Item Quantity</p>
                          <p className="font-medium text-ink"><FaBox className="h-3 w-3 inline mr-1 text-text-soft" />{selectedOrder.item_quantity}</p>
                        </div>
                      </div>
                    </div>

                    <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3 mt-6">Order Items ({selectedOrder.order_items?.length ?? 0})</h5>
                    <div className="space-y-2">
                      {(selectedOrder.order_items ?? []).map(item => (
                        <div key={item.id} className="flex items-center p-3 bg-paper-dim rounded-xl border border-line">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-line">
                            <img
                            src={resolveImage(item.product_image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product_name)}&background=random`}
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
                </div>
              </div>
            )}
          </div>

          {!selectedOrder && shippedOrders.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white">
              <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-2">Select a product or order</h3>
              <p className="text-sm text-gray-300">
                Click on any shipped product above to view detailed shipping information, tracking details, and customer information.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Shipping;
