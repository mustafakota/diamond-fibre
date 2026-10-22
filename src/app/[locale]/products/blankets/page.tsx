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
import { MessageCircle, ArrowRight, Sparkles, CheckCircle2, Feather } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.blankets;

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'products/blankets',
    title:
      locale === 'hi'
        ? 'मुलायम कंबल | डायमंड फाइबर रतलाम'
        : 'Bedding Blankets (Plush Mink & Fleece) | Diamond Fibre Ratlam',
    description: category.overview[locale],
  });
}

export default async function BlanketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.blankets;
  const images = category.representativeImages;

  const img0 = images[0];
  const img1 = images[1];
  const img2 = images[2];
  const img3 = images[3];
  const img4 = images[4];

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
      {/* 1. Tactile Velvet Hero Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <FadeIn direction="up">
            <div className="flex items-center gap-2">
              <Badge variant="accent">
                {category.shortTag[locale]}
              </Badge>
              <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-carbon-500)]">
                {locale === 'hi' ? 'विंटर कम्फर्ट' : 'Plush Warmth'}
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

          {/* Tactile Highlights */}
          <FadeIn direction="up" delay={0.3}>
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--color-sand-300)]">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'एम्बॉस्ड मिंक रेशे' : 'Embossed Mink Pile'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? '3D फ्लोरल नक्काशी' : 'High-sheen relief texture'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Feather className="w-4 h-4 text-[var(--color-terracotta-600)] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold block text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'फ्लीस व हेवी विंटर' : 'Fleece & Heavy Mink'}
                  </span>
                  <span className="text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'हल्के व कड़ाके के मौसम हेतु' : 'Mild & deep winter weights'}
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
                <span>{locale === 'hi' ? 'थोक व गठरी आपूर्ति' : 'Bale & Wholesale Supply'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Hero Visual Composition: Wine Mink Embossed + Inset Folded Square */}
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
                      {locale === 'hi' ? 'एम्बॉस्ड मिंक वेलवेट' : 'Embossed Mink Pile'}
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

            {/* Inset Detail: Folded Square Pile Thickness */}
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
                    {locale === 'hi' ? 'तह व मोटाई' : 'Folded Depth'}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-carbon-900)]">
                    {locale === 'hi' ? 'सघन वेलवेटी रेशे' : 'Plush Velvet Pile'}
                  </span>
                  <span className="text-[10px] text-[var(--color-carbon-500)]">
                    {locale === 'hi' ? 'गर्म व आरामदायक' : 'Soft winter insulation'}
                  </span>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 2. Tactile Texture & Border Study */}
      <section className="bg-[var(--color-warm-ivory-100)] rounded-3xl p-6 sm:p-10 border border-[var(--color-sand-300)] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'नक्काशीदार बॉर्डर व बनावट' : 'Texture & Border Detail'}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'एम्बॉस्ड मिंक और हल्के फ्लीस कंबल' : 'The Tactile Velvet Pile'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-2 leading-relaxed">
              {locale === 'hi'
                ? 'हमारे कंबलों में 3D फ्लोरल नक्काशी और सजावटी बॉर्डर का काम होता है। यह सर्दी के मौसम में आरामदायक गर्माहट और खूबसूरत लुक प्रदान करता है।'
                : 'From ornate 3D floral medallion embossing on heavyweight mink blankets to mild-weather lightweight fleece, explore our seasonal bedding textures.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>{locale === 'hi' ? 'सच्ची फोटोग्राफी' : 'Genuine Textile Imagery'}</span>
          </div>
        </div>

        {/* 3-Card Tactile Inspection */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Wine Floral Full Spread */}
          {img2 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img2.src}
                  alt={img2.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'विस्तृत फ्लोरल बॉर्डर' : 'Ornate Border Detail'}
                </span>
                {img2.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img2.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Card 2: Pink Floral Plush */}
          {img1 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img1.src}
                  alt={img1.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'गुलाबी फ्लोरल मिंक' : 'Vibrant Plush Medallion'}
                </span>
                {img1.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img1.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Card 3: Lavender Fleece */}
          {img4 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img4.src}
                  alt={img4.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'हल्का फ्लोरल फ्लीस' : 'Lightweight Floral Fleece'}
                </span>
                {img4.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img4.caption[locale]}
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
          {locale === 'hi' ? 'वजन व साइज विकल्प' : 'Weight & Weave Parameters'}
        </span>
        <h3 className="font-display font-bold text-lg text-[var(--color-carbon-900)]">
          {locale === 'hi' ? 'कंबल के साइज और वजन' : 'Blanket Dimensions & Seasonal Weights'}
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
              ? 'वर्तमान कंबलों के विकल्पों व दरों के लिए पूछें'
              : 'Enquire About Current Blanket Options & Pricing'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-300)] leading-relaxed">
            {locale === 'hi'
              ? 'वर्तमान सीजनल प्रिंट्स, मिंक वजन और थोक गठरी आपूर्ति की जानकारी के लिए संपर्क करें।'
              : 'Contact our sales desk for current seasonal mink weights, fleece varieties, and bulk supply.'}
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
