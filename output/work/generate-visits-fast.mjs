import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const featureDir = path.join(root, "analytics/visit-features");
const outputDir = path.join(root, "output/work/visits");
const map = JSON.parse(fs.readFileSync(path.join(root, "output/landing-map.json"), "utf8"));
const featureFiles = fs.readdirSync(featureDir).filter((name) => /^\d+\.json$/.test(name)).sort();

const sectionIds = {
  hero: "s1",
  about: "s2",
  program: "s3",
  injuries: "s4",
  legal: "s5",
  emotional_photo: "s6",
  instructors: "s7",
  pricing: "s8",
  registration: "s9",
  footer: "s10",
};

const labelForSection = Object.fromEntries(map.sections.map((section) => [section.id, section.label]));
const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};
const clickSelectors = (feature) => (feature.key_actions ?? [])
  .filter((event) => event.type === "click")
  .map((event) => JSON.stringify(event.target ?? []));
const hasFalseAffordanceClick = (feature) => clickSelectors(feature).some((target) =>
  /feature-card|program-module|injury-card/.test(target),
);
const hasPricingCtaClick = (feature) => clickSelectors(feature).some((target) =>
  /btn-register/.test(target),
);

const features = featureFiles.map((name) => {
  const feature = JSON.parse(fs.readFileSync(path.join(featureDir, name), "utf8"));
  const pageHeight = feature.data_quality?.page_height || map.pageHeight;
  const maxScrollY = Math.round((feature.max_scroll_ratio ?? 0) * pageHeight);
  const viewportHeight = feature.data_quality?.viewport?.height
    || feature.pages?.[0]?.viewport?.height
    || map.auditViewport.height;
  const formStarted = Boolean(feature.form_evidence?.submit_or_form_interaction);
  const converted = feature.conversion?.status === "confirmed";
  const attempted = feature.conversion?.status === "attempted";

  let funnelStage = "load";
  if (maxScrollY >= viewportHeight) funnelStage = "first_viewport";
  for (const milestone of map.milestones) {
    if (maxScrollY >= milestone.y) funnelStage = milestone.id;
  }
  if (formStarted) funnelStage = "interaction_start";
  if (converted) funnelStage = "converted";

  return {
    name,
    feature,
    visitId: feature.metadata.visit_id,
    pageHeight,
    maxScrollY,
    viewportHeight,
    durationSec: round((feature.duration_ms ?? 0) / 1000, 1),
    scrollDepthPct: round((feature.max_scroll_ratio ?? 0) * 100, 1),
    formStarted,
    converted,
    attempted,
    funnelStage,
    section: sectionIds[feature.deepest_section] ?? "s1",
  };
});

const lateNonConverted = features.filter((row) =>
  !row.converted && !row.formStarted && ["registration", "footer"].includes(row.feature.deepest_section),
);
const lateDurationMedian = median(lateNonConverted.map((row) => row.durationSec));

const primaryFor = (row) => {
  const commonEvidence = `maxScrollY=${row.maxScrollY}, scrollDepth=${row.scrollDepthPct}%, durationSec=${row.durationSec}, deepestSection=${row.feature.deepest_section}`;

  if (row.converted) return null;
  if (row.formStarted) {
    return {
      label: "Заполнение формы началось, но не завершилось отправкой",
      behavior: "Посетитель дошёл до формы и взаимодействовал с её полями, но подтверждённого submit не зафиксировано.",
      friction: "Следующий ожидаемый шаг — отправка формы — не произошёл после начала ввода.",
      section: "s9",
      funnelStage: "interaction_start",
      evidence: `${commonEvidence}; submit=false; formInteraction=true`,
      suggestedFix: "Сделать ожидания от заявки и следующий шаг понятнее, сохранив текущий контракт полей.",
    };
  }
  if (["registration", "footer"].includes(row.feature.deepest_section)) {
    const pricingCtaClicked = hasPricingCtaClick(row.feature);
    return {
      label: "После выбора тарифа форма осталась незаполненной",
      behavior: pricingCtaClicked
        ? "Посетитель нажал тарифную CTA и перешёл к форме, но не сфокусировался ни на одном поле."
        : "Посетитель дошёл до нижней части страницы и к форме, но не сфокусировался ни на одном поле.",
      friction: "Переход от тарифной CTA к общей форме потерял контекст выбранного тарифа и не привёл к началу заполнения.",
      section: "s9",
      funnelStage: "m7",
      evidence: `${commonEvidence}; pricingCtaClicked=${pricingCtaClicked}; formEvents=0; conversionStatus=not_attempted`,
      suggestedFix: "Сохранить и явно показать контекст выбранного тарифа рядом с формой, объяснив, что произойдёт после заявки.",
    };
  }
  if (row.feature.deepest_section === "pricing") {
    return {
      label: "Тарифы просмотрены, но формат участия не выбран",
      behavior: "Посетитель достиг тарифов, но не перешёл к заполнению формы.",
      friction: "Различия и следующий шаг в тарифных карточках не дали достаточного основания выбрать вариант.",
      section: "s8",
      funnelStage: "m6",
      evidence: `${commonEvidence}; formEvents=0`,
      suggestedFix: "Уточнить назначение тарифов и сделать действие каждой карточки конкретным.",
    };
  }
  if (row.feature.deepest_section === "hero") {
    return {
      label: "Первый экран не дал явного следующего шага",
      behavior: "Посетитель остался в первом экране и не достиг блока с форматом курса или предложением.",
      friction: "На первом экране нет CTA, поэтому после чтения оффера отсутствует очевидное продолжение пути.",
      section: "s1",
      funnelStage: row.funnelStage,
      evidence: `${commonEvidence}; heroCTA=false`,
      suggestedFix: "Добавить на первый экран явный переход к тарифам и короткую строку доверия.",
    };
  }
  return {
    label: "Длинный информационный путь прервал движение к тарифам",
    behavior: `Посетитель прошёл до секции «${labelForSection[row.section]}», но не достиг тарифной CTA и формы.`,
    friction: "До первого конверсионного действия расположено несколько плотных и частично повторяющихся информационных секций.",
    section: row.section,
    funnelStage: row.funnelStage,
    evidence: `${commonEvidence}; pricingReached=false; formEvents=0`,
    suggestedFix: "Сократить плотные описания и раньше обозначить переход к формату участия.",
  };
};

