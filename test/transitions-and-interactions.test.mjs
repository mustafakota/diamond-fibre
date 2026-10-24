import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');

test('PageTransition: Component exists and exports PageTransition', () => {
  const file = path.join(projectRoot, 'src', 'components', 'motion', 'PageTransition.tsx');
  assert.ok(fs.existsSync(file), 'PageTransition.tsx should exist');
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.includes('export const PageTransition'), 'Must export PageTransition component');
  assert.ok(content.includes("from 'motion/react'"), 'Must import from motion/react');
  assert.ok(content.includes('useReducedMotion'), 'Must support useReducedMotion');
  assert.ok(content.includes('hasMountedInitialPage'), 'Must track initial session mount to avoid SSR blanking');
});

test('App Router Template: template.tsx exists in [locale] and wraps children with PageTransition', () => {
  const file = path.join(projectRoot, 'src', 'app', '[locale]', 'template.tsx');
  assert.ok(fs.existsSync(file), 'template.tsx should exist in src/app/[locale]/');
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.includes('PageTransition'), 'template.tsx must use PageTransition');
  assert.ok(content.includes('export default function Template'), 'Must export default Template component');
});

test('MobileNav: Uses AnimatePresence for smooth opening and closing', () => {
  const file = path.join(projectRoot, 'src', 'components', 'layout', 'MobileNav.tsx');
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.includes('AnimatePresence'), 'MobileNav must import and use AnimatePresence');
  assert.ok(content.includes('useReducedMotion'), 'MobileNav must respect reduced motion');
  assert.ok(content.includes('exit='), 'MobileNav must define exit animations for drawer');
  assert.ok(content.includes('handleKeyDown'), 'MobileNav must handle Escape key');
  assert.ok(content.includes('triggerBtnRef.current?.focus()'), 'MobileNav must restore focus on close');
});

test('Header: Products dropdown menu has smooth transition classes', () => {
  const file = path.join(projectRoot, 'src', 'components', 'layout', 'Header.tsx');
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.includes('opacity-0 pointer-events-none translate-y-1'), 'Dropdown must have hidden rest state with subtle offset');
  assert.ok(content.includes('group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0'), 'Dropdown must smoothly transition on hover');
  assert.ok(content.includes('motion-reduce:transition-none'), 'Dropdown must support reduced motion');
});

test('Motion Tuning: FadeIn and StaggerContainer defaults are refined', () => {
  const fadeInFile = path.join(projectRoot, 'src', 'components', 'motion', 'FadeIn.tsx');
  const fadeInContent = fs.readFileSync(fadeInFile, 'utf8');
  assert.ok(fadeInContent.includes('duration = 0.28'), 'FadeIn default duration should be 0.28s (subtle, 180-280ms)');
  assert.ok(fadeInContent.includes('distance = 10'), 'FadeIn default distance should be 10px');

  const staggerFile = path.join(projectRoot, 'src', 'components', 'motion', 'StaggerContainer.tsx');
  const staggerContent = fs.readFileSync(staggerFile, 'utf8');
  assert.ok(staggerContent.includes('staggerDelay = 0.06'), 'Stagger delay should be refined to 0.06s');
  assert.ok(staggerContent.includes('distance = 8'), 'StaggerItem distance should be 8px');
});

test('globals.css: Contains subtleFadeIn, pageEnter, animate-fadeIn and reduced-motion guard', () => {
  const file = path.join(projectRoot, 'src', 'app', 'globals.css');
  const content = fs.readFileSync(file, 'utf8');
  assert.ok(content.includes('@keyframes subtleFadeIn'), 'Must define subtleFadeIn keyframes');
  assert.ok(content.includes('.animate-fadeIn'), 'Must define .animate-fadeIn class');
  assert.ok(content.includes('@keyframes pageEnter'), 'Must define pageEnter keyframes');
  assert.ok(content.includes('.page-enter'), 'Must define .page-enter class');
  assert.ok(content.includes('.page-enter') && content.includes('@media (prefers-reduced-motion: reduce)'), 'Must include .page-enter in reduced-motion overrides');
});

test('Form Inputs: Input and Textarea apply animate-fadeIn to inline validation errors', () => {
  const inputFile = path.join(projectRoot, 'src', 'components', 'ui', 'Input.tsx');
  const inputContent = fs.readFileSync(inputFile, 'utf8');
  assert.ok(inputContent.includes('animate-fadeIn'), 'Input error message must have animate-fadeIn');

  const textareaFile = path.join(projectRoot, 'src', 'components', 'ui', 'Textarea.tsx');
  const textareaContent = fs.readFileSync(textareaFile, 'utf8');
  assert.ok(textareaContent.includes('animate-fadeIn'), 'Textarea error message must have animate-fadeIn');
});

