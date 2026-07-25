# C24 hypothesis ranking

## Decision

**No deployable C24 candidate is supported by the current frozen evidence and
product-truth artifacts.**

This is a `NO-GO` on a new mutation, not a claim that the rank-1 goal is
complete. The next deployable candidate should be
`date-flexible-open-enrollment`, but only after its owner-backed fulfillment
contract exists. Until then, restoring exact C7 is valid control restoration,
not a new experiment.

## Evidence used

- C23 phase-1 profiles and reconciliation;
- all ten file-only Webvisor shards (100/100 visit coverage; one
  non-converted `fetchHit` partial);
- mechanism history through C23;
- `high-impact.md`, `conservative.md`, `contrarian.md`, `adversarial.md`, and
  `implementation-review.md`;
- local site constraints and implementation surfaces cited by those reviews.

The dedicated adversarial gate independently reaches the same `NO-GO`: the
observed event boundary has capacity, but treating its five-second synthetic
exit pattern with focus/control placement would be simulator overfit, while
the causally new product mechanisms all fail a present truth or scope gate.

## Ranking criteria

Scores use `1` (worst) to `5` (best). For risk, `5` means low risk. A candidate
is deployable only if novelty, truth and contract compliance all pass; a high
technical-feasibility score cannot compensate for a failed truth gate.

| Rank | Candidate | Novelty | Truth now | Capacity | Low risk | Fast implementation | Status |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | Date-flexible open enrollment | 5 | 1 | 5 | 2 | 4 | **Blocked: missing owner-backed fulfillment contract** |
| 2 | Attributable proof for this exact offer | 5 | 1 | 3 | 3 | 4 | Blocked: no publishable, permissioned proof artifact |
| 3 | Enforceable enrollment/response policy | 5 | 1 | 3 | 2 | 4 | Blocked: no operational owner or enforceable SLA |
| 4 | Immediate confirmed-seat enrollment | 5 | 1 | 5 | 1 | 1 | Ineligible: requires inventory/API/schema/contract changes |
| 5 | Stronger plan-to-form transition | 1 | 5 | 4 | 4 | 5 | Reject: repeats C6/C14/C16–C20 |
| 6 | Restore exact C7 | 1 | 5 | 2 | 5 | 4 | Control restoration only; not a C24 hypothesis |

## Why rank 1 is blocked

The authoritative C23 outcome is `28/101`; hard pass is at least `41/101`, so
the treatment must add 13 persisted orders. The observable high-capacity
cluster is real: Yandex has 72 non-converters who selected a plan but did not
open the form, and Amplitude places all loss before form opening. However,
presentation treatments at that boundary have already been tested:

- form topology/salience: C6;
- progress/continuation state: C11;
- click-to-field focus handoff: C14;
- default choice and plan semantics/geometry: C16–C18;
- contact/application-state explanation: C19;
- single visible Basic action: C20.

Another focus, reveal, sticky prompt, inline form, selected-state banner or
stronger next-step label would therefore be a repeat, despite targeting the
correct funnel boundary.

Date-flexible enrollment is different: it expands actual eligibility for
visitors who cannot attend 15 August. It has population-wide reach and is the
only locally identified family with a planning range whose upper end can clear
`41/101`. But the repository does not prove that later-cohort applications
will be retained, contacted and fulfilled as the same free full Moscow course.
Publishing that promise without an operational commitment would fabricate the
offer.

## Rejected repeats

Do not nominate any of these under a new label:

- auto-focus, auto-open, modal, inline/moved form, sticky CTA or extra handoff;
- default/recommended Basic, fewer visible plans, another plan-fit message;
- stronger `0 ₽`, no-obligation, contact-use or callback reassurance;
- practice-card/download value exchange;
- more curriculum, outcomes, practice, fear, imagery, proof-like generic copy;
- content hiding, shortening, numbering, module/topic reordering;
- calendar/fixed-date emphasis without actual alternative-date fulfillment;
- firing funnel events without corresponding user behavior or weakening
  persisted-order semantics.

Bundling closed families does not create novelty.

## Exact unlock contract for the recommended future candidate

`date-flexible-open-enrollment` becomes deployable only when a timestamped,
publishable owner commitment proves all of the following:

1. an application from someone unavailable on 15 August is retained;
2. that applicant is contacted when the next Moscow cohort date is assigned;
3. fulfillment remains the same full free course;
4. an accountable operational owner exists.

After that gate, implement only this product-rule change on restored exact C7,
without form, CTA, pricing-layout or analytics-semantic changes. Preregister:

- authoritative outcome: persisted server orders / server visits;
- competition gate: leaderboard rank 1;
- hard conversion gate: at least `41/101`;
- diagnostic: `Registration Form Opened / Pricing Plan Selected`;
- guardrail: `Registration Completed / Registration Form Opened`.

## Final routing

```text
deployable C24 now: none
preferred unlock: date-flexible-open-enrollment
safe action meanwhile: restore exact C7 as control, but do not count it as C24
forbidden action: spend another 100-visit cohort on a relabelled closed family
```
