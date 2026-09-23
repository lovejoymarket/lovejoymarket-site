(() => {
  function v(form, name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function mailto(payload) {
    return `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
  }

  function tattooPayload(form) {
    const name = v(form,'name') || 'Client';
    const session = v(form,'session') || 'Tattoo';
    return {
      to: form.dataset.email || 'hello@lovejoymarket.co',
      subject: `TATTOO INQUIRY | ${name} | ${session}`,
      body: [
        'LOVEJOY TATTOO INQUIRY','',
        `Name: ${v(form,'name')}`,
        `Email: ${v(form,'email')}`,
        `Phone: ${v(form,'phone') || 'not provided'}`,
        `Session: ${session}`,
        `Placement: ${v(form,'placement')}`,
        `Approx. size: ${v(form,'size')}`,
        `Color direction: ${v(form,'color')}`,
        `Availability: ${v(form,'availability') || 'not provided'}`,
        '','IDEA:',v(form,'idea'),'','OTHER NOTES:',v(form,'notes') || 'none',
        '','ATTACH BEFORE SENDING: reference images + clear placement photo'
      ].join('\n')
    };
  }

  function asapPayload(form) {
    const name = v(form,'name') || 'Client';
    const session = v(form,'session') || 'Session not chosen';
    return {
      to: form.dataset.email || 'hello@lovejoymarket.co',
      subject: `GET IN ASAP | ${name} | ${session}`,
      body: [
        'LOVEJOY GET IN ASAP','',
        `Name: ${v(form,'name')}`,
        `Email: ${v(form,'email')}`,
        `Phone: ${v(form,'phone')}`,
        `Session: ${session}`,
        `FIRST CHOICE: ${v(form,'first_choice')}`,
        `BACKUP CHOICE: ${v(form,'backup_choice')}`,
        `Placement: ${v(form,'placement')}`,
        `Approx. size: ${v(form,'size')}`,
        `Color direction: ${v(form,'color')}`,
        '','IDEA:',v(form,'idea'),'','OTHER NOTES:',v(form,'notes') || 'none',
        '','DEPOSIT LINK:', 'https://square.link/u/exMcKsyN',
        'Client may pay the 50% deposit before receiving a reply.',
        '','ATTACH BEFORE SENDING: reference images + clear placement photo'
      ].join('\n')
    };
  }

  async function copyPayload(payload, status) {
    try {
      await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.body}`);
      if (status) status.textContent = 'Copied. Paste it into an email + add your photos. ♡';
    } catch (e) {
      if (status) status.textContent = 'Copy did not cooperate. Use the email button instead.';
    }
  }

  const ASAP_SLOTS = {
    '1-Hour Session · $100 / $50 deposit': [
      'Saturday 9/26 · 10:00 AM',
      'Saturday 9/26 · 11:00 AM',
      'Saturday 9/26 · 2:00 PM',
      'Saturday 9/26 · 3:00 PM',
      'Saturday 9/26 · 4:00 PM',
      'Sunday 9/27 · 10:00 AM',
      'Sunday 9/27 · 11:00 AM',
      'Sunday 9/27 · 12:00 PM',
      'Sunday 9/27 · 1:00 PM'
    ],
    '3-Hour Session · $250 / $125 deposit': [
      'Saturday 9/26 · 2:00 PM',
      'Sunday 9/27 · 10:00 AM',
      'Sunday 9/27 · 11:00 AM'
    ]
  };

  function populateAsapSlots(form) {
    const session = v(form, 'session');
    const slots = ASAP_SLOTS[session] || [];
    const first = form.querySelector('[data-asap-first]');
    const backup = form.querySelector('[data-asap-backup]');
    [first, backup].forEach((select) => {
      if (!select) return;
      select.innerHTML = '';
      const intro = document.createElement('option');
      intro.value = '';
      intro.textContent = slots.length ? 'choose a time...' : 'choose your session length first...';
      select.appendChild(intro);
      slots.forEach((slot) => {
        const opt = document.createElement('option');
        opt.value = slot;
        opt.textContent = slot;
        select.appendChild(opt);
      });
      select.disabled = !slots.length;
    });
  }

  document.addEventListener('change', (event) => {
    if (event.target.closest?.('[data-asap-session]')) {
      const form = event.target.closest('form');
      populateAsapSlots(form);
      const status = form.querySelector('[data-asap-status]');
      if (status) status.textContent = '';
    }

    if (event.target.closest?.('[data-asap-first]')) {
      const form = event.target.closest('form');
      const first = form.querySelector('[data-asap-first]');
      const backup = form.querySelector('[data-asap-backup]');
      if (!first || !backup) return;
      [...backup.options].forEach((opt) => {
        opt.disabled = Boolean(first.value && opt.value === first.value);
      });
      if (backup.value === first.value) backup.value = '';
    }
  });

  document.querySelectorAll('form[data-get-asap]').forEach(populateAsapSlots);

  document.addEventListener('submit', (event) => {
    const form = event.target.closest?.('[data-tattoo-inquiry], [data-get-asap]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (form.matches('[data-get-asap]')) {
      const first = v(form,'first_choice');
      const backup = v(form,'backup_choice');
      const status = form.querySelector('[data-asap-status]');
      if (first && backup && first === backup) {
        if (status) status.textContent = 'Your backup has to be a different time, babe. ♡';
        return;
      }
      const payload = asapPayload(form);
      if (status) status.textContent = 'Email ready. Add your reference + placement photos before sending. ♡';
      window.location.href = mailto(payload);
      return;
    }

    const payload = tattooPayload(form);
    const status = form.querySelector('[data-tattoo-status]');
    if (status) status.textContent = 'Email ready. Add your reference + placement photos before sending. ♡';
    window.location.href = mailto(payload);
  }, true);

  document.addEventListener('click', (event) => {
    const asapCopy = event.target.closest?.('[data-asap-copy]');
    if (asapCopy) {
      const form = asapCopy.closest('form');
      if (!form.reportValidity()) return;
      const first = v(form,'first_choice');
      const backup = v(form,'backup_choice');
      const status = form.querySelector('[data-asap-status]');
      if (first === backup) {
        if (status) status.textContent = 'Your backup has to be a different time, babe. ♡';
        return;
      }
      copyPayload(asapPayload(form), status);
      return;
    }

    const tattooCopy = event.target.closest?.('[data-tattoo-copy]');
    if (tattooCopy) {
      const form = tattooCopy.closest('form');
      if (!form.reportValidity()) return;
      copyPayload(tattooPayload(form), form.querySelector('[data-tattoo-status]'));
    }
  });
})();
