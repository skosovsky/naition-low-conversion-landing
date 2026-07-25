# C22 file-only high-impact review — HARD_NO_GO

```text
analysisMode             = complete local C1-C21 artifacts only
networkBrowserMcpGit     = not used
sourceOrSiteMutation     = none
bestDirectControl        = C7 / d416b9e016ea8f2f7c30233cc60001c1a1132653
bestOutcome              = 30/101 = 29.7030%, rank 2
C21Outcome               = 27/101 = 26.7327%, rank 2
hardPass                 = >=41/101 and leaderboard rank 1
requiredGainVsC7         = +11 orders
qualifiedC22Candidate    = none
highCapacityVerdict      = HARD_NO_GO
leastBadExploratory      = hero-to-detail-topic-order-continuity
```

## Decision

There is no honest, unclosed, truth-safe landing mechanism in the local
C1-C21 fact set with credible capacity to move the best control from `30/101`
to at least `41/101`.

C21 tested the last speculative pricing-semantic candidate,
`explicit-personal-plan-fit-rule`, and finished at `27/101`, rank 2. That valid
miss closes the fit-rule/taxonomy-placement family. It cannot be repeated as a
shorter recommendation, another “personal participation” sentence, a badge,
stronger Basic prominence or a plan-choice explainer.

The hard target requires rescuing:

```text
41 - 30 = 11 additional persisted orders
11 / 71 C7 non-orders = 15.4930% of the remaining population
```

The complete local ledger supplies no unclosed barrier of that size:

- observed form paths remain binary: visitors either stop after Basic or
  complete every field, submit and reach the unchanged persisted-success path;
- C6/C11/C14 closed transaction-surface, progress and focus-handoff changes;
- C1/C2/C3/C19 closed reassurance, price, reciprocal value and
  application-state copy;
- C4/C7/C8/C9/C12 closed audience/outcome, learnability, delivery-density,
  self-diagnosis and visual-primacy families;
- C10 closed subtractive density/disclosure;
- C13/C15 closed calendar and fixed-session adjacency;
- C16-C18/C20/C21 closed default choice, native plan semantics, comparison
  geometry, competing actions and explicit plan-fit guidance.

The only remaining product-level mechanism with a plausible eleven-order
ceiling is `date-flexible-open-enrollment`, because it would change real
eligibility instead of presentation. It is blocked: the files do not prove
that later-group applications will be retained, contacted, fulfilled as the
same free full course and kept in Moscow. Publishing any of those claims,
removing the fixed date or implying a waitlist would invent an operational
commitment. Database contact persistence is not proof of future fulfillment.

Therefore C22 has no qualified high-impact patch, deploy activation or
simulator authorization.

## Least-bad exploratory option — not a high-impact recommendation

```text
mechanismId           = hero-to-detail-topic-order-continuity
candidateExperimentId = rank1-hero-detail-topic-order-c22-20260725
candidateSiteVersion  = hero-detail-topic-order-v1-c22-20260725
classification        = causally new, truth-safe, low-capacity exploratory test
directControl         = exact C7
pointPrediction       = 30/101, rank 2
planningRange         = 27-33/101
hardPassTail          = unsupported by current evidence
```

### Mechanism

The C7 hero foregrounds breathing/CPR and dangerous bleeding. The later
six-card injury grid starts with a different sequence. Resume the already
established topic order inside that one grid so the full-page scan requires
less semantic re-orientation:

```text
Остановка дыхания
→ Кровотечения
→ Обмороки и шок
→ Переломы и вывихи
→ Ожоги
→ Травмы головы и позвоночника
```

This changes information sequence only. It makes no clinical-priority claim,
adds no fact or persuasion, and creates no new action. All six existing
articles remain visible, byte-identical and inside the same `.injury-grid`.

The mechanism is genuinely unclosed after C1-C21: no prior candidate reordered
one existing content grid while preserving its complete content. It is also
truth-safe because it changes no wording. It is not high-capacity. C20 local
player artifacts show that `80/81` usable paths traverse the injury section
and that not-attempted paths spend longer there at the median
(`15,600 ms` versus `11,634 ms` for attempted paths), but recorder dwell is
not gaze, confusion or causal evidence. Nearly all usable paths still reach
and click Basic. Wide exposure provides an arithmetic ceiling, not a credible
`+11` effect.

### Exact patch surface

Start from exact C7 commit
`d416b9e016ea8f2f7c30233cc60001c1a1132653`, not C21.

In `index.php`:

1. change only the site and experiment identity markers to the C22 values
   above;
2. inside the existing `Виды травм и состояний` section, move the six complete
   `.injury-card` article blocks into the exact order above;
3. preserve every complete article fragment byte-for-byte, including its
   heading and paragraph;
4. preserve the section wrapper, heading, lead, `.injury-grid` and all other
   page nodes.

In `contracts/analytics-events.json`, change only `experimentId` to:

```text
rank1-hero-detail-topic-order-c22-20260725
```

Rebuild `js/main.bundle.js`; after normalizing the embedded experiment ID, it
must be semantically identical to C7.

Changed-file allowlist:

```text
index.php
contracts/analytics-events.json
tests/site-contract.test.mjs
tests/analytics-contract.test.mjs
js/main.bundle.js
```

Hard denylist:

```text
css/**
api/**
sql/**
images/**
downloads/**
package.json
package-lock.json
js/main.js
js/analytics.js
js/registration.js
contracts/analytics-events.schema.json
```

Do not use CSS `order`; DOM, visual and accessibility order must agree. Do not
combine the reorder with rewritten injury copy, icons, emphasis, section
movement, disclosure, CTA changes, form salience or any C1-C21 treatment.

### Analytics and conversion contract

