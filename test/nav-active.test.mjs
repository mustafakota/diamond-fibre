import test from 'node:test';
import assert from 'node:assert/strict';
import { isNavActive } from '../src/lib/nav.ts';

test('isNavActive: Wholesale & Retail highlight rules', () => {
  // Must be active on /en/wholesale and /hi/wholesale
  assert.equal(isNavActive('/en/wholesale', 'en', 'wholesale'), true);
  assert.equal(isNavActive('/en/wholesale/', 'en', 'wholesale'), true);
  assert.equal(isNavActive('/hi/wholesale', 'hi', 'wholesale'), true);
  assert.equal(isNavActive('/hi/wholesale/', 'hi', 'wholesale'), true);

  // Must NOT be active on any other page
  assert.equal(isNavActive('/en', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/hi', 'hi', 'wholesale'), false);
  assert.equal(isNavActive('/en/products', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/products/mattresses', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/products/pillows', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/products/razais', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/products/blankets', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/our-story', 'en', 'wholesale'), false);
  assert.equal(isNavActive('/en/contact', 'en', 'wholesale'), false);
});

test('isNavActive: Home route matching', () => {
  assert.equal(isNavActive('/en', 'en', 'home'), true);
  assert.equal(isNavActive('/en/', 'en', 'home'), true);
  assert.equal(isNavActive('/hi', 'hi', 'home'), true);
  assert.equal(isNavActive('/hi/', 'hi', 'home'), true);
  assert.equal(isNavActive('/', 'en', 'home'), true);

  // Must NOT be active on sub-routes
  assert.equal(isNavActive('/en/products', 'en', 'home'), false);
  assert.equal(isNavActive('/en/wholesale', 'en', 'home'), false);
  assert.equal(isNavActive('/en/our-story', 'en', 'home'), false);
  assert.equal(isNavActive('/en/contact', 'en', 'home'), false);
});

test('isNavActive: Products parent and child route matching', () => {
  // Products parent link should be active on overview and child category routes
  assert.equal(isNavActive('/en/products', 'en', 'products'), true);
  assert.equal(isNavActive('/en/products/', 'en', 'products'), true);
  assert.equal(isNavActive('/hi/products', 'hi', 'products'), true);
  assert.equal(isNavActive('/en/products/mattresses', 'en', 'products'), true);
  assert.equal(isNavActive('/en/products/pillows', 'en', 'products'), true);
  assert.equal(isNavActive('/en/products/razais', 'en', 'products'), true);
  assert.equal(isNavActive('/en/products/blankets', 'en', 'products'), true);

  // Products should NOT be active on other main pages
  assert.equal(isNavActive('/en', 'en', 'products'), false);
  assert.equal(isNavActive('/en/wholesale', 'en', 'products'), false);
  assert.equal(isNavActive('/en/our-story', 'en', 'products'), false);
  assert.equal(isNavActive('/en/contact', 'en', 'products'), false);
});

test('isNavActive: Individual Category route matching', () => {
  // Mattresses
  assert.equal(isNavActive('/en/products/mattresses', 'en', 'mattresses'), true);
  assert.equal(isNavActive('/hi/products/mattresses', 'hi', 'mattresses'), true);
  assert.equal(isNavActive('/en/products/pillows', 'en', 'mattresses'), false);
  assert.equal(isNavActive('/en/products', 'en', 'mattresses'), false);

  // Pillows
  assert.equal(isNavActive('/en/products/pillows', 'en', 'pillows'), true);
  assert.equal(isNavActive('/hi/products/pillows', 'hi', 'pillows'), true);
  assert.equal(isNavActive('/en/products/mattresses', 'en', 'pillows'), false);

  // Razais
  assert.equal(isNavActive('/en/products/razais', 'en', 'razais'), true);
  assert.equal(isNavActive('/hi/products/razais', 'hi', 'razais'), true);
  assert.equal(isNavActive('/en/products/blankets', 'en', 'razais'), false);

  // Blankets
  assert.equal(isNavActive('/en/products/blankets', 'en', 'blankets'), true);
  assert.equal(isNavActive('/hi/products/blankets', 'hi', 'blankets'), true);
  assert.equal(isNavActive('/en/products/razais', 'en', 'blankets'), false);
});

test('isNavActive: Our Story and Contact route matching', () => {
  // Our Story
  assert.equal(isNavActive('/en/our-story', 'en', 'ourStory'), true);
  assert.equal(isNavActive('/hi/our-story', 'hi', 'ourStory'), true);
  assert.equal(isNavActive('/en/contact', 'en', 'ourStory'), false);
  assert.equal(isNavActive('/en/wholesale', 'en', 'ourStory'), false);

  // Contact
  assert.equal(isNavActive('/en/contact', 'en', 'contact'), true);
  assert.equal(isNavActive('/hi/contact', 'hi', 'contact'), true);
  assert.equal(isNavActive('/en/our-story', 'en', 'contact'), false);
  assert.equal(isNavActive('/en/wholesale', 'en', 'contact'), false);
});
