"""Rule-based detection and redaction of people's names and social handles (B4 §8, B7 §E2: never name a real person).

Shared by the public pipeline (scripts/hdfc_pipeline/normalise.py, classify.py) and by scripts/check_pii.py, so the
redaction and the check use one definition.

A statistical NER model (spaCy) cannot run in this build environment: the machine's application-control policy blocks
its native libraries. So recognition is rule-based, in five layers:
  1. a denylist of known public figures (bank executives, public officials, public figures), each with its role tag;
  2. social handles: only institutional accounts on an exact allowlist survive; everything else becomes [handle];
  3. honorifics (Mr, Mrs, Ms, Shri, Smt, Dr …) followed by capitalised words;
  4. name lexicons: a known given name followed by a capitalised word, or a capitalised word followed by a known
     surname (Indian and common international names);
  5. a known given name in address position ("Shreyas, can you …") or after a role word ("manager Rajiv").
Each detected name is replaced with a role tag chosen from its context: [bank executive], [public official],
[public figure], [staff member], [named third party] or [named person].

Limits, stated plainly: names written in Devanagari or other scripts, and uncommon names with no honorific, role word
or lexicon hit, can slip through. check_pii.py runs the same detector over everything the screens render.
"""

from __future__ import annotations

import re

# ------------------------------------------------------------------ 1. known public figures (denylist)
# Full names and the short forms people use. Matched case-insensitively on word boundaries.
PUBLIC_FIGURES: dict[str, str] = {
    # HDFC Bank and former HDFC Ltd leadership
    "Sashidhar Jagdishan": "bank executive",
    "Sashi Jagdishan": "bank executive",
    "Jagdishan": "bank executive",
    "Atanu Chakraborty": "bank executive",
    "Atanu": "bank executive",
    "Sashidhar": "bank executive",
    "Bharucha": "bank executive",
    "Kaizad Bharucha": "bank executive",
    "Aditya Puri": "bank executive",
    "Bhavesh Zaveri": "bank executive",
    "Srinivasan Vaidyanathan": "bank executive",
    "Deepak Parekh": "bank executive",
    "Keki Mistry": "bank executive",
    # Public officials
    "Nirmala Sitharaman": "public official",
    "Sitharaman": "public official",
    "Narendra Modi": "public official",
    "Modi ji": "public official",
    "Sanjay Malhotra": "public official",
    "Shaktikanta Das": "public official",
    "Amit Shah": "public official",
    "Piyush Goyal": "public official",
    "Ashwini Vaishnaw": "public official",
    # Public figures
    "Rahul Gandhi": "public figure",
    "Donald Trump": "public figure",
    "Trump": "public figure",
    "Mukesh Ambani": "public figure",
    "Gautam Adani": "public figure",
    "Ratan Tata": "public figure",
    "Virat Kohli": "public figure",
    "Shah Rukh Khan": "public figure",
    "Amitabh Bachchan": "public figure",
}
# Handles of people (not offices) that name a public figure.
PERSON_HANDLES: dict[str, str] = {
    "nsitharaman": "public official",
    "nsitharamanoffc": "public official",
    "narendramodi": "public official",
    "rahulgandhi": "public figure",
    "amitshah": "public official",
    "piyushgoyal": "public official",
    "ashwinivaishnaw": "public official",
    # Offices of named office-holders: tagged, not shown.
    "pmoindia": "public office",
    "finminindia": "public office",
}

# ------------------------------------------------------------------ 2. institutional handles (exact allowlist)
INSTITUTION_HANDLES = {
    h.lower()
    for h in [
        "HDFC_Bank", "HDFCBank", "hdfcbank", "HDFCBank_Cares", "HDFCBankNews", "HDFCBankPayZapp", "PayZapp",
        "HDFCLIFE", "hdfcsec", "HDFCERGOGIC", "hdfcmf", "HomeLoansByHDFC", "CarebyHDFC_HL", "HDFCsecurities",
        "RBI", "RBIsays", "RBI_India", "RBIOmbudsman", "UPI_NPCI", "NPCI_NPCI", "NPCI_BHIM",
        "IndiaSebi", "SEBI_India", "IRDAI_India", "Cyberdost", "cybercrimeindia",
        "DFS_India", "ICICIBank", "SBI_Card", "TheOfficialSBI", "AxisBank", "KotakBankLtd", "Paytm", "PhonePe",
        "GooglePay", "amazonIN", "Flipkart", "IndiGo6E", "airindia", "jagograhakjago", "consaff",
    ]
}
HANDLE_RE = re.compile(r"(?<![\w.])@(\w{2,30})")
REDDIT_USER_RE = re.compile(r"(?<![\w/])/?u/[A-Za-z0-9_-]{3,30}")

