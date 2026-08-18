const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

const starGlyphs = ['✦', '★', '✧'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildAmbientStars() {
  const layer = document.querySelector('.ambient-stars');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 18 : 30;

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement('span');
    star.className = 'ambient-star';
    star.textContent = starGlyphs[i % starGlyphs.length];
    star.style.left = `${Math.random() * 98}%`;
    star.style.top = `${Math.random() * 98}%`;
    star.style.setProperty('--ambient-size', `${8 + Math.random() * 9}px`);
    star.style.setProperty('--twinkle-speed', `${2.6 + Math.random() * 3.4}s`);
    star.style.animationDelay = `${Math.random() * 3}s`;
    layer.appendChild(star);
  }
}

function runStarCascade() {
  if (reduceMotion) return;
  const layer = document.querySelector('.star-rain');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 34 : 56;

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement('span');
    star.className = 'falling-star';
    star.textContent = starGlyphs[Math.floor(Math.random() * starGlyphs.length)];
    star.style.left = `${Math.random() * 100}%`;
    star.style.setProperty('--star-size', `${9 + Math.random() * 13}px`);
    star.style.setProperty('--fall-duration', `${2.7 + Math.random() * 2.4}s`);
    star.style.setProperty('--fall-delay', `${Math.random() * 1.3}s`);
    star.style.setProperty('--drift', `${-28 + Math.random() * 56}px`);
    layer.appendChild(star);
  }

  window.setTimeout(() => layer.replaceChildren(), 6000);
}

buildAmbientStars();
runStarCascade();


