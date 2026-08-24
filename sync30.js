(()=>{
'use strict';
if(window.__CASATODA_SYNC30__)return;
window.__CASATODA_SYNC30__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
const clone=v=>JSON.parse(JSON.stringify(v));
let syncing=false,applying=false,pushTimer=0,lastVersion=0,lastSharedSig='';
const baseSave30=typeof save==='function'?save:null;

function familyCode(){return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}
function setFamilyCode(v){v=String(v||'').trim().toUpperCase();if(v)localStorage.setItem(CODE_KEY,v);else localStorage.removeItem(CODE_KEY);return v}
function captureCode(){try{const u=new URL(location.href),v=u.searchParams.get('family');if(v){setFamilyCode(v);u.searchParams.delete('family');history.replaceState({},'',u.href)}}catch(e){}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function role(){try{if(typeof isParentSession==='function'&&isParentSession())return 'parent';if(typeof isChildSession==='function'&&isChildSession())return sessionRole}catch(e){}return null}
function childById(id){try{return state.children?.find(c=>c.id===id)||null}catch(e){return null}}
function setRoleClass(){const r=role();document.body.classList.toggle('ct-parent-session',r==='parent');document.body.classList.toggle('ct-child-session',r==='bernardo'||r==='julia')}

function status(text,mode=''){
 let chip=document.getElementById('ctSyncChip');
 if(!chip){
  chip=document.createElement('button');chip.id='ctSyncChip';chip.type='button';chip.innerHTML='<span class="dot"></span><span class="txt">Sincronizar</span>';
  chip.onclick=()=>{if(familyCode())syncForRole(true);else askCode()};
  const top=document.querySelector('.top-actions');if(top)top.prepend(chip)
 }
 if(!chip)return;
 chip.className=mode||'';chip.title=text;chip.setAttribute('aria-label',text);
 const t=chip.querySelector('.txt');if(t)t.textContent=text
}
function addConnectButton(){
 const card=document.querySelector('#authGate .auth-card');if(!card)return;
 let b=card.querySelector('.ctSyncConnect'),n=card.querySelector('.ctSyncNote');
 if(familyCode()){if(b)b.remove();if(n)n.remove();return}
 if(!b){b=document.createElement('button');b.type='button';b.className='ctSyncConnect';b.textContent='Conectar este aparelho à família';b.onclick=askCode;card.appendChild(b)}
 if(!n){n=document.createElement('div');n.className='ctSyncNote';n.textContent='Use o mesmo código da família em todos os celulares para manter estrelas, tarefas, horários e prêmios sincronizados.';card.appendChild(n)}
}
function askCode(){const v=prompt('Digite o código da família CasaToda');if(v===null)return;const c=setFamilyCode(v);if(!c)return;status('Conectando','wait');addConnectButton();syncPinsOnly(true)}

function childPins(){const out={};try{for(const c of state.children||[])if(c?.id&&c.pinHash)out[c.id]=c.pinHash}catch(e){}return out}
function exportShared(){
 const s=state||{};
 return {
  version:s.version,
  settings:{dailyMinutes:s.settings?.dailyMinutes||{},defaultPenalty:s.settings?.defaultPenalty||10,maxTimeRewardsPerWeek:s.settings?.maxTimeRewardsPerWeek||2,cashStarsPerReal:s.settings?.cashStarsPerReal||50,cashMinimumStars:s.settings?.cashMinimumStars||250,cutoffMinutes:s.settings?.cutoffMinutes||{}},
  children:(s.children||[]).map(c=>({id:c.id,name:c.name})),childPins:childPins(),
  rules:s.rules||[],tasks:s.tasks||[],rewards:s.rewards||[],days:s.days||{},stars:s.stars||{},redemptions:s.redemptions||[],cashRedemptions:s.cashRedemptions||[],bonusAwards:s.bonusAwards||[],rewardRequests:s.rewardRequests||[]
 }
}
function sharedSig(){try{return JSON.stringify(exportShared())}catch(e){return ''}}
function saveLocalOnly(){try{if(baseSave30)baseSave30()}catch(e){console.warn('CasaToda local save',e)}}

function importShared(remote,{renderNow=true}={}){
 if(!remote||typeof remote!=='object')return;
 applying=true;
 try{
  const localSettings=state.settings||{};
  const keep={parentPinHash:localSettings.parentPinHash,pinCreated:localSettings.pinCreated,parentPhoto:localSettings.parentPhoto,casaTodaMediaVersion:localSettings.casaTodaMediaVersion,premiumTimeMigration:localSettings.premiumTimeMigration};
  state.settings=Object.assign({},state.settings||{},remote.settings||{},keep);
  if(Array.isArray(remote.children))remote.children.forEach(rc=>{const lc=childById(rc.id);if(lc&&rc.name)lc.name=rc.name});
  if(remote.childPins&&typeof remote.childPins==='object')for(const [id,h] of Object.entries(remote.childPins)){const c=childById(id);if(c&&h)c.pinHash=h}
  for(const k of ['rules','tasks','rewards','redemptions','cashRedemptions','bonusAwards','rewardRequests'])if(Array.isArray(remote[k]))state[k]=clone(remote[k]);
  if(remote.days&&typeof remote.days==='object')state.days=clone(remote.days);
  if(remote.stars&&typeof remote.stars==='object')state.stars=clone(remote.stars);
  try{if(typeof normalize==='function')state=normalize(state)}catch(e){}
  saveLocalOnly();lastSharedSig=sharedSig();
  if(renderNow)try{if(typeof render==='function')render()}catch(e){}
 }finally{applying=false}
}

async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});if(!r.ok)throw new Error('sync '+r.status);return await r.json()}
async function fetchRemote(){const c=familyCode();if(!c)return {valid:false};const rows=await rpc('casatoda_get_state',{p_code:c});if(!Array.isArray(rows)||!rows.length)return {valid:false};return {valid:true,row:rows[0]}}
async function saveRemote(next,expected){const rows=await rpc('casatoda_save_state',{p_code:familyCode(),p_state:next,p_expected_version:expected});return Array.isArray(rows)?rows[0]:null}

