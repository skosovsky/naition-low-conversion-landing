# Contract-First аудит аналитики

**Итерация:** `analytics-restoration-20260724`

**Дата аудита:** 2026-07-24

**Метод:** локальная статическая проверка цепочки `schema → event contract → dispatcher → providers → observations` и локальный запуск тестов. Сетевые источники не использовались.

## Итог

Текущая taxonomy в целом здравая: `registration_completed` отделено от
`registration_attempted` и `registration_failed`, а server/leaderboard названы
outcome-источниками. Но `exactly-one conversion` сейчас является соглашением в
Markdown, а не исполняемым инвариантом.

Ключевые блокеры достоверной reconciliation:

1. schema не исполняется тестами и не кодирует роль единственной конверсии;
2. dispatcher отправляет событие без обязательных свойств и сообщает `true`,
   даже если ни один provider не принял вызов;
3. 100 успешных simulator visits дают 101 server visits, 101 leaderboard
   requests и 101 Amplitude `Landing Viewed`, но visit нельзя классифицировать
   как `landing` или `technical_probe`;
4. `Registration Failed` не вошёл в Amplitude query, а GA4 и Yandex observations
   недоступны;
5. whitelist защищает explicit event properties, но не защищает URL:
   Yandex явно получает `location.href`.

Локальный `npm test` прошёл: **14/14**. Эти тесты подтверждают текущие happy
paths, но не валидируют JSON Schema, provider configuration, observation
artifacts, cohort membership или end-to-end exactly-once.

## Contract matrix

