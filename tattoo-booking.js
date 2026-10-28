(() => {
  'use strict';
  const REGULAR_DEPOSIT = 'https://square.link/u/exMcKsyN';
  const MEMORIAL_BOOKING_START = Date.parse('2026-10-27T00:00:00-04:00');
  const MEMORIAL_END = Date.parse('2026-11-01T20:00:00-05:00');
  const BLOCKED_SLOTS = [];
  // One-hour appointments, 15-minute cleanup gaps, and a meal break.
  // Indianapolis changes to standard time on November 1; these are local EST.
  const memorialSlots = ['12:00', '13:15', '14:30', '15:45', '17:30', '18:45', '20:00'].map(time => ({ id: `nov1-${time.replace(':', '')}`, start: `2026-11-01T${time}:00-05:00`, duration: 1, total: 75, deposit: 25, key: 'recuerdame' }));
  const sessions = {
    unsure: { label: 'Not sure, recommend one', total: null, deposit: null, duration: null },
    '1hour': { label: '1-hour session · $100 / $50 deposit', total: 100, deposit: 50, duration: 1 },
    '3hour': { label: '3-hour session · $250 / $125 deposit', total: 250, deposit: 125, duration: 3 },
    fullday: { label: '6-hour session · $500 / $250 deposit', total: 500, deposit: 250, duration: 6 },
    recuerdame: { label: 'Recuérdame · memorial names + dates · $75 / $25 deposit', total: 75, deposit: 25, duration: 1 }
  };
  const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Indiana/Indianapolis', weekday: 'long', month: 'long', day: 'numeric' });
  const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Indiana/Indianapolis', hour: 'numeric', minute: '2-digit' });
  function slotLabel(slot) {
    return slot.label || `${dateFormatter.format(new Date(slot.start))} · ${timeFormatter.format(new Date(slot.start))}`;
  }
  function getState(now = Date.now()) {
    const stamp = typeof now === 'number' ? now : new Date(now).getTime();
    let phase = 'regular';
    let available = [];
    if (Number.isFinite(stamp) && stamp >= MEMORIAL_BOOKING_START && stamp < MEMORIAL_END) {
      phase = 'recuerdame';
      available = memorialSlots.filter(slot => stamp < Date.parse(slot.start));
    }
    return { phase, slots: available.filter(slot => !BLOCKED_SLOTS.includes(slot.id)), bookedSlots: available.filter(slot => BLOCKED_SLOTS.includes(slot.id)) };
  }
  function availableSessionKeys(state) {
    return ['unsure', '1hour', '3hour', 'fullday'].concat(state.slots.length ? [state.phase] : []);
  }
  function sessionInfo(key, state) {
    if (!availableSessionKeys(state).includes(key)) return null;
    return sessions[key] || null;
  }
  function validateRequest(data, now = Date.now()) {
    const state = getState(now);
    const info = sessionInfo(data.session, state);
    if (!info) return 'That session is no longer available. Please choose another session.';
    if (!['none', 'adult', 'child'].includes(data.guest)) return 'Please choose no guest or one guest.';
    if (data.booking_acknowledged !== 'yes' || (data.session !== 'recuerdame' && (data.guests_acknowledged !== 'yes' || data.policies_acknowledged !== 'yes'))) return 'Please read and acknowledge the booking terms, guest guidance, and tattoo policies.';
    if (data.session === 'recuerdame') {
      if (!globalThis.LoveJoyMemorial) return 'Please reload this page to load the memorial text confirmation.';
      const memorialError = globalThis.LoveJoyMemorial.validate(data);
      if (memorialError) return memorialError;
      const slot = state.slots.find(item => item.id === data.first_choice && item.key === data.session);
      if (!slot) return 'That appointment time is no longer available. Please select a current opening.';
      if (data.backup_choice) {
        const backup = state.slots.find(item => item.id === data.backup_choice && item.key === data.session);
        if (!backup || backup.id === slot.id) return 'Please choose a different available backup time or leave it blank.';
      }
    } else if (!(data.availability || '').trim()) return 'Please include your preferred appointment dates and times.';
    return '';
  }
  function createPayload(data, now = Date.now()) {
    const error = validateRequest(data, now);
    if (error) throw new Error(error);
    const state = getState(now);
    const info = sessionInfo(data.session, state);
    const slot = state.slots.find(item => item.id === data.first_choice && item.key === data.session);
    const backup = state.slots.find(item => item.id === data.backup_choice && item.key === data.session);
    const subject = `TATTOO INQUIRY | ${data.name} | ${info.label}`;
    const lines = [
      'JESSICA LOVEJOY TATTOO INQUIRY', '',
      `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone || 'not provided'}`,
      `Session: ${info.label}`,
      ...(info.total !== null ? [`Session total: $${info.total}`, `Deposit: $${info.deposit}`, `Balance at appointment: $${info.total - info.deposit}`] : []),
      ...(slot ? [`Requested appointment: ${slotLabel(slot)} (Eastern)`, `Backup appointment: ${backup ? slotLabel(backup) + ' (Eastern)' : 'none'}`] : [`Preferred dates and times: ${data.availability || 'not provided'}`]),
      `Placement: ${data.placement}`, `Approximate size: ${data.session === 'recuerdame' ? data.memorial_size + ' inches overall' : data.size}`, `Color direction: ${data.session === 'recuerdame' ? data.preferred_color + ' (one ink color)' : data.color || 'not sure'}`,
      ...(data.session === 'recuerdame' ? globalThis.LoveJoyMemorial.payloadLines(data) : []),
      `Guest: ${{ none: 'No guest', adult: 'One adult guest', child: 'One child; bringing them is necessary' }[data.guest]}`,
      'Booking terms acknowledged: yes', 'Guest and child guidance acknowledged: yes', 'Tattoo policies acknowledged: yes',
      '', 'TATTOO IDEA:', data.session === 'recuerdame' ? 'In loving memory. Exact approved text and lettering requested above.' : data.idea, '', 'ADDITIONAL NOTES:', data.notes || 'none',
      '', 'ATTACH BEFORE SENDING: Reference images and a clear photo of the placement area.'
    ];
    return { to: 'hello@lovejoymarket.co', subject, body: lines.join('\n') };
  }
  globalThis.LoveJoyBooking = Object.freeze({ getState, availableSessionKeys, sessionInfo, validateRequest, createPayload, slotLabel });
  if (typeof document === 'undefined') return;

  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function scheduleMarkup(state) {
    const groups = new Map();
    const booked = new Set((state.bookedSlots || []).map(slot => slot.id));
    [...state.slots, ...(state.bookedSlots || [])].sort((a, b) => Date.parse(a.start) - Date.parse(b.start)).forEach(slot => {
      const day = dateFormatter.format(new Date(slot.start));
      if (!groups.has(day)) groups.set(day, []);
      const time = escape(timeFormatter.format(new Date(slot.start)));
      groups.get(day).push(booked.has(slot.id) ? `<s>${time}</s> <small>booked</small>` : time);
    });
    return '<dl class="booking-times">' + [...groups].map(([day, times]) => `<div><dt>${escape(day)}</dt><dd>${times.join(' · ')}</dd></div>`).join('') + '</dl>';
  }
  function offerMarkup(state) {
    return `<div class="module-title"><span lang="es">Recuérdame</span> ♡ In Loving Memory</div><div class="module-body"><p><strong>Sunday, November 1 · Memorial names + dates · $75</strong></p><p>$25 deposit toward your total. Appointments from noon; last start at 8 p.m. Eastern.</p><a class="session-button" href="tattoo-recuerdame.html">View details + request a time ♡</a></div>`;
  }
  let renderedKey = '';
  function renderNotices(state) {
    const key = state.phase + ':' + state.slots.map(slot => slot.id).join(',') + ':booked:' + state.bookedSlots.map(slot => slot.id).join(',');
    if (key !== renderedKey) {
      document.querySelectorAll('[data-booking-offer]').forEach(node => {
        const show = state.slots.length > 0;
        node.hidden = !show;
        node.innerHTML = show ? offerMarkup(state) : '';
      });
      const strip = state.slots.length ? 'RECUÉRDAME ♡ IN LOVING MEMORY ✦ NOVEMBER 1 ✦ MEMORIAL NAMES + DATES · $75 ✦ $25 DEPOSIT ♡' : 'TATTOOS ♡ INQUIRIES ✦ CUSTOM WORK ✦';
      document.querySelectorAll('[data-booking-strip]').forEach(node => { node.textContent = strip; });
      renderedKey = key;
    }
    document.querySelectorAll('[data-booking-walkin-note]').forEach(node => { node.hidden = Date.now() >= Date.parse('2026-10-25T00:00:00-04:00'); });
  }
  function setOptions(select, options, placeholder, selected) {
    select.replaceChildren();
    if (placeholder) select.add(new Option(placeholder, ''));
    options.forEach(([label, value]) => select.add(new Option(label, value)));
    if (options.some(([, value]) => value === selected)) select.value = selected;
  }
  function populateTimes(form, state) {
    const key = form.elements.namedItem('session').value;
    const scheduled = key === 'recuerdame';
    const slots = scheduled ? state.slots.filter(slot => slot.key === key) : [];
    const first = form.elements.namedItem('first_choice');
    const backup = form.elements.namedItem('backup_choice');
    const selected = first.value;
    const previousBackup = backup.value;
    setOptions(first, slots.map(slot => [slotLabel(slot), slot.id]), 'Choose a time...', selected);
    if (slots.length === 1) first.value = slots[0].id;
    first.disabled = !scheduled;
    first.required = scheduled;
    const alternatives = slots.filter(slot => slot.id !== first.value);
    setOptions(backup, alternatives.map(slot => [slotLabel(slot), slot.id]), 'No backup time', previousBackup);
    backup.disabled = !scheduled || !alternatives.length;
    backup.required = false;
    form.querySelector('[data-booking-backup-label]').hidden = !scheduled || slots.length < 2;
    form.querySelector('[data-booking-slot-fields]').hidden = !scheduled;
    form.querySelector('[data-booking-slot-note]').hidden = !scheduled;
    const availability = form.elements.namedItem('availability');
    availability.disabled = scheduled;
    availability.required = !scheduled;
    form.querySelector('[data-booking-availability-label]').hidden = scheduled;
  }
  const lastFormSession = new WeakMap();
  function updateForm(form, state, initialize = false) {
    const fieldset = form.querySelector('[data-booking-fields]');
    const closed = form.querySelector('[data-booking-closed]');
    const quick = ['opening', 'memorial'].includes(form.dataset.bookingInquiry);
    const select = form.elements.namedItem('session');
    const previous = select.value;
    const requested = new URLSearchParams(window.location.search).get('session');
    const options = (quick ? (state.slots.length ? [state.phase] : []) : availableSessionKeys(state).filter(key => key !== 'recuerdame')).map(key => [sessions[key].label, key]);
    setOptions(select, options, null, previous);
    if (initialize && options.some(([, key]) => key === requested)) select.value = requested;
    if (!select.value && options.length) select.value = options[0][1];
    const closedForm = quick && !state.slots.length;
    fieldset.disabled = closedForm;
    fieldset.hidden = closedForm;
    closed.hidden = !closedForm;
    if (closedForm) return;
    if (lastFormSession.get(form) !== select.value) {
      form.elements.namedItem('booking_acknowledged').checked = false;
      lastFormSession.set(form, select.value);
    }
    populateTimes(form, state);
    if (initialize && select.value === 'recuerdame') {
      const requestedSlot = new URLSearchParams(window.location.search).get('slot');
      if (state.slots.some(slot => slot.id === requestedSlot)) {
        form.elements.namedItem('first_choice').value = requestedSlot;
        populateTimes(form, state);
      }
    }
    globalThis.LoveJoyMemorial?.syncForm(form);
    const info = sessionInfo(select.value, state);
    const summary = form.querySelector('[data-booking-summary]');
    const pay = form.querySelector('[data-booking-payment]');
    if (!info || info.total === null) {
      summary.textContent = 'Tell me your idea and I will recommend the right session. Your session price and deposit will be confirmed before booking.';
      form.querySelector('[data-booking-payment-ack]').textContent = 'I understand my appointment is confirmed once my tattoo and time are approved and my nonrefundable deposit is received. The deposit is applied toward my total.';
      pay.hidden = true;
      return;
    }
    const memorial = select.value === 'recuerdame';
    summary.textContent = `${info.duration}-hour appointment · $${info.total} total · $${info.deposit} nonrefundable deposit toward your total · $${info.total - info.deposit} due at your appointment.${memorial ? ' Recuérdame applies to approved memorial tattoos held November 1, 2026 only. Stencil placement and aftercare are included in your one-hour block.' : ''}`;
    form.querySelector('[data-booking-payment-ack]').textContent = memorial ? 'I have read the event details and regular tattoo policies, including the memorial-only limits, $25 nonrefundable deposit toward the $75 total, and one-guest rule. I understand my appointment requires approval and payment.' : `I understand the $${info.deposit} deposit is nonrefundable, is applied toward my $${info.total} session, and leaves a $${info.total - info.deposit} balance. My appointment is confirmed once my tattoo and time are approved and my deposit is received.`;
    form.querySelector('[data-booking-payment-title]').textContent = `Session deposit · $${info.deposit}`;
    form.querySelector('[data-booking-payment-copy]').textContent = memorial ? 'After your text, lettering, placement, color, and appointment time are approved, Jessica will send the $25 deposit payment link. Requested ink is secured once your deposit is paid, subject to availability. Your remaining balance is $50.' : `Send your inquiry and use the matching Square deposit option. Total: $${info.total}. Remaining balance: $${info.total - info.deposit}.`;
    const link = form.querySelector('[data-booking-deposit]');
    link.href = REGULAR_DEPOSIT;
    link.hidden = memorial;
    link.textContent = `Pay the $${info.deposit} deposit ♡`;
    pay.hidden = memorial;
  }
  function formData(form) {
    return Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, key === 'memorial_text' || key === 'memorial_confirm' ? String(value) : String(value).trim()]));
  }
  function checkedPayload(form) {
    const status = form.querySelector('[data-booking-status]');
    if (form.querySelector('[data-booking-fields]').disabled) { status.textContent = 'Please use the regular tattoo inquiry to request another date.'; return null; }
    const policy = form.querySelector('[data-booking-policy-check]');
    if (policy.disabled || !policy.checked) { status.textContent = 'Please open the tattoo policies, then check the agreement box.'; return null; }
    if (!form.reportValidity()) return null;
    const data = formData(form);
    const error = validateRequest(data);
    if (error) { status.textContent = error; updateForm(form, getState()); return null; }
    return createPayload(data);
  }
  const forms = [...document.querySelectorAll('[data-booking-inquiry]')];
  forms.forEach(form => {
    updateForm(form, getState(), true);
    form.elements.namedItem('session').addEventListener('change', () => updateForm(form, getState()));
    form.elements.namedItem('first_choice').addEventListener('change', () => populateTimes(form, getState()));
    form.querySelector('[data-booking-policy-link]').addEventListener('click', () => {
      form.querySelector('[data-booking-policy-check]').disabled = false;
      form.querySelector('[data-booking-policy-note]').textContent = 'Check the agreement box after reading the policies.';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const payload = checkedPayload(form);
      if (!payload) return;
      form.querySelector('[data-booking-status]').textContent = 'Your email is ready. Add your reference images and placement photo, then press send.';
      window.location.href = `mailto:${payload.to}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
    });
    form.querySelector('[data-booking-copy]').addEventListener('click', async () => {
      const payload = checkedPayload(form);
      if (!payload) return;
      const status = form.querySelector('[data-booking-status]');
      try {
        await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.body}`);
        status.textContent = `Copied. Paste into an email to ${payload.to}, attach your photos, and send.`;
      } catch (error) { status.textContent = 'Please use the email button to create your inquiry.'; }
    });
  });
  function refresh() {
    const state = getState();
    renderNotices(state);
    forms.forEach(form => updateForm(form, state));
  }
  renderNotices(getState());
  setInterval(refresh, 30000);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})();


