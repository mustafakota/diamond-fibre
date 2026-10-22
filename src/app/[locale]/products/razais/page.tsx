import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { CATEGORIES_DATA } from '@/content/catalog';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight, Palette, Sparkles, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.razais;

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'products/razais',
    title:
      locale === 'hi'
        ? 'पारंपरिक रज़ाइयां | डायमंड फाइबर रतलाम'
        : 'Razais (Traditional Indian Quilts) | Diamond Fibre Ratlam',
    description: category.overview[locale],
  });
}

export default async function RazaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.razais;
  const images = category.representativeImages;

  const img0 = images[0];
  const img1 = images[1];
  const img2 = images[2];
  const img3 = images[3];
  const img4 = images[4];
  const img5 = images[5];

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
      {/* 1. Rich Textile Tapestry Hero Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <FadeIn direction="up">
            <div className="flex items-center gap-2">
              <Badge variant="accent">
                {category.shortTag[locale]}
              </Badge>
              <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-carbon-500)]">
                {locale === 'hi' ? 'मौसमी प्रिंट्स' : 'Seasonal Quilts'}
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

          {/* Textile Craft Highlights */}
          <FadeIn direction="up" delay={0.3}>
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--color-sand-300)]">
              <div className="flex items-start gap-2">
                <Palette className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'विविध मौसमी प्रिंट्स' : 'Rotating Print Batches'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'पैचवर्क, इकत, ब्रोकेड' : 'Patchwork, ikat & brocade'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'सघन चैनल क्विल्टिंग' : 'Channel Stitching'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'समान गर्माहट व बाइंडिंग' : 'Even fill distribution'}
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
                <span>{locale === 'hi' ? 'थोक व व्यापारी लॉट्स' : 'Bulk & Trader Orders'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Hero Visual Composition: Geometric Patchwork Razai + Ikat Inset */}
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
                      {locale === 'hi' ? 'पैचवर्क व पाइपिंग' : 'Geometric Patchwork'}
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

            {/* Inset Detail: Royal Blue Diamond Ikat */}
            {img2 && (
              <div className="hidden sm:flex absolute -bottom-6 -left-6 max-w-xs items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[var(--color-sand-300)] shadow-xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[var(--color-sand-200)]">
                  <Image
                    src={img2.src}
                    alt={img2.alt[locale]}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[var(--color-terracotta-700)] uppercase tracking-wide">
                    {locale === 'hi' ? 'डायमंड इकत' : 'Diamond Ikat'}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'क्विल्टेड ग्रिड पैटर्न' : 'Quilted Grid Stitch'}
                  </span>
                  <span className="text-[10px] text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'सर्दियों का आरामदायक साथी' : 'Seasonal print series'}
                  </span>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 2. Textile Artistry & Pattern Matrix: 4 Distinct Styles */}
      <section className="bg-[var(--color-warm-ivory-100)] rounded-3xl p-6 sm:p-10 border border-[var(--color-sand-300)] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'कपड़े व सजावट' : 'Print Diversity'}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'ब्राइडल ब्रोकेड से लेकर पारंपरिक पैस्ले तक' : 'The Textile Artistry of Razais'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-2 leading-relaxed">
              {locale === 'hi'
                ? 'शादी-विवाह के लिए भव्य ब्राइडल ब्रोकेड से लेकर रोजमर्रा के विंटर उपयोग के लिए क्लासिक चेक्स व पैस्ले रज़ाइयां।'
                : 'From ornate gold jacquard bridal brocade to everyday classic plaids and crimson florals, Diamond Fibre razais celebrate rich Indian textile traditions.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>{locale === 'hi' ? 'सच्ची फोटोग्राफी' : 'Genuine Textile Imagery'}</span>
          </div>
        </div>

        {/* 4-Item Editorial Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Style 1: Bridal Brocade */}
          {img1 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img1.src}
                  alt={img1.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'ब्राइडल गोल्ड ब्रोकेड' : 'Luxury Bridal Brocade'}
                </span>
                {img1.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img1.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Style 2: Crimson Paisley */}
          {img4 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img4.src}
                  alt={img4.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'विंटर पैस्ले फ्लोरल' : 'Crimson Winter Paisley'}
                </span>
                {img4.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img4.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Style 3: Blue Plaid Fold */}
          {img3 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img3.src}
                  alt={img3.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'क्लासिक चेक्स व लाइनिंग' : 'Classic Bound Plaid'}
                </span>
                {img3.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img3.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Style 4: Purple Floral Satin Stack */}
          {img5 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img5.src}
                  alt={img5.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'साटन पाइपिंग स्टैक' : 'Satin Bound Stack'}
                </span>
                {img5.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img5.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      </section>

      {/* 3. Seasonal Notice Alert */}
      <SeasonalNotice locale={locale} />

      {/* 4. Specifications Note */}
      <section className="p-6 rounded-2xl bg-white border border-[var(--color-sand-300)] flex flex-col gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
          {locale === 'hi' ? 'साइज और प्रिंट उपलब्धता' : 'Batch Parameters'}
        </span>
        <h3 className="font-display font-bold text-lg text-[var(--color-carbon-900)]">
          {locale === 'hi' ? 'माप व मौसमी बैच की जानकारी' : 'Dimensions & Batch Availability'}
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
              ? 'वर्तमान रज़ाइयों के प्रिंट्स व दरों के लिए पूछें'
              : 'Enquire About Current Razai Prints & Pricing'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-300)] leading-relaxed">
            {locale === 'hi'
              ? 'सर्दियों के सीजनल प्रिंट्स, शादी स्पेशल ब्राइडल ब्रोकेड और डिलीवरी की जानकारी के लिए संपर्क करें।'
              : 'Contact our sales desk for current seasonal print batches, bridal brocade options, and wholesale lots.'}
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
