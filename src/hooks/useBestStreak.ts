import { useCallback, useState } from "react";

const STORAGE_KEY = "crescendo:bestStreak";

function readBest(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function useBestStreak() {
  const [bestStreak, setBestStreak] = useState<number>(readBest);

  /** Records a finished run. Returns true if it set a new personal best. */
  const commitStreak = useCallback(
    (streak: number): boolean => {
      if (streak <= bestStreak) return false;
      setBestStreak(streak);
      try {
        localStorage.setItem(STORAGE_KEY, String(streak));
      } catch {
        // Ignore storage failures (private mode, etc.) — game still works.
      }
      return true;
    },
    [bestStreak],
  );

  return { bestStreak, commitStreak };
}
