import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const EXPECTED_PUB_ID = 'ca-pub-6323208093097316';
const EXPECTED_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${EXPECTED_PUB_ID}`;

test('Google AdSense Verification: Script Configuration in src/app/layout.tsx', () => {
  const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Verify <head> section exists in RootLayout
  assert.match(
    layoutContent,
    /<head>[\s\S]*?<\/head>/,
    'Root layout must contain a global <head> element'
  );

  // Verify the script tag inside <head>
  const headMatch = layoutContent.match(/<head>([\s\S]*?)<\/head>/);
  assert.ok(headMatch, '<head> element must exist in layout.tsx');
  const headContent = headMatch[1];

  // Verify exact publisher ID
  assert.ok(
    headContent.includes(EXPECTED_PUB_ID),
    `Head must contain the exact publisher ID ${EXPECTED_PUB_ID}`
  );

  // Verify exact script attributes
  assert.match(
    headContent,
    /<script\s+async\s+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-6323208093097316"\s+crossOrigin="anonymous"\s*\/>/,
    'Head must contain the exact AdSense verification script tag with async and crossOrigin'
  );

  // Verify no duplicate AdSense scripts in layout
  const scriptOccurrences = (layoutContent.match(/adsbygoogle\.js/g) || []).length;
  assert.equal(
    scriptOccurrences,
    1,
    'There must be exactly one AdSense script reference in layout.tsx'
  );
});

test('Google AdSense Verification: Prerendered HTML <head> contains exact single script across pages', () => {
  const enHtmlPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'en.html');
  const hiHtmlPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'hi.html');

  assert.ok(fs.existsSync(enHtmlPath), 'en.html must exist in .next/server/app/');
  assert.ok(fs.existsSync(hiHtmlPath), 'hi.html must exist in .next/server/app/');

  const testPages = [
    { name: 'English Homepage', path: enHtmlPath },
    { name: 'Hindi Homepage', path: hiHtmlPath },
    { name: 'English Products', path: path.join(ROOT_DIR, '.next', 'server', 'app', 'en', 'products.html') },
    { name: 'English Contact', path: path.join(ROOT_DIR, '.next', 'server', 'app', 'en', 'contact.html') },
    { name: 'English Wholesale', path: path.join(ROOT_DIR, '.next', 'server', 'app', 'en', 'wholesale.html') },
    { name: 'Hindi Mattresses', path: path.join(ROOT_DIR, '.next', 'server', 'app', 'hi', 'products', 'mattresses.html') },
  ];

  for (const page of testPages) {
    assert.ok(fs.existsSync(page.path), `${page.name} HTML file must exist`);
    const html = fs.readFileSync(page.path, 'utf8');

    // Extract <head> section
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    assert.ok(headMatch, `<head> must exist in ${page.name}`);
    const head = headMatch[1];

    // Check script in <head>
    const scriptRegex = /<script\s+async(?:="")?\s+src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-6323208093097316"\s+crossorigin="anonymous"><\/script>/g;
    const matches = head.match(scriptRegex) || [];

    assert.equal(
      matches.length,
      1,
      `${page.name} <head> must contain exactly one AdSense verification script`
    );

    // Verify publisher ID in head
    assert.ok(
      head.includes(EXPECTED_PUB_ID),
      `${page.name} <head> must include publisher ID ${EXPECTED_PUB_ID}`
    );
  }
});

test('Google AdSense Verification: Existing integrations and SEO metadata preserved', () => {
  const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Verify GoogleAnalytics and MicrosoftClarity remain present
  assert.match(layoutContent, /<GoogleAnalytics\s*\/>/);
  assert.match(layoutContent, /<MicrosoftClarity\s*\/>/);

  // Verify verification.google remains present
  assert.match(layoutContent, /google:\s*['"]__dXrdI16pfeAmjzqS4nNuocrCO3JJ58Jtx9Iyiha24['"]/);

  // Verify metadataBase and title remain present
  assert.match(layoutContent, /metadataBase:/);
  assert.match(layoutContent, /Diamond Fibre \| Bedding Manufacturer in Ratlam/);
});

