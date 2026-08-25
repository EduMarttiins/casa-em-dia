(()=>{
'use strict';
if(window.__CASATODA_54__)return;
window.__CASATODA_54__=true;

const SHARED_KEY='casatoda_shared_device_43';

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}

function leaveSharedProfile(){
  const b=bridge();
  try{localStorage.removeItem(SHARED_KEY)}catch(e){}

  /* O APK antigo não possui um estado "sem perfil". Bernardo é usado apenas
     como perfil neutro para impedir que maybeRestoreSibling reabra Irmãos.
     Ao escolher Bernardo ou Júlia no gate, o perfil nativo é sincronizado
     normalmente pelo fluxo existente. */
  try{
    if(b&&typeof b.setDeviceProfile==='function')b.setDeviceProfile('bernardo');
  }catch(e){}

  document.getElementById('ctSiblingHome43')?.remove();
  try{
    if(typeof renderProfileGate==='function')renderProfileGate();
    else location.reload();
  }catch(e){location.reload()}

  setTimeout(()=>{
    if(document.getElementById('ctSiblingHome43')){
      try{localStorage.removeItem(SHARED_KEY)}catch(e){}
      document.getElementById('ctSiblingHome43')?.remove();
      try{if(typeof renderProfileGate==='function')renderProfileGate()}catch(e){}
    }
  },250);
}

function patchExit(){
  const btn=document.getElementById('ctSiblingExit43');
  if(!btn||btn.dataset.v54==='1')return;
  btn.dataset.v54='1';
  btn.textContent='Trocar para Bernardo ou Júlia';
  btn.onclick=null;
  btn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    leaveSharedProfile();
  },true);
}

const observer=new MutationObserver(()=>patchExit());
observer.observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('click',e=>{
  const target=e.target instanceof Element?e.target.closest('#ctSiblingExit43'):null;
  if(!target)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  leaveSharedProfile();
},true);

setTimeout(patchExit,0);
setTimeout(patchExit,300);
setTimeout(patchExit,1000);
})();
