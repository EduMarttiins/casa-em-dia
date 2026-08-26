(()=>{
'use strict';
if(window.__CASASEGURA_59__)return;
window.__CASASEGURA_59__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const AUTH_KEY='casasegura_parent_auth_v1';
const CODE_KEY='casatoda_family_code';
const TOKEN_KEY='casasegura_device_token';
const BOUND_KEY='casasegura_bound_child';
let authBusy=false;
let tokenSyncBusy=false;
let tokenPushTimer=0;
let tokenVersion=0;
let applyingTokenState=false;
const baseSave59=typeof save==='function'?save:null;

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function nativeVersion(){try{return String(bridge()?.getNativeVersion?.()||'').trim()}catch(e){return ''}}
function profileId(){
 try{const x=String(bridge()?.getDeviceProfile?.()||bridge()?.getChildId?.()||'').trim().toLowerCase();if(x)return x}catch(e){}
 try{return String(localStorage.getItem(BOUND_KEY)||'').trim().toLowerCase()}catch(e){return ''}
}
function deviceToken(){try{return (localStorage.getItem(TOKEN_KEY)||'').trim()}catch(e){return ''}}
function legacyCode(){
 try{const l=(localStorage.getItem(CODE_KEY)||'').trim();if(l)return l}catch(e){}
 try{return String(bridge()?.getFamilyCode?.()||'').trim()}catch(e){return ''}
}
function isChildRole(id){return id==='bernardo'||id==='julia'}
function childName(id){if(id==='irmaos')return 'Irmãos';try{return state.children?.find(c=>c.id===id)?.name||(id==='julia'?'Júlia':'Bernardo')}catch(e){return id==='julia'?'Júlia':'Bernardo'}}
function semverAtLeast(v,major,minor){const m=String(v||'').match(/^(\d+)\.(\d+)/);if(!m)return false;return Number(m[1])>major||(Number(m[1])===major&&Number(m[2])>=minor)}

function ensureStyle(){
 if(document.getElementById('cs59Style'))return;
 const s=document.createElement('style');s.id='cs59Style';s.textContent=`
 #cs59Gate{position:fixed;inset:0;z-index:200000;display:grid;place-items:center;overflow:auto;padding:max(20px,env(safe-area-inset-top)) 16px max(20px,env(safe-area-inset-bottom));box-sizing:border-box;background:radial-gradient(circle at 8% 0%,rgba(53,123,214,.20),transparent 34%),radial-gradient(circle at 100% 16%,rgba(113,77,216,.15),transparent 30%),#101114;color:#f5f6f8;font-family:system-ui}
 #cs59Gate.hidden{display:none!important}.cs59-card{width:min(440px,100%);box-sizing:border-box;padding:24px;border:1px solid #2a2c33;border-radius:30px;background:#1a1b1f;box-shadow:0 26px 80px rgba(0,0,0,.38)}
 .cs59-brand{display:flex;align-items:center;gap:12px;margin-bottom:22px}.cs59-logo{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(145deg,#277ac2,#7656d7);font-size:25px;font-weight:950}.cs59-brand b{display:block;font-size:21px;letter-spacing:-.03em}.cs59-brand span{display:block;margin-top:2px;color:#9296a0;font-size:11px;font-weight:700}
 .cs59-card h1{margin:0;font-size:29px;line-height:1.04;letter-spacing:-.045em}.cs59-lead{margin:8px 0 20px;color:#9da0aa;font-size:13px;line-height:1.48}
 .cs59-field{display:grid;gap:7px;margin-top:12px}.cs59-field span{font-size:9px;letter-spacing:.1em;color:#8f939e;font-weight:900;text-transform:uppercase}.cs59-field input{width:100%;height:52px;box-sizing:border-box;border:1px solid #34363e;border-radius:15px;background:#222329;color:#fff;padding:0 14px;font:750 15px system-ui;outline:none}.cs59-field input:focus{border-color:#4a93d4;box-shadow:0 0 0 3px rgba(66,145,216,.14)}
 .cs59-primary,.cs59-secondary{width:100%;min-height:50px;margin-top:14px;border:0;border-radius:15px;font:900 13px system-ui}.cs59-primary{background:#3f8bd0;color:#fff}.cs59-secondary{background:#27282e;color:#d8dae0;border:1px solid #363841}.cs59-link{margin-top:14px;border:0;background:transparent;color:#70ace2;font:850 11px system-ui}.cs59-msg{display:none;margin-top:13px;padding:11px 12px;border-radius:13px;background:#27282e;color:#c7c9d0;font-size:11px;line-height:1.4}.cs59-msg.show{display:block}.cs59-msg.err{background:#3a2025;color:#ffbac5}.cs59-msg.ok{background:#173329;color:#a9efd2}
 .cs59-code{font-size:24px!important;letter-spacing:.2em!important;text-align:center!important;font-weight:950!important}.cs59-choice{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}.cs59-choice button{min-height:66px;border:1px solid #34363e;border-radius:15px;background:#222329;color:#e5e6ea;font-weight:900}.cs59-choice button.on{background:#244b70;border-color:#438bd0;color:#fff}
 .cs59-code-show{margin:16px 0 4px;padding:20px;border-radius:20px;background:#23252b;text-align:center}.cs59-code-show b{display:block;font-size:34px;letter-spacing:.14em}.cs59-code-show span{display:block;margin-top:7px;color:#9ca0aa;font-size:10px}
 .cs59-modal{position:fixed;inset:0;z-index:200050;display:grid;place-items:center;overflow:auto;padding:18px;background:rgba(6,7,9,.76);font-family:system-ui}.cs59-modal-card{width:min(430px,100%);box-sizing:border-box;padding:21px;border-radius:26px;background:#1a1b1f;color:#f3f4f6;border:1px solid #2f3138;box-shadow:0 25px 75px rgba(0,0,0,.45)}
 .cs59-modal-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.cs59-modal-top h2{margin:3px 0 0;font-size:23px}.cs59-close{width:38px;height:38px;border:0;border-radius:12px;background:#282a30;color:#fff;font-size:20px}.cs59-account-email{margin-top:4px;color:#999da7;font-size:11px}.cs59-account-action{width:100%;height:48px;margin-top:10px;border:1px solid #34363e;border-radius:14px;background:#24252b;color:#eceef2;font-weight:900}.cs59-account-action.primary{background:#337fc4;border-color:#337fc4}.cs59-account-action.danger{color:#ffb9c1;background:#311f23;border-color:#4a292f}
 #cs59PairRow{width:100%;border:0!important}.cs59-pair-badge{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#203c53;color:#80bde9;font-size:19px}
 @media(max-width:420px){.cs59-card{padding:20px;border-radius:26px}.cs59-card h1{font-size:26px}.cs59-choice{grid-template-columns:1fr}.cs59-choice button{min-height:50px}}
 `;document.head.appendChild(s)
}
function gate(){ensureStyle();let g=document.getElementById('cs59Gate');if(!g){g=document.createElement('div');g.id='cs59Gate';document.body.appendChild(g)}g.classList.remove('hidden');return g}
function hideGate(){document.getElementById('cs59Gate')?.classList.add('hidden')}
function message(text,type=''){const m=document.getElementById('cs59Msg');if(!m)return;m.textContent=text;m.className='cs59-msg show'+(type?' '+type:'')}
function brandHtml(){return `<div class="cs59-brand"><div class="cs59-logo">⌂</div><div><b>CasaSegura</b><span>Proteção e organização da família</span></div></div>`}

function authSession(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch(e){return null}}
function storeAuth(j,email){
 if(!j?.access_token)return null;
 const now=Math.floor(Date.now()/1000),expires=Number(j.expires_in||3600);
 const out={access_token:j.access_token,refresh_token:j.refresh_token||'',expires_at:now+expires-30,email:email||j.user?.email||''};
 localStorage.setItem(AUTH_KEY,JSON.stringify(out));return out
}
function clearAuth(){localStorage.removeItem(AUTH_KEY)}
async function authFetch(path,body,token=''){
 const r=await fetch(SB_URL+path,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+(token||SB_KEY)},body:JSON.stringify(body||{}),cache:'no-store'});
 let j=null;try{j=await r.json()}catch(e){}
 if(!r.ok){const msg=j?.msg||j?.message||j?.error_description||j?.error||('HTTP '+r.status);throw new Error(msg)}
 return j
}
async function authRpc(name,body,token){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+token},body:JSON.stringify(body||{}),cache:'no-store'});
 let j=null;try{j=await r.json()}catch(e){}
 if(!r.ok)throw new Error(j?.message||j?.error||('HTTP '+r.status));return j
}
async function anonRpc(name,body){return authRpc(name,body,SB_KEY)}
async function validAuth(){
 let s=authSession();if(!s)return null;
 const now=Math.floor(Date.now()/1000);
 if(s.access_token&&Number(s.expires_at||0)>now)return s;
 if(!s.refresh_token){clearAuth();return null}
 try{const j=await authFetch('/auth/v1/token?grant_type=refresh_token',{refresh_token:s.refresh_token});return storeAuth(j,s.email)}catch(e){clearAuth();return null}
}

