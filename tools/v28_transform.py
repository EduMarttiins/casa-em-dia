from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="27">','<meta name="app-version" content="28">',1)

css='''
/* Versão 28: ajuda direta, curta e específica para a pergunta */
.explainer.consumed::after{display:none!important}
.v28Help{padding:4px 2px;color:#273a31;font-size:16px;line-height:1.65}
.v28Help p{margin:0}
.v28Help p+p{margin-top:10px}
@media(max-width:720px){.v28Help{font-size:15px;line-height:1.6}}
'''
if 'v28Help{' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 28: a ajuda ensina exatamente o ponto da pergunta, sem subtítulos e sem mandar clicar em uma alternativa.
function v28Escape(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function v28MathHelp(q){
  const t=String(q?.text||'');
  const lower=t.toLowerCase();
  const nums=(t.match(/\d+(?:[\s.]\d+)*(?:,\d+)?/g)||[]).map(x=>x.trim());

  if(/[×x]\s*\d|multiplic|produto/.test(lower)){
    if(nums.length>=2){
      return `Monte ${v28Escape(nums[0])} × ${v28Escape(nums[1])}. Comece multiplicando pela unidade do segundo número. Se ele tiver dezena, faça outra linha para essa dezena, deslocando uma casa. Depois some as linhas. Faça na lousa e só então compare com as alternativas.`;
    }
    return 'Na multiplicação, organize os números um embaixo do outro. Multiplique da direita para a esquerda e, se houver mais de uma ordem no segundo número, faça uma linha para cada ordem. Depois some as linhas.';
  }

  if(/[÷:]\s*\d|divid|quociente|repart/.test(lower)){
    if(nums.length>=2){
      return `Monte ${v28Escape(nums[0])} ÷ ${v28Escape(nums[1])}. Pergunte quantas vezes o divisor cabe na primeira parte do número sem passar. Escreva esse algarismo, multiplique, subtraia e abaixe o próximo. Repita até terminar.`;
    }
    return 'Na divisão, veja quantas vezes o divisor cabe sem ultrapassar. Depois multiplique, subtraia, abaixe o próximo algarismo e repita o mesmo ciclo.';
  }

  if(/\+/.test(t)) return 'Aqui você precisa juntar as quantidades. Alinhe unidades com unidades, dezenas com dezenas e centenas com centenas. Some da direita para a esquerda e confira se houve algum vai um.';
  if(/[−-]/.test(t)) return 'Aqui você precisa descobrir quanto sobra ou a diferença. Alinhe as casas e subtraia da direita para a esquerda. Quando o número de cima for menor, faça o empréstimo da casa ao lado.';
  if(/%|por cento/.test(lower)) return 'Porcentagem quer dizer uma parte de cada 100. Lembre: 50% é metade, 25% é um quarto e 10% é a décima parte. Use essa equivalência para chegar ao valor pedido.';
  if(/\d+\/\d+|fraç|numerador|denominador/.test(lower)) return 'Na fração, o número de baixo mostra em quantas partes iguais o inteiro foi dividido e o de cima mostra quantas partes estão sendo consideradas. Use isso exatamente no que a pergunta pede.';
  if(/r\$|troco|reais|centavos/.test(lower)) return 'Pense como numa compra de verdade. Para achar total, some ou multiplique. Para achar troco, faça valor pago menos valor da compra. Mantenha as vírgulas alinhadas.';
  if(/tabela|gráfico|nascimentos/.test(lower)) return 'Volte aos números mostrados na tabela ou gráfico e procure exatamente o que a pergunta pede: maior, menor, igual, total ou diferença. Use só esses valores para calcular.';

  const remember=q?.everyday?.remember?String(q.everyday.remember):'';
  const review=q?.review?String(q.review):'';
  const base=remember||review||'Leia o que a pergunta quer descobrir e faça somente a operação necessária para chegar a esse valor.';
  return v28Escape(base);
}

function v28DirectHelp(q){
  if(currentSubjectKey==='math'){
    return `<div class="v28Help"><p>${v28MathHelp(q)}</p></div>`;
  }

  const explanation=String(q?.explanation||'').trim();
  const everyday=String(q?.everyday?.example||'').trim();
  const remember=String(q?.everyday?.remember||'').trim();
  const review=String(q?.review||'').trim();

  let first=explanation||review||remember||'Volte ao conteúdo desta pergunta e pense no conceito principal que ela está pedindo.';
  let second='';

  if(everyday && !first.toLowerCase().includes(everyday.toLowerCase())) second=everyday;
  else if(remember && !first.toLowerCase().includes(remember.toLowerCase())) second=remember;

  return `<div class="v28Help"><p>${v28Escape(first)}</p>${second?`<p>${v28Escape(second)}</p>`:''}</div>`;
}

v25BuildHint=function(q){return v28DirectHelp(q)};
'''

if 'function v28DirectHelp(q)' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="28','function v28DirectHelp(q)','v25BuildHint=function(q)','v28Help']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 28 aplicada',len(s.encode()))
