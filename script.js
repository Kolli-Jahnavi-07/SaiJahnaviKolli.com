function jumpTo(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-jump]").forEach(btn => {
  btn.addEventListener("click", () => jumpTo(btn.getAttribute("data-jump")));
});

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

(function(){
  const pipelineEl = document.getElementById('cssPipeline');
  if(!pipelineEl) return;

 const stages = [
  { icon: '⬛', label: 'INGEST' },
  { icon: '🔀', label: 'TRANSFORM' },
  { icon: '⚗️', label: 'VALIDATE' },
  { icon: '🧮', label: 'CURATE' },
  { icon: '📦', label: 'SERVE' },
];

  stages.forEach((s, i) => {
    const stageEl = document.createElement('div');
    stageEl.className = 'cp-stage';
    stageEl.innerHTML = `
      <div class="cp-box" id="cpbox-${i}">
        <div class="cp-icon">${s.icon}</div>
        <div class="cp-label">${s.label}</div>
      </div>
    `;
    pipelineEl.appendChild(stageEl);

    if (i < stages.length - 1) {
      const con = document.createElement('div');
      con.className = 'cp-connector';
      con.id = `cpcon-${i}`;
      pipelineEl.appendChild(con);
    }
  });

  let activeStage = 0;

  function activateStage(idx) {
    stages.forEach((_, i) => document.getElementById(`cpbox-${i}`).classList.remove('active'));
    document.querySelectorAll('.cp-connector').forEach(c => c.classList.remove('flowing'));
    document.getElementById(`cpbox-${idx}`).classList.add('active');
    if (idx > 0) document.getElementById(`cpcon-${idx-1}`)?.classList.add('flowing');
  }

  activateStage(0);
  setInterval(() => {
    activeStage = (activeStage + 1) % stages.length;
    activateStage(activeStage);
  }, 1400);
})();
