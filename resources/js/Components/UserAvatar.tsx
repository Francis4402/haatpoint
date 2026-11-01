import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  textClassName?: string;
}

// Deterministic aesthetic palette based on string hash
const BG_PALETTES = [
  'bg-emerald-600 text-white',
  'bg-indigo-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-blue-600 text-white',
  'bg-violet-600 text-white',
  'bg-teal-600 text-white',
  'bg-orange-600 text-white',
  'bg-cyan-600 text-white',
];

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getAvatarColor(name?: string | null): string {
  if (!name) return BG_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BG_PALETTES.length;
  return BG_PALETTES[index];
}

export function resolveUserAvatarUrl(images?: string | null): string | null {
  if (!images || !images.trim()) return null;
  const clean = images.trim();
  if (clean === '/placeholder.png' || clean.endsWith('/placeholder.png')) return null;
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:') || clean.startsWith('data:')) {
    return clean;
  }
  return clean.startsWith('/') ? clean : `/storage/${clean}`;
}

export default function UserAvatar({
  src,
  name,
  className = 'w-10 h-10',
  textClassName = 'text-sm'
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = resolveUserAvatarUrl(src);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // If there is an image URL and it hasn't errored
  if (resolvedUrl && !hasError) {
    return (
      <img
        src={resolvedUrl}
        alt={name || 'User avatar'}
        className={`${className} object-cover rounded-full`}
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback to initial letter with background color
  const initials = getInitials(name);
  const palette = getAvatarColor(name);

  return (
    <div
      className={`${className} rounded-full flex items-center justify-center font-display font-bold uppercase select-none shadow-sm shrink-0 ${palette}`}
      title={name || 'User'}
      aria-label={name || 'User avatar'}
    >
      <span className={textClassName}>{initials}</span>
    </div>
  );
}