# ------------------------------------------------------------------ 3–5. name lexicons
HONORIFIC = r"(?:Mr|Mrs|Ms|Miss|Mister|Shri|Shree|Smt|Sri|Dr|Prof)\.?"
CAP = r"[A-Z][a-z]{1,20}"

GIVEN_NAMES = set(
    """
    Aarav Aarti Abhay Abhijit Abhinav Abhishek Aditi Aditya Ajay Ajit Akash Akshay Alok Amit Amitabh Amol Amrita Anand
    Anil Anita Anjali Ankit Ankita Ankur Anshul Anup Anupam Anurag Anuj Apoorva Archana Arjun Arnab Arun Aruna Arvind
    Ashish Ashok Ashwin Atanu Atul Avinash Ayush Bhavesh Bhavna Chandan Chetan Deepa Deepak Deepika
    Debmalya Devendra Dhruv Dilip Dinesh Divya Gaurav Gautam Girish Gopal Govind Harish Harsh Harshad Hemant
    Himanshu Isha Jatin Jaya Jayant Jitendra Jyoti Kailash Kajal Kamal Kapil Karan Karthik Kavita Kavya Kiran Kishore
    Kunal Lalit Madhav Madhu Mahesh Manish Manoj Meena Meera Mohan Mohit Mukesh Naveen Neha Nikhil
    Nilesh Nitin Nisha Pankaj Parag Pawan Pradeep Prakash Prasad Prashant Pratik Praveen Preeti Priya
    Priyanka Rahul Raj Rajan Rajat Rajeev Rajesh Rajiv Rajkumar Rakesh Ramesh Ranjit Ravi Rekha Rishabh Ritesh Rohan
    Rohit Sachin Sagar Sahil Sameer Sandeep Sanjay Sanjeev Santosh Sashi Satish Saurabh Shailesh Sharad
    Shashank Shekhar Shivaji Shivam Shreyas Shruti Shubham Siddharth Smita Sneha Sonal Srinivas Subhash Sudhir Sumit
    Sunil Suresh Swati Tanmay Tarun Tushar Uday Umesh Varun Vijay Vikas Vikram Vinay Vinod Vipin Vishal Vivek Yash
    Yogesh Jose Maria Juan Carlos David Michael James Robert John
    """.split()
)
SURNAMES = set(
    """
    Agarwal Aggarwal Ahuja Arora Bajaj Banerjee Bansal Bhat Bhatia Bhattacharya Bose Chakraborty Chatterjee Chauhan
    Chopra Das Dasgupta Desai Deshmukh Deshpande Dubey Dutta Ghosh Goel Gupta Iyer Iyengar Jain Jha Joshi Kapoor
    Khanna Kulkarni Kumar Kumari Malhotra Mehta Menon Mishra Mukherjee Nair Pandey Patel Patil Pawar Pillai Prasad
    Rao Rathore Reddy Saxena Sen Sengupta Shah Sharma Shetty Shukla Singh Sinha Srivastava Tiwari Tonpe Trivedi Tyagi
    Varma Verma Yadav Garcia Smith Johnson Williams Brown Jones Miller Davis Rodriguez Martinez Fernandes Dsouza
    """.split()
)
# Capitalised words that are never names here (products, places, brands, common words).
NOT_NAMES = set(
    """
    HDFC Bank Card Cards Credit Debit Regalia Millennia Infinia Diners Swiggy Tata Neu Marriott Pixel Moneyback
    Freedom Tata Amazon Flipkart India Indian Mumbai Delhi Bangalore Bengaluru Chennai Pune Kolkata Hyderabad Noida
    Gurgaon Gurugram January February March April May June July August September October November December Monday
    Tuesday Wednesday Thursday Friday Saturday Sunday Sir Madam Dear Team Customer Care Support Manager Branch Please
    Hello Hi Thanks Thank The This That Why What When How Who Worst Best Very Not Now Also Still Even Just But And
    PayZapp SmartBuy NetBanking Imperia Private Preferred Classic Google Apple Play Store App Android Iphone UPI RBI
    NPCI Ombudsman Court Consumer Fund Luxembourg Credit Suisse Carlisle
    """.split()
)
# Titles are not names ("Managing Director", "Nodal Officer").
NOT_NAMES |= set(
    """
    Director Directors Chairman Chairperson Officer Officers Head Executive Executives Manager Managers President
    Secretary Governor Minister Deputy Chief Nodal Principal Grievance Redressal Syndicate Book Running Lead Senior
    Junior Regional Zonal Cluster Area General Assistant Vice Joint Managing Constructions Connect Summit Bill
    Nagar Enclave Colony Road Marg Vihar Foundation Structures Great Nice Good Excellent Smooth Horrible Refusal
    Summary Number Code Offer Incentive Awaiting Turnover Send Friend Sept Is No Mera Hdfc Found After Suite Chairmen
    """.split()
)
# Organisations and brands whose names contain a person's name. Masked before any name rule runs.
ORG_PHRASES = [
    "Parag Parikh", "Aditya Birla", "Bharat Connect", "Bharat Bill", "Bharat Summit", "Bajaj Finserv",
    "Bajaj Finance", "Bajaj Allianz", "Kotak Mahindra", "Tata Capital", "Tata Neu", "Tata AIA", "Pranav Constructions", "Pranav Construction",
    "Mahindra Finance", "Birla Sun", "Motilal Oswal", "Ratan Tata Trust", "Jio Financial", "Parag Flexi",
    "Parag Parekh", "Jyoti Structures", "Ashok Leyland", "Isha Foundation", "Shivam Pipe", "Aarti Pharmalabs",
    "Shree Saibaba", "Bharat Digital", "Bharat Loan", "Bharat Ratna", "Sri Lanka", "Rakesh Digital",
]
_ORG_RE = re.compile(r"\b(" + "|".join(re.escape(o) for o in ORG_PHRASES) + r")\b", re.I)

