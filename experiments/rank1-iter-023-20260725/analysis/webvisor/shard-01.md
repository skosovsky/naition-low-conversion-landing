# C23 Webvisor shard 01

## Contract

- Scope: first 10 filenames in bytewise-sorted `raw/yandex/visits/*.json`.
- Evidence: frozen per-visit bundles plus immutable phase-1 converted and
  non-converted profiles; no live systems used.
- `converted=true` only when the visit goal list contains
  `Registration Completed`.
- Times below are seconds after the start of the Webvisor event stream.
- `maxY` and `finalY` are observed scroll coordinates, not eye-tracking.

## Visits

### `4221343402055434429`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed`; first non-zero scroll at
  `1.129s`; four clicks on content-card nodes `194 → 203 → 212 → 221` while
  scrolling to `maxY=finalY=2425`; EOF at `2.545s`. No
  `Pricing Plan Selected` or form goal.
- Secondary inference 1: this is an early content-area exit, unlike the
  dominant deep-scroll/plan-selection non-converter path.
- Secondary inference 2: capacity is one visit in the 100-visit cohort, so
  this path cannot explain the main conversion deficit.
- Anomaly: metadata duration is rounded to `2s`, while the event stream ends at
  `2.545s`; four clicks occur in roughly `1.1s`.

### `4221344427132059942`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `19.548s`, plan click on node `491` at `40.088s`,
  then 6 scroll events and EOF `5.720s` later at `finalY=7020`
  (`maxY=7133`). No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs after plan selection and before
  any observable form interaction.
- Secondary inference 2: deep page reach is observed; lack of content reach is
  not supported for this visit.
- Anomaly: none.

### `4221344431197126874`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `17.036s`, plan click on node `490` at `40.679s`,
  then 7 scroll events and EOF `5.385s` later at
  `maxY=finalY=7249`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs in the selected-plan-to-form
  handoff.
- Secondary inference 2: the visitor remained at the deepest observed
  position, which does not support a missed lower-page section.
- Anomaly: none.

### `4221344434534744176`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `14.262s`, plan click on node `490` at `43.205s`,
  then 8 scroll events and EOF `5.682s` later at `finalY=7049`
  (`maxY=7260`). No form-open, field, submit, or completion goal.
- Secondary inference 1: the observable loss is after plan selection and
  before form initiation.
- Secondary inference 2: the modest retreat from `maxY` is insufficient to
  establish confusion or reading intent.
- Anomaly: none.

### `4221344436071694489`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `19.395s`, plan click on node `491` at `47.836s`,
  then 5 scroll events and EOF `5.704s` later at
  `maxY=finalY=7165`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs before the first form action.
- Secondary inference 2: deep final reach and ordinary time-to-plan align with
  the dominant non-converter profile, not an early-exit cluster.
- Anomaly: none.

### `4221344436320469226`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `10.521s`, plan click on node `491` at `37.982s`,
  then 6 scroll events and EOF `5.247s` later at
  `maxY=finalY=7228`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs at the selected-plan-to-form
  transition.
- Secondary inference 2: reaching and remaining near the bottom rules against
  a simple failure to reach the registration area.
- Anomaly: none.

### `4221344437146222882`

- `converted`: `true`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; plan click `490` at `46.031s`, field clicks
  `579 → 584 → 589`, submit-button click `592` at `53.173s`, explicit
  submit event at `53.181s`, EOF `2.511s` after the last click;
  `maxY=finalY=7241`.
- Secondary inference 1: once the form starts, this visit shows an uninterrupted
  three-field-and-submit path.
- Secondary inference 2: the five-click sequence matches the dominant
  converted-path DOM variant from the phase-1 profile.
- Anomaly: none.

### `4221344477886545971`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `15.305s`, plan click on node `490` at `40.049s`,
  then 8 scroll events and EOF `5.898s` later at
  `maxY=finalY=7389`. No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs after selection but before form
  initiation.
- Secondary inference 2: this visit reaches the largest scroll coordinate in
  the shard, so insufficient page depth is not a supported explanation.
- Anomaly: none.

### `4221344478220255668`

- `converted`: `true`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; plan click `490` at `53.594s`, field clicks
  `579 → 584 → 589`, submit-button click `592` at `60.909s`, explicit
  submit event at `60.914s`, EOF `1.649s` after the last click;
  `maxY=finalY=7120`.
- Secondary inference 1: no field-level abandonment or retry is observed after
  form entry.
- Secondary inference 2: this is the same five-click converted-path DOM
  variant as visit `4221344437146222882`.
- Anomaly: none.

### `4221344478494458346`

- `converted`: `false`
- Primary observed sequence/exit: `Landing Viewed → Pricing Plan Selected`;
  first non-zero scroll `15.779s`, plan click on node `491` at `45.120s`,
  then 8 scroll events and EOF `6.213s` later at `finalY=7044`
  (`maxY=7260`). No form-open, field, submit, or completion goal.
- Secondary inference 1: abandonment occurs before the first form action.
- Secondary inference 2: the small post-selection retreat does not identify a
  causal friction mechanism.
- Anomaly: none.

## Shard summary

- Coverage: `10/10` assigned visits; all three endpoint statuses are HTTP 200
  for every bundle.
- Converted: `2/10`; non-converted: `8/10`.
- Seven of eight non-converters select a plan and then end without opening the
  form; the remaining visit is the cohort's single early content-area exit.
- Both converters follow the complete five-click plan/three-fields/submit
  sequence. No converted visit in this shard abandons after form opening.
