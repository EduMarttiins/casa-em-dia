(()=>{
'use strict';
if(window.__CASASEGURA_62__)return;
window.__CASASEGURA_62__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const TOKEN_KEY='casasegura_device_token';
const CODE_KEY='casatoda_family_code';
const BOUND_KEY='casasegura_bound_child';
const iconCache=new Map();
let usageBusy=false;
let photoBusy=false;
let decorateTimer=0;
let photoSyncTimer=0;

function q(s,p=document){return p.querySelector(s)}
function qa(s,p=document){return [...p.querySelectorAll(s)]}
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function deviceToken(){try{return String(localStorage.getItem(TOKEN_KEY)||'').trim()}catch(e){return ''}}
function familyCode(){try{return String(localStorage.getItem(CODE_KEY)||'').trim()}catch(e){return ''}}
function childId(){
 try{if(isChild())return String(sessionRole||'').trim().toLowerCase()}catch(e){}
 try{const x=String(bridge()?.getDeviceProfile?.()||bridge()?.getChildId?.()||'').trim().toLowerCase();if(x)return x}catch(e){}
 try{const x=String(localStorage.getItem(BOUND_KEY)||'').trim().toLowerCase();if(x)return x}catch(e){}
 try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}
 return ''
}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmt(ms){
 const min=Math.max(0,Math.round((Number(ms)||0)/60000));
 const h=Math.floor(min/60),m=min%60;
 if(h&&m)return `${h}h ${m}min`;
 if(h)return `${h}h`;
 return `${m}min`
}
function appGlyph(name,pkg){
 const s=(String(name||'')+' '+String(pkg||'')).toLowerCase();
 if(s.includes('youtube'))return '▶';
 if(s.includes('tiktok'))return '♪';
 if(s.includes('whatsapp'))return '◉';
 if(s.includes('instagram'))return '◎';
 if(s.includes('netflix'))return 'N';
 if(s.includes('chrome'))return '●';
 if(s.includes('roblox'))return 'R';
 if(s.includes('minecraft'))return '▦';
 return String(name||pkg||'?').trim().charAt(0).toUpperCase()||'•'
}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body||{}),cache:'no-store'});
 let j=null;try{j=await r.json()}catch(e){}
 if(!r.ok)throw new Error(j?.message||j?.error||('HTTP '+r.status));return j
}
function toast(msg){
 q('#cs62Toast')?.remove();const t=document.createElement('div');t.id='cs62Toast';t.textContent=msg;
 t.style.cssText='position:fixed;left:50%;bottom:calc(var(--cs60-nav-h,64px) + 12px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:260000;max-width:88%;padding:10px 14px;border-radius:999px;background:#211d35;color:#fff;font:850 10px system-ui;box-shadow:0 12px 30px rgba(0,0,0,.22);text-align:center';
 document.body.appendChild(t);setTimeout(()=>t.remove(),2200)
}

/* ---------- abas laterais ---------- */
function clickLegacy(id){const b=q('#'+id);if(b)b.click()}
function openChildAction(action){
 if(action==='routine'){clickLegacy('routineNav');return}
 if(action==='reward'){clickLegacy('rewardBtn');return}
 if(action==='cash'){
  clickLegacy('rewardBtn');
  setTimeout(()=>{try{if(typeof setRewardTab==='function')setRewardTab('cash')}catch(e){}},60)
 }
}
function ensureSideTabs(){
 let wrap=q('#cs62LeftTabs');
 if(!isChild()){wrap?.remove();return}
 if(!wrap){
  wrap=document.createElement('div');wrap.id='cs62LeftTabs';
  wrap.innerHTML='<button class="cs62-side-tab" data-action="routine" type="button">Minha rotina</button><button class="cs62-side-tab" data-action="reward" type="button">Prêmios</button><button class="cs62-side-tab" data-action="cash" type="button">Cofrinho</button>';
  wrap.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>openChildAction(b.dataset.action));
  document.body.appendChild(wrap)
 }
 const hist=q('#cs60HistoryTab');if(hist)hist.textContent='Histórico'
}