function showParentLogin(mode='login'){
 const g=gate();const signup=mode==='signup';
 g.innerHTML=`<section class="cs59-card">${brandHtml()}<h1>${signup?'Criar conta dos responsáveis':'Entrar como responsável'}</h1><p class="cs59-lead">${signup?'Use seu e mail para criar o acesso administrativo da família.':'Seu painel, seus filhos e seus aparelhos ficam ligados à sua conta.'}</p><label class="cs59-field"><span>E mail</span><input id="cs59Email" type="email" inputmode="email" autocomplete="email" placeholder="seuemail@exemplo.com"></label><label class="cs59-field"><span>Senha</span><input id="cs59Password" type="password" autocomplete="${signup?'new-password':'current-password'}" placeholder="Mínimo de 6 caracteres"></label><button class="cs59-primary" id="cs59AuthSubmit" type="button">${signup?'Criar minha conta':'Entrar'}</button><button class="cs59-link" id="cs59Toggle" type="button">${signup?'Já tenho uma conta':'Criar conta com e mail'}</button><div class="cs59-msg" id="cs59Msg"></div></section>`;
 document.getElementById('cs59Toggle').onclick=()=>showParentLogin(signup?'login':'signup');
 document.getElementById('cs59AuthSubmit').onclick=async()=>{
  if(authBusy)return;const email=document.getElementById('cs59Email').value.trim().toLowerCase(),password=document.getElementById('cs59Password').value;
  if(!email||password.length<6){message('Informe um e mail válido e uma senha com pelo menos 6 caracteres.','err');return}
  authBusy=true;const b=document.getElementById('cs59AuthSubmit');b.disabled=true;b.textContent=signup?'Criando conta...':'Entrando...';
  try{
   const j=signup?await authFetch('/auth/v1/signup',{email,password}):await authFetch('/auth/v1/token?grant_type=password',{email,password});
   const s=storeAuth(j,email);
   if(!s){message('Conta criada. Confira seu e mail para confirmar o cadastro e depois entre no CasaSegura.','ok');return}
   await finishParentLogin(s)
  }catch(e){message(String(e.message||e),'err')}
  finally{authBusy=false;if(b.isConnected){b.disabled=false;b.textContent=signup?'Criar minha conta':'Entrar'}}
 }
}

