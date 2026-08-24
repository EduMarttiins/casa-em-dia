(()=>{
'use strict';
if(window.__CASATODA_40__)return;
window.__CASATODA_40__=true;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function removeOld(){document.getElementById('ctProtectionTest38')?.remove()}
function removeBtn(){document.getElementById('ctProtectionTest40')?.remove()}
function closeModal(){document.getElementById('ctProtectionModal40')?.remove()}

function showMessage(title,text){
 closeModal();
 const wrap=document.createElement('div');wrap.id='ctProtectionModal40';wrap.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.64);display:grid;place-items:center;padding:22px';
 const card=document.createElement('div');card.style.cssText='width:min(430px,100%);background:#fff;border-radius:24px;padding:24px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.28)';
 card.innerHTML=`<div style="width:48px;height:48px;border-radius:15px;background:#efe9ff;color:#6f43df;display:grid;place-items:center;font-size:24px;font-weight:900;margin-bottom:14px">✓</div><h2 style="margin:0 0 8px;font-size:22px">${title}</h2><p style="margin:0;color:#6f697c;line-height:1.5">${text}</p><button id="ctClose40" type="button" style="width:100%;height:48px;margin-top:20px;border:0;border-radius:14px;background:#241b52;color:#fff;font-weight:900">Entendi</button>`;
 wrap.appendChild(card);document.body.appendChild(wrap);document.getElementById('ctClose40')?.addEventListener('click',closeModal)
}

function startTest(){
 const b=bridge();
 if(!b||typeof b.startProtectionTest!=='function'){
  showMessage('APK precisa ser atualizado','Este aparelho ainda está usando uma versão antiga do APK. Instale a versão mais recente do CasaToda Filhos para habilitar o teste de bloqueio por 30 segundos.');
  return;
 }
 closeModal();
 const wrap=document.createElement('div');wrap.id='ctProtectionModal40';wrap.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.64);display:grid;place-items:center;padding:22px';
 const card=document.createElement('div');card.style.cssText='width:min(430px,100%);background:#fff;border-radius:24px;padding:24px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.28)';
 card.innerHTML='<div style="width:48px;height:48px;border-radius:15px;background:#fff1dc;color:#de7a20;display:grid;place-items:center;font-size:22px;font-weight:900;margin-bottom:14px">30</div><h2 style="margin:0 0 8px;font-size:22px">Testar bloqueio</h2><p style="margin:0;color:#6f697c;line-height:1.5">O bloqueio ficará ativo por apenas 30 segundos e será liberado sozinho. O horário normal de 22:00 não será alterado.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px"><button id="ctCancelTest40" type="button" style="height:48px;border:0;border-radius:14px;background:#f1eef6;font-weight:900">Cancelar</button><button id="ctStartTest40" type="button" style="height:48px;border:0;border-radius:14px;background:#de7a20;color:#fff;font-weight:900">Iniciar 30 s</button></div>';
 wrap.appendChild(card);document.body.appendChild(wrap);
 document.getElementById('ctCancelTest40')?.addEventListener('click',closeModal);
 document.getElementById('ctStartTest40')?.addEventListener('click',()=>{
  try{
   b.startProtectionTest(30);
   showMessage('Teste iniciado','Agora saia do CasaToda e abra YouTube, Chrome ou outro aplicativo. A tela de proteção deve aparecer e desaparecer sozinha em até 30 segundos.');
  }catch(e){showMessage('Não foi possível iniciar','Feche o CasaToda, abra novamente e tente outra vez. Se continuar, será necessário atualizar o APK.')}
 });
}

function ensureBtn(){
 removeOld();
 const b=bridge();
 if(!b||!isChild()){removeBtn();return}
 if(document.getElementById('ctProtectionTest40'))return;
 const btn=document.createElement('button');
 btn.id='ctProtectionTest40';btn.type='button';btn.innerHTML='<span style="font-size:16px">🛡️</span><span>Testar bloqueio 30 s</span>';
 btn.style.cssText='position:fixed;right:16px;bottom:104px;z-index:9991;height:48px;border:0;border-radius:999px;padding:0 16px;background:#241b52;color:#fff;display:flex;align-items:center;gap:8px;font:900 12px system-ui;box-shadow:0 12px 28px rgba(36,27,82,.30)';
 btn.addEventListener('click',startTest);
 document.body.appendChild(btn)
}

const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();setTimeout(ensureBtn,100);return x}}
const oldEnter=typeof enterSession==='function'?enterSession:null;
if(oldEnter){enterSession=function(role){const x=oldEnter(role);setTimeout(ensureBtn,150);return x}}
window.addEventListener('focus',()=>setTimeout(ensureBtn,100));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ensureBtn,100)});
setInterval(ensureBtn,2500);
setTimeout(ensureBtn,700);
})();
