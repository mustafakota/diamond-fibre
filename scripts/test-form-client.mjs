import { spawn } from 'child_process';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9228',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(1500);
  const res = await fetch('http://127.0.0.1:9228/json/list');
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

  await send('Page.navigate', { url: 'http://localhost:3000/en/wholesale' });
  await sleep(3000);

  // Test 1: Submit empty form -> check client validation errors
  console.log('--- Test 1: Client-Side Validation on Empty Submit ---');
  const emptySubmitRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const form = document.querySelector('form');
      if (!form) return { error: 'Form not found' };
      form.requestSubmit();
      
      const errorEls = Array.from(document.querySelectorAll('p')).filter(p => p.className.includes('color-error-red'));
      return {
        submitted: true,
        errorsFound: errorEls.length,
        errors: errorEls.map(el => el.innerText.trim())
      };
    })()`,
    returnByValue: true
  });
  console.log('Empty submit result:', emptySubmitRes.result.value);

  // Test 2: Fill valid fields and submit -> check safe 503 error alert and WhatsApp button
  console.log('\n--- Test 2: Valid Submit with Unconfigured Provider (Safe 503 Guard) ---');
  const validSubmitRes = await send('Runtime.evaluate', {
    expression: `(async () => {
      const form = document.querySelector('form');
      const setVal = (input, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const nameInput = document.querySelector('input[placeholder*="Rajesh"]');
      const bizInput = document.querySelector('input[placeholder*="Sharma"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const mattressCheck = Array.from(document.querySelectorAll('input[type="checkbox"]'))[0];
      const qtyInput = document.querySelector('input[placeholder*="mattresses"]');
      const locInput = document.querySelector('input[placeholder*="Ujjain"]');

      setVal(nameInput, 'Rajesh Sharma');
      setVal(bizInput, 'Sharma Handloom');
      setVal(phoneInput, '9876543210');
      setVal(qtyInput, '50 mattresses');
      setVal(locInput, 'Indore, MP');

      if (mattressCheck && !mattressCheck.checked) {
        mattressCheck.click();
      }

      form.requestSubmit();

      // Wait for 503 API response and state transition
      await new Promise(r => setTimeout(r, 2000));

      const alertEl = document.querySelector('[role="alert"]');
      const whatsappBtn = alertEl ? alertEl.querySelector('a[href*="wa.me"]') : null;

      return {
        hasAlert: !!alertEl,
        alertText: alertEl ? alertEl.innerText.replace(/\\s+/g, ' ').trim() : null,
        hasWhatsAppFallback: !!whatsappBtn,
        whatsappHref: whatsappBtn ? whatsappBtn.href : null
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Valid submit result:', validSubmitRes.result.value);

  ws.close();
  child.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  child.kill();
  process.exit(1);
});
