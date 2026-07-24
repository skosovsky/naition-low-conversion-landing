# GA4 audit

## scope

Независимый файловый аудит GA4 для эксперимента
`analytics-restoration-20260724`.

Проверены только следующие локальные артефакты:

- `raw/2026-07-24T07-52-53Z-ga4-mcp-smoke.json`;
- `raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json`;
- `normalized/google-analytics.json`;
- `contracts/analytics-events.json`;
- `contracts/analytics-goals.md`;
- `js/analytics.js`;
- `index.php`.

В scope входят:

1. доступность GA4 read-plane;
2. точность attribution текущего blocker;
3. согласованность property/measurement identifiers;
4. контракт событий, свойств и конверсии;
5. границы выводов при отсутствии GA4 rows;
6. спецификация восстановления и критерии приёмки.

Не выполнялись сетевые запросы, OAuth, MCP-вызовы, browser/UI-проверки и
изменения конфигурации GA4. `js/main.bundle.js`, серверная persistence,
настройки GA4 property/data stream и фактические network hits не входят в
evidence set.

Итоговый статус: **GA4 read-plane unavailable**. Это подтверждённый blocker
доступа к данным, но не доказательство того, что браузерные события не
отправляются или что в GA4 нет данных.

## evidence

### Доступность и blocker

- Первый smoke не дошёл до ответа Google: вызов `get_property_details` был
  отменён orchestration wrapper; `authenticationStatus` и `resourceAccess`
  остались `not_verified`
  (`raw/2026-07-24T07-52-53Z-ga4-mcp-smoke.json:21-38`).
- Более поздний артефакт содержит два независимых ответа Google с HTTP 403 и
  `ACCESS_TOKEN_SCOPE_INSUFFICIENT`:
  - Admin API `AnalyticsAdminService.GetProperty`
    (`raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json:13-27`);
  - Data API `BetaAnalyticsData.RunReport`
    (`raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json:29-73`).
- Использовался credential type `authorized_user`; client ID и refresh token
  присутствовали, но stored scopes не были перечислены. Повторный OAuth с
  запрошенными `analytics.readonly` и `cloud-platform` был отменён, credential
  file не изменился
  (`raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json:76-90`).
- Доступ к property по-прежнему явно отмечен как `not_verified`
  (`raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json:92`).
- Нормализованный файл корректно сохраняет `status: unavailable`, оба API как
  failed и `events: null`
  (`normalized/google-analytics.json:5`, `:20-35`).

### Provenance и identifiers

- SHA-256 обоих raw-файлов пересчитаны локально и в точности совпадают с
  `normalized/google-analytics.json:6-14`.
- `propertyId=546448545` согласован между обоими raw-файлами и normalized.
- `measurementId=G-699YWESPJ1` согласован между обоими raw-файлами,
  normalized и загрузкой/config Google tag в `index.php:9-16`.
- Эта согласованность доказывает только единообразие локальной конфигурации.
  Связь measurement ID с указанной property не подтверждена успешным Admin API
  ответом.
- Имя второго raw-файла содержит `08-22-11Z`, тогда как его `collectedAt`
  равен `07:57:58Z`; `normalizedAt=08:20:55Z` также раньше timestamp в имени
  source-файла. Содержимое и hashes однозначны, но временная provenance
  неоднозначна.

### Контракт событий

| Логическое событие | GA4 event | Trigger по контракту | Required properties | Статическая реализация в `js/analytics.js` |
|---|---|---|---|---|
| `landing_viewed` | `landing_viewed` | `DOMContentLoaded` | — | dispatcher умеет отправить mapping; trigger call site не в scope |
| `pricing_plan_selected` | `select_content` | активация pricing CTA | `selected_plan` | добавляет `content_type=pricing_plan` и `item_id=selected_plan`; required не валидируется |
| `registration_form_opened` | `registration_form_opened` | первый focus формы | `form_surface` | mapping есть; required не валидируется |
| `registration_attempted` | `registration_attempted` | валидный submit начинает API request | `form_surface` | mapping есть; required не валидируется |
| `registration_completed` | `generate_lead` | HTTP success и `data.ok=true` | `form_surface` | mapping есть; success gate call site не в scope |
| `registration_failed` | `registration_failed` | transport/HTTP/JSON/application failure | `form_surface`, `failure_type` | mapping есть; failure classification call site не в scope |

