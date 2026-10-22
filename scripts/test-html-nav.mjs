function decodeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const enNav = {
  home: 'Home',
  products: 'Products',
  mattresses: 'Mattresses',
  pillows: 'Pillows',
  razais: 'Razais',
  blankets: 'Blankets',
  wholesale: 'Wholesale & Resellers',
  ourStory: 'Our Story',
  contact: 'Contact',
};

const hiNav = {
  home: 'होम',
  products: 'उत्पाद',
  mattresses: 'गद्दे',
  pillows: 'तकिए',
  razais: 'रज़ाइयां',
  blankets: 'कंबल',
  wholesale: 'थोक व रीसेलर्स',
  ourStory: 'हमारा परिचय',
  contact: 'संपर्क',
};

const routes = [
  // English
  { path: '/en', name: 'Home (EN)', expectedActive: [enNav.home] },
  { path: '/en/products', name: 'Products (EN)', expectedActive: [enNav.products] },
  { path: '/en/products/mattresses', name: 'Mattresses (EN)', expectedActive: [enNav.products, enNav.mattresses] },
  { path: '/en/products/pillows', name: 'Pillows (EN)', expectedActive: [enNav.products, enNav.pillows] },
  { path: '/en/products/razais', name: 'Razais (EN)', expectedActive: [enNav.products, enNav.razais] },
  { path: '/en/products/blankets', name: 'Blankets (EN)', expectedActive: [enNav.products, enNav.blankets] },
  { path: '/en/our-story', name: 'Our Story (EN)', expectedActive: [enNav.ourStory] },
  { path: '/en/contact', name: 'Contact (EN)', expectedActive: [enNav.contact] },
  { path: '/en/wholesale', name: 'Wholesale (EN)', expectedActive: [enNav.wholesale] },

  // Hindi
  { path: '/hi', name: 'Home (HI)', expectedActive: [hiNav.home] },
  { path: '/hi/products', name: 'Products (HI)', expectedActive: [hiNav.products] },
  { path: '/hi/products/mattresses', name: 'Mattresses (HI)', expectedActive: [hiNav.products, hiNav.mattresses] },
  { path: '/hi/products/pillows', name: 'Pillows (HI)', expectedActive: [hiNav.products, hiNav.pillows] },
  { path: '/hi/products/razais', name: 'Razais (HI)', expectedActive: [hiNav.products, hiNav.razais] },
  { path: '/hi/products/blankets', name: 'Blankets (HI)', expectedActive: [hiNav.products, hiNav.blankets] },
  { path: '/hi/our-story', name: 'Our Story (HI)', expectedActive: [hiNav.ourStory] },
  { path: '/hi/contact', name: 'Contact (HI)', expectedActive: [hiNav.contact] },
  { path: '/hi/wholesale', name: 'Wholesale (HI)', expectedActive: [hiNav.wholesale] },
];

async function run() {
  let allPassed = true;
  console.log('--- Verifying Nav Highlights Across Routes ---');

  for (const route of routes) {
    const res = await fetch(`http://localhost:3000${route.path}`);
    if (res.status !== 200) {
      console.error(`FAIL: ${route.path} returned status ${res.status}`);
      allPassed = false;
      continue;
    }
    const html = await res.text();

    // Check aria-current="page" elements in nav
    const ariaMatches = [...html.matchAll(/<a[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/a>/gi)];
    const activeText = ariaMatches.map(m => decodeHtml(m[1].replace(/<[^>]+>/g, '')).trim());

    // Check if Wholesale is falsely active
    const isWholesaleActive = activeText.some(t => t === enNav.wholesale || t === hiNav.wholesale);
    const shouldWholesaleBeActive = route.expectedActive.some(t => t === enNav.wholesale || t === hiNav.wholesale);

    if (isWholesaleActive !== shouldWholesaleBeActive) {
      console.error(`FAIL [Wholesale State]: Route ${route.path} - Wholesale active is ${isWholesaleActive}, expected ${shouldWholesaleBeActive}`);
      allPassed = false;
    }

    // Verify expected active items match
    const hasExpected = route.expectedActive.every(exp => activeText.includes(exp));
    if (!hasExpected) {
      console.error(`FAIL [Active Items]: Route ${route.path} - Found active: [${activeText.join(', ')}], expected to contain: [${route.expectedActive.join(', ')}]`);
      allPassed = false;
    } else {
      console.log(`PASS: ${route.path} -> Active items: [${activeText.join(', ')}]`);
    }
  }

  if (allPassed) {
    console.log('\nALL 18 ROUTE SSR CHECKS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
