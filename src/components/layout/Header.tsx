'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { isNavActive } from '@/lib/nav';

export interface HeaderProps {
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ locale }) => {
  const pathname = usePathname();
  const dict = getDictionary(locale);

  const isHomeActive = isNavActive(pathname, locale, 'home');
  const isProductsActive = isNavActive(pathname, locale, 'products');
  const isMattressesActive = isNavActive(pathname, locale, 'mattresses');
  const isPillowsActive = isNavActive(pathname, locale, 'pillows');
  const isRazaisActive = isNavActive(pathname, locale, 'razais');
  const isBlanketsActive = isNavActive(pathname, locale, 'blankets');
  const isWholesaleActive = isNavActive(pathname, locale, 'wholesale');
  const isOurStoryActive = isNavActive(pathname, locale, 'ourStory');
  const isContactActive = isNavActive(pathname, locale, 'contact');

  const getTopLinkClass = (isActive: boolean, extra = '') =>
    isActive
      ? `text-[var(--color-terracotta-600)] font-semibold hover:text-[var(--color-terracotta-500)] transition-colors min-h-[44px] flex items-center ${extra}`.trim()
      : `text-[var(--color-carbon-800)] hover:text-[var(--color-terracotta-600)] transition-colors min-h-[44px] flex items-center ${extra}`.trim();

  const getDropdownLinkClass = (isActive: boolean) =>
    isActive
      ? 'px-3 py-2 rounded-lg bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] text-xs font-semibold transition-colors'
      : 'px-3 py-2 rounded-lg hover:bg-[var(--color-sand-300)]/40 text-xs font-semibold text-[var(--color-carbon-800)] transition-colors';

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-warm-ivory-200)]/95 backdrop-blur-md border-b border-[var(--color-sand-300)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] rounded-lg py-1"
            aria-label={`${dict.nav.brandName} - ${dict.nav.home}`}
          >
            <Image
              src="/images/logo/diamond-fibre-logo.webp"
              alt="Diamond Fibre - The Comfort Revolution"
              width={217}
              height={72}
              priority
              className="w-[150px] sm:w-[210px] h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-carbon-800)]">
          <Link
            href={`/${locale}`}
            aria-current={isHomeActive ? 'page' : undefined}
            className={getTopLinkClass(isHomeActive)}
          >
            {dict.nav.home}
          </Link>

          {/* Direct Category Links */}
          <div className="relative group">
            <Link
              href={`/${locale}/products`}
              aria-current={isProductsActive ? 'page' : undefined}
              className={getTopLinkClass(isProductsActive, 'gap-1')}
            >
              {dict.nav.products}
            </Link>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 hidden group-hover:flex group-focus-within:flex flex-col bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-xl p-2 shadow-lg min-w-[180px] z-50">
              <Link
                href={`/${locale}/products/mattresses`}
                aria-current={isMattressesActive ? 'page' : undefined}
                className={getDropdownLinkClass(isMattressesActive)}
              >
                {dict.nav.mattresses}
              </Link>
              <Link
                href={`/${locale}/products/pillows`}
                aria-current={isPillowsActive ? 'page' : undefined}
                className={getDropdownLinkClass(isPillowsActive)}
              >
                {dict.nav.pillows}
              </Link>
              <Link
                href={`/${locale}/products/razais`}
                aria-current={isRazaisActive ? 'page' : undefined}
                className={getDropdownLinkClass(isRazaisActive)}
              >
                {dict.nav.razais}
              </Link>
              <Link
                href={`/${locale}/products/blankets`}
                aria-current={isBlanketsActive ? 'page' : undefined}
                className={getDropdownLinkClass(isBlanketsActive)}
              >
                {dict.nav.blankets}
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}/wholesale`}
            aria-current={isWholesaleActive ? 'page' : undefined}
            className={getTopLinkClass(isWholesaleActive)}
          >
            {dict.nav.wholesale}
          </Link>
          <Link
            href={`/${locale}/our-story`}
            aria-current={isOurStoryActive ? 'page' : undefined}
            className={getTopLinkClass(isOurStoryActive)}
          >
            {dict.nav.ourStory}
          </Link>
          <Link
            href={`/${locale}/contact`}
            aria-current={isContactActive ? 'page' : undefined}
            className={getTopLinkClass(isContactActive)}
          >
            {dict.nav.contact}
          </Link>
        </nav>

        {/* Right Section: Language Switcher, Desktop WhatsApp, Mobile Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          <a
            href={buildWhatsAppLink(
              locale === 'hi'
                ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों के बारे में जानकारी चाहता हूँ।'
                : 'Hello Diamond Fibre, I would like to enquire about your bedding products.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full px-4 py-2 text-xs font-bold tracking-wide shadow-xs hover:bg-[#1EBE5D] transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile Navigation Trigger */}
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
};
