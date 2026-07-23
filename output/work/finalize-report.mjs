import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "output/hypotheses.md");
const visitsDir = path.join(root, "output/work/visits");
const marker = "<!-- VISIT_APPENDIX -->";
const report = fs.readFileSync(reportPath, "utf8");
const files = fs.readdirSync(visitsDir).filter((name) => /^\d+\.json$/.test(name)).sort();

if (files.length !== 514) {
  throw new Error(`Expected 514 visit files, got ${files.length}`);
}

const rows = files.map((name) => {
  const visit = JSON.parse(fs.readFileSync(path.join(visitsDir, name), "utf8"));
  const label = visit.primary?.label ?? "Подтверждённая конверсия";
  return `| ${visit.visitId} | ${visit.journey.scrollDepthPct.toFixed(1)}% | ${visit.journey.durationSec.toFixed(1)} | ${visit.journey.funnelStage} | ${visit.journey.deepestSection} | ${label} |`;
});

const withoutOldAppendix = report.includes(marker)
  ? report.slice(0, report.indexOf(marker) + marker.length)
  : report.replace(/\n\| \d{15,} \|[\s\S]*$/, "");
const finalized = `${withoutOldAppendix}\n${rows.join("\n")}\n`;
fs.writeFileSync(reportPath, finalized);

const nonConverted = files
  .map((name) => JSON.parse(fs.readFileSync(path.join(visitsDir, name), "utf8")))
  .filter((visit) => visit.conversion.status !== "converted");
const checks = {
  appendixRows: rows.length,
  converted: files.length - nonConverted.length,
  nonConverted: nonConverted.length,
  primaryCount: nonConverted.filter((visit) => visit.primary).length,
  milestoneJargonInPrimaryLabels: nonConverted.filter((visit) => /\bm\d+\b/.test(visit.primary?.label ?? "")).length,
  markerPresent: finalized.includes(marker),
};
console.log(JSON.stringify(checks, null, 2));
