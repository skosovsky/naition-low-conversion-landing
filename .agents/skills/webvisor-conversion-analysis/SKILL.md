---
name: webvisor-conversion-analysis
description: >-
  Runs evidence-based landing conversion analysis and controlled optimization
  iterations: Webvisor visit analysis, one scoped experiment, deploy, exactly
  100 simulated visits, reconciliation across server/Yandex/GA4/Amplitude and
  leaderboard, and skill retrospective. Use with site_url, data_dir, site_dir,
  and an iteration_id.
---

# Webvisor Conversion Analysis

Продуктовый анализ визитов и воспроизводимый цикл улучшения конверсии.

## Перед началом

1. Входы: `site_url`, `data_dir`, `site_dir`, `iteration_id`, `output_dir`.
2. Для one-shot анализа прочитать `analysis.md`, `hypothesis-format.md`,
   `report-template.md`, `implementation.md`.
3. Для deploy/simulator/leaderboard или нескольких аналитик дополнительно
   прочитать **`experiment-loop.md`** и **`orchestration.md`**.
4. Канонический контракт завершённой итерации:
   `schemas/experiment-manifest.schema.json`.

## Порядок работы

| Этап | Артефакт |
|------|----------|
| -1 — tools/auth/contracts preflight | `experiments/<id>/preflight.json` |
| 0 — DOM + structural audit → карта | `landing-map.json` |
| 1 — воронка | hypotheses.md |
| 2 — группы + converted-профиль | hypotheses.md |
| 3 — все визиты, primary + secondary | `work/visits/*.json` |
| 4 — полный отчёт, рекомендации 2 слоя | `hypotheses.md` |
| 4.5 — discovery в site_dir | `site-constraints.md` |
| 5 — рекомендации + gate | `recommendations.md` |
| 6 — правки site_dir (сверху вниз) | изменённые файлы |
| 7 — проверка + workflow | `constraints-check.md` |
| 8 — commit/push/redeploy + SHA evidence | `experiments/<id>/deploy.json` |
| 9 — ровно 100 визитов | `experiments/<id>/simulator.json` |
| 10 — snapshots 5 источников | `experiments/<id>/sources/*` |
| 11 — reconciliation + decision | `comparison.json`, `manifest.json` |
| 12 — ретроспектива skill | `skill-review.md` |

## Критические правила

### Анализ (0–4)

- **Этап 0:** DOM-аудит + `structuralAudit`; `observed` не пуст; без Y-сетки.
- **Converted:** разобрать каждый конвертированный визит.
- Различать `attempted`, `confirmed_success` и `persisted`; submit без
  подтверждения успеха не считать конверсией.
- **Доминирующий кластер (>70%):** несколько рычагов, не только секция конверсии; secondary где есть накопление.
- **Этап 4:** `hypotheses.md` по **`report-template.md`**; рекомендации **два слоя** (топ-3 кластера + structural audit).
- Label — продуктовый язык; milestone-id только в `funnelStage`.
- Сверка N; все визиты в приложении.

### Внедрение (4.5–7)

- Без `site-constraints.md` правки запрещены.
- Ограничения — только из markdown в `{site_dir}`.
- На одну измеряемую итерацию внедрять **одну гипотезу** или один явно
  описанный coherent bundle. Остальные approved-рекомендации оставить в backlog.
- Порядок приоритета инструкций: system/developer → прямое указание пользователя
  → `AGENTS.md`/контракт проекта → этот skill.
- После правок: интерактив из карты работает; workflow из site_dir зафиксирован в `constraints-check.md`.

### Эксперимент и мультиагентность (-1, 8–12)

- Один mutation-controller выполняет push/redeploy/run-bot; один Git writer.
- Аналитические агенты получают только immutable, PII-redacted snapshots.
- Не запускать мутации, пока preflight не подтвердил read-access ко всем
  обязательным источникам и точные OpenAPI-контракты control-plane.
- Не усреднять CR разных источников. Server/leaderboard — outcome; Yandex,
  GA4 и Amplitude — независимые измерения и diagnostics.
- Привязать candidate к commit SHA, remote SHA evidence, version marker,
  panel response hash, simulator run и временному окну. Не утверждать, что
  control-plane подтвердил SHA, если этого нет в его контракте.
- После итерации запустить:
  `node {skill_dir}/scripts/validate-iteration.mjs experiments/<iteration_id>`.

## Конверсия

Из `inputNodes`, подтверждённого success и server-side persistence →
`landing-map.conversionGoal`.

Подробности — `analysis.md`; шаблон — `report-template.md`; внедрение — `implementation.md`.
