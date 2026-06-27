const iconMap = {
  flag: "⚑",
  ball: "⚽",
  paint: "🎨",
  hands: "🙌",
  shield: "☆"
};

const STORAGE_KEY = "zelenye-gorki-rating";

let state = null;

async function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const res = await fetch("./data.json", { cache: "no-store" });
  return await res.json();
}

function render(data) {
  state = data;
  document.getElementById("subtitle").textContent = data.subtitle;
  document.getElementById("updated").textContent = data.updated;

  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";

  [...data.ranking]
    .sort((a, b) => Number(a.place) - Number(b.place))
    .forEach((item) => {
      const row = document.createElement("article");
      row.className = "rank-row";
      row.innerHTML = `
        <div class="place"><span class="badge">${item.place}</span></div>
        <div class="detachment"><strong>${escapeHtml(item.name)}</strong></div>
        <div class="leader">${escapeHtml(item.leader || "—")}</div>
        <div class="score">${Number(item.score)}</div>
      `;
      rankingList.appendChild(row);
    });

  const criteriaList = document.getElementById("criteriaList");
  criteriaList.innerHTML = "";
  data.criteria.forEach((item) => {
    const card = document.createElement("article");
    card.className = "criteria-item";
    card.innerHTML = `
      <div class="icon">${iconMap[item.icon] || "✓"}</div>
      <div class="criteria-name">${escapeHtml(item.name)}</div>
      <div class="criteria-value">${Number(item.value)}</div>
    `;
    criteriaList.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      render(JSON.parse(event.newValue));
    } catch (error) {
      console.error(error);
    }
  }
});

loadData().then(render).catch((error) => {
  console.error(error);
  document.getElementById("rankingList").innerHTML = "<p>Не удалось загрузить данные рейтинга.</p>";
});
