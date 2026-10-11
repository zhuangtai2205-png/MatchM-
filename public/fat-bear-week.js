/* MatchMã — optional ocean mini-game, simple bear, hibernation + snow */
(function(){
  'use strict';
  if(document.getElementById('matchma-fbw-toggle')) return;
  const toggle=document.createElement('button');
  toggle.id='matchma-fbw-toggle'; toggle.type='button'; toggle.textContent='🐻 Easter Egg';
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
        <svg viewBox="0 0 100 120" role="img" aria-label="Gấu nâu mập phong cách minh họa 2D">
          <defs><linearGradient id="fbw-fur" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#bd8750"/><stop offset=".55" stop-color="#996039"/><stop offset="1" stop-color="#74472d"/></linearGradient></defs>
          <g stroke="#70472e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M26 24Q15 9 25 7Q36 6 39 21M61 21Q67 6 77 9Q87 13 75 27" fill="#a87345"/>
            <ellipse cx="50" cy="67" rx="32" ry="43" fill="url(#fbw-fur)"/>
            <path d="M25 49Q12 44 12 57Q12 67 25 70M75 49Q88 44 88 57Q88 67 75 70" fill="#a87345"/>
            <ellipse cx="50" cy="78" rx="20" ry="24" fill="#d9b58a" stroke-width="1.7"/>
            <ellipse cx="38" cy="43" rx="3.2" ry="4.2" fill="#30251d" stroke="none"/><ellipse cx="62" cy="43" rx="3.2" ry="4.2" fill="#30251d" stroke="none"/>
            <circle cx="39" cy="42" r="1" fill="#fff" stroke="none"/><circle cx="63" cy="42" r="1" fill="#fff" stroke="none"/>
            <ellipse cx="31" cy="53" rx="5" ry="3" fill="#d9897b" stroke="none" opacity=".8"/><ellipse cx="69" cy="53" rx="5" ry="3" fill="#d9897b" stroke="none" opacity=".8"/>
            <ellipse cx="50" cy="54" rx="12" ry="9" fill="#f0d4ad" stroke-width="1.5"/>
            <path d="M46 51Q50 47 54 51Q54 55 50 55Q46 55 46 51Z" fill="#503428" stroke-width="1"/>
            <path class="fbw-mouth-closed" d="M50 55v3m0 0q-4 4-7 0m7 0q4 4 7 0" fill="none" stroke-width="1.5"/>
            <ellipse class="fbw-mouth-open" cx="50" cy="59" rx="4" ry="4.5" fill="#874e45" stroke-width="1.2"/>
            <path d="M32 98Q27 104 31 111L43 111L45 102M68 98Q73 104 69 111L57 111L55 102" fill="#855331"/>
            <path d="M38 73Q50 78 62 73" fill="none" stroke="#b48a60" stroke-width="1.8"/>
            <path d="M22 33Q27 27 34 30M66 30Q73 27 78 34" fill="none" stroke="#d7a56e" stroke-width="2"/>
          </g>
        </svg>      </button>
      <div class="fbw-hearts" aria-hidden="true">♥ ✦ ♥</div>
      <div class="fbw-snow" aria-hidden="true"></div>
    </div>
    <div class="fbw-progress"><span></span></div>
    <div class="fbw-caption">Cá đã ăn: <b class="fbw-count">0</b>/20</div>
    <div class="fbw-dock"><button type="button" class="fbw-close" aria-label="Đóng trò chơi">×</button><button type="button" class="fbw-feed" aria-label="Cho gấu ăn cá">🐟 <small>♥ <span class="fbw-votes">0</span></small></button><button type="button" class="fbw-share" aria-label="Chia sẻ trò chơi">↗</button></div>
  `;
  document.body.appendChild(root);
  const layer=document.createElement('div'); layer.id='matchma-fbw-sea-layer'; layer.hidden=true;
  layer.setAttribute('aria-label','Sinh vật biển'); document.body.appendChild(layer);
  const bear=root.querySelector('.fbw-bear'),speech=root.querySelector('.fbw-speech');
  const bar=root.querySelector('.fbw-progress span'),count=root.querySelector('.fbw-count'),snow=root.querySelector('.fbw-snow'),feedButton=root.querySelector('.fbw-feed'),closeButton=root.querySelector('.fbw-close'),shareButton=root.querySelector('.fbw-share'),votes=root.querySelector('.fbw-votes');
  let active=false,meals=0,fish=[],decor=[],raf=0,last=0,busy=false,spawnTimer=0;
  const MAX=20;
  // Loose, slightly uneven outlines keep every sea creature in a hand-drawn cartoon style.
  const fishSvgs=[
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#80502e" stroke-width="2" stroke-linejoin="round"><path d="M13 22Q23 7 43 13Q53 16 55 23Q43 35 26 32Q17 30 13 22Z" fill="#e99554"/><path d="M15 22L4 12L6 23L4 32Z" fill="#e9c56a"/><path d="M28 13L34 21L29 31" fill="none" stroke="#fff0c6" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#39291e"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#425b7a" stroke-width="2" stroke-linejoin="round"><path d="M12 22Q23 8 42 13Q54 17 56 23Q43 35 25 32Q16 30 12 22Z" fill="#6fa9d2"/><path d="M14 22L4 12L6 23L4 32Z" fill="#d9e8ee"/><path d="M25 14L29 31M35 13L39 31" stroke="#d9e8ee" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#263c55"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#9b6137" stroke-width="2" stroke-linejoin="round"><path d="M13 22Q23 7 43 13Q53 16 56 22Q44 35 26 32Q17 30 13 22Z" fill="#f1cb62"/><path d="M15 22L4 12L6 23L4 32Z" fill="#e58d57"/><path d="M25 14L31 31M37 13L42 30" stroke="#e88d4e" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#39291e"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#70533e" stroke-width="2" stroke-linejoin="round"><path d="M14 22Q20 8 40 12Q53 14 56 23Q43 36 25 32Q17 29 14 22Z" fill="#d9b3d6"/><path d="M15 22L4 12L6 23L4 32Z" fill="#9c78bb"/><path d="M26 14Q35 21 26 31M38 13Q46 21 38 31" fill="none" stroke="#f8e6e8" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#39291e"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#55704a" stroke-width="2" stroke-linejoin="round"><path d="M13 22Q23 7 43 13Q53 16 55 23Q43 35 26 32Q17 30 13 22Z" fill="#8fbd7e"/><path d="M15 22L4 12L6 23L4 32Z" fill="#d5df91"/><path d="M28 13L34 21L29 31" fill="none" stroke="#e8e6b0" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#293d27"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`,
    `<svg viewBox="0 0 70 44" aria-hidden="true"><g stroke="#9b6345" stroke-width="2" stroke-linejoin="round"><path d="M13 22Q22 8 39 12Q52 14 56 22Q45 34 27 33Q17 30 13 22Z" fill="#e9a38b"/><path d="M15 22L4 12L6 23L4 32Z" fill="#f2d08a"/><path d="M23 14L28 31M36 13L41 31" stroke="#f6d7b8" stroke-width="4"/><circle cx="46" cy="20" r="2" fill="#39291e"/><path d="M40 27q4 3 7 0" fill="none"/></g></svg>`
  ];
  const fishSvg=fishSvgs[0];
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
    const el=document.createElement('button');el.type='button';el.className='fbw-swim-fish';el.innerHTML=fishSvgs[Math.floor(Math.random()*fishSvgs.length)];el.setAttribute('aria-label','Cho gấu ăn con cá');
    layer.appendChild(el);const w=innerWidth,h=innerHeight;
    const f={el,x:Math.random()*Math.max(1,w-60),y:80+Math.random()*Math.max(1,h-180),vx:(Math.random()<.5?-1:1)*(18+Math.random()*30),vy:(Math.random()-.5)*10,phase:Math.random()*6.28,size:.7+Math.random()*.35,busy:false};
    el.style.setProperty('--fish-size',f.size);el.addEventListener('click',()=>feed(f));fish.push(f);
  }
  function addDecor(){
    const el=document.createElement('button');el.type='button';el.className='fbw-sea-creature';el.innerHTML=seaArt[Math.floor(Math.random()*seaArt.length)];el.setAttribute('aria-label','Cho gấu ăn sinh vật biển');
    layer.appendChild(el);
    const d={el,x:Math.random()*Math.max(1,innerWidth-60),y:50+Math.random()*Math.max(1,innerHeight-130),vx:(Math.random()-.5)*18,vy:(Math.random()-.5)*9,phase:Math.random()*6.28};
    el.style.width=(28+Math.random()*12)+'px';el.style.height=(34+Math.random()*14)+'px';el.addEventListener('click',()=>eatDecor(d));decor.push(d);
  }
  function feed(f){
    if(!active||busy||f.busy||meals>=MAX)return;busy=true;f.busy=true;
    const b=bear.getBoundingClientRect(),tx=b.left+b.width*.46,ty=b.top+b.height*.38;
    f.el.style.transition='left .65s ease,top .65s ease,transform .65s ease,opacity .65s ease';
    f.el.style.left=tx+'px';f.el.style.top=ty+'px';f.el.style.transform='scale(.15)';f.el.style.opacity='0';
    setTimeout(()=>{
      if(!active){busy=false;return}
      meals++;count.textContent=meals;bar.style.width=(meals/MAX*100)+'%';
      root.style.setProperty('--fbw-growth',String(Math.min(2.15,1+meals*.055)));votes.textContent=meals;
      root.classList.add('fbw-eating','fbw-happy');
      speech.textContent=meals>=MAX?'No căng rồi, gấu đi ngủ đông!':['Măm măm!','Cá ngon quá!','Gấu lớn thêm rồi!'][meals%3];
      fish=fish.filter(x=>x!==f);f.el.remove();
      setTimeout(()=>{root.classList.remove('fbw-eating','fbw-happy');busy=false;
        if(meals>=MAX){hibernate();return} addFish();
      },550);
    },660);
  }
  function eatDecor(d){
    if(!active||busy||d.busy||meals>=MAX)return;busy=true;d.busy=true;
    const b=bear.getBoundingClientRect(),tx=b.left+b.width*.46,ty=b.top+b.height*.38;
    d.el.style.transition='left .65s ease,top .65s ease,transform .65s ease,opacity .65s ease';
    d.el.style.left=tx+'px';d.el.style.top=ty+'px';d.el.style.transform='scale(.12)';d.el.style.opacity='0';
    setTimeout(()=>{
      if(!active){busy=false;return}
      meals++;count.textContent=meals;bar.style.width=(meals/MAX*100)+'%';
      root.style.setProperty('--fbw-growth',String(Math.min(1.65,1+meals*.027)));
      root.classList.add('fbw-eating','fbw-happy');
      speech.textContent=meals>=MAX?'No căng rồi, gấu đi ngủ đông!':['Ngon quá!','Măm măm!','Gấu lớn thêm rồi!'][meals%3];
      decor=decor.filter(x=>x!==d);d.el.remove();
      setTimeout(()=>{root.classList.remove('fbw-eating','fbw-happy');busy=false;if(meals>=MAX){hibernate();return}addDecor();},550);
    },660);
  }
  function hibernate(){
    root.classList.add('fbw-hibernating');root.classList.add('fbw-snowing');
    speech.textContent='No rồi… ngủ đông thôi ❄️';snow.innerHTML='';
    for(let i=0;i<28;i++){const flake=document.createElement('i');flake.textContent=['❄','❅','✧'][i%3];flake.style.left=(Math.random()*100)+'%';flake.style.animationDelay=(-Math.random()*5)+'s';flake.style.animationDuration=(4+Math.random()*5)+'s';snow.appendChild(flake)}
    fish.forEach(f=>f.el.remove());fish=[];decor.forEach(d=>d.el.remove());decor=[];
  }
  function wake(){
    meals=0;count.textContent='0';bar.style.width='0%';root.style.setProperty('--fbw-growth','1');votes.textContent='0';
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
  closeButton.addEventListener('click',stop);
  feedButton.addEventListener('click',()=>{const target=fish.find(f=>!f.busy);if(target)feed(target);else if(meals>=MAX)speech.textContent='Gấu no rồi, đang ngủ đông!';});
  shareButton.addEventListener('click',()=>{const url=location.href;if(navigator.share){navigator.share({title:'Easter Egg MatchMã — Fat Bear Week',url}).catch(()=>{});}else if(navigator.clipboard){navigator.clipboard.writeText(url).then(()=>{speech.textContent='Đã sao chép liên kết!';}).catch(()=>{speech.textContent=url;});}else speech.textContent=url;});
  bear.addEventListener('click',()=>{speech.textContent=meals>=MAX?'Gấu đang ngủ đông. Tắt rồi mở lại để chơi tiếp!':'Nhấp vào những chú cá đang bơi nhé!'});
  addDecor();decor.forEach(d=>d.el.remove());decor=[];
  window.addEventListener('resize',()=>{fish.forEach(f=>{f.x=Math.min(f.x,innerWidth-55);f.y=Math.min(f.y,innerHeight-90)})});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
})();