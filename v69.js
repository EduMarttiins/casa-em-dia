(()=>{
'use strict';
if(window.__CASASEGURA_69__)return;
window.__CASASEGURA_69__=true;
let timer=0;
function hideLegacyAuth(){
 const g=document.getElementById('authGate');
 if(!g)return;
 g.classList.add('hidden');
 g.setAttribute('aria-hidden','true');
 try{g.inert=true}catch(e){}
 g.style.setProperty('display','none','important');
 g.style.setProperty('visibility','hidden','important');
 g.style.setProperty('opacity','0','important');
 g.style.setProperty('pointer-events','none','important');
}
function patchProfileGate(){
 try{
  const current=window.renderProfileGate;
  if(current&&current.__cs69Blocked)return;
  const blocked=function(){hideLegacyAuth();return null};
  blocked.__cs69Blocked=true;
  window.renderProfileGate=blocked;
 }catch(e){}
}
function apply(){hideLegacyAuth();patchProfileGate()}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,0)}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'||x.type==='attributes'))schedule()});
try{obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']})}catch(e){}
window.addEventListener('pageshow',apply);
window.addEventListener('focus',apply);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply()});
apply();setTimeout(apply,50);setTimeout(apply,300);setInterval(()=>{if(!document.hidden)apply()},2500);
})();
