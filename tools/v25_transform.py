from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="24">','<meta name="app-version" content="25">',1)

css='''
/* Versão 25: ajuda somente após erro, sem entregar a resposta */
.studyHelp{display:none!important}
.question.stateCorrect .explainGate,.question.stateCorrect .explainer{display:none!important}
.question.stateCorrect .option.correct{border-color:#67bd84;background:#eaf8ef;box-shadow:0 0 0 2px rgba(60,160,95,.08) inset}
.question.stateWrong .option.wrong{border-color:#e59a9a;background:#fff1f1}
.explainer.consumed::after{content:'✓ Ajuda consultada'}
.v25HintIntro{margin:0;color:#41566e;line-height:1.6}.v25HintSteps{margin:14px 16px;padding:15px 18px 15px 34px;border-radius:16px;background:#fff;border:1px solid #dbe9f8;color:#344b5f;line-height:1.7}.v25HintSteps li+li{margin-top:7px}.v25HintRule{margin:0 16px 16px;padding:12px 14px;border-radius:14px;background:#fff9e8;border:1px solid #f0dfad;color:#66501a;font-size:13px;font-weight:850;line-height:1.55}
'''
if 'v25HintSteps' not in s:
    s=s.replace('</style>',css+'</style>',1)

helper=r'''
// Versão 25: pistas pedagógicas. Nunca mostrar resposta correta nem resultado final.
function v25BuildHint(q){
  const raw=String(q?.text||'');
  const lower=raw.toLowerCase();
  const isMath=currentSubjectKey==='math';
  const isDivision=isMath&&(/÷|\bdivid|\bquociente|\bresto|\d\s*:\s*\d/.test(lower));
  const isMultiplication=isMath&&(/\bmultiplic|\bproduto|\bvezes|\d\s*[x×]\s*\d/i.test(raw));

  if(isDivision){
    return `<div class="explainTop"><h5>💡 Pista para a divisão</h5><p class="v25HintIntro">Use o mesmo caminho mostrado na aula: monte a divisão e avance uma etapa de cada vez.</p></div><ol class="v25HintSteps"><li>Comece pela esquerda e escolha a primeira parte do dividendo que já pode ser dividida pelo divisor.</li><li>Pense nos múltiplos do divisor para descobrir quantas vezes ele cabe nessa parte, sem ultrapassar.</li><li>Escreva esse algarismo no quociente, multiplique o divisor por ele e coloque o resultado embaixo da parte que você está usando.</li><li>Subtraia e depois abaixe o próximo algarismo do dividendo.</li><li>Repita o mesmo ciclo até não haver mais algarismos para abaixar.</li><li>No final, confira se o resto ficou menor que o divisor.</li></ol><div class="v25HintRule">A ajuda mostra o caminho, mas não calcula o quociente por você. Faça cada conta na lousa de rascunho.</div>`;
  }

  if(isMultiplication){
    return `<div class="explainTop"><h5>💡 Pista para a multiplicação</h5><p class="v25HintIntro">Siga o método da aula e organize a conta por ordem de grandeza.</p></div><ol class="v25HintSteps"><li>Escreva os números um embaixo do outro, alinhando unidade com unidade, dezena com dezena e centena com centena.</li><li>Comece pela unidade do multiplicador e multiplique da direita para a esquerda.</li><li>Quando uma multiplicação passar de 9, escreva a unidade e leve a dezena para a próxima coluna.</li><li>Se o multiplicador tiver dezenas ou centenas, faça uma nova linha para cada ordem, deslocando a linha uma casa para a esquerda.</li><li>Somente depois de terminar as multiplicações parciais, some as linhas.</li><li>Confira se todas as colunas ficaram alinhadas antes de escolher a alternativa.</li></ol><div class="v25HintRule">A ajuda não mostra o produto final. Use a mini lousa para montar as linhas da conta.</div>`;
  }

  const subjectTips={
    portuguese:['Volte ao enunciado e destaque a palavra ou expressão principal.','Leia novamente o trecho relacionado à pergunta e procure uma pista no próprio texto.','Elimine primeiro as alternativas que contradizem o que foi lido.','Compare as alternativas restantes e escolha a que responde exatamente ao que foi perguntado.'],
    science:['Identifique qual função, órgão, etapa ou processo a pergunta está pedindo.','Pense no que cada alternativa faz, sem olhar apenas para palavras parecidas.','Elimine as opções que têm função diferente da pedida.','Escolha somente depois de conferir se a alternativa responde ao enunciado inteiro.'],
    geography:['Procure no enunciado a ideia central: lugar, paisagem, território, orientação ou relação entre espaços.','Compare cada alternativa com essa ideia central.','Elimine as opções que misturam conceitos diferentes.','Use o que foi estudado na lição para decidir entre as alternativas restantes.'],
    history:['Descubra se a pergunta pede fato, sequência, causa, consequência, personagem ou período.','Procure pistas de tempo e de contexto no enunciado.','Elimine as alternativas que pertencem a outro acontecimento ou período.','Escolha a opção que combina com todas as pistas, não apenas com uma palavra conhecida.'],
    math:['Descubra primeiro qual operação ou relação o problema está pedindo.','Monte a conta na lousa de rascunho antes de olhar novamente para as alternativas.','Confira cada etapa do cálculo e a posição dos algarismos.','Só então compare o resultado que você encontrou com as opções.']
  };
  const steps=subjectTips[currentSubjectKey]||['Leia o enunciado mais uma vez e marque a ideia principal.','Elimine as alternativas que claramente não respondem ao que foi perguntado.','Volte ao conteúdo da lição e procure a regra ou conceito relacionado.','Faça uma nova tentativa usando essas pistas.'];
  return `<div class="explainTop"><h5>💡 Pistas para tentar novamente</h5><p class="v25HintIntro">A ajuda vai orientar o raciocínio sem revelar a alternativa correta.</p></div><ol class="v25HintSteps">${steps.map(x=>`<li>${x}</li>`).join('')}</ol><div class="v25HintRule">Pare antes de procurar a resposta pronta. A ideia é usar as pistas e chegar à solução sozinho.</div>`;
}
'''
marker='function buildQuestion(q,num){'
if 'function v25BuildHint(q)' not in s:
    if marker not in s:
        raise SystemExit('buildQuestion não encontrado')
    s=s.replace(marker,helper+'\n'+marker,1)

