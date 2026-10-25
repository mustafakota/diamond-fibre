import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { buildLocalizedMetadata, CANONICAL_PRODUCTION_URL } from '../src/lib/seo.ts';

const ROOT_DIR = process.cwd();

/** The 20 canonical paths the sitemap must contain. */
const EXPECTED_SITEMAP_PATHS = [
  '/en', '/hi', '/en/products', '/hi/products',
  '/en/products/mattresses', '/hi/products/mattresses',
  '/en/products/pillows', '/hi/products/pillows',
  '/en/products/razais', '/hi/products/razais',
  '/en/products/blankets', '/hi/products/blankets',
  '/en/wholesale', '/hi/wholesale',
  '/en/our-story', '/hi/our-story',
  '/en/contact', '/hi/contact',
  '/en/privacy-policy', '/hi/privacy-policy',
];

/**
 * Validate a sitemap XML string using the standards-compliant fast-xml-parser.
 * @param {string} xmlString - Raw XML content.
 * @param {string} expectedBaseUrl - Expected URL prefix (e.g. 'https://diamondfibre.shop').
 * @returns {string[]} Array of problem descriptions (empty = valid).
 */
function validateSitemapXml(xmlString, expectedBaseUrl) {
  const problems = [];
  if (typeof xmlString !== 'string') {
    problems.push('XML parse error: Input is not a string');
    return problems;
  }
  if (!xmlString.trim()) {
    problems.push('XML parse error: Document is empty or whitespace only');
    return problems;
  }

  // 1. Strict W3C XML 1.0 well-formedness validation (detects malformed tags, unclosed tags, invalid attributes)
  const validationResult = XMLValidator.validate(xmlString, {
    allowBooleanAttributes: false,
  });
  if (validationResult !== true) {
    problems.push(`XML validation error: ${validationResult.err.msg}`);
    return problems;
  }

  // 2. Strict XML entity reference check (only predefined entities: amp, lt, gt, quot, apos, and numeric references are valid without a DTD)
  const invalidEntityMatch = xmlString.match(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#[xX][0-9a-fA-F]+);)[a-zA-Z0-9_#]+;/g);
  if (invalidEntityMatch) {
    problems.push(`Invalid entity reference: ${invalidEntityMatch.join(', ')}`);
    return problems;
  }

  // 3. Standards-compliant parsing into object tree
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => name === 'url',
    parseTagValue: false,
    trimValues: true,
  });

  let parsed;
  try {
    parsed = parser.parse(xmlString);
  } catch (err) {
    problems.push(`XML parse error: ${err.message}`);
    return problems;
  }

  if (!parsed || typeof parsed !== 'object') {
    problems.push('XML parse produced no valid object');
    return problems;
  }

  // 4. Root element must be <urlset>
  const rootKeys = Object.keys(parsed).filter(k => !k.startsWith('?') && !k.startsWith('#'));
  if (!parsed.urlset) {
    problems.push(`Root element must be <urlset>, got <${rootKeys[0] || 'unknown'}>`);
    return problems;
  }

  const urlset = parsed.urlset;

  // 5. Official sitemap namespace
  const xmlns = urlset['@_xmlns'];
  if (xmlns !== 'http://www.sitemaps.org/schemas/sitemap/0.9') {
    problems.push(`<urlset> xmlns must be "http://www.sitemaps.org/schemas/sitemap/0.9", got "${xmlns}"`);
  }

  // 6. No xhtml namespace (causes browser XML viewer corruption)
  if (urlset['@_xmlns:xhtml']) {
    problems.push('<urlset> must not declare xmlns:xhtml (causes browser XML viewer corruption)');
  }

  // 7. Exactly 20 <url> entries
  const urlEntries = Array.isArray(urlset.url) ? urlset.url : (urlset.url ? [urlset.url] : []);
  if (urlEntries.length !== 20) {
    problems.push(`Expected exactly 20 <url> entries, found ${urlEntries.length}`);
  }

  // 8. No <xhtml:link> elements inside <url>
  if (urlEntries.some(u => u && (u['xhtml:link'] || Object.keys(u).some(k => k.startsWith('xhtml:'))))) {
    problems.push('Sitemap must not contain <xhtml:link> elements');
  }

  // 9. Extract and validate <loc> values
  const locs = urlEntries.map(u => (u && typeof u.loc === 'string' ? u.loc.trim() : null)).filter(Boolean);
  if (locs.length !== urlEntries.length) {
    problems.push(`${urlEntries.length - locs.length} <url> element(s) missing a <loc>`);
  }

  // 10. All <loc> must be unique
  const seen = new Set();
  const dupes = locs.filter(l => { if (seen.has(l)) return true; seen.add(l); return false; });
  if (dupes.length > 0) problems.push(`Duplicate <loc> values: ${dupes.join(', ')}`);

  // 11. All <loc> must start with expected base URL
  const baseUrl = (expectedBaseUrl || '').replace(/\/$/, '');
  const wrongDomain = locs.filter(l => !l.startsWith(baseUrl + '/') && l !== baseUrl);
  if (wrongDomain.length > 0) {
    problems.push(`${wrongDomain.length} <loc>(s) not on expected domain "${baseUrl}": ${wrongDomain.slice(0, 3).join(', ')}`);
  }

  // 12. All 20 intended paths must be present; no unexpected paths
  const locPaths = locs.map(l => { try { return new URL(l).pathname; } catch { return null; } });
  const unexpected = locPaths.filter(p => p !== null && !EXPECTED_SITEMAP_PATHS.includes(p));
  if (unexpected.length > 0) problems.push(`Unexpected path(s) not in 20 intended routes: ${unexpected.join(', ')}`);
  const missing = EXPECTED_SITEMAP_PATHS.filter(p => !locPaths.includes(p));
  if (missing.length > 0) problems.push(`Missing route(s) from sitemap: ${missing.join(', ')}`);

  // 13. <lastmod> — validate ISO date format and consistent presence
  const lastmodValues = urlEntries.map(u => (u && u.lastmod !== undefined ? String(u.lastmod).trim() : null));
  const presentLastmods = lastmodValues.filter(l => l !== null);
  if (presentLastmods.length > 0 && presentLastmods.length !== urlEntries.length) {
    problems.push(
      `Inconsistent <lastmod>: ${presentLastmods.length}/${urlEntries.length} entries have it. ` +
      'Either all entries must include a valid <lastmod> or all must omit it.'
    );
  }
  for (const lm of presentLastmods) {
    if (isNaN(new Date(lm).getTime())) {
      problems.push(`Invalid ISO date in <lastmod>: "${lm}"`);
    } else if (!/^\d{4}-\d{2}-\d{2}/.test(lm)) {
      problems.push(`<lastmod> "${lm}" does not begin with YYYY-MM-DD`);
    }
  }

  return problems;
}


