# Amplitude audit

## Scope

Локальный read-only аудит Amplitude-артефактов итерации
`analytics-restoration-20260724`. Проверены только:

- `raw/2026-07-24T07-52-53Z-amplitude-mcp-smoke.json`;
- `raw/2026-07-24T08-22-11Z-amplitude-mcp-query.jsonl`;
- `normalized/amplitude.json`;
- `contracts/analytics-events.json`;
- `contracts/analytics-goals.md`;
- `js/analytics.js`;
- `server.json`;
- `simulator.json`.

Задача аудита — проверить provenance raw → normalized, точность когорты и
окна, семантику totals/uniques, допустимость воронки, согласованность с
server/simulator и покрытие event taxonomy. Это не проверка живого проекта
Amplitude, tracking plan, доставки отдельных событий или поведения реальных
пользователей.

## Evidence

### Provenance и доступ

| Проверка | Наблюдение | Результат |
|---|---|---|
| Smoke | `authenticated`, `resourceAccess=confirmed`, project `843298`, organization `451009` | pass для доступности проекта на `2026-07-24T07:52:53Z` |
| SHA-256 smoke raw | `a8e326c3a6ecd4ad39417a830fd831197891ed77251b1a0941728b5818d96b07` | совпадает с `normalized/amplitude.json` |
| SHA-256 query raw | `98c004521f72019f7bbafa0a4e1eadf764ed2db73e6bcadc5f005bda2a37e88d` | совпадает с `normalized/amplitude.json` |
| Query result | `success=true`, request `req_1784881327433_4x6fw4tkk`, chart edit `brs6ahuj` | pass |
| Project mapping | raw `projectId/app=843298`; normalized context `projectId=843298` | pass |
| Response copies | `content` и `structured_content` содержат одинаковый CSV; только первая копия дополнительно содержит `requestId` | pass, но нормализатор должен фиксировать выбранную копию |

Smoke подтверждает подключение к проекту, но не полноту данных и не
соответствие событий контракту. В списке `callableTools` smoke нет
`query_dataset`, хотя последующий trace содержит его успешный вызов; поэтому
этот список нельзя использовать как исчерпывающий capability manifest.

### Когорта и окно

- Для каждого из пяти запрошенных событий применены два event-level фильтра:
  `experiment_id is "analytics-restoration-20260724"` и
  `site_version is "measurement-v2-20260724"`.
- Это точно соответствует минимальному правилу отчётов из
  `contracts/analytics-goals.md`.
- Дополнительный segment пуст: `segments=[{"conditions":[]}]`.
- Группа уникальности — `countGroup="User"`.
- Raw request: `start=1784877000` (`2026-07-24T07:10:00Z`),
  `end=1784877900` (`2026-07-24T07:25:00Z`), `interval=-300000`.
- Окно полностью покрывает simulator `07:13:23Z–07:21:58Z` и server
  `firstVisitAt=07:13:24Z` → `lastOrderAt=07:21:55Z`. Буфер составляет
  3:23 до запуска и 3:02 после завершения.
- При трактовке окна как `[start,end)` ожидаемы интервалы `07:10`, `07:15`,
  `07:20`; именно в них находятся все ненулевые numeric buckets для первых
  трёх событий.

### Raw → normalized

| Event | Raw total | Raw unique | Raw numeric non-zero buckets | Normalized |
|---|---:|---:|---|---|
| `Landing Viewed` | 101 | 101 | `07:10=22`, `07:15=62`, `07:20=17` | exact |
| `Pricing Plan Selected` | 100 | 100 | `07:10=16`, `07:15=60`, `07:20=24` | exact |
| `Registration Form Opened` | 22 | 22 | `07:10=6`, `07:15=9`, `07:20=7` | exact |
| `Registration Form Submitted` | 22 | 22 | все 288 bucket cells — `null` | totals exact; `nonzeroBuckets=null` корректно сохраняет недоступность ряда |
| `Registration Completed` | 22 | 22 | все 288 bucket cells — `null` | totals exact; `nonzeroBuckets=null` корректно сохраняет недоступность ряда |

