(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const themeMotifs = {
    ocean:{background:["〰","〰","🫧","🐠","🐚","🪸","🐟"],click:["🧜‍♀️","🐠","🐬","🫧","🐚","🐟"],nav:["🐠","🐚","🪸","🐬","🫧"]},
    retro:{background:["♪","♫","♬","𝄞","♩"],click:["♪","♫","♬","♩","𝄞"],nav:["♫","♪","♬","𝄞","♩"]},
    pink:{background:["✿","🌸","❀","🌷","🌺"],click:["🌸","🌺","🌷","🌼","🌹","❀"],nav:["🌸","🌷","🌼","🌺","✿"]},
    vampire:{background:["☾","🦇","✦","🕸","🕯️"],click:["🦇","🎃","🕷️","🕸️","🕯️","☠️"],nav:["🦇","🕸️","🕯️","🎃","☾"]},
    cat:{background:["🐾","🐈","🐟","✦","🧶"],click:["🐈","🐈‍⬛","🐟","🦴","🐾","🧶"],nav:["🐈","🐟","🧶","🦴","🐾"]}
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
    document.querySelectorAll('.navbtn .theme-nav-doodle').forEach(el=>el.remove());
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
    document.querySelectorAll(".winter-bear-spot,#fat-bear-overlay,#funWidget,#funToggleBtn").forEach(el=>el.remove());
    document.querySelectorAll(".navbtn .theme-nav-doodle").forEach(el=>el.remove());
    document.querySelectorAll(".navbtn").forEach(btn=>{
      btn.querySelectorAll(".navicon,.icon3d,.bear-icon,.theme-nav-doodle").forEach(el=>el.remove());
      btn.querySelectorAll("img").forEach(img=>{if(/bear|gấu/i.test((img.alt||"")+" "+(img.src||"")))img.remove();});
    });
    const existing=$("#bear-container"); if(existing) existing.remove();
    const hero=$(".hero");
    if(theme()!=="bear" || !hero) return;
    hero.style.position="relative";
    const bear=document.createElement("button");
    bear.id="bear-container";bear.type="button";bear.setAttribute("aria-label","Gấu rừng — nhấn để cho gấu ăn cá");
    bear.innerHTML=`
      <svg id="bear-sprite" viewBox="0 0 240 220" role="img" aria-label="Gấu nâu dễ thương đang ngồi" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="120" cy="201" rx="76" ry="9" fill="#6b8c65" opacity=".18"/>
        <path d="M57 180Q42 162 48 132Q51 105 75 93L80 63Q83 43 102 42Q118 40 126 54Q143 36 160 48Q178 58 173 82Q196 102 193 139L187 177Q184 193 164 194H82Q62 193 57 180Z" fill="#a96f43" stroke="#70472f" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="83" cy="53" r="22" fill="#a96f43" stroke="#70472f" stroke-width="4"/><circle cx="83" cy="53" r="10" fill="#e8b99a"/>
        <circle cx="158" cy="51" r="22" fill="#a96f43" stroke="#70472f" stroke-width="4"/><circle cx="158" cy="51" r="10" fill="#e8b99a"/>
        <path d="M77 98Q79 67 118 67Q161 67 169 100L164 139Q159 164 122 166Q84 163 77 139Z" fill="#c98c5c" stroke="#70472f" stroke-width="3"/>
        <ellipse cx="121" cy="126" rx="33" ry="26" fill="#f0d0a8"/>
        <ellipse cx="107" cy="111" rx="5" ry="7" fill="#30241e"/><ellipse cx="137" cy="111" rx="5" ry="7" fill="#30241e"/>
        <ellipse cx="122" cy="125" rx="9" ry="6" fill="#30241e"/><path d="M122 131Q118 140 109 136M122 131Q127 140 135 136" fill="none" stroke="#70472f" stroke-width="3" stroke-linecap="round"/>
        <path d="M67 153Q43 159 51 179Q62 193 86 182L94 169M158 170L176 184Q194 191 197 174Q198 158 180 151" fill="#a96f43" stroke="#70472f" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="91" cy="188" rx="24" ry="13" fill="#d5a16e" stroke="#70472f" stroke-width="3"/><ellipse cx="151" cy="188" rx="24" ry="13" fill="#d5a16e" stroke="#70472f" stroke-width="3"/>
        <path d="M111 151Q121 145 132 151L127 160Q120 165 114 159Z" fill="#d98f9d"/>
      </svg>`;
    hero.appendChild(bear);
    bear.addEventListener("click",()=>{
      bear.classList.add("is-munching");
      const fish=document.createElement("span");fish.className="bear-plus-one";fish.textContent="🐟 nhăm nhăm!";
      fish.style.left=(bear.getBoundingClientRect().left+60)+"px";fish.style.top=(bear.getBoundingClientRect().top+10)+"px";
      document.body.appendChild(fish);setTimeout(()=>fish.remove(),1000);
      setTimeout(()=>bear.classList.remove("is-munching"),450);
    });
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