/* ---------- foto de perfil ---------- */
function stateChild(id){try{return state?.children?.find(c=>c.id===id)||null}catch(e){return null}}
function setPhotoInState(id,src){const c=stateChild(id);if(c&&src)c.photo=src}
function applyPhoto(id,src){
 if(!src||!['bernardo','julia'].includes(id))return;
 setPhotoInState(id,src);
 const setBg=el=>{
  if(!el)return;
  el.style.setProperty('background-image',`url(${JSON.stringify(src)})`,'important');
  el.style.setProperty('background-size','cover','important');
  el.style.setProperty('background-position','center','important');
  el.style.setProperty('background-repeat','no-repeat','important');
  el.style.setProperty('color','transparent','important');
  qa(':scope > img',el).forEach(img=>{img.alt='';img.style.setProperty('opacity','0','important');img.style.setProperty('visibility','hidden','important')})
 };
 qa(`[data-v15-child="${id}"] .v15-tab-avatar`).forEach(setBg);
 qa(`#authGate [data-login-role="${id}"] .profile-photo`).forEach(el=>{if(el.tagName==='IMG'){el.src=src;el.alt=''}else setBg(el)});
 qa('#people .person').forEach(card=>{
  let cid=String(card.dataset.person||'').toLowerCase();
  if(!cid&&card.classList.contains('julia'))cid='julia';
  if(!cid){try{cid=isChild()?String(sessionRole||'').toLowerCase():String(selected||'').toLowerCase()}catch(e){}}
  if(cid===id)setBg(q('.avatar',card))
 });
 qa('#cs56Top img,.cs56-child-pill img').forEach(img=>{try{const c=stateChild(id);if(c&&String(selected||'')===id){img.src=src;img.alt=''}}catch(e){}})
}
function addPhotoEdit(){
 if(!isChild())return;
 const id=childId();if(!['bernardo','julia'].includes(id))return;
 const card=q('#people .person.selected')||q('#people .person');const avatar=q('.avatar',card);if(!avatar)return;
 if(!q('.cs62-photo-edit',avatar)){const s=document.createElement('span');s.className='cs62-photo-edit';s.textContent='✎';avatar.appendChild(s)}
 if(avatar.dataset.cs62PhotoPicker!=='1'){
  avatar.dataset.cs62PhotoPicker='1';avatar.setAttribute('role','button');avatar.setAttribute('tabindex','0');avatar.setAttribute('aria-label','Alterar foto de perfil');
  const open=()=>openPhotoPicker();avatar.addEventListener('click',open);avatar.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})
 }
}
async function resizeWebPhoto(file){
 return await new Promise((resolve,reject)=>{
  const fr=new FileReader();fr.onerror=reject;fr.onload=()=>{
   const im=new Image();im.onerror=reject;im.onload=()=>{
    const max=512,ratio=Math.min(1,max/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*ratio)),h=Math.max(1,Math.round(im.height*ratio));
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d');ctx.drawImage(im,0,0,w,h);resolve(cv.toDataURL('image/jpeg',.82))
   };im.src=String(fr.result||'')
  };fr.readAsDataURL(file)
 })
}
function openPhotoPicker(){
 const b=bridge();
 try{if(typeof b?.chooseProfilePhoto==='function'){b.chooseProfilePhoto();return}}catch(e){}
 const input=document.createElement('input');input.type='file';input.accept='image/*';input.style.display='none';document.body.appendChild(input);
 input.onchange=async()=>{try{const f=input.files?.[0];if(f){const data=await resizeWebPhoto(f);await receiveSelectedPhoto(data)}}catch(e){toast('Não foi possível abrir essa foto.')}finally{input.remove()}};input.click()
}
async function receiveSelectedPhoto(dataUrl){
 const id=childId(),token=deviceToken();if(!['bernardo','julia'].includes(id)||!token||!String(dataUrl).startsWith('data:image/'))return;
 if(photoBusy)return;photoBusy=true;applyPhoto(id,dataUrl);toast('Salvando sua foto...');
 try{
  const ok=await rpc('casasegura_set_profile_photo_token',{p_token:token,p_photo_data:dataUrl});
  if(ok!==true)throw new Error('save');
  toast('Foto atualizada. Ela também aparecerá para os pais.')
 }catch(e){toast('A foto apareceu neste aparelho, mas não foi possível sincronizar agora.')}
 finally{photoBusy=false}
}
window.__CasaSeguraProfilePhotoSelected=data=>{receiveSelectedPhoto(String(data||''))};
async function syncChildPhoto(){
 const token=deviceToken(),id=childId();if(!isChild()||!token||!['bernardo','julia'].includes(id))return;
 try{const rows=await rpc('casasegura_get_profile_photo_token',{p_token:token});const row=Array.isArray(rows)?rows[0]:rows;if(row?.photo_data)applyPhoto(id,row.photo_data)}catch(e){}
}
async function syncParentPhotos(){
 const code=familyCode();if(!isParent()||!code)return;
 try{const rows=await rpc('casasegura_get_profile_photos',{p_code:code});if(!Array.isArray(rows))return;for(const row of rows)if(row?.child_id&&row?.photo_data)applyPhoto(String(row.child_id),String(row.photo_data))}catch(e){}
}

