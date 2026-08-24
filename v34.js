(()=>{
'use strict';
if(window.__CASATODA_34__)return;
window.__CASATODA_34__=true;

const q=(s,p=document)=>p.querySelector(s);
const BASE=22*60;

function activeId(){
 try{if(typeof isChildSession==='function'&&isChildSession())return sessionRole}catch(e){}
 try{return selected||'bernardo'}catch(e){return 'bernardo'}
}
function todayRecord(id){
 try{return ensureDay()?.children?.[id]||{lost:0,gained:0}}catch(e){return {lost:0,gained:0}}
}
function fixSettingsButton(){
 const b=document.getElementById('settingsBtn');
 if(!b)return;
 if(b.textContent.trim()!=='⚙')b.textContent='⚙';
 b.setAttribute('aria-label','Configurações');
 b.title='Configurações';
}
function fitGreeting(){
 const title=q('.brand h1'),actions=q('.top-actions');
 if(!title||!actions)return;
 title.style.removeProperty('font-size');
 requestAnimationFrame(()=>{
  const ar=actions.getBoundingClientRect();
  let size=parseFloat(getComputedStyle(title).fontSize)||18;
  let tr=title.getBoundingClientRect();
  let guard=0;
  while(tr.right>ar.left-5&&size>13.5&&guard<16){
   size-=.5;title.style.setProperty('font-size',size+'px','important');tr=title.getBoundingClientRect();guard++
  }
 });
}
function fixRing(){
 const idActive=activeId();
 document.querySelectorAll('#people .person').forEach(card=>{
  const id=card.dataset.person||idActive;
  const base=Math.max(1,Number(state?.settings?.cutoffMinutes?.[id]??BASE));
  const rec=todayRecord(id),lost=Math.max(0,Number(rec.lost||0)),gained=Math.max(0,Number(rec.gained||0));
  const final=Math.max(0,Math.min(1439,base-lost+gained));
  const pct=final>=base?100:Math.max(0,Math.min(100,final/base*100));
  const tone=id==='julia'?'#a96dff':'#58a2ff';
  const ring=card.querySelector('.ring');
  if(!ring)return;
  if(pct>=99.999)ring.style.setProperty('background',tone,'important');
  else ring.style.setProperty('background',`conic-gradient(from -90deg,${tone} 0 ${pct}%,rgba(255,255,255,.16) ${pct}% 100%)`,'important');
  ring.dataset.ctPercent=String(Math.round(pct*10)/10);
 });
}
function tune(){fixSettingsButton();fitGreeting();fixRing()}
function tuneAfter(){requestAnimationFrame(()=>requestAnimationFrame(tune))}

try{
 const originalUpdatePinDisplay=typeof updatePinDisplay==='function'?updatePinDisplay:null;
 updatePinDisplay=function(){
  const d=document.getElementById('pinDisplay');if(!d)return;
  const value=typeof pinInput==='string'?pinInput:'';
  d.textContent=value?'•'.repeat(value.length):'';
  d.classList.toggle('ctPinEmpty',!value);
 };
 if(originalUpdatePinDisplay&&typeof pinInput==='string'&&pinInput)updatePinDisplay();else updatePinDisplay();
}catch(e){console.warn('CasaToda V34 PIN',e)}

const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();tuneAfter();return x}}

document.addEventListener('click',e=>{
 if(e.target.closest('[data-v15-child],#childSegment [data-child],#settingsBtn,#switchUserBtn'))setTimeout(tuneAfter,0)
},true);
window.addEventListener('pageshow',tuneAfter);
window.addEventListener('resize',()=>setTimeout(tuneAfter,80));
setTimeout(tuneAfter,0);setTimeout(tuneAfter,600);
})();
