// Confirmation.tsx
import { Link } from '@inertiajs/react';
import {
  FaCheckCircle,
  FaShoppingBag,
  FaTruck,
  FaMoneyBill,
  FaPrint,
  FaArrowRight,
  FaStore,
  FaReceipt,
  FaCreditCard,
  FaUser,
  FaClock,
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useEffect } from 'react';
import { Orders, OrderItem } from '@/types';
import FormatPrice from '../utils/FormatePrice';
import Eyebrow from '../Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';


interface OrderProps {
  auth: {
    user: any;
  };
  order: Orders & {
    order_items?: OrderItem[];
  };
  wishlist: any;
}

const Confirmation = ({ auth, order, wishlist }: OrderProps) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('print') === 'true') {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFullDeliveryAddress = () => order.recipient_address;

  const taxAmount = (order.subtotal || 0) * 0.1;
  const items = order.order_items || [];

  const getProductName = (item: any): string => {
    const raw = item.product_name;
    if (!raw) return item.name || 'N/A';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object') return raw.name || raw.product_name || 'N/A';
    return String(raw);
  };

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      {/* Title stays here — it carries the order number — while description,
          robots and canonical come from SeoMeta, which noindexes `orders.*`. */}
      <SeoHead
        title={`Order Confirmation - ${order.order_number}`}
        ogTitle={`Order Confirmation - ${order.order_number}`}
      />

      {/* Print Styles */}
      <style type="text/css" media="print">{`
        @page { size: A4 landscape; margin: 0.3in; }
        .screen-content { display: none !important; }
        .print-excel-content {
          display: block !important;
          background: white !important;
          color: black !important;
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 10pt;
          line-height: 1.2;
          padding: 20px;
          position: absolute;
          left: 0; top: 0; width: 100%;
        }
        nav, header, footer, [role="navigation"] { display: none !important; }
        .excel-header { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .excel-title { font-size: 20pt; font-weight: bold; margin-bottom: 5px; }
        .excel-order-info { font-size: 11pt; display: flex; gap: 30px; }
        .excel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .excel-section { border: 1px solid #999; padding: 10px; margin-bottom: 10px; }
        .excel-section-title { font-weight: bold; background-color: #f0f0f0 !important; padding: 3px 8px; margin: -10px -10px 10px -10px; border-bottom: 1px solid #999; font-size: 11pt; }
        .excel-field { display: flex; margin-bottom: 4px; font-size: 9pt; }
        .excel-label { font-weight: 600; width: 80px; }
        .excel-value { flex: 1; }
        .excel-table { width: 100%; border-collapse: collapse; border: 1px solid #999; margin-bottom: 15px; }
        .excel-table th { background-color: #f0f0f0 !important; font-weight: 600; text-align: left; padding: 5px 8px; border: 1px solid #666; font-size: 9pt; }
        .excel-table td { padding: 4px 8px; border: 1px solid #ccc; font-size: 9pt; }
        .excel-table td.right { text-align: right; }
        .excel-table td.center { text-align: center; }
        .excel-summary { width: 40%; margin-left: auto; border-collapse: collapse; }
        .excel-summary td { padding: 4px 8px; border: 1px solid #ccc; }
        .excel-summary tr:last-child td { font-weight: bold; border-top: 2px solid #000; }
        .excel-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #999; font-size: 8pt; text-align: center; }
      `}</style>

      {/* Print View */}
      <div className="print-excel-content" style={{ display: 'none' }}>
        <div className="excel-header">
          <div className="excel-title">HaatPoint</div>
          <div className="excel-order-info">
            <span>Order #: {order.order_number}</span>
            <span>Date: {formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className="excel-grid">
          <div className="excel-section">
            <div className="excel-section-title">CUSTOMER INFORMATION</div>
            <div className="excel-field"><span className="excel-label">Name:</span><span className="excel-value">{order.recipient_name}</span></div>
            <div className="excel-field"><span className="excel-label">Phone:</span><span className="excel-value">{order.recipient_phone}</span></div>
            <div className="excel-field"><span className="excel-label">Email:</span><span className="excel-value">{order.sender_email}</span></div>
            <div className="excel-field" style={{ marginTop: '5px' }}><span className="excel-label">Address:</span><span className="excel-value">{getFullDeliveryAddress()}</span></div>
          </div>

          <div className="excel-section">
            <div className="excel-section-title">ORDER DETAILS</div>
            <div className="excel-field"><span className="excel-label">Store:</span><span className="excel-value">{order.store_name}</span></div>
            <div className="excel-field"><span className="excel-label">Store Phone:</span><span className="excel-value">{order.sender_phone}</span></div>
            <div className="excel-field"><span className="excel-label">Payment:</span><span className="excel-value">{order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash'}</span></div>
            <div className="excel-field"><span className="excel-label">Pay Status:</span><span className="excel-value">{order.payment_status}</span></div>
          </div>

          <div className="excel-section">
            <div className="excel-section-title">DELIVERY INFORMATION</div>
            <div className="excel-field"><span className="excel-label">Method:</span><span className="excel-value">{order.shipping_method}</span></div>
            <div className="excel-field"><span className="excel-label">Charge:</span><span className="excel-value"><FormatPrice price={order.delivery_charge} /></span></div>
            {order.tracking_number && <div className="excel-field"><span className="excel-label">Tracking:</span><span className="excel-value">{order.tracking_number}</span></div>}
            {order.special_instruction && <div className="excel-field" style={{ marginTop: '5px' }}><span className="excel-label">Note:</span><span className="excel-value">{order.special_instruction}</span></div>}
          </div>
        </div>

        <div className="excel-section">
          <div className="excel-section-title">ORDER ITEMS</div>
          <table className="excel-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Product Name</th>
                <th style={{ width: '10%' }}>Quantity</th>
                <th style={{ width: '15%' }}>Unit Price</th>
                <th style={{ width: '15%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    {getProductName(item)}
                    {(item.color || item.size) && (
                      <div style={{ fontSize: '8pt', color: '#555' }}>
                        {item.color || ''}{item.color && item.size ? ' · ' : ''}{item.size || ''}
                      </div>
                    )}
                  </td>
                  <td className="center">{item.quantity}</td>
                  <td className="right"><FormatPrice price={item.price} /></td>
                  <td className="right"><FormatPrice price={item.total} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="excel-summary">
            <tbody>
              <tr><td>Subtotal</td><td className="right"><FormatPrice price={order.subtotal} /></td></tr>
              <tr><td>Delivery Charge</td><td className="right"><FormatPrice price={order.delivery_charge} /></td></tr>
              <tr><td>Tax (10%)</td><td className="right"><FormatPrice price={taxAmount} /></td></tr>
              {order.discount_amount > 0 && (
                <tr>
                  <td>Discount {order.coupon_code && `(${order.coupon_code})`}</td>
                  <td className="right">-<FormatPrice price={order.discount_amount} /></td>
                </tr>
              )}
              <tr><td>TOTAL</td><td className="right"><FormatPrice price={order.total} /></td></tr>
              {order.payment_method === 'cash_on_delivery' && (
                <tr>
                  <td>Amount to Collect (COD)</td>
                  <td className="right" style={{ fontWeight: 'bold' }}><FormatPrice price={order.amount_to_collect} /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="excel-footer">
          <div>Thank you for your business!</div>
          <div>Generated on: {new Date().toLocaleString('en-BD')}</div>
        </div>
      </div>

      {/* Screen View */}
      <div className="screen-content">
        <div className="min-h-screen bg-paper-dim py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-green-200 rounded-full opacity-20 animate-ping"></div>
                </div>
                <div className="relative w-20 h-20 rounded-full bg-marigold flex items-center justify-center mx-auto mb-4 shadow-hard-sm">
                  <FaCheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>

              <Eyebrow>Order confirmed</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Thank You!</h1>
              <p className="text-text-soft max-w-2xl mx-auto mt-2">
                Your order has been placed successfully.{' '}
                {order.payment_method === 'cash_on_delivery' ? (
                  <>Pay <FormatPrice price={order.amount_to_collect} /> on delivery.</>
                ) : (
                  'Payment being processed.'
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center px-3 py-1 bg-marigold/10 text-marigold rounded-full text-xs font-medium border border-marigold/20">
                  <FaReceipt className="h-3 w-3 mr-1" />
                  {order.order_number}
                </span>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
                >
                  <FaPrint className="h-4 w-4" />
                  Print Invoice
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-display font-extrabold uppercase text-white flex items-center">
                      <FaShoppingBag className="h-5 w-5 mr-2" />
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-line">
                          <th className="text-left py-2 text-xs font-mono text-text-soft uppercase tracking-wide">Item</th>
                          <th className="text-center py-2 text-xs font-mono text-text-soft uppercase tracking-wide">Qty</th>
                          <th className="text-right py-2 text-xs font-mono text-text-soft uppercase tracking-wide">Price</th>
                          <th className="text-right py-2 text-xs font-mono text-text-soft uppercase tracking-wide">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="border-b border-line">
                            <td className="py-3 text-sm">
                              <span className="font-medium text-ink">{getProductName(item)}</span>
                              {(item.color || item.size) && (
                                <div className="text-xs text-text-soft mt-0.5 capitalize">
                                  {item.color || ''}{item.color && item.size ? ' · ' : ''}{item.size || ''}
                                </div>
                              )}
                            </td>
                            <td className="py-3 text-sm text-center text-text-soft">{item.quantity}</td>
                            <td className="py-3 text-sm text-right text-text-soft"><FormatPrice price={item.price} /></td>
                            <td className="py-3 text-sm text-right font-medium text-ink"><FormatPrice price={item.total} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Price Summary */}
                    <div className="mt-4 pt-4 border-t border-line">
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-text-soft">Subtotal</span>
                        <span className="font-medium text-ink"><FormatPrice price={order.subtotal} /></span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-text-soft">Shipping</span>
                        <span className="font-medium text-ink"><FormatPrice price={order.delivery_charge} /></span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-text-soft">Tax (10%)</span>
                        <span className="font-medium text-ink"><FormatPrice price={taxAmount} /></span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-text-soft">Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                          <span className="font-medium text-green-600">-<FormatPrice price={order.discount_amount} /></span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t border-line">
                        <span className="text-ink">Total</span>
                        <span className="text-marigold"><FormatPrice price={order.total} /></span>
                      </div>
                      {order.payment_method === 'cash_on_delivery' && (
                        <div className="mt-3 p-3 bg-marigold/5 rounded-xl border border-marigold/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-text-soft">Amount to collect on delivery</span>
                            <span className="text-lg font-bold text-marigold">
                              <FormatPrice price={order.amount_to_collect} />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="mt-4 pt-4 border-t border-line flex items-center">
                      <div className="w-10 h-10 rounded-full bg-paper-dim flex items-center justify-center mr-3 border border-line">
                        {order.payment_method === 'cash_on_delivery'
                          ? <FaMoneyBill className="h-5 w-5 text-marigold" />
                          : <FaCreditCard className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'bKash'}
                        </p>
                        {order.payment_method === 'cash_on_delivery' && (
                          <p className="text-xs text-text-soft">Pay when you receive your order</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Customer */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-marigold to-marigold-dark px-5 py-3">
                    <h3 className="text-white font-display font-extrabold uppercase text-sm flex items-center">
                      <FaUser className="h-4 w-4 mr-2" />
                      Customer
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-text-soft">Name:</span> <span className="text-ink font-medium">{order.recipient_name}</span></p>
                      <p><span className="text-text-soft">Phone:</span> <span className="text-ink">{order.recipient_phone}</span></p>
                      <p><span className="text-text-soft">Email:</span> <span className="text-ink">{order.recipient_email}</span></p>
                      <p className="pt-2 border-t border-line">
                        <span className="text-text-soft">Order #:</span> <span className="text-ink font-medium">{order.order_number}</span>
                      </p>
                      <p><span className="text-text-soft">Date:</span> <span className="text-ink">{formatDate(order.created_at)}</span></p>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3">
                    <h3 className="text-white font-display font-extrabold uppercase text-sm flex items-center">
                      <FaTruck className="h-4 w-4 mr-2" />
                      Delivery
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-text-soft">Address:</span> <span className="text-ink">{getFullDeliveryAddress()}</span></p>
                      <p><span className="text-text-soft">Method:</span> <span className="text-ink">{order.shipping_method === 'pathao' ? 'Pathao' : 'Standard'}</span></p>
                      {order.tracking_number && (
                        <p><span className="text-text-soft">Tracking:</span> <span className="text-ink font-mono">{order.tracking_number}</span></p>
                      )}
                      {order.special_instruction && (
                        <p className="pt-2 border-t border-line">
                          <span className="text-text-soft">Note:</span> <span className="text-ink">{order.special_instruction}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Store */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3">
                    <h3 className="text-white font-display font-extrabold uppercase text-sm flex items-center">
                      <FaStore className="h-4 w-4 mr-2" />
                      Store
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-ink">{order.store_name}</p>
                      <p><span className="text-text-soft">Email:</span> <span className="text-ink">{order.sender_email}</span></p>
                      <p><span className="text-text-soft">Phone:</span> <span className="text-ink">{order.sender_phone}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-4 bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-5 py-3">
                  <h3 className="text-white font-display font-extrabold uppercase text-sm">Notes</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-text-soft">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mt-4 bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
                <h3 className="text-white font-display font-extrabold uppercase text-sm flex items-center">
                  <FaClock className="h-4 w-4 mr-2" />
                  Timeline
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-text-soft">Confirmed {formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'} mr-1`}></div>
                    <span className="text-text-soft">Processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'shipped' ? 'bg-indigo-500' : 'bg-gray-300'} mr-1`}></div>
                    <span className="text-text-soft">Shipped</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></div>
                    <span className="text-text-soft">Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={route('dashboard.orders')}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-text-soft hover:text-ink border border-line rounded-xl hover:bg-paper-dim transition-all duration-300 text-sm font-medium"
              >
                <FaShoppingBag className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm font-medium"
              >
                Continue Shopping
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Confirmation;