ROLE_STAFF = re.compile(
    r"\b(manager|employee|executive|staff|agent|rm|relationship manager|officer|official|teller|cashier|"
    r"representative|associate|advisor|adviser|dsa|sales ?(?:person|guy|man)|branch head|cluster head|clerk|supervisor)\b",
    re.I,
)
ROLE_EXEC = re.compile(r"\b(ceo|chairman|chairperson|founder|director|md|chief|president|head of)\b", re.I)
ROLE_BEFORE = re.compile(
    r"\b(?:manager|employee|executive|agent|rm|officer|official|representative|named|name is|called|by)\s+$", re.I
)

ALLEGATION = re.compile(
    r"\b(fraud\w*|cheat\w*|scam\w*|alibi|corrupt\w*|brib\w*|liar|lied|lying|thie[fv]\w*|stole|steal\w*|loot\w*|"
    r"criminal\w*|crook\w*|harass\w*|abus\w*|drug\w*|prostitut\w*|rape|molest\w*|arrest\w*|jail|sack(ed)?|"
    r"fire (him|her)|dismiss\w*|suspend (him|her)|stupid|idiot\w*|incompetent|rude|misbehav\w*|threat\w*|"
    r"extort\w*|mis-?sell\w*|whistleblow\w*|deliberate)\b",
    re.I,
)

_FIGURE_RE = re.compile(
    r"(?<![\w@])(" + "|".join(re.escape(n) for n in sorted(PUBLIC_FIGURES, key=len, reverse=True)) + r")(?!\w)",
    re.I,
)
# Hashtags of known public figures (#SashidharJagdishan, #AtanuChakraborty).
_FIGURE_TAG_RE = re.compile(
    r"#(" + "|".join(re.escape(n.replace(" ", "")) for n in sorted(PUBLIC_FIGURES, key=len, reverse=True)) + r")\w*",
    re.I,
)
_HONORIFIC_RE = re.compile(rf"\b{HONORIFIC}\s+({CAP}(?:\s+{CAP}){{0,2}})")
_CAP_TOKEN_RE = re.compile(rf"\b{CAP}\b")
_ROLE_NAME_RE = re.compile(
    rf"\b(?:[Mm]anager|[Ee]mployee|[Ee]xecutive|[Aa]gent|RM|[Oo]fficer|[Rr]epresentative|[Aa]dvisor|[Cc]lerk|[Cc]ashier|[Tt]eller)\s+({CAP}(?:\s+{CAP}){{0,2}})"
)
_SINGLE_RE = re.compile(rf"\b({CAP})\b")
_EXEC_NAME_RE = re.compile(rf"\b(?:[Cc]hairman|CEO|[Ff]ounder|[Gg]overnor|[Mm]inister|MD)\s+({CAP})\b")


def _role_from_context(text: str, start: int, end: int) -> str:
    window = text[max(0, start - 70) : end + 70]
    if ROLE_EXEC.search(window):
        return "bank executive" if re.search(r"hdfc", window, re.I) else "named third party"
    if ROLE_STAFF.search(window):
        return "staff member"
    return "named person"


def _is_name_pair(a: str, b: str) -> bool:
    if a in NOT_NAMES or b in NOT_NAMES:
        return False
    return a in GIVEN_NAMES or b in SURNAMES


