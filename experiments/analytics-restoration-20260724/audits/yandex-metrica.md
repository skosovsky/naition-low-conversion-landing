# Аудит интеграции Яндекс.Метрики

## Scope

Аудит выполнен только по локальным артефактам репозитория, без MCP-вызовов,
браузера, UI, сетевых запросов и доступа к счётчику:

- `raw/2026-07-24T07-52-53Z-yandex-metrica-mcp-smoke.json`;
- `normalized/yandex-metrica.json`;
- `contracts/analytics-events.json`;
- `contracts/analytics-goals.md`;
- `js/analytics.js`;
- `index.php`;
- `.codex/config.toml`.

Проверены: provenance MCP, корректность формулировки OAuth-блокера,
согласованность counter ID, контракт целей и свойств, privacy-ограничения,
границы выводов без данных счётчика и варианты восстановления доступа без
создания нового OAuth application.

## Evidence

| Evidence | Наблюдение | Доказательная сила |
|---|---|---|
| `.codex/config.toml` | Локально настроен запуск `npx -y yandex-metrica-mcp@0.3.0`; counter ID — `110921681` | Прямое доказательство конфигурации запуска, но не фактически загруженного tarball или запущенного бинарника |
| raw MCP smoke | Артефакт объявляет community-пакет BoxLab, список tools, отказ `describe_counter` до доступа к ресурсу и OAuth 400 `redirect_uri does not match...` | Снимок результата, но без MCP envelope, tool schema, stdout/stderr, request/response trace, package integrity и независимой аттестации сервера |
| normalized snapshot | `status=unavailable`, `counterAccessSucceeded=false`, `oauthSucceeded=false`, `events=null` | Производный артефакт; новых counter data не содержит |
| SHA-256 raw-файла | Фактический SHA-256 равен `cfe24dc56211158425510522c977620e0840dc2cb1fa65efb8664c0d5dabba51` и совпадает с `normalized.sourceFiles[0].sha256` | Подтверждает целостность связи raw → normalized, но не истинность содержания raw |
| `contracts/analytics-events.json` | Шесть логических событий; `registration_completed` требует успешный HTTP status и `data.ok=true`; объявлены allowlist и required properties | Канонический статический контракт |
| `contracts/analytics-goals.md` | Только `registration_completed` назван конверсией; остальные Yandex goals предназначены для воронки/диагностики | Документированный план настройки, не доказательство настройки счётчика |
| `js/analytics.js` | `ym(110921681, 'reachGoal', goalName, properties)`; свойства фильтруются по allowlist; исключения провайдеров подавляются | Прямое доказательство поведения dispatcher, но не его подключения в production bundle и не доставки событий |
| `index.php` | Инициализирован counter `110921681`; Webvisor включён; форма и поля имеют `ym-disable-keys`, динамический ответ — `ym-hide-content`; загружается `js/main.bundle.js` | Статическая разметка и конфигурация страницы, но не runtime/network evidence |

Counter ID `110921681` согласован во всех проверенных местах. Experiment ID
`analytics-restoration-20260724` согласован между контрактом и meta-тегом;
site version в разметке — `measurement-v2-20260724`.

## Findings

### F1. Доступ к счётчику и данные событий не подтверждены

**Severity:** High
**Confidence:** High

`describe_counter` завершился до resource access, а normalized snapshot прямо
фиксирует `counterAccessSucceeded=false` и `events=null`. Поэтому текущий набор
артефактов подтверждает только локальную конфигурацию и неуспешную попытку
аутентификации. Он не подтверждает существование/доступность счётчика,
настройку целей или получение хотя бы одного события.

Это блокер аналитической верификации, но не доказательство поломки клиентской
отправки.

### F2. Provenance MCP описан, но не аттестован

**Severity:** Medium
**Confidence:** High

Конфиг закрепляет строку версии `yandex-metrica-mcp@0.3.0`, а raw-файл
самоописывается как community BoxLab implementation с core package `0.1.1`.
Однако нет lockfile/tarball hash, resolved package metadata, executable path,
startup log, MCP initialize response, tool schemas или полного tool-call
envelope. `npx -y` также означает разрешение пакета через registry при запуске;
строка версии не является supply-chain attestation.

Следовательно, локально можно утверждать: «сконфигурирован и в raw обозначен
community MCP package». Нельзя независимо утверждать, что smoke был выполнен
именно неизменённым `yandex-metrica-mcp@0.3.0`, что core package имел указанную
версию или что опубликованный список tools/read-only semantics принадлежал
этому бинарнику.

