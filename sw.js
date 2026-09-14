const VERSION='69-legacy-rescue-2';
const CONTENT_VERSION='69';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './start.html',
  './index.html',
  './v52.html',
  './loader-v55.js?v=69legacy',
  './v68.html',
  './loader-v68.js?v=69',
  './v37.css?v=69',
  './v37.js?v=69',
  './v41.js?v=69',
  './v50.js?v=69',
  './pwa-v39.css?v=69',
  './pwa-v52.js?v=69',
  './v54.js?v=69',
  './v55.js?v=69',
  './v56.js?v=69',
  './v57.js?v=69',
  './v58.js?v=69',
  './v59.js?v=69',
  './v60.js?v=69',
  './v62.js?v=69',
  './v63.js?v=69',
  './v64.js?v=69',
  './v65.js?v=69',
  './v66.js?v=69',
  './v67.js?v=69',
  './v68.js?v=69',
  './v69.js?v=69',
  './v55-auto-update.js?v=69',
  './manifest.webmanifest?v=69',
  './icons/lousa-icon-192.png?v=69',
  './icons/lousa-icon-512.png?v=69'
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
        const current=new URL(client.url);
        if(current.origin!==self.location.origin)return;
        const target=new URL('./start.html',self.registration.scope);
        target.searchParams.set('pwa','1');
        target.searchParams.set('worker','69legacy');
        target.searchParams.set('boot',String(Date.now()));
        if(current.searchParams.get('androidapp')==='1')target.searchParams.set('androidapp','1');
        if(current.searchParams.get('apk'))target.searchParams.set('apk',current.searchParams.get('apk'));
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
