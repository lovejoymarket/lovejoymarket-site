(() => {
  const COUNTER_API = 'https://api.counterapi.dev/v1/lovejoymarket-co/homepage-visits';
  const START_LABEL = 'COUNTING SINCE 08.19.26';
  const REFRESH_MS = 15000;

  const getCount = (payload) => {
    const candidates = [
      payload?.value,
      payload?.count,
      payload?.data?.value,
      payload?.data?.count
    ];
    const match = candidates.find((value) => Number.isFinite(Number(value)));
    return match == null ? null : Number(match);
  };

  const formatCount = (value) => String(Math.max(0, Math.trunc(value))).padStart(6, '0');

  const addStyles = () => {
    if (document.getElementById('lovejoy-visitor-counter-styles')) return;
    const style = document.createElement('style');
    style.id = 'lovejoy-visitor-counter-styles';
    style.textContent = `
      .lj-visitor-wrap {
        position: relative;
        z-index: 2;
        width: min(calc(100% - 28px), 1040px);
        margin: 0 auto 18px;
        display: flex;
        justify-content: center;
      }
      .lj-visitor-counter {
        position: relative;
        overflow: hidden;
        min-width: 260px;
        max-width: 100%;
        padding: 10px 14px 9px;
        border: 2px ridge #fff8ec;
        background:
          radial-gradient(circle at 12% 28%, rgba(255,255,255,.95) 0 1px, transparent 2px),
          radial-gradient(circle at 76% 22%, rgba(255,255,255,.8) 0 1px, transparent 2px),
          radial-gradient(circle at 40% 74%, rgba(255,255,255,.72) 0 1px, transparent 2px),
          #ff2d8d;
        background-size: 31px 31px, 43px 43px, 37px 37px, auto;
        color: #fff8ec;
        text-align: center;
        font-family: "Courier New", Courier, monospace;
        box-shadow: 4px 4px 0 rgba(0,0,0,.28), 0 0 15px rgba(255,45,141,.48);
      }
      .lj-visitor-counter::before,
      .lj-visitor-counter::after {
        content: "✦";
        position: absolute;
        color: #fff8ec;
        text-shadow: 0 0 7px #fff8ec;
        animation: ljCounterTwinkle 1.3s steps(2,end) infinite;
      }
      .lj-visitor-counter::before { left: 9px; top: 7px; }
      .lj-visitor-counter::after { right: 9px; bottom: 7px; animation-delay: .45s; }
      .lj-visitor-label {
        display: block;
        margin-bottom: 5px;
        font-size: 10px;
        line-height: 1;
        font-weight: 900;
        letter-spacing: .16em;
        text-shadow: 1px 1px 0 #07182c;
      }
      .lj-visitor-digits {
        display: inline-flex;
        gap: 2px;
        padding: 4px;
        border: 1px solid rgba(255,248,236,.95);
        background: #07182c;
        box-shadow: inset 0 0 0 2px rgba(255,45,141,.26);
      }
      .lj-visitor-digit {
        width: 22px;
        min-width: 22px;
        height: 31px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255,248,236,.62);
        background: linear-gradient(#ff4aa0, #e81777);
        color: #fff;
        font-size: 22px;
        line-height: 1;
        font-weight: 900;
        text-shadow: 1px 1px 0 #07182c, 0 0 4px rgba(255,255,255,.45);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.35);
      }
      .lj-visitor-since {
        display: block;
        margin-top: 5px;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .14em;
        text-shadow: 1px 1px 0 #07182c;
      }
      .lj-visitor-glitter {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .68;
        background: linear-gradient(110deg, transparent 22%, rgba(255,255,255,.85) 28%, transparent 34%);
        transform: translateX(-130%);
        animation: ljCounterShimmer 4.8s ease-in-out infinite;
      }
      @keyframes ljCounterShimmer {
        0%, 72% { transform: translateX(-130%); }
        88%, 100% { transform: translateX(130%); }
      }
      @keyframes ljCounterTwinkle {
        0%,100% { opacity:.25; transform:scale(.75) rotate(0deg); }
        50% { opacity:1; transform:scale(1.2) rotate(18deg); }
      }
      @media (max-width: 520px) {
        .lj-visitor-wrap { width: min(calc(100% - 18px), 1040px); }
        .lj-visitor-counter { min-width: 0; width: 100%; max-width: 310px; }
        .lj-visitor-digit { width: 20px; min-width: 20px; height: 29px; font-size: 20px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .lj-visitor-counter::before,
        .lj-visitor-counter::after,
        .lj-visitor-glitter { animation: none; }
      }
    `;
    document.head.appendChild(style);
  };

  const buildCounter = () => {
    if (document.querySelector('[data-lovejoy-visitor-counter]')) return null;
    const footer = document.querySelector('.site-footer');
    if (!footer) return null;

    const wrap = document.createElement('div');
    wrap.className = 'lj-visitor-wrap';
    wrap.setAttribute('data-lovejoy-visitor-counter', '');
    wrap.innerHTML = `
      <div class="lj-visitor-counter" role="status" aria-live="polite" aria-label="LoveJoy Market visitor counter">
        <span class="lj-visitor-label">✦ YOU ARE VISITOR ✦</span>
        <span class="lj-visitor-digits" data-visitor-digits aria-label="loading visitor count">
          ${'------'.split('').map((digit) => `<span class="lj-visitor-digit">${digit}</span>`).join('')}
        </span>
        <span class="lj-visitor-since">${START_LABEL}</span>
        <span class="lj-visitor-glitter" aria-hidden="true"></span>
      </div>
    `;
    footer.parentNode.insertBefore(wrap, footer);
    return wrap;
  };

  const render = (value) => {
    const holder = document.querySelector('[data-visitor-digits]');
    if (!holder) return;
    const text = formatCount(value);
    holder.innerHTML = [...text].map((digit) => `<span class="lj-visitor-digit">${digit}</span>`).join('');
    holder.setAttribute('aria-label', `visitor number ${value}`);
  };

  const showFallback = () => {
    const holder = document.querySelector('[data-visitor-digits]');
    if (!holder) return;
    holder.innerHTML = [...'??????'].map((digit) => `<span class="lj-visitor-digit">${digit}</span>`).join('');
    holder.setAttribute('aria-label', 'visitor counter temporarily unavailable');
  };

  const requestCount = async (increment = false) => {
    const endpoint = `${COUNTER_API}${increment ? '/up' : ''}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error(`counter request failed: ${response.status}`);
    const payload = await response.json();
    const value = getCount(payload);
    if (value == null) throw new Error('counter response did not include a value');
    return value;
  };

  const start = async () => {
    addStyles();
    if (!buildCounter()) return;

    try {
      render(await requestCount(true));
    } catch (error) {
      console.warn('LoveJoy visitor counter:', error);
      showFallback();
    }

    window.setInterval(async () => {
      if (document.hidden) return;
      try {
        render(await requestCount(false));
      } catch (error) {
        console.warn('LoveJoy visitor counter refresh:', error);
      }
    }, REFRESH_MS);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
