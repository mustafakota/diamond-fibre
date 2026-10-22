import React from 'react';
import { Locale, buildLocalizedMetadata } from '@/lib/seo';
import { EditorialCategoryShowcase } from '@/components/home/EditorialCategoryShowcase';
import { SeasonalNotice } from '@/components/categories/SeasonalNotice';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';

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
        ? 'उत्पाद श्रेणियां | डायमंड फाइबर रतलाम'
        : 'Bedding Product Categories | Diamond Fibre Ratlam',
    description:
      locale === 'hi'
        ? 'रतलाम स्थित इकाई में निर्मित हमारी चार प्रमुख बेडिंग श्रेणियां: गद्दे (मैट्रेस), आरामदायक तकिए, मौसमी रज़ाइयां और मुलायम कंबल।'
        : 'Explore our four core bedding product categories manufactured in Ratlam: mattresses (gaddas), pillows, razais, and blankets.',
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10 sm:gap-14">
      {/* Editorial Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-3 max-w-3xl">
          <Badge variant="accent" className="self-start">
            {locale === 'hi' ? 'कैटलॉग अवलोकन' : 'Collection Index'}
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--color-carbon-900)] tracking-tight">
            {locale === 'hi' ? 'चार प्रमुख बेडिंग श्रेणियां' : 'Four Dedicated Bedding Disciplines'}
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
      <EditorialCategoryShowcase locale={locale} />
    </div>
  );
}
