from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Marca a nova versão para facilitar a conferência no navegador.
if '<meta name="app-version" content="18">' not in s:
    s=s.replace('<title>Lousa de Estudos</title>','<title>Lousa de Estudos</title>\n<meta name="app-version" content="18">',1)

# Deixa o bloco antes das perguntas mais visual, acolhedor e didático.
needle='.reviewVisual{margin-top:13px;padding:12px 14px;border-radius:15px;background:#fff;border:1px solid #e8ebdf;text-align:center;font-size:14px;font-weight:800;color:#44554b;line-height:1.55;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}'
extra='''.reviewLead{margin-top:12px;padding:14px 15px;border-radius:16px;background:rgba(255,255,255,.78);border:1px solid #e7eadf;color:#34443a;line-height:1.7;font-size:15px}.reviewStory{margin-top:12px;padding:14px 15px;border-radius:17px;background:linear-gradient(135deg,#fffaf0 0%,#fffef8 100%);border:1px solid #f0dfb1;box-shadow:0 7px 18px rgba(108,78,19,.05)}.reviewStoryTitle{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:950;color:#7a5a10;text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px}.reviewStory p{margin:0;color:#454b47;line-height:1.7;font-size:14px}.reviewTip{display:flex;align-items:flex-start;gap:10px;margin-top:12px;padding:12px 14px;border-radius:15px;background:linear-gradient(135deg,#eef8ff 0%,#f8fcff 100%);border:1px solid #d7e8f7;color:#31516b}.reviewTipIcon{font-size:21px;line-height:1}.reviewTip strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#24506f;margin-bottom:3px}.reviewTip span{display:block;font-size:13px;line-height:1.55}.reviewCard.subjectScience{background:linear-gradient(135deg,#f7fff9 0%,#f4fbff 100%)}.reviewCard.subjectPortuguese{background:linear-gradient(135deg,#fffdf4 0%,#faf7ff 100%)}.reviewCard.subjectMath{background:linear-gradient(135deg,#f6f9ff 0%,#fbfdff 100%)}.reviewCard.subjectGeography{background:linear-gradient(135deg,#f5fff8 0%,#f4fbff 100%)}.reviewCard.subjectHistory{background:linear-gradient(135deg,#fff9f2 0%,#fffdf8 100%)}'''
if extra not in s:
    if needle not in s:
        raise SystemExit('CSS base da revisão não encontrado')
    s=s.replace(needle,needle+extra,1)

helper='''
function getReviewTheme(){
  const themes={
    science:{label:'🧪 Descubra como funciona',className:'subjectScience',fallback:'Vamos transformar esta ideia em uma cena simples para enxergar melhor como o corpo e a natureza funcionam.'},
    portuguese:{label:'🔎 Detetive do texto',className:'subjectPortuguese',fallback:'Antes de responder, procure pistas como um detetive. O texto sempre deixa sinais que ajudam a montar a resposta.'},
    math:{label:'🧮 Pense passo a passo',className:'subjectMath',fallback:'Antes de fazer a conta, descubra o que a questão quer encontrar. Depois escolha a operação e resolva com calma.'},
    geography:{label:'🌍 Observe o mundo',className:'subjectGeography',fallback:'Imagine que você está olhando um mapa, uma paisagem ou uma cidade. Observe as relações entre os lugares e as pessoas.'},
    history:{label:'🕰️ Viaje no tempo',className:'subjectHistory',fallback:'Imagine a cena acontecendo no passado. Pense em quem participou, o que mudou e por que isso foi importante.'}
  };
  return themes[currentSubjectKey]||{label:'🌟 Entenda brincando',className:'',fallback:'Vamos transformar a ideia em uma situação simples antes de responder.'};
}
function isGenericReview(text){
  const generic=[
    'Leia com atenção e use as pistas do conteúdo antes de escolher.',
    'Organize o raciocínio e responda com suas palavras ou faça o cálculo à mão.'
  ];
  return generic.includes((text||'').trim());
}
function isGenericReviewLabel(label){
  const generic=['🧠 Antes de responder','✍️ Resolva à mão','📘 Antes de responder, relembre'];
  return !label||generic.includes(label.trim());
}
function buildPreQuestionReview(q){
  const theme=getReviewTheme();
  const everyday=q.everyday||DAILY_EXAMPLES[q.id];
  const label=isGenericReviewLabel(q.reviewLabel)?theme.label:q.reviewLabel;
  const lead=isGenericReview(q.review)?theme.fallback:q.review;
  const example=everyday?.example||'';
  const remember=everyday?.remember||'';
  return `<div class="reviewLabel">${label}</div><div class="reviewLead">${lead}</div>${example?`<div class="reviewStory"><div class="reviewStoryTitle">🎈 Imagine assim</div><p>${example}</p></div>`:''}${q.reviewVisual?`<div class="reviewVisual">${q.reviewVisual}</div>`:''}${remember?`<div class="reviewTip"><div class="reviewTipIcon">🎯</div><div><strong>Pista para pensar</strong><span>${remember}</span></div></div>`:''}`;
}
'''
marker='function buildQuestion(q,num){'
if 'function buildPreQuestionReview(q)' not in s:
    if marker not in s:
        raise SystemExit('Função de questões não encontrada')
    s=s.replace(marker,helper+'\n'+marker,1)

old="""  const card=document.createElement('article');card.className='question';
  const review=document.createElement('div');review.className='reviewCard';review.innerHTML=`<div class="reviewLabel">${q.reviewLabel||'📘 Antes de responder, relembre'}</div><p>${q.review}</p>${q.reviewVisual?`<div class="reviewVisual">${q.reviewVisual}</div>`:''}`;card.appendChild(review);"""
new="""  const card=document.createElement('article');card.className='question';
  const review=document.createElement('div');
  const reviewTheme=getReviewTheme();
  review.className=`reviewCard ${reviewTheme.className}`;
  review.innerHTML=buildPreQuestionReview(q);
  card.appendChild(review);"""
if old in s:
    s=s.replace(old,new,1)
elif 'review.innerHTML=buildPreQuestionReview(q);' not in s:
    raise SystemExit('Bloco visual antes da questão não encontrado')

old2="""    const everyday=q.everyday||DAILY_EXAMPLES[q.id];
    const everydayHtml=everyday?`<div class="everyday"><div class="everydayTitle">🏡 Exemplo do dia a dia</div><p>${everyday.example}</p><div class="remember">💭 Para lembrar: ${everyday.remember}</div></div>`:'';
    explainer.innerHTML=`<div class="explainTop"><h5>Vamos entender juntos</h5><p>${status}<br>${q.explanation}</p></div><div class="visual">${q.visual}</div>${everydayHtml}<div class="expected">${q.expected}</div>`;"""
new2="""    const everyday=q.everyday||DAILY_EXAMPLES[q.id];
    const rememberHtml=everyday?`<div class="everyday"><div class="everydayTitle">🧠 Guarde esta ideia</div><div class="remember">${everyday.remember}</div></div>`:'';
    explainer.innerHTML=`<div class="explainTop"><h5>Vamos entender juntos</h5><p>${status}<br>${q.explanation}</p></div><div class="visual">${q.visual}</div>${rememberHtml}<div class="expected">${q.expected}</div>`;"""
if old2 in s:
    s=s.replace(old2,new2,1)
elif 'const rememberHtml=everyday?' not in s:
    raise SystemExit('Bloco da explicação final não encontrado')

p.write_text(s,encoding='utf-8')
print(f'index.html versão 18 atualizado com {len(s.encode("utf-8"))} bytes')
