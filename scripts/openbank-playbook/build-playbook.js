// build-playbook.js
// Builds: OpenbankCX_DemoPlaybook.docx
// A complete component-by-component explainer for the Openbank CX Signal Room.
// Designed to be readable on a plane and rehearseable line-by-line before the meeting.

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageOrientation, LevelFormat, HeadingLevel, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

/* ───────────────────────────────────────────────────────────────────
   THEME
   ─────────────────────────────────────────────────────────────────── */

const C = {
  ink:        "1A1A1A",  // body
  inkSoft:    "4A4A4A",  // captions
  inkMute:    "7A7A7A",  // muted
  rule:       "D8D8D8",
  ruleSoft:   "EFEFEF",
  accent:     "B7791F",  // amber-700-ish (print-safe)
  accentSoft: "FEF3C7",  // amber-100
  critical:   "B91C1C",
  high:       "B7791F",
  good:       "15803D",
  watch:      "0E7490",
  rowAlt:     "F8F8F8",
  headerBg:   "1A1A1A",
  headerFg:   "FFFFFF",
};

const FONT = "Aptos";   // modern, neutral; falls back gracefully
const FONT_DISPLAY = "Aptos Display";
const FONT_MONO = "Consolas";

const sz = (pt) => pt * 2;  // docx half-points

/* ───────────────────────────────────────────────────────────────────
   PRIMITIVES
   ─────────────────────────────────────────────────────────────────── */

const border = (color = C.rule, size = 4) => ({
  style: BorderStyle.SINGLE, size, color,
});

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

const cellBorders = (color = C.rule) => ({
  top:    border(color),
  bottom: border(color),
  left:   border(color),
  right:  border(color),
});

function p(text, opts = {}) {
  const {
    bold = false, italic = false, size = 10, color = C.ink,
    font = FONT, align = AlignmentType.LEFT, before = 0, after = 80,
    indent, bullet, numbered, spacing = 1.25, keepLines = false,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before, after, line: Math.round(240 * spacing), lineRule: "auto" },
    indent,
    keepLines,
    ...(bullet ? { numbering: { reference: "bullets", level: 0 } } : {}),
    ...(numbered ? { numbering: { reference: "numbers", level: 0 } } : {}),
    children: [
      new TextRun({
        text,
        bold, italics: italic, size: sz(size), color, font,
      }),
    ],
  });
}

function rich(runs, opts = {}) {
  const { align = AlignmentType.LEFT, before = 0, after = 80, spacing = 1.25, indent } = opts;
  return new Paragraph({
    alignment: align,
    indent,
    spacing: { before, after, line: Math.round(240 * spacing), lineRule: "auto" },
    children: runs.map((r) => new TextRun({
      text: r.t,
      bold: r.b, italics: r.i,
      size: sz(r.s || 10),
      color: r.c || C.ink,
      font: r.f || FONT,
    })),
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    children: [new TextRun({ text, bold: true, size: sz(20), color: C.ink, font: FONT_DISPLAY })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, size: sz(14), color: C.ink, font: FONT_DISPLAY })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 6 } },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: sz(11.5), color: C.ink, font: FONT_DISPLAY })],
  });
}

function eyebrow(text, color = C.accent) {
  return new Paragraph({
    spacing: { before: 80, after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: sz(8), color, font: FONT, characterSpacing: 30 })],
  });
}

function spacer(pts = 6) {
  return new Paragraph({ spacing: { before: 0, after: pts * 20 }, children: [new TextRun("")] });
}

function rule() {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 1 } },
    children: [new TextRun("")],
  });
}

function pullquote(text, attribution) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          margins: { top: 200, bottom: 200, left: 320, right: 200 },
          shading: { fill: C.accentSoft, type: ShadingType.CLEAR },
          borders: {
            top: noBorder, bottom: noBorder, right: noBorder,
            left: { style: BorderStyle.SINGLE, size: 24, color: C.accent },
          },
          children: [
            rich([
              { t: "\u201C", b: true, s: 14, c: C.accent },
              { t: text, i: true, s: 11, c: C.ink },
              { t: "\u201D", b: true, s: 14, c: C.accent },
            ]),
            ...(attribution ? [rich([{ t: `— ${attribution}`, s: 9, c: C.inkSoft }], { before: 60 })] : []),
          ],
        })],
      }),
    ],
  });
}

function calloutBox(label, body, accent = C.accent) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          shading: { fill: "FAFAFA", type: ShadingType.CLEAR },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: accent },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: accent },
            left: { style: BorderStyle.SINGLE, size: 4, color: accent },
            right: { style: BorderStyle.SINGLE, size: 4, color: accent },
          },
          children: [
            rich([{ t: label.toUpperCase(), b: true, s: 8, c: accent, f: FONT }]),
            rich([{ t: body, s: 10, c: C.ink }], { before: 40 }),
          ],
        })],
      }),
    ],
  });
}

/* Two-column header + body cell helpers for the giant explainer tables */

function headerCell(text, width, color = C.headerFg, bg = C.headerBg) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    borders: cellBorders(C.headerBg),
    children: [rich([{ t: text.toUpperCase(), b: true, s: 9, c: color, f: FONT }])],
  });
}

function bodyCell(text, width, opts = {}) {
  const { bold = false, color = C.ink, bg, italic = false, size = 9.5, monospace = false } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    borders: cellBorders(C.rule),
    children: [rich([{ t: text, b: bold, i: italic, s: size, c: color, f: monospace ? FONT_MONO : FONT }])],
  });
}

function richCell(runs, width, opts = {}) {
  const { bg, align = AlignmentType.LEFT } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    borders: cellBorders(C.rule),
    children: [new Paragraph({
      alignment: align,
      spacing: { line: 280, lineRule: "auto" },
      children: runs.map((r) => new TextRun({
        text: r.t, bold: r.b, italics: r.i,
        size: sz(r.s || 9.5),
        color: r.c || C.ink,
        font: r.f || FONT,
      })),
    })],
  });
}

/* The signature table for this doc: 2-column "TERM / WHAT IT MEANS" */

function twoColTable(rows, leftHeader = "ELEMENT", rightHeader = "WHAT IT MEANS · WHAT TO SAY") {
  const L = 2880, R = 6480;
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [L, R],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell(leftHeader, L),
          headerCell(rightHeader, R),
        ],
      }),
      ...rows.map((row, i) => new TableRow({
        children: [
          bodyCell(row[0], L, { bold: true, size: 9.5, bg: i % 2 ? C.rowAlt : undefined }),
          row[1] instanceof Array
            ? richCell(row[1], R, { bg: i % 2 ? C.rowAlt : undefined })
            : bodyCell(row[1], R, { size: 9.5, bg: i % 2 ? C.rowAlt : undefined }),
        ],
      })),
    ],
  });
}

/* Three-column "QUESTION / WHAT'S ON THE SCREEN / WHAT TO SAY" */

function threeColTable(rows) {
  const A = 2200, B = 3500, D = 3660;
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [A, B, D],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell("Question being asked", A),
          headerCell("What you see on screen", B),
          headerCell("What you say out loud", D),
        ],
      }),
      ...rows.map((row, i) => new TableRow({
        children: [
          bodyCell(row[0], A, { bold: true, size: 9.5, bg: i % 2 ? C.rowAlt : undefined }),
          bodyCell(row[1], B, { size: 9.5, bg: i % 2 ? C.rowAlt : undefined }),
          row[2] instanceof Array
            ? richCell(row[2], D, { bg: i % 2 ? C.rowAlt : undefined })
            : bodyCell(row[2], D, { size: 9.5, italic: true, color: C.inkSoft, bg: i % 2 ? C.rowAlt : undefined }),
        ],
      })),
    ],
  });
}

/* ───────────────────────────────────────────────────────────────────
   COVER
   ─────────────────────────────────────────────────────────────────── */

