# C22 structural reserve — hero-to-detail topic-order continuity

```text
analysisMode          = local file-only
networkBrowserMcpUi   = not used
sourceMutation        = none
mechanismId           = hero-to-detail-topic-order-continuity
candidateExperimentId = rank1-hero-detail-topic-order-c22-20260725
candidateSiteVersion  = hero-detail-topic-order-v1-c22-20260725
directControl         = C7 / d416b9e016ea8f2f7c30233cc60001c1a1132653
directControlOutcome  = 30/101 = 29.7030%, rank 2
C21TerminalInput      = 27/101 = 26.7327%, rank 2, rejected
hardPass              = >=41/101 and leaderboard rank 1
verdict                = ELIGIBLE_WEAK_RESERVE
```

## Candidate

Restore exact C7 and change only the source order of the six existing
`.injury-card` articles inside the existing `Виды травм и состояний` section.
The reordered grid continues the topic order already established by the C7
hero and programme:

```text
Остановка дыхания
→ Кровотечения
→ Обмороки и шок
→ Переломы и вывихи
→ Ожоги
→ Травмы головы и позвоночника
```

Every article remains byte-identical, default-visible and inside the same
`.injury-grid`. All copy facts, section order, dimensions, CTA controls,
protected form, authored JavaScript, API, SQL, analytics mappings and
conversion semantics remain exact C7.

This is not a clinical-priority claim. It is one structural continuity test:
the later detail grid begins with the same two actions most prominent in the
hero — breathing/CPR and dangerous bleeding — instead of changing topic order
at that section boundary.

## Local evidence and capacity

The frozen C20 individual-visit proxy set contains:

```text
88 normalized records
81 records with page + DOM at 1280×720
7 zero-event records without page/DOM
20 attempted form paths
61 usable not-attempted paths
```

`attempted` is a normalized browser-path label, not per-visit proof of
persistence. Server and leaderboard remain authoritative.

The injury section has activity in `80/81` usable paths:

| Local path group | N | Median injury-section dwell |
|---|---:|---:|
| attempted | 20 | 11,634 ms |
| not attempted | 60 | 15,600 ms |

The treatment therefore has near-population exposure before the final
pricing/form branch. The approximately four-second median dwell difference is
associational and may be harness timing; it does not prove topic-order
friction.

Required hard-go lift from C7:

```text
41 - 30 = 11 additional persisted orders
11 / 71 C7 non-orders = 15.49% required rescue
```

Exposure capacity is at least 60 observed usable not-attempted paths, so the
mechanism physically reaches enough visitors. Evidence-supported causal
capacity is zero: no visit states that order caused abandonment, and the known
loss remains after Basic activation. Planning band is `-3…+3` orders versus
C7, or roughly `27–33/101`. There is no defensible `+11` forecast.

C22 is an honest, bounded structural shot, but it should lose to any
truthful provenance-backed product or eligibility mechanism.

## Why it is not a closed family

- **C6:** changed registration transaction topology and salience. C22 does not
  touch registration.
- **C10:** removed/hid default-visible supporting information. C22 retains all
  six articles and normal page density.
- **C14:** changed real-click-to-field focus handoff. C22 changes no behavior.
- **C16:** initialized a default Basic choice. C22 remains exact C7 unselected.
- **C20:** hid two paid-plan CTAs. C22 restores all three exact C7 CTAs.
- **C21:** added one explicit pre-pricing plan-fit sentence. C22 removes that
  sentence during control restoration and adds no copy.

Other closed boundaries also remain intact:

- no offer, price, commitment, value, credibility, logistics or
  application-state copy change;
- no reciprocal asset, question, progress state, image move, calendar action,
  ARIA relationship or pricing comparison geometry;
- no section move, CSS prominence, disclosure, default, hidden content,
  synthetic focus, prefill or alternate conversion path.

The novelty boundary is exactly one DOM reorder inside one unprotected,
non-interactive content grid. Reordering another grid, rewriting headings,
adding numbers/icons or changing visual prominence would be another mechanism
and invalidates this specification.

## Exact minimal diff

### Control restoration

Start from exact C7, not C21. Remove the C21-only paragraph:

```html
<p class="section-lead pricing-fit-rule">
    Для личного участия выбирайте бесплатный полный курс; курс с набором —
    если нужны перевязочные материалы домой; корпоративный формат — для команды.
</p>
```

That deletion is restoration of the direct control and is not C22 treatment.
After removing C21 identity/test artifacts, runtime must hash to C7 before the
C22 reorder is applied.

### Identity

Change only:

```text
index.php:
  naition-site-version = hero-detail-topic-order-v1-c22-20260725
  naition-experiment-id = rank1-hero-detail-topic-order-c22-20260725

contracts/analytics-events.json:
  experimentId = rank1-hero-detail-topic-order-c22-20260725
```

### Runtime treatment

In exact C7 `index.php`, move the existing complete `.injury-card` article
blocks into this order without editing their bytes:

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

