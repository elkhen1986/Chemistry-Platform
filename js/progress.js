function initProgress(options = {}) {
    const cfg = {
        defaultPage: options.defaultPage || 'home',
        storageKey: options.storageKey || 'student_progress',
        pageSelector: options.pageSelector || '.page-section',
        activeClass: options.activeClass || 'page-active',
        triggerAttr: options.triggerAttr || 'data-target',
        contentGap: options.contentGap || 24,
        headerSelector: options.headerSelector || 'header.fixed-nav',
        footerSelector: options.footerSelector || 'footer.fixed-footer'
    };

    function updateLayoutVars() {
        const header = document.querySelector(cfg.headerSelector);
        const footer = document.querySelector(cfg.footerSelector);
        if (header) {
            document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
        }
        if (footer) {
            document.documentElement.style.setProperty('--footer-height', footer.offsetHeight + 'px');
        }
        document.documentElement.style.setProperty('--content-gap', cfg.contentGap + 'px');
    }

    function save(extra = {}) {
        const active = document.querySelector(`${cfg.pageSelector}.${cfg.activeClass}`);
        const data = {
            pageId: active ? active.id : cfg.defaultPage,
            scrollY: window.scrollY,
            ts: Date.now(),
            ...extra
        };
        localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    }

    function load() {
        try { return JSON.parse(localStorage.getItem(cfg.storageKey)); }
        catch (e) { return null; }
    }

    function showPage(pageId, saveAfter = true) {
        document.querySelectorAll(cfg.pageSelector).forEach(p => {
            p.classList.remove(cfg.activeClass);
        });
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.add(cfg.activeClass);
            window.scrollTo(0, 0);
            if (saveAfter) save();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateLayoutVars();

        const last = load();
        if (last && last.pageId && document.getElementById(last.pageId)) {
            showPage(last.pageId, false);
            setTimeout(() => window.scrollTo(0, last.scrollY || 0), 120);
        } else {
            showPage(cfg.defaultPage, false);
        }

        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(save, 250);
        });

        window.addEventListener('beforeunload', save);

        if ('ResizeObserver' in window) {
            const hdr = document.querySelector(cfg.headerSelector);
            if (hdr) new ResizeObserver(updateLayoutVars).observe(hdr);
        }
        window.addEventListener('resize', updateLayoutVars);
    });

    document.addEventListener('click', (e) => {
        const btn = e.target.closest(`[${cfg.triggerAttr}]`);
        if (btn) {
            const targetId = btn.getAttribute(cfg.triggerAttr);
            if (targetId) {
                e.preventDefault();
                showPage(targetId);
            }
        }
    });

    return { showPage, save, load };
}