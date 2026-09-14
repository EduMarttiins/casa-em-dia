/* Lousa de Estudos — instalação PWA automática no Chrome
   Quando o Chrome libera beforeinstallprompt, abre o instalador automaticamente.
   Se o navegador bloquear a abertura automática, mostra uma tela própria com o
   ícone da Lousa e um botão que chama o instalador nativo.
*/
(() => {
  if (window.__lousaPwaV52) return;
  window.__lousaPwaV52 = true;

  let deferredPrompt = null;
  let installPanel = null;
  let autoPromptTried = false;
  let fallbackTimer = null;

  const DISMISS_KEY = 'lousaInstallPromptDismissedUntil';
  const DISMISS_FOR = 7 * 24 * 60 * 60 * 1000;
  const RELOAD_KEY = 'lousaInstallPreparedReload';

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const ua = navigator.userAgent || '';
  const isAndroid = /android/i.test(ua);
  const isMobileLike = isAndroid || /mobile/i.test(ua) || navigator.maxTouchPoints > 1;
  const isWebView = /;\s*wv\)/i.test(ua) || /\bwv\b/i.test(ua);
  const isChrome = /Chrome\//i.test(ua) && !/EdgA|OPR\//i.test(ua) && !isWebView;

  const isNativeAndroidApp = (() => {
    try {
      return new URLSearchParams(location.search).get('androidapp') === '1' ||
        /LousaDeEstudosAndroid\//i.test(ua);
    } catch (error) {
      return /LousaDeEstudosAndroid\//i.test(ua);
    }
  })();

  if (isNativeAndroidApp) {
    document.documentElement.classList.add('android-native-app');
    return;
  }

  function dismissed() {
    try { return Number(localStorage.getItem(DISMISS_KEY) || 0) > Date.now(); }
    catch (error) { return false; }
  }

  function rememberDismissal() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_FOR)); }
    catch (error) {}
  }

  function clearDismissal() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (error) {}
  }

  function ensureStyles() {
    if (document.getElementById('v52InstallStyles')) return;
    const style = document.createElement('style');
    style.id = 'v52InstallStyles';
    style.textContent = `
      .v33PwaPrompt,.v39InstallOverlay{display:none!important}
      .v52InstallOverlay{position:fixed;inset:0;z-index:150000;display:grid;place-items:end center;padding:18px;background:rgba(15,23,42,.52);backdrop-filter:blur(5px)}
      .v52InstallCard{width:min(100%,470px);background:#fff;border:1px solid #dce8df;border-radius:26px;padding:20px;box-shadow:0 28px 80px rgba(15,23,42,.34);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
      .v52InstallTop{display:flex;align-items:center;gap:14px}.v52InstallIcon{width:72px;height:72px;border-radius:20px;object-fit:cover;box-shadow:0 8px 22px rgba(47,157,89,.18)}
      .v52InstallText{min-width:0;flex:1}.v52InstallText strong{display:block;color:#17231c;font-size:20px;line-height:1.2}.v52InstallText span{display:block;margin-top:6px;color:#64748b;font-size:13px;line-height:1.5}
      .v52InstallActions{display:grid;gap:10px;margin-top:18px}.v52InstallPrimary,.v52InstallLater{min-height:52px;border-radius:15px;font-size:15px;font-weight:900}.v52InstallPrimary{border:0;background:#2f9d59;color:#fff}.v52InstallLater{border:1px solid #d7e2da;background:#fff;color:#526258}.v52InstallPrimary:disabled{opacity:.6}
      .v52InstallNote{margin-top:12px;color:#7b8790;font-size:11px;line-height:1.45;text-align:center}
      @media(min-width:700px){.v52InstallOverlay{place-items:center}}
    `;
    document.head.appendChild(style);
  }

  function hidePanel() {
    if (installPanel) installPanel.remove();
    installPanel = null;
  }

  function chromeIntentUrl() {
    const target = new URL(location.href);
    target.searchParams.set('install', '1');
    target.searchParams.set('browser', 'chrome');
    const httpsUrl = target.toString();
    const pathAndQuery = target.host + target.pathname + target.search + target.hash;
    return 'intent://' + pathAndQuery + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(httpsUrl) + ';end';
  }

  async function launchNativePrompt() {
    if (!deferredPrompt) return false;
    const event = deferredPrompt;
    deferredPrompt = null;
    try {
      const result = await event.prompt();
      const choice = result && result.outcome ? result : await event.userChoice;
      if (choice && choice.outcome === 'accepted') {
        clearDismissal();
        hidePanel();
      } else {
        rememberDismissal();
        hidePanel();
      }
      return true;
    } catch (error) {
      deferredPrompt = event;
      return false;
    }
  }

  function renderInstallPanel() {
    if (isStandalone() || !isMobileLike || dismissed()) return;
    ensureStyles();
    hidePanel();
    installPanel = document.createElement('div');
    installPanel.className = 'v52InstallOverlay';
    installPanel.innerHTML = `
      <div class="v52InstallCard" role="dialog" aria-modal="true" aria-label="Instalar Lousa de Estudos">
        <div class="v52InstallTop">
          <img class="v52InstallIcon" src="./icons/lousa-icon-192.png?v=70" alt="Ícone da Lousa de Estudos">
          <div class="v52InstallText">
            <strong>Instalar Lousa de Estudos</strong>
            <span>Instale no celular para abrir pelo ícone, em tela cheia, como um aplicativo.</span>
          </div>
        </div>
        <div class="v52InstallActions">
          <button class="v52InstallPrimary" type="button">Instalar agora</button>
          <button class="v52InstallLater" type="button">Agora não</button>
        </div>
        <div class="v52InstallNote">O Android sempre pede sua confirmação final antes de instalar.</div>
      </div>`;
    document.body.appendChild(installPanel);

    const primary = installPanel.querySelector('.v52InstallPrimary');
    installPanel.querySelector('.v52InstallLater').addEventListener('click', () => {
      rememberDismissal();
      hidePanel();
    }, {once:true});

    primary.addEventListener('click', async () => {
      if (deferredPrompt) {
        primary.disabled = true;
        primary.textContent = 'Abrindo instalador...';
        const opened = await launchNativePrompt();
        if (!opened && installPanel) {
          primary.disabled = false;
          primary.textContent = 'Instalar agora';
        }
        return;
      }
      if (isAndroid && !isChrome) {
        location.href = chromeIntentUrl();
        return;
      }
      primary.disabled = true;
      primary.textContent = 'Preparando instalador...';
      try {
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('./sw.js?v=70install-auto',{scope:'./',updateViaCache:'none'});
          await navigator.serviceWorker.ready;
        }
      } catch (error) {}
      setTimeout(() => {
        if (deferredPrompt) {
          primary.disabled = false;
          primary.textContent = 'Instalar agora';
        } else {
          primary.disabled = false;
          primary.textContent = 'Instalar pelo menu do Chrome';
          primary.onclick = () => alert('No Chrome, toque em ⋮ e depois em “Instalar app” ou “Adicionar à tela inicial”.');
        }
      }, 1200);
    });
  }

  async function tryAutomaticNativePrompt() {
    if (autoPromptTried || !deferredPrompt || dismissed() || isStandalone()) return;
    autoPromptTried = true;
    await new Promise(resolve => setTimeout(resolve, 450));
    const opened = await launchNativePrompt();
    if (!opened && !isStandalone()) renderInstallPanel();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    tryAutomaticNativePrompt();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    clearDismissal();
    hidePanel();
    try { sessionStorage.removeItem(RELOAD_KEY); } catch (error) {}
  });

  window.addEventListener('load', async () => {
    if (isStandalone() || !isMobileLike || dismissed()) return;

    /* Garante que o PWA tenha um Service Worker ativo antes da promoção de instalação. */
    try {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('./sw.js?v=70install-auto',{scope:'./',updateViaCache:'none'});
        await navigator.serviceWorker.ready;
      }
    } catch (error) {}

    if (deferredPrompt) {
      tryAutomaticNativePrompt();
      return;
    }

    /* Na primeira visita do Chrome, uma única recarga ajuda o navegador a
       reconhecer o Service Worker recém-ativado e disparar beforeinstallprompt. */
    if (isChrome) {
      let alreadyReloaded = false;
      try { alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === '1'; } catch (error) {}
      if (!alreadyReloaded && !navigator.serviceWorker.controller) {
        try { sessionStorage.setItem(RELOAD_KEY, '1'); } catch (error) {}
        setTimeout(() => location.reload(), 350);
        return;
      }
    }

    fallbackTimer = setTimeout(() => {
      if (deferredPrompt) tryAutomaticNativePrompt();
      else renderInstallPanel();
    }, 1600);
  }, {once:true});
})();

/* Atualizações de conteúdo continuam sendo verificadas apenas na abertura do app. */