Контракт правильно разделяет попытку, подтверждённый клиентский success и
failure. В `analytics-goals.md:11,16-18` только `generate_lead` объявлен
конверсией/key event. Это соответствует правилу «submit не равен conversion».

### Контракт свойств

| Property | Источник/роль | Allowlisted | Required | План GA4 custom dimension |
|---|---|---:|---|---:|
| `analytics_schema_version` | common | yes | неявно добавляется dispatcher | yes |
| `experiment_id` | common | yes | неявно добавляется dispatcher | yes |
| `site_version` | common | yes | неявно добавляется dispatcher | yes |
| `selected_plan` | event-specific | yes | только `pricing_plan_selected` | yes |
| `form_surface` | event-specific | yes | четыре form events | no |
| `failure_type` | diagnostics | yes | `registration_failed` | yes |
| `response_status` | diagnostics | yes | no | no |
| `content_type` | GA4 `select_content` parameter | yes | no | no |
| `item_id` | GA4 `select_content` parameter | yes | no | no |

`analytics-goals.md:16-18` требует custom dimensions для пяти полей, а
`analytics-goals.md:24` требует фильтрацию по `experiment_id` и
`site_version`. Факт создания этих dimensions и key event не подтверждён:
Admin API не был доступен.

## findings

Шкала severity: `critical` — результат нельзя использовать; `high` —
ломается ключевая измеримость/контракт; `medium` — существенный риск неверных
данных или диагностики; `low` — auditability/drift; `info` — подтверждённая
положительная характеристика.

### F-01 — GA4 read-plane недоступен

- **Severity:** high
- **Confidence:** high
- **Evidence:** оба реальных Google API вызова завершились HTTP 403
  `ACCESS_TOKEN_SCOPE_INSUFFICIENT`; normalized содержит `events: null`.
- **Impact:** отсутствуют GA4 rows для подсчёта event counts, users, CR,
  funnel, hostname и сегментов эксперимента.
- **Qualification:** tool discovery и запуск MCP server были успешны. Сломан
  не discovery/transport, а авторизованный read access к Google APIs.

### F-02 — blocker attribution корректен на уровне класса ошибки, но точный scope ещё не доказан introspection

- **Severity:** medium
- **Confidence:** high для `insufficient OAuth scope`; medium для
  формулировки «отсутствует именно `analytics.readonly`».
- **Evidence:** Google вернул `ACCESS_TOKEN_SCOPE_INSUFFICIENT` для Admin и
  Data API. При этом `storedScopes=null`; remediation OAuth не завершён.
- **Assessment:** `normalized.blocker.code`, services и `reproducible=true`
  подтверждены raw evidence. Поле
  `requiredScope=https://www.googleapis.com/auth/analytics.readonly` является
  обоснованной remediation-гипотезой, но raw-файл не содержит списка реально
  выданных scopes или успешного повторного запроса с этим scope.
- **Not attributable yet:** property-level IAM, отсутствие property, связь
  measurement ID с property, disabled API или отсутствие событий. Проверка до
  этих уровней не дошла.

### F-03 — normalized snapshot честно отражает отсутствие данных

- **Severity:** info
- **Confidence:** high
- **Evidence:** raw hashes совпадают; `status=unavailable`, оба API flags
  false, `events=null`.
- **Assessment:** пустые rows не сфабрикованы и `unavailable` не подменён
  нулевой активностью. Это корректное fail-closed поведение.

### F-04 — проверяемый dispatcher не является доказанным runtime-кодом страницы

- **Severity:** high
- **Confidence:** high
- **Evidence:** `index.php:20` загружает `js/main.bundle.js`, а не
  `js/analytics.js`. В `js/analytics.js` есть только exports dispatcher и
  sanitizer; call sites triggers отсутствуют.
- **Impact:** по evidence set нельзя подтвердить, что bundle соответствует
  `analytics-events.json` версии `2.0.0`, что logical events вызываются в
  нужных местах и что `generate_lead` вызывается только после HTTP success +
  `data.ok=true`.
- **Corollary:** мета-теги experiment/site version в `index.php:6-7`
  согласованы статически, но их фактическое попадание в GA4 event params не
  доказано.

