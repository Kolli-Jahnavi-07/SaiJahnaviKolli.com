// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------
   Theme toggle (follows the system until the visitor picks one)
   ------------------------------------------------------------ */
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
}
function syncThemeButton() {
  if (!themeBtn) return;
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
  themeBtn.dataset.current = currentTheme();
}
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeButton();
  });
  systemDark.addEventListener("change", syncThemeButton);
  syncThemeButton();
}

/* ------------------------------------------------------------
   Lineage: run the record through the pipeline, and show
   the work behind each stage on selection
   ------------------------------------------------------------ */
const lineage = document.querySelector(".lineage");
const runBtn = document.getElementById("run-pipeline");
const detail = document.getElementById("stage-detail");

function runPipeline() {
  if (!lineage) return;
  lineage.classList.remove("is-running");
  void lineage.offsetWidth; // restart the CSS animation
  lineage.classList.add("is-running");
}
if (lineage) {
  window.addEventListener("load", () => requestAnimationFrame(runPipeline));
}
if (runBtn) runBtn.addEventListener("click", runPipeline);

const STAGES = {
  sources: {
    title: "Sources",
    text: "The raw material: auto loan and payment records at GM Financial, production, quality, and supply chain data at Reliance, and event streams through Kafka.",
    tools: "Operational databases, flat files, Kafka topics",
    where: "GM Financial, Reliance Industries",
  },
  ingest: {
    title: "Ingest",
    text: "Getting data in continuously and safely. Snowpipe loads files into Snowflake as they land, Azure Data Factory runs integration workflows across clouds, and Kafka carries streaming events.",
    tools: "Snowpipe, Azure Data Factory, Apache Kafka",
    where: "GM Financial, Cloud data integration project",
  },
  transform: {
    title: "Transform",
    text: "PySpark and Spark SQL jobs clean, join, and reshape data for analytics. At GM Financial I restructured queries and tuned transformations, making Spark processing 35% faster.",
    tools: "Python, PySpark, Spark SQL, Azure Databricks",
    where: "GM Financial, Reliance Industries",
  },
  store: {
    title: "Model & store",
    text: "Dimensional models in Snowflake, kept current with Streams and Tasks for incremental (CDC) loads instead of full reloads, with storage and compute tuned for reporting.",
    tools: "Snowflake, Streams, Tasks, CDC, dimensional modeling",
    where: "GM Financial, Snowflake data engineering project",
  },
  serve: {
    title: "Serve",
    text: "Curated, trusted datasets behind portfolio performance and risk reporting at GM Financial, and KPI dashboards for plant and supply chain operations at Reliance.",
    tools: "Snowflake marts, Power BI, Tableau",
    where: "GM Financial, Reliance Industries",
  },
  orchestrate: {
    title: "Orchestrate & ship",
    text: "Airflow and scheduling tools run recurring workflows without manual effort, cutting it by 50% at Reliance. Git-based CI/CD and automated tests gate every pipeline release.",
    tools: "Apache Airflow, Git, CI/CD, automated testing",
    where: "Reliance Industries, GM Financial",
  },
};

const stageButtons = document.querySelectorAll("[data-stage]");

function selectStage(key) {
  const info = STAGES[key];
  if (!info || !detail) return;
  stageButtons.forEach((b) => {
    const on = b.dataset.stage === key;
    b.setAttribute("aria-pressed", String(on));
    b.classList.toggle("is-selected", on);
  });
  detail.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = info.title;
  const p = document.createElement("p");
  p.textContent = info.text;
  const dl = document.createElement("dl");
  [["Tools", info.tools], ["Where", info.where]].forEach(([k, v]) => {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    row.append(dt, dd);
    dl.append(row);
  });
  detail.append(h, p, dl);
  detail.classList.add("has-content");
}

stageButtons.forEach((b) =>
  b.addEventListener("click", () => selectStage(b.dataset.stage))
);

/* ------------------------------------------------------------
   Tool filter: highlight where each tool shows up
   ------------------------------------------------------------ */
const chips = document.querySelectorAll("[data-filter]");
const tagged = document.querySelectorAll("#work [data-tools], #projects [data-tools]");
const status = document.getElementById("filter-status");

function applyFilter(tool) {
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === tool)));
  let count = 0;
  tagged.forEach((el) => {
    const match = tool === "all" || el.dataset.tools.split(" ").includes(tool);
    el.classList.toggle("is-match", tool !== "all" && match);
    el.classList.toggle("is-dimmed", !match);
    if (tool !== "all" && match) count++;
  });
  document.body.classList.toggle("is-filtering", tool !== "all");
  if (status) {
    const chip = [...chips].find((c) => c.dataset.filter === tool);
    status.textContent = tool === "all"
      ? ""
      : `${count} ${count === 1 ? "place" : "places"} in my work and projects use ${chip ? chip.textContent : tool}.`;
  }
}

chips.forEach((c) => c.addEventListener("click", () => applyFilter(c.dataset.filter)));
