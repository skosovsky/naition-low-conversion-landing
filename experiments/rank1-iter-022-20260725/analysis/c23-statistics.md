# C22/C23 statistical decision memo

```text
analysis mode          = file-only
completed data cutoff  = C21
C22 live/result data   = not inspected
authoritative outcome  = persisted server orders / persisted server visits,
                         confirmed by leaderboard
expected denominator   = 101
hard gate              = >=41/101 = 40.5941% and rank 1
```

## Decision

Across the 21 completed cohorts, the best authoritative result is
`30/101 = 29.7030%` in C7. The hard gate is eleven orders higher:

```text
41 - 30 = 11 orders
40.5941% - 29.7030% = 10.8911 percentage points
required rescue from C7 nonorders = 11 / 71 = 15.49%
```

No completed candidate reached more than `30/101`; all fourteen candidates
after C7 finished at `15..27/101`. The completed decisions close the tested
copy, layout, handoff, pricing, proof, decision-support and plan-semantics
families.

The file-only answer for C23 is therefore:

> **No remaining unblocked candidate has credible evidence-backed capacity to
> clear `41/101` without a new product fact.**

C20 names the only remaining high-capacity direction as
`date-flexible-open-enrollment`, explicitly blocked pending the owner's
operational confirmation. C21 repeats that no unblocked truthful treatment
has plausible `+11` capacity and classifies the next run as a bounded
low-capacity exploration, not a predicted winner.

This does not make a C22 surprise mechanically impossible. It means that,
before seeing C22, the completed evidence does not support assigning any
existing backlog treatment a credible eleven-order causal capacity.

## Evidence contract

Authoritative rows were taken from:

- C1 and C3–C20:
  `.../naition-low-conversion-landing/experiments/<iteration>/result.json`,
  cross-checked against each `decision.md`;
- C2, which has no final `result.json`:
  `normalized/server.json`, `normalized/leaderboard.json` and
  `analysis/statistics.md`;
- C21:
  `/private/tmp/naition-rank1-c22-program/experiments/rank1-iter-021-20260725/result.json`
  and `decision.md`.

Server and leaderboard agree on numerator and denominator for every row.
Client analytics are not added to the sample and are not used to redefine
conversion. Every completed cohort has `101` authoritative server visits,
which makes order counts directly comparable.

C22 files, UI, server state and live candidate were not read. This memo is a
pre-result decision prior, not a C22 outcome report.

## All completed authoritative outcomes

| C | Mechanism | Orders / 101 | CR | Rank | Recorded decision |
|---:|---|---:|---:|---:|---|
| 1 | `reduce-perceived-commitment-risk` | 22 | 21.7822% | 3 | no effect; closed |
| 2 | `lower-real-purchase-price` | 22 | 21.7822% | 3 | no movement; rotate |
| 3 | `verified-reciprocal-value-at-pii-gate` | 20 | 19.8020% | 4 | regression; closed |
| 4 | `audience-to-outcome-hierarchy` | 28 | 27.7228% | 2 | partial effect; layer retained, wording family closed |
| 5 | `evidence-only-credibility` | 26 | 25.7426% | 2 | regression; closed |
| 6 | `action-first-transaction-surface` | 26 | 25.7426% | 2 | no effect; closed |
| 7 | `fear-to-rehearsal-bridge` | **30** | **29.7030%** | **2** | best partial effect; layer retained, wording family closed |
| 8 | `hands-on-practice-density-offer` | 26 | 25.7426% | 2 | regression; closed |
| 9 | `decision-gap-self-diagnosis` | 25 | 24.7525% | 2 | regression; family closed |
| 10 | `progressive-disclosure-decision-spine` | 15 | 14.8515% | 5 | regression; disclosure/density family closed |
| 11 | `earned-progress-registration-continuation` | 24 | 23.7624% | 2 | regression; closed |
| 12 | `early-practice-embodiment` | 23 | 22.7723% | 2 | regression; visual-primacy family closed |
| 13 | `tentative-calendar-commitment` | 25 | 24.7525% | 2 | regression; optional-calendar family closed |
| 14 | `real-plan-click-field-focus-handoff` | 22 | 21.7822% | 3 | regression; focus/handoff family closed |
| 15 | `fixed-session-decision-object` | 27 | 26.7327% | 2 | regression; logistics-adjacency family closed |
| 16 | `truthful-basic-default-choice` | 27 | 26.7327% | 2 | no effect versus C15; default-choice family closed |
| 17 | `native-plan-contract-semantics` | 26 | 25.7426% | 2 | regression; family closed |
| 18 | `dimension-aligned-plan-comparison` | 24 | 23.7624% | 2 | regression; family closed |
| 19 | `persisted-application-state-integrity` | 24 | 23.7624% | 2 | regression; family closed |
| 20 | `single-actionable-basic-route` | 24 | 23.7624% | 2 | regression; family closed |
| 21 | `explicit-personal-plan-fit-rule` | 27 | 26.7327% | 2 | regression; taxonomy family closed |

