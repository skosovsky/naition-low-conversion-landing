# C23 Webvisor shard 03 — sorted visits 21–30

## Evidence boundary

- Read-only source: frozen `raw/yandex/visits/*.json`, lexicographically sorted,
  positions 21–30.
- Profile context: `analysis/phase1/converted-profile.md` and
  `analysis/phase1/nonconverted-profile.md`.
- Coverage: 10/10 bundles have successful `getVisitInfo`,
  `getCalculatedVisitInfo`, and `fetchHit` responses.
- All 10 are non-converted: each has `Landing Viewed` and
  `Pricing Plan Selected`, but none has `Registration Form Opened`,
  `Registration Attempted`, or `Registration Completed`.
- A Webvisor `focus` on target `490`/`491` immediately before the click is
  focus on the selectable pricing control, not evidence of form-field focus.

## Per-visit observations

| Visit ID | Converted | Primary observed sequence / exit | Secondary hypotheses and anomalies |
|---|---|---|---|
| `4221360998685605898` | No | First scroll at 9.887 s; traversed to the pricing area; clicked pricing target `490` at 30.945 s; continued through five scroll events to final/max Y=7,125; exited 5.365 s after selection without any form interaction. | Hypothesis: the post-selection handoff did not induce the next action. No anomalous retry, error, or rage-click signal. |
| `4221368556252823897` | No | First scroll at 11.181 s; reached max Y=7,107; clicked pricing target `491` at 37.143 s; scrolled farther and then back from Y=7,107 to final Y=6,853; exited 6.401 s after selection without opening the form. | Hypothesis: the selected state alone was insufficient to start registration. Anomaly: only visit in this shard whose final Y is materially below its maximum after selection. |
| `4221368609124122796` | No | First scroll at 16.643 s; clicked pricing target `490` at 46.068 s; continued through seven scroll events to final/max Y=7,389; exited 5.545 s later with no form-field action. | Hypothesis: reaching the lower registration zone did not make the next step compelling or unmistakable. Max Y=7,389 is joint-highest in this shard, so insufficient page reach is contradicted. |
| `4221368785683611854` | No | First scroll at 19.302 s; clicked pricing target `490` at 44.690 s; made nine further scroll events to final/max Y=7,389; exited 5.790 s later without form open or input. | Hypothesis: the transition from selection to form initiation remained inactive from the visitor's perspective. Nine post-click scroll events are the joint-highest in this shard, but there is no retry or field focus. |
| `4221369426739462356` | No | First scroll at 13.120 s; clicked pricing target `490` at 31.528 s; continued through five scroll events to final/max Y=7,127; exited 5.467 s later without form interaction. | Hypothesis: a separate next action after selection was not taken. No local anomaly; this is the dominant non-converted sequence. |
| `4221369796693065975` | No | First scroll at 16.876 s; clicked pricing target `490` at 38.253 s; continued through six scroll events to final/max Y=7,259; exited 6.007 s later without form open, input, or submit. | Hypothesis: post-selection value/affordance was insufficient to initiate contact entry. No evidence of technical form friction because the form was never engaged. |
| `4221369899748688299` | No | First scroll at 23.471 s; clicked pricing target `490` at 56.616 s; continued through five scroll events to final/max Y=7,127; exited 5.510 s later without form interaction. | Hypothesis: even a longer pre-selection reading path did not bridge the selection-to-form step. Anomaly: 62 s is the longest visit in this shard, yet its post-selection behavior matches the dominant exit. |
| `4221370622921932927` | No | First scroll at 16.089 s; clicked pricing target `490` at 45.480 s; made seven more scroll events, ending at its max Y=7,107; exited 5.316 s later without opening the form. | Hypothesis: lower-page traversal after selection did not expose a sufficiently effective next action. Anomaly: six scroll-direction changes versus four for most shard visits, but the phase-1 profile says backtracking is not conversion-discriminating. |
| `4221371342333149344` | No | First scroll at 14.424 s; clicked pricing target `490` at 43.482 s; continued through six scroll events to final/max Y=7,296; exited 5.215 s later with no form action. | Hypothesis: the selected-plan state failed to trigger registration initiation. No anomalous click or error pattern. |
| `4221371674773684529` | No | First scroll at 17.644 s; clicked pricing target `490` at 40.320 s; continued through six scroll events to final/max Y=7,194; exited 6.087 s later without form open, input, or submit. | Hypothesis: the handoff after plan selection was not sufficiently direct. No observed technical failure or repeated attempt. |

## Shard-level conclusion

This shard is homogeneous: **10/10 selected a plan, 10/10 reached the deep
lower-page area, and 0/10 began the form**. Every visit remained active for
5.2–6.4 seconds after selection and scrolled further, so the evidence
contradicts an early-exit or insufficient-reach explanation. It supports the
phase-1 bottleneck at `Pricing Plan Selected → Registration Form Opened`.

The recordings do not establish why the next action was absent. Weak
affordance, insufficient motivation, and simulator policy remain hypotheses;
none should be reported as an observed cause. The unusual reverse exit,
long-duration visit, and additional backtracking do not create separate
high-capacity clusters.
