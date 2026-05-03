       function navigateTo(id) {
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('page-active'));
            document.getElementById(id).classList.add('page-active');
            window.scrollTo(0,0);
        }
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    updateIcon(next);
}

function updateIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    setTimeout(() => updateIcon(saved), 100);
}

function fixLayoutSpacing() {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (header) {
        document.documentElement.style.setProperty(
            "--header-height",
            header.offsetHeight + "px"
        );
    }

    if (footer) {
        document.documentElement.style.setProperty(
            "--footer-height",
            footer.offsetHeight + "px"
        );
    }
}

