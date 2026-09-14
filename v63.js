/* Lousa de Estudos, versão 63 */
(()=>{
  if(window.__lousaV63)return;
  window.__lousaV63=true;

  const CACHE='lousa:v63:dicio:';
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
    const wanted=plain(norm(word));
    for(const raw of lines){
      const line=clean(raw),p=plain(line);
      if(!started&&p.startsWith('significado de ')){
        if(p.includes(wanted))started=true;
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

  function exactExcerpt(def){
    const words=clean(def).split(/\s+/).filter(Boolean);
    if(words.length<=24)return clean(def);
    return words.slice(0,24).join(' ')+'…';
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
    if(document.getElementById('v63Style'))return;
    const style=document.createElement('style');
    style.id='v63Style';
    style.textContent=`
      .v63Exact{margin-top:10px;padding:14px 15px;border-radius:15px;background:#faf8ff;border:1px solid #e5def7;color:#312b43;line-height:1.62;font-size:16px}
      .v63Exact strong{display:block;margin-bottom:5px;color:#5f2bd1;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
      .v63Source{margin-top:10px;font-size:11px;color:#6b7280;line-height:1.45}
      .v63DicioLink{display:inline-flex;align-items:center;justify-content:center;margin-top:8px;min-height:36px;padding:0 12px;border-radius:11px;border:1px solid #d8dbe5;background:#fff;color:#4b3aa8;font-weight:800;text-decoration:none;font-size:12px}
      body.v27InitialPage .v55Fab{display:none!important}
      body.v27InitialPage .footer.v63Footer{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;margin:18px auto 0!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;max-width:360px!important}
      .v63Footer>div:first-child,.v63Footer>#finishBtn{display:none!important}
      .v63Tools{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
      .v63MiniCard{min-height:38px;border:1px solid #dde6e0;border-radius:13px;background:#fff;color:#435149;font-weight:850;font-size:11.5px;padding:0 12px;box-shadow:0 4px 12px rgba(30,50,38,.05);display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
      .v63MiniCard.reset{color:#8a3030;background:#fffafa;border-color:#efdcdc}
      .v63MiniCard.dict{color:#5f2bd1;background:#fbf9ff;border-color:#e5def7}
      @media(max-width:520px){body.v27InitialPage .footer.v63Footer{max-width:300px!important}.v63MiniCard{font-size:10.8px;min-height:36px;padding:0 9px}}
    `;
    document.head.appendChild(style);
  }

  function patchDictionary(){
    const overlay=document.querySelector('.v55Ov'),fab=document.querySelector('.v55Fab');
    if(!overlay||!fab){setTimeout(patchDictionary,180);return;}
    if(overlay.dataset.v63==='1')return;
    overlay.dataset.v63='1';
    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra da lição. O aplicativo consulta o Dicio e escolhe o significado que combina com o texto.';
    const oldInput=overlay.querySelector('.v55In'),oldSearch=overlay.querySelector('.v55Go'),result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;
    const input=oldInput.cloneNode(true),search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);oldSearch.replaceWith(search);input.value='';result.innerHTML='';

    async function run(){
      const typed=clean(input.value),word=norm(typed);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      const ctx=contextFor(word),url=dicioUrl(word);
      result.innerHTML='<div class="v55Card">Consultando o Dicio e procurando o significado usado nesta lição...</div>';
      const defs=await dicioDefinitions(word);
      if(!defs.length){
        result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p>Não consegui carregar a definição agora.</p><a class="v63DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Abrir no Dicio</a></div>`;
        return;
      }
      const chosen=choose(defs,ctx),quote=exactExcerpt(chosen);
      const contextBox=ctx.sentence?`<div class="v59Context"><strong>Trecho da lição</strong>${esc(ctx.sentence)}</div>`:'';
      result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><div class="v63Exact"><strong>Definição do Dicio</strong>${esc(quote)}</div>${contextBox}<div class="v63Source">Trecho literal da definição selecionada no Dicio de acordo com o contexto da lição. Quando a definição completa for maior, o aplicativo mostra apenas um trecho curto.</div><a class="v63DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Ver definição completa no Dicio</a></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
    const newFab=fab.cloneNode(true);fab.replaceWith(newFab);
    newFab.addEventListener('click',()=>{input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),50);});
  }

  function compactFooter(){
    const footer=document.querySelector('.footer'),reset=document.getElementById('v26ResetBtn'),fab=document.querySelector('.v55Fab');
    if(!footer||!reset||!fab){setTimeout(compactFooter,220);return;}
    if(footer.dataset.v63==='1')return;
    footer.dataset.v63='1';footer.classList.add('v63Footer');
    const tools=document.createElement('div');tools.className='v63Tools';
    reset.textContent='↺ Zerar lições';reset.className='v63MiniCard reset';
    const dict=document.createElement('button');dict.type='button';dict.className='v63MiniCard dict';dict.innerHTML='📚 Dicionário';
    dict.addEventListener('click',()=>document.querySelector('.v55Fab')?.click());
    tools.append(reset,dict);footer.appendChild(tools);
  }

  function init(){addStyles();setTimeout(patchDictionary,160);setTimeout(compactFooter,240)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();