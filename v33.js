(()=>{
'use strict';
if(window.__CASATODA_RESET33__)return;
window.__CASATODA_RESET33__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const FAMILY_CODE_KEY='casatoda_family_code';
const APP_STATE_KEY='casa_em_dia_v3';

function $(id){return document.getElementById(id)}
function familyCode(){try{return (localStorage.getItem(FAMILY_CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}
function clone(v){return JSON.parse(JSON.stringify(v))}

function zeroStars(){const out={};try{for(const c of state.children||[])out[c.id]=0}catch(e){}return out}
function resetSharedState(){
 const s=state||{};
 return {
  version:s.version,
  settings:{
   dailyMinutes:clone(s.settings?.dailyMinutes||{}),
   defaultPenalty:Number(s.settings?.defaultPenalty||10),
   maxTimeRewardsPerWeek:Number(s.settings?.maxTimeRewardsPerWeek||2),
   cashStarsPerReal:Number(s.settings?.cashStarsPerReal||50),
   cashMinimumStars:Number(s.settings?.cashMinimumStars||250),
   cutoffMinutes:clone(s.settings?.cutoffMinutes||{})
  },
  children:(s.children||[]).map(c=>({id:c.id,name:c.name})),
  rules:clone(s.rules||[]),
  tasks:clone(s.tasks||[]),
  rewards:clone(s.rewards||[]),
  days:{},
  stars:zeroStars(),
  redemptions:[],
  cashRedemptions:[],
  bonusAwards:[],
  rewardRequests:[]
 }
}
function applyLocalReset(){
 state.days={};
 state.stars=zeroStars();
 state.redemptions=[];
 state.cashRedemptions=[];
 state.bonusAwards=[];
 state.rewardRequests=[];
 try{if(typeof ensureDay==='function')ensureDay()}catch(e){}
 try{localStorage.setItem(APP_STATE_KEY,JSON.stringify(state))}catch(e){}
 try{if(typeof render==='function')render()}catch(e){}
}
async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});
 if(!r.ok)throw new Error('Falha de sincronização '+r.status);
 return await r.json()
}
async function resetRemote(next){
 const code=familyCode();
 if(!code)return {localOnly:true};
 for(let attempt=0;attempt<3;attempt++){
  const rows=await rpc('casatoda_get_state',{p_code:code});
  if(!Array.isArray(rows)||!rows.length)throw new Error('Código da família inválido');
  const version=Number(rows[0]?.version||0);
  const saved=await rpc('casatoda_save_state',{p_code:code,p_state:next,p_expected_version:version});
  const row=Array.isArray(saved)?saved[0]:null;
  if(row?.saved)return {saved:true,version:row.version}
 }
 throw new Error('Os dados mudaram durante o reset. Tente novamente.')
}

function ensureResetUi(){
 const sheet=$('settingsSheet')?.querySelector('.sheet');
 if(sheet&&!$('ctFullResetBtn')){
  const old=$('resetBtn');
  if(old){old.textContent='Zerar somente os registros de hoje';old.classList.add('ctTodayReset')}
  const group=document.createElement('div');
  group.className='settings-group ctDangerZone';
  group.innerHTML=`<div class="ctDangerEy">ZONA DE RISCO</div><h4>Resetar todo o aplicativo</h4><p>Zera todo o progresso da família: estrelas, pontos, cofrinho, histórico, tarefas concluídas, perdas e bônus de tempo, prêmios resgatados e solicitações. Perfis, fotos, PINs e configurações permanecem.</p><button class="ctFullResetBtn" id="ctFullResetBtn" type="button"><span>↻</span> Resetar todo o aplicativo</button>`;
  if(old)old.before(group);else sheet.appendChild(group);
  $('ctFullResetBtn').onclick=()=>{const open=()=>openResetOverlay();try{if(typeof requireParent==='function')requireParent(open);else open()}catch(e){open()}}
 }
 if(!$('ctFullResetOverlay')){
  const wrap=document.createElement('div');
  wrap.id='ctFullResetOverlay';wrap.className='ctResetOverlay';wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML=`<section class="ctResetCard" role="dialog" aria-modal="true" aria-labelledby="ctResetTitle"><div class="ctResetIcon">!</div><div class="ctResetEy">AVISO IMPORTANTE</div><h3 id="ctResetTitle">Esta ação é irreversível</h3><p>Ao continuar, todo o progresso acumulado de Bernardo e Júlia será apagado em todos os aparelhos sincronizados.</p><div class="ctResetList"><div>★ Estrelas e pontos voltam para zero</div><div>✓ Tarefas e histórico são apagados</div><div>◷ Perdas e bônus de tempo são zerados</div><div>◎ Cofrinho, trocas e solicitações são apagados</div></div><div class="ctResetKeep">Perfis, fotos, PINs, regras, rotina e horários configurados serão mantidos.</div><label for="ctResetInput">Para confirmar, digite <strong>RESETAR</strong></label><input id="ctResetInput" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Digite RESETAR"><div class="ctResetActions"><button type="button" class="ctResetCancel" id="ctResetCancel">Cancelar</button><button type="button" class="ctResetConfirm" id="ctResetConfirm" disabled>Resetar definitivamente</button></div></section>`;
  document.body.appendChild(wrap);
  $('ctResetCancel').onclick=closeResetOverlay;
  wrap.addEventListener('click',e=>{if(e.target===wrap)closeResetOverlay()});
  $('ctResetInput').addEventListener('input',()=>{$('ctResetConfirm').disabled=$('ctResetInput').value.trim().toUpperCase()!=='RESETAR'});
  $('ctResetConfirm').onclick=performFullReset;
 }
}
function openResetOverlay(){
 ensureResetUi();
 const o=$('ctFullResetOverlay'),i=$('ctResetInput'),b=$('ctResetConfirm');
 if(!o)return;
 i.value='';b.disabled=true;b.textContent='Resetar definitivamente';
 o.classList.add('show');o.setAttribute('aria-hidden','false');setTimeout(()=>i.focus(),120)
}
function closeResetOverlay(){const o=$('ctFullResetOverlay');if(o){o.classList.remove('show');o.setAttribute('aria-hidden','true')}}
async function performFullReset(){
 const i=$('ctResetInput'),b=$('ctResetConfirm');
 if(!i||i.value.trim().toUpperCase()!=='RESETAR')return;
 b.disabled=true;b.textContent='Resetando...';
 const next=resetSharedState();
 try{
  const result=await resetRemote(next);
  applyLocalReset();
  closeResetOverlay();
  try{if(typeof hide==='function')hide('settingsSheet')}catch(e){}
  if(typeof toast==='function')toast(result.localOnly?'Aplicativo zerado neste aparelho.':'Aplicativo resetado em toda a família.');
  setTimeout(()=>{try{window.dispatchEvent(new Event('focus'))}catch(e){}},500)
 }catch(e){
  console.error('CasaToda reset',e);
  b.disabled=false;b.textContent='Tentar novamente';
  if(typeof toast==='function')toast('Não foi possível concluir o reset. Nenhum dado foi apagado.','err');
  else alert('Não foi possível concluir o reset. Nenhum dado foi apagado.')
 }
}

const observer=new MutationObserver(()=>ensureResetUi());
observer.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(ensureResetUi,0);setTimeout(ensureResetUi,700);
})();