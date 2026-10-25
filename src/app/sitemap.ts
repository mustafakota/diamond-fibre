import { MetadataRoute } from 'next';
import path from 'path';
import { execSync } from 'child_process';
import { getBaseUrl } from '@/lib/seo';

/**
 * Safely resolves the latest Git commit date for a route's page component.
 * Note: This represents the latest commit date affecting the file in the repository,
 * not necessarily an exact content-modification date.
 * If Git history is unavailable, returns undefined to omit <lastmod> rather than
 * publishing misleading deployment-generated or filesystem timestamps.
 */
function getRouteLastModified(route: string): Date | undefined {
  const relPath = path.join('src', 'app', '[locale]', route, 'page.tsx');
  try {
    const gitDate = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (gitDate) {
      const parsed = new Date(gitDate);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch {
    // Git command failed or history is unavailable; omit <lastmod>
  }

  return undefined;
}

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
    const lastModified = getRouteLastModified(route);

    // English Entry
    entries.push({
      url: enUrl,
      lastModified,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route.startsWith('products') ? 0.8 : route === 'wholesale' ? 0.9 : 0.7,
    });

    // Hindi Entry
    entries.push({
      url: hiUrl,
      lastModified,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route.startsWith('products') ? 0.8 : route === 'wholesale' ? 0.9 : 0.7,
    });
  }
  return entries;
}
