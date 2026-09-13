from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="33">','<meta name="app-version" content="34">',1)

css='''
/* Versão 34: mini lousa maior, fundo branco e traço nítido */
.scratchCard .canvasWrap{height:460px!important;background:#fff!important;background-image:none!important}
.mathCalcBoard .canvasWrap{background:#fff!important;background-image:none!important}
@media(max-width:900px){.scratchCard .canvasWrap{height:430px!important}}
@media(max-width:520px){.scratchCard .canvasWrap{height:390px!important}}
'''
if 'Versão 34: mini lousa maior' not in s:
    s=s.replace('</style>',css+'</style>',1)

old_board="const board=document.createElement('div');board.className='board'+(currentSubjectKey==='portuguese'?' calligraphyBoard':'');"
new_board="const board=document.createElement('div');board.className='board'+(currentSubjectKey==='portuguese'?' calligraphyBoard':'')+(currentSubjectKey==='math'?' mathCalcBoard':'');"
if old_board not in s:
    raise SystemExit('board de resposta aberta não encontrado')
s=s.replace(old_board,new_board,1)

old_move="function move(e){if(!drawing||isLocked())return;e.preventDefault();config();const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const ev of events){const p=point(ev);ctx.lineTo(p.x,p.y)}ctx.stroke()}"
new_move="function move(e){if(!drawing||isLocked())return;e.preventDefault();config();const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const ev of events){const p=point(ev);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y)}}"
if old_move not in s:
    raise SystemExit('movimento da caneta não encontrado')
s=s.replace(old_move,new_move,1)

old_fit="if(saved){const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height)};img.src=saved}"
new_fit="if(saved){const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);const scale=canvas.width/img.width;const drawHeight=Math.min(canvas.height,img.height*scale);ctx.imageSmoothingEnabled=false;ctx.drawImage(img,0,0,canvas.width,drawHeight);ctx.imageSmoothingEnabled=true};img.src=saved}"
if old_fit not in s:
    raise SystemExit('restauração do canvas não encontrada')
s=s.replace(old_fit,new_fit,1)

checks=['app-version" content="34','scratchCard .canvasWrap{height:460px','mathCalcBoard','ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y)','drawHeight=Math.min(canvas.height,img.height*scale)']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 34 aplicada',len(s.encode()))
