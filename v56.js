(()=>{
'use strict';
if(window.__CASASEGURA_56__)return;
window.__CASASEGURA_56__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
let tab='screen';
let appBusy=false;
let refreshTimer=0;
let mutationTimer=0;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function enabled(){return isParent()&&!bridge()}
function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function childId(){try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}return 'bernardo'}
function childData(id){try{return state.children?.find(c=>c.id===id)||{id,name:id==='julia'?'Júlia':'Bernardo'}}catch(e){return{id,name:id==='julia'?'Júlia':'Bernardo'}}}
function childName(id){return childData(id).name||id}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`}
function fmt(ms){ms=Math.max(0,Number(ms)||0);const min=Math.round(ms/60000),h=Math.floor(min/60),m=min%60;if(h&&m)return `${h}h${String(m).padStart(2,'0')}m`;if(h)return `${h}h`;return `${m}min`}
function minToTime(v){v=Math.max(0,Math.min(1439,Number(v)||0));return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0')}
function fmtDate(v){if(!v)return 'Ainda sem atualização';const d=new Date(v);if(!Number.isFinite(d.getTime()))return 'Ainda sem atualização';return d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
function statusOnline(r){const t=r?.last_seen_at?Date.parse(r.last_seen_at):0;return t&&Date.now()-t<45000}
function appGlyph(name,pkg){const s=(String(name||'')+' '+String(pkg||'')).toLowerCase();if(s.includes('youtube'))return '▶';if(s.includes('tiktok'))return '♪';if(s.includes('whatsapp'))return '◉';if(s.includes('instagram'))return '◎';if(s.includes('netflix'))return 'N';if(s.includes('chrome'))return '●';return String(name||'?').trim().charAt(0).toUpperCase()||'•'}
function toast(msg){document.querySelector('.cs56-toast')?.remove();const t=document.createElement('div');t.className='cs56-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}
async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}
async function getUsage(id){const rows=await rpc('casasegura_get_app_usage',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{usage_summary:{},usage_status:'unknown'}}
async function getRuntime(id){const rows=await rpc('casatoda_get_device_control',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{}}
async function sendCommand(id,command){const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:command});if(ok!==true)throw new Error('command')}

function avatarHtml(c,cls=''){if(c?.photo)return `<img class="${cls}" src="${esc(c.photo)}" alt="">`;return `<span class="${cls}">${esc((c?.name||'?').slice(0,1).toUpperCase())}</span>`}
function ensureShell(){
 if(!enabled()){document.body.classList.remove('cs56-parent');document.getElementById('cs56App')?.remove();document.getElementById('cs56Nav')?.remove();return null}
 document.body.classList.add('cs56-parent');
 const host=document.querySelector('.app');if(!host)return null;
 let app=document.getElementById('cs56App');if(!app){app=document.createElement('main');app.id='cs56App';host.prepend(app)}
 let nav=document.getElementById('cs56Nav');if(!nav){nav=document.createElement('nav');nav.id='cs56Nav';nav.innerHTML=`<button class="cs56-nav-btn" data-tab="screen"><i>▥</i><span>Tempo de tela</span></button><button class="cs56-nav-btn" data-tab="controls"><i>♙</i><span>Controles</span></button><button class="cs56-nav-btn" data-tab="location"><i>⌖</i><span>Localização</span></button>`;document.body.appendChild(nav);nav.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;paint()})}
 return app
}

function topHtml(id){const c=childData(id);return `<div id="cs56Top"><button class="cs56-child-pill" id="cs56Switch" type="button">${avatarHtml(c,'')}<span>${esc(c.name)}</span><b style="font-size:9px;color:#8f929c">⌄</b></button><div class="cs56-top-actions"><button class="cs56-icon-btn" id="cs56Bell" type="button" aria-label="Notificações">♢</button><button class="cs56-parent-avatar" id="cs56Parent" type="button" aria-label="Perfil dos pais">P</button></div></div><div class="cs56-brandline"><span>CasaSegura</span><span><i class="cs56-status-dot"></i>Sincronizado</span></div><section id="cs56Content"><div class="cs56-loading">Carregando ${esc(c.name)}...</div></section>`}

function hookTop(app,id){app.querySelector('#cs56Switch')?.addEventListener('click',openSwitcher);app.querySelector('#cs56Bell')?.addEventListener('click',()=>toast('As notificações da família aparecerão aqui.'));app.querySelector('#cs56Parent')?.addEventListener('click',()=>{const b=document.querySelector('.session-badge');if(b)b.click();else toast('Perfil dos pais ativo.')})}

function openSwitcher(){
 document.querySelector('.cs56-sheet')?.remove();const wrap=document.createElement('div');wrap.className='cs56-sheet';const card=document.createElement('section');card.className='cs56-sheet-card';card.innerHTML='<div class="cs56-sheet-title">Escolher perfil</div>';for(const c of (state?.children||[])){const b=document.createElement('button');b.type='button';b.className='cs56-person-option';b.innerHTML=`${avatarHtml(c,'')}<span><b>${esc(c.name)}</b><span>${c.id===childId()?'Perfil ativo':'Toque para visualizar'}</span></span><strong>${c.id===childId()?'✓':'›'}</strong>`;b.onclick=()=>{try{selected=c.id}catch(e){}wrap.remove();paint()};card.appendChild(b)}wrap.appendChild(card);wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};document.body.appendChild(wrap)
}

function setNav(){document.querySelectorAll('#cs56Nav [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab))}

function deviceStatus(r){return statusOnline(r)?(r.protection_enabled===false?'Online, proteção desligada':'Online'):'Sem atualização recente'}
function topApps(u){const apps=Array.isArray(u?.apps)?u.apps:[];return apps.slice(0,3)}

function screenHtml(id,usage,runtime){
 const c=childData(id),u=usage?.usage_summary&&typeof usage.usage_summary==='object'?usage.usage_summary:{};const apps=topApps(u);const total=Number(u.totalMs)||0;const block=Number(state?.settings?.cutoffMinutes?.[id]??runtime?.block_minutes??1320);const wake=Number(runtime?.wake_minutes??360);const online=statusOnline(runtime);const model=runtime?.device_model||runtime?.model||runtime?.device_name||`Aparelho de ${c.name}`;
 return `<section class="cs56-card cs56-usage" id="cs56OpenUsage"><div><div class="cs56-title">Tempo de uso hoje</div><div class="cs56-big">${esc(fmt(total))}</div><div class="cs56-sub">${apps[0]?`${esc(apps[0].name)} é o mais usado hoje`:'Aguardando dados do aparelho'}</div></div><div class="cs56-app-icons">${apps.length?apps.map(a=>`<div class="cs56-app-badge">${esc(appGlyph(a.name,a.package))}<small>${esc(a.name)}</small></div>`).join(''):'<div class="cs56-app-badge">◷<small>Uso</small></div>'}</div></section><section class="cs56-card"><div class="cs56-device-head"><div class="cs56-phone"></div><div><div class="cs56-device-name">${esc(model)}</div><div class="cs56-device-state">${esc(deviceStatus(runtime))}${runtime?.apk_version?` • APK ${esc(runtime.apk_version)}`:''}</div></div><span class="cs56-chevron">›</span></div><div class="cs56-device-actions"><button class="cs56-primary" id="cs56Extra">◴ Tempo extra 30 min</button><button class="cs56-square" id="cs56Device">▣</button></div></section><section class="cs56-control-card"><button class="cs56-control-row" id="cs56Limits" type="button"><span class="cs56-control-icon" style="color:#e1ba58">⌛</span><span><b>Limites de tempo</b><span>Bloqueia às ${esc(minToTime(block))} • libera às ${esc(minToTime(wake))}</span></span><span class="cs56-control-arrow">›</span></button><button class="cs56-control-row" id="cs56Schedule" type="button"><span class="cs56-control-icon" style="color:#7db9ec">▣</span><span><b>Programações</b><span>Descanso, rotina e horários do aparelho</span></span><span class="cs56-control-arrow">›</span></button></section>`
}

function controlsHtml(id,runtime){const c=childData(id),block=Number(state?.settings?.cutoffMinutes?.[id]??runtime?.block_minutes??1320),wake=Number(runtime?.wake_minutes??360);return `<div class="cs56-section-label">CONTROLES DE ${esc(c.name).toUpperCase()}</div><section class="cs56-card"><div class="cs56-card-inner"><div class="cs56-title">Aparelho</div><div class="cs56-big" style="font-size:21px">${esc(deviceStatus(runtime))}</div><div class="cs56-sub">Horário atual: ${esc(minToTime(wake))} até ${esc(minToTime(block))}</div></div><div class="cs56-device-actions"><button class="cs56-primary" id="cs56Manage">Gerenciar aparelho</button><button class="cs56-square" id="cs56QuickLock">▣</button></div></section><section class="cs56-control-card"><button class="cs56-control-row" id="cs56CtlLimits" type="button"><span class="cs56-control-icon">⌛</span><span><b>Limites e horários</b><span>Definir bloqueio e liberação</span></span><span class="cs56-control-arrow">›</span></button><button class="cs56-control-row" id="cs56CtlUsage" type="button"><span class="cs56-control-icon">▥</span><span><b>Tempo por aplicativo</b><span>YouTube, TikTok, WhatsApp e outros</span></span><span class="cs56-control-arrow">›</span></button><button class="cs56-control-row" id="cs56CtlRoutine" type="button"><span class="cs56-control-icon">✓</span><span><b>Rotina e tarefas</b><span>Atividades do dia e recompensas</span></span><span class="cs56-control-arrow">›</span></button><button class="cs56-control-row" id="cs56CtlFind" type="button"><span class="cs56-control-icon">⌖</span><span><b>Encontrar aparelho</b><span>Localização e som remoto</span></span><span class="cs56-control-arrow">›</span></button></section>`}

function locationHtml(id,runtime){const c=childData(id),lat=Number(runtime?.location_latitude),lon=Number(runtime?.location_longitude),has=Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180,acc=Number(runtime?.location_accuracy_m);const st=runtime?.location_status==='ok'?'Localização atualizada':runtime?.location_updated_at?'Última posição disponível':'Nenhuma localização recebida';return `<div class="cs56-section-label">LOCALIZAÇÃO DE ${esc(c.name).toUpperCase()}</div><section class="cs56-map"><div class="cs56-pin">⌖</div><div class="cs56-map-info"><b>${esc(st)}</b><div>${esc(fmtDate(runtime?.location_updated_at))}${has&&Number.isFinite(acc)?` • precisão aproximada ${Math.round(acc)} m`:''}</div></div></section><div class="cs56-location-actions"><button class="blue" id="cs56Locate">⌖ Localizar agora</button><button id="cs56Ring">◖ Tocar som</button><button id="cs56OpenMap" ${has?'':'disabled'} style="opacity:${has?'1':'.45'}">▧ Abrir mapa</button><button id="cs56OpenDevice">▣ Aparelho</button></div><section class="cs56-control-card" style="margin-top:10px"><div class="cs56-control-row"><span class="cs56-control-icon">⌂</span><span><b>Casa</b><span>Você poderá cadastrar locais importantes aqui</span></span><span class="cs56-control-arrow">›</span></div><div class="cs56-control-row"><span class="cs56-control-icon">▤</span><span><b>Escola</b><span>Área preparada para locais da família</span></span><span class="cs56-control-arrow">›</span></div></section>`}
}

function openLegacyDevice(){const b=document.getElementById('ctDeviceControl44');if(b){b.click();return}toast('A Central dos aparelhos está carregando.')}
function openLegacyUsage(){const b=document.getElementById('ctScreenTime55');if(b){b.click();return}toast('O Tempo de tela está carregando.')}
function openRoutine(){const b=document.getElementById('routineNav');if(b)b.click();else toast('Rotina indisponível agora.')}

function bindScreen(id,runtime){document.getElementById('cs56OpenUsage')?.addEventListener('click',openLegacyUsage);document.getElementById('cs56Device')?.addEventListener('click',openLegacyDevice);document.getElementById('cs56Limits')?.addEventListener('click',openLegacyDevice);document.getElementById('cs56Schedule')?.addEventListener('click',openLegacyDevice);document.getElementById('cs56Extra')?.addEventListener('click',async e=>{if(appBusy)return;appBusy=true;const b=e.currentTarget;try{b.disabled=true;b.textContent='Enviando...';await sendCommand(id,{action:'unlock',untilMs:Date.now()+30*60000,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(id)} recebeu 30 minutos de tempo extra.`);b.textContent='Tempo extra enviado ✓'}catch(err){toast('Não foi possível enviar o tempo extra.');b.textContent='◴ Tempo extra 30 min'}finally{setTimeout(()=>{if(b.isConnected){b.disabled=false;b.textContent='◴ Tempo extra 30 min'};appBusy=false},1200)}})}
function bindControls(id){for(const x of ['cs56Manage','cs56QuickLock','cs56CtlLimits'])document.getElementById(x)?.addEventListener('click',openLegacyDevice);document.getElementById('cs56CtlUsage')?.addEventListener('click',openLegacyUsage);document.getElementById('cs56CtlRoutine')?.addEventListener('click',openRoutine);document.getElementById('cs56CtlFind')?.addEventListener('click',()=>{tab='location';paint()})}
function bindLocation(id,runtime){document.getElementById('cs56OpenDevice')?.addEventListener('click',openLegacyDevice);document.getElementById('cs56Locate')?.addEventListener('click',async e=>{if(appBusy)return;appBusy=true;const b=e.currentTarget;const before=String(runtime?.location_updated_at||'');try{b.disabled=true;b.textContent='Localizando...';await sendCommand(id,{action:'locate',nonce:nonce(),requestedAt:Date.now()});toast('Pedido de localização enviado.');for(let i=0;i<7;i++){await new Promise(r=>setTimeout(r,2200));const fresh=await getRuntime(id);if(String(fresh.location_updated_at||'')!==before){await paint();break}}}catch(err){toast('Não foi possível solicitar a localização.')}finally{appBusy=false;if(b.isConnected){b.disabled=false;b.textContent='⌖ Localizar agora'}}});document.getElementById('cs56Ring')?.addEventListener('click',async e=>{const b=e.currentTarget;try{b.disabled=true;await sendCommand(id,{action:'ring',seconds:60,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(id)} vai tocar por até 1 minuto.`)}catch(err){toast('Não foi possível tocar o aparelho.')}finally{setTimeout(()=>{if(b.isConnected)b.disabled=false},1200)}});const map=document.getElementById('cs56OpenMap');const lat=Number(runtime?.location_latitude),lon=Number(runtime?.location_longitude);if(map&&Number.isFinite(lat)&&Number.isFinite(lon))map.onclick=()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat+','+lon)}`,'_blank','noopener')}

async function paint(){
 const app=ensureShell();if(!app)return;
 const id=childId();app.innerHTML=topHtml(id);hookTop(app,id);setNav();const content=app.querySelector('#cs56Content');
 if(!familyCode()){content.innerHTML='<section class="cs56-card"><div class="cs56-card-inner"><div class="cs56-title">CasaSegura</div><div class="cs56-big" style="font-size:20px">Conecte esta família</div><div class="cs56-sub">O código da família é necessário para carregar aparelho, localização e Tempo de tela.</div></div></section>';return}
 try{
  if(tab==='screen'){
   const [usage,runtime]=await Promise.all([getUsage(id).catch(()=>({usage_summary:{}})),getRuntime(id)]);if(childId()!==id||tab!=='screen')return;content.innerHTML=screenHtml(id,usage,runtime);bindScreen(id,runtime)
  }else if(tab==='controls'){
   const runtime=await getRuntime(id);if(childId()!==id||tab!=='controls')return;content.innerHTML=controlsHtml(id,runtime);bindControls(id)
  }else{
   const runtime=await getRuntime(id);if(childId()!==id||tab!=='location')return;content.innerHTML=locationHtml(id,runtime);bindLocation(id,runtime)
  }
 }catch(e){content.innerHTML='<section class="cs56-card"><div class="cs56-card-inner"><div class="cs56-title">Sem conexão</div><div class="cs56-big" style="font-size:20px">Não foi possível carregar agora</div><div class="cs56-sub">Confira a internet e tente novamente em alguns segundos.</div></div></section>'}
}

function schedulePaint(){clearTimeout(mutationTimer);mutationTimer=setTimeout(()=>{if(enabled())paint()},120)}
const obs=new MutationObserver(muts=>{if(muts.some(m=>{const t=m.target;return !(t instanceof Element)||!t.closest?.('#cs56App,#cs56Nav,.cs56-sheet')}))schedulePaint()});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')paint()});
clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(enabled()&&document.visibilityState==='visible')paint()},20000);
setTimeout(paint,250);setTimeout(paint,900);
})();
