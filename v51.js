(()=>{
'use strict';
if(window.__CASATODA_51__)return;
window.__CASATODA_51__=true;

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function isParent51(){
 try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}
}

function viewport(){
 const vv=window.visualViewport;
 const w=Math.max(300,Math.min(720,Math.round(vv?.width||document.documentElement.clientWidth||window.innerWidth||390)));
 const h=Math.max(520,Math.round(vv?.height||window.innerHeight||800));
 return {w,h};
}

function setResponsiveVars(){
 if(!isParent51())return;
 const {w,h}=viewport();
 const root=document.documentElement;
 const widthFactor=clamp(w/390,.86,1.08);
 const heightFactor=clamp(h/820,.84,1.08);
 const scale=Math.min(widthFactor,heightFactor);

 const ring=Math.round(clamp(148*scale,124,152));
 const cardPad=Math.round(clamp(14*scale,11,15));
 const statH=Math.round(clamp(49*scale,42,51));
 const tileH=Math.round(clamp(62*scale,54,64));
 const profileGap=Math.round(clamp(w*.018,6,9));

 root.style.setProperty('--ct-ring-size',ring+'px');
 root.style.setProperty('--ct-card-pad',cardPad+'px');
 root.style.setProperty('--ct-stat-h',statH+'px');
 root.style.setProperty('--ct-tile-h',tileH+'px');
 root.style.setProperty('--ct-profile-gap',profileGap+'px');
 root.style.setProperty('--ct-screen-w',w+'px');
 root.style.setProperty('--ct-screen-h',h+'px');
 document.body.classList.toggle('ct51-short',h<720);
 document.body.classList.toggle('ct51-narrow',w<360);
}

function measureFooter(){
 if(!isParent51())return;
 const nav=document.querySelector('.nav');
 if(!nav)return;
 const h=Math.ceil(nav.getBoundingClientRect().height);
 const safe=Math.max(68,h+14);
 document.documentElement.style.setProperty('--ct-nav-safe',safe+'px');
}

function forceClockCenter(){
 document.querySelectorAll('.ring').forEach(ring=>{
  const text=ring.querySelector('.ring-text');
  if(!text)return;
  text.style.setProperty('position','absolute','important');
  text.style.setProperty('left','50%','important');
  text.style.setProperty('top','50%','important');
  text.style.setProperty('right','auto','important');
  text.style.setProperty('bottom','auto','important');
  text.style.setProperty('inset','auto','important');
  text.style.setProperty('transform','translate(-50%,-50%)','important');
  text.style.setProperty('width','78%','important');
  text.style.setProperty('height','auto','important');
  text.style.setProperty('display','grid','important');
  text.style.setProperty('justify-items','center','important');
  text.style.setProperty('align-content','center','important');
  text.style.setProperty('text-align','center','important');
  [...text.children].forEach(el=>{
   el.style.setProperty('width','100%','important');
   el.style.setProperty('text-align','center','important');
   el.style.setProperty('margin','0','important');
   el.style.setProperty('transform','none','important');
  });
 });
}

function normalizeStats(){
 document.querySelectorAll('.person-stats .stat').forEach(stat=>{
  stat.style.setProperty('display','grid','important');
  stat.style.setProperty('align-content','center','important');
  stat.style.setProperty('align-items','center','important');
 });
}

function tune51(){
 setResponsiveVars();
 measureFooter();
 forceClockCenter();
 normalizeStats();
}

let raf=0;
function schedule(){
 cancelAnimationFrame(raf);
 raf=requestAnimationFrame(tune51);
}

const obs=new MutationObserver(schedule);
obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('resize',schedule);
window.addEventListener('orientationchange',()=>setTimeout(schedule,120));
window.addEventListener('pageshow',schedule);
window.visualViewport?.addEventListener('resize',schedule);
document.addEventListener('click',()=>setTimeout(schedule,0),true);
setTimeout(tune51,0);
setTimeout(tune51,250);
setTimeout(tune51,900);
})();
