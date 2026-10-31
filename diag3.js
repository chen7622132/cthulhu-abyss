const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath:'/sandbox/workspace/chromebin/chrome-linux64/chrome', args:['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport:{width:1280,height:800} });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file:///sandbox/workspace/abyss/index.html',{waitUntil:'load'});
  // 模拟用户已打开 8 次
  await p.evaluate(()=>{ localStorage.setItem('abyss.v1', JSON.stringify({count:8, first:Date.now()})); });
  await p.reload({waitUntil:'load'});
  await p.waitForTimeout(1000);
  const note = await p.evaluate(()=>{const n=document.querySelector('.cover-note'); return n?n.textContent.trim():'MISSING';});
  console.log('封面文字:', note);
  const btnBox = await p.evaluate(()=>{const b=document.getElementById('untie'); const r=b.getBoundingClientRect(); const cs=getComputedStyle(b);
    return {visible:r.width>0&&r.height>0, top:Math.round(r.top), h:Math.round(r.height), display:cs.display, z:cs.zIndex, pe:cs.pointerEvents};});
  console.log('按钮:', JSON.stringify(btnBox));
  // 检查按钮中心点的最上层元素是谁
  const topEl = await p.evaluate(()=>{const b=document.getElementById('untie'); const r=b.getBoundingClientRect();
    const el=document.elementFromPoint(r.left+r.width/2, r.top+r.height/2);
    return el? (el.id||el.className||el.tagName):'null';});
  console.log('按钮中心最上层元素:', topEl);
  await p.click('#untie',{timeout:6000}).catch(e=>console.log('CLICK FAIL:', e.message.split('\n')[0]));
  await p.waitForTimeout(2000);
  const after = await p.evaluate(()=>({hidden:document.getElementById('archive').hidden, cls:document.body.className}));
  console.log('点击后:', JSON.stringify(after));
  console.log('错误:', errs.length, errs.slice(0,3).join(' | '));
  await b.close();
})();
