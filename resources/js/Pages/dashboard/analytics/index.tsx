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
  original?: number;
  profit?: number;
  image: string | null;
}

interface Metrics {
  role: 'admin' | 'agent';
  isAdmin: boolean;
  // admin only
  totalProfit?: number;
  originalRevenue?: number;
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
  store?: {
    id: string;
    name: string;
  };
}

function resolveProductImage(images: string | null | undefined): string {
  if (!images) return '';
  try {
    const cleanString = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(cleanString);
    const imagePath = Array.isArray(parsed) ? parsed[0] : parsed;
    if (typeof imagePath === 'string' && imagePath.length > 0) {
      return imagePath.startsWith('http') || imagePath.startsWith('/') ? imagePath : `/storage/${imagePath}`;
    }
  } catch {
    // not JSON
  }
  const trimmed = images.trim();
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed;
  return `/storage/${trimmed}`;
}

const Analytics = ({ auth, metrics, store }: AnalyticsProps) => {
  const isAdmin = metrics?.isAdmin;

  return (
    <DashboardLayout user={auth.user}>
      <Head title={store ? `${store.name} Analytics` : "Analytics"} />

      <div className="bg-paper-dim">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>{store ? store.name : "Performance insights"}</Eyebrow>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-ink break-words">
                {store ? `${store.name} Analytics` : "Analytics"}
              </h1>
              <p className="text-text-soft text-xs sm:text-sm mt-1">
                {isAdmin
                  ? 'Platform revenue from delivered & paid orders'
                  : store
                  ? `Performance metrics and top selling products for ${store.name}`
                  : 'Your store sales, revenue and conversion'
                }
              </p>
            </div>
          </div>

          {/* Key Metrics — Admin */}
          {isAdmin && metrics && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-8">
                {/* Platform Profit (Total Revenue) */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">10% Profit</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">
                        <FormatPrice price={metrics.totalProfit ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <span className="font-medium text-xs sm:text-sm leading-snug">
                          {metrics.profitCommissionRate}% of subtotal • {metrics.profitOrdersCount} delivered & paid
                        </span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-marigold/10 flex items-center justify-center shrink-0">
                      <FaDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-marigold" />
                    </div>
                  </div>
                </div>

                {/* Original (Agent) Price */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Original Price</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">
                        <FormatPrice price={metrics.originalRevenue ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaTags className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">Agent price • delivered & paid</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <FaTags className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Total Sells */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Sells (Delivered)</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">
                        <FormatPrice price={metrics.totalSells ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaBoxes className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">{metrics.totalProductsSold} products delivered</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <FaShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Delivered & Paid Orders */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Delivered & Paid Orders</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">{metrics.profitOrdersCount}</p>
                      <div className="flex items-center mt-2 text-green-600">
                        <FaCheckCircle className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">{metrics.paidOrders} paid</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                      <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Order Status Mix */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Order Status</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaClock className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">
                          {metrics.deliveredOrders} delivered • {metrics.cancelledOrders} cancelled
                        </span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <FaChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 mb-8 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 sm:mb-6 flex items-center gap-2">
                  <FaBoxOpen className="h-5 w-5 text-marigold shrink-0" /> Top Selling Products
                </h3>
                {metrics.sellByProduct && metrics.sellByProduct.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-line">
                      <thead className="bg-paper-dim">
                        <tr>
                          {['Product', 'Quantity Sold', 'Original Price', '10% Profit', 'Customer Price'].map(col => (
                            <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-line">
                        {metrics.sellByProduct.map(product => {
                          const imgSrc = resolveProductImage(product.image);
                          return (
                            <tr key={product.name} className="hover:bg-paper-dim/50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={product.name}
                                      className="h-10 w-10 object-cover rounded-lg border border-line flex-shrink-0"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-paper-dim border border-line flex items-center justify-center flex-shrink-0 text-text-soft">
                                      <FaBoxOpen className="h-5 w-5" />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-ink max-w-[280px] truncate" title={product.name}>
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{product.qty}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                                <FormatPrice price={product.original ?? product.revenue} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-marigold">
                                +<FormatPrice price={product.profit ?? 0} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                                <FormatPrice price={product.revenue} />
                              </td>
                            </tr>
                          );
                        })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Profit (Your Price)</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">
                        <FormatPrice price={metrics.totalRevenue ?? 0} />
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <FaCheckCircle className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">{metrics.deliveredOrders} delivered & paid • original price</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-marigold/10 flex items-center justify-center shrink-0">
                      <FaDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-marigold" />
                    </div>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Conversion Rate</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">{metrics.conversionRate}%</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaChartLine className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">delivered & paid / total orders</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <FaPercent className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Orders</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaShoppingCart className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">orders placed on your store</span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                      <FaShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Order Status Mix */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Order Status</p>
                      <p className="text-xl sm:text-2xl font-bold text-ink mt-1 truncate">{metrics.totalOrders}</p>
                      <div className="flex items-center mt-2 text-text-soft">
                        <FaClock className="h-3 w-3 mr-1 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm leading-snug">
                          {metrics.pendingOrders} pending • {metrics.cancelledOrders} cancelled
                        </span>
                      </div>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <FaChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-4 sm:p-6 mb-8 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4 sm:mb-6 flex items-center gap-2">
                  <FaStore className="h-5 w-5 text-marigold shrink-0" /> Top Selling Products
                </h3>
                {metrics.sellByProduct && metrics.sellByProduct.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-line">
                      <thead className="bg-paper-dim">
                        <tr>
                          {['Product', 'Quantity Sold', 'Your Price', 'Customer Price (+10%)'].map(col => (
                            <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-mono text-text-soft uppercase tracking-wide">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-line">
                        {metrics.sellByProduct.map(product => {
                          const imgSrc = resolveProductImage(product.image);
                          return (
                            <tr key={product.name} className="hover:bg-paper-dim/50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={product.name}
                                      className="h-10 w-10 object-cover rounded-lg border border-line flex-shrink-0"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-paper-dim border border-line flex items-center justify-center flex-shrink-0 text-text-soft">
                                      <FaBoxOpen className="h-5 w-5" />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-ink max-w-[280px] truncate" title={product.name}>
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">{product.qty}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                                <FormatPrice price={product.original ?? product.revenue} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-soft">
                                <FormatPrice price={product.revenue} />
                              </td>
                            </tr>
                          );
                        })}
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