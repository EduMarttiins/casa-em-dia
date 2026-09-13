from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="22">','<meta name="app-version" content="23">',1)

css='''
/* Versão 23: linhas de rascunho, caligrafia e envio sem download */
.scratchBoard .answerCanvas{background-color:#fff;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(10% - 1px),#cbd9d1 calc(10% - 1px),#cbd9d1 10%)}
.calligraphyBoard .answerCanvas{background-color:#fffdf8;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 13px,rgba(101,151,201,.20) 13px,rgba(101,151,201,.20) 14px,transparent 14px,transparent 27px,rgba(73,126,180,.50) 27px,rgba(73,126,180,.50) 28px,transparent 28px,transparent 41px,rgba(101,151,201,.20) 41px,rgba(101,151,201,.20) 42px)}
.directSendNotice{margin-top:12px;padding:11px 13px;border-radius:14px;background:#f1f7ff;border:1px solid #d7e5f5;color:#3d5d78;font-size:12px;font-weight:800;line-height:1.5}.directSendNotice strong{color:#234763}
'''
if 'calligraphyBoard .answerCanvas' not in s:
    s=s.replace('</style>',css+'</style>',1)

old="const board=document.createElement('div');board.className='board';"
new="const board=document.createElement('div');board.className='board'+(currentSubjectKey==='portuguese'?' calligraphyBoard':'');"
if old in s:
    s=s.replace(old,new,1)

js=r'''
// Versão 23: sem nome no fechamento e sem salvar PDF no aparelho
try{localStorage.removeItem(V21_PROFILE_STUDENT)}catch(_e){}

v21Payload=function(lesson){
  const subject=subjects[currentSubjectKey]||{};
  let correctCount=0;
  const answers=lesson.questions.map((q,i)=>{
    if(q.type==='mcq'){
      const c=getChoice(q),n=c===null?null:Number(c),ok=String(c)===String(q.correct);
      if(ok)correctCount++;
      return{number:i+1,question:q.text,type:'mcq',answer:n===null?'':(q.options[n]||''),correct:ok};
    }
    return{number:i+1,question:q.text,type:'handwritten',handwriting:getCanvas(q)||''};
  });
  return{subjectKey:currentSubjectKey,subjectTitle:subject.title||currentSubjectKey,lessonKey:lesson.key,lessonTitle:lesson.title,totalQuestions:lesson.questions.length,completedCount:topicDoneCount(lesson),correctCount,completedAt:new Date().toLocaleString('pt-BR'),answers};
};

v21SubmissionCard=function(lesson){
  const w=document.createElement('section');
  w.className='lessonSubmitCard';
  w.innerHTML=`<div class="lessonSubmitHeader"><div class="lessonSubmitIcon">📤</div><div><h4>Finalizar e enviar esta lição</h4><p>Quando todas as questões estiverem concluídas, envie o relatório diretamente ao responsável.</p></div></div><div class="lessonSubmitProgress"></div><div class="directSendNotice">📧 <strong>Envio automático.</strong> Não é necessário informar nome ou email.</div><div class="lessonSubmitActions"><button class="lessonSubmitBtn" type="button">📨 Enviar todas as respostas</button><span class="lessonSubmitHint">O PDF será enviado apenas por email e não será salvo no aparelho.</span></div><div class="lessonSubmitResult" role="status"></div>`;
  const p=w.querySelector('.lessonSubmitProgress'),b=w.querySelector('.lessonSubmitBtn'),r=w.querySelector('.lessonSubmitResult');
  let busy=false;
  const msg=(t,k='info')=>{r.textContent=t;r.className='lessonSubmitResult show '+k};
  function refresh(){
    const done=topicDoneCount(lesson),total=lesson.questions.length,sent=v21LessonSent(lesson);
    p.className='lessonSubmitProgress'+(sent?' sent':done===total?' ready':'');
    p.textContent=sent?'✓ Lição finalizada e enviada. A próxima etapa está liberada.':done===total?'Tudo respondido. Agora é só enviar a lição.':`${done} de ${total} questões concluídas. Responda todas antes de enviar.`;
    b.disabled=busy||sent||done!==total;
    b.textContent=sent?'✓ Lição enviada':busy?'Enviando relatório...':'📨 Enviar todas as respostas';
  }
  b.addEventListener('click',async()=>{
    if(b.disabled||busy)return;
    busy=true;refresh();msg('Preparando o PDF e enviando ao responsável...','info');
    const payload=v21Payload(lesson);
    try{
      const res=await fetch(V21_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':V21_ANON,'Authorization':'Bearer '+V21_ANON},body:JSON.stringify(payload)}),data=await res.json().catch(()=>({}));
      if(res.ok&&data.emailSent){
        localStorage.setItem(v21LessonKey(lesson,'sent'),'1');
        localStorage.setItem(v21LessonKey(lesson,'sentAt'),new Date().toISOString());
        localStorage.setItem(v21LessonKey(lesson,'sentEmail'),'responsavel_cadastrado');
        msg('✓ Relatório enviado por email. A próxima lição foi liberada.','success');
        toast('Lição enviada com sucesso!');updateProgress();
      }else if(data.emailConfigured===false){
        msg('O Gmail do responsável ainda precisa ser configurado. A próxima lição continua bloqueada.','error');
      }else{
        msg(data.message||data.error||'Não foi possível enviar o relatório. Tente novamente.','error');
      }
    }catch(err){
      console.error(err);msg('Não foi possível enviar agora. Verifique a internet e tente novamente.','error');
    }finally{busy=false;refresh()}
  });
  const onChange=()=>refresh();
  window.addEventListener('lousaProgressChanged',onChange);
  activeBoardCleanups.push(()=>window.removeEventListener('lousaProgressChanged',onChange));
  refresh();
  return w;
};
'''

if 'Versão 23: sem nome no fechamento' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="23','calligraphyBoard','scratchBoard .answerCanvas','v21Payload=function(lesson)','PDF será enviado apenas por email']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 23 aplicada',len(s.encode()))
