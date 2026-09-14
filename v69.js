/* Lousa de Estudos, versão 69: preserva o formato original das questões de Português */
(()=>{
  if(window.__lousaV69)return;
  window.__lousaV69=true;
  window.__lousaCurrentContentVersion=69;

  const clone=value=>{
    try{return JSON.parse(JSON.stringify(value))}catch(error){return value}
  };

  function originalQuestionMap(){
    const map=new Map();
    const snapshot=window.__lousaV68PortugueseSnapshot||[];
    snapshot.forEach(lesson=>(lesson.questions||[]).forEach(question=>map.set(question.id,question)));
    return map;
  }

  const originalById=originalQuestionMap();

  function restoreQuestion(question){
    const original=originalById.get(question&&question.id);
    if(!original)return;
    question.type=original.type;
    question.text=original.text;
    if(Array.isArray(original.options))question.options=clone(original.options);
    else delete question.options;
    if(Object.prototype.hasOwnProperty.call(original,'correct'))question.correct=original.correct;
    else delete question.correct;
    ['reviewLabel','review','reviewVisual','explanation','visual','expected','everyday'].forEach(key=>{
      if(Object.prototype.hasOwnProperty.call(original,key))question[key]=clone(original[key]);
      else delete question[key];
    });
  }

  function restorePortuguese(){
    try{
      const subject=subjects&&subjects.portuguese;
      if(!subject||!Array.isArray(subject.lessons))return;
      subject.lessons.forEach(lesson=>(lesson.questions||[]).forEach(restoreQuestion));
    }catch(error){}
  }

  function protectLessonDuringRender(lesson){
    const releases=[];
    (lesson&&lesson.questions||[]).forEach(question=>{
      const original=originalById.get(question.id);
      if(!original)return;
      restoreQuestion(question);
      const fixedType=original.type;
      const fixedText=original.text;
      try{
        Object.defineProperty(question,'type',{
          configurable:true,
          enumerable:true,
          get(){return fixedType},
          set(){}
        });
        Object.defineProperty(question,'text',{
          configurable:true,
          enumerable:true,
          get(){return fixedText},
          set(){}
        });
        releases.push(()=>{
          try{delete question.type;delete question.text}catch(error){}
          restoreQuestion(question);
        });
      }catch(error){}
    });
    return ()=>releases.forEach(release=>release());
  }

  function protectPortugueseRenderer(){
    if(typeof renderLesson!=='function'||window.__lousaV69RenderProtected)return;
    window.__lousaV69RenderProtected=true;
    const previousRenderLesson=renderLesson;
    renderLesson=function(lesson){
      if(typeof currentSubjectKey==='undefined'||currentSubjectKey!=='portuguese')return previousRenderLesson(lesson);
      restorePortuguese();
      const release=protectLessonDuringRender(lesson);
      try{return previousRenderLesson(lesson)}
      finally{release();restorePortuguese()}
    };
  }

  function reinforceVersion(){
    try{
      const meta=document.querySelector('meta[name="app-version"]');
      if(meta)meta.setAttribute('content','69');
      document.documentElement.dataset.contentVersion='69';
      document.querySelectorAll('.lousaVersionOnly').forEach(el=>{el.textContent='v69'});
    }catch(error){}
  }

  function init(){
    restorePortuguese();
    protectPortugueseRenderer();
    reinforceVersion();
    [500,1200,3200,4600].forEach(delay=>setTimeout(reinforceVersion,delay));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
