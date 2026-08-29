(()=>{
'use strict';
if(window.__CASASEGURA_63__)return;
window.__CASASEGURA_63__=true;

let timer=0;
const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function activeId(){
 try{if(isChild())return String(sessionRole||'').toLowerCase()}catch(e){}
 try{if(['bernardo','julia'].includes(String(selected)))return String(selected)}catch(e){}
 return 'bernardo'
}
function childData(id){try{return state?.children?.find(c=>c.id===id)||{id,name:id==='julia'?'Júlia':'Bernardo'}}catch(e){return{id,name:id==='julia'?'Júlia':'Bernardo'}}}
function dateKey(){
 try{if(typeof todayKey==='function')return todayKey()}catch(e){}
 const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function dayData(id){try{return state?.days?.[dateKey()]?.children?.[id]||{lost:0,gained:0}}catch(e){return{lost:0,gained:0}}}
function n(v){v=Number(v);return Number.isFinite(v)?v:0}
function minToTime(v){v=Math.max(0,Math.min(1439,Math.round(n(v))));return `${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`}
function stars(id){try{return Math.max(0,Math.round(n(state?.stars?.[id])))}catch(e){return 0}}
function baseMinutes(id){try{return n(state?.settings?.cutoffMinutes?.[id]??1320)}catch(e){return 1320}}
function cutoff(id){const d=dayData(id);return Math.max(0,Math.min(1439,baseMinutes(id)-n(d.lost)+n(d.gained)))}
function cashRate(){try{return Math.max(1,n(state?.settings?.cashStarsPerReal)||50)}catch(e){return 50}}
function cashValue(id){return stars(id)/cashRate()}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function toast(msg){
 q('#cs63Toast')?.remove();const t=document.createElement('div');t.id='cs63Toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1900)
}
function avatarHtml(c){
 const src=String(c?.photo||'').trim();
 if(src)return `<img src="${esc(src)}" alt="">`;
 return `<span>${esc((c?.name||'?').slice(0,1).toUpperCase())}</span>`
}
function removeAdvanced(){
 document.body.classList.add('cs63-simple');document.body.classList.remove('cs56-parent');
 for(const sel of ['#ctDeviceControl44','#ctScreenTime55','#cs62ChildUsage','#cs62LeftTabs','#cs60HistoryTab','#cs56App','#cs56Nav','.cs56-sheet'])qa(sel).forEach(x=>x.remove());
 const oldVersion=q('#cs58VersionStrip');if(oldVersion)oldVersion.style.setProperty('display','none','important');
}
function openTime(kind){
 if(!isParent())return;
 const id=activeId();
 const run=()=>{
  try{
   if(typeof openEvent==='function'){
    openEvent(kind,kind==='penalty'?'Desconto de tempo':'Tempo extra',10,false);
    return
   }
  }catch(e){}
  toast('Não foi possível abrir o ajuste de tempo agora.')
 };
 try{if(typeof requireParent==='function')requireParent(run);else run()}catch(e){run()}
}
function adjustStars(delta){
 if(!isParent())return;
 const id=activeId();
 try{
  state.stars=state.stars||{};
  const before=Math.max(0,Math.round(n(state.stars[id])));
  const after=Math.max(0,before+Math.round(delta));
  state.stars[id]=after;
  if(typeof save==='function')save();
  if(typeof render==='function'){window.__CS63_FORCE_RENDER__=true;try{render()}finally{window.__CS63_FORCE_RENDER__=false}}
  renderSimple();
  toast(`${childData(id).name}: ${after} estrelas`)
 }catch(e){toast('Não foi possível alterar as estrelas.')}
}
function openStars(){
 if(!isParent())return;
 q('#cs63StarSheet')?.remove();
 const id=activeId(),c=childData(id),wrap=document.createElement('div');wrap.id='cs63StarSheet';wrap.className='cs63-overlay';
 wrap.innerHTML=`<section class="cs63-sheet"><button class="cs63-close" type="button" aria-label="Fechar">×</button><div class="cs63-sheet-kicker">ESTRELAS DE ${esc(c.name).toUpperCase()}</div><div class="cs63-sheet-balance"><b>${stars(id)}</b><span>★</span></div><p>Escolha quantas estrelas deseja acrescentar ou retirar.</p><div class="cs63-star-grid"><button data-star="-10">−10</button><button data-star="-5">−5</button><button data-star="-1">−1</button><button data-star="1">+1</button><button data-star="5">+5</button><button data-star="10">+10</button></div><div class="cs63-custom"><input id="cs63CustomStars" inputmode="numeric" type="number" min="1" max="999" placeholder="Outra quantidade"><button id="cs63CustomAdd" type="button">Adicionar</button><button id="cs63CustomRemove" type="button">Retirar</button></div></section>`;
 document.body.appendChild(wrap);
 q('.cs63-close',wrap).onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
 qa('[data-star]',wrap).forEach(b=>b.onclick=()=>{adjustStars(Number(b.dataset.star));wrap.remove()});
 q('#cs63CustomAdd',wrap).onclick=()=>{const v=Math.max(1,Math.min(999,Math.round(n(q('#cs63CustomStars',wrap).value))));adjustStars(v);wrap.remove()};
 q('#cs63CustomRemove',wrap).onclick=()=>{const v=Math.max(1,Math.min(999,Math.round(n(q('#cs63CustomStars',wrap).value))));adjustStars(-v);wrap.remove()}
}
function openCash(){
 const btn=q('#rewardBtn');
 if(!btn){toast('Cofrinho indisponível agora.');return}
 btn.click();
 setTimeout(()=>{
  try{if(typeof setRewardTab==='function')setRewardTab('cash')}catch(e){}
  setTimeout(()=>{
   const overlays=qa('.overlay').filter(o=>!o.classList.contains('hidden'));
   overlays.forEach(o=>{
    const txt=String(o.innerText||'').toLowerCase();
    if(txt.includes('cofrinho')||txt.includes('retirada')){
     o.classList.add('cs63-cash-only');
     qa('button',o).forEach(b=>{const t=String(b.textContent||'').trim().toLowerCase();if(t.includes('privilégio')||t.includes('premio')||t.includes('prêmio'))b.style.setProperty('display','none','important')});
     qa('.rewardrow',o).forEach(r=>r.style.setProperty('display','none','important'))
    }
   })
  },80)
 },40)
}
function renderSimple(){
 removeAdvanced();
 const logged=isParent()||isChild();
 let host=q('#cs63Home');
 if(!logged){host?.remove();return}
 const app=q('.app');if(!app)return;
 if(!host){host=document.createElement('main');host.id='cs63Home';const switcher=q('#v15Switcher');if(switcher)switcher.insertAdjacentElement('afterend',host);else q('.top')?.insertAdjacentElement('afterend',host)}
 const id=activeId(),c=childData(id),d=dayData(id),s=stars(id),final=cutoff(id),cash=cashValue(id);
 host.innerHTML=`<section class="cs63-profile"><div class="cs63-profile-top"><div class="cs63-avatar">${avatarHtml(c)}</div><div class="cs63-who"><span>${isParent()?'PERFIL ATIVO':'MEU PERFIL'}</span><h2>${esc(c.name)}</h2><small>Horário de hoje: ${minToTime(final)}</small></div><div class="cs63-star-pill">★ ${s}</div></div><div class="cs63-main-grid"><div class="cs63-time-card"><span>HORÁRIO DE HOJE</span><b>${minToTime(final)}</b><small>Base ${minToTime(baseMinutes(id))}</small></div><div class="cs63-summary"><div><span>Descontado hoje</span><b>−${Math.max(0,Math.round(n(d.lost)))} min</b></div><div><span>Acrescentado hoje</span><b>+${Math.max(0,Math.round(n(d.gained)))} min</b></div></div><div class="cs63-wallet"><span>COFRINHO</span><b>R$ ${cash.toFixed(2).replace('.',',')}</b><small>${s} estrelas • ${cashRate()} estrelas = R$ 1,00</small></div></div>${isParent()?`<div class="cs63-actions"><button data-cs63="minus"><i>−</i><span><b>Descontar tempo</b><small>Diminuir horário de hoje</small></span></button><button data-cs63="plus"><i>＋</i><span><b>Adicionar tempo</b><small>Dar minutos extras</small></span></button><button data-cs63="stars"><i>★</i><span><b>Ajustar estrelas</b><small>Ganhar ou perder estrelas</small></span></button><button data-cs63="cash"><i>◉</i><span><b>Cofrinho</b><small>Saldo e retiradas</small></span></button></div>`:`<button class="cs63-child-cash" data-cs63="cash" type="button"><span>◉</span><b>Abrir meu cofrinho</b><small>Ver saldo e retiradas</small></button>`}<div class="cs63-version">CasaSegura • V63</div></section>`;
 qa('[data-cs63]',host).forEach(b=>b.onclick=()=>{const a=b.dataset.cs63;if(a==='minus')openTime('penalty');else if(a==='plus')openTime('credit');else if(a==='stars')openStars();else if(a==='cash')openCash()})
}
function patchRender(){
 try{
  const base=window.render;if(typeof base!=='function'||base.__cs63Wrapped)return;
  const wrapped=function(...args){const out=base.apply(this,args);setTimeout(renderSimple,0);return out};wrapped.__cs63Wrapped=true;wrapped.__cs63Base=base;window.render=wrapped
 }catch(e){}
}
function schedule(ms=30){clearTimeout(timer);timer=setTimeout(()=>{patchRender();renderSimple()},ms)}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'&&(x.addedNodes.length||x.removedNodes.length)))schedule(35)});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('pageshow',()=>schedule(10));window.addEventListener('focus',()=>schedule(20));window.addEventListener('resize',()=>schedule(50));document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});
patchRender();setTimeout(renderSimple,0);setTimeout(renderSimple,400);setTimeout(renderSimple,1200);
})();