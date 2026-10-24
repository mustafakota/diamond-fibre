import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = [
    '',
    'products',
    'products/mattresses',
    'products/pillows',
    'products/razais',
    'products/blankets',
    'wholesale',
    'our-story',
    'contact',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const cleanRoute = route ? `/${route}` : '';
    const enUrl = `${baseUrl}/en${cleanRoute}`;
    const hiUrl = `${baseUrl}/hi${cleanRoute}`;

    const alternateLanguages = {
      'en-IN': enUrl,
      'hi-IN': hiUrl,
      en: enUrl,
      hi: hiUrl,
      'x-default': enUrl,
    };

    // English Entry
    entries.push({
      url: enUrl,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route.startsWith('products') ? 0.8 : 0.6,
      alternates: {
        languages: alternateLanguages,
      },
    });

    // Hindi Entry
    entries.push({
      url: hiUrl,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route.startsWith('products') ? 0.8 : 0.6,
      alternates: {
        languages: alternateLanguages,
      },
    });
  }

  return entries;
}
