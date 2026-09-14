/* Lousa de Estudos, atualização automática e manual */
(() => {
  if (window.__lousaAutoUpdate) return;
  window.__lousaAutoUpdate = true;

  const metaVersion = Number(document.querySelector('meta[name="app-version"]')?.content || 0);
  const params = new URLSearchParams(location.search);
  const queryVersion = Number(params.get('content') || 0);
  const CURRENT_CONTENT_VERSION = Math.max(metaVersion, queryVersion);
  const currentApkVersion = Number(params.get('apk') || 0);
  const isNativeAndroidApp = params.get('androidapp') === '1' || /LousaDeEstudosAndroid\//i.test(navigator.userAgent || '');
  let checking = false;
  let shownKey = '';

  function addStyles() {
    if (document.getElementById('lousaUpdateStyles')) return;
    const style = document.createElement('style');
    style.id = 'lousaUpdateStyles';
    style.textContent = `
      .lousaUpdateOverlay{position:fixed;inset:0;z-index:150000;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.50);backdrop-filter:blur(5px)}
      .lousaUpdateCard{width:min(100%,430px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.30);text-align:center}
      .lousaUpdateIcon{font-size:44px;line-height:1}.lousaUpdateCard h3{margin:10px 0 6px;font-size:22px;color:#1f2937}.lousaUpdateCard p{margin:0;color:#64748b;line-height:1.55}
      .lousaUpdateActions{display:flex;gap:10px;margin-top:19px}.lousaUpdatePrimary,.lousaUpdateLater{min-height:48px;border-radius:14px;font-weight:900;font-size:14px}
      .lousaUpdatePrimary{flex:1;border:0;background:#2f9d59;color:#fff}.lousaUpdateLater{border:1px solid #d8e3dc;background:#fff;color:#526258;padding:0 16px}
      .lousaManualUpdate{position:fixed;left:14px;bottom:14px;z-index:120000;display:flex;flex-direction:column;align-items:stretch;gap:5px;width:min(210px,calc(100vw - 28px));font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
      .lousaManualButton{min-height:44px;border:0;border-radius:15px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px;padding:0 14px;box-shadow:0 10px 28px rgba(22,101,52,.25);cursor:pointer}
      .lousaManualButton:disabled{opacity:.72;cursor:wait}.lousaManualVersion{font-size:11px;line-height:1.35;text-align:center;color:#526258;background:rgba(255,255,255,.96);border:1px solid #dce8df;border-radius:10px;padding:5px 8px;box-shadow:0 5px 16px rgba(15,23,42,.08)}
      @media(max-width:520px){.lousaUpdateActions{flex-direction:column}.lousaUpdateLater{width:100%}.lousaManualUpdate{width:178px}.lousaManualButton{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function versionText(text) {
    const label = document.querySelector('.lousaManualVersion');
    if (label) label.textContent = text;
  }

  async function clearAppCaches() {
    if (!('caches' in window)) return;
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith('lousa-de-estudos-v')).map(key => caches.delete(key)));
    } catch (error) {}
  }

  async function refreshWorker() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(async reg => {
        try {
          await reg.update();
          if (reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
        } catch (error) {}
      }));
    } catch (error) {}
  }

  function goToVersion(version) {
    const target = new URL('./v52.html', location.href);
    target.searchParams.set('pwa','1');
    target.searchParams.set('content', String(version));
    target.searchParams.set('manualUpdate', String(Date.now()));
    location.replace(target.toString());
  }

  async function getRemoteVersion() {
    const response = await fetch('./app-version.json?ts=' + Date.now(), {cache:'no-store'});
    if (!response.ok) throw new Error('Não foi possível verificar a atualização');
    return response.json();
  }

  async function manualUpdate() {
    const button = document.querySelector('.lousaManualButton');
    if (!button || button.disabled) return;
    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Verificando...';
    versionText('Versão atual: ' + CURRENT_CONTENT_VERSION + ' • verificando atualização');
    try {
      const data = await getRemoteVersion();
      const remoteContent = Number(data.contentVersion || 0);
      const remoteApk = Number(data.apkVersion || 0);
      if (isNativeAndroidApp && data.apkUrl && remoteApk > currentApkVersion) {
        versionText('Nova versão do aplicativo disponível');
        button.textContent = 'Atualizando...';
        location.href = data.apkUrl;
        return;
      }
      if (remoteContent > CURRENT_CONTENT_VERSION) {
        versionText('Nova versão ' + remoteContent + ' encontrada');
        button.textContent = 'Atualizando...';
        await clearAppCaches();
        await refreshWorker();
        goToVersion(remoteContent);
        return;
      }
      await refreshWorker();
      versionText('Versão atual: ' + CURRENT_CONTENT_VERSION + ' • já está atualizada');
      button.textContent = 'Já está atualizada';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = oldText;
        versionText('Versão atual: ' + CURRENT_CONTENT_VERSION);
      }, 1800);
    } catch (error) {
      versionText('Versão atual: ' + CURRENT_CONTENT_VERSION + ' • não foi possível verificar agora');
      button.textContent = 'Tentar novamente';
      button.disabled = false;
    }
  }

  function addManualButton() {
    addStyles();
    if (document.querySelector('.lousaManualUpdate')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lousaManualUpdate';
    wrap.innerHTML = `<button class="lousaManualButton" type="button">Atualizar aplicativo</button><div class="lousaManualVersion">Versão atual: ${CURRENT_CONTENT_VERSION}</div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('.lousaManualButton').addEventListener('click', manualUpdate);
  }

  function showUpdate(data, kind) {
    const version = kind === 'apk' ? Number(data.apkVersion || 0) : Number(data.contentVersion || 0);
    const key = kind + ':' + version;
    if (!version || shownKey === key || document.querySelector('.lousaUpdateOverlay')) return;
    shownKey = key;
    addStyles();

    const nativeUpdate = kind === 'apk';
    const overlay = document.createElement('div');
    overlay.className = 'lousaUpdateOverlay';
    overlay.innerHTML = `
      <div class="lousaUpdateCard" role="dialog" aria-modal="true" aria-label="Nova atualização disponível">
        <div class="lousaUpdateIcon">⬆️</div>
        <h3>Nova atualização disponível</h3>
        <p>${nativeUpdate ? 'Existe uma nova versão do aplicativo para instalar.' : (data.message || 'A Lousa de Estudos recebeu novidades. Atualize para carregar a versão mais recente.')}</p>
        <div class="lousaUpdateActions">
          <button class="lousaUpdatePrimary" type="button">Atualizar agora</button>
          <button class="lousaUpdateLater" type="button">Agora não</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('.lousaUpdateLater').addEventListener('click', () => overlay.remove(), {once:true});
    overlay.querySelector('.lousaUpdatePrimary').addEventListener('click', async () => {
      const button = overlay.querySelector('.lousaUpdatePrimary');
      button.disabled = true;
      button.textContent = 'Atualizando...';
      if (nativeUpdate && data.apkUrl) {
        location.href = data.apkUrl;
        return;
      }
      await clearAppCaches();
      await refreshWorker();
      goToVersion(data.contentVersion || CURRENT_CONTENT_VERSION);
    }, {once:true});
  }

  async function checkForUpdates() {
    if (checking) return;
    checking = true;
    try {
      const data = await getRemoteVersion();
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

  function init() {
    addManualButton();
    setTimeout(checkForUpdates, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();

  window.addEventListener('focus', checkForUpdates);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdates();
  });
  setInterval(checkForUpdates, 5 * 60 * 1000);
})();
