const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome',
    args:['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport:{width:1280,height:800} });
  const errs=[], fails=[];
  p.on('pageerror',e=>errs.push('PAGEERR: '+e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE: '+m.text());});
  p.on('requestfailed',r=>fails.push(r.url().split('/').pop()+' <- '+(r.failure()||{}).errorText));
  try {
    await p.goto('https://chen7622132.github.io/cthulhu-abyss/', {waitUntil:'load', timeout:45000});
  } catch(e) { console.log('GOTO FAIL:', e.message.split('\n')[0]); await b.close(); return; }
  await p.waitForTimeout(2000);
  const before = await p.evaluate(()=>({paper: typeof (window.ABYSS&&window.ABYSS.paper), cover: !!document.getElementById('cover'), hidden: document.getElementById('archive').hidden}));
  console.log('BEFORE:', JSON.stringify(before));
  try {
    await p.click('#untie', {timeout:8000});
  } catch(e) { console.log('CLICK FAIL:', e.message.split('\n')[0]); }
  await p.waitForTimeout(2500);
  const after = await p.evaluate(()=>({
    archiveHidden: document.getElementById('archive').hidden,
    bodyClass: document.body.className,
    paperBgs: document.querySelectorAll('.paper-bg').length,
    sheets: document.querySelectorAll('.sheet').length,
    scrollH: document.documentElement.scrollHeight
  }));
  console.log('AFTER:', JSON.stringify(after));
  console.log('ERRORS:', errs.length); errs.slice(0,5).forEach(e=>console.log('  '+e));
  console.log('FAILED REQ:', fails.length); fails.slice(0,5).forEach(e=>console.log('  '+e));
  await p.screenshot({path:'shots/online-after.png'});
  await b.close();
})();
