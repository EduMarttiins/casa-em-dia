(()=>{
'use strict';
if(window.__CASATODA_26__)return;
window.__CASATODA_26__=true;
const q=(s,p=document)=>p.querySelector(s);
function activeId(){
 try{if(typeof isChildSession==='function'&&isChildSession())return sessionRole}catch(e){}
 try{return selected||'bernardo'}catch(e){return 'bernardo'}
}
function child(id){try{return state.children.find(c=>c.id===id)}catch(e){return null}}
function tune(){
 const id=activeId(),c=child(id);
 document.body.dataset.activeChild=id;
 const kicker=q('.brand .kicker');if(kicker)kicker.textContent='CASATODA';
 const title=q('.brand h1');if(title){let childMode=false;try{childMode=isChildSession()}catch(e){}title.textContent=childMode?`Olá, ${c?.name||'você'} 👋`:'Olá, família 👋'}
 const card=q('#people .person.selected')||q('#people .person');
 if(card){
  if(!card.dataset.person)card.dataset.person=id;
  let ribbon=q('.v20-profile-ribbon',card);
  if(!ribbon){ribbon=document.createElement('div');ribbon.className='v20-profile-ribbon';card.prepend(ribbon)}
  ribbon.textContent=`Perfil ativo · ${c?.name||id}`;
  card.style.setProperty('--cutoff-tone',id==='julia'?'#c59cff':'#5aa2ff');
 }
 const active=q('#activeChild');if(active)active.textContent=c?.name||'';
 let childMode=false;try{childMode=isChildSession()}catch(e){}
 const head=q('.actions .section-head h2');if(head)head.textContent=childMode?'Atalhos':'Ações rápidas';
 const sub=q('.actions .section-head p');if(sub)sub.textContent=childMode?'Tudo do seu perfil em um toque':'Escolha o que deseja fazer';
}
const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();requestAnimationFrame(tune);return x}}
document.addEventListener('click',e=>{if(e.target.closest('[data-v15-child],#childSegment [data-child]'))setTimeout(tune,0)},true);
window.addEventListener('pageshow',()=>setTimeout(tune,0));
setTimeout(()=>{try{if(typeof render==='function')render()}catch(e){}tune()},0);
})();
