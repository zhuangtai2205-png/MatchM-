/* MatchMã corner bear — isolated, fish-feeding interaction */
(function(){
  'use strict';
  const ID='matchma-fat-bear-week';
  if(document.getElementById(ID)) return;
  const root=document.createElement('aside');
  root.id=ID;
  root.setAttribute('aria-label','Góc gấu ăn cá');
  root.innerHTML=`
    <div class="fbw-scene">
      <div class="fbw-speech" aria-live="polite">Cho mình xin một con cá nhé!</div>
      <div class="fbw-ground"></div>
      <div class="fbw-fish-flight" aria-hidden="true">
        <svg viewBox="0 0 90 54"><path d="M20 27C30 9 57 8 68 27C57 46 30 45 20 27Z" fill="#76c9e7" stroke="#347e9d" stroke-width="2.6"/><path d="M22 27 4 12 4 42Z" fill="#f5bd58" stroke="#b98035" stroke-width="2.4" stroke-linejoin="round"/><path d="M39 13 46 4 54 14" fill="#f5bd58" stroke="#b98035" stroke-width="2"/><circle cx="59" cy="22" r="3" fill="#183a4b"/><circle cx="60" cy="21" r="1" fill="#fff"/></svg>
      </div>
      <button class="fbw-bear" type="button" aria-label="Cho gấu ăn cá">
        <svg viewBox="0 0 180 210" role="img" aria-label="Gấu nâu mũm mĩm nguyên con">
          <defs>
            <linearGradient id="fbw-coat" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#d5a16b"/><stop offset=".55" stop-color="#b77b48"/><stop offset="1" stop-color="#8b5835"/></linearGradient>
            <linearGradient id="fbw-tummy" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffebc8"/><stop offset="1" stop-color="#e5bd8b"/></linearGradient>
          </defs>
          <!-- feet and body -->
          <ellipse cx="90" cy="194" rx="56" ry="9" fill="#496d3d" opacity=".16"/>
          <ellipse cx="59" cy="177" rx="25" ry="19" fill="#89552f" stroke="#70452b" stroke-width="2.5"/>
          <ellipse cx="121" cy="177" rx="25" ry="19" fill="#89552f" stroke="#70452b" stroke-width="2.5"/>
          <ellipse cx="59" cy="178" rx="17" ry="10" fill="#d8aa7b"/>
          <ellipse cx="121" cy="178" rx="17" ry="10" fill="#d8aa7b"/>
          <path d="M43 92C29 105 26 135 34 159C42 184 63 190 90 190C117 190 138 184 146 159C154 135 151 105 137 92Z" fill="url(#fbw-coat)" stroke="#70452b" stroke-width="3"/>
          <ellipse cx="90" cy="143" rx="39" ry="39" fill="url(#fbw-tummy)"/>
          <path d="M40 112C22 115 18 137 29 150C37 159 49 151 54 140" fill="#b77b48" stroke="#70452b" stroke-width="2.5"/>
          <path d="M140 112C158 115 162 137 151 150C143 159 131 151 126 140" fill="#b77b48" stroke="#70452b" stroke-width="2.5"/>
          <!-- round ears and head -->
          <circle cx="53" cy="45" r="23" fill="url(#fbw-coat)" stroke="#70452b" stroke-width="3"/>
          <circle cx="127" cy="45" r="23" fill="url(#fbw-coat)" stroke="#70452b" stroke-width="3"/>
          <circle cx="53" cy="45" r="11" fill="#edc69c"/><circle cx="127" cy="45" r="11" fill="#edc69c"/>
          <path d="M37 68C37 42 57 28 90 28C123 28 143 42 143 68C143 98 123 116 90 116C57 116 37 98 37 68Z" fill="url(#fbw-coat)" stroke="#70452b" stroke-width="3"/>
          <!-- eyes -->
          <ellipse cx="69" cy="66" rx="5.6" ry="7" fill="#33231b"/><ellipse cx="111" cy="66" rx="5.6" ry="7" fill="#33231b"/>
          <circle cx="70.5" cy="64" r="2" fill="#fff8e9"/><circle cx="112.5" cy="64" r="2" fill="#fff8e9"/>
          <!-- muzzle and animated mouth -->
          <ellipse cx="90" cy="83" rx="24" ry="18" fill="#f6dfbd"/>
          <ellipse cx="90" cy="77" rx="8.5" ry="6.5" fill="#38241b"/>
          <path class="fbw-mouth-closed" d="M90 82V88M90 88Q82 96 75 88M90 88Q98 96 105 88" fill="none" stroke="#68432e" stroke-width="2.8" stroke-linecap="round"/>
          <ellipse class="fbw-mouth-open" cx="90" cy="91" rx="9" ry="11" fill="#6e302b"/>
          <path d="M55 86Q48 82 49 91M125 86Q132 82 131 91" fill="none" stroke="#d99c79" stroke-width="3" stroke-linecap="round"/>
          <ellipse cx="53" cy="82" rx="7" ry="4.5" fill="#eea18d" opacity=".75"/><ellipse cx="127" cy="82" rx="7" ry="4.5" fill="#eea18d" opacity=".75"/>
        </svg>
      </button>
      <div class="fbw-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>♥</span></div>
    </div>
    <div class="fbw-controls">
      <button type="button" class="fbw-feed" aria-label="Ném cá cho gấu ăn">
        <svg viewBox="0 0 36 22" aria-hidden="true"><path d="M9 11C14 2 26 2 31 11C26 20 14 20 9 11Z" fill="#73c6e4" stroke="#347e9d" stroke-width="1.5"/><path d="M10 11 2 4 2 18Z" fill="#f3ba56" stroke="#b98035" stroke-width="1.5" stroke-linejoin="round"/><circle cx="25" cy="8" r="1.5" fill="#183a4b"/></svg>
        Cho gấu ăn cá
      </button>
    </div>
    <div class="fbw-progress" role="progressbar" aria-label="Mức lớn lên của gấu" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0"><span></span></div>
    <div class="fbw-caption">Cá đã ăn: <span class="fbw-count">0</span>/10</div>
  `;
  document.body.appendChild(root);
  const bear=root.querySelector('.fbw-bear'), fish=root.querySelector('.fbw-fish-flight');
  const speech=root.querySelector('.fbw-speech'), feed=root.querySelector('.fbw-feed');
  const bar=root.querySelector('.fbw-progress span'), progress=root.querySelector('.fbw-progress');
  const count=root.querySelector('.fbw-count');
  const messages=['Cá tới rồi!','Măm măm, ngon quá!','Bụng bắt đầu tròn rồi!','Cho thêm một con nữa nhé?','Gấu đang lớn lên nè!','Cá ngon ghê!','Mũm mĩm hơn một chút!','Gấu vui quá!','Sắp thành gấu siêu to!','No căng bụng rồi! 🐻'];
  let meals=0, busy=false, lastTimer;
  function eat(){
    if(busy) return;
    if(meals>=10){speech.textContent='Gấu no căng rồi, cảm ơn bạn! 💚';root.classList.add('fbw-happy');return;}
    busy=true;
    const start=feed.getBoundingClientRect();
    const target=bear.getBoundingClientRect();
    const scene=root.getBoundingClientRect();
    const x1=start.left+start.width/2-scene.left-24;
    const y1=start.top+start.height/2-scene.top-24;
    const x2=target.left+target.width*.52-scene.left-24;
    const y2=target.top+target.height*.40-scene.top-24;
    fish.style.left=x1+'px';fish.style.top=y1+'px';fish.style.opacity='1';
    fish.animate([
      {transform:'translate(0,0) rotate(-8deg) scale(.75)',opacity:0},
      {transform:'translate(0,-14px) rotate(8deg) scale(1)',opacity:1,offset:.16},
      {transform:'translate('+(x2-x1)+'px,'+(y2-y1)+'px) rotate(24deg) scale(.45)',opacity:1,offset:.84},
      {transform:'translate('+(x2-x1)+'px,'+(y2-y1)+'px) rotate(28deg) scale(.1)',opacity:0}
    ],{duration:690,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'}).onfinish=()=>{
      fish.style.opacity='0';fish.getAnimations().forEach(a=>a.cancel());
      meals++;
      bear.style.setProperty('--fbw-growth',String(1+meals*.035));
      root.style.setProperty('--fbw-growth',String(1+meals*.035));
      count.textContent=String(meals);
      bar.style.width=(meals*10)+'%';progress.setAttribute('aria-valuenow',String(meals));
      speech.textContent=messages[meals-1];
      root.classList.remove('fbw-eating','fbw-happy');void root.offsetWidth;
      root.classList.add('fbw-eating','fbw-happy');
      clearTimeout(lastTimer);
      lastTimer=setTimeout(()=>{root.classList.remove('fbw-eating','fbw-happy');busy=false;},760);
    };
  }
  feed.addEventListener('click',eat);
  bear.addEventListener('click',eat);
})();