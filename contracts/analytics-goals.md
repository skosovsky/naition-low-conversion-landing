# Analytics goals

Канонический контракт событий: `analytics-events.json`.

| Логическое событие | GA4 | Yandex Metrica | Amplitude | Роль |
|---|---|---|---|---|
| `landing_viewed` | `landing_viewed` | `landing_viewed` | `Landing Viewed` | клиентский denominator |
| `pricing_plan_selected` | `select_content` | `pricing_plan_selected` | `Pricing Plan Selected` | выбор тарифа |
| `registration_form_opened` | `registration_form_opened` | `registration_form_opened` | `Registration Form Opened` | начало формы |
| `registration_attempted` | `registration_attempted` | `registration_attempted` | `Registration Form Submitted` | попытка |
| `registration_completed` | `generate_lead` | `registration_completed` | `Registration Completed` | единственная конверсия |
| `registration_failed` | `registration_failed` | `registration_failed` | `Registration Failed` | диагностика |

## Настройка свойств

- GA4: отметить только `generate_lead` как key event. Создать event-scoped
  custom dimensions для `experiment_id`, `site_version`, `selected_plan`,
  `failure_type` и `analytics_schema_version`.
- Yandex Metrica: создать JavaScript goals с ID из таблицы. Основная цель —
  `registration_completed`; остальные нужны для воронки и диагностики.
- Amplitude: добавить события и свойства в tracking plan и пометить
  проверенный контракт как Official.

В отчётах фильтровать по `experiment_id` и `site_version`. Server export и
leaderboard остаются outcome-источниками; три клиентские аналитики не
усредняются с серверной конверсией.

## Privacy

Разрешены только свойства из `allowedProperties`. Имя, телефон, email,
`FormData`, raw error messages, URL с контактами и уникальные submission IDs
не отправляются ни одному провайдеру. Amplitude autocapture и Session Replay
отключены; используются только явные события из контракта. Поля формы помечены
`ym-disable-keys`, а динамический ответ сервера — `ym-hide-content`.
