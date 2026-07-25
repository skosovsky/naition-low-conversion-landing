# C23 Webvisor shard 02

## Contract

- Scope: filenames 11–20 in bytewise-sorted `raw/yandex/visits/*.json`.
- Evidence: frozen per-visit bundles plus immutable phase-1 profiles; no live
  systems used.
- `converted=true` only when the visit goals contain `Registration Completed`.
- Times are seconds after the Webvisor event stream starts. `maxY` and
  `finalY` are observed scroll coordinates, not evidence of reading.

## Visits

### `4221344613332681056`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `20.886s`, free-plan click on node `490` at `42.277s`,
  then scrolling to `maxY=finalY=7359` and EOF at `48.092s`. No form-open,
  field, submit, or completion event.
- Secondary inference 1: abandonment is after free-plan selection and before
  any observable form interaction.
- Secondary inference 2: deep page reach is observed, so failure to reach the
  registration area is not supported.
- Anomaly: none.

### `4221355883783520413`

- `converted`: `true`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; plan click `490` at `39.336s`, field clicks
  `579 → 584 → 589`, submit-button click `592` at `46.332s`, explicit submit
  at `46.337s`, EOF at `48.123s`; `maxY=finalY=7124`.
- Secondary inference 1: after form initiation, the observed path is an
  uninterrupted three-field-and-submit sequence.
- Secondary inference 2: no field retry or post-open abandonment is observed.
- Anomaly: none.

### `4221356590613922015`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `21.239s`, free-plan click `490` at `51.283s`, then
  scrolling to `maxY=finalY=7379` and EOF at `57.088s`. No form interaction or
  completion goal.
- Secondary inference 1: loss occurs in the selected-plan-to-form handoff.
- Secondary inference 2: this visit has the deepest final scroll position in
  the shard, opposing an insufficient-depth explanation.
- Anomaly: none.

### `4221356659541016622`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `15.823s`, free-plan click `490` at `38.897s`, then
  scrolling and EOF at `44.924s`; `maxY=7294`, `finalY=7070`. No form-open,
  field, submit, or completion event.
- Secondary inference 1: abandonment occurs before the first form action.
- Secondary inference 2: the modest post-selection retreat does not by itself
  establish confusion or a causal friction source.
- Anomaly: none.

### `4221356687837626632`

- `converted`: `true`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; plan click `490` at `36.278s`, field clicks
  `579 → 584 → 589`, submit-button click `592` at `43.207s`, explicit submit
  at `43.212s`, EOF at `45.748s`; `maxY=finalY=7120`.
- Secondary inference 1: form entry is followed by a direct three-field submit
  with no observable correction.
- Secondary inference 2: the conversion path matches the dominant converted
  DOM sequence in the phase-1 profile.
- Anomaly: none.

### `4221357339426423014`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `15.166s`, click on the text child `491` of the free-plan
  control at `40.740s`, then scrolling to `maxY=finalY=7107` and EOF at
  `45.588s`. No form interaction or completion goal.
- Secondary inference 1: abandonment occurs after the same plan selection as
  node-`490` visits; the text-child target is only a DOM hit-target variant.
- Secondary inference 2: the observed loss is before form initiation.
- Anomaly: none.

### `4221357384900018548`

- `converted`: `true`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected →
  Registration Form Opened → Registration Attempted → Registration
  Completed`; clicks target the text-child DOM variant
  `491 → 580 → 585 → 590 → 593`, with plan selection at `43.506s`,
  submit-button click at `50.404s`, explicit submit at `50.412s`, and EOF at
  `52.846s`; `maxY=finalY=7108`.
- Secondary inference 1: the text-child targets represent the same free-plan,
  three-field, submit path as the element-target variant.
- Secondary inference 2: no retry or abandonment is observed after form entry.
- Anomaly: none.

### `4221358046938923104`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `16.531s`, free-plan click `490` at `39.192s`, then
  scrolling to `maxY=finalY=7148` and EOF at `44.454s`. No form-open, field,
  submit, or completion event.
- Secondary inference 1: abandonment is concentrated at the plan-to-form
  transition.
- Secondary inference 2: remaining at the deepest observed position does not
  support a missed lower-page section.
- Anomaly: `Landing Viewed` is timestamped at `1s` rather than `0s`; no
  downstream consequence is visible.

### `4221358606264303617`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `19.965s`, free-plan click `490` at `46.158s`, then
  scrolling to `maxY=finalY=7228` and EOF at `51.782s`. No form interaction or
  completion goal.
- Secondary inference 1: loss occurs after selection but before form
  initiation.
- Secondary inference 2: the deep final position opposes a simple page-reach
  failure.
- Anomaly: none.

### `4221359137366212643`

- `converted`: `false`
- Primary observed behavior: `Landing Viewed → Pricing Plan Selected`; first
  non-zero scroll at `16.358s`, free-plan click `490` at `34.800s`, then
  scrolling to `maxY=finalY=7228` and EOF at `40.652s`. No form-open, field,
  submit, or completion event.
- Secondary inference 1: abandonment occurs before the first form action.
- Secondary inference 2: this is the fastest plan selection in the shard, but
  it still terminates in the dominant post-selection/pre-form loss state.
- Anomaly: none.

## Shard summary

- Coverage: `10/10` assigned visits; every bundle is `exported` and all three
  endpoint statuses are HTTP 200.
- Converted: `3/10`; non-converted: `7/10`.
- All seven non-converters select the free plan, reach a deep page position,
  and terminate without an observable form action.
- All three converters follow a single uninterrupted
  plan → three fields → submit sequence. This shard contains no form-level
  abandonment, retry, or failed submit.
- The discriminating boundary in this shard is form initiation, not plan
  selection, scroll depth, field completion, or submission.
