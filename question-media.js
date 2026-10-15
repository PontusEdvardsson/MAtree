(() => {
  'use strict';
  const M=window.MATREE,esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const integer=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;

  M.draftQuestionKey=q=>JSON.stringify([q.prompt,q.answer,q.unit,q.answerKind||null,q.options||null,q.optionValues||null,q.visual||null,...(q.responseFormat?[q.responseFormat]:[])]);
  M.validateDraft=(q,draft)=>{
    if(draft===undefined||draft===null)return null;
    if(typeof draft!=='object'||typeof draft.questionKey!=='string'||draft.questionKey.length>20000||typeof draft.value!=='string'||draft.value.length>60)throw Error('Ogiltigt svarsutkast.');
    if(!q||draft.questionKey!==M.draftQuestionKey(q))return null;
    if(q.options&&draft.value!==''&&(!/^[1-4]$/.test(draft.value)||Number(draft.value)>q.options.length))throw Error('Ogiltigt valt alternativ i utkast.');
    return {questionKey:draft.questionKey,value:draft.value};
  };
  M.makeDraft=(q,value)=>M.validateDraft(q,{questionKey:M.draftQuestionKey(q),value});
  M.restoreDraft=(q,draft,inputId)=>{
    const saved=M.validateDraft(q,draft),input=document.getElementById(inputId);if(!saved||!input)return;
    input.value=saved.value;
    if(q.options){const form=input.closest('form');form.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===saved.value)));form.querySelector('.choice-submit').disabled=!saved.value;}
  };

  M.questionAnswerHint=q=>{
    if(q.options)return 'Välj ett av svarsalternativen.';
    if(q.answerKind==='choice'||q.prompt.includes('alternativets nummer'))return 'Skriv alternativets nummer.';
    if(q.answerKind==='fraction')return 'Skriv ett bråk med snedstreck, till exempel 1/2.';
    if(/^Avrunda .+ till heltal\./.test(q.prompt))return 'Skriv ett heltal.';
    if(q.answerKind==='decimal'||/decimalform/.test(q.prompt)){
      const small=q.answer!==0&&Math.abs(q.answer)<.01,finite=Math.abs(q.answer-Number(q.answer.toFixed(9)))<=1e-12*Math.max(1e-9,Math.abs(q.answer));
      return 'Skriv ett decimaltal med komma eller punkt.'+(finite?(small?' Skriv alla decimaler i svaret.':''):` Avrunda vid behov till ${small?'nio':'tre'} decimaler.`);
    }
    if(q.answer!==0&&Math.abs(q.answer)<.01)return 'Skriv talet utan avrundning, eller som ett exakt bråk.';
    if(q.answerKind==='integer')return 'Skriv ett heltal.';
    return 'Skriv ett tal eller bråk, till exempel 0,5 eller 1/2. Avrunda vid behov till tre decimaler.';
  };
  M.questionExtras=q=>{
    const out={};
    if(q.responseFormat!==undefined){if(q.responseFormat!=='decimal')throw Error('Ogiltigt svarsformat.');out.responseFormat=q.responseFormat;}
    if(q.answerKind!==undefined){if(!['integer','number','fraction','decimal','choice'].includes(q.answerKind))throw Error('Ogiltig svarstyp.');out.answerKind=q.answerKind;}
    if(q.templateId!==undefined){if(typeof q.templateId!=='string'||q.templateId.length>100)throw Error('Ogiltig frågemall.');out.templateId=q.templateId;}
    if(q.facet!==undefined){if(!integer(q.facet,0,2))throw Error('Ogiltig frågeaspekt.');out.facet=q.facet;}
    if(q.options!==undefined){
      if(q.answerKind!=='choice'||!Array.isArray(q.options)||!integer(q.options.length,2,4)||!q.options.every(x=>typeof x==='string'&&x.trim()&&x.length<=300)||new Set(q.options).size!==q.options.length||!integer(q.answer,1,q.options.length))throw Error('Ogiltiga svarsalternativ.');
      out.options=[...q.options];
      if(q.optionValues!==undefined){if(!Array.isArray(q.optionValues)||q.optionValues.length!==q.options.length||!q.optionValues.every(Number.isFinite))throw Error('Ogiltiga alternativvärden.');out.optionValues=[...q.optionValues];}
    }else if(q.optionValues!==undefined)throw Error('Alternativvärden saknar svarsalternativ.');
    if(q.visual!==undefined){
      const v=q.visual;let clean;
      if(!v||typeof v!=='object')throw Error('Ogiltigt bildunderlag.');
      if(['table','bars','line','pie','histogram','truncatedbars'].includes(v.type)){
        if(!Array.isArray(v.labels)||v.labels.length<2||v.labels.length>10||!v.labels.every(x=>typeof x==='string'&&x.length<=40)||!Array.isArray(v.values)||v.values.length!==v.labels.length||!v.values.every(x=>Number.isFinite(x)&&x>=0&&x<=10000))throw Error('Ogiltigt diagramunderlag.');
        clean={type:v.type,labels:[...v.labels],values:[...v.values]};
        if(['bars','line','histogram','truncatedbars'].includes(v.type)){if(!integer(v.step,1,1000)||Math.max(...v.values)/v.step>20||Math.max(...v.values)<=0)throw Error('Ogiltig diagramskala.');clean.step=v.step;}
        if(v.type==='truncatedbars'){if(!Number.isFinite(v.baseline)||v.baseline<0||v.baseline>=Math.min(...v.values))throw Error('Ogiltig axelstart.');clean.baseline=v.baseline;}
        if(v.type==='pie'&&v.values.some(x=>x<=0))throw Error('Ogiltiga sektorer.');
      }else if(v.type==='fraction'||v.type==='numberline'){
        const field=v.type==='fraction'?'shaded':'mark';if(!integer(v.parts,2,20)||!integer(v[field],0,v.parts))throw Error('Ogiltig indelning.');clean={type:v.type,parts:v.parts,[field]:v[field]};
      }else if(v.type==='grid'){if(!integer(v.rows,1,12)||!integer(v.cols,1,12))throw Error('Ogiltigt rutnät.');clean={type:v.type,rows:v.rows,cols:v.cols};}
      else if(v.type==='dots'){if(!integer(v.count,1,40))throw Error('Ogiltigt antal prickar.');clean={type:v.type,count:v.count};}
      else if(v.type==='coordinate'){if(!integer(v.x,0,7)||!integer(v.y,0,7))throw Error('Ogiltiga koordinater.');clean={type:v.type,x:v.x,y:v.y};}
      else if(v.type==='shape'){if(!['triangel','kvadrat','rektangel','femhörning','sexhörning'].includes(v.name))throw Error('Ogiltig figur.');clean={type:v.type,name:v.name};}
      else if(v.type==='triangle'){if(!Array.isArray(v.labels)||v.labels.length!==3||!v.labels.every(x=>typeof x==='string'&&x.length<=20)||typeof v.right!=='boolean')throw Error('Ogiltig triangel.');clean={type:v.type,labels:[...v.labels],right:v.right};}
      else if(v.type==='segments'){if(!integer(v.parts,2,12)||!integer(v.known,1,v.parts-1)||typeof v.label!=='string'||v.label.length>40)throw Error('Ogiltig sträckmodell.');clean={type:v.type,parts:v.parts,known:v.known,label:v.label};}
      else if(v.type==='boxplot'){if(!Array.isArray(v.stats)||v.stats.length!==5||!v.stats.every((x,i)=>Number.isFinite(x)&&x>=0&&x<=10000&&(!i||x>v.stats[i-1])))throw Error('Ogiltigt lådagram.');clean={type:v.type,stats:[...v.stats]};}
      else if(v.type==='venn'){if(!['left','both','right','outside'].every(k=>integer(v[k],0,1000)))throw Error('Ogiltigt venndiagram.');clean={type:v.type,left:v.left,both:v.both,right:v.right,outside:v.outside};}
      else if(v.type==='tree'){const probability=s=>typeof s==='string'&&/^\d{1,3}\/\d{1,3}$/.test(s)&&Number(s.split('/')[1])>0&&Number(s.split('/')[0])<=Number(s.split('/')[1]);if(!Array.isArray(v.first)||v.first.length!==2||!v.first.every(probability)||!Array.isArray(v.next)||v.next.length!==2||!v.next.every(a=>Array.isArray(a)&&a.length===2&&a.every(probability)))throw Error('Ogiltigt träddiagram.');clean={type:v.type,first:[...v.first],next:v.next.map(a=>[...a])};}
      else if(v.type==='xytable'){if(!Array.isArray(v.points)||v.points.length<2||v.points.length>10||!v.points.every(a=>Array.isArray(a)&&a.length===2&&a.every(x=>Number.isFinite(x)&&Math.abs(x)<=10000)))throw Error('Ogiltig sambandstabell.');clean={type:v.type,points:v.points.map(a=>[...a])};}
      else if(v.type==='cartesian'){
        const scalar=x=>Number.isFinite(x)&&Math.abs(x)<=10000,label=x=>typeof x==='string'&&x.length<=40;
        if(!['xMin','xMax','yMin','yMax','xStep','yStep'].every(k=>scalar(v[k]))||v.xMin>0||v.xMax<=0||v.yMin>0||v.yMax<=0||v.xStep<=0||v.yStep<=0||(v.xMax-v.xMin)/v.xStep>20||(v.yMax-v.yMin)/v.yStep>20)throw Error('Ogiltigt koordinatsystem.');
        const point=(x,y)=>scalar(x)&&scalar(y)&&x>=v.xMin&&x<=v.xMax&&y>=v.yMin&&y<=v.yMax;
        if(!Array.isArray(v.series)||v.series.length>3||!v.series.every(s=>s&&label(s.label)&&Array.isArray(s.points)&&s.points.length>=2&&s.points.length<=30&&s.points.every(a=>Array.isArray(a)&&a.length===2&&point(...a)))||!Array.isArray(v.points)||v.points.length>6||!v.points.every(p=>p&&point(p.x,p.y)&&label(p.label)))throw Error('Ogiltiga grafpunkter.');
        clean={type:v.type,...Object.fromEntries(['xMin','xMax','yMin','yMax','xStep','yStep'].map(k=>[k,v[k]])),series:v.series.map(s=>({label:s.label,points:s.points.map(a=>[...a])})),points:v.points.map(p=>({x:p.x,y:p.y,label:p.label}))};
      }
      else throw Error('Okänd bildtyp.');
      out.visual=clean;
    }
    return out;
  };
  M.renderAnswerFields=(q,inputId)=>q.options?`<fieldset class="choice-answers"><legend>Välj ett svar${q.unit?` (${esc(q.unit)})`:''}</legend><input id="${inputId}" type="hidden" value=""><div class="choice-grid">${q.options.map((text,i)=>`<button type="button" class="choice-button" data-choice="${i+1}" aria-pressed="false"><span class="choice-letter" aria-hidden="true"></span><span>${esc(text)}</span></button>`).join('')}</div><button class="primary-button choice-submit" disabled>Svara →</button></fieldset>`:`<label class="answer-label" for="${inputId}">Ditt svar${q.unit?` (${esc(q.unit)})`:''}</label><div class="input-row"><input id="${inputId}" type="text" autocomplete="off" maxlength="60" placeholder="Skriv ditt svar…" aria-describedby="${inputId==='answer'?'answer-help answer-error':'adaptive-hint adaptive-error'}"><button class="primary-button">Svara →</button></div>`;
  document.addEventListener('click',event=>{const button=event.target.closest('[data-choice]');if(!button)return;const form=button.closest('form');if(!form)return;form.querySelector('input').value=button.dataset.choice;form.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));form.querySelector('.choice-submit').disabled=false;form.dispatchEvent(new Event('matree-answer-change',{bubbles:true}));});
  M.renderQuestionVisual=q=>{
    const v=M.questionExtras(q).visual;if(!v)return '';
    if(v.type==='table')return `<div class="question-visual"><table><caption>Observationer</caption><thead><tr><th>Värde eller kategori</th><th>Antal</th></tr></thead><tbody>${v.labels.map((l,i)=>`<tr><th scope="row">${esc(l)}</th><td>${M.fmt(v.values[i])}</td></tr>`).join('')}</tbody></table></div>`;
    if(v.type==='xytable')return `<div class="question-visual"><table><caption>Samband mellan x och y</caption><thead><tr><th>x</th><th>y</th></tr></thead><tbody>${v.points.map(([x,y])=>`<tr><td>${M.fmt(x)}</td><td>${M.fmt(y)}</td></tr>`).join('')}</tbody></table></div>`;
    const text=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`,line=(x,y,X,Y)=>`<line x1="${x}" y1="${y}" x2="${X}" y2="${Y}"/>`;
    let content='',height=200,viewWidth=340,alt='Matematisk figur';
    if(v.type==='fraction'){const w=300/v.parts;for(let i=0;i<v.parts;i++)content+=`<rect x="${20+i*w}" y="50" width="${w}" height="65" fill="${i<v.shaded?'#799b61':'#fff'}"/>`;alt=`En helhet med ${v.parts} lika delar, ${v.shaded} är färgade.`;height=150;}
    if(v.type==='numberline'){content=line(20,90,320,90)+text(20,130,'0')+text(320,130,'1');for(let i=0;i<=v.parts;i++)content+=line(20+300*i/v.parts,80,20+300*i/v.parts,100);content+=`<circle cx="${20+300*v.mark/v.parts}" cy="90" r="6" fill="#285a44"/>`+text(20+300*v.mark/v.parts,65,'A');alt=`Tallinje från 0 till 1 i ${v.parts} lika steg. A är vid steg ${v.mark}.`;height=160;}
    if(v.type==='dots'){height=40+Math.ceil(v.count/8)*30;for(let i=0;i<v.count;i++)content+=`<circle cx="${45+i%8*33}" cy="${30+Math.floor(i/8)*30}" r="8" fill="#285a44" stroke="none"/>`;alt=`${v.count} prickar.`;}
    if(v.type==='grid'){const size=Math.min(28,280/v.cols,150/v.rows);height=40+v.rows*size;for(let y=0;y<v.rows;y++)for(let x=0;x<v.cols;x++)content+=`<rect x="${25+x*size}" y="${20+y*size}" width="${size}" height="${size}" fill="#eef4e8"/>`;alt=`Rutnät med ${v.rows} rader och ${v.cols} rutor per rad.`;}
    if(v.type==='shape'){const points={triangel:'170,20 70,160 270,160',kvadrat:'95,20 245,20 245,170 95,170',rektangel:'50,45 290,45 290,145 50,145',femhörning:'170,15 275,80 235,175 105,175 65,80',sexhörning:'105,25 235,25 290,100 235,175 105,175 50,100'};content=`<polygon points="${points[v.name]}" fill="#edf4e5"/>`;alt=`Figur med formen ${v.name}.`;}
    if(v.type==='coordinate')return M.renderQuestionVisual({...q,visual:{type:'cartesian',xMin:0,xMax:7,yMin:0,yMax:7,xStep:1,yStep:1,series:[],points:[{x:v.x,y:v.y,label:'A'}]}});
    if(v.type==='triangle'){height=240;content=`<polygon points="70,40 70,175 290,175" fill="#edf4e5"/>`+(v.right?'<polyline points="70,153 92,153 92,175" fill="none"/>':'')+text(40,110,v.labels[0])+text(180,199,v.labels[1])+text(192,94,v.labels[2])+text(170,230,'Figuren är inte skalenlig.');alt=`Triangel. Sidlängder eller okända: ${v.labels.join(', ')}. ${v.right?'Rät vinkel mellan de två första sidorna.':''}`;}
    if(v.type==='segments'){height=150;const w=300/v.parts;for(let i=0;i<v.parts;i++)content+=`<rect x="${20+i*w}" y="65" width="${w}" height="35" fill="${i<v.known?'#799b61':'#fff'}"/>`;content+=line(20,43,20+w*v.known,43)+line(20,36,20,50)+line(20+w*v.known,36,20+w*v.known,50)+text(20+w*v.known/2,28,v.label);alt=`${v.parts} lika långa delar, de första ${v.known} är markerade och tillsammans ${v.label}.`;}
    if(v.type==='boxplot'){
      height=235;viewWidth=400;const [min,q1,med,q3,max]=v.stats,X=x=>45+310*(x-min)/(max-min);
      content=line(X(min),115,X(max),115)+'<rect x="'+X(q1)+'" y="85" width="'+(X(q3)-X(q1))+'" height="60" fill="#eef4e8"/>'+line(X(med),85,X(med),145)+line(X(min),97,X(min),133)+line(X(max),97,X(max),133)+line(45,185,355,185);
      const tick=Math.max(1,Math.ceil((max-min)/8));
      for(let value=Math.ceil(min/tick)*tick;value<=max;value+=tick)content+=line(X(value),180,X(value),190)+text(X(value),213,value);
      v.stats.forEach((value,i)=>{const y=26+(i%2)*20;content+='<line x1="'+X(value)+'" y1="'+(y+7)+'" x2="'+X(value)+'" y2="75" stroke="#afbe9f" stroke-dasharray="3 3"/>'+text(X(value),y,value);});
      alt='Lådagram med min '+min+', Q1 '+q1+', median '+med+', Q3 '+q3+' och max '+max+'.';
    }
    if(v.type==='venn'){height=220;content='<rect x="10" y="10" width="320" height="180" fill="#fff"/><ellipse cx="125" cy="95" rx="82" ry="65" fill="#eef4e8"/><ellipse cx="215" cy="95" rx="82" ry="65" fill="#eef4e8" fill-opacity=".65"/>'+text(95,105,v.left)+text(170,105,v.both)+text(245,105,v.right)+text(310,178,v.outside)+text(95,50,'A')+text(245,50,'B');alt=`Venndiagram. Bara A: ${v.left}, både A och B: ${v.both}, bara B: ${v.right}, utanför båda: ${v.outside}.`;}
    if(v.type==='tree'){
      height=310;viewWidth=400;content=text(23,154,'Start');
      const probability=(x,y,s)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" style="font-size:15px;paint-order:stroke;stroke:#fff;stroke-width:5px;fill:#263e30">'+esc(s)+'</text>';
      content+=probability(105,18,'Första draget')+probability(255,18,'Andra draget');
      for(let i=0;i<2;i++){
        const y=i===0?70:215;
        content+=line(45,150,150,y)+probability(95,i===0?95:205,(i===0?'V':'S')+': '+v.first[i]);
        for(let j=0;j<2;j++){
          const end=y+(j===0?-40:40);
          content+=line(150,y,310,end)+probability(238,(y+end)/2+(j===0?-15:20),(j===0?'V':'S')+': '+v.next[i][j])+text(350,end+5,(i===0?'V':'S')+(j===0?'V':'S'));
        }
      }
      content+=probability(200,294,'V = vit kula, S = svart kula');
      alt='Träddiagram, V är vit och S svart. Första draget: '+v.first.join(', ')+'. Andra draget efter V: '+v.next[0].join(', ')+' och efter S: '+v.next[1].join(', ')+'.';
    }
    if(v.type==='cartesian'){
      height=360;viewWidth=400;
      const left=50,right=350,top=30,bottom=300,X=x=>left+(right-left)*(x-v.xMin)/(v.xMax-v.xMin),Y=y=>bottom-(bottom-top)*(y-v.yMin)/(v.yMax-v.yMin);
      const label=(x,y,value,extra='',color='#263e30')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" style="font-size:15px;paint-order:stroke;stroke:#fff;stroke-width:4px;fill:'+color+'" '+extra+'>'+esc(value)+'</text>';
      const axisX=X(0),axisY=Y(0),colors=['#285a44','#8a5730','#575199'],dashes=['','8 4','3 4'],occupied=[];
      let grid='',ticks='';
      for(let x=v.xMin;x<=v.xMax+1e-8;x+=v.xStep){grid+=line(X(x),top,X(x),bottom);if(Math.abs(x)>1e-8)ticks+=line(X(x),axisY-3,X(x),axisY+3)+label(X(x),Math.min(bottom+23,axisY+22),M.fmt(x));}
      for(let y=v.yMin;y<=v.yMax+1e-8;y+=v.yStep){grid+=line(left,Y(y),right,Y(y));if(Math.abs(y)>1e-8)ticks+=line(axisX-3,Y(y),axisX+3,Y(y))+label(Math.max(19,axisX-20),Y(y)+5,M.fmt(y));}
      content='<g stroke="#dee6d6" stroke-width="1">'+grid+'</g><g stroke="#344c40" stroke-width="2">'+line(axisX,top,axisX,bottom)+line(left,axisY,right,axisY)+'</g>'+ticks+label(axisX,axisY+21,'0')+label(right+22,axisY+5,'x')+label(axisX+14,top-10,'y');
      content+='<path d="M '+(right-6)+' '+(axisY-4)+' L '+right+' '+axisY+' L '+(right-6)+' '+(axisY+4)+' M '+(axisX-4)+' '+(top+6)+' L '+axisX+' '+top+' L '+(axisX+4)+' '+(top+6)+'" fill="none" stroke="#344c40" stroke-width="2"/>';
      v.series.forEach((series,i)=>{
        const dash=dashes[i]?' stroke-dasharray="'+dashes[i]+'"':'';
        content+='<polyline data-series="'+esc(series.label)+'" points="'+series.points.map(([x,y])=>X(x)+','+Y(y)).join(' ')+'" fill="none" stroke="'+colors[i]+'" stroke-width="3"'+dash+'/>';
        const candidates=series.points.slice(1,-1).reverse().concat(series.points);
        let position=null;
        for(const point of candidates){
          const x=X(point[0]),y=Y(point[1])+5;
          if(!occupied.some(p=>Math.abs(p.x-x)<28&&Math.abs(p.y-y)<22)){position={x,y};break;}
        }
        position||={x:right-14,y:top+20+i*24};occupied.push(position);
        content+=label(position.x,position.y,series.label,'data-series-label="'+esc(series.label)+'"',colors[i]);
        const lx=left+i*105;
        content+='<line x1="'+lx+'" y1="337" x2="'+(lx+27)+'" y2="337" stroke="'+colors[i]+'" stroke-width="3"'+dash+'/>'+label(lx+46,342,series.label);
      });
      v.points.forEach(p=>{
        const x=X(p.x),y=Y(p.y),lx=x>right-24?x-14:x+14,ly=y<top+24?y+22:y-12;
        content+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#285a44"/>'+label(lx,ly,p.label);
      });
      alt='Koordinatsystem. x från '+v.xMin+' till '+v.xMax+', y från '+v.yMin+' till '+v.yMax+'. '+v.series.map(s=>s.label+': '+s.points.map(p=>'('+p.join(', ')+')').join('; ')).join('. ')+' '+v.points.map(p=>p.label+': ('+p.x+', '+p.y+')').join('; ');
    }
    if(['bars','line','histogram','truncatedbars'].includes(v.type)){
      height=300;viewWidth=400;
      const left=52,right=365,top=35,bottom=250,max=Math.ceil(Math.max(...v.values)/v.step)*v.step,base=v.baseline||0,toY=value=>bottom-(bottom-top)*(value-base)/(max-base);
      let grid='',ticks='';
      for(let value=base;value<=max;value+=v.step){grid+=line(left,toY(value),right,toY(value));ticks+=text(27,toY(value)+5,M.fmt(value));}
      content='<g stroke="#dee6d6" stroke-width="1">'+grid+'</g>'+ticks+'<g stroke="#344c40" stroke-width="2">'+line(left,top,left,bottom)+line(left,bottom,right,bottom)+'</g>';
      content+='<text x="'+left+'" y="18" text-anchor="start" style="font-size:15px">'+(v.type==='histogram'?'Antal observationer':'Värde')+'</text>';
      const xs=v.labels.map((_,i)=>left+(i+.5)*(right-left)/v.labels.length);
      if(v.type==='line')content+='<polyline points="'+xs.map((x,i)=>x+','+toY(v.values[i])).join(' ')+'" fill="none" stroke="#285a44" stroke-width="3"/>';
      v.labels.forEach((label,i)=>{
        const center=xs[i],width=v.type==='histogram'?(right-left)/v.labels.length:Math.min(36,(right-left)/v.labels.length*.6);
        content+=v.type!=='line'?'<rect x="'+(center-width/2)+'" y="'+toY(v.values[i])+'" width="'+width+'" height="'+(bottom-toY(v.values[i]))+'" fill="#799b61"/>':'<circle cx="'+center+'" cy="'+toY(v.values[i])+'" r="5" fill="#285a44"/>';
        content+='<text x="'+center+'" y="279" text-anchor="middle" style="font-size:15px">'+esc(label)+'</text>';
      });
      if(v.type==='truncatedbars')content+='<path d="M '+(left-4)+' '+(bottom+4)+' l 8 4 l -8 4 l 8 4" fill="none" stroke="#344c40" stroke-width="2"/>';
      alt=(v.type==='line'?'Linjediagram':v.type==='histogram'?'Histogram':'Stapeldiagram')+'. Axeln börjar vid '+base+'. Skalsteg '+v.step+'. '+v.labels.map((label,i)=>label+': '+v.values[i]).join(', ')+'.';
    }
    if(v.type==='pie'){
      height=260;const sum=v.values.reduce((a,b)=>a+b,0);let angle=-Math.PI/2;
      v.values.forEach((value,i)=>{const delta=2*Math.PI*value/sum,end=angle+delta,mid=angle+delta/2;content+=`<path d="M 170 110 L ${170+90*Math.cos(angle)} ${110+90*Math.sin(angle)} A 90 90 0 ${delta>Math.PI?1:0} 1 ${170+90*Math.cos(end)} ${110+90*Math.sin(end)} Z" fill="${i===0?'#799b61':'#e1e7d8'}"/>`+text(170+55*Math.cos(mid),115+55*Math.sin(mid),v.labels[i]);angle=end;});
      content+=text(170,235,`${v.labels[0]}: ${M.fmt(v.values[0]/sum*360)}° av 360°`);alt=`Cirkeldiagram. ${v.labels.map((l,i)=>`${l}: ${M.fmt(v.values[i]/sum*360)} grader`).join(', ')}.`;
    }
    return `<div class="question-visual"><svg viewBox="0 0 ${viewWidth} ${height}" role="img" aria-label="${esc(alt)}">${content}</svg></div>`;
  };
})();
