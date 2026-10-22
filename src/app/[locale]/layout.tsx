import React from 'react';
import { Locale, getBaseUrl } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'hi' ? 'hi' : 'en';
  const baseUrl = getBaseUrl();

  // Truthful Schema.org LocalBusiness structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: locale === 'hi' ? 'डायमंड फाइबर' : 'Diamond Fibre',
    alternateName: 'Diamond Fibres',
    description:
      locale === 'hi'
        ? 'रतलाम (मध्य प्रदेश) में स्थित पारिवारिक बेडिंग निर्माण संस्थान। गद्दे (मैट्रेस), तकिए, रज़ाइयां और कंबल।'
        : 'Family-run bedding manufacturer in Ratlam, Madhya Pradesh since 2018. Producing mattresses (gaddas), pillows, razais, and blankets.',
    url: `${baseUrl}/${locale}`,
    telephone: '+91 7974644185',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ratlam',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    hasMap: 'https://maps.google.com/?cid=9316049051871516981',
    knowsAbout: [
      'Mattresses',
      'Gaddas',
      'Bedding Pillows',
      'Razais',
      'Blankets',
      'Wholesale Bedding Supply',
    ],
  };

  return (
    <div lang={locale} className="flex flex-col min-h-screen">
      {/* Accessible Keyboard Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--color-carbon-900)] focus:text-white focus:shadow-xl focus:rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] text-xs font-semibold"
      >
        {locale === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header locale={locale} />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer locale={locale} />
      <StickyWhatsApp locale={locale} />
    </div>
  );
}