test('Technical SEO: sitemap.ts configuration and canonical rules', () => {
  const sitemapPath = path.join(ROOT_DIR, 'src', 'app', 'sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Must not include redirected legacy routes
  assert.ok(!sitemapContent.includes("'products/gaddas'"), 'Sitemap must not contain legacy redirected gaddas route');

  // Must include all 10 core routes (which generate 20 URLs: 10 EN + 10 HI)
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
    "'privacy-policy'",
  ];
  for (const r of expectedRoutes) {
    assert.ok(sitemapContent.includes(r), `Sitemap must include route ${r}`);
  }

  // Must generate separate entries for English and Hindi routes
  assert.match(sitemapContent, /enUrl/, 'Sitemap must include English URL entries');
  assert.match(sitemapContent, /hiUrl/, 'Sitemap must include Hindi URL entries');

  // Must avoid conflicting alternates in sitemap to prevent browser XML viewer corruption (xhtml namespace conflict)
  assert.ok(!sitemapContent.includes('alternates:'), 'Sitemap must avoid xhtml alternates conflict; hreflang alternates are declared in HTML head');

  // Must resolve latest Git commit date without fabricating dates or using deployment-generated timestamps
  assert.match(sitemapContent, /getRouteLastModified/, 'Sitemap must use getRouteLastModified helper');
  assert.ok(!sitemapContent.includes('fs.statSync'), 'Sitemap must avoid filesystem mtime fallback to prevent deployment-generated dates');
  assert.ok(!sitemapContent.includes('new Date().toISOString()'), 'Sitemap must avoid fabricated dynamic lastModified timestamp');

  // Validate generated sitemap XML artifact if present — using standards-compliant fast-xml-parser
  const builtSitemapPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'sitemap.xml.body');
  if (fs.existsSync(builtSitemapPath)) {
    const xml = fs.readFileSync(builtSitemapPath, 'utf8');

    // --- Strict W3C XML 1.0 validation ---
    const valResult = XMLValidator.validate(xml, { allowBooleanAttributes: false });
    assert.equal(valResult, true, `Sitemap XML must be valid XML: ${JSON.stringify(valResult)}`);

    // --- Standards-compliant parsing ---
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      isArray: (name) => name === 'url',
      parseTagValue: false,
      trimValues: true,
    });
    const parsed = parser.parse(xml);
    assert.ok(parsed && parsed.urlset, 'Sitemap XML must have a <urlset> root element');
    const urlset = parsed.urlset;

    // Namespace
    assert.equal(
      urlset['@_xmlns'],
      'http://www.sitemaps.org/schemas/sitemap/0.9',
      'Sitemap root must declare official sitemaps namespace'
    );

    // No xhtml namespace conflict
    assert.ok(!urlset['@_xmlns:xhtml'], 'Sitemap must not include conflicting xmlns:xhtml');

    // Exactly 20 <url> entries
    const urlEls = Array.isArray(urlset.url) ? urlset.url : [urlset.url];
    assert.equal(urlEls.length, 20, 'Sitemap must contain exactly 20 <url> elements (10 EN + 10 HI)');

    // No xhtml elements
    assert.ok(
      !urlEls.some(u => u && (u['xhtml:link'] || Object.keys(u).some(k => k.startsWith('xhtml:')))),
      'Sitemap must not contain <xhtml:link> elements'
    );

    // Extract <loc> values
    const locs = urlEls.map(u => (u && typeof u.loc === 'string' ? u.loc.trim() : null)).filter(Boolean);
    assert.equal(locs.length, 20, 'Every <url> must have a <loc>');

    // All <loc> must be unique
    assert.equal(new Set(locs).size, 20, 'All 20 <loc> values must be unique');

    // All <loc> must use a consistent base URL (derived from first entry).
    // The canonical production domain check is performed by verify-seo.mjs when run against the live build.
    const detectedBase = locs.length > 0 ? (() => { try { const u = new URL(locs[0]); return `${u.protocol}//${u.host}`; } catch { return null; } })() : null;
    if (detectedBase) {
      const wrongDomain = locs.filter(l => !l.startsWith(detectedBase + '/') && l !== detectedBase);
      assert.equal(
        wrongDomain.length, 0,
        `All <loc> must share a single base URL (detected: "${detectedBase}"). Inconsistent: ${wrongDomain.join(', ')}`
      );
    }

    // Paths must match exactly the 20 intended routes
    const locPaths = locs.map(l => { try { return new URL(l).pathname; } catch { return null; } });
    const unexpected = locPaths.filter(p => p !== null && !EXPECTED_SITEMAP_PATHS.includes(p));
    assert.equal(unexpected.length, 0, `Unexpected path(s) not in 20 intended routes: ${unexpected.join(', ')}`);
    const missing = EXPECTED_SITEMAP_PATHS.filter(p => !locPaths.includes(p));
    assert.equal(missing.length, 0, `Missing expected route(s) from sitemap: ${missing.join(', ')}`);

    // <lastmod> — valid ISO dates and consistent presence
    const lastmodValues = urlEls.map(u => (u && u.lastmod !== undefined ? String(u.lastmod).trim() : null));
    const presentLastmods = lastmodValues.filter(l => l !== null);
    assert.ok(
      presentLastmods.length === 20 || presentLastmods.length === 0,
      `Sitemap must either have all 20 <lastmod> entries or none. Found ${presentLastmods.length}.`
    );
    for (const lm of presentLastmods) {
      assert.ok(!isNaN(new Date(lm).getTime()), `Invalid ISO date in <lastmod>: "${lm}"`);
      assert.match(lm, /^\d{4}-\d{2}-\d{2}/, `<lastmod> "${lm}" must begin with YYYY-MM-DD`);
    }

    // Comprehensive validation via validateSitemapXml
    const sitemapProblems = validateSitemapXml(xml, detectedBase || 'https://diamondfibre.shop');
    assert.equal(sitemapProblems.length, 0, `validateSitemapXml found problems in built artifact: ${sitemapProblems.join('; ')}`);
  }
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
  assert.equal(CANONICAL_PRODUCTION_URL, 'https://diamondfibre.shop');

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
  assert.ok(meta.metadataBase, 'Must configure metadataBase');
});