| Инвариант | Schema / contract | Dispatcher / providers | Observations | Вердикт | Evidence |
|---|---|---|---|---|---|
| Канонические logical event names | Текущий JSON использует `snake_case`; provider mappings полные | Dispatcher берёт mapping из contract | Amplitude names соответствуют mapping для пяти запрошенных событий | **Partial**: schema не ограничивает ключи `events` | `contracts/analytics-events.schema.json:45-50`; `contracts/analytics-events.json:16-81`; `tests/analytics-contract.test.mjs:95-114` |
| Ровно одна conversion taxonomy | `analytics-goals.md` называет только `registration_completed` единственной конверсией | Один вызов logical event делает по одному вызову каждого provider | Numerator равен 22 в simulator, server, leaderboard и Amplitude | **Partial**: роль conversion отсутствует в JSON/schema; at-most-once и 1:1 с persisted order не доказаны | `contracts/analytics-goals.md:5-12`; `js/analytics.js:76-95`; `simulator.json:17-20`; `server.json:15-20`; `leaderboard.json:7-11`; `normalized/amplitude.json:114-118` |
| Attempted ≠ completed ≠ failed | Триггеры разделены; completed требует успешный HTTP и `data.ok=true` | В emitter существуют три разные logical events | Amplitude видит 22 submitted и 22 completed | **Pass на taxonomy, Partial end-to-end**: failed не наблюдался/query не покрывает его | `contracts/analytics-events.json:48-80`; `normalized/amplitude.json:108-118` |
| Required properties обязательны | Имена перечислены, но schema проверяет только форму массива | Dispatcher не проверяет `definition.requiredProperties` | Observation artifacts не содержат property-coverage | **Fail** | `contracts/analytics-events.schema.json:67-74`; `contracts/analytics-events.json:70-75`; `js/analytics.js:57-69` |
| Common context обязателен | `analytics_schema_version`, `experiment_id`, `site_version` есть в whitelist, но не объявлены обязательными | Dispatcher добавляет их из contract/meta | Amplitude query фильтрует только experiment/site, не schema version; GA4/Yandex недоступны | **Partial**: implementation strong, formal contract weak | `contracts/analytics-events.json:5-14`; `js/analytics.js:51-55`; `normalized/amplitude.json:28-38`; `normalized/google-analytics.json:20-35`; `normalized/yandex-metrica.json:17-32` |
| Property types и bounded cardinality | Schema описывает только имена; нет type/enum per property | Sanitizer допускает любую строку ≤80, finite number или boolean | Нет breakdown, подтверждающего значения `selected_plan`, `failure_type`, `form_surface` | **Fail** | `contracts/analytics-events.schema.json:25-44`; `js/analytics.js:1-17`; `normalized/amplitude.json:40-118` |
| PII не уходит в explicit events | Текущий whitelist не содержит name/email/phone/raw error | Sanitizer отбрасывает неизвестные ключи; тест проверяет email/phone | `server.json` помечен `piiRedacted: true` | **Pass для explicit properties** | `contracts/analytics-events.json:5-15`; `js/analytics.js:19-35`; `tests/analytics-contract.test.mjs:29-50`; `server.json:4-6` |
| PII не уходит обходными путями | Goals запрещает URL с контактами | Yandex init передаёт полный `location.href`; GA config/page URL не проходит через sanitizer | Ни один artifact не доказывает redaction URL | **Fail / privacy risk** | `contracts/analytics-goals.md:28-34`; `index.php:9-17`; `index.php:340-350` |
| Provider mapping и isolation | Три provider mapping обязательны | Ошибка одного provider не блокирует остальные | Только Amplitude доступен end-to-end | **Pass unit-level, Fail observation coverage** | `contracts/analytics-events.schema.json:75-97`; `js/analytics.js:37-43,76-95`; `tests/analytics-contract.test.mjs:116-143`; `normalized/*.json` |
| Delivery result имеет однозначную семантику | Не определено | `trackLogicalEvent()` возвращает `true` для известного event независимо от наличия/ошибки providers | Delivery receipts отсутствуют | **Fail** | `js/analytics.js:57-61,76-98` |
| Registration Failed queryable | Mapping и `failure_type` объявлены | Event может быть отправлен всем трём providers | Amplitude query содержит только пять событий без `Registration Failed`; GA4/Yandex unavailable | **Fail** | `contracts/analytics-events.json:70-80`; `normalized/amplitude.json:40-118`; `normalized/google-analytics.json:5,35`; `normalized/yandex-metrica.json:5,32` |
| Custom dimension coverage | GA4 dimensions перечислены prose-only и покрывают 5 из 9 allowed properties | Все safe properties передаются одним объектом | Нет configuration snapshot или property breakdown | **Partial / unverifiable** | `contracts/analytics-goals.md:14-22`; `contracts/analytics-events.json:5-15`; `js/analytics.js:63-93` |
| Source/outcome boundary | Goals верно отделяет server/leaderboard outcome от client diagnostics | Dispatcher отвечает только за diagnostics | Artifacts используют разные shapes и не содержат общей `sourceRole`/`goalMapping`/eligibility schema | **Partial** | `contracts/analytics-goals.md:24-26`; `server.json`; `simulator.json`; `leaderboard.json`; `normalized/*.json` |
| Cohort denominator и visit kind | Event contract имеет только `landing_viewed`; visit kind отсутствует | `api/visit.php` подключается отдельно до bundle; correlation ID отсутствует в audited contract | simulator=100, server/leaderboard/Amplitude=101; extra visit назван probe только в notes | **Fail** | `index.php:19-20`; `simulator.json:10-20`; `server.json:15-20,39-42`; `leaderboard.json:7-11,23-25`; `normalized/amplitude.json:40-61` |
| Observation window и provenance | Observation schema отсутствует | — | Amplitude requested window 07:10–07:25, но response header охватывает сутки, terminal buckets `null`; `normalizedAt` предшествует timestamp query-файла в `sourceFiles.path` | **Fail / ambiguous** | `normalized/amplitude.json:2-14,28-38,108-125` |

## Violations and risks

