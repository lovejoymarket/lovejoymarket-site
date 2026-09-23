
(() => {
  const roots = [...document.querySelectorAll('[data-susan-game]')];
  if (!roots.length) return;

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  roots.forEach((root, rootIndex) => {
    if (root.dataset.susanReady === 'true') return;
    root.dataset.susanReady = 'true';

    const pads = [...root.querySelectorAll('[data-susan-pad]')];
    const start = root.querySelector('[data-susan-start]');
    const roundEl = root.querySelector('[data-susan-round]');
    const bestEl = root.querySelector('[data-susan-best]');
    const streakEl = root.querySelector('[data-susan-streak]');
    const status = root.querySelector('[data-susan-status]');

    if (pads.length !== 4 || !start) return;

    const highKey = `lovejoySusanBest${rootIndex ? '-' + rootIndex : ''}`;
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
      const round = sequence.length;
      roundEl.textContent = String(round).padStart(2, '0');
      bestEl.textContent = String(Math.max(round, getBest())).padStart(2, '0');
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
      const freqs = [330, 440, 554, 659];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freqs[index];
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.12, ctx.currentTime + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000 + .02);
    }

    async function light(index, duration = 330) {
      const pad = pads[index];
      pad.classList.add('is-lit');
      tone(index, Math.min(duration, 220));
      await sleep(duration);
      pad.classList.remove('is-lit');
      await sleep(90);
    }

    function setPadsDisabled(disabled) {
      pads.forEach((pad) => {
        pad.disabled = disabled;
      });
    }

    async function playSequence() {
      accepting = false;
      setPadsDisabled(true);
      status.textContent = 'Susan says…';
      await sleep(280);

      for (const index of sequence) {
        await light(index, 310);
      }

      inputIndex = 0;
      accepting = true;
      setPadsDisabled(false);
      status.textContent = 'your turn ♡';
    }

    function nextRound() {
      sequence.push(Math.floor(Math.random() * 4));
      updateHud();
      playSequence();
    }

    function begin() {
      ensureAudio();
      sequence = [];
      inputIndex = 0;
      accepting = false;
      running = true;
      streak = 0;
      start.textContent = 'RESTART';
      status.textContent = 'Susan is thinking…';
      updateHud();
      window.setTimeout(nextRound, 350);
    }

    function fail(index) {
      accepting = false;
      running = false;
      setPadsDisabled(true);
      pads[index].classList.add('is-lit');
      window.setTimeout(() => pads[index].classList.remove('is-lit'), 280);

      const completed = Math.max(0, sequence.length - 1);
      if (completed > getBest()) setBest(completed);
      updateHud();

      status.textContent = completed
        ? `Susan said no. You made it through ${completed}. ♡`
        : 'Susan said no immediately. Incredible. ♡';
      start.textContent = 'AGAIN';
    }

    async function handlePad(index) {
      if (!running || !accepting) return;

      accepting = false;
      await light(index, 165);

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
        status.textContent = 'correct. unfortunately Susan noticed. ✦';
        window.setTimeout(nextRound, 620);
      } else {
        accepting = true;
      }
    }

    pads.forEach((pad, index) => {
      pad.addEventListener('click', () => handlePad(index));
    });

    start.addEventListener('click', begin);

    setPadsDisabled(true);
    updateHud();
    status.textContent = 'press the heart. Susan will handle the rest.';
  });
})();
