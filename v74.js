/* Lousa de Estudos v74 — texto de revisão em cada lição não matemática */
(()=>{
  if(window.__lousaV74LessonTexts)return;
  window.__lousaV74LessonTexts=true;

  const SCIENCE_TEXTS={
    orgaos:{
      mission:'Ciências • Páginas 8 e 9',
      title:'Como o corpo humano é organizado',
      text:'<p>O corpo humano é formado por diferentes partes que trabalham juntas. Podemos dividir o corpo em cabeça, pescoço, tronco, membros superiores e membros inferiores. Dentro dessas regiões existem órgãos, como cérebro, coração, pulmões, estômago e rins, e cada um possui funções importantes.</p><p>Os órgãos não trabalham sozinhos. Eles se organizam em sistemas, que funcionam como equipes. As células formam tecidos, os tecidos formam órgãos, os órgãos trabalham em sistemas e o conjunto desses sistemas forma o organismo.</p>',
      visual:'célula → tecido → órgão → sistema → organismo'
    },
    respiratorio:{
      mission:'Ciências • Páginas 17 a 21',
      title:'Sistema respiratório: o caminho do ar',
      text:'<p>O sistema respiratório permite a entrada de oxigênio no corpo e a eliminação de gás carbônico. O ar entra principalmente pelo nariz, onde pode ser filtrado, aquecido e umidificado. Depois passa pelas vias respiratórias, segue pela traqueia e pelos brônquios até chegar aos pulmões.</p><p>Nos pulmões existem estruturas muito pequenas chamadas alvéolos. É neles que acontece a troca de gases: o oxigênio passa do ar para o sangue e o gás carbônico passa do sangue para o ar, sendo eliminado na expiração. Na inspiração o ar entra no corpo e, na expiração, sai. O diafragma ajuda nesses movimentos respiratórios.</p>',
      visual:'nariz/boca → traqueia → brônquios → pulmões → alvéolos • O₂ entra no sangue • CO₂ sai'
    },
    cardiovascular:{
      mission:'Ciências • Páginas 23 e 24',
      title:'Sistema cardiovascular: o transporte pelo corpo',
      text:'<p>O sistema cardiovascular é formado pelo coração, pelo sangue e pelos vasos sanguíneos. Sua função é manter o sangue circulando para transportar oxigênio, nutrientes e outras substâncias importantes até as células do corpo.</p><p>O coração funciona como uma bomba. As artérias levam o sangue para fora do coração, as veias trazem o sangue de volta e os capilares são vasos muito finos onde ocorrem trocas com os tecidos. Os glóbulos vermelhos transportam grande parte do oxigênio e os glóbulos brancos participam da defesa do organismo.</p>',
      visual:'❤️ coração → artérias → capilares → veias → ❤️ • sangue transporta substâncias'
    },
    urinario:{
      mission:'Ciências • Páginas 28, 29, 30 e 33',
      title:'Sistema urinário: filtração e eliminação',
      text:'<p>O sistema urinário ajuda o organismo a eliminar resíduos e controlar a quantidade de água no corpo. Os rins filtram o sangue e formam a urina. Depois, a urina percorre os ureteres até chegar à bexiga, onde fica armazenada.</p><p>Quando urinamos, a urina sai da bexiga pela uretra. Beber água em quantidade adequada ajuda os rins a realizar a filtração e facilita a eliminação de resíduos. Quando o corpo está bem hidratado, a urina costuma ficar mais clara.</p>',
      visual:'rins → ureteres → bexiga → uretra • água ajuda o funcionamento dos rins'
    },
    digestorio:{
      mission:'Ciências • Páginas 34, 35 e 36',
      title:'Sistema digestório: transformando os alimentos',
      text:'<p>A digestão transforma os alimentos para que o corpo possa aproveitar seus nutrientes. Ela começa na boca, onde os dentes trituram os alimentos e a saliva ajuda a formar o bolo alimentar. Depois, o alimento passa pela faringe e pelo esôfago até chegar ao estômago.</p><p>No estômago, o alimento é misturado a sucos digestivos. Em seguida, passa para o intestino delgado, onde termina grande parte da digestão e ocorre a absorção dos nutrientes. No intestino grosso ocorre principalmente a absorção de água e a formação das fezes. O fígado produz bile e a vesícula biliar armazena essa substância.</p>',
      visual:'boca → faringe → esôfago → estômago → intestino delgado → intestino grosso'
    },
    alimentos:{
      mission:'Ciências • Páginas 39, 40 e 41',
      title:'Características dos alimentos e nutrientes',
      text:'<p>Os alimentos podem ser classificados de acordo com sua origem. Alguns são de origem animal, como leite, ovos e carnes; outros são de origem vegetal, como frutas, verduras e grãos; e há exemplos de origem mineral, como a água e o sal.</p><p>Os alimentos também fornecem nutrientes com diferentes funções. Os carboidratos são importantes fontes de energia. As proteínas participam da construção e reparação dos tecidos. Vitaminas e sais minerais ajudam a regular várias funções do organismo. Por isso, o corpo precisa receber diferentes tipos de nutrientes.</p>',
      visual:'animal • vegetal • mineral | carboidratos = energia • proteínas = construção • vitaminas e minerais = regulação'
    },
    saudavel:{
      mission:'Ciências • Páginas 44, 45 e 46',
      title:'Alimentação saudável no dia a dia',
      text:'<p>Uma alimentação saudável deve fornecer os nutrientes necessários em quantidade adequada e com variedade. Como alimentos diferentes oferecem nutrientes diferentes, é importante variar as refeições e priorizar alimentos in natura ou pouco processados.</p><p>Beber água, praticar atividades físicas, dormir adequadamente e manter uma rotina equilibrada também fazem parte do cuidado com a saúde. Uma boa alimentação não significa comer apenas um tipo de alimento, mas combinar diferentes grupos de forma equilibrada.</p>',
      visual:'variedade + equilíbrio + água + movimento + sono = hábitos saudáveis'
    },
    disturbios:{
      mission:'Ciências • Páginas 52, 53 e 54',
      title:'Distúrbios nutricionais e cuidados com a saúde',
      text:'<p>Quando o organismo não recebe os nutrientes necessários em quantidade adequada, podem surgir problemas nutricionais. A desnutrição envolve falta ou inadequação de nutrientes importantes para o funcionamento e o desenvolvimento do corpo.</p><p>A obesidade é uma condição que pode envolver excesso de gordura corporal e vários fatores, como alimentação, gasto de energia, hábitos de vida e características individuais. Alimentação variada, atividade física, hidratação, sono adequado e acompanhamento de profissionais de saúde quando necessário ajudam a cuidar da saúde nutricional.</p>',
      visual:'desnutrição = falta/inadequação de nutrientes • obesidade = condição multifatorial • prevenção = hábitos saudáveis'
    }
  };

  function applyScienceTexts(){
    try{
      const lessons=subjects?.science?.lessons||[];
      lessons.forEach(lesson=>{
        const data=SCIENCE_TEXTS[lesson.key];
        if(!data)return;
        lesson.mission=data.mission;
        lesson.passageTitle=data.title;
        lesson.passage=data.text;
        lesson.passageVisual=data.visual;
      });
    }catch(e){console.warn('v74 science text',e);}
  }

  function labelReadingCard(){
    try{
      if(typeof currentSubjectKey!=='undefined' && currentSubjectKey==='math')return;
      document.querySelectorAll('#lessonContent .readingBadge').forEach(el=>{
        el.textContent='📖 Texto de revisão da lição';
      });
      const card=document.querySelector('#lessonContent .readingCard');
      if(card && !card.querySelector('.v74ReadFirst')){
        const note=document.createElement('div');
        note.className='v74ReadFirst';
        note.textContent='Leia este resumo antes de responder às questões.';
        const header=card.querySelector('.readingHeader');
        if(header)header.insertAdjacentElement('afterend',note);
        else card.prepend(note);
      }
    }catch(e){}
  }

  function addStyles(){
    if(document.getElementById('v74LessonTextStyles'))return;
    const style=document.createElement('style');
    style.id='v74LessonTextStyles';
    style.textContent='.v74ReadFirst{margin:14px 0 2px;padding:10px 12px;border-radius:14px;background:#eef8ff;border:1px solid #d8eaf8;color:#31516b;font-size:13px;font-weight:800;line-height:1.45}.readingCard .readingText{font-size:16px!important;line-height:1.75!important}.readingCard .readingText p{margin:12px 0!important}.readingCard h4{font-size:22px!important;line-height:1.3!important;margin-top:14px!important}';
    document.head.appendChild(style);
  }

  applyScienceTexts();
  addStyles();

  if(typeof renderLesson==='function' && !renderLesson.__v74Wrapped){
    const previous=renderLesson;
    const wrapped=function(lesson){
      applyScienceTexts();
      const result=previous(lesson);
      labelReadingCard();
      return result;
    };
    wrapped.__v74Wrapped=true;
    renderLesson=wrapped;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',labelReadingCard,{once:true});
  else labelReadingCard();

  window.__lousaV74Ready=true;
})();
