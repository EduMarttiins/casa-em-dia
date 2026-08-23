(()=>{
'use strict';
if(window.__CASATODA_28__)return;
window.__CASATODA_28__=true;

const originalOpenChildPinVerify=typeof openChildPinVerify==='function'?openChildPinVerify:null;
const pinConfirm=document.getElementById('pinConfirm');
const originalPinConfirm=pinConfirm?pinConfirm.onclick:null;

function setPinTexts(ey,title,hint,button='Confirmar'){
  const a=document.getElementById('pinEy'),b=document.getElementById('pinTitle'),c=document.getElementById('pinHint'),d=document.getElementById('pinConfirm');
  if(a)a.textContent=ey;if(b)b.textContent=title;if(c)c.textContent=hint;if(d)d.textContent=button;
  try{updatePinDisplay()}catch(e){}
}

openChildPinVerify=function(childId){
  const child=state?.children?.find(c=>c.id===childId);
  if(!child)return toast('Perfil não encontrado.','err');
  if(!child.pinHash){
    pinMode='childSetup1';
    pinTargetChild=childId;
    pinInput='';
    pinFirstEntry=null;
    setPinTexts('PRIMEIRO ACESSO',`Criar PIN de ${child.name}`,`Este é o primeiro acesso de ${child.name}. Escolha um PIN de 4 números para usar neste aparelho.`,'Continuar');
    show('pinSheet');
    return;
  }
  if(originalOpenChildPinVerify)originalOpenChildPinVerify(childId);
  const btn=document.getElementById('pinConfirm');if(btn)btn.textContent='Entrar';
};

if(pinConfirm){
  pinConfirm.onclick=function(){
    if(pinMode==='childSetup1'||pinMode==='childSetup2'){
      if(pinInput.length!==4)return toast('Digite 4 números.','err');
      const child=state?.children?.find(c=>c.id===pinTargetChild);
      if(!child)return toast('Perfil não encontrado.','err');
      if(pinMode==='childSetup1'){
        pinFirstEntry=pinInput;
        pinInput='';
        pinMode='childSetup2';
        setPinTexts('PRIMEIRO ACESSO',`Confirme o PIN de ${child.name}`,'Digite novamente os mesmos 4 números para confirmar.','Criar e entrar');
        return;
      }
      if(pinInput!==pinFirstEntry){
        pinInput='';
        pinFirstEntry=null;
        pinMode='childSetup1';
        setPinTexts('PRIMEIRO ACESSO',`Tente novamente`,`Os PINs não coincidiram. Escolha novamente 4 números para ${child.name}.`,'Continuar');
        return;
      }
      child.pinHash=simpleHash(pinInput);
      const id=pinTargetChild;
      pinInput='';
      pinFirstEntry=null;
      pinTargetChild=null;
      pinMode='childVerify';
      try{save()}catch(e){console.warn('CasaToda V28 save',e)}
      hide('pinSheet');
      const btn=document.getElementById('pinConfirm');if(btn)btn.textContent='Confirmar';
      toast(`PIN de ${child.name} criado.`);
      enterSession(id);
      return;
    }
    if(originalPinConfirm)return originalPinConfirm.call(this);
  };
}

const oldOpenPinVerify=typeof openPinVerify==='function'?openPinVerify:null;
if(oldOpenPinVerify)openPinVerify=function(){const r=oldOpenPinVerify();const b=document.getElementById('pinConfirm');if(b)b.textContent='Entrar';return r};
const oldOpenPinSetup=typeof openPinSetup==='function'?openPinSetup:null;
if(oldOpenPinSetup)openPinSetup=function(){const r=oldOpenPinSetup();const b=document.getElementById('pinConfirm');if(b)b.textContent='Continuar';return r};
const oldOpenPinChange=typeof openPinChange==='function'?openPinChange:null;
if(oldOpenPinChange)openPinChange=function(){const r=oldOpenPinChange();const b=document.getElementById('pinConfirm');if(b)b.textContent='Continuar';return r};

})();
