import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("analytics/webvisor-20260717-20260723/visits");
const files = fs.readdirSync(dataDir).filter((name) => name.endsWith(".json")).sort();

const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const percentile = (values, p) => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const describe = (values) => {
  if (values.length === 0) {
    return { n: 0, min: null, p25: null, median: null, p75: null, p90: null, p95: null, max: null, mean: null };
  }
  return {
    n: values.length,
    min: round(Math.min(...values)),
    p25: round(percentile(values, 0.25)),
    median: round(percentile(values, 0.5)),
    p75: round(percentile(values, 0.75)),
    p90: round(percentile(values, 0.9)),
    p95: round(percentile(values, 0.95)),
    max: round(Math.max(...values)),
    mean: round(values.reduce((sum, value) => sum + value, 0) / values.length),
  };
};

const histogram = (values, buckets) => {
  const result = [];
  let lower = 0;
  for (const upper of buckets) {
    const n = values.filter((value) => value >= lower && value < upper).length;
    result.push({ range: `${lower}–<${upper}`, n, pct: round((n / values.length) * 100) });
    lower = upper;
  }
  const n = values.filter((value) => value >= lower).length;
  result.push({ range: `${lower}+`, n, pct: round((n / values.length) * 100) });
  return result;
};

const parseEvent = (entry) => {
  // Funnel metrics need only page snapshots and user events. Mutation payloads are
  // large and are intentionally not treated as an analytics source.
  if (entry.group !== "event" && entry.group !== "page") return null;
  try {
    return JSON.parse(entry.data);
  } catch {
    return null;
  }
};

const selectorFor = (node, nodes, seen = new Set()) => {
  if (!node) return "unknown";
  if (seen.has(node.id)) return node.name ?? "unknown";
  seen.add(node.id);
  const attrs = node.attributes ?? {};
  if (attrs.id) return `#${attrs.id}`;
  if (attrs.name) return `${node.name}[name="${attrs.name}"]`;
  if (attrs.class) {
    const classes = attrs.class.split(/\s+/).filter(Boolean).slice(0, 3);
    if (classes.length > 0) return `${node.name}.${classes.join(".")}`;
  }
  const parent = nodes.get(node.parent);
  if (parent && parent.name !== "html" && parent.name !== "body") {
    return `${selectorFor(parent, nodes, seen)} > ${node.name}`;
  }
  return node.name;
};

const isFormControl = (node) => ["input", "textarea", "select"].includes(node?.name);

const records = [];
const invalidFiles = [];
const schemaErrors = [];
const visitIds = new Map();
const eventTypes = new Map();
const eventGroups = new Map();
const clickSelectors = new Map();
const inputSelectors = new Map();
let invalidEncodedEventPayloads = 0;
let encodedPayloadsChecked = 0;
const invalidDateTimes = [];

