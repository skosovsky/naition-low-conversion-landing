#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const iterationDir = path.resolve(process.argv[2] || '');
const manifestPath = path.join(iterationDir, 'manifest.json');
const errors = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return null;
  }
}

function get(value, dottedPath) {
  return dottedPath.split('.').reduce((current, key) => current?.[key], value);
}

function requireValue(value, dottedPath) {
  const result = get(value, dottedPath);
  if (result === undefined || result === null || result === '') {
    errors.push(`missing ${dottedPath}`);
  }
  return result;
}

function checkMetric(metric, label) {
  if (!metric) return;
  if (!Number.isInteger(metric.numerator) || !Number.isInteger(metric.denominator)) {
    errors.push(`${label}: numerator/denominator must be integers`);
    return;
  }
  if (metric.denominator < 1 || metric.numerator > metric.denominator) {
    errors.push(`${label}: invalid numerator/denominator`);
    return;
  }
  const expected = metric.numerator / metric.denominator * 100;
  if (Math.abs(expected - metric.cr) > 0.01) {
    errors.push(`${label}: cr=${metric.cr} does not match ${expected.toFixed(2)}`);
  }
}

const manifest = readJson(manifestPath);
if (manifest) {
  [
    'schemaVersion',
    'iterationId',
    'comparisonType',
    'hypothesis.id',
    'baseline.commitSha',
    'candidate.commitSha',
    'candidate.deploy.evidenceId',
    'candidate.deploy.remoteSha',
    'candidate.deploy.versionMarker',
    'candidate.deploy.panelResponseSha256',
    'simulator.evidenceId',
    'simulator.panelResponseSha256',
    'cohort.start',
    'cohort.end',
    'skill.versionHash',
    'decision'
  ].forEach(field => requireValue(manifest, field));

  if (manifest.schemaVersion !== '1.0.0') errors.push('unsupported schemaVersion');
  if (manifest.status !== 'completed') errors.push('status must be completed');
  if (!['before_after', 'randomized_ab'].includes(manifest.comparisonType)) {
    errors.push('comparisonType must be before_after or randomized_ab');
  }
  if (manifest.simulator?.requestedVisits !== 100 || manifest.simulator?.observedVisits !== 100) {
    errors.push('simulator must contain exactly 100 requested and observed visits');
  }
  if (manifest.candidate?.commitSha !== manifest.candidate?.deploy?.remoteSha) {
    errors.push('candidate.commitSha must match candidate.deploy.remoteSha');
  }
  if (!['promote', 'revert', 'inconclusive'].includes(manifest.decision)) {
    errors.push('invalid decision');
  }

  checkMetric(manifest.baseline?.metric, 'baseline.metric');
  checkMetric(manifest.candidate?.metric, 'candidate.metric');

  for (const sourceName of ['server', 'yandex', 'ga4', 'amplitude', 'leaderboard']) {
    const source = manifest.analytics?.[sourceName];
    if (!source) {
      errors.push(`missing analytics.${sourceName}`);
      continue;
    }
    if (source.status !== 'ok') errors.push(`analytics.${sourceName}.status must be ok`);
    checkMetric(source.metric, `analytics.${sourceName}.metric`);
    const artifact = source.artifact;
    if (!/^sources\/[a-z0-9._-]+\.json$/.test(artifact || '')) {
      errors.push(`analytics.${sourceName}.artifact must be a safe sources/*.json path`);
      continue;
    }
    if (!fs.existsSync(path.join(iterationDir, artifact))) {
      errors.push(`missing artifact ${artifact}`);
    }
    if (source.window?.start > manifest.cohort?.start || source.window?.end < manifest.cohort?.end) {
      errors.push(`analytics.${sourceName}.window does not cover cohort`);
    }
  }

  const serverArtifact = manifest.analytics?.server?.artifact;
  if (serverArtifact && /^sources\/[a-z0-9._-]+\.json$/.test(serverArtifact)) {
    const server = readJson(path.join(iterationDir, serverArtifact));
    if (server) {
      if (server.piiRedacted !== true) errors.push('server artifact must set piiRedacted=true');
      const ids = server.visitIds;
      if (!Array.isArray(ids) || ids.length !== 100) {
        errors.push('server artifact must contain exactly 100 visitIds');
      } else if (new Set(ids.map(String)).size !== ids.length) {
        errors.push('server artifact contains duplicate visitIds');
      }
    }
  }

  const baselineCr = manifest.baseline?.metric?.cr;
  const candidateCr = manifest.candidate?.metric?.cr;
  if (Number.isFinite(baselineCr) && Number.isFinite(candidateCr)) {
    const delta = candidateCr - baselineCr;
    if (Math.abs(delta - manifest.comparison?.deltaPp) > 0.01) {
      errors.push('comparison.deltaPp does not match candidate-baseline');
    }
  }
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`ok: ${manifest.iterationId}`);