async function finishParentLogin(session){
 let rows=await authRpc('casasegura_parent_status',{},session.access_token);let st=Array.isArray(rows)?rows[0]:rows;
 if(!st?.linked){
  const old=legacyCode();
  if(old){try{const ok=await authRpc('casasegura_bind_parent',{p_code:old},session.access_token);if(ok===true){rows=await authRpc('casasegura_parent_status',{},session.access_token);st=Array.isArray(rows)?rows[0]:rows}}catch(e){}}
 }
 if(!st?.linked){showParentBind(session);return}
 const issued=await authRpc('casasegura_create_parent_session',{},session.access_token);const row=Array.isArray(issued)?issued[0]:issued;
 if(!row?.token)throw new Error('Não foi possível criar a sessão dos responsáveis.');
 localStorage.setItem(CODE_KEY,String(row.token).toUpperCase());
 try{if(typeof enterSession==='function')enterSession('parent')}catch(e){}
 hideGate();setTimeout(()=>{try{if(typeof render==='function')render()}catch(e){};decorateParent()},100)
}
function showParentBind(session){
 const g=gate();g.innerHTML=`<section class="cs59-card">${brandHtml()}<h1>Conectar sua família</h1><p class="cs59-lead">Esta etapa aparece apenas na migração da conta atual. Digite uma vez o código da família que o CasaSegura já usava.</p><label class="cs59-field"><span>Código atual da família</span><input id="cs59OldCode" type="text" autocomplete="off" autocapitalize="characters" placeholder="Código da família"></label><button class="cs59-primary" id="cs59Bind" type="button">Conectar minha conta</button><div class="cs59-msg" id="cs59Msg"></div></section>`;
 document.getElementById('cs59Bind').onclick=async()=>{const code=document.getElementById('cs59OldCode').value.trim();if(!code){message('Digite o código atual da família.','err');return}try{const ok=await authRpc('casasegura_bind_parent',{p_code:code},session.access_token);if(ok!==true)throw new Error('Código da família não reconhecido.');await finishParentLogin(session)}catch(e){message(String(e.message||e),'err')}}
}

