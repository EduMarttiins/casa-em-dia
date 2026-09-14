/* Lousa de Estudos, atualização automática com inicialização permanente */
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
      .lousaVersionOnly{position:fixed;left:5px;bottom:max(4px,env(safe-area-inset-bottom));z-index:105000;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:9px;line-height:1;color:#7a857e;background:rgba(255,255,255,.70);border-radius:7px;padding:3px 5px;box-shadow:0 2px 7px rgba(15,23,42,.06);pointer-events:none;opacity:.76}
      @media(max-width:520px){.lousaUpdateActions{flex-direction:column}.lousaUpdateLater{width:100%}.lousaVersionOnly{font-size:8.5px}}
    `;
    document.head.appendChild(style);
  }

  function addVersionLabel() {
    addStyles();
    document.querySelector('.lousaManualUpdate')?.remove();
    let label=document.querySelector('.lousaVersionOnly');
    if(!label){label=document.createElement('div');label.className='lousaVersionOnly';document.body.appendChild(label)}
    label.textContent = 'v' + CURRENT_CONTENT_VERSION;
  }

  async function clearAppCaches() {
    if (!('caches' in window)) return;
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith('lousa-de-estudos-v')).map(key => caches.delete(key)));
    } catch (error) {}
  }

  async function resetWorkers() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg => reg.unregister().catch(()=>false)));
    } catch (error) {}
  }

  function goToLatest() {
    const target = new URL('./start.html', location.href);
    target.searchParams.set('pwa','1');
    target.searchParams.set('update', String(Date.now()));
    if(isNativeAndroidApp)target.searchParams.set('androidapp','1');
    if(currentApkVersion)target.searchParams.set('apk',String(currentApkVersion));
    location.replace(target.toString());
  }

  async function getRemoteVersion() {
    const response = await fetch('./app-version.json?ts=' + Date.now(), {cache:'no-store'});
    if (!response.ok) throw new Error('Não foi possível verificar a atualização');
    return response.json();
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
      await resetWorkers();
      goToLatest();
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
    addVersionLabel();
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
