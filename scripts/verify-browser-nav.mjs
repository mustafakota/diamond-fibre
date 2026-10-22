import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9224;

async function launchEdge() {
  const edge = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\edge-nav-test-' + Date.now(),
    'about:blank'
  ]);

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        const json = await res.json();
        return { edge, wsUrl: json.webSocketDebuggerUrl };
      }
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  edge.kill();
  throw new Error('Failed to start Edge');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new globalThis.WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const cb = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) cb.reject(new Error(msg.error.message));
        else cb.resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Starting Edge headless browser...');
  const { edge, wsUrl } = await launchEdge();

  try {
    const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://localhost:3000/en`, { method: 'PUT' });
    const target = await targetRes.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    async function evalInPage(expression) {
      const res = await cdp.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result?.value;
    }

    async function getActiveNavLinks() {
      return await evalInPage(`
        Array.from(document.querySelectorAll('nav a[aria-current="page"]')).map(a => a.textContent.trim())
      `);
    }

    async function navigateTo(url) {
      await evalInPage(`window.location.href = '${url}'`);
      await new Promise(r => setTimeout(r, 600));
    }

    console.log('\n--- Complete Sequential Navigation Test Across All Pages (English) ---');
    const enSequence = [
      { url: '/en', name: 'Home', expected: ['Home'], forbidden: ['Wholesale & Resellers'] },
      { url: '/en/products', name: 'Products', expected: ['Products'], forbidden: ['Wholesale & Resellers', 'Home'] },
      { url: '/en/products/mattresses', name: 'Mattresses', expected: ['Products', 'Mattresses'], forbidden: ['Wholesale & Resellers', 'Home', 'Pillows'] },
      { url: '/en/products/pillows', name: 'Pillows', expected: ['Products', 'Pillows'], forbidden: ['Wholesale & Resellers', 'Home', 'Mattresses'] },
      { url: '/en/products/razais', name: 'Razais', expected: ['Products', 'Razais'], forbidden: ['Wholesale & Resellers', 'Home', 'Pillows'] },
      { url: '/en/products/blankets', name: 'Blankets', expected: ['Products', 'Blankets'], forbidden: ['Wholesale & Resellers', 'Home', 'Razais'] },
      { url: '/en/our-story', name: 'Our Story', expected: ['Our Story'], forbidden: ['Wholesale & Resellers', 'Home', 'Products', 'Blankets'] },
      { url: '/en/contact', name: 'Contact', expected: ['Contact'], forbidden: ['Wholesale & Resellers', 'Home', 'Our Story'] },
      { url: '/en/wholesale', name: 'Wholesale', expected: ['Wholesale & Resellers'], forbidden: ['Contact', 'Home', 'Our Story', 'Products'] },
      { url: '/en', name: 'Back to Home', expected: ['Home'], forbidden: ['Wholesale & Resellers'] },
    ];

    for (const step of enSequence) {
      await navigateTo(step.url);
      const active = await getActiveNavLinks();
      console.log(`Step ${step.name} (${step.url}): active = [${active.join(', ')}]`);
      for (const exp of step.expected) {
        if (!active.includes(exp)) throw new Error(`Missing expected active: ${exp} on ${step.url}`);
      }
      for (const forb of step.forbidden) {
        if (active.includes(forb)) throw new Error(`Forbidden active link present: ${forb} on ${step.url}`);
      }
    }

    console.log('\n--- Complete Sequential Navigation Test Across All Pages (Hindi) ---');
    const hiSequence = [
      { url: '/hi', name: 'होम', expected: ['होम'], forbidden: ['थोक व रीसेलर्स'] },
      { url: '/hi/products', name: 'उत्पाद', expected: ['उत्पाद'], forbidden: ['थोक व रीसेलर्स', 'होम'] },
      { url: '/hi/products/mattresses', name: 'गद्दे', expected: ['उत्पाद', 'गद्दे'], forbidden: ['थोक व रीसेलर्स', 'होम', 'तकिए'] },
      { url: '/hi/products/pillows', name: 'तकिए', expected: ['उत्पाद', 'तकिए'], forbidden: ['थोक व रीसेलर्स', 'होम', 'गद्दे'] },
      { url: '/hi/products/razais', name: 'रज़ाइयां', expected: ['उत्पाद', 'रज़ाइयां'], forbidden: ['थोक व रीसेलर्स', 'होम', 'तकिए'] },
      { url: '/hi/products/blankets', name: 'कंबल', expected: ['उत्पाद', 'कंबल'], forbidden: ['थोक व रीसेलर्स', 'होम', 'रज़ाइयां'] },
      { url: '/hi/our-story', name: 'हमारा परिचय', expected: ['हमारा परिचय'], forbidden: ['थोक व रीसेलर्स', 'होम', 'उत्पाद'] },
      { url: '/hi/contact', name: 'संपर्क', expected: ['संपर्क'], forbidden: ['थोक व रीसेलर्स', 'होम', 'हमारा परिचय'] },
      { url: '/hi/wholesale', name: 'थोक व रीसेलर्स', expected: ['थोक व रीसेलर्स'], forbidden: ['संपर्क', 'होम', 'हमारा परिचय', 'उत्पाद'] },
      { url: '/hi', name: 'पुनः होम', expected: ['होम'], forbidden: ['थोक व रीसेलर्स'] },
    ];

    for (const step of hiSequence) {
      await navigateTo(step.url);
      const active = await getActiveNavLinks();
      console.log(`Step ${step.name} (${step.url}): active = [${active.join(', ')}]`);
      for (const exp of step.expected) {
        if (!active.includes(exp)) throw new Error(`Missing expected active: ${exp} on ${step.url}`);
      }
      for (const forb of step.forbidden) {
        if (active.includes(forb)) throw new Error(`Forbidden active link present: ${forb} on ${step.url}`);
      }
    }

    console.log('\n--- ALL DESKTOP & HINDI SEQUENTIAL TESTS PASSED! ---');

    cdp.close();
  } finally {
    edge.kill();
  }
}

run().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
