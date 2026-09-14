const VERSION='61-rescue-1';
const CONTENT_VERSION='61';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './index.html',
  './v52.html',
  './loader-v55.js?v=61',
  './v37.css?v=61',
  './v37.js?v=61',
  './v41.js?v=61',
  './v50.js?v=61',
  './pwa-v39.css?v=61',
  './pwa-v52.js?v=61',
  './v54.js?v=61',
  './v55.js?v=61',
  './v56.js?v=61',
  './v57.js?v=61',
  './v58.js?v=61',
  './v59.js?v=61',
  './v60.js?v=61',
  './v55-auto-update.js?v=61',
  './app-version.json?v=61',
  './manifest.webmanifest?v=61',
  './icons/lousa-icon-192.png?v=61',
  './icons/lousa-icon-512.png?v=61'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('lousa-de-estudos-v')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    await Promise.all(windows.map(async client=>{
      try{
        const url=new URL(client.url);
        if(url.origin!==self.location.origin)return;
        const scopePath=new URL(self.registration.scope).pathname;
        const isAppEntry=url.pathname===scopePath||url.pathname.endsWith('/v52.html')||url.pathname.endsWith('/index.html');
        if(!isAppEntry)return;
        if(url.searchParams.get('content')===CONTENT_VERSION)return;
        const target=new URL('./v52.html',self.registration.scope);
        target.searchParams.set('pwa','1');
        target.searchParams.set('content',CONTENT_VERSION);
        target.searchParams.set('rescue','1');
        await client.navigate(target.toString());
      }catch(error){}
    }));
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
      return (await caches.match('./v52.html',{ignoreSearch:true}))||networkFirst(request);
    })());
    return;
  }
  event.respondWith(networkFirst(request));
});
