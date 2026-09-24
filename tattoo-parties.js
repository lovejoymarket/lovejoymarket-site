/* LoveJoy tattoo party inquiry: create an email, and show public-event questions only when useful. */
(() => {
  const form = document.querySelector('[data-tattoo-party-form]');
  if (!form) return;
  const destination = form.dataset.email || 'hello@lovejoymarket.co';
  const status = form.querySelector('[data-party-status]');
  const copyButton = form.querySelector('[data-party-copy]');
  const partyType = form.querySelector('[data-party-type]');
  const promoFields = form.querySelector('[data-party-promo-fields]');

  // Keep the date picker aligned with the 30-day party booking window.
  const earliest = new Date();
  earliest.setHours(12, 0, 0, 0);
  earliest.setDate(earliest.getDate() + 30);
  const earliestDate = `${earliest.getFullYear()}-${String(earliest.getMonth() + 1).padStart(2, '0')}-${String(earliest.getDate()).padStart(2, '0')}`;
  ['preferred_date', 'backup_date'].forEach((name) => {
    const field = form.elements.namedItem(name);
    if (field) field.min = earliestDate;
  });

  const params = new URLSearchParams(window.location.search);
  const party = params.get('party');
  if (party === 'private') partyType.value = 'Private Tattoo Party';
  if (party === 'public') partyType.value = 'Co-Promoted Tattoo Party';

  const value = (name) => {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  };
  const checked = (name) => form.elements.namedItem(name)?.checked ? 'yes' : 'no';
  const optional = (name) => value(name) || 'not decided yet';
  const isPublic = () => value('party_type') === 'Co-Promoted Tattoo Party';
  const syncPromoFields = () => { if (promoFields) promoFields.hidden = !isPublic(); };
  partyType.addEventListener('change', syncPromoFields);
  syncPromoFields();

  function body() {
    const lines = [
      'LOVEJOY TATTOO PARTY INQUIRY', '',
      'HOST',
      `Name: ${value('host_name')}`,
      `Email: ${value('email')}`,
      `Phone: ${value('phone')}`,
      `Party type: ${value('party_type')}`,
      `Occasion: ${optional('occasion')}`, '',
      'DATE AND GATHERING',
      `Preferred date: ${value('preferred_date')}`,
      `Backup date: ${optional('backup_date')}`,
      `Preferred start time: ${optional('start_time')}`,
      `Estimated duration: ${optional('duration')}`,
      `Kind of gathering: ${optional('event_size')}`,
      'Guest signup list: to be collected after booking, with available tattoo spots confirmed by Jessie.',
      `18+ and valid ID acknowledged: ${checked('age_ack')}`, '',
      'TATTOO IDEAS',
      `Who pays: ${value('payment_plan')}`,
      `Tattoo setup: ${value('tattoo_setup')}`,
      `Color: ${value('color')}`,
      `Rough budget per tattoo: ${optional('budget')}`,
      `Placements: ${optional('placements')}`,
      `Ideas / vibe: ${optional('tattoo_ideas')}`, '',
      'PARTY DETAILS',
      `Food / drinks: ${value('food_drinks')}`,
      `Alcohol: ${value('alcohol')}`,
      `Decor / setup: ${optional('setup_requests')}`,
      `Accessibility requests: ${optional('accessibility')}`
    ];
    if (isPublic()) lines.push('', 'PUBLIC EVENT / PROMOTION',
      `Organization: ${optional('organization')}`,
      `Social / website: ${optional('social_handles')}`,
      `Promo launch: ${optional('promo_launch')}`,
      `Flyer: ${value('graphics')}`,
      `Promo plan: ${optional('promo_plan')}`);
    lines.push('', 'OTHER NOTES', optional('notes'), '',
      `Party policies and $250 reservation deposit acknowledged: ${checked('policy_ack')}`,
      'I understand this is a request. My date is held only after approval and payment of the reservation deposit.');
    return lines.join('\n');
  }
  function subject() { return `TATTOO PARTY INQUIRY | ${value('host_name') || 'Host'} | ${value('preferred_date') || 'Date TBD'}`; }
  function messages() {
    const sub=subject(), text=body();
    return {
      mailto:`mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(text)}`,
      gmail:`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destination)}&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(text)}`,
      plain:`To: ${destination}\nSubject: ${sub}\n\n${text}`
    };
  }
  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(messages().plain);
      status.textContent=`Copied. Paste it into an email to ${destination}, attach any references, and send it. ♡`;
      return true;
    } catch (e) {
      status.textContent='Copy was blocked. Please use the create-email button instead.';
      return false;
    }
  }
  function desktopChoice(urls) {
    document.querySelector('[data-party-mail-choice]')?.remove();
    const backdrop=document.createElement('div');
    backdrop.className='party-mail-choice-backdrop';
    backdrop.dataset.partyMailChoice='';
    backdrop.innerHTML=`<div class="party-mail-choice" role="dialog" aria-modal="true" aria-label="Choose how to send your tattoo party inquiry">
      <div class="party-mail-choice-head">Your party email is ready ♡</div>
      <div class="party-mail-choice-body"><p>Choose where to open it. Please send the email there so I receive your inquiry.</p>
        <div class="party-mail-choice-actions"><a href="${urls.gmail}" target="_blank" rel="noopener">open in Gmail →</a>
        <a href="${urls.mailto}">open in my email app →</a>
        <button type="button" data-copy-choice>copy the inquiry →</button>
        <button type="button" class="party-mail-choice-close" data-close-choice>close</button></div></div></div>`;
    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-close-choice]').addEventListener('click',()=>backdrop.remove());
    backdrop.addEventListener('click',(e)=>{if(e.target===backdrop)backdrop.remove();});
    backdrop.querySelector('[data-copy-choice]').addEventListener('click',async()=>{if(await copyInquiry())backdrop.remove();});
  }
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const urls=messages();
    status.textContent='Your email is ready. Add any reference photos, then hit send in your email app. ♡';
    if(window.matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href=urls.mailto;
    } else desktopChoice(urls);
  });
  copyButton?.addEventListener('click',async()=>{if(form.reportValidity())await copyInquiry();});
})();