### F-05 — `requiredProperties` объявлены, но не исполняются

- **Severity:** high
- **Confidence:** high
- **Evidence:** dispatcher читает `contract.events[logicalEvent]`, но нигде не
  проверяет `definition.requiredProperties`
  (`js/analytics.js:57-69`). После этого он вызывает providers и возвращает
  `true`.
- **Impact:** `generate_lead` может быть отправлен без `form_surface`,
  `registration_failed` — без `failure_type`, а `select_content` — без
  `selected_plan`. Формально существующий contract не является executable
  contract.

### F-06 — `true` от dispatcher не означает отправку или доставку в GA4

- **Severity:** medium
- **Confidence:** high
- **Evidence:** при отсутствии `window.gtag` блок GA4 просто пропускается
  (`js/analytics.js:80-84`); exceptions подавляются `safeCall`
  (`js/analytics.js:37-43`); функция всё равно возвращает `true`
  (`js/analytics.js:97`).
- **Impact:** локальные тесты или вызывающий код могут принять «logical event
  распознан» за «GA4 event отправлен». Ни queue acceptance, ни network
  delivery, ни ingestion этим return value не подтверждаются.

### F-07 — allowlist применяется не ко всему итоговому payload

- **Severity:** medium
- **Confidence:** high
- **Evidence:** сначала выполняется `sanitizeEventProperties`, затем
  `content_type` и `item_id` добавляются напрямую
  (`js/analytics.js:63-74`).
- **Current state:** оба ключа сейчас присутствуют в `allowedProperties`, так
  что конкретный payload соответствует текущему контракту.
- **Drift risk:** удаление этих ключей из allowlist не остановит их отправку.
  Privacy-правило «только allowedProperties» не является устойчивым
  инвариантом реализации.

### F-08 — типы и допустимые значения event properties не заданы в проверяемом контракте

- **Severity:** medium
- **Confidence:** high
- **Evidence:** `analytics-events.json` задаёт имена allowed/required
  properties, но не определяет type, enum, pattern или semantic source.
  Sanitizer принимает любую строку до 80 символов, finite number или boolean
  (`js/analytics.js:1-17`).
- **Impact:** нельзя контрактно гарантировать, что `selected_plan` — один из
  планов, `form_surface` — известная поверхность, `failure_type` — стабильная
  категория, а `response_status` — валидный HTTP status. Key allowlist
  предотвращает отправку неизвестных ключей, но не PII внутри разрешённого
  строкового значения.
- **Scope note:** `$schema` указан, но файл schema не входит в evidence set;
  наличие более строгой build-time schema не доказывает runtime validation.

### F-09 — reporting contract не охватывает часть обязательных/диагностических параметров

- **Severity:** medium
- **Confidence:** high
- **Evidence:** `form_surface` обязателен для четырёх событий, а
  `response_status` разрешён как диагностика, но ни один не указан в списке
  GA4 event-scoped custom dimensions (`analytics-goals.md:16-18`).
- **Impact:** даже после восстановления Data API стандартный отчёт по плану не
  гарантирует сегментацию form events по `form_surface` и HTTP diagnostics по
  `response_status`.
- **Decision needed:** либо эти поля являются reportable и должны быть
  зарегистрированы, либо их диагностическая роль в GA4 должна быть явно
  исключена из acceptance criteria.

### F-10 — запрос Data API был недостаточен для проверки property contract даже при успехе

- **Severity:** medium
- **Confidence:** high
- **Evidence:** запрос содержит только dimensions `dateHourMinute`,
  `eventName`, `hostName` и metrics `eventCount`, `totalUsers`
  (`raw/2026-07-24T08-22-11Z-ga4-mcp-data-api.json:31-57`).
- **Impact:** он мог бы подтвердить наличие event names, но не значения
  `experiment_id`, `site_version`, `selected_plan`, `form_surface`,
  `failure_type`, schema version или response status. Контрактная изоляция
  текущей итерации не проверена.

### F-11 — автоматический `page_view` может находиться вне явного event contract

- **Severity:** low
- **Confidence:** medium
- **Evidence:** `index.php:16` вызывает `gtag('config',
  'G-699YWESPJ1')` без локально видимого отключения automatic page view, тогда
  как denominator контракта — `landing_viewed`.
