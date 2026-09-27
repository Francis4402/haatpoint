import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  dark?: boolean;
}

export default function Eyebrow({ children, dark = false }: EyebrowProps) {
  return (
    <div
      className={`flex items-center gap-2.5 mb-3.5 font-mono text-xs tracking-[0.14em] uppercase ${
        dark ? "text-sun" : "text-marigold-dark"
      }`}
    >
      <span className="w-[22px] h-[2px] bg-marigold inline-block" />
      {children}
    </div>
  );
}
