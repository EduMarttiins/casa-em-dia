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
      .lousaManualUpdate{position:fixed;left:50%;bottom:max(5px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:110000;display:flex;flex-direction:column;align-items:center;gap:1px;width:auto;max-width:calc(100vw - 24px);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;opacity:.82;transition:opacity .18s ease,transform .18s ease}
      .lousaManualButton{min-height:31px;border:1px solid rgba(47,157,89,.28);border-radius:999px;background:rgba(47,157,89,.92);color:#fff;font-weight:800;font-size:11px;padding:0 12px;box-shadow:0 4px 12px rgba(22,101,52,.13);cursor:pointer;white-space:nowrap}
      .lousaManualButton:disabled{opacity:.72;cursor:wait}.lousaManualVersion{font-size:9.5px;line-height:1.2;text-align:center;color:#64748b;background:rgba(255,255,255,.78);border:0;border-radius:999px;padding:2px 7px;box-shadow:none;white-space:nowrap}
      .lousaManualUpdate.typing{opacity:0;pointer-events:none;transform:translate(-50%,10px)}
      @media(max-width:520px){.lousaUpdateActions{flex-direction:column}.lousaUpdateLater{width:100%}.lousaManualButton{font-size:10.5px;min-height:30px;padding:0 11px}.lousaManualVersion{font-size:9px}}
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
    button.textContent = 'Verificando';
    versionText('Versão ' + CURRENT_CONTENT_VERSION + ' • verificando');
    try {
      const data = await getRemoteVersion();
      const remoteContent = Number(data.contentVersion || 0);
      const remoteApk = Number(data.apkVersion || 0);
      if (isNativeAndroidApp && data.apkUrl && remoteApk > currentApkVersion) {
        versionText('Nova versão disponível');
        button.textContent = 'Atualizando';
        location.href = data.apkUrl;
        return;
      }
      if (remoteContent > CURRENT_CONTENT_VERSION) {
        versionText('Nova versão ' + remoteContent);
        button.textContent = 'Atualizando';
        await clearAppCaches();
        await refreshWorker();
        goToVersion(remoteContent);
        return;
      }
      await refreshWorker();
      versionText('Versão atual: ' + CURRENT_CONTENT_VERSION + ' • atualizada');
      button.textContent = 'Atualizado';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = oldText;
        versionText('Versão atual: ' + CURRENT_CONTENT_VERSION);
      }, 1800);
    } catch (error) {
      versionText('Versão ' + CURRENT_CONTENT_VERSION + ' • tente novamente');
      button.textContent = 'Tentar novamente';
      button.disabled = false;
    }
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  function addManualButton() {
    addStyles();
    if (document.querySelector('.lousaManualUpdate')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lousaManualUpdate';
    wrap.innerHTML = `<button class="lousaManualButton" type="button">↻ Atualizar</button><div class="lousaManualVersion">Versão atual: ${CURRENT_CONTENT_VERSION}</div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('.lousaManualButton').addEventListener('click', manualUpdate);
    document.addEventListener('focusin', event => {
      if (isTypingTarget(event.target)) wrap.classList.add('typing');
    });
    document.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!isTypingTarget(document.activeElement)) wrap.classList.remove('typing');
      }, 80);
    });
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