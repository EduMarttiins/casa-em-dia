const VERSION='67-dicionario-infantil-1';
const CONTENT_VERSION='67';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './start.html',
  './index.html',
  './v52.html',
  './loader-v55.js?v=67',
  './v37.css?v=67',
  './v37.js?v=67',
  './v41.js?v=67',
  './v50.js?v=67',
  './pwa-v39.css?v=67',
  './pwa-v52.js?v=67',
  './v54.js?v=67',
  './v55.js?v=67',
  './v56.js?v=67',
  './v57.js?v=67',
  './v58.js?v=67',
  './v59.js?v=67',
  './v60.js?v=67',
  './v62.js?v=67',
  './v63.js?v=67',
  './v64.js?v=67',
  './v65.js?v=67',
  './v66.js?v=67',
  './v67.js?v=67',
  './v55-auto-update.js?v=67',
  './manifest.webmanifest?v=67',
  './icons/lousa-icon-192.png?v=67',
  './icons/lousa-icon-512.png?v=67'
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
    await new Promise(resolve=>setTimeout(resolve,350));
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    await Promise.all(windows.map(async client=>{
      try{
        const url=new URL(client.url);
        if(url.origin!==self.location.origin)return;
        if(url.pathname.endsWith('/start.html'))return;
        const scopePath=new URL(self.registration.scope).pathname;
        const isAppEntry=url.pathname===scopePath||url.pathname.endsWith('/v52.html')||url.pathname.endsWith('/index.html');
        if(!isAppEntry)return;
        const target=new URL('./start.html',self.registration.scope);
        target.searchParams.set('pwa','1');
        target.searchParams.set('rescue',CONTENT_VERSION);
        target.searchParams.set('ts',String(Date.now()));
        if(url.searchParams.get('androidapp')==='1')target.searchParams.set('androidapp','1');
        if(url.searchParams.get('apk'))target.searchParams.set('apk',url.searchParams.get('apk'));
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

  if(url.pathname.endsWith('/app-version.json')||url.pathname.endsWith('/start.html')){
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
      return (await caches.match('./start.html',{ignoreSearch:true}))||(await caches.match('./v52.html',{ignoreSearch:true}))||networkFirst(request);
    })());
    return;
  }

  event.respondWith(networkFirst(request));
});
