const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({
    executablePath: '/sandbox/workspace/chromebin/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file:///sandbox/workspace/abyss/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  await p.click('#untie');
  await p.waitForTimeout(1500);
  await p.mouse.move(700, 500);
  await p.waitForTimeout(400);
  await p.screenshot({ path: 'shots/p1.png' });

  await p.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const el = document.getElementById('ex03');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 50);
  });
  await p.mouse.move(700, 480);
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'shots/p3.png' });

  await p.evaluate(() => {
    const el = document.getElementById('ex07');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 50);
  });
  await p.mouse.move(700, 480);
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'shots/p7.png' });

  console.log('errors:', errs.length, errs.slice(0, 3).join(' | '));
  await b.close();
})();
