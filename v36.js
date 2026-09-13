/* Lousa de Estudos, versão 36 */
(() => {
  const versionMeta=document.querySelector('meta[name="app-version"]');
  if(versionMeta) versionMeta.setAttribute('content','36');

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

    const savedSize=localStorage.getItem(PREFIX+'penSize')||'2';
    range.value=savedSize;
    range.min='1';
    range.max=range.max||'12';
    range.step='1';
    sizeValue.textContent=savedSize+' px';

    canvas.style.touchAction='none';
    canvas.style.imageRendering='auto';

    function quality(){
      ctx.lineCap='round';
      ctx.lineJoin='round';
      ctx.miterLimit=1;
      ctx.imageSmoothingEnabled=true;
      if('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality='high';
    }

    function resetTransform(){
      ctx.setTransform(1,0,0,1,0,0);
    }

    function cssTransform(){
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function clearPixels(){
      resetTransform();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      cssTransform();
    }

    function restoreImage(src,saveAfter=false){
      if(!src) return;
      const img=new Image();
      img.onload=()=>{
        clearPixels();
        quality();
        ctx.save();
        cssTransform();
        ctx.drawImage(img,0,0,w,h);
        ctx.restore();
        cssTransform();
        if(saveAfter) save();
      };
      img.src=src;
    }

    function fit(){
      const r=wrap.getBoundingClientRect();
      if(!r.width||!r.height) return;
      const saved=getCanvas(q,storageSuffix);
      w=Math.max(1,r.width);
      h=Math.max(1,r.height);
      dpr=Math.min(4,Math.max(1,window.devicePixelRatio||1));
      canvas.width=Math.max(1,Math.round(w*dpr));
      canvas.height=Math.max(1,Math.round(h*dpr));
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      cssTransform();
      quality();
      if(saved) restoreImage(saved,false);
    }

    function point(e){
      const r=canvas.getBoundingClientRect();
      return {
        x:(e.clientX-r.left)*(w/r.width),
        y:(e.clientY-r.top)*(h/r.height)
      };
    }

    function currentWidth(){
      const shown=Math.max(1,Number(range.value)||1);
      if(tool==='eraser') return Math.max(14,shown*2.4);
      if(shown===1) return 0.62;
      if(shown===2) return 1.25;
      return shown*0.82;
    }

    function config(){
      cssTransform();
      ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';
      ctx.strokeStyle='#172033';
      ctx.fillStyle='#172033';
      ctx.lineWidth=currentWidth();
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

    function drawDot(p){
      config();
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(0.28,ctx.lineWidth/2),0,Math.PI*2);
      ctx.fill();
    }

    function drawSmoothSegment(a,b,c){
      if(!a||!b) return;
      config();
      ctx.beginPath();
      if(c){
        const startX=(a.x+b.x)/2;
        const startY=(a.y+b.y)/2;
        const endX=(b.x+c.x)/2;
        const endY=(b.y+c.y)/2;
        ctx.moveTo(startX,startY);
        ctx.quadraticCurveTo(b.x,b.y,endX,endY);
      }else{
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
      }
      ctx.stroke();
    }

    function down(e){
      if(isLocked()) return;
      e.preventDefault();
      drawing=true;
      snapshot();
      try{canvas.setPointerCapture(e.pointerId)}catch(err){}
      const p=point(e);
      previousPoint=null;
      lastPoint=p;
      drawDot(p);
    }

    function move(e){
      if(!drawing||isLocked()) return;
      e.preventDefault();
      const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];
      for(const ev of events){
        const p=point(ev);
        if(!lastPoint){lastPoint=p;continue;}
        const dx=p.x-lastPoint.x;
        const dy=p.y-lastPoint.y;
        if((dx*dx+dy*dy)<0.04) continue;
        if(previousPoint){
          drawSmoothSegment(previousPoint,lastPoint,p);
        }else{
          drawSmoothSegment(lastPoint,p,null);
        }
        previousPoint=lastPoint;
        lastPoint=p;
      }
    }

    function end(e){
      if(!drawing) return;
      drawing=false;
      if(previousPoint&&lastPoint) drawSmoothSegment(previousPoint,lastPoint,null);
      previousPoint=null;
      lastPoint=null;
      ctx.globalCompositeOperation='source-over';
      try{if(e&&canvas.hasPointerCapture&&canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)}catch(err){}
      save();
    }

    canvas.addEventListener('pointerdown',down,{passive:false});
    canvas.addEventListener('pointermove',move,{passive:false});
    canvas.addEventListener('pointerup',end,{passive:false});
    canvas.addEventListener('pointercancel',end,{passive:false});
    canvas.addEventListener('pointerleave',e=>{if(drawing&&e.buttons===0)end(e)});

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
      clearPixels();
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
