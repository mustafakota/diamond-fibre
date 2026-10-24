import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { CATEGORIES_DATA } from '@/content/catalog';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { MessageCircle, ArrowRight } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'products/blankets',
    title:
      locale === 'hi'
        ? 'कंबल निर्माता रतलाम | मिंक व फ्लीस विंटर कंबल | डायमंड फाइबर'
        : 'Blanket Supplier & Manufacturer in Ratlam | Mink & Fleece | Diamond Fibre',
    description:
      locale === 'hi'
        ? 'सिंगल व डबल बेड उभरे हुए मिंक और पोलर फ्लीस कंबल। रतलाम (म.प्र.) से सीधे रिटेलर्स व होटल-हॉस्टल थोक आपूर्ति। सीजनल स्टॉक व उचित दाम।'
        : 'Single and double bed embossed mink blankets and thermal polar fleece blankets supplied from Ratlam, Madhya Pradesh. Available for retailers and institutional wholesale.',
    ogImage: {
      url: '/images/retouched/blankets/hero-blanket-wine-mink-embossed.webp',
      alt: locale === 'hi' ? 'डायमंड फाइबर मिंक कंबल' : 'Diamond Fibre Mink Blankets',
    },
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
  const baseUrl = getBaseUrl();

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd(baseUrl, locale, [
    {
      name: locale === 'hi' ? 'उत्पाद' : 'Products',
      pathSegment: 'products',
    },
    {
      name: locale === 'hi' ? 'कंबल (ब्लैंकेट्स)' : 'Warm Blankets',
      pathSegment: 'products/blankets',
    },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'hi'
        ? 'मुलायम कंबल संग्रह | डायमंड फाइबर रतलाम'
        : 'Plush Mink & Fleece Blankets Collection | Diamond Fibre Ratlam',
    description: category.overview[locale],
    url: `${baseUrl}/${locale}/products/blankets`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.representativeImages.map((img, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: img.caption ? img.caption[locale] : img.alt[locale],
        image: `${baseUrl}${img.src}`,
      })),
    },
  };

  const images = category.representativeImages;

  const img0 = images[0];
  const img1 = images[1];
  const img2 = images[2];
  const img3 = images[3];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10 sm:gap-12 md:gap-16">
      {/* 1. Tactile Velvet Hero Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <FadeIn direction="up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                {category.shortTag[locale]}
              </Badge>
              <span className="text-xs uppercase tracking-widest font-mono text-[var(--color-carbon-500)]">
                {locale === 'hi' ? 'रतलाम फैक्टरी उत्पादन' : 'Ratlam Factory Manufacturing'}
              </span>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight leading-[1.15] text-balance">
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
              <div className="flex flex-col">
                <span className="font-semibold block text-xs text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'एम्बॉस्ड मिंक रेशे' : 'Embossed Mink Pile'}
                </span>
                <span className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                  {locale === 'hi' ? '3D फ्लोरल नक्काशी' : 'High-sheen relief texture'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold block text-xs text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'फ्लीस व हेवी विंटर' : 'Fleece & Heavy Mink'}
                </span>
                <span className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                  {locale === 'hi' ? 'हल्के व कड़ाके के मौसम हेतु' : 'Mild & deep winter weights'}
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={buildWhatsAppLink(category.whatsappPrefill[locale])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Enquire on WhatsApp'}</span>
              </a>
              <Link
                href={`/${locale}/wholesale`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-carbon-700)] hover:text-[var(--color-terracotta-600)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all py-2"
              >
                <span>{locale === 'hi' ? 'थोक व गठरी आपूर्ति' : 'Bale & Wholesale Supply'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Hero Visual Composition: Wine Mink Embossed + Inset Folded Square */}
        <div className="lg:col-span-6 relative">
          <FadeIn direction="up" duration={0.8}>
            <div className="relative rounded-3xl overflow-hidden bg-[var(--color-sand-200)] shadow-xl aspect-4/3 sm:aspect-5/4">
              {img0 && (
                <>
                  <Image
                    src={img0.src}
                    alt={img0.alt[locale]}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
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
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'एम्बॉस्ड मिंक और हल्के फ्लीस कंबल' : 'The Tactile Velvet Pile'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] mt-2 leading-relaxed">
              {locale === 'hi'
                ? 'हमारे कंबलों में 3D फ्लोरल नक्काशी और सजावटी बॉर्डर का काम होता है। यह सर्दी के मौसम में आरामदायक गर्माहट और खूबसूरत लुक प्रदान करता है।'
                : 'From ornate 3D floral medallion embossing on heavyweight mink blankets to mild-weather lightweight fleece, explore our seasonal bedding textures.'}
            </p>
          </div>
          <div className="w-fit self-start sm:self-auto shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3.5 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" aria-hidden="true" />
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
                  sizes="(max-width: 768px) 100vw, 400px"
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
                  sizes="(max-width: 768px) 100vw, 400px"
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

          {/* Card 3: Folded Plush Depth */}
          {img3 && (
            <StaggerItem className="flex flex-col gap-3 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-xs">
                <Image
                  src={img3.src}
                  alt={img3.alt[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'सघन फोल्ड व मोटाई' : 'Plush Folded Thickness'}
                </span>
                {img3.caption && (
                  <p className="text-xs text-[var(--color-carbon-500)] mt-0.5">
                    {img3.caption[locale]}
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
        <h3 className="font-display font-medium text-lg text-[var(--color-carbon-900)]">
          {locale === 'hi' ? 'कंबल के साइज और वजन' : 'Blanket Dimensions & Seasonal Weights'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
          {category.dimensionAvailabilityNote?.[locale] ?? ''}
        </p>
      </section>

      {/* 5. EDUCATIONAL GUIDE: CHOOSING THE RIGHT BLANKET */}
      <section className="bg-[var(--color-sand-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 sm:p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
            {locale === 'hi' ? 'कंबल चयन एवं फैब्रिक गाइड' : 'Blanket Guide & Thermal Materials'}
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
            {locale === 'hi'
              ? 'मिंक कंबल और फ्लीस कंबल में अंतर'
              : 'Understanding Embossed Mink vs. Thermal Polar Fleece'}
          </h2>
          <p className="text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {locale === 'hi'
              ? 'मध्य प्रदेश और उत्तर-पश्चिम भारत की सर्दियों के लिए उपयुक्त कंबल का चयन मौसम की तीव्रता और कमरे के तापमान पर निर्भर करता है।'
              : 'Choosing between heavy embossed mink and lightweight fleece depends on seasonal temperature drops and personal warmth preferences.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-sand-300)] shadow-sm flex flex-col gap-3">
            <h3 className="text-[var(--color-terracotta-600)] font-semibold text-base">
              {locale === 'hi' ? 'उभरे हुए मिंक कंबल (भारी सर्दी)' : 'Embossed Mink Blankets (Peak Winter)'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'घने रेशेदार रोएं (हाई-पाइल) और उभरे हुए फ्लोरल पैटर्न से तैयार। यह तेज ठंड में शरीर की गर्मी को रोककर गहरा आराम प्रदान करते हैं।'
                : 'Dense, high-pile microfibres with rich embossed floral reliefs. Provides substantial thermal retention and a luxurious velour drape for peak winter nights.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[var(--color-sand-300)] shadow-sm flex flex-col gap-3">
            <h3 className="text-[var(--color-terracotta-600)] font-semibold text-base">
              {locale === 'hi' ? 'हल्के पोलर फ्लीस कंबल' : 'Polar Fleece Blankets (Mild Winter & AC)'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'हल्के वजन, जल्दी सूखने वाले और धोने में आसान। यह हल्की ठंड, वातानुकूलित (AC) कमरों और यात्रा के लिए अत्यधिक लोकप्रिय हैं।'
                : 'Compact, quick-drying, and machine-washable. Ideal for mild seasonal transitions, air-conditioned rooms, and travel or institutional hostel use.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. EXPLORE OTHER BEDDING CATEGORIES */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
              {locale === 'hi' ? 'सम्बंधित बेडिंग श्रेणियां' : 'Complete Your Bedding'}
            </span>
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'अन्य उत्पाद संग्रह देखें' : 'Explore Related Bedding Lines'}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="text-xs sm:text-sm font-semibold text-[var(--color-terracotta-600)] hover:underline inline-flex items-center gap-1"
          >
            <span>{locale === 'hi' ? 'सभी देखें' : 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/${locale}/products/mattresses`}
            className="group p-5 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-md flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-[11px] font-mono text-[var(--color-carbon-500)] uppercase tracking-wider">
                {locale === 'hi' ? 'श्रेणी 01' : 'Category 01'}
              </span>
              <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors mt-1">
                {locale === 'hi' ? 'गद्दे व फ्लोर गद्दे' : 'Mattresses & Gaddas'}
              </h3>
              <p className="text-xs text-[var(--color-carbon-500)] mt-1 line-clamp-2">
                {locale === 'hi'
                  ? 'टफ्टेड फ्लोर गद्दे और बॉक्स्ड-एज कॉट मैट्रेस।'
                  : 'Quilted floor gaddas and framed boxed-edge mattresses.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] inline-flex items-center gap-1">
              {locale === 'hi' ? 'गद्दे देखें' : 'View mattresses'} &rarr;
            </span>
          </Link>

          <Link
            href={`/${locale}/products/pillows`}
            className="group p-5 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-md flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-[11px] font-mono text-[var(--color-carbon-500)] uppercase tracking-wider">
                {locale === 'hi' ? 'श्रेणी 02' : 'Category 02'}
              </span>
              <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors mt-1">
                {locale === 'hi' ? 'आरामदायक तकिए' : 'Bedding Pillows'}
              </h3>
              <p className="text-xs text-[var(--color-carbon-500)] mt-1 line-clamp-2">
                {locale === 'hi'
                  ? 'माइक्रोफाइबर और पॉली-फिल सपोर्ट तकिए।'
                  : 'Resilient microfibre and conjugated hollow-fill pillows.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] inline-flex items-center gap-1">
              {locale === 'hi' ? 'तकिए देखें' : 'View pillows'} &rarr;
            </span>
          </Link>

          <Link
            href={`/${locale}/products/razais`}
            className="group p-5 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-md flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-[11px] font-mono text-[var(--color-carbon-500)] uppercase tracking-wider">
                {locale === 'hi' ? 'श्रेणी 03' : 'Category 03'}
              </span>
              <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors mt-1">
                {locale === 'hi' ? 'पारंपरिक रज़ाइयां' : 'Quilted Razais'}
              </h3>
              <p className="text-xs text-[var(--color-carbon-500)] mt-1 line-clamp-2">
                {locale === 'hi'
                  ? 'सर्दियों के लिए गर्म व हल्की फ्लोरल रज़ाइयां।'
                  : 'Warm, lightweight printed & microfibre winter quilts.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] inline-flex items-center gap-1">
              {locale === 'hi' ? 'रज़ाइयां देखें' : 'View razais'} &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* 7. Editorial Enquiry / Wholesale Conversion Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[var(--color-carbon-900)] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-400)] font-semibold">
            {locale === 'hi' ? 'सीधा संपर्क' : 'Direct Factory Desk'}
          </span>
          <h3 className="font-display font-semibold text-2xl sm:text-3xl">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[var(--color-carbon-900)] hover:bg-[var(--color-warm-ivory-100)] border border-white active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none font-semibold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
            <span>{locale === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Enquire on WhatsApp'}</span>
          </a>
          <Link
            href={`/${locale}/wholesale`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all border border-white/20 min-h-[48px]"
          >
            <span>{locale === 'hi' ? 'थोक व रीसेलर्स' : 'Wholesale & Resellers'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
