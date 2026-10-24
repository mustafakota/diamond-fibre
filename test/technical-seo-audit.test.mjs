import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildLocalizedMetadata, CANONICAL_PRODUCTION_URL } from '../src/lib/seo.ts';

const ROOT_DIR = process.cwd();

test('Technical SEO: sitemap.ts configuration and canonical rules', () => {
  const sitemapPath = path.join(ROOT_DIR, 'src', 'app', 'sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Must not include redirected legacy routes
  assert.ok(!sitemapContent.includes("'products/gaddas'"), 'Sitemap must not contain legacy redirected gaddas route');

  // Must include all 9 core routes (which generate 18 URLs: 9 EN + 9 HI)
  const expectedRoutes = [
    "''",
    "'products'",
    "'products/mattresses'",
    "'products/pillows'",
    "'products/razais'",
    "'products/blankets'",
    "'wholesale'",
    "'our-story'",
    "'contact'",
  ];
  for (const r of expectedRoutes) {
    assert.ok(sitemapContent.includes(r), `Sitemap must include route ${r}`);
  }

  // Must include en-IN and hi-IN in alternates
  assert.match(sitemapContent, /'en-IN':\s*enUrl/, 'Sitemap alternates must include en-IN');
  assert.match(sitemapContent, /'hi-IN':\s*hiUrl/, 'Sitemap alternates must include hi-IN');
  assert.match(sitemapContent, /'x-default':\s*enUrl/, 'Sitemap alternates must include x-default');

  // Must avoid fabricated dynamic lastModified
  assert.ok(!sitemapContent.includes('new Date().toISOString()'), 'Sitemap must avoid fabricated dynamic lastModified timestamp');
});

test('Technical SEO: robots.ts permits public crawling and disallows API routes', () => {
  const robotsPath = path.join(ROOT_DIR, 'src', 'app', 'robots.ts');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');

  assert.match(robotsContent, /userAgent:\s*['"]\*['"]/, 'Robots must target all user-agents');
  assert.match(robotsContent, /allow:\s*['"]\/['"]/, 'Robots must allow /');
  assert.match(robotsContent, /disallow:\s*\[['"]\/api\/['"]\]/, 'Robots must disallow /api/');
  assert.match(robotsContent, /sitemap:\s*`\$\{baseUrl\}\/sitemap\.xml`/, 'Robots must declare sitemap location');
});

test('Technical SEO: buildLocalizedMetadata emits regional en-IN and hi-IN alternates and complete robots directives', () => {
  const meta = buildLocalizedMetadata({
    locale: 'en',
    pathSegment: 'products/mattresses',
    title: 'Test Title',
    description: 'Test Description',
  });

  const languages = meta.alternates?.languages;
  assert.ok(languages?.['en-IN'], 'Must emit en-IN hreflang alternate');
  assert.ok(languages?.['hi-IN'], 'Must emit hi-IN hreflang alternate');
  assert.ok(languages?.['en'], 'Must emit en hreflang alternate');
  assert.ok(languages?.['hi'], 'Must emit hi hreflang alternate');
  assert.ok(languages?.['x-default'], 'Must emit x-default hreflang alternate');

  assert.equal(meta.robots?.index, true, 'Robots index must be true');
  assert.equal(meta.robots?.follow, true, 'Robots follow must be true');
  assert.equal(meta.robots?.googleBot?.['max-image-preview'], 'large', 'Must permit large image preview for Google Discover and rich snippets');
});

test('Technical SEO: Google Search Console verification token is preserved in root layout', () => {
  const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  assert.match(
    layoutContent,
    /__dXrdI16pfeAmjzqS4nNuocrCO3JJ58Jtx9Iyiha24/,
    'Root layout must preserve the verified Google Search Console verification token'
  );
});

test('Technical SEO: Zero fabricated ratings, reviews, or prices in schema across all page definitions', () => {
  const pagesToCheck = [
    'src/app/[locale]/page.tsx',
    'src/app/[locale]/products/page.tsx',
    'src/app/[locale]/products/mattresses/page.tsx',
    'src/app/[locale]/products/pillows/page.tsx',
    'src/app/[locale]/products/razais/page.tsx',
    'src/app/[locale]/products/blankets/page.tsx',
    'src/app/[locale]/wholesale/page.tsx',
    'src/app/[locale]/our-story/page.tsx',
    'src/app/[locale]/contact/page.tsx',
    'src/app/[locale]/layout.tsx',
  ];

  for (const pageRel of pagesToCheck) {
    const fullPath = path.join(ROOT_DIR, pageRel);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Forbidden fake schema fields
    assert.ok(!content.includes('aggregateRating'), `Page ${pageRel} must not contain fake aggregateRating schema`);
    assert.ok(!content.includes('"ratingValue"'), `Page ${pageRel} must not contain fake ratingValue schema`);
    assert.ok(!content.includes('"reviewCount"'), `Page ${pageRel} must not contain fake reviewCount schema`);
  }
});
