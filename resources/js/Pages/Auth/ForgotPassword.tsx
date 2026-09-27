
import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FaEnvelope, FaArrowLeft, FaKey } from 'react-icons/fa';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-hard-sm p-8 md:p-10 border border-line">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-marigold/10 rounded-full flex items-center justify-center mb-4">
                            <FaKey className="w-8 h-8 text-marigold" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-ink">
                            Forgot Password
                        </h2>
                        <p className="mt-2 text-sm text-text-soft">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-sm font-medium text-green-800">
                                    {status}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Message */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-line">
                        <p className="text-sm text-text-soft leading-relaxed">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-text-soft" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <a
                                href={route('login')}
                                className="inline-flex items-center gap-2 text-sm text-text-soft hover:text-marigold transition-colors font-medium"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Back to Login
                            </a>
                            <PrimaryButton
                                className="w-full sm:w-auto bg-gray-900 hover:bg-marigold text-white px-8 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 border-0"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-text-soft">
                            Remember your password?{' '}
                            <a href={route('login')} className="text-marigold hover:underline font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