for (const file of files) {
  const absolute = path.join(dataDir, file);
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch (error) {
    invalidFiles.push({ file, error: error.message });
    continue;
  }

  const errors = [];
  if (typeof raw.visit_id !== "string" || raw.visit_id.length === 0) errors.push("visit_id missing/not string");
  if (raw.status !== "exported") errors.push(`status=${JSON.stringify(raw.status)}`);
  if (!raw.metadata || typeof raw.metadata !== "object") errors.push("metadata missing/not object");
  if (!raw.provenance || typeof raw.provenance !== "object") errors.push("provenance missing/not object");
  if (!raw.responses || typeof raw.responses !== "object") errors.push("responses missing/not object");
  for (const key of ["getVisitInfo", "getCalculatedVisitInfo", "fetchHit"]) {
    if (!Array.isArray(raw.responses?.[key])) errors.push(`responses.${key} missing/not array`);
  }
  if (path.basename(file, ".json") !== raw.visit_id) errors.push("filename does not match visit_id");
  if (raw.metadata?.["ym:s:visitID"] !== raw.visit_id) errors.push("metadata ym:s:visitID does not match visit_id");
  if (errors.length > 0) schemaErrors.push({ file, visitId: raw.visit_id ?? null, errors });

  const id = raw.visit_id;
  visitIds.set(id, (visitIds.get(id) ?? 0) + 1);

  const hits = (raw.responses?.fetchHit ?? []).map((item) => item?.result?.data).filter(Boolean);
  const entries = hits.flatMap((hit) => Array.isArray(hit.events) ? hit.events : []);
  const nodes = new Map();
  const parsedEntries = [];
  for (const entry of entries) {
    eventGroups.set(entry.group, (eventGroups.get(entry.group) ?? 0) + 1);
    const parsed = parseEvent(entry);
    if (entry.group === "event" || entry.group === "page") {
      encodedPayloadsChecked += 1;
      if (!parsed) invalidEncodedEventPayloads += 1;
    }
    if (!parsed) continue;
    parsedEntries.push({ group: entry.group, stamp: entry.stamp, parsed });
    if (entry.group === "event" && parsed.type) {
      eventTypes.set(parsed.type, (eventTypes.get(parsed.type) ?? 0) + 1);
    }
    if (entry.group === "page" && Array.isArray(parsed.content)) {
      for (const node of parsed.content) nodes.set(node.id, node);
    }
  }

  for (const node of nodes.values()) {
    if (["input", "textarea", "select"].includes(node.name)) {
      const selector = selectorFor(node, nodes);
      inputSelectors.set(selector, (inputSelectors.get(selector) ?? 0) + 1);
    }
  }

  const events = parsedEntries
    .filter((entry) => entry.group === "event")
    .map((entry, index) => ({ ...entry.parsed, order: index }))
    .sort((a, b) => (a.time ?? 0) - (b.time ?? 0) || a.order - b.order);

  const resizeEvents = events.filter((event) => event.type === "resize");
  const pageHeight = Math.max(
    0,
    ...resizeEvents.map((event) => Number(event.meta?.pageHeight) || 0),
    ...hits.map((hit) => Number(hit.documentHeight) || 0),
  );
  const viewportHeight = Math.max(
    0,
    ...resizeEvents.map((event) => Number(event.meta?.height) || 0),
    ...hits.map((hit) => Number(hit.windowHeight) || 0),
  );
  const scrollEvents = events.filter((event) => event.type === "scroll" && event.meta?.page === true);
  const maxScrollY = Math.max(0, ...scrollEvents.map((event) => Number(event.meta?.y) || 0));
  const scrollDepthPct = pageHeight > 0
    ? Math.min(100, ((maxScrollY + viewportHeight) / pageHeight) * 100)
    : null;

  const clickEvents = events.filter((event) => event.type === "click");
  for (const event of clickEvents) {
    const selector = selectorFor(nodes.get(event.target), nodes);
    clickSelectors.set(selector, (clickSelectors.get(selector) ?? 0) + 1);
  }

  const formEvents = events.filter((event) => {
    if (event.type === "submit") return true;
    if (!["focus", "change"].includes(event.type)) return false;
    return isFormControl(nodes.get(event.target));
  });
  const interactionEvents = formEvents.filter((event) => event.type === "focus" || event.type === "change");
  const submitEvents = formEvents.filter((event) => event.type === "submit");
  const durationSec = Math.max(
    0,
    Number(raw.metadata?.["ym:s:visitDurationShort"]) || 0,
    ...hits.map((hit) => Number(hit.duration) || 0),
  );
  const dateTime = raw.metadata?.["ym:s:dateTime"] ?? null;
  if (typeof dateTime !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTime)) {
    invalidDateTimes.push({ file, visitId: id, dateTime });
  }
  const sourceUrls = [...new Set(hits.map((hit) => hit.url ?? hit.sourceUrl).filter(Boolean))];

  const timeline = [];
  const thresholds = [10, 25, 50, 75, 90, 100];
  const emittedThresholds = new Set();
  let runningMax = 0;
  const formStarted = new Set();
  for (const event of events) {
    const atSec = round((event.time ?? 0) / 1000, 3);
    if (event.type === "scroll" && event.meta?.page === true && pageHeight > 0) {
      runningMax = Math.max(runningMax, Number(event.meta?.y) || 0);
      const depth = Math.min(100, ((runningMax + viewportHeight) / pageHeight) * 100);
      for (const threshold of thresholds) {
        if (depth >= threshold && !emittedThresholds.has(threshold)) {
          emittedThresholds.add(threshold);
          timeline.push({
            atSec,
            action: "scroll_depth_reached",
            thresholdPct: threshold,
            scrollY: runningMax,
            viewportBottomDepthPct: round(depth),
          });
        }
      }
    } else if (event.type === "click") {
      const selector = selectorFor(nodes.get(event.target), nodes);
      timeline.push({ atSec, action: "click", selector });
    } else if (event.type === "focus" && isFormControl(nodes.get(event.target))) {
      const selector = selectorFor(nodes.get(event.target), nodes);
      timeline.push({ atSec, action: "form_focus", selector });
    } else if (event.type === "change" && isFormControl(nodes.get(event.target))) {
      const selector = selectorFor(nodes.get(event.target), nodes);
      if (!formStarted.has(selector)) {
        formStarted.add(selector);
        timeline.push({ atSec, action: "form_input_started", selector });
      }
    } else if (event.type === "submit") {
      const formNode = nodes.get(event.meta?.formId);
      timeline.push({
        atSec,
        action: "form_submit",
        selector: selectorFor(formNode, nodes),
        filledFieldCount: Array.isArray(event.meta?.filledDomNodes) ? event.meta.filledDomNodes.length : null,
      });
    }
  }

  records.push({
    file,
    visitId: id,
    dateTime,
    durationSec,
    pageHeight,
    viewportHeight,
    maxScrollY,
    scrollDepthPct: scrollDepthPct == null ? null : round(scrollDepthPct),
    clickCount: clickEvents.length,
    formEventCount: formEvents.length,
    formEventTypeCounts: Object.fromEntries(
      ["focus", "change", "submit"].map((type) => [type, formEvents.filter((event) => event.type === type).length]),
    ),
    interactionStarted: interactionEvents.length > 0,
    converted: submitEvents.length > 0,
    conversionStatus: submitEvents.length > 0
      ? "confirmed"
      : interactionEvents.length > 0
        ? "attempted"
        : "not_attempted",
    submitCount: submitEvents.length,
    sourceUrls,
    fetchHitCount: hits.length,
    rawEventCount: entries.length,
    parsedDomNodeCount: nodes.size,
    timeline,
  });
}