function ensurePathDay(out,date,id){out.days=out.days&&typeof out.days==='object'?out.days:{};out.days[date]=out.days[date]&&typeof out.days[date]==='object'?out.days[date]:{children:{}};out.days[date].children=out.days[date].children&&typeof out.days[date].children==='object'?out.days[date].children:{};out.days[date].children[id]=out.days[date].children[id]&&typeof out.days[date].children[id]==='object'?out.days[date].children[id]:{lost:0,gained:0,events:[],tasks:{}};out.days[date].children[id].tasks=out.days[date].children[id].tasks&&typeof out.days[date].children[id].tasks==='object'?out.days[date].children[id].tasks:{};return out.days[date].children[id]}
function mergeParent(local,remote){
 const out=clone(local);if(!remote||typeof remote!=='object')return out;
 if(remote.childPins&&typeof remote.childPins==='object'){out.childPins=out.childPins||{};for(const [id,h] of Object.entries(remote.childPins))if(!out.childPins[id]&&h)out.childPins[id]=h}
 const localReq=new Map((out.rewardRequests||[]).map(x=>[x.id,x]));
 for(const rr of remote.rewardRequests||[]){if(!rr?.id)continue;const lr=localReq.get(rr.id);if(!lr){out.rewardRequests.push(clone(rr));localReq.set(rr.id,out.rewardRequests[out.rewardRequests.length-1])}else if(lr.status==='pending'&&rr.status&&rr.status!=='pending')Object.assign(lr,clone(rr))}
 for(const [date,d] of Object.entries(remote.days||{}))for(const [id,rc] of Object.entries(d?.children||{}))for(const [tid,st] of Object.entries(rc?.tasks||{}))if(st==='requested'){const lc=ensurePathDay(out,date,id);if(lc.tasks[tid]!=='done')lc.tasks[tid]='requested'}
 return out
}
function mergeChild(remote,local,id){
 const out=clone(remote||{});if(!out||typeof out!=='object')return null;
 out.childPins=out.childPins&&typeof out.childPins==='object'?out.childPins:{};
 const localPin=local.childPins?.[id];if(!out.childPins[id]&&localPin)out.childPins[id]=localPin;
 for(const [date,d] of Object.entries(local.days||{})){
  const localChild=d?.children?.[id];if(!localChild)continue;
  for(const [tid,st] of Object.entries(localChild.tasks||{}))if(st==='requested'){const rc=ensurePathDay(out,date,id);if(rc.tasks[tid]!=='done')rc.tasks[tid]='requested'}
 }
 out.rewardRequests=Array.isArray(out.rewardRequests)?out.rewardRequests:[];
 const remoteReq=new Map(out.rewardRequests.map(x=>[x.id,x]));
 for(const rr of local.rewardRequests||[]){if(rr?.childId!==id||rr?.status!=='pending'||!rr.id)continue;if(!remoteReq.has(rr.id)){out.rewardRequests.push(clone(rr));remoteReq.set(rr.id,out.rewardRequests[out.rewardRequests.length-1])}}
 return out
}

