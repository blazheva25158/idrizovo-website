// HAMBURGER
        document.getElementById('hamburger-btn').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('open');
        });
        document.getElementById('mobile-menu').querySelectorAll('a').forEach(l =>
            l.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('open'))
        );

        // SCROLL TO TOP
        const scrollBtn = document.getElementById('scrollTopBtn');
        window.addEventListener('scroll', () => {
            scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        // NOVOSTI DROPDOWN
        function toggleNovosti(e) {
            e.stopPropagation();
            const dd = document.getElementById('novosti-dropdown');
            const isOpen = dd.style.display === 'block';
            // close all dropdowns first
            document.getElementById('lang-dropdown').classList.remove('open');
            dd.style.display = isOpen ? 'none' : 'block';
        }
        document.addEventListener('click', () => {
            const dd = document.getElementById('novosti-dropdown');
            if (dd) dd.style.display = 'none';
        });

        // LANG DROPDOWN
        const langBtn = document.getElementById('lang-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('open');
        });
        document.addEventListener('click', () => langDropdown.classList.remove('open'));

        // LANGUAGE SWITCHER
        const langLabels = { mk: 'МК', sq: 'SQ', en: 'EN' };

        function setLang(lang) {
            localStorage.setItem('kpu-lang', lang);
            document.getElementById('lang-label').textContent = langLabels[lang];
            document.documentElement.lang = lang;

            document.querySelectorAll('[data-mk]').forEach(el => {
                const val = el.dataset[lang];
                if (!val) return;
                if (el.tagName === 'INPUT') {
                    el.value = val;
                } else {
                    el.textContent = val;
                }
            });

            langDropdown.classList.remove('open');
        }

        // Apply saved language on load
        const saved = localStorage.getItem('kpu-lang') || 'mk';
        if (saved !== 'mk') setLang(saved);