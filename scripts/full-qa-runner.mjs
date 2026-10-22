import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:/Users/musta/.gemini/antigravity-ide/brain/6e195820-73b1-4212-a1f9-a3d177b91399/qa_screenshots';

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

  const testCases = [
    // 1. Desktop 1280px checks across all key pages
    { name: 'desktop_home_en', url: 'http://localhost:3000/en', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_home_hi', url: 'http://localhost:3000/hi', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_products_overview', url: 'http://localhost:3000/en/products', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_gaddas', url: 'http://localhost:3000/en/products/gaddas', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_mattresses', url: 'http://localhost:3000/en/products/mattresses', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_pillows', url: 'http://localhost:3000/en/products/pillows', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_razais', url: 'http://localhost:3000/en/products/razais', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_blankets', url: 'http://localhost:3000/en/products/blankets', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_our_story', url: 'http://localhost:3000/en/our-story', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_contact', url: 'http://localhost:3000/en/contact', w: 1280, h: 1000, mobile: false },
    { name: 'desktop_wholesale', url: 'http://localhost:3000/en/wholesale', w: 1280, h: 1000, mobile: false },

    // 2. Mobile Viewport Variations (320px, 360px, 390px, 430px)
    { name: 'mobile_320_home_en', url: 'http://localhost:3000/en', w: 320, h: 700, mobile: true },
    { name: 'mobile_360_home_en', url: 'http://localhost:3000/en', w: 360, h: 800, mobile: true },
    { name: 'mobile_390_home_en', url: 'http://localhost:3000/en', w: 390, h: 844, mobile: true },
    { name: 'mobile_430_home_en', url: 'http://localhost:3000/en', w: 430, h: 932, mobile: true },

    // 3. Mobile Viewport on Hindi Homepage
    { name: 'mobile_390_home_hi', url: 'http://localhost:3000/hi', w: 390, h: 844, mobile: true },

    // 4. Mobile Viewports on Key Pages
    { name: 'mobile_390_contact_en', url: 'http://localhost:3000/en/contact', w: 390, h: 844, mobile: true },
    { name: 'mobile_390_gaddas_en', url: 'http://localhost:3000/en/products/gaddas', w: 390, h: 844, mobile: true },
    { name: 'mobile_390_wholesale_en', url: 'http://localhost:3000/en/wholesale', w: 390, h: 844, mobile: true },

    // 5. Tablet Viewport (768px)
    { name: 'tablet_768_home_en', url: 'http://localhost:3000/en', w: 768, h: 1024, mobile: false },
    { name: 'tablet_768_contact_en', url: 'http://localhost:3000/en/contact', w: 768, h: 1024, mobile: false }
  ];

  const results = [];

  for (const tc of testCases) {
    console.log(`Testing ${tc.name} (${tc.w}x${tc.h}) -> ${tc.url} ...`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: tc.w,
      height: tc.h,
      deviceScaleFactor: tc.mobile ? 2 : 1,
      mobile: tc.mobile,
    });

    await send('Page.navigate', { url: tc.url });
    // Allow DOM to settle and images to render
    await sleep(2200);

    const audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasHOverflow = docW > winW;
        const h1 = document.querySelector('h1');
        const h1Text = h1 ? h1.innerText.replace(/\\s+/g, ' ').trim() : null;
        const h1Opacity = h1 ? window.getComputedStyle(h1).opacity : null;

        // Check broken images
        const brokenImages = [];
        document.querySelectorAll('img').forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            brokenImages.push(img.src);
          }
        });

        // Check map iframe on contact page
        const mapIframe = document.querySelector('iframe');
        const mapIframeSrc = mapIframe ? mapIframe.src : null;

        // Check navigation menu button on mobile/tablet
        const navMenuBtn = document.querySelector('button[aria-label="Open navigation menu"]');
        const desktopNav = document.querySelector('nav');
        const isDesktopNavVisible = desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false;
        const isNavMenuBtnVisible = navMenuBtn ? window.getComputedStyle(navMenuBtn).display !== 'none' : false;

        return {
          docW,
          winW,
          hasHOverflow,
          h1Text,
          h1Opacity,
          brokenImagesCount: brokenImages.length,
          brokenImages,
          hasMapIframe: !!mapIframe,
          mapIframeSrc,
          isDesktopNavVisible,
          isNavMenuBtnVisible
        };
      })()`,
      returnByValue: true
    });

    const val = audit.result.value;
    const dest = path.join(outDir, `${tc.name}.png`);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(dest, buffer);

    console.log(`  ✓ Status: docW=${val.docW}, winW=${val.winW}, hOverflow=${val.hasHOverflow}, h1="${val.h1Text?.slice(0, 30)}...", h1Op=${val.h1Opacity}, brokenImgs=${val.brokenImagesCount}, navVis=${val.isDesktopNavVisible ? 'desktop' : val.isNavMenuBtnVisible ? 'mobile-btn' : 'NONE'}, size=${buffer.length}b`);

    results.push({
      ...tc,
      audit: val,
      screenshotSize: buffer.length
    });
  }

  // 6. Test Mobile Navigation Drawer Interaction
  console.log('\nTesting Mobile Navigation Drawer Interaction on 390px ...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Page.navigate', { url: 'http://localhost:3000/en' });
  await sleep(2000);

  // Click hamburger button
  const clickResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Open navigation menu"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`,
    returnByValue: true
  });

  await sleep(600); // wait for drawer animation

  const drawerAudit = await send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.getElementById('mobile-navigation-drawer');
      const drawerTransform = drawer ? window.getComputedStyle(drawer).transform : null;
      const isOpen = drawerTransform === 'none' || drawerTransform?.includes('matrix(1, 0, 0, 1, 0, 0)');
      const links = drawer ? Array.from(drawer.querySelectorAll('a')).map(a => a.innerText.trim()).filter(Boolean) : [];
      const hasCloseBtn = !!drawer?.querySelector('button[aria-label="Close menu"]');
      return {
        drawerFound: !!drawer,
        drawerTransform,
        isOpen,
        linksCount: links.length,
        links,
        hasCloseBtn
      };
    })()`,
    returnByValue: true
  });

  const drawerVal = drawerAudit.result.value;
  console.log('  Drawer evaluation:', drawerVal);

  const drawerScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  const drawerBuffer = Buffer.from(drawerScreenshot.data, 'base64');
  fs.writeFileSync(path.join(outDir, 'mobile_drawer_open.png'), drawerBuffer);
  console.log('  ✓ Saved mobile_drawer_open.png, size:', drawerBuffer.length);

  ws.close();
  child.kill();

  fs.writeFileSync(
    path.join(outDir, 'qa_audit_results.json'),
    JSON.stringify({ testCases: results, drawerAudit: drawerVal }, null, 2)
  );

  console.log('\nAll QA tests completed successfully! Results written to qa_audit_results.json');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in QA runner:', err);
  child.kill();
  process.exit(1);
});
