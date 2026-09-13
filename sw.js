const VERSION='49';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './v49.html',
  './v37.css?v=49',
  './v37.js?v=49',
  './v41.js?v=49',
  './pwa-v39.css?v=49',
  './pwa-v49.js?v=49',
  './manifest.webmanifest?v=49',
  './icons/lousa-icon-v35.jpg?v=49'
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
      const target=new URL('./v49.html?v=49',self.registration.scope).toString();
      try{
        const response=await fetch(target,{cache:'no-store'});
        if(response&&response.ok){
          const cache=await caches.open(CACHE);
          cache.put('./v49.html',response.clone()).catch(()=>{});
          return response;
        }
      }catch(error){}
      return (await caches.match('./v49.html'))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
