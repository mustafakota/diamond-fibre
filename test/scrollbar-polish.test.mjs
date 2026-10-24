import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

test('Scrollbar Polish: globals.css contains slim, brand-consistent scrollbar definitions', () => {
  const cssPath = path.join(ROOT_DIR, 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // 1. Standard Firefox & CSS Scrollbars Module Level 1
  assert.match(
    css,
    /scrollbar-width:\s*thin;/i,
    'html must define scrollbar-width: thin for Firefox'
  );
  assert.match(
    css,
    /scrollbar-color:\s*var\(--color-sand-400\)\s+transparent;/i,
    'html must define scrollbar-color with sand thumb and transparent track'
  );

  // 2. WebKit / Blink desktop width (6-8px range)
  assert.match(
    css,
    /html::-webkit-scrollbar[\s\S]*?width:\s*8px;/i,
    'Document root scrollbar must be configured to 8px width'
  );

  // 3. Transparent track
  assert.match(
    css,
    /html::-webkit-scrollbar-track[\s\S]*?background:\s*transparent;/i,
    'Scrollbar track must be transparent to blend seamlessly into surfaces'
  );

  // 4. Rounded sand thumb
  assert.match(
    css,
    /html::-webkit-scrollbar-thumb[\s\S]*?background-color:\s*var\(--color-sand-400\);/i,
    'Scrollbar thumb must use sand neutral base color'
  );
  assert.match(
    css,
    /html::-webkit-scrollbar-thumb[\s\S]*?border-radius:\s*9999px;/i,
    'Scrollbar thumb must be rounded'
  );

  // 5. Hover and active states with terracotta
  assert.match(
    css,
    /html::-webkit-scrollbar-thumb:hover[\s\S]*?background-color:\s*#e36e48;/i,
    'Scrollbar thumb must transition to terracotta on hover'
  );

  // 6. Scoped only to root document (html / body)
  assert.doesNotMatch(
    css,
    /(?<!html)(?<!body)::-webkit-scrollbar\s*\{/i,
    'Global unscoped ::-webkit-scrollbar must not be used to protect nested scroll containers'
  );

  // 7. Reduced motion guard
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?::-webkit-scrollbar-thumb[\s\S]*?transition:\s*none\s*!important;/i,
    'Reduced-motion query must disable scrollbar transitions'
  );
});
