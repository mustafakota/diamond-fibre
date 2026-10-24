import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWholesaleEmailText,
  buildWholesaleEmailHtml,
  handleWholesaleSubmission,
} from '../src/lib/email/wholesale-email.ts';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';

// Mock Resend Client factory
function createMockResendClient() {
  const calls = [];
  return {
    calls,
    emails: {
      async send(params) {
        calls.push(params);
        return {
          data: { id: 'msg_wholesale_redesign_123' },
          error: null,
        };
      },
    },
  };
}

const mockEnv = {
  RESEND_API_KEY: 're_test_live_key_99999999999',
  WHOLESALE_RECIPIENT_EMAIL: 'owner.diamondfibre@gmail.com',
  WHOLESALE_FROM_EMAIL: 'Diamond Fibre <wholesale@diamondfibre.com>',
};

test('Wholesale Redesign: Email templates format cleanly without Purchase Type remnants', () => {
  const payload = {
    fullName: 'Sunil Patel',
    businessName: 'Patel Home Comforts',
    mobileNumber: '9826012345',
    preferredContact: 'whatsapp',
    categories: ['mattresses', 'razais'],
    estimatedQuantity: '50–100 units',
    destinationLocation: 'Ujjain, MP',
    notes: 'Seasonal stock enquiry',
  };

  const text = buildWholesaleEmailText(payload);
  assert.equal(text.includes('Purchase Type:'), false, 'Email text must not contain Purchase Type');
  assert.ok(text.includes('Sunil Patel'));
  assert.ok(text.includes('Patel Home Comforts'));
  assert.ok(text.includes('50–100 units'));

  const html = buildWholesaleEmailHtml(payload);
  assert.equal(html.includes('Purchase Type:'), false, 'Email HTML must not contain Purchase Type');
  assert.ok(html.includes('Sunil Patel'));
  assert.ok(html.includes('Patel Home Comforts'));
  assert.ok(html.includes('Ujjain, MP'));
});

