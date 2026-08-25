(()=>{
'use strict';
if(window.__CASATODA_53__)return;
window.__CASATODA_53__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
let busy=false;

function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`}
function childName(id){if(id==='irmaos')return 'Irmãos';try{return state.children?.find(c=>c.id===id)?.name||id}catch(e){return id}}
function activeId(){return document.querySelector('#ctDeviceControl44Modal .ct44-tab.on')?.dataset?.id||'bernardo'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toast(msg){let t=document.getElementById('ctToast53');t?.remove();t=document.createElement('div');t.id='ctToast53';t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:100020;background:#211b45;color:#fff;padding:12px 16px;border-radius:999px;font:800 12px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.22);max-width:90%;text-align:center';document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}
async function getRuntime(id){const rows=await rpc('casatoda_get_device_control',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{}}
async function sendCommand(id,command){const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:command});if(ok!==true)throw new Error('command')}
function fmtDate(v){if(!v)return 'Ainda sem localização';const d=new Date(v);if(!Number.isFinite(d.getTime()))return 'Ainda sem localização';return d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
function apkReady(v){const m=String(v||'').match(/^(\d+)\.(\d+)/);if(!m)return false;return Number(m[1])>0||Number(m[2])>=11}
function statusText(r){const s=String(r.location_status||'unknown');if(s==='ok')return 'Localização atualizada';if(s==='last_known')return 'Última posição conhecida';if(s==='permission_denied')return 'Permissão de localização não concedida';if(s==='background_permission_required')return 'Permita Localização o tempo todo no aparelho';if(s==='location_disabled')return 'Localização do Android está desligada';if(s==='timeout')return 'Não foi possível obter uma posição nova';return r.location_updated_at?'Última posição disponível':'Nenhuma localização recebida ainda'}
function mapUrl(lat,lon){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat+','+lon)}`}

async function paint(section,id){
 let r;try{r=await getRuntime(id)}catch(e){section.innerHTML='<div style="color:#8c4555;font-size:12px">Não foi possível carregar a localização agora.</div>';return}
 if(!section.isConnected||activeId()!==id)return;
 const lat=Number(r.location_latitude),lon=Number(r.location_longitude),has=Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
 const acc=Number(r.location_accuracy_m);const ready=apkReady(r.apk_version);
 section.innerHTML=`
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
   <div><div style="font-size:10px;letter-spacing:.12em;color:#6f6490;font-weight:900">ENCONTRAR APARELHO</div><div style="margin-top:4px;font-size:16px;font-weight:950;color:#29233a">${esc(childName(id))}</div></div>
   <div style="padding:6px 9px;border-radius:999px;background:${has?'#e9f8ef':'#f1eff5'};color:${has?'#26704a':'#6c6579'};font-size:9px;font-weight:900">${has?'● Localização salva':'○ Sem posição'}</div>
  </div>
  <div style="margin-top:12px;padding:13px;border-radius:16px;background:#f7f5fb;border:1px solid #ebe6f2">
   <div style="font-size:12px;font-weight:900;color:#393247">${esc(statusText(r))}</div>
   <div style="margin-top:5px;font-size:10px;color:#777185;line-height:1.4">${esc(fmtDate(r.location_updated_at))}${has&&Number.isFinite(acc)?` • precisão aproximada ${Math.round(acc)} m`:''}</div>
  </div>
  ${ready?'':`<div style="margin-top:10px;padding:10px 12px;border-radius:13px;background:#fff4df;color:#8b6218;font-size:10px;font-weight:800;line-height:1.4">Instale o APK CasaToda Filhos 0.11 ou superior neste aparelho para usar localização e som.</div>`}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:11px">
   <button id="ctLocate53" type="button" ${ready?'':'disabled'} style="height:46px;border:0;border-radius:14px;background:#5b35c9;color:#fff;font-weight:900;opacity:${ready?'1':'.45'}">📍 Localizar agora</button>
   <button id="ctRing53" type="button" ${ready?'':'disabled'} style="height:46px;border:0;border-radius:14px;background:#e9f8ef;color:#206847;font-weight:900;opacity:${ready?'1':'.45'}">🔊 Tocar som</button>
   <button id="ctMap53" type="button" ${has?'':'disabled'} style="height:44px;border:1px solid #ddd6ea;border-radius:14px;background:#fff;color:#544b66;font-weight:900;opacity:${has?'1':'.45'}">🗺 Ver no mapa</button>
   <button id="ctStopRing53" type="button" ${ready?'':'disabled'} style="height:44px;border:1px solid #efdce2;border-radius:14px;background:#fff6f8;color:#93475f;font-weight:900;opacity:${ready?'1':'.45'}">Parar som</button>
  </div>
  <div style="margin-top:9px;font-size:9px;color:#8a8493;line-height:1.45">A localização é solicitada somente quando você toca em Localizar agora. O CasaToda mantém apenas a última posição recebida.</div>`;
 const locate=section.querySelector('#ctLocate53');if(locate)locate.onclick=async()=>{if(busy)return;busy=true;const before=String(r.location_updated_at||'');try{locate.disabled=true;locate.textContent='Localizando...';await sendCommand(id,{action:'locate',nonce:nonce(),requestedAt:Date.now()});toast(`Pedido de localização enviado para ${childName(id)}.`);for(let i=0;i<8;i++){await new Promise(res=>setTimeout(res,2500));const fresh=await getRuntime(id);if(String(fresh.location_updated_at||'')!==before||['permission_denied','background_permission_required','location_disabled','timeout'].includes(String(fresh.location_status||''))){await paint(section,id);busy=false;return}}await paint(section,id);toast('O aparelho ainda não respondeu com uma posição nova.')}catch(e){toast('Não foi possível solicitar a localização.');await paint(section,id)}finally{busy=false}};
 const ring=section.querySelector('#ctRing53');if(ring)ring.onclick=async()=>{try{ring.disabled=true;ring.textContent='Enviando...';await sendCommand(id,{action:'ring',seconds:60,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(id)} vai tocar por até 1 minuto.`);setTimeout(()=>{if(ring.isConnected){ring.disabled=false;ring.textContent='🔊 Tocar som'}},1200)}catch(e){ring.disabled=false;ring.textContent='🔊 Tocar som';toast('Não foi possível enviar o som.')}};
 const stop=section.querySelector('#ctStopRing53');if(stop)stop.onclick=async()=>{try{stop.disabled=true;await sendCommand(id,{action:'stop_ring',nonce:nonce(),requestedAt:Date.now()});toast('Comando para parar o som enviado.');setTimeout(()=>{if(stop.isConnected)stop.disabled=false},900)}catch(e){stop.disabled=false;toast('Não foi possível parar o som.')}};
 const map=section.querySelector('#ctMap53');if(map&&has)map.onclick=()=>window.open(mapUrl(lat,lon),'_blank','noopener');
}

function inject(){
 if(!familyCode())return;
 const modal=document.getElementById('ctDeviceControl44Modal');const body=modal?.querySelector('#ctBody44');if(!modal||!body)return;
 const id=activeId();let s=body.querySelector('#ctFindDevice53');if(s&&s.dataset.id===id)return;
 s?.remove();s=document.createElement('section');s.id='ctFindDevice53';s.dataset.id=id;s.style.cssText='margin-top:18px;padding-top:18px;border-top:1px solid #eeeaf4';s.innerHTML='<div style="padding:14px;border-radius:16px;background:#f7f5fb;color:#777185;font-size:12px;font-weight:800;text-align:center">Carregando Encontrar aparelho...</div>';body.appendChild(s);paint(s,id)
}

let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(inject,40)}
const obs=new MutationObserver(schedule);obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
document.addEventListener('click',()=>setTimeout(inject,80),true);setInterval(()=>{const s=document.getElementById('ctFindDevice53');if(s&&document.visibilityState==='visible')paint(s,activeId())},15000);setTimeout(inject,500);
})();
