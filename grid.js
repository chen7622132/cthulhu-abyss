const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport:{width:1440,height:950} });
  await p.goto('file:///sandbox/workspace/abyss/index.html?quiet=1',{waitUntil:'load'});
  await p.waitForTimeout(900);
  await p.click('#untie'); await p.waitForTimeout(1400);
  const ids=['ex01','ex02','ex03','ex04','ex05','ex06','ex07'];
  for(let i=0;i<ids.length;i++){
    await p.evaluate((id)=>{document.documentElement.style.scrollBehavior='auto';const e=document.getElementById(id);window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-40);},ids[i]);
    await p.waitForTimeout(700);
    await p.screenshot({path:'shots/g'+i+'.png'});
  }
  console.log('ok'); await b.close();
})();
