# C23 Webvisor shard 07

## Contract

- Scope: filenames 61–70 in bytewise-sorted
  `raw/yandex/visits/*.json`.
- Evidence: frozen per-visit bundles and immutable phase-1 converted and
  non-converted profiles; no live systems used.
- `converted=true` only when the goal list contains
  `Registration Completed`.
- Times are seconds after the start of the Webvisor event stream. `maxY` and
  `finalY` are observed scroll coordinates, not evidence of reading.

## Visits

### `4221414438471729341`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll at `23.770s`, plan click on node `490` at `53.331s`,
  then 10 scroll events and EOF `6.214s` later at `finalY=7049`
  (`maxY=7297`). No form-open, field-input, submit, or completion goal.
- Secondary inference 1: the observable abandonment is after plan selection
  and before form initiation.
- Secondary inference 2: deep page reach is observed; insufficient content
  reach is not supported for this visit.
- Anomaly: first non-zero scroll is later than the converted-profile range
  (`8.7–22.0s`), but this is one non-converted observation and does not prove
  causality.

### `4221415159893065881`

- `converted`: `true`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; first non-zero scroll `19.522s`, plan click `490` at `53.481s`,
  field clicks `579 → 584 → 589`, submit-button click `592` at `60.294s`,
  explicit submit at `60.300s`, and EOF `1.626s` after the last click;
  `maxY=finalY=7194`.
- Secondary inference 1: after form initiation, the visit proceeds through all
  three fields and submit without observable abandonment or retry.
- Secondary inference 2: its five-click sequence matches the dominant
  converted-path DOM variant in the phase-1 profile.
- Anomaly: none.

### `4221420562692440343`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `15.743s`, plan click on node `491` at `39.086s`,
  then 6 scroll events and EOF `5.039s` later at
  `maxY=finalY=7107`. No form-open, field-input, submit, or completion goal.
- Secondary inference 1: the visit exits at the selected-plan-to-form
  transition.
- Secondary inference 2: ending at the deepest observed position does not
  support a failure to reach the lower-page registration area.
- Anomaly: none.

### `4221421245372825822`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `12.405s`, plan click on node `490` at `40.046s`,
  then 7 scroll events and EOF `6.111s` later at `finalY=7026`
  (`maxY=7190`). No form-open, field-input, submit, or completion goal.
- Secondary inference 1: abandonment occurs after plan selection and before
  any observable form interaction.
- Secondary inference 2: the small retreat from `maxY` cannot by itself
  establish confusion or intent.
- Anomaly: none.

### `4221422058341400671`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `20.971s`, plan click on node `490` at `51.162s`,
  then 6 scroll events and EOF `5.107s` later at
  `maxY=finalY=7245`. No form-open, field-input, submit, or completion goal.
- Secondary inference 1: the loss occurs before the first form action.
- Secondary inference 2: deep final reach and a single plan click match the
  dominant non-converted profile rather than an early-exit cluster.
- Anomaly: none.

### `4221422201079332940`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `16.298s`, plan click on node `490` at `43.507s`,
  then 6 scroll events and EOF `5.267s` later at
  `maxY=finalY=7274`. No form-open, field-input, submit, or completion goal.
- Secondary inference 1: abandonment is localized to the
  selected-plan-to-form handoff.
- Secondary inference 2: there is no repeated click, field attempt, or submit
  evidence suggesting technical form friction.
- Anomaly: none.

### `4221422345086304773`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `11.461s`, plan click on node `490` at `38.718s`,
  then 7 scroll events and EOF `5.331s` later at
  `maxY=finalY=7201`. No form-open, field-input, submit, or completion goal.
- Secondary inference 1: the observable drop occurs before form initiation.
- Secondary inference 2: remaining at the deepest observed position rules
  against a simple missed-lower-section explanation.
- Anomaly: click viewport `y=651` differs from the common `y=359` in this
  shard, but the same plan target and goal fire; no semantic difference is
  proven.

### `4221422909757587679`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `12.458s`, plan click on node `490` at `33.084s`,
  then 8 scroll events and EOF `6.343s` later at `finalY=6940`
  (`maxY=7107`). No form-open, field-input, submit, or completion goal.
- Secondary inference 1: abandonment occurs after selection but before the
  first form action.
- Secondary inference 2: the modest post-selection retreat does not identify
  a causal source of friction.
- Anomaly: this is the earliest plan click in the shard, but it remains inside
  the converted-profile plan-time range (`33–56s`).

### `4221423745381957884`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `20.769s`, plan click on node `491` at `48.694s`,
  then 7 scroll events and EOF `6.536s` later at
  `maxY=finalY=7389`. No form-open, field-input, submit, or completion goal.
- Secondary inference 1: the loss is at the selected-plan-to-form
  transition, not earlier content reach.
- Secondary inference 2: this visit reaches the largest scroll coordinate in
  the shard, so insufficient depth is not a supported explanation.
- Anomaly: none.

### `4221424250204717399`

- `converted`: `true`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; first non-zero scroll `17.786s`, plan click `490` at `46.093s`,
  field clicks `579 → 584 → 589`, submit-button click `592` at `52.643s`,
  explicit submit at `52.650s`, and EOF `1.921s` after the last click;
  `maxY=finalY=7279`.
- Secondary inference 1: no field-level abandonment or retry is observed once
  the form is opened.
- Secondary inference 2: the five-click sequence is identical to the other
  converted visit in this shard and the dominant converted-path variant.
- Anomaly: none.

## Shard summary

- Coverage: `10/10` assigned visits; all three endpoint statuses are HTTP 200
  for every bundle.
- Converted: `2/10`; non-converted: `8/10`.
- All eight non-converters select a plan, reach the deep lower-page region,
  and end `5.039–6.536s` after the plan click without opening the form.
- Both converters follow the complete five-click
  plan/three-fields/submit sequence. No form-open abandonment, retry, rage
  click, or submit failure is observed.
- This shard reinforces the phase-1 bottleneck at
  `Pricing Plan Selected → Registration Form Opened`; it provides no evidence
  that topic reach, scroll depth, or form-field mechanics distinguish the two
  outcomes before that transition.
