#!/usr/bin/env python3
"""
generate_mock.py — deterministic mock data for the LiSN × KGS Global Commercial Fire demo.

Source of truth: ../05a_Data_Contract.md (types, files, FIXED values, checks),
                 ../02_Requirements_Pain_Value.md (value register V-01…V-14, exec copy),
                 ../04_UX_Screens_Copy_Transitions.md (panel copy and bindings).

* Python 3 standard library only. Seeded: identical output on every run.
* FIXED values are written exactly. GEN values are generated within 05a's constraints.
* All copy passes through tokenise(): brand / platform / firmware / partner / region /
  place names become {{kind:key}} tokens resolvable by anonymise.json. The named
  rendering of every string is identical to the FIXED copy.
* Nothing here is KGS data. Everything is a synthetic scenario.

Usage:  python3 generate_mock.py            -> writes ./data/*.json
        python3 check_mock.py               -> runs the 05a §6 checks, writes check_report.txt
"""
import datetime as dt
import json
import math
import os
import random
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data")
SEED = 20260925
rng = random.Random(SEED)

# ---------------------------------------------------------------------------
# 0. Calendar (05a §1)
# ---------------------------------------------------------------------------
W1 = dt.date(2026, 3, 30)
WEEKS = [{"week": i + 1, "weekStart": (W1 + dt.timedelta(days=7 * i)).isoformat()} for i in range(26)]
MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def week_of(iso_dt: str) -> int:
    d = dt.datetime.fromisoformat(iso_dt.replace("Z", "+00:00")).date()
    return (d - W1).days // 7 + 1


# ---------------------------------------------------------------------------
# 1. anonymise.json (05a §3.2, FIXED)
# ---------------------------------------------------------------------------
def _pairs(d):
    return {k: {"named": v[0], "anon": v[1]} for k, v in d.items()}


ANONYMISE = {
    "brand": _pairs({
        "Edwards": ("Edwards", "Brand A"), "Kidde Commercial": ("Kidde Commercial", "Brand B"),
        "Aritech": ("Aritech", "Brand C"), "EMS": ("EMS", "Brand D"), "GST": ("GST", "Brand E"),
        "AirSense": ("AirSense", "Brand F")}),
    "platform": _pairs({
        "EST4": ("EST4", "Panel platform A"), "EST3/EST3X": ("EST3/EST3X", "Panel platform B"),
        "Edge": ("Edge", "Panel platform C"), "iO": ("iO", "Panel platform D"),
        "Evolve": ("Evolve", "Panel platform E"), "VM/VS": ("VM/VS", "Panel platform F"),
        "2X": ("2X", "Panel platform G"), "FireCell": ("FireCell", "Wireless platform H"),
        "SmartCell": ("SmartCell", "Wireless platform J"),
        "GST panel family": ("GST panel family", "Panel platform K"),
        "AirSense aspirating": ("AirSense aspirating", "Aspirating platform L"),
        "ModuLaser": ("ModuLaser", "Aspirating platform M")}),
    "fw": _pairs({
        "EST4@4.0": ("4.0", "A.4.0"), "EST4@4.1": ("4.1", "A.4.1"), "Edge@3.2": ("3.2", "C.3.2"),
        "2X@7.4": ("7.4", "G.7.4"), "VM/VS@5.1": ("5.1", "F.5.1"),
        "GST panel family@G-7": ("G-7", "K.7")}),
    "partner": _pairs({
        "ESD-SE-02": ("ESD-SE-02", "Partner P-02"), "ESD-SE-07": ("ESD-SE-07", "Partner P-07"),
        "ESD-SE-11": ("ESD-SE-11", "Partner P-11"), "ESD-SE-14": ("ESD-SE-14", "Partner P-14"),
        "ESD-SW-03": ("ESD-SW-03", "Partner P-23"), "ESD-SW-09": ("ESD-SW-09", "Partner P-29"),
        "ESD-SW-12": ("ESD-SW-12", "Partner P-32"), "ESD-CA-04": ("ESD-CA-04", "Partner P-44"),
        "ESD-CA-06": ("ESD-CA-06", "Partner P-46"), "ESD-MW-05": ("ESD-MW-05", "Partner P-55"),
        "DLR-NE-118": ("DLR-NE-118", "Partner P-118"), "DLR-W-044": ("DLR-W-044", "Partner P-144"),
        "DLR-SW-201": ("DLR-SW-201", "Partner P-201"), "DIST-UK-004": ("DIST-UK-004", "Distributor D-04"),
        "DIST-UK-019": ("DIST-UK-019", "Distributor D-19"), "DIST-UK-031": ("DIST-UK-031", "Distributor D-31"),
        "DIST-DE-012": ("DIST-DE-012", "Distributor D-12"), "DIST-NL-007": ("DIST-NL-007", "Distributor D-07")}),
    "region": _pairs({
        "US-SE": ("US-SE", "Region NA-1"), "US-SW": ("US-SW", "Region NA-2"), "Canada": ("Canada", "Region NA-3"),
        "US-NE": ("US-NE", "Region NA-4"), "US-MW": ("US-MW", "Region NA-5"), "US-W": ("US-W", "Region NA-6"),
        "UK-EU": ("UK-EU", "Region EU-1"), "UK": ("UK", "Country EU-a"), "DE": ("DE", "Country EU-b"),
        "NL": ("NL", "Country EU-c"), "FR": ("FR", "Country EU-d"), "APAC": ("APAC", "Region AP-1")}),
    "place": _pairs({
        "Florida": ("Florida", "State 1"), "Texas": ("Texas", "State 2"), "Ontario": ("Ontario", "Province 1"),
        "Georgia": ("Georgia", "State 3"), "Arizona": ("Arizona", "State 4"), "Alabama": ("Alabama", "State 5"),
        "Houston": ("Houston", "Metro 1")}),
    "term": _pairs({
        "partner-portal": ("Kidde FX", "partner portal"), "mobile-app": ("KESMobile", "mobile app"),
        "connected": ("ConnectedSafety+", "connected service")}),
}

# ---------------------------------------------------------------------------
# 2. Tokeniser — raw names in copy -> {{kind:key}}
# ---------------------------------------------------------------------------
TOKEN_RE = re.compile(r"\{\{[a-z]+:[^{}]+\}\}")
_NAMES = []
for _kind in ("brand", "platform", "partner", "region", "place"):
    for _key in ANONYMISE[_kind]:
        _NAMES.append((_key, _kind))
_NAMES.sort(key=lambda kv: -len(kv[0]))
_NAME_KIND = dict(_NAMES)
NAME_RE = re.compile(r"(?<![\w\-/])(" + "|".join(re.escape(n) for n, _ in _NAMES) + r")(?![\w/]|-[A-Z0-9])")
# EST4 firmware versions 4.0 / 4.1 written as plain numbers in copy (never ratios like 4.2×, never 14.0%).
FW_RE = re.compile(r"(?<![\w.@:{])4\.([01])(?!\d|\.\d|×|%|\w)")

# fields that hold identifiers / routes / raw machine values, never display copy
SKIP_KEYS = {"id", "route", "linkTo", "drillRoute", "ref", "versionRaw", "signalId", "displayId", "key",
             "gateId", "evidenceId", "linkedRmaId", "linkedEvidenceId", "investigationId", "defaultOpen",
             "iso", "ts", "startUtc", "routedAt", "firstMentionAt", "chronologyUpdatedAt", "aboveSince",
             "timestampUtc", "returnedDate", "date", "weekStart", "icon", "colour", "style", "anchor",
             # Role-typed fields hold literal Role values (render with roleLabel() in lib/label.ts)
             "owner", "cc", "informed", "approveEnabledFor"}


def _tok_segment(seg: str) -> str:
    seg = NAME_RE.sub(lambda m: "{{%s:%s}}" % (_NAME_KIND[m.group(1)], m.group(1)), seg)
    seg = FW_RE.sub(lambda m: "{{fw:EST4@4.%s}}" % m.group(1), seg)
    return seg


def tokenise_str(s: str) -> str:
    out, pos = [], 0
    for m in TOKEN_RE.finditer(s):
        out.append(_tok_segment(s[pos:m.start()]))
        out.append(m.group(0))
        pos = m.end()
    out.append(_tok_segment(s[pos:]))
    return "".join(out)


def tokenise(obj, key=None, path=""):
    if isinstance(obj, str):
        return obj if key in SKIP_KEYS else tokenise_str(obj)
    if isinstance(obj, list):
        return [tokenise(v, key, path) for v in obj]
    if isinstance(obj, dict):
        res = {}
        for k, v in obj.items():
            p = f"{path}.{k}"
            if p == ".filters.region":           # 05a check 8 exception: filter option values
                res[k] = v
            else:
                res[k] = tokenise(v, k, p)
        return res
    return obj


# ---------------------------------------------------------------------------
# 3. Helpers
# ---------------------------------------------------------------------------
def fix_sum(values, target, lo, hi, protect=()):
    """Nudge integer values by ±1 (inside [lo, hi]) until they sum to target. Deterministic via rng."""
    vals = list(values)
    guard = 0
    while sum(vals) != target:
        guard += 1
        assert guard < 10000, "fix_sum could not converge"
        step = 1 if sum(vals) < target else -1
        idx = [i for i, v in enumerate(vals) if i not in protect and lo <= v + step <= hi]
        i = rng.choice(idx)
        vals[i] += step
    return vals


def largest_remainder(total, shares):
    raw = [total * s for s in shares]
    base = [int(math.floor(r)) for r in raw]
    rem = total - sum(base)
    order = sorted(range(len(raw)), key=lambda i: -(raw[i] - base[i]))
    for i in order[:rem]:
        base[i] += 1
    return base


def r1(x):
    return float(f"{x:.1f}")


def ratio_tone(x):
    return "orange" if x >= 1.5 else ("amber" if x >= 1.2 else None)


SYN = " (synthetic)"
AS_OF_RIGHT = "Data as of 25 Sep 18:00 UTC"
WALL_SUB = "Signals vs own baseline · data as of 25 Sep 2026 18:00 UTC"
WALL_PILL = "Data as of 25 Sep"
INCIDENT_OFF = "Incident flag: Off — no fire event, injury or dispatch mentioned"

# ---------------------------------------------------------------------------
# 4. Time series (05a §5)
# ---------------------------------------------------------------------------
WEEKLY_INTERACTIONS = [8666, 8866, 8766, 8966, 8566, 9066, 9166, 8966, 7600, 9266, 9466, 9866, 11400,
                       8300, 8966, 9266, 9066, 8866, 8965, 9165, 9065, 8765, 8665, 7900, 9265, 9020]

# hero lineage (§5.2)
FW40_PANELS = [6800] * 22 + [6020, 5650, 5580, 5560]
FW40_CONTACTS = [14, 13, 13, 14, 12, 14, 14, 12, 14, 14, 14, 15, 15, 14, 15, 14, 15, 12, 15, 13, 12, 14, 13, 11,
                 11, 11]
# 4.0 weekly rates are derived (contacts ÷ panels × 1,000, 1 dp), never typed in, so every point
# reconciles with its own counts. Headline 2.0 on 4.0 (same 3 weeks, W24–W26) = 33 ÷ 16,790 × 1,000 = 1.97.
FW40_RATE = [r1(c * 1000 / n) for c, n in zip(FW40_CONTACTS, FW40_PANELS)]
FW41_CONTACTS = [1, 5, 9, 8]
FW41_PANELS = [780, 1150, 1220, 1240]
FW41_RATE = [1.3, 4.3, 7.4, 6.5]
RMA_RATE = [0.26, 0.30, 0.27, 0.28, 0.26, 0.26, 0.26, 0.28, 0.28, 0.30, 0.30, 0.28, 0.30, 0.27, 0.30, 0.27, 0.30,
            0.27, 0.28, 0.28, 0.26, 0.26, 0.28, 0.29, 0.26, 0.28]

# lineage monitor (§5.3)
LINEAGE_OTHERS = [
    ("{{platform:Edge}} {{fw:Edge@3.2}} (syn.)", "#38bdf8",
     [1.7, 1.5, 1.5, 1.7, 1.5, 1.7, 1.8, 1.6, 1.6, 1.4, 1.5, 1.8]),
    ("{{platform:2X}} {{fw:2X@7.4}} (syn.)", "#8b5cf6",
     [2.2, 2.2, 2.4, 2.3, 2.4, 2.3, 2.3, 2.3, 2.5, 2.5, 2.2, 2.5]),
    ("{{platform:VM/VS}} {{fw:VM/VS@5.1}} (syn.)", "#14b8a6",
     [1.9, 1.8, 1.6, 1.6, 2.0, 1.6, 1.6, 1.6, 2.0, 2.0, 1.9, 2.0]),
    ("{{platform:GST panel family}} {{fw:GST panel family@G-7}} (syn.)", "#eab308",
     [2.3, 2.0, 2.2, 2.3, 2.3, 2.3, 2.3, 2.0, 2.2, 2.4, 2.3, 2.1]),
]

# D-2 date codes (§5.4)
DC_RATE = [1.2, 1.1, 1.0, 0.9, 1.4, 1.1, 1.0, 0.9, 1.2, 1.4, 4.4, 4.9, 4.7, 4.4, 1.2, 1.2, 1.4, 0.8, 0.9, 0.9, 0.8,
           1.0, 1.1, 0.9, 1.1, 0.8]
SKU_RETURN = [0.22, 0.21, 0.18, 0.19, 0.21, 0.19, 0.21, 0.18, 0.20, 0.21, 0.20, 0.21, 0.22, 0.22, 0.18, 0.20, 0.18,
              0.21, 0.19, 0.19, 0.18, 0.18, 0.19, 0.19, 0.20, 0.21]

# contacts vs RMA (§5.5)
TROUBLE = [284, 302, 311, 271, 291, 272, 302, 309, 299, 293, 269, 272, 313, 271, 273, 310, 283, 307, 301, 302, 308,
           298, 286, 294, 294, 277]
RMAS = [23, 26, 26, 28, 26, 27, 25, 26, 27, 23, 23, 25, 24, 25, 23, 24, 23, 26, 23, 23, 27, 25, 23, 28, 25, 28]

# ESD-SE-07 (§5.6)
FRICTION = [1, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 3, 3, 4, 3, 3, 5, 5, 7, 7, 8, 8]   # W21–W26 Σ 40 vs 13 = 3.08 → 3.1×
BASELINE = [2] * 24 + [3, 2]
SELL_IN = [246, 234, 266, 246, 245, 227, 216, 216, 229, 269, 263, 226, 213, 232, 265, 230, 247, 219, 260, 241, 205,
           198, 190, 186, 182, 176]
SELL_IN_LY = [246, 284, 251, 234, 263, 282, 259, 280, 254, 236, 260, 220, 284, 250, 217, 236, 259, 275, 279, 241,
              278, 251, 255, 276, 265, 255]
CONSEQUENCE_W15_26 = [1.0, 1.1, 0.9, 1.0, 1.1, 1.0, 1.6, 2.1, 2.4, 2.8, 3.0, 3.2]


def gen_daily_interactions():
    """130 working days summing to each fixed weekly total. US holiday Mondays and Good Friday dip."""
    dow = [1.08, 1.04, 1.00, 0.98, 0.90]
    holidays = {dt.date(2026, 4, 3): 0.80, dt.date(2026, 5, 25): 0.75, dt.date(2026, 7, 3): 0.72,
                dt.date(2026, 9, 7): 0.75}
    days = []
    for w, total in enumerate(WEEKLY_INTERACTIONS):
        start = W1 + dt.timedelta(days=7 * w)
        dates = [start + dt.timedelta(days=d) for d in range(5)]
        weights = [dow[i] * holidays.get(d, 1.0) * (1 + rng.uniform(-0.04, 0.04)) for i, d in enumerate(dates)]
        counts = largest_remainder(total, [x / sum(weights) for x in weights])
        for d, c in zip(dates, counts):
            days.append({"date": d.isoformat(), "week": w + 1, "count": c})
    return days


def gen_cutover_series():
    """W1–W22 GEN baselines (05a §5.7), then FIXED W23–W26. Mild quarter-end lift at W13 on remit-to."""
    def base(mean, lo, hi, amp, qe):
        vals = []
        for w in range(22):
            v = mean + amp * math.sin((w + 1) / 26 * 2 * math.pi) + rng.uniform(-2.6, 2.6)
            if w + 1 == 13:
                v += qe
            vals.append(max(lo, min(hi, int(round(v)))))
        return fix_sum(vals, mean * 22, lo, hi, protect=(12,))
    remit = base(30, 26, 34, 1.2, 3) + [55, 80, 82, 81]
    portal = base(22, 19, 25, 0.8, 1) + [51, 74, 76, 75]
    control = base(40, 36, 44, 1.0, 2) + [42, 43, 44, 45]
    return remit, portal, control


def gen_datecode_units():
    units = []
    for i in range(26):
        units.append(int(round(1200 + rng.uniform(-90, 90))))
    window = [int(round(1200 + rng.uniform(-40, 40))) for _ in range(4)]
    window = fix_sum(window, 4800, 1100, 1300)
    units[10:14] = window
    return units


