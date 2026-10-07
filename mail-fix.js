(() => {
  const FLASH_SESSION = 'Baby Worry Dolls Flash · $60 prepaid';
  const FLASH_PAYMENT = 'https://square.link/u/pAsHO0H3';
  const FLASH_SLOTS = [
    'Friday 10/9 · 5:00 PM',
    'Friday 10/9 · 6:00 PM',
    'Friday 10/9 · 7:00 PM',
    'Friday 10/9 · 8:00 PM',
    'Saturday 10/10 · 11:00 AM',
    'Saturday 10/10 · 12:30 PM',
    'Saturday 10/10 · 2:00 PM',
    'Saturday 10/10 · 3:30 PM',
    'Saturday 10/10 · 5:00 PM',
    'Saturday 10/10 · 6:30 PM'
  ];

  function v(form, name) {
    const field = form.elements.namedItem(name);
    if (!field || field.disabled || (field.type === 'checkbox' && !field.checked)) return '';
    return String(field.value || '').trim();
  }
  function isFlash(form) { return v(form, 'session') === FLASH_SESSION; }
  function mailto(payload) {
    return `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
  }
  function flashPayload(form) {
    return {
      to: form.dataset.email || 'hello@lovejoymarket.co',
      subject: `BABY WORRY DOLLS FLASH | ${v(form, 'name') || 'Client'} | ${v(form, 'first_choice')}`,
      body: [
        'LOVEJOY BABY WORRY DOLLS FLASH · OCTOBER 9 + 10, 2026', '',
        `Name: ${v(form, 'name')}`,
        `Email: ${v(form, 'email')}`,
        `Phone: ${v(form, 'phone') || 'not provided'}`,
        `Special: ${FLASH_SESSION}`,
        `FIRST CHOICE: ${v(form, 'first_choice')} (Eastern time)`,
        `BACKUP CHOICE: ${v(form, 'backup_choice')} (Eastern time)`,
        `Placement: ${v(form, 'placement')}`,
        `Size: ${v(form, 'size')} inches (up to 3 inches)`,
        `Accent colors: ${v(form, 'color') || 'choose together'}`,
        `Doll choice: ${v(form, 'idea') || 'choose once flash is posted by 10/7'}`,
        `Full $60 prepayment acknowledged: ${v(form, 'prepaid_acknowledged') === 'yes' ? 'yes' : 'no'}`,
        `Tattoo policies acknowledged: ${v(form, 'policies_acknowledged') === 'yes' ? 'yes' : 'no'}`,
        '', 'OTHER NOTES:', v(form, 'notes') || 'none',
        '', 'FULL PAYMENT LINK:', FLASH_PAYMENT,
        'The full $60 covers the tattoo, including accent colors. No remaining tattoo balance.',
        'Appointment is official once the time is confirmed and full payment is received.',
        '', 'ATTACH BEFORE SENDING: clear placement photo + selected flash, if available'
      ].join('\n')
    };
  }
  function tattooPayload(form) {
    if (isFlash(form)) return flashPayload(form);
    const name = v(form, 'name') || 'Client';
    const session = v(form, 'session') || 'Tattoo';
    return {
      to: form.dataset.email || 'hello@lovejoymarket.co',
      subject: `TATTOO INQUIRY | ${name} | ${session}`,
      body: [
        'LOVEJOY TATTOO INQUIRY', '',
        `Name: ${v(form, 'name')}`,
        `Email: ${v(form, 'email')}`,
        `Phone: ${v(form, 'phone') || 'not provided'}`,
        `Session: ${session}`,
        `Placement: ${v(form, 'placement')}`,
        `Approx. size: ${v(form, 'size')}`,
        `Color direction: ${v(form, 'color')}`,
        `Availability: ${v(form, 'availability') || 'not provided'}`,
        `Tattoo policies acknowledged: ${v(form, 'policies_acknowledged') === 'yes' ? 'yes' : 'no'}`,
        '', 'IDEA:', v(form, 'idea'), '', 'OTHER NOTES:', v(form, 'notes') || 'none',
        '', 'ATTACH BEFORE SENDING: reference images + clear placement photo'
      ].join('\n')
    };
  }
  function statusFor(form) { return form.querySelector('[data-tattoo-status], [data-asap-status]'); }
  async function copyPayload(payload, status) {
    try {
      await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.body}`);
      if (status) status.textContent = 'Copied. Paste it into an email + add your photos. ♡';
    } catch (e) {
      if (status) status.textContent = 'Copy did not cooperate. Use the email button instead.';
    }
  }
  function policyAcknowledged(form) {
    const checkbox = form.querySelector('[data-policy-checkbox]');
    if (!checkbox) return true;
    const status = statusFor(form);
    if (checkbox.disabled) {
      if (status) status.textContent = 'Open the Tattoo Policies first, then check the acknowledgment box. ♡';
      return false;
    }
    if (!checkbox.checked) {
      if (status) status.textContent = 'Check the policy acknowledgment box before submitting. ♡';
      checkbox.focus();
      return false;
    }
    return true;
  }
  function updateBackup(form) {
    const first = form.querySelector('[data-asap-first]');
    const backup = form.querySelector('[data-asap-backup]');
    if (!first || !backup) return;
    [...backup.options].forEach((option) => {
      option.disabled = Boolean(first.value && option.value === first.value);
    });
    if (first.value && backup.value === first.value) backup.value = '';
  }
  function populateFlashSlots(form) {
    form.querySelectorAll('[data-asap-first], [data-asap-backup]').forEach((select) => {
      const selected = select.value;
      select.replaceChildren(new Option('choose a time...', ''));
      FLASH_SLOTS.forEach((slot) => select.add(new Option(slot, slot)));
      if (FLASH_SLOTS.includes(selected)) select.value = selected;
      select.disabled = !isFlash(form);
    });
    updateBackup(form);
  }
  const SESSION_QUERY_VALUES = {
    '1hour': '1-Hour Session · $100 / $50 deposit',
    '3hour': '3-Hour Session · $250 / $125 deposit',
    'fullday': '6-Hour Full Day · $500 / $250 deposit',
    'flash': FLASH_SESSION
  };
  const regularForm = document.querySelector('form[data-tattoo-inquiry]');
  if (regularForm) {
    const size = regularForm.elements.namedItem('size');
    const idea = regularForm.elements.namedItem('idea');
    const availability = regularForm.elements.namedItem('availability');
    const color = regularForm.elements.namedItem('color');
    const originalSizePlaceholder = size.placeholder;
    const originalColors = [...color.options].map((option) => [option.textContent, option.value]);
    const requested = new URLSearchParams(window.location.search).get('session');
    if (SESSION_QUERY_VALUES[requested]) regularForm.elements.namedItem('session').value = SESSION_QUERY_VALUES[requested];
    function updateFlashFields() {
      const flash = isFlash(regularForm);
      const fields = regularForm.querySelector('[data-flash-fields]');
      fields.hidden = !flash;
      fields.querySelectorAll('select, input').forEach((field) => {
        field.disabled = !flash;
        field.required = flash;
      });
      regularForm.querySelector('[data-flash-payment]').hidden = !flash;
      document.querySelector('[data-regular-deposit]').hidden = flash;
      availability.closest('label').hidden = flash;
      availability.disabled = flash;
      size.type = flash ? 'number' : 'text';
      size.placeholder = flash ? 'up to 3 inches' : originalSizePlaceholder;
      if (flash) {
        size.min = '0.1'; size.max = '3'; size.step = 'any';
      } else {
        size.removeAttribute('min'); size.removeAttribute('max'); size.removeAttribute('step');
      }
      regularForm.querySelector('[data-idea-label]').textContent = flash ? 'Which baby worry doll?' : 'Tell me the idea. *';
      idea.required = !flash;
      idea.placeholder = flash ? 'Design number or description, or choose once flash is posted by 10/7.' : '';
      regularForm.querySelector('[data-color-label]').textContent = flash ? 'Accent color preference (included)' : 'Color direction';
      const colors = flash ? [['Choose together', 'Choose together'], ['Black & gray only', 'Black & gray only'], ['Accent color (describe in notes)', 'Accent color (describe in notes)']] : originalColors;
      const previousColor = color.value;
      color.replaceChildren(...colors.map(([label, value]) => new Option(label, value)));
      if (colors.some(([, value]) => value === previousColor)) color.value = previousColor;
      populateFlashSlots(regularForm);
      const status = statusFor(regularForm);
      if (status) status.textContent = '';
    }
    regularForm.elements.namedItem('session').addEventListener('change', updateFlashFields);
    updateFlashFields();
  }
  document.querySelectorAll('form[data-get-asap]').forEach(populateFlashSlots);
  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-asap-first]')) updateBackup(event.target.closest('form'));
  });
  function validRequest(form) {
    if (!policyAcknowledged(form) || !form.reportValidity()) return false;
    if (isFlash(form)) {
      const first = v(form, 'first_choice');
      const backup = v(form, 'backup_choice');
      if (!FLASH_SLOTS.includes(first) || !FLASH_SLOTS.includes(backup) || first === backup) {
        const status = statusFor(form);
        if (status) status.textContent = 'Choose two different Friday or Saturday times. ♡';
        return false;
      }
    }
    return true;
  }
  // Capture these actions so the older site.js handler cannot also open a
  // second email draft or overwrite the copied inquiry.
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-tattoo-inquiry], [data-get-asap]');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!validRequest(form)) return;
    const status = statusFor(form);
    if (status) status.textContent = 'Email ready. Add your placement photo + selected flash or references before sending. ♡';
    window.location.href = mailto(tattooPayload(form));
  }, true);
  document.addEventListener('click', (event) => {
    const policyLink = event.target.closest('[data-policy-link]');
    if (policyLink) {
      const form = policyLink.closest('form');
      const checkbox = form.querySelector('[data-policy-checkbox]');
      const note = form.querySelector('[data-policy-note]');
      if (checkbox) checkbox.disabled = false;
      if (note) note.textContent = 'Policies opened. Check the box when you’re done reading. ♡';
    }
    const copyButton = event.target.closest('[data-asap-copy], [data-tattoo-copy]');
    if (!copyButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const form = copyButton.closest('form');
    if (validRequest(form)) copyPayload(tattooPayload(form), statusFor(form));
  }, true);
})();
