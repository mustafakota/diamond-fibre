import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';
import { privacyPolicyContent } from '../src/content/privacy-policy.ts';
import { buildLocalizedMetadata, CANONICAL_PRODUCTION_URL } from '../src/lib/seo.ts';
import {
  DEFAULT_DISPLAY_PHONE,
  BUSINESS_EMAIL,
  GOOGLE_MAPS_LISTING_URL,
} from '../src/lib/whatsapp.ts';

const ROOT_DIR = process.cwd();
const pagePath = path.join(ROOT_DIR, 'src', 'app', '[locale]', 'privacy-policy', 'page.tsx');
const contentPath = path.join(ROOT_DIR, 'src', 'content', 'privacy-policy.ts');
const footerPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Footer.tsx');
const sitemapPath = path.join(ROOT_DIR, 'src', 'app', 'sitemap.ts');

test('Privacy Policy: Source and content files exist', () => {
  assert.ok(fs.existsSync(pagePath), 'privacy-policy/page.tsx must exist');
  assert.ok(fs.existsSync(contentPath), 'content/privacy-policy.ts must exist');
});

test('Privacy Policy: Bilingual dictionary parity in footer', () => {
  assert.equal(en.footer.privacyPolicy, 'Privacy Policy');
  assert.equal(hi.footer.privacyPolicy, 'गोपनीयता नीति');

  const enFooterKeys = Object.keys(en.footer).sort();
  const hiFooterKeys = Object.keys(hi.footer).sort();
  assert.deepEqual(enFooterKeys, hiFooterKeys, 'Footer dictionary keys must match exactly between EN and HI');
});

test('Privacy Policy: Content data model has complete bilingual structural parity across all 10 clauses', () => {
  const enData = privacyPolicyContent.en;
  const hiData = privacyPolicyContent.hi;

  assert.ok(enData, 'English privacy data must exist');
  assert.ok(hiData, 'Hindi privacy data must exist');

  // Both must have exactly 10 detailed sections
  assert.equal(enData.sections.length, 10, 'English privacy policy must contain exactly 10 sections');
  assert.equal(hiData.sections.length, 10, 'Hindi privacy policy must contain exactly 10 sections');

  // Section IDs must match 1-to-1 in the same sequence
  for (let i = 0; i < enData.sections.length; i++) {
    const enSec = enData.sections[i];
    const hiSec = hiData.sections[i];
    assert.equal(enSec.id, hiSec.id, `Section ${i + 1} ID mismatch: ${enSec.id} vs ${hiSec.id}`);
    assert.ok(enSec.title.length > 0, `Section ${enSec.id} English title must not be empty`);
    assert.ok(hiSec.title.length > 0, `Section ${hiSec.id} Hindi title must not be empty`);
    assert.ok(enSec.paragraphs.length > 0, `Section ${enSec.id} English paragraphs must not be empty`);
    assert.ok(hiSec.paragraphs.length > 0, `Section ${hiSec.id} Hindi paragraphs must not be empty`);
  }

  // 4 Executive Highlights must exist in both languages
  assert.equal(enData.highlights.length, 4, 'English highlights must have 4 items');
  assert.equal(hiData.highlights.length, 4, 'Hindi highlights must have 4 items');

  // Verified Contact Box Details
  assert.equal(enData.contactBox.emailValue, BUSINESS_EMAIL);
  assert.equal(hiData.contactBox.emailValue, BUSINESS_EMAIL);
  assert.equal(enData.contactBox.phoneValue, DEFAULT_DISPLAY_PHONE);
  assert.equal(hiData.contactBox.phoneValue, DEFAULT_DISPLAY_PHONE);
});

test('Privacy Policy: Page component exports generateStaticParams for en and hi', () => {
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  assert.match(pageContent, /export\s+async\s+function\s+generateStaticParams\s*\(\s*\)/, 'Must export generateStaticParams');
  assert.ok(pageContent.includes("{ locale: 'en' }"), 'Must generate static params for en');
  assert.ok(pageContent.includes("{ locale: 'hi' }"), 'Must generate static params for hi');
});

