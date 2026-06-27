const iconMap = {
  flag: "⚑",
  ball: "⚽",
  paint: "🎨",
  hands: "🙌",
  shield: "☆"
};

let state = null;

async function loadData() {
  const res = await fetch("./data.json", { cache: "no-store" });
  return await res.json();
}

function render(data) {
  document.querySelectorAll("[data-field='campName']").forEach((el) => el.textContent = data.campName || "Зелёные горки");
  document.querySelectorAll("[data-field='shift']").forEach((el) => el.textContent = data.shift || "2 смена");
  document.querySelectorAll("[data-field='title']").forEach((el) => el.textContent = data.title || "Рейтинг деятельности отрядов");
  document.querySelectorAll("[data-field='subtitle']").forEach((el) => el.textContent = data.subtitle || "Промежуточные результаты");
  document.querySelectorAll("[data-field='updated']").forEach((el) => el.textContent = data.updated || "");

  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";

  [...data.ranking]
    .sort((a, b) => Number(a.place) - Number(b.place))
    .forEach((item) => {
      const row = document.createElement("article");
      row.className = "rank-row";
      row.innerHTML = `
        <div class="place"><span class="badge">${Number(item.place)}</span></div>
        <div class="detachment"><strong>${escapeHtml(item.name)}</strong></div>
        <div class="counselors">${escapeHtml(item.counselors || "—")}</div>
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

function fillEditor(data) {
  state = structuredClone(data);

  document.getElementById("campNameInput").value = data.campName || "";
  document.getElementById("shiftInput").value = data.shift || "";
  document.getElementById("titleInput").value = data.title || "";
  document.getElementById("subtitleInput").value = data.subtitle || "";
  document.getElementById("updatedInput").value = data.updated || "";

  const rankingEditor = document.getElementById("rankingEditor");
  rankingEditor.innerHTML = "";

  data.ranking.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "editor-card";
    card.innerHTML = `
      <div class="editor-title">Отряд ${index + 1}</div>
      <div class="editor-grid">
        <label>Место
          <input type="number" min="1" data-type="ranking" data-index="${index}" data-field="place" value="${Number(item.place)}">
        </label>
        <label>Отряд
          <input type="text" data-type="ranking" data-index="${index}" data-field="name" value="${escapeAttr(item.name)}">
        </label>
        <label>Вожатые
          <input type="text" data-type="ranking" data-index="${index}" data-field="counselors" value="${escapeAttr(item.counselors || "")}">
        </label>
        <label>Баллы
          <input type="number" min="0" data-type="ranking" data-index="${index}" data-field="score" value="${Number(item.score)}">
        </label>
      </div>
    `;
    rankingEditor.appendChild(card);
  });

  const criteriaEditor = document.getElementById("criteriaEditor");
  criteriaEditor.innerHTML = "";

  data.criteria.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "editor-card";
    card.innerHTML = `
      <div class="editor-title">Критерий ${index + 1}</div>
      <div class="criteria-editor-grid">
        <label>Название
          <input type="text" data-type="criteria" data-index="${index}" data-field="name" value="${escapeAttr(item.name)}">
        </label>
        <label>Баллы
          <input type="number" min="0" data-type="criteria" data-index="${index}" data-field="value" value="${Number(item.value)}">
        </label>
      </div>
    `;
    criteriaEditor.appendChild(card);
  });
}

function collectData() {
  const data = structuredClone(state);

  data.campName = document.getElementById("campNameInput").value.trim();
  data.shift = document.getElementById("shiftInput").value.trim();
  data.title = document.getElementById("titleInput").value.trim();
  data.subtitle = document.getElementById("subtitleInput").value.trim();
  data.updated = document.getElementById("updatedInput").value.trim();

  document.querySelectorAll("[data-type='ranking']").forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    data.ranking[index][field] = ["place", "score"].includes(field)
      ? Number(input.value)
      : input.value.trim();
  });

  document.querySelectorAll("[data-type='criteria']").forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    data.criteria[index][field] = field === "value" ? Number(input.value) : input.value.trim();
  });

  data.ranking.sort((a, b) => Number(a.place) - Number(b.place));
  return data;
}

function downloadJson() {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function sortByScores() {
  const data = collectData();
  data.ranking
    .sort((a, b) => Number(b.score) - Number(a.score))
    .forEach((item, index) => item.place = index + 1);

  state = data;
  fillEditor(data);
  render(data);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

document.getElementById("adminForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = collectData();
  state = data;
  render(data);
  fillEditor(data);
});

document.getElementById("downloadBtn").addEventListener("click", downloadJson);
document.getElementById("sortBtn").addEventListener("click", sortByScores);

document.getElementById("resetBtn").addEventListener("click", async () => {
  const data = await loadData();
  fillEditor(data);
  render(data);
});

loadData()
  .then((data) => {
    fillEditor(data);
    render(data);
  })
  .catch((error) => {
    console.error(error);
    alert("Не удалось загрузить data.json");
  });
