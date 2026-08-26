(()=>{
'use strict';
if(window.__CASASEGURA_59_COMPAT__)return;
window.__CASASEGURA_59_COMPAT__=true;
const TOKEN_KEY='casasegura_device_token';
const BACKUP_KEY='casasegura_device_credential';
const CODE_KEY='casatoda_family_code';
const BOUND_KEY='casasegura_bound_child';
let fastTimer=0;
let fastCount=0;
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function apply(){
 const b=bridge();if(!b)return;
 let token='';
 try{token=String(localStorage.getItem(TOKEN_KEY)||localStorage.getItem(BACKUP_KEY)||'').trim().toUpperCase()}catch(e){}
 if(token){
  try{localStorage.setItem(CODE_KEY,token);localStorage.setItem(BACKUP_KEY,token)}catch(e){}
  try{if(typeof b.setFamilyCode==='function')b.setFamilyCode(token)}catch(e){}
  try{localStorage.removeItem(TOKEN_KEY)}catch(e){}
 }
 let id='';try{id=String(localStorage.getItem(BOUND_KEY)||'').trim().toLowerCase()}catch(e){}
 if(id){
  try{const current=String(b.getDeviceProfile?.()||'').trim().toLowerCase();if(!current&&typeof b.setDeviceProfile==='function')b.setDeviceProfile(id)}catch(e){}
 }
}
function fast(){apply();fastCount++;if(fastCount>=24){clearInterval(fastTimer);fastTimer=0}}
fastTimer=setInterval(fast,250);
setTimeout(apply,0);
setTimeout(apply,120);
setTimeout(apply,600);
window.addEventListener('pageshow',apply);
window.addEventListener('focus',apply);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply()});
setInterval(()=>{if(!document.hidden)apply()},5000);
})();