test('Technical SEO: production environment resolves canonical URLs to https://diamondfibre.shop', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_SITE_URL = '';

    const enMeta = buildLocalizedMetadata({
      locale: 'en',
      pathSegment: 'products/mattresses',
      title: 'Mattresses',
      description: 'Handcrafted mattresses',
    });

    assert.equal(enMeta.alternates?.canonical, 'https://diamondfibre.shop/en/products/mattresses');
    assert.equal(enMeta.alternates?.languages?.['en-IN'], 'https://diamondfibre.shop/en/products/mattresses');
    assert.equal(enMeta.alternates?.languages?.['hi-IN'], 'https://diamondfibre.shop/hi/products/mattresses');
    assert.equal(enMeta.alternates?.languages?.['x-default'], 'https://diamondfibre.shop/en/products/mattresses');
    assert.equal(enMeta.openGraph?.url, 'https://diamondfibre.shop/en/products/mattresses');
    assert.equal(enMeta.metadataBase?.href, 'https://diamondfibre.shop/');

    const hiMeta = buildLocalizedMetadata({
      locale: 'hi',
      pathSegment: 'products/mattresses',
      title: 'गद्दे',
      description: 'हैंडक्राफ़्टेड गद्दे',
    });

    assert.equal(hiMeta.alternates?.canonical, 'https://diamondfibre.shop/hi/products/mattresses');
    assert.equal(hiMeta.alternates?.languages?.['en-IN'], 'https://diamondfibre.shop/en/products/mattresses');
    assert.equal(hiMeta.alternates?.languages?.['hi-IN'], 'https://diamondfibre.shop/hi/products/mattresses');
    assert.equal(hiMeta.openGraph?.url, 'https://diamondfibre.shop/hi/products/mattresses');
  } finally {
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  }
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
    'src/app/[locale]/privacy-policy/page.tsx',
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

