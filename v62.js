/* Lousa de Estudos, versão 62 */
(()=>{
  if(window.__lousaV62)return;
  window.__lousaV62=true;

  const CACHE='lousa:v62:dicio:';
  const norm=v=>String(v||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const STOP=new Set('a o as os um uma uns umas de da do das dos em no na nos nas por para com sem e ou mas que se como qual quais quem onde quando porque por que é são foi foram ser estar está estão ao aos à às seu sua seus suas ele ela eles elas isso isto esse essa este esta muito muita muitos muitas mais menos já ainda também até entre sobre cada todo toda todos todas'.split(/\s+/));

  function visible(el){
    if(!el)return false;
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
  }

  function lessonRoot(){
    const active=[...document.querySelectorAll('.topicView.show')].find(visible);
    if(active)return active;
    const lessons=[...document.querySelectorAll('.lesson')].filter(visible);
    return lessons[0]||document.body;
  }

  function containsWord(text,word){
    const target=plain(norm(word));
    if(!target)return false;
    const source=plain(String(text||''));
    const escaped=target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    try{return new RegExp('(^|[^a-z0-9])'+escaped+'([^a-z0-9]|$)','i').test(source)}catch(error){return source.includes(target)}
  }

  function contextFor(word){
    const root=lessonRoot();
    const selectors='.reviewLead,.reviewStory p,.reviewCard p,.reviewVisual,.qTitle strong,.question p,.question li,.question .prompt,.lesson p,.lesson li';
    let nodes=[...root.querySelectorAll(selectors)].filter(el=>visible(el)&&containsWord(el.textContent,word));
    if(!nodes.length)nodes=[...root.querySelectorAll('*')].filter(el=>visible(el)&&el.children.length===0&&containsWord(el.textContent,word));
    if(!nodes.length)return{sentence:'',block:''};
    const center=innerHeight/2;
    nodes.sort((a,b)=>Math.abs((a.getBoundingClientRect().top+a.getBoundingClientRect().bottom)/2-center)-Math.abs((b.getBoundingClientRect().top+b.getBoundingClientRect().bottom)/2-center));
    const block=clean(nodes[0].textContent);
    const parts=block.split(/(?<=[.!?])\s+|\n+/).map(clean).filter(Boolean);
    const sentence=parts.find(part=>containsWord(part,word))||block;
    return{sentence,block};
  }

  function tokens(text){
    return (plain(text).match(/[a-z0-9]+/g)||[]).filter(t=>t.length>2&&!STOP.has(t));
  }

  function dicioSlug(word){
    return plain(norm(word)).replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
  }

  function dicioUrl(word){
    return 'https://www.dicio.com.br/'+encodeURIComponent(dicioSlug(word))+'/';
  }

  function readerUrl(word){
    return 'https://r.jina.ai/'+dicioUrl(word);
  }

  function stripGrammar(text){
    return clean(text)
      .replace(/^(substantivo|adjetivo|advérbio|adverbio|verbo|pronome|preposição|preposicao|conjunção|conjuncao|interjeição|interjeicao|numeral|artigo)(\s+[a-záéíóúâêôãõç-]+){0,6}\s+/i,'')
      .replace(/^\[[^\]]+\]\s*/,'')
      .trim();
  }

  function splitDefinitionLine(line){
    let text=stripGrammar(line);
    if(!text)return[];
    text=text.replace(/\.(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ\[])/g,'.|').replace(/\](?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/g,']|');
    return text.split('|').map(part=>stripGrammar(part)).map(part=>part.replace(/^\[[^\]]+\]\s*/,'').trim()).filter(part=>part.length>3);
  }

  function parseDefinitions(text,word){
    const lines=String(text||'').replace(/\r/g,'').split('\n').map(line=>clean(line.replace(/^#+\s*/,''))).filter(Boolean);
    const defs=[];
    let started=false;
    const heading='significado de '+plain(norm(word));
    for(const raw of lines){
      const line=clean(raw),p=plain(line);
      if(!started&&p.startsWith('significado de ')){
        if(p===heading||p.includes(plain(norm(word))))started=true;
        continue;
      }
      if(!started)continue;
      if(/^(sinônimos|sinonimos|antônimos|antonimos|definição de|definicao de|frases com|exemplos com|outras informações|outras informacoes|rimas com|anagramas|etimologia)/i.test(line))break;
      if(/^Fonte:/i.test(line)||/^Usando\s+/i.test(line))continue;
      splitDefinitionLine(line).forEach(def=>{
        if(!/^(classe gramatical|separação silábica|separacao silabica|plural:|etimologia)/i.test(def))defs.push(def);
      });
    }
    return [...new Set(defs)].slice(0,20);
  }

  function score(def,ctx){
    const a=new Set(tokens(def)),b=tokens((ctx?.sentence||'')+' '+(ctx?.block||''));
    let total=0;
    b.forEach(t=>{if(a.has(t))total+=3;});
    return total;
  }

  function choose(defs,ctx){
    if(!defs.length)return'';
    return defs.map((def,i)=>({def,i,s:score(def,ctx)})).sort((a,b)=>b.s-a.s||a.i-b.i)[0].def;
  }

  function childify(word,def,ctx){
    const w=plain(norm(word));
    const hay=plain((ctx?.sentence||'')+' '+(ctx?.block||''));
    if(w==='rotina'&&/(dia|diario|diaria|sempre|horario|atividade|tarefa|escola|trabalho|casa)/.test(hay)){
      return 'No texto, “'+word+'” significa uma sequência de coisas que a pessoa costuma fazer no dia a dia, normalmente de um jeito parecido ou nos mesmos horários.';
    }
    let s=clean(def)
      .replace(/\bato ou efeito de\b/gi,'ação de')
      .replace(/\brelativo a\b/gi,'ligado a')
      .replace(/\bque diz respeito a\b/gi,'ligado a')
      .replace(/\bhabitualmente\b/gi,'normalmente')
      .replace(/\bquotidiano\b/gi,'dia a dia')
      .replace(/\bcotidiano\b/gi,'dia a dia')
      .replace(/\bindivíduo\b/gi,'pessoa')
      .replace(/\bvocábulo\b/gi,'palavra')
      .replace(/\bprocedimentos\b/gi,'atividades ou maneiras de fazer algo')
      .replace(/\bcostumes habituais\b/gi,'hábitos que se repetem');
    if(s.length>220)s=s.slice(0,220).replace(/\s+\S*$/,'')+'...';
    if(!/[.!?]$/.test(s))s+='.';
    return 'No texto, “'+word+'” quer dizer: '+s.charAt(0).toLocaleLowerCase('pt-BR')+s.slice(1);
  }

  function tipFor(word,ctx){
    if(plain(norm(word))==='rotina')return 'Pense nas coisas que costumam se repetir todos os dias, como acordar, ir à escola, estudar, brincar e dormir.';
    if(ctx?.sentence)return 'Leia o trecho novamente e troque a palavra “'+word+'” pela explicação acima. Se a frase continuar com a mesma ideia, esse é o sentido usado no texto.';
    return 'O Dicio pode mostrar mais de um significado. Quando a palavra aparecer numa lição, observe as palavras ao redor dela para descobrir qual sentido combina melhor.';
  }

  async function dicioDefinitions(word){
    const key=norm(word),cacheKey=CACHE+key;
    try{
      const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');
      if(cached&&Array.isArray(cached.defs)&&cached.defs.length)return cached.defs;
    }catch(error){}
    let defs=[];
    try{
      const response=await fetch(readerUrl(key),{cache:'no-store'});
      if(response.ok)defs=parseDefinitions(await response.text(),key);
    }catch(error){}
    try{if(defs.length)localStorage.setItem(cacheKey,JSON.stringify({defs,at:Date.now()}))}catch(error){}
    return defs;
  }

  function addStyles(){
    if(document.getElementById('v62DicioStyle'))return;
    const style=document.createElement('style');
    style.id='v62DicioStyle';
    style.textContent=`
      .v62Source{margin-top:12px;padding-top:12px;border-top:1px solid #e7e9ee;font-size:12px;color:#6b7280;line-height:1.5}
      .v62DicioLink{display:inline-flex;align-items:center;justify-content:center;margin-top:9px;min-height:40px;padding:0 14px;border-radius:12px;border:1px solid #d8dbe5;background:#fff;color:#4b3aa8;font-weight:800;text-decoration:none}
      .v62Fail{line-height:1.6;color:#4b5563}
    `;
    document.head.appendChild(style);
  }

  function patch(){
    addStyles();
    const overlay=document.querySelector('.v55Ov'),fab=document.querySelector('.v55Fab');
    if(!overlay||!fab){setTimeout(patch,180);return;}
    if(overlay.dataset.v62==='1')return;
    overlay.dataset.v62='1';

    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra da lição. O aplicativo usa o Dicio como referência e explica o sentido de forma simples, considerando o texto.';
    overlay.querySelector('.v55Words')?.remove();

    const oldInput=overlay.querySelector('.v55In'),oldSearch=overlay.querySelector('.v55Go'),result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;
    const input=oldInput.cloneNode(true),search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);oldSearch.replaceWith(search);input.value='';result.innerHTML='';

    async function run(){
      const typed=clean(input.value),word=norm(typed);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      const ctx=contextFor(word),url=dicioUrl(word);
      result.innerHTML='<div class="v55Card">Consultando o Dicio e verificando o sentido usado na lição...</div>';
      const defs=await dicioDefinitions(word);
      if(!defs.length){
        result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p class="v62Fail">Não consegui carregar a definição do Dicio agora. Você pode abrir a página da palavra no Dicio para consultar.</p><a class="v62DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Consultar no Dicio</a></div>`;
        return;
      }
      const chosen=choose(defs,ctx),meaning=childify(typed||word,chosen,ctx),tip=tipFor(typed||word,ctx);
      const contextBox=ctx.sentence?`<div class="v59Context"><strong>Trecho da lição</strong>${esc(ctx.sentence)}</div>`:'';
      result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p class="v59Meaning">${esc(meaning)}</p>${contextBox}<div class="v59Tip"><strong>Pense assim</strong>${esc(tip)}</div><div class="v62Source">Referência de significado: Dicio, Dicionário Online de Português.<br>A explicação foi simplificada para facilitar o entendimento do aluno e relacionada ao contexto da lição.</div><a class="v62DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Ver no Dicio</a></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
    const newFab=fab.cloneNode(true);fab.replaceWith(newFab);
    newFab.addEventListener('click',()=>{input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),50);});
  }

  const init=()=>setTimeout(patch,180);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();