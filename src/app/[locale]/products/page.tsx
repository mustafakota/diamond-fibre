import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { EditorialCategoryShowcase } from '@/components/home/EditorialCategoryShowcase';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
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
    pathSegment: 'products',
    title:
      locale === 'hi'
        ? 'बेडिंग उत्पाद कैटलॉग | डायमंड फाइबर रतलाम (मध्य प्रदेश)'
        : 'Bedding Factory Products Catalogue | Diamond Fibre Ratlam',
    description:
      locale === 'hi'
        ? 'रतलाम फैक्ट्री में निर्मित 4 प्रमुख बेडिंग उत्पाद: टफ्टेड गद्दे, सपोर्ट तकिए, पारंपरिक रज़ाइयां और विंटर कंबल। रिटेल व थोक खरीदारों के लिए उपयुक्त।'
        : 'Explore our 4 core bedding categories manufactured in Ratlam: mattresses (gaddas), everyday support pillows, winter razais, and plush blankets. Factory rates.',
    ogImage: {
      url: '/images/retouched/mattresses/hero-mattress-maroon-boxed.webp',
      alt: locale === 'hi' ? 'डायमंड फाइबर उत्पाद कैटलॉग' : 'Diamond Fibre Product Collections',
    },
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const baseUrl = getBaseUrl();

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd(baseUrl, locale, [
    {
      name: locale === 'hi' ? 'उत्पाद कैटलॉग' : 'Products Catalogue',
      pathSegment: 'products',
    },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'hi'
        ? 'डायमंड फाइबर बेडिंग उत्पाद संग्रह'
        : 'Diamond Fibre Bedding Product Collections',
    description:
      locale === 'hi'
        ? 'रतलाम स्थित विनिर्माण वर्कशॉप से सीधे 4 प्रमुख बेडिंग श्रेणियां'
        : 'Four core bedding product lines manufactured directly in Ratlam, Madhya Pradesh.',
    url: `${baseUrl}/${locale}/products`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'hi' ? 'गद्दे (मैट्रेस / गद्दा)' : 'Mattresses & Floor Gaddas',
          url: `${baseUrl}/${locale}/products/mattresses`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'hi' ? 'आरामदायक तकिए' : 'Bedding Support Pillows',
          url: `${baseUrl}/${locale}/products/pillows`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: locale === 'hi' ? 'पारंपरिक रज़ाइयां' : 'Traditional & Microfibre Razais',
          url: `${baseUrl}/${locale}/products/razais`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: locale === 'hi' ? 'मुलायम कंबल' : 'Plush Mink & Fleece Blankets',
          url: `${baseUrl}/${locale}/products/blankets`,
        },
      ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-8 sm:gap-10 md:gap-14">
        {/* Editorial Header */}
        <FadeIn direction="up">
          <div className="flex flex-col gap-3 max-w-3xl">
            <Badge variant="accent" className="self-start">
              {locale === 'hi' ? 'कैटलॉग अवलोकन' : 'Collection Index'}
            </Badge>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight text-balance">
              {locale === 'hi' ? 'चार प्रमुख बेडिंग श्रेणियां' : 'Four Core Bedding Categories'}
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'रतलाम स्थित विनिर्माण वर्कशॉप से सीधे: प्रत्येक श्रेणी को विशिष्ट उपयोग, टिकाऊपन और मौसमी आराम को ध्यान में रखकर तैयार किया गया है।'
                : 'Direct from our Ratlam manufacturing workshop: each bedding category is purpose-built with dedicated filling, quilting, and edge construction.'}
            </p>
          </div>
        </FadeIn>

        <SeasonalNotice locale={locale} />

        {/* Editorial 2-Tier Category Showcase */}
        <EditorialCategoryShowcase locale={locale} hideHeader={true} />

        {/* Wholesale Link Banner */}
        <FadeIn direction="up">
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[var(--color-sand-300)] shrink-0 bg-white shadow-xs">
                <Image
                  src="/images/retouched/wholesale/wholesale-assorted-batch-stack.webp"
                  alt={
                    locale === 'hi'
                      ? 'रतलाम वर्कशॉप में तैयार गद्दों का स्टैक'
                      : 'Wholesale batch mattress inventory stacked in Ratlam'
                  }
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-[var(--color-carbon-900)]">
                  {locale === 'hi'
                    ? 'दुकानों व थोक व्यापारियों के लिए फैक्ट्री आपूर्ति'
                    : 'Wholesale & Retailer Bulk Supply from Factory'}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-carbon-600)]">
                  {locale === 'hi'
                    ? 'रीसेलर्स, होटल और फर्निशिंग स्टोर्स के लिए विशेष ट्रेड रेट और बैच पैकिंग।'
                    : 'Direct dispatch, bundle strapping, and verified trade pricing across Madhya Pradesh.'}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/wholesale`}
              className="inline-flex items-center gap-2 bg-[var(--color-carbon-900)] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[var(--color-carbon-800)] transition-all shrink-0 active:scale-[1.02] press-scale"
            >
              <span>{locale === 'hi' ? 'थोक सप्लाई देखें' : 'Explore Wholesale Supply'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
