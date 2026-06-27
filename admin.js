let state = null;

const iconMap = {
  flag: "⚑",
  ball: "⚽",
  paint: "🎨",
  hands: "🙌",
  shield: "☆"
};

async function loadData() {
  const response = await fetch("./data.json?v=" + Date.now(), { cache: "no-store" });
  if (!response.ok) throw new Error("Не удалось загрузить data.json");
  return response.json();
}

function render(data) {
  setText("campName", (data.campName || "Зелёные горки").toUpperCase());
  setText("shift", data.shift || "2 смена");
  setText("mainWord", data.mainWord || "Рейтинг");
  setText("title", data.title || "деятельности отрядов");
  setText("subtitle", data.subtitle || "Промежуточные результаты");
  setText("updated", data.updated || "");

  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";

  (data.ranking || [])
    .sort((a, b) => Number(a.place) - Number(b.place))
    .forEach((item) => {
      const row = document.createElement("article");
      row.className = "rank-row";
      row.innerHTML = `
        <div class="place"><span class="badge">${Number(item.place)}</span></div>
        <div class="squad">${escapeHtml(item.name)}</div>
        <div class="counselors">${escapeHtml(item.counselors || "—")}</div>
        <div class="score">${Number(item.score)}</div>
      `;
      rankingList.appendChild(row);
    });

  const criteriaList = document.getElementById("criteriaList");
  criteriaList.innerHTML = "";

  (data.criteria || []).forEach((item) => {
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

  document.getElementById("shiftInput").value = data.shift || "";
  document.getElementById("mainWordInput").value = data.mainWord || "";
  document.getElementById("titleInput").value = data.title || "";
  document.getElementById("subtitleInput").value = data.subtitle || "";
  document.getElementById("updatedInput").value = data.updated || "";

  const rankingEditor = document.getElementById("rankingEditor");
  rankingEditor.innerHTML = "";

  (data.ranking || []).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "squad-row";
    row.innerHTML = `
      <input type="number" min="1" data-type="ranking" data-index="${index}" data-field="place" value="${Number(item.place)}">
      <input type="text" data-type="ranking" data-index="${index}" data-field="name" value="${escapeAttr(item.name)}">
      <input type="text" data-type="ranking" data-index="${index}" data-field="counselors" value="${escapeAttr(item.counselors || "")}">
      <input type="number" min="0" data-type="ranking" data-index="${index}" data-field="score" value="${Number(item.score)}">
      <button type="button" class="delete-btn" data-delete-ranking="${index}">🗑</button>
    `;
    rankingEditor.appendChild(row);
  });

  const criteriaEditor = document.getElementById("criteriaEditor");
  criteriaEditor.innerHTML = "";

  (data.criteria || []).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "criterion-row";
    row.innerHTML = `
      <input type="text" data-type="criteria" data-index="${index}" data-field="name" value="${escapeAttr(item.name)}">
      <input type="number" min="0" data-type="criteria" data-index="${index}" data-field="value" value="${Number(item.value)}">
      <button type="button" class="delete-btn" data-delete-criterion="${index}">🗑</button>
    `;
    criteriaEditor.appendChild(row);
  });

  bindDeleteButtons();
}

function collectData() {
  const data = structuredClone(state);
  data.shift = document.getElementById("shiftInput").value.trim();
  data.mainWord = document.getElementById("mainWordInput").value.trim();
  data.title = document.getElementById("titleInput").value.trim();
  data.subtitle = document.getElementById("subtitleInput").value.trim();
  data.updated = document.getElementById("updatedInput").value.trim();

  document.querySelectorAll('[data-type="ranking"]').forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    data.ranking[index][field] = ["place", "score"].includes(field) ? Number(input.value) : input.value.trim();
  });

  document.querySelectorAll('[data-type="criteria"]').forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    data.criteria[index][field] = field === "value" ? Number(input.value) : input.value.trim();
  });

  data.ranking.sort((a, b) => Number(a.place) - Number(b.place));
  return data;
}

function bindDeleteButtons() {
  document.querySelectorAll("[data-delete-ranking]").forEach((button) => {
    button.addEventListener("click", () => {
      const data = collectData();
      data.ranking.splice(Number(button.dataset.deleteRanking), 1);
      state = data;
      fillEditor(data);
      render(data);
    });
  });

  document.querySelectorAll("[data-delete-criterion]").forEach((button) => {
    button.addEventListener("click", () => {
      const data = collectData();
      data.criteria.splice(Number(button.dataset.deleteCriterion), 1);
      state = data;
      fillEditor(data);
      render(data);
    });
  });
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

function setText(field, value) {
  document.querySelectorAll(`[data-field="${field}"]`).forEach((el) => {
    el.textContent = value;
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

document.getElementById("adminForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = collectData();
  state = data;
  fillEditor(data);
  render(data);
});

document.getElementById("downloadBtn").addEventListener("click", downloadJson);

document.getElementById("resetBtn").addEventListener("click", async () => {
  const data = await loadData();
  state = data;
  fillEditor(data);
  render(data);
});

document.getElementById("sortBtn").addEventListener("click", () => {
  const data = collectData();
  data.ranking.sort((a, b) => Number(b.score) - Number(a.score)).forEach((item, index) => item.place = index + 1);
  state = data;
  fillEditor(data);
  render(data);
});

document.getElementById("addSquadBtn").addEventListener("click", () => {
  const data = collectData();
  data.ranking.push({ place: data.ranking.length + 1, name: `${data.ranking.length + 1} отряд`, counselors: "", score: 0 });
  state = data;
  fillEditor(data);
  render(data);
});

document.getElementById("addCriterionBtn").addEventListener("click", () => {
  const data = collectData();
  data.criteria.push({ name: "Новый критерий", value: 0, icon: "flag" });
  state = data;
  fillEditor(data);
  render(data);
});

loadData()
  .then((data) => {
    state = data;
    fillEditor(data);
    render(data);
  })
  .catch((error) => {
    console.error(error);
    alert("Не удалось загрузить data.json");
  });
