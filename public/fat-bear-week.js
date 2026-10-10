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
        <svg viewBox="0 0 100 108" role="img" aria-label="Gấu nâu đơn giản">
          <ellipse cx="50" cy="102" rx="30" ry="4" fill="#315b38" opacity=".14"/>
          <circle cx="29" cy="19" r="12" fill="#9b6844"/><circle cx="71" cy="19" r="12" fill="#9b6844"/>
          <circle cx="29" cy="19" r="5.5" fill="#e8bd91"/><circle cx="71" cy="19" r="5.5" fill="#e8bd91"/>
          <ellipse cx="50" cy="37" rx="31" ry="29" fill="#b77c4d"/>
          <ellipse cx="39" cy="35" rx="3" ry="4" fill="#35251d"/><ellipse cx="61" cy="35" rx="3" ry="4" fill="#35251d"/>
          <ellipse cx="50" cy="47" rx="13" ry="10" fill="#f4dfc0"/><ellipse cx="50" cy="43" rx="4" ry="3" fill="#35251d"/>
          <path class="fbw-mouth-closed" d="M50 46v4m0 0q-5 5-8 0m8 0q5 5 8 0" fill="none" stroke="#70452f" stroke-width="1.8" stroke-linecap="round"/>
          <ellipse class="fbw-mouth-open" cx="50" cy="51" rx="5" ry="6" fill="#753b35"/>
          <path d="M25 62Q17 66 19 82Q22 96 50 96Q78 96 81 82Q83 66 75 62Z" fill="#b77c4d"/>
          <ellipse cx="50" cy="78" rx="18" ry="16" fill="#f4dfc0"/>
          <ellipse cx="31" cy="92" rx="12" ry="8" fill="#9b6844"/><ellipse cx="69" cy="92" rx="12" ry="8" fill="#9b6844"/>
        </svg>
      </button>
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
  const fishSvg=`<svg viewBox="0 0 70 42" aria-hidden="true"><path d="M17 21C25 7 47 7 55 21C47 35 25 35 17 21Z" fill="#79cce8" stroke="#347f9e" stroke-width="2"/><path d="M19 21 4 9 4 33Z" fill="#f4bd59" stroke="#b98035" stroke-width="1.8" stroke-linejoin="round"/><circle cx="47" cy="17" r="2.5" fill="#183a4b"/><circle cx="48" cy="16" r=".9" fill="#fff"/></svg>`;
  const seaIcons=['🪼','🐬','🐢','🦀','🐙','🫧','🐚','🪸','🦑','🐡'];
  function addFish(){
    const el=document.createElement('button');el.type='button';el.className='fbw-swim-fish';el.innerHTML=fishSvg;el.setAttribute('aria-label','Cho gấu ăn con cá');
    layer.appendChild(el);const w=innerWidth,h=innerHeight;
    const f={el,x:Math.random()*Math.max(1,w-60),y:80+Math.random()*Math.max(1,h-180),vx:(Math.random()<.5?-1:1)*(18+Math.random()*30),vy:(Math.random()-.5)*10,phase:Math.random()*6.28,size:.7+Math.random()*.35,busy:false};
    el.style.setProperty('--fish-size',f.size);el.addEventListener('click',()=>feed(f));fish.push(f);
  }
  function addDecor(){
    const el=document.createElement('span');el.className='fbw-sea-creature';el.textContent=seaIcons[Math.floor(Math.random()*seaIcons.length)];
    el.setAttribute('aria-hidden','true');layer.appendChild(el);
    const d={el,x:Math.random()*Math.max(1,innerWidth-60),y:50+Math.random()*Math.max(1,innerHeight-130),vx:(Math.random()-.5)*18,vy:(Math.random()-.5)*9,phase:Math.random()*6.28};
    el.style.fontSize=(19+Math.random()*13)+'px';decor.push(d);
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