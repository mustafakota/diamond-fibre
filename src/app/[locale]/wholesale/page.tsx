import Link from 'next/link';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata, buildBreadcrumbJsonLd, getBaseUrl } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { WholesaleForm } from '@/components/forms/WholesaleForm';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { buildWhatsAppLink, buildPhoneLink, DEFAULT_DISPLAY_PHONE } from '@/lib/whatsapp';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return buildLocalizedMetadata({
    locale,
    pathSegment: 'wholesale',
    title:
      locale === 'hi'
        ? 'थोक बेडिंग व गद्दे निर्माता रतलाम | रीसेलर्स व व्यापारी आपूर्ति | डायमंड फाइबर'
        : 'Wholesale Bedding & Mattress Manufacturer | Ratlam, MP | Diamond Fibre',
    description:
      locale === 'hi'
        ? 'बेडिंग रिटेलर्स, रीसेलर्स और संस्थागत ग्राहकों के लिए रतलाम स्थित फैक्ट्री से थोक आपूर्ति। गद्दे, तकिए, रज़ाइयां व कंबल की बल्क सप्लाई एवं पारदर्शी प्रक्रिया।'
        : 'Direct factory wholesale supply for bedding retailers, resellers, and institutions from Ratlam, Madhya Pradesh. Bulk floor gaddas, mattresses, pillows, razais, and blankets.',
    ogImage: {
      url: '/images/retouched/wholesale/wholesale-assorted-batch-stack.webp',
      alt: locale === 'hi' ? 'डायमंड फाइबर थोक आपूर्ति' : 'Diamond Fibre Wholesale Dispatch',
    },
  });
}