| ID | Severity | Confidence | Нарушение / риск | Evidence и impact |
|---|---|---|---|---|
| AC-01 | **High** | **High** | JSON Schema не является executable contract | `package.json:5-14` не содержит schema validator, тест импортирует только event JSON (`tests/analytics-contract.test.mjs:10-12`). Schema не задаёт `propertyNames` для logical events и не связывает `requiredProperties` с `allowedProperties`. Невалидная следующая версия может пройти CI. |
| AC-02 | **High** | **High** | `requiredProperties` не enforced в runtime | Локальный adversarial probe вызвал `track('registration_failed', {})`: dispatcher вернул `true` и сделал 3 provider calls без `form_surface` и `failure_type`. Причина — `js/analytics.js:57-69`; definition читается, но `requiredProperties` не используется. Диагностическое событие становится неклассифицируемым. |
| AC-03 | **High** | **High** | Exactly-one выражено prose-only | `analytics-goals.md:11` — единственная декларация conversion role. Ни schema, ни event JSON не содержат `role`, `conversionEvent` или semantic constraint. Dispatcher гарантирует лишь один call/provider на один invocation, но не at-most-once на attempt/order и не 1:1 с persisted outcome. |
| AC-04 | **High** | **High** | Нет формального landing/technical visit boundary | Control panel утверждает 100 successful visits (`simulator.json:17`), но outcome denominator и Amplitude landing denominator равны 101. `server.json:41` классифицирует extra visit как probe по времени, без `traffic_class`, `run_id`, `eligible` или join evidence. В результате одновременно публикуются 22.0% и 21.78% для одного запуска. |
| AC-05 | **High** | **High** | `Registration Failed` не проверен как queryable event | Event есть в contract, но отсутствует в Amplitude query result целиком, а не как явный zero. GA4/Yandex observations недоступны. Нельзя отличить «ошибок не было» от «event не запрошен/не настроен». |
| AC-06 | **High** | **High** | Privacy contract обходится через page URL | Goals запрещает URL с контактами (`analytics-goals.md:30-32`), но Yandex получает `url: location.href` (`index.php:349`). Whitelist sanitizer защищает только explicit logical event properties. Query parameters с email/phone уйдут мимо него. Для GA4 локальный код также не задаёт sanitized `page_location` и не отключает automatic page view. |
| AC-07 | **High** | **High** | Amplitude totals не доказаны в candidate cohort window | Requested window 07:10–07:25 сохранён, но observed header — 00:00–23:55, а submitted/completed bucket cells равны `null` при total=22 (`normalized/amplitude.json:120-125`). Без raw-window semantic marker total нельзя уверенно привязать к simulator cohort. |
| AC-08 | **Medium** | **High** | Provider setup не является частью исполняемого контракта | Measurement/counter/project identifiers захардкожены или разбросаны между `index.php`, dispatcher и normalized context. Contract содержит только event names. Drift counter ID, GA measurement ID, Amplitude project или meta experiment ID не ловится tests. |
| AC-09 | **Medium** | **High** | Custom dimension coverage неполна и не наблюдается | GA4 prose перечисляет `experiment_id`, `site_version`, `selected_plan`, `failure_type`, `analytics_schema_version`, но ничего не говорит о queryability `form_surface`, `response_status`, `content_type`, `item_id`. Для Yandex/Amplitude нет machine-readable property mapping. Snapshot не делает breakdown даже по обязательным properties. |
| AC-10 | **Medium** | **High** | `true` означает «logical name известен», а не «event доставлен» | При отсутствующих GA/Yandex и исключении из Amplitude `track()` dispatcher всё равно возвращает `true` (`js/analytics.js:76-98`). Это опасная семантика для health checks и tests. |
| AC-11 | **Medium** | **High** | Observation artifacts нельзя валидировать одним contract | `server`, `simulator`, `leaderboard` и `normalized` имеют разные, не связанные schemas. Нет обязательных `sourceRole`, `goalMapping`, `cohort.start/end`, `eligibleDenominator`, `freshness`, `contractVersion`, `lineage`. `piiRedacted` есть только у server artifact. |
| AC-12 | **Medium** | **Medium** | Provenance timestamp противоречив | `normalized/amplitude.json:3` содержит `normalizedAt=08:20:55Z`, но один input path назван `08-22-11Z` (`:12`). SHA-256 всех перечисленных raw inputs локально совпадают, поэтому content provenance сохранён, но temporal provenance нуждается в исправлении или явном пояснении semantics имени файла. |
| AC-13 | **Medium** | **High** | Property contract не задаёт domains | `selected_plan`, `form_surface`, `failure_type`, `response_status` не имеют enum/type/range. Sanitizer ограничивает только primitive type и длину строки. Опечатки создадут новые cardinality values и пройдут tests. |

## Actionable spec changes

### 1. Сделать event contract исполняемым

В следующей major-версии контракта:

- добавить `propertyNames.pattern` для `events`;
- заменить голый `allowedProperties` на `propertyDefinitions`, где для каждого
  свойства заданы `type`, `enum`/`range`, `maxLength`, `piiClass` и
  `queryability`;
