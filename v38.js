(()=>{
'use strict';
if(window.__CASATODA_38__)return;
window.__CASATODA_38__=true;
const KEY='casatoda_family_code';
function closeBox(){document.getElementById('ctConnect38')?.remove()}
function openBox(){
 closeBox();
 const box=document.createElement('div');box.id='ctConnect38';box.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,12,30,.58);display:grid;place-items:center;padding:22px';
 const card=document.createElement('div');card.style.cssText='width:min(420px,100%);background:#fff;border-radius:24px;padding:24px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.25)';
 card.innerHTML='<h2 style="margin:0 0 8px">Conectar à família</h2><p style="margin:0 0 16px;color:#6f697c">Digite o código da família CasaToda usado nos outros aparelhos.</p><input id="ctCode38" type="text" placeholder="Código da família" style="width:100%;height:50px;border:2px solid #e7e2ef;border-radius:14px;padding:0 12px;font-size:17px;text-transform:uppercase;box-sizing:border-box"><div id="ctErr38" style="min-height:20px;padding-top:6px;color:#c83c52;font-size:12px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px"><button id="ctCancel38" type="button" style="height:46px;border:0;border-radius:13px;background:#f0edf5;font-weight:800">Cancelar</button><button id="ctOk38" type="button" style="height:46px;border:0;border-radius:13px;background:#6f43df;color:#fff;font-weight:800">Conectar</button></div>';
 box.appendChild(card);document.body.appendChild(box);
 const input=document.getElementById('ctCode38'),err=document.getElementById('ctErr38'),ok=document.getElementById('ctOk38');
 const saveCode=()=>{const code=String(input?.value||'').trim().toUpperCase();if(!code){err.textContent='Digite o código da família.';return}try{localStorage.setItem(KEY,code);if(window.CasaTodaAndroid?.setFamilyCode)window.CasaTodaAndroid.setFamilyCode(code);ok.textContent='Conectando...';setTimeout(()=>location.reload(),150)}catch(e){err.textContent='Não foi possível salvar o código.'}};
 document.getElementById('ctCancel38')?.addEventListener('click',closeBox);ok?.addEventListener('click',saveCode);input?.addEventListener('keydown',e=>{if(e.key==='Enter')saveCode()});setTimeout(()=>input?.focus(),50)
}
document.addEventListener('click',e=>{const b=e.target.closest?.('.ctSyncConnect');if(!b)return;e.preventDefault();e.stopPropagation();openBox()},true);
window.CasaTodaConnectFamily=openBox;
})();
