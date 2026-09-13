/* Lousa de Estudos, versão 59 */
(()=>{
  if(window.__lousaV59)return;
  window.__lousaV59=true;

  const CACHE_KEY='lousa:v59:context:';
  const norm=value=>String(value||'').trim().toLocaleLowerCase('pt-BR').replace(/[“”"'´`’.,;:!?()[\]{}<>]/g,'');
  const plain=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
  const clean=value=>String(value||'').replace(/\s+/g,' ').replace(/\[[^\]]*\]/g,'').trim();
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const STOP=new Set('a o as os um uma uns umas de da do das dos em no na nos nas por para com sem e ou mas que se como qual quais quem onde quando porque por que é são foi foram ser estar está estão ao aos à às seu sua seus suas ele ela eles elas isso isto esse essa este esta muito muita muitos muitas mais menos já ainda também até entre sobre cada todo toda todos todas'.split(/\s+/));

  const CONTEXT_RULES={
    rotina:[
      {terms:['dia','dias','diário','diaria','diária','sempre','manhã','manha','noite','horário','horario','costuma','costume','atividades','tarefas','escola','trabalho','casa'],meaning:'No texto, “rotina” significa o conjunto de atividades que alguém costuma fazer regularmente, muitas vezes nos mesmos horários ou na mesma ordem.',tip:'Pense nas coisas que se repetem no dia a dia.'},
      {terms:['procedimento','exame','consulta','atendimento','controle'],meaning:'No texto, “rotina” significa algo que é feito de maneira habitual ou regular, como parte do funcionamento normal de uma atividade.',tip:'Aqui a palavra indica algo comum, previsto e repetido.'}
    ],
    banco:[
      {terms:['dinheiro','conta','saque','depósito','deposito','agência','agencia'],meaning:'No texto, “banco” é uma instituição que guarda e movimenta dinheiro e oferece serviços financeiros.',tip:'Veja se o texto fala de dinheiro, conta ou pagamentos.'},
      {terms:['sentar','praça','praca','jardim','assento'],meaning:'No texto, “banco” é um assento comprido onde uma ou mais pessoas podem se sentar.',tip:'Veja se a palavra aparece em uma cena de lugar ou descanso.'}
    ],
    manga:[
      {terms:['fruta','árvore','arvore','doce','comer','suco','alimento'],meaning:'No texto, “manga” é a fruta da mangueira.',tip:'Veja se o trecho fala de alimentação, frutas ou árvores.'},
      {terms:['camisa','blusa','roupa','braço','braco','vestir'],meaning:'No texto, “manga” é a parte da roupa que cobre total ou parcialmente o braço.',tip:'Veja se o trecho fala de roupa ou vestimenta.'}
    ],
    corrente:[
      {terms:['rio','água','agua','mar','oceano','fluxo'],meaning:'No texto, “corrente” significa um movimento contínuo de água em determinada direção.',tip:'Veja se o trecho fala de água, rios ou mar.'},
      {terms:['elo','metal','pescoço','pescoco','cadeado'],meaning:'No texto, “corrente” é um conjunto de elos ligados uns aos outros.',tip:'Veja se o trecho fala de um objeto feito de elos.'}
    ],
    estado:[
      {terms:['brasil','território','territorio','governo','cidade','município','municipio','região','regiao'],meaning:'No texto, “estado” é uma divisão territorial e administrativa de um país, como São Paulo ou Bahia.',tip:'Veja se o trecho fala de território, cidades ou governo.'},
      {terms:['físico','fisico','situação','situacao','condição','condicao','saúde','saude'],meaning:'No texto, “estado” significa a condição ou situação em que algo ou alguém se encontra.',tip:'Aqui a palavra indica como alguma coisa está naquele momento.'}
    ],
    meio:[
      {terms:['ambiente','natureza','natural','animais','plantas','ecossistema'],meaning:'No texto, “meio” faz parte da expressão “meio ambiente” e se refere ao ambiente em que os seres vivos existem e se relacionam.',tip:'Veja se o trecho fala de natureza e ambiente.'},
      {terms:['metade','centro','entre','parte'],meaning:'No texto, “meio” indica uma parte central ou a metade de alguma coisa.',tip:'Veja se a palavra indica posição ou divisão.'}
    ]
  };

  function visible(el){
    if(!el)return false;
    const s=getComputedStyle(el);
    const r=el.getBoundingClientRect();
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

  function splitSentences(text){
    const cleaned=clean(text);
    if(!cleaned)return[];
    return cleaned.split(/(?<=[.!?])\s+|\n+/).map(clean).filter(Boolean);
  }

  function contextFor(word){
    const root=lessonRoot();
    const selectors='.reviewLead,.reviewStory p,.reviewCard p,.reviewVisual,.qTitle strong,.question p,.question li,.question .prompt,.lesson p,.lesson li';
    let nodes=[...root.querySelectorAll(selectors)].filter(el=>visible(el)&&containsWord(el.textContent,word));
    if(!nodes.length){
      nodes=[...root.querySelectorAll('*')].filter(el=>visible(el)&&el.children.length===0&&containsWord(el.textContent,word));
    }
    if(!nodes.length)return{sentence:'',block:'',element:null};
    const center=innerHeight/2;
    nodes.sort((a,b)=>Math.abs((a.getBoundingClientRect().top+a.getBoundingClientRect().bottom)/2-center)-Math.abs((b.getBoundingClientRect().top+b.getBoundingClientRect().bottom)/2-center));
    const el=nodes[0];
    const block=clean(el.textContent);
    const sentence=splitSentences(block).find(part=>containsWord(part,word))||block;
    return{sentence,block,element:el};
  }

  function tokens(text){
    return (plain(text).match(/[a-z0-9]+/g)||[]).filter(token=>token.length>2&&!STOP.has(token));
  }

  function contextualRule(word,context){
    const rules=CONTEXT_RULES[plain(norm(word))]||[];
    const hay=plain((context?.sentence||'')+' '+(context?.block||''));
    let best=null,bestScore=0;
    for(const rule of rules){
      const score=rule.terms.reduce((sum,term)=>sum+(hay.includes(plain(term))?1:0),0);
      if(score>bestScore){best=rule;bestScore=score;}
    }
    return bestScore?best:null;
  }

  function simplify(raw){
    let text=clean(raw)
      .replace(/\bato ou efeito de\b/gi,'ação de')
      .replace(/\brelativo a\b/gi,'ligado a')
      .replace(/\bque diz respeito a\b/gi,'ligado a')
      .replace(/\bhabitualmente\b/gi,'normalmente')
      .replace(/\bfrequentemente\b/gi,'muitas vezes')
      .replace(/\bquotidiano\b/gi,'dia a dia')
      .replace(/\bcotidiano\b/gi,'dia a dia');
    if(text.length>240)text=text.slice(0,240).replace(/\s+\S*$/,'')+'...';
    return text;
  }

  function xmlDefinitions(xml){
    if(!xml)return[];
    try{
      const doc=new DOMParser().parseFromString(xml,'text/xml');
      return [...doc.querySelectorAll('def')].map(node=>clean(node.textContent)).filter(Boolean);
    }catch(error){return[]}
  }

  async function definitions(word){
    const key=norm(word);
    const cacheId=CACHE_KEY+key;
    try{
      const cached=JSON.parse(localStorage.getItem(cacheId)||'null');
      if(Array.isArray(cached)&&cached.length)return cached;
    }catch(error){}
    let defs=[];
    try{
      const response=await fetch('https://api.dicionario-aberto.net/word/'+encodeURIComponent(key),{cache:'force-cache'});
      if(response.ok){
        const data=await response.json();
        if(Array.isArray(data))data.forEach(item=>defs.push(...xmlDefinitions(item?.xml)));
      }
    }catch(error){}
    defs=[...new Set(defs.map(clean).filter(Boolean))];
    try{if(defs.length)localStorage.setItem(cacheId,JSON.stringify(defs.slice(0,20)))}catch(error){}
    return defs;
  }

  function scoreDefinition(def,context){
    const ctx=tokens((context?.sentence||'')+' '+(context?.block||''));
    const set=new Set(tokens(def));
    let score=0;
    ctx.forEach(token=>{if(set.has(token))score+=2;});
    return score;
  }

  function chooseDefinition(defs,context){
    if(!defs.length)return'';
    if(!context?.sentence)return defs[0];
    return defs.map((def,index)=>({def,index,score:scoreDefinition(def,context)})).sort((a,b)=>b.score-a.score||a.index-b.index)[0].def;
  }

  function fallbackMeaning(word,definition,hasContext){
    if(definition){
      const simple=simplify(definition);
      return hasContext?'No texto, “'+word+'” está sendo usada com este sentido: '+simple:'“'+word+'” significa: '+simple;
    }
    return hasContext?'Encontrei a palavra no texto, mas ainda não consegui determinar com segurança o significado usado nesse trecho.':'Ainda não consegui encontrar uma explicação segura para esta palavra.';
  }

  function defaultTip(word,hasContext){
    return hasContext?'Leia o trecho novamente e troque “'+word+'” pelo significado acima. A frase deve continuar com a mesma ideia.':'Veja em qual frase a palavra aparece. O contexto ajuda a descobrir qual significado combina com ela.';
  }

  function addStyles(){
    if(document.getElementById('v59ContextStyle'))return;
    const style=document.createElement('style');
    style.id='v59ContextStyle';
    style.textContent=`
      .v59Context{margin-top:13px;padding:14px;border-radius:16px;background:#fffaf0;border:1px solid #f1dfb7;color:#5d4b28;line-height:1.62}
      .v59Context strong{display:block;margin-bottom:5px;color:#8a6510;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
      .v59Meaning{font-size:17px!important;line-height:1.65!important;color:#374151!important}
      .v59Tip{margin-top:13px;padding:13px 14px;border-radius:15px;background:#f3f8ff;border:1px solid #dce9f8;color:#45576a;line-height:1.55}
      .v59Tip strong{display:block;margin-bottom:4px;color:#315b82;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
    `;
    document.head.appendChild(style);
  }

  function patchDictionary(){
    addStyles();
    const overlay=document.querySelector('.v55Ov');
    const button=document.querySelector('.v55Fab');
    if(!overlay||!button){setTimeout(patchDictionary,180);return;}
    if(overlay.dataset.v59==='1')return;
    overlay.dataset.v59='1';

    const subtitle=overlay.querySelector('.v55Top p');
    if(subtitle)subtitle.textContent='Digite uma palavra do texto. O significado será explicado de acordo com o sentido usado na lição.';
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
      const typed=clean(input.value);
      const word=norm(typed);
      if(!word){result.innerHTML='<div class="v55Card">Digite uma palavra para pesquisar.</div>';input.focus();return;}
      const context=contextFor(word);
      result.innerHTML='<div class="v55Card">Lendo o trecho da lição para descobrir o sentido da palavra...</div>';

      const rule=contextualRule(word,context);
      let meaning='',tip='';
      if(rule){
        meaning=rule.meaning;
        tip=rule.tip;
      }else{
        const defs=await definitions(word);
        const chosen=chooseDefinition(defs,context);
        meaning=fallbackMeaning(typed||word,chosen,Boolean(context.sentence));
        tip=defaultTip(typed||word,Boolean(context.sentence));
      }

      const contextBox=context.sentence?`<div class="v59Context"><strong>Trecho da lição</strong>${esc(context.sentence)}</div>`:'';
      result.innerHTML=`<div class="v55Card"><h4>${esc(typed||word)}</h4><p class="v59Meaning">${esc(meaning)}</p>${contextBox}<div class="v59Tip"><strong>Pense assim</strong>${esc(tip)}</div></div>`;
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

  function init(){setTimeout(patchDictionary,120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
