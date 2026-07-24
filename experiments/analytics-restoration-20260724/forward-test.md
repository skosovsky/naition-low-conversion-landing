# Updated skill forward-test

Independent subagent, local files only; no MCP, network, browser, UI or file
changes.

## Iteration 1 — FAIL

The agent correctly refused completion because `manifest.json` was missing and
the checksum path format was incompatible with the validator.

## Iteration 2 — FAIL

After those fixes, the agent found two integrity gaps:

- locale-dependent skill hash ordering did not match the written contract;
- server/leaderboard normalized inputs had no SHA-256 lineage.

## Iteration 3 — PASS

- validator: `ok: analytics-restoration-20260724`;
- independently recomputed bytewise skill hash:
  `sha256:43c96818ab58292f4baaebcd9a36cd3435f65167dd9761e68a06d6b701b3ee61`;
- raw checksums: `5/5`;
- normalized lineage: Amplitude `2/2`, GA4 `2/2`, Yandex `1/1`,
  server `1/1`, leaderboard `1/1`;
- no remaining contract failure.
