// Отключаем все анимации и hover эффекты для вкладок + добавляем кнопки копирования
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Подсветка активной верхней вкладки (таба) + автообновление
        (function setupActiveTopTabHighlighting() {
            const TABS_SELECTOR = '.md-tabs';
            const LINK_SELECTOR = '.md-tabs__link';

            const normalizePath = (p) => {
                try {
                    // Обрабатываем '.', './', относительные ссылки и index.html
                    if (p === '.' || p === './') p = '/';
                    const url = new URL(p, window.location.origin + window.location.pathname);
                    let pathname = url.pathname;
                    if (pathname.endsWith('/index.html')) pathname = pathname.slice(0, -('/index.html'.length));
                    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
                    return pathname || '/';
                } catch (_) {
                    return p || '/';
                }
            };

            const applyHighlight = () => {
                const container = document.querySelector(TABS_SELECTOR);
                if (!container) return;
                const links = Array.from(container.querySelectorAll(LINK_SELECTOR));
                if (!links.length) return;

                const currentPath = normalizePath(window.location.pathname);

                links.forEach(a => {
                    a.classList.remove('md-tabs__link--active');
                    const li = a.closest('li');
                    if (li) li.classList.remove('md-tabs__item--active');
                });

                let best = null;
                let bestLen = -1;
                links.forEach(a => {
                    let href = a.getAttribute('href') || '#';
                    if (href === '#') return;
                    const linkPath = normalizePath(href);
                    if (linkPath === '/' && currentPath === '/') {
                        if (1 > bestLen) { best = a; bestLen = 1; }
                        return;
                    }
                    if (linkPath !== '/' && (currentPath === linkPath || currentPath.startsWith(linkPath + '/'))) {
                        if (linkPath.length > bestLen) { best = a; bestLen = linkPath.length; }
                    }
                });

                if (best) {
                    best.classList.add('md-tabs__link--active');
                    const li = best.closest('li');
                    if (li) li.classList.add('md-tabs__item--active');
                }
            };

            // Первичный запуск и повтор на случай отложенной отрисовки
            applyHighlight();
            setTimeout(applyHighlight, 100);
            setTimeout(applyHighlight, 400);

            // Наблюдатель за вкладками (на случай динамических изменений темы)
            const tabsNode = document.querySelector(TABS_SELECTOR);
            if (tabsNode) {
                const mo = new MutationObserver(() => applyHighlight());
                mo.observe(tabsNode, { childList: true, subtree: true, attributes: true });
            }
        })();

        // Отключаем анимации для вкладок
        const tabLinks = document.querySelectorAll('.md-tabs__link');
        
        tabLinks.forEach(function(link) {
            // Отключаем все анимации
            link.style.transition = 'none';
            link.style.transform = 'none';
            
            // Отключаем все hover эффекты
            link.addEventListener('mouseenter', function() {
                this.style.backgroundColor = this.style.backgroundColor;
                this.style.color = this.style.color;
                this.style.fontWeight = this.style.fontWeight;
                this.style.transform = 'none';
                this.style.transition = 'none';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.backgroundColor = this.style.backgroundColor;
                this.style.color = this.style.color;
                this.style.fontWeight = this.style.fontWeight;
                this.style.transform = 'none';
                this.style.transition = 'none';
            });
        });

        // Добавляем кнопки копирования для блоков кода
        const codeBlocks = document.querySelectorAll('pre code, .highlight pre');
        
        codeBlocks.forEach(function(block) {
            const pre = block.tagName === 'PRE' ? block : block.closest('pre');
            if (!pre) return;
            
            // Проверяем, нет ли уже кнопки
            if (pre.querySelector('.copy-button')) return;
            
            // Создаем кнопку с SVG иконкой как на GitHub
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.setAttribute('aria-label', 'Копировать код в буфер обмена');
            
            // SVG иконка копирования (как на GitHub)
            copyButton.innerHTML = `
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                </svg>
            `;
            
            // Добавляем кнопку в блок
            pre.appendChild(copyButton);
            
            // Функция для принудительного поддержания стилей кнопки
            function maintainButtonStyles() {
                if (!copyButton.classList.contains('copied')) {
                    copyButton.style.backgroundColor = 'transparent';
                    copyButton.style.color = '#7d8590';
                    copyButton.style.transform = 'none';
                    copyButton.style.boxShadow = 'none';
                }
            }
            
            // Принудительно поддерживаем стили при скролле
            pre.addEventListener('scroll', maintainButtonStyles);
            pre.addEventListener('wheel', maintainButtonStyles);
            pre.addEventListener('touchmove', maintainButtonStyles);
            
            // Обработчик клика
            copyButton.addEventListener('click', function() {
                const code = block.textContent || block.innerText;
                
                navigator.clipboard.writeText(code).then(function() {
                    // Показываем успех - меняем иконку на галочку
                    copyButton.innerHTML = `
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94л6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                    copyButton.classList.add('copied');
                    
                    // Возвращаем обратно через 2 секунды
                    setTimeout(function() {
                        copyButton.innerHTML = `
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75в7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Зм1.75-.25а.25.25 0 0 0-.25.25в7.5c0 .138.112.25.25.25h7.5а.25.25 0 0 0 .25-.25в-7.5а.25.25 0 0 0-.25-.25З"></path>
                            </svg>
                        `;
                        copyButton.classList.remove('copied');
                    }, 2000);
                }).catch(function() {
                    // Fallback для старых браузеров
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    // Показываем успех
                    copyButton.innerHTML = `
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06л-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94л6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                    copyButton.classList.add('copied');
                    
                    setTimeout(function() {
                        copyButton.innerHTML = `
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0в1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25З"></path>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75в7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Зм1.75-.25а.25.25 0 0 0-.25.25в7.5c0 .138.112.25.25.25h7.5а.25.25 0 0 0 .25-.25в-7.5а.25.25 0 0 0-.25-.25З"></path>
                            </svg>
                        `;
                        copyButton.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }, 500);
});
