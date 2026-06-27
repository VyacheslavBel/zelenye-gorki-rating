<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin — рейтинг Зелёные горки</title>
  <meta name="description" content="Панель управления рейтингом отрядов." />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="admin-layout">
    <section class="infographic" data-view="admin">
      <header class="hero-header">
        <img class="hero-bg" src="./assets/header-bg.png" alt="" />
        <div class="hero-content">
          <div class="camp-name" data-field="campName">ЗЕЛЁНЫЕ ГОРКИ</div>
          <div class="shift-badge" data-field="shift">2 СМЕНА</div>
          <h1 data-field="title">Рейтинг деятельности отрядов</h1>
        </div>
      </header>

      <div class="status-row">
        <div class="status-pill"><span>🍃</span><span data-field="subtitle">Промежуточные результаты</span></div>
      </div>

      <section class="rating-table" aria-label="Рейтинг отрядов">
        <div class="table-head">
          <span>Место</span>
          <span>Отряд</span>
          <span>Вожатые</span>
          <span>Баллы</span>
        </div>
        <div id="rankingList" class="ranking-list"></div>
      </section>

      <section class="criteria-card">
        <h2>🍃 За что начисляются баллы</h2>
        <div id="criteriaList" class="criteria-list"></div>
      </section>

      <footer class="footer-landscape">
        <div class="footer-icons" aria-hidden="true">
          <span>🌲</span><span>🌿</span><span>🌼</span><span>🌲</span>
        </div>
        <p class="updated-sign">Обновлено:<br><strong data-field="updated">июнь–июль 2026</strong></p>
      </footer>
    </section>

    <aside class="admin-panel">
      <div class="panel-header">
        <p>Панель управления</p>
        <h2>Данные рейтинга</h2>
      </div>

      <form id="adminForm">
        <section class="form-section">
          <h3>Шапка и статус</h3>
          <label>
            Название лагеря
            <input id="campNameInput" name="campName" type="text" />
          </label>
          <label>
            Смена
            <input id="shiftInput" name="shift" type="text" />
          </label>
          <label>
            Заголовок
            <input id="titleInput" name="title" type="text" />
          </label>
          <label>
            Статус
            <input id="subtitleInput" name="subtitle" type="text" />
          </label>
          <label>
            Дата обновления
            <input id="updatedInput" name="updated" type="text" />
          </label>
        </section>

        <section class="form-section">
          <div class="section-line">
            <h3>Отряды</h3>
            <button id="sortBtn" class="mini-btn" type="button">Сортировать по баллам</button>
          </div>
          <div id="rankingEditor"></div>
        </section>

        <section class="form-section">
          <h3>Критерии</h3>
          <div id="criteriaEditor"></div>
        </section>

        <section class="form-actions">
          <button type="submit">Обновить предпросмотр</button>
          <button id="downloadBtn" type="button" class="secondary-btn">Скачать data.json</button>
          <button id="resetBtn" type="button" class="secondary-btn">Сбросить</button>
        </section>

        <p class="panel-note">
          Для публикации изменений на GitHub Pages: скачайте <b>data.json</b> и замените им файл в репозитории.
        </p>
      </form>
    </aside>
  </main>

  <script src="./admin.js"></script>
</body>
</html>
