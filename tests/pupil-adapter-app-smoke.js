/* Technical compatibility check, not a knowledge-model experiment. */
window.verifyPupilAdapterApp = async () => {
  const $=s=>document.querySelector(s);
  $('#profile-button').click();$('#new-profile').value='Fiktiv adapterkontroll';$('#profile-form').requestSubmit();
  $('#adaptive-open').click();
  for(const [id,value] of [['adaptive-start','8'],['adaptive-category','sannolikhet'],['adaptive-limit','30']]) {
    $('#'+id).value=value;$('#'+id).dispatchEvent(new Event('change',{bubbles:true}));
  }
  $('#adaptive-setup').requestSubmit();
  const adapter=createPupilDOMAdapter($('#adaptive-dialog')),transcript=[];
  for(let i=0;i<30;i++) {
    const view=adapter.read();if(!view)break;
    transcript.push({view,receipt:await adapter.submit(view,{action:'skip'})});
  }
  if(!$('#student-complete-title'))throw Error('Natural completion missing');
  // Read ONLY this explicitly created fictional profile, AFTER natural end.
  const profile=MATREE_APP.profile();
  if(profile.name!=='Fiktiv adapterkontroll')throw Error('Unexpected profile');
  const session=profile.adaptive.sessions.at(-1);
  if(session.items.length!==transcript.length||session.items.some(x=>!x.skipped))throw Error('Receipt/archive mismatch');
  if(session.endReason!=='all-tested'||session.items.length!==22)throw Error('Unexpected coverage');
  return {kind:'technical smoke, not blind',answers:transcript.length,persisted:session.items.length,
    endReason:session.endReason,transcript,journal:adapter.journal};
};
