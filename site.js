const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}


// subtle reveal support for the Home page
const revealTargets = document.querySelectorAll('.top-eight-card, .next-copy, .presented-copy, .ig-tile, .spotify-frame-wrap');
if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
}
