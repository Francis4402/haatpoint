import { useEffect, useRef, useState } from 'react';

interface AdSenseDisplayProps {
  className?: string;
  slot?: string;
  adClient?: string;
  label?: boolean;
}

export function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.test') ||
    /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

export function useAdSenseInit(
  adRef: React.RefObject<HTMLModElement | null>,
  deps: unknown[]
): boolean {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const local = isLocalDevHost();
    setIsLocalhost(local);
    if (local) return;

    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 20;

    const initAd = () => {
      const el = adRef.current;
      if (!el) return;

      // Avoid double-initializing the same <ins> tag (StrictMode / hydration)
      if (el.getAttribute('data-adsbygoogle-status')) return;

      // Wait until block container has layout width to prevent availableWidth=0 TagError
      if (el.offsetWidth === 0) {
        if (attempts < maxAttempts) {
          attempts += 1;
          rafId = window.requestAnimationFrame(initAd);
        }
        return;
      }

      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.debug('AdSense push:', e);
      }
    };

    rafId = window.requestAnimationFrame(initAd);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, deps);

  return isLocalhost;
}

export default function AdSenseDisplay({
  className = '',
  slot = '8587585300',
  adClient = 'ca-pub-2617027124219046',
  label = true,
}: AdSenseDisplayProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLocalhost = useAdSenseInit(adRef, [slot, adClient]);

  return (
    <div className={`w-full my-8 text-center overflow-hidden ${className}`}>
      {label && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-text-soft/60 mb-1.5">
          Advertisement
        </div>
      )}
      <div className="block w-full min-h-[100px] sm:min-h-[120px] bg-paper-dim/40 border border-line/50 rounded-xl p-2 overflow-hidden shadow-sm relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Localhost visual preview placeholder */}
        {isLocalhost && (
          <div className="py-6 px-4 w-full flex flex-col items-center justify-center border-2 border-dashed border-marigold/40 rounded-lg bg-amber-50/50">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-marigold/20 text-marigold-dark uppercase tracking-wider mb-1">
              Google AdSense Display Ad (Localhost Preview)
            </span>
            <p className="text-xs text-text-soft">
              Slot ID: <span className="font-mono text-ink font-semibold">{slot}</span> • Format: Auto / Responsive
            </p>
            <p className="text-[11px] text-text-soft/70 mt-1">
              Real ads will serve on your verified live domain once approved by Google AdSense.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
