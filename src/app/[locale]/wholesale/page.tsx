import React from 'react';
import Image from 'next/image';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { getDictionary } from '@/content/dictionaries';
import { WholesaleForm } from '@/components/forms/WholesaleForm';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { buildWhatsAppLink, buildPhoneLink, PROVISIONAL_DISPLAY_PHONE } from '@/lib/whatsapp';
import { MessageCircle, Phone, Building2, CheckCircle2, Boxes } from 'lucide-react';

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
        ? 'थोक व रीसेलर्स | डायमंड फाइबर रतलाम'
        : 'Wholesale & Resellers | Diamond Fibre Ratlam',
    description:
      locale === 'hi'
        ? 'दुकानदारों, थोक विक्रेताओं और रीसेलर्स के लिए फैक्ट्री सप्लाई। गद्दे (मैट्रेस), तकिए, रज़ाइयां और कंबल।'
        : 'Bedding manufacturing supply for retailers, wholesalers, and resellers across mattresses (gaddas), pillows, razais, and blankets.',
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

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12">
      {/* Page Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3 max-w-3xl">
          <Badge variant="accent" className="self-start">
            {locale === 'hi' ? 'व्यापार साझेदारी' : 'B2B & Reseller Supply'}
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-carbon-900)]">
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
          <FadeIn direction="left" delay={0.1}>
            <div className="bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[var(--color-carbon-900)] font-display font-bold text-lg">
                <Building2 className="w-5 h-5 text-[var(--color-terracotta-500)]" />
                <span>{locale === 'hi' ? 'तत्काल कमर्शियल संपर्क' : 'Direct B2B Desk'}</span>
              </div>
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
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D] px-4 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{locale === 'hi' ? 'व्हाट्सएप B2B चैट' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href={buildPhoneLink()}
                  className="flex items-center justify-center gap-2 border border-[var(--color-sand-400)] text-[var(--color-carbon-900)] hover:bg-[var(--color-sand-300)]/40 px-4 py-2.5 rounded-full font-semibold text-xs transition-colors min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-[var(--color-carbon-600)]" />
                  <span>{PROVISIONAL_DISPLAY_PHONE} (Provisional)</span>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Confirmed Capabilities Checklist */}
          <FadeIn direction="left" delay={0.2}>
            <div className="bg-[var(--color-sand-300)]/30 border border-[var(--color-sand-400)]/60 rounded-3xl p-6 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-800)]">
                {locale === 'hi' ? 'सत्यापित निर्माण क्षमताएं' : 'Verified Capabilities'}
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[var(--color-carbon-800)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {locale === 'hi'
                      ? '2018 से रतलाम में स्थित स्वयं की निर्माण इकाई'
                      : 'Own manufacturing unit in Ratlam, MP since 2018'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {locale === 'hi'
                      ? 'सिलाई, भराई, मशीन क्विल्टिंग और पैकिंग'
                      : 'Stitching, filling, quilting, and bulk packing operations'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {locale === 'hi'
                      ? 'गद्दे, मैट्रेस, तकिए, रज़ाइयां और कंबल की आपूर्ति'
                      : 'Supply across all 5 core bedding categories'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
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
          <FadeIn direction="left" delay={0.3}>
            <div className="bg-[var(--color-warm-ivory-100)] border border-[var(--color-sand-300)] rounded-3xl p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[var(--color-carbon-900)] font-display font-bold text-sm">
                <Boxes className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                <span>{locale === 'hi' ? 'कमर्शियल पैकिंग व डिस्पैच' : 'Commercial Packaging & Dispatch'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-sand-300)] bg-white">
                  <Image
                    src="/images/wholesale/wholesale-assorted-batch-stack.webp"
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
                    src="/images/wholesale/wholesale-pillow-packs-strapped.webp"
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
    </div>
  );
}
