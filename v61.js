(()=>{
'use strict';
if(window.__CASASEGURA_61__)return;
window.__CASASEGURA_61__=true;

const TOKEN_KEY='casasegura_device_token';
const BOUND_KEY='casasegura_bound_child';
let restoring=false;
let timer=0;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function boundId(){
 try{const x=String(localStorage.getItem(BOUND_KEY)||'').trim().toLowerCase();if(['bernardo','julia','irmaos'].includes(x))return x}catch(e){}
 try{const x=String(bridge()?.getDeviceProfile?.()||bridge()?.getChildId?.()||'').trim().toLowerCase();if(['bernardo','julia','irmaos'].includes(x))return x}catch(e){}
 return ''
}
function hasToken(){try{return !!String(localStorage.getItem(TOKEN_KEY)||'').trim()}catch(e){return false}}
function isBound(){const id=boundId();return !!id&&(hasToken()||!!bridge())}
function childName(id){if(id==='julia')return 'Júlia';if(id==='bernardo')return 'Bernardo';return 'Irmãos'}

function ensureStyle(){
 if(document.getElementById('cs61Style'))return;
 const s=document.createElement('style');s.id='cs61Style';s.textContent=`
 html.cs61-bound-device #switchUserBtn,
 html.cs61-bound-device [data-switch-user],
 html.cs61-bound-device [data-action="switch-user"],
 html.cs61-bound-device [aria-label*="Trocar perfil" i],
 html.cs61-bound-device [aria-label*="Trocar usuário" i],
 html.cs61-bound-device [title*="Trocar perfil" i],
 html.cs61-bound-device [title*="Trocar usuário" i]{display:none!important}
 html.cs61-bound-device #authGate{display:none!important;visibility:hidden!important;pointer-events:none!important}
 #cs61Toast{position:fixed;left:50%;bottom:calc(78px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:250000;max-width:88%;padding:10px 14px;border-radius:999px;background:#201d2f;color:#fff;font:850 11px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.24);text-align:center}
 `;document.head.appendChild(s)
}
function toast(msg){document.getElementById('cs61Toast')?.remove();const t=document.createElement('div');t.id='cs61Toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function hideLegacyGates(){
 const old=document.getElementById('authGate');
 if(old){old.classList.add('hidden');old.style.setProperty('display','none','important');old.style.setProperty('visibility','hidden','important')}
 const pin=document.getElementById('pinSheet');
 if(pin&&!pin.classList.contains('hidden'))pin.classList.add('hidden')
 const gate59=document.getElementById('cs59Gate');
 if(gate59&&isBound())gate59.classList.add('hidden')
}
function hideSwitch(){
 const selectors=['#switchUserBtn','[data-switch-user]','[data-action="switch-user"]','[aria-label*="Trocar perfil" i]','[aria-label*="Trocar usuário" i]','[title*="Trocar perfil" i]','[title*="Trocar usuário" i]'];
 document.querySelectorAll(selectors.join(',')).forEach(el=>el.style.setProperty('display','none','important'))
}
function currentChild(){try{return typeof isChildSession==='function'&&isChildSession()?String(sessionRole||'').toLowerCase():''}catch(e){return ''}}
function restoreBoundSession(show=false){
 if(restoring||!isBound())return;
 const id=boundId();if(!id)return;
 restoring=true;
 ensureStyle();document.documentElement.classList.add('cs61-bound-device');hideSwitch();hideLegacyGates();
 try{
  if((id==='bernardo'||id==='julia')&&currentChild()!==id&&typeof enterSession==='function')enterSession(id)
 }catch(e){}
 setTimeout(()=>{
  hideSwitch();hideLegacyGates();
  try{if(typeof render==='function')render()}catch(e){}
  restoring=false;
  if(show)toast(`Este aparelho está vinculado a ${childName(id)}.`)
 },40)
}
function patchProfileGate(){
 try{
  const base=window.renderProfileGate;
  if(typeof base!=='function'||base.__cs61Wrapped)return;
  const wrapped=function(...args){
   if(isBound()){restoreBoundSession(false);return}
   return base.apply(this,args)
  };
  wrapped.__cs61Wrapped=true;wrapped.__cs61Base=base;window.renderProfileGate=wrapped
 }catch(e){}
}
function isLegacyBackButton(el){
 if(!el)return false;
 if(el.matches?.('#switchUserBtn,[data-switch-user],[data-action="switch-user"]'))return true;
 const a=String(el.getAttribute?.('aria-label')||'').toLowerCase();
 const t=String(el.getAttribute?.('title')||'').toLowerCase();
 if(a.includes('trocar perfil')||a.includes('trocar usuário')||a.includes('trocar usuario'))return true;
 if(t.includes('trocar perfil')||t.includes('trocar usuário')||t.includes('trocar usuario'))return true;
 return false
}
function installGuard(){
 if(document.documentElement.dataset.cs61Guard==='1')return;
 document.documentElement.dataset.cs61Guard='1';
 document.addEventListener('click',e=>{
  if(!isBound())return;
  const b=e.target?.closest?.('button,[role="button"]');
  if(!isLegacyBackButton(b))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();restoreBoundSession(true)
 },true)
}
function tick(){
 ensureStyle();patchProfileGate();installGuard();
 if(isBound())restoreBoundSession(false);else document.documentElement.classList.remove('cs61-bound-device')
}
function schedule(){clearTimeout(timer);timer=setTimeout(tick,35)}

const obs=new MutationObserver(schedule);try{obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}catch(e){}
window.addEventListener('pageshow',schedule);window.addEventListener('focus',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
setTimeout(tick,0);setTimeout(tick,300);setTimeout(tick,1000);setInterval(()=>{if(!document.hidden)tick()},3000);
})();
