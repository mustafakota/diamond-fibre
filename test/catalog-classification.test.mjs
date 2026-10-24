import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES_DATA } from '../src/content/catalog.ts';

test('Product Catalog Classification: Crimson Winter Paisley is assigned to Mattresses', () => {
  const mattressImages = CATEGORIES_DATA.mattresses.representativeImages.map((img) => img.src);
  const razaiImages = CATEGORIES_DATA.razais.representativeImages.map((img) => img.src);

  // Must be in mattresses
  assert.ok(
    mattressImages.some((src) => src.includes('razai-crimson-paisley.webp')),
    'Crimson Winter Paisley must be in mattresses category'
  );

  // Must NOT be in razais
  assert.ok(
    !razaiImages.some((src) => src.includes('razai-crimson-paisley.webp')),
    'Crimson Winter Paisley must not be in razais category'
  );
});

test('Product Catalog Classification: Classic Bound Plaid is assigned to Mattresses', () => {
  const mattressImages = CATEGORIES_DATA.mattresses.representativeImages.map((img) => img.src);
  const razaiImages = CATEGORIES_DATA.razais.representativeImages.map((img) => img.src);

  // Must be in mattresses
  assert.ok(
    mattressImages.some((src) => src.includes('razai-blue-plaid-fold.webp')),
    'Classic Bound Plaid must be in mattresses category'
  );

  // Must NOT be in razais
  assert.ok(
    !razaiImages.some((src) => src.includes('razai-blue-plaid-fold.webp')),
    'Classic Bound Plaid must not be in razais category'
  );
});

test('Product Catalog Classification: Lightweight Floral Fleece is assigned to Razais', () => {
  const razaiImages = CATEGORIES_DATA.razais.representativeImages.map((img) => img.src);
  const blanketImages = CATEGORIES_DATA.blankets.representativeImages.map((img) => img.src);

  // Must be in razais
  assert.ok(
    razaiImages.some((src) => src.includes('blanket-lavender-fleece.webp')),
    'Lightweight Floral Fleece must be in razais category'
  );

  // Must NOT be in blankets
  assert.ok(
    !blanketImages.some((src) => src.includes('blanket-lavender-fleece.webp')),
    'Lightweight Floral Fleece must not be in blankets category'
  );
});

test('Product Catalog Classification: Localized alt text and captions are preserved', () => {
  const crimson = CATEGORIES_DATA.mattresses.representativeImages.find((img) =>
    img.src.includes('razai-crimson-paisley.webp')
  );
  assert.ok(crimson, 'Crimson item found');
  assert.ok(crimson.alt.en && crimson.alt.hi, 'Crimson has localized alt text');
  assert.ok(crimson.caption?.en && crimson.caption?.hi, 'Crimson has localized captions');

  const plaid = CATEGORIES_DATA.mattresses.representativeImages.find((img) =>
    img.src.includes('razai-blue-plaid-fold.webp')
  );
  assert.ok(plaid, 'Plaid item found');
  assert.ok(plaid.alt.en && plaid.alt.hi, 'Plaid has localized alt text');
  assert.ok(plaid.caption?.en && plaid.caption?.hi, 'Plaid has localized captions');

  const fleece = CATEGORIES_DATA.razais.representativeImages.find((img) =>
    img.src.includes('blanket-lavender-fleece.webp')
  );
  assert.ok(fleece, 'Fleece item found');
  assert.ok(fleece.alt.en && fleece.alt.hi, 'Fleece has localized alt text');
  assert.ok(fleece.caption?.en && fleece.caption?.hi, 'Fleece has localized captions');
});
