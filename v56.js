/* Lousa de Estudos, versão 56 */
(()=>{
  if(window.__lousaV56)return;
  window.__lousaV56=true;

  const KEY='lousa:v56:dict:';
  const BASE={
    a:'Pode ser um artigo feminino usado antes de uma palavra, como em “a menina”. Também pode ser uma preposição em algumas expressões.',
    o:'Artigo masculino usado antes de uma palavra, como em “o menino”.',
    e:'Palavra usada para ligar palavras, ideias ou ações.',
    de:'Palavra que liga outras palavras e pode indicar origem, assunto, posse, material ou relação.',
    do:'Junção das palavras “de” e “o”.',
    da:'Junção das palavras “de” e “a”.',
    em:'Palavra que pode indicar lugar, tempo, situação ou modo.',
    no:'Junção das palavras “em” e “o”.',
    na:'Junção das palavras “em” e “a”.',
    para:'Palavra que pode indicar destino, objetivo ou finalidade.',
    por:'Palavra que pode indicar causa, motivo, passagem, meio ou autoria.',
    com:'Palavra que pode indicar companhia, instrumento, modo ou relação.',
    ou:'Palavra usada para apresentar uma escolha ou possibilidade.',
    que:'Palavra que pode ligar partes de uma frase, retomar uma ideia ou aparecer em perguntas.',
    se:'Palavra que pode indicar uma condição ou uma possibilidade.',
    como:'Palavra que pode indicar comparação, maneira ou modo de fazer alguma coisa.',
    qual:'Palavra usada para perguntar ou identificar alguma coisa.',
    quando:'Palavra relacionada ao tempo ou ao momento em que algo acontece.',
    onde:'Palavra usada para indicar ou perguntar sobre um lugar.',
    quem:'Palavra usada para indicar ou perguntar sobre uma pessoa.',
    porque:'Palavra usada para apresentar uma causa, um motivo ou uma explicação.',
    'por que':'Expressão usada em perguntas para descobrir a causa ou o motivo de alguma coisa.',
    aspecto:'Característica, parte ou maneira de observar alguma coisa.',
    conflito:'Problema ou dificuldade principal que faz os acontecimentos de uma história avançarem.',
    inferência:'Conclusão que fazemos ao juntar pistas de um texto com aquilo que já sabemos.',
    explícita:'Algo que está dito ou mostrado de forma clara e direta.',
    principal:'Aquilo que é mais importante ou central.',
    concluir:'Chegar a uma ideia ou resposta depois de observar informações e pensar sobre elas.',
    explique:'Pedido para deixar uma ideia clara, dizendo como ou por que alguma coisa acontece.',
    compare:'Pedido para observar o que é parecido e o que é diferente entre duas ou mais coisas.',
    calcule:'Pedido para fazer uma conta e descobrir um resultado.',
    práticas:'Pode significar ações realizadas ou coisas que são fáceis e úteis de fazer, dependendo da frase.',
    tripulados:'Que levam pessoas a bordo, como uma nave espacial com astronautas.',
    bingo:'Expressão usada para mostrar que algo deu certo ou que uma resposta foi encontrada.'
  };

  const norm=value=>String(value||'')
    .trim()
    .toLocaleLowerCase('pt-BR')
    .replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');

  const plain=value=>String(value||'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'');

  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[char]));

  function localMeaning(word){
    const key=norm(word);
    if(BASE[key])return BASE[key];
    const simple=plain(key);
    const match=Object.keys(BASE).find(item=>plain(item)===simple);
    return match?BASE[match]:null;
  }

  async function wiktionaryMeaning(word){
    const title=norm(word);
    const url='https://pt.wiktionary.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&titles='+encodeURIComponent(title);
    const response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    const page=Object.values(data?.query?.pages||{}).find(item=>!item.missing);
    let text=String(page?.extract||'').replace(/\s+/g,' ').trim();
    if(!text)return null;
    if(text.length>420)text=text.slice(0,420).replace(/\s+\S*$/,'')+'...';
    return text;
  }

  async function lookup(word){
    const key=norm(word);
    const local=localMeaning(key);
    if(local)return local;

    try{
      const cached=localStorage.getItem(KEY+key);
      if(cached)return cached;
    }catch(error){}

    let meaning=null;
    try{meaning=await wiktionaryMeaning(key)}catch(error){}

    if(!meaning){
      meaning='Não encontrei uma definição para esta palavra. Confira se ela foi escrita corretamente e pesquise novamente.';
    }

    try{localStorage.setItem(KEY+key,meaning)}catch(error){}
    return meaning;
  }

  function patchDictionary(){
    const oldButton=document.querySelector('.v55Fab');
    const overlay=document.querySelector('.v55Ov');
    if(!oldButton||!overlay){
      setTimeout(patchDictionary,120);
      return;
    }
    if(overlay.dataset.v56==='1')return;
    overlay.dataset.v56='1';

    const heading=overlay.querySelector('.v55Top h3');
    const subtitle=overlay.querySelector('.v55Top p');
    if(heading)heading.textContent='Dicionário';
    if(subtitle)subtitle.textContent='Digite uma palavra e toque em Pesquisar para ver o significado.';

    const wordList=overlay.querySelector('.v55Words');
    if(wordList)wordList.remove();

    const oldInput=overlay.querySelector('.v55In');
    const oldSearch=overlay.querySelector('.v55Go');
    const result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result)return;

    const input=oldInput.cloneNode(true);
    const searchButton=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);
    oldSearch.replaceWith(searchButton);
    input.value='';
    result.innerHTML='';

    async function search(){
      const word=norm(input.value);
      if(!word){
        result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';
        input.focus();
        return;
      }
      result.innerHTML='<div class="v55Card">Procurando...</div>';
      const meaning=await lookup(word);
      result.innerHTML=`<div class="v55Card"><h4>${esc(word)}</h4><p>${esc(meaning)}</p></div>`;
    }

    searchButton.addEventListener('click',search);
    input.addEventListener('keydown',event=>{
      if(event.key==='Enter'){
        event.preventDefault();
        search();
      }
    });

    const button=oldButton.cloneNode(true);
    oldButton.replaceWith(button);
    button.addEventListener('click',()=>{
      input.value='';
      result.innerHTML='';
      overlay.classList.add('show');
      setTimeout(()=>input.focus(),50);
    });
  }

  function init(){setTimeout(patchDictionary,0)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
