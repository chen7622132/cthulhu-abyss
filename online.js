const { chromium } = require('playwright-core');
const path = require('path');
const URL = 'https://chen7622132.github.io/cthulhu-abyss/';
(async () => {
  const browser = await chromium.launch({
    executablePath: '/sandbox/workspace/chromebin/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader',
      '--use-gl=angle', '--use-angle=swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  page.on('requestfailed', r => errs.push('[404/fail] ' + r.url()));

  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/sandbox/workspace/abyss/shots/online-1.png' });

  await page.click('#untie');
  await page.waitForTimeout(1800);
  await page.mouse.move(720, 520);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/sandbox/workspace/abyss/shots/online-2.png' });

  const st = await page.evaluate(() => ({
    archiveShown: !document.getElementById('archive').hidden,
    sheets: document.querySelectorAll('.sheet').length,
    scrollH: document.documentElement.scrollHeight,
    css: getComputedStyle(document.getElementById('lamp')).backgroundImage.slice(0, 40)
  }));
  console.log('ONLINE:', JSON.stringify(st));
  console.log('ERRORS (' + errs.length + '):');
  errs.forEach(e => console.log('  ' + e));
  await browser.close();
})();
