import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const INTRO_FILE = path.resolve('src/components/home/FabricBrandIntro.tsx');
const HOMEPAGE_FILE = path.resolve('src/app/[locale]/page.tsx');
const GLOBALS_CSS = path.resolve('src/app/globals.css');

test('FabricBrandIntro: Component file exists and exports FabricBrandIntro', () => {
  assert.ok(fs.existsSync(INTRO_FILE), 'FabricBrandIntro.tsx must exist');
  const content = fs.readFileSync(INTRO_FILE, 'utf-8');
  assert.ok(content.includes('export const FabricBrandIntro'), 'Must export FabricBrandIntro');
  assert.ok(content.includes("'use client'"), 'Must be a client component');
});

test('FabricBrandIntro: Uses session-scoped storage key and safe exception handling', () => {
  const content = fs.readFileSync(INTRO_FILE, 'utf-8');
  assert.ok(content.includes('diamond_fibre_intro_seen'), 'Must use diamond_fibre_intro_seen key');
  assert.ok(content.includes('sessionStorage.getItem'), 'Must read from sessionStorage');
  assert.ok(content.includes('sessionStorage.setItem'), 'Must write to sessionStorage');
  assert.ok(!content.includes('localStorage'), 'Must NOT use localStorage (session only)');
  assert.ok(content.includes('try {') && content.includes('catch'), 'Must wrap storage calls in try/catch');
});

test('FabricBrandIntro: Respects prefers-reduced-motion', () => {
  const content = fs.readFileSync(INTRO_FILE, 'utf-8');
  assert.ok(
    content.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"),
    'Must check prefers-reduced-motion'
  );
});

test('FabricBrandIntro: Uses genuine transparent Diamond Fibre symbol asset', () => {
  const content = fs.readFileSync(INTRO_FILE, 'utf-8');
  assert.ok(
    content.includes('/images/logo/diamond-fibre-symbol.png'),
    'Must reference diamond-fibre-symbol.png'
  );
  assert.ok(
    fs.existsSync('public/images/logo/diamond-fibre-symbol.png'),
    'Asset public/images/logo/diamond-fibre-symbol.png must exist'
  );
});

test('FabricBrandIntro: Mounted only on the homepage', () => {
  const homepageContent = fs.readFileSync(HOMEPAGE_FILE, 'utf-8');
  assert.ok(
    homepageContent.includes('<FabricBrandIntro'),
    'HomePage must mount FabricBrandIntro'
  );

  // Subpages must not mount FabricBrandIntro
  const contactContent = fs.readFileSync('src/app/[locale]/contact/page.tsx', 'utf-8');
  assert.ok(
    !contactContent.includes('FabricBrandIntro'),
    'Contact page must not mount FabricBrandIntro'
  );

  const wholesaleContent = fs.readFileSync('src/app/[locale]/wholesale/page.tsx', 'utf-8');
  assert.ok(
    !wholesaleContent.includes('FabricBrandIntro'),
    'Wholesale page must not mount FabricBrandIntro'
  );
});

test('FabricBrandIntro: CSS keyframes and reduced-motion overrides exist in globals.css', () => {
  const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
  assert.ok(css.includes('@keyframes fabricReveal'), 'globals.css must define fabricReveal');
  assert.ok(css.includes('@keyframes fabricAccent'), 'globals.css must define fabricAccent');
  assert.ok(css.includes('.animate-fabric-reveal'), 'globals.css must define .animate-fabric-reveal');
  assert.ok(css.includes('.animate-fabric-accent'), 'globals.css must define .animate-fabric-accent');
});