test('Social Preview: og-preview.jpg exists in public/images/ and meets Open Graph dimension requirements', async () => {
  const ogImagePath = path.join(ROOT_DIR, 'public', 'images', 'og-preview.jpg');
  assert.ok(fs.existsSync(ogImagePath), 'public/images/og-preview.jpg must exist');

  const stat = fs.statSync(ogImagePath);
  assert.ok(stat.size > 10000, `og-preview.jpg must be > 10KB (actual: ${stat.size} bytes)`);
  assert.ok(stat.size < 2_000_000, `og-preview.jpg must be < 2MB (actual: ${stat.size} bytes)`);

  // Verify JPEG magic bytes
  const buf = Buffer.alloc(3);
  const fd = fs.openSync(ogImagePath, 'r');
  fs.readSync(fd, buf, 0, 3, 0);
  fs.closeSync(fd);
  assert.equal(buf[0], 0xFF, 'og-preview.jpg must start with JPEG magic byte 0xFF');
  assert.equal(buf[1], 0xD8, 'og-preview.jpg must have JPEG magic byte 0xD8');

  // Verify exact 1200x630 dimensions and JPEG format
  const sharp = (await import('sharp')).default;
  const meta = await sharp(ogImagePath).metadata();
  assert.equal(meta.width, 1200, 'og-preview.jpg width must be 1200px');
  assert.equal(meta.height, 630, 'og-preview.jpg height must be 630px');
  assert.equal(meta.format, 'jpeg', 'og-preview.jpg must be JPEG format');

  // Verify emblem is centered and outer margins (x < 150 and x > 1050) are clean background with no cropped wordmark
  const { data } = await sharp(ogImagePath).raw().toBuffer({ resolveWithObject: true });
  for (let y = 100; y < 500; y += 50) {
    const leftIdx = (y * 1200 + 100) * 3;
    const rightIdx = (y * 1200 + 1100) * 3;
    assert.ok(data[leftIdx] > 190, `Left margin at (100, ${y}) must be clean background (got: ${data[leftIdx]})`);
    assert.ok(data[rightIdx] > 190, `Right margin at (1100, ${y}) must be clean background (got: ${data[rightIdx]})`);
  }
});

