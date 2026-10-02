import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FaPaperPlane, FaTriangleExclamation } from 'react-icons/fa6';

/**
 * Persistent notice for an account that has not confirmed its address.
 *
 * Rendered from DashboardLayout rather than one page, because the ways an
 * unverified account discovers the problem are scattered: a blocked store
 * creation, a blocked order, or simply arriving at the dashboard. Putting it
 * in the layout means the warning follows the account onto every screen.
 *
 * Reads `requiresVerification` rather than testing the user object, because
 * staff have no verification step and must never see this.
 */
export default function UnverifiedEmailBanner() {
    const { auth, flash } = usePage().props as unknown as {
        auth: { requiresVerification?: boolean };
        flash?: { error?: string | null };
    };
    const [sending, setSending] = useState(false);

    if (!auth?.requiresVerification) return null;

    const resend = () => {
        setSending(true);

        router.post(
            route('verification.send'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSending(false);
                    // The server decides this. It used to claim success on every
                    // attempt, including when the mail server had refused the
                    // message, which is why nobody noticed the mail was failing.
                    if (flash?.error) {
                        toast.error(flash.error);
                    } else {
                        toast.success('Verification email sent. Check your inbox.');
                    }
                },
                onError: () => {
                    setSending(false);
                    toast.error('Could not send the verification email.');
                },
            },
        );
    };

    return (
        <div
            role="alert"
            className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-hard-sm"
        >
            <FaTriangleExclamation className="h-5 w-5 flex-shrink-0 text-red-500" />

            <div className="min-w-0 flex-1">
                <p className="font-semibold">Your email address is not verified.</p>
                <p className="text-red-700">
                    Confirm it to add products to your cart, place orders and, if you are a vendor,
                    open your store.
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <button
                    type="button"
                    onClick={resend}
                    disabled={sending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                    <FaPaperPlane className="h-3.5 w-3.5" />
                    {sending ? 'Sending...' : 'Resend'}
                </button>

                <Link
                    href={route('verification.notice')}
                    className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
                >
                    Verify now
                </Link>
            </div>
        </div>
    );
}
