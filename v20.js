(async()=>{
 'use strict';
 if(window.__CASATODA_20__)return;
 window.__CASATODA_20__=true;
 const q=id=>document.getElementById(id);
 let media=null;
 async function loadMedia(name){
   const r=await fetch(`./media20/${name}.txt?v=20&t=${Date.now()}`,{cache:'no-store'});
   if(!r.ok)throw new Error(`Falha ao carregar foto ${name}`);
   const s=(await r.text()).trim();
   if(!s.startsWith('data:image/'))throw new Error(`Foto inválida: ${name}`);
   return s;
 }
 function activeId(){
   try{if(isChildSession())return sessionRole}catch(e){}
   try{return selected||'bernardo'}catch(e){return 'bernardo'}
 }
 function child(id){try{return state.children.find(c=>c.id===id)}catch(e){return null}}
 function setActiveTheme(){
   const id=activeId();
   document.body.dataset.activeChild=id;
   const a=q('activeChild');if(a)a.textContent=child(id)?.name||id;
 }
 function putImage(container,src,alt){
   if(!container||!src)return;
   container.textContent='';
   const img=document.createElement('img');
   img.src=src;img.alt=alt||'';img.decoding='async';
   img.onerror=()=>{container.textContent=(alt||'?').replace(/^Foto de /,'').slice(0,1)};
   container.appendChild(img);
 }
 function forcePhotos(){
   if(!media)return;
   try{
     if(typeof state==='object'&&state){
       state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
       state.settings.parentPhoto=media.family;
       const b=child('bernardo'),j=child('julia');
       if(b)b.photo=media.bernardo;if(j)j.photo=media.julia;
       state.settings.casaTodaMediaVersion=20;
       try{save()}catch(e){}
     }
   }catch(e){}
   try{putImage(document.querySelector('#authGate [data-login-role="parent"] .profile-photo'),media.family,'Família')}catch(e){}
   try{putImage(document.querySelector('#authGate [data-login-role="bernardo"] .profile-photo'),media.bernardo,'Bernardo')}catch(e){}
   try{putImage(document.querySelector('#authGate [data-login-role="julia"] .profile-photo'),media.julia,'Júlia')}catch(e){}
   try{putImage(document.querySelector('[data-v15-child="bernardo"] .v15-tab-avatar'),media.bernardo,'Bernardo')}catch(e){}
   try{putImage(document.querySelector('[data-v15-child="julia"] .v15-tab-avatar'),media.julia,'Júlia')}catch(e){}
   try{
     document.querySelectorAll('#people .person').forEach(card=>{
       const id=card.dataset.person||activeId();
       if(id==='bernardo')putImage(card.querySelector('.avatar'),media.bernardo,'Bernardo');
       if(id==='julia')putImage(card.querySelector('.avatar'),media.julia,'Júlia');
     });
   }catch(e){}
 }
 function decorateCard(){
   const id=activeId(),card=document.querySelector('#people .person.selected')||document.querySelector('#people .person');
   if(!card)return;
   let ribbon=card.querySelector('.v20-profile-ribbon');
   if(!ribbon){ribbon=document.createElement('div');ribbon.className='v20-profile-ribbon';card.prepend(ribbon)}
   ribbon.textContent=`Perfil ativo · ${child(id)?.name||id}`;
 }
 function clarifyActions(){
   const id=activeId(),name=child(id)?.name||id;
   const penalty=document.querySelector('[data-v15-tile="penalty"] strong');if(penalty)penalty.textContent=`Descontar de ${name}`;
   const credit=document.querySelector('[data-v15-tile="credit"] strong');if(credit)credit.textContent=`Bônus para ${name}`;
 }
 function applyAll(){setActiveTheme();decorateCard();clarifyActions();forcePhotos()}
 function targetBanner(){
   const form=q('eventForm'),seg=q('childSegment');if(!form||!seg)return;
   let banner=form.querySelector('.v20-target-banner');
   if(!banner){banner=document.createElement('div');seg.insertAdjacentElement('afterend',banner)}
   const id=activeId(),name=child(id)?.name||id;
   banner.className=`v20-target-banner ${id}`;
   banner.innerHTML=`<span>Você está alterando o perfil</span><strong>${name}</strong>`;
 }
 const baseRender=typeof render==='function'?render:null;
 if(baseRender){render=function(){const out=baseRender();requestAnimationFrame(applyAll);return out}}
 const baseGate=typeof renderProfileGate==='function'?renderProfileGate:null;
 if(baseGate){renderProfileGate=function(){const out=baseGate();requestAnimationFrame(forcePhotos);return out}}
 const baseOpen=typeof openEvent==='function'?openEvent:null;
 if(baseOpen){openEvent=function(...args){const out=baseOpen(...args);setTimeout(()=>{setActiveTheme();targetBanner()},0);return out}}
 document.addEventListener('click',e=>{
   const tab=e.target.closest('[data-v15-child]');
   if(tab)setTimeout(applyAll,0);
   const childBtn=e.target.closest('#childSegment [data-child]');
   if(childBtn)setTimeout(()=>{
     try{selected=childBtn.dataset.child}catch(e){}
     setActiveTheme();targetBanner();
   },0);
 });
 try{
   const [family,bernardo,julia]=await Promise.all([loadMedia('family'),loadMedia('bernardo'),loadMedia('julia')]);
   media={family,bernardo,julia};
   forcePhotos();
   try{renderProfileGate()}catch(e){}
   try{render()}catch(e){}
   applyAll();
 }catch(e){console.error('CasaToda V20 fotos',e);applyAll()}
 window.addEventListener('resize',()=>setTimeout(applyAll,0));
 window.addEventListener('pageshow',()=>setTimeout(applyAll,0));
})();
