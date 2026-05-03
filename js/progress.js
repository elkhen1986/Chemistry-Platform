function initProgress(options = {}) {
    const cfg = {
        defaultPage: options.defaultPage || 'home-page',
        storageKey: options.storageKey || 'chem_platform_v1',
        pageSelector: options.pageSelector || '.page-section',
        activeClass: options.activeClass || 'page-active',
        contentGap: options.contentGap || 24,
        headerSelector: 'header.fixed-nav',
        footerSelector: 'footer.fixed-footer'
    };

    function updateLayout() {
        const h = document.querySelector(cfg.headerSelector);
        const f = document.querySelector(cfg.footerSelector);
        if (h) document.documentElement.style.setProperty('--header-height', h.offsetHeight + 'px');
        if (f) document.documentElement.style.setProperty('--footer-height', f.offsetHeight + 'px');
        document.documentElement.style.setProperty('--content-gap', cfg.contentGap + 'px');
    }

    function getActivePage() {
        const el = document.querySelector(`${cfg.pageSelector}.${cfg.activeClass}`);
        return el ? el.id : null;
    }

    function save() {
        const pageId = getActivePage() || cfg.defaultPage;
        try {
            localStorage.setItem(cfg.storageKey, JSON.stringify({ pageId, scrollY: window.scrollY, ts: Date.now() }));
            console.log('[progress] saved:', pageId);
        } catch(e) {}
    }

    function load() { try { return JSON.parse(localStorage.getItem(cfg.storageKey)); } catch { return null; } }

function restore() {
    const data = load();
    if (data && data.pageId) {
        setTimeout(() => {
            document.querySelectorAll(cfg.pageSelector).forEach(p => p.classList.remove(cfg.activeClass));
            document.getElementById(data.pageId)?.classList.add(cfg.activeClass);
            window.scrollTo(0, data.scrollY || 0);
            console.log('[progress] restored:', data.pageId);
        }, 400); // ← التأخير هو السر
    }
}

    function start() {
        updateLayout();
        restore();

        document.addEventListener('click', () => setTimeout(save, 150), true);
        window.addEventListener('scroll', () => { clearTimeout(window._psave); window._psave = setTimeout(save, 400); });
        window.addEventListener('beforeunload', save);
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
        window.addEventListener('popstate', save);
        window.addEventListener('hashchange', save);
        window.addEventListener('resize', updateLayout);

        const obs = new MutationObserver(save);
        document.querySelectorAll(cfg.pageSelector).forEach(p => obs.observe(p, { attributes: true, attributeFilter: ['class'] }));

        if ('ResizeObserver' in window) {
            const hdr = document.querySelector(cfg.headerSelector);
            if (hdr) new ResizeObserver(updateLayout).observe(hdr);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else { start(); }
}