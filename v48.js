(()=>{
'use strict';
if(window.__CASATODA_48__)return;
window.__CASATODA_48__=true;

function isParent48(){
 try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}
}

function protectFooter(){
 if(!isParent48())return;
 const app=document.querySelector('.app');
 const nav=document.querySelector('.nav');
 if(!app||!nav)return;
 const ar=app.getBoundingClientRect();
 const nr=nav.getBoundingClientRect();
 const available=Math.max(320,Math.floor(nr.top-ar.top));
 app.style.setProperty('height',available+'px','important');
 app.style.setProperty('max-height',available+'px','important');
 app.style.setProperty('overflow-y','auto','important');
 app.style.setProperty('overflow-x','hidden','important');
 app.style.setProperty('padding-bottom','26px','important');
 app.style.setProperty('scroll-padding-bottom','28px','important');
}

function centerParentBadge(){
 const b=document.querySelector('.session-badge');
 if(!b)return;
 b.style.setProperty('display','grid','important');
 b.style.setProperty('place-items','center','important');
 b.style.setProperty('text-align','center','important');
 b.style.setProperty('line-height','1','important');
}

function tune48(){
 protectFooter();
 centerParentBadge();
}

const obs=new MutationObserver(()=>requestAnimationFrame(tune48));
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('pageshow',()=>setTimeout(tune48,0));
window.addEventListener('resize',()=>setTimeout(tune48,80));
window.addEventListener('orientationchange',()=>setTimeout(tune48,180));
document.addEventListener('click',()=>setTimeout(tune48,0),true);
setTimeout(tune48,0);
setTimeout(tune48,250);
setTimeout(tune48,900);
})();
