/**
 * checks.ts — development-only runtime guards over the copied mock (05a §6 subset).
 * The full generator check suite (19 / 19) lives with the pack's check_mock.py.
 * Called once from KgsCommercialFireDashboard when NODE_ENV !== 'production'.
 */
import { channel, exec, installedBase, meta, monitor } from "./lib/data";

let ran = false;

function assert(ok: boolean, msg: string) {
  console.assert(ok, `[kgs checks] ${msg}`);
}

const BANNED = [
  /resolv/i,
  /\broot cause\b/i,
  /sentiment/i,
  /churn/i,
  /predict/i,
  /real-time/i,
  /\bLisN\b|\bLisn\b|\bLISN\b/,
  /\bindex\b/i,
  /crossed a threshold this week/i,
  /!/,
  /\bFCI\b/,
  /conversation ai/i,
  /\bCSAT\b|\bNPS\b/,
  /\bcheap\b/i,
  /300K/i,
];

function strings(o: unknown, out: string[] = []): string[] {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) for (const v of o) strings(v, out);
  else if (o && typeof o === "object")
    for (const v of Object.values(o)) strings(v, out);
  return out;
}

export function runKgsChecks(): void {
  if (ran) return;
  ran = true;

  // 1 · volumes
  const weekly = meta.weeklyInteractions.reduce((a, b) => a + b, 0);
  assert(
    weekly === exec.funnel.interactions,
    `weekly interactions sum ${weekly} ≠ funnel ${exec.funnel.interactions}`,
  );

  // 2 · funnel + unit costs
  const suppressed = exec.funnel.suppressedReasons.reduce(
    (a, r) => a + r.count,
    0,
  );
  assert(
    suppressed === exec.funnel.suppressed,
    `suppressed reasons ${suppressed} ≠ ${exec.funnel.suppressed}`,
  );
  const unit = exec.unitCosts.breakdown.reduce((a, b) => a + b.usd, 0);
  assert(
    unit === exec.unitCosts.excessFaultContactUsd,
    `unit cost breakdown ${unit} ≠ ${exec.unitCosts.excessFaultContactUsd}`,
  );

  // 4 · card counts = signals above threshold per question; Σ = funnel
  let total = 0;
  for (const card of exec.questionCards) {
    const n = monitor.signals.filter(
      (s) => s.aboveThreshold && s.question === card.id,
    ).length;
    assert(
      n === card.count,
      `question ${card.id}: count ${card.count} ≠ ${n} signals above threshold`,
    );
    assert(
      !("index" in card) && !("score" in card),
      `question ${card.id} carries an index/score field`,
    );
    total += card.count;
  }
  assert(
    total === exec.funnel.aboveThreshold,
    `Σ question counts ${total} ≠ ${exec.funnel.aboveThreshold}`,
  );

  // 7 · monitor cards reference real signals in rank order
  monitor.cards.forEach((c, i) => {
    assert(
      c.rank === i + 1,
      `monitor card ${c.signalId} rank ${c.rank} out of order`,
    );
    assert(
      monitor.signals.some((s) => s.id === c.signalId),
      `monitor card ${c.signalId} has no signal`,
    );
  });

  // 9 · banned strings; no string mixes $ and £
  for (const s of strings([exec, monitor, meta])) {
    if (s === exec.neverOnScreen || s === exec.howWeCount.footer) continue;
    for (const re of BANNED)
      assert(!re.test(s), `banned ${re} in "${s.slice(0, 80)}"`);
    assert(
      !(s.includes("$") && s.includes("£")),
      `USD and GBP in one string: "${s.slice(0, 80)}"`,
    );
  }

  // 10 · governed watch times are fixed data, never computed
  const [w1, w2] = exec.governedWatch.items;
  assert(w1.routedAt === "2026-09-06T14:38:00Z", "W-1 routed time");
  assert(w2.clock?.elapsedLabel === "8h 46m", "W-2 clock label");

  // 00 §7 fixed figures: display text must agree with the series behind it
  const pt = channel.partnerTimeline;
  const friction = pt.friction.slice(20, 26).reduce((a, b) => a + b, 0);
  const baseline = pt.baseline.slice(20, 26).reduce((a, b) => a + b, 0);
  assert(
    friction === 40 && baseline === 13,
    `ESD-SE-07 W21–W26 friction ${friction} vs baseline ${baseline} ≠ 40 vs 13`,
  );
  assert(
    (friction / baseline).toFixed(1) === "3.1" &&
      channel.league[0].cells[3] === "3.1×",
    "ESD-SE-07 friction ratio ≠ 3.1×",
  );
  const houston = channel.switching.find((r) => r.id === "sw-houston");
  assert(
    houston?.cells[2] === "11 vs 3 (3.7×)" && (11 / 3).toFixed(1) === "3.7",
    "Houston switching ≠ 11 vs 3 (3.7×)",
  );
  const cr = installedBase.contactsVsRma;
  const fw41 = cr.fw41.reduce((a, b) => a + b, 0);
  const trouble = cr.trouble
    .filter((_, i) => cr.fw41[i] > 0)
    .reduce((a, b) => a + b, 0);
  assert(
    fw41 === 23 &&
      Math.round((fw41 / trouble) * 100) === 2 &&
      cr.caption.includes("about 2%"),
    `P-F: ${fw41} of ${trouble} ≠ "about 2%"`,
  );
  const lapsing = channel.kpis.find((k) =>
    k.label.startsWith("CERTIFICATIONS LAPSING"),
  );
  assert(lapsing?.value === "186", "Q2 certifications lapsing ≠ 186");
}
