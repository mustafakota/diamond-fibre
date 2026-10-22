import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { CATEGORIES_DATA } from '@/content/catalog';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight, Shield, PackageCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.pillows;

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'products/pillows',
    title:
      locale === 'hi'
        ? 'आरामदायक तकिए | डायमंड फाइबर रतलाम'
        : 'Bedding Pillows (Everyday Support) | Diamond Fibre Ratlam',
    description: category.overview[locale],
  });
}

export default async function PillowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.pillows;
  const images = category.representativeImages;

  const img0 = images[0];
  const img1 = images[1];
  const img2 = images[2];
  const img3 = images[3];
  const img4 = images[4];

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
      {/* 1. Intimate & Soft Hero Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <FadeIn direction="up">
            <div className="flex items-center gap-2">
              <Badge variant="accent">
                {category.shortTag[locale]}
              </Badge>
              <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-carbon-500)]">
                {locale === 'hi' ? 'दैनिक आराम' : 'Intimate Support'}
              </span>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight leading-[1.15]">
              {category.name[locale]}
            </h1>
            <p className="text-base sm:text-lg font-medium text-[var(--color-terracotta-600)] mt-2">
              {category.tagline[locale]}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
              {category.overview[locale]}
            </p>
          </FadeIn>

          {/* Intimate Sleep & Hygiene Highlights */}
          <FadeIn direction="up" delay={0.3}>
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--color-sand-300)]">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'सुरक्षित सील पैकिंग' : 'Dust-Sealed Pack'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'स्वच्छ व तैयार' : 'Hygienic protective sleeve'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <PackageCheck className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'सिंगल व 4-पैक बंडल' : 'Single & 4-Packs'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'खुदरा व थोक दोनों' : 'Retail & bulk options'}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={buildWhatsAppLink(category.whatsappPrefill[locale])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] font-bold text-sm px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Enquire on WhatsApp'}</span>
              </a>
              <Link
                href={`/${locale}/wholesale`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-carbon-700)] hover:text-[var(--color-terracotta-600)] transition-colors py-2"
              >
                <span>{locale === 'hi' ? 'दुकानदार बंडल सप्लाई' : 'Stockist / 4-Pack Bundles'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Intimate Hero Presentation: Soft Retail Sleeve + Botanical Pair */}
        <div className="lg:col-span-6 relative">
          <FadeIn direction="left" duration={0.8}>
            <div className="relative rounded-3xl overflow-hidden bg-[var(--color-sand-200)] shadow-xl aspect-4/3 sm:aspect-5/4">
              {img0 && (
                <>
                  <Image
                    src={img0.src}
                    alt={img0.alt[locale]}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-carbon-950)]/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block text-[11px] uppercase tracking-wider font-mono bg-[var(--color-carbon-950)]/70 backdrop-blur-md px-2.5 py-1 rounded-md mb-1">
                      {locale === 'hi' ? 'सुरक्षात्मक स्लीव' : 'Individual Retail Sleeve'}
                    </span>
                    {img0.caption && (
                      <p className="text-xs text-white/90 line-clamp-1">
                        {img0.caption[locale]}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Overlapping Detail: Botanical Wrapped Silhouette */}
            {img3 && (
              <div className="hidden sm:flex absolute -bottom-6 -left-6 max-w-xs items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[var(--color-sand-300)] shadow-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[var(--color-sand-200)]">
                  <Image
                    src={img3.src}
                    alt={img3.alt[locale]}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[var(--color-terracotta-700)] uppercase tracking-wide">
                    {locale === 'hi' ? 'धूल से सुरक्षित' : 'Dust Protection'}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'सील पैकेजिंग' : 'Sealed Zipper Wrap'}
                  </span>
                  <span className="text-[10px] text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'घर व खुदरा के लिए' : 'Ready for shelf or bed'}
                  </span>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 2. Dual Presentation: Retail Freshness vs Commercial 4-Pack Bundles */}
      <section className="bg-[var(--color-warm-ivory-100)] rounded-3xl p-6 sm:p-10 border border-[var(--color-sand-300)] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'पैकेजिंग व बंडल विकल्प' : 'Packaging & Supply Formats'}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'खुदरा सिंगल पैक और कमर्शियल 4-पैक बंडल' : 'Retail Sleeves & Commercial 4-Packs'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-2 leading-relaxed">
              {locale === 'hi'
                ? 'हमारे तकिए व्यक्तिगत खुदरा बिक्री के लिए सील स्लीव में और दुकानदारों व होटल/धर्मशाला आपूर्ति के लिए 4-पैक स्ट्रैप बंडल में उपलब्ध हैं।'
                : 'Diamond Fibre pillows are supplied either as sealed single units for retail shelves or strapped into compact 4-pillow bundles for commercial traders and stockists.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>{locale === 'hi' ? 'प्रामाणिक फैक्ट्री पैकेजिंग' : 'Authentic Packaged Assets'}</span>
          </div>
        </div>

        {/* 2-Column Split: Retail Individual vs Commercial Bulk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Format 1: Retail Single */}
          {img2 && (
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-700)]">
                  {locale === 'hi' ? 'प्रारूप 01: खुदरा सिंगल स्लीव' : 'Format 01: Retail Protective Sleeve'}
                </span>
                <Sparkles className="w-4 h-4 text-[var(--color-terracotta-600)]" />
              </div>
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={img2.src}
                  alt={img2.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {img2.caption && (
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {img2.caption[locale]}
                </p>
              )}
            </div>
          )}

          {/* Format 2: Commercial 4-Pack Bundle */}
          {img4 && (
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-700)]">
                  {locale === 'hi' ? 'प्रारूप 02: कमर्शियल 4-पैक बंडल' : 'Format 02: Strapped 4-Pack Bundle'}
                </span>
                <PackageCheck className="w-4 h-4 text-[var(--color-terracotta-600)]" />
              </div>
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={img4.src}
                  alt={img4.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {img4.caption && (
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {img4.caption[locale]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Additional Commercial Stockist Pack */}
        {img1 && (
          <div className="p-4 rounded-2xl bg-white/60 border border-[var(--color-sand-300)] flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[var(--color-sand-200)]">
              <Image
                src={img1.src}
                alt={img1.alt[locale]}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                {locale === 'hi' ? 'थोक वितरक बंडल' : 'Wholesale Distributor Bundles'}
              </span>
              {img1.caption && (
                <p className="text-xs text-[var(--color-carbon-600)] mt-0.5">
                  {img1.caption[locale]}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3. Seasonal Notice Alert */}
      <SeasonalNotice locale={locale} />

      {/* 4. Production & Specifications Note */}
      <section className="p-6 rounded-2xl bg-white border border-[var(--color-sand-300)] flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
          {locale === 'hi' ? 'उत्पादन विवरण' : 'Production Parameters'}
        </span>
        <h3 className="font-display font-bold text-lg text-[var(--color-carbon-900)]">
          {locale === 'hi' ? 'साइज, कवर व भराई की पुष्टि' : 'Filling Options & Dimensions'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
          {category.dimensionAvailabilityNote?.[locale] ?? ''}
        </p>
      </section>

      {/* 5. Editorial Enquiry / Wholesale Conversion Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[var(--color-carbon-900)] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-400)] font-semibold">
            {locale === 'hi' ? 'सीधा संपर्क' : 'Direct Factory Desk'}
          </span>
          <h3 className="font-display font-bold text-2xl sm:text-3xl">
            {locale === 'hi'
              ? 'तकियों के विकल्प, पैक व कीमतों के लिए पूछें'
              : 'Enquire About Pillow Options & Pack Counts'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-300)] leading-relaxed">
            {locale === 'hi'
              ? 'रिटेल स्लीव या 4-पैक कमर्शियल बंडल की वर्तमान उपलब्धता और दरों के लिए संपर्क करें।'
              : 'Inquire for current batch prints, single-sleeve retail stock, or 4-pack commercial bundles.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
          <a
            href={buildWhatsAppLink(category.whatsappPrefill[locale])}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] font-bold text-sm px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all min-h-[48px]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Enquire on WhatsApp'}</span>
          </a>
          <Link
            href={`/${locale}/wholesale`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/20 min-h-[48px]"
          >
            <span>{locale === 'hi' ? 'थोक व रीसेलर्स' : 'Wholesale & Resellers'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
