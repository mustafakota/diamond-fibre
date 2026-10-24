import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';
import {
  DEFAULT_DISPLAY_PHONE,
  BUSINESS_EMAIL,
  GOOGLE_MAPS_LISTING_URL,
  DEFAULT_WHATSAPP_NUMBER,
  INSTAGRAM_PROFILE_URL,
} from '../src/lib/whatsapp.ts';

const projectRoot = process.cwd();
const footerPath = path.join(projectRoot, 'src', 'components', 'layout', 'Footer.tsx');

test('Footer Redesign: File exists and uses required verified constants', () => {
  assert.ok(fs.existsSync(footerPath), 'Footer.tsx must exist');
  const content = fs.readFileSync(footerPath, 'utf8');

  assert.ok(content.includes('DEFAULT_DISPLAY_PHONE'), 'Must import and use DEFAULT_DISPLAY_PHONE');
  assert.ok(content.includes('BUSINESS_EMAIL'), 'Must import and use BUSINESS_EMAIL');
  assert.ok(content.includes('GOOGLE_MAPS_LISTING_URL'), 'Must import and use GOOGLE_MAPS_LISTING_URL');
  assert.ok(content.includes('INSTAGRAM_PROFILE_URL'), 'Must import and use INSTAGRAM_PROFILE_URL');
  assert.ok(content.includes('buildWhatsAppLink'), 'Must import and use buildWhatsAppLink');
  assert.ok(content.includes('buildPhoneLink'), 'Must import and use buildPhoneLink');
  assert.equal(DEFAULT_DISPLAY_PHONE, '+91 7974644185');
  assert.equal(BUSINESS_EMAIL, 'diamondfibreandcotton@gmail.com');
  assert.equal(DEFAULT_WHATSAPP_NUMBER, '917974644185');
  assert.equal(INSTAGRAM_PROFILE_URL, 'https://www.instagram.com/diamondfibres/');
});

test('Footer Redesign: Instagram link opens official profile in new tab with accessible name', () => {
  const content = fs.readFileSync(footerPath, 'utf8');

  assert.ok(content.includes('href={INSTAGRAM_PROFILE_URL}'), 'Must link directly to INSTAGRAM_PROFILE_URL');
  assert.ok(content.includes('target="_blank"'), 'Must open external profile in a new tab');
  assert.ok(content.includes('rel="noopener noreferrer"'), 'Must specify rel="noopener noreferrer"');
  assert.ok(content.includes('aria-label="Instagram: @diamondfibres"'), 'Must provide accessible name for screen readers');
  assert.ok(content.includes('<Instagram'), 'Must render Instagram icon');
});

test('Footer Redesign: Product navigation contains all four core categories', () => {
  const content = fs.readFileSync(footerPath, 'utf8');

  assert.ok(content.includes('/products/mattresses'), 'Must link to mattresses/gaddas route');
  assert.ok(content.includes('/products/pillows'), 'Must link to pillows route');
  assert.ok(content.includes('/products/razais'), 'Must link to razais route');
  assert.ok(content.includes('/products/blankets'), 'Must link to blankets route');
});

test('Footer Redesign: Company navigation includes Wholesale & Resellers and core pages', () => {
  const content = fs.readFileSync(footerPath, 'utf8');

  assert.ok(content.includes('href={`/${locale}/wholesale`}'), 'Must link to wholesale route');
  assert.ok(content.includes('href={`/${locale}/our-story`}'), 'Must link to our-story route');
  assert.ok(content.includes('href={`/${locale}/contact`}'), 'Must link to contact route');
  assert.ok(content.includes('href={`/${locale}`}'), 'Must link to home route');
});