- объявить `commonRequiredProperties`:
  `analytics_schema_version`, `experiment_id`, `site_version`;
- в semantic validator проверять
  `event.requiredProperties ⊆ propertyDefinitions`;
- добавить `conversionEvent: "registration_completed"` и
  `events.*.role` из enum
  `denominator | funnel | diagnostic | conversion`;
- валидатор должен требовать ровно одно logical event с `role=conversion` и
  совпадение с `conversionEvent`.

Schema не может надёжно выразить все cross-field ссылки в текущем map shape.
Практичный вариант — оставить JSON Schema для shape и добавить небольшой
semantic validator, запускаемый тем же test command.

### 2. Enforce required properties и определить receipt

Dispatcher до provider calls должен:

1. провалидировать обязательные свойства и их domains;
2. при ошибке не отправлять event;
3. вернуть typed receipt, например:

```json
{
  "accepted": false,
  "logicalEvent": "registration_failed",
  "reason": "missing_required_properties",
  "missing": ["failure_type"],
  "providers": {}
}
```

Для принятого события receipt должен различать `invoked`, `unavailable` и
`threw`. Нельзя называть текущий boolean delivery status.

### 3. Формализовать exactly-once

- Conversion сохраняется только как `registration_completed`;
  `attempted`/`failed` никогда не получают conversion role.
- На один registration attempt допускается ровно один terminal client event:
  `completed XOR failed`.
- Повторный submit/retry использует server-side idempotency key; key не
  отправляется analytics providers и не нарушает PII policy.
- Server snapshot хранит privacy-safe агрегат:
  `uniqueAcceptedIdempotencyKeys`, `persistedOrders`, `duplicateRequests`.
- Reconciliation проверяет aggregate invariant:
  `completed <= persistedOrders`, а расхождения классифицирует как
  response loss, analytics loss/lag или duplicate suppression. Без
  privacy-safe join нельзя утверждать 1:1.

### 4. Разделить landing visit, technical request и eligible denominator

Добавить к server/simulator contract:

```json
{
  "trafficClass": "simulated_landing | technical_probe | organic_landing",
  "runEvidenceId": "analytics-restoration-20260724:100",
  "eligible": true
}
```

Outcome artifact должен публиковать отдельно:

- `rawRequests`;
- `landingVisits`;
- `technicalRequests`;
- `eligibleVisits`;
- `persistedOrders`;
- `conversionRate = persistedOrders / eligibleVisits`.

До появления такого признака нельзя автоматически исключать 101-й request:
notes — это гипотеза, не contract evidence.

### 5. Ввести общий observation contract

Для каждого snapshot обязательны:

```json
{
  "contractVersion": "analytics-events@3.0.0",
  "source": "server | leaderboard | ga4 | yandex | amplitude | simulator",
  "sourceRole": "outcome | diagnostic | control_plane",
  "goalMapping": "registration_completed -> provider event/order",
  "cohort": {"start": "UTC", "end": "UTC", "eligibilityRule": "..."},
  "numerator": 22,
  "denominator": 101,
  "collectedAt": "UTC",
  "freshness": {"status": "fresh | stale | unknown", "lagSeconds": 0},
  "piiRedacted": true,
  "provenance": {"inputs": [{"path": "...", "sha256": "..."}]}
}
```

`simulator` — `control_plane`, server/leaderboard — `outcome`, три client
providers — `diagnostic`. Добавить `lineage` для leaderboard, чтобы его не
считать независимым от server storage. Не усреднять conversion rates.

### 6. Сделать failure и properties queryable

- Каждый provider snapshot запрашивает все шесть logical events.
- Отсутствующий event записывается как `eventTotal: 0` с
  `queryStatus: "queried"`, а не пропускается.
- `Registration Failed` включает breakdown по `failure_type`; completed и
  failed — по `form_surface`, `selected_plan`, `response_status`.
- Provider property map должен помечать параметр как
  `native`, `custom_dimension`, `goal_parameter` или `not_queryable`.
- Observation query фильтруется также по `analytics_schema_version`.
- Для terminal events snapshot обязан вернуть bucket/window attribution либо
  статус `window_unverified`; daily total нельзя молча считать cohort total.

### 7. Закрыть URL privacy

