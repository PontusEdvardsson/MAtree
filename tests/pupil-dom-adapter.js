/* Test helper only. No grading, policies, app state or storage access. */
window.createPupilDOMAdapter = (root, {timeout = 700, poll = 10} = {}) => {
  const attempts = new Map(), journal = [];
  const visible = e => !!e && !e.hidden && e.type !== 'hidden' &&
    e.getClientRects().length > 0 && getComputedStyle(e).visibility === 'visible';
  const all = selector => [...root.querySelectorAll(selector)].filter(visible);
  const one = selector => {
    const found = all(selector);
    if (found.length !== 1) throw Error('Expected one visible control: ' + selector);
    return found[0];
  };
  const read = () => {
    const title = all('#student-question-title')[0];
    if (!title) return null;
    const sequence = one('.student-progress').innerText.match(/Uppgift\s+(\d+)/)?.[1];
    if (!sequence) throw Error('Missing visible question number');
    const prompt = title.innerText.trim();
    return Object.freeze({token: sequence + ':' + prompt, prompt,
      options: Object.freeze(all('.choice-button').map(e => e.innerText.trim()))});
  };
  async function submit(view, decision) {
    if (!view || read()?.token !== view.token) throw Error('Stale question');
    if (attempts.has(view.token)) throw Error('Duplicate attempt blocked');
    if (!decision || !['answer', 'skip'].includes(decision.action)) throw Error('Invalid action');
    let button;
    if (decision.action === 'skip') button = one('#adaptive-skip');
    else {
      const choices = all('.choice-button');
      if (choices.length) {
        if (!Number.isInteger(decision.index) || !choices[decision.index]) throw Error('Invalid choice index');
        if (choices[decision.index].disabled) throw Error('Choice disabled');
        choices[decision.index].click();
      } else {
        if (decision.value === null || decision.value === undefined || String(decision.value).trim() === '')
          throw Error('Missing answer; explicit skip required');
        const input = one('#adaptive-answer');
        if (input.disabled || input.readOnly) throw Error('Input unavailable');
        // String(0) is a valid response. No truthiness check or numeric coercion.
        input.value = String(decision.value);
        input.dispatchEvent(new Event('input', {bubbles:true}));
        input.dispatchEvent(new Event('change', {bubbles:true}));
      }
      const submits=all('#adaptive-answer-form button').filter(e=>e.type==='submit');
      if(submits.length!==1)throw Error('Expected one visible submit button');
      button=submits[0];
    }
    if (button.disabled) throw Error('Submit disabled');
    const entry = {token:view.token, action:decision.action, status:'attempted'};
    attempts.set(view.token, entry); journal.push(entry);
    button.click(); // One click only; no automatic retries after uncertain delivery.
    const deadline = performance.now() + timeout;
    while (performance.now() < deadline) {
      const next = read();
      if (next && next.token !== view.token) {entry.status='advanced';return {...entry};}
      if (!next && all('[data-pupil-complete], .student-complete').length) {
        entry.status='completed'; return {...entry};
      }
      const error = all('#adaptive-error')[0]?.innerText.trim();
      if (error) {entry.status='rejected';throw Error('Visible validation: '+error);}
      await new Promise(resolve => setTimeout(resolve,poll));
    }
    entry.status='unconfirmed';
    throw Error('No visible acknowledgement; stop and inspect, do not retry');
  }
  return Object.freeze({read, submit, journal});
};
