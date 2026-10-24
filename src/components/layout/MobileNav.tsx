'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, MessageCircle, Phone } from 'lucide-react';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { LanguageSwitcher } from './LanguageSwitcher';
import { buildWhatsAppLink, buildPhoneLink, DEFAULT_DISPLAY_PHONE } from '@/lib/whatsapp';
import { useMounted } from '@/lib/useMounted';
import { isNavActive } from '@/lib/nav';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export interface MobileNavProps {
  locale: Locale;
}

export const MobileNav: React.FC<MobileNavProps> = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFirstRender = React.useRef(true);
  const triggerBtnRef = React.useRef<HTMLButtonElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const mounted = useMounted();
  const shouldReduceMotion = useReducedMotion();
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

  const navigatingRef = React.useRef(false);
  const prevPathname = React.useRef(pathname);

  const getDrawerLinkClass = (isActive: boolean, extra = '') =>
    isActive
      ? `min-h-[44px] flex items-center px-3.5 rounded-lg bg-[var(--color-sand-300)]/50 font-semibold text-[var(--color-carbon-950)] border-l-3 border-[var(--color-terracotta-500)] active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale ${extra}`.trim()
      : `min-h-[44px] flex items-center px-3.5 rounded-lg hover:bg-[var(--color-sand-300)]/40 active:bg-[var(--color-sand-300)]/60 text-[var(--color-carbon-800)] hover:text-[var(--color-carbon-950)] font-medium active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale ${extra}`.trim();

  // Close drawer on pathname change (e.g. browser back/forward or route change)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  // Close drawer if window is resized to desktop breakpoint (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus trap, Escape key, and body scroll lock with scroll restoration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const drawer = document.getElementById('mobile-navigation-drawer');
        if (!drawer) return;
        const focusables = drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const currentScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Prevent layout shifts from scrollbar disappearance
      setTimeout(() => closeBtnRef.current?.focus(), 60);
    } else {
      const topOffset = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (!navigatingRef.current && topOffset) {
        window.scrollTo(0, parseInt(topOffset || '0', 10) * -1);
      }
      navigatingRef.current = false;
      if (!isFirstRender.current) {
        triggerBtnRef.current?.focus();
      }
    }
    isFirstRender.current = false;
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const topOffset = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (!navigatingRef.current && topOffset) {
        window.scrollTo(0, parseInt(topOffset || '0', 10) * -1);
      }
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const handleNavClick = () => {
    navigatingRef.current = true;
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Morphing Hamburger-to-Close Button */}
      <button
        ref={triggerBtnRef}
        type="button"
        onClick={toggleMenu}
        aria-label={
          isOpen
            ? locale === 'hi'
              ? 'नेविगेशन मेनू बंद करें'
              : 'Close navigation menu'
            : locale === 'hi'
            ? 'नेविगेशन मेनू खोलें'
            : 'Open navigation menu'
        }
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        className="lg:hidden min-h-[48px] min-w-[48px] relative flex items-center justify-center rounded-full text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 active:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] transition-all duration-150 ease-out motion-reduce:transform-none cursor-pointer press-scale-icon"
      >
        <div className="relative w-6 h-6 flex items-center justify-center" aria-hidden="true">
          <span
            className={`absolute block h-0.5 w-5 bg-current rounded-full transition-all duration-250 ease-out origin-center ${
              isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
            } motion-reduce:transition-none`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-out ${
              isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            } motion-reduce:transition-none`}
          />
          <span
            className={`absolute block h-0.5 w-5 bg-current rounded-full transition-all duration-250 ease-out origin-center ${
              isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
            } motion-reduce:transition-none`}
          />
        </div>
      </button>

      {/* Backdrop & Drawer rendered into document.body to avoid header backdrop-blur stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-xs"
                onClick={closeMenu}
                aria-hidden="true"
              />

              <motion.div
                key="mobile-nav-drawer"
                id="mobile-navigation-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation"
                initial={shouldReduceMotion ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed top-0 right-0 bottom-0 z-[101] w-[min(85vw,360px)] h-[100dvh] max-h-[100dvh] bg-[var(--color-warm-ivory-100)] border-l border-[var(--color-sand-300)] shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-y-auto pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] [webkit-overflow-scrolling:touch]"
              >
                <div className="flex flex-col gap-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--color-sand-300)]">
                    <Link href={`/${locale}`} onClick={handleNavClick}>
                      <Image
                        src="/images/logo/diamond-fibre-logo.webp"
                        alt="Diamond Fibre - The Comfort Revolution"
                        width={217}
                        height={72}
                        className="w-[135px] sm:w-[155px] h-auto object-contain"
                      />
                    </Link>
                    <button
                      ref={closeBtnRef}
                      type="button"
                      onClick={closeMenu}
                      aria-label={locale === 'hi' ? 'नेविगेशन मेनू बंद करें' : 'Close menu'}
                      className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-[var(--color-sand-300)]/40 active:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] text-[var(--color-carbon-800)] transition-all duration-150 ease-out motion-reduce:transform-none cursor-pointer press-scale-icon"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Language Switcher in Drawer */}
                  <div className="flex items-center justify-between nav-item-enter" style={{ animationDelay: '30ms' }}>
                    <span className="text-xs font-semibold text-[var(--color-carbon-600)] uppercase tracking-wider">
                      Language / भाषा
                    </span>
                    <LanguageSwitcher currentLocale={locale} />
                  </div>

                  {/* Primary Nav Links */}
                  <nav className="flex flex-col gap-1 text-[var(--color-carbon-900)] font-medium">
                    <div className="nav-item-enter" style={{ animationDelay: '60ms' }}>
                      <Link
                        href={`/${locale}`}
                        onClick={handleNavClick}
                        aria-current={isHomeActive ? 'page' : undefined}
                        className={getDrawerLinkClass(isHomeActive)}
                      >
                        {dict.nav.home}
                      </Link>
                    </div>

                    {/* Core Product Categories Section */}
                    <div className="pt-2 pb-1 nav-item-enter" style={{ animationDelay: '90ms' }}>
                      <Link
                        href={`/${locale}/products`}
                        onClick={handleNavClick}
                        aria-current={isProductsActive ? 'page' : undefined}
                        className={getDrawerLinkClass(isProductsActive, 'text-xs uppercase tracking-wider font-semibold')}
                      >
                        {dict.nav.products}
                      </Link>
                    </div>
                    <div className="flex flex-col pl-2 border-l-2 border-[var(--color-sand-300)] gap-1">
                      <div className="nav-item-enter" style={{ animationDelay: '110ms' }}>
                        <Link
                          href={`/${locale}/products/mattresses`}
                          onClick={handleNavClick}
                          aria-current={isMattressesActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isMattressesActive, 'text-sm')}
                        >
                          {dict.nav.mattresses}
                        </Link>
                      </div>
                      <div className="nav-item-enter" style={{ animationDelay: '130ms' }}>
                        <Link
                          href={`/${locale}/products/pillows`}
                          onClick={handleNavClick}
                          aria-current={isPillowsActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isPillowsActive, 'text-sm')}
                        >
                          {dict.nav.pillows}
                        </Link>
                      </div>
                      <div className="nav-item-enter" style={{ animationDelay: '150ms' }}>
                        <Link
                          href={`/${locale}/products/razais`}
                          onClick={handleNavClick}
                          aria-current={isRazaisActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isRazaisActive, 'text-sm')}
                        >
                          {dict.nav.razais}
                        </Link>
                      </div>
                      <div className="nav-item-enter" style={{ animationDelay: '170ms' }}>
                        <Link
                          href={`/${locale}/products/blankets`}
                          onClick={handleNavClick}
                          aria-current={isBlanketsActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isBlanketsActive, 'text-sm')}
                        >
                          {dict.nav.blankets}
                        </Link>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-sand-300)] mt-2 flex flex-col gap-1">
                      <div className="nav-item-enter" style={{ animationDelay: '190ms' }}>
                        <Link
                          href={`/${locale}/wholesale`}
                          onClick={handleNavClick}
                          aria-current={isWholesaleActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isWholesaleActive)}
                        >
                          {dict.nav.wholesale}
                        </Link>
                      </div>
                      <div className="nav-item-enter" style={{ animationDelay: '210ms' }}>
                        <Link
                          href={`/${locale}/our-story`}
                          onClick={handleNavClick}
                          aria-current={isOurStoryActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isOurStoryActive)}
                        >
                          {dict.nav.ourStory}
                        </Link>
                      </div>
                      <div className="nav-item-enter" style={{ animationDelay: '230ms' }}>
                        <Link
                          href={`/${locale}/contact`}
                          onClick={handleNavClick}
                          aria-current={isContactActive ? 'page' : undefined}
                          className={getDrawerLinkClass(isContactActive)}
                        >
                          {dict.nav.contact}
                        </Link>
                      </div>
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
                    aria-label={
                      locale === 'hi'
                        ? 'डायमंड फाइबर व्हाट्सएप चैट'
                        : 'Chat with Diamond Fibre on WhatsApp'
                    }
                    className="min-h-[48px] w-full flex items-center justify-center gap-2.5 bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] rounded-xl font-semibold px-4 py-3 shadow-xs active:scale-[1.02] press-scale transition-all duration-150 ease-out motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
                  >
                    <span className="relative flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                      <span
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#25D366]"
                        aria-hidden="true"
                      />
                    </span>
                    <span>{dict.nav.whatsappQuickAction}</span>
                  </a>

                  <a
                    href={buildPhoneLink()}
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 text-xs font-semibold text-[var(--color-carbon-600)] hover:text-[var(--color-carbon-900)] active:scale-[1.02] transition-all duration-150 ease-out motion-reduce:transform-none press-scale"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{DEFAULT_DISPLAY_PHONE}</span>
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
