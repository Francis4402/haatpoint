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
        <div className="p-3 rounded-lg bg-red-100">
          <FaTrash className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Delete Account</h3>
          <p className="text-gray-600 mt-1">Permanently remove your account and all associated data</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-red-800 mb-2">Warning: This action cannot be undone</h4>
            <p className="text-red-700">
              Once you delete your account, all of your data including profile information, activity history,
              and personal settings will be permanently removed. This action cannot be reversed.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={openModal}
        className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3"
      >
        <FaTrash className="h-5 w-5" />
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
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-gray-900">
                        Delete Your Account
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        This action is permanent and cannot be undone
                      </p>
                    </div>
                  </div>

                  <form onSubmit={deleteUser} className="space-y-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="Your current password"
                        autoFocus
                      />
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">
                        By deleting your account, you will lose access to:
                      </p>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          All stored data and preferences
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          Purchase history and orders
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          Subscription and billing information
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="h-5 w-5" />
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
