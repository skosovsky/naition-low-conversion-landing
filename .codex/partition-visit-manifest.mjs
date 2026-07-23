import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const source = process.argv[2] ?? 'analytics/visit-features/manifest.jsonl';
const outputDirectory = process.argv[3] ?? 'analytics/visit-batches';
const batchCount = Number(process.argv[4] ?? 5);
const completedDirectory = process.argv[5];

if (!Number.isInteger(batchCount) || batchCount < 1) {
  throw new Error('batchCount must be a positive integer');
}

let lines = (await readFile(source, 'utf8'))
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (completedDirectory) {
  lines = lines.filter((line) => {
    const { visit_id: visitId } = JSON.parse(line);
    return !existsSync(path.join(completedDirectory, `${visitId}.json`));
  });
}

const batches = Array.from({ length: batchCount }, () => []);
for (const [index, line] of lines.entries()) {
  batches[index % batchCount].push(line);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  batches.map((batch, index) =>
    writeFile(
      path.join(outputDirectory, `batch-${String(index).padStart(2, '0')}.jsonl`),
      `${batch.join('\n')}\n`,
      'utf8',
    ),
  ),
);

console.log(
  JSON.stringify({
    source,
    outputDirectory,
    visits: lines.length,
    batches: batches.map((batch) => batch.length),
  }),
);
