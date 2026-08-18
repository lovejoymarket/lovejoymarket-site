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
