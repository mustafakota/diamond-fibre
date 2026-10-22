import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9232',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(1500);
  const res = await fetch('http://127.0.0.1:9232/json/list');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      const { resolve, reject } = pending.get(d.id);
      pending.delete(d.id);
      if (d.error) reject(d.error);
      else resolve(d.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Performance.enable');

  const scenarios = [
    { name: 'Desktop Home (EN)', url: 'http://localhost:3000/en', w: 1280, h: 1000, mobile: false },
    { name: 'Desktop Home (HI)', url: 'http://localhost:3000/hi', w: 1280, h: 1000, mobile: false },
    { name: 'Mobile Home (EN 390px)', url: 'http://localhost:3000/en', w: 390, h: 844, mobile: true },
    { name: 'Mobile Home (HI 390px)', url: 'http://localhost:3000/hi', w: 390, h: 844, mobile: true },
    { name: 'Desktop Mattresses (EN)', url: 'http://localhost:3000/en/products/mattresses', w: 1280, h: 1000, mobile: false },
    { name: 'Mobile Mattresses (EN 390px)', url: 'http://localhost:3000/en/products/mattresses', w: 390, h: 844, mobile: true },
    { name: 'Mobile Wholesale (EN 390px)', url: 'http://localhost:3000/en/wholesale', w: 390, h: 844, mobile: true },
  ];

  const measurements = [];

  for (const s of scenarios) {
    console.log(`\nMeasuring performance: ${s.name} ...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: s.w,
      height: s.h,
      deviceScaleFactor: s.mobile ? 2 : 1,
      mobile: s.mobile,
    });

    await send('Page.navigate', { url: s.url });
    await sleep(2500);

    const metricsData = await send('Runtime.evaluate', {
      expression: `(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paints = performance.getEntriesByType('paint');
        const fcp = paints.find(p => p.name === 'first-contentful-paint');
        
        // Resources
        const resources = performance.getEntriesByType('resource');
        let totalTransferBytes = 0;
        let imageCount = 0;
        let jsCount = 0;
        let cssCount = 0;

        resources.forEach(r => {
          totalTransferBytes += (r.transferSize || 0);
          if (r.initiatorType === 'img') imageCount++;
          if (r.initiatorType === 'script') jsCount++;
          if (r.initiatorType === 'css' || r.name.endsWith('.css')) cssCount++;
        });

        return {
          ttfbMs: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
          domInteractiveMs: nav ? Math.round(nav.domInteractive) : null,
          domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
          loadCompleteMs: nav ? Math.round(nav.loadEventEnd) : null,
          fcpMs: fcp ? Math.round(fcp.startTime) : null,
          resourceCount: resources.length,
          imageCount,
          jsCount,
          cssCount,
          totalTransferKB: Math.round(totalTransferBytes / 1024),
        };
      })()`,
      returnByValue: true
    });

    const cdpMetrics = await send('Performance.getMetrics');
    const cdpMap = {};
    cdpMetrics.metrics.forEach(m => cdpMap[m.name] = m.value);

    const m = {
      scenario: s.name,
      url: s.url,
      viewport: `${s.w}x${s.h} (${s.mobile ? 'Mobile' : 'Desktop'})`,
      ...metricsData.result.value,
      domNodes: cdpMap.Nodes,
      jsHeapUsedMB: Math.round((cdpMap.JSHeapUsedSize || 0) / 1024 / 1024 * 10) / 10,
      layoutCount: cdpMap.LayoutCount,
    };

    console.log(`  ✓ TTFB: ${m.ttfbMs}ms | FCP: ${m.fcpMs}ms | DOM Ready: ${m.domContentLoadedMs}ms | Full Load: ${m.loadCompleteMs}ms`);
    console.log(`  ✓ Resources: ${m.resourceCount} (${m.imageCount} imgs, ${m.jsCount} scripts) | Transfer: ${m.totalTransferKB} KB`);
    console.log(`  ✓ DOM Nodes: ${m.domNodes} | JS Heap: ${m.jsHeapUsedMB} MB`);

    measurements.push(m);
  }

  const outDir = 'C:/Users/musta/.gemini/antigravity-ide/brain/6e195820-73b1-4212-a1f9-a3d177b91399/phase5_audit';
  fs.writeFileSync(
    path.join(outDir, 'phase5_perf_measurements.json'),
    JSON.stringify(measurements, null, 2)
  );

  ws.close();
  child.kill();
  console.log('\nMeasurements saved to phase5_perf_measurements.json');
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  child.kill();
  process.exit(1);
});