Do not use CSS `order`; DOM, visual and accessibility order must agree.
`css/style.css` must be byte-exact C7.

### Changed-file allowlist

```text
index.php
contracts/analytics-events.json
tests/site-contract.test.mjs
tests/analytics-contract.test.mjs
js/main.bundle.js
```

The bundle changes only because the analytics experiment ID is embedded.
After normalizing that ID, it must be byte-equivalent to the C7 bundle.

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

## AAA contract tests

### 1. Article multiset preservation

- **Arrange:** extract all complete C7 and C22 `.injury-card` fragments.
- **Act:** hash each fragment and sort the hashes.
- **Assert:** both sorted lists contain the same six unique hashes.

### 2. Isolated ordering delta

- **Arrange:** exact C7 and candidate injury sections.
- **Act:** replace each six-article sequence with one stable placeholder.
- **Assert:** the remaining section wrappers are byte-identical and C22 heading
  order equals the six-item contract above.

### 3. Copy and visibility preservation

- **Arrange:** candidate HTML and exact C7 CSS.
- **Act:** enumerate text nodes and computed visibility for the injury grid.
- **Assert:** the text-node multiset is unchanged; each card appears once and
  is default-visible; no disclosure or interaction is required.

### 4. CSS and runtime isolation

- **Arrange:** C7 and candidate CSS, authored JS, API and SQL.
- **Act:** hash every file/tree.
- **Assert:** all hashes are equal; there is no `order`, hidden state,
  positioning, animation or event change.

### 5. Protected path

- **Arrange:** three pricing buttons, `#registration-form`, protected fields
  and success path.
- **Act:** compare exact fragments and run the normal real Basic-click,
  voluntary-input and submit test.
- **Assert:** all three CTAs remain visible and unchanged; the form/action/
  fields are exact; one backend-persisted success remains the only
  authoritative conversion.

### 6. Identity-only analytics delta

- **Arrange:** C7 and C22 analytics contracts and bundles.
- **Act:** remove/normalize `experimentId`.
- **Assert:** contracts are deep-equal and bundles are byte-equivalent.

### 7. Responsive layout

- **Arrange:** local network-blocked render at `1280×720` and `390×844`.
- **Act:** read heading sequence, card bounding boxes, visibility and document
  width.
- **Assert:** DOM and visual order agree; six cards render once without overlap
  or horizontal overflow; no protected section changes.

### 8. Zero manufactured behavior

- **Arrange:** spies around analytics, focus, scroll, form, network and
  persistence boundaries.
- **Act:** load and scroll through the reordered grid.
- **Assert:** only inherited `landing_viewed` may run; zero synthetic
  selection, focus, input, submit, request, completion or order.

All added tests must follow Arrange–Act–Assert.

## Activation

Activate only if:

1. C21 is terminally reconciled at `27/101`, rank 2, and rejected;
2. exact C7 restoration is proven before treatment;
3. the normalized diff is limited to identities plus one article reorder;
4. all AAA tests, build, syntax, deterministic-bundle and responsive-layout
   checks pass;
5. one independent file-only review returns PASS.

Then use the normal mutation controller:

```text
one unsigned commit
→ push and remote-SHA verification
→ exactly one confirmed Redeploy
→ exact live marker/hash verification
→ pre-cohort server 0/0
→ exactly one 100-success simulator invocation
→ server/leaderboard reconciliation
```

Pass only at `>=41/101` and leaderboard rank 1. A form-start change without
persisted-order lift is diagnostic-only.

## Rollback and disqualifiers

Rollback to exact C7 immediately after any valid miss:

| Outcome | Decision |
|---|---|
| `>=41/101`, rank 1, reconciled | Pass; stop mutations and perform final multi-source reconciliation. |
| `31–40/101` or not rank 1 | Reject; close the complete topic-order continuity family. |
| exactly `30/101` | `no_effect`; close with `nextAction=rotate_hypothesis`. |
| `<30/101` | Regression; close and restore exact C7. |
| marker/SHA/cohort mismatch or unreconciled outcome | Invalid/inconclusive; never promote. |

Pre-commit `HARD_NO_GO` if any condition holds:

- C21 is not terminally reconciled;
- exact C7 restoration cannot be proven;
- any injury-card bytes or membership change;
- any CSS differs from C7;
- any section moves, disappears or becomes conditionally visible;
- C21 fit-rule copy or C20 CTA hiding survives;
- any CTA, form, authored JS, API, SQL, analytics mapping or conversion
  semantics differ from C7;
- DOM and visual/accessibility order diverge;
- normalized bundle has a delta beyond `experimentId`;
- build, tests, syntax, deterministic build or layout smoke fails;
- implementation exceeds seven minutes.

Do not retry with CSS `order`, swapped pairs, another grid, added labels,
stronger visual hierarchy or a section reorder without new causal evidence and
an explicit override reason.
