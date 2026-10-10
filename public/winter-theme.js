(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const themeMotifs = {
    ocean:{background:["wave","wave","bubble","fish","wave","coral","wave"],click:["mermaid","fish","bubble","dolphin"],nav:[]},
    retro:{background:["♪","♫","♬","𝄞","♩"],click:["♪","♫","♬","♩","𝄞"],nav:[]},
    pink:{background:["petal","petal","flower","petal","sakura"],click:["🌸","🌺","🌷","❀"],nav:[]},
    vampire:{background:["web","bat","moon","web","candle"],click:["🦇","🕸","✦","🕯"],nav:[]},
    cat:{background:["cat","yarn","paw","yarn","cat"],click:["🐈","🧶","🐾","🧵"],nav:[]},
    forest:{background:["bear","pine","honey","pine","bear","honey"],click:["🐻","🌲","🍯","🐝"],nav:[]},
    minimal:{background:[],click:[],nav:[]}
  };
  const theme = () => document.body.dataset.theme || 'ocean';
  function renderScenery(){
    const root=$('#themeScene'); if(!root)return;
    const t=theme(),cfg=themeMotifs[t]||themeMotifs.ocean; root.replaceChildren(); if(t==="minimal")return;
    cfg.background.forEach((kind,i)=>{
      const el=document.createElement('span'); el.className='scene-doodle scene-'+kind;
      el.setAttribute('aria-hidden','true');
      const glyph={wave:'〰',bubble:'○',fish:'🐟',coral:'🪸',mermaid:'🧜‍♀️',petal:'🌸',flower:'✿',sakura:'🌸',web:'🕸',bat:'🦇',moon:'☾',candle:'🕯',cat:'🐈',yarn:'🧶',paw:'🐾',pine:'♠',snow:'❄'}[kind]||kind;
      el.textContent=glyph; el.style.left=(4+(i*19)%91)+'%'; el.style.top=(8+(i*23)%78)+'%';
      el.style.setProperty('--doodle-delay',(-i*1.7)+'s'); el.style.setProperty('--doodle-size',(18+(i%3)*10)+'px');
      root.appendChild(el);
    });
  }
  function showClick(e){
    if(e.button!==0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cfg=themeMotifs[theme()]||themeMotifs.ocean;
    if(theme()==="minimal")return;
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
  function start(){
    renderScenery();
    document.addEventListener('pointerdown',showClick,{passive:true});
    const observer=new MutationObserver(()=>renderScenery());
    observer.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
    const picker=$('#themeSelect');
    if(picker) picker.addEventListener('change',()=>window.setTimeout(renderScenery,0));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();