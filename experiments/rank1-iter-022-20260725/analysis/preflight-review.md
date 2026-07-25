# C22 preflight review

## Internally consistent

- Candidate and remote SHA are identical everywhere:
  `84d5713d8df4220a26821c939d0f568cc9c41102`.
- Version and experiment markers agree across `preflight.json`,
  `manifest.draft.json`, the hypothesis, constraints, and implementation review.
- Redeploy key follows `<iterationId>:<candidateSha>`; simulator key follows
  `<iterationId>:100`.
- Both mutation counters are `0`, both `AlreadyRecorded` flags are `false`, and
  the contract permits one Redeploy followed by one 100-visit simulator run.
- Baseline observations are arithmetically consistent: current production C21
  is `27/101`, while the comparison baseline is the best valid direct control
  C7 at `30/101`.
- The activation sequence is correct: terminal Redeploy → exact live marker →
  pre-cohort `0/0` → exactly one simulator invocation → `100/100`.

## Patched evidence review

- SHA provenance now records the exact local and remote read commands,
  observation time, and matching observed values. The candidate/remote binding
  is adequate for the pre-mutation gate; Ann must still preserve the actual
  deploy/live-marker evidence after Redeploy.
- The control-plane contract now records the verified method, path,
  content type, and required parameter for Redeploy, status, and run-bot.
- GA4 availability now cites both the official MCP smoke inventory and the
  latest successful lifecycle evidence instead of making an unsupported
  transport claim.
- Yandex and Amplitude no longer claim data availability. Their browser-control
  recovery blockers and prior evidence paths are stated explicitly.
- `comparisonContract.objectiveOverride` accurately applies the higher-priority
  goal: server and leaderboard decide whether this authoritative iteration
  passes; diagnostic transport gaps are recorded and recovered separately.
  They remain mandatory before declaring a winning version fully reconciled.
- `status: ready_for_authoritative_iteration` is therefore scoped truthfully:
  it authorizes one Redeploy and one 100-visit run, not a final victory claim.

No evidence or idempotency blocker remains for the single authoritative
Redeploy → live-marker/`0/0` verification → one simulator invocation flow.

PASS — blockers: none for one Redeploy plus 100 successful visits; analytics reconciliation still gates final victory.
