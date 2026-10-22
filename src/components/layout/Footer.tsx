import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { PROVISIONAL_DISPLAY_PHONE, buildPhoneLink, buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, Phone, MapPin, ExternalLink } from 'lucide-react';

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-[var(--color-carbon-900)] text-[var(--color-warm-ivory-100)] border-t border-[var(--color-carbon-800)] pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[var(--color-carbon-800)]">
          {/* Col 1: Brand & Heritage */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link
              href={`/${locale}`}
              className="inline-block bg-[#FCF8F0] px-4 py-3 rounded-2xl shadow-xs w-fit border border-[var(--color-sand-300)]/60 hover:border-[var(--color-sand-400)] transition-all group"
              aria-label={`${dict.nav.brandName} - ${dict.nav.home}`}
            >
              <Image
                src="/images/logo/diamond-fibre-logo.webp"
                alt="Diamond Fibre - The Comfort Revolution"
                width={217}
                height={72}
                className="w-[180px] sm:w-[200px] h-auto object-contain group-hover:scale-[1.01] transition-transform"
              />
            </Link>
            <p className="text-xs text-[var(--color-sand-300)]/80 leading-relaxed">
              {dict.footer.disclaimer}
            </p>
            <a
              href="https://maps.google.com/?cid=9316049051871516981"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-sand-300)]/80 hover:text-[var(--color-terracotta-400)] transition-colors pt-2 group/map"
              aria-label={locale === 'hi' ? 'गूगल मैप्स पर डायमंड फाइबर्स देखें' : 'View Diamond Fibres on Google Maps'}
            >
              <MapPin className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0 group-hover/map:scale-110 transition-transform" />
              <span>Ratlam, Madhya Pradesh, India</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover/map:opacity-100" />
            </a>
          </div>

          {/* Col 2: The 4 Product Categories */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-terracotta-500)]">
              {dict.nav.products}
            </span>
            <ul className="flex flex-col gap-1 text-xs text-[var(--color-sand-300)]/90">
              <li>
                <Link href={`/${locale}/products/mattresses`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.mattresses}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/pillows`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.pillows}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/razais`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.razais}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/blankets`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.blankets}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & B2B */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-terracotta-500)]">
              {dict.nav.brandName}
            </span>
            <ul className="flex flex-col gap-1 text-xs text-[var(--color-sand-300)]/90">
              <li>
                <Link href={`/${locale}`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/wholesale`}
                  className="py-1.5 inline-flex items-center text-[var(--color-terracotta-500)] font-semibold hover:text-white transition-colors"
                >
                  {dict.nav.wholesale}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/our-story`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.ourStory}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="py-1.5 inline-flex items-center hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Provisional Contact & Feasibility */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-terracotta-500)]">
              {dict.contact.title}
            </span>
            <p className="text-xs text-[var(--color-sand-300)]/80 leading-relaxed">
              {dict.contact.serviceabilityNotice}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={buildPhoneLink()}
                className="flex items-center gap-2 text-xs text-white hover:text-[var(--color-terracotta-500)] transition-colors min-h-[36px]"
              >
                <Phone className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                <span>{PROVISIONAL_DISPLAY_PHONE} (Provisional)</span>
              </a>
              <a
                href={buildWhatsAppLink(
                  locale === 'hi'
                    ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों के बारे में पूछताछ करना चाहता हूँ।'
                    : 'Hello Diamond Fibre, I would like to enquire about your bedding products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#25D366] hover:text-[#1EBE5D] transition-colors min-h-[36px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Sales Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--color-sand-300)]/60 gap-4">
          <p>{dict.footer.copyright}</p>
          <p className="text-center sm:text-right">
            Ratlam, Madhya Pradesh • Family-Run Bedding Manufacturing Unit (Est. 2018)
          </p>
        </div>
      </div>
    </footer>
  );
};
