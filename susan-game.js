
(() => {
  const roots = [...document.querySelectorAll('[data-susan-game]')];
  if (!roots.length) return;

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const toneFiles = [
    'susan-tone-1.wav',
    'susan-tone-2.wav',
    'susan-tone-3.wav',
    'susan-tone-4.wav'
  ];

  roots.forEach((root) => {
    if (root.dataset.susanReady === 'true') return;
    root.dataset.susanReady = 'true';

    const pads = [...root.querySelectorAll('[data-susan-pad]')];
    const segments = [...root.querySelectorAll('[data-susan-segment]')];
    const bulbs = [...root.querySelectorAll('[data-susan-bulb]')];
    const start = root.querySelector('[data-susan-start]');
    const roundEl = root.querySelector('[data-susan-round]');
    const bestEl = root.querySelector('[data-susan-best]');
    const streakEl = root.querySelector('[data-susan-streak]');
    const status = root.querySelector('[data-susan-status]');

    if (
      pads.length !== 4 ||
      segments.length !== 4 ||
      bulbs.length !== 4 ||
      !start || !roundEl || !bestEl || !streakEl || !status
    ) return;

    const highKey = 'lovejoySusanBest';
    const tones = toneFiles.map((src) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.72;
      return audio;
    });

    let sequence = [];
    let inputIndex = 0;
    let accepting = false;
    let running = false;
    let streak = 0;
    let soundUnlocked = false;
    let fallbackAudio = null;

    function getBest() {
      try { return Number(localStorage.getItem(highKey) || 0) || 0; }
      catch (error) { return 0; }
    }

    function setBest(value) {
      try { localStorage.setItem(highKey, String(value)); }
      catch (error) {}
    }

    function updateHud() {
      roundEl.textContent = String(sequence.length).padStart(2,'0');
      bestEl.textContent = String(getBest()).padStart(2,'0');
      streakEl.textContent = String(streak).padStart(2,'0');
    }

    function fallbackContext() {
      if (fallbackAudio) return fallbackAudio;
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      try { fallbackAudio = new Context(); }
      catch (error) { fallbackAudio = null; }
      return fallbackAudio;
    }

    function unlockSound() {
      if (soundUnlocked) return;
      soundUnlocked = true;

      /*
       * Prime every audio element synchronously inside the START tap.
       * This matters on iPhone: awaiting the first play can consume the
       * user-activation window before the remaining tones are unlocked.
       */
      tones.forEach((audio) => {
        try {
          audio.volume = 0;
          const result = audio.play();
          if (result && typeof result.then === 'function') {
            result.then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.volume = 0.72;
            }).catch(() => {
              audio.volume = 0.72;
            });
          } else {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0.72;
          }
        } catch (error) {
          audio.volume = 0.72;
        }
      });

      const ctx = fallbackContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    }

    function fallbackTone(index) {
      const ctx = fallbackContext();
      if (!ctx || ctx.state !== 'running') return;

      const freqs = [329.63,440,554.37,659.25];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freqs[index];
      gain.gain.setValueAtTime(.0001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.13,ctx.currentTime+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.23);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime+.25);
    }

    function playTone(index) {
      const audio = tones[index];
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.72;
        const result = audio.play();
        if (result && typeof result.catch === 'function') {
          result.catch(() => fallbackTone(index));
        }
      } catch (error) {
        fallbackTone(index);
      }
    }

    function setPadsDisabled(disabled) {
      pads.forEach((pad) => { pad.disabled = disabled; });
    }

    async function light(index, duration = 360) {
      segments[index].classList.add('is-lit');
      bulbs[index].classList.add('is-lit');
      playTone(index);

      await sleep(duration);

      segments[index].classList.remove('is-lit');
      bulbs[index].classList.remove('is-lit');
      await sleep(100);
    }

    async function playSequence() {
      accepting = false;
      setPadsDisabled(true);
      status.textContent = 'Susan says…';
      await sleep(320);

      for (const index of sequence) {
        await light(index, 365);
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
      /* This happens directly inside a click, which matters on iPhone. */
      unlockSound();

      sequence = [];
      inputIndex = 0;
      streak = 0;
      accepting = false;
      running = true;
      start.querySelector('span').textContent = 'RESTART';
      status.textContent = 'Susan is thinking…';
      setPadsDisabled(true);
      updateHud();

      window.setTimeout(nextRound, 360);
    }

    function fail(index) {
      accepting = false;
      running = false;
      setPadsDisabled(true);

      segments[index].classList.add('is-lit');
      bulbs[index].classList.add('is-lit');
      playTone(index);

      window.setTimeout(() => {
        segments[index].classList.remove('is-lit');
        bulbs[index].classList.remove('is-lit');
      }, 330);

      const completed = Math.max(0,sequence.length - 1);
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
      await light(index,185);

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
        window.setTimeout(nextRound,650);
      } else {
        accepting = true;
      }
    }

    pads.forEach((pad,index) => {
      pad.addEventListener('click',() => handlePad(index));
    });

    start.addEventListener('click',begin);

    setPadsDisabled(true);
    updateHud();
  });
})();