# ---------------------------------------------------------------------------
# 5. Value register (02 §2 verbatim; ** bold removed)
# ---------------------------------------------------------------------------
VALUE_REGISTER = [
    ("V-01", "Hero exposure to date ≈ $12k",
     "Excess contacts = observed 23 − expected on the 4.0 rate (2.0 × 1.24k panels × 3 wks = 7.4) ≈ 16 × $750 fully loaded field cost.", True),
    ("V-02", "Hero projected ≈ $0.15m over 12 weeks if the rollout continues unchanged",
     "Panel-weeks at risk = 1,240 × 12 + 5,560 eligible × 6 (uniform upgrade over 12 wks) = 48,240 × excess rate 4.2 per 1,000 = ~203 excess contacts × $750.", True),
    ("V-03", "Hero contacts avoidable ~140 (≈ $0.1m field cost) if the owner pauses the rollout at week 3",
     "The 5,560 not-yet-upgraded panels' share of V-02: 33,360 panel-weeks × 4.2 per 1,000 ≈ 140 × $750. Decision sits with VP Engineering.", True),
    ("V-04", "Hero lead 21 days",
     "Next scheduled monthly RMA review (7 Oct) − threshold crossing (16 Sep).", False),
    ("V-05", "Date-code field exposure up to $0.35m; 1,900 units containable",
     "Installed units in window = 4,800 − 1,900 in distributor stock = 2,900 × $120. Containable = units still in stock at 11 distributors.", True),
    ("V-06", "Partner sell-in in view $6.4m; sell-in gap ≈ $1.4m / yr if −22% persists; backlog $0.9m",
     "Trailing-12-month sell-in of ESD-SE-07 × 22% decline vs the same weeks last year.", True),
    ("V-07", "Backlog at risk $2.3m (2.4% of ~$95m open backlog); 4 projects with inspections ≤30 days",
     "Sum of open value on the 312 N-3 lines pushed ≥3 weeks ÷ total open backlog.", True),
    ("V-08", "Invoices in dispute £1.1m / 212; DSO +6 days ≈ £1.0m cash tied up",
     "6 ÷ 365 × £60m annual sell-in of the top-10 UK-EU distributors.", True),
    ("V-09", "Cutover excess contacts ~48 / week (≈ $1.2k–2.9k handling per week); ~290 avoidable over 6 weeks if fixed",
     "Pre-cutover baseline 30/wk × (2.7 − 1.1 control change) = 48/wk × 6 wks.", True),
    ("V-10", "Contacts avoidable, total ~430 ($11k–26k handling cost)",
     "V-03 (140) + V-09 (290) × $25–60. Handling cost only. Field cost is shown separately.", True),
    ("V-11", "Median lead vs scheduled review 21 days (5 signals)",
     "Per signal, next scheduled review for the owner's metric − threshold-crossing date: hero 16 Sep→7 Oct (21) · date code 18 Sep→7 Oct (19) · partner 11 Sep→15 Oct QBR (34) · backorder 22 Sep→5 Oct OTIF report (13) · cutover 10 Sep→5 Oct DSO report (25). Median = 21.", False),
    ("V-12", "Look-alikes suppressed 212",
     "Quarter-end / seasonal 74 · how-to after launch (adoption, not fault) 58 · planned test or drill language 41 · same-site recontacts and duplicates 27 · credit hold, routed to AR 12.", False),
    ("V-13", "Governed watch time to owner: W-2 7 min; W-1 chronology moved 19 weeks earlier",
     "W-2: first mention 09:14 UTC → routed 09:21 UTC, 25 Sep. W-1: back-search on 23 Sep found an email coded \"commissioning\" 19 weeks before the 6 Sep mention. Quality decides its significance.", False),
    ("V-14", "Scale anchors (\"How we count\" drawer)",
     "~1,800 interactions / working day · ~9,000 this week · 233,900 in 26 weeks · 18,500 EST4 panels (hero cohort = 6.7%) · ~9,100 RMAs in 26 weeks · ~$95m open backlog · ~3,500 partner accounts.", False),
]

SUPPRESSED = [("Quarter-end / seasonal", 74), ("How-to after launch (adoption, not fault)", 58),
              ("Planned test or drill language", 41), ("Same-site recontacts and duplicates", 27),
              ("Credit hold, routed to AR", 12)]


# ---------------------------------------------------------------------------
# 6. meta.json
# ---------------------------------------------------------------------------
def build_meta():
    return {
        "title": "Global Commercial Fire — Signals this week",
        "category": "Installed-base early warning",
        "promise": "Hear it at the third call, not the monthly review.",
        "descriptor": "The early-warning layer that joins what installers, partners and distributors say to firmware, batch, RMA and order data.",
        "dataAsOf": {"iso": "2026-09-25T18:00:00Z", "label": "Data as of 25 Sep 2026 18:00 UTC"},
        "lastWeekDigest": "2026-09-18T18:00:00Z",
        "badge": "SYNTHETIC SCENARIO — illustrative data, not KGS data",
        "badgeTooltip": "Every figure, firmware version, serial, date code and partner ID on this screen is synthetic. Nothing here is a finding about any KGS product.",
        "footer": "Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved.",
        "breadcrumbs": {
            "/": "Installed-base early warning · Hear it at the third call, not the monthly review.",
            "/installed-base": "Global Commercial Fire · {role} · Installed base · Firmware · Date codes · RMA",
            "/installed-base/signal/fw-4-1": "Global Commercial Fire · {role} · Installed base · {{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)",
            "/channel": "Global Commercial Fire · {role} · Channel · Strategic Partners / ESDs · Backlog",
            "/separation": "Global Commercial Fire · {role} · Separation · Entity · Portal · ERP / EDI · DSO",
        },
        "filters": {
            "brand": ["All", "{{brand:Edwards}}", "{{brand:Kidde Commercial}}", "{{brand:Aritech}}", "{{brand:EMS}}",
                      "{{brand:GST}}", "{{brand:AirSense}}"],
            "region": ["All", "NA", "UK-EU", "MEA", "India", "China", "APAC/AUS", "LatAm"],
            "period": {"value": "26 weeks to 25 Sep 2026", "disabled": ["13 weeks", "52 weeks — Discovery"]},
        },
        "weeks": WEEKS,
        "weeklyInteractions": WEEKLY_INTERACTIONS,
        "dailyInteractions": gen_daily_interactions(),
        "channelMix": {"call": 0.36, "case": 0.22, "email": 0.25, "rma": 0.06, "portal": 0.05, "afterHours": 0.02,
                       "fieldNote": 0.02, "training": 0.01, "other": 0.01},
        "labels": {
            "insightLabel": "LiSN INSIGHT",
            "monitorTitle": "Field Signal Monitor",
            "monitorSubtitle": "Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner.",
            "recommendationLabel": "LiSN suggests · owner decides",
            "wallLabel": "LiSN Signal Wall",
            "diagnosisLabel": "LiSN evidence summary",
            "diagnosisRows": ["Main signal", "What changed", "Decide first"],
            "askButtonTooltip": "Ask LiSN (P2 — canned answers)",
            "illustrativeChip": "ILLUSTRATIVE",
            "confidenceTooltip": "K = joined, verified records. I = text-extracted or imputed. Kept separate on every signal.",
            "joinTagPrefix": "JOINED ON",
        },
        "demo": {
            "introLine": "LiSN is reading 233,900 interactions…",
            "introLine2": "1,640 candidate clusters · 212 suppressed · 5 above threshold",
            "tagline": "Hear it at the third call, not the monthly review.",
            "resetToast": "Demo reset",
            "watermark": "Synthetic scenario — not KGS data",
            "anonymisedChip": "ANONYMISED",
        },
    }


# ---------------------------------------------------------------------------
# 7. Signals (monitor.json + hero)
# ---------------------------------------------------------------------------
def rank_factors(target, fixed):
    """fixed: list of (label, value, weight, score) with the last score solved so Σ weight×score rounds to target."""
    out = [{"label": l, "value": v, "weight": w, "score": s} for l, v, w, s in fixed[:-1]]
    part = sum(w * s for _, _, w, s in fixed[:-1])
    l, v, w, _ = fixed[-1]
    s = round((target - part) / w, 2)
    out.append({"label": l, "value": v, "weight": w, "score": s})
    assert round(sum(f["weight"] * f["score"] for f in out), 2) == target, (target, out)
    return out


GATE_FW41_BRIEF = {
    "id": "gate-fw41-brief", "artefactType": "investigation-brief", "status": "awaiting",
    "title": "Draft investigation brief — awaiting VP Engineering approval", "chip": "Awaiting approval",
    "auditLine": "Drafted by LiSN 16 Sep 06:10 UTC · routed 06:10 · IB-2609-004 (synthetic)",
    "owner": "VP Engineering", "approveEnabledFor": ["VP Engineering"], "approveLabel": "Approve investigation",
    "disabledTooltip": "Approval sits with VP Engineering",
    "onApprove": {
        "title": "Investigation approved by VP Engineering · reproduction on candidate configuration",
        "auditLine": "Approved · investigation opened · audit logged {ts}",
        "openLines": ["Rollout decision: pending — VP Engineering",
                      "LiSN keeps watching: the 4.1 rate is re-measured daily against 4.0."],
        "chip": "Investigation approved",
        "toast": {"title": "Investigation opened",
                  "body": "Approved by VP Engineering · audit logged {ts} · nothing sent outside LiSN"},
        "auditEntry": "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)",
        "investigationId": "INV-2609-031",
    },
    "onApproveSecondary": {"gateId": "gate-fw41-kin", "title": "Awaiting VP Service & Tech Support approval — not sent"},
    "decisionRequest": {"buttonLabel": "Ask VP Engineering for a decision", "doneLabel": "Decision requested",
                        "chip": "Decision requested by President",
                        "auditEntry": "{ts} · President requested a decision from VP Engineering"},
}
GATE_FW41_KIN = {
    "id": "gate-fw41-kin", "artefactType": "known-issue-note", "status": "not_sent",
    "title": "Draft known-issue note for tech-support agents — not sent", "chip": "Not sent",
    "owner": "VP Service & Tech Support", "approveEnabledFor": ["VP Service & Tech Support"],
    "disabledTooltip": "Approval sits with VP Service & Tech Support",
}

SEPARATION_GATES = [
    {"id": "gate-ukeu-defect", "artefactType": "defect-ticket", "status": "awaiting",
     "title": "Separation defect ticket — awaiting CIO triage", "chip": "Awaiting triage",
     "auditLine": "Drafted by LiSN 10 Sep 09:00 UTC · routed 09:00", "owner": "CIO / separation PMO",
     "approveEnabledFor": ["CIO / separation PMO"], "approveLabel": "Accept for triage",
     "disabledTooltip": "Triage sits with CIO / separation PMO"},
    {"id": "gate-ukeu-notice", "artefactType": "distributor-notice", "status": "not_sent",
     "title": "Distributor notice (corrected remit-to) — awaiting Regional GM UK-EU approval · not sent",
     "chip": "Not sent", "owner": "Regional GM UK-EU", "approveEnabledFor": ["Regional GM UK-EU"],
     "approveLabel": "Approve notice", "disabledTooltip": "Approval sits with Regional GM UK-EU"},
    {"id": "gate-ukeu-dunning", "artefactType": "dunning-pause", "status": "awaiting",
     "title": "Dunning pause on disputed invoices — CFO decision", "chip": "CFO decision", "owner": "CFO",
     "approveEnabledFor": ["CFO"], "approveLabel": "Approve dunning pause", "disabledTooltip": "Decision sits with CFO"},
]