Raw CSV имеет 288 пятиминутных колонок от `2026-07-24T00:00:00` до
`2026-07-24T23:55:00` плюс `Total`, хотя request задаёт только 15 минут.
Каждая metric row имеет ту же длину, что и header. Для первых трёх событий
сумма numeric buckets равна `Total`; для Submitted/Completed такая проверка
невозможна, потому что bucket cells отсутствуют, несмотря на ненулевой total.

## Findings: severity / confidence

### F1. Невозможная хронология normalized provenance — High / High

`normalizedAt=2026-07-24T08:20:55Z` предшествует query:

- timestamp внутри request id соответствует примерно
  `2026-07-24T08:22:07.433Z`;
- имя raw-файла фиксирует `2026-07-24T08:22:11Z`.

То есть normalized timestamp опережает источник минимум на 72 секунды в
обратную сторону. Хеши показывают, что содержимое raw действительно совпадает
с указанным source, но поле `normalizedAt` не может быть временем
нормализации этого source. До исправления timestamp lineage нельзя считать
аудитопригодным.

### F2. `eventsSegmentation` не является упорядоченной воронкой — High / High

Query считает независимые `TOTALS` и `UNIQUES` пяти event sets. Он не
проверяет:

- что один и тот же user прошёл соседние шаги;
- порядок A → B → C → D → E;
- принадлежность шагов одной сессии;
- conversion window между шагами.

Поэтому ряд `101 → 100 → 22 → 22 → 22` допустимо называть только
**aggregate step-count ladder**. Утверждения «78 пользователей отвалились
между выбором тарифа и открытием формы» или «все submit завершились успехом»
этими данными не доказаны.

### F3. CSV/bucket semantics частично не определены — Medium / High

Ответ растянут на полный день без timezone suffix, хотя аргументы задают
15-минутное UTC-окно. Значения вне окна для первых трёх событий равны нулю,
но их нельзя интерпретировать как измеренные нули: это может быть padding
presentation layer. У Submitted и Completed все временные cells равны `null`,
но totals равны 22; следовательно:

- total пригоден для aggregate reconciliation;
- момент и распределение submit/completed по времени неизвестны;
- `null` нельзя превращать в `0`, пустой массив или «событий не было»;
- строгую server-side проверку применения окна по response shape выполнить
  нельзя.

Normalized правильно не выдумывает buckets для этих двух событий, но не
содержит явного `bucketStatus`, timezone и правила отсечения full-day padding.

### F4. Query не покрывает диагностическую taxonomy — Medium / High

Контракт содержит шесть событий, query — пять. Пропущен
`Registration Failed`, поэтому равенство Submitted/Completed не доказывает
отсутствие failed-path.

Также query не проверяет:

- наличие `analytics_schema_version=2.0.0`;
- обязательный `selected_plan` у `Pricing Plan Selected`;
- обязательный `form_surface` у form events;
- `failure_type` у `Registration Failed`;
- распределения `selected_plan`, `form_surface`, `failure_type`;
- отсутствие свойств вне allowlist.

Фильтры `experiment_id` + `site_version` корректны по текущему goals
contract, но это проверка когорты, а не соблюдения event contract.

### F5. Normalized теряет часть семантики raw query — Medium / High

Normalized меняет raw `interval=-300000` на
`intervalMilliseconds=300000`, не сохраняя raw value и не описывая
преобразование `abs(interval)`. Кроме того, в query snapshot не сохранены
`countGroup="User"`, `metric="formula"`, полная formula и пустой segment.
Без них normalized недостаточно для точного replay или semantic diff.

Поля `readOnly=true` и `savedObjectCreated=false` правдоподобны, но raw result
не содержит прямых одноимённых attestations. Их следует маркировать как
derived assertions с provenance, а не как наблюдённые факты.

### F6. Клиентский контракт не исполняет `requiredProperties` — Medium / High

`js/analytics.js` использует allowlist и добавляет общие свойства, но
`trackLogicalEvent` не проверяет `definition.requiredProperties`. Событие с
пропущенным `selected_plan` или `form_surface` всё равно передаётся
провайдерам.

Функция также возвращает `true` после попытки dispatch, даже если
синхронный `amplitudeClient.track` выбросил исключение: `safeCall` подавляет
ошибку. Поэтому `true` означает «логическое имя известно», а не «Amplitude
принял событие». Aggregate totals показывают, что данные поступили, но не
доказывают property completeness.

