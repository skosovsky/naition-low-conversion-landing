# C23 converted profile — frozen Yandex cohort

## Scope and evidence boundary

- Source: immutable files under `raw/yandex/`; no live data was queried.
- Exact Yandex cohort list: 100 unique visit IDs, unsampled
  (`sample_share=1`), with complete cohort pagination.
- Yandex marks 27 visits with `Registration Completed`. All 27 corresponding
  visit bundles are present and have successful `getVisitInfo`,
  `getCalculatedVisitInfo`, and `fetchHit` responses.
- This profile therefore covers **27/27 Yandex-confirmed conversions**.
- The Yandex snapshot is still globally `partial`: one *non-converted* bundle
  (`4221392525409649098`) lacks `fetchHit`. That omission does not reduce the
  converted-profile coverage.
- Server/Amplitude report 28 conversions, while Yandex reports 27. The missing
  cross-system conversion cannot be assigned to a Yandex visit from these
  files; its cause remains unproven. Claims below describe the 27 observable
  Yandex conversions, not all 28 server-side orders.

## Cohort facts

All 27 converted visits share the same reported acquisition/runtime profile:

- direct traffic: 27/27;
- Russia: 27/27;
- Windows 10 or later: 27/27;
- Google Chrome: 27/27;
- one page view: 27/27;
- Yandex activity grade 3: 27/27.

Every converted bundle contains the same ordered product-goal chain:

1. `Landing Viewed` — 27/27;
2. `Pricing Plan Selected` — 27/27;
3. `Registration Form Opened` — 27/27;
4. `Registration Attempted` — 27/27;
5. `Registration Completed` — 27/27.

There is no observed loss after the form opens: **27 opened → 27 attempted →
27 completed**. In 26 visits the attempted and completed goals have the same
one-second Yandex timestamp; in one visit completion follows attempt by one
second.

## Common behavioral sequence

The raw Webvisor event stream yields one highly regular sequence:

1. Initial dwell before first non-zero scroll: median 16.9 s, range
   8.7–22.0 s.
2. Long scroll traversal: 46–55 scroll events, median 51; observed maximum
   scroll Y 7,107–7,301 px (median 7,200 px).
3. Pricing selection: median 43 s after load, range 33–56 s. The first click
   occurs within 0.7 s of the rounded `Pricing Plan Selected` timestamp in all
   27 visits.
4. Form opening: 2–4 s after pricing selection (median 3 s).
5. Form attempt: 4–5 s after form opening (median 4 s).
6. Completion: 0–1 s after attempt.
7. Visit end: 0–2 s after completion (median 1 s).

Every converted visit has exactly five click events. The click-target sequence
has only two DOM-node variants:

- `490 → 579 → 584 → 589 → 592`: 18/27;
- `491 → 580 → 585 → 590 → 593`: 9/27.

The coordinates and goal timing associate the first click with pricing
selection and the next four clicks with opening and completing the form.
Target-number variation is an observed DOM-node identity variation; the frozen
files do not prove a semantic difference between the two variants.

## Per-visit coverage

Times are seconds after visit start. `Scroll` is the first non-zero scroll;
`Plan`, `Open`, and `Done` are Yandex goal timestamps. `Max Y` is the largest
observed page-scroll coordinate.

