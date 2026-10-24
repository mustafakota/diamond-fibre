import React from 'react';
import { Locale, getBaseUrl } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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

  // Truthful Schema.org LocalBusiness & Manufacturer structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HomeGoodsStore', 'Manufacturer'],
    name: locale === 'hi' ? 'डायमंड फाइबर' : 'Diamond Fibre',
    alternateName: 'Diamond Fibres',
    description:
      locale === 'hi'
        ? 'रतलाम (मध्य प्रदेश) में स्थित बेडिंग निर्माता। गद्दे (मैट्रेस), तकिए, रज़ाइयां और कंबल का प्रत्यक्ष विनिर्माण।'
        : 'Bedding manufacturer in Ratlam, Madhya Pradesh. Direct manufacturing of mattresses (gaddas), pillows, razais, and blankets.',
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/images/logo/diamond-fibre-logo.png`,
    image: `${baseUrl}/images/logo/diamond-fibre-logo.png`,
    telephone: '+91 7974644185',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ratlam',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ratlam' },
      { '@type': 'AdministrativeArea', name: 'Madhya Pradesh' },
      { '@type': 'Country', name: 'India' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 7974644185',
      contactType: 'sales and wholesale enquiries',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
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
    <div id="top" tabIndex={-1} lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} className="flex flex-col min-h-screen outline-none">
      {/* Synchronize HTML document element language for crawlers and assistive technologies */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${locale === 'hi' ? 'hi-IN' : 'en-IN'}';`,
        }}
      />

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
    </div>
  );
}
