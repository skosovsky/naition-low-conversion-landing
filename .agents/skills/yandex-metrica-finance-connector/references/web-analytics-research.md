# Web Analytics Research Notes

## Sources Checked

- Yandex Metrica support: "Страницы входа" report.
- Yandex Metrica support: "Страницы выхода" report.
- Yandex Metrica support: report constructor, groupings and metrics.
- Yandex Metrica Stat API introduction: dimensions, metrics, JSON/CSV formats, session vs hit prefixes.
- Yandex Metrica Logs API fields reference: startURL, endURL, pageViews, visitDuration, bounce, goals, attribution fields.
- Public Python examples around Yandex Metrica API exports: direct requests, pandas export, pagination/limit awareness.
- General web analytics practice: acquisition, landing quality, exit analysis, funnel/conversion analysis, device/source segmentation, before/after measurement.

## Key Takeaways

- Landing pages are evaluated on sessions that started on that page. Useful metrics: visits, users, bounce rate, page depth, average duration, goal reaches, conversion proxy, source and device.
- Exit pages show where sessions end. An exit is not always bad: checkout success, contacts, payment, login/logout and thank-you pages can be expected exits.
- A report in Metrica is a configurable combination of dimensions and metrics. The first grouping defines report meaning.
- Stat API separates session metrics/dimensions ym:s:* and hit/pageview metrics/dimensions ym:pv:*. Do not mix them in the same metrics/dimensions request.
- Filters can reference other prefixes, but exporter presets should stay conservative.
- For CFO use, web analytics conclusions become financial only after joining ad costs, margin, refunds, logistics and product data.

## Practical Skill Decision

The local skill should not try to become a full BI tool. It should:

1. Export clean CSV/JSON presets.
2. Run deterministic bottleneck scoring.
3. Produce a concise action report.
4. Leave final business prioritization to joined finance/product data.

