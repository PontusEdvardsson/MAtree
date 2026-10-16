/* Apply before the stylesheet paints; the preference is separate from pupil data. */
(() => {
  'use strict';
  const key='matree.theme.v1',root=document.documentElement,system=window.matchMedia('(prefers-color-scheme: dark)');
  let preference=null;
  function read(){try{const value=localStorage.getItem(key);return ['light','dark'].includes(value)?value:null;}catch{return null;}}
  const icons={
    light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    dark:'<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>'
  };
  function refresh(){
    const next=root.dataset.theme==='dark'?'light':'dark',label=next==='dark'?'Mörkt tema':'Ljust tema';
    for(const button of document.querySelectorAll('[data-theme-toggle]')){
      button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[next]+'</svg><span>'+label+'</span>';
      button.setAttribute('aria-label','Byt till '+label.toLowerCase());button.title='Byt till '+label.toLowerCase();
    }
  }
  function apply(){
    root.dataset.theme=preference||(system.matches?'dark':'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',root.dataset.theme==='dark'?'#111b17':'#f6f7f3');
    refresh();
  }
  function toggle(){
    preference=root.dataset.theme==='dark'?'light':'dark';
    try{localStorage.setItem(key,preference);}catch{/* The selected theme still works for this visit. */}
    apply();
  }
  preference=read();apply();
  document.addEventListener('DOMContentLoaded',refresh,{once:true});
  document.addEventListener('click',event=>{if(event.target.closest('[data-theme-toggle]'))toggle();});
  system.addEventListener('change',()=>{if(!preference)apply();});
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null){preference=read();apply();}});
  window.MATREE_THEME={refresh};
})();
