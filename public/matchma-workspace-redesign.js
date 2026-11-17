/* MatchMã horizontal workspace navigation — delegates to existing page buttons only. */
(()=>{
 const start=()=>{
  const header=document.querySelector('.app-header'),sidebar=document.getElementById('appSidebar');
  if(!header||!sidebar||document.getElementById('mmWorkspaceNav'))return;
  const shell=document.createElement('nav');shell.id='mmWorkspaceNav';shell.setAttribute('aria-label','Điều hướng không gian làm việc');
  const groups=[];
  const addGroup=(label,emoji,buttons)=>{
   if(!buttons.length)return;
   const d=document.createElement('details');d.className='mm-nav-group';
   const summary=document.createElement('summary');
   const ic=document.createElement('span');ic.className='mm-nav-group-icon';ic.textContent=emoji;
   const txt=document.createElement('span');txt.textContent=label;
   summary.append(ic,txt);d.append(summary);
   const menu=document.createElement('div');menu.className='mm-nav-menu';
   buttons.forEach(b=>{
    const page=b.dataset.page;if(!page)return;
    const a=document.createElement('button');a.type='button';a.className='mm-nav-link';a.dataset.page=page;
    const icon=document.createElement('span');icon.className='mm-nav-link-icon';
    const source=b.querySelector('.navicon');icon.innerHTML=(source?.innerHTML||'').trim()||'✿';
    const name=document.createElement('span');name.textContent=(b.querySelector('[data-i18n]')?.textContent||b.querySelector('span:last-child')?.textContent||b.textContent||'').trim();
    a.append(icon,name);a.addEventListener('click',()=>{b.click();d.open=false;});
    menu.append(a);
   });
   d.append(menu);groups.push({node:d,pages:buttons.map(b=>b.dataset.page)});return d;
  };
  const top=document.createElement('div');top.className='mm-nav-shell';
  const mark=document.createElement('div');mark.className='mm-nav-mark';mark.innerHTML='<span>🌸</span><span>WORKSPACE</span>';
  const items=document.createElement('div');items.className='mm-nav-items';
  const direct=sel=>[...sidebar.querySelectorAll('.navbtn[data-page],.sidebar-account-shortcut[data-page]')].filter(b=>sel.includes(b.dataset.page));
  const sections=[
   ['Bắt đầu','🏠',direct(['intro','overview','workspace'])],
   ...[...sidebar.querySelectorAll('.nav-folder[data-nav-group]')].map(g=>[(g.querySelector('summary')?.textContent||'Công cụ').replace('⌄','').trim(),'🌿',[...g.querySelectorAll('.navbtn[data-page]')]]),
   ['Nghiệp vụ','📊',direct(['debitcredit','invoicecompare','stockforecast'])],
   ['Cá nhân','🌷',direct(['account','settings'])]
  ];
  sections.forEach(([label,emoji,buttons])=>{const d=addGroup(label,emoji,buttons);if(d)items.append(d)});
  const tools=document.createElement('div');tools.className='mm-nav-tools';
  const collapse=document.createElement('button');collapse.type='button';collapse.title='Thu gọn / mở rộng menu bên';collapse.setAttribute('aria-label',collapse.title);collapse.textContent='☰';
  collapse.addEventListener('click',()=>document.getElementById('sidebarCollapseToggle')?.click());
  tools.append(collapse);
  top.append(mark,items,tools);shell.append(top);header.insertAdjacentElement('afterend',shell);
  const sync=()=>{
   const active=document.querySelector('.page.active')?.id.replace(/^page-/,'')||sidebar.querySelector('.navbtn.active[data-page]')?.dataset.page||'intro';
   groups.forEach(g=>{
    const current=g.pages.includes(active);g.node.classList.toggle('mm-current',current);
    g.node.querySelectorAll('.mm-nav-link').forEach(a=>{
     const yes=a.dataset.page===active;a.toggleAttribute('aria-current',yes);
     if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
   });
  };
  new MutationObserver(sync).observe(document.querySelector('.main')||sidebar,{subtree:true,attributes:true,attributeFilter:['class']});new MutationObserver(sync).observe(sidebar,{subtree:true,attributes:true,attributeFilter:['class']});sync();
  try{if(localStorage.getItem('matchma-sidebar-collapsed')===null)document.getElementById('sidebarCollapseToggle')?.click()}catch(e){}
  document.addEventListener('click',e=>{if(!shell.contains(e.target))shell.querySelectorAll('details[open]').forEach(d=>d.open=false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')shell.querySelectorAll('details[open]').forEach(d=>d.open=false)});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();