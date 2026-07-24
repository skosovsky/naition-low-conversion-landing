# Независимая сверка reconciliation и статистики

Дата расчёта: 2026-07-24.

## Scope и целостность входов

Расчёт выполнен только по локальным артефактам этой итерации:

- `deploy.json`;
- `simulator.json`;
- `server.json`;
- `leaderboard.json`;
- `normalized/amplitude.json`;
- `normalized/google-analytics.json`;
- `normalized/yandex-metrica.json`;
- `raw/checksums.sha256`.

Новых наблюдений и внешних данных в расчёте нет. Проверка `sha256sum -c raw/checksums.sha256` завершилась успешно для всех 5 raw-файлов (`5/5 OK`). Значения `sourceFiles[].sha256` в трёх normalized-файлах совпадают с соответствующими строками checksum manifest.

Deploy и simulator относятся к одному candidate:

- candidate SHA: `20ba87b240c8e87d88e6e087e6b6112fa567431e`;
- version marker: `measurement-v2-20260724`;
- перед запуском зафиксирован reset базы до `0` visits / `0` orders;
- simulator вызван один раз: `100` successful, `0` failed, `22` conversions.

## Outcome: каноническая сверка

Server и leaderboard рассматриваются как outcome. Simulator и Amplitude используются как независимая диагностика; rates разных источников не усредняются.

| Источник | Роль | Denominator | Numerator | Rate | Сверка |
|---|---|---:|---:|---:|---|
| Server persistence | outcome | 101 visits | 22 orders | 21.782178% | Канонические persisted counts |
| Leaderboard | outcome | 101 requests | 22 orders | 21.8% | Counts совпадают с server; `21.8%` — округление `22/101` до 1 знака |
| Simulator/control panel | diagnostic | 100 successful visits | 22 conversions | 22.000000% | Numerator совпадает; denominator на 1 меньше server |
| Amplitude | diagnostic | 101 `Landing Viewed` users | 22 `Registration Completed` users | 21.782178% | Denominator и numerator совпадают с server |

Попарная reconciliation:

- server ↔ leaderboard: `Δdenominator = 0`, `Δnumerator = 0`;
- server ↔ Amplitude: `Δdenominator = 0`, `Δnumerator = 0`;
- simulator ↔ server: `Δdenominator = +1` на стороне server, `Δnumerator = 0`;
- simulator rate выше server rate на `0.217822` п.п. исключительно из-за denominator `100` против `101`;
- leaderboard rate `21.8%` отличается от точного `22/101 = 21.782178%` только представлением с одним десятичным знаком.

Итог outcome: candidate имеет `22/101 = 21.782178%`. Значения server и leaderboard внутренне согласованы.

## Outcome: baseline против candidate

Это последовательное сравнение `before_after`, а не randomized A/B:

| Cohort | Orders | No order | Total | Rate | Wilson 95% CI |
|---|---:|---:|---:|---:|---:|
| Baseline | 27 | 74 | 101 | 26.732673% | [19.070960%; 36.099446%] |
| Candidate | 22 | 79 | 101 | 21.782178% | [14.847681%; 30.784514%] |

Точечные эффекты:

- orders delta: `22 - 27 = -5`;
- absolute rate delta: `22/101 - 27/101 = -5/101 = -0.0495049505`, то есть **−4.950495 п.п.**;
- relative lift: `(22/101) / (27/101) - 1 = 22/27 - 1 = -5/27 = -0.1851851852`, то есть **−18.518519%**.

95% Newcombe/Wilson CI для разницы `candidate − baseline`:

**[−16.604837; +6.870837] п.п.**

Интервал включает `0`: данные совместимы и с заметным ухудшением, и с небольшим улучшением.

Таблица для exact test:

| | Order | No order |
|---|---:|---:|
| Candidate | 22 | 79 |
| Baseline | 27 | 74 |

Двусторонний Fisher exact:

- odds ratio: `0.763244`;
- `p = 0.5117077271`.

При `α = 0.05` статистически значимого различия нет. Это не доказывает равенство rates и не подтверждает причинный эффект candidate: последовательный before/after дизайн дополнительно допускает временные и cohort confounders.

### Minimum detectable interpretation

Для интерпретации чувствительности использован тот же двусторонний Fisher exact test с `α = 0.05`, `n_baseline = n_candidate = 101`, истинным baseline rate, условно равным наблюдаемому `p₀ = 27/101`, и целевой power `80%`.

Exact-power расчёт даёт:

- detectable decrease: candidate rate около `10.724388%`, абсолютная разница **−16.008285 п.п.**;
- detectable increase: candidate rate около `46.563088%`, абсолютная разница **+19.830415 п.п.**.

Наблюдаемая разница `−4.950495` п.п. составляет только `30.924580%` от downward MDE. При альтернативе, равной наблюдаемым rates, exact power текущего размера cohorts составляет около `9.805246%`. Поэтому отсутствие significance ожидаемо: выборка способна надёжно увидеть только значительно более крупный эффект.

