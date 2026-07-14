import { space } from "../../theme/tokens";

/** Major section gap between headline, KPI row, chart rows — matches CX V3 drill screens. */
export const PAGE_SECTION_GAP = space["5"];

/** Grid gap between paired charts / panels — reference mock uses 18px. */
export const DETAIL_GAP = "18px";

/** Profitability drill — AI / drivers mid; bridge / scorecard bottom. */
export const PROFITABILITY_ROW_TOP = "minmax(0, 1.85fr) minmax(0, 1fr)";
export const PROFITABILITY_ROW_MID = "minmax(0, 1fr) minmax(0, 1.15fr)";
export const PROFITABILITY_ROW_BOTTOM = "minmax(0, 1fr) minmax(0, 1.1fr)";

/** @deprecated Use PROFITABILITY_ROW_* per row */
export const PROFITABILITY_GRID_COLUMNS = PROFITABILITY_ROW_TOP;

/** Fixed chart panel height for aligned 2-col rows. */
export const CHART_PANEL_HEIGHT = 248;

/** Inner Recharts area inside ChartPanel. */
export const CHART_INNER_HEIGHT = 200;
