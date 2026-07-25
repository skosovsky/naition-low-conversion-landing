# C23 Webvisor shard 08 — visits 71–80

## Evidence boundary

- Read-only source: frozen `raw/yandex/visits/*.json`, lexicographic positions
  71–80.
- Conversion means the visit contains the Yandex goal
  `Registration Completed`; a pricing-card click alone is not a conversion.
- Behavioral statements are observations from the event stream. Secondary
  hypotheses are tentative and do not identify user intent.
- Coverage: 10/10 bundles have successful `getVisitInfo`,
  `getCalculatedVisitInfo`, and `fetchHit` responses.

## Per-visit analysis

### 71 — `4221430154053550425`

- **Converted:** yes.
- **Primary observed behavior:** after a 21.8 s pre-scroll dwell, the visit
  traversed the page to Y 7,107 px and selected the free plan at 53.9 s
  (`target=491`). It began the form 2.9 s later, then completed name
  (`580`), phone (`585`), e-mail (`590`), and submit (`593`) by 61.2 s.
  `Registration Completed` was recorded at 61 s.
- **Secondary hypotheses:**
  1. Once plan selection was followed by first-field initiation, no observable
     validation or submission barrier interrupted the path.
  2. The 2.9 s plan-to-field transition is consistent with a sufficiently
     legible handoff for this successful visit.
- **Anomaly:** none material; four direction reversals, five clicks, one
  submit, and activity grade 3 fit the converted pattern.

### 72 — `4221431508827898180`

- **Converted:** yes.
- **Primary observed behavior:** first non-zero scroll occurred at 15.9 s; 51
  scroll events reached Y 7,255 px. The visit selected the free plan at
  40.5 s (`target=490`), entered the first field 2.9 s later, completed all
  three fields, and submitted at 47.7 s. `Registration Completed` followed
  at 48 s.
- **Secondary hypotheses:**
  1. The uninterrupted field sequence provides no evidence of form-entry
     friction once registration started.
  2. The short plan-to-field interval distinguishes this path from the
     non-converted visits in the shard.
- **Anomaly:** none material; the completion goal was stamped about one second
  after the attempted goal, which is normal asynchronous ordering rather than
  a failed submit.

### 73 — `4221432250228539658`

- **Converted:** yes.
- **Primary observed behavior:** after first scrolling at 18.0 s, the visit
  reached Y 7,225 px and clicked the free-plan control at 52.3 s
  (`target=490`). It initiated the first field 3.1 s later, completed the
  three-field sequence, and submitted at 59.4 s; all registration goals,
  including completion, are present.
- **Secondary hypotheses:**
  1. The form itself imposed no observable blocking friction after initiation.
  2. A roughly three-second post-selection handoff was sufficient for this
     visitor to continue.
- **Anomaly:** none material; activity grade 3 and the full five-click sequence
  match the converted profile.

### 74 — `4221433353975365825`

- **Converted:** no.
- **Primary observed behavior:** after a 21.4 s pre-scroll dwell, the visit
  traversed deeply (50 scroll events, max/final Y 7,225 px), selected the free
  plan once at 40.9 s (`target=490`), and ended 5.7 s later without any field
  interaction or submit.
- **Secondary hypotheses:**
  1. The selected-plan state did not make the next registration action salient
     enough to start.
  2. The perceived benefit may not have justified supplying contact data.
- **Anomaly:** none material; activity grade 2 and four direction reversals
  match the dominant non-converted pattern.

### 75 — `4221433454748238079`

- **Converted:** no.
- **Primary observed behavior:** first non-zero scroll occurred at 21.6 s; the
  visit reached and finished at Y 7,107 px. Its only click selected the free
  plan at 49.2 s (`target=490`), followed by no form event and exit 5.7 s
  later.
- **Secondary hypotheses:**
  1. Plan selection changed state but did not pull attention into the first
     field.
  2. The visitor may have completed evaluation without accepting the
     contact-information exchange.
