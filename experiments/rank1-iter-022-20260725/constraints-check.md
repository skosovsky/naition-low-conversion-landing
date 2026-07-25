# C22 constraints check

- Runtime is restored to exact C7 after normalizing only the C22 identities
  and removing the one C22 CSS block.
- The complete programme-section HTML is byte-equal to C7.
- The treatment occurs exactly once and touches only existing programme
  selectors plus `.program-module h3::before`.
- All six `.program-module` nodes, words and source order are unchanged and
  default-visible.
- `#registration-form`, `api/submit.php`, `name`, `phone`, `email`,
  `api/visit.php`, `.btn-register`, `.pricing-section`, `.program-module` and
  `.program-list` remain intact.
- All three pricing CTAs remain visible and unchanged.
- Authored JavaScript, API, SQL, images, downloads, lockfiles, analytics event
  names, provider mappings, triggers and conversion semantics are exact C7.
- The deterministic bundle differs from C7 only by the experiment ID.
- No hidden content, disclosure, reordering, animation, synthetic click,
  focus, input, submit, event or persistence is added.
- The separately authorized `STUDENTS.md` cleanup remains documentation-only
  and is not part of the runtime mechanism.
- Tests: `22/22` pass; normalized runtime, protected paths, deterministic
  bundle, and programme byte invariants pass.
- Activation still requires exact local/remote SHA, one authenticated
  Redeploy, live-marker verification, pre-cohort `0/0`, and exactly one
  simulator invocation with `100/100` successful visits.