function cover() {
  return [
    spacer(40),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({
        text: "FLUID CX  ·  OPENBANK U.S.",
        bold: true, size: sz(9), color: C.accent, font: FONT,
        characterSpacing: 80,
      })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: C.accent, space: 4 } },
      children: [new TextRun("")],
    }),
    new Paragraph({
      spacing: { before: 120, after: 200 },
      children: [new TextRun({
        text: "Demo Playbook",
        bold: true, size: sz(36), color: C.ink, font: FONT_DISPLAY,
      })],
    }),
    new Paragraph({
      spacing: { after: 320 },
      children: [new TextRun({
        text: "Component-by-component explainer for the Openbank CX Signal Room",
        size: sz(13), color: C.inkSoft, font: FONT_DISPLAY, italics: true,
      })],
    }),
    spacer(20),
    rich([
      { t: "For: ", b: true, s: 10, c: C.inkSoft },
      { t: "Founder briefing  ·  Advisor walkthrough  ·  Banking executive demo", s: 10, c: C.ink },
    ]),
    rich([
      { t: "Read time: ", b: true, s: 10, c: C.inkSoft },
      { t: "45 minutes  ·  ", s: 10, c: C.ink },
      { t: "Rehearsal time: ", b: true, s: 10, c: C.inkSoft },
      { t: "two passes before the meeting", s: 10, c: C.ink },
    ]),
    spacer(40),
    pullquote(
      "You are not explaining a dashboard. You are explaining a daily ritual. Every component answers one question Swati asks herself at 8am. If you remember the question each component answers, you never get lost.",
      "How to use this document",
    ),
    spacer(20),
    p("This playbook walks through every component of the Openbank CX Signal Room. For each one you will find: (1) the one question it answers, (2) the meaning of every word and number you can see on the screen, (3) why the component exists in product terms, (4) what Swati specifically asked of it on the 11 May 2026 call, (5) what to say when you demo it, and (6) the hardest follow-up questions you will get, with prepared answers.", { size: 10, after: 160, spacing: 1.4 }),
    p("Read it once end-to-end. Then practise the \u201CWhat to say out loud\u201D column for each component. Do not read the screen. Tell the story behind it.", { size: 10, italic: true, color: C.inkSoft }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   FOUNDATION SECTION
   ─────────────────────────────────────────────────────────────────── */

function foundation() {
  return [
    h1("Foundation — before you open the screen"),
    p("Three things must be true in your head before the demo starts. If any one of them is shaky, the room will feel it within 90 seconds.", { size: 10.5, after: 200 }),

    h2("1. The one-sentence product"),
    pullquote(
      "Fluid CX is a daily customer-trust briefing for digital banks — it listens to every call, chat, email, ticket, app review, and complaint, and tells you the one story your customers are telling you this week, who needs to own it, and whether anything you have already done is working."
    ),
    spacer(12),
    p("Memorise this sentence. If you blank, say this. If asked to repeat the value proposition at any point, say this. Do not improvise variations.", { size: 10, color: C.inkSoft, italic: true }),

    h2("2. The three sentences that win the room"),
    p("Use these in order at the close — they are your strongest lines, anchored to what Swati told you matters:", { size: 10, after: 120 }),
    rich([
      { t: "1.  ", b: true, s: 10.5, c: C.accent },
      { t: "We listen to 100% of customer conversations and surface the three things this week that the bank does not yet know.", s: 10.5, c: C.ink },
    ], { spacing: 1.4, after: 120 }),
    rich([
      { t: "2.  ", b: true, s: 10.5, c: C.accent },
      { t: "We replace the three hours a month an executive spends listening to calls with thirty minutes a day of curated trust signal.", s: 10.5, c: C.ink },
    ], { spacing: 1.4, after: 120 }),
    rich([
      { t: "3.  ", b: true, s: 10.5, c: C.accent },
      { t: "We surface UDAAP, Reg E, and FDCPA risk patterns thirty minutes after they happen, not when the regulator calls.", s: 10.5, c: C.ink },
    ], { spacing: 1.4, after: 160 }),
    calloutBox(
      "The strongest sentence you own",
      "\u201C30 minutes after they happen, not when the regulator calls.\u201D Use this early. Use it again at the close. It is the line a CRO will repeat back to a CFO.",
    ),

    h2("3. The three differentiators, in order"),
    p("If the advisor asks \u201Cwhat makes this different from NICE, Verint, CallMiner, Observe.AI, Gong?\u201D — here is the answer, in this exact order. The order matters because each point is harder than the last for an incumbent to match.", { size: 10, after: 160 }),
    twoColTable(
      [
        ["Cross-channel by default",
          "Existing tools analyse one channel deeply. NICE is voice-first. Observe.AI is voice and chat. CallMiner is voice. We are built on the premise that the same customer story shows up in five places, and analysing one of them in isolation loses the story."],
        ["Recovery as a first-class surface",
          "No incumbent has a Customer Pain Recovery view. They tell you about problems; we tell you whether the fixes are working — observed from the customer\u2019s voice, not a project tracker. That is the daily-engagement loop."],
        ["One substrate, two buyers",
          "The same conversations power CX operations and risk and compliance. Incumbents have separate products. We have one. The Chief Customer Officer and the Chief Compliance Officer end up funding the same purchase, which lowers procurement friction and raises ACV."],
      ],
      "Differentiator",
      "How to phrase it",
    ),

    h2("4. What is on Swati\u2019s mind"),
    p("Every component below is built to answer something she said. The five sentences below are her actual words from 11 May 2026 (transcript line numbers shown). Re-read these before you open the screen.", { size: 10, after: 120 }),
    twoColTable(
      [
        ["L696, L835\u2013836",
          "\u201CParsing out conversations with customers to identify problems is of high value. High value... I think you are onto something which can be a gold mine.\u201D"],
        ["L843\u2013846",
          "\u201CDashboards are dime a dozen. Insight is not dime a dozen.\u201D"],
        ["L501\u2013505",
          "\u201CI sit in call center and listen to calls once a month, where we do three hours of just call listening. And I learned so much from it.\u201D"],
        ["L538\u2013547",
          "\u201CBest call of the day, worst call of the day. The person who handled the call best today versus the person who handled the call in a worst way today. Training impact.\u201D"],
        ["L763\u2013767",
          "\u201CYou have to really think about it as, who are the people who will make a decision in a bank to buy a product like this?\u201D"],
      ],
      "Where she said it",
      "Her words"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   COMPONENT-BY-COMPONENT
   ─────────────────────────────────────────────────────────────────── */

function componentHeading(name, role) {
  return [
    eyebrow("Component"),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: name, bold: true, size: sz(22), color: C.ink, font: FONT_DISPLAY })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: role, italics: true, size: sz(11), color: C.inkSoft, font: FONT_DISPLAY })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 6 } },
    }),
  ];
}

function whatItIs(question, plain, why, swatiNeed) {
  return [
    h3("In one line"),
    p(plain, { size: 10.5, after: 120, spacing: 1.4 }),
    h3("The single question it answers"),
    pullquote(question),
    spacer(8),
    h3("Why this component exists"),
    p(why, { size: 10, after: 120, spacing: 1.4 }),
    h3("What Swati specifically asked from this"),
    calloutBox("Swati\u2019s ask", swatiNeed, C.accent),
  ];
}

/* ── COMPONENT 1: Signal Story ─────────────────────────────────── */

