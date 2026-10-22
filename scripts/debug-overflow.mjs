import { spawn } from 'child_process';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9222',
  '--window-size=768,1024',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await sleep(1500);
  const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);

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
    width: 768,
    height: 1024,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:3000/en' });
  await sleep(2000);

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const bad = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > 770) {
          bad.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
            right: r.right,
            width: r.width,
            parent: el.parentElement ? el.parentElement.tagName + '.' + (typeof el.parentElement.className === 'string' ? el.parentElement.className.slice(0, 40) : '') : null
          });
        }
      });
      return bad;
    })()`,
    returnByValue: true
  });

  console.log('Total overflowing elements at 768px:', res.result.value.length);
  // Sort by widest
  const sorted = res.result.value.sort((a, b) => b.width - a.width);
  console.log('Top 10 widest overflowing elements:');
  sorted.slice(0, 10).forEach((item, i) => {
    console.log(`${i + 1}. <${item.tag}> class="${item.className}" w=${item.width} right=${item.right} (parent: ${item.parent})`);
  });

  ws.close();
  child.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  child.kill();
  process.exit(1);
});
