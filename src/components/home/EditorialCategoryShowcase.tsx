'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/seo';
import { CATEGORIES_DATA } from '@/content/catalog';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export interface EditorialCategoryShowcaseProps {
  locale: Locale;
}

export const EditorialCategoryShowcase: React.FC<EditorialCategoryShowcaseProps> = ({ locale }) => {
  const mattresses = CATEGORIES_DATA.mattresses;
  const pillows = CATEGORIES_DATA.pillows;
  const razais = CATEGORIES_DATA.razais;
  const blankets = CATEGORIES_DATA.blankets;

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* SECTION INTRO */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--color-sand-300)]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'हमारी 4 विनिर्माण श्रेणियां' : 'Four Core Bedding Collections'}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[var(--color-carbon-900)] tracking-tight">
              {locale === 'hi' ? 'आराम और कारीगरी का संगम' : 'Distinctly Crafted for Rest'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] max-w-md leading-relaxed">
            {locale === 'hi'
              ? 'रतलाम वर्कशॉप में सिलाई, भराई और क्विल्टिंग से तैयार की जाने वाली चारों प्रमुख श्रेणियां। सीजनल प्रिंट्स हर बैच में बदलते हैं।'
              : 'Manufactured at our Ratlam facility with dedicated stitching, filling, and quilting processes across four core collections. Seasonal fabrics rotate by batch.'}
          </p>
        </div>
      </FadeIn>

      {/* TIER 1: FLAGSHIP CATEGORY (Mattresses / गद्दे — Boxed-Edge Bed Mattresses & Quilted Floor Gaddas) */}
      <div className="flex flex-col p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-[var(--color-sand-300)] shadow-xs hover:border-[var(--color-sand-400)] transition-all duration-300 group">
        <div className="flex flex-col gap-8">
          {/* Card Header & Index */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-sand-200)]">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)] border border-[var(--color-terracotta-200)]">
                {mattresses.shortTag[locale]}
              </span>
              <span className="text-xs font-mono text-[var(--color-carbon-500)] hidden sm:inline">
                {locale === 'hi' ? 'प्रमुख विनिर्माण श्रेणी' : 'Flagship Collection'}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[var(--color-carbon-700)]">
              01 / 04
            </span>
          </div>

          {/* Dual Photography Showcase: Quilted Floor Gadda + Boxed-Edge Bed Mattress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Boxed-Edge Bed Mattress */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[var(--color-sand-300)]/20 border border-[var(--color-sand-300)]">
              <Image
                src="/images/mattresses/hero-mattress-maroon-boxed.webp"
                alt={
                  locale === 'hi'
                    ? 'मजबूत साइडवॉल और पाइपिंग बॉर्डर वाला बॉक्स्ड-एज मैट्रेस'
                    : 'Structured boxed-edge bed mattress with deep tufting and piped border'
                }
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/65 backdrop-blur-xs text-[11px] text-white font-medium">
                {locale === 'hi' ? 'बॉक्स्ड-एज मैट्रेस (पलंग के लिए)' : 'Boxed-Edge Mattresses (Bed Frames)'}
              </div>
            </div>

            {/* 2. Traditional Quilted Floor Gadda */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[var(--color-sand-300)]/20 border border-[var(--color-sand-300)]">
              <Image
                src="/images/gaddas/hero-gadda-sage-botanical.webp"
                alt={
                  locale === 'hi'
                    ? 'सेज ग्रीन फ्लोरल रजाईदार पारंपरिक गद्दे का वास्तविक फोटो'
                    : 'Quilted sage botanical traditional gadda with piped border'
                }
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/65 backdrop-blur-xs text-[11px] text-white font-medium">
                {locale === 'hi' ? 'पारंपरिक रजाईदार गद्दे (फ्लोर व दीवान)' : 'Quilted Gaddas (Floor & Diwan)'}
              </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
                <Link
                  href={`/${locale}/products/mattresses`}
                  className="hover:text-[var(--color-terracotta-600)] transition-colors focus:outline-none focus-visible:underline"
                >
                  {mattresses.name[locale]}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[var(--color-terracotta-600)]">
                {mattresses.tagline[locale]}
              </p>
              <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed max-w-2xl">
                {mattresses.overview[locale]}
              </p>

              {/* Verified Baseline Dimensions */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-[var(--color-carbon-800)]">
                  {locale === 'hi' ? 'मानक माप:' : 'Confirmed Baseline Sizes:'}
                </span>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[var(--color-sand-300)]/50 text-[var(--color-carbon-900)]">
                  3 × 6 ft
                </span>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[var(--color-sand-300)]/50 text-[var(--color-carbon-900)]">
                  4 × 6 ft
                </span>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[var(--color-sand-300)]/50 text-[var(--color-carbon-900)]">
                  6 × 6 ft
                </span>
                <span className="text-[11px] text-[var(--color-carbon-500)] italic">
                  {locale === 'hi' ? '• मॉडल उपलब्धता के अधीन' : '• Subject to model availability'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-end gap-3 pt-4 lg:pt-0">
              <Link
                href={`/${locale}/products/mattresses`}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[var(--color-carbon-900)] hover:bg-[var(--color-carbon-800)] px-6 py-3 rounded-full transition-colors min-h-[46px] w-full sm:w-auto"
              >
                <span>{locale === 'hi' ? 'गद्दे रेंज देखें' : 'Explore Mattresses'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={buildWhatsAppLink(mattresses.whatsappPrefill[locale])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors min-h-[46px] shadow-xs w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Enquiry'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* TIER 2: EDITORIAL TRIO (Pillows, Razais, Blankets) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {/* PILLOWS */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[var(--color-sand-300)] shadow-xs hover:border-[var(--color-sand-400)] transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-sand-300)]/40 text-[var(--color-carbon-900)]">
                {pillows.shortTag[locale]}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-carbon-600)]">02 / 04</span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[var(--color-sand-300)]/20">
              <Image
                src={pillows.representativeImages[0].src}
                alt={pillows.representativeImages[0].alt[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-carbon-900)] mb-1">
                <Link
                  href={`/${locale}/products/pillows`}
                  className="hover:text-[var(--color-terracotta-600)] transition-colors focus:outline-none focus-visible:underline"
                >
                  {pillows.name[locale]}
                </Link>
              </h3>
              <p className="text-xs text-[var(--color-terracotta-600)] font-medium mb-2">
                {locale === 'hi' ? 'सिंगल पैक व थोक 4-पैक बंडल' : 'Single retail & bulk 4-pack bundles'}
              </p>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {pillows.overview[locale]}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--color-sand-300)] flex items-center justify-between gap-2">
            <Link
              href={`/${locale}/products/pillows`}
              className="text-xs font-semibold text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] flex items-center gap-1 min-h-[44px]"
            >
              <span>{locale === 'hi' ? 'विवरण' : 'Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <a
              href={buildWhatsAppLink(pillows.whatsappPrefill[locale])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] min-h-[44px]"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{locale === 'hi' ? 'पूछताछ' : 'Ask'}</span>
            </a>
          </div>
        </div>

        {/* RAZAIS */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[var(--color-sand-300)] shadow-xs hover:border-[var(--color-sand-400)] transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-sand-300)]/40 text-[var(--color-carbon-900)]">
                {razais.shortTag[locale]}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-carbon-600)]">03 / 04</span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[var(--color-sand-300)]/20">
              <Image
                src={razais.representativeImages[0].src}
                alt={razais.representativeImages[0].alt[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-carbon-900)] mb-1">
                <Link
                  href={`/${locale}/products/razais`}
                  className="hover:text-[var(--color-terracotta-600)] transition-colors focus:outline-none focus-visible:underline"
                >
                  {razais.name[locale]}
                </Link>
              </h3>
              <p className="text-xs text-[var(--color-terracotta-600)] font-medium mb-2">
                {locale === 'hi' ? 'सीजनल रजाईदार रज़ाइयां' : 'Traditional seasonal quilts'}
              </p>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {razais.overview[locale]}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--color-sand-300)] flex items-center justify-between gap-2">
            <Link
              href={`/${locale}/products/razais`}
              className="text-xs font-semibold text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] flex items-center gap-1 min-h-[44px]"
            >
              <span>{locale === 'hi' ? 'विवरण' : 'Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <a
              href={buildWhatsAppLink(razais.whatsappPrefill[locale])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] min-h-[44px]"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{locale === 'hi' ? 'पूछताछ' : 'Ask'}</span>
            </a>
          </div>
        </div>

        {/* BLANKETS */}
        <div className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[var(--color-sand-300)] shadow-xs hover:border-[var(--color-sand-400)] transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-sand-300)]/40 text-[var(--color-carbon-900)]">
                {blankets.shortTag[locale]}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-carbon-600)]">04 / 04</span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[var(--color-sand-300)]/20">
              <Image
                src={blankets.representativeImages[0].src}
                alt={blankets.representativeImages[0].alt[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-carbon-900)] mb-1">
                <Link
                  href={`/${locale}/products/blankets`}
                  className="hover:text-[var(--color-terracotta-600)] transition-colors focus:outline-none focus-visible:underline"
                >
                  {blankets.name[locale]}
                </Link>
              </h3>
              <p className="text-xs text-[var(--color-terracotta-600)] font-medium mb-2">
                {locale === 'hi' ? 'मुलायम मिंक व फ्लीस कंबल' : 'Plush mink & winter fleece'}
              </p>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {blankets.overview[locale]}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--color-sand-300)] flex items-center justify-between gap-2">
            <Link
              href={`/${locale}/products/blankets`}
              className="text-xs font-semibold text-[var(--color-carbon-900)] hover:text-[var(--color-terracotta-600)] flex items-center gap-1 min-h-[44px]"
            >
              <span>{locale === 'hi' ? 'विवरण' : 'Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <a
              href={buildWhatsAppLink(blankets.whatsappPrefill[locale])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] min-h-[44px]"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{locale === 'hi' ? 'पूछताछ' : 'Ask'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
