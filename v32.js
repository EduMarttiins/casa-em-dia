(()=>{
'use strict';
if(window.__CASATODA_LOCAL_PIN32__)return;
window.__CASATODA_LOCAL_PIN32__=true;

const LOCAL_PIN_PREFIX='casatoda_local_child_pin_';
const PIN_MIGRATION='casatoda_local_pin_model_v32';
const pinButton=document.getElementById('pinConfirm');
const previousConfirm=pinButton?pinButton.onclick:null;

function childObj(id){try{return state.children?.find(c=>c.id===id)||null}catch(e){return null}}
function pinKey(id){return LOCAL_PIN_PREFIX+id}
function getLocalPin(id){try{return localStorage.getItem(pinKey(id))||''}catch(e){return ''}}
function setLocalPin(id,hash){try{if(hash)localStorage.setItem(pinKey(id),hash);else localStorage.removeItem(pinKey(id))}catch(e){}}
function setPinCopy(ey,title,hint,button){
 const a=document.getElementById('pinEy'),b=document.getElementById('pinTitle'),c=document.getElementById('pinHint'),d=document.getElementById('pinConfirm');
 if(a)a.textContent=ey;if(b)b.textContent=title;if(c)c.textContent=hint;if(d)d.textContent=button||'Confirmar';
 try{updatePinDisplay()}catch(e){}
}
function clearLegacyCloudPinsInMemory(){
 try{
  for(const c of state.children||[])c.pinHash=null;
  if(!localStorage.getItem(PIN_MIGRATION)){
   localStorage.setItem('casa_em_dia_v3',JSON.stringify(state));
   localStorage.setItem(PIN_MIGRATION,'1');
  }
 }catch(e){}
}
function addResetButton(id){
 const box=document.querySelector('#pinSheet .pinbox');if(!box)return;
 let old=document.getElementById('ctPinHelp');if(old)old.remove();
 const b=document.createElement('button');b.id='ctPinHelp';b.type='button';b.className='ctPinHelp';
 b.textContent='Criar novo PIN neste aparelho';
 b.onclick=()=>{setLocalPin(id,'');startSetup(id)};
 box.appendChild(b)
}
function startSetup(id){
 const c=childObj(id);if(!c)return toast('Perfil não encontrado.','err');
 pinMode='localChildSetup1';pinTargetChild=id;pinInput='';pinFirstEntry=null;
 setPinCopy('PRIMEIRO ACESSO',`Criar PIN de ${c.name}`,`Escolha 4 números para entrar no perfil de ${c.name} neste aparelho.`,'Continuar');
 show('pinSheet');addResetButton(id)
}
function startVerify(id){
 const c=childObj(id);if(!c)return toast('Perfil não encontrado.','err');
 pinMode='localChildVerify';pinTargetChild=id;pinInput='';pinFirstEntry=null;
 setPinCopy('PERFIL DO FILHO',`PIN de ${c.name}`,`Digite o PIN de 4 números criado neste aparelho.`,'Entrar');
 show('pinSheet');addResetButton(id)
}

openChildPinVerify=function(id){
 clearLegacyCloudPinsInMemory();
 if(getLocalPin(id))startVerify(id);else startSetup(id)
};

if(pinButton){
 pinButton.onclick=function(){
  if(pinMode==='localChildVerify'){
   if(pinInput.length!==4)return toast('Digite 4 números.','err');
   const id=pinTargetChild,expected=getLocalPin(id);
   if(!expected||simpleHash(pinInput)!==expected){pinInput='';updatePinDisplay();return toast('PIN incorreto. Se esqueceu, toque em Criar novo PIN neste aparelho.','err')}
   pinInput='';pinTargetChild=null;hide('pinSheet');enterSession(id);return
  }
  if(pinMode==='localChildSetup1'){
   if(pinInput.length!==4)return toast('Digite 4 números.','err');
   pinFirstEntry=pinInput;pinInput='';pinMode='localChildSetup2';
   const c=childObj(pinTargetChild);
   setPinCopy('PRIMEIRO ACESSO',`Confirme o PIN de ${c?.name||'perfil'}`,'Digite novamente os mesmos 4 números.','Criar e entrar');return
  }
  if(pinMode==='localChildSetup2'){
   if(pinInput.length!==4)return toast('Digite 4 números.','err');
   const id=pinTargetChild,c=childObj(id);
   if(pinInput!==pinFirstEntry){pinInput='';pinFirstEntry=null;pinMode='localChildSetup1';setPinCopy('PRIMEIRO ACESSO','Tente novamente','Os PINs não coincidiram. Escolha 4 números novamente.','Continuar');return}
   const hash=simpleHash(pinInput);setLocalPin(id,hash);
   pinInput='';pinFirstEntry=null;pinTargetChild=null;pinMode='childVerify';
   hide('pinSheet');toast(`PIN de ${c?.name||'perfil'} criado neste aparelho.`);enterSession(id);return
  }
  if(previousConfirm)return previousConfirm.call(this)
 }
}

clearLegacyCloudPinsInMemory();
})();
