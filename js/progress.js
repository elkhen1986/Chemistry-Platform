function initProgress(options = {}) {
    const cfg = {
        defaultPage: options.defaultPage || 'home',
        storageKey: options.storageKey || 'chem_progress',
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
        const data = { pageId, scrollY: window.scrollY, ts: Date.now() };
        localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    }

    function load() {
        try { return JSON.parse(localStorage.getItem(cfg.storageKey)); } catch { return null; }
    }

    function restore() {
        const data = load();
        if (data && data.pageId) {
            if (typeof window.showPage === 'function') {
                window.showPage(data.pageId);
            } else {
                document.querySelectorAll(cfg.pageSelector).forEach(p => p.classList.remove(cfg.activeClass));
                document.getElementById(data.pageId)?.classList.add(cfg.activeClass);
            }
            setTimeout(() => window.scrollTo(0, data.scrollY || 0), 150);
        }
    }

    function wrapShowPage() {
        if (typeof window.showPage === 'function' && !window.showPage.__wrapped) {
            const orig = window.showPage;
            window.showPage = function(id) {
                const r = orig.apply(this, arguments);
                setTimeout(save, 50);
                return r;
            };
            window.showPage.__wrapped = true;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateLayout();
        wrapShowPage();
        restore();

        let t;
        window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(save, 300); });
        window.addEventListener('beforeunload', save);
        window.addEventListener('resize', updateLayout);
        if ('ResizeObserver' in window) {
            const hdr = document.querySelector(cfg.headerSelector);
            if (hdr) new ResizeObserver(updateLayout).observe(hdr);
        }

        if (typeof window.showPage !== 'function') {
            const obs = new MutationObserver(() => save());
            document.querySelectorAll(cfg.pageSelector).forEach(p => obs.observe(p, { attributes: true, attributeFilter: ['class'] }));
        }
    });
}