test('Tactile Click Feedback: globals.css defines scale-up primitives and reduced motion guards', () => {
  const file = path.join(projectRoot, 'src', 'app', 'globals.css');
  const content = fs.readFileSync(file, 'utf8');

  // Primitives: scale(1.02), subtle scale(1.015), icon scale(1.04)
  assert.ok(content.includes('.press-scale'), 'Must define .press-scale');
  assert.ok(content.includes('.press-scale:active') && content.includes('scale(1.02)'), '.press-scale:active must scale to 1.02');
  assert.ok(content.includes('.press-scale-subtle:active') && content.includes('scale(1.015)'), '.press-scale-subtle:active must scale to 1.015');
  assert.ok(content.includes('.press-scale-icon:active') && content.includes('scale(1.04)'), '.press-scale-icon:active must scale to 1.04');
  assert.ok(content.includes('150ms cubic-bezier(0.2, 0, 0, 1)'), 'Must use smooth 150ms cubic-bezier return transition');

  // Reduced motion: must disable transform
  assert.ok(content.includes('.press-scale') && content.includes('transform: none !important'), 'Reduced motion must reset transform for press feedback');
});

test('Tactile Click Feedback: Button component implements scale-up press feedback', () => {
  const file = path.join(projectRoot, 'src', 'components', 'ui', 'Button.tsx');
  const content = fs.readFileSync(file, 'utf8');

  assert.ok(content.includes('active:scale-[1.02]'), 'Button base styles must include active:scale-[1.02]');
  assert.ok(content.includes('press-scale'), 'Button must include press-scale class');
  assert.ok(content.includes('disabled:active:scale-100'), 'Disabled buttons must not scale');
  assert.ok(content.includes('motion-reduce:transform-none'), 'Buttons must support motion-reduce');
  assert.ok(content.includes("lg: 'text-lg py-3.5 px-8 min-h-[52px] active:scale-[1.015]'"), 'Large buttons must use restrained active:scale-[1.015]');
});

test('Tactile Click Feedback: Navigation components implement responsive press feedback', () => {
  const headerFile = path.join(projectRoot, 'src', 'components', 'layout', 'Header.tsx');
  const headerContent = fs.readFileSync(headerFile, 'utf8');
  assert.ok(headerContent.includes('active:scale-[1.02]'), 'Header links must include active:scale-[1.02]');
  assert.ok(headerContent.includes('press-scale'), 'Header links must include press-scale');

  const langFile = path.join(projectRoot, 'src', 'components', 'layout', 'LanguageSwitcher.tsx');
  const langContent = fs.readFileSync(langFile, 'utf8');
  assert.ok(langContent.includes('active:scale-[1.02]'), 'Language switcher must have active:scale-[1.02]');

  const mobileFile = path.join(projectRoot, 'src', 'components', 'layout', 'MobileNav.tsx');
  const mobileContent = fs.readFileSync(mobileFile, 'utf8');
  assert.ok(mobileContent.includes('active:scale-[1.04]'), 'MobileNav buttons must have active:scale-[1.04]');
  assert.ok(mobileContent.includes('press-scale-icon'), 'MobileNav buttons must have press-scale-icon');

  const scrollFile = path.join(projectRoot, 'src', 'components', 'layout', 'ScrollToTop.tsx');
  assert.ok(!fs.existsSync(scrollFile), 'ScrollToTop floating component must be removed');

  const backToTopFile = path.join(projectRoot, 'src', 'components', 'layout', 'BackToTopLink.tsx');
  assert.ok(fs.existsSync(backToTopFile), 'BackToTopLink must exist');
  const backToTopContent = fs.readFileSync(backToTopFile, 'utf8');
  assert.ok(backToTopContent.includes('active:scale-[1.02]'), 'BackToTopLink must have active:scale-[1.02]');
  assert.ok(backToTopContent.includes('press-scale'), 'BackToTopLink must have press-scale');
  assert.ok(backToTopContent.includes('motion-reduce:transform-none'), 'BackToTopLink must respect motion-reduce');
});

test('Tactile Click Feedback: Wholesale multi-select category buttons use subtle scale and persistent selected state', () => {
  const file = path.join(projectRoot, 'src', 'components', 'forms', 'WholesaleForm.tsx');
  const content = fs.readFileSync(file, 'utf8');

  assert.ok(content.includes('active:scale-[1.015]'), 'Category buttons must use subtle 1.015 scale');
  assert.ok(content.includes('press-scale-subtle'), 'Category buttons must use press-scale-subtle');
  assert.ok(content.includes('motion-reduce:transform-none'), 'Category buttons must respect motion-reduce');
  assert.ok(content.includes('aria-checked={isSelected}'), 'Must maintain accessible aria-checked selected state');
});