test('Social Preview: buildLocalizedMetadata emits 1200x630 og-preview OG image with localized emblem alt text', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_SITE_URL = '';

    // English Default Metadata
    const enMeta = buildLocalizedMetadata({
      locale: 'en',
      pathSegment: '',
      title: 'Diamond Fibre | Bedding Manufacturer',
      description: 'Test',
    });

    const ogImages = enMeta.openGraph?.images;
    assert.ok(Array.isArray(ogImages) && ogImages.length > 0, 'openGraph.images must be a non-empty array');
    const ogImage = Array.isArray(ogImages) ? ogImages[0] : null;
    assert.ok(ogImage && typeof ogImage === 'object' && 'url' in ogImage, 'OG image must be an object with url');
    if (ogImage && typeof ogImage === 'object' && 'url' in ogImage) {
      assert.ok(
        String(ogImage.url).includes('/images/og-preview.jpg'),
        `OG image URL must reference og-preview.jpg (got: ${ogImage.url})`
      );
      assert.equal(ogImage.width, 1200, 'OG image width must be 1200');
      assert.equal(ogImage.height, 630, 'OG image height must be 630');
      assert.ok(ogImage.alt && String(ogImage.alt).length > 0, 'OG image must have a non-empty alt text');
      assert.ok(
        String(ogImage.alt).toLowerCase().includes('emblem'),
        `English default OG image alt text must describe the emblem (got: "${ogImage.alt}")`
      );
    }

    // Twitter card must include image with alt
    const twImages = enMeta.twitter?.images;
    assert.ok(Array.isArray(twImages) && twImages.length > 0, 'twitter.images must be a non-empty array');
    const twImage = Array.isArray(twImages) ? twImages[0] : null;
    assert.ok(twImage && typeof twImage === 'object', 'Twitter image must be an object (not a plain string) so alt can be set');
    if (twImage && typeof twImage === 'object' && 'url' in twImage) {
      assert.ok(String(twImage.url).includes('/images/og-preview.jpg'), 'Twitter image URL must reference og-preview.jpg');
      assert.ok('alt' in twImage && twImage.alt, 'Twitter image must have an alt text');
      assert.ok(
        String(twImage.alt).toLowerCase().includes('emblem'),
        `English Twitter image alt text must describe the emblem (got: "${twImage.alt}")`
      );
    }

    // Hindi Default Metadata
    const hiMeta = buildLocalizedMetadata({
      locale: 'hi',
      pathSegment: '',
      title: 'डायमंड फाइबर | बेडिंग निर्माता',
      description: 'परीक्षण',
    });
    const hiOgImage = hiMeta.openGraph?.images?.[0];
    assert.ok(hiOgImage && typeof hiOgImage === 'object' && 'alt' in hiOgImage);
    assert.ok(
      String(hiOgImage.alt).includes('प्रतीक चिन्ह') || String(hiOgImage.alt).includes('Emblem'),
      `Hindi default OG image alt text must describe the emblem (got: "${hiOgImage.alt}")`
    );
  } finally {
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  }
});

test('Favicon: root layout declares all required icon sizes for Google site icon', () => {
  const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Google requires a square favicon of at least 48×48 served at a crawlable URL
  assert.ok(layoutContent.includes('/favicon.ico'), 'Layout must declare favicon.ico');
  assert.ok(layoutContent.includes('/favicon.png'), 'Layout must declare favicon.png (32×32)');
  assert.ok(layoutContent.includes('/icon.png'), 'Layout must declare icon.png (192×192)');
  assert.ok(layoutContent.includes('/icon-512.png'), 'Layout must declare icon-512.png (512×512)');
  assert.ok(layoutContent.includes('/apple-icon.png'), 'Layout must declare apple-icon.png (180×180)');

  // Favicon files must physically exist
  for (const f of ['favicon.ico', 'favicon.png', 'icon.png', 'icon-512.png', 'apple-icon.png']) {
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, 'public', f)),
      `public/${f} must exist for favicon metadata to resolve`
    );
  }
});

