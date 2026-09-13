/* Lousa de Estudos, instalador PWA da versão 40 */
(() => {
  const PROMPT_KEY='lousa:pwa-install-prompt:v40';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let buttonMode='install';

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ua=(navigator.userAgent||'').toLowerCase();
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isAndroid=/android/.test(ua);
  const isMobileLike=isIOS||isAndroid||/mobile/.test(ua)||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1200);

  function markSeen(){try{localStorage.setItem(PROMPT_KEY,'1')}catch(e){}}
  function wasSeen(){try{return localStorage.getItem(PROMPT_KEY)==='1'}catch(e){return false}}
  function setStatus(text){if(statusEl)statusEl.textContent=text||''}

  function closeModal(remember=true){
    if(remember)markSeen();
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
  }

  function showInstructions(){
    buttonMode='close';
    if(isIOS){
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
    }else if(isAndroid){
      setStatus('No Chrome, abra o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.');
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
      setStatus('Toque em Instalar aplicativo para adicionar a Lousa à tela inicial.');
    }else{
      buttonMode='instructions';
      installButton.disabled=false;
      installButton.textContent='Como instalar';
      setStatus(isIOS?'No iPhone ou iPad, use o menu Compartilhar do Safari.':'Se a instalação nativa ainda não estiver disponível, veja como instalar pelo navegador.');
    }
  }

  async function installNow(){
    if(buttonMode==='close'){closeModal(true);return}
    if(buttonMode==='instructions'||!deferredPrompt){showInstructions();return}
    const promptEvent=deferredPrompt;
    deferredPrompt=null;
    try{
      promptEvent.prompt();
      const choice=await promptEvent.userChoice;
      if(choice&&choice.outcome==='accepted'){
        markSeen();
        closeModal(false);
      }else{
        buttonMode='close';
        setStatus('A instalação foi cancelada. Você pode instalar depois pelo menu do navegador.');
        installButton.textContent='Fechar';
      }
    }catch(e){showInstructions()}
  }

  function buildModal(){
    if(modal)return;
    modal=document.createElement('div');
    modal.id='v39InstallOverlay';
    modal.className='v39InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v40InstallTitle"><button class="v39InstallClose" type="button" aria-label="Fechar">×</button><img class="v39InstallIcon" src="./icons/lousa-icon-v35.jpg?v=40" alt=""><div class="v39InstallText"><span class="v39InstallBadge">Lousa de Estudos</span><h3 id="v40InstallTitle">Instalar o aplicativo?</h3><p>Adicione a Lousa de Estudos à tela inicial para abrir como um aplicativo.</p><div class="v39InstallStatus" role="status"></div></div><div class="v39InstallActions"><button class="v39InstallPrimary" type="button">Preparando instalação...</button><button class="v39InstallLater" type="button">Agora não</button></div></div>`;
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
    if(deferredPrompt){updateInstallButton()}
    else{
      setStatus('Preparando a opção de instalação do seu navegador...');
      setTimeout(()=>{if(modal&&modal.classList.contains('show')&&!deferredPrompt)updateInstallButton()},1200);
    }
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

  window.addEventListener('load',()=>{
    if(isStandalone())return;
    setTimeout(showModal,500);
  },{once:true});
})();
