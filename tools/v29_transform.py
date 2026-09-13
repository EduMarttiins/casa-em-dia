from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="28">','<meta name="app-version" content="29">',1)

css='''
/* Versão 29: mostrar resposta esperada somente depois de enviar questão aberta */
.v29ExpectedAnswer{display:none;margin-top:16px;padding:16px 18px;border-radius:18px;background:#f3faf6;border:1px solid #cfe5d6;color:#263b30;line-height:1.6}
.v29ExpectedAnswer.show{display:block}
.v29ExpectedAnswer strong{display:block;margin-bottom:6px;font-size:14px;color:#1f6b42}
.v29ExpectedAnswer p{margin:0;font-size:15px}
'''
if 'v29ExpectedAnswer{' not in s:
    s=s.replace('</style>',css+'</style>',1)

needle="""    card.appendChild(board);\n    setupCanvas(board,q,()=>{currentHasAnswer=!!getCanvas(q);updateState()},()=>isSubmitted(q));\n\n    submit.addEventListener('click',()=>{if(!currentHasAnswer)return;localStorage.setItem(key(q.id,'submitted'),'1');localStorage.removeItem(key(q.id,'explained'));board.classList.add('submittedBoard');explainer.classList.remove('show','consumed');setCanvasLocked(board,true);updateState();updateProgress();toast('Resposta registrada. Questão concluída.')});\n    explainButton.addEventListener('click',()=>{});\n    if(isSubmitted(q)){board.classList.add('submittedBoard');setTimeout(()=>setCanvasLocked(board,true),0)}\n"""
replacement="""    card.appendChild(board);\n    const expectedAnswer=document.createElement('div');expectedAnswer.className='v29ExpectedAnswer';card.appendChild(expectedAnswer);\n    function showExpectedAnswer(){\n      let raw=String(q.expected||q.explanation||'').trim();\n      raw=raw.replace(/^(Ideia principal|Ideia esperada|Resultado esperado|Resposta correta)\\s*:\\s*/i,'').trim();\n      if(!raw)return;\n      expectedAnswer.innerHTML='';\n      const title=document.createElement('strong');title.textContent='Uma resposta correta seria:';\n      const text=document.createElement('p');text.textContent=raw.charAt(0).toUpperCase()+raw.slice(1);\n      expectedAnswer.appendChild(title);expectedAnswer.appendChild(text);expectedAnswer.classList.add('show');\n    }\n    setupCanvas(board,q,()=>{currentHasAnswer=!!getCanvas(q);updateState()},()=>isSubmitted(q));\n\n    submit.addEventListener('click',()=>{if(!currentHasAnswer)return;localStorage.setItem(key(q.id,'submitted'),'1');localStorage.removeItem(key(q.id,'explained'));board.classList.add('submittedBoard');explainer.classList.remove('show','consumed');setCanvasLocked(board,true);showExpectedAnswer();updateState();updateProgress();toast('Resposta registrada. Compare agora com a resposta esperada.')});\n    explainButton.addEventListener('click',()=>{});\n    if(isSubmitted(q)){board.classList.add('submittedBoard');setTimeout(()=>setCanvasLocked(board,true),0);showExpectedAnswer()}\n"""
if needle not in s:
    raise SystemExit('Bloco de questão aberta não encontrado')
s=s.replace(needle,replacement,1)

checks=['app-version" content="29','v29ExpectedAnswer','Uma resposta correta seria:','showExpectedAnswer()','Compare agora com a resposta esperada.']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 29 aplicada',len(s.encode()))
