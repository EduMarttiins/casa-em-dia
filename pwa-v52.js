/* Lousa de Estudos, PWA — instalação sem aviso repetitivo
   O instalador só aparece automaticamente quando o próprio navegador libera
   o beforeinstallprompt. Em abas internas, não força mais "Abrir no Chrome".
*/
(() => {
  if (window.__lousaPwaV52) return;
  window.__lousaPwaV52 = true;

  let deferredPrompt = null;
  let banner = null;

  const DISMISS_KEY = 'lousaInstallPromptDismissedUntil';
  const DISMISS_FOR = 90 * 24 * 60 * 60 * 1000;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isAndroid = /android/i.test(navigator.userAgent || '');
  const isMobileLike = isAndroid || /mobile/i.test(navigator.userAgent || '') || navigator.maxTouchPoints > 1;
  const isNativeAndroidApp = (() => {
    try {
      return new URLSearchParams(location.search).get('androidapp') === '1' ||
        /LousaDeEstudosAndroid\//i.test(navigator.userAgent || '');
    } catch (error) {
      return /LousaDeEstudosAndroid\//i.test(navigator.userAgent || '');
    }
  })();

  function installWasDismissed() {
    try {
      return Number(localStorage.getItem(DISMISS_KEY) || 0) > Date.now();
    } catch (error) {
      return false;
    }
  }

  function rememberDismissal() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_FOR));
    } catch (error) {}
  }

  function clearDismissal() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (error) {}
  }

  if (isNativeAndroidApp) {
    document.documentElement.classList.add('android-native-app');
    return;
  }

  function ensureStyles() {
    if (document.getElementById('v52InstallStyles')) return;
    const style = document.createElement('style');
    style.id = 'v52InstallStyles';
    style.textContent = `
      .v33PwaPrompt,.v39InstallOverlay{display:none!important}
      .v52InstallBanner{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:130000;width:min(92vw,450px);padding:16px;background:#fff;border:1px solid #dce8df;border-radius:22px;box-shadow:0 22px 64px rgba(15,23,42,.27)}
      .v52InstallTop{display:flex;align-items:center;gap:12px}.v52InstallIcon{width:58px;height:58px;border-radius:16px;object-fit:cover;flex:0 0 auto}.v52InstallText{min-width:0;flex:1}.v52InstallText strong{display:block;font-size:16px;color:#1f2937}.v52InstallText span{display:block;margin-top:4px;color:#64748b;font-size:12px;line-height:1.45}
      .v52InstallActions{display:flex;gap:9px;margin-top:13px}.v52InstallPrimary,.v52InstallLater{min-height:45px;border-radius:13px;font-weight:900;font-size:13px}.v52InstallPrimary{flex:1;border:0;background:#2f9d59;color:#fff}.v52InstallLater{border:1px solid #d8e3dc;background:#fff;color:#526258;padding:0 14px}.v52InstallPrimary:disabled{opacity:.55}.v52InstallNote{margin-top:9px;color:#7b8790;font-size:11px;line-height:1.4}
      @media(max-width:520px){.v52InstallBanner{width:calc(100vw - 24px);padding:14px}.v52InstallActions{flex-direction:column}.v52InstallLater{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function hideBanner() {
    if (banner) banner.remove();
    banner = null;
  }

  function chromeIntentUrl() {
    const target = new URL(location.href);
    target.searchParams.delete('install');
    target.searchParams.set('browser', 'chrome');
    const httpsUrl = target.toString();
    const pathAndQuery = target.host + target.pathname + target.search + target.hash;
    return 'intent://' + pathAndQuery + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(httpsUrl) + ';end';
  }

  function render(mode, force = false) {
    if (isStandalone() || !isMobileLike) return;
    if (!force && installWasDismissed()) return;

    ensureStyles();
    hideBanner();
    banner = document.createElement('div');
    banner.className = 'v52InstallBanner';

    const nativeMode = mode === 'native' && !!deferredPrompt;
    const title = nativeMode ? 'Instalar Lousa de Estudos' : 'Abrir no Chrome para instalar';
    const text = nativeMode
      ? 'Instale a Lousa como aplicativo no celular ou tablet.'
      : 'Para instalar, abra esta mesma página no Chrome completo.';
    const button = nativeMode ? 'Instalar aplicativo' : 'Abrir no Chrome';

    banner.innerHTML = `
      <div class="v52InstallTop">
        <img class="v52InstallIcon" src="./icons/lousa-icon-192.png" alt="">
        <div class="v52InstallText"><strong>${title}</strong><span>${text}</span></div>
      </div>
      <div class="v52InstallActions">
        <button class="v52InstallPrimary" type="button">${button}</button>
        <button class="v52InstallLater" type="button">Agora não</button>
      </div>
      <div class="v52InstallNote">Depois da instalação, a Lousa abre pelo próprio ícone, em tela de aplicativo.</div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('.v52InstallLater').addEventListener('click', () => {
      rememberDismissal();
      hideBanner();
    }, {once:true});

    banner.querySelector('.v52InstallPrimary').addEventListener('click', async () => {
      const btn = banner && banner.querySelector('.v52InstallPrimary');
      if (!btn) return;
      if (nativeMode && deferredPrompt) {
        const event = deferredPrompt;
        btn.disabled = true;
        btn.textContent = 'Abrindo instalador...';
        try {
          await event.prompt();
          const choice = await event.userChoice;
          deferredPrompt = null;
          if (choice && choice.outcome === 'accepted') {
            clearDismissal();
            hideBanner();
          } else {
            rememberDismissal();
            hideBanner();
          }
        } catch (error) {
          btn.disabled = false;
          btn.textContent = 'Instalar aplicativo';
        }
      } else if (isAndroid) {
        location.href = chromeIntentUrl();
      } else {
        btn.textContent = 'Use o menu do navegador';
      }
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    render('native');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    clearDismissal();
    hideBanner();
  });

  /*
    Em navegadores internos (como abas abertas dentro de outros aplicativos),
    não exibimos mais automaticamente o aviso "Abrir no Chrome".
    Ele só pode ser chamado de forma explícita com ?install=1.
  */
  window.addEventListener('load', () => {
    if (isStandalone() || !isMobileLike) return;
    let explicitInstall = false;
    try { explicitInstall = new URLSearchParams(location.search).get('install') === '1'; } catch (error) {}
    if (explicitInstall) {
      setTimeout(() => {
        if (deferredPrompt) render('native', true);
        else render('chrome', true);
      }, 500);
    }
  }, {once:true});
})();

/*
  Atualização em segundo plano desativada.
  A verificação de conteúdo acontece somente em start.html quando o aplicativo
  é aberto. Não há recarga automática enquanto uma lição está aberta.
*/
