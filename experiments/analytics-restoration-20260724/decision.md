# Decision: inconclusive

Измеренный candidate оставлен без нового redeploy, но его влияние на
конверсию не подтверждено.

Candidate дал `22/101 = 21.7822%` против baseline
`27/101 = 26.7327%`: `−4.9505` п.п. (`−18.5185%` relative). Wilson/Newcombe
95% CI разницы: `[−16.6048; +6.8708]` п.п.; Fisher exact
`p=0.5117`. При текущих группах по 101 наблюдению exact MDE составляет примерно
`−16.0`/`+19.8` п.п., а power для наблюдаемого эффекта — около `9.8%`.
Причинный вывод о падении или росте делать нельзя.

Outcome согласован: server, leaderboard и Amplitude дают `22/101`.
Simulator подтверждает `22/100`. Один дополнительный landing/view
согласуется с гипотезой technical probe, но общего privacy-safe ID или
`trafficClass` нет, поэтому визит не исключён из denominator.

Качество измерения:

- Amplitude MCP доступен; totals/uniques получены и совпали с outcome.
  Однако query является independent event segmentation, а не ordered funnel;
  `Registration Failed`, required-property completeness, Tracking Plan,
  autocapture и Session Replay status не проверены.
- GA4 MCP callable, но Admin и Data API ответили
  `ACCESS_TOKEN_SCOPE_INSUFFICIENT`; данных GA4 нет.
- Настроенный Yandex MCP — community implementation. В его login flow
  наблюдался `redirect_uri_mismatch`; доступ к counter не подтверждён.

Provider settings и код сайта после измеренного SHA не менялись. Это
осознанно: GA4/Yandex нельзя read-verify, а для Amplitude сначала нужен полный
Tracking Plan snapshot. UI fallback не применялся.

Следующий безопасный шаг — исправить MCP auth, получить полный baseline schema
трёх providers, затем реализовать
[`analytics-tuning-contract.md`](analytics-tuning-contract.md) отдельным
commit/deploy. Новый прогон 100 агентов требует отдельного разрешения.
