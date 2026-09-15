(async()=>{
  try{
    const response=await fetch('./index.html?raw=v74&ts='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('Falha ao carregar a base do aplicativo');
    let html=await response.text();
    html=html.replace(/<meta name="app-version" content="[^"]*">/,'<meta name="app-version" content="74">');
    html=html.replace(/\.\/manifest\.webmanifest(?:\?[^"']*)?/g,'./manifest.webmanifest?v=74');
    html=html.replace(/\.\/icons\/lousa-icon\.svg(?:\?[^"']*)?/g,'./icons/lousa-icon-512.png?v=74');
    html=html.replace(/type="image\/svg\+xml"/g,'type="image/png"');
    html=html.replace(/<link rel="stylesheet" href="\.\/(?:v3[5-9]|v4[0-9]|v5[0-9]|v6[0-9]|v7[0-9]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-9]|pwa-v6[0-9]|pwa-v7[0-9])\.css\?v=[^"']+">\s*/g,'');
    html=html.replace(/<script src="\.\/(?:v3[5-9]|v4[0-9]|v5[0-9]|v6[0-9]|v7[0-9]|pwa-v3[9]|pwa-v4[0-9]|pwa-v5[0-9]|pwa-v6[0-9]|pwa-v7[0-9])\.js\?v=[^"']+"(?: defer)?><\/script>\s*/g,'');
    html=html.replace('</head>','\n<link rel="stylesheet" href="./v37.css?v=74">\n<link rel="stylesheet" href="./pwa-v39.css?v=74">\n</head>');

    const before=[
      './v37.js?v=74','./v41.js?v=74','./v50.js?v=74','./pwa-v52.js?v=70install-auto','./v54.js?v=74'
    ];
    const after=[
      './v55.js?v=74','./v56.js?v=74','./v57.js?v=74','./v58.js?v=74','./v59.js?v=74','./v60.js?v=74',
      './v62.js?v=74','./v63.js?v=74','./v64.js?v=74','./v65.js?v=74','./v66.js?v=74','./v67.js?v=74',
      './v68.js?v=74','./v69.js?v=74','./v70-data-01.js?v=74','./v70-data-02.js?v=74','./v70-data-03.js?v=74',
      './v70-data-04.js?v=74','./v70-data-05.js?v=74','./v70-data-06.js?v=74','./v70-data-07.js?v=74','./v70-data-08.js?v=74',
      './v70-data-09.js?v=74','./v70-data-10.js?v=74','./v70-data-11.js?v=74','./v70.js?v=74','./v71.js?v=74','./v72.js?v=74','./v73.js?v=74','./v74.js?v=74',
      './v55-auto-update.js?v=74'
    ];
    const tags=list=>list.map(src=>'<script src="'+src+'"><\/script>').join('\n');
    const snapshot='<script>window.__lousaCurrentContentVersion=74;try{window.__lousaV68PortugueseSnapshot=JSON.parse(JSON.stringify(portugueseLessons));}catch(e){window.__lousaV68PortugueseSnapshot=[];}<\/script>';
    const injected='\n'+tags(before)+'\n'+snapshot+'\n'+tags(after)+'\n';
    html=html.replace('</body>',injected+'</body>');
    document.open();document.write(html);document.close();
  }catch(error){
    const card=document.querySelector('.v68card');
    if(card)card.innerHTML='<strong>Não foi possível abrir agora.</strong><p>Feche o aplicativo e abra novamente.</p>';
    console.error(error);
  }
})();
