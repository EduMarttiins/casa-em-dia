(async()=>{
  'use strict';
  if(window.__CASATODA_17__)return;
  window.__CASATODA_17__=true;
  const $=id=>document.getElementById(id);
  const esc17=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  document.title='CasaToda';
  const brand=document.querySelector('#authGate .auth-brand');
  if(brand){const h=brand.querySelector('h2'),p=brand.querySelector('p');if(h)h.textContent='CasaToda';if(p)p.textContent='Organização familiar em um só lugar.'}
  const kicker=document.querySelector('.brand .kicker');if(kicker)kicker.textContent='CASATODA';
  const mainTitle=document.querySelector('.brand h1');if(mainTitle)mainTitle.textContent='Organização familiar';
  async function loadMedia(name){const r=await fetch('./media17/'+name+'.txt?v=17&t='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('Falha ao carregar '+name);return (await r.text()).trim()}
  try{
    const [family,bernardo,julia]=await Promise.all([loadMedia('family'),loadMedia('bernardo'),loadMedia('julia')]);
    if(typeof state==='object'&&state){
      state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
      state.settings.parentPhoto ||= family;
      if(Array.isArray(state.children)){
        const b=state.children.find(c=>c.id==='bernardo'); if(b&&!b.photo)b.photo=bernardo;
        const j=state.children.find(c=>c.id==='julia'); if(j&&!j.photo)j.photo=julia;
      }
      try{save()}catch(e){}
    }
    window.renderProfileGate=function(){
      const parentPhoto=state?.settings?.parentPhoto||family;
      const grid=$('profileGrid');if(!grid)return;
      grid.innerHTML=`<div class="auth-family-wrap"><button class="profile-choice parent featured" type="button" data-login-role="parent"><div class="profile-photo parent"><img src="${parentPhoto}" alt="Foto da família"></div><div class="profile-stack"><div class="eyebrow">Área administrativa</div><strong>Família</strong><span>Gerencie rotina, tempo, tarefas e recompensas</span><div class="profile-meta-line">Pais e responsáveis</div></div><span class="profile-lock">🔒</span></button></div><div class="auth-children-shell"><div class="auth-children-title"><b>Perfis das crianças</b><span>Toque para entrar</span></div><div class="auth-children-grid">${state.children.map(c=>`<button class="profile-choice child ${c.id==='julia'?'julia':''}" type="button" data-login-role="${c.id}"><span class="profile-lock">🔒</span><div class="profile-photo">${c.photo?`<img src="${c.photo}" alt="Foto de ${esc17(c.name)}">`:esc17(c.name[0])}</div><div><strong>${esc17(c.name)}</strong><span>Meu perfil</span></div></button>`).join('')}</div></div>`;
      grid.querySelectorAll('[data-login-role]').forEach(b=>b.onclick=()=>{const role=b.dataset.loginRole;if(role==='parent'){pinContinuation=()=>enterSession('parent');if(!state.settings.parentPinHash)openPinSetup();else openPinVerify()}else openChildPinVerify(role)});
    };
    try{renderProfileGate()}catch(e){console.warn(e)}
  }catch(e){console.error('CasaToda mídia',e)}
})();
