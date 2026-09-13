from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="25">','<meta name="app-version" content="26">',1)

css='''
/* Versão 26: reinício completo protegido por autorização via e-mail */
.v26ResetBtn{border:1px solid #e6caca;background:#fff7f7;color:#8a3030;border-radius:14px;padding:11px 14px;font-weight:900;cursor:pointer}.v26ResetBtn:hover,.v26ResetBtn:focus-visible{outline:none;border-color:#d8aaaa;background:#fff1f1}.v26ResetOverlay{position:fixed;inset:0;z-index:9999;background:rgba(20,28,24,.56);display:none;align-items:center;justify-content:center;padding:18px}.v26ResetOverlay.show{display:flex}.v26ResetDialog{width:min(520px,100%);background:#fff;border-radius:22px;box-shadow:0 28px 80px rgba(0,0,0,.24);padding:22px}.v26ResetTop{display:flex;gap:12px;align-items:flex-start}.v26ResetIcon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#fff0f0;font-size:23px;flex:0 0 auto}.v26ResetDialog h4{margin:0 0 6px;font-size:20px;color:#322}.v26ResetDialog p{margin:0;color:#68716c;line-height:1.55}.v26ResetWarning{margin-top:16px;padding:12px 14px;border-radius:14px;background:#fff8e9;border:1px solid #eedaa7;color:#694f12;font-size:13px;font-weight:800;line-height:1.55}.v26ResetActions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.v26ResetAction{border:0;border-radius:13px;padding:11px 14px;font-weight:900;cursor:pointer}.v26ResetAction.primary{background:#9f3434;color:#fff}.v26ResetAction.secondary{background:#eef2ef;color:#314037}.v26ResetAction:disabled{opacity:.45;cursor:not-allowed}.v26ResetCodeWrap{display:none;margin-top:18px}.v26ResetCodeWrap.show{display:block}.v26ResetCodeLabel{display:block;font-size:12px;font-weight:900;color:#53625a;margin-bottom:7px}.v26ResetCode{width:100%;font:800 26px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:8px;text-align:center;border:1px solid #d5ded8;border-radius:14px;padding:13px 12px;outline:none}.v26ResetCode:focus{border-color:#8bbca0;box-shadow:0 0 0 3px rgba(53,133,81,.12)}.v26ResetStatus{display:none;margin-top:13px;padding:11px 13px;border-radius:13px;font-size:13px;font-weight:800;line-height:1.5}.v26ResetStatus.show{display:block}.v26ResetStatus.info{background:#eef6ff;border:1px solid #d0e1f4;color:#315b7d}.v26ResetStatus.error{background:#fff0f0;border:1px solid #efcccc;color:#8d2f2f}.v26ResetStatus.success{background:#e9f8ee;border:1px solid #c9e9d3;color:#1f6b3b}@media(max-width:720px){.v26ResetBtn{width:100%}.v26ResetActions{flex-direction:column}.v26ResetAction{width:100%}}
'''
if 'v26ResetOverlay' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 26: zerar todas as lições somente após código recebido por e-mail
const V26_RESET_ENDPOINT='https://fkxwlezflfpdrronluci.supabase.co/functions/v1/autorizar-reset-lousa';
const V26_RESET_STATE=PREFIX+'reset:authorization';

function v26LoadResetState(){
  try{
    const raw=localStorage.getItem(V26_RESET_STATE);
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(!data?.challenge||!data?.proof||!data?.expiresAt)return null;
    if(Date.now()>Number(data.expiresAt)){localStorage.removeItem(V26_RESET_STATE);return null}
    return data;
  }catch(_e){return null}
}

function v26SaveResetState(data){
  localStorage.setItem(V26_RESET_STATE,JSON.stringify({challenge:data.challenge,proof:data.proof,expiresAt:data.expiresAt}));
}

function v26ClearAllProgress(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(k&&k.startsWith(PREFIX))keys.push(k);
  }
  keys.forEach(k=>localStorage.removeItem(k));
}