/* ---------- tempo de aplicativos no aparelho do filho ---------- */
function ensureUsageCard(){
 let card=q('#cs62ChildUsage');
 if(!isChild()){card?.remove();return null}
 const people=q('#people');if(!people)return null;
 if(!card){
  card=document.createElement('section');card.id='cs62ChildUsage';
  card.innerHTML='<div class="cs62-usage-head"><div><div class="cs62-usage-kicker">TEMPO DE APLICATIVOS</div><div class="cs62-usage-title">Uso de hoje</div></div><div class="cs62-usage-total">Carregando...</div></div><div class="cs62-usage-list"><div class="cs62-usage-empty">Carregando os aplicativos usados hoje...</div></div>';
  people.insertAdjacentElement('afterend',card)
 }
 return card
}
function nativeIcon(pkg){
 if(!pkg)return '';
 if(iconCache.has(pkg))return iconCache.get(pkg)||'';
 let src='';try{src=String(bridge()?.getAppIconDataUrl?.(pkg)||'')}catch(e){}
 iconCache.set(pkg,src);return src
}
async function usageData(){
 const b=bridge();
 try{
  if(typeof b?.getLocalUsageJson==='function'){
   const raw=String(b.getLocalUsageJson()||'');const j=JSON.parse(raw||'{}');
   return {status:String(j.status||'unknown'),usage:j.usage||{},local:true}
  }
 }catch(e){}
 const token=deviceToken();if(!token)return {status:'unknown',usage:{},local:false};
 try{const rows=await rpc('casasegura_get_app_usage_token',{p_token:token});const row=Array.isArray(rows)?rows[0]:rows;return {status:String(row?.usage_status||'unknown'),usage:row?.usage_summary||{},local:false}}
 catch(e){return {status:'error',usage:{},local:false}}
}
async function renderUsage(){
 const card=ensureUsageCard();if(!card||usageBusy)return;usageBusy=true;
 try{
  const result=await usageData();if(!card.isConnected)return;
  const usage=result.usage&&typeof result.usage==='object'?result.usage:{};const apps=Array.isArray(usage.apps)?usage.apps:[];const total=Number(usage.totalMs)||0;
  const totalEl=q('.cs62-usage-total',card),list=q('.cs62-usage-list',card);if(totalEl)totalEl.textContent=fmt(total);
  if(result.status==='permission_required'){
   list.innerHTML='<div class="cs62-usage-empty">Para mostrar o tempo usado em cada aplicativo, ative o Acesso ao uso do CasaSegura.<br><br><button class="cs62-usage-enable" type="button">Ativar acesso</button></div>';
   q('.cs62-usage-enable',list)?.addEventListener('click',()=>{try{bridge()?.openUsageAccessSettings?.()}catch(e){}});return
  }
  if(!apps.length){list.innerHTML='<div class="cs62-usage-empty">Ainda não há uso de aplicativos registrado hoje. Os dados aparecem aqui conforme o aparelho for utilizado.</div>';return}
  const max=Math.max(1,...apps.map(a=>Number(a.ms)||0));
  list.innerHTML=apps.map(a=>{
   const pkg=String(a.package||''),name=String(a.name||pkg||'Aplicativo'),ms=Number(a.ms)||0,p=Math.max(3,Math.round(ms/max*100)),icon=nativeIcon(pkg);
   const visual=icon?`<img src="${esc(icon)}" alt="">`:`<span>${esc(appGlyph(name,pkg))}</span>`;
   return `<div class="cs62-app-row"><div class="cs62-app-icon">${visual}</div><div class="cs62-app-copy"><div class="cs62-app-name">${esc(name)}</div><div class="cs62-app-bar"><i style="width:${p}%"></i></div></div><div class="cs62-app-time">${esc(fmt(ms))}</div></div>`
  }).join('')
 }finally{usageBusy=false}
}

