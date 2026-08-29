(()=>{
'use strict';
if(window.__CASASEGURA_65__)return;
window.__CASASEGURA_65__=true;

const TASKS=[
 {id:'cs65_t1',name:'Agradecer a Deus ao acordar',stars:1},
 {id:'cs65_t2',name:'Arrumar cama',stars:1},
 {id:'cs65_t3',name:'Escovar o dente ao acordar',stars:1},
 {id:'cs65_t4',name:'Retirar o cocô do quintal',stars:1},
 {id:'cs65_t5',name:'Tomar banho sem mandar',stars:1},
 {id:'cs65_t6',name:'Ler um capítulo de um livro',stars:1},
 {id:'cs65_t7',name:'Tomar banho depois da escola',stars:1},
 {id:'cs65_t8',name:'Escovar os dentes antes de dormir',stars:1},
 {id:'cs65_t9',name:'Não teve briga',stars:1},
 {id:'cs65_t10',name:'Não fui mal educada com meu irmão',stars:1}
];
const REWARDS=[
 {id:'cs65_r1',name:'1 barra de chocolate',cost:150,minutes:0,icon:'🍫'},
 {id:'cs65_r2',name:'+15 minutos de tela',cost:250,minutes:15,icon:'⏱'},
 {id:'cs65_r3',name:'+20 minutos de tela',cost:500,minutes:20,icon:'⏱'}
];
const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
let timer=0;

function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function activeId(){
 try{if(isChild())return String(sessionRole||'').toLowerCase()}catch(e){}
 try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}
 return 'bernardo'
}
function childData(id){try{return state?.children?.find(c=>c.id===id)||{id,name:id==='julia'?'Júlia':'Bernardo'}}catch(e){return{id,name:id==='julia'?'Júlia':'Bernardo'}}}
function n(v){v=Number(v);return Number.isFinite(v)?v:0}
function stars(id){try{return Math.max(0,Math.round(n(state?.stars?.[id])))}catch(e){return 0}}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function dateKey(){
 try{if(typeof todayKey==='function')return todayKey()}catch(e){}
 const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function dayRecord(id){
 const key=dateKey();
 state.days=state.days&&typeof state.days==='object'?state.days:{};
 state.days[key]=state.days[key]&&typeof state.days[key]==='object'?state.days[key]:{children:{}};
 state.days[key].children=state.days[key].children&&typeof state.days[key].children==='object'?state.days[key].children:{};
 const r=state.days[key].children[id]=state.days[key].children[id]&&typeof state.days[key].children[id]==='object'?state.days[key].children[id]:{lost:0,gained:0,events:[],tasks:{}};
 r.tasks=r.tasks&&typeof r.tasks==='object'?r.tasks:{};
 if(!Array.isArray(r.events))r.events=[];
 r.lost=Math.max(0,n(r.lost));r.gained=Math.max(0,n(r.gained));
 return r
}
function statusOf(id,taskId){return String(dayRecord(id).tasks?.[taskId]||'')}
function completedCount(id){return TASKS.filter(t=>statusOf(id,t.id)==='done').length}
function requestedCount(id){return TASKS.filter(t=>statusOf(id,t.id)==='requested').length}
function pendingRewards(id){return (state.rewardRequests||[]).filter(r=>r?.childId===id&&r?.status==='pending')}
function saveNow(){try{if(typeof save==='function')save()}catch(e){console.warn('CasaSegura V65 save',e)}}
function refresh(){
 try{if(typeof render==='function'){window.__CS63_FORCE_RENDER__=true;try{render()}finally{window.__CS63_FORCE_RENDER__=false}}}catch(e){}
 setTimeout(enhanceHome,0)
}
function toast(msg){
 q('#cs65Toast')?.remove();const t=document.createElement('div');t.id='cs65Toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)
}
function seed(){
 if(typeof state!=='object'||!state)return;
 state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
 if(Number(state.settings.cs65RoutineVersion||0)>=65)return;
 state.tasks=TASKS.map(x=>({...x,active:true}));
 state.rewards=REWARDS.map(x=>({...x,stars:x.cost,active:true}));
 state.rewardRequests=Array.isArray(state.rewardRequests)?state.rewardRequests:[];
 state.settings.cs65RoutineVersion=65;
 saveNow()
}
function closeOverlay(){q('#cs65Overlay')?.remove()}
function overlayShell(title,subtitle){
 closeOverlay();const w=document.createElement('div');w.id='cs65Overlay';w.className='cs65-overlay';
 w.innerHTML=`<section class="cs65-sheet"><div class="cs65-sheet-head"><div><span>${esc(subtitle||'CASASEGURA')}</span><h2>${esc(title)}</h2></div><button class="cs65-close" type="button">×</button></div><div id="cs65SheetBody"></div></section>`;
 q('.cs65-close',w).onclick=closeOverlay;w.onclick=e=>{if(e.target===w)closeOverlay()};document.body.appendChild(w);return q('#cs65SheetBody',w)
}
function setTaskStatus(id,taskId,next){
 const r=dayRecord(id),prev=String(r.tasks[taskId]||'');
 if(prev===next)return;
 if(next)r.tasks[taskId]=next;else delete r.tasks[taskId];
 if(isParent()){
  state.stars=state.stars||{};
  if(next==='done'&&prev!=='done')state.stars[id]=Math.max(0,stars(id)+1);
  if(prev==='done'&&next!=='done')state.stars[id]=Math.max(0,stars(id)-1)
 }
 saveNow();refresh()
}
function requestTask(taskId){
 const id=activeId();if(!isChild())return;
 if(statusOf(id,taskId))return;
 setTaskStatus(id,taskId,'requested');
 toast('Rotina enviada para aprovação dos pais.');openRoutine()
}
function approveTask(taskId){
 const id=activeId();if(!isParent())return;
 setTaskStatus(id,taskId,'done');toast(`${childData(id).name} ganhou 1 estrela.`);openRoutine()
}
function rejectTask(taskId){
 const id=activeId();if(!isParent())return;
 setTaskStatus(id,taskId,'');toast('Pedido retirado.');openRoutine()
}
function undoTask(taskId){
 const id=activeId();if(!isParent())return;
 setTaskStatus(id,taskId,'');toast('Conclusão desfeita e 1 estrela retirada.');openRoutine()
}
function openRoutine(){
 seed();const id=activeId(),c=childData(id),done=completedCount(id),requested=requestedCount(id),body=overlayShell('Rotina diária',`${String(c.name).toUpperCase()} • 1 ESTRELA POR ROTINA`);
 body.innerHTML=`<div class="cs65-routine-summary"><div><b>${done}/${TASKS.length}</b><span>concluídas hoje</span></div><div><b>★ ${done}</b><span>estrelas da rotina</span></div>${isParent()?`<div><b>${requested}</b><span>aguardando aprovação</span></div>`:''}</div><div class="cs65-task-list">${TASKS.map((t,i)=>{
  const st=statusOf(id,t.id),doneSt=st==='done',req=st==='requested';
  let action='';
  if(isChild())action=doneSt?'<span class="cs65-state done">✓ +1 ★</span>':req?'<span class="cs65-state wait">Aguardando</span>':`<button class="cs65-task-btn" data-task-request="${t.id}" type="button">Concluí</button>`;
  else action=doneSt?`<button class="cs65-task-btn muted" data-task-undo="${t.id}" type="button">Desfazer</button>`:req?`<span class="cs65-parent-actions"><button class="cs65-task-btn approve" data-task-approve="${t.id}" type="button">Aprovar +1 ★</button><button class="cs65-task-btn reject" data-task-reject="${t.id}" type="button">Recusar</button></span>`:`<button class="cs65-task-btn" data-task-approve="${t.id}" type="button">Marcar feita +1 ★</button>`;
  return `<div class="cs65-task ${doneSt?'done':req?'requested':''}"><span class="cs65-task-num">${i+1}</span><span class="cs65-task-name">${esc(t.name)}</span>${action}</div>`
 }).join('')}</div>`;
 qa('[data-task-request]',body).forEach(b=>b.onclick=()=>requestTask(b.dataset.taskRequest));
 qa('[data-task-approve]',body).forEach(b=>b.onclick=()=>approveTask(b.dataset.taskApprove));
 qa('[data-task-reject]',body).forEach(b=>b.onclick=()=>rejectTask(b.dataset.taskReject));
 qa('[data-task-undo]',body).forEach(b=>b.onclick=()=>undoTask(b.dataset.taskUndo))
}
function rewardRequest(id,rewardId){return (state.rewardRequests||[]).find(r=>r?.childId===id&&r?.rewardId===rewardId&&r?.status==='pending')||null}
function requestReward(rewardId){
 if(!isChild())return;const id=activeId(),reward=REWARDS.find(r=>r.id===rewardId);if(!reward)return;
 if(stars(id)<reward.cost){toast(`Faltam ${reward.cost-stars(id)} estrelas.`);return}
 state.rewardRequests=Array.isArray(state.rewardRequests)?state.rewardRequests:[];
 if(rewardRequest(id,rewardId)){toast('Esse pedido já está aguardando aprovação.');return}
 state.rewardRequests.push({id:`cs65_req_${id}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,childId:id,rewardId:reward.id,label:reward.name,cost:reward.cost,stars:reward.cost,minutes:reward.minutes,status:'pending',ts:new Date().toISOString(),source:'cs65'});
 saveNow();refresh();toast('Pedido enviado para os pais.');openRewards()
}
function decideReward(reqId,approved){
 if(!isParent())return;state.rewardRequests=Array.isArray(state.rewardRequests)?state.rewardRequests:[];
 const req=state.rewardRequests.find(r=>r?.id===reqId);if(!req||req.status!=='pending')return;
 const reward=REWARDS.find(r=>r.id===req.rewardId)||{name:req.label||'Recompensa',cost:n(req.cost||req.stars),minutes:n(req.minutes)};
 const id=req.childId;if(approved){
  if(stars(id)<reward.cost){toast(`${childData(id).name} não tem estrelas suficientes.`);return}
  state.stars=state.stars||{};state.stars[id]=Math.max(0,stars(id)-reward.cost);
  if(reward.minutes>0){const r=dayRecord(id);r.gained=Math.max(0,n(r.gained)+reward.minutes)}
  req.status='approved';req.decidedAt=new Date().toISOString();
  state.redemptions=Array.isArray(state.redemptions)?state.redemptions:[];
  state.redemptions.push({id:`redeem_${req.id}`,childId:id,rewardId:req.rewardId,label:reward.name,stars:reward.cost,minutes:reward.minutes||0,ts:new Date().toISOString(),source:'cs65'});
 }else{req.status='rejected';req.decidedAt=new Date().toISOString()}
 saveNow();refresh();toast(approved?'Recompensa aprovada.':'Pedido recusado.');openRewards()
}
function openRewards(){
 seed();const id=activeId(),c=childData(id),s=stars(id),pending=pendingRewards(id),body=overlayShell('Recompensas',`${String(c.name).toUpperCase()} • SALDO ${s} ★`);
 const pendingHtml=isParent()&&pending.length?`<div class="cs65-pending-box"><h3>Pedidos aguardando você</h3>${pending.map(r=>`<div class="cs65-pending-row"><div><b>${esc(r.label||'Recompensa')}</b><span>${n(r.cost||r.stars)} ★${n(r.minutes)>0?` • +${n(r.minutes)} min`:''}</span></div><span><button data-reward-approve="${esc(r.id)}">Aprovar</button><button class="reject" data-reward-reject="${esc(r.id)}">Recusar</button></span></div>`).join('')}</div>`:'';
 body.innerHTML=`${pendingHtml}<div class="cs65-reward-balance"><span>Saldo disponível</span><b>${s} ★</b></div><div class="cs65-reward-list">${REWARDS.map(r=>{
  const can=s>=r.cost,p=req=>req;const waiting=rewardRequest(id,r.id);
  const action=isParent()?'<span class="cs65-reward-note">O filho solicita e você aprova</span>':waiting?'<button disabled>Aguardando aprovação</button>':`<button data-reward-request="${r.id}" ${can?'':'disabled'}>${can?'Pedir troca':`Faltam ${r.cost-s} ★`}</button>`;
  return `<div class="cs65-reward-card ${can?'':'locked'}"><div class="cs65-reward-icon">${r.icon}</div><div class="cs65-reward-copy"><b>${esc(r.name)}</b><span>${r.cost} estrelas${r.minutes?` • acrescenta ${r.minutes} min hoje`:''}</span></div><div class="cs65-reward-cost">★ ${r.cost}</div>${action}</div>`
 }).join('')}</div>`;
 qa('[data-reward-request]',body).forEach(b=>b.onclick=()=>requestReward(b.dataset.rewardRequest));
 qa('[data-reward-approve]',body).forEach(b=>b.onclick=()=>decideReward(b.dataset.rewardApprove,true));
 qa('[data-reward-reject]',body).forEach(b=>b.onclick=()=>decideReward(b.dataset.rewardReject,false))
}
function triggerCash(){
 const host=q('#cs63Home'),b=host?.querySelector('[data-cs63="cash"]');if(b){b.click();return}
 const legacy=q('#rewardBtn');if(legacy){legacy.click();setTimeout(()=>{try{if(typeof setRewardTab==='function')setRewardTab('cash')}catch(e){}},50)}
}
function enhanceHome(){
 if(!isParent()&&!isChild())return;
 seed();
 document.body.classList.add('cs65');
 const host=q('#cs63Home');if(!host)return;
 const id=activeId(),done=completedCount(id),req=requestedCount(id),pending=pendingRewards(id).length;
 const version=q('.cs63-version',host);if(version)version.textContent='CasaSegura • V65';
 if(isParent()){
  const actions=q('.cs63-actions',host);if(actions){
   let rb=q('[data-cs65="routine"]',actions);if(!rb){rb=document.createElement('button');rb.type='button';rb.dataset.cs65='routine';actions.appendChild(rb)}
   rb.innerHTML=`<i>✓</i><span><b>Rotina diária</b><small>${done}/${TASKS.length} concluídas${req?` • ${req} para aprovar`:''}</small></span>`;
   let rw=q('[data-cs65="rewards"]',actions);if(!rw){rw=document.createElement('button');rw.type='button';rw.dataset.cs65='rewards';actions.appendChild(rw)}
   rw.innerHTML=`<i>🎁</i><span><b>Recompensas</b><small>${pending?`${pending} pedido${pending>1?'s':''} aguardando`:'Trocas por estrelas'}</small></span>`;
   rb.onclick=openRoutine;rw.onclick=openRewards
  }
 }else{
  q('.cs63-child-cash',host)?.style.setProperty('display','none','important');
  let a=q('.cs65-child-actions',host);if(!a){a=document.createElement('div');a.className='cs65-child-actions';q('.cs63-version',host)?.insertAdjacentElement('beforebegin',a)}
  a.innerHTML=`<button data-cs65-child="routine"><i>✓</i><span><b>Minha rotina</b><small>${done}/${TASKS.length} concluídas${req?` • ${req} aguardando`:''}</small></span></button><button data-cs65-child="rewards"><i>🎁</i><span><b>Recompensas</b><small>${pending?'Pedido aguardando':'Trocar minhas estrelas'}</small></span></button><button data-cs65-child="cash"><i>◉</i><span><b>Cofrinho</b><small>Ver meu saldo</small></span></button>`;
  q('[data-cs65-child="routine"]',a).onclick=openRoutine;q('[data-cs65-child="rewards"]',a).onclick=openRewards;q('[data-cs65-child="cash"]',a).onclick=triggerCash
 }
}
function purgeFlicker(){
 for(const sel of ['.nav','#v15HomeBtn','#routineNav','#creditBtn','#rewardBtn','#historyBtn','#backupBtn','#ctDeviceControl44','#ctScreenTime55','#cs56Nav','#cs56App','#cs60HistoryTab','#cs62LeftTabs'])qa(sel).forEach(el=>el.style.setProperty('display','none','important'))
}
function patchRender(){
 try{const base=window.render;if(typeof base!=='function'||base.__cs65Wrapped)return;const wrapped=function(...args){const out=base.apply(this,args);setTimeout(()=>{purgeFlicker();enhanceHome()},0);return out};wrapped.__cs65Wrapped=true;wrapped.__cs65Base=base;window.render=wrapped}catch(e){}
}
function schedule(ms=25){clearTimeout(timer);timer=setTimeout(()=>{patchRender();purgeFlicker();enhanceHome()},ms)}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'&&(x.addedNodes.length||x.removedNodes.length)))schedule(25)});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('pageshow',()=>schedule(5));window.addEventListener('focus',()=>schedule(10));document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(10)});
patchRender();purgeFlicker();setTimeout(schedule,0);setTimeout(schedule,350);setTimeout(schedule,1000);
})();
