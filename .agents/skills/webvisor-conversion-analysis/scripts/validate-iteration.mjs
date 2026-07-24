#!/usr/bin/env node

import crypto from 'node:crypto';
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
  if (!metric.denominatorSemantics) {
    errors.push(`${label}: denominatorSemantics is required`);
  }
  const expected = metric.numerator / metric.denominator * 100;
  if (Math.abs(expected - metric.cr) > 0.01) {
    errors.push(`${label}: cr=${metric.cr} does not match ${expected.toFixed(6)}`);
  }
}

function checkArtifact(relativePath, label) {
  if (!/^normalized\/[a-z0-9._-]+\.json$/.test(relativePath || '')) {
    errors.push(`${label}.artifact must be a safe normalized/*.json path`);
    return null;
  }
  const absolutePath = path.join(iterationDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`missing artifact ${relativePath}`);
    return null;
  }
  return readJson(absolutePath);
}

function resolveEvidencePath(relativePath) {
  if (relativePath.startsWith('experiments/')) {
    return path.resolve(iterationDir, '..', '..', relativePath);
  }
  return path.join(iterationDir, relativePath);
}

function checkSourceLineage(sourceArtifact, label) {
  if (!sourceArtifact) return;
  if (!Array.isArray(sourceArtifact.sourceFiles) || sourceArtifact.sourceFiles.length === 0) {
    errors.push(`${label}: sourceFiles with SHA-256 are required`);
    return;
  }
  for (const source of sourceArtifact.sourceFiles) {
    if (!source.path || !/^[0-9a-f]{64}$/.test(source.sha256 || '')) {
      errors.push(`${label}: every sourceFiles entry requires path and sha256`);
      continue;
    }
    const absolutePath = resolveEvidencePath(source.path);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`${label}: missing lineage input ${source.path}`);
      continue;
    }
    const actual = crypto
      .createHash('sha256')
      .update(fs.readFileSync(absolutePath))
      .digest('hex');
    if (actual !== source.sha256) {
      errors.push(`${label}: lineage checksum mismatch for ${source.path}`);
    }
  }
}

function computeSkillHash(relativeSkillPath) {
  const skillRoot = path.resolve(iterationDir, '..', '..', relativeSkillPath);
  const files = [];

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      if (entry.name.startsWith('.') || entry.name.endsWith('~') || entry.name.endsWith('.tmp')) {
        continue;
      }
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
      } else if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  walk(skillRoot);
  const lines = files
    .map(absolutePath => {
      const relativePath = path.relative(skillRoot, absolutePath).split(path.sep).join('/');
      const fileHash = crypto
        .createHash('sha256')
        .update(fs.readFileSync(absolutePath))
        .digest('hex');
      return {relativePath, line: `${fileHash}  ${relativePath}\n`};
    })
    .sort((left, right) => (
      left.relativePath < right.relativePath
        ? -1
        : left.relativePath > right.relativePath
          ? 1
          : 0
    ))
    .map(({line}) => line)
    .join('');

  return `sha256:${crypto.createHash('sha256').update(lines).digest('hex')}`;
}

function checkRawChecksums() {
  const checksumPath = path.join(iterationDir, 'raw', 'checksums.sha256');
  if (!fs.existsSync(checksumPath)) {
    errors.push('missing raw/checksums.sha256');
    return;
  }

  const lines = fs.readFileSync(checksumPath, 'utf8')
    .split('\n')
    .filter(Boolean);
  if (lines.length === 0) {
    errors.push('raw/checksums.sha256 is empty');
  }

  for (const line of lines) {
    const match = line.match(/^([0-9a-f]{64})  ((?:experiments\/[a-z0-9._-]+\/)?raw\/[A-Za-z0-9._-]+)$/);
    if (!match) {
      errors.push(`invalid checksum line: ${line}`);
      continue;
    }
    const [, expected, relativePath] = match;
    const absolutePath = relativePath.startsWith('raw/')
      ? path.join(iterationDir, relativePath)
      : path.resolve(iterationDir, '..', '..', relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`missing checksummed raw artifact ${relativePath}`);
      continue;
    }
    const actual = crypto
      .createHash('sha256')
      .update(fs.readFileSync(absolutePath))
      .digest('hex');
    if (actual !== expected) {
      errors.push(`checksum mismatch for ${relativePath}`);
    }
  }
}

