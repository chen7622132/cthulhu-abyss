const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport:{width:1440,height:950} });
  await p.goto('file:///sandbox/workspace/abyss/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900); await p.click('#untie'); await p.waitForTimeout(1400);
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const e=document.getElementById('ex03');window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-50);});
  await p.mouse.move(700,480); await p.waitForTimeout(900);
  const r = await p.evaluate(()=>{
    const g=(sel,props)=>{const el=document.querySelector(sel); if(!el) return sel+': MISSING';
      const cs=getComputedStyle(el); return sel+': '+props.map(pp=>pp+'='+cs[pp]).join(' | ');};
    const pb=document.querySelector('#ex03 .paper-bg');
    const cs=pb?getComputedStyle(pb):null;
    return [
      g('#lamp',['display','opacity','zIndex']),
      'lamp--r='+getComputedStyle(document.documentElement).getPropertyValue('--lamp-r'),
      g('body',['backgroundColor']),
      '#stack filter='+(getComputedStyle(document.getElementById('stack')).filter||'none').slice(0,60),
      '#archive filter='+(getComputedStyle(document.getElementById('archive')).filter||'none').slice(0,80),
      '#ex03 .sheet filter='+(getComputedStyle(document.querySelector('#ex03 .sheet')).filter||'none').slice(0,90),
      'paper-bg bgimg='+(cs?cs.backgroundImage.slice(0,70):'?'),
      'paper-bg filter='+(cs?cs.filter:'?'),
      'paper-bg mask='+(cs?(cs.maskImage||'none').slice(0,50):'?'),
      'paper-bg size='+(pb?pb.getBoundingClientRect().width.toFixed(0)+'x'+pb.getBoundingClientRect().height.toFixed(0):'?')
    ];
  });
  r.forEach(x=>console.log(x));
  await b.close();
})();
