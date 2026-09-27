
import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FaLock, FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ResetPassword({ token, email }: { token: string, email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div>
            <Head title="Reset Password" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-hard-sm p-8 md:p-10 border border-line">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-marigold/10 rounded-full flex items-center justify-center mb-4">
                            <FaLock className="w-8 h-8 text-marigold" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-ink">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-text-soft">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        {/* Email Field */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Address"
                                className="text-sm font-medium text-ink"
                            />
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-text-soft" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="New Password"
                                className="text-sm font-medium text-ink"
                            />
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="h-5 w-5 text-text-soft" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                                className="text-sm font-medium text-ink"
                            />
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-text-soft" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-10 block w-full border-line rounded-lg focus:border-marigold focus:ring-marigold transition-colors"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-line">
                            <p className="text-xs font-mono text-text-soft uppercase tracking-wide mb-2">
                                Password Requirements:
                            </p>
                            <ul className="text-xs text-text-soft space-y-1">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-marigold rounded-full"></span>
                                    At least 8 characters long
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-marigold rounded-full"></span>
                                    Contains uppercase and lowercase letters
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-marigold rounded-full"></span>
                                    Contains at least one number
                                </li>
                            </ul>
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
                                        Resetting...
                                    </span>
                                ) : (
                                    'Reset Password'
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
