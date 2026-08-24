(()=>{
'use strict';
if(window.__CASATODA_37__)return;
window.__CASATODA_37__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function localCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function localDateKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function childRole(){try{if(typeof isChildSession==='function'&&isChildSession())return String(sessionRole||'')}catch(e){}return ''}
function getNativeChild(){const b=bridge();if(!b||typeof b.getChildId!=='function')return '';try{return String(b.getChildId()||'')}catch(e){return ''}}
function getNativeCode(){const b=bridge();if(!b||typeof b.getFamilyCode!=='function')return '';try{return String(b.getFamilyCode()||'').trim().toUpperCase()}catch(e){return ''}}
function syncFamilyCode(){const b=bridge();if(!b)return '';let c=localCode()||getNativeCode();if(c){try{localStorage.setItem(CODE_KEY,c)}catch(e){}try{if(typeof b.setFamilyCode==='function')b.setFamilyCode(c)}catch(e){}}return c}
function pushSchedule(id,shared){
 const b=bridge();if(!b||!id||typeof b.setChildSchedule!=='function'||!shared)return;
 const base=Math.max(0,Math.min(1439,Number(shared?.settings?.cutoffMinutes?.[id]??1320)));
 const rec=shared?.days?.[localDateKey()]?.children?.[id]||{};
 const lost=Math.max(0,Number(rec.lost||0));
 const gained=Math.max(0,Number(rec.gained||0));
 try{b.setChildSchedule(id,Math.round(base),Math.round(lost),Math.round(gained))}catch(e){console.warn('CasaToda Android horário',e)}
}
function pushFromLocal(){
 const b=bridge();if(!b)return;
 const role=childRole();
 let id=role||getNativeChild();
 if(!id)return;
 try{pushSchedule(id,state)}catch(e){}
}
async function fetchRemote(){
 const c=syncFamilyCode();if(!c)return null;
 const r=await fetch(`${SB_URL}/rest/v1/rpc/casatoda_get_state`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY},body:JSON.stringify({p_code:c}),cache:'no-store'});
 if(!r.ok)throw new Error('sync '+r.status);
 const rows=await r.json();
 return Array.isArray(rows)&&rows.length?rows[0]?.state:null
}
let refreshing=false;
async function refreshNative(){
 const b=bridge();if(!b||refreshing)return;
 refreshing=true;
 try{
  syncFamilyCode();
  const role=childRole();
  let id=role||getNativeChild();
  if(role&&typeof b.setChildSchedule==='function')pushFromLocal();
  if(!id)return;
  const remote=await fetchRemote();
  if(remote)pushSchedule(id,remote)
 }catch(e){console.warn('CasaToda Android atualização remota',e)}finally{refreshing=false}
}

const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();setTimeout(pushFromLocal,50);setTimeout(refreshNative,250);return x}}
window.addEventListener('focus',()=>setTimeout(refreshNative,100));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refreshNative,100)});
setInterval(refreshNative,4000);
setTimeout(()=>{syncFamilyCode();pushFromLocal();refreshNative()},700);
})();
