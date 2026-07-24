# Contract-first analytics tuning

Статус: draft for the next deployment. В текущей итерации provider settings и
код сайта не изменялись после измеренного SHA `20ba87b240c8e87d88e6e087e6b6112fa567431e`.

## Канонические события

| Logical event | Trigger/source of truth | Required properties | Conversion role |
|---|---|---|---|
| `landing_viewed` | один инициализированный landing document | common context | diagnostic denominator |
| `pricing_plan_selected` | CTA тарифа с валидным `selected_plan` | `selected_plan` | diagnostic |
| `registration_form_opened` | первый focus внутри формы | `form_surface`, `selected_plan` | diagnostic |
| `registration_attempted` | начало одного разрешённого API request | `form_surface`, `selected_plan` | attempted only |
| `registration_completed` | HTTP success, `data.ok=true`, server order persisted | `form_surface`, `selected_plan`, `response_status` | единственная conversion |
| `registration_failed` | terminal transport/HTTP/JSON/application failure | `form_surface`, `selected_plan`, `failure_type`, `response_status` where known | diagnostic |

На один attempt разрешён ровно один terminal event:
`registration_completed XOR registration_failed`. Boolean dispatcher result не
является подтверждением доставки; нужен receipt по каждому provider.

## Property catalog

| Property | Type | Allowed values |
|---|---|---|
| `analytics_schema_version` | semver string | immutable common context |
| `experiment_id` | slug | immutable common context |
| `site_version` | slug | immutable common context |
| `selected_plan` | enum | `not_selected`, `basic`, `advanced`, `corporate` |
| `form_surface` | enum | `registration` |
| `failure_type` | enum | `network`, `http`, `invalid_json`, `application`, `unknown` |
| `response_status` | integer/null | `100..599` or null |
| GA4 `content_type` | enum | `pricing_plan` |
| GA4 `content_id` | enum | the same stable plan ID |

Event properties не могут переопределять common context. Missing/invalid
required property rejects dispatch with zero provider calls.

## Provider configuration

- GA4: `generate_lead` — единственный key event; counting method `once per
  event`. Зарегистрировать event-scoped custom dimensions
  `analytics_schema_version`, `experiment_id`, `site_version`,
  `selected_plan`, `form_surface`, `failure_type`. Для `select_content`
  использовать `content_id`, не `item_id`.
- Yandex Metrica: exact JavaScript goals для шести logical events;
  `registration_completed` — primary conversion. Подтвердить goal ID ↔ JS
  identifier через read API до следующего run.
- Amplitude: шесть event types и property definitions в Tracking Plan;
  contract version Official только после property validation. Autocapture и
  Session Replay выключены; запросить `Registration Failed` и required-property
  breakdown в verification query.

## Privacy

Запрещены name, email, phone, FormData, raw error messages, submission/
idempotency IDs, query string, fragment, userinfo и полный `location.href`.
Page location передаётся только как sanitized origin + pathname. Yandex form
inputs сохраняют `ym-disable-keys`, dynamic messages — `ym-hide-content`.

## Observation contract

Каждый source snapshot обязан содержать source role, goal mapping, numerator,
denominator и его семантику, requested/observed window, collectedAt, freshness,
sampling/thresholding, PII status и raw SHA-256. `zero`, `not queried`,
`unavailable` и `stale` — разные состояния.

Server/leaderboard — outcome; simulator — control plane; GA4/Yandex/Amplitude —
diagnostics. Их CR не усредняются. Technical probe исключается из denominator
только при формальном `trafficClass`/eligibility evidence.

## Change gate

Provider write выполнять только vendor MCP с последующей read-only
verification. UI — только документированный fallback после отсутствующей или
ошибочной MCP write capability. Если read verification недоступна, настройка
остаётся `unverified` и новый simulator run запрещён.
