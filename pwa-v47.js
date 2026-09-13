/* Lousa de Estudos, instalação simples restaurada na versão 47 */
(() => {
  const PROMPT_KEY='lousa:pwa-install-prompt:v47';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let buttonMode='install';
  let updateRequested=false;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ua=(navigator.userAgent||'').toLowerCase();
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isAndroid=/android/.test(ua);
  const isMobileLike=isIOS||isAndroid||/mobile/.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1500);

  function markSeen(){try{localStorage.setItem(PROMPT_KEY,'1')}catch(e){}}
  function wasSeen(){try{return localStorage.getItem(PROMPT_KEY)==='1'}catch(e){return false}}
  function setStatus(text){if(statusEl)statusEl.textContent=text||''}
  function closeModal(remember=true){if(remember)markSeen();if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}}

  function showInstructions(){
    buttonMode='close';
    if(isIOS){
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
    }else if(isAndroid){
      setStatus('No Chrome ou Samsung Internet, abra o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.');
    }else{
      setStatus('Abra o menu do navegador e procure Instalar aplicativo ou Adicionar à tela inicial.');
    }
    if(installButton){installButton.disabled=false;installButton.textContent='Entendi'}
  }

  function updateInstallButton(){
    if(!installButton)return;
    if(deferredPrompt){
      buttonMode='install';
      installButton.disabled=false;
      installButton.textContent='Instalar aplicativo';
      setStatus('Toque em Instalar aplicativo e confirme a instalação do Android.');
    }else{
      buttonMode='instructions';
      installButton.disabled=false;
      installButton.textContent='Como instalar';
      setStatus(isIOS?'No iPhone ou iPad, use o menu Compartilhar do Safari.':'Se o navegador ainda não mostrar a instalação nativa, toque em Como instalar.');
    }
  }

  async function installNow(){
    if(buttonMode==='close'){closeModal(true);return}
    if(buttonMode==='instructions'||!deferredPrompt){showInstructions();return}
    const promptEvent=deferredPrompt;
    deferredPrompt=null;
    installButton.disabled=true;
    installButton.textContent='Abrindo instalação...';
    try{
      await promptEvent.prompt();
      const choice=await promptEvent.userChoice;
      if(choice&&choice.outcome==='accepted'){
        markSeen();
        closeModal(false);
      }else{
        installButton.disabled=false;
        installButton.textContent='Instalar aplicativo';
        setStatus('A instalação foi cancelada. Você pode tentar novamente quando quiser.');
      }
    }catch(e){
      showInstructions();
    }
  }

  function buildModal(){
    if(modal)return;
    modal=document.createElement('div');
    modal.id='v39InstallOverlay';
    modal.className='v39InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v47InstallTitle"><button class="v39InstallClose" type="button" aria-label="Fechar">×</button><img class="v39InstallIcon" src="./icons/lousa-icon-512.png?v=47" alt=""><div class="v39InstallText"><span class="v39InstallBadge">Lousa de Estudos</span><h3 id="v47InstallTitle">Instalar o aplicativo?</h3><p>Adicione a Lousa de Estudos à tela inicial para abrir como um aplicativo.</p><div class="v39InstallStatus" role="status"></div></div><div class="v39InstallActions"><button class="v39InstallPrimary" type="button">Preparando instalação...</button><button class="v39InstallLater" type="button">Agora não</button></div></div>`;
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
    if(deferredPrompt){updateInstallButton();return}
    setStatus('Preparando a opção de instalação do seu navegador...');
    setTimeout(()=>{if(modal&&modal.classList.contains('show')&&!deferredPrompt)updateInstallButton()},1200);
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    if(modal&&modal.classList.contains('show'))updateInstallButton();
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    markSeen();
    closeModal(false);
  });

  function addUpdateStyles(){
    if(document.getElementById('v47UpdateStyles'))return;
    const s=document.createElement('style');
    s.id='v47UpdateStyles';
    s.textContent='.v47Update{position:fixed;inset:0;z-index:100005;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48)}.v47UpdateCard{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;text-align:center;box-shadow:0 28px 80px rgba(15,23,42,.3)}.v47UpdateCard h3{margin:8px 0}.v47UpdateCard p{color:#64748b}.v47UpdateBtn{width:100%;min-height:49px;margin-top:14px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900}';
    document.head.appendChild(s);
  }

  function showUpdate(worker){
    if(!isStandalone()||!worker||document.querySelector('.v47Update'))return;
    addUpdateStyles();
    const box=document.createElement('div');
    box.className='v47Update';
    box.innerHTML='<div class="v47UpdateCard"><div style="font-size:40px">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização.</p><button class="v47UpdateBtn" type="button">Atualizar agora</button></div>';
    document.body.appendChild(box);
    box.querySelector('.v47UpdateBtn').addEventListener('click',()=>{
      updateRequested=true;
      const b=box.querySelector('.v47UpdateBtn');
      b.disabled=true;b.textContent='Atualizando...';
      worker.postMessage({type:'SKIP_WAITING'});
    },{once:true});
  }

  async function registerWorker(){
    if(!('serviceWorker' in navigator))return;
    try{
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(updateRequested&&isStandalone())location.reload();
      });
      const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{
        const w=reg.installing;
        if(!w)return;
        w.addEventListener('statechange',()=>{
          if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w);
        });
      });
      setTimeout(()=>reg.update().catch(()=>{}),1200);
    }catch(e){console.warn('PWA indisponível',e)}
  }

  window.addEventListener('load',()=>{
    registerWorker();
    if(!isStandalone())setTimeout(showModal,500);
  },{once:true});
})();
