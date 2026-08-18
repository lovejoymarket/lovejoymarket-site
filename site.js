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
  const highEl = document.querySelector('[data-game-high]');
  const highCard = document.querySelector('[data-high-score-card]');
  const scoreboardHigh = document.querySelector('[data-scoreboard-high]');
  const overlay = document.querySelector('[data-game-overlay]');
  const startBtn = document.querySelector('[data-game-start]');
  const resetBtn = document.querySelector('[data-game-reset]');
  const leftBtn = document.querySelector('[data-game-left]');
  const rightBtn = document.querySelector('[data-game-right]');
  const fireBtn = document.querySelector('[data-game-fire]');

  const W = canvas.width;
  const H = canvas.height;
  const keys = new Set();
  const highKey = 'lovejoyStarcadeHighScore';

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

  function getHigh() {
    const value = Number(localStorage.getItem(highKey) || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function setHigh(value) {
    try {
      localStorage.setItem(highKey, String(value));
    } catch (error) {}
  }

  function refreshHigh() {
    const high = getHigh();
    const text = String(high).padStart(4,'0');
    if (highEl) highEl.textContent = text;
    if (highCard) highCard.textContent = text;
    if (scoreboardHigh) scoreboardHigh.textContent = text;
  }

  function resetState() {
    score = 0;
    lives = 3;
    wave = 1;
    player = { x: W/2 - 14, y: H - 38, w: 28, h: 16, speed: 3.7 };
    bullets = [];
    enemyDir = 1;
    enemySpeed = .35;
    makeWave();
    updateHud();
    refreshHigh();
  }

  function makeWave() {
    enemies = [];
    const rows = Math.min(3 + Math.floor((wave-1)/2), 5);
    const cols = W >= 400 ? 8 : 7;
    const spacing = W >= 400 ? 45 : 38;
    const startX = W >= 400 ? 31 : 28;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        enemies.push({
          x: startX + col * spacing,
          y: 46 + row * 30,
          w: 18,
          h: 17,
          alive: true,
          phase: (row + col) % 3
        });
      }
    }
    enemySpeed = .32 + (wave-1) * .08;
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(score).padStart(4,'0');
    if (livesEl) livesEl.textContent = lives;
    if (waveEl) waveEl.textContent = wave;

    if (score > getHigh()) {
      setHigh(score);
      refreshHigh();
    }
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
    if (score > getHigh()) setHigh(score);
    refreshHigh();
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

    bullets.forEach((b) => b.y -= 5.5 * (dt/16.67));
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

  function drawHeartTarget(x,y,phase) {
    const cream = '#fff8ec';
    const pink = '#ff2d8d';
    const ink = '#07182c';

    // chunky pixel heart
    ctx.fillStyle = phase === 1 ? pink : cream;
    ctx.fillRect(x+3, y+2, 5, 5);
    ctx.fillRect(x+10, y+2, 5, 5);
    ctx.fillRect(x+1, y+5, 16, 5);
    ctx.fillRect(x+4, y+10, 10, 4);
    ctx.fillRect(x+7, y+14, 4, 3);

    // tiny dark center detail so cream hearts still read
    if (phase === 2) {
      ctx.fillStyle = ink;
      ctx.fillRect(x+8, y+7, 2, 2);
    }
  }

  function drawSmileyTarget(x,y,phase) {
    const cream = '#fff8ec';
    const pink = '#ff2d8d';
    const ink = '#07182c';

    // pixel face
    ctx.fillStyle = phase === 1 ? pink : cream;
    ctx.fillRect(x+3, y+1, 12, 2);
    ctx.fillRect(x+1, y+3, 16, 10);
    ctx.fillRect(x+3, y+13, 12, 2);

    // eyes + smile
    ctx.fillStyle = ink;
    ctx.fillRect(x+5, y+5, 2, 2);
    ctx.fillRect(x+11, y+5, 2, 2);
    ctx.fillRect(x+5, y+10, 2, 1);
    ctx.fillRect(x+7, y+11, 4, 1);
    ctx.fillRect(x+11, y+10, 2, 1);

    // little LoveJoy pink cheek/detail
    if (phase === 2) {
      ctx.fillStyle = pink;
      ctx.fillRect(x+14, y+8, 2, 2);
    }
  }

  function drawLoveJoyTarget(x,y,phase) {
    if (phase % 2 === 0) drawHeartTarget(x,y,phase);
    else drawSmileyTarget(x,y,phase);
  }

  function draw() {
    ctx.fillStyle = '#07182c';
    ctx.fillRect(0,0,W,H);

    ctx.globalAlpha = .22;
    ctx.fillStyle = '#fff8ec';
    for (let i=0;i<34;i+=1) {
      const x = (i*73 + wave*17) % W;
      const y = (i*47 + score) % H;
      ctx.fillRect(x,y,1,1);
    }
    ctx.globalAlpha = 1;

    enemies.forEach((e) => {
      if (e.alive) drawLoveJoyTarget(e.x,e.y,e.phase);
    });

    ctx.fillStyle = '#ff2d8d';
    bullets.forEach((b) => ctx.fillRect(b.x,b.y,b.w,b.h));

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

  function press(key) { keys.add(key); }
  function release(key) { keys.delete(key); }

  window.addEventListener('keydown', (event) => {
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
      e.preventDefault();
      press(key);
    }, { passive:false }));
    ['pointerup','pointercancel','pointerleave','touchend'].forEach((name) => button.addEventListener(name, (e) => {
      e.preventDefault();
      release(key);
    }, { passive:false }));
  }

  holdButton(leftBtn,'ArrowLeft');
  holdButton(rightBtn,'ArrowRight');

  if (fireBtn) {
    fireBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
    fireBtn.addEventListener('touchstart', (e) => { e.preventDefault(); fire(); }, { passive:false });
  }

  /* Mobile gesture controls:
     - drag/slide anywhere on the canvas to move horizontally
     - quick tap on the canvas to fire
  */
  let gesturePointerId = null;
  let gestureStartX = 0;
  let gestureStartY = 0;
  let gestureStartTime = 0;
  let gestureMoved = false;

  function canvasXFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    return (event.clientX - rect.left) * scaleX;
  }

  function movePlayerToPointer(event) {
    if (!running || !player) return;
    const targetX = canvasXFromPointer(event) - player.w / 2;
    player.x = Math.max(8, Math.min(W - player.w - 8, targetX));
    draw();
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (!running) return;
    event.preventDefault();

    gesturePointerId = event.pointerId;
    gestureStartX = event.clientX;
    gestureStartY = event.clientY;
    gestureStartTime = performance.now();
    gestureMoved = false;

    try { canvas.setPointerCapture(event.pointerId); } catch (error) {}
    movePlayerToPointer(event);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!running || event.pointerId !== gesturePointerId) return;
    event.preventDefault();

    const dx = event.clientX - gestureStartX;
    const dy = event.clientY - gestureStartY;

    if (Math.hypot(dx, dy) > 8) gestureMoved = true;
    movePlayerToPointer(event);
  });

  canvas.addEventListener('pointerup', (event) => {
    if (event.pointerId !== gesturePointerId) return;
    event.preventDefault();

    const elapsed = performance.now() - gestureStartTime;
    const dx = event.clientX - gestureStartX;
    const dy = event.clientY - gestureStartY;
    const distance = Math.hypot(dx, dy);

    // A short, mostly-stationary tap fires.
    if (running && !gestureMoved && distance < 10 && elapsed < 320) {
      fire();
    }

    try { canvas.releasePointerCapture(event.pointerId); } catch (error) {}
    gesturePointerId = null;
  });

  canvas.addEventListener('pointercancel', (event) => {
    if (event.pointerId === gesturePointerId) {
      gesturePointerId = null;
    }
  });

  if (startBtn) startBtn.addEventListener('click', start);
  if (resetBtn) resetBtn.addEventListener('click', start);

  resetState();
  draw();
})();