test('Footer Redesign: Restrained bottom bar with dynamic year and no fake legal links', () => {
  const content = fs.readFileSync(footerPath, 'utf8');
  const dynamicYearFile = path.join(projectRoot, 'src', 'components', 'layout', 'DynamicYear.tsx');
  const dynamicYearContent = fs.readFileSync(dynamicYearFile, 'utf8');

  assert.ok(content.includes('<DynamicYear />'), 'Must use DynamicYear component for dynamic year');
  assert.ok(dynamicYearContent.includes('new Date().getFullYear()'), 'DynamicYear must dynamically calculate the current year');
  assert.ok(content.includes('dict.footer.rightsReserved'), 'Must include rights reserved note');
  assert.ok(content.includes('dict.footer.provenance'), 'Must include Ratlam provenance note');
  // Must NOT include empty privacy policy links or fake copyright badges
  assert.ok(!content.includes('href="/privacy"'), 'Must not include unverified privacy policy link');
  assert.ok(!content.includes('href="/terms"'), 'Must not include unverified terms link');
});

test('Footer Redesign: Responsiveness and tactile press interaction', () => {
  const content = fs.readFileSync(footerPath, 'utf8');

  // Check email wrapping protection for narrow 320px screens
  assert.ok(content.includes('break-all'), 'Email must use break-all to prevent horizontal overflow on 320px screens');

  // Check tactile click feedback
  assert.ok(content.includes('press-scale'), 'Links must use press-scale tactile feedback');
  assert.ok(content.includes('active:scale-[1.02]'), 'Links must scale up subtly on press');
  assert.ok(content.includes('motion-reduce:transform-none'), 'Must respect motion-reduce preference');

  // Check semantic markup
  assert.ok(content.includes('<footer'), 'Must use semantic <footer>');
  assert.ok(content.includes('<nav aria-label='), 'Must use semantic <nav> with aria-label');
  assert.ok(content.includes('min-h-['), 'Must specify accessible touch target heights');
});

test('Footer Redesign: English and Hindi dictionary parity', () => {
  const enKeys = Object.keys(en.footer);
  const hiKeys = Object.keys(hi.footer);

  assert.deepEqual(enKeys.sort(), hiKeys.sort(), 'English and Hindi footer dictionary keys must match exactly');

  for (const key of enKeys) {
    assert.ok(en.footer[key], `English footer.${key} must not be empty`);
    assert.ok(hi.footer[key], `Hindi footer.${key} must not be empty`);
  }

  // Factual location check
  assert.ok(en.footer.locationLabel.includes('Ratlam'), 'English location must reference Ratlam');
  assert.ok(hi.footer.locationLabel.includes('रतलाम'), 'Hindi location must reference रतलाम');
});

test('Footer Redesign: "Back to top" link, top anchor target, and reduced-motion support', () => {
  const content = fs.readFileSync(footerPath, 'utf8');
  assert.ok(content.includes('<BackToTopLink locale={locale} />'), 'Footer must render BackToTopLink');

  const backToTopFile = path.join(projectRoot, 'src', 'components', 'layout', 'BackToTopLink.tsx');
  assert.ok(fs.existsSync(backToTopFile), 'BackToTopLink component file must exist');
  const bttContent = fs.readFileSync(backToTopFile, 'utf8');

  // Semantic anchor to #top
  assert.ok(bttContent.includes('href="#top"'), 'BackToTopLink must be a semantic anchor pointing to #top');
  assert.ok(bttContent.includes('dict.footer.backToTop'), 'BackToTopLink must display localized backToTop label');
  assert.ok(bttContent.includes('prefers-reduced-motion'), 'BackToTopLink must respect prefers-reduced-motion');
  assert.ok(bttContent.includes("prefersReducedMotion ? 'auto' : 'smooth'"), 'Must use instant auto scroll for reduced-motion and smooth otherwise');
  assert.ok(bttContent.includes('focus-visible:ring-2'), 'Must provide visible keyboard focus state');

  // Top anchor target in shared layout
  const layoutFile = path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutFile, 'utf8');
  assert.ok(layoutContent.includes('id="top"'), 'Shared layout must provide reliable id="top" target across all routes');

  // Exact dictionary translations
  assert.equal(en.footer.backToTop, 'Back to top', 'English backToTop must be "Back to top"');
  assert.equal(hi.footer.backToTop, 'ऊपर जाएँ', 'Hindi backToTop must be "ऊपर जाएँ"');
});
