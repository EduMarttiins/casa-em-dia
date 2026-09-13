(async()=>{
  try{
    const response=await fetch('./index.html?raw=v50&ts='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('Falha ao carregar a base do aplicativo');
    let html=await response.text();
    html=html.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="50">');
    html=html.replace(/\.\/manifest\.webmanifest(?:\?[^"']*)?/g,'./manifest.webmanifest?v=50');
    html=html.replace(/\.\/icons\/lousa-icon\.svg(?:\?[^"']*)?/g,'./icons/lousa-icon-v35.jpg?v=50');
    html=html.replace(/type="image\/svg\+xml"/g,'type="image/jpeg"');
    html=html.replace(/<script>\s*\(\(\)\s*=>\s*\{\s*let deferredInstallPrompt=null;[\s\S]*?\}\)\(\);\s*<\/script>/g,'');
    html=html.replace(/<link rel="stylesheet" href="\.\/(?:v3[5-9]|v4[0-9]|v50|pwa-v3[9]|pwa-v4[0-9]|pwa-v50)\.css\?v=\d+">\s*/g,'');
    html=html.replace(/<script src="\.\/(?:v3[5-9]|v4[0-9]|v50|pwa-v3[9]|pwa-v4[0-9]|pwa-v50)\.js\?v=\d+"(?: defer)?><\/script>\s*/g,'');
    const css='\n<link rel="stylesheet" href="./v37.css?v=50">\n<link rel="stylesheet" href="./pwa-v39.css?v=50">\n';
    html=html.replace('</head>',css+'</head>');
    const scripts='\n<scr'+'ipt src="./v37.js?v=50"></scr'+'ipt>\n<scr'+'ipt src="./v41.js?v=50"></scr'+'ipt>\n<scr'+'ipt src="./v50.js?v=50"></scr'+'ipt>\n<scr'+'ipt src="./pwa-v50.js?v=50"></scr'+'ipt>\n';
    html=html.replace('</body>',scripts+'</body>');
    document.open();document.write(html);document.close();
  }catch(error){
    const card=document.querySelector('.v50card');
    if(card)card.innerHTML='<strong>Não foi possível abrir agora.</strong><p>Feche esta aba e abra novamente.</p>';
    console.error(error);
  }
})();
