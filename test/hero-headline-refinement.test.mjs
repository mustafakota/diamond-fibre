import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';

const projectRoot = process.cwd();
const homepagePath = path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx');

test('Hero Headline Refinement: Badge is completely removed from hero and dictionaries', () => {
  const content = fs.readFileSync(homepagePath, 'utf8');

  // Verify badge is removed from hero
  assert.ok(!content.includes('The Comfort Revolution'), 'Badge text must not exist in hero');
  assert.ok(!content.includes('द कम्फर्ट रिवोल्यूशन'), 'Hindi badge text must not exist in hero');
  assert.ok(!content.includes('rounded-full bg-[var(--color-sand-300)]'), 'Badge container must not exist');

  // Verify dictionaries do not contain old badge in hero
  assert.equal(en.home.hero.badge, undefined, 'en.home.hero.badge must not be defined');
  assert.equal(hi.home.hero.badge, undefined, 'hi.home.hero.badge must not be defined');
});

test('Hero Headline Refinement: English headline and location statement', () => {
  assert.equal(en.home.hero.headlineMain, 'Mattresses, Razais and More.');
  assert.equal(en.home.hero.headlineLocation, 'Manufactured in Ratlam.');
  assert.ok(
    en.home.hero.headline.includes('Mattresses, Razais and More.'),
    'Full headline must include primary statement'
  );
  assert.ok(
    en.home.hero.headline.includes('Manufactured in Ratlam.'),
    'Full headline must include location statement'
  );
});

test('Hero Headline Refinement: Hindi headline and location statement', () => {
  assert.equal(hi.home.hero.headlineMain, 'गद्दे, रज़ाइयां और बहुत कुछ।');
  assert.equal(hi.home.hero.headlineLocation, 'रतलाम में निर्मित।');
  assert.ok(
    hi.home.hero.headline.includes('गद्दे, रज़ाइयां और बहुत कुछ।'),
    'Full Hindi headline must include primary statement'
  );
  assert.ok(
    hi.home.hero.headline.includes('रतलाम में निर्मित।'),
    'Full Hindi headline must include location statement'
  );
});

test('Hero Headline Refinement: Supporting paragraph is factual and covers home customers, retailers and bulk buyers', () => {
  // English subheadline check
  const enSub = en.home.hero.subheadline.toLowerCase();
  assert.ok(enSub.includes('ratlam'), 'Must mention Ratlam');
  assert.ok(enSub.includes('mattresses') && enSub.includes('razais'), 'Must mention core products');
  assert.ok(enSub.includes('home customers') || enSub.includes('retail'), 'Must mention home/retail customers');
  assert.ok(enSub.includes('retailers') || enSub.includes('bulk buyers'), 'Must mention trade/bulk buyers');

  // Hindi subheadline check
  const hiSub = hi.home.hero.subheadline;
  assert.ok(hiSub.includes('रतलाम'), 'Must mention रतलाम');
  assert.ok(hiSub.includes('गद्दे') && hiSub.includes('रज़ाइयां'), 'Must mention गद्दे and रज़ाइयां');
  assert.ok(hiSub.includes('घरेलू') || hiSub.includes('खुदरा'), 'Must mention domestic/retail');
  assert.ok(hiSub.includes('थोक'), 'Must mention wholesale/bulk');
});

test('Hero Headline Refinement: Visual contrast and layout preservation in page.tsx', () => {
  const content = fs.readFileSync(homepagePath, 'utf8');

  assert.ok(
    (content.includes('font-display font-semibold') || content.includes('font-display font-bold')) &&
      content.includes('text-[var(--color-carbon-900)]'),
    'Primary headline must use dark display styling'
  );
  assert.ok(
    content.includes('font-serif italic font-normal text-[var(--color-terracotta-600)]'),
    'Location statement must preserve terracotta italic styling'
  );

  // Check image and overlay card preservation
  assert.ok(
    content.includes('editorial-comfort-hero.webp'),
    'Must preserve hero image'
  );
  assert.ok(content.includes('craft-quilting-macro-stitch.webp'), 'Must preserve quilting detail card');
  assert.ok(content.includes('priority={true}'), 'Hero image must keep priority loading');
});
