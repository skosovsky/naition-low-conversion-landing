# C24 high-impact hypothesis design

## Verdict

**No currently deployable, truth-safe C24 mechanism has a credible route to
the hard pass.**

This is a file-only conclusion from C23 phase 1, all ten Webvisor shards, the
mechanism ledger, `STUDENTS.md`, and the current `index.php`. It is not a
recommendation to stop the overall goal. It is a gate against spending another
cohort on a relabeled mechanism that the experiment history has already
closed.

The arithmetic is unforgiving:

```text
C23 authoritative result       = 28/101
hard conversion threshold      = at least 41/101
required incremental orders    = +13
C23 non-orders                 = 73
required rescue of non-orders  = 13/73 = 17.81%
```

The local behavioral evidence gives a high-capacity location but not a new
eligible treatment:

```text
101 Landing Viewed
 99 Pricing Plan Selected
 28 Registration Form Opened
 28 Submitted
 28 Completed
```

Yandex independently shows the same binary shape at `100 → 99 → 27 → 27 →
27`. Of 73 Yandex non-converters, 72 selected a plan and none opened the form.
Among the 71 complete deep-abandon recordings, visitors reached the lower page
and stopped roughly 5–6 seconds after selection. Once a field is voluntarily
focused, observed abandonment is zero.

That makes the plan-selection-to-voluntary-form-start boundary the only local
cluster with enough numerical capacity. It does **not** reopen the already
failed handoff/form families.

## Rejected apparent shortcuts

The following may look high-capacity in C23 but are repetitions, not new
mechanisms:

| Apparent treatment | Why rejected |
|---|---|
| Scroll, focus, reveal, expand, move, overlay or inline the form after the plan click | C6/C11/C14 closed form topology, salience, continuation and click-to-field handoff. A modal or inline expansion is only a new rendering of the same causal family. |
| Make Basic default, larger, singular, recommended, semantically clearer or the only visible CTA | C16–C20 and C21 closed default choice, plan semantics/geometry, visible-route reduction and explicit plan-fit guidance. |
| Strengthen “0 ₽”, “без оплаты”, “без обязательств”, callback/application-state or contact-use language | C1/C2/C19 closed payment, commitment and persisted-application-state reassurance. |
| Put the downloadable practice card before, beside or after the PII gate | The asset is genuinely implemented at `downloads/first-aid-practice-card.html`, but C3 closed reciprocal asset/value exchange. Changing where the same card appears does not create a new cause. |
| More curriculum, practice, certification, outcome, injury ordering, imagery or trust copy | C4/C5/C7/C8/C12/C22/C23 close those presentation families; no new attributable proof exists locally. |
| Hide or shorten the long page | C10 strongly regressed, and C23 shows that 71/72 complete non-converters already reach at least 90% depth. |
| Treat a plan click, programmatic focus, download or analytics event as conversion | Violates the persisted-order success contract and is metric gaming. |

The implemented product capabilities visible in `index.php`—the full free
course, paid materials option, corporate option, certificate, practice, and
downloadable practice card—have all already been used by closed presentation
families. None supplies a causally new `+13` route merely by being restyled.

## Up to three genuinely new high-capacity mechanisms

These mechanisms are causally new because they change product reality, not the
page's description of the same offer. None is authorized for deployment from
the current repository evidence.

### 1. Date-flexible open enrollment

**Mechanism:** accept and retain applications from people unable to attend
15 August for a later Moscow cohort of the same full free course, then contact
them when a real date is approved.

**Why it is new:** it expands actual eligibility. C13/C15 only changed
presentation of the fixed session; they did not make another cohort available.

**Credible capacity route:** the offer currently commits to one fixed date in
the hero, metadata, pricing handoff and registration support. A real later-date
path acts on all 73 non-orders. Recovering 13 requires 17.81% of that pool.
This is the only proposed family whose effect can plausibly be population-wide
without altering conversion semantics.

**Mandatory truth gate:**

- later-group applications are actually retained;
- applicants are actually contacted when a date exists;
- the later offer remains the same full free course in Moscow;
- an accountable fulfillment owner is named;
- the commitment is recorded with a timestamp and publish permission.

**Status:** `BLOCKED_MISSING_PRODUCT_CONTRACT`. Database ability to save
contacts is not proof that a later cohort will be fulfilled. Without the gate,
the claim is fabricated.

### 2. Immediate confirmed-seat enrollment

**Mechanism:** a successful submission reserves a real available seat
immediately, with confirmation derived from an authoritative capacity source,
rather than creating a contact-only application awaiting an unspecified
callback.

**Why it is new:** this changes the transaction from “request contact and wait”
to “obtain a confirmed enrollment”. C1/C19 changed only reassurance and state
description; they did not provide inventory-backed confirmation.

**Credible capacity route:** it directly changes the value of crossing the
observed 72/99 selection-to-form boundary. To reach 41/101 from C23 it must
convert 13 of the 72 selected non-openers (18.06%). A guaranteed, immediate
outcome could rationally affect that entire cluster; presentation-only
reassurance cannot.

**Mandatory truth and scope gates:**

- authoritative seat inventory and atomic reservation behavior;
- an operational fulfillment owner and confirmation channel;
- a defined full/duplicate/cancellation path;
- permission to change the protected submission/backend contract;
- server and leaderboard continue to count only successful persisted
  enrollments.

**Status:** `BLOCKED_OUTSIDE_PROTECTED_CONTRACT`. `STUDENTS.md` forbids
changing the form, API and SQL, and the repository shows no seat source of
truth. Merely changing “заявка” to “место подтверждено” would be false.

### 3. Enforceable participation assurance

**Mechanism:** attach a real operational policy to the enrollment—for example,
a named response SLA plus an enforceable transfer/reschedule/cancellation
right—implemented by the course operator rather than expressed as generic
trust copy.

**Why it is new:** it reduces actual fulfillment risk. C5 and C19 supplied no
offer-bound evidence or enforceable promise, while C13/C15 only exposed the
fixed date.

**Credible capacity route:** the policy can apply to all 73 non-orders at the
decision boundary. The hard pass needs 13 rescues (17.81%). That is numerically
possible only if uncertainty about fulfillment or the fixed commitment is a
major latent reason; C23 recordings cannot prove that reason, so this mechanism
has weaker support than date flexibility.

**Mandatory truth gate:**

- exact SLA/right and exceptions written as an operational contract;
- accountable owner and process able to honor it;
- attributable verification route;
- publish permission and durable evidence.

**Status:** `BLOCKED_MISSING_ENFORCEABLE_POLICY`. A decorative guarantee,
deadline or urgency phrase is generic trust/commitment copy and remains closed.

## Selection

```text
deployable candidate now = none
priority unlock          = date-flexible-open-enrollment
fallback unlock          = immediate-confirmed-seat-enrollment
third unlock             = enforceable-participation-assurance
```

If an owner-backed date-flexibility contract becomes available, preregister
that single product-reality change on the exact best control. Do not combine it
with a form, CTA, pricing, asset or copy-cleanup treatment. Measure:

- authoritative: persisted orders / persisted server visits;
- competition: leaderboard rank and conversion;
- diagnostic: `Registration Form Opened / Pricing Plan Selected`;
- hard pass: at least 41/101 and rank 1.

If no product-truth gate can be supplied, the evidence-based action is to
restore the best exact control while acquiring the missing product contract,
not to burn another 100-visit run on cosmetic mutation.
