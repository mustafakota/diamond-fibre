import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { CATEGORIES_DATA } from '../src/content/catalog.ts';

const RETOUCHED_DIR = path.resolve('public/images/retouched');
const ORIGINAL_DIR = path.resolve('public/images');

const EXPECTED_IMAGES = [
  'hero/editorial-comfort-hero.webp',
  'mattresses/hero-mattress-maroon-boxed.webp',
  'mattresses/mattress-mint-perspective.webp',
  'mattresses/mattress-stacked-boxed.webp',
  'mattresses/mattress-room-stacked.webp',
  'mattresses/mattress-assorted-stack.webp',
  'gaddas/hero-gadda-sage-botanical.webp',
  'gaddas/gadda-rose-tufted-profile.webp',
  'gaddas/gadda-red-tartan-profile.webp',
  'gaddas/gadda-starburst-geo.webp',
  'gaddas/gadda-dusty-rose-corner.webp',
  'pillows/hero-pillow-retail-floral.webp',
  'pillows/pillow-commercial-strapped-bundle.webp',
  'pillows/pillow-wholesale-bundle-purple.webp',
  'pillows/pillow-botanical-packaged.webp',
  'pillows/pillow-polka-dot-packaged.webp',
  'razais/hero-razai-patchwork-terracotta.webp',
  'razai-gold-bridal-brocade.webp', // in razais
  'razais/razai-blue-diamond-ikat.webp',
  'razais/razai-crimson-paisley.webp',
  'razais/razai-blue-plaid-fold.webp',
  'razais/razai-purple-floral-stack.webp',
  'blankets/hero-blanket-wine-mink-embossed.webp',
  'blankets/blanket-lavender-fleece.webp',
  'blankets/blanket-pink-floral-plush.webp',
  'blankets/blanket-wine-floral-spread.webp',
  'blankets/blanket-wine-folded-square.webp',
  'wholesale/wholesale-mattress-inventory-stack.webp',
  'wholesale/wholesale-pillow-packs-strapped.webp',
  'wholesale/wholesale-assorted-batch-stack.webp',
  'story/craft-quilting-macro-stitch.webp',
  'story/craft-tufting-piped-border.webp'
];

test('Photography Art Direction: 100% of original source photos are preserved non-destructively', () => {
  for (let img of EXPECTED_IMAGES) {
    if (img === 'razai-gold-bridal-brocade.webp') img = 'razais/' + img;
    const origPath = path.join(ORIGINAL_DIR, img);
    assert.ok(fs.existsSync(origPath), `Original source photograph must exist: ${origPath}`);
    assert.ok(fs.statSync(origPath).size > 0, `Original file must not be empty: ${origPath}`);
  }
});

test('Photography Art Direction: All 32 retouched derivative photos exist in public/images/retouched/', async () => {
  for (let img of EXPECTED_IMAGES) {
    if (img === 'razai-gold-bridal-brocade.webp') img = 'razais/' + img;
    const retPath = path.join(RETOUCHED_DIR, img);
    assert.ok(fs.existsSync(retPath), `Retouched derivative must exist: ${retPath}`);

    // Verify valid image metadata with sharp
    const meta = await sharp(retPath).metadata();
    assert.strictEqual(meta.format, 'webp', `Image must be valid WebP: ${img}`);
    assert.ok(meta.width > 500, `Width must be high-res: ${meta.width}`);
    assert.ok(meta.height > 400, `Height must be high-res: ${meta.height}`);
  }
});

test('Photography Art Direction: All catalog representative images resolve to existing retouched files', () => {
  for (const [key, category] of Object.entries(CATEGORIES_DATA)) {
    for (const rep of category.representativeImages) {
      assert.ok(
        rep.src.startsWith('/images/retouched/'),
        `Image ${rep.src} in category ${key} must point to /images/retouched/`
      );
      const diskPath = path.join('public', rep.src.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Catalog image file must exist on disk: ${diskPath}`);
      assert.ok(rep.alt.en && rep.alt.en.length > 10, 'Must have meaningful English alt text');
      assert.ok(rep.alt.hi && rep.alt.hi.length > 10, 'Must have meaningful Hindi alt text');
    }
  }
});

test('Photography Art Direction: Rotated photographs are properly re-oriented to natural spread', async () => {
  // Crimson paisley was shot rotated sideways (1440w x 1080h)
  // Retouched derivative must be upright vertical bedspread (height > width)
  const crimsonMeta = await sharp(path.join(RETOUCHED_DIR, 'razais/razai-crimson-paisley.webp')).metadata();
  assert.ok(
    crimsonMeta.height > crimsonMeta.width,
    `Crimson paisley must be oriented vertically (height ${crimsonMeta.height} > width ${crimsonMeta.width})`
  );

  // Blue plaid fold was shot sideways (1440w x 1080h)
  // Retouched derivative must be upright vertical fold (height > width)
  const bluePlaidMeta = await sharp(path.join(RETOUCHED_DIR, 'razais/razai-blue-plaid-fold.webp')).metadata();
  assert.ok(
    bluePlaidMeta.height > bluePlaidMeta.width,
    `Blue plaid must be oriented vertically (height ${bluePlaidMeta.height} > width ${bluePlaidMeta.width})`
  );

  // Patchwork terracotta was shot sideways (1440w x 1012h)
  const patchworkMeta = await sharp(path.join(RETOUCHED_DIR, 'razais/hero-razai-patchwork-terracotta.webp')).metadata();
  assert.ok(
    patchworkMeta.height > patchworkMeta.width,
    `Patchwork razai must be oriented vertically (height ${patchworkMeta.height} > width ${patchworkMeta.width})`
  );
});

test('Photography Art Direction: Intrusions and floor expanse are tightly cropped out', async () => {
  // Wine floral spread had 2 people standing at top and feet at bottom
  // Original height: 1707. Retouched height: 1030 (40% cropped out)
  const spreadMeta = await sharp(path.join(RETOUCHED_DIR, 'blankets/blanket-wine-floral-spread.webp')).metadata();
  assert.ok(spreadMeta.height < 1200, 'Wine floral spread must crop out top and bottom standing people');

  // Commercial strapped pillow bundle had a white-socked foot at top
  // Original height: 1680. Retouched height: 1460 (foot cropped out)
  const bundleMeta = await sharp(path.join(RETOUCHED_DIR, 'pillows/pillow-commercial-strapped-bundle.webp')).metadata();
  assert.ok(bundleMeta.height <= 1500, 'Commercial strapped bundle must crop out top foot');

  // Room stacked mattresses had 60%+ empty grey floor
  // Original height: 890. Retouched height: 580 (floor and wall switches cropped out)
  const roomMeta = await sharp(path.join(RETOUCHED_DIR, 'mattresses/mattress-room-stacked.webp')).metadata();
  assert.ok(roomMeta.height <= 600, 'Stacked mattress room photo must crop out bottom floor expanse');
});
