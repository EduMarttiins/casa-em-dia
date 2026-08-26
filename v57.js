(()=>{
'use strict';
if(window.__CASASEGURA_57__)return;
window.__CASASEGURA_57__=true;

const P={
 family:new URL('./media21/family.jpg?v=57',location.href).href,
 bernardo:new URL('./media21/bernardo.jpg?v=57',location.href).href,
 julia:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAwADADASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAABgQFAwIH/8QALhAAAgEDAgQEBQUBAAAAAAAAAQIDAAQRBSESMUFRBhMiYUJScYGRIzJiseHR/8QAFwEBAQEBAAAAAAAAAAAAAAAAAwECBP/EABsRAAMBAQEBAQAAAAAAAAAAAAABAhEhEjFB/9oADAMBAAIRAxEAPwDYhh0fRSA7pJMPiI4m/wAqhvEmlspSTzOA88x7Ggt/dmJuCP1Stvk9Pes42stw2ZGeRj3O1E7OvylxDC90/RNRZn0y+jgmO/lOcKf+UcureW2l4Jl4T0PMEdweorQ0Dw3avmeVONk+XkD/AEarvrCEQYGPJJ9LoNgfp0NT2g6gONU7jByKtu7Z7dsNup5EcjUMrY2xk1v6EW20RmcytuXOaRabYCUcCj1HrRqCV7fYgkqSoH8geVUDWbmyvE4JFLjdlB5Ciw6tWG75eoQaktssZSyBwSMgn70qh0+2mt2XywpYYO3P6jrXLR9Qj1K2WXChsb5qq3lyeJSDH0OMZrJcwH39kbSeS2mUmLmAe3cHtR+8sGgYlRlOhp/4mMT6cbk4JgIbiHYnBo3MqoF4jmKQZRuYqzWB1KZl62LKDUpmjmLJKQWReh+Ye9RwW6rOyyMrlhxI45MO9YkshZiScmu9tckqInyVzlcHBU+xpKQc33oktri6sMtBKVTP5FIrbWheBl4mESnDEnc+21B5Lu5tYw7p58HzrsR9RXmy1mNJv0o2Uk8jWM/Rla0+ja/6vDd0FHCGQAD7ihmm3ZNrJZ3BOE3U9QP85/nvW4J7jULVVY5Qj9oNYtxZNb8c5wpi55+IVkrW9P/Z'
};

let photoTimer=0;
let versionTimer=0;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function profileId(){
 try{const b=bridge();const id=String(b?.getDeviceProfile?.()||'').toLowerCase();if(id)return id}catch(e){}
 try{if(isChild())return String(sessionRole||'').toLowerCase()}catch(e){}
 return '';
}
function nativeVersion(){
 try{const v=String(bridge()?.getNativeVersion?.()||'').trim();if(v)return v}catch(e){}
 const m=navigator.userAgent.match(/Casa(?:Toda|Segura)Android\/([0-9.]+)/i);
 return m?m[1]:'não identificada';
}
function interfaceVersion(){return String(window.__CASATODA_LOADED_VERSION||'57')}
function profileName(id){if(id==='irmaos')return 'Irmãos';try{return state.children?.find(c=>c.id===id)?.name||(id==='julia'?'Júlia':id==='bernardo'?'Bernardo':'Não definido')}catch(e){return id||'Não definido'}}
function protection(){try{return bridge()?.getProtectionEnabled?.()?'Ativa':'Desativada'}catch(e){return 'Não identificada'}}

function stylePhoto(img){
 img.loading='eager';
 img.decoding='async';
 img.style.width='100%';
 img.style.height='100%';
 img.style.objectFit='cover';
 img.style.objectPosition='center 28%';
 img.style.display='block';
 img.style.opacity='1';
 img.style.visibility='visible';
}
function sameSource(img,src,key){
 if(!img)return false;
 if(img.dataset.csStablePhoto===key)return true;
 if(src.startsWith('data:'))return (img.getAttribute('src')||'')===src;
 try{return img.src===new URL(src,location.href).href}catch(e){return false}
}
function put(sel,src,alt,key){
 const c=document.querySelector(sel);if(!c||!src)return;
 const current=c.querySelector(':scope > img');
 if(sameSource(current,src,key)){
  current.dataset.csStablePhoto=key;
  stylePhoto(current);
  return;
 }
 const next=new Image();
 next.alt=alt;
 next.dataset.csStablePhoto=key;
 stylePhoto(next);
 next.style.opacity='0';
 let swapped=false;
 const swap=()=>{
  if(swapped||!c.isConnected||!next.naturalWidth)return;
  swapped=true;
  next.style.opacity='1';
  c.replaceChildren(next);
 };
 next.onload=swap;
 next.onerror=()=>{if(current){stylePhoto(current);current.style.opacity='1'}};
 next.src=src;
 if(next.complete)swap();
}
function seedState(){
 try{
  if(typeof state!=='object'||!state)return;
  state.settings=state.settings||{};
  let changed=false;
  if(state.settings.parentPhoto!==P.family){state.settings.parentPhoto=P.family;changed=true}
  const b=state.children?.find(x=>x.id==='bernardo'),j=state.children?.find(x=>x.id==='julia');
  if(b&&b.photo!==P.bernardo){b.photo=P.bernardo;changed=true}
  if(j&&j.photo!==P.julia){j.photo=P.julia;changed=true}
  if(state.settings.casaTodaMediaVersion!==57){state.settings.casaTodaMediaVersion=57;changed=true}
  if(changed&&typeof save==='function')save();
 }catch(e){}
}
function applyPhotos(){
 seedState();
 put('#authGate [data-login-role="parent"] .profile-photo',P.family,'Família','family57');
 put('#authGate [data-login-role="bernardo"] .profile-photo',P.bernardo,'Bernardo','bernardo57');
 put('#authGate [data-login-role="julia"] .profile-photo',P.julia,'Júlia','julia57');
 put('[data-v15-child="bernardo"] .v15-tab-avatar',P.bernardo,'Bernardo','bernardo57');
 put('[data-v15-child="julia"] .v15-tab-avatar',P.julia,'Júlia','julia57');
 document.querySelectorAll('#people .person').forEach(card=>{
  let id=String(card.dataset.person||'').toLowerCase();
  try{if(!id)id=isChild()?String(sessionRole||'').toLowerCase():String(selected||'').toLowerCase()}catch(e){}
  const avatar=card.querySelector('.avatar');
  if(!avatar)return;
  if(id==='bernardo')putAvatar(avatar,P.bernardo,'Bernardo','bernardo57');
  if(id==='julia')putAvatar(avatar,P.julia,'Júlia','julia57');
 });
}
function putAvatar(c,src,alt,key){
 const current=c.querySelector(':scope > img');
 if(sameSource(current,src,key)){current.dataset.csStablePhoto=key;stylePhoto(current);return}
 const next=new Image();next.alt=alt;next.dataset.csStablePhoto=key;stylePhoto(next);next.style.opacity='0';let swapped=false;
 const swap=()=>{if(swapped||!c.isConnected||!next.naturalWidth)return;swapped=true;next.style.opacity='1';c.replaceChildren(next)};
 next.onload=swap;next.onerror=()=>{if(current)stylePhoto(current)};next.src=src;if(next.complete)swap();
}

function ensureVersionStyle(){
 if(document.getElementById('cs57Style'))return;
 const s=document.createElement('style');s.id='cs57Style';s.textContent=`
 .cs57-version-btn{border:1px solid rgba(120,120,140,.18);background:rgba(255,255,255,.92);color:#4d4858;border-radius:12px;min-height:36px;padding:0 10px;font:850 10px system-ui;white-space:nowrap;box-shadow:0 5px 14px rgba(20,18,40,.06)}
 #authGate .cs57-version-auth{width:100%;margin-top:10px;min-height:42px;border-radius:13px;background:#f2eff8;color:#5f5770;border:0;font:850 11px system-ui}
 #ctSiblingHome43 .cs57-version-sibling{width:100%;margin-top:10px;min-height:42px;border-radius:13px;background:#f2eff8;color:#5f5770;border:0;font:850 11px system-ui}
 .cs57-modal{position:fixed;inset:0;z-index:100080;background:rgba(18,15,31,.68);display:grid;place-items:center;padding:18px;font-family:system-ui}
 .cs57-modal-card{width:min(390px,100%);box-sizing:border-box;background:#fff;color:#282332;border-radius:25px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.28)}
 .cs57-version-row{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px solid #eeeaf3;font-size:12px}.cs57-version-row span{color:#7c7588}.cs57-version-row b{text-align:right}
 `;document.head.appendChild(s);
}
function openVersion(){
 document.querySelector('.cs57-modal')?.remove();
 const id=profileId(),v=nativeVersion(),ui=interfaceVersion();
 const w=document.createElement('div');w.className='cs57-modal';w.innerHTML=`<section class="cs57-modal-card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><div style="font-size:9px;letter-spacing:.13em;color:#82798f;font-weight:900">CASASEGURA</div><h2 style="margin:4px 0 2px;font-size:23px">Sobre este aparelho</h2><div style="font-size:11px;color:#827c8b">Informações para conferir as atualizações</div></div><button id="cs57Close" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f1eef6;font-size:20px">×</button></div><div style="margin-top:14px"><div class="cs57-version-row"><span>Aplicativo dos filhos</span><b>CasaSegura</b></div><div class="cs57-version-row"><span>Versão do APK</span><b>${escapeHtml(v)}</b></div><div class="cs57-version-row"><span>Interface</span><b>V${escapeHtml(ui)}</b></div><div class="cs57-version-row"><span>Perfil deste aparelho</span><b>${escapeHtml(profileName(id))}</b></div><div class="cs57-version-row"><span>Proteção</span><b>${escapeHtml(protection())}</b></div></div><div style="margin-top:14px;padding:11px 12px;border-radius:14px;background:#f5f2fa;color:#756e80;font-size:10px;line-height:1.45">A interface pode atualizar automaticamente. Quando um recurso depende de uma versão nova do Android, a versão do APK também muda.</div></section>`;
 w.onclick=e=>{if(e.target===w)w.remove()};w.querySelector('#cs57Close').onclick=()=>w.remove();document.body.appendChild(w);
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function ensureVersionButton(){
 ensureVersionStyle();
 const b=bridge();
 if(!b){document.querySelectorAll('.cs57-version-btn,.cs57-version-auth,.cs57-version-sibling').forEach(x=>x.remove());return}
 const v=nativeVersion();
 const auth=document.querySelector('#authGate .auth-card');
 if(auth){let x=auth.querySelector('.cs57-version-auth');if(!x){x=document.createElement('button');x.type='button';x.className='cs57-version-auth';x.onclick=openVersion;auth.appendChild(x)}x.textContent=`CasaSegura Filhos • versão ${v}`}
 if(isChild()){
  const top=document.querySelector('.top-actions');
  if(top){let x=top.querySelector('.cs57-version-btn');if(!x){x=document.createElement('button');x.type='button';x.className='cs57-version-btn';x.onclick=openVersion;top.appendChild(x)}x.textContent=`v${v}`;x.title='Ver versão do CasaSegura'}
 }
 const sibling=document.getElementById('ctSiblingHome43');
 if(sibling){let x=sibling.querySelector('.cs57-version-sibling');if(!x){x=document.createElement('button');x.type='button';x.className='cs57-version-sibling';x.onclick=openVersion;sibling.appendChild(x)}x.textContent=`CasaSegura • versão ${v}`}
}

function schedulePhotos(){clearTimeout(photoTimer);photoTimer=setTimeout(applyPhotos,90)}
function scheduleVersion(){clearTimeout(versionTimer);versionTimer=setTimeout(ensureVersionButton,100)}
const obs=new MutationObserver(()=>{schedulePhotos();scheduleVersion()});
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('pageshow',()=>{applyPhotos();ensureVersionButton()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){applyPhotos();ensureVersionButton()}});
setTimeout(()=>{applyPhotos();ensureVersionButton()},0);
setTimeout(()=>{applyPhotos();ensureVersionButton()},500);
setTimeout(()=>{applyPhotos();ensureVersionButton()},1500);
})();
