
(function(){
  const KEY = 'chem_platform_v1';
  const PAGE_SEL = '.page-section';
  const ACTIVE = 'page-active';
  const HOME_ID = 'home-page';

  function getActive(){ const el = document.querySelector(PAGE_SEL+'.'+ACTIVE); return el ? el.id : null; }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify({id:getActive()||HOME_ID, y:window.scrollY, t:Date.now()})); }catch{} }
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch{ return {}; } }

  function forceShow(id, y){
    document.querySelectorAll(PAGE_SEL).forEach(p=>p.classList.remove(ACTIVE));
    const t = document.getElementById(id);
    if(t){ t.classList.add(ACTIVE); setTimeout(()=>window.scrollTo(0,y||0),50); console.log('[PROGRESS] ÙØªØ­:',id); }
  }

  function restore(){
    const d = load();
    if(d.id && d.id !== HOME_ID && document.getElementById(d.id)){
      let tries=0; const iv=setInterval(()=>{ forceShow(d.id,d.y); if(++tries>6)clearInterval(iv); },500);
    }
  }

  window.addEventListener('load', ()=>{ setTimeout(restore, 200); });

  document.addEventListener('click', ()=>setTimeout(save,100), true);
  window.addEventListener('scroll', ()=>{ clearTimeout(window._sv); window._sv=setTimeout(save,300); });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden') save(); });

  const obs = new MutationObserver(()=>{
    const d=load(); const cur=getActive();
    if(d.id && d.id!==HOME_ID && cur===HOME_ID){ forceShow(d.id,d.y); }
  });
  document.querySelectorAll(PAGE_SEL).forEach(p=>obs.observe(p,{attributes:true,attributeFilter:['class']}));
})();