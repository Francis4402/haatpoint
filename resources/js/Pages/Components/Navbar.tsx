import { PropsWithChildren, useState, useRef, useEffect, Fragment } from "react"
import { Link } from "@inertiajs/react"

import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiTag,
  FiZap,
  FiPackage,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiShoppingCart,
  FiHeart,
  FiMail,
  FiInfo,
  FiGlobe,
} from "react-icons/fi"
import { Dialog, Transition } from "@headlessui/react"
import { useStore } from "../state/cartStore"
import WishlistCountButton from "../buttons/WishListCountButton"
import SearchBox from "@/Components/SearchBox"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import logoutUrl from "@/Components/logoutUrl"
import { useTranslation } from "@/state/languageStore"

// Lazy loaded logo component
const LazyLogo = ({ className }: { className?: string }) => (
  <LazyLoadImage
    src="/MyLogo.png"
    alt="Haatpoint logo"
    effect="blur"
    wrapperClassName={className}
    className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
    placeholderSrc="/MyLogo-placeholder.png"
    threshold={50}
    visibleByDefault={true}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = '/fallback-logo.png';
    }}
  />
);

// Lazy loaded avatar component
const LazyAvatar = ({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string
}) => (
  <LazyLoadImage
    src={src}
    alt={alt}
    effect="blur"
    wrapperClassName={className}
    className="h-full w-full object-cover"
    placeholderSrc="/placeholder.png"
    threshold={50}
    visibleByDefault={false}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}`;
    }}
  />
);

const Navbar = ({ user, wishlist }: PropsWithChildren<{ user: any; wishlist: any }>) => {
  const { language, setLanguage, toggleLanguage, t } = useTranslation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { getTotalItems } = useStore()
  const cartItems = getTotalItems()

  const navigation = [
    { name: t('nav_home', 'Home'), href: "/", icon: FiHome },
    { name: t('nav_deals', 'Deals'), href: "/hotdeals", badge: t('badge_hot', 'HOT'), icon: FiTag },
    { name: t('nav_new_arrivals', 'New Arrivals'), href: "/new-arrivals", icon: FiZap },
    { name: t('nav_about_us', 'About Us'), href: "/aboutus", icon: FiInfo },
    { name: t('nav_contact_us', 'Contact Us'), href: "/contactus", icon: FiMail },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (userMenuOpen) setUserMenuOpen(false)
        if (isMobileMenuOpen) setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [userMenuOpen, isMobileMenuOpen])

  const handleSearchButtonClick = () => setSearchOpen((prev) => !prev)

  // Helper function to get user avatar URL
  const getUserAvatarUrl = (user: any) => {
    if (!user) return null;
    if (user.images) {
      return user.images.startsWith("http")
        ? user.images
        : `/storage/${user.images}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D6430E&color=fff&size=128`;
  }

  return (
    <>
      <header
        className="sticky top-0 z-[100] w-full border-b border-[#E3E1DB] bg-[#FBFBF9]/90 backdrop-blur-md"
        role="banner"
        aria-label="Main navigation"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex h-16 md:h-[76px] items-center justify-between gap-4">
            {/* Left Section - Logo + nav */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group" aria-label="Haatpoint home">
                <div className="h-[34px] w-auto">
                  <LazyLogo />
                </div>
                <span className="font-display font-extrabold text-[22px] tracking-[-0.01em] uppercase" style={{ color: '#1B1B1B' }}>
                  Haatpoint
                </span>
              </Link>

              <nav className="hidden lg:flex ml-6 gap-1" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-sm transition-colors duration-150"
                    style={{ color: '#1B1B1B' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.name}
                    {item.badge && (
                      <span
                        className="ml-0.5 inline-flex items-center rounded-full bg-[#6E7F5C] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white"
                        aria-label={`${item.badge} deals`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={handleSearchButtonClick}
                className="md:hidden p-2.5 rounded-sm hover:bg-[#F2F2EE] transition-colors relative"
                aria-label={searchOpen ? t('close_menu', "Close search") : t('search_button', "Open search")}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <FiX className="h-5 w-5" aria-hidden="true" /> : <FiSearch className="h-5 w-5" aria-hidden="true" />}
              </button>

              {/* Language Switcher - Desktop & Tablet */}
              <div className="hidden sm:flex items-center notranslate" translate="no">
                <div
                  className="inline-flex items-center bg-[#F2F2EE] p-0.5 rounded-sm border border-[#E3E1DB]"
                  role="group"
                  aria-label="Language selection"
                >
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-xs font-bold rounded-sm transition-all duration-150 flex items-center gap-1 ${
                      language === 'en'
                        ? 'bg-white text-[#1B1B1B] shadow-sm'
                        : 'text-[#767470] hover:text-[#1B1B1B]'
                    }`}
                    aria-pressed={language === 'en'}
                    title="Switch to English"
                  >
                    <FiGlobe className="h-3 w-3 text-[#6E7F5C]" />
                    <span>EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`px-2 py-1 text-xs font-bold rounded-sm transition-all duration-150 flex items-center gap-1 ${
                      language === 'bn'
                        ? 'bg-[#6E7F5C] text-white shadow-sm'
                        : 'text-[#767470] hover:text-[#1B1B1B]'
                    }`}
                    aria-pressed={language === 'bn'}
                    title="বাংলায় পরিবর্তন করুন"
                  >
                    <span>বাংলা</span>
                  </button>
                </div>
              </div>

              {/* Language Switcher - Mobile Quick Button */}
              <button
                type="button"
                onClick={toggleLanguage}
                translate="no"
                className="sm:hidden notranslate flex items-center gap-1 px-2 py-1.5 rounded-sm border border-[#E3E1DB] bg-white hover:bg-[#F2F2EE] text-xs font-bold text-[#1B1B1B] transition-colors"
                aria-label={`Toggle language. Current: ${language === 'en' ? 'English' : 'Bangla'}`}
                title={language === 'en' ? 'বাংলায় পরিবর্তন করুন' : 'Switch to English'}
              >
                <FiGlobe className="h-3.5 w-3.5 text-[#6E7F5C]" />
                <span className="font-semibold text-[11px] uppercase">
                  {language === 'en' ? 'বাং' : 'EN'}
                </span>
              </button>

              {/* Wishlist */}
              <div className="hidden sm:block">
                {user && <WishlistCountButton wishlist={wishlist} />}
              </div>

              {/* Cart */}
              <Link
                href={route("cart.index")}
                className="p-2.5 rounded-sm hover:bg-[#F2F2EE] transition-colors relative"
                aria-label={`${t('shopping_cart', 'Shopping cart')}${cartItems > 0 ? `, ${cartItems} ${t('items_in_cart', 'items in cart')}` : ''}`}
              >
                <FiShoppingBag className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
                {cartItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#6E7F5C] text-[10px] font-mono font-semibold text-white ring-2 ring-[#FBFBF9]"
                    aria-label={`${cartItems > 99 ? '99+' : cartItems} ${t('items_in_cart', 'items in cart')}`}
                  >
                    {cartItems > 99 ? "99+" : cartItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative md:block hidden" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-sm hover:bg-[#F2F2EE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6E7F5C]/40"
                  aria-label={`${user ? user.name + "'s" : "User"} account menu`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-sm">
                    {user ? (
                      <LazyAvatar
                        src={getUserAvatarUrl(user) || ''}
                        alt={user.name}
                        className="h-full w-full"
                      />
                    ) : (
                      <FiUser className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  {user && (
                    <span className="hidden sm:inline text-sm font-semibold" style={{ color: '#1B1B1B' }}>
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                  <FiChevronDown
                    className={`hidden sm:block h-4 w-4 text-[#767470] transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <Transition
                  show={userMenuOpen}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95 -translate-y-1"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100 translate-y-0"
                  leaveTo="transform opacity-0 scale-95 -translate-y-1"
                >
                  <div
                    className="absolute right-0 mt-2 w-72 origin-top-right rounded-sm bg-white border border-[#E3E1DB] shadow-hard-sm focus:outline-none z-50 overflow-hidden"
                    role="menu"
                    aria-label="User menu"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-4 bg-[#F2F2EE] border-b border-[#E3E1DB]">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                              <LazyAvatar
                                src={getUserAvatarUrl(user) || ''}
                                alt={user.name}
                                className="h-full w-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate" style={{ color: '#1B1B1B' }}>{user.name}</p>
                              <p className="text-sm truncate" style={{ color: '#767470' }}>{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5">
                          {[
                            { href: "/dashboard", icon: FiGrid, label: t('dashboard', 'Dashboard') },
                            { href: "/dashboard/profile", icon: FiUser, label: t('profile_settings', 'Profile Settings') },
                            { href: "/dashboard/orders", icon: FiPackage, label: t('order_history', 'Order History') },
                          ].map((it) => (
                            <Link
                              key={it.href}
                              href={it.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                              style={{ color: '#1B1B1B' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              role="menuitem"
                            >
                              <it.icon className="h-4 w-4 text-[#767470] group-hover:text-[#57654A]" aria-hidden="true" />
                              {it.label}
                            </Link>
                          ))}
                          <Link
                            href="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                            style={{ color: '#1B1B1B' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            role="menuitem"
                            aria-label={
                                wishlist?.length > 0
                                    ? `${t('wishlist', 'Wishlist')}, ${wishlist.length} ${wishlist.length === 1 ? t('item', 'item') : t('items', 'items')}`
                                    : t('wishlist', 'Wishlist')
                            }
                        >
                            <FiHeart aria-hidden="true" className="h-4 w-4 text-[#767470] group-hover:text-[#57654A]" />
                            <span>{t('wishlist', 'Wishlist')}</span>
                            {wishlist?.length > 0 && (
                                <span
                                    className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F2F2EE] font-mono text-[10px] font-medium text-[#57654A]"
                                    aria-hidden="true"
                                >
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        </div>

                        <div className="border-t border-[#E3E1DB] py-1.5">
                          <Link
                            href={logoutUrl(user?.role)}
                            method="post"
                            as="button"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            role="menuitem"
                          >
                            <FiLogOut className="h-4 w-4 group-hover:text-red-600" aria-hidden="true" />
                            {t('log_out', 'Log out')}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#1B1B1B' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          role="menuitem"
                        >
                          <FiUser className="h-4 w-4 text-[#767470]" aria-hidden="true" />
                          {t('sign_in', 'Sign in')}
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#1B1B1B' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          role="menuitem"
                        >
                          <FiUser className="h-4 w-4 text-[#767470]" aria-hidden="true" />
                          {t('create_account', 'Create account')}
                        </Link>
                      </div>
                    )}
                  </div>
                </Transition>
              </div>

              {/* Mobile Menu (sidebar) Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-sm border hover:bg-[#F2F2EE] transition-colors"
                style={{ borderColor: '#1B1B1B' }}
                aria-label={t('open_menu', 'Open main menu')}
                aria-expanded={isMobileMenuOpen}
              >
                <FiMenu className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Full-width search row (tablet and up) - gives the search the whole
              container width instead of squeezing it between nav and actions */}
          <div className="hidden md:block pb-3 -mt-1">
            <SearchBox
              variant="header"
              placeholder={t('search_placeholder', 'Search products, brands, vendors and categories…')}
            />
          </div>

          {/* Mobile Search Panel */}
          {searchOpen && (
            <div className="md:hidden py-4 border-t border-[#E3E1DB]">
              <SearchBox
                variant="panel"
                autoFocus
                placeholder={t('search_mobile_placeholder', 'What are you looking for?')}
                onNavigate={() => setSearchOpen(false)}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="mt-3 w-full py-2.5 border-[1.5px] rounded-sm text-sm font-bold transition-colors"
                style={{ borderColor: '#1B1B1B', color: '#1B1B1B' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t('close', 'Close')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer (sidebar) */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100] lg:hidden"
          onClose={setIsMobileMenuOpen}
          initialFocus={undefined}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-[#1B1B1B]/50 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                    <div
                      className="flex h-full flex-col shadow-2xl"
                      style={{ backgroundColor: '#FBFBF9' }}
                    >
                      <Dialog.Title className="sr-only">
                        {t('main_menu', 'Main navigation menu')}
                      </Dialog.Title>

                      {/* Drawer Header */}
                      <div className="relative overflow-hidden border-b border-[#E3E1DB]">
                        <div
                          className="absolute -right-10 -top-14 w-40 h-40 bg-[#6E7F5C] opacity-90 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
                          aria-hidden="true"
                        />
                        <div className="relative flex items-center justify-between px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-auto">
                              <LazyLogo />
                            </div>
                            <span className="font-display font-extrabold text-xl uppercase" style={{ color: '#1B1B1B' }}>
                              Haatpoint
                            </span>
                          </div>
                          <button
                            type="button"
                            className="p-2 rounded-sm hover:bg-[#F2F2EE] transition-colors relative z-10"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label={t('close_menu', "Close menu")}
                          >
                            <FiX className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Drawer Content */}
                      <div className="flex-1 overflow-y-auto py-6">
                        {/* Mobile Drawer Language Switcher */}
                        <div className="px-4 mb-4 notranslate" translate="no">
                          <div className="flex items-center justify-between p-3 bg-[#F2F2EE] rounded-sm border border-[#E3E1DB]">
                            <div className="flex items-center gap-2">
                              <FiGlobe className="h-4 w-4 text-[#6E7F5C]" />
                              <span className="text-sm font-semibold text-[#1B1B1B]">
                                Language / ভাষা
                              </span>
                            </div>
                            <div className="inline-flex items-center bg-white p-0.5 rounded-sm border border-[#E3E1DB]">
                              <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`px-2.5 py-1 text-xs font-bold rounded-sm transition-all ${
                                  language === 'en'
                                    ? 'bg-[#1B1B1B] text-white shadow-sm'
                                    : 'text-[#767470] hover:text-[#1B1B1B]'
                                }`}
                              >
                                English
                              </button>
                              <button
                                type="button"
                                onClick={() => setLanguage('bn')}
                                className={`px-2.5 py-1 text-xs font-bold rounded-sm transition-all ${
                                  language === 'bn'
                                    ? 'bg-[#6E7F5C] text-white shadow-sm'
                                    : 'text-[#767470] hover:text-[#1B1B1B]'
                                }`}
                              >
                                বাংলা
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* User Info */}
                        {user && (
                          <div className="px-6 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-[#F2F2EE] rounded-sm border border-[#E3E1DB]">
                              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-[#6E7F5C] to-[#57654A] flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                                <LazyAvatar
                                  src={getUserAvatarUrl(user) || ''}
                                  alt={user.name}
                                  className="h-full w-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate" style={{ color: '#1B1B1B' }}>{user.name}</p>
                                <p className="text-sm truncate" style={{ color: '#767470' }}>{user.email}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <nav className="space-y-1 px-4" aria-label="Mobile navigation">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                              style={{ color: '#1B1B1B' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
                                {item.name}
                              </div>
                              {item.badge && (
                                <span
                                  className="inline-flex items-center rounded-full bg-[#6E7F5C] px-2.5 py-0.5 font-mono text-[10px] uppercase text-white"
                                  aria-label={`${item.badge} deals`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </nav>

                        {/* Dashboard Links */}
                        {user && (
                          <>
                            <div className="border-t border-[#E3E1DB] my-6" aria-hidden="true" />
                            <div className="px-4">
                              <h3 className="px-3 font-mono text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#767470' }}>
                                {t('dashboard', 'Dashboard')}
                              </h3>
                              <nav className="space-y-1" aria-label="Dashboard navigation">
                                <Link
                                  href="/dashboard"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                  style={{ color: '#1B1B1B' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <FiGrid className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
                                  {t('dashboard', 'Dashboard')}
                                </Link>
                                <Link
                                  href="/dashboard/orders"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                  style={{ color: '#1B1B1B' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <FiShoppingCart className="h-5 w-5" style={{ color: '#1B1B1B' }} aria-hidden="true" />
                                  {t('orders', 'Orders')}
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors"
                                    style={{ color: '#1B1B1B' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    aria-label={
                                        wishlist?.length > 0
                                            ? `${t('wishlist', 'Wishlist')}, ${wishlist.length} ${wishlist.length === 1 ? t('item', 'item') : t('items', 'items')}`
                                            : t('wishlist', 'Wishlist')
                                    }
                                >
                                    <FiHeart aria-hidden="true" className="h-5 w-5" style={{ color: '#1B1B1B' }} />
                                    <span>{t('wishlist', 'Wishlist')}</span>
                                    {wishlist?.length > 0 && (
                                        <span
                                            className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#F2F2EE] font-mono text-[10px] font-medium text-[#57654A]"
                                            aria-hidden="true"
                                        >
                                            {wishlist.length}
                                        </span>
                                    )}
                                </Link>
                              </nav>
                            </div>
                          </>
                        )}

                        {/* Auth Actions */}
                        <div className="border-t border-[#E3E1DB] my-6" aria-hidden="true" />
                        <div className="px-4">
                          {user ? (
                            <Link
                              href={logoutUrl(user?.role)}
                              method="post"
                              as="button"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <FiLogOut className="h-5 w-5" aria-hidden="true" />
                              {t('log_out', 'Log out')}
                            </Link>
                          ) : (
                            <div className="space-y-3">
                              <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#6E7F5C] px-4 py-3 text-base font-bold text-white shadow-hard-sm hover:-translate-y-0.5 transition-transform"
                              >
                                {t('sign_in', 'Sign In')}
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-sm border-[1.5px] px-4 py-3 text-base font-bold transition-colors"
                                style={{ borderColor: '#1B1B1B', color: '#1B1B1B' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2EE'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {t('create_account', 'Create Account')}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-[#E3E1DB] px-6 py-4">
                        <div className="flex items-center justify-between font-mono text-xs" style={{ color: '#4B4B46' }}>
                          <span>© {new Date().getFullYear()} Haatpoint</span>
                          <Link
                            href="/terms-and-conditions"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="hover:text-[#57654A] transition-colors"
                          >
                            {t('terms', 'Terms')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Navbar
