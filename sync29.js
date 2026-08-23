(()=>{
'use strict';
if(window.__CASATODA_SYNC29__)return;
window.__CASATODA_SYNC29__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
let syncing=false,applying=false,lastVersion=0,pushTimer=0;

function code(){return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}
function setCode(v){v=String(v||'').trim().toUpperCase();if(v)localStorage.setItem(CODE_KEY,v);else localStorage.removeItem(CODE_KEY);return v}
function captureCodeFromUrl(){try{const u=new URL(location.href),v=u.searchParams.get('family');if(v){setCode(v);u.searchParams.delete('family');history.replaceState({},'',u.href)}}catch(e){}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function status(text,mode=''){
 let chip=document.getElementById('ctSyncChip');
 if(!chip){
   chip=document.createElement('button');chip.id='ctSyncChip';chip.type='button';chip.innerHTML='<span class="dot"></span><span class="txt">Sincronizar</span>';
   chip.onclick=()=>{if(code())syncNow(true);else askCode()};
   const top=document.querySelector('.top-actions');if(top)top.prepend(chip)
 }
 if(!chip)return;
 chip.className=mode||'';const t=chip.querySelector('.txt');if(t)t.textContent=text;
}
function addConnectButton(){
 const card=document.querySelector('#authGate .auth-card');if(!card)return;
 let b=card.querySelector('.ctSyncConnect');
 if(code()){if(b)b.remove();return}
 if(!b){
  b=document.createElement('button');b.type='button';b.className='ctSyncConnect';b.textContent='Conectar este aparelho à família';b.onclick=askCode;card.appendChild(b);
  const n=document.createElement('div');n.className='ctSyncNote';n.textContent='Use o mesmo código da família em todos os celulares para manter estrelas, tarefas, horários e prêmios sincronizados.';card.appendChild(n)
 }
}
function askCode(){
 const v=prompt('Digite o código da família CasaToda');
 if(v===null)return;
 const c=setCode(v);
 if(!c)return;
 status('Conectando','wait');addConnectButton();syncNow(true)
}
function exportState(){
 const s=state||{};
 return {
  version:s.version,
  settings:{
   dailyMinutes:s.settings?.dailyMinutes||{},defaultPenalty:s.settings?.defaultPenalty||10,
   maxTimeRewardsPerWeek:s.settings?.maxTimeRewardsPerWeek||2,cashStarsPerReal:s.settings?.cashStarsPerReal||50,
   cashMinimumStars:s.settings?.cashMinimumStars||250,cutoffMinutes:s.settings?.cutoffMinutes||{}
  },
  children:(s.children||[]).map(c=>({id:c.id,name:c.name})),
  rules:s.rules||[],tasks:s.tasks||[],rewards:s.rewards||[],days:s.days||{},stars:s.stars||{},
  redemptions:s.redemptions||[],cashRedemptions:s.cashRedemptions||[],bonusAwards:s.bonusAwards||[],rewardRequests:s.rewardRequests||[]
 }
}
function importState(remote){
 if(!remote||typeof remote!=='object')return;
 applying=true;
 try{
  const localSettings=state.settings||{};
  const keep={parentPinHash:localSettings.parentPinHash,pinCreated:localSettings.pinCreated,parentPhoto:localSettings.parentPhoto,casaTodaMediaVersion:localSettings.casaTodaMediaVersion,premiumTimeMigration:localSettings.premiumTimeMigration};
  state.settings=Object.assign({},state.settings||{},remote.settings||{},keep);
  if(Array.isArray(remote.children))remote.children.forEach(rc=>{const lc=state.children?.find(c=>c.id===rc.id);if(lc&&rc.name)lc.name=rc.name});
  for(const k of ['rules','tasks','rewards','redemptions','cashRedemptions','bonusAwards','rewardRequests'])if(Array.isArray(remote[k]))state[k]=JSON.parse(JSON.stringify(remote[k]));
  if(remote.days&&typeof remote.days==='object')state.days=JSON.parse(JSON.stringify(remote.days));
  if(remote.stars&&typeof remote.stars==='object')state.stars=JSON.parse(JSON.stringify(remote.stars));
  try{if(typeof normalize==='function')state=normalize(state)}catch(e){}
  if(typeof baseSave29==='function')baseSave29();
  try{if(typeof render==='function')render()}catch(e){}
 }finally{applying=false}
}
async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});
 if(!r.ok)throw new Error('sync '+r.status);
 return await r.json()
}
async function fetchRemote(){
 const c=code();if(!c)return {valid:false};
 const rows=await rpc('casatoda_get_state',{p_code:c});
 if(!Array.isArray(rows)||!rows.length)return {valid:false};
 return {valid:true,row:rows[0]}
}
async function push(){
 if(syncing||applying||!code())return;
 syncing=true;status('Enviando','wait');
 try{
  const rows=await rpc('casatoda_save_state',{p_code:code(),p_state:exportState(),p_expected_version:null});
  const row=Array.isArray(rows)?rows[0]:null;
  if(!row?.saved)throw new Error('Código inválido');
  lastVersion=Number(row.version||lastVersion);status('Sincronizado','ok')
 }catch(e){status('Sem sincronizar','err');console.warn('CasaToda sync push',e)}finally{syncing=false}
}
function queuePush(){if(!code()||applying)return;clearTimeout(pushTimer);pushTimer=setTimeout(push,500)}
async function syncNow(showMessage=false){
 if(syncing||!code()){if(!code())status('Não conectado');return}
 syncing=true;status('Sincronizando','wait');
 try{
  const remote=await fetchRemote();
  if(!remote.valid){status('Código inválido','err');if(showMessage)alert('Código da família inválido.');return}
  const row=remote.row||{},empty=!row.state||Object.keys(row.state).length===0;
  let parent=false,child=false;try{parent=isParentSession();child=isChildSession()}catch(e){}
  if(empty){
    if(parent){
      syncing=false;await push();return
    }
    lastVersion=Number(row.version||1);status('Aguardando pais','wait');
    if(showMessage&&child)alert('O celular dos pais precisa conectar primeiro para enviar os dados da família.');
    return
  }
  const rv=Number(row.version||0);
  if(rv!==lastVersion||showMessage){importState(row.state);lastVersion=rv}
  status('Sincronizado','ok')
 }catch(e){status('Offline','err');console.warn('CasaToda sync pull',e)}finally{syncing=false}
}

captureCodeFromUrl();
const baseSave29=typeof save==='function'?save:null;
if(baseSave29){save=function(){const r=baseSave29();queuePush();return r}}
const baseEnter29=typeof enterSession==='function'?enterSession:null;
if(baseEnter29){enterSession=function(role){const r=baseEnter29(role);setTimeout(()=>syncNow(true),120);return r}}
const baseGate29=typeof renderProfileGate==='function'?renderProfileGate:null;
if(baseGate29){renderProfileGate=function(){const r=baseGate29();setTimeout(addConnectButton,0);return r}}

window.addEventListener('focus',()=>syncNow(false));
window.addEventListener('online',()=>syncNow(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNow(false)});
setInterval(()=>{if(!document.hidden&&code())syncNow(false)},5000);
setTimeout(()=>{addConnectButton();status(code()?'Conectando':'Não conectado',code()?'wait':'');if(code())syncNow(false)},900);
})();
