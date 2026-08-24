(()=>{
'use strict';
if(window.__CASATODA_39__)return;
window.__CASATODA_39__=true;

const b=(()=>{try{return window.CasaTodaAndroid||null}catch(e){return null}})();
if(!b)return;

const FAMILY_KEY='casatoda_family_code';

function syncNativeFamilyCode(){
 try{
  let code=(localStorage.getItem(FAMILY_KEY)||'').trim().toUpperCase();
  if(!code&&typeof b.getFamilyCode==='function'){
   code=String(b.getFamilyCode()||'').trim().toUpperCase();
   if(code)localStorage.setItem(FAMILY_KEY,code);
  }
  if(code&&typeof b.setFamilyCode==='function')b.setFamilyCode(code);
 }catch(e){console.warn('CasaToda código nativo',e)}
}

function ensureStyle(){
 if(document.getElementById('ctChildDevice39Style'))return;
 const s=document.createElement('style');
 s.id='ctChildDevice39Style';
 s.textContent=`
 body.ct-child-device39 #authGate .auth-family-wrap{display:none!important}
 body.ct-child-device39 #authGate .auth-card{width:min(440px,100%)!important}
 body.ct-child-device39 #authGate .auth-brand{margin-bottom:18px!important}
 body.ct-child-device39 #authGate .auth-children-shell{padding:16px!important;border-radius:28px!important}
 body.ct-child-device39 #authGate .auth-children-grid{grid-template-columns:1fr!important;gap:14px!important}
 body.ct-child-device39 #authGate .profile-choice.child{min-height:152px!important;width:100%!important;padding:16px!important;border-radius:25px!important}
 body.ct-child-device39 #authGate .profile-choice.child .profile-photo{width:88px!important;height:88px!important}
 body.ct-child-device39 #authGate .profile-choice.child strong{font-size:19px!important}
 body.ct-child-device39 #authGate .profile-choice.child span{font-size:10px!important}
 body.ct-child-device39 #authGate .auth-card:after{content:"Toque no seu perfil para continuar"!important}
 @media(max-width:420px){
  body.ct-child-device39 #authGate .profile-choice.child{min-height:140px!important}
  body.ct-child-device39 #authGate .profile-choice.child .profile-photo{width:80px!important;height:80px!important}
 }
 `;
 document.head.appendChild(s)
}

function tuneGate(){
 document.body.classList.add('ct-child-device39');
 ensureStyle();
 document.querySelectorAll('#authGate .auth-family-wrap').forEach(el=>el.remove());
 document.querySelectorAll('#authGate .profile-choice.parent').forEach(el=>el.remove());
 const title=document.querySelector('#authGate .auth-children-title b');
 const hint=document.querySelector('#authGate .auth-children-title span');
 if(title)title.textContent='Escolha seu perfil';
 if(hint)hint.textContent='Somente crianças';
 syncNativeFamilyCode();
}

document.addEventListener('click',e=>{
 const parent=e.target.closest?.('#authGate .profile-choice.parent, #authGate .auth-family-wrap');
 if(parent){e.preventDefault();e.stopImmediatePropagation()}
},true);

try{
 const oldGate=typeof renderProfileGate==='function'?renderProfileGate:null;
 if(oldGate){renderProfileGate=function(){const x=oldGate();setTimeout(tuneGate,0);return x}}
}catch(e){}

window.addEventListener('focus',()=>setTimeout(tuneGate,80));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tuneGate,80)});
setInterval(syncNativeFamilyCode,5000);
setTimeout(tuneGate,100);
setTimeout(tuneGate,700);
})();
