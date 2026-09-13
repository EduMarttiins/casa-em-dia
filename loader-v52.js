(async()=>{
  try{
    const response=await fetch('./index.html?raw=v53&ts='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('Falha ao carregar a base do aplicativo');
    let html=await response.text();

    const ptStart=html.indexOf('const portugueseLessons=');
    const ptEnd=ptStart>=0?html.indexOf('const mathLessons=',ptStart):-1;
    if(ptStart>=0&&ptEnd>ptStart){
      let ptBlock=html.slice(ptStart,ptEnd);
      const mcqIds=[];
      const idPattern=/"id"\s*:\s*"([^"]+)"\s*,\s*"type"\s*:\s*"mcq"/g;
      let match;
      while((match=idPattern.exec(ptBlock))!==null)mcqIds.push(match[1]);

      if(!localStorage.getItem('lousaV53PortugueseWrittenMigration')){
        const prefix='cienciasRev3:';
        mcqIds.forEach(id=>{
          ['submitted','choice','explained','canvas'].forEach(suffix=>localStorage.removeItem(prefix+id+':'+suffix));
        });
        ['pistas','entrelinhas','ideia','fatoopiniao','pistaspalavras','humor','finalidade','sequencia','narrador','referencias','resumo','desafiofinal'].forEach(lesson=>{
          ['sent','sentAt','sentEmail'].forEach(suffix=>localStorage.removeItem(prefix+'lesson:portuguese:'+lesson+':'+suffix));
        });
        localStorage.setItem('lousaV53PortugueseWrittenMigration','1');
      }

      ptBlock=ptBlock.replace(/"type"\s*:\s*"mcq"/g,'"type":"open"');
      html=html.slice(0,ptStart)+ptBlock+html.slice(ptEnd);
    }

    html=html.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="53">');
    html=html.replace(/\.\/manifest\.webmanifest(?:\?[^"']*)?/g,'./manifest.webmanifest?v=53');
    html=html.replace(/\.\/icons\/lousa-icon\.svg(?:\?[^"']*)?/g,'./icons/lousa-icon-512.png?v=53');
    html=html.replace(/type="image\/svg\+xml"/g,'type="image/png"');
    html=html.replace(/<link rel="stylesheet" href="\.\/(?:v3[5-9]|v4[0-9]|v5[0-3]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-3])\.css\?v=\d+">\s*/g,'');
    html=html.replace(/<script src="\.\/(?:v3[5-9]|v4[0-9]|v5[0-3]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-3])\.js\?v=\d+"(?: defer)?><\/script>\s*/g,'');
    const css='\n<link rel="stylesheet" href="./v37.css?v=53">\n<link rel="stylesheet" href="./pwa-v39.css?v=53">\n';
    html=html.replace('</head>',css+'</head>');
    const scripts='\n<scr'+'ipt src="./v37.js?v=53"></scr'+'ipt>\n<scr'+'ipt src="./v41.js?v=53"></scr'+'ipt>\n<scr'+'ipt src="./v50.js?v=53"></scr'+'ipt>\n<scr'+'ipt src="./pwa-v52.js?v=53"></scr'+'ipt>\n<scr'+'ipt src="./v53-auto-update.js?v=53"></scr'+'ipt>\n';
    html=html.replace('</body>',scripts+'</body>');
    document.open();document.write(html);document.close();
  }catch(error){
    const card=document.querySelector('.v52card');
    if(card)card.innerHTML='<strong>Não foi possível abrir agora.</strong><p>Feche esta aba e abra novamente.</p>';
    console.error(error);
  }
})();
