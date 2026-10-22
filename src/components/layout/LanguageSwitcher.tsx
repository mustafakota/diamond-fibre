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
      aria-label="Language Switcher"
      className="inline-flex items-center p-1 rounded-full bg-[var(--color-sand-300)]/50 border border-[var(--color-sand-400)]/60 text-xs font-semibold"
    >
      <Link
        href={getTargetUrl('en')}
        aria-current={currentLocale === 'en' ? 'page' : undefined}
        className={`px-3 py-1.5 rounded-full min-h-[36px] flex items-center transition-all ${
          currentLocale === 'en'
            ? 'bg-white text-[var(--color-carbon-900)] shadow-xs font-bold'
            : 'text-[var(--color-carbon-600)] hover:text-[var(--color-carbon-900)]'
        }`}
      >
        English
      </Link>
      <Link
        href={getTargetUrl('hi')}
        aria-current={currentLocale === 'hi' ? 'page' : undefined}
        className={`px-3 py-1.5 rounded-full min-h-[36px] flex items-center transition-all ${
          currentLocale === 'hi'
            ? 'bg-white text-[var(--color-carbon-900)] shadow-xs font-bold'
            : 'text-[var(--color-carbon-600)] hover:text-[var(--color-carbon-900)]'
        }`}
      >
        हिन्दी
      </Link>
    </div>
  );
};