### F7. Smoke tool inventory не согласован с рабочим trace — Low / High

Smoke не перечисляет `query_dataset`, который успешно вызван позднее. Это не
ошибка самих метрик, но smoke нельзя использовать как контракт доступных
операций или как доказательство, что query capability была проверена в
preflight.

## Reconciliation

### Aggregate counts

| Источник / denominator | Visits / entrants | Conversions / orders | CR |
|---|---:|---:|---:|
| Simulator control panel | 100 successful visits | 22 | 22.0000% |
| Server | 101 persisted visits | 22 persisted orders | 21.7822% |
| Amplitude: Completed / Landing Viewed | 101 `Landing Viewed` users | 22 `Registration Completed` users | 21.7822% |
| Amplitude: Completed / Pricing Plan Selected | 100 `Pricing Plan Selected` users | 22 `Registration Completed` users | 22.0000% |

Server notes отдельно аттестуют один дополнительный persisted visit, который
трактуется как control-plane/eligibility probe. Amplitude также имеет ровно
один дополнительный Landing Viewed относительно 100 simulator visits.
Это сильная aggregate-согласованность, но без общего identifier нельзя
доказать, что дополнительный Amplitude user и server probe — одна сущность.

CR разных строк не усредняется: 22.0000% и 21.7822% используют разные
denominator и оба корректны в своей системе отсчёта.

### Step-count ladder

| Соседние event totals | Delta | Ratio следующего к предыдущему | Допустимая формулировка |
|---|---:|---:|---|
| Landing Viewed 101 → Pricing Plan Selected 100 | -1 | 99.0099% | totals отличаются на одного counted user |
| Pricing Plan Selected 100 → Registration Form Opened 22 | -78 | 22.0000% | крупнейшая соседняя разница totals |
| Registration Form Opened 22 → Submitted 22 | 0 | 100.0000% | aggregate totals равны |
| Submitted 22 → Completed 22 | 0 | 100.0000% | aggregate totals равны |

Для каждого event total равен unique count. При семантике
`countGroup="User"` это согласуется с одним событием данного типа на каждого
посчитанного user. Это не доказывает пересечение user sets разных событий.

### Допустимые выводы

Можно утверждать:

- проект `843298` был доступен и query вернул success;
- пять event sets отфильтрованы по точным `experiment_id` и `site_version`;
- totals/uniques raw точно перенесены в normalized;
- Amplitude aggregate Completed count (22) совпадает с server orders (22) и
  simulator conversions (22);
- Amplitude Landing Viewed (101) совпадает с server visits (101);
- aggregate telemetry согласована с восстановленной аналитикой на уровне
  totals.

Нельзя утверждать:

- что данные образуют user-level упорядоченную воронку;
- что те же 22 user открыли форму, submitted и completed;
- что failed registrations отсутствовали;
- что каждый Amplitude Completed соответствует persisted server order;
- что один лишний Landing Viewed — именно server probe;
- когда происходили Submitted/Completed внутри окна;
- что все required properties присутствовали и allowlist соблюдался;
- что Amplitude cohort напрямую привязан к `candidateSha`;
- что `true` из `trackLogicalEvent` подтверждает доставку события.

## Limitations

- Нет event-level export, user/session rows, последовательностей и общего
  privacy-safe join key с server data.
- В Amplitude properties есть `experiment_id` и `site_version`, но нет
  `candidateSha`; связь с SHA `20ba87b...` только косвенная через локальный
  `simulator.json`.
- Не проверены live tracking plan, Official status, ingestion lag, timezone
  проекта, autocapture и Session Replay.
- Query выполнен примерно через час после cohort window, но ingest timestamp
  и полнота late arrivals не зафиксированы.
- Для Submitted/Completed доступны totals, но не buckets.
- Локальные server/simulator JSON являются входными attestations; этот аудит
  не подтверждает их через control plane.
- Из-за ошибочного `normalizedAt` нельзя подтвердить порядок создания
  артефактов только по metadata.

## Remediation spec

### P0 — сделать normalized provenance исполняемым контрактом

