# C23 Webvisor shard 09

## Contract

- Scope: filenames 81–90 in bytewise-sorted
  `raw/yandex/visits/*.json`.
- Evidence: immutable per-visit bundles and phase-1 profiles only; no live
  systems were queried.
- `converted=true` means the bundle contains the
  `Registration Completed` goal.
- Times are seconds after visit start. `maxY` and `finalY` are observed scroll
  coordinates, not evidence of what text was read.

## Visits

### `4221444565679472807`

- `converted`: `true`
- Observed sequence: `Landing Viewed → Pricing Plan Selected → Registration
  Form Opened → Registration Attempted → Registration Completed`. First
  non-zero scroll `13.386s`; plan click `490` at `35.498s`; field clicks
  `579 → 584 → 589`; submit-button click `592` at `42.091s`; explicit submit
  at `42.097s`; EOF `2.116s` after the last click.
- Depth: `maxY=finalY=7107`.
- Interpretation: uninterrupted five-click converted path; no retry or
  field-level abandonment.
- Anomaly: none.

### `4221445673842639025`

- `converted`: `true`
- Observed sequence: complete goal chain through registration completion.
  First non-zero scroll `8.719s`; plan click `490` at `37.908s`; field clicks
  `579 → 584 → 589`; submit-button click `592` at `44.613s`; explicit submit
  at `44.622s`; EOF `2.277s` later.
- Depth: `maxY=finalY=7296`.
- Interpretation: same dominant converted DOM-node path, with no observable
  friction after form opening.
- Anomaly: earliest first scroll in this shard, but still within the converted
  phase-1 range; not an outcome anomaly.

### `4221446854628606426`

- `converted`: `false`
- Observed sequence: `Landing Viewed → Pricing Plan Selected`; first non-zero
  scroll `18.397s`; plan click `490` at `35.375s`; six subsequent scroll
  events; EOF `4.949s` after selection. No form-open, field-change, submit, or
  completion goal.
- Depth: `maxY=finalY=7184`.
- Interpretation: deep-page abandonment at the selected-plan-to-form handoff,
  not failure to reach the lower page.
- Anomaly: none.

### `4221447664338206857`

- `converted`: `true`
- Observed sequence: complete goal chain. First non-zero scroll `15.736s`;
  plan click `491` at `33.012s`; field clicks `580 → 585 → 590`;
  submit-button click `593` at `40.576s`; explicit submit at `40.583s`; EOF
  `2.262s` later.
- Depth: `maxY=finalY=7110`.
- Interpretation: clean five-click conversion using the secondary DOM-node
  variant; no post-open loss.
- Anomaly: earliest plan selection in this shard, but it remains inside the
  phase-1 converted range.

### `4221447836343992393`

- `converted`: `true`
- Observed sequence: complete goal chain. First non-zero scroll `19.690s`;
  plan click `491` at `47.898s`; field clicks `580 → 585 → 590`;
  submit-button click `593` at `54.479s`; explicit submit at `54.485s`; EOF
  `2.421s` later.
- Depth: `maxY=finalY=7145`.
- Interpretation: uninterrupted secondary-node converted path.
- Anomaly: none.

### `4221447984477896785`

- `converted`: `true`
- Observed sequence: complete goal chain. First non-zero scroll `19.448s`;
  plan click `491` at `42.341s`; field clicks `580 → 585 → 590`;
  submit-button click `593` at `49.622s`; explicit submit at `49.629s`; EOF
  `2.010s` later.
- Depth: `maxY=finalY=7222`.
- Interpretation: no retries or abandonment after form opening; behavior
  matches the phase-1 converted profile.
- Anomaly: none.

### `4221448394650681517`

- `converted`: `false`
- Observed sequence: `Landing Viewed → Pricing Plan Selected`; first non-zero
  scroll `21.654s`; plan click `490` at `52.978s`; six subsequent scroll
  events; EOF `5.497s` after selection. No form-open, field-change, submit, or
  completion goal.
- Depth: `maxY=finalY=7205`.
- Interpretation: selected-plan-to-form abandonment after deep traversal.
- Anomaly: latest plan selection (`53s`) and longest duration (`58s`) among
  this shard's non-converters, yet the exit stage is unchanged.

### `4221449860679467135`

- `converted`: `false`
- Observed sequence: `Landing Viewed → Pricing Plan Selected`; first non-zero
  scroll `17.468s`; plan click `490` at `43.311s`; six subsequent scroll
  events; EOF `5.369s` later. No form-open, field-change, submit, or completion
  goal.
- Depth: `maxY=finalY=7107`.
- Interpretation: dominant post-selection/pre-form exit.
- Anomaly: six scroll-direction reversals versus four for most shard visits;
  this does not identify a causal issue because phase 1 found backtracking
  non-discriminating.

### `4221452884148224099`

- `converted`: `false`
- Observed sequence: `Landing Viewed → Pricing Plan Selected`; first non-zero
  scroll `15.441s`; plan click `490` at `44.133s`; nine subsequent scroll
  events; EOF `6.641s` later. No form-open, field-change, submit, or completion
  goal.
- Depth: `maxY=7243`, `finalY=6972`.
- Interpretation: selected-plan-to-form abandonment despite continued
  lower-page movement.
- Anomaly: largest post-selection scroll count and only material retreat from
  maximum depth in this shard; telemetry alone does not prove confusion.

### `4221456094410572161`

- `converted`: `true`
- Observed sequence: complete goal chain. First non-zero scroll `12.346s`;
  plan click `490` at `35.191s`; field clicks `579 → 584 → 589`;
  submit-button click `592` at `42.651s`; explicit submit at `42.656s`; EOF
  `1.849s` later.
- Depth: `maxY=finalY=7295`.
- Interpretation: clean dominant-node conversion with no observable
  field-level loss.
- Anomaly: none.

## Shard summary

- Coverage: `10/10`; every bundle is `exported`, and all three endpoint
  statuses are HTTP 200.
- Converted: `6/10`; non-converted: `4/10`.
- Every visit selected a plan. All six converters then followed one of the two
  known five-click form paths and completed; all four non-converters made only
  the plan click and exited before form opening.
- The shard reproduces the cohort's binary split at
  `Pricing Plan Selected → Registration Form Opened`. Scroll depth, duration,
  and backtracking do not separate the outcomes here.
