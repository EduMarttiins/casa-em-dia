from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="30">','<meta name="app-version" content="31">',1)

css='''
/* Versão 31: mini lousa de rascunho bloqueia junto com a resposta */
.scratchCard.v31Locked{opacity:.82}
.scratchCard.v31Locked .scratchTag{background:#eef3f0;color:#66756c;border-color:#dce5df}
.scratchCard.v31Locked .canvasWrap{cursor:not-allowed}
'''
if 'scratchCard.v31Locked' not in s:
    s=s.replace('</style>',css+'</style>',1)

old_create="""function createScratchBoard(q){
  const wrap=document.createElement('div');
  wrap.className='scratchCard';
  wrap.innerHTML=`<div class=\"scratchHeader\"><div><strong>Mini lousa da conta</strong><span>Use este espaço para montar a operação antes de escolher a resposta.</span></div><div class=\"scratchTag\">✍️ Rascunho</div></div><div class=\"board scratchBoard\"><div class=\"toolbar\"><button class=\"tool pen active\" type=\"button\">Caneta</button><button class=\"tool eraser\" type=\"button\">Borracha</button><button class=\"tool undo\" type=\"button\">Desfazer</button><button class=\"tool danger clear\" type=\"button\">Limpar</button><span class=\"sep\"></span><span class=\"sizeLabel\">Espessura</span><input class=\"sizeRange\" type=\"range\" min=\"1\" max=\"12\" value=\"4\"><span class=\"sizeValue\">4 px</span></div><div class=\"canvasWrap\"><canvas class=\"answerCanvas\"></canvas></div><div class=\"penHint\">Faça a conta à mão aqui. Este espaço é só para rascunho.</div></div><div class=\"scratchSaved\"><strong>Dica:</strong> some, arme a conta ou risque o que precisar antes de enviar a resposta.</div>`;
  const board=wrap.querySelector('.board');
  board.dataset.storageSuffix='scratch';
  setupCanvas(board,q,()=>{},()=>false,'scratch');
  return wrap;
}
"""
new_create="""function createScratchBoard(q){
  const wrap=document.createElement('div');
  wrap.className='scratchCard';
  wrap.innerHTML=`<div class=\"scratchHeader\"><div><strong>Mini lousa da conta</strong><span>Use este espaço para montar a operação antes de escolher a resposta.</span></div><div class=\"scratchTag\">✍️ Rascunho</div></div><div class=\"board scratchBoard\"><div class=\"toolbar\"><button class=\"tool pen active\" type=\"button\">Caneta</button><button class=\"tool eraser\" type=\"button\">Borracha</button><button class=\"tool undo\" type=\"button\">Desfazer</button><button class=\"tool danger clear\" type=\"button\">Limpar</button><span class=\"sep\"></span><span class=\"sizeLabel\">Espessura</span><input class=\"sizeRange\" type=\"range\" min=\"1\" max=\"12\" value=\"4\"><span class=\"sizeValue\">4 px</span></div><div class=\"canvasWrap\"><canvas class=\"answerCanvas\"></canvas></div><div class=\"penHint\">Faça a conta à mão aqui. Este espaço é só para rascunho.</div></div><div class=\"scratchSaved\"><strong>Dica:</strong> some, arme a conta ou risque o que precisar antes de enviar a resposta.</div>`;
  const board=wrap.querySelector('.board');
  board.dataset.storageSuffix='scratch';
  setupCanvas(board,q,()=>{},()=>isSubmitted(q),'scratch');
  const syncLock=()=>{const locked=isSubmitted(q);setCanvasLocked(board,locked);wrap.classList.toggle('v31Locked',locked)};
  requestAnimationFrame(syncLock);
  wrap.v31SyncLock=syncLock;
  return wrap;
}
"""
if old_create not in s:
    raise SystemExit('createScratchBoard original não encontrado')
s=s.replace(old_create,new_create,1)

old_submit="""    submit.addEventListener('click',()=>{
      if(!currentHasAnswer)return;
      localStorage.setItem(key(q.id,'submitted'),'1');localStorage.removeItem(key(q.id,'explained'));
      explainer.classList.remove('show','consumed');paintSubmittedResult();updateState();updateProgress();
      if(isCorrect())toast('Muito bem! Questão concluída.');
      else toast('Resposta incorreta. A ajuda foi liberada.');
    });
"""
new_submit="""    submit.addEventListener('click',()=>{
      if(!currentHasAnswer)return;
      localStorage.setItem(key(q.id,'submitted'),'1');localStorage.removeItem(key(q.id,'explained'));
      const scratch=card.querySelector('.scratchCard');if(scratch&&scratch.v31SyncLock)scratch.v31SyncLock();
      explainer.classList.remove('show','consumed');paintSubmittedResult();updateState();updateProgress();
      if(isCorrect())toast('Muito bem! Questão concluída.');
      else toast('Resposta incorreta. A ajuda foi liberada.');
    });
"""
if old_submit not in s:
    raise SystemExit('submit mcq não encontrado')
s=s.replace(old_submit,new_submit,1)

old_redo="""    redo.addEventListener('click',()=>{
      if(!isWrong()||!wasExplained())return;
      localStorage.removeItem(key(q.id,'submitted'));localStorage.removeItem(key(q.id,'explained'));localStorage.removeItem(key(q.id,'choice'));
      options.querySelectorAll('input').forEach(input=>{input.checked=false});
      explainer.classList.remove('show','consumed');gate.classList.remove('show','consumed');lockOptions(false);updateState();updateProgress();
      card.scrollIntoView({behavior:'smooth',block:'center'});
    });
"""
new_redo="""    redo.addEventListener('click',()=>{
      if(!isWrong()||!wasExplained())return;
      localStorage.removeItem(key(q.id,'submitted'));localStorage.removeItem(key(q.id,'explained'));localStorage.removeItem(key(q.id,'choice'));
      options.querySelectorAll('input').forEach(input=>{input.checked=false});
      const scratch=card.querySelector('.scratchCard');if(scratch&&scratch.v31SyncLock)scratch.v31SyncLock();
      explainer.classList.remove('show','consumed');gate.classList.remove('show','consumed');lockOptions(false);updateState();updateProgress();
      card.scrollIntoView({behavior:'smooth',block:'center'});
    });
"""
if old_redo not in s:
    raise SystemExit('redo mcq não encontrado')
s=s.replace(old_redo,new_redo,1)

checks=['app-version" content="31','()=>isSubmitted(q),\'scratch\'','v31SyncLock','scratchCard.v31Locked']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 31 aplicada',len(s.encode()))
