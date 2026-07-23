#!/usr/bin/env python3
"""Find practical web analytics bottlenecks from Yandex Metrica CSV exports."""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path
from typing import Any


EXPECTED_EXIT_RE = re.compile(r"(thank|success|order|checkout|payment|contacts?|cart|login|logout)", re.I)


def norm_header(value: str) -> str:
    value = value.strip()
    return value.split(":")[-1].lower().replace("_", "")


def to_float(value: Any) -> float:
    if value is None:
        return 0.0
    text = str(value).strip().replace("%", "").replace(",", ".")
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def pick(row: dict[str, str], aliases: list[str]) -> str:
    normalized = {norm_header(k): v for k, v in row.items()}
    for alias in aliases:
        key = norm_header(alias)
        if key in normalized:
            return normalized[key]
    return ""


def pick_float(row: dict[str, str], aliases: list[str]) -> float:
    return to_float(pick(row, aliases))


def classify_file(path: Path, headers: list[str]) -> str:
    name = path.name.lower()
    joined = " ".join(headers).lower()
    if "exit" in name or "endurl" in joined:
        return "exit"
    if "landing" in name or "starturl" in joined:
        return "landing"
    if "pageview" in name or "ym:pv:url" in joined:
        return "pageviews"
    return "generic"


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def page_value(row: dict[str, str], kind: str) -> str:
    if kind == "exit":
        return pick(row, ["ym:s:endURL", "endURL", "URL"])
    if kind == "pageviews":
        return pick(row, ["ym:pv:URL", "URL"])
    return pick(row, ["ym:s:startURL", "startURL", "URL"])


