#!/usr/bin/env python3
"""Read-only Yandex Metrica Stat API exporter for CFO analytics."""
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

API_URL = "https://api-metrika.yandex.net/stat/v1/data"

PRESETS = {
    "traffic": {
        "metrics": ["ym:s:visits", "ym:s:users", "ym:s:bounceRate"],
        "dimensions": ["ym:s:lastsignTrafficSource", "ym:s:lastsignSourceEngine"],
    },
    "utm": {
        "metrics": ["ym:s:visits", "ym:s:users", "ym:s:goalReachesAny"],
        "dimensions": ["ym:s:UTMSource", "ym:s:UTMMedium", "ym:s:UTMCampaign"],
    },
    "ecommerce": {
        "metrics": ["ym:s:ecommercePurchases", "ym:s:ecommerceRevenue"],
        "dimensions": ["ym:s:lastsignTrafficSource", "ym:s:UTMSource", "ym:s:UTMCampaign"],
    },
    "finance-summary": {
        "metrics": [
            "ym:s:visits",
            "ym:s:users",
            "ym:s:goalReachesAny",
            "ym:s:ecommercePurchases",
            "ym:s:ecommerceRevenue",
        ],
        "dimensions": ["ym:s:lastsignTrafficSource", "ym:s:UTMSource", "ym:s:UTMCampaign"],
    },
    "landing-pages": {
        "metrics": [
            "ym:s:visits",
            "ym:s:users",
            "ym:s:bounceRate",
            "ym:s:pageDepth",
            "ym:s:avgVisitDurationSeconds",
            "ym:s:goalReachesAny",
        ],
        "dimensions": ["ym:s:startURL", "ym:s:lastsignTrafficSource", "ym:s:deviceCategory"],
    },
    "exit-pages": {
        "metrics": [
            "ym:s:visits",
            "ym:s:users",
            "ym:s:bounceRate",
            "ym:s:pageDepth",
            "ym:s:avgVisitDurationSeconds",
            "ym:s:goalReachesAny",
        ],
        "dimensions": ["ym:s:endURL", "ym:s:startURL", "ym:s:deviceCategory"],
    },
    "content-engagement": {
        "metrics": [
            "ym:s:visits",
            "ym:s:users",
            "ym:s:pageviews",
            "ym:s:bounceRate",
            "ym:s:pageDepth",
            "ym:s:avgVisitDurationSeconds",
            "ym:s:goalReachesAny",
        ],
        "dimensions": ["ym:s:startURL", "ym:s:lastsignTrafficSource"],
    },
    "pageviews": {
        "metrics": ["ym:pv:pageviews", "ym:pv:users"],
        "dimensions": ["ym:pv:URL"],
    },
}


def read_token(args: argparse.Namespace) -> str | None:
    if args.dry_run:
        return None
    if args.token_file:
        return Path(args.token_file).expanduser().read_text(encoding="utf-8").strip()
    token = os.environ.get("YANDEX_METRICA_TOKEN")
    if token:
        return token.strip()
    return None


def build_query(args: argparse.Namespace) -> dict[str, str]:
    if args.preset == "goals":
        if not args.goal_id:
            raise SystemExit("preset goals requires at least one --goal-id")
        metrics: list[str] = []
        for goal_id in args.goal_id:
            safe_goal = "".join(ch for ch in str(goal_id) if ch.isdigit())
            if not safe_goal:
                raise SystemExit(f"invalid goal id: {goal_id}")
            metrics.extend([f"ym:s:goal{safe_goal}reaches", f"ym:s:goal{safe_goal}conversionRate"])
        dimensions = ["ym:s:lastsignTrafficSource", "ym:s:UTMSource", "ym:s:UTMCampaign"]
    else:
        preset = PRESETS[args.preset]
        metrics = list(preset["metrics"])
        dimensions = list(preset["dimensions"])

    if args.metrics:
        metrics = args.metrics.split(",")
    if args.dimensions:
        dimensions = args.dimensions.split(",")

    return {
        "ids": str(args.counter_id),
        "date1": args.date1,
        "date2": args.date2,
        "metrics": ",".join(metrics),
        "dimensions": ",".join(dimensions),
        "limit": str(args.limit),
        "accuracy": args.accuracy,
    }


def fetch_json(query: dict[str, str], token: str) -> dict[str, Any]:
    url = API_URL + "?" + urllib.parse.urlencode(query)
    request = urllib.request.Request(url, headers={"Authorization": f"OAuth {token}"})
    with urllib.request.urlopen(request, timeout=60) as response:  # noqa: S310 - controlled API URL
        payload = response.read().decode("utf-8")
    return json.loads(payload)


def flatten_rows(payload: dict[str, Any]) -> tuple[list[str], list[list[Any]]]:
    query = payload.get("query", {})
    dim_names = list(query.get("dimensions", []))
    metric_names = list(query.get("metrics", []))
    headers = dim_names + metric_names
    rows: list[list[Any]] = []
    for item in payload.get("data", []):
        dims = [d.get("name", d.get("id", "")) for d in item.get("dimensions", [])]
        metrics = item.get("metrics", [])
        rows.append(dims + metrics)
    return headers, rows


def write_outputs(payload: dict[str, Any], out_dir: Path, basename: str) -> dict[str, str]:
    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / f"{basename}.json"
    csv_path = out_dir / f"{basename}.csv"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    headers, rows = flatten_rows(payload)
    with csv_path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    return {"json": str(json_path), "csv": str(csv_path), "rows": str(len(rows))}


def main() -> int:
    parser = argparse.ArgumentParser(description="Export Yandex Metrica reports to local CSV/JSON.")
    parser.add_argument("--counter-id", required=True)
    parser.add_argument("--date1", required=True)
    parser.add_argument("--date2", required=True)
    parser.add_argument("--preset", choices=[*PRESETS.keys(), "goals"], default="finance-summary")
    parser.add_argument("--goal-id", action="append", help="Goal id; repeat for multiple goals")
    parser.add_argument("--metrics", help="Comma-separated custom metrics override")
    parser.add_argument("--dimensions", help="Comma-separated custom dimensions override")
    parser.add_argument("--limit", type=int, default=100000)
    parser.add_argument("--accuracy", default="full", choices=["low", "medium", "high", "full"])
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--token-file")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    query = build_query(args)
    if args.dry_run:
        safe_url = API_URL + "?" + urllib.parse.urlencode(query)
        print(json.dumps({"dry_run": True, "url": safe_url, "query": query}, ensure_ascii=False, indent=2))
        return 0

    token = read_token(args)
    if not token:
        raise SystemExit("Missing token: set YANDEX_METRICA_TOKEN or pass --token-file")

    payload = fetch_json(query, token)
    basename = f"metrica_{args.counter_id}_{args.preset}_{args.date1}_{args.date2}"
    result = write_outputs(payload, Path(args.out_dir), basename)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
