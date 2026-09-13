const VERSION='45';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './install-v45.html',
  './v45.html',
  './v37.css?v=45',
  './v37.js?v=45',
  './v41.js?v=45',
  './pwa-v39.css?v=45',
  './pwa-v45.js?v=45',
  './manifest.webmanifest?v=45',
  './icons/lousa-icon-192.png?v=45',
  './icons/lousa-icon-512.png?v=45'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('lousa-de-estudos-v')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
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

      const cached=await caches.match(request,{ignoreSearch:true});
      if(cached)return cached;
      return (await caches.match('./v45.html',{ignoreSearch:true}))||(await caches.match('./index.html',{ignoreSearch:true}));
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
