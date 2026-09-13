/* Lousa de Estudos, versão 35 */
(() => {
  const versionMeta=document.querySelector('meta[name="app-version"]');
  if(versionMeta) versionMeta.setAttribute('content','35');

  window.setupCanvas=function(board,q,onChange,isLocked,storageSuffix='canvas'){
    const canvas=board.querySelector('canvas');
    const wrap=board.querySelector('.canvasWrap');
    const ctx=canvas.getContext('2d');
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

    const savedSize=localStorage.getItem(PREFIX+'penSize')||'4';
    range.value=savedSize;
    sizeValue.textContent=savedSize+' px';

    canvas.style.touchAction='none';
    canvas.style.imageRendering='auto';

    function quality(){
      ctx.lineCap='round';
      ctx.lineJoin='round';
      ctx.miterLimit=2;
      ctx.imageSmoothingEnabled=true;
      if('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality='high';
    }

    function restoreImage(src,saveAfter=false){
      if(!src) return;
      const img=new Image();
      img.onload=()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        quality();
        const scale=Math.min(canvas.width/img.width,canvas.height/img.height);
        const drawWidth=Math.max(1,img.width*scale);
        const drawHeight=Math.max(1,img.height*scale);
        ctx.drawImage(img,0,0,drawWidth,drawHeight);
        if(saveAfter) save();
      };
      img.src=src;
    }

    function fit(){
      const r=wrap.getBoundingClientRect();
      if(!r.width||!r.height) return;
      const saved=getCanvas(q,storageSuffix);
      w=r.width;
      h=r.height;
      dpr=Math.min(3,Math.max(1,window.devicePixelRatio||1));
      canvas.width=Math.max(1,Math.round(w*dpr));
      canvas.height=Math.max(1,Math.round(h*dpr));
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      ctx.setTransform(1,0,0,1,0,0);
      quality();
      if(saved) restoreImage(saved,false);
    }

    function point(e){
      const r=canvas.getBoundingClientRect();
      return {
        x:(e.clientX-r.left)*(canvas.width/r.width),
        y:(e.clientY-r.top)*(canvas.height/r.height)
      };
    }

    function config(){
      ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';
      ctx.strokeStyle='#172033';
      ctx.fillStyle='#172033';
      const base=Math.max(1,Number(range.value))*dpr;
      ctx.lineWidth=tool==='eraser'?Math.max(18*dpr,base*2.2):base;
      quality();
    }

    function save(){
      try{
        localStorage.setItem(key(q.id,storageSuffix),canvas.toDataURL('image/png'));
        onChange();
      }catch(e){}
    }

    function snapshot(){
      try{
        history.push(canvas.toDataURL('image/png'));
        if(history.length>20) history.shift();
      }catch(e){}
    }

    function down(e){
      if(isLocked()) return;
      e.preventDefault();
      drawing=true;
      snapshot();
      try{canvas.setPointerCapture(e.pointerId)}catch(err){}
      config();
      const p=point(e);
      lastPoint=p;
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(1,ctx.lineWidth/2),0,Math.PI*2);
      ctx.fill();
    }

    function move(e){
      if(!drawing||isLocked()) return;
      e.preventDefault();
      config();
      const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];
      ctx.beginPath();
      if(lastPoint) ctx.moveTo(lastPoint.x,lastPoint.y);
      for(const ev of events){
        const p=point(ev);
        ctx.lineTo(p.x,p.y);
        lastPoint=p;
      }
      ctx.stroke();
    }

    function end(e){
      if(!drawing) return;
      drawing=false;
      lastPoint=null;
      ctx.closePath();
      ctx.globalCompositeOperation='source-over';
      try{if(e&&canvas.hasPointerCapture&&canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)}catch(err){}
      save();
    }

    canvas.addEventListener('pointerdown',down);
    canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',end);
    canvas.addEventListener('pointercancel',end);

    pen.addEventListener('click',()=>{
      tool='pen';
      pen.classList.add('active');
      eraser.classList.remove('active');
    });

    eraser.addEventListener('click',()=>{
      tool='eraser';
      eraser.classList.add('active');
      pen.classList.remove('active');
    });

    range.addEventListener('input',()=>{
      sizeValue.textContent=range.value+' px';
      localStorage.setItem(PREFIX+'penSize',range.value);
    });

    undo.addEventListener('click',()=>{
      if(!history.length||isLocked()) return;
      restoreImage(history.pop(),true);
    });

    clear.addEventListener('click',async()=>{
      if(isLocked()) return;
      const ok=await askConfirm('Limpar resposta','Isso vai apagar o que foi escrito nesta questão. Deseja continuar?','Limpar','Cancelar');
      if(!ok) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      localStorage.removeItem(key(q.id,storageSuffix));
      history=[];
      onChange();
    });

    requestAnimationFrame(fit);
    let timer;
    const resize=()=>{
      clearTimeout(timer);
      timer=setTimeout(fit,160);
    };
    window.addEventListener('resize',resize);
    activeBoardCleanups.push(()=>window.removeEventListener('resize',resize));
  };
})();
