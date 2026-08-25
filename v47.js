(()=>{
'use strict';
if(window.__CASATODA_47__)return;
window.__CASATODA_47__=true;

function parentSession(){
 try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}
}

function ensureProfileGap(){
 if(!parentSession())return;
 const sw=document.getElementById('v15Switcher');
 const people=document.getElementById('people');
 if(!sw||!people||!sw.parentNode)return;
 let gap=document.getElementById('ctProfileGap47');
 if(!gap){
  gap=document.createElement('div');
  gap.id='ctProfileGap47';
  gap.setAttribute('aria-hidden','true');
 }
 if(gap.parentNode!==sw.parentNode||gap.previousElementSibling!==sw){
  sw.insertAdjacentElement('afterend',gap);
 }
 people.style.setProperty('position','relative','important');
 people.style.setProperty('top','auto','important');
 people.style.setProperty('transform','none','important');
 people.style.setProperty('margin-top','0px','important');
 people.querySelectorAll(':scope > .person').forEach(card=>{
  card.style.setProperty('position','relative','important');
  card.style.setProperty('top','auto','important');
  card.style.setProperty('transform','none','important');
  card.style.setProperty('margin-top','0px','important');
 });
 requestAnimationFrame(()=>{
  const s=sw.getBoundingClientRect();
  const p=people.getBoundingClientRect();
  const target=24;
  const current=parseFloat(getComputedStyle(gap).height)||24;
  if(p.top < s.bottom+target){
   const extra=(s.bottom+target)-p.top;
   const next=Math.min(120,current+extra+2);
   gap.style.setProperty('height',next+'px','important');
   gap.style.setProperty('min-height',next+'px','important');
   gap.style.setProperty('flex-basis',next+'px','important');
  }
 });
}

function tuneClock(){
 document.querySelectorAll('.ring').forEach(ring=>{
  const text=ring.querySelector('.ring-text');
  if(!text)return;
  text.style.setProperty('display','flex','important');
  text.style.setProperty('flex-direction','column','important');
  text.style.setProperty('align-items','center','important');
  text.style.setProperty('justify-content','center','important');
  text.style.setProperty('text-align','center','important');
  const strong=text.querySelector('strong');
  if(strong)strong.style.setProperty('text-align','center','important');
 });
}

function tune(){ensureProfileGap();tuneClock()}

const observer=new MutationObserver(()=>tune());
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
window.addEventListener('pageshow',()=>setTimeout(tune,0));
window.addEventListener('resize',()=>setTimeout(tune,80));
document.addEventListener('click',()=>setTimeout(tune,0),true);
setTimeout(tune,0);
setTimeout(tune,250);
setTimeout(tune,800);
})();
