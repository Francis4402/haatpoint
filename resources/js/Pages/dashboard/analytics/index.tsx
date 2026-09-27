// Analytics.tsx
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaDollarSign,
  FaShoppingCart,
  FaPercent,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBoxOpen,
  FaTags,
  FaStore,
  FaChartLine,
  FaChartPie,
  FaTruck,
  FaBoxes
} from 'react-icons/fa';
import FormatPrice from '@/Pages/utils/FormatePrice';
import Eyebrow from '@/Pages/Components/Eyebrow';

interface SellByProduct {
  name: string;
  qty: number;
  revenue: number;
  image: string | null;
}

interface Metrics {
  role: 'admin' | 'agent';
  isAdmin: boolean;
  // admin only
  totalProfit?: number;
  profitCommissionRate?: number;
  profitOrdersCount?: number;
  totalSells?: number;
  totalProductsSold?: number;
  // shared
  totalOrders?: number;
  deliveredOrders?: number;
  pendingOrders?: number;
  cancelledOrders?: number;
  paidOrders?: number;
  // agent only
  totalRevenue?: number;
  conversionRate?: number;
  // product breakdown
  sellByProduct: SellByProduct[];
}

interface AnalyticsProps {
  auth: { user: any };
  metrics: Metrics | null;
  userRole?: string;
}

const Analytics = ({ auth, metrics }: AnalyticsProps) => {
  const isAdmin = metrics?.isAdmin;

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Analytics" />

      <div className="bg-paper-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Performance insights</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Analytics</h1>
              <p className="text-text-soft mt-1">
                {isAdmin
                  ? 'Platform revenue from delivered & paid orders'
                  : 'Your store sales, revenue and conversion'
                }
              </p>
            </div>
          </div>

          {/* Key Metrics — Admin */}
          {isAdmin && metrics && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Platform Profit (Total Revenue) */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue (Profit)</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        <FormatPrice price={metrics.totalProfit ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <span className="font-medium text-sm">
                          {metrics.profitCommissionRate}% of subtotal • {metrics.profitOrdersCount} delivered & paid
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                      <FaDollarSign className="h-6 w-6 text-marigold" />
                    </div>
                  </div>
                </div>

                {/* Total Sells */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Sells (Delivered)</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        <FormatPrice price={metrics.totalSells ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaBoxes className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">{metrics.totalProductsSold} products delivered</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Delivered & Paid Orders */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Delivered & Paid Orders</p>
                      <p className="text-2xl font-bold text-ink mt-1">{metrics.profitOrdersCount}</p>
                      <div className="flex items-center mt-2 text-green-600">
                        <FaCheckCircle className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">{metrics.paidOrders} paid</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaCheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Order Status Mix */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Order Status</p>
                      <p className="text-2xl font-bold text-ink mt-1">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaClock className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">
                          {metrics.deliveredOrders} delivered • {metrics.cancelledOrders} cancelled
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <FaChartPie className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2">
                  <FaBoxOpen className="h-5 w-5 text-marigold" /> Top Selling Products
                </h3>
                {metrics.sellByProduct && metrics.sellByProduct.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-line">
                      <thead className="bg-paper-dim">
                        <tr>
                          {['Product', 'Quantity Sold', 'Revenue'].map(col => (
                            <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-line">
                        {metrics.sellByProduct.map(product => (
                          <tr key={product.name} className="hover:bg-paper-dim/50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-10 w-10 object-cover rounded border border-line"
                                  />
                                )}
                                <span className="text-sm font-medium text-ink">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{product.qty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                              <FormatPrice price={product.revenue} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBoxOpen className="mx-auto h-12 w-12 text-text-soft" />
                    <h3 className="mt-2 text-sm font-medium text-ink">No delivered & paid products yet</h3>
                    <p className="mt-1 text-sm text-text-soft">Revenue shows once orders are delivered and paid.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Key Metrics — Agent */}
          {!isAdmin && metrics && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Revenue (Delivered & Paid)</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        <FormatPrice price={metrics.totalRevenue ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <FaCheckCircle className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">{metrics.deliveredOrders} delivered & paid</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                      <FaDollarSign className="h-6 w-6 text-marigold" />
                    </div>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Conversion Rate</p>
                      <p className="text-2xl font-bold text-ink mt-1">{metrics.conversionRate}%</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaChartLine className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">delivered & paid / total orders</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaPercent className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</p>
                      <p className="text-2xl font-bold text-ink mt-1">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaShoppingCart className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">orders placed on your store</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaShoppingCart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Order Status Mix */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Order Status</p>
                      <p className="text-2xl font-bold text-ink mt-1">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaClock className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">
                          {metrics.pendingOrders} pending • {metrics.cancelledOrders} cancelled
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <FaChartPie className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6 flex items-center gap-2">
                  <FaStore className="h-5 w-5 text-marigold" /> Top Selling Products
                </h3>
                {metrics.sellByProduct && metrics.sellByProduct.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-line">
                      <thead className="bg-paper-dim">
                        <tr>
                          {['Product', 'Quantity Sold', 'Revenue'].map(col => (
                            <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-line">
                        {metrics.sellByProduct.map(product => (
                          <tr key={product.name} className="hover:bg-paper-dim/50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-10 w-10 object-cover rounded border border-line"
                                  />
                                )}
                                <span className="text-sm font-medium text-ink">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{product.qty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                              <FormatPrice price={product.revenue} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaStore className="mx-auto h-12 w-12 text-text-soft" />
                    <h3 className="mt-2 text-sm font-medium text-ink">No delivered & paid products yet</h3>
                    <p className="mt-1 text-sm text-text-soft">Revenue shows once your orders are delivered and paid.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {!metrics && (
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
              <div className="text-center py-12">
                <FaChartLine className="mx-auto h-12 w-12 text-text-soft" />
                <h3 className="mt-2 text-sm font-medium text-ink">No analytics available</h3>
                <p className="mt-1 text-sm text-text-soft">Analytics are available for admins and agents.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;