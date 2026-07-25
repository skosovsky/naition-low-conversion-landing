# C23 decision — rejected

C23 is a valid losing cohort on the exact committed candidate:

- commit `ec8866e9af598315f8daab53ecc7e80dcb79bd52` matched remote `main`;
- Redeploy was invoked exactly once and reached terminal deployed state;
- live markers matched `hero-detail-topic-order-v1-c23-20260725`;
- one simulator invocation completed `100/100` successful visits with no
  errors and 28 panel conversions;
- server and cache-mature leaderboard agree on `28/101 = 27.7%`, rank 2.

The candidate is two orders and `1.9802` percentage points below the C22/C7
control (`30/101`). The `hero-to-detail-topic-order-continuity` mechanism is
classified `negative_effect`, rejected, and closed. Another content-order
permutation would repeat the same causal family.

Official Amplitude MCP agrees exactly with the authoritative outcome:
`101 landing → 28 form opened → 28 submitted → 28 completed`. All observed
loss occurs before form opening. Frozen, unsampled Yandex Webvisor data shows
`100 landing → 99 plan selected → 27 form opened → 27 completed`. It covers
all 100 vendor visit IDs and 99 complete endpoint bundles; one non-converted
bundle lacks `fetchHit`. The `−1 visit / −1 completion` discrepancy against
server and Amplitude is real but its cause is unproven.

The official GA4 collector completed cleanly (`exitCode=0`, `close` observed,
no signal or forced termination), but its exact-label report remains
`standard_immature`. Its partial rows are not interpreted as conversion and
do not block rejection or the next fast iteration.

File-only behavioral analysis localizes the dominant bottleneck at
`plan selected → form opened`: 72 of 73 Yandex non-converters selected the
free plan, reached the lower page, and made no form interaction; every
observable visitor who opened the form completed it. Simple handoff, focus,
form-topology, default-plan and action-reduction treatments were already
tested in earlier cohorts, so C24 must not relabel those closed mechanisms.

Decision: reject C23 and rotate to a causally new mechanism. The hard gate
remains leaderboard rank 1 and at least 40% on a fresh 100-visit cohort.
