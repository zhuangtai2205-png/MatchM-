(() => {
  const start = () => {
    if (document.querySelector('.winter-snow-layer')) return;
    const speckle = document.createElement('div');
    speckle.className = 'winter-paper-speckle';
    speckle.setAttribute('aria-hidden', 'true');
    document.body.appendChild(speckle);

    const snow = document.createElement('div');
    snow.className = 'winter-snow-layer';
    snow.setAttribute('aria-hidden', 'true');
    const symbols = ['❄', '✳', '❅', '✻'];
    for (let i = 0; i < 32; i++) {
      const flake = document.createElement('span');
      flake.className = 'winter-flake';
      flake.textContent = symbols[i % symbols.length];
      flake.style.left = (Math.random() * 100) + '%';
      flake.style.setProperty('--flake-size', (11 + Math.random() * 17) + 'px');
      flake.style.setProperty('--flake-time', (10 + Math.random() * 14) + 's');
      flake.style.setProperty('--flake-delay', (-Math.random() * 24) + 's');
      flake.style.setProperty('--flake-opacity', (.35 + Math.random() * .5).toFixed(2));
      snow.appendChild(flake);
    }
    document.body.appendChild(snow);

    [['❄','one'],['🐟','two'],['✳','three']].forEach(([symbol, cls]) => {
      const doodle = document.createElement('span');
      doodle.className = 'winter-doodle ' + cls;
      doodle.textContent = symbol;
      doodle.setAttribute('aria-hidden', 'true');
      document.body.appendChild(doodle);
    });

    const makeBear = (className) => {
      const img = document.createElement('img');
      img.className = className;
      img.src = '/winter-bear.svg?v=2';
      img.alt = className === 'winter-bear-spot' ? 'Gấu nâu vẽ tay quàng khăn xanh, ôm cá giữa tuyết' : '';
      img.decoding = 'async';
      if (className !== 'winter-bear-spot') img.setAttribute('aria-hidden', 'true');
      return img;
    };
    const heroBear = makeBear('winter-bear-spot');
    const gameBear = makeBear('winter-bear-replacement');
    const sprite = document.getElementById('bear-sprite');
    const container = document.getElementById('bear-container');
    if (container && sprite && !container.querySelector('.winter-bear-replacement')) {
      container.appendChild(gameBear);
    }

    const placeHeroBear = () => {
      const activePage = document.querySelector('.page.active') || document;
      const hero = activePage.querySelector('.hero');
      if (hero && heroBear.parentElement !== hero) hero.appendChild(heroBear);
      else if (!hero && heroBear.parentElement) heroBear.remove();
    };
    placeHeroBear();
    const observer = new MutationObserver(() => placeHeroBear());
    document.querySelectorAll('.page').forEach(page => observer.observe(page, {attributes:true, attributeFilter:['class']}));
    document.querySelectorAll('.navbtn').forEach(btn => btn.addEventListener('click', () => setTimeout(placeHeroBear, 80)));
    window.addEventListener('resize', placeHeroBear, {passive:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();