/* ==========================================================
   BLOCK PARTY
   ========================================================== */
(() => {
  const canvas = document.querySelector('[data-block-party]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const nextCanvas = document.querySelector('[data-block-next]');
  const nextCtx = nextCanvas ? nextCanvas.getContext('2d') : null;
  const overlay = document.querySelector('[data-block-overlay]');
  const startBtn = document.querySelector('[data-block-start]');
  const scoreEl = document.querySelector('[data-block-score]');
  const highEl = document.querySelector('[data-block-high]');
  const highCard = document.querySelector('[data-block-high-card]');
  const linesEl = document.querySelector('[data-block-lines]');
  const levelEl = document.querySelector('[data-block-level]');
  const leftBtn = document.querySelector('[data-block-left]');
  const rightBtn = document.querySelector('[data-block-right]');
  const rotateBtn = document.querySelector('[data-block-rotate]');
  const dropBtn = document.querySelector('[data-block-drop]');

  const COLS = 10, ROWS = 18, CELL = canvas.width/COLS;
  const highKey = 'lovejoyBlockPartyHigh';
  const colors = ['','#ff2d8d','#fff8ec','#ff73b6'];
  const shapes = [
    [[1,1,1],[0,1,0]], [[1,1],[1,1]], [[1,1,1,1]],
    [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]]
  ];

  let board, current, next, score, lines, level, running, raf, lastDrop, dropEvery;

  const getHigh = () => Number(localStorage.getItem(highKey) || 0) || 0;
  const setHigh = (v) => { try { localStorage.setItem(highKey,String(v)); } catch(e){} };

  function updateHud() {
    if (score > getHigh()) setHigh(score);
    scoreEl.textContent = String(score).padStart(4,'0');
    highEl.textContent = String(getHigh()).padStart(4,'0');
    if (highCard) highCard.textContent = String(getHigh()).padStart(4,'0');
    linesEl.textContent = String(lines).padStart(2,'0');
    levelEl.textContent = level;
  }

  function blankBoard() {
    return Array.from({length:ROWS},()=>Array(COLS).fill(0));
  }

  function randomPiece() {
    const shape = shapes[Math.floor(Math.random()*shapes.length)].map(r=>r.slice());
    return {shape, x:Math.floor((COLS-shape[0].length)/2), y:-1, variant:1+Math.floor(Math.random()*3)};
  }

  function collides(piece,dx=0,dy=0,shape=piece.shape) {
    for (let r=0;r<shape.length;r++) for (let c=0;c<shape[r].length;c++) {
      if (!shape[r][c]) continue;
      const x = piece.x+c+dx, y = piece.y+r+dy;
      if (x<0 || x>=COLS || y>=ROWS) return true;
      if (y>=0 && board[y][x]) return true;
    }
    return false;
  }

  function rotateShape(s) { return s[0].map((_,i)=>s.map(row=>row[i]).reverse()); }

  function rotate() {
    if (!running) return;
    const r = rotateShape(current.shape);
    for (const kick of [0,-1,1,-2,2]) {
      if (!collides(current,kick,0,r)) {
        current.x += kick; current.shape = r; draw(); return;
      }
    }
  }

  function move(dx) {
    if (!running || collides(current,dx,0)) return;
    current.x += dx; draw();
  }

  function merge() {
    let dead = false;
    current.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if (!v) return;
      const y=current.y+r, x=current.x+c;
      if (y<0) dead=true; else board[y][x]=current.variant;
    }));
    if (dead) { gameOver(); return false; }
    return true;
  }

  function clearRows() {
    let cleared=0;
    board = board.filter(row=>{
      if (row.every(Boolean)) { cleared++; return false; }
      return true;
    });
    while (board.length<ROWS) board.unshift(Array(COLS).fill(0));
    if (cleared) {
      const awards=[0,100,260,480,800];
      lines += cleared;
      score += (awards[cleared]||cleared*250)*level;
      level = 1+Math.floor(lines/8);
      dropEvery = Math.max(160,700-(level-1)*60);
      updateHud();
    }
  }

  function spawn() {
    current = next || randomPiece();
    current.x = Math.floor((COLS-current.shape[0].length)/2);
    current.y = -1;
    next = randomPiece();
    drawNext();
    if (collides(current)) gameOver();
  }

  function softDrop(manual=false) {
    if (!running) return;
    if (!collides(current,0,1)) {
      current.y++;
      if (manual) score++;
      updateHud();
    } else {
      if (!merge()) return;
      clearRows(); spawn();
    }
    draw();
  }

  function hardDrop() {
    if (!running) return;
    let dist=0;
    while (!collides(current,0,1)) { current.y++; dist++; }
    score += dist*2; updateHud();
    if (!merge()) return;
    clearRows(); spawn(); draw();
  }

  function drawCell(x,y,v,alpha=1, target=ctx, size=CELL) {
    target.globalAlpha=alpha;
    target.fillStyle=colors[v] || '#ff2d8d';
    target.fillRect(x*size+2,y*size+2,size-4,size-4);
    target.strokeStyle='#07182c';
    target.strokeRect(x*size+3,y*size+3,size-6,size-6);
    target.globalAlpha=1;
  }

  function draw() {
    ctx.fillStyle='#07182c'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(255,248,236,.07)';
    for(let c=1;c<COLS;c++){ctx.beginPath();ctx.moveTo(c*CELL,0);ctx.lineTo(c*CELL,canvas.height);ctx.stroke();}
    for(let r=1;r<ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*CELL);ctx.lineTo(canvas.width,r*CELL);ctx.stroke();}
    board.forEach((row,r)=>row.forEach((v,c)=>{if(v)drawCell(c,r,v);}));
    if(current) current.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(v && current.y+r>=0) drawCell(current.x+c,current.y+r,current.variant);
    }));
  }

  function drawNext() {
    if (!nextCtx || !next) return;
    nextCtx.fillStyle='#07182c'; nextCtx.fillRect(0,0,nextCanvas.width,nextCanvas.height);
    const s=22, ox=(nextCanvas.width-next.shape[0].length*s)/2, oy=(nextCanvas.height-next.shape.length*s)/2;
    next.shape.forEach((row,r)=>row.forEach((v,c)=>{
      if(!v)return;
      nextCtx.fillStyle=colors[next.variant];
      nextCtx.fillRect(ox+c*s+2,oy+r*s+2,s-4,s-4);
      nextCtx.strokeStyle='#07182c';
      nextCtx.strokeRect(ox+c*s+3,oy+r*s+3,s-6,s-6);
    }));
  }

  function gameOver() {
    running=false; cancelAnimationFrame(raf);
    if(score>getHigh())setHigh(score);
    updateHud();
    overlay.hidden=false;
    overlay.querySelector('strong').textContent='STACK COLLAPSED, BABE';
    overlay.querySelector('span').textContent=`score ${score} · lines ${lines}`;
    startBtn.textContent='try again ✦';
  }

  function start() {
    board=blankBoard(); score=0; lines=0; level=1; running=true; dropEvery=700;
    next=randomPiece(); spawn(); updateHud(); overlay.hidden=true;
    lastDrop=performance.now(); raf=requestAnimationFrame(loop);
  }

  function loop(ts) {
    if(!running)return;
    if(ts-lastDrop>=dropEvery){softDrop(false);lastDrop=ts;}
    raf=requestAnimationFrame(loop);
  }

  window.addEventListener('keydown',(e)=>{
    if(!running)return;
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
    if(e.key==='ArrowLeft')move(-1);
    if(e.key==='ArrowRight')move(1);
    if(e.key==='ArrowUp')rotate();
    if(e.key==='ArrowDown')softDrop(true);
    if(e.key===' ')hardDrop();
  });

  leftBtn?.addEventListener('click',()=>move(-1));
  rightBtn?.addEventListener('click',()=>move(1));
  rotateBtn?.addEventListener('click',rotate);
  dropBtn?.addEventListener('click',hardDrop);
  startBtn?.addEventListener('click',start);

  let px=null, py=null, moved=false;
  canvas.addEventListener('pointerdown',(e)=>{
    if(!running)return;
    e.preventDefault(); px=e.clientX; py=e.clientY; moved=false;
    try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  });
  canvas.addEventListener('pointermove',(e)=>{
    if(px===null||!running)return;
    e.preventDefault();
    const dx=e.clientX-px, dy=e.clientY-py;
    if(Math.abs(dx)>22 && Math.abs(dx)>Math.abs(dy)){
      move(dx>0?1:-1); px=e.clientX; py=e.clientY; moved=true;
    }
  });
  canvas.addEventListener('pointerup',(e)=>{
    if(px===null)return;
    e.preventDefault();
    const dx=e.clientX-px, dy=e.clientY-py;
    if(Math.abs(dy)>38 && dy>0 && Math.abs(dy)>Math.abs(dx)) hardDrop();
    else if(!moved && Math.abs(dx)<12 && Math.abs(dy)<12) rotate();
    px=py=null;
  });

  board=blankBoard(); next=randomPiece(); current=randomPiece(); updateHud(); draw(); drawNext();
})();

