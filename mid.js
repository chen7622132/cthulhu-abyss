const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport:{width:1440,height:950} });
  await p.goto('file:///sandbox/workspace/abyss/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900); await p.click('#untie'); await p.waitForTimeout(1400);
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';
    const e=document.getElementById('ex03'); const r=e.getBoundingClientRect();
    window.scrollTo(0, r.top+window.scrollY+r.height*0.45);});
  await p.mouse.move(720,500); await p.waitForTimeout(900);
  await p.screenshot({path:'shots/mid03.png'});
  const info = await p.evaluate(()=>{
    const pb=document.querySelector('#ex03 .paper-bg'); const r=pb.getBoundingClientRect();
    const cs=getComputedStyle(pb);
    return {w:Math.round(r.width),h:Math.round(r.height),size:cs.backgroundSize,rep:cs.backgroundRepeat,
            img:cs.backgroundImage.split('/').pop().slice(0,30)};
  });
  console.log(JSON.stringify(info));
  await b.close();
})();
