const VERSION='53';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './v52.html',
  './loader-v52.js?v=53',
  './v37.css?v=53',
  './v37.js?v=53',
  './v41.js?v=53',
  './v50.js?v=53',
  './pwa-v39.css?v=53',
  './pwa-v52.js?v=53',
  './v53-auto-update.js?v=53',
  './app-version.json?v=53',
  './manifest.webmanifest?v=53',
  './icons/lousa-icon-192.png?v=53',
  './icons/lousa-icon-512.png?v=53'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith('lousa-de-estudos-v')&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
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
      return (await caches.match('./v52.html',{ignoreSearch:true}))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
