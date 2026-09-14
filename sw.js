const VERSION='70-install-auto-1';
const CONTENT_VERSION='70';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './start.html',
  './index.html',
  './v52.html',
  './loader-v55.js?v=69legacy',
  './v68.html',
  './loader-v68.js?v=70install-auto',
  './v37.css?v=70',
  './v37.js?v=70',
  './v41.js?v=70',
  './v50.js?v=70',
  './pwa-v39.css?v=70',
  './pwa-v52.js?v=70install-auto',
  './v54.js?v=70',
  './v55.js?v=70',
  './v56.js?v=70',
  './v57.js?v=70',
  './v58.js?v=70',
  './v59.js?v=70',
  './v60.js?v=70',
  './v62.js?v=70',
  './v63.js?v=70',
  './v64.js?v=70',
  './v65.js?v=70',
  './v66.js?v=70',
  './v67.js?v=70',
  './v68.js?v=70',
  './v69.js?v=70',
  './v70-data-01.js?v=70',
  './v70-data-02.js?v=70',
  './v70-data-03.js?v=70',
  './v70-data-04.js?v=70',
  './v70-data-05.js?v=70',
  './v70-data-06.js?v=70',
  './v70-data-07.js?v=70',
  './v70-data-08.js?v=70',
  './v70-data-09.js?v=70',
  './v70-data-10.js?v=70',
  './v70-data-11.js?v=70',
  './v70.js?v=70',
  './v55-auto-update.js?v=70',
  './manifest.webmanifest?v=70',
  './icons/lousa-icon-192.png?v=70',
  './icons/lousa-icon-512.png?v=70'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    // Não usa skipWaiting automaticamente. Uma atualização encontrada enquanto
    // o aluno estuda fica aguardando e só assume após o aplicativo ser fechado.
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('lousa-de-estudos-v')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
    // Nunca navegar/recarregar janelas abertas durante uma lição.
  })());
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone()).catch(()=>{});
    }
    return response;
  }catch(error){
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached)return cached;
    throw error;
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(url.pathname.endsWith('/app-version.json')||url.pathname.endsWith('/start.html')||url.pathname.endsWith('/v52.html')||url.pathname.endsWith('/loader-v55.js')||url.pathname.endsWith('/v68.html')){
    event.respondWith(networkFirst(request));
    return;
  }

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response&&response.ok){
          const cache=await caches.open(CACHE);
          cache.put(request,response.clone()).catch(()=>{});
          return response;
        }
      }catch(error){}
      return (await caches.match('./start.html',{ignoreSearch:true}))||(await caches.match('./v68.html',{ignoreSearch:true}))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
