(()=>{
'use strict';
if(window.__CASATODA_45__)return;
window.__CASATODA_45__=true;

function isParent45(){
 try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}
}
function moveDeviceControl(){
 const b=document.getElementById('ctDeviceControl44');
 if(!b||!isParent45())return;
 try{if(window.CasaTodaAndroid)return}catch(e){}
 const app=document.querySelector('.app');
 const top=app?.querySelector('.top');
 if(!app||!top)return;
 if(b.parentElement!==app||b.previousElementSibling!==top){
  top.insertAdjacentElement('afterend',b);
 }
 b.setAttribute('aria-label','Central dos aparelhos, controle dos pais');
 b.title='Central dos aparelhos';
}
function tuneSync(){
 const chip=document.getElementById('ctSyncChip');
 if(!chip)return;
 const txt=chip.querySelector('.txt');
 if(txt&&chip.classList.contains('ok')&&txt.textContent.trim()!=='Sincronizado')txt.textContent='Sincronizado';
}
function tune(){moveDeviceControl();tuneSync()}

const obs=new MutationObserver(()=>tune());
obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',()=>setTimeout(tune,0));
window.addEventListener('focus',()=>setTimeout(tune,0));
document.addEventListener('click',()=>setTimeout(tune,0),true);
setTimeout(tune,0);
setTimeout(tune,300);
setTimeout(tune,1000);
})();
