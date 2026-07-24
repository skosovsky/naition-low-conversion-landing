# Мультиагентная оркестрация

## Роли

| Роль | Права | Единственный writer |
|---|---|---|
| mutation-controller | panel status/redeploy/run-bot | да |
| git-writer | site files, commit, push | да |
| source-collector | один analytics source, read-only | только `sources/<source>.json` |
| webvisor-worker | свой shard visit IDs | только файлы shard |
| aggregator | validation/comparison/decision | `comparison.json`, `decision.md` |

Mutation-controller и git-writer могут быть одним агентом. Остальные роли не
вызывают state-changing endpoints.

## Ownership и idempotency

- До запуска создать `manifest.draft.json` со статусом `planned`. После полной
  проверки сформировать immutable `manifest.json` со статусом `completed` по
  JSON Schema.
- Client evidence key для redeploy: `<iterationId>:<candidateSha>`.
- Simulator key: `<iterationId>:100`.
- Если deploy/simulator evidence уже записан, повторный вызов запрещён; сначала проверить
  status.
- Никогда не делить один browser tab/focus между агентами.

## Fan-out данных

1. Один ingestion path снимает raw snapshot.
2. До fan-out удалить PII и секреты, вычислить checksum.
3. Раздать immutable shards с явным списком visit IDs.
4. Aggregator проверяет missing/duplicate IDs и checksum входов.

Оптимальный shard Webvisor — 5–10 визитов. Один worker на визит создаёт лишний
overhead; один worker на весь архив скрывает пропуски.

## Согласованность источников

Все collectors получают один contract:

```json
{
  "iterationId": "iter-...",
  "candidateSha": "hex",
  "cohort": {"start": "UTC", "end": "UTC"},
  "goal": "source-specific goal mapping",
  "artifact": "sources/<source>.json"
}
```

Collector не меняет cohort и goal самостоятельно. Если источник не может
ответить в этом окне, вернуть `unavailable`/`stale`, а не подменять период.