### F3. Наблюдаемый OAuth-блокер реален, но его root-cause и ownership
сформулированы точнее, чем позволяет evidence

**Severity:** High
**Confidence:** High

Надёжно зафиксированы следующие факты:

- login использовал embedded client ID
  `6f14d1c1384440b1b2915f6d956da84b`;
- в raw указан requested redirect URI
  `https://oauth.yandex.com/verification_code`;
- provider вернул HTTP 400 с `redirect_uri does not match the Callback URL
  defined for the client`;
- counter resource после этого не читался.

Но один агрегированный raw-файл не показывает фактический authorization
request, зарегистрированные callback URLs OAuth application, владельца
application или повторные независимые прогоны. Дополнительно raw одновременно
упоминает `mode=oob`, requested verification URL и package loopback URI
`http://127.0.0.1:53682/callback`, не показывая, какой кодовый путь выбрал URI
и почему.

Поэтому безопасная формулировка блокера:
`observed OAuth redirect_uri mismatch in the configured community MCP login
flow; counter access remains unverified`.

Формулировки `owned by the third-party MCP package`, «embedded client не
зарегистрирован для URI, который сам отправляет» и `reproducible=true` являются
правдоподобной диагностикой, но не доказанным фактом из предоставленного
набора. Также нельзя утверждать, что это единственный блокер: после исправления
login ещё могут проявиться scope, user/counter permission, API или quota
ограничения.

### F4. Required properties объявлены, но dispatcher их не валидирует

**Severity:** High
**Confidence:** High

Контракт требует:

- `selected_plan` для `pricing_plan_selected`;
- `form_surface` для open/attempted/completed;
- `form_surface` и `failure_type` для failed.

`trackLogicalEvent` проверяет только наличие имени события и allowlist ключей.
Он не проверяет `definition.requiredProperties`, типы, непустые значения или
допустимые enum. Вызов, например, `registration_completed` без `form_surface`
всё равно будет отправлен и вернёт `true`.

Это нарушает Contract-First семантику и способно создать неразрезаемые
события в отчётах. `true` означает лишь «логическое имя найдено и dispatch
попытался выполниться», а не доставку в Метрику: ошибки подавляются, callback
подтверждения отсутствуют.

### F5. Общие атрибуты эксперимента допускают override со стороны события

**Severity:** High
**Confidence:** High

В dispatcher объект собирается в порядке:

```text
{ ...commonProperties, ...eventProperties }
```

Поэтому вызывающий код может заменить или удалить через невалидное значение
`analytics_schema_version`, `experiment_id` и `site_version`. Все три ключа
входят в allowlist, так что строковый override будет принят. Это прямо
подрывает требование фильтровать отчёты по `experiment_id` и `site_version`.

### F6. Имена целей и allowlist статически согласованы, но полнота wiring не
доказана

**Severity:** Medium
**Confidence:** High

Yandex goal names в JSON-контракте и `analytics-goals.md` совпадают.
`analytics.js` берёт Yandex goal name из контракта и использует корректный
counter ID. Все common/event properties из required lists присутствуют в
`allowedProperties`; производные `content_type` и `item_id` для выбора тарифа
также разрешены. `data-plan-id` в разметке ограничен значениями `basic`,
`advanced`, `corporate`.

При этом `index.php` загружает только `js/main.bundle.js`, а не
`js/analytics.js`/контракт напрямую. В проверенном scope нет evidence, что
bundle действительно создаёт dispatcher и вызывает все шесть событий в
оговорённых точках. В разметке также нет `form_surface`: его значение должно
добавляться вызывающим кодом, который здесь не подтверждён.

### F7. Privacy-защита присутствует в разметке, но отсутствие утечек не
подтверждено

**Severity:** Medium
**Confidence:** Medium

`sanitizeEventProperties` отбрасывает ключи вне allowlist, поэтому имя,
телефон, email, `FormData`, raw error и submission ID не должны пройти через
этот dispatcher под собственными ключами. На форме/полях присутствует
`ym-disable-keys`, на динамическом ответе — `ym-hide-content`.

Однако значения разрешённых строковых полей не валидируются по семантике и
могут содержать PII при ошибке вызывающего кода. Кроме того, Webvisor включён,
а без runtime/counter data нельзя подтвердить применение masking, отсутствие
других каналов отправки или фактическую конфигурацию записи.

## Unavailable-data limits

Без counter data и успешного read-access нельзя утверждать:

- что counter `110921681` существует, принадлежит нужному аккаунту, принимает
  данные с нужного домена и доступен текущему пользователю;
- что JavaScript goals с шестью IDs созданы, активны и что только
  `registration_completed` помечена основной конверсией;
