(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const themeMotifs = {
    ocean:{background:["wave","wave","bubble","fish","wave","coral","wave"],click:["mermaid","fish","bubble","dolphin"],nav:[]},
    retro:{background:["♪","♫","♬","𝄞","♩"],click:["♪","♫","♬","♩","𝄞"],nav:[]},
    pink:{background:["petal","petal","flower","petal","sakura"],click:["🌸","🌺","🌷","❀"],nav:[]},
    vampire:{background:["web","bat","moon","web","candle"],click:["🦇","🕸","✦","🕯"],nav:[]},
    cat:{background:["cat","yarn","paw","yarn","cat"],click:["🐈","🧶","🐾","🧵"],nav:[]},
    forest:{background:[],click:["bear"],nav:[]},
    minimal:{background:[],click:[],nav:[]}
  };
  const forestArt = {
    bear:'<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#62472f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="17" r="9" fill="#b77a45"/><circle cx="47" cy="17" r="9" fill="#b77a45"/><path d="M10 29Q10 11 32 11T54 29L51 45Q45 57 32 57T13 45Z" fill="#c98b52"/><ellipse cx="23" cy="31" rx="3" ry="4" fill="#30271f"/><ellipse cx="41" cy="31" rx="3" ry="4" fill="#30271f"/><ellipse cx="32" cy="41" rx="10" ry="7" fill="#f4d8aa"/><path d="M29 39q3-4 6 0l-3 3z" fill="#62472f"/><path d="M32 43v3m0 0q-4 4-7 0m7 0q4 4 7 0" fill="none"/></g></svg>',
    pine:'<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#426344" stroke-width="2.6" stroke-linejoin="round"><path d="M32 5 15 28h9L10 43h15L19 55h26l-6-12h15L40 28h9Z" fill="#7fa36c"/><path d="M29 55h6v6h-6z" fill="#9b7046"/></g></svg>',
    honey:'<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#9a6925" stroke-width="2.6" stroke-linejoin="round"><path d="M20 12h24l5 9-2 29q-15 9-30 0l-2-29z" fill="#f6c65b"/><path d="M20 24q12 8 26 0M19 36q13 8 28 0" fill="none"/><path d="M24 10V6h16v4" fill="none"/></g></svg>',
    bee:'<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#634b2c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="19" rx="10" ry="7" fill="#fffaf0" transform="rotate(-25 24 19)"/><ellipse cx="40" cy="19" rx="10" ry="7" fill="#fffaf0" transform="rotate(25 40 19)"/><ellipse cx="32" cy="37" rx="15" ry="12" fill="#f4c64e"/><path d="M25 27 28 47M36 26 39 47" stroke-width="5"/><circle cx="27" cy="35" r="1.5" fill="#30271f"/><circle cx="37" cy="35" r="1.5" fill="#30271f"/><path d="M29 41q3 3 6 0M32 24V19" fill="none"/></g></svg>'
  };
  const theme = () => document.body.dataset.theme || 'ocean';
  function renderScenery(){
    const root=$('#themeScene'); if(!root)return;
    const t=theme(),cfg=themeMotifs[t]||themeMotifs.ocean; root.replaceChildren(); if(t==="minimal")return;
    cfg.background.forEach((kind,i)=>{
      const el=document.createElement('span'); el.className='scene-doodle scene-'+kind;
      el.setAttribute('aria-hidden','true');
      const glyph={wave:'〰',bubble:'○',fish:'🐟',coral:'🪸',mermaid:'🧜‍♀️',petal:'🌸',flower:'✿',sakura:'🌸',web:'🕸',bat:'🦇',moon:'☾',candle:'🕯',cat:'🐈',yarn:'🧶',paw:'🐾',pine:'🌲',bear:'🐻',honey:'🍯',bee:'🐝',snow:'❄'}[kind]||kind;
      if(t==='forest' && forestArt[kind]) el.innerHTML=forestArt[kind]; else el.textContent=glyph; el.style.left=(4+(i*19)%91)+'%'; el.style.top=(8+(i*23)%78)+'%';
      el.style.setProperty('--doodle-delay',(-i*1.7)+'s'); el.style.setProperty('--doodle-size',(18+(i%3)*10)+'px');
      root.appendChild(el);
    });
  }
  function showClick(e){
    if(e.button!==0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cfg=themeMotifs[theme()]||themeMotifs.ocean;
    if(theme()==="minimal")return;
    for(let i=0;i<3;i++){
      const el=document.createElement('span');el.className='theme-click-doodle'+(theme()==='forest'?' forest-click-art':'');
      const motif=cfg.click[Math.floor(Math.random()*cfg.click.length)];
      if(theme()==='forest' && forestArt[motif]) el.innerHTML=forestArt[motif]; else el.textContent=motif;
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