const secondaryFor = (row) => {
  if (row.converted) return [];
  const secondary = [];
  if (
    !row.formStarted
    && ["registration", "footer"].includes(row.feature.deepest_section)
    && row.durationSec > lateDurationMedian
  ) {
    secondary.push({
      label: "Длинный путь до формы накопил трение",
      behavior: "До формы посетитель последовательно прошёл длинные контентные секции.",
      friction: "Объём программы и повторяющихся описаний мог ослабить намерение до момента выбора.",
      section: "s3",
      funnelStage: "m7",
      evidence: `durationSec=${row.durationSec} выше медианы позднего кластера ${lateDurationMedian}; scrollDepth=${row.scrollDepthPct}%`,
      suggestedFix: "Сжать программу до результатов и формата практики, сохранив темы и расписание.",
    });
  }
  if (hasFalseAffordanceClick(row.feature) && secondary.length < 2) {
    secondary.push({
      label: "Статическая карточка выглядела интерактивной",
      behavior: "В визите зафиксирован клик по информационной карточке с pointer/hover-оформлением.",
      friction: "Клик не приводит к действию и создаёт ложное ожидание перед следующим шагом.",
      section: row.section,
      funnelStage: row.funnelStage,
      evidence: `click target содержит feature-card/program-module/injury-card; falseAffordances=${map.falseAffordances.join(", ")}`,
      suggestedFix: "Убрать интерактивный cursor/hover у элементов без обработчика.",
    });
  }
  return secondary;
};

fs.mkdirSync(outputDir, { recursive: true });
const expectedNames = new Set(featureFiles);
for (const existing of fs.readdirSync(outputDir)) {
  if (existing.endsWith(".json") && !expectedNames.has(existing)) {
    fs.unlinkSync(path.join(outputDir, existing));
  }
}

const clusterCounts = new Map();
const stageCounts = new Map();
for (const row of features) {
  const primary = primaryFor(row);
  const secondary = secondaryFor(row);
  if (primary) {
    const key = `${primary.label}|${primary.funnelStage}|${primary.section}`;
    clusterCounts.set(key, (clusterCounts.get(key) ?? 0) + 1);
  }
  stageCounts.set(row.funnelStage, (stageCounts.get(row.funnelStage) ?? 0) + 1);

  const output = {
    visitId: row.visitId,
    conversion: {
      status: row.converted ? "converted" : row.attempted ? "attempted_unconfirmed" : "not_attempted",
      evidence: row.converted
        ? `Raw-validated submit; ${row.feature.conversion?.success_text ?? "success state confirmed"}`
        : row.formStarted
          ? "Есть взаимодействие с полями, подтверждённого submit нет."
          : "Взаимодействие с conversionGoal и submit не зафиксированы.",
    },
    journey: {
      durationSec: row.durationSec,
      maxScrollY: row.maxScrollY,
      scrollDepthPct: row.scrollDepthPct,
      sectionsSeen: (row.feature.sections_seen ?? []).map((name) => sectionIds[name]).filter(Boolean),
      deepestSection: row.section,
      funnelStage: row.funnelStage,
    },
    primary,
    secondary,
    dataQuality: {
      grade: row.feature.data_quality?.has_dom ? "good" : "partial",
      rawEvents: row.feature.data_quality?.raw_events ?? null,
      parsedEvents: row.feature.data_quality?.parsed_events ?? null,
      source: "raw-validated analytics/visit-features derivative",
    },
  };
  fs.writeFileSync(path.join(outputDir, row.name), `${JSON.stringify(output, null, 2)}\n`);
}

const clusterList = [...clusterCounts.entries()]
  .map(([key, n]) => {
    const [label, funnelStage, section] = key.split("|");
    return { label, funnelStage, section, n, pctOfNonConverted: round((n / 502) * 100) };
  })
  .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));

const summary = {
  inputFiles: featureFiles.length,
  generatedFiles: fs.readdirSync(outputDir).filter((name) => name.endsWith(".json")).length,
  totalVisits: features.length,
  converted: features.filter((row) => row.converted).length,
  attemptedUnconfirmed: features.filter((row) => row.attempted).length,
  nonConverted: features.filter((row) => !row.converted).length,
  lateClusterDurationMedianSec: lateDurationMedian,
  stageCounts: Object.fromEntries([...stageCounts.entries()].sort()),
  primaryClusters: clusterList,
  primaryClusterTotal: clusterList.reduce((sum, cluster) => sum + cluster.n, 0),
  checks: {
    allInputsCovered: featureFiles.length === 514,
    generatedCountMatches: fs.readdirSync(outputDir).filter((name) => name.endsWith(".json")).length === featureFiles.length,
    clusterTotalMatchesNonConverted: clusterList.reduce((sum, cluster) => sum + cluster.n, 0) === 502,
  },
};
fs.writeFileSync(path.join(root, "output/work/visits-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
