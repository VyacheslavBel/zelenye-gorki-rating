<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin — Зелёные горки</title>
  <meta name="description" content="Панель управления рейтингом отрядов." />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="admin-page">
    <div class="admin-preview">
      
<section class="poster" aria-label="Рейтинг деятельности отрядов">
  <div class="poster-art" aria-hidden="true"></div>

  <header class="poster-header">
    <div class="camp-name" data-field="campName">ЗЕЛЁНЫЕ ГОРКИ</div>
    <div class="shift-badge" data-field="shift">2 СМЕНА</div>

    <h1 class="poster-title">
      <span class="main-word" data-field="mainWord">Рейтинг</span>
      <span class="small-title" data-field="title">деятельности отрядов</span>
    </h1>

    <div class="status-pill">
      <span>🍃</span>
      <span data-field="subtitle">Промежуточные результаты</span>
    </div>
  </header>

  <section class="ranking-card">
    <div class="ranking-head">
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

  <footer class="poster-footer">
    <div class="wood-sign">
      <span>🍃</span>
      <p>Обновлено:<br><strong data-field="updated">июнь–июль 2026</strong></p>
    </div>
  </footer>
</section>

    </div>

    <aside class="admin-panel">
      <div class="admin-panel-title">
        <span>🍃</span>
        <h1>Панель управления</h1>
      </div>

      <form id="adminForm">
        <section class="control-card">
          <h2>Общая информация</h2>

          <div class="control-grid two">
            <label>Смена <input id="shiftInput" type="text" /></label>
            <label>Главное слово <input id="mainWordInput" type="text" /></label>
            <label>Заголовок <input id="titleInput" type="text" /></label>
            <label>Статус <input id="subtitleInput" type="text" /></label>
            <label>Дата обновления <input id="updatedInput" type="text" /></label>
          </div>
        </section>

        <section class="control-card">
          <div class="control-card-line">
            <h2>Рейтинг отрядов</h2>
            <button id="sortBtn" type="button" class="small-button">Сортировать</button>
          </div>

          <div class="editor-head squad">
            <span>Место</span><span>Отряд</span><span>Вожатые</span><span>Баллы</span><span></span>
          </div>
          <div id="rankingEditor"></div>
          <button id="addSquadBtn" type="button" class="add-button">+ Добавить отряд</button>
        </section>

        <section class="control-card">
          <h2>Критерии начисления баллов</h2>
          <div id="criteriaEditor"></div>
          <button id="addCriterionBtn" type="button" class="add-button">+ Добавить критерий</button>
        </section>

        <div class="admin-actions">
          <button type="submit" class="save-button">💾 Сохранить</button>
          <button id="downloadBtn" type="button" class="download-button">⬇ Скачать data.json</button>
          <button id="resetBtn" type="button" class="reset-button">↻ Сбросить</button>
        </div>

        <p class="admin-note">После редактирования нажмите «Скачать data.json» и замените этот файл в GitHub.</p>
      </form>
    </aside>
  </main>

  <script src="./admin.js"></script>
</body>
</html>