start=s.find(marker)
end=s.find('\nfunction setCanvasLocked(board,locked){',start)
if start<0 or end<0:
    raise SystemExit('Trecho buildQuestion não encontrado')
seg=s[start:end]

# Botão de ajuda
seg=seg.replace("explainButton.textContent='Abrir explicação';","explainButton.textContent='Ver ajuda';",1)

# Substitui a explicação pronta por pistas seguras
rs=seg.find('  function renderExplainer(){')
re=seg.find('\n  function applyCardState(){',rs)
if rs<0 or re<0:
    raise SystemExit('renderExplainer não encontrado')
seg=seg[:rs]+"  function renderExplainer(){\n    explainer.innerHTML=v25BuildHint(q);\n  }\n"+seg[re:]

# Textos do estado visual
seg=seg.replace("Resposta incorreta. Leia a explicação para tentar outra vez.","Resposta incorreta. Abra a ajuda para tentar outra vez.")
seg=seg.replace("Explicação lida. Agora tente novamente.","Ajuda consultada. Agora tente novamente.")

# Fluxo de estados: ajuda só existe após resposta errada
us=seg.find('  function updateState(){')
ue=seg.find('\n  function afterExplanationOpened(){',us)
if us<0 or ue<0:
    raise SystemExit('updateState não encontrado')
