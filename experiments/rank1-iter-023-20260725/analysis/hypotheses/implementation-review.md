# C24 implementation review — causally new mechanisms only

## Verdict

There is **no ungated, presentation-only mechanism left that is both causally
new and credibly capable of adding the 13 persisted orders needed to move C23
from 28/101 to at least 41/101**.

C23 local evidence is unusually clear:

- Yandex: 99 selected a plan, 27 opened the form, 27 completed;
- Amplitude: 101 landed, 28 opened, 28 submitted, 28 completed;
- 71/72 complete non-converted recordings reached the bottom area and selected
  the free plan once;
- converted and non-converted paths have nearly identical scroll/timing
  profiles before selection.

The tempting implementation response—stronger plan-to-form handoff—is not
causally new. C6, C14, C16–C20 already close form topology/salience, focus
handoff, default selection, semantic relationships, comparison geometry,
state explanation, and CTA reduction. The current implementation also already:

- sends every `.btn-register` activation to `#registration`
  (`js/main.js:49–79`);
- exposes one real form before supporting content (`index.php:329–357`);
- updates selected-plan state and copy (`js/main.js:64–76`);
- presents the Basic CTA at full card width (`css/style.css:420–428`).

Therefore another auto-focus, inline/moved form, selected-state treatment,
single-CTA layout, or “clearer next step” relabel would repeat a closed family,
even though it matches the observed bottleneck.

The only technically feasible causally new candidates require a product-truth
artifact before implementation. They are listed below in priority order. Each
is a separate experiment; they must not be bundled.

## Protected implementation contract

Every candidate below must preserve:

- exactly one `#registration-form`;
- `action="api/submit.php"` and `method="post"`;
- required fields `name`, `phone`, `email`;
- `<script src="api/visit.php" defer></script>`;
- `.btn-register`, `.pricing-section`, `.program-module`, `.program-list`;
- replay masks `ym-disable-keys`, `data-amp-mask`, and dynamic
  `ym-hide-content`;
- `registration_completed` only after successful HTTP plus `data.ok=true`;
- existing event names/provider mappings and real user-triggered semantics;
- no `.focus()`, `autofocus`, synthetic events, programmatic submit, hidden
  persuasion, or simulator-specific branching.

For any candidate, only experiment/version markers should change in
`index.php:6–7` and `contracts/analytics-events.json`; `js/main.bundle.js`
must be rebuilt from `js/main.js`, never hand-edited.

## Candidate A — date-flexible open enrollment

### Truth gate

Required before code: an owner-backed operational commitment that an
application from someone unavailable on 15 August is retained, contacted after
the next Moscow date is assigned, and fulfilled as the same free full course.
Without this, the candidate fabricates eligibility and must not ship.

### Why causally new

This changes the offer's real temporal eligibility. It is not another
restatement of the fixed date, calendar widget, logistics adjacency, or CTA
styling.

### Exact implementation surface

`index.php` only, unless the selected-plan confirmation also names the new
policy:

1. Keep the current 15 August session in the hero badge and date card
   (`index.php:25`, `60–62`) as the primary cohort.
2. Add one owner-approved availability policy immediately after the hero
   `.meta-grid`: a short statement that the same form also records interest in
   the next Moscow cohort when this date is unsuitable.
3. Add the same policy, without new claims, beneath the pricing lead
   (`index.php:283–287`) and reference it from the registration reassurance
   (`index.php:352–354`). These are three presentations of one coherent product
   rule, not three mechanisms.
4. Do **not** add a date field, checkbox, hidden input, query parameter, or new
   backend state. The protected request contract cannot persist such a choice.
   The operational policy must apply to every submitted application.
5. If the confirmation string must stop promising only 15 August, change the
   two text branches at `js/main.js:71–75`; keep the click handler and analytics
   calls byte-for-byte equivalent otherwise.
