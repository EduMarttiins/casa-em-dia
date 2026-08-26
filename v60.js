(()=>{
'use strict';
if(window.__CASASEGURA_60__)return;
window.__CASASEGURA_60__=true;

let decorateTimer=0;
let fitTimer=0;
let feedbackTimer=0;
const preloaded=new Set();

function q(s,p=document){return p.querySelector(s)}
function qa(s,p=document){return [...p.querySelectorAll(s)]}
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function childId(){
 try{if(isChild())return String(sessionRole||'').toLowerCase()}catch(e){}
 try{const x=String(bridge()?.getDeviceProfile?.()||bridge()?.getChildId?.()||'').toLowerCase();if(x)return x}catch(e){}
 try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}
 return ''
}
function activeSelected(){try{return String(selected||'')}catch(e){return ''}}
function dateKey(){
 try{if(typeof todayKey==='function')return todayKey()}catch(e){}
 const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function isVisible(el){
 if(!el||!el.isConnected)return false;
 try{const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false}catch(e){}
 return !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)
}

function stateSignature(){
 try{
  if(!isChild()&&!isParent())return '';
  const id=isChild()?childId():activeSelected();
  const day=state?.days?.[dateKey()]?.children?.[id]||null;
  return JSON.stringify([
   isChild()?'child':'parent',id,
   state?.stars?.[id]??0,
   state?.settings?.cutoffMinutes?.[id]??null,
   state?.settings?.dailyMinutes?.[id]??null,
   day,
   state?.tasks||[],
   state?.rewards||[],
   state?.rewardRequests||[],
   state?.cashRedemptions||[],
   state?.bonusAwards||[]
  ])
 }catch(e){return ''}
}
function patchRender(){
 try{
  const base=window.render;
  if(typeof base!=='function'||base.__cs60Wrapped)return;
  let lastSig='';let lastAt=0;
  const wrapped=function(...args){
   const now=Date.now();const sig=stateSignature();
   const canSkip=(isChild()||isParent())&&sig&&sig===lastSig&&(now-lastAt)<12000&&!window.__CS60_FORCE_RENDER__;
   if(canSkip){scheduleDecorate(20);return}
   const out=base.apply(this,args);
   lastSig=stateSignature();lastAt=Date.now();scheduleDecorate(15);return out
  };
  wrapped.__cs60Wrapped=true;wrapped.__cs60Base=base;window.render=wrapped
 }catch(e){console.warn('CasaSegura V60 render',e)}
}

function photoFor(id){
 try{const c=state?.children?.find(x=>x.id===id);if(c?.photo)return String(c.photo)}catch(e){}
 if(id==='bernardo')return new URL('./media21/bernardo.jpg?v=60',location.href).href;
 return ''
}
function preload(src){
 if(!src||preloaded.has(src))return;preloaded.add(src);
 try{const im=new Image();im.decoding='async';im.src=src}catch(e){}
}
function setBackground(el,src,key){
 if(!el||!src)return;preload(src);
 if(el.dataset.cs60Photo!==key){
  el.dataset.cs60Photo=key;
  try{el.style.setProperty('background-image',`url(${JSON.stringify(src)})`,'important')}catch(e){}
 }
 el.style.setProperty('background-size','cover','important');
 el.style.setProperty('background-repeat','no-repeat','important');
 el.style.setProperty('background-position','center 28%','important');
 el.style.setProperty('color','transparent','important');
 el.style.setProperty('font-size','0','important');
 qa(':scope > img',el).forEach(img=>{img.alt='';img.style.setProperty('opacity','0','important');img.style.setProperty('visibility','hidden','important');img.style.setProperty('font-size','0','important')})
}
function setImgStable(img,src){
 if(!img||!src)return;preload(src);img.alt='';img.style.objectFit='cover';img.style.objectPosition='center 28%';
 try{if(img.src!==new URL(src,location.href).href)img.src=src}catch(e){if(img.getAttribute('src')!==src)img.src=src}
}
function stabilizePhotos(){
 for(const id of ['bernardo','julia']){
  const src=photoFor(id);if(!src)continue;
  qa(`[data-v15-child="${id}"] .v15-tab-avatar`).forEach(el=>setBackground(el,src,`${id}-tab-60`));
  qa(`#authGate [data-login-role="${id}"] .profile-photo`).forEach(el=>el.tagName==='IMG'?setImgStable(el,src):setBackground(el,src,`${id}-auth-60`));
 }
 qa('#people .person').forEach(card=>{
  let id=String(card.dataset.person||'').toLowerCase();
  if(!id&&card.classList.contains('julia'))id='julia';
  if(!id){try{id=isChild()?String(sessionRole||'').toLowerCase():String(selected||'').toLowerCase()}catch(e){}}
  if(id!=='bernardo'&&id!=='julia')return;
  const src=photoFor(id),avatar=q('.avatar',card);if(src&&avatar)setBackground(avatar,src,`${id}-main-60`)
 })
}

function updateNavHeight(){
 let h=0;
 for(const nav of [q('.nav'),q('#cs56Nav')]){
  if(!nav||!isVisible(nav))continue;
  const r=nav.getBoundingClientRect();h=Math.max(h,Math.ceil(r.height))
 }
 if(!h)h=0;
 document.documentElement.style.setProperty('--cs60-nav-h',`${h}px`)
}

function ensureHistoryTab(){
 let b=q('#cs60HistoryTab');
 if(!isChild()){b?.remove();return}
 if(!b){
  b=document.createElement('button');b.id='cs60HistoryTab';b.type='button';b.textContent='Histórico';b.title='Abrir histórico';
  b.onclick=()=>{showFeedback('Abrindo histórico');const x=q('#historyBtn');if(x)x.click();else b.remove()};document.body.appendChild(b)
 }
}

function commonParent(rows){
 const ps=[...new Set(rows.map(r=>r.parentElement).filter(Boolean))];return ps.length===1?ps[0]:null
}
function visibleRows(sheet,sel){return qa(sel,sheet).filter(isVisible)}
function clearSheetClasses(overlay,sheet){
 overlay.classList.remove('cs60-reward-overlay','cs60-routine-overlay','cs60-history-overlay','cs60-cash-overlay');
 sheet.classList.remove('cs60-reward-sheet','cs60-routine-sheet','cs60-history-sheet','cs60-cash-sheet','cs60-tight','cs60-ultra');
 sheet.style.removeProperty('zoom');sheet.style.removeProperty('overflow-y');sheet.style.removeProperty('overflow-x')
}
function classifyOverlay(overlay){
 const sheet=q('.sheet',overlay);if(!sheet)return;
 clearSheetClasses(overlay,sheet);
 const text=String(sheet.innerText||'').toLowerCase();
 const history=visibleRows(sheet,'.historyrow');
 const tasks=visibleRows(sheet,'.taskrow');
 const rewards=visibleRows(sheet,'.rewardrow');
 const cash=/pr[oó]xima retirada|estrelas acumuladas|convers[aã]o fixa|retirada m[ií]nima/.test(text)&&text.includes('cofrinho');
 let type='';
 if(history.length)type='history';
 else if(tasks.length)type='routine';
 else if(cash)type='cash';
 else if(rewards.length)type='reward';
 if(!type)return;
 overlay.classList.add(`cs60-${type}-overlay`);sheet.classList.add(`cs60-${type}-sheet`);
 if(type==='reward'){
  const p=commonParent(rewards);if(p)p.classList.add('cs60-reward-grid');fitSheet(sheet)
 }
 if(type==='routine'){
  const p=commonParent(tasks);if(p)p.classList.add('cs60-task-grid');fitSheet(sheet)
 }
 if(type==='history'){
  const p=commonParent(history);if(p&&p!==sheet)p.classList.add('cs60-history-list');
  sheet.style.setProperty('overflow-y','auto','important');sheet.style.setProperty('overflow-x','hidden','important')
 }
 if(type==='cash'){
  decorateCash(sheet);fitSheet(sheet)
 }
 removeFeedback()
}
function decorateCash(sheet){
 const candidates=qa('button',sheet).filter(b=>isVisible(b)&&/^\s*R\$\s*\d/i.test(String(b.textContent||'')));
 if(!candidates.length)return;
 candidates.forEach(b=>b.classList.add('cs60-cash-option'));
 const p=commonParent(candidates);if(p)p.classList.add('cs60-cash-grid')
}
function fitSheet(sheet){
 clearTimeout(fitTimer);
 fitTimer=setTimeout(()=>{
  if(!sheet?.isConnected)return;
  sheet.classList.remove('cs60-tight','cs60-ultra');sheet.style.removeProperty('zoom');
  const max=Math.max(320,window.innerHeight-16);
  requestAnimationFrame(()=>{
   if(!sheet.isConnected)return;
   if(sheet.scrollHeight>max+2)sheet.classList.add('cs60-tight');
   requestAnimationFrame(()=>{
    if(!sheet.isConnected)return;
    if(sheet.scrollHeight>max+2)sheet.classList.add('cs60-ultra');
    requestAnimationFrame(()=>{
     if(!sheet.isConnected)return;
     if(sheet.scrollHeight>max+2){const z=Math.max(.72,Math.min(1,max/sheet.scrollHeight));sheet.style.setProperty('zoom',String(z),'important')}
    })
   })
  })
 },20)
}
function activeOverlays(){return qa('.overlay').filter(o=>!o.classList.contains('hidden')&&isVisible(o))}
function decorateOverlays(){
 const active=activeOverlays();document.body.classList.toggle('cs60-modal-open',active.length>0);
 active.forEach(classifyOverlay);
 if(!active.length)removeFeedback()
}

function showFeedback(text){
 let x=q('#cs60TapFeedback');if(!x){x=document.createElement('div');x.id='cs60TapFeedback';document.body.appendChild(x)}x.textContent=text;
 clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>x?.remove(),1100)
}
function removeFeedback(){clearTimeout(feedbackTimer);q('#cs60TapFeedback')?.remove()}
function actionLabel(el){
 if(!el)return '';
 const a=el.dataset?.v15Tile;
 if(a==='cash')return 'Abrindo cofrinho';if(a==='reward')return 'Abrindo prêmios';if(a==='routine')return 'Abrindo rotina';if(a==='history')return 'Abrindo histórico';
 if(el.id==='rewardBtn')return 'Abrindo prêmios';if(el.id==='routineNav')return 'Abrindo rotina';if(el.id==='historyBtn')return 'Abrindo histórico';
 const t=String(el.textContent||'').trim().toLowerCase();if(t==='cofrinho')return 'Abrindo cofrinho';return ''
}
function installTapFeedback(){
 if(document.documentElement.dataset.cs60Tap==='1')return;document.documentElement.dataset.cs60Tap='1';
 document.addEventListener('pointerdown',e=>{const el=e.target?.closest?.('[data-v15-tile],#rewardBtn,#routineNav,#historyBtn,button');const label=actionLabel(el);if(label)showFeedback(label)},true)
}

function compactHome(){
 updateNavHeight();ensureHistoryTab();stabilizePhotos();decorateOverlays();
 if((isChild()||isParent())&&!activeOverlays().length){
  try{if(window.scrollY!==0)window.scrollTo(0,0)}catch(e){}
 }
}
function decorateAll(){patchRender();compactHome()}
function scheduleDecorate(ms=45){clearTimeout(decorateTimer);decorateTimer=setTimeout(decorateAll,ms)}

installTapFeedback();patchRender();
const obs=new MutationObserver(muts=>{
 if(muts.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length)))scheduleDecorate(35)
});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('resize',()=>scheduleDecorate(60));
window.addEventListener('orientationchange',()=>scheduleDecorate(120));
window.addEventListener('pageshow',()=>scheduleDecorate(20));
window.addEventListener('focus',()=>scheduleDecorate(35));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleDecorate(35)});
setTimeout(decorateAll,0);setTimeout(decorateAll,350);setTimeout(decorateAll,1200);setInterval(()=>{if(!document.hidden)compactHome()},4000);
})();
