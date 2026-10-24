import http from 'http';

const routes = [
  '/en',
  '/hi',
  '/en/products',
  '/hi/products',
  '/en/products/mattresses',
  '/hi/products/mattresses',
  '/en/products/pillows',
  '/hi/products/pillows',
  '/en/products/razais',
  '/hi/products/razais',
  '/en/products/blankets',
  '/hi/products/blankets',
  '/en/wholesale',
  '/hi/wholesale',
  '/en/our-story',
  '/hi/our-story',
  '/en/contact',
  '/hi/contact',
  '/robots.txt',
  '/sitemap.xml',
];

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('=== VERIFYING LIVE ROUTES ON LOCALHOST:3000 ===\n');
  let allPassed = true;

  for (const r of routes) {
    try {
      const res = await fetchUrl(r);
      const isXmlOrTxt = r.endsWith('.txt') || r.endsWith('.xml');

      if (res.status !== 200) {
        console.error(`❌ [${res.status}] ${r}`);
        allPassed = false;
        continue;
      }

      if (isXmlOrTxt) {
        console.log(`✅ [${res.status}] ${r} (${res.body.length} bytes)`);
        continue;
      }

      const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : 'NO TITLE';
      const canonicalMatch = res.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/);
      const canonical = canonicalMatch ? canonicalMatch[1] : 'NO CANONICAL';
      const jsonLdCount = (res.body.match(/type="application\/ld\+json"/g) || []).length;

      console.log(`✅ [${res.status}] ${r}`);
      console.log(`   Title: ${title}`);
      console.log(`   Canonical: ${canonical}`);
      console.log(`   JSON-LD Schemas: ${jsonLdCount}`);
    } catch (e) {
      console.error(`❌ ERROR fetching ${r}:`, e.message);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL ROUTES VALIDATED SUCCESSFULLY WITH HTTP 200!');
  } else {
    process.exitCode = 1;
  }
}

verify();
