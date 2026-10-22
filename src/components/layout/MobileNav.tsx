'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Phone } from 'lucide-react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { LanguageSwitcher } from './LanguageSwitcher';
import { buildWhatsAppLink, buildPhoneLink, PROVISIONAL_DISPLAY_PHONE } from '@/lib/whatsapp';
import { useMounted } from '@/lib/useMounted';
import { isNavActive } from '@/lib/nav';

export interface MobileNavProps {
  locale: Locale;
}

export const MobileNav: React.FC<MobileNavProps> = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();
  const dict = getDictionary(locale);

  const isHomeActive = isNavActive(pathname, locale, 'home');
  const isMattressesActive = isNavActive(pathname, locale, 'mattresses');
  const isPillowsActive = isNavActive(pathname, locale, 'pillows');
  const isRazaisActive = isNavActive(pathname, locale, 'razais');
  const isBlanketsActive = isNavActive(pathname, locale, 'blankets');
  const isWholesaleActive = isNavActive(pathname, locale, 'wholesale');
  const isOurStoryActive = isNavActive(pathname, locale, 'ourStory');
  const isContactActive = isNavActive(pathname, locale, 'contact');

  const getDrawerLinkClass = (isActive: boolean, extra = '') =>
    isActive
      ? `min-h-[44px] flex items-center px-3 rounded-lg bg-[var(--color-terracotta-50)] font-semibold text-[var(--color-terracotta-600)] transition-colors ${extra}`.trim()
      : `min-h-[44px] flex items-center px-3 rounded-lg hover:bg-[var(--color-sand-300)]/40 text-[var(--color-carbon-900)] transition-colors ${extra}`.trim();

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop & Drawer rendered into document.body to avoid header backdrop-blur stacking context */}
      {mounted && isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="fixed top-0 right-0 bottom-0 z-[101] w-[min(85vw,360px)] bg-[var(--color-warm-ivory-100)] border-l border-[var(--color-sand-300)] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-sand-300)]">
            <Link href={`/${locale}`} onClick={closeMenu}>
              <Image
                src="/images/logo/diamond-fibre-logo.webp"
                alt="Diamond Fibre - The Comfort Revolution"
                width={217}
                height={72}
                className="w-[155px] h-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[var(--color-sand-300)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] text-[var(--color-carbon-800)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Language Switcher in Drawer */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-carbon-600)] uppercase tracking-wider">
              Language / भाषा
            </span>
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Primary Nav Links */}
          <nav className="flex flex-col gap-1 text-[var(--color-carbon-900)] font-medium">
            <Link
              href={`/${locale}`}
              onClick={closeMenu}
              aria-current={isHomeActive ? 'page' : undefined}
              className={getDrawerLinkClass(isHomeActive)}
            >
              {dict.nav.home}
            </Link>

            {/* Five Categories Section */}
            <div className="pt-2 pb-1">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-600)]">
                {dict.nav.products}
              </span>
            </div>
            <div className="flex flex-col pl-2 border-l-2 border-[var(--color-sand-300)] gap-1">
              <Link
                href={`/${locale}/products/mattresses`}
                onClick={closeMenu}
                aria-current={isMattressesActive ? 'page' : undefined}
                className={getDrawerLinkClass(isMattressesActive, 'text-sm')}
              >
                {dict.nav.mattresses}
              </Link>
              <Link
                href={`/${locale}/products/pillows`}
                onClick={closeMenu}
                aria-current={isPillowsActive ? 'page' : undefined}
                className={getDrawerLinkClass(isPillowsActive, 'text-sm')}
              >
                {dict.nav.pillows}
              </Link>
              <Link
                href={`/${locale}/products/razais`}
                onClick={closeMenu}
                aria-current={isRazaisActive ? 'page' : undefined}
                className={getDrawerLinkClass(isRazaisActive, 'text-sm')}
              >
                {dict.nav.razais}
              </Link>
              <Link
                href={`/${locale}/products/blankets`}
                onClick={closeMenu}
                aria-current={isBlanketsActive ? 'page' : undefined}
                className={getDrawerLinkClass(isBlanketsActive, 'text-sm')}
              >
                {dict.nav.blankets}
              </Link>
            </div>

            <div className="pt-3 border-t border-[var(--color-sand-300)] mt-2 flex flex-col gap-1">
              <Link
                href={`/${locale}/wholesale`}
                onClick={closeMenu}
                aria-current={isWholesaleActive ? 'page' : undefined}
                className={getDrawerLinkClass(isWholesaleActive)}
              >
                {dict.nav.wholesale}
              </Link>
              <Link
                href={`/${locale}/our-story`}
                onClick={closeMenu}
                aria-current={isOurStoryActive ? 'page' : undefined}
                className={getDrawerLinkClass(isOurStoryActive)}
              >
                {dict.nav.ourStory}
              </Link>
              <Link
                href={`/${locale}/contact`}
                onClick={closeMenu}
                aria-current={isContactActive ? 'page' : undefined}
                className={getDrawerLinkClass(isContactActive)}
              >
                {dict.nav.contact}
              </Link>
            </div>
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-[var(--color-sand-300)] flex flex-col gap-3">
          <a
            href={buildWhatsAppLink(
              locale === 'hi'
                ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों के बारे में पूछताछ करना चाहता हूँ।'
                : 'Hello Diamond Fibre, I would like to enquire about your bedding products.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] w-full flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full font-semibold px-4 py-2.5 shadow-xs hover:bg-[#1EBE5D] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{dict.nav.whatsappQuickAction}</span>
          </a>

          <a
            href={buildPhoneLink()}
            className="min-h-[44px] w-full flex items-center justify-center gap-2 text-xs font-semibold text-[var(--color-carbon-600)] hover:text-[var(--color-carbon-900)]"
          >
            <Phone className="w-4 h-4" />
            <span>{PROVISIONAL_DISPLAY_PHONE} (Provisional)</span>
          </a>
        </div>
      </div>
    </>,
    document.body
  )}
</div>
  );
};
