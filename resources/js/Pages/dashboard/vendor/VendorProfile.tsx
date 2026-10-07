import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Eyebrow from '@/Pages/Components/Eyebrow';
import { PageProps } from '@/types';
import {
    HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import { FaBuilding, FaIdCard, FaLocationDot, FaMobile, FaUser } from 'react-icons/fa6';

interface VendorProfilePage extends PageProps {
    vendor: {
        name: string;
        email: string;
        images: string | null;
        mobile: string | null;
        national_id: string | null;
        address: string | null;
    };
    missingFields: string[];
    isComplete: boolean;
}

/**
 * Vendor KYC form.
 *
 * Separate from the generic profile page because an agent's ability to open a
 * store depends on these exact fields. The page therefore shows what is still
 * missing and what each field is used for, instead of presenting them as
 * generic account settings.
 */
export default function VendorProfile({ vendor, missingFields, isComplete }: VendorProfilePage) {
    const { auth } = usePage().props as unknown as PageProps;

    const { data, setData, post, processing, errors } = useForm({
        name: vendor.name ?? '',
        mobile: vendor.mobile ?? '',
        national_id: vendor.national_id ?? '',
        address: vendor.address ?? '',
        images: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(
        vendor.images ? `/storage/${vendor.images}` : null
    );

    const missing = missingFields ?? [];
    const formErrors = errors as Record<string, string | undefined>;

    const missingLabel: Record<string, string> = {
        name: 'Full name',
        mobile: 'Mobile number',
        national_id: 'National ID',
        address: 'Address',
    };

    const isMissing = (field: string) => missing.includes(field);

    const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            formErrors.images = 'Logo must be less than 5MB';
            return;
        }

        setData('images', file);
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.profile.update'), { forceFormData: true });
    };

    const inputClass =
        'w-full rounded-xl border border-line px-4 py-3 focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft disabled:opacity-60';

    const FieldError = ({ field }: { field: string }) =>
        formErrors[field] ? (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <HiOutlineExclamationCircle className="h-4 w-4" />
                {formErrors[field]}
            </p>
        ) : null;

    const RequiredMark = () => <span className="text-red-500 ml-1">*</span>;

    return (
        <DashboardLayout user={auth.user}>
            <Head title='Vendor Details'>
                <meta name='description' content='Complete your vendor details to open your store' />
            </Head>

            <div className='max-w-4xl mx-auto p-4 md:p-6'>
                <div className='mb-8'>
                    <Eyebrow>Vendor verification</Eyebrow>
                    <h1 className='text-[30px] sm:text-[36px] lg:text-[44px]'>Vendor Details</h1>
                    <p className='text-text-soft mt-1'>
                        These details let us verify every seller on HaatPoint. They are required
                        before you can open a store.
                    </p>
                </div>

                {/* Completion state, so the requirement is visible rather than
                    implied by a rejected submission. */}
                {isComplete ? (
                    <div className='mb-6 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'>
                        <FaBuilding className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                        <span>Your vendor details are complete. You can create your store.</span>
                    </div>
                ) : (
                    <div className='mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
                        <HiOutlineExclamationCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500' />
                        <span>
                            Still needed:{' '}
                            <strong>
                                {missing.map((f) => missingLabel[f] ?? f).join(', ')}
                            </strong>
                            . Your store stays closed until these are provided.
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='bg-white rounded-2xl shadow-hard-sm border border-line p-6'>
                        <div className='flex items-center gap-2 mb-6 pb-4 border-b border-line'>
                            <FaBuilding className='h-5 w-5 text-marigold' />
                            <h2 className='text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink'>
                                Verification Details
                            </h2>
                        </div>

                        <div className='space-y-6'>
                            {/* Name */}
                            <div>
                                <label className='text-sm font-medium text-ink mb-2 flex items-center gap-1'>
                                    <FaUser className='h-4 w-4 text-marigold' />
                                    Full Name
                                    <RequiredMark />
                                </label>
                                <input
                                    type='text'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder='e.g., Muhammad Franc'
                                    className={inputClass}
                                    disabled={processing}
                                />
                                <FieldError field='name' />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className='text-sm font-medium text-ink mb-2 flex items-center gap-1'>
                                    <FaMobile className='h-4 w-4 text-marigold' />
                                    Mobile Number
                                    <RequiredMark />
                                    {isMissing('mobile') && (
                                        <span className='ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800'>
                                            needed
                                        </span>
                                    )}
                                </label>
                                <input
                                    type='tel'
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    placeholder='e.g., 01712345678'
                                    className={inputClass}
                                    disabled={processing}
                                />
                                <p className='text-xs text-text-soft mt-1'>
                                    11 digits, starting 013 to 019.
                                </p>
                                <FieldError field='mobile' />
                            </div>

                            {/* National ID */}
                            <div>
                                <label className='text-sm font-medium text-ink mb-2 flex items-center gap-1'>
                                    <FaIdCard className='h-4 w-4 text-marigold' />
                                    National ID
                                    <RequiredMark />
                                    {isMissing('national_id') && (
                                        <span className='ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800'>
                                            needed
                                        </span>
                                    )}
                                </label>
                                <input
                                    type='text'
                                    value={data.national_id}
                                    onChange={(e) => setData('national_id', e.target.value)}
                                    placeholder='10 or 17 digits'
                                    className={inputClass}
                                    disabled={processing}
                                />
                                <p className='text-xs text-text-soft mt-1'>
                                    Your 10-digit NID or 17-digit national ID.
                                </p>
                                <FieldError field='national_id' />
                            </div>

                            {/* Address */}
                            <div>
                                <label className='text-sm font-medium text-ink mb-2 flex items-center gap-1'>
                                    <FaLocationDot className='h-4 w-4 text-marigold' />
                                    Address
                                    <RequiredMark />
                                    {isMissing('address') && (
                                        <span className='ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800'>
                                            needed
                                        </span>
                                    )}
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={3}
                                    placeholder='Your full business address'
                                    className={`${inputClass} resize-y`}
                                    disabled={processing}
                                />
                                <FieldError field='address' />
                            </div>
                        </div>
                    </div>

                    {/* Photo */}
                    <div className='bg-white rounded-2xl shadow-hard-sm border border-line p-6'>
                        <div className='flex items-center gap-2 mb-6 pb-4 border-b border-line'>
                            <FaUser className='h-5 w-5 text-marigold' />
                            <h2 className='text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink'>
                                Photo
                            </h2>
                        </div>

                        <div className='flex items-center gap-5'>
                            {preview ? (
                                <img
                                    src={preview}
                                    alt='Vendor'
                                    className='h-20 w-20 rounded-full object-cover border border-line'
                                />
                            ) : (
                                <div className='h-20 w-20 rounded-full bg-paper-dim border border-line flex items-center justify-center'>
                                    <FaUser className='h-8 w-8 text-text-soft' />
                                </div>
                            )}

                            <div>
                                <input
                                    id='vendor-image'
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={onLogoChange}
                                />
                                <label
                                    htmlFor='vendor-image'
                                    className='inline-block cursor-pointer rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper-dim transition-colors'
                                >
                                    {preview ? 'Change photo' : 'Upload photo'}
                                </label>
                                <p className='text-xs text-text-soft mt-2'>
                                    Optional. JPG, PNG or WEBP, up to 5MB.
                                </p>
                                <FieldError field='images' />
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-4'>
                        <button
                            type='submit'
                            disabled={processing}
                            className='inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-marigold font-medium rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50'
                        >
                            {processing ? 'Saving...' : 'Save vendor details'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}