(()=>{
 'use strict';
 if(window.__CASATODA_21__)return;
 window.__CASATODA_21__=true;
 const PHOTO={
  family:new URL('./media21/family.jpg?v=22',location.href).href,
  bernardo:new URL('./media21/bernardo.jpg?v=22',location.href).href,
  julia:new URL('./media21/julia.jpg?v=22',location.href).href
 };
 let scheduled=false,saving=false;
 function put(container,src,alt){
  if(!container)return;
  let img=container.querySelector('img');
  if(!img){container.textContent='';img=document.createElement('img');container.appendChild(img)}
  img.alt=alt||'';
  if(img.src!==src)img.src=src;
  img.decoding='async';
  img.loading='eager';
  img.onerror=()=>{setTimeout(()=>{img.src=src+'&r='+Date.now()},120)};
 }
 function persist(){
  try{
   if(typeof state!=='object'||!state)return;
   state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
   let changed=false;
   if(state.settings.parentPhoto!==PHOTO.family){state.settings.parentPhoto=PHOTO.family;changed=true}
   if(Array.isArray(state.children)){
    const b=state.children.find(c=>c.id==='bernardo');
    const j=state.children.find(c=>c.id==='julia');
    if(b&&b.photo!==PHOTO.bernardo){b.photo=PHOTO.bernardo;changed=true}
    if(j&&j.photo!==PHOTO.julia){j.photo=PHOTO.julia;changed=true}
   }
   if(state.settings.casaTodaMediaVersion!==22){state.settings.casaTodaMediaVersion=22;changed=true}
   if(changed&&!saving&&typeof save==='function'){saving=true;try{save()}finally{setTimeout(()=>saving=false,0)}}
  }catch(e){console.warn('CasaToda fotos persistência',e)}
 }
 function apply(){
  scheduled=false;
  persist();
  put(document.querySelector('#authGate [data-login-role="parent"] .profile-photo'),PHOTO.family,'Família');
  put(document.querySelector('#authGate [data-login-role="bernardo"] .profile-photo'),PHOTO.bernardo,'Bernardo');
  put(document.querySelector('#authGate [data-login-role="julia"] .profile-photo'),PHOTO.julia,'Júlia');
  put(document.querySelector('[data-v15-child="bernardo"] .v15-tab-avatar'),PHOTO.bernardo,'Bernardo');
  put(document.querySelector('[data-v15-child="julia"] .v15-tab-avatar'),PHOTO.julia,'Júlia');
  document.querySelectorAll('#people .person').forEach(card=>{
   let id=card.dataset.person;
   if(!id){try{id=(typeof isChildSession==='function'&&isChildSession())?sessionRole:selected}catch(e){}}
   if(id==='bernardo')put(card.querySelector('.avatar'),PHOTO.bernardo,'Bernardo');
   if(id==='julia')put(card.querySelector('.avatar'),PHOTO.julia,'Júlia');
  });
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
 const obs=new MutationObserver(schedule);
 obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
 window.addEventListener('error',e=>{if(e.target&&e.target.tagName==='IMG')schedule()},true);
 window.addEventListener('pageshow',schedule);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
 document.addEventListener('click',()=>setTimeout(schedule,0),true);
 setTimeout(schedule,0);setTimeout(schedule,300);setTimeout(schedule,1200);setTimeout(schedule,3000);
})();
