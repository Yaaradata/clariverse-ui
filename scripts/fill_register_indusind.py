"""Fill the IndusInd number register and sensitivities from IND-D1 (docs/indusind/IND-D1_Track_A_Verification.md, 2 Oct
2026) and its v1.1 arithmetic addendum (D01–D11, S01–S07, 3 Oct 2026).

Every value below is copied from an IND-D1 row (VERIFIED, CORRECTED or CONFLICT RESOLVED: the verified value is used).
D and S entries are recomputed from their inputs here and must match the addendum's display; a mismatch fails the run.
IND-D1 does not say standalone or consolidated, so entity_basis stays "as_presented". Held entries (H01–H10) stay held.
Run once after IND-D1 changes; the pipeline then reads data/public/indusind_*.json as before.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REG_F = ROOT / "data" / "public" / "indusind_register.json"
SENS_F = ROOT / "data" / "public" / "indusind_sensitivities.json"

DECK = ("IndusInd Bank Investor Presentation Q1 FY27",
        "https://www.indusind.bank.in/content/dam/indusind-corporate/investors/investor-presentation/FY2026-2027/Investor-Presentation-Q1-FY26-27.pdf",
        "2026-07-22")
CALL = ("IndusInd Bank Q1 FY27 analyst call transcript",
        "https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf",
        "2026-07-22")
FED = ("Federal Bank Q1 FY27 press release",
       "https://www.federal.bank.in/documents/10180/1148302360/Press+Release+Q1+FY+27.pdf/7e534416-1740-8651-83ae-bb60f04ca961?t=1784277402845",
       "2026-07-17")
YES = ("YES BANK Q1 FY27 press release and investor presentation (NSE)",
       "https://nsearchives.nseindia.com/corporate/YESBANK_18072026134956_SE_Intimation_Press_Release_Investors_Presentation_18072026_Signed.pdf",
       "2026-07-18")
IDFC = ("IDFC FIRST Bank Investor Presentation Q1 FY27",
        "https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/financial-results/Investor-Presentation_Q1FY27_2507_Final.pdf",
        "2026-07-25")
RBL_PPT = ("RBL Bank Investor Presentation Q1 FY27", "https://webassets.rbl.bank.in/ir_admin/financial_highlights/InvestorPPTQ1FY27.pdf",
           "2026-07-17")
RBL_RATES = ("RBL Bank interest rates page", "https://www.rbl.bank.in/interest-rates", "2026-10-02")
FED_DEP = ("Federal Bank deposit rates page", "https://www.federal.bank.in/deposit-rate", "2026-10-02")
FED_SAV = ("Federal Bank savings rates page", "https://www.federal.bank.in/savings-rate", "2026-10-02")
YES_RATES = ("YES BANK all rates and charges",
             "https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT13C66A7E18434B48BC40248F6202F4A4/native/allratesandcharges_pdf.pdf?download=false",
             "2026-10-02")
BRSR = ("IndusInd Bank BRSR FY2024-25 (NSE filing)",
        "https://nsearchives.nseindia.com/corporate/INDUSINDBK1_07082025225746_SEIntimationforBRSRmergedsigned.pdf", "2025-08-07")
RBI_897 = ("RBI press release 2026-2027/897", "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63374", "2026-08-14")
RBI_1753 = ("RBI press release 2024-2025/1753", "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=59351", "2024-12-20")
RBI_GOV = ("RBI notification RBI/2026-27/177", "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13555&Mode=0", "2026-07-14")
RBI_RBC = ("RBI notification RBI/2026-27/115", "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13485", "2026-06-15")
RBI_IO = ("RBI notification RBI/CEPD/2025-26/381", "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13271&Mode=0", "2026-01-14")
DPDP = ("DPDP Rules 2025, Gazette G.S.R. 846(E)",
        "https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf", "2025-11-13")
CRISIL = ("CRISIL rating rationale, IndusInd Bank",
          "https://www.crisil.com/mnt/winshare/Ratings/RatingList/RatingDocs/IndusIndBankLimited_August%2019_%202026_RR_402664.html",
          "2026-08-19")
ADD = ("Derived from the bank's reported figures (arithmetic, recomputed 3 Oct 2026)", None, "2026-10-03")

# id: (value, display, source, period override or None)
ROWS = {
    "N01": (414766, "₹4,14,766 crore", DECK, None),
    "N02": (399931, "₹3,99,931 crore", DECK, None),
    "N03": (34620, "₹34,620 crore", DECK, None),
    "N04": (87440, "₹87,440 crore", DECK, None),
    "N05": (35034, "₹35,034 crore", DECK, None),
    "N06": (89899, "₹89,899 crore", DECK, None),
    "N07": (91113, "₹91,113 crore", DECK, None),
    "N08": (5.95, "5.95%", DECK, None),
    "N09": (6.07, "6.07%", DECK, None),
    "N10": (6.44, "6.44%", DECK, None),
    "N11": (4.72, "4.72%", DECK, None),
    "N12": (5.05, "5.05%", DECK, None),  # CONFLICT RESOLVED: 5.68% was the Q1 FY26 cost of savings
    "N13": (190166, "₹1,90,166 crore", DECK, None),
    "N14": (49.5, "49.5%", DECK, None),
    "N15": (150, "about 150 bp", CALL, None),  # display_default stays false (DEC-3)
    "P01": (5.21, "5.21%", FED, None),  # CONFLICT RESOLVED: 5.21%, not 5.25%
    "P02": (5.4, "5.4%", YES, None),
    "P03": (5.96, "5.96%", IDFC, None),
    "P04": (50.8, "50.8%", IDFC, None),
    "P05": (49.8, "49.8%", IDFC, None),
    "P06": (32.7, "32.7%", YES, None),
    "P07": (35.1, "35.1%", YES, None),
    "P08": (32.23, "32.23%, up 188 bp YoY", FED, None),  # QoQ direction not confirmed: "up YoY" only
    "P09": (25.2, "25.2%", RBL_PPT, None),  # CONFLICT RESOLVED: average basis; footnote only
    "P10": (6.25, "6.25%", FED_DEP, "card effective 29 Sep 2026"),  # CORRECTED card date
    "P11": (6.70, "6.70% (48 months)", FED_DEP, "card effective 29 Sep 2026"),
    "P12": (6.65, "6.65%", YES_RATES, "w.e.f. 2 Jun 2026"),  # CORRECTED
    "P13": (7.25, "7.25% (18 months 1 day to under 24 months)", YES_RATES, "w.e.f. 2 Jun 2026"),  # CORRECTED
    "P14": (6.90, "6.90%", RBL_RATES, "page dated 1 Oct 2026"),  # CORRECTED: 6.90%, not 7.00%
    "P15": (6.00, "6.00% on ₹10 lakh–₹3 crore", RBL_RATES, "page dated 1 Oct 2026"),
    "P16": (2.50, "2.50% below ₹10 crore", FED_SAV, "effective 16 Jul 2026"),  # CORRECTED date
    "P17": (3.50, "2.50% below ₹25 lakh; 3.50% for ₹25 lakh to under ₹100 crore", YES_RATES, "w.e.f. 7 Apr 2026"),
    "N16": (16305, "₹16,305 crore, −3% QoQ", CALL, None),
    "N17": (31417, "₹31,417 crore, 10% of loans", DECK, None),  # CORRECTED: Rural Banking, not microfinance
    "N18": (9418, "₹9,418 crore, −3% QoQ, −15% YoY", CALL, None),  # CONFLICT RESOLVED: credit cards
    "N19": (9930, "₹9,930 crore, −4% QoQ", CALL, None),  # CONFLICT RESOLVED: personal loans
    "N20": (6889, "₹6,889 crore, +38% YoY", DECK, None),
    "N21": (99718, "₹99,718 crore, +3% YoY, 31% of loans", DECK, None),
    "N22": (10832, "₹10,832 crore", DECK, None),
    "N23": (12665, "₹12,665 crore", DECK, None),
    "N24": (11298, "₹11,298 crore", DECK, None),
    "N25": (326274, "₹3,26,274 crore, +3% QoQ", DECK, None),
    "N26": (120227, "₹1,20,227 crore, +11% QoQ", DECK, None),
    "N27": (0.78, "0.78%", DECK, None),
    "N28": (0.63, "0.63%", CALL, None),
    "N29": (1.0, "about 1%", CALL, None),
    "N30": ("60/40", "about 60% from operating profit, 40% from lower credit cost", CALL, None),
    "N31": (80062, "80,062", BRSR, None),
    "N32": (15811, "15,811", BRSR, None),
    "N33": (59.20, "₹59.20 lakh", RBI_897, "14 Aug 2026"),
    "N34": (27.30, "₹27.30 lakh", RBI_1753, "20 Dec 2024"),
    "N35": ("2026-10-01", "1 Oct 2026", RBI_GOV, "in force from 1 Oct 2026"),
    "N36": ("2027-01-01", "1 Jan 2027", RBI_RBC, "effective 1 Jan 2027"),
    "N37": ("2026-01-14", "14 Jan 2026", RBI_IO, "Directions of 14 Jan 2026"),
    "N38": ("2026-11", "November 2026", DPDP, "from November 2026"),  # CORRECTED: month and year only
    "N39": ("2027-05", "May 2027", DPDP, "from May 2027"),  # CORRECTED: month and year only
    "N40": ("2026-08-19", "Stable from Negative, AA+ reaffirmed", CRISIL, "19 Aug 2026"),
    "N41": (2.6, "2.6 million+", DECK, "30 Jun 2026"),
    "N42": (6800, "₹6,800 crore+", DECK, None),
}


def r1(x, nd=1):
    return round(x + 0.0, nd)


def derived(v: dict) -> dict:
    """D01–D11 from verified inputs, as in the addendum."""
    d = {}
    d["D01"] = v["N03"] + v["N04"]
    d["D02"] = v["N05"] + v["N06"]
    d["D03"] = v["N01"] - d["D01"]
    d["D04"] = v["N02"] - d["D02"]
    d["D05"] = 100 * d["D01"] / v["N01"]
    d["D06"] = 100 * d["D02"] / v["N02"]
    d["D07"] = 100 * (v["N01"] / v["N02"] - 1)
    d["D08"] = (100 * (v["N04"] / v["N06"] - 1), 100 * (v["N04"] / v["N07"] - 1))
    d["D09"] = (v["N08"] * v["N01"] - v["N11"] * v["N04"]) / d["D03"]
    d["D10"] = v["N11"] * v["N04"] / d["D01"]
    d["D11"] = (100 * (v["N22"] / v["N24"] - 1), 100 * (v["N22"] / v["N23"] - 1))
    return d


def inr(n):
    s = str(int(round(n)))
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts + [tail]) if parts else tail


def sign(x, nd=1):
    return f"{'+' if x > 0 else '−' if x < 0 else ''}{abs(x):.{nd}f}"


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    reg = json.loads(REG_F.read_text(encoding="utf-8"))
    v = {k: r[0] for k, r in ROWS.items()}
    d = derived(v)
    dshow = {
        "D01": (d["D01"], f"₹{inr(d['D01'])} crore"),
        "D02": (d["D02"], f"₹{inr(d['D02'])} crore"),
        "D03": (d["D03"], f"₹{inr(d['D03'])} crore"),
        "D04": (d["D04"], f"₹{inr(d['D04'])} crore"),
        "D05": (r1(d["D05"], 2), f"{d['D05']:.1f}%"),
        "D06": (r1(d["D06"], 2), f"{d['D06']:.1f}%"),
        "D07": (r1(d["D07"], 2), f"{sign(d['D07'])}% QoQ"),
        "D08": (r1(d["D08"][0], 2), f"{sign(d['D08'][0])}% QoQ, {sign(d['D08'][1])}% YoY"),
        "D09": (r1(d["D09"], 2), f"≈{d['D09']:.1f}%"),
        "D10": (r1(d["D10"], 2), f"≈{d['D10']:.1f}%"),
        "D11": (r1(d["D11"][0], 2), f"{sign(d['D11'][0], 0)}% YoY; {sign(d['D11'][1], 0)}% vs the March quarter"),
    }
    # The addendum's displays: a recomputation that disagrees fails the run.
    expect = {"D01": "₹1,22,060 crore", "D02": "₹1,24,933 crore", "D03": "₹2,92,706 crore", "D04": "₹2,74,998 crore",
              "D05": "29.4%", "D06": "31.2%", "D07": "+3.7% QoQ", "D08": "−2.7% QoQ, −4.0% YoY", "D09": "≈7.0%",
              "D10": "≈3.4%", "D11": "−4% YoY; −14% vs the March quarter"}
    bad = [k for k in expect if dshow[k][1] != expect[k]]
    if bad:
        raise SystemExit(f"fill_register: derived rows disagree with the addendum: {[(k, dshow[k][1], expect[k]) for k in bad]}")
    counts = {"verified": 0, "derived": 0, "held": 0}
    for e in reg["entries"]:
        rid = e["id"]
        e["entity_basis"] = "as_presented"
        if rid in ROWS:
            val, disp, src, period = ROWS[rid]
            e.update(value=val, display=disp, source_title=src[0], source_url=src[1], source_date=src[2],
                     status="verified", d1="verified")
            if period:
                e["period"] = period
        elif rid in dshow:
            e.update(value=dshow[rid][0], display=dshow[rid][1], source_title=ADD[0], source_url=None, source_date=ADD[2],
                     status="derived", d1="derived")
        else:
            e["status"], e["d1"] = "held", "held"
        counts[e["status"]] += 1
    reg["d1_loaded"] = True
    reg["about"] = ("IndusInd number register (IND-B3 §2). One figure per entry. Values from IND-D1 (2 Oct 2026) and its v1.1 "
                    "arithmetic addendum (3 Oct 2026), filled by scripts/fill_register_indusind.py. Held entries stay "
                    "\"pending verification\".")
    REG_F.write_text(json.dumps(reg, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")

    sens = json.loads(SENS_F.read_text(encoding="utf-8"))
    n01, n21, n16, n25 = v["N01"], v["N21"], v["N16"], v["N25"]
    s03 = n01 * (d["D06"] - d["D05"]) / 100
    s04 = (s03 * (d["D09"] - v["N11"]) / 100, s03 * (d["D09"] - d["D10"]) / 100)
    svals = {
        "S01": (round(n01 * 0.0001, 2), "≈ ₹41.5 crore a year"),
        "S02": (round(n01 * 0.001, 1), "≈ ₹415 crore a year"),
        "S03": (round(s03), "≈ ₹7,500 crore"),
        "S04": ([round(s04[0]), round(s04[1])], "≈ ₹170–275 crore a year, pre-tax (approximate)"),
        "S05": (round(n21 * 0.001, 1), "≈ ₹100 crore a year"),
        "S06": (round(n16 * 0.001, 1), "≈ ₹16 crore a year"),
        "S07": (round(n25 * 0.0001, 1), "≈ ₹32.6 crore a year"),
    }
    expect_s = {"S01": 41.48, "S02": 414.8, "S03": 7507, "S04": [173, 273], "S05": 99.7, "S06": 16.3, "S07": 32.6}
    bad = [k for k in expect_s if svals[k][0] != expect_s[k]]
    if bad:
        raise SystemExit(f"fill_register: sensitivities disagree with the addendum: {[(k, svals[k][0], expect_s[k]) for k in bad]}")
    caveat_s34 = ("Approximate: Q1 average costs applied to 30 Jun period-end balances. Low end: the CASA lost was all savings, "
                  "at the 4.72% cost of savings. High end: the CASA lost was in today's current-to-savings mix, at the ≈3.4% "
                  "blended cost. Pre-tax and annualised. Not a statement of what the bank paid.")
    for e in sens["entries"]:
        val, disp = svals[e["id"]]
        e.update(value=val, display=disp, status="derived", source="Derived from the bank's reported figures (arithmetic, recomputed 3 Oct 2026)")
        if e["id"] in ("S03", "S04"):
            e["basis_note"] = caveat_s34 if e["id"] == "S04" else (
                "Money moved from CASA to term deposits, at the June deposit base. As new CASA money instead, restoring "
                "the March CASA ratio needs ≈ ₹10,900 crore. " + caveat_s34.split(". Low end")[0] + ".")
            e.pop("build_note", None)
    SENS_F.write_text(json.dumps(sens, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"fill_register: {counts['verified']} verified, {counts['derived']} derived, {counts['held']} held; "
          f"{len(svals)} sensitivities derived; derived rows and sensitivities match the addendum")
    return 0


if __name__ == "__main__":
    sys.exit(main())