function compSignalStory() {
  return [
    ...componentHeading("Signal Story", "Today\u2019s Arc \u00b7 cross-channel pattern"),

    ...whatItIs(
      "If I only have sixty seconds this morning, what is the one customer story I need to know about today?",
      "The cover page of the daily briefing. The system reads every conversation across every channel and writes a one-paragraph executive note about the single biggest cross-channel customer story. The trail underneath shows how the same pain travels from one system to another.",
      "Most dashboards force the executive to read twenty numbers and infer a story. This component does the inference for them. It picks the single most important narrative pattern across all channels and presents it as a sentence with evidence. Existing tools show call volume by channel. We show that the same customer is in pain across five places, and that those five things are one story, not four.",
      "She said \u201Cdashboards are dime a dozen, insight is not.\u201D She also said the executive view becomes generic at the portfolio level. This component is the answer to both. It is not a metric. It is a thesis with evidence, refreshed every morning."
    ),

    h3("Every word on the screen — what it means and what to say"),
    p("Read this table once carefully. Then practise the right-hand column out loud.", { size: 9.5, color: C.inkSoft, italic: true, after: 120 }),
    twoColTable(
      [
        ["Today\u2019s Arc",
          [
            { t: "The title of the section. ", s: 9.5 },
            { t: "\u201CArc\u201D ", b: true, s: 9.5 },
            { t: "means a customer story with a start, middle, and end \u2014 not a metric. The arc moves across channels and across time. Use the word ", s: 9.5 },
            { t: "arc ", i: true, s: 9.5 },
            { t: "deliberately when speaking; it positions the product above incumbents which only show ", s: 9.5 },
            { t: "events", i: true, s: 9.5 },
            { t: ".", s: 9.5 },
          ]],
        ["Cross-channel pattern",
          "The subtitle. The system did not look at voice in isolation. The pattern emerged because the same customer language showed up in five places at once. When you say this out loud, emphasise the words \u201Cat once.\u201D"],
        ["Pattern switcher (left rail)",
          "Three candidate arcs are ranked daily. The user picks the one to brief today. There are usually two or three arcs running concurrently \u2014 the rail respects that. Tell the room: \u201CMost mornings there are two or three patterns competing for executive attention; the rail surfaces them so the executive picks, not the algorithm.\u201D"],
        ["Severity pill (Critical, High, Watch)",
          [
            { t: "Critical = customer harm, regulatory exposure, or financial loss is live. High = pattern is forming with measurable repeat. Watch = baseline being established. The colour and the word together signal urgency at a glance. Say: ", s: 9.5 },
            { t: "\u201CSeverity is grounded in customer language and frequency, not subjective. We can show the model card.\u201D", i: true, s: 9.5 },
          ]],
        ["First funding is the trust break",
          "An example arc title. Not a metric, a sentence. The product writes sentences as titles because executives read sentences faster than they read charts. If asked who writes the sentence, say: \u201CIt is generated by our pattern engine and reviewed by our ML team; every title traces back to its source utterances and confidence score.\u201D"],
        ["Money-access anxiety",
          [
            { t: "The ", s: 9.5 },
            { t: "executive readout. ", b: true, s: 9.5 },
            { t: "This is the one phrase a CEO can repeat at a board meeting. It compresses the entire arc into a customer-emotion phrase. Say: ", s: 9.5 },
            { t: "\u201CThis is the line the head of the bank can take to their board on Monday without reading the rest of the screen.\u201D", i: true, s: 9.5 },
          ]],
        ["214 contacts, 43 past promise, 18 closure-intent signals",
          [
            { t: "Three numbers that prove the arc is real. ", s: 9.5 },
            { t: "Contacts ", b: true, s: 9.5 },
            { t: "= customers who interacted on this topic. ", s: 9.5 },
            { t: "Past promise ", b: true, s: 9.5 },
            { t: "= cases that have aged beyond the bank\u2019s own service window. ", s: 9.5 },
            { t: "Closure-intent signals ", b: true, s: 9.5 },
            { t: "= customers using language suggesting they may close the account. Read all three out loud when you point at this card.", s: 9.5 },
          ]],
        ["Signal trail (5 nodes)",
          "The most important visual on the page. It shows the same customer pain travelling from Account Activity to Voice to Chat to Ticket to Risk. The point is not that there are five events. The point is that they are one customer, in one week, with one problem. Say: \u201CThe value here is the join. NICE sees the voice call. Salesforce sees the ticket. Nobody currently joins them. We do, in thirty minutes.\u201D"],
        ["Where is my money? · Balance looks wrong · No owner after 48h",
          "The actual customer language on each node. This is critical \u2014 we are not summarising, we are showing what the customer said. When demoing, point at one phrase and say: \u201CThis is exactly what the customer typed in chat at 2:14am. Not paraphrased.\u201D"],
        ["91% confidence",
          [
            { t: "Pattern engine\u2019s confidence that these signals belong to one arc. Anything above 80% is dossier-ready; below 70% the system labels it ", s: 9.5 },
            { t: "Watch", b: true, s: 9.5 },
            { t: ". If asked how confidence is computed: language similarity across channels + customer ID overlap + time-window proximity + topic-model agreement. Have your AI architect on the next call to walk through it if pressed.", s: 9.5 },
          ]],
        ["+18% repeat",
          "Repeat-contact rate is rising 18% week over week for customers in this arc. Repeat contact is the single best leading indicator of complaint risk and customer churn. Say it out loud: \u201CRepeat contact is the leading indicator of complaint risk. An 18% week-over-week climb is exactly what we want to catch before it becomes a CFPB filing.\u201D"],
        ["14d oldest",
          "The oldest unresolved case on this arc is 14 days old. Two implications: (a) the arc has been alive for two weeks before today; (b) regulatory clocks (Reg E error-resolution at 10 business days) may already apply. Mention Reg E by name when pointing at this number."],
        ["$1.8M balance affected",
          "The total deposit balance held by customers in the arc cohort. This is the financial exposure if the cohort closes accounts. Translate to the room: \u201C$1.8M of deposit balance sits inside this cohort. That is the financial cost of doing nothing.\u201D"],
      ]
    ),

    h3("How to demo this component (60 seconds)"),
    calloutBox(
      "Demo script",
      "\u201CThis is the cover page of every morning. The system reads every conversation across every channel and writes one sentence — today\u2019s sentence is \u2018first funding is the trust break.\u2019 The five-node trail underneath shows the same customer pain travelling from account activity into voice, chat, tickets, and risk language. The point is the join: each of these five systems has a different owner today, and nobody currently sees them as one story. We do, in thirty minutes. 214 customers. $1.8M of deposit balance. 91% confidence.\u201D"
    ),

    h3("Hardest questions and your prepared answers"),
    twoColTable(
      [
        ["\u201CHow do you know it is one story and not three coincidences?\u201D",
          "Confidence score is on the card. The model joins on customer ID, time-window proximity, and language similarity across channels. The threshold is calibrated against historical patterns where the bank itself later confirmed the connection. We can walk through the model card on the next call."],
        ["\u201CCan I edit the arc title?\u201D",
          "Yes. Every title can be overridden by the executive or their chief of staff. The system stores both versions for model improvement, but the published title is yours."],
        ["\u201CWhat if the arc is wrong?\u201D",
          "There is a dismiss action. Dismissed arcs feed back into the model. If three executives dismiss the same arc within two days, the system de-ranks similar patterns. The feedback loop is part of the product."],
        ["\u201CIs this an AI hallucination risk?\u201D",
          "No \u2014 because nothing on the card is generated text in the loose sense. Every claim is a count over actual utterances. The arc title is a paraphrase but the underlying evidence is verbatim. We show source quotes on hover."],
      ],
      "Question",
      "Answer"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}
/* ── COMPONENT 2: Channel Constellation ────────────────────────── */

function compConstellation() {
  return [
    ...componentHeading("Internal Voice Constellation", "Channel-level evidence layer"),
    ...whatItIs(
      "Which channel is hurting the most right now, and is it getting worse or better?",
      "The supporting evidence layer. After the narrative, the executive verifies with numbers. This is the only component that looks like a traditional dashboard, on purpose \u2014 because after a thesis, the room asks for proof. The proof is voice, chat, email, and tickets, with the customer\u2019s actual words on every card.",
      "Every executive who reads the Signal Story above will then ask: \u201Cwhich channel is screaming loudest?\u201D If we did not answer that question immediately, they would leave the page to check their existing dashboards. So we answer it on the same screen, in our grammar. The phrase on each card (e.g. \u201CI need to know when this clears\u201D) is what makes it intelligence, not metrics.",
      "Swati said she has a friction score and a social media analysis team. She has channel metrics already. This component does not replicate her metrics \u2014 it shows her the customer\u2019s actual language sitting next to the metric. The phrase is the difference."
    ),

    h3("Every word on the card — what it means and what to say"),
    twoColTable(
      [
        ["Voice / Chat / Email / Tickets",
          "The four internal channels we ingest. Note we deliberately do not put public channels here \u2014 those live in the Public Voice Wall. This view is bank-internal data only."],
        ["42.8K · 18.4K · 9.7K · 6.2K",
          "Volume of interactions in the window. Notice the proportion: voice is still 55%. Banking is still a voice-led industry; do not let anyone tell the room otherwise. When pointing at Voice say: \u201CVoice is still the majority channel in retail banking customer operations, which is why our voice transcription investment matters.\u201D"],
        ["55% of interactions",
          "Channel share. Read out loud as a way to anchor the room: \u201CMore than half of customer contact is still voice; the chat-first narrative is wrong in retail banking.\u201D"],
        ["+18% WoW · +11% WoW · +9% WoW · +22% WoW",
          "Week over week change in volume. Tickets are the fastest-rising channel at +22%. That is a leading indicator of unresolved cases, because tickets exist when voice or chat could not resolve."],
        ["money-access anxiety / balance confusion / generic replies / owner gap",
          [
            { t: "The ", s: 9.5 },
            { t: "issue tag ", b: true, s: 9.5 },
            { t: "for each channel. These are human-readable theme labels derived from clustering customer utterances. They are not category codes from a CRM. They are what the customer is actually expressing, named in plain English.", s: 9.5 },
          ]],
        ["\u201CI need to know when this clears\u201D",
          [
            { t: "The ", s: 9.5 },
            { t: "customer phrase ", b: true, s: 9.5 },
            { t: "\u2014 a representative quote that defines the dispute. This is the single most powerful element on the card. Point at it and say: ", s: 9.5 },
            { t: "\u201CThis is what 214 customers said this week, in their words. Your friction score tells you something is wrong. This tells you what they need.\u201D", i: true, s: 9.5 },
          ]],
        ["Top service dispute",
          "The most common case category for the channel, in product-language. Note it is the dispute, not the agent action. \u201CFirst-deposit hold / available balance\u201D is what the customer is calling about; \u201Cretention save\u201D would be the agent action and we deliberately do not put it here."],
        ["214 cases · 163 cases · 88 cases · 142 cases",
          "Volume of the top dispute. Compare across channels: tickets has 142 cases on owner gap \u2014 unusually high. That is what makes tickets the most critical channel today, even though it is the smallest by volume."],
        ["Sentiment trend sparkline",
          "Eight intervals of channel sentiment. Colour is keyed to sentiment severity \u2014 red for very negative, amber for negative, green for recovering. The shape matters: a steady decline is worse than a sharp drop, because steady declines do not trigger alarms in operational systems."],
        ["47% repeat / 31% / 39% / 52%",
          [
            { t: "Repeat contact rate. ", b: true, s: 9.5 },
            { t: "The single most important metric on the page. A 47% repeat rate on voice means almost half of customers calling about money access have called before. That is the leading indicator of complaint risk. Memorise the number ", s: 9.5 },
            { t: "47%", b: true, s: 9.5 },
            { t: ".", s: 9.5 },
          ]],
        ["Owner: Deposit Ops / CX Ops / Email Ops / Back Office Ops",
          [
            { t: "The team accountable for the dispute on that channel. ", s: 9.5 },
            { t: "Critical phrasing: ", b: true, s: 9.5 },
            { t: "do not say \u201Cwhose fault is it.\u201D Say ", s: 9.5 },
            { t: "\u201Cthis is where the workflow change must happen.\u201D", i: true, s: 9.5 },
            { t: " Ownership in this product is about workflow, not blame.", s: 9.5 },
          ]],
        ["Sentiment: \u22120.61",
          "Average customer sentiment, normalised \u22121 to +1. \u22120.6 or worse signals real distress, not annoyance. When pointing at \u22120.61 on Voice say: \u201CThat is not annoyance; that is genuine distress about money access. We measure it because it predicts complaint behaviour.\u201D"],
      ]
    ),

    h3("How to demo this component (45 seconds)"),
    calloutBox(
      "Demo script",
      "\u201CAfter the narrative, the executive needs proof. Voice is 55% of contact, with 47% repeat \u2014 that 47% is the leading indicator of complaint risk. Below the volume number is the customer\u2019s actual phrase: \u2018I need to know when this clears.\u2019 That phrase is what makes this intelligence, not metrics. Every channel has volume, week-over-week, repeat rate, sentiment trend, and a named owner. The owner is for workflow accountability, not blame.\u201D"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ── COMPONENT 3: Best Calls / Worst Calls ─────────────────────── */

function compCalls() {
  return [
    ...componentHeading("Top 3 Best Calls  /  Top 3 Worst Calls", "Daily coaching surface for the executive\u2019s morning ritual"),
    ...whatItIs(
      "What does excellence on my team look like today, and what does failure look like today?",
      "Three best calls and three worst calls, surfaced from every conversation in the last 24 hours. Each card carries the pattern (what was good or what went wrong), not the agent\u2019s name in any blaming sense. The point of the card is the pattern, replicable across the team or fixable at the workflow level.",
      "This is the single most important component to defend in the meeting. Swati explicitly handed us the spec for it: she said she sits in her contact center three hours a month listening to calls because that is where she learns what dashboards cannot tell her. This component replaces that ritual. Done well, it is what makes an executive open the product Tuesday morning and again Wednesday morning.",
      "Direct quote, L538\u2013547: \u201CBest call of the day, worst call of the day. The person who handled the call best today versus the person who handled the call in a worst way today. Training impact \u2014 this is going to have to look like something that is changing on a regular basis.\u201D Every word of this card was written to that sentence."
    ),

    calloutBox(
      "Critical framing rule",
      "Never describe this as agent grading or QA scoring. The product is a pattern surface, not a performance review. If asked \u201Care you grading agents,\u201D the only acceptable answer is: \u201CNo. We surface patterns. Whether the bank uses a pattern to coach an individual is the bank\u2019s call, not ours.\u201D Do not deviate from this.",
      C.critical
    ),

    h3("Every word on the card — what it means and what to say"),
    twoColTable(
      [
        ["Best call rank 1, 2, 3 / Worst call rank 1, 2, 3",
          "Daily ranking. The ranking changes every morning. Tell the room: \u201CThis page is empty by default and is rewritten every twenty-four hours. There is no \u2018leaderboard.\u2019 The point is what to replicate today and what to fix today.\u201D"],
        ["AI call score (94, 91, 88 / 22, 28, 34)",
          "A composite score 0\u2013100 derived from: customer sentiment trajectory in the call, resolution flag, repeat-contact follow-up (did the same customer come back), complaint-language presence, and operational correctness. Above 90 is excellence; below 35 is failure. Mid-range calls are excluded \u2014 we surface only the extremes, deliberately."],
        ["Severity pill (Good, Critical, High)",
          [
            { t: "Best calls are tagged ", s: 9.5 },
            { t: "Good", b: true, s: 9.5 },
            { t: " (green) because the outcome is recoverable customer trust. Worst calls are tagged ", s: 9.5 },
            { t: "Critical ", b: true, s: 9.5 },
            { t: "or ", s: 9.5 },
            { t: "High ", b: true, s: 9.5 },
            { t: "based on whether complaint-intent language appeared.", s: 9.5 },
          ]],
        ["\u201CFunds-hold call converted frustration into wait confidence\u201D",
          "The title is a sentence describing what the call accomplished. Not what the agent did, what the call accomplished. The customer outcome is the headline. Wait confidence means the customer left believing the wait was reasonable; that is a measurable shift in language from before to after."],
        ["Reason (the long line on the card)",
          "The pattern in three actions. For the best call shown: agent explained current vs available balance, gave the exact clearing window, confirmed follow-up. Three concrete moves. This is what is replicable across the rest of the contact center."],
        ["Pattern (the boxed-out one-liner)",
          [
            { t: "The ", s: 9.5 },
            { t: "takeaway for the bank. ", b: true, s: 9.5 },
            { t: "\u201CReplicate for first-deposit confusion\u201D translates the pattern into operational language. This is what a head of CX takes into their next team huddle.", s: 9.5 },
          ]],
        ["Proof (\u201CVoice + ticket match\u201D)",
          "How the system verified this call. Voice + ticket match means we found the call audio, found the associated ticket, and the customer outcome on the ticket aligns with the sentiment shift in the call. That is the evidence layer. Without proof, this surface would be subjective; with proof, it is auditable."],
        ["Evidence (\u201C48 similar calls\u201D)",
          [
            { t: "The number of comparable calls in the bank\u2019s data this week. ", s: 9.5 },
            { t: "This is what makes the pattern, not the anecdote. ", b: true, s: 9.5 },
            { t: "Say it out loud: ", s: 9.5 },
            { t: "\u201C48 similar calls means this is not a one-off; it is a pattern your team can ship as guidance today.\u201D", i: true, s: 9.5 },
          ]],
        ["Worst-call language: \u201CBlocked-account issue repeated across four contacts\u201D",
          "Notice the framing: the failure is described as a system failure (no owner across four contacts), not as the agent being bad. The pattern says \u201Cfix owner gap for multi-contact account-access cases.\u201D That is a workflow change, not a coaching action."],
        ["\u201CFix scripts that explain policy without resolving the customer question\u201D",
          "This is the textbook example of how we describe a worst-call pattern. The fix is at the script and process layer, not the agent. When demoing, point at this phrase and say: \u201CThe answer here is a workflow change. The agent followed the script. The script was wrong.\u201D"],
      ]
    ),

    h3("How to demo this component (90 seconds — most important block of the meeting)"),
    calloutBox(
      "Demo script",
      "\u201CSwati told us she spends three hours a month listening to calls in her contact center because that is where she learns what dashboards cannot tell her. This component does that for her, daily. Three best calls show her exactly what excellent customer recovery looks like \u2014 the language, the pacing, the move that worked. Three worst calls show the pattern she needs to fix at the workflow level, not the agent level. Each card carries a \u2018similar calls\u2019 count, so what you see is a pattern, not an anecdote. The best calls are for replication; the worst calls are for fixing scripts and routing. We deliberately do not show middle-range calls \u2014 the executive does not need them.\u201D"
    ),

    h3("Hardest questions and your prepared answers"),
    twoColTable(
      [
        ["\u201CAre you grading agents?\u201D",
          "No. We surface patterns. Each card includes a \u2018similar calls\u2019 count to make sure it is a pattern, not a person. Whether the bank uses any pattern to coach an individual is the bank\u2019s call, not ours."],
        ["\u201CWhat if my best call yesterday is not best today?\u201D",
          "Correct. The page is rewritten daily. There is no historical leaderboard. The product\u2019s job is to make today\u2019s twenty-four hours legible to the executive."],
        ["\u201CWhere does the call audio sit?\u201D",
          "Audio stays in the bank\u2019s contact center platform. We hold the transcript and our derived features. Audio is referenced by ID; we do not duplicate or re-store it. PII redaction happens at ingest before any utterance is persisted."],
        ["\u201CHow do you handle agent privacy?\u201D",
          "Agent identifiers are visible only to roles authorised in the bank\u2019s own access control. The product respects bank-side ACLs. Aggregate views never expose individual identifiers."],
      ],
      "Question",
      "Answer"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ── COMPONENT 4: Customer Pain Recovery ───────────────────────── */

function compRecovery() {
  return [
    ...componentHeading("Customer Pain Recovery", "The \u201Cthen what\u201D loop \u2014 did the intervention work?"),
    ...whatItIs(
      "Did anything we already did actually work?",
      "A surface that tracks customer pain through time. When the executive raises an issue and the team ships a fix, the question that follows is always \u2018did the signal move?\u2019 This component answers that, measured from the customer\u2019s voice \u2014 not from a project tracker, not from a status report.",
      "Every dashboard shows problems. Almost none show whether fixes are landing. Swati specifically asked this on the call: \u2018Then what? If I tell my team to fix this, will it actually move?\u2019 This is the answer. Critically, every card uses the language \u2018observed recovery signal\u2019 and \u2018not workflow-confirmed.\u2019 We are not claiming the team shipped the fix. We are saying we can see in the conversation data whether the pain went up, flat, or down. That distinction is what separates us from a Jira board.",
      "The component is also the daily-engagement loop. An executive opens it Tuesday because something changed; opens it Wednesday because they want to see if it kept changing. The four verdicts \u2014 No Movement, Improving, Working, New Baseline \u2014 are written to be honest answers. \u2018No Movement\u2019 on the funds-availability message is deliberately on the page because the most credibility-earning move you have is to say nothing improved."
    ),

    h3("Every word on the card — what it means and what to say"),
    twoColTable(
      [
        ["\u201CObserved recovery signal\u201D",
          [
            { t: "The single most important phrase on the page. We are not claiming credit for any intervention. We are claiming we can ", s: 9.5 },
            { t: "observe ", i: true, s: 9.5 },
            { t: "in the conversation data whether the customer\u2019s pain is going up, flat, or down. Say it out loud: ", s: 9.5 },
            { t: "\u201CThis is not a project tracker. This measures what customers are saying about the same pain, week over week.\u201D", i: true, s: 9.5 },
          ]],
        ["\u201CNot workflow-confirmed\u201D",
          "We do not know whether the bank actually shipped a fix. We only know whether the signal moved. This phrase is intentionally on every card because a CRO will ask. Say: \u201CThe label is deliberate. It tells the executive we will not claim credit for work we cannot verify.\u201D"],
        ["Verdicts: No Movement / Improving / Working / New Baseline",
          [
            { t: "The four possible states of a tracked pain. ", b: true, s: 9.5 },
            { t: "No Movement ", b: true, c: C.critical, s: 9.5 },
            { t: "= flat signal across the measurement window. ", s: 9.5 },
            { t: "Improving ", b: true, c: C.high, s: 9.5 },
            { t: "= movement in the right direction but below target. ", s: 9.5 },
            { t: "Working ", b: true, c: C.good, s: 9.5 },
            { t: "= measured movement beats target. ", s: 9.5 },
            { t: "New Baseline ", b: true, c: C.watch, s: 9.5 },
            { t: "= window too short to call.", s: 9.5 },
          ]],
        ["Customer pain (\u201CI cannot access my money\u201D)",
          "Direct customer quote that anchors the pain. Pulled from real utterances. Notice we put the customer\u2019s words in quotation marks; the bank\u2019s words go elsewhere on the card. The card is structured to keep the customer\u2019s voice as the first thing the executive reads."],
        ["Intervention signal",
          "What we have observed about whether a change is being made. For \u2018Funds-availability message\u2019: \u201CNo confirmed workflow change detected.\u201D That is honesty about the limit of our visibility. The card is willing to say we do not know."],
        ["How we know (3 bullets)",
          [
            { t: "The evidence behind the verdict. Three movements in conversation data: repeat contact rate, customer language used, and complaint-intent phrases. ", s: 9.5 },
            { t: "These three signals are the conversation-data version of the bank\u2019s operational KPIs ", b: true, s: 9.5 },
            { t: "\u2014 the bank has CSAT and AHT; we have repeat language, distress vocabulary, and complaint phrasing.", s: 9.5 },
          ]],
        ["Target vs Measured",
          "Target = the movement the executive said they wanted (e.g. \u2018repeat calls \u221230%\u2019). Measured = what we have observed. The contrast tells the room whether the team\u2019s aim is on the mark or off."],
        ["Recovery confidence (91%, 87%, 84%, 78%)",
          "How confident we are that the measured movement is real and not noise. Below 75% the system labels it New Baseline. Above 85% it can be reported to the board. The 78% on Fraud-case continuity tells the executive: \u2018the trend is suggestive but we have not yet seen enough of it.\u2019"],
        ["Before strip / After strip",
          "Three signals at the start of the window and three signals today. For Single-owner repeat-contact rule: before was 142 repeats and \u22120.49 sentiment; after is 104 repeats and \u22120.32 sentiment. The reduction is real and measurable. This is the daily-engagement proof: an executive who scrolled past last week wants to see how the numbers moved this week."],
        ["Signal movement strip / Verdict box",
          "The Before / After / Verdict trio is the entire component compressed into three boxes. If an executive reads only one row of one card, they should be able to walk away with the right answer. \u201CRepeat and reopen signals beat target; sustain conversation patterns that caused the lift\u201D is the operational instruction the bank takes away."],
      ]
    ),

    h3("How to demo this component (60 seconds)"),
    calloutBox(
      "Demo script",
      "\u201CMost CX dashboards show what\u2019s broken. This one shows whether the fixes are working \u2014 measured from the customer\u2019s voice, not from a project tracker. The most important phrase on every card is \u2018observed.\u2019 We do not claim credit for any intervention; we report what the conversation data is saying. The No Movement card on funds availability is deliberately on the page \u2014 the most credibility-earning move we have is to tell you when nothing has improved. This is the surface that makes someone open the app Tuesday and again Wednesday.\u201D"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ── COMPONENT 5: Risk Signal Layer ────────────────────────────── */

function compRisk() {
  return [
    ...componentHeading("Risk Signal Layer", "The Compliance Officer\u2019s lens on the same conversations"),
    ...whatItIs(
      "What of all this customer pain is becoming a regulator problem?",
      "The second buying centre. Every signal in the rest of the room is a CX signal. This one is a compliance signal, drawn from the same conversations. The Chief Compliance Officer sees UDAAP-adjacent language, Reg E error-resolution clocks approaching, FDCPA-relevant collection-pressure patterns, and vulnerable-customer cues \u2014 surfaced thirty minutes after the call, not thirty days after a complaint is filed.",
      "Banks have at least two budget holders for a product like this. The CX leader buys the operational quality. The Chief Risk Officer or Chief Compliance Officer co-funds it because the same conversations carry regulatory exposure. This component is what makes the CRO conversation possible. Without it, the product is a CX tool. With it, the product is a CX tool and a risk tool from one substrate \u2014 which is the most defensible position against any incumbent.",
      "Swati was Chief Payments Risk Officer at Stripe. Risk and compliance is her professional home. On 11 May she opened the door explicitly: \u201CI can see the risk compliance applications of it; we can talk about that too.\u201D This is the surface that converts her from validator to advocate."
    ),

    calloutBox(
      "Language discipline for this component",
      "We never say \u201Cwe flag UDAAP violations.\u201D We say \u201Cwe surface UDAAP-adjacent patterns for the Compliance team to review.\u201D Determination of a violation is the bank\u2019s responsibility. Our job is to surface patterns thirty minutes after they form, with audit-trail evidence, so the Compliance team can decide.",
      C.critical
    ),

    h3("Every word on the screen — what it means and what to say"),
    twoColTable(
      [
        ["Risk pulse 67 / 100",
          [
            { t: "A composite index combining: complaint-intent language frequency, repeat-contact rate on regulated topics, age of unresolved cases against Reg E error-resolution clocks, and vulnerable-customer cue density. ", s: 9.5 },
            { t: "It is a movement number, not an absolute one ", b: true, s: 9.5 },
            { t: "\u2014 the bank\u2019s own threshold for action is configured per institution. If asked how it is calculated, say: \u201CFour inputs, weighted with the bank\u2019s Compliance team. Available in the MRM artefact.\u201D", s: 9.5 },
          ]],
        ["Elevated",
          "The status corresponding to a 67. Other states are Normal (\u226445), Watch (46\u201360), Elevated (61\u201375), Critical (\u226576). Read the band; do not improvise."],
        ["Main exposure (\u201CMoney access + transfer dispute + no-answer patterns\u201D)",
          "The three pattern families currently contributing most to the score. Each maps to one of the four cards below. The room should be able to read the score and the three families and immediately see why."],
        ["Active lanes",
          [
            { t: "The regulatory frameworks the pattern is closest to: CFPB complaint watch, UDAAP watch, Reg E review, Vulnerable customer review. ", s: 9.5 },
            { t: "These are not violations; they are lanes ", b: true, s: 9.5 },
            { t: "\u2014 areas where the Compliance team should review the surface. Always use the word ", s: 9.5 },
            { t: "review.", i: true, s: 9.5 },
          ]],
        ["CFPB 15d / 60d",
          "CFPB consumer-complaint response clock: the bank has 15 days for initial response and 60 days for resolution. If we are surfacing patterns 30 minutes after they happen, the bank has time. If we surface them 30 days later, the bank has missed the window. That is the value claim."],
        ["Reg E clock may apply",
          "Reg E governs electronic fund transfer error resolution \u2014 the bank has 10 business days to investigate (extendable to 45). The phrase \u2018may apply\u2019 is careful: we do not adjudicate; we flag."],
        ["UDAAP harm + unclear terms",
          [
            { t: "UDAAP = Unfair, Deceptive, or Abusive Acts or Practices, the CFPB\u2019s umbrella authority. ", s: 9.5 },
            { t: "Harm + unclear terms ", b: true, s: 9.5 },
            { t: "is the linguistic pattern we look for: customer expresses monetary or material harm, and the bank\u2019s explanation language is unclear or jargon-heavy. Together, these are the two pillars of a UDAAP-adjacent signal.", s: 9.5 },
          ]],
        ["Service dispute \u2192 exposure (the four cards)",
          "The structure of each card: what the customer is complaining about, what they want, which regulatory lane it touches, how much evidence we have, and why it matters. Four cards because four exposure types currently active."],
        ["Money Access / Funds Availability \u2014 Critical",
          "The top exposure. \u2018I cannot access my money\u2019 is the customer\u2019s words. \u2018Deposit hold / transfer availability\u2019 is the service dispute. CFPB complaint watch + UDAAP watch are the two lanes. 214 contacts and 47% repeat is the evidence. 48-hour watch is the recommended cadence."],
        ["Transfer Error / EFT Dispute \u2014 High",
          "Reg E lane. The customer says the transfer failed or moved incorrectly. Reg E clock is approaching on the 31 tickets. The card tells the room: \u2018Reg E timelines may apply\u2019 \u2014 again the word may."],
        ["Account Access / Lockout \u2014 High",
          "Trusted-device, OTP, and phone-change recovery cases. Vulnerable customer review is in the lane list because some lockouts hit elderly or distressed customers who cannot reach funds for a multi-day period. 7 vulnerable-customer cues are flagged in the evidence."],
        ["Payment / Collection Pressure \u2014 Watch",
          "FDCPA-relevant patterns. Collection-pressure phrases from the bank or from third-party collection partners. \u2018Where collection conduct applies\u2019 is the careful wording \u2014 most lenders do not directly collect, but call-center conduct can still implicate FDCPA via third parties."],
        ["Evidence volume / Source evidence",
          "The proof under each card. Source evidence lists which channels produced the signal. This is the audit trail that satisfies an MRM review later."],
        ["Escalation queue (bottom)",
          "The three most urgent items to brief the CCO on today. The CCO does not need to read the rest of the screen \u2014 the queue is the daily call-list."],
      ]
    ),

    h3("How to demo this component (90 seconds)"),
    calloutBox(
      "Demo script",
      "\u201CThis is the second buying centre. Same conversations, different lens. The CX leader sees disputes; the Compliance Officer sees regulatory exposure. UDAAP-adjacent language, Reg E error-resolution clocks approaching, vulnerable-customer cues \u2014 surfaced thirty minutes after the call, not thirty days after a complaint is filed. We never claim a violation. We surface patterns for the Compliance team to review. The escalation queue at the bottom is the CCO\u2019s daily call-list. The same substrate that powers CX also powers risk, which means one purchase covers both buying centres at the bank.\u201D"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ── COMPONENT 6: Public Voice Wall ───────────────────────────── */

function compPublicVoice() {
  return [
    ...componentHeading("Public Voice Wall", "External reputation pulse joined to internal data"),
    ...whatItIs(
      "Is what we are seeing internally the same as what the world is saying about us \u2014 and what does the world see that we miss?",
      "The external reputation layer. Five public channels \u2014 Trustpilot, Play Store, App Store, Reddit, BBB \u2014 each with its own personality and dominant complaint theme. The component goes beyond \u2018what is the star rating\u2019: every channel has an Echo Box that bridges the external signal to the internal echo and ends with a one-line business read.",
      "Swati told us she already has a social media analysis team. So why does this component exist? Because no existing tool joins the public voice to the internal call data on the same screen with the same vocabulary. Trustpilot tells us a customer is angry; our internal data tells us 47% of similar callers are repeat contacts. The value is the join. The customers who hated Openbank publicly are the same population who called four times internally.",
      "Use this surface to neutralise the \u2018we already have this\u2019 objection. Show one card. Read the Echo Box aloud. The line \u2018public pain matches internal first-funding and access confusion \u2014 treat as one trust thread, not a separate reviews problem\u2019 is what makes the social team and the contact center one operation, not two."
    ),

    h3("Every word on the screen — what it means and what to say"),
    twoColTable(
      [
        ["Channel rail (left)",
          "Five public channels, each with a score and a one-line dominant issue. The colour key on the score is the same severity grammar as the rest of the room \u2014 critical, high, watch, good. Trustpilot 1.5 is critical. App Store 4.1 is good. The fact that two public channels report opposite things is the most important observation in this component."],
        ["Trustpilot 1.5 / 125 reviews",
          "Trustpilot is where customers go to file structured complaints with formal language. A 1.5 here means the cohort that bothered to leave a review is overwhelmingly negative. 125 reviews is a small but consequential sample \u2014 these are the customers most likely to escalate to CFPB."],
        ["Play Store 3.0 / 457+ reviews",
          "Android app store. 3.0 with 457 reviews suggests product-experience friction at scale on Android specifically. The split with App Store (4.1) is meaningful: Android customers have a different, more friction-heavy experience than iOS customers."],
        ["App Store 4.1 / 1.8K ratings",
          [
            { t: "iOS. The strongest channel. ", s: 9.5 },
            { t: "This card matters because it proves the product is not generally hated ", b: true, s: 9.5 },
            { t: "\u2014 the negative experiences cluster around specific journeys. Always lead with this when an advisor says \u2018your reviews are bad.\u2019 Say: \u201CApp Store is 4.1 with 1.8K ratings; the negative concentration is in specific journeys, not the product overall.\u201D", s: 9.5 },
          ]],
        ["Reddit 8 / top thread votes",
          "Reddit is consideration-stage \u2014 these are people deciding whether to open an account. High-emotion, partial context. The score is vote-based, not star-based. Notable for early-warning on promise-versus-access narratives."],
        ["BBB / HQ 1.03 / 5 (69)",
          "Better Business Bureau. The profile is not rated, but the headquarters aggregate is 1.03 \u2014 effectively the lowest score in the public channels. BBB matters because it is regulator-adjacent and because the response cadence is visible. The card carries two separate signals because BBB has two layers (profile, HQ aggregate)."],
        ["Selected channel intelligence (right pane)",
          "When a channel is selected, the right pane shows: dominant external issue, sentiment skew, public volume, internal echo summary, theme breakdown, severity mix, top trending public items, the Echo Box, and a positive-signal-to-protect callout where applicable. Read top to bottom."],
        ["External theme breakdown (bar chart)",
          "What the public is complaining about, ranked by share. For Trustpilot: funds / account access (34%), poor customer service (28%), inconsistent information (22%), long response times (16%). Notice these are not generic categories; they are theme labels derived from clustering review utterances."],
        ["Review severity mix",
          "What fraction of reviews are Critical, High, Watch, Positive. Trustpilot is 42% Critical and only 9% Positive. App Store is 12% Critical and 36% Positive. The contrast on this strip is the visualisation of \u2018different audiences, different channels.\u2019"],
        ["Top trending public items (numbered list)",
          "Three specific reviews or threads, each with a meta line and a signal label. The signal label translates a single review into a business pattern \u2014 e.g. \u2018money-access anxiety,\u2019 \u2018trusted-device recovery,\u2019 \u2018formal escalation risk.\u2019"],
        ["Echo Box (External / Internal / Business read)",
          [
            { t: "The most important element on the whole component. Three short paragraphs that link external signal to internal data to business action. ", s: 9.5 },
            { t: "The Business read line is the executive\u2019s takeaway. ", b: true, s: 9.5 },
            { t: "Read it aloud when demoing. For Trustpilot, the line is: \u2018Public pain matches internal first-funding and access confusion \u2014 treat as one trust thread, not a separate reviews problem.\u2019 That sentence is the entire pitch.", s: 9.5 },
          ]],
        ["Positive signal to protect",
          "Where applicable, a green-outlined box at the bottom of a channel highlighting a strength. App Store: \u2018Openbank U.S. at 4.1 with 1.8K ratings \u2014 materially stronger than Trustpilot / Play; lead recovery work, not panic.\u2019 The phrase \u2018lead recovery work, not panic\u2019 is a deliberate management cue."],
      ]
    ),

    h3("How to demo this component (60 seconds)"),
    calloutBox(
      "Demo script",
      "\u201CThis is not a social listening tool \u2014 there are good ones already. This is the layer that joins the world\u2019s voice to your contact center\u2019s voice. Trustpilot says one thing; the App Store says the opposite; Reddit says a third thing. The Echo Box at the bottom of each channel synthesises external signal, internal echo, and a business read. The line \u2018public pain matches internal first-funding and access confusion \u2014 treat as one trust thread, not a separate reviews problem\u2019 is what makes this different from a social tool. It tells the social team and the contact center they are looking at the same problem.\u201D"
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   THE FAQ
   ─────────────────────────────────────────────────────────────────── */

function faq() {
  return [
    h1("The fifteen hardest questions \u2014 and your prepared answers"),
    p("These are the questions an experienced banking advisor, founder, or buyer will ask. Read all fifteen. Memorise the first five. The rest, read once and trust your preparation.", { size: 10, after: 200 }),

    threeColTable([
      ["The architecture question",
        "\u201CWhat is the AI stack? Is this an LLM wrapper?\u201D",
        "\u201CIt is not an LLM wrapper. The core is three layers: classifiers for utterance-level intent and sentiment; a pattern engine that joins signals across customer ID, time, and channel; and an LLM at the top for summarisation only \u2014 never for decisions. Every model that touches a regulated output is documented to SR 11-7 standards. Happy to bring our AI architect on the next call.\u201D"],
      ["The buyer question",
        "\u201CWho buys this inside Openbank?\u201D",
        "\u201CTwo buying centres. Primary is SVP Customer Operations \u2014 owns contact center P&L, complaint operations. Co-sponsor is Chief Risk Officer or Head of Compliance \u2014 owns UDAAP, Reg E, CFPB exposure. The product earns dual funding because the same conversations serve both.\u201D"],
      ["The pricing question",
        "\u201CWhat does this cost?\u201D",
        "\u201CMid-size US digital bank: $250\u2013500K annual contract. We anchor on a sixty-day pilot at $75K on historical data \u2014 no production integration needed to prove value. That makes the pilot decision small enough to bypass full vendor risk.\u201D"],
      ["The procurement question",
        "\u201CHow long until I have something live?\u201D",
        "\u201CPilot deployment on 90 days of historical interaction data: sixty days from contract. Production integration: ninety days after pilot. SOC 2 Type II is in place; vendor risk packs are pre-built; US data residency and BYOK are standard.\u201D"],
      ["The regulator question",
        "\u201CWhat happens if this is examined?\u201D",
        "\u201CEvery model output is documented to SR 11-7 standards \u2014 model card, training data, validation, drift monitoring, retraining cadence. Every recommendation in the room is human-in-the-loop, not autonomous. We have a one-page MRM artefact ready for examination.\u201D"],
      ["The differentiation question",
        "\u201CWhy not NICE / Verint / CallMiner / Observe.AI / Gong?\u201D",
        "\u201CThree reasons, in order. One, cross-channel by default \u2014 they each lead with one channel; we built on the premise that the same customer story shows up in five. Two, recovery as a first-class surface \u2014 they tell you about problems, we tell you whether your fixes are working. Three, one substrate, two buyers \u2014 CX and risk are funded together because they share the same data layer.\u201D"],
      ["The accuracy question",
        "\u201CWhat is the false positive rate on arc detection?\u201D",
        "\u201CWe report confidence on every arc. Below 70% the surface labels it Watch and de-prioritises it. Above 80% it is dossier-ready. False-positive cost is bounded because the executive\u2019s default action on an arc is read or dismiss, not act. Acting only happens at the team level after the executive routes it.\u201D"],
      ["The PII question",
        "\u201CHow do you handle PII and GLBA?\u201D",
        "\u201CPII redaction happens at ingest before any utterance is persisted in our infrastructure. The bank keeps a key map. We hold only the redacted text and derived features. GLBA-compliant data handling is baked into the pipeline; SOC 2 Type II covers it.\u201D"],
      ["The data-out question",
        "\u201CWho owns the data and the models?\u201D",
        "\u201CThe bank owns its data and any derived features computed on its data. Bank-specific models trained on bank data are bank-owned at termination. Our base models are ours; tuning on bank data does not change ownership of that tuning artefact \u2014 it goes back with the bank.\u201D"],
      ["The integration question",
        "\u201CWhich contact center stacks do you support today?\u201D",
        "\u201CFirst-class connectors: Genesys Cloud CX, NICE CXone, Amazon Connect, Five9, Talkdesk. Salesforce Service Cloud and Pega for case management. For Openbank specifically, we expect Amazon Connect given Santander\u2019s cloud-native posture \u2014 we will validate on the next call.\u201D"],
      ["The trust question",
        "\u201CYou are a startup. Why should we trust this with our customers\u2019 data?\u201D",
        "\u201CSOC 2 Type II in place, FFIEC vendor pack ready, US-region data residency, BYOK encryption, cyber insurance to bank-standard limits. We are prepared for full third-party risk review and we built for that from day one. The data never leaves your region; we do not train on your data without explicit opt-in.\u201D"],
      ["The change-management question",
        "\u201CHow do my teams adopt this without disruption?\u201D",
        "\u201CIt sits alongside existing tools, it does not replace them. The contact center keeps using NICE for QA. The complaint team keeps using their case system. The product\u2019s job is to make the morning briefing legible to executives and the daily action layer legible to operators \u2014 not to rebuild the operational stack.\u201D"],
      ["The metrics question",
        "\u201CWhat measurable outcomes do you commit to in the pilot?\u201D",
        "\u201CRepeat contact rate reduction on a target arc, time-to-detect for a UDAAP-adjacent pattern, and CFPB complaint count reduction on the bank\u2019s top three pain themes. Specific numbers depend on the bank\u2019s baseline; we set them with you during pilot scoping.\u201D"],
      ["The scale question",
        "\u201CCan this handle our volume?\u201D",
        "\u201CWe process at the scale of mid-size US banks today. Throughput scales horizontally; latency on arc detection is sub-thirty-minutes at any volume tested. We can provide reference numbers from comparable deployments under NDA.\u201D"],
      ["The trap question",
        "\u201CYou are not different enough.\u201D",
        "\u201CThe test is simple. Open the Customer Pain Recovery view in any other tool and show me where it tracks whether the fix is working from the customer\u2019s voice. Open any incumbent and show me where one screen serves the CX leader and the Compliance officer from the same conversations. We have not found another tool that does either. We can do a side-by-side any time you want.\u201D"],
    ]),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   DEMO FLOWS
   ─────────────────────────────────────────────────────────────────── */

function demoFlows() {
  return [
    h1("Three demo flows \u2014 pick the right length for the room"),
    p("Use these as scripts. Time yourself once before the meeting. The scripts are written to be spoken, not read \u2014 each one carries deliberate pauses and a sequence of pointing actions.", { size: 10, after: 200 }),

    h2("The 90-second flow \u2014 elevator demo"),
    calloutBox(
      "Use this when",
      "You have one minute on a phone screen, or a senior person stopped you in a hallway. Cover the Signal Story and one card. Promise to come back with depth."
    ),
    spacer(8),
    rich([{ t: "Open on the Signal Story. Read out: ", s: 10 }, { t: "\u201CThis is the morning briefing. The system reads every conversation across every channel and writes one sentence \u2014 today\u2019s sentence is \u2018first funding is the trust break.\u2019 The five-node trail underneath shows the same customer pain travelling from account activity into voice, chat, tickets, and risk language. We surface UDAAP-adjacent patterns thirty minutes after they form, not thirty days after a complaint is filed.\u201D", i: true, s: 10 }], { after: 200 }),

    h2("The 7-minute flow \u2014 investor or founder demo"),
    calloutBox(
      "Use this when",
      "You have seven minutes with a person who is technical or financially literate but not a deep banking specialist. Cover four components."
    ),
    spacer(8),
    twoColTable([
      ["0:00 \u2013 1:30  Signal Story",
        "Open with the arc. Point at the trail. Read \u201C214 contacts, 43 past promise, 18 closure-intent signals.\u201D Use the word \u2018join\u2019 \u2014 nobody currently joins these five systems; we do."],
      ["1:30 \u2013 3:00  Channel Constellation",
        "Verify with the numbers. Voice 55%, +18% week over week, 47% repeat. Read the customer phrase aloud: \u2018I need to know when this clears.\u2019 The phrase is what makes this intelligence, not metrics."],
      ["3:00 \u2013 4:30  Best Call / Worst Call",
        "This is the surface that replaces the three hours an executive spends listening to calls. Three excellence patterns to replicate, three failure patterns to fix \u2014 at the workflow level, not the agent level. \u201848 similar calls\u2019 is what makes it a pattern, not an anecdote."],
      ["4:30 \u2013 6:00  Customer Pain Recovery",
        "The \u2018then what\u2019 loop. Every dashboard shows problems; this one shows whether the fixes are working. The No Movement card on funds availability is on the page because the most credibility-earning move we have is to say nothing improved."],
      ["6:00 \u2013 7:00  Risk Signal Layer",
        "Close on the second buying centre. UDAAP-adjacent, Reg E clock, vulnerable-customer cues \u2014 surfaced thirty minutes after the call. The same substrate that powers CX powers risk; one purchase serves both."],
    ], "Time", "What to do"),

    h2("The 15-minute flow \u2014 advisory or buyer demo"),
    calloutBox(
      "Use this when",
      "You have a banking advisor or a Head of Customer Operations / Chief Compliance Officer in the room. Cover everything in depth, leave time for two rounds of questions."
    ),
    spacer(8),
    twoColTable([
      ["0:00 \u2013 2:00  Frame",
        "Open with the one-sentence product. Note Swati told us \u2018dashboards are dime a dozen, insight is not.\u2019 Note this product replaces the three hours a month an executive spends listening to calls. Use the line: \u2018thirty minutes after they happen, not when the regulator calls.\u2019"],
      ["2:00 \u2013 4:00  Signal Story",
        "Walk the arc. Switch arcs once using the rail to show the surface is dynamic. Point at the confidence score and the signal trail. Use the word \u2018join.\u2019"],
      ["4:00 \u2013 5:30  Channel Constellation",
        "Volume, week over week, repeat rate, sentiment, owner. Read three customer phrases aloud. Pause on 47% repeat. Say: \u2018Repeat contact is the leading indicator of complaint risk.\u2019"],
      ["5:30 \u2013 7:30  Best Call / Worst Call",
        "Spend the most time here. This is Swati\u2019s explicit ask. Hold the framing rule: pattern, not person. The \u201848 similar calls\u2019 number is what to point at."],
      ["7:30 \u2013 10:00  Customer Pain Recovery",
        "Walk one card end-to-end. Read \u2018observed recovery signal\u2019 and \u2018not workflow-confirmed\u2019 aloud. Use the line: \u2018the most credibility-earning move we have is to say nothing improved.\u2019 Open the No Movement card last."],
      ["10:00 \u2013 12:30  Risk Signal Layer",
        "Walk the four exposure cards. Use the careful language: \u2018we surface patterns for the Compliance team to review.\u2019 Read the regulatory urgency chips. Close with the escalation queue."],
      ["12:30 \u2013 14:00  Public Voice Wall",
        "One channel only \u2014 Trustpilot or BBB. Read the Echo Box aloud, especially the business read. Use the line: \u2018public pain matches internal first-funding and access confusion \u2014 treat as one trust thread.\u2019"],
      ["14:00 \u2013 15:00  Close",
        "Three differentiators in order: cross-channel by default; recovery as a first-class surface; one substrate, two buyers. End on the pricing anchor: $75K, sixty-day pilot, historical data, no production integration needed to prove value. Ask: \u2018what would need to be true for you to introduce us to your operations head?\u2019"],
    ], "Time", "What to do"),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   ACRONYM GLOSSARY
   ─────────────────────────────────────────────────────────────────── */

function glossary() {
  return [
    h1("Acronym glossary"),
    p("If you blank on any of these, the room will register it instantly. Read once carefully; revisit on the plane.", { size: 10, after: 200 }),

    twoColTable([
      ["AHT", "Average Handle Time \u2014 average duration of a customer-service contact. Operational efficiency metric. We do not measure AHT; we measure customer outcomes. Mention only if asked."],
      ["BBB", "Better Business Bureau. US non-profit that publishes business profiles and aggregates consumer complaints. Regulator-adjacent because BBB filings often precede CFPB filings."],
      ["BYOK", "Bring Your Own Key. Encryption pattern where the bank holds the encryption keys, not the vendor. Required by most US bank vendor risk reviews. We support it."],
      ["CCPA / CPRA", "California Consumer Privacy Act / Privacy Rights Act. State-level consumer privacy regulation that applies to any company handling Californian residents\u2019 data. Standard for any US deployment."],
      ["CFPB", "Consumer Financial Protection Bureau. US federal regulator for consumer financial products. Enforces UDAAP, Reg E, Reg Z, and others. The 15-day / 60-day complaint clock is theirs."],
      ["CSAT", "Customer Satisfaction. Survey-based metric. Banks have CSAT today; we do not replicate it; we measure conversation-level sentiment which is leading, not lagging."],
      ["FDCPA", "Fair Debt Collection Practices Act. Governs collection conduct including by third parties on the bank\u2019s behalf. Our component flags collection-pressure language patterns."],
      ["FFIEC", "Federal Financial Institutions Examination Council. Coordinated supervision body for US banks. FFIEC IT examination handbook governs vendor risk. We have an FFIEC-aligned vendor pack."],
      ["GLBA", "Gramm-Leach-Bliley Act. Governs how financial institutions handle customers\u2019 non-public personal information. We are GLBA-compliant in data handling."],
      ["HYSA", "High-Yield Savings Account. Openbank\u2019s product is a HYSA. Use the term naturally; do not spell it out unless asked."],
      ["MRM / SR 11-7", "Model Risk Management. OCC supervisory letter SR 11-7 is the canonical guidance. Every model touching regulated decisions must be documented to SR 11-7 standards \u2014 model card, training data, validation, drift monitoring."],
      ["OCC", "Office of the Comptroller of the Currency. Federal regulator for US national banks. Issues SR letters and enforcement actions."],
      ["OTP", "One-Time Passcode. Authentication factor sent by SMS or push. Openbank\u2019s recovery flow depends on it; trusted-device loops are caused by OTP failures."],
      ["Reg E", "Regulation E. CFPB regulation governing electronic fund transfer error resolution. 10-business-day investigation clock (extendable to 45). We flag patterns; we do not adjudicate."],
      ["Reg Z", "Regulation Z. Truth in Lending Act regulation. Relevant for credit products. Openbank does not currently offer lending; do not introduce Reg Z unprompted."],
      ["SOC 2 Type II", "Service Organization Control 2, Type II. The standard third-party security and availability attestation US banks require from vendors. We hold a current Type II report."],
      ["UDAAP", "Unfair, Deceptive, or Abusive Acts or Practices. CFPB umbrella authority. We surface UDAAP-adjacent language patterns. We do not determine violations \u2014 only the bank and the regulator can."],
      ["WoW", "Week over Week. Standard time-series comparison; visible on most cards. Read \u2018wow\u2019 or \u2018W-O-W\u2019 as the room prefers."],
    ]),
    spacer(20),
    rule(),
    p("End of playbook.", { size: 9.5, italic: true, color: C.inkSoft, align: AlignmentType.CENTER }),
    p("Read it once. Practise the \u201Cwhat to say out loud\u201D column. Walk into the room.", { size: 9.5, italic: true, color: C.inkSoft, align: AlignmentType.CENTER }),
  ];
}

/* ───────────────────────────────────────────────────────────────────
   BUILD
   ─────────────────────────────────────────────────────────────────── */

const doc = new Document({
  creator: "Fluid CX",
  title: "Openbank CX Signal Room \u2014 Demo Playbook",
  description: "Component-by-component explainer",
  styles: {
    default: {
      document: { run: { font: FONT, size: sz(10), color: C.ink } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: sz(20), bold: true, color: C.ink, font: FONT_DISPLAY },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: sz(14), bold: true, color: C.ink, font: FONT_DISPLAY },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: sz(11.5), bold: true, color: C.ink, font: FONT_DISPLAY },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 0 },
          tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 1 } },
          children: [
            new TextRun({ text: "FLUID CX", bold: true, size: sz(8), color: C.accent, font: FONT, characterSpacing: 40 }),
            new TextRun({ text: "  \u00b7  OPENBANK U.S. SIGNAL ROOM \u00b7 DEMO PLAYBOOK", size: sz(8), color: C.inkMute, font: FONT, characterSpacing: 40 }),
            new TextRun({ text: "\t", size: sz(8) }),
            new TextRun({ text: "Internal — for founder & advisor briefing", size: sz(8), color: C.inkMute, font: FONT, italics: true }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 4 } },
          children: [
            new TextRun({ text: "Playbook v1 \u00b7 ", size: sz(8), color: C.inkMute, font: FONT }),
            new TextRun({ text: "read once, practise once, walk in.", italics: true, size: sz(8), color: C.inkMute, font: FONT }),
            new TextRun({ text: "\t", size: sz(8) }),
            new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], size: sz(8), color: C.inkMute, font: FONT }),
          ],
        })],
      }),
    },
    children: [
      ...cover(),
      ...foundation(),
      ...compSignalStory(),
      ...compConstellation(),
      ...compCalls(),
      ...compRecovery(),
      ...compRisk(),
      ...compPublicVoice(),
      ...faq(),
      ...demoFlows(),
      ...glossary(),
    ],
  }],
});

const outPath = path.join(__dirname, "OpenbankCX_DemoPlaybook.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log(`OK: built ${outPath}`);
});
