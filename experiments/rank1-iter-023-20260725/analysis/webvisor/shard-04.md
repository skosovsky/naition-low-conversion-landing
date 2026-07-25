# C23 Webvisor shard 04

## Contract

- Scope: filenames 31–40 in bytewise-sorted
  `raw/yandex/visits/*.json`.
- Evidence: frozen per-visit bundles only; no live systems used.
- `converted=true` only when the visit goal list contains
  `Registration Completed`.
- Times below are seconds after the start of the Webvisor event stream.
- `maxY` and `finalY` are observed scroll coordinates, not evidence of what
  the visitor read.

## Visits

### `4221372311984668734`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `16.582s`, free-plan click on node `490` at
  `47.973s`, then 7 scroll events and EOF `6.136s` later at
  `maxY=finalY=7389`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs after plan selection and before
  any observable form interaction.
- Secondary inference 2: deepest-page reach is observed, so failure to reach
  the lower-page registration area is not supported.
- Anomaly: none.

### `4221379236138319944`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `18.655s`, free-plan click on node `490` at
  `38.479s`, then 7 scroll events and EOF `6.659s` later at `finalY=6948`
  (`maxY=7187`). No form-open, field, submit, or completion goal.
- Secondary inference 1: the observable loss is in the selected-plan-to-form
  handoff.
- Secondary inference 2: the `239px` retreat from maximum depth does not by
  itself establish confusion or intent.
- Anomaly: none.

### `4221380085073052009`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `16.910s`, free-plan click on node `490` at
  `41.118s`, then 8 scroll events and EOF `5.853s` later at `finalY=7050`
  (`maxY=7155`). No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs before the first form action.
- Secondary inference 2: the small post-selection retreat is insufficient to
  identify a causal friction mechanism.
- Anomaly: none.

### `4221381515028201843`

- `converted`: `true`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; first non-zero scroll at `10.171s`, free-plan click on node
  `490` at `37.233s`, field clicks `579 → 584 → 589`, submit-button click
  `592`, explicit submit at `44.453s`, and EOF `2.306s` after submit;
  `maxY=finalY=7117`.
- Secondary inference 1: after form initiation, the visit completes all three
  fields and submission without an observable retry or abandonment.
- Secondary inference 2: the complete five-click sequence matches the
  dominant converted-path DOM variant in this cohort.
- Anomaly: none.

### `4221382124058181993`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `21.884s`, free-plan click on node `490` at
  `43.047s`, then 7 scroll events and EOF `5.798s` later at `finalY=6963`
  (`maxY=7192`). No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs after plan selection but before
  form initiation.
- Secondary inference 2: deep reach is observed; absence of lower-page
  exposure is not a supported explanation.
- Anomaly: none.

### `4221382271923388663`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `21.833s`, free-plan click on node `490` at
  `48.612s`, then 8 scroll events and EOF `6.797s` later at
  `maxY=finalY=7389`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment is localized to the transition after
  selecting the free plan and before the first form action.
- Secondary inference 2: this visit reaches the deepest scroll coordinate
  observed in the shard.
- Anomaly: none.

### `4221383950794490059`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `18.996s`, free-plan click on node `490` at
  `47.755s`, then 7 scroll events and EOF `6.571s` later at
  `maxY=finalY=7389`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs before the form starts, not
  during field completion.
- Secondary inference 2: reaching and remaining at the shard's maximum depth
  argues against a simple lower-section discoverability failure.
- Anomaly: none.

### `4221384057092833308`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `16.810s`, free-plan click on node `490` at
  `41.659s`, then 7 scroll events and EOF `6.658s` later at `finalY=6923`
  (`maxY=7172`). No form-open, field, submit, or completion goal.
- Secondary inference 1: the observable drop-off is after plan commitment and
  before any field interaction.
- Secondary inference 2: the `249px` post-selection retreat alone cannot
  distinguish deliberation from ordinary scrolling.
- Anomaly: none.

### `4221384210557436074`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `11.997s`, free-plan click on node `490` at
  `41.175s`, then 7 scroll events and EOF `5.437s` later at
  `maxY=finalY=7228`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs in the selected-plan-to-form
  handoff.
- Secondary inference 2: the visit remains at its deepest observed point, so
  lack of deep page reach is not supported.
- Anomaly: none.

### `4221386308730224962`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `19.503s`, free-plan click on node `490` at
  `46.283s`, then 6 scroll events and EOF `5.571s` later at
  `maxY=finalY=7362`. No form-open, field, submit, or completion goal.
- Secondary inference 1: the recorded loss is after plan selection and before
  form initiation.
- Secondary inference 2: deep final reach makes insufficient lower-page
  exposure an unsupported explanation for this visit.
- Anomaly: none.

## Shard summary

- Coverage: `10/10` assigned visits; all three endpoint statuses are HTTP 200
  for every bundle.
- Converted: `1/10`; non-converted: `9/10`.
- All 10 visits select the free plan through node `490`.
- Every non-converter ends roughly `5.4–6.8s` after the plan click without a
  field interaction or form goal. The sole converter follows the uninterrupted
  `490 → 579 → 584 → 589 → 592 → submit` path.
- Within this shard, the dominant loss is therefore localized after selection
  and before form initiation; no field-level abandonment is observed.
