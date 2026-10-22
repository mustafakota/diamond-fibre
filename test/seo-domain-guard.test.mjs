import test from 'node:test';
import assert from 'node:assert/strict';

// Import domain validation functions directly
import {
  isPlaceholderOrInvalidDomain,
  isValidHttpUrl,
  getBaseUrl,
  DOMAIN_PLACEHOLDER,
} from '../src/lib/seo.ts';

test('SEO Domain Guard: detects placeholder and invalid domains', () => {
  assert.equal(isPlaceholderOrInvalidDomain(DOMAIN_PLACEHOLDER), true);
  assert.equal(isPlaceholderOrInvalidDomain('https://[CONFIRMED_PRODUCTION_DOMAIN]'), true);
  assert.equal(isPlaceholderOrInvalidDomain(''), true);
  assert.equal(isPlaceholderOrInvalidDomain(undefined), true);
  assert.equal(isPlaceholderOrInvalidDomain('https://sub.example.com'), true);
  assert.equal(isPlaceholderOrInvalidDomain('random-text-without-protocol'), true);

  // Valid domains must return false
  assert.equal(isPlaceholderOrInvalidDomain('https://diamondfibre.com'), false);
  assert.equal(isPlaceholderOrInvalidDomain('https://www.diamondfibre.com'), false);
  assert.equal(isPlaceholderOrInvalidDomain('http://localhost:3000'), false);
});

test('SEO Domain Guard: validates HTTP and HTTPS URLs', () => {
  assert.equal(isValidHttpUrl('https://diamondfibre.com'), true);
  assert.equal(isValidHttpUrl('http://localhost:3000'), true);
  assert.equal(isValidHttpUrl('ftp://diamondfibre.com'), false);
  assert.equal(isValidHttpUrl('not-a-url'), false);
  assert.equal(isValidHttpUrl(''), false);
});

test('SEO Domain Guard: throws critical error in production if placeholder domain is supplied', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_SITE_URL = DOMAIN_PLACEHOLDER;

    assert.throws(
      () => {
        getBaseUrl();
      },
      (err) => {
        return (
          err instanceof Error &&
          err.message.includes('CRITICAL PRODUCTION SEO CONFIGURATION ERROR') &&
          err.message.includes('[CONFIRMED_PRODUCTION_DOMAIN]')
        );
      }
    );
  } finally {
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  }
});

test('SEO Domain Guard: allows localhost fallback during development/local builds', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_SITE_URL = '';

    const url = getBaseUrl();
    assert.equal(url, 'http://localhost:3000');
  } finally {
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  }
});
