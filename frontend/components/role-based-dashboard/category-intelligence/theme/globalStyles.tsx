// theme/globalStyles.tsx — single global @keyframes module (Pass 1).

import React from "react";

import { type } from "./tokens";

const CSS = `
.lisn-cat-shell *, .lisn-cat-shell *::before, .lisn-cat-shell *::after { box-sizing: border-box; }
.lisn-cat-shell {
  font-family: ${type.family};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: var(--lisn-cat-text-primary);
  background: var(--lisn-cat-bg);
}
.lisn-cat-shell .lisn-cat-num {
  font-family: var(--lisn-cat-font-numeric);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1, 'cv01' 1;
}

.lisn-cat-shell :focus-visible {
  outline: 2px solid var(--lisn-cat-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

.lisn-cat-shell ::-webkit-scrollbar { width: 10px; height: 10px; }
.lisn-cat-shell ::-webkit-scrollbar-thumb {
  background: var(--lisn-cat-border-strong);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.lisn-cat-shell ::-webkit-scrollbar-track { background: transparent; }

@keyframes lisn-cat-drill-in {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes lisn-cat-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lisn-cat-scale-in {
  from { opacity: 0; transform: scale(0.98); }
  to   { opacity: 1; transform: scale(1); }
}
.lisn-cat-anim-drill { animation: lisn-cat-drill-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.lisn-cat-anim-fade  { animation: lisn-cat-fade-in 220ms ease both; }
.lisn-cat-anim-scale { animation: lisn-cat-scale-in 180ms ease both; }

@media (prefers-reduced-motion: reduce) {
  .lisn-cat-shell *, .lisn-cat-anim-drill, .lisn-cat-anim-fade, .lisn-cat-anim-scale {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

export function GlobalStyles(): React.ReactElement {
  return <style data-lisn-cat-global>{CSS}</style>;
}
