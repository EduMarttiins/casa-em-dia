(()=>{
'use strict';
if(window.__CASATODA_42__)return;
window.__CASATODA_42__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';

function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function childId(){try{return String(selected||'bernardo')}catch(e){return 'bernardo'}}
function childName(id){try{return state.children?.find(c=>c.id===id)?.name||id}catch(e){return id}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}
function minToTime(v){v=Math.max(0,Math.min(1439,Number(v)||0));return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0')}
function timeToMin(v){const m=String(v||'').match(/^(\d{1,2}):(\d{2})$/);if(!m)return null;const h=Number(m[1]),mm=Number(m[2]);if(h>23||mm>59)return null;return h*60+mm}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`}

async function getRuntime(id){const rows=await rpc('casatoda_get_device_control',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{wake_minutes:360,command:{}}}
async function setWake(id,wake){const ok=await rpc('casatoda_set_device_wake',{p_code:familyCode(),p_child_id:id,p_wake_minutes:wake});if(ok!==true)throw new Error('Falha ao salvar liberação')}
async function sendCommand(id,command){const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:command});if(ok!==true)throw new Error('Falha ao enviar comando')}

function closeModal(){document.getElementById('ctDeviceControl42Modal')?.remove()}
function makeButton(text,kind='secondary'){
 const b=document.createElement('button');b.type='button';b.textContent=text;
 const bg=kind==='primary'?'#5b35c9':kind==='danger'?'#a83b52':'#f0edf5';
 const color=kind==='secondary'?'#302b42':'#fff';
 b.style.cssText=`height:48px;border:0;border-radius:14px;background:${bg};color:${color};font-weight:900;padding:0 14px`;
 return b
}
function toast(msg){
 let t=document.getElementById('ctToast42');if(t)t.remove();t=document.createElement('div');t.id='ctToast42';t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:104px;transform:translateX(-50%);z-index:100001;background:#211b45;color:#fff;padding:12px 16px;border-radius:999px;font:800 12px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.22);max-width:90%;text-align:center';document.body.appendChild(t);setTimeout(()=>t.remove(),2600)
}
function modalShell(){
 closeModal();
 const wrap=document.createElement('div');wrap.id='ctDeviceControl42Modal';wrap.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.66);display:grid;place-items:center;padding:18px;overflow:auto';
 const card=document.createElement('div');card.style.cssText='width:min(470px,100%);background:#fff;border-radius:26px;padding:22px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.30);box-sizing:border-box';
 wrap.appendChild(card);wrap.addEventListener('click',e=>{if(e.target===wrap)closeModal()});document.body.appendChild(wrap);return card
}

async function openControl(){
 if(!familyCode()){toast('Conecte primeiro este aparelho à família.');return}
 const id=childId(),name=childName(id),base=Number(state?.settings?.cutoffMinutes?.[id]??1320);
 const card=modalShell();
 card.innerHTML=`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px"><div><div style="font-size:10px;letter-spacing:.12em;color:#7b7296;font-weight:900">CONTROLE DO APARELHO</div><h2 style="margin:5px 0 3px;font-size:24px">${name}</h2><p style="margin:0;color:#777185;font-size:13px">Defina quando bloquear, quando liberar e faça desbloqueios de emergência.</p></div><button id="ctClose42" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f1eef6;font-size:20px">×</button></div><div id="ctLoad42" style="margin-top:18px;padding:18px;border-radius:18px;background:#f6f4fb;text-align:center;color:#777185;font-weight:800">Carregando configurações...</div>`;
 document.getElementById('ctClose42').onclick=closeModal;
 let runtime;
 try{runtime=await getRuntime(id)}catch(e){card.querySelector('#ctLoad42').textContent='Não foi possível carregar. Verifique a internet e tente novamente.';return}
 const wake=Number(runtime.wake_minutes??360);
 const box=card.querySelector('#ctLoad42');
 box.style.cssText='margin-top:18px';
 box.innerHTML=`
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
  <label style="display:grid;gap:7px;text-align:left;font-size:11px;color:#696276;font-weight:900">BLOQUEAR ÀS<input id="ctBlock42" type="time" value="${minToTime(base)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label>
  <label style="display:grid;gap:7px;text-align:left;font-size:11px;color:#696276;font-weight:900">LIBERAR ÀS<input id="ctWake42" type="time" value="${minToTime(wake)}" style="height:50px;border:2px solid #e5e0ef;border-radius:14px;padding:0 12px;font-size:18px;font-weight:800;background:#fff"></label>
 </div>
 <button id="ctSaveSchedule42" type="button" style="width:100%;height:48px;margin-top:12px;border:0;border-radius:14px;background:#5b35c9;color:#fff;font-weight:900">Salvar horários</button>
 <div style="height:1px;background:#eeeaf4;margin:20px 0"></div>
 <div style="text-align:left"><b style="font-size:15px">Desbloqueio de emergência</b><p style="margin:4px 0 12px;color:#777185;font-size:12px;line-height:1.45">Libera remotamente o aparelho de ${name}. Ao terminar o período escolhido, o bloqueio volta automaticamente se ainda estiver dentro do horário bloqueado.</p></div>
 <div id="ctUnlockGrid42" style="display:grid;grid-template-columns:1fr 1fr;gap:9px"></div>
 <button id="ctResume42" type="button" style="width:100%;height:46px;margin-top:10px;border:1px solid #e1dce9;border-radius:14px;background:#fff;color:#5c5569;font-weight:900">Cancelar liberação e reaplicar regra</button>`;
 const grid=card.querySelector('#ctUnlockGrid42');
 const choices=[['15 minutos',15],['30 minutos',30],['1 hora',60],['Até a manhã','morning']];
 choices.forEach(([label,val])=>{const b=makeButton(label,val==='morning'?'primary':'secondary');b.onclick=async()=>{
  try{
   let until;
   if(val==='morning'){
    const wm=timeToMin(card.querySelector('#ctWake42').value);if(wm==null)throw new Error('Horário inválido');
    const now=new Date(),target=new Date(now);target.setHours(Math.floor(wm/60),wm%60,0,0);if(target<=now)target.setDate(target.getDate()+1);until=target.getTime();
   }else until=Date.now()+Number(val)*60_000;
   b.disabled=true;b.textContent='Enviando...';
   await sendCommand(id,{action:'unlock',untilMs:until,nonce:nonce(),requestedAt:Date.now()});
   toast(`${name} liberado. O aparelho receberá o comando em poucos segundos.`);b.textContent=label;b.disabled=false;
  }catch(e){b.textContent=label;b.disabled=false;toast('Não foi possível enviar o desbloqueio.')}
 };grid.appendChild(b)});
 card.querySelector('#ctResume42').onclick=async()=>{const b=card.querySelector('#ctResume42');try{b.disabled=true;b.textContent='Enviando...';await sendCommand(id,{action:'resume',nonce:nonce(),requestedAt:Date.now()});toast('Regra normal reaplicada.');b.textContent='Cancelar liberação e reaplicar regra';b.disabled=false}catch(e){b.disabled=false;b.textContent='Cancelar liberação e reaplicar regra';toast('Não foi possível enviar o comando.')}};
 card.querySelector('#ctSaveSchedule42').onclick=async()=>{
  const saveBtn=card.querySelector('#ctSaveSchedule42'),block=timeToMin(card.querySelector('#ctBlock42').value),wakeMin=timeToMin(card.querySelector('#ctWake42').value);
  if(block==null||wakeMin==null){toast('Confira os horários informados.');return}
  try{
   saveBtn.disabled=true;saveBtn.textContent='Salvando...';
   state.settings=state.settings||{};state.settings.cutoffMinutes=state.settings.cutoffMinutes||{};state.settings.cutoffMinutes[id]=block;
   if(typeof save==='function')save();
   await setWake(id,wakeMin);
   if(typeof render==='function')render();
   toast(`Horários de ${name} atualizados.`);saveBtn.textContent='Salvo ✓';setTimeout(()=>{saveBtn.textContent='Salvar horários';saveBtn.disabled=false},1000)
  }catch(e){saveBtn.disabled=false;saveBtn.textContent='Salvar horários';toast('Não foi possível salvar os horários.')}
 };
}

function removeOld(){document.getElementById('ctProtectionTest41')?.remove();document.getElementById('ctProtectionTest40')?.remove();document.getElementById('ctProtectionTest38')?.remove()}
function ensureButton(){
 removeOld();
 let b=document.getElementById('ctDeviceControl42');
 if(!isParent()||bridge()){b?.remove();return}
 if(b)return;
 b=document.createElement('button');b.id='ctDeviceControl42';b.type='button';b.innerHTML='<span style="font-size:16px">📱</span><span>Controle do aparelho</span>';
 b.style.cssText='position:fixed;right:16px;bottom:104px;z-index:9991;height:50px;border:0;border-radius:999px;padding:0 17px;background:#241b52;color:#fff;display:flex;align-items:center;gap:8px;font:900 12px system-ui;box-shadow:0 12px 28px rgba(36,27,82,.30)';b.onclick=openControl;document.body.appendChild(b)
}

function tune(){removeOld();ensureButton()}
const oldRender=typeof render==='function'?render:null;if(oldRender){render=function(){const x=oldRender();setTimeout(tune,80);return x}}
const oldEnter=typeof enterSession==='function'?enterSession:null;if(oldEnter){enterSession=function(role){const x=oldEnter(role);setTimeout(tune,120);return x}}
window.addEventListener('focus',()=>setTimeout(tune,100));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tune,100)});setInterval(tune,2200);setTimeout(tune,600);
})();