6. Add at most one semantic CSS class (for example
   `.next-cohort-policy`) near the existing hero/meta styles. No fixed/sticky
   surface and no new interaction.

### Risks

- **Critical truth risk:** operations may not actually retain and fulfill
  later-cohort applications.
- **Measurement risk:** the server schema cannot distinguish fixed-date from
  next-cohort intent; the outcome remains a persisted application, not a
  confirmed date.
- **Copy-consistency risk:** `15 августа` currently appears in hero, pricing
  selection text, and registration support. Partial updates would create a
  contradiction.
- **Capacity uncertainty:** prior planning range was 32–43/101; only its upper
  part clears the hard gate.

### Test scope

- Existing `npm test` and `npm run build`.
- Extend `site-contract.test.mjs` with an exact, owner-approved policy fixture
  appearing in the intended three surfaces, while retaining the explicit
  15 August primary session.
- Assert no new form controls/names and exactly one form action.
- Assert no `.focus()`, `autofocus`, `dispatchEvent`, `requestSubmit`, or
  `.submit()`.
- Analytics contract tests unchanged except exact experiment marker.
- Locally verify both Basic and paid plan selection messages remain truthful,
  scroll to the real form, and emit one `pricing_plan_selected`.

## Candidate B — attributable, offer-bound provider proof

### Truth gate

Required before code: publishable organizer/instructor/venue/participant
evidence tied to this exact course, with permission and a verification route.
At minimum the artifact must define the claim, named source, URL or local
document, applicability to this offer, and expiry/review owner.

### Why causally new

This adds verifiable external evidence to the offer. It is not the already
closed generic credibility copy family.

### Exact implementation surface

1. Add one `<aside class="offer-proof" aria-labelledby="offer-proof-title">`
   directly before the pricing section (`index.php` before line 281), so it is
   encountered before the observed decision point.
2. Include only artifact-backed fields, for example provider identity,
   instructor qualification, confirmed venue, or attributable participant
   evidence. Every claim must include a visible source/verification link or a
   repository-local evidence asset.
3. Do not resurrect the unsupported names, volumes, ERC/RKK claims, or legal
   promises explicitly rejected by `site-contract.test.mjs`.
4. Add `.offer-proof` styling in `css/style.css` using the current container
   and card tokens. No carousel, modal, accordion, hover-only disclosure, or
   interaction.
5. Do not change `js/main.js`, registration behavior, pricing buttons, or
   analytics event semantics.

### Risks

- **Critical provenance risk:** generic logos/testimonials or unattributable
  numbers would be deceptive and merely repeat C5.
- **Privacy/licensing risk:** names, photos, quotes, and marks need explicit
  permission.
- **Offer-binding risk:** evidence about another course/provider/date does not
  support this offer.
- **Layout risk:** a large proof block increases page height; the simulator's
  highly regular scroll path may change, so viewport/page-height evidence must
  be regenerated.

### Test scope

- Existing `npm test` and `npm run build`.
- Add a source-bound proof fixture test: exact claim, source label, valid link,
  and unique DOM occurrence.
- Retain the unsupported-claim blacklist and add an allowlist driven by the
  approved artifact.
- Static accessibility checks for heading association, link purpose, alt text
  if an image is authorized, and keyboard reachability.
- Local network-blocked rendering at 1280×720 plus mobile breakpoint; confirm
  the proof precedes pricing and does not cover or move protected controls into
  an unusable state.

## Candidate C — enforceable enrollment/fulfillment policy

### Truth gate

Required before code: an operational owner and an enforceable policy for
response time plus at least one material uncertainty such as cancellation,
transfer, rescheduling, cutoff, or what constitutes confirmed participation.
Exact wording and escalation route must be approved.

### Why causally new

This changes the real service contract after application. It is not the closed
“contacts only / we will confirm” explanation from C19 unless it introduces an
actual enforceable commitment.

### Exact implementation surface

