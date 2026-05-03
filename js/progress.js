
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

  // ===== منع الشاشة من النوم =====
  let wakeLock = null;
  async function keepAwake() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('[WAKE] الشاشة هتفضل شغالة');
        wakeLock.addEventListener('release', () => console.log('[WAKE] اتفصل'));
      }
    } catch(e) {}
  }
  // يشتغل مع أول لمسة (شرط المتصفح)
  document.addEventListener('click', keepAwake, { once: true });
  document.addEventListener('touchstart', keepAwake, { once: true });
  // لو رجع للصفحة بعد ما كان في تطبيق تاني
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !wakeLock) keepAwake();
  });

// ===== زرار PDF - طباعة مباشرة =====
(function(){
  // اعمل الزرار
  let pdfBtn = document.getElementById('pdfBtn');
  if(!pdfBtn){
    pdfBtn = document.createElement('button');
    pdfBtn.id = 'pdfBtn';
    pdfBtn.textContent = '📄 حفظ PDF';
    pdfBtn.style.cssText = 'position:fixed;bottom:85px;right:18px;z-index:99999;background:#198754;color:white;border:none;padding:12px 20px;border-radius:30px;font-size:15px;box-shadow:0 3px 10px rgba(0,0,0,0.3);cursor:pointer;display:none;';
    document.body.appendChild(pdfBtn);
  }

  pdfBtn.addEventListener('click', () => {
    const lesson = document.querySelector('.page-section.page-active');
    if(!lesson || lesson.id === 'home-page'){
      alert('افتح الدرس الأول');
      return;
    }
    // خلي الجسم يطبع الدرس بس
    document.body.classList.add('printing');
    window.print();
    setTimeout(()=> document.body.classList.remove('printing'), 1000);
  });

  // اظهر/اخفي الزرار
  function updateBtn(){
    const active = document.querySelector('.page-section.page-active');
    pdfBtn.style.display = (active && active.id !== 'home-page') ? 'block' : 'none';
  }
  setInterval(updateBtn, 800);
})();