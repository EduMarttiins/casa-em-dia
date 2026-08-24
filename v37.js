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

const FAMILY_KEY='casatoda_family_code';
function closeConnect(){document.getElementById('ctFamilyConnect37')?.remove()}
function openConnect(){
 closeConnect();
 const wrap=document.createElement('div');wrap.id='ctFamilyConnect37';wrap.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,12,30,.58);display:grid;place-items:center;padding:22px';
 const card=document.createElement('div');card.style.cssText='width:min(420px,100%);background:#fff;border-radius:24px;padding:24px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.25)';
 card.innerHTML='<h2 style="margin:0 0 8px">Conectar à família</h2><p style="margin:0 0 16px;color:#6f697c">Digite o código da família CasaToda usado nos outros aparelhos.</p><input id="ctFamilyCode37" type="text" placeholder="Código da família" style="width:100%;height:50px;border:2px solid #e7e2ef;border-radius:14px;padding:0 12px;font-size:17px;text-transform:uppercase;box-sizing:border-box"><div id="ctFamilyErr37" style="min-height:20px;padding-top:6px;color:#c83c52;font-size:12px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px"><button id="ctFamilyCancel37" type="button" style="height:46px;border:0;border-radius:13px;background:#f0edf5;font-weight:800">Cancelar</button><button id="ctFamilyOk37" type="button" style="height:46px;border:0;border-radius:13px;background:#6f43df;color:#fff;font-weight:800">Conectar</button></div>';
 wrap.appendChild(card);document.body.appendChild(wrap);
 const input=document.getElementById('ctFamilyCode37'),err=document.getElementById('ctFamilyErr37'),ok=document.getElementById('ctFamilyOk37');
 const saveCode=()=>{const code=String(input?.value||'').trim().toUpperCase();if(!code){err.textContent='Digite o código da família.';return}try{localStorage.setItem(FAMILY_KEY,code);const b=bridge();if(b&&typeof b.setFamilyCode==='function')b.setFamilyCode(code);ok.textContent='Conectando...';setTimeout(()=>location.reload(),180)}catch(e){err.textContent='Não foi possível salvar o código.'}};
 document.getElementById('ctFamilyCancel37')?.addEventListener('click',closeConnect);ok?.addEventListener('click',saveCode);input?.addEventListener('keydown',e=>{if(e.key==='Enter')saveCode()});setTimeout(()=>input?.focus(),60)
}
document.addEventListener('click',e=>{const btn=e.target.closest?.('.ctSyncConnect');if(!btn)return;e.preventDefault();e.stopPropagation();openConnect()},true);
window.CasaTodaConnectFamily=openConnect;
})();
