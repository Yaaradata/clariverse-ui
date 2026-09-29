/**
 * checks.ts — development-only runtime guards over the copied mock (05a §6 subset).
 * The full generator check suite (19 / 19) lives with the pack's check_mock.py.
 * Called once from KgsCommercialFireDashboard when NODE_ENV !== 'production'.
 */
import { exec, meta, monitor } from "./lib/data";

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
}
