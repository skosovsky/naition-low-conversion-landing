# Main-agent resolution

Этот файл разрешает противоречия пяти независимых file-only аудитов. Он не
является шестым независимым аудитом и не добавляет live evidence.

- **Amplitude chronology:** замечание о `normalizedAt=08:20:55Z` было
  корректным для проверенной версии файла. Derived snapshot пересобран после
  raw capture с `normalizedAt=08:35:07Z`; validator теперь проверяет, что
  normalized timestamp не предшествует timestamped raw inputs. У JSONL всё ещё
  нет собственного top-level `collectedAt`, поэтому capture time опирается на
  immutable filename/request ID и явно отмечен как process deviation.
- **Amplitude funnel:** `101 → 100 → 22 → 22 → 22` трактуется только как
  aggregate step-count ladder. Drop-off `78/100` — разница независимых event
  sets, не доказанная user-level последовательность.
- **Yandex OAuth attribution:** подтверждён provider response
  `redirect_uri_mismatch` в configured community MCP login flow.
  Ownership OAuth application, зарегистрированные callback URLs и полная
  root cause не подтверждены; normalized/manifest используют осторожную
  формулировку.
- **GA4 scope:** подтверждён код `ACCESS_TOKEN_SCOPE_INSUFFICIENT` на Admin и
  Data API. `analytics.readonly` записан как remediation scope, а не результат
  token introspection.
- **101-й visit:** server, leaderboard и Amplitude Landing Viewed согласованы
  на 101, simulator — на 100 successful visits. Technical probe — наиболее
  компактная гипотеза, но без identity/trafficClass evidence; канонический
  outcome остаётся `22/101`.
- **Provider delivery:** `trackLogicalEvent() === true` не считается delivery
  confirmation. Текущая проверка подтверждает только aggregate Amplitude
  counts; GA4/Yandex observations остаются unavailable.
- **Decision:** `inconclusive` следует из статистики и неполного provider
  coverage. Оно не утверждает ни причинное падение конверсии, ни полное
  восстановление всех трёх аналитик.
