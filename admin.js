const STORAGE_KEY = "zelenye-gorki-rating";
let state = null;

async function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const res = await fetch("./data.json", { cache: "no-store" });
  return await res.json();
}

function fillEditor(data) {
  state = structuredClone(data);
  document.getElementById("subtitleInput").value = data.subtitle || "";
  document.getElementById("updatedInput").value = data.updated || "";

  const rows = document.getElementById("rowsEditor");
  rows.innerHTML = "";
  data.ranking.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "row-editor";
    row.innerHTML = `
      <div class="small-note">Отряд #${index + 1}</div>
      <div class="row-editor-grid">
        <label>Место
          <input type="number" min="1" data-type="ranking" data-field="place" data-index="${index}" value="${item.place}">
        </label>
        <label>Название отряда
          <input type="text" data-type="ranking" data-field="name" data-index="${index}" value="${escapeAttr(item.name)}">
        </label>
        <label>Вожатые / подпись
          <input type="text" data-type="ranking" data-field="leader" data-index="${index}" value="${escapeAttr(item.leader || "")}">
        </label>
        <label>Баллы
          <input type="number" min="0" data-type="ranking" data-field="score" data-index="${index}" value="${item.score}">
        </label>
      </div>
    `;
    rows.appendChild(row);
  });

  const criteriaEditor = document.getElementById("criteriaEditor");
  criteriaEditor.innerHTML = "";
  data.criteria.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "criteria-editor-card";
    card.innerHTML = `
      <div class="small-note">Критерий #${index + 1}</div>
      <div class="criteria-editor-grid">
        <label>Название критерия
          <input type="text" data-type="criteria" data-field="name" data-index="${index}" value="${escapeAttr(item.name)}">
        </label>
        <label>Баллы / вес
          <input type="number" min="0" data-type="criteria" data-field="value" data-index="${index}" value="${item.value}">
        </label>
      </div>
    `;
    criteriaEditor.appendChild(card);
  });
}

function getEditedData() {
  const updated = structuredClone(state);
  updated.subtitle = document.getElementById("subtitleInput").value.trim();
  updated.updated = document.getElementById("updatedInput").value.trim();

  document.querySelectorAll("[data-type='ranking']").forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    updated.ranking[index][field] = ["place", "score"].includes(field)
      ? Number(input.value)
      : input.value.trim();
  });

  document.querySelectorAll("[data-type='criteria']").forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    updated.criteria[index][field] = field === "value" ? Number(input.value) : input.value.trim();
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

document.getElementById("adminForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const updated = getEditedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  state = updated;
  alert("Данные сохранены. Откройте index.html, чтобы увидеть изменения.");
});

document.getElementById("downloadBtn").addEventListener("click", downloadJson);

document.getElementById("resetBtn").addEventListener("click", async () => {
  localStorage.removeItem(STORAGE_KEY);
  const res = await fetch("./data.json", { cache: "no-store" });
  fillEditor(await res.json());
  alert("Локальные изменения сброшены.");
});

loadData().then(fillEditor).catch((error) => {
  console.error(error);
  alert("Не удалось загрузить данные.");
});
