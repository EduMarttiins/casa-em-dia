/* Lousa de Estudos v72 — múltipla escolha em todas as matérias, exceto Matemática */
(()=>{
  if(window.__lousaV72Mcq)return;
  window.__lousaV72Mcq=true;

  const EXCLUDED_SUBJECT='math';
  const changedIds=[];

  function cleanText(value){
    return String(value||'')
      .replace(/^(Resposta correta|Ideia esperada|Resultado esperado)\s*:\s*/i,'')
      .replace(/^A resposta é\s*/i,'')
      .trim();
  }

  function answerFrom(question){
    const expected=cleanText(question.expected);
    const generic=/^(um|uma|dois|duas|tr[eê]s)\s+(exemplo|exemplos|forma|formas|grupo|grupos|item|itens)\b/i;
    if(expected && !generic.test(expected) && !/resposta pessoal/i.test(expected))return expected;
    const explanation=cleanText(question.explanation);
    if(explanation)return explanation;
    return expected || 'A alternativa que corresponde ao conteúdo apresentado na lição.';
  }

  function shorten(text,max=210){
    const value=String(text||'').replace(/\s+/g,' ').trim();
    if(value.length<=max)return value;
    const cut=value.slice(0,max);
    const stop=Math.max(cut.lastIndexOf('. '),cut.lastIndexOf('; '),cut.lastIndexOf(', '));
    return (stop>90?cut.slice(0,stop+1):cut.trim()+'…');
  }

  function hash(value){
    let h=2166136261;
    for(const ch of String(value||'')){
      h^=ch.charCodeAt(0);
      h=Math.imul(h,16777619);
    }
    return h>>>0;
  }

  function fallbackDistractors(subjectKey,question){
    const text=String(question.text||'').toLowerCase();
    const bySubject={
      science:[
        'A alternativa descreve algo que não corresponde ao funcionamento estudado.',
        'Essa ideia não aparece no conteúdo e contradiz a explicação da lição.'
      ],
      portuguese:[
        'A alternativa ignora as pistas do texto e não responde ao que foi perguntado.',
        'Essa interpretação não é sustentada pelas informações apresentadas.'
      ],
      geography:[
        'A alternativa apresenta uma relação que não corresponde ao tema estudado.',
        'Essa afirmação contradiz as informações geográficas apresentadas na lição.'
      ],
      history:[
        'A alternativa não corresponde ao contexto histórico apresentado.',
        'Essa afirmação mistura informações que não fazem parte do conteúdo estudado.'
      ]
    };
    const base=bySubject[subjectKey]||[
      'A alternativa não corresponde ao conteúdo estudado.',
      'Essa afirmação contradiz a explicação apresentada na lição.'
    ];
    if(/cite|dê um exemplo|de um exemplo/.test(text)){
      return [
        'Um exemplo que não tem relação com o conteúdo apresentado.',
        'Nenhum dos exemplos estudados pode ser usado para responder.'
      ];
    }
    if(/diferença|compare|diferencie/.test(text)){
      return [
        'Os dois elementos são exatamente iguais e não possuem nenhuma diferença.',
        'Os elementos não podem ser comparados porque não aparecem na lição.'
      ];
    }
    if(/por que|explique/.test(text)){
      return [
        'Não existe relação entre os elementos citados na pergunta.',
        'O conteúdo mostra o contrário dessa explicação.'
      ];
    }
    return base;
  }

  function convertQuestion(subjectKey,question,index){
    if(!question || question.type==='mcq')return;
    const correct=shorten(answerFrom(question));
    const distractors=fallbackDistractors(subjectKey,question).map(item=>shorten(item));
    const seed=hash(question.id||subjectKey+':'+index);
    const rotation=seed%3;
    const values=[correct,distractors[0],distractors[1]];
    const options=[values[rotation],values[(rotation+1)%3],values[(rotation+2)%3]];
    question.type='mcq';
    question.options=options;
    question.correct=options.indexOf(correct);
    question.reviewLabel='🧠 Escolha a melhor resposta';
    question.review='Leia a pergunta com calma, compare as alternativas e escolha a que melhor corresponde ao conteúdo da lição.';
    changedIds.push(question.id||subjectKey+':'+index);
  }

  function convertQuestions(subjectKey,questions){
    if(!Array.isArray(questions))return;
    questions.forEach((question,index)=>convertQuestion(subjectKey,question,index));
  }

  function walkSubject(subjectKey,node,seen){
    if(!node || typeof node!=='object' || seen.has(node))return;
    seen.add(node);
    if(Array.isArray(node.questions))convertQuestions(subjectKey,node.questions);
    if(Array.isArray(node)){
      node.forEach(item=>walkSubject(subjectKey,item,seen));
      return;
    }
    Object.keys(node).forEach(key=>{
      if(key==='questions')return;
      walkSubject(subjectKey,node[key],seen);
    });
  }

  function updateSubjectCopy(subject){
    if(!subject)return;
    if(typeof subject.homeDescription==='string'){
      subject.homeDescription=subject.homeDescription
        .replace(/respostas? à mão/gi,'questões de múltipla escolha')
        .replace(/escrita à mão/gi,'múltipla escolha');
    }
    if(Array.isArray(subject.chips)){
      subject.chips=subject.chips.map(chip=>String(chip)
        .replace(/escrita à mão/gi,'Múltipla escolha')
        .replace(/respostas? à mão/gi,'Múltipla escolha'));
    }
  }

  function apply(){
    if(typeof subjects==='undefined' || !subjects)return false;
    Object.keys(subjects).forEach(subjectKey=>{
      if(subjectKey===EXCLUDED_SUBJECT)return;
      const subject=subjects[subjectKey];
      updateSubjectCopy(subject);
      walkSubject(subjectKey,subject,new WeakSet());
    });

    try{
      if(changedIds.length && !localStorage.getItem('lousaV72McqMigration')){
        const ids=new Set(changedIds.filter(Boolean).map(String));
        const remove=[];
        for(let i=0;i<localStorage.length;i++){
          const key=localStorage.key(i);
          if(!key)continue;
          for(const id of ids){
            if(key.includes(id)){remove.push(key);break;}
          }
        }
        remove.forEach(key=>localStorage.removeItem(key));
        localStorage.setItem('lousaV72McqMigration','1');
      }
    }catch(error){}

    window.__lousaV72ConvertedCount=changedIds.length;
    window.__lousaV72Ready=true;
    return true;
  }

  apply();
})();
