import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { Building2, Scissors, Layers, PackageCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'our-story',
    title:
      locale === 'hi'
        ? 'हमारा परिचय | डायमंड फाइबर रतलाम (स्थापना 2018)'
        : 'Our Story | Diamond Fibre Ratlam (Est. 2018)',
    description:
      locale === 'hi'
        ? '2018 से रतलाम (मध्य प्रदेश) में स्थापित पारिवारिक बेडिंग निर्माण संस्थान। गद्दे (मैट्रेस), तकिए, रज़ाइयां और कंबल।'
        : 'Family-run bedding manufacturer established in 2018 in Ratlam, Madhya Pradesh. Producing mattresses (gaddas), pillows, razais, and blankets.',
  });
}

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const dict = getDictionary(locale);

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
      {/* 1. Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="self-start">
              {locale === 'hi' ? 'पारिवारिक उद्यम • स्थापना 2018' : 'Family-Run Business • Est. 2018'}
            </Badge>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)]">
              {locale === 'hi' ? 'रतलाम, मध्य प्रदेश' : 'Ratlam, MP'}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight leading-[1.15]">
            {dict.story.title}
          </h1>
          <p className="text-base sm:text-lg font-medium text-[var(--color-terracotta-600)]">
            {dict.story.subtitle}
          </p>
        </div>
      </FadeIn>

      {/* 2. Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-[var(--color-carbon-800)] leading-relaxed">
        <FadeIn direction="up" delay={0.1}>
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] h-full flex flex-col justify-between">
            <p>{dict.story.body1}</p>
            <span className="text-xs font-mono text-[var(--color-carbon-500)] mt-4 block">
              {locale === 'hi' ? '— स्थानीय कारीगरी व विश्वसनीयता' : '— Grounded in regional trust'}
            </span>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] h-full flex flex-col justify-between">
            <p>{dict.story.body2}</p>
            <span className="text-xs font-mono text-[var(--color-carbon-500)] mt-4 block">
              {locale === 'hi' ? '— 5 श्रेणियों का व्यवस्थित विनिर्माण' : '— 5 integrated product categories'}
            </span>
          </div>
        </FadeIn>
      </div>

      {/* 3. Facility Heritage Graphic */}
      <FadeIn direction="up" delay={0.2}>
        <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full rounded-3xl overflow-hidden border border-[var(--color-sand-300)] shadow-lg bg-[var(--color-sand-300)]/20">
          <Image
            src="/images/story/ratlam-heritage.svg"
            alt={
              locale === 'hi'
                ? 'रतलाम फैक्ट्री विनिर्माण क्षमताएं (सिलाई, भराई, क्विल्टिंग, पैकिंग)'
                : 'Ratlam Manufacturing Capabilities (Stitching, Filling, Quilting, Packing)'
            }
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      </FadeIn>

      {/* 4. Authentic Craft & Construction Details */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'वर्कशॉप फोटोग्राफी' : 'Tactile Evidence'}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'सिलाई व क्विल्टिंग की कारीगरी' : 'Stitching & Quilting Construction Details'}
            </h2>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            <span>{locale === 'hi' ? 'वास्तविक उत्पादन तस्वीरें' : 'Genuine Workshop Photos'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FadeIn direction="right" className="flex flex-col gap-3">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[var(--color-sand-300)] shadow-xs bg-[var(--color-sand-300)]/20">
              <Image
                src="/images/story/craft-quilting-macro-stitch.webp"
                alt={
                  locale === 'hi'
                    ? 'रतलाम वर्कशॉप में सघन डायगोनल क्विल्टिंग और कपड़े की बुनाई'
                    : 'Dense diagonal channel quilting stitch and woven fabric construction'
                }
                fill
                sizes="(max-width: 640px) 100vw, 450px"
                className="object-cover"
              />
            </div>
            <p className="text-xs text-[var(--color-carbon-600)] px-1 leading-relaxed">
              {locale === 'hi'
                ? 'बारीक डायगोनल क्विल्टिंग सिलाई जो भराई को स्थिर रखती है।'
                : 'Dense diagonal channel quilting securing internal fiber distribution.'}
            </p>
          </FadeIn>

          <FadeIn direction="left" className="flex flex-col gap-3">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[var(--color-sand-300)] shadow-xs bg-[var(--color-sand-300)]/20">
              <Image
                src="/images/story/craft-tufting-piped-border.webp"
                alt={
                  locale === 'hi'
                    ? 'मजबूत पाइपिंग बॉर्डर और मल्टी-लेयर टफ्टिंग की कारीगरी'
                    : 'Reinforced piped edge border and multi-layer tufting construction'
                }
                fill
                sizes="(max-width: 640px) 100vw, 450px"
                className="object-cover"
              />
            </div>
            <p className="text-xs text-[var(--color-carbon-600)] px-1 leading-relaxed">
              {locale === 'hi'
                ? 'गद्दे के किनारों को मजबूती देने वाली पाइपिंग और मजबूत टफ्टिंग।'
                : 'Reinforced piped sidewall binding maintaining structured mattress edges.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 5. Confirmed Operations Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
          {locale === 'hi' ? 'हमारी विनिर्माण क्षमताएं' : 'Manufacturing Capabilities at Our Ratlam Facility'}
        </h2>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StaggerItem>
            <Card className="flex items-start gap-4 p-6 rounded-2xl h-full">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-carbon-900)] mb-1">
                  {locale === 'hi' ? 'सिलाई (Stitching)' : 'Precision Stitching'}
                </h3>
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {locale === 'hi'
                    ? 'मजबूत धागों और पक्की सिलाई से तैयार किए जाने वाले कवर्स व किनारे।'
                    : 'Durable edge binding and secure casing stitching across bedding categories.'}
                </p>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="flex items-start gap-4 p-6 rounded-2xl h-full">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-carbon-900)] mb-1">
                  {locale === 'hi' ? 'भराई (Filling)' : 'Material Filling'}
                </h3>
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {locale === 'hi'
                    ? 'गद्दों, तकियों और रज़ाइयों के लिए समान और व्यवस्थित भराई।'
                    : 'Controlled layer insertion for gaddas, pillows, and seasonal quilts.'}
                </p>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="flex items-start gap-4 p-6 rounded-2xl h-full">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-carbon-900)] mb-1">
                  {locale === 'hi' ? 'क्विल्टिंग (Quilting)' : 'Quilting Operations'}
                </h3>
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {locale === 'hi'
                    ? 'कपड़े और भराई को एक साथ मजबूती से बांधने वाली रजाईदार सिलाई।'
                    : 'Patterned surface quilting to secure outer fabrics and maintain inner stability.'}
                </p>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="flex items-start gap-4 p-6 rounded-2xl h-full">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-carbon-900)] mb-1">
                  {locale === 'hi' ? 'सुरक्षित पैकिंग (Packing)' : 'Protective Packing'}
                </h3>
                <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                  {locale === 'hi'
                    ? 'परिवहन और भंडारण के दौरान सुरक्षा के लिए मजबूत पैकेजिंग।'
                    : 'Bulk and retail packing designed to protect goods during transport.'}
                </p>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 6. Next Actions */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[var(--color-carbon-900)] text-white shadow-xl">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-terracotta-400)] block mb-1">
              {locale === 'hi' ? 'उत्पाद देखें' : 'Explore Collections'}
            </span>
            <p className="text-base font-semibold">
              {locale === 'hi'
                ? 'गद्दे, मैट्रेस, तकिए, रज़ाइयां और कंबल की रेंज देखें'
                : 'Discover our five verified product categories'}
            </p>
          </div>
          <Link
            href={`/${locale}/products/mattresses`}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] px-7 py-3 rounded-full font-semibold text-xs transition-colors min-h-[44px] shrink-0"
          >
            <span>{locale === 'hi' ? 'उत्पाद श्रेणियां' : 'Browse Categories'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
