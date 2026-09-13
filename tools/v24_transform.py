from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="23">','<meta name="app-version" content="24">',1)

css='''
/* Versão 24: cada questão abre somente ao tocar no número e enunciado */
.question.v24QuestionCollapsed>*:not(.qTitle){display:none!important}
.qTitle.v24QuestionHead{cursor:pointer;align-items:flex-start;gap:8px;border-radius:14px;transition:background .16s ease,transform .16s ease;outline:none}
.qTitle.v24QuestionHead:hover,.qTitle.v24QuestionHead:focus-visible{background:#f5f9f6}
.qTitle.v24QuestionHead:active{transform:scale(.995)}
.qTitle.v24QuestionHead .v24QuestionNumber{flex:0 0 auto;font-size:18px;line-height:1.4;font-weight:950;color:var(--blue)}
.qTitle.v24QuestionHead .v24QuestionText{font-size:18px;line-height:1.4;font-weight:800;color:var(--ink)}
.question.v24QuestionCollapsed{background:#fff}
.question:not(.v24QuestionCollapsed)>.qTitle.v24QuestionHead{margin-bottom:2px}
@media(max-width:720px){.qTitle.v24QuestionHead .v24QuestionNumber,.qTitle.v24QuestionHead .v24QuestionText{font-size:16px}}
'''
if 'v24QuestionCollapsed' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 24: inicialmente mostrar somente "número. enunciado"
function v24PrepareQuestionDisclosure(){
  const cards=[...document.querySelectorAll('#lessonContent .question')];
  cards.forEach((card,index)=>{
    const head=card.querySelector('.qTitle');
    if(!head)return;
    const badge=head.querySelector('.badge');
    const statement=head.querySelector('strong');
    if(!statement)return;
    const rawNumber=(badge?.textContent||String(index+1)).trim();
    const number=rawNumber.replace(/[.\-–—]+$/,'')||String(index+1);
    const statementHtml=statement.innerHTML;

    head.innerHTML='';
    const numberEl=document.createElement('span');
    numberEl.className='v24QuestionNumber';
    numberEl.textContent=number+'.';
    const textEl=document.createElement('strong');
    textEl.className='v24QuestionText';
    textEl.innerHTML=statementHtml;
    head.appendChild(numberEl);
    head.appendChild(textEl);
    head.classList.add('v24QuestionHead');
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    head.setAttribute('aria-expanded','false');
    head.setAttribute('aria-label','Abrir questão '+number);
    card.classList.add('v24QuestionCollapsed');

    const toggle=()=>{
      const willOpen=card.classList.contains('v24QuestionCollapsed');
      card.classList.toggle('v24QuestionCollapsed',!willOpen);
      head.setAttribute('aria-expanded',willOpen?'true':'false');
      head.setAttribute('aria-label',(willOpen?'Fechar':'Abrir')+' questão '+number);
    };
    head.addEventListener('click',toggle);
    head.addEventListener('keydown',ev=>{
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();toggle()}
    });
  });
}

const v24RenderLesson=renderLesson;
renderLesson=function(lesson){
  v24RenderLesson(lesson);
  v24PrepareQuestionDisclosure();
};
'''

if 'function v24PrepareQuestionDisclosure' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="24','v24QuestionCollapsed','v24PrepareQuestionDisclosure','numberEl.textContent=number+\'.\'']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 24 aplicada',len(s.encode()))
