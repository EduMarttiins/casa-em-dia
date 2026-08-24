(()=>{
'use strict';
if(window.__CASATODA_37__)return;
window.__CASATODA_37__=true;

let unlockNoticeShown=false;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function requested(){const b=bridge();try{return !!(b&&typeof b.getParentUnlockRequested==='function'&&b.getParentUnlockRequested())}catch(e){return false}}
function grant(){
 const b=bridge();
 if(!b||typeof b.grantParentUnlock!=='function')return false;
 try{
  b.grantParentUnlock(15);
  unlockNoticeShown=false;
  if(typeof toast==='function')toast('Aparelho liberado por 15 minutos.');
  else alert('Aparelho liberado por 15 minutos.');
  return true
 }catch(e){console.warn('CasaToda desbloqueio',e);return false}
}
function checkParentUnlock(){
 if(!requested())return;
 if(isParent()){grant();return}
 if(unlockNoticeShown)return;
 unlockNoticeShown=true;
 setTimeout(()=>{
  alert('Desbloqueio dos pais solicitado. Entre no perfil Pais e digite o PIN. Depois da confirmação, este aparelho ficará liberado por 15 minutos.');
 },120)
}

const oldEnter=typeof enterSession==='function'?enterSession:null;
if(oldEnter){enterSession=function(role){const x=oldEnter(role);setTimeout(checkParentUnlock,180);return x}}
const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();setTimeout(checkParentUnlock,120);return x}}
window.addEventListener('focus',()=>setTimeout(checkParentUnlock,120));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(checkParentUnlock,120)});
setInterval(checkParentUnlock,2500);
setTimeout(checkParentUnlock,700);
})();
