from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="31">','<meta name="app-version" content="32">',1)

css='''
/* Versão 32: explicação simples após questões abertas de Matemática e vídeo na questão de proporcionalidade */
.v32SimpleExplanation{margin-top:14px;padding-top:14px;border-top:1px solid #d9e9df;color:#33463b}
.v32SimpleExplanation strong{display:block;margin-bottom:7px;font-size:14px;color:#245f40}
.v32SimpleExplanation p{margin:0;line-height:1.65;font-size:15px}
.v32ResponseVideo{margin-top:16px;padding:14px;border-radius:17px;background:#fff;border:1px solid #dbe8f5;box-shadow:0 8px 20px rgba(36,74,112,.06)}
.v32ResponseVideo strong{display:block;margin-bottom:5px;color:#20364b;font-size:15px}
.v32ResponseVideo p{margin:0 0 11px;color:#637386;font-size:13px;line-height:1.5}
.v32ResponseVideoFrame{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#0f172a}
.v32ResponseVideoFrame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
'''
if 'v32SimpleExplanation{' not in s:
    s=s.replace('</style>',css+'</style>',1)

old="""    function showExpectedAnswer(){
      let raw=String(q.expected||q.explanation||'').trim();
      raw=raw.replace(/^(Ideia principal|Ideia esperada|Resultado esperado|Resposta correta)\\s*:\\s*/i,'').trim();
      if(!raw)return;
      expectedAnswer.innerHTML='';
      const title=document.createElement('strong');title.textContent='Uma resposta correta seria:';
      const text=document.createElement('p');text.textContent=raw.charAt(0).toUpperCase()+raw.slice(1);
      expectedAnswer.appendChild(title);expectedAnswer.appendChild(text);expectedAnswer.classList.add('show');
    }
"""
new="""    function showExpectedAnswer(){
      let raw=String(q.expected||q.explanation||'').trim();
      raw=raw.replace(/^(Ideia principal|Ideia esperada|Resultado esperado|Resposta correta)\\s*:\\s*/i,'').trim();
      if(!raw)return;
      expectedAnswer.innerHTML='';
      const title=document.createElement('strong');title.textContent='Uma resposta correta seria:';
      const text=document.createElement('p');text.textContent=raw.charAt(0).toUpperCase()+raw.slice(1);
      expectedAnswer.appendChild(title);expectedAnswer.appendChild(text);

      if(currentSubjectKey==='math'){
        const simple=document.createElement('div');simple.className='v32SimpleExplanation';
        const simpleTitle=document.createElement('strong');simpleTitle.textContent='Como chegar nessa resposta:';
        const simpleText=document.createElement('p');
        if(q.id==='m_cal6'){
          simpleText.textContent='Laura lê 30 páginas em 2 horas. Para chegar a 120 páginas, a quantidade de páginas ficou 4 vezes maior, porque 30 × 4 = 120. Mantendo o mesmo ritmo, o tempo também fica 4 vezes maior: 2 × 4 = 8 horas.';
        }else{
          simpleText.textContent=String(q.explanation||q.everyday?.example||'Confira a conta passo a passo e compare com a resposta correta.').trim();
        }
        simple.appendChild(simpleTitle);simple.appendChild(simpleText);expectedAnswer.appendChild(simple);
      }

      if(q.id==='m_cal6'){
        const video=document.createElement('div');video.className='v32ResponseVideo';
        const videoTitle=document.createElement('strong');videoTitle.textContent='Vídeo para aprender';
        const videoText=document.createElement('p');videoText.textContent='Assista para entender melhor situações de proporcionalidade.';
        const frame=document.createElement('div');frame.className='v32ResponseVideoFrame';
        const iframe=document.createElement('iframe');
        iframe.src='https://www.youtube-nocookie.com/embed/eRnc0T_K_j4?rel=0';
        iframe.title='Situações problema com significado de proporcionalidade';
        iframe.loading='lazy';
        iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy='strict-origin-when-cross-origin';
        iframe.allowFullscreen=true;
        frame.appendChild(iframe);video.appendChild(videoTitle);video.appendChild(videoText);video.appendChild(frame);expectedAnswer.appendChild(video);
      }

      expectedAnswer.classList.add('show');
    }
"""
if old not in s:
    raise SystemExit('showExpectedAnswer da versão 29 não encontrado')
s=s.replace(old,new,1)

checks=['app-version" content="32','v32SimpleExplanation','Como chegar nessa resposta:','eRnc0T_K_j4','v32ResponseVideoFrame','q.id===\'m_cal6\'']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 32 aplicada',len(s.encode()))
