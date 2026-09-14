/* Lousa de Estudos, versão 64 */
(()=>{
  if(window.__lousaV64)return;
  window.__lousaV64=true;

  const CACHE='lousa:v64:dicio:';
  const norm=v=>String(v||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function dicioSlug(word){
    return plain(norm(word)).replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
  }

  function dicioUrl(word){
    return 'https://www.dicio.com.br/'+encodeURIComponent(dicioSlug(word))+'/';
  }

  function readerUrl(word){
    return 'https://r.jina.ai/'+dicioUrl(word);
  }

  function parseDicio(text,word){
    const lines=String(text||'').replace(/\r/g,'').split('\n').map(line=>clean(line.replace(/^#+\s*/,''))).filter(Boolean);
    let grammar='';
    for(const line of lines){
      const m=line.match(/^Classe gramatical:\s*(.+)$/i);
      if(m){grammar=clean(m[1]);break;}
    }

    const wanted='significado de '+plain(norm(word));
    let start=-1;
    for(let i=0;i<lines.length;i++){
      const p=plain(lines[i]);
      if(p.startsWith('significado de ')&&(p===wanted||p.includes(plain(norm(word))))){start=i+1;break;}
    }
    if(start<0)return{grammar,defs:[]};

    let body='';
    for(let i=start;i<lines.length;i++){
      const line=lines[i];
      if(/^(Sinônimos|Sinonimos|Definição de|Definicao de|Frases com|Exemplos com|Outras informações|Outras informacoes|Rimas com|Anagramas)/i.test(line))break;
      if(/^Usando\s+/i.test(line))break;
      body+=(body?' ':'')+line;
      if(/Etimologia\s*\(/i.test(line))break;
    }

    body=body.replace(/Etimologia\s*\(.*$/i,'').trim();
    if(grammar){
      const g=grammar.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      body=body.replace(new RegExp('^'+g+'\\s+','i'),'');
    }else{
      const gm=body.match(/^(substantivo(?:\s+(?:masculino|feminino|de dois gêneros|de dois generos))?|adjetivo|advérbio|adverbio|verbo(?:\s+(?:transitivo|intransitivo|pronominal|impessoal|auxiliar|de ligação|de ligacao|transitivo direto|transitivo indireto)){0,2}|pronome|preposição|preposicao|conjunção|conjuncao|interjeição|interjeicao|numeral|artigo)\s+/i);
      if(gm){grammar=clean(gm[1]);body=body.slice(gm[0].length);}
    }

    body=body.replace(/\.(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ\[])/g,'.|');
    const defs=body.split('|').map(clean).map(d=>d.replace(/^\[[^\]]+\]\s*/,'').trim()).filter(d=>d.length>3).slice(0,2);
    return{grammar,defs};
  }

  async function dicioEntry(word){
    const key=norm(word),cacheKey=CACHE+key;
    try{
      const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');
      if(cached&&Array.isArray(cached.defs)&&cached.defs.length)return cached;
    }catch(error){}
    let entry={grammar:'',defs:[]};
    try{
      const response=await fetch(readerUrl(key),{cache:'no-store'});
      if(response.ok)entry=parseDicio(await response.text(),key);
    }catch(error){}
    try{if(entry.defs.length)localStorage.setItem(cacheKey,JSON.stringify({...entry,at:Date.now()}))}catch(error){}
    return entry;
  }

  function addStyles(){
    if(document.getElementById('v64Style'))return;
    const style=document.createElement('style');
    style.id='v64Style';
    style.textContent=`
      .v57Calligraphy .answerCanvas{
        background-color:#fffdf8!important;
        background-image:repeating-linear-gradient(to bottom,
          transparent 0,transparent 27px,
          rgba(56,105,157,.58) 27px,rgba(56,105,157,.58) 28px,
          transparent 28px,transparent 41px,
          rgba(82,133,183,.22) 41px,rgba(82,133,183,.22) 42px)!important;
        background-size:100% 42px!important;
        background-repeat:repeat!important;
      }
      .v64Title{margin:0 0 14px;font-size:24px;line-height:1.2;color:#20242a}
      .v64Grammar{margin:0 0 16px;color:#6b7280;font-size:17px;line-height:1.4}
      .v64Def{padding:14px 0;border-top:1px solid #eceef1;color:#2b2f36;font-size:17px;line-height:1.65}
      .v64Def:first-of-type{border-top:0;padding-top:0}
      .v64Num{font-weight:900;color:#5f2bd1;margin-right:7px}
      .v64Source{margin-top:12px;padding-top:10px;border-top:1px solid #eceef1;color:#7b818a;font-size:10.5px;line-height:1.45}
      .v64DicioLink{display:inline-flex;align-items:center;justify-content:center;margin-top:8px;min-height:35px;padding:0 12px;border-radius:10px;border:1px solid #d8dbe5;background:#fff;color:#4b3aa8;font-weight:800;text-decoration:none;font-size:11px}
    `;
    document.head.appendChild(style);
  }

  function patchDictionary(){
    const overlay=document.querySelector('.v55Ov'),fab=document.querySelector('.v55Fab');
    if(!overlay||!fab){setTimeout(patchDictionary,180);return;}
    if(overlay.dataset.v64==='1')return;
    overlay.dataset.v64='1';

    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra para ver os dois primeiros significados no Dicio.';
    const oldInput=overlay.querySelector('.v55In'),oldSearch=overlay.querySelector('.v55Go'),result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;
    const input=oldInput.cloneNode(true),search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);oldSearch.replaceWith(search);input.value='';result.innerHTML='';

    async function run(){
      const typed=clean(input.value),word=norm(typed);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      const url=dicioUrl(word);
      result.innerHTML='<div class="v55Card">Consultando o Dicio...</div>';
      const entry=await dicioEntry(word);
      if(!entry.defs.length){
        result.innerHTML=`<div class="v55Card"><h4 class="v64Title">Significado de ${esc(typed||word)}</h4><p>Não consegui carregar os significados agora.</p><a class="v64DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Abrir no Dicio</a></div>`;
        return;
      }
      const defs=entry.defs.map((def,i)=>`<div class="v64Def"><span class="v64Num">${i+1}.</span>${esc(def)}</div>`).join('');
      result.innerHTML=`<div class="v55Card"><h4 class="v64Title">Significado de ${esc(typed||word)}</h4>${entry.grammar?`<div class="v64Grammar">${esc(entry.grammar)}</div>`:''}${defs}<div class="v64Source">Fonte: Dicio, Dicionário Online de Português.</div><a class="v64DicioLink" href="${esc(url)}" target="_blank" rel="noopener">Ver no Dicio</a></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
    const newFab=fab.cloneNode(true);fab.replaceWith(newFab);
    newFab.addEventListener('click',()=>{input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),50);});
  }

  function init(){addStyles();setTimeout(patchDictionary,220)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();