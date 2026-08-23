(()=>{
'use strict';
if(window.__CASATODA_25__)return;
window.__CASATODA_25__=true;
const BASE=22*60;
const hm=n=>{n=Math.max(0,Math.min(1439,Math.round(Number(n||0))));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
function migrateBaseTime(){
 try{
  if(typeof state!=='object'||!state)return;
  state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
  if(Number(state.settings.premiumTimeMigration||0)>=25)return;
  state.settings.cutoffMinutes=state.settings.cutoffMinutes&&typeof state.settings.cutoffMinutes==='object'?state.settings.cutoffMinutes:{};
  state.settings.cutoffMinutes.bernardo=BASE;
  state.settings.cutoffMinutes.julia=BASE;
  state.settings.premiumTimeMigration=25;
  if(typeof save==='function')save();
 }catch(e){console.warn('CasaToda V25 horário',e)}
}
function activeId(){
 try{if(typeof isChildSession==='function'&&isChildSession())return sessionRole}catch(e){}
 try{return selected||'bernardo'}catch(e){return 'bernardo'}
}
function record(id){
 try{return ensureDay()?.children?.[id]||{lost:0,gained:0,tasks:{}}}catch(e){return {lost:0,gained:0,tasks:{}}}
}
function decorate(){
 migrateBaseTime();
 const id=activeId();
 document.body.classList.add('premium25');
 document.body.dataset.activeChild=id;
 document.querySelectorAll('#people .person').forEach(card=>{
  const cid=card.dataset.person||id;
  const base=Number(state?.settings?.cutoffMinutes?.[cid]??BASE);
  const r=record(cid),lost=Number(r.lost||0),gained=Number(r.gained||0),final=Math.max(0,Math.min(1439,base-lost+gained));
  const pct=Math.max(8,Math.min(100,final/1440*100));
  card.style.setProperty('--ct-p',String(pct));
  const tone=cid==='julia'?'#9b6bff':'#5b9dff';
  const ringEl=card.querySelector('.ring');if(ringEl)ringEl.style.setProperty('background',`conic-gradient(from 198deg,${tone} 0 ${pct}%,rgba(255,255,255,.18) ${pct}% 100%)`,'important');
  const meta=card.querySelector('.meta');if(meta)meta.textContent=`Desligar hoje às ${hm(final)}`;
  const ring=card.querySelector('.ring-text strong');if(ring)ring.textContent=hm(final);
  const route=card.querySelector('.clock-route');if(route)route.innerHTML=`<span class="clock-start">${hm(base)}</span><span class="clock-arrow">→</span><strong>${hm(final)}</strong>`;
 });
}
const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();requestAnimationFrame(decorate);return x}}
document.addEventListener('click',e=>{if(e.target.closest('[data-v15-child],#childSegment [data-child]'))setTimeout(decorate,0)},true);
window.addEventListener('pageshow',()=>setTimeout(decorate,0));
setTimeout(()=>{migrateBaseTime();try{if(typeof render==='function')render()}catch(e){}decorate()},0);
})();
