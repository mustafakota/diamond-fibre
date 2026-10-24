import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { FadeIn } from '@/components/motion/FadeIn';
import { ArrowRight } from 'lucide-react';

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
        ? 'हमारा परिचय व विनिर्माण इकाई | डायमंड फाइबर रतलाम (म.प्र.)'
        : 'Our Story & Manufacturing Workshop | Diamond Fibre Ratlam, MP',
    description:
      locale === 'hi'
        ? 'रतलाम (मध्य प्रदेश) स्थित डायमंड फाइबर की विनिर्माण यात्रा। 2018 से गद्दे, फ्लोर गद्दे, तकिए, रज़ाइयां और कंबल का प्रत्यक्ष उत्पादन एवं क्षेत्रीय आपूर्ति।'
        : "Discover Diamond Fibre's bedding manufacturing heritage in Ratlam, Madhya Pradesh. Crafting durable floor gaddas, mattresses, pillows, razais, and blankets since 2018.",
    ogImage: {
      url: '/images/retouched/story/craft-quilting-macro-stitch.webp',
      alt: locale === 'hi' ? 'डायमंड फाइबर रतलाम वर्कशॉप' : 'Diamond Fibre Ratlam Workshop',
    },
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
  const baseUrl = getBaseUrl();

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd(baseUrl, locale, [
    {
      name: locale === 'hi' ? 'हमारा परिचय' : 'Our Story',
      pathSegment: 'our-story',
    },
  ]);

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name:
      locale === 'hi'
        ? 'डायमंड फाइबर परिचय व विनिर्माण'
        : 'About Diamond Fibre Bedding Manufacturing',
    description:
      locale === 'hi'
        ? 'रतलाम (मध्य प्रदेश) स्थित गद्दे, तकिए, रज़ाई एवं कंबल विनिर्माण वर्कशॉप।'
        : 'Ratlam, Madhya Pradesh based manufacturing workshop for mattresses, pillows, quilts, and blankets.',
    url: `${baseUrl}/${locale}/our-story`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Diamond Fibre',
      foundingDate: '2018',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ratlam',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-10 sm:gap-12 md:gap-16">
      {/* 1. Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">

            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)]">
              {locale === 'hi' ? 'रतलाम, मध्य प्रदेश' : 'Ratlam, MP'}
            </span>
          </div>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight leading-[1.15] text-balance">
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
              {locale === 'hi' ? 'रतलाम स्थित अपनी निर्माण इकाई' : 'Direct manufacturing in Ratlam'}
            </span>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] h-full flex flex-col justify-between">
            <p>{dict.story.body2}</p>
            <span className="text-xs font-mono text-[var(--color-carbon-500)] mt-4 block">
              {locale === 'hi' ? 'चार मुख्य बेडिंग श्रेणियां' : 'Four core bedding categories'}
            </span>
          </div>
        </FadeIn>
      </div>

      {/* 3. Photography-Led Craft & Production Feature */}
      <section className="flex flex-col gap-8 pt-2">
        <FadeIn direction="up">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'निर्माण व कारीगरी' : 'Production & Craft'}
            </span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[var(--color-carbon-900)] tracking-tight text-balance">
              {dict.story.howItComesTogetherHeading}
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
              {dict.story.howItComesTogetherIntro}
            </p>
          </div>
        </FadeIn>

        {/* Asymmetric Editorial Photography Grid: 1 Large Lead + 2 Paired Detail Images */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Lead Larger Photograph: Finished Product in Ratlam Facility (lg:col-span-7) */}
          <FadeIn direction="up" delay={0.1} className="lg:col-span-7 flex flex-col">
            <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-[var(--color-sand-300)] bg-[var(--color-warm-ivory-100)] shadow-xs group">
              <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto lg:flex-1 w-full overflow-hidden bg-[var(--color-sand-300)]/20 min-h-[260px] sm:min-h-[340px]">
                <Image
                  src="/images/retouched/wholesale/wholesale-mattress-inventory-stack.webp"
                  alt={dict.story.leadImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />
              </div>
              <div className="p-4 sm:p-5 border-t border-[var(--color-sand-300)]/80 bg-white">
                <p className="text-xs sm:text-[13px] text-[var(--color-carbon-700)] font-medium leading-relaxed">
                  {dict.story.leadImageCaption}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Two Paired Craft Close-Up Details (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Detail 1: Channel Quilting Macro Stitch */}
            <FadeIn direction="up" delay={0.2} className="flex-1">
              <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-white shadow-xs group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-sand-300)]/20">
                  <Image
                    src="/images/retouched/story/craft-quilting-macro-stitch.webp"
                    alt={dict.story.quiltingAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                </div>
                <div className="p-3.5 sm:p-4 border-t border-[var(--color-sand-300)]/60">
                  <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                    {dict.story.quiltingCaption}
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Detail 2: Reinforced Tufting & Piped Edge Border */}
            <FadeIn direction="up" delay={0.3} className="flex-1">
              <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-white shadow-xs group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-sand-300)]/20">
                  <Image
                    src="/images/retouched/story/craft-tufting-piped-border.webp"
                    alt={dict.story.borderAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                </div>
                <div className="p-3.5 sm:p-4 border-t border-[var(--color-sand-300)]/60">
                  <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                    {dict.story.borderCaption}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Factual 4-Part Construction Summary Strip (Clean, restrained, no generic icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] uppercase tracking-wider font-mono">
              {dict.story.step1Tag}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-carbon-900)]">
              {dict.story.step1Title}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {dict.story.step1Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] uppercase tracking-wider font-mono">
              {dict.story.step2Tag}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-carbon-900)]">
              {dict.story.step2Title}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {dict.story.step2Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] uppercase tracking-wider font-mono">
              {dict.story.step3Tag}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-carbon-900)]">
              {dict.story.step3Title}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {dict.story.step3Desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] uppercase tracking-wider font-mono">
              {dict.story.step4Tag}
            </span>
            <h3 className="font-semibold text-sm text-[var(--color-carbon-900)]">
              {dict.story.step4Title}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {dict.story.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Next Actions */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[var(--color-carbon-900)] text-white shadow-xl">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-terracotta-400)] block mb-1">
              {locale === 'hi' ? 'उत्पाद देखें' : 'Explore Collections'}
            </span>
            <p className="text-base font-semibold">
              {locale === 'hi'
                ? 'गद्दे (मैट्रेस), तकिए, रज़ाइयां और कंबल की रेंज देखें'
                : 'Browse our four core bedding categories'}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none px-7 py-3 rounded-full font-semibold text-xs transition-all min-h-[44px] shrink-0"
          >
            <span>{locale === 'hi' ? 'उत्पाद श्रेणियां' : 'Browse Categories'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
    </>
  );
}
