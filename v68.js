/* Lousa de Estudos, versão 68: Português volta a respeitar questões abertas e de múltipla escolha */
(()=>{
  if(window.__lousaV68)return;
  window.__lousaV68=true;

  const clone=value=>{
    try{return JSON.parse(JSON.stringify(value))}catch(error){return value}
  };

  function restorePortugueseQuestions(){
    const snapshot=window.__lousaV68PortugueseSnapshot;
    let subject=null;
    try{subject=subjects&&subjects.portuguese}catch(error){}
    if(!Array.isArray(snapshot)||!subject||!Array.isArray(subject.lessons))return false;

    const originalById=new Map();
    snapshot.forEach(lesson=>(lesson.questions||[]).forEach(question=>originalById.set(question.id,question)));

    subject.lessons.forEach(lesson=>(lesson.questions||[]).forEach(question=>{
      const original=originalById.get(question.id);
      if(!original)return;
      question.type=original.type;
      question.text=original.text;
      if(Array.isArray(original.options))question.options=clone(original.options);
      else delete question.options;
      if(Object.prototype.hasOwnProperty.call(original,'correct'))question.correct=original.correct;
      else delete question.correct;
      ['reviewLabel','review','reviewVisual','explanation','visual','expected','everyday'].forEach(key=>{
        if(Object.prototype.hasOwnProperty.call(original,key))question[key]=clone(original[key]);
      });
    }));

    try{document.documentElement.dataset.portugueseQuestionFormat='mixed'}catch(error){}
    return true;
  }

  function addStyles(){
    if(document.getElementById('v68PortugueseStyles'))return;
    const style=document.createElement('style');
    style.id='v68PortugueseStyles';
    style.textContent=`
      .v68PortugueseMcq .option{position:relative;align-items:center}
      .v68PortugueseMcq .option::before{content:attr(data-letter);flex:0 0 31px;width:31px;height:31px;display:grid;place-items:center;border-radius:10px;background:#f2edff;border:1px solid #ddd2ff;color:#5f2bd1;font-weight:950;font-size:13px}
      .v68PortugueseMcq .option input{margin-left:0}
    `;
    document.head.appendChild(style);
  }

  function decorateMultipleChoice(){
    if(typeof buildQuestion!=='function'||window.__lousaV68BuildWrapped)return;
    window.__lousaV68BuildWrapped=true;
    const previousBuildQuestion=buildQuestion;
    buildQuestion=function(question,number){
      const card=previousBuildQuestion(question,number);
      try{
        if(currentSubjectKey==='portuguese'&&question&&question.type==='mcq'){
          card.classList.add('v68PortugueseMcq');
          card.querySelectorAll('.option').forEach((option,index)=>{
            option.dataset.letter=String.fromCharCode(65+index);
          });
        }
      }catch(error){}
      return card;
    };
  }

  function migrateOldWrittenAnswers(){
    const marker='lousaV68PortugueseMixedFormat';
    try{if(localStorage.getItem(marker)==='1')return}catch(error){}
    try{
      const snapshot=window.__lousaV68PortugueseSnapshot||[];
      const prefix='cienciasRev3:';
      snapshot.forEach(lesson=>(lesson.questions||[]).forEach(question=>{
        if(question.type!=='mcq')return;
        localStorage.removeItem(prefix+question.id+':canvas');
        localStorage.removeItem(prefix+question.id+':scratch');
      }));
      localStorage.setItem(marker,'1');
    }catch(error){}
  }

  function init(){
    addStyles();
    restorePortugueseQuestions();
    decorateMultipleChoice();
    migrateOldWrittenAnswers();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
