(async()=>{
const log={run:'corrected-generic-parser',model:'OFÖRÄNDRAD: endast enstaka gynnsamma/totala (kulor, lyckohjul, en tärning), säkert=1, omöjligt=0, intervall0..1; övrigt Jag vet inte',methodLimit:'Första körningens facit lästes efter avslut för rapportering. Denna parser frysas före start och innehåller endast de i förväg angivna förmågorna; inga facit/tabeller används.',questions:[],errors:[]};
const wait=()=>new Promise(r=>setTimeout(r,65));
const val=s=>{s=s.trim().replace('−','-').replace(',','.');if(/^-?\d+(\.\d+)?$/.test(s))return +s;if(/^\d+\/\d+$/.test(s)){let [a,b]=s.split('/').map(Number);return a/b}return null};
const decide=(q,opts)=>{
 let n=null,raw=null,why='Utanför fryst modell';let m;
 if(/två|flera|återläggning|minst en|förvänta|kombination|koder|hur många sätt|roller|försök/i.test(q))return {value:null,why};
 if((m=q.match(/(\d+) röda kulor och (\d+) blå kula/))&&/dra en röd/.test(q)){n=+m[1]/(+m[1]+ +m[2]);raw=m[1]+'/'+(+m[1]+ +m[2]);why='Röda / alla kulor'}
 else if((m=q.match(/lyckohjul har (\d+) lika stora fält\. (\d+) fält ger vinst/))){n=+m[2]/+m[1];raw=m[2]+'/'+m[1];why='Vinstfält / alla fält'}
 else if(/vanlig rättvis tärning/.test(q)){
 let sides=[1,2,3,4,5,6],good;
 if((m=q.match(/mindre än (\d+)/)))good=sides.filter(x=>x<+m[1]);
 else if((m=q.match(/större än (\d+)/)))good=sides.filter(x=>x>+m[1]);
 else if(/jämnt tal/.test(q))good=sides.filter(x=>x%2===0);
 else if(/udda tal/.test(q))good=sides.filter(x=>x%2===1);
 else if((m=q.match(/(?:få |för )(?:en |ett )?(\d+)/)))good=sides.filter(x=>x===+m[1]);
 if(good){n=good.length/6;raw=good.length+'/6';why='Gynnsamma tärningssidor '+good.join(',')+' / 6'}
 }
 else if(/omöjlig händelse/.test(q)){n=0;raw='0';why='Omöjligt = 0'}
 else if(/säker händelse/.test(q)){n=1;raw='1';why='Säkert = 1'}
 else if(/Vilket tal kan vara en sannolikhet/.test(q)){let indices=opts.map((s,i)=>({n:val(s),i})).filter(x=>x.n!==null&&x.n>=0&&x.n<=1);if(indices.length===1){n=indices[0].n;raw=opts[indices[0].i];why='Enda talet inom 0..1'}}
 if(n===null)return {value:null,why};
 return {value:n,raw,why,index:opts.findIndex(x=>{const v=val(x);return v!==null&&Math.abs(v-n)<1e-9})};
};
log.parserFrozenBeforeStart=true;
[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Starta elevläge')).click();
for(const [id,v] of [['adaptive-start','8'],['adaptive-category','sannolikhet'],['adaptive-limit','60']]){let el=document.getElementById(id);el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}))}
log.setup=document.querySelector('dialog[open]').innerText;
[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Starta kontrollen')).click();
await wait();
for(let i=0;i<60;i++){
 const d=document.querySelector('dialog[open]'),screen=d?.innerText||document.body.innerText;
 if(!/Uppgift \d+/.test(screen)){log.endText=screen;break}
 const q=screen.split('Svar sparas på den här enheten')[1].replace('Du kan använda papper när du räknar.','').split(/Välj ett svar|Ditt svar/)[0].trim();
 const opts=[...d.querySelectorAll('.choice-button')].map(x=>x.innerText.trim()),p=decide(q,opts);
 const e={number:i+1,screenBefore:screen,question:q,options:opts,computed:p,submitted:null};log.questions.push(e);
 if(p.value!==null&&opts.length&&p.index>=0){e.submitted=opts[p.index];d.querySelectorAll('.choice-button')[p.index].click();d.querySelector('.choice-submit').click()}
 else if(p.value!==null&&!opts.length){const input=d.querySelector('#adaptive-answer');if(!input||input.type==='hidden'){log.errors.push('Missing visible answer input');break}e.submitted=p.raw;input.value=p.raw;input.dispatchEvent(new Event('input',{bubbles:true}));const button=[...d.querySelectorAll('button')].find(x=>x.innerText.includes('Svara'));button.click()}
 else {e.submitted='Jag vet inte';d.querySelector('#adaptive-skip').click()}
 await wait();e.outcome=(document.querySelector('dialog[open]')||document.body).innerText;
 if(/Passet är klart/.test(e.outcome)){log.endText=e.outcome;break}
 if(e.outcome.match(/Uppgift (\d+)/)?.[1]===screen.match(/Uppgift (\d+)/)?.[1]){log.errors.push('Frågan avancerade inte');break}
}
window.pupilLowTranscript=log;return log;
})();
