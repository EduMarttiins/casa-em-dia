const VERSION='44';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './v44.html',
  './v37.css?v=44',
  './v37.js?v=44',
  './v41.js?v=44',
  './pwa-v39.css?v=44',
  './pwa-v44.js?v=44',
  './manifest.webmanifest?v=44',
  './icons/lousa-icon-192.png?v=44',
  './icons/lousa-icon-512.png?v=44'
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
    const cached=await caches.match(request);
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
      const target=new URL('./v44.html?v=44',self.registration.scope).toString();
      try{
        const response=await fetch(target,{cache:'no-store'});
        if(response&&response.ok){
          const cache=await caches.open(CACHE);
          cache.put('./v44.html',response.clone()).catch(()=>{});
          return response;
        }
      }catch(error){}
      return (await caches.match('./v44.html'))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
