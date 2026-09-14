(async()=>{
  try{
    const response=await fetch('./index.html?raw=v68&ts='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('Falha ao carregar a base do aplicativo');
    let html=await response.text();

    /* Versão 68: Português preserva o formato original de cada questão, aberta ou múltipla escolha. */
    const mcqIds=[];
    const idPattern=/"id"\s*:\s*"([^"]+)"\s*,\s*"type"\s*:\s*"mcq"/g;
    let match;
    while((match=idPattern.exec(html))!==null)mcqIds.push(match[1]);

    if(!localStorage.getItem('lousaV55AllWrittenMigration')){
      const prefix='cienciasRev3:';
      mcqIds.forEach(id=>{
        ['submitted','choice','explained','canvas','scratch'].forEach(suffix=>localStorage.removeItem(prefix+id+':'+suffix));
      });
      const remove=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k&&k.startsWith(prefix+'lesson:')&&(/:(?:sent|sentAt|sentEmail)$/.test(k)))remove.push(k);
      }
      remove.forEach(k=>localStorage.removeItem(k));
      localStorage.setItem('lousaV55AllWrittenMigration','1');
    }

    html=html.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="68">');
    html=html.replace(/\.\/manifest\.webmanifest(?:\?[^"']*)?/g,'./manifest.webmanifest?v=68');
    html=html.replace(/\.\/icons\/lousa-icon\.svg(?:\?[^"']*)?/g,'./icons/lousa-icon-512.png?v=68');
    html=html.replace(/type="image\/svg\+xml"/g,'type="image/png"');
    html=html.replace(/<link rel="stylesheet" href="\.\/(?:v3[5-9]|v4[0-9]|v5[0-9]|v6[0-9]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-9]|pwa-v6[0-9])\.css\?v=\d+">\s*/g,'');
    html=html.replace(/<script src="\.\/(?:v3[5-9]|v4[0-9]|v5[0-9]|v6[0-9]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-9]|pwa-v6[0-9])\.js\?v=\d+"(?: defer)?><\/script>\s*/g,'');
    const css='\n<link rel="stylesheet" href="./v37.css?v=68">\n<link rel="stylesheet" href="./pwa-v39.css?v=68">\n';
    html=html.replace('</head>',css+'</head>');
    const scripts='\n<scr'+'ipt src="./v37.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v41.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v50.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./pwa-v52.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v54.js?v=68"></scr'+'ipt>\n<scr'+'ipt>try{window.__lousaV68PortugueseSnapshot=JSON.parse(JSON.stringify(portugueseLessons));}catch(e){window.__lousaV68PortugueseSnapshot=[];}</scr'+'ipt>\n<scr'+'ipt src="./v55.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v56.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v57.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v58.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v59.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v60.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v62.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v63.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v64.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v65.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v66.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v67.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v68.js?v=68"></scr'+'ipt>\n<scr'+'ipt src="./v55-auto-update.js?v=68"></scr'+'ipt>\n';
    html=html.replace('</body>',scripts+'</body>');
    document.open();document.write(html);document.close();
  }catch(error){
    const card=document.querySelector('.v52card');
    if(card)card.innerHTML='<strong>Não foi possível abrir agora.</strong><p>Feche esta aba e abra novamente.</p>';
    console.error(error);
  }
})();
