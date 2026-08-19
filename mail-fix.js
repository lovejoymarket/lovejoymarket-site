(() => {
  const FORM_SELECTOR = '[data-tattoo-inquiry], [data-event-inquiry]';

  function isMobileMailDevice() {
    const ua = navigator.userAgent || '';
    const touchMac = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
    return /Android|iPhone|iPad|iPod/i.test(ua) || touchMac;
  }

  function formValue(form, name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function tattooPayload(form) {
    const destination = form.dataset.email || 'hello@lovejoymarket.co';
    const name = formValue(form, 'name') || 'Client';
    const session = formValue(form, 'session') || 'Tattoo';
    const subject = `TATTOO INQUIRY | ${name} | ${session}`;
    const body = [
      'LOVEJOY TATTOO INQUIRY',
      '',
      `Name: ${formValue(form, 'name')}`,
      `Email: ${formValue(form, 'email')}`,
      `Phone: ${formValue(form, 'phone') || 'not provided'}`,
      `Session: ${formValue(form, 'session')}`,
      `Placement: ${formValue(form, 'placement')}`,
      `Approx. size: ${formValue(form, 'size')}`,
      `Color direction: ${formValue(form, 'color')}`,
      `Availability: ${formValue(form, 'availability') || 'not provided'}`,
      '',
      'IDEA:',
      formValue(form, 'idea'),
      '',
      'OTHER NOTES:',
      formValue(form, 'notes') || 'none',
      '',
      'ATTACHMENTS TO ADD BEFORE SENDING:',
      '- reference images',
      '- clear photo of the exact placement area',
      '- photos of existing tattoo work in/near the area, if applicable'
    ].join('\n');

    return {
      destination,
      subject,
      body,
      attachmentReminder: 'Add your reference + placement photos before sending.'
    };
  }

  function eventPayload(form) {
    const destination = form.dataset.email || 'hello@lovejoymarket.co';
    const type = form.dataset.inquiryType;
    const name = formValue(form, 'name') || 'Inquiry';

    if (type === 'private') {
      return {
        destination,
        subject: `PRIVATE EVENT INQUIRY | ${name} | ${formValue(form, 'event_type') || 'Event'}`,
        body: [
          'LOVEJOY PRIVATE EVENT INQUIRY',
          '',
          `Name: ${formValue(form, 'name')}`,
          `Email: ${formValue(form, 'email')}`,
          `Phone: ${formValue(form, 'phone') || 'not provided'}`,
          `Event type: ${formValue(form, 'event_type')}`,
          `Estimated guests: ${formValue(form, 'guests')}`,
          `Preferred date / range: ${formValue(form, 'date') || 'flexible / not provided'}`,
          `Preferred time / duration: ${formValue(form, 'time') || 'not provided'}`,
          `Budget range: ${formValue(form, 'budget') || 'not provided'}`,
          '',
          'EVENT CONCEPT:',
          formValue(form, 'concept'),
          '',
          'SPACE / SETUP NEEDS:',
          formValue(form, 'needs') || 'none listed'
        ].join('\n'),
        attachmentReminder: 'Add any useful attachments before sending.'
      };
    }

    return {
      destination,
      subject: `LOVEJOY EVENT IDEA | ${name} | ${formValue(form, 'role') || 'Collaboration'}`,
      body: [
        'LOVEJOY EVENT / COLLABORATION INQUIRY',
        '',
        `Name / organization: ${formValue(form, 'name')}`,
        `Email: ${formValue(form, 'email')}`,
        `Phone: ${formValue(form, 'phone') || 'not provided'}`,
        `Role: ${formValue(form, 'role')}`,
        `Program fit: ${formValue(form, 'program')}`,
        `Timing: ${formValue(form, 'timing') || 'flexible / not provided'}`,
        '',
        'THE PITCH:',
        formValue(form, 'concept'),
        '',
        'WHAT I / WE BRING:',
        formValue(form, 'bring'),
        '',
        'WHAT I / WE NEED FROM LOVEJOY:',
        formValue(form, 'needs') || 'none listed',
        '',
        'LINKS:',
        formValue(form, 'links') || 'none provided',
        '',
        'ATTACHMENTS:',
        'Add any deck, images, references, or files that would help Jessie understand the idea before sending.'
      ].join('\n'),
      attachmentReminder: 'Add any useful attachments before sending.'
    };
  }

  function getPayload(form) {
    return form.matches('[data-tattoo-inquiry]') ? tattooPayload(form) : eventPayload(form);
  }

  function mailtoUrl({ destination, subject, body }) {
    return `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function gmailUrl({ destination, subject, body }) {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destination)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function statusFor(form) {
    return form.querySelector('[data-tattoo-status], [data-event-status]');
  }

  function setStatus(form, text) {
    const status = statusFor(form);
    if (status) status.textContent = text;
  }

  function ensureStyles() {
    if (document.getElementById('lovejoy-mail-choice-styles')) return;
    const style = document.createElement('style');
    style.id = 'lovejoy-mail-choice-styles';
    style.textContent = `
      .lj-mail-choice-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: grid;
        place-items: center;
        padding: 18px;
        background: rgba(7, 24, 44, .78);
        backdrop-filter: blur(3px);
      }
      .lj-mail-choice {
        width: min(100%, 430px);
        border: 2px solid #07182c;
        background: #fff8ec;
        color: #07182c;
        box-shadow: 7px 7px 0 #ff2d8d;
        font-family: Verdana, Arial, Helvetica, sans-serif;
      }
      .lj-mail-choice-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        background: #ff2d8d;
        border-bottom: 2px solid #07182c;
      }
      .lj-mail-choice-head strong {
        font-size: .9rem;
      }
      .lj-mail-choice-close {
        border: 0;
        background: transparent;
        color: #07182c;
        font: inherit;
        font-size: 1.25rem;
        font-weight: 900;
        cursor: pointer;
      }
      .lj-mail-choice-body {
        padding: 14px;
      }
      .lj-mail-choice-body p {
        margin: 0 0 12px;
        font-size: .78rem;
        line-height: 1.45;
      }
      .lj-mail-choice-destination {
        color: #ff2d8d;
        font-weight: 900;
      }
      .lj-mail-choice-actions {
        display: grid;
        gap: 8px;
      }
      .lj-mail-choice-button {
        width: 100%;
        min-height: 44px;
        border: 2px solid #07182c;
        padding: 9px 11px;
        background: #ff2d8d;
        color: #07182c;
        font: inherit;
        font-weight: 900;
        text-align: left;
        box-shadow: 3px 3px 0 #07182c;
        cursor: pointer;
      }
      .lj-mail-choice-button.secondary {
        background: #fff8ec;
      }
      .lj-mail-choice-button:hover,
      .lj-mail-choice-button:focus-visible {
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0 #07182c;
        outline: none;
      }
      .lj-mail-choice-note {
        margin-top: 12px !important;
        color: rgba(7, 24, 44, .68);
        font-size: .68rem !important;
      }
    `;
    document.head.appendChild(style);
  }

  function closeChooser() {
    const existing = document.querySelector('.lj-mail-choice-backdrop');
    if (existing) existing.remove();
  }

  async function copyMessage(payload, form) {
    try {
      await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.body}`);
      setStatus(form, `Copied. Paste it into an email to ${payload.destination}. ♡`);
      closeChooser();
    } catch (error) {
      setStatus(form, 'Copy was blocked by the browser. Try Gmail or your default email app instead.');
    }
  }

  function openChooser(payload, form) {
    ensureStyles();
    closeChooser();

    const backdrop = document.createElement('div');
    backdrop.className = 'lj-mail-choice-backdrop';
    backdrop.innerHTML = `
      <div class="lj-mail-choice" role="dialog" aria-modal="true" aria-labelledby="lj-mail-choice-title">
        <div class="lj-mail-choice-head">
          <strong id="lj-mail-choice-title">where should we open it? ✦</strong>
          <button type="button" class="lj-mail-choice-close" aria-label="Close email options">×</button>
        </div>
        <div class="lj-mail-choice-body">
          <p>Your email is ready for <span class="lj-mail-choice-destination"></span>.</p>
          <div class="lj-mail-choice-actions">
            <button type="button" class="lj-mail-choice-button" data-lj-mail-gmail>open Gmail in browser →</button>
            <button type="button" class="lj-mail-choice-button secondary" data-lj-mail-default>use my computer's email app →</button>
            <button type="button" class="lj-mail-choice-button secondary" data-lj-mail-copy>copy the email instead →</button>
          </div>
          <p class="lj-mail-choice-note"></p>
        </div>
      </div>
    `;

    backdrop.querySelector('.lj-mail-choice-destination').textContent = payload.destination;
    backdrop.querySelector('.lj-mail-choice-note').textContent = payload.attachmentReminder;

    backdrop.querySelector('.lj-mail-choice-close').addEventListener('click', closeChooser);
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeChooser();
    });

    backdrop.querySelector('[data-lj-mail-gmail]').addEventListener('click', () => {
      const opened = window.open(gmailUrl(payload), '_blank', 'noopener');
      if (!opened) {
        window.location.href = gmailUrl(payload);
      }
      setStatus(form, `Opened Gmail. ${payload.attachmentReminder} ♡`);
      closeChooser();
    });

    backdrop.querySelector('[data-lj-mail-default]').addEventListener('click', () => {
      setStatus(form, `Opening your email app. ${payload.attachmentReminder} ♡`);
      window.location.href = mailtoUrl(payload);
      closeChooser();
    });

    backdrop.querySelector('[data-lj-mail-copy]').addEventListener('click', () => {
      copyMessage(payload, form);
    });

    document.body.appendChild(backdrop);
    backdrop.querySelector('[data-lj-mail-gmail]').focus();
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChooser();
  });

  document.addEventListener('submit', (event) => {
    const form = event.target && event.target.closest ? event.target.closest(FORM_SELECTOR) : null;
    if (!form) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.reportValidity()) return;

    const payload = getPayload(form);

    if (isMobileMailDevice()) {
      setStatus(form, `Email ready. ${payload.attachmentReminder} ♡`);
      window.location.href = mailtoUrl(payload);
      return;
    }

    setStatus(form, 'Email ready. Choose where to open it. ♡');
    openChooser(payload, form);
  }, true);
})();
