(()=>{
'use strict';
if(window.__CASATODA_PWA24__)return;
window.__CASATODA_PWA24__=true;
const VKEY='casatoda_current_version';
const DKEY='casatoda_install_dismissed';
const INSTALLED=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
let deferred=window.__CASATODA_INSTALL_PROMPT||null;
let reloading=false;
let checking=false;
function makeInstallUI(){
 if(INSTALLED()||document.getElementById('ctInstallOverlay'))return;
 const last=Number(localStorage.getItem(DKEY)||0);
 if(last&&Date.now()-last<7*24*60*60*1000)return;
 const o=document.createElement('div');o.id='ctInstallOverlay';
 o.innerHTML=`<div class="ctInstallCard"><img class="ctInstallIcon" src="./icon.svg?v=48" alt="Ícone CasaToda"><h3>Instalar CasaToda</h3><p>Adicione o CasaToda à tela inicial para abrir como aplicativo e receber as próximas atualizações automaticamente.</p><div class="ctInstallActions"><button class="ctInstallPrimary" id="ctInstallNow">Instalar aplicativo</button><button class="ctInstallLater" id="ctInstallLater">Agora não</button></div><div class="ctInstallHint" id="ctInstallHint"></div></div>`;
 document.body.appendChild(o);
 document.getElementById('ctInstallLater').onclick=()=>{localStorage.setItem(DKEY,String(Date.now()));o.classList.remove('show')};
 document.getElementById('ctInstallNow').onclick=async()=>{
   const hint=document.getElementById('ctInstallHint');
   deferred=window.__CASATODA_INSTALL_PROMPT||deferred;
   if(deferred){
     try{deferred.prompt();const c=await deferred.userChoice;window.__CASATODA_INSTALL_PROMPT=null;deferred=null;if(c&&c.outcome==='accepted')o.classList.remove('show');return}catch(e){}
   }
   const isiOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
   hint.textContent=isiOS?'No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.':'No Chrome, toque no menu do navegador e escolha Instalar aplicativo ou Adicionar à tela inicial.';
   hint.classList.add('show');
 };
 setTimeout(()=>{if(!INSTALLED())o.classList.add('show')},900);
}
window.addEventListener('casatoda-install-ready',()=>{deferred=window.__CASATODA_INSTALL_PROMPT||deferred;makeInstallUI()});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;window.__CASATODA_INSTALL_PROMPT=e;makeInstallUI()});
window.addEventListener('appinstalled',()=>{localStorage.removeItem(DKEY);document.getElementById('ctInstallOverlay')?.classList.remove('show')});
function toastUpdated(){
 if(sessionStorage.getItem('casatoda_just_updated')!=='1')return;
 sessionStorage.removeItem('casatoda_just_updated');
 let t=document.getElementById('ctUpdateToast');if(!t){t=document.createElement('div');t.id='ctUpdateToast';t.textContent='CasaToda atualizado automaticamente';document.body.appendChild(t)}
 setTimeout(()=>t.classList.add('show'),400);setTimeout(()=>t.classList.remove('show'),3200)
}
function num(v){const n=Number(String(v||'').replace(/[^0-9.]/g,''));return Number.isFinite(n)?n:0}
async function fetchVersion(url){
 const r=await fetch(url+(url.includes('?')?'&':'?')+'t='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
 if(!r.ok)throw new Error('version '+r.status);
 const j=await r.json();return String(j.version||'')
}
async function newestVersion(){
 let local='',raw='';
 try{local=await fetchVersion('./version.json')}catch(e){}
 try{raw=await fetchVersion('https://raw.githubusercontent.com/EduMarttiins/casa-em-dia/main/version.json')}catch(e){}
 if(num(raw)>num(local))return raw;
 return local||raw
}
async function clearAppCaches(){
 try{if(!('caches' in window))return;const keys=await caches.keys();await Promise.all(keys.filter(k=>/^casatoda-/i.test(k)).map(k=>caches.delete(k)))}catch(e){}
}
async function forceReload(v){
 if(reloading)return;
 reloading=true;
 localStorage.setItem(VKEY,String(v));
 sessionStorage.setItem('casatoda_just_updated','1');
 try{const reg=await navigator.serviceWorker?.getRegistration();if(reg){await reg.update().catch(()=>{});if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}}catch(e){}
 await clearAppCaches();
 const u=new URL(location.href);u.searchParams.set('v',String(v));u.searchParams.set('fresh',String(Date.now()));location.replace(u.href)
}
async function checkUpdate(){
 if(reloading||checking)return;
 checking=true;
 try{
   const remote=await newestVersion();if(!remote)return;
   const loaded=String(window.__CASATODA_LOADED_VERSION||'');
   const stored=String(localStorage.getItem(VKEY)||'');
   if(loaded&&num(remote)>num(loaded)){await forceReload(remote);return}
   if(stored&&num(remote)>num(stored)){await forceReload(remote);return}
   localStorage.setItem(VKEY,remote)
 }catch(e){}finally{checking=false}
}
async function updateWorker(){
 try{const reg=await navigator.serviceWorker?.getRegistration();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}}catch(e){}
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});setInterval(()=>reg.update().catch(()=>{}),15000)}).catch(()=>{});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;sessionStorage.setItem('casatoda_just_updated','1');location.reload()})
}
window.addEventListener('focus',()=>{updateWorker();checkUpdate()});
window.addEventListener('online',()=>{updateWorker();checkUpdate()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){updateWorker();checkUpdate()}});
setInterval(()=>{if(!document.hidden)checkUpdate()},15000);
setTimeout(()=>{makeInstallUI();updateWorker();checkUpdate();toastUpdated()},700);
setTimeout(checkUpdate,3000);
})();
