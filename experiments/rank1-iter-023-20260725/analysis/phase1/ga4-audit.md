# C23 GA4 source audit

Scope: file-only audit of the frozen C23 GA4 envelopes, with the frozen server
and leaderboard snapshots used only for outcome reconciliation. No live query
was made.

## Evidence and integrity

- Frozen GA4 attempt 1:
  `raw/ga4/2026-07-25T0947Z-standard-immature.json`,
  SHA-256 `8f0289ff862b896b25df5ceccfff2c79f114055186c5bf3ff9e51e80b7340cd4`.
- Frozen GA4 attempt 2:
  `raw/ga4/2026-07-25T0948Z-standard-immature-attempt2.json`,
  SHA-256 `432d7e7b3c561e0da023251b1eac402ce8660caa276ccca6cd9ab2535d2560e8`.
- Frozen server snapshot:
  `raw/server/redacted-export.json`,
  SHA-256 `dbcdb0d1b3add29ea00a33f021b1e8b206c55abe34a6ce9ef7f158796fc16c30`.
- Frozen leaderboard snapshot:
  `raw/leaderboard/summary.json`,
  SHA-256 `b7be1e4b309b44761b25f5c7e65a857e7d2c39e8335cf17cffb43094475a15fd`.
- All four hashes match `raw/checksums.sha256`. `raw/freeze.json` records
  `state=frozen`, 124 frozen files, and a passed source security gate.

## Collector lifecycle and provenance

The successful envelope identifies the official
`googleanalytics/google-analytics-mcp` implementation, Google Analytics MCP
Server `1.0.0`, property `546448545`, and an aggregate-report granularity.
BigQuery was not used and no authentication material was persisted.

Attempt 1 is a transport failure, not an analytics result. `pipx` failed while
trying to remove an old local log: process exit code `1`, close observed,
`exitSignal=null`, and `forcedTermination=null`. It contains no callable tools
and no report calls. Therefore it must not be interpreted as zero traffic.

Attempt 2 has a clean child lifecycle:

- process spawned at `2026-07-25T09:47:36.442Z`;
- process closed at `2026-07-25T09:47:51.390Z`;
- `exitCode=0`;
- `exitSignal=null`;
- `forcedTermination=null`;
- `collectionError=null`;
- all six calls report `status=success`.

This proves that the official MCP transport, authentication, property access,
custom-dimension discovery, and Data API report calls worked. Warnings in
`stderrSummary` concern experimental library features and do not indicate a
failed report.

## Exact-label report

The strongest GA4 slice filters both event-scoped labels with case-sensitive
exact matching:

- `experiment_id=rank1-hero-detail-topic-order-c23-20260725`;
- `site_version=hero-detail-topic-order-v1-c23-20260725`.

It groups by property-local minute (`Europe/Moscow`) and event name. Its rows
span `12:05` through `12:14`, consistent with the requested UTC cohort window
`09:05:46` through `09:14:34`. The report returns 30 rows, with
`data_loss_from_other_row=false` and an empty `sampling_metadatas` array.

Summed exact-label rows at collection time:

| Event | eventCount | totalUsers | sessions |
|---|---:|---:|---:|
| `landing_viewed` | 29 | 29 | 29 |
| `select_content` | 30 | 30 | 30 |
| `registration_form_opened` | 6 | 6 | 6 |
| `registration_attempted` | 5 | 5 | 5 |
| `generate_lead` | 5 | 5 | 5 |

The two one-label diagnostic reports (`experiment_id` only and `site_version`
only) independently return the same totals. This is useful evidence that the
two C23 labels are associated consistently in the currently processed rows.

However, the envelope explicitly declares `maturity=standard_immature` and was
collected only about 33 minutes after the cohort ended. The 29 labeled
`landing_viewed` users are far below the 101 frozen server visits. The unusual
`select_content` count of 30 exceeding 29 `landing_viewed` is another direct
sign that this snapshot is incomplete at the event level. The five
`generate_lead` rows must therefore be described as **events observed so far**,
not as five final conversions. Absence of a `registration_failed` row is also
not evidence of zero failures.

No sampling and no `(other)`-row loss only describe how the currently available
rows were returned; they do not make an immature standard report complete.

## Marginal whole-day report

The unlabelled event-name report returns these property-wide day totals:

| Event | eventCount | totalUsers | sessions |
|---|---:|---:|---:|
| `landing_viewed` | 602 | 601 | 601 |
| `select_content` | 579 | 579 | 580 |
| `registration_form_opened` | 144 | 144 | 144 |
| `registration_attempted` | 154 | 154 | 154 |
| `generate_lead` | 154 | 154 | 154 |

These are marginal totals for the entire property on `2026-07-25`, without
C23 labels or a minute dimension. They mix C23 with other cohorts/runs and
cannot be used as C23 numerator, denominator, funnel, or reconciliation
evidence. In particular, the day-level `registration_attempted` count exceeding
`registration_form_opened` shows why treating this mixed aggregate as a
sequential C23 funnel would be invalid.

## Decision-grade assessment

The authoritative C23 outcome is decision-grade in the two outcome sources:

- server: 28 persisted orders / 101 persisted visits = `27.7228%`;
- leaderboard: 28 orders / 101 requests = `27.7%`, global rank `2`.

Those sources agree after leaderboard rounding and identify candidate
`ec8866e9af598315f8daab53ecc7e80dcb79bd52` with the C23 version marker.

The frozen GA4 artifact is **not decision-grade for C23 conversion** because it
is `standard_immature` and severely incomplete relative to the authoritative
cohort. It cannot validate or contradict 28/101, quantify the server/GA4
discrepancy, or support a causal funnel conclusion. It is decision-grade only
for these narrower claims:

1. official vendor MCP transport and property access worked cleanly on attempt
   2;
2. the required C23 custom dimensions exist;
3. C23-labelled events were observed;
4. the returned snapshot reports no sampling and no other-row data loss;
5. GA4 processing was incomplete at collection time.

For the fast iteration decision, server and leaderboard are sufficient to
reject C23 as below the 40% target; delayed GA4 must not block the next
hypothesis. A later `standard_mature` exact-label report is required before GA4
can participate in final cross-system reconciliation. Until then, do not turn
missing or partial GA4 rows into zeroes or a conversion rate.
