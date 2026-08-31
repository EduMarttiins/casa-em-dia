(()=>{
'use strict';
if(window.__CASASEGURA_66__)return;
window.__CASASEGURA_66__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
let timer=0;
let busy=false;

function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function activeChild(){try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}return 'bernardo'}
function childName(id){try{return state?.children?.find(c=>c.id===id)?.name||(id==='julia'?'Júlia':'Bernardo')}catch(e){return id==='julia'?'Júlia':'Bernardo'}}
function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function nonce(){return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toast(msg,type=''){
 q('#cs66Toast')?.remove();const t=document.createElement('div');t.id='cs66Toast';t.className=type;t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2800)
}
async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY},body:JSON.stringify(body||{}),cache:'no-store'});
 let j=null;try{j=await r.json()}catch(e){}
 if(!r.ok)throw new Error(j?.message||j?.error||('HTTP '+r.status));return j
}
async function sendCommand(id,command){
 const code=familyCode();if(!code)throw new Error('Conta da família não conectada.');
 const ok=await rpc('casatoda_send_device_command',{p_code:code,p_child_id:id,p_command:command});
 if(ok!==true)throw new Error('Não foi possível enviar o comando.')
}
function close(){q('#cs66Overlay')?.remove()}
function selectChild(id,wrap){
 wrap.dataset.child=id;
 qa('[data-cs66-child]',wrap).forEach(b=>b.classList.toggle('on',b.dataset.cs66Child===id));
 const name=q('#cs66TargetName',wrap);if(name)name.textContent=childName(id)
}
function openUnlock(){
 if(!isParent())return;
 close();const wrap=document.createElement('div');wrap.id='cs66Overlay';wrap.className='cs66-overlay';
 wrap.innerHTML=`<section class="cs66-sheet"><div class="cs66-head"><div><span>DESBLOQUEIO TEMPORÁRIO</span><h2>Destravar aparelho</h2></div><button class="cs66-close" type="button" aria-label="Fechar">×</button></div><div class="cs66-body"><p>Libera temporariamente os aplicativos bloqueados pelo CasaSegura. Não altera estrelas, rotina ou o horário do dia.</p><div class="cs66-children"><button data-cs66-child="bernardo" type="button">Bernardo</button><button data-cs66-child="julia" type="button">Júlia</button></div><div class="cs66-target">Aparelho selecionado: <b id="cs66TargetName"></b></div><div class="cs66-unlock-grid"><button data-cs66-min="15" type="button"><i>🔓</i><b>15 min</b><span>Liberar agora</span></button><button data-cs66-min="30" type="button"><i>🔓</i><b>30 min</b><span>Liberar agora</span></button><button data-cs66-min="60" type="button"><i>🔓</i><b>1 hora</b><span>Liberar agora</span></button></div><button class="cs66-resume" id="cs66Resume" type="button">Reaplicar regra normal</button><div class="cs66-note">O aparelho precisa estar com o CasaSegura 0.15 ou superior. O comando costuma chegar em poucos segundos.</div></div></section>`;
 document.body.appendChild(wrap);q('.cs66-close',wrap).onclick=close;wrap.onclick=e=>{if(e.target===wrap)close()};
 qa('[data-cs66-child]',wrap).forEach(b=>b.onclick=()=>selectChild(b.dataset.cs66Child,wrap));selectChild(activeChild(),wrap);
 qa('[data-cs66-min]',wrap).forEach(b=>b.onclick=async()=>{
  if(busy)return;busy=true;const id=wrap.dataset.child,min=Number(b.dataset.cs66Min)||15,old=b.innerHTML;
  try{b.disabled=true;b.innerHTML='<b>Enviando...</b>';await sendCommand(id,{action:'unlock',untilMs:Date.now()+min*60000,nonce:nonce(),requestedAt:Date.now()});toast(`${childName(id)}: desbloqueio enviado por ${min===60?'1 hora':min+' minutos'}.`,'ok');close()}
  catch(e){toast(String(e.message||e),'err');b.disabled=false;b.innerHTML=old}
  finally{busy=false}
 });
 q('#cs66Resume',wrap).onclick=async e=>{
  if(busy)return;busy=true;const b=e.currentTarget,id=wrap.dataset.child,old=b.textContent;
  try{b.disabled=true;b.textContent='Enviando...';await sendCommand(id,{action:'resume',nonce:nonce(),requestedAt:Date.now()});toast(`${childName(id)} voltou à regra normal.`,'ok');close()}
  catch(e){toast(String(e.message||e),'err');b.disabled=false;b.textContent=old}
  finally{busy=false}
 }
}
function enhance(){
 if(!isParent()){q('[data-cs66="unlock"]')?.remove();return}
 const host=q('#cs63Home'),actions=q('.cs63-actions',host);if(!actions)return;
 let b=q('[data-cs66="unlock"]',actions);if(!b){b=document.createElement('button');b.type='button';b.dataset.cs66='unlock';b.className='cs66-unlock-action';actions.appendChild(b)}
 b.innerHTML='<i>🔓</i><span><b>Destravar</b><small>Liberar apps ou celular</small></span>';b.onclick=openUnlock;
 const version=q('.cs63-version',host);if(version)version.textContent='CasaSegura • V66'
}
function schedule(ms=20){clearTimeout(timer);timer=setTimeout(enhance,ms)}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'&&x.addedNodes.length))schedule(25)});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('pageshow',()=>schedule(5));window.addEventListener('focus',()=>schedule(10));
document.addEventListener('click',e=>{if(e.target.closest?.('[data-v15-child]'))schedule(30)},true);
setTimeout(enhance,0);setTimeout(enhance,350);setTimeout(enhance,1000);
})();
