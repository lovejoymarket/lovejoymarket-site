
(() => {
  const roots = [...document.querySelectorAll('[data-susan-game]')];
  if (!roots.length) return;

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  roots.forEach((root) => {
    if (root.dataset.susanReady === 'true') return;
    root.dataset.susanReady = 'true';

    const pads = [...root.querySelectorAll('[data-susan-pad]')];
    const start = root.querySelector('[data-susan-start]');
    const roundEl = root.querySelector('[data-susan-round]');
    const bestEl = root.querySelector('[data-susan-best]');
    const streakEl = root.querySelector('[data-susan-streak]');
    const status = root.querySelector('[data-susan-status]');

    if (pads.length !== 4 || !start || !roundEl || !bestEl || !streakEl || !status) return;

    /* Shared between Starcade and ASAP because they live on separate pages. */
    const highKey = 'lovejoySusanBest';

    let sequence = [];
    let inputIndex = 0;
    let accepting = false;
    let running = false;
    let streak = 0;
    let audio = null;

    function getBest() {
      try {
        return Number(localStorage.getItem(highKey) || 0) || 0;
      } catch (error) {
        return 0;
      }
    }

    function setBest(value) {
      try {
        localStorage.setItem(highKey, String(value));
      } catch (error) {}
    }

    function updateHud() {
      const completed = Math.max(0, sequence.length - (running ? 1 : 0));
      roundEl.textContent = String(sequence.length).padStart(2, '0');
      bestEl.textContent = String(Math.max(completed, getBest())).padStart(2, '0');
      streakEl.textContent = String(streak).padStart(2, '0');
    }

    function ensureAudio() {
      if (audio) return audio;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;

      try {
        audio = new AudioContext();
      } catch (error) {
        audio = null;
      }
      return audio;
    }

    function tone(index, duration = 180) {
      const ctx = ensureAudio();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const frequencies = [329.63, 440, 523.25, 659.25];
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequencies[index];
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.12, ctx.currentTime + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration / 1000);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration / 1000 + .03);
    }

    function setPadsDisabled(disabled) {
      pads.forEach((pad) => {
        pad.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        pad.setAttribute('tabindex', disabled ? '-1' : '0');
      });
    }

    async function light(index, duration = 325) {
      const pad = pads[index];
      pad.classList.add('is-lit');
      tone(index, Math.min(duration, 225));
      await sleep(duration);
      pad.classList.remove('is-lit');
      await sleep(95);
    }

    async function playSequence() {
      accepting = false;
      setPadsDisabled(true);
      status.textContent = 'Susan says…';
      await sleep(300);

      for (const index of sequence) {
        await light(index, 325);
      }

      inputIndex = 0;
      accepting = true;
      setPadsDisabled(false);
      status.textContent = 'your turn ♡';
    }

    function nextRound() {
      if (!running) return;
      sequence.push(Math.floor(Math.random() * 4));
      updateHud();
      playSequence();
    }

    function begin() {
      ensureAudio();
      sequence = [];
      inputIndex = 0;
      streak = 0;
      accepting = false;
      running = true;
      start.querySelector('span').textContent = 'RESTART';
      status.textContent = 'Susan is thinking…';
      updateHud();
      setPadsDisabled(true);
      window.setTimeout(nextRound, 360);
    }

    function fail(index) {
      accepting = false;
      running = false;
      setPadsDisabled(true);

      pads[index].classList.add('is-lit');
      window.setTimeout(() => pads[index].classList.remove('is-lit'), 310);

      const completed = Math.max(0, sequence.length - 1);
      if (completed > getBest()) setBest(completed);

      updateHud();
      status.textContent = completed
        ? `Susan said no. You made it through ${completed}. ♡`
        : 'Susan said no immediately. Incredible. ♡';

      start.querySelector('span').textContent = 'AGAIN';
    }

    async function handlePad(index) {
      if (!running || !accepting) return;

      accepting = false;
      await light(index, 175);

      if (index !== sequence[inputIndex]) {
        fail(index);
        return;
      }

      inputIndex += 1;

      if (inputIndex === sequence.length) {
        streak += 1;
        const completed = sequence.length;
        if (completed > getBest()) setBest(completed);
        updateHud();
        status.textContent = 'correct. Susan noticed. ✦';
        window.setTimeout(nextRound, 650);
      } else {
        accepting = true;
      }
    }

    pads.forEach((pad, index) => {
      pad.addEventListener('click', () => handlePad(index));
      pad.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        handlePad(index);
      });
    });

    start.addEventListener('click', begin);

    setPadsDisabled(true);
    updateHud();
    status.textContent = 'press the heart. Susan will handle the rest.';
  });
})();
