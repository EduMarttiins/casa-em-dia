from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="21">','<meta name="app-version" content="22">',1)

css='''
/* Versão 22: destinatário fixo do responsável */
.lessonProfile.fixedRecipient{grid-template-columns:1fr}.fixedRecipientNotice{margin-top:12px;padding:11px 13px;border-radius:14px;background:#f1f7ff;border:1px solid #d7e5f5;color:#3d5d78;font-size:12px;font-weight:800;line-height:1.5}.fixedRecipientNotice strong{color:#234763}
'''
if 'fixedRecipientNotice{' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 22: o destinatário é fixo no backend e não aparece para a criança
try{localStorage.removeItem(V21_PROFILE_EMAIL)}catch(_e){}

v21Payload=function(lesson,name){
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
  return{subjectKey:currentSubjectKey,subjectTitle:subject.title||currentSubjectKey,lessonKey:lesson.key,lessonTitle:lesson.title,studentName:name,totalQuestions:lesson.questions.length,completedCount:topicDoneCount(lesson),correctCount,completedAt:new Date().toLocaleString('pt-BR'),answers};
};

v21SubmissionCard=function(lesson){
  const w=document.createElement('section');
  w.className='lessonSubmitCard';
  w.innerHTML=`<div class="lessonSubmitHeader"><div class="lessonSubmitIcon">📤</div><div><h4>Finalizar e enviar esta lição</h4><p>Para liberar a próxima lição, todas as questões precisam estar concluídas e o PDF precisa ser enviado automaticamente ao responsável cadastrado.</p></div></div><div class="lessonSubmitProgress"></div><div class="lessonProfile fixedRecipient"><div class="lessonField"><label>Nome do aluno</label><input class="studentNameInput" type="text" autocomplete="name" placeholder="Digite o nome"></div></div><div class="fixedRecipientNotice">📧 <strong>Destino já cadastrado.</strong> A criança não precisa digitar nenhum email.</div><div class="lessonSubmitActions"><button class="lessonSubmitBtn" type="button">📨 Enviar todas as respostas</button><span class="lessonSubmitHint">O PDF também será salvo automaticamente no aparelho.</span></div><div class="lessonSubmitResult" role="status"></div>`;
  const p=w.querySelector('.lessonSubmitProgress'),n=w.querySelector('.studentNameInput'),b=w.querySelector('.lessonSubmitBtn'),r=w.querySelector('.lessonSubmitResult');
  n.value=localStorage.getItem(V21_PROFILE_STUDENT)||'';
  let busy=false;
  const msg=(t,k='info')=>{r.textContent=t;r.className='lessonSubmitResult show '+k};
  function refresh(){
    const done=topicDoneCount(lesson),total=lesson.questions.length,sent=v21LessonSent(lesson),okName=n.value.trim().length>0;
    p.className='lessonSubmitProgress'+(sent?' sent':done===total?' ready':'');
    p.textContent=sent?'✓ Lição finalizada e enviada. A próxima etapa está liberada.':done===total?'Tudo respondido. Agora falta enviar a lição para finalizar.':`${done} de ${total} questões concluídas. Responda todas antes de enviar.`;
    b.disabled=busy||sent||done!==total||!okName;
    b.textContent=sent?'✓ Lição enviada':busy?'Enviando e criando PDF...':'📨 Enviar todas as respostas';
    if(!sent&&done===total&&!okName)msg('Digite o nome do aluno para liberar o envio.','info');
  }
  function save(){localStorage.setItem(V21_PROFILE_STUDENT,n.value.trim());refresh()}
  n.addEventListener('input',save);
  b.addEventListener('click',async()=>{
    if(b.disabled||busy)return;
    busy=true;refresh();msg('Preparando o PDF e enviando as respostas ao responsável...','info');
    const payload=v21Payload(lesson,n.value.trim());
    try{
      const res=await fetch(V21_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':V21_ANON,'Authorization':'Bearer '+V21_ANON},body:JSON.stringify(payload)}),data=await res.json().catch(()=>({}));
      if(data.pdfBase64)v21DownloadPdf(data.pdfBase64,data.filename);
      if(res.ok&&data.emailSent){
        localStorage.setItem(v21LessonKey(lesson,'sent'),'1');
        localStorage.setItem(v21LessonKey(lesson,'sentAt'),new Date().toISOString());
        localStorage.setItem(v21LessonKey(lesson,'sentEmail'),'responsavel_cadastrado');
        msg('✓ PDF salvo e enviado ao responsável. A próxima lição foi liberada.','success');
        toast('Lição enviada com sucesso!');updateProgress();
      }else if(data.emailConfigured===false){
        msg('O Gmail do responsável ainda precisa ser configurado. A próxima lição continua bloqueada.','error');
      }else{
        msg(data.message||data.error||'O PDF foi criado, mas o envio pelo Gmail falhou. Tente novamente.','error');
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

if 'o destinatário é fixo no backend' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="22','fixedRecipientNotice','v21Payload=function','responsavel_cadastrado']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 22 aplicada',len(s.encode()))
