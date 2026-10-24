import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

test('Google Search Console HTML Verification: Metadata Configuration in src/app/layout.tsx', () => {
  const layoutPath = path.join(ROOT_DIR, 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Verify verification object exists in metadata
  assert.match(
    layoutContent,
    /verification:\s*\{[^}]*google:\s*['"]__dXrdI16pfeAmjzqS4nNuocrCO3JJ58Jtx9Iyiha24['"]/s,
    'Root layout metadata must configure verification.google with the exact token'
  );
});

test('Google Search Console HTML Verification: Prerendered HTML <head> contains exact single tag', () => {
  const enHtmlPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'en.html');
  const hiHtmlPath = path.join(ROOT_DIR, '.next', 'server', 'app', 'hi.html');

  assert.ok(fs.existsSync(enHtmlPath), 'en.html must exist in .next/server/app/');
  assert.ok(fs.existsSync(hiHtmlPath), 'hi.html must exist in .next/server/app/');

  const enHtml = fs.readFileSync(enHtmlPath, 'utf8');
  const hiHtml = fs.readFileSync(hiHtmlPath, 'utf8');

  // Extract <head> section
  const enHeadMatch = enHtml.match(/<head>([\s\S]*?)<\/head>/);
  assert.ok(enHeadMatch, '<head> must exist in English homepage');
  const enHead = enHeadMatch[1];

  const hiHeadMatch = hiHtml.match(/<head>([\s\S]*?)<\/head>/);
  assert.ok(hiHeadMatch, '<head> must exist in Hindi homepage');
  const hiHead = hiHeadMatch[1];

  // Regex for the exact meta tag
  const exactMetaRegex = /<meta\s+name=["']google-site-verification["']\s+content=["']__dXrdI16pfeAmjzqS4nNuocrCO3JJ58Jtx9Iyiha24["']\s*\/?>/g;

  const enMatches = enHead.match(exactMetaRegex) || [];
  assert.equal(enMatches.length, 1, 'English homepage <head> must contain exactly one google-site-verification meta tag');

  const hiMatches = hiHead.match(exactMetaRegex) || [];
  assert.equal(hiMatches.length, 1, 'Hindi homepage <head> must contain exactly one google-site-verification meta tag');

  // Ensure no other verification tags exist in <head>
  const anyVerificationRegex = /google-site-verification/g;
  assert.equal((enHead.match(anyVerificationRegex) || []).length, 1, 'No duplicate google-site-verification tags in English <head>');
  assert.equal((hiHead.match(anyVerificationRegex) || []).length, 1, 'No duplicate google-site-verification tags in Hindi <head>');

  // Ensure canonicals, hreflang, Open Graph, and Twitter metadata remain intact
  assert.match(enHead, /<link[^>]+rel=["']canonical["'][^>]+href=["'](http:\/\/localhost:3000|https:\/\/diamondfibre\.shop)\/en["']/);
  assert.match(enHead, /<link[^>]+hrefLang=["']en["']/);
  assert.match(enHead, /<link[^>]+hrefLang=["']hi["']/);
  assert.match(enHead, /<meta\s+property=["']og:title["']/);
  assert.match(enHead, /<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["']/);
});
