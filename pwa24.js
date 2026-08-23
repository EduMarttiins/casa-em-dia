(()=>{
'use strict';
if(window.__CASATODA_PWA24__)return;
window.__CASATODA_PWA24__=true;
const VKEY='casatoda_current_version';
const DKEY='casatoda_install_dismissed';
const INSTALLED=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
let deferred=window.__CASATODA_INSTALL_PROMPT||null;
let reloading=false;
function makeInstallUI(){
 if(INSTALLED()||document.getElementById('ctInstallOverlay'))return;
 const last=Number(localStorage.getItem(DKEY)||0);
 if(last&&Date.now()-last<7*24*60*60*1000)return;
 const o=document.createElement('div');o.id='ctInstallOverlay';
 o.innerHTML=`<div class="ctInstallCard"><img class="ctInstallIcon" src="./icon.svg?v=24" alt="Ícone CasaToda"><h3>Instalar CasaToda</h3><p>Adicione o CasaToda à tela inicial para abrir como aplicativo e receber as próximas atualizações automaticamente.</p><div class="ctInstallActions"><button class="ctInstallPrimary" id="ctInstallNow">Instalar aplicativo</button><button class="ctInstallLater" id="ctInstallLater">Agora não</button></div><div class="ctInstallHint" id="ctInstallHint"></div></div>`;
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
async function newestVersion(){
 const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('version');const j=await r.json();return String(j.version||'')
}
async function checkUpdate(){
 if(reloading)return;
 try{
   const v=await newestVersion();if(!v)return;
   const old=localStorage.getItem(VKEY);
   if(!old){localStorage.setItem(VKEY,v);return}
   if(old!==v){
     reloading=true;localStorage.setItem(VKEY,v);sessionStorage.setItem('casatoda_just_updated','1');
     try{const reg=await navigator.serviceWorker?.getRegistration();if(reg)await reg.update()}catch(e){}
     const u=new URL(location.href);u.searchParams.set('v',v);u.searchParams.set('u',Date.now());location.replace(u.href)
   }
 }catch(e){}
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});setInterval(()=>reg.update().catch(()=>{}),60000)}).catch(()=>{});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;sessionStorage.setItem('casatoda_just_updated','1');location.reload()})
}
window.addEventListener('focus',checkUpdate);
window.addEventListener('online',checkUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});
setInterval(()=>{if(!document.hidden)checkUpdate()},60000);
setTimeout(()=>{makeInstallUI();checkUpdate();toastUpdated()},1200);
})();
