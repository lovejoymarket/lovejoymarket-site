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
    // Add the event-specific Square vendor checkout URL once Jessie creates it.
    vendorPaymentUrl: ''
  });
  function getState(now) {
    const stamp = now === undefined ? Date.now() : new Date(now).getTime();
    return { ended: Number.isFinite(stamp) && stamp >= Date.parse(event.end) };
  }
  function createVendorEmail(data) {
    const value = key => String(data.get(key) || '').trim();
    const required = ['name', 'business', 'email', 'phone', 'vendor_type', 'offerings', 'footprint', 'table', 'people', 'power'];
    if (required.some(key => !value(key))) throw new Error('Please complete the required fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) throw new Error('Please enter a valid email address.');
    if (value('power') === 'Yes' && !value('power_details')) throw new Error('Tell me what needs power.');
    if (['Food / drink', 'Beauty / wellness / service'].includes(value('vendor_type')) && !value('documents')) {
      throw new Error('Please include the status of any documents needed for your offering.');
    }
    if (value('event_ack') !== 'yes' || value('approval_ack') !== 'yes') throw new Error('Please review both event acknowledgments.');
    const labels = {
      name: 'Contact name', business: 'Business name', email: 'Email', phone: 'Mobile number',
      links: 'Website / Instagram / portfolio', vendor_type: 'Vendor type', offerings: 'Products or services',
      footprint: 'Full setup footprint', table: 'Table / display plan', people: 'People staffing the setup',
      power: 'Power needed', power_details: 'Power details', documents: 'Relevant documents / status', notes: 'Other notes'
    };
    const lines = [event.name + ' | Vendor Application', event.date + ' | ' + event.hours, event.venue, 'Vendor fee: $20 per approved business', ''];
    Object.entries(labels).forEach(([key, label]) => {
      if (value(key)) lines.push(label + ': ' + value(key), '');
    });
    lines.push('I can participate during the event hours and follow the setup / breakdown instructions Jessie confirms.',
      'I understand this application is not a confirmed space. Payment details are sent after acceptance.',
      '', 'Attach product / setup photos and relevant documents before sending.');
    return {
      subject: 'Nov 13 vendor application | ' + value('business').replace(/[\r\n]/g, ' '),
      body: lines.join('\n')
    };
  }
  root.LoveJoyFriday13 = { event, getState, createVendorEmail };
  if (typeof document === 'undefined') return;

  function syncEvent() {
    const state = getState();
    document.querySelectorAll('[data-friday13-upcoming]').forEach(node => { node.hidden = state.ended; });
    document.querySelectorAll('[data-friday13-ended]').forEach(node => { node.hidden = !state.ended; });
    document.querySelectorAll('[data-vendor-fields]').forEach(node => { node.disabled = state.ended; });
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
    function syncFields() {
      const regulated = ['Food / drink', 'Beauty / wellness / service'].includes(form.elements.vendor_type.value);
      const documents = form.querySelector('[data-vendor-documents]');
      documents.hidden = !regulated;
      documents.querySelector('textarea').required = regulated;
      const needsPower = form.elements.power.value === 'Yes';
      const power = form.querySelector('[data-vendor-power]');
      power.hidden = !needsPower;
      power.querySelector('textarea').required = needsPower;
    }
    form.elements.vendor_type.addEventListener('change', syncFields);
    form.elements.power.addEventListener('change', syncFields);
    syncFields();
    function prepare() {
      if (getState().ended) { syncEvent(); status.textContent = 'This event has ended. Email Jessie about the next market.'; return null; }
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
