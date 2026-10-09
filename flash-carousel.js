document.querySelectorAll('[data-flash-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.flash-carousel-track');
  const slides = [...track.children];
  const status = carousel.querySelector('[data-carousel-status]');
  let current = 0;
  const update = () => {
    const width = track.clientWidth;
    current = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
    status.textContent = `${current + 1} / ${slides.length}`;
  };
  const move = (direction) => {
    const next = (current + direction + slides.length) % slides.length;
    track.scrollTo({left: next * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  };
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => move(-1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('keydown', (event) => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  new ResizeObserver(() => { track.scrollLeft = current * track.clientWidth; }).observe(track);
});
