import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { EditorialCategoryShowcase } from '@/components/home/EditorialCategoryShowcase';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight, Building2, Sparkles, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const dict = getDictionary(locale);

  return buildLocalizedMetadata({
    locale,
    pathSegment: '',
    title:
      locale === 'hi'
        ? 'डायमंड फाइबर | रतलाम में स्थित बेडिंग निर्माता (गद्दे, तकिए, रज़ाइयां, कंबल)'
        : 'Diamond Fibre | Bedding Manufacturer in Ratlam (Mattresses, Pillows, Razais, Blankets)',
    description: dict.home.hero.subheadline,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col gap-16 md:gap-28 pb-20 overflow-hidden">
      {/* 1. ASYMMETRIC EDITORIAL HERO */}
      <section className="relative pt-6 sm:pt-12 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Typographic Drama */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            <FadeIn direction="up" delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-sand-300)]/50 border border-[var(--color-sand-400)]/60 text-xs font-mono text-[var(--color-carbon-800)] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-terracotta-600)]" />
                <span>
                  {locale === 'hi' ? 'द कम्फर्ट रिवोल्यूशन • रतलाम (स्था. 2018)' : 'The Comfort Revolution • Ratlam (Est. 2018)'}
                </span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl text-[var(--color-carbon-900)] tracking-tight leading-[1.04]">
                {locale === 'hi' ? (
                  <>
                    विश्राम की कला। <br />
                    <span className="font-serif italic font-normal text-[var(--color-terracotta-600)]">
                      रतलाम में निर्मित।
                    </span>
                  </>
                ) : (
                  <>
                    The Art of Rest. <br />
                    <span className="font-serif italic font-normal text-[var(--color-terracotta-600)]">
                      Engineered in Ratlam.
                    </span>
                  </>
                )}
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.25}>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-carbon-600)] leading-relaxed max-w-xl">
                {locale === 'hi'
                  ? 'पारिवारिक विनिर्माण परंपरा — रजाईदार व बॉक्स्ड-एज गद्दे (मैट्रेस), आरामदायक तकिए, सीजनल रज़ाइयां और गर्म कंबल। शुद्ध कारीगरी, सीधे हमारी रतलाम वर्कशॉप से।'
                  : 'Family-run bedding manufacturing direct from our Ratlam facility. Mattresses (traditional gaddas & boxed beds), everyday pillows, seasonal razais, and plush blankets.'}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.35}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a
                  href="#collections-matrix"
                  className="inline-flex items-center justify-center gap-2.5 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] min-h-[50px] px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>{locale === 'hi' ? 'चारों श्रेणियां देखें' : 'Explore Collections'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={buildWhatsAppLink(
                    locale === 'hi'
                      ? 'नमस्ते डायमंड फाइबर, मैं बेडिंग उत्पादों की वर्तमान उपलब्धता व दरों के बारे में जानकारी चाहता हूँ।'
                      : 'Hello Diamond Fibre, I would like to inquire about current bedding designs, availability, and pricing.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] min-h-[50px] px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'WhatsApp Sales Desk'}</span>
                </a>
              </div>
            </FadeIn>

            {/* Quick Provenance Footnote */}
            <FadeIn direction="up" delay={0.45}>
              <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-sand-300)] text-xs text-[var(--color-carbon-600)]">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{locale === 'hi' ? 'रतलाम में अपनी इकाई' : 'Own Facility in Ratlam'}</span>
                </span>
                <span className="text-[var(--color-sand-400)]">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{locale === 'hi' ? 'दुकानों व रीसेलर्स हेतु थोक' : 'Retailer & Reseller Supply'}</span>
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Multi-Plane Editorial Composition */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <FadeIn direction="none" delay={0.2} duration={0.8}>
              {/* Primary Image: Expansive Botanical Gadda Crop */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[var(--color-sand-300)] shadow-[var(--shadow-card)] bg-white group">
                <Image
                  src="/images/hero/editorial-comfort-hero.webp"
                  alt={
                    locale === 'hi'
                      ? 'रतलाम वर्कशॉप में निर्मित सेज ग्रीन फ्लोरल रजाईदार गद्दे'
                      : 'Authentic Diamond Fibre botanical leaf quilted gadda with piped boxed edges'
                  }
                  fill
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-xs bg-black/40 px-3.5 py-2 rounded-xl">
                  {locale === 'hi'
                    ? 'सेज ग्रीन बॉटनिकल गद्दे — मजबूत पाइपिंग बॉर्डर और सघन टफ्टिंग'
                    : 'Sage Botanical Gadda — Reinforced piped boxed border & dense tufting'}
                </div>
              </div>

              {/* Floating Overlapping Detail Card: Quilting Macro Stitch */}
              <div className="hidden sm:flex absolute -bottom-8 -left-6 z-20 bg-white p-2.5 rounded-2xl shadow-xl border border-[var(--color-sand-300)] max-w-[220px] flex-col gap-2">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[var(--color-sand-300)]/20">
                  <Image
                    src="/images/story/craft-quilting-macro-stitch.webp"
                    alt={
                      locale === 'hi'
                        ? 'सघन डायगोनल क्विल्टिंग सिलाई का विवरण'
                        : 'Close-up detail of dense diagonal channel quilting stitch'
                    }
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="px-1 pb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-terracotta-600)] block font-semibold">
                    {locale === 'hi' ? 'क्विल्टिंग कारीगरी' : 'Quilting Craft'}
                  </span>
                  <p className="text-[11px] font-medium text-[var(--color-carbon-900)] leading-tight">
                    {locale === 'hi' ? 'सघन डायगोनल चैनल सिलाई' : 'Dense diagonal channel stitch'}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. RESTRAINED EDITORIAL RIBBON: 4 MANUFACTURING DISCIPLINES */}
      <section className="border-y border-[var(--color-sand-300)] bg-[var(--color-sand-300)]/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-medium text-[var(--color-carbon-800)]">
          <span className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[var(--color-terracotta-600)]" />
            <span>{locale === 'hi' ? 'सिलाई (Precision Stitching)' : 'Precision Stitching'}</span>
          </span>
          <span className="text-[var(--color-sand-400)] hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--color-terracotta-600)]" />
            <span>{locale === 'hi' ? 'भराई (Material Filling)' : 'Material Filling'}</span>
          </span>
          <span className="text-[var(--color-sand-400)] hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-terracotta-600)]" />
            <span>{locale === 'hi' ? 'क्विल्टिंग (Channel Quilting)' : 'Multi-Channel Quilting'}</span>
          </span>
          <span className="text-[var(--color-sand-400)] hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--color-terracotta-600)]" />
            <span>{locale === 'hi' ? 'पैकिंग (Bulk Protective Packing)' : 'Protective Bulk Packing'}</span>
          </span>
        </div>
      </section>

      {/* 3. THE 5 BEDDING COLLECTIONS (ASYMMETRIC EDITORIAL MATRIX) */}
      <section id="collections-matrix" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-28">
        <EditorialCategoryShowcase locale={locale} />
      </section>

      {/* 4. SEASONAL NOTICE ADVISORY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <SeasonalNotice locale={locale} />
      </section>

      {/* 5. RATLAM MANUFACTURING HERITAGE SPREAD (DEEP CARBON BACKGROUND) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-[var(--color-carbon-900)] text-[var(--color-warm-ivory-100)] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--color-carbon-800)] pb-8">
            <div className="max-w-2xl flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-500)] font-semibold">
                {locale === 'hi' ? 'रतलाम, मध्य प्रदेश • 2018 से' : 'Ratlam, Madhya Pradesh • Established 2018'}
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                {locale === 'hi' ? 'शुद्ध विनिर्माण परंपरा' : 'Rooted in Authentic Manufacturing'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-sand-300)]/80 max-w-md leading-relaxed">
              {locale === 'hi'
                ? 'डायमंड फाइबर केवल एक ब्रांड नहीं, बल्कि रतलाम में 2018 से संचालित एक पारिवारिक निर्माण इकाई है। हम स्वयं सिलाई, भराई और क्विल्टिंग से उत्पाद तैयार करते हैं।'
                : 'Diamond Fibre operates a family-run bedding manufacturing unit established in 2018 in Ratlam, MP. We oversee our own casing stitching, material filling, and channel quilting.'}
            </p>
          </div>

          {/* Genuine Craft Photography Duo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[var(--color-carbon-800)] bg-[var(--color-carbon-800)]">
                <Image
                  src="/images/story/craft-quilting-macro-stitch.webp"
                  alt={
                    locale === 'hi'
                      ? 'रतलाम वर्कशॉप में सघन डायगोनल क्विल्टिंग और कपड़े की बुनाई'
                      : 'Dense diagonal channel quilting stitch and woven fabric construction'
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--color-terracotta-500)] block mb-0.5">
                  {locale === 'hi' ? 'सघन चैनल क्विल्टिंग' : 'Multi-Channel Quilting'}
                </span>
                <p className="text-xs text-[var(--color-sand-300)]/80 leading-relaxed">
                  {locale === 'hi'
                    ? 'कपड़े और भराई को एक समान बनाए रखने वाली मजबूत सिलाई जो वर्षों तक नहीं बिगड़ती।'
                    : 'Evenly distributes fill materials and preserves bedding loft across years of daily use.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[var(--color-carbon-800)] bg-[var(--color-carbon-800)]">
                <Image
                  src="/images/story/craft-tufting-piped-border.webp"
                  alt={
                    locale === 'hi'
                      ? 'मजबूत पाइपिंग बॉर्डर और मल्टी-लेयर टफ्टिंग की कारीगरी'
                      : 'Reinforced piped edge border and multi-layer tufting construction'
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--color-terracotta-500)] block mb-0.5">
                  {locale === 'hi' ? 'मजबूत बॉक्स्ड पाइपिंग' : 'Reinforced Piped Borders'}
                </span>
                <p className="text-xs text-[var(--color-sand-300)]/80 leading-relaxed">
                  {locale === 'hi'
                    ? 'गद्दों और मैट्रेस के किनारों को मजबूती देने वाली पक्की पाइपिंग सिलाई।'
                    : 'Structured sidewall binding reinforcing mattress perimeter durability.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-carbon-800)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[var(--color-sand-300)]/70">
              {locale === 'hi'
                ? '*रतलाम वर्कशॉप में वास्तविक निर्माण विवरण। कोई भ्रामक दावा नहीं।'
                : '*Authentic construction details photographed in our Ratlam workshop.'}
            </span>
            <Link
              href={`/${locale}/our-story`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-terracotta-500)] hover:text-white transition-colors"
            >
              <span>{locale === 'hi' ? 'हमारा पूरा सफर पढ़ें' : 'Read Our Full Story'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHOLESALE & RESELLER VOLUME SUPPLY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white border border-[var(--color-sand-300)] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {dict.nav.wholesale}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[var(--color-carbon-900)] tracking-tight">
              {locale === 'hi'
                ? 'दुकानदारों व रीसेलर्स के लिए फैक्ट्री सप्लाई'
                : 'Direct Supply for Retailers & Stockists'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'मध्य प्रदेश और आसपास के क्षेत्रों में थोक व्यापारियों, फर्निशिंग स्टोर्स और रीसेलर्स के लिए निरंतर आपूर्ति। बैच के आधार पर न्यूनतम ऑर्डर मात्रा व फ्रेट शर्तें लागू होती हैं।'
                : 'Consistent bulk supply for home furnishing retailers, distributors, and institutional stockists across Madhya Pradesh and neighboring regional transit routes.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/${locale}/wholesale`}
                className="inline-flex items-center gap-2 bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-colors min-h-[48px]"
              >
                <span>{dict.wholesale.form.heading}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={buildWhatsAppLink(
                  locale === 'hi'
                    ? 'नमस्ते डायमंड फाइबर, मैं अपनी दुकान/व्यापार के लिए थोक आपूर्ति के बारे में बात करना चाहता हूँ।'
                    : 'Hello Diamond Fibre, I would like to discuss wholesale supply for my retail business.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm transition-colors min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{locale === 'hi' ? 'थोक चैट' : 'Wholesale WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Genuine Inventory Visual Duo */}
          <div className="grid grid-cols-2 gap-3 w-full lg:max-w-md shrink-0">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-[var(--color-sand-300)]/20 shadow-xs">
              <Image
                src="/images/wholesale/wholesale-mattress-inventory-stack.webp"
                alt={
                  locale === 'hi'
                    ? 'रतलाम वर्कशॉप में तैयार मैट्रेस का स्टैक'
                    : 'Tall inventory stack of tufted mattresses in Ratlam showroom'
                }
                fill
                sizes="(max-width: 1024px) 50vw, 220px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-[var(--color-sand-300)]/20 shadow-xs">
              <Image
                src="/images/wholesale/wholesale-pillow-packs-strapped.webp"
                alt={
                  locale === 'hi'
                    ? 'थोक आपूर्ति के लिए स्ट्रैप से बंधा 4 तकियों का कमर्शियल पैक'
                    : 'Commercial strapped bundle of 4 pillows for wholesale dispatch'
                }
                fill
                sizes="(max-width: 1024px) 50vw, 220px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
