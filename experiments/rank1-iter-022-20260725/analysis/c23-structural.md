# C23 structural reserve — hero-to-detail topic-order continuity

```text
analysisMode          = local file-only
networkBrowserMcpUi   = not used
sourceMutation        = none
mechanismId           = hero-to-detail-topic-order-continuity
candidateExperimentId = rank1-hero-detail-topic-order-c23-20260725
candidateSiteVersion  = hero-detail-topic-order-v1-c23-20260725
directControl         = C7 / d416b9e016ea8f2f7c30233cc60001c1a1132653
directControlOutcome  = 30/101 = 29.7030%, rank 2
latestTerminal        = C21 / 27/101 = 26.7327%, rank 2
C22Status             = simulator running; no outcome inferred
hardPass              = >=41/101 and leaderboard rank 1
verdict                = CONDITIONAL_ELIGIBLE_WEAK
```

## Decision

If C22 validly misses the hard gate, restore exact C7 and test one DOM-only
information-order mechanism: reorder the six existing `.injury-card` articles
inside the existing `Виды травм и состояний` grid so the later detail section
continues the topic order already established in the C7 hero:

```text
Остановка дыхания
→ Кровотечения
→ Обмороки и шок
→ Переломы и вывихи
→ Ожоги
→ Травмы головы и позвоночника
```

Every complete article remains byte-identical, default-visible and inside the
same `.injury-grid`. No word, fact, card membership, section order, CSS,
image, CTA, form, authored JavaScript, API, SQL, analytics event or conversion
semantic changes.

This does not assert clinical priority. It tests only cross-section
information continuity: the later taxonomy begins with the same breathing/CPR
and bleeding topics that the hero names most prominently.

## Outcome ledger and novelty boundary

| C | Outcome / 101 | Closed causal family |
|---:|---:|---|
| 1 | 22 | commitment/payment reassurance and selected-plan handoff |
| 2 | 22 | free-price economics and stronger `0 ₽` framing |
| 3 | 20 | reciprocal asset/value exchange at the PII gate |
| 4 | 28 | audience-to-outcome copy hierarchy |
| 5 | 26 | evidence-only credibility cleanup |
| 6 | 26 | registration topology and transaction-surface salience |
| 7 | 30 | learnability/fear-to-rehearsal copy; best direct control |
| 8 | 26 | practice-density/value detail |
| 9 | 25 | self-diagnosis/question framing |
| 10 | 15 | content hiding, subtraction and disclosure |
| 11 | 24 | progress/continuation state |
| 12 | 23 | early visual/image primacy |
| 13 | 25 | calendar side commitment |
| 14 | 22 | click-to-field focus handoff |
| 15 | 27 | fixed-session/logistics adjacency |
| 16 | 27 | default/preselected Basic state |
| 17 | 26 | native plan semantics/ARIA relationships |
| 18 | 24 | aligned plan-comparison geometry |
| 19 | 24 | persisted application-state copy |
| 20 | 24 | one visible Basic action / hidden paid CTAs |
| 21 | 27 | explicit pre-grid plan-fit rule |

C22 is a CSS-generated `01…06` sequence on the unchanged programme modules.
C23 does not number, style, relabel or otherwise alter programme content. It
changes source order only in a different, unprotected and non-interactive
injury taxonomy.

C23 is not:

- a copy restatement of C4, C7, C8 or C21;
- hidden/default/selected content from C10, C16 or C20;
- registration geometry from C6;
- pricing geometry from C18;
- synthetic continuation from C11 or C14;
- another programme-salience intensity variant of C22.

The novelty boundary is exactly one source-order permutation of six existing
articles. Section reorder, CSS `order`, numbering, icons, badges, text edits,
prominence changes or another reordered grid are outside this mechanism.

## Local exposure and expected capacity

The frozen C20 individual-visit proxy set contains `88` normalized records:

- `81` have page + DOM at `1280×720`;
- `7` are zero-event records without page/DOM;
- `20` usable paths are labelled `attempted`;
- `61` usable paths are `not_attempted`.

