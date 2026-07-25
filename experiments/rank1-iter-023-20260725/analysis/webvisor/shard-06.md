# C23 Webvisor shard 06 — visits 51–60

## Evidence boundary

- Read-only source: frozen `raw/yandex/visits/*.json`, lexicographic positions
  51–60, plus the frozen phase-1 converted and non-converted profiles.
- Conversion means the visit contains the Yandex goal
  `Registration Completed`; a pricing-card click alone is not a conversion.
- Behavioral statements below are observations from the event stream.
  Hypotheses are explicitly tentative and do not identify user intent.
- Coverage: 10/10 bundles have successful `getVisitInfo`,
  `getCalculatedVisitInfo`, and `fetchHit` responses.

## Per-visit analysis

### 51 — `4221400013915554013`

- **Converted:** no.
- **Primary observed behavior:** after a 19.6 s pre-scroll dwell, the visit
  traversed the page deeply (58 scroll events, max Y 7,305 px), clicked the
  free-plan control once at 48.1 s (`target=490`), then ended 6.4 s later at
  Y 7,178 px. It never interacted with a registration field or submit.
- **Secondary hypotheses:**
  1. The post-selection handoff did not create a sufficiently obvious next
     action.
  2. The visitor deliberately declined to provide contact details despite
     selecting the plan.
- **Anomaly:** none material; five direction reversals and the deep final
  position fit the non-converted phase-1 profile.

### 52 — `4221402736061579781`

- **Converted:** no.
- **Primary observed behavior:** first non-zero scroll at 20.6 s; 51 scroll
  events reached Y 7,119 px. One free-plan click occurred at 41.1 s
  (`target=490`), followed by no form interaction and exit 5.9 s later at
  Y 6,953 px.
- **Secondary hypotheses:**
  1. Plan selection changed state but failed to pull attention into the form.
  2. Contact submission was not valuable enough to justify the next action.
- **Anomaly:** none material; activity grade 2 and five direction reversals
  match the dominant non-converted pattern.

### 53 — `4221405515146854420`

- **Converted:** yes.
- **Primary observed behavior:** after first scrolling at 20.7 s, the visit
  reached the bottom region and clicked the free plan at 50.2 s
  (`target=490`). It then completed the uninterrupted form sequence:
  name at 53.0 s (`579`), phone at 54.4 s (`584`), e-mail at 55.7 s
  (`589`), submit at 57.6 s (`592`). All registration goals, including
  `Registration Completed`, are present.
- **Secondary hypotheses:**
  1. Once the visitor initiated the first field, the compact form imposed no
     observable blocking friction.
  2. The roughly 2.9 s plan-to-first-field interval represents a clear enough
     handoff for this successful path.
- **Anomaly:** none material; five unique clicks, one submit, activity grade 3,
  and final Y 7,301 px match the converted profile.

### 54 — `4221407438640251065`

- **Converted:** no.
- **Primary observed behavior:** first non-zero scroll at 17.5 s; 55 scroll
  events reached Y 7,306 px. The only click selected the free plan at 43.2 s
  (`target=490`); the visit remained in the lower page region and ended 6.4 s
  later at Y 7,090 px without touching the form.
- **Secondary hypotheses:**
  1. The selected-plan state did not make the first form action salient.
  2. The visitor chose the plan for comparison but did not intend to register.
- **Anomaly:** none material; five direction reversals are typical for this
  cohort.

### 55 — `4221407783836713048`

- **Converted:** no.
- **Primary observed behavior:** this visit had the longest pre-scroll dwell
  in the shard (22.5 s), then traversed to Y 7,389 px. It clicked the free
  plan once at 49.5 s (`target=490`) and exited 5.5 s later at the same final
  Y, with no registration-field or submit events.
- **Secondary hypotheses:**
  1. The visitor finished evaluating the page but the post-plan transition
     failed to trigger form initiation.
  2. The request for contact data outweighed the perceived benefit.