function showChildPairing(){
 const g=gate(),v=nativeVersion();g.innerHTML=`<section class="cs59-card">${brandHtml()}<h1>Vincular este aparelho</h1><p class="cs59-lead">No celular dos pais, abra Conta e escolha Vincular novo aparelho. Digite aqui o código de seis dígitos.</p><label class="cs59-field"><span>Código de vinculação</span><input id="cs59PairCode" class="cs59-code" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000"></label><button class="cs59-primary" id="cs59Pair" type="button">Vincular aparelho</button><div class="cs59-msg" id="cs59Msg"></div>${v?`<div style="margin-top:14px;color:#777b85;font-size:9px;text-align:center">APK ${esc(v)} • Interface V${esc(window.__CASATODA_LOADED_VERSION||'59')}</div>`:''}</section>`;
 const input=document.getElementById('cs59PairCode');input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,6)});
 document.getElementById('cs59Pair').onclick=async()=>{const code=input.value.trim();if(code.length!==6){message('Digite os seis números do código.','err');return}const b=document.getElementById('cs59Pair');b.disabled=true;b.textContent='Vinculando...';try{const rows=await anonRpc('casasegura_consume_device_link',{p_code:code});const row=Array.isArray(rows)?rows[0]:rows;if(!row?.device_token||!row?.child_id)throw new Error('Código inválido ou expirado. Gere um novo código no celular dos pais.');await saveDeviceBinding(row.child_id,row.device_token);message(`Aparelho vinculado a ${childName(row.child_id)}.`,'ok');setTimeout(()=>activateChild(row.child_id),400)}catch(e){message(String(e.message||e),'err');b.disabled=false;b.textContent='Vincular aparelho'}}
}
async function saveDeviceBinding(id,token){
 localStorage.setItem(TOKEN_KEY,String(token));localStorage.setItem(BOUND_KEY,String(id));
 try{bridge()?.setDeviceCredential?.(String(token))}catch(e){}
 try{bridge()?.setDeviceProfile?.(String(id))}catch(e){}
}
async function migrateLegacyDevice(id){
 if(deviceToken())return true;const code=legacyCode();if(!code)return false;
 try{const rows=await anonRpc('casasegura_migrate_legacy_device',{p_code:code,p_child_id:id});const row=Array.isArray(rows)?rows[0]:rows;if(!row?.device_token)return false;await saveDeviceBinding(id,row.device_token);return true}catch(e){return false}
}
function activateChild(id){
 if(id==='irmaos'){hideGate();try{if(typeof showSiblingHome==='function')showSiblingHome();else location.reload()}catch(e){location.reload()}return}
 if(!isChildRole(id)){showChildPairing();return}
 try{if(typeof enterSession==='function')enterSession(id)}catch(e){}
 hideGate();setTimeout(()=>{try{if(typeof render==='function')render()}catch(e){};tokenPull(false)},100)
}

