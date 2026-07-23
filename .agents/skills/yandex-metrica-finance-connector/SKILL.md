---
name: yandex-metrica-finance-connector
description: Exports and analyzes Yandex Metrica traffic, landing/exit pages, pageviews, goals, UTM, ecommerce, and finance-ready metrics for CFO and web analytics: bottlenecks, conversions, ROMI, DРР, and Google Sheets/Excel workflows.
---

# Yandex Metrica Finance Connector

## Purpose

Read-only connector for CFO-grade and web-analyst-grade Yandex Metrica exports. It turns Metrica reports into local CSV/JSON files, finds site bottlenecks, and prepares data for joins with orders, costs, margin, and product analytics.

## When to Use

Use for requests like:
- “выгрузи Метрику для финанализа”
- “собери трафик/цели/заказы по UTM”
- “посчитай ДРР/ROMI из Метрики”
- “проанализируй страницы входа/выхода”
- “найди узкие места сайта”
- “проверь просмотры, вовлечение и конверсии”
- “что делать, чтобы повысить эффективность сайта”
- “подготовь данные Метрики для Google Sheets/Excel”
- “связать Метрику с маржей/товарной аналитикой”

## Safety Rules

- Read-only by default. Do not write to Google Sheets, CRM, ad accounts, or Metrica without explicit permission.
- Never print tokens. Prefer `YANDEX_METRICA_TOKEN` or `--token-file`.
- Store exports in a task-specific local folder.
- Treat raw exports as potentially sensitive business data.

## Core Workflow

1. Confirm counter id, date range, and needed preset.
2. If token is needed, use `YANDEX_METRICA_TOKEN` or a local token file authorized by the user.
3. Run dry-run first to inspect endpoint and fields:

```bash
python3 skills/yandex-metrica-finance-connector/scripts/metrica_export.py \
  --counter-id 12345678 \
  --date1 2026-05-01 \
  --date2 2026-05-15 \
  --preset finance-summary \
  --out-dir exports/metrica-demo \
  --dry-run
```

4. Run export:

```bash
YANDEX_METRICA_TOKEN="$TOKEN" python3 skills/yandex-metrica-finance-connector/scripts/metrica_export.py \
  --counter-id 12345678 \
  --date1 2026-05-01 \
  --date2 2026-05-15 \
  --preset finance-summary \
  --out-dir exports/metrica-2026-05
```

5. Join outputs with order cost/margin data before making CFO conclusions.

## Web Analytics Workflow

Use this for landing pages, exit pages, pageviews, conversion and site-efficiency questions:

1. Export at least:
   - `landing-pages` — where sessions start and whether they convert;
   - `exit-pages` — where sessions end and whether this exit is expected;
   - `content-engagement` — traffic/content engagement by page/source;
   - `goals` with specific `--goal-id` when the user has known business goals.
2. Run the local bottleneck analyzer:

```bash
python3 skills/yandex-metrica-finance-connector/scripts/web_analytics_audit.py \
  exports/metrica-web/*.csv \
  --md-out exports/metrica-web/web-analytics-audit.md \
  --json-out exports/metrica-web/web-analytics-audit.json
```

3. Read the audit together with source/UTM/device splits.
4. Translate findings into actions: page UX/content, CTA, traffic-source mismatch, mobile issue, goal tracking gap, ecommerce/funnel issue.
5. If business impact matters, join with ad costs, margin, order data, refunds and product ABC/XYZ before prioritizing.

For recurring reports:

1. Daily: anomaly check, urgent leaks, tracking zeros, paid traffic quality, mobile/browser issues.
2. Weekly: decision report with channel/page/funnel trends, Webvisor/forms inspection queue, and prioritized actions.
3. Use `metrica_report_builder.py` to generate Markdown/HTML reports; render HTML to PDF when a shareable report is needed.

## Presets

- `traffic` — source/medium/campaign visits and users.
- `utm` — UTM campaign/content/term performance.
- `goals` — goal conversion metrics; pass goal ids via `--goal-id`.
- `ecommerce` — ecommerce purchases/revenue if enabled in Metrica.
- `finance-summary` — compact finance-ready traffic + conversion + revenue view.
- `landing-pages` — start URLs with visits, bounce, depth, duration, goals, source and device.
- `exit-pages` — end URLs paired with start URL and device to find unexpected exits.
- `content-engagement` — session-level content performance by start URL and source.
- `pageviews` — hit-level pageview report by page URL.

## Output Contract

Return:
- **Период и счётчик**
- **Что выгружено**: preset, metrics, dimensions
- **Файлы**: CSV/JSON paths
- **CFO-сигналы**: CR, revenue, orders, average order value, ROMI/ДРР only if cost data is joined
- **Web-сигналы**: входы/выходы, просмотры, bounce, depth, duration, conversion proxy, source/device bottlenecks
- **Узкие места**: max 5 pages/sources/devices with evidence
- **Что делать**: specific page/source/funnel action and metric to watch
- **Ограничения**: attribution caveats, missing ecommerce/goals/costs
- **Следующий шаг**: join with costs/margin or product ABC/XYZ

## References

- Field notes: [references/yandex-metrica-fields.md](references/yandex-metrica-fields.md)
- Web analytics playbook: [references/web-analytics-playbook.md](references/web-analytics-playbook.md)
- Research notes: [references/web-analytics-research.md](references/web-analytics-research.md)
- Expert web analyst notes: [references/expert-web-analyst.md](references/expert-web-analyst.md)
