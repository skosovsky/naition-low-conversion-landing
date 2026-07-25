# C22 decision — rejected

C22 was a valid single-mutation cohort on the exact committed candidate:

- commit `84d5713d8df4220a26821c939d0f568cc9c41102` matched remote `main`;
- Redeploy was invoked exactly once and reached terminal `deployed`;
- live markers and the CSS-counter treatment matched the candidate;
- the authoritative server was reset to `0 visits / 0 orders`;
- the simulator was invoked exactly once and completed `100/100` visits with
  `0` errors and `30` panel conversions;
- server and cache-mature leaderboard agree on `30/101 = 29.7%`, rank 2.

The candidate exactly ties the best C7 direct control (`30/101`) and misses
both hard gates: at least `41/101` and leaderboard rank 1. It is classified
`no_effect` and rejected for the rank-1 gate. The complete
`structured-program-evidence-salience` family is closed; stronger numbering,
icons, timeline styling or reordered programme modules would repeat the same
mechanism.

Official Amplitude MCP and authenticated Yandex.Metrica independently
reconcile the exact cohort. Both locate the bottleneck before form opening:
`101 landing → 30 form opened → 30 submitted → 30 completed`. The registration
form and backend lose no users once the form is opened.

The official GA4 MCP is healthy, but standard reports are still immature.
Its empty exact-cohort result is not treated as zero; a mature retry is
scheduled without BigQuery.

File-only C23 reviews found no unblocked truthful mechanism with credible
`+11` order capacity. The only high-capacity direction,
`date-flexible-open-enrollment`, requires an owner-backed operational
fulfillment contract. The remaining truth-safe structural reserve is a weak
new information-order test with an honest `27–33/101` range, not a predicted
winner.
