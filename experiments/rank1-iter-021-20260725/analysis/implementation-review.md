# C21 implementation review

## Runtime verdict

- Exact direct control: C7 `d416b9e016ea8f2f7c30233cc60001c1a1132653`.
- Single treatment: one non-interactive `pricing-fit-rule` sentence before the unchanged pricing grid.
- After removing that sentence and normalizing the two version markers, `index.php` is byte-identical to C7.
- `css/style.css`, `js/main.js`, `js/analytics.js`, `js/registration.js`,
  `api/visit.php`, `api/submit.php`, and `sql/schema.sql` are byte-identical to C7.
- The analytics contract differs only by `experimentId`; the bundle differs only
  by the same embedded ID and normalizes byte-for-byte to C7. Bundle SHA-256:
  `6e137a1354a773c1da906c7c0b362058d34a664576ca8f1fc863d7c84dfd24f8`.
- All three unchanged pricing CTAs (`basic`, `advanced`, `corporate`), the form,
  protected fields/classes, visit script, API behavior, analytics mappings, and
  success semantics remain intact.
- The added sentence only restates facts already present in the three C7 cards.
- Tests: `22/22` passed.

## Documentation recheck

`STUDENTS.md` now differs from C7 only by deletion of the explicitly obsolete
`Скрытое поле bot_session_id` restriction. Runtime handling was not changed.
`constraints-check.md` correctly separates this requested documentation cleanup
from the isolated runtime mechanism.

The post-fix test run remains `22/22` passed, and the runtime diff has not
expanded.

PASS — blockers: none.
