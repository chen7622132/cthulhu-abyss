const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///sandbox/workspace/abyss/preview.html', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: '/sandbox/workspace/abyss/shots/v2-03.png' });
  console.log('shot ok, errors:', errs.length, errs.join('|'));
  await b.close();
})();
