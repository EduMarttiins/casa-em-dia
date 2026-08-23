(async()=>{
 'use strict';
 if(window.__CASATODA_19__)return;
 window.__CASATODA_19__=true;
 const q=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 let media=null;
 async function loadMedia(name){const r=await fetch(`./media17/${name}.txt?v=19&t=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`Falha ao carregar foto ${name}`);return (await r.text()).trim()}
 function childName(id){try{return state.children.find(c=>c.id===id)?.name||id}catch(e){return id}}
 function greeting(){
   const kicker=document.querySelector('.brand .kicker');if(kicker)kicker.textContent='CASATODA';
   const h=document.querySelector('.brand h1');if(!h)return;
   let childMode=false;try{childMode=isChildSession()}catch(e){}
   if(childMode)h.textContent=`Olá, ${childName(sessionRole)} 👋`;else h.textContent='Olá, família 👋';
 }
 function putImage(container,src,alt){
   if(!container||!src)return;
   let img=container.querySelector('img');
   if(!img){container.textContent='';img=document.createElement('img');container.appendChild(img)}
   if(img.src!==src)img.src=src;
   img.alt=alt||'';
   img.onerror=()=>{img.onerror=null;img.src=src};
 }
 function visibleIds(){
   try{if(isChildSession())return [sessionRole]}catch(e){}
   try{return state.children.map(c=>c.id)}catch(e){return []}
 }
 function applyPhotos(){
   if(!media)return;
   try{
     putImage(document.querySelector('#authGate [data-login-role="parent"] .profile-photo'),media.family,'Foto da família');
     putImage(document.querySelector('#authGate [data-login-role="bernardo"] .profile-photo'),media.bernardo,'Foto de Bernardo');
     putImage(document.querySelector('#authGate [data-login-role="julia"] .profile-photo'),media.julia,'Foto de Júlia');
   }catch(e){}
   try{
     putImage(document.querySelector('[data-v15-child="bernardo"] .v15-tab-avatar'),media.bernardo,'Foto de Bernardo');
     putImage(document.querySelector('[data-v15-child="julia"] .v15-tab-avatar'),media.julia,'Foto de Júlia');
   }catch(e){}
   try{
     const cards=[...document.querySelectorAll('#people .person')],ids=visibleIds();
     cards.forEach((card,i)=>{const id=card.dataset.person||ids[i];if(id==='bernardo')putImage(card.querySelector('.avatar'),media.bernardo,'Foto de Bernardo');if(id==='julia')putImage(card.querySelector('.avatar'),media.julia,'Foto de Júlia')});
   }catch(e){}
 }
 function applyAll(){greeting();applyPhotos()}
 const baseGate=typeof renderProfileGate==='function'?renderProfileGate:null;
 if(baseGate){renderProfileGate=function(){const out=baseGate();setTimeout(applyAll,0);return out}}
 const baseRender=typeof render==='function'?render:null;
 if(baseRender){render=function(){const out=baseRender();setTimeout(applyAll,0);return out}}
 try{
   const [family,bernardo,julia]=await Promise.all([loadMedia('family'),loadMedia('bernardo'),loadMedia('julia')]);
   media={family,bernardo,julia};
   if(typeof state==='object'&&state){
     state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
     if(Number(state.settings.casaTodaMediaVersion||0)<19){
       state.settings.parentPhoto=family;
       const b=Array.isArray(state.children)?state.children.find(c=>c.id==='bernardo'):null;
       const j=Array.isArray(state.children)?state.children.find(c=>c.id==='julia'):null;
       if(b)b.photo=bernardo;if(j)j.photo=julia;
       state.settings.casaTodaMediaVersion=19;
       try{save()}catch(e){}
     }
   }
   try{renderProfileGate()}catch(e){}
   try{render()}catch(e){}
   applyAll();
 }catch(e){console.error('CasaToda V19 fotos',e);greeting()}
 window.addEventListener('pageshow',()=>setTimeout(applyAll,0));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(applyAll,0)});
})();