Observed order sequence:

```text
22, 22, 20, 28, 26, 26, 30, 26, 25, 15, 24,
23, 25, 22, 27, 27, 26, 24, 24, 24, 27
```

## Observed variance across candidates

These are different adaptive treatments, not repeated IID measurements of
one fixed page. The distribution describes the realized candidate programme;
it does not estimate pure simulator noise.

| Statistic | Orders out of 101 | Conversion-rate scale |
|---|---:|---:|
| N completed candidates | 21 | — |
| Total | 513 / 2,121 | pooled arithmetic rate 24.1867% |
| Mean | 24.4286 | 24.1867% |
| Median | 25 | 24.7525% |
| Q1 / Q3 | 23 / 26 | 22.7723% / 25.7426% |
| IQR | 3 | 2.9703 pp |
| MAD from median | 2 | 1.9802 pp |
| Sample variance | 10.1571 orders² | — |
| Sample SD | 3.1870 | 3.1555 pp |
| Minimum / maximum | 15 / 30 | 14.8515% / 29.7030% |
| Range | 15 | 14.8515 pp |

Frequency:

| Orders | 15 | 20 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 30 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Cohorts | 1 | 1 | 3 | 1 | 4 | 2 | 4 | 3 | 1 | 1 |

The hard gate `41` is:

- `+11` orders above the observed maximum;
- `+16.5714` above the observed mean;
- descriptively `3.45` cross-candidate sample SD above the maximum and
  `5.20` SD above the mean.

Those SD distances are descriptive only because the candidates were selected
adaptively and have different mechanisms.

Only two iterations produced a positive point delta against their declared
meaningful comparator:

- C4: `20 → 28`, `+8` orders, but still thirteen short of the gate;
- C7: `26 → 30`, `+4` orders, establishing the best control, but still eleven
  short.

C1, C2, C6 and C16 tied their immediate comparator; the remaining fifteen
were lower. Arithmetic addition of `+8` and `+4` is not a causal forecast:
the effects occurred on different page states, retained layers are already
present in later controls, and attempted layering repeatedly regressed.

### Post-best programme

C8–C21 comprise fourteen completed candidates after C7:

```text
n       = 14
mean    = 24.2143 orders
median  = 24.5 orders
SD      = 3.0679 orders
range   = 15..27 orders
>=30    = 0
>=41    = 0
```

Thus the programme has not merely failed to find another `41`; fourteen
successive candidates have failed even to reproduce the C7 point maximum.

## Required `>=41/101` tail

### Empirical candidate tail

Observed candidate-level tail:

```text
completed candidates with >=41 orders = 0 / 21
completed candidates with >30 orders  = 0 / 21
```

A naive one-sided 95% upper bound for a Bernoulli success probability after
`0/21` successes is `13.29%`. It is not a next-candidate probability because
iterations are adaptive, non-exchangeable and mechanism-dependent.

### Exact-binomial sensitivity

If, counterfactually, a new `101`-visit run were IID Bernoulli with unchanged
true conversion probability:

| Plug-in probability | `P(X >= 41)` | Interpretation |
|---|---:|---|
| Best C7 point estimate, `p=30/101=29.7030%` | `1.2672%` | about 1 in 79 runs |
| All-run pooled arithmetic rate, `p=513/2121=24.1867%` | `0.0197%` | about 1 in 5,071 runs |

These are sensitivity calculations, not forecasts for C22. The simulator
does not expose independence, seed, persona allocation or a stable sampling
distribution. A real treatment is intended to change `p`; without a new
causal mechanism there is no evidence that it does.