test('Sitemap XML Parser Robustness: rejects non-string and malformed XML structures', () => {
  // Non-string inputs
  assert.equal(validateSitemapXml(null, 'https://diamondfibre.shop')[0], 'XML parse error: Input is not a string');
  assert.equal(validateSitemapXml(undefined, 'https://diamondfibre.shop')[0], 'XML parse error: Input is not a string');
  assert.equal(validateSitemapXml(42, 'https://diamondfibre.shop')[0], 'XML parse error: Input is not a string');

  // Empty or whitespace-only inputs
  assert.deepEqual(validateSitemapXml('', 'https://diamondfibre.shop'), ['XML parse error: Document is empty or whitespace only']);
  assert.deepEqual(validateSitemapXml('   \n\t  ', 'https://diamondfibre.shop'), ['XML parse error: Document is empty or whitespace only']);

  // Plain text (no XML tags)
  const plainTextProblems = validateSitemapXml('Plain text without XML tags', 'https://diamondfibre.shop');
  assert.ok(plainTextProblems.some(p => p.includes('XML validation error') || p.includes('Root element must be <urlset>')));

  // Unclosed tag
  const unclosedProblems = validateSitemapXml('<?xml version="1.0"?><urlset><url><loc>https://diamondfibre.shop/en</loc>', 'https://diamondfibre.shop');
  assert.ok(unclosedProblems.some(p => p.includes('XML validation error')));

  // Mismatched tag
  const mismatchedProblems = validateSitemapXml('<?xml version="1.0"?><urlset><url><loc>https://diamondfibre.shop/en</url></loc></urlset>', 'https://diamondfibre.shop');
  assert.ok(mismatchedProblems.some(p => p.includes('XML validation error')));

  // Invalid attribute syntax (unquoted attribute value)
  const unquotedAttrProblems = validateSitemapXml('<?xml version="1.0"?><urlset attr=unquoted><url><loc>https://diamondfibre.shop/en</loc></url></urlset>', 'https://diamondfibre.shop');
  assert.ok(unquotedAttrProblems.some(p => p.includes('XML validation error')));

  // Invalid attribute syntax (missing attribute value)
  const missingAttrValProblems = validateSitemapXml('<?xml version="1.0"?><urlset attr><url><loc>https://diamondfibre.shop/en</loc></url></urlset>', 'https://diamondfibre.shop');
  assert.ok(missingAttrValProblems.some(p => p.includes('XML validation error')));

  // Invalid entity reference (raw unescaped ampersand)
  const unescapedAmpProblems = validateSitemapXml('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://diamondfibre.shop/en?a=1&b=2</loc></url></urlset>', 'https://diamondfibre.shop');
  assert.ok(unescapedAmpProblems.some(p => p.includes('XML validation error')));

  // Invalid entity reference (undeclared entity)
  const undeclaredEntityProblems = validateSitemapXml('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://diamondfibre.shop/en?foo=&customEntity;</loc></url></urlset>', 'https://diamondfibre.shop');
  assert.ok(undeclaredEntityProblems.some(p => p.includes('Invalid entity reference')));

  // Direct XMLValidator tests for W3C compliance
  assert.equal(XMLValidator.validate('<valid><tag>ok</tag></valid>'), true);
  assert.notEqual(XMLValidator.validate('<invalid><tag></invalid>'), true);
});

