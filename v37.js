/* Lousa de Estudos, versão 37 */
(() => {
  const versionMeta=document.querySelector('meta[name="app-version"]');
  if(versionMeta) versionMeta.setAttribute('content','37');

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
    let pathPoint=null;
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
      ctx.shadowBlur=0;
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
      quality();
    }

    function restoreImage(src,saveAfter=false,token=restoreToken){
      if(!src) return;
      const img=new Image();
      img.onload=()=>{
        if(token!==restoreToken||drawing) return;
        resetTransform();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        quality();
        if(img.width===canvas.width&&img.height===canvas.height){
          ctx.drawImage(img,0,0);
        }else{
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
        }
        cssTransform();
        quality();
        if(saveAfter) save();
      };
      img.src=src;
    }

    function fit(force=false){
      const r=wrap.getBoundingClientRect();
      if(r.width<2||r.height<2) return false;

      const nextW=Math.max(1,r.width);
      const nextH=Math.max(1,r.height);
      const nextDpr=Math.min(4,Math.max(1,window.devicePixelRatio||1));
      const targetWidth=Math.max(1,Math.round(nextW*nextDpr));
      const targetHeight=Math.max(1,Math.round(nextH*nextDpr));
      const unchanged=!force&&w>0&&h>0&&canvas.width===targetWidth&&canvas.height===targetHeight;

      w=nextW;
      h=nextH;
      dpr=nextDpr;
      if(unchanged){
        cssTransform();
        quality();
        return true;
      }

      const saved=getCanvas(q,storageSuffix);
      restoreToken++;
      canvas.width=targetWidth;
      canvas.height=targetHeight;
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      cssTransform();
      quality();
      if(saved) restoreImage(saved,false,restoreToken);
      return true;
    }

    function ensureReady(){
      const r=wrap.getBoundingClientRect();
      if(r.width<2||r.height<2) return false;
      const expectedDpr=Math.min(4,Math.max(1,window.devicePixelRatio||1));
      const expectedW=Math.max(1,Math.round(r.width*expectedDpr));
      const expectedH=Math.max(1,Math.round(r.height*expectedDpr));
      if(w<2||h<2||canvas.width!==expectedW||canvas.height!==expectedH) fit(true);
      return w>=2&&h>=2;
    }

    function point(e){
      const r=canvas.getBoundingClientRect();
      const logicalW=w||r.width||1;
      const logicalH=h||r.height||1;
      return {
        x:(e.clientX-r.left)*(logicalW/Math.max(1,r.width)),
        y:(e.clientY-r.top)*(logicalH/Math.max(1,r.height))
      };
    }

    function currentWidth(){
      const shown=Math.max(1,Number(range.value)||1);
      if(tool==='eraser') return Math.max(14,shown*2.4);
      if(shown===1) return 1;
      if(shown===2) return 1.4;
      if(shown===3) return 1.9;
      return Math.max(2.2,shown*0.72);
    }

    function config(){
      cssTransform();
      ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';
      ctx.strokeStyle='#111827';
      ctx.fillStyle='#111827';
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
      ctx.arc(p.x,p.y,Math.max(0.5,ctx.lineWidth/2),0,Math.PI*2);
      ctx.fill();
    }

    function down(e){
      if(isLocked()) return;
      e.preventDefault();
      if(!ensureReady()) return;
      restoreToken++;
      drawing=true;
      snapshot();
      try{canvas.setPointerCapture(e.pointerId)}catch(err){}
      const p=point(e);
      lastPoint=p;
      pathPoint=p;
      drawDot(p);
    }

    function move(e){
      if(!drawing||isLocked()) return;
      e.preventDefault();
      const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];
      if(!events.length) return;
      config();
      ctx.beginPath();
      ctx.moveTo(pathPoint.x,pathPoint.y);
      let drew=false;
      for(const ev of events){
        const p=point(ev);
        if(!lastPoint){lastPoint=p;pathPoint=p;continue;}
        const dx=p.x-lastPoint.x;
        const dy=p.y-lastPoint.y;
        if((dx*dx+dy*dy)<0.0064) continue;
        const mid={x:(lastPoint.x+p.x)/2,y:(lastPoint.y+p.y)/2};
        ctx.quadraticCurveTo(lastPoint.x,lastPoint.y,mid.x,mid.y);
        pathPoint=mid;
        lastPoint=p;
        drew=true;
      }
      if(drew) ctx.stroke();
    }

    function finishStroke(){
      if(lastPoint&&pathPoint){
        config();
        ctx.beginPath();
        ctx.moveTo(pathPoint.x,pathPoint.y);
        ctx.quadraticCurveTo(lastPoint.x,lastPoint.y,lastPoint.x,lastPoint.y);
        ctx.stroke();
      }
    }

    function end(e){
      if(!drawing) return;
      finishStroke();
      drawing=false;
      lastPoint=null;
      pathPoint=null;
      ctx.globalCompositeOperation='source-over';
      try{if(e&&canvas.hasPointerCapture&&canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId)}catch(err){}
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
      restoreToken++;
      restoreImage(history.pop(),true,restoreToken);
    });

    clear.addEventListener('click',async()=>{
      if(isLocked()) return;
      const ok=await askConfirm('Limpar resposta','Isso vai apagar o que foi escrito nesta questão. Deseja continuar?','Limpar','Cancelar');
      if(!ok) return;
      restoreToken++;
      clearPixels();
      localStorage.removeItem(key(q.id,storageSuffix));
      history=[];
      onChange();
    });

    const scheduleFit=()=>{
      if(drawing) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf=requestAnimationFrame(()=>fit(false));
    };

    requestAnimationFrame(()=>fit(false));

    let ro=null;
    if('ResizeObserver' in window){
      ro=new ResizeObserver(scheduleFit);
      ro.observe(wrap);
    }

    const onWindowResize=()=>scheduleFit();
    window.addEventListener('resize',onWindowResize);

    activeBoardCleanups.push(()=>{
      window.removeEventListener('resize',onWindowResize);
      if(ro)ro.disconnect();
      cancelAnimationFrame(resizeRaf);
    });
  };
})();