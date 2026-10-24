import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

test('Header: Desktop navigation links use refined editorial active and hover underlines', () => {
  const headerFile = path.join(projectRoot, 'src', 'components', 'layout', 'Header.tsx');
  const content = fs.readFileSync(headerFile, 'utf8');

  // Verify renderTopNavLink with terracotta underline indicator
  assert.ok(content.includes('bg-[var(--color-terracotta-500)]'), 'Must have terracotta accent underline');
  assert.ok(content.includes('scale-x-100'), 'Must use scale-x transition for smooth underline');
  assert.ok(content.includes('motion-reduce:transition-none'), 'Must respect prefers-reduced-motion for nav transitions');
  assert.ok(content.includes('press-scale'), 'Must include tactile press-scale feedback');
  assert.ok(content.includes('active:scale-[1.02]'), 'Must include active:scale feedback');
});

test('Header: Products dropdown menu functions with mouse, keyboard and touch', () => {
  const headerFile = path.join(projectRoot, 'src', 'components', 'layout', 'Header.tsx');
  const content = fs.readFileSync(headerFile, 'utf8');

  // Verify root cause fix: parent container has group so group-hover matches
  assert.ok(content.includes('relative group group/nav'), 'Parent container must include group for CSS group-hover targeting');

  // Must preserve hover & focus-within behavior for dropdown
  assert.ok(content.includes('opacity-0 pointer-events-none translate-y-1'), 'Dropdown must have hidden rest offset');
  assert.ok(content.includes('group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0'), 'Must reveal on hover');
  assert.ok(content.includes('group-focus-within:opacity-100 group-focus-within:pointer-events-auto'), 'Must reveal on keyboard focus');
  assert.ok(content.includes('ChevronDown'), 'Must have ChevronDown indicator');
  assert.ok(content.includes('group-hover/nav:rotate-180') || content.includes('group-hover:rotate-180'), 'Chevron must rotate on open');

  // Pointer bridge: invisible pseudo-element bridging gap between trigger and panel
  assert.ok(content.includes('before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[\'\']'), 'Must have hover bridge between trigger and menu');

  // Dropdown items: Products Overview + all 4 product categories
  assert.ok(content.includes('href={`/${locale}/products`}'), 'Dropdown must include Products overview link');
  assert.ok(content.includes('href={`/${locale}/products/mattresses`}'), 'Dropdown must include Mattresses link');
  assert.ok(content.includes('href={`/${locale}/products/pillows`}'), 'Dropdown must include Pillows link');
  assert.ok(content.includes('href={`/${locale}/products/razais`}'), 'Dropdown must include Razais link');
  assert.ok(content.includes('href={`/${locale}/products/blankets`}'), 'Dropdown must include Blankets link');

  // Keyboard and touch accessibility
  assert.ok(content.includes("e.key === 'Escape'"), 'Must support Escape key to close menu');
  assert.ok(content.includes('triggerRef.current?.focus()'), 'Must restore focus to trigger on Escape');
  assert.ok(content.includes("e.key === ' '") || content.includes("e.key === 'Spacebar'"), 'Must support Space activation');
  assert.ok(content.includes("pointerType === 'touch'"), 'Must support touch activation without hover');
});

test('Header: WhatsApp CTA uses muted WhatsApp green #25A765 with #208C56 hover state', () => {
  const headerFile = path.join(projectRoot, 'src', 'components', 'layout', 'Header.tsx');
  const content = fs.readFileSync(headerFile, 'utf8');

  // Must NOT use full bright neon green button or heavy dark carbon
  assert.ok(!content.includes('bg-[#25D366] text-white rounded-full'), 'Must not use raw neon green pill button in header');
  assert.ok(!content.includes('bg-[var(--color-carbon-900)] text-white hover:bg-[var(--color-carbon-800)]'), 'Header WhatsApp button should not be heavy carbon black block');
  // Must use muted WhatsApp green (#25A765) with hover (#208C56), white text, and white icon
  assert.ok(content.includes('bg-[#25A765]'), 'Header WhatsApp button must use #25A765');
  assert.ok(content.includes('hover:bg-[#208C56]'), 'Header WhatsApp button must use hover #208C56');
  assert.ok(content.includes('text-white'), 'Header WhatsApp button must have white text');
  assert.ok(content.includes('rounded-lg'), 'Must use restrained rounded-lg button rather than oversized pill');
  assert.ok(content.includes('buildWhatsAppLink'), 'Must preserve correct WhatsApp link destination');
});

