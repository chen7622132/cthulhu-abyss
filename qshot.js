const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
  for (const [mode,name] of [['','normal'],['?quiet=1','quiet']]) {
    const p = await b.newPage({ viewport:{width:1440,height:950} });
    await p.goto('file:///sandbox/workspace/abyss/index.html'+mode,{waitUntil:'load'});
    await p.waitForTimeout(900);
    await p.click('#untie'); await p.waitForTimeout(1300);
    await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const e=document.getElementById('ex03');window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-50);});
    await p.mouse.move(700,480); await p.waitForTimeout(800);
    await p.screenshot({path:'shots/m-'+name+'.png'});
    await p.close();
  }
  console.log('ok'); await b.close();
})();
