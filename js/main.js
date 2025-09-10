document.addEventListener("DOMContentLoaded", function() {
    const footer = document.querySelector(".md-footer");
    if (footer) {
        footer.querySelectorAll("*").forEach(el => {
            if (el.textContent.includes("Made with Material")) {
                el.style.display = "none";
            }
        });
    }
});
