"""Banned-terms lint for the LisN HDFC demo (B4 §8, B7 §4.5).

Scans UI copy in frontend/{app,components,lib}/hdfc-v3 (string literals and JSX text) and the generated data the
screens render. Customer quotes (evidence text) are exempt: they are the customer's words, redacted.

Internal programme names are never committed: add them one per line to scripts/lint_terms_local.txt (gitignored).
Exit code 1 on any hit.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANNED = [
    "HSHF", "HSLF", "LSHF", "LSLF", "NerdWallet", "WalletHub", "Bankrate", "Credit Karma", "Active Cash",
    "Autograph", "Reflect", "Attune", "One Key", "Choice Privileges", "Bilt", "APR", "Vulnerable", "NPS", "FCI",
    "#RewardScam", "#BankAppCrash", "CRITICAL", "takedown", "Vendor Beta", "CompetitorY", "Merchant XYZ",
    "GenBI", "promise",
]
US_SPELLINGS = ["color", "favor", "analyze", "center", "organization"]
LOCAL = ROOT / "scripts" / "lint_terms_local.txt"
if LOCAL.exists():
    BANNED += [l.strip() for l in LOCAL.read_text(encoding="utf-8").splitlines() if l.strip()]

# V2 (after the Vidya call). V1 is kept exactly as first shown and is not linted.
UI_DIRS = [
    ROOT / "frontend" / "app" / "hdfc-pulse" / "v2",
    ROOT / "frontend" / "components" / "hdfc-v3",
    ROOT / "frontend" / "components" / "hdfc-pulse-shared",
    ROOT / "frontend" / "lib" / "hdfc-v3",
]
DATA_FILES = [
    ROOT / "data" / "seed" / "internal_v3" / "aggregates.json",
    ROOT / "data" / "out" / "app_jul_sep" / "products.json",
    ROOT / "data" / "out" / "app_jul_sep" / "responses.json",
    ROOT / "data" / "out" / "app_jul_sep" / "store_series.json",
    ROOT / "data" / "out" / "app_jul_sep" / "briefing.json",
    ROOT / "data" / "out" / "app_jul_sep" / "ask.json",
]
# Code identifiers that legitimately contain a banned word (not rendered).
ALLOW = re.compile(
    r"promise_break|promise_by_request_type|promise_ledger|promiseAnswer|ServicePromise|Re-promise|Promise<|"
    r"repeatInPromise|statusInPromise|service-promise|promise_break_mentions|service promise view"
)

STRING = re.compile(r'"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`')
JSX_TEXT = re.compile(r">\s*([^<>{}\n;=()][^<>{}=;]*?)\s*<")


def copy_strings(text: str):
    for m in STRING.finditer(text):
        s = m.group(1) if m.group(1) is not None else m.group(2)
        if s and " " in s.strip():
            yield s
    for m in JSX_TEXT.finditer(text):
        s = m.group(1)
        if s and re.search(r"[A-Za-z]{3}", s) and " " in s:
            yield s


def check(s: str, where: str, hits: list[str]):
    s = re.sub(r"\$\{[^}]*\}", "", s)  # template expressions are code, not copy
    if ALLOW.search(s):
        s = ALLOW.sub("", s)
    for t in BANNED:
        if re.search(rf"(?<![A-Za-z]){re.escape(t)}(?![A-Za-z])", s, re.I if t in ("promise",) else 0):
            hits.append(f"{where}: banned term '{t}' in: {s[:80]}")
    for t in US_SPELLINGS:
        if re.search(rf"\b{t}", s, re.I):
            hits.append(f"{where}: US spelling '{t}' in: {s[:80]}")
    if re.search(r"\$(?!\{)", s):
        hits.append(f"{where}: '$' in copy: {s[:80]}")
    if re.search(r"(?<![!=])!(?![=])", re.sub(r"!\w", "", s)):
        hits.append(f"{where}: '!' in copy: {s[:80]}")


def walk_json(o, path: str, hits: list[str]):
    if isinstance(o, dict):
        for k, v in o.items():
            walk_json(v, f"{path}.{k}", hits)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk_json(v, f"{path}[{i}]", hits)
    elif isinstance(o, str) and " " in o:
        check(o, path, hits)


def main() -> int:
    hits: list[str] = []
    for d in UI_DIRS:
        for f in sorted(d.rglob("*.ts*")):
            text = f.read_text(encoding="utf-8")
            # Drop comments before extracting copy.
            text = re.sub(r"/\*[\s\S]*?\*/", "", text)
            text = re.sub(r"(?m)^\s*//.*$", "", text)
            for s in copy_strings(text):
                if re.fullmatch(r"[\w\s./:#?&=,-]+", s) and "/" in s:
                    continue  # paths and hrefs
                check(s, str(f.relative_to(ROOT)), hits)
    for f in DATA_FILES:
        walk_json(json.loads(f.read_text(encoding="utf-8")), str(f.relative_to(ROOT)), hits)
    for h in hits:
        print(h)
    print(f"lint_terms: {len(hits)} hit(s)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
