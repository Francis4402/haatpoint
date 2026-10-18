import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useId,
} from 'react';
import { usePage } from '@inertiajs/react';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => number;
      reset: (opt_widget_id?: number) => void;
      getResponse: (opt_widget_id?: number) => string;
      ready: (callback: () => void) => void;
    };
    __recaptchaLoadedCallbacks?: Array<() => void>;
    __onRecaptchaLoaded?: () => void;
  }
}

export interface RecaptchaRef {
  reset: () => void;
  getResponse: () => string;
}

interface RecaptchaProps {
  siteKey?: string;
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  errorMessage?: string;
  className?: string;
}

// Google's official reCAPTCHA v2 checkbox test site key (always valid on any domain/localhost)
export const DEFAULT_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const Recaptcha = forwardRef<RecaptchaRef, RecaptchaProps>(
  (
    {
      siteKey: propSiteKey,
      onChange,
      onExpired,
      onError,
      errorMessage,
      className = '',
    },
    ref
  ) => {
    const pageProps = usePage().props as { recaptchaSiteKey?: string };
    const siteKey =
      propSiteKey || pageProps.recaptchaSiteKey || DEFAULT_TEST_SITE_KEY;

    const uniqueId = useId().replace(/:/g, '-');
    const containerId = `recaptcha-box-${uniqueId}`;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [isScriptReady, setIsScriptReady] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    // Keep stable references to callbacks to avoid re-rendering reCAPTCHA on parent state changes
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const onExpiredRef = useRef(onExpired);
    onExpiredRef.current = onExpired;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (
          widgetIdRef.current !== null &&
          window.grecaptcha &&
          typeof window.grecaptcha.reset === 'function'
        ) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch {
            // Widget might not be active
          }
        }
        onChangeRef.current(null);
      },
      getResponse: () => {
        if (
          widgetIdRef.current !== null &&
          window.grecaptcha &&
          typeof window.grecaptcha.getResponse === 'function'
        ) {
          try {
            return window.grecaptcha.getResponse(widgetIdRef.current);
          } catch {
            return '';
          }
        }
        return '';
      },
    }));

    // Step 1: Ensure Google reCAPTCHA v2 script is loaded into the document
    useEffect(() => {
      if (typeof window === 'undefined') return;

      const notifyReady = () => {
        if (window.grecaptcha) {
          if (typeof window.grecaptcha.ready === 'function') {
            window.grecaptcha.ready(() => {
              setIsScriptReady(true);
            });
          } else if (typeof window.grecaptcha.render === 'function') {
            setIsScriptReady(true);
          }
        }
      };

      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        notifyReady();
        return;
      }

      const scriptId = 'google-recaptcha-v2-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!window.__recaptchaLoadedCallbacks) {
        window.__recaptchaLoadedCallbacks = [];
      }

      window.__recaptchaLoadedCallbacks.push(() => {
        notifyReady();
      });

      if (!window.__onRecaptchaLoaded) {
        window.__onRecaptchaLoaded = () => {
          if (window.__recaptchaLoadedCallbacks) {
            window.__recaptchaLoadedCallbacks.forEach((cb) => cb());
            window.__recaptchaLoadedCallbacks = [];
          }
        };
      }

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src =
          'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoaded&render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          notifyReady();
        };
        document.head.appendChild(script);
      } else {
        notifyReady();
      }

      // Fallback polling in case of asynchronous script timing
      const pollTimer = setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          notifyReady();
          clearInterval(pollTimer);
        }
      }, 250);

      const timeoutTimer = setTimeout(() => {
        clearInterval(pollTimer);
      }, 8000);

      return () => {
        clearInterval(pollTimer);
        clearTimeout(timeoutTimer);
      };
    }, []);

    // Step 2: Render reCAPTCHA widget once the script is ready and DOM container is mounted
    useEffect(() => {
      if (!isScriptReady || !containerRef.current) return;
      if (typeof window === 'undefined' || !window.grecaptcha) return;
      if (typeof window.grecaptcha.render !== 'function') return;

      // Never re-render in the same container instance
      if (widgetIdRef.current !== null) return;

      const renderWidget = (keyToUse: string) => {
        if (!containerRef.current || !window.grecaptcha) return null;

        try {
          containerRef.current.innerHTML = '';
          const id = window.grecaptcha.render(containerRef.current, {
            sitekey: keyToUse,
            callback: (token: string) => {
              onChangeRef.current(token);
            },
            'expired-callback': () => {
              onChangeRef.current(null);
              onExpiredRef.current?.();
            },
            'error-callback': () => {
              onChangeRef.current(null);
              onErrorRef.current?.();
            },
          });
          widgetIdRef.current = id;
          setIsRendered(true);
          return id;
        } catch (err) {
          console.warn('reCAPTCHA render attempt failed with key:', keyToUse, err);
          return null;
        }
      };

      // Try with configured siteKey; if it fails (e.g. invalid key type / invalid domain),
      // retry with Google's official test site key so the widget always displays and works.
      const id = renderWidget(siteKey);
      if (id === null && siteKey !== DEFAULT_TEST_SITE_KEY) {
        renderWidget(DEFAULT_TEST_SITE_KEY);
      }

      return () => {
        widgetIdRef.current = null;
        setIsRendered(false);
      };
    }, [isScriptReady, siteKey]);

    return (
      <div className={`recaptcha-wrapper flex flex-col items-center justify-center my-3.5 w-full ${className}`}>
        {/* Widget Container */}
        <div className="relative min-w-[304px] min-h-[78px] flex items-center justify-center">
          {!isRendered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2.5 rounded-md border border-ink/15 bg-paper/60 px-4 py-3 text-xs font-mono text-ink/60">
              <FaSpinner className="h-4 w-4 animate-spin text-marigold" />
              <span>Loading reCAPTCHA verification...</span>
            </div>
          )}
          <div
            id={containerId}
            ref={containerRef}
            className="recaptcha-container"
            style={{ minHeight: '78px', minWidth: '304px' }}
          />
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <p className="mt-2 text-xs font-semibold text-red-600 flex items-center justify-center text-center">
            <FaExclamationCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }
);

Recaptcha.displayName = 'Recaptcha';

export default Recaptcha;
