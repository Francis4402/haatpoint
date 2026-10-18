import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { usePage } from '@inertiajs/react';
import { FaExclamationCircle } from 'react-icons/fa';

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

const DEFAULT_TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

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

    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
            // Widget might have unmounted or not been rendered yet
          }
        }
        onChange(null);
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

    // Ensure reCAPTCHA script is loaded
    useEffect(() => {
      if (typeof window === 'undefined') return;

      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        setIsScriptLoaded(true);
        return;
      }

      const scriptId = 'google-recaptcha-v2-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!window.__recaptchaLoadedCallbacks) {
        window.__recaptchaLoadedCallbacks = [];
      }

      window.__recaptchaLoadedCallbacks.push(() => {
        setIsScriptLoaded(true);
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
        document.head.appendChild(script);
      }
    }, []);

    // Render reCAPTCHA widget once script and container are ready
    useEffect(() => {
      if (!isScriptLoaded || !containerRef.current) return;
      if (typeof window === 'undefined' || !window.grecaptcha) return;

      // Don't render multiple times in the same container
      if (widgetIdRef.current !== null) return;

      try {
        containerRef.current.innerHTML = '';
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onChange(token);
          },
          'expired-callback': () => {
            onChange(null);
            onExpired?.();
          },
          'error-callback': () => {
            onChange(null);
            onError?.();
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error('Failed to render reCAPTCHA:', err);
      }

      return () => {
        widgetIdRef.current = null;
      };
    }, [isScriptLoaded, siteKey, onChange, onExpired, onError]);

    return (
      <div className={`recaptcha-wrapper flex flex-col items-center justify-center my-3 ${className}`}>
        <div
          ref={containerRef}
          className="recaptcha-container overflow-hidden rounded-md min-h-[78px] flex items-center justify-center"
        />
        {errorMessage && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center justify-center text-center">
            <FaExclamationCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }
);

Recaptcha.displayName = 'Recaptcha';

export default Recaptcha;