- Keep the existing event names, triggers, parameters and success mapping
  byte-equivalent to C7 after experiment-ID normalization.
- Page load and passive scroll across the reordered grid must not emit plan,
  form, attempt or completion events.
- Keep all three visible `.btn-register` controls, their plan IDs and the
  existing trusted user-action path unchanged.
- Keep `#registration-form`, `name`, `phone`, `email`, `api/visit.php`,
  `api/submit.php`, SQL and response handling unchanged.
- Only a successful existing backend submission remains a real conversion;
  no reordered-content exposure, scroll, plan click or form focus is promoted
  to conversion.
- Server/leaderboard remain authoritative. Client analytics are diagnostics
  and must not be substituted for persisted orders.

### Predicted range

The planning range is `27-33/101`, centered on exact C7 `30/101`; the likely
rank remains 2. This is the previously established `-3…+3` structural band,
not a confidence interval. Reaching `41/101` requires an outcome eight orders
above the top of that planning range. The candidate is therefore suitable only
if an exploratory cohort is explicitly valued despite an expected hard-gate
miss.

## Activation gate

Default action: **do not activate for the rank-one objective**.

An exploratory activation is valid only if all of the following are true
before commit:

1. the controller explicitly classifies the run as low-capacity exploration,
   not a qualified high-impact C22;
2. exact restoration to C7 is proven before applying the one-grid reorder;
3. the complete runtime diff fits the allowlist and the treatment delta is
   exactly the six-article permutation;
4. every AAA check below passes;
5. the committed SHA, remote SHA, production marker and rebuilt bundle identify
   the same candidate;
6. one Redeploy reaches terminal deployed state;
7. pre-cohort server state is captured, then the simulator is invoked exactly
   once for 100 successful visits.

After a valid cohort:

| Authoritative result | Decision |
|---|---|
| `>=41/101`, rank 1, server/leaderboard reconciled | Pass; stop mutations and run final multi-source reconciliation |
| `31-40/101` or rank not 1 | Reject for the hard goal and close the complete topic-order-continuity family |
| exactly `30/101` | `no_effect`; close with `nextAction=rotate_hypothesis` |
| `<30/101` | Regression; close and restore exact C7 |
| SHA/marker/cohort mismatch or unreconciled outcome | Invalid/inconclusive; never promote |

## Required AAA checks

### 1. Exact article multiset

- **Arrange:** extract the six complete C7 and candidate `.injury-card`
  fragments.
- **Act:** hash each complete article and sort both hash lists.
- **Assert:** both sorted lists are identical, contain exactly six unique
  articles, and no byte of article content changed.

### 2. One isolated permutation

- **Arrange:** extract the exact C7 and candidate injury sections.
- **Act:** replace the six article sequences in each with one stable
  placeholder and separately read candidate heading order.
- **Assert:** normalized section wrappers are byte-identical and the heading
  order equals the six-item C22 contract.

### 3. No hidden CSS treatment

- **Arrange:** exact C7 and candidate CSS plus candidate HTML.
- **Act:** hash CSS and scan the grid/cards for visibility, `order`,
  positioning, disclosure and media-query changes.
- **Assert:** CSS is byte-identical to C7; all six cards are default-visible;
  no hidden, opacity, animation, positioning or CSS-order treatment exists.

### 4. Protected runtime integrity

- **Arrange:** C7 and candidate form, all three plan controls, authored JS,
  API and SQL trees.
- **Act:** hash every protected fragment/file.
- **Assert:** every hash matches C7; all three plan buttons remain visible and
  functional; form fields/action and backend persistence are unchanged.

### 5. Identity-only analytics delta

- **Arrange:** C7 and candidate analytics contracts and deterministic bundles.
- **Act:** normalize `experimentId` in both.
- **Assert:** contracts are deep-equal and bundles are semantically identical.

### 6. Layout and accessibility order

- **Arrange:** network-blocked local renders at `1280×720` and `390×844`.
- **Act:** collect heading sequence, DOM order, bounding boxes, computed
  visibility and document width.
- **Assert:** DOM, visual and accessibility order agree; every card renders
  once; there is no overlap or horizontal overflow.

### 7. Zero manufactured behavior

- **Arrange:** spies around analytics, focus, scroll, form, network and
  persistence boundaries.
- **Act:** load and passively scroll through the reordered section.
- **Assert:** only inherited landing-view behavior may occur; no synthetic
  selection, focus, input, submit, request, completion or order is produced.

## Disqualifiers

Kill the exploratory candidate before commit if:

- exact C7 restoration cannot be proven;
- any C21 plan-fit sentence or other post-C7 treatment survives;
- article text, membership or enclosing section changes;
- DOM and visual/accessibility order diverge;
- any CSS, authored JavaScript, plan, pricing, form, API, SQL, event mapping or
  persisted-success semantic differs from C7;
- the normalized bundle contains a delta beyond experiment identity;
- any test, deterministic build or local layout check fails;
- implementation expands beyond the single grid permutation.

Do not activate the blocked open-enrollment mechanism unless an attributable
owner contract proves all four operational facts:

```text
willRetainLaterGroupApplications = true
willContactApplicantsWhenDateExists = true
laterGroupCourseRemainsSameFreeFullCourse = true
laterGroupCityRemainsMoscow = true
```

Do not retry the exploratory mechanism after a valid miss through card swaps,
CSS order, numbering, icons, emphasis, rewriting, another content-grid reorder
or section movement without genuinely new causal evidence.

## Final

```text
qualifiedHighImpactC22 = none
rankOneAction          = HARD_NO_GO
exploratoryFallback    = hero-to-detail-topic-order-continuity
exploratoryExpected    = 27-33/101, likely rank 2
```
