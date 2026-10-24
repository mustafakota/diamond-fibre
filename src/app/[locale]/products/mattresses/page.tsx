import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { CATEGORIES_DATA } from '@/content/catalog';
import { SpecTable } from '@/components/categories/SpecTable';
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
    pathSegment: 'products/mattresses',
    title:
      locale === 'hi'
        ? 'गद्दे व गद्दा निर्माता रतलाम | डायमंड फाइबर मध्य प्रदेश'
        : 'Mattress & Gadda Manufacturer in Ratlam | Diamond Fibre MP',
    description:
      locale === 'hi'
        ? 'रतलाम स्थित वर्कशॉप में निर्मित पारंपरिक टफ्टेड गद्दे और बॉक्स्ड-एज मैट्रेस। 3x6, 4x6 और 6x6 फीट मानक मापों में उपलब्ध। थोक व रिटेल आपूर्ति।'
        : 'Quilted floor gaddas and boxed-edge bed mattresses manufactured in Ratlam. Standard 3x6, 4x6, and 6x6 ft sizes with reinforced border piping and deep tufting.',
    ogImage: {
      url: '/images/retouched/mattresses/hero-mattress-maroon-boxed.webp',
      alt: locale === 'hi' ? 'डायमंड फाइबर गद्दे एवं मैट्रेस' : 'Diamond Fibre Mattresses and Gaddas',
    },
  });
}

