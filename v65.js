/* Lousa de Estudos, versão 65 */
(()=>{
  if(window.__lousaV65)return;
  window.__lousaV65=true;

  function removePassageVisuals(){
    document.querySelectorAll('.readingVisual').forEach(el=>el.remove());
  }

  function clearPassageVisualData(){
    try{
      Object.values(subjects||{}).forEach(subject=>{
        (subject.lessons||[]).forEach(lesson=>{
          if(Object.prototype.hasOwnProperty.call(lesson,'passageVisual')) lesson.passageVisual='';
        });
      });
    }catch(error){}
  }

  function unlockAllLessons(){
    try{
      isLessonUnlocked=function(){return true};
    }catch(error){}
  }

  function patchSubmissionCopy(){
    document.querySelectorAll('.lessonSubmitHeader p').forEach(el=>{
      el.textContent='Quando terminar, você pode enviar esta lição ao responsável. As demais lições já estão liberadas.';
    });
    document.querySelectorAll('.lessonSubmitProgress').forEach(el=>{
      el.textContent=el.textContent
        .replace('A próxima etapa está liberada.','Lição concluída e enviada.')
        .replace('A próxima lição foi liberada.','Lição concluída e enviada.');
    });
  }

  clearPassageVisualData();
  unlockAllLessons();

  if(typeof renderLesson==='function'){
    const previousRenderLesson=renderLesson;
    renderLesson=function(lesson){
      previousRenderLesson(lesson);
      removePassageVisuals();
      patchSubmissionCopy();
    };
  }

  if(typeof renderTopicCards==='function'){
    const previousRenderTopicCards=renderTopicCards;
    renderTopicCards=function(){
      unlockAllLessons();
      previousRenderTopicCards();
    };
  }

  function refreshVisibleScreen(){
    removePassageVisuals();
    patchSubmissionCopy();
    try{
      const home=document.getElementById('homeView');
      if(typeof currentSubjectKey!=='undefined'&&currentSubjectKey&&home&&home.style.display!=='none'&&typeof renderTopicCards==='function')renderTopicCards();
    }catch(error){}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshVisibleScreen,{once:true});
  else refreshVisibleScreen();
})();
