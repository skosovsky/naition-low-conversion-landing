# C22 analytics diagnostic

The authoritative result is `30/101 = 29.703%`, rank 2. Server, the
cache-mature leaderboard, Yandex.Metrica and Amplitude agree on the exact
cohort.

## Exact funnel

| Step | Amplitude users | Yandex visits with goal |
|---|---:|---:|
| Landing viewed | 101 | 101 |
| Pricing plan selected | — | 99 |
| Registration form opened | 30 | 30 |
| Registration submitted/attempted | 30 | 30 |
| Registration completed | 30 | 30 |

Amplitude's ordered vendor-MCP funnel is `101 → 30 → 30 → 30`. Yandex
independently reports `101 → 99 → 30 → 30 → 30`.

The measured loss is before voluntary form opening:

- `71/101` visitors do not open the form;
- `0/30` form openers are lost before submit;
- `0/30` submitters are lost before backend-confirmed completion.

Therefore form field validation, submit transport and backend persistence are
not the current bottleneck. The rejected C22 numbering treatment did not move
the landing-to-form-open decision above the exact C7 direct control.

## Webvisor cohort

The authenticated Yandex browser export contains all `101` exact-cohort visit
rows, each with a unique visit ID. Every row is Webvisor version 2, one page
view, direct traffic, Russia, Windows and Chrome. Recorder rows are available
but have not previously been marked as viewed.

Visit duration is concentrated around one minute:

- minimum `2s`;
- p25 `45s`;
- median `49s`;
- p75 `52s`;
- maximum `59s`.

The redacted per-visit rows are saved locally; `userIDHash`, selected text,
request keys and authorization material were deliberately omitted.

## GA4 maturity

The official Google Analytics MCP completed a clean child lifecycle
(`exitCode=0`, close observed, no forced termination). The standard exact
cohort report is still immature and empty, while property-level event
liveness is present. The empty exact report is not interpreted as zero.
One mature retry is scheduled; BigQuery was not used.
