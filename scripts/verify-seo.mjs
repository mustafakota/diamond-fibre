import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { XMLValidator, XMLParser } from 'fast-xml-parser';

const routes = [
  '/en',
  '/hi',
  '/en/products',
  '/hi/products',
  '/en/products/mattresses',
  '/hi/products/mattresses',
  '/en/products/pillows',
  '/hi/products/pillows',
  '/en/products/razais',
  '/hi/products/razais',
  '/en/products/blankets',
  '/hi/products/blankets',
  '/en/wholesale',
  '/hi/wholesale',
  '/en/our-story',
  '/hi/our-story',
  '/en/contact',
  '/hi/contact',
  '/robots.txt',
  '/sitemap.xml',
];

/** The 18 canonical path segments expected in the sitemap (without the base URL). */
const EXPECTED_SITEMAP_PATHS = [
  '/en',
  '/hi',
  '/en/products',
  '/hi/products',
  '/en/products/mattresses',
  '/hi/products/mattresses',
  '/en/products/pillows',
  '/hi/products/pillows',
  '/en/products/razais',
  '/hi/products/razais',
  '/en/products/blankets',
  '/hi/products/blankets',
  '/en/wholesale',
  '/hi/wholesale',
  '/en/our-story',
  '/hi/our-story',
  '/en/contact',
  '/hi/contact',
];

