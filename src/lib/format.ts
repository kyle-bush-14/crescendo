/** 1_234_567 -> "1.2M", 12_300 -> "12.3K", 950 -> "950". */
export function formatListeners(n: number): string {
  if (n >= 1_000_000) {
    return `${trim(n / 1_000_000)}M`;
  }
  if (n >= 1_000) {
    return `${trim(n / 1_000)}K`;
  }
  return `${n}`;
}

/** "monthly listeners" with the full comma-grouped number, for hover cards. */
export function formatListenersLong(n: number): string {
  return n.toLocaleString("en-US");
}

function trim(v: number): string {
  // One decimal, but drop a trailing ".0".
  return v.toFixed(1).replace(/\.0$/, "");
}