/* ==========================================================
   HEART ATTACK
   ========================================================== */
(() => {
  const canvas=document.querySelector('[data-heart-attack]');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const overlay=document.querySelector('[data-heart-overlay]');
  const startBtn=document.querySelector('[data-heart-start]');
  const scoreEl=document.querySelector('[data-heart-score]');
  const highEl=document.querySelector('[data-heart-high]');
  const highCard=document.querySelector('[data-heart-high-card]');
  const livesEl=document.querySelector('[data-heart-lives]');
  const levelEl=document.querySelector('[data-heart-level]');
  const btnUp=document.querySelector('[data-heart-up]');
  const btnDown=document.querySelector('[data-heart-down]');
  const btnLeft=document.querySelector('[data-heart-left]');
  const btnRight=document.querySelector('[data-heart-right]');

  const TILE=28;
  const highKey='lovejoyHeartAttackHigh';
  const mazeTemplate=[
    "###############",
    "#.............#",
    "#.###.###.###.#",
    "#.............#",
    "#.###.#.#.###.#",
    "#.....#.#.....#",
    "#####.#.#.#####",
    "#.............#",
    "#.###.###.###.#",
    "#...#.....#...#",
    "###.#.###.#.###",
    "#.............#",
    "#.###.###.###.#",
    "#.............#",
    "###############"
  ];
  const dirs={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}};
  let maze, pellets, player, enemies, requested='left', current='left', score=0,lives=3,level=1,running=false,last=0,raf=0;

  const getHigh=()=>Number(localStorage.getItem(highKey)||0)||0;
  const setHigh=(v)=>{try{localStorage.setItem(highKey,String(v))}catch(e){}};

  function updateHud(){
    if(score>getHigh())setHigh(score);
    scoreEl.textContent=String(score).padStart(4,'0');
    highEl.textContent=String(getHigh()).padStart(4,'0');
    if(highCard)highCard.textContent=String(getHigh()).padStart(4,'0');
    livesEl.textContent=lives; levelEl.textContent=level;
  }

  function setupMaze(){
    maze=mazeTemplate.map(r=>r.split(''));
    pellets=new Set();
    for(let y=0;y<maze.length;y++)for(let x=0;x<maze[y].length;x++){
      if(maze[y][x]==='.')pellets.add(`${x},${y}`);
    }
    resetActors();
  }

  function resetActors(){
    player={x:7,y:11};
    current='left'; requested='left';
    enemies=[
      {x:1,y:1,dir:'right',phase:0},
      {x:13,y:1,dir:'left',phase:1},
      {x:1,y:13,dir:'right',phase:2}
    ];
    pellets.delete(`${player.x},${player.y}`);
  }

  function open(x,y){return maze[y]&&maze[y][x]&&maze[y][x]!=='#';}
  function canMove(actor,dir){
    const d=dirs[dir]; return open(actor.x+d.x,actor.y+d.y);
  }

  function movePlayer(){
    if(canMove(player,requested))current=requested;
    if(canMove(player,current)){
      player.x+=dirs[current].x; player.y+=dirs[current].y;
    }
    const key=`${player.x},${player.y}`;
    if(pellets.has(key)){pellets.delete(key);score+=10;updateHud();}
    if(pellets.size===0){
      score+=250; level++; updateHud(); setupMaze();
    }
  }

  function chooseEnemyDir(e){
    const choices=Object.keys(dirs).filter(d=>canMove(e,d));
    if(!choices.length)return e.dir;
    const opposite={left:'right',right:'left',up:'down',down:'up'}[e.dir];
    let best=choices.filter(d=>d!==opposite);
    if(!best.length)best=choices;
    best.sort((a,b)=>{
      const da=Math.abs((e.x+dirs[a].x)-player.x)+Math.abs((e.y+dirs[a].y)-player.y);
      const db=Math.abs((e.x+dirs[b].x)-player.x)+Math.abs((e.y+dirs[b].y)-player.y);
      return da-db;
    });
    return Math.random()<0.7?best[0]:best[Math.floor(Math.random()*best.length)];
  }

  function moveEnemies(){
    enemies.forEach(e=>{
      e.dir=chooseEnemyDir(e);
      if(canMove(e,e.dir)){e.x+=dirs[e.dir].x;e.y+=dirs[e.dir].y;}
    });
  }

  function collided(){
    return enemies.some(e=>e.x===player.x&&e.y===player.y);
  }

  function loseLife(){
    lives--; updateHud();
    if(lives<=0){gameOver();return;}
    resetActors();
  }

  function drawHeart(cx,cy,s,fill='#ff2d8d'){
    // Bigger visual heart, while collision logic remains tile-based.
    const pulse = 1 + Math.sin(performance.now()/180) * 0.045;
    const size = s * pulse;

    // Soft glow behind the heart.
    ctx.save();
    ctx.shadowColor = '#ff2d8d';
    ctx.shadowBlur = 11;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(cx,cy+size*.42);
    ctx.bezierCurveTo(cx-size*.76,cy-size*.16,cx-size*.64,cy-size*.82,cx,cy-size*.29);
    ctx.bezierCurveTo(cx+size*.64,cy-size*.82,cx+size*.76,cy-size*.16,cx,cy+size*.42);
    ctx.fill();
    ctx.restore();

    // Tiny cream highlight so it reads as glossy/sparkly.
    ctx.fillStyle = '#fff8ec';
    ctx.beginPath();
    ctx.arc(cx-size*.27,cy-size*.30,Math.max(1.5,size*.10),0,Math.PI*2);
    ctx.fill();

    // Animated sparkle halo.
    const t = performance.now()/320;
    const sparkleData = [
      {a:0.20,r:size*1.55,p:0},
      {a:1.65,r:size*1.75,p:1},
      {a:3.00,r:size*1.50,p:2},
      {a:4.55,r:size*1.72,p:3}
    ];

    sparkleData.forEach((sp,i)=>{
      const twinkle = .55 + .45*Math.sin(t*2.2 + sp.p);
      const angle = sp.a + Math.sin(t*.45+i)*.10;
      const x = cx + Math.cos(angle)*sp.r;
      const y = cy + Math.sin(angle)*sp.r;
      const arm = 2.5 + twinkle*2.4;

      ctx.save();
      ctx.globalAlpha = .35 + twinkle*.65;
      ctx.fillStyle = i % 2 ? '#ff2d8d' : '#fff8ec';
      ctx.fillRect(x-arm, y-1, arm*2, 2);
      ctx.fillRect(x-1, y-arm, 2, arm*2);
      ctx.restore();
    });
  }

  function drawSmiley(cx,cy,s,phase){
    ctx.fillStyle=phase===1?'#ff2d8d':'#fff8ec';
    ctx.beginPath();ctx.arc(cx,cy,s,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#07182c';
    ctx.fillRect(cx-s*.42,cy-s*.25,2,2);ctx.fillRect(cx+s*.25,cy-s*.25,2,2);
    ctx.beginPath();ctx.arc(cx,cy+s*.08,s*.45,0,Math.PI);ctx.strokeStyle='#07182c';ctx.lineWidth=2;ctx.stroke();
  }

  function draw(){
    ctx.fillStyle='#07182c';ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let y=0;y<maze.length;y++)for(let x=0;x<maze[y].length;x++){
      const px=x*TILE,py=y*TILE;
      if(maze[y][x]==='#'){
        ctx.fillStyle='rgba(255,45,141,.22)';
        ctx.fillRect(px+2,py+2,TILE-4,TILE-4);
        ctx.strokeStyle='#ff2d8d';ctx.strokeRect(px+4,py+4,TILE-8,TILE-8);
      } else if(pellets.has(`${x},${y}`)){
        ctx.fillStyle='#fff8ec';ctx.fillRect(px+TILE/2-1,py+TILE/2-1,3,3);
      }
    }
    drawHeart(player.x*TILE+TILE/2,player.y*TILE+TILE/2,14);
    enemies.forEach(e=>drawSmiley(e.x*TILE+TILE/2,e.y*TILE+TILE/2,9,e.phase));
  }

  function gameOver(){
    running=false;cancelAnimationFrame(raf);
    if(score>getHigh())setHigh(score);updateHud();
    overlay.hidden=false;
    overlay.querySelector('strong').textContent='EMOTIONALLY COMPROMISED';
    overlay.querySelector('span').textContent=`score ${score} · level ${level}`;
    startBtn.textContent='re-enter the maze ♡';
  }

  function start(){
    score=0;lives=3;level=1;running=true;setupMaze();updateHud();overlay.hidden=true;last=performance.now();draw();raf=requestAnimationFrame(loop);
  }

  function loop(ts){
    if(!running)return;
    const interval=Math.max(95,220-(level-1)*15);
    if(ts-last>=interval){
      movePlayer();
      if(collided()){loseLife();draw();last=ts;raf=requestAnimationFrame(loop);return;}
      moveEnemies();
      if(collided())loseLife();
      draw();last=ts;
    }
    if(running)raf=requestAnimationFrame(loop);
  }

  function request(dir){requested=dir;}
  window.addEventListener('keydown',e=>{
    const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down'};
    if(map[e.key]){if(running)e.preventDefault();request(map[e.key]);}
  });
  btnLeft?.addEventListener('click',()=>request('left'));
  btnRight?.addEventListener('click',()=>request('right'));
  btnUp?.addEventListener('click',()=>request('up'));
  btnDown?.addEventListener('click',()=>request('down'));
  startBtn?.addEventListener('click',start);

  let sx=null,sy=null;
  canvas.addEventListener('pointerdown',e=>{if(!running)return;e.preventDefault();sx=e.clientX;sy=e.clientY;try{canvas.setPointerCapture(e.pointerId)}catch(_){}});
  canvas.addEventListener('pointerup',e=>{
    if(sx===null)return;e.preventDefault();
    const dx=e.clientX-sx,dy=e.clientY-sy;
    if(Math.max(Math.abs(dx),Math.abs(dy))>18){
      request(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));
    }
    sx=sy=null;
  });

  score=0;lives=3;level=1;setupMaze();updateHud();draw();
})();

