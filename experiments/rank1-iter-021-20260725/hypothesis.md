# C21 — explicit personal plan-fit rule

- Base: exact C7 commit `d416b9e016ea8f2f7c30233cc60001c1a1132653`
- Best direct-control result: `30/101 = 29.7030%`, rank 2
- Latest result: C20 `24/101 = 23.7624%`, rank 2
- Hard pass: at least `41/101` and leaderboard rank 1
- Mechanism: reduce semantic plan-selection uncertainty before the existing
  three-card comparison with one explicit, truth-bounded selection rule.

## Local evidence

The frozen C20 Yandex cohort reconciles `101 → 99 → 24 → 24 → 24`.
Among 80 usable Basic-click paths, long pricing dwell (`>=1 s`) contains
`3/33` form attempts versus `17/47` for shorter dwell (exploratory Fisher
two-sided `p≈0.008`). The association is not causal proof, but it is the only
new local subgroup with arithmetic exposure capacity for the required eleven
additional orders.

## Isolated treatment

Add exactly one non-interactive, default-visible sentence immediately before
the unchanged pricing grid:

> Для личного участия выбирайте бесплатный полный курс; курс с набором — если
> нужны перевязочные материалы домой; корпоративный формат — для команды.

Every fact is already present in the exact C7 plan cards. Preserve all card
copy, prices, order, buttons, form, authored JavaScript, API, SQL and
conversion semantics.

## Adversarial dissent

The independent ranker returned `HARD_NO_GO`, arguing that the mechanism is
adjacent to C1/C16/C18/C20 and has only a `7–10%` planning probability of the
hard pass. Ann overrides the no-ship recommendation because C1 changed visual
primacy and post-click handoff but did not publish an explicit pre-click
selection rule, while C20 supplies new pricing-deliberation evidence. One
valid miss closes this semantic fit-rule family.
