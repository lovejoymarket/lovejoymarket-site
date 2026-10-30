(function (root) {
  'use strict';
  const event = Object.freeze({
    name: 'LoveJoy Market: Friday the 13th',
    date: 'Friday, November 13, 2026',
    hours: '7–11 p.m. Eastern',
    start: '2026-11-13T19:00:00-05:00',
    end: '2026-11-13T23:00:00-05:00',
    venue: 'Elevated Image Suites event space, Fishers, Indiana',
    vendorFee: 20,
    vendorSpaces: 6,
    email: 'hello@lovejoymarket.co',
    // Approved vendor checkout for the November 13 market.
    vendorPaymentUrl: 'https://square.link/u/7jUCFMxP'
  });
  function getState(now) {
    const stamp = now === undefined ? Date.now() : new Date(now).getTime();
    return { ended: Number.isFinite(stamp) && stamp >= Date.parse(event.end) };
  }
  function createVendorEmail(data) {
    const value = key => String(data.get(key) || '').trim();
    const required = ['name', 'business', 'email', 'phone', 'vendor_type', 'setup_type', 'offerings', 'footprint', 'table', 'people', 'power'];
    if (required.some(key => !value(key))) throw new Error('Please complete the required fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) throw new Error('Please enter a valid email address.');
    if (value('power') === 'Yes' && !value('power_details')) throw new Error('Tell me what needs power.');
    const foodSetup = ['Hallway food vendor', 'Food truck / outdoor setup request'].includes(value('setup_type'));
    if (value('vendor_type') === 'Food / drink' && value('setup_type') === 'Indoor table space') {
      throw new Error('Food vendors must request a hallway space or an outdoor setup. Food setups are not permitted in the event room.');
    }
    if ((['Food / drink', 'Beauty / wellness / service'].includes(value('vendor_type')) || foodSetup) && !value('documents')) {
      throw new Error('Please include the status of any documents needed for your offering.');
    }
    if (value('event_ack') !== 'yes' || value('approval_ack') !== 'yes') throw new Error('Please review both event acknowledgments.');
    if (value('guidelines_ack') !== 'yes') throw new Error('Please read and acknowledge the vendor guidelines before creating your inquiry.');
    const labels = {
      name: 'Contact name', business: 'Business name', email: 'Email', phone: 'Mobile number',
      links: 'Website / Instagram / portfolio', vendor_type: 'Vendor type', setup_type: 'Requested setup', offerings: 'Products or services',
      footprint: 'Full setup footprint', table: 'Table / display plan', people: 'People staffing the setup',
      power: 'Power needed', power_details: 'Power details', documents: 'Relevant documents / status', notes: 'Other notes',
      waitlist_request: 'Join the waitlist if approved and the event is full'
    };
    const lines = [event.name + ' | Vendor Application', event.date + ' | ' + event.hours, event.venue, 'Vendor fee: $20 per approved business', ''];
    Object.entries(labels).forEach(([key, label]) => {
      if (value(key)) lines.push(label + ': ' + value(key), '');
    });
    lines.push('I have read and agree to the November 13 vendor guidelines, including the table space and room / hallway food rules.',
      'I can participate during the event hours and follow the setup / breakdown instructions Jessie confirms.',
      'I understand this application is not a confirmed space. Payment details are sent after acceptance.',
      '', 'Attach product / setup photos and relevant documents before sending.');
    return {
      subject: 'Nov 13 vendor application | ' + value('business').replace(/[\r\n]/g, ' '),
      body: lines.join('\n')
    };
  }
  root.LoveJoyFriday13 = { event, getState, createVendorEmail };
  if (typeof document === 'undefined') return;

  function syncGuidelineGate(form) {
    const read = form.dataset.guidelinesRead === 'true';
    const acknowledgment = form.elements.guidelines_ack;
    const ended = getState().ended;
    if (acknowledgment) acknowledgment.disabled = !read || ended;
    const ready = read && acknowledgment?.checked && !ended;
    form.querySelectorAll('[data-vendor-create]').forEach(button => { button.disabled = !ready; });
  }
  function syncEvent() {
    const state = getState();
    document.querySelectorAll('[data-friday13-upcoming]').forEach(node => { node.hidden = state.ended; });
    document.querySelectorAll('[data-friday13-ended]').forEach(node => { node.hidden = !state.ended; });
    document.querySelectorAll('[data-vendor-fields]').forEach(node => { node.disabled = state.ended; });
    document.querySelectorAll('[data-vendor-form]').forEach(syncGuidelineGate);
    document.querySelectorAll('[data-vendor-payment]').forEach(node => {
      const ready = /^https:\/\/square\.link\/u\/[A-Za-z0-9]+$/.test(event.vendorPaymentUrl) && !state.ended;
      node.hidden = !ready;
      if (ready) node.href = event.vendorPaymentUrl;
    });
  }
  syncEvent();
  window.setInterval(syncEvent, 60000);
  window.addEventListener('focus', syncEvent);

  document.querySelectorAll('[data-vendor-form]').forEach(form => {
    const status = form.querySelector('[data-vendor-status]');
    const preview = form.querySelector('[data-vendor-review]');
    const area = form.querySelector('[data-vendor-email-text]');
    const emailLink = form.querySelector('[data-vendor-email-link]');
    const dialog = form.querySelector('[data-vendor-guidelines-dialog]');
    const scrollArea = dialog.querySelector('[data-guidelines-scroll]');
    const doneReading = dialog.querySelector('[data-guidelines-done]');
    const readingStatus = dialog.querySelector('[data-guidelines-reading-status]');
    const acknowledgment = form.elements.guidelines_ack;
    const gateNote = form.querySelector('[data-guidelines-gate-note]');
    let opener = null;
    let reachedEnd = false;
    function checkReadingEnd() {
      if (!dialog.open) return;
      if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 8) reachedEnd = true;
      doneReading.disabled = !reachedEnd;
      if (reachedEnd) readingStatus.textContent = 'You’re at the end. Choose “done reading” to return to your inquiry.';
    }
    document.querySelectorAll('[data-vendor-guidelines-open]').forEach(button => {
      button.addEventListener('click', () => {
        opener = button;
        dialog.returnValue = 'cancel';
        dialog.showModal();
        document.body.classList.add('vendor-guidelines-open');
        scrollArea.focus();
        window.requestAnimationFrame(checkReadingEnd);
      });
    });
    scrollArea.addEventListener('scroll', checkReadingEnd, { passive: true });
    window.addEventListener('resize', checkReadingEnd);
    dialog.querySelector('[data-guidelines-close]').addEventListener('click', () => { dialog.close('cancel'); });
    doneReading.addEventListener('click', () => { if (reachedEnd) dialog.close('read'); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('vendor-guidelines-open');
      if (dialog.returnValue === 'read' && reachedEnd) {
        form.dataset.guidelinesRead = 'true';
        syncGuidelineGate(form);
        gateNote.textContent = 'Now check the acknowledgment to enable “prepare inquiry” and “copy inquiry.”';
        acknowledgment.focus();
      } else {
        opener?.focus();
      }
    });
    acknowledgment.addEventListener('change', () => {
      syncGuidelineGate(form);
      gateNote.textContent = acknowledgment.checked
        ? 'Guidelines acknowledged. Complete the required fields, then prepare your inquiry.'
        : 'Check the acknowledgment before preparing or copying your inquiry.';
      if (!acknowledgment.checked) preview.hidden = true;
    });
    syncGuidelineGate(form);
    function syncFields() {
      const foodSetup = ['Hallway food vendor', 'Food truck / outdoor setup request'].includes(form.elements.setup_type.value);
      const regulated = ['Food / drink', 'Beauty / wellness / service'].includes(form.elements.vendor_type.value) || foodSetup;
      form.elements.setup_type.setCustomValidity(form.elements.vendor_type.value === 'Food / drink' && form.elements.setup_type.value === 'Indoor table space'
        ? 'Food vendors must request a hallway space or an outdoor setup.' : '');
      const documents = form.querySelector('[data-vendor-documents]');
      documents.hidden = !regulated;
      documents.querySelector('textarea').required = regulated;
      const needsPower = form.elements.power.value === 'Yes';
      const power = form.querySelector('[data-vendor-power]');
      power.hidden = !needsPower;
      power.querySelector('textarea').required = needsPower;
    }
    form.elements.vendor_type.addEventListener('change', syncFields);
    form.elements.setup_type.addEventListener('change', syncFields);
    form.elements.power.addEventListener('change', syncFields);
    syncFields();
    function prepare() {
      if (getState().ended) { syncEvent(); status.textContent = 'This event has ended. Email Jessie about the next market.'; return null; }
      if (form.dataset.guidelinesRead !== 'true' || !acknowledgment.checked) {
        status.textContent = 'Open the vendor guidelines, scroll to the bottom, then check the acknowledgment before creating your inquiry.';
        return null;
      }
      syncFields();
      if (!form.reportValidity()) return null;
      try {
        const data = new FormData(form);
        if (form.querySelector('[data-vendor-documents]').hidden) data.delete('documents');
        if (form.querySelector('[data-vendor-power]').hidden) data.delete('power_details');
        return createVendorEmail(data);
      } catch (error) { status.textContent = error.message; return null; }
    }
    function review(inquiry) {
      const text = 'To: ' + event.email + '\nSubject: ' + inquiry.subject + '\n\n' + inquiry.body;
      area.value = text;
      emailLink.href = 'mailto:' + event.email + '?subject=' + encodeURIComponent(inquiry.subject) + '&body=' + encodeURIComponent(inquiry.body);
      preview.hidden = false;
      return text;
    }
    form.addEventListener('input', () => {
      if (!preview.hidden) {
        preview.hidden = true;
        status.textContent = 'You changed your application. Prepare it again before sending.';
      }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inquiry = prepare();
      if (!inquiry) return;
      review(inquiry);
      status.textContent = 'Application prepared. Open the email draft below, attach any photos or documents, and press Send in your email app.';
      preview.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    form.querySelector('[data-vendor-copy]').addEventListener('click', async () => {
      const inquiry = prepare();
      if (!inquiry) return;
      const text = review(inquiry);
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Application copied. Paste it into an email to ' + event.email + ', add any photos or documents, and send.';
      } catch {
        area.focus(); area.select();
        status.textContent = 'Copy the prepared application below, then email it to ' + event.email + '.';
      }
    });
    emailLink.addEventListener('click', () => {
      status.textContent = 'Your email app should open. Review the draft and press Send there. If it does not open, copy the application instead.';
    });
  });
})(globalThis);
