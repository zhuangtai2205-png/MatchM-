const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
const PORT=process.env.PORT||3000;

app.disable('x-powered-by');
app.use(express.json({limit:'2mb'}));
app.get('/health',(req,res)=>res.json({ok:true,app:'MatchMa'}));

// Server-side marketplace audit. Search-provider failures are always reported as
// "unverified", never as proof that a product does not exist.
const MARKET_SOURCES = {
  google: {name:'Google Search', domain:'', url:q=>'https://www.google.com/search?q='+encodeURIComponent(q)},
  shopping: {name:'Google Shopping', domain:'google.com', searchPrefix:'site:google.com/shopping ', url:q=>'https://www.google.com/search?tbm=shop&q='+encodeURIComponent(q)},
  shopee: {name:'Shopee', domain:'shopee.vn', url:q=>'https://shopee.vn/search?keyword='+encodeURIComponent(q)},
  lazada: {name:'Lazada', domain:'lazada.vn', url:q=>'https://www.lazada.vn/catalog/?q='+encodeURIComponent(q)},
  tiki: {name:'Tiki', domain:'tiki.vn', url:q=>'https://tiki.vn/search?q='+encodeURIComponent(q)},
  tiktok: {name:'TikTok', domain:'tiktok.com', url:q=>'https://www.tiktok.com/search?q='+encodeURIComponent(q)},
  sendo: {name:'Sendo', domain:'sendo.vn', url:q=>'https://www.sendo.vn/search?keyword='+encodeURIComponent(q)}
};
function decodeHtml(s){return String(s||'').replace(/&amp;/g,'&').replace(/&#x2F;/gi,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');}
function parseDdgResults(html, source){
  if(/anomaly-modal|botnet|captcha|challenge|Unfortunately, bots|select all squares/i.test(html)) return {ok:false, reason:'Nhà cung cấp tìm kiếm yêu cầu xác minh truy cập.'};
  const results=[]; const re=/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))&&results.length<5){
    let href=decodeHtml(m[1]), title=decodeHtml(m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
    if(href.startsWith('//'))href='https:'+href;
    try{const u=new URL(href);if(u.hostname.includes('duckduckgo.com')&&u.searchParams.has('uddg'))href=decodeURIComponent(u.searchParams.get('uddg'));}catch(_){}
    try{const u=new URL(href);if(!/^https?:$/.test(u.protocol))continue;if(source.domain&&!u.hostname.toLowerCase().endsWith(source.domain))continue;if(key==='shopping'&&!/\/shopping\//i.test(u.pathname))continue;}catch(_){continue;}
    if(title&&href&&!results.some(x=>x.url===href))results.push({title,url:href});
  }
  if(results.length)return {ok:true,results};
  if(/no results|no search results|did not match any documents/i.test(html))return {ok:true,results:[]};
  return {ok:false,reason:'Không nhận được kết quả đọc được từ nguồn tìm kiếm.'};
}
async function searchOneSource(query, key){
  const source=MARKET_SOURCES[key]; if(!source)return {source:key,status:'unverified',message:'Nguồn không hợp lệ.'};
  const searchText=source.searchPrefix ? source.searchPrefix+query : source.domain ? 'site:'+source.domain+' '+query : query;
  const searchUrl=source.url(query);
  try{
    const url='https://html.duckduckgo.com/html/?q='+encodeURIComponent(searchText);
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),9000);
    const response=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; MatchMaAudit/1.0; +https://matchma-web.onrender.com)','accept-language':'vi-VN,vi;q=0.9,en;q=0.7'},signal:controller.signal});
    clearTimeout(timer);
    if(!response.ok)return {source:key,name:source.name,status:'unverified',message:'Nguồn tìm kiếm trả lỗi HTTP '+response.status,searchUrl};
    const parsed=parseDdgResults(await response.text(),source);
    if(!parsed.ok)return {source:key,name:source.name,status:'unverified',message:parsed.reason,searchUrl};
    return {source:key,name:source.name,status:parsed.results.length?'found':'not_found',message:parsed.results.length?'Tìm thấy kết quả được lập chỉ mục':'Không thấy kết quả trong lần tìm kiếm này',searchUrl,productUrl:parsed.results[0]?.url||'',productTitle:parsed.results[0]?.title||'',results:parsed.results};
  }catch(e){return {source:key,name:source.name,status:'unverified',message:e.name==='AbortError'?'Quá thời gian chờ nguồn tìm kiếm.':'Không kết nối được nguồn tìm kiếm.',searchUrl};}
}
app.post('/api/platform-audit',async(req,res)=>{
  const query=String(req.body?.query||'').trim();
  const sources=Array.isArray(req.body?.sources)?req.body.sources.filter(k=>MARKET_SOURCES[k]):Object.keys(MARKET_SOURCES);
  if(!query)return res.status(400).json({ok:false,error:'Thiếu tên sản phẩm cần tìm.'});
  if(query.length>300)return res.status(400).json({ok:false,error:'Tên sản phẩm quá dài.'});
  const results=await Promise.all(sources.map(key=>searchOneSource(query,key)));
  res.set('Cache-Control','no-store');
  res.json({ok:true,query,checkedAt:new Date().toISOString(),results});
});

app.get(['/','/index.html'],(req,res,next)=>{
  fs.readFile(path.join(__dirname,'public','index.html'),'utf8',(err,html)=>{
    if(err)return next(err);
    // Keep exactly one copy of each theme asset. Old duplicate copies caused
    // multiple observers and conflicting theme/logo mutations on page startup.
    html=html.replace(/<link rel="stylesheet" href="\/winter-theme\.css\?v=\d+">/g,'');
    html=html.replace(/<script src="\/winter-theme\.js\?v=\d+"><\/script>/g,'');
    html=html.replace('</head>','<link rel="stylesheet" href="/winter-theme.css?v=25"></head>');
    html=html.replace('</body>','<script src="/winter-theme.js?v=21"></script></body>');
    res.set('Cache-Control','no-cache, no-store, must-revalidate');
    res.type('html').send(html);
  });
});

app.use(express.static(path.join(__dirname,'public')));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,'0.0.0.0',()=>console.log('MatchMa listening on '+PORT));
