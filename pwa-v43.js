/* Transição de recuperação da versão 43 para a versão 44.
   Remove o ciclo de atualização causado pelos dois registros antigos do service worker. */
(() => {
  if(!('serviceWorker' in navigator)){
    location.replace('./v44.html?v=44&install=1&migrated=1');
    return;
  }

  const style=document.createElement('style');
  style.textContent='.lousaUpdateOverlay,#v33PwaPrompt,#v39InstallOverlay{display:none!important}';
  document.head.appendChild(style);

  let finished=false;
  const go=()=>{
    if(finished)return;
    finished=true;
    location.replace('./v44.html?v=44&install=1&migrated=1&t='+Date.now());
  };

  function exactActive(reg){
    try{
      if(!reg||!reg.active)return false;
      const u=new URL(reg.active.scriptURL);
      return u.pathname.endsWith('/sw.js')&&!u.search;
    }catch(e){return false}
  }

  async function migrate(){
    try{
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        navigator.serviceWorker.getRegistration().then(reg=>{
          if(exactActive(reg))go();
        }).catch(()=>{});
      });

      const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      await reg.update().catch(()=>{});

      const activate=worker=>{
        if(!worker)return;
        if(worker.state==='installed'&&navigator.serviceWorker.controller){
          worker.postMessage({type:'SKIP_WAITING'});
        }
      };

      if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
      if(reg.installing)reg.installing.addEventListener('statechange',()=>activate(reg.installing));
      reg.addEventListener('updatefound',()=>{
        const worker=reg.installing;
        if(worker)worker.addEventListener('statechange',()=>activate(worker));
      });

      const started=Date.now();
      const timer=setInterval(async()=>{
        const current=await navigator.serviceWorker.getRegistration().catch(()=>null);
        if(exactActive(current)){
          clearInterval(timer);
          go();
        }else if(Date.now()-started>12000){
          clearInterval(timer);
          location.reload();
        }
      },300);
    }catch(error){
      setTimeout(()=>location.reload(),1200);
    }
  }

  if(document.readyState==='complete')migrate();
  else window.addEventListener('load',migrate,{once:true});
})();
