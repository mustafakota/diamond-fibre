import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';

const projectRoot = process.cwd();
const storyPath = path.join(projectRoot, 'src', 'app', '[locale]', 'our-story', 'page.tsx');

test('Our Story Redesign: Unfinished SVG and PENDING banner are completely removed', () => {
  const content = fs.readFileSync(storyPath, 'utf8');

  assert.ok(!content.includes('ratlam-heritage.svg'), 'ratlam-heritage.svg must not be referenced');
  assert.ok(!content.includes('PENDING APPROVED PUBLIC PHOTOS'), 'Pending photos banner must not exist');
  assert.ok(!content.includes('RATLAM FACILITY CAPABILITIES'), 'Old facility capabilities banner text must not exist');
});

test('Our Story Redesign: Generic icon illustration and oversized containers are removed', () => {
  const content = fs.readFileSync(storyPath, 'utf8');

  // Verify generic icons are not imported or rendered
  assert.ok(!content.includes('Scissors'), 'Generic Scissors icon must not be used');
  assert.ok(!content.includes('Layers'), 'Generic Layers icon must not be used');
  assert.ok(!content.includes('PackageCheck'), 'Generic PackageCheck icon must not be used');
});

test('Our Story Redesign: Realistic authentic photography grid is mounted', () => {
  const content = fs.readFileSync(storyPath, 'utf8');

  assert.ok(
    content.includes('wholesale-mattress-inventory-stack.webp'),
    'Must mount finished mattress inventory photography as lead image'
  );
  assert.ok(
    content.includes('craft-quilting-macro-stitch.webp'),
    'Must mount channel quilting macro stitch photography'
  );
  assert.ok(
    content.includes('craft-tufting-piped-border.webp'),
    'Must mount reinforced tufting and piped border photography'
  );

  // Check section heading and captions
  assert.ok(content.includes('howItComesTogetherHeading'), 'Must render section heading');
  assert.ok(content.includes('leadImageCaption'), 'Must render lead image caption');
  assert.ok(content.includes('quiltingCaption'), 'Must render quilting detail caption');
  assert.ok(content.includes('borderCaption'), 'Must render border detail caption');
});

test('Our Story Redesign: Factual 4-part construction steps replace generic icon cards', () => {
  const content = fs.readFileSync(storyPath, 'utf8');

  assert.ok(content.includes('step1Title'), 'Must include stitching title');
  assert.ok(content.includes('step2Title'), 'Must include filling title');
  assert.ok(content.includes('step3Title'), 'Must include quilting title');
  assert.ok(content.includes('step4Title'), 'Must include packing title');
});

test('Our Story Redesign: English and Hindi dictionary parity', () => {
  const enStoryKeys = Object.keys(en.story);
  const hiStoryKeys = Object.keys(hi.story);

  assert.deepEqual(enStoryKeys.sort(), hiStoryKeys.sort(), 'Story dictionary keys must match in en and hi');

  for (const k of enStoryKeys) {
    assert.ok(en.story[k], `en.story.${k} must not be empty`);
    assert.ok(hi.story[k], `hi.story.${k} must not be empty`);
  }

  // Check specific required copy
  assert.equal(en.story.howItComesTogetherHeading, 'How Our Bedding Comes Together');
  assert.equal(hi.story.howItComesTogetherHeading, 'हमारी बेडिंग कैसे तैयार होती है');
});