def find_names(text: str) -> list[tuple[int, int, str]]:
    """Spans (start, end, role) of people's names in text, non-overlapping, in order. Handles are not included."""
    if not text:
        return []
    spans: list[tuple[int, int, str]] = []
    masked = [(m.start(), m.end()) for m in _ORG_RE.finditer(text)]

    def add(s: int, e: int, role: str):
        if any(not (e <= a or s >= b) for a, b in masked):
            return
        if any(not (e <= a or s >= b) for a, b, _ in spans):
            return
        spans.append((s, e, role))

    for m in _FIGURE_TAG_RE.finditer(text):
        key = next((k for k in PUBLIC_FIGURES if k.replace(" ", "").lower() == m.group(1).lower()), None)
        add(m.start(), m.end(), PUBLIC_FIGURES.get(key, "public figure"))
    for m in _FIGURE_RE.finditer(text):
        key = next((k for k in PUBLIC_FIGURES if k.lower() == m.group(1).lower()), None)
        add(m.start(1), m.end(1), PUBLIC_FIGURES.get(key, "public figure"))
    for m in _HONORIFIC_RE.finditer(text):
        words = [w for w in m.group(1).split() if w not in NOT_NAMES]
        if words:
            add(m.start(), m.start(1) + len(m.group(1)), _role_from_context(text, m.start(), m.end()))
    for m in _ROLE_NAME_RE.finditer(text):
        words = m.group(1).split()
        keep = []
        for w in words:
            if w in NOT_NAMES:
                break
            keep.append(w)
        if keep:
            add(m.start(1), m.start(1) + len(" ".join(keep)), "staff member")
    # Adjacent capitalised words (separated by one space), checked pairwise so "Meet Jose Garcia" still finds the pair.
    toks = [(m.start(), m.end(), m.group(0)) for m in _CAP_TOKEN_RE.finditer(text)]
    i = 0
    while i < len(toks) - 1:
        (s1, e1, a), (s2, e2, b) = toks[i], toks[i + 1]
        if text[e1:s2] == " " and _is_name_pair(a, b):
            end, j = e2, i + 1
            if j + 1 < len(toks):
                s3, e3, c = toks[j + 1]
                if text[e2:s3] == " " and c not in NOT_NAMES and (c in SURNAMES or b in GIVEN_NAMES and a in GIVEN_NAMES):
                    end, j = e3, j + 1
            add(s1, end, _role_from_context(text, s1, end))
            i = j + 1
            continue
        i += 1
    # A known given name on its own is a person wherever it stands ("… back Shreyas ..", "employee Kunal").
    for m in _SINGLE_RE.finditer(text):
        w = m.group(1)
        if w not in GIVEN_NAMES:
            continue
        before = text[max(0, m.start() - 40) : m.start()]
        staff = ROLE_BEFORE.search(before) or ROLE_STAFF.search(text[max(0, m.start() - 70) : m.end() + 70])
        add(m.start(), m.end(), "staff member" if staff else "named person")
    # An executive title followed by a capitalised word ("chairman Chakraborty", "CEO Garcia").
    for m in _EXEC_NAME_RE.finditer(text):
        if m.group(1) in SURNAMES or m.group(1) in GIVEN_NAMES:
            add(m.start(1), m.end(1), _role_from_context(text, m.start(), m.end()))
    return sorted(spans)


def find_handles(text: str) -> list[tuple[int, int, str]]:
    """Spans of non-institutional handles, with the tag they become."""
    out = []
    for m in HANDLE_RE.finditer(text or ""):
        h = m.group(1).lower()
        if h in INSTITUTION_HANDLES:
            continue
        out.append((m.start(), m.end(), PERSON_HANDLES.get(h, "handle")))
    for m in REDDIT_USER_RE.finditer(text or ""):
        out.append((m.start(), m.end(), "handle"))
    return out


def redact_names(text: str | None) -> str:
    """Replace people's names and non-institutional handles with role tags."""
    if not text:
        return text or ""
    spans = find_handles(text)
    taken = [(a, b) for a, b, _ in spans]
    spans += [s for s in find_names(text) if all(s[1] <= a or s[0] >= b for a, b in taken)]
    out = text
    for s, e, role in sorted(spans, reverse=True):
        out = out[:s] + f"[{role}]" + out[e:]
    return out


def names_in(text: str | None) -> list[str]:
    """The names and handles found (for the PII check and for tests)."""
    if not text:
        return []
    return [text[s:e] for s, e, _ in find_handles(text) + find_names(text)]


def alleges_against_named_person(text: str | None) -> bool:
    """True when the text names an individual (by name or by a public-figure handle) and makes an allegation."""
    if not text or not ALLEGATION.search(text):
        return False
    people = [r for _, _, r in find_names(text)]
    people += [r for _, _, r in find_handles(text) if r != "handle"]
    return bool(people)
