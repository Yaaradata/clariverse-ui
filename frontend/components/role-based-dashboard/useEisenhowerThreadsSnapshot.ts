"use client";

import { useEffect, useState } from "react";
import { getEisenhowerThreads, type EisenhowerThread } from "@/lib/api";

export function useEisenhowerThreadsSnapshot(enabled: boolean): EisenhowerThread[] {
  const [threads, setThreads] = useState<EisenhowerThread[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getEisenhowerThreads().then((t) => {
      if (!cancelled) setThreads(t);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return threads;
}