function importTokenState(remote){
 if(!remote||typeof remote!=='object'||typeof state!=='object')return;
 applyingTokenState=true;
 try{
  const id=profileId();state.settings=Object.assign({},state.settings||{},remote.settings||{});
  if(Array.isArray(remote.children)){for(const rc of remote.children){const lc=state.children?.find(c=>c.id===rc.id);if(lc&&rc.name)lc.name=rc.name}}
  if(remote.childPins&&typeof remote.childPins==='object'){const c=state.children?.find(x=>x.id===id);if(c&&remote.childPins[id])c.pinHash=remote.childPins[id]}
  for(const k of ['rules','tasks','rewards','redemptions','cashRedemptions','bonusAwards','rewardRequests'])if(Array.isArray(remote[k]))state[k]=JSON.parse(JSON.stringify(remote[k]));
  if(remote.days&&typeof remote.days==='object')state.days=JSON.parse(JSON.stringify(remote.days));
  if(remote.stars&&typeof remote.stars==='object')state.stars=Object.assign({},state.stars||{},remote.stars);
  try{if(typeof normalize==='function')state=normalize(state)}catch(e){}
  if(baseSave59)baseSave59();
  try{if(typeof render==='function')render()}catch(e){}
 }finally{applyingTokenState=false}
}
async function tokenPull(showError=false){
 const token=deviceToken(),id=profileId();if(!token||!isChildRole(id)||tokenSyncBusy)return;tokenSyncBusy=true;
 try{const rows=await anonRpc('casasegura_child_get_state',{p_token:token});const row=Array.isArray(rows)?rows[0]:rows;if(!row?.state)throw new Error('Sessão do aparelho inválida.');tokenVersion=Number(row.version||0);importTokenState(row.state)}catch(e){if(showError)console.warn('CasaSegura child pull',e)}finally{tokenSyncBusy=false}
}
async function tokenPush(){
 const token=deviceToken(),id=profileId();if(!token||!isChildRole(id)||tokenSyncBusy||applyingTokenState)return;tokenSyncBusy=true;
 try{const payload={settings:state.settings||{},children:state.children||[],childPins:Object.fromEntries((state.children||[]).filter(c=>c.id===id&&c.pinHash).map(c=>[c.id,c.pinHash])),rules:state.rules||[],tasks:state.tasks||[],rewards:state.rewards||[],days:state.days||{},stars:state.stars||{},redemptions:state.redemptions||[],cashRedemptions:state.cashRedemptions||[],bonusAwards:state.bonusAwards||[],rewardRequests:state.rewardRequests||[]};const rows=await anonRpc('casasegura_child_save_state',{p_token:token,p_state:payload,p_expected_version:tokenVersion||null});const row=Array.isArray(rows)?rows[0]:rows;if(row?.saved){tokenVersion=Number(row.version||tokenVersion+1)}else await tokenPull(false)}catch(e){console.warn('CasaSegura child push',e)}finally{tokenSyncBusy=false}}
function queueTokenPush(){if(applyingTokenState||!deviceToken()||!isChildRole(profileId()))return;clearTimeout(tokenPushTimer);tokenPushTimer=setTimeout(tokenPush,550)}
if(baseSave59){save=function(){const x=baseSave59();queueTokenPush();return x}}

