"""Banned-terms lint for the LisN HDFC demo (B4 §8, B7 §4.5).

Scans UI copy in frontend/{app,components,lib}/hdfc-v3 (string literals and JSX text) and the generated data the
screens render. Customer quotes (evidence text) are exempt: they are the customer's words, redacted.

Internal names (follow-up fix 4) come from two files, both read here:
- scripts/lint_terms_candidates.txt (committed, auto-seeded): brief, track and screen IDs, version labels, people named
  in the internal docs, anything the briefs mark internal or confidential;
- scripts/lint_terms_local.txt (gitignored): internal programme names, never committed.
They are checked in V2 UI strings, the generated payloads and, when a build exists, the built V2 pages (RSC payloads
and the client chunks those pages load). Neither file may list the product name or the bank's name.
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
# People's names (bank officers, our team) never appear in UI copy (review finding #3).
PEOPLE = ["Vidya", "Ranjith", "Soumya", "Somya", "Anjani", "Pradeep", "Kartik"]
# Internal brief references, build labels and version names never appear in UI copy.
INTERNAL_REF = re.compile(r"\b(?:B[1-7][ab]?|D-?\d{1,2})\s*§|\bB7\b|MORNING_DECISIONS|first demo|after (?:the )?\w+ call", re.I)
US_SPELLINGS = ["color", "favor", "analyze", "center", "organization"]
# Internal programme names: one per line in scripts/lint_terms_local.txt (gitignored, so the names are never committed;
# copy scripts/lint_terms_local.example.txt). Lines starting with # are comments.
LOCAL = ROOT / "scripts" / "lint_terms_local.txt"
LOCAL_TERMS = (
    [l.strip() for l in LOCAL.read_text(encoding="utf-8").splitlines() if l.strip() and not l.strip().startswith("#")]
    if LOCAL.exists()
    else []
)
BANNED += LOCAL_TERMS

CANDIDATES_FILE = ROOT / "scripts" / "lint_terms_candidates.txt"
NEVER_LISTED = re.compile(r"lisn|hdfc", re.I)  # the product and the bank are named on screen by design


def _terms(path: Path) -> list[str]:
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        t = line.strip()
        if not t or t.startswith("#"):
            continue
        if NEVER_LISTED.search(t):
            raise SystemExit(f"lint_terms: {path.name} lists the product or bank name ({t!r}); remove it")
        out.append(t)
    return out


def _pattern(t: str) -> re.Pattern:
    if t.startswith("re:"):
        return re.compile(t[3:])
    return re.compile(rf"(?<![A-Za-z0-9]){re.escape(t)}(?![A-Za-z0-9])")


CANDIDATES = [(t, _pattern(t)) for t in _terms(CANDIDATES_FILE) + _terms(LOCAL)]

# V2. V1 is kept exactly as first shown and is not linted.
UI_DIRS = [
    ROOT / "frontend" / "app" / "hdfc-pulse" / "v2",
    ROOT / "frontend" / "components" / "hdfc-v3",
    ROOT / "frontend" / "lib" / "hdfc-v3",
]
# Files shared with other demos: checked only for people's names and internal references (the role-based menu lists
# the HDFC roles beside other banks' roles, whose copy follows their own rules).
NAMES_ONLY_FILES = [ROOT / "frontend" / "lib" / "role-based-dashboard" / "registry.tsx"]
DATA_FILES = [
    ROOT / "data" / "seed" / "internal_v3" / "aggregates.json",
    ROOT / "data" / "out" / "app_jul_sep" / "products.json",
    ROOT / "data" / "out" / "app_jul_sep" / "responses.json",
    ROOT / "data" / "out" / "app_jul_sep" / "store_series.json",
    ROOT / "data" / "out" / "app_jul_sep" / "briefing.json",
    ROOT / "data" / "out" / "app_jul_sep" / "ask.json",
    ROOT / "data" / "out" / "app_jul_sep" / "themes.json",
    ROOT / "data" / "out" / "app_jul_sep" / "signals.json",
    ROOT / "data" / "out" / "app_jul_sep" / "meta.json",
    ROOT / "data" / "out" / "app_jul_sep" / "mood.json",
    ROOT / "data" / "out" / "app_jul_sep" / "app_pulse.json",
    ROOT / "data" / "out" / "app_jul_sep" / "periods.json",
]
# Customer voice (quotes, their paraphrased summaries, review titles, asks) is the customer's words, not our copy.
CUSTOMER_VOICE_KEYS = {"redacted_text", "summary", "title", "text", "feature_asks", "asks"}
# Search keywords match what a person types into Ask LisN; they are never shown.
NOT_SHOWN_KEYS = {"keywords"}
# The synthetic internal layer is our own writing, so its summaries and texts are copy and are linted.
SYNTHETIC = str(Path("data") / "seed")
# Code identifiers (snake_case, camelCase, PascalCase with an inner capital, kebab-case paths) are not copy. No word is
# whitelisted: a banned word in rendered text is always a hit. CSS names (color-mix, color-scheme) are code too.
IDENTIFIER = re.compile(r"\b\w+_\w+\b|\b[a-z]+[A-Z]\w*\b|\b[A-Z][a-z]+[A-Z]\w*\b|(?<![\w ])/[\w/-]+|\b\w+(?:-\w+)+\.(?:tsx?|json)\b|Promise<|\bcolor-(?:mix|scheme)\b")

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
    raw = s
    s = IDENTIFIER.sub("", s)
    for t in BANNED:
        # "promise" in every form (promise, promises, promised, promising, re-promise), any case.
        pat = r"(?<![A-Za-z])promis\w*" if t == "promise" else rf"(?<![A-Za-z]){re.escape(t)}(?![A-Za-z])"
        if re.search(pat, s, re.I if t == "promise" else 0):
            hits.append(f"{where}: banned term '{t}' in: {s[:80]}")
    for t in PEOPLE:
        if re.search(rf"(?<![A-Za-z]){t}(?![A-Za-z])", s):
            hits.append(f"{where}: person's name '{t}' in: {s[:80]}")
    if INTERNAL_REF.search(s):
        hits.append(f"{where}: internal reference '{INTERNAL_REF.search(s).group(0)}' in: {s[:80]}")
    # Candidates are whole tokens, so they cannot match inside an identifier; run them before identifiers are stripped
    # so a CamelCase name (e.g. a bank name) is still caught.
    internal_names(raw, where, hits)
    for t in US_SPELLINGS:
        if re.search(rf"\b{t}", s, re.I):
            hits.append(f"{where}: US spelling '{t}' in: {s[:80]}")
    if re.search(r"\$(?!\{)", s):
        hits.append(f"{where}: '$' in copy: {s[:80]}")
    if re.search(r"(?<![!=])!(?![=])", re.sub(r"!\w", "", s)):
        hits.append(f"{where}: '!' in copy: {s[:80]}")


def internal_names(s: str, where: str, hits: list[str]):
    """Candidate and local internal names (follow-up fix 4), matched as whole tokens."""
    for t, p in CANDIDATES:
        m = p.search(s)
        if m:
            hits.append(f"{where}: internal name '{m.group(0)}' ({t}) in: {s[:80]}")


# Built V2 pages: the RSC payloads carry every prop a page renders; the client chunks carry the component copy.
NEXT = ROOT / "frontend" / ".next"
BUILD_PAGES = NEXT / "server" / "app" / "hdfc-pulse" / "v2"
CHUNK_REF = re.compile(r"/_next/(static/chunks/[\w./-]+\.js)")


def _rsc_json(text: str):
    """Each RSC line is `id:payload`; yield the payloads that parse as JSON."""
    for line in text.splitlines():
        head, _, body = line.partition(":")
        if not body or not re.fullmatch(r"[0-9a-f]+", head):
            continue
        try:
            yield json.loads(body)
        except json.JSONDecodeError:
            continue


def _rel(f: Path) -> str:
    return str(f.relative_to(ROOT)) if f.is_relative_to(ROOT) else str(f)


def scan_build(hits: list[str], pages: Path = BUILD_PAGES, next_dir: Path = NEXT) -> int:
    """Internal names in the built V2 pages. Returns the number of files scanned (0 when there is no build).
    Customer-voice keys in the payloads are skipped, as in the data files."""
    if not pages.is_dir():
        return 0
    n, chunks = 0, set()
    for f in sorted(pages.rglob("*")):
        if f.suffix == ".rsc":
            n += 1
            for o in _rsc_json(f.read_text(encoding="utf-8", errors="replace")):
                walk_json(o, _rel(f), hits, names_only=True)
        elif f.suffix == ".html":
            chunks.update(CHUNK_REF.findall(f.read_text(encoding="utf-8", errors="replace")))
    for c in sorted(chunks):
        f = next_dir / c
        if not f.exists():
            continue
        n += 1
        text = f.read_text(encoding="utf-8", errors="replace")
        for s in copy_strings(text):
            if re.search(r"[A-Za-z]{3}", s):
                internal_names(re.sub(r"\$\{[^}]*\}", "", s), _rel(f), hits)
    return n


def walk_json(o, path: str, hits: list[str], names_only: bool = False):
    if isinstance(o, dict):
        for k, v in o.items():
            if (k in CUSTOMER_VOICE_KEYS and not path.startswith(SYNTHETIC)) or k in NOT_SHOWN_KEYS:
                continue
            walk_json(v, f"{path}.{k}", hits, names_only)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk_json(v, f"{path}[{i}]", hits, names_only)
    elif isinstance(o, str) and re.search(r"[A-Za-z]{3}", o):
        if names_only:
            if not o.startswith(("$", "/", "http")):
                internal_names(o, path, hits)
        else:
            check(o, path, hits)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if not LOCAL_TERMS:
        # Not a failure, but never a silent pass: without the list, programme names are not checked.
        print("lint_terms: NOTE internal programme-name list is empty (scripts/lint_terms_local.txt); those names are not checked")
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
    for f in NAMES_ONLY_FILES:
        text = re.sub(r"(?m)^\s*//.*$", "", re.sub(r"/\*[\s\S]*?\*/", "", f.read_text(encoding="utf-8")))
        for s in copy_strings(text):
            for t in PEOPLE:
                if re.search(rf"(?<![A-Za-z]){t}(?![A-Za-z])", s):
                    hits.append(f"{f.relative_to(ROOT)}: person's name '{t}' in: {s[:80]}")
            if INTERNAL_REF.search(s):
                hits.append(f"{f.relative_to(ROOT)}: internal reference in: {s[:80]}")
    for f in DATA_FILES:
        walk_json(json.loads(f.read_text(encoding="utf-8")), str(f.relative_to(ROOT)), hits)
    # IndusInd: the 26 rules of IND-B3 §8 (scripts/lint_indusind.py), on its UI, register, seed, payloads and build.
    import lint_indusind  # noqa: PLC0415

    ind_hits, ind_scanned = lint_indusind.run()
    hits += ind_hits
    print(f"lint_terms: IndusInd rules checked on {ind_scanned} files and pages, "
          f"including {lint_indusind.CRAWLED_ROUTES} rendered routes under /role-based/indusind_bank")
    built = scan_build(hits)
    if not built:
        print("lint_terms: NOTE no V2 build in frontend/.next; built pages not checked")
    for h in hits:
        print(h)
    print(f"lint_terms: {len(hits)} hit(s) ({len(CANDIDATES)} internal-name terms; {built} built files)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
