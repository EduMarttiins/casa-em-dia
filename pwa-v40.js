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
    if(isIOS)setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
    else if(isAndroid)setStatus('No Chrome, abra o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.');
    else setStatus('Abra o menu do navegador e procure Instalar aplicativo ou Adicionar à tela inicial.');
    if(installButton){installButton.disabled=false;installButton.textContent='Entendi'}
  }

  function updateInstallButton(){
    if(!installButton)return;
    if(deferredPrompt){
      buttonMode='install';installButton.disabled=false;installButton.textContent='Instalar aplicativo';
      setStatus('Toque em Instalar aplicativo para adicionar a Lousa à tela inicial.');
    }else{
      buttonMode='instructions';installButton.disabled=false;installButton.textContent='Como instalar';
      setStatus(isIOS?'No iPhone ou iPad, use o menu Compartilhar do Safari.':'Se a instalação nativa ainda não estiver disponível, veja como instalar pelo navegador.');
    }
  }

  async function installNow(){
    if(buttonMode==='close'){closeModal(true);return}
    if(buttonMode==='instructions'||!deferredPrompt){showInstructions();return}
    const promptEvent=deferredPrompt;deferredPrompt=null;
    try{
      promptEvent.prompt();
      const choice=await promptEvent.userChoice;
      if(choice&&choice.outcome==='accepted'){markSeen();closeModal(false)}
      else{buttonMode='close';setStatus('A instalação foi cancelada. Você pode instalar depois pelo menu do navegador.');installButton.textContent='Fechar'}
    }catch(e){showInstructions()}
  }

  function buildModal(){
    if(modal)return;
    modal=document.createElement('div');modal.id='v39InstallOverlay';modal.className='v39InstallOverlay';modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v39InstallCard" role="dialog" aria-modal="true" aria-labelledby="v40InstallTitle"><button class="v39InstallClose" type="button" aria-label="Fechar">×</button><img class="v39InstallIcon" src="./icons/lousa-icon-v35.jpg?v=40" alt=""><div class="v39InstallText"><span class="v39InstallBadge">Lousa de Estudos</span><h3 id="v40InstallTitle">Instalar o aplicativo?</h3><p>Adicione a Lousa de Estudos à tela inicial para abrir como um aplicativo.</p><div class="v39InstallStatus" role="status"></div></div><div class="v39InstallActions"><button class="v39InstallPrimary" type="button">Preparando instalação...</button><button class="v39InstallLater" type="button">Agora não</button></div></div>`;
    document.body.appendChild(modal);installButton=modal.querySelector('.v39InstallPrimary');statusEl=modal.querySelector('.v39InstallStatus');installButton.disabled=true;
    installButton.addEventListener('click',installNow);modal.querySelector('.v39InstallLater').addEventListener('click',()=>closeModal(true));modal.querySelector('.v39InstallClose').addEventListener('click',()=>closeModal(true));
  }

  function showModal(){
    if(isStandalone()||!isMobileLike||wasSeen())return;
    buildModal();modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    if(deferredPrompt)updateInstallButton();
    else{setStatus('Preparando a opção de instalação do seu navegador...');setTimeout(()=>{if(modal&&modal.classList.contains('show')&&!deferredPrompt)updateInstallButton()},1200)}
  }

  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;if(modal&&modal.classList.contains('show'))updateInstallButton()});
  window.addEventListener('appinstalled',()=>{deferredPrompt=null;markSeen();closeModal(false)});
  window.addEventListener('load',()=>{if(!isStandalone())setTimeout(showModal,500)},{once:true});
})();

/* Aviso de atualização. Funciona também para quem ainda está na versão 40. */
(() => {
  if(window.__lousaUpdateWatcher)return;
  window.__lousaUpdateWatcher=true;
  let shownWorker=null;

  function styles(){
    if(document.getElementById('lousaUpdateStyles'))return;
    const s=document.createElement('style');s.id='lousaUpdateStyles';
    s.textContent=`.lousaUpdateOverlay{position:fixed;inset:0;z-index:100001;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}.lousaUpdateCard{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center}.lousaUpdateIcon{font-size:42px}.lousaUpdateCard h3{margin:8px 0;font-size:22px}.lousaUpdateCard p{margin:0;color:#64748b;line-height:1.55}.lousaUpdateBtn{width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px}`;
    document.head.appendChild(s);
  }

  function showUpdate(worker){
    if(!worker||shownWorker===worker)return;
    shownWorker=worker;styles();
    document.querySelector('.lousaUpdateOverlay')?.remove();
    const box=document.createElement('div');box.className='lousaUpdateOverlay';
    box.innerHTML='<div class="lousaUpdateCard" role="dialog" aria-modal="true"><div class="lousaUpdateIcon">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização. Toque abaixo para instalar a versão mais recente.</p><button class="lousaUpdateBtn" type="button">Atualizar agora</button></div>';
    document.body.appendChild(box);
    box.querySelector('.lousaUpdateBtn').addEventListener('click',()=>{const b=box.querySelector('.lousaUpdateBtn');b.disabled=true;b.textContent='Atualizando...';worker.postMessage({type:'SKIP_WAITING'})},{once:true});
  }

  async function watch(){
    if(!('serviceWorker' in navigator))return;
    try{
      const reg=await navigator.serviceWorker.getRegistration();
      if(!reg)return;
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{
        const w=reg.installing;if(!w)return;
        w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w)});
      });
      const check=()=>reg.update().catch(()=>{});
      setTimeout(check,500);setInterval(check,60000);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
    }catch(e){console.warn('Não foi possível verificar atualização',e)}
  }

  if(document.readyState==='complete')setTimeout(watch,400);
  else window.addEventListener('load',()=>setTimeout(watch,400),{once:true});
})();
