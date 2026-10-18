(() => {
  'use strict';
  const banner = document.querySelector('[data-fall-banner]');
  function syncBanner() {
    if (!banner) return;
    const booking = globalThis.LoveJoyBooking;
    banner.hidden = booking
      ? !booking.getState().slots.length
      : Date.now() >= Date.parse('2026-10-26T00:00:00-04:00');
  }
  syncBanner();
  window.setInterval(syncBanner, 30000);
  window.addEventListener('focus', syncBanner);

  const canvas = document.querySelector('[data-home-glitter]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const colors = ['#ff2d8d', '#fff8ec', '#ffffff', '#ff8ec2'];
  let particles = [];
  let waves = [];
  let frame = 0;
  let started = 0;
  let previous = 0;
  let width = 0;
  let height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function stop() {
    window.cancelAnimationFrame(frame);
    frame = 0;
    particles = [];
    waves = [];
    context.clearRect(0, 0, width, height);
    canvas.hidden = true;
  }
  function burst(wave) {
    const spread = Math.max(width, height) * .95;
    for (let i = 0; i < wave.count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = spread * (.3 + Math.random() * .8);
      const large = i % 5 === 0;
      particles.push({
        x: width * wave.x, y: height * wave.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - height * .16,
        age: 0, life: 2.5 + Math.random() * 1.7,
        size: large ? 9 + Math.random() * 15 : 1.5 + Math.random() * 4.5,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - .5) * 3,
        shape: large ? 'star' : i % 3 === 0 ? 'diamond' : 'dot',
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  function draw(particle) {
    const progress = particle.age / particle.life;
    const alpha = Math.min(1, (1 - progress) * 2) * (.78 + .22 * Math.sin(particle.age * 4 + particle.phase));
    context.globalAlpha = alpha;
    context.fillStyle = particle.color;
    context.save();
    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);
    const size = particle.size * (1 - progress * .3);
    context.beginPath();
    if (particle.shape === 'star') {
      for (let point = 0; point < 8; point += 1) {
        const angle = point * Math.PI / 4;
        const radius = point % 2 ? size * .24 : size;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    } else if (particle.shape === 'diamond') {
      context.rect(-size / 2, -size / 2, size, size);
    } else {
      context.arc(0, 0, size / 2, 0, Math.PI * 2);
    }
    context.fill();
    context.restore();
  }
  function animate(now) {
    if (!started) { started = now; previous = now; }
    const elapsed = (now - started) / 1000;
    const delta = Math.min((now - previous) / 1000, .04);
    previous = now;
    context.clearRect(0, 0, width, height);
    while (waves.length && elapsed >= waves[0].at) burst(waves.shift());
    particles = particles.filter(particle => particle.age < particle.life);
    const drag = Math.exp(-1.1 * delta);
    particles.forEach(particle => {
      particle.age += delta;
      particle.vx *= drag;
      particle.vy = particle.vy * drag + 170 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.rotation += particle.spin * delta;
      draw(particle);
    });
    if (elapsed > 5 || (!particles.length && !waves.length)) { stop(); return; }
    frame = window.requestAnimationFrame(animate);
  }
  function explode() {
    stop();
    if (motion.matches || document.hidden) return;
    resize();
    canvas.hidden = false;
    started = 0;
    previous = 0;
    const count = width < 700 ? 180 : 280;
    waves = [
      { at: 0, x: .5, y: .44, count },
      { at: .22, x: .14, y: .64, count },
      { at: .44, x: .86, y: .64, count }
    ];
    frame = window.requestAnimationFrame(animate);
  }
  document.querySelectorAll('[data-glitter-replay]').forEach(button => button.addEventListener('click', explode));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  motion.addEventListener('change', () => { if (motion.matches) stop(); });
  window.addEventListener('resize', () => { if (frame) resize(); });
  explode();
})();
