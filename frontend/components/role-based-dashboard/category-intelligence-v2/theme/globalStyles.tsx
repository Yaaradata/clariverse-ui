import React from "react";
import { type } from "./tokens";

const CSS = `
.lisn-shell *, .lisn-shell *::before, .lisn-shell *::after { box-sizing: border-box; }
.lisn-shell {
  font-family: ${type.family};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: var(--lisn-text-primary);
  background: var(--lisn-bg);
}
.lisn-shell .lisn-num {
  font-family: var(--lisn-font-numeric);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1, 'cv01' 1;
}
.lisn-shell :focus-visible {
  outline: 2px solid var(--lisn-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.lisn-shell ::-webkit-scrollbar { width: 10px; height: 10px; }
.lisn-shell ::-webkit-scrollbar-thumb {
  background: var(--lisn-border-strong);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.lisn-shell ::-webkit-scrollbar-track { background: transparent; }
@keyframes lisn-drill-in {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes lisn-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lisn-scale-in {
  from { opacity: 0; transform: scale(0.98); }
  to   { opacity: 1; transform: scale(1); }
}
.lisn-anim-drill { animation: lisn-drill-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.lisn-anim-fade  { animation: lisn-fade-in 220ms ease both; }
.lisn-anim-scale { animation: lisn-scale-in 180ms ease both; }
@media (prefers-reduced-motion: reduce) {
  .lisn-shell *, .lisn-anim-drill, .lisn-anim-fade, .lisn-anim-scale {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

export function GlobalStyles(): React.ReactElement {
  return <style data-lisn-global>{CSS}</style>;
}