- Не передавать `location.href` третьим сторонам. Использовать URL без
  `search`, `hash` и userinfo.
- Для GA4 отключить implicit page view или отправлять explicit sanitized
  `page_location`.
- Для Yandex передавать sanitized path и документировать Webvisor privacy
  configuration.
- Сохранить `ym-disable-keys`, `ym-hide-content`, отключённый Amplitude
  autocapture и explicit whitelist.
- Schema должна запрещать не только точные `email`/`phone`, но и алиасы
  (`user_email`, `mobile_phone`, `full_name`, `query_string`, `page_url`) через
  approved property catalog, а не расширяемый blacklist.

### 8. Синхронизировать provider identities

Вынести public provider identities в contract или отдельный versioned
deployment contract:

- GA4 `measurementId`;
- Yandex `counterId`;
- Amplitude `projectId` и public API key identifier/fingerprint;
- DOM `experimentId` и `siteVersion`.

Добавить contract test, который сверяет их с `index.php`, dispatcher и
observation context. Secret values в artifacts не сохранять.

## Required tests

Все новые tests оформить AAA.

### Schema and semantic contract

1. Валидный production contract проходит Draft 2020-12 validator.
2. Logical event `Registration Completed` или `registration-completed`
   отклоняется.
3. `requiredProperties` вне property catalog отклоняется.
4. Удаление common context property отклоняется.
5. Ноль или две conversion roles отклоняются.
6. PII aliases, URL/query и submission/idempotency IDs в analytics property
   catalog отклоняются.
7. Provider mapping, goals table и provider identities не расходятся.

### Dispatcher

1. Missing `form_surface`/`failure_type` даёт rejected receipt и **0** calls.
2. Invalid `selected_plan`, `failure_type` и `response_status` дают rejected
   receipt.
3. Unknown event даёт rejected receipt.
4. Один provider throws: receipts остальных сохранены.
5. Все providers unavailable: `accepted=true`, но delivery statuses явно
   `unavailable`; тест не трактует это как доставку.
6. GA4 derived parameters для pricing (`content_type`, `item_id`) описаны
   contract и проверяются без hard-coded logical-name branch.

### Exactly-one registration

1. Один successful response → один `completed`, ноль `failed`.
2. HTTP/transport/invalid JSON/application failure → один `failed`, ноль
   `completed`.
3. Double submit до завершения первого request не создаёт второй attempt/order.
4. Retry с тем же idempotency key не создаёт второй persisted order или второй
   conversion.
5. Persisted order + lost response фиксируется как outcome/diagnostic
   discrepancy, а не как ложное совпадение.

### Privacy and DOM integration

1. `index.php` не передаёт `location.href` provider SDK.
2. URL с `?email=...&phone=...` превращается в sanitized page location.
3. Form inputs и dynamic messages сохраняют provider masks.
4. Meta experiment/site version совпадают с deployment/event contracts.
5. Provider counters/project identifiers совпадают с observation context.

### Observation and reconciliation

1. Все source artifacts валидируются общей observation schema.
2. Все шесть events присутствуют; zero отличается от unavailable/not queried.
3. `Registration Failed` query возвращает zero или breakdown по
   `failure_type`.
4. Terminal totals без подтверждённого cohort window маркируются
   `window_unverified` и не участвуют в exact reconciliation.
5. Fixture `100 simulator + 1 technical probe` выдаёт отдельно raw=101,
   eligible=100 и не меняет denominator без формального `trafficClass`.
6. Outcome и diagnostics сравниваются отдельно; leaderboard lineage не
   считается независимым measurement.
7. `normalizedAt >= max(input.collectedAt)`; SHA каждого input проверяется.

## Acceptance criteria

Аналитический контракт можно считать восстановленным, когда:

- schema и semantic validator запускаются в `npm test`;
- required properties не могут уйти пустыми;
- `conversionEvent` и ровно одна conversion role валидируются;
- 101-й request имеет доказуемый `trafficClass` и eligibility;
- `Registration Failed` queryable у каждого доступного provider;
- все snapshots содержат cohort, goal mapping, source role, freshness и
  provenance;
- URL privacy закрыта до provider initialization;
- candidate numerator/denominator reconciled без смешивания outcome,
  diagnostics и control-plane evidence.
