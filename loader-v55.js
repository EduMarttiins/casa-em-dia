(()=>{
  const current=new URL(location.href);
  const target=new URL('./start.html',location.href);
  target.searchParams.set('pwa','1');
  target.searchParams.set('legacy','loader55');
  target.searchParams.set('boot',String(Date.now()));
  try{
    const key='lousa:loader55:rescued69';
    if(localStorage.getItem(key)!=='1'){
      localStorage.setItem(key,'1');
      target.searchParams.set('force','1');
      target.searchParams.set('update',String(Date.now()));
    }
  }catch(error){}
  if(current.searchParams.get('androidapp')==='1')target.searchParams.set('androidapp','1');
  if(current.searchParams.get('apk'))target.searchParams.set('apk',current.searchParams.get('apk'));
  location.replace(target.toString());
})();
