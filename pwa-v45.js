/* Lousa de Estudos, atualização PWA da versão 45.
   A instalação é tratada exclusivamente por install-v45.html. */
(() => {
  if(window.__lousaV45UpdateWatcher)return;
  window.__lousaV45UpdateWatcher=true;
  let refreshing=false;
  let shownWorker=null;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function styles(){
    if(document.getElementById('lousaV45UpdateStyles'))return;
    const s=document.createElement('style');
    s.id='lousaV45UpdateStyles';
    s.textContent='.lousaV45Update{position:fixed;inset:0;z-index:100005;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}.lousaV45UpdateCard{width:min(100%,420px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.3);text-align:center}.lousaV45UpdateCard h3{margin:8px 0;font-size:22px}.lousaV45UpdateCard p{margin:0;color:#64748b;line-height:1.55}.lousaV45UpdateBtn{width:100%;min-height:49px;margin-top:18px;border:0;border-radius:14px;background:#2f9d59;color:#fff;font-weight:900;font-size:14px}';
    document.head.appendChild(s);
  }

  function showUpdate(worker){
    if(!worker||shownWorker===worker||!isStandalone())return;
    shownWorker=worker;
    styles();
    document.querySelector('.lousaV45Update')?.remove();
    const box=document.createElement('div');
    box.className='lousaV45Update';
    box.innerHTML='<div class="lousaV45UpdateCard" role="dialog" aria-modal="true"><div style="font-size:42px">⬆️</div><h3>Nova versão disponível</h3><p>A Lousa de Estudos recebeu uma atualização.</p><button class="lousaV45UpdateBtn" type="button">Atualizar agora</button></div>';
    document.body.appendChild(box);
    box.querySelector('.lousaV45UpdateBtn').addEventListener('click',()=>{
      const b=box.querySelector('.lousaV45UpdateBtn');
      b.disabled=true;b.textContent='Atualizando...';
      worker.postMessage({type:'SKIP_WAITING'});
    },{once:true});
  }

  async function boot(){
    if(!('serviceWorker' in navigator))return;
    try{
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(refreshing)return;
        refreshing=true;
        location.reload();
      });
      const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{
        const worker=reg.installing;
        if(!worker)return;
        worker.addEventListener('statechange',()=>{
          if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate(worker);
        });
      });
      const check=()=>reg.update().catch(()=>{});
      setTimeout(check,1000);
      setInterval(check,60000);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
    }catch(e){console.warn('PWA: atualização indisponível',e)}
  }

  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot,{once:true});
})();
