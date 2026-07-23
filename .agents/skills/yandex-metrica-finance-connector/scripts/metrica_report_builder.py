#!/usr/bin/env python3
"""Build daily/weekly Yandex Metrica web analytics reports from audit JSON."""
from __future__ import annotations

import argparse
import csv
import html
import json
from collections import Counter
from datetime import date
from pathlib import Path
from typing import Any


def load_audit(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_csv_summary(paths: list[Path]) -> dict[str, Any]:
    rows = 0
    files = []
    headers: Counter[str] = Counter()
    for path in paths:
        if not path.exists():
            continue
        with path.open(newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            count = 0
            for _ in reader:
                count += 1
            rows += count
            files.append({"path": str(path), "rows": count})
            for h in reader.fieldnames or []:
                headers[h] += 1
    return {"rows": rows, "files": files, "headers": sorted(headers)}


def severity_counts(findings: list[dict[str, Any]]) -> Counter[str]:
    return Counter(str(f.get("severity", "unknown")) for f in findings)


def md_report(audit: dict[str, Any], csv_summary: dict[str, Any], period: str, cadence: str, title: str) -> str:
    findings = list(audit.get("findings", []))
    counts = severity_counts(findings)
    lines = [
        f"# {title}",
        "",
        f"- Период: {period}",
        f"- Тип отчета: {cadence}",
        f"- Дата сборки: {date.today().isoformat()}",
        f"- CSV строк обработано: {csv_summary.get('rows', 0)}",
        f"- Сигналы: high={counts.get('high', 0)}, medium={counts.get('medium', 0)}, positive={counts.get('positive', 0)}",
        "",
        "## Итог",
    ]
    high = [f for f in findings if f.get("severity") == "high"]
    if high:
        lines.append(f"Главный риск: {high[0].get('page')} — {high[0].get('issue')}")
    elif findings:
        lines.append(f"Сильных high-рисков нет. Первый сигнал: {findings[0].get('page')} — {findings[0].get('issue')}")
    else:
        lines.append("Сильных сигналов по текущим порогам нет. Нужно расширить период, цели или сегменты.")

    lines += ["", "## Узкие места"]
    for i, f in enumerate(findings[:10], 1):
        m = f.get("metrics", {})
        lines += [
            f"### {i}. {str(f.get('severity', '')).upper()} — {f.get('page', '')}",
            f"- Где: {f.get('kind', '')}",
            f"- Сигнал: {f.get('issue', '')}",
            f"- Что делать: {f.get('action', '')}",
            "- Метрики: "
            f"visits={m.get('visits')}, users={m.get('users')}, pageviews={m.get('pageviews')}, "
            f"bounce={m.get('bounce_rate')}%, depth={m.get('page_depth')}, "
            f"duration={m.get('avg_duration_sec')}s, goals={m.get('goals')}, "
            f"calc_cr={m.get('conversion_rate_calc')}%, source={m.get('traffic_source')}, device={m.get('device')}",
            "",
        ]

    lines += [
        "## Что проверить дальше",
        "- Есть ли корректно настроенные цели: purchase/order, add_to_cart, form_submit, call/click, product_view.",
        "- Отличается ли мобильная конверсия от desktop по тем же landing pages и источникам.",
        "- Есть ли платный трафик на страницы с высоким bounce и низкими целями.",
        "- Какие неожиданные exit pages нужно проверить через Webvisor, карты кликов/скролла и формы.",
        "- Нужно ли соединить Метрику с расходами, маржей и SKU-аналитикой для приоритизации.",
        "",
        "## Ограничения",
        "- Metrica revenue не равна прибыли.",
        "- Без cost/margin/order join нельзя честно считать ROMI/ДРР.",
        "- Выводы по UX требуют проверки Webvisor/форм/скорости/мобильной версии.",
    ]
    return "\n".join(lines).strip() + "\n"


def html_report(markdown: str, title: str) -> str:
    blocks = []
    for line in markdown.splitlines():
        escaped = html.escape(line)
        if line.startswith("# "):
            blocks.append(f"<h1>{html.escape(line[2:])}</h1>")
        elif line.startswith("## "):
            blocks.append(f"<h2>{html.escape(line[3:])}</h2>")
        elif line.startswith("### "):
            blocks.append(f"<h3>{html.escape(line[4:])}</h3>")
        elif line.startswith("- "):
            blocks.append(f"<li>{html.escape(line[2:])}</li>")
        elif line.strip():
            blocks.append(f"<p>{escaped}</p>")
        else:
            blocks.append("")
    body = "\n".join(blocks)
    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>{html.escape(title)}</title>
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 980px; margin: 40px auto; color: #161616; line-height: 1.45; }}
h1 {{ font-size: 28px; margin-bottom: 8px; }}
h2 {{ margin-top: 28px; border-top: 1px solid #ddd; padding-top: 18px; }}
h3 {{ margin-top: 18px; }}
li {{ margin: 5px 0; }}
@media print {{ body {{ margin: 18mm; }} }}
</style>
</head>
<body>
{body}
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Yandex Metrica web analytics markdown/html report.")
    parser.add_argument("--audit-json", required=True)
    parser.add_argument("--csv", nargs="*", default=[])
    parser.add_argument("--period", default="not specified")
    parser.add_argument("--cadence", choices=["daily", "weekly", "ad-hoc"], default="ad-hoc")
    parser.add_argument("--title", default="Yandex Metrica Web Analytics Report")
    parser.add_argument("--md-out", required=True)
    parser.add_argument("--html-out")
    args = parser.parse_args()

    audit = load_audit(Path(args.audit_json))
    summary = load_csv_summary([Path(p) for p in args.csv])
    md = md_report(audit, summary, args.period, args.cadence, args.title)
    Path(args.md_out).write_text(md, encoding="utf-8")
    if args.html_out:
        Path(args.html_out).write_text(html_report(md, args.title), encoding="utf-8")
    print(json.dumps({"md": args.md_out, "html": args.html_out, "csv_rows": summary["rows"]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