- **Anomaly:** none material; the deep terminal position rules out failure to
  reach pricing, but does not reveal intent.

### 76 — `4221434201983156608`

- **Converted:** yes.
- **Primary observed behavior:** first scrolling began at 12.9 s; 46 scroll
  events reached Y 7,249 px. The visit selected the free plan at 42.8 s
  (`target=490`), initiated the first field 2.7 s later, completed name,
  phone, and e-mail, and submitted at 49.8 s. `Registration Completed` was
  recorded at 50 s.
- **Secondary hypotheses:**
  1. No validation retry or pause is visible once the form sequence starts.
  2. The immediate continuation after plan selection is the key observed
     difference from failed paths in this shard.
- **Anomaly:** none material; four direction reversals and activity grade 3
  are typical of converted visits.

### 77 — `4221435094745743486`

- **Converted:** no.
- **Primary observed behavior:** after first scrolling at 12.5 s, the visit
  traversed to Y 7,242 px, clicked the free plan once at 42.2 s
  (`target=491`), and exited 5.2 s later at the same depth without touching a
  field or submitting.
- **Secondary hypotheses:**
  1. The plan-to-form transition did not establish an obvious next action.
  2. Selection may represent interest or comparison without willingness to
     register.
- **Anomaly:** none material; alternate target `491` is the known pricing-node
  variant and does not show a semantic difference.

### 78 — `4221436929531183154`

- **Converted:** no.
- **Primary observed behavior:** first non-zero scroll occurred at 12.5 s; 53
  scroll events reached and finished at Y 7,238 px. The only click selected
  the free plan at 43.3 s (`target=490`); no form event followed before exit
  5.7 s later.
- **Secondary hypotheses:**
  1. The selected-plan state failed to convert deep-page attention into form
     initiation.
  2. Contact-entry cost may have outweighed the perceived registration value.
- **Anomaly:** none material; activity grade 2, four reversals, and the
  post-selection exit are structurally typical.

### 79 — `4221438328079385073`

- **Converted:** yes.
- **Primary observed behavior:** after first scrolling at 13.8 s, the visit
  reached Y 7,200 px and selected the free plan at 46.4 s (`target=490`).
  It began the first field 2.6 s later, filled all three fields, and submitted
  at 53.5 s. All registration goals, including completion, are present.
- **Secondary hypotheses:**
  1. The compact, uninterrupted field sequence shows no observable form-level
     blocker after initiation.
  2. The 2.6 s transition from plan to field is consistent with a clear enough
     next step for this successful path.
- **Anomaly:** none material; five clicks, one submit, activity grade 3, and
  four direction reversals fit the converted profile.

### 80 — `4221438661032673694`

- **Converted:** yes.
- **Primary observed behavior:** first non-zero scroll occurred at 19.7 s; 55
  scroll events reached Y 7,107 px. The visit selected the free plan at
  56.1 s (`target=490`), entered the first field 2.9 s later, completed the
  remaining fields, and submitted at 63.5 s. `Registration Completed` was
  recorded at 64 s.
- **Secondary hypotheses:**
  1. Once field interaction began, there was no observable validation failure
     or retry.
  2. The plan-to-field handoff succeeded despite this being the longest visit
     in the shard.
- **Anomaly:** duration 65 s and 117 mousemove events are the shard maxima, but
  the visit still follows the normal converted sequence.

## Shard-level signal

- Outcome: **6 converted / 10 visits**.
- All 10 reached the lower page and selected the free plan.
- Every converted visit moved from plan selection to the first field within
  2.6–3.1 s and completed all fields and submit without retry.
- All four non-converted visits made exactly one plan click, produced no field
  or submit event, and ended 5.2–5.7 s after selection.
- The evidence localizes the observed split to
  `Pricing Plan Selected → Registration Form Opened`. It provides no evidence
  that scroll depth, field validation, or submission is the limiting stage.
  It cannot distinguish among weak affordance, insufficient motivation,
  simulator policy, or another unobserved cause.
