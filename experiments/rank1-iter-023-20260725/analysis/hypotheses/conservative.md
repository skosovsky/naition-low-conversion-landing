# C24 conservative hypothesis review

## Verdict

**No valid low-risk, causally new, truth-safe candidate exists in the current
local evidence.**

The conservative recommendation is therefore **do not deploy a relabelled
presentation treatment**. Restoring exact C7 is defensible as control
restoration, but it is not a new hypothesis and must not be counted as another
conversion experiment.

## Why the observed bottleneck does not create a new candidate

All ten Webvisor shards reproduce the same split:

- 99/100 Yandex visits select a pricing plan;
- 27/100 open the registration form;
- all 27 form openers complete;
- 72/73 non-converters select the free plan and never interact with a form
  field;
- 71 complete deep non-converters reach the bottom region and remain active
  roughly 5–6 seconds after plan selection.

Amplitude independently locates the entire measured loss before form opening:
`101 landing → 28 opened → 28 submitted → 28 completed`. The evidence rules
against content reach, scroll depth, field validation and backend submission as
the next conservative target. It does not prove whether the pre-form loss is
caused by affordance, motivation, simulator policy or an unobserved factor.

The apparent low-risk idea would be a stronger visual transition from selected
plan to the first field. That idea is invalid under the mechanism ledger:

- C14 already tested programmatic CTA-to-field focus handoff;
- C6 closed form topology and transaction-surface salience;
- C19 closed the contact-only persisted-application explanation;
- C20 closed one-visible-Basic-action/action-reduction;
- C16/C17 closed selected/default-plan state and plan semantics;
- the ledger explicitly prohibits repeating progress UI, auto-focus,
  synthetic continuation, badges, defaults and further action reduction.

The current implementation already selects the card, updates the
`registration-selection` message, and smooth-scrolls the registration section
into view. Adding an arrow, highlight, sticky prompt, “step 2” label, stronger
button copy, automatic reveal, automatic focus, or moving the form nearer the
card would change presentation details while repeating one or more of those
closed causal families. Combining them would also destroy attribution.

## Candidate screen

| Candidate | Low implementation risk | Causally new | Truth-safe | Decision |
|---|---:|---:|---:|---|
| Highlight/relabel the form after plan selection | Yes | No: C6/C14/C19 | Yes | Reject as repetition |
| Auto-focus or auto-open the first field | Yes | No: C14 | Yes | Reject as repetition |
| Put the form inside/next to the free card | No; section-placement and simulator risk | No: C6/C14 | Yes | Reject |
| Hide or de-emphasize paid alternatives | Yes | No: C20 | Yes | Reject as repetition |
| Add urgency, scarcity or guaranteed confirmation | Yes technically | Potentially | No supporting product artifact | Reject as fabricated |
| Claim flexible dates or open enrollment | Yes technically | Yes | No owner-backed fulfillment commitment | Blocked |
| Add organizer/instructor/venue proof | Yes technically | Yes | No attributable publishable proof | Blocked |
| Publish a response/transfer/cancellation SLA | Yes technically | Yes | No enforceable owner-backed policy | Blocked |

## Constraints and capacity

`STUDENTS.md` preserves the form action, its three fields, tracking script,
required simulator classes, API files and SQL schema. It also allows only
placement changes *within* sections, so a cross-section form relocation is not
a conservative compliant reserve.

The best control is C7 at `30/101`. Achieving the hard gate requires at least
`41/101`, or 11 additional orders. The only unblocked presentation ideas above
are closed-family variants and have no new causal evidence supporting that
capacity. The remaining genuinely new families require product truth that is
not present in `index.php`, `STUDENTS.md`, the phase-1 audits, or any of the ten
shards:

1. date-flexible open enrollment backed by actual fulfillment;
2. attributable offer-bound provider proof;
3. an enforceable confirmation/transfer/cancellation policy;
4. a real confirmed-seat transaction, which also exceeds the protected
   frontend-only contract.

## Conservative next action

Do not nominate a C24 candidate from this role. Request or locate one of the
truth artifacts above, then design a single coherent experiment around it.
Until such evidence exists, the honest conservative action is exact C7 control
restoration—not another deploy presented as a causally new test.
