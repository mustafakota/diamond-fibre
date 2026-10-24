import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import {
  DEFAULT_DISPLAY_PHONE,
  BUSINESS_EMAIL,
  GOOGLE_MAPS_LISTING_URL,
  INSTAGRAM_PROFILE_URL,
  buildPhoneLink,
  buildWhatsAppLink,
} from '@/lib/whatsapp';
import {
  createLucideIcon,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { DynamicYear } from './DynamicYear';
import { BackToTopLink } from './BackToTopLink';

// Instagram icon using Lucide React's official icon creator
const Instagram = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: 'ig-rect' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: 'ig-path' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'ig-line' }],
]);

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const dict = getDictionary(locale);

  return (
    <footer
      className="bg-[var(--color-carbon-900)] text-[var(--color-warm-ivory-100)] border-t border-[var(--color-carbon-800)] pt-14 pb-24 md:pb-14 transition-colors"
      aria-label={locale === 'hi' ? 'वेबसाइट फुटर' : 'Website footer'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid: Brand (4), Products (2), Company (2), Contact (4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[var(--color-carbon-800)]/90">

          {/* Column 1: Brand Introduction & Provenance (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href={`/${locale}`}
              className="inline-block bg-[#FCF8F0] px-4 py-3 rounded-2xl shadow-xs w-fit border border-[var(--color-sand-300)]/60 hover:border-[var(--color-sand-400)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all group focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
              aria-label={`${dict.nav.brandName} - ${dict.nav.home}`}
            >
              <Image
                src="/images/logo/diamond-fibre-logo.webp"
                alt="Diamond Fibre - The Comfort Revolution"
                width={217}
                height={72}
                className="w-[176px] sm:w-[196px] h-auto object-contain group-hover:scale-[1.01] transition-transform"
              />
            </Link>

            <p className="text-xs sm:text-[13px] text-[var(--color-sand-300)]/85 leading-relaxed max-w-sm">
              {dict.footer.brandDescription}
            </p>

            <div className="pt-1">
              <a
                href={GOOGLE_MAPS_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-[13px] text-[var(--color-warm-ivory-100)]/90 hover:text-[var(--color-terracotta-500)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-colors w-fit group/map py-1"
                aria-label={
                  locale === 'hi'
                    ? 'गूगल मैप्स पर डायमंड फाइबर का स्थान देखें'
                    : 'View Diamond Fibre location on Google Maps'
                }
              >
                <MapPin className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0 group-hover/map:scale-110 transition-transform" />
                <span className="font-medium underline decoration-[var(--color-carbon-600)] underline-offset-4 group-hover/map:decoration-[var(--color-terracotta-500)]">
                  {dict.footer.locationLabel}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-sand-300)]/50 group-hover/map:text-[var(--color-terracotta-500)] transition-colors shrink-0" />
              </a>
            </div>
          </div>

          {/* Column 2: Product Navigation (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-ivory-100)] font-display">
              {dict.footer.productsHeading}
            </h3>
            <nav aria-label={locale === 'hi' ? 'उत्पाद श्रेणियां' : 'Product categories'}>
              <ul className="flex flex-col gap-1 text-xs sm:text-[13px] text-[var(--color-sand-300)]/85">
                <li>
                  <Link
                    href={`/${locale}/products/mattresses`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.footer.mattressesGaddas}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products/pillows`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.pillows}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products/razais`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.razais}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products/blankets`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.blankets}
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    href={`/${locale}/products`}
                    className="py-1 min-h-[36px] inline-flex items-center gap-1 text-[var(--color-terracotta-500)] hover:text-white active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all group/all"
                  >
                    <span>{dict.footer.allCollections}</span>
                    <ArrowRight className="w-3 h-3 group-hover/all:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Company Navigation (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-ivory-100)] font-display">
              {dict.footer.companyHeading}
            </h3>
            <nav aria-label={locale === 'hi' ? 'कंपनी लिंक' : 'Company links'}>
              <ul className="flex flex-col gap-1 text-xs sm:text-[13px] text-[var(--color-sand-300)]/85">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.home}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.products}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/wholesale`}
                    className="py-1.5 min-h-[40px] inline-flex items-center text-[var(--color-terracotta-500)] font-medium hover:text-[var(--color-terracotta-500)] hover:brightness-110 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.wholesale}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/our-story`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.ourStory}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact`}
                    className="py-1.5 min-h-[40px] inline-flex items-center hover:text-white hover:translate-x-0.5 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all"
                  >
                    {dict.nav.contact}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Contact & Enquiries (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-ivory-100)] font-display">
              {dict.footer.contactHeading}
            </h3>

            <p className="text-xs text-[var(--color-sand-300)]/75 leading-relaxed">
              {dict.contact.serviceabilityNotice}
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {/* Phone Action */}
              <a
                href={buildPhoneLink()}
                className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-[var(--color-warm-ivory-100)] hover:text-[var(--color-terracotta-500)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-colors min-h-[42px] group/contact"
                aria-label={`${dict.footer.phoneLabel}: ${DEFAULT_DISPLAY_PHONE}`}
              >
                <span className="w-7 h-7 rounded-full bg-[var(--color-carbon-800)] border border-[var(--color-carbon-600)]/40 flex items-center justify-center shrink-0 group-hover/contact:border-[var(--color-terracotta-500)]/60 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
                </span>
                <span className="font-medium tracking-wide">{DEFAULT_DISPLAY_PHONE}</span>
              </a>

              {/* Email Inquiries with break-all to ensure mobile responsiveness */}
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-[var(--color-warm-ivory-100)] hover:text-[var(--color-terracotta-500)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-colors min-h-[42px] group/contact break-all"
                aria-label={`${dict.footer.emailLabel}: ${BUSINESS_EMAIL}`}
              >
                <span className="w-7 h-7 rounded-full bg-[var(--color-carbon-800)] border border-[var(--color-carbon-600)]/40 flex items-center justify-center shrink-0 group-hover/contact:border-[var(--color-terracotta-500)]/60 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
                </span>
                <span className="font-medium break-all">{BUSINESS_EMAIL}</span>
              </a>

              {/* Official Instagram Profile */}
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-[var(--color-warm-ivory-100)] hover:text-[var(--color-terracotta-500)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-colors min-h-[42px] group/contact focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)] rounded-md"
                aria-label="Instagram: @diamondfibres"
              >
                <span className="w-7 h-7 rounded-full bg-[var(--color-carbon-800)] border border-[var(--color-carbon-600)]/40 flex items-center justify-center shrink-0 group-hover/contact:border-[var(--color-terracotta-500)]/60 transition-colors">
                  <Instagram className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
                </span>
                <span className="font-medium tracking-wide">Instagram (@diamondfibres)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-sand-300)]/50 group-hover/contact:text-[var(--color-terracotta-500)] transition-colors shrink-0" />
              </a>

              {/* WhatsApp Sales Desk Action */}
              <div className="pt-1">
                <a
                  href={buildWhatsAppLink(
                    locale === 'hi'
                      ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों के बारे में पूछताछ करना चाहता हूँ।'
                      : 'Hello Diamond Fibre, I would like to enquire about your bedding products.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 px-3.5 py-2.5 rounded-xl active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all w-fit min-h-[42px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
                  aria-label={dict.footer.whatsappAction}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{dict.footer.whatsappAction}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Restrained Copyright, Provenance & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[var(--color-sand-300)]/65 gap-3 text-center sm:text-left">
          <p>
            © <DynamicYear /> {dict.nav.brandName}. {dict.footer.rightsReserved}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2">
            <p className="text-[var(--color-sand-300)]/55">
              {dict.footer.provenance}
            </p>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--color-sand-300)]/30" aria-hidden="true" />
            <BackToTopLink locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
};
