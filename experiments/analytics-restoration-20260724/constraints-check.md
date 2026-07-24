# Constraint check — analytics-restoration-20260724

Scope: measurement-only coherent bundle. Direct user instruction explicitly
requires restoring and tuning all three installed analytics counters, then
redeploying and running exactly 100 agents.

| Contract | Status | Evidence |
|---|---|---|
| `#registration-form` remains | pass | `tests/site-contract.test.mjs` |
| `action="api/submit.php"` remains | pass | `tests/site-contract.test.mjs` |
| `name`, `phone`, `email` remain | pass | `tests/site-contract.test.mjs` |
| `api/visit.php` remains in `<head>` | pass | `tests/site-contract.test.mjs` |
| Three `.btn-register` controls remain | pass | `tests/site-contract.test.mjs` |
| `.pricing-section`, `.program-module`, `.program-list` remain | pass | static source check |
| Protected `api/**` and `sql/schema.sql` unchanged | pass | Git diff scope |
| Browser bundle rebuilt from source | pass | `npm run build` |
| Analytics contract is valid | pass | AJV draft-2020 validation |
| Analytics cannot receive form PII | pass | allowlist schema + dispatcher tests |
| Replay tooling masks the contact form | pass | markup contract test |
| Provider failure cannot break registration | pass | dispatcher isolation test |
| GA4/Yandex/Amplitude dashboard goals exist | blocked | provider authentication required |
| External redeploy/simulator mutation | blocked | preflight is not yet allowed |

Validation at this checkpoint: `npm test` — 14/14 pass; `git diff --check` —
pass. No production mutation is allowed until `preflight.json` confirms panel
authentication and read access to all three analytics sources.