function openAccount(){
 const old=document.querySelector('.cs59-modal');old?.remove();const s=authSession();const w=document.createElement('div');w.className='cs59-modal';w.innerHTML=`<section class="cs59-modal-card"><div class="cs59-modal-top"><div><div style="font-size:9px;letter-spacing:.12em;color:#808590;font-weight:900">CASASEGURA</div><h2>Conta da família</h2><div class="cs59-account-email">${esc(s?.email||'Responsável conectado')}</div></div><button class="cs59-close" type="button">×</button></div><button class="cs59-account-action primary" id="cs59NewDevice" type="button">Vincular novo aparelho</button><button class="cs59-account-action" id="cs59RefreshAccount" type="button">Sincronizar agora</button><button class="cs59-account-action danger" id="cs59Logout" type="button">Sair da conta</button></section>`;w.querySelector('.cs59-close').onclick=()=>w.remove();w.onclick=e=>{if(e.target===w)w.remove()};w.querySelector('#cs59NewDevice').onclick=()=>{w.remove();openPairCreator()};w.querySelector('#cs59RefreshAccount').onclick=()=>{w.remove();window.dispatchEvent(new Event('online'))};w.querySelector('#cs59Logout').onclick=()=>{clearAuth();localStorage.removeItem(CODE_KEY);w.remove();try{if(typeof exitSession==='function')exitSession()}catch(e){}showParentLogin('login')};document.body.appendChild(w)
}
async function openPairCreator(){
 const s=await validAuth();if(!s){showParentLogin('login');return}
 const w=document.createElement('div');w.className='cs59-modal';w.innerHTML=`<section class="cs59-modal-card"><div class="cs59-modal-top"><div><div style="font-size:9px;letter-spacing:.12em;color:#808590;font-weight:900">VINCULAR APARELHO</div><h2>Quem vai usar?</h2><div class="cs59-account-email">O código expira em 15 minutos e funciona uma única vez.</div></div><button class="cs59-close" type="button">×</button></div><div class="cs59-choice"><button type="button" data-child="bernardo">Bernardo</button><button type="button" data-child="julia">Júlia</button><button type="button" data-child="irmaos">Irmãos</button></div><div id="cs59Generated"></div></section>`;w.querySelector('.cs59-close').onclick=()=>w.remove();w.onclick=e=>{if(e.target===w)w.remove()};w.querySelectorAll('[data-child]').forEach(b=>b.onclick=async()=>{w.querySelectorAll('[data-child]').forEach(x=>x.classList.toggle('on',x===b));const box=w.querySelector('#cs59Generated');box.innerHTML='<div style="padding:14px;text-align:center;color:#9ba0aa;font-size:11px">Gerando código...</div>';try{const rows=await authRpc('casasegura_create_device_link',{p_child_id:b.dataset.child},s.access_token);const row=Array.isArray(rows)?rows[0]:rows;if(!row?.code)throw new Error('Não foi possível gerar o código.');box.innerHTML=`<div class="cs59-code-show"><b>${esc(row.code)}</b><span>Digite este código no aparelho de ${esc(childName(b.dataset.child))}</span></div>`}catch(e){box.innerHTML=`<div class="cs59-msg show err">${esc(e.message||e)}</div>`}});document.body.appendChild(w)
}
function decorateParent(){
 if(bridge())return;
 const p=document.getElementById('cs56Parent');if(p&&!p.dataset.cs59){p.dataset.cs59='1';p.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openAccount()},true)}
 const content=document.getElementById('cs56Content');if(content&&!document.getElementById('cs59PairRow')){const card=content.querySelector('.cs56-control-card');if(card){const b=document.createElement('button');b.type='button';b.id='cs59PairRow';b.className='cs56-control-row';b.innerHTML='<span class="cs59-pair-badge">＋</span><span><b>Vincular novo aparelho</b><span>Gerar código para Bernardo, Júlia ou Irmãos</span></span><span class="cs56-control-arrow">›</span>';b.onclick=openPairCreator;card.appendChild(b)}}
}

async function boot(){
 ensureStyle();
 const b=bridge();
 if(b){
  let id=profileId();
  if(id){localStorage.setItem(BOUND_KEY,id);await migrateLegacyDevice(id);activateChild(id);return}
  showChildPairing();return
 }
 const s=await validAuth();if(!s){showParentLogin('login');return}
 try{await finishParentLogin(s)}catch(e){showParentLogin('login');message('Sua sessão expirou. Entre novamente.','err')}
}

const obs=new MutationObserver(()=>{decorateParent()});obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('focus',()=>{decorateParent();if(deviceToken())tokenPull(false)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){decorateParent();if(deviceToken())tokenPull(false)}});
setInterval(()=>{if(document.hidden)return;if(deviceToken()&&isChildRole(profileId()))tokenPull(false)},5000);
setTimeout(boot,40);setTimeout(decorateParent,800);
})();