/* ---------- correção estrutural do painel dos pais ---------- */
function normalizeParentFlow(){
 if(!isParent())return;
 const app=q('.app');if(!app)return;
 app.style.setProperty('display','flex','important');app.style.setProperty('flex-direction','column','important');app.style.setProperty('gap','6px','important');app.style.setProperty('height','100dvh','important');app.style.setProperty('min-height','100dvh','important');app.style.setProperty('max-height','100dvh','important');app.style.setProperty('overflow','hidden','important');
 const gap=q('#ctProfileGap47');if(gap)gap.style.setProperty('display','none','important');
 const sw=q('#switchUserBtn');if(sw)sw.style.setProperty('display','none','important');
 for(const el of [q('.top'),q('#ctDeviceControl44'),q('#ctScreenTime55'),q('#v15Switcher'),q('#people'),q('.actions')]){
  if(!el)continue;el.style.setProperty('position','relative','important');el.style.setProperty('top','auto','important');el.style.setProperty('bottom','auto','important');el.style.setProperty('left','auto','important');el.style.setProperty('right','auto','important');el.style.setProperty('transform','none','important');el.style.setProperty('margin-top','0','important');el.style.setProperty('margin-bottom','0','important')
 }
}

/* reforça geometria circular caso módulos antigos tentem alterá-la inline */
function normalizeChildGeometry(){
 if(!isChild())return;
 const card=q('#people .person.selected')||q('#people .person');if(!card)return;
 const avatar=q('.avatar',card);if(avatar){for(const p of ['border-radius','aspect-ratio','transform','scale'])avatar.style.removeProperty(p);avatar.style.setProperty('border-radius','50%','important');avatar.style.setProperty('aspect-ratio','1 / 1','important');avatar.style.setProperty('transform','none','important')}
 const ring=q('.ring',card);if(ring){ring.style.setProperty('border-radius','50%','important');ring.style.setProperty('aspect-ratio','1 / 1','important');ring.style.setProperty('transform','none','important');ring.style.setProperty('scale','1','important')}
}

function decorate(){
 ensureSideTabs();normalizeParentFlow();normalizeChildGeometry();addPhotoEdit();ensureUsageCard();
 if(isChild())renderUsage();
}
function schedule(ms=35){clearTimeout(decorateTimer);decorateTimer=setTimeout(decorate,ms)}

const obs=new MutationObserver(muts=>{if(muts.some(m=>m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length)))schedule(40)});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('pageshow',()=>schedule(10));window.addEventListener('focus',()=>{schedule(15);syncChildPhoto();syncParentPhotos();renderUsage()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){schedule(20);syncChildPhoto();syncParentPhotos();renderUsage()}});
window.addEventListener('resize',()=>schedule(50));

setTimeout(()=>{decorate();syncChildPhoto();syncParentPhotos()},0);
setTimeout(()=>{decorate();syncChildPhoto();syncParentPhotos();renderUsage()},500);
setTimeout(()=>{decorate();syncChildPhoto();syncParentPhotos();renderUsage()},1500);
setInterval(()=>{if(document.hidden)return;decorate();renderUsage()},30000);
photoSyncTimer=setInterval(()=>{if(document.hidden)return;if(isChild())syncChildPhoto();else if(isParent())syncParentPhotos()},10000);
})();
