// DashboardLayout.tsx
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiBell,
  FiGrid,
  FiTruck,
  FiCreditCard,
  FiMessageSquare,
  FiUser,
  FiHelpCircle,
  FiGlobe,
  FiSearch,
} from 'react-icons/fi';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User } from '@/types';
import { FaStore } from 'react-icons/fa';
import logoutUrl from '@/Components/logoutUrl';
import SearchBox from '@/Components/SearchBox';
import IncompleteVendorProfileBanner from '@/Components/IncompleteVendorProfileBanner';
import { useTranslation } from '@/state/languageStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard', user }) => {
  const { language, setLanguage } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { url, props } = usePage();
  const unreadMessages = (props as unknown as { unreadMessages?: number }).unreadMessages ?? 0;
  const { post } = useForm();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      current: url === '/dashboard'
    },
    ...((user.role === 'admin') ? [
        {
            name: 'Customers',
            href: '/dashboard/customers',
            icon: FiUsers,
            current: url.startsWith('/dashboard/customers')
        },
    ] : []),

    ...(user.role === 'agent' ? [
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: FiPackage,
            current: url.startsWith('/dashboard/products')
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/orders')
        },
        {
            name: 'Stores',
            href: '/dashboard/stores',
            icon: FiShoppingBag,
            current: url.startsWith('/dashboard/stores')
        },
        {
            name: 'Shipping',
            href: '/dashboard/shipping',
            icon: FiTruck,
            current: url.startsWith('/dashboard/shipping')
        },
        {
            name: 'Payments',
            href: '/dashboard/payments',
            icon: FiCreditCard,
            current: url.startsWith('/dashboard/payments')
        },
        {
            name: 'Messages',
            href: '/dashboard/messages',
            icon: FiMessageSquare,
            current: url.startsWith('/dashboard/messages')
        },
        {
            name: 'Analytics',
            href: '/dashboard/analytics',
            icon: FiBarChart2,
            current: url.startsWith('/dashboard/analytics')
        }
    ] : []),

    ...(user.role === 'admin' || user.role === 'superadmin' ? [
        {
            name: 'Customers',
            href: '/dashboard/customers',
            icon: FiUsers,
            current: url.startsWith('/dashboard/customers')
        },
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: FiPackage,
            current: url.startsWith('/dashboard/products')
        },
        {
            name: 'Categories',
            href: '/dashboard/categories',
            icon: FiGrid,
            current: url.startsWith('/dashboard/categories')
        },
        {
            name: 'Orders',
            href: '/dashboard/admin/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/admin/orders')
        },
        {
            name: 'Stores',
            href: '/dashboard/stores',
            icon: FiShoppingBag,
            current: url.startsWith('/dashboard/stores')
        },
        {
            name: 'Shipping',
            href: '/dashboard/shipping',
            icon: FiTruck,
            current: url.startsWith('/dashboard/shipping')
        },
        {
            name: 'Messages',
            href: '/dashboard/messages',
            icon: FiMessageSquare,
            current: url.startsWith('/dashboard/messages')
        },
        {
            name: 'Payments',
            href: '/dashboard/payments',
            icon: FiCreditCard,
            current: url.startsWith('/dashboard/payments')
        },
        {
            name: 'Analytics',
            href: '/dashboard/analytics',
            icon: FiBarChart2,
            current: url.startsWith('/dashboard/analytics')
        }
    ] : []),
    ...((user.role === 'deliveryman') ? [{
        name: 'Shipping',
        href: '/dashboard/shipping',
        icon: FiTruck,
        current: url.startsWith('/dashboard/shipping')
    }, {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: FiCreditCard,
      current: url.startsWith('/dashboard/payments')
    }] : []),
    ...((user.role === 'user') ? [
        {
            name: 'Payments',
            href: '/dashboard/payments',
            icon: FiCreditCard,
            current: url.startsWith('/dashboard/payments')
        },
        {
            name: 'Orders',
            href: '/dashboard/orders',
            icon: FiShoppingCart,
            current: url.startsWith('/dashboard/orders')
        },
        {
            name: 'Messages',
            href: '/dashboard/messages',
            icon: FiMessageSquare,
            current: url.startsWith('/dashboard/messages')
        },
    ] : []),
  ];

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post(logoutUrl(user?.role));
  };

  return (
    <div className="min-h-screen ">
      {/* Enhanced Mobile sidebar drawer */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 shadow-hard-sm">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-paper border-r border-line px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between gap-2">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                      <img src="/MyLogo.png" alt="Haatpoint" className="h-8 w-auto" />
                    </div>
                    <Link href='/'>
                      <h1 className="text-xl font-display font-extrabold uppercase text-ink">HaatPoint</h1>
                    </Link>
                    <button
                      type="button"
                      className="ml-auto rounded-md p-2.5 text-text-soft hover:bg-paper-dim hover:text-ink transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FiX className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">Close sidebar</span>
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  group flex items-center gap-x-3 rounded-lg p-2.5 text-sm leading-6 font-semibold transition-all duration-200
                                  ${item.current
                                    ? 'bg-marigold text-white shadow-hard-sm'
                                    : 'text-ink hover:bg-paper-dim hover:text-marigold'
                                  }
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={`h-5 w-5 shrink-0 transition-colors ${
                                    item.current
                                      ? 'text-white'
                                      : 'text-text-soft group-hover:text-marigold'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                                {item.current && (
                                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-line bg-paper px-6 shadow-hard-sm">
          <div className="flex h-16 shrink-0 items-center justify-between gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img src="/MyLogo.png" alt="Haatpoint" className="h-8 w-auto" />
            </div>
            {!isCollapsed && (
              <Link href='/'>
                <h1 className="text-xl font-display font-extrabold uppercase text-ink">HaatPoint</h1>
              </Link>
            )}
            <button
              type="button"
              className="ml-auto rounded-md p-2 text-text-soft hover:bg-paper-dim hover:text-ink transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex items-center gap-x-3 rounded-lg p-2.5 text-sm leading-6 font-semibold transition-all duration-200
                          ${item.current
                            ? 'bg-marigold text-white shadow-hard-sm'
                            : 'text-ink hover:bg-paper-dim hover:text-marigold'
                          }
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            item.current
                              ? 'text-white'
                              : 'text-text-soft group-hover:text-marigold'
                          }`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && <span>{item.name}</span>}
                        {item.current && !isCollapsed && (
                          <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}>
        {/* Top navigation bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-line bg-paper/90 backdrop-blur-md px-4 shadow-hard-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-ink lg:hidden hover:bg-paper-dim rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-line lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex min-w-0 flex-1 items-center">
              {/* Below md the always-on input is swapped for a toggle, the same
                  pattern the storefront Navbar uses, so the topbar keeps its
                  room for the language, bell and avatar controls. */}
              <button
                type="button"
                className="p-2.5 text-ink hover:bg-paper-dim rounded-lg transition-colors md:hidden"
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                {searchOpen ? (
                  <FiX className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FiSearch className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <div className="hidden w-full md:block">
                <SearchBox
                  variant="dashboard"
                  placeholder="Search products, vendors, dashboard…"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-x-3 lg:gap-x-5">
              {/* Language Switcher */}
              <div className="flex items-center notranslate" translate="no">
                <div
                  className="inline-flex items-center bg-paper-dim p-0.5 rounded-sm border border-line"
                  role="group"
                  aria-label="Language selection"
                >
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-xs font-bold rounded-sm transition-all flex items-center gap-1 ${
                      language === 'en'
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-text-soft hover:text-ink'
                    }`}
                    aria-pressed={language === 'en'}
                    title="Switch to English"
                  >
                    <FiGlobe className="h-3 w-3 text-marigold" />
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`px-2 py-1 text-xs font-bold rounded-sm transition-all flex items-center gap-1 ${
                      language === 'bn'
                        ? 'bg-marigold text-white shadow-sm'
                        : 'text-text-soft hover:text-ink'
                    }`}
                    aria-pressed={language === 'bn'}
                    title="বাংলায় পরিবর্তন করুন"
                  >
                    <span>বাংলা</span>
                  </button>
                </div>
              </div>

              <Link
                href="/dashboard/messages"
                className="-m-2.5 p-2.5 text-text-soft hover:text-ink relative transition-colors hover:bg-paper-dim rounded-lg"
                aria-label={`${unreadMessages} unread messages`}
              >
                <FiBell className="h-6 w-6" aria-hidden="true" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-marigold rounded-full text-xs text-white flex items-center justify-center font-bold ring-2 ring-paper">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-line" aria-hidden="true" />

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 rounded-full transition-all duration-200 hover:ring-2 hover:ring-marigold/50"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <img
                    src={
                      user.images
                        ? user.images.startsWith('http')
                            ? user.images
                            : `/storage/${user.images}`
                        : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
                    }
                    alt={user.name}
                    className="inline-block size-8 rounded-full ring-2 ring-line outline -outline-offset-1 outline-white transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name);
                    }}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                )}

                <Transition
                  show={profileOpen}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-hard-sm border border-line divide-y divide-line focus:outline-none z-50">
                    {/* User Info */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.images
                              ? user.images.startsWith('http')
                                  ? user.images
                                  : `/storage/${user.images}`
                              : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
                          }
                          alt={user.name}
                          className="size-10 rounded-full ring-2 ring-line"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name);
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-ink">{user.name}</p>
                          <p className="text-xs text-text-soft truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors text-text-soft hover:bg-paper-dim hover:text-ink`}
                      >
                        <FiUser className="h-4 w-4 mr-3 text-text-soft" />
                        Your Profile
                      </Link>

                      <Link
                        href="/help"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors text-text-soft hover:bg-paper-dim hover:text-ink`}
                      >
                        <FiHelpCircle className="h-4 w-4 mr-3 text-text-soft" />
                        Help & Support
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="py-1">
                      <form method="POST" onClick={handleLogout}>
                        <button
                          type="submit"
                          className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors text-left text-red-600 hover:bg-red-50 hover:text-red-700`}
                        >
                          <FiLogOut className="h-4 w-4 mr-3" />
                          Sign out
                        </button>
                      </form>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          {/* Mobile search panel — drops from the topbar the way the
              storefront Navbar's mobile search does. */}
          {searchOpen && (
            <div className="absolute left-0 right-0 top-full z-50 border-t border-line bg-paper px-4 py-4 shadow-hard-sm sm:px-6 md:hidden">
              <SearchBox
                variant="panel"
                scope="dashboard"
                autoFocus
                placeholder="Search products, vendors, dashboard…"
                onNavigate={() => setSearchOpen(false)}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="mt-3 w-full rounded-md border border-line py-2.5 text-sm font-bold text-ink transition-colors hover:bg-paper-dim"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <IncompleteVendorProfileBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
