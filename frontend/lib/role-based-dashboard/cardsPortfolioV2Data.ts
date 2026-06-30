/** AI Analyst starter prompts — transactions & blockers only (from scripts/card-portfolio use cases). */
export const CARDS_PORTFOLIO_V2_AI_ANALYST_QUESTIONS: string[] = [
  "Which decline clusters are curable today — and how much GMV is recoverable?",
  "Which offers are subsidising existing spend with near-zero incremental lift?",
  "Which spend categories are reward-negative after MDR, interchange and fraud?",
  "Where is brand or co-brand profitable spend drifting below baseline?",
  "Why did approval drop after a fraud-rule or step-up change — who is being blocked?",
  "Is today's decline spike a token/CoFT or processor issue, not customer behaviour?",
  "Which activation batch is near the RBI 30+7 closure clock?",
  "Which utilisation or roll signals are advisory only vs need Risk review?",
];

export const CARDS_PORTFOLIO_V2_AI_ANALYST_SUBTITLE =
  "Transaction & blocker intelligence for your card portfolio";

const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

/** Mock AI Analyst answers aligned with Cards Portfolio Manager v2 dashboard signals. */
export async function generateCardsPortfolioV2AIResponse(
  userMessage: string,
): Promise<string> {
  await delay();
  const m = userMessage.toLowerCase();

  if (m.includes("curable") || (m.includes("decline") && m.includes("recoverable"))) {
    return (
      `**Curable decline clusters today**\n\n` +
      `🔴 **62% of today's decline spike is curable** · **₹2.4 Cr / day (at-risk run-rate) GMV recoverable** before the next working session\n\n` +
      `**Top 3 recoverable clusters** (ranked by ₹ at risk × recovery propensity):\n` +
      `1. **Tokenised CNP · Premium CNP** — authentication step-up / token path · **₹2.4 Cr / day (at-risk run-rate)** · 14 pt approval gap since 11:00 · Owner: Payments & Authorisation\n` +
      `2. **Insufficient-funds soft declines · Cashback Plus** — salary-cycle bulge suppressed · **₹38 L / day (at-risk run-rate)** · limit/EMI nudge eligible · Owner: Product\n` +
      `3. **3-DS challenge timeouts · Travel co-brand** — route latency, not fraud · **₹22 L / day (at-risk run-rate)** · retry + step-up tuning · Owner: Payments & Authorisation\n\n` +
      `**Structural (not curable today)**: fraud-rule R-77 blocks on tenured BINs — needs rule review, not a customer nudge.\n\n` +
      `**Recommended action**: Open ACS/token incident for cluster #1; draft recovery nudge for eligible soft-decline cohort only (RBI consent-compliant).`
    );
  }

  if (m.includes("offer") && (m.includes("subsidis") || m.includes("incremental") || m.includes("zero"))) {
    return (
      `**Offers subsidising existing spend**\n\n` +
      `🔴 **2 offers flagged as net-negative on incrementality** · **₹1.3 Cr MTD reallocatable** this week\n\n` +
      `**Kill / pause now**:\n` +
      `• **O-142 Cashback** — 82% redemption but only **+2% vs matched control** · **₹78 L MTD leakage** on grocery, wallet-load, recharge · Recommendation: pause wave 2 or narrow to lapsing low-frequency users\n` +
      `• **Grocery 2%** — healthy redemption masking near-zero lift on existing heavy grocery spend · **₹19 L MTD** run-rate leak\n\n` +
      `**Retarget, don't kill**:\n` +
      `• **Fuel Friday** — ~50% incremental on new fuel cohort; leaks on existing heavy users · cap to first-spend band\n\n` +
      `**Protect**:\n` +
      `• **Premium dining 5×** — clearly incremental in target premium cohort · keep\n\n` +
      `**Owner**: Head of Cards — Marketing · LiSN draft: pause O-142 wave 2 and reallocate ₹78 L MTD to incremental dining offer.`
    );
  }

  if (m.includes("reward-negative") || (m.includes("mdr") && m.includes("fraud"))) {
    return (
      `**Reward-negative spend categories**\n\n` +
      `🔴 **2 MCC bands crossed net-negative** after the earn-rate change · **₹2.5 Cr MTD combined net strain** (interchange − reward − fraud)\n\n` +
      `**Categories**:\n` +
      `1. **Wallet-load MCCs** — interchange **₹3.0 Cr MTD** vs reward **₹4.2 Cr MTD** + fraud **₹0.6 Cr MTD** · **net −₹1.8 Cr MTD** on ₹86 Cr MTD spend (~3.5% interchange, 4.9% reward)\n` +
      `2. **Fuel-adjacent MCCs** — interchange **₹1.7 Cr MTD** vs reward **₹2.1 Cr MTD** + fraud **₹0.3 Cr MTD** · **net −₹0.7 Cr MTD** on ₹61 Cr MTD spend\n\n` +
      `**Recommended action**:\n` +
      `1. Cap or exclude the 2 MCC bands from accelerated earn\n` +
      `2. Re-tier earn by MDR band in rewards engine\n` +
      `3. Brief Finance on run-rate · Owner: Finance — Card P&L`
    );
  }

  if (m.includes("brand") || m.includes("co-brand") || m.includes("drifting") || m.includes("baseline")) {
    return (
      `**Brand / co-brand profitable spend drift**\n\n` +
      `📉 **Gross GMV flat (+0.2% WoW) but profitable retained spend is slipping on 2 segments**\n\n` +
      `**Below baseline — act**:\n` +
      `• **Premium Travel** — profitable spend **−6.4%** vs flat GMV · top-of-wallet slipping · status: Watch\n` +
      `• **Fuel Co-brand** — GMV +3.2% but profitability score **52/100** · retarget needed · reward-heavy mix shift\n\n` +
      `**Healthy**:\n` +
      `• **Cashback Plus** — spend **+8.4%** · profitability **71/100** · growth concentrated but economics hold\n` +
      `• **Business** — +1.1% GMV · profitability 64 · stable\n\n` +
      `**Tier read**: H1 ₹1L+ spend cohort profitable-share down **2.6 pts** over 6 weeks while H3 mass tier holds.\n\n` +
      `**Recommended action**: Benefit / engagement review on Premium Travel; targeted top-of-wallet nudge · Owner: Head of Cards`
    );
  }

  if (m.includes("fraud-rule") || m.includes("step-up") || m.includes("approval drop") || m.includes("r-77")) {
    return (
      `**Fraud-rule / step-up approval drop**\n\n` +
      `🔴 **Fraud Rule R-77 misfire** · Approval **94% → 81%** (−13 pts) since parameter change at **11:00**\n\n` +
      `**Who is being blocked**:\n` +
      `• **3+ year tenured customers** on travel & premium BINs — **90% low-risk** score band\n` +
      `• Good-customer blocks **+210%** vs baseline · genuine fraud blocks flat\n` +
      `• **Not** a network outage — isolated to post-rule-change window\n\n` +
      `**Evidence**:\n` +
      `✓ Approval step-change aligns to R-77 edit timestamp\n` +
      `✓ Decline reason codes skew to issuer risk rule, not merchant or token\n` +
      `✓ No matching fraud-outbreak signature in MCC fraud-loss feed\n\n` +
      `**Recommended action**: Roll-back review for R-77 · route complex cases in-house · Owner: Fraud (immediate)`
    );
  }

  if (m.includes("token") || m.includes("coft") || m.includes("processor") || (m.includes("decline spike") && m.includes("customer"))) {
    return (
      `**Token / CoFT vs customer-behaviour verdict**\n\n` +
      `🔴 **Today's spike is a token/ACS issue — not customer behaviour**\n\n` +
      `**Signal**:\n` +
      `• **Tokenised CNP approval gap: 14 pts** on Premium CNP since **11:00**\n` +
      `• **Non-tokenised CNP remains within baseline** — same merchants, same cohort\n` +
      `• Technical decline codes elevated on token-provisioning / ACS route after config window\n` +
      `• **₹2.4 Cr / day (at-risk run-rate)** · **62% curable** via token re-provision + retry flow\n\n` +
      `**Ruled out**:\n` +
      `• Processor-wide outage — other routes normal\n` +
      `• Merchant payload batch — CP path unaffected\n` +
      `• Campaign-driven spend surge — volume flat, approval collapsed\n\n` +
      `**Recommended action**: Open ACS/token incident · check 3DS / CoFT config · Owner: Payments & Authorisation (immediate)`
    );
  }

  if (m.includes("activation") || m.includes("30+7") || m.includes("closure clock") || m.includes("batch")) {
    return (
      `**Activation batch — RBI 30+7 closure clock**\n\n` +
      `🟠 **Batch #4471** · **D27** · **6.2K cards** at risk · **₹93 L (CAC, one-time)** stranded if closure fires\n\n` +
      `**Trajectory**:\n` +
      `• Activation curve tracking **11 pts below** sourcing-channel baseline\n` +
      `• Projected closure line: **day 37** (30+7 RBI unactivated-card mandate)\n` +
      `• Friction driver: digital KYC re-prompt on first CNP spend, not acquisition drop-off\n\n` +
      `**Cohort context**: Cashback Plus sourcing wave · conduct obligation clock running\n\n` +
      `**Recommended action**:\n` +
      `1. Start activation rescue on Batch #4471 today\n` +
      `2. Surface closure countdown to Product / Conduct desk\n` +
      `3. Fix first-spend friction path · Owner: Product / Conduct (high)`
    );
  }

  if (m.includes("utilisation") || m.includes("roll") || m.includes("advisory")) {
    return (
      `**Utilisation & roll signals — advisory vs action**\n\n` +
      `**Needs Risk review (not auto-treatment)**:\n` +
      `• **Utilisation migration surge** — **80%+ band crossing 1.8×** on Sourcing Q2 cohort · early stress signal · Owner: Risk · Status: watch\n\n` +
      `**Advisory only — do not trigger customer treatment**:\n` +
      `• **Roll Q2-24 early inflection** — projected **+9 bps** roll before billing-cycle close · Sourcing Q2 · route to EWS / model-risk review only\n` +
      `• No individual account action recommended · cohort-level advisory\n\n` +
      `**Stable / no action**:\n` +
      `• <40% utilisation band — stable vs baseline\n` +
      `• 40–60% band — +4% migration, within seasonal band\n\n` +
      `**Rule**: LiSN labels roll/util signals **advisory** until EWS confirms — never auto-fire limit or collections treatment from this monitor.`
    );
  }

  return (
    `**Cards Portfolio Manager — transaction & blocker posture**\n\n` +
    `📊 **Today's read** (transaction-only):\n` +
    `• Approval rate: **81%** (−13 pts) · Decline spike **+38%** since 11:00\n` +
    `• **62% curable** · **₹2.4 Cr / day (at-risk run-rate)** recoverable on tokenised CNP path\n` +
    `• Offer O-142 leaking **₹78 L MTD** · 2 reward-negative MCC bands (**₹2.5 Cr MTD** net strain)\n` +
    `• Fraud Rule R-77 stepped approval down · Batch #4471 at D27 (**₹93 L (CAC, one-time)** at risk)\n\n` +
    `**Top 3 actions before EOD**:\n` +
    `1. Open ACS/token incident — tokenised CNP gap (Payments & Authorisation)\n` +
    `2. Roll-back review — Fraud Rule R-77 (Fraud)\n` +
    `3. Pause O-142 wave 2 — non-incremental cashback (Marketing)\n\n` +
    `**Ask me about** curable declines, offer incrementality, reward-negative categories, brand drift, fraud-rule blocks, token/CoFT attribution, activation clocks, or roll/util advisories.`
  );
}
