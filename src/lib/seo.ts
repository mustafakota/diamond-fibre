import type { Metadata } from 'next';

export type Locale = 'en' | 'hi';

export const DOMAIN_PLACEHOLDER = 'https://[CONFIRMED_PRODUCTION_DOMAIN]';

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 */
export function isValidHttpUrl(stringUrl: string): boolean {
  try {
    const parsed = new URL(stringUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Checks if a domain string is an unresolved placeholder or invalid domain.
 */
export function isPlaceholderOrInvalidDomain(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  return (
    trimmed.length === 0 ||
    trimmed.includes('[CONFIRMED_PRODUCTION_DOMAIN]') ||
    trimmed.includes('[') ||
    trimmed.includes(']') ||
    trimmed.includes('example.com') ||
    !isValidHttpUrl(trimmed)
  );
}

/**
 * Resolves the canonical base URL safely:
 * - In production: strictly enforces a verified, non-placeholder domain. Throws an explicit error if missing.
 * - In development/testing: safely falls back to http://localhost:3000 if unset or placeholder.
 * Never outputs DOMAIN_PLACEHOLDER to public crawlers.
 */
export function getBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProduction = process.env.NODE_ENV === 'production';

  // Check if configured URL is localhost/local development
  const isLocalHost =
    configuredUrl && (configuredUrl.includes('localhost') || configuredUrl.includes('127.0.0.1'));

  if (isProduction && !isLocalHost) {
    if (isPlaceholderOrInvalidDomain(configuredUrl) || !isValidHttpUrl(configuredUrl || '')) {
      throw new Error(
        '[CRITICAL PRODUCTION SEO CONFIGURATION ERROR]: Production environment detected with missing or placeholder NEXT_PUBLIC_SITE_URL. ' +
          'A valid registered production domain must be configured in environment variables before deploying to production. ' +
          'The placeholder [CONFIRMED_PRODUCTION_DOMAIN] is strictly blocked from publishing.'
      );
    }
    return (configuredUrl as string).replace(/\/+$/, '');
  }

  // Development, local build testing, or CI environment fallback
  if (!configuredUrl || isPlaceholderOrInvalidDomain(configuredUrl) || !isValidHttpUrl(configuredUrl)) {
    return 'http://localhost:3000';
  }

  return configuredUrl.replace(/\/+$/, '');
}

export function buildLocalizedMetadata({
  locale,
  pathSegment,
  title,
  description,
}: {
  locale: Locale;
  pathSegment: string; // e.g. "", "products", "products/mattresses", "wholesale", "our-story", "contact"
  title: string;
  description: string;
}): Metadata {
  const baseUrl = getBaseUrl();
  const cleanSegment = pathSegment.replace(/^\/+|\/+$/g, '');

  const enUrl = cleanSegment ? `${baseUrl}/en/${cleanSegment}` : `${baseUrl}/en`;
  const hiUrl = cleanSegment ? `${baseUrl}/hi/${cleanSegment}` : `${baseUrl}/hi`;
  const currentCanonical = locale === 'hi' ? hiUrl : enUrl;

  return {
    title,
    description,
    alternates: {
      canonical: currentCanonical,
      languages: {
        en: enUrl,
        hi: hiUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: currentCanonical,
      siteName: locale === 'hi' ? 'डायमंड फाइबर' : 'Diamond Fibre',
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/logo/diamond-fibre-logo.png`,
          width: 1086,
          height: 362,
          alt: locale === 'hi' ? 'डायमंड फाइबर रतलाम' : 'Diamond Fibre Ratlam',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
