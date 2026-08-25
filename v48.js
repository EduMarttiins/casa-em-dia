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
 const safe=Math.max(74,Math.ceil(nav.getBoundingClientRect().height)+14);
 app.style.setProperty('height','auto','important');
 app.style.setProperty('max-height','none','important');
 app.style.setProperty('overflow','visible','important');
 app.style.setProperty('padding-bottom',safe+'px','important');
 app.style.setProperty('scroll-padding-bottom',safe+'px','important');
 document.body.style.setProperty('overflow-y','auto','important');
 document.body.style.setProperty('overflow-x','hidden','important');
}

function centerParentBadge(){
 const b=document.querySelector('.session-badge');
 if(!b)return;
 b.style.setProperty('display','grid','important');
 b.style.setProperty('place-items','center','important');
 b.style.setProperty('text-align','center','important');
 b.style.setProperty('line-height','1','important');
}

function tune48(){protectFooter();centerParentBadge()}
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
