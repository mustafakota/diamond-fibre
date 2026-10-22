import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:/Users/musta/.gemini/antigravity-ide/brain/6e195820-73b1-4212-a1f9-a3d177b91399/qa_screenshots';

const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  '--window-size=390,844',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await sleep(1500);

  const targetsRes = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);
  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send('Page.navigate', { url: 'http://localhost:3000/en' });
  await sleep(2000);

  // Click hamburger
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Open navigation menu"]');
      if (btn) btn.click();
    })()`
  });

  await sleep(800);

  const audit = await send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.getElementById('mobile-navigation-drawer');
      const rect = drawer ? drawer.getBoundingClientRect() : null;
      const links = drawer ? Array.from(drawer.querySelectorAll('a')).map(a => a.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean) : [];
      return {
        drawerFound: !!drawer,
        rect,
        linksCount: links.length,
        links
      };
    })()`,
    returnByValue: true
  });

  console.log('Drawer audit:', JSON.stringify(audit.result.value, null, 2));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(screenshot.data, 'base64');
  const dest = path.join(outDir, 'mobile_drawer_portal_verified.png');
  fs.writeFileSync(dest, buffer);
  console.log('Saved screenshot to:', dest, 'size:', buffer.length);

  ws.close();
  child.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  child.kill();
  process.exit(1);
});
