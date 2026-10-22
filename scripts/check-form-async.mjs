import { spawn } from 'child_process';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const child = spawn(edge, ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9231', 'http://localhost:3000/hi/wholesale'], { stdio: 'ignore' });

setTimeout(async () => {
  const res = await fetch('http://127.0.0.1:9231/json/list');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const send = (m, p = {}) => new Promise(r => {
    const msgId = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === msgId) { ws.removeEventListener('message', handler); r(d.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method: m, params: p }));
  });
  ws.onopen = async () => {
    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 2500));
    const evalRes = await send('Runtime.evaluate', {
      expression: `(async () => {
        const f = document.querySelector('form');
        f.requestSubmit();
        await new Promise(r => setTimeout(r, 500));
        return Array.from(document.querySelectorAll('p')).filter(p => p.className.includes('color-error-red')).map(p => p.innerText);
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Hindi validation errors found after React re-render:', evalRes.result.value);
    ws.close();
    child.kill();
  };
}, 1500);
