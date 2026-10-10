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

/* Per-theme background motifs and hand-drawn-feeling click feedback. */
(() => {
 const motifs={
  bear:{bg:['❄','✳','🐟','❅'],click:['🐟','❄','🐾','✨','🐻']},
  ocean:{bg:['〰','🐠','🫧','🐚','〰'],click:['🧜‍♀️','🐠','🐬','🫧','🐚','🐟']},
  retro:{bg:['♪','♫','♬','𝄞'],click:['♪','♫','♬','♩','𝄞']},
  pink:{bg:['✿','🌸','❀','🌷'],click:['🌸','🌺','🌷','🌼','🌹','❀']},
  vampire:{bg:['☾','🦇','✦','🕸'],click:['🦇','🎃','🕷️','🕸️','🕯️','☠️']},
  cat:{bg:['🐾','🐈','🐟','✦'],click:['🐈','🐈‍⬛','🐟','🦴','🐾','🧶']}
 };
 let scene;
 function currentTheme(){return document.body.dataset.theme||'bear'}
 function paintScene(){
  const theme=currentTheme(),config=motifs[theme]||motifs.bear;
  if(!scene){scene=document.createElement('div');scene.className='theme-scenery';scene.setAttribute('aria-hidden','true');document.body.appendChild(scene)}
  scene.replaceChildren();
  config.bg.forEach((symbol,i)=>{
   const el=document.createElement('span');el.textContent=symbol;
   el.style.left=(5+(i*23)%88)+'%';el.style.top=(12+(i*19)%72)+'%';
   el.style.fontSize=(20+(i%3)*13)+'px';el.style.animationDelay=(-i*1.8)+'s';
   if(theme==='ocean'&&symbol==='〰')el.className='scenery-wave';
   scene.appendChild(el);
  });
 }
 paintScene();
 new MutationObserver(paintScene).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
 document.addEventListener('pointerdown',e=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const config=motifs[currentTheme()]||motifs.bear;
  for(let i=0;i<2;i++){
   const el=document.createElement('span');el.className='theme-click-doodle';
   el.textContent=config.click[Math.floor(Math.random()*config.click.length)];
   el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';
   el.style.setProperty('--tx',(Math.random()*90-45)+'px');
   el.style.setProperty('--ty',(-28-Math.random()*58)+'px');
   el.style.setProperty('--rot',(Math.random()*70-35)+'deg');
   document.body.appendChild(el);el.addEventListener('animationend',()=>el.remove(),{once:true});
   setTimeout(()=>el.remove(),1100);
  }
 },{passive:true});
})();
