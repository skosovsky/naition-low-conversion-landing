# C21 decision — rejected

C21 is a valid losing cohort on the exact committed candidate:

- commit `2fe94c3e255e49b90cf8032c001d4f7ec7349ed7` matched `origin/main`;
- one authenticated Chrome Redeploy reached terminal `deployed`;
- live HTML exposed `plan-fit-rule-v1-c21-20260725`,
  `rank1-plan-fit-rule-c21-20260725`, and the intended
  `.pricing-fit-rule` treatment;
- the authoritative server was `0 visits / 0 orders` before the cohort;
- one simulator invocation completed `100/100` successful visits with
  `0` failures and `27` panel conversions;
- server and cache-mature leaderboard agree on `27/101 = 26.7%`, rank 2.

The result is three orders below the exact C7 direct control (`30/101`) and
fourteen below the hard `41/101` gate. The
`explicit-personal-plan-fit-rule` mechanism is rejected as a regression.
Synonymous recommendation copy, plan-fit labels, or a more prominent version
of the same taxonomy would repeat the closed mechanism.

The official GA4 vendor MCP snapshot has clean process lifecycle and exact C21
labels, but is `standard_immature`: exact-cohort rows are empty and therefore
mean **not observed**, not zero. A single mature retry is scheduled for
cohort-end plus 4 hours 15 minutes and does not block C22.

The authenticated Chrome session exposed Yandex Webvisor and Amplitude tabs.
Their heavy application tabs stopped responding to the control channel during
the C21 export attempts. No UI content is represented as collected vendor
data; source-availability envelopes are preserved locally. This does not
change or weaken the losing authoritative outcome and does not block the next
fast iteration.

File-only C22 reviews found no unblocked truthful treatment with a credible
eleven-order capacity. The next iteration must therefore be recorded as a
bounded low-capacity exploration from exact C7, not presented as a predicted
winner.