def analyze_row(row: dict[str, str], kind: str, source: str, min_sessions: int) -> list[dict[str, Any]]:
    page = page_value(row, kind) or "(unknown)"
    visits = pick_float(row, ["ym:s:visits", "visits"])
    users = pick_float(row, ["ym:s:users", "ym:pv:users", "users"])
    pageviews = pick_float(row, ["ym:s:pageviews", "ym:pv:pageviews", "pageviews"])
    bounces = pick_float(row, ["ym:s:bounceRate", "bounceRate"])
    page_depth = pick_float(row, ["ym:s:pageDepth", "pageDepth", "avgPageViews"])
    duration = pick_float(row, ["ym:s:avgVisitDurationSeconds", "avgVisitDurationSeconds"])
    goals = pick_float(row, ["ym:s:goalReachesAny", "goalReachesAny"])
    ecommerce = pick_float(row, ["ym:s:ecommercePurchases", "ecommercePurchases"])
    traffic = pick(row, ["ym:s:lastsignTrafficSource", "lastsignTrafficSource", "trafficSource"])
    device = pick(row, ["ym:s:deviceCategory", "deviceCategory"])

    volume = visits or users or pageviews
    conversion_base = visits or users or 0
    conversion_rate = (goals / conversion_base * 100.0) if conversion_base else 0.0
    findings: list[dict[str, Any]] = []

    def add(severity: str, issue: str, action: str, score: float) -> None:
        findings.append(
            {
                "severity": severity,
                "kind": kind,
                "page": page,
                "source_file": source,
                "issue": issue,
                "action": action,
                "score": round(score, 2),
                "metrics": {
                    "visits": visits,
                    "users": users,
                    "pageviews": pageviews,
                    "bounce_rate": bounces,
                    "page_depth": page_depth,
                    "avg_duration_sec": duration,
                    "goals": goals,
                    "ecommerce_purchases": ecommerce,
                    "conversion_rate_calc": round(conversion_rate, 4),
                    "traffic_source": traffic,
                    "device": device,
                },
            }
        )

    if volume < min_sessions:
        return findings

    if kind == "landing":
        if bounces >= 70 and conversion_rate < 1:
            add(
                "high",
                "Высокий входной трафик плохо вовлекается: высокий bounce и почти нет конверсий.",
                "Проверить соответствие оффера источнику, первый экран, скорость, CTA, мобильную версию и цель на странице.",
                volume * (bounces / 100.0 + 1),
            )
        elif bounces >= 55 or page_depth <= 1.3:
            add(
                "medium",
                "Страница входа может терять аудиторию до изучения сайта.",
                "Сравнить по источникам/устройствам, усилить релевантность заголовка и следующий шаг пользователя.",
                volume * 0.7,
            )
        if goals > 0 and conversion_rate >= 5:
            add(
                "positive",
                "Страница входа уже даёт конверсии выше базового ориентира.",
                "Разобрать источник трафика и паттерн страницы; масштабировать на похожие посадочные.",
                volume * conversion_rate / 100.0,
            )

    elif kind == "exit":
        expected_exit = bool(EXPECTED_EXIT_RE.search(page))
        if not expected_exit and bounces >= 50:
            add(
                "high",
                "Неожиданная страница выхода: визиты заканчиваются там, где обычно должен быть следующий шаг.",
                "Проверить контент, ошибки, навигацию, формы, наличие CTA и связку с входной страницей.",
                volume * (bounces / 100.0 + 1),
            )
        elif not expected_exit and duration < 20 and page_depth <= 1.5:
            add(
                "medium",
                "Быстрый выход без глубины просмотра.",
                "Проверить технические проблемы, скорость, мобильный вид и релевантность ожиданию пользователя.",
                volume * 0.6,
            )

    elif kind == "pageviews":
        if pageviews >= min_sessions and users and pageviews / max(users, 1) < 1.2:
            add(
                "medium",
                "Страница получает просмотры, но не удерживает повторное взаимодействие.",
                "Проверить внутренние переходы, блоки рекомендаций, CTA и связку с целевыми страницами.",
                pageviews,
            )

    else:
        if bounces >= 65 and conversion_rate < 1:
            add(
                "medium",
                "Слабая связка трафик -> вовлечение -> цель.",
                "Разложить по странице входа, источнику, устройству и цели; искать провал на первом экране или в CTA.",
                volume,
            )

    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit Yandex Metrica CSV exports for web analytics bottlenecks.")
    parser.add_argument("csv", nargs="+", help="CSV files exported by metrica_export.py")
    parser.add_argument("--min-sessions", type=int, default=30)
    parser.add_argument("--top", type=int, default=20)
    parser.add_argument("--json-out")
    parser.add_argument("--md-out")
    args = parser.parse_args()

    findings: list[dict[str, Any]] = []
    for item in args.csv:
        path = Path(item)
        headers, rows = read_csv(path)
        kind = classify_file(path, headers)
        for row in rows:
            findings.extend(analyze_row(row, kind, str(path), args.min_sessions))

    severity_rank = {"high": 0, "medium": 1, "positive": 2, "low": 3}
    findings.sort(key=lambda x: (severity_rank.get(x["severity"], 9), -x["score"]))
    result = {"findings": findings[: args.top], "total_findings": len(findings)}

    if args.json_out:
        Path(args.json_out).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.md_out:
        lines = ["# Yandex Metrica Web Analytics Audit", ""]
        if not findings:
            lines.append("Нет сильных сигналов при текущих порогах.")
        for i, f in enumerate(findings[: args.top], 1):
            m = f["metrics"]
            lines.append(f"## {i}. {f['severity'].upper()} — {f['page']}")
            lines.append(f"- Сигнал: {f['issue']}")
            lines.append(f"- Что делать: {f['action']}")
            lines.append(
                "- Метрики: "
                f"visits={m['visits']}, users={m['users']}, pageviews={m['pageviews']}, "
                f"bounce={m['bounce_rate']}%, depth={m['page_depth']}, "
                f"duration={m['avg_duration_sec']}s, goals={m['goals']}, "
                f"calc_cr={m['conversion_rate_calc']}%"
            )
            lines.append("")
        Path(args.md_out).write_text("\n".join(lines), encoding="utf-8")

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
