/* Lousa de Estudos, versão 60 */
(()=>{
  if(window.__lousaV60)return;
  window.__lousaV60=true;

  const CACHE='lousa:v60:michaelis:';
  const norm=v=>String(v||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const STOP=new Set('a o as os um uma uns umas de da do das dos em no na nos nas por para com sem e ou mas que se como qual quais quem onde quando porque é são foi foram ser estar está estão ao aos à às seu sua seus suas ele ela eles elas isso isto esse essa este esta muito muita muitos muitas mais menos já ainda também até entre sobre cada todo toda todos todas'.split(/\s+/));

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

  function michaelisUrl(word){
    return 'https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/'+encodeURIComponent(norm(word));
  }

  function readerUrl(word){
    return 'https://r.jina.ai/'+michaelisUrl(word);
  }

  function parseDefinitions(text,word){
    const lines=String(text||'').replace(/\r/g,'').split('\n').map(line=>clean(line.replace(/^#+\s*/,''))).filter(Boolean);
    const defs=[];
    let started=false;
    const wanted=plain(norm(word));
    for(const line of lines){
      const p=plain(line);
      if(!started&&p===wanted){started=true;continue;}
      if(!started)continue;
      if(/^(EXPRESSÕES|ETIMOLOGIA|Topo\b|©)/i.test(line))break;
      const m=line.match(/^\s*(\d{1,2})[.)]?\s+(.{4,})$/);
      if(m){
        let d=clean(m[2]).replace(/\s*[“"].*[”"]\s*$/,'').trim();
        if(d&&!/^(Português Brasileiro|Inglês|Espanhol|Francês|Alemão|Italiano)$/i.test(d))defs.push(d);
      }
    }
    return [...new Set(defs)].slice(0,18);
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
      return 'No texto, “'+word+'” significa o conjunto de coisas que uma pessoa costuma fazer regularmente, muitas vezes nos mesmos horários ou na mesma ordem.';
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
      .replace(/\binveterado\b/gi,'muito difícil de mudar')
      .replace(/\bmaquinal(?:mente)?\b/gi,'quase sem pensar')
      .replace(/\bpor extensão\b/gi,'em outro uso');
    if(s.length>210)s=s.slice(0,210).replace(/\s+\S*$/,'')+'...';
    if(!/[.!?]$/.test(s))s+='.';
    return 'No texto, “'+word+'” quer dizer: '+s.charAt(0).toLocaleLowerCase('pt-BR')+s.slice(1);
  }

  function tipFor(word,ctx){
    if(plain(norm(word))==='rotina')return 'Pense nas coisas que se repetem no dia a dia, como acordar, ir à escola, estudar, brincar e dormir.';
    if(ctx?.sentence)return 'Leia o trecho novamente e troque a palavra “'+word+'” pela explicação acima. Se a frase continuar com a mesma ideia, esse é o sentido usado no texto.';
    return 'O Michaelis pode trazer mais de um significado. Quando a palavra aparecer em uma lição, observe as palavras que estão perto dela para descobrir qual sentido combina melhor.';
  }

  async function michaelisDefinitions(word){
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
    if(document.getElementById('v60MichaelisStyle'))return;
    const style=document.createElement('style');
    style.id='v60MichaelisStyle';
    style.textContent=`
      .v60Source{margin-top:12px;padding-top:12px;border-top:1px solid #e7e9ee;font-size:12px;color:#6b7280;line-height:1.5}
      .v60MichaelisLink{display:inline-flex;align-items:center;justify-content:center;margin-top:9px;min-height:40px;padding:0 14px;border-radius:12px;border:1px solid #d8dbe5;background:#fff;color:#4b3aa8;font-weight:800;text-decoration:none}
      .v60Fail{line-height:1.6;color:#4b5563}
    `;
    document.head.appendChild(style);
  }

  function patch(){
    addStyles();
    const overlay=document.querySelector('.v55Ov'),fab=document.querySelector('.v55Fab');
    if(!overlay||!fab){setTimeout(patch,180);return;}
    if(overlay.dataset.v60==='1')return;
    overlay.dataset.v60='1';

    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra da lição. O aplicativo consulta o Michaelis e explica o sentido de forma simples, considerando o texto.';
    overlay.querySelector('.v55Words')?.remove();

    const oldInput=overlay.querySelector('.v55In'),oldSearch=overlay.querySelector('.v55Go'),result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;
    const input=oldInput.cloneNode(true),search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);oldSearch.replaceWith(search);input.value='';result.innerHTML='';

    async function run(){
      const typed=clean(input.value),word=norm(typed);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      const ctx=contextFor(word),url=michaelisUrl(word);
      result.innerHTML='<div class="v55Card">Consultando o Michaelis e verificando o sentido usado na lição...</div>';
      const defs=await michaelisDefinitions(word);
      if(!defs.length){
        result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p class="v60Fail">Não consegui carregar a definição do Michaelis agora. Você pode abrir a busca oficial para consultar esta palavra.</p><a class="v60MichaelisLink" href="${esc(url)}" target="_blank" rel="noopener">Consultar no Michaelis</a></div>`;
        return;
      }
      const chosen=choose(defs,ctx),meaning=childify(typed||word,chosen,ctx),tip=tipFor(typed||word,ctx);
      const contextBox=ctx.sentence?`<div class="v59Context"><strong>Trecho da lição</strong>${esc(ctx.sentence)}</div>`:'';
      result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p class="v59Meaning">${esc(meaning)}</p>${contextBox}<div class="v59Tip"><strong>Pense assim</strong>${esc(tip)}</div><div class="v60Source">Referência de significado: Michaelis Dicionário Brasileiro da Língua Portuguesa.<br>A explicação acima foi simplificada para facilitar o entendimento do aluno.</div><a class="v60MichaelisLink" href="${esc(url)}" target="_blank" rel="noopener">Ver no Michaelis</a></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
    const newFab=fab.cloneNode(true);fab.replaceWith(newFab);
    newFab.addEventListener('click',()=>{input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),50);});
  }

  const init=()=>setTimeout(patch,160);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
