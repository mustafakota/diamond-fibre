import React from 'react';
import Link from 'next/link';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { privacyPolicyContent } from '@/content/privacy-policy';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import {
  DEFAULT_DISPLAY_PHONE,
  BUSINESS_EMAIL,
  GOOGLE_MAPS_LISTING_URL,
  buildPhoneLink,
  buildWhatsAppLink,
} from '@/lib/whatsapp';
import {
  ShieldCheck,
  Database,
  MessageCircle,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Calendar,
  Scale,
  Building2,
  Info,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'privacy-policy',
    title:
      locale === 'hi'
        ? 'गोपनीयता नीति | डायमंड फाइबर रतलाम (म.प्र.)'
        : 'Privacy Policy | Diamond Fibre Bedding Manufacturer Ratlam',
    description:
      locale === 'hi'
        ? 'डायमंड फाइबर की गोपनीयता नीति: वेबसाइट पूछताछ, थोक इन्क्वायरी, व्हाट्सएप संचार, कुकीज़ और भारतीय डेटा सुरक्षा नियमों के तहत आगंतुक जानकारी के प्रबंधन का विवरण।'
        : "Diamond Fibre's Privacy Policy explains how we collect, use, and protect visitor information, wholesale enquiries, WhatsApp communications, and cookies in accordance with applicable Indian privacy laws.",
    ogImage: {
      url: '/images/og-preview.jpg',
      alt:
        locale === 'hi'
          ? 'डायमंड फाइबर गोपनीयता नीति — रतलाम, मध्य प्रदेश'
          : 'Diamond Fibre Privacy Policy — Ratlam, Madhya Pradesh',
    },
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const content = privacyPolicyContent[locale];
  const baseUrl = getBaseUrl();

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd(baseUrl, locale, [
    {
      name: locale === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy',
      pathSegment: 'privacy-policy',
    },
  ]);

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.title,
    description: content.subtitle,
    url: `${baseUrl}/${locale}/privacy-policy`,
    inLanguage: locale === 'hi' ? 'hi-IN' : 'en-IN',
    dateModified: '2026-10-25',
    publisher: {
      '@type': 'Organization',
      name: 'Diamond Fibre',
      url: baseUrl,
      telephone: '+91 7974644185',
      email: BUSINESS_EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ratlam',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
  };

  const highlightIcons = {
    database: Database,
    message: MessageCircle,
    shield: ShieldCheck,
    userCheck: UserCheck,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10 sm:gap-12">
        {/* =========================================================================
            1. PAGE HEADER & METADATA CHIPS
            ========================================================================= */}
        <FadeIn direction="up">
          <header className="flex flex-col gap-4 border-b border-[var(--color-sand-300)] pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" className="self-start">
                {content.badge}
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)]">
                {locale === 'hi' ? 'पारदर्शी व्यापारिक नीतियां' : 'Transparent Business Practices'}
              </span>
            </div>

            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight text-balance">
              {content.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[var(--color-carbon-600)] leading-relaxed">
              {content.subtitle}
            </p>

            {/* Factual Metadata Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] text-xs text-[var(--color-carbon-700)]">
                <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-mono text-[var(--color-carbon-500)]">
                    {content.lastUpdatedLabel}
                  </span>
                  <span className="font-semibold text-[var(--color-carbon-900)]">
                    {content.lastUpdatedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] text-xs text-[var(--color-carbon-700)]">
                <Scale className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-mono text-[var(--color-carbon-500)]">
                    {content.jurisdictionLabel}
                  </span>
                  <span className="font-semibold text-[var(--color-carbon-900)] truncate">
                    {locale === 'hi' ? 'भारत (IT Act व DPDP Act)' : 'India (IT & DPDP Acts)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] text-xs text-[var(--color-carbon-700)]">
                <Building2 className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-mono text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'विनिर्माण इकाई' : 'Manufacturing Unit'}
                  </span>
                  <span className="font-semibold text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'रतलाम, मध्य प्रदेश' : 'Ratlam, MP, India'}
                  </span>
                </div>
              </div>
            </div>
          </header>
        </FadeIn>

        {/* =========================================================================
            2. EXECUTIVE HIGHLIGHTS / QUICK SUMMARY CARDS
            ========================================================================= */}
        <FadeIn direction="up" delay={0.1}>
          <section className="flex flex-col gap-4" aria-labelledby="highlights-heading">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
                {locale === 'hi' ? 'संक्षिप्त सारांश' : 'Executive Summary'}
              </span>
              <h2 id="highlights-heading" className="font-display font-semibold text-2xl text-[var(--color-carbon-900)] mt-0.5">
                {content.highlightsHeading}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-1">
                {content.highlightsSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.highlights.map((item, idx) => {
                const IconComponent = highlightIcons[item.icon];
                return (
                  <Card key={idx} className="p-5 flex flex-col gap-3 justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display font-semibold text-sm sm:text-base text-[var(--color-carbon-900)]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* =========================================================================
            3. TABLE OF CONTENTS QUICK NAV
            ========================================================================= */}
        <FadeIn direction="up" delay={0.15}>
          <nav
            aria-label={locale === 'hi' ? 'गोपनीयता नीति अनुभाग सूची' : 'Privacy policy table of contents'}
            className="p-5 sm:p-6 rounded-2xl bg-[var(--color-sand-300)]/25 border border-[var(--color-sand-300)] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-carbon-900)]">
                {locale === 'hi' ? 'नीति अनुभाग (Sections)' : 'Policy Navigation'}
              </span>
              <span className="text-[11px] text-[var(--color-carbon-500)] font-mono">
                10 {locale === 'hi' ? 'भाग' : 'Clauses'}
              </span>
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-carbon-700)]">
              {content.sections.map((sec, i) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="inline-flex items-center gap-2 py-1 hover:text-[var(--color-terracotta-600)] hover:underline active:scale-[1.01] transition-transform"
                  >
                    <span className="font-mono text-[10px] text-[var(--color-terracotta-600)] shrink-0">
                      {(i + 1).toString().padStart(2, '0')}.
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </FadeIn>

        {/* =========================================================================
            4. DETAILED POLICY CLAUSES (SECTIONS 1 TO 9)
            ========================================================================= */}
        <div className="flex flex-col gap-12 sm:gap-14">
          {content.sections.slice(0, 9).map((sec, idx) => (
            <FadeIn key={sec.id} direction="up" delay={0.05 * (idx % 3)}>
              <section
                id={sec.id}
                aria-labelledby={`heading-${sec.id}`}
                className="scroll-mt-24 flex flex-col gap-4 border-b border-[var(--color-sand-300)] pb-10"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--color-terracotta-600)]">
                    {sec.badge}
                  </span>
                  <h2
                    id={`heading-${sec.id}`}
                    className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)] tracking-tight"
                  >
                    {sec.title}
                  </h2>
                </div>

                {/* Paragraphs */}
                <div className="flex flex-col gap-3 text-sm sm:text-base text-[var(--color-carbon-800)] leading-relaxed">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Primary List Items */}
                {sec.listItems && sec.listItems.length > 0 && (
                  <ul className="flex flex-col gap-2.5 pl-1 my-1">
                    {sec.listItems.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-carbon-800)] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-500)] mt-2 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subsections if present */}
                {sec.subsections && sec.subsections.length > 0 && (
                  <div className="flex flex-col gap-5 pt-3">
                    {sec.subsections.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-5 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-2.5"
                      >
                        <h3 className="font-display font-semibold text-base sm:text-lg text-[var(--color-carbon-900)]">
                          {sub.title}
                        </h3>

                        {sub.paragraphs && sub.paragraphs.length > 0 && (
                          <div className="flex flex-col gap-2 text-xs sm:text-sm text-[var(--color-carbon-700)] leading-relaxed">
                            {sub.paragraphs.map((sp, spIdx) => (
                              <p key={spIdx}>{sp}</p>
                            ))}
                          </div>
                        )}

                        {sub.listItems && sub.listItems.length > 0 && (
                          <ul className="flex flex-col gap-2 pl-1 pt-1">
                            {sub.listItems.map((sli, sliIdx) => (
                              <li key={sliIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-carbon-800)] leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-carbon-500)] mt-2 shrink-0" aria-hidden="true" />
                                <span>{sli}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Callout Box if present */}
                {sec.callout && (
                  <div className="p-5 rounded-2xl bg-[var(--color-sand-300)]/30 border-l-4 border-l-[var(--color-terracotta-500)] border-y border-r border-[var(--color-sand-400)]/50 flex items-start gap-3 my-2">
                    <Info className="w-5 h-5 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-carbon-900)] font-display">
                        {sec.callout.title}
                      </span>
                      <p className="text-xs sm:text-sm text-[var(--color-carbon-800)] leading-relaxed">
                        {sec.callout.text}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </FadeIn>
          ))}

          {/* =========================================================================
              5. SECTION 10: VERIFIED CONTACT & GRIEVANCE REDRESSAL DESK
              ========================================================================= */}
          <FadeIn direction="up">
            <section
              id="contact-and-grievance"
              aria-labelledby="heading-contact-and-grievance"
              className="scroll-mt-24 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--color-terracotta-600)]">
                  {content.sections[9]?.badge || 'Section 10'}
                </span>
                <h2
                  id="heading-contact-and-grievance"
                  className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)] tracking-tight"
                >
                  {content.sections[9]?.title || 'Verified Contact Information & Grievance Redressal'}
                </h2>
                {content.sections[9]?.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm sm:text-base text-[var(--color-carbon-800)] leading-relaxed mt-1">
                    {p}
                  </p>
                ))}
              </div>

              {/* Comprehensive Verified Contact Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] shadow-xs flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-semibold text-xl text-[var(--color-carbon-900)]">
                    {content.contactBox.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-1">
                    {content.contactBox.subheading}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Business Entity & Location */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-warm-ivory-200)] border border-[var(--color-sand-300)]">
                    <Building2 className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-mono font-semibold text-[var(--color-carbon-500)]">
                        {locale === 'hi' ? 'विनिर्माण इकाई' : 'Business Entity'}
                      </span>
                      <span className="font-semibold text-[var(--color-carbon-900)]">
                        {content.contactBox.businessName}
                      </span>
                      <span className="text-xs text-[var(--color-carbon-600)]">
                        {content.contactBox.location}
                      </span>
                      <a
                        href={GOOGLE_MAPS_LISTING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-terracotta-600)] hover:underline pt-1"
                      >
                        <span>{locale === 'hi' ? 'गूगल मैप्स पर देखें' : 'View on Google Maps'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-warm-ivory-200)] border border-[var(--color-sand-300)]">
                    <Phone className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-mono font-semibold text-[var(--color-carbon-500)]">
                        {content.contactBox.phoneLabel}
                      </span>
                      <a
                        href={buildPhoneLink()}
                        className="font-semibold font-mono text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] transition-colors"
                      >
                        {DEFAULT_DISPLAY_PHONE}
                      </a>
                      <span className="text-xs text-[var(--color-carbon-600)]">
                        {content.contactBox.operatingHoursValue}
                      </span>
                      <div className="pt-1">
                        <a
                          href={buildWhatsAppLink(
                            locale === 'hi'
                              ? 'नमस्ते डायमंड फाइबर, मैं आपकी गोपनीयता नीति के संदर्भ में संपर्क कर रहा हूँ।'
                              : 'Hello Diamond Fibre, I am reaching out regarding your Privacy Policy.'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1EBE5D] hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{locale === 'hi' ? 'व्हाट्सएप पर चैट करें' : 'Chat on WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Verified Email */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-warm-ivory-200)] border border-[var(--color-sand-300)]">
                    <Mail className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-mono font-semibold text-[var(--color-carbon-500)]">
                        {content.contactBox.emailLabel}
                      </span>
                      <a
                        href={`mailto:${BUSINESS_EMAIL}`}
                        className="font-medium text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] transition-colors break-all"
                      >
                        {BUSINESS_EMAIL}
                      </a>
                      <span className="text-[11px] text-[var(--color-carbon-500)]">
                        {locale === 'hi'
                          ? 'गोपनीयता व डेटा सुधार संबंधी ईमेल'
                          : 'Privacy requests & grievance correspondence'}
                      </span>
                    </div>
                  </div>

                  {/* Response Commitment Notice */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-warm-ivory-200)] border border-[var(--color-sand-300)]">
                    <Clock className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-mono font-semibold text-[var(--color-carbon-500)]">
                        {locale === 'hi' ? 'समयबद्ध समाधान' : 'Statutory Resolution'}
                      </span>
                      <p className="text-xs text-[var(--color-carbon-700)] leading-relaxed">
                        {content.contactBox.responseNotice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--color-sand-300)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[var(--color-carbon-500)]">
                    {content.governingLawNotice}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${locale}/contact`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] transition-colors py-2"
                    >
                      <span>{locale === 'hi' ? 'संपर्क पेज देखें' : 'Visit Contact Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </div>

        {/* =========================================================================
            6. BOTTOM NAVIGATION & RETURN LINKS
            ========================================================================= */}
        <FadeIn direction="up">
          <div className="pt-6 border-t border-[var(--color-sand-300)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-carbon-600)]">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 font-medium hover:text-[var(--color-carbon-900)] transition-colors"
            >
              <span>←</span>
              <span>{content.homeLinkLabel}</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/wholesale`}
                className="hover:text-[var(--color-terracotta-600)] transition-colors font-medium"
              >
                {locale === 'hi' ? 'थोक व पुनर्विक्रेता' : 'Wholesale Enquiries'}
              </Link>
              <span className="text-[var(--color-sand-400)]">•</span>
              <a
                href="#top"
                className="hover:text-[var(--color-carbon-900)] transition-colors"
              >
                {content.backToTopLabel} ↑
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
