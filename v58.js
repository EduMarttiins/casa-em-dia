/* Lousa de Estudos, versão 58 */
(()=>{
  if(window.__lousaV58)return;
  window.__lousaV58=true;

  const CACHE_KEY='lousa:v58:dict:';
  const norm=value=>String(value||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=value=>String(value||'').replace(/\s+/g,' ').replace(/\[[^\]]*\]/g,'').trim();
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const FRIENDLY={
    provavelmente:{meaning:'Quer dizer que algo tem muita chance de acontecer, mas não temos certeza.',example:'Olhe o céu cheio de nuvens escuras. Provavelmente vai chover.',tip:'Você pensa que vai acontecer porque existem pistas, mas ainda pode acontecer de outro jeito.'},
    aspecto:{meaning:'É uma característica, uma parte ou um jeito de observar alguma coisa.',example:'A cor é um aspecto que podemos observar em uma paisagem.',tip:'Pense em uma parte que ajuda você a perceber melhor o todo.'},
    camponês:{meaning:'É uma pessoa que vive ou trabalha no campo, cuidando da terra, de plantações ou de animais.',example:'O camponês cuidava da plantação todos os dias.',tip:'Pense em alguém cujo trabalho está ligado à vida no campo.'},
    ganância:{meaning:'É quando alguém quer ter cada vez mais coisas, dinheiro ou vantagens, mesmo quando já tem bastante.',example:'A ganância fez o personagem querer todos os ovos de ouro de uma só vez.',tip:'É um querer exagerado, sem saber a hora de parar.'},
    prosperidade:{meaning:'É uma situação em que a vida está indo bem, com crescimento, bons resultados e condições melhores.',example:'A família viveu um período de prosperidade depois de uma boa colheita.',tip:'Pense em uma fase de crescimento e bons resultados.'},
    conflito:{meaning:'É o problema principal de uma história, aquilo que cria uma dificuldade para os personagens.',example:'Se um personagem se perde no caminho, esse problema pode ser o conflito da história.',tip:'Pergunte: o que aconteceu para as coisas começarem a dar errado?'},
    inferência:{meaning:'É uma conclusão que fazemos usando pistas do texto, mesmo quando a resposta não está escrita exatamente.',example:'O chão está molhado e há pessoas com guarda chuva. Podemos inferir que choveu.',tip:'Junte as pistas do texto com aquilo que você já sabe.'},
    explícita:{meaning:'É uma informação que está escrita ou mostrada de forma clara, sem precisar adivinhar.',example:'Se o texto diz que Ana tem dez anos, essa idade é uma informação explícita.',tip:'Você consegue apontar exatamente onde a informação foi dita.'},
    desfecho:{meaning:'É a parte final de uma história, quando descobrimos como os acontecimentos terminaram.',example:'No desfecho, o personagem voltou para casa e reencontrou a família.',tip:'Pense no que acontece no fim da história.'},
    personagem:{meaning:'É uma pessoa, animal ou ser que participa dos acontecimentos de uma história.',example:'Em uma história sobre um cachorro aventureiro, o cachorro é um personagem.',tip:'É quem participa da história.'},
    práticas:{meaning:'Nesse tipo de frase, quer dizer coisas feitas de um jeito mais fácil, útil ou adequado.',example:'Levar alimentos fáceis de preparar tornou as refeições mais práticas.',tip:'Pense em algo que facilita uma tarefa.'},
    tripulados:{meaning:'Quer dizer que há pessoas viajando dentro do veículo ou da nave.',example:'Um voo espacial tripulado leva astronautas a bordo.',tip:'Se há pessoas dentro da nave, o voo é tripulado.'},
    bingo:{meaning:'É uma expressão usada quando algo deu certo ou quando encontramos a resposta que procurávamos.',example:'Depois de testar a ideia e ver que funcionou, ele disse: Bingo!',tip:'É parecido com dizer: Achei! Deu certo!'},
    astronauta:{meaning:'É uma pessoa treinada para viajar e trabalhar no espaço.',example:'O astronauta fez experiências dentro da nave.',tip:'Pense em uma pessoa preparada para missões espaciais.'},
    desidratação:{meaning:'É quando o corpo perde mais água do que recebe e fica com pouca água para funcionar bem.',example:'Depois de muito calor e pouca água, uma pessoa pode ter desidratação.',tip:'O corpo precisa repor a água que perdeu.'},
    reidratação:{meaning:'É devolver água e líquidos ao corpo depois que ele perdeu muito líquido.',example:'Beber água ajuda na reidratação depois de uma atividade física.',tip:'É ajudar o corpo a recuperar a água perdida.'},
    alimentação:{meaning:'É o jeito como nos alimentamos e o conjunto de alimentos que comemos e bebemos.',example:'Uma alimentação variada inclui diferentes tipos de alimentos.',tip:'Pense em tudo o que faz parte da forma de se alimentar.'},
    alimento:{meaning:'É aquilo que comemos ou bebemos para dar energia e nutrientes ao corpo.',example:'Uma banana é um alimento.',tip:'É algo que ajuda a nutrir o corpo.'},
    nutrientes:{meaning:'São substâncias dos alimentos que o corpo usa para ter energia, crescer e funcionar bem.',example:'Vitaminas, proteínas e minerais são nutrientes.',tip:'Pense nos componentes úteis que o corpo retira dos alimentos.'},
    absorção:{meaning:'É quando uma substância entra ou é aproveitada por outra parte.',example:'No intestino, acontece a absorção de muitos nutrientes dos alimentos.',tip:'Pense em algo sendo recebido e aproveitado.'},
    alvéolos:{meaning:'São pequenos saquinhos de ar que ficam nos pulmões e ajudam na troca de gases durante a respiração.',example:'O oxigênio passa dos alvéolos para o sangue.',tip:'Imagine vários saquinhos bem pequenos dentro dos pulmões.'},
    capilares:{meaning:'São vasos sanguíneos muito finos que levam o sangue bem perto das células e dos tecidos.',example:'Os capilares ficam próximos dos alvéolos nos pulmões.',tip:'Pense em vasinhos muito fininhos.'},
    artérias:{meaning:'São vasos que levam o sangue para fora do coração em direção ao corpo.',example:'As artérias transportam sangue a partir do coração.',tip:'Pense em caminhos por onde o sangue sai do coração.'},
    veias:{meaning:'São vasos que trazem o sangue de volta ao coração.',example:'As veias ajudam o sangue a retornar ao coração.',tip:'Pense em caminhos de volta para o coração.'},
    cardiovascular:{meaning:'É uma palavra usada para falar do coração e dos vasos sanguíneos juntos.',example:'O sistema cardiovascular transporta o sangue pelo corpo.',tip:'Cardio lembra coração e vascular lembra vasos.'},
    desigualdade:{meaning:'É quando pessoas ou grupos têm condições, oportunidades ou recursos muito diferentes de maneira injusta.',example:'Um bairro com muitos serviços e outro sem água tratada podem mostrar desigualdade.',tip:'Pense em diferenças que deixam algumas pessoas com menos oportunidades.'},
    socioeconômica:{meaning:'É algo relacionado ao mesmo tempo à vida em sociedade e às condições de dinheiro, trabalho e renda.',example:'A renda das famílias pode ser um aspecto socioeconômico.',tip:'Sócio lembra sociedade e econômica lembra dinheiro e condições de vida.'},
    saneamento:{meaning:'É o conjunto de serviços que cuida da água, do esgoto e do lixo para proteger a saúde das pessoas.',example:'Água tratada e coleta de esgoto fazem parte do saneamento.',tip:'Pense em serviços que deixam a cidade mais limpa e saudável.'},
    infraestrutura:{meaning:'É o conjunto de estruturas e serviços básicos que ajudam uma cidade ou lugar a funcionar.',example:'Ruas, energia, água e transporte fazem parte da infraestrutura.',tip:'É como a base necessária para o lugar funcionar.'},
    urbanização:{meaning:'É o crescimento das cidades e o aumento da população vivendo em áreas urbanas.',example:'A construção de novos bairros pode fazer parte da urbanização.',tip:'Urbano lembra cidade.'},
    diversidade:{meaning:'É a presença de pessoas, ideias, costumes ou características diferentes convivendo juntas.',example:'Uma turma com alunos de diferentes origens mostra diversidade.',tip:'Diversidade quer dizer variedade de diferenças.'},
    cultura:{meaning:'É o conjunto de costumes, conhecimentos, festas, crenças, comidas, músicas e modos de viver de um grupo.',example:'As festas populares fazem parte da cultura de um povo.',tip:'Pense nas formas de viver e de se expressar de um grupo.'},
    memória:{meaning:'É a capacidade de guardar e lembrar informações, acontecimentos e experiências.',example:'Fotografias podem ajudar a preservar a memória de uma família.',tip:'É aquilo que conseguimos guardar e recordar.'},
    tradição:{meaning:'É um costume ou prática que passa de uma geração para outra.',example:'Uma festa realizada todos os anos pode se tornar uma tradição.',tip:'Pense em algo que as pessoas aprendem com as gerações anteriores e continuam fazendo.'},
    indígena:{meaning:'É a pessoa que pertence a um dos povos originários de um território.',example:'Os povos indígenas possuem diferentes línguas, costumes e conhecimentos.',tip:'No Brasil existem muitos povos indígenas diferentes entre si.'},
    africano:{meaning:'É aquilo ou aquela pessoa que tem origem no continente africano.',example:'Existem muitos povos e culturas diferentes no continente africano.',tip:'África é um continente com muitos países e culturas.'},
    escravidão:{meaning:'Foi um sistema injusto em que pessoas eram obrigadas a trabalhar e eram tratadas como propriedade de outras pessoas.',example:'A escravidão retirava a liberdade de milhões de pessoas.',tip:'É importante lembrar que pessoas escravizadas tinham sua liberdade tirada à força.'},
    resistência:{meaning:'É a ação de não aceitar uma situação injusta e lutar para enfrentá la ou mudá la.',example:'Muitas pessoas escravizadas criaram formas de resistência.',tip:'Pense em não se entregar diante de uma injustiça.'},
    quilombo:{meaning:'É uma comunidade formada historicamente por pessoas negras, muitas delas que resistiam à escravidão, e por seus descendentes.',example:'Palmares foi um importante quilombo da história do Brasil.',tip:'Pense em comunidades ligadas à resistência e à preservação da cultura negra.'},
    fração:{meaning:'É uma forma de representar uma ou mais partes de um todo que foi dividido em partes iguais.',example:'Se uma pizza foi dividida em quatro partes iguais e você comeu uma, comeu um quarto.',tip:'Pense em dividir algo em partes iguais.'},
    porcentagem:{meaning:'É uma forma de mostrar uma quantidade em cada cem partes.',example:'Cinquenta por cento quer dizer cinquenta de cada cem, ou a metade.',tip:'O símbolo de porcentagem sempre compara com cem.'},
    decimal:{meaning:'É um número que pode representar partes menores que uma unidade usando vírgula.',example:'Um real e cinquenta centavos pode ser escrito como 1,50.',tip:'A vírgula ajuda a separar a parte inteira da parte menor que um inteiro.'},
    aproximadamente:{meaning:'Quer dizer perto de um valor ou quantidade, mas não exatamente igual.',example:'A viagem dura aproximadamente duas horas.',tip:'É um valor bem próximo do verdadeiro.'},
    principal:{meaning:'É aquilo que é mais importante dentro de um assunto ou situação.',example:'A ideia principal é a informação mais importante do texto.',tip:'Pergunte: se eu pudesse guardar só uma ideia, qual seria?'},
    concluir:{meaning:'É chegar a uma ideia ou resposta depois de observar informações e pensar sobre elas.',example:'Depois de ler as pistas, podemos concluir o que aconteceu.',tip:'É o resultado do seu raciocínio.'},
    comparar:{meaning:'É observar duas ou mais coisas para perceber o que elas têm de parecido e de diferente.',example:'Podemos comparar duas cidades observando tamanho, população e serviços.',tip:'Procure semelhanças e diferenças.'},
    compare:{meaning:'É um pedido para observar duas ou mais coisas e dizer o que é parecido e o que é diferente.',example:'Compare o começo e o final da história.',tip:'Olhe para os dois lados antes de responder.'},
    explique:{meaning:'É um pedido para deixar uma ideia clara, dizendo como ou por que alguma coisa acontece.',example:'Se a pergunta diz explique, não basta escrever só sim ou não.',tip:'Mostre seu raciocínio com palavras.'},
    calcule:{meaning:'É um pedido para fazer uma conta e descobrir um resultado.',example:'Calcule quanto dinheiro sobrou depois da compra.',tip:'Veja quais números aparecem e qual operação faz sentido.'},
    representar:{meaning:'Pode querer dizer mostrar uma ideia, quantidade ou coisa de outro jeito, usando palavras, números, símbolos ou imagens.',example:'Uma fração pode representar uma parte de um inteiro.',tip:'É mostrar uma coisa por meio de outra forma.'},
    consequência:{meaning:'É aquilo que acontece como resultado de outra coisa que aconteceu antes.',example:'Molhar o chão pode ter como consequência deixá lo escorregadio.',tip:'Pense no que aconteceu depois por causa de algo anterior.'},
    causa:{meaning:'É aquilo que provoca ou faz alguma coisa acontecer.',example:'A chuva forte pode ser a causa de um alagamento.',tip:'Pergunte: por que isso aconteceu?'},
    provavelmentee:{meaning:'Quer dizer que algo tem muita chance de acontecer, mas não temos certeza.',example:'Provavelmente o ônibus chegará em alguns minutos.',tip:'Existem pistas, mas ainda não há certeza.'},
    a:{meaning:'É uma palavrinha que pode aparecer antes de um nome feminino, como em a menina.',example:'A menina abriu o livro.',tip:'Ela ajuda a acompanhar uma palavra feminina em muitas frases.'},
    o:{meaning:'É uma palavrinha que pode aparecer antes de um nome masculino, como em o menino.',example:'O menino abriu o livro.',tip:'Ela ajuda a acompanhar uma palavra masculina em muitas frases.'},
    e:{meaning:'É uma palavra usada para juntar palavras, ideias ou ações.',example:'Ana leu o texto e respondeu às perguntas.',tip:'Pense nela como uma ponte que acrescenta uma informação à outra.'},
    de:{meaning:'É uma palavra pequena que liga outras palavras e pode indicar origem, assunto, posse ou relação.',example:'O caderno de Pedro está na mesa.',tip:'O sentido muda conforme as palavras que ela está ligando.'},
    em:{meaning:'É uma palavra que pode indicar lugar, tempo ou situação.',example:'O livro está em casa.',tip:'Muitas vezes ela ajuda a responder onde ou em que situação.'},
    para:{meaning:'É uma palavra que pode indicar destino, objetivo ou finalidade.',example:'Ela foi para a escola para estudar.',tip:'Pode ajudar a mostrar para onde ou para quê.'},
    com:{meaning:'É uma palavra que pode indicar companhia, instrumento ou jeito de fazer algo.',example:'Ela escreveu com lápis.',tip:'Pode mostrar com quem ou com o quê algo foi feito.'},
    sem:{meaning:'É uma palavra que mostra que alguma coisa está faltando ou não está presente.',example:'Ele saiu sem o guarda chuva.',tip:'Pense no contrário de com em algumas situações.'},
    porque:{meaning:'É uma palavra usada para explicar o motivo de alguma coisa.',example:'Ela levou o casaco porque estava frio.',tip:'Depois dela costuma aparecer uma explicação.'},
    'por que':{meaning:'É uma expressão usada em perguntas quando queremos descobrir o motivo de alguma coisa.',example:'Por que o personagem ficou triste?',tip:'Você pode pensar: por qual motivo?'},
    onde:{meaning:'É uma palavra usada quando queremos saber ou indicar um lugar.',example:'Onde fica a biblioteca?',tip:'Ela faz você pensar em um lugar.'},
    quando:{meaning:'É uma palavra usada quando queremos saber ou indicar um momento ou tempo.',example:'Quando começou a aula?',tip:'Ela faz você pensar em tempo.'},
    quem:{meaning:'É uma palavra usada quando queremos saber qual pessoa fez ou participou de alguma coisa.',example:'Quem abriu a porta?',tip:'Ela faz você procurar uma pessoa.'},
    qual:{meaning:'É uma palavra usada para escolher ou identificar uma coisa entre possibilidades.',example:'Qual é a ideia principal do texto?',tip:'Ela pede que você identifique alguma coisa.'}
  };

  function localEntry(word){
    const key=norm(word);
    if(FRIENDLY[key])return FRIENDLY[key];
    const target=plain(key);
    const found=Object.keys(FRIENDLY).find(item=>plain(item)===target);
    return found?FRIENDLY[found]:null;
  }

  function simplifyRaw(raw,word){
    let text=clean(raw);
    text=text.replace(/\([^)]{0,80}\)/g,' ').replace(/\b(?:Fig\.?|Pop\.?|Ant\.?|Bras\.?|Gram\.?|Bot\.?|Zool\.?|Med\.?|Anat\.?)\s*/gi,'');
    text=text.replace(/\s+/g,' ').trim();
    const first=(text.split(/(?<=[.!?])\s+/)[0]||text).replace(/^\d+[.)]?\s*/,'').trim();
    let m;
    if((m=first.match(/^De modo\s+(.+?)[.]?$/i)))return 'Quer dizer fazer alguma coisa de um jeito '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Ato ou efeito de\s+(.+?)[.]?$/i)))return 'É quando acontece a ação de '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Ação de\s+(.+?)[.]?$/i)))return 'É o ato de '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Qualidade de\s+(.+?)[.]?$/i)))return 'É a característica de quem ou do que é '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Estado de\s+(.+?)[.]?$/i)))return 'É a situação de estar '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Pessoa que\s+(.+?)[.]?$/i)))return 'É uma pessoa que '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Lugar (?:em que|onde)\s+(.+?)[.]?$/i)))return 'É um lugar onde '+m[1].replace(/[.]$/,'')+'.';
    if((m=first.match(/^Que\s+(.+?)[.]?$/i)))return 'É algo ou alguém que '+m[1].replace(/[.]$/,'')+'.';

    let easy=first
      .replace(/\bindivíduo\b/gi,'pessoa')
      .replace(/\butilizar\b/gi,'usar')
      .replace(/\butiliza\b/gi,'usa')
      .replace(/\bpossuir\b/gi,'ter')
      .replace(/\bpossui\b/gi,'tem')
      .replace(/\bobter\b/gi,'conseguir')
      .replace(/\befetuar\b/gi,'fazer')
      .replace(/\bdenominação\b/gi,'nome')
      .replace(/\brelativo a\b/gi,'relacionado a')
      .replace(/\breferente a\b/gi,'relacionado a')
      .replace(/\bposterior\b/gi,'que vem depois')
      .replace(/\banterior\b/gi,'que vem antes')
      .replace(/\bmanifestar\b/gi,'mostrar')
      .replace(/\bmanifestação\b/gi,'forma de mostrar')
      .replace(/\bfinalidade\b/gi,'objetivo');
    if(!/[.!?]$/.test(easy))easy+='.';
    if(easy.length>260)easy=easy.slice(0,260).replace(/\s+\S*$/,'')+'...';
    return 'Em palavras simples, '+easy.charAt(0).toLocaleLowerCase('pt-BR')+easy.slice(1);
  }

  function defaultTip(word){
    return 'Tente trocar “'+word+'” pelo significado acima dentro da frase. Se a ideia continuar fazendo sentido, você entendeu a palavra.';
  }

  function xmlDefinition(xml){
    if(!xml)return null;
    try{
      const doc=new DOMParser().parseFromString(xml,'text/xml');
      const defs=[...doc.querySelectorAll('def')].map(node=>clean(node.textContent)).filter(Boolean);
      if(defs.length)return defs[0];
    }catch(error){}
    return null;
  }

  async function dicionarioAberto(word){
    const response=await fetch('https://api.dicionario-aberto.net/word/'+encodeURIComponent(word),{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    if(!Array.isArray(data)||!data.length)return null;
    for(const item of data){
      const def=xmlDefinition(item?.xml);
      if(def)return def;
    }
    return null;
  }

  async function wiktionary(word){
    const url='https://pt.wiktionary.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=extracts&exintro=1&explaintext=1&titles='+encodeURIComponent(word);
    const response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)return null;
    const data=await response.json();
    const page=Object.values(data?.query?.pages||{}).find(item=>!item.missing);
    const text=clean(page?.extract||'');
    return text||null;
  }

  function candidates(word){
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
    const local=localEntry(key);
    if(local)return local;
    try{
      const cached=JSON.parse(localStorage.getItem(CACHE_KEY+key)||'null');
      if(cached?.meaning)return cached;
    }catch(error){}

    let raw=null,baseWord=key;
    try{raw=await dicionarioAberto(key)}catch(error){}
    if(!raw){try{raw=await wiktionary(key)}catch(error){}}
    if(!raw){
      for(const candidate of candidates(key)){
        try{raw=await dicionarioAberto(candidate)}catch(error){}
        if(!raw){try{raw=await wiktionary(candidate)}catch(error){}}
        if(raw){baseWord=candidate;break;}
      }
    }

    let entry;
    if(raw){
      let meaning=simplifyRaw(raw,key);
      if(baseWord!==key)meaning='Essa palavra é uma forma de “'+baseWord+'”. '+meaning;
      entry={meaning,example:'',tip:defaultTip(key)};
    }else{
      entry={meaning:'Ainda não consegui encontrar uma explicação segura para esta palavra.',example:'',tip:'Confira se a palavra foi escrita corretamente. Se estiver certa, tente pesquisar novamente com a internet ligada.'};
    }
    try{localStorage.setItem(CACHE_KEY+key,JSON.stringify(entry))}catch(error){}
    return entry;
  }

  function addStyles(){
    if(document.getElementById('v58DictStyle'))return;
    const style=document.createElement('style');
    style.id='v58DictStyle';
    style.textContent=`
      .v58Meaning{font-size:17px!important;line-height:1.65!important;color:#374151!important}
      .v58Box{margin-top:13px;padding:13px 14px;border-radius:15px;background:#f8f5ff;border:1px solid #e7ddfb;color:#514466;line-height:1.55}
      .v58Box strong{display:block;margin-bottom:4px;color:#6d28d9;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
      .v58Tip{background:#f3f8ff;border-color:#dce9f8;color:#45576a}.v58Tip strong{color:#315b82}
    `;
    document.head.appendChild(style);
  }

  function patchDictionary(){
    addStyles();
    const overlay=document.querySelector('.v55Ov');
    const button=document.querySelector('.v55Fab');
    if(!overlay||!button){setTimeout(patchDictionary,150);return;}
    if(overlay.dataset.v58==='1')return;
    overlay.dataset.v58='1';
    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra e toque em Pesquisar. A explicação será simples e fácil de entender.';
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
      result.innerHTML='<div class="v55Card">Procurando uma explicação simples...</div>';
      const entry=await lookup(word);
      result.innerHTML=`<div class="v55Card"><h4>${esc(word)}</h4><p class="v58Meaning">${esc(entry.meaning)}</p>${entry.example?`<div class="v58Box"><strong>Exemplo</strong>${esc(entry.example)}</div>`:''}<div class="v58Box v58Tip"><strong>Pense assim</strong>${esc(entry.tip||defaultTip(word))}</div></div>`;
    }

    search.addEventListener('click',run);
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();run();}});
    const newButton=button.cloneNode(true);
    button.replaceWith(newButton);
    newButton.addEventListener('click',()=>{
      input.value='';result.innerHTML='';overlay.classList.add('show');setTimeout(()=>input.focus(),50);
    });
  }

  function init(){setTimeout(patchDictionary,40)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
