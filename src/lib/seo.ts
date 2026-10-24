import type { Metadata } from 'next';

export type Locale = 'en' | 'hi';

export const CANONICAL_PRODUCTION_URL = 'https://diamond-fibre.vercel.app';
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
 * - In production: defaults to the confirmed canonical URL (https://diamond-fibre.vercel.app) or verified non-placeholder NEXT_PUBLIC_SITE_URL.
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
    if (configuredUrl) {
      if (isPlaceholderOrInvalidDomain(configuredUrl) || !isValidHttpUrl(configuredUrl)) {
        throw new Error(
          '[CRITICAL PRODUCTION SEO CONFIGURATION ERROR]: Production environment detected with missing or placeholder NEXT_PUBLIC_SITE_URL. ' +
            'A valid registered production domain must be configured in environment variables before deploying to production. ' +
            'The placeholder [CONFIRMED_PRODUCTION_DOMAIN] is strictly blocked from publishing.'
        );
      }
      return configuredUrl.replace(/\/+$/, '');
    }
    return CANONICAL_PRODUCTION_URL;
  }

  // Development, local build testing, or CI environment fallback
  if (!configuredUrl || isPlaceholderOrInvalidDomain(configuredUrl) || !isValidHttpUrl(configuredUrl)) {
    return 'http://localhost:3000';
  }

  return configuredUrl.replace(/\/+$/, '');
}

export interface OpenGraphImageConfig {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export function buildLocalizedMetadata({
  locale,
  pathSegment,
  title,
  description,
  ogImage,
}: {
  locale: Locale;
  pathSegment: string; // e.g. "", "products", "products/mattresses", "wholesale", "our-story", "contact"
  title: string;
  description: string;
  ogImage?: OpenGraphImageConfig;
}): Metadata {
  const baseUrl = getBaseUrl();
  const cleanSegment = pathSegment.replace(/^\/+|\/+$/g, '');

  const enUrl = cleanSegment ? `${baseUrl}/en/${cleanSegment}` : `${baseUrl}/en`;
  const hiUrl = cleanSegment ? `${baseUrl}/hi/${cleanSegment}` : `${baseUrl}/hi`;
  const currentCanonical = locale === 'hi' ? hiUrl : enUrl;

  const defaultImage: OpenGraphImageConfig = {
    url: `${baseUrl}/images/logo/diamond-fibre-logo.png`,
    width: 1086,
    height: 362,
    alt: locale === 'hi' ? 'डायमंड फाइबर रतलाम' : 'Diamond Fibre Ratlam',
  };

  const resolvedImage = ogImage
    ? {
        url: ogImage.url.startsWith('http') ? ogImage.url : `${baseUrl}${ogImage.url.startsWith('/') ? '' : '/'}${ogImage.url}`,
        width: ogImage.width || 1200,
        height: ogImage.height || 630,
        alt: ogImage.alt || title,
      }
    : defaultImage;

  return {
    title,
    description,
    alternates: {
      canonical: currentCanonical,
      languages: {
        'en-IN': enUrl,
        'hi-IN': hiUrl,
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
      images: [resolvedImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [resolvedImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Builds valid BreadcrumbList structured data for rich SERP breadcrumb trails.
 */
export function buildBreadcrumbJsonLd(
  baseUrl: string,
  locale: Locale,
  items: Array<{ name: string; pathSegment: string }>
) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: locale === 'hi' ? 'होम' : 'Home',
      item: `${baseUrl}/${locale}`,
    },
  ];

  items.forEach((item, index) => {
    const clean = item.pathSegment.replace(/^\/+|\/+$/g, '');
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${baseUrl}/${locale}/${clean}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}
