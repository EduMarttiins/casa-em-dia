(()=>{
'use strict';
if(window.__CASASEGURA_55__)return;
window.__CASASEGURA_55__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
let lastChild='';
let refreshBusy=false;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function activeChild(){
 try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}
 const on=document.querySelector('#v15Switcher [data-id].active,#v15Switcher [data-id].on,#v15Switcher [aria-selected="true"]');
 const id=on?.dataset?.id||on?.dataset?.childId;
 return ['bernardo','julia'].includes(id)?id:'bernardo';
}
function childName(id){try{return state.children?.find(c=>c.id===id)?.name||(id==='julia'?'Júlia':'Bernardo')}catch(e){return id==='julia'?'Júlia':'Bernardo'}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmt(ms){ms=Math.max(0,Number(ms)||0);const min=Math.round(ms/60000);const h=Math.floor(min/60),m=min%60;if(h&&m)return `${h}h ${m}min`;if(h)return `${h}h`;return `${m}min`}
function fmtUpdate(v){if(!v)return 'Ainda sem dados';const d=new Date(v);if(!Number.isFinite(d.getTime()))return 'Ainda sem dados';return `Atualizado ${d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}`}
function appGlyph(name,pkg){const s=(name+' '+pkg).toLowerCase();if(s.includes('youtube'))return '▶';if(s.includes('tiktok'))return '♪';if(s.includes('whatsapp'))return '💬';if(s.includes('instagram'))return '◎';if(s.includes('chrome'))return '◉';if(s.includes('minecraft'))return '▦';return String(name||'?').trim().charAt(0).toUpperCase()||'•'}
async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}
async function getUsage(id){const rows=await rpc('casasegura_get_app_usage',{p_code:familyCode(),p_child_id:id});return Array.isArray(rows)&&rows[0]?rows[0]:{usage_summary:{},usage_status:'unknown'}}
async function sendRefresh(id){const ok=await rpc('casatoda_send_device_command',{p_code:familyCode(),p_child_id:id,p_command:{action:'usage_refresh',nonce:nonce(),requestedAt:Date.now()}});if(ok!==true)throw new Error('command')}
function toast(msg){let t=document.getElementById('ctToast55');t?.remove();t=document.createElement('div');t.id='ctToast55';t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:100030;background:#211b45;color:#fff;padding:11px 15px;border-radius:999px;font:800 12px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.2);max-width:90%;text-align:center';document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}

function renameBrand(root=document.body){
 document.title='CasaSegura';
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let n;while((n=walker.nextNode())){const tag=n.parentElement?.tagName;if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT')continue;const old=n.nodeValue||'';const next=old.replace(/CASATODA/g,'CASASEGURA').replace(/CasaToda/g,'CasaSegura');if(next!==old)n.nodeValue=next}
 root.querySelectorAll?.('[title],[aria-label]').forEach(el=>{for(const a of ['title','aria-label']){const v=el.getAttribute(a);if(v)el.setAttribute(a,v.replace(/CasaToda/g,'CasaSegura').replace(/CASATODA/g,'CASASEGURA'))}})
}

function ensureStyle(){if(document.getElementById('ctStyle55'))return;const s=document.createElement('style');s.id='ctStyle55';s.textContent=`
#ctScreenTime55{box-sizing:border-box;width:auto;margin:12px 20px 8px;padding:15px 16px;border:1px solid rgba(110,89,190,.13);border-radius:22px;background:linear-gradient(135deg,#fff 0%,#f6f2ff 55%,#edf7ff 100%);box-shadow:0 10px 28px rgba(47,38,89,.08);font-family:system-ui;color:#272238;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;cursor:pointer}
#ctScreenTime55 .ct55-icon{width:45px;height:45px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(145deg,#6b43df,#4f79ec);color:#fff;font-size:20px;box-shadow:0 8px 18px rgba(91,53,201,.2)}
#ctScreenTime55 .ct55-kicker{font-size:9px;font-weight:900;letter-spacing:.12em;color:#817799;text-transform:uppercase}
#ctScreenTime55 .ct55-main{margin-top:2px;font-size:18px;font-weight:950;letter-spacing:-.02em}
#ctScreenTime55 .ct55-sub{margin-top:2px;font-size:10px;color:#777083;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ctScreenTime55 .ct55-arrow{width:34px;height:34px;border-radius:12px;background:#fff;display:grid;place-items:center;color:#6949cd;font-size:20px;font-weight:900;border:1px solid #ece6f7}
@media(max-width:420px){#ctScreenTime55{margin:10px 20px 7px;padding:13px 14px;border-radius:19px;gap:10px}#ctScreenTime55 .ct55-icon{width:40px;height:40px;border-radius:13px}#ctScreenTime55 .ct55-main{font-size:16px}}
`;document.head.appendChild(s)}

function placeCard(){
 if(!isParent()||bridge()){document.getElementById('ctScreenTime55')?.remove();return null}
 const central=document.getElementById('ctDeviceControl44');const app=document.querySelector('.app');if(!central||!app)return null;
 let card=document.getElementById('ctScreenTime55');if(!card){card=document.createElement('button');card.type='button';card.id='ctScreenTime55';card.setAttribute('aria-label','Abrir Tempo de tela');card.onclick=()=>openDetails(activeChild())}
 if(card.parentElement!==app||card.previousElementSibling!==central)central.insertAdjacentElement('afterend',card);
 return card
}

async function paintCard(){
 const card=placeCard();if(!card||!familyCode())return;
 const id=activeChild();lastChild=id;
 card.innerHTML=`<span class="ct55-icon">◷</span><span><span class="ct55-kicker">TEMPO DE TELA • ${esc(childName(id))}</span><span class="ct55-main">Carregando...</span><span class="ct55-sub">Uso dos aplicativos de hoje</span></span><span class="ct55-arrow">›</span>`;
 try{
  const r=await getUsage(id);if(!card.isConnected||activeChild()!==id)return;
  const u=r.usage_summary&&typeof r.usage_summary==='object'?r.usage_summary:{};const total=Number(u.totalMs)||0;const apps=Array.isArray(u.apps)?u.apps:[];const status=String(r.usage_status||'unknown');
  let main=fmt(total),sub=apps[0]?`${apps[0].name}: ${fmt(apps[0].ms)}`:fmtUpdate(r.usage_updated_at);
  if(status==='permission_required'){main='Ativar acesso';sub='Acesso ao uso necessário no celular'}
  else if(status==='error'){main='Dados indisponíveis';sub='Tente atualizar novamente'}
  else if(!r.usage_updated_at){main='Sem dados ainda';sub='Instale o APK 0.12 no celular'}
  card.innerHTML=`<span class="ct55-icon">◷</span><span><span class="ct55-kicker">TEMPO DE TELA • ${esc(childName(id))}</span><span class="ct55-main">${esc(main)}</span><span class="ct55-sub">${esc(sub)}</span></span><span class="ct55-arrow">›</span>`;
 }catch(e){card.querySelector('.ct55-main').textContent='Não foi possível carregar';card.querySelector('.ct55-sub').textContent='Toque para tentar novamente'}
}

function modalShell(){document.getElementById('ctUsageModal55')?.remove();const w=document.createElement('div');w.id='ctUsageModal55';w.style.cssText='position:fixed;inset:0;z-index:100040;background:rgba(20,15,45,.68);display:grid;place-items:center;padding:16px;overflow:auto;font-family:system-ui';const c=document.createElement('div');c.style.cssText='width:min(520px,100%);max-height:88vh;overflow:auto;box-sizing:border-box;background:#fff;border-radius:26px;padding:20px;color:#282238;box-shadow:0 25px 70px rgba(0,0,0,.28)';w.appendChild(c);w.onclick=e=>{if(e.target===w)w.remove()};document.body.appendChild(w);return c}

async function openDetails(id){
 if(!familyCode()){toast('Conecte o CasaSegura à família primeiro.');return}
 const c=modalShell();c.innerHTML='<div style="padding:24px;text-align:center;color:#777185;font-weight:800">Carregando Tempo de tela...</div>';
 await renderDetails(c,id,false)
}

async function renderDetails(c,id,requestFresh){
 if(requestFresh&&!refreshBusy){refreshBusy=true;try{await sendRefresh(id);toast(`Atualizando o uso de ${childName(id)}...`);await new Promise(r=>setTimeout(r,3500))}catch(e){toast('Não foi possível solicitar a atualização.')}finally{refreshBusy=false}}
 let r;try{r=await getUsage(id)}catch(e){c.innerHTML='<div style="color:#91485c;padding:18px">Não foi possível carregar o Tempo de tela.</div>';return}
 const u=r.usage_summary&&typeof r.usage_summary==='object'?r.usage_summary:{};const total=Number(u.totalMs)||0;const apps=Array.isArray(u.apps)?u.apps:[];const days=Array.isArray(u.days)?u.days:[];const status=String(r.usage_status||'unknown');const maxApp=Math.max(1,...apps.map(a=>Number(a.ms)||0));const maxDay=Math.max(1,...days.map(d=>Number(d.totalMs)||0));
 const statusBox=status==='permission_required'?'<div style="margin:14px 0;padding:13px;border-radius:15px;background:#fff4df;color:#825c17;font-size:11px;font-weight:800;line-height:1.45">No celular da criança, abra o CasaSegura e autorize Acesso ao uso. Depois toque em Atualizar agora.</div>':!r.usage_updated_at?'<div style="margin:14px 0;padding:13px;border-radius:15px;background:#f3effb;color:#665c78;font-size:11px;font-weight:800">Ainda não recebemos dados. É necessário o APK CasaSegura 0.12 ou superior.</div>':'';
 c.innerHTML=`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px"><div><div style="font-size:10px;letter-spacing:.13em;color:#81779a;font-weight:900">CASASEGURA</div><h2 style="margin:4px 0 2px;font-size:25px">Tempo de tela</h2><div style="font-size:12px;color:#756f80">${esc(childName(id))} • ${esc(fmtUpdate(r.usage_updated_at))}</div></div><button id="ctClose55" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f2eff7;font-size:20px">×</button></div>${statusBox}<div style="margin-top:15px;padding:16px;border-radius:19px;background:linear-gradient(135deg,#5b35c9,#426fda);color:#fff"><div style="font-size:10px;font-weight:900;letter-spacing:.1em;opacity:.78">TOTAL HOJE</div><div style="font-size:31px;font-weight:950;margin-top:3px;letter-spacing:-.04em">${esc(fmt(total))}</div><div style="font-size:11px;margin-top:3px;opacity:.82">${apps.length?`${apps.length} aplicativos com uso registrado`:'Aguardando dados de uso'}</div></div><div style="display:flex;align-items:center;justify-content:space-between;margin:20px 0 10px"><b style="font-size:15px">Aplicativos mais usados</b><button id="ctRefreshUsage55" type="button" style="height:35px;border:0;border-radius:11px;background:#eee9fb;color:#5b35c9;padding:0 11px;font-weight:900;font-size:10px">Atualizar agora</button></div><div id="ctApps55">${apps.length?apps.map(a=>{const p=Math.max(4,Math.round((Number(a.ms)||0)/maxApp*100));return `<div style="display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:center;margin:9px 0"><div style="width:38px;height:38px;border-radius:12px;background:#f1edfb;display:grid;place-items:center;font-weight:950;color:#5c3ec1">${esc(appGlyph(a.name,a.package))}</div><div style="min-width:0"><div style="font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(a.name||a.package)}</div><div style="height:6px;border-radius:999px;background:#eeeaf4;margin-top:6px;overflow:hidden"><div style="height:100%;width:${p}%;border-radius:999px;background:#7352dd"></div></div></div><div style="font-size:11px;font-weight:900;color:#50495c">${esc(fmt(a.ms))}</div></div>`}).join(''):'<div style="padding:14px;border-radius:15px;background:#f7f5fa;color:#777185;font-size:11px;text-align:center">Nenhum uso registrado ainda.</div>'}</div><div style="margin-top:20px"><b style="font-size:15px">Últimos 7 dias</b><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end;height:105px;margin-top:10px">${days.map(d=>{const h=Math.max(8,Math.round((Number(d.totalMs)||0)/maxDay*72));const dt=String(d.date||'').slice(5);return `<div style="height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px"><div title="${esc(fmt(d.totalMs))}" style="width:100%;max-width:28px;height:${h}px;border-radius:8px 8px 4px 4px;background:linear-gradient(#8b6ee7,#5b35c9)"></div><span style="font-size:8px;color:#817b88;font-weight:800">${esc(dt)}</span></div>`}).join('')}</div></div><div style="margin-top:16px;padding:11px 12px;border-radius:14px;background:#f7f5fa;color:#7b7583;font-size:9px;line-height:1.45">O CasaSegura mede tempo de uso dos aplicativos. Não lê mensagens, vídeos assistidos ou o conteúdo dentro dos aplicativos.</div>`;
 c.querySelector('#ctClose55').onclick=()=>document.getElementById('ctUsageModal55')?.remove();c.querySelector('#ctRefreshUsage55').onclick=()=>renderDetails(c,id,true)
}

function tune(){ensureStyle();renameBrand();if(isParent()&&!bridge()){const id=activeChild();placeCard();if(id!==lastChild)paintCard()}else document.getElementById('ctScreenTime55')?.remove()}
const obs=new MutationObserver(()=>requestAnimationFrame(tune));obs.observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('click',()=>setTimeout(()=>{tune();paintCard()},80),true);window.addEventListener('pageshow',()=>setTimeout(()=>{tune();paintCard()},100));
setInterval(()=>{if(isParent()&&!bridge()&&document.visibilityState==='visible')paintCard()},30000);
setTimeout(()=>{tune();paintCard()},250);setTimeout(()=>{tune();paintCard()},1100);
})();
