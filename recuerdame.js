(() => {
  'use strict';
  const styles = Object.freeze({ allura: 'Allura', 'great-vibes': 'Great Vibes', parisienne: 'Parisienne', 'old-english': 'Old English (UnifrakturMaguntia)', questrial: 'Questrial', 'courier-new': 'Courier New' });
  const categories = Object.freeze({ allura: 'Flowing script', 'great-vibes': 'Flourished script', parisienne: 'Delicate script', 'old-english': 'Blackletter', questrial: 'Sans serif', 'courier-new': 'Typewriter · monospaced' });
  const clean = value => String(value ?? '').replace(/\r\n?/g, '\n').normalize('NFC');
  function textError(text, confirmation) {
    text = clean(text);
    confirmation = clean(confirmation);
    if (!text.trim()) return 'Enter the exact name, initials, or memorial date you want tattooed.';
    const lines = text.split('\n');
    if (lines.length > 2) return 'Two lines maximum. Please shorten your memorial text.';
    if (lines.some(line => !line.trim())) return 'Please remove empty lines from your memorial text.';
    if (text.length > 60) return 'Please keep your memorial text to 60 characters or fewer; final fit still needs approval.';
    if (text !== confirmation) return 'Both entries must match exactly, including spelling, dates, spaces, capitalization, and accents.';
    return '';
  }
  function validate(data) {
    const error = textError(data.memorial_text, data.memorial_confirm);
    if (error) return error;
    if (!styles[data.lettering]) return 'Choose one of the six lettering styles.';
    if (!String(data.preferred_color || '').trim() || !String(data.backup_color || '').trim()) return 'Please provide your preferred ink color and a backup color.';
    if (String(data.preferred_color).trim().toLowerCase() === String(data.backup_color).trim().toLowerCase()) return 'Choose a different backup color.';
    const size = Number(data.memorial_size);
    if (!Number.isFinite(size) || size < 1 || size > 5) return 'Choose an overall tattoo size from 1 to 5 inches.';
    if (data.booking_acknowledged !== 'yes' || data.spelling_acknowledged !== 'yes') return 'Please acknowledge the event terms and confirm your exact text.';
    if (data.guest === 'child' && (data.child_acknowledged !== 'yes' || !String(data.child_details || '').trim())) return 'If bringing a child is necessary, include their age and acknowledge that advance approval is required.';
    return '';
  }
  function payloadLines(data) {
    return [
      '', 'RECUÉRDAME | IN LOVING MEMORY',
      'Exact memorial text (confirmed twice):', clean(data.memorial_text),
      `Preferred lettering style (reference only): ${styles[data.lettering]}`,
      'Jessica will prepare three or four lettering options in a similar style. The client chooses the final option, with recommendations based on flow, placement, and the appearance of their specific letters.',
      `Overall size requested: ${data.memorial_size} inches; maximum 5 inches in either direction`,
      `Preferred ink color: ${data.preferred_color}`,
      `Backup ink color: ${data.backup_color}`,
      'One color only; final shade to be agreed before the appointment.',
      'Memorial-only, two-line, size, new-tattoo, and one-hour limits acknowledged: yes',
      'Exact spelling, dates, capitalization, accents, and preferred lettering style confirmed: yes; final lettering chosen after reviewing the options.',
      ...(data.guest === 'child' ? [`Child details: ${data.child_details}`, 'Advance child approval requested; one-guest limit and studio-not-equipped acknowledgment: yes'] : []),
      ''
    ];
  }
  globalThis.LoveJoyMemorial = { styles, textError, validate, payloadLines };
  if (typeof document === 'undefined') return;
  const markup = `<fieldset class="memorial-fields" data-memorial-fields disabled hidden>
    <legend>1. Your memorial</legend>
    <div class="tattoo-form-grid">
      <label><span>Exact memorial text *</span><textarea name="memorial_text" rows="2" maxlength="60" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="José\n1954–2024" aria-describedby="memorial-text-help" required></textarea></label>
      <label><span>Enter the exact text again *</span><textarea name="memorial_confirm" rows="2" maxlength="60" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Repeat both lines exactly" required></textarea></label>
    </div>
    <p class="booking-note" id="memorial-text-help">Two lines maximum. Repeat spelling, numbers, capitals, accents, and line breaks exactly.</p>
    <p class="memorial-match" data-memorial-match role="status" aria-live="polite">Enter your memorial text twice to continue.</p>
    <fieldset class="memorial-fonts" aria-describedby="memorial-font-guide"><legend>Choose a lettering style. Previews update as you type. *</legend>
      ${Object.entries(styles).map(([key, label], i) => `<label class="memorial-font-card"><input type="radio" name="lettering" value="${key}" ${i === 0 ? 'checked' : ''} required/><span class="memorial-font-meta">${key === 'old-english' ? 'Old English' : label}<small class="memorial-font-category">${categories[key]}</small></span><span class="memorial-font-sample memorial-font-${key}" data-memorial-sample="${key}" aria-hidden="true">Recuérdame</span></label>`).join('')}
    </fieldset>
    <p class="memorial-font-guide" id="memorial-font-guide"><strong>Your font selection is a starting point.</strong> I’ll prepare three or four options in a similar style. You choose the final lettering, with my recommendations based on flow, placement, and how your specific letters look.</p>
    <div class="tattoo-form-grid">
      <label><span>Overall size, in inches *</span><input name="memorial_size" type="number" min="1" max="5" step="0.25" value="5" required/></label>
      <label><span>Placement *</span><input name="placement" type="text" required maxlength="160" placeholder="For example: outer forearm"/></label>
    </div>
    <p class="booking-note">The whole tattoo must fit within 5 inches in either direction. No feet or intimate areas.</p>
    <div class="tattoo-form-grid">
      <label><span>Preferred ink color *</span><input name="preferred_color" type="text" maxlength="80" placeholder="For example: deep red" required/></label>
      <label><span>Backup ink color *</span><input name="backup_color" type="text" maxlength="80" placeholder="A different color you would be happy with" required/></label>
    </div>
    <p class="booking-note">One ink color. We’ll agree on the shade in advance for contrast and healed appearance. Requested ink is secured after your deposit is paid, subject to availability.</p>
    <div class="booking-checks"><label><input name="spelling_acknowledged" type="checkbox" value="yes" required/><span>I confirm the exact spelling, dates, capitals, accents, and line breaks shown above.</span></label></div>
  </fieldset>`;
  function syncForm(form) {
    const active = form.elements.namedItem('session')?.value === 'recuerdame';
    const group = form.querySelector('[data-memorial-fields]');
    if (!group) return;
    group.hidden = !active;
    group.disabled = !active;
    form.querySelectorAll('[data-memorial-regular-field]').forEach(label => {
      label.hidden = active;
      label.querySelectorAll('input, select, textarea').forEach(input => { input.disabled = active; });
    });
    const child = active && form.elements.namedItem('guest').value === 'child';
    form.querySelector('[data-memorial-child]').hidden = !child;
    ['child_details', 'child_acknowledged'].forEach(name => {
      const input = form.elements.namedItem(name);
      input.disabled = !child;
      input.required = child;
    });
    const oneGuest = form.querySelector('[data-booking-guest-copy]');
    if (oneGuest) oneGuest.textContent = active
      ? 'One guest maximum, with advance notice. No children without advance approval. If bringing a child is necessary, disclose this below; the child counts as your one guest.'
      : 'One guest maximum. Please let me know beforehand if someone is joining you. Children count toward the one-guest limit.';
    refreshText(form);
  }
  const measureContext = document.createElement('canvas').getContext('2d');
  function fitSamples(form) {
    if (!measureContext) return;
    const bases = { allura: 44, 'great-vibes': 42, parisienne: 42, 'old-english': 36, questrial: 32, 'courier-new': 30 };
    form.querySelectorAll('[data-memorial-sample]').forEach(sample => {
      const width = sample.getBoundingClientRect().width - 6;
      if (width <= 0) return;
      const base = bases[sample.dataset.memorialSample] || 38;
      measureContext.font = `${base}px ${getComputedStyle(sample).fontFamily}`;
      const measured = Math.max(...clean(sample.textContent).split('\n').map(line => measureContext.measureText(line).width), 1);
      sample.style.setProperty('--memorial-sample-size', Math.max(9, Math.min(base, base * width / measured)) + 'px');
    });
  }
  function refreshText(form) {
    const active = form.elements.namedItem('session')?.value === 'recuerdame';
    const text = form.elements.namedItem('memorial_text');
    const confirm = form.elements.namedItem('memorial_confirm');
    const error = active ? textError(text.value, confirm.value) : '';
    confirm.setCustomValidity(error);
    const lineCount = clean(text.value).split('\n').length;
    text.setCustomValidity(active && lineCount > 2 ? 'Two lines maximum.' : '');
    const match = form.querySelector('[data-memorial-match]');
    match.textContent = error || 'Your entries match. Please check the lettering and confirm the text below.';
    match.dataset.valid = String(!error);
    form.querySelectorAll('[data-memorial-sample]').forEach(sample => { sample.textContent = text.value.trim() ? clean(text.value) : 'Recuérdame'; });
    fitSamples(form);
    form.querySelectorAll('.memorial-font-card').forEach(card => { card.classList.toggle('is-selected', card.querySelector('input').checked); });
    form.querySelectorAll('button[type="submit"], [data-booking-copy]').forEach(button => { button.disabled = active && Boolean(error); });
  }
  globalThis.LoveJoyMemorial.syncForm = syncForm;
  document.querySelectorAll('[data-booking-inquiry="memorial"]').forEach(form => {
    const idea = form.elements.namedItem('idea').closest('label');
    idea.insertAdjacentHTML('beforebegin', markup);
    ['idea', 'size', 'color'].forEach(name => form.elements.namedItem(name)?.closest('label')?.setAttribute('data-memorial-regular-field', ''));
    const oldRule = [...form.querySelectorAll('.booking-rules p')].find(p => p.textContent.includes('One guest maximum'));
    if (oldRule) oldRule.setAttribute('data-booking-guest-copy', '');
    ['memorial_text', 'memorial_confirm', 'lettering'].forEach(name => {
      const entries = form.querySelectorAll(`[name="${name}"]`);
      entries.forEach(input => input.addEventListener(name === 'lettering' ? 'change' : 'input', () => {
        form.elements.namedItem('spelling_acknowledged').checked = false;
        refreshText(form);
      }));
    });
    form.elements.namedItem('guest').addEventListener('change', () => syncForm(form));
  });
  const previewForms = [...document.querySelectorAll('[data-booking-inquiry="memorial"]')];
  const fitAll = () => previewForms.forEach(fitSamples);
  document.fonts?.ready.then(fitAll);
  document.fonts?.addEventListener('loadingdone', fitAll);
  if (typeof ResizeObserver !== 'undefined') {
    const previewResize = new ResizeObserver(fitAll);
    previewForms.forEach(form => previewResize.observe(form));
  }
})();
