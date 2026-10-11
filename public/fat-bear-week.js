/* MatchMã — rebuilt Fat Bear Week-inspired Easter Egg */
(()=>{'use strict';
if(document.getElementById('matchma-fbw-toggle'))return;
const toggle=document.createElement('button');toggle.id='matchma-fbw-toggle';toggle.type='button';toggle.textContent='🐻 Chơi cùng gấu';toggle.setAttribute('aria-expanded','false');document.body.appendChild(toggle);
const root=document.createElement('aside');root.id='matchma-fat-bear-week';root.hidden=true;root.setAttribute('aria-label','Trò chơi gấu ăn cá');
root.innerHTML=`
<div class="fbw-world" aria-label="Đại dương hoạt hình">
 <div class="fbw-moon">✦</div><div class="fbw-bubble b1"></div><div class="fbw-bubble b2"></div>
 <div class="fbw-message" aria-live="polite">Chạm vào cá để cho gấu ăn nhé!</div>
 <div class="fbw-bear-wrap"><button class="fbw-bear" aria-label="Gấu nâu, chạm để vuốt ve"><span class="fbw-bear-icon" aria-hidden="true">⌒ ― ⌒<br>(　･(ｪ)･)<br>/　⌒ヽ𓈒<br>人＿__つつ</span></button></div>
 <div class="fbw-ground"></div><div class="fbw-snow" aria-hidden="true"></div>
</div>
<div class="fbw-status"><span>🐟 Cá đã ăn <b class="fbw-count">0</b>/20</span><div class="fbw-progress"><span></span></div></div>
<div class="fbw-dock"><button type="button" class="fbw-close" aria-label="Đóng trò chơi">×</button><button type="button" class="fbw-feed" aria-label="Gọi một con cá đến cho ăn">🐟 <small>♥ <span class="fbw-votes">0</span></small></button><button type="button" class="fbw-share" aria-label="Chia sẻ trò chơi">↗</button></div>`;
document.body.appendChild(root);
const globalSnow=document.createElement('div');globalSnow.id='matchma-fbw-global-snow';globalSnow.hidden=true;globalSnow.setAttribute('aria-hidden','true');document.body.appendChild(globalSnow);
const layer=document.createElement('div');layer.id='matchma-fbw-sea-layer';layer.hidden=true;layer.setAttribute('aria-label','Các sinh vật biển có thể cho gấu ăn');document.body.appendChild(layer);
const $=q=>root.querySelector(q),bear=$('.fbw-bear'),message=$('.fbw-message'),count=$('.fbw-count'),votes=$('.fbw-votes'),progress=$('.fbw-progress span'),snow=$('.fbw-snow');
let active=false,eaten=0,items=[],raf=0,last=0,hibernating=false;
const art=[
{n:'cá đuôi dài',svg:'<span class="fbw-sea-glyph">𓆝</span>'},
{n:'cá nhỏ',svg:'<span class="fbw-sea-glyph">𓆟</span>'},
{n:'cá nhiệt đới',svg:'<span class="fbw-sea-glyph">𓆞</span>'},
{n:'cá rạn san hô',svg:'<span class="fbw-sea-glyph">𓆝</span>'},
{n:'cá nóc',svg:'<span class="fbw-sea-glyph">𓆡</span>'},
{n:'rùa biển',svg:'<span class="fbw-sea-glyph">𓆉</span>'},
{n:'vỏ sò biển',svg:'<span class="fbw-sea-glyph">𓇼</span>'}
];
const seaArt=[
{name:'cá đuôi dài',svg:'<span class="fbw-sea-glyph">𓆝</span>'},
{name:'cá nhỏ',svg:'<span class="fbw-sea-glyph">𓆟</span>'},
{name:'cá nhiệt đới',svg:'<span class="fbw-sea-glyph">𓆞</span>'},
{name:'rùa biển',svg:'<span class="fbw-sea-glyph">𓆉</span>'},
{name:'cá nóc',svg:'<span class="fbw-sea-glyph">𓆡</span>'},
{name:'sao biển',svg:'<span class="fbw-sea-glyph">✧</span>'},
{name:'vỏ sò',svg:'<span class="fbw-sea-glyph">𓇼</span>'}
];
function fishSvg(a){return a.svg;}

function spawnFish(x,y){
 if(!active||hibernating)return;const a=art[Math.floor(Math.random()*art.length)],el=document.createElement('button');el.type='button';el.className='fbw-fish';el.setAttribute('aria-label','Cho gấu ăn '+a.n);el.innerHTML=fishSvg(a);el.style.left=(x??(30+Math.random()*Math.max(200,innerWidth-100)))+'px';el.style.top=(y??(100+Math.random()*Math.max(100,innerHeight-300)))+'px';layer.appendChild(el);
 const o={el,x:parseFloat(el.style.left),y:parseFloat(el.style.top),vx:(Math.random()>.5?1:-1)*(36+Math.random()*34),vy:(Math.random()-.5)*12,phase:Math.random()*6,busy:false};items.push(o);el.addEventListener('click',()=>feed(o));}
function spawnSea(){
 if(!active||hibernating)return;const a=seaArt[Math.floor(Math.random()*seaArt.length)],el=document.createElement('button');el.type='button';el.className='fbw-sea-creature';el.setAttribute('aria-label','Cho gấu ăn '+a.name);el.innerHTML=a.svg;el.style.left=(40+Math.random()*Math.max(180,innerWidth-100))+'px';el.style.top=(100+Math.random()*Math.max(100,innerHeight-300))+'px';layer.appendChild(el);
 const o={el,x:parseFloat(el.style.left),y:parseFloat(el.style.top),vx:(Math.random()>.5?1:-1)*(24+Math.random()*18),vy:(Math.random()-.5)*8,phase:Math.random()*6,busy:false};items.push(o);el.addEventListener('click',()=>feed(o));}
function feed(o){if(!active||hibernating||o.busy||eaten>=20)return;o.busy=true;const b=bear.getBoundingClientRect();o.el.style.transition='left .62s cubic-bezier(.2,.8,.3,1),top .62s cubic-bezier(.2,.8,.3,1),transform .62s ease,opacity .62s ease';o.el.style.left=(b.left+b.width*.55)+'px';o.el.style.top=(b.top+b.height*.42)+'px';o.el.style.transform='scale(.12)';o.el.style.opacity='0';message.textContent='Măm măm! '+(o.el.classList.contains('fbw-fish')?'Cá ngon quá!':'Sinh vật biển ngon quá!');root.classList.add('fbw-eating');setTimeout(()=>{if(!active)return;o.el.remove();items=items.filter(i=>i!==o);eaten++;count.textContent=eaten;votes.textContent=eaten;progress.style.width=(eaten/20*100)+'%';root.style.setProperty('--fbw-growth',String(1+eaten*.045));root.classList.remove('fbw-eating');root.classList.add('fbw-happy');setTimeout(()=>root.classList.remove('fbw-happy'),400);if(eaten>=20)hibernate();else if(items.length<9)spawnFish();},640);}
function hibernate(){hibernating=true;root.classList.add('fbw-hibernating');message.textContent='No căng rồi… ngủ đông thôi! Tuyết đang rơi khắp nơi ❄';globalSnow.innerHTML='';globalSnow.hidden=false;for(let i=0;i<95;i++){const flake=document.createElement('i');flake.textContent=['❄','❅','❆','·'][i%4];flake.style.left=Math.random()*100+'%';flake.style.animationDelay=-Math.random()*9+'s';flake.style.animationDuration=5+Math.random()*9+'s';flake.style.setProperty('--flake-size',(7+Math.random()*15)+'px');globalSnow.appendChild(flake)}items.forEach(o=>o.el.remove());items=[];}
function tick(t){if(!active)return;const dt=Math.min(.05,(t-(last||t))/1000);last=t;if(!hibernating)items.forEach(o=>{if(o.busy)return;o.phase+=dt;o.x+=o.vx*dt;o.y+=o.vy*dt+Math.sin(o.phase*2)*dt*7;if(o.x<0||o.x>innerWidth-55)o.vx*=-1;if(o.y<80||o.y>innerHeight-100)o.vy*=-1;o.x=Math.max(0,Math.min(innerWidth-55,o.x));o.y=Math.max(80,Math.min(innerHeight-100,o.y));o.el.style.left=o.x+'px';o.el.style.top=o.y+'px';if(o.el.classList.contains('fbw-fish'))o.el.style.transform='scaleX('+(o.vx<0?-1:1)+')'});raf=requestAnimationFrame(tick);}
function start(){active=true;hibernating=false;globalSnow.hidden=true;globalSnow.innerHTML='';eaten=0;count.textContent='0';votes.textContent='0';progress.style.width='0';root.style.setProperty('--fbw-growth','1');root.classList.remove('fbw-hibernating','fbw-snowing');snow.innerHTML='';root.hidden=false;layer.hidden=false;toggle.textContent='✕ Tắt trò chơi';toggle.setAttribute('aria-expanded','true');message.textContent='Chạm cá hoặc sinh vật biển để cho gấu ăn!';items.forEach(o=>o.el.remove());items=[];for(let i=0;i<7;i++)spawnFish();for(let i=0;i<4;i++)spawnSea();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);}
function stop(){active=false;root.hidden=true;layer.hidden=true;globalSnow.hidden=true;globalSnow.innerHTML='';toggle.textContent='🐻 Chơi cùng gấu';toggle.setAttribute('aria-expanded','false');cancelAnimationFrame(raf);items.forEach(o=>o.el.remove());items=[];}
toggle.addEventListener('click',()=>active?stop():start());$('.fbw-close').addEventListener('click',stop);
$('.fbw-feed').addEventListener('click',()=>{const o=items.find(x=>!x.busy);if(o)feed(o);else if(hibernating)message.textContent='Mở lại trò chơi để gấu tỉnh giấc nhé!';});
bear.addEventListener('click',()=>{message.textContent=hibernating?'Gấu đang ngủ đông…':'Gấu thích được vuốt ve! Hãy chạm cá để cho ăn.';});
$('.fbw-share').addEventListener('click',()=>{const url=location.href;if(navigator.share)navigator.share({title:'Easter Egg MatchMã',url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>message.textContent='Đã sao chép liên kết!').catch(()=>message.textContent=url);else message.textContent=url;});
window.addEventListener('resize',()=>items.forEach(o=>{o.x=Math.min(o.x,innerWidth-60);o.y=Math.min(o.y,innerHeight-100)}));
})();
