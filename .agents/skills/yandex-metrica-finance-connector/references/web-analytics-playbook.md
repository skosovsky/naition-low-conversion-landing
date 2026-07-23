# Web Analytics Playbook For Yandex Metrica

## Core Questions

Use this layer when the user asks for web analytics, efficiency, bottlenecks, conversion, pageviews, landing pages, exits, funnels, UX or site performance.

Answer four questions:

1. Where does traffic enter?
2. Where does attention and intent drop?
3. Which pages, sources or devices convert better or worse?
4. What concrete change should be tested first?

## Analyst Operating Model

Work like a senior web analyst:

- Start from business goal, not from a pretty dashboard.
- Check tracking quality before trusting conclusions.
- Separate macro conversions (order, lead, paid action) from micro conversions (product view, cart, form start, scroll, click).
- Segment every major signal by source, campaign, device, browser and landing page.
- Translate data into action: page fix, traffic fix, tracking fix, UX inspection, experiment or finance/product join.
- Do not present vanity metrics without a decision attached.

## Required Analysis Layers

- Acquisition: traffic source, UTM source/medium/campaign, campaign, referrer, search/social/direct.
- Landing quality: ym:s:startURL, visits, users, bounce rate, page depth, average duration, goals, ecommerce.
- Exit quality: ym:s:endURL, paired with ym:s:startURL when possible; flag unexpected exits.
- Content engagement: pageviews, users, depth, duration, scroll/session proxy where available.
- Conversion: goal reaches, goal conversion by source, page, device, campaign.
- Ecommerce: purchases, revenue, AOV, product/category when enabled.
- Device/browser: desktop/mobile/tablet, browser, OS; use this to catch mobile UX or compatibility issues.
- Time: daily/weekly trends, before/after changes, campaign windows.
- Funnel: product view -> add to cart -> checkout -> purchase, or service path -> form view -> form submit -> qualified lead.
- UX diagnostics: Webvisor/session replay, click maps, scroll maps, form analysis, page load time.
- Tracking QA: goal setup, ecommerce setup, duplicate/missing tags, UTM hygiene, robot filtering, sensitive/limited data.
- Finance join: ad cost, gross margin, refunds, logistics, commissions; do not call revenue profit.

## Daily vs Weekly Reports

Daily report: anomalies and urgent leaks. Watch traffic spikes/drops, conversions, ecommerce, high-bounce paid landings, unexpected exits, mobile/browser breakage, tracking zeros.

Weekly report: decisions and backlog. Watch channel quality, landing winners/losers, funnel loss, device/browser patterns, content engagement, product/category impact, Webvisor/forms inspection queue and top actions.

## Bottleneck Heuristics

High-priority issues:

- High-traffic landing page + high bounce + low/no goals.
- Paid/UTM traffic landing on weak pages.
- Unexpected exit page: not checkout, payment, thank-you, contacts or login, but many sessions end there.
- Mobile conversion significantly below desktop on same page/source.
- High pageviews but low goals: users browse but do not find a next step.
- High ecommerce product views or cart signals but weak purchase completion.
- Strong channel traffic with weak conversion compared with organic/direct baseline.

Positive signals:

- Landing pages with high conversion and enough sessions.
- Traffic sources with lower bounce and higher depth/conversion.
- Content pages that assist conversion paths even if they are not final conversion pages.

## Recommended Export Presets

Use metrica_export.py:

~~~bash
python3 skills/yandex-metrica-finance-connector/scripts/metrica_export.py \
  --counter-id 12345678 \
  --date1 2026-05-01 \
  --date2 2026-05-15 \
  --preset landing-pages \
  --out-dir exports/metrica-web

python3 skills/yandex-metrica-finance-connector/scripts/metrica_export.py \
  --counter-id 12345678 \
  --date1 2026-05-01 \
  --date2 2026-05-15 \
  --preset exit-pages \
  --out-dir exports/metrica-web

python3 skills/yandex-metrica-finance-connector/scripts/metrica_export.py \
  --counter-id 12345678 \
  --date1 2026-05-01 \
  --date2 2026-05-15 \
  --preset content-engagement \
  --out-dir exports/metrica-web
~~~

Then run:

~~~bash
python3 skills/yandex-metrica-finance-connector/scripts/web_analytics_audit.py \
  exports/metrica-web/*.csv \
  --md-out exports/metrica-web/web-analytics-audit.md \
  --json-out exports/metrica-web/web-analytics-audit.json
~~~

Build a report:

~~~bash
python3 skills/yandex-metrica-finance-connector/scripts/metrica_report_builder.py \
  --audit-json exports/metrica-web/web-analytics-audit.json \
  --csv exports/metrica-web/*.csv \
  --period 2026-05-01..2026-05-15 \
  --cadence weekly \
  --md-out exports/metrica-web/weekly-report.md \
  --html-out exports/metrica-web/weekly-report.html
~~~

HTML can be rendered to PDF through the browser/PDF tool when the user asks for deliverable reports.

## Output Style

Return:

- **Итог:** top 1-3 bottlenecks.
- **Где просадка:** page/source/device/funnel step.
- **Почему это важно:** volume and impact proxy.
- **Что делать:** specific UX/content/tracking/traffic action.
- **Проверка:** metric to watch after change.

Avoid generic advice. Every recommendation should point to a page, source, device, goal or report.
