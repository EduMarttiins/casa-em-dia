/* Lousa de Estudos v71 — reforço da lição de Divisão */
(() => {
  if (window.__lousaV71Division) return;
  window.__lousaV71Division = true;

  const questions = [
    {id:'m_div71_01', type:'open', reviewLabel:'✍️ Arme a conta na lousa', review:'Monte a divisão com calma. Comece pela esquerda, descubra quantas vezes o divisor cabe e confira multiplicando o quociente pelo divisor.', text:'Resolva na lousa: oitocentos e sessenta e quatro dividido por vinte e quatro.', explanation:'O resultado é trinta e seis. Para conferir, multiplique trinta e seis por vinte e quatro.', visual:'864 ÷ 24 = 36', expected:'Resultado esperado: trinta e seis.', everyday:{example:'Imagine distribuir oitocentos e sessenta e quatro figurinhas igualmente em vinte e quatro grupos.',remember:'Depois da divisão, use a multiplicação para conferir.'}},
    {id:'m_div71_02', type:'open', reviewLabel:'✍️ Divisor de dois algarismos', review:'Observe o divisor e organize a conta na lousa antes de calcular.', text:'Resolva na lousa: mil duzentos e quarenta e oito dividido por trinta e dois.', explanation:'O resultado é trinta e nove. A conferência é trinta e nove vezes trinta e dois, que retorna ao dividendo.', visual:'1.248 ÷ 32 = 39', expected:'Resultado esperado: trinta e nove.', everyday:{example:'É como repartir mil duzentos e quarenta e oito objetos igualmente entre trinta e dois grupos.',remember:'Divisor com dois algarismos exige atenção ao início da divisão.'}},
    {id:'m_div71_03', type:'open', reviewLabel:'✍️ Faça passo a passo', review:'Use a lousa para registrar cada etapa e não tente fazer tudo de cabeça.', text:'Resolva na lousa: novecentos e quarenta e cinco dividido por quinze.', explanation:'O resultado é sessenta e três. Confira fazendo sessenta e três vezes quinze.', visual:'945 ÷ 15 = 63', expected:'Resultado esperado: sessenta e três.', everyday:{example:'Pense em novecentos e quarenta e cinco itens distribuídos igualmente em quinze caixas.',remember:'Escreva cada subtração da divisão na lousa.'}},
    {id:'m_div71_04', type:'open', reviewLabel:'✍️ Atenção ao divisor', review:'Quando o divisor tem dois algarismos, observe quantos algarismos do dividendo precisam ser considerados no início.', text:'Resolva na lousa: mil cento e setenta e seis dividido por vinte e oito.', explanation:'O resultado é quarenta e dois. A multiplicação quarenta e dois vezes vinte e oito confirma a divisão.', visual:'1.176 ÷ 28 = 42', expected:'Resultado esperado: quarenta e dois.', everyday:{example:'Você pode imaginar mil cento e setenta e seis lápis divididos igualmente em vinte e oito caixas.',remember:'Procure o primeiro trecho do dividendo que seja suficiente para começar.'}},
    {id:'m_div71_05', type:'open', reviewLabel:'✍️ Confira o resultado', review:'Resolva a conta na lousa e depois faça a operação inversa para verificar.', text:'Resolva na lousa: mil quatrocentos e quarenta dividido por vinte e quatro.', explanation:'O resultado é sessenta. Multiplicar sessenta por vinte e quatro devolve mil quatrocentos e quarenta.', visual:'1.440 ÷ 24 = 60', expected:'Resultado esperado: sessenta.', everyday:{example:'Pense em mil quatrocentos e quarenta cartões organizados igualmente em vinte e quatro grupos.',remember:'Divisão e multiplicação são operações inversas.'}},
    {id:'m_div71_06', type:'open', reviewLabel:'✍️ Use a lousa', review:'Arme a conta, faça as multiplicações parciais e registre as subtrações.', text:'Resolva na lousa: mil trezentos e sessenta e cinco dividido por quinze.', explanation:'O resultado é noventa e um. Confira multiplicando noventa e um por quinze.', visual:'1.365 ÷ 15 = 91', expected:'Resultado esperado: noventa e um.', everyday:{example:'Uma quantidade de mil trezentos e sessenta e cinco itens pode ser repartida em quinze grupos iguais.',remember:'Não pule as etapas só porque a conta parece fácil.'}},
    {id:'m_div71_07', type:'open', reviewLabel:'✍️ Desafio', review:'Essa divisão exige atenção ao valor de cada algarismo do quociente. Faça tudo na lousa.', text:'Resolva na lousa: dois mil e dezesseis dividido por trinta e dois.', explanation:'O resultado é sessenta e três. Confira com sessenta e três vezes trinta e dois.', visual:'2.016 ÷ 32 = 63', expected:'Resultado esperado: sessenta e três.', everyday:{example:'Imagine dois mil e dezesseis peças separadas igualmente em trinta e dois kits.',remember:'O zero no dividendo também precisa ser considerado.'}},
    {id:'m_div71_08', type:'open', reviewLabel:'✍️ Divisão longa', review:'Organize a conta verticalmente e avance uma etapa de cada vez.', text:'Resolva na lousa: dois mil cento e oitenta e quatro dividido por vinte e oito.', explanation:'O resultado é setenta e oito. Multiplique setenta e oito por vinte e oito para conferir.', visual:'2.184 ÷ 28 = 78', expected:'Resultado esperado: setenta e oito.', everyday:{example:'É como repartir dois mil cento e oitenta e quatro materiais em vinte e oito conjuntos iguais.',remember:'A multiplicação final é sua conferência.'}},
    {id:'m_div71_09', type:'open', reviewLabel:'✍️ Mais uma com divisor de dois algarismos', review:'Leia os números com atenção antes de começar a conta.', text:'Resolva na lousa: mil quinhentos e setenta e cinco dividido por vinte e cinco.', explanation:'O resultado é sessenta e três. A conferência é sessenta e três vezes vinte e cinco.', visual:'1.575 ÷ 25 = 63', expected:'Resultado esperado: sessenta e três.', everyday:{example:'Pense em mil quinhentos e setenta e cinco sementes distribuídas igualmente em vinte e cinco saquinhos.',remember:'Divisores como vinte e cinco podem facilitar a conferência mental depois da conta.'}},
    {id:'m_div71_10', type:'open', reviewLabel:'✍️ Resolva e confira', review:'Faça a divisão completa na lousa e depois confira usando a multiplicação.', text:'Resolva na lousa: dois mil e quatrocentos dividido por quarenta e oito.', explanation:'O resultado é cinquenta. Quarenta e oito vezes cinquenta é igual a dois mil e quatrocentos.', visual:'2.400 ÷ 48 = 50', expected:'Resultado esperado: cinquenta.', everyday:{example:'Imagine dois mil e quatrocentos objetos colocados em quarenta e oito grupos iguais.',remember:'Terminar em zero não significa que a conta pode ser feita sem organizar as etapas.'}},
    {id:'m_div71_11', type:'open', reviewLabel:'✍️ Desafio de dois algarismos', review:'Arme a divisão na lousa e verifique se cada algarismo do quociente está no lugar certo.', text:'Resolva na lousa: três mil e vinte e quatro dividido por trinta e seis.', explanation:'O resultado é oitenta e quatro. Confira fazendo oitenta e quatro vezes trinta e seis.', visual:'3.024 ÷ 36 = 84', expected:'Resultado esperado: oitenta e quatro.', everyday:{example:'É possível repartir três mil e vinte e quatro objetos em trinta e seis grupos iguais.',remember:'Lugar dos algarismos é importante em contas grandes.'}},
    {id:'m_div71_12', type:'open', reviewLabel:'🏆 Desafio final', review:'Use toda a estratégia: arme, divida, subtraia e confira pela multiplicação.', text:'Resolva na lousa: dois mil duzentos e setenta e cinco dividido por trinta e cinco.', explanation:'O resultado é sessenta e cinco. A multiplicação sessenta e cinco vezes trinta e cinco confirma a resposta.', visual:'2.275 ÷ 35 = 65', expected:'Resultado esperado: sessenta e cinco.', everyday:{example:'Imagine dois mil duzentos e setenta e cinco livros organizados igualmente em trinta e cinco caixas.',remember:'Faça a conta com calma e sempre confira.'}}
  ];

  function replaceDivisionLesson(){
    try {
      if (typeof subjects === 'undefined' || !subjects.math || !Array.isArray(subjects.math.lessons)) return false;
      const lesson = subjects.math.lessons.find(l => l && l.key === 'divisao');
      if (!lesson) return false;
      lesson.questions = questions.map(q => ({...q}));
      lesson.desc = 'Treino de divisão com divisor de dois algarismos, divisão passo a passo e conferência do resultado. Todas as questões têm lousa para montar a conta.';
      lesson.mission = 'Matemática • Divisão • prática na lousa';
      return true;
    } catch(e) { console.warn('v71: divisão', e); return false; }
  }

  function ensureBoards(lesson){
    if (!lesson || lesson.key !== 'divisao') return;
    const cards = [...document.querySelectorAll('#lessonContent .question')];
    cards.forEach((card, index) => {
      const q = lesson.questions[index];
      if (!q) return;
      if (card.querySelector('.board, .scratchCard')) return;
      if (typeof setupCanvas !== 'function') return;
      const wrap = document.createElement('div');
      wrap.className = 'board mathCalcBoard v71DivisionBoard';
      wrap.innerHTML = '<div class="toolbar"><button class="tool pen active" type="button">Caneta</button><button class="tool eraser" type="button">Borracha</button><button class="tool undo" type="button">Desfazer</button><button class="tool danger clear" type="button">Limpar</button><span class="sep"></span><span class="sizeLabel">Espessura</span><input class="sizeRange" type="range" min="1" max="12" value="4"><span class="sizeValue">4 px</span></div><div class="canvasWrap"><canvas class="answerCanvas"></canvas></div><div class="penHint">Arme e faça a divisão aqui. Esta lousa acompanha a questão.</div>';
      card.appendChild(wrap);
      try { setupCanvas(wrap, q, () => {}, () => false, 'division'); } catch(e) { console.warn('v71: lousa', e); }
    });
  }

  const originalRender = typeof renderLesson === 'function' ? renderLesson : null;
  replaceDivisionLesson();
  if (originalRender && !originalRender._v71Wrapped) {
    const wrapped = function(lesson){
      if (lesson && lesson.key === 'divisao') replaceDivisionLesson();
      const result = originalRender(lesson);
      if (lesson && lesson.key === 'divisao') requestAnimationFrame(() => ensureBoards(lesson));
      return result;
    };
    wrapped._v71Wrapped = true;
    renderLesson = wrapped;
  }

  const style = document.createElement('style');
  style.id = 'v71DivisionStyles';
  style.textContent = '.v71DivisionBoard{margin-top:16px!important}.v71DivisionBoard .canvasWrap{height:430px!important;background:#fff!important;background-image:none!important}.v71DivisionBoard .toolbar{border-bottom:1px solid #e7eee9}.v71DivisionBoard .penHint{font-size:12px}@media(max-width:520px){.v71DivisionBoard .canvasWrap{height:360px!important}}';
  document.head.appendChild(style);

  window.__lousaV71DivisionReady = true;
})();
