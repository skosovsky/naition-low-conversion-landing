# C23 validation

- JSON parse and `git diff --check`: pass.
- Site contract tests: 22/22 pass.
- Frozen Webvisor fan-out: 10 shards, 100 unique visit IDs covered.
- Raw freeze: 124 files, security scan pass, checksum manifest hash recorded
  in `raw/freeze.json`.
- Full skill validator: not applicable to this losing fast-mode iteration
  without generating the optional full normalized/manifest bundle. It reports
  missing `server.json`, `leaderboard.json`, `comparison.json`,
  `skill-review.md`, and `manifest.json`.
- The validator also expects a legacy checksum path format different from the
  append-only C23 freeze. The frozen checksum file is intentionally not
  rewritten after analysis.

The objective explicitly permits the compact artifact contract for losing
fast iterations. Authoritative rejection is independently proven by immutable
server and leaderboard snapshots plus the exact Amplitude funnel.
