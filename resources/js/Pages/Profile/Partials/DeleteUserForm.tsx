import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaTrash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function DeleteUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: '',
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const deleteUser = (e: React.FormEvent) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-rose-100">
          <FaTrash className="h-6 w-6 text-rose-600" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-ink">Delete Account</h3>
          <p className="text-text-soft text-sm mt-1">Permanently remove your account and all associated data</p>
        </div>
      </div>

      <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-base font-display font-bold text-rose-900 mb-1">Warning: This action cannot be undone</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              Once you delete your account, all of your data including profile information, activity history,
              and personal settings will be permanently removed. This action cannot be reversed.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={openModal}
        className="w-full px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-body font-bold uppercase tracking-wider rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
      >
        <FaTrash className="h-4 w-4" />
        Delete Account
      </button>

      {/* Confirmation Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-hard-lg border border-line transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                        <FaExclamationTriangle className="h-6 w-6 text-rose-600" />
                      </div>
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-display font-bold text-ink">
                        Delete Your Account
                      </Dialog.Title>
                      <p className="text-xs text-text-soft mt-0.5">
                        This action is permanent and cannot be undone
                      </p>
                    </div>
                  </div>

                  <form onSubmit={deleteUser} className="space-y-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all duration-200 text-sm font-body"
                        placeholder="Your current password"
                        autoFocus
                      />
                      {errors.password && (
                        <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="bg-paper-dim border border-line rounded-xl p-4">
                      <p className="text-xs font-semibold text-ink">
                        By deleting your account, you will lose access to:
                      </p>
                      <ul className="mt-2 text-xs text-text-soft space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-text-soft/60 rounded-full"></div>
                          All stored data and preferences
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-text-soft/60 rounded-full"></div>
                          Purchase history and orders
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-text-soft/60 rounded-full"></div>
                          Subscription and billing information
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-5 py-2.5 border border-line text-ink font-semibold rounded-xl hover:bg-paper-dim transition-colors duration-200 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                      >
                        {processing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrash className="h-3.5 w-3.5" />
                            Confirm Deletion
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