## Diagnostic: гипотеза дополнительного технического визита

Наблюдаемая комбинация фактов:

1. simulator подтверждает ровно `100` successful visits и `22` conversions;
2. server сохраняет `101` visits и `22` orders;
3. leaderboard показывает `101` requests и `22` orders;
4. Amplitude показывает `101` `Landing Viewed`, но только `100` `Pricing Plan Selected`;
5. все четыре источника согласны по numerator `22`;
6. в server snapshot первый visit отмечен в `07:13:24Z`; notes артефакта указывают, что он предшествует первой десятипоточной simulator batch в `07:13:28Z`.

Наиболее компактное объяснение: один control-plane/eligibility probe создал view-level visit, но не прошёл к выбору тарифа и не создал order. Это одновременно объясняет:

- `101` server/leaderboard/Amplitude landings против `100` successful simulator visits;
- `101 → 100` между `Landing Viewed` и `Pricing Plan Selected`;
- отсутствие расхождения по `22` conversions/orders/completions.

Статус гипотезы: **сильно согласуется с агрегатами, но не доказана идентификационно**. В данных нет общего cross-source visit ID и пользовательской последовательности Amplitude, поэтому нельзя строго доказать, что лишняя server-запись и лишний Amplitude viewer — один и тот же субъект. По этой причине primary outcome остаётся `22/101`; исключать один визит постфактум из канонического denominator нельзя.

## Diagnostic: Amplitude funnel и drop-offs

Это count-based реконструкция по `eventsSegmentation`, отфильтрованная по `experiment_id = analytics-restoration-20260724` и `site_version = measurement-v2-20260724`.

| Stage | Unique users | Step conversion | Cumulative conversion | Drop-off от предыдущего stage |
|---|---:|---:|---:|---:|
| `Landing Viewed` | 101 | 100.000000% | 100.000000% | — |
| `Pricing Plan Selected` | 100 | 99.009901% | 99.009901% | 1 (0.990099%) |
| `Registration Form Opened` | 22 | 22.000000% | 21.782178% | 78 (78.000000%) |
| `Registration Form Submitted` | 22 | 100.000000% | 21.782178% | 0 (0.000000%) |
| `Registration Completed` | 22 | 100.000000% | 21.782178% | 0 (0.000000%) |

Итого от landing до completion потеряно `79/101 = 78.217822%`. Главный диагностический drop-off — `Pricing Plan Selected → Registration Form Opened`: `78/100 = 78.000000%`; на него приходится `78/79 = 98.734177%` всех наблюдаемых потерь между landing и completion.

Ограничение: Amplitude snapshot содержит event segmentation, а не ordered funnel. Равенство `eventTotal` и `uniqueUsers` для этих событий не заменяет user-level sequence. У `Registration Form Submitted` и `Registration Completed` bucket cells равны `null`, хотя total cells равны `22`; поэтому вывод допустим на уровне агрегированных totals, но не как доказательство индивидуального прохождения каждого пользователя.

Google Analytics и Yandex Metrica не участвуют в численной reconciliation: оба normalized snapshots имеют статус `unavailable` (`ACCESS_TOKEN_SCOPE_INSUFFICIENT` и `redirect_uri_mismatch` соответственно). Их отсутствие не заменено данными другого периода или другого источника.

## Формулы и метод

Для proportion `x/n` Wilson 95% CI рассчитан без continuity correction при `z = 1.9599639845`:

```text
p̂ = x / n
D = 1 + z² / n
center = (p̂ + z² / (2n)) / D
half = z / D × sqrt(p̂(1 − p̂) / n + z² / (4n²))
CI = [center − half; center + half]
```

Для разницы `d = p_candidate − p_baseline` использован Newcombe hybrid score interval на основе независимых Wilson intervals `[L_c; U_c]` и `[L_b; U_b]`:

```text
lower = d − sqrt((p_candidate − L_c)² + (U_b − p_baseline)²)
upper = d + sqrt((U_c − p_candidate)² + (p_baseline − L_b)²)
```

Двусторонний Fisher exact conditionally фиксирует margins. При `K = 49` orders в `N = 202` наблюдениях:

```text
P(X = x | K) = C(101, x) × C(101, 49 − x) / C(202, 49)
p_two-sided = Σ P(X = x | K),
              для всех таблиц с P(X = x | K) ≤ P(X = 22 | K)
```

Для exact MDE power вычислялась по полной совместной binomial distribution с Fisher rejection region:

```text
Power(p₁, p₀) =
  Σ I[p_Fisher(x, y) ≤ 0.05] × Bin(x; 101, p₁) × Bin(y; 101, p₀)
```

Границы `p₁` найдены как решения `Power(p₁, 27/101) = 0.80` отдельно ниже и выше baseline.
