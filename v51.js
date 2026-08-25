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
  let text=ring.querySelector('.ring-text');
  if(!text){
   const candidate=ring.parentElement?.querySelector('.ring-text');
   if(candidate){
    text=candidate;
    ring.appendChild(text);
   }
  }
  if(!text)return;

  const rr=ring.getBoundingClientRect();
  const size=Math.max(110,Math.min(rr.width||140,rr.height||140));

  ring.style.setProperty('position','relative','important');
  ring.style.setProperty('overflow','hidden','important');
  ring.style.setProperty('isolation','isolate','important');

  text.style.setProperty('position','absolute','important');
  text.style.setProperty('inset','0','important');
  text.style.setProperty('left','0','important');
  text.style.setProperty('top','0','important');
  text.style.setProperty('right','0','important');
  text.style.setProperty('bottom','0','important');
  text.style.setProperty('width','100%','important');
  text.style.setProperty('height','100%','important');
  text.style.setProperty('max-width','100%','important');
  text.style.setProperty('max-height','100%','important');
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

  [...text.children].forEach(el=>{
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
   el.style.setProperty('box-sizing','border-box','important');
  });

  const strong=text.querySelector('strong');
  if(strong){
   strong.style.setProperty('font-size',Math.round(clamp(size*.245,30,37))+'px','important');
   strong.style.setProperty('line-height','.94','important');
   strong.style.setProperty('letter-spacing','-.045em','important');
   strong.style.setProperty('font-weight','950','important');
   strong.style.setProperty('font-variant-numeric','tabular-nums','important');
  }

  const spans=[...text.querySelectorAll('span')];
  spans.forEach((sp,i)=>{
   const fs=i===spans.length-1?clamp(size*.052,7,8):clamp(size*.06,7.5,9);
   sp.style.setProperty('font-size',fs.toFixed(1)+'px','important');
   sp.style.setProperty('line-height','1','important');
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
setTimeout(tune51,200);
setTimeout(tune51,700);
})();
