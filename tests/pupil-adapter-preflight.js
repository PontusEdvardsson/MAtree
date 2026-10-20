window.verifyPupilAdapter = async () => {
  const host=document.createElement('section');document.body.append(host);
  // Synthetic fixture only; it never creates or grades a real pupil session.
  host.style.cssText='position:fixed;inset:0;z-index:99999;background:white;color:black';
  const results=[];
  function fixture({choices=false, reject=false, advance=true, finish=false, delay=0}={}) {
    host.innerHTML='<div class="student-progress">Uppgift 1 · högst 2</div><h1 id="student-question-title">Syntetisk inmatning</h1><form id="adaptive-answer-form">'+
      (choices?'<input id="adaptive-answer" type="hidden"><button type="button" class="choice-button">0</button><button type="button" class="choice-button">1/2</button>':'<input id="adaptive-answer">')+
      '<button type="submit"'+(choices?' disabled':'')+'>Svara</button><p id="adaptive-error"></p></form><button id="adaptive-skip">Jag vet inte</button>';
    const recorded=[];let selected=null;
    host.querySelectorAll('.choice-button').forEach((e,i)=>e.onclick=()=>{selected=i;host.querySelector('[type=submit]').disabled=false;});
    function record(value) {
      if(reject){host.querySelector('#adaptive-error').textContent='Syntetiskt formatfel';return;}
      recorded.push(value);
      if(advance)setTimeout(()=>{
        if(finish)host.innerHTML='<section data-pupil-complete>Slutrapport</section>';
        else host.querySelector('.student-progress').textContent='Uppgift 2 · högst 2';
      },delay);
    }
    host.querySelector('form').onsubmit=e=>{e.preventDefault();record(choices?selected:host.querySelector('#adaptive-answer').value);};
    host.querySelector('#adaptive-skip').onclick=()=>record('skip');
    return {recorded, adapter:createPupilDOMAdapter(host,{timeout:100,poll:2})};
  }
  const assert=(v,m)=>{if(!v)throw Error(m);};
  try {
    for(const value of [0,'0,25','−3','-3','2/7']) {
      const {adapter,recorded}=fixture(),view=adapter.read();
      await adapter.submit(view,{action:'answer',value});
      assert(recorded.length===1&&recorded[0]===String(value),'Wrong numeric delivery');
      results.push({case:'numeric',value,recorded,status:adapter.journal[0].status});
    }
    {
      const {adapter,recorded}=fixture({choices:true});
      await adapter.submit(adapter.read(),{action:'answer',index:1});
      assert(recorded.length===1&&recorded[0]===1,'Hidden input interfered');
      results.push({case:'choice with hidden input',recorded});
    }
    {
      const {adapter,recorded}=fixture({delay:20}),view=adapter.read();
      const first=adapter.submit(view,{action:'answer',value:0});
      let duplicate=false;try{await adapter.submit(view,{action:'answer',value:0});}catch(e){duplicate=/Duplicate/.test(e.message);}
      await first;assert(duplicate&&recorded.length===1,'Duplicate recorded');
      results.push({case:'concurrent duplicate blocked',recorded});
    }
    {
      const {adapter,recorded}=fixture();host.querySelector('[type=submit]').removeAttribute('type');
      await adapter.submit(adapter.read(),{action:'answer',value:0});
      assert(recorded.length===1,'Implicit submit not delivered');
      results.push({case:'implicit submit button',recorded});
    }
    for(const mode of ['reject','unconfirmed','skip','complete','missing']) {
      const {adapter,recorded}=fixture({reject:mode==='reject',advance:mode!=='unconfirmed',finish:mode==='complete'});
      let error=null;try{await adapter.submit(adapter.read(),mode==='skip'?{action:'skip'}:{action:'answer',value:mode==='missing'?null:0});}catch(e){error=e.message;}
      assert(mode==='reject'?recorded.length===0&&error?.includes('validation'):
        mode==='unconfirmed'?recorded.length===1&&error?.includes('acknowledgement'):
        mode==='missing'?recorded.length===0&&error?.includes('Missing'):recorded.length===1&&!error,'Unexpected '+mode);
      if(mode==='unconfirmed') {try{await adapter.submit(adapter.read(),{action:'answer',value:0});}catch(e){assert(e.message.includes('Duplicate'),'Retry not blocked');}assert(recorded.length===1,'Retry delivered');}
      results.push({case:mode,recorded,error,journal:adapter.journal});
    }
    return {passed:results.length,results,receiptLimit:'Synthetic recorder proves exactly one delivery; real DOM advancement alone does not prove durable storage.'};
  } finally {host.remove();}
};
