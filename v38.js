/* Lousa de Estudos, versão 38 */
(() => {
  const versionMeta=document.querySelector('meta[name="app-version"]');
  if(versionMeta) versionMeta.setAttribute('content','38');

  window.setupCanvas=function(board,q,onChange,isLocked,storageSuffix='canvas'){
    const canvas=board.querySelector('canvas');
    const wrap=board.querySelector('.canvasWrap');
    const ctx=canvas.getContext('2d',{alpha:true,desynchronized:false});
    const pen=board.querySelector('.pen');
    const eraser=board.querySelector('.eraser');
    const undo=board.querySelector('.undo');
    const clear=board.querySelector('.clear');
    const range=board.querySelector('.sizeRange');
    const sizeValue=board.querySelector('.sizeValue');

    let drawing=false;
    let tool='pen';
    let history=[];
    let dpr=1;
    let w=0;
    let h=0;
    let lastPoint=null;
    let previousPoint=null;
    let restoreToken=0;
    let resizeRaf=0;

    const savedSize=localStorage.getItem(PREFIX+'penSize')||'2';
    range.value=savedSize;
    range.min='1';
    range.max=range.max||'12';
    range.step='1';
    sizeValue.textContent=savedSize+' px';

    canvas.style.touchAction='none';
    canvas.style.imageRendering='auto';

    function quality(){
      ctx.globalAlpha=1;
      ctx.lineCap='round';
      ctx.lineJoin='round';
      ctx.miterLimit=1;
      ctx.imageSmoothingEnabled=true;
      if('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality='high';
    }

    function resetTransform(){ctx.setTransform(1,0,0,1,0,0)}
    function cssTransform(){ctx.setTransform(dpr,0,0,dpr,0,0)}
    function clearPixels(){resetTransform();ctx.clearRect(0,0,canvas.width,canvas.height);cssTransform()}

    function restoreImage(src,saveAfter=false,token=restoreToken){
      if(!src)return;
      const img=new Image();
      img.onload=()=>{
        if(token!==restoreToken||drawing)return;
        resetTransform();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        cssTransform();quality();
        ctx.drawImage(img,0,0,w,h);
        if(saveAfter)save();
      };
      img.src=src;
    }

    function fit(force=false){
      const r=wrap.getBoundingClientRect();
      if(r.width<2||r.height<2)return false;
      const nextW=Math.max(1,r.width),nextH=Math.max(1,r.height);
      const nextDpr=Math.min(4,Math.max(1,window.devicePixelRatio||1));
      const targetWidth=Math.max(1,Math.round(nextW*nextDpr));
      const targetHeight=Math.max(1,Math.round(nextH*nextDpr));
      const unchanged=!force&&w>0&&h>0&&canvas.width===targetWidth&&canvas.height===targetHeight;
      w=nextW;h=nextH;dpr=nextDpr;
      if(unchanged){cssTransform();quality();return true}
      const saved=getCanvas(q,storageSuffix);
      restoreToken++;
      canvas.width=targetWidth;canvas.height=targetHeight;
      canvas.style.width=w+'px';canvas.style.height=h+'px';
      cssTransform();quality();
      if(saved)restoreImage(saved,false,restoreToken);
      return true;
    }

    function ensureReady(){
      const r=wrap.getBoundingClientRect();
      if(r.width<2||r.height<2)return false;
      const ratio=Math.min(4,Math.max(1,window.devicePixelRatio||1));
      const expectedW=Math.max(1,Math.round(r.width*ratio));
      const expectedH=Math.max(1,Math.round(r.height*ratio));
      if(w<2||h<2||canvas.width!==expectedW||canvas.height!==expectedH)fit(true);
      return w>=2&&h>=2;
    }

    function point(e){
      const r=canvas.getBoundingClientRect();
      const logicalW=w||r.width||1,logicalH=h||r.height||1;
      return{x:(e.clientX-r.left)*(logicalW/Math.max(1,r.width)),y:(e.clientY-r.top)*(logicalH/Math.max(1,r.height))};
    }

    function currentWidth(){
      const shown=Math.max(1,Number(range.value)||1);
      if(tool==='eraser')return Math.max(14,shown*2.4);
      if(shown===1)return 1.05;
      if(shown===2)return 1.55;
      if(shown===3)return 2.15;
      return shown*0.78;
    }

    function config(){
      cssTransform();
      ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';
      ctx.strokeStyle='#111827';ctx.fillStyle='#111827';ctx.lineWidth=currentWidth();quality();
    }

    function save(){try{localStorage.setItem(key(q.id,storageSuffix),canvas.toDataURL('image/png'));onChange()}catch(e){}}
    function snapshot(){try{history.push(canvas.toDataURL('image/png'));if(history.length>20)history.shift()}catch(e){}}
    function drawDot(p){config();ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0.5,ctx.lineWidth/2),0,Math.PI*2);ctx.fill()}

    function drawSmoothSegment(a,b,c){
      if(!a||!b)return;
      config();ctx.beginPath();
      if(c){
        const startX=(a.x+b.x)/2,startY=(a.y+b.y)/2,endX=(b.x+c.x)/2,endY=(b.y+c.y)/2;
        ctx.moveTo(startX,startY);ctx.quadraticCurveTo(b.x,b.y,endX,endY);
      }else{ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y)}
      ctx.stroke();
    }

    function down(e){
      if(isLocked())return;
      e.preventDefault();
      if(!ensureReady())return;
      restoreToken++;drawing=true;snapshot();
      try{canvas.setPointerCapture(e.pointerId)}catch(err){}
      const p=point(e);previousPoint=null;lastPoint=p;drawDot(p);
    }

    function move(e){
      if(!drawing||isLocked())return;
      e.preventDefault();
      const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];
      for(const ev of events){
        const p=point(ev);
        if(!lastPoint){lastPoint=p;continue}
        const dx=p.x-lastPoint.x,dy=p.y-lastPoint.y;
        if((dx*dx+dy*dy)<0.01)continue;
        if(previousPoint)drawSmoothSegment(previousPoint,lastPoint,p);else drawSmoothSegment(lastPoint,p,null);
        previousPoint=lastPoint;lastPoint=p;
      }
    }

    function end(e){
      if(!drawing)return;
      if(previousPoint&&lastPoint)drawSmoothSegment(previousPoint,lastPoint,null);
      drawing=false;previousPoint=null;lastPoint=null;ctx.globalCompositeOperation='source-over';
      try{if(e&&canvas.hasPointerCapture&&canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId)}catch(err){}
      save();
    }

    canvas.addEventListener('pointerdown',down,{passive:false});
    canvas.addEventListener('pointermove',move,{passive:false});
    canvas.addEventListener('pointerup',end,{passive:false});
    canvas.addEventListener('pointercancel',end,{passive:false});
    canvas.addEventListener('pointerleave',e=>{if(drawing&&e.buttons===0)end(e)});

    pen.addEventListener('click',()=>{tool='pen';pen.classList.add('active');eraser.classList.remove('active')});
    eraser.addEventListener('click',()=>{tool='eraser';eraser.classList.add('active');pen.classList.remove('active')});
    range.addEventListener('input',()=>{sizeValue.textContent=range.value+' px';localStorage.setItem(PREFIX+'penSize',range.value)});
    undo.addEventListener('click',()=>{if(!history.length||isLocked())return;restoreToken++;restoreImage(history.pop(),true,restoreToken)});
    clear.addEventListener('click',async()=>{
      if(isLocked())return;
      const ok=await askConfirm('Limpar resposta','Isso vai apagar o que foi escrito nesta questão. Deseja continuar?','Limpar','Cancelar');
      if(!ok)return;
      restoreToken++;clearPixels();localStorage.removeItem(key(q.id,storageSuffix));history=[];onChange();
    });

    const scheduleFit=()=>{if(drawing)return;cancelAnimationFrame(resizeRaf);resizeRaf=requestAnimationFrame(()=>fit(false))};
    requestAnimationFrame(()=>fit(false));
    let ro=null;
    if('ResizeObserver' in window){ro=new ResizeObserver(scheduleFit);ro.observe(wrap)}
    const onWindowResize=()=>scheduleFit();
    window.addEventListener('resize',onWindowResize);
    activeBoardCleanups.push(()=>{window.removeEventListener('resize',onWindowResize);if(ro)ro.disconnect();cancelAnimationFrame(resizeRaf)});
  };
})();

