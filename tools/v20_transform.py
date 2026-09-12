from pathlib import Path

path = Path('index.html')
html = path.read_text(encoding='utf-8')

html = html.replace('<meta name="app-version" content="18">', '<meta name="app-version" content="20">', 1)

old_css = ".reviewCard.subjectScience{background:linear-gradient(135deg,#f7fff9 0%,#f4fbff 100%)}.reviewCard.subjectPortuguese{background:linear-gradient(135deg,#fffdf4 0%,#faf7ff 100%)}.reviewCard.subjectMath{background:linear-gradient(135deg,#f6f9ff 0%,#fbfdff 100%)}.reviewCard.subjectGeography{background:linear-gradient(135deg,#f5fff8 0%,#f4fbff 100%)}.reviewCard.subjectHistory{background:linear-gradient(135deg,#fff9f2 0%,#fffdf8 100%)}.qTitle{display:flex;align-items:flex-start;gap:11px}.badge{min-width:34px;height:34px;border-radius:11px;background:var(--blueSoft);color:var(--blue);display:grid;place-items:center;font-weight:900}.qMeta{display:inline-flex;margin-bottom:8px;padding:5px 9px;border-radius:999px;background:#f4f7f5;border:1px solid #e6ece8;color:#59685e;font-size:12px;font-weight:900}.qTitle strong{display:block;font-size:18px;line-height:1.4}"
new_css = ".reviewCard.subjectScience{background:linear-gradient(135deg,#f7fff9 0%,#f4fbff 100%)}.reviewCard.subjectPortuguese{background:linear-gradient(135deg,#fffdf4 0%,#faf7ff 100%)}.reviewCard.subjectMath{background:linear-gradient(135deg,#f6f9ff 0%,#fbfdff 100%)}.reviewCard.subjectGeography{background:linear-gradient(135deg,#f5fff8 0%,#f4fbff 100%)}.reviewCard.subjectHistory{background:linear-gradient(135deg,#fff9f2 0%,#fffdf8 100%)}.qTitle{width:100%;display:block;border:0;background:transparent;color:inherit;padding:0;text-align:left;cursor:pointer}.qTitle strong{display:block;font-size:18px;line-height:1.5}.qNumber{color:var(--blue);font-weight:950;margin-right:4px}.qTitle:hover strong,.qTitle:focus-visible strong{color:var(--greenDark)}.qTitle:focus-visible{outline:3px solid color-mix(in srgb,var(--green) 28%,transparent);outline-offset:6px;border-radius:10px}.qDetails{display:none;padding-top:18px}.question.expanded>.qDetails{display:block}.question.expanded>.qTitle{margin-bottom:0}"
if old_css not in html:
    raise SystemExit('Bloco CSS da versão 19 não encontrado')
html = html.replace(old_css, new_css, 1)

html = html.replace(
    '.question.stateCorrect>.reviewCard,.question.stateCorrect>.qTitle,.question.stateCorrect>.mcqLayout,.question.stateCorrect>.options,.question.stateCorrect>.board,.question.stateCorrect>.actions{opacity:.52;filter:saturate(.72)}',
    '.question.stateCorrect>.qTitle,.question.stateCorrect .reviewCard,.question.stateCorrect .mcqLayout,.question.stateCorrect .options,.question.stateCorrect .board,.question.stateCorrect .actions{opacity:.52;filter:saturate(.72)}',
    1,
)
html = html.replace(
    '.question.stateWrong>.reviewCard,.question.stateWrong>.qTitle,.question.stateWrong>.mcqLayout,.question.stateWrong>.options,.question.stateWrong>.board{opacity:.48;filter:grayscale(.72)}',
    '.question.stateWrong>.qTitle,.question.stateWrong .reviewCard,.question.stateWrong .mcqLayout,.question.stateWrong .options,.question.stateWrong .board{opacity:.48;filter:grayscale(.72)}',
    1,
)

old_start = """function buildQuestion(q,num){
  const card=document.createElement('article');card.className='question';
  const review=document.createElement('div');
  const reviewTheme=getReviewTheme();
  review.className=`reviewCard ${reviewTheme.className}`;
  review.innerHTML=buildPreQuestionReview(q);
  card.appendChild(review);
  const head=document.createElement('div');head.className='qTitle';head.innerHTML=`<div class=\"badge\">${num}</div><div><div class=\"qMeta\">${q.type==='mcq'?'Múltipla escolha':'Resposta à mão'}</div><strong>${q.text}</strong></div>`;card.appendChild(head);
  const statusSeal=document.createElement('div');statusSeal.className='statusSeal';card.appendChild(statusSeal);
"""
new_start = """function buildQuestion(q,num){
  const card=document.createElement('article');card.className='question';
  const head=document.createElement('button');head.type='button';head.className='qTitle';head.setAttribute('aria-expanded','false');head.innerHTML=`<strong><span class=\"qNumber\">${num}.</span> ${q.text}</strong>`;card.appendChild(head);
  const details=document.createElement('div');details.className='qDetails';card.appendChild(details);
  head.addEventListener('click',()=>{
    const expanded=card.classList.toggle('expanded');
    head.setAttribute('aria-expanded',expanded?'true':'false');
    if(expanded) setTimeout(()=>window.dispatchEvent(new Event('resize')),0);
  });
  const review=document.createElement('div');
  const reviewTheme=getReviewTheme();
  review.className=`reviewCard ${reviewTheme.className}`;
  review.innerHTML=buildPreQuestionReview(q);
  details.appendChild(review);
  const statusSeal=document.createElement('div');statusSeal.className='statusSeal';details.appendChild(statusSeal);
"""
if old_start not in html:
    raise SystemExit('Cabeçalho da questão da versão 19 não encontrado')
html = html.replace(old_start, new_start, 1)

start = html.index('function buildQuestion(q,num){')
end = html.index('\nfunction setCanvasLocked', start)
block = html[start:end]
block = block.replace('card.appendChild(mcqLayout);', 'details.appendChild(mcqLayout);')
block = block.replace('card.appendChild(options);', 'details.appendChild(options);')
block = block.replace('card.appendChild(board);', 'details.appendChild(board);')
block = block.replace(
    'card.appendChild(actions);card.appendChild(gate);card.appendChild(explainer);',
    'details.appendChild(actions);details.appendChild(gate);details.appendChild(explainer);',
)
html = html[:start] + block + html[end:]

checks = [
    '<span class="qNumber">${num}.</span>',
    "details.appendChild(options);",
    "details.appendChild(board);",
    "details.appendChild(actions);details.appendChild(gate);details.appendChild(explainer);",
]
for check in checks:
    if check not in html:
        raise SystemExit(f'Validação falhou: {check}')

path.write_text(html, encoding='utf-8')
print('Versão 20 aplicada com sucesso')
