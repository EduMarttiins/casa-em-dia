/* Lousa de Estudos, versão 41
   Regras de Matemática separadas da caneta. A caneta continua integralmente em v37.js. */
(() => {
  const VERSION='41';
  let activeLesson=null;

  function ptNumber(raw){
    if(typeof raw==='number'&&Number.isFinite(raw))return raw;
    if(typeof raw!=='string')return null;
    let s=raw.trim().replace(/^R\$\s*/i,'').replace(/\s+/g,'');
    if(!s)return null;
    if(!/^-?[\d.,]+$/.test(s))return null;
    if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');
    else if(/^\-?\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
    const n=Number(s);
    return Number.isFinite(n)?n:null;
  }

  function exactNumericField(q){
    const fields=['answer','correctAnswer','expectedAnswer','result','expected','solution'];
    for(const field of fields){
      const value=q&&q[field];
      if(typeof value==='number'&&Number.isFinite(value))return value;
      if(typeof value==='string'){
        const clean=value.trim();
        if(/^(?:R\$\s*)?-?[\d.]+(?:,\d+)?$/.test(clean)||/^-?\d+(?:\.\d+)?$/.test(clean)){
          const n=ptNumber(clean);
          if(n!==null)return n;
        }
      }
    }
    return null;
  }

  function expressionResult(text){
    const raw=String(text||'').replace(/−|–|—/g,'-');
    const percent=raw.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:de|do|da)\s*(\d+(?:[.,]\d+)?)/i);
    if(percent){
      const a=ptNumber(percent[1]),b=ptNumber(percent[2]);
      if(a!==null&&b!==null)return b*a/100;
    }

    const expr=raw.match(/(?:R\$\s*)?(\d[\d. ]*(?:,\d+)?)\s*([+\-×xX*÷/:])\s*(?:R\$\s*)?(\d[\d. ]*(?:,\d+)?)/);
    if(expr){
      const a=ptNumber(expr[1]),b=ptNumber(expr[3]);
      if(a===null||b===null)return null;
      switch(expr[2]){
        case '+': return a+b;
        case '-': return a-b;
        case '×': case 'x': case 'X': case '*': return a*b;
        case '÷': case '/': case ':': return b===0?null:a/b;
      }
    }

    const lower=raw.toLowerCase();
    const nums=[...raw.matchAll(/(?:R\$\s*)?(\d+(?:\.\d{3})*(?:,\d+)?|\d+(?:[.,]\d+)?)/g)].map(m=>ptNumber(m[1])).filter(n=>n!==null);
    if(nums.length>=2){
      if(/\b(gasta|gastou|retira|retirou|perde|perdeu|resta|sobra|sobrou|diferença|troco)\b/.test(lower))return nums[0]-nums[1];
      if(/\b(ao todo|total|junta|juntou|ganha|ganhou|recebe|recebeu|somam|soma)\b/.test(lower))return nums[0]+nums[1];
    }
    return null;
  }

  function numericResult(q){
    return exactNumericField(q)??expressionResult(q&&q.text);
  }

  function isArithmeticQuestion(q){
    if(!q)return false;
    return numericResult(q)!==null;
  }

  function hash(text){
    let h=0;
    for(const ch of String(text||''))h=(h*31+ch.charCodeAt(0))>>>0;
    return h;
  }

  function formatNumber(n){
    const rounded=Math.abs(n-Math.round(n))<1e-9?Math.round(n):Number(n.toFixed(2));
    return new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(rounded);
  }

  function makeOptions(answer,q){
    const integer=Math.abs(answer-Math.round(answer))<1e-9;
    let wrong;
    if(integer){
      const mag=Math.max(1,Math.pow(10,Math.max(0,String(Math.abs(Math.trunc(answer))).length-2)));
      wrong=[answer+mag,answer-mag,answer+mag*10,answer+Math.max(1,Math.round(mag/2))];
    }else{
      wrong=[answer+0.5,answer-0.5,answer+1,answer-1];
    }
    const values=[answer,...wrong].filter((v,i,a)=>Number.isFinite(v)&&v>=0&&a.findIndex(x=>Math.abs(x-v)<1e-9)===i).slice(0,4);
    while(values.length<4)values.push(answer+values.length+1);
    const answerIndex=hash(q&&q.id)%4;
    const ordered=[];
    let wi=1;
    for(let i=0;i<4;i++)ordered.push(i===answerIndex?values[0]:values[wi++]);
    return {options:ordered.map(formatNumber),correct:answerIndex};
  }

  function prepareQuestion(q){
    if(!q)return;
    const result=numericResult(q);
    if(result===null)return;
    q._v41Arithmetic=true;
    if(q.type!=='mcq'){
      const made=makeOptions(result,q);
      q._v41OriginalType=q.type;
      q.type='mcq';
      q.options=made.options;
      q.correct=made.correct;
      q._v41GeneratedOptions=true;
    }
  }

  function prepareLesson(lesson){
    if(!lesson||!Array.isArray(lesson.questions))return;
    lesson.questions.forEach(prepareQuestion);
  }

  function prepareAllMath(){
    try{
      if(typeof subjects==='undefined'||!subjects.math||!Array.isArray(subjects.math.lessons))return;
      subjects.math.lessons.forEach(prepareLesson);
    }catch(e){console.warn('v41: não foi possível preparar Matemática',e)}
  }

  function addMathOrderHints(lesson){
    if(typeof currentSubjectKey==='undefined'||currentSubjectKey!=='math'||!lesson)return;
    const cards=[...document.querySelectorAll('#lessonContent .question')];
    cards.forEach((card,index)=>{
      const q=lesson.questions[index];
      if(!q||!q._v41Arithmetic)return;
      card.classList.add('v41ArithmeticQuestion');
      const layout=card.querySelector('.mcqLayout');
      const scratch=card.querySelector('.scratchCard');
      const options=card.querySelector('.options');
      if(layout&&scratch&&options&&scratch.nextElementSibling!==options){
        layout.insertBefore(scratch,options);
      }
      if(layout&&!card.querySelector('.v41MathSteps')){
        const note=document.createElement('div');
        note.className='v41MathSteps';
        note.innerHTML='<strong>1. Faça a conta na lousa.</strong><span>2. Depois escolha a alternativa com o resultado e envie a resposta.</span>';
        layout.parentNode.insertBefore(note,layout);
      }
    });
  }

  function installStyles(){
    if(document.getElementById('v41MathStyles'))return;
    const style=document.createElement('style');
    style.id='v41MathStyles';
    style.textContent=`
      .v41ArithmeticQuestion .mcqLayout{grid-template-columns:1fr!important}
      .v41ArithmeticQuestion .scratchCard{order:1}
      .v41ArithmeticQuestion .options{order:2}
      .v41MathSteps{display:flex;flex-wrap:wrap;gap:8px 14px;margin:12px 0;padding:11px 13px;border:1px solid #dbeafe;border-radius:14px;background:#f5f9ff;color:#334155;font-size:12px;line-height:1.45}
      .v41MathSteps strong{color:#1d4ed8}
      .v41RetryOverlay{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:20px;background:rgba(15,23,42,.48);backdrop-filter:blur(4px)}
      .v41RetryCard{width:min(100%,430px);background:#fff;border-radius:24px;padding:24px;box-shadow:0 28px 80px rgba(15,23,42,.28);text-align:center}
      .v41RetryIcon{font-size:42px;margin-bottom:8px}.v41RetryCard h3{margin:0 0 8px;font-size:22px}.v41RetryCard p{margin:0;color:#64748b;line-height:1.55}
      .v41RetryBtn{margin-top:18px;width:100%;min-height:48px;border:0;border-radius:14px;background:#2563eb;color:#fff;font-weight:900;font-size:14px}
    `;
    document.head.appendChild(style);
  }

  function lessonStorageKeys(lesson){
    const tokens=new Set();
    if(lesson&&lesson.key)tokens.add(String(lesson.key));
    (lesson&&lesson.questions||[]).forEach(q=>{if(q&&q.id)tokens.add(String(q.id))});
    const removals=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k)continue;
      if([...tokens].some(t=>t&&k.includes(t)))removals.push(k);
    }
    return removals;
  }

  function clearLessonProgress(lesson){
    try{lessonStorageKeys(lesson).forEach(k=>localStorage.removeItem(k))}catch(e){}
  }

  function showRetry(lesson){
    document.querySelector('.v41RetryOverlay')?.remove();
    const overlay=document.createElement('div');
    overlay.className='v41RetryOverlay';
    overlay.innerHTML='<div class="v41RetryCard" role="dialog" aria-modal="true"><div class="v41RetryIcon">🔄</div><h3>Vamos refazer esta lição</h3><p>A alternativa escolhida não está correta. O progresso desta lição foi reiniciado para você tentar novamente desde a primeira questão.</p><button class="v41RetryBtn" type="button">Refazer lição</button></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.v41RetryBtn').addEventListener('click',()=>{
      overlay.remove();
      try{renderLesson(lesson);updateProgress()}catch(e){location.reload()}
      requestAnimationFrame(()=>document.querySelector('.topicHeader')?.scrollIntoView({behavior:'smooth',block:'start'}));
    },{once:true});
  }

  function wrongMathSubmitCapture(event){
    try{
      if(typeof currentSubjectKey==='undefined'||currentSubjectKey!=='math'||!activeLesson)return;
      const btn=event.target.closest&&event.target.closest('button');
      if(!btn)return;
      const text=(btn.textContent||'').trim().toLowerCase();
      if(!text.includes('enviar resposta'))return;
      const card=btn.closest('.question');
      if(!card)return;
      const cards=[...document.querySelectorAll('#lessonContent .question')];
      const index=cards.indexOf(card);
      if(index<0)return;
      const q=activeLesson.questions[index];
      if(!q||!q._v41Arithmetic||q.type!=='mcq')return;
      const radios=[...card.querySelectorAll('input[type="radio"]')];
      const selected=radios.findIndex(r=>r.checked);
      if(selected<0)return;
      if(selected===Number(q.correct))return;

      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation)event.stopImmediatePropagation();
      clearLessonProgress(activeLesson);
      showRetry(activeLesson);
    }catch(e){console.warn('v41: validação de Matemática',e)}
  }

  function patchRender(){
    try{
      if(typeof renderLesson!=='function'||renderLesson._v41Wrapped)return;
      const previous=renderLesson;
      const wrapped=function(lesson){
        activeLesson=lesson;
        if(typeof currentSubjectKey!=='undefined'&&currentSubjectKey==='math')prepareLesson(lesson);
        const result=previous(lesson);
        requestAnimationFrame(()=>addMathOrderHints(lesson));
        return result;
      };
      wrapped._v41Wrapped=true;
      renderLesson=wrapped;
    }catch(e){console.warn('v41: não foi possível integrar renderLesson',e)}
  }

  installStyles();
  prepareAllMath();
  patchRender();
  document.addEventListener('click',wrongMathSubmitCapture,true);

  const meta=document.querySelector('meta[name="app-version"]');
  if(meta)meta.setAttribute('content',VERSION);
})();
