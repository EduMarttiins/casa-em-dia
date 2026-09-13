const VERSION='37';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './manifest.webmanifest',
  './v37.css?v=37',
  './v37.js?v=37',
  './icons/lousa-icon-v35.jpg?v=37'
];

function upgradeHtml(html){
  let next=String(html||'');
  next=next.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="37">');
  next=next.replace(/\.\/icons\/lousa-icon\.svg/g,'./icons/lousa-icon-v35.jpg?v=37');
  next=next.replace('type="image/svg+xml"','type="image/jpeg"');
  next=next.replace(/<link rel="stylesheet" href="\.\/v35\.css\?v=35">\s*/g,'');
  next=next.replace(/<script src="\.\/v35\.js\?v=35" defer><\/script>\s*/g,'');
  next=next.replace(/<link rel="stylesheet" href="\.\/v36\.css\?v=36">\s*/g,'');
  next=next.replace(/<script src="\.\/v36\.js\?v=36" defer><\/script>\s*/g,'');
  next=next.replace(/<link rel="stylesheet" href="\.\/v37\.css\?v=37">\s*/g,'');
  next=next.replace(/<script src="\.\/v37\.js\?v=37" defer><\/script>\s*/g,'');
  next=next.replace('</head>','<link rel="stylesheet" href="./v37.css?v=37">\n<script src="./v37.js?v=37" defer></script>\n</head>');
  return next;
}

function htmlResponse(source,html){
  const headers=new Headers(source&&source.headers?source.headers:undefined);
  headers.set('content-type','text/html; charset=utf-8');
  headers.set('cache-control','no-cache');
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(html,{
    status:source&&source.status?source.status:200,
    statusText:source&&source.statusText?source.statusText:'OK',
    headers
  });
}

async function buildCachedIndex(){
  const cache=await caches.open(CACHE);
  await cache.addAll(ASSETS);
  const response=await fetch('./index.html',{cache:'no-store'});
  if(!response.ok)throw new Error('Não foi possível atualizar index.html');
  const patched=htmlResponse(response,upgradeHtml(await response.text()));
  await cache.put('./index.html',patched);
}

self.addEventListener('install',event=>{
  event.waitUntil(buildCachedIndex().then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key.startsWith('lousa-de-estudos-v')&&key!==CACHE).map(key=>caches.delete(key))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

async function transformedIndex(request){
  const response=await fetch(request,{cache:'no-store'});
  if(!response.ok)return response;
  const patched=htmlResponse(response,upgradeHtml(await response.text()));
  const cache=await caches.open(CACHE);
  await cache.put('./index.html',patched.clone());
  return patched;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith(
      transformedIndex(request).catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>cached||fetch(request).then(response=>{
      if(!response||!response.ok)return response;
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy));
      return response;
    }))
  );
});
