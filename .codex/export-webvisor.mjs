#!/usr/bin/env node
/* Export Webvisor players from the currently open Metrica UI. Node 22+, no deps. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CDP = 'http://127.0.0.1:9222';
const COUNTER = '110921681';
const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const concurrency = Math.min(16, Math.max(1, Number(option('--concurrency', 10)) || 10));
const visitLimit = option('--limit', null) == null ? Infinity : Math.max(1, Number(option('--limit', 1)) || 1);
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve(option('--output', path.join(path.dirname(fileURLToPath(import.meta.url)), 'exports', `webvisor-${stamp}`)));
const visitsDir = path.join(output, 'visits');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const json = async (url, init) => { const r = await fetch(url, init); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); };
async function atomic(file, value) { const tmp = `${file}.${process.pid}.${Math.random().toString(16).slice(2)}.tmp`; await fs.writeFile(tmp, typeof value === 'string' ? value : JSON.stringify(value, null, 2)); await fs.rename(tmp, file); }

class Socket {
  constructor(ws) { this.ws = ws; this.next = 1; this.waiters = new Map(); this.listeners = new Set();
    ws.addEventListener('message', e => { const x = JSON.parse(e.data); if (x.id) { const w = this.waiters.get(x.id); if (w) { this.waiters.delete(x.id); x.error ? w.reject(new Error(x.error.message)) : w.resolve(x.result); } } else this.listeners.forEach(f => f(x)); });
  }
  call(method, params = {}) { const id = this.next++; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => this.waiters.set(id, { resolve, reject })); }
  on(f) { this.listeners.add(f); return () => this.listeners.delete(f); }
  close() { this.ws.close(); }
}
async function connect(wsUrl) { const ws = new WebSocket(wsUrl); await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); }); return new Socket(ws); }
async function targets() { return json(`${CDP}/json`); }
function endpoint(url) { return ['getVisitInfo', 'getCalculatedVisitInfo', 'fetchHit'].find(x => url.includes(x)); }
function dateOf(row) { const m = String(row['ym:s:dateTime'] || '').match(/\d{4}-\d{2}-\d{2}/); if (!m) throw new Error('Missing ym:s:dateTime'); return m[0]; }
function visitUrl(row) { const id = row['ym:s:visitID']; const user = row['ym:s:userIDHash']; if (id == null || user == null) throw new Error(`Cannot construct player URL for normalized row ${JSON.stringify(row).slice(0, 400)}`); return `https://metrica.yandex.ru/inpage/visor-proto?id=${COUNTER}&date=${encodeURIComponent(dateOf(row))}&visit_id=${encodeURIComponent(id)}&user_id_hash=${encodeURIComponent(user)}`; }
function visitId(row) { const id = row['ym:s:visitID']; if (id == null) throw new Error('Missing ym:s:visitID'); return String(id); }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k]) => !/^(key|cookie|authorization)$/i.test(k)).map(([k, v]) => [k, redact(v)])); return value; }

async function captureInitialList(tab) {
  const c = await connect(tab.webSocketDebuggerUrl); const requests = new Map(); let found;
  const off = c.on(async e => { if (e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('i-webvisor-data-api/getList')) requests.set(e.params.requestId, e.params.request); if (e.method === 'Network.loadingFinished' && requests.has(e.params.requestId)) { try { const body = await c.call('Network.getResponseBody', { requestId: e.params.requestId }); found = { request: requests.get(e.params.requestId), body: JSON.parse(body.body) }; } catch {} } });
  await c.call('Network.enable'); await c.call('Page.enable'); await c.call('Page.reload', { ignoreCache: false });
  const until = Date.now() + 30000; while (!found && Date.now() < until) await sleep(100); off(); c.close(); if (!found) throw new Error('Did not capture getList after reload'); return found;
}
function listRows(body) { return body.data || body.visits || body.items || body.result?.data || body.result?.visits || []; }
function dimensionId(dimension, index) { return typeof dimension === 'string' ? dimension : dimension?.id || dimension?.dimension || dimension?.name || String(index); }
function normalizeRows(body) {
  const dimensions = body.result?.query?.dimensions || body.query?.dimensions || [];
  return listRows(body).map(row => {
    if (!Array.isArray(row.dimensions)) return row;
    return Object.fromEntries(row.dimensions.map((value, i) => {
      const raw = value?.name ?? value?.raw ?? value?.value ?? value;
      return [dimensionId(dimensions[i], i), raw];
    }));
  });
}
async function fetchPage(tab, request, offset) {
  const contentType = request.headers?.['Content-Type'] || request.headers?.['content-type'] || 'application/x-www-form-urlencoded;charset=UTF-8';
  // `key` is never persisted. The form and its args payload are reconstructed inside the authenticated page.
  const expression = `(() => { const form = new URLSearchParams(${JSON.stringify(request.postData || '')}); const args = JSON.parse(form.get('args')); args[0].offset = ${offset}; args[0].limit = 200; form.set('args', JSON.stringify(args)); return fetch(${JSON.stringify(request.url)}, {method:'POST', credentials:'include', headers:{'content-type':${JSON.stringify(contentType)}}, body:form.toString()}).then(async r => ({status:r.status, text:await r.text()})); })()`;
  const c = await connect(tab.webSocketDebuggerUrl); const r = await c.call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); c.close(); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); const v = r.result.value; if (v.status >= 400) throw new Error(`getList returned ${v.status}`); return JSON.parse(v.text);
}
async function getAllVisits(tab, initial) {
  const rows = [...normalizeRows(initial.body)];
  for (let offset = 201; rows.length < visitLimit; offset += 200) { const page = await fetchPage(tab, initial.request, offset); const part = normalizeRows(page); if (!part.length) break; rows.push(...part); if (part.length < 200) break; }
  return rows.slice(0, visitLimit);
}
async function exportPlayer(row) {
  const id = visitId(row); const file = path.join(visitsDir, `${id}.json`);
  try {
    const existing = JSON.parse(await fs.readFile(file, 'utf8'));
    if (existing.status === 'exported') return { id, status: 'skipped' };
    await fs.unlink(file);
  } catch {}
  // Attach before navigation: Webvisor starts its API requests very early.
  const target = await json(`${CDP}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' }); const c = await connect(target.webSocketDebuggerUrl); const data = {}; let last = Date.now(); const pending = new Map();
  const off = c.on(async e => {
    if (e.method === 'Network.responseReceived') { const name = endpoint(e.params.response.url); if (name) pending.set(e.params.requestId, name); }
    if (e.method === 'Network.loadingFinished' && pending.has(e.params.requestId)) { const name = pending.get(e.params.requestId); pending.delete(e.params.requestId); try { const body = await c.call('Network.getResponseBody', { requestId: e.params.requestId }); (data[name] ||= []).push(JSON.parse(body.body)); last = Date.now(); } catch {} }
  });
  try { await c.call('Network.enable'); await c.call('Page.enable'); await c.call('Page.navigate', { url: visitUrl(row) }); const started = Date.now(); while (Date.now() - started < 60000 && (Date.now() - last < 5000 || !Object.keys(data).length)) await sleep(150); const status = data.fetchHit?.length ? 'exported' : Object.keys(data).length ? 'partial' : 'error'; const record = { visit_id: id, status, metadata: redact(row), provenance: { counter_id: COUNTER, player_url: visitUrl(row), exported_at: new Date().toISOString(), endpoints: Object.keys(data) }, responses: data }; await atomic(file, record); return { id, status, endpoints: Object.keys(data), ...(status === 'error' ? { error: 'fetchHit was not captured' } : {}) }; }
  finally { off(); c.close(); await fetch(`${CDP}/json/close/${target.id}`).catch(() => {}); }
}
async function exportWithRetries(row) {
  let result;
  for (let attempt = 1; attempt <= 3; attempt++) {
    result = await exportPlayer(row);
    if (result.status === 'exported' || result.status === 'skipped') return { ...result, attempts: attempt };
    if (attempt < 3) await sleep(attempt * 1000);
  }
  return { ...result, attempts: 3 };
}
async function main() {
  await fs.mkdir(visitsDir, { recursive: true }); const all = await targets(); const tab = all.find(t => t.type === 'page' && t.url.includes('/stat/visor') && t.url.includes(COUNTER)); if (!tab) throw new Error(`Open Webvisor for counter ${COUNTER} first`);
  const initial = await captureInitialList(tab); const rows = await getAllVisits(tab, initial); const manifest = path.join(output, 'manifest.jsonl'); let manifestQueue = Promise.resolve(); const results = [];
  const appendManifest = record => { manifestQueue = manifestQueue.then(() => fs.appendFile(manifest, `${JSON.stringify(record)}\n`)); return manifestQueue; };
  let cursor = 0; const workers = Array.from({ length: Math.min(concurrency, rows.length) }, async () => { while (cursor < rows.length) { const row = rows[cursor++]; let result; try { result = await exportWithRetries(row); } catch (error) { let id = 'unknown'; try { id = visitId(row); } catch {} result = { id, status: 'error', error: error.message }; } results.push(result); await appendManifest(result); } }); await Promise.all(workers); await manifestQueue;
  const counts = Object.fromEntries(['exported', 'skipped', 'partial', 'error'].map(status => [status, results.filter(result => result.status === status).length])); const summary = { counter_id: COUNTER, exported_at: new Date().toISOString(), output, visits_requested: rows.length, concurrency, ...counts, results: results.length }; await atomic(path.join(output, 'summary.json'), summary); console.log(JSON.stringify(summary, null, 2));
}
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
