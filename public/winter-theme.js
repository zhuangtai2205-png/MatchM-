(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const themeMotifs = {
    bear: {background:['❄','✳','🐟','🍃','🐾'], click:['🐟','❄','🐾','✨','🐻'], nav:['🐻','🐟','🌲','🍯','❄']},
    ocean:{background:['〰','🫧','🐠','🐚','〰','🪸'],click:['🧜‍♀️','🐠','🐬','🫧','🐚','🐟'],nav:['🐠','🐚','🪸','🐬','🫧']},
    retro:{background:['♪','♫','♬','𝄞','♩'],click:['♪','♫','♬','♩','𝄞'],nav:['♫','♪','♬','𝄞','♩']},
    pink:{background:['✿','🌸','❀','🌷','🌺'],click:['🌸','🌺','🌷','🌼','🌹','❀'],nav:['🌸','🌷','🌼','🌺','✿']},
    vampire:{background:['☾','🦇','✦','🕸','🕯️'],click:['🦇','🎃','🕷️','🕸️','🕯️','☠️'],nav:['🦇','🕸️','🕯️','🎃','☾']},
    cat:{background:['🐾','🐈','🐟','✦','🧶'],click:['🐈','🐈‍⬛','🐟','🦴','🐾','🧶'],nav:['🐈','🐟','🧶','🦴','🐾']}
  };
  const theme = () => document.body.dataset.theme || 'ocean';
  function renderScenery(){
    const root=$('#themeScene');
    if(!root) return;
    const t=theme(), cfg=themeMotifs[t]||themeMotifs.ocean;
    root.replaceChildren();
    cfg.background.forEach((symbol,i)=>{
      const el=document.createElement('span');
      el.className='scene-doodle '+(t==='ocean'&&symbol==='〰'?'scene-wave':'');
      el.textContent=symbol;
      el.style.left=(4+(i*19)%91)+'%';
      el.style.top=(9+(i*23)%77)+'%';
      el.style.setProperty('--doodle-delay',(-i*1.7)+'s');
      el.style.setProperty('--doodle-size',(18+(i%3)*10)+'px');
      root.appendChild(el);
    });
    document.querySelectorAll('.navbtn').forEach((btn,i)=>{
      let badge=btn.querySelector('.theme-nav-doodle');
      if(!badge){badge=document.createElement('span');badge.className='theme-nav-doodle';badge.setAttribute('aria-hidden','true');btn.prepend(badge)}
      badge.textContent=cfg.nav[i%cfg.nav.length];
    });
  }
  function showClick(e){
    if(e.button!==0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cfg=themeMotifs[theme()]||themeMotifs.ocean;
    for(let i=0;i<3;i++){
      const el=document.createElement('span');el.className='theme-click-doodle';
      el.textContent=cfg.click[Math.floor(Math.random()*cfg.click.length)];
      el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';
      el.style.setProperty('--tx',(Math.random()*90-45)+'px');
      el.style.setProperty('--ty',(-24-Math.random()*70)+'px');
      el.style.setProperty('--rot',(Math.random()*70-35)+'deg');
      document.body.appendChild(el);
      el.addEventListener('animationend',()=>el.remove(),{once:true});
      window.setTimeout(()=>el.remove(),1200);
    }
  }
  function initBear(){
    const container=$('#bear-container');
    if(container) {
      const sprite=$('#bear-sprite',container);
      if(sprite) sprite.style.display='none';
    }
    let mascot=$('.winter-bear-spot');
    if(!mascot){
      mascot=document.createElement('img');
      mascot.className='winter-bear-spot';
      mascot.src='/winter-bear.svg?v=5';
      mascot.alt='Gấu con hoạt hình đang ôm cá';
      mascot.decoding='async';
    }
    function placeMascot(){
      const isBear=theme()==='bear';
      const page=$('.page.active');
      const hero=page && $('.hero',page);
      if(!isBear || !hero){mascot.remove();return}
      if(mascot.parentElement!==hero) hero.appendChild(mascot);
    }
    placeMascot();
    const observer=new MutationObserver(placeMascot);
    observer.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
    document.querySelectorAll('.page').forEach(page=>observer.observe(page,{attributes:true,attributeFilter:['class']}));
    document.querySelectorAll('.navbtn').forEach(btn=>btn.addEventListener('click',()=>window.setTimeout(placeMascot,100)));
  }
  function start(){
    renderScenery();
    initBear();
    document.addEventListener('pointerdown',showClick,{passive:true});
    const observer=new MutationObserver(()=>renderScenery());
    observer.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
    const picker=$('#themeSelect');
    if(picker) picker.addEventListener('change',()=>window.setTimeout(renderScenery,0));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();