`attempted` is a browser-path label, not individual server-persistence proof.
Server and leaderboard remain authoritative.

The injury section has activity in `80/81` usable paths:

| Local path group | N | Median injury-section dwell |
|---|---:|---:|
| attempted | 20 | 11,634 ms |
| not attempted | 60 | 15,600 ms |

The approximately four-second median difference is association only and may be
harness timing. It proves near-population exposure, not cause.

Hard-go requirement:

```text
41 - 30 = 11 additional persisted orders
11 / 71 C7 non-orders = 15.49% required rescue
```

The treatment reaches at least 60 observed usable not-attempted paths, so it has
arithmetic exposure capacity. Evidence-supported causal capacity is zero: no
visit states that topic sequence caused abandonment, and the stable split is
after Basic activation. Honest planning band is `-3…+3` orders versus C7,
roughly `27–33/101`; there is no credible `+11` forecast.

C23 is therefore a fast, truthful reserve, not a predicted winner. Any
provenance-backed product or eligibility mechanism should outrank it.

## Exact minimal diff

### Control restoration

Start from exact C7, never cumulatively from C22. Remove the complete C22 CSS
counter block:

```css
.program-list {
    counter-reset: course-module;
}

.program-module {
    counter-increment: course-module;
}

.program-module h3 {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
}

.program-module h3::before {
    content: counter(course-module, decimal-leading-zero);
    display: grid;
    min-height: 40px;
    place-items: center;
    border-radius: 12px;
    background: var(--heading);
    color: var(--white);
    font-size: 0.82rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.08em;
}
```

That deletion is direct-control restoration, not C23 treatment. Before
applying C23, normalized runtime must hash to exact C7.

### Identity-only changes

```text
index.php:
  naition-site-version = hero-detail-topic-order-v1-c23-20260725
  naition-experiment-id = rank1-hero-detail-topic-order-c23-20260725

contracts/analytics-events.json:
  experimentId = rank1-hero-detail-topic-order-c23-20260725
```

### One runtime treatment

In exact C7 `index.php`, move the existing complete `.injury-card` blocks into
this source order without editing their bytes:

```html
<article class="injury-card">
    <h3>Остановка дыхания</h3>
    <p>СЛР, работа в паре, использование автоматического дефibrиллятора, действия до приезда скорой.</p>
</article>
<article class="injury-card">
    <h3>Кровотечения</h3>
    <p>Артериальные, венозные и капиллярные кровотечения, давящая повязка, турникет, контроль после остановки крови.</p>
</article>
<article class="injury-card">
    <h3>Обмороки и шок</h3>
    <p>Признаки шока, положение тела, контроль дыхания, согревание, что нельзя давать пострадавшему.</p>
</article>
<article class="injury-card">
    <h3>Переломы и вывихи</h3>
    <p>Признаки перелома, иммобилизация, транспортная шина, ошибки при перемещении пострадавшего.</p>
</article>
<article class="injury-card">
    <h3>Ожоги</h3>
    <p>Термические и химические ожоги, охлаждение, стерильная повязка, когда нельзя снимать одежду с места ожога.</p>
</article>
<article class="injury-card">
    <h3>Травмы головы и позвоночника</h3>
    <p>Подозрение на травму шеи и спины, когда нельзя менять положение, фиксация головы и ожидание медиков.</p>
</article>
```

Do not implement the order through CSS. DOM, visual and accessibility order
must agree. `css/style.css` remains byte-exact C7.

### Changed-file allowlist

```text
index.php
contracts/analytics-events.json
tests/site-contract.test.mjs
tests/analytics-contract.test.mjs
js/main.bundle.js
```

`js/main.bundle.js` changes only because it embeds the analytics experiment ID.
After normalizing that ID, it must be byte-equivalent to C7.

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

## AAA contracts

### 1. Exact article multiset

- **Arrange:** extract all complete C7 and C23 `.injury-card` fragments.
- **Act:** hash every fragment and sort the hashes.
- **Assert:** both sorted lists contain the same six unique hashes.

### 2. Isolated source-order delta

