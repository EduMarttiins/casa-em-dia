(()=>{
'use strict';
if(window.__CASASEGURA_64__)return;
window.__CASASEGURA_64__=true;

let timer=0;
const q=(s,p=document)=>p.querySelector(s);
const qa=(s,p=document)=>[...p.querySelectorAll(s)];
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase()}
function removeNode(el){
 if(!el||!el.isConnected)return;
 const target=el.closest('button,a,[role="button"],li,.setting-row,.settings-row,.menu-row,.control-row,.cs56-control-row,.card')||el;
 if(target.id==='cs63Home'||target.closest?.('#cs63Home'))return;
 target.remove();
}
function purge(){
 // Componentes legados de controle/configuração de aparelho. O settingsBtn era recriado
 // por renders antigos e causava o ícone de engrenagem piscar antes de ser removido.
 for(const sel of ['#settingsBtn','#ctDeviceControl44','#cs56App','#cs56Nav','.cs56-sheet','#cs56CtlFind','#cs56Manage','#cs56QuickLock','#cs56Device','#cs56OpenDevice']){
  qa(sel).forEach(x=>x.remove());
 }
 // Remove a opção textual mesmo quando for criada dentro de configurações/modais antigos.
 const candidates=qa('button,a,[role="button"],li,.setting-row,.settings-row,.menu-row,.control-row,.cs56-control-row,.sheet-row,.option-row');
 for(const el of candidates){
  const t=norm(el.textContent);
  if(t.includes('controles dos aparelhos')||t.includes('controle dos aparelhos')||t.includes('central dos aparelhos')||t.includes('gerenciar aparelho')||t==='controles do aparelho'||t==='configuracoes do aparelho'||t==='configuracao do aparelho')removeNode(el);
 }
 // Títulos ou cards sem botão próprio.
 for(const el of qa('h1,h2,h3,h4,strong,b,span,div')){
  const t=norm(el.textContent);
  if((t==='controles dos aparelhos'||t==='controle dos aparelhos'||t==='central dos aparelhos'||t==='configuracoes do aparelho'||t==='configuracao do aparelho')&& !el.closest('#cs63Home'))removeNode(el);
 }
}
function schedule(ms=8){clearTimeout(timer);timer=setTimeout(purge,ms)}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'&&(x.addedNodes.length||x.removedNodes.length)))schedule(0)});
try{obs.observe(document.documentElement,{subtree:true,childList:true})}catch(e){}
window.addEventListener('pageshow',()=>schedule(0));window.addEventListener('focus',()=>schedule(0));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(0)});
purge();setTimeout(purge,0);setTimeout(purge,100);setTimeout(purge,400);
})();