- **Impact:** contract нельзя трактовать как исчерпывающий allowlist всех GA4
  wire events. Если требуется только явная схема событий, нужно явно решить
  судьбу `page_view`; если он допустим как platform event, это нужно записать
  в контракте и не использовать вместо `landing_viewed` в CR.

### F-12 — временная provenance второго raw-файла неоднозначна

- **Severity:** low
- **Confidence:** high
- **Evidence:** filename `08-22-11Z`, `collectedAt=07:57:58Z`,
  `normalizedAt=08:20:55Z`.
- **Impact:** сортировка по имени файла меняет фактический порядок collection /
  normalization. Hash integrity не нарушена, но автоматический audit trail
  может неверно восстановить timeline.

## unavailable-data limits

### Что можно заключать

- MCP server стартовал, tools были обнаружены.
- Реальные Admin и Data API запросы были отклонены из-за недостаточного OAuth
  scope.
- На момент snapshot read access к property не был верифицирован.
- Нормализованный статус `unavailable` и `events=null` соответствует raw
  evidence.
- Локальные property/measurement IDs согласованы между конфигурационными
  файлами.
- Статический event contract различает view, selection, form open, attempt,
  confirmed client success и failure.
- Статическая цель объявляет только `generate_lead` конверсией.

### Что нельзя заключать

- Что property существует и credential имеет к ней property-level access.
- Что `G-699YWESPJ1` принадлежит property `546448545` или нужному web stream.
- Что Google tag успешно загрузился, hits ушли из браузера и были ingest-нуты.
- Что событий ноль. `events=null` означает «данные не получены», а не
  `eventCount=0`.
- Любые GA4 counts, users, sessions, CR, funnel drop-offs или сравнение
  baseline/candidate.
- Что `generate_lead` отмечен единственным key event и custom dimensions
  реально созданы.
- Что события содержат правильные `experiment_id`, `site_version` и остальные
  params.
- Что runtime bundle синхронизирован с `js/analytics.js` и contract v2.
- Что `registration_completed` означает server-side persistence. Контракт
  доказывает только client-observed HTTP success + `data.ok=true`; server
  outcome должен подтверждаться отдельным источником.
- Что 403 вызван отсутствием property permission, disabled API или пустой
  property: scope blocker возникает раньше этих проверок.

Запрещённый вывод для downstream reconciliation:

> «GA4 показал 0 конверсий».

Допустимый вывод:

> «GA4 недоступен для чтения; конверсии и denominator не наблюдались».

## remediation spec

### R-01 — восстановить и доказать OAuth read access

1. Получить credential через private OAuth client либо service-account
   impersonation, как предлагает сохранённый provider warning.
2. Запросить минимально необходимый GA4 read scope; не сохранять access/refresh
   token в experiment artifacts.
3. Сохранить безопасный список фактически granted scopes или эквивалентное
   подтверждение scope без секретов.
4. Повторить тем же credential:
   - `get_property_details(property_id=546448545)`;
   - `run_report(property_id=546448545, ...)`.
5. Не считать пустой успешный report ошибкой: `success=true` с нулём rows
   означает доступный источник с нулевым результатом, а 403 — unavailable.

**Acceptance criteria:**

- оба вызова возвращают provider response без 401/403;
- `resourceAccess=verified`;
- raw artifact различает `success`, `empty`, `error`;
- normalized содержит `status=available`; `events` — массив, включая пустой,
  но не `null`;
- точный blocker снимается только после успешного повторного запроса.

### R-02 — верифицировать GA4 control-plane

После восстановления Admin read access зафиксировать:

1. property details и timezone;
2. доказанную связь нужного web data stream с `G-699YWESPJ1`;
3. что только `generate_lead` является key event в рамках данного контракта;
4. event-scoped custom dimensions:
   `experiment_id`, `site_version`, `selected_plan`, `failure_type`,
   `analytics_schema_version`;
5. решение по `form_surface` и `response_status`: зарегистрировать как
   reportable dimensions либо явно исключить их из GA4 reporting acceptance.

**Acceptance criteria:** каждый пункт имеет read-back evidence из GA4, а не
только желаемую настройку из markdown.

### R-03 — сделать event contract исполняемым