export default async function MattressesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const category = CATEGORIES_DATA.mattresses;
  const baseUrl = getBaseUrl();

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd(baseUrl, locale, [
    {
      name: locale === 'hi' ? 'उत्पाद' : 'Products',
      pathSegment: 'products',
    },
    {
      name: locale === 'hi' ? 'गद्दे (मैट्रेस / गद्दा)' : 'Mattresses & Gaddas',
      pathSegment: 'products/mattresses',
    },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'hi'
        ? 'गद्दे व फ्लोर गद्दे संग्रह | डायमंड फाइबर रतलाम'
        : 'Mattresses & Quilted Floor Gaddas Collection | Diamond Fibre Ratlam',
    description: category.overview[locale],
    url: `${baseUrl}/${locale}/products/mattresses`,
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

  // Genuine photographs consolidated from both mattress & gadda workshop runs
  const gaddaSage = images[0];       // Sage botanical quilted gadda
  const mattressMaroon = images[1];   // Maroon boxed-edge mattress
  const gaddaRose = images[2];       // Rose floral tufted profile
  const mattressStacked = images[3];  // Stacked boxed sidewalls
  const gaddaGeo = images[4];        // Starburst geo quilted gadda
  const gaddaTartan = images[6];     // Red tartan plaid profile
  const mattressAssorted = images[7]; // Assorted showroom stack
  const gaddaDustyRose = images[8];  // Dusty rose corner detail
  const crimsonPaisley = images[9];  // Crimson Winter Paisley mattress
  const boundPlaid = images[10];     // Classic Bound Plaid mattress

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
      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10 sm:gap-14 md:gap-20">
      {/* 1. ARCHITECTURAL EDITORIAL HERO */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
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
              <p className="text-base sm:text-lg font-medium text-[var(--color-terracotta-600)] mt-1 text-balance">
                {category.tagline[locale]}
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
                {category.overview[locale]}
              </p>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.3} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-carbon-700)] hover:text-[var(--color-terracotta-600)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none transition-all py-2 px-3"
            >
              <span>{locale === 'hi' ? 'थोक सप्लाई' : 'Bulk Supply'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>

        {/* Dual Flagship Panoramic: Boxed-Edge Bed Mattress & Traditional Quilted Gadda */}
        <FadeIn direction="up" delay={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Boxed-Edge Bed Mattress Card */}
            {mattressMaroon && (
              <div className="relative rounded-3xl overflow-hidden bg-[var(--color-sand-200)] shadow-lg aspect-16/10 border border-[var(--color-sand-300)] group">
                <Image
                  src={mattressMaroon.src}
                  alt={mattressMaroon.alt[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-carbon-950)]/75 via-[var(--color-carbon-950)]/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1 text-white">
                  <span className="inline-block text-[11px] uppercase tracking-wider font-mono bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-md self-start">
                    {locale === 'hi' ? 'बॉक्स्ड-एज बेड मैट्रेस' : 'Boxed-Edge Bed Mattress'}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {mattressMaroon.caption ? mattressMaroon.caption[locale] : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Quilted Floor Gadda Card */}
            {gaddaSage && (
              <div className="relative rounded-3xl overflow-hidden bg-[var(--color-sand-200)] shadow-lg aspect-16/10 border border-[var(--color-sand-300)] group">
                <Image
                  src={gaddaSage.src}
                  alt={gaddaSage.alt[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-carbon-950)]/75 via-[var(--color-carbon-950)]/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1 text-white">
                  <span className="inline-block text-[11px] uppercase tracking-wider font-mono bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-md self-start">
                    {locale === 'hi' ? 'पारंपरिक रजाईदार गद्दे' : 'Quilted Floor Gadda'}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {gaddaSage.caption ? gaddaSage.caption[locale] : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* 2. STYLE 1: STRUCTURED BOXED-EDGE BED MATTRESSES */}
      <section className="bg-[var(--color-warm-ivory-100)] rounded-3xl p-6 sm:p-10 border border-[var(--color-sand-300)] flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'शैली 01' : 'Style 01'}
            </span>
            <span className="text-xs text-[var(--color-carbon-400)]">•</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-carbon-600)]">
              {locale === 'hi' ? 'पलंग व बेड फ्रेम के लिए' : 'Bed Frame & Platform Suitability'}
            </span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
            {locale === 'hi' ? 'बॉक्स्ड-एज मैट्रेस (मजबूत साइडवॉल व टफ्टिंग)' : 'Boxed-Edge Bed Mattresses'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {locale === 'hi'
              ? 'आधुनिक घरेलू पलंगों के लिए तैयार किए जाने वाले बॉक्स्ड-एज मैट्रेस। पाइपिंग बॉर्डर और मजबूत साइडवॉल किनारों पर बैठने पर भी मैट्रेस को आकार में बनाए रखते हैं।'
              : 'Constructed for standard domestic bed frames. Reinforced tape-edge piping and structured sidewalls provide stable edge support and long-lasting shape retention.'}
          </p>
        </div>

        {/* Style 1 Highlight: Stacked Sidewalls Construction */}
        {mattressStacked && (
          <FadeIn direction="up" className="flex flex-col gap-4 max-w-2xl">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-sm">
              <Image
                src={mattressStacked.src}
                alt={mattressStacked.alt[locale]}
                fill
                sizes="(max-width: 1024px) 100vw, 672px"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-[var(--color-carbon-950)]/75 backdrop-blur-md text-white px-3 py-1 rounded-md text-[11px] font-mono">
                {locale === 'hi' ? 'मल्टी-टियर स्टैकिंग' : 'Stacked Profile'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-300)] flex flex-col gap-1">
              <span className="text-xs font-bold block text-[var(--color-carbon-900)]">
                {locale === 'hi' ? 'साइडवॉल पाइपिंग बाइंडिंग' : 'Reinforced Sidewall Construction'}
              </span>
              {mattressStacked.caption && (
                <p className="text-xs text-[var(--color-carbon-600)]">
                  {mattressStacked.caption[locale]}
                </p>
              )}
            </div>
          </FadeIn>
        )}
      </section>

      {/* 3. STYLE 2: TRADITIONAL QUILTED FLOOR & DIWAN GADDAS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[var(--color-sand-300)] flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'शैली 02' : 'Style 02'}
            </span>
            <span className="text-xs text-[var(--color-carbon-400)]">•</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-carbon-600)]">
              {locale === 'hi' ? 'फर्श, दीवान व रोलिंग उपयोग' : 'Floor, Diwan & Rollable Comfort'}
            </span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
            {locale === 'hi' ? 'पारंपरिक रजाईदार गद्दे (क्विल्टेड व टफ्टेड)' : 'Traditional Quilted Floor Gaddas'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {locale === 'hi'
              ? 'फर्श और दीवान पर बिछाने के लिए सुगम, मुड़ने वाले और प्राकृतिक भराई से तैयार गद्दे। सघन क्विल्टिंग और टफ्टिंग भराई को वर्षों तक एक समान रखती है।'
              : 'Flexible, rollable, and generously filled quilted gaddas for floor seating, diwans, and versatile everyday sleeping. Dense channel quilting keeps internal fiber layers uniformly distributed.'}
          </p>
        </div>

        {/* 2-Column Split: Tufted Profile vs Geometric Flat View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {gaddaRose && (
            <FadeIn direction="up" className="flex flex-col gap-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-sm">
                <Image
                  src={gaddaRose.src}
                  alt={gaddaRose.alt[locale]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[var(--color-carbon-950)]/75 backdrop-blur-md text-white px-3 py-1 rounded-md text-[11px] font-mono">
                  {locale === 'hi' ? 'गहन टफ्टिंग प्रोफाइल' : 'Tufted Layer Profile'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1">
                <span className="text-xs font-bold block text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'मल्टी-लेयर टफ्टिंग व मोटाई' : 'Multi-Layer Thickness & Piped Rim'}
                </span>
                {gaddaRose.caption && (
                  <p className="text-xs text-[var(--color-carbon-600)]">
                    {gaddaRose.caption[locale]}
                  </p>
                )}
              </div>
            </FadeIn>
          )}

          {gaddaGeo && (
            <FadeIn direction="up" className="flex flex-col gap-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[var(--color-sand-200)] border border-[var(--color-sand-300)] shadow-sm">
                <Image
                  src={gaddaGeo.src}
                  alt={gaddaGeo.alt[locale]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[var(--color-carbon-950)]/75 backdrop-blur-md text-white px-3 py-1 rounded-md text-[11px] font-mono">
                  {locale === 'hi' ? 'सघन क्विल्टिंग पैटर्न' : 'Channel Quilting'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col gap-1">
                <span className="text-xs font-bold block text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'आरामदायक समतल सतह' : 'Even Distribution & Surface Support'}
                </span>
                {gaddaGeo.caption && (
                  <p className="text-xs text-[var(--color-carbon-600)]">
                    {gaddaGeo.caption[locale]}
                  </p>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* 4. GENUINE BATCH GALLERY: ROTATING COVERS & DISPATCH READY LOTS */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-terracotta-600)] font-semibold">
              {locale === 'hi' ? 'सीजनल फैब्रिक गैलरी' : 'Seasonal Fabric Batch Gallery'}
            </span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)] mt-1">
              {locale === 'hi' ? 'रतलाम वर्कशॉप से वास्तविक उत्पादन' : 'Genuine Workshop Batch Samples'}
            </h2>
          </div>
          <div className="w-fit self-start sm:self-auto shrink-0 flex items-center gap-2 text-xs font-medium text-[var(--color-carbon-700)] bg-white px-3.5 py-1.5 rounded-full border border-[var(--color-sand-300)]">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" aria-hidden="true" />
            <span>{locale === 'hi' ? '100% प्रामाणिक फोटोग्राफी' : '100% Genuine Photography'}</span>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tartan Plaid Gadda */}
          {gaddaTartan && (
            <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={gaddaTartan.src}
                  alt={gaddaTartan.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-1">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'क्लासिक टार्टन चेक्स' : 'Classic Tartan Plaid'}
                </span>
                {gaddaTartan.caption && (
                  <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                    {gaddaTartan.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Dusty Rose Corner */}
          {gaddaDustyRose && (
            <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={gaddaDustyRose.src}
                  alt={gaddaDustyRose.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-1">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'डायमंड क्विल्टेड कॉर्नर' : 'Diamond Tufted Corner'}
                </span>
                {gaddaDustyRose.caption && (
                  <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                    {gaddaDustyRose.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Crimson Winter Paisley */}
          {crimsonPaisley && (
            <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={crimsonPaisley.src}
                  alt={crimsonPaisley.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-1">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'विंटर पैस्ले फ्लोरल' : 'Crimson Winter Paisley'}
                </span>
                {crimsonPaisley.caption && (
                  <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                    {crimsonPaisley.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Classic Bound Plaid */}
          {boundPlaid && (
            <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={boundPlaid.src}
                  alt={boundPlaid.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-1">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'क्लासिक चेक्स व लाइनिंग' : 'Classic Bound Plaid'}
                </span>
                {boundPlaid.caption && (
                  <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                    {boundPlaid.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Assorted Showroom Stack */}
          {mattressAssorted && (
            <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
                <Image
                  src={mattressAssorted.src}
                  alt={mattressAssorted.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-1">
                <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                  {locale === 'hi' ? 'विभिन्न मौसमी प्रिंट्स' : 'Assorted Seasonal Batch'}
                </span>
                {mattressAssorted.caption && (
                  <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                    {mattressAssorted.caption[locale]}
                  </p>
                )}
              </div>
            </StaggerItem>
          )}

          {/* Warehouse Lot Stack */}
          <StaggerItem className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-[var(--color-sand-300)] shadow-xs">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[var(--color-sand-200)]">
              <Image
                src="/images/retouched/mattresses/mattress-room-stacked.webp"
                alt={locale === 'hi' ? 'गोदाम में डिस्पैच के लिए तैयार स्टैक' : 'Warehouse batch lot ready for dispatch'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-1">
              <span className="text-xs font-bold text-[var(--color-carbon-900)]">
                {locale === 'hi' ? 'थोक डिस्पैच लॉट' : 'Wholesale Dispatch Lot'}
              </span>
              <p className="text-[11px] text-[var(--color-carbon-500)] mt-0.5 line-clamp-2">
                {locale === 'hi'
                  ? 'दुकानदारों और संस्थागत खरीदारों के लिए तैयार लॉट्स।'
                  : 'Batch inventory ready for retailer dispatch from Ratlam.'}
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 5. SEASONAL DESIGNS NOTICE */}
      <SeasonalNotice locale={locale} />

      {/* 6. CONFIRMED BASELINE DIMENSIONS TABLE */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
            {locale === 'hi' ? 'मानक माप' : 'Dimensions'}
          </span>
          <h2 className="font-display font-semibold text-2xl text-[var(--color-carbon-900)]">
            {locale === 'hi' ? 'सत्यापित मानक माप' : 'Confirmed Baseline Dimensions'}
          </h2>
        </div>
        <SpecTable
          dimensions={category.confirmedDimensions}
          availabilityNote={category.dimensionAvailabilityNote}
          locale={locale}
        />
      </section>

      {/* 7. EDUCATIONAL GUIDE: FLOOR GADDAS VS BOXED MATTRESSES */}
      <section className="bg-[var(--color-sand-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 sm:p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
            {locale === 'hi' ? 'खरीददार गाइड एवं विनिर्माण अंतर' : 'Buyer Guide & Construction Types'}
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
            {locale === 'hi'
              ? 'फ्लोर गद्दे और बॉक्स्ड-एज मैट्रेस में अंतर'
              : 'Understanding Quilted Floor Gaddas vs. Boxed-Edge Mattresses'}
          </h2>
          <p className="text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {locale === 'hi'
              ? 'रतलाम वर्कशॉप में हम दो प्रमुख प्रारूप तैयार करते हैं। अपनी दैनिक जरूरत, चारपाई, दीवान या बेड फ्रेम के अनुसार सही विकल्प चुनें।'
              : 'At our Ratlam workshop, we produce both traditional tufted floor gaddas and structured boxed-edge bed mattresses. Here is how they compare:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-sand-300)] shadow-sm flex flex-col gap-3">
            <h3 className="text-[var(--color-terracotta-600)] font-semibold text-base">
              {locale === 'hi' ? 'पारंपरिक क्विल्टेड फ्लोर गद्दे' : 'Quilted Floor Gaddas (Traditional)'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'गहरे बटन-टफ्टिंग और घनी सिलाई से युक्त ये गद्दे जमीन, चारपाई या दीवान पर बिछाने के लिए सर्वोत्तम हैं। जरूरत पड़ने पर इन्हें आसानी से मोड़कर या रोल करके रखा जा सकता है।'
                : 'Engineered with deep button-tufting and dense perimeter stitching. Ideal for floor seating, diwans, charpais, or guest bedding, offering rollable flexibility without losing shape.'}
            </p>
            <ul className="text-xs text-[var(--color-carbon-500)] space-y-1.5 pt-2 border-t border-[var(--color-sand-200)]">
              <li>• {locale === 'hi' ? 'लचीला और रोल करने में आसान' : 'Easy to roll, store, and transport'}</li>
              <li>• {locale === 'hi' ? 'पारंपरिक भारतीय घरों और मेहमानों के लिए आदर्श' : 'Popular for Indian floor seating & diwans'}</li>
              <li>• {locale === 'hi' ? '3x6 व 4x6 फीट में सर्वाधिक मांग' : 'Highest demand in 3x6 ft and 4x6 ft sizes'}</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[var(--color-sand-300)] shadow-sm flex flex-col gap-3">
            <h3 className="text-[var(--color-terracotta-600)] font-semibold text-base">
              {locale === 'hi' ? 'बॉक्स्ड-एज कॉट/बेड मैट्रेस' : 'Boxed-Edge Bed Mattresses'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'चारों तरफ मजबूत पाइपिंग और साइडवॉल बॉर्डर के साथ निर्मित। यह आधुनिक बेड और कॉट फ्रेम पर स्थिर रहता है और किनारों को झुकने से बचाता है।'
                : 'Constructed with a structured perimeter sidewall and reinforced piping tape. Designed specifically to sit firmly inside wooden or metal bed frames without edge-sagging.'}
            </p>
            <ul className="text-xs text-[var(--color-carbon-500)] space-y-1.5 pt-2 border-t border-[var(--color-sand-200)]">
              <li>• {locale === 'hi' ? 'मजबूत साइडवॉल और स्थिर आकार' : 'Vertical structured walls prevent edge roll-off'}</li>
              <li>• {locale === 'hi' ? 'आधुनिक डबल और किंग-साइज बेड के लिए उपयुक्त' : 'Designed for double beds & cot platforms'}</li>
              <li>• {locale === 'hi' ? '6x6 फीट व कस्टम मोटाई में उपलब्ध' : 'Standard 6x6 ft and customized wholesale lots'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. EXPLORE OTHER BEDDING CATEGORIES */}
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

          <Link
            href={`/${locale}/products/blankets`}
            className="group p-5 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-md flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-[11px] font-mono text-[var(--color-carbon-500)] uppercase tracking-wider">
                {locale === 'hi' ? 'श्रेणी 04' : 'Category 04'}
              </span>
              <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors mt-1">
                {locale === 'hi' ? 'मुलायम कंबल' : 'Mink & Fleece Blankets'}
              </h3>
              <p className="text-xs text-[var(--color-carbon-500)] mt-1 line-clamp-2">
                {locale === 'hi'
                  ? 'शानदार मिंक और पोलर फ्लीस कंबल।'
                  : 'Single & double bed embossed plush blankets.'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-terracotta-600)] inline-flex items-center gap-1">
              {locale === 'hi' ? 'कंबल देखें' : 'View blankets'} &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* 9. EDITORIAL ENQUIRY & WHOLESALE BANNER */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[var(--color-carbon-900)] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-terracotta-400)] font-semibold">
            {locale === 'hi' ? 'सेल्स डेस्क से सीधा संपर्क' : 'Direct Factory Desk'}
          </span>
          <h3 className="font-display font-semibold text-2xl sm:text-3xl">
            {locale === 'hi'
              ? 'गद्दे (मैट्रेस) के विकल्पों व कीमतों के लिए पूछें'
              : 'Enquire About Mattress & Gadda Options'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-carbon-300)] leading-relaxed">
            {locale === 'hi'
              ? 'उपलब्ध मोटाई, मॉडल, साइज और डिलीवरी की जानकारी के लिए रतलाम सेल्स टीम से संपर्क करें।'
              : 'Contact our sales desk for current model options, custom thickness variants, and dispatch feasibility.'}
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
