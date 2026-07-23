# Проверка

## Чеклист «нельзя менять»

| Ограничение из `site-constraints.md` | Статус | Evidence |
|---|---|---|
| `#registration-form` и `action="api/submit.php"` | pass | Runtime: `registration-form`, `api/submit.php`, `POST`; diff не меняет контракт |
| Поля `name`, `phone`, `email` | pass | Все три защищённых имени, типы и `required` сохранены |
| Скрытое поле `bot_session_id` | warning | Поле отсутствует и в baseline `1f2041b`, и во всей доступной истории; текущий diff его не удалял. Без изменения запрещённых `api/**` источник значения неизвестен |
| `<script src="api/visit.php">` | pass | Подключение сохранено в `<head>` |
| `.btn-register` | pass | Сохранены три кнопки; изменены только текст и клиентское состояние |
| `.pricing-section` | pass | Класс сохранён, добавлен только `id="pricing"` |
| `.program-module`, `.program-list` | pass | Сохранены 6 модулей и контейнер; менялся только текст |
| `api/*.php` | pass with override | Только `api/submit.php` изменён по явному решению пользователя: `purpose` больше не валидируется; остальные API-файлы не менялись |
| `sql/schema.sql` | pass | Не изменялся |
| CTA-кнопки нельзя удалять | pass | Все три исходные CTA сохранены |

## Structural audit — закрыто?

| наблюдение | рекомендация | status |
|---|---|---|
| На первом экране нет CTA | R1: якорь «Выбрать формат участия» к `#pricing` | implemented |
| Самая длинная секция — программа 2081 px | R3: шесть описаний сокращены до результата и практики | implemented |
| Статические карточки имеют pointer/hover | R2: интерактивные стили удалены | implemented |
| Инструкторы представлены поздно и требуют быстрого trust-сигнала | R4: заголовок и lead сразу объясняют проверяемый опыт | implemented |
| Тарифная CTA теряет контекст у формы | R5: выбранный тариф показан у формы, карточка и `aria-pressed` синхронизируются | implemented |
| Фото без подписи/перехода | D1 | deferred до повторного прогона |
| Подвал без контактов | Нет достоверных контактных данных в `site_dir` | blocked |

## Рекомендации

| id | layer | status | notes |
|---|---|---|---|
| R1 | cluster | implemented | Hero CTA и trust-line |
| R2 | structural | implemented | False affordances устранены |
| R3 | cluster | implemented | Программа стала короче без удаления тем и защищённых классов |
| R4 | structural | implemented | Только подтверждённые роли/опыт, без вымышленных claims |
| R5 | cluster | implemented | Continuity тарифа до формы, contract формы не изменён |
| R6 | cluster | implemented | `purpose` исключён из обновлённого контракта, форма сокращена до трёх полей |
| B2 | structural | blocked | Нет материалов для реальных отзывов/логотипов |
| D1 | structural | deferred | Проверить эффект текущего набора перед добавлением ещё одной CTA |

## Интерактив после правок

| элемент из observed / falseAffordances | ожидание | pass/fail |
|---|---|---|
| `.hero-cta` | Переход к `#pricing` | pass desktop/mobile |
| Три `.btn-register` | Переход к `#registration` | pass для всех трёх |
| Выбор тарифа | Ровно одна `.is-selected`, корректный `aria-pressed`, текст в `#registration-selection` | pass для трёх тарифов |
| Форма | Только `name`, `phone`, `email`; отправка без `purpose` успешна | pass |
| `.feature-card` | Не имитирует кнопку | pass: `cursor:auto`, `transform:none` |
| `.program-module` | Не имитирует кнопку | pass: `cursor:auto`, `transform:none` |
| `.injury-card` | Не имитирует кнопку | pass: `cursor:auto`, `transform:none` |
| Responsive | Нет горизонтального overflow | pass: 1280=1280 и 390=390 |
| Console | Нет runtime errors | pass: `[]` |

## Сборка и проверки

- `node --check js/main.js` — pass.
- `npm run build` — pass; `js/main.bundle.js` обновлён.
- `docker build -t naition-low-conversion-landing:codex-check .` — pass.
- `php -l /var/www/html/index.php` внутри Docker — pass.
- Локальный HTTP — `200`.
- `GET /api/init.php` — `{"ok":true,"message":"Database initialized."}`.
- `POST /api/submit.php` только с `name`, `phone`, `email` — `{"ok":true}`.
- `GET /api/export.php` после smoke-submit — заявка сохранена, legacy `purpose` равен пустой строке.
- `git diff --check` — pass.
- Отдельных test/lint scripts в `package.json` нет.
- Runtime smoke выполнен на desktop 1280×720 и mobile 390×844; контейнер остановлен с code 0.

## Изменённые файлы

- `index.php` — ранний CTA, сокращённая программа, trust-copy, конкретные тарифные CTA, контекст выбора у формы.
- `css/style.css` — hero/selection states, responsive, устранение ложной интерактивности.
- `js/main.js` — сохранение видимого контекста выбранного тарифа.
- `js/main.bundle.js` — пересобранный production bundle.
- `STUDENTS.md` — защищённый контракт формы сокращён до `name`, `phone`, `email`.
- `api/submit.php` — убрана валидация `purpose`; legacy storage заполняется пустым значением для совместимости.
- `output/**` — карта, raw-аудит, 514 per-visit файлов, отчёты, рекомендации и проверки.

## Workflow (из site_dir)

- [ ] Redeploy — не выполнялся по прямому запрету пользователя.
- [ ] Повторно запустить симулятор на сопоставимом объёме.
- [ ] Сравнить `pricing CTA → form_start`, `form_start → submit` и итоговый CR до/после.
- [ ] Отдельно проверить живой трафик: 500/514 исходных визитов выглядят синтетическими.

## Итог

- [x] Все изменения соблюдают обновлённый пользователем контракт.
- [x] Топ-3 cluster-рекомендации и минимум одна structural-рекомендация implemented.
- [x] Интерактив и responsive проверены.
- [x] Build и доступные проверки проходят.
- [ ] `bot_session_id` требует отдельного решения на уровне исходного контракта/симулятора; текущий diff его не затрагивает.
