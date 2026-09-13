/* Lousa de Estudos, PWA versão 51
   Somente instalação nativa do navegador. Sem simular instalador. */
(() => {
  let deferredPrompt = null;
  let banner = null;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function ensureStyles(){
    if(document.getElementById('v51InstallStyles')) return;
    const style = document.createElement('style');
    style.id = 'v51InstallStyles';
    style.textContent = `
      .v51InstallBanner{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:120000;width:min(92vw,430px);display:flex;align-items:center;gap:12px;padding:14px;background:#fff;border:1px solid #dce8df;border-radius:20px;box-shadow:0 20px 56px rgba(15,23,42,.24)}
      .v51InstallIcon{width:54px;height:54px;border-radius:15px;object-fit:cover;flex:0 0 auto}
      .v51InstallBody{min-width:0;flex:1}.v51InstallBody strong{display:block;font-size:15px;color:#1f2937}.v51InstallBody span{display:block;margin-top:3px;color:#64748b;font-size:12px;line-height:1.4}
      .v51InstallBtn{border:0;border-radius:13px;padding:11px 13px;background:#2f9d59;color:#fff;font-weight:900;white-space:nowrap}
      .v51InstallClose{border:0;background:transparent;color:#8b9890;font-size:21px;line-height:1;padding:4px}
      @media(max-width:520px){.v51InstallBanner{width:calc(100vw - 24px);align-items:flex-start;flex-wrap:wrap}.v51InstallBtn{margin-left:66px;flex:1}.v51InstallClose{position:absolute;right:10px;top:10px}}
    `;
    document.head.appendChild(style);
  }

  function hideBanner(){
    if(banner){ banner.remove(); banner = null; }
  }

  function showNativeInstallButton(){
    if(isStandalone() || !deferredPrompt || banner) return;
    ensureStyles();
    banner = document.createElement('div');
    banner.className = 'v51InstallBanner';
    banner.innerHTML = `
      <img class="v51InstallIcon" src="./icons/lousa-icon-192.png?v=51" alt="">
      <div class="v51InstallBody"><strong>Instalar Lousa de Estudos</strong><span>Instale como aplicativo no celular ou tablet.</span></div>
      <button class="v51InstallBtn" type="button">Instalar aplicativo</button>
      <button class="v51InstallClose" type="button" aria-label="Fechar">×</button>
    `;
    document.body.appendChild(banner);

    banner.querySelector('.v51InstallClose').addEventListener('click', hideBanner);
    banner.querySelector('.v51InstallBtn').addEventListener('click', async () => {
      if(!deferredPrompt) return;
      const event = deferredPrompt;
      const button = banner.querySelector('.v51InstallBtn');
      button.disabled = true;
      button.textContent = 'Abrindo...';
      try{
        await event.prompt();
        const choice = await event.userChoice;
        deferredPrompt = null;
        if(choice && choice.outcome === 'accepted'){
          hideBanner();
        }else{
          button.disabled = false;
          button.textContent = 'Instalar aplicativo';
        }
      }catch(error){
        button.disabled = false;
        button.textContent = 'Instalar aplicativo';
      }
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    showNativeInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBanner();
  });

  if(isStandalone()) hideBanner();
})();

/* Atualização controlada apenas quando o app estiver instalado. */
(() => {
  if(window.__lousaUpdateWatcherV51) return;
  window.__lousaUpdateWatcherV51 = true;
  let shownWorker = null;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function showUpdate(worker){
    if(!isStandalone() || !worker || shownWorker === worker) return;
    shownWorker = worker;
    const overlay = document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;z-index:120001;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)';
    overlay.innerHTML='<div style="width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center"><div style="font-size:42px">⬆️</div><h3 style="margin:8px 0;font-size:22px">Nova versão disponível</h3><p style="margin:0;color:#64748b;line-height:1.55">A Lousa de Estudos recebeu uma atualização.</p><button type="button" style="width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px">Atualizar agora</button></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', () => {
      const b = overlay.querySelector('button');
      b.disabled = true;
      b.textContent = 'Atualizando...';
      worker.postMessage({type:'SKIP_WAITING'});
    }, {once:true});
  }

  async function watch(){
    if(!('serviceWorker' in navigator)) return;
    try{
      const reg = await navigator.serviceWorker.getRegistration();
      if(!reg) return;
      if(reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if(!worker) return;
        worker.addEventListener('statechange', () => {
          if(worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(worker);
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
      setTimeout(() => reg.update().catch(()=>{}), 1200);
      document.addEventListener('visibilitychange', () => {
        if(document.visibilityState === 'visible') reg.update().catch(()=>{});
      });
    }catch(error){}
  }

  if(document.readyState === 'complete') setTimeout(watch, 600);
  else window.addEventListener('load', () => setTimeout(watch, 600), {once:true});
})();
