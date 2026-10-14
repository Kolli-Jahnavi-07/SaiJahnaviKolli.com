// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Lineage: send one record through the pipeline after the page loads.
// CSS handles the motion and skips it when the visitor prefers reduced motion.
const lineage = document.querySelector(".lineage");
if (lineage) {
  window.addEventListener("load", () => {
    requestAnimationFrame(() => lineage.classList.add("is-running"));
  });
}