const duplicates = [...visitIds.entries()]
  .filter(([, count]) => count > 1)
  .map(([visitId, count]) => ({ visitId, count }));
const converted = records.filter((record) => record.converted);
const attempted = records.filter((record) => record.conversionStatus === "attempted");
const nonConverted = records.filter((record) => !record.converted);
const dates = records.map((record) => record.dateTime).filter(Boolean).sort();
const sortCounts = (map, limit = null) => {
  const entries = [...map.entries()]
    .map(([name, n]) => ({ name, n }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  return limit == null ? entries : entries.slice(0, limit);
};

const visitFeaturesDir = path.resolve("analytics/visit-features");
const featureStatuses = new Map();
const invalidFeatureFiles = [];
if (fs.existsSync(visitFeaturesDir)) {
  for (const file of fs.readdirSync(visitFeaturesDir).filter((name) => /^\d+\.json$/.test(name)).sort()) {
    try {
      const feature = JSON.parse(fs.readFileSync(path.join(visitFeaturesDir, file), "utf8"));
      featureStatuses.set(feature.metadata?.visit_id ?? path.basename(file, ".json"), feature.conversion?.status ?? null);
    } catch (error) {
      invalidFeatureFiles.push({ file, error: error.message });
    }
  }
}
const rawStatuses = new Map(records.map((record) => [record.visitId, record.conversionStatus]));
const crossCheckMismatches = [...new Set([...rawStatuses.keys(), ...featureStatuses.keys()])]
  .sort()
  .flatMap((visitId) => {
    const rawStatus = rawStatuses.get(visitId) ?? null;
    const featureStatus = featureStatuses.get(visitId) ?? null;
    return rawStatus === featureStatus ? [] : [{ visitId, rawStatus, featureStatus }];
  });

const metricBlock = (metric, buckets) => ({
  summary: describe(records.map((record) => record[metric]).filter((value) => value != null)),
  converted: describe(converted.map((record) => record[metric]).filter((value) => value != null)),
  nonConverted: describe(nonConverted.map((record) => record[metric]).filter((value) => value != null)),
  histogram: histogram(records.map((record) => record[metric]).filter((value) => value != null), buckets),
});

const output = {
  generatedFrom: "raw JSON files under analytics/webvisor-20260717-20260723/visits only",
  definitions: {
    durationSec: "max(metadata ym:s:visitDurationShort, fetchHit.result.data.duration); source values are seconds",
    pageHeight: "maximum resize.meta.pageHeight, falling back to fetchHit.result.data.documentHeight",
    maxScrollY: "maximum page scroll event meta.y",
    scrollDepthPct: "min(100, (maxScrollY + viewportHeight) / pageHeight * 100); viewport-bottom exposure, not raw scrollY/pageHeight",
    clicks: "count of raw Webvisor event.type=click",
    formEvents: "raw focus/change events whose target is a form control, plus submit; blur and ordinary clicks are excluded",
    converted: "at least one raw Webvisor event.type=submit; submit formId resolves to the registration form in every converted visit",
  },
  validation: {
    discoveredJsonFiles: files.length,
    validJsonFiles: records.length,
    invalidJsonFiles: invalidFiles.length,
    invalidFiles,
    schemaIssueFiles: schemaErrors.length,
    schemaErrors,
    uniqueVisitIds: visitIds.size,
    duplicateVisitIds: duplicates,
    encodedPayloadsChecked,
    invalidEncodedEventPayloads,
    filenameVisitIdMatches: schemaErrors.filter((item) => item.errors.includes("filename does not match visit_id")).length === 0,
    metadataVisitIdMatches: schemaErrors.filter((item) => item.errors.includes("metadata ym:s:visitID does not match visit_id")).length === 0,
    invalidDateTimes,
  },
  sourcePeriod: {
    firstVisitDateTime: dates[0] ?? null,
    lastVisitDateTime: dates.at(-1) ?? null,
    days: [...new Set(dates.map((value) => value.slice(0, 10)))],
    visitsByDay: Object.entries(
      records.reduce((acc, record) => {
        const day = record.dateTime?.slice(0, 10) ?? "missing";
        acc[day] = (acc[day] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b)).map(([day, n]) => ({ day, n })),
  },
  schemaProfile: {
    topLevelKeys: ["visit_id", "status", "metadata", "provenance", "responses"],
    responseKeys: ["getVisitInfo", "getCalculatedVisitInfo", "fetchHit"],
    usefulRawFields: [
      "metadata.ym:s:dateTime",
      "metadata.ym:s:visitDurationShort",
      "metadata.ym:s:trafficSource",
      "metadata.ym:s:operatingSystem",
      "metadata.ym:s:browser",
      "responses.fetchHit[].result.data.{duration,documentHeight,windowHeight,url,events}",
      "events[group=page].data.content[] for DOM ids/tags/attributes",
      "events[group=event].data.{time,type,target,meta}",
    ],
    eventGroups: sortCounts(eventGroups),
    eventTypes: sortCounts(eventTypes),
    inputSelectorsByVisitPresence: sortCounts(inputSelectors),
    fetchHitCount: describe(records.map((record) => record.fetchHitCount)),
    rawEventCount: describe(records.map((record) => record.rawEventCount)),
    parsedDomNodeCount: describe(records.map((record) => record.parsedDomNodeCount)),
    visitsMissingPageHeight: records.filter((record) => record.pageHeight <= 0).map((record) => record.visitId),
    visitsWithoutPageSnapshot: records.filter((record) => record.parsedDomNodeCount === 0).map((record) => record.visitId),
    sourceUrls: [...new Set(records.flatMap((record) => record.sourceUrls))].sort(),
  },
  conversion: {
    totalVisits: records.length,
    convertedVisits: converted.length,
    attemptedUnconfirmedVisits: attempted.length,
    notAttemptedVisits: records.filter((record) => record.conversionStatus === "not_attempted").length,
    nonConvertedVisits: nonConverted.length,
    conversionRatePct: round((converted.length / records.length) * 100),
    convertedVisitIds: converted.map((record) => record.visitId),
    attemptedUnconfirmedVisitIds: attempted.map((record) => record.visitId),
    totalSubmitEvents: converted.reduce((sum, record) => sum + record.submitCount, 0),
  },
  funnelReady: {
    definitions: {
      load: "all valid raw visits",
      firstViewport: "maxScrollY >= viewportHeight",
      anyClick: "at least one event.type=click",
      interactionStart: "focus or change on a DOM input/textarea/select",
      attemptedUnconfirmed: "interactionStart without submit",
      converted: "at least one event.type=submit",
    },
    stages: [
      { stage: "load", n: records.length, pctOfLoad: 100 },
      {
        stage: "firstViewport",
        n: records.filter((record) => record.maxScrollY >= record.viewportHeight && record.viewportHeight > 0).length,
        pctOfLoad: round((records.filter((record) => record.maxScrollY >= record.viewportHeight && record.viewportHeight > 0).length / records.length) * 100),
      },
      {
        stage: "anyClick",
        n: records.filter((record) => record.clickCount > 0).length,
        pctOfLoad: round((records.filter((record) => record.clickCount > 0).length / records.length) * 100),
      },
      {
        stage: "interactionStart",
        n: records.filter((record) => record.interactionStarted).length,
        pctOfLoad: round((records.filter((record) => record.interactionStarted).length / records.length) * 100),
      },
      {
        stage: "converted",
        n: converted.length,
        pctOfLoad: round((converted.length / records.length) * 100),
      },
    ],
  },
  visitFeaturesCrossCheck: {
    role: "cross-check only; all reported analytics above are derived from raw JSON",
    directory: "analytics/visit-features",
    featureFiles: featureStatuses.size,
    invalidFeatureFiles,
    statusCounts: sortCounts(
      [...featureStatuses.values()].reduce((map, status) => {
        map.set(status, (map.get(status) ?? 0) + 1);
        return map;
      }, new Map()),
    ),
    mismatches: crossCheckMismatches,
  },
  distributions: {
    durationSec: metricBlock("durationSec", [5, 15, 30, 60, 120, 300]),
    maxScrollY: metricBlock("maxScrollY", [1, 720, 2000, 4000, 6000, 8000]),
    scrollDepthPct: metricBlock("scrollDepthPct", [10, 25, 50, 75, 90, 100]),
    pageHeight: metricBlock("pageHeight", [7000, 8000, 8500, 9000, 10000, 12000]),
    clicks: metricBlock("clickCount", [1, 2, 3, 5, 10, 20]),
    formEvents: metricBlock("formEventCount", [1, 2, 5, 10, 50, 100]),
    topClickSelectors: sortCounts(clickSelectors, 30),
  },
  confirmedVisitsChronology: converted
    .sort((a, b) => (a.dateTime ?? "").localeCompare(b.dateTime ?? "") || a.visitId.localeCompare(b.visitId))
    .map((record) => ({
    status: "confirmed",
    visitId: record.visitId,
    dateTime: record.dateTime,
    durationSec: record.durationSec,
    pageHeight: record.pageHeight,
    viewportHeight: record.viewportHeight,
    maxScrollY: record.maxScrollY,
    scrollDepthPct: record.scrollDepthPct,
    clicks: record.clickCount,
    formEvents: record.formEventTypeCounts,
    submitCount: record.submitCount,
    timeline: record.timeline,
  })),
  attemptedUnconfirmedVisitsChronology: attempted
    .sort((a, b) => (a.dateTime ?? "").localeCompare(b.dateTime ?? "") || a.visitId.localeCompare(b.visitId))
    .map((record) => ({
    status: "attempted",
    visitId: record.visitId,
    dateTime: record.dateTime,
    durationSec: record.durationSec,
    pageHeight: record.pageHeight,
    viewportHeight: record.viewportHeight,
    maxScrollY: record.maxScrollY,
    scrollDepthPct: record.scrollDepthPct,
    clicks: record.clickCount,
    formEvents: record.formEventTypeCounts,
    submitCount: record.submitCount,
    timeline: record.timeline,
  })),
};

console.log(JSON.stringify(output, null, 2));
