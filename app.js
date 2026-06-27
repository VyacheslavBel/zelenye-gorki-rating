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

loadData().then(render).catch((error) => {
  console.error(error);
  document.getElementById("rankingList").innerHTML = "<p>Не удалось загрузить данные рейтинга.</p>";
});