test('LanguageSwitcher: Integrated architectural design with Sand container and subtle Warm Ivory/Carbon active state', () => {
  const file = path.join(projectRoot, 'src', 'components', 'layout', 'LanguageSwitcher.tsx');
  const content = fs.readFileSync(file, 'utf8');

  // Must avoid generic round pill segmented control and heavy black block
  assert.ok(!content.includes('rounded-full bg-[var(--color-sand-300)]/50'), 'Must avoid generic full-round pill container');
  assert.ok(!content.includes('bg-[var(--color-carbon-900)]'), 'Must avoid heavy carbon black block on active language tab');
  assert.ok(content.includes('role="group"'), 'Must have accessible group role');
  assert.ok(content.includes('var(--color-sand-400)'), 'Container must use Sand #D9CCB6 color token');
  assert.ok(content.includes('bg-[var(--color-warm-ivory-100)] text-[var(--color-carbon-800)]'), 'Active language must have subtle Warm Ivory background with Carbon text');
  assert.ok(content.includes('getTargetUrl'), 'Must preserve route path preservation when switching languages');
});

test('MobileNav: Refined active drawer link styling and touch-accessible Products link', () => {
  const file = path.join(projectRoot, 'src', 'components', 'layout', 'MobileNav.tsx');
  const content = fs.readFileSync(file, 'utf8');

  // Must have link to /products
  assert.ok(content.includes('href={`/${locale}/products`}'), 'Mobile drawer must link directly to /products');
  // Must have terracotta left border for active link
  assert.ok(content.includes('border-l-3 border-[var(--color-terracotta-500)]'), 'Active link must have terracotta indicator');
  // WhatsApp CTA in drawer must use Carbon brand palette with green icon
  assert.ok(!content.includes('bg-[#25D366] text-white rounded-full font-semibold px-4'), 'Drawer must not use raw neon green button');
  assert.ok(content.includes('bg-[var(--color-carbon-900)] text-white'), 'Drawer WhatsApp CTA must use Carbon brand palette');
  assert.ok(content.includes('text-[#25D366]'), 'Drawer WhatsApp icon must have green accent');
});

test('StickyWhatsApp: Floating button uses Carbon brand palette with green icon & indicator dot', () => {
  const file = path.join(projectRoot, 'src', 'components', 'layout', 'StickyWhatsApp.tsx');
  const content = fs.readFileSync(file, 'utf8');

  assert.ok(!content.includes('bg-[#25D366] text-white p-3.5'), 'Sticky WhatsApp must not use raw neon green background');
  assert.ok(content.includes('bg-[var(--color-carbon-900)]'), 'Sticky WhatsApp must use Carbon background');
  assert.ok(content.includes('text-[#25D366]'), 'MessageCircle must have green accent');
  assert.ok(content.includes('buildWhatsAppLink'), 'Must preserve buildWhatsAppLink prefill');
});

test('Button: whatsapp variant is aligned with Carbon brand styling', () => {
  const file = path.join(projectRoot, 'src', 'components', 'ui', 'Button.tsx');
  const content = fs.readFileSync(file, 'utf8');

  assert.ok(!content.includes("whatsapp:\n      'bg-[#25D366]"), 'Button component whatsapp variant must not be raw neon green');
  assert.ok(content.includes("whatsapp:\n      'bg-[var(--color-carbon-900)]"), 'Button whatsapp variant must use Carbon palette');
});

test('Site-Wide WhatsApp Audit: Arbitrary raw neon green button backgrounds are eliminated', () => {
  const filesToCheck = [
    path.join(projectRoot, 'src', 'components', 'home', 'EditorialCategoryShowcase.tsx'),
    path.join(projectRoot, 'src', 'components', 'categories', 'CategoryCard.tsx'),
    path.join(projectRoot, 'src', 'components', 'forms', 'WholesaleForm.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'wholesale', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'contact', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'products', 'mattresses', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'products', 'pillows', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'products', 'razais', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'products', 'blankets', 'page.tsx'),
  ];

  for (const f of filesToCheck) {
    const text = fs.readFileSync(f, 'utf8');
    // Ensure no raw full-button bg-[#25D366]
    assert.ok(!text.includes('bg-[#25D366] text-white rounded-full'), `${path.basename(f)} must not contain raw neon green pill button`);
    assert.ok(text.includes('text-[#25D366]'), `${path.basename(f)} must retain recognizable green MessageCircle icon`);
  }
});
