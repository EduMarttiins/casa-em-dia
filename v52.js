(()=>{
'use strict';
if(window.__CASATODA_52__)return;
window.__CASATODA_52__=true;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function fixClock(ring){
 let text=ring.querySelector('.ring-text');
 if(!text){
  const parent=ring.parentElement;
  const candidate=parent&&parent.querySelector('.ring-text');
  if(candidate){text=candidate;ring.appendChild(text)}
 }
 if(!text)return;
 const rect=ring.getBoundingClientRect();
 const size=Math.max(110,Math.min(rect.width||140,rect.height||140));
 ring.style.setProperty('position','relative','important');
 ring.style.setProperty('overflow','hidden','important');
 text.style.setProperty('position','absolute','important');
 text.style.setProperty('inset','0','important');
 text.style.setProperty('left','0','important');
 text.style.setProperty('top','0','important');
 text.style.setProperty('right','0','important');
 text.style.setProperty('bottom','0','important');
 text.style.setProperty('width','100%','important');
 text.style.setProperty('height','100%','important');
 text.style.setProperty('margin','0','important');
 text.style.setProperty('padding','16% 10%','important');
 text.style.setProperty('box-sizing','border-box','important');
 text.style.setProperty('transform','none','important');
 text.style.setProperty('translate','none','important');
 text.style.setProperty('display','flex','important');
 text.style.setProperty('flex-direction','column','important');
 text.style.setProperty('align-items','center','important');
 text.style.setProperty('justify-content','center','important');
 text.style.setProperty('gap',Math.round(clamp(size*.042,5,7))+'px','important');
 text.style.setProperty('text-align','center','important');
 text.style.setProperty('overflow','hidden','important');
 text.style.setProperty('z-index','10','important');
 const kids=[...text.children];
 kids.forEach(el=>{
  el.style.setProperty('position','static','important');
  el.style.setProperty('left','auto','important');
  el.style.setProperty('top','auto','important');
  el.style.setProperty('right','auto','important');
  el.style.setProperty('bottom','auto','important');
  el.style.setProperty('float','none','important');
  el.style.setProperty('display','block','important');
  el.style.setProperty('width','100%','important');
  el.style.setProperty('max-width','100%','important');
  el.style.setProperty('margin','0','important');
  el.style.setProperty('padding','0','important');
  el.style.setProperty('transform','none','important');
  el.style.setProperty('translate','none','important');
  el.style.setProperty('text-align','center','important');
  el.style.setProperty('white-space','nowrap','important');
 });
 const strong=text.querySelector('strong');
 if(strong){
  strong.style.setProperty('font-size',Math.round(clamp(size*.245,30,37))+'px','important');
  strong.style.setProperty('line-height','.94','important');
  strong.style.setProperty('letter-spacing','-.045em','important');
  strong.style.setProperty('font-variant-numeric','tabular-nums','important');
 }
 const spans=text.querySelectorAll('span');
 spans.forEach((sp,i)=>{
  const fs=i===spans.length-1?clamp(size*.052,7,8):clamp(size*.06,7.5,9);
  sp.style.setProperty('font-size',fs.toFixed(1)+'px','important');
  sp.style.setProperty('line-height','1','important');
 });
}
function tune52(){document.querySelectorAll('.ring').forEach(fixClock)}
let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(tune52)}
const obs=new MutationObserver(schedule);
obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('resize',schedule);
window.addEventListener('orientationchange',()=>setTimeout(schedule,120));
window.addEventListener('pageshow',schedule);
window.visualViewport?.addEventListener('resize',schedule);
document.addEventListener('click',()=>setTimeout(schedule,0),true);
setTimeout(tune52,0);
setTimeout(tune52,200);
setTimeout(tune52,700);
})();