async function syncParent(showMessage=false){
 if(syncing||!familyCode())return;syncing=true;status('Sincronizando','wait');
 try{
  const remote=await fetchRemote();if(!remote.valid)throw new Error('Código inválido');
  const row=remote.row||{};
  if(!row.state||Object.keys(row.state).length===0){syncing=false;return pushParent(true)}
  importShared(row.state);lastVersion=Number(row.version||0);status('Sincronizado','ok')
 }catch(e){status('Offline','err');console.warn('CasaToda parent baseline',e);if(showMessage)alert('Não foi possível sincronizar agora.');return}
 finally{syncing=false}
 await pushParent(true)
}

async function pushParent(force=false){
 if(syncing||!familyCode())return;syncing=true;status('Enviando','wait');
 try{
  for(let attempt=0;attempt<3;attempt++){
   const remote=await fetchRemote();if(!remote.valid)throw new Error('Código inválido');
   const row=remote.row||{},rv=Number(row.version||0),local=exportShared(),next=mergeParent(local,row.state||{});
   const res=await saveRemote(next,rv);
   if(res?.saved){lastVersion=Number(res.version||rv+1);lastSharedSig=JSON.stringify(next);status('Sincronizado','ok');return}
  }
  throw new Error('Conflito de sincronização')
 }catch(e){status('Sem sincronizar','err');console.warn('CasaToda parent sync',e)}finally{syncing=false}
}
async function pushChild(id){
 if(syncing||!familyCode()||!id)return;syncing=true;status('Enviando','wait');
 try{
  for(let attempt=0;attempt<3;attempt++){
   const remote=await fetchRemote();if(!remote.valid)throw new Error('Código inválido');
   const row=remote.row||{},rv=Number(row.version||0);if(!row.state||Object.keys(row.state).length===0){status('Aguardando pais','wait');return}
   const local=exportShared(),next=mergeChild(row.state,local,id);if(!next)return;
   const res=await saveRemote(next,rv);
   if(res?.saved){lastVersion=Number(res.version||rv+1);importShared(next);status('Sincronizado','ok');return}
  }
  throw new Error('Conflito de sincronização')
 }catch(e){status('Sem sincronizar','err');console.warn('CasaToda child sync',e)}finally{syncing=false}
}
async function pullChild(showMessage=false){
 if(syncing||!familyCode())return;syncing=true;status('Sincronizando','wait');
 try{const remote=await fetchRemote();if(!remote.valid)throw new Error('Código inválido');const row=remote.row||{};if(!row.state||Object.keys(row.state).length===0){status('Aguardando pais','wait');if(showMessage)alert('O celular dos pais precisa abrir o CasaToda primeiro.');return}importShared(row.state);lastVersion=Number(row.version||0);status('Sincronizado','ok')}catch(e){status('Offline','err');console.warn('CasaToda pull child',e)}finally{syncing=false}
}
async function pullParentRequests(){
 if(syncing||!familyCode())return;syncing=true;
 try{const remote=await fetchRemote();if(!remote.valid)return;const row=remote.row||{};if(!row.state||Object.keys(row.state).length===0)return;const local=exportShared(),merged=mergeParent(local,row.state);const before=JSON.stringify(local),after=JSON.stringify(merged);lastVersion=Number(row.version||0);if(before!==after){importShared(merged);status('Sincronizado','ok')}}catch(e){console.warn('CasaToda parent pull',e)}finally{syncing=false}
}
async function syncPinsOnly(showMessage=false){
 if(!familyCode())return;status('Conectando','wait');
 try{const remote=await fetchRemote();if(!remote.valid){status('Código inválido','err');if(showMessage)alert('Código da família inválido.');return false}const pins=remote.row?.state?.childPins||{};let changed=false;for(const [id,h] of Object.entries(pins)){const c=childById(id);if(c&&h&&c.pinHash!==h){c.pinHash=h;changed=true}}if(changed)saveLocalOnly();lastVersion=Number(remote.row?.version||0);lastSharedSig=sharedSig();status('Sincronizado','ok');return true}catch(e){status('Offline','err');return false}
}
async function syncForRole(showMessage=false){const r=role();setRoleClass();if(r==='parent')return syncParent(showMessage);if(r==='bernardo'||r==='julia')return pullChild(showMessage);return syncPinsOnly(showMessage)}
function queuePush(){if(applying||!familyCode())return;const sig=sharedSig();if(sig===lastSharedSig)return;lastSharedSig=sig;clearTimeout(pushTimer);pushTimer=setTimeout(()=>{const r=role();if(r==='parent')pushParent();else if(r==='bernardo'||r==='julia')pushChild(r)},450)}

