// حفظ آخر مكان بالظبط
const STORAGE_KEY = 'chem_progress_v1';

function saveProgress(pageId) {
  const data = {
    page: pageId,
    scroll: window.scrollY,      // مكان السكرول بالبكسل
    time: Date.now(),            // وقت الزيارة
    url: location.href
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return null;
    // امسح بعد 30 يوم
    if (Date.now() - data.time > 30*24*60*60*1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch { return null; }
}

function navigateTo(id, save = true) {
  // احفظ الحالي قبل ما تمشي
  const current = document.querySelector('.page-section.page-active');
  if (current && save) saveProgress(current.id);

  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('page-active'));

  const show = (el) => {
    el.classList.add('page-active');
    if (save) {
      saveProgress(id);
      history.pushState({page:id}, '', `#${id}`);
    }
  };

  let target = document.getElementById(id);
  if (target) return show(target);

  // تحميل الصفحة من مجلد pages
  fetch(`pages/${id}.html`)
    .then(r => r.text())
    .then(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.querySelector('main').appendChild(temp.firstElementChild);
      navigateTo(id, save);
    });
}

// حفظ السكرول أثناء القراءة
window.addEventListener('scroll', () => {
  clearTimeout(window._scrollTimer);
  window._scrollTimer = setTimeout(() => {
    const active = document.querySelector('.page-section.page-active');
    if (active) saveProgress(active.id);
  }, 500);
});

// عند فتح الموقع
document.addEventListener('DOMContentLoaded', () => {
  const progress = loadProgress();
  const initial = location.hash.slice(1) || progress?.page || 'home-page';
  
  navigateTo(initial, false);

  // رجّع السكرول بالظبط
  if (progress && progress.page === initial) {
    setTimeout(() => window.scrollTo(0, progress.scroll), 400);
  }

  // زر "أكمل من حيث توقفت"
  if (progress && progress.page !== 'home-page') {
    const mins = Math.floor((Date.now() - progress.time)/60000);
    document.getElementById('continue-container').innerHTML = `
      <div onclick="navigateTo('${progress.page}')" class="glass-card mb-6">
        <i class="fas fa-play text-sky-400"></i>
        أكمل: ${progress.page} - منذ ${mins} دقيقة
      </div>`;
  }
});

// حفظ عند الخروج
window.addEventListener('beforeunload', () => {
  const active = document.querySelector('.page-section.page-active');
  if (active) saveProgress(active.id);
});