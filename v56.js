/* Lousa de Estudos, ponte de correção da versão 56 */
(()=>{
  if(window.__lousaV56Bridge)return;
  window.__lousaV56Bridge=true;

  const meta=Number(document.querySelector('meta[name="app-version"]')?.content||0);
  const params=new URLSearchParams(location.search);
  const query=Number(params.get('content')||0);
  const current=Math.max(meta,query);

  /* Na versão 57 o dicionário novo assume o funcionamento. */
  if(current>=57)return;

  let redirected=false;
  const go=()=>{
    if(redirected)return;
    redirected=true;
    const target=new URL('./v52.html',location.href);
    target.searchParams.set('pwa','1');
    target.searchParams.set('content','57');
    target.searchParams.set('dictfix','1');
    target.searchParams.set('ts',String(Date.now()));
    location.replace(target.toString());
  };

  (async()=>{
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg=>reg.unregister().catch(()=>false)));
      }
      if('caches' in window){
        const keys=await caches.keys();
        await Promise.all(keys.filter(key=>key.startsWith('lousa-de-estudos-v')).map(key=>caches.delete(key)));
      }
    }catch(error){}
    go();
  })();

  setTimeout(go,1200);
})();
