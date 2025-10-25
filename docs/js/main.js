document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".md-sidebar__scrollwrap");
  const header = document.querySelector(".md-header");
  const footer = document.querySelector("footer.md-footer");

  function adjustSidebarHeight() {
    if (!sidebar) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    const pageHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;

    // Если контент меньше, чем окно, не скроллим сайдбар зря
    const availableHeight = Math.min(pageHeight, viewportHeight) - headerHeight - footerHeight;

    sidebar.style.top = `${headerHeight}px`;
    sidebar.style.height = `${availableHeight}px`;
  }

  // Запускаем сразу и при изменении размера окна
  adjustSidebarHeight();
  window.addEventListener("resize", adjustSidebarHeight);
  window.addEventListener("scroll", adjustSidebarHeight);
});
