window.addEventListener('load', () => {
    const main = document.querySelector('.md-main');
    const sidebarPrimary = document.querySelector('.md-sidebar--primary');
    const sidebarSecondary = document.querySelector('.md-sidebar--secondary');

    const vh = window.innerHeight;
    main.style.minHeight = vh + 'px';
    if(sidebarPrimary) sidebarPrimary.style.height = (vh - 60) + 'px';
    if(sidebarSecondary) sidebarSecondary.style.height = (vh - 60) + 'px';
});
