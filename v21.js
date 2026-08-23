(()=>{
'use strict';
if(window.__CASATODA_PHOTO_FIX_23__)return;
window.__CASATODA_PHOTO_FIX_23__=true;
const P={family:new URL('./media21/family.jpg?v=23',location.href).href,bernardo:new URL('./media21/bernardo.jpg?v=23',location.href).href,julia:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAwADADASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAABgQFAwIH/8QALhAAAgEDAgQEBQUBAAAAAAAAAQIDAAQRBSESMUFRBhMiYUJScYGRIzJiseHR/8QAFwEBAQEBAAAAAAAAAAAAAAAAAwECBP/EABsRAAMBAQEBAQAAAAAAAAAAAAABAhEhEjFB/9oADAMBAAIRAxEAPwDYhh0fRSA7pJMPiI4m/wAqhvEmlspSTzOA88x7Ggt/dmJuCP1Stvk9Pes42stw2ZGeRj3O1E7OvylxDC90/RNRZn0y+jgmO/lOcKf+UcureW2l4Jl4T0PMEdweorQ0Dw3avmeVONk+XkD/AEarvrCEQYGPJJ9LoNgfp0NT2g6gONU7jByKtu7Z7dsNup5EcjUMrY2xk1v6EW20RmcytuXOaRabYCUcCj1HrRqCV7fYgkqSoH8geVUDWbmyvE4JFLjdlB5Ciw6tWG75eoQaktssZSyBwSMgn70qh0+2mt2XywpYYO3P6jrXLR9Qj1K2WXChsb5qq3lyeJSDH0OMZrJcwH39kbSeS2mUmLmAe3cHtR+8sGgYlRlOhp/4mMT6cbk4JgIbiHYnBo3MqoF4jmKQZRuYqzWB1KZl62LKDUpmjmLJKQWReh+Ye9RwW6rOyyMrlhxI45MO9YkshZiScmu9tckqInyVzlcHBU+xpKQc33oktri6sMtBKVTP5FIrbWheBl4mESnDEnc+21B5Lu5tYw7p58HzrsR9RXmy1mNJv0o2Uk8jWM/Rla0+ja/6vDd0FHCGQAD7ihmm3ZNrJZ3BOE3U9QP85/nvW4J7jULVVY5Qj9oNYtxZNb8c5wpi55+IVkrW9P/Z'};
function put(sel,src,alt){const c=document.querySelector(sel);if(!c)return;c.textContent='';const i=document.createElement('img');i.src=src;i.alt=alt;i.loading='eager';i.decoding='async';i.style.width='100%';i.style.height='100%';i.style.objectFit='cover';i.style.objectPosition='center 28%';c.appendChild(i)}
function apply(){
put('#authGate [data-login-role="parent"] .profile-photo',P.family,'Família');
put('#authGate [data-login-role="bernardo"] .profile-photo',P.bernardo,'Bernardo');
put('#authGate [data-login-role="julia"] .profile-photo',P.julia,'Júlia');
put('[data-v15-child="bernardo"] .v15-tab-avatar',P.bernardo,'Bernardo');
put('[data-v15-child="julia"] .v15-tab-avatar',P.julia,'Júlia');
document.querySelectorAll('#people .person').forEach(c=>{let id=c.dataset.person;try{if(!id)id=(typeof isChildSession==='function'&&isChildSession())?sessionRole:selected}catch(e){};if(id==='bernardo')put('#people .person'+(c.dataset.person?'[data-person="bernardo"]':'')+' .avatar',P.bernardo,'Bernardo');if(id==='julia')put('#people .person'+(c.dataset.person?'[data-person="julia"]':'')+' .avatar',P.julia,'Júlia')});
try{if(typeof state==='object'&&state){state.settings=state.settings||{};state.settings.parentPhoto=P.family;const b=state.children?.find(x=>x.id==='bernardo'),j=state.children?.find(x=>x.id==='julia');if(b)b.photo=P.bernardo;if(j)j.photo=P.julia;state.settings.casaTodaMediaVersion=23;if(typeof save==='function')save()}}catch(e){}
}
let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,40)}).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('pageshow',apply);document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply()});
setTimeout(apply,0);setTimeout(apply,400);setTimeout(apply,1500);
})();
