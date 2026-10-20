(() => {
  'use strict';
  const REGULAR_DEPOSIT = 'https://square.link/u/exMcKsyN';
  const FALL_DEPOSIT = 'https://square.link/u/cyeSgeu3';
  const FALL_BOOKING_START = Date.parse('2026-10-16T00:00:00-04:00');
  const FALL_END = Date.parse('2026-10-26T00:00:00-04:00');
  const BLOCKED_SLOTS = ['oct19-1700'];
  const fallSlots = [19, 20, 21, 23, 24].map(day => ({ id: `oct${day}-1700`, start: `2026-10-${day}T17:00:00-04:00`, duration: 3, total: 150, deposit: 50, key: 'fall-break' }));
  ['12:00', '18:45'].forEach(time => fallSlots.push({ id: `oct25-${time.replace(':', '')}`, start: `2026-10-25T${time}:00-04:00`, duration: 3, total: 150, deposit: 50, key: 'fall-break' }));
  const sessions = {
    unsure: { label: 'Not sure, recommend one', total: null, deposit: null, duration: null },
    '1hour': { label: '1-hour session · $100 / $50 deposit', total: 100, deposit: 50, duration: 1 },
    '3hour': { label: '3-hour session · $250 / $125 deposit', total: 250, deposit: 125, duration: 3 },
    fullday: { label: '6-hour session · $500 / $250 deposit', total: 500, deposit: 250, duration: 6 },
    'fall-break': { label: 'Fall Break · 3 hours · $150 / $50 deposit', total: 150, deposit: 50, duration: 3 }
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
    if (Number.isFinite(stamp) && stamp >= FALL_BOOKING_START && stamp < FALL_END) {
      phase = 'fall-break';
      available = fallSlots.filter(slot => stamp < Date.parse(slot.start));
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
    if (data.booking_acknowledged !== 'yes' || data.guests_acknowledged !== 'yes' || data.policies_acknowledged !== 'yes') return 'Please read and acknowledge the booking terms, guest guidance, and tattoo policies.';
    if (data.session === 'fall-break') {
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
      `Placement: ${data.placement}`, `Approximate size: ${data.size}`, `Color direction: ${data.color || 'not sure'}`,
      `Guest: ${{ none: 'No guest', adult: 'One adult guest', child: 'One child; bringing them is necessary' }[data.guest]}`,
      'Booking terms acknowledged: yes', 'Guest and child guidance acknowledged: yes', 'Tattoo policies acknowledged: yes',
      '', 'TATTOO IDEA:', data.idea, '', 'ADDITIONAL NOTES:', data.notes || 'none',
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
    return `<div class="module-title">Fall Break Tattoo Sessions ♡</div><div class="module-body"><p class="booking-price-line"><strong class="booking-price">3 hours · $150</strong><span class="booking-original">Regularly $250</span></p><p>October 19–25, 2026. Your design must fit within a three-hour session.</p>${scheduleMarkup(state)}<p><strong>$50 nonrefundable deposit · $100 balance at your appointment.</strong></p><p class="booking-note">All times are Eastern. Appointments are subject to confirmation. One guest maximum.</p><a class="session-button" href="tattoo-inquiry.html?session=fall-break#tattoo-inquiry-form">Request my appointment ♡</a></div>`;
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
      const strip = state.slots.length ? 'FALL BREAK ♡ OCTOBER 19–25 ✦ 3 HOURS · $150 ✦ $50 DEPOSIT ♡' : 'TATTOOS ♡ INQUIRIES ✦ CUSTOM WORK ✦';
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
    const scheduled = key === 'fall-break';
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
    const quick = form.dataset.bookingInquiry === 'opening';
    const select = form.elements.namedItem('session');
    const previous = select.value;
    const requested = new URLSearchParams(window.location.search).get('session');
    const options = (quick ? (state.slots.length ? [state.phase] : []) : availableSessionKeys(state)).map(key => [sessions[key].label, key]);
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
    const info = sessionInfo(select.value, state);
    const summary = form.querySelector('[data-booking-summary]');
    const pay = form.querySelector('[data-booking-payment]');
    if (!info || info.total === null) {
      summary.textContent = 'Tell me your idea and I will recommend the right session. Your session price and deposit will be confirmed before booking.';
      form.querySelector('[data-booking-payment-ack]').textContent = 'I understand my appointment is confirmed once my tattoo and time are approved and my nonrefundable deposit is received. The deposit is applied toward my total.';
      pay.hidden = true;
      return;
    }
    const fall = select.value === 'fall-break';
    summary.textContent = `${info.duration}-hour session · $${info.total} total · $${info.deposit} nonrefundable deposit · $${info.total - info.deposit} due at your appointment.${fall ? ' Valid for appointments held October 19–25, 2026 only.' : ''}`;
    form.querySelector('[data-booking-payment-ack]').textContent = `I understand the $${info.deposit} deposit is nonrefundable, is applied toward my $${info.total} session, and leaves a $${info.total - info.deposit} balance. My appointment is confirmed once my tattoo and time are approved and my deposit is received.${fall ? ' Fall break pricing applies only to appointments held October 19–25, 2026.' : ''}`;
    form.querySelector('[data-booking-payment-title]').textContent = `Session deposit · $${info.deposit}`;
    form.querySelector('[data-booking-payment-copy]').textContent = `Send your inquiry and use the matching Square deposit option. Total: $${info.total}. Remaining balance: $${info.total - info.deposit}.`;
    const link = form.querySelector('[data-booking-deposit]');
    link.href = fall ? FALL_DEPOSIT : REGULAR_DEPOSIT;
    link.textContent = `Pay the $${info.deposit} ${fall ? 'fall break ' : ''}deposit ♡`;
    pay.hidden = false;
  }
  function formData(form) {
    return Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));
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


