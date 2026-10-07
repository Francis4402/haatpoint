import { usePage } from '@inertiajs/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

/**
 * Renders the `flash.error` / `flash.success` keys shared by HandleInertiaRequests.
 *
 * Every auth screen already rendered a `status` prop, but SocialiteController
 * and several controllers flash `error` instead, so a failed Google sign-in
 * bounced back to the login page with no message at all and read as "nothing
 * happened". This is the one place that reads those keys for those pages.
 */
export default function FlashBanner() {
  const { flash } = usePage().props as { flash?: { success?: string | null; error?: string | null } };

  if (!flash?.error && !flash?.success) {
    return null;
  }

  const message = flash.error ?? flash.success;
  const isError = Boolean(flash.error);

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`mb-6 flex items-start gap-3 rounded-lg border px-3 py-3 text-sm ${
        isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-ink/10 bg-ink/5 text-ink'
      }`}
    >
      {isError ? (
        <FaExclamationCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      ) : (
        <FaCheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-center sm:text-left">{message}</p>
    </div>
  );
}