1. Добавить в normalized schema:
   `queryStartedAt`, `queryCompletedAt`, `rawCapturedAt`,
   `normalizerStartedAt`, `normalizedAt`, `normalizerVersion`.
2. Валидировать:
   `queryStartedAt <= queryCompletedAt <= rawCapturedAt <= normalizedAt`.
   При нарушении — `status="invalid"`, а не `available`.
3. Продолжить обязательную проверку SHA-256 каждого source.
4. Хранить одновременно `rawInterval=-300000`,
   `bucketWidthMilliseconds=300000` и именованное правило преобразования.
5. Сохранять `countGroup`, `metric`, `formula`, `segments`, project/app и
   выбранный путь raw payload (`content[0].text`).
6. Для derived полей (`readOnly`, `savedObjectCreated`) добавить
   `evidenceSource` либо оставлять `null`, если raw не содержит attestations.

Acceptance:

- normalized с timestamp раньше query отклоняется;
- replay snapshot полностью восстанавливает аргументы raw call;
- hash mismatch переводит artifact в `invalid`.

### P0 — отделить event segmentation от funnel

1. Оставить текущий segmentation query для абсолютных totals/uniques.
2. Добавить отдельный ordered funnel:
   `Landing Viewed → Pricing Plan Selected → Registration Form Opened →
   Registration Form Submitted → Registration Completed`.
3. На каждом шаге применять те же `experiment_id` и `site_version`;
   зафиксировать `countGroup="User"`, session policy и conversion window.
4. Отчёт должен хранить entrants, step intersections, step conversion и
   overall conversion. Не вычислять drop-off из независимых event sets.
5. `Registration Failed` добавить как диагностическую ветку, но не как
   conversion.

Acceptance:

- слово «funnel» используется только для результата ordered funnel query;
- aggregate ladder и ordered funnel имеют разные поля/schema;
- расхождение их counts считается ожидаемым и объясняется, а не
  перезаписывается.

### P1 — закрыть taxonomy/query gaps

1. Добавить `Registration Failed` в diagnostic query.
2. Фильтровать или отдельно проверять
   `analytics_schema_version="2.0.0"`.
3. Добавить property-quality snapshots:
   missing `selected_plan`, missing `form_surface`, missing `failure_type`,
   breakdown по разрешённым значениям.
4. Явно определить в contract общие required properties:
   `analytics_schema_version`, `experiment_id`, `site_version`.
5. Не добавлять PII, raw error и уникальные submission IDs ради
   reconciliation; сохранять текущий privacy contract.

Acceptance:

- все шесть контрактных событий присутствуют в query manifest;
- missing-required-property count равен нулю;
- неизвестные значения свойств выводятся отдельным validation failure.

### P1 — нормализовать CSV без потери `null`

1. Хранить timezone bucket labels явно; не добавлять `Z` без доказательства.
2. Отделять requested range от presentation header range.
3. Bucket вне `[start,end)` маркировать `padding`, а не measured zero.
4. Представлять cell как `{status: "value", value: N}`,
   `{status: "null"}` или `{status: "padding"}`.
5. Проверять `sum(buckets)==total` только когда все buckets окна numeric.
   Для Submitted/Completed фиксировать `bucketStatus="unavailable"`.

Acceptance:

- full-day header не расширяет cohort window;
- `null` никогда не превращается в `0`;
- totals 22 сохраняются даже при недоступном временном ряду.

### P1 — исполнять event contract в dispatcher

1. До dispatch проверять `definition.requiredProperties`.
2. Возвращать структурированный результат:
   `unknown_event`, `invalid_properties`, `dispatch_attempted`; не называть
   попытку подтверждённой доставкой.
3. Добавить AAA-тесты для отсутствующего `selected_plan`, отсутствующего
   `form_surface`, лишнего свойства, синхронной ошибки provider и truncation
   строки до 80 символов.
4. Analytics failure не должен ломать registration flow, но должен быть
   различим в локальной диагностике без PII.

### P2 — согласовать smoke

Smoke artifact должен либо перечислять реально обнаруженный
`query_dataset`, либо явно объявлять `callableToolsPartial=true`. Preflight
для аналитики должен выполнять отдельный read-only query smoke, а не
полагаться только на project-context call.
