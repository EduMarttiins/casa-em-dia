from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

text = text.replace('<meta name="app-version" content="18">', '<meta name="app-version" content="20">', 1)

css_anchor = '@media (prefers-reduced-motion:reduce){.question{transition:none}}'
css_extra = """
/* Versão 20: a ajuda aparece sob a área de resposta somente quando o aluno pedir. */
.studyHelp{margin-top:14px}
.studyHelpToggle{display:inline-flex;align-items:center;gap:8px;border:1px solid #d8e6df;background:linear-gradient(135deg,#fffdf5 0%,#f7fbff 100%);color:#3b5146;border-radius:14px;padding:10px 13px;font-weight:900;box-shadow:0 6px 16px rgba(40,58,46,.05)}
.studyHelpToggle:hover,.studyHelpToggle:focus-visible{border-color:#b8d4c1;outline:none;box-shadow:0 9px 20px rgba(40,58,46,.09)}
.studyHelpToggle[aria-expanded="true"]{background:linear-gradient(135deg,#f1f8ff 0%,#f8fbff 100%);border-color:#cbdff2;color:#24506f}
.studyHelp .reviewCard{margin:12px 0 0;display:none}
.studyHelp.open .reviewCard{display:block;animation:studyHelpIn .18s ease-out}
.question.stateCorrect>.studyHelp{opacity:.52;filter:saturate(.72)}
.question.stateWrong>.studyHelp{opacity:.48;filter:grayscale(.72)}
@keyframes studyHelpIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:720px){.studyHelpToggle{width:100%;justify-content:center}}
"""
if css_extra.strip() not in text:
    if css_anchor not in text:
        raise SystemExit('Âncora de CSS da versão 19 não encontrada')
    text = text.replace(css_anchor, css_extra + css_anchor, 1)

old_top = """  const review=document.createElement('div');
  const reviewTheme=getReviewTheme();
  review.className=`reviewCard ${reviewTheme.className}`;
  review.innerHTML=buildPreQuestionReview(q);
  card.appendChild(review);
  const head=document.createElement('div');"""
new_top = """  const review=document.createElement('div');
  const reviewTheme=getReviewTheme();
  review.className=`reviewCard ${reviewTheme.className}`;
  review.innerHTML=buildPreQuestionReview(q);
  const studyHelp=document.createElement('div');studyHelp.className='studyHelp';
  const studyHelpToggle=document.createElement('button');studyHelpToggle.type='button';studyHelpToggle.className='studyHelpToggle';studyHelpToggle.setAttribute('aria-expanded','false');studyHelpToggle.textContent='💡 Ver ajuda para pensar';
  studyHelp.appendChild(studyHelpToggle);studyHelp.appendChild(review);
  studyHelpToggle.addEventListener('click',()=>{const open=!studyHelp.classList.contains('open');studyHelp.classList.toggle('open',open);studyHelpToggle.setAttribute('aria-expanded',open?'true':'false');studyHelpToggle.textContent=open?'🙈 Ocultar ajuda':'💡 Ver ajuda para pensar';});
  const head=document.createElement('div');"""
if old_top not in text:
    raise SystemExit('Início de buildQuestion da versão 19 não encontrado')
text = text.replace(old_top, new_top, 1)

old_bottom = """  actions.appendChild(submit);actions.appendChild(redo);actions.appendChild(feedback);card.appendChild(actions);card.appendChild(gate);card.appendChild(explainer);
  return card;"""
new_bottom = """  card.appendChild(studyHelp);
  actions.appendChild(submit);actions.appendChild(redo);actions.appendChild(feedback);card.appendChild(actions);card.appendChild(gate);card.appendChild(explainer);
  return card;"""
if old_bottom not in text:
    raise SystemExit('Final de buildQuestion da versão 19 não encontrado')
text = text.replace(old_bottom, new_bottom, 1)

path.write_text(text, encoding='utf-8')
print(f'index.html versão 20 atualizado com {len(text.encode("utf-8"))} bytes')
