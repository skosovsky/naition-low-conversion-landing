# C23 — reconciliation audit

Scope: file-only audit of the frozen C23 snapshots. No live source was queried.

## Outcome and denominator semantics

| Source | Granularity / denominator | Numerator | Reported or derived CR | Evidence status |
|---|---:|---:|---:|---|
| Server export | 101 unique persisted server visits | 28 unique persisted orders | 28 / 101 = **27.7228%** | Authoritative outcome. Exact UTC cohort `09:05:46–09:14:34`; visit IDs and order IDs are unique. |
| Leaderboard | 101 requests | 28 orders | **27.7%** (display-rounded) | Authoritative competition outcome. Exact agreement with server counts; global rank 2. |
| Amplitude | 101 unique users with `Landing Viewed`, exact `experiment_id` + `site_version` filters | 28 unique users with `Registration Completed` | 28 / 101 = **27.722772%** | Independent exact-cohort diagnostic; official vendor MCP; exact agreement with server. Diagnostic funnel is `101 → 28 → 28 → 28`. |
| Yandex.Metrica | 100 unique Webvisor visit IDs | 27 visits reaching `Registration Completed` | 27 / 100 = **27.0%** | Independent visit-level proxy, unsampled and pagination-complete for the requested cohort. Data status remains `partial`: 99 complete visit bundles and one bundle missing `fetchHit`. |
| GA4 | Standard immature aggregate report; currently 29 `landing_viewed` users/events | 5 `generate_lead` users/events | A provisional ratio would be 17.24%, but **must not be treated as C23 CR** | Transport healthy (`exitCode=0`, close observed, no forced termination), exact labels present, unsampled/no other-row loss; data is immature and incomplete. |

The sources do not share a common denominator. In particular, simulator success count, server visits/leaderboard requests, unique analytics users, Webvisor visits, sessions, event totals, and goal reaches are distinct quantities and must not be averaged.

## Exact agreements

- Server and leaderboard agree exactly at **101 denominator / 28 persisted orders**. The leaderboard's 27.7% is merely its one-decimal rendering of the server's 27.7228%.
- Amplitude agrees exactly with the authoritative outcome at **101 landing users / 28 completed users**.
- Amplitude locates all measured loss before form opening: `Landing Viewed → Registration Form Opened` loses 73 users, while opened, submitted, and completed are all 28. This is diagnostic evidence, not a replacement outcome metric.
- Yandex's internally consistent goal chain is 27 opened, 27 attempted, and 27 completed. Its pricing-plan goal is present on 99 of 100 visits.

## Discrepancies

1. **Simulator success vs persisted denominator:** the run requested and completed 100 successful simulated visits, while server, leaderboard, and Amplitude contain 101 visits/users. Delta: **+1** on the authoritative denominator. The frozen sources contain no trace-level join proving which record is extra or why; a “technical probe” explanation is therefore only a hypothesis.
2. **Yandex vs authoritative outcome:** Yandex has 100 visits and 27 completions versus server/leaderboard/Amplitude 101 and 28. Deltas are **−1 visit and −1 completion**. Sampling is explicitly off (`sampleShare=1`), cohort pagination is complete, and data lag is reported as zero, so sampling/pagination cannot explain the difference. No cross-system identity mapping in the frozen files proves that the missing visit and missing completion are the same entity. Cause: **unproven**.
3. **Yandex bundle completeness:** visit `4221392525409649098` is partial because `fetchHit` returned HTTP 400 twice when `watchId` differed from `visitId`; the other 99 bundles are complete. This proves one recording payload is incomplete, but does **not** prove that this visit accounts for the server/Yandex count delta.
4. **GA4 immaturity:** at collection time the exact labels contained only 29 `landing_viewed`, 30 `select_content`, 6 `registration_form_opened`, 5 `registration_attempted`, and 5 `generate_lead`. These are partial standard-report arrivals, not zeroes and not a conflicting final conversion measurement. A mature exact-cohort report is required before GA4 can participate in final measurement reconciliation.

## Classification versus C22 control

C22 control is **30 / 101 = 29.7030%**. C23 is **28 / 101 = 27.7228%**:

- numerator delta: **−2 persisted orders**;
- absolute CR delta: **−1.9802 percentage points**;
- relative change: **−6.67%**;
- leaderboard remains rank 2 and C23 is below the stated 40% success threshold.

Classification: **negative effect / reject C23**. The tested hero-to-detail topic-order mechanism did not improve the authoritative outcome and should not be rerun unchanged. The evidence supports rotating to a causally different mechanism; it does not support attributing the loss to any specific individual visit.

## Frozen evidence used

- `raw/server/redacted-export.json`
- `raw/leaderboard/summary.json`
- `raw/amplitude/2026-07-25T0945Z-exact-cohort.json`
- `raw/yandex/2026-07-25T0952Z-webvisor-exact-cohort-list.json`
- `raw/yandex/collection-manifest.json`
- `raw/yandex/collection-state.json`
- `raw/ga4/2026-07-25T0948Z-standard-immature-attempt2.json`