/* LoveJoy Extremely Scientific Quiz */
(() => {
  const root = document.querySelector('#lovejoy-quiz');
  if (!root) return;

  const questions = [
    {
      id: 'nerves',
      heading: 'quiz-q1.png',
      headingAlt: 'before the needle hit...',
      prompt: 'Your nervous system before the needle hit was basically:',
      options: [
        { label: 'Quietly confident. I had already made peace with the situation.', scores: { systems: 2, empiricist: 1 }, value: 'quietly_confident' },
        { label: 'Running a private statistical risk analysis while acting normal.', scores: { empiricist: 2, semiotic: 1, systems: 1 }, value: 'risk_analysis' },
        { label: 'One deep breath away from accidental enlightenment.', scores: { existential: 2, semiotic: 1 }, value: 'accidental_enlightenment' },
        { label: 'Pretending I was not nervous with Oscar-level commitment.', scores: { menace: 2, existential: 1 }, value: 'performing_calm' }
      ]
    },
    {
      id: 'appointment_mode',
      heading: 'quiz-q2.png',
      headingAlt: 'during the appointment...',
      prompt: 'At some point during the appointment you became:',
      options: [
        { label: 'The professional yapper. Full director’s commentary.', scores: { menace: 2, empiricist: 1 }, value: 'professional_yapper' },
        { label: 'A tasteful houseplant. Present, hydrated, mostly motionless.', scores: { existential: 2, systems: 1 }, value: 'tasteful_houseplant' },
        { label: 'A hot little systems thinker monitoring every detail.', scores: { systems: 3, empiricist: 1 }, value: 'systems_thinker' },
        { label: 'A documentary subject with a suspicious amount of lore.', scores: { semiotic: 2, repeat: 1, menace: 1 }, value: 'documentary_lore' }
      ]
    },
    {
      id: 'priority',
      heading: 'quiz-q3.png',
      headingAlt: 'what mattered most?',
      prompt: 'Be serious for literally one question. What mattered most to you?',
      options: [
        { label: 'The art being stupid good.', scores: { semiotic: 2, repeat: 2 }, value: 'art' },
        { label: 'Feeling understood without having to over-explain myself.', scores: { menace: 2, existential: 1 }, value: 'understood' },
        { label: 'The room, the energy, the whole experience feeling right.', scores: { existential: 2, semiotic: 1 }, value: 'vibe' },
        { label: 'Precision, cleanliness, competence. I notice everything.', scores: { empiricist: 2, systems: 2 }, value: 'precision' }
      ]
    },
    {
      id: 'return_intent',
      heading: 'quiz-q4.png',
      headingAlt: 'would you do it again?',
      prompt: 'Would you let Jessie tattoo you again?',
      options: [
        { label: 'I am already planning the next one. This is becoming a body of work.', scores: { repeat: 4, semiotic: 1 }, value: 'already_planning' },
        { label: 'Yes, obviously. Why are we pretending this is undecided?', scores: { empiricist: 1, systems: 1, menace: 1 }, value: 'yes_obviously' },
        { label: 'Probably, after my bank account exits its recovery era.', scores: { existential: 2, repeat: 1 }, value: 'bank_recovery' },
        { label: 'I need to emotionally process what just happened first.', scores: { menace: 2, semiotic: 1 }, value: 'emotionally_processing' }
      ]
    },
    {
      id: 'object',
      heading: 'quiz-q5.png',
      headingAlt: 'pick one. no explanation.',
      prompt: 'Do not intellectualize this. Pick the object that feels correct:',
      options: [
        { label: '8-ball', scores: { semiotic: 2, empiricist: 1 }, value: '8_ball' },
        { label: 'cherry', scores: { empiricist: 1, menace: 2 }, value: 'cherry' },
        { label: 'lighter', scores: { systems: 1, menace: 1, repeat: 1 }, value: 'lighter' },
        { label: 'disco ball', scores: { existential: 2, repeat: 1 }, value: 'disco_ball' }
      ]
    }
  ];

  const results = {
    semiotic: {
      title: 'THE SEMIOTIC THIRST TRAP',
      image: 'quiz-result-semiotic.png',
      copy: [
        'You do not get tattoos. You acquire symbols and then accidentally turn them into a private mythology. You noticed the composition, the subtext, and at least one thing nobody else in the room was thinking about. Mildly dangerous amount of eye contact. Strong chance your tattoo has footnotes.',
        'You entered the appointment as a person and left as an interpretive framework. Everything means something to you, including the fact that you insist it does not. Visually literate, psychologically nosy, and just flirtatious enough to make semiotics inconvenient.'
      ]
    },
    existential: {
      title: 'THE WELL-DRESSED EXISTENTIAL CRISIS',
      image: 'quiz-result-existential.png',
      copy: [
        'You arrived aesthetically coherent and metaphysically unstable, which is basically a dress code. Pain did not scare you nearly as much as the possibility of making the wrong symbolic choice. Somehow this was charming.',
        'Your exterior says “I thought this through.” Your interior says “but what is permanence, really?” You managed to have excellent taste while quietly confronting the abyss. The abyss noticed the outfit.'
      ]
    },
    empiricist: {
      title: 'THE FLIRTATIOUS EMPIRICIST',
      image: 'quiz-result-empiricist.png',
      copy: [
        'You require evidence, competence, and exactly enough chemistry to compromise the control group. You asked good questions, watched everything, and absolutely evaluated the entire experience while pretending to be casual.',
        'You are data-driven until somebody has nice eyes and excellent linework. Then suddenly the methodology gets flexible. Observant, discerning, and absolutely capable of turning “I liked the vibe” into a twelve-point internal rubric.'
      ]
    },
    systems: {
      title: 'THE HOT LITTLE SYSTEMS THINKER',
      image: 'quiz-result-systems.png',
      copy: [
        'You did not “pick a tattoo.” You conducted a small urban-planning study on your own body. Placement had logic. Scale had logic. Your vibe has infrastructure. Unfortunately, this is attractive.',
        'Nothing about you is random except the parts you have deliberately categorized as random. You clocked the setup, the process, the proportions, the workflow, and probably an inefficient cable somewhere. Your aesthetic has a backend.'
      ]
    },
    menace: {
      title: 'THE EMOTIONALLY AVAILABLE MENACE',
      image: 'quiz-result-menace.png',
      copy: [
        'You treated the appointment like a controlled environment for spontaneous character development. You laughed at pain, overshared with excellent timing, and left with both a tattoo and at least one new theory about yourself.',
        'You are remarkably self-aware for somebody actively choosing chaos. You probably said something devastatingly insightful and then followed it with “anywayyyy.” Charming. Concerning. Great appointment energy.'
      ]
    },
    repeat: {
      title: 'THE REPEAT OFFENDER WITH A THESIS',
      image: 'quiz-result-repeat.png',
      copy: [
        'One tattoo was never the assignment. You are building a body of work and, apparently, a supporting argument. You will return with references, a concept, three screenshots, and the phrase “hear me out.” Jessie will hear you out.',
        'You are not collecting tattoos. You are developing a visual research practice on skin. The project scope continues to expand. There is no final draft. Your next reference folder already exists and we both know it.'
      ]
    }
  };

  const addenda = [
    'peer-reviewed addendum: your answer to the object question was statistically useless and spiritually essential.',
    'confidence interval: 87% ± whatever your moon sign is doing.',
    'clinical recommendation: hydrate, tip your artist, and resist the urge to turn this result into lore. you will not resist.',
    'methodology: five questions, zero ethics-board approval, one extremely confident conclusion.',
    'sample size: you. conclusions: reckless but compelling.',
    'secondary finding: your aesthetic decision-making appears to be flirting with consciousness itself.'
  ];

  const intro = root.querySelector('[data-quiz-intro]');
  const panel = root.querySelector('[data-quiz-panel]');
  const resultPanel = root.querySelector('[data-quiz-result]');
  const startButton = root.querySelector('[data-quiz-start]');
  const heading = root.querySelector('[data-quiz-heading]');
  const questionText = root.querySelector('[data-quiz-question]');
  const optionsWrap = root.querySelector('[data-quiz-options]');
  const progress = root.querySelector('[data-quiz-progress]');
  const nextButton = root.querySelector('[data-quiz-next]');
  const backButton = root.querySelector('[data-quiz-back]');
  const resultImage = root.querySelector('[data-result-image]');
  const resultCopy = root.querySelector('[data-result-copy]');
  const resultAddendum = root.querySelector('[data-result-addendum]');
  const retakeButton = root.querySelector('[data-quiz-retake]');
  const shareButton = root.querySelector('[data-share-result]');
  const shareStatus = root.querySelector('[data-share-status]');

  let current = 0;
  let answers = Array(questions.length).fill(null);
  let currentResult = null;

  function showQuestion() {
    const q = questions[current];
    progress.textContent = `question ${current + 1} of ${questions.length}`;
    heading.src = q.heading;
    heading.alt = q.headingAlt;
    questionText.textContent = q.prompt;
    optionsWrap.replaceChildren();

    q.options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = option.label;
      button.dataset.optionIndex = String(optionIndex);
      if (answers[current] === optionIndex) button.classList.add('is-selected');

      button.addEventListener('click', () => {
        answers[current] = optionIndex;
        optionsWrap.querySelectorAll('.quiz-option').forEach((item) => item.classList.remove('is-selected'));
        button.classList.add('is-selected');
        nextButton.disabled = false;
      });

      optionsWrap.appendChild(button);
    });

    backButton.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextButton.disabled = answers[current] === null;
    nextButton.textContent = current === questions.length - 1 ? 'diagnose me ✦' : 'next question →';
  }

  function calculateResult() {
    const totals = Object.keys(results).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const responseData = {};

    questions.forEach((q, qIndex) => {
      const selectedIndex = answers[qIndex];
      const selected = q.options[selectedIndex];
      responseData[q.id] = selected.value;
      Object.entries(selected.scores).forEach(([key, amount]) => {
        totals[key] += amount;
      });
    });

    const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const bestScore = ranked[0][1];
    const close = ranked.filter(([,score]) => score >= bestScore - 1);
    const chosen = close[Math.floor(Math.random() * close.length)][0];
    const result = results[chosen];
    const copy = result.copy[Math.floor(Math.random() * result.copy.length)];
    const addendum = addenda[Math.floor(Math.random() * addenda.length)];

    currentResult = { key: chosen, title: result.title, copy, addendum };
    resultImage.src = result.image;
    resultImage.alt = result.title.toLowerCase();
    resultCopy.textContent = copy;
    resultAddendum.textContent = addendum;

    const payload = {
      submitted_at: new Date().toISOString(),
      answers: responseData,
      scores: totals,
      result: chosen
    };

    // Local capture works immediately. A central collector can be added later
    // by setting window.LOVEJOY_QUIZ_ENDPOINT to a POST endpoint.
    try {
      const stored = JSON.parse(localStorage.getItem('lovejoyQuizSubmissions') || '[]');
      stored.push(payload);
      localStorage.setItem('lovejoyQuizSubmissions', JSON.stringify(stored.slice(-100)));
    } catch (error) {
      // Quiz still works if storage is blocked.
    }

    const endpoint = window.LOVEJOY_QUIZ_ENDPOINT;
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  }

  function showResult() {
    calculateResult();
    panel.hidden = true;
    resultPanel.hidden = false;
    shareStatus.textContent = '';
    resultPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  startButton.addEventListener('click', () => {
    intro.hidden = true;
    resultPanel.hidden = true;
    panel.hidden = false;
    current = 0;
    answers = Array(questions.length).fill(null);
    showQuestion();
  });

  nextButton.addEventListener('click', () => {
    if (answers[current] === null) return;
    if (current === questions.length - 1) {
      showResult();
      return;
    }
    current += 1;
    showQuestion();
  });

  backButton.addEventListener('click', () => {
    if (current === 0) return;
    current -= 1;
    showQuestion();
  });

  retakeButton.addEventListener('click', () => {
    resultPanel.hidden = true;
    panel.hidden = false;
    current = 0;
    answers = Array(questions.length).fill(null);
    showQuestion();
  });

  shareButton.addEventListener('click', async () => {
    if (!currentResult) return;
    const shareText = `${currentResult.title} — ${currentResult.copy} lovejoymarket.co`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My LoveJoy diagnosis',
          text: shareText,
          url: window.location.href
        });
        shareStatus.textContent = 'diagnosis released into the ecosystem ♡';
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        shareStatus.textContent = 'copied. go be annoying in the group chat ♡';
      } else {
        shareStatus.textContent = 'screenshot it like it is 2007 ♡';
      }
    } catch (error) {
      shareStatus.textContent = '';
    }
  });
})();


