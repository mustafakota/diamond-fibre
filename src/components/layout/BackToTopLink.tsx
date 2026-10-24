'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';

export interface BackToTopLinkProps {
  locale: Locale;
  className?: string;
}

/**
 * Subtle "Back to top" link for Diamond Fibre footer.
 * Semantic anchor pointing to #top with accessible keyboard focus
 * and prefers-reduced-motion aware scrolling.
 */
export const BackToTopLink: React.FC<BackToTopLinkProps> = ({ locale, className = '' }) => {
  const dict = getDictionary(locale);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const topElement = document.getElementById('top');
    if (topElement) {
      topElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      topElement.focus({ preventScroll: true });
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }

    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState(null, '', '#top');
    }
  };

  return (
    <a
      href="#top"
      onClick={handleClick}
      aria-label={dict.footer.backToTop}
      className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--color-sand-300)]/70 hover:text-[var(--color-terracotta-500)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] focus-visible:text-[var(--color-terracotta-500)] rounded px-1.5 py-1 transition-colors group active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none motion-reduce:transition-none cursor-pointer ${className}`}
    >
      <span>{dict.footer.backToTop}</span>
      <ArrowUp
        className="w-3.5 h-3.5 text-[var(--color-sand-300)]/60 group-hover:text-[var(--color-terracotta-500)] group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none"
        aria-hidden="true"
      />
    </a>
  );
};