for (const requiredFile of [
  'preflight.json',
  'deploy.json',
  'simulator.json',
  'server.json',
  'leaderboard.json',
  'comparison.json',
  'decision.md',
  'skill-review.md',
]) {
  if (!fs.existsSync(path.join(iterationDir, requiredFile))) {
    errors.push(`missing required artifact ${requiredFile}`);
  }
}

checkRawChecksums();

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
    'skill.previousVersionHash',
    'decision',
  ].forEach(field => requireValue(manifest, field));

  if (manifest.schemaVersion !== '2.0.0') errors.push('unsupported schemaVersion');
  if (manifest.status !== 'completed') errors.push('status must be completed');
  if (!['before_after', 'randomized_ab'].includes(manifest.comparisonType)) {
    errors.push('comparisonType must be before_after or randomized_ab');
  }
  if (
    manifest.simulator?.requestedVisits !== 100
    || manifest.simulator?.successfulVisits !== 100
    || manifest.simulator?.failedVisits !== 0
    || manifest.simulator?.attempts !== 1
  ) {
    errors.push('simulator must attest one attempt with exactly 100 successful visits');
  }
  if (manifest.candidate?.commitSha !== manifest.candidate?.deploy?.remoteSha) {
    errors.push('candidate.commitSha must match candidate.deploy.remoteSha');
  }
  if (!['promote', 'revert', 'inconclusive'].includes(manifest.decision)) {
    errors.push('invalid decision');
  }

  checkMetric(manifest.baseline?.metric, 'baseline.metric');
  checkMetric(manifest.candidate?.metric, 'candidate.metric');

  let hasUnavailableSource = false;
  for (const sourceName of ['server', 'yandex', 'ga4', 'amplitude', 'leaderboard']) {
    const source = manifest.analytics?.[sourceName];
    if (!source) {
      errors.push(`missing analytics.${sourceName}`);
      continue;
    }

    const sourceArtifact = checkArtifact(source.artifact, `analytics.${sourceName}`);
    checkSourceLineage(sourceArtifact, `analytics.${sourceName}`);
    if (source.status === 'available') {
      checkMetric(source.metric, `analytics.${sourceName}.metric`);
      if (!source.freshness) errors.push(`analytics.${sourceName}.freshness is required`);
      if (!source.sampling) errors.push(`analytics.${sourceName}.sampling is required`);
      if (
        source.window?.start > manifest.cohort?.start
        || source.window?.end < manifest.cohort?.end
      ) {
        errors.push(`analytics.${sourceName}.window does not cover cohort`);
      }
    } else if (['unavailable', 'stale'].includes(source.status)) {
      hasUnavailableSource = true;
      if (!source.blocker) errors.push(`analytics.${sourceName}.blocker is required`);
    } else {
      errors.push(`analytics.${sourceName}.status is invalid`);
    }

    if (
      sourceArtifact?.normalizedAt
      && sourceArtifact.sourceFiles?.some(({path: sourcePath}) => {
        const match = sourcePath.match(/\/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z)-/);
        if (!match) return false;
        return sourceArtifact.normalizedAt < match[1].replace(
          /T(\d{2})-(\d{2})-(\d{2})Z$/,
          'T$1:$2:$3Z',
        );
      })
    ) {
      errors.push(`analytics.${sourceName}: normalizedAt predates a raw source`);
    }
  }

  if (hasUnavailableSource && manifest.decision !== 'inconclusive') {
    errors.push('unavailable/stale analytics requires decision=inconclusive');
  }

  if (manifest.skill?.path && manifest.skill?.versionHash) {
    const actualSkillHash = computeSkillHash(manifest.skill.path);
    if (actualSkillHash !== manifest.skill.versionHash) {
      errors.push(
        `skill.versionHash mismatch: expected ${actualSkillHash}, got ${manifest.skill.versionHash}`,
      );
    }
  }

  const server = readJson(path.join(iterationDir, 'normalized', 'server.json'));
  if (server) {
    if (server.piiRedacted !== true) errors.push('normalized server must set piiRedacted=true');
    const ids = server.visitIds;
    const denominator = manifest.analytics?.server?.metric?.denominator;
    if (!Array.isArray(ids) || ids.length !== denominator) {
      errors.push('normalized server visitIds must match server metric denominator');
    } else if (new Set(ids.map(String)).size !== ids.length) {
      errors.push('normalized server contains duplicate visitIds');
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

  const comparison = readJson(path.join(iterationDir, 'comparison.json'));
  if (comparison && comparison.decision !== manifest.decision) {
    errors.push('comparison.decision must match manifest.decision');
  }
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`ok: ${manifest.iterationId}`);
