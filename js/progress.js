
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

  // ===== زرار PDF =====
function downloadPDF() {
  const lesson = document.querySelector('.page-section.page-active');
  if (!lesson) return alert('افتح درس أولاً');
  
  const title = lesson.querySelector('h1, h2')?.innerText || lesson.id;
  
  // انسخ الدرس عشان نشيل الأزرار منه قبل الطباعة
  const clone = lesson.cloneNode(true);
  clone.querySelectorAll('button, .pdf-btn, header, footer').forEach(el => el.remove());
  
  const opt = {
    margin:       0.5,
    filename:     `${title}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(clone).save();
  console.log('[PDF] جاري التحميل:', title);
}

// ===== زرار PDF عايم =====
function downloadPDF() {
  const lesson = document.querySelector('.page-section.page-active');
  if (!lesson || lesson.id === 'home-page') return alert('افتح درس أولاً');
  
  const title = lesson.querySelector('h1, h2')?.innerText?.trim() || lesson.id;
  console.log('[PDF] بجهز:', title);
  
  const clone = lesson.cloneNode(true);
  clone.querySelectorAll('button, header, footer, nav').forEach(el => el.remove());
  clone.style.padding = '20px';
  clone.style.background = 'white';
  
  const opt = {
    margin: 10,
    filename: title + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(clone).save();
}

// اعمل الزرار مرة واحدة
if (!document.getElementById('pdfFloatBtn')) {
  const btn = document.createElement('button');
  btn.id = 'pdfFloatBtn';
  btn.innerHTML = '📄 PDF';
  btn.onclick = downloadPDF;
  btn.style.cssText = 'position:fixed;bottom:90px;right:20px;z-index:9999;background:#0d6efd;color:#fff;border:none;padding:12px 18px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-size:16px;cursor:pointer;display:none;';
  document.body.appendChild(btn);
  
  // اظهره بس لما تكون جوا درس
  setInterval(() => {
    const active = document.querySelector('.page-section.page-active');
    btn.style.display = (active && active.id !== 'home-page') ? 'block' : 'none';
  }, 500);
}