- **Anomaly:** max/final Y 7,389 px is the deepest position in this shard, but
  it is still a normal deep non-converted exit rather than evidence of form
  friction.

### 56 — `4221408999031439412`

- **Converted:** no.
- **Primary observed behavior:** first scroll at 15.0 s; 53 scroll events
  reached Y 7,249 px. One free-plan click occurred at 44.4 s
  (`target=490`), after which there was no field interaction and the visit
  ended 5.5 s later at Y 7,005 px.
- **Secondary hypotheses:**
  1. The form was available but not sufficiently connected to the selected
     plan in the visitor's attention.
  2. The visitor rejected the contact-information exchange after selecting.
- **Anomaly:** a second `windowfocus` event occurred, but there is no
  corresponding repeated plan click, field interaction, or submit; its
  meaning is indeterminate.

### 57 — `4221409294458814524`

- **Converted:** yes.
- **Primary observed behavior:** after first scrolling at 17.3 s, the visit
  selected the free plan at 41.8 s (`target=491`) and began the form 2.6 s
  later. It proceeded through name (`580`), phone (`585`), e-mail (`590`),
  and submit (`593`) by 49.0 s. All registration goals are present, including
  completion.
- **Secondary hypotheses:**
  1. Immediate progression from the selected plan into the first field
     distinguishes this success from the eight failures in the shard.
  2. No observable validation or submission friction interrupted the form.
- **Anomaly:** six scroll-direction reversals are slightly above the phase-1
  median of four, but successful completion shows no adverse consequence.

### 58 — `4221409698896150670`

- **Converted:** no.
- **Primary observed behavior:** first scroll at 20.1 s; 52 scroll events
  reached Y 7,107 px. The only click selected the free plan at 40.7 s
  (`target=490`), then the visit ended 6.0 s later at Y 6,904 px without any
  registration interaction.
- **Secondary hypotheses:**
  1. The plan-to-form affordance was not strong enough to initiate the next
     step.
  2. Selection represented interest without willingness to register.
- **Anomaly:** seven direction reversals are the most in this shard, but
  phase-1 evidence shows backtracking is not a conversion discriminator.

### 59 — `4221411519823872049`

- **Converted:** no.
- **Primary observed behavior:** first scroll at 22.0 s; 51 scroll events
  reached and finished at Y 7,383 px. A single free-plan click occurred at
  42.7 s (`target=491`); no field or submit events followed before exit 5.5 s
  later.
- **Secondary hypotheses:**
  1. Even at the deepest page position, selecting the plan did not establish
     a clear next-step transition.
  2. The visitor may have completed comparison without deciding to exchange
     contact details.
- **Anomaly:** none material; the alternate pricing target `491` is the known
  DOM-node variant, not evidence of a semantic difference.

### 60 — `4221411543930372468`

- **Converted:** no.
- **Primary observed behavior:** first scroll at 17.1 s; 56 scroll events
  reached Y 7,139 px. The sole click selected the free plan at 40.1 s
  (`target=490`), followed by no form interaction and exit 6.1 s later at
  Y 6,922 px.
- **Secondary hypotheses:**
  1. The selected-plan state did not direct attention into the first form
     field.
  2. The perceived registration payoff did not overcome contact-entry cost.
- **Anomaly:** this visit has fewer mousemove events (41) than the other
  non-converted visits in the shard, but its scroll, plan-selection, and exit
  sequence remains structurally typical.

## Shard-level signal

- Outcome: **2 converted / 10 visits**.
- All 10 reached the lower page and selected the free plan.
- Both converted visits moved from plan selection to the first field within
  2.6–2.9 s and completed the entire form without retry.
- All eight non-converted visits made exactly one plan click, no form-field
  click/change and no submit, then ended 5.5–6.4 s after selection.
- This shard reinforces the phase-1 bottleneck at
  `Pricing Plan Selected → Registration Form Opened`. It provides no evidence
  that scroll depth, field validation, or submit behavior is the limiting
  stage. It does not prove whether the cause is affordance, motivation,
  simulator policy, or another unobserved factor.
