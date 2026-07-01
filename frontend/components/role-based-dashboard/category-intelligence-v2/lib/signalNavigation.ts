import type { CategorySignalView } from "./seedData";
import type { DrillRouteKind, ScreenId } from "./routes";

export function resolveSignalNavigation(signal: CategorySignalView): {
  screenId: ScreenId;
  drill: { kind: DrillRouteKind; itemId: string };
} {
  return {
    screenId: signal.screenId,
    drill: { kind: signal.drillKind, itemId: signal.signalId },
  };
}
