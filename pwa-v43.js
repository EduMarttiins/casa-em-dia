/* Lousa de Estudos, PWA da versão 43 */
(() => {
  const VERSION='43';
  const PROMPT_KEY='lousa:pwa-install-prompt:v43';
  const RETRY_KEY='lousa:pwa-install-retry:v43';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let readyTimer=null;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ua=(navigator.userAgent||'').toLowerCase();
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isAndroid=/android/.test(ua);
  const isMobileLike=isIOS||isAndroid||/mobile/.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1400);

  function markSeen(){try{localStorage.setItem(PROMPT_KEY,'1')}catch(e){}}
  function wasSeen(){try{return localStorage.getItem(PROMPT_KEY)==='1'}catch(e){return false}}
  function setStatus(text){if(statusEl)statusEl.textContent=text||''}
  function closeModal(remember=true){if(remember)markSeen();if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}}

  function buildModal(){
    if(modal)return;
    modal=document.createElement('div');
    modal.id='v39InstallOverlay';
    modal.className='v39InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v43InstallTitle"><button class="v39InstallClose" type="button" aria-label="Fechar">×</button><img class="v39InstallIcon" src="./icons/lousa-icon-512.png?v=43" alt=""><div class="v39InstallText"><span class="v39InstallBadge">Lousa de Estudos</span><h3 id="v43InstallTitle">Instalar o aplicativo?</h3><p>Adicione a Lousa de Estudos à tela inicial para abrir como um aplicativo.</p><div class="v39InstallStatus" role="status"></div></div><div class="v39InstallActions"><button class="v39InstallPrimary" type="button">Preparando instalação...</button><button class="v39InstallLater" type="button">Agora não</button></div></div>`;
    document.body.appendChild(modal);
    installButton=modal.querySelector('.v39InstallPrimary');
    statusEl=modal.querySelector('.v39InstallStatus');
    installButton.disabled=true;
    installButton.addEventListener('click',installNow);
    modal.querySelector('.v39InstallLater').addEventListener('click',()=>closeModal(true));
    modal.querySelector('.v39InstallClose').addEventListener('click',()=>closeModal(true));
  }

  function showModal(){
    if(isStandalone()||!isMobileLike||wasSeen())return;
    buildModal();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    refreshInstallState();
  }

  function refreshInstallState(){
    if(!installButton)return;
    if(deferredPrompt){
      installButton.disabled=false;
      installButton.textContent='Instalar aplicativo';
      setStatus('Pronto. Toque no botão abaixo e confirme a instalação do Android.');
      return;
    }
    if(isIOS){
      installButton.disabled=false;
      installButton.textContent='Como instalar';
      setStatus('No iPhone ou iPad, use Compartilhar e depois Adicionar à Tela de Início.');
      return;
    }
    installButton.disabled=true;
    installButton.textContent='Preparando instalação...';
    setStatus('Aguarde alguns segundos enquanto o Chrome prepara o instalador do aplicativo.');
    clearTimeout(readyTimer);
    readyTimer=setTimeout(()=>{
      if(deferredPrompt||!installButton)return;
      installButton.disabled=false;
      installButton.textContent='Preparar instalação';
      setStatus('O Chrome ainda não liberou o instalador. Toque abaixo para concluir a preparação e voltar automaticamente.');
    },4500);
  }

  async function installNow(){
    if(isIOS&&!deferredPrompt){
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
      return;
    }

    if(deferredPrompt){
      const promptEvent=deferredPrompt;
      deferredPrompt=null;
      installButton.disabled=true;
      installButton.textContent='Abrindo instalação...';
      try{
        promptEvent.prompt();
        const choice=await promptEvent.userChoice;
        if(choice&&choice.outcome==='accepted'){
          markSeen();
          closeModal(false);
        }else{
          installButton.disabled=false;
          installButton.textContent='Instalar aplicativo';
          setStatus('A instalação foi cancelada. Toque novamente quando quiser instalar.');
        }
      }catch(e){
        setStatus('O Android não abriu o instalador. Vou preparar novamente a página.');
        prepareAndReload();
      }
      return;
    }

    prepareAndReload();
  }

  async function prepareAndReload(){
    if(installButton){installButton.disabled=true;installButton.textContent='Preparando...'}
    try{
      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.register('./sw.js?v=43',{scope:'./'});
        await navigator.serviceWorker.ready;
        await reg.update().catch(()=>{});
      }
    }catch(e){}

    try{
      const already=sessionStorage.getItem(RETRY_KEY)==='1';
      if(!already){
        sessionStorage.setItem(RETRY_KEY,'1');
        const u=new URL(location.href);
        u.searchParams.set('install','1');
        u.searchParams.set('retry','1');
        u.searchParams.set('t',Date.now().toString());
        location.replace(u.toString());
        return;
      }
    }catch(e){}

    if(installButton){
      installButton.disabled=false;
      installButton.textContent='Tentar novamente';
    }
    setStatus('O Chrome ainda não liberou a instalação. Feche esta aba, abra o link novamente no Chrome e toque em Tentar novamente.');
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    try{sessionStorage.removeItem(RETRY_KEY)}catch(e){}
    if(modal&&modal.classList.contains('show'))refreshInstallState();
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    markSeen();
    try{sessionStorage.removeItem(RETRY_KEY)}catch(e){}
    closeModal(false);
  });

  async function boot(){
    if(isStandalone())return;
    try{
      if('serviceWorker' in navigator){
        await navigator.serviceWorker.register('./sw.js?v=43',{scope:'./'});
        await navigator.serviceWorker.ready;
      }
    }catch(e){}
    setTimeout(showModal,700);
  }

  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot,{once:true});
})();

/* Aviso de nova versão no PWA instalado */
(() => {
  if(window.__lousaUpdateWatcher)return;
  window.__lousaUpdateWatcher=true;
  let shownWorker=null;
  let reloading=false;
  function styles(){if(document.getElementById('lousaUpdateStyles'))return;const s=document.createElement('style');s.id='lousaUpdateStyles';s.textContent=`.lousaUpdateOverlay{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}.lousaUpdateCard{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center}.lousaUpdateIcon{font-size:42px}.lousaUpdateCard h3{margin:8px 0;font-size:22px}.lousaUpdateCard p{margin:0;color:#64748b;line-height:1.55}.lousaUpdateBtn{width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px}`;document.head.appendChild(s)}
  function showUpdate(worker){if(!worker||shownWorker===worker)return;shownWorker=worker;styles();document.querySelector('.lousaUpdateOverlay')?.remove();const box=document.createElement('div');box.className='lousaUpdateOverlay';box.innerHTML='<div class="lousaUpdateCard" role="dialog" aria-modal="true"><div class="lousaUpdateIcon">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização. Toque abaixo para instalar a versão mais recente.</p><button class="lousaUpdateBtn" type="button">Atualizar agora</button></div>';document.body.appendChild(box);box.querySelector('.lousaUpdateBtn').addEventListener('click',()=>{const b=box.querySelector('.lousaUpdateBtn');b.disabled=true;b.textContent='Atualizando...';worker.postMessage({type:'SKIP_WAITING'})},{once:true})}
  async function watch(){if(!('serviceWorker' in navigator))return;try{const reg=await navigator.serviceWorker.getRegistration();if(!reg)return;if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w)})});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;location.reload()});const check=()=>reg.update().catch(()=>{});setTimeout(check,700);setInterval(check,60000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()})}catch(e){console.warn('Não foi possível verificar atualização',e)}}
  if(document.readyState==='complete')setTimeout(watch,500);else window.addEventListener('load',()=>setTimeout(watch,500),{once:true});
})();
