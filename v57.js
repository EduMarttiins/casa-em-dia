/* Lousa de Estudos, versão 57 */
(()=>{
  if(window.__lousaV57)return;
  window.__lousaV57=true;

  const CACHE_KEY='lousa:v57:dict:';
  const COMMON={
    a:'Artigo feminino usado antes de uma palavra, como em “a menina”. Também pode aparecer como preposição em algumas expressões.',
    o:'Artigo masculino usado antes de uma palavra, como em “o menino”.',
    as:'Forma plural do artigo feminino “a”, usada antes de palavras femininas no plural.',
    os:'Forma plural do artigo masculino “o”, usada antes de palavras masculinas no plural.',
    um:'Palavra usada antes de um nome masculino quando falamos de algo de maneira não específica.',
    uma:'Palavra usada antes de um nome feminino quando falamos de algo de maneira não específica.',
    uns:'Plural de “um”. Indica alguns elementos masculinos sem dizer exatamente quais.',
    umas:'Plural de “uma”. Indica alguns elementos femininos sem dizer exatamente quais.',
    e:'Palavra usada para ligar palavras, ideias ou ações.',
    ou:'Palavra usada para apresentar uma escolha ou possibilidade.',
    mas:'Palavra usada para mostrar contraste ou oposição entre duas ideias.',
    de:'Palavra que liga outras palavras e pode indicar origem, assunto, posse, material ou relação.',
    do:'Junção de “de” com “o”.',
    da:'Junção de “de” com “a”.',
    dos:'Junção de “de” com “os”.',
    das:'Junção de “de” com “as”.',
    em:'Palavra que pode indicar lugar, tempo, situação ou modo.',
    no:'Junção de “em” com “o”.',
    na:'Junção de “em” com “a”.',
    nos:'Junção de “em” com “os”.',
    nas:'Junção de “em” com “as”.',
    para:'Palavra que pode indicar destino, objetivo ou finalidade.',
    por:'Palavra que pode indicar causa, motivo, passagem, meio ou autoria.',
    com:'Palavra que pode indicar companhia, instrumento, modo ou relação.',
    sem:'Palavra usada para indicar ausência ou falta de alguma coisa.',
    que:'Palavra que pode ligar partes de uma frase, retomar uma ideia ou aparecer em perguntas.',
    se:'Palavra que pode indicar uma condição ou possibilidade.',
    como:'Palavra que pode indicar comparação, maneira ou modo de fazer alguma coisa.',
    qual:'Palavra usada para perguntar ou identificar alguma coisa.',
    quais:'Plural de “qual”. É usada para perguntar ou identificar mais de uma coisa.',
    quando:'Palavra relacionada ao tempo ou ao momento em que algo acontece.',
    onde:'Palavra usada para indicar ou perguntar sobre um lugar.',
    quem:'Palavra usada para indicar ou perguntar sobre uma pessoa.',
    porque:'Palavra usada para apresentar uma causa, um motivo ou uma explicação.',
    'por que':'Expressão usada em perguntas para descobrir a causa ou o motivo de alguma coisa.',
    mais:'Palavra que pode indicar maior quantidade, intensidade ou acréscimo.',
    menos:'Palavra que pode indicar menor quantidade, intensidade ou redução.',
    muito:'Palavra que indica grande quantidade ou intensidade.',
    muita:'Forma feminina de “muito”. Indica grande quantidade ou intensidade.',
    muitos:'Plural masculino de “muito”. Indica grande quantidade.',
    muitas:'Plural feminino de “muito”. Indica grande quantidade.',
    todo:'Palavra que indica a totalidade de alguma coisa.',
    toda:'Forma feminina de “todo”. Indica a totalidade de alguma coisa.',
    todos:'Plural de “todo”. Indica a totalidade de um grupo.',
    todas:'Plural feminino de “todo”. Indica a totalidade de um grupo.',
    cada:'Palavra usada para falar separadamente de todos os elementos de um grupo.',
    seu:'Palavra que pode indicar posse ou relação com alguém.',
    sua:'Forma feminina de “seu”. Pode indicar posse ou relação com alguém.',
    ele:'Pronome usado para falar de uma pessoa, animal ou elemento masculino já mencionado.',
    ela:'Pronome usado para falar de uma pessoa, animal ou elemento feminino já mencionado.',
    eles:'Plural de “ele”.',
    elas:'Plural de “ela”.',
    isso:'Palavra usada para apontar ou retomar uma ideia ou coisa já mencionada.',
    isto:'Palavra usada para apontar algo próximo ou uma ideia que será apresentada.',
    esse:'Palavra usada para indicar algo masculino já mencionado ou próximo de quem escuta.',
    essa:'Forma feminina de “esse”.',
    este:'Palavra usada para indicar algo masculino próximo de quem fala.',
    esta:'Forma feminina de “este”.',
    ao:'Junção de “a” com “o”.',
    aos:'Junção de “a” com “os”.',
    'à':'Junção da preposição “a” com o artigo feminino “a”.',
    'às':'Junção da preposição “a” com o artigo feminino plural “as”.',
    já:'Palavra que pode indicar que algo aconteceu antes deste momento ou que ocorreu imediatamente.',
    ainda:'Palavra que pode indicar continuidade, algo que permanece acontecendo ou algo que não terminou.',
    antes:'Palavra que indica um momento anterior.',
    depois:'Palavra que indica um momento posterior.',
    entre:'Palavra que pode indicar posição no meio de duas ou mais coisas.',
    sobre:'Palavra que pode indicar posição acima de algo ou o assunto de que se fala.',
    até:'Palavra que pode indicar limite de lugar, tempo, quantidade ou intensidade.',
    também:'Palavra usada para acrescentar uma informação semelhante à anterior.',
    aspecto:'Característica, parte ou maneira de observar alguma coisa.',
    conflito:'Problema ou dificuldade principal que faz os acontecimentos de uma história avançarem.',
    inferência:'Conclusão que fazemos ao juntar pistas de um texto com aquilo que já sabemos.',
    explícita:'Algo que está dito ou mostrado de forma clara e direta.',
    principal:'Aquilo que é mais importante ou central.',
    concluir:'Chegar a uma ideia ou resposta depois de observar informações e pensar sobre elas.',
    explique:'Pedido para deixar uma ideia clara, dizendo como ou por que alguma coisa acontece.',
    compare:'Pedido para observar o que é parecido e o que é diferente entre duas ou mais coisas.',
    calcule:'Pedido para fazer uma conta e descobrir um resultado.',
    práticas:'Coisas feitas de maneira útil, simples ou adequada para uma situação. O sentido exato depende da frase.',
    tripulados:'Que levam pessoas a bordo, como uma nave espacial com astronautas.',
    bingo:'Expressão usada para mostrar que algo deu certo ou que uma resposta foi encontrada.',
    ganância:'Desejo exagerado de ter cada vez mais dinheiro, riqueza ou vantagens.',
    prosperidade:'Situação de crescimento, bem estar e bons resultados, especialmente na vida material.',
    camponês:'Pessoa que vive ou trabalha no campo, geralmente ligada à agricultura.',
    gansa:'Fêmea do ganso, uma ave parecida com o pato, geralmente maior.',
    desfecho:'Parte final de uma história, quando os acontecimentos chegam a uma conclusão.',
    personagem:'Pessoa, animal ou ser que participa dos acontecimentos de uma história.',
    desigualdade:'Diferença injusta nas condições, oportunidades ou recursos entre pessoas ou grupos.',
    socioeconômica:'Relacionada ao mesmo tempo à sociedade e às condições econômicas das pessoas.',
    saneamento:'Conjunto de serviços que ajudam a proteger a saúde, como água tratada, coleta de esgoto e lixo.',
    astronauta:'Pessoa treinada para viajar ou trabalhar no espaço.',
    alimento:'Aquilo que uma pessoa ou animal come ou bebe para obter nutrientes e energia.',
    alimentação:'Ato ou modo de se alimentar e o conjunto de alimentos consumidos.',
    tecnologia:'Conjunto de conhecimentos, técnicas e ferramentas criados para resolver problemas ou facilitar tarefas.'
  };

  const norm=value=>String(value||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clean=value=>String(value||'').replace(/\s+/g,' ').replace(/\[[^\]]*\]/g,'').trim();

  function currentSubject(){
    try{return typeof currentSubjectKey==='string'?currentSubjectKey:''}catch(error){return''}
  }

  function installWritingStyle(){
    if(document.getElementById('v57WritingStyle'))return;
    const style=document.createElement('style');
    style.id='v57WritingStyle';
    style.textContent=`
      .v57Calligraphy .answerCanvas{
        background-color:#fffdf8!important;
        background-image:repeating-linear-gradient(to bottom,
          transparent 0,transparent 13px,
          rgba(82,133,183,.22) 13px,rgba(82,133,183,.22) 14px,
          transparent 14px,transparent 27px,
          rgba(56,105,157,.58) 27px,rgba(56,105,157,.58) 28px,
          transparent 28px,transparent 41px,
          rgba(82,133,183,.22) 41px,rgba(82,133,183,.22) 42px)!important;
        background-size:100% 42px!important;
        background-repeat:repeat!important;
      }
      .v57Whiteboard .answerCanvas{background:#fff!important;background-image:none!important}
    `;
    document.head.appendChild(style);
  }

  function patchWritingBoards(){
    installWritingStyle();
    const subject=currentSubject();
    document.querySelectorAll('.answerCanvas').forEach(canvas=>{
      const holder=canvas.closest('.board,.scratchCard')||canvas.parentElement;
      if(!holder)return;
      holder.classList.remove('v57Calligraphy','v57Whiteboard');
      if(subject==='math')holder.classList.add('v57Whiteboard');
      else holder.classList.add('v57Calligraphy');
    });
  }

  const lessonWords=new Set();
  function collectWords(value){
    if(value==null)return;
    if(typeof value==='string'){
      (value.match(/[A-Za-zÀ-ÖØ-öø-ÿ]+(?:-[A-Za-zÀ-ÖØ-öø-ÿ]+)?/g)||[]).forEach(word=>lessonWords.add(norm(word)));
      return;
    }
    if(Array.isArray(value)){value.forEach(collectWords);return;}
    if(typeof value==='object')Object.values(value).forEach(collectWords);
  }
  try{if(typeof subjects==='object')collectWords(subjects)}catch(error){}

  function localMeaning(word){
    const key=norm(word);
    if(COMMON[key])return COMMON[key];
    const target=plain(key);
    const found=Object.keys(COMMON).find(item=>plain(item)===target);
    return found?COMMON[found]:null;
  }

  function xmlDefinition(xml){
    if(!xml)return null;
    try{
      const doc=new DOMParser().parseFromString(xml,'text/xml');
      const defs=[...doc.querySelectorAll('def')].map(node=>clean(node.textContent)).filter(Boolean);
      if(defs.length)return defs.slice(0,2).join(' ');
    }catch(error){}
    const stripped=clean(String(xml).replace(/<[^>]+>/g,' '));
    return stripped||null;
  }

  async function dicionarioAberto(word){
    const response=await fetch('https://api.dicionario-aberto.net/word/'+encodeURIComponent(word),{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    if(!Array.isArray(data)||!data.length)return null;
    for(const entry of data){
      const definition=xmlDefinition(entry?.xml);
      if(definition)return definition;
    }
    return null;
  }

  async function wiktionaryExtract(title){
    const url='https://pt.wiktionary.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&titles='+encodeURIComponent(title);
    const response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    const page=Object.values(data?.query?.pages||{}).find(item=>!item.missing);
    let text=clean(page?.extract||'');
    if(!text)return null;
    if(text.length>380)text=text.slice(0,380).replace(/\s+\S*$/,'')+'...';
    return text;
  }

  async function wiktionarySearch(word){
    const direct=await wiktionaryExtract(word);
    if(direct)return direct;
    const url='https://pt.wiktionary.org/w/api.php?action=opensearch&format=json&origin=*&namespace=0&limit=5&search='+encodeURIComponent(word);
    const response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    const titles=Array.isArray(data?.[1])?data[1]:[];
    const base=plain(word);
    const candidate=titles.find(title=>{
      const p=plain(title);
      return p===base||p.startsWith(base.slice(0,Math.min(4,base.length)))||base.startsWith(p.slice(0,Math.min(4,p.length)));
    });
    return candidate?wiktionaryExtract(candidate):null;
  }

  function lemmaCandidates(word){
    const w=norm(word),out=[];
    const add=v=>{if(v&&v!==w&&v.length>1&&!out.includes(v))out.push(v)};
    if(/ões$/i.test(w))add(w.replace(/ões$/i,'ão'));
    if(/ães$/i.test(w))add(w.replace(/ães$/i,'ão'));
    if(/ais$/i.test(w))add(w.replace(/ais$/i,'al'));
    if(/eis$/i.test(w))add(w.replace(/eis$/i,'el'));
    if(/ns$/i.test(w))add(w.replace(/ns$/i,'m'));
    if(/ando$/i.test(w))add(w.replace(/ando$/i,'ar'));
    if(/endo$/i.test(w))add(w.replace(/endo$/i,'er'));
    if(/indo$/i.test(w))add(w.replace(/indo$/i,'ir'));
    if(/ados?$/i.test(w))add(w.replace(/ados?$/i,'ar'));
    if(/adas?$/i.test(w))add(w.replace(/adas?$/i,'ar'));
    if(/idos?$/i.test(w)){add(w.replace(/idos?$/i,'ir'));add(w.replace(/idos?$/i,'er'));}
    if(/idas?$/i.test(w)){add(w.replace(/idas?$/i,'ir'));add(w.replace(/idas?$/i,'er'));}
    if(/mente$/i.test(w))add(w.replace(/mente$/i,''));
    if(/es$/i.test(w))add(w.replace(/es$/i,''));
    if(/s$/i.test(w))add(w.replace(/s$/i,''));
    return out.slice(0,6);
  }

  async function lookup(word){
    const key=norm(word);
    const local=localMeaning(key);
    if(local)return local;
    try{
      const cached=localStorage.getItem(CACHE_KEY+key);
      if(cached)return cached;
    }catch(error){}

    let meaning=null;
    try{meaning=await dicionarioAberto(key)}catch(error){}
    if(!meaning){try{meaning=await wiktionarySearch(key)}catch(error){}}

    if(!meaning){
      for(const candidate of lemmaCandidates(key)){
        try{meaning=await dicionarioAberto(candidate)}catch(error){}
        if(!meaning){try{meaning=await wiktionaryExtract(candidate)}catch(error){}}
        if(meaning){meaning='É uma forma relacionada à palavra “'+candidate+'”. '+meaning;break;}
      }
    }

    if(!meaning){
      meaning=lessonWords.has(key)
        ?'Não consegui carregar o significado desta palavra neste momento. Tente novamente com a internet ligada.'
        :'Não encontrei essa palavra no dicionário. Confira a escrita e tente novamente.';
    }
    meaning=clean(meaning);
    if(meaning.length>430)meaning=meaning.slice(0,430).replace(/\s+\S*$/,'')+'...';
    try{localStorage.setItem(CACHE_KEY+key,meaning)}catch(error){}
    return meaning;
  }

  function patchDictionary(){
    const overlay=document.querySelector('.v55Ov');
    const button=document.querySelector('.v55Fab');
    if(!overlay||!button){setTimeout(patchDictionary,150);return;}
    if(overlay.dataset.v57==='1')return;
    overlay.dataset.v57='1';

    const heading=overlay.querySelector('.v55Top h3');
    const subtitle=overlay.querySelector('.v55Top p');
    if(heading)heading.textContent='Dicionário';
    if(subtitle)subtitle.textContent='Digite qualquer palavra das lições e toque em Pesquisar.';
    overlay.querySelector('.v55Words')?.remove();

    const oldInput=overlay.querySelector('.v55In');
    const oldSearch=overlay.querySelector('.v55Go');
    const result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;

    const input=oldInput.cloneNode(true);
    const search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);
    oldSearch.replaceWith(search);
    input.value='';
    result.innerHTML='';

    async function run(){
      const word=norm(input.value);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      result.innerHTML='<div class="v55Card">Procurando significado...</div>';
      const meaning=await lookup(word);
      result.innerHTML=`<div class="v55Card"><h4>${esc(word)}</h4><p>${esc(meaning)}</p></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();run();}});

    const newButton=button.cloneNode(true);
    button.replaceWith(newButton);
    newButton.addEventListener('click',()=>{
      input.value='';
      result.innerHTML='';
      overlay.classList.add('show');
      setTimeout(()=>input.focus(),50);
    });
  }

  function init(){
    patchWritingBoards();
    patchDictionary();
    const observer=new MutationObserver(()=>patchWritingBoards());
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('hashchange',()=>setTimeout(patchWritingBoards,0));
    window.addEventListener('popstate',()=>setTimeout(patchWritingBoards,0));
    document.addEventListener('click',()=>setTimeout(patchWritingBoards,30),true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
