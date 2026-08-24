(()=>{
'use strict';
if(window.__CASATODA_41__)return;
window.__CASATODA_41__=true;

const SB_URL='https://fkxwlezflfpdrronluci.supabase.co';
const SB_KEY='sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl';
const CODE_KEY='casatoda_family_code';
const LAST_TEST_KEY='casatoda_last_remote_test_41';

function bridge(){try{return window.CasaTodaAndroid||null}catch(e){return null}}
function isParent(){try{return typeof isParentSession==='function'&&isParentSession()}catch(e){return false}}
function isChild(){try{return typeof isChildSession==='function'&&isChildSession()}catch(e){return false}}
function familyCode(){try{return (localStorage.getItem(CODE_KEY)||'').trim().toUpperCase()}catch(e){return ''}}
function currentChild(){try{return String(selected||'bernardo')}catch(e){return 'bernardo'}}
function childName(id){try{return state.children?.find(c=>c.id===id)?.name||id}catch(e){return id}}
function nativeChild(){const b=bridge();try{return b&&typeof b.getChildId==='function'?String(b.getChildId()||''):''}catch(e){return ''}}
function headers(){return {'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}}

async function rpc(name,body){
 const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:headers(),body:JSON.stringify(body),cache:'no-store'});
 if(!r.ok)throw new Error('sync '+r.status);
 return await r.json();
}
async function fetchRemote(){
 const c=familyCode();if(!c)throw new Error('Sem código da família');
 const rows=await rpc('casatoda_get_state',{p_code:c});
 if(!Array.isArray(rows)||!rows.length)throw new Error('Código inválido');
 return rows[0];
}
async function sendRemoteTest(id){
 const row=await fetchRemote();
 const next=JSON.parse(JSON.stringify(row.state||{}));
 const nonce=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
 next.protectionTest={target:id,seconds:30,nonce,requestedAt:Date.now()};
 const rows=await rpc('casatoda_save_state',{p_code:familyCode(),p_state:next,p_expected_version:Number(row.version||0)});
 const res=Array.isArray(rows)?rows[0]:null;
 if(res&&res.saved===false)throw new Error('Conflito');
 return nonce;
}

function removeChildButtons(){
 document.getElementById('ctProtectionTest38')?.remove();
 document.getElementById('ctProtectionTest40')?.remove();
 document.getElementById('ctProtectionTest41Child')?.remove();
}
function ensureStyle(){
 if(document.getElementById('ctV41Style'))return;
 const s=document.createElement('style');s.id='ctV41Style';
 s.textContent='body.ct-child-session #ctProtectionTest38,body.ct-child-session #ctProtectionTest40{display:none!important}';
 document.head.appendChild(s);
}

function closeModal(){document.getElementById('ctRemoteTestModal41')?.remove()}
function modal(title,text,buttons='ok'){
 closeModal();
 const wrap=document.createElement('div');wrap.id='ctRemoteTestModal41';wrap.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(18,14,43,.64);display:grid;place-items:center;padding:22px';
 const card=document.createElement('div');card.style.cssText='width:min(430px,100%);background:#fff;border-radius:24px;padding:24px;font-family:system-ui;color:#211d32;box-shadow:0 24px 70px rgba(0,0,0,.28)';
 card.innerHTML=`<div style="width:48px;height:48px;border-radius:15px;background:#efe9ff;color:#6f43df;display:grid;place-items:center;font-size:22px;font-weight:900;margin-bottom:14px">🛡</div><h2 style="margin:0 0 8px;font-size:22px">${title}</h2><p style="margin:0;color:#6f697c;line-height:1.5">${text}</p><div id="ctRemoteTestActions41" style="display:grid;grid-template-columns:${buttons==='confirm'?'1fr 1fr':'1fr'};gap:10px;margin-top:20px"></div>`;
 wrap.appendChild(card);document.body.appendChild(wrap);
 return document.getElementById('ctRemoteTestActions41');
}

async function startFromParent(){
 const id=currentChild(),name=childName(id);
 const actions=modal('Testar bloqueio',`Enviar um teste de bloqueio de 30 segundos para o aparelho de ${name}? O horário normal não será alterado.`,'confirm');
 const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';cancel.style.cssText='height:48px;border:0;border-radius:14px;background:#f1eef6;font-weight:900';cancel.onclick=closeModal;
 const go=document.createElement('button');go.type='button';go.textContent='Enviar teste';go.style.cssText='height:48px;border:0;border-radius:14px;background:#241b52;color:#fff;font-weight:900';
 go.onclick=async()=>{
  go.disabled=true;go.textContent='Enviando...';
  try{
   await sendRemoteTest(id);
   const a=modal('Teste enviado',`Deixe o CasaToda aberto no aparelho de ${name} por alguns segundos. Depois abra outro aplicativo. Ele deverá bloquear por 30 segundos e liberar sozinho.`,'ok');
   const ok=document.createElement('button');ok.type='button';ok.textContent='Entendi';ok.style.cssText='height:48px;border:0;border-radius:14px;background:#241b52;color:#fff;font-weight:900';ok.onclick=closeModal;a.appendChild(ok);
  }catch(e){
   const a=modal('Não foi possível enviar','Confira se os aparelhos estão sincronizados e tente novamente.','ok');
   const ok=document.createElement('button');ok.type='button';ok.textContent='Fechar';ok.style.cssText='height:48px;border:0;border-radius:14px;background:#241b52;color:#fff;font-weight:900';ok.onclick=closeModal;a.appendChild(ok);
  }
 };
 actions.append(cancel,go);
}

function ensureParentButton(){
 const old=document.getElementById('ctProtectionTest41');
 if(!isParent()||bridge()){old?.remove();return}
 if(old)return;
 const btn=document.createElement('button');btn.id='ctProtectionTest41';btn.type='button';btn.innerHTML='<span style="font-size:16px">🛡️</span><span>Testar bloqueio 30 s</span>';
 btn.style.cssText='position:fixed;right:16px;bottom:104px;z-index:9991;height:48px;border:0;border-radius:999px;padding:0 16px;background:#241b52;color:#fff;display:flex;align-items:center;gap:8px;font:900 12px system-ui;box-shadow:0 12px 28px rgba(36,27,82,.30)';
 btn.onclick=startFromParent;document.body.appendChild(btn);
}

let checking=false;
async function checkRemoteTest(){
 const b=bridge();
 if(!b||typeof b.startProtectionTest!=='function'||checking)return;
 const id=(isChild()?(()=>{try{return String(sessionRole||'')}catch(e){return ''}})():nativeChild());
 if(!id||!familyCode())return;
 checking=true;
 try{
  const row=await fetchRemote();
  const cmd=row?.state?.protectionTest;
  if(!cmd||cmd.target!==id||!cmd.nonce)return;
  const last=localStorage.getItem(LAST_TEST_KEY)||'';
  if(last===cmd.nonce)return;
  localStorage.setItem(LAST_TEST_KEY,cmd.nonce);
  const age=Date.now()-Number(cmd.requestedAt||0);
  if(age<0||age>120000)return;
  b.startProtectionTest(Math.max(10,Math.min(120,Number(cmd.seconds||30))));
 }catch(e){console.warn('CasaToda teste remoto',e)}finally{checking=false}
}

function tune(){
 ensureStyle();
 if(bridge())removeChildButtons();
 ensureParentButton();
 if(bridge())checkRemoteTest();
}
const oldRender=typeof render==='function'?render:null;
if(oldRender){render=function(){const x=oldRender();setTimeout(tune,80);return x}}
const oldEnter=typeof enterSession==='function'?enterSession:null;
if(oldEnter){enterSession=function(role){const x=oldEnter(role);setTimeout(tune,120);return x}}
window.addEventListener('focus',()=>setTimeout(tune,80));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tune,80)});
setInterval(tune,1800);
setTimeout(tune,500);
})();
