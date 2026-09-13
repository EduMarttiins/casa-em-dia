const VERSION='48';
const CACHE='lousa-de-estudos-v'+VERSION;
const CORE=[
  './app.html',
  './content-v48.html',
  './index.html',
  './manifest.webmanifest',
  './v37.css',
  './v37.js',
  './v41.js',
  './icons/lousa-icon-192.png',
  './icons/lousa-icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const asset of CORE){
      try{await cache.add(new Request(asset,{cache:'reload'}))}catch(error){}
    }
  })());
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
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});
    return response;
  }catch(error){
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached)return cached;
    throw error;
  }
}

async function cacheFirst(request){
  const cached=await caches.match(request,{ignoreSearch:true});
  if(cached)return cached;
  const response=await fetch(request);
  if(response&&response.ok){
    const cache=await caches.open(CACHE);
    cache.put(request,response.clone()).catch(()=>{});
  }
  return response;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{return await networkFirst(request)}catch(error){
        return (await caches.match('./app.html',{ignoreSearch:true}))||(await caches.match('./index.html',{ignoreSearch:true}))||Response.error();
      }
    })());
    return;
  }

  if(['style','script','image','font'].includes(request.destination)){
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
