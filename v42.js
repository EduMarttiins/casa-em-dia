(()=>{
'use strict';
if(window.__CASATODA_42__)return;
window.__CASATODA_42__=true;
function cleanup(){
 ['ctDeviceControl42','ctProtectionTest38','ctProtectionTest40','ctProtectionTest41'].forEach(id=>document.getElementById(id)?.remove());
 document.getElementById('ctDeviceControl42Modal')?.remove();
}
cleanup();
setTimeout(cleanup,300);
setTimeout(cleanup,1200);
})();
