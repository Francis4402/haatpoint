import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import AppLayout from '@/Layouts/AppLayout';
import { FaHouse, FaShop, FaHeadset, FaCompass, FaFaceFrownOpen } from 'react-icons/fa6';
import { BiSolidError } from 'react-icons/bi';

const ERROR_MESSAGES: Record<number, { label: string; title: string; sub: string }> = {
  403: {
    label: '403',
    title: 'Access denied',
    sub: "You don't have permission to access this page. If you believe this is a mistake, please get in touch with us.",
  },
  404: {
    label: '404',
    title: 'Page not found',
    sub: "The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.",
  },
  419: {
    label: '419',
    title: 'Session expired',
    sub: 'Your session has timed out. Please go back and try again.',
  },
  429: {
    label: '429',
    title: 'Too many requests',
    sub: 'You are sending requests too quickly. Give it a moment and try again.',
  },
  500: {
    label: '500',
    title: 'Something went wrong',
    sub: 'An unexpected error occurred on our end. Our team has been notified — please try again shortly.',
  },
  503: {
    label: '503',
    title: 'Service unavailable',
    sub: 'We are performing maintenance right now. Please check back in a few minutes.',
  },
};

export default function NotFound({ status = 404 }: { status?: number }) {
  const { props } = usePage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = props.auth as any;
  const msg = ERROR_MESSAGES[status] ?? ERROR_MESSAGES[404];

  return (
    <AppLayout user={auth?.user} wishlist={undefined}>
      {/* Nothing hardcoded: SeoMeta shares noindex plus an empty canonical for
          error responses, and passing canonical="/" here used to tell Google
          that every broken URL was a copy of the home page. */}
      <SeoHead />

      <section className="relative bg-gradient-to-b from-marigold/10 via-transparent to-transparent overflow-hidden py-24 sm:py-32">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-marigold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-marigold/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-marigold/15 border border-marigold/30 flex items-center justify-center">
              <BiSolidError className="h-10 w-10 text-marigold" aria-hidden="true" />
            </div>
          </div>

          <p className="font-mono text-sm font-semibold uppercase tracking-widest text-marigold mb-4">
            Error {msg.label}
          </p>

          <h1
            className="font-display font-extrabold uppercase tracking-[-0.02em] text-7xl sm:text-8xl md:text-9xl leading-none bg-gradient-to-b from-marigold to-marigold-dark bg-clip-text text-transparent"
            aria-label={msg.label}
          >
            {msg.label}
          </h1>

          <h2 className="mt-4 font-display font-bold uppercase tracking-[-0.01em] text-ink text-2xl sm:text-3xl">
            {msg.title}
          </h2>

          <div className="flex justify-center">
            <FaFaceFrownOpen className="h-12 w-12 text-ink/30 mt-6 -rotate-12" aria-hidden="true" />
          </div>

          <p className="max-w-2xl mx-auto mt-6 text-text-soft text-base sm:text-lg leading-relaxed">
            {msg.sub}
          </p>

          {status === 403 && auth?.user && (
            <p className="text-sm mt-4 text-text-soft">
              Logged in as <span className="font-semibold text-ink capitalize">{auth.user.role}</span>.
            </p>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-marigold text-white rounded-full font-semibold hover:bg-marigold-dark hover:shadow-lg hover:shadow-marigold/30 transition-all duration-300"
            >
              <FaHouse className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-white rounded-full font-semibold hover:bg-ink/90 transition-all duration-300"
            >
              <FaShop className="h-4 w-4" aria-hidden="true" />
              Browse Products
            </Link>
            <Link
              href="/contactus"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-ink border border-line rounded-full font-semibold hover:bg-paper-dim hover:border-marigold/40 transition-all duration-300"
            >
              <FaHeadset className="h-4 w-4" aria-hidden="true" />
              Contact Support
            </Link>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-text-soft hover:text-marigold transition-colors"
            >
              <FaCompass className="h-4 w-4" aria-hidden="true" />
              Back to HaatPoint
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}