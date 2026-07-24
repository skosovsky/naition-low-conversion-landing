# C21 constraints check

- Exact runtime base is C7 `d416b9e016ea8f2f7c30233cc60001c1a1132653`.
- Only one pricing sentence and identity/test/build artifacts change.
- `#registration-form`, `api/submit.php`, `name`, `phone`, `email`,
  `api/visit.php`, `.btn-register`, `.pricing-section`, `.program-module` and
  `.program-list` remain intact.
- The obsolete student restriction for the nonexistent `bot_session_id` field
  is removed as explicitly requested; this documentation cleanup is not part
  of the runtime mechanism.
- All three pricing buttons remain visible and unchanged.
- No authored JavaScript, API, SQL, CSS, image or analytics-event mapping
  changes.
- The new sentence contains only facts already visible in the three C7 cards.
- No synthetic click, focus, input, submit, event or persistence is added.
- Success requires one proven Redeploy of the exact pushed commit followed by
  exactly 100 successful simulator visits and authoritative `>=41/101`,
  leaderboard rank 1.
