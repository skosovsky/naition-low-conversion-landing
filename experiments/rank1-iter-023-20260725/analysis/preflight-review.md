# C23 independent pre-deploy review

## Verdict: PASS

Compared the current C23 working tree with the declared exact C7 control
`d416b9e016ea8f2f7c30233cc60001c1a1132653`. The candidate is internally
coherent and contains one runtime treatment: a source-order permutation of
the six existing `.injury-card` articles.

## Evidence

- `STUDENTS.md` permits moving elements inside a section. The protected form,
  visit script, selector classes, `api/**`, and `sql/schema.sql` constraints
  are preserved.
- The runtime diff set against C7 is exactly
  `index.php`, `contracts/analytics-events.json`, and `js/main.bundle.js`.
  `css/style.css`, `js/main.js`, all of `api/**`, and all of `sql/**` are
  byte-identical to C7.
- The six current injury articles have the same per-block SHA-256 multiset as
  C7 and remain complete byte-identical blocks. Their only content change is
  DOM order:
  `Остановка дыхания → Кровотечения → Обмороки и шок → Переломы и вывихи →
  Ожоги → Травмы головы и позвоночника`.
- After normalizing the two candidate meta markers and replacing the
  `.injury-grid` contents with a sentinel, current `index.php` is byte-identical
  to C7. Therefore no copy, section, interaction, form, CTA, or conversion
  behavior changed.
- No C22 programme-counter implementation remains: no `counter-reset`,
  `counter-increment`, `decimal-leading-zero`, or
  `structured-program-evidence-salience` marker exists in runtime sources.
- `js/main.bundle.js` is byte-identical to the deterministic C7 bundle after
  replacing only the C7 experiment id with
  `rank1-hero-detail-topic-order-c23-20260725` (bundle diff: one line removed,
  one line added).
- Identity values agree across `preflight.json`, `manifest.draft.json`,
  `index.php`, `contracts/analytics-events.json`, and the bundle:
  site version `hero-detail-topic-order-v1-c23-20260725`, experiment id
  `rank1-hero-detail-topic-order-c23-20260725`, mechanism id
  `hero-to-detail-topic-order-continuity`.
- The treatment introduces no new product claim, hidden content, metric
  manipulation, synthetic interaction, or simulator-contract change.
- `npm test` passes `22/22` tests with zero failures. The new injury-order test
  uses explicit Arrange–Act–Assert sections and verifies both exact ordered
  copy and six unique headings.

The documented low expected capacity (`27–33/101`, not a credible `+11`
forecast) is an honest product-risk warning, not a pre-deploy validity
failure.
