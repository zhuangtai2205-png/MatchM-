/* MatchMã — optional ocean mini-game, simple bear, hibernation + snow */
(function(){
  'use strict';
  if(document.getElementById('matchma-fbw-toggle')) return;
  const toggle=document.createElement('button');
  toggle.id='matchma-fbw-toggle'; toggle.type='button'; toggle.textContent='🐻 Chơi cùng gấu';
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-controls','matchma-fat-bear-week');
  document.body.appendChild(toggle);

  const root=document.createElement('aside'); root.id='matchma-fat-bear-week';
  root.setAttribute('aria-label','Trò chơi gấu và sinh vật biển');
  root.hidden=true;
  root.innerHTML=`
    <div class="fbw-scene">
      <div class="fbw-speech" aria-live="polite">Nhấp cá để cho gấu ăn!</div>
      <div class="fbw-ground"></div>
      <button class="fbw-bear" type="button" aria-label="Gấu nhỏ">
        <svg viewBox="0 0 100 100" role="img" aria-label="Gấu nâu vẽ tay">
          <g stroke="#65432f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 29Q13 9 29 13Q38 15 38 26M62 26Q63 15 73 13Q88 10 78 30" fill="#bd8758"/>
            <path d="M20 40Q19 25 36 25Q51 19 65 26Q82 30 81 47L78 69Q75 86 51 88Q26 88 22 70Z" fill="#c28a5a"/>
            <path d="M32 62Q23 66 27 79Q31 91 45 88M67 62Q77 67 73 80Q69 90 56 88" fill="#c28a5a"/>
            <path d="M35 55Q34 65 50 66Q66 65 65 55Q64 47 50 48Q36 47 35 55Z" fill="#f6dfbf" stroke-width="2.5"/>
            <path d="M37 42Q38 39 41 42M59 42Q62 39 63 42" fill="none"/>
            <path d="M46 53Q50 49 54 53Q54 57 50 57Q46 57 46 53Z" fill="#65432f" stroke-width="2"/>
            <path class="fbw-mouth-closed" d="M50 57v3m0 0q-4 4-7 0m7 0q4 4 7 0" fill="none" stroke-width="2"/>
            <ellipse class="fbw-mouth-open" cx="50" cy="61" rx="4" ry="5" fill="#874e45" stroke-width="1.5"/>
            <path d="M34 79Q40 74 50 77Q60 74 66 79" fill="none" stroke="#98653f" stroke-width="2"/>
          </g>
        </svg>      </button>
      <div class="fbw-hearts" aria-hidden="true">♥ ✦ ♥</div>
      <div class="fbw-snow" aria-hidden="true"></div>
    </div>
    <div class="fbw-progress"><span></span></div>
    <div class="fbw-caption">Cá đã ăn: <b class="fbw-count">0</b>/20</div>
  `;
  document.body.appendChild(root);
  const layer=document.createElement('div'); layer.id='matchma-fbw-sea-layer'; layer.hidden=true;
  layer.setAttribute('aria-label','Sinh vật biển'); document.body.appendChild(layer);
  const bear=root.querySelector('.fbw-bear'),speech=root.querySelector('.fbw-speech');
  const bar=root.querySelector('.fbw-progress span'),count=root.querySelector('.fbw-count'),snow=root.querySelector('.fbw-snow');
  let active=false,meals=0,fish=[],decor=[],raf=0,last=0,busy=false,spawnTimer=0;
  const MAX=20;
  // Loose, slightly uneven outlines keep every sea creature in a hand-drawn cartoon style.
  const fishSvg=`<svg viewBox="0 0 70 42" aria-hidden="true"><g stroke="#356f80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21Q23 8 38 10Q51 10 56 21Q49 33 36 32Q23 33 17 21Z" fill="#91d7e8"/><path d="M19 21Q10 11 4 10L7 21 4 31Q12 29 19 21Z" fill="#f2bd68"/><path d="M32 12Q38 16 38 20" fill="none" stroke="#d3f3f7"/><circle cx="47" cy="17" r="2.2" fill="#294554" stroke="none"/><path d="M43 25q4 3 7 0" fill="none" stroke-width="1.5"/></g></svg>`;
  const seaArt=[
    `<svg viewBox="0 0 50 50"><g fill="#d5c6f4" stroke="#7966a9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 27Q7 12 17 10Q26 5 34 13Q43 20 40 29Q34 36 25 31Q17 37 9 27Z"/><path d="M12 29Q8 38 14 42M21 31Q18 39 22 43M31 31Q29 38 34 41M39 29Q44 35 40 40" fill="none"/><circle cx="19" cy="21" r="1.5" fill="#4d4771" stroke="none"/><circle cx="30" cy="21" r="1.5" fill="#4d4771" stroke="none"/></g></svg>`,
    `<svg viewBox="0 0 60 44"><g fill="#8bcde0" stroke="#387e98" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 23Q17 10 34 16L43 15L52 8L51 23L56 31L42 28Q24 38 8 23Z"/><path d="M24 28Q27 21 33 23" fill="none"/><circle cx="38" cy="19" r="1.8" fill="#284653" stroke="none"/><path d="M13 23Q16 28 20 28" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g stroke="#527e56" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 25Q10 10 25 10Q40 11 41 25L37 34L13 34Z" fill="#a9d49a"/><path d="M12 23Q25 15 38 23M25 11L25 33M14 18L36 29" fill="none"/><path d="M12 32L6 38M36 32L43 38M14 14L8 10M36 14L42 10" fill="#a9d49a"/><circle cx="16" cy="26" r="1.3" fill="#304f35"/><circle cx="34" cy="26" r="1.3" fill="#304f35"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g fill="#f0a17e" stroke="#a95d4d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22Q14 11 25 12Q37 12 37 23L34 31L17 31Z"/><path d="M16 29L10 35L13 40L20 34M22 31L20 40L25 43L28 33M32 31L36 39L41 37L37 29M35 23L42 19L44 23L37 27" fill="none"/><circle cx="21" cy="22" r="1.5" fill="#593a36" stroke="none"/><circle cx="30" cy="22" r="1.5" fill="#593a36" stroke="none"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g fill="#d9a1cf" stroke="#98618e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 25Q8 12 18 12Q25 12 25 20Q25 12 33 12Q43 12 41 25Q39 31 33 31L34 41L29 42L26 32L22 42L17 40L19 31Q11 32 9 25Z"/><circle cx="19" cy="23" r="1.6" fill="#533f56" stroke="none"/><circle cx="31" cy="23" r="1.6" fill="#533f56" stroke="none"/><path d="M22 27Q25 30 28 27" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g fill="#f3d39a" stroke="#b7834d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 38Q7 17 25 9Q43 17 40 38Z"/><path d="M25 11L25 38M16 17L34 38M34 17L16 38M11 28L39 28" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g fill="none" stroke="#5eaa9a" stroke-width="4" stroke-linecap="round"><path d="M25 42Q20 30 18 19Q16 9 22 8M25 42Q29 29 31 19Q33 9 28 7M25 42Q13 29 10 20M25 42Q38 30 41 18"/></g><g fill="#a6d8bc" stroke="#5eaa9a" stroke-width="1.8"><ellipse cx="22" cy="8" rx="5" ry="3"/><ellipse cx="28" cy="7" rx="5" ry="3"/></g></svg>`,
    `<svg viewBox="0 0 50 50"><g fill="#f2c66f" stroke="#aa7d40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26Q12 10 25 10Q38 10 40 26Q38 39 25 40Q12 39 10 26Z"/><path d="M14 17L8 11M14 35L8 41M36 17L42 11M36 35L42 41" fill="none"/><circle cx="20" cy="23" r="1.7" fill="#503c2c" stroke="none"/><circle cx="30" cy="23" r="1.7" fill="#503c2c" stroke="none"/><path d="M21 29Q25 32 29 29" fill="none"/></g></svg>`
  ];
  function addFish(){
    const el=document.createElement('button');el.type='button';el.className='fbw-swim-fish';el.innerHTML=fishSvg;el.setAttribute('aria-label','Cho gấu ăn con cá');
    layer.appendChild(el);const w=innerWidth,h=innerHeight;
    const f={el,x:Math.random()*Math.max(1,w-60),y:80+Math.random()*Math.max(1,h-180),vx:(Math.random()<.5?-1:1)*(18+Math.random()*30),vy:(Math.random()-.5)*10,phase:Math.random()*6.28,size:.7+Math.random()*.35,busy:false};
    el.style.setProperty('--fish-size',f.size);el.addEventListener('click',()=>feed(f));fish.push(f);
  }
  function addDecor(){
    const el=document.createElement('span');el.className='fbw-sea-creature';el.innerHTML=seaArt[Math.floor(Math.random()*seaArt.length)];
    el.setAttribute('aria-hidden','true');layer.appendChild(el);
    const d={el,x:Math.random()*Math.max(1,innerWidth-60),y:50+Math.random()*Math.max(1,innerHeight-130),vx:(Math.random()-.5)*18,vy:(Math.random()-.5)*9,phase:Math.random()*6.28};
    el.style.width=(28+Math.random()*12)+'px';el.style.height=(28+Math.random()*12)+'px';decor.push(d);
  }
  function feed(f){
    if(!active||busy||f.busy||meals>=MAX)return;busy=true;f.busy=true;
    const b=bear.getBoundingClientRect(),tx=b.left+b.width*.46,ty=b.top+b.height*.38;
    f.el.style.transition='left .65s ease,top .65s ease,transform .65s ease,opacity .65s ease';
    f.el.style.left=tx+'px';f.el.style.top=ty+'px';f.el.style.transform='scale(.15)';f.el.style.opacity='0';
    setTimeout(()=>{
      if(!active){busy=false;return}
      meals++;count.textContent=meals;bar.style.width=(meals/MAX*100)+'%';
      root.style.setProperty('--fbw-growth',String(Math.min(1.65,1+meals*.027)));
      root.classList.add('fbw-eating','fbw-happy');
      speech.textContent=meals>=MAX?'No căng rồi, gấu đi ngủ đông!':['Măm măm!','Cá ngon quá!','Gấu lớn thêm rồi!'][meals%3];
      fish=fish.filter(x=>x!==f);f.el.remove();
      setTimeout(()=>{root.classList.remove('fbw-eating','fbw-happy');busy=false;
        if(meals>=MAX){hibernate();return} addFish();
      },550);
    },660);
  }
  function hibernate(){
    root.classList.add('fbw-hibernating');root.classList.add('fbw-snowing');
    speech.textContent='No rồi… ngủ đông thôi ❄️';snow.innerHTML='';
    for(let i=0;i<28;i++){const flake=document.createElement('i');flake.textContent=['❄','❅','✧'][i%3];flake.style.left=(Math.random()*100)+'%';flake.style.animationDelay=(-Math.random()*5)+'s';flake.style.animationDuration=(4+Math.random()*5)+'s';snow.appendChild(flake)}
    fish.forEach(f=>f.el.remove());fish=[];decor.forEach(d=>d.el.remove());decor=[];
  }
  function wake(){
    meals=0;count.textContent='0';bar.style.width='0%';root.style.setProperty('--fbw-growth','1');
    root.classList.remove('fbw-hibernating','fbw-snowing');snow.innerHTML='';fish.forEach(f=>f.el.remove());fish=[];decor.forEach(d=>d.el.remove());decor=[];
    for(let i=0;i<7;i++)addFish();for(let i=0;i<12;i++)addDecor();
    speech.textContent='Nhấp cá để cho gấu ăn!';
  }
  function tick(t){
    if(!active)return;if(!last)last=t;const dt=Math.min(.04,(t-last)/1000);last=t;
    if(meals<MAX){
      fish.forEach(f=>{if(f.busy)return;f.phase+=dt*2;f.x+=f.vx*dt;f.y+=f.vy*dt+Math.sin(f.phase)*dt*8;if(f.x<2||f.x>innerWidth-50)f.vx*=-1;if(f.y<35||f.y>innerHeight-85)f.vy*=-1;f.x=Math.max(2,Math.min(innerWidth-50,f.x));f.y=Math.max(35,Math.min(innerHeight-85,f.y));f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';f.el.style.transform='scaleX('+(f.vx<0?-f.size:f.size)+')'});
      decor.forEach(d=>{d.phase+=dt;d.x+=d.vx*dt;d.y+=d.vy*dt+Math.sin(d.phase)*dt*5;if(d.x<0||d.x>innerWidth-40)d.vx*=-1;if(d.y<10||d.y>innerHeight-50)d.vy*=-1;d.el.style.left=d.x+'px';d.el.style.top=d.y+'px';d.el.style.transform='translateY('+Math.sin(d.phase*2)*4+'px)'});
    }
    raf=requestAnimationFrame(tick);
  }
  function start(){
    active=true;root.hidden=false;layer.hidden=false;toggle.textContent='✕ Tắt trò chơi';toggle.setAttribute('aria-expanded','true');
    wake();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
  }
  function stop(){
    active=false;root.hidden=true;layer.hidden=true;toggle.textContent='🐻 Chơi cùng gấu';toggle.setAttribute('aria-expanded','false');
    cancelAnimationFrame(raf);clearTimeout(spawnTimer);busy=false;
  }
  toggle.addEventListener('click',()=>active?stop():start());
  bear.addEventListener('click',()=>{speech.textContent=meals>=MAX?'Gấu đang ngủ đông. Tắt rồi mở lại để chơi tiếp!':'Nhấp vào những chú cá đang bơi nhé!'});
  addDecor();decor.forEach(d=>d.el.remove());decor=[];
  window.addEventListener('resize',()=>{fish.forEach(f=>{f.x=Math.min(f.x,innerWidth-55);f.y=Math.min(f.y,innerHeight-90)})});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
})();