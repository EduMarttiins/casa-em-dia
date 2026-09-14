/* Lousa de Estudos, versão 66: reparo permanente de inicialização */
(()=>{
  if(window.__lousaV66)return;
  window.__lousaV66=true;

  function cleanLegacyQuery(){
    try{
      const url=new URL(location.href);
      let changed=false;
      ['v','_update','rescue'].forEach(key=>{if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}});
      if(changed)history.replaceState(null,'',url.toString());
    }catch(error){}
  }

  async function refreshLegacyLaunchUrls(){
    const marker='lousaV66LegacyLaunchRepair';
    try{if(localStorage.getItem(marker)==='1')return}catch(error){}
    const urls=[
      './v52.html?pwa=1&v=57',
      './v52.html?androidapp=1',
      './v52.html?androidapp=1&apk=2',
      './v52.html?androidapp=1&apk=3'
    ];
    try{
      const results=await Promise.all(urls.map(async url=>{
        const response=await fetch(url,{cache:'reload'});
        return response.ok;
      }));
      if(results.every(Boolean)){
        try{localStorage.setItem(marker,'1')}catch(error){}
      }
    }catch(error){}
  }

  function reinforceCurrentVersion(){
    try{
      document.querySelectorAll('.lousaVersionOnly').forEach(el=>{el.textContent='v66'});
    }catch(error){}
  }

  cleanLegacyQuery();
  refreshLegacyLaunchUrls();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reinforceCurrentVersion,{once:true});
  else reinforceCurrentVersion();
})();
