import { Link } from '@inertiajs/react';
import { categoryType } from '@/types';
import { 
  FaShoppingBag, 
  FaStore, 
  FaFire, 
  FaHeadset 
} from 'react-icons/fa';

interface MarketplaceLinksHubProps {
  categories?: categoryType[];
}

const DEFAULT_POPULAR_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Food',
  'Sports',
  'Books',
  'Toys',
];

export default function MarketplaceLinksHub({ categories = [] }: MarketplaceLinksHubProps) {
  const categoryNames = categories.length > 0 
    ? Array.from(new Set(categories.map(c => c.categories).filter(Boolean)))
    : DEFAULT_POPULAR_CATEGORIES;

  return (
    <section 
      id="marketplace-directory" 
      className="border-t border-line bg-white/60 py-14 rounded-2xl p-6 sm:p-10 shadow-hard-sm"
      aria-labelledby="marketplace-hub-heading"
    >
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="inline-block font-mono text-xs uppercase tracking-widest text-marigold font-bold mb-2">
          Directory &amp; Navigation
        </span>
        <h2 id="marketplace-hub-heading" className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Explore HaatPoint Marketplace
        </h2>
        <p className="text-text-soft text-sm sm:text-base mt-2">
          Browse verified vendors, discover trending deals, or expand your own business online across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Category Links */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-ink font-bold font-display text-base border-b border-line pb-2">
            <FaShoppingBag className="text-marigold text-sm" />
            <h3>Shop by Department</h3>
          </div>
          <ul className="space-y-2 text-sm">
            {categoryNames.slice(0, 8).map((catName) => (
              <li key={catName}>
                <Link
                  href={`/products?category=${encodeURIComponent(catName)}`}
                  className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
                >
                  {catName}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                href="/products" 
                className="text-xs font-bold text-marigold-dark hover:text-ink underline block pt-1"
              >
                View all departments &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Deals & Discovery */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-ink font-bold font-display text-base border-b border-line pb-2">
            <FaFire className="text-marigold text-sm" />
            <h3>Deals &amp; Discoveries</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/hotdeals"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Hot Deals &amp; Discounts
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                New Arrivals This Week
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                All Products Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/stores"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Featured Vendor Stores
              </Link>
            </li>
            <li>
              <a
                href="#topselling"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Monthly Best Sellers Leaderboard
              </a>
            </li>
            <li>
              <a
                href="#offers"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Handpicked Special Offers
              </a>
            </li>
          </ul>
        </div>

        {/* Sell with Us */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-ink font-bold font-display text-base border-b border-line pb-2">
            <FaStore className="text-marigold text-sm" />
            <h3>Vendor &amp; Merchant Hub</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/sell"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Become a Seller (1 Year Free)
              </Link>
            </li>
            <li>
              <Link
                href="/sell#pricing"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Seller Membership Plans
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/store"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Store Management Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Register Merchant Account
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Vendor Login Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Services */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-ink font-bold font-display text-base border-b border-line pb-2">
            <FaHeadset className="text-marigold text-sm" />
            <h3>Customer Care &amp; Trust</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/track-order"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Track Your Parcel
              </Link>
            </li>
            <li>
              <Link
                href="/contactus"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Contact Customer Support
              </Link>
            </li>
            <li>
              <Link
                href="/aboutus"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                About HaatPoint Bangladesh
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Return &amp; Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="text-text-soft hover:text-marigold hover:underline transition-colors block py-0.5"
              >
                Buyer Data &amp; Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Contextual Paragraph */}
      <div className="border-t border-line/60 pt-6 text-xs text-text-soft/80 leading-relaxed">
        <p>
          <strong className="text-ink">HaatPoint</strong> is Bangladesh&apos;s modern multi-vendor marketplace connecting passionate local merchants, shopkeepers, and creators directly with consumers across Dhaka, Chattogram, Sylhet, Khulna, Rajshahi, and nationwide. Explore authentic fashion, smart electronics, home appliances, fresh produce, and lifestyle goods with secure cash on delivery (COD) and prompt home delivery powered by Pathao. Looking to expand your reach?{' '}
          <Link href="/sell" className="text-marigold-dark font-semibold hover:underline">
            Open your online stall on HaatPoint today with 1 year free selling
          </Link>.
        </p>
      </div>
    </section>
  );
}
