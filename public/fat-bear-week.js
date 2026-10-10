/* MatchMã Fat Bear Week — single isolated corner easter egg */
(function(){
  'use strict';
  if(document.getElementById('matchma-fat-bear-week')) return;
  const root=document.createElement('aside');
  root.id='matchma-fat-bear-week';
  root.setAttribute('aria-label','Easter egg gấu ăn cá');
  root.innerHTML=[
    '<div class="fbw-scene">',
    '<div class="fbw-speech" aria-live="polite">Cho gấu ăn cá nhé!</div>',
    '<div class="fbw-ground"></div>',
    '<div class="fbw-fish" aria-hidden="true"><svg viewBox="0 0 70 42"><path d="M17 21C26 7 46 7 54 21C46 35 26 35 17 21Z" fill="#6eb6d1" stroke="#367f9b" stroke-width="2.4"/><path d="M18 21 4 9 4 33Z" fill="#f2b85c" stroke="#b98035" stroke-width="2.2" stroke-linejoin="round"/><circle cx="46" cy="17" r="2.5" fill="#193d50"/><path d="M30 12 35 4 41 12" fill="#f2b85c" stroke="#b98035" stroke-width="1.7"/></svg></div>',
    '<div class="fbw-bear" role="button" tabindex="0" aria-label="Bấm để cho gấu ăn cá">',
    '<svg viewBox="0 0 140 160" role="img" aria-label="Gấu nâu tròn trịa dễ thương">',
    '<defs><linearGradient id="fbw-fur" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#bd8755"/><stop offset="1" stop-color="#82512f"/></linearGradient><linearGradient id="fbw-belly" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5d8a9"/><stop offset="1" stop-color="#dfb67c"/></linearGradient></defs>',
    '<ellipse cx="70" cy="144" rx="43" ry="8" fill="#5e783e" opacity=".12"/>',
    '<path d="M35 85C23 91 18 112 23 129C26 140 39 144 48 134L54 117Z" fill="#98633c" stroke="#684329" stroke-width="2.2"/><path d="M105 85C117 91 122 112 117 129C114 140 101 144 92 134L86 117Z" fill="#98633c" stroke="#684329" stroke-width="2.2"/>',
    '<path d="M39 74C25 86 24 112 32 130C38 143 51 147 70 147C89 147 102 143 108 130C116 112 115 86 101 74Z" fill="url(#fbw-fur)" stroke="#684329" stroke-width="2.5"/>',
    '<ellipse cx="70" cy="109" rx="29" ry="30" fill="url(#fbw-belly)"/><ellipse cx="50" cy="139" rx="18" ry="10" fill="#684329"/><ellipse cx="90" cy="139" rx="18" ry="10" fill="#684329"/><ellipse cx="50" cy="136" rx="15" ry="7" fill="#d7a976"/><ellipse cx="90" cy="136" rx="15" ry="7" fill="#d7a976"/>',
    '<path d="M32 57C27 42 32 25 46 20C57 16 66 25 68 36L73 49Z" fill="url(#fbw-fur)" stroke="#684329" stroke-width="2.5"/><path d="M108 57C113 42 108 25 94 20C83 16 74 25 72 36L67 49Z" fill="url(#fbw-fur)" stroke="#684329" stroke-width="2.5"/><circle cx="46" cy="34" r="8" fill="#edc08a"/><circle cx="94" cy="34" r="8" fill="#edc08a"/>',
    '<path d="M35 56C35 39 48 31 70 31C92 31 105 39 105 56C105 77 91 91 70 91C49 91 35 77 35 56Z" fill="url(#fbw-fur)" stroke="#684329" stroke-width="2.5"/>',
    '<ellipse cx="52" cy="57" rx="5" ry="6.5" fill="#2d211b"/><ellipse cx="88" cy="57" rx="5" ry="6.5" fill="#2d211b"/><circle cx="53.5" cy="55" r="1.7" fill="#fff8e9"/><circle cx="89.5" cy="55" r="1.7" fill="#fff8e9"/>',
    '<ellipse cx="70" cy="70" rx="20" ry="15" fill="#f1d6ad"/><ellipse cx="70" cy="65" rx="7.5" ry="5.7" fill="#33231c"/><path d="M70 70V75M70 75Q63 82 57 76M70 75Q77 82 83 76" fill="none" stroke="#53372a" stroke-width="2.2" stroke-linecap="round"/>',
    '<ellipse cx="45" cy="69" rx="6" ry="3.5" fill="#e99b8a" opacity=".65"/><ellipse cx="95" cy="69" rx="6" ry="3.5" fill="#e99b8a" opacity=".65"/><path d="M44 91Q70 83 96 91" fill="none" stroke="#d6a16d" stroke-width="2" opacity=".65"/><path d="M37 99Q29 105 35 117M103 99Q111 105 105 117" fill="none" stroke="#d8aa78" stroke-width="3" stroke-linecap="round"/>',
    '</svg></div></div>',
    '<div class="fbw-controls"><button type="button" class="fbw-feed">🐟 Cho gấu ăn</button></div>',
    '<div class="fbw-progress" role="progressbar" aria-label="Độ no của gấu" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0"><span></span></div>'
  ].join('');
  document.body.appendChild(root);
  const bear=root.querySelector('.fbw-bear'),fish=root.querySelector('.fbw-fish'),speech=root.querySelector('.fbw-speech');
  const progress=root.querySelector('.fbw-progress'),bar=progress.querySelector('span'),feed=root.querySelector('.fbw-feed');
  const messages=['Ngon quá! 🐟','Gấu muốn ăn thêm!','Bụng gấu đang tròn lên!','Cá ngon ghê!','Gấu lớn hơn rồi!','Gấu no một chút rồi!','Thêm một con cá nhé!','Gấu mũm mĩm dễ thương!','Sắp thành siêu gấu rồi!','🏆 Fat Bear Week: Gấu chiến thắng!'];
  let meals=0,reset;
  function eat(){
    meals=Math.min(10,meals+1);
    const scale=meals===10?1.36:1+meals*.035;
    bear.style.setProperty('--fbw-size',scale.toFixed(3));
    bear.style.transform='scale('+scale.toFixed(3)+')';
    speech.textContent=messages[meals-1];
    bar.style.width=(meals*10)+'%';progress.setAttribute('aria-valuenow',String(meals));
    root.classList.remove('fbw-eating','fbw-happy');void root.offsetWidth;
    root.classList.add('fbw-eating','fbw-happy');
    fish.style.animation='none';void fish.offsetWidth;fish.style.animation='';
    clearTimeout(reset);reset=setTimeout(()=>root.classList.remove('fbw-eating'),900);
  }
  feed.addEventListener('click',eat);bear.addEventListener('click',eat);
  bear.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();eat()}});
})();