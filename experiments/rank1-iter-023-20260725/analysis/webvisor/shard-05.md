# C23 Webvisor shard 05 — visits 41–50

## Evidence boundary

- Read-only sources: immutable `raw/yandex/visits/*.json`, lexicographic
  positions 41–50, plus the frozen phase-1 converted/non-converted profiles.
- Coverage: 10 unique visit files; 9 complete three-endpoint bundles and one
  partial bundle (`fetchHit` HTTP 400).
- Outcome labels come from Yandex goal reaches. `Registration Completed` is
  treated as confirmed only when present; a tariff click alone is not a
  conversion.
- Shard outcome: **2 converted, 8 non-converted**. Both converted visits have
  the full goal chain; seven observable non-converted recordings stop after
  one tariff click. The eighth non-converted visit has goals but no event
  stream.

## Per-visit evidence

1. **4221386595722068123 — non-converted, complete.** Duration 38 s,
   activity 2. First non-zero scroll at 12.488 s; 51 scroll events, max/final
   Y 7229. One click at 32.964 s on target 490; `Pricing Plan Selected` at
   33 s; no form-open/attempt/completion goal; 5.036 s remain after the click.
   **Anomaly:** unusually short versus the phase-1 non-converted median
   (48 s), but the deep-scroll/single-click exit is the dominant failure
   pattern rather than a new bottleneck.

2. **4221391193877774527 — converted, complete.** Duration 43 s,
   activity 3. First non-zero scroll at 11.147 s; 49 scroll events, max/final
   Y 7219. Five clicks at 35.173/37.774/38.924/39.851/41.535 s on
   `491→580→585→590→593`. Goals: plan 35 s, form open 38 s, attempt and
   completion 42 s; visit ends 1.465 s after submit click.
   **Anomaly:** none decision-relevant; it is the faster edge of the normal
   converted sequence.

3. **4221392525409649098 — non-converted, partial.** Duration 50 s,
   activity 2. Goals show landing at 0 s and plan selection at 44 s, with no
   form-open/attempt/completion. `getVisitInfo` and
   `getCalculatedVisitInfo` succeeded, while `fetchHit` returned HTTP 400, so
   scrolls and clicks are unavailable.
   **Anomaly:** sole incomplete recording in the frozen cohort. Do not infer
   interaction path, depth, click count, or post-selection dwell from it.

4. **4221393882353238123 — non-converted, complete.** Duration 52 s,
   activity 2. First non-zero scroll at 20.522 s; 53 scroll events, max/final
   Y 7107. One click at 46.729 s on target 490; plan goal at 47 s; no form
   goals; 5.271 s remain.
   **Anomaly:** none; the later initial dwell still ends in the canonical
   selected-plan-without-form path.

5. **4221395042459713762 — converted, complete.** Duration 46 s,
   activity 3. First non-zero scroll at 12.285 s; 54 scroll events, max/final
   Y 7269. Five clicks at 38.094/40.548/41.898/42.956/44.758 s on
   `491→580→585→590→593`. Goals: plan 38 s, form open 40 s, attempt and
   completion 44 s; visit ends 1.242 s after submit click.
   **Anomaly:** none; full uninterrupted converted sequence.

6. **4221396545968537766 — non-converted, complete.** Duration 48 s,
   activity 2. First non-zero scroll at 16.192 s; 46 scroll events; max Y
   7107 and final Y 6970. One click at 42.485 s on target 490; plan goal at
   43 s; no form goals; 5.515 s remain.
   **Anomaly:** final position is 137 px above the maximum, a small
   post-selection reverse scroll; it does not produce another click or form
   interaction.

7. **4221396839418560619 — non-converted, complete.** Duration 48 s,
   activity 2. First non-zero scroll at 15.858 s; 57 scroll events, max/final
   Y 7240. One click at 42.833 s on target 490; plan goal at 43 s; no form
   goals; 5.167 s remain.
   **Anomaly:** `Landing Viewed` is stamped at 1 s rather than 0 s. This is a
   minor telemetry offset and does not alter the funnel classification.

8. **4221396937703686521 — non-converted, complete.** Duration 45 s,
   activity 2. First non-zero scroll at 18.238 s; 55 scroll events; max Y
   7179 and final Y 7028. One click at 39.396 s on target 490; plan goal at
   39 s; no form goals; 5.604 s remain.
   **Anomaly:** final position is 151 px above maximum; as in visit 46, the
   small reverse scroll is not followed by a second action.

9. **4221396959952372057 — non-converted, complete.** Duration 55 s,
   activity 2. First non-zero scroll at 19.303 s; 57 scroll events, max/final
   Y 7326. One click at 48.998 s on target 490; plan goal at 49 s; no form
   goals; 6.002 s remain.
   **Anomaly:** none decision-relevant; its post-click dwell is near the upper
   quartile of the dominant non-converted profile but still ends without form
   initiation.

10. **4221398298920747080 — non-converted, complete.** Duration 49 s,
    activity 2. First non-zero scroll at 16.997 s; 55 scroll events,
    max/final Y 7389. One click at 44.373 s on target 491; plan goal at 45 s;
    no form goals; 4.627 s remain.
    **Anomaly:** target 491 is the alternate observed DOM-node variant and the
    recorded Y slightly exceeds the nominal viewport-adjusted document
    boundary. Neither fact proves a semantic or usability difference.

## Shard conclusion

- The seven complete failures all reach the bottom region, select a plan once,
  and terminate 4.6–6.0 s later without opening the form.
- The two successes diverge only after plan selection: they open the form
  within roughly 2–3 s and then complete it without abandonment.
- This shard reinforces the phase-1 bottleneck at
  `Pricing Plan Selected → Registration Form Opened`. It provides no evidence
  for a content-reach, scroll-depth, or in-form error mechanism.
- The partial visit is compatible with the same goal-level split but is
  excluded from event-level claims.
