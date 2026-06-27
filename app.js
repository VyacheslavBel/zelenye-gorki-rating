const iconMap = {
  flag: "⚑",
  ball: "⚽",
  paint: "🎨",
  hands: "🙌",
  shield: "☆"
};

let state = null;

async function loadData() {
  const saved = localStorage.getItem("zelenye-gorki-rating");
  if (saved) return JSON.parse(saved);
  const res = await fetch("./data.json", { cache: "no-store" });
  return await res.json();
}

function render(data) {
  state = data;
  document.getElementById("campName").textContent = data.campName.toUpperCase();
  document.getElementById("shift").textContent = data.shift.toUpperCase();
  document.getElementById("mainTitle").innerHTML = data.title.replace(" ", "<br><span>") + "</span>";
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

  fillEditor(data);
}

function fillEditor(data) {
  document.getElementById("titleInput").value = data.title;
  document.getElementById("subtitleInput").value = data.subtitle;
  document.getElementById("updatedInput").value = data.updated;

  const rows = document.getElementById("rowsEditor");
  rows.innerHTML = "";
  data.ranking.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "row-editor";
    row.innerHTML = `
      <label>Место
        <input type="number" min="1" data-field="place" data-index="${index}" value="${item.place}">
      </label>
      <label>Название отряда
        <input type="text" data-field="name" data-index="${index}" value="${escapeAttr(item.name)}">
      </label>
      <label>Вожатые / подпись
        <input type="text" data-field="leader" data-index="${index}" value="${escapeAttr(item.leader || "")}">
      </label>
      <label>Баллы
        <input type="number" min="0" data-field="score" data-index="${index}" value="${item.score}">
      </label>
    `;
    rows.appendChild(row);
  });
}

function getEditedData() {
  const updated = structuredClone(state);
  updated.title = document.getElementById("titleInput").value.trim();
  updated.subtitle = document.getElementById("subtitleInput").value.trim();
  updated.updated = document.getElementById("updatedInput").value.trim();

  document.querySelectorAll("[data-field]").forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    updated.ranking[index][field] = ["place", "score"].includes(field)
      ? Number(input.value)
      : input.value.trim();
  });

  updated.ranking.sort((a, b) => Number(a.place) - Number(b.place));
  return updated;
}

function downloadJson() {
  const data = getEditedData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

document.getElementById("editBtn").addEventListener("click", () => {
  document.getElementById("editForm").classList.toggle("hidden");
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  localStorage.removeItem("zelenye-gorki-rating");
  const res = await fetch("./data.json", { cache: "no-store" });
  render(await res.json());
});

document.getElementById("editForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const updated = getEditedData();
  localStorage.setItem("zelenye-gorki-rating", JSON.stringify(updated));
  render(updated);
});

document.getElementById("downloadBtn").addEventListener("click", downloadJson);

loadData().then(render).catch((error) => {
  console.error(error);
  document.getElementById("rankingList").innerHTML = "<p>Не удалось загрузить данные рейтинга.</p>";
});
