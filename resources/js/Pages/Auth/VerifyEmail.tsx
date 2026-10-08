import { useState } from 'react';
import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Eyebrow from '@/Pages/Components/Eyebrow';
import { FaCircleCheck, FaEnvelope, FaPaperPlane, FaTriangleExclamation } from 'react-icons/fa6';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import type { PageProps } from '@/types';

interface VerifyEmailProps extends Record<string, unknown> {
    status?: string;
}

/**
 * The screen a vendor lands on when they try to open a store before confirming
 * their address, and the only place a shopper is told to go and click a link.
 *
 * It deliberately does not use GuestLayout: that wrapper is still the default
 * Breeze grey card, and this page is the first thing a blocked vendor sees. It
 * uses the marketplace palette (ink / marigold / paper / line) instead, so it
 * reads as part of the same site as the storefront.
 *
 * The target address is shown prominently, because when the mail does not
 * arrive that is the first thing anybody needs to check.
 */
export default function VerifyEmail({ status, flash, auth }: PageProps<VerifyEmailProps>) {
    const { post, processing } = useForm({});
    const [showHelp, setShowHelp] = useState(false);

    const email = auth?.user?.email;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            preserveScroll: true,
            onSuccess: () => setShowHelp(false),
        });
    };

    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10 sm:py-16">
            <Head title="Verify your email" />

            <Link href="/" className="mb-8">
                <ApplicationLogo className="h-14 w-14 fill-current text-ink" />
            </Link>

            <div className="w-full max-w-xl">
                <div className="bg-white rounded-2xl border border-line shadow-hard overflow-hidden">
                    <div className="px-6 py-8 sm:px-10 sm:py-10">
                        <Eyebrow>Almost there</Eyebrow>

                        <h1 className="text-[28px] sm:text-[34px] font-display font-extrabold uppercase tracking-[-0.01em] text-ink leading-tight">
                            Verify your email
                        </h1>

                        <p className="mt-3 text-text-soft">
                            Confirm your address to start shopping, adding products to your cart and,
                            if you are a vendor, opening your store.
                        </p>

                        {flash?.error && (
                            <div
                                role="alert"
                                className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                <FaTriangleExclamation className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p>{flash.error}</p>
                            </div>
                        )}

                        {status === 'verification-link-sent' && (
                            <div
                                role="status"
                                className="mt-6 flex items-start gap-3 rounded-xl border border-marigold/30 bg-marigold/10 px-4 py-3 text-sm text-marigold-dark"
                            >
                                <FaCircleCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p>
                                    A fresh verification link is on its way to{' '}
                                    <span className="font-semibold">{email}</span>.
                                </p>
                            </div>
                        )}

                        {email && (
                            <div className="mt-6 rounded-xl border border-line bg-paper-dim px-4 py-4">
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-soft">
                                    We sent the link to
                                </p>
                                <p className="mt-1.5 flex items-center gap-2 font-medium text-ink break-all">
                                    <FaEnvelope className="h-4 w-4 flex-shrink-0 text-marigold" />
                                    {email}
                                </p>
                            </div>
                        )}

                        <div className="mt-7">
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-ink text-white font-medium transition-all duration-300 hover:bg-marigold hover:text-ink disabled:opacity-50 sm:w-auto"
                            >
                                <FaPaperPlane className="h-4 w-4" />
                                {processing ? 'Sending...' : 'Resend verification email'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowHelp((v) => !v)}
                            aria-expanded={showHelp}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-text-soft hover:text-ink transition-colors"
                        >
                            <HiOutlineQuestionMarkCircle className="h-4 w-4" />
                            {showHelp ? 'Hide troubleshooting' : 'I have not received the email'}
                        </button>

                        {showHelp && (
                            <div className="mt-4 rounded-xl border border-line bg-paper-dim px-4 py-4 text-sm text-text-soft space-y-2">
                                <p>Check these before asking us to resend:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Your spam or junk folder.</li>
                                    <li>
                                        Any filter forwarding mail away from{' '}
                                        <span className="font-medium text-ink">{email}</span>.
                                    </li>
                                    <li>That you signed up with this exact address.</li>
                                </ul>
                                <p>
                                    Still nothing? Our mail server may be temporarily unavailable, in
                                    which case resending will say so.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper-dim px-6 py-4 sm:px-10">
                        <p className="text-xs text-text-soft">
                            Signed up with Google? Your address is already verified.
                        </p>

                        {/* A vendor arrives here while signed in, so they need a
                            way back that does not depend on the email arriving. */}
                        <Link
                            href={route('dashboard')}
                            className="text-sm font-medium text-ink underline underline-offset-4 hover:text-marigold-dark"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
