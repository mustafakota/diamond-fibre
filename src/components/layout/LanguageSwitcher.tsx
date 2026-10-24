'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/seo';

export interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const pathname = usePathname() || `/${currentLocale}`;

  // Compute equivalent target path for each language
  const getTargetUrl = (targetLocale: Locale): string => {
    // If path starts with /en or /hi, swap it
    if (pathname.startsWith('/en')) {
      return pathname.replace(/^\/en(\/|$)/, `/${targetLocale}$1`) || `/${targetLocale}`;
    }
    if (pathname.startsWith('/hi')) {
      return pathname.replace(/^\/hi(\/|$)/, `/${targetLocale}$1`) || `/${targetLocale}`;
    }
    // Fallback if no locale prefix
    return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center p-0.5 rounded-lg bg-[var(--color-sand-400)]/40 border border-[var(--color-sand-400)] text-xs font-medium shadow-2xs"
    >
      <Link
        href={getTargetUrl('en')}
        aria-current={currentLocale === 'en' ? 'page' : undefined}
        className={`px-2.5 py-1 rounded-[6px] min-h-[32px] sm:min-h-[28px] flex items-center active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] ${
          currentLocale === 'en'
            ? 'bg-[var(--color-warm-ivory-100)] text-[var(--color-carbon-800)] font-semibold shadow-2xs border border-[var(--color-sand-400)]/70'
            : 'text-[var(--color-carbon-700)] hover:text-[var(--color-carbon-900)] hover:bg-[var(--color-warm-ivory-100)]/50 border border-transparent'
        }`}
      >
        English
      </Link>
      <Link
        href={getTargetUrl('hi')}
        aria-current={currentLocale === 'hi' ? 'page' : undefined}
        className={`px-2.5 py-1 rounded-[6px] min-h-[32px] sm:min-h-[28px] flex items-center active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] ${
          currentLocale === 'hi'
            ? 'bg-[var(--color-warm-ivory-100)] text-[var(--color-carbon-800)] font-semibold shadow-2xs border border-[var(--color-sand-400)]/70'
            : 'text-[var(--color-carbon-700)] hover:text-[var(--color-carbon-900)] hover:bg-[var(--color-warm-ivory-100)]/50 border border-transparent'
        }`}
      >
        हिन्दी
      </Link>
    </div>
  );
};
