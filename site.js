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