- что `reachGoal` вызовы реально достигают Метрики, не блокируются CSP,
  ad blocker, consent logic или сетевыми ошибками и не дублируются;
- количество просмотров, попыток, завершений, CR, funnel drop-off, latency,
  attribution, Webvisor sessions или качество сегментации;
- что фильтры `experiment_id`/`site_version` заполнены корректно в реальных
  событиях;
- что `registration_completed` соответствует server-side persistence;
  контракт подтверждает только HTTP success + `data.ok=true`;
- расхождение или согласованность Yandex с server export/leaderboard;
- что OAuth mismatch — единственная причина недоступности;
- что smoke read был безопасным/read-only по реальной tool schema, а не только
  по полю `readOnly: true` в raw-артефакте.

Нельзя считать `landing_viewed` фактическим denominator, а
`registration_completed` — фактической конверсией до получения счётчиков
событий и независимой сверки с outcome-источником. Клиентскую CR нельзя
усреднять с server CR.

## Remediation options with tradeoffs

### 1. Получить ручной read-only export из интерфейса Метрики

Попросить владельца счётчика выгрузить настройки счётчика/целей и отчёт по
шести event IDs с фильтрами `experiment_id` и `site_version`. Сохранить raw
export неизменным, записать counter ID, timezone, период, filters, export time
и SHA-256; PII и replay contents не включать.

**Плюсы:** не требует нового OAuth application; минимальный supply-chain риск;
быстро закрывает goal/config и count evidence.
**Минусы:** ручной, плохо масштабируется, зависит от прав владельца и может не
дать API-level metadata.

### 2. Использовать уже существующий одобренный OAuth client/token

Если у организации уже есть OAuth application и read-only credential с
доступом к этому счётчику, использовать его в отдельном контролируемом
экспортере или в MCP только после подтверждения, что клиент поддерживает
external credential/configurable redirect URI. Секрет не хранить в
репозитории; ограничить scopes, срок жизни и аудитировать issuer/client.

**Плюсы:** автоматизируемо; не создаёт новый OAuth application.
**Минусы:** требует существующей организационной инфраструктуры и secret
handling; текущие локальные артефакты не доказывают, что
`yandex-metrica-mcp@0.3.0` умеет принять такой credential.

### 3. Дождаться/запросить исправление embedded OAuth client у maintainer

Перед обновлением потребовать changelog и evidence, что callback URI
зарегистрирован и соответствует реально отправляемому URI; закрепить точную
версию и integrity hash, затем повторить минимальный `describe_counter`.

**Плюсы:** не требует собственного OAuth application; сохраняет MCP workflow.
**Минусы:** внешняя зависимость, неизвестный срок; community supply-chain и
доверие к embedded client остаются.

### 4. Зафиксировать MCP как unavailable и продолжить через независимые
outcome-источники

Не подменять отсутствующие данные Метрики нулями. В reconciliation хранить
Yandex как `unavailable`, а server export/leaderboard использовать только как
отдельный outcome; не объявлять ими исправность клиентской телеметрии.

**Плюсы:** безопасно, не блокирует server-side оценку результата и не создаёт
OAuth application.
**Минусы:** нет Yandex funnel/Webvisor diagnostics и нельзя валидировать
клиентский denominator.

### 5. Укрепить контракт до возобновления доступа

Локально, отдельным изменением:

- валидировать `requiredProperties` до dispatch и возвращать явный результат
  `accepted/rejected`, не смешивая его с delivery confirmation;
- накладывать immutable common properties после event properties;
- ввести property-specific type/enum validation и запрет PII-подобных значений
  в разрешённых строках;
- добавить AAA-тесты с adversarial contexts: пропущенный `form_surface`,
  spoofed `experiment_id`, PII в `failure_type`, ошибка/отсутствие `ym`;
- после появления read-access отдельно проверить goal configuration и
  event counts против server outcome.

**Плюсы:** устраняет измерительные дефекты независимо от OAuth; новый OAuth
application не нужен.
**Минусы:** не восстанавливает counter access и само по себе не доказывает
доставку событий.

## Итог

Статический контракт в целом последователен: counter ID и имена Yandex goals
согласованы, единственной конверсией объявлен `registration_completed`,
privacy-классы и allowlist присутствуют. Но доступ к счётчику отсутствует,
goal/event data не получены, а OAuth root-cause атрибутирован увереннее, чем
позволяет provenance. До любых выводов о CR или исправности Метрики нужно
получить неизменяемый read-only snapshot. Параллельно следует закрыть два
контрактных дефекта dispatcher: required-property validation и immutable
experiment metadata.