/* Versão 38: convite próprio de instalação PWA na primeira abertura. */
(() => {
  const PROMPT_KEY='lousa:pwa-install-prompt:v38';
  let deferredPrompt=null;
  let modal=null;
  let installButton=null;
  let statusEl=null;
  let fallbackMode=false;

  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ua=navigator.userAgent.toLowerCase();
  const isIOS=/iphone|ipad|ipod/.test(ua);
  const isAndroid=/android/.test(ua);
  const isMobileLike=isIOS||isAndroid||(/mobile/.test(ua))||(navigator.maxTouchPoints>1&&Math.min(screen.width,screen.height)<1200);

  function markSeen(){
    try{localStorage.setItem(PROMPT_KEY,'1')}catch(e){}
  }

  function wasSeen(){
    try{return localStorage.getItem(PROMPT_KEY)==='1'}catch(e){return false}
  }

  function setStatus(text){
    if(statusEl)statusEl.textContent=text||'';
  }

  function updateButton(){
    if(!installButton)return;
    if(deferredPrompt){
      fallbackMode=false;
      installButton.disabled=false;
      installButton.textContent='Instalar aplicativo';
      setStatus('Toque em Instalar aplicativo para adicionar a Lousa à tela inicial.');
    }else{
      fallbackMode=true;
      installButton.disabled=false;
      installButton.textContent='Como instalar';
      if(isIOS)setStatus('No iPhone ou iPad, a instalação é feita pelo menu Compartilhar do Safari.');
      else setStatus('Se o botão de instalação do navegador ainda não estiver disponível, veja as instruções.');
    }
  }

  function closeModal(remember=true){
    if(remember)markSeen();
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
  }

  function showInstructions(){
    if(isIOS){
      setStatus('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.');
    }else if(isAndroid){
      setStatus('No Chrome, abra o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.');
    }else{
      setStatus('Abra o menu do navegador e procure a opção Instalar aplicativo ou Adicionar à tela inicial.');
    }
    installButton.textContent='Entendi';
    fallbackMode='close';
  }

  async function installNow(){
    if(fallbackMode==='close'){closeModal(true);return}
    if(!deferredPrompt){showInstructions();return}
    const prompt=deferredPrompt;
    deferredPrompt=null;
    try{
      prompt.prompt();
      const choice=await prompt.userChoice;
      if(choice&&choice.outcome==='accepted'){
        markSeen();
        closeModal(false);
      }else{
        setStatus('A instalação foi cancelada. Você pode instalar depois pelo menu do navegador.');
        installButton.textContent='Fechar';
        fallbackMode='close';
      }
    }catch(e){
      showInstructions();
    }
  }

  function buildModal(){
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='v38InstallOverlay';
    modal.className='v38InstallOverlay';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=`<div class="v38InstallCard" role="dialog" aria-modal="true" aria-labelledby="v38InstallTitle"><button class="v38InstallClose" type="button" aria-label="Fechar">×</button><img class="v38InstallIcon" src="./icons/lousa-icon-v35.jpg?v=38" alt=""><div class="v38InstallText"><span class="v38InstallBadge">Lousa de Estudos</span><h3 id="v38InstallTitle">Instalar o aplicativo?</h3><p>Adicione a Lousa de Estudos à tela inicial para abrir mais rápido e usar como um aplicativo.</p><div class="v38InstallStatus" role="status"></div></div><div class="v38InstallActions"><button class="v38InstallPrimary" type="button">Preparando instalação...</button><button class="v38InstallLater" type="button">Agora não</button></div></div>`;
    document.body.appendChild(modal);
    installButton=modal.querySelector('.v38InstallPrimary');
    statusEl=modal.querySelector('.v38InstallStatus');
    installButton.disabled=true;
    installButton.addEventListener('click',installNow);
    modal.querySelector('.v38InstallLater').addEventListener('click',()=>closeModal(true));
    modal.querySelector('.v38InstallClose').addEventListener('click',()=>closeModal(true));
    return modal;
  }

  function showModal(){
    if(isStandalone()||!isMobileLike||wasSeen())return;
    buildModal();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    if(deferredPrompt)updateButton();
    else{
      setStatus('Preparando a opção de instalação do seu navegador...');
      setTimeout(()=>{if(modal&&modal.classList.contains('show')&&!deferredPrompt)updateButton()},1600);
    }
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    if(modal&&modal.classList.contains('show'))updateButton();
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    markSeen();
    closeModal(false);
  });

  window.addEventListener('load',()=>{
    if(isStandalone())return;
    setTimeout(showModal,650);
  },{once:true});
})();