/* Tattoo inquiry -> structured email */
(() => {
  const form = document.querySelector('[data-tattoo-inquiry]');
  if (!form) return;

  const status = form.querySelector('[data-tattoo-status]');
  const copyButton = form.querySelector('[data-tattoo-copy]');
  const destination = form.dataset.email || 'hello@lovejoymarket.co';

  function value(name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function buildInquiry() {
    const lines = [
      'LOVEJOY TATTOO INQUIRY',
      '',
      `Name: ${value('name')}`,
      `Email: ${value('email')}`,
      `Phone: ${value('phone') || 'not provided'}`,
      `Session: ${value('session')}`,
      `Placement: ${value('placement')}`,
      `Approx. size: ${value('size')}`,
      `Color direction: ${value('color')}`,
      `Availability: ${value('availability') || 'not provided'}`,
      '',
      'IDEA:',
      value('idea'),
      '',
      'OTHER NOTES:',
      value('notes') || 'none',
      '',
      'ATTACHMENTS TO ADD BEFORE SENDING:',
      '- reference images',
      '- clear photo of the exact placement area',
      '- photos of existing tattoo work in/near the area, if applicable'
    ];
    return lines.join('\n');
  }

  function subject() {
    const name = value('name') || 'Client';
    const session = value('session') || 'Tattoo';
    return `TATTOO INQUIRY | ${name} | ${session}`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const body = buildInquiry();
    const mailto = `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Email ready. Add your reference + placement photos before sending. ♡';
    window.location.href = mailto;
  });

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      const text = `${subject()}\n\n${buildInquiry()}`;
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Copied. Paste it into an email to ' + destination + ' and add your photos. ✦';
      } catch (error) {
        status.textContent = 'Copy was blocked by the browser. Use “create my inquiry email” instead.';
      }
    });
  }
})();


/* LoveJoy events calendar: current month only, data from events.json */
(() => {
  const root = document.querySelector('[data-event-calendar]');
  if (!root) return;

  const grid = root.querySelector('[data-calendar-grid]');
  const monthLabel = document.querySelector('[data-calendar-month]');
  const list = document.querySelector('[data-calendar-events]');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  if (monthLabel) monthLabel.textContent = monthName;

  function render(events) {
    grid.replaceChildren();

    const first = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
    const offset = first.getDay();

    for (let i = 0; i < offset; i += 1) {
      const blank = document.createElement('div');
      blank.className = 'calendar-day is-empty';
      blank.setAttribute('aria-hidden', 'true');
      grid.appendChild(blank);
    }

    const currentEvents = events.filter((event) => {
      if (!event.date) return false;
      const date = new Date(`${event.date}T12:00:00`);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const byDay = new Map();
    currentEvents.forEach((event) => {
      const day = Number(event.date.split('-')[2]);
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push(event);
    });

    for (let day = 1; day <= days; day += 1) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      const isToday = day === now.getDate() &&
        month === now.getMonth() &&
        year === now.getFullYear();
      if (isToday) cell.classList.add('is-today');

      const number = document.createElement('span');
      number.className = 'calendar-day-number';
      number.textContent = day;
      cell.appendChild(number);

      const dayEvents = byDay.get(day) || [];
      dayEvents.slice(0, 3).forEach((event) => {
        const chip = document.createElement(event.url ? 'a' : 'div');
        chip.className = 'calendar-chip';
        chip.textContent = event.title || 'LoveJoy event';
        if (event.url) chip.href = event.url;
        if (event.url && /^https?:/.test(event.url)) {
          chip.target = '_blank';
          chip.rel = 'noopener';
        }
        cell.appendChild(chip);
      });

      if (dayEvents.length > 3) {
        const more = document.createElement('small');
        more.className = 'calendar-more';
        more.textContent = `+${dayEvents.length - 3} more`;
        cell.appendChild(more);
      }

      grid.appendChild(cell);
    }

    list.replaceChildren();
    if (!currentEvents.length) {
      const empty = document.createElement('div');
      empty.className = 'calendar-empty-card';
      empty.innerHTML = '<strong>nothing confirmed here yet ♡</strong><span>That means the rumor mill is still doing its job. Confirmed dates will appear automatically.</span>';
      list.appendChild(empty);
      return;
    }

    currentEvents
      .sort((a,b) => a.date.localeCompare(b.date))
      .forEach((event) => {
        const item = document.createElement('article');
        item.className = 'calendar-list-item';

        const date = new Date(`${event.date}T12:00:00`);
        const dateText = date.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });

        const meta = document.createElement('span');
        meta.className = 'calendar-list-date';
        meta.textContent = [dateText, event.time].filter(Boolean).join(' · ');

        const title = document.createElement('strong');
        title.textContent = event.title || 'LoveJoy event';

        const desc = document.createElement('p');
        desc.textContent = event.description || '';

        const copy = document.createElement('div');
        copy.append(meta, title);
        if (event.description) copy.appendChild(desc);

        item.appendChild(copy);

        if (event.url) {
          const link = document.createElement('a');
          link.href = event.url;
          link.className = 'calendar-event-link';
          link.textContent = event.linkLabel || 'details →';
          if (/^https?:/.test(event.url)) {
            link.target = '_blank';
            link.rel = 'noopener';
          }
          item.appendChild(link);
        }

        list.appendChild(item);
      });
  }

  fetch('events.json', { cache: 'no-store' })
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((data) => render(Array.isArray(data.events) ? data.events : []))
    .catch(() => render([]));
})();

/* Event inquiry -> structured email */
(() => {
  const forms = document.querySelectorAll('[data-event-inquiry]');
  if (!forms.length) return;

  function formValue(form, name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function buildPrivate(form) {
    return [
      'LOVEJOY PRIVATE EVENT INQUIRY',
      '',
      `Name: ${formValue(form,'name')}`,
      `Email: ${formValue(form,'email')}`,
      `Phone: ${formValue(form,'phone') || 'not provided'}`,
      `Event type: ${formValue(form,'event_type')}`,
      `Estimated guests: ${formValue(form,'guests')}`,
      `Preferred date / range: ${formValue(form,'date') || 'flexible / not provided'}`,
      `Preferred time / duration: ${formValue(form,'time') || 'not provided'}`,
      `Budget range: ${formValue(form,'budget') || 'not provided'}`,
      '',
      'EVENT CONCEPT:',
      formValue(form,'concept'),
      '',
      'SPACE / SETUP NEEDS:',
      formValue(form,'needs') || 'none listed'
    ].join('\n');
  }

  function buildLoveJoy(form) {
    return [
      'LOVEJOY EVENT / COLLABORATION INQUIRY',
      '',
      `Name / organization: ${formValue(form,'name')}`,
      `Email: ${formValue(form,'email')}`,
      `Phone: ${formValue(form,'phone') || 'not provided'}`,
      `Role: ${formValue(form,'role')}`,
      `Program fit: ${formValue(form,'program')}`,
      `Timing: ${formValue(form,'timing') || 'flexible / not provided'}`,
      '',
      'THE PITCH:',
      formValue(form,'concept'),
      '',
      'WHAT I / WE BRING:',
      formValue(form,'bring'),
      '',
      'WHAT I / WE NEED FROM LOVEJOY:',
      formValue(form,'needs') || 'none listed',
      '',
      'LINKS:',
      formValue(form,'links') || 'none provided',
      '',
      'ATTACHMENTS:',
      'Add any deck, images, references, or files that would help Jessie understand the idea before sending.'
    ].join('\n');
  }

  forms.forEach((form) => {
    const type = form.dataset.inquiryType;
    const destination = form.dataset.email || 'hello@lovejoymarket.co';
    const status = form.querySelector('[data-event-status]');
    const copyButton = form.querySelector('[data-event-copy]');

    function build() {
      return type === 'private' ? buildPrivate(form) : buildLoveJoy(form);
    }

    function subject() {
      const name = formValue(form,'name') || 'Inquiry';
      if (type === 'private') {
        return `PRIVATE EVENT INQUIRY | ${name} | ${formValue(form,'event_type') || 'Event'}`;
      }
      return `LOVEJOY EVENT IDEA | ${name} | ${formValue(form,'role') || 'Collaboration'}`;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const mailto = `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(build())}`;
      if (status) status.textContent = 'Email ready. Add any useful attachments before sending. ✦';
      window.location.href = mailto;
    });

    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        if (!form.reportValidity()) return;
        const text = `${subject()}\n\n${build()}`;
        try {
          await navigator.clipboard.writeText(text);
          if (status) status.textContent = `Copied. Paste it into an email to ${destination}. ♡`;
        } catch (error) {
          if (status) status.textContent = 'Copy was blocked by the browser. Use the email button instead.';
        }
      });
    }
  });
})();

/* LoveJoy Starcade - original retro space shooter */
(() => {
  const canvas = document.querySelector('[data-lovejoy-game]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scoreEl = document.querySelector('[data-game-score]');
  const livesEl = document.querySelector('[data-game-lives]');
  const waveEl = document.querySelector('[data-game-wave]');
  const overlay = document.querySelector('[data-game-overlay]');
  const startBtn = document.querySelector('[data-game-start]');
  const resetBtn = document.querySelector('[data-game-reset]');
  const leftBtn = document.querySelector('[data-game-left]');
  const rightBtn = document.querySelector('[data-game-right]');
  const fireBtn = document.querySelector('[data-game-fire]');

  const W = canvas.width;
  const H = canvas.height;
  const keys = new Set();

  let running = false;
  let raf = 0;
  let score = 0;
  let lives = 3;
  let wave = 1;
  let player;
  let bullets = [];
  let enemies = [];
  let enemyDir = 1;
  let enemySpeed = .35;
  let lastFire = 0;
  let lastFrame = 0;

  function resetState() {
    score = 0;
    lives = 3;
    wave = 1;
    player = { x: W/2 - 14, y: H - 35, w: 28, h: 16, speed: 3.5 };
    bullets = [];
    enemyDir = 1;
    enemySpeed = .35;
    makeWave();
    updateHud();
  }

  function makeWave() {
    enemies = [];
    const rows = Math.min(3 + Math.floor((wave-1)/2), 5);
    const cols = 7;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        enemies.push({
          x: 28 + col * 38,
          y: 42 + row * 29,
          w: 18,
          h: 14,
          alive: true,
          phase: (row + col) % 3
        });
      }
    }
    enemySpeed = .32 + (wave-1) * .08;
  }

  function updateHud() {
    scoreEl.textContent = String(score).padStart(4,'0');
    livesEl.textContent = lives;
    waveEl.textContent = wave;
  }

  function fire() {
    const now = performance.now();
    if (!running || now - lastFire < 220) return;
    lastFire = now;
    bullets.push({ x: player.x + player.w/2 - 2, y: player.y - 8, w: 4, h: 10 });
  }

  function rects(a,b) {
    return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  }

  function endGame(message) {
    running = false;
    cancelAnimationFrame(raf);
    overlay.hidden = false;
    overlay.querySelector('strong').textContent = message;
    overlay.querySelector('span').textContent = `score ${String(score).padStart(4,'0')} · wave ${wave}`;
    startBtn.textContent = 'play again ✦';
  }

  function hitPlayer() {
    lives -= 1;
    updateHud();
    if (lives <= 0) {
      endGame('GAME OVER, BABE');
      return true;
    }
    enemies.forEach((enemy) => { enemy.y -= 42; });
    return false;
  }

  function update(dt) {
    const move = player.speed * (dt/16.67);
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) player.x -= move;
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) player.x += move;
    player.x = Math.max(8, Math.min(W-player.w-8, player.x));

    bullets.forEach((b) => b.y -= 5.4 * (dt/16.67));
    bullets = bullets.filter((b) => b.y + b.h > 0);

    let left = Infinity, right = -Infinity;
    enemies.forEach((e) => {
      if (!e.alive) return;
      left = Math.min(left, e.x);
      right = Math.max(right, e.x + e.w);
    });

    if ((right >= W-9 && enemyDir > 0) || (left <= 9 && enemyDir < 0)) {
      enemyDir *= -1;
      enemies.forEach((e) => { if (e.alive) e.y += 10; });
    }

    enemies.forEach((e) => {
      if (!e.alive) return;
      e.x += enemyDir * enemySpeed * (dt/16.67);

      if (e.y + e.h >= player.y) {
        if (hitPlayer()) return;
      }
    });

    bullets.forEach((b) => {
      enemies.forEach((e) => {
        if (!e.alive) return;
        if (rects(b,e)) {
          e.alive = false;
          b.y = -99;
          score += 10;
          updateHud();
        }
      });
    });
    bullets = bullets.filter((b) => b.y > -20);

    if (enemies.every((e) => !e.alive)) {
      wave += 1;
      score += 50;
      updateHud();
      makeWave();
    }
  }

  function drawPixelStar(x,y,phase) {
    const cream = '#fff8ec';
    const pink = '#ff2d8d';
    ctx.fillStyle = phase === 1 ? pink : cream;
    ctx.fillRect(x+7,y,4,14);
    ctx.fillRect(x+2,y+5,14,4);
    if (phase === 2) {
      ctx.fillStyle = pink;
      ctx.fillRect(x+7,y+5,4,4);
    }
  }

  function draw() {
    ctx.fillStyle = '#07182c';
    ctx.fillRect(0,0,W,H);

    ctx.globalAlpha = .22;
    ctx.fillStyle = '#fff8ec';
    for (let i=0;i<28;i+=1) {
      const x = (i*73 + wave*17) % W;
      const y = (i*47 + score) % H;
      ctx.fillRect(x,y,1,1);
    }
    ctx.globalAlpha = 1;

    enemies.forEach((e) => {
      if (e.alive) drawPixelStar(e.x,e.y,e.phase);
    });

    ctx.fillStyle = '#ff2d8d';
    bullets.forEach((b) => ctx.fillRect(b.x,b.y,b.w,b.h));

    // Player: little cream/pink retro ship-heart hybrid.
    ctx.fillStyle = '#fff8ec';
    ctx.fillRect(player.x+10, player.y, 8, 4);
    ctx.fillRect(player.x+6, player.y+4, 16, 4);
    ctx.fillRect(player.x+2, player.y+8, 24, 4);
    ctx.fillRect(player.x, player.y+12, 28, 4);
    ctx.fillStyle = '#ff2d8d';
    ctx.fillRect(player.x+11, player.y+6, 6, 6);
  }

  function loop(ts) {
    if (!running) return;
    const dt = Math.min(32, ts - lastFrame || 16.67);
    lastFrame = ts;
    update(dt);
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }

  function start() {
    resetState();
    overlay.hidden = true;
    running = true;
    lastFrame = performance.now();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function press(key) {
    keys.add(key);
  }
  function release(key) {
    keys.delete(key);
  }

  window.addEventListener('keydown', (event) => {
    if (!canvas.closest('.starcade-card')) return;
    if (['ArrowLeft','ArrowRight',' ','a','A','d','D'].includes(event.key)) {
      if (running) event.preventDefault();
      if (event.key === ' ') fire();
      else press(event.key);
    }
  });
  window.addEventListener('keyup', (event) => release(event.key));

  function holdButton(button,key) {
    if (!button) return;
    ['pointerdown','touchstart'].forEach((name) => button.addEventListener(name, (e) => {
      e.preventDefault(); press(key);
    }, { passive:false }));
    ['pointerup','pointercancel','pointerleave','touchend'].forEach((name) => button.addEventListener(name, (e) => {
      e.preventDefault(); release(key);
    }, { passive:false }));
  }

  holdButton(leftBtn,'ArrowLeft');
  holdButton(rightBtn,'ArrowRight');

  if (fireBtn) {
    fireBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
    fireBtn.addEventListener('touchstart', (e) => { e.preventDefault(); fire(); }, { passive:false });
  }

  if (startBtn) startBtn.addEventListener('click', start);
  if (resetBtn) resetBtn.addEventListener('click', start);

  resetState();
  draw();
})();
