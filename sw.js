const VERSION='50';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './v50.html',
  './loader-v50.js?v=50',
  './v37.css?v=50',
  './v37.js?v=50',
  './v41.js?v=50',
  './v50.js?v=50',
  './pwa-v39.css?v=50',
  './pwa-v50.js?v=50',
  './manifest.webmanifest?v=50',
  './icons/lousa-icon-v35.jpg?v=50'
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
      const target=new URL('./v50.html?v=50',self.registration.scope).toString();
      try{
        const response=await fetch(target,{cache:'no-store'});
        if(response&&response.ok){
          const cache=await caches.open(CACHE);
          cache.put('./v50.html',response.clone()).catch(()=>{});
          return response;
        }
      }catch(error){}
      return (await caches.match('./v50.html'))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
