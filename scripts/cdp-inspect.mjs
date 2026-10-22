import { spawn } from 'child_process';
import http from 'http';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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
  
  // Get DevTools websocket
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionData = await versionRes.json();
  console.log('Edge version:', versionData.Browser);

  const targetsRes = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Target WS:', pageTarget.webSocketDebuggerUrl);

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
  console.log('WebSocket connected.');

  await send('Page.enable');
  await send('DOM.enable');
  await send('CSS.enable');

  // Set device emulation
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  // Navigate to http://localhost:3000/en
  console.log('Navigating to http://localhost:3000/en ...');
  await send('Page.navigate', { url: 'http://localhost:3000/en' });

  // Wait 2 seconds for all fonts and animations
  await sleep(2500);

  // Evaluate document elements
  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const navBtn = document.querySelector('button[aria-label="Open navigation menu"]');
      const navBtnRect = navBtn ? navBtn.getBoundingClientRect() : null;
      const h1 = document.querySelector('h1');
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const h1Opacity = h1 ? window.getComputedStyle(h1).opacity : null;
      const heroFade = h1 ? h1.closest('[style*="opacity"]') : null;
      const heroFadeOpacity = heroFade ? window.getComputedStyle(heroFade).opacity : null;

      // Find overflowing elements
      const overflowing = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > winWidth + 5) {
          overflowing.push({ tag: el.tagName, class: el.className, right: r.right, width: r.width });
        }
      });

      return {
        docWidth,
        winWidth,
        hasHorizontalOverflow: docWidth > winWidth,
        navBtnFound: !!navBtn,
        navBtnRect,
        h1Found: !!h1,
        h1Rect,
        h1Opacity,
        heroFadeOpacity,
        overflowingCount: overflowing.length,
        topOverflowing: overflowing.slice(0, 5)
      };
    })()`,
    returnByValue: true
  });

  console.log('Evaluation result:', JSON.stringify(evalResult.result.value, null, 2));

  // Capture screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const fs = await import('fs');
  const buffer = Buffer.from(screenshot.data, 'base64');
  fs.writeFileSync('C:\\Users\\musta\\.gemini\\antigravity-ide\\brain\\6e195820-73b1-4212-a1f9-a3d177b91399\\qa_screenshots\\cdp_mobile_390.png', buffer);
  console.log('Screenshot saved to cdp_mobile_390.png, size:', buffer.length, 'bytes');

  ws.close();
  child.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  child.kill();
  process.exit(1);
});
