#!/bin/zsh
set -euo pipefail
unsetopt BG_NICE

script_dir="${0:A:h}"
profile_dir="${script_dir}/chrome-mcp-profile"
chrome_binary="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
log_file="${script_dir}/chrome-mcp.log"
pid_file="${script_dir}/chrome-mcp.pid"

if curl --fail --silent --max-time 1 \
  "http://127.0.0.1:9222/json/version" >/dev/null; then
  print "Chrome MCP is already running at http://127.0.0.1:9222"
  exit 0
fi

singleton_lock="${profile_dir}/SingletonLock"
if [[ -e "${singleton_lock}" || -L "${singleton_lock}" ]]; then
  lock_target="$(readlink "${singleton_lock}" 2>/dev/null || true)"
  lock_pid="${lock_target##*-}"

  if [[ "${lock_pid}" == <-> ]] && ! kill -0 "${lock_pid}" 2>/dev/null; then
    print "Removing stale Chrome MCP lock for dead PID ${lock_pid}"
    rm -f -- \
      "${profile_dir}/SingletonLock" \
      "${profile_dir}/SingletonCookie" \
      "${profile_dir}/SingletonSocket"
  else
    print -u2 "Chrome MCP profile is locked: ${singleton_lock}"
    print -u2 "Existing Chrome PID: ${lock_pid:-unknown}"
    exit 1
  fi
fi

print "Starting isolated Chrome MCP at http://127.0.0.1:9222"
print "Chrome diagnostics: ${log_file}"

nohup "${chrome_binary}" \
  --remote-debugging-address=127.0.0.1 \
  --remote-debugging-port=9222 \
  --user-data-dir="${profile_dir}" \
  --disable-breakpad \
  --disable-component-update \
  --disable-crash-reporter \
  --no-first-run \
  --no-default-browser-check \
  --start-maximized \
  about:blank \
  >>"${log_file}" 2>&1 </dev/null &

chrome_pid=$!
print "${chrome_pid}" >"${pid_file}"

for attempt in {1..50}; do
  if curl --fail --silent --max-time 1 \
    "http://127.0.0.1:9222/json/version" >/dev/null; then
    print "Chrome MCP is ready (PID ${chrome_pid})"
    exit 0
  fi

  if ! kill -0 "${chrome_pid}" 2>/dev/null; then
    print -u2 "Chrome exited before the DevTools endpoint became ready."
    print -u2 "See diagnostics: ${log_file}"
    exit 1
  fi

  sleep 0.1
done

print -u2 "Timed out waiting for Chrome DevTools at http://127.0.0.1:9222"
print -u2 "See diagnostics: ${log_file}"
exit 1
