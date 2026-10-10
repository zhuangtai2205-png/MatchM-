/* MatchMã — playful corner bear with free-swimming clickable fish */
(function(){
  'use strict';
  const ID='matchma-fat-bear-week';
  if(document.getElementById(ID)) return;
  const styleId='matchma-fbw-fallback';
  const root=document.createElement('aside');
  root.id=ID;
  root.setAttribute('aria-label','Góc gấu và cá bơi');
  root.innerHTML=`
    <div class="fbw-scene">
      <div class="fbw-speech" aria-live="polite">Nhấp vào cá để cho gấu ăn!</div>
      <div class="fbw-ground"></div>
      <button class="fbw-bear" type="button" aria-label="Gấu nhỏ, bấm để xem hướng dẫn">
        <svg viewBox="0 0 120 132" role="img" aria-label="Gấu nâu nhỏ dễ thương">
          <ellipse cx="60" cy="125" rx="34" ry="5" fill="#315b38" opacity=".13"/>
          <ellipse cx="39" cy="111" rx="16" ry="13" fill="#98643e"/>
          <ellipse cx="81" cy="111" rx="16" ry="13" fill="#98643e"/>
          <ellipse cx="39" cy="112" rx="10" ry="6" fill="#e6bd91"/>
          <ellipse cx="81" cy="112" rx="10" ry="6" fill="#e6bd91"/>
          <path d="M29 65Q22 75 25 100Q29 119 60 119Q91 119 95 100Q98 75 91 65Z" fill="#b77c4d"/>
          <ellipse cx="60" cy="91" rx="22" ry="22" fill="#f3d8b1"/>
          <path d="M30 77Q15 77 19 95Q22 104 35 99" fill="#b77c4d"/>
          <path d="M90 77Q105 77 101 95Q98 104 85 99" fill="#b77c4d"/>
          <circle cx="37" cy="25" r="15" fill="#98643e"/><circle cx="83" cy="25" r="15" fill="#98643e"/>
          <circle cx="37" cy="25" r="7" fill="#e9bd91"/><circle cx="83" cy="25" r="7" fill="#e9bd91"/>
          <path d="M25 43Q25 17 60 17Q95 17 95 43Q95 72 60 76Q25 72 25 43Z" fill="#b77c4d"/>
          <ellipse cx="45" cy="43" rx="4" ry="5" fill="#35251d"/><ellipse cx="75" cy="43" rx="4" ry="5" fill="#35251d"/>
          <circle cx="46" cy="41" r="1.4" fill="#fff"/><circle cx="76" cy="41" r="1.4" fill="#fff"/>
          <ellipse cx="60" cy="55" rx="16" ry="12" fill="#f4dfc0"/>
          <ellipse cx="60" cy="51" rx="5.5" ry="4" fill="#35251d"/>
          <path class="fbw-mouth-closed" d="M60 55V59Q54 65 50 59M60 59Q66 65 70 59" fill="none" stroke="#70452f" stroke-width="2" stroke-linecap="round"/>
          <ellipse class="fbw-mouth-open" cx="60" cy="61" rx="6" ry="7" fill="#753b35"/>
          <ellipse cx="34" cy="56" rx="5" ry="3" fill="#eea18c" opacity=".7"/><ellipse cx="86" cy="56" rx="5" ry="3" fill="#eea18c" opacity=".7"/>
        </svg>
      </button>
      <div class="fbw-hearts" aria-hidden="true">♥　✦　♥</div>
    </div>
    <div class="fbw-progress" role="progressbar" aria-label="Số cá gấu đã ăn" aria-valuemin="0" aria-valuemax="20" aria-valuenow="0"><span></span></div>
    <div class="fbw-caption">Cá đã ăn: <span class="fbw-count">0</span></div>
  `;
  document.body.appendChild(root);
  const layer=document.createElement('div');
  layer.id='matchma-fbw-fish-layer';
  layer.setAttribute('aria-label','Cá đang bơi, nhấp vào một con cá để cho gấu ăn');
  document.body.appendChild(layer);
  const bear=root.querySelector('.fbw-bear'), speech=root.querySelector('.fbw-speech');
  const bar=root.querySelector('.fbw-progress span'), progress=root.querySelector('.fbw-progress');
  const count=root.querySelector('.fbw-count');
  let meals=0, fishList=[], raf=0, lastTime=0, feedBusy=false;
  const fishSvg=`<svg viewBox="0 0 70 42" aria-hidden="true"><path d="M17 21C25 7 47 7 55 21C47 35 25 35 17 21Z" fill="#79cce8" stroke="#347f9e" stroke-width="2"/><path d="M19 21 4 9 4 33Z" fill="#f4bd59" stroke="#b98035" stroke-width="1.8" stroke-linejoin="round"/><path d="M31 11 36 4 42 12" fill="#f4bd59" stroke="#b98035" stroke-width="1.6"/><circle cx="47" cy="17" r="2.5" fill="#183a4b"/><circle cx="48" cy="16" r=".9" fill="#fff"/></svg>`;
  function resizeFish(f){
    f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';
    f.el.style.setProperty('--fish-angle', (f.vx<0?180:0)+'deg');
  }
  function makeFish(i){
    const el=document.createElement('button');
    el.type='button';el.className='fbw-swim-fish';el.innerHTML=fishSvg;
    el.setAttribute('aria-label','Nhấp để cho gấu ăn con cá này');
    layer.appendChild(el);
    const w=Math.max(320,window.innerWidth),h=Math.max(420,window.innerHeight);
    const f={el,x:Math.random()*Math.max(1,w-70),y:Math.random()*Math.max(1,h-90),vx:(Math.random()<.5?-1:1)*(22+Math.random()*30),vy:(Math.random()-.5)*13,phase:Math.random()*6.28,size:.65+Math.random()*.45,busy:false};
    el.style.setProperty('--fish-size',f.size);
    el.addEventListener('click',()=>feedBear(f));
    fishList.push(f);resizeFish(f);
  }
  function feedBear(f){
    if(f.busy||feedBusy)return;
    f.busy=true;feedBusy=true;
    const r=root.getBoundingClientRect(), b=bear.getBoundingClientRect();
    const sx=f.x,sy=f.y,tx=r.left+b.left-r.left+b.width*.45-20,ty=r.top+b.top-r.top+b.height*.35-14;
    f.el.classList.add('fbw-fish-eaten');
    f.el.style.transition='left .62s cubic-bezier(.2,.8,.2,1),top .62s cubic-bezier(.2,.8,.2,1),transform .62s ease,opacity .62s ease';
    f.el.style.left=Math.max(0,Math.min(window.innerWidth-45,tx))+'px';
    f.el.style.top=Math.max(0,Math.min(window.innerHeight-35,ty))+'px';
    f.el.style.transform='scale(.18) rotate(18deg)';f.el.style.opacity='0';
    window.setTimeout(()=>{
      meals++;
      const growth=Math.min(1.8,1+meals*.035);
      root.style.setProperty('--fbw-growth',growth.toFixed(3));
      count.textContent=String(meals);
      bar.style.width=(Math.min(100,meals*5))+'%';
      progress.setAttribute('aria-valuenow',String(meals));
      root.classList.remove('fbw-eating','fbw-happy');void root.offsetWidth;
      root.classList.add('fbw-eating','fbw-happy');
      speech.textContent=['Ngon quá!','Măm măm!','Gấu lớn hơn rồi!','Cá ngon ghê!','Cho thêm cá nhé!'][Math.min(4,(meals-1)%5)];
      f.el.remove();fishList=fishList.filter(x=>x!==f);
      window.setTimeout(()=>{root.classList.remove('fbw-eating','fbw-happy');feedBusy=false;makeFish(Math.random());},600);
    },640);
  }
  function tick(t){
    if(!lastTime)lastTime=t;
    const dt=Math.min(.04,(t-lastTime)/1000);lastTime=t;
    const w=window.innerWidth,h=window.innerHeight;
    fishList.forEach(f=>{
      if(f.busy)return;
      f.phase+=dt*2;
      f.x+=f.vx*dt;f.y+=f.vy*dt+Math.sin(f.phase)*dt*8;
      if(f.x<4){f.x=4;f.vx=Math.abs(f.vx)}
      if(f.x>w-52){f.x=w-52;f.vx=-Math.abs(f.vx)}
      if(f.y<70){f.y=70;f.vy=Math.abs(f.vy)+2}
      if(f.y>h-100){f.y=h-100;f.vy=-Math.abs(f.vy)-2}
      if(Math.random()<.008)f.vy=(Math.random()-.5)*18;
      f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';
      f.el.style.transform='scaleX('+(f.vx<0?-f.size:f.size)+') translateY('+Math.sin(f.phase)*2+'px)';
    });
    raf=requestAnimationFrame(tick);
  }
  for(let i=0;i<7;i++)makeFish(i);
  raf=requestAnimationFrame(tick);
  window.addEventListener('resize',()=>fishList.forEach(f=>{f.x=Math.min(f.x,window.innerWidth-55);f.y=Math.min(f.y,window.innerHeight-100)}));
  bear.addEventListener('click',()=>{speech.textContent='Nhấp vào cá đang bơi khắp màn hình nhé!';});
  window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);},{once:true});
})();