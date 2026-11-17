# Swedbank pulse v1: decision log

Clone of `natwest-pulse/v1` (SW-D01). Persona: Head of Customer Experience, Swedish Banking. Scope: Swedbank Sweden,
private customers. Window 22 Oct – 17 Nov 2026, freeze 17 Nov 2026 07:45 CET. Brief: `docs/swedbank/kickoff_prompt.md`.
Every NatWest rule (HL-01..HL-34, NW-D91..NW-D100, `docs/demo-rebuild/MORNING_DECISIONS.md`) applies unless overridden here.

- **SW-D01 · Copy.** `app/natwest-pulse` → `app/swedbank-pulse`, `components/`, `lib/`, `scripts/natwest_pulse` →
  `scripts/swedbank_pulse`, `data/out|seed/natwest_pulse` → `swedbank_pulse`, `data/public/natwest_{config,register}` →
  `swedbank_*`, `scripts/natwest_routes.py` → `swedbank_routes.py`, `lint_natwest.py` → `lint_swedbank.py`. Paths and the
  loader constant only; 86/86 routes 200 on the copied NatWest data. `data/raw/swedbank/` and
  `data/out/swedbank_pulse/work/` are gitignored like NatWest's.
- **SW-D02 · Header, footer, scope.** Header `Swedbank · Customer Pulse · 17 Nov 2026 07:45 CET`; page title
  `LisN · Swedbank`; role heading Head of Customer Experience. Footer scope line as in the brief. Kronor as `kr`, no
  decimals. Dates `17 Nov`.
- **SW-D03 · Windows and time.** Morning brief · Last 7 days · Last 14 days · Full window. The 30-day slot is renamed, not
  removed (id `14d`, 14 days). The pipeline holds every time in UTC (its code compares ISO strings), so the freeze is
  `2026-11-17T06:45:00+00:00`; the screens convert to Europe/Stockholm (`format.ts` `toLocal`). Calendar-day buckets for
  public items use the item's UTC date (at most one hour from the Swedish date at midnight). Swedish public holidays
  replace the England and Wales list.
