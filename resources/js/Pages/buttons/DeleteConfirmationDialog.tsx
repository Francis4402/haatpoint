
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaExclamationTriangle, FaTimes, FaTrash } from 'react-icons/fa';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isDeleting?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export default function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Order',
    message = 'Are you sure you want to delete this order? This action cannot be undone.',
    isDeleting = false,
    variant = 'danger'
}: DeleteConfirmationDialogProps) {
    // Variant configurations
    const variants = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            buttonBg: 'bg-red-600 hover:bg-red-700',
            focusRing: 'focus:ring-red-500',
            border: 'border-red-200',
        },
        warning: {
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
            focusRing: 'focus:ring-yellow-500',
            border: 'border-yellow-200',
        },
        info: {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
            focusRing: 'focus:ring-blue-500',
            border: 'border-blue-200',
        }
    };

    const config = variants[variant];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-hard-sm border border-line transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
                                            <FaExclamationTriangle className={`h-5 w-5 ${config.iconColor}`} />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-display font-extrabold uppercase text-ink tracking-[-0.01em]"
                                        >
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-text-soft hover:text-ink transition-colors p-1 rounded-lg hover:bg-paper-dim"
                                        disabled={isDeleting}
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Message */}
                                <div className="mt-2">
                                    <p className="text-sm text-text-soft leading-relaxed">
                                        {message}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-text-soft hover:bg-paper-dim hover:text-ink transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={onClose}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={`inline-flex items-center justify-center rounded-lg border border-transparent ${config.buttonBg} px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 ${config.focusRing} focus:ring-offset-2 transition-all duration-200 hover:shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                        onClick={onConfirm}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {variant === 'danger' ? 'Deleting...' : variant === 'warning' ? 'Processing...' : 'Loading...'}
                                            </>
                                        ) : (
                                            <>
                                                <FaTrash className="w-4 h-4 mr-2" />
                                                {variant === 'danger' ? 'Delete' : variant === 'warning' ? 'Confirm' : 'Proceed'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
