/* Lousa de Estudos, versão 50
   Matemática sem alternativas visíveis: o aluno calcula, digita o resultado e envia. */
(() => {
  const VERSION='50';
  let activeLesson=null;
  const passThroughButtons=new WeakSet();

  function ptNumber(raw){
    if(typeof raw==='number'&&Number.isFinite(raw))return raw;
    if(typeof raw!=='string')return null;
    let s=raw.trim().replace(/^R\$\s*/i,'').replace(/\s+/g,'');
    if(!s)return null;
    if(!/^-?[\d.,]+$/.test(s))return null;
    if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');
    else if(/^-?\d{1,3}(?:\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
    const n=Number(s);
    return Number.isFinite(n)?n:null;
  }

  function formatNumber(n){
    const rounded=Math.abs(n-Math.round(n))<1e-9?Math.round(n):Number(n.toFixed(2));
    return new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(rounded);
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
        case '+':return a+b;
        case '-':return a-b;
        case '×':case 'x':case 'X':case '*':return a*b;
        case '÷':case '/':case ':':return b===0?null:a/b;
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

  function expectedValue(q){
    if(q&&Array.isArray(q.options)&&q.correct!==undefined&&q.options[Number(q.correct)]!==undefined){
      const fromOption=ptNumber(String(q.options[Number(q.correct)]));
      if(fromOption!==null)return fromOption;
    }
    const fields=['answer','correctAnswer','expectedAnswer','result','expected','solution'];
    for(const field of fields){
      if(q&&q[field]!==undefined){
        const n=ptNumber(String(q[field]));
        if(n!==null)return n;
      }
    }
    return expressionResult(q&&q.text);
  }

  function isArithmetic(q){return !!(q&&q._v41Arithmetic&&expectedValue(q)!==null)}

  function installStyles(){
    if(document.getElementById('v50MathStyles'))return;
    const style=document.createElement('style');
    style.id='v50MathStyles';
    style.textContent=`
      .v50NumericMath .options{display:none!important}
      .v50NumericMath .qMeta{display:none!important}
      .v50NumericMath .statusSeal{display:none!important}
      .v50NumericMath .feedback{display:none!important}
      .v50NumericMath .v41MathSteps{display:none!important}
      .v50NumericMath .mcqLayout{display:grid!important;grid-template-columns:1fr!important;gap:12px!important}
      .v50AnswerBox{padding:14px;border:1px solid #d7e4da;border-radius:16px;background:#fbfdfb}
      .v50AnswerBox label{display:block;margin-bottom:7px;font-size:13px;font-weight:900;color:#33463b}
      .v50AnswerInput{width:100%;min-height:50px;padding:12px 14px;border:1px solid #cddbd2;border-radius:13px;background:#fff;color:#1f2937;font:800 20px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;outline:none}
      .v50AnswerInput:focus{border-color:#6fb58a;box-shadow:0 0 0 3px rgba(47,157,89,.12)}
      .v50AnswerHint{margin-top:7px;color:#64748b;font-size:12px;line-height:1.45}
      .v50Result{display:none;margin-top:12px;padding:13px 14px;border-radius:15px;align-items:center;justify-content:space-between;gap:12px;font-size:14px;line-height:1.4}
      .v50Result.show{display:flex}
      .v50Result.wrong{background:#fff1f1;border:1px solid #efc8c8;color:#a42f2f}
      .v50Result.correct{background:#edf9f1;border:1px solid #c6e8d0;color:#17683a}
      .v50ResultText strong{display:block;font-size:15px}.v50ResultText span{display:block;margin-top:3px;font-weight:800}
      .v50RetryBtn{flex:0 0 auto;border:0;border-radius:12px;padding:10px 13px;background:#334155;color:#fff;font-weight:900}
      .v50NumericMath.stateCorrect .v50Result{opacity:1!important;filter:none!important}
      @media(max-width:560px){.v50Result.show{align-items:stretch;flex-direction:column}.v50RetryBtn{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function lessonStorageKeys(lesson){
    const tokens=new Set();
    if(lesson&&lesson.key)tokens.add(String(lesson.key));
    (lesson&&lesson.questions||[]).forEach(q=>{if(q&&q.id)tokens.add(String(q.id))});
    const removals=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k&&[...tokens].some(t=>t&&k.includes(t)))removals.push(k);
      }
    }catch(e){}
    return removals;
  }

  function clearLessonProgress(lesson){
    try{lessonStorageKeys(lesson).forEach(k=>localStorage.removeItem(k))}catch(e){}
  }

  function restartLesson(){
    if(!activeLesson)return;
    clearLessonProgress(activeLesson);
    try{renderLesson(activeLesson);if(typeof updateProgress==='function')updateProgress()}catch(e){location.reload();return}
    requestAnimationFrame(()=>{
      const first=document.querySelector('#lessonContent .question');
      if(first&&first.classList.contains('v24QuestionCollapsed'))first.querySelector('.qTitle')?.click();
      first?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  function resultBox(card){
    let box=card.querySelector('.v50Result');
    if(box)return box;
    box=document.createElement('div');
    box.className='v50Result';
    const actions=card.querySelector('.actions');
    if(actions)actions.insertAdjacentElement('afterend',box);else card.appendChild(box);
    return box;
  }

  function showWrong(card){
    const box=resultBox(card);
    box.className='v50Result show wrong';
    box.innerHTML='<div class="v50ResultText"><strong>Resposta errada</strong><span>Tente novamente refazendo a lição.</span></div><button class="v50RetryBtn" type="button">Refazer</button>';
    box.querySelector('.v50RetryBtn').addEventListener('click',restartLesson,{once:true});
  }

  function showCorrect(card,value){
    const box=resultBox(card);
    box.className='v50Result show correct';
    box.innerHTML=`<div class="v50ResultText"><strong>✓ Resposta correta</strong><span>Resultado: ${formatNumber(value)}</span></div>`;
    const input=card.querySelector('.v50AnswerInput');
    if(input){input.value=formatNumber(value);input.disabled=true}
  }

  function decorateQuestion(card,q){
    if(!isArithmetic(q))return;
    card.classList.add('v50NumericMath');
    card.querySelectorAll('input[type="radio"]').forEach(r=>{r.checked=false});
    const oldSteps=card.querySelector('.v41MathSteps');
    if(oldSteps)oldSteps.innerHTML='<strong>1. Faça a conta na lousa.</strong><span>2. Digite o resultado abaixo e envie.</span>';
    const layout=card.querySelector('.mcqLayout')||card;
    if(!card.querySelector('.v50AnswerBox')){
      const answer=document.createElement('div');
      answer.className='v50AnswerBox';
      answer.innerHTML='<label>Digite o resultado da conta</label><input class="v50AnswerInput" type="text" inputmode="decimal" autocomplete="off" placeholder="Ex.: 1500"><div class="v50AnswerHint">Depois de fazer a conta na lousa, informe aqui o resultado encontrado.</div>';
      layout.appendChild(answer);
      const input=answer.querySelector('.v50AnswerInput');
      const submit=[...card.querySelectorAll('button')].find(b=>(b.textContent||'').toLowerCase().includes('enviar resposta'));
      const sync=()=>{if(submit&&!submit.textContent.toLowerCase().includes('resposta enviada'))submit.disabled=input.value.trim()===''};
      input.addEventListener('input',()=>{resultBox(card).className='v50Result';sync()});
      input.addEventListener('keydown',e=>{if(e.key==='Enter'&&submit&&!submit.disabled)submit.click()});
      sync();
    }
    const expected=expectedValue(q);
    if(card.classList.contains('stateCorrect')&&expected!==null)showCorrect(card,expected);
  }

  function decorateLesson(lesson){
    if(typeof currentSubjectKey==='undefined'||currentSubjectKey!=='math'||!lesson)return;
    const cards=[...document.querySelectorAll('#lessonContent .question')];
    cards.forEach((card,index)=>decorateQuestion(card,lesson.questions[index]));
  }

  function patchRender(){
    try{
      if(typeof renderLesson!=='function'||renderLesson._v50Wrapped)return;
      const previous=renderLesson;
      const wrapped=function(lesson){
        activeLesson=lesson;
        const out=previous(lesson);
        requestAnimationFrame(()=>decorateLesson(lesson));
        return out;
      };
      wrapped._v50Wrapped=true;
      renderLesson=wrapped;
    }catch(e){console.warn('v50: não foi possível integrar renderLesson',e)}
  }

  function handleSubmit(event){
    try{
      const btn=event.target.closest&&event.target.closest('button');
      if(!btn)return;
      if(passThroughButtons.has(btn)){passThroughButtons.delete(btn);return}
      if(typeof currentSubjectKey==='undefined'||currentSubjectKey!=='math'||!activeLesson)return;
      if(!(btn.textContent||'').toLowerCase().includes('enviar resposta'))return;
      const card=btn.closest('.question');
      if(!card||!card.classList.contains('v50NumericMath'))return;
      const cards=[...document.querySelectorAll('#lessonContent .question')];
      const index=cards.indexOf(card);
      const q=index>=0?activeLesson.questions[index]:null;
      if(!q||!isArithmetic(q))return;
      const input=card.querySelector('.v50AnswerInput');
      if(!input)return;
      const entered=ptNumber(input.value);
      const expected=expectedValue(q);

      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation)event.stopImmediatePropagation();

      if(entered===null){
        const box=resultBox(card);box.className='v50Result show wrong';box.innerHTML='<div class="v50ResultText"><strong>Digite um resultado</strong><span>Informe o valor encontrado antes de enviar.</span></div>';
        return;
      }
      if(expected===null)return;

      if(Math.abs(entered-expected)>0.005){
        showWrong(card);
        return;
      }

      const radios=[...card.querySelectorAll('input[type="radio"]')];
      const correctRadio=radios[Number(q.correct)];
      if(correctRadio){
        correctRadio.checked=true;
        correctRadio.dispatchEvent(new Event('change',{bubbles:true}));
      }
      passThroughButtons.add(btn);
      btn.disabled=false;
      btn.click();
      setTimeout(()=>showCorrect(card,expected),0);
    }catch(e){console.warn('v50: validação de resultado',e)}
  }

  installStyles();
  patchRender();
  document.addEventListener('click',handleSubmit,true);
  const meta=document.querySelector('meta[name="app-version"]');
  if(meta)meta.setAttribute('content',VERSION);
})();
