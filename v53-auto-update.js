/* Lousa de Estudos, verificação de atualização versão 53 */
(() => {
  if (window.__lousaAutoUpdateV53) return;
  window.__lousaAutoUpdateV53 = true;

  const CURRENT_CONTENT_VERSION = 53;
  const params = new URLSearchParams(location.search);
  const currentApkVersion = Number(params.get('apk') || 0);
  const isNativeAndroidApp = params.get('androidapp') === '1' || /LousaDeEstudosAndroid\//i.test(navigator.userAgent || '');
  let checking = false;
  let shownVersion = 0;

  function addStyles() {
    if (document.getElementById('v53UpdateStyles')) return;
    const style = document.createElement('style');
    style.id = 'v53UpdateStyles';
    style.textContent = `
      .v53UpdateOverlay{position:fixed;inset:0;z-index:150000;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.50);backdrop-filter:blur(5px)}
      .v53UpdateCard{width:min(100%,430px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.30);text-align:center}
      .v53UpdateIcon{font-size:44px;line-height:1}.v53UpdateCard h3{margin:10px 0 6px;font-size:22px;color:#1f2937}.v53UpdateCard p{margin:0;color:#64748b;line-height:1.55}
      .v53UpdateActions{display:flex;gap:10px;margin-top:19px}.v53UpdatePrimary,.v53UpdateLater{min-height:48px;border-radius:14px;font-weight:900;font-size:14px}
      .v53UpdatePrimary{flex:1;border:0;background:#2f9d59;color:#fff}.v53UpdateLater{border:1px solid #d8e3dc;background:#fff;color:#526258;padding:0 16px}
      @media(max-width:520px){.v53UpdateActions{flex-direction:column}.v53UpdateLater{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function showUpdate(data, kind) {
    const version = kind === 'apk' ? Number(data.apkVersion || 0) : Number(data.contentVersion || 0);
    if (!version || shownVersion === version || document.querySelector('.v53UpdateOverlay')) return;
    shownVersion = version;
    addStyles();

    const overlay = document.createElement('div');
    overlay.className = 'v53UpdateOverlay';
    const nativeUpdate = kind === 'apk';
    overlay.innerHTML = `
      <div class="v53UpdateCard" role="dialog" aria-modal="true" aria-label="Nova atualização disponível">
        <div class="v53UpdateIcon">⬆️</div>
        <h3>Nova atualização disponível</h3>
        <p>${nativeUpdate ? 'Existe uma nova versão do aplicativo para instalar.' : (data.message || 'A Lousa de Estudos recebeu novidades. Atualize para carregar a versão mais recente.')}</p>
        <div class="v53UpdateActions">
          <button class="v53UpdatePrimary" type="button">Atualizar agora</button>
          <button class="v53UpdateLater" type="button">Agora não</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('.v53UpdateLater').addEventListener('click', () => overlay.remove(), {once:true});
    overlay.querySelector('.v53UpdatePrimary').addEventListener('click', () => {
      const button = overlay.querySelector('.v53UpdatePrimary');
      button.disabled = true;
      button.textContent = 'Atualizando...';
      if (nativeUpdate && data.apkUrl) {
        location.href = data.apkUrl;
        return;
      }
      const next = new URL(location.href);
      next.searchParams.set('content', String(data.contentVersion || Date.now()));
      location.replace(next.toString());
    }, {once:true});
  }

  async function checkForUpdates() {
    if (checking) return;
    checking = true;
    try {
      const response = await fetch('./app-version.json?ts=' + Date.now(), {cache:'no-store'});
      if (!response.ok) return;
      const data = await response.json();
      const remoteContent = Number(data.contentVersion || 0);
      const remoteApk = Number(data.apkVersion || 0);

      if (isNativeAndroidApp && data.apkUrl && remoteApk > currentApkVersion) {
        showUpdate(data, 'apk');
        return;
      }
      if (remoteContent > CURRENT_CONTENT_VERSION) showUpdate(data, 'content');
    } catch (error) {
      console.debug('Verificação de atualização indisponível', error);
    } finally {
      checking = false;
    }
  }

  if (document.readyState === 'complete') setTimeout(checkForUpdates, 1200);
  else window.addEventListener('load', () => setTimeout(checkForUpdates, 1200), {once:true});

  window.addEventListener('focus', checkForUpdates);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdates();
  });
  setInterval(checkForUpdates, 5 * 60 * 1000);
})();
