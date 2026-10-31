const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///sandbox/workspace/abyss/index.html',{waitUntil:'load'});
  await p.waitForTimeout(800); await p.click('#untie'); await p.waitForTimeout(1400);
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.documentElement.scrollHeight*0.6);});
  await p.waitForTimeout(1200);
  const d = await p.evaluate(()=>({
    inline: document.documentElement.style.getPropertyValue('--corruption'),
    computed: getComputedStyle(document.documentElement).getPropertyValue('--corruption'),
    y: window.scrollY, h: document.documentElement.scrollHeight,
    hasCorrupt: !!(window.ABYSS&&window.ABYSS.corrupt)
  }));
  console.log(JSON.stringify(d), 'errs', errs.length, errs[0]||'');
  await b.close();
})();