1. Add `<aside class="enrollment-policy"
   id="enrollment-policy">` inside `.registration-action`, between
   `#registration-selection` and `#registration-form`
   (`index.php:335–338`).
2. State only concrete owner-backed commitments, preferably as 2–3 short
   definition-list rows: response deadline, confirmation state, and the
   approved cancellation/rescheduling rule.
3. Append `enrollment-policy` to the form's `aria-describedby` while retaining
   `registration-reassurance`.
4. Add non-interactive `.enrollment-policy` styles adjacent to
   `.registration-selection` (`css/style.css:474–496`).
5. Do not add countdowns, fake scarcity, checkboxes, new fields, or backend
   semantics. Do not change `js/main.js` unless the existing success copy at
   line 129 contradicts the approved SLA; if changed, preserve masking and
   success-only placement.

### Risks

- **Critical fulfillment risk:** missing the stated SLA turns the page into a
  false promise.
- **Family-collision risk:** vague “we will contact you” copy repeats C19;
  causality is new only if the policy is enforceable and materially different.
- **Semantic risk:** “application received” must not be presented as a
  confirmed seat; the backend still stores an application.
- **Density risk:** another block at the form can increase cognitive load even
  though C23 shows no post-open abandonment.

### Test scope

- Existing `npm test` and `npm run build`.
- Add exact policy-text/source test and `aria-describedby` token test.
- Assert one form, unchanged field names/action/method, and unchanged success
  gating.
- Test success/error messages retain `ym-hide-content`.
- Network-blocked desktop/mobile render: policy visible before fields without
  pushing the first field outside a reasonable viewport after plan scroll.

## Candidate D — immediate confirmed-seat transaction

This is causally new and could have high capacity, but it is **not technically
eligible under the current scope**. A real confirmed seat requires inventory,
reservation concurrency, expiry/cancellation rules, an API/schema change, and
an authoritative confirmation response. Those changes touch protected
`api/*.php`, `sql/schema.sql`, and the conversion contract. Copy or client-side
state cannot honestly implement it. Do not simulate confirmation in
`js/main.js`.

## Rejected implementation shortcuts

| Shortcut | Technical reason for rejection | Mechanism reason |
|---|---|---|
| Focus the first field after `.btn-register` | Current tests explicitly forbid `.focus()` and `autofocus`; focus is the `registration_form_opened` trigger, so automation would corrupt the diagnostic | C14 closed |
| Move/duplicate the form into the Basic card | Violates the one-form topology and risks protected simulator selectors | C6/C14 closed |
| Make the whole pricing card clickable or auto-open form | Changes selection semantics and can create accidental goal reaches; still the same handoff family | C14/C16/C17 closed |
| Hide paid plans or add another dominant Basic CTA | Technically easy CSS/DOM change but already measured | C20 closed |
| Add another selection banner/progress state | Existing `.is-selected` and `#registration-selection` already implement this | C11/C16/C19 closed |
| Remove/reorder content again | C10 and C22/C23 contradict further content-hiding/order work | Closed |
| Fire `registration_form_opened` on scroll/selection | Synthetic analytics event; does not represent focus or a real form start | Metric gaming |
| Auto-submit/prefill/reduce required fields | Violates protected fields and conversion semantics | Ineligible |

## Recommended routing

1. Do not implement another handoff treatment despite the 72/99 loss: it is
   diagnostically correct but experimentally exhausted.
2. Obtain exactly one truth artifact.
3. Prefer **Candidate A** if the owner can make the operational commitment;
   it is the smallest code change and has the only prior range that reaches
   41/101.
4. Otherwise use **Candidate B** or **C** only after their gates are real; each
   is feasible without touching protected form/backend/analytics.
5. Restore the chosen direct control before applying one candidate, update
   markers/contracts, rebuild, run the full contract suite, and deploy as one
   isolated mechanism.

Until a truth gate is satisfied, the correct implementation decision is
**no mutation**, not a cosmetically novel C24.
