import { spawn } from 'child_process';
import fs from 'fs';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  '--window-size=1280,1200',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await sleep(1500);
  
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionData = await versionRes.json();
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3000/hi ...');
  await send('Page.navigate', { url: 'http://localhost:3000/hi' });
  await sleep(2500);

  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      return {
        h1Text: h1 ? h1.innerText : null,
        h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('Hindi page evaluation:', evalResult.result.value);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(screenshot.data, 'base64');
  fs.writeFileSync('C:/Users/musta/.gemini/antigravity-ide/brain/6e195820-73b1-4212-a1f9-a3d177b91399/qa_screenshots/cdp_home_hi_desktop.png', buffer);
  console.log('Saved cdp_home_hi_desktop.png, size:', buffer.length);

  ws.close();
  child.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  child.kill();
  process.exit(1);
});
