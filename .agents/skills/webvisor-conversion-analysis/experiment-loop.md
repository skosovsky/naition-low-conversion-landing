# Контракт итерации

Использовать при любом цикле `изменение → deploy → simulator → сравнение`.

## Preflight: gate до внешних мутаций

Подтвердить и сохранить в `preflight.json`:

1. Чистый scope Git diff, доступ к push и candidate SHA.
2. `site_url`, `control_panel_url`, `leaderboard_url`.
3. OpenAPI control-plane: методы redeploy, status, run-bot и их параметры.
4. Read-access: server export, Yandex Metrica, GA4, Amplitude, leaderboard.
   Для трёх клиентских аналитик сохранить MCP tool inventory и минимальный
   read-only smoke. Browser/UI не является подтверждением MCP access.
5. Goal mapping каждого источника и допустимую freshness/lag.
6. Наличие exclusive mutation-controller и Git writer.

Если обязательный источник недоступен, остановиться **до** redeploy/run-bot.
Если итерация уже была запущена до обнаружения blocker, не повторять мутацию:
зафиксировать источник как `unavailable` и завершить решение как
`inconclusive`.

## Append-only layout

```text
experiments/<iteration-id>/
├── preflight.json
├── manifest.json
├── deploy.json
├── simulator.json
├── raw/
│   ├── <timestamp>-<provider>-mcp-*.json[l]
│   └── checksums.sha256
├── normalized/
│   ├── server.json
│   ├── yandex-metrica.json
│   ├── google-analytics.json
│   ├── amplitude.json
│   └── leaderboard.json
├── audits/
├── comparison.json
├── decision.md
└── skill-review.md
```

Не перезаписывать прошлую итерацию. Все timestamps — ISO 8601 UTC.

## Эксперимент

1. Зафиксировать baseline: numerator, denominator, CR, SHA, run ID.
2. Выбрать одну гипотезу или coherent bundle.
3. Реализовать, проверить, commit и push.
4. Перед redeploy сверить local SHA с remote branch SHA и сохранить оба.
   Если panel не возвращает deployment ID/SHA, добавить в страницу уникальный
   version marker итерации, сохранить hash ответа panel и после terminal status
   проверить marker на live HTML. Это evidence chain, а не server-attested SHA.
5. После успешного deploy один раз вызвать simulator с `visits=100`. Если API
   не возвращает run ID, использовать client evidence ID и hash ответа, не
   выдавая их за server-issued run ID.
6. Дождаться terminal status или зафиксировать наблюдаемые status transitions,
   если schema status не формализована. Не открывать live page JS-браузером в cohort:
   `api/visit.php` добавляет визит.
7. Снять server snapshot сразу; для delayed analytics дождаться установленной
   freshness, не расширяя cohort.
8. Снять leaderboard detail после его cache window и найти новый run около 100
   запросов. Не смешивать малые посторонние runs.
9. Сначала сохранить raw MCP responses, затем проверить checksums и только
   после этого построить normalized snapshots. Лишь затем запускать файловых
   аудиторов.
10. Сверить источники, но не усреднять их.
11. Решение: `promote`, `revert`, `inconclusive`.

Последовательный baseline/candidate — `before_after`. Использовать `randomized_ab`
только при реальном случайном распределении вариантов.

## Каноническая метрика

- Outcome: server-side persisted order и leaderboard.
- Diagnostics: Yandex, GA4, Amplitude.
- Для каждого snapshot хранить metric/goal mapping, numerator, denominator,
  denominator semantics, window, collectedAt, freshness, sampling/thresholding
  status и artifact provenance.
- Расхождения оформлять как discrepancy с возможной причиной: lag, другое goal
  mapping, bot filtering, cache или неполный cohort.
- `100` requested/successful simulator visits не обязаны равняться server или
  leaderboard denominator. Не удалять лишний visit из evidence; хранить оба
  числа и отделять подтверждённый факт от гипотезы о technical probe.

## MCP-specific preflight

- **GA4:** проверить оба Admin/Data API вызова. Для ADC заранее проверить scope
  `analytics.readonly`; `authorized_user` credential без подтверждённого scope
  не считать рабочим.
- **Amplitude:** сначала подтвердить project ID. Не использовать
  `set_project_context` как read-only selector: это изменение AI context.
  Сохранять полный response shape; formula totals не выдавать за ordered funnel.
- **Yandex Metrica:** зафиксировать package/endpoint provenance. Для community
  package сохранить точный OAuth redirect URI и provider error. Не приписывать
  ownership/root cause без authorization trace и client registration evidence.

## Privacy

`api/export.php` может вернуть PII. Collector сохраняет только counts, IDs,
timestamps и агрегаты, ставит `piiRedacted: true`. Raw body не отдавать
субагентам и не коммитить.

## Ретроспектива skill

После decision записать:

- что skill заставил сделать правильно;
- где потребовалось ручное восстановление контекста;
- какие gate/contract/validator отсутствовали;
- минимальный patch skill;
- hash skill до и после patch.

Следующая итерация использует новый immutable skill hash.
