/* Lousa de Estudos, versão 69 estável: sem atualização automática durante a lição */
(() => {
  if (window.__lousaAutoUpdate) return;
  window.__lousaAutoUpdate = true;

  const metaVersion = Number(document.querySelector('meta[name="app-version"]')?.content || 0);
  const params = new URLSearchParams(location.search);
  const queryVersion = Number(params.get('content') || 0);
  const CURRENT_CONTENT_VERSION = Math.max(metaVersion, queryVersion, Number(window.__lousaCurrentContentVersion || 0));

  function addStyles() {
    if (document.getElementById('lousaUpdateStyles')) return;
    const style = document.createElement('style');
    style.id = 'lousaUpdateStyles';
    style.textContent = `
      .lousaVersionOnly{position:fixed;left:5px;bottom:max(4px,env(safe-area-inset-bottom));z-index:105000;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:9px;line-height:1;color:#7a857e;background:rgba(255,255,255,.70);border-radius:7px;padding:3px 5px;box-shadow:0 2px 7px rgba(15,23,42,.06);pointer-events:none;opacity:.76}
      @media(max-width:520px){.lousaVersionOnly{font-size:8.5px}}
    `;
    document.head.appendChild(style);
  }

  function addVersionLabel() {
    addStyles();
    document.querySelector('.lousaManualUpdate')?.remove();
    let label = document.querySelector('.lousaVersionOnly');
    if (!label) {
      label = document.createElement('div');
      label.className = 'lousaVersionOnly';
      document.body.appendChild(label);
    }
    label.textContent = 'v' + CURRENT_CONTENT_VERSION;
  }

  function init() {
    addVersionLabel();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();

  /*
    Atualizações de conteúdo são verificadas somente em start.html, quando o
    aplicativo é aberto. Não há mais verificação por foco, visibilitychange,
    intervalo de tempo ou recarga automática enquanto uma lição está aberta.
  */
})();