test('Wholesale Redesign: Submission pipeline accepts payload without purchaseType', async () => {
  const mockClient = createMockResendClient();

  const payload = {
    fullName: 'Ramesh Jain',
    mobileNumber: '9425098765',
    preferredContact: 'whatsapp',
    categories: ['mattresses'],
    estimatedQuantity: '25–50 units',
  };

  const response = await handleWholesaleSubmission(payload, {
    env: mockEnv,
    resendClient: mockClient,
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.accepted, true);
  assert.equal(mockClient.calls.length, 1);

  const sent = mockClient.calls[0];
  assert.equal(sent.text.includes('Purchase Type:'), false);
  assert.ok(sent.text.includes('Ramesh Jain'));
  assert.ok(sent.html.includes('(Not provided)')); // Business name defaulted safely
});

test('Wholesale Redesign: Quantity dropdown selection, custom input toggle, and clearing logic', () => {
  const quantityOptions = [
    '1–24 units',
    '25–50 units',
    '51–100 units',
    '100+ units',
    'custom',
  ];

  // 1. Quantity left empty
  let selectedQuantity = '';
  let customQuantity = '';
  const getEffectiveQuantity = (selected, custom) => {
    if (selected === 'custom') {
      const trimmed = custom.trim();
      if (!trimmed) return '';
      return /\D/.test(trimmed) ? trimmed : `${trimmed} units`;
    }
    return selected;
  };

  assert.equal(getEffectiveQuantity(selectedQuantity, customQuantity), '');

  // 2. Preset dropdown selection
  selectedQuantity = '25–50 units';
  assert.equal(getEffectiveQuantity(selectedQuantity, customQuantity), '25–50 units');

  // 3. Custom quantity selection with numeric entry
  selectedQuantity = 'custom';
  customQuantity = '35';
  assert.equal(getEffectiveQuantity(selectedQuantity, customQuantity), '35 units');

  // 4. Custom quantity selection with descriptive text
  customQuantity = '40 mattresses and 20 pillows';
  assert.equal(getEffectiveQuantity(selectedQuantity, customQuantity), '40 mattresses and 20 pillows');

  // 5. Switching away from custom clears customQuantity
  const handleQuantitySelectChange = (newVal, currentCustom) => {
    return {
      selectedQuantity: newVal,
      customQuantity: newVal === 'custom' ? currentCustom : '',
    };
  };

  const switchedState = handleQuantitySelectChange('51–100 units', customQuantity);
  assert.equal(switchedState.selectedQuantity, '51–100 units');
  assert.equal(switchedState.customQuantity, '');

  // 6. Validation logic: custom quantity requires value if custom option chosen
  const validateQuantity = (selected, custom, locale = 'en') => {
    if (selected === 'custom' && !custom.trim()) {
      return locale === 'hi'
        ? 'कृपया अपनी अनुमानित मात्रा लिखें'
        : 'Please enter your approximate quantity';
    }
    return null;
  };

  assert.equal(validateQuantity('', ''), null); // Optional when unselected
  assert.equal(validateQuantity('25–50 units', ''), null); // Valid preset
  assert.equal(validateQuantity('custom', ''), 'Please enter your approximate quantity');
  assert.equal(validateQuantity('custom', '', 'hi'), 'कृपया अपनी अनुमानित मात्रा लिखें');
  assert.equal(validateQuantity('custom', '75'), null);
});

test('Wholesale Redesign: English and Hindi dictionary parity for all form keys', () => {
  const enDict = en.wholesale.form;
  const hiDict = hi.wholesale.form;

  // Stale Purchase Type keys must NOT exist
  assert.equal(enDict.purchaseTypeLabel, undefined, 'en.wholesale.form must not contain purchaseTypeLabel');
  assert.equal(hiDict.purchaseTypeLabel, undefined, 'hi.wholesale.form must not contain purchaseTypeLabel');
  assert.equal(enDict.purchaseTypeWholesale, undefined, 'en.wholesale.form must not contain purchaseTypeWholesale');
  assert.equal(hiDict.purchaseTypeWholesale, undefined, 'hi.wholesale.form must not contain purchaseTypeWholesale');
  assert.equal(enDict.businessRequiredForRetailers, undefined, 'en.wholesale.form must not contain businessRequiredForRetailers');
  assert.equal(hiDict.businessRequiredForRetailers, undefined, 'hi.wholesale.form must not contain businessRequiredForRetailers');

  const requiredKeys = [
    'heading',
    'subheading',
    'sectionContact',
    'sectionRequirements',
    'nameLabel',
    'namePlaceholder',
    'phoneLabel',
    'phonePlaceholder',
    'businessLabel',
    'businessPlaceholder',
    'businessOptional',
    'categoryLabel',
    'categoryInstruction',
    'quantityLabel',
    'quantityPlaceholder',
    'quantityOption1_24',
    'quantityOption25_50',
    'quantityOption51_100',
    'quantityOption100Plus',
    'quantityOptionCustom',
    'customQuantityLabel',
    'customQuantityPlaceholder',
    'locationLabel',
    'notesLabel',
    'submitButton',
    'submittingText',
    'successTitle',
    'successMessage',
    'errorMessage',
    'whatsappFallbackButton',
    'whatsappDirectConnect',
    'submitAnotherButton',
    'privacyNotice',
  ];

  for (const key of requiredKeys) {
    assert.ok(
      typeof enDict[key] === 'string' && enDict[key].length > 0,
      `Missing or empty English key: wholesale.form.${key}`
    );
    assert.ok(
      typeof hiDict[key] === 'string' && hiDict[key].length > 0,
      `Missing or empty Hindi key: wholesale.form.${key}`
    );
  }
});

test('Wholesale Redesign: Indian Mobile Number validation logic', () => {
  const sanitizeMobile = (val) => val.replace(/\D/g, '').replace(/^(?:91|0)/, '');
  const isValidMobile = (val) => /^[6-9]\d{9}$/.test(sanitizeMobile(val));

  // Valid Indian mobile numbers
  assert.equal(isValidMobile('9826012345'), true);
  assert.equal(isValidMobile('8123456789'), true);
  assert.equal(isValidMobile('7000123456'), true);
  assert.equal(isValidMobile('6234567890'), true);
  assert.equal(isValidMobile('+91 98260 12345'), true);
  assert.equal(isValidMobile('09826012345'), true);
  assert.equal(isValidMobile('919826012345'), true);

  // Invalid numbers
  assert.equal(isValidMobile('1234567890'), false); // Starts with 1
  assert.equal(isValidMobile('5551234567'), false); // Starts with 5
  assert.equal(isValidMobile('98260'), false); // Too short
  assert.equal(isValidMobile('9826012345000'), false); // Too long
  assert.equal(isValidMobile('abcdefghij'), false); // Letters
  assert.equal(isValidMobile(''), false); // Empty
});

test('Wholesale Redesign: Category selection and multi-category switching logic', () => {
  // Single selection mode
  let selectedCategories = ['mattresses'];
  const selectSingle = (cat) => {
    selectedCategories = [cat];
  };

  selectSingle('pillows');
  assert.deepEqual(selectedCategories, ['pillows']);

  // Multiple selection mode toggle
  const toggleMultiCategory = (current, cat) => {
    if (current.includes(cat)) {
      return current.filter((c) => c !== cat);
    }
    return [...current, cat];
  };

  let multi = ['mattresses'];
  multi = toggleMultiCategory(multi, 'pillows');
  assert.deepEqual(multi, ['mattresses', 'pillows']);
  multi = toggleMultiCategory(multi, 'mattresses');
  assert.deepEqual(multi, ['pillows']);
  multi = toggleMultiCategory(multi, 'razais');
  assert.deepEqual(multi, ['pillows', 'razais']);
});

test('Wholesale Redesign: 4-category multi-select toggling, deselecting, and validation', () => {
  const CORE_CATEGORIES = ['mattresses', 'pillows', 'razais', 'blankets'];

  // Multi-select toggle handler identical to WholesaleForm
  const toggleCategory = (prev, key) => {
    return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
  };

  // 1. Initial selection: only Mattresses / Gaddas
  let state = ['mattresses'];
  assert.equal(state.length, 1);
  assert.deepEqual(state, ['mattresses']);

  // 2. Select Mattresses and Pillows together (2 options)
  state = toggleCategory(state, 'pillows');
  assert.equal(state.length, 2);
  assert.deepEqual(state, ['mattresses', 'pillows']);

  // 3. Select three categories
  state = toggleCategory(state, 'razais');
  assert.equal(state.length, 3);
  assert.deepEqual(state, ['mattresses', 'pillows', 'razais']);

  // 4. Select all four categories
  state = toggleCategory(state, 'blankets');
  assert.equal(state.length, 4);
  assert.deepEqual(state.slice().sort(), [...CORE_CATEGORIES].sort());

  // 5. Deselect an option (pillows) without affecting others
  state = toggleCategory(state, 'pillows');
  assert.equal(state.length, 3);
  assert.deepEqual(state.slice().sort(), ['mattresses', 'razais', 'blankets'].sort());
  assert.equal(state.includes('pillows'), false);
  assert.equal(state.includes('mattresses'), true);
  assert.equal(state.includes('razais'), true);
  assert.equal(state.includes('blankets'), true);

  // 6. Deselect down to empty and test validation
  state = toggleCategory(state, 'mattresses');
  state = toggleCategory(state, 'razais');
  state = toggleCategory(state, 'blankets');
  assert.equal(state.length, 0);

  const validateCategories = (selected, locale) => {
    if (selected.length === 0) {
      return locale === 'hi'
        ? 'कृपया कम से कम एक उत्पाद श्रेणी चुनें'
        : 'Please select at least one product category';
    }
    return null;
  };

  assert.equal(validateCategories(state, 'en'), 'Please select at least one product category');
  assert.equal(validateCategories(state, 'hi'), 'कृपया कम से कम एक उत्पाद श्रेणी चुनें');

  // Re-selecting one category resolves validation error
  state = toggleCategory(state, 'mattresses');
  assert.equal(validateCategories(state, 'en'), null);
});

test('Wholesale Redesign: Category labels and instructions match specifications', () => {
  assert.equal(en.wholesale.form.categoryLabel, 'Product Category');
  assert.equal(en.wholesale.form.categoryInstruction, "Select all products you're interested in.");
  assert.equal(hi.wholesale.form.categoryLabel, 'उत्पाद श्रेणी');
  assert.equal(hi.wholesale.form.categoryInstruction, 'उन सभी उत्पादों को चुनें जिनमें आपकी रुचि है।');
});