| Visit ID | Duration | Scroll | Plan | Open | Done | Max Y | Click targets |
|---|---:|---:|---:|---:|---:|---:|---|
| 4221463837793058911 | 47 | 15.6 | 39 | 42 | 46 | 7202 | 491,580,585,590,593 |
| 4221459016994258945 | 59 | 21.1 | 51 | 54 | 58 | 7301 | 490,579,584,589,592 |
| 4221457528519655731 | 56 | 15.8 | 48 | 50 | 54 | 7107 | 490,579,584,589,592 |
| 4221456094410572161 | 44 | 12.3 | 35 | 38 | 42 | 7295 | 490,579,584,589,592 |
| 4221447984477896785 | 51 | 19.4 | 42 | 45 | 49 | 7222 | 491,580,585,590,593 |
| 4221447836343992393 | 56 | 19.7 | 48 | 50 | 55 | 7145 | 491,580,585,590,593 |
| 4221447664338206857 | 42 | 15.7 | 33 | 36 | 41 | 7110 | 491,580,585,590,593 |
| 4221445673842639025 | 46 | 8.7 | 38 | 40 | 44 | 7296 | 490,579,584,589,592 |
| 4221444565679472807 | 44 | 13.4 | 35 | 37 | 42 | 7107 | 490,579,584,589,592 |
| 4221438661032673694 | 65 | 19.7 | 56 | 59 | 64 | 7107 | 490,579,584,589,592 |
| 4221438328079385073 | 55 | 13.8 | 46 | 49 | 53 | 7200 | 490,579,584,589,592 |
| 4221434201983156608 | 51 | 12.9 | 43 | 46 | 50 | 7249 | 490,579,584,589,592 |
| 4221432250228539658 | 61 | 18.0 | 52 | 55 | 59 | 7225 | 490,579,584,589,592 |
| 4221431508827898180 | 49 | 15.9 | 40 | 43 | 48 | 7255 | 490,579,584,589,592 |
| 4221430154053550425 | 63 | 21.8 | 54 | 57 | 61 | 7107 | 491,580,585,590,593 |
| 4221424250204717399 | 54 | 17.8 | 46 | 49 | 53 | 7279 | 490,579,584,589,592 |
| 4221415159893065881 | 61 | 19.5 | 54 | 56 | 61 | 7194 | 490,579,584,589,592 |
| 4221409294458814524 | 51 | 17.3 | 42 | 45 | 49 | 7107 | 491,580,585,590,593 |
| 4221405515146854420 | 59 | 20.7 | 50 | 53 | 57 | 7301 | 490,579,584,589,592 |
| 4221395042459713762 | 46 | 12.3 | 38 | 40 | 44 | 7269 | 491,580,585,590,593 |
| 4221391193877774527 | 43 | 11.1 | 35 | 38 | 42 | 7219 | 491,580,585,590,593 |
| 4221381515028201843 | 46 | 10.2 | 37 | 40 | 45 | 7117 | 490,579,584,589,592 |
| 4221357384900018548 | 52 | 17.9 | 44 | 46 | 50 | 7108 | 491,580,585,590,593 |
| 4221356687837626632 | 45 | 12.2 | 37 | 39 | 44 | 7120 | 490,579,584,589,592 |
| 4221355883783520413 | 48 | 16.9 | 40 | 42 | 47 | 7124 | 490,579,584,589,592 |
| 4221344437146222882 | 55 | 17.2 | 46 | 49 | 53 | 7241 | 490,579,584,589,592 |
| 4221344478220255668 | 62 | 22.0 | 53 | 57 | 61 | 7120 | 490,579,584,589,592 |

## Discriminators against non-converted visits

Observed exact-cohort comparison:

- 99/100 visits reached `Pricing Plan Selected`;
- only 27/99 selected visits reached `Registration Form Opened`;
- all 27 form-open visits completed registration;
- converted and non-converted selected visits have the same median pricing
  timestamp (43 s);
- first-scroll medians are also effectively equal: 16.876 s converted versus
  16.876 s among the 72 non-converted selected visits;
- maximum-scroll medians are close: 7,200 px converted versus 7,228 px among
  non-converted selected visits;
- scroll-event medians are close: 51 converted versus 53 non-converted
  selected visits;
- converted visits remain active a median 9 s after plan selection, versus
  5 s for non-converted selected visits.

Thus the observable discriminator is **not content reach, scroll depth, or
time-to-plan-selection**. It is whether the visitor performs the additional
post-selection action that opens the form. Once that action occurs, the frozen
cohort shows no further funnel loss.

## Inference, explicitly separated

1. **Strong inference:** C23's topic-order treatment did not create a distinct
   pre-pricing behavior among converters. Converted and non-converted selected
   paths are nearly indistinguishable until the post-selection handoff.
2. **Strong inference:** The highest-capacity observable bottleneck is the
   `Pricing Plan Selected → Registration Form Opened` transition (72/99 lost),
   not the form itself (0/27 lost after open).
3. **Moderate inference:** Requiring a separate action after plan selection may
   create avoidable abandonment. The data supports testing a direct,
   unmistakable transition from a selected plan to registration.
4. **Not proven:** The recordings do not establish *why* the 72 visitors stop:
   weak affordance, deliberate refusal, simulator policy, hidden state, or
   another cause. They also do not prove that automatically opening the form
   would turn all 72 into orders.

## Actionable discriminator for the next hypothesis

If the exact mechanism has not already been closed by a prior controlled
iteration, the next candidate should target only the observed redundant
handoff:

> A plan-selection action immediately reveals/focuses the registration form
> (or the selected plan's CTA becomes the single obvious next action), while
> preserving explicit user consent and all existing plan facts.

The causal prediction should be measured at the exact transition:

- primary diagnostic: `Registration Form Opened / Pricing Plan Selected`;
- guardrail: `Registration Completed / Registration Form Opened` must not
  decrease;
- authoritative outcome: server orders per exact server visits;
- hard success remains leaderboard rank 1 and at least 40% conversion.

This direction has observed numerical capacity (only 13–14 additional orders
would be needed to move 27–28 orders above 40/101), whereas further
topic-order/content-reach changes do not have a converted-path discriminator
in C23. Reuse is invalid if prior evidence already closed the same
plan-selection-to-form mechanism; in that case C23 provides evidence to avoid
another content-order iteration, not permission to relabel a closed treatment.