export default async function WholesalePage({
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
      name: locale === 'hi' ? 'थोक व रीसेलर्स' : 'Wholesale & Resellers',
      pathSegment: 'wholesale',
    },
  ]);

  const wholesalePageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name:
      locale === 'hi'
        ? 'थोक बेडिंग व गद्दे निर्माता आपूर्ति | डायमंड फाइबर रतलाम'
        : 'Wholesale Bedding & Mattress Manufacturer Supply | Diamond Fibre Ratlam',
    description: dict.wholesale.introText,
    url: `${baseUrl}/${locale}/wholesale`,
    inLanguage: locale === 'hi' ? 'hi-IN' : 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'Diamond Fibre',
      url: baseUrl,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wholesalePageJsonLd) }}
      />
      <div className="py-8 sm:py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10 sm:gap-12">
      {/* Page Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3 max-w-3xl">
          <Badge variant="accent" className="self-start">
            {locale === 'hi' ? 'व्यापार साझेदारी' : 'B2B & Reseller Supply'}
          </Badge>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-carbon-900)] text-balance">
            {dict.wholesale.title}
          </h1>
          <p className="text-sm sm:text-base font-medium text-[var(--color-terracotta-600)]">
            {dict.wholesale.subtitle}
          </p>
          <p className="text-sm sm:text-base text-[var(--color-carbon-600)] leading-relaxed">
            {dict.wholesale.introText}
          </p>
        </div>
      </FadeIn>

      {/* Main Content Grid: Form + Commercial Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Wholesale Form */}
        <div className="lg:col-span-8">
          <WholesaleForm locale={locale} />
        </div>

        {/* Right Column: Direct Contact & Verified Capabilities */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Direct Sales Desk Card */}
          <FadeIn direction="up" delay={0.1}>
            <div className="bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <h3 className="text-[var(--color-carbon-900)] font-display font-medium text-lg">
                {locale === 'hi' ? 'तत्काल कमर्शियल संपर्क' : 'Direct B2B Desk'}
              </h3>
              <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
                {locale === 'hi'
                  ? 'यदि आपकी मांग समय-संवेदनशील है या आप सीधे चर्चा करना चाहते हैं, तो हमारी टीम से संपर्क करें।'
                  : 'For time-sensitive commercial requirements or direct discussions, connect directly with our sales team.'}
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-sand-300)]">
                <a
                  href={buildWhatsAppLink(
                    locale === 'hi'
                      ? 'नमस्ते डायमंड फाइबर, मैं अपनी दुकान/व्यापार के लिए थोक आपूर्ति के बारे में बात करना चाहता हूँ।'
                      : 'Hello Diamond Fibre, I would like to discuss wholesale supply for my business.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)] border border-[var(--color-carbon-800)] active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none px-4 py-2.5 rounded-xl font-semibold text-xs transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-500)]"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{locale === 'hi' ? 'व्हाट्सएप B2B चैट' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href={buildPhoneLink()}
                  className="flex items-center justify-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 active:scale-[1.02] press-scale duration-150 ease-out motion-reduce:transform-none px-4 py-2.5 rounded-full font-semibold text-xs transition-all min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-[var(--color-carbon-600)]" />
                  <span>{DEFAULT_DISPLAY_PHONE}</span>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Confirmed Capabilities Checklist */}
          <FadeIn direction="up" delay={0.2}>
            <div className="bg-[var(--color-sand-300)]/30 border border-[var(--color-sand-400)]/60 rounded-3xl p-6 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-800)]">
                {locale === 'hi' ? 'सत्यापित निर्माण क्षमताएं' : 'Verified Capabilities'}
              </span>
              <ul className="flex flex-col gap-2.5 text-xs text-[var(--color-carbon-800)]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-600)] shrink-0 mt-1.5" aria-hidden="true" />
                  <span>
                    {locale === 'hi'
                      ? 'रतलाम में स्थित स्वयं की प्रत्यक्ष निर्माण इकाई'
                      : 'Own dedicated manufacturing unit in Ratlam, MP'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-600)] shrink-0 mt-1.5" aria-hidden="true" />
                  <span>
                    {locale === 'hi'
                      ? 'सिलाई, भराई, मशीन क्विल्टिंग और पैकिंग'
                      : 'Stitching, filling, quilting, and bulk packing operations'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-600)] shrink-0 mt-1.5" aria-hidden="true" />
                  <span>
                    {locale === 'hi'
                      ? 'गद्दे, मैट्रेस, तकिए, रज़ाइयां और कंबल की आपूर्ति'
                      : 'Supply across all 4 core bedding categories'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-600)] shrink-0 mt-1.5" aria-hidden="true" />
                  <span>
                    {locale === 'hi'
                      ? 'कस्टम साइज व प्राइवेट लेबलिंग (ऑर्डर पुष्टि के अधीन)'
                      : 'Custom sizing & private labeling (subject to operational confirmation)'}
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Packaging & Dispatch Showcase */}
          <FadeIn direction="up" delay={0.3}>
            <div className="bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <h3 className="text-[var(--color-carbon-900)] font-display font-medium text-sm">
                {locale === 'hi' ? 'कमर्शियल पैकिंग व डिस्पैच' : 'Commercial Packaging & Dispatch'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-white">
                  <Image
                    src="/images/retouched/wholesale/wholesale-assorted-batch-stack.webp"
                    alt={
                      locale === 'hi'
                        ? 'रतलाम वर्कशॉप में तैयार विभिन्न मौसमी प्रिंट्स के गद्दे'
                        : 'Assorted seasonal batch mattress stacks in Ratlam workshop'
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-white">
                  <Image
                    src="/images/retouched/wholesale/wholesale-pillow-packs-strapped.webp"
                    alt={
                      locale === 'hi'
                        ? 'थोक आपूर्ति के लिए स्ट्रैप से बंधा 4 तकियों का कमर्शियल पैक'
                        : 'Commercial strapped bundle of 4 pillows for wholesale dispatch'
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[var(--color-carbon-600)] italic leading-tight">
                {locale === 'hi'
                  ? '*थोक ऑर्डर्स के लिए मजबूत प्लास्टिक रैपिंग और स्ट्रैपिंग से सुरक्षित पैकिंग।'
                  : '*Wholesale orders bundled and protective-wrapped for transit across regional routes.'}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 4-Step Wholesale Procurement Process */}
      <section className="bg-white border border-[var(--color-sand-300)] rounded-3xl p-6 sm:p-10 flex flex-col gap-8 shadow-xs">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
            {locale === 'hi' ? 'व्यापार प्रक्रिया' : 'Transparent Procurement Workflow'}
          </span>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-carbon-900)]">
            {locale === 'hi' ? 'थोक आपूर्ति प्रक्रिया: पूछताछ से डिलीवरी तक' : 'How Direct Bedding Supply Works'}
          </h2>
          <p className="text-sm text-[var(--color-carbon-600)] leading-relaxed">
            {locale === 'hi'
              ? 'रतलाम वर्कशॉप से सीधे आपूर्ति के लिए हमारी चार-चरणीय पारदर्शी प्रणाली, जिससे रीसेलर्स को समय पर माल और सटीक गुणवत्ता मिलती है।'
              : 'Our straightforward four-step supply workflow connects your shop or institutional property directly with factory-floor batches.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]">
            <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta-500)] text-white font-mono font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'मांग व पूछताछ' : 'Enquiry Submission'}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'ऊपर दिए गए फॉर्म या व्हाट्सएप के माध्यम से अपनी अनुमानित मात्रा, उत्पाद श्रेणी और गंतव्य शहर बताएं।'
                : 'Submit required quantities, target product categories, and destination city via the form or WhatsApp.'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]">
            <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta-500)] text-white font-mono font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'दर व बैच पुष्टि' : 'Quotation & Specs'}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'हमारी सेल्स टीम वर्तमान फैब्रिक प्रिंट्स, मोटाई, साइज और पारदर्शी थोक दरों की लिखित कोटेशन साझा करती है।'
                : 'Our sales desk provides transparent unit pricing, available seasonal prints, dimensions, and packing options.'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]">
            <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta-500)] text-white font-mono font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'उत्पादन व बंडलिंग' : 'Batch Bundling'}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'ऑर्डर की पुष्टि के बाद माल को रतलाम वर्कशॉप में सिलाई-जांच के साथ बंडलों में सुरक्षित प्लास्टिक स्ट्रैपिंग के साथ पैक किया जाता है।'
                : 'Products are quality-inspected, bundled, strapped, and heavy-poly wrapped for transport durability.'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)]">
            <span className="w-8 h-8 rounded-full bg-[var(--color-terracotta-500)] text-white font-mono font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="font-display font-medium text-base text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'क्षेत्रीय ट्रांसपोर्ट डिस्पैच' : 'Regional Dispatch'}
            </h3>
            <p className="text-xs text-[var(--color-carbon-600)] leading-relaxed">
              {locale === 'hi'
                ? 'रतलाम जंक्शन से मालवा, मध्य प्रदेश, गुजरात व राजस्थान के प्रमुख ट्रांसपोर्ट मार्गों पर तेज व सुरक्षित माल ढुलाई।'
                : 'Dispatched via established transport logistics connecting Ratlam across Madhya Pradesh, Gujarat, and Rajasthan.'}
            </p>
          </div>
        </div>
      </section>

      {/* Review Product Lines Before Enquiring */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-carbon-500)] font-semibold">
              {locale === 'hi' ? 'कैटलॉग समीक्षा' : 'Catalogue Review'}
            </span>
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'पूछताछ से पहले उत्पाद विनिर्देश देखें' : 'Review Product Specifications'}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="text-xs sm:text-sm font-semibold text-[var(--color-terracotta-600)] hover:underline inline-flex items-center gap-1"
          >
            <span>{locale === 'hi' ? 'पूरा कैटलॉग' : 'Full catalogue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/products/mattresses`}
            className="p-4 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-sm flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'गद्दे (मैट्रेस)' : 'Mattresses & Gaddas'}
            </span>
            <span className="text-[11px] text-[var(--color-carbon-500)]">
              {locale === 'hi' ? '3x6, 4x6, 6x6 फीट' : '3x6, 4x6, 6x6 ft'}
            </span>
          </Link>

          <Link
            href={`/${locale}/products/pillows`}
            className="p-4 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-sm flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'तकिए (पिलो)' : 'Bedding Pillows'}
            </span>
            <span className="text-[11px] text-[var(--color-carbon-500)]">
              {locale === 'hi' ? 'सिंगल व 4-पैक बंडल' : 'Single & 4-pack lots'}
            </span>
          </Link>

          <Link
            href={`/${locale}/products/razais`}
            className="p-4 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-sm flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'रज़ाइयां (क्विल्ट्स)' : 'Quilted Razais'}
            </span>
            <span className="text-[11px] text-[var(--color-carbon-500)]">
              {locale === 'hi' ? 'फ्लोरल व ब्राइडल प्रिंट्स' : 'Floral & bridal prints'}
            </span>
          </Link>

          <Link
            href={`/${locale}/products/blankets`}
            className="p-4 rounded-2xl bg-white border border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-400)] transition-all hover:shadow-sm flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-[var(--color-carbon-900)]">
              {locale === 'hi' ? 'कंबल (ब्लैंकेट्स)' : 'Warm Blankets'}
            </span>
            <span className="text-[11px] text-[var(--color-carbon-500)]">
              {locale === 'hi' ? 'मिंक व पोलर फ्लीस' : 'Mink & polar fleece'}
            </span>
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