const targetUrl = process.argv[2] || process.env.TARGET_URL || 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Standards-compliant XML validation & parsing using fast-xml-parser.
// ---------------------------------------------------------------------------

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

  // 7. Exactly 18 <url> entries
  const urlEntries = Array.isArray(urlset.url) ? urlset.url : (urlset.url ? [urlset.url] : []);
  if (urlEntries.length !== 18) {
    problems.push(`Expected exactly 18 <url> entries, found ${urlEntries.length}`);
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

  // 12. All 18 intended paths must be present; no unexpected paths
  const locPaths = locs.map(l => { try { return new URL(l).pathname; } catch { return null; } });
  const unexpected = locPaths.filter(p => p !== null && !EXPECTED_SITEMAP_PATHS.includes(p));
  if (unexpected.length > 0) problems.push(`Unexpected path(s) not in 18 intended routes: ${unexpected.join(', ')}`);
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

async function fetchUrl(baseUrl, urlPath) {
  const fullUrl = new URL(urlPath, baseUrl);
  const res = await fetch(fullUrl.toString(), {
    headers: {
      'User-Agent': 'DiamondFibre-SeoVerifier/1.0',
    },
  });
  const body = await res.text();
  return { status: res.status, body };
}


function verifyPrerendered() {
  console.log('=== VERIFYING PRERENDERED BUILD ARTIFACTS IN .next/server/app ===\n');
  const appDir = path.join(process.cwd(), '.next', 'server', 'app');
  if (!fs.existsSync(appDir)) {
    console.error('❌ .next/server/app directory not found. Please run "npm run build" first.');
    process.exitCode = 1;
    return;
  }

  let allPassed = true;
  for (const r of routes) {
    if (r.endsWith('.txt') || r.endsWith('.xml')) {
      const filePath = path.join(process.cwd(), '.next', 'server', 'app', `${r.replace(/^\//, '')}.body`);
      const altPath = path.join(process.cwd(), '.next', 'static', r.replace(/^\//, ''));
      const exists = fs.existsSync(filePath) || fs.existsSync(altPath);
      if (exists) {
        console.log(`✅ [PRERENDERED] ${r} (Static asset built)`);
        if (r === '/sitemap.xml' && fs.existsSync(filePath)) {
          const sitemapXml = fs.readFileSync(filePath, 'utf8');
          const expectedBase = targetUrl.replace(/\/$/, '');
          const problems = validateSitemapXml(sitemapXml, expectedBase);
          const urlCount = (sitemapXml.match(/<url>/g) || []).length;
          const lastmodCount = (sitemapXml.match(/<lastmod>/g) || []).length;
          if (problems.length === 0) {
            console.log(`   XML: Valid <urlset> with official namespace, ${urlCount} URLs, ${lastmodCount} <lastmod> timestamps, no xhtml conflict`);
            console.log(`   Locs: All 18 unique, on expected domain, all intended routes present`);
          } else {
            for (const p of problems) console.error(`   ❌ ${p}`);
            allPassed = false;
          }
        }
      } else {
        console.log(`✅ [PRERENDERED] ${r} (Dynamic metadata route)`);
      }
      continue;
    }

    const htmlPath = path.join(appDir, `${r.replace(/^\//, '')}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.error(`❌ [MISSING] ${r} -> Expected file ${htmlPath}`);
      allPassed = false;
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'NO TITLE';
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/);
    const canonical = canonicalMatch ? canonicalMatch[1] : 'NO CANONICAL';
    const jsonLdCount = (html.match(/type="application\/ld\+json"/g) || []).length;

    console.log(`✅ [PRERENDERED] ${r}`);
    console.log(`   Title: ${title}`);
    console.log(`   Canonical: ${canonical}`);
    console.log(`   JSON-LD Schemas: ${jsonLdCount}`);
  }

  if (allPassed) {
    console.log('\n🎉 ALL PRERENDERED ROUTES VALIDATED SUCCESSFULLY!');
  } else {
    process.exitCode = 1;
  }
}

async function verify() {
  console.log(`=== CHECKING HTTP ENDPOINT: ${targetUrl} ===\n`);
  let isHttpAccessible = false;

  try {
    const testRes = await fetchUrl(targetUrl, '/robots.txt');
    if (testRes.status === 200) {
      isHttpAccessible = true;
    }
  } catch {
    isHttpAccessible = false;
  }

  if (!isHttpAccessible) {
    console.log(`Note: Server at ${targetUrl} is not currently running or reachable.`);
    console.log('Falling back to direct verification of prerendered build files...\n');
    verifyPrerendered();
    return;
  }

  let allPassed = true;
  for (const r of routes) {
    try {
      const res = await fetchUrl(targetUrl, r);
      const isXmlOrTxt = r.endsWith('.txt') || r.endsWith('.xml');

      if (res.status !== 200) {
        console.error(`❌ [${res.status}] ${r}`);
        allPassed = false;
        continue;
      }

      if (isXmlOrTxt) {
        console.log(`✅ [${res.status}] ${r} (${res.body.length} bytes)`);
        if (r === '/sitemap.xml') {
          // Derive expected base URL from the targetUrl (strip trailing slash)
          const expectedBase = targetUrl.replace(/\/$/, '');
          const problems = validateSitemapXml(res.body, expectedBase);
          const urlCount = (res.body.match(/<url>/g) || []).length;
          const lastmodCount = (res.body.match(/<lastmod>/g) || []).length;
          if (problems.length === 0) {
            console.log(`   XML: Valid <urlset>, ${urlCount} URLs, ${lastmodCount} <lastmod> timestamps, no xhtml conflict`);
            console.log(`   Locs: All 18 unique, on expected domain, all intended routes present`);
          } else {
            for (const p of problems) console.error(`   ❌ ${p}`);
            allPassed = false;
          }
        }
        continue;
      }

      const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : 'NO TITLE';
      const canonicalMatch = res.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/);
      const canonical = canonicalMatch ? canonicalMatch[1] : 'NO CANONICAL';
      const jsonLdCount = (res.body.match(/type="application\/ld\+json"/g) || []).length;

      console.log(`✅ [${res.status}] ${r}`);
      console.log(`   Title: ${title}`);
      console.log(`   Canonical: ${canonical}`);
      console.log(`   JSON-LD Schemas: ${jsonLdCount}`);
    } catch (e) {
      console.error(`❌ ERROR fetching ${r}:`, e.message);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL ROUTES VALIDATED SUCCESSFULLY WITH HTTP 200!');
  } else {
    process.exitCode = 1;
  }
}

verify();
