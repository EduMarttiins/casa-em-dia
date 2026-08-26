(()=>{
'use strict';
if(window.__CASASEGURA_58__)return;
window.__CASASEGURA_58__=true;

let timer=0;
function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function deviceProfile(){try{return String(bridge()?.getDeviceProfile?.()||bridge()?.getChildId?.()||'').toLowerCase()}catch(e){return ''}}
function nativeVersion(){
 try{const v=String(bridge()?.getNativeVersion?.()||'').trim();if(v)return v}catch(e){}
 const m=navigator.userAgent.match(/Casa(?:Toda|Segura)Android\/([0-9.]+)/i);
 return m?m[1]:'não identificada';
}
function uiVersion(){return String(window.__CASATODA_LOADED_VERSION||'58')}
function protection(){try{return bridge()?.getProtectionEnabled?.()?'Ativa':'Desativada'}catch(e){return 'Não identificada'}}
function profileName(id){if(id==='irmaos')return 'Irmãos';try{return state.children?.find(c=>c.id===id)?.name||(id==='julia'?'Júlia':id==='bernardo'?'Bernardo':'Não definido')}catch(e){return id||'Não definido'}}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function isChildDevice(){const id=deviceProfile();return !!bridge()&&['bernardo','julia'].includes(id)}

function ensureStyle(){
 if(document.getElementById('cs58Style'))return;
 const s=document.createElement('style');s.id='cs58Style';s.textContent=`
 #cs58VersionStrip{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;width:100%!important;box-sizing:border-box!important;margin:10px 0 12px!important;padding:11px 13px!important;border:1px solid #e8e4ef!important;border-radius:15px!important;background:#fff!important;color:#554e61!important;box-shadow:0 6px 16px rgba(35,30,60,.06)!important;font-family:system-ui!important;text-align:left!important}
 #cs58VersionStrip .cs58-left{display:grid!important;gap:2px!important;min-width:0!important}
 #cs58VersionStrip .cs58-kicker{font-size:8px!important;letter-spacing:.11em!important;font-weight:950!important;color:#9690a0!important;text-transform:uppercase!important}
 #cs58VersionStrip .cs58-main{font-size:11px!important;font-weight:900!important;color:#403a4b!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #cs58VersionStrip .cs58-open{flex:0 0 auto!important;width:30px!important;height:30px!important;border-radius:10px!important;display:grid!important;place-items:center!important;background:#f0ecf8!important;color:#6a4cc8!important;font-size:16px!important;font-weight:950!important}
 .cs58-modal{position:fixed;inset:0;z-index:100090;background:rgba(17,14,29,.72);display:grid;place-items:center;padding:18px;font-family:system-ui}
 .cs58-card{width:min(390px,100%);box-sizing:border-box;background:#fff;color:#282332;border-radius:24px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.30)}
 .cs58-row{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px solid #eeeaf3;font-size:12px}.cs58-row span{color:#7b7486}.cs58-row b{text-align:right;color:#312b3a}
 `;document.head.appendChild(s)
}
function openDetails(){
 document.querySelector('.cs58-modal')?.remove();
 const id=deviceProfile(),v=nativeVersion(),ui=uiVersion();
 const w=document.createElement('div');w.className='cs58-modal';w.innerHTML=`<section class="cs58-card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><div style="font-size:9px;letter-spacing:.13em;color:#82798f;font-weight:900">CASASEGURA</div><h2 style="margin:4px 0 2px;font-size:23px">Versão deste aparelho</h2><div style="font-size:11px;color:#827c8b">Use estas informações para conferir as atualizações</div></div><button id="cs58Close" type="button" style="width:38px;height:38px;border:0;border-radius:12px;background:#f1eef6;font-size:20px">×</button></div><div style="margin-top:14px"><div class="cs58-row"><span>APK instalado</span><b>${esc(v)}</b></div><div class="cs58-row"><span>Interface CasaSegura</span><b>V${esc(ui)}</b></div><div class="cs58-row"><span>Perfil do aparelho</span><b>${esc(profileName(id))}</b></div><div class="cs58-row"><span>Proteção</span><b>${esc(protection())}</b></div></div><div style="margin-top:14px;padding:11px 12px;border-radius:14px;background:#f5f2fa;color:#756e80;font-size:10px;line-height:1.45">A interface atualiza automaticamente pela internet. Uma nova versão do APK precisa ser instalada com autorização do Android.</div></section>`;
 w.onclick=e=>{if(e.target===w)w.remove()};w.querySelector('#cs58Close').onclick=()=>w.remove();document.body.appendChild(w)
}
function placeStrip(){
 ensureStyle();
 let strip=document.getElementById('cs58VersionStrip');
 if(!isChildDevice()){strip?.remove();return}
 const people=document.getElementById('people');const actions=document.querySelector('.actions');const host=people?.parentElement||document.querySelector('.app');if(!host)return;
 if(!strip){strip=document.createElement('button');strip.type='button';strip.id='cs58VersionStrip';strip.onclick=openDetails}
 const v=nativeVersion(),ui=uiVersion();strip.innerHTML=`<span class="cs58-left"><span class="cs58-kicker">VERSÃO INSTALADA</span><span class="cs58-main">APK ${esc(v)} • Interface V${esc(ui)}</span></span><span class="cs58-open">›</span>`;
 if(actions&&actions.parentElement===host){if(strip.nextElementSibling!==actions)host.insertBefore(strip,actions)}else if(people&&people.parentElement===host){if(people.nextElementSibling!==strip)people.insertAdjacentElement('afterend',strip)}else if(strip.parentElement!==host)host.appendChild(strip)
}
function forceFreshCheck(){
 try{window.dispatchEvent(new Event('online'))}catch(e){}
 try{navigator.serviceWorker?.getRegistration?.().then(r=>r?.update?.().catch(()=>{})).catch(()=>{})}catch(e){}
}
function schedule(){clearTimeout(timer);timer=setTimeout(placeStrip,80)}
const obs=new MutationObserver(schedule);obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('pageshow',()=>{placeStrip();forceFreshCheck()});
window.addEventListener('focus',()=>{placeStrip();forceFreshCheck()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){placeStrip();forceFreshCheck()}});
setTimeout(placeStrip,0);setTimeout(placeStrip,500);setTimeout(placeStrip,1600);setInterval(()=>{if(!document.hidden)placeStrip()},5000);
})();