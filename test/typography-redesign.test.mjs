import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('Typography Redesign: fonts.ts configures Manrope and Noto Sans Devanagari fonts', () => {
  const fontsFile = path.join(projectRoot, 'src', 'lib', 'fonts.ts');
  assert.ok(fs.existsSync(fontsFile), 'fonts.ts must exist');
  const content = fs.readFileSync(fontsFile, 'utf8');

  // Manrope configuration
  assert.ok(content.includes('Manrope'), 'Must import Manrope from next/font/google');
  assert.ok(content.includes('--font-manrope'), 'Must declare --font-manrope CSS variable');
  assert.ok(content.includes("subsets: ['latin']"), 'Manrope must include latin subset');

  // Noto Sans Devanagari configuration
  assert.ok(content.includes('Noto_Sans_Devanagari'), 'Must import Noto_Sans_Devanagari from next/font/google');
  assert.ok(content.includes('--font-noto-devanagari'), 'Must declare --font-noto-devanagari CSS variable');
  assert.ok(content.includes('devanagari'), 'Noto Sans Devanagari must include devanagari subset');

  // Body fonts preserved
  assert.ok(content.includes('Inter'), 'Must preserve Inter for body typography');
});

test('Typography Redesign: Root layout mounts all font CSS variables', () => {
  const layoutFile = path.join(projectRoot, 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutFile, 'utf8');

  assert.ok(content.includes('manrope.variable'), 'RootLayout must mount manrope.variable on <html>');
  assert.ok(content.includes('inter.variable'), 'RootLayout must mount inter.variable on <html>');
  assert.ok(content.includes('notoSansDevanagari.variable'), 'RootLayout must mount notoSansDevanagari.variable on <html>');
});

test('Typography Redesign: globals.css sets up theme variables and language guards', () => {
  const cssFile = path.join(projectRoot, 'src', 'app', 'globals.css');
  const content = fs.readFileSync(cssFile, 'utf8');

  // Theme definitions
  assert.ok(content.includes('--font-manrope'), 'globals.css @theme must reference --font-manrope for --font-display');
  assert.ok(content.includes('--font-noto-devanagari'), 'globals.css @theme must reference --font-noto-devanagari');

  // Hindi display heading mapping
  assert.ok(content.includes('[lang="hi"] .font-display'), 'Must map [lang="hi"] .font-display to Hindi display font');
  assert.ok(content.includes('var(--font-hindi-display)'), 'Hindi headings must use --font-hindi-display');

  // Devanagari shirorekha guard
  assert.ok(
    content.includes('letter-spacing: normal !important') || content.includes('letter-spacing: normal'),
    'Must prevent letter-spacing from breaking Devanagari top stroke (shirorekha)'
  );
});

test('Typography Redesign: Preserves italic serif terracotta accent on homepage', () => {
  const homeFile = path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx');
  const content = fs.readFileSync(homeFile, 'utf8');

  assert.ok(content.includes('font-serif italic font-normal text-[var(--color-terracotta-600)]'), 'Must preserve italic serif terracotta headline accent');
});

test('Typography Redesign: Key routes use font-display with balanced semi-bold hierarchy', () => {
  const routes = [
    'src/app/[locale]/page.tsx',
    'src/app/[locale]/products/page.tsx',
    'src/app/[locale]/products/mattresses/page.tsx',
    'src/app/[locale]/products/pillows/page.tsx',
    'src/app/[locale]/products/razais/page.tsx',
    'src/app/[locale]/products/blankets/page.tsx',
    'src/app/[locale]/wholesale/page.tsx',
    'src/app/[locale]/our-story/page.tsx',
    'src/app/[locale]/contact/page.tsx',
  ];

  for (const route of routes) {
    const filePath = path.join(projectRoot, route);
    assert.ok(fs.existsSync(filePath), `${route} must exist`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(content.includes('font-display'), `${route} must use font-display for headings`);
    assert.ok(content.includes('font-semibold'), `${route} must use font-semibold for balanced hierarchy`);
    assert.ok(!content.includes('font-display font-bold'), `${route} must not use overly heavy font-bold display headings`);
  }
});
