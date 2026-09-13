const VERSION='39';
const CACHE='lousa-de-estudos-v'+VERSION;
const ASSETS=[
  './manifest.webmanifest?v=39',
  './v37.css?v=39',
  './v37.js?v=39',
  './pwa-v39.css?v=39',
  './pwa-v39.js?v=39',
  './icons/lousa-icon-v35.jpg?v=39'
];

function upgradeHtml(html){
  let next=String(html||'');

  next=next.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="39">');
  next=next.replace(/\.\/icons\/lousa-icon\.svg/g,'./icons/lousa-icon-v35.jpg?v=39');
  next=next.replace(/type="image\/svg\+xml"/g,'type="image/jpeg"');

  // Remove qualquer injeção externa das versões 35 a 39 antes de inserir a base aprovada.
  next=next.replace(/<link rel="stylesheet" href="\.\/(?:v3[5-9]|pwa-v39)\.css\?v=\d+">\s*/g,'');
  next=next.replace(/<script src="\.\/(?:v3[5-9]|pwa-v39)\.js\?v=\d+" defer><\/script>\s*/g,'');

  const injected=[
    '<link rel="stylesheet" href="./v37.css?v=39">',
    '<link rel="stylesheet" href="./pwa-v39.css?v=39">',
    '<script src="./v37.js?v=39" defer></script>',
    '<script src="./pwa-v39.js?v=39" defer></script>'
  ].join('\n');

  next=next.replace('</head>',injected+'\n</head>');
  return next;
}

function htmlResponse(source,html){
  const headers=new Headers(source&&source.headers?source.headers:undefined);
  headers.set('content-type','text/html; charset=utf-8');
  headers.set('cache-control','no-store, no-cache, must-revalidate');
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
  const response=await fetch('./index.html?source=39',{cache:'no-store'});
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