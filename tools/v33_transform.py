from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="32">','<meta name="app-version" content="33">',1)

head='''
<link rel="manifest" href="./manifest.webmanifest">
<link rel="icon" href="./icons/lousa-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="./icons/lousa-icon.svg">
<meta name="theme-color" content="#2f9d59">
<meta name="application-name" content="Lousa de Estudos">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Lousa de Estudos">
'''
if 'rel="manifest" href="./manifest.webmanifest"' not in s:
    s=s.replace('</head>',head+'</head>',1)

css='''
/* Versão 33: instalação PWA e aviso de atualização */
.v33PwaPrompt{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9999;width:min(92vw,430px);padding:16px;border-radius:22px;background:#fff;border:1px solid #dbe8df;box-shadow:0 18px 52px rgba(22,38,30,.22);display:none;align-items:flex-start;gap:12px}
.v33PwaPrompt.show{display:flex}
.v33PwaIcon{width:56px;height:56px;flex:0 0 56px;border-radius:16px;background:#f3f8f5;border:1px solid #e2ece5;display:grid;place-items:center;overflow:hidden}
.v33PwaIcon img{width:100%;height:100%;object-fit:cover}
.v33PwaBody{min-width:0;flex:1}.v33PwaBody strong{display:block;font-size:16px;color:#1f2937;margin:1px 0 5px}.v33PwaBody p{margin:0;color:#64748b;font-size:13px;line-height:1.48}
.v33PwaActions{display:flex;gap:8px;margin-top:11px;flex-wrap:wrap}.v33PwaBtn{border:1px solid #d7e4da;background:#fff;color:#33463b;border-radius:12px;padding:9px 12px;font-weight:900;font-size:13px}.v33PwaBtn.primary{background:#2f9d59;border-color:#2f9d59;color:#fff}
.v33PwaClose{border:0;background:transparent;color:#8a9890;padding:2px 3px;font-size:20px;line-height:1;cursor:pointer}
@media(max-width:520px){.v33PwaPrompt{width:calc(100vw - 24px);padding:14px;border-radius:19px}.v33PwaIcon{width:50px;height:50px;flex-basis:50px}}
'''
if '.v33PwaPrompt{' not in s:
    s=s.replace('</style>',css+'</style>',1)

script=r'''
<script>
(() => {
  let deferredInstallPrompt=null;
  let refreshing=false;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function getPwaPrompt(){
    let box=document.getElementById('v33PwaPrompt');
    if(box)return box;
    box=document.createElement('div');
    box.id='v33PwaPrompt';box.className='v33PwaPrompt';
    box.innerHTML='<div class="v33PwaIcon"><img src="./icons/lousa-icon.svg" alt=""></div><div class="v33PwaBody"><strong></strong><p></p><div class="v33PwaActions"></div></div><button class="v33PwaClose" type="button" aria-label="Fechar">×</button>';
    box.querySelector('.v33PwaClose').addEventListener('click',()=>box.classList.remove('show'));
    document.body.appendChild(box);
    return box;
  }

  function showCard(title,text,buttons){
    const box=getPwaPrompt();
    box.querySelector('.v33PwaBody strong').textContent=title;
    box.querySelector('.v33PwaBody p').textContent=text;
    const actions=box.querySelector('.v33PwaActions');actions.innerHTML='';
    buttons.forEach(item=>{
      const btn=document.createElement('button');btn.type='button';btn.className='v33PwaBtn'+(item.primary?' primary':'');btn.textContent=item.label;btn.addEventListener('click',item.action);actions.appendChild(btn);
    });
    box.classList.add('show');
  }

  function showInstallCard(){
    if(isStandalone()||!deferredInstallPrompt)return;
    showCard('Instalar Lousa de Estudos','Coloque o aplicativo na tela inicial do celular para abrir como um app.',[
      {label:'Instalar agora',primary:true,action:async()=>{
        const prompt=deferredInstallPrompt;if(!prompt)return;
        prompt.prompt();
        try{await prompt.userChoice}catch(e){}
        deferredInstallPrompt=null;
        getPwaPrompt().classList.remove('show');
      }}
    ]);
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    showInstallCard();
  });

  window.addEventListener('appinstalled',()=>{
    deferredInstallPrompt=null;
    const box=document.getElementById('v33PwaPrompt');if(box)box.classList.remove('show');
  });

  function showUpdateCard(worker){
    if(!worker)return;
    showCard('Nova versão disponível','A Lousa de Estudos foi atualizada. Toque abaixo para usar a versão mais recente.',[
      {label:'Atualizar agora',primary:true,action:()=>worker.postMessage({type:'SKIP_WAITING'})}
    ]);
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;
      refreshing=true;
      window.location.reload();
    });

    window.addEventListener('load',async()=>{
      try{
        const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
        const checkUpdate=()=>registration.update().catch(()=>{});
        checkUpdate();
        setInterval(checkUpdate,60000);
        document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkUpdate()});

        if(registration.waiting&&navigator.serviceWorker.controller)showUpdateCard(registration.waiting);

        registration.addEventListener('updatefound',()=>{
          const worker=registration.installing;
          if(!worker)return;
          worker.addEventListener('statechange',()=>{
            if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdateCard(worker);
          });
        });
      }catch(error){
        console.warn('PWA não pôde ser registrado',error);
      }
    });
  }

  setTimeout(()=>{
    const ua=navigator.userAgent.toLowerCase();
    const ios=/iphone|ipad|ipod/.test(ua);
    if(ios&&!isStandalone()&&!deferredInstallPrompt){
      showCard('Instalar Lousa de Estudos','No Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.',[]);
    }
  },2500);
})();
</script>
'''
if 'id=\'v33PwaPrompt\'' not in s and 'v33PwaPrompt' not in s[s.rfind('</style>'):]:
    s=s.replace('</body>',script+'\n</body>',1)

checks=['app-version" content="33','manifest.webmanifest','v33PwaPrompt','beforeinstallprompt','serviceWorker.register(\'./sw.js\'','Nova versão disponível','Atualizar agora']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 33 aplicada',len(s.encode()))
