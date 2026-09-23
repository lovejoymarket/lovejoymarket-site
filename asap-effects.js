
(() => {
  const page = document.querySelector('.asap-page');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const layer = document.createElement('div');
  layer.className = 'asap-fireworks-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const glyphs = ['✦', '✧', '★', '♡'];
  const colors = ['#ff2d8d', '#fff8ec', '#ff8bc1', '#f6d66b'];

  function burst(x, y, amount = 18) {
    const holder = document.createElement('div');
    holder.className = 'asap-burst';
    holder.style.left = `${x}%`;
    holder.style.top = `${y}px`;

    for (let i = 0; i < amount; i += 1) {
      const bit = document.createElement('span');
      const angle = (Math.PI * 2 * i) / amount + (Math.random() * .18);
      const distance = 48 + Math.random() * 82;
      bit.textContent = glyphs[i % glyphs.length];
      bit.style.color = colors[i % colors.length];
      bit.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
      bit.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
      bit.style.setProperty('--burst-rot', `${-90 + Math.random() * 180}deg`);
      bit.style.animationDelay = `${Math.random() * .08}s`;
      holder.appendChild(bit);
    }

    layer.appendChild(holder);
    window.setTimeout(() => holder.remove(), 1500);
  }

  function runAsapFireworks() {
    const width = window.innerWidth;
    const small = width < 600;
    const points = small
      ? [[22, 175], [78, 235], [50, 330]]
      : [[15, 185], [82, 210], [31, 330], [70, 350], [50, 465]];

    points.forEach(([x, y], index) => {
      window.setTimeout(() => burst(x, y, small ? 14 : 20), 130 + index * 180);
    });
  }

  window.setTimeout(runAsapFireworks, 180);

  // If the browser restores the page from cache after following the ASAP link,
  // celebrate again instead of showing a dead first frame.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) runAsapFireworks();
  });
})();
