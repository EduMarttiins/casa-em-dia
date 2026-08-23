(async()=>{
  'use strict';
  if(window.__CASATODA_18__) return;
  window.__CASATODA_18__=true;

  const q=id=>document.getElementById(id);
  const BASE_CUTOFF=22*60;
  const clamp=n=>Math.max(0,Math.min(1439,Math.round(Number(n||0))));
  const hm=n=>{n=clamp(n);return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
  const parseHm=v=>{const m=String(v||'').match(/^(\d{1,2}):(\d{2})$/);if(!m)return BASE_CUTOFF;return clamp(Number(m[1])*60+Number(m[2]))};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  document.title='CasaToda';
  const brand=document.querySelector('#authGate .auth-brand');
  if(brand){
    const h=brand.querySelector('h2'),p=brand.querySelector('p');
    if(h)h.textContent='CasaToda';
    if(p)p.textContent='Organização familiar em um só lugar.';
  }
  const kicker=document.querySelector('.brand .kicker');if(kicker)kicker.textContent='CASATODA';
  const mainTitle=document.querySelector('.brand h1');if(mainTitle)mainTitle.textContent='Organização familiar';
  const creditLabel=q('creditBtn')?.querySelector('span:last-child');if(creditLabel)creditLabel.textContent='Bônus';

  function ensureCutoffSettings(){
    if(typeof state!=='object'||!state)return;
    state.settings=state.settings&&typeof state.settings==='object'?state.settings:{};
    if(!state.settings.cutoffMinutes||typeof state.settings.cutoffMinutes!=='object')state.settings.cutoffMinutes={bernardo:BASE_CUTOFF,julia:BASE_CUTOFF};
    for(const id of ['bernardo','julia']){
      const value=Number(state.settings.cutoffMinutes[id]);
      if(!Number.isFinite(value))state.settings.cutoffMinutes[id]=BASE_CUTOFF;
    }
  }
  function baseCutoff(id){ensureCutoffSettings();return Number(state.settings.cutoffMinutes[id]??BASE_CUTOFF)}
  function dayRecord(id,key){
    try{
      const d=key&&typeof ensureDay==='function'?ensureDay(key):ensureDay();
      return d?.children?.[id]||{lost:0,gained:0,tasks:{}};
    }catch(e){return {lost:0,gained:0,tasks:{}}}
  }
  function cutoffInfo(id,key){
    const r=dayRecord(id,key),base=baseCutoff(id),lost=Number(r.lost||0),gained=Number(r.gained||0),final=clamp(base-lost+gained);
    return {base,lost,gained,final,baseLabel:hm(base),finalLabel:hm(final)};
  }

  async function loadMedia(name){
    const r=await fetch(`./media17/${name}.txt?v=18&t=${Date.now()}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`Falha ao carregar foto ${name}`);
    return (await r.text()).trim();
  }

  let media=null;
  try{
    const [family,bernardo,julia]=await Promise.all([loadMedia('family'),loadMedia('bernardo'),loadMedia('julia')]);
    media={family,bernardo,julia};
    ensureCutoffSettings();
    if(typeof state==='object'&&state){
      const needsMediaMigration=Number(state.settings.casaTodaMediaVersion||0)<18;
      if(needsMediaMigration){
        state.settings.parentPhoto=family;
        const b=Array.isArray(state.children)?state.children.find(c=>c.id==='bernardo'):null;
        const j=Array.isArray(state.children)?state.children.find(c=>c.id==='julia'):null;
        if(b)b.photo=bernardo;
        if(j)j.photo=julia;
        state.settings.casaTodaMediaVersion=18;
      }
      try{save()}catch(e){}
    }
  }catch(e){console.error('CasaToda fotos',e)}

  const baseRenderProfileGate=typeof renderProfileGate==='function'?renderProfileGate:null;
  renderProfileGate=function(){
    if(!media){if(baseRenderProfileGate)return baseRenderProfileGate();return}
    const grid=q('profileGrid');if(!grid)return;
    const parentPhoto=state?.settings?.parentPhoto||media.family;
    const children=Array.isArray(state?.children)?state.children:[];
    grid.innerHTML=`
      <div class="auth-family-wrap">
        <button class="profile-choice parent featured" type="button" data-login-role="parent">
          <div class="profile-photo parent"><img src="${parentPhoto}" alt="Foto da família"></div>
          <div class="profile-stack"><div class="eyebrow">Área administrativa</div><strong>Família</strong><span>Rotina, horários e recompensas</span><div class="profile-meta-line">Pais e responsáveis</div></div>
          <span class="profile-lock">🔒</span>
        </button>
      </div>
      <div class="auth-children-shell">
        <div class="auth-children-title"><b>Perfis das crianças</b><span>Toque para entrar</span></div>
        <div class="auth-children-grid">${children.map(c=>{
          const fallback=c.id==='bernardo'?media.bernardo:c.id==='julia'?media.julia:'';
          const src=c.photo||fallback;
          return `<button class="profile-choice child ${c.id==='julia'?'julia':''}" type="button" data-login-role="${c.id}"><span class="profile-lock">🔒</span><div class="profile-photo">${src?`<img src="${src}" alt="Foto de ${esc(c.name)}">`:esc(c.name?.[0]||'?')}</div><div><strong>${esc(c.name)}</strong><span>Meu perfil</span></div></button>`
        }).join('')}</div>
      </div>`;
    grid.querySelectorAll('[data-login-role]').forEach(btn=>btn.onclick=()=>{
      const role=btn.dataset.loginRole;
      if(role==='parent'){
        pinContinuation=()=>enterSession('parent');
        if(!state.settings.parentPinHash)openPinSetup();else openPinVerify();
      }else openChildPinVerify(role);
    });
  };

  const baseRender=typeof render==='function'?render:null;
  function visibleChildIds(){
    if(typeof isChildSession==='function'&&isChildSession())return [sessionRole];
    return Array.isArray(state?.children)?state.children.map(c=>c.id):[];
  }
  function decorateDashboard(){
    ensureCutoffSettings();
    const cards=[...document.querySelectorAll('#people .person')];
    const ids=visibleChildIds();
    cards.forEach((card,i)=>{
      const id=card.dataset.person||ids[i];if(!id)return;
      const info=cutoffInfo(id);
      const child=state.children.find(c=>c.id===id);
      const r=dayRecord(id);
      const taskCount=Array.isArray(state.tasks)?state.tasks.length:0;
      const done=Array.isArray(state.tasks)?state.tasks.filter(t=>(r.tasks||{})[t.id]==='done').length:0;
      const meta=card.querySelector('.meta');if(meta)meta.textContent=`Desligar hoje às ${info.finalLabel}`;
      const strong=card.querySelector('.ring-text strong');if(strong)strong.textContent=info.finalLabel;
      const label=card.querySelector('.ring-text span');if(label)label.textContent='desligar';
      const stats=card.querySelector('.person-stats');
      if(stats)stats.innerHTML=`<div class="stat"><span>Horário base</span><strong>${info.baseLabel}</strong></div><div class="stat bad"><span>Perdido hoje</span><strong>${mins(info.lost)}</strong></div><div class="stat good"><span>Bônus hoje</span><strong>${mins(info.gained)}</strong></div>`;
      const oldLine=card.querySelector('.progressline');
      if(oldLine){
        oldLine.className='clockline';
        oldLine.innerHTML=`<div class="clock-route"><span class="clock-start">${info.baseLabel}</span><span class="clock-arrow">→</span><strong>${info.finalLabel}</strong></div><div class="clock-sub">${child?.name||''} · ${done} de ${taskCount} tarefas concluídas</div>`;
      }
      card.style.setProperty('--cutoff-tone',id==='julia'?'#8b5cf6':'#4d7cff');
    });
    const activeId=(typeof selected!=='undefined'&&selected)||ids[0];
    if(activeId){
      const info=cutoffInfo(activeId),child=state.children.find(c=>c.id===activeId),r=dayRecord(activeId);
      const total=Array.isArray(state.tasks)?state.tasks.length:0,done=Array.isArray(state.tasks)?state.tasks.filter(t=>(r.tasks||{})[t.id]==='done').length:0;
      const status=q('routineStatus');if(status)status.textContent=`${child?.name||'Perfil'} desliga às ${info.finalLabel} · ${done} de ${total} tarefas concluídas`;
    }
  }
  if(baseRender){
    render=function(){const result=baseRender();decorateDashboard();return result};
  }

  function cutoffAfterEvent(key,childId,eventId){
    let current=baseCutoff(childId);
    let events=[];
    try{events=eventsForDate(key).filter(e=>e.childId===childId).sort((a,b)=>String(a.ts).localeCompare(String(b.ts)))}catch(e){}
    for(const ev of events){
      if(ev.type==='penalty')current-=Number(ev.minutes||0);
      else if(ev.type==='credit'||(ev.type==='reward'&&Number(ev.minutes||0)>0))current+=Number(ev.minutes||0);
      current=clamp(current);
      if(ev.id===eventId)break;
    }
    return hm(current);
  }
  const baseRenderHistory=typeof renderHistory==='function'?renderHistory:null;
  if(baseRenderHistory){
    renderHistory=function(){
      const result=baseRenderHistory();
      try{
        const key=historyDateKey;
        const currentFilter=filter;
        const events=eventsForDate(key).filter(e=>currentFilter==='all'||e.childId===currentFilter).sort((a,b)=>String(b.ts).localeCompare(String(a.ts)));
        const rows=[...document.querySelectorAll('#historyList .historyrow')];
        rows.forEach((row,i)=>{
          const ev=events[i];if(!ev||!['penalty','credit','reward'].includes(ev.type))return;
          const body=row.children[1];if(!body)return;
          let chip=body.querySelector('.v18-history-clock');
          if(!chip){chip=document.createElement('div');chip.className='v18-history-clock';body.appendChild(chip)}
          chip.textContent=`Novo horário: ${cutoffAfterEvent(key,ev.childId,ev.id)}`;
        });
      }catch(e){console.warn('Histórico V18',e)}
      return result;
    };
  }

  function installCutoffSettings(){
    const sheet=q('settingsSheet');if(!sheet||sheet.querySelector('.v18-cutoff-settings'))return;
    const groups=[...sheet.querySelectorAll('.settings-group')];
    const legacy=groups[0];if(!legacy)return;
    legacy.classList.add('v18-legacy-time');
    const box=document.createElement('div');box.className='settings-group v18-cutoff-settings';
    box.innerHTML=`<h4>Horário padrão de desligar</h4><p>O padrão é 22:00. Cada desconto antecipa esse horário e cada bônus pode adiá lo.</p><div class="two"><div class="field"><span>Bernardo</span><input id="cutoffB" type="time" step="60"></div><div class="field"><span>Júlia</span><input id="cutoffJ" type="time" step="60"></div></div><button class="primary" id="saveCutoffs" type="button">Salvar horários</button>`;
    legacy.insertAdjacentElement('afterend',box);
    q('saveCutoffs').onclick=()=>{
      ensureCutoffSettings();
      state.settings.cutoffMinutes.bernardo=parseHm(q('cutoffB').value);
      state.settings.cutoffMinutes.julia=parseHm(q('cutoffJ').value);
      save();render();toast('Horários de desligar atualizados.');
    };
  }
  function syncCutoffSettings(){
    installCutoffSettings();ensureCutoffSettings();
    if(q('cutoffB'))q('cutoffB').value=hm(state.settings.cutoffMinutes.bernardo);
    if(q('cutoffJ'))q('cutoffJ').value=hm(state.settings.cutoffMinutes.julia);
  }
  installCutoffSettings();
  q('settingsBtn')?.addEventListener('click',()=>setTimeout(syncCutoffSettings,0));

  function ensureEventPreview(){
    const form=q('eventForm');if(!form)return;
    let preview=form.querySelector('.v18-cutoff-preview');
    if(!preview){
      preview=document.createElement('div');preview.className='v18-cutoff-preview';
      const segment=q('childSegment');if(segment)segment.insertAdjacentElement('afterend',preview);else form.prepend(preview);
    }
    const update=()=>{
      try{
        const id=selected,info=cutoffInfo(id),minutes=Math.max(0,Number(q('minutes')?.value||0));
        const isPenalty=eventMode==='penalty';
        const next=clamp(info.final+(isPenalty?-minutes:minutes));
        preview.innerHTML=`<span>${isPenalty?'Se confirmar o desconto':'Se confirmar o bônus'}</span><strong>${info.finalLabel} → ${hm(next)}</strong>`;
      }catch(e){}
    };
    update();
    form.addEventListener('input',e=>{if(['minutes','qty','reason'].includes(e.target?.id))setTimeout(update,0)});
    form.addEventListener('click',()=>setTimeout(update,0));
  }
  const baseOpenEvent=typeof openEvent==='function'?openEvent:null;
  if(baseOpenEvent){
    openEvent=function(...args){
      const result=baseOpenEvent(...args);
      try{
        if(eventMode==='penalty'){
          if(q('eventTitle'))q('eventTitle').textContent='Antecipar horário';
          if(q('eventSubmit'))q('eventSubmit').textContent='Confirmar desconto';
        }else{
          if(q('eventTitle'))q('eventTitle').textContent='Adiar horário';
          if(q('eventSubmit'))q('eventSubmit').textContent='Adicionar bônus';
        }
        ensureEventPreview();
      }catch(e){}
      return result;
    };
  }

  try{renderProfileGate()}catch(e){console.warn(e)}
  try{render()}catch(e){console.warn(e)}
})();