Изменить dispatcher по spec-first правилу:

1. до вызова любого provider проверять все
   `definition.requiredProperties`;
2. при missing/invalid property не отправлять event и возвращать
   структурированную contract error;
3. определить в contract типы и domains:
   - `selected_plan`: enum существующих plan IDs;
   - `form_surface`: enum известных форм;
   - `failure_type`: закрытый enum transport/HTTP/JSON/application классов;
   - `response_status`: integer 100–599;
4. добавлять `content_type`/`item_id` до единственного allowlist/sanitize pass;
5. различать результаты `logical_event_accepted`,
   `provider_call_queued`, `provider_call_failed`; не называть boolean `true`
   доставкой;
6. определить поведение для отсутствующего `gtag` и swallowed exception.

**Acceptance criteria:** ни один provider не вызывается для события с
missing/invalid required properties; итоговый payload состоит только из
allowlisted keys.

### R-04 — доказать соответствие source, bundle и triggers

1. Зафиксировать воспроизводимую сборку `js/main.bundle.js` из source и
   `contracts/analytics-events.json`.
2. Сохранить build/source/contract hashes и schema version в artifact
   проверки.
3. Интеграционно проверить реальные call sites:
   - `landing_viewed` — один раз на согласованном lifecycle;
   - `select_content` — на pricing CTA с plan ID;
   - `registration_form_opened` — один раз при первом focus;
   - `registration_attempted` — перед началом API request после browser
     validation;
   - `generate_lead` — только после HTTP success и `data.ok=true`;
   - `registration_failed` — на transport/HTTP/JSON/application failure и без
     `generate_lead`.

**Acceptance criteria:** загруженный `index.php` bundle имеет проверенный
contract hash/version; тесты проверяют triggers, а не только mapping функции.

### R-05 — добавить AAA-тесты контракта

Минимальная матрица Arrange–Act–Assert:

| Test | Assert |
|---|---|
| неизвестное logical event | providers не вызваны; explicit error/status |
| required property отсутствует | providers не вызваны |
| неизвестный property передан | он отсутствует во всех payloads |
| `pricing_plan_selected` валиден | GA4 получает `select_content`, `selected_plan`, `content_type`, `item_id` |
| confirmed success | GA4 получает ровно один `generate_lead` |
| HTTP 2xx + `data.ok!=true` | `generate_lead` отсутствует; есть failure |
| network/HTTP/JSON/application error | стабильный `failure_type`; PII/raw error отсутствуют |
| `gtag` отсутствует или throws | результат не маскируется как delivery success |

### R-06 — выполнить достаточную Data API проверку

После R-01/R-02:

1. выполнить event-level smoke для всех шести mapped GA4 events;
2. отдельно получить values зарегистрированных custom dimensions;
3. фильтровать отчёт по точным `experiment_id` и `site_version`;
4. сохранить `hostName`, event name, event count и необходимые dimensions;
5. использовать realtime report для оперативного smoke и обычный report для
   финального snapshot; не смешивать их как одну метрику;
6. фиксировать date range, property timezone, query arguments и полный
   provider status.

**Acceptance criteria:**

- в отчёте различимы все contract event names;
- rows однозначно относятся к текущим experiment/site versions;
- отсутствие rows после успешного запроса зафиксировано как observed zero, а
  не unavailable;
- PII отсутствует в dimensions и raw artifacts.

### R-07 — считать конверсию без подмены стадий

- GA4 denominator: `landing_viewed` текущих `experiment_id` +
  `site_version`.
- GA4 numerator: только `generate_lead` с теми же filters.
- `registration_attempted` — diagnostic funnel stage, не conversion.
- Client `generate_lead` означает confirmed client success, но не server
  persistence.
- Server export/leaderboard остаются outcome-источниками; GA4 с ними
  сопоставляется, но CR разных источников не усредняется.

### R-08 — нормализовать provenance

1. Имя raw-файла должно соответствовать `collectedAt`, либо artifact должен
   иметь отдельные `requestStartedAt`, `responseReceivedAt`, `writtenAt`.
2. Normalizer должен проверять, что source timestamps не противоречат
   timeline, и сохранять warning при расхождении.
3. SHA-256 source files оставить обязательным: текущая реализация этого
   инварианта корректна.
