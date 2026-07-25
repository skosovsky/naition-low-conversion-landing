# C23 Amplitude / server / leaderboard audit

## Scope and integrity

This is a file-only audit of the frozen C23 artifacts:

- `raw/amplitude/2026-07-25T0945Z-exact-cohort.json`
- `raw/server/redacted-export.json`
- `raw/leaderboard/summary.json`

All entries in `raw/checksums.sha256` were verified successfully from the frozen
`raw/` directory. No live analytics source was queried.

The exact cohort contract is:

- experiment: `rank1-hero-detail-topic-order-c23-20260725`
- site version: `hero-detail-topic-order-v1-c23-20260725`
- requested UTC window: `2026-07-25T09:05:46Z` through
  `2026-07-25T09:14:34Z`
- Amplitude counting unit: unique user
- ordered funnel conversion window: 3,600 seconds
- Amplitude transport recorded in the frozen envelope: official vendor MCP

## Reconstructed funnel

| Ordered step | Users | Retained from prior step | Lost at transition |
|---|---:|---:|---:|
| Landing Viewed | 101 | — | — |
| Registration Form Opened | 28 | 27.7228% | 73 |
| Registration Form Submitted | 28 | 100.0000% | 0 |
| Registration Completed | 28 | 100.0000% | 0 |

The two-step funnel independently reports `101 → 28`, or
`28 / 101 = 27.722772...%`. Therefore the diagnostic funnel and the primary
outcome funnel agree exactly.

The only observed Amplitude loss is before the form opens:

- pre-open loss: 73/101 users, 72.2772%
- opened-to-completed loss: 0/28 users, 0%
- opened-to-completed conversion: 28/28, 100%

This supports a narrow diagnosis: within this instrumented cohort, form mechanics
after `Registration Form Opened` are not the measured bottleneck. It does not by
itself identify why 73 users did not open the form.

## Latency

For the exact two-step funnel, Amplitude reports:

- average `Landing Viewed → Registration Completed`: 51 seconds
- median `Landing Viewed → Registration Completed`: 50 seconds

For the diagnostic funnel, the reported transition times are:

| Transition | Average | Median |
|---|---:|---:|
| Landing Viewed → Registration Form Opened | 46 s | 46 s |
| Registration Form Opened → Registration Form Submitted | 4 s | 4 s |
| Registration Form Submitted → Registration Completed | 0 s | 0 s |

The transition averages sum to 50 seconds, one second below the separately
reported two-step average of 51 seconds. The medians also sum to 50 seconds and
match the two-step median. This is not evidence of a broken funnel: independently
aggregated and rounded transition statistics need not add to the independently
aggregated end-to-end statistic.

These timing fields describe users who reached the relevant downstream step;
they do not provide dwell-time or abandonment-time distributions for the 73
non-openers.

## Reconciliation

| Source | Denominator | Numerator | Conversion | Reconciliation |
|---|---:|---:|---:|---|
| Amplitude exact cohort | 101 users | 28 completed | 27.7228% | Exact match to server |
| Server persisted records | 101 visits | 28 orders | 27.7228% | Authoritative persisted outcome |
| Leaderboard | 101 requests | 28 orders | 27.7% | Same counts; display rounded to one decimal |

The frozen sources reconcile without a count discrepancy:

- Amplitude landing users equal server visits: 101 = 101.
- Amplitude completions equal server orders: 28 = 28.
- Leaderboard requests and orders equal the server counts: 101 and 28.
- `27.7%` on the leaderboard is the one-decimal rendering of
  `27.7228%`; it is not a different result.
- The leaderboard associates the result with candidate
  `ec8866e9af598315f8daab53ecc7e80dcb79bd52` and the expected C23 version
  marker.

At collection, the leaderboard reports global rank 2. Its leader is `rnbako` at
168/504 = 33.3%. C23 trails that displayed rate by 5.6 percentage points and
also remains below the stated 40% target. Reaching 40% on the same denominator
would require at least 41 orders, 13 more than observed.

## Limitations and decision boundary

- The agreement is aggregate, not an identity-level join. The redacted server
  artifact contains counts/ranges rather than a mapping from Amplitude user IDs
  to persisted visit/order IDs.
- Amplitude uses unique users while the server and leaderboard label their
  denominators visits/requests. Equality at 101 proves aggregate agreement for
  this run, not general semantic equivalence between those units.
- The Amplitude query was filtered by both experiment and site-version markers,
  but the frozen envelope contains summarized query output rather than raw event
  rows. Event ordering and filter correctness are supported by the validated
  query definition, not independently replayable from this file.
- The requested window spans 528 seconds, while the funnel allows completion
  within 3,600 seconds. The frozen summary does not expose per-user timestamps,
  so late conversion attribution cannot be independently reconstructed.
- Server `lastAt` for visits is `09:13:45Z`; its final order is
  `09:14:12Z`, both inside the requested end time. The leaderboard `runAt` is
  `09:13:45Z` yet already reports 28 orders; that field's semantics cannot be
  inferred as a snapshot cutoff from these files and should not be used for
  event-level timing claims.
- Conversion timing is only available as aggregate average/median. No percentiles,
  variance, per-user latency, or non-converter dwell time are present.
- This audit establishes the C23 outcome and bottleneck location; it cannot
  attribute causality to the topic-order change without a comparable randomized
  control or stronger cross-iteration design.

## Audit conclusion

C23's decision-grade aggregate result is **28/101 = 27.7228%**. Amplitude,
the persisted server outcome, and the leaderboard agree on both numerator and
denominator. The measured drop-off is entirely `Landing Viewed → Registration
Form Opened`; once opened, all 28 users submit and complete. C23 is rank 2 in the
frozen leaderboard snapshot and does not satisfy either rank 1 or the 40% target.
