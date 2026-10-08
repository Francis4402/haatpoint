import { Link, usePage } from '@inertiajs/react';
import { FaArrowRight, FaCircleExclamation } from 'react-icons/fa6';

const FIELD_LABELS: Record<string, string> = {
    name: 'Full name',
    mobile: 'Mobile number',
    national_id: 'National ID',
    address: 'Address',
};

/**
 * Notice for a vendor whose store eligibility is incomplete.
 *
 * Rendered from DashboardLayout so the notice follows the vendor onto every
 * dashboard screen. It can only be cleared by filling in the vendor form, so
 * it names the exact missing fields rather than sending the vendor elsewhere.
 */
export default function IncompleteVendorProfileBanner() {
    const { auth } = usePage().props as unknown as {
        auth: {
            incompleteVendorProfile?: boolean;
            missingVendorProfileFields?: string[];
        };
    };

    if (!auth?.incompleteVendorProfile) return null;

    const missing = auth.missingVendorProfileFields ?? [];
    const labels = missing.map((field) => FIELD_LABELS[field] ?? field);

    return (
        <div
            role="alert"
            className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-hard-sm"
        >
            <FaCircleExclamation className="h-5 w-5 flex-shrink-0 text-amber-500" />

            <div className="min-w-0 flex-1">
                <p className="font-semibold">Complete your vendor details to open a store.</p>
                <p className="text-amber-800">
                    {labels.length > 0
                        ? `Still needed: ${labels.join(', ')}.`
                        : 'Your vendor details are incomplete.'}
                </p>
            </div>

            <Link
                href={route('vendor.profile.edit')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-amber-600"
            >
                Complete details
                <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );
}