def build_signals():
    fw41 = {
        "id": "fw-4-1", "displayId": "SIG-2609-001", "question": "installed-base",
        "ucIds": ["UC-Q-1", "UC-Q-14", "UC-Q-15", "UC-Q-10"],
        "rank": 1, "rankOf": 5, "rankScore": 0.84,
        "rankFactors": [
            {"label": "Severity", "value": "S2", "weight": 0.30, "score": 0.80},
            {"label": "Rate ratio", "value": "3.1×", "weight": 0.20, "score": 0.90},
            {"label": "Panels on version", "value": "1,240 (+5,560 eligible)", "weight": 0.20, "score": 0.85},
            {"label": "Source independence", "value": "0.78", "weight": 0.15, "score": 0.78},
            {"label": "Est. field cost", "value": "≈ $0.15m projected", "weight": 0.15, "score": 0.86},
        ],
        "aboveThreshold": True, "aboveSince": "2026-09-16T06:10:00Z",
        "title": "EST4 fw 4.1 — devices not found after upgrade",
        "headline": "{{platform:EST4}} · firmware {{fw:EST4@4.1}} (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on {{fw:EST4@4.0}}; 9 partners, 3 regions; 1,240 panels on version",
        "metric": {"display": "6.2 vs 2.0", "value": 6.2, "baseline": 2.0, "ratio": 3.1,
                   "unit": "contacts per 1,000 panel-weeks",
                   "line": "6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 · same 3 weeks · event-time aligned to each panel's upgrade · Poisson exact p<0.001"},
        "severity": {
            "class": "S2", "word": "Material impact", "domain": "Quality", "type": "cliff",
            "typeNote": "Cliff (step at release)",
            "blastRadius": {"headline": "Blast radius 1,240 panels · ~610 sites · 9 partners · 3 regions ({{region:US-SE}}, {{region:US-SW}}, {{region:Canada}})",
                            "note": "5,560 eligible panels not yet upgraded"},
            "incident": {"flag": False, "note": INCIDENT_OFF},
            "escalationRule": "Any S1 phrase in this cohort routes to Quality immediately.",
            "compact": "S2 ▲ · Cliff · 1,240 panels · Incident off",
        },
        "confidence": {"level": "M", "p": 0.70, "short": "M 0.70 · K 15 / I 8",
                       "known": {"count": 15, "label": "cases with firmware in record"},
                       "inferred": {"count": 8, "label": "imputed from ship date and download logs"},
                       "sourceIndependence": {"score": 0.78, "partners": 9, "channels": 4,
                                              "note": "after-hours counted with voice"}},
        "chips": [
            {"icon": "Sparkles", "text": "New phrasing — first seen 4 Sep", "ucId": "UC-Q-14"},
            {"icon": "Repeat", "text": "Workaround spreading: 'rolled back to 4.0' in 5 cases", "ucId": "UC-Q-15"},
            {"icon": "Scale", "text": "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)",
             "ucId": "UC-Q-10", "attributionPos": 0.3},
        ],
        "counterEvidence": "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause",
        "joinTags": [
            {"key": "BRAND", "value": "{{brand:Edwards}}"}, {"key": "PLATFORM", "value": "{{platform:EST4}}"},
            {"key": "FW", "value": "{{fw:EST4@4.1}} (synthetic)"},
            {"key": "REGION", "value": "{{region:US-SE}} · {{region:US-SW}} · {{region:Canada}}"},
            {"key": "PARTNERS", "value": "9 ESDs"}, {"key": "SITE", "value": "commercial office · education"},
            {"key": "CHANNELS", "value": "calls · cases · email · RMA · after-hours"},
            {"key": "TIME", "value": "weeks 1–3 post-release"},
        ],
        "pnl": {
            "primary": "Warranty & field cost", "secondary": "tech-support cost-to-serve",
            "compact": "P&L → Warranty & field cost · ≈ $0.15m proj.",
            "exposure": {
                "lines": [{"text": "P&L: Warranty & field cost · secondary: tech-support cost-to-serve"},
                          {"text": "To date ≈ $12k · projected ≈ $0.15m over 12 weeks if the rollout continues unchanged",
                           "valueId": "V-01,V-02"}],
                "caption": "Small because it is week three.",
                "subTiles": [{"text": "~140 excess contacts avoidable if the rollout is paused at week 3 — decision sits with VP Engineering", "valueId": "V-03"},
                             {"text": "21 days ahead of the scheduled monthly RMA review", "valueId": "V-04"}],
            },
        },
        "routing": {"owner": "VP Engineering", "cc": ["VP Service & Tech Support"], "informed": ["Quality", "President"],
                    "presidentReason": "President sees this because S2 and blast radius exceed the agreed threshold."},
        "recommendedAction": "Owner to decide: engineering reproduction on the candidate configuration, and whether to pause the staged rollout and download of 4.1.",
        "gates": [GATE_FW41_BRIEF, GATE_FW41_KIN],
        "evidenceCount": 23,
        "nextReview": {"date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "leadDays": 21},
        "drillRoute": "/installed-base/signal/fw-4-1",
    }

    dc = {
        "id": "dc-d2-2611", "displayId": "SIG-2609-002", "question": "installed-base", "ucIds": ["UC-Q-2"],
        "rank": 2, "rankOf": 5, "rankScore": 0.71,
        "rankFactors": rank_factors(0.71, [
            ("Severity", "S2", 0.30, 0.80), ("Rate ratio", "4.2×", 0.20, 0.85),
            ("Units in window", "4,800 (1,900 in stock)", 0.20, 0.60), ("Source independence", "0.61", 0.15, 0.61),
            ("Est. field exposure", "up to $0.35m", 0.15, None)]),
        "aboveThreshold": True, "aboveSince": "2026-09-18T07:30:00Z",
        "title": "Detector family D-2 — early-life failures, date codes 2611–2614",
        "headline": "Detector family D-2, date codes 2611–2614 (synthetic) — early-life 'device not responding' contacts 4.2× adjacent production weeks; 4,800 units in window; SKU return rate 0.21% inside its 0.30% limit",
        "metric": {"display": "4.2×", "value": 4.6, "baseline": 1.1, "ratio": 4.2,
                   "unit": "early-life contacts per 10,000 units",
                   "line": "4.6 early-life contacts per 10,000 units in date codes 2611–2614 vs 1.1 across adjacent production weeks · serial axis · 22 serial-verified, 9 read from photos"},
        "severity": {"class": "S2", "word": "Material impact", "domain": "Quality", "type": "cliff",
                     "typeNote": "Cliff (serial axis)",
                     "blastRadius": {"headline": "Blast radius 4,800 units · 1,900 in stock at 11 distributors",
                                     "note": "2,900 units installed"},
                     "incident": {"flag": False, "note": INCIDENT_OFF},
                     "escalationRule": "Any S1 phrase in this cohort routes to Quality immediately.",
                     "compact": "S2 ▲ · Cliff · 4,800 units · Incident off"},
        "confidence": {"level": "M", "p": 0.65, "short": "M 0.65 · K 22 / I 9",
                       "known": {"count": 22, "label": "serial-verified"},
                       "inferred": {"count": 9, "label": "date codes read from photos"}},
        "counterEvidence": "SKU return rate 0.21% sits inside its 0.30% limit; adjacent date codes are at baseline",
        "joinTags": [{"key": "PRODUCT", "value": "Detector family D-2 (synthetic)"},
                     {"key": "DATE CODES", "value": "2611–2614"}, {"key": "CHANNELS", "value": "calls · cases · RMA"},
                     {"key": "STOCK", "value": "11 distributors"}, {"key": "TIME", "value": "6 weeks"}],
        "pnl": {"primary": "Warranty & containment cost", "compact": "P&L → Warranty & containment · up to $0.35m",
                "exposure": {"lines": [{"text": "Field replacement exposure up to $0.35m", "valueId": "V-05"},
                                       {"text": "1,900 units (40%) containable", "valueId": "V-05"}]}},
        "routing": {"owner": "Director Product Quality", "cc": ["VP Engineering"], "informed": ["Quality"]},
        "recommendedAction": "Sample return and teardown. Quality to decide on quarantine of units still in distributor stock.",
        "gates": [{"id": "gate-d2-containment", "artefactType": "containment-memo", "status": "awaiting",
                   "title": "Draft containment memo (8D D1–D3 pre-filled) — awaiting Quality approval",
                   "chip": "Awaiting approval", "auditLine": "Drafted by LiSN 18 Sep 07:30 UTC · routed 07:30",
                   "owner": "Director Product Quality", "approveEnabledFor": ["Director Product Quality", "Quality"],
                   "approveLabel": "Approve containment memo",
                   "disabledTooltip": "Approval sits with Director Product Quality"}],
        "evidenceCount": 31,
        "nextReview": {"date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "leadDays": 19},
        "drillRoute": "/installed-base#date-code",
    }

    esd = {
        "id": "esd-se-07", "displayId": "SIG-2609-003", "question": "channel", "ucIds": ["UC-C-1"],
        "rank": 3, "rankOf": 5, "rankScore": 0.66,
        "rankFactors": rank_factors(0.66, [
            ("Severity", "S2", 0.30, 0.80), ("Rate ratio", "3.1×", 0.20, 0.80),
            ("Population", "$6.4m sell-in · 1 Strategic Partner", 0.20, 0.40),
            ("Source independence", "0.72", 0.15, 0.72), ("Est. exposure", "≈ $1.4m / yr gap", 0.15, None)]),
        "aboveThreshold": True, "aboveSince": "2026-09-11T09:00:00Z",
        "title": "ESD-SE-07 — Strategic Partner drift",
        "headline": "ESD-SE-07 (synthetic) — friction 3.1× its own baseline for six weeks; recontact 38% vs 14%; EST4 sell-in −22% vs the same weeks last year",
        "metric": {"display": "13 → 40", "value": 40, "baseline": 13, "ratio": 3.1, "unit": "interactions over 6 weeks",
                   "line": "40 interactions in weeks 21–26 vs 13 on its own baseline · recontact 38% vs 14% · sell-in −22% vs last year (territory peers +4%)"},
        "severity": {"class": "S2", "word": "Material impact", "domain": "Channel", "type": "slope",
                     "typeNote": "Slope (six-week drift)",
                     "blastRadius": {"headline": "Blast radius $6.4m sell-in · $0.9m backlog · 1 Strategic Partner"},
                     "incident": {"flag": "n/a", "note": "Incident flag: n/a — commercial signal"},
                     "compact": "S2 ▲ · Slope · $6.4m sell-in · Incident n/a"},
        "confidence": {"level": "H", "p": 0.80, "short": "H on orders (K) · M on friction→orders (I)",
                       "known": {"label": "orders and certifications"},
                       "inferred": {"label": "friction leads orders"}},
        "chips": [{"icon": "GraduationCap", "text": "2 of 5 EST4-certified technicians lapsed (week 22)", "ucId": "UC-C-2"},
                  {"icon": "Swords", "text": "[competitor] named in 4 calls", "ucId": "UC-C-13"},
                  {"icon": "Link", "text": "2 of its cases sit in the fw 4.1 cohort", "ucId": "UC-Q-1"}],
        "counterEvidence": "Territory peers are +4% on sell-in; 419 of 420 NA Strategic Partners hold their own baseline",
        "joinTags": [{"key": "PARTNER", "value": "ESD-SE-07 (synthetic)"}, {"key": "REGION", "value": "US-SE"},
                     {"key": "CHANNELS", "value": "calls · cases · email · portal"},
                     {"key": "JOINED", "value": "ERP orders · LMS · backlog"}, {"key": "TIME", "value": "weeks 16–26"}],
        "pnl": {"primary": "Partner revenue", "secondary": "channel share",
                "compact": "P&L → Partner revenue · $6.4m sell-in in view",
                "exposure": {"lines": [{"text": "$6.4m sell-in in view · ≈ $1.4m / yr gap if −22% persists · $0.9m backlog", "valueId": "V-06"}]}},
        "routing": {"owner": "Regional GM NA", "cc": ["VP Service & Tech Support"], "informed": ["Learning Center manager"]},
        "recommendedAction": "Regional GM visit with a named L3 engineer and two priority EST4 class seats.",
        "gates": [{"id": "gate-esd07-recovery", "artefactType": "partner-recovery-brief", "status": "awaiting",
                   "title": "Partner-recovery brief — awaiting Regional GM approval · no outreach sent",
                   "chip": "Awaiting approval", "owner": "Regional GM NA", "approveEnabledFor": ["Regional GM NA"],
                   "approveLabel": "Approve recovery brief", "disabledTooltip": "Approval sits with Regional GM NA"}],
        "evidenceCount": 40,
        "nextReview": {"date": "2026-10-15", "label": "15 Oct · QBR", "leadDays": 34},
        "drillRoute": "/channel#esd-se-07",
    }

    n3 = {
        "id": "n3-backorder", "displayId": "SIG-2609-004", "question": "channel", "ucIds": ["UC-C-6"],
        "rank": 4, "rankOf": 5, "rankScore": 0.58,
        "rankFactors": rank_factors(0.58, [
            ("Severity", "S2", 0.30, 0.80), ("Rate ratio", "3.2×", 0.20, 0.70),
            ("Population", "312 lines · 11 partners", 0.20, 0.50),
            ("Source independence", "0.55", 0.15, 0.55), ("Est. exposure", "$2.3m backlog at risk", 0.15, None)]),
        "aboveThreshold": True, "aboveSince": "2026-09-22T09:00:00Z",
        "title": "Notification family N-3 — backorder consequence",
        "headline": "Notification family N-3 (synthetic) — cancel and substitute language 3.2× across 11 NA partners; OTD 94% against revised promise dates, 71% against the original",
        "metric": {"display": "3.2×", "value": 3.2, "baseline": 1.0, "ratio": 3.2,
                   "unit": "consequence language vs own baseline",
                   "line": "Cancel / substitute language 3.2× its own baseline in week 26 · 312 lines pushed ≥3 weeks · 4 projects with inspections within 30 days"},
        "severity": {"class": "S2", "word": "Material impact", "domain": "Supply", "type": "slope",
                     "typeNote": "Slope (from week 21)",
                     "blastRadius": {"headline": "Blast radius $2.3m backlog · 312 lines · 11 partners",
                                     "note": "4 projects with inspections within 30 days"},
                     "incident": {"flag": "n/a", "note": "Incident flag: n/a — commercial signal"},
                     "compact": "S2 ▲ · Slope · 312 lines · Incident n/a"},
        "confidence": {"level": "H", "p": 0.75, "short": "H on dates (K) · M on cancellation (I)",
                       "known": {"label": "promise and ship dates"},
                       "inferred": {"label": "cancellation intent read from language"}},
        "counterEvidence": "OTD against revised promise dates is 94% — the backlog looks healthy on the revised measure",
        "joinTags": [{"key": "PRODUCT", "value": "Notification family N-3 (synthetic)"}, {"key": "REGION", "value": "NA"},
                     {"key": "PARTNERS", "value": "11"}, {"key": "CHANNELS", "value": "email · order desk · calls"},
                     {"key": "JOINED", "value": "ERP order lines · backlog"}],
        "pnl": {"primary": "Backlog conversion", "secondary": "OTIF", "compact": "P&L → Backlog conversion · $2.3m at risk",
                "exposure": {"lines": [{"text": "Backlog at risk $2.3m (2.4% of ~$95m open backlog) · 4 projects with inspections ≤30 days", "valueId": "V-07"}]}},
        "routing": {"owner": "VP Supply Chain", "cc": ["VP Sales"]},
        "recommendedAction": "Review allocation with the 4 inspection-critical projects first.",
        "gates": [{"id": "gate-n3-allocation", "artefactType": "allocation-list", "status": "awaiting",
                   "title": "Allocation priority list — awaiting Supply Chain approval · no partner messages sent",
                   "chip": "Awaiting approval", "owner": "VP Supply Chain", "approveEnabledFor": ["VP Supply Chain"],
                   "approveLabel": "Approve allocation list", "disabledTooltip": "Approval sits with VP Supply Chain"}],
        "evidenceCount": 38,
        "nextReview": {"date": "2026-10-05", "label": "5 Oct · OTIF report", "leadDays": 13},
        "drillRoute": "/channel#backorder",
    }

    ukeu = {
        "id": "ukeu-entity-cutover", "displayId": "SIG-2609-005", "question": "separation", "ucIds": ["UC-C-3"],
        "rank": 5, "rankOf": 5, "rankScore": 0.52,
        "rankFactors": rank_factors(0.52, [
            ("Severity", "S2", 0.30, 0.80), ("Rate ratio", "2.7× (control 1.1×)", 0.20, 0.60),
            ("Population", "14 distributors · 212 invoices", 0.20, 0.35),
            ("Source independence", "0.45", 0.15, 0.45), ("Est. exposure", "£1.1m in dispute", 0.15, None)]),
        "aboveThreshold": True, "aboveSince": "2026-09-10T09:00:00Z",
        "title": "UK-EU entity cutover — remit-to and invoice friction",
        "headline": "UK-EU entity cutover (1 Sep) — remit-to and entity contacts 2.7× pre-cutover against 1.1× in the control regions; portal login 3.4×; 14 distributors",
        "metric": {"display": "30 → 81 / wk", "value": 81, "baseline": 30, "ratio": 2.7,
                   "unit": "remit-to & entity contacts per week",
                   "line": "81 remit-to and entity contacts in week 26 vs 30 a week before the cutover · control regions 1.1× · difference-in-differences"},
        "severity": {"class": "S2", "word": "Material impact", "domain": "Separation", "type": "cliff",
                     "typeNote": "Cliff (step at cutover)",
                     "blastRadius": {"headline": "Blast radius 14 distributors · 212 invoices · £1.1m in dispute"},
                     "incident": {"flag": "n/a", "note": "Incident flag: n/a — commercial signal"},
                     "compact": "S2 ▲ · Cliff · 14 distributors · Incident n/a"},
        "confidence": {"level": "H", "p": 0.80, "short": "H on timing (K) · M on cause (I)",
                       "known": {"label": "cutover date and AR disputes"},
                       "inferred": {"label": "PO-entity mapping as candidate cause"}},
        "counterEvidence": "NA portal, APAC order management and EDI mapping cutovers show no distributor friction against control",
        "joinTags": [{"key": "REGION", "value": "UK-EU"}, {"key": "DISTRIBUTORS", "value": "14"},
                     {"key": "SYSTEMS", "value": "entity · portal · EDI"},
                     {"key": "JOINED", "value": "AR disputes · invoice headers"}, {"key": "TIME", "value": "since 1 Sep"}],
        "pnl": {"primary": "DSO", "secondary": "cost-to-serve", "compact": "P&L → DSO · £1.1m in dispute",
                "exposure": {"lines": [{"text": "Invoices in dispute £1.1m / 212 · DSO +6 days ≈ £1.0m cash tied up", "valueId": "V-08"},
                                       {"text": "~48 excess contacts / week · ~290 avoidable over 6 weeks if fixed", "valueId": "V-09"}]}},
        "routing": {"owner": "CIO / separation PMO", "cc": ["CFO", "Regional GM UK-EU"]},
        "recommendedAction": "Candidate: PO-entity mapping in the EDI layer — engineering to confirm. CFO to decide on a dunning pause.",
        "gates": SEPARATION_GATES,
        "evidenceCount": 298,
        "nextReview": {"date": "2026-10-05", "label": "5 Oct · DSO report", "leadDays": 25},
        "drillRoute": "/separation",
    }

    enabler = {
        "id": "evidence-readiness", "displayId": "SIG-2609-E01", "question": "installed-base", "ucIds": ["UC-Q-17"],
        "aboveThreshold": False,
        "title": "Evidence readiness",
        "headline": "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57%.",
        "metric": {"display": "38%", "value": 38, "baseline": 100, "ratio": 0.4,
                   "unit": "% of trouble cases with firmware in record",
                   "line": "Discovery measures this first — on your data."},
        "severity": {"class": "S4", "word": "Efficiency", "domain": "Enabler", "type": "slope",
                     "typeNote": "Slope (capability, not a fault)",
                     "blastRadius": {"headline": "Scope: EST4 trouble cases and RMAs"},
                     "incident": {"flag": "n/a", "note": "Incident flag: n/a — enabler"},
                     "compact": "S4 · Enabler · Incident n/a"},
        "confidence": {"level": "H", "p": 0.90, "short": "H 0.90",
                       "known": {"label": "blank-field counts"}, "inferred": {"label": "recoverable share"}},
        "joinTags": [{"key": "PLATFORM", "value": "EST4"}, {"key": "FIELDS", "value": "firmware · serial · date code · end-site"}],
        "pnl": {"primary": "Warranty (NFF) and containment precision",
                "compact": "P&L → Warranty (NFF) and containment precision"},
        "routing": {"owner": "Quality", "cc": ["VP Service & Tech Support", "CIO / separation PMO"]},
        "recommendedAction": "Discovery measures this first — on your data.",
        "gates": [],
        "drillRoute": "/installed-base#why-late",
    }
    return fw41, dc, esd, n3, ukeu, enabler


def build_monitor(signals):
    fw41, dc, esd, n3, ukeu, _ = signals
    cards = [
        {"signalId": "fw-4-1", "rank": 1, "title": fw41["title"],
         "chips": {"class": "S2", "word": "Material impact", "domain": "Quality", "type": "Cliff"},
         "rows": [{"label": "SOURCES", "value": "Calls · Cases · Email · RMA · After-hours"},
                  {"label": "COHORT", "value": "{{platform:EST4}} · fw {{fw:EST4@4.1}} (synthetic)"},
                  {"label": "WINDOW", "value": "Weeks 1–3 post-release"}, {"label": "OWNER", "value": "VP Engineering"}],
         "metrics": [{"label": "Contacts / 1,000 panel-weeks", "value": "2.0 → 6.2", "change": "3.1×"}],
         "blastRadius": "1,240 panels · 9 partners · 3 regions", "confidenceShort": "M 0.70 · K 15 / I 8",
         "ownerGate": "VP Engineering · Awaiting approval", "pnlShort": "Warranty & field",
         "suggestion": "Reproduce on configurations with more than two signalling loops. Owner to decide whether to pause the staged 4.1 rollout.",
         "linkTo": "/installed-base/signal/fw-4-1", "gateChipAfterApprove": "✓ Investigation approved"},
        {"signalId": "dc-d2-2611", "rank": 2, "title": dc["title"],
         "chips": {"class": "S2", "word": "Material impact", "domain": "Quality", "type": "Cliff (serial axis)"},
         "rows": [{"label": "SOURCES", "value": "Calls · Cases · RMA"},
                  {"label": "COHORT", "value": "Detector family D-2 · date codes 2611–2614 (synthetic)"},
                  {"label": "WINDOW", "value": "6 weeks"}, {"label": "OWNER", "value": "Director Product Quality"}],
         "metrics": [{"label": "Early-life contacts vs adjacent weeks", "value": "4.2×"},
                     {"label": "SKU return rate", "value": "0.21% (limit 0.30%) — in control"}],
         "blastRadius": "4,800 units · 1,900 in stock at 11 distributors", "confidenceShort": "M 0.65 · K 22 / I 9",
         "ownerGate": "Director Product Quality · Containment memo awaiting approval", "pnlShort": "Warranty & containment",
         "suggestion": "Sample return and teardown. Quality to decide on quarantine of units still in distributor stock.",
         "linkTo": "/installed-base#date-code", "microStrip": True},
        {"signalId": "esd-se-07", "rank": 3, "title": esd["title"],
         "chips": {"class": "S2", "word": "Material impact", "domain": "Channel", "type": "Slope"},
         "rows": [{"label": "SOURCES", "value": "Calls · Cases · Email · Portal"},
                  {"label": "COHORT", "value": "{{partner:ESD-SE-07}} (synthetic) · {{region:US-SE}}"},
                  {"label": "WINDOW", "value": "6 weeks"}, {"label": "OWNER", "value": "Regional GM NA"}],
         "metrics": [{"label": "Interactions, 6 wks", "value": "13 → 40", "change": "3.1×"},
                     {"label": "Recontact", "value": "14% → 38%"}],
         "blastRadius": "$6.4m sell-in · $0.9m backlog", "confidenceShort": "H on orders (K) · M on friction→orders (I)",
         "ownerGate": "Regional GM NA · Recovery brief awaiting approval · no outreach sent", "pnlShort": "Partner revenue",
         "suggestion": "Regional GM visit with a named L3 engineer and two priority EST4 class seats.",
         "linkTo": "/channel#esd-se-07"},
        {"signalId": "n3-backorder", "rank": 4, "title": n3["title"],
         "chips": {"class": "S2", "word": "Material impact", "domain": "Supply", "type": "Slope"},
         "rows": [{"label": "SOURCES", "value": "Email · Order desk · Calls"},
                  {"label": "COHORT", "value": "Notification family N-3 (synthetic) · 11 NA partners"},
                  {"label": "WINDOW", "value": "Weeks 21–26"}, {"label": "OWNER", "value": "VP Supply Chain"}],
         "metrics": [{"label": "Cancel / substitute language", "value": "3.2×"},
                     {"label": "OTD", "value": "94% revised / 71% original"}],
         "blastRadius": "$2.3m backlog · 312 lines · 11 partners", "confidenceShort": "H on dates (K) · M on cancellation (I)",
         "ownerGate": "VP Supply Chain · Allocation list awaiting approval", "pnlShort": "Backlog conversion",
         "suggestion": "Review allocation with the 4 inspection-critical projects first.",
         "linkTo": "/channel#backorder"},
        {"signalId": "ukeu-entity-cutover", "rank": 5, "title": ukeu["title"],
         "chips": {"class": "S2", "word": "Material impact", "domain": "Separation", "type": "Cliff"},
         "rows": [{"label": "SOURCES", "value": "Email · Cases · Portal"},
                  {"label": "COHORT", "value": "{{region:UK-EU}} · 14 distributors"},
                  {"label": "WINDOW", "value": "Since 1 Sep"}, {"label": "OWNER", "value": "CIO / separation PMO"}],
         "metrics": [{"label": "Remit-to contacts vs pre-cutover", "value": "2.7× (control 1.1×)"},
                     {"label": "Portal login", "value": "3.4×"}],
         "blastRadius": "14 distributors · £1.1m in dispute", "confidenceShort": "H on timing (K) · M on cause (I)",
         "ownerGate": "CIO / separation PMO · Defect ticket awaiting triage", "pnlShort": "DSO",
         "suggestion": "Candidate: PO-entity mapping in the EDI layer — engineering to confirm. CFO to decide on a dunning pause.",
         "linkTo": "/separation"},
    ]
    # signals in monitor.json: the hero summary omits nothing (same object as the hero record's Signal part)
    return {
        "section": {"title": "Field Signal Monitor", "chip": "5 ABOVE THRESHOLD",
                    "subtitle": "Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner.",
                    "suppressedLine": "Suppressed: quarter-end order status · Edge how-to after training · planned tests · credit hold (routed to AR)",
                    "cardFooterLink": "Open signal →"},
        "signals": list(signals),
        "cards": cards,
        "suppressedCard": {"title": "212 look-alikes suppressed",
                           "rows": [{"label": "Quarter-end / seasonal", "count": 74},
                                    {"label": "How-to after launch — adoption, not fault", "count": 58},
                                    {"label": "Planned test or drill language", "count": 41},
                                    {"label": "Same-site recontacts and duplicates", "count": 27},
                                    {"label": "Credit hold, routed to AR", "count": 12}],
                           "footer": "Recall broad, rank severe."},
    }


# ---------------------------------------------------------------------------
# 8. exec.json
# ---------------------------------------------------------------------------
def money(amount, currency, display, value_id, label):
    return {"amount": amount, "currency": currency, "display": display, "illustrative": True,
            "valueId": value_id, "label": label}


def build_exec():
    footer = "Counted = above its own-baseline threshold at 25 Sep 18:00 UTC. Last week = digest of 18 Sep 18:00 UTC. A count, not a score."
    qcards = [
        {"id": "installed-base", "route": "/installed-base", "icon": "Cpu", "accent": "orange", "highlighted": True,
         "title": "Is our installed base healthy?", "caption": "Firmware releases · Date-code windows · RMA · Field failures",
         "count": 2, "countLabel": "signals above threshold", "lastWeekCount": 2, "deltaLabel": "0 vs last week",
         "fourWeekLabel": "+2 in 4 weeks", "severityMix": "S2 cliff · S2 cliff",
         "counted": [{"signalId": "fw-4-1", "text": "#1 · fw 4.1 cohort (synthetic) · S2 · Quality · Cliff · above threshold since 16 Sep · VP Engineering"},
                     {"signalId": "dc-d2-2611", "text": "#2 · D-2 date codes 2611–2614 (synthetic) · S2 · Quality · Cliff · since 18 Sep · Director Product Quality"}],
         "notCounted": "Not counted: governed S1 watch items (restricted) · 45 firmware cohorts within own baseline · Evidence readiness (enabler)",
         "countedFooter": footer,
         "gauges": [{"pct": 98, "label": "Firmware cohorts in control", "sub": "45 of 46", "tone": "green"},
                    {"pct": 80, "label": "EST4 RMA rate vs control limit", "sub": "0.28% of 0.35% · in control", "tone": "green"}],
         "trend": {"kind": "fw-lineage", "ref": "signal_fw41.json#lineage"},
         "miniKpis": [{"label": "TOP SIGNAL", "value": "fw 4.1 (synthetic) · 3.1×"},
                      {"label": "PANELS EXPOSED", "value": "1,240", "caption": "+5,560 eligible"}],
         "insightLabel": "LiSN INSIGHT",
         "insight": "Panels on fw 4.1 report 'devices not found after upgrade' at 6.2 per 1,000 panel-weeks vs 2.0 on 4.0 — 23 contacts from 9 unrelated partners since 4 Sep. Five installers have rolled back to 4.0. The EST4 RMA rate is still inside its control limit."},
        {"id": "channel", "route": "/channel", "icon": "Handshake", "accent": "teal", "highlighted": False,
         "title": "Are we holding our channel?",
         "caption": "Strategic Partners · Backorder consequence · Certification · Competitor language",
         "count": 2, "countLabel": "signals above threshold", "lastWeekCount": 1, "deltaLabel": "+1 vs last week",
         "fourWeekLabel": "+2 in 4 weeks", "severityMix": "S2 slope · S2 slope",
         "counted": [{"signalId": "esd-se-07", "text": "#3 · ESD-SE-07 partner drift (synthetic) · S2 · Channel · Slope · since 11 Sep · Regional GM NA"},
                     {"signalId": "n3-backorder", "text": "#4 · N-3 backorder consequence (synthetic) · S2 · Supply · Slope · since 22 Sep · VP Supply Chain"}],
         "notCounted": "Not counted: 419 NA Strategic Partners within own baseline · 1 order dip during a credit hold (routed to AR)",
         "countedFooter": footer,
         "gauges": [{"pct": 99.8, "label": "NA Strategic Partners within own baseline", "sub": "419 of 420", "tone": "green"},
                    {"pct": 71, "label": "N-3 OTD vs original promise", "sub": "94% vs revised", "tone": "amber"}],
         "trend": {"kind": "partner-dual", "ref": "channel.json#partnerTimeline"},
         "miniKpis": [{"label": "DRIFTING PARTNER", "value": "ESD-SE-07 · 3.1×"},
                      {"label": "BACKLOG AT RISK", "value": "$2.3m", "caption": "312 lines", "money": True}],
         "insightLabel": "LiSN INSIGHT",
         "insight": "ESD-SE-07 friction has run 3.1× its own baseline for six weeks; recontact 38% vs 14%; a competitor named in 4 calls. EST4 sell-in is −22% while territory peers are +4%."},
        {"id": "separation", "route": "/separation", "icon": "Split", "accent": "sky", "highlighted": False,
         "title": "Is the separation costing us?", "caption": "Entity · Portal · ERP · EDI cutovers against a control region",
         "count": 1, "countLabel": "signal above threshold", "lastWeekCount": 1, "deltaLabel": "0 vs last week",
         "fourWeekLabel": "+1 in 4 weeks", "severityMix": "S2 cliff",
         "counted": [{"signalId": "ukeu-entity-cutover", "text": "#5 · UK-EU entity cutover · S2 · Separation · Cliff · since 10 Sep · CIO / separation PMO"}],
         "notCounted": "Not counted: NA portal, APAC order management and EDI mapping cutovers — clean vs control",
         "countedFooter": footer,
         "gauges": [{"pct": 75, "label": "Cutovers clean vs control", "sub": "3 of 4", "tone": "amber"},
                    {"pct": 8, "label": "UK-EU distributors affected", "sub": "14 of 180", "tone": "amber"}],
         "trend": {"kind": "cutover-vs-control", "ref": "separation.json#cutoverTimeline"},
         "miniKpis": [{"label": "IN DISPUTE", "value": "£1.1m", "caption": "212 invoices", "money": True},
                      {"label": "DSO, TOP-10 UK-EU", "value": "+6 days"}],
         "insightLabel": "LiSN INSIGHT",
         "insight": "Since UK-EU invoicing moved to the new KGS entity on 1 Sep, remit-to and entity contacts are 2.7× pre-cutover against 1.1× in the control regions. Top cluster: 'invoice entity doesn't match our PO entity'."},
    ]
    return {
        "funnel": {"interactions": 233900, "weekApprox": "~9,000", "candidateClusters": 1640, "suppressed": 212,
                   "aboveThreshold": 5, "governed": 2,
                   "suppressedReasons": [{"label": l, "count": c} for l, c in SUPPRESSED],
                   "suppressedFooter": "Suppression reasons are shown, never hidden."},
        "briefLabel": "EXECUTIVE BRIEF",
        "brief": "Five signals above threshold — installed base 2, channel 2, separation 1. All five are with named owners; none has been actioned without approval.",
        "pulseLabel": "EXECUTIVE PULSE",
        "pulse": [
            {"n": 1, "title": "What's critical",
             "text": "EST4 fw 4.1 (synthetic): 'devices not found after upgrade' at 3.1× panels still on 4.0 — 9 partners, 3 regions, 1,240 panels. Draft brief awaiting VP Engineering.",
             "chips": ["S2 · Quality", "VP Engineering", "Awaiting approval"], "chipAfterApprove": "Investigation approved",
             "linkTo": "/installed-base/signal/fw-4-1"},
            {"n": 2, "title": "Where's your focus",
             "text": "UK-EU remit-to and invoice contacts 2.7× since the 1 Sep entity cutover (control 1.1×): £1.1m in dispute, DSO +6 days at top-10 distributors.",
             "chips": ["S2 · Separation", "CIO / separation PMO", "Awaiting triage"], "linkTo": "/separation"},
            {"n": 3, "title": "What's stable",
             "text": "3 of 4 cutovers clean against control. Nuisance-alarm contacts within own baseline for every detector family. 212 look-alikes suppressed.",
             "chips": ["—", "—", "No action needed"], "linkTo": "/separation"},
        ],
        "questionCards": qcards,
        "whatsCountedTitle": "What's counted",
        "appliedValue": {
            "header": "Applied value · this week", "chip": "Synthetic scenario", "link": "How we count",
            "footnote": "Lead time is measured against the review calendar, not against when your teams would otherwise have known. Discovery tests that blind.",
            "tiles": [
                {"id": "AV-1", "label": "Ahead of the review cycle", "value": "21 days",
                 "sub": "median lead vs next scheduled review · 5 signals", "methodIds": ["V-11"]},
                {"id": "AV-2", "label": "Signals routed", "value": "5 → 5 owners",
                 "sub": "+ 2 governed watch items (restricted)", "methodIds": ["count"]},
                {"id": "AV-3", "label": "Decisions pending", "value": "5 awaiting owners",
                 "sub": "7 drafts · 0 sent · 0 automatic actions", "methodIds": ["count"],
                 "onApprove": {"value": "4 awaiting owners", "sub": "7 drafts · 1 approved · 0 sent · 0 automatic actions"}},
                {"id": "AV-4", "label": "Exposure in view", "money": True,
                 "lines": ["Warranty & field ≤ $0.5m", "Backlog at risk $2.3m", "Invoices in dispute £1.1m"],
                 "sub": "exposure, not savings · not summed", "methodIds": ["V-02", "V-05", "V-07", "V-08"]},
                {"id": "AV-5", "label": "Contacts avoidable", "money": True, "value": "~430",
                 "sub": "$11k–26k handling cost · if owners approve", "methodIds": ["V-10"]},
                {"id": "AV-6", "label": "Look-alikes suppressed", "value": "212",
                 "sub": "seasonal · how-to after launch · planned tests · credit holds", "methodIds": ["V-12"]},
            ],
            "leadList": [
                {"signalId": "fw-4-1", "crossed": "16 Sep", "review": "7 Oct · monthly RMA review", "lead": 21},
                {"signalId": "dc-d2-2611", "crossed": "18 Sep", "review": "7 Oct · monthly RMA review", "lead": 19},
                {"signalId": "esd-se-07", "crossed": "11 Sep", "review": "15 Oct · QBR", "lead": 34},
                {"signalId": "n3-backorder", "crossed": "22 Sep", "review": "5 Oct · OTIF report", "lead": 13},
                {"signalId": "ukeu-entity-cutover", "crossed": "10 Sep", "review": "5 Oct · DSO report", "lead": 25},
            ],
        },
        "valueRegister": [{"id": i, "figure": f, "method": m, "money": mo} for i, f, m, mo in VALUE_REGISTER],
        "unitCosts": {"tier1ContactUsd": [25, 60], "excessFaultContactUsd": 750,
                      "breakdown": [{"label": "Truck roll", "usd": 450}, {"label": "Tier-3 escalation", "usd": 150},
                                    {"label": "NFF return share", "usd": 150}],
                      "detectorReplacementUsd": 120},
        "valueStatements": [
            "Each platform, release, date code and partner measured against its own baseline — special cause, not volume.",
            "Every signal joined to firmware, batch, RMA and orders, and routed to the executive who owns it.",
            "Every number opens to the calls, cases and RMAs behind it.",
            "LiSN drafts; your owners approve. Read-only, in your cloud.",
        ],
        "neverOnScreen": "Never on screen: revenue, savings, ROI or payback.",
        "howWeCount": {"title": "How we count",
                       "unitCostLines": ["tier-1 contact $25–60",
                                         "fully loaded field cost per excess fault contact $750 (truck roll $450 · Tier-3 escalation $150 · NFF return share $150)",
                                         "detector field replacement $120 per unit"],
                       "footer": "Never on screen: revenue, savings, ROI or payback."},
        "money": {
            "heroToDate": money(12000, "USD", "≈ $12k", "V-01", "Hero exposure to date"),
            "heroProjected": money(150000, "USD", "≈ $0.15m", "V-02", "Hero projected over 12 weeks"),
            "heroAvoidableField": money(100000, "USD", "≈ $0.1m", "V-03", "Hero field cost avoidable if paused"),
            "dateCodeExposure": money(350000, "USD", "up to $0.35m", "V-05", "Date-code field exposure"),
            "warrantyAndField": money(500000, "USD", "≤ $0.5m", "V-02,V-05", "Warranty & field (hero projected + date code; both USD)"),
            "partnerSellIn": money(6400000, "USD", "$6.4m", "V-06", "Partner sell-in in view"),
            "partnerGap": money(1400000, "USD", "≈ $1.4m / yr", "V-06", "Sell-in gap if −22% persists"),
            "partnerBacklog": money(900000, "USD", "$0.9m", "V-06", "Partner backlog"),
            "backlogAtRisk": money(2300000, "USD", "$2.3m", "V-07", "Backlog at risk"),
            "openBacklog": money(95000000, "USD", "~$95m", "V-07", "Open backlog"),
            "invoicesInDispute": money(1100000, "GBP", "£1.1m", "V-08", "Invoices in dispute"),
            "dsoCash": money(1000000, "GBP", "≈ £1.0m", "V-08", "DSO +6 days, cash tied up"),
        },
        "governedWatch": {
            "title": "Governed safety & cyber watch", "band": "RESTRICTED",
            "headline": "2 open watch items (restricted)", "pnl": "P&L: Restricted",
            "items": [
                {"id": "W-1",
                 "row": "Safety · S1 watch · single source → awaiting corroboration · routed to Quality + CLO · 6 Sep 14:38 UTC · status: under Quality review · confidence L–M 0.35",
                 "secondLine": "Back-search found an earlier related email (19 weeks before), coded 'commissioning' — chronology updated 23 Sep 10:02. Quality decides significance.",
                 "firstMentionAt": "2026-09-06T14:31:00Z", "routedAt": "2026-09-06T14:38:00Z",
                 "chronologyUpdatedAt": "2026-09-23T10:02:00Z", "confidence": {"level": "L–M", "p": 0.35}},
                {"id": "W-2",
                 "row": "Cyber · S1 candidate · 4 unrelated sites · candidate first mention 25 Sep 09:14 UTC · not in PSIRT queue at detection · routed to PSIRT + CLO 09:21 UTC · confidence L 0.30",
                 "firstMentionAt": "2026-09-25T09:14:00Z", "routedAt": "2026-09-25T09:21:00Z",
                 "confidence": {"level": "L", "p": 0.30},
                 "clock": {"startUtc": "2026-09-25T09:14:00Z", "elapsedLabel": "8h 46m", "refsHours": [24, 72],
                           "caption": "8h 46m since candidate first mention · 24h / 72h ticks are reference only — PSIRT determines whether awareness has begun."}},
            ],
            "footer": "LiSN does not determine reportability.",
            "modal": "Access limited to Quality, PSIRT and Legal roles. Routed to Quality / PSIRT — human decision. LiSN does not determine reportability.",
        },
        "evidenceReadiness": {
            "title": "Evidence readiness", "chip": "S4 · Efficiency", "extraChip": "ENABLER",
            "body": "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57%.",
            "label": "Discovery measures this first — on your data.",
            "confidenceShort": "H 0.90 · K blank-field counts / I recoverable share",
            "owners": "Quality · VP Service & Tech Support · CIO", "linkTo": "/installed-base#why-late"},
    }


# ---------------------------------------------------------------------------
# 9. signal_fw41.json
# ---------------------------------------------------------------------------
CH_LABEL = {"call": "Call", "case": "Case note", "email": "Email", "rma": "RMA narrative", "afterHours": "After-hours line"}
PARTNER_REGION = {"ESD-SE-07": ("US-SE", "Florida"), "ESD-SE-02": ("US-SE", "Florida"), "ESD-SE-11": ("US-SE", "Georgia"),
                  "ESD-SE-14": ("US-SE", "Alabama"), "ESD-SW-03": ("US-SW", "Texas"), "ESD-SW-12": ("US-SW", "Texas"),
                  "ESD-SW-09": ("US-SW", "Arizona"), "ESD-CA-04": ("Canada", "Ontario"), "ESD-CA-06": ("Canada", "Ontario")}
# (n, utc, local, channel, partner, K|ship|dl, rollback, featuredOrder, text, highlight, extra)
EVIDENCE = [
    (1, "2026-09-04T16:40:00Z", "4 Sep", "case", "ESD-SE-07", "K", False, None,
     "Customer site upgraded to {{fw:EST4@4.1}} this morning; loop 2 now shows devices not found. Re-mapped twice, same result.", "devices not found", {}),
    (2, "2026-09-08T14:05:00Z", "8 Sep", "call", "ESD-SW-03", "ship", False, None,
     "Panel went to the new firmware and now half the loop is missing on the map.", "half the loop is missing", {}),
    (3, "2026-09-09T15:20:00Z", "9 Sep", "call", "ESD-SE-07", "K", True, 1,
     "After we pushed {{fw:EST4@4.1}} the loop comes back with half the devices missing. Rolled one panel back to {{fw:EST4@4.0}} and it mapped fine.", "half the devices missing", {}),
    (4, "2026-09-10T13:48:00Z", "10 Sep", "email", "ESD-SW-03", "K", False, None,
     "Following up — same site, still not mapping after the upgrade. We need this sorted before the occupancy walk-through.", "still not mapping after the upgrade", {}),
    (5, "2026-09-11T16:02:00Z", "11 Sep", "case", "ESD-SW-03", "K", False, 2,
     "Devices not found after upgrade on loops 2 and 3; mapping stops around 60%. Power-cycled; no change.", "Devices not found after upgrade", {}),
    (6, "2026-09-11T20:31:00Z", "11 Sep", "call", "ESD-SW-03", "dl", False, None,
     "Second panel this week on {{fw:EST4@4.1}} — loop 3 comes back empty.", "loop 3 comes back empty", {}),
    (7, "2026-09-16T03:12:00Z", "15 Sep", "email", "ESD-CA-04", "ship", False, 3,
     "Third site this month with the same thing after the firmware update — is there a known issue?", "same thing after the firmware update",
     {"note": "Received 15 Sep 23:12 ET = 16 Sep 03:12 UTC · third independent partner"}),
    (8, "2026-09-16T12:40:00Z", "16 Sep", "rma", "ESD-SE-11", "K", False, 4,
     "Module returned as suspected failure following panel upgrade. Bench: no fault found.", "no fault found",
     {"linkedRmaId": "RMA-S-2609-0142"}),
    (9, "2026-09-16T17:15:00Z", "16 Sep", "call", "ESD-SE-11", "K", True, None,
     "Upgraded two panels at the school; one maps, the other stops partway. Rolled it back to {{fw:EST4@4.0}} for now.", "the other stops partway", {}),
    (10, "2026-09-17T15:30:00Z", "17 Sep", "case", "ESD-SW-09", "K", False, None,
     "Devices not found after upgrade. Loop 1 fine, loops 2 and 3 partial.", "Devices not found after upgrade", {}),
    (11, "2026-09-17T18:05:00Z", "17 Sep", "call", "ESD-SE-14", "ship", False, None,
     "Is there a known issue with the latest {{platform:EST4}} firmware and mapping? Seeing it on a three-loop job.", "known issue", {}),
    (12, "2026-09-17T19:44:00Z", "17 Sep", "case", "ESD-CA-04", "K", True, None,
     "Rolled back to {{fw:EST4@4.0}} and mapping completed. Holding further upgrades at this site.", "Rolled back to", {}),
    (13, "2026-09-18T02:10:00Z", "18 Sep", "afterHours", "ESD-SE-02", "dl", False, 5,
     "Acceptance test with the AHJ tomorrow and the loop won't map since the update.", "the loop won't map since the update", {}),
    (14, "2026-09-18T14:26:00Z", "18 Sep", "email", "ESD-SE-02", "K", False, None,
     "Can you confirm whether {{fw:EST4@4.1}} changes how panels with more than two loops are mapped? Two jobs affected.", "more than two loops", {}),
    (15, "2026-09-18T16:50:00Z", "18 Sep", "case", "ESD-SE-14", "K", True, None,
     "Mapping stalls around 60% on loop 2 after the update. Rolled back; fine on {{fw:EST4@4.0}}.", "Mapping stalls around 60%", {}),
    (16, "2026-09-21T14:12:00Z", "21 Sep", "call", "ESD-SW-12", "K", False, None,
     "New install went straight to {{fw:EST4@4.1}} — loop won't fully map. Is {{fw:EST4@4.0}} still available to download?", "loop won't fully map", {}),
    (17, "2026-09-21T15:38:00Z", "21 Sep", "case", "ESD-CA-06", "ship", False, None,
     "Devices not found on loop 3 after the update. Same symptom a colleague reported last week.", "Devices not found on loop 3", {}),
    (18, "2026-09-22T13:05:00Z", "22 Sep", "email", "ESD-SE-11", "K", True, None,
     "Third job with the loop mapping issue after {{fw:EST4@4.1}}; rolled this one back to {{fw:EST4@4.0}} as well. Please advise before we upgrade the rest.", "loop mapping issue", {}),
    (19, "2026-09-22T16:47:00Z", "22 Sep", "rma", "ESD-SW-09", "K", False, None,
     "Loop module returned after mapping failure post-upgrade. Bench: no fault found.", "no fault found",
     {"linkedRmaId": "RMA-S-2609-0177"}),
    (20, "2026-09-23T15:20:00Z", "23 Sep", "call", "ESD-SE-14", "dl", False, None,
     "Acceptance test postponed — loop mapping incomplete since the firmware update.", "loop mapping incomplete", {}),
    (21, "2026-09-23T18:33:00Z", "23 Sep", "case", "ESD-SW-12", "K", False, None,
     "Building owner asking whether to hold the remaining panels on {{fw:EST4@4.0}} until there is guidance.", "hold the remaining panels", {}),
    (22, "2026-09-24T03:55:00Z", "23 Sep", "afterHours", "ESD-CA-06", "ship", False, None,
     "Loop won't map after the update and the inspector is booked. What can we do tonight?", "Loop won't map after the update", {}),
    (23, "2026-09-25T14:08:00Z", "25 Sep", "case", "ESD-SE-02", "K", False, None,
     "Devices not found after upgrade on a four-loop panel. Two loops fine, two partial.", "Devices not found after upgrade", {}),
]


def build_evidence():
    out = []
    for n, ts, local, ch, partner, ki, rb, feat, text, hl, extra in EVIDENCE:
        region, place = PARTNER_REGION[partner]
        rec = {"id": f"EV-2609-{n:04d}", "signalId": "fw-4-1", "channel": ch, "channelLabel": CH_LABEL[ch],
               "partnerId": "{{partner:%s}}" % partner, "region": "{{region:%s}}" % region,
               "place": "{{place:%s}}" % place, "localDateLabel": local, "timestampUtc": ts,
               "text": text, "highlight": hl, "featured": feat is not None}
        if feat is not None:
            rec["featuredOrder"] = feat
        rec["firmwareSource"] = "record" if ki == "K" else "imputed"
        if ki != "K":
            rec["imputedFrom"] = "ship date" if ki == "ship" else "download log"
        rec["mentionsRollback"] = rb
        rec.update(extra)
        out.append(rec)
    return out


def band(c, panels):
    lo = max(0.0, c - 1.645 * math.sqrt(c)) * 1000 / panels
    hi = (c + 1 + 1.645 * math.sqrt(c)) * 1000 / panels
    return r1(lo), r1(hi)


def build_lineage():
    p40, p41 = [], []
    for i in range(26):
        lo, hi = band(FW40_CONTACTS[i], FW40_PANELS[i])
        p40.append({"week": i + 1, "weekStart": WEEKS[i]["weekStart"], "contacts": FW40_CONTACTS[i],
                    "panels": FW40_PANELS[i], "rate": FW40_RATE[i], "rateLow": lo, "rateHigh": hi})
    for j in range(4):
        i = 22 + j
        lo, hi = band(FW41_CONTACTS[j], FW41_PANELS[j])
        p41.append({"week": i + 1, "weekStart": WEEKS[i]["weekStart"], "contacts": FW41_CONTACTS[j],
                    "panels": FW41_PANELS[j], "rate": FW41_RATE[j], "rateLow": lo, "rateHigh": hi})
    return {
        "title": "Contacts per 1,000 panel-weeks — fw 4.1 vs 4.0 (synthetic)",
        "series": [
            {"label": "4.0 (prior)", "versionRaw": "4.0", "colour": "#d4d4d4", "points": p40},
            {"label": "fw 4.1 (synthetic)", "versionRaw": "4.1", "colour": "#f97316", "points": p41},
        ],
        "aggregate": {"label": "EST4 RMA rate — in control", "unit": "% (4-week rolling)", "values": RMA_RATE,
                      "limit": 0.35, "current": 0.28},
        "markers": [
            {"week": 23.4, "date": "2026-09-02", "label": "2 Sep · fw 4.1 released (synthetic)", "style": "release"},
            {"week": 25.4, "date": "2026-09-16", "label": "16 Sep · threshold crossed — third independent partner",
             "style": "threshold", "pulse": True},
            {"week": 28.3, "date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "style": "review"},
        ],
        "annotation": {"text": "21 days earlier", "fromWeek": 25.4, "toWeek": 28.3},
        "futureWeeks": [27, 28],
        "denominatorLabel": "Panels on version",
        "tooltipTemplate": "Week of {weekStart} · 4.1: {rate41} per 1,000 panel-weeks ({contacts41} contacts / {panels41} panels) · 4.0: {rate40} ({contacts40} / {panels40}) · EST4 RMA rate {rmaRate}%",
        "headlineCheck": {"contacts": 23, "panels": 1240, "weeks": 3, "rate": 6.2, "baselineRate": 2.0},
    }


def build_signal_fw41(fw41_signal):
    v01 = VALUE_REGISTER[0][2]
    v02 = VALUE_REGISTER[1][2]
    hero = dict(fw41_signal)
    hero.update({
        "headerTitle": "Signal #1 of 5 — firmware 4.1 cohort",
        "subline": "First seen 4 Sep · above threshold since 16 Sep · routed to VP Engineering 16 Sep 06:10 UTC · SIG-2609-001 (synthetic)",
        "gateFooter": "LiSN aids resolution. Nothing is sent until the owner approves.",
        "whyRanked": {"title": "#1 of 5 · Why ranked here?",
                      "line": "Rank score 0.84 · next: D-2 date-code window 0.71",
                      "footnote": "Ranking = severity × rate ratio × panels on version × source independence × est. field cost. The score orders signals; it is not a probability."},
    })
    return {
        "signal": hero,
        "lineage": build_lineage(),
        "cohort": {
            "signalId": "fw-4-1", "panels": 1240, "sites": 610, "partners": 9,
            "serialRange": "E4-S-2403xxxx to E4-S-2611xxxx", "eligibleNotUpgraded": 5560,
            "regions": [
                {"region": "{{region:US-SE}}", "panels": 540, "sites": 262, "partners": 4, "contacts": 11},
                {"region": "{{region:US-SW}}", "panels": 430, "sites": 214, "partners": 3, "contacts": 8},
                {"region": "{{region:Canada}}", "panels": 270, "sites": 134, "partners": 2, "contacts": 4},
            ],
            "siteTypes": [{"type": "Commercial office", "share": 0.58}, {"type": "Education", "share": 0.31},
                          {"type": "Other", "share": 0.11}],
            "noSymptom": {"panels": 412, "sites": 180},
            "exportEnabled": False, "exportTooltip": "Export disabled in demo",
        },
        "evidence": build_evidence(),
        "rmas": [
            {"id": "RMA-S-2609-0142", "signalId": "fw-4-1", "serial": "E4-S-25184417", "partnerId": "{{partner:ESD-SE-11}}",
             "returnedDate": "2026-09-16", "disposition": "NFF", "label": "NFF — no fault found", "linkedEvidenceId": "EV-2609-0008"},
            {"id": "RMA-S-2609-0177", "signalId": "fw-4-1", "serial": "E4-S-26030962", "partnerId": "{{partner:ESD-SW-09}}",
             "returnedDate": "2026-09-22", "disposition": "NFF", "label": "NFF — no fault found", "linkedEvidenceId": "EV-2609-0019"},
        ],
        "rmaNote": "Two NFF returns in three weeks. Without the join, each closes as 'no fault found' on its own.",
        "method": [
            {"k": "Detector", "v": "Difference-in-differences, event-time aligned; Poisson exact test."},
            {"k": "Trigger", "v": "≥2.5× and ≥3 independent partners."},
            {"k": "Baseline window", "v": "26 weeks, prior version, event-time aligned."},
            {"k": "Knowledge vs inference", "v": "K 15 in record · I 8 imputed (5 ship date, 3 download logs)."},
            {"k": "Source independence", "v": "0.78 · voice incl. after-hours, case, email, RMA."},
            {"k": "Suppressed", "v": "4 how-to questions about new 4.1 features; 2 same-site recontacts."},
            {"k": "Exposure to date (V-01)", "v": v01},
            {"k": "Exposure projected (V-02)", "v": v02},
            {"k": "Clock", "v": "UTC."},
        ],
        "audit": [
            {"ts": "2026-09-25T07:55:00Z", "label": "25 Sep 07:55 · Viewed by President (weekly digest)"},
            {"ts": "2026-09-22T11:30:00Z", "label": "22 Sep 11:30 · Evidence updated · RMA-S-2609-0177 linked"},
            {"ts": "2026-09-17T14:22:00Z", "label": "17 Sep 14:22 · Viewed by VP Service & Tech Support"},
            {"ts": "2026-09-16T06:10:00Z", "label": "16 Sep 06:10 · Threshold crossed · routed to VP Engineering (owner), cc VP Service & Tech Support · draft investigation brief generated"},
            {"ts": "2026-09-04T16:40:00Z", "label": "4 Sep 16:40 · New phrasing cluster opened"},
        ],
        "auditRuntime": {"drawerOpen": "President · just now"},
        "drawer": {"title": "Evidence · 23", "tabs": ["Snippets 23", "Linked RMAs 2", "Cohort", "Method & audit"],
                   "footer": "Every claim links to the interactions behind it. No customer-facing action taken. Synthetic scenario — not KGS data.",
                   "sourceLinkTooltip": "Disabled in demo", "featuredHeading": "Featured", "allHeading": "All 23"},
        "draftBrief": {
            "id": "IB-2609-004",
            "title": "Engineering investigation brief — {{platform:EST4}} firmware {{fw:EST4@4.1}} (synthetic)",
            "meta": "IB-2609-004 (synthetic) · Drafted by LiSN 16 Sep 2026 06:10 UTC · refreshed 25 Sep 18:00 UTC",
            "chipPending": "DRAFT — not sent", "chipApproved": "APPROVED · {ts}",
            "sections": [
                {"h": "1. Summary", "body": "Panels on 4.1 report 'devices not found after upgrade' at 6.2 contacts per 1,000 panel-weeks over their first three weeks, against 2.0 on panels still on 4.0 over the same weeks (3.1×; Poisson exact p<0.001). Severity S2 · cliff at release (2 Sep) · incident flag off. Confidence M 0.70 (K 15 / I 8)."},
                {"h": "2. Excerpts", "body": "23 interactions from 9 partners across calls, cases, email, RMA narratives and the after-hours line. Two linked RMAs returned no fault found (RMA-S-2609-0142, RMA-S-2609-0177). Five installers report rolling back to 4.0. New phrasing first seen 4 Sep; above threshold since 16 Sep at the third independent partner.", "attachFeatured": True},
                {"h": "3. Cohort", "body": "1,240 panels on 4.1 at ~610 sites; {{region:US-SE}} 540, {{region:US-SW}} 430, {{region:Canada}} 270. Serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic). 5,560 eligible panels not yet upgraded."},
                {"h": "4. Configurations & counter-evidence", "body": "Symptom concentrates in configurations with more than two signalling loops. 412 panels on 4.1 at 180 sites show no symptom. Effect persists across certified and uncertified installers (indeterminate below N=15)."},
                {"h": "5. Candidate causes (ranked) — candidate, not cause", "items": [
                    "H1 · Loop mapping under 4.1 fails to complete on configurations with more than two signalling loops. For: symptom concentrates in >2-loop configurations; mapping stops around 60%. Against: none yet. Test: bench reproduction on a 3-loop configuration.",
                    "H2 · Device database entries on loops 2–3 not carried through the upgrade. For: loops 2 or 3 named in 6 cases; rollback restores mapping. Against: 412 panels on 4.1 show no symptom. Test: compare pre- and post-upgrade device tables.",
                    "H3 · Installation practice — upgrade without a re-mapping step. For: none specific. Against: persists across certified and uncertified installers. Test: confirm procedure in 5 cases.",
                ], "footer": "LiSN does not determine cause. Engineering decides."},
                {"h": "6. Requested decision", "ordered": [
                    "Approve an engineering reproduction on the candidate configuration.",
                    "Decide whether to pause the staged rollout and download of 4.1.",
                    "Decide whether VP Service & Tech Support may release the draft known-issue note.",
                ], "footer": "Regulatory is consulted if a listed configuration is involved."},
                {"h": "7. Approver", "body": "VP Engineering · cc VP Service & Tech Support · informed: Quality, President"},
            ],
            "footer": "Draft generated by LiSN from the evidence above. Nothing has been sent. Synthetic scenario — not KGS data.",
        },
    }


# ---------------------------------------------------------------------------
# 10. installedBase.json
# ---------------------------------------------------------------------------
SYMPTOMS = [
    ("loop-mapping", "Loop mapping", [148, 62, 71, 54, 43, 34]),
    ("node-offline", "Node offline", [70, 48, 45, 38, 35, 32]),
    ("ground-fault", "Ground fault", [52, 44, 30, 36, 33, 36]),
    ("audio-nca", "Audio / NCA", [61, 38, 22, 27, 25, 25]),
    ("upload-download", "Upload / download", [49, 27, 36, 22, 20, 22]),
    ("not-responding", "Device not responding", [28, 20, 18, 16, 14, 46]),
    ("network-redundancy", "Network redundancy", [38, 16, 14, 12, 12, 12]),
    ("battery-power", "Battery / power", [14, 12, 10, 9, 8, 26]),
]
SYMPTOM_PHRASINGS = {
    "node-offline": ["node offline", "network node dropped", "panel lost a node"],
    "ground-fault": ["ground fault", "earth fault on loop", "intermittent ground"],
    "audio-nca": ["no audio on zone", "NCA trouble", "amplifier trouble"],
    "upload-download": ["upload failed", "download stuck", "config won't transfer"],
    "not-responding": ["device not responding", "detector missing", "no reply from device"],
    "network-redundancy": ["redundant path trouble", "network class A fault", "ring break"],
    "battery-power": ["battery trouble", "AC fail", "low battery"],
}


def build_symptom_details():
    details = [{
        "key": "loop-mapping", "title": "Loop mapping", "chip": "S2", "big": "412", "bigLabel": "contacts",
        "delta": "+14% WoW",
        "grid": [{"label": "Panels on version", "value": "1,240 (fw 4.1)"}, {"label": "Partners", "value": "118"},
                 {"label": "Regions", "value": "3 (fw 4.1 cohort)"}, {"label": "NFF RMAs", "value": "2"},
                 {"label": "Rolled back", "value": "5"}, {"label": "Repeat contact", "value": "22%"}],
        "insight": "Loop-mapping contacts are up 14% overall, but the rise sits almost entirely in {{platform:EST4}} panels on 4.1. On every other platform and version the family is at baseline.",
        "actionLabel": "RECOMMENDED ACTION — awaiting VP Engineering",
        "action": "Open Signal #1 — the cohort, evidence and a draft investigation brief are ready for the owner.",
        "phrasings": ["devices not found", "loop won't map", "rolled back to 4.0", "mapping stops ~60%"],
        "linkTo": "/installed-base/signal/fw-4-1"}]
    for key, label, vals in SYMPTOMS[1:]:
        total = sum(vals)
        wow = rng.choice([-3.1, -2.2, -1.4, -0.6, 0.4, 1.1, 1.8, 2.5])
        partners = int(round(total * rng.uniform(0.28, 0.36)))
        repeat = int(round(rng.uniform(12, 19)))
        details.append({
            "key": key, "title": label, "chip": "Stable", "big": f"{total:,}", "bigLabel": "contacts",
            "delta": f"{'+' if wow >= 0 else '−'}{abs(wow):.1f}% WoW",
            "grid": [{"label": "Platforms at baseline", "value": "6 of 6"}, {"label": "Partners", "value": str(partners)},
                     {"label": "Repeat contact", "value": f"{repeat}%"},
                     {"label": "vs own baseline", "value": f"{rng.choice([0.9, 1.0, 1.0, 1.1]):.1f}×"}],
            "insight": f"{label} contacts sit within their own baseline on every platform and version this week. Nothing to escalate.",
            "actionLabel": "RECOMMENDED ACTION", "action": "No action — within own baseline.",
            "phrasings": SYMPTOM_PHRASINGS[key]})
    return details


def build_installed_base(units):
    cells = []
    for i in range(26):
        rate = DC_RATE[i]
        cells.append({"dateCode": f"26{i + 1:02d}", "units": units[i], "ratePer10k": rate,
                      "relativeRisk": r1(rate / 1.1), "inWindow": 10 <= i <= 13})
    ib_rows = [
        ("{{brand:Edwards}} · {{platform:EST4}}", 1960, "▲ 6.8%", 1.3),
        ("{{brand:Edwards}} · {{platform:EST3/EST3X}}", 720, "▼ 1.2%", 1.0),
        ("{{brand:Edwards}} · {{platform:Edge}}", 540, "▲ 2.1%", 1.1),
        ("{{brand:Kidde Commercial}} · {{platform:VM/VS}}", 610, "▼ 0.8%", 1.0),
        ("{{brand:Aritech}} · {{platform:2X}}", 470, "▲ 0.9%", 1.0),
        ("{{brand:EMS}} · {{platform:FireCell}} / {{platform:SmartCell}}", 420, "▲ 1.5%", 1.0),
        ("{{brand:GST}} · {{platform:GST panel family}}", 380, "▼ 2.4%", 0.9),
        ("{{brand:AirSense}} · {{platform:AirSense aspirating}}", 190, "▲ 0.4%", 1.0),
        ("Detection devices · D-series (synthetic)", 190, "▲ 14.0%", 1.4),
    ]
    status_tone = {"SIGNAL": "amber", "WORKAROUND": "amber", "WATCH": "yellow", "SUPPRESSED": "neutral"}
    phr = [
        ("'devices not found after upgrade' · 'loop comes back half-empty' · 'mapping stops around 60%'", "4 Sep", "9", "4", "Programming – general", "SIGNAL #1", "/installed-base/signal/fw-4-1"),
        ("'rolled back to 4.0'", "9 Sep", "4", "2", "Closed – customer fixed", "WORKAROUND · on #1", "/installed-base/signal/fw-4-1"),
        ("'device not responding' (first 90 days)", "12 Aug", "8", "3", "Device – DOA", "SIGNAL #2", "/installed-base#date-code"),
        ("'NAC goes into trouble after drill reset'", "7 Sep", "7", "3", "Programming – general", "WATCH · unsized", None),
        ("'aspirating flow fault after filter change'", "28 Aug", "3", "2", "Maintenance", "WATCH · practice-leaning", None),
        ("'how do I set up …' ({{platform:Edge}}, after training release)", "18 Aug", "14", "3", "How-to", "SUPPRESSED · adoption, not fault", None),
    ]
    emerging = []
    for i, (p, fs, pa, ch, coded, status, link) in enumerate(phr):
        row = {"id": f"phr-{i + 1}", "cells": [p, fs, pa, ch, coded, status],
               "tone": [None, None, None, None, None, status_tone[status.split(" ")[0]]]}
        if link:
            row["linkTo"] = link
        emerging.append(row)
    lifecycle = [
        ("Ship & receive", 610, "12%", "—", "0"), ("Install & commission", 1720, "24%", "—", "1 ▲"),
        ("Upgrade", 540, "31%", "—", "1 ▲"), ("ITM / inspection", 1980, "18%", "—", "0"),
        ("RMA & warranty", 630, "22%", "18%", "0"),
    ]
    return {
        "title": "Is our installed base healthy?",
        "subtitle": "Interaction-derived view of the installed base, joined to firmware, date-code and RMA data.",
        "kpis": [{"label": "SIGNALS ABOVE THRESHOLD", "value": "2"},
                 {"label": "FIRMWARE COHORTS IN CONTROL", "value": "45 / 46"},
                 {"label": "EST4 RMA RATE", "value": "0.28% · in control", "sub": "limit 0.35%"},
                 {"label": "FIRMWARE RECORDED ON EST4 TROUBLE CASES", "value": "38%"}],
        "interactionsTable": {
            "total": 5480, "delta": "▲ +312 vs last week",
            "rows": [{"id": f"ib-{i + 1}", "cells": [a, f"{b:,}", c, f"{d:.1f}×"], "tone": [None, None, None, ratio_tone(d)]}
                     for i, (a, b, c, d) in enumerate(ib_rows)],
            "footnote": "The {{platform:EST4}} row is only 1.3× — the fw 4.1 cohort is 23 contacts inside 1,960. The platform average hides it; the version denominator does not."},
        "clustersBySeverity": [
            {"label": "S1 · Life-safety (governed)", "caption": "1 cluster · contents restricted", "cliff": 0, "slope": 0,
             "spread": 0, "novel": 1, "restricted": True},
            {"label": "S2 · Material impact", "caption": "2 clusters · 6,040 units", "cliff": 2, "slope": 0, "spread": 0, "novel": 0},
            {"label": "S3 · Operational", "caption": "7 clusters", "cliff": 1, "slope": 3, "spread": 1, "novel": 2},
            {"label": "S4 · Efficiency", "caption": "11 clusters", "cliff": 0, "slope": 8, "spread": 2, "novel": 1},
        ],
        "lineageMonitor": {
            "title": "12-week cohort monitor — contacts per 1,000 panel-weeks",
            "sub": "Each release against its own baseline · 45 of 46 cohorts in control",
            "weeks": list(range(15, 27)),
            "series": [{"label": "{{platform:EST4}} 4.1 (syn.)", "values": [None] * 8 + FW41_RATE, "colour": "#f97316"},
                       {"label": "{{platform:EST4}} 4.0 (syn.)", "values": FW40_RATE[14:], "colour": "#d4d4d4"}]
                      + [{"label": l, "values": v, "colour": c} for l, c, v in LINEAGE_OTHERS]
                      + [{"label": "EST4 RMA rate — in control (%)", "values": RMA_RATE[14:], "colour": "#737373", "dashed": True}],
            "markers": [{"week": 23.4, "date": "2026-09-02", "label": "2 Sep · fw 4.1 released (synthetic)", "style": "release"}],
        },
        "dateCode": {
            "cells": cells,
            "bracket": "4.2× adjacent weeks · 4,800 units · 1,900 in stock at 11 distributors (containable)",
            "pChart": SKU_RETURN, "limit": 0.30, "current": 0.21,
            "stats": [{"label": "FIELD REPLACEMENT EXPOSURE", "value": "Field replacement exposure up to $0.35m", "money": True},
                      {"label": "CONTAINABLE", "value": "1,900 units (40%) containable"},
                      {"label": "COMPONENT LOT", "value": "14 share one component lot"}],
            "confidence": {"level": "M", "p": 0.65, "short": "M 0.65 · K 22 / I 9",
                           "known": {"count": 22, "label": "serial-verified"},
                           "inferred": {"count": 9, "label": "date codes read from photos"}},
            "owner": "Director Product Quality (owner) · cc VP Engineering",
            "gate": "Draft containment memo (8D D1–D3 pre-filled) — awaiting Quality approval",
            "leadLine": "19 days ahead of the scheduled review",
            "caption": "The aggregate is green by construction. The window is not.",
        },
        "emergingPhrasing": emerging,
        "contactsVsRma": {
            "trouble": TROUBLE, "fw41": [0] * 22 + FW41_CONTACTS, "rmas": RMAS, "rmaRate": RMA_RATE, "limit": 0.35,
            "lineLabel": "EST4 RMA rate — in control",
            "markers": [{"week": 28.3, "date": "2026-10-07", "label": "7 Oct · next monthly RMA review", "style": "review"}],
            "caption": "The 23 fw 4.1 contacts are about 2% of {{platform:EST4}} trouble traffic in those weeks. The RMA line has not moved and will not be reviewed until 7 Oct.",
        },
        "signalWall": {
            "title": "LiSN Signal Wall", "subtitle": WALL_SUB, "pill": WALL_PILL,
            "cards": [
                {"id": "wall-fw41", "chips": ["#1 of 5", "S2 · Quality"],
                 "title": "fw 4.1 (synthetic) drifting from 4.0 on {{platform:EST4}}",
                 "body": "Panels on 4.1 report 'devices not found after upgrade' at 6.2 per 1,000 panel-weeks vs 2.0 on 4.0 over the same three weeks. 9 partners, 3 regions; the EST4 RMA rate is inside its limit.",
                 "metric": "3.1× own baseline", "trend": "▲ Rising · above threshold since 16 Sep — third independent partner",
                 "linkLabel": "Open signal →", "linkTo": "/installed-base/signal/fw-4-1",
                 "confidenceShort": "M 0.70 · K 15 / I 8", "owner": "VP Engineering", "spark": FW41_RATE},
                {"id": "wall-d2", "chips": ["#2 of 5", "S2 · Quality"],
                 "title": "Detector D-2, date codes 2611–2614 (synthetic)",
                 "body": "Early-life 'device not responding' at 4.2× adjacent production weeks; 14 of 22 cases share one component lot. SKU return rate 0.21% vs 0.30% limit.",
                 "metric": "1,900 units still in distributor stock", "trend": "▲ Rising · containable",
                 "linkLabel": "Open signal →", "linkTo": "/installed-base#date-code",
                 "confidenceShort": "M 0.65 · K 22 / I 9", "owner": "Director Product Quality", "spark": DC_RATE[8:16]},
                {"id": "wall-rollback", "chips": ["S3 · Operational", "Workaround"],
                 "title": "'Rolled back to 4.0' in 5 cases",
                 "body": "Installers at 4 partners are rolling panels back to 4.0 to restore mapping. No bulletin advises it. Often the earliest trace of a release regression.",
                 "metric": "5 cases · 4 partners", "trend": "Linked to Signal #1",
                 "linkLabel": "Open signal →", "linkTo": "/installed-base/signal/fw-4-1", "owner": "VP Engineering"},
                {"id": "wall-edge-howto", "chips": ["Easing", "Suppressed"],
                 "title": "{{platform:Edge}} how-to cluster after training release",
                 "body": "Tagged adoption, not fault. Kept out of signals; contacts back to baseline in week 26.",
                 "metric": "58 how-to clusters suppressed (all domains)", "trend": "▼ Easing"},
            ],
            "footer": [{"value": 0, "label": "S1 · Life-safety"}, {"value": 2, "label": "S2 · Material impact"},
                       {"value": 1, "label": "S3 · Operational"}, {"value": 1, "label": "Easing"}],
        },
        "enhanced": {
            "title": "✨ Why field issues surface late", "badge": "Joined with RMA & firmware data",
            "violetLine": "Uses read-only extracts of RMA records, the firmware release log and the panel registry.",
            "right": ["Data as of 25 Sep 18:00 UTC", "2 cohorts above threshold"],
            "joinTags": [{"key": "RMA", "value": "RMA records (read-only)"}, {"key": "FW", "value": "firmware release log"},
                         {"key": "REGISTRY", "value": "panel registry"}],
            "stats": [{"label": "Trouble cases this week", "value": "1,610"}, {"label": "Firmware in record", "value": "38%"},
                      {"label": "Recoverable from text", "value": "61% of the rest"},
                      {"label": "RMAs with serial / date code", "value": "44%"}, {"label": "NFF share", "value": "18%"},
                      {"label": "First mention → RMA coded", "value": "19 days (median)"}],
            "driversTitle": "Why signals arrive late",
            "drivers": [
                {"label": "Firmware not captured on the case", "meta": "62% of EST4 trouble cases · version inferred from text or ship date", "value": 62, "max": 100, "chip": "High"},
                {"label": "Symptom coded to a generic reason", "meta": "27% of loop-mapping contacts coded 'Programming – general'", "value": 27, "max": 100, "chip": "High"},
                {"label": "NFF return with no link back to the calls", "meta": "18% of RMAs · 2 in Signal #1", "value": 18, "max": 100, "chip": "Medium"},
                {"label": "Same fault, different words across partners", "meta": "9 phrasings merged into 1 on Signal #1", "value": 9, "max": 10, "chip": "Medium"},
                {"label": "Fixed locally by rollback — no RMA raised", "meta": "5 cases in Signal #1", "value": 5, "max": 10, "chip": "Watch"},
            ],
            "watchlistTitle": "Cohorts on watch",
            "watchlist": [
                {"chip": "S2", "title": "fw 4.1 cohort (synthetic)", "age": "wk 3", "stage": "Stage: owner decision",
                 "blocker": "Blocker: awaiting VP Engineering", "tags": ["EST4", "1,240 panels"]},
                {"chip": "S2", "title": "D-2 · 2611–2614 (synthetic)", "age": "wk 6", "stage": "Stage: containment decision",
                 "blocker": "Blocker: awaiting Quality", "tags": ["1,900 in stock"]},
                {"chip": "S3", "title": "'NAC trouble after drill reset'", "age": "wk 3", "stage": "Stage: taxonomy decision",
                 "blocker": "Unsized until joined", "tags": ["7 partners"]},
                {"chip": "S3", "title": "Aspirating flow after filter change", "age": "wk 4", "stage": "Stage: attribution",
                 "blocker": "Practice-leaning — with Training", "tags": ["3 partners"]},
            ],
        },
        "diagnosis": {
            "title": "LiSN evidence summary", "confidenceShort": "M 0.70",
            "main": "A firmware cohort, not a platform problem: {{platform:EST4}} panels on 4.1 (synthetic) report loop-mapping failures at 3.1× panels still on 4.0, across 9 unrelated partners in 3 regions.",
            "changed": "Release on 2 Sep; new phrasing first seen 4 Sep; above threshold since 16 Sep at the third independent partner; installers have started rolling back to 4.0.",
            "decideFirst": "VP Engineering to decide: reproduction on configurations with more than two signalling loops, and whether to pause the 4.1 download — before the 7 Oct RMA review.",
        },
        "symptomStack": {
            "title": "Trouble conditions by platform",
            "stacks": ["{{platform:EST4}}", "{{platform:EST3/EST3X}}", "{{platform:Edge}}", "{{platform:2X}}",
                       "{{platform:VM/VS}}", "Other"],
            "bars": [{"key": k, "label": l, "values": v} for k, l, v in SYMPTOMS],
            "details": build_symptom_details(),
            "defaultOpen": "loop-mapping",
        },
        "stable": {"rows": [{"text": "45 / 46 firmware cohorts in control"},
                            {"text": "Nuisance-alarm contacts within own baseline for every detector family"},
                            {"text": "{{platform:Edge}} how-to cluster after training release — adoption, not fault (suppressed)"}],
                   "footer": "Shown so you can see what LiSN did not escalate."},
        "lifecycle": [{"id": f"lc-{i + 1}", "cells": [s, f"{n:,}", r, nff, sig],
                       "tone": [None, None, None, None, "amber" if "▲" in sig else None]}
                      for i, (s, n, r, nff, sig) in enumerate(lifecycle)],
        "panelCopy": {
            "P-0": {"title": "Key figures"},
            "P-A": {"title": "Interactions read by brand × platform", "sub": "QUALITY INTERACTIONS · THIS WEEK",
                    "columns": ["BRAND · PLATFORM", "INTERACTIONS", "WoW", "RATE vs OWN BASELINE"]},
            "P-B": {"title": "Above-baseline clusters by severity",
                    "sub": "This week · quality domain · split by type (cliff / slope / spread / novel)"},
            "P-C": {"title": "12-week cohort monitor — contacts per 1,000 panel-weeks",
                    "sub": "Each release against its own baseline · 45 of 46 cohorts in control"},
            "P-D": {"title": "Date-code window under a green aggregate", "sub": "Cliff on the serial axis",
                    "right": "SKU return rate 0.21% — inside limit", "anchor": "date-code", "unit": "early-life contacts per 10,000 units"},
            "P-E": {"title": "New phrasing & emerging failures", "right": "9 phrasings merged into 3 signals",
                    "sub": "One fault phrased many ways, counted once. What agents code today is shown beside it.",
                    "columns": ["PHRASING CLUSTER", "FIRST SEEN", "PARTNERS", "CHANNELS", "CODED TODAY AS", "STATUS"]},
            "P-F": {"title": "Contacts lead, RMAs lag — {{platform:EST4}}", "unit": "trouble contacts / week · RMA rate % (4-week rolling)"},
            "P-G": {"title": "LiSN Signal Wall", "sub": WALL_SUB},
            "P-H": {"title": "✨ Why field issues surface late", "anchor": "why-late"},
            "P-I": {"title": "LiSN evidence summary"},
            "P-J": {"title": "Trouble conditions by platform", "unit": "contacts this week"},
            "P-K": {"title": "What's stable", "footer": "Shown so you can see what LiSN did not escalate."},
            "P-L": {"title": "WHERE DOES IT SURFACE? — SIGNAL CONCENTRATION BY LIFECYCLE STAGE",
                    "columns": ["STAGE", "INTERACTIONS (THIS WEEK)", "REPEAT CONTACT", "NFF SHARE", "SIGNALS ABOVE THRESHOLD"]},
        },
    }


# ---------------------------------------------------------------------------
# 11. channel.json
# ---------------------------------------------------------------------------
def build_channel():
    league = [
        ("ESD-SE-07", "US-SE", "ESD / Strategic Partner", 3.1, "38% (14%)", "−22%", "3 of 5", "4 calls", "S2 · above threshold", "/channel#esd-se-07"),
        ("ESD-SW-12", "US-SW", "ESD / Strategic Partner", 1.2, "16% (15%)", "−3%", "6 of 7", "—", "Within band", None),
        ("ESD-MW-05", "US-MW", "ESD / Strategic Partner", 1.1, "14% (13%)", "+1%", "5 of 6", "—", "Within band", None),
        ("ESD-CA-06", "Canada", "ESD / Strategic Partner", 1.2, "14% (12%)", "+2%", "4 of 5", "—", "Within band (in Signal #1 cohort)", "/installed-base/signal/fw-4-1"),
        ("DLR-NE-118", "US-NE", "Dealer", 1.8, "21% (12%)", "−6%", "2 of 2", "2 calls", "S3 · watch", None),
        ("DLR-W-044", "US-W", "Dealer", 1.5, "17% (13%)", "−5%", "1 of 2", "1 call", "S3 · watch", None),
        ("DIST-UK-031", "UK", "Distributor", 1.6, "27% (16%)", "−3%", "4 of 4", "—", "S3 · watch (→ Separation)", "/separation"),
    ]
    league_rows = []
    for p, reg, tier, fr, rec, sell, cert, comp, status, link in league:
        tone_status = "amber" if status.startswith("S2") else ("slate" if status.startswith("S3") else "green")
        row = {"id": p.lower(), "cells": [p, reg, tier, f"{fr:.1f}×", rec, sell, cert, comp, status],
               "tone": [None, None, None, ratio_tone(fr), None, None, None, None, tone_status]}
        if link:
            row["linkTo"] = link
        league_rows.append(row)
    cert = [("ESD-SE-07", "3 of 5 (2 lapsed W22)", 1, "2.4×", 2), ("ESD-SW-12", "6 of 7", 2, "2.1×", 3),
            ("DLR-NE-118", "2 of 2", 1, "2.3×", 2), ("ESD-MW-05", "5 of 6", 1, "1.9×", 3),
            ("DLR-W-044", "1 of 2", 1, "2.2×", 2), ("ESD-SE-14", "4 of 4", 1, "1.8×", 3),
            ("DLR-SW-201", "2 of 3", 1, "2.0×", 3)]
    backorder = [("N-3", "Notification N-3 (synthetic)", [2.1, 0.1, 0.1], 3.2),
                 ("D-5", "Detectors D-5 (synthetic)", [0.5, 0.2, 0.1], 1.2),
                 ("P-2", "Power supplies P-2 (synthetic)", [0.4, 0.1, 0.1], 1.4),
                 ("M-4", "Modules M-4 (synthetic)", [0.3, 0.1, 0.1], 1.1),
                 ("A-1", "Aspirating A-1 (synthetic)", [0.2, 0.1, 0.1], 1.0),
                 ("C-2", "Cabinets C-2 (synthetic)", [0.2, 0.05, 0.05], 0.9)]
    bo_details = [{
        "key": "N-3", "title": "Notification family N-3 (synthetic)", "chip": "S2 · Supply", "big": "$2.3m",
        "bigLabel": "backlog at risk", "money": True,
        "grid": [{"label": "Lines pushed ≥3 wks", "value": "312"}, {"label": "Partners", "value": "11"},
                 {"label": "Projects with inspection ≤30 days", "value": "4"}, {"label": "OTD vs revised", "value": "94%"},
                 {"label": "OTD vs original", "value": "71%"}, {"label": "Consequence language", "value": "3.2×"}],
        "insight": "Cancel and substitute language started rising in week 21, before OTD against revised promise dates moved at all.",
        "actionLabel": "RECOMMENDED ACTION — awaiting VP Supply Chain",
        "action": "Allocation priority list — awaiting Supply Chain approval · no partner messages sent.",
        "phrasings": ["cancel", "substitute", "project delay", "inspection date", "liquidated damages"],
        "linkTo": "/channel#backorder"}]
    for key, label, vals, ov in backorder[1:]:
        total = round(sum(vals), 2)
        lines = int(round(total * rng.uniform(95, 125)))
        bo_details.append({
            "key": key, "title": label, "chip": "Within band", "big": f"${total:.1f}m", "bigLabel": "backlog at risk",
            "money": True,
            "grid": [{"label": "Lines pushed ≥3 wks", "value": str(lines)},
                     {"label": "Consequence language", "value": f"{ov:.1f}×"},
                     {"label": "Partners", "value": str(int(round(rng.uniform(3, 8))))}],
            "insight": f"Consequence language {ov:.1f}× its own baseline — within band. Backlog here is converting on its revised dates.",
            "actionLabel": "RECOMMENDED ACTION", "action": "No action — within own baseline.", "phrasings": []})
    pins = [
        (21, "Second escalation on the same job this month — still waiting on L3."),
        (22, "Two of our certified techs have lapsed and the next class is October."),
        (23, "[competitor] has quoted us on the next two projects."),
        (24, "Third call about the same site — we need someone who knows the panel."),
        (25, "We are pricing the school job with [competitor] as well."),
        (26, "No one has come back on last week's L3 escalation."),
    ]
    return {
        "title": "Are we holding our channel?",
        "subtitle": "Strategic Partner and distributor friction against each partner's own baseline — joined to sell-in, backlog and certification.",
        "kpis": [{"label": "SIGNALS ABOVE THRESHOLD", "value": "2"},
                 {"label": "NA STRATEGIC PARTNERS WITHIN OWN BASELINE", "value": "419 / 420"},
                 {"label": "N-3 OTD vs ORIGINAL", "value": "71%", "sub": "94% vs revised"},
                 {"label": "CERTIFIED-TECHNICIAN LAPSES, DRIFTING PARTNER", "value": "2 of 5"},
                 {"label": "BACKLOG AT RISK", "value": "$2.3m", "sub": "2.4% of ~$95m open backlog", "money": True},
                 {"label": "CERTIFICATIONS LAPSING ≤30 DAYS", "value": "186", "sub": "all partners"}],
        "league": league_rows,
        "partnerTimeline": {
            "partnerId": "{{partner:ESD-SE-07}}", "friction": FRICTION, "baseline": BASELINE, "sellIn": SELL_IN,
            "sellInLY": SELL_IN_LY,
            "markers": [{"week": 16, "date": "2026-07-13", "label": "W16 · friction above own baseline", "style": "event"},
                        {"week": 22, "date": "2026-08-24", "label": "W22 · 2 certifications lapsed", "style": "event"},
                        {"week": 24.4, "date": "2026-09-11", "label": "11 Sep · above threshold", "style": "threshold"}],
            "pins": [{"week": w, "text": t} for w, t in pins],
            "caption": "Friction led sell-in by ~5 weeks. Two backorder cases excluded from the friction score and linked to N-3. 2 of its cases sit in the fw 4.1 cohort.",
            "valueLine": "$6.4m sell-in in view · ≈ $1.4m / yr gap if −22% persists · $0.9m backlog · 34 days ahead of the 15 Oct QBR",
            "confidenceShort": "H on orders and certifications (K) · M on friction→orders (I)",
            "gate": "Partner-recovery brief — awaiting Regional GM approval · no outreach sent",
        },
        "backorder": {
            "title": "Backlog at risk by SKU family", "stacks": ["NA", "{{region:UK-EU}}", "Other"],
            "bars": [{"key": k, "label": l, "values": v, "overlay": o} for k, l, v, o in backorder],
            "details": bo_details, "defaultOpen": "N-3",
            "otd": {"revised": 94, "original": 71}, "consequenceRatio": CONSEQUENCE_W15_26,
            "leadLine": "13 days ahead of the 5 Oct OTIF report",
        },
        "certification": {
            "rows": [{"id": f"cert-{p.lower()}", "cells": [p, c, str(l), x, str(s)]} for p, c, l, x, s in cert],
            "caption": "Assigning 18 seats in the October {{platform:EST4}} class to 7 high-load partners would cut ~210 contacts a quarter."},
        "switching": [
            {"id": "sw-houston", "cells": ["{{place:Houston}} metro", "[competitor]", "11 vs 3 (3.7×)", "top reason: N-3 lead time", "S3 WATCH"],
             "tone": [None, None, "orange", None, "yellow"]},
            {"id": "sw-georgia", "cells": ["{{place:Georgia}}", "[competitor]", "7 vs 5 (1.4×)", "top reason: lead time", "Below threshold"],
             "tone": [None, None, "amber", None, "neutral"]},
            {"id": "sw-texas", "cells": ["{{place:Texas}}", "[competitor]", "6 vs 5 (1.2×)", "top reason: price", "Below threshold"],
             "tone": [None, None, "amber", None, "neutral"]},
        ],
        "enhanced": {
            "title": "✨ Why partners drift", "badge": "Joined with ERP orders, LMS & backlog",
            "violetLine": "Uses read-only extracts of ERP orders, the LMS certification log and the open backlog.",
            "right": ["Data as of 25 Sep 18:00 UTC", "1 partner above threshold"],
            "joinTags": [{"key": "ERP", "value": "orders and sell-in"}, {"key": "LMS", "value": "certifications"},
                         {"key": "BACKLOG", "value": "open order lines"}],
            "stats": [{"label": "Signals above threshold", "value": "2"},
                      {"label": "Sell-in in view", "value": "$6.4m", "money": True},
                      {"label": "Backlog at risk", "value": "$2.3m", "money": True},
                      {"label": "Recontact (drifting partner)", "value": "38%"},
                      {"label": "Certified lapses", "value": "2 of 5"}, {"label": "Look-alike routed to AR", "value": "1"}],
            "driversTitle": "Why partners drift",
            "drivers": [
                {"label": "Open technical escalations", "meta": "34% of drifting-partner friction · 2 open L3", "value": 34, "max": 40, "chip": "High"},
                {"label": "Backorder without a revised date", "meta": "26% · linked to N-3", "value": 26, "max": 40, "chip": "High"},
                {"label": "Certified technicians lapsed", "meta": "17% · 2 of 5 lapsed in week 22", "value": 17, "max": 40, "chip": "Medium"},
                {"label": "Competitor quote named", "meta": "13% · [competitor] in 4 calls", "value": 13, "max": 40, "chip": "Medium"},
                {"label": "Invoice / portal friction after cutover", "meta": "10% · → Separation", "value": 10, "max": 40, "chip": "Watch"},
            ],
            "watchlistTitle": "Partners on watch",
            "watchlist": [
                {"chip": "S2", "title": "{{partner:ESD-SE-07}}", "age": "6 wks", "stage": "Stage: executive intervention",
                 "blocker": "Blocker: 2 open L3 escalations", "tags": ["3 of 5 certified", "$6.4m sell-in"]},
                {"chip": "S3", "title": "{{partner:DLR-NE-118}}", "age": "2 wks", "stage": "Stage: competitive",
                 "blocker": "[competitor] named in 2 calls", "tags": ["Dealer"]},
                {"chip": "S3", "title": "{{partner:DLR-W-044}}", "age": "3 wks", "stage": "Stage: certification",
                 "blocker": "1 of 2 technicians certified", "tags": ["Dealer"]},
                {"chip": "S3", "title": "{{partner:DIST-UK-031}}", "age": "4 wks", "stage": "Stage: invoicing",
                 "blocker": "Invoice entity mismatch → Separation", "tags": ["{{region:UK}}"]},
            ],
        },
        "stable": {"rows": [{"text": "419 / 420 NA Strategic Partners within own baseline"},
                            {"text": "One partner's order dip coincides with a credit hold — routed to AR, not scored as drift."}]},
        "signalWall": {
            "title": "LiSN Signal Wall", "subtitle": WALL_SUB, "pill": WALL_PILL,
            "cards": [
                {"id": "wall-esd07", "chips": ["#3 of 5", "S2 · Channel"],
                 "title": "ESD-SE-07 drifting against its own baseline (synthetic)",
                 "body": "ESD-SE-07 friction has run 3.1× its own baseline for six weeks; recontact 38% vs 14%; a competitor named in 4 calls. EST4 sell-in is −22% while territory peers are +4%.",
                 "metric": "3.1× own baseline", "trend": "▲ Rising · above threshold since 11 Sep",
                 "linkLabel": "Open signal →", "linkTo": "/channel#esd-se-07",
                 "confidenceShort": "H on orders (K) · M on friction→orders (I)", "owner": "Regional GM NA", "spark": FRICTION[20:]},
                {"id": "wall-n3", "chips": ["#4 of 5", "S2 · Supply"],
                 "title": "Notification family N-3 — backorder consequence (synthetic)",
                 "body": "Notification family N-3: OTD is 94% against revised promise dates but 71% against the original. Cancel/substitute language 3.2× across 11 NA partners; 4 projects face inspections within 30 days.",
                 "metric": "$2.3m backlog at risk", "trend": "▲ Rising · above threshold since 22 Sep",
                 "linkLabel": "Open signal →", "linkTo": "/channel#backorder",
                 "confidenceShort": "H on dates (K) · M on cancellation (I)", "owner": "VP Supply Chain", "spark": CONSEQUENCE_W15_26[6:]},
                {"id": "wall-switching", "chips": ["S3 · Operational", "WATCH"],
                 "title": "Switching language in Houston metro",
                 "body": "[competitor] named in 11 interactions vs 3 on its own baseline (3.7×); top reason: N-3 lead time. Below the signal threshold; watched.",
                 "metric": "11 vs 3 (3.7×)", "trend": "▲ Rising · watch"},
                {"id": "wall-credit-hold", "chips": ["Suppressed"],
                 "title": "Order dip during a credit hold",
                 "body": "One partner's order dip coincides with a credit hold — routed to AR, not scored as drift.",
                 "metric": "1 look-alike routed to AR", "trend": "Routed to AR"},
            ],
            "footer": [{"value": 0, "label": "S1 · Life-safety"}, {"value": 2, "label": "S2 · Material impact"},
                       {"value": 1, "label": "S3 · Operational"}, {"value": 1, "label": "Suppressed"}],
        },
        "diagnosis": {
            "title": "LiSN evidence summary", "confidenceShort": "H on orders (K) · M on friction→orders (I)",
            "main": "One Strategic Partner, not the channel: ESD-SE-07 is drifting against its own baseline while territory peers grow.",
            "changed": "Friction above own baseline from week 16 and 3.1× for six weeks; recontacts 38% vs 14%; two of five certified technicians lapsed in week 22; a competitor named in four calls; EST4 sell-in −22% vs last year.",
            "decideFirst": "Regional GM NA to decide on the draft partner-recovery brief — GM visit, named L3 engineer, two priority class seats. No outreach has been sent.",
        },
        "panelCopy": {
            "C-0": {"title": "Key figures"},
            "C-B": {"title": "Partner league vs own baseline", "anchor": "esd-se-07",
                    "columns": ["PARTNER", "TERRITORY", "TIER", "FRICTION vs OWN", "RECONTACT", "SELL-IN vs LY", "CERTIFIED", "COMPETITOR NAMED", "STATUS"]},
            "C-C": {"title": "ESD-SE-07 — friction vs sell-in (synthetic)",
                    "sub": "Stream = weekly interactions vs baseline band; line = EST4 sell-in vs last year (dashed).",
                    "unit": "interactions / week · sell-in $k / week (USD, illustrative)"},
            "C-D": {"title": "Backlog at risk by SKU family", "sub": "vs revised promise / vs original promise",
                    "right": "OTD 94% | OTD 71%", "anchor": "backorder", "unit": "$m (USD, illustrative)"},
            "C-E": {"title": "Certification gap vs support load",
                    "columns": ["PARTNER", "CERTIFIED TECHS", "LAPSING ≤30D", "CONTACTS PER JOB vs PEERS", "SEATS REQUESTED"]},
            "C-F": {"title": "Switching language — competitor names redacted",
                    "columns": ["AREA", "COMPETITOR", "MENTIONS vs OWN BASELINE", "TOP REASON", "STATUS"]},
            "C-G": {"title": "✨ Why partners drift"},
            "C-H": {"title": "What's stable / suppressed"},
            "C-I": {"title": "LiSN Signal Wall", "sub": WALL_SUB},
            "C-J": {"title": "LiSN evidence summary"},
        },
    }


# ---------------------------------------------------------------------------
# 12. separation.json
# ---------------------------------------------------------------------------
TOPICS = [("entity-mismatch", "Invoice entity mismatch", 142, 38, 14, 2.7),
          ("remit-to", "Remit-to / bank details", 102, 28, 10, 2.8),
          ("vat", "VAT number", 54, 15, 6, 2.5),
          ("portal-login", "Portal login", 276, 75, 22, 3.4),
          ("part-number", "Part-number mapping", 53, 14, 8, 1.8),
          ("missing-ack", "Missing acknowledgement", 24, 6, 5, 1.2),
          ("legacy-address", "Legacy address bounced", 20, 5, 3, 1.7)]
COUNTRY_SHARES = [0.55, 0.20, 0.12, 0.08, 0.05]
TOPIC_PHRASINGS = {
    "remit-to": ["new bank details", "remit-to not recognised", "which account do we pay"],
    "vat": ["VAT number changed", "VAT mismatch on invoice", "reverse charge query"],
    "portal-login": ["can't log in to the new portal", "password reset", "account not migrated"],
    "part-number": ["part number re-keyed", "price mismatch", "old part number rejected"],
    "missing-ack": ["no order acknowledgement", "ack missing", "order not confirmed"],
    "legacy-address": ["email bounced", "old address", "mailbox not found"],
}


def build_separation(remit, portal, control):
    bars, details = [], []
    for key, label, total, w26, pre, ratio in TOPICS:
        # jitter shares slightly, then split with largest remainder (GEN ≈ 55/20/12/8/5)
        jitter = [s * (1 + rng.uniform(-0.06, 0.06)) for s in COUNTRY_SHARES]
        shares = [j / sum(jitter) for j in jitter]
        bars.append({"key": key, "label": label, "values": largest_remainder(total, shares), "overlay": ratio})
    details.append({
        "key": "entity-mismatch", "title": "Invoice entity mismatch", "chip": "S2", "big": "142",
        "bigLabel": "contacts since 1 Sep",
        "grid": [{"label": "Distributors", "value": "14"}, {"label": "Invoices linked", "value": "87"},
                 {"label": "Value", "value": "£0.46m"}, {"label": "Repeat contact", "value": "41%"},
                 {"label": "Avg age", "value": "12.4 d"}, {"label": "Control", "value": "1.1×"}],
        "insight": "Most contacts quote an invoice entity that does not match the entity on the distributor's PO. The pattern starts on 1 Sep and is absent in the control regions.",
        "actionLabel": "RECOMMENDED ACTION — awaiting CIO triage",
        "action": "Separation defect ticket — candidate: PO-entity mapping in the EDI layer (engineering to confirm).",
        "phrasings": ["invoice entity doesn't match our PO", "new bank details", "which entity do we pay", "credit note", "re-issue"],
        "linkTo": "/separation"})
    for key, label, total, w26, pre, ratio in TOPICS[1:]:
        chip = "S2" if ratio >= 2.5 else ("S3" if ratio >= 1.5 else "Within band")
        if key == "portal-login":
            action_label, action = ("RECOMMENDED ACTION — awaiting Regional GM UK-EU",
                                    "Knowledge fix: login guidance for the new portal — draft, not sent.")
        elif chip == "Within band":
            action_label, action = "RECOMMENDED ACTION", "No action — within own baseline."
        else:
            action_label, action = ("RECOMMENDED ACTION — awaiting CIO triage",
                                    "Included in the draft separation defect ticket.")
        details.append({
            "key": key, "title": label, "chip": chip, "big": str(total), "bigLabel": "contacts since 1 Sep",
            "grid": [{"label": "This week", "value": str(w26)}, {"label": "Pre-cutover / wk", "value": str(pre)},
                     {"label": "vs pre-cutover", "value": f"{ratio:.1f}×"}, {"label": "Control", "value": "1.1×"}],
            "insight": f"{label} contacts are {ratio:.1f}× their pre-cutover rate since 1 Sep; the control regions are at 1.1×.",
            "actionLabel": action_label, "action": action, "phrasings": TOPIC_PHRASINGS[key]})
    return {
        "title": "Is the separation costing us?",
        "subtitle": "What distributors experience after each entity, portal, ERP and EDI cutover — against a control region not yet cut over.",
        "kpis": [{"label": "SIGNALS ABOVE THRESHOLD", "value": "1"},
                 {"label": "CUTOVERS CLEAN vs CONTROL", "value": "3 of 4"},
                 {"label": "INVOICES IN DISPUTE", "value": "£1.1m / 212", "money": True},
                 {"label": "DSO TOP-10 UK-EU", "value": "+6 days", "sub": "≈ £1.0m cash tied up", "money": True},
                 {"label": "PORTAL-LOGIN CONTACTS", "value": "3.4×"},
                 {"label": "EXCESS CONTACTS", "value": "~48 / week"}],
        "cutoverTimeline": {
            "series": [{"name": "UK-EU remit-to & entity contacts", "values": remit, "colour": "#f97316"},
                       {"name": "UK-EU portal login", "values": portal, "colour": "#f59e0b"},
                       {"name": "Control regions — remit-to & entity", "values": control, "dashed": True, "colour": "#a3a3a3"}],
            "markers": [{"week": 16, "date": "2026-07-14", "label": "14 Jul · NA portal", "style": "cutover"},
                        {"week": 19, "date": "2026-08-04", "label": "4 Aug · APAC order management", "style": "cutover"},
                        {"week": 20, "date": "2026-08-12", "label": "12 Aug · EDI mapping", "style": "cutover"},
                        {"week": 23, "date": "2026-09-01", "label": "1 Sep · UK-EU entity", "style": "cutover"},
                        {"week": 24.3, "date": "2026-09-10", "label": "10 Sep · above threshold", "style": "threshold"}],
            "caption": "2.7× since 1 Sep (30 → 81 a week); control 1.1×. Above threshold since 10 Sep.",
        },
        "scorecard": [
            {"id": "co-na-portal", "cells": ["NA portal", "14 Jul", "420 ESDs", "1.0×", "1.0×", "Clean vs control", "CIO / PMO"],
             "tone": [None, None, None, None, None, "green", None]},
            {"id": "co-apac-om", "cells": ["APAC order management", "4 Aug", "96 distributors", "1.0×", "1.0×", "Clean vs control", "CIO / PMO"],
             "tone": [None, None, None, None, None, "green", None]},
            {"id": "co-edi", "cells": ["EDI mapping", "12 Aug", "6 EDI distributors", "1.1×", "1.0×", "Clean vs control", "Order-management lead"],
             "tone": [None, None, None, None, None, "green", None]},
            {"id": "co-ukeu-entity", "cells": ["UK-EU entity", "1 Sep", "14 distributors", "2.7×", "1.1×", "S2", "CIO / CFO / Regional GM UK-EU"],
             "tone": [None, None, None, "orange", None, "amber", None], "linkTo": "/separation"},
        ],
        "topicStack": {"title": "Separation contacts by topic — UK-EU, since 1 Sep",
                       "stacks": ["{{region:UK}}", "{{region:DE}}", "{{region:NL}}", "{{region:FR}}", "Other EU"],
                       "bars": bars, "details": details, "defaultOpen": "entity-mismatch"},
        "topicTotals": [{"key": k, "label": l, "total": t, "perWeekW26": w, "preCutoverPerWeek": p, "ratio": r}
                        for k, l, t, w, p, r in TOPICS],
        "defectSplit": {"faqable": 118, "defect": 180,
                        "caption": "FAQ-able contacts go to knowledge fixes; defects go to IT. ~290 contacts avoidable over 6 weeks if fixed."},
        "gates": SEPARATION_GATES,
        "enhanced": {
            "title": "✨ Why invoices go into dispute", "badge": "Joined with AR & invoice data",
            "violetLine": "Uses read-only extracts of AR disputes and invoice headers for the 14 affected distributors.",
            "right": ["Data as of 25 Sep 18:00 UTC", "212 invoices in dispute"],
            "joinTags": [{"key": "AR", "value": "disputes (read-only)"}, {"key": "INVOICES", "value": "headers and entities"},
                         {"key": "REGION", "value": "UK-EU"}],
            "stats": [{"label": "Disputed invoices", "value": "212"}, {"label": "Value", "value": "£1.1m", "money": True},
                      {"label": "Closed since cutover", "value": "64"}, {"label": "Avg age", "value": "11.2 d"},
                      {"label": "Beyond terms", "value": "38"}, {"label": "DSO top-10", "value": "+6 d"}],
            "driversTitle": "Why invoices go into dispute",
            "drivers": [
                {"label": "Invoice entity ≠ PO entity", "meta": "41% · 87 invoices", "value": 87, "max": 100, "chip": "High"},
                {"label": "Remit-to bank details not recognised", "meta": "24% · 51 invoices", "value": 51, "max": 100, "chip": "High"},
                {"label": "Part number re-keyed — price mismatch", "meta": "15% · 32 invoices", "value": 32, "max": 100, "chip": "Medium"},
                {"label": "Duplicate after re-issue", "meta": "11% · 23 invoices", "value": 23, "max": 100, "chip": "Medium"},
                {"label": "VAT number mismatch", "meta": "9% · 19 invoices", "value": 19, "max": 100, "chip": "Watch"},
            ],
            "watchlistTitle": "Aged disputes",
            "watchlist": [
                {"chip": "S2", "title": "{{partner:DIST-UK-004}}", "age": "19 d", "stage": "£148k · 23 invoices",
                 "blocker": "Blocker: entity mismatch — awaiting credit note", "tags": ["{{region:UK}}"]},
                {"chip": "S2", "title": "{{partner:DIST-DE-012}}", "age": "16 d", "stage": "£96k · 14 invoices",
                 "blocker": "Blocker: remit-to not recognised", "tags": ["{{region:DE}}"]},
                {"chip": "S3", "title": "{{partner:DIST-NL-007}}", "age": "14 d", "stage": "£71k · 9 invoices",
                 "blocker": "Blocker: part number re-keyed", "tags": ["{{region:NL}}"]},
                {"chip": "S3", "title": "{{partner:DIST-UK-019}}", "age": "12 d", "stage": "£55k · 7 invoices",
                 "blocker": "Blocker: duplicate after re-issue", "tags": ["{{region:UK}}"]},
            ],
        },
        "legacy": {"rows": [
            {"text": "31% of Canada partners' training enquiries still use the legacy address · forwarding ends in 45 days", "chip": "S3"},
            {"text": "Repository retiring 31 Dec holds 1,840 interactions linked to 12 active signals", "chip": "S3"}],
            "gate": "Evidence-preservation request — awaiting Legal"},
        "signalWall": {
            "title": "LiSN Signal Wall", "subtitle": WALL_SUB, "pill": WALL_PILL,
            "cards": [
                {"id": "wall-ukeu", "chips": ["#5 of 5", "S2 · Separation"],
                 "title": "UK-EU entity cutover — remit-to and invoice friction",
                 "body": "Since UK-EU invoicing moved to the new KGS entity on 1 Sep, remit-to and entity contacts are 2.7× pre-cutover against 1.1× in the control regions. Top cluster: 'invoice entity doesn't match our PO entity'.",
                 "metric": "2.7× (control 1.1×)", "trend": "▲ Rising · above threshold since 10 Sep",
                 "linkLabel": "Open signal →", "linkTo": "/separation#scorecard",
                 "confidenceShort": "H on timing (K) · M on cause (I)", "owner": "CIO / separation PMO", "spark": remit[20:]},
                {"id": "wall-legacy", "chips": ["S3 · Operational"], "title": "Legacy address residue",
                 "body": "31% of Canada partners' training enquiries still use the legacy address; forwarding ends in 45 days.",
                 "metric": "31% on the legacy address", "trend": "Stable · watch"},
                {"id": "wall-clean", "chips": ["Clean vs control"],
                 "title": "NA portal, APAC order management and EDI mapping",
                 "body": "Three cutovers show no distributor friction against the control regions (1.0×–1.1×).",
                 "metric": "3 of 4 cutovers clean", "trend": "Stable"},
            ],
            "footer": [{"value": 0, "label": "S1 · Life-safety"}, {"value": 1, "label": "S2 · Material impact"},
                       {"value": 1, "label": "S3 · Operational"}, {"value": 3, "label": "Clean"}],
        },
        "diagnosis": {
            "title": "LiSN evidence summary", "confidenceShort": "H on timing (K) · M on cause (I)",
            "main": "One cutover, not the programme: friction is concentrated in the 14 distributors on the new UK-EU entity.",
            "changed": "Since 1 Sep, remit-to and entity contacts 2.7× (control 1.1×) and portal logins 3.4×; 212 invoices, £1.1m, in dispute; top cluster 'invoice entity doesn't match our PO entity'.",
            "decideFirst": "CIO to triage the draft separation defect ticket (candidate: PO-entity mapping in the EDI layer — engineering to confirm). CFO to decide on a dunning pause for the 212 disputed invoices.",
        },
        "disputeTrend": {"weeks": [22, 23, 24, 25, 26], "cumulativeGbpK": [95, 240, 520, 810, 1100],
                         "dsoDeltaDays": [0, 1, 3, 5, 6], "currency": "GBP"},
        "panelCopy": {
            "S-0": {"title": "Key figures"},
            "S-B": {"title": "Friction by cutover — affected region vs control", "unit": "contacts / week"},
            "S-C": {"title": "Cutover scorecard", "anchor": "scorecard",
                    "columns": ["CUTOVER", "DATE", "AFFECTED", "FRICTION vs PRE", "CONTROL", "STATUS", "OWNER"]},
            "S-D": {"title": "Separation contacts by topic — UK-EU, since 1 Sep", "unit": "contacts since 1 Sep"},
            "S-E": {"title": "Defect vs communicated change",
                    "columns": ["Expected, communicated change (FAQ-able)", "Defect (wrong entity, lost acknowledgement)"]},
            "S-F": {"title": "Decisions", "footer": "Send buttons stay disabled; the owner is named on each."},
            "S-G": {"title": "✨ Why invoices go into dispute", "unit": "£ (GBP, illustrative)"},
            "S-H": {"title": "Legacy residue"},
            "S-I": {"title": "LiSN Signal Wall", "sub": WALL_SUB},
            "S-J": {"title": "LiSN evidence summary"},
        },
    }


# ---------------------------------------------------------------------------
# 13. askLisn.json
# ---------------------------------------------------------------------------
ASK = [
    {"q": "Why is fw 4.1 ranked above the D-2 date-code window?",
     "a": "Both are S2 cliffs. fw 4.1 scores higher on source independence (0.78 across 9 partners) and its exposure grows with every upgrade; D-2 is partly containable in distributor stock. Rank score 0.84 vs 0.71 — an ordering, not a probability.",
     "cites": [{"label": "Why ranked here?", "route": "/installed-base/signal/fw-4-1"},
               {"label": "Date-code window", "route": "/installed-base#date-code"}]},
    {"q": "What would raise the confidence on fw 4.1?",
     "a": "Firmware in the case record for the 8 imputed cases, and configuration data on the 412 panels without the symptom. Either moves K up and I down. Engineering reproduction would test H1 directly.",
     "cites": [{"label": "Method & audit"}, {"label": "EV-2609-0007", "evidenceId": "EV-2609-0007"}]},
    {"q": "Which partners appear in more than one place?",
     "a": "{{partner:ESD-SE-07}} (partner drift; 2 cases in the fw 4.1 cohort), {{partner:ESD-CA-06}} (fw 4.1 cohort; within band on the partner league) and {{partner:DIST-UK-031}} (channel watch; UK-EU invoicing).",
     "cites": [{"label": "EV-2609-0003", "evidenceId": "EV-2609-0003"}, {"label": "Partner league", "route": "/channel#esd-se-07"}]},
]


# ---------------------------------------------------------------------------
# 14. Write
# ---------------------------------------------------------------------------
def write(name, obj, tokenised=True):
    if tokenised:
        obj = tokenise(obj)
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return path


def main():
    os.makedirs(OUT, exist_ok=True)
    # Draw GEN values in a fixed order so the seed yields the same output every run.
    meta = build_meta()
    remit, portal, control = gen_cutover_series()
    units = gen_datecode_units()
    signals = build_signals()
    exec_ = build_exec()
    monitor = build_monitor(signals)
    hero = build_signal_fw41(signals[0])
    ib = build_installed_base(units)
    ch = build_channel()
    sep = build_separation(remit, portal, control)

    write("anonymise.json", ANONYMISE, tokenised=False)
    write("meta.json", meta)
    write("exec.json", exec_)
    write("monitor.json", monitor)
    write("signal_fw41.json", hero)
    write("installedBase.json", ib)
    write("channel.json", ch)
    write("separation.json", sep)
    write("askLisn.json", ASK)
    for fn in sorted(os.listdir(OUT)):
        print(f"wrote data/{fn:<20} {os.path.getsize(os.path.join(OUT, fn)):>8,} bytes")


if __name__ == "__main__":
    main()
