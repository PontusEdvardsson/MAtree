/* The frozen policies are shared with the follow-up audit without alteration. */
window.createUnderstandingPolicy=()=>{
  const clean=s=>s.replace(/−/g,'-').replace(/,/g,'.').replace(/([+-])\s+(?=\d)/g,'$1');
  const nums=s=>(clean(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
  const canonical=s=>clean(s).replace(/\s/g,'');
  const numeric=s=>{
    const expression=canonical(s).replace(/×/g,'*').replace(/÷/g,'/');
    if(!/^[\d.+*/()\-]+$/.test(expression))return NaN;
    try{return Function('return ('+expression+')')();}catch{return NaN;}
  };
  function policy(kind,visible){
    const p=visible.prompt,n=nums(p),[a,b,c,d]=n;
    if(kind==='potens-multiplikation')return /Vad är n/.test(p)?b+d:/Beräkna/.test(p)?a**(b+d):'x^('+(a+b)+')';
    if(kind==='brak-division')return /Vilket tal saknas/.test(p)?`${a*d}/${b*c}`:`${a*d}/${b*c}`;
    if(kind==='kvadreringsregel')return /konstanttal/.test(p)?a*a:/koefficient/.test(p)?-2*a:`x² + ${2*a}x + ${a*a}`;
    if(kind==='klot-yta'){const radius=/diametern/.test(p)?a/2:a;return 4*3.14*radius*radius*(/halvklot/.test(p)?.5:1);}
    if(kind==='funktionsvarde')return a*c+b;
    if(kind==='upprepad-forandring'){const directions=[...p.matchAll(/höjs|sänks/g)].map(m=>m[0]==='höjs'?1:-1);return a*(1+directions[0]*b/100)*(1+directions[1]*c/100);}
    if(kind==='viktat-medel'){
      if(/Grupp A/.test(p))return (a*b+c*d)/(a+c);
      const sum=visible.table.reduce((s,row)=>s+numeric(row[0])*numeric(row[1]),0),count=visible.table.reduce((s,row)=>s+numeric(row[1]),0);
      return /summan/.test(p)?sum:sum/count;
    }
    if(kind==='trad-beroende'){
      const match=p.match(/först dra en (vit|svart) kula och sedan en (vit|svart)/);
      if(!match)return null;
      const first=match[1]==='vit'?a:b,second=match[2]==='vit'?a:b;
      return `${first*(second-(match[1]===match[2]?1:0))}/${(a+b)*(a+b-1)}`;
    }
    if(kind==='moms')return /Hur många kronor/.test(p)?a*b/100:/^Priset med moms/.test(p)?a/(1+b/100):a*(1+b/100);
    return null;
  }
  return {solve:policy,numeric,canonical};
};
/* Exploratory audit, not a validation of learner understanding.
   Policies receive only rendered prompts, choices and table cells. They never
   receive stored answers, correctness, template IDs or hidden visual metadata.
   Driver hooks navigate to skills and read results only after submissions.
   Run through understanding-scenarios.json in an isolated browser. */
window.runUnderstandingAudit=()=>{
  const $=s=>document.querySelector(s),M=MATREE,app=MATREE_APP;
  const cases=[
    ['tal','potens-multiplikation','potens-begrepp','Addera exponenter vid samma bas; beräkna med potensknappen.'],
    ['brak','brak-division','brak-likvardiga','Invertera andra bråket och multiplicera; lös luckan med samma bråkrutin.'],
    ['algebra','kvadreringsregel','tva-parenteser','Memorera a² och 2a för uttryck där x har koefficienten ett.'],
    ['geometri','klot-yta','cirkel-area','Memorera 4·3,14·r²; halvera diameter respektive krökt halvklotsyta.'],
    ['samband','funktionsvarde','funktion-begrepp','Läs tre tal i standardformen och beräkna k·x+m.'],
    ['procent','upprepad-forandring','forandringsfaktor','Applicera 1±p/100 två gånger utifrån orden höjs och sänks.'],
    ['statistik','viktat-medel','medel','Multiplicera tabellkolumner och summera; dividera med antalet vid medelvärde.'],
    ['sannolikhet','trad-beroende','trad-oberoende','Multiplicera två dragandelar; minska totalen och vid samma färg även täljaren.'],
    ['problem','moms','procent-baklanges','Pris utan moms gånger 1+p/100; pris med moms delat med samma faktor.']
  ];
  const {solve:policy,numeric,canonical}=window.createUnderstandingPolicy();
  const visible=()=>({
    prompt:$('#manual-question-title').textContent,
    options:[...document.querySelectorAll('#answer-form [data-choice]')].map(b=>b.lastElementChild.textContent),
    table:[...document.querySelectorAll('#skill-content .question-visual tbody tr')].map(row=>[...row.children].map(c=>c.textContent))
  });
  function submit(view,response,guess){
    if(view.options.length){
      let index=0;
      if(!guess){
        const desired=numeric(String(response));
        index=view.options.findIndex(label=>canonical(label)===canonical(String(response))||(Number.isFinite(desired)&&Math.abs(numeric(label)-desired)<1e-9));
        if(index<0)return {...view,supported:false,response};
      }
      document.querySelectorAll('#answer-form [data-choice]')[index].click();
    }else{
      if(response===null||!Number.isFinite(numeric(String(response))))return {...view,supported:false,response};
      $('#answer').value=String(response);$('#answer').dispatchEvent(new Event('input',{bubbles:true}));
    }
    const submittedResponse=view.options.length?$('#answer-form [aria-pressed="true"]').lastElementChild.textContent:$('#answer').value;
    $('#answer-form').requestSubmit();
    if(!$('#next-question'))throw Error('Response not accepted: '+$('#answer-error').textContent);
    // This read happens AFTER submitting. Neither feedback nor stored answer is
    // supplied to policy(), and no policy is adapted following the feedback.
    const feedback=$('#skill-content .feedback');
    const row={...view,response:guess?(view.options[0]||'0'):String(response),submittedResponse,supported:true,correct:!feedback.classList.contains('wrong'),feedback:feedback.innerText};
    $('#next-question').click();return row;
  }
  function runManual(id,guess){
    app.openSkill(id);document.querySelector('[data-start="'+id+'"]').click();
    const rows=[];
    for(let i=0;i<3;i++){
      const view=visible(),response=guess?0:policy(id,view),row=submit(view,response,guess);rows.push(row);
      if(!row.supported){$('#abandon-quiz').click();break;}
    }
    const latest=app.latest(id),summary=$('#skill-content').innerText;
    if($('#skill-dialog').open)$('#skill-dialog').close();
    return {rows,score:latest?.score??null,total:latest?.total??null,summary};
  }
  const audit=[];
  for(const [category,id,prerequisite,rule] of cases){
    $('#profile-button').click();$('#new-profile').value='Simulering '+category;
    $('#profile-form').requestSubmit();
    const before=runManual(prerequisite,true),advanced=runManual(id,false);
    app.openSkill(prerequisite);const prerequisiteAfter=$('#skill-content').innerText;$('#skill-dialog').close();
    const after=app.latest(prerequisite);
    if(before.score!==after.score)throw Error('Advanced result changed prerequisite evidence');
    audit.push({category,title:M.categories.find(c=>c.id===category).name,id,prerequisite,rule,before,advanced,prerequisiteAfter});
  }
  return audit;
};
