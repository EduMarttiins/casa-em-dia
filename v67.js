/* Lousa de Estudos, versão 67: dicionário infantil para o 5º ano */
(()=>{
  if(window.__lousaV67)return;
  window.__lousaV67=true;

  const CACHE='lousa:v67:dicio-infantil:';
  const norm=v=>String(v||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const CHILD={
    contexto:{simple:'É tudo o que está acontecendo em uma história, frase ou situação e que ajuda você a entender melhor o que está sendo falado.',example:'Começou a chover e João estava longe de casa. Ele correu rápido. Saber que estava chovendo é parte do contexto e ajuda a entender por que ele correu.',context:'No texto que você está estudando, contexto é a situação que está acontecendo. Pense em quem participa, o que está acontecendo e por quê.'},
    aspecto:{simple:'É uma parte, característica ou jeito de olhar para alguma coisa.',example:'Uma bicicleta pode ser observada por vários aspectos: a cor, o tamanho, a velocidade e o jeito como ela funciona.',context:'Quando a pergunta fala em aspecto, ela quer que você observe uma parte ou característica específica do texto.'},
    conflito:{simple:'É o problema principal de uma história, aquilo que faz as coisas começarem a dar errado ou mudar.',example:'Uma menina perdeu o cachorro antes de uma viagem. Encontrar o cachorro virou o conflito da história.',context:'Procure o momento em que aparece o problema que movimenta a história. Esse problema é o conflito.'},
    inferência:{simple:'É uma conclusão que você descobre juntando pistas do texto, mesmo quando a resposta não está escrita exatamente.',example:'O chão está molhado e as pessoas entram com guarda-chuva. Você pode fazer a inferência de que choveu.',context:'Junte duas ou mais pistas do texto e pense no que elas permitem entender.'},
    explícita:{simple:'É uma informação que está escrita de forma clara e direta.',example:'Se o texto diz “Ana tem 10 anos”, a idade de Ana é uma informação explícita.',context:'Procure uma frase em que a resposta esteja escrita diretamente.'},
    explicita:{simple:'É uma informação que está escrita de forma clara e direta.',example:'Se o texto diz “Ana tem 10 anos”, a idade de Ana é uma informação explícita.',context:'Procure uma frase em que a resposta esteja escrita diretamente.'},
    principal:{simple:'É aquilo que é mais importante entre várias informações.',example:'Se você contar um filme em uma frase, vai escolher apenas a ideia principal.',context:'Pense no texto inteiro e pergunte: qual informação não pode faltar para explicar sobre o que ele fala?'},
    prosperidade:{simple:'É uma situação em que alguém está indo bem, melhorando de vida ou conseguindo bons resultados.',example:'Uma família que consegue trabalhar, pagar suas contas e melhorar sua casa pode estar vivendo um período de prosperidade.',context:'No texto, observe o que fazia a pessoa ou o personagem estar vivendo uma situação boa.'},
    ganância:{simple:'É querer ter cada vez mais dinheiro, coisas ou vantagens, mesmo quando já se tem bastante.',example:'Uma pessoa ganhou dez doces, mas quis pegar também todos os doces dos amigos só para ter mais. Isso mostra ganância.',context:'Observe quando o personagem deixa de ficar satisfeito com o que tem e passa a querer cada vez mais.'},
    circunstância:{simple:'É a situação ou condição em que alguma coisa acontece.',example:'Estava escuro, chovendo e faltou energia. Essas eram as circunstâncias daquele momento.',context:'Veja quais condições estavam acontecendo naquele momento da história.'},
    característica:{simple:'É algo que ajuda a mostrar como uma pessoa, objeto, lugar ou situação é.',example:'Ser alto, ter cabelo cacheado e ser muito paciente são características de uma pessoa.',context:'Procure no texto uma informação que diga como alguém ou alguma coisa é.'},
    consequência:{simple:'É aquilo que acontece depois por causa de uma ação ou acontecimento.',example:'Pedro esqueceu o guarda-chuva. A consequência foi chegar em casa molhado.',context:'Pergunte: o que aconteceu depois por causa do que veio antes?'},
    causa:{simple:'É o motivo que fez alguma coisa acontecer.',example:'A chuva foi a causa de o jogo ser cancelado.',context:'Pergunte: por que isso aconteceu? A resposta costuma mostrar a causa.'},
    efeito:{simple:'É o resultado ou mudança causada por alguma coisa.',example:'Dormir pouco pode ter como efeito ficar cansado no dia seguinte.',context:'Observe o que mudou ou aconteceu por causa de outra coisa.'},
    intenção:{simple:'É aquilo que alguém queria fazer, conseguir ou provocar.',example:'Ao escrever um bilhete de agradecimento, a intenção pode ser mostrar carinho.',context:'Pense no que a pessoa, personagem ou autor queria conseguir com aquela ação ou fala.'},
    tema:{simple:'É o assunto geral de que um texto fala.',example:'Um texto pode ter como tema amizade, animais, espaço ou meio ambiente.',context:'Pergunte: sobre qual assunto o texto fala do começo ao fim?'},
    opinião:{simple:'É o que uma pessoa pensa ou acha sobre alguma coisa.',example:'“Eu acho este livro divertido” é uma opinião.',context:'Veja se a frase mostra o que alguém pensa, e não apenas um fato que pode ser comprovado.'},
    argumento:{simple:'É uma razão ou explicação usada para defender uma ideia.',example:'“Devemos economizar água porque ela é necessária para a vida” apresenta um argumento.',context:'Procure a razão usada para convencer ou explicar uma ideia.'},
    comparação:{simple:'É observar duas ou mais coisas para perceber o que elas têm de parecido ou diferente.',example:'Comparar uma bicicleta e uma moto é olhar o que elas têm em comum e o que muda entre elas.',context:'Separe as duas coisas citadas e procure semelhanças e diferenças.'},
    conclusão:{simple:'É a ideia a que chegamos depois de observar as informações e pensar sobre elas.',example:'O céu ficou muito escuro e começou a ventar. Podemos chegar à conclusão de que pode chover.',context:'Junte as pistas do texto e escreva o que elas permitem entender.'},
    evidência:{simple:'É uma pista ou informação que ajuda a mostrar que uma ideia faz sentido.',example:'Pegadas molhadas no chão podem ser uma evidência de que alguém entrou da chuva.',context:'Procure no texto a pista que prova ou apoia a sua resposta.'},
    trecho:{simple:'É uma parte pequena de um texto.',example:'Se um texto tem cinco parágrafos e você lê apenas duas frases, você leu um trecho.',context:'Volte apenas à parte do texto indicada pela pergunta.'},
    narrador:{simple:'É quem conta a história para o leitor.',example:'Em “Eu entrei na sala e sentei”, quem diz “eu” está narrando os acontecimentos.',context:'Observe quem está contando o que aconteceu.'},
    personagem:{simple:'É uma pessoa, animal ou ser que participa dos acontecimentos de uma história.',example:'Em uma história sobre uma menina e seu cachorro, os dois podem ser personagens.',context:'Veja quem participa das ações da história.'},
    cenário:{simple:'É o lugar e o ambiente onde a história acontece.',example:'Uma floresta durante a noite pode ser o cenário de uma aventura.',context:'Procure onde os acontecimentos estão ocorrendo.'},
    interpretar:{simple:'É ler ou observar alguma coisa e entender o que ela quer dizer.',example:'Ao ler uma história e explicar por que o personagem ficou triste, você está interpretando o texto.',context:'Use as informações do texto e pense no que elas significam juntas.'},
    identificar:{simple:'É encontrar ou reconhecer exatamente aquilo que foi pedido.',example:'Se a pergunta pede para identificar o personagem principal, você precisa descobrir qual personagem é esse.',context:'Leia o pedido e procure no texto exatamente a informação que ele quer.'},
    justificar:{simple:'É explicar o motivo da sua resposta usando uma razão ou uma pista.',example:'“Acho que vai chover porque o céu está muito escuro” é uma resposta com justificativa.',context:'Depois de responder, mostre qual pista do texto fez você pensar assim.'},
    comparar:{simple:'É observar duas coisas para descobrir o que é parecido e o que é diferente.',example:'Você pode comparar dois animais observando tamanho, alimentação e lugar onde vivem.',context:'Organize o que é igual e o que é diferente entre os elementos citados.'},
    descrever:{simple:'É contar como uma pessoa, objeto, lugar ou situação é, usando detalhes.',example:'“O cachorro é pequeno, branco e muito agitado” é uma descrição.',context:'Procure características e detalhes que ajudem a mostrar como aquilo é.'},
    analisar:{simple:'É observar com atenção as partes de alguma coisa para entender melhor.',example:'Analisar um gráfico é olhar títulos, números e informações antes de responder.',context:'Não responda só pela primeira impressão. Observe as pistas e os detalhes.'},
    sentido:{simple:'É o significado que uma palavra ou frase tem naquela situação.',example:'A palavra “banco” pode ser um lugar para sentar ou uma instituição de dinheiro. O sentido depende da frase.',context:'Leia a frase inteira para descobrir qual significado combina com aquela situação.'},
    objetivo:{simple:'É aquilo que alguém quer alcançar ou conseguir.',example:'O objetivo de estudar para uma prova pode ser aprender o conteúdo e ter um bom resultado.',context:'Pergunte: o que essa pessoa, ação ou texto queria conseguir?'},
    atitude:{simple:'É a maneira como uma pessoa age diante de uma situação.',example:'Ajudar um colega que caiu é uma atitude de cuidado.',context:'Observe o que o personagem fez e como reagiu à situação.'},
    reação:{simple:'É o que alguém faz ou sente depois que alguma coisa acontece.',example:'Ao ouvir uma notícia boa, sorrir pode ser uma reação.',context:'Veja o que aconteceu primeiro e como a pessoa respondeu depois.'}
  };

  function dicioSlug(word){return plain(norm(word)).replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')}
  function dicioUrl(word){return 'https://www.dicio.com.br/'+encodeURIComponent(dicioSlug(word))+'/'}
  function readerUrl(word){return 'https://r.jina.ai/'+dicioUrl(word)}

  function parseDicio(text,word){
    const lines=String(text||'').replace(/\r/g,'').split('\n').map(line=>clean(line.replace(/^#+\s*/,''))).filter(Boolean);
    let grammar='';
    for(const line of lines){const m=line.match(/^Classe gramatical:\s*(.+)$/i);if(m){grammar=clean(m[1]);break}}
    const wanted='significado de '+plain(norm(word));
    let start=-1;
    for(let i=0;i<lines.length;i++){
      const p=plain(lines[i]);
      if(p.startsWith('significado de ')&&(p===wanted||p.includes(plain(norm(word))))){start=i+1;break}
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
    }
    body=body.replace(/\.(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ\[])/g,'.|');
    const defs=body.split('|').map(clean).map(d=>d.replace(/^\[[^\]]+\]\s*/,'').trim()).filter(d=>d.length>3).slice(0,2);
    return{grammar,defs};
  }

  async function dicioEntry(word){
    const key=norm(word),cacheKey=CACHE+key;
    try{const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached&&Array.isArray(cached.defs)&&cached.defs.length)return cached}catch(error){}
    let entry={grammar:'',defs:[]};
    try{const response=await fetch(readerUrl(key),{cache:'no-store'});if(response.ok)entry=parseDicio(await response.text(),key)}catch(error){}
    try{if(entry.defs.length)localStorage.setItem(cacheKey,JSON.stringify(entry))}catch(error){}
    return entry;
  }

  function simplify(def){
    let t=clean(def);
    const swaps=[
      [/\bindivíduo\b/gi,'pessoa'],[/\bindivíduos\b/gi,'pessoas'],[/\bpossui\b/gi,'tem'],[/\bpossuem\b/gi,'têm'],
      [/\butilizado\b/gi,'usado'],[/\butilizada\b/gi,'usada'],[/\butilizar\b/gi,'usar'],[/\brealizar\b/gi,'fazer'],
      [/\bobter\b/gi,'conseguir'],[/\breferente a\b/gi,'relacionado a'],[/\brelativo a\b/gi,'relacionado a'],
      [/\bcircunstância\b/gi,'situação'],[/\bcircunstâncias\b/gi,'situações'],[/\baquilo que\b/gi,'o que'],[/\bmediante\b/gi,'por meio de'],
      [/\bcom o intuito de\b/gi,'para'],[/\bcom a finalidade de\b/gi,'para'],[/\bdenomina(?:do|da)\b/gi,'chamado'],[/\bdesigna\b/gi,'indica']
    ];
    swaps.forEach(([a,b])=>{t=t.replace(a,b)});
    t=t.replace(/^ato ou efeito de\s+/i,'É quando alguém ou alguma coisa ');
    t=t.replace(/^ação de\s+/i,'É o ato de ');
    t=t.replace(/^qualidade de quem\s+/i,'É uma característica de quem ');
    if(t&&!/[.!?]$/.test(t))t+='.';
    return t.charAt(0).toUpperCase()+t.slice(1);
  }

  function currentReading(){
    const el=document.querySelector('.readingText');
    return clean(el?.innerText||el?.textContent||'');
  }

  function sentenceWith(word,text){
    if(!text)return'';
    const key=plain(norm(word));
    const sentences=text.match(/[^.!?]+[.!?]?/g)||[text];
    const found=sentences.map(clean).find(s=>plain(s).includes(key));
    return found&&found.length<300?found:'';
  }

  function contextText(word,custom){
    const reading=currentReading();
    const sentence=sentenceWith(word,reading);
    if(sentence){
      const tail=custom?.context||`Nesta frase, leia “${word}” junto com o restante da situação para entender qual sentido combina melhor.`;
      return `<strong>Trecho:</strong> “${esc(sentence)}”<br><span>${esc(tail)}</span>`;
    }
    if(custom?.context&&reading)return esc(custom.context);
    return'';
  }

  function fallbackExample(word,simple){
    const sentence=sentenceWith(word,currentReading());
    if(sentence)return `Veja esta frase da leitura: “${sentence}”`;
    const short=clean(simple).replace(/[.!?]+$/,'');
    return `Uma maneira de entender é trocar mentalmente “${word}” pela ideia: “${short.toLocaleLowerCase('pt-BR')}”.`;
  }

  function addStyles(){
    if(document.getElementById('v67Style'))return;
    const style=document.createElement('style');
    style.id='v67Style';
    style.textContent=`
      .v67Card{padding:19px;border:1px solid #e7e1f1;border-radius:20px;background:#fff;box-shadow:0 8px 22px rgba(60,42,94,.06)}
      .v67Title{margin:0;color:#25212e;font-size:23px;line-height:1.2}.v67Age{display:inline-flex;margin-top:7px;padding:5px 9px;border-radius:999px;background:#f4efff;color:#6240a8;font-size:11px;font-weight:900}
      .v67Block{margin-top:15px;padding:14px 15px;border-radius:16px;background:#faf9fc;border:1px solid #ece8f2}.v67Block.easy{background:#f4fbf6;border-color:#d9ebde}.v67Block.example{background:#fffaf1;border-color:#f2e4c3}.v67Block.context{background:#f1f7ff;border-color:#dbe8f7}
      .v67Label{display:flex;align-items:center;gap:7px;margin-bottom:7px;font-size:13px;font-weight:950;color:#383243}.v67Block p{margin:0;color:#35313b;font-size:16px;line-height:1.62}.v67Block strong{color:#263d55}.v67Block span{display:inline-block;margin-top:5px}
      .v67More{margin-top:13px;border-top:1px solid #ece9f0;padding-top:11px;color:#6d6874}.v67More summary{cursor:pointer;font-size:12px;font-weight:900}.v67Extra{padding-top:10px;font-size:12px;line-height:1.5}.v67Dicio{display:inline-flex;align-items:center;justify-content:center;margin-top:9px;min-height:34px;padding:0 11px;border-radius:10px;border:1px solid #d8dbe5;background:#fff;color:#4b3aa8;font-weight:850;text-decoration:none;font-size:11px}
      .v67Loading{padding:18px;border-radius:16px;background:#faf8ff;border:1px solid #e9e2f6;color:#615873;font-weight:800}
    `;
    document.head.appendChild(style);
  }

  function renderResult(result,typed,custom,entry){
    const word=typed||result;
    const simple=custom?.simple||simplify(entry.defs[0]||'Não encontrei uma explicação simples para esta palavra agora.');
    const example=custom?.example||fallbackExample(word,simple);
    const context=contextText(word,custom);
    const extra=entry.grammar?`<div>Classe gramatical: ${esc(entry.grammar)}</div>`:'';
    const sourceUrl=dicioUrl(word);
    return `<div class="v67Card">
      <h4 class="v67Title">${esc(word)}</h4>
      <div class="v67Age">Explicação fácil para o 5º ano</div>
      <div class="v67Block easy"><div class="v67Label">🧠 O que significa?</div><p>${esc(simple)}</p></div>
      <div class="v67Block example"><div class="v67Label">🌟 Exemplo fácil</div><p>${esc(example)}</p></div>
      ${context?`<div class="v67Block context"><div class="v67Label">📖 No texto que você está estudando</div><p>${context}</p></div>`:''}
      <details class="v67More"><summary>ℹ️ Informação extra</summary><div class="v67Extra">${extra||'A informação gramatical pode variar de acordo com o uso da palavra.'}<br><a class="v67Dicio" href="${esc(sourceUrl)}" target="_blank" rel="noopener">Ver definição original no Dicio</a></div></details>
    </div>`;
  }

  function patchDictionary(){
    addStyles();
    const overlay=document.querySelector('.v55Ov'),fab=document.querySelector('.v55Fab');
    if(!overlay||!fab){setTimeout(patchDictionary,250);return}
    if(overlay.dataset.v67==='1')return;
    overlay.dataset.v67='1';

    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra. Vou explicar de um jeito mais fácil, como para uma criança de 10 anos.';
    const oldInput=overlay.querySelector('.v55In'),oldSearch=overlay.querySelector('.v55Go'),result=overlay.querySelector('.v55Res');
    if(!oldInput||!oldSearch||!result){setTimeout(patchDictionary,250);return}
    const input=oldInput.cloneNode(true),search=oldSearch.cloneNode(true);
    oldInput.replaceWith(input);oldSearch.replaceWith(search);input.value='';result.innerHTML='';

    async function run(){
      const typed=clean(input.value),key=norm(typed);
      if(!key){result.innerHTML='<div class="v67Loading">Digite uma palavra para pesquisar.</div>';input.focus();return}
      const child=CHILD[key]||CHILD[plain(key)];
      result.innerHTML='<div class="v67Loading">Preparando uma explicação fácil...</div>';
      let entry={grammar:'',defs:[]};
      try{entry=await dicioEntry(key)}catch(error){}
      result.innerHTML=renderResult(key,typed,child,entry);
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run()}});

    const newFab=fab.cloneNode(true);fab.replaceWith(newFab);
    newFab.addEventListener('click',()=>{input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),60)});
  }

  function reinforce(){
    document.querySelectorAll('.lousaVersionOnly').forEach(el=>{el.textContent='v67'});
    patchDictionary();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(reinforce,340),{once:true});
  else setTimeout(reinforce,340);
})();