/* ==========================================================
   LOVEJOY SUN-SIGN GUESSER
   ========================================================== */
(() => {
  const root=document.querySelector('#sun-sign-quiz');
  if(!root)return;

  const signs=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

  const questions=[
    {
      q:'You enter a room where nobody knows each other. Your first instinct is:',
      options:[
        ['become the social thermostat without admitting it',{leo:2,libra:2,gemini:1}],
        ['find the one person with an interesting face and investigate',{scorpio:2,aquarius:1,gemini:1}],
        ['secure a comfortable seat and quietly assess the snacks',{taurus:2,cancer:1}],
        ['accidentally start a side quest nobody planned',{aries:2,sagittarius:2}]
      ]
    },
    {
      q:'Your relationship with plans could best be described as:',
      options:[
        ['I made the spreadsheet. Do not touch the spreadsheet.',{virgo:3,capricorn:2}],
        ['I made a plan so I could dramatically deviate from it later.',{libra:1,gemini:2,aquarius:1}],
        ['Plans are spiritually limiting but I do need to know where I am sleeping.',{sagittarius:2,taurus:1,pisces:1}],
        ['I will decide how I feel when the moment arrives.',{cancer:2,pisces:2,scorpio:1}]
      ]
    },
    {
      q:'Pick the sentence most likely to come out of your mouth after something mildly inconvenient:',
      options:[
        ['“Okay. New plan.”',{aries:2,capricorn:1}],
        ['“That is actually so interesting.” (it is not interesting)',{gemini:2,aquarius:2}],
        ['“I knew this was going to happen.”',{virgo:2,scorpio:2}],
        ['“Whatever. Do you want food?”',{taurus:2,cancer:2}]
      ]
    },
    {
      q:'Someone compliments you. Internally, you:',
      options:[
        ['accept the tribute',{leo:3,aries:1}],
        ['analyze why they chose that exact compliment',{virgo:1,scorpio:2,aquarius:1}],
        ['say thank you and replay it later like archival footage',{cancer:2,pisces:2}],
        ['compliment them back immediately and restore balance to the ecosystem',{libra:3,gemini:1}]
      ]
    },
    {
      q:'Choose your completely scientific final object:',
      options:[
        ['a matchbook from a bar that closed in 2009',{sagittarius:2,scorpio:1,aquarius:1}],
        ['a heavy ceramic mug that is objectively better than your other mugs',{taurus:3,cancer:1}],
        ['a tiny notebook with a terrifyingly specific list inside',{virgo:2,capricorn:2}],
        ['a disco ball in daylight',{leo:1,libra:2,pisces:1,gemini:1}]
      ]
    }
  ];

  const copy={
    aries:'You have been diagnosed with Aries because the machine detected forward motion before it detected a plan. You appear to treat hesitation as an administrative error. Your confidence is occasionally evidence-based.',
    taurus:'The machine says Taurus because your nervous system seems to believe comfort is a civil right. You have standards, textures matter, and once you decide something is “your thing,” moving you becomes a municipal project.',
    gemini:'Gemini. The machine noticed that your personality has tabs open. You are intellectually fast, conversationally dangerous, and fully capable of holding two contradictory opinions because both were funny at the time.',
    cancer:'Cancer. You are carrying an emotional archive with excellent labeling and pretending this is just “being observant.” You remember tones, dates, snacks, betrayals, and exactly who looked weird when somebody said the thing.',
    leo:'Leo. Not necessarily because you need attention, but because you seem to believe reality should have better lighting. You have a strong internal sense of occasion and a suspiciously cinematic relationship with being perceived.',
    virgo:'Virgo. The machine detected pattern recognition, quiet judgment, and at least one invisible checklist. You do not need control. You simply need things to stop being done incorrectly in front of you.',
    libra:'Libra. You are socially calibrated, aesthetically alert, and constantly trying to make the emotional furniture symmetrical. Your greatest enemy is choosing between two options that are both, annoyingly, valid.',
    scorpio:'Scorpio. You look normal, but the machine found a basement. You clock subtext before most people finish the sentence and are extremely interested in things you have publicly claimed not to care about.',
    sagittarius:'Sagittarius. The machine detected a philosophical monologue wearing sneakers. You are allergic to stagnation, suspicious of unnecessary rules, and always approximately one interesting invitation away from abandoning the original itinerary.',
    capricorn:'Capricorn. Your coping mechanism may be competence. You appear to believe that if the infrastructure is strong enough, nobody will notice you also have feelings. Unfortunately, the feelings have quarterly goals.',
    aquarius:'Aquarius. The machine cannot determine whether you are ahead of your time or simply refusing to stand where everyone else is standing. You are conceptually committed, emotionally elliptical, and weird in a highly organized way.',
    pisces:'Pisces. You have been classified as emotionally porous with an unauthorized amount of symbolism. You are either deeply intuitive or just very good at making a narrative out of atmospheric pressure. Both can be true.'
  };

  const footnotes=[
    'confidence level: medically inadmissible.',
    'methodology: vibes, objects, and an irresponsible amount of pattern recognition.',
    'please do not contact your actual astrologer about this.',
    'the machine is extremely sure. the machine has never met you.',
    'peer review status: absolutely not.'
  ];

  const intro=root.querySelector('[data-sun-intro]');
  const panel=root.querySelector('[data-sun-panel]');
  const result=root.querySelector('[data-sun-result]');
  const start=root.querySelector('[data-sun-start]');
  const qEl=root.querySelector('[data-sun-question]');
  const opts=root.querySelector('[data-sun-options]');
  const progress=root.querySelector('[data-sun-progress]');
  const back=root.querySelector('[data-sun-back]');
  const next=root.querySelector('[data-sun-next]');
  const resultTitle=root.querySelector('[data-sun-result-title]');
  const resultCopy=root.querySelector('[data-sun-result-copy]');
  const resultFoot=root.querySelector('[data-sun-result-footnote]');
  const retake=root.querySelector('[data-sun-retake]');

  let index=0, answers=Array(questions.length).fill(null);

  function renderQ(){
    const q=questions[index];
    progress.textContent=`question ${index+1} of ${questions.length}`;
    qEl.textContent=q.q;
    opts.replaceChildren();
    q.options.forEach((o,i)=>{
      const b=document.createElement('button');
      b.type='button';b.className='sun-option';b.textContent=o[0];
      if(answers[index]===i)b.classList.add('is-selected');
      b.addEventListener('click',()=>{
        answers[index]=i;
        opts.querySelectorAll('.sun-option').forEach(x=>x.classList.remove('is-selected'));
        b.classList.add('is-selected');next.disabled=false;
      });
      opts.appendChild(b);
    });
    back.style.visibility=index===0?'hidden':'visible';
    next.disabled=answers[index]===null;
    next.textContent=index===questions.length-1?'consult the machine ✦':'next question →';
  }

  function diagnose(){
    const totals=Object.fromEntries(signs.map(s=>[s,0]));
    questions.forEach((q,qi)=>{
      const selected=q.options[answers[qi]];
      Object.entries(selected[1]).forEach(([s,v])=>totals[s]+=v);
    });
    const ranked=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
    const top=ranked[0][1];
    const near=ranked.filter(([,v])=>v>=top-1);
    const sign=near[Math.floor(Math.random()*near.length)][0];
    resultTitle.textContent=`The machine says ${sign.toUpperCase()}.`;
    resultCopy.textContent=copy[sign];
    resultFoot.textContent=footnotes[Math.floor(Math.random()*footnotes.length)];
    panel.hidden=true;result.hidden=false;
  }

  start.addEventListener('click',()=>{intro.hidden=true;result.hidden=true;panel.hidden=false;index=0;answers=Array(questions.length).fill(null);renderQ();});
  next.addEventListener('click',()=>{if(answers[index]===null)return;if(index<questions.length-1){index++;renderQ();}else diagnose();});
  back.addEventListener('click',()=>{if(index>0){index--;renderQ();}});
  retake.addEventListener('click',()=>{result.hidden=true;panel.hidden=false;index=0;answers=Array(questions.length).fill(null);renderQ();});
})();