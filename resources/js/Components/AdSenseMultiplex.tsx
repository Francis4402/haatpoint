import { useRef } from 'react';
import { useAdSenseInit } from './AdSenseDisplay';

interface AdSenseMultiplexProps {
  className?: string;
  slot?: string;
  adClient?: string;
  title?: string;
}

export default function AdSenseMultiplex({
  className = '',
  slot = '8788437847',
  adClient = 'ca-pub-2617027124219046',
  title = 'Sponsored Recommendations',
}: AdSenseMultiplexProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLocalhost = useAdSenseInit(adRef, [slot, adClient]);

  return (
    <div className={`w-full my-10 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-soft">
          {title}
        </span>
        <span className="text-[10px] font-mono uppercase text-text-soft/60">
          Ads by Google
        </span>
      </div>
      <div className="block w-full min-h-[160px] bg-paper-dim/40 border border-line/50 rounded-2xl p-3 sm:p-5 overflow-hidden shadow-sm">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-format="autorelaxed"
          data-ad-client={adClient}
          data-ad-slot={slot}
        />

        {/* Localhost visual preview placeholder */}
        {isLocalhost && (
          <div className="py-8 px-4 w-full flex flex-col items-center justify-center border-2 border-dashed border-marigold/40 rounded-xl bg-amber-50/50">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold bg-marigold/20 text-marigold-dark uppercase tracking-wider mb-2">
              Google AdSense Multiplex Unit (Localhost Preview)
            </span>
            <p className="text-xs text-text-soft text-center max-w-md">
              Slot ID: <span className="font-mono text-ink font-semibold">{slot}</span> • Format: Autorelaxed Grid
            </p>
            <p className="text-[11px] text-text-soft/70 mt-1 text-center">
              A multi-cell native recommendation grid will be populated here automatically on your live domain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