function v26BuildResetUi(){
  if(document.getElementById('v26ResetBtn'))return;
  const footer=document.querySelector('.footer');
  if(!footer)return;

  const resetBtn=document.createElement('button');
  resetBtn.type='button';resetBtn.id='v26ResetBtn';resetBtn.className='v26ResetBtn';resetBtn.textContent='Zerar todas as lições';
  footer.appendChild(resetBtn);

  const overlay=document.createElement('div');
  overlay.className='v26ResetOverlay';overlay.id='v26ResetOverlay';overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<div class="v26ResetDialog" role="dialog" aria-modal="true" aria-labelledby="v26ResetTitle"><div class="v26ResetTop"><div class="v26ResetIcon">🔒</div><div><h4 id="v26ResetTitle">Zerar todas as lições?</h4><p>Para apagar o progresso e começar novamente, o responsável precisa autorizar pelo e-mail cadastrado.</p></div></div><div class="v26ResetWarning">Isso apagará respostas, acertos, erros, escritas nas lousas, lições enviadas e liberações de etapas. Nada será apagado sem o código de autorização.</div><div class="v26ResetCodeWrap"><label class="v26ResetCodeLabel" for="v26ResetCode">Código de 6 dígitos enviado por e-mail</label><input id="v26ResetCode" class="v26ResetCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div><div class="v26ResetStatus" role="status"></div><div class="v26ResetActions"><button class="v26ResetAction primary v26RequestCode" type="button">Solicitar autorização por e-mail</button><button class="v26ResetAction primary v26VerifyCode" type="button" style="display:none">Autorizar e zerar</button><button class="v26ResetAction secondary v26CloseReset" type="button">Cancelar</button></div></div>`;
  document.body.appendChild(overlay);

  const codeWrap=overlay.querySelector('.v26ResetCodeWrap');
  const codeInput=overlay.querySelector('#v26ResetCode');
  const requestBtn=overlay.querySelector('.v26RequestCode');
  const verifyBtn=overlay.querySelector('.v26VerifyCode');
  const closeBtn=overlay.querySelector('.v26CloseReset');
  const status=overlay.querySelector('.v26ResetStatus');
  let busy=false;

  const setStatus=(text,kind='info')=>{status.textContent=text;status.className='v26ResetStatus show '+kind};
  const clearStatus=()=>{status.textContent='';status.className='v26ResetStatus'};

  function showCodeStage(){
    codeWrap.classList.add('show');
    requestBtn.textContent='Enviar novo código';
    verifyBtn.style.display='inline-flex';
    setTimeout(()=>codeInput.focus(),80);
  }

  function showRequestStage(){
    codeWrap.classList.remove('show');
    verifyBtn.style.display='none';
    requestBtn.textContent='Solicitar autorização por e-mail';
  }

  function openDialog(){
    clearStatus();
    codeInput.value='';
    overlay.classList.add('show');overlay.setAttribute('aria-hidden','false');
    if(v26LoadResetState()){
      showCodeStage();
      setStatus('Já existe um código válido enviado por e-mail. Digite-o abaixo ou solicite um novo.','info');
    }else showRequestStage();
  }

  function closeDialog(){
    if(busy)return;
    overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true');
  }

  resetBtn.addEventListener('click',openDialog);
  closeBtn.addEventListener('click',closeDialog);
  overlay.addEventListener('click',ev=>{if(ev.target===overlay)closeDialog()});
  codeInput.addEventListener('input',()=>{codeInput.value=codeInput.value.replace(/\D/g,'').slice(0,6)});
  codeInput.addEventListener('keydown',ev=>{if(ev.key==='Enter')verifyBtn.click()});

  requestBtn.addEventListener('click',async()=>{
    if(busy)return;
    busy=true;requestBtn.disabled=true;verifyBtn.disabled=true;closeBtn.disabled=true;
    setStatus('Enviando o código de autorização para o responsável...','info');
    try{
      const res=await fetch(V26_RESET_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':V21_ANON,'Authorization':'Bearer '+V21_ANON},body:JSON.stringify({action:'request_reset'})});
      const data=await res.json().catch(()=>({}));
      if(res.ok&&data.emailSent&&data.challenge&&data.proof&&data.expiresAt){
        v26SaveResetState(data);showCodeStage();
        setStatus('Código enviado por e-mail. Digite os 6 números para autorizar o reinício. O código vale por 15 minutos.','success');
      }else{
        setStatus(data.error||data.message||'Não foi possível enviar o código de autorização.','error');
      }
    }catch(err){
      console.error(err);setStatus('Não foi possível enviar o código agora. Verifique a internet e tente novamente.','error');
    }finally{
      busy=false;requestBtn.disabled=false;verifyBtn.disabled=false;closeBtn.disabled=false;
    }
  });

  verifyBtn.addEventListener('click',async()=>{
    if(busy)return;
    const state=v26LoadResetState();
    const code=codeInput.value.replace(/\D/g,'');
    if(!state){showRequestStage();setStatus('O código expirou. Solicite uma nova autorização por e-mail.','error');return}
    if(code.length!==6){setStatus('Digite os 6 números do código recebido por e-mail.','error');return}

    busy=true;requestBtn.disabled=true;verifyBtn.disabled=true;closeBtn.disabled=true;
    setStatus('Conferindo a autorização...','info');
    try{
      const res=await fetch(V26_RESET_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','apikey':V21_ANON,'Authorization':'Bearer '+V21_ANON},body:JSON.stringify({action:'verify_reset',challenge:state.challenge,proof:state.proof,expiresAt:state.expiresAt,code})});
      const data=await res.json().catch(()=>({}));
      if(res.ok&&data.authorized){
        setStatus('Autorização confirmada. Zerando todas as lições...','success');
        v26ClearAllProgress();
        setTimeout(()=>location.replace(location.origin+location.pathname+'?v=26&reiniciado=1'),700);
      }else if(data.expired){
        localStorage.removeItem(V26_RESET_STATE);showRequestStage();setStatus('O código expirou. Solicite uma nova autorização.','error');
      }else{
        setStatus(data.error||'Código incorreto. Confira o e-mail e tente novamente.','error');
      }
    }catch(err){
      console.error(err);setStatus('Não foi possível confirmar a autorização agora. Tente novamente.','error');
    }finally{
      busy=false;requestBtn.disabled=false;verifyBtn.disabled=false;closeBtn.disabled=false;
    }
  });
}

v26BuildResetUi();
try{
  const params=new URLSearchParams(location.search);
  if(params.get('reiniciado')==='1')setTimeout(()=>toast('Todas as lições foram zeradas. Você pode começar novamente!'),300);
}catch(_e){}
'''

if 'const V26_RESET_ENDPOINT' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="26','Zerar todas as lições','const V26_RESET_ENDPOINT','request_reset','verify_reset','v26ClearAllProgress']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 26 aplicada',len(s.encode()))
