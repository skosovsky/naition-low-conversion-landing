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

- До запуска создать `manifest.draft.json` со статусом `planned`; draft не
  обязан проходить final schema. После полной проверки сформировать
  `manifest.json` со статусом `completed` по JSON Schema.
- Client evidence key для redeploy: `<iterationId>:<candidateSha>`.
- Simulator key: `<iterationId>:100`.
- Если deploy/simulator evidence уже записан, повторный вызов запрещён; сначала проверить
  status.
- Никогда не делить один browser tab/focus между агентами.

## Fan-out данных

1. Один ingestion-agent владеет analytics auth и по очереди снимает raw MCP
   snapshots для согласованного requested window.
2. Сохранить полный tool envelope до анализа. До fan-out удалить PII и секреты,
   вычислить checksum и закрыть raw-набор от перезаписи.
3. Построить отдельные normalized snapshots со ссылками на raw SHA-256.
4. Только после этого запустить независимых file-only auditors. В prompt явно
   запретить MCP, browser, UI, сеть и изменения чужих artifacts.
5. Раздать immutable shards с явным списком visit IDs.
6. Aggregator проверяет missing/duplicate IDs, checksum входов и то, что
   normalized timestamp не предшествует raw collection.

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
ответить в этом окне, вернуть `unavailable`/`stale`, точный blocker и raw
evidence, а не подменять период. Финальный validator принимает такой источник
только вместе с decision `inconclusive`.

## Hash contract

`skill.versionHash` считать как SHA-256 от строк:
`<file-sha256><two spaces><relative-path>\n`, отсортированных по
`relative-path` bytewise в C/POSIX-порядке, для всех файлов skill кроме
временных и системных файлов. Validator обязан пересчитать hash, а не
проверять только формат.
