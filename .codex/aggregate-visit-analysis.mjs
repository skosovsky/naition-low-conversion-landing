#!/usr/bin/env node
/**
 * Aggregates PII-safe, per-visit analyses into hypotheses.md.
 * Usage: node .codex/aggregate-visit-analysis.mjs [--allow-partial]
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const allowPartial = process.argv.slice(2).includes('--allow-partial');
const analysisDir = path.join(root, 'analytics/visit-analysis');
const featureDir = path.join(root, 'analytics/visit-features');
const reportFile = path.join(root, 'hypotheses.md');

const statuses = new Set(['confirmed', 'attempted_unconfirmed', 'not_attempted']);
const sections = ['hero', 'about', 'program', 'injuries', 'legal', 'emotional_photo', 'instructors', 'pricing', 'registration', 'footer'];
const sectionNames = {hero:'Первый экран', about:'О курсе', program:'Программа', injuries:'Травмы и состояния', legal:'Юридические аспекты', emotional_photo:'Эмоциональный фотоблок', instructors:'Инструкторы', pricing:'Тарифы', registration:'Форма', footer:'Подвал'};
const hypotheses = {
  hero_no_primary_cta:'На первом экране нет явной CTA-кнопки', hero_value_proposition_mismatch:'Первый экран не убедил продолжить знакомство', date_time_location_mismatch:'Не подошли дата, время или очный формат в Москве', content_too_long_or_dense:'Страница воспринимается слишком длинной или плотной', program_overload:'Детальная программа перегрузила посетителя', insufficient_trust_social_proof:'Недостаточно доверия и социального доказательства', instructor_credibility_insufficient:'Блок инструкторов не снял вопрос компетентности', legal_concern_unresolved:'Юридический блок не снял опасения', pricing_too_high:'Цена могла не соответствовать ожидаемой ценности', pricing_plan_confusion:'Тарифы или различия между ними оказались неясными', pricing_reached_no_cta_click:'Посетитель изучил цены, но не выбрал тариф', form_too_long:'Форма показалась слишком длинной', form_privacy_or_contact_friction:'Запрос контактных данных вызвал трение', purpose_field_friction:'Обязательное поле цели обучения создало трение', form_validation_friction:'Валидация формы помешала отправке', form_technical_failure:'Есть признаки технической ошибки отправки', mobile_usability_friction:'Мобильный интерфейс создал заметное трение', low_intent_or_accidental_visit:'Поведение похоже на визит с низким намерением', comparison_or_research_behavior:'Поведение похоже на исследование или сравнение', returning_internal_or_test_traffic:'Есть признаки внутреннего или тестового визита', cta_clicked_but_abandoned_form:'CTA выбран, но заполнение формы не начато', form_started_but_abandoned:'Заполнение формы начато, но не завершено', early_exit_before_offer:'Посетитель ушёл до тарифов и формы', missing_urgency_or_scarcity:'На глубоком визите не сработал стимул действовать сейчас', missing_faq_or_objection_handling:'После изучения предложения остались неснятые возражения', unknown_insufficient_evidence:'Недостаточно данных для предметной гипотезы'
};
const recommendations = {
  hero_no_primary_cta:'Добавить на первом экране основную CTA-кнопку с прокруткой к форме и понятным действием.', hero_value_proposition_mismatch:'Проверить первый экран: усилить результат курса, формат и следующий шаг.', date_time_location_mismatch:'Вынести дату, время, очный формат и Москву в заметный блок рядом с CTA.', content_too_long_or_dense:'Сократить или свернуть второстепенный контент; поставить CTA после ключевых смысловых блоков.', program_overload:'Сжать программу до результатов модулей и раскрывать детали по требованию.', insufficient_trust_social_proof:'Добавить проверяемые отзывы, кейсы и сигналы доверия рядом с решением о записи.', instructor_credibility_insufficient:'Сделать квалификацию и опыт инструкторов конкретнее и ближе к CTA.', legal_concern_unresolved:'Добавить короткие ответы на юридические вопросы и ссылку на подробности.', pricing_too_high:'Проверить ценностную подачу тарифов и протестировать объяснение состава/выгоды до изменения цены.', pricing_plan_confusion:'Сделать различия тарифов сравнимыми: таблица, рекомендуемый вариант, ясная аудитория каждого.', pricing_reached_no_cta_click:'Добавить явные CTA и краткое объяснение следующего шага непосредственно в тарифах.', form_too_long:'Сократить обязательные поля либо разбить форму на короткие шаги.', form_privacy_or_contact_friction:'Объяснить, зачем нужны контакты, и дать заметную ссылку на обработку данных.', purpose_field_friction:'Сделать цель обучения необязательной или заменить её вариантами выбора.', form_validation_friction:'Показать ошибки рядом с полями и сохранить введённые значения после проверки.', form_technical_failure:'Приоритизировать воспроизведение и исправление отправки; добавить наблюдаемость ошибок формы.', mobile_usability_friction:'Проверить форму и CTA на мобильных viewport: размеры, фокус, клавиатуру и прокрутку.', low_intent_or_accidental_visit:'Сегментировать источники и проверить соответствие рекламного обещания первому экрану.', comparison_or_research_behavior:'Дать сравнимые факты: программа, формат, стоимость, инструкторы и ответы на возражения.', returning_internal_or_test_traffic:'Исключить внутренний и тестовый трафик из продуктовых выводов.', cta_clicked_but_abandoned_form:'После CTA показать короткое ожидание от формы и убрать лишние обязательные шаги.', form_started_but_abandoned:'Измерить отвал по полям и устранить самое частое препятствие.', early_exit_before_offer:'Добавить ранний CTA и сократить путь до тарифов/формы.', missing_urgency_or_scarcity:'Тестировать только правдивый стимул к действию: ближайшая дата, ограничение мест, дедлайн.', missing_faq_or_objection_handling:'Добавить FAQ по стоимости, формату, юридическим вопросам и подготовке.'
};

const jsonFiles = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort() : [];
const readJson = file => { try { return {value: JSON.parse(fs.readFileSync(file, 'utf8'))}; } catch (error) { return {error: error.message}; } };
const pct = (n, total) => total ? `${(n / total * 100).toFixed(1)}%` : '0.0%';
const md = value => String(value ?? '').replace(/[|\r\n]/g, ' ').trim();
const confidenceBand = confidence => confidence >= .75 ? 'high' : confidence >= .45 ? 'medium' : 'low';
const mode = values => { const counts = new Map(); for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1); return [...counts.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || 'unknown'; };
const table = (headers, rows) => [
  `| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`,
  ...(rows.length ? rows.map(row => `| ${row.map(md).join(' | ')} |`) : [`| ${headers.map((_, i) => i === 0 ? 'Нет данных' : '—').join(' | ')} |`])
].join('\n');

function manifestVisitIds() {
  const manifest = path.join(featureDir, 'manifest.jsonl');
  if (!fs.existsSync(manifest)) return {ids: new Set(), invalid: 0, duplicates: 0, source: 'файлы признаков (manifest.jsonl отсутствует)'};
  const ids = new Set(); let invalid = 0, duplicates = 0;
  for (const line of fs.readFileSync(manifest, 'utf8').split(/\r?\n/).filter(Boolean)) {
    try { const row = JSON.parse(line); if (typeof row.visit_id !== 'string' || !row.visit_id.trim()) invalid++; else if (ids.has(row.visit_id)) duplicates++; else ids.add(row.visit_id); } catch { invalid++; }
  }
  return {ids, invalid, duplicates, source: 'analytics/visit-features/manifest.jsonl'};
}

function validateAnalysis(value, file) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {errors:['корень JSON должен быть объектом']};
  const visitId = value.visit_id;
  if (typeof visitId !== 'string' || !visitId.trim()) errors.push('некорректный visit_id');
  if (visitId && path.basename(file, '.json') !== visitId) errors.push('visit_id не совпадает с именем файла');
  const status = value.conversion?.status;
  if (!statuses.has(status)) errors.push('некорректный conversion.status');
  const list = value.dropoff_hypotheses;
  if (!Array.isArray(list)) errors.push('dropoff_hypotheses должен быть массивом');
  else {
    if (list.length > 5) errors.push('больше пяти гипотез');
    const codes = new Set(); let previous = Infinity;
    for (const item of list) {
      if (!item || typeof item !== 'object' || !Object.hasOwn(hypotheses, item.code)) errors.push('неразрешённый код гипотезы');
      else if (codes.has(item.code)) errors.push('дублирующийся код гипотезы'); else codes.add(item.code);
      if (typeof item?.confidence !== 'number' || !Number.isFinite(item.confidence) || item.confidence < .2 || item.confidence > 1) errors.push('confidence вне диапазона 0.20–1.00');
      else if (item.confidence > previous) errors.push('гипотезы не отсортированы по confidence'); else previous = item.confidence;
    }
    if (status === 'confirmed' && list.length) errors.push('у confirmed должны отсутствовать гипотезы');
  }
  return {visitId, errors, value};
}

const manifest = manifestVisitIds();
const featureFiles = jsonFiles(featureDir).filter(name => !['summary.json'].includes(name));
const featureIds = new Set(featureFiles.map(name => path.basename(name, '.json')));
const featuresById = new Map();
for (const name of featureFiles) {
  const parsed = readJson(path.join(featureDir, name));
  if (!parsed.error && parsed.value?.metadata?.visit_id) featuresById.set(String(parsed.value.metadata.visit_id), parsed.value);
}
const expectedIds = manifest.ids.size ? manifest.ids : featureIds;
const duplicateFeatureIds = Math.max(0, featureFiles.length - featureIds.size);
const records = [], invalid = [], duplicateVisitIds = new Set(), seenVisitIds = new Set();
let correctedStatusMismatches = 0;
for (const name of jsonFiles(analysisDir)) {
  const file = path.join(analysisDir, name), parsed = readJson(file);
  if (parsed.error) { invalid.push({file:name, reason:`некорректный JSON: ${parsed.error}`}); continue; }
  const checked = validateAnalysis(parsed.value, file);
  if (checked.errors.length) { invalid.push({file:name, reason:checked.errors.join('; ')}); continue; }
  if (seenVisitIds.has(checked.visitId)) { duplicateVisitIds.add(checked.visitId); continue; }
  const feature = featuresById.get(checked.visitId);
  const expectedStatus = feature?.conversion?.status === 'attempted' ? 'attempted_unconfirmed' : feature?.conversion?.status;
  if (expectedStatus && checked.value.conversion.status !== expectedStatus) correctedStatusMismatches++;
  const canonical = {
    ...checked.value,
    conversion: {...checked.value.conversion, status: expectedStatus || checked.value.conversion.status},
    journey: feature ? {
      ...checked.value.journey,
      duration_s: Math.round((feature.duration_ms || 0) / 100) / 10,
      max_scroll_ratio: feature.max_scroll_ratio,
      deepest_section: feature.deepest_section,
      sections_seen: feature.sections_seen,
      exit_section: feature.exit_section,
    } : checked.value.journey,
  };
  seenVisitIds.add(checked.visitId); records.push(canonical);
}
const missing = [...expectedIds].filter(id => !seenVisitIds.has(id)).sort();
const unexpected = records.filter(record => !expectedIds.has(record.visit_id)).length;
const incomplete = missing.length > 0 || invalid.length > 0 || duplicateVisitIds.size > 0 || manifest.invalid > 0 || manifest.duplicates > 0 || duplicateFeatureIds > 0;
const byStatus = Object.fromEntries([...statuses].map(status => [status, records.filter(record => record.conversion.status === status)]));
const nonConfirmed = records.filter(record => record.conversion.status !== 'confirmed');
const nonConfirmedFeatures = [...featuresById.values()].filter(feature => feature.conversion?.status !== 'confirmed');
const hasPricingCtaClick = feature => (feature.key_actions || []).some(action =>
  action.type === 'click' && (action.target || []).some(target => /(?:^|\s)btn-register(?:\s|$)/.test(target.class || ''))
);
const featureSignals = {
  pricingCtaClicks: nonConfirmedFeatures.filter(hasPricingCtaClick).length,
  earlyExitBeforePricing: nonConfirmedFeatures.filter(feature => Number(feature.max_scroll_ratio) < .793).length,
  reachedPricing: nonConfirmedFeatures.filter(feature => Number(feature.max_scroll_ratio) >= .793).length,
  formInteractions: nonConfirmedFeatures.filter(feature => feature.form_evidence?.submit_or_form_interaction).length,
};

const hypothesisRows = new Map();
for (const record of nonConfirmed) {
  for (const item of record.dropoff_hypotheses || []) {
    const row = hypothesisRows.get(item.code) || {code:item.code, visits:new Set(), score:0, bands:{high:0,medium:0,low:0}, sections:[]};
    if (!row.visits.has(record.visit_id)) { row.visits.add(record.visit_id); row.score += item.confidence; row.bands[confidenceBand(item.confidence)]++; row.sections.push(item.section); }
    hypothesisRows.set(item.code, row);
  }
}
const ranked = [...hypothesisRows.values()].sort((a,b) => b.score - a.score || b.visits.size - a.visits.size || a.code.localeCompare(b.code));
const exitCounts = new Map(); for (const record of nonConfirmed) { const section = record.journey?.exit_section || 'unknown'; exitCounts.set(section, (exitCounts.get(section) || 0) + 1); }
const attempted = byStatus.attempted_unconfirmed;
const attemptedGroups = new Map();
for (const record of attempted) { const section = record.journey?.exit_section || 'unknown'; const group = attemptedGroups.get(section) || {count:0, codes:[]}; group.count++; group.codes.push(...(record.dropoff_hypotheses || []).map(item => item.code)); attemptedGroups.set(section, group); }

const report = [
  '# Гипотезы отказа по визитам',
  '',
  '## Методология и ограничения',
  '',
  `Агрегированы валидные обезличенные результаты из \`analytics/visit-analysis/*.json\`; покрытие сверено с ${manifest.source}. Подтверждённая конверсия — только точное успешное состояние из контракта. Визиты со статусом \`confirmed\` исключены из причин отказа.`,
  '',
  'Гипотезы описывают наблюдаемую связь поведения с возможным трением, а не доказывают причинность. Confidence-weighted score — сумма confidence по уникальным неподтверждённым визитам; это приоритет для проверки, не оценка причинного эффекта. Отчёт не содержит PII, содержимого полей и идентификаторов посетителей.',
  '',
  '## Покрытие и качество данных',
  '',
  table(['Показатель', 'Значение'], [
    ['Визитов в feature manifest', expectedIds.size], ['Валидных анализов', records.length], ['Покрытие', pct(records.length, expectedIds.size)], ['Отсутствуют анализы', missing.length], ['Некорректных analysis JSON/контрактов', invalid.length], ['Дубликатов visit_id в анализах', duplicateVisitIds.size], ['Некорректных строк manifest', manifest.invalid], ['Дубликатов visit_id в manifest', manifest.duplicates], ['Дубликатов feature-файлов', duplicateFeatureIds], ['Анализов вне manifest', unexpected], ['Статусов агентов исправлено по feature-контракту', correctedStatusMismatches], ['Режим неполного покрытия', incomplete ? (allowPartial ? 'разрешён флагом --allow-partial' : 'не разрешён') : 'не требуется']
  ]),
  '',
  '## Статусы конверсии',
  '',
  table(['Статус', 'Визитов', 'Доля валидных анализов'], [
    ['confirmed', byStatus.confirmed.length, pct(byStatus.confirmed.length, records.length)], ['attempted_unconfirmed', attempted.length, pct(attempted.length, records.length)], ['not_attempted', byStatus.not_attempted.length, pct(byStatus.not_attempted.length, records.length)]
  ]),
  '',
  '## Контрольные поведенческие сигналы',
  '',
  'Эти числа рассчитаны напрямую из локальных feature-файлов и служат проверкой агентной интерпретации.',
  '',
  table(['Сигнал', 'Неподтверждённых визитов', 'Доля неподтверждённых'], [
    ['Прямой click по button.btn-register', featureSignals.pricingCtaClicks, pct(featureSignals.pricingCtaClicks, nonConfirmedFeatures.length)],
    ['Достигнут блок тарифов', featureSignals.reachedPricing, pct(featureSignals.reachedPricing, nonConfirmedFeatures.length)],
    ['Уход до блока тарифов', featureSignals.earlyExitBeforePricing, pct(featureSignals.earlyExitBeforePricing, nonConfirmedFeatures.length)],
    ['Есть взаимодействие с формой без подтверждённого success', featureSignals.formInteractions, pct(featureSignals.formInteractions, nonConfirmedFeatures.length)],
  ]),
  '',
  '## Структура лендинга',
  '',
  table(['Порядок', 'Код', 'Раздел'], sections.map((section, index) => [index + 1, section, sectionNames[section]])),
  '',
  '## Ранжированные гипотезы для неподтверждённых визитов',
  '',
  `Основание: ${nonConfirmed.length} валидных неподтверждённых визитов.`,
  '',
  table(['Код', 'Гипотеза', 'Визитов', '% неподтв.', 'Взвешенный score', 'High', 'Medium', 'Low', 'Типичный раздел'], ranked.map(row => [row.code, hypotheses[row.code], row.visits.size, pct(row.visits.size, nonConfirmed.length), row.score.toFixed(2), row.bands.high, row.bands.medium, row.bands.low, sectionNames[mode(row.sections)] || mode(row.sections)])),
  '',
  '## Распределение раздела выхода',
  '',
  table(['Раздел выхода', 'Визитов', '% неподтвёрждённых'], [...exitCounts.entries()].sort((a,b) => b[1] - a[1]).map(([section, count]) => [sectionNames[section] || section, count, pct(count, nonConfirmed.length)])),
  '',
  '## Attempted, но без подтверждения',
  '',
  'Это отдельная когорта: была попытка отправки, но успешное состояние в записи не обнаружено. Отсутствие success-сообщения само по себе не доказывает техническую ошибку.',
  '',
  table(['Раздел выхода', 'Визитов', '% attempted_unconfirmed', 'Наиболее частая гипотеза'], [...attemptedGroups.entries()].sort((a,b) => b[1].count - a[1].count).map(([section, group]) => { const code = mode(group.codes); return [sectionNames[section] || section, group.count, pct(group.count, attempted.length), hypotheses[code] || 'Нет гипотез']; })),
  '',
  '## Рекомендации для проверки',
  '',
  ...(ranked.length ? ranked.slice(0, 5).map((row, index) => `${index + 1}. \`${row.code}\` — ${recommendations[row.code] || 'Сформулировать проверяемое изменение на основании следующей выборки визитов.'}`) : ['Недостаточно валидных гипотез для рекомендаций. Сначала завершите анализ визитов.']),
  '',
  'Перед внедрением зафиксируйте метрики и проведите проверку на новой выборке; изменения не следует выбирать только по этому корреляционному отчёту.',
  ''
].join('\n');

fs.writeFileSync(reportFile, report, 'utf8');
console.log(JSON.stringify({report: path.relative(root, reportFile), feature_manifest_visits: expectedIds.size, valid_analyses: records.length, missing: missing.length, duplicate_visit_ids: duplicateVisitIds.size, invalid: invalid.length, allow_partial: allowPartial}));
if (incomplete && !allowPartial) process.exitCode = 1;
