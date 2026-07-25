# C24 adversarial candidate gate

## Verdict

**No current candidate is worth deploying.**

C23 gives a decision-grade outcome (`28/101`, rank 2) and an unusually clear
diagnostic split:

```text
Amplitude: 101 landing → 28 form opened → 28 submitted → 28 completed
Yandex:    100 landing → 99 plan selected → 27 opened → 27 attempted → 27 completed
```

All ten Webvisor shards reproduce the same pattern. Of 73 Yandex
non-converters, 72 selected a plan; 71 complete deep-abandon recordings reach
the lower page, then end about 5–6 seconds after selection without touching a
field. Once a form field is voluntarily entered, observed loss is zero.

This identifies a **high-capacity event boundary**, not its cause. The current
site already selects the card, changes the registration message and invokes
`registrationSection.scrollIntoView(...)`. C6, C11 and C14 already tested form
topology, continuation and click-to-field focus; C16–C21 tested default choice,
plan semantics/geometry, action reduction, application-state language and an
explicit fit rule. Recasting the same interventions as “activation” would be
serial overfit.

## Hard gate

A deployable C24 must pass every column:

1. causally distinct from C1–C23;
2. supported by an existing, publishable product fact;
3. have a credible route to at least `41/101` (`+13` over C23, `+11` over the
   best C7 control);
4. not depend on exploiting the simulator's deterministic trajectory;
5. comply with `STUDENTS.md` and preserve persisted-order conversion.

| Candidate | Novel | Truth | Capacity | Overfit risk | STUDENTS / conversion | Decision |
|---|---:|---:|---:|---:|---:|---|
| Highlight, arrow, “step 2”, stronger CTA or selected-state animation | **Fail** — C6/C11/C14/C19 | Pass | Unproven | High: tailored to the observed five-second synthetic exit | Usually allowed visually | **REJECT** |
| Auto-reveal, auto-scroll, auto-focus, modal or inline form after plan click | **Fail** — C6/C11/C14 | Pass | Numerically exposed, causally unsupported | Critical: can manufacture the exact next simulator action | Cross-section move is outside allowed placement; auto-focus is prior family | **REJECT** |
| Sticky registration prompt / single next action | **Fail** — C6/C20 | Pass | Unproven | High: follows simulator traversal | CTA CSS visibility may be allowed, but family is closed | **REJECT** |
| Default Basic, hide paid alternatives, remove choice | **Fail** — C16–C20 | Pass | Disconfirmed by prior cohorts | High | Buttons cannot be removed; CSS hiding alone does not create novelty | **REJECT** |
| More `0 ₽`, no-payment, no-obligation or callback explanation | **Fail** — C1/C2/C19/C21 | Pass | Disconfirmed / low | Medium | Text allowed | **REJECT** |
| Move or strengthen the downloadable practice-card reward | **Fail** — C3 reciprocal-value family | Pass: asset exists | C3 regressed to 20/101 | Medium | Text/layout may be allowed | **REJECT** |
| More course, injury, practice, certificate, imagery or generic trust content | **Fail** — C4/C5/C7/C8/C12/C22/C23 | Only existing generic facts | No credible `+11` route | High adaptive-story risk | Mostly allowed | **REJECT** |
| Hide, shorten or progressively disclose the page | **Fail** — C10 | Pass | Strong negative evidence: 15/101 | Medium | May be allowed | **REJECT** |
| Date-flexible open enrollment | **Pass** — changes actual eligibility | **Fail now**: no owner-backed later-cohort fulfillment contract | Only family with a plausible population-wide route | Low after truth gate; high if merely phrased for simulator | Text allowed, but false commitment forbidden | **BLOCKED; CONDITIONAL PASS** |
| Immediate confirmed-seat enrollment | **Pass** — changes transaction outcome | **Fail now**: no inventory/reservation system or fulfillment contract | Plausibly population-wide | Low if real | **Fail scope**: protected form/API/SQL cannot be changed | **BLOCKED / OUT OF SCOPE** |
| Enforceable response/transfer/reschedule/cancellation policy | **Pass** — changes fulfillment risk | **Fail now**: no enforceable policy or owner | Population-wide but unquantified | Low if operationally real | Text allowed only after policy exists | **BLOCKED** |
| Attributable proof tied to this exact organizer/course | **Pass** — new evidence input | **Fail now**: no publishable artifact, permission or verification route | Broad, but no demonstrated `+11` capacity | Low if independently verifiable | Content allowed | **BLOCKED** |

## Simulator-overfit audit

The recordings are highly regular: almost every visit is direct,
Windows/Chrome, deep-scrolls the whole page, selects Basic once, and then
either performs the same five-click completion sequence or exits after about
five seconds. Converted and non-converted visits have nearly identical first
scroll, plan timing, depth, pauses and backtracking.

Therefore:

- event proximity is not proof of human confusion;
- a treatment that programmatically places focus or a control under the next
  simulated click has extreme gaming risk;
- `Registration Form Opened / Pricing Plan Selected` is diagnostic only;
- a lift in focus/open analytics without additional persisted orders is not a
  conversion improvement;
- serial point differences of a few orders cannot justify increasingly precise
  UI stories without randomized control.

The single early two-second non-converter has capacity one and cannot justify
a hero/content treatment. The Yandex `−1 visit / −1 completion` discrepancy
and one partial recording do not change the cohort-level bottleneck and cannot
be used to invent an individual cause.

## Truth and constraint boundary

`STUDENTS.md` permits text, visual styling, images, placement **within**
sections and CTA visibility through CSS. It protects:

- `#registration-form` and `action="api/submit.php"`;
- fields `name`, `phone`, `email`;
- `.btn-register`, `.pricing-section`, `.program-module`, `.program-list`;
- `api/`, `sql/schema.sql`, and the visit script.

These constraints rule out using fewer fields, a lower-intent lead, a new
reservation backend or a different success event as a shortcut. They do not
authorize fabricated availability, urgency, credentials, guarantees or
fulfillment promises.

## Deploy recommendation

```text
deployable candidate now = none
best conditional unlock  = date-flexible-open-enrollment
activation condition     = owner-backed, timestamped, publishable fulfillment contract
fallback unlocks         = attributable exact-course proof or enforceable participation policy
```

If the date-flexibility contract appears, it is the only candidate in this set
that earns an adversarial **PASS** for a single C24 experiment on exact C7. Its
treatment must express only the verified eligibility change and must not be
bundled with focus, CTA, pricing, form, reward or visual-salience changes.

Without a truth artifact, restore exact C7 as production control if needed,
but do not label that restoration a new experiment and do not spend another
100-visit cohort on a closed presentation family.
