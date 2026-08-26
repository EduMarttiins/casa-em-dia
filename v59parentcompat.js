(()=>{
'use strict';
if(window.__CASASEGURA_59_PARENT_COMPAT__)return;
window.__CASASEGURA_59_PARENT_COMPAT__=true;
let timer=0;
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function ensureStyle(){if(document.getElementById('cs59ParentCompatStyle'))return;const s=document.createElement('style');s.id='cs59ParentCompatStyle';s.textContent=`
 #cs56Parent.cs59-parent-fallback{min-width:56px!important;width:auto!important;height:42px!important;padding:0 12px!important;border:1px solid #e8e3f0!important;border-radius:14px!important;background:#fff!important;color:#4d455e!important;font:900 10px system-ui!important;box-shadow:0 6px 16px rgba(35,30,60,.07)!important}
 body.cs56-parent #cs56Parent.cs59-parent-fallback{display:none!important}
 `;document.head.appendChild(s)}
function ensure(){
 ensureStyle();
 if(bridge()||!isParent())return;
 if(document.getElementById('cs56Parent'))return;
 const top=document.querySelector('.top-actions');if(!top)return;
 const b=document.createElement('button');b.type='button';b.id='cs56Parent';b.className='cs59-parent-fallback';b.textContent='Conta';b.setAttribute('aria-label','Conta da família');top.appendChild(b);
}
function schedule(){clearTimeout(timer);timer=setTimeout(ensure,80)}
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',ensure);document.addEventListener('visibilitychange',()=>{if(!document.hidden)ensure()});
setTimeout(ensure,100);setTimeout(ensure,700);setInterval(()=>{if(!document.hidden)ensure()},4000);
})();
