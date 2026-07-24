# Skill retrospective

## Что сработало

- Один mutation-controller и один Git writer не допустили повторного redeploy
  или второго simulator run.
- Outcome и diagnostic denominators не усреднялись.
- PII-redacted raw MCP evidence было сохранено и захешировано до файлового
  fan-out.
- Ровно пять независимых аудиторов работали только с локальными snapshots.

## Где skill подвёл

- Первоначальный preflight считал browser auth достаточным и не требовал
  отдельный MCP smoke до мутаций.
- Schema требовала `status=ok` у всех providers и не позволяла честно
  завершить итерацию с воспроизводимым blocker.
- Validator требовал ровно 100 server visit IDs, смешивая simulator successes
  с server denominator 101.
- Не было строгого порядка raw → checksums → normalized → file-only analysis.
- Не были формализованы provenance MCP, GA ADC scopes, Yandex OAuth evidence,
  Amplitude response semantics и алгоритм skill hash.

## Внесённый patch

- Добавлен MCP-first provenance/auth gate и запрет browser substitution.
- Добавлены immutable raw evidence, checksum gate, отдельная normalization
  stage и file-only fan-out.
- Добавлена модель нескольких denominator и недоказанного technical probe.
- Manifest schema принимает `available|unavailable|stale`; недоступный
  provider принудительно ведёт к `inconclusive`.
- Validator проверяет core artifacts, raw checksums, normalization chronology,
  one-shot simulator evidence и server IDs относительно фактического
  denominator.
- Описаны provider-specific failure modes и UI fallback только для writes.

Previous skill hash:
`sha256:f41e5bf419fb2f886f971559decfc3171017cf8f2e6c7260bcf385cad96a82aa`.

Current skill hash:
`sha256:43c96818ab58292f4baaebcd9a36cd3435f65167dd9761e68a06d6b701b3ee61`.

Первый forward-test корректно отказался считать итерацию завершённой без
`manifest.json` и заметил несовместимость checksum path format. Validator
исправлен так, чтобы принимать и iteration-relative `raw/...`, и repo-relative
`experiments/<id>/raw/...`, не ослабляя path safety. Второй проход выявил
locale-dependent sorting и отсутствие SHA lineage у server/leaderboard:
hash теперь считается bytewise и перепроверяется validator, а все normalized
sources обязаны содержать проверяемые input SHA-256.

Третий независимый проход завершился `PASS`: validator, skill hash, `5/5` raw
checksums и lineage всех пяти normalized sources совпали.
