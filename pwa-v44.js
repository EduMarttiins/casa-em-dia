/* Lousa de Estudos, PWA da versão 44
   Um único registro de service worker e fluxo de instalação sem recarga em loop. */
(() => {
  const VERSION='44';
  const INSTALL_SEEN='lousa:pwa-install-prompt:v44';
  const MIGRATION_RELOAD='lousa:sw-migrated:v44';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let installTimer=null;
  let controllerReloading=false;

  const ua=(navigator.userAgent||'').toLowerCase();
  const isAndroid=/android/.test(ua);
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isMobileLike=isAndroid||isIOS||/mobile/.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1500);
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function hasSeen(){try{return localStorage.getItem(INSTALL_SEEN)==='1'}catch(e){return false}}
  function markSeen(){try{localStorage.setItem(INSTALL_SEEN,'1')}catch(e){}}
  function setStatus(text){if(statusEl)statusEl.textContent=text||''}
  function hideInstall(remember=false){
    if(remember)markSeen();
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
  }

  function chromeIntent(){
    const httpsUrl=new URL('./v44.html?v=44&install=1&chrome=1',location.href).toString();
    const u=new URL(httpsUrl);
    const target=(u.host+u.pathname+u.search).replace(/^\/+/, '');
    return 'intent://'+target+'#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(httpsUrl)+';end';
  }

  function buildInstallModal(){
    if(modal)return;
    modal=document.createElement('div');
    modal.id='v39InstallOverlay';
    modal.className='v39InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v44InstallTitle">
      <button class="v39InstallClose" type="button" aria-label="Fechar">×</button>
      <img class="v39InstallIcon" src="./icons/lousa-icon-512.png?v=44" alt="">
      <div class="v39InstallText">
        <span class="v39InstallBadge">Lousa de Estudos</span>
        <h3 id="v44InstallTitle">Instalar o aplicativo?</h3>
        <p>Adicione a Lousa de Estudos à tela inicial para abrir como um aplicativo.</p>
        <div class="v39InstallStatus" role="status"></div>
      </div>
      <div class="v39InstallActions">
        <button class="v39InstallPrimary" type="button">Preparando instalação...</button>
        <button class="v39InstallLater" type="button">Agora não</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    installButton=modal.querySelector('.v39InstallPrimary');
    statusEl=modal.querySelector('.v39InstallStatus');
    installButton.disabled=true;
    installButton.addEventListener('click',installNow);
    modal.querySelector('.v39InstallLater').addEventListener('click',()=>hideInstall(true));
    modal.querySelector('.v39InstallClose').addEventListener('click',()=>hideInstall(true));
  }

  function setReadyToInstall(){
    clearTimeout(installTimer);
    if(!installButton)return;
    installButton.disabled=false;
    installButton.textContent='Instalar aplicativo';
    setStatus('Pronto. Toque abaixo e confirme a instalação do Android.');
  }

  function setBrowserFallback(){
    if(!installButton)return;
    installButton.disabled=false;
    if(isAndroid){
      installButton.textContent='Abrir no Chrome e instalar';
      setStatus('Esta aba não liberou o instalador. Toque abaixo para abrir a Lousa no Chrome e concluir a instalação.');
    }else if(isIOS){
      installButton.textContent='Como instalar';
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
    }else{
      installButton.textContent='Tentar instalar';
      setStatus('O navegador ainda não liberou a instalação. Abra esta página em uma aba normal do navegador.');
    }
  }

  function showInstall(){
    if(isStandalone()||!isMobileLike||hasSeen())return;
    buildInstallModal();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');

    if(deferredPrompt){
      setReadyToInstall();
      return;
    }

    installButton.disabled=true;
    installButton.textContent='Preparando instalação...';
    setStatus('Aguarde alguns segundos enquanto o navegador verifica o aplicativo.');
    clearTimeout(installTimer);
    installTimer=setTimeout(()=>{
      if(!deferredPrompt)setBrowserFallback();
    },4500);
  }

  async function installNow(){
    if(deferredPrompt){
      const event=deferredPrompt;
      deferredPrompt=null;
      installButton.disabled=true;
      installButton.textContent='Abrindo instalação...';
      try{
        await event.prompt();
        const choice=await event.userChoice;
        if(choice&&choice.outcome==='accepted'){
          markSeen();
          hideInstall(false);
        }else{
          installButton.disabled=false;
          installButton.textContent='Instalar aplicativo';
          setStatus('A instalação foi cancelada. Toque novamente quando quiser.');
        }
      }catch(error){
        setBrowserFallback();
      }
      return;
    }

    if(isAndroid){
      location.href=chromeIntent();
      return;
    }
    if(isIOS){
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
      return;
    }
    setBrowserFallback();
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    if(modal&&modal.classList.contains('show'))setReadyToInstall();
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    markSeen();
    hideInstall(false);
  });

  function updateStyles(){
    if(document.getElementById('lousaUpdateStyles'))return;
    const s=document.createElement('style');
    s.id='lousaUpdateStyles';
    s.textContent=`.lousaUpdateOverlay{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}.lousaUpdateCard{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center}.lousaUpdateIcon{font-size:42px}.lousaUpdateCard h3{margin:8px 0;font-size:22px}.lousaUpdateCard p{margin:0;color:#64748b;line-height:1.55}.lousaUpdateBtn{width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px}`;
    document.head.appendChild(s);
  }

  function showUpdate(worker){
    if(!worker||document.querySelector('.lousaUpdateOverlay'))return;
    updateStyles();
    const box=document.createElement('div');
    box.className='lousaUpdateOverlay';
    box.innerHTML='<div class="lousaUpdateCard" role="dialog" aria-modal="true"><div class="lousaUpdateIcon">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização.</p><button class="lousaUpdateBtn" type="button">Atualizar agora</button></div>';
    document.body.appendChild(box);
    box.querySelector('.lousaUpdateBtn').addEventListener('click',()=>{
      const b=box.querySelector('.lousaUpdateBtn');
      b.disabled=true;
      b.textContent='Atualizando...';
      worker.postMessage({type:'SKIP_WAITING'});
    },{once:true});
  }

  function activateForBrowser(worker){
    if(worker)worker.postMessage({type:'SKIP_WAITING'});
  }

  async function registerWorker(){
    if(!('serviceWorker' in navigator))return null;

    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(controllerReloading)return;
      if(isStandalone()){
        controllerReloading=true;
        location.reload();
        return;
      }
      try{
        if(sessionStorage.getItem(MIGRATION_RELOAD)==='1')return;
        sessionStorage.setItem(MIGRATION_RELOAD,'1');
      }catch(e){}
      controllerReloading=true;
      const u=new URL('./v44.html',location.href);
      u.searchParams.set('v','44');
      u.searchParams.set('install','1');
      u.searchParams.set('updated','1');
      location.replace(u.toString());
    });

    const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
    await reg.update().catch(()=>{});

    const handleInstalled=worker=>{
      if(!worker||worker.state!=='installed'||!navigator.serviceWorker.controller)return;
      if(isStandalone())showUpdate(worker);
      else activateForBrowser(worker);
    };

    if(reg.waiting&&navigator.serviceWorker.controller){
      if(isStandalone())showUpdate(reg.waiting);
      else activateForBrowser(reg.waiting);
    }

    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>handleInstalled(worker));
    });

    return reg;
  }

  async function boot(){
    if(isStandalone()){
      try{await registerWorker()}catch(e){console.warn('PWA: atualização indisponível',e)}
      return;
    }

    try{await registerWorker()}catch(e){console.warn('PWA: registro indisponível',e)}
    setTimeout(showInstall,900);
  }

  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot,{once:true});
})();
