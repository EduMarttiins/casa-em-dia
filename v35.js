(()=>{
'use strict';
if(window.__CASATODA_35__)return;
window.__CASATODA_35__=true;

function sendScheduleToAndroid(){
 try{
  const bridge=window.CasaTodaAndroid;
  if(!bridge||typeof bridge.setChildSchedule!=='function')return;
  if(typeof isChildSession!=='function'||!isChildSession())return;
  const id=String(sessionRole||'');
  if(!id)return;
  const base=Math.max(0,Math.min(1439,Number(state?.settings?.cutoffMinutes?.[id]??1320)));
  const rec=typeof ensureDay==='function'?(ensureDay()?.children?.[id]||{}):{};
  const lost=Math.max(0,Number(rec.lost||0));
  const gained=Math.max(0,Number(rec.gained||0));
  bridge.setChildSchedule(id,Math.round(base),Math.round(lost),Math.round(gained));
 }catch(e){console.warn('CasaToda Android bridge',e)}
}

const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();setTimeout(sendScheduleToAndroid,80);return x}}
window.addEventListener('focus',()=>setTimeout(sendScheduleToAndroid,100));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(sendScheduleToAndroid,100)});
setInterval(sendScheduleToAndroid,5000);
setTimeout(sendScheduleToAndroid,900);
})();