test('Privacy Policy: SEO metadata generates canonical URLs, hreflang alternates, and Open Graph tags', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_SITE_URL = '';

    const enMeta = buildLocalizedMetadata({
      locale: 'en',
      pathSegment: 'privacy-policy',
      title: 'Privacy Policy | Diamond Fibre Bedding Manufacturer Ratlam',
      description: 'Diamond Fibre Privacy Policy',
    });

    assert.equal(enMeta.alternates?.canonical, 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(enMeta.alternates?.languages?.['en-IN'], 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(enMeta.alternates?.languages?.['hi-IN'], 'https://diamondfibre.shop/hi/privacy-policy');
    assert.equal(enMeta.alternates?.languages?.['x-default'], 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(enMeta.openGraph?.url, 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(enMeta.robots?.index, true);
    assert.equal(enMeta.robots?.follow, true);

    const hiMeta = buildLocalizedMetadata({
      locale: 'hi',
      pathSegment: 'privacy-policy',
      title: 'गोपनीयता नीति | डायमंड फाइबर रतलाम (म.प्र.)',
      description: 'डायमंड फाइबर गोपनीयता नीति',
    });

    assert.equal(hiMeta.alternates?.canonical, 'https://diamondfibre.shop/hi/privacy-policy');
    assert.equal(hiMeta.alternates?.languages?.['en-IN'], 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(hiMeta.alternates?.languages?.['hi-IN'], 'https://diamondfibre.shop/hi/privacy-policy');
    assert.equal(hiMeta.alternates?.languages?.['x-default'], 'https://diamondfibre.shop/en/privacy-policy');
    assert.equal(hiMeta.openGraph?.url, 'https://diamondfibre.shop/hi/privacy-policy');
  } finally {
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  }
});

test('Privacy Policy: Page renders BreadcrumbList and WebPage JSON-LD schemas', () => {
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  assert.match(pageContent, /buildBreadcrumbJsonLd/, 'Must call buildBreadcrumbJsonLd');
  assert.match(pageContent, /application\/ld\+json/, 'Must include JSON-LD script tags');
  assert.ok(pageContent.includes("'@type': 'WebPage'"), 'Must include WebPage schema');
  assert.ok(pageContent.includes("'@type': 'Organization'"), 'Must declare Organization publisher');
});

test('Privacy Policy: Factual business information and zero fabricated details', () => {
  const content = fs.readFileSync(contentPath, 'utf8');

  // Verified facts
  assert.ok(content.includes('7974644185'), 'Must contain verified telephone number');
  assert.ok(content.includes('diamondfibreandcotton@gmail.com'), 'Must contain verified business email');
  assert.ok(content.includes('Ratlam'), 'Must reference Ratlam manufacturing location');
  assert.ok(content.includes('Madhya Pradesh'), 'Must reference Madhya Pradesh');
  assert.ok(content.includes('Google Analytics 4'), 'Must mention Google Analytics 4');
  assert.ok(content.includes('Microsoft Clarity'), 'Must mention Microsoft Clarity');
  assert.ok(content.includes('Resend'), 'Must identify Resend as email delivery processor');
  assert.ok(content.includes('WhatsApp'), 'Must explain WhatsApp communication boundary');

  // Strict negative guards against fabricated information
  assert.ok(!content.includes('example.com'), 'Must not contain example.com placeholder');
  assert.ok(!content.includes('placeholder'), 'Must not contain placeholder text');
  assert.ok(!content.includes('aggregateRating'), 'Must not contain fake rating schema');
  assert.ok(!content.includes('5 star'), 'Must not claim fabricated reviews');
  assert.ok(!content.includes('ISO 9001 certified'), 'Must not fabricate unverified certifications');
  assert.ok(!content.includes('PCI-DSS certified'), 'Must not claim PCI-DSS certification when payments are not processed');
});

test('Privacy Policy: Footer contains single verified Privacy Policy link pointing to localized route', () => {
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  // Must link to localized privacy-policy route
  assert.ok(
    footerContent.includes('href={`/${locale}/privacy-policy`}'),
    'Footer must contain localized link to /privacy-policy'
  );
  assert.ok(
    footerContent.includes('{dict.footer.privacyPolicy}'),
    'Footer link must use dictionary label dict.footer.privacyPolicy'
  );

  // Must be in Company Navigation
  const matches = (footerContent.match(/privacy-policy/g) || []).length;
  assert.equal(matches, 1, 'Footer must contain exactly 1 Privacy Policy link (no duplicates)');
});

test('Privacy Policy: Sitemap includes privacy-policy route', () => {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  assert.ok(
    sitemapContent.includes("'privacy-policy'"),
    'sitemap.ts routes must include privacy-policy'
  );
});