captureCode();
if(baseSave30){save=function(){const x=baseSave30();queuePush();return x}}

const baseEnter30=typeof enterSession==='function'?enterSession:null;
if(baseEnter30){enterSession=function(r){const x=baseEnter30(r);setRoleClass();setTimeout(()=>{if(r==='parent')syncParent(true);else if(r==='bernardo'||r==='julia')pullChild(true)},120);return x}}
const baseGate30=typeof renderProfileGate==='function'?renderProfileGate:null;
if(baseGate30){renderProfileGate=function(){const x=baseGate30();setTimeout(()=>{addConnectButton();syncPinsOnly(false)},0);return x}}

const priorChildPin=typeof openChildPinVerify==='function'?openChildPinVerify:null;
if(priorChildPin){openChildPinVerify=function(id){(async()=>{if(familyCode())await syncPinsOnly(false);priorChildPin(id);setTimeout(()=>addPinHelp(id),0)})()}}
function addPinHelp(id){
 const box=document.querySelector('#pinSheet .pinbox');if(!box)return;let b=document.getElementById('ctPinHelp');if(b)b.remove();
 b=document.createElement('button');b.id='ctPinHelp';b.type='button';b.className='ctPinHelp';b.textContent='Não consigo entrar';
 b.onclick=async()=>{b.disabled=true;b.textContent='Verificando PIN...';try{let remotePin=null;if(familyCode()){const remote=await fetchRemote();remotePin=remote.valid?remote.row?.state?.childPins?.[id]:null}const c=childById(id);if(remotePin){if(c)c.pinHash=remotePin;saveLocalOnly();pinInput='';try{updatePinDisplay()}catch(e){};const hint=document.getElementById('pinHint');if(hint)hint.textContent='O PIN deste perfil foi sincronizado com a família. Digite novamente o PIN configurado pelos pais.';b.textContent='PIN sincronizado'}else{if(c)c.pinHash=null;saveLocalOnly();hide('pinSheet');setTimeout(()=>priorChildPin(id),0)}}catch(e){b.disabled=false;b.textContent='Tentar novamente';toast('Não foi possível verificar o PIN agora.','err')}};
 box.appendChild(b)
}

window.addEventListener('focus',()=>{const r=role();if(r==='parent')pullParentRequests();else if(r==='bernardo'||r==='julia')pullChild(false)});
window.addEventListener('online',()=>syncForRole(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncForRole(false)});
setInterval(()=>{if(document.hidden||!familyCode())return;const r=role();if(r==='parent')pullParentRequests();else if(r==='bernardo'||r==='julia')pullChild(false)},3000);
setTimeout(()=>{setRoleClass();addConnectButton();lastSharedSig=sharedSig();status(familyCode()?'Conectando':'Não conectado',familyCode()?'wait':'');if(familyCode())syncPinsOnly(false)},700);
})();