- **Arrange:** exact C7 and candidate injury sections.
- **Act:** replace each six-article sequence with one stable placeholder.
- **Assert:** remaining section wrappers are byte-identical; C23 heading order
  equals the six-item contract above.

### 3. Copy and visibility preservation

- **Arrange:** candidate HTML and exact C7 CSS.
- **Act:** enumerate injury-grid text nodes and computed visibility.
- **Assert:** the text-node multiset is unchanged; every article renders once
  and is default-visible; no disclosure or action is required.

### 4. CSS and programme restoration

- **Arrange:** C7 and candidate CSS plus complete programme HTML.
- **Act:** hash the files/fragments and scan for C22 counter tokens.
- **Assert:** CSS and programme HTML are byte-exact C7; `course-module`,
  `counter-reset`, `counter-increment` and generated programme numbers are
  absent.

### 5. Protected transaction path

- **Arrange:** all three pricing CTAs, `#registration-form`, protected fields,
  authored JS, API and SQL.
- **Act:** hash each fragment/tree and run the existing normal-path tests.
- **Assert:** all hashes equal C7; all three CTAs remain visible; one
  backend-persisted form success is the only authoritative conversion.

### 6. Identity-only analytics delta

- **Arrange:** C7 and C23 analytics contracts and bundles.
- **Act:** remove/normalize `experimentId`.
- **Assert:** contracts are deep-equal and bundles are byte-equivalent.

### 7. Responsive layout

- **Arrange:** local network-blocked renders at `1280×720` and `390×844`.
- **Act:** read heading sequence, bounding boxes, visibility and document width.
- **Assert:** DOM and visual order agree; six articles render exactly once
  without overlap or horizontal overflow; protected section layouts are C7.

### 8. Zero manufactured behavior

- **Arrange:** spies around analytics, focus, scroll, form, network and
  persistence.
- **Act:** load and scroll through the reordered grid.
- **Assert:** only inherited `landing_viewed` may run; no synthetic selection,
  focus, input, submit, request, completion or order occurs.

All added tests use Arrange–Act–Assert.

## Activation and rollback

Activate only after:

1. C22 has one valid terminal miss below `41/101` or is not rank 1;
2. exact C7 restoration is proven before treatment;
3. normalized runtime diff is identities plus one injury-article permutation;
4. AAA tests, build, syntax, deterministic-bundle and responsive-layout checks
   pass;
5. one independent file-only review returns PASS.

Then:

```text
one unsigned commit
→ push and remote-SHA verification
→ exactly one confirmed Redeploy
→ exact live marker/hash verification
→ pre-cohort server 0/0
→ exactly one 100-success simulator invocation
→ server/leaderboard reconciliation
```

Pass only at `>=41/101`, leaderboard rank 1 and server/leaderboard agreement.
Client form-start movement without persisted-order lift is diagnostic-only.

| Terminal outcome | Rollback decision |
|---|---|
| `>=41/101`, rank 1, reconciled | Pass; stop mutations and perform final multi-source reconciliation. |
| `31–40/101` or not rank 1 | Reject; close the topic-order continuity family and restore exact C7. |
| exactly `30/101` | `no_effect`; close with `nextAction=rotate_hypothesis`. |
| `<30/101` | Regression; close and restore exact C7. |
| marker/SHA/cohort mismatch or unreconciled result | Invalid/inconclusive; never promote. |

Pre-commit `HARD_NO_GO` if:

- C22 is not terminally decided;
- exact C7 restoration cannot be proven;
- any injury-card bytes or membership change;
- any CSS differs from C7;
- any section moves, disappears or becomes conditional;
- C22 generated counters or C21 fit-rule copy survive;
- any protected CTA, form, authored JS, API, SQL, analytics mapping or
  conversion semantic differs from C7;
- DOM and visual/accessibility order diverge;
- normalized bundle differs beyond `experimentId`;
- build, tests, syntax, deterministic build or layout smoke fails;
- implementation takes longer than seven minutes.

Do not retry through CSS `order`, swapped pairs, another content grid,
numbering, icons, labels, prominence or section reordering without new causal
evidence and an explicit override reason.
