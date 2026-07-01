import { useId } from "react";

export function useUniqueGradientId(prefix: string): string {
  const id = useId();
  return `grad-${prefix}-${id.replace(/:/g, "")}`;
}