### Best versus target uncertainty

Again under unsupported independent-binomial assumptions:

- Wilson 95% for C7 `30/101`: `21.67%–39.23%`;
- Wilson 95% for target `41/101`: `31.53%–50.35%`;
- point difference: `+10.8911 pp`;
- Newcombe 95% sensitivity interval for `41/101 - 30/101`:
  approximately `-2.25…+23.53 pp`.

Therefore one `41/101` result would satisfy the operational hard gate, but by
itself would not establish a conventional 95% causal difference from C7.
Server persistence and rank decide the competition outcome; repeated or
randomized evidence would be needed for a causal claim.

## Capacity audit for remaining mechanisms

### What the completed decisions establish

1. The current best control is C7 at `30/101`.
2. Any C23 treatment starting from that control needs at least eleven net new
   persisted orders, or `15.49%` of its 71 nonorders.
3. C21 finished at `27/101`; continuing from that state would need fourteen
   new orders, or `18.92%` of its 74 nonorders.
4. The largest observed positive delta was `+8`, but it started from a
   regressed `20/101` control and ended at `28/101`.
5. The best-control improvement that established C7 was only `+4`.
6. No C8–C21 treatment matched C7; their maximum was `27`.
7. Every tested no-new-fact mechanism family is explicitly closed in its
   decision artifact.

### Remaining truth-safe candidate

C20's decision states:

> All file-only C21 searches found no remaining unblocked, truthful mechanism
> with plausible `+11` capacity. The only high-capacity candidate is
> `date-flexible-open-enrollment`, which requires the owner's explicit
> operational confirmation before copy can be changed.

C21's decision independently states:

> File-only C22 reviews found no unblocked truthful treatment with a credible
> eleven-order capacity; the next iteration is a bounded low-capacity
> exploration and must not be presented as a predicted winner.

Consequently, another copy/layout variant based only on existing page facts
has no supported path to `+11`. The unblocked-candidate set is not literally
empty, but its documented members are low-capacity explorations. The only
documented high-capacity direction requires a new operational product fact.

Credibility requires more than mathematical possibility:

- the mechanism must affect a pool of at least eleven current C7 nonorders;
- the product must be able to fulfil at least 41 candidate orders;
- the fact must exist before its copy is deployed;
- server persistence must remain the outcome;
- no waitlist, inquiry, analytics goal or synthetic interaction may be
  reclassified as an order.

Without that, `41/101` would be an unsupported hope or metric gaming, not a
credible treatment forecast.

## C22 decision rule after terminal result

C22 was intentionally excluded from this memo. Once its immutable
authoritative result is available:

| C22 server + leaderboard result | Decision |
|---|---|
| `>=41/101` and rank 1 | Objective reached. Stop mutation loop, freeze all evidence and analyze causality separately. |
| `34..40/101` and rank 1 | Leader may be overtaken, but the 40% hard gate is missed. Do not rerun; preserve as a partial layer only if truth/quality guardrails pass. |
| `31..33/101` | New observed maximum but still `8..10` orders short. No automatic C23; require a new high-capacity fact. |
| `<=30/101` | No new maximum. Reject/rotate once; no synonymous retry. |
| Server and leaderboard disagree | Outcome is inconclusive until reconciled; client analytics cannot decide it. |

## C23 go/no-go

### `GO`

Only if one of these is true:

1. C22 itself reaches the hard gate, in which case C23 mutation is unnecessary;
2. a new, immutable and operationally approved product fact supplies a
   truth-safe mechanism with explicit capacity of at least `+11` versus C7.

For the currently named direction, this means owner-confirmed
`date-flexible-open-enrollment` before any page claim is changed. Its factual
availability and fulfilment capacity must be recorded as an activation
contract, not inferred by an analyst.

### `NO-GO`

If C22 misses and no new product fact exists:

- do not launch another cosmetic, wording, plan-comparison, handoff,
  disclosure, trust, calendar, focus or application-state variant;
- do not combine closed mechanisms and add their historical deltas;
- do not repeat the simulator to search the upper tail;
- do not lower or reinterpret the persisted-order gate.

The statistically and causally honest C23 decision in that state is
`blocked_pending_new_product_fact`, not another nominally distinct landing
experiment.
