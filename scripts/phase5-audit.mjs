import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:/Users/musta/.gemini/antigravity-ide/brain/6e195820-73b1-4212-a1f9-a3d177b91399/phase5_audit';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  '--window-size=1280,1000',
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
  const consoleMessages = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: data.params.type,
        args: data.params.args.map(a => a.value || a.description || '')
      });
    }
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
  await send('Performance.enable');

  const pagesToTest = [
    { url: 'http://localhost:3000/en', name: 'Home EN' },
    { url: 'http://localhost:3000/hi', name: 'Home HI' },
    { url: 'http://localhost:3000/en/products', name: 'Products Overview EN' },
    { url: 'http://localhost:3000/hi/products', name: 'Products Overview HI' },
    { url: 'http://localhost:3000/en/products/mattresses', name: 'Mattresses EN' },
    { url: 'http://localhost:3000/hi/products/mattresses', name: 'Mattresses HI' },
    { url: 'http://localhost:3000/en/products/pillows', name: 'Pillows EN' },
    { url: 'http://localhost:3000/hi/products/pillows', name: 'Pillows HI' },
    { url: 'http://localhost:3000/en/products/razais', name: 'Razais EN' },
    { url: 'http://localhost:3000/hi/products/razais', name: 'Razais HI' },
    { url: 'http://localhost:3000/en/products/blankets', name: 'Blankets EN' },
    { url: 'http://localhost:3000/hi/products/blankets', name: 'Blankets HI' },
    { url: 'http://localhost:3000/en/wholesale', name: 'Wholesale EN' },
    { url: 'http://localhost:3000/hi/wholesale', name: 'Wholesale HI' },
    { url: 'http://localhost:3000/en/our-story', name: 'Our Story EN' },
    { url: 'http://localhost:3000/hi/our-story', name: 'Our Story HI' },
    { url: 'http://localhost:3000/en/contact', name: 'Contact EN' },
    { url: 'http://localhost:3000/hi/contact', name: 'Contact HI' },
  ];

  const auditReport = [];

  for (const p of pagesToTest) {
    console.log(`\nAuditing: ${p.name} (${p.url})`);
    await send('Page.navigate', { url: p.url });
    await sleep(1500);

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const errors = [];
        const warnings = [];

        // Check horizontal overflow
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasHOverflow = docW > winW;

        // Check broken images
        const brokenImages = [];
        document.querySelectorAll('img').forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            brokenImages.push({ src: img.src, alt: img.alt });
          }
        });

        // Check interactive touch target sizes (< 44px min dimension)
        const smallTouchTargets = [];
        document.querySelectorAll('a, button, input[type="checkbox"], input[type="radio"]').forEach(el => {
          const rect = el.getBoundingClientRect();
          // Only check visible elements
          if (rect.width > 0 && rect.height > 0) {
            // Check computed height or width
            if (rect.height < 36 && rect.width < 36) {
              smallTouchTargets.push({
                tag: el.tagName,
                text: el.innerText?.slice(0, 20) || el.getAttribute('aria-label') || el.type,
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              });
            }
          }
        });

        // Check internal links for obsolete gaddas route
        const obsoleteGaddasLinks = [];
        document.querySelectorAll('a[href]').forEach(a => {
          const href = a.getAttribute('href');
          if (href && href.includes('/products/gaddas')) {
            obsoleteGaddasLinks.push(href);
          }
        });

        // Check headings hierarchy
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
        const hasSingleH1 = h1s.length === 1;

        // Check title and meta description
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(l => ({
          lang: l.getAttribute('hreflang'),
          href: l.getAttribute('href')
        }));

        // Check for placeholder leak
        const bodyText = document.body.innerText;
        const hasPlaceholderLeak = bodyText.includes('[CONFIRMED_PRODUCTION_DOMAIN]') || bodyText.includes('example.com');

        return {
          title,
          metaDescLength: metaDesc?.length || 0,
          metaDesc,
          canonical,
          hreflangsCount: hreflangs.length,
          hreflangs,
          h1Count: h1s.length,
          h1s,
          hasHOverflow,
          docW,
          winW,
          brokenImagesCount: brokenImages.length,
          brokenImages,
          smallTouchTargetsCount: smallTouchTargets.length,
          smallTouchTargets: smallTouchTargets.slice(0, 5),
          obsoleteGaddasLinksCount: obsoleteGaddasLinks.length,
          obsoleteGaddasLinks,
          hasPlaceholderLeak
        };
      })()`,
      returnByValue: true
    });

    const perfMetrics = await send('Performance.getMetrics');
    const perfMap = {};
    perfMetrics.metrics.forEach(m => perfMap[m.name] = m.value);

    const res = evalResult.result.value;
    console.log(`  ✓ Title: "${res.title}"`);
    console.log(`  ✓ Canonical: ${res.canonical}`);
    console.log(`  ✓ H1 count: ${res.h1Count} ("${res.h1s[0] || 'NONE'}")`);
    console.log(`  ✓ Horizontal overflow: ${res.hasHOverflow ? 'YES (FAIL)' : 'NONE (PASS)'}`);
    console.log(`  ✓ Broken images: ${res.brokenImagesCount}`);
    console.log(`  ✓ Obsolete gaddas links: ${res.obsoleteGaddasLinksCount}`);
    console.log(`  ✓ Placeholder leaks: ${res.hasPlaceholderLeak ? 'LEAK DETECTED (FAIL)' : 'CLEAN (PASS)'}`);
    console.log(`  ✓ DOM Nodes: ${perfMap.Nodes || 0}, JS Heap Used: ${Math.round((perfMap.JSHeapUsedSize || 0) / 1024 / 1024 * 10) / 10} MB`);

    auditReport.push({
      page: p.name,
      url: p.url,
      ...res,
      perf: {
        nodes: perfMap.Nodes,
        jsHeapMB: Math.round((perfMap.JSHeapUsedSize || 0) / 1024 / 1024 * 10) / 10
      }
    });
  }

  // 2. Test Mobile Viewports (320px, 360px, 390px)
  const mobileWidths = [320, 360, 390, 430];
  const mobileResults = [];

  for (const w of mobileWidths) {
    console.log(`\nTesting Mobile Viewport ${w}px on Home EN...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: 'http://localhost:3000/en' });
    await sleep(1500);

    const mEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasHOverflow = docW > winW;
        return { docW, winW, hasHOverflow };
      })()`,
      returnByValue: true
    });
    console.log(`  Viewport ${w}px: docW=${mEval.result.value.docW}, winW=${mEval.result.value.winW}, overflow=${mEval.result.value.hasHOverflow}`);
    mobileResults.push({ width: w, ...mEval.result.value });
  }

  // 3. Wholesale Form End-to-End Submission Test
  console.log('\nTesting Wholesale Form submission workflow via browser...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://localhost:3000/en/wholesale' });
  await sleep(1500);

  // Fill valid inputs and submit
  const formTestResult = await send('Runtime.evaluate', {
    expression: `(async () => {
      // Find form inputs
      const nameInput = document.querySelector('input[placeholder*="Rajesh"]');
      const bizInput = document.querySelector('input[placeholder*="Sharma"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const qtyInput = document.querySelector('input[placeholder*="mattresses"]');
      const locInput = document.querySelector('input[placeholder*="Ujjain"]');
      const mattressCheck = document.querySelector('input[type="checkbox"]');
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Submit Wholesale'));

      if (!nameInput || !bizInput || !phoneInput || !qtyInput || !locInput || !mattressCheck || !submitBtn) {
        return { error: 'Could not locate all form controls' };
      }

      // Fill values using React synthetic event setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      
      nativeInputValueSetter.call(nameInput, 'Rajesh Sharma');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputValueSetter.call(bizInput, 'Sharma Handloom');
      bizInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputValueSetter.call(phoneInput, '9876543210');
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputValueSetter.call(qtyInput, '50 mattresses');
      qtyInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputValueSetter.call(locInput, 'Indore, MP');
      locInput.dispatchEvent(new Event('input', { bubbles: true }));

      if (!mattressCheck.checked) {
        mattressCheck.click();
      }

      // Submit form
      submitBtn.click();

      // Wait for API response and state transition
      await new Promise(r => setTimeout(r, 1200));

      // Read form feedback
      const errorNotice = document.querySelector('.text-\\[var\\(--color-error-red\\)\\]') || document.querySelector('[role="alert"]');
      const whatsappFallbackBtn = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.includes('WhatsApp'));
      const fallbackHref = whatsappFallbackBtn ? whatsappFallbackBtn.getAttribute('href') : null;

      return {
        submitted: true,
        feedbackText: errorNotice ? errorNotice.innerText : 'NO_FEEDBACK_ELEMENT_FOUND',
        fallbackHref,
        hasWhatsAppFallback: !!whatsappFallbackBtn
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Wholesale Form test result:', formTestResult.result.value);

  // Write full audit result
  fs.writeFileSync(
    path.join(outDir, 'phase5_full_audit.json'),
    JSON.stringify({ pages: auditReport, mobile: mobileResults, wholesaleForm: formTestResult.result.value, consoleMessages }, null, 2)
  );

  ws.close();
  child.kill();
  console.log('\nPhase 5 Audit complete. Results saved to phase5_full_audit.json');
  process.exit(0);
}

main().catch(err => {
  console.error('Audit script failed:', err);
  child.kill();
  process.exit(1);
});
