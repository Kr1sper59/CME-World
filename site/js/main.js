// Отключаем все анимации и hover эффекты для вкладок + добавляем кнопки копирования
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
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
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                    copyButton.classList.add('copied');
                    
                    // Возвращаем обратно через 2 секунды
                    setTimeout(function() {
                        copyButton.innerHTML = `
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
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
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                    `;
                    copyButton.classList.add('copied');
                    
                    setTimeout(function() {
                        copyButton.innerHTML = `
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                            </svg>
                        `;
                        copyButton.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }, 500);
});
