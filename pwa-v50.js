/* Lousa de Estudos, PWA versão 50.
   Usa a arquitetura da versão 41 e tenta abrir o pedido nativo de instalação ao entrar. */
(() => {
  const PROMPT_KEY='lousa:pwa-install-prompt:v50';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let autoTried=false;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ua=(navigator.userAgent||'').toLowerCase();
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isAndroid=/android/.test(ua);
  const isMobileLike=isIOS||isAndroid||/mobile/.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1600);

  function markSeen(){try{localStorage.setItem(PROMPT_KEY,'1')}catch(e){}}
  function setStatus(text){if(statusEl)statusEl.textContent=text||''}
  function closeModal(remember=false){if(remember)markSeen();if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}}

  function instructions(){
    if(isIOS)return 'No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.';
    if(isAndroid)return 'No Chrome ou Samsung Internet, use a opção Instalar aplicativo ou Adicionar à tela inicial do menu do navegador.';
    return 'Use a opção Instalar aplicativo ou Adicionar à tela inicial do navegador.';
  }

  function buildModal(){
    if(modal)return;
    modal=document.createElement('div');
    modal.id='v39InstallOverlay';
    modal.className='v39InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v50InstallTitle"><button class="v39InstallClose" type="button" aria-label="Fechar">×</button><img class="v39InstallIcon" src="./icons/lousa-icon-v35.jpg?v=50" alt=""><div class="v39InstallText"><span class="v39InstallBadge">Lousa de Estudos</span><h3 id="v50InstallTitle">Adicionar à tela inicial?</h3><p>Abra a Lousa como um aplicativo, direto pelo ícone do celular ou tablet.</p><div class="v39InstallStatus" role="status"></div></div><div class="v39InstallActions"><button class="v39InstallPrimary" type="button">Adicionar agora</button><button class="v39InstallLater" type="button">Agora não</button></div></div>`;
    document.body.appendChild(modal);
    installButton=modal.querySelector('.v39InstallPrimary');
    statusEl=modal.querySelector('.v39InstallStatus');
    modal.querySelector('.v39InstallLater').addEventListener('click',()=>closeModal(true));
    modal.querySelector('.v39InstallClose').addEventListener('click',()=>closeModal(true));
    installButton.addEventListener('click',async()=>{
      if(!deferredPrompt){setStatus(instructions());installButton.textContent='Entendi';installButton.onclick=()=>closeModal(true);return}
      const ev=deferredPrompt;
      try{
        installButton.disabled=true;installButton.textContent='Abrindo instalação...';
        await ev.prompt();
        const choice=await ev.userChoice;
        deferredPrompt=null;
        if(choice&&choice.outcome==='accepted'){markSeen();closeModal(false)}
        else{installButton.disabled=false;installButton.textContent='Como adicionar';setStatus(instructions())}
      }catch(error){installButton.disabled=false;installButton.textContent='Como adicionar';setStatus(instructions())}
    });
  }

  function showModal(message){
    if(isStandalone()||!isMobileLike)return;
    buildModal();
    modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    if(deferredPrompt){installButton.disabled=false;installButton.textContent='Adicionar agora';setStatus(message||'Toque em Adicionar agora e confirme a janela do Android.');}
    else{installButton.disabled=false;installButton.textContent='Como adicionar';setStatus(message||instructions());}
  }

  async function tryAutomaticPrompt(){
    if(autoTried||!deferredPrompt||isStandalone())return;
    autoTried=true;
    const ev=deferredPrompt;
    try{
      await ev.prompt();
      const choice=await ev.userChoice;
      deferredPrompt=null;
      if(choice&&choice.outcome==='accepted'){markSeen();closeModal(false)}
      else showModal('A instalação automática não foi confirmada. Você também pode adicionar a Lousa pelo menu do navegador.');
    }catch(error){
      autoTried=false;
      showModal('O navegador exige uma confirmação para adicionar a Lousa à tela inicial.');
    }
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    setTimeout(tryAutomaticPrompt,250);
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;markSeen();closeModal(false);
  });

  window.addEventListener('load',()=>{
    if(isStandalone())return;
    setTimeout(()=>{
      if(deferredPrompt)tryAutomaticPrompt();
      else showModal('Se o navegador não abrir a confirmação automaticamente, use a opção abaixo.');
    },1400);
  },{once:true});
})();

/* Aviso controlado de nova versão dentro do PWA instalado. */
(() => {
  if(window.__lousaUpdateWatcherV50)return;
  window.__lousaUpdateWatcherV50=true;
  let shownWorker=null;
  function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
  function styles(){
    if(document.getElementById('lousaUpdateStylesV50'))return;
    const s=document.createElement('style');s.id='lousaUpdateStylesV50';
    s.textContent='.lousaUpdateOverlayV50{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}.lousaUpdateCardV50{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center}.lousaUpdateCardV50 h3{margin:8px 0;font-size:22px}.lousaUpdateCardV50 p{margin:0;color:#64748b;line-height:1.55}.lousaUpdateBtnV50{width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px}';
    document.head.appendChild(s);
  }
  function showUpdate(worker){
    if(!isStandalone()||!worker||shownWorker===worker)return;
    shownWorker=worker;styles();
    document.querySelector('.lousaUpdateOverlayV50')?.remove();
    const box=document.createElement('div');box.className='lousaUpdateOverlayV50';
    box.innerHTML='<div class="lousaUpdateCardV50" role="dialog" aria-modal="true"><div style="font-size:42px">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização.</p><button class="lousaUpdateBtnV50" type="button">Atualizar agora</button></div>';
    document.body.appendChild(box);
    box.querySelector('.lousaUpdateBtnV50').addEventListener('click',()=>{const b=box.querySelector('.lousaUpdateBtnV50');b.disabled=true;b.textContent='Atualizando...';worker.postMessage({type:'SKIP_WAITING'})},{once:true});
  }
  async function watch(){
    if(!('serviceWorker' in navigator))return;
    try{
      const reg=await navigator.serviceWorker.getRegistration();if(!reg)return;
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w)})});
      const check=()=>reg.update().catch(()=>{});setTimeout(check,600);setInterval(check,60000);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
    }catch(e){}
  }
  if(document.readyState==='complete')setTimeout(watch,500);else window.addEventListener('load',()=>setTimeout(watch,500),{once:true});
})();