new_update=r'''  function updateState(){
    const submitted=isSubmitted(q),wrong=isWrong(),correct=isCorrect(),explained=wasExplained();
    if(q.type==='mcq') currentHasAnswer=getChoice(q)!==null;
    else currentHasAnswer=!!getCanvas(q);
    submit.disabled=!currentHasAnswer||submitted;
    submit.textContent=submitted?'Resposta enviada':'Enviar resposta';
    redo.classList.toggle('retryActive',submitted&&wrong&&explained);
    redo.style.display=submitted&&wrong&&explained?'inline-flex':'none';
    gate.classList.remove('success','error','consumed','show');
    feedback.className='feedback';
    applyCardState();

    if(q.type==='mcq'&&submitted&&correct){
      explainButton.disabled=true;
      explainer.classList.remove('show','consumed');
      gateIcon.textContent='✅';
      gateTitle.textContent='Resposta correta';
      gateDesc.textContent='Questão concluída.';
      feedback.textContent='Muito bem! Esta questão foi concluída.';
      feedback.classList.add('success');
      return;
    }

    if(q.type==='mcq'&&submitted&&wrong){
      gate.classList.add('error');
      gateIcon.textContent='💡';
      gateTitle.textContent=explained?'Ajuda consultada':'Precisa de uma pista?';
      gateDesc.textContent=explained?'Agora use Refazer a questão para tentar novamente.':'Abra a ajuda para receber pistas sem ver a resposta.';
      explainButton.textContent='Ver ajuda';
      if(explained){
        gate.classList.add('consumed');
        explainButton.disabled=true;
        explainer.classList.add('show','consumed');
        feedback.textContent='Use as pistas e refaça a questão.';
      }else{
        gate.classList.add('show');
        explainButton.disabled=false;
        explainer.classList.remove('show','consumed');
        feedback.textContent='Resposta incorreta. A ajuda foi liberada.';
      }
      feedback.classList.add('error');
      return;
    }

    gate.classList.remove('show','consumed');
    explainButton.disabled=true;
    explainer.classList.remove('show','consumed');
    feedback.textContent=submitted?'Resposta registrada.':(currentHasAnswer?'Quando terminar, envie a resposta.':'Responda primeiro.');
  }
'''
seg=seg[:us]+new_update+seg[ue:]

# Acrescenta pintura segura: verde só quando acertou; vermelho apenas na alternativa escolhida quando errou.
lock_pos=seg.find('    function lockOptions(showResult=false){')
submit_pos=seg.find("\n    submit.addEventListener('click',()=>{",lock_pos)
if lock_pos<0 or submit_pos<0:
    raise SystemExit('lockOptions ou submit não encontrado')
paint=r'''

    function paintSubmittedResult(){
      const choice=getChoice(q),ok=isCorrect();
      lockOptions(ok);
      if(isSubmitted(q)&&!ok){
        options.querySelectorAll('.option').forEach((label,idx)=>{
          if(String(idx)===String(choice))label.classList.add('wrong');
        });
      }
    }
'''
seg=seg[:submit_pos]+paint+seg[submit_pos:]

# Envio da resposta
ss=seg.find("    submit.addEventListener('click',()=>{")
se=seg.find("\n    redo.addEventListener('click',()=>{",ss)
if ss<0 or se<0:
    raise SystemExit('submit/redo não encontrado')
new_submit=r'''    submit.addEventListener('click',()=>{
      if(!currentHasAnswer)return;
      localStorage.setItem(key(q.id,'submitted'),'1');localStorage.removeItem(key(q.id,'explained'));
      explainer.classList.remove('show','consumed');paintSubmittedResult();updateState();updateProgress();
      if(isCorrect())toast('Muito bem! Questão concluída.');
      else toast('Resposta incorreta. A ajuda foi liberada.');
    });'''
seg=seg[:ss]+new_submit+seg[se:]

# Abrir ajuda sem revelar qual seria a alternativa correta
es=seg.find("    explainButton.addEventListener('click',()=>{",seg.find("    redo.addEventListener('click',()=>{"))
ee=seg.find("\n    if(isSubmitted(q)&&wasExplained()){",es)
if es<0 or ee<0:
    raise SystemExit('evento da ajuda não encontrado')
new_explain="    explainButton.addEventListener('click',()=>{if(!isWrong()||wasExplained())return;renderExplainer();paintSubmittedResult();afterExplanationOpened()});"
seg=seg[:es]+new_explain+seg[ee:]

# Ao reabrir a página, mantém o destaque sem revelar a resposta correta após erro
needle="    updateState();\n  } else {"
if needle not in seg:
    raise SystemExit('final do bloco mcq não encontrado')
seg=seg.replace(needle,"    if(isSubmitted(q))paintSubmittedResult();\n    updateState();\n  } else {",1)

# Questões abertas não exibem ajuda automática
seg=seg.replace("    explainButton.addEventListener('click',()=>{if(!isSubmitted(q)||wasExplained())return;renderExplainer();afterExplanationOpened()});","    explainButton.addEventListener('click',()=>{});",1)

s=s[:start]+seg+s[end:]

checks=['app-version" content="25','function v25BuildHint(q)','A ajuda foi liberada','paintSubmittedResult','A ajuda não mostra o produto final','A ajuda mostra o caminho']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 25 aplicada',len(s.encode()))
