(() => {
  const M=window.MATREE,esc=M.renderAnswerFields?window.MATREE_APP.esc:x=>x;
  window.questionGallery=(cases)=>{
    const old=document.querySelector('#question-gallery');if(old)old.remove();
    document.body.classList.add('question-gallery-active');
    if(!document.querySelector('#gallery-style')){
      const style=document.createElement('style');style.id='gallery-style';style.textContent='.question-gallery-active>aside,.question-gallery-active>main{display:none!important}.question-gallery-active{background:#f5f7f2}#question-gallery{padding:24px}.gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.gallery-case{padding:18px;background:white;border:1px solid #d8e1d0;border-radius:8px;min-width:0}.gallery-case h2{font-size:13px;color:#607553;margin:0 0 12px}.gallery-case .prompt{font-size:18px;line-height:1.5;white-space:pre-line}.gallery-case .question-visual{width:100%;margin:18px 0}.gallery-case .question-visual svg{max-height:330px}.gallery-case .audit-answer{font-size:13px;color:#5b704f}@media(max-width:600px){.gallery-grid{grid-template-columns:1fr}#question-gallery{padding:14px}}';document.head.append(style);
    }
    const random=Math.random,samples=[];
    try{for(const c of cases){let seed=c.seed||91;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};samples.push({id:c.id,variant:c.v||0,q:M.generate(c.id,c.v||0)});}}
    finally{Math.random=random;}
    const section=document.createElement('section');section.id='question-gallery';section.innerHTML='<div class="gallery-grid">'+samples.map(s=>'<article class="gallery-case" data-sample="'+s.id+'"><h2>'+esc(s.id)+' · variant '+s.variant+'</h2><p class="prompt">'+esc(M.questionStem(s.q))+'</p>'+M.renderQuestionVisual(s.q)+'<p class="audit-answer">Facit: '+esc(M.answerText(s.q))+' '+esc(s.q.unit)+'</p></article>').join('')+'</div>';document.body.append(section);
    section.querySelectorAll('.gallery-case').forEach((card,i)=>{if(!samples[i].q.options)return;const list=document.createElement('ol');list.className='audit-options';list.style='font-size:16px;line-height:1.5;padding-left:24px';list.innerHTML=samples[i].q.options.map(s=>'<li>'+esc(s)+'</li>').join('');card.querySelector('.audit-answer').before(list);});
    window.gallerySamples=samples;scrollTo(0,0);return samples.map(s=>({id:s.id,prompt:M.questionStem(s.q),answer:M.answerText(s.q),visual:s.q.visual}));
  };
})();
