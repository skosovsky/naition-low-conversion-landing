# C22 implementation review

- Base: exact C7 `d416b9e016ea8f2f7c30233cc60001c1a1132653`.
- Single mechanism: one contiguous CSS counter treatment for the six existing
  `.program-module` cards. Removing that exact block restores C7 CSS
  byte-for-byte; `counter-reset`, `counter-increment`, and generated counter
  content each occur once.
- Program HTML is byte-identical to C7 (SHA-256
  `d3f8c99d26a14938572e7a41334f85765132148805ecbdd0b096c2082ba52841`).
- After normalizing the two C22 markers, `index.php` is byte-identical to C7.
  The analytics contract and bundle likewise normalize byte-for-byte to C7;
  bundle SHA-256 is
  `df0a0f5df63af649a16879849b3a50532f53b7f8287b3df5e575293c9473346c`.
- Authored `main.js`, analytics, registration, PHP API, database code, and SQL
  schema are byte-identical to C7.
- All three CTA plan IDs, the registration form, protected fields/classes, and
  visit script remain intact.
- C21 `pricing-fit-rule` copy is absent.
- `STUDENTS.md` differs only by the explicitly authorized obsolete
  `bot_session_id` restriction removal.
- Tests: `22/22` passed.

PASS — blockers: none.
