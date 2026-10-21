window.holisticRootContrast=()=>{
 const selectors=['.workspace-label','.category-button','.node-title','.node-bottom>span:first-child','.group-open','.scroll-hint','#node-count','#map-title','.save-status','.page-footer'];
 const parse=c=>{const x=document.createElement('canvas').getContext('2d');x.fillStyle=c;x.fillRect(0,0,1,1);return [...x.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v)};
 const blend=(f,b)=>f.slice(0,3).map((v,i)=>v*f[3]+b[i]*(1-f[3]));
 const lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 return selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(e=>e.getClientRects().length).slice(0,3).map(e=>{
  let nodes=[];for(let p=e;p;p=p.parentElement)nodes.unshift(p);
  let bg=[255,255,255];for(const p of nodes)bg=blend(parse(getComputedStyle(p).backgroundColor),bg);
  const s=getComputedStyle(e),fg=blend(parse(s.color),bg),a=lum(fg),b=lum(bg);
  return {selector,text:e.innerText.trim().slice(0,100),fontSize:s.fontSize,fg:s.color,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),note:'Solid background approximation; no opacity/gradient or complete accessibility audit'};
 }));
};