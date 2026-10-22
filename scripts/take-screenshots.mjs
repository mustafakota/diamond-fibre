import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\musta\\.gemini\\antigravity-ide\\brain\\6e195820-73b1-4212-a1f9-a3d177b91399\\qa_screenshots';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targets = [
  { name: 'qa_home_en_desktop.png', url: 'http://localhost:3000/en', width: 1280, height: 1200 },
  { name: 'qa_home_en_mobile_390.png', url: 'http://localhost:3000/en', width: 390, height: 844 },
  { name: 'qa_home_en_mobile_320.png', url: 'http://localhost:3000/en', width: 320, height: 700 },
  { name: 'qa_home_hi_desktop.png', url: 'http://localhost:3000/hi', width: 1280, height: 1200 },
  { name: 'qa_contact_en_desktop.png', url: 'http://localhost:3000/en/contact', width: 1280, height: 1200 },
  { name: 'qa_gaddas_en_desktop.png', url: 'http://localhost:3000/en/products/gaddas', width: 1280, height: 1200 },
  { name: 'qa_mattresses_en_desktop.png', url: 'http://localhost:3000/en/products/mattresses', width: 1280, height: 1200 },
];

for (const t of targets) {
  const dest = path.join(outDir, t.name);
  console.log(`Capturing ${t.name} (${t.width}x${t.height}) from ${t.url}...`);
  const cmd = `"${edge}" --headless --disable-gpu --no-sandbox --window-size=${t.width},${t.height} --screenshot="${dest}" "${t.url}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ Created: ${t.name} (${fs.statSync(dest).size} bytes)`);
  } catch (err) {
    console.error(`Error capturing ${t.name}:`, err.message);
  }
}
