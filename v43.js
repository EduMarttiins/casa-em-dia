(()=>{
'use strict';
if(window.__CASATODA_43__)return;
window.__CASATODA_43__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
const SHARED_KEY='casatoda_shared_device_43';

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function childName(id){if(id==='irmaos')return 'Irmãos';try{return state.children?.find(c=>c.id===id)?.name||id}catch(e){return id}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function minToTime(v){v=Math.max(0,Math.min(1439,Number(v)||0));return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0')}
function timeToMin(v){const m=String(v||'').match(/^(\d{1,2}):(\d{2})$/);if(!m)return null;const h=Number(m[1]),mm=Number(m[2]);if(h>23||mm>59)return null;return h*60+mm}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`}

async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});
 if(!r.ok)throw new Error('HTTP '+r.status);
 return await r.json();
}
async function getRuntime(id){
 const rows=await rpc('casatoda_get_device_control',{p_code:familyCode(),p_child_id:id});
 return Array.isArray(rows)&&rows[0]?rows[0]:{block_minutes:1320,wake_minutes:360,command:{}};
}
async function setSchedule(id,block,wake){
 const ok=await rpc('casatoda_set_device_schedule',{p_code:familyCode(),p_child_id:id,p_block_minutes:block,p_wake_minutes:wake});
 if(ok!==true)throw new Error('Falha ao salvar horários');
}
async function sendCommand(id,command){
 const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:command});
 if(ok!==true)throw new Error('Falha ao enviar comando');
}

function cleanupOld(){
 ['ctProtectionTest38','ctProtectionTest40','ctProtectionTest41','ctProtectionTest41Child','ctDeviceControl42'].forEach(id=>document.getElementById(id)?.remove());
 document.getElementById('ctDeviceControl42Modal')?.remove();
}

function ensureGlobalStyle(){
 if(document.getElementById('ctV43Style'))return;
 const s=document.createElement('style');s.id='ctV43Style';
 s.textContent=`
 #ctProtectionTest38,#ctProtectionTest40,#ctProtectionTest41,#ctProtectionTest41Child,#ctDeviceControl42{display:none!important}
 #ctDeviceControl43{position:fixed;right:16px;bottom:104px;z-index:9992;height:50px;border:0;border-radius:999px;padding:0 17px;background:#241b52;color:#fff;display:flex;align-items:center;gap:8px;font:900 12px system-ui;box-shadow:0 12px 28px rgba(36,27,82,.30)}
 #ctDeviceControl43Modal .ct43-device-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}
 #ctDeviceControl43Modal .ct43-device-tab{height:44px;border:1px solid #e6e1ef;border-radius:13px;background:#f7f5fb;color:#564f64;font-weight:900;font-size:12px}
 #ctDeviceControl43Modal .ct43-device-tab.on{background:#241b52;color:#fff;border-color:#241b52}
 #authGate .ct-siblings43{background:linear-gradient(135deg,#f5f2ff,#eae4ff)!important;border:2px solid #d9cff7!important}
 #authGate .ct-siblings43 .ct-sib-icon{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;background:#6d43df;color:#fff;font-size:34px;font-weight:900;box-shadow:0 8px 22px rgba(80,52,165,.22)}
 #ctSiblingHome43{position:fixed;inset:0;z-index:99990;background:linear-gradient(180deg,#f7f5fc,#eee9f8);font-family:system-ui;color:#241f35;overflow:auto;padding:env(safe-area-inset-top) 18px calc(28px + env(safe-area-inset-bottom));box-sizing:border-box}
 #ctSiblingHome43 .ct43-shell{width:min(520px,100%);margin:0 auto;padding-top:26px}
 #ctSiblingHome43 .ct43-hero{background:#fff;border-radius:28px;padding:24px;box-shadow:0 18px 50px rgba(35,27,77,.12)}
 #ctSiblingHome43 .ct43-badge{width:70px;height:70px;border-radius:22px;background:#6d43df;color:#fff;display:grid;place-items:center;font-size:30px;margin-bottom:16px}
 @media(max-width:420px){#ctDeviceControl43{right:12px;bottom:96px;height:46px;padding:0 14px}#ctDeviceControl43Modal .ct43-device-tabs{gap:6px}#ctDeviceControl43Modal .ct43-device-tab{font-size:11px}}
 `;
 document.head.appendChild(s);
}

function toast(msg){
 let t=document.getElementById('ctToast43');if(t)t.remove();
 t=document.createElement('div');t.id='ctToast43';t.textContent=msg;
 t.style.cssText='position:fixed;left:50%;bottom:104px;transform:translateX(-50%);z-index:100005;background:#211b45;color:#fff;padding:12px 16px;border-radius:999px;font:800 12px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.22);max-width:90%;text-align:center';
 document.body.appendChild(t);setTimeout(()=>t.remove(),2800);
}
function closeParentModal(){document.getElementById('ctDeviceControl43Modal')?.remove()}
function parentModalShell(){
 closeParentModal();
 const wrap=document.createElement('div');wrap.id='ctDeviceControl43Modal';wrap.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.66);display:grid;place-items:center;padding:18px;overflow:auto';
 const card=document.createElement('div');card.style.cssText='width:min(500px,100%);background:#fff;border-radius:26px;padding:22px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.30);box-sizing:border-box';
 wrap.appendChild(card);wrap.addEventListener('click',e=>{if(e.target===wrap)closeParentModal()});document.body.appendChild(wrap);return card;
}
function makeBtn(text,primary=false){const b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText=`height:48px;border:0;border-radius:14px;background:${primary?'#5b35c9':'#f0edf5'};color:${primary?'#fff':'#302b42'};font-weight:900;padding:0 14px`;return b}

async function openParentControl(initialId){
 if(!familyCode()){toast('Conecte este aparelho à família primeiro.');return}
 let active=['bernardo','julia','irmaos'].includes(initialId)?initialId:'bernardo';
 const card=parentModalShell();
 card.innerHTML=`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px"><div><div style="font-size:10px;letter-spacing:.12em;color:#7b7296;font-weight:900">CONTROLE DOS APARELHOS</div><h2 style="margin:5px 0 3px;font-size:24px">Bloqueio e liberação</h2><p style="margin:0;color:#777185;font-size:13px">Bernardo e Júlia mantêm suas rotinas. Irmãos controla apenas o tablet compartilhado.</p></div><button id="ctClose43" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f1eef6;font-size:20px">×</button></div><div class="ct43-device-tabs" id="ctTabs43"></div><div id="ctBody43" style="margin-top:16px"></div>`;
 card.querySelector('#ctClose43').onclick=closeParentModal;
 const tabs=card.querySelector('#ctTabs43');
 for(const id of ['bernardo','julia','irmaos']){
  const b=document.createElement('button');b.type='button';b.className='ct43-device-tab';b.dataset.id=id;b.textContent=childName(id);b.onclick=()=>{active=id;renderDevice()};tabs.appendChild(b);
 }
 async function renderDevice(){
  tabs.querySelectorAll('.ct43-device-tab').forEach(b=>b.classList.toggle('on',b.dataset.id===active));
  const body=card.querySelector('#ctBody43');body.innerHTML='<div style="padding:18px;border-radius:18px;background:#f6f4fb;text-align:center;color:#777185;font-weight:800">Carregando configurações...</div>';
  let runtime;try{runtime=await getRuntime(active)}catch(e){body.innerHTML='<div style="padding:18px;border-radius:18px;background:#fff3f3;color:#8c4555">Não foi possível carregar. Confira a internet.</div>';return}
  const isShared=active==='irmaos';
  const block=isShared?Number(runtime.block_minutes??1320):Number(state?.settings?.cutoffMinutes?.[active]??runtime.block_minutes??1320);
  const wake=Number(runtime.wake_minutes??360);
  body.innerHTML=`<div style="padding:16px;border-radius:18px;background:${isShared?'#f3efff':'#f7f6fa'};margin-bottom:14px"><b style="font-size:15px">${childName(active)}</b><div style="font-size:12px;color:#756e81;margin-top:4px">${isShared?'Somente controle de tela. Sem estrelas, tarefas ou recompensas.':'Horário base. Punições e bônus do dia continuam ajustando o bloqueio final.'}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><label style="display:grid;gap:7px;font-size:11px;color:#696276;font-weight:900">BLOQUEAR ÀS<input id="ctBlock43" type="time" value="${minToTime(block)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label><label style="display:grid;gap:7px;font-size:11px;color:#696276;font-weight:900">LIBERAR ÀS<input id="ctWake43" type="time" value="${minToTime(wake)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label></div><button id="ctSave43" type="button" style="width:100%;height:48px;margin-top:12px;border:0;border-radius:14px;background:#5b35c9;color:#fff;font-weight:900">Salvar horários</button><div style="height:1px;background:#eeeaf4;margin:20px 0"></div><b style="font-size:15px">Desbloqueio de emergência</b><p style="margin:4px 0 12px;color:#777185;font-size:12px;line-height:1.45">O comando é enviado remotamente. Ao terminar o período, a regra normal volta automaticamente.</p><div id="ctUnlock43" style="display:grid;grid-template-columns:1fr 1fr;gap:9px"></div><button id="ctResume43" type="button" style="width:100%;height:46px;margin-top:10px;border:1px solid #e1dce9;border-radius:14px;background:#fff;color:#5c5569;font-weight:900">Cancelar liberação e reaplicar regra</button>`;
  body.querySelector('#ctSave43').onclick=async()=>{
   const sb=body.querySelector('#ctSave43'),bm=timeToMin(body.querySelector('#ctBlock43').value),wm=timeToMin(body.querySelector('#ctWake43').value);
   if(bm==null||wm==null){toast('Confira os horários informados.');return}
   try{
    sb.disabled=true;sb.textContent='Salvando...';
    if(!isShared){state.settings=state.settings||{};state.settings.cutoffMinutes=state.settings.cutoffMinutes||{};state.settings.cutoffMinutes[active]=bm;if(typeof save==='function')save();}
    await setSchedule(active,bm,wm);
    if(!isShared&&typeof render==='function')render();
    toast(`Horários de ${childName(active)} atualizados.`);sb.textContent='Salvo ✓';setTimeout(()=>{sb.textContent='Salvar horários';sb.disabled=false},900);
   }catch(e){sb.disabled=false;sb.textContent='Salvar horários';toast('Não foi possível salvar os horários.');}
  };
  const grid=body.querySelector('#ctUnlock43');
  for(const [label,val] of [['15 minutos',15],['30 minutos',30],['1 hora',60],['Até a manhã','morning']]){
   const ub=makeBtn(label,val==='morning');ub.onclick=async()=>{try{let until;if(val==='morning'){const wm=timeToMin(body.querySelector('#ctWake43').value);if(wm==null)throw new Error('hora');const now=new Date(),target=new Date(now);target.setHours(Math.floor(wm/60),wm%60,0,0);if(target<=now)target.setDate(target.getDate()+1);until=target.getTime()}else until=Date.now()+Number(val)*60000;ub.disabled=true;ub.textContent='Enviando...';await sendCommand(active,{action:'unlock',untilMs:until,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(active)} liberado.`);ub.textContent=label;ub.disabled=false}catch(e){ub.textContent=label;ub.disabled=false;toast('Não foi possível enviar o desbloqueio.')}};grid.appendChild(ub);
  }
  body.querySelector('#ctResume43').onclick=async()=>{const rb=body.querySelector('#ctResume43');try{rb.disabled=true;rb.textContent='Enviando...';await sendCommand(active,{action:'resume',nonce:nonce(),requestedAt:Date.now()});toast('Regra normal reaplicada.');rb.textContent='Cancelar liberação e reaplicar regra';rb.disabled=false}catch(e){rb.disabled=false;rb.textContent='Cancelar liberação e reaplicar regra';toast('Não foi possível enviar o comando.')}};
 }
 renderDevice();
}

function ensureParentButton(){
 let b=document.getElementById('ctDeviceControl43');
 if(!isParent()||bridge()){b?.remove();return}
 if(b)return;
 b=document.createElement('button');b.id='ctDeviceControl43';b.type='button';b.innerHTML='<span style="font-size:16px">📱</span><span>Controle dos aparelhos</span>';
 b.onclick=()=>{let id='bernardo';try{if(['bernardo','julia'].includes(String(selected)))id=String(selected)}catch(e){}openParentControl(id)};
 document.body.appendChild(b);
}

function syncNativeCode(){
 const b=bridge();if(!b)return;
 try{
  let code=familyCode();
  if(!code&&typeof b.getFamilyCode==='function'){code=String(b.getFamilyCode()||'').trim().toUpperCase();if(code)localStorage.setItem(CODE_KEY,code)}
  if(code&&typeof b.setFamilyCode==='function')b.setFamilyCode(code);
 }catch(e){}
}
function ensureSiblingCard(){
 const b=bridge();if(!b)return;
 const grid=document.querySelector('#authGate .auth-children-grid');if(!grid)return;
 if(document.querySelector('#authGate .ct-siblings43'))return;
 const btn=document.createElement('button');btn.type='button';btn.className='profile-choice child ct-siblings43';
 btn.innerHTML='<span class="ct-sib-icon">👫</span><span style="display:grid;gap:4px;text-align:left"><strong>Irmãos</strong><span>Tablet compartilhado</span></span>';
 btn.onclick=async()=>{
  syncNativeCode();
  if(!familyCode()){alert('Conecte este tablet à família antes de escolher Irmãos.');return}
  if(typeof b.setDeviceProfile!=='function'){alert('Atualize o APK CasaToda Filhos para usar o perfil Irmãos.');return}
  try{b.setDeviceProfile('irmaos');localStorage.setItem(SHARED_KEY,'irmaos');showSiblingHome();}catch(e){alert('Não foi possível configurar este tablet agora.');}
 };
 grid.appendChild(btn);
 const title=document.querySelector('#authGate .auth-children-title b');const hint=document.querySelector('#authGate .auth-children-title span');if(title)title.textContent='Escolha o perfil deste aparelho';if(hint)hint.textContent='Bernardo, Júlia ou tablet dos irmãos';
}

async function refreshSiblingHome(){
 const box=document.getElementById('ctSiblingSchedule43');if(!box||!familyCode())return;
 try{const r=await getRuntime('irmaos');box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px"><span>Bloqueia</span><b>${minToTime(r.block_minutes??1320)}</b></div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:10px"><span>Libera</span><b>${minToTime(r.wake_minutes??360)}</b></div><div style="margin-top:13px;font-size:11px;color:#7b7487">Controle definido pelo perfil dos Pais</div>`}catch(e){box.innerHTML='<div style="color:#8b6570">Sem conexão. O último horário salvo no aparelho continua valendo.</div>'}
}
function showSiblingHome(){
 const b=bridge();if(!b)return;
 syncNativeCode();
 if(typeof b.setDeviceProfile==='function')try{b.setDeviceProfile('irmaos')}catch(e){}
 let home=document.getElementById('ctSiblingHome43');if(home){refreshSiblingHome();return}
 home=document.createElement('section');home.id='ctSiblingHome43';home.innerHTML=`<div class="ct43-shell"><div style="font-size:11px;letter-spacing:.14em;font-weight:900;color:#776e90;margin-bottom:14px">CASATODA</div><div class="ct43-hero"><div class="ct43-badge">👫</div><h1 style="margin:0;font-size:28px">Tablet dos irmãos</h1><p style="margin:8px 0 0;color:#736d80;line-height:1.5">Este aparelho possui somente controle de horário. Não há estrelas, tarefas, cofrinho ou recompensas neste perfil.</p><div id="ctSiblingSchedule43" style="margin-top:20px;padding:17px;border-radius:18px;background:#f5f2fb;color:#4f485d">Carregando horários...</div><div style="margin-top:14px;padding:13px;border-radius:16px;background:#eef8f1;color:#356247;font-size:12px;font-weight:800">🛡 CasaToda Proteção ativo quando a Acessibilidade estiver habilitada.</div><button id="ctSiblingRefresh43" type="button" style="width:100%;height:48px;margin-top:16px;border:0;border-radius:14px;background:#241b52;color:#fff;font-weight:900">Sincronizar agora</button><button id="ctSiblingExit43" type="button" style="width:100%;height:44px;margin-top:9px;border:0;border-radius:14px;background:#f0edf5;color:#625a70;font-weight:800">Trocar perfil deste tablet</button></div></div>`;
 document.body.appendChild(home);
 home.querySelector('#ctSiblingRefresh43').onclick=refreshSiblingHome;
 home.querySelector('#ctSiblingExit43').onclick=()=>{localStorage.removeItem(SHARED_KEY);home.remove();try{if(typeof renderProfileGate==='function')renderProfileGate()}catch(e){}setTimeout(ensureSiblingCard,100)};
 refreshSiblingHome();
}
function maybeRestoreSibling(){
 const b=bridge();if(!b)return;
 syncNativeCode();
 let native='';try{if(typeof b.getDeviceProfile==='function')native=String(b.getDeviceProfile()||'').toLowerCase()}catch(e){}
 const local=(localStorage.getItem(SHARED_KEY)||'').toLowerCase();
 if(native==='irmaos'||local==='irmaos'){localStorage.setItem(SHARED_KEY,'irmaos');showSiblingHome();}
}

function tune(){
 ensureGlobalStyle();cleanupOld();
 if(bridge()){syncNativeCode();ensureSiblingCard();maybeRestoreSibling();document.getElementById('ctDeviceControl43')?.remove();}
 else ensureParentButton();
}

const oldRender=typeof render==='function'?render:null;if(oldRender){render=function(){const x=oldRender();setTimeout(tune,100);return x}}
const oldGate=typeof renderProfileGate==='function'?renderProfileGate:null;if(oldGate){renderProfileGate=function(){const x=oldGate();setTimeout(()=>{ensureSiblingCard();maybeRestoreSibling()},100);return x}}
const oldEnter=typeof enterSession==='function'?enterSession:null;if(oldEnter){enterSession=function(role){const x=oldEnter(role);setTimeout(tune,120);return x}}
window.addEventListener('focus',()=>setTimeout(tune,100));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tune,100)});
setInterval(()=>{cleanupOld();if(bridge()){syncNativeCode();if(!document.getElementById('ctSiblingHome43'))ensureSiblingCard()}else ensureParentButton()},2500);
setInterval(()=>{if(document.getElementById('ctSiblingHome43'))refreshSiblingHome()},10000);
setTimeout(tune,500);setTimeout(tune,1300);
})();