test('Sitemap XML Parser Robustness: validates valid 20-route sitemap and rejects invalid sitemap schemas and data', () => {
  function makeSitemap({
    rootTag = 'urlset',
    xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9',
    extraAttrs = '',
    paths = EXPECTED_SITEMAP_PATHS,
    domain = 'https://diamondfibre.shop',
    includeLoc = true,
    lastmodMode = 'none', // 'none' | 'all-valid' | 'partial' | 'invalid-date' | 'invalid-format'
    extraChild = '',
  } = {}) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag} xmlns="${xmlns}"${extraAttrs ? ' ' + extraAttrs : ''}>\n`;
    for (let i = 0; i < paths.length; i++) {
      xml += '  <url>\n';
      if (includeLoc) {
        xml += `    <loc>${domain}${paths[i]}</loc>\n`;
      }
      if (lastmodMode === 'all-valid') {
        xml += '    <lastmod>2026-10-25T00:00:00.000Z</lastmod>\n';
      } else if (lastmodMode === 'partial' && i === 0) {
        xml += '    <lastmod>2026-10-25T00:00:00.000Z</lastmod>\n';
      } else if (lastmodMode === 'invalid-date') {
        xml += '    <lastmod>not-a-date</lastmod>\n';
      } else if (lastmodMode === 'invalid-format') {
        xml += '    <lastmod>10/25/2026</lastmod>\n';
      }
      if (extraChild) {
        xml += `    ${extraChild}\n`;
      }
      xml += '  </url>\n';
    }
    xml += `</${rootTag}>`;
    return xml;
  }

  // 1. Valid clean 20-route sitemap with no lastmod
  assert.deepEqual(validateSitemapXml(makeSitemap(), 'https://diamondfibre.shop'), []);

  // 2. Valid clean 20-route sitemap with all valid ISO lastmods
  assert.deepEqual(validateSitemapXml(makeSitemap({ lastmodMode: 'all-valid' }), 'https://diamondfibre.shop'), []);

  // 3. Wrong root tag
  const wrongRoot = validateSitemapXml(makeSitemap({ rootTag: 'feed' }), 'https://diamondfibre.shop');
  assert.ok(wrongRoot.some(p => p.includes('Root element must be <urlset>')));

  // 4. Missing or wrong xmlns
  const wrongNs = validateSitemapXml(makeSitemap({ xmlns: 'http://example.com/sitemap' }), 'https://diamondfibre.shop');
  assert.ok(wrongNs.some(p => p.includes('<urlset> xmlns must be "http://www.sitemaps.org/schemas/sitemap/0.9"')));

  // 5. Conflicting xmlns:xhtml
  const xhtmlAttr = validateSitemapXml(makeSitemap({ extraAttrs: 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' }), 'https://diamondfibre.shop');
  assert.ok(xhtmlAttr.some(p => p.includes('must not declare xmlns:xhtml')));

  // 6. Conflicting <xhtml:link> element
  const xhtmlEl = validateSitemapXml(
    makeSitemap({ extraChild: '<xhtml:link rel="alternate" hreflang="hi" href="https://diamondfibre.shop/hi"/>' }),
    'https://diamondfibre.shop'
  );
  assert.ok(xhtmlEl.some(p => p.includes('must not contain <xhtml:link>')));

  // 7. Missing <loc> element
  const noLoc = validateSitemapXml(makeSitemap({ includeLoc: false }), 'https://diamondfibre.shop');
  assert.ok(noLoc.some(p => p.includes('missing a <loc>')));

  // 8. Duplicate <loc> values
  const dupes = validateSitemapXml(
    makeSitemap({ paths: [...EXPECTED_SITEMAP_PATHS.slice(0, 19), EXPECTED_SITEMAP_PATHS[0]] }),
    'https://diamondfibre.shop'
  );
  assert.ok(dupes.some(p => p.includes('Duplicate <loc> values')));

  // 9. Wrong domain
  const wrongDomain = validateSitemapXml(makeSitemap({ domain: 'https://other-site.com' }), 'https://diamondfibre.shop');
  assert.ok(wrongDomain.some(p => p.includes('not on expected domain')));

  // 10. Unexpected path not in the 20 intended routes
  const unexpectedRoute = validateSitemapXml(
    makeSitemap({ paths: [...EXPECTED_SITEMAP_PATHS.slice(0, 19), '/en/admin-dashboard'] }),
    'https://diamondfibre.shop'
  );
  assert.ok(unexpectedRoute.some(p => p.includes('Unexpected path(s) not in 20 intended routes')));

  // 11. Fewer than 20 entries
  const fewer = validateSitemapXml(makeSitemap({ paths: EXPECTED_SITEMAP_PATHS.slice(0, 15) }), 'https://diamondfibre.shop');
  assert.ok(fewer.some(p => p.includes('Expected exactly 20 <url> entries, found 15')));
  assert.ok(fewer.some(p => p.includes('Missing route(s) from sitemap')));

  // 12. More than 20 entries
  const more = validateSitemapXml(
    makeSitemap({ paths: [...EXPECTED_SITEMAP_PATHS, '/en/extra-page'] }),
    'https://diamondfibre.shop'
  );
  assert.ok(more.some(p => p.includes('Expected exactly 20 <url> entries, found 21')));

  // 13. Inconsistent <lastmod> presence
  const inconsistentLm = validateSitemapXml(makeSitemap({ lastmodMode: 'partial' }), 'https://diamondfibre.shop');
  assert.ok(inconsistentLm.some(p => p.includes('Inconsistent <lastmod>')));

  // 14. Invalid <lastmod> date
  const invalidDate = validateSitemapXml(makeSitemap({ lastmodMode: 'invalid-date' }), 'https://diamondfibre.shop');
  assert.ok(invalidDate.some(p => p.includes('Invalid ISO date in <lastmod>')));

  // 15. Invalid <lastmod> format (e.g. DD-MM-YYYY instead of YYYY-MM-DD)
  const invalidFmt = validateSitemapXml(makeSitemap({ lastmodMode: 'invalid-format' }), 'https://diamondfibre.shop');
  assert.ok(invalidFmt.some(p => p.includes('does not begin with YYYY-MM-DD')));
});
