import { useEffect, useRef, useState } from 'react';

interface AdSenseDisplayProps {
  className?: string;
  slot?: string;
  adClient?: string;
  label?: boolean;
}

export default function AdSenseDisplay({
  className = '',
  slot = '8587585300',
  adClient = 'ca-pub-2617027124219046',
  label = true,
}: AdSenseDisplayProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local'));
    setIsLocalhost(isLocal);

    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (e) {
      console.debug('AdSense Display push:', e);
    }
  }, []);

  return (
    <div className={`w-full my-8 text-center overflow-hidden ${className}`}>
      {label && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-text-soft/60 mb-1.5">
          Advertisement
        </div>
      )}
      <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center bg-paper-dim/40 border border-line/50 rounded-xl p-2 overflow-hidden shadow-sm relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
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
