from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="29">','<meta name="app-version" content="30">',1)

css='''
/* Versão 30: matemática por tema e vídeos de aprendizagem */
.v30VideoCard{margin:18px 0 22px;padding:18px;border-radius:22px;background:#f7fbff;border:1px solid #dbe8f5;box-shadow:0 10px 24px rgba(36,74,112,.07)}
.v30VideoCard strong{display:block;font-size:17px;color:#20364b;margin-bottom:5px}
.v30VideoCard p{margin:0 0 14px;color:#637386;font-size:13px;line-height:1.55}
.v30VideoFrame{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#0f172a}
.v30VideoFrame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
@media(max-width:720px){.v30VideoCard{padding:14px;margin:14px 0 18px;border-radius:18px}.v30VideoCard strong{font-size:16px}}
'''
if 'v30VideoCard{' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 30: reorganiza Matemática por tema e inclui os vídeos enviados para multiplicação e divisão.
const v30OriginalMathLessons=mathLessons.slice();
const v30MathLessonByKey=key=>v30OriginalMathLessons.find(l=>l.key===key);
const v30Operations=v30MathLessonByKey('operacoes');
const v30ProblemsSource=v30MathLessonByKey('calculos');

if(v30Operations&&v30ProblemsSource){
  const v30QuestionMap=new Map([...v30Operations.questions,...v30ProblemsSource.questions].map(q=>[q.id,q]));
  const v30Take=ids=>ids.map(id=>v30QuestionMap.get(id)).filter(Boolean);

  const v30ThematicLessons=[
    {
      key:'adicao-subtracao',emoji:'➕',title:'Adição e subtração',subtitle:'somar e descobrir diferenças',
      desc:'Treine contas de adição e subtração e organize os números com atenção.',
      mission:'Matemática • Adição e subtração',
      questions:v30Take(['m_op1','m_op2','m_cal9'])
    },
    {
      key:'multiplicacao',emoji:'✖️',title:'Multiplicação',subtitle:'multiplicar passo a passo • com vídeo',
      desc:'Aprenda a organizar a multiplicação e resolver contas e situações com grupos iguais.',
      mission:'Matemática • Multiplicação',
      learningVideo:{id:'izaSmMXZRgk',title:'Vídeo para aprender multiplicação',caption:'Assista à explicação e depois faça as questões.'},
      questions:v30Take(['m_op3','m_op6','m_op8','m_cal1','m_cal2','m_cal3','m_cal4','m_cal6','m_cal7'])
    },
    {
      key:'divisao',emoji:'➗',title:'Divisão',subtitle:'dividir passo a passo • com vídeo',
      desc:'Aprenda a montar a divisão, pensar quantas vezes o divisor cabe e conferir o resultado.',
      mission:'Matemática • Divisão',
      learningVideo:{id:'61S-Rayhc7c',title:'Vídeo para aprender divisão',caption:'Assista à explicação e depois faça as questões.'},
      questions:v30Take(['m_op4','m_op5','m_op7','m_op9','m_cal5'])
    },
    {
      key:'problemas',emoji:'🧠',title:'Problemas e raciocínio',subtitle:'entender, escolher e conferir',
      desc:v30ProblemsSource.desc,
      mission:v30ProblemsSource.mission,
      passageTitle:v30ProblemsSource.passageTitle,
      passage:v30ProblemsSource.passage,
      passageVisual:v30ProblemsSource.passageVisual,
      questions:v30Take(['m_op10','m_cal8','m_cal10'])
    }
  ];

  const v30OtherLessons=v30OriginalMathLessons.filter(l=>!['operacoes','calculos'].includes(l.key));
  mathLessons.splice(0,mathLessons.length,...v30ThematicLessons,...v30OtherLessons);

  // Preserva o estado de quem já tinha concluído as duas antigas lições mistas.
  const v30OldOperationsSent=localStorage.getItem(PREFIX+'lesson:math:operacoes:sent')==='1';
  const v30OldProblemsSent=localStorage.getItem(PREFIX+'lesson:math:calculos:sent')==='1';
  if(v30OldOperationsSent&&v30OldProblemsSent){
    ['adicao-subtracao','multiplicacao','divisao','problemas'].forEach(k=>{
      localStorage.setItem(PREFIX+'lesson:math:'+k+':sent','1');
    });
  }
}

function v30LearningVideoCard(video){
  const card=document.createElement('section');
  card.className='v30VideoCard';
  const title=document.createElement('strong');title.textContent=video.title||'Vídeo para aprender';
  const text=document.createElement('p');text.textContent=video.caption||'Assista antes de responder às questões.';
  const frame=document.createElement('div');frame.className='v30VideoFrame';
  const iframe=document.createElement('iframe');
  iframe.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(video.id)+'?rel=0';
  iframe.title=video.title||'Vídeo de aprendizagem';
  iframe.loading='lazy';
  iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.allowFullscreen=true;
  frame.appendChild(iframe);card.appendChild(title);card.appendChild(text);card.appendChild(frame);
  return card;
}

const v30RenderLesson=renderLesson;
renderLesson=function(lesson){
  v30RenderLesson(lesson);
  if(currentSubjectKey!=='math'||!lesson.learningVideo)return;
  const root=document.getElementById('lessonContent');
  const card=v30LearningVideoCard(lesson.learningVideo);
  const firstQuestion=root.querySelector('.question');
  if(firstQuestion)root.insertBefore(card,firstQuestion);
  else{
    const submit=root.querySelector('.lessonSubmitCard');
    if(submit)root.insertBefore(card,submit);else root.appendChild(card);
  }
};
'''

if 'const v30OriginalMathLessons' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="30','key:\'multiplicacao\'','key:\'divisao\'','izaSmMXZRgk','61S-Rayhc7c','v30LearningVideoCard','v30VideoFrame']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 30 aplicada',len(s.encode()))
