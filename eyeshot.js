const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'] });
  const p = await b.newPage({ viewport:{width:1280,height:800} });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file:///sandbox/workspace/abyss/index.html',{waitUntil:'load'});
  await p.waitForTimeout(1000);
  await p.evaluate(()=>{window.ABYSS.eye.start(()=>{});});
  await p.waitForTimeout(4200);
  await p.screenshot({path:'shots/e1.png'});
  await p.waitForTimeout(4000);
  await p.screenshot({path:'shots/e2.png'});
  console.log('errors:',errs.length, errs.slice(0,2).join('|'));
  await b.close();
})();
