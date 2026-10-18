import { useState, Fragment, useEffect } from 'react';
import { FaGoogle, FaShoppingBag, FaStore, FaArrowRight, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

type Destination = 'user' | 'superadmin' | 'admin' | 'agent' | 'choose';

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: FaGoogle, iconColor: 'text-red-500' },
] as const;

interface SocialButtonsProps {
  destination?: Destination;
  allowAccountTypeChoice?: boolean;
  recaptchaToken?: string | null;
  onRequireRecaptcha?: () => void;
}

export default function SocialButtons({
  destination = 'user',
  allowAccountTypeChoice = true,
  recaptchaToken,
  onRequireRecaptcha,
}: SocialButtonsProps) {
  const [showAccountChoice, setShowAccountChoice] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('google');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear any prompt error once reCAPTCHA is completed
  useEffect(() => {
    if (recaptchaToken) {
      setErrorMessage(null);
    }
  }, [recaptchaToken]);

  // Only prompt when destination is 'user' or 'choose' and allowAccountTypeChoice is true.
  // Dedicated staff/agent/admin registration already has their destination predetermined.
  const shouldPrompt = allowAccountTypeChoice && (destination === 'user' || destination === 'choose');

  const handleProviderClick = (providerId: string) => {
    setSelectedProvider(providerId);

    // Enforce reCAPTCHA completion before letting anyone sign in with Google
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA verification above before signing in with Google.");
      onRequireRecaptcha?.();
      return;
    }

    setErrorMessage(null);

    if (shouldPrompt) {
      setShowAccountChoice(true);
    } else {
      window.location.href = route('auth.redirect', {
        provider: providerId,
        destination,
        recaptcha_token: recaptchaToken,
      });
    }
  };

  const handleSelectType = (chosenDestination: 'user' | 'agent') => {
    if (!recaptchaToken) {
      setShowAccountChoice(false);
      setErrorMessage("Please complete the reCAPTCHA verification above before signing in with Google.");
      onRequireRecaptcha?.();
      return;
    }

    setShowAccountChoice(false);
    window.location.href = route('auth.redirect', {
      provider: selectedProvider,
      destination: chosenDestination,
      recaptcha_token: recaptchaToken,
    });
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-ink/40 font-body">or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        {PROVIDERS.map(({ id, label, icon: Icon, iconColor }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleProviderClick(id)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-ink/20 rounded-lg shadow-sm text-sm font-body font-semibold text-ink bg-white hover:bg-paper transition-colors cursor-pointer"
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
            Continue with {label}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="mt-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center justify-center text-center">
          <FaExclamationCircle className="h-4 w-4 mr-1.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Account Type Selection Modal for Social Login */}
      <Transition appear show={showAccountChoice} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowAccountChoice(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-left align-middle shadow-2xl border border-ink/10 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-marigold/10 text-marigold border border-marigold/20 mb-2">
                        <FaGoogle className="h-3 w-3 text-red-500" />
                        <span>Google Sign In</span>
                      </div>
                      <Dialog.Title as="h3" className="text-2xl font-display font-extrabold text-ink uppercase tracking-tight">
                        Choose Account Type
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-ink/60 font-body">
                        Select how you would like to continue with your Google account:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAccountChoice(false)}
                      className="rounded-xl border border-ink/10 p-2 text-ink/40 hover:text-ink hover:border-ink/30 transition-colors cursor-pointer"
                      aria-label="Close dialog"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    {/* Option 1: Customer / User */}
                    <button
                      type="button"
                      onClick={() => handleSelectType('user')}
                      className="group relative flex items-start text-left gap-4 p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-marigold/5 hover:border-marigold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-marigold/15 border border-marigold/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FaShoppingBag className="h-6 w-6 text-marigold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display font-bold text-lg text-ink group-hover:text-marigold transition-colors">
                            Customer Account
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-marigold/10 text-marigold">
                            Shop &amp; Buy
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 leading-relaxed font-body">
                          Browse thousands of authentic products, place orders with Cash on Delivery or bKash, and track deliveries.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-bold text-marigold group-hover:translate-x-1 transition-transform">
                          <span>Continue with Google as Customer</span>
                          <FaArrowRight className="ml-1.5 h-3 w-3" />
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Agent */}
                    <button
                      type="button"
                      onClick={() => handleSelectType('agent')}
                      className="group relative flex items-start text-left gap-4 p-5 rounded-2xl border-2 border-ink/10 bg-paper hover:bg-blue-50/50 hover:border-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-100/70 border border-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FaStore className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display font-bold text-lg text-ink group-hover:text-blue-600 transition-colors">
                            Agent / Merchant
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Sell &amp; Earn
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 leading-relaxed font-body">
                          Open and manage your online store, upload products, process customer orders, and earn business profits.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span>Continue with Google as Agent</span>
                          <FaArrowRight className="ml-1.5 h-3 w-3" />
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink/10 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAccountChoice(false)}
                      className="text-xs font-body font-medium text-ink/60 hover:text-ink transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}