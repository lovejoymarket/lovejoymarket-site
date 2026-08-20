(() => {
  const form = document.querySelector('[data-tattoo-party-form]');
  if (!form) return;

  const destination = form.dataset.email || 'hello@lovejoymarket.co';
  const status = form.querySelector('[data-party-status]');
  const copyButton = form.querySelector('[data-party-copy]');
  const partyType = form.querySelector('[data-party-type]');
  const promoFields = form.querySelector('[data-party-promo-fields]');

  function value(name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function yesNo(name) {
    const field = form.elements.namedItem(name);
    return field && field.checked ? 'yes' : 'no';
  }

  function syncPromoFields() {
    if (!promoFields || !partyType) return;
    promoFields.hidden = partyType.value !== 'Co-Promoted Tattoo Party';
  }

  function buildInquiry() {
    return [
      'LOVEJOY TATTOO PARTY INQUIRY',
      '',
      'HOST',
      `Name: ${value('host_name')}`,
      `Email: ${value('email')}`,
      `Phone: ${value('phone')}`,
      `Party type: ${value('party_type')}`,
      `Occasion / event: ${value('occasion') || 'not provided'}`,
      '',
      'DATE + GROUP',
      `Preferred date: ${value('preferred_date')}`,
      `Backup date: ${value('backup_date')}`,
      `Preferred start time: ${value('start_time') || 'not provided'}`,
      `Expected duration: ${value('duration') || 'not provided'}`,
      `Total guests: ${value('total_guests')}`,
      `Estimated tattoo participants: ${value('tattoo_participants')}`,
      `18+ / valid ID acknowledged: ${yesNo('age_ack')}`,
      '',
      'TATTOO PLAN',
      `Payment plan: ${value('payment_plan')}`,
      `Tattoo setup: ${value('tattoo_setup')}`,
      `Color direction: ${value('color')}`,
      `Approx. budget per person: ${value('budget') || 'not provided'}`,
      `Expected placements: ${value('placements') || 'not provided'}`,
      '',
      'IDEAS / VIBE:',
      value('tattoo_ideas'),
      '',
      'PARTY LOGISTICS',
      `Food / drinks: ${value('food_drinks')}`,
      `Alcohol present: ${value('alcohol')}`,
      `Decor / setup requests: ${value('setup_requests') || 'none listed'}`,
      `Accessibility needs: ${value('accessibility') || 'none listed'}`,
      '',
      'PUBLIC PROMO (IF APPLICABLE)',
      `Business / organization: ${value('organization') || 'not provided'}`,
      `Social handles: ${value('social_handles') || 'not provided'}`,
      `Target promo launch: ${value('promo_launch') || 'not provided'}`,
      `Main graphic: ${value('graphics') || 'not provided'}`,
      `Promo plan: ${value('promo_plan') || 'not provided'}`,
      '',
      'OTHER NOTES',
      value('notes') || 'none',
      '',
      `Tattoo Party policies acknowledged: ${yesNo('policy_ack')}`
    ].join('\n');
  }

  function subject() {
    const host = value('host_name') || 'Host';
    const type = value('party_type') || 'Tattoo Party';
    const date = value('preferred_date') || 'Date TBD';
    return `TATTOO PARTY INQUIRY | ${host} | ${type} | ${date}`;
  }

  function composeUrls() {
    const body = buildInquiry();
    const sub = subject();
    return {
      mailto: `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`,
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destination)}&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`,
      copy: `${sub}\n\n${body}`
    };
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = `Copied. Paste it into an email to ${destination}. ♡`;
      return true;
    } catch (error) {
      if (status) status.textContent = 'The browser is being possessive. Try the email-app option instead.';
      return false;
    }
  }

  function isMobileLike() {
    return window.matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function openDesktopChooser(urls) {
    document.querySelector('[data-party-mail-choice]')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'party-mail-choice-backdrop';
    backdrop.dataset.partyMailChoice = '';
    backdrop.innerHTML = `
      <div class="party-mail-choice" role="dialog" aria-modal="true" aria-label="Choose how to create your tattoo party email">
        <div class="party-mail-choice-head">your tattoo party email is ready ♡</div>
        <div class="party-mail-choice-body">
          <p>Pick where you want to create it. Your form answers are already built into the message.</p>
          <div class="party-mail-choice-actions">
            <a href="${urls.gmail}" target="_blank" rel="noopener">open Gmail in browser →</a>
            <a href="${urls.mailto}">use my computer’s email app →</a>
            <button type="button" data-copy-choice>copy the inquiry instead →</button>
            <button type="button" class="party-mail-choice-close" data-close-choice>close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-close-choice]').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) backdrop.remove();
    });
    backdrop.querySelector('[data-copy-choice]').addEventListener('click', async () => {
      if (await copyText(urls.copy)) backdrop.remove();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const urls = composeUrls();
    if (status) status.textContent = 'Email ready. Add the useful reference images before you send it, cutie. ♡';

    if (isMobileLike()) {
      window.location.href = urls.mailto;
    } else {
      openDesktopChooser(urls);
    }
  });

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      await copyText(composeUrls().copy);
    });
  }

  if (partyType) partyType.addEventListener('change', syncPromoFields);
  syncPromoFields();
})();
