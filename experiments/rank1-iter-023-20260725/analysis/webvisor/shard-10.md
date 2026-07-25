# C23 Webvisor shard 10 — visits 91–100

## Scope and evidence contract

- Inputs: the last ten lexicographically sorted immutable files in
  `raw/yandex/visits/`.
- Analysis mode: local frozen files only; no MCP, browser, UI, network, Git, or
  site mutation.
- Coverage: 10/10 assigned visit IDs, each represented exactly once.
- All ten bundles have `status=exported` and successful HTTP 200 responses for
  `getVisitInfo`, `getCalculatedVisitInfo`, and `fetchHit`.
- `converted=yes` requires the recorded `Registration Completed` goal. It does
  not claim an identity-level join to server persistence.
- Scroll depth uses parsed raw `fetchHit` events at `event.meta.y`; viewport
  height is 720 px and page height is 8,083 px for every visit.

## Per-visit evidence

`Plan → end` is measured from the calculated `Pricing Plan Selected` timestamp
to the final recorded activity. “No field start” means that after the pricing
click there is no contact-field focus/change and no submit; the single focus
in such visits belongs to the pricing control itself.

| Visit ID | Converted | Primary observed behavior | Supporting evidence | Secondary inference (max 2) | Anomaly |
|---|---:|---|---|---|---|
| `4221457528519655731` | yes | Full pricing → form → submit → completion path. | 56 s; first non-zero scroll 15.755 s; plan/open/completed goals at 48/50/54 s; five clicks on `490→579→584→589→592`; 45 changes; one submit; max/final Y 7,107; plan → end 8.677 s. | (1) Once this visit began the form, no abandonment is observed. | None. |
| `4221458076464054596` | no | Selected pricing once, reached the bottom zone, then ended without a field start. | 41 s; first scroll 16.953 s; plan at 35 s; one click on `490`; no change/submit; max Y 7,174, final Y 7,072; plan → end 6.261 s. | (1) The observed loss is at the post-selection handoff, not page reach. | None. |
| `4221459016994258945` | yes | Full pricing → form → submit → completion path. | 59 s; first scroll 21.130 s; plan/open/completed at 51/54/58 s; five clicks on `490→579→584→589→592`; 48 changes; one submit; max/final Y 7,301; plan → end 8.918 s. | (1) The relatively late first scroll did not prevent conversion. | None. |
| `4221461639447183675` | no | Selected pricing once and stopped without beginning the form. | 47 s; first scroll 13.860 s; plan at 41 s; one click on `490`; no change/submit; max Y 7,296, final Y 7,019; plan → end 6.921 s. | (1) Deep page exposure did not translate into the next voluntary action. | None. |
| `4221462743921721600` | no | Selected pricing once and exited after continued lower-page scrolling, with no field start. | 46 s; first scroll 15.810 s; plan at 41 s; one click on `490`; no change/submit; max Y 7,107, final Y 6,899; plan → end 5.639 s. | (1) The handoff after selection is the only observed funnel break. | None. |
| `4221462858078618014` | no | Selected pricing once, reached the bottom zone, and ended without form interaction. | 41 s; first scroll 13.749 s; plan at 37 s; one click on `490`; no change/submit; max Y 7,294, final Y 7,064; plan → end 4.693 s. | (1) This is consistent with rapid post-selection abandonment; motive is not observable. | None. |
| `4221463837793058911` | yes | Full pricing → form → submit → completion path using the alternate DOM-node variant. | 47 s; first scroll 15.633 s; plan/open/completed at 39/42/46 s; five clicks on `491→580→585→590→593`; 41 changes; one submit; max/final Y 7,202; plan → end 8.736 s. | (1) The alternate target IDs do not correspond to an observed loss in this visit. | DOM-node identity differs from the `490→…→592` variant; semantic cause is not proven. |
| `4221466304699433136` | no | Selected pricing once and ended at its maximum lower-page position without a field start. | 50 s; first scroll 15.443 s; plan at 46 s; one click on `490`; no change/submit; max/final Y 7,211; plan → end 4.918 s. | (1) Reaching the lower zone is insufficient without a successful post-plan transition. | `Landing Viewed` is recorded at 1 s rather than 0 s; no funnel effect is observed. |
| `4221467868233728179` | no | Selected pricing once and ended at maximum page depth without form interaction. | 52 s; first scroll 16.660 s; plan at 47 s; one click on `491`; no change/submit; max/final Y 7,301; plan → end 5.056 s. | (1) The deepest observed reach still did not produce a form start. | `Landing Viewed` is at 1 s; pricing target is alternate node `491`. Neither difference proves a behavioral cause. |
| `4221469010905792667` | no | Selected pricing once, scrolled back slightly, and ended without a field start. | 44 s; first scroll 17.824 s; plan at 38 s; one click on `491`; no change/submit; max Y 7,132, final Y 6,911; plan → end 6.280 s. | (1) Post-selection backtracking is compatible with an unclear/insufficient handoff, but intent is unobserved. | Alternate pricing target `491`; no endpoint or goal inconsistency. |

## Shard-level result

- Converted: **3/10**.
- Pricing selected: **10/10**.
- Form opened: **3/10**.
- Among form openers, attempted/completed: **3/3**.
- Non-converted after pricing selection: **7/10**; all seven reached
  `maxY=7,107–7,301`, produced exactly one pricing click, and recorded no
  contact-field change or submit.
- Converted and non-converted visits both reached the same bottom page zone.
  The discriminating observed action is form initiation after pricing
  selection, not scroll reach.

## Interpretation boundary

The shard supports a high-capacity bottleneck at `Pricing Plan Selected →
Registration Form Opened`. It does not identify why seven visitors stopped:
affordance, commitment, privacy, copy, simulator policy, or another cause
remain competing explanations. Scroll position is exposure, not proof of
reading or attention.
