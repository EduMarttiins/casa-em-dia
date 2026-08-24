(()=>{
'use strict';
if(window.__CASATODA_44__)return;
window.__CASATODA_44__=true;

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
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});
 if(!r.ok)throw new Error('HTTP '+r.status);
 return await r.json();
}
async function getRuntime(id){const rows=await rpc('casatoda_get_device_control',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{block_minutes:1320,wake_minutes:360,command:{}}}
async function setSchedule(id,block,wake){const ok=await rpc('casatoda_set_device_schedule',{p_code:familyCode(),p_child_id:id,p_block_minutes:block,p_wake_minutes:wake});if(ok!==true)throw new Error('save')}
async function sendCommand(id,command){const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:command});if(ok!==true)throw new Error('command')}

function ensureStyle(){
 if(document.getElementById('ctV44Style'))return;
 const s=document.createElement('style');s.id='ctV44Style';s.textContent=`
 #ctDeviceControl43,#ctDeviceControl43Modal{display:none!important}
 #ctDeviceControl44{position:fixed;right:16px;bottom:104px;z-index:9994;height:50px;border:0;border-radius:999px;padding:0 17px;background:#241b52;color:#fff;display:flex;align-items:center;gap:8px;font:900 12px system-ui;box-shadow:0 12px 28px rgba(36,27,82,.30)}
 #ctDeviceControl44Modal .ct44-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}
 #ctDeviceControl44Modal .ct44-tab{height:44px;border:1px solid #e6e1ef;border-radius:13px;background:#f7f5fb;color:#564f64;font-weight:900;font-size:12px}
 #ctDeviceControl44Modal .ct44-tab.on{background:#241b52;color:#fff;border-color:#241b52}
 #ctSiblingHome43 .ct44-protection{margin-top:12px;padding:13px;border-radius:16px;font-size:12px;font-weight:850}
 @media(max-width:420px){#ctDeviceControl44{right:12px;bottom:96px;height:46px;padding:0 14px}.ct44-grid2{grid-template-columns:1fr!important}}
 `;document.head.appendChild(s)
}
function toast(msg){let t=document.getElementById('ctToast44');t?.remove();t=document.createElement('div');t.id='ctToast44';t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:108px;transform:translateX(-50%);z-index:100010;background:#211b45;color:#fff;padding:12px 16px;border-radius:999px;font:800 12px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.22);max-width:90%;text-align:center';document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}
function closeModal(){document.getElementById('ctDeviceControl44Modal')?.remove()}
function shell(){closeModal();const w=document.createElement('div');w.id='ctDeviceControl44Modal';w.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.66);display:grid;place-items:center;padding:18px;overflow:auto';const c=document.createElement('div');c.style.cssText='width:min(510px,100%);background:#fff;border-radius:26px;padding:22px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.30);box-sizing:border-box';w.appendChild(c);w.onclick=e=>{if(e.target===w)closeModal()};document.body.appendChild(w);return c}
function statusInfo(r){
 const seen=r?.last_seen_at?Date.parse(r.last_seen_at):0;const age=seen?Date.now()-seen:Infinity;const online=age<35000;const active=!!r?.protection_enabled;
 if(online&&active)return {label:'Online • Proteção ativa',bg:'#e9f8ef',fg:'#2b6a45',dot:'●'};
 if(online)return {label:'Online • Proteção desligada',bg:'#fff5df',fg:'#8b6218',dot:'●'};
 return {label:'Offline ou sem atualização recente',bg:'#f1eff5',fg:'#6c6579',dot:'○'};
}
function btn(text,kind='soft'){const b=document.createElement('button');b.type='button';b.textContent=text;const styles={soft:['#f0edf5','#302b42'],primary:['#5b35c9','#fff'],warn:['#fff0df','#9a5b18'],danger:['#fff0f1','#9c4351']};const [bg,fg]=styles[kind]||styles.soft;b.style.cssText=`height:48px;border:0;border-radius:14px;background:${bg};color:${fg};font-weight:900;padding:0 14px`;return b}

async function openControl(initialId){
 if(!familyCode()){toast('Conecte este aparelho à família primeiro.');return}
 let active=['bernardo','julia','irmaos'].includes(initialId)?initialId:'bernardo';
 const card=shell();
 card.innerHTML=`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px"><div><div style="font-size:10px;letter-spacing:.12em;color:#7b7296;font-weight:900">CENTRAL DOS APARELHOS</div><h2 style="margin:5px 0 3px;font-size:24px">Bloqueio, status e liberação</h2><p style="margin:0;color:#777185;font-size:13px;line-height:1.45">Veja o estado do aparelho e envie comandos sem alterar a rotina do dia.</p></div><button id="ctClose44" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f1eef6;font-size:20px">×</button></div><div class="ct44-tabs" id="ctTabs44"></div><div id="ctBody44" style="margin-top:16px"></div>`;
 card.querySelector('#ctClose44').onclick=closeModal;
 const tabs=card.querySelector('#ctTabs44');
 for(const id of ['bernardo','julia','irmaos']){const b=document.createElement('button');b.type='button';b.className='ct44-tab';b.dataset.id=id;b.textContent=childName(id);b.onclick=()=>{active=id;renderDevice()};tabs.appendChild(b)}
 async function renderDevice(){
  tabs.querySelectorAll('.ct44-tab').forEach(b=>b.classList.toggle('on',b.dataset.id===active));
  const body=card.querySelector('#ctBody44');body.innerHTML='<div style="padding:18px;border-radius:18px;background:#f6f4fb;text-align:center;color:#777185;font-weight:800">Atualizando aparelho...</div>';
  let r;try{r=await getRuntime(active)}catch(e){body.innerHTML='<div style="padding:18px;border-radius:18px;background:#fff3f3;color:#8c4555">Não foi possível carregar os dados agora.</div>';return}
  const isShared=active==='irmaos';const st=statusInfo(r);const block=isShared?Number(r.block_minutes??1320):Number(state?.settings?.cutoffMinutes?.[active]??r.block_minutes??1320);const wake=Number(r.wake_minutes??360);const apk=r.apk_version?` • APK ${esc(r.apk_version)}`:'';
  body.innerHTML=`<div style="padding:15px;border-radius:18px;background:${st.bg};color:${st.fg};margin-bottom:14px"><div style="font-weight:900;font-size:14px">${st.dot} ${st.label}</div><div style="font-size:11px;margin-top:4px;opacity:.82">${childName(active)}${apk}</div></div><div style="padding:15px;border-radius:18px;background:${isShared?'#f3efff':'#f7f6fa'};margin-bottom:14px"><b>${childName(active)}</b><div style="font-size:12px;color:#756e81;margin-top:4px">${isShared?'Tablet compartilhado com controle apenas de tela.':'Punições e bônus continuam ajustando o horário final do dia.'}</div></div><div class="ct44-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><label style="display:grid;gap:7px;font-size:11px;color:#696276;font-weight:900">BLOQUEAR ÀS<input id="ctBlock44" type="time" value="${minToTime(block)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label><label style="display:grid;gap:7px;font-size:11px;color:#696276;font-weight:900">LIBERAR ÀS<input id="ctWake44" type="time" value="${minToTime(wake)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label></div><button id="ctSave44" type="button" style="width:100%;height:48px;margin-top:12px;border:0;border-radius:14px;background:#5b35c9;color:#fff;font-weight:900">Salvar horários</button><div style="height:1px;background:#eeeaf4;margin:20px 0"></div><b style="font-size:15px">Ações rápidas</b><p style="margin:4px 0 12px;color:#777185;font-size:12px;line-height:1.45">O teste dura 30 segundos e se desfaz sozinho. O desbloqueio temporário também volta à regra normal automaticamente.</p><div id="ctActions44" class="ct44-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:9px"></div><button id="ctRefresh44" type="button" style="width:100%;height:44px;margin-top:10px;border:1px solid #e1dce9;border-radius:14px;background:#fff;color:#5c5569;font-weight:900">Atualizar status</button>`;
  body.querySelector('#ctSave44').onclick=async()=>{const sb=body.querySelector('#ctSave44'),bm=timeToMin(body.querySelector('#ctBlock44').value),wm=timeToMin(body.querySelector('#ctWake44').value);if(bm==null||wm==null){toast('Confira os horários informados.');return}try{sb.disabled=true;sb.textContent='Salvando...';if(!isShared){state.settings=state.settings||{};state.settings.cutoffMinutes=state.settings.cutoffMinutes||{};state.settings.cutoffMinutes[active]=bm;if(typeof save==='function')save()}await setSchedule(active,bm,wm);if(!isShared&&typeof render==='function')render();toast(`Horários de ${childName(active)} atualizados.`);setTimeout(renderDevice,350)}catch(e){sb.disabled=false;sb.textContent='Salvar horários';toast('Não foi possível salvar os horários.')}};
  const actions=body.querySelector('#ctActions44');
  const test=btn('Testar bloqueio 30 s','warn');test.onclick=async()=>{try{test.disabled=true;test.textContent='Enviando...';await sendCommand(active,{action:'test',seconds:30,nonce:nonce(),requestedAt:Date.now()});toast(`Teste enviado para ${childName(active)}.`);test.textContent='Teste enviado ✓';setTimeout(()=>{test.disabled=false;test.textContent='Testar bloqueio 30 s'},1200)}catch(e){test.disabled=false;test.textContent='Testar bloqueio 30 s';toast('Não foi possível enviar o teste.')}};actions.appendChild(test);
  for(const [label,min] of [['Liberar 15 min',15],['Liberar 30 min',30]]){const u=btn(label);u.onclick=async()=>{try{u.disabled=true;u.textContent='Enviando...';await sendCommand(active,{action:'unlock',untilMs:Date.now()+min*60000,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(active)} liberado por ${min} minutos.`);u.disabled=false;u.textContent=label}catch(e){u.disabled=false;u.textContent=label;toast('Não foi possível liberar o aparelho.')}};actions.appendChild(u)}
  const resume=btn('Reaplicar regra normal','danger');resume.onclick=async()=>{try{resume.disabled=true;resume.textContent='Enviando...';await sendCommand(active,{action:'resume',nonce:nonce(),requestedAt:Date.now()});toast('Regra normal reaplicada.');resume.disabled=false;resume.textContent='Reaplicar regra normal'}catch(e){resume.disabled=false;resume.textContent='Reaplicar regra normal';toast('Não foi possível enviar o comando.')}};actions.appendChild(resume);
  body.querySelector('#ctRefresh44').onclick=renderDevice;
 }
 renderDevice();
}

function ensureParentButton(){
 document.getElementById('ctDeviceControl43')?.remove();
 let b=document.getElementById('ctDeviceControl44');
 if(!isParent()||bridge()){b?.remove();return}
 if(b)return;b=document.createElement('button');b.id='ctDeviceControl44';b.type='button';b.innerHTML='<span style="font-size:16px">📱</span><span>Central dos aparelhos</span>';b.onclick=()=>{let id='bernardo';try{if(['bernardo','julia'].includes(String(selected)))id=String(selected)}catch(e){}openControl(id)};document.body.appendChild(b)
}

function patchSibling(){
 const b=bridge();if(!b)return;
 const card=document.querySelector('#authGate .ct-siblings43');
 if(card&&!card.dataset.v44){card.dataset.v44='1';card.onclick=()=>{let code=familyCode();try{if(!code&&typeof b.getFamilyCode==='function'){code=String(b.getFamilyCode()||'').trim().toUpperCase();if(code)localStorage.setItem(CODE_KEY,code)}if(code&&typeof b.setFamilyCode==='function')b.setFamilyCode(code)}catch(e){}if(!code){toast('Conecte este tablet à família antes de escolher Irmãos.');return}if(typeof b.setDeviceProfile!=='function'){toast('Atualize o APK CasaToda Filhos.');return}try{b.setDeviceProfile('irmaos');localStorage.setItem(SHARED_KEY,'irmaos');card.blur();setTimeout(()=>{try{const old=window.showSiblingHome;if(typeof old==='function')old()}catch(e){};location.reload()},80)}catch(e){toast('Não foi possível configurar este tablet agora.')}}}
 const home=document.getElementById('ctSiblingHome43');if(!home)return;
 let box=home.querySelector('.ct44-protection');if(!box){box=document.createElement('div');box.className='ct44-protection';const schedule=home.querySelector('#ctSiblingSchedule43');schedule?.insertAdjacentElement('afterend',box)}
 let enabled=false;try{enabled=typeof b.getProtectionEnabled==='function'&&!!b.getProtectionEnabled()}catch(e){}
 box.style.background=enabled?'#e9f8ef':'#fff4df';box.style.color=enabled?'#2d6745':'#8a621d';box.innerHTML=enabled?'● CasaToda Proteção está ativa neste tablet.':'○ CasaToda Proteção está desligada. <button id="ctEnable44" type="button" style="margin-left:8px;border:0;border-radius:999px;padding:7px 10px;background:#8a621d;color:#fff;font-weight:900">Ativar</button>';
 if(!enabled)box.querySelector('#ctEnable44')?.addEventListener('click',()=>{try{b.openProtectionSettings()}catch(e){toast('Abra Acessibilidade nas configurações do Android.')}})
}

function tune(){ensureStyle();ensureParentButton();patchSibling()}
const oldRender=typeof render==='function'?render:null;if(oldRender){render=function(){const x=oldRender();setTimeout(tune,100);return x}}
const oldGate=typeof renderProfileGate==='function'?renderProfileGate:null;if(oldGate){renderProfileGate=function(){const x=oldGate();setTimeout(tune,120);return x}}
window.addEventListener('focus',()=>setTimeout(tune,100));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tune,100)});
setInterval(tune,2500);setTimeout(tune,500);setTimeout(tune,1400);
})();