'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { isNavActive } from '@/lib/nav';

export interface HeaderProps {
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ locale }) => {
  const pathname = usePathname();
  const dict = getDictionary(locale);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomeActive = isNavActive(pathname, locale, 'home');
  const isProductsActive = isNavActive(pathname, locale, 'products');
  const isProductsOverviewActive = pathname
    ? pathname.replace(/\/$/, '') === `/${locale}/products` || pathname.replace(/\/$/, '') === '/products'
    : false;
  const isMattressesActive = isNavActive(pathname, locale, 'mattresses');
  const isPillowsActive = isNavActive(pathname, locale, 'pillows');
  const isRazaisActive = isNavActive(pathname, locale, 'razais');
  const isBlanketsActive = isNavActive(pathname, locale, 'blankets');
  const isWholesaleActive = isNavActive(pathname, locale, 'wholesale');
  const isOurStoryActive = isNavActive(pathname, locale, 'ourStory');
  const isContactActive = isNavActive(pathname, locale, 'contact');

  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = React.useState(false);
  const [isEscapeClosed, setIsEscapeClosed] = React.useState(false);
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLAnchorElement>(null);

  // Close dropdown during render if route changes
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsProductsDropdownOpen(false);
    setIsEscapeClosed(false);
  }

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setIsProductsDropdownOpen(false);
        setIsEscapeClosed(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setIsEscapeClosed(true);
      setIsProductsDropdownOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsEscapeClosed(false);
      setIsProductsDropdownOpen(true);
      setTimeout(() => {
        const firstLink = dropdownContainerRef.current?.querySelector<HTMLAnchorElement>(
          'div[role="menu"] a'
        );
        firstLink?.focus();
      }, 50);
    } else if (e.key === 'Enter') {
      if (!isProductsDropdownOpen) {
        e.preventDefault();
        setIsEscapeClosed(false);
        setIsProductsDropdownOpen(true);
      }
    }
  };

  const handleTriggerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const pointerEvent = e.nativeEvent as PointerEvent;
    if (pointerEvent.pointerType === 'touch' || pointerEvent.pointerType === 'pen') {
      if (!isProductsDropdownOpen) {
        e.preventDefault();
        setIsEscapeClosed(false);
        setIsProductsDropdownOpen(true);
        return;
      }
    }
    setIsProductsDropdownOpen(false);
  };

  const getDropdownLinkClass = (isActive: boolean) =>
    isActive
      ? 'px-3 py-2 rounded-lg bg-[var(--color-sand-300)]/60 text-[var(--color-carbon-950)] text-xs font-semibold active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale border-l-2 border-[var(--color-terracotta-500)]'
      : 'px-3 py-2 rounded-lg hover:bg-[var(--color-sand-300)]/40 text-xs font-medium text-[var(--color-carbon-800)] hover:text-[var(--color-carbon-950)] active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale';

  const renderTopNavLink = (href: string, label: string, isActive: boolean) => (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="relative group/nav py-2 text-sm transition-colors duration-150 min-h-[44px] flex items-center active:scale-[1.02] press-scale motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] rounded-md px-1"
    >
      <span
        className={`transition-colors duration-150 ${
          isActive
            ? 'text-[var(--color-carbon-950)] font-semibold'
            : 'text-[var(--color-carbon-700)] group-hover/nav:text-[var(--color-carbon-950)] font-medium'
        }`}
      >
        {label}
      </span>
      <span
        className={`absolute bottom-2 left-1 right-1 h-[2px] rounded-full bg-[var(--color-terracotta-500)] transition-all duration-200 ease-out motion-reduce:transition-none ${
          isActive
            ? 'opacity-100 scale-x-100'
            : 'opacity-0 scale-x-0 group-hover/nav:opacity-75 group-hover/nav:scale-x-100'
        }`}
        aria-hidden="true"
      />
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        isScrolled
          ? 'bg-[var(--color-warm-ivory-200)]/98 backdrop-blur-md border-b border-[var(--color-sand-300)] shadow-[0_4px_20px_-4px_rgba(26,27,23,0.06)]'
          : 'bg-[var(--color-warm-ivory-200)]/90 backdrop-blur-sm border-b border-[var(--color-sand-300)]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] rounded-lg py-1 active:scale-[1.02] transition-transform duration-150 ease-out motion-reduce:transform-none press-scale"
            aria-label={`${dict.nav.brandName} - ${dict.nav.home}`}
          >
            <Image
              src="/images/logo/diamond-fibre-logo.webp"
              alt="Diamond Fibre - The Comfort Revolution"
              width={217}
              height={72}
              priority
              className="w-[130px] min-[360px]:w-[145px] sm:w-[200px] h-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm">
          {renderTopNavLink(`/${locale}`, dict.nav.home, isHomeActive)}

          {/* Direct Category Links with Dropdown */}
          <div
            ref={dropdownContainerRef}
            className="relative group group/nav"
            onMouseEnter={() => {
              setIsEscapeClosed(false);
              setIsProductsDropdownOpen(true);
            }}
            onMouseLeave={() => {
              setIsProductsDropdownOpen(false);
            }}
            onKeyDown={handleContainerKeyDown}
          >
            <Link
              ref={triggerRef}
              href={`/${locale}/products`}
              aria-current={isProductsActive ? 'page' : undefined}
              aria-haspopup="true"
              aria-expanded={isProductsDropdownOpen}
              onFocus={() => setIsEscapeClosed(false)}
              onClick={handleTriggerClick}
              onKeyDown={handleTriggerKeyDown}
              className="relative group py-2 text-sm transition-colors duration-150 min-h-[44px] flex items-center gap-1.5 active:scale-[1.02] press-scale motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] rounded-md px-1"
            >
              <span
                className={`transition-colors duration-150 ${
                  isProductsActive
                    ? 'text-[var(--color-carbon-950)] font-semibold'
                    : 'text-[var(--color-carbon-700)] group-hover/nav:text-[var(--color-carbon-950)] font-medium'
                }`}
              >
                {dict.nav.products}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[var(--color-carbon-500)] group-hover:text-[var(--color-carbon-900)] group-hover:rotate-180 group-focus-within:rotate-180 transition-transform duration-200 ease-out ${
                  isProductsDropdownOpen && !isEscapeClosed
                    ? 'rotate-180 text-[var(--color-carbon-900)]'
                    : ''
                }`}
              />
              <span
                className={`absolute bottom-2 left-1 right-1 h-[2px] rounded-full bg-[var(--color-terracotta-500)] transition-all duration-200 ease-out motion-reduce:transition-none ${
                  isProductsActive
                    ? 'opacity-100 scale-x-100'
                    : 'opacity-0 scale-x-0 group-hover/nav:opacity-75 group-hover/nav:scale-x-100'
                }`}
                aria-hidden="true"
              />
            </Link>
            {/* Dropdown Menu */}
            <div
              role="menu"
              aria-label={locale === 'hi' ? 'उत्पाद श्रेणियां' : 'Product Categories'}
              className={`absolute top-full left-0 opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-xl p-1.5 shadow-[0_10px_25px_-5px_rgba(26,27,23,0.08)] min-w-[210px] z-50 transition-all duration-150 ease-out motion-reduce:transition-none ${
                isProductsDropdownOpen && !isEscapeClosed
                  ? '!opacity-100 !pointer-events-auto !translate-y-0'
                  : isEscapeClosed
                  ? '!opacity-0 !pointer-events-none'
                  : ''
              }`}
            >
              <Link
                href={`/${locale}/products`}
                role="menuitem"
                aria-current={isProductsOverviewActive ? 'page' : undefined}
                className={getDropdownLinkClass(isProductsOverviewActive)}
                onClick={() => setIsProductsDropdownOpen(false)}
              >
                {locale === 'hi' ? 'सभी उत्पाद (ओवरव्यू)' : 'All Products Overview'}
              </Link>
              <div
                className="my-1 border-t border-[var(--color-sand-300)]/60"
                role="separator"
                aria-hidden="true"
              />
              <Link
                href={`/${locale}/products/mattresses`}
                role="menuitem"
                aria-current={isMattressesActive ? 'page' : undefined}
                className={getDropdownLinkClass(isMattressesActive)}
                onClick={() => setIsProductsDropdownOpen(false)}
              >
                {dict.footer.mattressesGaddas}
              </Link>
              <Link
                href={`/${locale}/products/pillows`}
                role="menuitem"
                aria-current={isPillowsActive ? 'page' : undefined}
                className={getDropdownLinkClass(isPillowsActive)}
                onClick={() => setIsProductsDropdownOpen(false)}
              >
                {dict.nav.pillows}
              </Link>
              <Link
                href={`/${locale}/products/razais`}
                role="menuitem"
                aria-current={isRazaisActive ? 'page' : undefined}
                className={getDropdownLinkClass(isRazaisActive)}
                onClick={() => setIsProductsDropdownOpen(false)}
              >
                {dict.nav.razais}
              </Link>
              <Link
                href={`/${locale}/products/blankets`}
                role="menuitem"
                aria-current={isBlanketsActive ? 'page' : undefined}
                className={getDropdownLinkClass(isBlanketsActive)}
                onClick={() => setIsProductsDropdownOpen(false)}
              >
                {dict.nav.blankets}
              </Link>
            </div>
          </div>

          {renderTopNavLink(`/${locale}/wholesale`, dict.nav.wholesale, isWholesaleActive)}
          {renderTopNavLink(`/${locale}/our-story`, dict.nav.ourStory, isOurStoryActive)}
          {renderTopNavLink(`/${locale}/contact`, dict.nav.contact, isContactActive)}
        </nav>

        {/* Right Section: Language Switcher, Desktop WhatsApp, Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            aria-label={
              locale === 'hi'
                ? 'डायमंड फाइबर व्हाट्सएप चैट'
                : 'Chat with Diamond Fibre on WhatsApp'
            }
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg bg-[#25A765] hover:bg-[#208C56] text-white border border-[#208C56] text-xs font-semibold tracking-wide transition-all duration-150 ease-out active:scale-[1.02] motion-reduce:transform-none min-h-[40px] sm:min-h-[38px] min-w-[40px] sm:min-w-0 press-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#208C56] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-warm-ivory-100)] shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden sm:inline text-white">WhatsApp</span>
          </a>

          {/* Mobile Navigation Trigger */}
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
};
