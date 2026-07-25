# C24 contrarian hypothesis review

## Verdict

The default explanation — “visitors select the plan but fail to notice how to
open the form” — is not supported strongly enough to justify another handoff
treatment.

The frozen recordings locate the measured split at
`Pricing Plan Selected → Registration Form Opened`, but that event boundary is
not itself a causal explanation. The current implementation already:

- marks the clicked pricing card selected;
- changes the registration copy to the selected plan, price, date and next
  step;
- calls `registrationSection.scrollIntoView(...)`;
- renders the three-field form directly in that destination section.

In the 71 complete deep non-converting recordings, the visitor reaches the
bottom area after selecting Basic, remains active for roughly 5–6 seconds and
does not focus any field. Converters and non-converters have almost identical
scroll, pause, depth and time-to-plan profiles. This looks at least as much
like a decision not to provide contact details as a missed control.

The existing history makes the distinction important. C14 already tested
programmatic CTA-to-field focus; C6 tested form topology; C16/C17/C18/C20
tested default selection, plan semantics, comparison geometry and action
reduction; C19 tested the contact-only transaction explanation. Relabeling any
of those as “a clearer handoff” would be serial overfitting, not a causally new
experiment.

## Capability audit

Two real on-page capabilities deserve explicit treatment in the decision:

1. A successful application already unlocks a downloadable practice card.
   This is implemented, not hypothetical. It is nevertheless **not a valid
   next mechanism**: C3 already closed reciprocal asset/value exchange at the
   PII gate. Moving the same card above the form or making it louder repeats
   that family.
2. The form already submits successfully without a backend plan field; plan
   identity is maintained for analytics and display, while the protected
   persisted form remains `name`, `phone`, `email`. Turning that fact into
   “no plan choice required” would still repeat the C16/C20
   default/action-reduction family and should not be disguised as new.

This audit rules out the tempting local tricks rather than manufacturing a
candidate from them.

## Up to three genuinely new mechanisms

All three candidates below change a reason to apply, not the visibility of the
same application control. They are truth-safe **only after the named gate is
satisfied**.

### 1. Date-flexible open enrollment

**Mechanism.** Accept the application for the next suitable Moscow cohort when
15 August does not fit, while retaining and fulfilling it as the same free full
course. This expands actual temporal eligibility; it is not another rewrite of
fixed-date copy.

**Why it challenges the default.** A visitor can understand the form perfectly
and still decline because the only stated session is 15 August. The binary
post-selection split is compatible with that unobserved eligibility decision.

**Truth gate.** An owner-backed operational commitment must confirm that
later-cohort applications are retained, contacted after date assignment and
fulfilled under the same free-course offer. Without that commitment, “choose a
later date” or “we will find a suitable group” is fabricated.

**Capacity.** This is the only locally identified mechanism with a plausible
population-wide route to the additional 11–13 orders required. Capacity is
unknown until tested; no recording identifies date conflict directly.

### 2. Enforceable response and place-resolution contract

**Mechanism.** Replace open-ended “we will contact you” with a real,
operationally enforced response window and explicit resolution outcome: when
the applicant will receive a place confirmation or an alternative. The causal
change is reduced transaction uncertainty through service behavior, not
generic reassurance.

**Why it is new.** C1/C19 changed explanatory copy around payment/contact state,
but did not establish an enforceable fulfillment SLA. A real SLA changes the
offer contract; merely writing faster-sounding copy does not.

**Truth gate.** Named operational owner, achievable response deadline,
definition of a resolved application, and evidence that the workflow will
honor it. If no such process exists, do not deploy this mechanism.

**Capacity.** Potentially population-wide but unquantified. It is secondary to
date flexibility because no frozen behavior proves response-time anxiety.

### 3. Attributable proof for this exact course

**Mechanism.** Add verifiable, permissioned evidence tied to this organizer,
instructor, venue or completed offering: identity plus a route by which the
claim can be checked. This changes the evidence available at the contact-data
decision, rather than adding another generic trust adjective.

**Why it is new.** C5 closed credibility cleanup without new attributable
proof. An independently checkable offer-bound artifact was never present and
is a different causal input.

**Truth gate.** A publishable source artifact, permission to use it and a
verification route. Examples are not claims: the actual organizer/instructor
credential, venue confirmation or attributable participant evidence must be
supplied first.

**Capacity.** Broad reach but unknown effect. It should rank behind date
eligibility and behind an enforceable transaction contract unless the supplied
proof is unusually strong.

## Adversarial decision

There is no evidence-backed, truth-safe, presentation-only C24 treatment in the
current repository with credible `+11` order capacity. The rational next move
is:

1. do **not** run another form-handoff, sticky CTA, focus, default-plan,
   practice-card or copy-salience variant;
2. activate mechanism 1 if its operational truth gate can be proven;
3. otherwise activate mechanism 2 or 3 only when its external truth artifact
   exists;
4. if no gate can be satisfied, record `NO-GO` rather than spend another cohort
   on a closed family or metric gaming.

Primary outcome remains persisted server orders per server visit reconciled to
the leaderboard. `Registration Form Opened / Pricing Plan Selected` is only a
diagnostic; moving that event without additional persisted orders is not
success.
