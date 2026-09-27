// Customers.tsx
import { useEffect, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaUsers,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaDollarSign,
  FaStar,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaEye,
  FaEdit,
  FaUserShield,
  FaUserCog,
  FaBan,
} from 'react-icons/fa';
import { CustomerType } from '@/types';
import Eyebrow from '@/Pages/Components/Eyebrow';
import FormatPrice from '@/Pages/utils/FormatePrice';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';


interface PageTypes {
  customers: CustomerType[];
  auth: {
    user: any;
  };
}

const Customers: React.FC<PageTypes> = ({ customers: initialCustomers, auth }) => {
  const customers = initialCustomers || [];
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [actionCandidate, setActionCandidate] = useState<{
    customer: CustomerType;
    action: 'admin' | 'agent' | 'user' | 'block' | 'unblock' | 'delete';
  } | null>(null);

  const actionMeta = {
    admin: {
      title: 'Promote to Admin',
      message: 'will be promoted to admin and given admin dashboard access using their current password.',
      endpoint: 'promote',
      variant: 'info',
      verb: 'promote',
    },
    agent: {
      title: 'Make Agent',
      message: 'will be converted to an agent. Their stores will transfer to the agent account and they will keep their password.',
      endpoint: 'make-agent',
      variant: 'info',
      verb: 'convert to an agent',
    },
    user: {
      title: 'Make Customer',
      message: 'will be reverted to a customer. Their agent store ownership will be detached.',
      endpoint: 'make-user',
      variant: 'info',
      verb: 'revert to a customer',
    },
    block: {
      title: 'Block Account',
      message: 'will be blocked and will not be able to log in until an admin unblocks them.',
      endpoint: 'block',
      variant: 'warning',
      verb: 'block',
    },
    unblock: {
      title: 'Unblock Account',
      message: 'will be unblocked and will be able to log in again.',
      endpoint: 'block',
      variant: 'info',
      verb: 'unblock',
    },
    delete: {
      title: 'Delete Account',
      message: 'will be permanently deleted. Orders, stores and products linked to the account will remain but will be detached from them.',
      endpoint: 'delete',
      variant: 'danger',
      verb: 'permanently delete',
    },
  } as const;

  const resourceType = (role: CustomerType['role']) =>
    role === 'superadmin' || role === 'admin' ? 'admin' : role === 'agent' ? 'agent' : 'user';

  const requestUrl = (candidate: NonNullable<typeof actionCandidate>) => {
    const { customer, action } = candidate;
    if (action === 'delete' || action === 'block' || action === 'unblock') {
      const type = resourceType(customer.role);
      return action === 'delete'
        ? `/dashboard/customers/${type}/${customer.id}`
        : `/dashboard/customers/${type}/${customer.id}/block`;
    }
    return `/dashboard/customers/${customer.id}/${actionMeta[action].endpoint}`;
  };

  useEffect(() => {
    if (selectedCustomer && !customers.some((c) => c.id === selectedCustomer.id)) {
      setSelectedCustomer(null);
    }
  }, [customers, selectedCustomer]);

  const currentUserRole = auth.user?.role || 'user';
  const isAdminOrSuperAdmin = ['superadmin', 'admin'].includes(currentUserRole);

  const filteredCustomers = isAdminOrSuperAdmin
    ? customers
    : customers.filter(customer => !['superadmin', 'admin'].includes(customer.role));

  const getRoleColor = (role: CustomerType['role']) => {
    const colors: Record<CustomerType['role'], string> = {
      'superadmin': 'bg-purple-100 text-purple-800',
      'admin': 'bg-blue-100 text-blue-800',
      'agent': 'bg-green-100 text-green-800',
      'deliveryman': 'bg-orange-100 text-orange-800',
      'user': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: CustomerType['role']) => {
    const labels: Record<CustomerType['role'], string> = {
      'superadmin': 'Super Admin',
      'admin': 'Admin',
      'agent': 'Agent',
      'deliveryman': 'Delivery',
      'user': 'Customer'
    };
    return labels[role] || 'User';
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 5000) return { label: 'Platinum', color: 'bg-gradient-to-r from-gray-800 to-gray-600' };
    if (totalSpent >= 2000) return { label: 'Gold', color: 'bg-gradient-to-r from-yellow-500 to-yellow-700' };
    if (totalSpent >= 500) return { label: 'Silver', color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
    return { label: 'Bronze', color: 'bg-gradient-to-r from-amber-800 to-amber-900' };
  };

  const getUserImage = (customer: CustomerType) => {
    if (customer.images) {
      if (customer.images.startsWith('http')) {
        return customer.images;
      }
      return `/storage/${customer.images}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=128&bold=true`;
  };

  const canManageCustomer = (customer: CustomerType) => {
    if (currentUserRole === 'superadmin') return true;
    if (currentUserRole === 'admin' && customer.role !== 'superadmin') return true;
    return false;
  };

  const shouldHideUserInfo = (customer: CustomerType) => {
    if (isAdminOrSuperAdmin) return false;
    return ['superadmin', 'admin'].includes(customer.role);
  };

  const getRoleIcon = (role: CustomerType['role']) => {
    switch(role) {
      case 'superadmin':
        return <FaUserShield className="h-4 w-4" />;
      case 'admin':
        return <FaUserCog className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Customers Management" />

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Eyebrow>Manage your users</Eyebrow>
              <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Customers</h1>
              <p className="text-text-soft mt-1">
                {isAdminOrSuperAdmin
                  ? 'View all registered users'
                  : 'View customer list'}
              </p>
            </div>
            {isAdminOrSuperAdmin && (
              <Link
                href="/dashboard/customers/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <FaPlus className="h-4 w-4" />
                Add Customer
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Customers</p>
                  <p className="text-2xl font-bold text-ink mt-1">{filteredCustomers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                  <FaUsers className="h-6 w-6 text-marigold" />
                </div>
              </div>
            </div>

            {isAdminOrSuperAdmin && (
              <>
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Admins</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        {customers.filter(c => c.role === 'admin').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaUserCog className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Super Admins</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        {customers.filter(c => c.role === 'superadmin').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaUserShield className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Verified</p>
                      <p className="text-2xl font-bold text-ink mt-1">
                        {customers.filter(c => c.email_verified_at).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customers List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">
                    {isAdminOrSuperAdmin ? 'All Users' : 'All Customers'}
                  </h2>
                  <span className="text-sm text-text-soft font-mono">
                    {filteredCustomers.length} {filteredCustomers.length === 1 ? 'user' : 'users'}
                  </span>
                </div>

                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUsers className="h-16 w-16 text-text-soft mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink mb-2">No Users Found</h3>
                    <p className="text-text-soft mb-6">
                      {isAdminOrSuperAdmin
                        ? 'No users registered yet'
                        : 'No customers available'}
                    </p>
                    {isAdminOrSuperAdmin && (
                      <Link
                        href="/dashboard/customers/create"
                        className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Add Your First User
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCustomers.map(customer => {
                      const tier = getCustomerTier(customer.stats?.totalSpent || 0);
                      const hideInfo = shouldHideUserInfo(customer);
                      const showActions = canManageCustomer(customer);

                      if (hideInfo) {
                        return (
                          <div
                            key={customer.id}
                            className="border border-line rounded-xl p-4 bg-paper-dim opacity-75"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white">
                                  <FaUserShield className="h-8 w-8" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-ink">Protected Account</h3>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    <FaUserShield className="h-3 w-3 mr-1" />
                                    Restricted
                                  </span>
                                </div>
                                <p className="text-sm text-text-soft mt-1">
                                  This account is protected and not visible to regular users
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={customer.id}
                          className={`border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 cursor-pointer ${
                            selectedCustomer?.id === customer.id ? 'ring-2 ring-marigold bg-marigold/5' : ''
                          }`}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-line shadow-hard-sm">
                                <img
                                  src={getUserImage(customer)}
                                  alt={customer.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&size=128&bold=true`;
                                  }}
                                />
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-ink">{customer.name}</h3>
                                  <div className="flex items-center mt-1 space-x-2 flex-wrap gap-1">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(customer.role)}`}>
                                      {getRoleIcon(customer.role)}
                                      <span>{getRoleLabel(customer.role)}</span>
                                    </span>
                                    {customer.stats && customer.stats.totalOrders > 0 && (
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${tier.color}`}>
                                        {tier.label}
                                      </span>
                                    )}
                                    {customer.email_verified_at ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <FaCheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <FaExclamationCircle className="h-3 w-3 mr-1" />
                                        Unverified
                                      </span>
                                    )}
                                    {customer.blocked && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        <FaBan className="h-3 w-3 mr-1" />
                                        Blocked
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isAdminOrSuperAdmin && customer.role === 'agent' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionCandidate({ customer, action: 'user' });
                                    }}
                                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700 hover:ring-2 hover:ring-gray-700/30 transition-all duration-300"
                                  >
                                    <FaUserCog className="h-3 w-3" />
                                    Make Customer
                                  </button>
                                )}
                                {isAdminOrSuperAdmin && customer.role === 'user' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionCandidate({ customer, action: 'agent' });
                                    }}
                                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-600 hover:ring-2 hover:ring-emerald-700/30 transition-all duration-300"
                                  >
                                    <FaUserCog className="h-3 w-3" />
                                    Make Agent
                                  </button>
                                )}
                                {currentUserRole === 'superadmin' && customer.role === 'user' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionCandidate({ customer, action: 'admin' });
                                    }}
                                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink/90 hover:ring-2 hover:ring-ink/30 transition-all duration-300"
                                  >
                                    <FaUserShield className="h-3 w-3" />
                                    Make Admin
                                  </button>
                                )}
                                {currentUserRole === 'superadmin' && customer.id !== (auth.user as any)?.id && (
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActionCandidate({ customer, action: customer.blocked ? 'unblock' : 'block' });
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:ring-2 transition-all duration-300 ${
                                        customer.blocked
                                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:ring-emerald-600/30'
                                          : 'bg-amber-500 text-white hover:bg-amber-400 hover:ring-amber-500/30'
                                      }`}
                                    >
                                      <FaBan className="h-3 w-3" />
                                      {customer.blocked ? 'Unblock' : 'Block'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActionCandidate({ customer, action: 'delete' });
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 hover:ring-2 hover:ring-red-600/30 transition-all duration-300"
                                    >
                                      <FaTimes className="h-3 w-3" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Contact Info */}
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <div className="flex items-center text-sm text-text-soft mb-1">
                                    <FaEnvelope className="h-3 w-3 mr-2" />
                                    <span>{customer.email}</span>
                                  </div>
                                  {customer.profile?.phone && (
                                    <div className="flex items-center text-sm text-text-soft">
                                      <FaPhone className="h-3 w-3 mr-2" />
                                      <span>{customer.profile.phone}</span>
                                    </div>
                                  )}
                                </div>
                                {customer.profile?.city && (
                                  <div>
                                    <div className="flex items-center text-sm text-text-soft">
                                      <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                                      <span>{customer.profile.city}, {customer.profile.country}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Customer Stats */}
                              {customer.stats && customer.stats.totalOrders > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="text-center p-2 bg-paper-dim rounded-lg">
                                    <div className="flex items-center justify-center">
                                      <FaShoppingCart className="h-3 w-3 text-text-soft mr-1" />
                                      <span className="text-xs text-text-soft">Orders</span>
                                    </div>
                                    <p className="font-bold text-ink">{customer.stats.totalOrders}</p>
                                  </div>
                                  <div className="text-center p-2 bg-paper-dim rounded-lg">
                                    <div className="flex items-center justify-center">
                                      <FaDollarSign className="h-3 w-3 text-text-soft mr-1" />
                                      <span className="text-xs text-text-soft">Spent</span>
                                    </div>
                                    <p className="font-bold text-ink">
                                      <FormatPrice price={customer.stats.totalSpent} />
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-paper-dim rounded-lg">
                                    <div className="flex items-center justify-center">
                                      <FaStar className="h-3 w-3 text-text-soft mr-1" />
                                      <span className="text-xs text-text-soft">Avg Order</span>
                                    </div>
                                    <p className="font-bold text-ink">
                                      <FormatPrice price={customer.stats.avgOrderValue} />
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Details Sidebar */}
            <div className="space-y-6">
              {selectedCustomer ? (
                <>
                  {shouldHideUserInfo(selectedCustomer) ? (
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Access Restricted</h3>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="p-1 text-text-soft hover:text-ink transition-colors"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="text-center py-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
                          <FaUserShield className="h-12 w-12 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-ink mb-2">Protected Account</h4>
                        <p className="text-text-soft">
                          This account belongs to an admin or super admin and its details are protected.
                        </p>
                        <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
                          <p className="text-sm text-purple-700">
                            <FaUserShield className="inline mr-1" />
                            Only admins and super admins can view this information.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Customer Details</h3>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="p-1 text-text-soft hover:text-ink transition-colors"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Customer Profile */}
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-line shadow-hard-sm mx-auto mb-4">
                          <img
                            src={getUserImage(selectedCustomer)}
                            alt={selectedCustomer.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=random&size=128&bold=true`;
                            }}
                          />
                        </div>
                        <h4 className="text-2xl font-bold text-ink">{selectedCustomer.name}</h4>
                        <div className="flex items-center justify-center mt-2 space-x-2 flex-wrap gap-1">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedCustomer.role)}`}>
                            {getRoleIcon(selectedCustomer.role)}
                            <span>{getRoleLabel(selectedCustomer.role)}</span>
                          </span>
                          {selectedCustomer.email_verified_at ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FaExclamationCircle className="h-3 w-3 mr-1" />
                              Unverified
                            </span>
                          )}
                          {selectedCustomer.blocked && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FaBan className="h-3 w-3 mr-1" />
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Contact Information</h5>
                          <div className="space-y-3">
                            <div className="flex items-center p-3 bg-paper-dim rounded-xl">
                              <FaEnvelope className="h-4 w-4 text-text-soft mr-3" />
                              <div>
                                <p className="font-medium text-ink">{selectedCustomer.email}</p>
                                <p className="text-xs text-text-soft">Email Address</p>
                              </div>
                            </div>
                            {selectedCustomer.profile?.phone && (
                              <div className="flex items-center p-3 bg-paper-dim rounded-xl">
                                <FaPhone className="h-4 w-4 text-text-soft mr-3" />
                                <div>
                                  <p className="font-medium text-ink">{selectedCustomer.profile.phone}</p>
                                  <p className="text-xs text-text-soft">Phone Number</p>
                                </div>
                              </div>
                            )}
                            {selectedCustomer.profile?.address && (
                              <div className="flex items-start p-3 bg-paper-dim rounded-xl">
                                <FaMapMarkerAlt className="h-4 w-4 text-text-soft mr-3 mt-1" />
                                <div>
                                  <p className="font-medium text-ink">{selectedCustomer.profile.address}</p>
                                  <p className="text-xs text-text-soft">
                                    {selectedCustomer.profile.city}, {selectedCustomer.profile.country}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Account Information */}
                        <div>
                          <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Account Information</h5>
                          <div className="space-y-2 bg-paper-dim rounded-xl p-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-soft">Member Since</span>
                              <span className="font-medium text-ink">{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-soft">Last Updated</span>
                              <span className="font-medium text-ink">{new Date(selectedCustomer.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Stats */}
                      {selectedCustomer.stats && (
                        <div className="mb-6">
                          <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Statistics</h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <p className="text-xs text-blue-600 font-medium">Total Orders</p>
                              <p className="text-xl font-bold text-ink">{selectedCustomer.stats.totalOrders}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                              <p className="text-xs text-green-600 font-medium">Total Spent</p>
                              <p className="text-xl font-bold text-ink">
                                <FormatPrice price={selectedCustomer.stats.totalSpent} />
                              </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                              <p className="text-xs text-purple-600 font-medium">Avg Order Value</p>
                              <p className="text-xl font-bold text-ink">
                                <FormatPrice price={selectedCustomer.stats.avgOrderValue} />
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                              <p className="text-xs text-orange-600 font-medium">Orders This Month</p>
                              <p className="text-xl font-bold text-ink">{selectedCustomer.stats.ordersThisMonth}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Customer Tier */}
                      {selectedCustomer.stats && selectedCustomer.stats.totalOrders > 0 && (
                        <div className="mb-6">
                          <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Customer Tier</h5>
                          <div className={`text-center py-3 rounded-xl text-white ${getCustomerTier(selectedCustomer.stats.totalSpent).color}`}>
                            <p className="text-lg font-bold">{getCustomerTier(selectedCustomer.stats.totalSpent).label}</p>
                            <p className="text-sm opacity-90">
                              <FormatPrice price={selectedCustomer.stats.totalSpent} /> Lifetime Value
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {canManageCustomer(selectedCustomer) && (
                        <div className="pt-4 border-t border-line">
                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              href={`/dashboard/customers/${selectedCustomer.id}/edit`}
                              className="text-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line"
                            >
                              <FaEdit className="inline mr-1" />
                              Edit Profile
                            </Link>
                            <Link
                              href={`/dashboard/orders?customer=${selectedCustomer.id}`}
                              className="text-center px-4 py-2.5 bg-paper-dim text-ink rounded-xl hover:bg-marigold/10 hover:text-marigold transition-all duration-300 font-medium border border-line"
                            >
                              <FaEye className="inline mr-1" />
                              View Orders
                            </Link>
                          </div>
                          {isAdminOrSuperAdmin && selectedCustomer.role === 'agent' && (
                            <button
                              type="button"
                              onClick={() => setActionCandidate({ customer: selectedCustomer, action: 'user' })}
                              className="mt-3 w-full text-center px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 hover:ring-2 hover:ring-gray-700/30 transition-all duration-300 font-medium"
                            >
                              <FaUserCog className="inline mr-1" />
                              Make Customer
                            </button>
                          )}
                          {isAdminOrSuperAdmin && selectedCustomer.role === 'user' && (
                            <button
                              type="button"
                              onClick={() => setActionCandidate({ customer: selectedCustomer, action: 'agent' })}
                              className="mt-3 w-full text-center px-4 py-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 hover:ring-2 hover:ring-emerald-700/30 transition-all duration-300 font-medium"
                            >
                              <FaUserCog className="inline mr-1" />
                              Make Agent
                            </button>
                          )}
                          {currentUserRole === 'superadmin' && selectedCustomer.role === 'user' && (
                            <button
                              type="button"
                              onClick={() => setActionCandidate({ customer: selectedCustomer, action: 'admin' })}
                              className="mt-3 w-full text-center px-4 py-2.5 bg-ink text-white rounded-xl hover:bg-ink/90 hover:ring-2 hover:ring-ink/30 transition-all duration-300 font-medium"
                            >
                              <FaUserShield className="inline mr-1" />
                              Promote to Admin
                            </button>
                          )}
                          {currentUserRole === 'superadmin' && selectedCustomer.id !== (auth.user as any)?.id && (
                            <>
                              <button
                                type="button"
                                onClick={() => setActionCandidate({ customer: selectedCustomer, action: selectedCustomer.blocked ? 'unblock' : 'block' })}
                                className={`mt-3 w-full text-center px-4 py-2.5 text-white rounded-xl hover:ring-2 transition-all duration-300 font-medium ${
                                  selectedCustomer.blocked
                                    ? 'bg-emerald-600 hover:bg-emerald-500 hover:ring-emerald-600/30'
                                    : 'bg-amber-500 hover:bg-amber-400 hover:ring-amber-500/30'
                                }`}
                              >
                                <FaBan className="inline mr-1" />
                                {selectedCustomer.blocked ? 'Unblock Account' : 'Block Account'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActionCandidate({ customer: selectedCustomer, action: 'delete' })}
                                className="mt-3 w-full text-center px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 hover:ring-2 hover:ring-red-600/30 transition-all duration-300 font-medium"
                              >
                                <FaTimes className="inline mr-1" />
                                Delete Account
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                  <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] mb-4">Customer Details</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Select a customer from the list to view detailed information and statistics.
                  </p>
                  <div className="text-center">
                    <FaUsers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-gray-400">No customer selected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={actionCandidate !== null}
        onClose={() => setActionCandidate(null)}
        onConfirm={() => {
          if (actionCandidate) {
            const { customer, action } = actionCandidate;
            const url = requestUrl(actionCandidate);
            if (action === 'delete') {
              router.delete(url);
            } else if (action === 'block' || action === 'unblock') {
              router.patch(url);
            } else {
              router.post(url);
            }
          }
          setActionCandidate(null);
        }}
        title={actionCandidate ? actionMeta[actionCandidate.action].title : ''}
        message={(() => {
          if (!actionCandidate) return '';
          const { customer, action } = actionCandidate;
          const verb = actionMeta[action].verb;
          return `Are you sure you want to ${verb} ${customer.name}? ${actionMeta[action].message}`;
        })()}
        variant={actionCandidate ? actionMeta[actionCandidate.action].variant : 'info'}
      />
    </DashboardLayout>
  );
};

export default Customers;
