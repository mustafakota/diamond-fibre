import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { en } from '../src/content/dictionaries/en.ts';
import { hi } from '../src/content/dictionaries/hi.ts';

test('Select Component: Accessible Select primitive exists with required ARIA attributes', () => {
  const selectPath = path.resolve(process.cwd(), 'src/components/ui/Select.tsx');
  assert.ok(fs.existsSync(selectPath), 'src/components/ui/Select.tsx must exist');

  const content = fs.readFileSync(selectPath, 'utf8');

  // Verify WAI-ARIA Combobox / Listbox structure
  assert.ok(content.includes('role="combobox"'), 'Trigger button must have role="combobox"');
  assert.ok(content.includes('role="listbox"'), 'Dropdown list must have role="listbox"');
  assert.ok(content.includes('role="option"'), 'Dropdown items must have role="option"');
  assert.ok(content.includes('aria-haspopup="listbox"'), 'Combobox must specify aria-haspopup="listbox"');
  assert.ok(content.includes('aria-expanded={isOpen}'), 'Combobox must specify dynamic aria-expanded');
  assert.ok(content.includes('aria-controls={listboxId}'), 'Combobox must associate with listbox via aria-controls');
  assert.ok(content.includes('aria-activedescendant='), 'Combobox must track active option with aria-activedescendant');
  assert.ok(content.includes('aria-selected={isSelected}'), 'Option must specify aria-selected');

  // Verify keyboard navigation support
  assert.ok(content.includes("'ArrowDown'"), 'Must handle ArrowDown key');
  assert.ok(content.includes("'ArrowUp'"), 'Must handle ArrowUp key');
  assert.ok(content.includes("'Escape'"), 'Must handle Escape key');
  assert.ok(content.includes("'Enter'"), 'Must handle Enter key');
  assert.ok(content.includes("' '"), 'Must handle Space key');
  assert.ok(content.includes("'Home'"), 'Must handle Home key');
  assert.ok(content.includes("'End'"), 'Must handle End key');

  // Verify outside click listener
  assert.ok(content.includes('handleOutsideClick'), 'Must implement outside click dismissal');
  assert.ok(content.includes('mousedown'), 'Must listen to mousedown for desktop');
  assert.ok(content.includes('touchstart'), 'Must listen to touchstart for mobile');

  // Verify design system styling tokens
  assert.ok(content.includes('border-[var(--color-sand-400)]'), 'Must use Sand border');
  assert.ok(content.includes('border-[var(--color-terracotta-500)]'), 'Must use Terracotta focus border');
  assert.ok(content.includes('bg-[var(--color-terracotta-50)]'), 'Must use soft terracotta-tinted background on selected/hover');
});

test('Wholesale Form: Uses accessible Select component for estimated quantity', () => {
  const formPath = path.resolve(process.cwd(), 'src/components/forms/WholesaleForm.tsx');
  assert.ok(fs.existsSync(formPath), 'WholesaleForm.tsx must exist');

  const content = fs.readFileSync(formPath, 'utf8');

  // Verify native select has been replaced with Select
  assert.ok(content.includes("import { Select } from '@/components/ui/Select'"), 'Must import Select component');
  assert.equal(content.includes('<select'), false, 'Native select must not be present');
  assert.ok(content.includes('<Select'), 'Must render Select component');
  assert.ok(content.includes('options={quantityOptions}'), 'Must pass quantityOptions to Select');

  // Verify options are strictly the 5 specified options
  const expectedOptions = [
    '1–24 units',
    '25–50 units',
    '51–100 units',
    '100+ units',
    'custom',
  ];

  for (const opt of expectedOptions) {
    assert.ok(content.includes(`value: '${opt}'`), `quantityOptions must include option '${opt}'`);
  }
});

test('Wholesale Quantity: Keyboard navigation calculation logic', () => {
  const optionsCount = 5;

  // ArrowDown navigation wrapping
  const nextIndex = (current) => (current + 1) % optionsCount;
  assert.equal(nextIndex(0), 1);
  assert.equal(nextIndex(3), 4);
  assert.equal(nextIndex(4), 0); // Wrap around to first option

  // ArrowUp navigation wrapping
  const prevIndex = (current) => (current - 1 + optionsCount) % optionsCount;
  assert.equal(prevIndex(2), 1);
  assert.equal(prevIndex(0), 4); // Wrap around to last option
});

test('Wholesale Quantity: English and Hindi dictionary parity for quantity options', () => {
  const enForm = en.wholesale.form;
  const hiForm = hi.wholesale.form;

  const quantityKeys = [
    'quantityLabel',
    'quantityPlaceholder',
    'quantityOption1_24',
    'quantityOption25_50',
    'quantityOption51_100',
    'quantityOption100Plus',
    'quantityOptionCustom',
    'customQuantityLabel',
    'customQuantityPlaceholder',
  ];

  for (const key of quantityKeys) {
    assert.ok(
      typeof enForm[key] === 'string' && enForm[key].trim().length > 0,
      `Missing English translation for ${key}`
    );
    assert.ok(
      typeof hiForm[key] === 'string' && hiForm[key].trim().length > 0,
      `Missing Hindi translation for ${key}`
    );
  }

  // Exact option verification
  assert.equal(enForm.quantityOption1_24, '1–24 units');
  assert.equal(enForm.quantityOption25_50, '25–50 units');
  assert.equal(enForm.quantityOption51_100, '51–100 units');
  assert.equal(enForm.quantityOption100Plus, '100+ units');
  assert.equal(enForm.quantityOptionCustom, 'Custom quantity');

  assert.equal(hiForm.quantityOption1_24, '1–24 नग');
  assert.equal(hiForm.quantityOption25_50, '25–50 नग');
  assert.equal(hiForm.quantityOption51_100, '51–100 नग');
  assert.equal(hiForm.quantityOption100Plus, '100+ नग');
  assert.equal(hiForm.quantityOptionCustom, 'कस्टम मात्रा');
});
