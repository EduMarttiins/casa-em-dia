/* Lousa de Estudos v73 — mantém múltipla escolha fora de Matemática mesmo com o hook legado da v55 */
(()=>{
  if(window.__lousaV73McqFix)return;
  window.__lousaV73McqFix=true;

  const SUBJECT_KEYS=['science','portuguese','geography','history'];

  function esc(v){
    return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function isTargetLesson(lesson){
    try{
      return SUBJECT_KEYS.some(key=>Array.isArray(subjects?.[key]?.lessons) && subjects[key].lessons.includes(lesson));
    }catch(e){return false;}
  }

  function adaptQuestionText(value){
    let t=String(value||'').trim();
    if(!t)return t;
    t=t.replace(/^Explique com suas palavras a relação entre\s+(.+?)\.?$/i,'Qual resposta explica corretamente a relação entre $1?');
    t=t.replace(/^Explique com suas palavras\s+(.+?)\.?$/i,'Qual resposta explica melhor $1?');
    t=t.replace(/^Explique por que\s+(.+?)\.?$/i,'Qual resposta explica corretamente por que $1?');
    t=t.replace(/^Explique como\s+(.+?)\.?$/i,'Qual resposta explica corretamente como $1?');
    t=t.replace(/^Explique\s+(.+?)\.?$/i,'Qual resposta explica corretamente $1?');
    t=t.replace(/^Cite\s+(.+?)\.?$/i,'Qual alternativa apresenta corretamente $1?');
    t=t.replace(/^Dê um exemplo de\s+(.+?)\.?$/i,'Qual alternativa apresenta um exemplo correto de $1?');
    t=t.replace(/^Dê uma ideia de\s+(.+?)\.?$/i,'Qual alternativa apresenta uma ideia adequada de $1?');
    t=t.replace(/^Resuma em uma frase\s+(.+?)\.?$/i,'Qual alternativa resume melhor $1?');
    t=t.replace(/^Escreva uma pergunta que você faria ao ler\s+(.+?)\.?$/i,'Qual pergunta abaixo seria adequada ao ler $1?');
    return t;
  }

  function lockMcq(question){
    if(!question || typeof question!=='object')return;
    question.text=adaptQuestionText(question.text);
    if(!Array.isArray(question.options) || question.options.length<2){
      const correct=String(question.explanation||question.expected||'A resposta que corresponde ao conteúdo estudado.').replace(/^(Resposta correta|Ideia esperada|Resultado esperado)\s*:\s*/i,'').trim();
      question.options=[correct,'Essa afirmação não corresponde ao conteúdo apresentado.','Essa opção contradiz as informações da lição.'];
      question.correct=0;
    }
    if(!Number.isInteger(question.correct) || question.correct<0 || question.correct>=question.options.length)question.correct=0;

    if(!question.__v73TypeLocked){
      let current='mcq';
      try{
        Object.defineProperty(question,'type',{
          configurable:true,
          enumerable:true,
          get(){return current;},
          set(next){
            if(String(next).toLowerCase()==='open')return;
            current=next;
          }
        });
        Object.defineProperty(question,'__v73TypeLocked',{value:true,writable:false,configurable:true,enumerable:false});
      }catch(e){
        question.type='mcq';
        question.__v73TypeLocked=true;
      }
    }
    question.type='mcq';
    question.reviewLabel='🧠 Escolha a melhor resposta';
  }

  function prepareLesson(lesson){
    if(!isTargetLesson(lesson))return;
    (lesson.questions||[]).forEach(lockMcq);
  }

  function applyAll(){
    try{
      SUBJECT_KEYS.forEach(key=>{
        const subject=subjects?.[key];
        (subject?.lessons||[]).forEach(lesson=>{
          prepareLesson(lesson);
          if(Array.isArray(lesson?.questions))lesson.questions.forEach(lockMcq);
        });
      });
    }catch(e){console.warn('v73 mcq apply',e);}
  }

  applyAll();

  if(typeof renderLesson==='function' && !renderLesson.__v73Wrapped){
    const previous=renderLesson;
    const wrapped=function(lesson){
      prepareLesson(lesson);
      return previous(lesson);
    };
    wrapped.__v73Wrapped=true;
    renderLesson=wrapped;
  }

  if(typeof buildPreQuestionReview==='function'){
    buildPreQuestionReview=function(q){
      const hint=String(q?.review||'').trim();
      return '<div class="reviewLabel">🧠 Escolha a melhor resposta</div>'+
        '<div class="reviewLead">Leia a pergunta com calma e compare todas as alternativas antes de marcar.</div>'+
        (hint?'<div class="reviewTip"><span class="reviewTipIcon">💡</span><div><strong>Dica</strong><span>'+esc(hint)+'</span></div></div>':'');
    };
  }

  window.__lousaV73Ready=true;
})();
